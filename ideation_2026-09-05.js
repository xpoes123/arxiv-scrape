export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-05',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.29296v1',cat:'cs.LG',title:"When Do Larger Batches Help Scale LLM Reinforcement Learning?"},
    {id:'2608.30047v1',cat:'cs.AI',title:"Can LLM Agents Discover? Evaluating Creativity on ML Engineering Tasks"},
    {id:'2608.30033v1',cat:'cs.AI',title:'"Act Like a 5th Grader" is Not Enough: Bounding Knowledge in LLM-Based User Simulators'},
    {id:'2608.27167v1',cat:'cs.CL',title:"Calibrated Enough to Know, Not Calibrated to Act: Fabricated Evidence Makes LLM Agents Commit to the Unknowable"},
    {id:'2608.10166v1',cat:'cs.CR',title:"MarkNull: Model-Agnostic Watermark Removal in AI-Generated Images via On-Manifold Latent Manipulation"},
  ],
  [
    {id:'2608.10152v1',cat:'cs.CR',title:"World-First SEM-based Recovery of Crash EDR Data from the EEPROM of a Severely Damaged SRS Module Using CrashScan"},
    {id:'2606.30118v1',cat:'cs.DS',title:"I.i.d. Prophet Inequalities with Discounted Rewards: As Hard as the Non-i.i.d. Case"},
    {id:'2608.13074v2',cat:'math.CO',title:"One Empty Locker and Two Inspections: An Exact Optimal Team Strategy"},
    {id:'2608.13071v2',cat:'math.CO',title:"On the Erdős Five-Edge Intersection Problem"},
    {id:'2608.00740v1',cat:'math.OC',title:"Dynamic-Threshold Algorithms for the Continuous Quadratic Knapsack Problem: Reset Mechanisms and Complexity"},
  ],
  [
    {id:'2607.28215v1',cat:'math.PR',title:"Almost stochastic dominance via optimal transport"},
    {id:'2607.20960v1',cat:'math.NT',title:"Fibonacci, Dirichlet, and Gauss in a single sum"},
    {id:'2309.11693v1',cat:'q-fin.PM',title:"Doubly Robust Mean-CVaR Portfolio"},
    {id:'2307.08768v4',cat:'q-fin.TR',title:"Decentralized Prediction Markets and Sports Books"},
    {id:'2307.11012v1',cat:'q-fin.TR',title:"Fast and Furious: A High-Frequency Analysis of Robinhood Users' Trading Behavior"},
  ],
  [
    {id:'2602.05099v1',cat:'econ.EM',title:"Personalized Policy Learning through Discrete Experimentation: Theory and Empirical Evidence"},
    {id:'2607.17201v1',cat:'stat.ML',title:"Non-Asymptotic Best Policy Identification Guarantees in Online Reinforcement Learning"},
    {id:'2602.15266v1',cat:'q-bio.NC',title:"A golden-ratio partition of information and the balance between prediction and surprise: a neuro-cognitive route to antifragility"},
    {id:'2602.14843v1',cat:'q-bio.NC',title:"Evolutionarily Primitive Social Entities"},
    {id:'2504.19017v1',cat:'q-bio.BM',title:"Sparks: Multi-Agent Artificial Intelligence Model Discovers Protein Design Principles"},
  ],
  [
    {id:'2409.05214v2',cat:'q-bio.GN',title:"Advances in colored k-mer sets: essentials for the curious"},
    {id:'2603.02665v1',cat:'q-bio.QM',title:"Stochastic modeling of long-legged ant A. gracilipes locomotion in laboratory experiments"},
    {id:'2510.23360v1',cat:'q-bio.PE',title:"Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells: a game theory modeling to understand metastasis"},
    {id:'2606.05050v2',cat:'physics.chem-ph',title:"Autonomous heterogeneous catalyst discovery with a self-evolving multi-agent digital twin"},
    {id:'2606.09468v1',cat:'cond-mat.soft',title:"No need to stay positive: a practical approach to direct numerical simulations of elastic turbulence"},
  ],
  [
    {id:'2607.15266v2',cat:'cond-mat.stat-mech',title:"Mass-induced Mpemba effect in a polymer-bead system"},
    {id:'2604.03383v2',cat:'physics.soc-ph',title:"Exceedance Probabilities for Large Earthquakes From DIY Local Earthquake Ensemble Nowcasting and Forecasting"},
    {id:'2604.04459v1',cat:'physics.soc-ph',title:"Intercity mobility reveals the hyperbolic geometry of city systems"},
    {id:'2608.29304v1',cat:'cs.LG',title:"MEL: Coordinate-Preserving EEG Tokenization for fMRI Translation"},
    {id:'2608.30035v1',cat:'cs.AI',title:"Beyond Uncertainty: Multi-Solver Disagreement Rewards for Self-Evolving Reasoning Curricula"},
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
