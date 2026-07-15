#!/usr/bin/env python3
"""Phase 1 — real early-season completion model, as a backtest Model.

At each (season, week) it builds a 32x32 team-vs-team NEUTRAL-margin matrix from:
  - a prior-season strength anchor (low confidence) so week 1 isn't blind, and
  - this season's games so far (full confidence),
then completes it low-rank + division-graph-smoothed (the Phase-0 core, confidence-weighted) and reads
the completed [home, away] entry as the predicted neutral margin. Refit is cached per (season, week) so
there is no intra-week leak and it's fast.

The question this answers: does completion beat the Elo baseline's early-season ATS edge?
"""
import numpy as np
from backtest.harness import Model

# 8 divisions; includes historical abbrs (OAK/LV, SD/LAC, STL/LA/LAR) so the graph maps every season.
_DIV = {
    0: "BUF MIA NE NYJ", 1: "BAL CIN CLE PIT", 2: "HOU IND JAX TEN",
    3: "DEN KC OAK LV SD LAC", 4: "DAL NYG PHI WAS", 5: "CHI DET GB MIN",
    6: "ATL CAR NO TB", 7: "ARI STL LA LAR SF SEA",
}
DIVISION = {t: d for d, teams in _DIV.items() for t in teams.split()}
HFA = 2.0  # league home-field edge in points


def build_qb_changes(games):
    """{(season, team): True if week-1 QB differs from last season's primary QB}.
    Both inputs known at prediction time (week-1 starter + fully-past prior season) -> no leak."""
    from collections import Counter
    g = games[(games.game_type == "REG") & games.home_qb_id.notna() & games.away_qb_id.notna()]
    rows = []
    for r in g.itertuples(index=False):
        rows.append((r.season, r.week, r.home_team, r.home_qb_id))
        rows.append((r.season, r.week, r.away_team, r.away_qb_id))
    import pandas as pd
    d = pd.DataFrame(rows, columns=["season", "week", "team", "qb"])
    primary, week1 = {}, {}
    for (s, t), sub in d.groupby(["season", "team"]):
        primary[(s, t)] = Counter(sub.qb).most_common(1)[0][0]
        week1[(s, t)] = sub.sort_values("week").iloc[0].qb
    changed = {}
    for (s, t), w1 in week1.items():
        prev = primary.get((s - 1, t))
        changed[(s, t)] = prev is not None and w1 != prev
    return changed


def complete_weighted(M, C, L, r, lam_g, lam_r, iters=1200, lr=0.05, seed=0):
    """Confidence-weighted graph-regularized low-rank completion (Phase-0 core; C = per-entry weight)."""
    rng = np.random.default_rng(seed)
    m, n = M.shape
    U = 0.1 * rng.standard_normal((m, r)); W = 0.1 * rng.standard_normal((r, n))
    mU = np.zeros_like(U); vU = np.zeros_like(U); mW = np.zeros_like(W); vW = np.zeros_like(W)
    b1, b2, eps = 0.9, 0.999, 1e-8
    for t in range(1, iters + 1):
        R = C * (U @ W - M)
        gU = R @ W.T + lam_g * (L @ U) + lam_r * U
        gW = U.T @ R + lam_g * (W @ L) + lam_r * W
        for P, g, mm, vv in ((U, gU, mU, vU), (W, gW, mW, vW)):
            mm[:] = b1 * mm + (1 - b1) * g
            vv[:] = b2 * vv + (1 - b2) * g * g
            P -= lr * (mm / (1 - b1 ** t)) / (np.sqrt(vv / (1 - b2 ** t)) + eps)
    return U @ W


def _laplacian(teams):
    """Normalized Laplacian of the same-division graph over `teams`."""
    d = np.array([DIVISION.get(t, -1) for t in teams])
    A = ((d[:, None] == d[None, :]) & (d[:, None] >= 0)).astype(float)
    np.fill_diagonal(A, 0.0)
    deg = A.sum(1)
    Dinv = np.diag(1.0 / np.sqrt(np.maximum(deg, 1e-9)))
    return np.eye(len(teams)) - Dinv @ A @ Dinv


class Completion(Model):
    """Graph-regularized rating completion. prior_w blends last-season strength; lam_g = graph weight."""
    name = "completion"

    def __init__(self, r=4, lam_g=0.5, lam_r=0.05, prior_w=0.25, revert=1 / 3, games=None,
                 qb_changes=None, qb_penalty=1.0):
        self.r, self.lam_g, self.lam_r, self.prior_w, self.revert = r, lam_g, lam_r, prior_w, revert
        # qb_penalty<1 downweights the prior anchor for teams whose QB changed (qb_changes provided)
        self.qb_changes = qb_changes or {}
        self.qb_penalty = qb_penalty
        # per-season team list (schedule is public in advance — not a leak)
        self.season_teams = {}
        if games is not None:
            for s, sub in games.groupby("season"):
                self.season_teams[s] = sorted(set(sub.home_team) | set(sub.away_team))
        self.cur = []              # (week, home, away, neutral_margin) for the current season
        self.prior_strength = {}   # team -> reverted last-season avg neutral margin
        self._cache = {}           # (season, week) -> completed matrix

    def new_season(self, season):
        if self.cur:  # finalize prior strength from the season that just ended
            agg = {}
            for _, h, a, nm in self.cur:
                agg.setdefault(h, []).append(nm)
                agg.setdefault(a, []).append(-nm)
            self.prior_strength = {t: self.revert_apply(np.mean(v)) for t, v in agg.items()}
        self.cur = []
        self._cache = {}
        self.season = season

    def revert_apply(self, s):
        return s * (1 - self.revert)

    def _complete_upto(self, season, week):
        key = (season, week)
        if key in self._cache:
            return self._cache[key]
        teams = self.season_teams.get(season)
        if not teams:
            return None
        idx = {t: i for i, t in enumerate(teams)}
        n = len(teams)
        # base: prior-season strength differences at low confidence (so week 1 isn't blind).
        # teams whose QB changed get their prior DOWNWEIGHTED (stale) -> the graph pulls them toward
        # division neighbors instead. conf multiplies into the prior weight per team-pair.
        s = np.array([self.prior_strength.get(t, 0.0) for t in teams])
        conf = np.array([self.qb_penalty if self.qb_changes.get((season, t)) else 1.0 for t in teams])
        M = s[:, None] - s[None, :]
        base = self.prior_w if self.prior_strength else 0.0
        C = base * conf[:, None] * conf[None, :]
        # override with this season's games strictly BEFORE `week` (full confidence, antisymmetric)
        acc = {}
        for wk, h, a, nm in self.cur:
            if wk < week and h in idx and a in idx:
                acc.setdefault((idx[h], idx[a]), []).append(nm)
        for (i, j), vals in acc.items():
            v = float(np.mean(vals))
            M[i, j], M[j, i] = v, -v
            C[i, j] = C[j, i] = 1.0
        np.fill_diagonal(C, 0.0)
        L = _laplacian(teams)
        comp = complete_weighted(M, C, L, self.r, self.lam_g, self.lam_r, seed=season)
        self._cache[key] = (comp, idx)
        return self._cache[key]

    def predict_margin(self, g):
        out = self._complete_upto(g.season, g.week)
        if out is None:
            return None
        comp, idx = out
        if g.home_team not in idx or g.away_team not in idx:
            return None
        return comp[idx[g.home_team], idx[g.away_team]] + HFA  # neutral margin + home edge

    def update(self, g):
        self.cur.append((g.week, g.home_team, g.away_team, g.result - HFA))  # store neutral margin
