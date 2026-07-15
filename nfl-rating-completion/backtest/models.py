#!/usr/bin/env python3
"""Baseline models for the backtest. GR-RTRMC will land here as another Model subclass and get
graded against these on the same harness — that head-to-head IS the project's go/no-go."""
import math
from .harness import Model


class Elo(Model):
    """Classic NFL Elo with margin-of-victory multiplier and season carryover.
    Defaults are FiveThirtyEight-ish: 25 Elo/point, ~2.0 pt home edge, K=20, revert 1/3 each season."""
    name = "elo"

    def __init__(self, k=20.0, hfa=48.0, elo_per_point=25.0, revert=1 / 3, base=1500.0):
        self.k = k
        self.hfa = hfa                # home edge in Elo points (~2 pts * 25 ≈ 50)
        self.epp = elo_per_point
        self.revert = revert
        self.base = base
        self.r = {}

    def _get(self, team):
        return self.r.setdefault(team, self.base)

    def new_season(self, season):
        # regress every team toward the mean by `revert`
        for t in self.r:
            self.r[t] = self.base + (self.r[t] - self.base) * (1 - self.revert)

    def predict_margin(self, g):
        diff = self._get(g.home_team) + self.hfa - self._get(g.away_team)
        return diff / self.epp  # Elo diff -> predicted home margin in points

    def update(self, g):
        rh, ra = self._get(g.home_team), self._get(g.away_team)
        diff = rh + self.hfa - ra
        exp_home = 1.0 / (1.0 + 10 ** (-diff / 400.0))
        margin = g.result  # home - away
        actual = 1.0 if margin > 0 else (0.0 if margin < 0 else 0.5)
        # MOV multiplier (538): dampens blowouts, corrects for autocorrelation of favorites
        mov = math.log(abs(margin) + 1) * (2.2 / ((diff if actual == 1 else -diff) * 0.001 + 2.2))
        delta = self.k * mov * (actual - exp_home)
        self.r[g.home_team] = rh + delta
        self.r[g.away_team] = ra - delta


class MarketBaseline(Model):
    """Trivial 'the closing line is the truth' model — predicts exactly the closing spread.
    By construction it has ~0 ATS edge; it's the sanity floor (MAE ~= market's own error)."""
    name = "market"

    def predict_margin(self, g):
        return g.spread_line


class HomeBias(Model):
    """Predict a fixed home margin (league-average HFA). Dumb reference point."""
    name = "homebias"

    def __init__(self, hfa_points=2.0):
        self.hfa = hfa_points

    def predict_margin(self, g):
        return self.hfa


REGISTRY = {m.name: m for m in [Elo, MarketBaseline, HomeBias]}
