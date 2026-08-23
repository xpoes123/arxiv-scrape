export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-22',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.15452v2',cat:'math.PR',title:"All Games Have Equilibria"},
    {id:'2607.05739v1',cat:'math.NT',title:"Integer values of tan(arctan 1+arctan 2+...+arctan n) are rare"},
    {id:'2607.05374v1',cat:'math.NT',title:"The Minkowski grid has robustly many repeated distances"},
    {id:'2608.00479v1',cat:'math.CO',title:"An optimal refinement-compatible bijection between singleton-free partitions and partitions without cyclic adjacencies"},
    {id:'2608.00459v1',cat:'math.CO',title:"A note on the saturation number for unions of three cliques"},
  ],
  [
    {id:'2607.01231v1',cat:'cond-mat.stat-mech',title:"Brownian ratchets and pumps universally simulate many-body active dynamics"},
    {id:'2607.01310v1',cat:'cond-mat.stat-mech',title:"A Fuzzy Sphere Journey in Critical Phenomena"},
    {id:'2605.27297v1',cat:'cond-mat.soft',title:"Geometry and relaxation dynamics of nematic loops"},
    {id:'2605.27108v1',cat:'cond-mat.soft',title:"Quantifying the liquid flow between a soap film and a vertical meniscus"},
    {id:'2605.28096v1',cat:'cond-mat.soft',title:"Primary hemostasis and dynamics of clot formation after microvascular injury"},
  ],
  [
    {id:'2603.29833v1',cat:'physics.soc-ph',title:"Copy-Spread-Annihilate Dynamics in Degree-Assortative Networks"},
    {id:'2604.00386v1',cat:'physics.soc-ph',title:"Machine-learning extraction of size-dependent temperature scales in the 2D XY model"},
    {id:'2604.00652v1',cat:'physics.soc-ph',title:"Simple spatial processes can generate heterogeneous contact distributions in face-to-face interactions"},
    {id:'2604.00699v1',cat:'physics.soc-ph',title:"Public transport in the 15-minute city"},
    {id:'2603.30021v2',cat:'physics.soc-ph',title:"On the Meaning of Urban Scaling"},
  ],
  [
    {id:'2606.17051v1',cat:'cs.DS',title:"A constant-factor approximation of the Gromov-Hausdorff distance in the plane"},
    {id:'2606.16061v1',cat:'cs.DS',title:"Coresets for Continuous k-Center in Hyperbolic Space"},
    {id:'2606.16063v1',cat:'cs.DS',title:"Contested Cluster Selectors: Local Ambiguity, Normal Forms, and Backtracking Cost in Random Constraint Satisfaction"},
    {id:'2606.16104v1',cat:'cs.DS',title:"C^2: Cache-Conscious Succinct Tries with Adaptive Unary Path Compression"},
    {id:'2608.18164v1',cat:'cs.AI',title:"Are LLMs Safe Beyond Text: Do Emojis Expose Gaps in Safety Evaluation"},
  ],
  [
    {id:'2602.13368v3',cat:'q-bio.NC',title:"The Influence of Width Ratios on Structural Beauty in Male Faces"},
    {id:'2602.11956v1',cat:'q-bio.NC',title:"TAVAE: A VAE with Adaptable Priors Explains Contextual Modulation in the Visual Cortex"},
    {id:'2511.01939v3',cat:'q-bio.PE',title:"Epidemic \"momentum\" and a conservation law for infectious disease dynamics"},
    {id:'2511.00138v1',cat:'q-bio.PE',title:"Incentives for self-isolation based on incidence rather than prevalence could help to flatten the curve"},
    {id:'2603.00678v2',cat:'q-bio.QM',title:"From Syntax to Semantics: Geometric Stability as the Missing Axis of Perturbation Biology"},
  ],
  [
    {id:'2607.07232v1',cat:'stat.ML',title:"DiPhon: Diffusion on Graphons for Scalable Graph Generation"},
    {id:'2607.07032v2',cat:'stat.ML',title:"Eigenbasis-Independent Learnable Spectral Positional Encodings for Directed Graphs via Hermitian Block Krylov Subspaces"},
    {id:'2607.17491v3',cat:'math.OC',title:"Supply Chain Networks"},
    {id:'2602.02604v1',cat:'econ.EM',title:"AI Assisted Economics Measurement From Survey: Evidence from Public Employee Pension Choice"},
    {id:'2607.05305v2',cat:'math.NT',title:"Iwasawa invariants of sharp/flat 2-adic L-functions for quadratic twists of elliptic curves"},
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
