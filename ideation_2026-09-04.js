export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-04',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.29360v1',cat:'cs.LG',title:"Spatial Entropy based Partitioning for Spatiotemporal Graph Unlearning"},
    {id:'2608.30041v1',cat:'cs.AI',title:"Reachability-Based Capability Confinement for LLM Agents under Indirect Prompt Injection"},
    {id:'2608.27176v1',cat:'cs.CL',title:"When Text Misleads: Inconsistent-Aware Reasoning for Audio-Grounded Dialogue"},
    {id:'2608.10171v1',cat:'cs.CR',title:"Generating Attacks for LLMs with GFlowNets"},
    {id:'2606.29835v1',cat:'cs.DS',title:"A Sieve-Accelerated Quadrature Method for Exact Privacy Accounting in the 2020 U.S. Decennial Census"},
  ],
  [
    {id:'2608.13192v1',cat:'math.CO',title:"Generalizations of the Christoffel-Darboux formula and congruences involving Apéry-like numbers"},
    {id:'2608.01025v1',cat:'math.OC',title:"Call Window Scheduling for Freight Rail Engineers"},
    {id:'2607.28614v1',cat:'math.PR',title:"Tampered Memory Elephant Random Walk on One-Dimensional Integer Lattice"},
    {id:'2607.21358v1',cat:'math.NT',title:"A Weighted Sum Formula for Double Eisenstein Series"},
    {id:'2310.00553v3',cat:'q-fin.PM',title:"Robust Asset-Liability Management"},
  ],
  [
    {id:'2307.09392v2',cat:'q-fin.TR',title:"Is Kyle's equilibrium model stable?"},
    {id:'2602.05226v1',cat:'econ.EM',title:"Predictive Synthesis under Sporadic Participation: Evidence from Inflation Density Surveys"},
    {id:'2607.17378v1',cat:'stat.ML',title:"Econometrics with Pre-Trained Embeddings for Unstructured Data"},
    {id:'2603.02241v1',cat:'q-bio.NC',title:"A Benchmark Analysis of Graph and Non-Graph Methods for Caenorhabditis Elegans Neuron Classification"},
    {id:'2504.19790v1',cat:'q-bio.BM',title:"TDP-43 multidomains and RNA modulate interactions and viscoelasticity in biomolecular condensates"},
  ],
  [
    {id:'2409.05937v1',cat:'q-bio.GN',title:"Hierarchical novel class discovery for single-cell transcriptomic profiles"},
    {id:'2603.02753v1',cat:'q-bio.QM',title:"Deep learning-guided evolutionary optimization for protein design"},
    {id:'2510.24602v1',cat:'q-bio.PE',title:"Learning to generalize in evolution through annealed population heterogeneity"},
    {id:'2606.05541v1',cat:'physics.chem-ph',title:"Methods for Inferring Interaction Potentials from Cross-Linking Mass Spectrometry Data"},
    {id:'2606.09527v1',cat:'cond-mat.soft',title:"Controlled component segregation in vapor-deposited organic semiconductor glass mixtures"},
  ],
  [
    {id:'2607.15489v1',cat:'cond-mat.stat-mech',title:"Circulation Statistics in Rayleigh-Bénard Convection"},
    {id:'2604.04381v1',cat:'physics.soc-ph',title:"Characterization of GS20 and CLYC Detectors for Neutron Resonance Transmission Analysis in High Radiation Environments"},
    {id:'2607.21033v1',cat:'math.NT',title:"Generic ordinarity for abelian coverings of the projective line"},
    {id:'2608.27268v1',cat:'cs.CL',title:"BrailleBench: Investigating Multi-Criteria Braille Comprehension in Large Language Models"},
    {id:'2607.21259v2',cat:'math.NT',title:"On the Fractional Parts of Polynomials Modulo $p$"},
  ],
  [
    {id:'2602.04230v1',cat:'econ.EM',title:"Validating Causal Message Passing Against Network-Aware Methods on Real Experiments"},
    {id:'2604.04538v1',cat:'physics.soc-ph',title:"Disentangling Large-Scale Supply Networks: f-HiCoNE Framework for Flow-Hierarchical Clustering via Combinatorial Hodge Decomposition"},
    {id:'2608.27165v1',cat:'cs.CL',title:"Prediction of Prediction (PoP): Inter-Layer Activation Fusion for Single-Pass Hallucination Detection in Large Language Models"},
    {id:'2608.10521v1',cat:'cs.CR',title:"Synthesizing Probabilistic Saturating Counters with Differentially Private Formal Guarantees"},
    {id:'2606.06848v1',cat:'physics.chem-ph',title:"Distilling first-principles accuracy into compact machine learning potentials for condensed-phase chemistry"},
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
