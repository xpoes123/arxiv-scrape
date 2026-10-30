export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-14',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.13654v1",cat:"cs.LG",title:"TabReliBench: Evaluating Tabular Foundation Models Beyond Predictive Accuracy",summary:"Tabular foundation models (TFMs) are increasingly popular for strong predictive performance. Many also provide posterior predictive distributions (PPDs), whose reliability remains less studied. TabReliBench is a large benchmark assessing point prediction, distributional quality, marginal and subgroup calibration, and interval efficiency; TFM rankings change a lot depending which axis you measure."},
    {id:"2610.13438v2",cat:"cs.AI",title:"Rollout-Time Intervention: Unlocking Agentic Reinforcement Learning Beyond Policy Limits",summary:"Agent RL is bottlenecked on-policy: when a task exceeds the model's current capability, effective trajectories become sparse and training collapses. Rollout-Time Intervention (RTI) intervenes during rollout to unstick this, rather than only reshaping the reward."},
    {id:"2610.07177v1",cat:"cs.CL",title:"CLM-as-a-Judge: Evaluating an Open Contrastive Decision Model on Public Judge Benchmarks",summary:"An open contrastive decision model used as an LLM judge is statistically indistinguishable from coin-flipping on hard judge benchmarks (RM-Bench, JudgeBench), and answers every HaluEval item with one constant label -- same size reward models score far higher. A cautionary tale about trusting a cheap judge model."},
    {id:"2609.31282v1",cat:"cs.CR",title:"Resource-Optimized and Energy-Aware Agentic AI Framework Anchored on Blockchain for Secure Software Supply Chains",summary:"A blockchain-backed multi-agent security framework for the software dev lifecycle: specialised LLM agents for source integrity, SBOM/dependency analysis, CI config auditing, artifact verification, and runtime policy, all logged immutably on-chain."},
    {id:"2608.16884v1",cat:"cs.DS",title:"Improving the matrix multiplication exponent with modern optimization and AlphaEvolve",summary:"The best known bound on the matrix multiplication exponent omega comes from a hard combinatorial optimization inside the 'laser method'. This paper reformulates that optimization and throws modern solvers plus AlphaEvolve (an LLM-driven program search) at it to push the bound further."},
  ],
  [
    {id:"2609.30927v1",cat:"math.CO",title:"Bounds for Unions of Several Parts in Balanced Graph Partitions",summary:"For balanced k-partitions of a graph, bounds how many edges can possibly sit inside the union of any l of the k parts -- a generalization of min-bisection-style guarantees to multi-part unions, with an explicit tight formula."},
    {id:"2609.25345v1",cat:"math.OC",title:"Higher-Order Sensitivity Analysis of Wasserstein and Adapted Wasserstein Distributionally Robust Optimization Problems",summary:"Extends first-order sensitivity results for distributionally-robust optimization (how much does the worst-case value change if you perturb your uncertainty model slightly in Wasserstein distance) to higher-order expansions, using differential calculus on the space of probability measures itself."},
    {id:"2609.18850v1",cat:"math.PR",title:"Exponential convergence of Sinkhorn algorithm for entropy martingale optimal transport",summary:"Proves the Sinkhorn algorithm -- the iterative-rescaling workhorse behind fast optimal transport -- converges exponentially fast for the martingale-constrained version (used to calibrate option prices consistent with a no-arbitrage/martingale condition), under compact-support/convexity assumptions."},
    {id:"2609.14161v2",cat:"math.NT",title:"Quantitative linear independence for square roots",summary:"For K>=8 linearly-independent square roots of distinct integers, proves an explicit, fairly brutal lower bound on how small an integer linear combination of them can be -- i.e. how 'irrational' the combination provably is, as a function of coefficient size."},
    {id:"2305.16632v1",cat:"q-fin.PM",title:"Causality between investor sentiment and the shares return on the Moroccan and Tunisian financial markets",summary:"Tests Granger-style causality between investor-sentiment proxies (SENT, ARMS) and stock returns on two frontier emerging markets (Morocco, Tunisia), finding sentiment has weak memory but a real relationship to returns."},
  ],
  [
    {id:"2304.02180v2",cat:"q-fin.TR",title:"Optimal Trading in Automated Market Makers with Deep Learning",summary:"Models the interaction between a constant-function AMM (crypto DEX pool) and a centralized exchange, then solves an optimal-execution problem where a trader hides order flow by controlling trading rate across both venues, without approximating the market dynamics."},
    {id:"2602.20115v2",cat:"econ.EM",title:"Compound decisions and empirical Bayes via Bayesian nonparametrics",summary:"Asks whether a fully Bayesian posterior-mean rule (vs. the classic empirical-Bayes/NPMLE estimator) can match the same sharp risk guarantees in compound decision problems -- i.e. estimating many parameters at once by pooling information across them -- and shows yes, in a Gaussian setting."},
    {id:"2609.21342v1",cat:"stat.ML",title:"Robust Dual-Regularized Variable Selection under Outlier Contamination",summary:"A two-stage method (sparse median outer product of gradients) for picking out which predictors actually matter in a single-index model when the data has outliers that would otherwise hijack ordinary variable selection."},
    {id:"2603.08409v2",cat:"q-bio.NC",title:"Embodied intelligence solves the centipede's dilemma",summary:"A dynamical model of centipede locomotion combining leg-ground contact, passive body mechanics, and active lateral muscle control, probing whether the undulating body wave is actively driven or just passively resisted -- and how stepping rate/stiffness changes the answer."},
    {id:"2503.19300v3",cat:"q-bio.BM",title:"UniMoMo: Unified Generative Modeling of 3D Molecules for De Novo Binder Design",summary:"First generative framework that designs binders across multiple molecular domains at once -- small molecules, peptides, AND antibodies -- in one unified 3D geometric diffusion model, instead of needing a separate specialized model per domain."},
  ],
  [
    {id:"2407.07265v1",cat:"q-bio.GN",title:"Pseudo-perplexity in One Fell Swoop for Protein Fitness Estimation",summary:"Protein language models predict fitness (how functional/stable a mutant protein is) via masked-residue perplexity, normally requiring one forward pass per residue. This shows pseudo-perplexity for an entire sequence can be computed in a single forward pass, massively speeding up fitness scanning."},
    {id:"2603.16957v1",cat:"q-bio.QM",title:"Non-perturbative Bacterial Identification Directly from Solid Agar Plates Using Raman",summary:"Raman spectroscopy identifies bacteria directly through the unopened, inverted agar plate lid -- no sample prep -- with single-gene-level sensitivity distinguishing near-identical E. coli strains, during normal incubation."},
    {id:"2510.25777v1",cat:"q-bio.PE",title:"Evaluating the effectiveness of Stochastic CTMC and deterministic models in correlating rabies persistence in human and dog populations",summary:"Compares stochastic (continuous-time Markov chain / branching process) vs. deterministic ODE models of rabies spread between dogs and humans, deriving an explicit stochastic extinction/persistence threshold that the deterministic model can't see."},
    {id:"2607.08699v1",cat:"physics.chem-ph",title:"Detection of the Polycyclic Aromatic Hydrocarbon Phenalene (C13H10) in the Very Low Luminosity Object MC27/L1521F",summary:"First interstellar detection of the 3-ring PAH molecule phenalene outside the famous TMC-1 starless core, found instead in a very-low-luminosity protostellar object -- evidence PAHs survive/form broadly across early star formation, not just in one weird cloud."},
    {id:"2607.11960v1",cat:"cond-mat.soft",title:"Self-Healing Coordination in Cognitive Swarm Agents with Bloch-Type Perceptual Memory",summary:"Gives flocking agents a bounded 'Bloch-type' internal perceptual memory (borrowed from spin/qubit dynamics) coupled to a slow regulatory state, so the swarm can self-heal its coordination after a disruption instead of just reacting to current neighbors."},
  ],
  [
    {id:"2608.28742v1",cat:"cond-mat.stat-mech",title:"Determinant Quantum-Quantum Monte Carlo: Coherent Auxiliary-Field Sampling",summary:"A quantum algorithm (DQ2MC) that lifts the auxiliary-field sampling at the core of determinant quantum Monte Carlo (simulating strongly-correlated electron systems like Hubbard models) onto a quantum computer, avoiding ever enumerating the exponentially many classical sampling weights."},
    {id:"2604.27226v1",cat:"physics.soc-ph",title:"Ratio-Dependent Contrarian Activation in Opinion Dynamics",summary:"In the Galam majority-vote opinion model, lets 'contrarians' activate based on the local majority/minority ratio in their discussion group (not a fixed probability), derives the exact update equation for group size 3, and finds the fixed points/phase transitions analytically."},
    {id:"2610.13653v1",cat:"cs.LG",title:"A Critical Look at Power Sampling when Test Time Sharpening LLMs",summary:"RL-with-verifiable-rewards mostly just sharpens an LLM's existing output distribution rather than teaching new reasoning. Recent methods try to get that sharpening for free via MCMC/SMC sampling from a 'power distribution' (base model raised to a power) -- this paper shows those samplers actually fail to converge to the target distribution they claim to hit."},
    {id:"2610.13437v1",cat:"cs.AI",title:"Local Diagnostics of Learned Event Representations for Anomaly Detection at the HL-LHC",summary:"For model-agnostic new-physics search at the Large Hadron Collider, anomaly detection in a learned low-dimensional embedding space finds rare events but loses physical interpretability; this builds local diagnostics to recover why a flagged collision event is anomalous."},
    {id:"2610.07168v1",cat:"cs.CL",title:"A theory of platonic representations in language models",summary:"Explains why translated sentences get near-identical inner-layer representations across multilingual LLMs (the 'platonic representation hypothesis') via a theory where data has hidden hierarchical structure -- abstract levels shared across languages, surface levels language-specific -- tested on synthetic languages generated from shared probabilistic grammars."},
  ],
  [
    {id:"2609.31262v1",cat:"cs.CR",title:"Deduplication-while-Training: A Resilient Paradigm for Privacy-Preserving Cross-Client Deduplication in Federated Learning",summary:"Cross-client duplicate training data hurts federated learning and worsens memorization/privacy leaks. Existing dedup happens serially before training (fragile, no dynamic clients); this interleaves privacy-preserving dedup concurrently WITH training instead."},
    {id:"2608.16878v1",cat:"cs.DS",title:"Spectral Gaps of Hit-and-Run and Coordinate Hit-and-Run",summary:"Proves a sharp spectral-gap bound for the Hit-and-Run random walk sampler over any convex body, tying its mixing speed to the Poincare constant of the target uniform distribution -- refines decades-old convergence guarantees for one of the standard algorithms for sampling convex bodies."},
    {id:"2609.31797v1",cat:"math.CO",title:"Stability of the Courtade-Kumar inequality",summary:"Proves a stability version of the Courtade-Kumar inequality for Boolean functions: if a yes/no function's 'information' is close to the extremal dictator-function value, the function itself must be probabilistically close to an actual dictator (one-variable) function -- with sharp, dimension-free error bounds."},
    {id:"2609.25257v2",cat:"math.OC",title:"Higher-Order Approximation of Exit Functionals in Sampling-Based Stochastic Model Predictive Control",summary:"For safety-critical stochastic control (e.g. 'will the system exit a safe region before time T'), improves the numerical approximation of first-exit-time functionals used inside sampling-based MPC, reducing discretization error that otherwise directly degrades the controller's safety guarantees."},
    {id:"2609.18835v1",cat:"math.PR",title:"Degree-Free Spectral Independence for Log-Concave Holant Measures",summary:"Proves a graph-degree-independent spectral-independence bound for a broad class of statistical-physics-style measures (Holant problems, covering monomer-dimer and b-matching models), giving fast-mixing guarantees for the corresponding Glauber-dynamics sampling algorithms that don't blow up on high-degree graphs. Notably, the authors say the main proof ideas were found using GPT-5.6."},
  ],
]

const IDEA_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper_id: { type: 'string' },
          pitch: { type: 'string' },
          cool_score: { type: 'number' },
          buildable_score: { type: 'number' },
          discussion_score: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score', 'discussion_score', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

phase('Ideate')
const results = await pipeline(
  BATCHES,
  (batch, _item, idx) => agent(
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, math, decision-theory, gambling, games tags have mild positive community reception recently (soft bias, don't force it); no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
