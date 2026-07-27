#!/usr/bin/env python3
"""Fetch arXiv papers via the official API. Usage: python arxiv_scrape.py "cat:cs.LG" [max]"""
import sys, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

NS = {"a": "http://www.w3.org/2005/Atom"}

def search(query, max_results=10, start=0):
    url = "https://export.arxiv.org/api/query?" + urllib.parse.urlencode({
        "search_query": query,
        "start": start,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    })
    # ponytail: arXiv asks for >=3s between calls; one call here, sleep if you loop.
    # ponytail: arXiv 429s/hangs the default Python-urllib UA; send a browser-like one.
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; arxiv-scrape/1.0)"})
    # ponytail: arXiv throttles hard under load (429s/hangs); retry with backoff, raise upgrade if still flaky.
    for attempt, backoff in enumerate((15, 30, 60)):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                feed = ET.parse(r).getroot()
            break
        except (urllib.error.HTTPError, TimeoutError, OSError):
            if attempt == 2:
                raise
            time.sleep(backoff)
    for e in feed.findall("a:entry", NS):
        yield {
            "id": e.findtext("a:id", "", NS).rsplit("/", 1)[-1],
            "title": " ".join(e.findtext("a:title", "", NS).split()),
            "authors": [a.findtext("a:name", "", NS) for a in e.findall("a:author", NS)],
            "published": e.findtext("a:published", "", NS)[:10],
            "summary": " ".join(e.findtext("a:summary", "", NS).split()),
            "pdf": next((l.get("href") for l in e.findall("a:link", NS)
                         if l.get("title") == "pdf"), None),
        }

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) > 1 else "cat:cs.LG"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    papers = list(search(q, n))
    assert papers, "no results — check query syntax"
    for p in papers:
        print(f"\n[{p['id']}] {p['published']}  {p['title']}")
        print(f"  {', '.join(p['authors'][:4])}{' et al.' if len(p['authors']) > 4 else ''}")
        print(f"  {p['pdf']}")
