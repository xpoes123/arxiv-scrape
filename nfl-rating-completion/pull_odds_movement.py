#!/usr/bin/env python3
"""Pull line-movement TRAJECTORIES from The Odds API historical endpoint (2020-2024).
For each NFL week, snapshot the board at ~11 decision points from opener -> each slate boundary -> close,
so we can measure how earlier same-week results move later-game lines (the CLV / line-movement test).
Key from env ODDS_API_KEY. ~20 credits/snapshot (spreads+totals). Saves one JSON per timestamp; idempotent.
"""
import os, sys, json, time, urllib.request, urllib.parse
import pandas as pd

KEY = os.environ.get("ODDS_API_KEY")
if not KEY:
    sys.exit("set ODDS_API_KEY")
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "data/raw/odds/movement")
os.makedirs(OUT, exist_ok=True)
SEASONS = [2020, 2021, 2022, 2023, 2024]
BASE = "https://api.the-odds-api.com/v4/historical/sports/americanfootball_nfl/odds"

# ET offsets from the week's primary Sunday, capturing opener -> slate boundaries -> MNF.
# (day offset, hour ET). Sunday=0.
TEMPLATE = [(-5, 12), (-4, 12), (-3, 16), (-2, 12), (-1, 12),   # Tue opener .. Sat
            (0, 8), (0, 12), (0, 15.5), (0, 19),                 # Sun pre-slate/4pm/SNF
            (1, 12), (1, 19)]                                    # Mon pre-MNF

g = pd.read_csv(os.path.join(HERE, "data/raw/nflverse/games.csv"))
g = g[(g.season.isin(SEASONS)) & (g.game_type == "REG") & g.gametime.notna() & g.gameday.notna()].copy()
g["kick"] = pd.to_datetime(g.gameday + " " + g.gametime, errors="coerce") \
    .dt.tz_localize("America/New_York", ambiguous=True, nonexistent="shift_forward")

timestamps = set()
for (season, week), sub in g.groupby(["season", "week"]):
    days = sub.gameday.value_counts()
    sundays = [pd.Timestamp(d) for d in days.index if pd.Timestamp(d).weekday() == 6]
    if not sundays:
        continue
    sunday = max(sundays, key=lambda d: days[str(d.date())])  # primary Sunday
    for doff, hr in TEMPLATE:
        et = (sunday + pd.Timedelta(days=doff)).normalize() + pd.Timedelta(hours=hr)
        ts = et.tz_localize("America/New_York", ambiguous=True, nonexistent="shift_forward").tz_convert("UTC")
        timestamps.add(ts)
    # plus a near-close snapshot per unique kickoff
    for k in sub.kick.dropna().dt.tz_convert("UTC").unique():
        timestamps.add(pd.Timestamp(k) - pd.Timedelta(minutes=8))

timestamps = sorted(timestamps)
print(f"{len(g)} games -> {len(timestamps)} trajectory snapshots to pull", file=sys.stderr)


def get(ts):
    params = {"apiKey": KEY, "regions": "us", "markets": "spreads,totals",
              "oddsFormat": "american", "dateFormat": "iso", "date": ts.strftime("%Y-%m-%dT%H:%M:%SZ")}
    with urllib.request.urlopen(BASE + "/?" + urllib.parse.urlencode(params), timeout=45) as r:
        return json.loads(r.read()), r.headers.get("x-requests-remaining")


pulled = skipped = 0
rem = "?"
for ts in timestamps:
    fn = os.path.join(OUT, ts.strftime("%Y%m%dT%H%M%SZ") + ".json")
    if os.path.exists(fn):
        skipped += 1
        continue
    try:
        data, rem = get(ts)
        json.dump(data, open(fn, "w"))
        pulled += 1
        if pulled % 25 == 0:
            print(f"  pulled {pulled} (skip {skipped}) remaining={rem}", file=sys.stderr)
    except Exception as e:
        print(f"  ERR {ts}: {e}", file=sys.stderr)
    time.sleep(0.4)

print(f"done. pulled {pulled}, skipped {skipped}, credits remaining={rem}", file=sys.stderr)
