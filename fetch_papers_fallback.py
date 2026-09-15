#!/usr/bin/env python3
"""Fallback fetcher for nights when export.arxiv.org/api hard-429s the whole run.
Scrapes arxiv.org's HTML listing + abstract pages instead (same site, different
endpoint, not covered by the export API's IP-level rate limiter). Same output
schema as fetch_papers.py. Usage: python fetch_papers_fallback.py [per_cat] [start] [out_path]
"""
import json, re, sys, time, urllib.request

from fetch_papers import CATEGORIES

UA = {"User-Agent": "Mozilla/5.0 (compatible; arxiv-scrape/1.0)"}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode("utf-8", "replace")

def list_ids(cat, show=100):
    html = get(f"https://arxiv.org/list/{cat}/recent?skip=0&show={show}")
    return re.findall(r'"/abs/([0-9]+\.[0-9]+)"', html)

def fetch_one(paper_id):
    html = get(f"https://arxiv.org/abs/{paper_id}")
    title = re.search(r'<meta name="citation_title" content="([^"]*)"', html)
    authors = re.findall(r'<meta name="citation_author" content="([^"]*)"', html)
    date = re.search(r'<meta name="citation_date" content="([^"]*)"', html)
    abstract = re.search(r'<meta name="citation_abstract" content="([^"]*)"', html)
    return {
        "id": paper_id,
        "title": (title.group(1) if title else "").replace("&amp;", "&"),
        "authors": authors,
        "published": date.group(1).replace("/", "-") if date else "",
        "summary": (abstract.group(1) if abstract else "").replace("&amp;", "&"),
        "pdf": f"https://arxiv.org/pdf/{paper_id}",
    }

def main(per_cat=8, start=0, out_path="papers_nightly.json"):
    out = []
    for i, cat in enumerate(CATEGORIES):
        try:
            ids = list_ids(cat)
            offset = start % max(1, len(ids) - per_cat) if len(ids) > per_cat else 0
            selected = ids[offset:offset + per_cat]
            papers = []
            for pid in selected:
                papers.append(fetch_one(pid))
                time.sleep(1.5)
        except Exception as e:
            print(f"  ! {cat}: {e}", file=sys.stderr)
            papers = []
        for p in papers:
            p["category"] = cat
        out.extend(papers)
        print(f"  {cat}: {len(papers)}", file=sys.stderr)
        with open(out_path, "w") as f:
            json.dump(out, f, indent=2)
        time.sleep(2.0)
    print(f"wrote {len(out)} papers -> {out_path}", file=sys.stderr)

if __name__ == "__main__":
    per_cat = int(sys.argv[1]) if len(sys.argv) > 1 else 8
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    out_path = sys.argv[3] if len(sys.argv) > 3 else "papers_nightly.json"
    main(per_cat, start, out_path)
