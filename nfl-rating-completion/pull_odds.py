#!/usr/bin/env python3
"""Pull CURRENT odds/futures from The Odds API. Key from env ODDS_API_KEY (never hardcode).
Over-collect the sports relevant to the roadmap (NFL now, NCAAF/NBA/WNBA extra)."""
import os, sys, json, time, urllib.request, urllib.parse

KEY = os.environ.get("ODDS_API_KEY")
if not KEY:
    sys.exit("set ODDS_API_KEY")
OUT = os.path.join(os.path.dirname(__file__), "data/raw/odds/current")
os.makedirs(OUT, exist_ok=True)
BASE = "https://api.the-odds-api.com/v4"

# (sport_key, markets, out-name)
PULLS = [
    ("americanfootball_nfl",                  "h2h,spreads,totals", "nfl_game_lines"),
    ("americanfootball_nfl_preseason",        "h2h,spreads,totals", "nfl_preseason_lines"),
    ("americanfootball_nfl_super_bowl_winner","outrights",          "nfl_super_bowl_futures"),
    ("americanfootball_ncaaf",                "h2h,spreads,totals", "ncaaf_game_lines"),
    ("americanfootball_ncaaf_championship_winner","outrights",      "ncaaf_futures"),
    ("basketball_nba_championship_winner",    "outrights",          "nba_futures"),
    ("basketball_wnba",                       "h2h,spreads,totals", "wnba_game_lines"),
]

def get(path, params):
    params = {**params, "apiKey": KEY}
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=40) as r:
        body = r.read()
        return json.loads(body), r.headers.get("x-requests-last"), r.headers.get("x-requests-remaining")

for sport, markets, name in PULLS:
    try:
        data, cost, rem = get(f"sports/{sport}/odds", {
            "regions": "us,us2", "markets": markets, "oddsFormat": "american", "dateFormat": "iso"})
        with open(os.path.join(OUT, name + ".json"), "w") as f:
            json.dump(data, f, indent=2)
        print(f"  {name:26s} events={len(data):3d}  cost={cost}  remaining={rem}")
    except Exception as e:
        print(f"  {name:26s} ERR {e}")
    time.sleep(1)

# Also snapshot the sports list + each sport's available events (cheap, useful metadata)
try:
    sports, _, rem = get("sports", {"all": "true"})
    json.dump(sports, open(os.path.join(OUT, "_all_sports.json"), "w"), indent=2)
    print(f"  _all_sports.json           n={len(sports)}  remaining={rem}")
except Exception as e:
    print("  sports list ERR", e)
