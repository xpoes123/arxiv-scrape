#!/usr/bin/env python3
"""Elo-on-EPA-margin power rating: does a genuinely BETTER model beat the CLOSING line (which Elo
couldn't), or only the opener? Decides whether 'our model is bad' or 'the market is efficient'.

EPA->points scale fit on 2010-2014 ONLY (leak-free), tested 2015-2024. Run: python -m phase2.epa_ratings
"""
import numpy as np
import pandas as pd
from scipy.stats import binomtest, pearsonr
from backtest.harness import load_games
from phase2.clv import elo_predictions


def epa_ratings(games, gnet, K=0.15, revert=1/3, hfa_epa=0.0):
    """Walk-forward Elo-style filter on EPA margin. Returns {game_key: pre-game rating_diff}."""
    r, cur, out = {}, None, {}
    for g in games.itertuples(index=False):
        if g.season != cur:
            for t in r:
                r[t] *= (1 - revert)
            cur = g.season
        key = (g.season, g.week, g.home_team, g.away_team)
        diff = r.get(g.home_team, 0.0) - r.get(g.away_team, 0.0) + hfa_epa
        out[key] = diff
        gn = gnet.get(key)
        if gn is not None:                       # update toward observed EPA margin
            d = K * (gn - diff)
            r[g.home_team] = r.get(g.home_team, 0.0) + d
            r[g.away_team] = r.get(g.away_team, 0.0) - d
    return out


def ats(df, line_col, pred_col, th=1.5):
    b = df[(df[pred_col] - df[line_col]).abs() >= th]
    ph = b[pred_col] > b[line_col]; hc = b.result > b[line_col]; pu = b.result == b[line_col]
    w = int(((ph == hc) & ~pu).sum()); l = int(((ph != hc) & ~pu).sum())
    n = w + l
    cov = w / n if n else float("nan")
    p = binomtest(w, n, 0.524, alternative="greater").pvalue if n else float("nan")
    return w, l, cov, p


def main():
    games = load_games()
    gn = pd.read_parquet("data/derived/game_net.parquet")
    gnet = {(r.season, r.week, r.home, r.away): r.game_net for r in gn.itertuples(index=False)}
    hfa = gn[gn.season <= 2014].game_net.mean()

    diffs = epa_ratings(games, gnet, hfa_epa=hfa)
    g = games[(games.game_type == "REG") & games.result.notna() & games.spread_line.notna()].copy()
    g["rdiff"] = [diffs.get((r.season, r.week, r.home_team, r.away_team)) for r in g.itertuples(index=False)]
    g = g.dropna(subset=["rdiff"])

    # fit EPA-diff -> points on 2010-2014 ONLY, freeze for test
    tr = g[(g.season >= 2011) & (g.season <= 2014)]
    k, b = np.polyfit(tr.rdiff, tr.result, 1)
    print(f"EPA->points fit on 2011-2014: margin = {k:.1f}*rating_diff + {b:.2f}  (hfa_epa={hfa:.4f})\n")
    g["pred"] = k * g.rdiff + b

    # ---- Decisive test: beat the CLOSE, 2015-2024 ----
    test = g[(g.season >= 2015) & (g.season <= 2024)].rename(columns={"home_team": "home", "away_team": "away"})
    elo = elo_predictions(games)
    test["elo"] = [elo.get((r.season, r.week, r.home, r.away)) for r in test.itertuples(index=False)]
    print("=== BEAT-THE-CLOSE, 2015-2024 (ATS vs games.csv closing spread, edge>=1.5) ===")
    for lab, col in [("EPA model", "pred"), ("Elo (ref)", "elo")]:
        w, l, cov, p = ats(test, "spread_line", col)
        print(f"  {lab:10s}: {w}-{l}  cover={cov:5.1%}  p={p:.3f}")
    early = test[test.week <= 6]
    w, l, cov, p = ats(early, "spread_line", "pred")
    print(f"  EPA early (wk1-6): {w}-{l}  cover={cov:5.1%}  p={p:.3f}")

    # ---- Open vs close CLV, 2020-2024 (does EPA beat the OPENER by more than Elo?) ----
    traj = pd.read_parquet("data/derived/trajectories.parquet")
    m = traj.merge(test[["season", "week", "home", "away", "pred"]], on=["season", "week", "home", "away"], how="inner")
    m = m.dropna(subset=["pred", "open_spread", "close_spread", "result"])
    print(f"\n=== OPEN vs CLOSE, EPA model, 2020-2024 (n={len(m)}) ===")
    r_, p_ = pearsonr(m.pred - m.open_spread, m.close_spread - m.open_spread)
    print(f"  corr(EPA edge at open, line move) = {r_:+.3f} (p={p_:.1e})")
    for lab, col in [("bet at OPEN ", "open_spread"), ("bet at CLOSE", "close_spread")]:
        w, l, cov, p = ats(m, col, "pred")
        print(f"  {lab}: {w}-{l}  cover={cov:5.1%}  p={p:.3f}")


if __name__ == "__main__":
    main()
