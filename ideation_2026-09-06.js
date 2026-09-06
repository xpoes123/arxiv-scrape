export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-06',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.29262v1',cat:'cs.LG',title:"Adaptive Multi-Branching for Shallow Decision Tree Induction"},
    {id:'2608.30033v1',cat:'cs.AI',title:'"Act Like a 5th Grader" is Not Enough: Bounding Knowledge in LLM-Based User Simulators'},
    {id:'2608.27135v1',cat:'cs.CL',title:"Said Aloud, Read Different: Cross-Modal Instability in Multimodal Models"},
    {id:'2608.09867v1',cat:'cs.CR',title:"Stealing Reasoning Traces from Proprietary LLM APIs"},
    {id:'2606.28558v1',cat:'cs.DS',title:"Incremental Submodular Maximization: Better Than Greedy"},
  ],
  [
    {id:'2608.13089v1',cat:'math.CO',title:"Infinite series of Deza graphs with strongly regular children"},
    {id:'2608.13025v1',cat:'math.CO',title:"A counterexample to the Foregger-Sinkhorn tie-point conjecture"},
    {id:'2608.01025v1',cat:'math.OC',title:"Call Window Scheduling for Freight Rail Engineers"},
    {id:'2608.00740v1',cat:'math.OC',title:"Dynamic-Threshold Algorithms for the Continuous Quadratic Knapsack Problem: Reset Mechanisms and Complexity"},
    {id:'2606.28478v1',cat:'cs.DS',title:"Maximum Cut Algorithms and Upper Bounds for Planar and Toroidal Graphs"},
  ],
  [
    {id:'2607.28215v1',cat:'math.PR',title:"Almost stochastic dominance via optimal transport"},
    {id:'2607.27976v1',cat:'math.PR',title:"Load balancing in parallel infinite-server queues with action delay via phase representation"},
    {id:'2607.20960v1',cat:'math.NT',title:"Fibonacci, Dirichlet, and Gauss in a single sum"},
    {id:'2607.20853v1',cat:'math.NT',title:"Murmurations of quadratic Hecke L-functions of the Gaussian field"},
    {id:'2309.05926v1',cat:'q-fin.PM',title:"SCOP: Schrodinger Control Optimal Planning for Goal-Based Wealth Management"},
  ],
  [
    {id:'2307.09077v2',cat:'q-fin.TR',title:"Estimation of an Order Book Dependent Hawkes Process for Large Datasets"},
    {id:'2307.02375v2',cat:'q-fin.TR',title:"Online Learning of Order Flow and Market Impact with Bayesian Change-Point Detection Methods"},
    {id:'2607.16987v1',cat:'stat.ML',title:"Twisted Schrödinger Bridge Matching"},
    {id:'2607.16966v1',cat:'stat.ML',title:"Tight Sample Bounds for Renyi and Min-Entropy Estimation"},
    {id:'2602.14843v1',cat:'q-bio.NC',title:"Evolutionarily Primitive Social Entities"},
  ],
  [
    {id:'2603.04420v1',cat:'q-bio.NC',title:"Machine Learning for Complex Systems Dynamics: Detecting Bifurcations in Dynamical Systems with Deep Neural Networks"},
    {id:'2603.01682v2',cat:'q-bio.QM',title:"Modeling and Analysis of Fish Interaction Networks under Projected Visual Stimuli"},
    {id:'2510.22220v1',cat:'q-bio.PE',title:"Evolution of the lexicon: a probabilistic point of view"},
    {id:'2606.05050v2',cat:'physics.chem-ph',title:"Autonomous heterogeneous catalyst discovery with a self-evolving multi-agent digital twin"},
    {id:'2606.08766v3',cat:'cond-mat.soft',title:"Injection-rate effects on failure in a fluid-saturated granular fault gouge"},
  ],
  [
    {id:'2607.15119v1',cat:'cond-mat.stat-mech',title:"Thermodynamic theory of voting and EU elections"},
    {id:'2607.15132v2',cat:'cond-mat.stat-mech',title:"Periodic orbits and quantum many-body scars in integrable spin chains"},
    {id:'2604.03940v1',cat:'physics.soc-ph',title:"Quantum-Tunnelling Oscillators for Cognitive Modelling and Neural Computation: Foundations, Machine-Vision Realisation and Applications"},
    {id:'2604.02590v1',cat:'physics.soc-ph',title:"Self-subsidizing Mercury Remediation with Fusion Reactors"},
    {id:'2604.04956v3',cat:'physics.soc-ph',title:"The Planetary Cost of AI Acceleration, Part II: The 10th Planetary Boundary and the 6.5-Year Countdown"},
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
