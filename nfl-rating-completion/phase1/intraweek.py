#!/usr/bin/env python3
"""Direct test of the intra-week idea: do LATE-slot games (Sun 4pm+/Mon/Sun-night) in weeks 2-4 —
which have the most same-week prior results available — beat the close? Elo already updates per-game
in kickoff order, so this info is used. Run: python -m phase1.intraweek"""
import pandas as pd
from scipy.stats import binomtest
from backtest.harness import load_games, run_backtest
from backtest.models import Elo

BREAKEVEN = 0.524


def cover(df):
    b = df[df.grade.isin(["win", "loss"])]
    w, n = (b.grade == "win").sum(), len(b)
    if n == 0:
        return "n=0"
    p = binomtest(w, n, BREAKEVEN, alternative="greater").pvalue
    return f"n={n:4d}  cover={w/n:5.1%}  p={p:.3f}"


def main():
    games = load_games()
    seasons = set(range(2001, 2025))
    df = run_backtest(games, Elo(), seasons, threshold=1.5)

    # join game time metadata
    meta = games[["season", "week", "home_team", "away_team", "weekday", "gametime"]].rename(
        columns={"home_team": "home", "away_team": "away"})
    df = df.merge(meta, on=["season", "week", "home", "away"], how="left")
    hour = pd.to_numeric(df.gametime.str.slice(0, 2), errors="coerce")

    # "late slot" = the most same-week info already known: Sun 16:00+, Sunday night, Monday
    late = ((df.weekday == "Sunday") & (hour >= 16)) | df.weekday.isin(["Monday", "Sunday"]) & (hour >= 16)
    early = (df.weekday == "Thursday") | ((df.weekday == "Sunday") & (hour < 16))

    print("=== Elo, 2001-2024, weeks 2-4 (the fresh-data window) ===")
    w24 = df[(df.week >= 2) & (df.week <= 4)]
    print("  LATE slot  (Sun 4pm+/Mon/SNF — most same-week info):", cover(w24[late.loc[w24.index]]))
    print("  EARLY slot (Thu/Sun 1pm — least same-week info):     ", cover(w24[early.loc[w24.index]]))
    print("  all weeks 2-4:                                       ", cover(w24))
    print("\nIf LATE-slot doesn't beat EARLY-slot, intra-week info gives no edge vs the close\n"
          "(because the close already prices those same results).")


if __name__ == "__main__":
    main()
