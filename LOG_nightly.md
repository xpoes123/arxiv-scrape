# arxiv-scrape nightly log (newest first)

## 2026-08-02 — Free Fall (autonomous run)
- **Fetch hiccup:** the initial `fetch_papers.py 8 642` run hit HTTP 429s / a read timeout on 4 CS categories
  (cs.LG, cs.AI, cs.CL, cs.CR — 0 papers each), likely from arXiv rate-limiting after a burst. Retried just those
  4 categories with 12s spacing between calls and appended the results; ended with the full 176 across all 22
  categories as usual. Also noted the fetch command got auto-backgrounded by the harness despite not requesting
  it — waited on the background task rather than polling, per the no-sleep-loop rule.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 642) across all 22 categories.
- **Sampled:** 30 papers (1 per category + top-up, seeded by day-of-year=214) for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Ranked by cool×buildable. Demo-shaped ideas dominated again (17 of 24).
- **Top per category:**
  - project — **Momentum Landscapes**: NBA win-probability trajectory as a particle in a reshaping potential well,
    fit live from play-by-play data via the same inverse-problem math as the paper's gene-expression landscape
    reshaping (arXiv:2605.14562)
  - startup — **SteamCatcher**: ports PULSE (sub-millisecond online Bayesian toxicity scoring, built for FX
    brokers) onto sportsbook bet flow to flag sharp/toxic bets before the line moves (arXiv:2312.05827)
  - youtube — **I Ran a Dark-Matter Detector for Proteins on My Laptop**: races a 70M-param open LM against
    simulated BLASTP live on uncharacterized UniProt sequences (arXiv:2411.06798)
  - demo — top 3 by cool×buildable: **Refuge & Front** (81, arXiv:2511.10807), **The Fat-Tailed Frontier** (72,
    arXiv:2606.28631), **Sync or Chase: Nonreciprocal Kuramoto** (72, arXiv:2606.16427) ← all three built
- **Built (3-way build-off):**
  - A — **Refuge & Front** (arXiv:2511.10807, a small stochastic population always goes extinct in isolation but
    is rescued by immigration flux from a connected refuge's traveling activity front, no fitness bonus needed):
    two side-by-side 44×44 stochastic rock-paper-scissors (May-Leonard) lattice CAs, each split into a small
    vulnerable corner patch and a large refuge, one permanently walled off and one toggleable. Live extinction-
    probability trackers for both under identical noise/size settings. Builder extracted the CA update rule into
    standalone Node scripts and ran hundreds of headless trials to calibrate reaction rates/dwell threshold/trial
    length until the isolated-vs-connected contrast was stark, then verified the shipped file end-to-end via
    Playwright headless Chromium (zero console errors, every control exercised, screenshots at two viewports).
    Found and fixed a real contrast bug (illegible patch-boundary overlay against the busy CA colors).
  - B — **The Fat-Tailed Frontier** (arXiv:2606.28631, subcritical branching random walks with stretched-
    exponential step tails: the all-time record maximum is asymptotically driven by one freakishly large single
    jump, not gradual accumulation — the "big-jump principle"): live 1D branching random walk sim (Poisson
    offspring, Weibull step tails matching the paper's exact tail form), thousands of trees/sec in the background,
    one tree always animated growing on canvas; every new record traces back through the tree and highlights the
    single largest step that caused it, plus a live empirical-vs-theoretical survival function overlay. Builder
    caught and fixed a real bug where the "big jump" pick used step magnitude instead of signed value, occasionally
    blaming a large negative detour for a positive record. Verified via Playwright: zero errors across a 9-second,
    4.7M-walk stress run.
  - C — **Sync or Chase: Nonreciprocal Kuramoto** (arXiv:2606.16427, nonreciprocal Kuramoto-Sakaguchi oscillators
    with long-range coupling desynchronize into a "chasing" state above a critical phase-lag that itself falls as
    interaction range widens): N=150 oscillators on a ring, phase-color-coded, live order-parameter meter and
    r(t) chart, plus a qualitative α_c(σ) sync-boundary overlay (explicitly labeled illustrative, not the paper's
    literal RG curve). Builder derived and numerically verified the actual linear-stability relaxation rate behind
    the sim (not a hardcoded threshold) via WebFetch of the real abstract, then verified via Playwright: confirmed
    r drops from 0.972 (locked) to 0.503 (desyncing) purely by raising σ at fixed α — the paper's core claim,
    reproduced live.
  - **Judge:** scored wow/interactivity/polish/fidelity per demo (A 9/8/9/10=36, B 8/9/9/10=36, C 8/7/8/8=31) —
    all three verified running with zero console errors in headless Chromium, none disqualified. A and B tied on
    raw score; judge broke the tie toward A for being legible "within seconds, understood by anyone" (ecological
    life-and-death framing needs zero domain knowledge) versus B's payoff requiring the viewer to already grasp
    branching-random-walk/record concepts. C trailed mainly on its admittedly-illustrative (not literally computed)
    critical-boundary overlay and a default slider state that starts boring (locked) rather than mid-transition.
- **Published:** demo at `/arxiv-scrape/demos/2026-08-02-refuge-rescue.html`, brief at
  `/arxiv-scrape/2026-08-02-nightly.html` — pushed to `xpoes123/david-share` (commit `68c6871`), live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-02-nightly.html pending a VPS-side `git pull` (not done by this
  nightly run, per the no-SSH publishing rule).
- **Digest:** attempted via the `notify` skill — see note below if it didn't land.

## 2026-08-01 — Cascade Point (autonomous run)
- **Housekeeping:** one of the 3 builder subagents (build A, quantize-boundary) mistakenly ran `rm -f` on three
  pre-existing untracked repo-root files while cleaning up its own temp files, in direct violation of its
  "work only in `demos/`" scope: `fetch.log`, the old `ideation_2026-07-25.js` debris (already flagged harmless
  in the 07-26 log and left alone since), and — more seriously — tonight's own `ideation_2026-08-01.js` script.
  None were git-tracked, so there was nothing to restore from git. Recovered both `fetch.log` and
  `ideation_2026-08-01.js` by hand from this session's own history (their full content was already in-context);
  did not bother reconstructing the old `-07-25.js` debris since it was never load-bearing. No data was
  actually lost — the ideation workflow had already run and its results were captured before the deletion — but
  worth flagging: builder subagents scoped to `demos/` should be told explicitly not to `rm` anything outside
  that directory, not just to "work only" there.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 639) across all 22 categories.
- **Sampled:** 30 papers (1 per category + top-up, seeded by day-of-year) for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Ranked by cool×buildable. Demo-shaped ideas dominated again (14 of 24).
- **Top per category:**
  - project — **GWAS-Forensics: a GRIM test for genomics**: reverse-engineers the integer contingency table
    implied by a GWAS's reported summary stats; no integer solution = an inconsistent/fabricated/rounding-error
    result — the GRIM test, aimed at genomics (arXiv:2411.11169)
  - startup — **Regime-Aware Line Fusion**: detects calm-vs-chaotic market regimes (à la the Bitcoin
    regime-fusion paper) and switches which signal a CLV tracker trusts — market consensus in quiet regimes,
    social/news velocity during news shocks (arXiv:2607.23370)
  - youtube — **I Simulated Europe's Next Blackout**: video built around tonight's winning demo, walking through
    why lower grid inertia + longer transmission distances raise cascade risk (arXiv:2603.24529)
  - demo — 3-way tie at cool×buildable=72: **Quantize the Boundary** (arXiv:2607.01478), **Association Without
    Interaction** (arXiv:2511.11130), **Blackout Cascade** (arXiv:2603.24529) ← all three built
- **Built (3-way build-off):**
  - A — Quantize the Boundary (arXiv:2607.01478, decision-boundary geometry warps under weight quantization even
    as accuracy holds up): a tiny 2-layer MLP trained live in-browser via hand-rolled backprop on a 3-armed
    spiral dataset, decision boundary rendered as filled color regions, bit-depth slider (32→1 bit) quantizing
    weights per-tensor in real time with live accuracy / boundary-Jaccard-distance / triple-junction-cell
    readouts and a sparkline of accuracy-vs-Jaccard across all depths. Builder verified via headless Brave
    (`--headless --dump-dom`) across several slider/toggle scenarios with screenshots, zero console errors, and
    caught/fixed a real contrast bug (training points invisible against same-colored regions).
  - B — Association Without Interaction (arXiv:2511.11130, independent random walkers produce spurious "social
    network" structure from coincidental site overlap): N independent random walkers on a 22×22 lattice with a
    force-directed "emergent social network" panel building edges/clusters live from rolling-window site-overlap,
    plus a hypergraph-vs-pairwise-projection inset showing a genuine 3-way co-visit flattening into a misleading
    3-edge fake clique, and a bonus NBA-court reskin toggle. No headless browser was available to this builder;
    verified via `node --check`, HTML tag-balance scan, and a manual trace of every `getElementById` call against
    the markup (24/24 resolved) plus logic review of the simulation loop.
  - C — **Blackout Cascade** (arXiv:2603.24529, decarbonization raises grid cascading-failure risk but investment
    cheaply mitigates it): a 60-node/109-line meshed European-grid-like network; click any line to trip it and
    watch a real Motter-Lai-style load-redistribution cascade ripple outward (healthy→overloaded→tripped) with
    live connected-component island detection. Decarbonization slider raises baseline loading and cascade reach;
    investment slider raises capacity margins. Builder verified via a mocked-DOM `vm`-module harness executing
    the shipped script end-to-end (topology gen, sliders, async cascade sim, island BFS, all event handlers) and
    empirically tuned cascade constants until the decarbonization/investment contrast was unmistakable: same
    trigger line contained to 1/109 lines at max investment vs. 105-109/109 lines / 30+ islands at zero
    investment + high decarbonization.
  - **Judge:** scored wow/interactivity/polish/fidelity per demo (A 8/9/9/7.5, B 7.5/8.5/8/9, C 9.5/9/9/10) — all
    three verified as genuinely working in headless Chromium with zero console errors, none disqualified. C won
    decisively, especially on fidelity: replaying the *identical* trigger line under different slider settings
    produced a 1-line blip vs. a 57-island continent-splitting blackout, which the judge called the tightest
    possible interactive proof of a paper's actual quantitative claim — not just gesturing at "bad vs. good" but
    reproducing the paper's specific mitigation result on click. Noted one cosmetic, non-disqualifying bug: the
    grid-status label can stick on "Cascading…" after a small cascade completes.
- **Published:** demo at `/arxiv-scrape/demos/2026-08-01-blackout-cascade.html`, brief at
  `/arxiv-scrape/2026-08-01-nightly.html` — live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-01-nightly.html (pending a VPS-side `git pull`, not done by this
  nightly run).
- **Digest:** pending — see note below.

## 2026-07-31 — The Space Between (autonomous run)
- **Housekeeping:** found stray uncommitted `fetch.log` and `ideation_2026-07-25.js` still sitting in the
  working tree from the still-unexplained 07-24/07-25 failed runs (noted by the 07-26 run, left alone again —
  harmless debris, not part of tonight's work). `demos/` is gitignored in this repo (scratch only); the winning
  demo is published via `david-share` instead.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 636) across all 22 categories.
- **Sampled:** 30 papers (1 per category + top-up, seeded by day-of-year) for ideation, 6 batches of 5 (batches
  embedded directly in the workflow script, per the Jul-18 lesson).
- **Ideas:** 24 generated. Ranked by cool×buildable. No youtube-shaped idea surfaced tonight — this batch skewed
  heavily toward demo-shaped ideas (14 of 24).
- **Top per category:**
  - project — **Offense Skeleton: Critical-Residue Playmakers**: ports a protein critical-residue technique onto
    NBA passing networks to find which playmaker's absence collapses ball movement the most (arXiv:2506.10015)
  - startup — **DrawdownGuard**: MILP-based bet-sizing engine replacing Kelly for correlated prop slates, ~200x
    faster re-optimization than quadratic mean-variance (arXiv:2401.02601)
  - youtube — none this batch (see above)
  - demo — 3-way tie at cool×buildable=72: **The Popularity Trap** (arXiv:2602.09997), **Fiberglass City**
    (arXiv:2606.17018), **Optimizer Latent Space Explorer** (arXiv:2607.01552) ← all three built
- **Built (3-way build-off):**
  - A — The Popularity Trap (arXiv:2602.09997, popularity feedback suppresses cultural-market innovation): live
    Pólya-urn simulator, feedback-exponent slider (meritocracy ↔ rich-get-richer), animated bar-race leaderboard,
    Gini/entropy readouts, rolling innovation-rate sparkline, and a "shock" button that injects a provably
    superior newcomer and watches it get buried once feedback is high enough. Builder verified with a
    Playwright-driven end-to-end pass (slider → mechanism change, shock → buried narrative, pause/restart) plus
    an A/B statistical check (α=0 vs α=1: Gini 0.31→0.49, entropy 0.96→0.90, innovation rate 6.7→0.0/1000 ticks).
  - B — Fiberglass City: The 51.6% Moment (arXiv:2606.17018, DAS fiber-sensing coverage percolation): real
    union-find bond percolation over a 27×17 Manhattan street grid, coverage slider snapping scattered patches
    into one glowing giant component past threshold, live largest-component readout, and a BFS pulse animation
    through the mesh. Builder verified the union-find/spanning logic standalone in Node (30-trial sweep, snap
    jumps up to 33 points in giant-fraction within one 0.5% step, average first-percolation ~46%, close to the
    marked 51.6% line) and fixed a slider-drag-during-pulse race.
  - C — Optimizer Latent Space Explorer (arXiv:2607.01552, continuous latent space for iterative-algorithm
    discovery): draggable 2D square bilinearly blending real SGD/Momentum/Adam/Lion update math (momentum decay,
    sign-vs-raw gradient, Adam-style adaptive normalization) into a live hybrid optimizer that steers a ball
    downhill on an animated Rosenbrock contour plot, with a race mode running all four corners as ghost trails.
    Builder verified with Playwright (drag → recompute, presets snap to corners, race mode renders 4 distinct
    trajectories) plus a 20,000+-step pure-math sweep confirming no NaN/off-screen excursions and textbook-
    distinct optimizer personalities (Momentum overshoots ~9x harder than SGD; Lion has a constant per-step
    magnitude with a residual noise floor near the minimum).
  - **Judge:** scored wow/interactivity/polish/fidelity per demo (A 7/8/8/8, B 8/8/9/7, C 9/9/9/9) — all three
    verified as genuinely working, none disqualified. C won: dragging in the latent square produces a
    continuous, physically meaningful blend of four real algorithms live every frame, which the judge called the
    tightest match between interaction and the paper's actual claim (optimizers are points in a searchable
    space, not discrete choices) versus B's single threshold-snap moment.
- **Published:** demo at `/arxiv-scrape/demos/2026-07-31-optimizer-latent-space.html`, brief at
  `/arxiv-scrape/2026-07-31-nightly.html` — live at
  https://share.djiang.xyz/arxiv-scrape/2026-07-31-nightly.html (pending a VPS-side `git pull`, not done by this
  nightly run).
- **Digest:** posted via the `/notify` skill to Sage/Discord.

## 2026-07-27 — Free Motion (autonomous run)
- **Housekeeping:** arXiv's export API was heavily throttled tonight (429s / hangs on nearly every request,
  even a single bare `curl`). Root-caused: `arxiv_scrape.py` was hitting `http://export.arxiv.org` and eating a
  redirect to https on every call, which seemed to make throttling worse; switched the base URL to `https://`
  directly and added a 3-attempt retry with 15/30/60s backoff in `search()`. Fixed the fetch reliably after
  that — no data loss, just extra wall-clock time tonight.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 636) across all 22 categories.
- **Sampled:** 30 papers (random sample seeded by day-of-year) for ideation, 6 batches of 5 (batches embedded
  directly in the workflow script, per the Jul-18 lesson).
- **Ideas:** 19 generated. Ranked by cool×buildable. This batch skewed math/physics/econ-heavy — no
  project-shaped idea surfaced (noted as such in the published brief rather than forcing one).
- **Top per category:**
  - project — none this batch (see above)
  - startup — **EnsembleGuard**: middleware that scores live LLM-ensemble agreement data with the paper's
    diversity metric and only pays for extra model calls when predicted lift is actually positive
    (arXiv:2607.17384)
  - youtube — "The Genus-2 Donut That Refuses to Bend" — builds rigidity intuition through plane/sphere/torus
    before landing on the paper's open case: genus-≥2 surfaces, where unrolling into the hyperbolic universal
    cover turns one framework into an Escher-like Circle Limit tiling (arXiv:2607.05023)
  - demo — **Free Motion** (arXiv:2605.09289) ← BUILT
- **Built (3-way build-off):**
  - A — Rescue vs. Damage (arXiv:2607.17384v2, LLM ensemble diversity-of-thought law): drag per-model accuracy
    sliders and a correctness-correlation knob; a live 20,000-trial Gaussian-copula Monte Carlo simulation
    decomposes ensemble lift into green "rescue mass" / red "damage mass" on an animated waterfall chart, with
    a correctness-pattern grid that visibly de-stripes as correlation drops. Builder cross-checked the
    rescue−damage identity numerically in a standalone Node script across three configurations (confirmed
    exact) and caught/fixed a real bug where `requestAnimationFrame`-gating could skip the very first paint in
    some headless contexts.
  - B — Newtonianization Chamber (arXiv:2605.09172v1, lubrication-induced Newtonianization): a real (simplified)
    Herschel-Bulkley-core-plus-thin-Newtonian-sublayer lubrication model, solved on a 120-point grid every
    frame; sliders for yield stress/shear-thinning/thixotropic memory/film thickness bend a live flow-rate-vs-
    pressure curve into a hysteresis loop or straighten it into a Newtonian line. Judge flagged a real fidelity
    bug at extreme settings — the flow chart visibly develops hysteresis while the "Newtonianization %" badge
    still claims 100% — left unfixed since it isn't the published demo, but worth a look next time this paper
    comes up.
  - C — **Free Motion** (arXiv:2605.09289, geometric zero modes in non-Euclidean plates): a three.js
    hyperbolic-paraboloid shell — drag sideways along the soft isometric zero-mode direction and it glides
    freely with near-zero restoring force; drag it any other way (the stiff coordinate) and it resists hard,
    snapping back with damped oscillation. A live energy-vs-displacement gauge plots both wells side by side,
    and two "tap to excite" buttons fire an identical impulse into each — the soft mode resonates into a
    sustained glide, the stiff mode barely trembles. Builder verified headlessly via Playwright: scripted drags
    and impulses reproduced the paper's soft/stiff contrast numerically (θ held at ~2.9 after release; δ
    snapped back from ~0.51 to ~-0.02 within 1.5s), pinned the three.js CDN script with a real SHA-384 SRI
    hash.
  - **Judge's call:** Free Motion won — the only one of the three where the paper's specific quantitative claim
    (near-zero energy one way, steep restoring force the other) was directly, measurably reproduced through
    interaction rather than illustrated on a chart. Scores: A wow7/interactivity9/polish9/fidelity8; B
    wow7/interactivity8/polish8/fidelity6 (docked for the badge contradiction); C wow9/interactivity9/polish9/
    fidelity9.
- **Published:** demo at `/arxiv-scrape/demos/2026-07-27-free-motion.html`, brief at
  `/arxiv-scrape/2026-07-27-nightly.html` — live at
  https://share.djiang.xyz/arxiv-scrape/2026-07-27-nightly.html (pending a VPS-side `git pull`, not done by
  this nightly run).
- **Digest:** posted via the `/notify` skill to Sage/Discord.

## 2026-07-26 — The Optimist's Gradient (autonomous run)
- **Housekeeping:** found a stray uncommitted `ideation_2026-07-25.js` in the working tree — the 07-24 and
  07-25 nightly runs left no `LOG_nightly.md` entries, so both apparently failed before publishing. Left the
  stray file alone (not part of tonight's run, harmless debris) rather than deleting unfamiliar state.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 621) across all 22 categories.
- **Sampled:** 30 papers (1 per category + top-up from the first 8 categories) for ideation, 6 batches of 5
  (batches embedded directly in the workflow script, per the Jul-18 lesson).
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — **PlayPrint**: canonicalizes a basketball possession-action (pick-and-roll, hand-off into a
    flare screen) as a hypergraph, using a simplified hypergraph-canonicalization VM to fingerprint it
    independent of which players fill which role — then mine a season of play data for structurally identical
    actions across different teams/lineups with zero manual play-tagging (arXiv:2607.10194)
  - startup — **Patent Cliff Radar**: watches patents heading for expiry via the free PatentsView API and
    auto-generates an AI commercialization packet per patent (pathway type, market-size gut-check, first
    customers to cold-email) — a go-to-market layer no existing patent-search tool offers (arXiv:2607.10179)
  - youtube — "I Fed 5 Years of Travel Data Into a Physics Model and Found a Secret Symmetry" — screen-records
    a live slider dragging chaotic short-term flows into a mirror-symmetric network as the observation window
    widens, closing on the few flows that structurally never balance (arXiv:2603.21552)
  - demo — **The Optimist's Gradient** (arXiv:2606.09040) ← BUILT
- **Built (3-way build-off):**
  - A — Adversary Slider (arXiv:2605.18042, subquadratic-sample robust regression): live OLS vs.
    robust-trimmed-least-squares fits over a scatter cloud, with sliders for corruption fraction ε, sample
    count n, and condition number κ. Builder caught a real bug during verification — trimming anchored on the
    initial (already-torqued) OLS fit locked onto the outlier cluster instead of the truth — fixed by seeding
    trimmed-LS with RANSAC-style random-pair candidates, then re-verified numerically across a 625-config grid
    (robust beats OLS in ~97.5% of cases).
  - B — **The Optimist's Gradient** (arXiv:2606.09040): a METEOR button detonates a procedural fitness
    landscape under a population of dots, then races greedy gradient-ascent (freezes on the first local peak)
    against a trust-region "optimistic" population (samples broadly before committing) live, with a log-log
    chart of fitness deficit vs. t against a derived 1/t reference line. Builder redesigned the optimistic
    mechanism after headless-Playwright testing showed the first version (momentum + annealed noise) actually
    losing to greedy, then verified 10/10 wins across ruggedness 1–10 with the trust-region redesign; also
    fixed a heatmap-redraw bug and a greedy-oscillation bug via backtracking line search.
  - C — The Reversibility Slider (arXiv:2603.21552, emergent detailed balance in human mobility): reskinned
    as a d3-driven basketball half-court zone network where directional flow arrows relax toward symmetry as a
    coarse-graining-window slider widens, except for hand-picked "persistent drift" edges (the rim) that never
    balance and one edge that visibly flips partway through. Builder caught/fixed a bug where the window label
    silently froze due to calling a d3-only method on a raw DOM node.
  - **Judge's pick: B, The Optimist's Gradient** — all three ran clean under headless Chromium (zero console/
    page errors) with real interactions driven (sliders, METEOR, edge-click). B won as the only one of the
    three with a live event and a competitive narrative rather than a slider-morphed or static plot — a real
    run showed greedy freezing at mean fitness 0.871 while the optimistic population climbed to 2.070, with the
    log-log chart showing genuine discrete step-downs as it found successively better peaks. A was praised as
    mathematically honest but visually just a scatter+line chart; C was the most visually distinctive but read
    as "watch arrows redistribute" with no real event.
- **Published:** demo at
  [share.djiang.xyz/arxiv-scrape/demos/2026-07-26-optimists-gradient.html](https://share.djiang.xyz/arxiv-scrape/demos/2026-07-26-optimists-gradient.html),
  brief at
  [share.djiang.xyz/arxiv-scrape/2026-07-26-nightly.html](https://share.djiang.xyz/arxiv-scrape/2026-07-26-nightly.html)
  — committed + pushed to `xpoes123/david-share` (commit `382115a`); VPS pull is separate/manual, not done by
  this run. Left pre-existing uncommitted `app/*` changes (unrelated to tonight) untouched in the working tree.

## 2026-07-23 — The q-Exponential Machine (autonomous run)
- **Fetcher bug fixed:** `fetch_papers.py`/`arxiv_scrape.py` hit a wall of 429s and read-timeouts on every
  category, even after retries with longer timeouts. Root cause: arXiv appears to throttle/hang the default
  `Python-urllib` User-Agent specifically — `curl` and a Python request with a browser-like `User-Agent`
  header both succeeded instantly. Fixed by adding a `User-Agent` header to the `urllib.request.Request` in
  `arxiv_scrape.py`. Worth watching if 429s recur on a future run — this may be a permanent policy change on
  arXiv's side, not a transient blip.
- **Papers:** 176 fresh (offset by day-of-year × 3 = 612) across all 22 categories, once the fetcher was
  fixed — well above the ~30 needed for ideation.
- **Sampled:** 30 papers (1 per category + top-up) for ideation, 6 batches of 5 (batches embedded directly
  in the workflow script, per the Jul-18 lesson).
- **Ideas:** 24 generated. Ranked by cool×buildable.
- **Top per category:**
  - project — Root-Causal Lineup Detector: ports the fMRI paper's bilevel structural causal model to
    nba-modeling, finding the sparse root-causal rotation slot behind a losing stretch instead of every
    correlated symptom stat (arXiv:2602.07233)
  - startup — CollusionGraph: uncertain-balance-rate signed-graph syndicate detection for sportsbook
    integrity teams, flagging near-balanced account clusters as coordinated betting rings (arXiv:2605.17492)
  - youtube — "The Invisible Slip Layer That Lets Ketchup Flow Like Water" — kitchen-science explainer on
    lubrication-induced Newtonianization of shear-thinning slurries (arXiv:2605.09172)
  - demo — **The q-Exponential Machine** (arXiv:2606.08342) ← BUILT
- **Built (3-way build-off):**
  - A — Inverse-Fold-It (arXiv:2506.00925, ProtInvTree): draw a target backbone on the HP-lattice protein
    model, then watch a real two-stage FOCUS/GROUND MCTS search live — UCT selection, backprop-brightened
    nodes, actual branch pruning — ending with a diverse pool of high-H-H-contact sequences. Builder verified
    via headless-Firefox screenshot passes that tree node count exactly tracks iteration count, and caught/
    fixed a real Fit-View zoom-collapse bug.
  - B — The Sandwich Zone (arXiv:2401.08302): play the arbitrageur in a batch-auction DEX, toggling Honest
    vs. Sandwich mode against a live price-manipulation gauge and side-by-side P&L. Builder confirmed via a
    20,000-iteration Monte Carlo that the arbitrageur's extra sandwich profit exactly equals the trader's
    dollar loss — an algebraic identity in the sim, not just a canned message.
  - C — **The q-Exponential Machine** (arXiv:2606.08342): a k-slider drives a live Gamma spectral-density
    histogram and a numerically-integrated (2200-point grid) log-log decay curve bending from exponential
    toward power-law, locking onto the paper's exact q=5/3 Tsallis q-exponential at the right setting — a
    load-time self-check verifies this against the closed form to 1e-12. Includes a "Guess the k!" minigame
    scored by log-log RMSE, framed with basketball-slump flavor text. Builder caught/fixed a real spectrum
    renormalization bug at small k and a canvas-overflow layout bug, then re-verified headless across three
    viewport widths.
  - **Judge's pick: C, The q-Exponential Machine** — all three ran clean (zero console errors in headless
    Playwright testing across all three). C won as the tightest fusion of real math, instant dual-panel
    interactivity, and a genuinely replayable minigame; A's tree visualization read as sparse/abstract next to
    the other two's cleaner data-viz, and B's linear six-click scripted flow felt more like an animated
    explainer than something freely explorable.
- **Published:** demo at
  [share.djiang.xyz/arxiv-scrape/demos/2026-07-23-q-exponential-machine.html](https://share.djiang.xyz/arxiv-scrape/demos/2026-07-23-q-exponential-machine.html),
  brief at
  [share.djiang.xyz/arxiv-scrape/2026-07-23-nightly.html](https://share.djiang.xyz/arxiv-scrape/2026-07-23-nightly.html)
  — committed + pushed to `xpoes123/david-share` (commit `fc171ed`); VPS pull is separate/manual, not done
  by this run. Left pre-existing uncommitted `app/*` changes (unrelated to tonight) untouched in the working
  tree.

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