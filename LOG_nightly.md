# arxiv-scrape nightly log (newest first)

## 2026-07-22 — Lee-Yang Zero Tracker (autonomous run)
- **Papers:** 160 fresh (offset by day-of-year × 3 = 609) across 18/20 categories — econ.EM and stat.ML hit
  transient arXiv read-timeouts even after a retry with an extended (10min) command timeout; still well
  above the ~30 needed for ideation.
- **Sampled:** 30 papers round-robin across the 20 fetched categories for ideation, 6 batches of 5 (batches
  embedded directly in the workflow script, not passed via `args`, per the Jul-18 lesson).
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — Stavid Fair-Split: wires the EF1 paper's parallel envy-graph algorithm into a Stavid
    `/split` command for provably envy-free-up-to-one-item chore/expense allocation (arXiv:2605.16791)
  - startup — Regime-Shift Calibration Auditor — regime-conditioned isotonic calibration + changepoint
    detection to catch a model's confidence buckets silently drifting stale; first customer is SharpLab's
    own NBA props edges (arXiv:2602.23382)
  - youtube — "The Sandwich Theorem That Cuts Ham, Cheese, and Bread With One Slice" — explainer building
    from the 2D ham-sandwich cut up to centerpoints and curved semialgebraic cuts (arXiv:2607.02400)
  - demo — **Lee-Yang Zero Tracker** (arXiv:2606.08004) ← BUILT
- **Built (3-way build-off):**
  - A — Ham-Sandwich Slicer (arXiv:2607.02400): drag 3 colored point clouds, an O(N log N) breakpoint-sweep
    line search recomputes the simultaneous 3-way bisecting cut live every frame; toggles for a Tukey-depth
    centerpoint heatmap and a bisecting-circle "curved knife" mode. Builder independently brute-forced an
    edge case at 5000 angle steps to confirm the 220-step live search finds the true global optimum, not a
    search artifact.
  - B — **Lee-Yang Zero Tracker** (arXiv:2606.08004): exact finite Ising-chain partition function computed
    as a degree-N polynomial via an O(N²) transfer-matrix DP, roots found live by a hand-rolled Durand-Kerner
    solver and plotted in the complex plane; a "defect bond" slider peels zeros off the unit circle (Lee-Yang
    circle theorem, exact at drive=1) while a highlighted island migrates toward the real axis, tracked in a
    second live chart. Builder cross-checked DP coefficients against 2^N brute-force enumeration and a
    hand-derived N=2 closed form (both matched to ~1e-16) before wiring up the UI.
  - C — The Hysteresis Loop You Can Drive (arXiv:2511.14090): a population does noisy hill-climbing on an
    oscillating two-peak fitness landscape, lagging into a hysteresis loop on a synced Chart.js plot; a
    sweep button reproduces the paper's counterintuitive finding that average fitness peaks at moderate
    drift, not zero or chaos. Verified live in headless Chromium across low/high-drift extremes.
  - **Judge's pick: B, Lee-Yang Zero Tracker** — all three ran clean (zero console/page errors in headless
    Playwright testing, every control exercised). B won on the tie-break: Lee-Yang zeros are a genuinely
    opaque concept almost nobody has intuition for, and watching the circle theorem visibly shatter as the
    defect slider moves makes it click instantly — more "aha" than the already-intuitive ham-sandwich cut,
    and cleaner than the hysteresis demo's occasionally-noisy loop trace.
- **Published:** demo at
  [share.djiang.xyz/arxiv-scrape/demos/2026-07-22-lee-yang.html](https://share.djiang.xyz/arxiv-scrape/demos/2026-07-22-lee-yang.html),
  brief at
  [share.djiang.xyz/arxiv-scrape/2026-07-22-nightly.html](https://share.djiang.xyz/arxiv-scrape/2026-07-22-nightly.html)
  — committed + pushed to `xpoes123/david-share` (commit `dbb5fae`); VPS pull is separate/manual, not done
  by this run. Left pre-existing uncommitted `app/*` changes (dated 2026-07-17, unrelated to tonight)
  untouched in the working tree.

## 2026-07-21 — Sync or Swing (Kuramoto phase-lag) (autonomous run)
- **Papers:** 144 fresh (offset by day-of-year × 3 = 603) across 18/22 categories — first 4 (cs.LG, cs.AI,
  cs.CL, cs.CR) hit transient arXiv 429/timeouts even after padding inter-category sleep from 3.1s to 5.0s
  following a full-batch 429 on the first attempt; still well above the ~30 needed for ideation.
- **Sampled:** 30 papers round-robin across the 18 successful categories for ideation, 6 batches of 5
  (batches embedded directly in the workflow script, not passed via `args`, per the Jul-18 lesson).
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — Prop Fan Charts: generative predictive distributions for NBA player props — swaps the
    point-forecast + hand-fit-variance props pipeline for a diffusion/flow head producing calibrated
    per-stat "fan chart" distributions, edge computed as P(over) vs. book-implied (arXiv:2606.16773)
  - startup — Attribution Copilot — GPT-4 agent performs real Brinson-Fachler performance attribution +
    narrates client-ready commentary, undercutting a human analyst or Bloomberg/FactSet module for solo RIAs
    (arXiv:2403.10482)
  - youtube — "The Metric That Catches Fake Long-Term Wins" — explainer on the Proximal Surrogate Index,
    recovering true long-term causal effects from confounded short-term proxies via two negative controls
    (arXiv:2601.17712)
  - demo — **Sync or Swing: The Phase-Lag Kuramoto Playground** (arXiv:2606.07002) ← BUILT
- **Built (3-way build-off):**
  - A — Arithmetic Random Waves (arXiv:2606.08650): pick eigenvalue λ, render the toral eigenfunction
    standing wave from every lattice point with n₁²+n₂²=λ as a live heatmap with nodal lines; r₂(λ)
    sum-of-two-squares count shown live, verified bit-exact against the closed-form Jacobi formula for
    λ=1..300 (zero mismatches). Builder caught and fixed an out-of-range preset chip during verification.
  - B — The Dream Machine (arXiv:2602.04095): real Hebbian-outer-product Hopfield network you teach by
    drawing patterns; a "dreaming" twin gets noise-seeded sleep-replay cycles between lessons, resisting
    catastrophic forgetting on corrupt-and-recall tests that the no-dream twin fails. Verified live in
    headless Chromium with screenshots of the actual forgetting/retention effect (74% vs 100% recall).
  - C — **Sync or Swing** (arXiv:2606.07002): live RK4 simulation of the second-order (inertial)
    Kuramoto-Sakaguchi model — 64 phase-colored oscillators on a ring, live order-parameter r(t) chart,
    sliders for coupling K / inertia m / phase-lag α, plus a K-sweep hysteresis mode. Builder validated the
    physics standalone in Node before building the UI (found random unimodal frequencies gave no effect;
    a bimodal ω split was needed), then verified live in headless Chromium: α=0 → r thrashes ~0.5-0.7
    (incoherent), raising α to the marked "sweet spot" ≈0.25 rad → r rises to 0.96 (locked/synchronized) —
    the paper's counterintuitive headline result, reproduced quantitatively in the browser.
  - **Judge's pick: C, Sync or Swing** — all three ran clean (zero console/page errors in headless
    Playwright testing, every control exercised). C won because its interaction loop *is* the paper's actual
    result reproduced live and quantitatively, not just gestured at, combined with the richest genuine
    interactivity (5 working controls) and the most "alive" continuous-physics visualization. Judge flagged
    one cosmetic dead-code line in the winner (unused `vx` variable from an earlier draft) — removed before
    publish.
- **Published (git push only):**
  - https://share.djiang.xyz/arxiv-scrape/demos/2026-07-21-kuramoto-inertia.html
  - https://share.djiang.xyz/arxiv-scrape/2026-07-21-nightly.html
  - david-share commit fefc2d9. LIVE after VPS `git -C /opt/share pull`.

## 2026-07-20 — Ford Circles Fractal Zoom (autonomous run)
- **Papers:** 176 fresh (offset by day-of-year × 3 = 603) across 22 categories; no rate-limiting tonight,
  clean single-pass fetch.
- **Sampled:** 30 papers round-robin across all 22 categories for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — Zero-shot lineup synergy: a multiplex network for untested NBA five-man units (topology-aware
    graph tokenizer + contrastive distillation, repointed at basketball, arXiv:2603.06618)
  - startup — Generative Robust Bankroll Sizing (Wasserstein Adversarial Autoencoder uncertainty sets for
    robust MIP position sizing, arXiv:2606.22536)
  - youtube — "The Fold That Unfolds Itself" (origami deployment as a heteroclinic orbit, not energy release,
    arXiv:2605.04473)
  - demo — **Ford Circles Fractal Zoom** (bounded-type continued fraction sets, arXiv:2606.07139) ← BUILT
- **Built (3-way build-off):**
  - A — Heteroclinic Fold (arXiv:2605.04473): origami crease-chain folding cascade driven by a real Möbius
    recurrence (coupling-asymmetry slider controls front propagate/stall via the linearized eigenvalue),
    shape independently programmable from deployment timing. Builder caught and fixed a real terminal-hinge
    off-by-half-window bug via standalone Node math verification before shipping.
  - B — **Ford Circles Fractal Zoom** (arXiv:2606.07139): pannable/zoomable canvas of Ford circles
    (radius 1/(2q²) per fraction p/q) generated via exact Stern-Brocot pruning, a max-partial-quotient
    k-slider filtering down to bounded-type continued-fraction sets, live box-counting Hausdorff-dimension
    estimate, animated fly-to on 1/φ revealing the golden-ratio convergent spiral. Builder fixed a blank-zoom
    bug at extreme depth (fixed-margin pruning breaking at scale → switched to exact interval-overlap
    pruning) and a camera-drift edge case.
  - C — Lights Out, Solved by Algebra (arXiv:2605.14093): playable Lights Out solved via real GF(2)
    Gauss-Jordan elimination, animated pivot-by-pivot, with a race mode pitting naive vs. occurrence-aware
    (low-degree-first) pivot order on the same scrambled board — occurrence-aware won 200/200 in standalone
    trials.
  - **Judge's pick: B, Ford Circles Fractal Zoom** — all three passed "does it run" (verified live via
    headless Chromium with real drag/zoom/click interaction, zero console errors). B won on the strongest
    combination of wow-factor and interactivity (real pan/zoom/pinch/hover/animated camera flights) while
    being the most mathematically faithful of the three — every visual element ties directly to the paper's
    actual construction.
- **Published (git push only):**
  - https://share.djiang.xyz/arxiv-scrape/demos/2026-07-20-ford-circles.html
  - https://share.djiang.xyz/arxiv-scrape/2026-07-20-nightly.html
  - david-share commit 4110577. LIVE after VPS `git -C /opt/share pull`.

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