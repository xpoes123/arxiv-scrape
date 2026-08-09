export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-08',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.01284v1',cat:'cs.LG',title:'Training nGPT'},
    {id:'2608.02056v1',cat:'cs.AI',title:'TBSG-Net: Temporal Bipartite Scene Graph Network for Fine-Grained Video Moment Retrieval'},
    {id:'2607.26397v1',cat:'cs.CL',title:'Knowledge before Reasoning: EC-Reason-Bench, a Training-Free Diagnostic Benchmark for LLM Reasoning'},
    {id:'2607.13230v1',cat:'cs.CR',title:'AI-Native Insurance for Agentic AI: Pricing, Underwriting, and End-to-End Automation'},
    {id:'2606.02325v1',cat:'cs.DS',title:'Terminal Steiner tree problem: Complexity and Algorithms'},
  ],
  [
    {id:'2607.16424v1',cat:'math.CO',title:'Weighted Counting Formula and 2n/21 Lower Bound for Induced Subgraphs with Prescribed Degrees'},
    {id:'2607.06742v1',cat:'math.OC',title:'Linear-Quadratic Mean Field Games with Hybrid Local-Global Interactions on Manifolds'},
    {id:'2607.02489v2',cat:'math.PR',title:"Almost Supermartingale Extensions of Olivier's Theorem"},
    {id:'2606.26440v1',cat:'math.NT',title:"Optimal homological vanishing: cancellation of character sums and Patterson's conjecture"},
    {id:'2312.13057v3',cat:'q-fin.PM',title:'Cross-Currency Heath-Jarrow-Morton Framework in the Multiple-Curve Setting'},
  ],
  [
    {id:'2311.02088v1',cat:'q-fin.TR',title:'Combining Deep Learning on Order Books with Reinforcement Learning for Profitable Trading'},
    {id:'2602.00355v2',cat:'econ.EM',title:'Coping with Inductive Risk When Theories are Underdetermined: Decision Making with Partial Information'},
    {id:'2606.30328v1',cat:'stat.ML',title:'Extrapolating from Regularised Solutions for Solving Ill-Conditioned Linear Systems in Machine Learning'},
    {id:'2602.13368v3',cat:'q-bio.NC',title:'The Influence of Width Ratios on Structural Beauty in Male Faces'},
    {id:'2505.14166v2',cat:'q-bio.BM',title:'Functional bottlenecks can emerge from non-epistatic underlying traits'},
  ],
  [
    {id:'2411.02796v2',cat:'q-bio.GN',title:'Specialized Foundation Models Struggle to Beat Supervised Baselines'},
    {id:'2602.21648v1',cat:'q-bio.QM',title:'Multimodal Survival Modeling and Fairness-Aware Clinical Machine Learning for 5-Year Breast Cancer Risk Prediction'},
    {id:'2511.04276v1',cat:'q-bio.PE',title:'Vector Traits Shape Disease Persistence: A Predator Prey Approach to Dengue'},
    {id:'2605.14687v1',cat:'physics.chem-ph',title:'Generalized Suzuki-Chin Factorization in Bosonic Path Integral Molecular Dynamics'},
    {id:'2605.19795v4',cat:'cond-mat.soft',title:'Function, Complexity and Thermodynamics in Adaptive and Intelligent Soft Matter Systems: An Information-Theoretical Framework'},
  ],
  [
    {id:'2606.22092v1',cat:'cond-mat.stat-mech',title:'Effect of rewiring for a sandpile model on a directed network'},
    {id:'2604.06224v2',cat:'physics.soc-ph',title:'The new Geological Age that never was or the multiple layers of the Transientocene'},
    {id:'2411.00614v2',cat:'q-bio.GN',title:'Fast and scalable Wasserstein-1 neural optimal transport solver for single-cell perturbation'},
    {id:'2606.30310v1',cat:'stat.ML',title:'Highly Data Parallelizable Estimation of the Sliced-Wasserstein Distance Using Cumulative Distribution Functions'},
    {id:'2606.21681v1',cat:'cond-mat.stat-mech',title:'Heavy-Tailed Dispersal Kernels from Stopped Subdiffusive Fractional Brownian Motion'},
  ],
  [
    {id:'2607.03235v1',cat:'math.PR',title:'A Galton-Watson estimate for Dyson series'},
    {id:'2606.24919v2',cat:'cond-mat.stat-mech',title:'A Gauge-Theoretic Formulation of Nambu Non-equilibrium Thermodynamics'},
    {id:'2605.15073v2',cat:'physics.chem-ph',title:'Fast contracted Clebsch-Gordan tensor products for equivariant graph neural networks'},
    {id:'2312.10749v1',cat:'q-fin.PM',title:'A new behavioral model for portfolio selection using the Half-Full/Half-Empty approach'},
    {id:'2607.06762v1',cat:'math.OC',title:'Spectral Initialization and Certification for Power System Angle Estimation'},
  ],
]

const SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper: { type: 'string' },
          pitch: { type: 'string' },
          cool: { type: 'number' },
          buildable: { type: 'number' },
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable'],
      },
    },
  },
  required: ['ideas'],
}

function batchPrompt(batch) {
  const list = batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are 5 papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper (or combination of papers if a crossover idea is stronger), propose 2-4 ideas total across the batch, each tagged with one type:
- project: something buildable as a tool/library/service
- startup: a business angle
- youtube: a video/explainer concept
- demo: an interactive web toy that lets someone FEEL the paper's actual mathematical/scientific result

Score each idea 1-10 on:
- cool: how cool/shareable/wow is it
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) — demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
