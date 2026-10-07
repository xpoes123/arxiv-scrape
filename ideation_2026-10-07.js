export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-07',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.04162v1",cat:"cs.LG",title:"Principled Top-k Selection for Language Models with Hybrid Gradients",summary:"Selecting the best k items out of m candidates is a critical component of modern LLM systems, such as document selection in RAG and expert routing in Mixture-of-Experts."},
    {id:"2610.06919v1",cat:"cs.AI",title:"Anchor Divergence for Semantic Geometry in Contrastive Learning",summary:"How semantic context determines geometry in learned vector representations; similarity is typically measured using cosine similarity, which provides a single fixed geometry."},
    {id:"2609.37832v1",cat:"cs.CL",title:"Can a Cacheable Decision Model Follow Rules?",summary:"Certo is a small non-generative decision model (Qwen3-4B) that scores candidate actions from text and returns a probability instead of generating an answer, reading state + rules + each candidate action."},
    {id:"2609.20650v1",cat:"cs.CR",title:"Multi-center Medical Data Mining with FL-Net",summary:"Federated learning enables collaborative training without sharing patient-level data; most studies remain simulations. Analyzed 14 FL frameworks against 5 derived requirements."},
    {id:"2608.05022v1",cat:"cs.DS",title:"Exact simulation of diffusions and improved algorithms for log-concave sampling",summary:"Exact simulation of diffusions via rejection sampling on path space using unbiased density-ratio estimators from Girsanov's theorem, applied to underdamped Langevin diffusion."},
  ],
  [
    {id:"2609.22708v1",cat:"math.CO",title:"Chromatic symmetric functions for annular webs",summary:"A combinatorial definition of chromatic symmetric functions for annular webs, proving symmetry via a web analogue of the Shareshian-Wachs involution."},
    {id:"2609.14053v1",cat:"math.OC",title:"Characterizing Identifiability and Generalization for Inverse Receding-Horizon LQR",summary:"Objective inference in receding-horizon linear-quadratic regulator settings, given sequential state-action observations where each action is the first step of a replanned horizon."},
    {id:"2609.11039v2",cat:"math.PR",title:"Uniform-in-Time Boltzmann Mean-Field Limits for Anchored Binary Opinion Dynamics",summary:"A continuous-time opinion model where agents interact in pairs, each has a fixed anchor, and opinions update via a possibly nonlinear rule with random inputs."},
    {id:"2609.04424v1",cat:"math.NT",title:"Multiple zeta values in lambda-rings",summary:"A framework for multiple zeta values in lambda-rings unifying classical multiple zeta values and multiple q-zeta values."},
    {id:"2306.02848v1",cat:"q-fin.PM",title:"HireVAE: An Online and Adaptive Factor Model Based on Hierarchical and Regime-Switch VAE",summary:"A deep-learning factor model for quantitative investment that adapts online to regime switches via a hierarchical regime-switch VAE."},
  ],
  [
    {id:"2304.11010v1",cat:"q-fin.TR",title:"Invariance properties of maximal extractable value",summary:"A formalism for reasoning about trading on decentralized exchanges and a particular form of MEV representing the total arbitrage opportunity extractable from a block."},
    {id:"2602.19290v1",cat:"econ.EM",title:"Distributional Discontinuity Design",summary:"Regression discontinuity/kink designs are typically analyzed via mean effects even when treatment changes the shape of the whole outcome distribution; introduces distributional discontinuity design."},
    {id:"2609.05683v1",cat:"stat.ML",title:"Nonparametric Hypothesis Testing of High-dimensional Clustering With Application to Single-cell RNA Data",summary:"Tests whether observed cluster separation in scRNA-seq is genuine biological heterogeneity or arises from sampling variability."},
    {id:"2603.03414v2",cat:"q-bio.NC",title:"Cognitive Dark Matter: Measuring What AI Misses",summary:"The jagged intelligence landscape of modern AI arises from a missing training signal — brain functions that meaningfully shape behavior yet are hard to observe in text — 'cognitive dark matter'."},
    {id:"2503.21681v3",cat:"q-bio.BM",title:"A Comprehensive Benchmark for RNA 3D Structure-Function Modeling",summary:"A benchmark for the relationship between RNA structure and function as deep learning models for nucleic acid structure advance."},
  ],
  [
    {id:"2407.11201v3",cat:"q-bio.GN",title:"SMDP: SARS-CoV-2 Mutation Distribution Profiler",summary:"Rapid estimation of mutational histories of unusual lineages; SARS-CoV-2 usually evolves at a constant rate, but lineages sometimes arise with higher-than-expected mutation counts."},
    {id:"2603.12307v1",cat:"q-bio.QM",title:"SHREC: A Spectral Embedding-Based Approach for Ab-Initio Reconstruction of Helical Molecules",summary:"Cryo-EM reconstruction of helical molecular assemblies via spectral embedding, addressing a case that's hard for standard ab-initio pipelines."},
    {id:"2510.25777v1",cat:"q-bio.PE",title:"Evaluating Stochastic CTMC vs deterministic models for rabies persistence in human/dog populations",summary:"Comparative analysis of Stochastic Continuous-Time Markov Chain and deterministic models for rabies persistence where dogs serve as viral reservoirs."},
    {id:"2607.00166v1",cat:"physics.chem-ph",title:"Irreducible Representations as Multireference Indicators for Diradicaloid Systems",summary:"Multireference behavior in molecules arising from a small gap between frontier orbitals mixing closed/open-shell configurations; a new diagnostic via irreducible representations."},
    {id:"2607.04997v2",cat:"cond-mat.soft",title:"Inhomogeneous thinning of dielectric membranes under uniaxial tension and electric fields",summary:"Electromechanical instabilities in dielectric elastomers from coupling between mechanical deformation and electric fields, analyzing non-uniform thinning."},
  ],
  [
    {id:"2608.22939v1",cat:"cond-mat.stat-mech",title:"Universal equilibrium magic in quantum many-body systems",summary:"'Magic' (nonstabilizerness), the resource enabling universal quantum computation, studied at equilibrium thermalization in isolated many-body systems."},
    {id:"2604.24035v1",cat:"physics.soc-ph",title:"A phase transition in monetary function explains expansion without inflation",summary:"Large monetary expansions don't necessarily cause price inflation; proposes monetary function is phase-dependent, newly issued base money occupying different 'phases'."},
    {id:"2610.04156v1",cat:"cs.LG",title:"Trajectory-Derived Confidence for Reliable, Resource-Aware Clinical Text-to-SQL Agents",summary:"LLM agents for clinical text-to-SQL reason over multiple steps but can't assess trust in their own reasoning; derives confidence from the reasoning trajectory itself."},
    {id:"2610.04054v1",cat:"cs.AI",title:"Reward-DAgger: Robot-Gated Interactive Imitation Learning with General-Purpose Progress-Based Reward Models",summary:"Generalist robot control policies degrade in unseen environments; uses a progress-based reward model to gate when the robot should ask for human correction."},
    {id:"2609.37788v3",cat:"cs.CL",title:"A Proposed Rubric for Evaluating Expressed Clinical Reasoning in LLM Responses",summary:"A rubric for assessing expressed clinical reasoning in model responses drawing on medical-education assessment frameworks (ART, SCT, Key Feature Problems, OSCE)."},
  ],
  [
    {id:"2609.20601v1",cat:"cs.CR",title:"Weather Data Spoofing Attacks on Rain-Adaptive Millimeter-Wave Frequency Selection in V2X",summary:"Connected vehicles select mmWave carrier bands based on sensed rainfall; shows this weather-awareness is itself an attack surface."},
    {id:"2608.05331v1",cat:"cs.DS",title:"On the Approximability of Boolean Max-k-CSP",summary:"A polynomial-time algorithm achieving a (k/2^k)-approximation for maximizing satisfied constraints of an arbitrary boolean CSP with arity k."},
    {id:"2609.22465v1",cat:"math.CO",title:"Collision Positivity for Three-Variable Symmetric Monomial Inequalities",summary:"For equal-degree exponent partitions λ≻γ≻μ with at most 3 parts, studies positivity of J_λ+J_μ-2J_γ over symmetric monomial orbit sums."},
    {id:"2609.14235v1",cat:"math.OC",title:"Optimal Deterministic First-Order Oracle Complexity for Nonconvex-Concave Minimax Optimization",summary:"Deterministic first-order oracle complexity of smooth nonconvex-concave minimax optimization over a bounded convex dual domain."},
    {id:"2609.10899v1",cat:"math.PR",title:"Quantitative universality for products of i.i.d. random matrices",summary:"Quantitative universality results for cokernels of products of i.i.d. random matrices and flags associated to k-tuples of random matrices over finite fields."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific — reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord — blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
