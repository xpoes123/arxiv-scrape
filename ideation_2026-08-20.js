export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-20',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.13651v1',cat:'cs.LG',title:"Consistent Model Chasing Is Minimax Optimal: The Exact Value of Scalar Adversarial Adaptive Control under Large Parametric Uncertainty"},
    {id:'2608.14367v1',cat:'cs.AI',title:"Mind the Long Tail: Understanding the Difficulty of Delay Detection in Business Processes"},
    {id:'2608.08082v1',cat:'cs.CL',title:"Commitment Before Realization: When Classifier-Free Guidance Becomes Unnecessary in Masked Diffusion Language Models"},
    {id:'2607.26087v1',cat:'cs.CR',title:"Framework Implementation Maturity in Blockchain-Based Third-Party Compliance Assessment"},
    {id:'2606.16063v1',cat:'cs.DS',title:"Contested Cluster Selectors: Local Ambiguity, Normal Forms, and Backtracking Cost in Random Constraint Satisfaction"},
  ],
  [
    {id:'2607.28598v1',cat:'math.CO',title:"Explicit Matrices over Z_2 with CNOT and Row Complexity 4n-o(n) and Local Logic Gates"},
    {id:'2607.16978v1',cat:'math.OC',title:"Real-World, Large Scale, Multi-Period Log Truck Routing and Scheduling: Application to Canadian Forestry"},
    {id:'2607.16333v2',cat:'math.PR',title:"Non-symmetric vector dyson equations"},
    {id:'2607.04908v1',cat:'math.NT',title:"On the exterior square epsilon-factors of GL_n"},
    {id:'2311.12183v3',cat:'q-fin.PM',title:"Optimal Transport Divergences induced by Scoring Functions"},
  ],
  [
    {id:'2309.07708v2',cat:'q-fin.TR',title:"Market-GAN: Adding Control to Financial Market Data Generation with Semantic Context"},
    {id:'2602.02805v1',cat:'econ.EM',title:"Predicting Well-Being with Mobile Phone Data: Evidence from Four Countries"},
    {id:'2607.06935v1',cat:'stat.ML',title:"Mathematical methods of reinforcement learning"},
    {id:'2602.13887v1',cat:'q-bio.NC',title:"Human-Aligned Evaluation of a Pixel-wise DNN Color Constancy Model"},
    {id:'2505.06067v1',cat:'q-bio.BM',title:"Oncolytic mechanisms and immunotherapeutic potential of Newcastle disease virus in cancer therapy"},
  ],
  [
    {id:'2410.15367v1',cat:'q-bio.GN',title:"DNA Language Model and Interpretable Graph Neural Network Identify Genes and Pathways Involved in Rare Diseases"},
    {id:'2603.01396v2',cat:'q-bio.QM',title:"HarmonyCell: Automating Single-Cell Perturbation Modeling under Semantic and Distribution Shifts"},
    {id:'2511.01943v2',cat:'q-bio.PE',title:"Multilevel genomic constraints shape nuclear tRNA gene organization in plants"},
    {id:'2605.23803v1',cat:'physics.chem-ph',title:"Chirality-sensitive mobility and dissipation of Brownian motion on a helical landscape"},
    {id:'2605.27118v1',cat:'cond-mat.soft',title:"A Levitated Random Telegraph Noise Spectrometer"},
  ],
  [
    {id:'2606.31942v1',cat:'cond-mat.stat-mech',title:"Invasion with size-dependent dispersion range"},
    {id:'2604.00699v1',cat:'physics.soc-ph',title:"Public transport in the 15-minute city"},
    {id:'2608.13554v1',cat:'cs.LG',title:"Defensive Boosting for Online Probabilistic Forecasting"},
    {id:'2608.14359v1',cat:'cs.AI',title:"Designing Sustainable Federated Learning as a Service using Neural Architecture Search"},
    {id:'2608.08067v2',cat:'cs.CL',title:"DialectS2S: End-to-End Speech Dialogue Modeling for Low-Resource Chinese Dialects"},
  ],
  [
    {id:'2607.24897v1',cat:'cs.CR',title:"TYPO: Instruction-Dense Visual Jailbreaks against Commercial Closed-Source Image-Generation Models"},
    {id:'2606.16061v1',cat:'cs.DS',title:"Coresets for Continuous k-Center in Hyperbolic Space"},
    {id:'2607.28588v1',cat:'math.CO',title:"The Complexity of Kemeny Aggregation with Three Rankings"},
    {id:'2607.16977v1',cat:'math.OC',title:"Relative Entropy-Bounded Ambiguous Chance Constraints for Robust Planning in Nonlinear Systems"},
    {id:'2607.14503v1',cat:'math.PR',title:"Space-Entropy Lower Bounds for Random Sampling"},
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
