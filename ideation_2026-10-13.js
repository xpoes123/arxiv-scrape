export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-13',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.09075v1",cat:"cs.LG",title:"Towards AI-Generated Music Plagiarism Detection as a Version Identification Problem",summary:"The rapid expansion of text-to-music generative models challenges traditional paradigms of music creation and intellectual property. Plagiarism in this context is rarely an absolute mathematical binary, but an ambiguous threshold negotiated over harmonic structure, melodic contours, or overall perceived stylistic character. We introduce COPYCAT, a benchmark derived from real-world plagiarism cases, yielding 350,654 evaluation pairs, and show a supervised coordinate-wise embedding shift framework raises F0.5 from 0.612 to 0.803."},
    {id:"2610.07803v1",cat:"cs.AI",title:"ThinkFuse: Trajectory-Aware Test-Time Fusion for Small Reasoning Models",summary:"Small reasoning models (SRMs) generate extended chain-of-thought trajectories but often fail to recover once reasoning enters an erroneous path. Existing test-time fusion methods rely on local fusion signals; ThinkFuse instead fuses across whole trajectories, tracking which reasoning paths are recoverable and which are doomed."},
    {id:"2610.02142v1",cat:"cs.CL",title:"Keyword Harnesses Fail Open: A Cheap Diagnostic Ladder for Tool-Use Claims in Small Language Models",summary:"Keyword-matching benchmarks can credit small models for tool use they never actually perform. The authors document a false positive in a matched pair of Spanish security language models and propose a ladder of strict, cheap diagnostics to catch benchmark gaming."},
    {id:"2609.26316v1",cat:"cs.CR",title:"Design and Evaluation of a Controlled Post-Alert Incident Orchestration and Response Subsystem Using a Rule Engine and a Local LLM",summary:"A controlled post-alert incident orchestration subsystem for educational information systems, separating deterministic classification, contextual analysis, human approval, and technical execution via a rule engine plus a local LLM."},
    {id:"2608.09472v1",cat:"cs.DS",title:"Algorithmics for Safe Bicycle Network Design with Bounded Detours in Rural Areas",summary:"Introduces the Safe Bicycle Network with Bounded Detours problem: given safe/unsafe edges, upgrade costs, terminal pairs, a budget, and a detour factor, find which roads to upgrade so cyclists get safe routes without huge detours."},
  ],
  [
    {id:"2608.10040v1",cat:"cs.DS",title:"Online Discrepancy Minimization for Sub-Gaussian Inputs via Regularization and Restriction",summary:"Vectors arrive one at a time and each must immediately be assigned a sign +-1, aiming to keep the running signed sum small in max-norm. A polynomial-time potential-based algorithm achieves near-optimal discrepancy for sub-Gaussian inputs, with no knowledge of the future."},
    {id:"2609.26851v1",cat:"math.CO",title:"A New Method that can Generate Ramsey Colourings for Eight and Thirteen Colours",summary:"Representations for relation algebras corresponding to edge colourings of complete graphs. Prior methods found suitable colourings for n up to 2000 colours except for the two stubborn holdouts n=8 and n=13; a new 'Fixing' method finally cracks both."},
    {id:"2609.26014v1",cat:"math.CO",title:"Equal subset sums and close divisors",summary:"For k>=2, studies the supremum exponent a such that almost every integer n has k distinct divisors within a tight multiplicative window of relative length (log n)^-a, connecting to random sets formed by selecting each integer i independently with probability 1/i."},
    {id:"2609.18848v1",cat:"math.OC",title:"On the Role of Tie-Breaking Rules in the Convergence of Fictitious Play for Symmetric First-Price Auctions",summary:"Continuous-time fictitious play in 2-bidder symmetric first-price auctions with discrete values and bids. Exhibits a minimal instance (two bidders, two values, three positive bids) where fictitious play's convergence hinges entirely on how ties get broken."},
    {id:"2609.14923v1",cat:"math.PR",title:"Moderate deviations and laws of the iterated logarithm for geometric functionals in the sparse regime",summary:"Moderate deviation principles and laws of the iterated logarithm for geometric/topological functionals of k-point connected components (think: random geometric graphs) in the sparse regime, at both measure-valued and vector-valued levels."},
  ],
  [
    {id:"2609.14922v1",cat:"math.PR",title:"Steady-State Convergence of Stochastic Approximation",summary:"For constant-stepsize stochastic approximation, iterates converge in distribution to a stationary law depending on stepsize alpha. This paper nails the limit of the scaled stationary distribution as alpha->0, beyond i.i.d./additive-noise cases, with better convergence rates."},
    {id:"2609.08608v2",cat:"math.NT",title:"Reduction Modulo Binary Polynomials with Logarithmic Feedback Depth",summary:"Polynomial modular reduction is central to binary finite-field arithmetic (crypto, coding theory). Top-down shift/XOR folding is cheap when the nonleading support is sparse, but a tap near the leading term creates a long feedback chain; this reformulates the recurrence for logarithmic depth."},
    {id:"2305.11319v5",cat:"q-fin.PM",title:"Risk Budgeting Allocation for Dynamic Risk Measures",summary:"Develops risk budgeting (a risk-diversification portfolio strategy) where risk is measured by a dynamic, time-consistent risk measure rather than a static one, generalizing the classical Euler risk-contribution decomposition to a multi-period setting."},
    {id:"2305.09046v2",cat:"q-fin.PM",title:"Convex optimization over a probability simplex",summary:"Proposes the Cauchy-Simplex iteration: maps the probability simplex to the positive quadrant of a unit sphere and runs a Riemannian-flavored gradient descent there, giving a clean fast scheme for portfolio-weight-style optimization problems."},
    {id:"2304.02472v2",cat:"q-fin.TR",title:"Learning to Predict Short-Term Volatility with Order Flow Image Representation",summary:"Predicts short-term realized volatility of Bitcoin by turning raw limit-order-flow into an 'image' representation and feeding it to a learned model, tackling the anti-persistence and noisiness of crypto price action."},
  ],
  [
    {id:"2304.06037v2",cat:"q-fin.TR",title:"Quantitative Trading using Deep Q Learning",summary:"Applies reinforcement learning (Deep Q-Learning) to quantitative trading, framing trade decisions as a sequential control problem that aims to generate profit directly from market state rather than predicting prices first."},
    {id:"2602.19287v1",cat:"econ.EM",title:"Asymptotic theory of range-based multipower variation",summary:"A realized range-based multipower variation theory for estimating return variation and drawing jump-robust inference about the diffusive volatility component from high-frequency price records, improving on standard range-statistics."},
    {id:"2602.19279v2",cat:"econ.EM",title:"Distributional Effects in Censored Quantile Regressions with Endogeneity and Heteroskedasticity",summary:"Tackles quantile regression when the outcome is censored, a regressor is endogenous, and errors are heteroskedastic all at once -- a combination that breaks standard estimators but shows up constantly in real economic data (e.g. wages, insurance claims)."},
    {id:"2609.14802v1",cat:"stat.ML",title:"From matrix inversion to constraints: provably tighter confidence regions for importance weights in label shift",summary:"Importance weights correct for label shift in domain adaptation, but finite-sample uncertainty undermines them. Reframes the estimation as a constrained problem instead of matrix inversion, yielding provably tighter confidence regions on the weights."},
    {id:"2609.14675v1",cat:"stat.ML",title:"PU classification under Non-SCAR: clustering-assisted logistic model with oversampling enhancement",summary:"Positive-Unlabeled classification when the 'selected completely at random' assumption fails (i.e. labeled positives are a biased sample). Proposes a clustering-assisted logistic model with Lasso variants and oversampling to correct the bias."},
  ],
  [
    {id:"2603.05418v1",cat:"q-bio.NC",title:"The Spatial and Temporal Resolution of Motor Intention in Multi-Target Prediction",summary:"Studies how precisely and how early human motor intention (reach direction and target) can be decoded from neural/kinematic signals, relevant to rehabilitation and assistive prosthetics/BCI tech."},
    {id:"2503.20291v2",cat:"q-bio.BM",title:"CryoSAMU: Enhancing 3D Cryo-EM Density Maps of Protein Structures at Intermediate Resolution with Structure-Aware Multimodal U-Nets",summary:"A structure-aware multimodal U-Net deep learning approach that sharpens cryo-EM 3D density maps at intermediate (4-8 Angstrom) resolution, making automated protein structure determination more reliable."},
    {id:"2407.05055v1",cat:"q-bio.GN",title:"Metagenomic analysis revealed significant changes in cattle rectum microbiome and antimicrobial resistome under fescue toxicosis",summary:"Fescue toxicosis (from a common pasture grass fungus) stunts cattle growth and reproduction; this metagenomic study tracks how it reshapes the gut microbiome and antibiotic-resistance gene profile before/after exposure."},
    {id:"2603.12307v1",cat:"q-bio.QM",title:"SHREC: A Spectral Embedding-Based Approach for Ab-Initio Reconstruction of Helical Molecules",summary:"A spectral-embedding method for reconstructing helical biomolecule structures from cryo-EM data from scratch, exploiting the inherent helical symmetry that standard ab-initio pipelines struggle with."},
    {id:"2510.20500v1",cat:"q-bio.PE",title:"Fitness inference tested by in silico population genetics",summary:"Given full genome sequences of an evolving population (selection + mutation + recombination), asks whether fitness parameters and genotype fitness ranking can actually be inferred back out -- tested on simulated ('in silico') populations where the ground truth is known."},
  ],
  [
    {id:"2607.04834v1",cat:"physics.chem-ph",title:"Hidden Gauge Freedom in Complex-Pole Hierarchical Equations of Motion",summary:"Complex-pole hierarchical equations of motion (HEOM) simulate open quantum systems exactly but suffer numerical instabilities from a non-Hermitian Liouvillian. The paper uncovers a hidden gauge freedom in the formalism that can be exploited to stabilize the simulations."},
    {id:"2607.07102v1",cat:"cond-mat.soft",title:"Spontaneous patterning of cell size on curved surfaces",summary:"A vertex model for cells living on arbitrarily curved surfaces (like a developing embryo or a tumor) shows that curvature alone can spontaneously trigger patterns in cell size, without any chemical signaling needed."},
    {id:"2608.25629v1",cat:"cond-mat.stat-mech",title:"Closed-form hard-sphere thermodynamics under nanoscale confinement: from equations of state to unmixing forces",summary:"Standard hard-sphere equations of state are thought to break down under nanoscale confinement; shows the failure is purely geometric, not thermodynamic, and gives a closed-form parameter-free fix mapping apparent to effective packing fraction."},
    {id:"2604.25597v2",cat:"physics.soc-ph",title:"Generating Synthetic Citation Networks with Communities",summary:"A systematic comparison of generators for realistic synthetic citation/patent/dependency networks (nearly acyclic directed graphs with community structure), useful for benchmarking community-detection and graph-viz algorithms."},
    {id:"2610.07800v1",cat:"cs.AI",title:"Novice Reliance Calibration in AI-Assisted Decision Making: The Role of Explanations and Self-Assessment",summary:"Studies how novices calibrate trust in an AI assistant's advice when there's no immediate feedback loop to learn from, and whether explanations plus self-assessment prompts help them rely on the AI the right amount (not too much, not too little)."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, math, decision-theory, gambling, games tags have mild positive community reception recently (soft bias, don't force it); ai has mild positive too; no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
