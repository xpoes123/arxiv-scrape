export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-23',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2605.27108v1',cat:'cond-mat.soft',title:"Quantifying the liquid flow between a soap film and a vertical meniscus"},
    {id:'2607.01076v1',cat:'cond-mat.stat-mech',title:"Universal Short-Imaginary-Time Quantum Critical Dynamics Near Boundaries"},
    {id:'2608.18164v1',cat:'cs.AI',title:"Are LLMs Safe Beyond Text: Do Emojis Expose Gaps in Safety Evaluation"},
    {id:'2608.08801v1',cat:'cs.CL',title:"IDRAAK: From Multi-Agent NLP to Few-Shot Prompting for Semantic Drift Detection in Technical Requirements"},
    {id:'2607.26102v1',cat:'cs.CR',title:"A Reference-Free Score for Detecting Silent Reasoning Failures in Large Language Models"},
  ],
  [
    {id:'2606.16061v1',cat:'cs.DS',title:"Coresets for Continuous k-Center in Hyperbolic Space"},
    {id:'2608.14372v1',cat:'cs.LG',title:"Catching the Imposter: Self-Supervised Learning of Physical Coherence with Cross-Entity Feature Permutations"},
    {id:'2601.22354v1',cat:'econ.EM',title:"Model Selection in Panel Data Models: A Generalization of the Vuong Test"},
    {id:'2608.00459v1',cat:'math.CO',title:"A note on the saturation number for unions of three cliques"},
    {id:'2607.05305v2',cat:'math.NT',title:"Iwasawa invariants of sharp/flat 2-adic L-functions for quadratic twists of elliptic curves"},
  ],
  [
    {id:'2607.17595v1',cat:'math.OC',title:"Concentration and Mean-Square Bounds for Contractive Stochastic Approximation: A Unified Elementary Approach"},
    {id:'2607.15125v1',cat:'math.PR',title:"Asymptotics for the Laplace transform of the Elephant Random Walk via Schwarz-Christoffel mappings"},
    {id:'2605.24617v1',cat:'physics.chem-ph',title:"Transformer refined quantum sampling for strongly correlated electronic structure"},
    {id:'2603.29782v1',cat:'physics.soc-ph',title:"Urban mobility enables deprivation bubble breaking in Indian and Mexican cities"},
    {id:'2505.02022v2',cat:'q-bio.BM',title:"NbBench: Benchmarking Language Models for Comprehensive Nanobody Tasks"},
  ],
  [
    {id:'2410.07252v1',cat:'q-bio.GN',title:"Multilayer network approaches to omics data integration in Digital Twins for cancer research"},
    {id:'2602.11632v1',cat:'q-bio.NC',title:"CL API: Real-Time Closed-Loop Interactions with Biological Neural Networks"},
    {id:'2510.27030v4',cat:'q-bio.PE',title:"Generalizing matrix representations to fully heterochronous ranked tree shapes"},
    {id:'2603.00614v1',cat:'q-bio.QM',title:"Designing the Haystack: Programmable Chemical Space for Generative Molecular Discovery"},
    {id:'2311.04475v1',cat:'q-fin.PM',title:"Portfolio Construction using Black-Litterman Model and Factors"},
  ],
  [
    {id:'2308.13289v1',cat:'q-fin.TR',title:"JAX-LOB: A GPU-Accelerated limit order book simulator to unlock large scale reinforcement learning for trading"},
    {id:'2607.07745v1',cat:'stat.ML',title:"LiST: Lipschitz Scaling Training for Robust and Calibrated Neural Networks"},
    {id:'2608.00377v2',cat:'math.CO',title:"Schubitopes are not Ehrhart positive"},
    {id:'2607.14993v1',cat:'math.PR',title:"Sharp phase transition for percolation with short-range dependencies"},
    {id:'2607.05213v1',cat:'math.NT',title:"Integer Coefficient Power Series with Prescribed Zero Sets"},
  ],
  [
    {id:'2605.26927v1',cat:'cond-mat.soft',title:"Structure and energetics of grain boundaries in self-assembled double-gyroid block copolymer networks"},
    {id:'2607.00449v1',cat:'cond-mat.stat-mech',title:"Slow heat-driven flow in a gas of hard disks"},
    {id:'2603.29312v1',cat:'physics.soc-ph',title:"A Preliminary Theory of Infantile Dynamics"},
    {id:'2602.13325v1',cat:'q-bio.NC',title:"Graph neural networks uncover structure and functions underlying the activity of simulated neural assemblies"},
    {id:'2510.24955v2',cat:'q-bio.PE',title:"geohabnet: An R package for mapping habitat connectivity for biosecurity and conservation"},
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
