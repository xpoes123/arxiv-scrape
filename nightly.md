# arxiv-scrape nightly scout — playbook

You are the arxiv-scrape nightly scout, running fully autonomously (no human is watching). Your job:
mine fresh arXiv papers for cool ideas across **projects, startups, YouTube videos, and fun demos** —
and then actually **BUILD one small demo** of something cool — via a 3-way subagent build-off, judged,
publishing the winner. Keep it bounded (~30 papers, 3 competing builds, aim under ~4M tokens). A cool
thing that actually works beats an ambitious broken thing — a demo that doesn't run cannot win.

Work in `/home/david/code/arxiv-scrape`. Steps:

1. **Fetch ~30 fresh papers.** Use an offset that varies by date so you see different papers than prior
   nights: `python3 fetch_papers.py 8 $(( $(date +%j) * 3 )) papers_nightly.json` (per_cat=8, start=day-of-year×3).
   Categories are defined in `fetch_papers.py` (CS, math, quant, bio, chem, physics).
   **Run this in the FOREGROUND and wait for it to finish — do NOT use run_in_background.** This is a
   headless `-p` run: backgrounded jobs die when the turn ends, so a backgrounded fetch silently no-ops
   the whole night. Same rule for every later step — never background a command you then wait on.

2. **Ideate.** Run a bounded Workflow (batches of 5 papers) that, per batch, surfaces 2–4 ideas tagged by
   type — **project / startup / youtube / demo** — and scores each on (a) how cool/shareable it is and
   (b) how **buildable-tonight** it is (prefer things buildable as a single self-contained HTML file, no
   backend). Reuse the pattern from the earlier ideation runs (see `ideation_run2.md`). ~6 batches is plenty.

3. **Pick the top 3 demo-worthy ideas.** From the ideation, take the 3 with the best **cool × buildable**
   score that make good *interactive* web toys — a playable explainer, an interactive visualization, or a
   toy that lets you *feel* a mind-bending result from a paper. Each must be buildable as a single
   self-contained HTML file (no build step, no backend). One idea per builder below.

4. **BUILD — 3-way subagent build-off, then judge.** This is the centerpiece.
   - Spawn **3 builder subagents in parallel** (use the Agent tool, all in one message so they run
     concurrently — or a Workflow `parallel()`). Give each ONE of the 3 ideas. Each builder writes a
     genuinely polished, interactive `demos/<date>-<slug-N>.html` (N = a, b, c): good visuals, real
     interactivity, a clear "wow", grounded in the paper's actual result. **CDN libraries are encouraged**
     (three.js, d3, p5.js, etc. via `<script src="https://cdn...">`) for richer visuals — still one HTML
     file, no build step, no backend. Each builder must open its own file / sanity-check the HTML is valid
     and self-contained before returning; a build that doesn't run is disqualified.
   - Then spawn **1 judge subagent** that opens all 3, scores them on wow-factor, interactivity, polish,
     and fidelity to the paper, discards any that don't actually run, and **picks the single coolest one**.
   - The winner becomes the published demo. Rename/copy it to `demos/<date>-<slug>.html` (drop the -N).
   - Keep it bounded: 3 builders + 1 judge, not a 10-way fan-out. If a builder fails, judge among the rest;
     if all fail, publish the brief with no demo and log it.

5. **Publish to share.djiang.xyz — via git push only (NO root SSH).** The share site is a FastAPI app that
   **only serves pages registered in `manifest.json` — writing the HTML is not enough; an unregistered page
   404s.** Do NOT hand-edit `index.html` (the app renders all indexes from the manifest). Steps:
   - Write the demo → `david-share/arxiv-scrape/demos/<date>-<slug>.html` (inline the whole thing, one file).
   - Write a nightly brief → `david-share/arxiv-scrape/<date>-nightly.html` (top ideas across all four
     categories + a prominent link to the demo). Match the style of existing `arxiv-scrape/*.html` pages.
   - **Register BOTH in the manifest** (this is the load-bearing step) by running, from `~/code/david-share`:
     ```
     python3 -c "from app import manifest; d=manifest.load(); [manifest.upsert_page(d,e) for e in [\
       {'file':'arxiv-scrape/demos/<date>-<slug>.html','project':'arxiv-scrape','date':'<date>','title':'<demo title>','tag':'demo','redirect_from':[]},\
       {'file':'arxiv-scrape/<date>-nightly.html','project':'arxiv-scrape','date':'<date>','title':'arXiv Nightly — <slug> (<Mon DD>)','tag':'brief','redirect_from':[]}]]; manifest.save(d)"
     ```
   - `git -C ~/code/david-share add arxiv-scrape/ manifest.json && commit && push`. No SSH, no chmod.
     (A separate VPS-side `git -C /opt/share pull` makes it live — the nightly does not SSH to prod.)

6. **Log** to `LOG_nightly.md` (prepend, newest first): date, # papers, the top idea per category, the
   3 demos that competed, which one **won** the build-off and why, and its live URL.

7. **Digest (optional):** if Sage's Discord notify is reachable, post a one-line digest with the demo link.

Rules: stay bounded — the only fan-out is the 3-way build-off + 1 judge; don't run a 200-paper ideation
sweep. Aim for a genuinely cool interactive winner, but the bar is *it must actually run* — a broken
fancy demo loses to a simple working one. Never touch the vigil repo or anything outside arxiv-scrape +
david-share. If a step fails, log it and continue to whatever you can still finish (a brief with no demo
is still worth publishing).
