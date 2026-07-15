#!/usr/bin/env python3
"""Parse line-movement snapshots -> per-game open/close spreads, matched to games.csv results.
Builds data/derived/trajectories.parquet. Run: python -m phase2.trajectories"""
import os, glob, json
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.dirname(__file__))
SNAPS = os.path.join(HERE, "data/raw/odds/movement")
GAMES = os.path.join(HERE, "data/raw/nflverse/games.csv")
OUT = os.path.join(HERE, "data/derived")
os.makedirs(OUT, exist_ok=True)

ABBR = {  # full name -> games.csv abbr (2020-2024 era)
    "Arizona Cardinals": "ARI", "Atlanta Falcons": "ATL", "Baltimore Ravens": "BAL",
    "Buffalo Bills": "BUF", "Carolina Panthers": "CAR", "Chicago Bears": "CHI",
    "Cincinnati Bengals": "CIN", "Cleveland Browns": "CLE", "Dallas Cowboys": "DAL",
    "Denver Broncos": "DEN", "Detroit Lions": "DET", "Green Bay Packers": "GB",
    "Houston Texans": "HOU", "Indianapolis Colts": "IND", "Jacksonville Jaguars": "JAX",
    "Kansas City Chiefs": "KC", "Las Vegas Raiders": "LV", "Los Angeles Chargers": "LAC",
    "Los Angeles Rams": "LA", "Miami Dolphins": "MIA", "Minnesota Vikings": "MIN",
    "New England Patriots": "NE", "New Orleans Saints": "NO", "New York Giants": "NYG",
    "New York Jets": "NYJ", "Philadelphia Eagles": "PHI", "Pittsburgh Steelers": "PIT",
    "San Francisco 49ers": "SF", "Seattle Seahawks": "SEA", "Tampa Bay Buccaneers": "TB",
    "Tennessee Titans": "TEN", "Washington Football Team": "WAS", "Washington Commanders": "WAS",
}


def consensus_home_spread(game):
    """Median home-team spread point across books (API convention: home favored => negative)."""
    home = game["home_team"]
    pts = []
    for bk in game.get("bookmakers", []):
        for m in bk.get("markets", []):
            if m["key"] != "spreads":
                continue
            for o in m["outcomes"]:
                if o["name"] == home and o.get("point") is not None:
                    pts.append(o["point"])
    return float(np.median(pts)) if pts else None


def main():
    rows = []
    for f in glob.glob(os.path.join(SNAPS, "*.json")):
        d = json.load(open(f))
        snap = d.get("timestamp")
        for g in d.get("data", []):
            h, a = ABBR.get(g["home_team"]), ABBR.get(g["away_team"])
            sp = consensus_home_spread(g)
            if h and a and sp is not None and g["commence_time"] > snap:  # only pre-kick quotes
                rows.append((g["commence_time"], h, a, snap, sp))
    df = pd.DataFrame(rows, columns=["commence", "home", "away", "snap", "home_pt"])
    # key on ET kickoff DATE (not the jittery commence timestamp) so one game = one group
    df["date"] = pd.to_datetime(df.commence, utc=True).dt.tz_convert("America/New_York").dt.date
    print(f"parsed {len(df)} game-snapshot quotes over {df[['date','home','away']].drop_duplicates().shape[0]} games")

    # per game: open = earliest snap, close = latest snap (both pre-kick). Flip sign to games.csv convention.
    df = df.sort_values("snap")
    agg = df.groupby(["date", "home", "away"]).agg(
        open_pt=("home_pt", "first"), close_pt=("home_pt", "last"),
        n_snaps=("home_pt", "size")).reset_index()
    agg["open_spread"] = -agg.open_pt    # positive => home favored (matches games.csv spread_line)
    agg["close_spread"] = -agg.close_pt

    # match to games.csv on (date, home, away)
    g = pd.read_csv(GAMES)
    g = g[g.game_type == "REG"].copy()
    g["date"] = pd.to_datetime(g.gameday).dt.date
    m = agg.merge(g[["date", "home_team", "away_team", "season", "week", "gametime", "weekday",
                     "result", "spread_line"]],
                  left_on=["date", "home", "away"], right_on=["date", "home_team", "away_team"], how="inner")
    print(f"matched {len(m)} games to games.csv")
    # validation: our close should track games.csv closing spread_line
    corr = m.close_spread.corr(m.spread_line)
    print(f"VALIDATION close_spread vs games.csv spread_line: corr={corr:.3f} (want ~1.0)")
    print(f"avg |open->close movement|: {(m.close_spread - m.open_spread).abs().mean():.2f} pts")

    keep = m[["season", "week", "home", "away", "gametime", "weekday", "open_spread", "close_spread",
              "spread_line", "result", "n_snaps"]]
    keep.to_parquet(os.path.join(OUT, "trajectories.parquet"))
    print(f"wrote {len(keep)} -> data/derived/trajectories.parquet")


if __name__ == "__main__":
    main()
