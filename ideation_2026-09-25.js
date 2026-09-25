export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-25',
  description: 'Ideate project/startup/youtube/demo ideas from ~29 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.29281',title:"Online Task Adaptation via Self-Organisation"},
    {id:'2609.29270',title:"Learnable Time-Frequency Masks for Explaining Time-Series Classifiers"},
    {id:'2609.29268',title:"BridgeMem: Causal Dyadic Transition Residuals for Temporal Knowledge Graph Forecasting"},
    {id:'2609.29216',title:"FB-GDM: Fully-Bayesian Guided Diffusion Models for High-Dimensional Linear Inverse Problems via Unsupervised Variational Inference"},
    {id:'2609.29189',title:"When Honesty is Not Enough in AI Debate"},
  ],
  [
    {id:'2609.29187',title:"The Entropy Triangle Method (ETM): A novel framework for the prevention of cardiac arrhythmia with a review of more than 10,000 patients"},
    {id:'2609.29181',title:"Right Choice of Classification Algorithms Based on Reinforcement Learning for Prediction of Non-Alcoholic Fatty Liver"},
    {id:'2609.29167',title:"IndicBankBench: Evaluating Safety and Reliability of Language Model Assistants in Indian Retail Banking"},
    {id:'2609.29230',title:"EAGER: Enhancing Generative Event Extraction via Reinforcement Learning with Verifiable Rewards"},
    {id:'2609.29183',title:"Predicting Emerging Topics from Outliers: A Prospective Study of Weak Signals in Embedding Space"},
  ],
  [
    {id:'2609.29146',title:"BanglaKontho: Closing the Long-Form Gap in Bangla Text-to-Speech"},
    {id:'2609.28205',title:"GUIAuditor: Enabling Post-hoc Child Safety Forensics via Action-Guided GUI Provenance on Mobile Devices"},
    {id:'2609.28170',title:"Safety-Aware Zero Trust Enforcement for IoT and Cyber-Physical Systems"},
    {id:'2609.28115',title:"No Place to Hide: An Analysis on Protected Order Flow Sandwich Attacks"},
    {id:'2609.24804',title:"FPT Isomorphism Test for $F$-Free Tournaments"},
  ],
  [
    {id:'2609.24780',title:"Improved polynomial-time algorithms for detecting and recovering planted $\\Theta(\\sqrt{n})$-cliques"},
    {id:'2609.24624',title:"Vertex Cover Interdiction in Bipartite Graphs"},
    {id:'2609.28751',title:"Strong NP-Hardness and Approximation Algorithm for Weighted Tardiness with Release Dates and Identical Processing Times"},
    {id:'2609.28595',title:"Permutation binomials of the form $X^r(X^{q-1}+a)$ over finite fields"},
    {id:'2609.28263',title:"Resource-Adaptive Stochastic Gradient Descent for Online Linear Programming without Re-solving"},
  ],
  [
    {id:'2609.28181',title:"Personalised versus Posted Pricing from Samples"},
    {id:'2609.29108',title:"Functional Architecture of European Electricity Trading Markets: Requirements for AI Supported Trading Systems under Regulatory Constraints"},
    {id:'2609.27786',title:"Feasible Multi-Asset Optimal Execution under Cash Constraints"},
    {id:'2609.23703',title:"Financial Language Models as Applied Artificial Intelligence Systems for News-Based Trading under Market Frictions"},
    {id:'2609.21173',title:"Adapting the Actor Model of Concurrency for High-Frequency Trading: Synchronous Message Delivery (fast_send) and a Tick-to-Book Latency Study"},
  ],
  [
    {id:'2609.26951',title:"Rolling Conformal Prediction in Sequential Model Training"},
    {id:'2609.26867',title:"Additive Nonparametric Regression with Spatial and Network Objects"},
    {id:'2609.26843',title:"Gaussian-process surrogate indicators for residual-based adaptive GMsFEM"},
    {id:'2205.06398',title:"Outlier Detection for Multi-Network Data"},
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
