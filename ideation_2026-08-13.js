export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-13',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.21420v1',cat:'math.CO',title:"Homotopy types of intervals in corank-three higher Bruhat orders"},
    {id:'2606.30188v1',cat:'math.NT',title:"On integers of the form p+F_{2^k}+F_q"},
    {id:'2511.03242v1',cat:'q-bio.PE',title:"Topography, climate, land cover, and biodiversity: Explaining endemic species distributions"},
    {id:'2505.08956v2',cat:'q-bio.BM',title:"QMProt: A Comprehensive Dataset of Quantum Properties for Proteins"},
    {id:'2608.08159v1',cat:'cs.AI',title:"When Is a Steerable Concept Representation Real? Measurement Confounds"},
  ],
  [
    {id:'2606.10399v1',cat:'cs.DS',title:"Average-Case and Smoothed Near-Optimality for Color-Code Decoding"},
    {id:'2607.11449v2',cat:'math.OC',title:"Robust sensor coverage in the presence of spatial obstacles and exclusion zones"},
    {id:'2607.19424v1',cat:'cs.CR',title:"JailMeter: An Evidence-Based Evaluation Framework for Jailbreak Attacks"},
    {id:'2605.25003v1',cat:'cond-mat.soft',title:"Rheotaxis of microswimmers in colloid-laden channel flow"},
    {id:'2505.11610v1',cat:'q-bio.BM',title:"Foundation Models for AI-Enabled Biological Design"},
  ],
  [
    {id:'2511.02882v1',cat:'q-bio.PE',title:"Asymptotic analysis of a stochastic SVEIS epidemic model using Black-Karasinski dynamics"},
    {id:'2603.27956v1',cat:'physics.soc-ph',title:"Artificial Intelligence in Science: Returns, Reallocation, and Reorganization"},
    {id:'2311.16204v1',cat:'q-fin.PM',title:"Planning for the Efficient Updating of Mutual Fund Portfolios"},
    {id:'2607.17786v1',cat:'cs.CR',title:"Reasoning as a Double-Edged Sword: Architecture and Cross-Stage Robustness"},
    {id:'2511.01943v2',cat:'q-bio.PE',title:"Multilevel genomic constraints shape nuclear tRNA gene organization"},
  ],
  [
    {id:'2603.29282v1',cat:'physics.soc-ph',title:"Social Amplification Dominates Collective Hazard Response"},
    {id:'2603.29312v1',cat:'physics.soc-ph',title:"A Preliminary Theory of Infantile Dynamics"},
    {id:'2602.00355v2',cat:'econ.EM',title:"Coping with Inductive Risk When Theories are Underdetermined: Decision Theory"},
    {id:'2607.00669v1',cat:'stat.ML',title:"Convolutional Symmetric AutoEncoders: enhancing latent stability via decoder symmetry"},
    {id:'2607.08435v1',cat:'math.PR',title:"Controllability and Exponential Mixing in Singular Interacting Particle Systems"},
  ],
  [
    {id:'2608.08160v1',cat:'cs.AI',title:"Can LLM Agents Stick to the Script? A Benchmark for Long-Horizon Consistency"},
    {id:'2608.08164v1',cat:'cs.AI',title:"STEMMA: An Adversarial Multi-Agent Framework for Evaluating Self-Identity"},
    {id:'2606.26394v1',cat:'cond-mat.stat-mech',title:"Non-ergodic dynamical phase transition via a zero-mode exceptional point"},
    {id:'2607.08551v1',cat:'math.PR',title:"Weighted-threshold Coupon Collection"},
    {id:'2505.09151v1',cat:'q-bio.BM',title:"Exploration of the potential energy surface for the conformational interconversion"},
  ],
  [
    {id:'2606.09133v1',cat:'cs.DS',title:"Multiversion Concurrency Control for Multiversion B-Trees"},
    {id:'2602.12410v2',cat:'q-bio.NC',title:"Proceedings for the Inaugural Meeting of the International Society for..."},
    {id:'2605.25056v1',cat:'cond-mat.soft',title:"Time-Symmetry of Lagrangian Coherent Structures in Active Turbulence"},
    {id:'2603.28949v2',cat:'physics.soc-ph',title:"The Planetary Cost of AI Acceleration: A Thermodynamic Outlook"},
    {id:'2602.01417v1',cat:'econ.EM',title:"Identification and Estimation in Fuzzy Regression Discontinuity Design"},
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
