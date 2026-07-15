#!/usr/bin/env python3
"""Run a model through the backtest. Usage:
    python -m backtest.run --model elo --seasons 2015-2024 --threshold 1.5 --by-season
"""
import argparse
from .harness import load_games, run_backtest, summarize
from .models import REGISTRY


def parse_seasons(s):
    if "-" in s:
        a, b = s.split("-")
        return list(range(int(a), int(b) + 1))
    return [int(x) for x in s.split(",")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="elo", choices=list(REGISTRY))
    ap.add_argument("--seasons", default="2015-2024", help="e.g. 2015-2024 or 2022,2023")
    ap.add_argument("--threshold", type=float, default=1.5, help="min points of edge to place a bet")
    ap.add_argument("--early-only", action="store_true", help="only weeks 1-6 (the project's target slice)")
    ap.add_argument("--by-season", action="store_true")
    args = ap.parse_args()

    games = load_games()
    model = REGISTRY[args.model]()
    seasons = parse_seasons(args.seasons)
    max_week = 6 if args.early_only else 99
    df = run_backtest(games, model, set(seasons), threshold=args.threshold)
    if args.early_only:
        df = df[df.week <= max_week]

    slice_lbl = "weeks 1-6" if args.early_only else "all weeks"
    print(f"\n== {model.name}  |  {seasons[0]}-{seasons[-1]}  |  {slice_lbl}  |  edge>={args.threshold} ==")
    summarize(df, by_season=args.by_season)


if __name__ == "__main__":
    main()
