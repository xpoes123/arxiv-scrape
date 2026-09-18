export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-18',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.13703',cat:'cs.LG',title:'Gap Entropy and Almost Instance-Wise Optimal Best-Arm Identification'},
    {id:'2609.13730',cat:'cs.LG',title:'JumpStart Your Policy Learning with Lessons from 160,000 Training Runs'},
    {id:'2609.17601',cat:'cs.AI',title:'Decentralized Optimal Equilibrium Learning Over Dynamic Networks'},
    {id:'2609.07808',cat:'cs.CL',title:"You Can't Prefer Emotions You Don't Sample: Intensity Undershoot in DPO-Tuned LLMs"},
    {id:'2608.25776',cat:'cs.CR',title:'EVOMAL: Self-Poisoning in Self-Evolving Coding Agents'},
  ],
  [
    {id:'2607.10564',cat:'cs.DS',title:'The Power of Arrival Times in Random-Order Online Facility Location'},
    {id:'2608.30945',cat:'math.CO',title:'Breaking the Exponential Barrier: The First Polynomial-Time Algorithm for the Győri-Lovász Theorem'},
    {id:'2608.19015',cat:'math.OC',title:'Constrained Spatial Pricing of On-Street Parking with Bayesian Demand Calibration'},
    {id:'2608.18769',cat:'math.OC',title:'An Integer Programming Approach to Compute Lower Bounds for Ramsey Numbers Using Circulant Graphs'},
    {id:'2608.20552',cat:'math.PR',title:'One-point fluctuations for exponential last passage percolation under upper-tail conditioning'},
  ],
  [
    {id:'2608.11684',cat:'math.NT',title:'A Proof of a Conjecture on Fixed Perimeter Partitions'},
    {id:'2308.01305',cat:'q-fin.PM',title:'A quantum double-or-nothing game: The Kelly Criterion for Spins'},
    {id:'2308.04769',cat:'q-fin.PM',title:'Correlation-diversified portfolio construction by finding maximum independent set in large-scale market graph'},
    {id:'2306.13378',cat:'q-fin.TR',title:'Exact solution to a generalised Lillo-Mike-Farmer model with heterogeneous order-splitting strategies'},
    {id:'2306.16522',cat:'q-fin.TR',title:'The Implied Views of Bond Traders on the Spot Equity Market'},
  ],
  [
    {id:'2602.12782',cat:'econ.EM',title:'Empirical Validation of a Dual-Defense Mechanism Reshaping Wholesale Electricity Price Dynamics in Singapore'},
    {id:'2607.29554',cat:'stat.ML',title:'Exponential Capacity in Multilayer Hetero-Associative Neural Networks'},
    {id:'2602.15266',cat:'q-bio.NC',title:'A golden-ratio partition of information and the balance between prediction and surprise: a neuro-cognitive route to antifragility'},
    {id:'2504.15288',cat:'q-bio.BM',title:'Magnetic Field-dependent Isotope Effect Supports Radical Pair Mechanism in Tubulin Polymerization'},
    {id:'2408.08867',cat:'q-bio.GN',title:'Quantum Annealing for Enhanced Feature Selection in Single-Cell RNA Sequencing Data Analysis'},
  ],
  [
    {id:'2603.04480',cat:'q-bio.QM',title:'AbAffinity: A Large Language Model for Predicting Antibody Binding Affinity against SARS-CoV-2'},
    {id:'2510.23360',cat:'q-bio.PE',title:'Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells: a game theory modeling to understand metastasis'},
    {id:'2510.24602',cat:'q-bio.PE',title:'Learning to generalize in evolution through annealed population heterogeneity'},
    {id:'2606.17120',cat:'physics.chem-ph',title:'Noise-Driven Escape from Metastable Phases explains Grokking in Deep Neural Networks'},
    {id:'2606.21231',cat:'cond-mat.soft',title:'Exotic topological defects and director fields in free-floating spherical ferroelectric nematic liquid crystal shells'},
  ],
  [
    {id:'2606.20261',cat:'cond-mat.soft',title:'Activity driven buckling and pattern formation in shells of oriented solids'},
    {id:'2607.28765',cat:'cond-mat.stat-mech',title:'Deriving the second law of thermodynamics and exploring its boundaries'},
    {id:'2607.28579',cat:'cond-mat.stat-mech',title:'Quantum Chaos and Diffusive Transport from Geometric Randomness'},
    {id:'2604.13890',cat:'physics.soc-ph',title:'Sandpile Economics: Theory, Identification, and Evidence'},
    {id:'2604.14065',cat:'physics.soc-ph',title:'Nonmonotonic percolation threshold in correlated networks and hypergraphs'},
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
