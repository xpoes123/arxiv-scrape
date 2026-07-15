#!/usr/bin/env python3
"""The CLV / line-movement test: can a model betting at the OPEN beat the CLOSE?
This is the one thread the beat-the-close null doesn't already rule out.

Tests (2020-2024, 1343 games):
  1. Movement predictability: does Elo's disagreement with the OPEN predict which way the line MOVES
     to close? corr(edge_at_open, close-open). If >0 & significant, the market drifts toward the model.
  2. CLV: betting the model's side at the open, what % of bets get positive CLV (line moves your way)?
  3. Open vs close softness: model ATS-vs-result at the OPEN number vs at the CLOSE number.
Run: python -m phase2.clv
"""
import numpy as np
import pandas as pd
from scipy.stats import binomtest, pearsonr
from backtest.harness import load_games
from backtest.models import Elo


def elo_predictions(games):
    """Walk-forward Elo predicted home margin for every game (predict-then-update, no leak)."""
    m = Elo()
    cur = None
    preds = {}
    for g in games.itertuples(index=False):
        if g.season != cur:
            m.new_season(g.season); cur = g.season
        if pd.notna(getattr(g, "result", None)):
            preds[(g.season, g.week, g.home_team, g.away_team)] = m.predict_margin(g)
            m.update(g)
    return preds


def main():
    games = load_games()
    preds = elo_predictions(games)
    t = pd.read_parquet("data/derived/trajectories.parquet")
    t["pred"] = [preds.get((r.season, r.week, r.home, r.away)) for r in t.itertuples(index=False)]
    t = t.dropna(subset=["pred", "open_spread", "close_spread", "result"])
    print(f"{len(t)} games with Elo pred + open/close lines\n")

    # edge at open: model's predicted home margin minus the open home spread (>0 => likes home)
    t["edge_open"] = t.pred - t.open_spread
    t["move"] = t.close_spread - t.open_spread          # >0 => line moved toward home being more favored

    # ---- Test 1: does the line move toward the model's view? ----
    r, p = pearsonr(t.edge_open, t.move)
    print(f"[1] Movement predictability: corr(edge_at_open, line_move) = {r:+.3f}  (p={p:.2e})")
    print(f"    slope: {np.polyfit(t.edge_open, t.move, 1)[0]:+.3f} pts of move per pt of edge")

    # ---- Test 2: CLV of betting the model's side at the open ----
    for th in [0.0, 1.0, 2.0]:
        b = t[t.edge_open.abs() >= th].copy()
        side_home = b.edge_open > 0
        clv = np.where(side_home, b.move, -b.move)       # + if line moved toward your side
        pos = (clv > 0).sum(); n = (clv != 0).sum()
        pval = binomtest(int(pos), int(n), 0.5, alternative="greater").pvalue if n else float("nan")
        print(f"[2] edge>={th}: n={len(b):4d}  positive-CLV={pos/n:5.1%}  meanCLV={clv.mean():+.2f}pts  p={pval:.3f}")

    # ---- Test 3: is the OPEN softer than the CLOSE for the model? (ATS vs result) ----
    def ats_cover(line_col, th):
        b = t[(t.pred - t[line_col]).abs() >= th].copy()
        pick_home = b.pred > b[line_col]
        home_cov = b.result > b[line_col]
        push = b.result == b[line_col]
        w = ((pick_home == home_cov) & ~push).sum(); loss = ((pick_home != home_cov) & ~push).sum()
        return w, loss, w / (w + loss) if (w + loss) else float("nan")
    print("\n[3] Model ATS vs RESULT, betting at each number (edge>=1.5):")
    for col, lab in [("open_spread", "OPEN "), ("close_spread", "CLOSE"), ("spread_line", "gcsv-close")]:
        w, l, c = ats_cover(col, 1.5)
        print(f"    bet at {lab}: {w}-{l}  cover={c:.1%}")


if __name__ == "__main__":
    main()
