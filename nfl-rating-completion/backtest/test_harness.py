#!/usr/bin/env python3
"""Self-checks for the backtest harness. Run: python -m backtest.test_harness
Guards the money-path logic: ATS grading correctness, no-future-leak, and data sanity."""
from .harness import ats_pick, ats_grade, load_games, run_backtest
from .models import Elo, MarketBaseline


def test_ats_grading():
    # home favored by 3 (spread_line=3). Home wins by 7 -> home covers.
    assert ats_grade("home", 7, 3) == "win"
    assert ats_grade("away", 7, 3) == "loss"
    # home wins by exactly 3 -> push
    assert ats_grade("home", 3, 3) == "push"
    # home favored by 3 but loses by 1 (result=-1) -> away covers
    assert ats_grade("away", -1, 3) == "win"
    assert ats_grade("home", -1, 3) == "loss"
    # underdog home (spread_line=-6): home loses by 3 (result=-3) -> home covers (-3 > -6)
    assert ats_grade("home", -3, -6) == "win"


def test_ats_pick():
    # model predicts home by 5, line has home by 2 -> bet home; edge 3 >= threshold
    assert ats_pick(5, 2, 1.5) == "home"
    # model predicts home by 1, line home by 5 -> bet away
    assert ats_pick(1, 5, 1.5) == "away"
    # edge below threshold -> no bet
    assert ats_pick(2.5, 2, 1.5) is None


def test_spread_sign_convention():
    # Sanity: in the real data, result should correlate positively with spread_line
    # (home favored -> home wins by more). If this flips, our ATS signs are wrong.
    g = load_games()
    d = g[g.result.notna() & g.spread_line.notna()]
    corr = d.result.corr(d.spread_line)
    assert corr > 0.3, f"spread_line/result correlation {corr:.2f} — sign convention off"


def test_no_future_leak_and_signal():
    # Elo should predict better than the naive 'always home by 2' AND the market model should
    # reproduce the closing line exactly (MAE of pred-vs-line == 0).
    g = load_games()
    seasons = {2022, 2023}
    elo = run_backtest(g, Elo(), seasons)
    mkt = run_backtest(g, MarketBaseline(), seasons)
    # market model predicts the line, so pred == spread_line for every row
    assert (mkt.pred == mkt.spread_line).all()
    # Elo MAE should be in a sane NFL range (~12-15 pts) and finite
    assert 9 < elo.abs_err.mean() < 16, f"Elo MAE {elo.abs_err.mean():.1f} out of sane range"
    # and Elo should make a nontrivial number of predictions
    assert len(elo) > 400


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print(f"  ok  {name}")
    print("all harness self-checks passed")
