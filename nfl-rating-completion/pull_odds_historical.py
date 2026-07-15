#!/usr/bin/env python3
"""Crawl HISTORICAL closing-ish odds snapshots from The Odds API for past NFL seasons.
For each unique kickoff datetime (from games.csv), query the snapshot ~4 min before kickoff so the
imminent game's lines are near-closing. Multi-book granularity that nfldata's single closing line lacks.
Key from env ODDS_API_KEY. Costs ~20 credits/call. Saves one JSON per snapshot timestamp."""
import os, sys, json, time, urllib.request, urllib.parse
import pandas as pd

KEY = os.environ.get("ODDS_API_KEY")
if not KEY:
    sys.exit("set ODDS_API_KEY")
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "data/raw/odds/historical")
os.makedirs(OUT, exist_ok=True)
SEASONS = [2022, 2023, 2024]  # extend later if useful
BASE = "https://api.the-odds-api.com/v4/historical/sports/americanfootball_nfl/odds"

g = pd.read_csv(os.path.join(HERE, "data/raw/nflverse/games.csv"))
g = g[g.season.isin(SEASONS) & g.gametime.notna() & g.gameday.notna()]
# combine local (ET) kickoff -> UTC
dt = pd.to_datetime(g.gameday + " " + g.gametime, errors="coerce")
dt = dt.dt.tz_localize("America/New_York", ambiguous=True, nonexistent="shift_forward").dt.tz_convert("UTC")
kickoffs = sorted(set(dt.dropna()))
print(f"{len(g)} games -> {len(kickoffs)} unique kickoff snapshots to pull")

def get(ts):
    params = {"apiKey": KEY, "regions": "us", "markets": "h2h,spreads,totals",
              "oddsFormat": "american", "dateFormat": "iso",
              "date": ts.strftime("%Y-%m-%dT%H:%M:%SZ")}
    url = BASE + "/?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=45) as r:
        return json.loads(r.read()), r.headers.get("x-requests-remaining")

pulled, skipped, rem = 0, 0, "?"
for k in kickoffs:
    snap_ts = (k - pd.Timedelta(minutes=4))
    fname = os.path.join(OUT, snap_ts.strftime("%Y%m%dT%H%M%SZ") + ".json")
    if os.path.exists(fname):
        skipped += 1; continue
    try:
        data, rem = get(snap_ts)
        json.dump(data, open(fname, "w"), indent=2)
        pulled += 1
        if pulled % 20 == 0:
            print(f"  pulled {pulled} (skip {skipped}) remaining={rem}")
    except Exception as e:
        print(f"  ERR {snap_ts} {e}")
    time.sleep(0.4)

print(f"done. pulled {pulled}, skipped {skipped}, credits remaining={rem}")
