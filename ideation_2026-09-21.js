export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-21',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.14711',title:"GRPO-QM: Target Preserving Exploration for Quantum Tomography"},
    {id:'2609.16077',title:"Pseudo-Label Augmentation for Affect Sensing in Small Collaborative Groups"},
    {id:'2609.15046',title:"Personalizing Personal Health Interfaces: Co-Design with Generative AI"},
    {id:'2609.15035',title:"Horizon-specific Expert Fusion for Photovoltaic Power Forecasting"},
    {id:'2609.08797',title:"Bridging Network Psychometrics and Artificial Intelligence: An Ising-Perceptron Correspondence"},
  ],
  [
    {id:'2609.08698',title:"Record Grouping Controls Evidence Weight in Language Models"},
    {id:'2608.26792',title:"Thresholding Post-Quantum Signatures"},
    {id:'2608.26699',title:"KubeCap: A Framework for Capability Minimization in Kubernetes via Static Analysis"},
    {id:'2607.11203',title:"Randomization Helps in Online Graph Exploration: Breaking the Deterministic Lower Bound"},
    {id:'2607.10731',title:"On the upper bound of the generalization of FFD to solve quadratic bin packing"},
  ],
  [
    {id:'2609.01230',title:"The Composition Lemma for n-dependence"},
    {id:'2609.01114',title:"Unbalanced spectral Turán problem for color-critical graphs with prescribed chromatic number"},
    {id:'2608.19754',title:"A Controllability Gramian Shaping with LMI Constraints under Bures-Wasserstein Geometry"},
    {id:'2608.19576',title:"Convex ordering for graphon mean-field systems"},
    {id:'2608.21955',title:"Properties of Subsets of Unobserved Items Constructed by Using Blackwell's Theorem"},
  ],
  [
    {id:'2608.21816',title:"On Pólya's 4D random walk constant"},
    {id:'2608.12240',title:"Multiplicator freeness for restricted-ramification Galois groups over number fields"},
    {id:'2307.12161',title:"Unraveling the Trade-off between Sustainability and Returns: A Multivariate Analysis"},
    {id:'2311.10713',title:"Diversifying an Index"},
    {id:'2306.02148',title:"The Role of Twitter in Cryptocurrency Pump-and-Dumps"},
  ],
  [
    {id:'2305.16255',title:"Hierarchical forecasting for aggregated curves with an application to day-ahead electricity price auctions"},
    {id:'2602.12782',title:"Empirical Validation of a Dual-Defense Mechanism Reshaping Wholesale Electricity Markets"},
    {id:'2602.12023',title:"Decomposition of Spillover Effects Under Misspecification: Pseudo-true Parameters"},
    {id:'2608.01383',title:"An Identifiability Theory of Masked Prediction: Mode Blindness and Masking Schedules"},
    {id:'2608.01069',title:"Characterizing Bias in Post-Bandit Inference under Index Algorithms"},
  ],
  [
    {id:'2602.13421',title:"Metabolic cost of information processing in Poisson variational autoencoders"},
    {id:'2603.03337',title:"Does the motor cortex draw on a wire plane?"},
    {id:'2504.01389',title:"De Novo Molecular Design Enabled by Direct Preference Optimization"},
    {id:'2503.22164',title:"PharmAgents: Building a Virtual Pharma with Large Language Model Agents"},
    {id:'2408.05258',title:"scASDC: Attention Enhanced Structural Deep Clustering for Single-cell Data"},
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
          discussion: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable', 'discussion', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

function batchPrompt(batch) {
  const list = batch.map(p => `- ${p.id} ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are these papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper, propose 2-4 concrete ideas. Tag each idea's type: project (something to build/ship), startup (a business), youtube (a video/explainer concept), or demo (an interactive toy/visualization). Score each on:
- cool (1-10): how cool/shareable is this
- buildable (1-10): how buildable TONIGHT as a single self-contained HTML file with no backend (prefer interactive visualizations, playable toys, mind-bending demos)
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
- discussion_why: one sentence naming which axis it wins on
- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy

Return via the structured schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) =>
  () => agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas surfaced across ${BATCHES.length} batches`)

return { ideas: allIdeas }
