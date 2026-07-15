#!/usr/bin/env python3
"""Phase 1 money test + QB-continuity experiment.
Run: python -m phase1.benchmark [--threshold 1.5] [--qb-penalty 0.15] [--lam-g 0.8]

Decisive question: on games involving a team whose QB changed (where the prior is stale), does the
QB-aware graph model beat no-graph AND Elo? If not, honest call is 'completion ~= Elo, ship Elo'."""
import argparse
import pandas as pd
from backtest.harness import load_games, run_backtest, summarize
from backtest.models import Elo
from phase1.completion import Completion, build_qb_changes


def slice_qb(df, changed):
    """Rows where either team's QB changed that season."""
    mask = df.apply(lambda r: changed.get((r.season, r.home)) or changed.get((r.season, r.away)), axis=1)
    return df[mask]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--threshold", type=float, default=1.5)
    ap.add_argument("--qb-penalty", type=float, default=0.15)
    ap.add_argument("--lam-g", type=float, default=0.8)
    ap.add_argument("--prior-w", type=float, default=0.25)
    args = ap.parse_args()

    games = load_games()
    changed = build_qb_changes(games)
    seasons = set(range(2016, 2025))
    P = dict(games=games, prior_w=args.prior_w)

    models = [
        ("elo", Elo()),
        ("compl-qb-graph",   Completion(**P, lam_g=args.lam_g, qb_changes=changed, qb_penalty=args.qb_penalty)),
        ("compl-qb-nograph", Completion(**P, lam_g=0.0,        qb_changes=changed, qb_penalty=args.qb_penalty)),
    ]
    dfs = {}
    for name, model in models:
        dfs[name] = run_backtest(games, model, seasons, threshold=args.threshold)

    print(f"\n#### threshold={args.threshold} qb_penalty={args.qb_penalty} lam_g={args.lam_g} ####")
    for name, df in dfs.items():
        early = df[df.week <= 6]
        qb_early = slice_qb(early, changed)
        print(f"\n===== {name} =====")
        print("-- early season, ALL teams (wk 1-6) --"); summarize(early)
        print("-- early season, QB-CHANGED teams only --"); summarize(qb_early)


if __name__ == "__main__":
    main()
