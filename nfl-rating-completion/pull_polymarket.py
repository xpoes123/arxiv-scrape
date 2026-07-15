#!/usr/bin/env python3
"""Pull NFL Polymarket events+markets via the gamma tag endpoint (public, no key).
tag_slug=nfl returns clean NFL events (champion futures, division, props) with nested markets."""
import os, json, time, urllib.request, urllib.parse

OUT = os.path.join(os.path.dirname(__file__), "data/raw/polymarket")
os.makedirs(OUT, exist_ok=True)

def get(path, params):
    url = f"https://gamma-api.polymarket.com/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read())

events, offset = [], 0
while offset <= 5000:
    page = get("events", {"tag_slug": "nfl", "closed": "false", "limit": 100, "offset": offset})
    if not page:
        break
    events.extend(page)
    offset += 100
    if len(page) < 100:
        break
    time.sleep(0.2)

json.dump(events, open(os.path.join(OUT, "nfl_events.json"), "w"), indent=2)
n_mkts = sum(len(e.get("markets", []) or []) for e in events)
print(f"pulled {len(events)} NFL events, {n_mkts} nested markets -> nfl_events.json")
for e in events[:25]:
    print("  •", (e.get("title") or "")[:82])
