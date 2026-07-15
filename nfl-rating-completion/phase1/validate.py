#!/usr/bin/env python3
"""Rigorous test of the early-season ATS-vs-close edge, model-agnostic. 26 seasons (1999-2024).

We can't measure true open->close CLV (snapshots are near-close; key rotated), but "beats the CLOSING
line on actual results" is the STRICTER bar. Tests:
  1. Early season (wk 1-6) cover with binomial significance vs 52.4% breakeven + bootstrap 95% CI.
  2. PLACEBO: late season (wk 10+) should be ~efficient (~52.4%). If it isn't, the harness leaks.
  3. Season-by-season stability: how many of N seasons clear breakeven (sign test).
  4. Threshold sensitivity.
Run: python -m phase1.validate
"""
import numpy as np
from scipy.stats import binomtest
from backtest.harness import load_games, run_backtest
from backtest.models import Elo
from phase1.completion import Completion, build_qb_changes

BREAKEVEN = 0.524


def stats(df):
    bets = df[df.grade.isin(["win", "loss"])]
    w = (bets.grade == "win").sum(); n = len(bets)
    if n == 0:
        return dict(n=0, cover=float("nan"), p=float("nan"), lo=float("nan"), hi=float("nan"), roi=float("nan"))
    cover = w / n
    p = binomtest(w, n, BREAKEVEN, alternative="greater").pvalue
    # bootstrap CI on cover
    wins = (bets.grade == "win").to_numpy().astype(int)
    rng = np.random.default_rng(0)
    boot = [rng.choice(wins, size=n, replace=True).mean() for _ in range(2000)]
    lo, hi = np.percentile(boot, [2.5, 97.5])
    roi = (w * (100 / 110) - (n - w)) / n
    return dict(n=n, cover=cover, p=p, lo=lo, hi=hi, roi=roi)


def line(label, s):
    print(f"  {label:22s} n={s['n']:4d}  cover={s['cover']:5.1%}  "
          f"95%CI=[{s['lo']:4.1%},{s['hi']:4.1%}]  p={s['p']:.4f}  ROI={s['roi']:+5.1%}")


def main():
    games = load_games()
    changed = build_qb_changes(games)
    seasons = set(range(2001, 2025))  # 1999-2000 warm up Elo
    threshold = 1.5

    for mname, model in [("Elo", Elo()),
                         ("QB-completion(no-graph)", Completion(games=games, lam_g=0.0,
                                                                qb_changes=changed, qb_penalty=0.15))]:
        df = run_backtest(games, model, seasons, threshold=threshold)
        early = df[df.week <= 6]
        late = df[df.week >= 10]
        print(f"\n===== {mname}  (2001-2024, edge>={threshold}) =====")
        line("EARLY (wk 1-6)", stats(early))
        line("PLACEBO late (wk 10+)", stats(late))

        # season-by-season stability on early
        per = []
        for szn in sorted(early.season.unique()):
            e = early[early.season == szn]
            b = e[e.grade.isin(["win", "loss"])]
            if len(b) >= 20:
                per.append((b.grade == "win").mean())
        per = np.array(per)
        above = (per > BREAKEVEN).sum()
        sign_p = binomtest(above, len(per), 0.5, alternative="greater").pvalue
        print(f"  season stability: {above}/{len(per)} seasons above {BREAKEVEN:.1%} breakeven "
              f"(mean {per.mean():.1%}, sign-test p={sign_p:.3f})")

        # threshold sensitivity on early
        print("  threshold sweep (early):", end=" ")
        for th in [0.0, 1.0, 2.0, 3.0]:
            d = run_backtest(games, model, seasons, threshold=th)
            e = d[d.week <= 6]; b = e[e.grade.isin(["win", "loss"])]
            c = (b.grade == "win").mean() if len(b) else float("nan")
            print(f"th={th}:{c:.1%}(n={len(b)})", end="  ")
        print()


if __name__ == "__main__":
    main()
