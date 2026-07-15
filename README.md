# arxiv-scrape

Nightly scout that mines fresh arXiv preprints for ideas — **projects, startups, YouTube videos,
and demos** — and then actually **builds one demo** of something cool and publishes it to
[share.djiang.xyz/arxiv-scrape](https://share.djiang.xyz/arxiv-scrape/).

## The nightly loop
```
nightly.sh -> claude -p nightly.md (headless):
  fetch_papers.py  -> ~44 fresh papers across CS/math/quant/bio/chem/physics
  Workflow ideate  -> ideas tagged project/startup/youtube/demo, scored cool x buildable
  build            -> one self-contained index.html demo grounded in a paper's real result
  publish          -> git push to ~/code/david-share (manifest-driven); VPS cron pulls -> live
```

## Files
- `nightly.md` — the scout playbook (the prompt the headless run executes)
- `nightly.sh` — the runner (systemd `ExecStart`); logs to `~/.local/share/arxiv-nightly/`
- `fetch_papers.py` — arXiv API fetch: `python3 fetch_papers.py <per_cat> <start> <out.json>`
- `publish_nightly.py` — copies demo + builds brief + adds manifest entries in david-share
- `ENABLE.md` — **one-time setup**: the systemd timer + the VPS auto-pull cron
- `LOG_nightly.md` — running log of each night's run (newest first)
- `arxiv_scrape.py`, `publish.py` — earlier ideation/publish helpers

## Setup
See [ENABLE.md](ENABLE.md) — enable the nightly timer (this machine) + the VPS pull cron. Once both
are on, the loop is fully zero-touch.

## Related
Serious quant/betting research forked into the **vigil** repo. This project stays the
whimsy/idea-mining lane: cool demos, video concepts, startup seeds.
