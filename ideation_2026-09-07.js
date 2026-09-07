export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-07',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.00207v1',cat:'cs.AI',title:"Rock, Paper, Scissors, ... Dynamite - A Model of Disruption from New Technologies"},
    {id:'2608.14515v1',cat:'math.CO',title:"Zero-Sum Cycles in Regular Digraphs"},
    {id:'2608.14486v1',cat:'math.CO',title:"Isomorphism of tournaments with bounded VC dimension"},
    {id:'2608.14454v1',cat:'math.CO',title:"The Erdős distinct distances problem in $\\mathbb{R}^3$"},
    {id:'2607.22828v1',cat:'math.NT',title:"A Salem-Spencer-Type Construction for Large Subsets of Integer Grids with No Isosceles Right Triangles"},
  ],
  [
    {id:'2608.01871v1',cat:'math.OC',title:"Safe screening rules for portfolio optimization with linear and cardinality constraints"},
    {id:'2607.29560v2',cat:'math.PR',title:"Tractable Relaxations of Multivariate Stochastic Dominance via Optimal Transport and CVaR"},
    {id:'2607.29476v1',cat:'math.PR',title:"Resource depletion accelerates rate learning but not composition learning in patch foraging"},
    {id:'2309.05003v2',cat:'q-fin.PM',title:"Multidimensional indefinite stochastic Riccati equations and zero-sum stochastic linear-quadratic differential games with non-Markovian regime switching"},
    {id:'2309.11693v1',cat:'q-fin.PM',title:"Doubly Robust Mean-CVaR Portfolio"},
  ],
  [
    {id:'2310.04536v1',cat:'q-fin.PM',title:"Improving Portfolio Performance Using a Novel Method for Predicting Financial Regimes"},
    {id:'2307.03499v3',cat:'q-fin.TR',title:"Decentralised Finance and Automated Market Making: Execution and Speculation"},
    {id:'2307.02375v2',cat:'q-fin.TR',title:"Online Learning of Order Flow and Market Impact with Bayesian Change-Point Detection Methods"},
    {id:'2307.01816v1',cat:'q-fin.TR',title:"Over-the-Counter Market Making via Reinforcement Learning"},
    {id:'2602.15266v1',cat:'q-bio.NC',title:"A golden-ratio partition of information and the balance between prediction and surprise: a neuro-cognitive route to antifragility"},
  ],
  [
    {id:'2602.14843v1',cat:'q-bio.NC',title:"Evolutionarily Primitive Social Entities"},
    {id:'2510.22220v1',cat:'q-bio.PE',title:"Evolution of the lexicon: a probabilistic point of view"},
    {id:'2510.21134v1',cat:'q-bio.PE',title:"Spatially inhomogeneous two-cycles in an integrodifference equation"},
    {id:'2510.20500v1',cat:'q-bio.PE',title:"Fitness inference tested by in silico population genetics"},
    {id:'2606.10513v1',cat:'cond-mat.soft',title:"Moving backward to go faster: Diatom-inspired sliding reveals efficient modes of locomotion"},
  ],
  [
    {id:'2606.10424v1',cat:'cond-mat.soft',title:"Edge slip stabilizes confined active vortices by suppressing localized instabilities"},
    {id:'2606.10444v1',cat:'cond-mat.soft',title:"One-Step Self-Organized Multifunctional Micromotors via Evaporative Liquid-Liquid Phase Separation"},
    {id:'2607.16735v1',cat:'cond-mat.stat-mech',title:"Approximate thermodynamics of the two-dimensional Ising model in an external magnetic field"},
    {id:'2607.16639v1',cat:'cond-mat.stat-mech',title:"On the Information Required for Feedback Control"},
    {id:'2607.16474v1',cat:'cond-mat.stat-mech',title:"Stochastic Resetting: A Non-Equilibrium Framework for Prediction, Inference and Design"},
  ],
  [
    {id:'2604.03133v1',cat:'physics.soc-ph',title:"Understanding the complexity of frequency and phase angle fluctuations in power grids"},
    {id:'2604.04081v1',cat:'physics.soc-ph',title:"Co-Authoring with AI: How I Wrote a Physics Paper About AI, Using AI"},
    {id:'2609.00211v1',cat:'cs.AI',title:"AI Should Not Only Be Helpful. It Should Be Contingent. Artificial Intimacy, Sycophancy, and the Future of Social Learning"},
    {id:'2606.30525v1',cat:'cs.DS',title:"Working with measurement-based computations on qudits"},
    {id:'2603.04420v1',cat:'q-bio.NC',title:"Machine Learning for Complex Systems Dynamics: Detecting Bifurcations in Dynamical Systems with Deep Neural Networks"},
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
