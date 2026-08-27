export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-27',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.20134v1',cat:'cs.LG',title:"Feature Evolution and Migration during Vision Transformer Training"},
    {id:'2608.21359v1',cat:'cs.AI',title:"Primal Acceleration of Newton's Method"},
    {id:'2608.01373v1',cat:'cs.CR',title:"The Boy Who Cried Wolf: Adversarial Misclassification of Safe Inputs as Unsafe in Multimodal Guardrails"},
    {id:'2606.21985v1',cat:'cs.DS',title:"Freeze-Tag with Return"},
    {id:'2606.22018v1',cat:'cs.DS',title:"Optimal Macroitem Sequences in the Precedence Constrained Knapsack Problem"},
  ],
  [
    {id:'2608.06437v1',cat:'math.CO',title:"A superlinear lower bound for Radon Numbers"},
    {id:'2608.05508v1',cat:'math.CO',title:"A Gap in the 42-Queue Layout Algorithm for Planar Graphs"},
    {id:'2607.21579v1',cat:'math.OC',title:"Barzilai-Borwein Fails Superlinear Convergence on an Open Set of Quadratics for Every Dimension n>=4"},
    {id:'2607.19549v1',cat:'math.PR',title:"The Generalized Friendship Paradox for Eigenvectors"},
    {id:'2607.19660v1',cat:'math.PR',title:"Smallest gaps between zeros of stationary Gaussian processes"},
  ],
  [
    {id:'2607.10654v1',cat:'math.NT',title:"The Prime Digit Distribution Conjecture: A Formal Proof of Average Digit Equidistribution in the Prime Numbers"},
    {id:'2607.10431v1',cat:'math.NT',title:"Long Intervals Without Distinct Multiples of the First n Positive Integers"},
    {id:'2308.08683v1',cat:'q-fin.TR',title:"Detecting Financial Market Manipulation with Statistical Physics Tools"},
    {id:'2607.11631v1',cat:'stat.ML',title:"Markov Chain Monte Carlo with Diffusion Paths"},
    {id:'2607.11344v1',cat:'stat.ML',title:"Learning to control switching nonlinear systems with Koopman operator regression"},
  ],
  [
    {id:'2504.21484v1',cat:'q-bio.BM',title:"Chiral interactions between tropocollagen molecules determine the collagen microfibril structure"},
    {id:'2511.01939v3',cat:'q-bio.PE',title:'Epidemic "momentum" and a conservation law for infectious disease dynamics'},
    {id:'2603.02665v1',cat:'q-bio.QM',title:"Stochastic modeling of long-legged ant A. gracilipes locomotion in laboratory experiments"},
    {id:'2605.30872v1',cat:'physics.chem-ph',title:"A Phase Space Signature of Quantum Roaming in Chesnavich's Model"},
    {id:'2605.31462v1',cat:'cond-mat.soft',title:"Cooperative Conformational Transitions in Macromolecules under Mechanical Stretching. An Exactly Solved Model for Single Molecule Experiments"},
  ],
  [
    {id:'2605.31542v1',cat:'cond-mat.soft',title:"Recovering the Shape of a Contact Line"},
    {id:'2607.06131v2',cat:'cond-mat.stat-mech',title:"Force-Torque Reciprocity and the Inference of Concealed Dissipation in a Geared Brownian Machine"},
    {id:'2607.06146v2',cat:'cond-mat.stat-mech',title:"Quantum Density of States and Integer Partitions: A Semiclassical Approach"},
    {id:'2604.00943v1',cat:'physics.soc-ph',title:"Women's mobility networks enable more efficient travel"},
    {id:'2604.00699v1',cat:'physics.soc-ph',title:"Public transport in the 15-minute city"},
  ],
  [
    {id:'2604.01201v2',cat:'physics.soc-ph',title:"Message passing and cyclicity transition"},
    {id:'2606.22270v1',cat:'cs.DS',title:"Service-Cut Certificates for Aligned Eviction in Tiered Cache Networks"},
    {id:'2602.05099v1',cat:'econ.EM',title:"Personalized Policy Learning through Discrete Experimentation: Theory and Empirical Evidence"},
    {id:'2603.16894v1',cat:'q-bio.QM',title:"Less Is More in Chemotherapy of Breast Cancer"},
    {id:'2410.06188v2',cat:'q-bio.GN',title:"Beyond the Alphabet: Deep Signal Embedding for Enhanced DNA Clustering"},
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
