export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-31',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, scored on cool/buildable/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2307.15599v2',cat:'q-fin.TR',title:'Understanding the worst-kept secret of high-frequency trading'},
    {id:'2606.24703v1',cat:'cs.DS',title:'Scheduling jobs with unknown size distribution in a M/G/1 queue: the shifted empirical Gittins'},
    {id:'2606.25166v1',cat:'cs.DS',title:'Scheduling with Testing: Competitive Algorithms for Minimizing the Total Weighted Completion Time in the Adversarial Model'},
    {id:'2607.12938v1',cat:'stat.ML',title:'Sharp Optimal Algorithm for Derivative-Free Stochastic Convex Optimization in One Dimension'},
    {id:'2310.02014v1',cat:'q-fin.PM',title:'Utility-based acceptability indices'},
  ],
  [
    {id:'2604.18596v2',cat:'physics.soc-ph',title:'Large language models converge on competitive rationality but diverge on cooperation across providers and generations'},
    {id:'2608.03294v3',cat:'cs.CR',title:'Provably Learning Multi-Head Attention with Queries'},
    {id:'2607.23116v2',cat:'math.OC',title:'KAYROS: An Anytime and Exact Open-Source Solver for Duration-Minimization Time-Dependent Vehicle Routing'},
    {id:'2602.02607v1',cat:'econ.EM',title:'The Innovation Tax: Generative AI Adoption, Productivity Paradox, and Systemic Risk in the U.S. Banking Sector'},
    {id:'2409.18156v1',cat:'q-bio.GN',title:'A novel application of Shapley values for large multidimensional time-series data'},
  ],
  [
    {id:'2602.13368v3',cat:'q-bio.NC',title:'The Influence of Width Ratios on Structural Beauty in Male Faces'},
    {id:'2603.02665v1',cat:'q-bio.QM',title:'Stochastic modeling of long-legged ant A. gracilipes locomotion in laboratory experiments'},
    {id:'2603.01682v2',cat:'q-bio.QM',title:'Modeling and Analysis of Fish Interaction Networks under Projected Visual Stimuli'},
    {id:'2603.03337v2',cat:'q-bio.NC',title:'Does the motor cortex draw on a wire plane?'},
    {id:'2510.23297v1',cat:'q-bio.PE',title:'Drivers of Variation in the Optimal Spatial Structure of Collective Information Gatherers'},
  ],
  [
    {id:'2607.12668v3',cat:'math.NT',title:'On lower bounds for canonical heights of the map φ(X,Y)=(Y,X+Y^D+b)'},
    {id:'2606.00626v2',cat:'cond-mat.soft',title:'Sliding contact creates universal self-affine fractal surfaces'},
    {id:'2607.07776v1',cat:'cond-mat.stat-mech',title:'Seven- and eight-loop critical exponents of the three-dimensional Ising model'},
    {id:'2607.07867v1',cat:'cond-mat.stat-mech',title:'An edge-bicolored graph approach to the Ising model on random regular graphs'},
    {id:'2607.23476v1',cat:'math.OC',title:'Convexity and SOS-Convexity of Sum of Separable and Biquadratic Quartic Polynomials and Optimization'},
  ],
  [
    {id:'2604.00943v1',cat:'physics.soc-ph',title:"Women's mobility networks enable more efficient travel"},
    {id:'2604.00699v1',cat:'physics.soc-ph',title:'Public transport in the 15-minute city'},
    {id:'2602.01817v1',cat:'econ.EM',title:'Do designated market makers provide liquidity during downward extreme price movements?'},
    {id:'2307.15805v1',cat:'q-fin.TR',title:'Equilibria and incentives for illiquid auction markets'},
    {id:'2608.18120v1',cat:'stat.ML',title:'Tradable Itô Signatures: A Model-Free, Interpretable Framework for Dynamic Hedging'},
  ],
  [
    {id:'2607.07878v1',cat:'cond-mat.stat-mech',title:'Complex spacing ratio statistics in the partially open asymmetric quantum baker map'},
    {id:'2606.24789v1',cat:'cs.DS',title:'Faster algorithm for achieving minimal-size quantum decision diagrams'},
    {id:'2504.19017v1',cat:'q-bio.BM',title:'Sparks: Multi-Agent Artificial Intelligence Model Discovers Protein Design Principles'},
    {id:'2602.11478v3',cat:'q-bio.NC',title:'Defining causal mechanism in dual process theory and two types of feedback control'},
    {id:'2608.19221v1',cat:'math.PR',title:'Filtering Credit Risk with Stochastic Discontinuities'},
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
