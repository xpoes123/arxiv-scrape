#!/usr/bin/env python3
"""Validate a nightly forum digest payload before Sage posts it.

Usage:  python3 validate_digest.py digest_YYYY-MM-DD.json
        python3 validate_digest.py --demo
Exit 0 if valid (<=3 papers, all required fields), non-zero otherwise.
Unknown tags are a warning, not an error.
"""
import json
import sys

KNOWN_TAGS = {
    "betting", "poker", "sports", "games", "gambling", "decision-theory",
    "ai", "math", "bio", "physics", "econ", "whimsy",
}
REQUIRED = {"title", "arxiv_id", "url", "tldr", "hot_take", "why", "question", "tags"}


def validate(payload: dict) -> list[str]:
    """Return a list of error strings; empty means valid."""
    papers = payload.get("papers")
    if not isinstance(papers, list):
        return ["'papers' must be a list"]
    errs = []
    if len(papers) > 3:
        errs.append(f"max 3 papers, got {len(papers)}")
    for i, p in enumerate(papers):
        missing = REQUIRED - set(p)
        if missing:
            errs.append(f"paper {i}: missing fields {sorted(missing)}")
            continue
        if not isinstance(p["tags"], list) or not p["tags"]:
            errs.append(f"paper {i}: 'tags' must be a non-empty list")
        for t in set(p.get("tags", [])) - KNOWN_TAGS:
            print(f"warning: paper {i}: unknown tag {t!r}", file=sys.stderr)
    return errs


def demo():
    ok = {"papers": [{"title": "T", "arxiv_id": "1", "url": "u", "tldr": "t",
                      "hot_take": "h", "why": "w", "question": "q", "tags": ["poker"]}]}
    assert validate(ok) == [], validate(ok)
    assert validate({"papers": [{}]}), "empty paper should error"
    assert validate({"papers": [ok["papers"][0]] * 4}), "4 papers should error"
    assert validate({"papers": "x"}) == ["'papers' must be a list"]
    print("validate_digest self-check OK")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--demo":
        demo()
        sys.exit(0)
    if len(sys.argv) != 2:
        print("usage: validate_digest.py <digest.json> | --demo", file=sys.stderr)
        sys.exit(2)
    with open(sys.argv[1]) as f:
        payload = json.load(f)
    errs = validate(payload)
    if errs:
        for e in errs:
            print(f"INVALID: {e}", file=sys.stderr)
        sys.exit(1)
    print(f"OK: {len(payload['papers'])} paper(s)")
