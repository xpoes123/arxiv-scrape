export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-01',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, scored on cool/buildable/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.15213v1',cat:'math.NT',title:'Asymptotic Brill-Noether Existence at the Half-Canonical Degree: Energy Pairing, Cheeger Inequality and Covering Radii'},
    {id:'2607.15510v1',cat:'math.NT',title:'Conjectural Decidability of the Skolem Problem'},
    {id:'2607.10454v2',cat:'cond-mat.stat-mech',title:'Krylov Complexity for Time-Dependent Hamiltonians'},
    {id:'2608.24897v1',cat:'cond-mat.stat-mech',title:'Exact topology of conservative multiplicative cascades: An ultrametric transfer-operator genus'},
    {id:'2310.00747v2',cat:'q-fin.PM',title:'NoxTrader: LSTM-Based Stock Return Momentum Prediction for Quantitative Trading'},
  ],
  [
    {id:'2310.02084v1',cat:'q-fin.PM',title:'Robust Long-Term Growth Rate of Expected Utility for Leveraged ETFs'},
    {id:'2608.24987v1',cat:'cs.LG',title:'D$^3$-MOPD: Adaptive Dynamic Domain ScheDuling for Efficient Multi-Teacher Distillation'},
    {id:'2608.25028v1',cat:'cs.LG',title:'Behind the [MASK]: Disentangling Representation and Faithfulness in DAPF-Based Dementia Detection'},
    {id:'2607.25956v1',cat:'math.OC',title:'Large Language Model for Operations Research Formulation Selection in Multi-Warehouse Inventory Allocation'},
    {id:'2607.25785v1',cat:'math.OC',title:'Variance-Reduced Conditional Gradient Methods under Markovian Sampling for Nonconvex Composite Optimization'},
  ],
  [
    {id:'2607.24018v1',cat:'math.PR',title:'Jeu de taquin forests and the inverse infinite RSK correspondence'},
    {id:'2607.23980v1',cat:'math.PR',title:'Sharp small-deviation inequalities for sums of independent nonnegative random variables'},
    {id:'2510.24955v2',cat:'q-bio.PE',title:'geohabnet: An R package for mapping habitat connectivity for biosecurity and conservation'},
    {id:'2510.27030v4',cat:'q-bio.PE',title:'Generalizing matrix representations to fully heterochronous ranked tree shapes'},
    {id:'2608.05316v1',cat:'cs.CR',title:'The Trust-Free Aggregation Layer of the Unicity Infrastructure'},
  ],
  [
    {id:'2608.05108v1',cat:'cs.CR',title:'Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming'},
    {id:'2606.04138v1',cat:'cond-mat.soft',title:'Controlled Chemical Signaling between Enzymatic Nanomotors'},
    {id:'2606.03752v2',cat:'cond-mat.soft',title:'Continuous limit of a discrete stochastic model of cell migration'},
    {id:'2308.00013v1',cat:'q-fin.TR',title:"Bitcoin Gold, Litecoin Silver: An Introduction to Cryptocurrency's Valuation and Trading Strategy"},
    {id:'2307.15599v2',cat:'q-fin.TR',title:'Understanding the worst-kept secret of high-frequency trading'},
  ],
  [
    {id:'2606.27082v1',cat:'cs.DS',title:'Finding Stationary Points by Comparisons'},
    {id:'2606.26639v1',cat:'cs.DS',title:'Fast Enumeration of Minimal Removable Sets in Monotone Systems with Application to Core Collapse Analysis'},
    {id:'2608.09394v1',cat:'math.CO',title:"A sharp extension of Halin's removable-edge theorem to matchings"},
    {id:'2608.09649v1',cat:'math.CO',title:'A pyramid with a Ramsey base is Ramsey'},
    {id:'2603.16894v1',cat:'q-bio.QM',title:'Less Is More in Chemotherapy of Breast Cancer'},
  ],
  [
    {id:'2603.03237v1',cat:'q-bio.QM',title:'Topology of Multi-species Localization'},
    {id:'2409.18156v1',cat:'q-bio.GN',title:'A novel application of Shapley values for large multidimensional time-series data: Applying explainable AI to a DNA profile classification neural network'},
    {id:'2409.11683v1',cat:'q-bio.GN',title:'k-mer-based approaches to bridging pangenomics and population genetics'},
    {id:'2608.25663v1',cat:'cs.AI',title:'Data Citation for Large Language Models: A Challenge'},
    {id:'2608.26218v1',cat:'cs.AI',title:'Same Model, Different Harness: Different Coding-Agent Results'},
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
