# arxiv-scrape nightly log (newest first)

## 2026-09-03 — Poker Table Telephone
- **Status:** clean run start-to-finish, no recovery needed. Fetch (176 papers/22 categories, offset
  day-of-year×3=738) completed in foreground. `votes.json` still all tag-scores zero (no forum voting
  signal yet), so no bias applied to selection.
- **Fetch/ideate:** 30 papers hand-selected for category diversity across all 22 categories, 6 batches
  of 5, 84 ideas generated (`ideation_2026-09-03_results.json`).
- **Forum top-3 / build-off candidates (all tied or near discussion 9):** **Hold or Fold**
  (arXiv:2608.26035, cool 8, buildable 8) — belief-revision-in-dialogue paper showing patient
  evidence-accumulation beats reacting to every local mismatch, i.e. a formal case against poker/betting
  tilt; **Handicapper Credibility Score** (arXiv:2409.15678, cool 9, buildable 7) — an LLM cell-type
  annotation reliability method that scores rater credibility from agreement patterns alone, with zero
  ground truth, mapped onto grading sports touts; **Poker Table Telephone** (arXiv:2606.29152, cool 8,
  buildable 7) — a new deterministic ad-hoc-radio-network gossiping protocol, reframed as how fast a
  signal spreads around a table when only one seat can broadcast at a time without colliding.
- **Also surfaced:** demo — AI Tells: a CUSUM lie detector that catches a computer-use agent's false
  "task complete" claim ~31 steps early (arXiv:2608.27808); demo — EV Separation Playground: a
  v-separation influence-diagram builder proving when the street-by-street Bellman shortcut in poker/
  parlay decision trees breaks (arXiv:2607.16717); demo — Latent Whale Finder: peels a visible
  betting-Discord friend graph away to reveal the hidden peer-effect structure that actually drives pick
  correlation (arXiv:2602.06435); demo — Arbitrage Cube: borrows an extremal-combinatorics hypercube
  density bound as a same-game-parlay correlation ceiling for sportsbook risk (arXiv:2608.12237);
  project — Tell-Cam: ports a penguin motion-signature re-ID pipeline onto poker-table webcam feeds for
  home-game collusion/tell detection (arXiv:2603.03603); youtube — Your Mac Is Eavesdropping on Its Own
  GPU: a 94.8%-accurate Apple Silicon cache side-channel attack recovering LLM keywords
  (arXiv:2608.09075).
- **Built (all 3 completed, all verified self-contained — HTML/JS syntax-checked, tag-balance checked,
  logic inspected for real computation vs. decorative randomness):**
  - A — **Hold or Fold** (arXiv:2608.26035): a poker hand-reading game with 6 sequential ambiguous
    tells; player locks an opening read then chooses HOLD/REVISE per tell, competing live against four
    distinct bot policies (Stubborn/never-revise, Twitchy/mismatch-driven, Amnesiac/short-memory,
    Patient/uncertainty-accumulating) mirroring the paper's actual four strategies. Builder
    independently verified in a 20,000-hand standalone simulation that Patient beats the others
    (~83.6% vs. ~72% accuracy) before writing the file, and wired a "Deal New Hand" / "Auto-Run 20
    Hands" mode plus a Chart.js win-rate-over-time chart so the statistical edge is visible, not just
    claimed.
  - B — **Handicapper Credibility Score** (arXiv:2409.15678): a panel of 6-14 simulated sports
    handicappers (Sharp/noise/Fade/Sheep archetypes) pick winners each round, and a real 20-iteration
    Dawid-Skene-style binary EM — refit live in-browser every round — infers each capper's reliability
    purely from inter-capper agreement, never touching outcomes. "Reveal True Skills" unmasks the real
    archetypes for comparison, and a naive-agreement baseline is shown getting visibly fooled by the
    Sheep copycats.
  - C — **Poker Table Telephone** (arXiv:2606.29152) — **WINNER.** Two live SVG poker tables (4-10
    seats, ring + adjustable extra links) race side by side: Naive (random per-tick broadcast, visible
    red collision-flash animations, slow messy convergence) vs. Smart (a real distance-2 graph coloring
    computed from the seating graph, giving a provably collision-free round-robin schedule via
    `tick % numColors`). Per-seat radial knowledge-progress rings, a live theory panel comparing the
    paper's Õ((mn)^0.6) bound to the prior Õ(n^{4/3}) one, zero CDN dependencies (works offline).
- **Judge's call:** picked Poker Table Telephone over Hold or Fold (close second — genuinely distinct
  bot-policy logic, just less visually inventive) and Handicapper Credibility Score (most rigorous math
  of the three, real EM, but table/chart-heavy presentation had less "wow" than a live animated race).
  All three were verified non-faked (real algorithms, not relabeled randomness) — no disqualifications.
- **Published:** demo + brief written to `david-share/arxiv-scrape/`, registered in `manifest.json`,
  committed and pushed (commit `b760492`) — VPS picks it up on its own `git pull`, not done by this run.
  Live at https://share.djiang.xyz/arxiv-scrape/demos/2026-09-03-poker-telephone.html and
  https://share.djiang.xyz/arxiv-scrape/2026-09-03-nightly.html
- **Forum digest:** `digest_2026-09-03.json` written and validated (`validate_digest.py` OK), demo_url/
  demo_arxiv_id filled with the build-off winner — `nightly.sh` posts it to the SharpLab forum.

## 2026-09-02 — Loser's Repetition
- **Status:** clean run start-to-finish, no recovery needed. Fetch (176 papers/22 categories, offset
  day-of-year×3=735) completed in foreground on the first try this time, well under the timeout.
- **Fetch:** 176 fresh papers, 30 randomly sampled across categories for ideation across 6 batches,
  89 ideas generated (`ideation_2026-09-02_results.json`). `votes.json` still all-zero (no forum voting
  signal yet), so no tag bias applied.
- **Forum top-3 / build-off candidates (all three tied at discussion 9, all with strong buildable-tonight
  demo ideas — real competition):** **Syndicate-size / Splinter to Win** (arXiv:2510.23297, cool 8,
  demo-buildable 9) — collective-foraging ecology applied to whether a betting/poker study group should
  splinter into smaller cliques; **Bankroll Under Fat Tails** (arXiv:2607.27073, cool 8, buildable 8) —
  parameter-free adaptive staking vs. classic fixed-parameter Kelly under heavy-tailed noise and edge
  drift; **Loser's Repetition** (arXiv:2604.03683, cool 7-8, buildable 8) — a chess rule reform making
  forced threefold repetition an instant loss instead of a draw, to kill grandmaster draw-fests. Excluded
  as repeats: chemo dosing (arXiv:2603.16894, won 2026-08-27/28) and poker-DNA k-mer fingerprinting
  (arXiv:2409.11683, won 2026-09-01) both resurfaced in ideation but scored low today and weren't real
  contenders anyway.
- **Also surfaced:** demo — The Convergence Illusion Simulator: recreates a real econometric bias where
  naive regressions overstate how fast bad teams/countries catch up to good ones, framed as the NBA/NFL
  tanking-and-parity debate (arXiv:2602.04060); demo — Steam Detector: Who's the Sharp Book?: ports
  stock-market volatility-clustering + Granger causality to sportsbook line movements to find which book
  leads (arXiv:2307.13422); project — Quenched Bankroll: borrows a population-genetics quenched/annealed
  distinction to frame "run bad" vs. "run good" as your one realized bankroll path vs. the full distribution
  of possible paths (arXiv:2510.26115); demo — Bet on the Primes: a betting mini-game built on the open
  Riemann-Hypothesis-adjacent question of how random the Möbius function really is (arXiv:2607.25002);
  youtube — Gambler's Ruin, But the Casino Is Infinite-Dimensional and Curved, bridging random-walk
  gambler's ruin to a random-hyperbolic-manifold paper (arXiv:2607.25065); demo — Party Seating Shuffler:
  animates a hard-core-model mixing result past its classical "should stall" threshold, watching it keep
  converging anyway (arXiv:2606.27545).
- **Built (all 3 completed, all verified — headless Chromium/Playwright interaction plus Node
  syntax-checks and, for two of the three, standalone reference-math verification):**
  - A — **Splinter to Win** (arXiv:2510.23297): four side-by-side canvas foraging simulations (solo /
    small-squad / user-slider / grand-coalition) sharing sliders for population, resource abundance, and
    skill heterogeneity, plus a live closed-form utility-vs-group-size curve with the numerically-computed
    optimum marked — reproducing the paper's finding that scarcity and heterogeneity both push the optimal
    group size down. Verified via `node --check`, tag-balance check, and a live-updating totals check
    (canvas resource counts genuinely accumulate, not decorative).
  - B — **Bankroll Under Fat Tails** (arXiv:2607.27073): races a classic fixed-parameter Kelly-style
    strategy against a restart-AdaGrad-plus-Hedge adaptive strategy (a real, simplified implementation of
    the paper's parameter-free mechanism) on Lomax-distributed simulated betting rounds, with sliders for
    tail-heaviness and edge drift and a bad-beat trigger button. Verified with a Node DOM/Chart.js stub
    harness driving 5,000+ simulated rounds across benign/extreme/drift/bad-beat scenarios — zero
    exceptions, all values finite and in-bounds.
  - C — **Loser's Repetition** (arXiv:2604.03683) — **WINNER**: a fully playable chess board (chess.js +
    unicode pieces) enforcing the paper's asymmetric repetition rule directly against real FEN position
    history — the mover who forces a third repetition loses instantly rather than drawing — with a
    pulsing "danger square" preview before you move, a simple material-eval bot opponent, and a toggle
    back to classic rules for comparison. Verified in headless Chromium: played a real 8-ply knight-shuffle
    repetition through to completion, confirmed the repetition counter, danger-square highlight, and
    "WHITE WINS" / classic-mode "DRAW" outcomes all fire correctly on the exact triggering ply.
- **Judge verdict:** Loser's Repetition wins on wow-factor and polish (9/9/9 vs. 7/8/8 and 7/8/8) — it's
  the only one of the three you can actually win or lose rather than watch as a dashboard, and the
  danger-square preview makes the paper's rule change viscerally felt rather than just charted. Bankroll
  Under Fat Tails was judged the most numerically rigorous (fidelity 8, a real restart-AdaGrad+Hedge
  implementation, not a themed random walk); Splinter to Win was the most information-dense (four parallel
  sims plus a correct argmax curve, fidelity 7). Loser's Repetition's one knock: it generalizes the paper's
  literal "repetition = loss for White" to "loss for whoever forces it" (disclosed, reasonable, but a real
  deviation) — fidelity scored 7 for that reason, lowest of the three, yet still won overall on feel.
- **Published:** demo at https://share.djiang.xyz/arxiv-scrape/demos/2026-09-02-losers-repetition.html,
  brief at https://share.djiang.xyz/arxiv-scrape/2026-09-02-nightly.html (both registered in
  manifest.json, committed+pushed to `xpoes123/david-share` — commit `67acd4e`). `digest_2026-09-02.json`
  written for the forum post (3 papers, demo_arxiv_id=2604.03683).


## 2026-09-01 — Poker DNA
- **Status:** clean run start-to-finish, no recovery needed. Fetch timed out at the default 2-minute Bash
  limit on the first attempt (mid-flight across 22 categories) but wasn't backgrounded — reran in
  foreground with a longer timeout and it completed normally, same pattern as 2026-08-31.
- **Fetch:** 176 fresh papers across 22 categories (offset by day-of-year×3), 30 randomly sampled across
  categories for ideation across 6 batches, 88 ideas generated (`ideation_2026-09-01_results.json`).
  `votes.json` still all-zero (no forum voting signal yet), so no tag bias applied.
- **Forum top-3 / build-off candidates (all three tied at discussion 9, all buildable-tonight demos —
  real competition):** **Robust Kelly / Leverage Stress-Tester** (arXiv:2310.02084, cool 8×buildable 8),
  **Gold vs Silver: PU-Ratio Signal Game** (arXiv:2308.00013, cool 8×buildable 7), **Poker DNA: k-mer
  Fingerprinting** (arXiv:2409.11683, cool 9×buildable 7). Two other discussion-9 ideas tied to papers
  already built/won in the last two nights — **Order Book Imbalance Market-Maker Toy**
  (arXiv:2307.15599, won 2026-08-30 as "Order Flow Whisperer") and **Chemo Kelly**
  (arXiv:2603.16894, won 2026-08-27/28 window as "Tumor Dosing Lab") — were excluded as repeats.
- **Also surfaced:** project — Bankroll Recurrence Bust-Checker: models staking systems as integer linear
  recurrences and applies the paper's Skolem-Problem sieve to check if they can ever bust to zero
  (arXiv:2607.15510); youtube — An AI Just Proved a 20-Year-Old Math Conjecture: ChatGPT 5.6 Pro resolved
  Feige's 2004 conjecture on small-deviation bounds (arXiv:2607.23980); project — SharpLab Liquidity
  Fragility Score: near-linear-time minimal-removable-set enumeration applied to betting-market liquidity
  (arXiv:2606.26639); youtube — I Stress-Tested a Paper Claiming 325% Returns from an LSTM
  (arXiv:2310.00747); demo — Chromatic Chicken: an unbeatable Ramsey-theory coloring bar-bet
  (arXiv:2608.09649); demo — Fractal Market Weather Generator: an exactly-computable multiplicative
  cascade rendered as a live fractal field (arXiv:2608.24897).
- **Built (all 3 completed, all verified — Playwright/jsdom headless execution plus independent
  Python/Node reference implementations of each demo's core math, zero real runtime errors):**
  - A — **Robust Kelly / Leverage Stress-Tester** (arXiv:2310.02084): implements the paper's actual
    growth-rate formula g(L)=L(μ−r)+r−fee−½γL²σ² with a real worst-case grid search over a user-set
    (μ,σ) uncertainty box; toggles between Leveraged-ETF and Sports-Bet-Edge framings, CRRA γ
    Full/Half/Quarter-Kelly presets, and a Monte Carlo fan-chart panel. Caught and fixed a real bug where
    widening the vol band toward zero blew up leverage to absurd values; verified against an independent
    Python reference implementation.
  - B — **Gold vs Silver: PU-Ratio Signal Game** (arXiv:2308.00013): an 8-round compounding wagering game
    — synthetic BTC/LTC price + UTXO-age-derived Price-to-Utility signal each round, player bets
    buy/hold/sell against the signal and naive buy-and-hold in parallel. No CDN dependency, hand-rolled
    canvas charts. Verified across 25 simulated full games under four strategies confirming the signal has
    genuine, correctly-signed edge.
  - C — **Poker DNA: k-mer Fingerprinting** (arXiv:2409.11683) — **WINNER**: treats 9 synthetic poker
    players' action logs as "genomes," k-mer-shingles them, and renders a live 9×9 Jaccard/MinHash
    similarity heatmap with a k-length slider as the central interactive variable. One planted
    near-identical bot pair; at k=1–2 the metric collapses (everyone ≈1.0, too coarse), k=4–8 cleanly
    isolates the bot pair, k=10 dilutes even the true match — the paper's own k-selection tradeoff played
    out live. MinHash toggle approximates exact Jaccard within noise. Verified via jsdom end-to-end
    interaction plus a hand-traced Jaccard example and a full 9-player Node simulation across k=1..10.
- **Judge verdict:** Poker DNA wins — all three demos were polished and fully functional (wow/
  interactivity/polish all scored 7-9 across the board), but Poker DNA's single dial (k-mer length) *is*
  the object the paper studies, so manipulating it reproduces the paper's actual finding in real time
  (fidelity 10/10) rather than illustrating a generic concept with a betting skin. Robust Kelly was most
  rigorous but most "generic slider-dashboard" in feel (fidelity 9); Gold vs Silver was the most fun
  standalone game but leaned on synthetic narrative over the paper's measured backtest (fidelity 7).
- **Published:** demo at https://share.djiang.xyz/arxiv-scrape/demos/2026-09-01-poker-dna.html, brief at
  https://share.djiang.xyz/arxiv-scrape/2026-09-01-nightly.html (both registered in manifest.json,
  committed+pushed to `xpoes123/david-share` — commit `b645772`). `digest_2026-09-01.json` written for
  the forum post (3 papers, demo_arxiv_id=2409.11683).


## 2026-08-31 — Market Maker Stress Test
- **Status:** clean run start-to-finish, no recovery needed. Fetch timed out at the default 2-minute
  Bash limit on the first attempt (22-category fetch mid-flight) but wasn't backgrounded — reran in
  foreground with a longer timeout and it completed normally.
- **Fetch:** 176 fresh papers across 22 categories (offset by day-of-year×3), 30 hand-picked for
  ideation across 6 batches, 90 ideas generated (`ideation_2026-08-31_results.json`). `votes.json` still
  all-zero (no forum voting signal yet), so no tag bias applied.
- **Forum top-3 / build-off candidates:** two ideas tied at discussion 9 — **Gut vs Grind**
  (arXiv:2602.11478, cool 8×buildable 9) and **Market Maker Stress Test** (arXiv:2602.01817, cool
  8×buildable 8) — plus **Pay-to-Peek** (arXiv:2606.25166, discussion 8×buildable 9), swapped in over a
  tied-discussion-9 youtube idea (buildable only 4) to keep the build-off a genuine 3-way demo
  competition. Two other discussion-9 candidates, **Sharpe Ratio Lies** (arXiv:2310.02014) and **AI
  Prisoner's Dilemma Arena** (arXiv:2604.18596), were skipped as forum picks because both papers already
  ran in the last two nights' digests (2026-08-30 and 2026-08-28) — still surfaced in the brief.
- **Also surfaced:** demo — AI Prisoner's Dilemma Arena: LLMs diverge 48-fold on cooperation across
  providers (arXiv:2604.18596); demo — Bet-Size Tuner: a provably sharp-rate blind search for tuning a
  Kelly fraction (arXiv:2607.12938); project — Sharp-Money Line-Move Backtester: ports HFT order-flow
  imbalance to sportsbook CLV signals (arXiv:2307.15599); youtube — Why Betting Syndicates Split Into
  Small Cells: optimal spatial structure for collective information-gatherers (arXiv:2510.23297).
- **Built (all 3 completed, all verified via headless jsdom/Playwright execution, zero real runtime
  errors):**
  - A — **Gut vs Grind** (arXiv:2602.11478): timed 5s "gut" pick (Type 1) on a procedurally generated
    poker/betting scenario, followed by an untimed "grind" pick (Type 2) with full EV breakdown revealed;
    separate simulated bankrolls per pathway, persisted via localStorage, Chart.js session comparison.
    Judge flagged fidelity as the weak point — the gameplay is a generic System-1/System-2 metaphor
    bolted onto the paper's actual (and more abstract) supervenience/equation-selection causal claim.
  - B — **Market Maker Stress Test** (arXiv:2602.01817) — **WINNER**: 8 game cards, one slider controls
    how many crash simultaneously (1 = isolated, 8 = correlated slate-wide). A DMM bot avatar physically
    repositions itself via live bounding-rect math — absorbing the shock (tightening spreads, green
    inventory) at scope=1, fleeing to a corner with particle FX and blown-out spreads at scope>1. Live
    per-card sparklines, inventory gauge, liquidity provided/consumed meter. Tightest, most legible
    mapping of the three to its paper's actual finding (fidelity 9/9, wow 9/9).
  - C — **Pay-to-Peek** (arXiv:2606.25166): job-scheduling game — peek at a job's true processing time
    for a cost, or run blind on the upper bound; live weighted-completion-time tracking against a ghost
    opponent running the paper's proven 2.1523-competitive randomized algorithm on the same adversarial
    sequence. Most substantive decision-driven gameplay of the three (interactivity 9/9); close runner-up.
- **Judge verdict:** Market Maker Stress Test wins on audiovisual craft (fleeing/absorbing bot animation,
  particle effects, live gauges) plus the directness of its one-slider mapping to the paper's headline
  result; Pay-to-Peek was the closest runner-up on substance of the interaction loop.
- **Published:** demo at
  https://share.djiang.xyz/arxiv-scrape/demos/2026-08-31-market-maker-stress-test.html, brief at
  https://share.djiang.xyz/arxiv-scrape/2026-08-31-nightly.html (both registered in manifest.json,
  committed+pushed to `xpoes123/david-share` — commit `ba99b0d`). `digest_2026-08-31.json` written for
  the forum post (3 papers, demo_arxiv_id=2602.01817).

## 2026-08-30 — Bankroll Truth Serum
- **Status:** clean run start-to-finish, no recovery needed.
- **Fetch:** 176 fresh papers across 22 categories (offset by day-of-year×3), 30 sampled for ideation
  with explicit dedup against the last 4 nights' ideation scripts (0 overlap), 6 batches, 24 ideas
  generated (`ideation_2026-08-30_results.json`). `votes.json` still all-zero (forum voting hasn't
  produced signal yet), so no tag bias applied.
- **Forum top-3 / build-off candidates (all three tied at discussion 9, all buildable-tonight demos —
  real competition):** **Order Flow Whisperer** (arXiv:2307.15599, cool 8×buildable 9), **Predictable,
  You Are Not** (arXiv:2607.20818, cool 8×buildable 9), **Bankroll Truth Serum** (arXiv:2310.02014,
  cool 8×buildable 8). Two other discussion-9 ideas — **Pareto Edge Engine** (startup, buildable 4) and
  **SplitWatch** (startup, buildable 4) — were passed over for the build-off in favor of the three
  higher-buildable demos, but surfaced in the brief.
- **Also surfaced:** startup — Pareto Edge Engine: wearable-fatigue-signal prop-betting engine
  (arXiv:2608.22387 + arXiv:2608.02274); startup — Tout Buster: propaganda-technique scanner repurposed
  as a scam-tout detector (arXiv:2608.22388); demo — Draft Meltdown: online auction algorithms can land
  at ~7% of optimal welfare (arXiv:2606.22520); youtube — The Shuffle Theorem: a knot invariant secretly
  counts card-shuffle structure (arXiv:2608.06225).
- **Built (all 3 completed):**
  - A — **Order Flow Whisperer** (arXiv:2307.15599): a market maker quotes bid/ask depth against a
    jump-diffusion efficient price; an "informedness" slider controls how accurately she predicts the
    next jump direction, skewing book depth toward the safe side — that skew *is* the imbalance. A second
    "inventory aversion" slider adds unrelated confound noise. Two live charts (imbalance, price w/ jump
    markers) plus a rolling Pearson correlation/R² between imbalance(t) and price move(t+1). Headless
    Playwright-verified: R² ≈0.02–0.07 (noise) at informedness 0 vs. 0.38–0.82 at informedness 1; caught
    and fixed a real bug where the "wrong guess" fallback matched the true jump direction by chance 50%
    of the time, inflating the noise floor.
  - B — **Predictable, You Are Not** (arXiv:2607.20818): three sequential-sampling rules run side by
    side (pure i.i.d., naive greedy rebalancing, the paper's self-balancing rule) over a configurable
    K-sided die, each tracking frequency convergence and a live "guess the due option" predictability
    exploit. A β slider on the self-balancing rule's softmax trades convergence speed against
    predictability. Headless Playwright-verified across every control (play/pause/step/fast-forward/β/K/
    reset), zero console errors; numerically confirmed at β=0.20 self-balancing matches greedy's ~0%
    deviation while staying near i.i.d.'s ~50% predictability baseline, climbing toward greedy's 100% as
    β→1.5.
  - C — **Bankroll Truth Serum** (arXiv:2310.02014): four illustrative return streams (steady low-vol,
    high-vol/high-mean, fat-left-tail, moderate) plotted as live cumulative bankroll paths; a CRRA
    risk-aversion slider recomputes each strategy's real certainty-equivalent growth rate live and
    re-ranks an animated leaderboard. At γ=0 the high-variance strategy ranks #1 on raw EV; by γ=10 it's
    dead last with a negative CE while the steady strategy takes over, with the other two crossing in
    between. Verified via `node --check` plus a headless Chrome (puppeteer-core) pass confirming zero
    console errors, correct rank-flip math, and a responsive-layout bug caught and fixed on mobile
    (420px).
- **Judge:** scored Predictable You Are Not 34/40 and Bankroll Truth Serum 34/40 (tied), Order Flow
  Whisperer 31/40. Picked **Bankroll Truth Serum** on the tie-break that matters most for a demo: the
  interaction directly *is* the paper's result — one slider drag visibly reorders four strategies via a
  correct closed-form CRRA calculation, an immediate "aha" versus Predictable's more abstract dual-chart
  tradeoff that needs two charts read together to land, plus the cleanest execution (CSS-transitioned
  leaderboard reordering, log-scale wealth paths, synced utility-curve mini-chart).
- **Published:** demo at `demos/2026-08-30-bankroll-truth-serum.html`, brief at
  `2026-08-30-nightly.html`, both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-30-nightly.html

## 2026-08-29 — Deck-Count Duel
- **Status:** clean run start-to-finish, no recovery needed. Also recovered the stalled 2026-08-28 run
  (logged below) at the start of tonight's session before starting fresh work.
- **Fetch:** 176 fresh papers across 22 categories (offset by day-of-year×3), 30 sampled for ideation
  with explicit dedup against the last 5 nights' ideation scripts (0 overlap), 6 batches, 24 ideas
  generated (`ideation_2026-08-29_results.json`). `votes.json` still all-zero (first week of forum
  voting), so no tag bias applied.
- **Forum top-3 / build-off candidates (all three tied at discussion 9, all buildable-tonight demos —
  real competition):** **Volatility Flip** (arXiv:2511.01905, cool 8×buildable 9), **Deck-Count Duel**
  (arXiv:2308.07329, cool 8×buildable 9), **Averageness Slider** (arXiv:2602.13368, cool 7×buildable 8).
  A 4th idea tied at discussion 9 — **Prove-you're-clean: zero-knowledge anti-RTA verification**
  (arXiv:2608.02774, startup type, buildable 6) — was passed over for the build-off in favor of the
  three higher-buildable demos, but surfaced in the brief.
- **Also surfaced:** startup — Prove-you're-clean zk-SNARK anti-cheat verification for poker/chess
  (arXiv:2608.02774); project — Edit Ledger: credit-assignment for betting-model tweaks
  (arXiv:2608.23631); demo — Triple-Jointed Escape: Racing Langevin Diffusions Out of a Losing Streak
  (arXiv:2607.20882, cascaded noise escapes a metastable well strictly faster than direct noise).
- **Built (all 3 completed):**
  - A — **Volatility Flip** (arXiv:2511.01905): 200 simulated bankrolls compound multiplicatively via a
    lognormal shock matrix under a favorable/stressful environment toggle and a volatility slider; a
    log-scale fan chart, survival-rate chart, and live "Jensen's tax" (σ²/2) stat panel let you watch
    the same variance knob flip from harmful to protective as the regime flips. Hand-rolled canvas
    charts (no charting lib). Math verified via a standalone Node test (survival 100%→23% as σ rises in
    the favorable regime; baseline is always exactly 0% survival in the stressful regime while any σ>0
    produces nonzero survival). No headless-browser interactivity pass.
  - B — **Deck-Count Duel** (arXiv:2308.07329): real tabular Q-learning (epsilon-greedy, Bellman
    updates) trains live client-side against a genuinely shuffled/depleting shoe, racing a hardcoded
    basic-strategy + Hi-Lo true-count betting bot over hundreds of thousands of simulated hands; a
    deck-count slider (1-8 decks + continuous-shuffle mode) drives convergence, bankroll, and
    edge-vs-deck-count charts. Simulation validated standalone in Node (flat-bet edge -0.3% to -1.2%,
    Hi-Lo edge +0.97% at 1 deck declining to -1.13% under CSM) and end-to-end in headless Playwright
    (zero console errors across every control, screenshot-verified).
  - C — **Averageness Slider** (arXiv:2602.13368): procedurally-drawn SVG faces at 21 interocular-ratio
    variants, pairwise A/B voting logged to localStorage building a live win-rate-by-ratio histogram
    that should peak near the average ratio, with a reference line for the paper's reported peak (0.40
    used as an illustrative midpoint since the exact reported ratio wasn't available). Headless
    Playwright-verified end-to-end including localStorage persistence across reload.
- **Judge:** scored roughly Deck-Count Duel 35/40, Volatility Flip 33/40, Averageness Slider 22/40
  (Averageness docked hardest for an admittedly guessed reference ratio and a result that depends on one
  person's aesthetic bias converging over a session rather than simulating the paper's actual
  population-level finding). Picked **Deck-Count Duel**: the only one of the three where you watch real
  live computation unfold (Q-learning training in front of you) rather than a pre-set outcome, the most
  technically ambitious, and the most rigorously tested via headless-browser verification.
- **Published:** demo at `demos/2026-08-29-deck-count-duel.html`, brief at `2026-08-29-nightly.html`,
  both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-29-nightly.html

## 2026-08-28 — Tunnel or Climb (recovered, finished 2026-08-29)
- **Status:** the 2026-08-28 run's fetch, ideation, and 3-way build-off all completed in full — all
  three builders finished (`2026-08-28-trust-arena-a.html`, `2026-08-28-auc-lies-b.html`,
  `2026-08-28-tunnel-or-climb-c.html`) and `digest_2026-08-28.json` was written — but the run stalled
  before judging, publishing, or logging. Same recurring stall-after-build-off failure mode as most
  nights this month. Recovered and finished at the start of tonight's (2026-08-29) run.
- **Fetch:** 176 fresh papers across 22 categories, 30 sampled for ideation, 24 ideas generated
  (`ideation_2026-08-28_results.json`), no votes.json signal yet (all-zero, first week of forum voting).
- **Forum top-3 / build-off candidates:** **LLM Trust Arena** (arXiv:2604.18596, cool 8×disc 9) — seeds
  iterated-trust-game cooperation rates from the paper's measured 48x cross-provider spread;
  **Same AUC, Different Truth** (arXiv:2608.02821, cool 7×disc 9) — two detectors share ~0.85 AUC but
  diverge wildly in detection rate at a fixed threshold; **Tunnel or Climb** (arXiv:2606.23614,
  cool 8×disc 9) — quantum tunneling's provable spectral-gap edge over classical hill-climbing past a
  barrier.
- **Also surfaced:** demo — ParlaySplit: Topological X-Ray for Your Bet Slip (arXiv:2310.09578, real
  persistent-homology Vietoris–Rips complex over bet-slip correlations); youtube — I Tried to Poison a
  Sports-Betting AI With Fake Injury Tweets (arXiv:2608.17153, reasoning models resist fake evidence but
  can still be swayed after flagging it as fake); project — Dark Figures: Hidden-Signal Extraction
  Pipeline for SharpLab (arXiv:2511.01920, Kalman filter for hidden Zika infections ported to hidden
  sharp-money signal in line movement).
- **Built (all 3 completed):**
  - A — **LLM Trust Arena** (arXiv:2604.18596): personas seeded from the paper's real per-provider
    cooperation rates, iterated Prisoner's-Dilemma-style trust game with a rounds-remaining slider,
    watch endgame defection kick in for most personas while the Anthropic-calibrated one still
    cooperates. Uses a CDN Chart.js dependency; endgame decay curves are hand-tuned heuristic shapes,
    not derived from a real game-theoretic computation.
  - B — **Same AUC, Different Truth** (arXiv:2608.02821): fully self-contained; computes real
    Mann-Whitney AUC via rank-sum, generates genuine Gaussian-mixture vs. Gamma synthetic distributions,
    drag directly on the histograms to move the operating threshold and watch ROC position/TPR/detection
    gap update live.
  - C — **Tunnel or Climb** (arXiv:2606.23614): fully self-contained; real complex-valued
    Crank–Nicolson finite-difference solve (Thomas algorithm) of the 1D discrete Schrödinger equation on
    a bowl+spike potential, racing a genuine Metropolis/simulated-annealing classical walker on the
    identical landscape live, plus a background success-rate-vs-spike-height sweep chart.
- **Judge:** scored roughly Tunnel or Climb 35/40, Same AUC 34/40, Trust Arena 27/40 (Trust Arena docked
  for a non-self-contained CDN dependency and scripted-not-computed endgame curves). Picked **Tunnel or
  Climb**: the most technically ambitious of the three (a real PDE solver running in-browser) and the
  most visceral — classical walkers physically bounce off the barrier while the quantum probability
  density visibly leaks through it, with a live sweep chart showing success-rate curves diverge exactly
  as spectral-gap theory predicts. Same AUC was a close second on tightness of interactivity.
- **Published:** demo at `demos/2026-08-28-tunnel-or-climb.html`, brief at `2026-08-28-nightly.html`,
  both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-28-nightly.html

## 2026-08-27 — Freeze-Tag with Return (recovered)
- **Status:** the 2026-08-27 run's ideation and 3-way build-off both completed in full — all three
  builders finished (`2026-08-27-bb-cycle-visualizer-a.html`, `2026-08-27-tumor-dosing-lab-b.html`,
  `2026-08-27-freeze-tag-return-c.html`) — but the run stalled before judging, publishing, or logging.
  Same recurring failure mode that's now hit most nights this month (stall right after the build-off).
  Recovered and finished the same day. Repo was again parked on the unrelated `sharplab-arxiv-forum`
  branch; switched back to `main` before doing any nightly work and left that branch (and everything
  under `docs/superpowers/`) untouched.
- **Fetch:** 176 fresh papers across 22 categories (8 each, offset by day-of-year×3), 30 sampled for
  ideation, 6 batches, 24 ideas generated (`ideation_2026-08-27_results.json`).
- **Top per category (from `ideation_2026-08-27_results.json`, 24 ideas):**
  - demo — 3 selected for build-off: **BB Cycle Visualizer** (arXiv:2607.21579, cool 8×buildable 9),
    **Tumor Dosing Lab** (arXiv:2603.16894, cool 8×buildable 9), **Freeze-Tag with Return**
    (arXiv:2606.21985, cool 8×buildable 9). Highest-scoring demo idea overall was **Quantum Gas = Card
    Deck: Partitions Meet Periodic Orbits** (arXiv:2607.06146, cool 9×buildable 8), not sent to the
    build-off this night.
  - project — none tagged this night (the ideation surfaced demo/youtube/startup ideas only).
  - youtube — **Gaps in the Giants: When Famous Combinatorics Proofs Break** (cool 7, buildable 4): a
    video essay pairing two 2026 "the textbook result wasn't actually proven" stories — a gap in the
    celebrated 42-queue planar-graph layout algorithm and the superlinear blow-up of higher Radon
    numbers (arXiv:2608.05508 + 2608.06437).
  - startup — **Physics-of-the-Order-Book: Spoofing/Layering Detection API** (cool 7, buildable 4):
    models a limit order book as a particle system and computes a momentum-like metric that out-detected
    Z-score anomaly detection on the LUNA flash crash — a real-time market-manipulation compliance API,
    with a natural SharpLab crossover as a "steam move vs genuine sharp money" detector (arXiv:2308.08683).
- **Built (all 3 completed):**
  - A — **BB Cycle Visualizer** (arXiv:2607.21579): runs real gradient descent and the Barzilai-Borwein
    step-size rule side by side on a configurable diagonal quadratic (n=4–6), with log-scale
    gradient-norm and step-size charts (Chart.js) and a preset that drives BB into a repeating step-size
    cycle so it converges only geometrically instead of superlinearly. Honest note concedes its
    "pathological" preset is an approximate cycle it found, not the paper's certified n=4 orbit.
  - B — **Tumor Dosing Lab** (arXiv:2603.16894): live RK4 integration of a 4-variable delay-differential
    tumor/healthy/immune/drug model with a ring-buffered immune-recruitment delay, racing metronomic vs
    MTD protocols at equal total drug budget across four Chart.js panels + a scoreboard/verdict.
    Mechanism is paper-faithful; parameters are illustrative, not fitted.
  - C — **Freeze-Tag with Return** (arXiv:2606.21985): pure-canvas (no CDN) playable Freeze-Tag toy —
    click/randomize sleeping robots in a unit disk, an event-driven greedy scheduler fires the wake
    chain-reaction with animated pings, a "must return" toggle makes the makespan jump, a live meter
    plots the return/open ratio against the paper's proven 1.732 / 1.959 / 2+2√2 bounds, plus a
    hand-build-your-own-schedule puzzle mode that races the greedy heuristic.
- **Judge:** all three read through as complete, non-truncated, self-contained HTML; extracted inline
  scripts all pass `node --check`. Scored roughly Freeze-Tag 37/40, Tumor Dosing 34/40, BB Visualizer
  31/40. Judge picked **Freeze-Tag with Return**: it's the only one of the three that's an actual
  playable game (not sliders driving line charts), it renders the paper's proven bounds directly onto a
  live meter, its event-driven scheduler + puzzle mode give the richest interactivity, and being
  pure-canvas it carries zero CDN dependency to fail. Tumor Dosing had the strongest shareable narrative
  ("less is more") but is fundamentally four line charts + sliders with admittedly unfitted parameters;
  BB Visualizer's math is real but its visual is just two log-scale charts for a niche audience and its
  fidelity is the most hedged (approximate cycle, not the paper's certified orbit).
- **Published:** demo at `demos/2026-08-27-freeze-tag-return.html`, brief at `2026-08-27-nightly.html`,
  both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-27-nightly.html

## 2026-08-26 — Zero Forcing Duel (recovered, published a day late on 2026-08-27)
- **Status:** the 2026-08-26 run's ideation and 3-way build-off both completed in full — all three
  builders finished (`zero-forcing-duel-a.html`, `chromatic-sandbox-b.html`, `living-helix-c.html`) —
  but the run stalled before judging, publishing, or logging happened. Recovered and finished at the
  start of tonight's (2026-08-27) run. Also found the repo checked out to an unrelated stray branch
  (`sharplab-arxiv-forum`, two commits: a design spec + implementation plan for a "SharpLab arxiv
  discussion forum" feature, authored by a separate session earlier tonight) — left that branch alone
  and switched back to `main` before doing any nightly work, since that feature is out of scope for
  this playbook.
- **Top per category (from `ideation_2026-08-26_results.json`, 24 ideas):**
  - demo — 3 selected for build-off: **Zero Forcing Duel** (arXiv:2608.04579, cool 8×buildable 9),
    **Chromatic Sandbox: Try to 4-Color the Plane** (arXiv:2608.04542, cool 9×buildable 7), **Living
    Helix — Cooperative Nucleation Simulator** (arXiv:2605.30868, cool 8×buildable ~7)
  - project — **Universal Lattice Ising Playground** (cool 7, buildable 8): one Metropolis MC engine
    that swaps between 11 Archimedean lattices, 20 2-uniform lattices, and fractal tilings via a
    site/bond dilution mask on a single host lattice (arXiv:2607.05308)
  - youtube — **The Watermark That Lies** (cool 9, buildable 6): a backdoored VAE encoder makes a
    diffusion watermark verify normally on benign images but silently evade detection 94.6% of the time
    when a stealthy trigger is present, tested against 3 watermark schemes and 17 published defenses
    (arXiv:2608.00543)
  - startup — **No-Restow** (cool 6, buildable 4): a provably-tight online stack-assignment rule for
    small ports/warehouses that guarantees zero future restows given yard dimensions and access-point
    count (arXiv:2606.21376)
- **Built (all 3 completed):**
  - A — **Zero Forcing Duel** (arXiv:2608.04579): the paper's actual alternating-seed two-player game
    on path/cycle/star/complete graphs (n=3–9), automatic zero-forcing cascades, a greedy AI opponent,
    and a live scoreboard benchmarking the player's seed count against a brute-force Z(G) and the
    proven 2·Z(G) bound.
  - B — **Chromatic Sandbox** (arXiv:2608.04542): click-to-paint 4-coloring sandbox built from an exact
    7-fold-symmetric 21-vertex seed motif assembled into a larger unit-distance graph, with live
    monochromatic-edge detection.
  - C — **Living Helix** (arXiv:2605.30868): a running kinetic Monte Carlo sim of cooperative helix
    nucleation/growth/merging in a fluctuating polymer chain, rendered as glowing twisted ribbons.
- **Judge:** all three read through as syntactically well-formed, complete, non-truncated HTML with
  real interactivity. Scored roughly Zero Forcing Duel 36/40, Living Helix 34/40, Chromatic Sandbox
  33/40. Judge picked **Zero Forcing Duel**: its interactive mechanic — alternating seeds, automatic
  cascades, brute-force Z(G) benchmark — directly implements the paper's proven theorem rather than
  approximating it. Chromatic Sandbox had the richest polish and pointer interaction but its own
  in-demo documentation concedes the assembled graph isn't guaranteed to actually require 5 colors,
  undercutting its central "aha" moment; Living Helix was the most visually striking and physically
  faithful but had no player objective, reading as an ambient simulator rather than a game.
- **Published:** demo at `demos/2026-08-26-zero-forcing-duel.html`, brief at `2026-08-26-nightly.html`,
  both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-26-nightly.html

## 2026-08-25 — Loop-Catcher Playground (recovered, published a day late on 2026-08-26)
- **Status:** the 2026-08-25 run stalled after the build-off again — fifth time this exact failure mode
  has hit (2026-08-20, 2026-08-22, 2026-08-23, 2026-08-24, now 2026-08-25). `ideation_2026-08-25.js` /
  `buildoff_2026-08-25.js` and full ideation results (`ideation_2026-08-25_results.json`, 24 ideas)
  survived locally, but only 2 of the 3 builders finished — `bracket-vacuum-c.html` and
  `loop-catcher-a.html` exist, `granuloma-sandbox-b.html` never landed — and nothing was judged,
  published, or logged. Recovered and finished at the start of tonight's (2026-08-26) run.
- **Top per category (from `ideation_2026-08-25_results.json`):**
  - demo — 3 selected for build-off: **Loop-Catcher Playground** (arXiv:2607.18070, cool 8×buildable 9),
    **Granuloma Sandbox: Latent vs. Active TB** (arXiv:2602.24258, cool 8×buildable 9), **Bracket
    Vacuum — the Fermionic Nullity Playground** (arXiv:2605.27142, cool 8×buildable 9)
  - project — **Claim-Falsifier** (cool 7, buildable 6): spend test-time compute trying to falsify
    individual load-bearing claims in a reasoning trace instead of generating more full attempts — CLR
    lifts pass@1 by 27 points at 37% fewer tokens (arXiv:2608.11994)
  - youtube — **I Gave an API to a Brain in a Dish** (cool 9, buildable 4): Cortical Labs' CL API, a
    real sub-ms closed-loop interface to living biological neural networks, paired with a simulated
    spiking-network Pong demo (arXiv:2602.11632)
  - startup — **Wasserstein-barycenter bankroll allocator** (cool 6, buildable 4): robust bet sizing
    across disagreeing edge models via Wasserstein-barycenter blending, adapted from an asset-liability
    management framework (arXiv:2310.11987)
- **Built (2 of 3 completed — granuloma-sandbox builder never finished/left no file):**
  - A — **Loop-Catcher Playground** (arXiv:2607.18070): live 2D Brownian walk with real stack-based
    loop-erasure (LERW), a central-charge slider re-admitting sampled loops back onto the skeleton (with
    an explicit warning past the paper's proven c<-2 failure cutoff), plus a second panel that solves the
    Loewner ODE via RK4 so a kappa slider in [2, 8/3] redraws the boundary as a genuine SLE-type curve.
  - C — **Bracket Vacuum** (arXiv:2605.27142): fermionic creation/annihilation operators as colored
    bracket tiles, live Dyck-matching/depth animation to a NULL/NONZERO verdict, plus a quiz mode.
- **Judge:** both verified as well-formed, syntactically valid HTML with real event-wired interactivity
  (no headless browser available locally, so read-through + `node --check` rather than live console
  check). Scored wow/interactivity/polish/fidelity: **Loop-Catcher 31**, Bracket Vacuum 28. Judge picked
  **Loop-Catcher**: it implements two independent, nontrivial numerical methods (textbook loop-erasure,
  a real RK4 Loewner-equation solve) that map directly onto the paper's two headline claims, while Bracket
  Vacuum's core mechanic is a standard bracket matcher that only weakly stands in for the paper's actual
  fermionic sign/contraction structure — a gap the demo itself honestly flags as a simplification.
- **Published:** demo at `demos/2026-08-25-loop-catcher.html` (runner-up `2026-08-25-bracket-vacuum-c.html`
  also published), brief at `2026-08-25-nightly.html`, both registered in `david-share/manifest.json` and
  pushed live at https://share.djiang.xyz/arxiv-scrape/2026-08-25-nightly.html

## 2026-08-24 — DLA Grower (recovered, published a day late on 2026-08-25)
- **Status:** the 2026-08-24 run stalled after the 3-way build-off again — fourth time this exact failure
  mode has hit (2026-08-20, 2026-08-22, 2026-08-23, now 2026-08-24): `ideation_2026-08-24.js`/
  `buildoff_2026-08-24.js` and 3 built demo files existed locally but were never judged, published, or
  logged. Full ideation results (23 ideas, all 4 categories) survived in `ideation_2026-08-24_results.json`
  and the build-off script (with all 3 pitches) survived in `buildoff_2026-08-24.js`, so this recovery is
  complete rather than backfilled. Picked up and finished at the start of tonight's (2026-08-25) run.
- **Top per category (from `ideation_2026-08-24_results.json`):**
  - demo — 3 selected for build-off (top cool×buildable products): **Memory Playground: When Sticky
    Environments Make Active Matter Freeze** (arXiv:2605.29162, cool 9×buildable 9), **DLA Grower: Watch the
    Fractal Amplitude Lock to the Dimension** (arXiv:2607.02216, cool 9×buildable 8), **Variance Is a Loan:
    Population Bet-Hedging Meets the Kelly Criterion** (arXiv:2511.01905, cool 8×buildable 9)
  - project — **Partial-Identification Bet Sizing: Betting Only When Every Model Agrees** (cool 7,
    buildable 5): Manski's partial-identification framework applied to NBA props — only flag an edge when
    every structurally-different fitted model agrees the market-implied probability falls outside their
    combined interval (arXiv:2602.00355)
  - youtube — **Where Should an AI Agent Spend Its Effort? (Training Credit vs. Inference Compute)**
    (cool 7, buildable 6): paired explainer on TRCA (per-transition RL credit assignment) and depth-adaptive
    looped-LM inference — both about spending a scarce resource exactly where it's earned
    (arXiv:2608.16156 + arXiv:2608.09444)
  - startup — **ModelJoust: Active Experiment Design to Kill Off Losing Prop Models Faster** (cool 7,
    buildable 5): optimal-control-flavored active experiment design — rank which upcoming observation would
    most cheaply discriminate between competing model candidates via KL-divergence (arXiv:2603.00709)
- **Built (3 of 3 completed, all verified running headless via Playwright, zero console errors):**
  - A — **Memory Playground** (arXiv:2605.29162): 200+ self-propelled disks with a leaky-integrator memory
    kernel; sweeping the memory-timescale slider reproduces the paper's nonmonotonic clustering curve —
    normal clumping, a scattered slow-nucleating haze at intermediate memory, clumping again at long memory.
  - B — **DLA Grower** (arXiv:2607.02216): live diffusion-limited-aggregation sim computing box-counted
    fractal dimension D and a harmonic-measure third-moment proxy D₃ from the actual running random walk,
    watching the gap between them collapse toward zero as the cluster grows toward D≈1.71.
  - C — **Variance Is a Loan** (arXiv:2511.01905): three synced panels (growth curve, cell colony, GBM
    bankroll) sharing one eigenvalue formula, draggable crossover marker verified mathematically correct.
- **Judge:** all three verified running under automated Playwright interaction (sliders/drag/click driven
  programmatically, canvas pixel sampling confirmed real rendering); scored wow/interactivity/polish/fidelity
  (sum/40): Memory Playground 31, **DLA Grower 35**, Variance Is a Loan 33. Judge picked **DLA Grower**:
  unlike the other two, which model their paper's claim via a hand-tuned formula or a physics analogy, this
  one actually computes the paper's headline quantities live from a genuine running random walk rather than
  approximating them — the exact amplitude relation the paper proves, rendered as a convergence you watch
  happen, on top of an inherently mesmerizing fractal-growth animation.
- **Published:** demo at `demos/2026-08-24-dla-grower.html`, brief at `2026-08-24-nightly.html`, both
  registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-24-nightly.html

## 2026-08-23 — Hot Hand ERW (recovered, published a day late on 2026-08-24)
- **Status:** the 2026-08-23 run stalled again after the 3-way build-off — third time this exact failure
  mode has hit (2026-08-20, 2026-08-22, now 2026-08-23): `ideation_2026-08-23.js`/`buildoff_2026-08-23.js`
  and 3 built demo files existed locally but were never judged, published, or logged. This time the full
  ideation results (24 ideas, all 4 categories) survived in `ideation_2026-08-23_results.json`, so the
  brief below is complete rather than backfilled from build-off pitches alone. Picked up and finished at
  the start of tonight's (2026-08-24) run.
- **Fetch:** 30 papers sampled for ideation (per prior nights' pattern).
- **Top per category (from `ideation_2026-08-23_results.json`):**
  - demo — 3 selected for build-off: **Baby Entropy Engine** (arXiv:2603.29312, cool 9×buildable 9),
    **Poincaré Coreset Playground** (arXiv:2606.16061, cool 8×buildable 9), **Hot Hand: Elephant Random
    Walk Simulator** (arXiv:2607.15125, cool 8×buildable 9)
  - project — **Panel-Vuong Model Picker for RAPM vs Elo** (cool 7, buildable 6): panel-data generalization
    of the Vuong non-nested model-selection test for choosing between competing player-rating models
    (arXiv:2601.22354)
  - youtube — **The AI That Broke a 15-Year-Old Combinatorics Conjecture** (cool 9, buildable 5): Schubitopes
    were conjectured always Ehrhart-positive since 2011; this paper finds the counterexamples
    (arXiv:2608.00377)
  - startup — **Programmable Chemical Space-as-a-Service** (cool 7, buildable 3): SpaceGFN lets drug-discovery
    teams explicitly construct their generative search space instead of sampling a fixed learned distribution,
    pitched as FTO-safe molecular discovery (arXiv:2603.00614)
- **Built (3 of 3 completed, all verified running headless):** all three passed a Playwright check with zero
  console errors and real interactive behavior confirmed by driving their controls.
  - A — **Baby Entropy Engine** (arXiv:2603.29312): organized-zone/play-zone particle diffusion computing the
    paper's Schnakenberg two-state entropy formula live; Maxwell-Demon Parent button loses to diffusion at
    steady state, novelty-spike button reproduces the paper's curiosity-beats-punishment finding.
  - B — **Hot Hand: Elephant Random Walk Simulator** (arXiv:2607.15125): 200 live ERW trajectories, p-slider,
    live log-log regression that locks onto the theoretical exponent (0.904 fit vs. 0.900 target at p=0.95).
  - C — **Poincaré Coreset Playground** (arXiv:2606.16061): draggable hyperbolic k-center clustering with a
    coreset-size counter that stays far sublinear as background points are added (17→23 coreset vs. 60→260
    total points), plus a naive-Euclidean-grid comparison panel.
- **Judge:** all three verified running; scored wow/interactivity/polish/fidelity (sum/40): Baby Entropy
  Engine 31, **Hot Hand ERW 34**, Poincaré Coreset 35 (closest runner-up). Judge picked **Hot Hand ERW**:
  "a live regression fit locking onto the exact theoretical exponent while you watch" — the strongest raw
  wow-factor of the set, and honest about visualizing the classical p=3/4 scaling law the paper's own
  Schwarz-Christoffel asymptotics build on rather than overclaiming fidelity to the paper's specific result.
- **Published:** demo at `demos/2026-08-23-hot-hand-erw.html`, brief at `2026-08-23-nightly.html`, both
  registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-23-nightly.html

## 2026-08-22 — Impossible Memory (recovered, published a day late on 2026-08-23)
- **Status:** the 2026-08-22 run stalled after the 3-way build-off, same failure mode flagged for
  2026-08-20 — `ideation_2026-08-22.js`/`buildoff_2026-08-22.js` and 3 built demo files existed locally
  but were never judged, published, or logged. Picked up and finished at the start of tonight's
  (2026-08-23) run instead of re-running the pipeline from scratch, since the ideation results themselves
  (startups/projects/youtube) weren't cached anywhere and weren't worth regenerating just to backfill a
  brief — only the 3 build-off finalists' full pitches survived (embedded in `buildoff_2026-08-22.js`).
- **3-way build-off finalists:** **Bullwhip Sandbox** (arXiv:2607.17491, multi-echelon supply-chain sim
  showing bullwhip variance amplification as a structural/topological property, not injected noise),
  **Impossible Memory** (arXiv:2607.01231, bilayer Ising ratchet — split hot/cold baths stabilize a
  magnetized memory state under a symmetry-breaking field that erases the equivalent equilibrium system),
  **The Urban Scaling Illusion** (arXiv:2603.30021, ~150 synthetic cities with honest linear individual
  growth still yield a spurious superlinear cross-sectional scaling exponent).
- **Judge:** all three verified running (headless Playwright, zero console errors, interactive elements
  functionally exercised — incl. actually triggering the erase-vs-hold physics divergence in Impossible
  Memory: equilibrium copy dropped to −0.96, ratchet copy held at +0.94 under an identical field kick).
  Scores (wow/interactivity/polish/fidelity, sum/40): Bullwhip 33, **Impossible Memory 35**, Urban Scaling
  32. Judge picked **Impossible Memory**: "turns an abstract, genuinely counterintuitive physics claim...
  into a single-click, side-by-side falsification test" with the tightest fidelity-to-claim plus the
  strongest visual/interactive payoff.
- **Published:** demo at `demos/2026-08-22-impossible-memory.html`, brief at `2026-08-22-nightly.html`
  (runner-up demos included in place of the lost startup/project/youtube sections), both registered in
  `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-22-nightly.html

## 2026-08-21 — Wire-Plane Sketchpad
- **Fetch:** 176 papers across 22 categories (8 each, offset by day-of-year×3), sampled 30 for ideation.
- **Ideate:** 24 ideas generated across 6 batches (demo / project / startup / youtube).
- **Top per category:**
  - startup — **Ratchet Memory: heat-driven bits that hold themselves** (cool 8, buildable 8): the paper
    proves any local active dynamics is realizable by a many-body Brownian ratchet (static landscape + heat
    current, no controller) and gives an Ising-ratchet memory bit that resists decay where the equilibrium
    system forgets almost instantly — pitched as ultra-low-power edge/IoT state retention (arXiv:2607.01231)
  - project — **Bipartite Cholesky ERI Toolkit** (cool 7, buildable 4): package the paper's bipartite
    orbital/Cholesky-factor GNN as a PySCF + PyTorch-Geometric plugin, O(N⁴)→O(N³) correlation-energy
    correction with a shipped "how similar is this molecule to my training set" confidence score
    (arXiv:2605.25268)
  - youtube — **The Autonomous AI That Proved a 17-Year-Old Number Theory Conjecture** (cool 8, buildable 6):
    an AI theorem-prover (AxiomProver) closed the Amdeberhan-Medina-Moll conjecture on tan(arctan1+...+arctan n)
    on a density-one set, formalized in Lean/Mathlib (arXiv:2607.05739)
  - demo — 3 selected for build-off: **Wire-Plane Sketchpad** (arXiv:2603.03337, cool 9×buildable 8),
    **Curvature Trap** (arXiv:2607.01948, cool 8×buildable 9), **The City Growth Illusion**
    (arXiv:2603.30021, cool 8×buildable 10)
- **Built (3 of 3 completed):**
  - A — **The City Growth Illusion** (arXiv:2603.30021, urban-scaling exponents from cross-sectional city
    snapshots can be a pure statistical artifact of heterogeneity, not evidence about how any city actually
    grows): a few hundred synthetic cities all obeying one identical growth rule, staggered founding
    dates/rates, live log-log OLS fit that produces a convincing sub/superlinear exponent out of zero coded
    nonlinearity, with a toggle overlaying the true per-city curves.
  - B — **Wire-Plane Sketchpad** (arXiv:2603.03337, the two-thirds power law — hand speed ∝ curvature⁻¹ᐟ³ —
    is a fully covariant 3-tensor invariant under smooth plane deformations): draw any curve freehand, race
    a power-law-speed dot against a constant-speed control dot, then drag six handles to warp the whole
    canvas and watch the same slow/fast rhythm survive the deformation (99%+ correlation after a gentle warp).
  - C — **Curvature Trap: Chiral Particles vs. the Wall** (arXiv:2607.01948, spinning but non-motile
    particles stay uniform against straight walls but pile up under curved confinement, from chirality alone):
    ~380 point particles in a curvature-slider superellipse container with tangential wall kicks, live
    boundary heatmap and radial density profile.
  - **Judge:** all three verified valid, self-contained HTML/JS (`node --check` clean, tags balanced, DOM ids
    resolve, headless-Playwright end-to-end runs with zero console errors, CDN SRI hash verified for A);
    none disqualified. Physics/stats independently re-run and cross-checked against real arXiv abstracts.
    Scores (wow/interactivity/polish/fidelity, sum/40): A 34, **B 35.5**, C 36.5 — judge weighted wow-factor
    and interactivity most heavily and picked **B (Wire-Plane Sketchpad)**: "the most novel, personal, and
    immediately delightful interaction of the set" (direct-manipulation drawing + live warp-deformation),
    narrowly ahead of C's tighter quantitative fidelity.
- **Published:** demo at `demos/2026-08-21-wire-plane-sketchpad.html`, brief at `2026-08-21-nightly.html`,
  both registered in `david-share/manifest.json` and pushed live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-21-nightly.html
- **Note:** the 2026-08-20 run (Circuit Breaker Lab predecessor's next night) stalled after the 3-way
  build-off — `buildoff_2026-08-20.js`/`ideation_2026-08-20.js` and 3 unjudged demo files exist locally but
  were never judged, published, or logged. Left as-is (out of scope for tonight); flagging in case a future
  run wants to pick it up or clean it up.

## 2026-08-19 — Circuit Breaker Lab
- **Fetch:** 176 papers across 22 categories (8 each), sampled 30 round-robin for ideation.
- **Ideate:** 24 ideas generated across 6 batches (demo / project / startup — no youtube idea stood out
  tonight).
- **Top per category:**
  - startup — **ConsensusEdge — confusion-matrix aggregation for sharp bettors** (cool 6, buildable 5): ports
    a sleep-staging paper's per-expert confusion-matrix fusion mechanism (86% acc / 85% F1 beating naive
    consensus) to betting syndicates aggregating multiple handicappers/models (arXiv:2608.12446)
  - project — **Mempool Linearizer Sandbox** (cool 7, buildable 8): animates Spanning Forest Linearization
    (the fee-optimal transaction-ordering algorithm now shipped in Bitcoin Core) against a naive greedy
    baseline on a random dependency DAG (arXiv:2607.23787)
  - demo — 3 selected for build-off: **Watch a Neural Net Become a Gaussian Process** (arXiv:2607.06290,
    cool 9×buildable 8), **Circuit Breaker Lab** (arXiv:2309.10220, cool 8×buildable 9), **Mingling Physics:
    Fake Social Butterflies** (arXiv:2604.00652, cool 8×buildable 9)
- **Built (3 of 3 completed):**
  - A — **Watch a Neural Net Become a Gaussian Process** (arXiv:2607.06290, quantitative GP limits of Tensor
    Programs — empirical distance from the limiting Gaussian decays like 1/√width, architecture-agnostic
    including weight-shared/RNN-style nets): hundreds of tiny random one-hidden-layer MLPs sampled live
    client-side, histogrammed against the analytic NNGP limit as a width slider drags N from 4 to 4096, with a
    log-log Wasserstein-distance-vs-width plot overlaying a fitted regression slope against the paper's claimed
    rate.
  - B — **Circuit Breaker Lab** (arXiv:2309.10220, price limits vs. circuit breakers trace near-identical
    recovery curves when matched on parameters, except a too-short price-limit time window lets sell orders
    pile against the clamped band and stall recovery): a real toy limit-order-book ABM — zero-intelligence +
    momentum/panic traders, actual order matching, live price/depth charts, fat-finger and panic-cascade shock
    buttons, three regulation modes.
  - C — **Mingling Physics: Fake Social Butterflies** (arXiv:2604.00652, heavy-tailed face-to-face contact
    distributions reproduced by memoryless 2D random walkers with simple spatial targeting, no social memory
    needed): a crowd of biased random walkers between localized zones, live contact-count histograms comparing
    no-memory vs. memory-biased modes via Chart.js, crown icon on the "most popular" agent.
  - **Judge:** all three verified valid, self-contained HTML/JS (balanced tags, `node --check` clean, DOM ids
    resolve, headless-Playwright runs with zero console errors for B and C, CDN SRI hash verified for C); none
    disqualified. Numbers/claims cross-checked against the real arXiv abstracts. Scores (wow/interactivity/
    polish/fidelity, sum/40): A 34, **B 36**, C 32. **B (Circuit Breaker Lab) won** — the judge called it the
    most viscerally fun to interact with (you can genuinely break the market and watch the stuck-order wall
    form) while staying the most rigorously grounded, quoting the paper's core finding near-verbatim, with the
    strongest UI polish of the three.
- **Published:** demo at `demos/2026-08-19-circuit-breaker-lab.html`, brief at `2026-08-19-nightly.html`, both
  mirrored into `david-share` and registered in its manifest (commit `0e9063b`, pushed 2026-08-19). Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-19-circuit-breaker-lab.html and
  .../arxiv-scrape/2026-08-19-nightly.html once the VPS pulls.

## 2026-08-18 — Defect Drift Playground (autonomous run, judged/published on 2026-08-19)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed (all 3 builders
  wrote files) but judging/publishing/logging never ran (stray `ideation_2026-08-18.js`/`_raw.txt`/
  `_results.json`/`buildoff_2026-08-18.js` left uncommitted, no `judge_2026-08-18.js` written yet). Picked up
  and finished at the start of the 2026-08-19 session: wrote and ran a judge-only workflow against the 3
  existing builds, published, logged.
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **One-Shot Directed Evolution Copilot** (cool 9, buildable 3): ProteinGuide proposes protein
    variants in a single guided-generative forward pass, competitive with iterative directed-evolution rounds,
    with a natural-language front end (DNAHLM) for specifying the target property (arXiv:2505.04823 +
    arXiv:2410.16917)
  - youtube — **Time Has a Measurable 'Arrow' — The Physics of Imaginary Entropy** (cool 8, buildable 5):
    imaginary pseudo-entropy encodes temporal orientation — a quantum-information quantity that points which way
    time flows (arXiv:2606.29235)
  - project — **Fail-Closed Memory** (cool 7, buildable 6): governed, source-bound persistent memory layer for
    long-horizon agents that fails closed rather than open when provenance can't be verified (arXiv:2608.12476)
  - demo — 3 selected for build-off: **Prompt-Poison Playground** (arXiv:2607.21951, cool 9×buildable 8),
    **Defect Drift Playground** (arXiv:2605.25996, cool 9×buildable 8 combined), **Trend-Tide** (arXiv:2603.29593,
    cool 8×buildable 9)
- **Built (3 of 3 completed):**
  - A — **Prompt-Poison Playground: gaming an AI shopping recommender** (arXiv:2607.21951, SIREN — editing the
    content of one already-retrieved RAG page, holding the rest fixed, flips an LLM recommender's #1 pick;
    declarative/seeded-list framings beat directive injections, 0.805 mean reproduction rate at rank 1 across 2
    production Claude models): drag-and-drop palette of the paper's 23 real technique categories onto an editable
    listing, with a live-reranking leaderboard (FLIP animation) and probability meter.
  - B — **Defect Drift Playground: Spiral vs Fiber Waves** (arXiv:2605.25996, mechanochemical coupling between
    local pulsation and repulsion in pulsating active matter breaks spatial/time-reversal symmetry, making
    topological defects drift and driving a spiral-to-fiber wave crossover, cardiac-arrhythmia framing): a real
    FitzHugh-Nagumo reaction-diffusion PDE simulated live on canvas — not a scripted animation — with an
    asymmetry slider, defect-drift trail, and click-to-reseed.
  - C — **Trend-Tide: Watch Mean-Reversion Go Extinct** (arXiv:2603.29593, "Be Water" — an evolutionary proof
    that under frictionless/UBI-style conditions trend-following wealth share climbs toward saturation while
    mean-reversion wealth collapses toward zero): 10,000-agent, 5-archetype market sim with wealth dots, price
    tape, and stacked wealth-share chart, plus a friction toggle that partially reverses the result.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (balanced tags, no JS syntax
    errors, no missing DOM ids, no external CDN dependencies to break); none disqualified. Every demo's claimed
    numbers/claims cross-checked against the real arXiv abstracts. Scores (wow/interactivity/polish/fidelity,
    sum/40): A 31, **B 34**, C 31. **B (Defect Drift Playground) won** — it's the only entry running an actual
    live reaction-diffusion PDE solver rather than a stat-shuffling toy, producing a visually dramatic,
    physically-motivated transformation (pinned spiral core → drifting core → fiber filaments) that directly
    demonstrates the paper's ratchet/symmetry-breaking claim, and it was the most honest about what's
    quantitative vs qualitative.
- **Published:** demo at `demos/2026-08-18-defect-drift-playground.html`, brief at `2026-08-18-nightly.html`,
  both mirrored into `david-share` and registered in its manifest (commit `907fb06`, pushed 2026-08-19). Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-18-defect-drift-playground.html and
  .../arxiv-scrape/2026-08-18-nightly.html once the VPS pulls.

## 2026-08-17 — Rod Rave (autonomous run, judged/published on 2026-08-18)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed (all 3 builders
  wrote files) but judging/publishing/logging never ran (stray `ideation_2026-08-17.js`/`_results.json`/
  `buildoff_2026-08-17.js` left uncommitted, no `judge_2026-08-17.js` written yet). Picked up and finished at
  the start of the 2026-08-18 session: wrote and ran a judge-only workflow against the 3 existing builds,
  published, logged.
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **MatchRate — Tunable-Speed Marketplace Matching Engine** (cool 7, buildable 5): Random Proposals
    algorithm gets expected (1/2-ε)-approx max weighted matching in O(m log(1/ε)) time via softmax-biased local
    improvement, packaged as a speed/quality-dial matching API (arXiv:2606.12692)
  - youtube — **I Made 5 AIs Fight a Dark Souls Boss (None of Them Beat the Tutorial)** (cool 9, buildable 3):
    DSLE's real leaderboard — hand-coded expert system 63% wins vs evolutionary 43% vs underperforming deep RL,
    all against just the tutorial boss (arXiv:2608.09902)
  - project — **CTI Attack-Chain Compiler** (cool 7, buildable 6): pipeline turning narrative threat-intel
    reports into formal attack-unit predicates compiled to Datalog, reaching the stated attack goal in 19/20
    real reports tested (arXiv:2607.19742)
  - demo — 3 selected for build-off: **AI Contagion Network** (arXiv:2602.02607, cool 8×buildable 9), **Rod
    Rave** (arXiv:2607.10510, cool 8×buildable 9), **Glassy Grammar** (arXiv:2606.28103, cool 8×buildable 9)
- **Built (3 of 3 completed):**
  - A — **AI Contagion Network: the Implementation Tax simulator** (arXiv:2602.02607, gen-AI-adopting banks eat
    a 428bps average ROE hit from integration costs — 517bps small banks vs 129bps large — while becoming more
    correlated via shared algorithmic tooling, a new contagion channel): force-directed bank network, adoption
    slider drains ROE (harder on small banks), coupling slider lets an injected model-failure pulse cascade
    through correlated banks.
  - B — **Rod Rave — Watch Hard Rectangles Spontaneously Align** (arXiv:2607.10510, l×w hard rectangles on the
    2D square lattice provably form a nematic phase once aspect ratio k exceeds ~10^72, vs a numerically
    estimated empirical onset around k≈7): live Monte Carlo simulation — real insert/delete/shift/rotate lattice
    moves, not a scripted animation — with a nematic order-parameter readout as a k slider drives visible
    spontaneous alignment around k≈7-8, flashing the 65-orders-of-magnitude gap to the proven bound.
  - C — **Glassy Grammar: the Random Language Model phase-transition toy** (arXiv:2606.28103, a Random Language
    Model in the double-scaling limit behaves like a Random Energy Model and undergoes a hierarchy of phase
    transitions as "grammar temperature" drops): toy REM driven by a temperature slider with linked
    entropy/vocabulary-growth/generated-text panels that crystallize into frozen repeated rules as T drops.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (tags balanced, JS passes
    `node --check`, DOM ids exist, CDN scripts — d3@7.9.0, chart.js@4.4.4 — resolve with matching SRI hashes);
    none disqualified. Every demo's claimed numbers/formulas cross-checked verbatim against the real arXiv
    abstracts. Scores (wow/interactivity/polish/fidelity, sum/40): A 35, **B 36**, C 32. **B (Rod Rave) won** —
    it's a genuine running physics simulation producing real emergent symmetry-breaking you watch happen from
    local MC moves, not a pre-scripted animation, paired with the sharpest hook of the three (a 65-order-of-
    magnitude gap between the rigorous proof and what you see on screen).
- **Published:** demo at `demos/2026-08-17-rod-rave.html`, brief at `2026-08-17-nightly.html`, both mirrored
  into `david-share` and registered in its manifest (commit `2b71304`, pushed 2026-08-18). Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-17-rod-rave.html and .../arxiv-scrape/2026-08-17-nightly.html
  once the VPS pulls.

## 2026-08-16 — Interpolation Roulette (autonomous run, judged/published on 2026-08-17)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed (all 3 builders
  wrote files) but judging/publishing/logging never ran (stray `ideation_2026-08-16.js`/`_results.json`/
  `buildoff_2026-08-16.js`/`judge_2026-08-16.js` left uncommitted). Picked up and finished at the start of
  the 2026-08-17 session: ran a judge-only workflow against the 3 existing builds, published, logged (this
  log entry was itself missed at the time and is being backfilled now, 2026-08-18).
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **TubeAlpha: Fintuber Sentiment-Divergence Signal** (cool 7, buildable 6): trading signal from
    divergence between financial-YouTuber sentiment and realized returns (arXiv:2311.15247)
  - youtube — **The Square-Root Wall: Why Some Certificates Can Never Get Better** (cool 7, buildable 3):
    explainer on fundamental limits of KS-type layer-relaxation certification bounds (arXiv:2607.12134)
  - project — **Risk-Controlled Sentinel** (cool 7, buildable 6): calibrated real-time safety monitor for LLM
    output streams with provable missed-unsafe-rate bounds (arXiv:2607.02510)
  - demo — 3 selected for build-off: **Broken Gate: Spot the Agent** (arXiv:2607.18659, cool 8×buildable 9),
    **Interpolation Roulette** (arXiv:2607.09547, cool 8×buildable 9), **Brownian Bridge Box Score**
    (arXiv:2606.11760, cool 8×buildable 9)
- **Built (3 of 3 completed):**
  - A — **Broken Gate: Spot the Agent** (arXiv:2607.18659, commercial LLM-agent solvers near-perfectly bypass
    CAPTCHA-style bot gates, and real gates key off environment-authenticity signals not behavior): "spot the
    bot" game classifying cursor traces as human/agent, then reveals a behind-the-curtain panel showing the
    environment signals (headless flag, WebDriver property, fingerprint noise) that actually decide the verdict.
  - B — **Interpolation Roulette** (arXiv:2607.09547, ridgeless/min-norm-interpolating regression is accurate
    on average but has a heavy-tailed, slowly-decaying-probability of catastrophic error vs ridge regression's
    fast tail decay): dual "spin the wheel" simulator fitting both models client-side on synthetic
    high-dimensional data, animating live prediction-error histograms where ridge stays tight and ridgeless
    occasionally spikes; d/n slider dials up the fragility live.
  - C — **Brownian Bridge Box Score** (arXiv:2606.11760, the binary-tree Gaussian mechanism for private
    continual-observation queries can be replaced by constant-time Brownian-bridge interpolation instead of
    summing O(log T) tree nodes): live noised basketball box-score race between a naive tree-walk panel and a
    bridge-interpolation panel, T slider shows one cost growing while the other stays flat.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS; none disqualified. Scores
    (wow/interactivity/polish/fidelity, sum/40): A 33, B **36**, C 34 (approximate — original judge transcript
    was not preserved when this entry was backfilled). **B (Interpolation Roulette) won** — judged the most
    technically ambitious build, actually fitting both regressions in-browser rather than animating canned
    data, with fidelity down to quoting the paper's exact n² vs n·log n tail-decay rates.
- **Published:** demo at `demos/2026-08-16-interpolation-roulette.html`, brief at `2026-08-16-nightly.html`,
  both mirrored into `david-share` and registered in its manifest (commit `7ed27e3`, pushed 2026-08-17). Live
  at share.djiang.xyz/arxiv-scrape/demos/2026-08-16-interpolation-roulette.html and
  .../arxiv-scrape/2026-08-16-nightly.html.

## 2026-08-15 — Lahaina Lane-Reversal Simulator (autonomous run, judged/published on 2026-08-16)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed (all 3 builders
  wrote files this time) but judging, publishing, and logging never ran (stray `ideation_2026-08-15.js`/
  `_results.json`/`buildoff_2026-08-15.js` left uncommitted). Picked up and finished at the start of the
  2026-08-16 session: ran a judge-only workflow against the 3 existing builds, published, logged.
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **TrajectoryEdge** (cool 6, buildable 5): dynamic treatment-effect (DATE) estimator repurposed
    from time-series causal inference to price sports "shock events" (coaching fires, trades, injury returns)
    as trajectory shifts rather than static before/after win-rate deltas (arXiv:2602.00836)
  - youtube — **How to Solve a Linear Program EXACTLY** (cool 6, buildable 6): oracle-model algorithm recovers
    exact primal/dual LP solutions in O(n² log(n/δ)) calls to any approximate solver, no rounding/Diophantine
    machinery needed (arXiv:2606.11820)
  - project — **Safety Bridge Finder** (cool 7, buildable 5): activation-patching toolkit that finds the sparse
    shared cross-lingual pathways carrying safety/refusal signal in multilingual LLMs (arXiv:2608.09095)
  - demo — 3 selected for build-off: **Break the Agent** (arXiv:2607.18847, cool 8×buildable 9), **Lahaina
    Lane-Reversal Simulator** (arXiv:2603.29055, cool 8×buildable 8), **Trick the Color Brain**
    (arXiv:2602.13887, cool 8×buildable 8)
- **Built (3 of 3 completed):**
  - A — **Break the Agent: Live Leak-Rate Sandbox** (arXiv:2607.18847, pre-deployment hardening pipeline cuts
    prompt-injection leakage 100% on basic jailbreaks / 91% under stress-induced manipulation): toy agent with
    a fake `send_email` tool and an embedded secret, UNHARDENED/HARDENED toggle live-replicates the paper's
    leak-rate reduction as you paste injection attempts.
  - B — **Lahaina Lane-Reversal Simulator** (arXiv:2603.29055, hyperbolic-conservation-law model of the 2023
    Lahaina evacuation finds reversing one lane captures nearly all achievable clearance-time improvement):
    real Godunov-scheme LWR PDE solver over a simplified peninsula grid, lane-reversal slider + emergency-lane
    toggle drive a live clearance-time readout.
  - C — **Trick the Color Brain** (arXiv:2602.13887, human/DNN color-constancy psychophysics task): browser
    version of the paper's achromatic-color-picking task with the same cue-removal toggles, compares the
    user's own degradation curve to the paper's human/DNN curves.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (tags balanced, JS
    syntax-checked, DOM ids exist, Chart.js CDN resolves). None disqualified. Scores (wow/interactivity/
    polish/fidelity): A 7/8/9/8=32, B 9/8/9/9=35, C 8/9/8/7=32. **B (Lahaina Lane-Reversal) won** — the only
    build that reconstructed the paper's actual method (a numerical PDE solver with a junction-splitting rule)
    rather than approximating it with heuristics, while also the most polished and best animated.
- **Published:** demo at `demos/2026-08-15-lahaina-lane-reversal.html`, brief at `2026-08-15-nightly.html`,
  both mirrored into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-15-lahaina-lane-reversal.html and
  .../arxiv-scrape/2026-08-15-nightly.html once the VPS pulls.

## 2026-08-14 — Permutation Snap (autonomous run, judged/published on 2026-08-15)
- **Note:** same stall pattern as prior nights — ideation and the build-off ran but the 3rd builder (Rank-Width
  Playground, arXiv:2607.23101) never produced a file, and judging/publishing/logging never ran (stray
  `ideation_2026-08-14.js`/`_results.json`/`_results_raw.json`/`buildoff_2026-08-14.js` left uncommitted). Picked
  up and finished at the start of the 2026-08-15 session: judged the 2 completed builds, published, logged.
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **ESG Weight Reveal** (cool 6, buildable 7): interactive leaderboard where dragging Refinitiv's
    per-category ESG weights reshuffles company rankings live, exposing how much of "your ESG score" is a policy
    choice (arXiv:2312.00202)
  - youtube — **The Orchids That Are Winning Right Now — And Losing By 2070** (cool 7, buildable 6): SDM
    projections show orchids gaining ground today are still headed for range collapse by 2070 (arXiv:2511.01122)
  - project — **Ground-Truth-Free HTR Scorer** (cool 6, buildable 8): CLI that estimates handwriting/OCR accuracy
    from agreement between two independent transcriptions, no gold-standard transcript required (arXiv:2608.03617)
  - demo — 3 selected for build-off: **Permutation Snap** (arXiv:2607.12431, cool 8×buildable 9), **Numerical
    Semigroup Tree Explorer** (arXiv:2607.23111, cool 8×buildable 9), **Rank-Width Playground**
    (arXiv:2607.23101, cool 8×buildable 9)
- **Built (2 of 3 completed; 3rd builder never wrote a file):**
  - A — **Permutation Snap** (arXiv:2607.12431, entrywise l4-norm maximization over the orthogonal group has
    signed permutation matrices as its *only* local/global maximizers): SO(2) objective plotted live against a
    rotation slider, gradient ascent animated snapping toward a permutation matrix, plus a bonus panel that
    un-mixes two blindly-combined sine tones live via the same ascent (audible ICA-via-kurtosis).
  - B — **Numerical Semigroup Tree Explorer** (arXiv:2607.23111, exact multiparameter counting formula for
    numerical semigroups by genus/Frobenius number/multiplicity): Chicken-McNugget-style branching tree game with
    a live counter verifying the theorem node-by-node.
  - C — **Rank-Width Playground** — never built; the 3rd builder subagent did not produce a file.
  - **Judge:** both existing builds verified valid, self-contained, dependency-free HTML/JS (tags balanced, JS
    passes `node --check`, all DOM ids exist, Chart.js CDN SRI hash checked for B); neither disqualified. Scores
    (wow/interactivity/polish/fidelity): A 9/9/9/9=36, B 8/9/9/6=32. **A (Permutation Snap) won** — verbatim-
    accurate math with no discrepancies, versus B's formula error (stated m ≥ (F+2)/3 vs the paper's actual
    m ≥ (F+1)/3) and unverifiable hardcoded digits.
- **Published:** demo at `demos/2026-08-14-permutation-snap.html`, brief at `2026-08-14-nightly.html`, both
  mirrored into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-14-permutation-snap.html and
  .../arxiv-scrape/2026-08-14-nightly.html once the VPS pulls.

## 2026-08-13 — Vortex Playground (autonomous run, judged/published on 2026-08-14)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed but judging,
  publishing, and logging never ran (stray `ideation_2026-08-13.js`/`_results.json`/`_results_raw.json`/
  `buildoff_2026-08-13.js` left uncommitted). Picked up and finished at the start of the 2026-08-14 session:
  ran a judge-only workflow against the existing builds, published, logged.
- **Fetch:** fresh papers across categories, 24 ideas generated across all four categories.
- **Top per category:**
  - startup — **Manski Bounds: Ambiguity-Aware Bet Sizing** (cool 7, buildable 6): partial-identification /
    minimax-regret bet sizing wired into SharpLab/nba-modeling instead of trusting a single point-estimate
    model (arXiv:2602.00355)
  - youtube — **I Tried to Break the AI Story Narrator** (cool 8, buildable 5): live on-camera attempt to
    trap 2-3 LLMs into contradicting themselves in an interactive story, punchline reveals NCP-Bench's real
    42%-survival-at-20-turns number (arXiv:2608.08160)
  - project — **JailMeter-Lite** (cool 6, buildable 6): portable evidence-extract + intent-judge pipeline for
    scoring your own red-team (prompt, response) pairs, ported from JailMeter's 97.27%-human-agreement method
    (arXiv:2607.19424)
  - demo — 3 selected for build-off: **Nursery Entropy Simulator** (arXiv:2603.29312, cool 9×buildable 9),
    **Vortex Playground** (arXiv:2607.08435, cool 9×buildable 8), **Outbreak Roulette**
    (arXiv:2511.02882, cool 8×buildable 9)
- **Built (3-way build-off):**
  - A — **Nursery Entropy Simulator** (arXiv:2603.29312, a deadpan "theory of infantile dynamics" April
    Fools paper played straight): toys diffuse from shelf to play-area while a live entropy meter climbs, a
    "Parent Demon" button drags toys back for a transient ordering episode before entropy resumes its climb.
  - B — **Vortex Playground** (arXiv:2607.08435, global exact controllability + exponential mixing for
    singular-kernel particle systems — Coulomb/Riesz/Yukawa): drag control particles to steer an N-body
    swarm into target formations despite chaotic singular interactions; mixing mode shows a live
    KL-divergence-to-equilibrium chart as noise erases the swarm's memory of its start.
  - C — **Outbreak Roulette** (arXiv:2511.02882, stochastic SVEIS epidemic model with Black-Karasinski noise
    — noise can push a disease that would go deterministically extinct into persisting): side-by-side
    deterministic-ODE vs noisy-SDE panels with a live stationary-distribution histogram.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS via headless Playwright
    render (zero console/JS errors, tags balanced, all referenced DOM ids exist, Chart.js CDN SRI hash
    checked for A); none disqualified. Scores (wow/interactivity/polish/fidelity): B 9/9/9/8=35, A
    7/8/8/9=32, C 7/8/8/9=32. **B (Vortex Playground) won** — richest interaction surface (kernel switch,
    six target formations, drag-to-steer, live mixing chart) with careful, explicitly-flagged fidelity to
    the abstract's actual claims.
- **Published:** demo at `demos/2026-08-13-vortex-playground.html`, brief at `2026-08-13-nightly.html`, both
  mirrored into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-13-vortex-playground.html and
  .../arxiv-scrape/2026-08-13-nightly.html once the VPS pulls.

## 2026-08-12 — Cone of No Escape (autonomous run, judged/published on 2026-08-13)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed but judging,
  publishing, and logging never ran (stray `ideation_2026-08-12.js`/`_results.json`/`_results_raw.json`/
  `buildoff_2026-08-12.js` left uncommitted). Picked up and finished at the start of the 2026-08-13 session:
  judged the existing builds, published, logged.
- **Fetch:** fresh papers across categories, 30 sampled for ideation, 6 batches, 24 ideas generated (demo/
  startup/youtube this batch — no project-tagged idea surfaced).
- **Top per category:**
  - startup — **Causal AI ROI Audit** (cool 7, buildable 5): audits a bank's AI-adoption numbers through a
    causal framework to separate genuine productivity lift from risk-shifting that just looks like ROI
    (arXiv:2602.02607)
  - youtube — **The Memory That Can't Tell a Story** (cool 8, buildable 6): visual explainer of a
    computational account of developmental amnesia — the failure is in sequential learning (chaining facts
    into narrative), not general memory loss (arXiv:2602.12547)
  - demo — 3 selected for build-off: **Cone of No Escape** (arXiv:2607.07589, cool 8×buildable 9), **Tumble
    or Steer** (arXiv:2602.23324, cool 8×buildable 9), **The Diversity Illusion Simulator**
    (arXiv:2603.26896, cool 8×buildable 9)
- **Built (3-way build-off):**
  - A — **Cone of No Escape** (arXiv:2607.07589, sharp phase transition for competing first-passage
    percolation from a cone — Ahlberg–Deijfen–Sfragara, resolving the Benjamini conjecture at theta=pi/2):
    a real multi-source Dijkstra race with Exp(1) random edge weights over a grid; dragging theta across
    pi/2 visibly flips the outcome between SURVIVES and SWALLOWED live.
  - B — **Tumble or Steer** (arXiv:2602.23324, optimal chemotactic navigation strategy bifurcates discretely
    with the sensing information budget): agents climbing a gradient field with an info-budget slider and a
    log-log speed-vs-information frontier chart showing the discrete-turn-count bifurcation.
  - C — **The Diversity Illusion Simulator** (arXiv:2603.26896, local contact drives local overestimation of
    racial diversity while perceived media exposure drives national-scale overestimation): 3-slider gauge
    vs. real Census anchor, driver-weight bar chart, downloadable share card.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (JS parses clean, tags
    balanced, all DOM ids referenced exist, Chart.js CDN SRI hash checked for B); none disqualified. Scores
    (wow/interactivity/polish/fidelity): A 9/8/9/9=35, C 8/9/9/8=34, B 7/8/7/8=30. **A (Cone of No Escape)
    won** — its "simulation" is the real thing, an actual multi-source Dijkstra race that visibly enacts the
    exact theta=pi/2 phase transition the paper proves, rather than a dramatization of survey coefficients.
- **Published:** demo at `demos/2026-08-12-cone-of-no-escape.html`, brief at `2026-08-12-nightly.html`, both
  mirrored into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-12-cone-of-no-escape.html and
  .../arxiv-scrape/2026-08-12-nightly.html once the VPS pulls.

## 2026-08-11 — TreeJam (autonomous run, judged/published on 2026-08-12)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed but judging,
  publishing, and logging never ran (stray `ideation_2026-08-11.js`/`_results.json`/`_results_raw.json`/
  `buildoff_2026-08-11.js` left uncommitted). Picked up and finished at the start of the 2026-08-12 session:
  judged the existing builds, published, logged.
- **Fetch:** fresh papers across categories, 30 sampled for ideation, 6 batches, 24 ideas generated (no
  youtube-tagged idea surfaced this batch — project/startup/demo only).
- **Top per category:**
  - project — **Skill Memory Block World** (cool 7, buildable 6): browser grid-world toy porting SkillMemo's
    MoE-gated auto-segmentation of robot demos into retrievable atomic-skill primitives, stitched into unseen
    task compositions live (arXiv:2608.05970)
  - startup — **Resistant Patient: a CBT-trainee sparring partner** (cool 8, buildable 3): practice platform
    where psych grad students run CBT sessions against an ODRA-style LLM patient with a tunable resistance
    dial and automated fidelity-rubric scoring (arXiv:2608.04524)
  - demo — 3 selected for build-off: **Watermark That Survives the Shredder** (arXiv:2607.16648, cool 9×
    buildable 8), **Sentropy Playground** (arXiv:2511.03849, cool 8×buildable 9), **TreeJam** (arXiv:2606.06686,
    cool 8×buildable 9)
- **Built (3-way build-off):**
  - A — **Watermark That Survives the Shredder** (arXiv:2607.16648, synchronization-free Reed-Solomon
    algebraic LLM watermark): real SubtleCrypto SHA-256 + GF(257) polynomial evaluation embedding bits as
    zero-width chars, live recovery-confidence meters vs. a simulated naive block watermark under
    shred/reorder/noise edits.
  - B — **Sentropy Playground** (arXiv:2511.03849, LCR vs. Vendi Score similarity-sensitive diversity
    measures, VS provably ≥ LCR): draggable NBA-lineup skill-vector dots with a live Shannon/LCR/VS readout
    and half-distance slider reproducing the paper's divergence result.
  - C — **TreeJam** (arXiv:2606.06686, NP-hardness of Pebble Motion on trees, first hardness result for the
    2-colored variant): drag-pebble puzzle on a subdivided-star tree racing a real in-browser BFS solver that
    visibly chokes past ~10-12 pebbles.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (balanced tags, `node
    --check` clean, referenced DOM ids present, CDN SRI hash checked for A); none disqualified. Scores
    (wow/interactivity/polish/fidelity): A 7/8/8/8=31, B 6/7/8/9=30, C 9/9/8/9=35. **C (TreeJam) won** — the
    only demo where you don't just read about the paper's result but feel it: solving the puzzle by hand while
    a real BFS solver races you into the same combinatorial wall the NP-hardness proof predicts.
- **Published:** demo at `demos/2026-08-11-treejam.html`, brief at `2026-08-11-nightly.html`, both mirrored
  into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-11-treejam.html and
  .../arxiv-scrape/2026-08-11-nightly.html once the VPS pulls.

## 2026-08-10 — Chase on a Random Graph (autonomous run, judged/published on 2026-08-11)
- **Note:** same stall pattern as prior nights — ideation and the 3-way build-off completed but judging,
  publishing, and logging never ran (stray `ideation_2026-08-10.js`/`_results.json`/`buildoff_2026-08-10.js`
  left uncommitted). Picked up and finished at the start of the 2026-08-11 session: judged the existing
  builds, published, logged.
- **Fetch:** fresh papers across categories, 30 sampled for ideation, 6 batches, 24 ideas generated.
- **Top per category:**
  - project — **Skill Supply-Chain Auditor** (cool 7, buildable 8): static scanner for LLM agent "skills"
    covering the paper's attack taxonomy (prompt-injection-via-description, over-broad permissions,
    malicious updates) before a skill is trusted in an agent loop (arXiv:2607.13987)
  - startup — **npm firewall powered by judge-agent triage** (cool 6, buildable 5): registry-proxy firewall
    running every install through the paper's multi-agent malicious-package triage pipeline
    (arXiv:2607.13965)
  - youtube — **AI Already Runs Drug Discovery Autonomously — So Why Won't We Let It Touch Our Paycheck?**
    (cool 7, buildable 4): maps the inconsistent line between where humans still insist on manual control
    in AI finance vs. where autonomy is already ceded elsewhere (arXiv:2608.02100)
  - demo — 3 selected for build-off: **Sparse Brain** (arXiv:2607.27591, cool 8×buildable 10), **Chase on a
    Random Graph** (arXiv:2607.04002, cool 8×buildable 9), **Flocking Edge Modes** (arXiv:2606.24926, cool
    9×buildable 8)
- **Built (3-way build-off):**
  - A — **Sparse Brain** (arXiv:2607.27591, FFN activation sparsity from approximate-intermediate magnitude
    ranking, 1.99x speedup at 70% sparsity): live linear algebra on a simulated 1024-channel SwiGLU FFN,
    sparsity slider driving a real cosine-sim/L2-error readout and speedup gauge.
  - B — **Flocking Edge Modes** (arXiv:2606.24926, frustrated Vicsek-Kuramoto active particles reproducing
    non-Hermitian topological edge transport): live swarm sim with a frustration slider, edge-circulation
    sparkline, drag-to-kick interaction.
  - C — **Chase on a Random Graph** (arXiv:2607.04002, recurrent-vs-transient dichotomy for two random
    walkers on unimodular random graphs): real Bowyer-Watson Delaunay triangulation + Gabriel filter +
    growing preferential-attachment graph with force layout, animated pursuer/evader walkers, voter-model
    mode.
  - **Judge:** all three verified valid, self-contained, dependency-free HTML/JS (balanced tags, `node
    --check` clean, referenced DOM ids present); none disqualified. Scores (wow/interactivity/polish/
    fidelity): A 7/7/9/9=32, B 9/9/8/8=34, C 9/9/9/9=36. **C (Chase on a Random Graph) won** — the most
    technically ambitious build (real computational geometry + a live growing scale-free graph) while being
    the most rigorously honest about where its finite-graph demo diverges from the paper's infinite-graph
    theorem.
- **Published:** demo at `demos/2026-08-10-chase-random-graph.html`, brief at `2026-08-10-nightly.html`,
  both mirrored into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-10-chase-random-graph.html and
  .../arxiv-scrape/2026-08-10-nightly.html once the VPS pulls.

## 2026-08-09 — Curvature Mass Playground (autonomous run, judged/published on 2026-08-10)
- **Note:** same stall pattern as 08-07/08-08 — ideation and the 3-way build-off completed but judging, publishing,
  and logging never ran (stray `ideation_2026-08-09.js`/`_results.json`/`buildoff_2026-08-09.js` left uncommitted).
  Picked up and finished at the start of the 2026-08-10 session: judged the existing builds, published, logged.
- **Fetch:** 176 fresh papers across 22 categories. 30 sampled for ideation, 6 batches, 24 ideas generated.
- **Top per category:**
  - project — **Privileged-Data Distillation: train rich, deploy cheap** (13): ports a cancer-imaging trick — train
    on a cheap+expensive modality pair, deploy on the cheap modality alone — onto the user's NBA props edge modeling,
    box scores standing in for tracking data (arXiv:2411.00749)
  - startup — **Parsimony Terminal** (11): 5-parameter, near-LSTM-accuracy vol forecaster feeding a
    return-diversification allocator that collapses to Risk Parity in calm regimes — "explainable in 5 numbers, no
    GPU" (arXiv:2311.04727 + arXiv:2312.09707)
  - youtube — **Why some seeds fly a mile and 99% land a foot away** (15): Gamma-stopped subdiffusive fractional
    Brownian motion turns thin exponential dispersal tails into real power-law tails, animatable as one side-by-side
    particle sim (arXiv:2606.21681)
  - demo — 3 selected for build-off: **Curvature Mass Playground** (arXiv:2605.19183, top score c9×b8),
    **Shift Scope** (arXiv:2608.01268), **Life-Space** (arXiv:2505.15849)
- **Built (3-way build-off):**
  - A — **Curvature Mass Playground** (arXiv:2605.19183, a surface nematic picks up an effective mass term
    m²=K_ab K^ab purely from the extrinsic curvature of the surface it's embedded in): a real finite-difference
    second-fundamental-form computation on a three.js mesh morphing between plane/sphere/saddle/torus-neck, with a
    draggable defect marker whose live-computed mass spikes near curvature and vanishes on the flat plane.
  - B — **Shift Scope** (arXiv:2608.01268, certifying a distribution-shift feature of scale ε needs test degree
    N*≥log(1/f)/(2ε), optimal MMD kernel bandwidth σ*=ε, median σ*/ε=1.12 across 26 real settings): live moment
    tests and an MMD statistic on real sampled point clouds, sliders for ε/f/bandwidth.
  - C — **Life-Space** (arXiv:2505.15849, ~68 expert life-definitions clustered into a continuous thematic
    landscape rather than a binary category): a live 2D MDS-style embedding of ~25 borderline entities
    (virus/fire/AI chatbot/Von Neumann probe) with draggable custom-entity sliders.
  - **Judge:** opened and validated all three (balanced script tags, resolvable CDN URLs + matching SRI hashes, all
    referenced DOM ids present), none disqualified; cross-checked claims against each paper's abstract, no
    fabrications (B slightly conflated which method achieves two of its cited figures; C's specific numbers weren't
    independently confirmable from the abstract alone but are consistent with the described methodology). Scores
    (wow/interactivity/polish/fidelity): A 9/9/9/10=37, B 7/8/8/8=31, C 8/9/9/7=33. **A (Curvature Mass) won** — the
    only build doing real, live differential geometry on a draggable 3D mesh, and the tightest match to its paper's
    stated formula.
- **Published:** demo at `demos/2026-08-09-curvature-mass.html`, brief at `2026-08-09-nightly.html`, both mirrored
  into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-09-curvature-mass.html and .../arxiv-scrape/2026-08-09-nightly.html
  once the VPS pulls.

## 2026-08-08 — Phase Sync Playground (autonomous run, judged/published late on 2026-08-09)
- **Note:** the 2026-08-08 session got through ideation and the 3-way build-off but stopped before judging,
  publishing, or logging (stray `ideation_2026-08-08.js`/`_results.json`/`buildoff_2026-08-08.js` left uncommitted).
  Picked up and finished on 2026-08-09: judged the existing builds, published, logged.
- **Fetch:** 176 fresh papers across 22 categories. 30 sampled for ideation, 6 batches, 24 ideas generated.
- **Top per category:**
  - project — **sw-cdf: sort-free Sliced-Wasserstein micro-library + live demo** (48): CDF-based Sliced-Wasserstein
    estimator replacing sort-based pipelines with embarrassingly-parallel CDF-grid evaluation, built for federated
    learning (arXiv:2606.30310)
  - startup — **HalfFull/HalfEmpty Bankroll Optimizer for Sports Bettors** (42): behavioral portfolio model provably
    equivalent to a tractable MILP, beats Prospect Theory/risk-min/equal-weight on real data (arXiv:2312.10749)
  - youtube — **The Evolutionary Traffic Jam: How Simple Genes Build Impossible Bottlenecks** (42): fitness-landscape
    bottlenecks emerging from global epistasis with zero gene-gene interaction (arXiv:2505.14166)
  - demo — 3 selected for build-off: **Phase Sync Playground** (arXiv:2607.06762), **The Insurability Cliff**
    (arXiv:2607.13230), **The Sweet Spot** (arXiv:2605.19795)
- **Built (3-way build-off):**
  - A — **Phase Sync Playground: Watch Spectral Recovery Hit Its Threshold** (arXiv:2607.06762, power-grid
    voltage-angle estimation reduced to phase synchronization; a spectral method — top eigenvector of a noisy
    phase-connection graph — recovers true angles below a noise threshold normalized against the observability
    margin, with a zero-duality-gap certificate in the noiseless case): a genuine from-scratch Jacobi eigensolver
    on a 128×128 real Hermitian connection-matrix embedding, live on every slider drag, with a "certified / not
    certified" badge flipping at the theoretical threshold and the actual dual certificate δ(x) computed on screen.
  - B — **The Insurability Cliff: Price Your AI Agent** (arXiv:2607.13230, risk-state → premium/deductible mapping
    for agentic-AI deployments with proven monotone feasibility deterioration): five sliders drive a real
    risk-state-to-premium calculation; crank permission exposure or autonomy past the governance line and the panel
    flips into an "infeasible / uninsurable" red zone.
  - C — **The Sweet Spot: Optimal Complexity in Smart Materials** (arXiv:2605.19795, an I1/I2/I3 complexity
    framework for responsive materials): draggable log-scale points reproducing the paper's exact reported
    order-of-magnitude bands; least ambitious of the three, no live numerical method, candidly labels its
    illustrative curve where the paper has no closed form.
  - **Judge:** static review only (no headless browser available) — validated all three via Node syntax checks,
    DOM-id resolution, tag balance, and CDN hash verification; none disqualified. Cross-checked all three abstracts
    against demo claims, no fabrications found. Scores (wow/interactivity/polish/fidelity): A 9/8/8/9=34, B
    7/8/8/9=32, C 6/6/7/8=27. **A (Phase Sync) won** — the only build doing real, non-canned linear algebra live in
    the browser while staying most faithful to its paper's theorems.
- **Published:** demo at `demos/2026-08-08-phase-sync.html`, brief at `2026-08-08-nightly.html`, both mirrored into
  `david-share` and registered in its manifest. Live at share.djiang.xyz/arxiv-scrape/demos/2026-08-08-phase-sync.html
  and .../arxiv-scrape/2026-08-08-nightly.html once the VPS pulls.

## 2026-08-07 — Last One Damaged (autonomous run, judged/published late on 2026-08-09)
- **Note:** same stall pattern as 08-08 — build-off completed, judging/publishing/logging never ran. Picked up and
  finished on 2026-08-09.
- **Fetch:** 176 fresh papers across 22 categories. 30 sampled for ideation, 6 batches, 25 ideas generated.
- **Top per category:**
  - project — **Ledger: an evidence-adjudication layer for AI-drafted claims** (35): agentic claim/evidence
    adjudication beating non-agent baselines by a wide margin (relation accuracy 0.676 vs 0.383), pitched as a
    citation-honesty grammar-checker browser extension (arXiv:2607.26512)
  - startup — **DriftGuard: bandwidth-calibrated drift monitoring for LLM/embedding pipelines** (42): auto-calibrated
    kernel bandwidth for distribution-shift detection, ~1.12x off optimal on real embedding streams
    (arXiv:2608.01268)
  - youtube — **We Tried to Catch an AI Lying — One Model Beat the Lie Detector** (48): alignment-faking probes
    that work on one model's hidden states (AUROC 0.87) and nearly fail on another's (0.43) (arXiv:2607.13346)
  - demo — 3 selected for build-off: **Risk Appetite Maze** was the top score (72) but variety picks went to
    **Last One Damaged** (arXiv:2607.16382), **The Replacer's Edge** (arXiv:2511.04417), and **Sticky Disks**
    (arXiv:2605.20882)
- **Built (3-way build-off):**
  - A — **Sticky Disks: Selective Adsorption Sandbox** (arXiv:2605.20882, two same-size particle species sort
    selectively onto a patterned sticky surface, with selectivity peaking when adhesive-domain size is near
    particle diameter): a real hard-disk Metropolis Monte Carlo simulation — genuine Boltzmann acceptance,
    hard-disk exclusion — with sliders for domain size, coverage, and adhesion strength.
  - B — **The Replacer's Edge — Moran Process Invasion Simulator** (arXiv:2511.04417, a "replacer" phenotype that
    always displaces a different-type neighbor on reproduction fixes with probability ~1/√N instead of the standard
    1/N): live per-step invasion animation plus a Monte-Carlo sweep visibly bending the empirical fixation curve off
    the classic 1/N line on a log-log chart; "hard counter" MOBA/CCG whimsy hook.
  - C — **Last One Damaged: The Zombie Pursuit Game** (arXiv:2607.16382, a "damage variant of Cops and Robber"
    where one cop is geodesic-constrained): an actually playable click/drag/arrow-key pursuit game across four real
    graph families from the paper's theorems (cycles, complete multipartite, random trees via Prüfer sequences,
    girth-5/min-degree-2 graphs), correct BFS shortest-path logic, force-directed layout, auto-play bot, and a live
    damage-vs-proven-ζ_dmg chart.
  - **Judge:** static review (no headless browser available) — Node syntax checks, DOM-id resolution, CDN
    reachability, all three self-contained and valid, none disqualified. Cross-checked all three abstracts, no
    fabrications. Scores: A 6/7/7/9=29, B 8/9/8/9=34, C 9/9/8/9=35. **C (zombie game) won** — most technically
    ambitious and most fun to actually play (real BFS pursuit, four graph families, auto-play bot) while staying
    just as faithful to its theorems as the close-second Moran-process sim.
- **Published:** demo at `demos/2026-08-07-zombie-damage.html`, brief at `2026-08-07-nightly.html`, both mirrored
  into `david-share` and registered in its manifest. Live at
  share.djiang.xyz/arxiv-scrape/demos/2026-08-07-zombie-damage.html and .../arxiv-scrape/2026-08-07-nightly.html
  once the VPS pulls.

## 2026-08-06 — Topological Knob (autonomous run)
- **Fetch:** clean run (first attempt hit the 2-minute foreground timeout mid-way through category fetches, no data
  written; rerun completed cleanly). `fetch_papers.py 8 654` (offset = day-of-year 218 × 3), 176 fresh papers across
  all 22 categories.
- **Sampled:** 30 papers (seed = day-of-year 218) for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Demo-shaped ideas dominated the top of the cool×buildable board again; a physics demo
  (voltage-tunable SSH chain, arXiv:2605.19664) took the clear top score (c9×b9=81) over a 5-way tie at 72.
- **Top per category:**
  - project — **Probability Theory You Can Feel**: Kesten-tree conditioning + random-geometric-graph detection
    threshold, made into a drag-and-watch gallery (arXiv:2607.01877 + arXiv:2607.02013)
  - startup — **ChargeOps**: DRL charge/station-assignment-as-a-service for warehouse AMR fleets, sold on a
    measured 6% order-completion-rate uplift (arXiv:2607.05683)
  - youtube — **What Is an AI Actually Learning About Biology?**: persistent homology in biological foundation
    models + the "same coastline, different cities" gene-alignment mismatch, framed as AI-doing-science-on-AI
    (arXiv:2602.22289)
  - demo — top score: **Topological Knob** (arXiv:2605.19664, c9×b9=81) ← built, alongside two 72-scorers picked
    for build variety: **Schur Sum-Free Colorer** (arXiv:2607.15034) and **The Diversity Illusion Simulator**
    (arXiv:2603.26896)
- **Built (3-way build-off):**
  - A — **Topological Knob: Voltage-Tunable SSH Chain** (arXiv:2605.19664, a liquid-crystal microcavity realizes
    two coupled Su-Schrieffer-Heeger chains — orthogonal light polarizations as a photonic pseudospin — with
    applied voltage tuning interchain coupling at room temperature): a real SSH tight-binding Hamiltonian,
    diagonalized live in-browser via a hand-written Jacobi eigensolver on every slider tick — no lookup tables. A
    single voltage slider crosses intercell = intracell hopping, closing and reopening the energy gap while a
    localized mid-gap edge state visibly glows at the chain ends; a pseudospin-split toggle renders both
    polarization chains. Zero external dependencies, fully offline. Builder verified live via Playwright (gap
    1.628→0.023 crossing the transition, phase badge flips) and explicitly disclosed that the paper gives no
    voltage→coupling calibration, so that mapping is labeled illustrative while the SSH math itself is genuinely
    computed.
  - B — **The Diversity Illusion Simulator** (arXiv:2603.26896, people overestimate a minority group's population
    share more at the national scale than local, with the driver shifting from direct contact (local) to perceived
    media coverage (national), amplified by social-media use): two sliders and a scale toggle drive a live
    perceived-vs-actual demographic gap over a canvas dot grid of true composition, with a Chart.js line comparing
    the gap across all three scales at once. Judge independently recomputed the in-page formula by hand and
    confirmed it matched the displayed output exactly.
  - C — **Schur Sum-Free Colorer** (arXiv:2607.15034, a "shifted S-template" recurrence S(k+2) ≥ 10·S(k)+2 beats
    the older Abbott-Hanson bound, credited in the paper to a ChatGPT 5.5 Pro conversation, human-verified): a
    drag-and-drop sum-free-coloring puzzle with live violation detection (flags real x+y=z triples) plus a
    recursive-build animation of the shift-and-double construction. Judge checked 10·536+2=5362 and
    10·203828+2=2038282 against the fetched abstract — bit-exact.
  - **Judge:** scored wow/interactivity/polish/fidelity per demo (A 8/7/8/9=32, B 6/7/7/6=26, C 8/9/8/8=33) — all
    three verified running with zero console errors in headless Chromium via independent Playwright passes, none
    disqualified, no fabricated numbers found against live-fetched abstracts. C edged A on raw points, but the
    judge broke the tie for **A**: it's the only build actually computing the real physics live (genuine numerical
    diagonalization) rather than an illustrative parametric model layered over reported findings, and it ships with
    no CDN dependency at all.
- **Published:** demo at `demos/2026-08-06-topological-knob.html`, brief at `2026-08-06-nightly.html`, both mirrored
  into `david-share` and registered in its manifest. Live at
  https://share.djiang.xyz/arxiv-scrape/demos/2026-08-06-topological-knob.html (demo) and
  https://share.djiang.xyz/arxiv-scrape/2026-08-06-nightly.html (brief).
- **Housekeeping note:** found the 2026-08-04 and 2026-08-05 runs left mid-pipeline — build-offs completed (demos
  exist in `demos/`) but neither was judged, published to david-share, nor logged here. Left untouched tonight to
  stay in scope; worth a follow-up pass to judge/publish or discard them.

## 2026-08-03 — Cutoff (autonomous run)
- **Fetch:** clean run, no hiccups. `fetch_papers.py 8 645` (offset = day-of-year 215 × 3), 176 fresh papers across
  all 22 categories.
- **Sampled:** 30 papers (random seed = day-of-year 215) for ideation, 6 batches of 5.
- **Ideas:** 24 generated. Demo-shaped ideas again dominated (13 of 24), with a rare three-way tie at the top
  cool×buildable score (72).
- **Top per category:**
  - project — **Ground Truth Gate**: a drop-in wrapper for long-running Claude Code / cron agents (this repo
    included) that replaces self-verdict gating with an isolated world-state oracle check, grounded in the same
    agent-self-evaluation-bias paper that seeded tonight's runner-up demo (arXiv:2607.25152)
  - startup — **LLM VIX**: a continuously-updated volatility index for production LLM APIs — semantic drift, format
    volatility, and refusal-rate variance measured daily per model, sold as implied-vol infra for teams running LLMs
    in regulated pipelines (arXiv:2311.15180)
  - youtube — **I Simulated 10,000 Quantum Trajectories Until They Forgot Each Other**: propagation-of-chaos for
    Belavkin equations rendered as a decorrelating particle swarm, with a poker-table whimsy hook for the outro
    (arXiv:2606.29557)
  - demo — three-way tie at 72: **Cutoff: The Shuffle That Suddenly Mixes** (arXiv:2606.29530), **Progress Mirage
    Simulator** (arXiv:2607.25152), **Patient Zero** (arXiv:2606.24465) ← all three built
- **Built (3-way build-off):**
  - A — **Cutoff: The Shuffle That Suddenly Mixes** (arXiv:2606.29530, top-*m*-to-random card shuffles exhibit a
    cutoff phenomenon: total variation distance to uniform stays near 1 for a long stretch, then collapses sharply
    in a narrow window whose profile shape is computable as block size grows with deck size): a population of 300
    simulated decks runs the real shuffle Markov chain; one hero deck animates on canvas while a live distance
    chart tracks the real collapse against a dashed theoretical overlay using the exact closed-form separation
    formula (`1-e^-λ(1+λ)` for m=1, `1-e^-λ` for m≥2). Deck size and block size sliders visibly sharpen the
    collapse window as they change. Zero external dependencies — fully self-contained. Builder's Playwright pass
    caught and fixed a real bug (`skip-to-end` called an undefined `render(0)` left over from a refactor, producing
    a page error) by unifying render logic into a shared `renderAll()`.
  - B — **Progress Mirage Simulator** (arXiv:2607.25152, self-evaluating agent loops claim improvement almost every
    cycle while a majority of cycles have zero-or-negative real delta; an externally-grounded oracle that gates on
    true state recovers near-baseline output): a shared noisy-action generator feeds two evaluation modes —
    Self-Verdict (always applies actions, always claims progress) vs. External Oracle (rejects/reverts regressions)
    — racing two Chart.js lines (Claimed vs. Real) with a monospace narrator printing plausible self-verdict spin.
    Builder fetched the real abstract and grounded the in-page stats (54 cycles, 56% zero/negative delta, 38%/44%
    judge error rates) in the paper's actual numbers, verified via Playwright end-to-end run (self-mode ended
    claimed +37.2 vs. real -5.2; oracle-mode ended claimed=real=13.6 exactly).
  - C — **Patient Zero: Find the Root of a Random Recursive Tree** (arXiv:2606.24465, pure tree topology leaks a
    surprising amount about growth order in random recursive trees — the true root can be estimated via iterated
    Jordan-centrality peeling, repeatedly removing the node minimizing max-eccentricity): grows a random recursive
    tree with a real generative animation, hides arrival order, takes a click-guess for patient zero, then reveals
    a real BFS-based iterated-peeling algorithm with a blue→red arrival-rank heatmap and hand-rolled Spearman/
    Kendall-tau scoring. Builder caught and fixed two real bugs found via Playwright: a stale cached DOM reference
    that froze the status subtext, and force-layout nodes clipping off-canvas at n=60 (added boundary clamping).
  - **Judge:** scored wow/interactivity/polish/fidelity per demo (A 9/9/9/9=36, B 8.5/9/8/9=34.5, C 8/8.5/8.5/8.5=
    33.5) — all three verified running with zero console errors in headless Chromium via independent Playwright
    passes, none disqualified. Judge cross-checked each demo's math/stats against the actual fetched arXiv
    abstracts rather than trusting builder self-reports. A won for pairing the most legible physical intuition (a
    deck that stubbornly refuses to look shuffled, then suddenly does) with the highest verified fidelity — its
    theory overlay is the literal closed-form paper formula, not an approximation — and for being the most robust
    build (zero external CDN dependencies).
- **Published:** demo at `/arxiv-scrape/demos/2026-08-03-cutoff-shuffle.html`, brief at
  `/arxiv-scrape/2026-08-03-nightly.html` — pushed to `xpoes123/david-share` (commit `46a4a06`), live at
  https://share.djiang.xyz/arxiv-scrape/2026-08-03-nightly.html pending a VPS-side `git pull` (not done by this
  nightly run, per the no-SSH publishing rule).
- **Digest:** sent via the `notify` skill.

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