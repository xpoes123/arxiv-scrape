export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-19',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.13703',cat:'cs.LG',title:'Gap Entropy and Almost Instance-Wise Optimal Best-Arm Identification'},
    {id:'2609.16054',cat:'cs.AI',title:'Causal neural set filtering for online multi-target tracking'},
    {id:'2609.07808',cat:'cs.CL',title:"You Can't Prefer Emotions You Don't Sample: Intensity Undershoot in DPO-Tuned LLMs"},
    {id:'2608.25776',cat:'cs.CR',title:'EVOMAL: Self-Poisoning in Self-Evolving Coding Agents'},
    {id:'2607.10564',cat:'cs.DS',title:'The Power of Arrival Times in Random-Order Online Facility Location'},
  ],
  [
    {id:'2608.30869',cat:'math.CO',title:'Exponential random graph models with soft clique constraints'},
    {id:'2608.18769',cat:'math.OC',title:'An Integer Programming Approach to Compute Lower Bounds for Ramsey Numbers Using Circulant Graphs'},
    {id:'2608.20552',cat:'math.PR',title:'One-point fluctuations for exponential last passage percolation under upper-tail conditioning'},
    {id:'2608.11382',cat:'math.NT',title:'Visible Measures along Ω(n) and Distribution of Horocycle Orbits'},
    {id:'2308.01305',cat:'q-fin.PM',title:'A quantum double-or-nothing game: The Kelly Criterion for Spins'},
  ],
  [
    {id:'2306.02148',cat:'q-fin.TR',title:'The Role of Twitter in Cryptocurrency Pump-and-Dumps'},
    {id:'2602.12490',cat:'econ.EM',title:'Transformer-based CoVaR: Systemic Risk in Textual Information'},
    {id:'2607.29554',cat:'stat.ML',title:'Exponential Capacity in Multilayer Hetero-Associative Neural Networks'},
    {id:'2602.15787',cat:'q-bio.NC',title:'Energy budgets govern synaptic precision and its regulation during plasticity'},
    {id:'2504.15288',cat:'q-bio.BM',title:'Magnetic Field-dependent Isotope Effect Supports Radical Pair Mechanism in Tubulin Polymerization'},
  ],
  [
    {id:'2408.08867',cat:'q-bio.GN',title:'Quantum Annealing for Enhanced Feature Selection in Single-Cell RNA Sequencing Data Analysis'},
    {id:'2603.04480',cat:'q-bio.QM',title:'AbAffinity: A Large Language Model for Predicting Antibody Binding Affinity against SARS-CoV-2'},
    {id:'2510.22220',cat:'q-bio.PE',title:'Evolution of the lexicon: a probabilistic point of view'},
    {id:'2606.17120',cat:'physics.chem-ph',title:'Noise-Driven Escape from Metastable Phases explains Grokking in Deep Neural Networks'},
    {id:'2606.20261',cat:'cond-mat.soft',title:'Activity driven buckling and pattern formation in shells of oriented solids'},
  ],
  [
    {id:'2607.28579',cat:'cond-mat.stat-mech',title:'Quantum Chaos and Diffusive Transport from Geometric Randomness'},
    {id:'2604.13184',cat:'physics.soc-ph',title:"Simon's model does not produce Zipf's law: The fundamental rich-get-richer mechanism"},
    {id:'2609.16057',cat:'cs.AI',title:'OmniHarness: Harnessing Generalizable Visual Generation via Symbolic Policy Learning'},
    {id:'2607.10629',cat:'cs.DS',title:'Independent Set Reconfiguration on Threshold Signed Graphs'},
    {id:'2608.30604',cat:'math.CO',title:'A Full-Sequence Quantitative Gap Between the Chromatic and Cochromatic Numbers'},
  ],
  [
    {id:'2308.04769',cat:'q-fin.PM',title:'Correlation-diversified portfolio construction by finding maximum independent set in large-scale market graph'},
    {id:'2306.17179',cat:'q-fin.TR',title:'Integrating Tick-level Data and Periodical Signal for High-frequency Market Making'},
    {id:'2602.13368',cat:'econ.EM',title:'The Influence of Width Ratios on Structural Beauty in Male Faces'},
    {id:'2604.13774',cat:'physics.soc-ph',title:"Projections of Earth's Technosphere: Civilization Collapse-Recovery Dynamics"},
    {id:'2604.13357',cat:'cond-mat.stat-mech',title:'Network Epidemic Control via Model Predictive Control'},
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
