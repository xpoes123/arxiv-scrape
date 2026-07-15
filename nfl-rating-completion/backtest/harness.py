#!/usr/bin/env python3
"""Walk-forward NFL backtest harness. Any rating model plugs in via the Model interface and gets
graded apples-to-apples: predictive MAE + ATS-vs-closing-line record + ROI. This is the scaffold the
GR-RTRMC bake-off (project's definition of done) runs on. No future data leaks: predict-then-update.

ATS grading uses nfldata's `spread_line` (home spread, positive = home favored by that many).
Home covers iff result > spread_line; push iff equal.
"""
import os
import pandas as pd

GAMES = os.path.join(os.path.dirname(__file__), "..", "data/raw/nflverse/games.csv")


def load_games(path=GAMES):
    """All games, chronological, with the fields the harness needs."""
    g = pd.read_csv(path)
    g = g.sort_values(["season", "week", "gameday", "gametime"], na_position="last").reset_index(drop=True)
    return g


# ---------- ATS grading (money path — has a self-check in test_harness.py) ----------

def ats_pick(pred_home_margin, spread_line, threshold):
    """Which side the model bets, or None if edge below threshold.
    edge > 0 => model thinks home beats the number (home undervalued)."""
    edge = pred_home_margin - spread_line
    if abs(edge) < threshold:
        return None
    return "home" if edge > 0 else "away"


def ats_grade(pick, result, spread_line):
    """win / loss / push for a pick given the realized result."""
    if result == spread_line:
        return "push"
    home_covered = result > spread_line
    won = (pick == "home") == home_covered
    return "win" if won else "loss"


# -110 payout: risk 1 unit to win 100/110.
WIN_UNITS = 100 / 110


# ---------- Model interface ----------

class Model:
    """Online model. The engine feeds games chronologically; predict BEFORE update (no leak)."""
    name = "base"

    def new_season(self, season):
        """Called at each season boundary (e.g. apply carryover / reset)."""

    def predict_margin(self, g):
        """Return predicted home margin (home_score - away_score), or None to skip. Uses only prior state."""
        raise NotImplementedError

    def update(self, g):
        """Incorporate a finished game's result into state."""


# ---------- Engine ----------

def run_backtest(games, model, test_seasons, threshold=1.5, reg_only=True, min_week=1):
    """Walk forward over all games (earlier seasons warm the model up); grade only test_seasons."""
    rows = []
    cur_season = None
    for g in games.itertuples(index=False):
        if g.season != cur_season:
            model.new_season(g.season)
            cur_season = g.season

        gradeable = (
            g.season in test_seasons
            and pd.notna(getattr(g, "result", None))
            and pd.notna(getattr(g, "spread_line", None))
            and g.week >= min_week
            and (not reg_only or getattr(g, "game_type", "REG") == "REG")
        )
        if gradeable:
            pred = model.predict_margin(g)
            if pred is not None:
                pick = ats_pick(pred, g.spread_line, threshold)
                rows.append({
                    "season": g.season, "week": g.week,
                    "home": g.home_team, "away": g.away_team,
                    "pred": pred, "spread_line": g.spread_line, "result": g.result,
                    "abs_err": abs(pred - g.result),
                    "pick": pick,
                    "grade": ats_grade(pick, g.result, g.spread_line) if pick else None,
                })
        if pd.notna(getattr(g, "result", None)):
            model.update(g)
    return pd.DataFrame(rows)


def summarize(df, by_season=False):
    """Print MAE, ATS record, ROI. Optionally per season."""
    def block(d, label):
        n = len(d)
        mae = d.abs_err.mean() if n else float("nan")
        bets = d[d.grade.notna()]
        w = (bets.grade == "win").sum()
        l = (bets.grade == "loss").sum()
        p = (bets.grade == "push").sum()
        staked = w + l  # pushes refunded
        units = w * WIN_UNITS - l
        roi = units / staked if staked else 0.0
        cover = w / staked if staked else float("nan")
        print(f"  {label:12s} games={n:4d}  MAE={mae:5.2f}  bets={w+l+p:4d}  "
              f"{w}-{l}-{p}  cover={cover:5.1%}  ROI={roi:+6.2%}  units={units:+6.1f}")

    print(f"Model results  (ATS vs closing line, -110):")
    if by_season:
        for s in sorted(df.season.unique()):
            block(df[df.season == s], str(s))
    block(df, "OVERALL")
    # 52.4% cover is breakeven at -110 — flag it.
    bets = df[df.grade.notna()]
    staked = (bets.grade.isin(["win", "loss"])).sum()
    cover = (bets.grade == "win").sum() / staked if staked else 0
    print(f"  (breakeven at -110 = 52.4% cover; you are {'ABOVE' if cover>0.524 else 'below'} it)")
