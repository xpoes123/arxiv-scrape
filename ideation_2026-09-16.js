export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-16',
  description: 'Ideate project/startup/youtube/demo ideas from ~27 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.10746',cat:'cs.LG',title:'Temporal and Multimodal Deep Learning for Cyberattack Detection in LEO Satellite Systems'},
    {id:'2609.12022',cat:'cs.AI',title:'Continuous Learning of Gravity Field Irregularities Around Small Bodies via Neural Hamiltonians'},
    {id:'2609.11458',cat:'cs.AI',title:'Flexible and Interpretable Accent Distance Measurements'},
    {id:'2609.05401',cat:'cs.CL',title:'Same Trajectory, Contradictory Rewards (ROBORMBENCH): Paraphrase Fragility in Vision Language Reward Models'},
    {id:'2608.23199',cat:'cs.CR',title:'PhiShark2026: A Multi-Layer Active-Web Raw-Evidence Dataset for Phishing Website Research'},
  ],
  [
    {id:'2607.07439',cat:'cs.DS',title:'On the Assadi Liu Tarjan Auction Algorithm for Bipartite Matching: Simplification, Alternatives'},
    {id:'2608.27438',cat:'math.CO',title:'Graded Ehrhart theory for hypersimplices'},
    {id:'2608.16054',cat:'math.OC',title:'On the Local Linear Convergence of Operator Splitting Methods for Conic Programming'},
    {id:'2608.16256',cat:'math.PR',title:'Error Distribution of the Local Linearization Method for Stochastic Differential Equations'},
    {id:'2608.16170',cat:'math.PR',title:'On hitting time distributions of Markov processes with sub-Gaussian heat kernel bounds'},
  ],
  [
    {id:'2608.08518',cat:'math.NT',title:"Some new results for Andrews' Kimberling partitions"},
    {id:'2308.07763',cat:'q-fin.PM',title:'Online Universal Dirichlet Factor Portfolios'},
    {id:'2308.07944',cat:'q-fin.PM',title:'Portfolio Selection via Topological Data Analysis'},
    {id:'2309.03202',cat:'q-fin.TR',title:'Evaluation of Reinforcement Learning Techniques for Trading on a Diverse Portfolio'},
    {id:'2306.16522',cat:'q-fin.TR',title:'The Implied Views of Bond Traders on the Spot Equity Market'},
  ],
  [
    {id:'2602.09382',cat:'econ.EM',title:'Initial-Condition-Robust Inference in Autoregressive Models'},
    {id:'2602.08899',cat:'econ.EM',title:'Fixed Effects as Generated Regressors'},
    {id:'2607.26865',cat:'stat.ML',title:'Think Short, Defer Smart, Act, and Repeat: Calibrated Reasoning and Uncertainty-Aware Deferral'},
    {id:'2602.16887',cat:'q-bio.NC',title:'Construction of a classification model for dementia among Brazilian adults aged 50 and over'},
    {id:'2504.12659',cat:'q-bio.BM',title:'Topologically Directed Simulations Reveal the Impact of Geometric Constraints on Knotted Proteins'},
  ],
  [
    {id:'2408.10511',cat:'q-bio.GN',title:'Single-cell Curriculum Learning-based Deep Graph Embedding Clustering'},
    {id:'2603.04622',cat:'q-bio.QM',title:'INTENSE: Detecting and disentangling neuronal selectivity in calcium imaging data'},
    {id:'2510.27030',cat:'q-bio.PE',title:'Generalizing matrix representations to fully heterochronous ranked tree shapes'},
    {id:'2606.14498',cat:'physics.chem-ph',title:'A Fixed-Point Neural Operator for Size- and Functional-Transferable Hamiltonian Prediction'},
    {id:'2606.19498',cat:'cond-mat.soft',title:'Collective phases in overdamped magnetic self-propelled spherocylinders'},
  ],
  [
    {id:'2607.26011',cat:'cond-mat.stat-mech',title:'Krylov-Space Memory Cores'},
    {id:'2604.11312',cat:'physics.soc-ph',title:'Network Effects and Agreement Drift in LLM Debates'},
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
