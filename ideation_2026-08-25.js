export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-25',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.18070v2',cat:'math.PR',title:"The Brownian loop-catcher"},
    {id:'2310.11987v1',cat:'q-fin.PM',title:"A Framework for Treating Model Uncertainty in the Asset Liability Management Problem"},
    {id:'2511.01122v1',cat:'q-bio.PE',title:"The Future Orchid Diversity of Great Britain and Ireland using an SDM Approach"},
    {id:'2608.11994v1',cat:'cs.CL',title:"Claim-Level Reliability Assessment for Efficient Test-Time Reasoning"},
    {id:'2608.03144v1',cat:'math.CO',title:"Reducing CMSO to Unbreakable Graphs Cannot be Computable"},
  ],
  [
    {id:'2602.24258v1',cat:'q-bio.QM',title:"A model of tuberculosis progression using CompuCell3D"},
    {id:'2608.12099v1',cat:'cs.CL',title:"RT-SEMamba: Real-Time Speech Enhancement Mamba via Progressive Knowledge Distillation"},
    {id:'2505.01919v2',cat:'q-bio.BM',title:"From Possibility to Precision in Macromolecular Ensemble Prediction"},
    {id:'2604.01019v1',cat:'physics.soc-ph',title:"Car Dependency in Urban Accessibility"},
    {id:'2607.09371v1',cat:'stat.ML',title:"Spectrally Deconfounded Gradient Boosting"},
  ],
  [
    {id:'2605.30185v2',cat:'cond-mat.soft',title:"Theory of distribution skewness effect on polydisperse random close packing"},
    {id:'2608.18482v1',cat:'cs.AI',title:"Coverage-Driven RTL Assertion Generation with Formal Exploration and Neuro-Symbolic Refinement"},
    {id:'2602.03819v1',cat:'econ.EM',title:"Global Testing in Multivariate Regression Discontinuity Designs"},
    {id:'2602.11632v1',cat:'q-bio.NC',title:"CL API: Real-Time Closed-Loop Interactions with Biological Neural Networks"},
    {id:'2604.01793v1',cat:'physics.soc-ph',title:"Not Just Large: Tall Teams Dominate East Asia\'s Scientific Production"},
  ],
  [
    {id:'2607.19647v1',cat:'math.OC',title:"On the Universality of Simple Trust-Region Algorithms"},
    {id:'2607.29199v1',cat:'cs.CR',title:"Alignment Is Local: A Paired Diagnostic for GUI Agents under User-Side Persuasion"},
    {id:'2606.18679v2',cat:'cs.DS',title:"Fair Online Resource Allocation"},
    {id:'2607.08114v1',cat:'math.NT',title:"On an inhomogeneous uniform Littlewood type problem"},
    {id:'2608.17342v1',cat:'cs.LG',title:"MoFE: A Novel Mixture-of-Experts Framework with Fourier Neural Operators for Cryptocurrency Forecasting"},
  ],
  [
    {id:'2604.00943v1',cat:'physics.soc-ph',title:"Women\'s mobility networks enable more efficient travel"},
    {id:'2607.18364v2',cat:'math.PR',title:"Evaluating the Impact of Epidemic Control via State-Dependent Markovian Switching Modeling"},
    {id:'2605.27142v1',cat:'physics.chem-ph',title:"Dyck language and fermionic second quantization: I. Theory"},
    {id:'2410.10919v2',cat:'q-bio.GN',title:"Fine-tuning the ESM2 protein language model to understand the functional impact of missense variants"},
    {id:'2607.03749v2',cat:'cond-mat.stat-mech',title:"Holographic heat engines for Schwarzschild black holes"},
  ],
  [
    {id:'2605.29967v1',cat:'cond-mat.soft',title:"Synergistic approach to probing the dynamics and mechanics of patchy soft matter"},
    {id:'2308.11294v1',cat:'q-fin.TR',title:"Network Momentum across Asset Classes"},
    {id:'2608.17366v1',cat:'cs.LG',title:"CORAM: Coherent Orthogonal Rotation for Model Merging"},
    {id:'2606.18225v1',cat:'cs.DS',title:"Directed Reachability-Preserving Minimum Edge Cut: Approximation and Planar Hardness"},
    {id:'2607.17943v1',cat:'math.PR',title:"Coadjoint averaging and cross-scale fluxes in a fast-slow stochastic Euler-Arnold system on $SU(N)$"},
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
