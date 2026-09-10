export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-10',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.03705v1',cat:'cs.LG',title:'Federated Causal Discovery via Regression-Directed Cumulants'},
    {id:'2609.04699v1',cat:'cs.AI',title:'Model Retirement Creates Reproducibility Risk in Biomedical AI Publications'},
    {id:'2609.00470v1',cat:'cs.CL',title:'TRIS: A Tri-Layer Retrieval Integrity Sieve Against Knowledge Poisoning'},
    {id:'2608.17082v1',cat:'cs.CR',title:'SentryBus: A Multi-Vantage Observability Model and Validated Instrument for I2C Sensor-Interface Manipulation'},
    {id:'2607.02113v1',cat:'cs.DS',title:'Faster Cache-Efficient Pattern Matching for Deterministic Wheeler Pangenome Graphs'},
  ],
  [
    {id:'2608.19623v1',cat:'math.CO',title:'Palette Sparsification for General Uniform Hypergraphs'},
    {id:'2608.08718v1',cat:'math.OC',title:'Integrated Learning and Robust Optimization'},
    {id:'2608.07236v2',cat:'math.PR',title:'Negative association of Busemann functions in exponential last-passage percolation'},
    {id:'2607.29566v1',cat:'math.NT',title:'The least quadratic residue and integers represented by quadratic forms'},
    {id:'2309.05003v2',cat:'q-fin.PM',title:'Multidimensional indefinite stochastic Riccati equations and zero-sum stochastic linear-quadratic differential games with non-Markovian regime switching'},
  ],
  [
    {id:'2307.02375v2',cat:'q-fin.TR',title:'Online Learning of Order Flow and Market Impact with Bayesian Change-Point Detection Methods'},
    {id:'2602.05226v1',cat:'econ.EM',title:'Predictive Synthesis under Sporadic Participation: Evidence from Inflation Density Surveys'},
    {id:'2607.21840v1',cat:'stat.ML',title:'Toward High-Fidelity 3D Point-Cloud Learning for Brain Folding Morphology Prediction Using Trans-Unet'},
    {id:'2602.16887v1',cat:'q-bio.NC',title:'Construction of a classification model for dementia among Brazilian adults aged 50 and over'},
    {id:'2504.17624v1',cat:'q-bio.BM',title:'Deciphering the unique dynamic activation pathway in a G protein-coupled receptor enables unveiling biased signaling and identifying cryptic allosteric sites in conformational intermediates'},
  ],
  [
    {id:'2409.04922v2',cat:'q-bio.GN',title:'Nearest Neighbor CCP-Based Molecular Sequence Analysis'},
    {id:'2603.04074v1',cat:'q-bio.QM',title:'Dose-Dependent Cardiac Complexity Changes in Children Following Prenatal Glucocorticoid Exposure: Complementary Evidence from Multiscale Entropy Analysis and ECG Foundation Models'},
    {id:'2510.27006v1',cat:'q-bio.PE',title:'Generalized Maximum Entropy: When and Why you need it'},
    {id:'2606.12326v1',cat:'physics.chem-ph',title:'Transferable Machine Learning of Electronic Hamiltonians with Superposition-of-Atomic-Potentials Features'},
    {id:'2606.14696v2',cat:'cond-mat.soft',title:'Scalar dissipation anomaly and scalar-gradient scaling in turbulence: A joint velocity-scalar multifractal view'},
  ],
  [
    {id:'2607.20991v1',cat:'cond-mat.stat-mech',title:'Flavour current correlators and the non-Abelian hydrodynamic approximation: the charged sector'},
    {id:'2604.07347v1',cat:'physics.soc-ph',title:'Temporal Structure Mediates the Robustness and Collapse of Plant-Pollinator Networks'},
    {id:'2608.07042v1',cat:'math.PR',title:'Limit Points of Reflow with Minibatch Optimal Transport'},
    {id:'2308.01915v2',cat:'q-fin.TR',title:'LOB-Based Deep Learning Models for Stock Price Trend Prediction: A Benchmark Study'},
    {id:'2604.07228v1',cat:'physics.soc-ph',title:'Emergence of cooperation in nonlinear higher-order public goods games'},
  ],
  [
    {id:'2510.26115v2',cat:'q-bio.PE',title:'Quenched coalescent for diploid population models with selfing and overlapping generations'},
    {id:'2607.20959v1',cat:'cond-mat.stat-mech',title:'Large deviations in quantum dynamics and complexity'},
    {id:'2608.19609v1',cat:'math.CO',title:'The integer point enumerator of one irrational translate of P is a complete invariant'},
    {id:'2602.16626v1',cat:'q-bio.NC',title:'A Systematic Evaluation of Sample-Level Tokenization Strategies for MEG Foundation Models'},
    {id:'2602.05137v2',cat:'econ.EM',title:'Nested Pseudo-GMM Estimation of Demand for Differentiated Products'},
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
