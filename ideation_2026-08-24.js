export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-24',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.15351v1',cat:'cs.LG',title:"Spectral Rank Certification for Foundation Model Adapters"},
    {id:'2608.16158v1',cat:'cs.AI',title:"A Tree-Structured Approach for Phishing Template and Attacker Attribution Analysis"},
    {id:'2608.09507v2',cat:'cs.CL',title:"Learning Preference Adaptation for Large Language Model Personalization via Verbal Reinforcement Learning"},
    {id:'2607.26589v1',cat:'cs.CR',title:"CDN Tsunami: Exploiting HTTP/3-HTTP/1.1 Conversion for DoS Attacks"},
    {id:'2606.17297v1',cat:'cs.DS',title:"Scalable K-clique Estimation with Differential Privacy"},
  ],
  [
    {id:'2608.01109v1',cat:'math.CO',title:"Congruent Triangular Faces, Reflections Allowed: Universal Realization and the Minimum Face Count in Problem B22"},
    {id:'2607.17901v1',cat:'math.OC',title:"Finding Fair Draws for Incomplete Round Robin Tournaments"},
    {id:'2607.16132v1',cat:'math.PR',title:"Fluctuation dynamics in randomly advected Navier-Stokes equations below critical scaling"},
    {id:'2607.06167v1',cat:'math.NT',title:"An improved upper bound on the Ruzsa number"},
    {id:'2311.04475v1',cat:'q-fin.PM',title:"Portfolio Construction using Black-Litterman Model and Factors"},
  ],
  [
    {id:'2308.13289v1',cat:'q-fin.TR',title:"JAX-LOB: A GPU-Accelerated limit order book simulator to unlock large scale reinforcement learning for trading"},
    {id:'2602.00355v2',cat:'econ.EM',title:"Coping with Inductive Risk When Theories are Underdetermined: Decision Making with Partial Identification"},
    {id:'2607.07967v1',cat:'stat.ML',title:"Expressivity and Statistical Trade-offs in Diffusion Policy Learning"},
    {id:'2602.12547v1',cat:'q-bio.NC',title:"A consequence of failed sequential learning: A computational account of developmental amnesia"},
    {id:'2505.02276v1',cat:'q-bio.BM',title:"Liapunov exponent distributions and maps for multiple parameter logistic equation. Application to DNA and RNA sequences"},
  ],
  [
    {id:'2410.09964v2',cat:'q-bio.GN',title:"Lower-dimensional projections of cellular expression improves cell type classification from single-cell RNA sequencing"},
    {id:'2603.00709v1',cat:'q-bio.QM',title:"A Closed-loop Framework to Discriminate Models Using Optimal Control"},
    {id:'2511.01905v2',cat:'q-bio.PE',title:"The impact of nonheritable variation in division rates on population growth across environments"},
    {id:'2605.25368v1',cat:'physics.chem-ph',title:"Bayesian Estimation of Spectroscopic Parameters: Application to the Atomic Nitrogen Bound-Bound System"},
    {id:'2605.29162v2',cat:'cond-mat.soft',title:"Passive memory reshapes active persistence"},
  ],
  [
    {id:'2607.02216v1',cat:'cond-mat.stat-mech',title:"Exact amplitude relations for diffusion-limited aggregation"},
    {id:'2604.01019v1',cat:'physics.soc-ph',title:"Car Dependency in Urban Accessibility"},
    {id:'2608.15337v1',cat:'cs.LG',title:"The Physical Cutoff Does Not Restore Homogenization: Phase-Dependent Burning in the Strain G-Equation"},
    {id:'2608.16156v1',cat:'cs.AI',title:"TRCA: Transition-wise Rubric Credit Assignment for Long-horizon LLM Agents"},
    {id:'2608.09444v1',cat:'cs.CL',title:"Depth-adaptive Inference of Looped Language Models via Continuous Depth Batching"},
  ],
  [
    {id:'2607.26574v2',cat:'cs.CR',title:"Attack Ensembles Expose a Safety-Utility Trade-off in Black-Box Guard Defenses Against Encoded VLM Jailbreaks"},
    {id:'2606.17285v3',cat:'cs.DS',title:"An Adaptive Proximal Framework for Stochastic Weakly Convex Optimization"},
    {id:'2608.01080v1',cat:'math.CO',title:"Dualizing and canonical complexes on finite posets II: properness"},
    {id:'2607.17892v1',cat:'math.OC',title:"Thermal management optimization of Battery Electric Vehicles via hierarchical NMPC with CMO-trained Neural Models"},
    {id:'2607.16092v1',cat:'math.PR',title:"Dimension-invariant uniform consistency of the empirical spatial distribution function and its associated spatial depth estimator"},
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
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) -- demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)

return { ideas: allIdeas }
