#!/usr/bin/env python3
"""Aggregate play-by-play -> per-game EPA margin (home off EPA/play - away off EPA/play).
This is the signal the EPA power rating filters on. Run: python -m phase2.epa_data"""
import os, glob
import pandas as pd

HERE = os.path.dirname(os.path.dirname(__file__))
PBP = os.path.join(HERE, "data/raw/nflverse/pbp")
OUT = os.path.join(HERE, "data/derived")
os.makedirs(OUT, exist_ok=True)
COLS = ["game_id", "season", "week", "season_type", "posteam", "home_team", "away_team", "epa", "play_type"]


def main():
    frames = []
    for f in sorted(glob.glob(os.path.join(PBP, "play_by_play_*.parquet"))):
        p = pd.read_parquet(f, columns=COLS)
        p = p[(p.season_type == "REG") & p.play_type.isin(["pass", "run"]) & p.epa.notna() & p.posteam.notna()]
        # offensive EPA/play per (game, posteam)
        off = p.groupby(["game_id", "season", "week", "home_team", "away_team", "posteam"]).epa.mean().reset_index()
        frames.append(off)
        print(f"  {os.path.basename(f)}: {p.game_id.nunique()} games", flush=True)
    off = pd.concat(frames, ignore_index=True)

    # pivot to home/away offensive EPA per game, compute net margin
    off["side"] = off.apply(lambda r: "home" if r.posteam == r.home_team else "away", axis=1)
    wide = off.pivot_table(index=["game_id", "season", "week", "home_team", "away_team"],
                           columns="side", values="epa").reset_index()
    wide = wide.dropna(subset=["home", "away"])
    wide["game_net"] = wide.home - wide.away          # home's EPA/play margin (antisymmetric)
    wide = wide.rename(columns={"home_team": "home", "away_team": "away",
                                "home": "home_off_epa", "away": "away_off_epa"})
    keep = wide[["season", "week", "home", "away", "home_off_epa", "away_off_epa", "game_net"]]
    keep.to_parquet(os.path.join(OUT, "game_net.parquet"))
    print(f"\nwrote {len(keep)} games ({keep.season.min()}-{keep.season.max()}) -> data/derived/game_net.parquet")
    print(f"game_net: mean {keep.game_net.mean():.3f}  std {keep.game_net.std():.3f}  (EPA/play margin)")


if __name__ == "__main__":
    main()
