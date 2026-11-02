export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-09',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.07555v1",cat:"cs.LG",title:"Global Transport Couplings for Classifier-Free Guided Flows",summary:"A global class-agnostic optimal-transport coupling for conditional flow models that, combined with classifier-free guidance, consistently improves generation across domains, scales, and sampling budgets."},
    {id:"2610.06844v1",cat:"cs.AI",title:"Learning to Read the Contextual Tokens in Diffusion Transformers",summary:"Diffusion Transformers repeatedly update text tokens through multimodal attention, forming dynamic contextual tokens; this work builds a framework for reading that hidden contextual space via natural-language interrogation."},
    {id:"2608.10040v1",cat:"cs.DS",title:"Online Discrepancy Minimization for Sub-Gaussian Inputs via Regularization and Restriction",summary:"Vectors arrive one at a time and must immediately get a sign assigned to minimize the running imbalance; a polynomial-time algorithm combining norm regularization with restriction to an adaptively chosen coordinate set."},
    {id:"2609.24917v1",cat:"math.CO",title:"Magic positivity of Snapper polynomials for matroids",summary:"Studies positivity of coefficients of Snapper polynomials (from matroid/line-bundle theory) through 'magic positivity' and real-rootedness."},
    {id:"2609.17927v1",cat:"math.OC",title:"Day-ahead Coordination of Virtual Power Plants within Active Distribution Networks using Deterministic Bi-Level Optimization",summary:"A grid operator (leader) sets prices/constraints to minimize cost and voltage deviation; each Virtual Power Plant (follower) optimizes its own dispatch in response — a bilevel Stackelberg game over a power grid."},
  ],
  [
    {id:"2609.13971v2",cat:"math.PR",title:"Fractional Wiener chaos: Part 2. Interface spectral chaos",summary:"Constructs a corrected orthonormal spectral decomposition using parabolic-cylinder functions at noninteger orders, matching half-line branches at an interface."},
    {id:"2609.07714v1",cat:"math.NT",title:"The spectrum of (ξα^n) can be uncountable",summary:"A counterexample to a long-standing conjecture: the set of angles for which a geometric sequence's fractional parts fail to equidistribute can be uncountable, not just countable as previously believed."},
    {id:"2306.01660v2",cat:"q-fin.PM",title:"A systematic literature review on solution approaches for the index tracking problem in the last decade",summary:"Surveys methods for building a smaller portfolio that tracks a stock index closely while avoiding the high rebalancing cost of buying every constituent."},
    {id:"2305.00585v1",cat:"q-fin.TR",title:"Prospects of BRICS currency dominance in international trade",summary:"A mathematical influence-battle model (three competing 'species' of currency — dollar, euro, a BRICS currency) over the world trade network of 194 countries, 2010-2020."},
    {id:"2602.19705v1",cat:"econ.EM",title:"Model Selection in High-Dimensional Linear Regression using Boosting with Multiple Testing",summary:"A new high-dimensional variable-selection method combining forward stepwise boosting with a multiple-testing framework to decide which variables to add at each stage."},
  ],
  [
    {id:"2609.12463v1",cat:"stat.ML",title:"Linear Exponential Quadratic Gaussian Covariance Steering",summary:"Solves a risk-sensitive 'Schrodinger bridge' control problem: steer a system's probability distribution from one Gaussian to another over a fixed deadline, trading off risk sensitivity against control cost."},
    {id:"2603.07275v1",cat:"q-bio.NC",title:"Polarization-wave propagation as a biophysical mechanism of visual cognition",summary:"Proposes that visual cognition is driven by slow travelling 'polarization waves' of electric potential propagating across cortical tissue, modeled via a telegraph-type equation."},
    {id:"2503.23280v1",cat:"q-bio.BM",title:"Solvation enhances folding cooperativity and the topology dependence of folding rates in a lattice protein model",summary:"Monte Carlo simulations of lattice proteins show that accounting for the solvent (not just the protein chain) makes folding snap from 'intermediate states' to an all-or-nothing cooperative transition, and makes folding speed depend on a chain's topology."},
    {id:"2407.11242v3",cat:"q-bio.GN",title:"Bridging Sequence-Structure Alignment in RNA Foundation Models",summary:"A foundation model (OmniGenome) trained to align RNA sequence representations with RNA secondary structure, letting information flow both ways between the two views."},
    {id:"2603.13937v1",cat:"q-bio.QM",title:"Countershading coloration in blue shark skin emerges from hierarchically organized and spatially tuned photonic architectures inside skin denticles",summary:"Shows a shark's blue-to-white dorsoventral color gradient is produced by nanoscale photonic crystal structures inside skin denticles (not pigment cells), spatially tuned across the body."},
  ],
  [
    {id:"2510.25085v1",cat:"q-bio.PE",title:"Explorations of Epidemiological Dynamics across Multiple Population Hubs",summary:"Extends the classic SIR epidemic model with a cure and migration between multiple connected cities, simulated as a network of coupled differential equations."},
    {id:"2607.03893v1",cat:"physics.chem-ph",title:"Morphology-Property Interplay in Chemo-Mechanics of Ion-Intercalation Active Particles",summary:"A thermodynamically consistent model of how a battery particle's shape and material properties jointly control internal stress buildup during charging (lithiation)."},
    {id:"2607.07325v1",cat:"cond-mat.soft",title:"Taming nonlinear energy diffusion: The case of time-crystal energy condensates",summary:"A driven stochastic energy-diffusion model (variant of the Kipnis-Marchioro-Presutti model) where biased local collisions create a net energy flow, analyzed via a hydrodynamic limit."},
    {id:"2608.25030v1",cat:"cond-mat.stat-mech",title:"Directed walks shape a universal square-root law of entropy production rate in nonreciprocal systems",summary:"Expresses the entropy production rate of a nonequilibrium network as a quadratic form over 'nonreciprocity' (asymmetric interaction) and derives a universal square-root scaling law."},
    {id:"2604.26165v1",cat:"physics.soc-ph",title:"Power, Depletion and Energy Quality Model of Thermo-industrial Civilization",summary:"A simple dynamical model linking economic output, fossil energy depletion, and declining energy quality (EROI) for a fossil-fuel-dependent industrial civilization."},
  ],
  [
    {id:"2610.00883v1",cat:"cs.CL",title:"DeBERTa-ConPara: Attack-Aware and Deployment-Realistic Detection of AI-Generated Text",summary:"An AI-text detector designed to survive real deployment conditions: domain shift, adversarial Unicode perturbations of the text, and no target-domain labels to recalibrate the threshold."},
    {id:"2609.25256v1",cat:"cs.CR",title:"Partition-Matched Evaluation of Community Features under Distribution Shift in Android Malware Function-Call Graphs",summary:"Tests whether community/clustering structure in a malware program's function-call graph gives shift-stable classification signal beyond simple degree statistics, across 15,000 Android malware graphs."},
    {id:"2610.07553v1",cat:"cs.LG",title:"Which and When to Admit: Gradient Admission for Data-Centric Small Language Model Finetuning",summary:"Identifies three failure modes of LoRA fine-tuning (conflicting gradients, stale data selection, subspace saturation) and proposes selectively admitting only helpful gradient updates during training."},
    {id:"2610.06843v1",cat:"cs.AI",title:"Recursive Video In-Context Learning for Agentic Robot",summary:"Lets a robot-controlling LLM agent learn from a demonstration video by recursively compressing it into exactly the in-context detail needed at each decision point, instead of a fixed text log or raw video."},
    {id:"2608.09210v1",cat:"cs.DS",title:"A New Lower Bound for Online Vertex Cover under Vertex Arrivals",summary:"Proves no online algorithm can guarantee better than a 1+sqrt(e)/2 ≈ 1.824 competitive ratio for vertex cover when vertices (and their edges) arrive one at a time and must be irrevocably covered or not — beating the prior 1.753 bound."},
  ],
  [
    {id:"2609.25190v1",cat:"math.CO",title:"On the Euler transform and the floor function",summary:"Derives a closed form for the Euler transform of binomial sums weighted by the floor function, recovering known identities and proving new ones involving harmonic-type sums."},
    {id:"2609.17889v1",cat:"math.OC",title:"Bounded Integer Quadratic Programming through Parallelepiped Covers and Discrete Convic Optimization",summary:"An exact algorithm for minimizing a quadratic objective over integer points in a bounded polyhedron, with running time explicit in the number of variables/constraints and coefficient size."},
    {id:"2609.13963v2",cat:"math.PR",title:"Non-blowup of stochastic heat equations by noise",summary:"Shows that random noise can prevent the finite-time blow-up that a superlinear reaction term would otherwise cause in a heat equation — noise as a stabilizer, not just a disruptor."},
    {id:"2609.07692v1",cat:"math.NT",title:"A pencil of quadratic forms in nine variables with no member of Witt index four",summary:"An explicit 9-variable counterexample refuting a conjecture that every such 'pencil' of quadratic forms must contain one of a specific algebraic type (Witt index four)."},
    {id:"2305.18136v2",cat:"q-fin.PM",title:"Exponential Utility Maximization in a Discrete Time Gaussian Framework",summary:"Solves the discrete-time exponential-utility portfolio problem for Gaussian asset returns, including the case where the investor only learns price changes with a delay (insider/outsider information asymmetry)."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, decision-theory, math, and ai tags have mild positive community reception recently (soft bias, don't force it) -- no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
