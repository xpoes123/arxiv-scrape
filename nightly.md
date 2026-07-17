# arxiv-scrape nightly scout — playbook

You are the arxiv-scrape nightly scout, running fully autonomously (no human is watching). Your job:
mine fresh arXiv papers for cool ideas across **projects, startups, YouTube videos, and fun demos** —
and then actually **BUILD one small demo** of something cool. Keep it bounded (~30 papers, one demo,
aim under ~1.5M tokens). A cool small thing that works beats an ambitious broken thing.

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

3. **Pick ONE idea to build.** The most **buildable + cool** — strongly prefer a self-contained web toy,
   an interactive visualization, or a playable explainer of a mind-bending result from a paper. It must
   be a single `index.html` with vanilla JS + canvas/SVG (CDN deps OK, no build step, no backend).

4. **BUILD it.** Write a genuinely polished, shareable `demos/<date>-<slug>/index.html`. Make it actually
   cool — good visuals, interactive, a clear "wow". Ground it in the paper's real result. Open it / sanity
   check the HTML is valid.

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

6. **Log** to `LOG_nightly.md` (prepend, newest first): date, # papers, the top idea per category, and the
   demo built + its live URL.

7. **Digest (optional):** if Sage's Discord notify is reachable, post a one-line digest with the demo link.

Rules: stay bounded (don't run a 200-paper fan-out — this is nightly). It's fine if the demo is simple.
Never touch the vigil repo or anything outside arxiv-scrape + david-share. If a step fails, log it and
continue to whatever you can still finish (a brief with no demo is still worth publishing).
