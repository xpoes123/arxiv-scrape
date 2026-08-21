export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-21',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.13599v1',cat:'math.CO',title:"Single-speed modifications of the tight Lonely Runner instance: an effective bound and the complete classification for r = 2"},
    {id:'2607.05739v1',cat:'math.NT',title:"Integer values of tan(arctan 1+arctan 2+...+arctan n) are rare"},
    {id:'2607.15452v2',cat:'math.PR',title:"All Games Have Equilibria"},
    {id:'2607.01405v2',cat:'cond-mat.stat-mech',title:"First passage time distribution in underdamped harmonic oscillators"},
    {id:'2607.01231v1',cat:'cond-mat.stat-mech',title:"Brownian ratchets and pumps universally simulate many-body active dynamics"},
  ],
  [
    {id:'2607.02023v1',cat:'cond-mat.stat-mech',title:"Sandpile Models on complex networks"},
    {id:'2607.01948v1',cat:'cond-mat.stat-mech',title:"Curvature-driven wall accumulation in chiral active particles"},
    {id:'2603.01682v2',cat:'q-bio.QM',title:"Modeling and Analysis of Fish Interaction Networks under Projected Visual Stimuli"},
    {id:'2604.00943v1',cat:'physics.soc-ph',title:"Women's mobility networks enable more efficient travel"},
    {id:'2604.00699v1',cat:'physics.soc-ph',title:"Public transport in the 15-minute city"},
  ],
  [
    {id:'2606.17051v1',cat:'cs.DS',title:"A constant-factor approximation of the Gromov-Hausdorff distance in the plane"},
    {id:'2606.16537v1',cat:'cs.DS',title:"Online Matching with KIID Edge Arrivals"},
    {id:'2608.00555v1',cat:'math.CO',title:"Proper conflict-free 7-coloring of planar graphs"},
    {id:'2607.05374v1',cat:'math.NT',title:"The Minkowski grid has robustly many repeated distances"},
    {id:'2607.17684v1',cat:'math.OC',title:"Monotonicity and Frank-Wolfe Dynamics in Atomic Splittable Congestion Games"},
  ],
  [
    {id:'2511.01939v3',cat:'q-bio.PE',title:"Epidemic \"momentum\" and a conservation law for infectious disease dynamics"},
    {id:'2511.00138v1',cat:'q-bio.PE',title:"Incentives for self-isolation based on incidence rather than prevalence could help to flatten the curve"},
    {id:'2603.03337v2',cat:'q-bio.NC',title:"Does the motor cortex draw on a wire plane?"},
    {id:'2602.12811v2',cat:'q-bio.NC',title:"Left-right asymmetry in predicting brain activity from LLMs' representations emerges with their formal linguistic competence"},
    {id:'2602.13368v3',cat:'q-bio.NC',title:"The Influence of Width Ratios on Structural Beauty in Male Faces"},
  ],
  [
    {id:'2605.27297v1',cat:'cond-mat.soft',title:"Geometry and relaxation dynamics of nematic loops"},
    {id:'2605.27251v1',cat:'cond-mat.soft',title:"Resolving Capillary Mode Transitions in Microparticles at Fluid Interfaces"},
    {id:'2607.01404v2',cat:'cond-mat.stat-mech',title:"First passage time for an underdamped harmonic oscillator and application to the power of an information engine"},
    {id:'2605.25268v1',cat:'physics.chem-ph',title:"Bipartite Cholesky Graph Networks for Many-Body Quantum Chemistry"},
    {id:'2607.01332v2',cat:'cond-mat.stat-mech',title:"Controlling Waiting Time Statistics in Monitored Collective Spins: Mitigating Detector's Resolution Barrier"},
  ],
  [
    {id:'2607.25461v2',cat:'cs.CR',title:"From Profiling to Parameterization: Physics-Guided Acoustic Eavesdropping via Smartphone Accelerometers"},
    {id:'2608.15265v2',cat:'cs.AI',title:"VibeWorlding: Can Multimodal Agents Construct 3D Open Worlds End-to-End?"},
    {id:'2602.01817v1',cat:'econ.EM',title:"Do designated market makers provide liquidity during downward extreme price movements?"},
    {id:'2607.05823v1',cat:'math.NT',title:"Large Sets of Integers with No Harmonic Triples"},
    {id:'2603.30021v2',cat:'physics.soc-ph',title:"On the Meaning of Urban Scaling"},
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
