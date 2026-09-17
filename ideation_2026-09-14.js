export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-14',
  description: 'Ideate project/startup/youtube/demo ideas from 24 fresh arXiv papers in batches of ~5 (degraded fetch night: arXiv hard-blocked for ~2.5hrs, only cs.CR/math.PR/math.NT categories cleared)',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.19387v1',cat:'cs.CR',title:"Aray: Deterministic-First Synthesis of Benign Artifacts for YARA Validation"},
    {id:'2608.19369v1',cat:'cs.CR',title:"Linguistic Holonomy and Statistical Watermarks: Inner Geometry of Meaning-Preserving Transformations"},
    {id:'2608.19191v1',cat:'cs.CR',title:"The Structured Totient Preimage Problem: Reconstruction, Collisions, and Cryptographic Implications"},
    {id:'2608.19190v1',cat:'cs.CR',title:"SiNMULI: Novel Signed Network Approach for Malicious URL Identification"},
    {id:'2608.19161v1',cat:'cs.CR',title:"Beyond the Transcript: Detecting Covert Coordination in Latent Multi-Agent Communication"},
  ],
  [
    {id:'2608.19155v1',cat:'cs.CR',title:"FedGuard-DC: Privacy-Preserving Federated Load Forecasting and Cyber-Attack Detection for Data-Center Loads in Transmission Systems"},
    {id:'2608.19135v1',cat:'cs.CR',title:"Autonomous Cyber Defense in Connected Vehicles: A Multi-Agent Approach to V2X Security"},
    {id:'2608.19302v1',cat:'cs.CR',title:"ABEAT: Efficient and Anonymous Encryption for ABE-based Dynamic Group Communication"},
    {id:'2608.11084v1',cat:'math.PR',title:"Sharp Frobenius-Norm Concentration for Sample Moment Tensors"},
    {id:'2608.11071v1',cat:'math.PR',title:"Scaling Laws for Majority-based Opinion Dynamics in the Presence of Stubborn Agents"},
  ],
  [
    {id:'2608.11059v1',cat:'math.PR',title:"Entropy Production and Reversibility Criteria for Stochastic Evolution Equations"},
    {id:'2608.11031v2',cat:'math.PR',title:"A Bayesian Proof of the Bernoulli Theorem"},
    {id:'2608.11016v1',cat:'math.PR',title:"Gromov-Wasserstein Quantization and Clustering: Structure, Rates, and Algorithms"},
    {id:'2608.10992v1',cat:'math.PR',title:"Sharpness of the avalanche phase transition in the Bak--Sneppen model"},
    {id:'2608.10944v1',cat:'math.PR',title:"Central limit theory for serial tail dependence estimators in heavy-tailed long memory linear time series"},
  ],
  [
    {id:'2608.10936v1',cat:'math.PR',title:"Threshold Structure of Optimal Policies in Restart POMDPs"},
    {id:'2608.01567v1',cat:'math.NT',title:"Algorithmic universal étale (φ,Γ)-modules"},
    {id:'2608.01551v1',cat:'math.NT',title:"Square-integrability of holomorphic differential forms on locally symmetric varieties"},
    {id:'2608.01500v1',cat:'math.NT',title:"The catenary degree of monoids of product-one sequences"},
    {id:'2608.01498v1',cat:'math.NT',title:"Bounds for Mertens Sums"},
  ],
  [
    {id:'2608.01486v1',cat:'math.NT',title:"A Coates-Sinnott-type Theorem for First Derivatives of Artin L-Functions"},
    {id:'2608.01485v1',cat:'math.NT',title:"Intertwining Operators for Siegel Parabolics over Finite Fields"},
    {id:'2608.01443v1',cat:'math.NT',title:"Nine-distance theorem and growth of best-approximation denominators"},
    {id:'2608.05191v1',cat:'math.NT',title:"Rigidity of Averages over the Two Largest Prime Factors"},
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
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
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
