# arXiv Ideation — Deep Dives (#1, #2, #9, #12, #15)

*Full technical breakdowns of five picks: the paper, prerequisites, implementation, time-with-Claude, and honest why/why-not. Read the papers via WebFetch during analysis.*

## #1 — Heterogeneous-Effect Detector for Sportsbook Prop Markets

### The paper, technically

**Paper:** *A Machine-Learning-Compatible Omnibus Test for Treatment Effect Heterogeneity* — Lapenta, Strittmatter & Vergara Merino (arXiv 2607.06412).

Read past the abstract and this paper is precise about what it is: **a hypothesis test, not a CATE learner.** That distinction matters for the pitch and I'll return to it bluntly below.

The setup is causal inference under unconfoundedness. You have a treatment `D` (0/1), an outcome `Y`, a big pile of controls `X`, and a *chosen, low-dimensional* subset `Xc` you care about heterogeneity over. The paper asks one question: **does the treatment effect actually vary with `Xc`, or is a single average effect statistically sufficient?**

Formally the null is:

> H₀: E{Y(1) − Y(0) | Xc} = δ₀ (a constant) for all values of Xc.

Rejecting H₀ means "the effect systematically differs across subgroups defined by Xc" — i.e., a single average mis-describes the data. That is *exactly* the shape of the prop-market question: does the book's single posted line mis-price a player when you slice by opponent defensive profile, pace, rest, etc.?

The machinery, in plain terms:

1. **Doubly-robust residual (eq. 5).** For each observation build a pseudo-outcome that estimates the individual treatment effect:
   `V̂ᵢ = μ̂₁(Xᵢ) − μ̂₀(Xᵢ) + Dᵢ[Yᵢ−μ̂₁(Xᵢ)]/m̂(Xᵢ) − (1−Dᵢ)[Yᵢ−μ̂₀(Xᵢ)]/(1−m̂(Xᵢ))`.
   `μ̂₁,μ̂₀` are outcome regressions (treated/untreated), `m̂` is the propensity score. "Doubly robust" = the estimate stays valid if *either* the outcome model *or* the propensity model is right, and the whole test tolerates ML first-stage errors as long as they converge at the mild `oₚ(n^{-1/4})` rate. Then de-mean it: `Ûᵢ = V̂ᵢ − δ̂`.

2. **Cross-fitting.** Nuisance functions (`μ`, `m`) are fit on held-out folds so the residuals aren't contaminated by overfitting — standard double/debiased-ML hygiene.

3. **Integrated conditional moment (ICM) test.** Under H₀, the residual `U` is mean-independent of `Xc`, so `E{U·φ(tᵀXc)} = 0` for every projection direction `t`. Rather than pick one subgroup split, they integrate over *all* directions, yielding a quadratic-form statistic (eq. 6):
   `Sₙ = (1/n)·Ûᵀ·Fρ·Û`,
   where `Fρ` is an n×n kernel/Gram matrix of pairwise distances between the `Xc` values. Big `Sₙ` = residuals cluster in Xc-space = effect heterogeneity.

4. **Cheap multiplier bootstrap.** The clever, practical bit: you estimate the nuisances **once**, then get the critical value by re-weighting observations with random multipliers `ξᵢ` (mean 1, var 1) and recomputing only the quadratic form. No refitting ML models per bootstrap draw — it's just matrix math. Reject if `Sₙ` exceeds the (1−α) bootstrap quantile.

**Guarantees:** correct asymptotic size under H₀ (Prop 3.2), consistency — power → 1 — against *any* fixed heterogeneous alternative (an "omnibus" property: it doesn't need you to pre-specify the direction of heterogeneity). Extensions to diff-in-diff and IV are given but irrelevant to props.

**Honest verdict on decorative-vs-load-bearing math:** The test is real and correctly targets the pitch's *diagnostic* question ("is a single average wrong here?"). But the pitch says "omnibus heterogeneity test **+ CATE learner**." The paper gives you the **first half only**. It tells you *that* heterogeneity exists; it does **not** hand you `Ê[Y(1)−Y(0)|Xc]` as a usable prediction. To actually *bet*, you need a magnitude and a direction, which means bolting on a separate CATE estimator (causal forest / DR-learner / R-learner). The paper's doubly-robust residuals `V̂ᵢ` are exactly the right ingredient to feed such a learner, so the two compose cleanly — but be clear-eyed: **the paper is the screener, not the pricer.** That's still useful (it's a principled multiple-testing gate), just not the whole system.

There's also a deeper mismatch worth flagging up front: this is a *treatment-effect* framework, and props aren't obviously a treatment-effect problem. See the failure-mode discussion below.

### Prerequisites

- **Double/debiased machine learning (DML):** fit nuisance models with flexible ML, then use cross-fitting + a Neyman-orthogonal score so first-stage error doesn't bias the target. This paper *is* a DML test.
- **Doubly-robust / AIPW score:** the pseudo-outcome combining outcome-regression and inverse-propensity terms; unbiased if either component is correct.
- **Propensity score & unconfoundedness:** P(treatment | X); the assumption that once you condition on X, treatment is as-good-as-random. This is the load-bearing (and, for betting, the *dangerous*) assumption.
- **CATE (Conditional Average Treatment Effect):** E[Y(1)−Y(0)|Xc], the per-subgroup effect. The paper tests whether it's flat; it doesn't estimate its shape.
- **Integrated Conditional Moment (ICM) test:** turn "residual is mean-independent of Xc" into a check over all linear projections, avoiding arbitrary subgroup binning.
- **Multiplier (wild) bootstrap:** approximate the null distribution by random-reweighting the statistic instead of resampling+refitting — the reason this is fast.
- **Cross-fitting / sample-splitting:** train nuisances on one fold, evaluate residuals on another, to kill overfitting bias.
- **Omnibus vs. directed power:** omnibus = sensitive to any deviation but tells you nothing about *which* direction; you trade specificity for not having to guess.
- **CLV (closing-line value):** your existing SharpLab yardstick — the honest evaluator here, since backtested "edge" from a heterogeneity screen is very easy to fool yourself with.

### Implementation outline

**The core reframing you must nail first.** Props aren't literally treatments. You have two workable framings, pick one:

- **Framing A (recommended, honest): drop the causal story, keep the ICM residual test.** Treat it as a *model-misspecification / conditional-calibration* test. Let `Y` = actual player prop outcome (e.g. points), let your **nba-modeling** projection be the baseline mean, define residual `r = Y − projection`, and test H₀: E[r | Xc] = 0 across a chosen low-dim slice `Xc` (opponent defensive rating, pace, rest days, starter-out flags). This is the paper's `Sₙ` quadratic form applied to *your model's* residuals instead of a treatment contrast. Rejection = "your projection (and by extension the book's line, which tracks it) is conditionally biased on this slice." This is the version that actually plugs into what you have and doesn't require a fictional propensity model.
- **Framing B (faithful but forced): treatment = some binary matchup condition** (e.g. "faces a top-5 defense" vs not), `Y` = prop outcome, `X` = player/context controls, `Xc` = the slice. This lets you use the paper verbatim, propensity and all — but "propensity of facing a good defense" is schedule-driven, unconfoundedness is shaky, and it only tests one binary treatment at a time. More faithful to the math, less faithful to the money.

**Data sources (all already in your stack):**
- **nba-modeling** RAPM+Elo projections → the baseline mean per player-game-prop.
- **SharpLab** odds ingestion → posted prop lines + closing lines (your ground-truth de-vig implied number, and your CLV evaluator).
- Box scores / play-by-play (you already pull these; WNBA data is there too) → realized `Y` and the `Xc` covariates.

**Core algorithm (V1, Framing A):**
1. Assemble a table: one row per historical player-prop, columns = realized outcome, your projection, and 2–4 `Xc` covariates.
2. Residual `rᵢ = Yᵢ − projectionᵢ` (this replaces the doubly-robust `Ûᵢ`; if you want the paper's flavor, cross-fit a small ML correction model to de-mean it).
3. Build `Fρ`: Gaussian/kernel Gram matrix on standardized `Xc`.
4. `Sₙ = (1/n) rᵀ Fρ r`.
5. Multiplier bootstrap: draw `ξ ~` mean-1/var-1 (e.g. Mammen or exp(1)), recompute `Sₙ*`, repeat B=999, get the 95th percentile, reject if `Sₙ` exceeds it. Pure NumPy — a few hundred lines.
6. For any prop family + slice that rejects, *then* estimate direction with a simple binned/kernel CATE (or a `causal_forest` from `econml`) to know which way to bet, and size only where the implied edge clears the vig.
7. Route every candidate bet through SharpLab's existing CLV tracker — CLV is the referee, not backtest P&L.

**Plug-in points:** it becomes a SharpLab pre-filter (`scripts/heterogeneity_screen.py`) that runs after odds ingestion, flags prop/slice combos where your model is conditionally miscalibrated, and writes candidates into the same table the CLV tracker reads. nba-modeling supplies the baseline; no schema changes needed beyond one flags table.

**Minimal V1:** Framing A, one prop type (player points), 3 covariates, the `Sₙ` test + bootstrap, CLV logging of flagged plays. A Jupyter notebook proving the test has correct size on simulated null data before you trust one real rejection.
**Tempting-but-skip V2:** full doubly-robust propensity pipeline (Framing B) across all prop types and all sports, IV/DiD extensions, a live auto-bet loop, per-player CATE models. All of that multiplies surface area before you've shown the screen produces *positive CLV even once*.

### Time with Claude

- **Phase 0 — comprehension + simulation harness (½ weekend):** implement `Sₙ` + multiplier bootstrap on synthetic data, confirm nominal size and power. Non-negotiable trust-building step; cheap with Claude.
- **Phase 1 — data join (1 weekend):** wire nba-modeling projections + SharpLab odds + box scores into the residual table. This is the real work — plumbing, not math.
- **Phase 2 — V1 screen on one prop type (½–1 weekend):** run the test, add binned CATE direction, log to CLV.
- **Phase 3 — CLV evaluation (ongoing, calendar not effort):** you cannot shortcut this — need weeks of closed lines to know if a flag means money.

**Realistic build: ~2–3 weekends part-time** to a shippable V1. The *verdict* on whether it's a real edge takes a season of CLV, which no amount of Claude speed compresses.

### Direct benefits

- **A principled multiple-testing gate.** You're implicitly running hundreds of "is this slice mispriced?" comparisons; the omnibus test is a statistically honest way to control false discoveries instead of eyeballing splits and fooling yourself. This is the single most valuable thing here.
- **Reusable infra:** a generic conditional-miscalibration detector that works on *any* model's residuals — NBA today, WNBA/totals/spreads tomorrow, and even non-betting (a SciBowl difficulty-calibration check, honestly).
- **Sharpens nba-modeling directly:** every rejection is a labeled failure of your own projection model — a to-do list of features to add.
- **Portfolio/viral potential:** "I applied a 2026 econometrics heterogeneity test to NBA prop mispricing" is a genuinely cool, technically legible write-up for share.djiang.xyz. High cool-factor per line of code.
- **Fun:** it's a clean, self-contained NumPy kernel with real theory behind it — the kind of thing that's satisfying to build in a weekend.

### Why do it

- The paper's *diagnostic* maps almost perfectly onto a question you already care about, and composes with SharpLab/nba-modeling with near-zero new plumbing.
- V1 is small, the math is a quadratic form + bootstrap (Claude can write it correctly in an afternoon), and the simulation harness gives you a trustworthiness check before any real money.
- Even if it never prints money, it's a strict *upgrade* to your model-diagnostics: it finds where your projections are conditionally wrong.
- Strong write-up material with real academic pedigree — good viral/portfolio odds.

### Why NOT do it

- **It's a test, not a pricer — the pitch oversells "CATE learner."** The paper gives you a green/red light, not a number to bet. The betting edge lives entirely in the *bolt-on* estimator and in your data quality, not in the paper. If you expected the paper to hand you the edge, it won't.
- **Red-team failure mode — heterogeneity ≠ mispricing.** This is the fatal one. The test detects that effects vary across `Xc`. But **the closing line already conditions on all of that.** The market prices matchup, pace, and rest. So the test will happily reject H₀ — effects *are* heterogeneous — on slices where the book is *perfectly calibrated*. You'll get a firehose of "significant" flags that are statistically real and financially worthless, because *conditional variation your model sees is only edge if the market doesn't also see it.* The correct null isn't "effect is flat," it's "my residual-vs-**closing-line** is flat," which is a subtler and less impressive test than the paper's. Get this framing wrong and you'll bet noise with academic confidence.
- **Treatment-effect framing is a forced fit.** Props aren't treatments; Framing B's unconfoundedness assumption is not credible (schedule isn't randomized), and Framing A quietly abandons the causal content that makes the paper novel — at which point you're doing a fairly standard conditional-moment specification test with extra steps.
- **Multiple-testing across many slices/prop types** reintroduces the exact false-discovery problem the test was supposed to solve, one level up — you need to correct across the *family* of tests too.
- **Opportunity cost:** the binding constraint on SharpLab profit is almost certainly line-shopping, stale-line speed, and market selection, not "which subgroup is my model wrong on." This is a beautiful screwdriver; make sure the problem is a screw.

**Bottom line:** Build it as a **model-calibration diagnostic keyed on closing lines** (not raw outcomes), keep V1 tiny, and let CLV — not the p-value — decide if it's edge. Worth a couple of weekends for the infra and the write-up; treat any claimed betting edge as unproven until a season of positive CLV says otherwise.

---

## #2 — Graph-Regularized Player Rating Completion for Thin Markets

### The paper, technically

**Paper:** *Graph-Regularized Low-Rank Matrix Completion by Variable Projection* — Loucheur, Absil, Journée (arXiv:2607.09546). Absil is a co-author of the standard reference on optimization on matrix manifolds, so this is a legit numerical-optimization group, not a hype ML shop.

**What problem it solves.** Classic low-rank matrix completion: you have a big matrix `M` (m×n) with only a subset of entries `Ω` observed, and you want to fill the rest by assuming `M ≈ UW` with rank `r ≪ min(m,n)`. The paper's contribution is bolting *graph regularization* onto an existing, well-engineered solver called **RTRMC** (Riemannian Trust-Region Matrix Completion). The "graph" encodes side information: which rows are similar to each other (e.g., weather stations that are geographically close) and which columns are similar (adjacent time steps). The intuition — and this is exactly the pitch for thin sports markets — is that when you barely have any observations, a prior that says "connected nodes should have similar latent vectors" pulls the completion toward something sane instead of overfitting the handful of entries you do have.

**The actual objective.** They minimize over factors `U` (m×r) and `W` (r×n):

```
h(U,W) = ½‖C ⊙ (UW − M)‖²_Ω           (fit observed entries, C = confidence weights)
       + (λ²/2)‖UW‖²_Ω̄                 (shrink predictions on UNobserved entries)
       + (λu/2)·Tr(Uᵀ Lu U)            (row-graph smoothness)
       + (λw/2)·Tr(W Lw Wᵀ)            (column-graph smoothness)
```

`Lu` and `Lw` are the **graph Laplacians** of the row-similarity and column-similarity graphs. The Laplacian term expands to `Σ_k Σ_{(i,j)∈E} A_ij (U_ik − U_jk)²` — literally "penalize the squared difference in latent coordinates between any two rows the graph says are connected, weighted by edge strength `A_ij`." That is the entire conceptual payload: *soft-tie the embeddings of similar entities.*

**The clever machinery (the part that's actually a contribution).**
1. **Variable projection.** Instead of jointly optimizing `U` and `W`, they observe that for any fixed `U`, the optimal `W(U)` is the solution of a regularized linear least-squares problem — solve it in closed form and substitute back, collapsing the objective to `f(U) = h(U, W(U))`, a function of `U` alone. Fewer variables, better conditioning.
2. **Grassmann manifold.** The quality of `UW` depends only on the *column space* of `U`, not the specific basis — so they optimize over the Grassmann manifold `Gr(m,r)` (the set of r-dimensional subspaces), using an orthonormal representative `U` with `UᵀU = I`. This removes the gauge redundancy and gives a compact, well-behaved search space.
3. **Riemannian trust-region.** They compute the Riemannian gradient `grad f(U) = (I − UUᵀ)∇f(U)` and the Riemannian Hessian, then run a trust-region method (second-order, robust) on the manifold.

**The honest cost of the graph term.** In vanilla RTRMC, each column of `W` solves independently (block-diagonal system). The column-graph Laplacian `λw(Lw ⊗ I_r)` **couples all columns together**, destroying that block structure and forcing one big vectorized least-squares solve. This is why the paper reports GR-RTRMC is **2–3× slower** than plain RTRMC.

**Does the math actually pay off? Mostly no — the gains are marginal.** This is the load-bearing red-team fact. On the Belgium weather data, GR-RTRMC hits 0.45°C RMSE vs plain RTRMC's 0.49°C — a real but tiny improvement. In the "Spread" missingness scenario, **plain SoftImpute (0.41°C) actually beat GR-RTRMC (0.43°C)** — i.e., the fancy manifold+graph method lost to a 2010-era baseline. On MovieLens it edges out GRALS and standard CF (0.942 RMSE on 100K, 0.913 on 1M), but by a hair. And the paper is admirably candid about the killer failure mode: **localized phenomena that violate low-rank + smoothness break it.** A storm hitting one region creates a temporary "phase shift" that a low-rank, spatially-smoothed model cannot represent — the very structure that helps in the average case actively hurts on the events you care about most.

**Bottom line on the paper:** the method is real and correctly derived, but the empirical case is "small, situational improvements at 2–3× the compute, sometimes losing to trivial baselines." The graph prior helps most exactly when data is *sparse* and the underlying signal is *genuinely smooth over the graph*. That caveat is the whole ballgame for the sports application.

### Prerequisites

- **Low-rank matrix completion** — fill a partially-observed matrix by assuming it's approximately `UW` with small rank; the workhorse behind Netflix-style recommenders.
- **Graph Laplacian `L = D − A`** — a matrix that turns "these nodes are connected" into a smoothness penalty; `xᵀLx` = sum of squared differences across edges. This *is* the graph-regularization mechanism.
- **Variable projection** — when a subproblem is linear in half your variables, solve that half in closed form and eliminate it, leaving a smaller, better-conditioned problem in the rest.
- **Grassmann / Stiefel manifold** — Stiefel = matrices with orthonormal columns (`UᵀU=I`); Grassmann = subspaces (quotient out the basis choice). Lets you optimize over "column spaces" cleanly.
- **Riemannian optimization / trust-region** — gradient descent and Newton-type methods generalized to curved constraint sets (manifolds); trust-region is the robust second-order variant that adapts step size via a local quadratic model. You mostly *consume* this via a library (Pymanopt), you don't implement it.
- **RAPM / Elo** (you already own these) — the ratings you're trying to complete; RAPM is itself a regularized regression, so a graph prior on player embeddings is philosophically the same move you already make with ridge.
- **Cold-start / thin-market problem** — early-season or low-sample regimes where the matchup/possession matrix is mostly empty and naive ratings are garbage; this is the *only* reason to reach for this method.

### Implementation outline

**Framing the sports problem as the paper's problem.** Build a player (or team) latent-factor matrix `M` where you have very few reliable observations early-season, and use a **prior graph** to regularize the completion. Two concrete framings:

- **Team-level (start here, V1):** `M` = team-vs-team margin/efficiency matrix. Rows/cols = teams. `Ω` = games actually played so far. **Row/column graph** = teams connected by conference membership, shared coaching tree, and roster-continuity (returning-minutes overlap / transfer edges). Complete the matrix → per-team strength → feed spread/total.
- **Player-level (V2):** `M` = player latent-ability factors that RAPM struggles to estimate with <N possessions. Graph edges = same team, transfer source→destination, similar role/position, minutes overlap. Regularize a player's cold-start embedding toward connected players.

**Data sources.**
- College hoops: KenPom / Bart Torvik / hoop-explorer for possessions & efficiency; conference tables and coaching histories are scrapeable; transfer-portal data (Verbal Commits, 247) for roster-continuity edges.
- NBA cold-start: your existing nba-modeling possession/RAPM pipeline; edges from prior-season teammates, trades, and (crucially) **prior-season player rating as a self-edge/prior**.
- Odds & CLV: your SharpLab ingestion is already the eval harness.

**Core algorithm to implement.** Don't reimplement Riemannian trust-region — use **Pymanopt** (Grassmann manifold + trust-region solver are built in). Your actual work is:
1. Assemble `M`, mask `Ω`, confidence weights `C`.
2. Build `Lu`, `Lw` from your prior graphs (normalized Laplacians; tune edge weights `A_ij`).
3. Implement the cost `f(U)`, the closed-form `W(U)` least-squares solve (with the `λw(Lw⊗I)` coupling — this is the fiddly bit), and the Euclidean gradient `∇f(U) = R_U W_Uᵀ + λu Lu U`. Pymanopt can autodiff or you hand-code.
4. Cross-validate `r, λu, λw, λ²` on held-out games; the honest baseline to beat is **plain ridge/RAPM + your current Elo blend**, not a strawman.

**How it plugs in.** Output is a completed strength/rating matrix → drop straight into nba-modeling's existing spread/total feature vector as a new "early-season completed rating" feature. SharpLab is the scoreboard: track **CLV specifically on early-season / low-total-line college games**, the exact slice where books are thinnest and the prior should help.

**Minimal V1 (a weekend or two):** team-level, single sport (college basketball, first 6–8 weeks of season), conference + roster-continuity graph only, Pymanopt off-the-shelf, evaluate on RMSE-vs-final-ratings AND on paper-CLV in SharpLab.

**Tempting-but-skip V2:** full player-level completion, multi-sport, learned edge weights, coaching-tree graph mining, custom Riemannian Hessian for speed. Skip until V1 shows CLV edge — per the paper, the marginal gain over simple baselines is small, so heavy V2 investment is likely wasted.

### Time with Claude

- **Phase 0 — reproduce the method on a toy matrix (0.5–1 day).** Get GR-RTRMC running in Pymanopt on synthetic low-rank + graph data; confirm graph term beats no-graph when you inject sparsity. This de-risks the whole thing cheaply.
- **Phase 1 — data + graph assembly (2–3 days).** Scrape/format college efficiency matrix, build conference + roster-continuity Laplacians. Most of the real calendar time lives here, not in the math.
- **Phase 2 — integrate + backtest (2–3 days).** Wire completed ratings into nba-modeling spread features, backtest early-season slices, log paper-CLV in SharpLab.
- **Phase 3 — honest bake-off (1–2 days).** GR-RTRMC vs plain ridge/RAPM vs SoftImpute vs your current blend. Decide go/no-go.

**Total: roughly 1.5–2 weekends of focused work** with Claude Code doing the Pymanopt plumbing and scrapers. The manifold optimization is a solved-library problem, so nearly all effort is data engineering and honest evaluation.

### Direct benefits

- **A genuine cold-start edge, IF it materializes:** early-season college and post-trade NBA are exactly where books are softest and your models are weakest; a principled prior for the thin-data window is the highest-leverage place to find CLV.
- **Reusable infra:** a "complete a sparse rating matrix with a prior graph" module is generic — reusable across sports, across SharpLab markets, and as a general nba-modeling utility for any low-sample regime.
- **Portfolio/viral potential:** "I used Riemannian manifold optimization to beat the early-season number" is a great blog post / thread. The math is impressive-sounding and the sports framing is concrete and shareable.
- **Fun:** genuinely interesting math (Grassmann manifolds, variable projection) with a direct betting payoff — hits your "cool + real edge" intersection.

### Why do it

- The graph prior is *most* useful exactly in your target regime (sparse observations + genuinely smooth structure like conferences/rosters), which is the paper's strongest case.
- It's cheap to falsify: Phase 0+3 tell you in ~3 days whether it beats plain ridge, before you over-invest.
- Off-the-shelf Pymanopt means low implementation risk; the hard part is data, which you're already good at.
- Slots into existing infra (nba-modeling features, SharpLab CLV) with no new stack.

### Why NOT do it

- **The paper's own results are marginal and sometimes negative.** GR-RTRMC beat plain RTRMC by ~0.04°C and *lost to SoftImpute* in one scenario. There is a real chance graph regularization gives you a statistically-invisible bump over plain ridge/RAPM — and in betting, a bump you can't distinguish from noise is worthless.
- **The failure mode is aligned with the money.** The paper is explicit: low-rank + smoothness *breaks on localized, non-smooth events* (its "storm/phase-shift" case). In sports, the non-smooth events — a breakout freshman, a scheme change, a key injury — are exactly the mispricings you want to catch. The prior graph will actively *shrink you toward the crowd* precisely when the edge is in deviating from it.
- **Ridge already does 80% of this.** Your RAPM is regularized regression; graph-Laplacian regularization is "ridge with a fancier penalty matrix." The honest question is whether the *specific graph structure* adds signal beyond a well-tuned scalar prior + prior-season rating — and often it won't.
- **2–3× compute for marginal gain** is a bad trade unless the accuracy clearly converts to CLV; the manifold machinery is elegant but not free.
- **Thin markets are thin for a reason.** Low-total college games and early-season lines have low limits and high hold; even a real modeling edge may not clear the vig at bettable size.

**Verdict:** Worth a *time-boxed* spike (Phase 0 + a quick bake-off) because it's cheap to test and slots into infra you already have — but go in expecting to have to *prove* it beats plain ridge, and be ready to kill it. The math is sound and non-decorative, but the paper itself shows the edge over simple baselines is small and situational; don't build V2 until V1 shows real CLV on the early-season slice.

---

## #9 — Crowd-Aware Stadium Egress Routing

### The paper, technically

**Paper:** *"I see you, do you see me? Perception-based crowdedness and behavioral responses in pedestrian dynamics"* — Igor Hołowacz & Pratik Mullick (arXiv 2607.09221).

**What it actually is:** a *descriptive analysis* paper, not a control or optimization paper. The authors take **116 pre-existing motion-capture trials** of two pedestrian groups crossing through each other at angles α from 0° to 180° (recorded at 120 Hz), and re-analyze the trajectories through a new lens: "perceived crowdedness" rather than raw density.

**Core method, in plain terms:**

1. **Perceived-crowdedness metric.** Instead of counting neighbors, they weight each other pedestrian *j* by inverse-square distance and by whether *j* is in the focal pedestrian's field of view:

   ρᵢ(t) = Σⱼ≠ᵢ wᵢⱼ / ‖rᵢ − rⱼ‖²

   The weight wᵢⱼ knocks down (by a tunable factor c ∈ [0,1]) contributions from people outside a ~210° cone of vision. This is the "anisotropy" knob.

2. **Normalized interaction window.** For each trial they auto-detect when the two groups begin and finish passing through each other (edge-cutting algorithm), then rescale time to t′ ∈ [0,1] so trials at different angles are comparable.

3. **Dynamic fundamental diagrams.** They plot speed, deviation, crowdedness, and acceleration against each other *over the course of the interaction* — and show these traces form loops (hysteresis), meaning the same instantaneous density can correspond to different behavioral states depending on history. Classic static density-vs-speed diagrams miss this.

**The headline result (the one the pitch is built on):**
- **Initial deceleration is strongly geometry-dependent.** Crossings near 90°–120° (T-bone / obtuse merges) produce the sharpest slow-down and biggest velocity loss; near-antiparallel crossings (150°–180°) barely disrupt speed.
- **Recovery acceleration is roughly geometry-independent.** Once the conflict resolves, the positive accelerations as people speed back up converge to a narrow band regardless of the crossing angle. So *how badly you get disrupted* depends on merge geometry, but *how fast you recover* is roughly fixed.

Two important honesty caveats:
- **All results are qualitative.** The paper reports *no* numbers for deceleration or recovery acceleration (m/s²), *no* velocity-loss magnitudes — these live only in figures. The one hard number is a weak correlation r ≲ 0.3 between two turn-angle measures.
- **The paper proposes zero interventions.** No merge-angle engineering, no staggered releases, no routing, no control scheme. It's a characterization paper about perception and hysteresis. The "engineer merge angles + stagger releases to keep flow in recovery" pitch is *your* extrapolation, not the paper's claim.

### Prerequisites

- **Fundamental diagram (traffic flow):** the density↔flow↔speed relationship; the core object of pedestrian/traffic engineering. You need to know what the static version looks like to appreciate the "dynamic/hysteresis" twist.
- **Social-force / velocity-obstacle models:** the two standard families for simulating pedestrians (Helbing's social force; ORCA/RVO reciprocal velocity obstacles). One-line: agents are repelled by neighbors/walls (social force) or pick collision-free velocities (VO). You'll need one to *simulate* egress since the paper gives you no generative model.
- **Anisotropic weighting / field-of-view kernels:** down-weighting neighbors behind you; the paper's ρᵢ. Intuition: what's in front matters more than what's behind.
- **Hysteresis / path dependence:** system state depends on history, not just current inputs — why static diagrams fail here.
- **Macroscopic vs microscopic flow:** micro = per-agent trajectories; macro = fields (density, flux). Egress routing is usually solved at the macro level.
- **Network flow optimization (min-cost / max-flow, MILP):** modeling a stadium as a graph of gates→concourses→exits and pushing crowds through it optimally. This is the actual engine of any "routing" product, and it's **not in the paper**.
- **Staggered release / metering:** the same idea as ramp metering on highways — release cohorts on a schedule to avoid merge saturation. Also not in the paper; you'd have to invent the mapping from the paper's finding to a release schedule.

### Implementation outline

Be clear-eyed: to turn this into a *project* you must supply almost everything the paper doesn't — a simulator, a stadium graph, and a control policy. The paper contributes one design heuristic ("keep merges away from the ~90–120° disruption zone; don't re-inject a cohort before the previous one has recovered").

**Data sources:**
- Stadium/venue geometry: OpenStreetMap building + concourse polygons; or hand-drawn graphs for a few known venues.
- Ground-truth pedestrian data for calibration: the JuPedSim / Ped-Data open datasets (the same lineage the paper's crossing data comes from).
- No live crowd feed exists for you as a solo builder — this is simulation-first.

**Core algorithm (V1):**
1. Model a venue as a directed graph: nodes = seating sections, gates, concourse junctions, exits; edges have capacity (people/s) and a *merge angle* attribute at each junction.
2. Assign each junction a **disruption penalty** as a function of merge angle, shaped by the paper's finding (peak penalty ~90–120°, low near 0°/180°). This is where the paper is load-bearing — it justifies the penalty curve's *shape*.
3. Solve a **min-cost multi-commodity flow / MILP** to route each section to an exit, with a **time-staggered release schedule** as decision variables (which sections dump into a concourse when), constrained so no junction exceeds a saturation threshold *and* cohorts don't overlap before "recovery."
4. Validate by plugging the schedule into an ORCA/social-force **microsimulation** and measuring total clearance time vs. a naive "everyone leaves at once" baseline.

**How it plugs into David's stack:** honestly, **it doesn't meaningfully.** SharpLab (odds/CLV), nba-modeling (RAPM+Elo), and SciBowl are unrelated domains. The only real bridges are (a) it's *sports-adjacent* — you could demo it on an NBA/NFL arena and cross-post to the SharpLab audience, and (b) MILP/network-flow and agent-sim infra is reusable if you ever do lineup optimization or scheduling elsewhere. There's no data or model sharing.

**Minimal V1:** one real stadium graph, a merge-angle penalty curve from the paper, a MILP that outputs a per-section staggered-release timetable, and an ORCA sim showing X% faster clearance vs. baseline. Shippable as an interactive React/D3 viz (leans on your SciBowl front-end skills) — "click a stadium, watch the crowd clear."

**Tempting but skip (V2):** calibrating a bespoke pedestrian model from the paper's perceived-crowdedness metric, real-time re-routing from camera feeds, multi-venue generalization, "perception anisotropy" tuning. All high effort, and the paper's finding is too qualitative to calibrate against.

### Time with Claude

- **Phase 0 — feasibility spike (½ weekend):** stand up ORCA (via `RVO2` Python) or a social-force lib, reproduce a basic crossing, confirm you can even see a deceleration/recovery signal. This gates the whole project.
- **Phase 1 — stadium graph + MILP router (1 weekend):** one venue, PuLP/OR-Tools min-cost flow with merge-angle penalties and staggered-release variables.
- **Phase 2 — micro-sim validation (½–1 weekend):** feed the schedule into the sim, measure clearance vs. baseline, produce the money chart.
- **Phase 3 — interactive viz + writeup (1 weekend):** React/D3 front end, publish to share.djiang.xyz.

**Total: ~3–4 weekends part-time** for a polished demo; a rough proof-of-concept in **1–2 weekends**. Claude accelerates the OR-Tools and sim glue heavily.

### Direct benefits

- **Portfolio / viral potential:** a clickable "watch a stadium empty faster" viz is genuinely shareable and visually striking — best-in-class outcome here.
- **Reusable infra:** you'd build a clean MILP/network-flow + agent-sim scaffold, transferable to any scheduling/optimization side project.
- **Sports-adjacency:** plausibly cross-promotable to a SharpLab-adjacent audience, even if there's no betting edge.
- **Fun:** emergent crowd behavior is satisfying to watch and tune.

### Why do it
- The core finding (geometry-dependent disruption, geometry-independent recovery) is a clean, intuitive hook that maps naturally to a "don't merge at 90°, don't re-release too soon" design story.
- Fully simulation-based → no data-access blockers, no API keys, no scraping. Self-contained weekend-scale scope.
- Strong visual/demo payoff that plays to your React front-end strength and viral instincts.

### Why NOT do it
- **The math is decorative for this pitch.** The paper is descriptive, gives *no* quantitative acceleration values, and proposes *no* routing/release/merge-angle intervention. You are borrowing a qualitative curve shape and inventing the entire optimization layer yourself. The paper doesn't validate that engineering merges/releases actually improves clearance — that's an untested assumption.
- **Zero real edge and near-zero integration.** It doesn't touch SharpLab, nba-modeling, or any betting/CLV workflow. No money, no data synergy. It's a fun toy, not an edge.
- **Red-team failure mode:** you build a slick MILP + sim, but because you calibrated the merge-penalty against a qualitative figure (no numbers), the "X% faster clearance" is an artifact of *your* penalty curve and sim assumptions, not a real, defensible result. A domain person will immediately ask "where's your validation against real egress data?" and you won't have it — the paper's crossing experiments are lab-scale two-group crossings, not stadium egress. The demo looks impressive but the claim underneath is unfalsifiable.
- **Opportunity cost:** 3–4 weekends that could go to something with actual betting edge (your stated top value).

**Bottom line:** cool, shippable, viral-adjacent weekend viz — but the paper is a thin, qualitative foundation and the project has no betting edge and no real integration with your stack. Do it only if the *visual demo itself* is the goal, not because the science supports a genuine egress-optimization claim.

---

## #12 — Physics-Constrained Surrogate for Prediction-Market Calibration

### The paper, technically

**Paper:** *Entropy-Constrained Machine Learning with Residual Data Augmentation for Modeling Chemical Kinetics* — Ukorigho & Owoyele (physics.flu-dyn / cs.LG).

**What it actually does.** Turbulent combustion DNS is brutally expensive because you must evaluate detailed chemical kinetics (dozens of species, stiff ODEs) at every grid cell every timestep. The paper trains a cheap ML surrogate that predicts species source terms (reaction rates ω̇) from a reduced thermochemical state, so the solver can skip the stiff chemistry solve. Two contributions matter:

1. **Entropy constraint as a soft penalty.** The surrogate is free to produce nonsense (negative net entropy generation) that violates the second law and blows up the CFD solver. They add a penalty term to the loss:

   ℒ = (1/N) Σ‖ω̇_DNS − ω̇_pred‖² + λ_σ Σ [max(0, −σ_n)]²

   where σ = −(1/T) Σ (μᵢ/Wᵢ) ω̇ᵢ is the local entropy generation rate. The `max(0, −σ)²` term is a one-sided hinge: it costs nothing when σ ≥ 0 (physically admissible) and grows quadratically when the model predicts entropy-destroying reactions. This is a *soft* constraint — not a hard projection — that just biases training toward the physically feasible cone. Result: unconstrained models diverge with σ down to −0.5×10⁷; the constrained one stays σ ≥ 0 and stays stable.

2. **Residual data augmentation.** To generalize to new inlet conditions without new DNS runs, they decompose each state into a cheap analytic baseline (the 1D laminar flame profile) plus a *residual* (the turbulence-driven deviation). For a new condition they synthesize training data as: `laminar_profile(new) + kNN-sampled residual(from baseline DNS) + Gaussian noise`. The insight: the turbulent residual structure transfers across conditions even when the mean profile shifts.

**The result is real, not decorative.** ~15× wall-clock speedup (3.125h → 12min), NMAE ~2–8×10⁻³, and — crucially — the entropy penalty is *load-bearing*: without it the surrogate is unstable. This is a genuine "physics constraint makes an ML surrogate trustworthy" result.

**But here's the honest read for the port.** The two ideas are portable, but the *analogy is loose, not tight*. Combustion has a first-principles, thermodynamically-derived inequality (σ ≥ 0) with a closed-form σ. Prediction markets have a genuine coherence condition too — **no-arbitrage / no-Dutch-book** — but it's a much *weaker* and *cheaper* constraint. You don't need a neural surrogate to enforce coherence in a prediction market; you can enforce it *exactly and analytically* (log-scoring-rule market makers like LMSR are Dutch-book-free by construction; a simplex projection makes any probability vector coherent in closed form). So the "entropy penalty" idea maps onto a problem where the hard version is trivial. That's the central tension of this idea — see "Why NOT."

### Prerequisites

- **No-Dutch-book / coherence (de Finetti):** a set of prices on mutually exclusive outcomes is coherent iff it can't be combined into a guaranteed-profit book; for a partition, prices must be non-negative and sum to 1.
- **LMSR (Logarithmic Market Scoring Rule):** Hanson's automated market maker; prices are a softmax of inventory, so they're *always* a valid probability distribution — coherence is free.
- **Soft constraint / penalty method:** add `max(0, violation)²` to the loss instead of hard-projecting; trades exactness for differentiability and easy training.
- **Simplex projection:** the closed-form operation that snaps any real vector to the nearest valid probability vector (Euclidean projection onto the probability simplex) — the "hard" version of the coherence constraint.
- **Residual decomposition / control variate:** model `signal = cheap_baseline + learned_residual`; you learn the hard part on top of a known structure, which the paper reuses as its augmentation trick.
- **CLV (closing-line value):** did your price beat the closing line? The canonical ground-truth for "was this bet +EV" in sports betting — your calibration target.
- **Calibration (reliability) & proper scoring rules:** when you say 60%, does it happen 60% of the time? Measured by log-loss / Brier; a proper scoring rule can't be gamed by miscalibration.
- **kNN in feature space:** the augmentation samples nearest-neighbor residuals — you need a distance metric over game/market states.
- **Order-book microstructure:** bid/ask, depth, and how "volatility scenarios" would be synthesized from book snapshots (the pitch's V2 hook).

### Implementation outline

**What the project actually is (reframed honestly):** a **coherence-constrained, physics-flavored calibration layer** that sits on top of nba-modeling's raw predictions and outputs a *jointly coherent, well-calibrated* probability vector across related markets (spread / moneyline / total / player props for the same game), trained with (a) a coherence penalty and (b) residual augmentation to cover thin-data conditions. The betting edge comes from exploiting *incoherence in the market* — books and other models frequently price the ML, spread, and total inconsistently.

**Data sources (all things David already has or can get):**
- nba-modeling RAPM+Elo outputs → raw win prob / spread / total predictions.
- SharpLab odds ingestion → historical odds across books, and closing lines (for CLV labels).
- Derived: for each game, the *joint* set of related markets (ML, spread, total, alt-lines) — this is your "partition-like" structure where coherence bites.

**Core algorithm to implement (V1):**
1. **Coherence residual as a feature and a penalty.** Take your model's implied probabilities across linked markets (e.g., P(win) from ML vs. P(cover) from spread vs. implied margin distribution). Define a coherence violation: the degree to which the joint prices imply an arbitrage/inconsistency (e.g., spread and total imply a margin distribution that contradicts the ML price). Penalize it in training with a one-sided hinge — the direct port of `λ_σ max(0, −σ)²`.
2. **Calibration head.** Train a small net that takes (raw model probs, market probs, coherence-violation feature) → calibrated coherent probability vector, with loss = log-loss vs. realized outcomes + λ·coherence_penalty. Optionally *hard-project* onto the coherent set at inference (closed form) and compare to the soft-penalty version — this directly replicates the paper's constrained-vs-unconstrained ablation.
3. **Residual augmentation for thin regimes.** NBA analog of "new inlet conditions" = under-modeled game states (blowouts, back-to-backs, high-injury games, playoff intensity). Baseline profile = your Elo/RAPM prior; residual = observed deviation of realized outcomes from prior in well-sampled games; synthesize training rows for thin regimes as `prior(thin) + kNN-sampled residual + noise`. Measure whether calibration in thin regimes improves — this is the paper's headline generalization claim, ported.

**How it plugs in:**
- **nba-modeling:** becomes the calibration/coherence layer downstream of RAPM+Elo.
- **SharpLab:** the coherence-violation detector *is a signal generator* — flag games where the market's own linked prices are incoherent, or where your calibrated coherent vector diverges from market. Backtest against CLV: does betting the side your coherent model likes beat the close?
- **Reusable infra:** the soft-penalty + hard-projection + residual-augmentation training harness is a clean, generic module.

**Minimal V1 (do this):** One sport (NBA), 2–3 linked markets (ML/spread/total), coherence penalty, calibration head, residual augmentation for one thin regime, backtest vs. CLV. Everything runs on the SharpLab VPS on historical data.

**Tempting-but-skip V2:** Synthesizing volatility scenarios from *live order books*. Prediction-market order-book data (Polymarket/Kalshi) is a different beast, live-streaming infra, and the "volatility scenario synthesis" is where the analogy is thinnest — the paper's residual trick assumes a smooth analytic baseline (laminar flame) that order books don't have. Also skip: running your own LMSR market maker. Fun demo, zero betting edge.

### Time with Claude

- **Phase 0 — data plumbing (2–3 evenings):** join nba-modeling outputs + SharpLab odds/closing lines into a per-game linked-market table with realized outcomes and CLV labels.
- **Phase 1 — coherence math (1 weekend):** define the coherence-violation metric across ML/spread/total, plus the closed-form projection. This is the intellectually load-bearing part; get it exactly right.
- **Phase 2 — calibration head + penalty (1 weekend):** small net, log-loss + hinge penalty, the constrained-vs-unconstrained ablation (this is the paper's money plot, reproduced on your data).
- **Phase 3 — residual augmentation (3–4 evenings):** kNN residual sampling for one thin regime, measure calibration lift.
- **Phase 4 — backtest vs. CLV + writeup (1 weekend):** the go/no-go. Does it beat the close?

**Total: ~3–4 weekends part-time.** The coherence metric and honest backtest are the real work; the ML plumbing is fast with Claude.

### Direct benefits

- **Potential real edge:** market-incoherence detection is a legitimately underexploited signal in linked NBA markets; if your calibrated joint vector beats the close on CLV, that's a shippable betting edge, not a toy.
- **Better calibration in thin regimes:** if residual augmentation works, nba-modeling gets more trustworthy in exactly the spots (blowouts, injuries) where it currently drifts.
- **Reusable SharpLab infra:** a generic calibration + coherence layer you can point at any sport/market.
- **Portfolio / viral potential:** "I ported a combustion-physics entropy constraint to sports-betting market-making" is a genuinely great blog post *if the backtest is honest and positive* — the cross-domain framing is the kind of thing that travels.
- **Fun:** the constrained-vs-unconstrained ablation is a satisfying, concrete "the physics term matters" plot to reproduce.

### Why do it

- The two portable ideas (soft coherence penalty, residual augmentation) map onto real, unsolved problems in your stack: joint calibration and thin-regime generalization.
- You already own all the data (nba-modeling + SharpLab + CLV), so the marginal cost is low and the backtest is trustworthy.
- Market incoherence across linked NBA markets is real and exploitable; this gives you a principled detector.
- Strong narrative for a viral writeup; strong reusable infra either way.

### Why NOT do it

- **The core analogy is weak where it counts.** In combustion, the hard constraint (σ ≥ 0) is expensive/non-obvious, so a soft penalty is genuinely clever. In prediction markets, *coherence is trivial to enforce exactly* (softmax/LMSR/simplex projection, closed form). So you're importing a soft-penalty technique to solve a problem whose hard version is one line of numpy — the "physics-constrained surrogate" framing is partly **decorative**. Be honest: the entropy penalty is the paper's crown jewel and it doesn't transfer with much force.
- **Red-team failure mode:** you build a beautiful coherence-penalty training loop, and then discover the market is *already* coherent enough (books arb their own linked lines fast), so the exploitable incoherence signal is tiny, sub-vig, and dies after transaction costs. You'll have reproduced the paper's ablation on your data and gotten a pretty plot — and no edge. The whole thing collapses to "calibration layer with a fancy name."
- **Coherence ≠ edge.** Making *your* predictions coherent doesn't make them *right*. The paper's constraint prevents blow-up, not error; the analog prevents you from making incoherent bets, but coherent-and-wrong loses money just as fast.
- **The order-book V2 (the actually-novel-sounding part) is where the paper helps least** — no smooth baseline to residual-decompose against, plus live-infra overhead. The tempting viral hook is the least defensible part technically.

**Verdict:** Worth a scoped V1 *only if* you treat it as a market-incoherence signal-mining project (does incoherence predict CLV?) rather than a physics-surrogate project. The physics framing is a good blog hook and a decent source of two techniques, but the paper's central result (a hard-to-enforce thermodynamic constraint) does *not* strongly transfer, because coherence is cheap here. Go in for the CLV backtest, not for the entropy penalty.

---

## #15 — NBA Rotation Optimizer: Multi-Scale Minutes vs. Degradation

### The paper, technically

The paper is **Jennings, Zavala & Avraamidou, "A Multi-Scale Optimization Framework for Grid-Integrated Electrolysis"** (arXiv:2607.09512, math.OC). It has nothing to do with basketball — it's about running a 2.2 MW water electrolyzer as a flexible electricity load. But the *structure* of its optimization is the thing worth stealing, and it's a genuinely clean piece of engineering, not decorative math.

**What it actually does.** It builds one giant **MILP** (mixed-integer linear program) that jointly decides two things that live on wildly different timescales:
- **Hour-by-hour**: should the device run at full power, sit in standby, or shut off, given hourly day-ahead electricity prices?
- **Year-by-year**: when to pay a big lump sum to replace the degraded stack?

The trick is that these are *not* solved separately. They're coupled through a **degradation state variable** that accumulates from the hourly decisions and drives the multi-year replacement decision.

**The multi-scale discretization.** Time is a lexicographic tuple `(m, d, i)` — year `m`, day `d`, hour `i` — all in one ordered index set. That single index set is what lets one solver see both the 8,760-hours-a-year detail and the 22-year arc simultaneously. The 22-year instance is ~1.54M variables (770k binary), ~2.1M constraints, solved to <1% MIP gap in Gurobi.

**The core state equation (the whole idea in one line).** Efficiency `a_t` degrades as a function of what you did:

```
a_t = a_{t-1} − γ·δ_op·x_t^on − δ_start·x_t^start        (normal hour)
a_t = a_{t-1} − γ·δ_op·x_t^on − δ_start·x_t^start + α⁰·z_m − v_m   (at a replacement decision point)
```

- `x_t^on` = 1 if running that hour → each running hour costs you a bit of permanent efficiency (`δ_op`).
- `x_t^start` = 1 on a cold start → each cold restart costs a discrete chunk (`δ_start`).
- `z_m` = 1 if you replace the stack that year → efficiency snaps back toward the fresh value `α⁰`.
- `v_m` is a McCormick auxiliary that linearizes the product `(α⁰ − a_{t-1})·z_m` (replacement "tops up" from wherever you currently are, and the product of a continuous state and a binary is nonlinear, so it gets **McCormick-enveloped** into linear constraints).

Production `h_t = ϕγ·w_t + βγ·x_t^on` is likewise a bilinear efficiency×on-decision term linearized via McCormick (`w_t`). The objective is discounted NPV: `−CAPEX + Σ_m (1+ρ)^{−m}(REV − REPEX − OPEX)`, with daily hydrogen demand as a hard floor (`Σ_i h ≥ σ`) and one-mode-per-hour (`x^on + x^off + x^sb = 1`).

**The headline result** — and the reason this is worth adapting — is *counterintuitive*: **strategically flexible operation reduces cumulative degradation and extends stack lifetime by up to 2 years**, while cutting lifetime electricity cost ~33%. Being smart about *when* to run doesn't just save money on inputs; it makes the asset last longer. The sensitivity analysis is honest too: startup degradation turned out economically negligible (warm starts dominate), initial efficiency dominated NPV, and they bluntly conclude $1/kg LCOH is *not* reachable by market arbitrage alone.

**The isomorphism to NBA rotations.** Map the pieces:

| Electrolyzer | NBA |
|---|---|
| Hourly on/off/standby | Per-game: play heavy / play light / rest (DNP) |
| Efficiency `a_t` | Player freshness / health capital |
| `δ_op` (per-hour wear) | Per-minute fatigue/injury-hazard accrual |
| `δ_start` (cold-start hit) | Back-to-back / high-minute-spike penalty |
| Stack replacement `z_m` | Roster move: trade / sign / promote from G-League |
| Daily H₂ demand floor | Per-game "must field a competitive lineup" / win-now constraint |
| Electricity price signal | Game importance × opponent strength (marginal value of a win) |
| NPV over 22 years | Expected wins / playoff equity over multiple seasons |

The counterintuitive result maps directly: **strategically resting stars in low-value games can both bank regular-season wins where they matter AND extend a player's healthy career** — the same "flexibility extends lifetime" claim, in a domain where it's an actual live debate (load management).

### Prerequisites

- **MILP (mixed-integer linear program)** — optimize a linear objective over variables where some are 0/1 decisions (play/rest, trade/keep). The whole spine of the project.
- **McCormick envelopes** — the standard way to turn a product of two variables (e.g. freshness × minutes-played) into linear constraints so an MILP solver can handle it. You'll need this for any "wear-per-minute scales with current freshness" term.
- **Multi-scale / lexicographic time indexing** — putting `(season, game, stint)` into one ordered index so a single solve reasons across all horizons at once. This is the paper's actual innovation and the part you copy verbatim conceptually.
- **State-transition (recursive) constraints** — modeling a stock that accumulates: `health_t = health_{t-1} − wear + recovery`. Basic but load-bearing.
- **Net present value / discounting** — future wins/health worth less than present ones; a discount factor `(1+ρ)^{−m}` per season.
- **Survival / hazard modeling** — to *estimate* the `δ` coefficients: injury probability as a function of minutes load, age, back-to-backs. (Cox proportional hazards or a gradient-boosted hazard model.) This is where your real data work lives.
- **Warm-starting / rolling-horizon decomposition** — a 5-season, per-game MILP can blow up; you solve a coarse full-horizon relaxation, then re-solve fine detail game-by-game. Needed only if V1 gets slow.

### Implementation outline

**Data sources.**
- **nba_api** (stats.nba.com wrapper) — per-game minutes, box scores, rest days, schedule. Free, Python-native.
- **Injury data** — Pro Sports Transactions / community injury CSVs, or scrape official injury reports for the survival model's training labels.
- **Your own `nba-modeling`** — RAPM+Elo already gives you **player value per minute** and **team strength**, i.e. the exact `ψ` price signal the paper feeds in. This is the plug: your ratings *are* the "electricity price."
- **Schedule** — game dates → back-to-backs, 4-in-6 stretches → `x^start`-analog spike penalties.

**Core algorithm (the V1 build).**
1. **Fit the degradation coefficients.** Train a hazard model: P(injury or effectiveness-drop next game) ~ f(rolling minutes load, age, days rest, B2B). Extract `δ_op` (hazard per minute) and `δ_spike` (extra hazard from B2Bs). This is the empirical core — get this defensible and the whole thing has teeth.
2. **Build the MILP** in Pyomo or `python-mip` / OR-Tools, index `(season, game, player)`.
   - Decision vars: minutes bucket per player per game (rest / limited / normal / heavy), binary rest indicator.
   - State: `health_p,t = health_p,t−1 − δ_op·minutes − δ_spike·b2b + recovery·rest`, floored at 0 (retirement/season-ending injury absorbing state).
   - Objective: maximize discounted expected wins = Σ over games of (lineup value from RAPM) × (game importance weight) − penalty for injury-risk realized.
   - Constraints: roster minutes must sum to 240/game; per-player max load; "field a competitive lineup" floor (the H₂ demand analog).
   - Linearize value×availability with McCormick where needed.
3. **Solve** with Gurobi (free academic license) or CBC/HiGHS (open). One team, one season first (~82 games) — that's tiny and solves in seconds.
4. **Output**: an optimal rest schedule + a "value of resting player X in game Y" table.

**How it plugs in.**
- Consumes `nba-modeling` ratings directly (they're the price signal).
- Feeds **SharpLab**: the immediate betting edge is a **player-availability / minutes-projection model that anticipates load management *before* the injury report drops** — that's raw closing-line value on player props and team totals. The optimizer tells you which stars a *rational* team *should* rest; markets misprice actual rest.
- Portfolio: a clean interactive "rotation optimizer" viz is very SciBowl.Live-adjacent front-end work and eminently shippable/viral.

**Minimal V1 vs. tempting-but-skip V2.**
- **V1**: One team, one season, deterministic. Fixed injury-hazard coefficients from a fitted model, RAPM as value. Produce a rest schedule and a props-edge signal for SharpLab. This is a weekend-scale, genuinely useful thing.
- **V2 to skip (for now)**: Full multi-season, stochastic trades/roster-moves-as-replacement, opponent-reactive game theory, and the full 5-year `(m,d,i)` mega-MILP. The paper needed 1.5M variables and Gurobi 13 to do the multi-year version; you get 90% of the betting edge from V1's single-season deterministic solve. The "roster move = stack replacement" analogy is the cool part intellectually but it's where the model gets speculative and un-validatable (you can't backtest counterfactual trades cleanly). Build it only as a portfolio flex, not for edge.

### Time with Claude

- **Phase 0 — data + hazard model (1 weekend):** wire up nba_api, build the minutes/rest/injury dataset, fit and sanity-check the survival model for `δ` coefficients. This is the real work.
- **Phase 1 — the MILP (1 weekend):** Pyomo model, single team/season, wire in RAPM values, solve, produce rest schedule. Claude makes the MILP boilerplate near-instant; your time goes to getting constraints economically sane.
- **Phase 2 — SharpLab integration (2-4 evenings):** turn optimizer output into a minutes/availability prop signal, backtest against historical closing lines to see if there's real CLV.
- **Phase 3 (optional) — viz + share (1 weekend):** interactive front-end, publish to share.djiang.xyz.

**Realistic total for a shippable, edge-producing V1: 2-3 weekends part-time.** The multi-season V2 would add 1-2 weeks and is not where the money is.

### Direct benefits

- **Real betting edge (the actual prize):** a load-management *anticipation* model. If your optimizer says a rational front office rests Star X in a low-leverage game on a B2B, and the market hasn't priced it, that's CLV on player props, team totals, and alt-lines — exactly SharpLab's mandate.
- **Reusable infra:** a clean MILP-over-time scaffold (state accumulation + McCormick + discounting) you can repoint at any "flexibility vs. wear" problem later. The hazard-model pipeline also strengthens `nba-modeling` on its own.
- **Leverages what you already have:** RAPM+Elo *is* the price signal — you're not building the hard part from scratch.
- **Portfolio / viral potential:** "I built the optimal NBA rest schedule and here's which stars teams *should* sit" is a shippable, debatable, shareable artifact. Load management is a hot fan/media topic.
- **Fun:** the counterintuitive "resting extends careers AND wins more" result is a genuinely interesting claim to reproduce in a new domain.

### Why do it

- The paper's method transfers *cleanly and non-trivially* — this is a real structural isomorphism (accumulating wear-state coupling short decisions to long ones), not a forced metaphor.
- V1 is small and fast to build, and produces a concrete SharpLab signal you can immediately backtest for CLV.
- It compounds your existing stack rather than starting cold.
- The core insight is empirically testable: does anticipating rational rest beat the market? You'll know within a backtest.

### Why NOT do it

- **The whole edge lives in the `δ` coefficients, and they're hard to estimate.** Injury hazard as a function of minutes is noisy, confounded (good players play more *and* are managed more carefully), and data-sparse. If the hazard model is garbage, the optimizer is confidently wrong — the classic red-team failure mode: **beautiful MILP wrapped around a fantasy degradation curve.** The paper had lab-measured voltage-degradation numbers; you have observational injury data with heavy selection bias. This is the single biggest risk.
- **Teams don't optimize NPV — they optimize politics, star egos, and playoff seeding under a salary cap.** The paper's actor (a plant operator) is rational; NBA coaches are not clean utility maximizers. Your "what a rational team should do" may diverge from what markets should price, weakening the edge.
- **The market may already be efficient here.** Load management is heavily watched; sharp books adjust props fast on injury-report news. Your edge only exists in the *window before* the report — narrow, and possibly already arbed by faster injury-news bots.
- **The V2 multi-season/roster-move layer is a rabbit hole** with no clean backtest, high solve cost, and near-zero incremental betting value. Easy to over-invest in the intellectually satisfying part that doesn't pay.
- **Honest verdict:** the paper's math genuinely supports the project *structure* (not decorative), but the payoff hinges entirely on whether your injury-hazard estimates beat the sportsbook's. Build V1 cheaply, validate CLV early, and kill it fast if the backtest is flat.