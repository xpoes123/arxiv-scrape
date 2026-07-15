#!/usr/bin/env python3
"""Is the (non)edge uniform across early weeks, or concentrated in week 2/3?
Per-week ATS-vs-close cover with binomial significance, 24 seasons. Run: python -m phase1.byweek"""
import numpy as np
from scipy.stats import binomtest
from backtest.harness import load_games, run_backtest
from backtest.models import Elo

BREAKEVEN = 0.524


def wk_stats(df):
    b = df[df.grade.isin(["win", "loss"])]
    w, n = (b.grade == "win").sum(), len(b)
    if n == 0:
        return n, float("nan"), float("nan")
    return n, w / n, binomtest(w, n, BREAKEVEN, alternative="greater").pvalue


def main():
    games = load_games()
    seasons = set(range(2001, 2025))
    for th in [1.5, 2.5]:
        print(f"\n=== Elo, 2001-2024, edge>={th}  (per week, ATS vs close) ===")
        df = run_backtest(games, Elo(), seasons, threshold=th)
        for wk in range(1, 9):
            n, cov, p = wk_stats(df[df.week == wk])
            flag = "  <-- p<0.05" if p < 0.05 else ""
            print(f"  week {wk}:  n={n:4d}  cover={cov:5.1%}  p={p:.3f}{flag}")
        # pooled 2-3 and 2-4 (the user's hypothesis window)
        for lo, hi in [(2, 3), (2, 4), (1, 1)]:
            n, cov, p = wk_stats(df[(df.week >= lo) & (df.week <= hi)])
            print(f"  weeks {lo}-{hi}: n={n:4d}  cover={cov:5.1%}  p={p:.3f}")


if __name__ == "__main__":
    main()
