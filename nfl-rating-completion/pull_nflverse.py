#!/usr/bin/env python3
"""Pull nflverse data straight from published releases (no api key, no nfl_data_py).
Over-collect: results+lines, play-by-play (EPA), rosters, snaps, depth charts, teams.
Saves raw to data/raw/nflverse/. Idempotent-ish: skips files already downloaded."""
import os, sys, urllib.request, urllib.error
import pandas as pd

OUT = os.path.join(os.path.dirname(__file__), "data/raw/nflverse")
os.makedirs(OUT, exist_ok=True)
SEASONS = range(2010, 2026)  # 2010..2025

REL = "https://github.com/nflverse/nflverse-data/releases/download"
# (subdir, filename-template, url-template). {y} = season.
PER_SEASON = [
    ("pbp",          "play_by_play_{y}.parquet", REL + "/pbp/play_by_play_{y}.parquet"),
    ("rosters",      "roster_weekly_{y}.parquet", REL + "/weekly_rosters/roster_weekly_{y}.parquet"),
    ("snaps",        "snap_counts_{y}.parquet",   REL + "/snap_counts/snap_counts_{y}.parquet"),
    ("depth_charts", "depth_charts_{y}.parquet",  REL + "/depth_charts/depth_charts_{y}.parquet"),
]
ONE_OFF = [
    # (out-name, url)  — pandas can read these directly
    ("games.csv",       "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"),
    ("teams.csv",       "https://raw.githubusercontent.com/nflverse/nfldata/master/data/teams.csv"),
    ("rosters_season.csv", "https://raw.githubusercontent.com/nflverse/nfldata/master/data/rosters.csv"),
]

def fetch(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print(f"  skip (exists) {os.path.basename(dest)}"); return True
    try:
        urllib.request.urlretrieve(url, dest)
        mb = os.path.getsize(dest) / 1e6
        print(f"  ok  {os.path.basename(dest):32s} {mb:6.1f} MB"); return True
    except urllib.error.HTTPError as e:
        print(f"  MISS {os.path.basename(dest):32s} HTTP {e.code}")
    except Exception as e:
        print(f"  ERR  {os.path.basename(dest):32s} {e}")
    if os.path.exists(dest):
        os.remove(dest)
    return False

print("== one-off files ==")
for name, url in ONE_OFF:
    fetch(url, os.path.join(OUT, name))

for sub, tmpl, url in PER_SEASON:
    d = os.path.join(OUT, sub); os.makedirs(d, exist_ok=True)
    print(f"== {sub} ==")
    for y in SEASONS:
        fetch(url.format(y=y), os.path.join(d, tmpl.format(y=y)))

print("\ndone. inventory:")
for root, _, files in os.walk(OUT):
    for f in sorted(files):
        p = os.path.join(root, f)
        print(f"  {os.path.relpath(p, OUT):48s} {os.path.getsize(p)/1e6:7.1f} MB")
