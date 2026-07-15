# arXiv Ideation — Run 2 Deep Dives (top 7 betting plays)

*Interest-tailored deep dives on the top 7 run-2 picks: the paper technically, prerequisites, a build plan on your SharpLab/nba-modeling/nflverse stack, explicit interest fit, time-with-Claude, and honest why/why-not. Agents read the papers.*

---

## #1 — Look-Ahead Leak Detector for Sports Betting Backtests

*(arXiv 2607.04958v1, "Look-Ahead-Freedom as Temporal Non-Interference," submitted to ACM TOSEM, July 2026)*

### The paper, technically

The paper's real contribution is a **type system that statically proves a data pipeline cannot leak future information into a past decision** — and a proof that this is *decidable in linear time* for exactly the class of operations that backtests actually use.

The framing move: look-ahead bias is **temporal non-interference**, a property lifted straight out of information-flow security. In IFS, "secret inputs must not influence public outputs." Here you re-index the lattice by *time*: fixing a decision epoch `t`, "data from after `t` must not influence the decision made at `t`." That's the whole idea, and it's a genuinely clean reframe.

The mechanism rests on **separating two timestamps that pipelines usually conflate**:
- **Availability α** — when a datum becomes *knowable* (publication schedule: when the injury report dropped, when the line was posted, when the box score finalized).
- **Reference time** — which instant the datum *describes* (the game it's about).

Every value in the calculus carries both. The typing judgment `Γ ⊢ e : τ ! φ` reads: expression `e` has type `τ` and **effect φ**, where φ is the latest availability timestamp of any base datum that influenced the result. The single obligation at a decision point (rule **T-Decide**) is:

```
φ ⊑ t     — the effect must be bounded by the decision epoch
```

i.e., everything feeding this bet was available no later than when you placed it. If that holds everywhere, **Theorem 1 (Soundness)** guarantees the pipeline is look-ahead-free (proven via a two-run logical relation: two executions that agree on all data available by `t` must produce the *identical* decision).

The decidability split is the load-bearing result:
- **Full language 𝒰** (availability can depend on data *values* — e.g. `if val(x) > c then t-2 else t`): look-ahead-freedom is **undecidable, Π⁰₁-hard** (halting-problem reduction). You can enumerate leaks but never certify freedom.
- **Fragment ℱ** (availability terms are functions of *stamps and constants only* — `t`, constants, `av(x)`, `+δ`, `max`, `min`): **decidable in linear time** (Theorem 2). And crucially, ℱ is claimed to cover *everything real backtests do*: windowing, resampling, joins, point-in-time / vintage ("as-of") reads, and agentic retrieval.

The series operators are given causal operational semantics that the checker verifies structurally:
- **Window** at position `p` reads only `[p-(k-1), p]` — never ahead.
- **Scan** accumulates only from `pred(p)`.
- **Join** aligns all sources at a common position `p`.
- **Resample** is causal iff `max ρ←(p) ⪯ ι(p)` (output aggregates only past source positions).
- **As-of read** (T-Asof): a point-in-time query has effect = *the query time*, not the store's latest — this is what makes vintage reads sound.
- **Re-stamping** (T-Stamp): you can re-label a datum's advertised availability, but its *effect* still tracks the true underlying dependency, so you can't launder a future datum by slapping an old stamp on it.

**The evaluation is what makes this a betting tool and not just a theory paper.** On an adversarial corpus of **33 planted leaks**:
- The sound checker: **0 false negatives** (catches all 33).
- Differential two-run detector (run the pipeline twice, perturb the future, see if output changes): misses **18 / 33 (54.5%)**.
- Window-tiling detector: misses **all 33 (100%)**.

Plus: checker scales linearly (log-log slope 1.023 over four orders of magnitude), and an independent dynamic oracle witnessed zero leaks in any *accepted* pipeline on real proprietary market data. The honest cost: it's *conservative* — opaque value-dependent operations get rejected (false positives), because certifying-absence requires universal quantification over all epochs while empirical detectors can only exhibit a single violating example. That asymmetry is exactly why the empirical detectors are unfixably sound-incomplete.

**This is NOT decorative math.** The result directly supports a real tool: a static certifier that says "your backtested edge is not an artifact of look-ahead." For a CLV-tracking quant lab, that's a load-bearing guarantee.

### Prerequisites

- **Look-ahead bias / point-in-time correctness** — using data you couldn't actually have had at decision time; the #1 way a backtest lies to you.
- **Temporal non-interference** — "the future must not influence the present"; the security-lattice reframe of look-ahead-freedom.
- **Type-and-effect systems** — types track *what a value is*, effects track *a side property* (here: latest availability timestamp) propagated bottom-up.
- **Availability vs. reference time** — the two-timestamp split; the entire method is downstream of keeping these separate.
- **As-of / vintage joins** — querying "what did the DB know as of time X," not "what's the latest value" — the correct primitive for injury reports, line snapshots, ratings.
- **Bitemporal data modeling** — the general DB pattern (valid-time + transaction-time) that availability/reference-time instantiates; if you already store both, you're 80% there.
- **Soundness vs. completeness** — sound = no false "OK"s (never certifies a leaky pipeline); incomplete = some false alarms. This tool picks sound + conservative, deliberately.

### Implementation outline

You do **not** need to implement the full calculus or the undecidability proof. The shippable artifact is a **decorator/DSL-level static checker over your ingestion + feature code** that assigns each column an availability stamp and refuses to compute a bet feature from anything stamped after the decision epoch.

**Data sources (your stack):**
- **nflverse** (`nflreadpy`/`nfl_data_py`): schedules, play-by-play, rosters, injuries, snap counts. The killer detail — nflverse rows have a natural availability: injury reports and inactives publish on a schedule; PBP finalizes post-game. Stamp each table.
- **nba-modeling**: RAPM/Elo ratings are the classic leak vector — a rating "as of week N" is often silently computed from the *full-season* possession matrix. This checker's whole reason to exist is catching that.
- **SharpLab odds ingestion**: you already snapshot lines with timestamps. Those timestamps *are* the availability stamps — you're the ideal customer because you have the metadata the paper assumes.
- **NFL rating-completion backtest harness**: the target. Wrap it.

**Core algorithm (V1):**
1. **Schema layer**: a `Series` / DataFrame wrapper where each column declares `availability: t | const | av(other) | +δ | max/min`. In practice: a small registry mapping `(table, column) -> availability rule`. For odds, availability = snapshot timestamp; for injuries, publish time; for box scores, `game_end + finalize_δ`.
2. **Effect propagation**: override the handful of ops you use (`merge`/join, `rolling`/window, `shift`, `groupby`+`cumsum` scan, `resample`, as-of merge). Each op computes its output effect as `max` of input effects, per the paper's rules. `pd.merge_asof` maps *directly* onto T-Asof — its effect is the `on` key time, which is correct-by-construction.
3. **Decision gate**: at the point you emit a bet/prediction for epoch `t` (kickoff, or line-lock time), assert `effect ⊑ t`. Raise with the offending column's provenance chain if violated.
4. **Certificate**: on a clean run, emit a signed manifest ("pipeline P certified look-ahead-free at commit `abc`, N features, all effects ≤ decision epoch"). This is the "your edge isn't fake" artifact — attach it to every CLV report.

**Minimal V1:** cover `merge`, `merge_asof`, `rolling`, `shift`, `cumsum`/expanding, and a single decision gate. Run it on the NFL harness first — you *know* the Elo baseline beats the close in weeks 1-6, so use the checker to prove that edge survives certification (or find the leak that's inflating it, which is the more valuable outcome).

**Skip-for-now V2:** the full fragment-membership syntactic checker with the undecidability boundary; agentic-retrieval typing; relative-completeness guarantees; a general-purpose library for arbitrary pandas/polars. V1 only needs *your* ops.

**Harness plug-in:** it sits between feature-construction and the backtest loop. CLV tracking gains a new column: `certified: bool`. Any bet whose feature pipeline isn't certified gets flagged — turning "we beat the close" into "we beat the close *and* the pipeline is provably point-in-time clean."

### Interest fit

**Fit: strong, but as infra, not as a new edge.** This does not find you a bet. It *protects the bets you already model* — which for a lab whose entire premise is CLV credibility is close to essential.

- **Venue**: venue-agnostic, but best for **sportsbooks + Kalshi** where you already snapshot lines with timestamps. Prediction markets especially — resolution/settlement timing is a notorious leak source (using post-event info in a "pre-event" feature).
- **NBA vs NFL**: **NBA first** (RAPM/Elo ratings are the highest-risk leak surface — full-season possession leakage into "as-of-date" ratings is the canonical bug this catches). But the **active NFL rating-completion project is the ideal first customer** because you have a live backtest that *already* beats the close — and the scariest possibility for that project is that the edge is a leak artifact. This tool answers exactly that question.
- **Edge / infra / viral**: **90% infra, 10% viral.** Zero new edge. But real viral upside: "I built a type checker that *proves* my sports-betting backtest has no look-ahead bias" is a genuinely novel, tweetable, credibility-establishing artifact in a space full of overfit garbage. It's the kind of thing that makes SharpLab look like a real lab.
- **David-specific**: hits your "applied math to sports/games" and "cool + shippable" values dead-on; misses on "real betting edge." It's a moat around your edge, not the edge.

### Time with Claude

- **Phase 0 — stamp the schema (0.5 weekend):** enumerate nflverse + odds + ratings tables, write the `(table, column) -> availability rule` registry. This is the real intellectual work — deciding when each datum was actually knowable.
- **Phase 1 — effect-propagating wrapper + decision gate (1 weekend):** the 6-op override layer over pandas/polars, `merge_asof`→T-Asof, the `φ ⊑ t` assertion with provenance traceback.
- **Phase 2 — run on NFL harness + adversarial test suite (0.5–1 weekend):** plant your own leaks (shift a rating forward, join on final box score) and confirm the checker catches them; emit the certificate; wire `certified` into CLV reporting.

**Total: ~2–3 weekends** for a genuinely useful V1, front-loaded on Phase 0. The math is understood; the build is plumbing over your existing harness, which is fast with Claude.

### Why do it

- Turns SharpLab's central claim (CLV edge) from "trust me" into "certified point-in-time clean" — a real credibility asset.
- Your NFL project's Elo-beats-close result is *most valuable if provably not a leak artifact* — this directly stress-tests the one thing that could invalidate it.
- The metadata the paper assumes (availability timestamps) you *already collect* in odds snapshots — you're the rare user who doesn't have to fake it.
- Cheap: ~2–3 weekends, self-contained, no VPS/deploy dependency.
- Viral/credibility upside is real and cheap — "formal look-ahead certifier for betting backtests" is a standout artifact.
- Reusable across every model you run (NBA, NFL, Kalshi) with one registry per data source.

### Why NOT do it

- **Zero new edge.** It finds no bets. If your bottleneck is "not enough +EV plays," this is the wrong project.
- **The stamping is only as honest as you make it.** The checker certifies *relative to your declared availability rules*. Garbage-in: if you stamp the injury report earlier than it actually published, you get a "certified" pipeline that still leaks. The paper's soundness is w.r.t. exogenous, correct stamps — it can't verify your schedule declarations are truthful. This is the whole ballgame and the tool can't check it for you.
- **Red-team failure mode:** you spend a weekend building a beautiful type checker, it certifies your NFL pipeline green, you ship confidently — and the actual leak was in a *value-dependent* availability you had to approximate (a data-source that publishes "when available," not on a fixed schedule). That's precisely the undecidable fragment 𝒰 the paper *excludes*. The tool silently either rejects it (annoying false positive you'll be tempted to override) or you coerce it into ℱ with a wrong stamp and get a false certificate. The most dangerous outcome is a green check that increases your confidence in a leaky model.
- Conservative false positives will nag you on legitimate opaque transforms; you'll be tempted to add escape hatches that quietly defeat the soundness guarantee.
- Betting markets don't reward *provable correctness* — they reward being right and fast. This buys rigor, which is valuable to *you* and your reputation, but the market pays zero premium for a certificate.

**Bottom line:** Real method, real result, genuinely applicable to your exact stack — but it's a *moat around your edge*, not an edge. Build it as SharpLab infra + a credibility flex the weekend you want to harden the NFL backtest, not the weekend you want a new bet. The single thing that determines whether it's useful or dangerous is the honesty of your availability stamps — and that part is on you, not the type system.

Relevant file: `/home/david/code/arxiv-scrape/run2_top7.json` (pick index 0).

---

## #2 — Competing-Risks Player Availability Model for NBA Betting

### The paper, technically

**Read this first: the paper is not about basketball.** `comprisk` (arXiv 2607.09431) is a pure biostatistics software paper. It presents a Python package for medical time-to-event analysis under **competing risks** — patients who can die from one of several mutually exclusive causes. There is zero NBA, betting, or DFS content in the actual paper. The "player availability" idea is a mapping *you* would impose on the tool, not a result the authors demonstrate. Everything below separates the real math (solid) from the betting application (speculative, yours to build).

**What competing risks actually means.** Standard survival analysis (Kaplan-Meier, Cox) estimates "time until event." When there are multiple mutually exclusive terminal events — where one occurring *precludes* the others — treating the competing events as censoring biases your absolute-risk estimates **upward**. This is the paper's core statistical claim and it's correct: if you want P(cause A by time t), you must not pretend a subject who hit cause B is simply "still at risk for A."

The correct target is the **cause-specific Cumulative Incidence Function (CIF)**:

- CIF_k(t) = P(T ≤ t **and** cause = k) — the probability of experiencing event type *k* by time *t*, accounting for the fact that competing events remove you from the risk pool.

Two ways to model it, both in the library:

1. **Cause-specific hazard (Cox per cause):** λ_k(t) = instantaneous rate of cause *k* among those still event-free. Fit one Cox model per cause. To get a CIF you combine all cause-specific hazards through the overall survival S(t): CIF_k(t) = ∫₀ᵗ S(u⁻)·λ_k(u) du. Good for **etiology** ("what drives foul-outs?").
2. **Fine-Gray subdistribution hazard:** directly models the CIF with a single regression, keeping subjects who experienced competing events in a modified risk set with decaying weights. One coefficient set maps monotonically to the CIF. Good for **prediction** ("what's the probability?") — which is what betting wants.
3. **Aalen-Johansen estimator:** the nonparametric CIF (the multi-state generalization of Kaplan-Meier). Your baseline / no-covariate estimate.

**What the library ships:** `CompetingRiskForest` (numba-JIT histogram random survival forest, 256 bins, the headline "10–22× faster than R's randomForestSRC" claim), `FineGrayRegression` + penalized (LASSO/ridge/elastic-net) variants, `CauseSpecificCox`, `CumulativeIncidence` (Aalen-Johansen), `gray_test`. Evaluation: IPCW time-dependent AUC, Brier score, cause-specific concordance, calibration curves with closed-form CIs. All validated against R references (cmprsk, survival, riskRegression). The one genuinely useful-for-you deliverable is: **a fast, sklearn-API competing-risks toolkit in pure Python, killing the R round-trip.**

### Prerequisites

- **Survival analysis / hazard function** — probability of an event in the next instant given you've survived to now; the atom everything is built from.
- **Censoring** — you observe "at least X minutes played" but the game ended before the terminal event; must be handled, not dropped.
- **Competing risks** — mutually exclusive events where one occurring removes you from risk for the others (injury vs foul-out vs coach's-decision benching).
- **Cumulative Incidence Function (CIF)** — the *correct* absolute-risk curve under competing risks; what you'd actually bet on.
- **Cause-specific vs subdistribution hazard** — model each cause's rate vs directly model the CIF; you want subdistribution (Fine-Gray) for prediction.
- **Aalen-Johansen estimator** — nonparametric multi-state Kaplan-Meier; your covariate-free baseline.
- **The "time axis" reframing** — the hard modeling decision: is your survival clock *game minutes elapsed* or *player minutes played*? This determines the whole design.

### Implementation outline

**The reframing you'd build.** Treat a player-game as a survival subject on a **game-minutes-elapsed** clock (0→48+). Terminal "events" that end a player's *availability to accumulate stat*:
- k=1: **injury exit** (leaves and doesn't return)
- k=2: **foul-out** (6th personal foul)
- k=3: **coach's decision / garbage-time removal** (benched while healthy)
- censoring: game ends with player still available.

The load-bearing statistical insight (the "strongest angle" from the framing): if you model injury risk and treat foul-outs as censoring, you bias the injury CIF upward — which is exactly the mistake naive minutes projections make.

**Data sources (your stack):**
- `nba_api` play-by-play → substitution events, personal-foul counts, timestamps → build (player, game, minute-of-exit, cause) rows. This is the whole dataset and it's public.
- nba-modeling: pull your RAPM/Elo ratings + rotation priors as covariates (starter flag, season MPG, opponent pace, back-to-back, blowout probability from your spread model).
- SharpLab: prop lines (points/rebounds/assists) and player-total markets for the eval target.

**Core algorithm (V1, one weekend):**
1. Build the competing-risks dataset from PBP (time-to-exit, cause label) for ~2 seasons.
2. Fit `FineGrayRegression` (or `CompetingRiskForest`) per cause with covariates above → CIF_k(minute).
3. Convert to an **expected-remaining-minutes** distribution: E[minutes | current game state] via the survival curve S(t)=1−Σ CIF_k(t). This is the deliverable: an unbiased minutes projection with a full distribution, not a point estimate.
4. Push minutes distribution through a simple per-minute rate model (points/36 etc. from nba-modeling) → a distribution over the prop stat.

**Plug into your harness:**
- **CLV/backtest:** for player-total and prop markets, your model outputs P(over line). Log the line at bet time and at close; SharpLab's existing CLV tracker measures whether your minutes-distribution edge beats the closing prop line. This is a clean, drop-in eval — same shape as your NFL ATS backtest but on props.
- **Live angle (the real edge):** the CIF is **conditional on current game state**. At halftime with a star carrying 4 fouls, your foul-out CIF spikes and the minutes distribution shifts — you can price live prop/player-total markets faster than the book adjusts. That's the exploitable window.

**Skip for V2:** the random forest + TreeSHAP (Fine-Gray is enough and interpretable), calibration CIs, penalized variants, multi-team correlation. Don't model return-after-injury (multi-state transitions) in V1 — collapse to terminal exit.

### Interest fit

**Moderate. Real, but narrow and effortful.**

- **Venue:** DFS and **prop/player-total sportsbook markets** (also some Kalshi player-milestone contracts). NOT spreads/totals directly — this is a *player-availability* signal that mostly matters for props. That's a step away from your NFL spread wheelhouse.
- **Sport:** NBA specifically (foul-out is a basketball-native competing risk; NFL has no clean analog, so this doesn't cross-pollinate your active NFL project).
- **Edge vs infra vs viral:** genuine **edge** if the live-conditional angle works, because most public minutes projections *do* make the censoring error this fixes — that's a legitimate, non-obvious statistical advantage. Low viral upside. Infra cost is moderate (PBP parsing is fiddly).
- **The honest catch:** the paper contributes *software*, not a betting method. You're buying "a fast Python competing-risks lib so I don't call R." The actual modeling insight (censoring foul-outs biases injury CIF) is textbook competing-risks, not novel to this paper. So the fit is "good statistical idea you'd have to fully originate, with a convenient library attached."

### Time with Claude

- **Phase 0 — PBP → competing-risks dataset (weekend 1):** parse substitutions/fouls/injuries into (time, cause) rows. This is 70% of the work; PBP edge cases (return-from-injury, ejections, OT) are the grind.
- **Phase 1 — Fit CIF + minutes distribution (2–3 days):** `comprisk` Fine-Gray + Aalen-Johansen baseline, convert to E[remaining minutes].
- **Phase 2 — Prop pricing + CLV backtest (long weekend):** rate model, P(over), wire into SharpLab CLV.
- **Phase 3 — Live-conditional pricing (1 more weekend, optional):** recompute CIF on live game state.

**Realistic: 2–3 weekends to a backtested prop model; ~4 to the live edge.** Add a day if `comprisk` is early-stage and you hit install/API rough edges (it's a brand-new package).

### Why do it
- The censoring-bias insight is **real and public data supports it** — a defensible edge most prop models miss.
- The live-conditional CIF (fouls/blowout state shifting minutes) is a genuine speed advantage over slow-moving prop lines.
- Slots cleanly into SharpLab CLV as a new market type; extends nba-modeling from spreads into props.
- Reusable minutes-distribution primitive feeds DFS lineups too.

### Why NOT do it
- **The paper is decorative here.** It's a medical biostats library; none of its results validate a betting use. You get a tool, not evidence. Don't let "arXiv-backed" imply the *betting* method is proven — it isn't.
- **Not your lane.** NBA props, not NFL spreads; doesn't advance your active NFL rating-completion project.
- **Red-team failure mode:** minutes are driven far more by **coach's-decision** (the noisiest, least-modelable cause — load management, matchup benchings, garbage time) than by injury/foul-out. The competing-risks machinery is precise about the two causes that don't dominate variance, and nearly useless against the one that does. If coach's decision is 60%+ of exit variance and is essentially exogenous/insider-driven, your beautifully unbiased CIF still loses to a sharp book with beat-reporter Twitter. The math is correct; the residual edge may be tiny.
- Prop markets have low limits and high hold — even a real edge caps your bankroll growth versus spread/total markets.

---

## #3 — Sportsbook Sharp-Money Detector via Influence Diagnostics

### The paper, technically

The paper studies **leave-one-out (LOO) influence** — the classical statistical question "how much does my fitted model change if I delete training point *i*?" — in the modern **proportional high-dimensional regime** where the number of samples *n* and features *d* grow together at a fixed ratio α = n/d = Θ(1) (their example neighborhood: ~1500 games, ~400 features). This is exactly the regime a betting model lives in: you never have 100,000 clean games, you have a few thousand rows and a comparably large feature vector.

The workhorse object is the **approximate leave-one-out (ALOO) correction**, Eq. 8:

  ŵ = ŵ₍ᵢ₎ − (1/n)·∂ℓ(⟨ŵ, xᵢ⟩, yᵢ)·H₍ᵢ₎⁻¹·xᵢ + O(polylog(n)/n)

In plain terms: refitting your model with game *i* removed shifts the weights by (loss-gradient at that game) × (inverse-Hessian) × (feature vector). You do **not** have to actually refit n times — one fit gives you H⁻¹, and every sample's influence is a cheap linear-algebra readout. From this they define two per-sample scalars:

- **DFBETAᵢ = n·‖ŵ − ŵ₍ᵢ₎‖²** — how much the *parameters* move when you drop game *i* (a fragility/leverage measure).
- **IFᵢ = n·(E_gen[ŵ] − E_gen[ŵ₍ᵢ₎])** — how much the *test error* moves. Negative IF = the game helped generalization; positive = it hurt.

The paper's actual **theoretical contribution** is characterizing the *limiting distribution* of these influences across the training set. Classically (n→∞, d fixed) an influence depends only on the deleted point. They prove that in the proportional regime it does *not*: influence becomes a random variable that retains dependence on the whole dataset and on α. Their **Theorem 2.1** says the distribution of IF converges to a **pushforward of a 4-dimensional Gaussian** through a nonlinear map φ_IF, where the map's parameters (the covariance Q, the scalars V⁽ᵏ⁾) are fixed by **random-matrix resolvent equations** solved by numerical contour integration. For square loss, DFBETA collapses to a rescaled χ²₁.

Their headline *finding*: influential samples cluster near the **decision boundary**, and on average all samples are helpful (mean IF ≤ 0) — deleting the typical training point *hurts* generalization.

**The blunt part you need to hear:** the deep theorem — the limiting measure, the resolvents, the Gaussian pushforward — is **decorative for your use case**. It requires isotropic Gaussian covariates and a convex M-estimator, and it describes the *population distribution* of influences, not a computable score for *your* specific dataset. The paper itself concedes there is no practical per-sample estimator for non-Gaussian real data. So the sexy math ("high-dim regime where classical LOO breaks") is not what you'd ship. What you'd ship is Eq. 8 — the ALOO/DFBETA formula — which is **50-year-old regression diagnostics (Cook's distance, DFBETAS)** dressed in new asymptotics. That's fine, but be honest that the arXiv paper is scaffolding, not the product.

### Prerequisites

- **Leave-one-out / ALOO** — refit-without-point-*i* approximated in closed form via the Hessian; no n refits needed.
- **Hessian & inverse-Hessian (H⁻¹)** — the curvature of your loss at the fit; the "who-affects-whom" matrix for influence.
- **Leverage / hat value (hᵢ)** — geometric outlier-ness of a game's feature vector; high leverage → high potential influence.
- **Cook's distance / DFBETA** — the classical, computable influence scores this paper generalizes; DFBETA = weight shift, Cook's D = fitted-value shift.
- **M-estimation / regularized ERM** — your model must be a convex loss + ridge penalty (logistic or squared) for the Hessian trick to be valid. Tree ensembles don't qualify.
- **Proportional regime (α = n/d)** — the "few thousand games, hundreds of features" world where influence stops being a simple per-point function.

### Implementation outline

**Core idea for the tool:** a *robustness filter*, not a signal. For each historical game, compute its DFBETA/leverage against your existing edge model. Games whose feature signature resembles historically **high-influence** games are ones your model is fragile on — so **downsize** bets on them. It never generates a pick; it only scales stake.

**Data / stack:**
- Your existing fitted edge model — the RAPM+Elo → spread/total logistic layer (nba-modeling), or the NFL Elo rating-completion logistic.
- nflverse / your SharpLab game store for the historical feature matrix X and outcomes y.
- No new external data. This rides entirely on models you already have.

**Core algorithm (V1, ~150-200 lines):**
1. Fit (or load) your model as **ridge-regularized logistic regression**: ŵ = argmin (1/n)Σℓ(⟨xᵢ,ŵ⟩,yᵢ) + (λ/2)‖w‖². (If your production model is a GBM, fit a logistic *surrogate* on the same features purely for diagnostics.)
2. Compute H = (1/n)Σ ∂²ℓ·xᵢxᵢᵀ + λI once; invert (d≈400 is trivial).
3. Per game: gᵢ = ∂ℓ(⟨ŵ,xᵢ⟩,yᵢ); **DFBETAᵢ = ‖H⁻¹ xᵢ‖²·gᵢ²** and **Cook-style prediction shift = gᵢ·xᵢᵀH⁻¹xᵢ** (leverage-weighted residual).
4. Rank games by influence. Fit a light model (or just k-NN in feature space) predicting "is this a high-influence region."
5. **Stake multiplier**: for each new game, map its influence percentile to a stake shrink (e.g. top-decile influence → 0.5× Kelly). Bolt onto your existing sizing.

**Plug into backtest/CLV harness:** run two arms through your NFL backtest — baseline Elo-ATS vs. Elo-ATS + influence-shrink. Compare **CLV distribution and ROI variance**, not just ROI. The correct win condition is *lower variance / better tail behavior at similar CLV*, since this is a risk filter. If it doesn't cut drawdown, it failed.

**Skip for V2:** the resolvent equations, the limiting-measure fit, the χ² characterization, anything requiring contour integration. That's pure theory and buys you nothing on real (non-Gaussian) data. Also skip trying to interpret IF sign as "harmful game to delete" — with a few thousand games the sign is noisy.

### Interest fit

**Moderate, leaning weak.** This is an **infra/risk-management** play, not an edge play and not viral. It touches your CLV harness (good) but it complements rather than creates edge — the pick still comes from your Elo/RAPM model.

- **Venue:** sportsbook / prediction-market agnostic; it's a staking-layer wrapper, works for Kalshi or a book equally.
- **NBA vs NFL:** better for **NFL** — the small-sample, high-variance weekly regime (your active project, weeks 1-6) is precisely where "which games is my model fragile on" has bite. NBA's 1230-game seasons dilute the effect.
- **Edge vs infra vs viral:** pure **infra**. Zero viral upside — nobody retweets a leverage diagnostic. Real value is defensive: fewer blowups on weird games.

The honest read: this matches your *methodological taste* (theoretically-grounded, ~200 lines, complements CLV) but not your *stated priorities* (real betting edge, cool + shippable, viral). It's a nice-to-have hardening of an existing model, not a new gun.

### Time with Claude

- **Phase 1 (½ day):** logistic surrogate + H⁻¹ + DFBETA/leverage per game. Standard sklearn + numpy; you and Claude close this in an afternoon.
- **Phase 2 (½–1 day):** influence-percentile → stake-multiplier, wire into sizing.
- **Phase 3 (1 day):** two-arm backtest through your NFL harness, CLV/variance comparison, decide keep/kill.

**Total: one weekend, comfortably.** No new data pipeline, no scraping, small matrices. If it shows no drawdown reduction by end of the weekend, shelve it — don't sink a second weekend chasing the resolvent theory.

### Why do it

- Genuinely cheap: rides entirely on models and data you already have; one weekend, no new infra.
- Directly targets your live NFL weeks-1-6 pain — small-sample fragility is real, and a "downsize on model-fragile games" filter is a legitimate variance reducer.
- Theoretically respectable and *additive* to CLV — it answers "which of my bets should I trust least," a question your current harness doesn't.
- Reusable diagnostic: the same leverage/DFBETA code audits *any* future logistic edge model you build.

### Why NOT do it

- **The paper's actual contribution is decorative here.** You'd implement Eq. 8 (classic Cook/DFBETA), not Theorem 2.1. You don't need this arXiv paper to do that — it's 1980s regression diagnostics. If you want the citation prestige, fine; if you want the method, a stats textbook is shorter.
- **No edge, no virality.** It shrinks stakes; it never finds a bet. Every hour here is an hour not spent on something that moves ROI or ships publicly.
- **Assumptions don't hold:** the theory needs isotropic Gaussian features and convex M-estimation. Your real features are correlated and your production model may be a GBM, so you're forced into a *surrogate* logistic just to compute diagnostics — the influence scores then describe the surrogate, not your actual model.
- **Red-team failure mode:** the filter downsizes exactly the games near the decision boundary — which in betting are often the **highest-EV close-spread games where your edge is real but marginal**. You could systematically shrink your best +CLV plays because they "look fragile," quietly bleeding edge while feeling more disciplined. If the backtest shows CLV *dropping* in the filtered arm, that's this failure mode firing, and it's a kill signal.

---

## #4 — Order-3 Causal Leakage Detector for Prediction Market Signal Stacking

**Paper:** *An Order-Three Obstruction to Price-of-Risk Attribution* — Alejandro Rodriguez Dominguez (arXiv 2606.26835v1). The pick reframes it as a stacking-diagnostic tool; the paper itself is a stochastic-calculus attribution paper.

### The paper, technically

The paper is really about **attributing a portfolio's "squared price-of-risk premium"** (an integrated conditional squared-Sharpe functional) to a set of causal driver signals. The attribution decomposes into three pieces: an intervention-stable premium, a signed confounding wedge, and a nonnegative information-loss term. That decomposition machinery is the bulk of the paper and is not what makes this pick interesting.

The interesting nugget is a **negative result about signal combination**, dressed up in filtration-immersion language. Restated in betting terms:

> You can have three signals where **every single signal, and every pair, is clean** (contains no future information about the outcome), but the **triple jointly leaks the future**. No pairwise or single-signal sanity check can ever catch this.

The construction is a betting-friendly version of **Bernstein's pairwise-but-not-mutually-independent triple**:
- Let ε₁, ε₂ be independent ±1 coin flips, independent of the future outcome innovation 𝓕_T.
- Let ε₃ = ε₁ · ε₂ · Z, where **Z depends on the future** (Z = sign of a future price move).
- Then σ(εᵢ) and every σ(εᵢ, εⱼ) are independent of the future — they pass every pairwise leakage screen.
- But ε₁·ε₂·ε₃ = Z, which **is** the future. The triple is poisoned.

The concrete diagnostic (Section 6.3, their Figure 4):

1. **Fit predictive R²** of a reference outcome innovation X on: each singleton, each pair, and the full triple, using an out-of-sample 50/50 split.
2. **Incremental third-order statistic:**
   ε = R²(X | ε₁,ε₂,ε₃) − maxᵢⱼ R²(X | εᵢ,εⱼ)
   i.e. how much the triple explains *beyond its best pair*.
3. **Permutation null:** shuffle the reference outcome X 200× while holding driver signs fixed; recompute ε each time. This breaks any driver↔future coupling by construction.
4. Take the upper-α (e.g. 95th percentile) quantile of the null.
5. **Flag** the triple if observed ε exceeds it.

In the exact planted case, singletons/pairs give R² ≈ 0 while the triple hits **2/π ≈ 0.637**, and the screen reports p ≈ 0.005 with zero false positives on clean triples at the 95% threshold (Proposition 23 shows graceful degradation as noise corrupts the relation).

**Blunt assessment:** the permutation-R² screen in step 1–5 is genuinely usable and correct — it's basically "test whether a 3-way interaction of features has out-of-sample predictive lift over all 2-way subsets, calibrated by a shuffle null." That is real and worth stealing. But (a) the surrounding price-of-risk / immersion theory is decorative for a bettor, and (b) the *headline* — an order-3 leak that is provably invisible to pairwise screens — requires a very specific multiplicative structure (ε₃ = ε₁ε₂Z). In practice, arbitrary leakage usually **also** shows up pairwise. The pure order-3 case is a real but rare failure mode, not the dominant one. Sold as "your backtest silently dies from triple leakage," it oversells; sold as "add an interaction-term leakage screen to your feature pipeline," it's honest and useful.

### Prerequisites

- **Predictive R² / out-of-sample skill score** — fraction of outcome variance a signal explains on held-out data; the workhorse statistic here.
- **Permutation / shuffle test** — build a null by destroying the signal↔outcome link via reshuffling; your empirical p-value is where the real statistic lands in that null. You already do the moral equivalent when you compare model ATS to a shuffled baseline.
- **Look-ahead / leakage in backtests** — a feature that (partly) encodes the future outcome; inflates backtest edge, vanishes live. This is the whole point.
- **Interaction effect (3-way)** — an effect present only when three features are considered jointly, absent from all pairs. Standard in stats; the paper's "order-3 obstruction" is exactly this for leakage.
- **Bernstein's example** — three events pairwise-independent but not mutually independent; the toy that guarantees pairwise screens can be fooled.
- **Filtration immersion (skippable)** — the measure-theoretic phrasing of "conditioning on signals doesn't reveal the future." You do not need it to build the tool; it's the paper's dressing.

### Implementation outline

This is a **CLV/backtest-hygiene tool**, not an alpha source. It sits in front of your existing harness.

**Data sources (your stack):**
- Feature matrices you already generate: nba-modeling RAPM+Elo player-rating features, NFL rating-completion features (nflverse-derived), SharpLab odds/CLV series.
- The "reference innovation X" = your realized outcome signal: ATS margin vs close, total vs close, or realized CLV per bet.

**Core algorithm (V1, a weekend):**
1. Take your candidate feature set F (say 10–30 engineered signals feeding the NFL/NBA model).
2. For every triple (and its 3 pairs + 3 singletons), fit a cheap OOS predictor of X — ridge or plain linear is fine — on a 50/50 or walk-forward split, record R².
3. Compute the incremental ε = R²(triple) − max R²(pair).
4. Permutation null: shuffle X 200× (respect time blocks — block-shuffle by week, don't break autocorrelation), recompute ε, take the 95th percentile.
5. Flag triples with ε above threshold. Output a ranked CSV: triple, ε, p-value.
- Wrap it as `sharplab leakage-scan --features features.parquet --outcome clv` producing a report. ~200 lines.

**How it plugs into your harness:** run it as a **pre-registration gate** — before a feature set is allowed into the live NFL backtest, it must pass the scan. Any flagged triple gets that interaction inspected/removed. Log the scan result alongside each backtest run so a suspiciously good week can be cross-checked against "did a flagged triple sneak in."

**Minimal V1 vs skip-for-now V2:**
- **V1:** linear/ridge R², block-permutation null, NFL feature set only (smaller, your active project), report + gate. Skip all the price-of-risk theory entirely.
- **V2 (skip):** the full price-of-risk attribution decomposition, gradient-boosted R² for nonlinear triples, extending to order-4+, and the immersion/confounding-wedge accounting. Only worth it if V1 ever actually flags something real.

**Cost note:** triple enumeration is O(n³). At 20 features that's 1140 triples × 200 perms — fine. At 60 features it's 34k triples; cap combinations or pre-filter to features with nonzero marginal R².

### Interest fit

**Weak-to-moderate, and specifically as infra, not edge.** Honest scoring for David:

- **Venue:** venue-agnostic. Applies equally to prediction-market (Kalshi/Polymarket) and sportsbook models. No venue lift.
- **NBA vs NFL:** best home is the **active NFL rating-completion project** — you have a live backtest that beats the close weeks 1–6, which is *exactly* the situation where "is this real or is it leakage?" is the burning question. That's the one genuinely compelling use.
- **Edge vs infra vs viral:** pure **infra/hygiene**. It cannot make you money; it can only stop a fake edge from costing you money. That's valuable given your CLV discipline, but it's a defensive tool.
- **Viral:** the *phrasing* is shareable — "three signals pairwise clean but jointly poisoned" is a good quant thread. But it's borrowed from a niche paper and the pure order-3 case is rare, so a knowledgeable reader may push back. Medium viral upside, some reputational risk if oversold.
- **Applied-math taste:** high. Bernstein-triple leakage is a genuinely cute, real idea and pairs well with your existing shuffle-baseline instinct.

Net: this is a **nice afternoon add-on to SharpLab's backtest hygiene**, not a headline project. It earns its place because your NFL model is currently beating the close and you *should* be paranoid about why.

### Time with Claude

- **Phase 0 (½ day):** wire feature matrix + outcome (CLV or ATS-vs-close) into a single parquet from the NFL harness.
- **Phase 1 (1 day):** implement ridge-R² triple scan + block-permutation null + ranked report. This is the whole V1.
- **Phase 2 (½ day):** turn it into a pre-backtest gate and log results per run.
- **Total: a single weekend.** V2 (nonlinear R², attribution decomposition) is another 2–3 days and almost certainly not worth starting until V1 flags a real triple.

### Why do it
- Directly targets your live worry: the NFL model beats the close weeks 1–6 — a leakage screen is the *correct* skeptical instrument for exactly that.
- Cheap: one weekend, no new data sources, reuses your feature/outcome pipeline.
- The permutation-R² interaction test is a permanent, reusable hygiene primitive — good for NBA and NFL alike.
- Great banter/thread material ("pairwise safe, jointly poisoned") with real math behind it.

### Why NOT do it
- **It produces zero edge.** Best case it prevents a loss; it never wins a bet. Your marginal hour is probably better spent on the NFL model itself.
- **The headline over-promises.** Pure order-3-only leakage (invisible to pairwise screens) is a measure-zero special case; in real sports data most leakage also shows pairwise, so a simpler pairwise screen catches ~everything for far less compute.
- **Combinatorial blowup** at larger feature counts; needs pre-filtering to stay tractable.
- **Red-team failure mode:** the permutation null assumes shuffling breaks *only* the signal↔outcome link. With autocorrelated weekly sports data, a naive row shuffle breaks temporal structure too, mis-calibrating the null — you'll get **false flags** (or, with block-shuffling too coarse, false clears). If you then *remove* a flagged triple that was actually fine, you can degrade a working model and convince yourself you "fixed leakage" when you added noise. The tool can manufacture the very paranoia it claims to resolve. Block-permutation calibration must be validated against a known-clean synthetic before trusting any flag.

---

## #5 — Epstein-Zin Bankroll Manager for Sports Bettors

**Paper:** *Certainty-Equivalent First-Order Learning (CEFOL)* — Peng, Guo, Wang, Zhu (arXiv 2607.09461v1)

**Blunt upfront verdict:** The framing you were handed ("recursive-utility bankroll sizing for bettors," "CEFOL makes EZ tractable with occasionally-binding bet limits") is a *promotional gloss*, not what the paper does. The paper is a **numerical-methods paper for macro/finance economists**. It solves discrete-time dynamic programming with Epstein-Zin recursive utility using neural networks, and validates on **consumption-saving problems and a DSGE model with stochastic volatility**. There is zero sports betting, zero odds, zero Kelly, zero closing-line value anywhere in it. The betting angle is a real idea you *could* build on top of the underlying preference structure, but the paper's contribution (a training scheme for solving these DPs at scale) is decorative for your purposes — you do not need CEFOL to size bets. I'll explain the actual method, then the genuinely useful betting kernel you can extract, and rate the fit honestly.

### The paper, technically

The real object is: how do you solve a Bellman equation when the utility is **recursive** (Epstein-Zin) instead of time-separable expected utility?

**Epstein-Zin recursive utility.** Standard expected-utility (and Kelly's log utility) forces one number to control two things: how much you dislike risk *and* how much you dislike consumption swings over time. Epstein-Zin decouples them into two parameters:
- **γ** = relative risk aversion (how much you hate variance/drawdown *now*).
- **ψ** = elasticity of intertemporal substitution (patience — willingness to defer payoff), with ρ = 1/ψ.

Utility is defined recursively through a **certainty equivalent** of next period's value:

$$\mathcal{C}(s_t,c_t) = f^{-1}\!\big(\mathbb{E}_t[f(V(s_{t+1}))]\big),\qquad f(x)=x^{1-\gamma}$$

so $\mathcal{C} = \big(\mathbb{E}_t[V(s_{t+1})^{1-\gamma}]\big)^{1/(1-\gamma)}$, and the value function is

$$V(s) = \max_{c\in\mathcal{A}(s)} w\big(s,c,\mathcal{C}(s,c)\big),$$

where $w$ is a CES-style aggregator of current reward and the risk-adjusted continuation value.

**The hard part.** The certainty equivalent is a *nonlinear* transform of a conditional expectation. Nonlinearity and expectation don't commute, so you can't just Monte-Carlo an average of future values — a plain sample mean of $V(s_{t+1})$ is the wrong object. This nonlinearity in the Bellman equation and in the first-order conditions is what makes recursive-utility DP annoying to solve at scale.

**CEFOL's actual contribution.** Train four neural nets jointly:
1. Value net $V(s;\theta_V)$
2. Policy net $c(s;\theta_c)$
3. Lagrange-multiplier net $m(s;\theta_m)$ for constraints
4. **A dedicated certainty-equivalent net** $\mathcal{C}(s,c;\theta_\mathcal{C})$ — the key trick, learning the nonlinear CE directly so it doesn't have to be recomputed from raw samples.

Losses: a CE-consistency loss (eq. 50) fitting $f(\mathcal{C})$ to the sample mean of $f(V_{t+1})$; a Bellman-consistency loss; and a **first-order/KKT residual loss** (eq. 60) that uses *two independent shock draws* per state so the product of residuals is an unbiased estimate of the squared conditional mean (avoids the "square-of-an-estimated-expectation is biased" problem). Constraints — equalities $q_r=0$, inequalities $g_m\ge 0$ — are enforced through KKT stationarity and a Fischer-Burmeister complementarity loss, so **occasionally-binding constraints** (borrowing limits, floors) are handled *without penalty hacks*. That's the one bullet from your framing that is real and does map to bet limits.

**Result:** out-of-sample Bellman and Euler residuals of order 1e-4 to 1e-3, matching value-function-iteration benchmarks. It's a solid solver paper. It is not a betting result.

### Prerequisites

- **Kelly criterion / log-optimal growth** — bet fraction maximizing expected log wealth; the baseline every bankroll method is measured against.
- **Fractional Kelly** — betting a constant multiple (e.g. 0.25x) of full Kelly to reduce variance; the *ad hoc* practice this idea claims to make principled.
- **Expected-utility vs. recursive utility** — EU collapses risk and time preference into one curvature; recursive utility splits them.
- **Epstein-Zin preferences** — the specific recursive form; two knobs γ (risk) and ψ (patience/EIS).
- **Certainty equivalent** — the guaranteed amount you'd accept in place of a gamble; nonlinear function of the outcome distribution.
- **Bellman equation / dynamic programming** — value = best current action + discounted future value; the backbone of sequential bet sizing.
- **KKT conditions & occasionally-binding constraints** — how you encode hard limits (max bet, min reserve) into an optimizer so the multiplier is nonzero only when the limit bites.
- **CRRA utility** — constant-relative-risk-aversion, the γ-parameterized building block inside EZ.

### Implementation outline

You do **not** need CEFOL or neural nets. Your betting problem is 1-3 state dimensions (bankroll, maybe streak state, maybe day-of-week bankroll target), which is trivially solved by **discretized value-function iteration on a grid** in a Python loop with Claude. CEFOL only earns its keep at 5+ dimensions with continuous DSGE state. Extract the EZ *preference kernel*, drop the deep-learning machinery.

**Data sources (your stack):**
- Bet log from **SharpLab**: for each historical bet you need `stake, decimal_odds, model_prob (edge), outcome, timestamp, bankroll_at_time, book`. This is your ground-truth path.
- **nba-modeling** and the **NFL rating-completion** model supply `model_prob`; edge = `model_prob * decimal_odds - 1`.
- **CLV harness**: you already log opening/closing lines — that gives you a per-bet realized-edge distribution to feed the sizing simulator.

**Core algorithm (V1):**
1. State $x_t$ = bankroll (normalized to units). Action = bet fraction $c_t \in [0, c_{\max}]$ per opportunity, subject to reserve floor $x_t - \text{stake} \ge x_{\min}$.
2. For each betting opportunity draw the win prob $p$ and payout $b$ from your model's *calibrated* edge distribution (bootstrap from SharpLab history, bucketed by edge size).
3. Recursive value: $V(x) = \max_c\big[(1-\beta)\,u(x) + \beta\,\mathcal{C}(x,c)^{1-\rho}\big]^{1/(1-\rho)}$ with $\mathcal{C}(x,c)=\big(\mathbb{E}[V(x')^{1-\gamma}]\big)^{1/(1-\gamma)}$, expectation over win/loss of the bet.
4. Solve by backward VFI on a bankroll grid (say 500 points), 1-D golden-section max over $c$ at each node. Clip $c$ to the max-bet / reserve constraints directly (no penalty needed at this dimensionality).
5. Output a **sizing table**: `f*(bankroll, edge) → fraction`. That's the deliverable — a lookup your existing bet-placement code queries.

**Plug into your harness:** replace the current Kelly/fractional-Kelly stake function with `ez_size(bankroll, edge, gamma, psi)`. Re-run the SharpLab backtest and CLV replay under three regimes: full Kelly, 0.25x Kelly, EZ-tuned. Report terminal bankroll distribution, max drawdown, time-under-water, and Sharpe/growth. The headline claim to test: *EZ gives you the same drawdown as 0.25x Kelly at higher growth, because it responds to edge quality rather than flatly scaling down.*

**V1 (a weekend):** 1-D bankroll state, static edge distribution, VFI table, backtest swap. Ship the sizing table + a "Kelly vs EZ vs frac-Kelly on my actual bet log" chart.

**Skip for V2:** the neural-net CEFOL solver (unnecessary), streak/mood state dimensions, correlated simultaneous bets (real but hard — same-game/same-slate correlation is the actual frontier), regime-switching edge distributions, and any DSGE/stochastic-vol modeling.

### Interest fit

**Fit strength: moderate, and lower than the framing implies.**
- **Venue:** venue-agnostic — sportsbook and Kalshi/Polymarket alike, since it's pure bankroll math on top of any edge source. Mild plus (works everywhere you bet).
- **NBA vs NFL:** applies to both; most useful where you have *many* small-edge bets (NBA volume) rather than the sparse NFL weekly slate.
- **Edge vs infra vs viral:** this is **infra/discipline**, not edge. It does not find you a single extra basis point of CLV — it governs how you *deploy* an edge you already have. Given your Elo model is already beating the close ATS weeks 1-6, sizing matters, but the marginal dollar is still in edge discovery, not utility curvature.
- **Viral upside:** low-to-moderate. "I replaced fractional Kelly with a principled Epstein-Zin bankroll manager and here's the drawdown curve on my real bet log" is a genuinely good quant-bettor blog post / thread. That's the strongest surface.
- **The honest deflator:** the *paper's* contribution (CEFOL) buys you nothing here. You're building the EZ sizing idea, which existed before this paper and doesn't need it. So don't credit this arXiv id with the value — the value is a 200-line VFI script you'd write anyway.

### Time with Claude

- **Phase 1 (½ weekend):** Pull SharpLab bet log, build the bootstrapped edge-distribution sampler, implement 1-D EZ value-function iteration and the golden-section max. Get a sizing table out.
- **Phase 2 (½ weekend):** Wire `ez_size` into the existing backtest/CLV harness; run Kelly / 0.25x-Kelly / EZ comparison; produce drawdown + terminal-wealth plots.
- **Phase 3 (optional, +1 day):** parameter sweep over (γ, ψ), pick the pair matching your gut risk tolerance, and write the blog post.

**Total: one weekend for a shippable V1**, a second weekend only if you chase correlated-bet sizing (which is the interesting-but-hard V2 and arguably a separate project).

### Why do it
- Directly upgrades your live money management; you almost certainly run *some* fractional-Kelly-by-vibes today, and this replaces the vibe with two interpretable knobs.
- Tiny, self-contained build with a clean backtest verdict — you'll *know* within a weekend whether it beats your current sizing on your own bet log.
- Nice viral artifact: real bet-log drawdown curves comparing sizing rules is exactly the "applied math to betting" content that lands.
- Reuses infra you already have (SharpLab log, CLV replay); near-zero integration cost.

### Why NOT do it
- **The paper is decorative for this use.** You're not implementing 2607.09461; you're implementing textbook EZ + VFI. If the point was "build the thing in the paper," this fails that test.
- **It's sizing, not edge.** Zero new CLV. Your comparative advantage right now is a model that beats the close — time spent on utility curvature is time not spent widening that edge.
- **Red-team failure mode:** the whole thing is only as good as your **edge distribution estimate**. Sports bettors have small samples and non-stationary, *correlated* bets (same-game parlays, same-slate NBA, injury-driven regime shifts). VFI assumes i.i.d. draws from a known distribution; if your model is even mildly overconfident or your bets are correlated, EZ will happily size *up* on phantom edge and the "principled" manager blows past the drawdown that plain 0.25x-Kelly would have capped. The math gives false precision over a badly-estimated $p$. In practice a robust flat fractional-Kelly may out-survive the elegant EZ table.
- **Two knobs, no ground truth for setting them.** γ and ψ are subjective; without a principled way to elicit them you're back to picking numbers by feel — the exact problem it claimed to solve.

---

## #6 — Entity-Attribution Verifier for Sports Betting Research RAG

**Reality check up front:** This paper (Caruzzo, Yoo, Kim — arXiv 2607.09349v1) is a *clinical* RAG paper. It is entirely about drug-disease question answering: a RAG system asked about drug X returns claims that are actually about drug Y, while passing every faithfulness/hallucination/citation check. There is not a single sportsbook, line, or box score in it. The "sports betting" framing in the pick is an analogy the scraper bolted on. The analogy is *good* — it maps cleanly onto a real failure mode in any research-assistant tool you'd build — but you should know that nothing in the actual result validates a betting edge. This is a **tooling/quality-control** paper, not an alpha paper.

### The paper, technically

The core observation is a taxonomy of grounding failures, ranked by how hard they are to catch:

- **Tier 3 — Confabulation:** model states a claim about X that has *no* source in the retrieved docs. Caught by standard faithfulness/hallucination checks.
- **Tier 2 — Entity Substitution:** model answers entirely about Y as if Y were X; X never appears. Caught trivially by NER (queried entity is just absent).
- **Tier 1 — Deceptive Grounding (DG):** the interesting one. Every claim is *real*, *document-grounded*, and *correctly cited* — but the cited evidence is about Y, presented as evidence about X. Faithfulness = high, hallucination = zero, citations = valid. The failure lives at the **entity-attribution level**, which none of those checks inspect.

**The measurement.** They build a 2D factorial benchmark. One axis (Cx) is how much X-specific evidence was retrieved: `absent / partial / complete`. The other axis (Cy) is what *competing* Y-evidence is present: `null / same-class / same-disease-different-mechanism / matches-model's-prior / synthetic-nonexistent-drug`. 264 drug triples × 15 conditions across 13 models. Result: DG rates of **8–87%** at peak adversarial conditions, and — the sharp finding — **domain-finetuned medical models are *worse* (up to 86.7%)**, not better. Specialization amplifies the failure because the model "knows" what the answer should look like and pattern-matches Y's evidence onto X.

**The mechanism ablation.** Remove X-specific evidence from retrieval entirely, and entity-attribution failure vanishes — but it converts to confabulation instead. So DG and confabulation are the *same trigger* (missing entity-specific evidence) taking two different escape routes. That's the load-bearing scientific claim.

**Production number.** On a deployed system over 740 drug-disease pairs: **7.8% DG overall, 13.6% for recently-approved drugs** (thin evidence base → more substitution). This is the number the pick quotes.

**The actual verifier (EAV).** Disappointingly simple as an artifact — it's an LLM judge (they used Kimi-K2.5) doing a per-claim post-hoc pass:
1. For each factual claim, find the retrieved doc supporting it.
2. Extract the *primary entity* that doc is about.
3. Flag if `doc_entity ≠ queried_entity` but the claim is presented as being about the queried entity.

That's it. No fine-tuned classifier, no NLI head, no clever architecture. The contribution is the *framing and benchmark*, not the detector. Reported **97.0% precision / 98.7% recall** on an IPW-adjusted human gold standard — but note `n=88`, `effective n≈55`, and the EAF-recall estimate rests on `neff=18`, so the confidence intervals are wide. **IPW** (inverse-probability weighting) just reweights their small hand-labeled sample back up to the stratified population distribution.

### Prerequisites

- **RAG (retrieval-augmented generation):** LLM answers grounded in fetched documents. The substrate this whole problem lives in.
- **Faithfulness / hallucination metrics:** checks that every claim traces to a source. The point of the paper is these are *necessary but insufficient*.
- **Named-entity recognition (NER):** pulling the canonical entity (drug, or for you: player/team/prop) out of text. Catches Tier 2, not Tier 1.
- **LLM-as-judge:** using one model to grade another's output against a rubric. The EAV detector *is* an LLM judge.
- **Factorial / ablation design:** vary two factors independently to isolate cause. How they proved DG and confabulation share a trigger.
- **IPW (inverse-probability weighting):** stratified-sample reweighting so a small labeled set estimates the full population rate. Only matters if you want a defensible *rate*, not just a working filter.

### Implementation outline

The shippable version for you is a **guardrail on a sports-research assistant**, not a betting model. Concretely: if you (or Sage) build a "give me the writeup on tonight's Celtics-Heat under" tool that RAGs over box scores, injury reports, and splits, EAV catches the case where it silently pastes Jaylen Brown's home/road splits into a Tatum answer, or last season's line into this week's.

**Data sources (your stack):**
- nba-modeling / nflverse: per-player and per-team splits, game logs, injury tables — these are your "documents," each tagged with an unambiguous entity id (`player_id`, `team_id`, `game_id`, `season`).
- SharpLab: odds/props as retrievable rows, each keyed to a market entity (player prop, team total).
- The query already carries the intended entity (you asked about Tatum, this week, the under).

**Core algorithm (V1, a weekend):**
1. Every retrieved chunk gets a hard **entity tag** at ingestion — you already have `player_id`/`game_id` in structured data, so this is free and *more reliable than the paper's LLM extraction*. This is the key win over the paper: your entities are keyed, not prose.
2. After the assistant drafts an answer, run a per-claim pass: for each sentence citing a source, check `claim_entity == source_entity_tag`. Mismatch → flag/strip/regenerate.
3. Because your tags are structured, most of this is a **join, not an LLM call** — cheaper and near-100% precision. Fall back to an LLM judge only for free-text sources (Twitter beat reporters, articles) where the entity isn't pre-keyed.

**V1 vs V2:**
- **V1 (do):** structured-entity-tag join guardrail over your existing keyed data + a small labeled test set of "wrong-player/wrong-week" traps to measure catch rate. This is genuinely a weekend.
- **V2 (skip for now):** the full factorial benchmark, IPW-adjusted rate estimation, 13-model comparison. That's a *paper*, not a tool. You don't need a defensible population rate; you need the filter to fire.

**Plug into harness:** it doesn't touch CLV or the backtest at all — those measure *edge*. This measures *research-tool correctness*. It belongs upstream of any LLM-written bet rationale, as a pre-publish gate (e.g., before Sage posts a pick, before a SharpLab writeup goes out).

### Interest fit

**Weak-to-moderate, and honest about it.** This is infrastructure/quality-control, not edge. Your stated ranking is: real betting edge > applied math > cool+shippable > viral. This scores **near-zero on edge**, low on applied math (the actual detector is a one-prompt LLM judge — the math is the *benchmark*, which you'd skip), and modest on cool+shippable.

- **Venue:** venue-agnostic; it's about the research layer, not Kalshi vs sportsbook. No viral upside.
- **NBA vs NFL:** slightly better fit for NBA (more per-player prop research, more entity-confusion surface) than NFL.
- **Where it actually earns its place:** *only* if you're already building an LLM-driven research/writeup layer (Sage-generated pick rationales, a "why this bet" explainer). Then it's a cheap correctness gate that prevents an embarrassing wrong-player writeup. If you're not building that layer, this paper has no hook for you — your models are numeric, and numeric pipelines can't suffer deceptive grounding because there's no free-text attribution step to corrupt.

### Time with Claude

- **Phase 0 (½ day):** decide if you even have an LLM research surface worth guarding. If SharpLab/nba-modeling are pure-numeric, stop here — nothing to build.
- **Phase 1 (1 weekend):** structured-tag EAV guardrail over keyed nflverse/nba data + a 30-case trap set (swapped player, swapped week, swapped season). Measure catch rate.
- **Phase 2 (+3-4 evenings, optional):** LLM-judge fallback for un-keyed free-text sources (beat-reporter tweets, articles).

Realistically **one weekend for something real**, and only worth starting if Phase 0 says yes.

### Why do it

- Cheap insurance against the single most embarrassing failure of an AI pick-writer: confidently applying the wrong player's/week's numbers while looking perfectly cited.
- Your structured entity keys make your version *better than the paper's* — a join beats their LLM extraction on precision and cost.
- The "recently-approved drugs → 13.6%" finding maps directly to *your* worst case: rookies, mid-season trades, first games in a new system — exactly where thin evidence makes an LLM substitute a similar player.

### Why NOT do it

- **It produces zero betting edge.** It's a seatbelt, not an engine. If you don't already have an LLM writeup layer, you're building a guardrail for a car you haven't built.
- The paper's actual detector is a single LLM-judge prompt — the impressive-sounding contribution (factorial benchmark, IPW, 13-model sweep) is the part you'd *throw away*. Low intellectual payoff-per-hour for you.
- **Red-team failure mode:** the guardrail gives false confidence. It only checks *entity attribution* — it does nothing about the number being *stale, wrong-context, or garbage*. You could ship a writeup that correctly attributes Tatum's splits to Tatum, passes EAV clean, and is still built on last-season's pace or a mis-scraped line. Worse: if you trust "EAV: clean" as a general quality stamp, you'll *stop* eyeballing the outputs, and the errors it doesn't cover will sail straight through. It narrows one failure class while inviting you to lower your guard on the rest.

**Bottom line:** technically sound paper, clean analogy, but it's a research-tool guardrail with no edge component. Build the weekend V1 *only if* you're already committed to an LLM-generated pick-rationale layer; otherwise this is decorative for your actual goals.

---

## #7 — Sports Betting Causal Graph Builder for Injury/Lineup Data

### The paper, technically

The paper is **DKCD: Domain Knowledge-Enhanced Causal Discovery from Unstructured Data** (arXiv 2607.09348). It is not a betting paper — it's a causal-discovery pipeline demonstrated on synthetic medical datasets (diabetes, respiratory). The pitch here is to repurpose its *mechanism* onto sports beat-reporter text. What the paper actually does:

**Problem it solves.** Standard causal discovery runs a statistical algorithm (PC, FCI, GES) over a table of variables and recovers a DAG. But if your table is *missing the confounders* — variables nobody measured — the recovered graph is garbage. LLM-only causal discovery (the COAT baseline) tries to invent the variables from text, but hallucinates and misses domain-specific hidden factors. DKCD's claim: inject a curated domain knowledge graph so the LLM proposes the *right* latent variables, then let a proper statistical algorithm settle the edges.

**Three-stage pipeline:**

1. **Knowledge Mining.** An LLM reads text samples and extracts explicitly-mentioned "observable factors" `V_o`. It then retrieves subgraphs from a domain knowledge graph (KG) by matching those factors to entity nodes, verbalizes the retrieved triples into sentences, and uses sentence embeddings (`all-MiniLM-L6-v2`) + cosine similarity to keep the top-r most relevant knowledge statements as context.

2. **Knowledge-Guided Causal Reasoning.** Given observables + retrieved KG context, the LLM infers *latent factors* `V_l` — variables never stated in the text but implied by domain relations ("travel fatigue," "backup usage load"). It also emits "causal clues": natural-language descriptions of plausible directional dependencies, which stabilize the next step.

3. **Causal Structure Discovery.** Full variable set `V = V_o ∪ V_l`. Each text sample is annotated with a value for every factor, producing a scoring table. That table is fed to **FCI (Fast Causal Inference)** — a constraint-based algorithm that, unlike PC, explicitly tolerates *unmeasured confounders* and outputs a PAG (partial ancestral graph) rather than a clean DAG. Edges are decided by conditional-independence tests on the annotated table.

**Result.** On synthetic diabetes data with GPT-4o, Node-F1 (did you recover the right *variables*) jumped 0.41 → 0.77 vs COAT; ESHD (edge structure error) dropped 30.67 → 25.33. Note the honest read: **variable recovery improved a lot; edge-structure error improved only modestly** (~17%), and it's on 400-sample *synthetic* data where ground truth was authored. There is no held-out real-world validation and no predictive/decision task.

Blunt assessment for betting: the load-bearing result is "LLM + KG proposes better latent variables." The *causal edges* it recovers are weakly validated even in-paper. For your purposes this is best treated as a **feature-generation / prior-elicitation** tool, not a source of trustworthy causal effect estimates.

### Prerequisites

- **Causal DAG / structural causal model** — a graph where an arrow X→Y means intervening on X changes Y; the object DKCD outputs.
- **Latent confounder** — an unmeasured variable that drives two others, faking a correlation between them (the whole reason FCI over PC).
- **Constraint-based discovery (PC / FCI)** — recover graph structure from conditional-independence tests rather than fitting parameters; FCI is the confounder-robust variant.
- **PAG (partial ancestral graph)** — FCI's output: some edges are undirected/circle-marked because the data can't orient them. You don't get a clean DAG.
- **Knowledge-graph retrieval + verbalization** — turning (entity, relation, entity) triples into sentences so an LLM/embedder can use them as context (basically RAG over a curated ontology).
- **Sentence embeddings + cosine similarity** — the top-r retrieval filter; you already have the muscle memory for this.
- **The confound you actually care about: causal vs predictive** — a discovered edge "PG out → under" is only useful if the *market hasn't already priced it*. DKCD says nothing about market efficiency; that's on you.

### Implementation outline

**Data sources (your stack):**
- **Unstructured text:** NBA beat-reporter tweets/articles, injury-report notes, rotation writeups. NBA is far better than NFL here (daily games, richer lineup churn, more beat text). Sources: nba injury feeds, Rotowire/Underdog-style notes, ESPN/beat Twitter archives.
- **Structured outcomes:** `nba-modeling` box scores + your RAPM/Elo tables for the annotated factor values (usage%, 3PA, pace, minutes). `nflverse` is the NFL analog if you extend.
- **Domain KG:** you build this by hand — a small ontology of ~30-60 basketball nodes (position, usage, pace, rest, 3PT reliance, foul trouble, blowout risk) with hand-drawn edges. This is the real work and the durable moat.
- **Market/labels:** SharpLab closing lines + CLV harness as ground truth for whether a discovered chain is *tradeable*.

**Core algorithm (V1):**
1. Curate the basketball KG by hand (JSON of triples). This anchors the LLM and is 80% of the value.
2. LLM pass over historical injury/lineup text → extract observable factors per game-day.
3. Retrieve KG neighborhood, verbalize, embed with `all-MiniLM-L6-v2`, keep top-r.
4. LLM proposes latent factors + causal clues per game.
5. Annotate historical games: join proposed factors to actual box-score/market values → scoring table.
6. Run FCI (`causal-learn` Python lib has it) → PAG.
7. **Freeze the PAG offline as a prior.** Convert oriented chains into candidate features ("backup_PG_usage_spike", "3PA_suppression_flag") that feed your existing NBA total/spread model.

**V1 vs V2:**
- **V1 (ship this):** hand KG + LLM latent-factor extraction + FCI over historical data → a *frozen* set of candidate features. Backtest those features in `nba-modeling` against player-prop and team-total closes. This is the whole edge test.
- **Skip for V2:** online/streaming causal updating, automated KG construction, per-game re-discovery, do-calculus effect estimation. All of it is fragile and none of it is needed to test whether the mined features beat the close.

**Backtest/CLV plug-in:** treat each discovered chain as a signal generator. For target markets (player 3PA/points props, team unders on specific injury patterns), generate the signal from the frozen DAG, price your fair line, log CLV in SharpLab. The graph is validated *only* if those signals show positive CLV — the paper's ESHD metric is irrelevant to you.

### Interest fit

Moderate — with a sharp caveat. **Venue:** best fit is **NBA player props and team totals on sportsbooks** (DraftKings/FanDuel props, or PrizePicks/Underdog-style), because injury→usage→volume chains are exactly what props misprice on late scratches. Weaker fit for Kalshi/Polymarket (thin NBA prop markets). **NBA >> NFL** here (data density, daily cadence, your existing RAPM/Elo pipeline). **Edge vs infra vs viral:** this is an *edge-hunting research tool*, not infra and not viral. It slots into your existing harness rather than being a standalone product.

Fit strength: **6/10.** The narrative ("freeze a hard-to-replicate causal prior over injuries") is genuinely aligned with your "durable edge" instinct, and injury/late-scratch prop mispricing is a real, known market inefficiency. But the paper's method is decorative-adjacent for *betting*: it recovers variables well but edges weakly, and it has zero notion of market efficiency. You'd be using it as a fancy feature-brainstorming loop, not as a validated causal engine. A hand-built causal DAG + LLM feature proposals would get you 80% of the value without FCI at all — which tells you the paper isn't the load-bearing part.

### Time with Claude

- **Phase 0 — KG curation (½ weekend):** hand-build the basketball ontology JSON. Boring but essential.
- **Phase 1 — extraction + retrieval pipeline (1 weekend):** LLM factor extraction, embed/retrieve, latent-factor + clue generation over a historical text corpus. Fast with Claude.
- **Phase 2 — annotation + FCI (½ weekend):** join to box scores, build scoring table, run `causal-learn` FCI, freeze PAG → feature list.
- **Phase 3 — backtest/CLV integration (1 weekend):** wire the frozen features into `nba-modeling`, generate prop signals, log CLV in SharpLab, read the verdict.

**Total: ~3 weekends** to a real go/no-go. The honest version: you'll know by end of Phase 1 whether the LLM latent factors are even novel vs. what your model already encodes. If they're not, stop before FCI.

### Why do it

- Injury/late-scratch **prop mispricing is a documented, real edge** — books are slow to reprice usage cascades, and this tool systematizes hunting them.
- It's a **feature factory** for your existing NBA model, not a rewrite — low blast radius, plugs into your harness.
- The "freeze a hand-tuned causal prior over beat text" framing is genuinely **hard to replicate** and matches your durable-moat instinct.
- Cheap to falsify: CLV harness gives a clean yes/no in 3 weekends.

### Why NOT do it

- **The paper doesn't support the betting claim.** Its wins are variable recovery on *synthetic* data; edge structure barely improved and there's no predictive validation. The math is semi-decorative for your use case.
- **FCI is the weak link:** with hand-annotated factors on a few hundred game-days, conditional-independence tests are underpowered — you'll get a circle-marked PAG you can't orient, and you'll end up hand-drawing the edges anyway (so why run FCI?).
- **No market-efficiency awareness:** a "true" causal chain the books already price gives zero CLV. The tool can't tell you which chains are *new information*.
- **Red-team failure mode:** garbage-in causal laundering. The LLM proposes plausible-sounding latent factors, FCI stamps a scientific-looking DAG on them, and you *believe* mined chains that are really just your KG priors reflected back — overfitting dressed as causality. You bet real money on a graph that encodes your assumptions, not the market's blind spots, and it silently bleeds until CLV catches it. Mitigation: never trust an edge that hasn't cleared the CLV harness; treat the entire graph as hypothesis generation only.