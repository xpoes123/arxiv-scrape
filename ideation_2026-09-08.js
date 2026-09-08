export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-08',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.00207v1',cat:'cs.AI',title:"Rock, Paper, Scissors, ... Dynamite - A Model of Disruption from New Technologies"},
    {id:'2604.03683v1',cat:'physics.soc-ph',title:"Asymmetric reformulation of draw rules in chess and its implications for game theory: Repetition as loss for White"},
    {id:'2606.30118v1',cat:'cs.DS',title:"I.i.d. Prophet Inequalities with Discounted Rewards: As Hard as the Non-i.i.d. Case"},
    {id:'2607.29409v1',cat:'math.PR',title:"The Zombie Infection Model"},
    {id:'2602.15266v1',cat:'q-bio.NC',title:"A golden-ratio partition of information and the balance between prediction and surprise: a neuro-cognitive route to antifragility"},
  ],
  [
    {id:'2608.14454v1',cat:'math.CO',title:"The Erdős distinct distances problem in $\\mathbb{R}^3$"},
    {id:'2608.14434v1',cat:'math.CO',title:"The Kelly--Trotter product conjecture for posets of dimension three"},
    {id:'2607.21892v1',cat:'math.NT',title:"A More Efficient Algorithm for Finding the Number of Permutations of $\\mathbb{Z}/n\\mathbb{Z}$ with Distinct Partial Sums"},
    {id:'2608.14338v1',cat:'math.CO',title:"Tight Hamiltonian Cycles in Uniformly Dense $3$-Graphs"},
    {id:'2607.29429v1',cat:'math.PR',title:"A sharp almost sure upper bound for partial sums of random multiplicative functions"},
  ],
  [
    {id:'2307.01816v1',cat:'q-fin.TR',title:"Over-the-Counter Market Making via Reinforcement Learning"},
    {id:'2307.01814v2',cat:'q-fin.TR',title:"Option Market Making via Reinforcement Learning"},
    {id:'2602.01817v1',cat:'econ.EM',title:"Do designated market makers provide liquidity during downward extreme price movements?"},
    {id:'2309.05926v1',cat:'q-fin.PM',title:"SCOP: Schrodinger Control Optimal Planning for Goal-Based Wealth Management"},
    {id:'2306.17742v4',cat:'q-fin.TR',title:"Blockchain scaling and liquidity concentration on decentralized exchanges"},
  ],
  [
    {id:'2603.01682v2',cat:'q-bio.QM',title:"Modeling and Analysis of Fish Interaction Networks under Projected Visual Stimuli"},
    {id:'2607.29476v1',cat:'math.PR',title:"Resource depletion accelerates rate learning but not composition learning in patch foraging"},
    {id:'2602.13421v2',cat:'q-bio.NC',title:"Metabolic cost of information processing in Poisson variational autoencoders"},
    {id:'2602.13368v3',cat:'q-bio.NC',title:"The Influence of Width Ratios on Structural Beauty in Male Faces"},
    {id:'2510.18589v2',cat:'q-bio.PE',title:"Inheritance Entropy: A Model-Independent Method to Probe the Hereditary Structure of Cell Lineage Trees"},
  ],
  [
    {id:'2604.03383v2',cat:'physics.soc-ph',title:"Exceedance Probabilities for Large Earthquakes From DIY Local Earthquake Ensemble Nowcasting and Forecasting"},
    {id:'2604.02590v1',cat:'physics.soc-ph',title:"Self-subsidizing Mercury Remediation with Fusion Reactors"},
    {id:'2604.04956v3',cat:'physics.soc-ph',title:"The Planetary Cost of AI Acceleration, Part II: The 10th Planetary Boundary and the 6.5-Year Countdown"},
    {id:'2607.16474v1',cat:'cond-mat.stat-mech',title:"Stochastic Resetting: A Non-Equilibrium Framework for Prediction, Inference and Design"},
    {id:'2606.10444v1',cat:'cond-mat.soft',title:"One-Step Self-Organized Multifunctional Micromotors via Evaporative Liquid-Liquid Phase Separation"},
  ],
  [
    {id:'2609.00211v1',cat:'cs.AI',title:"AI Should Not Only Be Helpful. It Should Be Contingent. Artificial Intimacy, Sycophancy, and the Future of Social Learning"},
    {id:'2604.02302v1',cat:'physics.soc-ph',title:"The Retraction Epidemic in Science Across Publishers, Fields, and Countries"},
    {id:'2607.16186v1',cat:'cond-mat.stat-mech',title:"Nonequilibrium thermodynamics of feedback-control: a phase-space perspective"},
    {id:'2602.12811v2',cat:'q-bio.NC',title:"Left-right asymmetry in predicting brain activity from LLMs' representations emerges with their formal linguistic competence"},
    {id:'2309.03736v1',cat:'q-fin.PM',title:"TradingGPT: Multi-Agent System with Layered Memory and Distinct Characters for Enhanced Financial Trading Performance"},
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
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server — blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
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
