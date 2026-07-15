# arXiv Ideation — Best Bets & Whimsy

Mined a week of fresh arXiv drops (mostly 2607.xxxxx, July 2026) across AI safety, security, causal inference, biophysics, robotics, and quantitative methods — hunting for papers whose *actual results* make a buildable tool or research bet newly possible. Below: 20 serious plays ranked by conviction (with the basketball/poker/games math bets flagged as the heart of this project), a whimsy corner of the delightful ones, and one pick I'd start tonight.

## Top Picks

**1. Look-Ahead Leak Detector for Sports Betting Backtests — `tool` (2607.04958v1)** 🏀♠️
Static analysis that types every data source with an availability timestamp and certifies that no future data leaks into past decision epochs — a real "your edge isn't fake" certificate for quant bettors.
*Why now:* First formal result that certification is tractable — undecidable in general, but a sound linear-time type-and-effect system covers exactly the joins, point-in-time reads, and windowed aggregations betting models use.
*Strongest angle:* The dominance is not marginal. Differential two-run detectors miss 54.5% of planted leaks, window-tiling misses **all 33 of 33**, this system misses zero — and the undecidability proof is a permanent moat no test-suite approach can ever close.
*Biggest risk:* The value-independent fragment is a hard ceiling; any conditional data availability (injury report valid iff filed before a dynamically-shifting game time) falls outside the decidable zone, and practitioners hit that wall fast. Annotation friction on real codebases is unaddressed.
**This is the single most load-bearing math-meets-betting bet in the batch** — it's the one where the paper's theorem does the work, not the pitch.

**2. Competing-Risks Player Availability Model for NBA Betting — `tool` (2607.09431v1)** 🏀
Model NBA player availability as three competing terminal events (injury / foul-out / coach's decision) using cause-specific CIF, giving unbiased "probability this player logs X more minutes" for props and DFS.
*Why now:* `comprisk` ships Fine-Gray subdistribution hazards + Aalen-Johansen in a sklearn-compatible API running **10–22x faster than R** — killing the Python-to-R round trip that made real-time betting use impossible.
*Strongest angle:* Statistically correct in a non-obvious way — censoring foul-outs when modeling injuries provably biases the CIF upward. Public play-by-play data makes this a genuine weekend build; DFS prop markets are inefficient and update on discrete foul events.
*Biggest risk:* Coaching decisions aren't truly terminal (a benched player returns), so you need an arbitrary proxy ("benched 4+ min") that may inject more noise than the bias fix removes. `comprisk` is alpha with an unstable API, and books price foul trouble live within seconds.

**3. Sportsbook Sharp-Money Detector via Influence Diagnostics — `tool` (2607.09250v1)** 🏀♠️
High-dimensional leave-one-out influence diagnostics flag which historical bets your edge model is most fragile on — a robustness filter, not a signal, that downsizes bets resembling high-influence games.
*Why now:* The paper's high-dim (n≈d, e.g. 1500 games / 400 features) result is exactly the proportional regime where classical LOO influence breaks and the corrected limiting measure applies — quantifying *which* samples drive the model.
*Strongest angle:* ~200 lines of Python on top of any existing logistic betting model, theoretically grounded, complements CLV workflows instead of replacing them. Using influence as a *position-sizing filter* sidesteps the overreach.
*Biggest risk:* It's model-introspective — it tells you where your model is fragile, not where the market is wrong. The leap from "high-influence game" to "mispriced game" needs an unstated transfer step; Gaussian design is likely violated by line-movement features.

**4. Order-3 Causal Leakage Detector for Prediction Market Signal Stacking — `tool` (2606.26835v1)** ♠️
Detects when combining three trading signals creates backtested alpha that vanishes live — the Bernstein-triple case where each pair is safe but the triple bleeds future information.
*Why now:* The paper *proves* order-3 obstruction is invisible to every pairwise admissibility screen, and gives a concrete permutation-calibrated 5-step algorithm (200 perms, code available) with controlled false positives.
*Strongest angle:* "Three signals pairwise safe but jointly poisoned" is a memorable, trust-destroying diagnostic a quant will immediately share — and it fills a gap no existing PM toolkit touches. Inputs map directly to Kalshi/Polymarket history.
*Biggest risk:* The "causal leakage" is filtration-theoretic anticipative coupling, not pipeline look-ahead bias — most users will expect it to catch sloppy backtest bugs and instead get an exotic joint dependency requiring careful continuous-to-binary translation. Audience is hundreds of people globally.

**5. Epstein-Zin Bankroll Manager for Sports Bettors — `tool` (2607.09461v1)** ♠️🏀
Recursive-utility bankroll sizing that separates drawdown aversion from patience — letting a bettor tune "how much I hate cold streaks" independently from "how much I discount future profit," unlike Kelly's forced log-utility.
*Why now:* CEFOL makes EZ dynamic programming tractable with occasionally-binding hard constraints (max-bet limits, reserve floors) without penalty hacks — exactly the real limits platforms impose, and unavailable in prior EZ solvers.
*Strongest angle:* Every semi-pro who quietly runs 0.25x Kelly "because it felt too aggressive" is doing EZ informally; this makes it principled. Behaviorally accurate model of how bettors actually experience risk.
*Biggest risk:* CEFOL accuracy *degrades near binding constraints* — precisely where max-bet limits and floors trigger, i.e. when stakes are highest. And every output is only as good as noisy edge estimates. Addressable audience is genuinely small.

**6. Entity-Attribution Verifier for Sports Betting Research RAG — `tool` (2607.09349v1)** 🏀
Catches "deceptive grounding" in RAG research tools — where a model cites a real doc but applies Jaylen Brown's splits to a Tatum query, passing every hallucination check while sending the bettor the wrong way.
*Why now:* Paper quantifies it precisely: 7.8% DG deployed, **13.6% for recently-approved entities** (≈ trade acquisitions / rookies with sparse data), and entity-attribution verification hits 97% precision / 98.7% recall.
*Strongest angle:* The 13.6% spike maps exactly onto the highest-value sports moments (rookies, trades, injury returns) where bettors most want AI help. The ablation gives a clean before/after test harness on a real NBA/NFL RAG — an easy, convincing demo.
*Biggest risk:* Source result is clinical pharma RAG; sports text is messier (box scores name many players incidentally), so attribution is fuzzier than drug-name matching. "Cheap to bolt on" undersells adding a 3-step LLM pass per query in a real-time DFS context. Narrow market.

**7. Sports Betting Causal Graph Builder for Injury/Lineup Data — `tool` (2607.09348v1)** 🏀
DKCD-style domain-guided causal discovery over beat-reporter text to surface latent chains ("starting PG out → backup usage spike → 3PT volume drops → under") that generic LLMs miss without sport anchoring.
*Why now:* DKCD's mechanism — retrieve domain knowledge to discover latent factors, then annotate structured data — maps cleanly onto sports, where causal chains are expert-known but buried in freetext.
*Strongest angle:* Run it **offline** over historical archives to mine stable latent confounders (travel fatigue, practice load, chemistry) and freeze the DAG as a durable, hard-to-replicate prior powering a lightweight live layer. Node F1 0.77 vs 0.41 on latent factors is the load-bearing gain.
*Biggest risk:* Results are entirely synthetic medical text with fabricated ground truth — no validated transfer, and sports has no ground-truth DAG to check against. The full live pipeline is far too slow for CLV windows that close in minutes.

**8. Sports-Tracking Coreset Engine — `tool` (2607.09490v1)** 🏀
Dimension-free Fréchet-distance coresets compress a full season of player trajectories to a tiny weighted subset that clusters players by movement style in milliseconds, with incremental updates as games arrive.
*Why now:* First **dimension-free** Fréchet coresets — prior sizes scaled with ambient dimension; the lines-preserving terminal embedding removes that, so multi-joint pose tracking (d=50+) compresses as cheaply as a 1D signal.
*Strongest angle:* Coresets compose, so streaming maintenance is algorithmically principled, not hand-waved. The dimension-free win matters most for rich pose embeddings, not just (x,y,t).
*Biggest risk:* The O(k·ε^−2−z·**ℓ²**·log²m) size has a center-complexity-squared term that's the killer — real season-long movement patterns need high ℓ, degrading the "tiny subset" promise. Paper's experiments used n=16 gas-sensor curves, so sports-scale validation is entirely absent. (Scored 6 for a reason — furthest from validated of the sports bets.)

**9. Automated Tier-1 SOC Triage Agent at $0.10/incident — `tool` (2607.09176v1)**
SherAgent's query-filter backtracking auto-closes or escalates SIEM alerts with a full causal chain, at <$0.10 and <4 min vs the 30+ min analysts spend tracing provenance by hand.
*Why now:* Real production deployment at a major Internet corp — 92.2% end-to-end on **53,849 real alerts** (not DARPA synthetics), 96% spot-check verified, 63.7% over SOTA, with unit economics from actual API spend.
*Strongest angle:* Unusually credible for this paper class; the backtracking insight solves a documented failure (dependency explosion) that DepImpact/ATLAS genuinely miss. Even a narrow provenance/APT module is a real MSSP offering.
*Biggest risk:* The "drop-in for Splunk/Elastic" claim is architectural fiction — the stack is proprietary ClickHouse+OCSF, covers only 5 attack categories, and 61.8% of failures come from log-retention gaps that *worsen* in the mid-market it targets. No open-source release exists.

**10. Secret-to-Door Incident Response Triage Tool — `tool` (2607.09011v1)**
Dual-agent extraction over Slack/Jira/email incident corpora returns ranked (secret, door, evidence) triples by blast radius — not "a token leaked" but "this token opens prod AWS for service X."
*Why now:* The detection-agent-plus-review-agent pairing hits 2x the secret-door recovery of a single agent and 3x regex recall — the minimum bar for noisy artifacts.
*Strongest angle:* Genuine unaddressed gap — TruffleHog/GitGuardian scan repos and CI, none operate on Slack/Jira/email where IR teams burn hours. 4–40s latency is production-viable for async triage.
*Biggest risk:* The pitch **overstates cross-document correlation** — the paper processes each doc independently, so a token in message 1 and the account name in message 100 won't link, which is the whole value prop. Eval is synthetic; TruffleHog already does live blast-radius for repos.

**11. AI Agent Risk Scorecard for Enterprise Procurement — `tool` (2607.09586v1)**
Encodes TrustX ARC's 12-dimension rubric into a wizard that outputs a three-tier risk rating + mapped controls + a shareable PDF audit trail for vetting agentic-AI vendors.
*Why now:* The paper ships a fully-specified rubric (three labeled tiers per dimension, exact elevation rules — any 3 → Tier 3, avg ≥1.5 → Tier 2, autonomy L5 → Tier 3), all directly encodable. EU AI Act + SR 26-2 create board-level demand.
*Strongest angle:* Nothing requires interpretation — a dev could wire the wizard in a weekend. The timestamped PDF audit trail is the real value for legal/procurement, not the score.
*Biggest risk:* Authors already host the canonical tool at arc.responsible.ai — any third-party encoding faces a legitimacy problem and must differentiate on VRM integrations, not on being a scorer. Rubric subjectivity ("Blast Radius," "Aggregation Risk") undermines the "repeatable instrument" claim and creates dispute liability.

**12. Personalized Neurostimulation Parameter Search for Retinal Prosthetics — `research` (2607.04063v1)**
Fit patient-specific Hodgkin-Huxley models from minutes of MEA recording, then use differentiable simulation to predict responses to thousands of untested stimulation patterns — cutting prosthesis calibration from hours to <10 min.
*Why now:* Fitting HH from **extracellular-only** recordings (previously thought to need invasive intracellular access) via differentiable sim + SBI is a real methodological advance; 90.6% spike prediction beats independent-site (85.8%) and MLP (85.9%).
*Strongest angle:* Authentic clinical bottleneck (Argus II: 30–90 trials × 60 electrodes × sessions), right validation tissue (macaque 512-electrode array), and it correctly names the enabling moment — differentiable biophysics × SBI maturing together.
*Biggest risk:* Large, unaddressed ex-vivo→in-vivo gap — isolated retina has no chronic electrode drift, no progressive degeneration; the paper concedes translation needs interface-drift handling. Validated only up to 3 simultaneous electrodes. Commercial base is thin and shrinking (Second Sight bankrupt, Pixium acquired).

**13. Reaction-Network Constraint Layer for Drug Metabolism Hypothesis Generation — `tool` (2607.08003v1)**
A dev library wrapping LLM calls with a hard graph-constraint layer — the model can only emit valid edges in a supplied metabolic network (CYP450 rules), yielding ranked mechanistically-coherent ADMET hypotheses without hallucinated pathways.
*Why now:* Paper shows network invariance is what lets frontier models produce **experimentally confirmed** catalyst hypotheses (prospective 3x selectivity gain) rather than plausible nonsense; MetXBioDB/KEGG give machine-readable reaction graphs.
*Strongest angle:* Prospective wet-lab confirmation is a real result, not a benchmark. Tight analogy — CYP450 rules are already reaction SMARTS — and "hard constraint + LLM ranking/narrative" fills a gap pure cheminformatics tools don't (they enumerate but don't rank/explain).
*Biggest risk:* The constraint mechanism is underspecified — if "invariance" is a prompt or post-hoc filter rather than constrained decoding, the transfer claim weakens. RDKit/BioTransformer already enumerate CYP450 products deterministically; big-pharma bioinformatics teams would build this in-house.

**14. Interpretable Email Attachment Screener with Tsetlin Rule Export — `tool` (2607.09290v1)**
Email-gateway plugin runs a Tsetlin Machine on every PDF attachment, producing a human-legible rule ("JS=present, OpenAction=present, embedded_fonts=absent") as a defensible audit record instead of an opaque confidence score.
*Why now:* RIT-PDFMal-2026 shows TMs match neural nets (98%+) while the interpretability *is the model*, not a post-hoc layer — usable where "the AI decided" fails a HIPAA/SOX/FedRAMP audit. 2.853µs inference adds negligible milter latency.
*Strongest angle:* Genuine underserved compliance/legal-discovery gap; Proofpoint/Mimecast return scores, not defensible per-file decision records. Feature-name mapping is straightforward (42 named features in Table I).
*Biggest risk:* The "one-line human-readable rule" is **not what the paper delivers** — it shows heatmaps and raw propositional clauses over binary indices; the readable-clause layer is unbuilt product engineering. Random Forest scores 98.28% (beats TM's 98.02%) and is similarly interpretable, weakening the whole differentiator.

**15. Epidemic Targeting Mismatch Dashboard for Public Health Policy — `tool` (2607.03979)**
Quantifies the angle between the "source eigenvector" (who spreads) and "burden eigenvector" (who dies) for a population's contact matrix — exposing the protect-spreaders-vs-protect-vulnerable tradeoff as a single inspectable number.
*Why now:* Paper proves misalignment is bounded by a Kantorovich inequality in only q_max/q_min, ships 177 national contact matrices, and reports a median 26° mismatch / **1.84x IFR regret** — reframing a policy debate as a measurable choice.
*Strongest angle:* Closed-form, reproducible, and buildable in a weekend (Prem matrices in CSV, Levin IFR tables, eigenvector is a NumPy one-liner). For Gavi/PATH advocacy, "Country X has a 38° mismatch, targeting kids raises IFR 1.6x" is a powerful communication instrument.
*Biggest risk:* Output is a structural cross-sectional index, not a dynamic death-count simulation — sophisticated agencies already grasp the tradeoff via SEIR variants, so a cautious reviewer may dismiss it as "interesting theory, not operational guidance." Lives in the research-to-decision-support gap.

**16. Behavior-Prior RL Fine-Tuner for Robotic Assembly QA — `tool` (2607.09590v1)**
Drop-in post-training wrapper adding PAC-ACT's behavior-prior-constrained RL to any pick-and-place VLA — adapting a foundation policy to a shop's jigs without full retraining or catastrophic forgetting.
*Why now:* 46x reduction in dangerous force events on Contour while matching ACT's footprint (2.30 vs 2.27 GB, 88ms) — the exact latency/memory tradeoffs blocking industrial VLA adoption.
*Strongest angle:* Hardware economics is the hook — 100% vs ACT's 60% on Contour while pi0.5 needs 44 GB just to run. Contract manufacturers who can't afford VLA-class hardware get a genuine economics argument. The chunk-level KL+MSE prior is principled, not decorative.
*Biggest risk:* **Simulation-only** — authors flag sim-to-real is unvalidated, and contact-force dynamics are notoriously hard to transfer. A drop-in safety pitch resting entirely on sim results for the one metric (contact force) that matters most is fragile; a 5x degradation collapses the story.

**17. pH-Triggered Drug Release Simulator for Dendrimer Nanomedicine — `research` (2607.08623v1)**
A charge-regulation + coarse-grained toolkit to screen histidine-peptide tail compositions on PAMAM dendrimers in silico for optimal DNA-release profiles in acidic tumor (pH 6.5) vs neutral tissue (pH 7.4).
*Why now:* Validated against three orthogonal methods (potentiometry + precipitation + CG sim), with the non-trivial finding that **collective multi-dendrimer effects** are essential — single-conjugate sims can't explain condensation, so any credible simulator must operate at that resolution.
*Strongest angle:* Histidine's clean pH switch makes the concept chemically grounded, not hand-wavy; siRNA/mRNA delivery is a live, well-funded space where faster iteration has clear value.
*Biggest risk:* Big gap between "validated model" and "usable screener" — CG-with-charge-regulation is expensive and needs expert per-sequence parameterization, and multi-dendrimer ensembles every run are slow/fragile. Without a broad force-field library it degrades into a bespoke modeling service; pharma demands wet-lab validation loops anyway.

**18. Adhesion Regime Classifier for Robotic Grippers on Wet Surfaces — `tool` (2607.08213v1)**
Ingests tip modulus, fluid viscosity, and approach speed, then places a soft-gripper tip on a two-parameter phase diagram (softness × Deborah number) and returns the adhesion regime and force-time scaling law — killing empirical trial-and-error.
*Why now:* The visco-elastohydrodynamic regime had **no analytical description** before this paper; the unified phase diagram and Deborah-number scaling are genuinely new, so this tool literally couldn't exist earlier.
*Strongest angle:* Minimal, measurable input space (three standard characterization outputs) with immediately actionable output. Legitimate timing.
*Biggest risk:* Peak-force prediction needs prefactors, not just scaling exponents — if the theory gives t^(1/3) but the prefactor requires a numerical sim or material-specific calibration, the tool collapses from a calculator into a regime classifier only. That's the credibility hole.

**19. Idiom-Aware Multilingual Contract Comparison Tool — `tool` (2607.09576v1)**
Uses the paper's conceptual feature graph to cluster contractual idioms cross-lingually by schema, flagging where a clause ("best efforts" / "reasonable endeavors") lacks a semantically equivalent counterpart in translation.
*Why now:* Jaccard conceptual graphs beat XLM-R on cross-lingual idiomatic matching (78% vs 54%, NMI 0.76 vs 0.45), and LLM-generated binary annotations replicate human labels (0.82 acc) — scaling the graph without per-pair expert annotation.
*Strongest angle:* Interpretable structural mismatch flags ("obligation=HIGH here, MODERATE in translation") are exactly what lawyers can act on and embeddings can't provide. Real, expensive pain in multilateral deal docs.
*Biggest risk:* Domain gap — the 9 cognitive-linguistic features (containment, valence) fit "spill the beans," not legal semantics (conditionality, burden of proof, jurisdiction-specific precedent). Extending the schema reintroduces the annotation burden the paper claims to eliminate; 20 idioms/language is far too thin for legal coverage.

**20. Long-Document Diligence Engine for Prediction Markets — `tool` (2607.09328v1)** ♠️
Traces WILDTRACE's 7 evidence geometries (causal / temporal / narrative chains) across a full long-form source — SEC filing, CBO report, WHO situation report — to surface the dispersed factors that move a "Will X happen by Y" contract.
*Why now:* WILDTRACE operationalizes 7 source-internal geometries from Pearl's causal hierarchy — a concrete vocabulary for multi-hop reasoning over document structure rather than needle-in-haystack lookup.
*Strongest angle:* Genuinely better domain fit than the paper's own test docs — a CBO debt-ceiling report really does encode forward chains and abductive inferences across dispersed passages, and naive RAG consistently fails at exactly this.
*Biggest risk:* **WILDTRACE is a benchmark, not a method** — it names and measures the geometries but ships no extraction system, retrieval architecture, or algorithm. You'd build the entire multi-hop engine from scratch, using the taxonomy only as design vocabulary. That build gap is where this lives or dies.

## Whimsy Corner

**The Rashomon Party Game: Everyone Is Technically Right (2607.09502v1)** — Everyone writes their own explanation of the same weird image, then you reveal the paper *proves* a whole non-empty set of explanations are all equally valid. Hold up every card: "statistically, you are all correct." Prizes for most surprising, not most accurate.

**Temporal Mood Routing Mirror (2607.09537v1)** — A bathroom mirror that watches you for 30 days and routes your morning face into "smooth trend," "nonstationary drift (get some sleep)," or "phase-aligned recurrence (it's Monday, you always make this face)." Useless, delightful, and grounded in real temporal decomposition.

**The World's Most Unfair Bar Bet (2607.09532v1)** — Bet a friend $5 they can't find two wildly different inputs to your net with near-identical outputs. They can't — the paper proves it's cryptographically impossible without the backdoor key. Then you produce the key and conjure them instantly. Honest disclosure optional.

**The Expert Disagreement Oracle (2607.09456v1)** — Ask three models a question; if they agree, you get an answer, if they fight beyond threshold the oracle goes silent with dignity and flashes a red flare. Silence-with-integrity turns out more trustworthy than a confident hallucination. Built on ATR's active-rejection mechanism.

**Fovea Cam: The Camera That Ignores 50% of Everything (2607.09480v1)** — A photobooth running a Foveated Dynamic Transformer that drops 50% of tokens — but the *right* 50%, so faces stay razor-sharp while backgrounds dissolve into impressionist smears. The punchline: the full-res camera would've been worse at finding you.

**The Semantics Survive! Adversarial Art Generator (2607.09450v1)** — Corrupt a photo into Pollock-grade chaos, then run RITA's optimal-transport alignment to prove the meaning's still in there. Get a certificate: "Despite looking like a Jackson Pollock, this image is still, provably, a cat." Frame it next to the mess.

**Buzz-O-Meter: The Human Confidence Game Show (2607.09623v1)** — Hear a trivia clue word-by-word, buzz when *your* confidence crosses 50%, lose points proportional to how early you were wrong. QANTA's pyramid calibration ported to drunk humans — the loudest know-it-all statistically goes broke first.

**Bidding War for Your Brain: The Agora Task Auction Clock (2607.09600v1)** — Type a hard task and watch cartoon specialists (The Logician, The Poet, The Excel Gremlin) submit sealed competence bids, clear the auction, and execute. Agora's incentive-compatible mechanism made visible as a chaotic market floor.

**The Gentlest Robot Handshake in History (2607.09590v1)** — A gallery robot arm (PAC-ACT, 46x lower peak force) offers its hand to strangers — uncannily soft, like shaking hands with a very confident cloud. Live force readout, and a leaderboard ranking how gently *you* shook back.

**Idiom Karaoke (2607.09576v1)** — Act out a Finnish idiom as charades; others guess using idioms from *their own* language — and they're usually right, because the paper shows idioms cluster by conceptual schema, not language. You never learn Finnish; the human body already knows the schema.

**The One-Example Sommelier (2607.09562v1)** — Photograph one wine label you loved; TCLA nudges every other wine's ranking relative to that single anchor — no retraining, just logit correction. Less a sommelier than a compass where your one sip is the north pole. "I can teach this phone your taste with one photo."

**The Concept Thesaurus for Your Untranslatable Feeling (2607.09576v1)** — Describe a vibe ("that cozy dread of Sunday evening"), it encodes binary conceptual features and walks the Jaccard graph to surface the closest idiom in each of eight languages — showing Portuguese and Mandarin independently named your exact feeling and cluster in the same community.

## If I Had To Build One Tonight

**Competing-Risks Player Availability Model for NBA Betting (2607.09431v1).**

Of the math-meets-basketball bets, this is the one where every ingredient is actually on the table *tonight*: the data is public (NBA play-by-play foul and lineup events), the statistics are correct in a way the market underprices (censoring competing terminal events provably biases the CIF), and `comprisk`'s 10–22x speedup over R is the specific thing that turns an academic curiosity into an in-game pipeline. Unlike the leak detector (#1, higher conviction but needs annotated backtest codebases to be worth anything) or the offline causal graph (#7, slow and unvalidated), this one produces a testable number against a live, inefficient market — DFS player-minute props — within one sitting.

**Concrete first step:** pull one season of play-by-play, label each player-stint's terminal event as injury / foul-out / bench (proxy: benched 4+ consecutive minutes), fit a Fine-Gray subdistribution hazard in `comprisk` for "minutes remaining," and backtest the cause-specific CIF against historical DFS "player logs 30+ min" prop lines. If the concordance index clears the closing line on even one event type, you have a real edge to widen; if it doesn't, you've spent one night and killed it cheaply. The whole point is the fast falsification loop — and the foul-out-as-terminal-event framing is either right or it isn't, and you'll know by morning.