export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-15',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5 (export.arxiv.org API was hard-429ing all night; fetched via arxiv.org HTML listing/abstract pages instead)',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.15361',cat:'cs.LG',title:'Robust and Efficient Communication for Multi-Agent Learning'},
    {id:'2609.15314',cat:'cs.LG',title:'The Universe of Universes: Benefit Yield Functions, Implosion Thresholds, and Infrastructure-Aware Optimization in Multi-LLM Systems'},
    {id:'2609.15305',cat:'cs.LG',title:'When Correlations Mislead: Confounder-Aware Multi-View Urban Region Representation Learning'},
    {id:'2609.15242',cat:'cs.AI',title:'Empirical Evaluation of Open-Source Large Language Models for Retrieval-Augmented Generation in ESG Domain'},
    {id:'2609.15234',cat:'cs.AI',title:'CWM: Controllable White-Box Meta-Prompting for Adaptive Retrieval-Augmented Generation and Reasoning Ability'},
  ],
  [
    {id:'2609.15219',cat:'cs.AI',title:'From Ideas to Actions: A Public-Data Decision-Support Toolchain Across the Venture Lifecycle'},
    {id:'2609.15070',cat:'cs.CL',title:'DA-DLM: Explicitly Modeling Token Dependencies in Diffusion Language Models'},
    {id:'2609.15066',cat:'cs.CL',title:'Salesforce Koa: An Enterprise Language Model for Agentic Tool Use'},
    {id:'2609.15045',cat:'cs.CL',title:'Mirror, Mirror on the Wall: Prompt Echoing in Small Instruct Language Models'},
    {id:'2609.14290',cat:'cs.CR',title:'Fusing Spectral Signatures and Activation Clustering for Backdoor Detection in Healthcare Imaging Models: Method, Implementation, and Evaluation'},
  ],
  [
    {id:'2609.14286',cat:'cs.CR',title:'Policy-Governed Post-Quantum Migration for Legacy Microservices Using Ephemeral Sidecar Architectures'},
    {id:'2609.14210',cat:'cs.CR',title:'Enc53: DNSSEC-Anchored Stateless Tickets for Post-Quantum Authoritative DNS'},
    {id:'2609.14356',cat:'cs.DS',title:'Color Complexity of Recolorable Graph Exploration: Upper and Lower Bounds via Block Structure'},
    {id:'2609.14301',cat:'cs.DS',title:'Approximating Optimal Welfare in Complementary Allocation under Decentralized Information'},
    {id:'2609.14266',cat:'cs.DS',title:'Sharp Norms from Finite Structure: Graph Matrices and Structured Chaoses'},
  ],
  [
    {id:'2609.13765',cat:'math.OC',title:'Last-Iterate Performance of Gradient Descent and Relaxed Proximal Point via s-Composability'},
    {id:'2609.13758',cat:'math.OC',title:'On the Equivalence of Stochastic Control and Path Space Formulations for Schrodinger Bridges over Compact Connected Lie Groups'},
    {id:'2609.13755',cat:'math.OC',title:'Row-Polar LP-Newton for Linear Programming with Corral Repair'},
    {id:'2609.14164',cat:'math.NT',title:'Twisted Lubin-Tate Big Witt Vectors and Fleck-Sun-Wan Congruences'},
    {id:'2609.14161',cat:'math.NT',title:'Quantitative linear independence for square roots'},
  ],
  [
    {id:'2609.14149',cat:'math.NT',title:'Patterns in the Markov numbers and their generalizations'},
    {id:'2609.14029',cat:'q-fin.PM',title:'Special Markowitz: Thermodynamic Formalism for the Joint Regularisation of Returns and Covariance'},
    {id:'2609.13402',cat:'q-fin.PM',title:'Diffusion models for dynamic volatility surface generation and data-driven hedging'},
    {id:'2609.12477',cat:'q-fin.PM',title:'Large Signal Libraries: Equal-Weight Limits and the Divergent Spectra of Signals and PnL'},
    {id:'2609.15373',cat:'q-fin.TR',title:'Resolution Is Not Settlement, Part II: Protocol Finality and Observed Redemption on Polymarket'},
  ],
  [
    {id:'2609.15368',cat:'q-fin.TR',title:'Resolution Is Not Settlement, Part I: Oracle Adjudication and Semantic Governance on Polymarket'},
    {id:'2609.14859',cat:'q-fin.TR',title:'Gate Design and Stage-Dependent Incentives in Retail Proprietary-Trading Evaluations: Why Passing Is Not Standalone Evidence of Skill, and Why the Product Fails to Pay Under Measured Trading Constraints'},
    {id:'2609.13396',cat:'stat.ML',title:'Converge Then Diversify: Decoupling Convergence and Diversity in Multi-Objective Bayesian Optimisation'},
    {id:'2609.13303',cat:'stat.ML',title:'Adaptive Conformal Redistribution for Inter-class Transitional Uncertainty in Medical Image Classification'},
    {id:'2609.13234',cat:'stat.ML',title:'Harnessing human expertise for high-precision robotic assembly in industrialized construction: A sample-efficient installer-in-the-loop interactive reinforcement learning framework'},
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
  const list = batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are 5 papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
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
