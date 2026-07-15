#!/usr/bin/env python3
"""Fetch ~N recent papers across categories -> papers.json. Usage: python fetch_papers.py [per_cat]"""
import json, sys, time
from arxiv_scrape import search

CATEGORIES = [
    # CS
    "cs.LG", "cs.AI", "cs.CL", "cs.CR", "cs.DS",
    # Math
    "math.CO", "math.OC", "math.PR", "math.NT",
    # Quant / econ / stats  (ideas steered to prediction markets + sportsbooks, not trading)
    "q-fin.PM", "q-fin.TR", "econ.EM", "stat.ML",
    # Bio / bioinformatics
    "q-bio.NC", "q-bio.BM", "q-bio.GN", "q-bio.QM", "q-bio.PE",
    # Chem
    "physics.chem-ph", "cond-mat.soft",
    # Physics / wildcard
    "cond-mat.stat-mech", "physics.soc-ph",
]

def main(per_cat=8, start=0, out_path="papers.json"):
    out = []
    for i, cat in enumerate(CATEGORIES):
        try:
            papers = list(search(f"cat:{cat}", per_cat, start=start))
        except Exception as e:
            print(f"  ! {cat}: {e}", file=sys.stderr)
            papers = []
        for p in papers:
            p["category"] = cat
        out.extend(papers)
        print(f"  {cat}: {len(papers)}", file=sys.stderr)
        if i < len(CATEGORIES) - 1:
            time.sleep(3.1)  # arXiv rate limit: >=3s between calls
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)
    print(f"wrote {len(out)} papers -> {out_path}", file=sys.stderr)

if __name__ == "__main__":
    # args: per_cat [start] [out_path]
    per_cat = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    out_path = sys.argv[3] if len(sys.argv) > 3 else "papers.json"
    main(per_cat, start, out_path)
