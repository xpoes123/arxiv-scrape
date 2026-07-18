# arxiv-scrape nightly log (newest first)

## 2026-07-18 — The Tattered Cloak (autonomous run)
- **Papers:** 88 fresh (offset by day-of-year × 3) across 22 categories; hit arXiv rate-limiting (429s) partway
  through the fetch and continued with the partial haul rather than retrying further (11 categories succeeded,
  11 hit 429/timeout) — still well above the ~30 needed for ideation.
- **Sampled:** 30 papers round-robin across the 11 successful categories for ideation, 6 batches of 5.
  (Note: the Workflow `args` param got serialized as a string on the first attempt, silently blowing up the
  batch loop into 3000+ single-character "batches" — fixed by embedding the paper list directly in the
  workflow script instead of passing it via `args`.)
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - startup — CacheGuard: Risk-Budgeted Freshness Middleware for RAG (temporal-risk semantic caching, arXiv:2607.04281)
  - youtube — "The Ion That Waited: Hunting CCH+ in the Orion Bar" (leak-out spectroscopy guiding first CCH+
    detection in space, arXiv:2605.00564)
  - demo — **The Tattered Cloak: Watch a Mixer Get Unmixed** (Railgun de-anonymization heuristics, arXiv:2606.25926) ← BUILT
  - (no "project"-tagged ideas surfaced this run)
- **Built (3-way build-off):**
  - A — Beat the LLM Causal Detective (arXiv:2607.04293): replayable causal-mystery game scored against the
    paper's 68%/78-85%/5-7% stats.
  - B — Random Walk Society: Watering-Hole Networks (arXiv:2511.11130): pairwise-graph vs. hypergraph toggle
    catching "illusion triangle" social cliques that never actually gathered.
  - C — **The Tattered Cloak** (arXiv:2606.25926): D3 radial anonymity-bits gauge + five toggleable
    de-anonymization heuristics progressively unmixing a synthetic Railgun pool, tuned to reproduce the
    paper's real 17.65%-linked / 3.42-bit numbers almost exactly (dataset converged to 17.65% / 3.46 bits).
  - **Judge's pick: C, The Tattered Cloak** — all three demos passed "does it run" (verified live via headless
    Chromium), but C won on visual polish (glowing draw-on link animations, radial gauge), genuine 5-toggle
    interactivity, and the tightest numerical fidelity to the source paper.
- **Published (git push only):**
  - https://share.djiang.xyz/arxiv-scrape/demos/2026-07-18-tattered-cloak.html
  - https://share.djiang.xyz/arxiv-scrape/2026-07-18-nightly.html
  - david-share commit 0d699c5. LIVE after VPS `git -C /opt/share pull`.

## 2026-07-17 — Maximin Spacing (autonomous run)
- **Papers:** 176 fresh (offset by day-of-year × 3) across 22 categories; hit arXiv rate-limiting (429s) on the
  first fetch attempt, backed off ~90s, retried successfully.
- **Sampled:** 30 papers round-robin across categories for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — The Ratchet of Doom: Muller's Ratchet Simulator (Fleming-Viot SDE clicking, arXiv:2606.15842)
  - startup — TrustScope: Agent Reputation Audits (ERC-8004 Sybil detection, arXiv:2606.26028)
  - youtube — "Why No Algorithm Can Solve This Game (in Your Lifetime)" (exponential min-max query complexity, arXiv:2605.13806)
  - demo — **Maximin Spacing: Beat the Optimal Gap-Packer** (threshold-resetting random walk, arXiv:2606.04837) ← BUILT
- **Built:** interactive gap-partitioning puzzle — click dividers to split random gaps into M blocks maximizing the
  minimum block sum, then reveal the provably optimal packing (binary-search + greedy optimum, verified against
  brute force over 200 random trials). Includes a "run 500 trials" live histogram of the optimal-value
  distribution. Self-contained index.html (canvas, no deps).
- **Published (git push only):**
  - https://share.djiang.xyz/arxiv-scrape/demos/2026-07-17-maximin-spacing.html
  - https://share.djiang.xyz/arxiv-scrape/2026-07-17-nightly.html
  - david-share commit c041376. LIVE after VPS `git -C /opt/share pull`.

## 2026-07-15 — Hawk Wing Composer (supervised proof run)
- **Papers:** 44 fresh (offset by day-of-year), 9 batches.
- **Ideas:** 37 generated, 21 demo-grade. Ranked by cool×buildable.
- **Top per category:**
  - project — Prediction Alpha Decay Dashboard (LOBFrame F1-vs-alpha, arXiv:2403.09267)
  - startup — LLM Memory Surgery (certified fact erasure, arXiv:2606.23276)
  - youtube — "Why Your AI Can't Actually Forget" (arXiv:2606.23276)
  - demo — **Hawk Wing Composer** (DMD modal hawk flight, arXiv:2602.19196) ← BUILT
- **Built:** interactive 4-slider DMD hawk-flight demo, self-contained index.html (canvas, no deps).
- **Published (git push only):**
  - https://share.djiang.xyz/arxiv-scrape/2026-07-15-hawk-wing-composer.html
  - https://share.djiang.xyz/arxiv-scrape/2026-07-15-nightly.html
  - david-share commit ee3985e. LIVE after VPS `git -C /opt/share pull`.