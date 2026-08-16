export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-15',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2605.25081v1',cat:'cond-mat.soft',title:"Separable Force Matching of PBE0 Hybrid-Functional Reference Forces for Path-Integral Simulations"},
    {id:'2606.27626v1',cat:'cond-mat.stat-mech',title:"Self-organized robustness in mean-field interacting systems"},
    {id:'2608.09095v1',cat:'cs.AI',title:"Who Bridges Safety? Identifying and Targeting Cross-Lingual Shared Safety Pathways"},
    {id:'2608.03599v1',cat:'cs.CL',title:"Disentangling Language Modeling and Boundaries"},
    {id:'2607.18847v1',cat:'cs.CR',title:"Data Leakage Prevention in Agentic Applications via Preemptive Hardening"},
  ],
  [
    {id:'2606.11974v1',cat:'cs.DS',title:"Near-Optimal Distributed 2-Ruling Sets on Graphs with Low Arboricity"},
    {id:'2608.08176v1',cat:'cs.LG',title:"Matching Supervision to the Student's Learning Capacity: A Unified Framework for On-Policy Distillation"},
    {id:'2602.00836v1',cat:'econ.EM',title:"Dynamic causal inference with time series data"},
    {id:'2607.23081v1',cat:'math.CO',title:"The Exact Maximum of the Spectral Sum of Graphs"},
    {id:'2607.00282v1',cat:'math.NT',title:"Critical Zeros and Unconditional Mean Value Theorems for twisted PGL(2) and related L-functions"},
  ],
  [
    {id:'2607.12413v1',cat:'math.OC',title:"Control and homogenization of a coupled hyperbolic system with an oscillating coefficient"},
    {id:'2607.09868v1',cat:'math.PR',title:"Determinacy Witnesses in the Completely Monotone--Stieltjes--Bernstein Hierarchy"},
    {id:'2605.18569v1',cat:'physics.chem-ph',title:"Reinforcement Learning Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics"},
    {id:'2603.29055v2',cat:'physics.soc-ph',title:"Macroscopic Traffic Flow Network Modeling For Wildfire Evacuation: A Game-Theoretic Approach"},
    {id:'2505.08956v2',cat:'q-bio.BM',title:"QMProt: A Comprehensive Dataset of Quantum Properties for Proteins"},
  ],
  [
    {id:'2410.21345v1',cat:'q-bio.GN',title:"Absorb & Escape: Overcoming Single Model Limitations in Generating Genomic Sequences"},
    {id:'2602.13887v1',cat:'q-bio.NC',title:"Human-Aligned Evaluation of a Pixel-wise DNN Color Constancy Model"},
    {id:'2511.03073v2',cat:'q-bio.PE',title:"Evolution under Stochastic Transmission: Mutation-Rate Modifiers"},
    {id:'2603.00193v1',cat:'q-bio.QM',title:"Multimodal Alignment Improves Generalizability of Genomic Biomarker Prediction in Computational Pathology"},
    {id:'2402.05113v1',cat:'q-fin.PM',title:"Portfolio Time Consistency and Utility Weighted Discount Rates"},
  ],
  [
    {id:'2310.06079v4',cat:'q-fin.TR',title:"Anomalous diffusion and price impact in the fluid-limit of an order book"},
    {id:'2607.02891v1',cat:'stat.ML',title:"Dynamic Regret for Non-Stationary Linear Bandits via Misspecification Reductions"},
    {id:'2605.24987v1',cat:'cond-mat.soft',title:"DNA end tethering through break-induced DNA--protein condensation"},
    {id:'2606.28426v1',cat:'cond-mat.stat-mech',title:"Comparison of different exact generalized Langevin equations with a non-linear potential"},
    {id:'2608.09093v1',cat:'cs.AI',title:"The Announcement Carries the Cue: Markup, Boundaries, and the Notation of Pre-Training"},
  ],
  [
    {id:'2608.03577v1',cat:'cs.CL',title:"Looking under the Wrong Lamppost: On the Limitations of Automated Translation Quality Estimation"},
    {id:'2607.18846v1',cat:'cs.CR',title:"Private Approximation of Graph Spectra and Cuts via Spectral Amplifiers"},
    {id:'2606.11820v1',cat:'cs.DS',title:"On finding exact solutions of linear programs in the oracle model"},
    {id:'2608.08167v1',cat:'cs.LG',title:"Wiener Representation Filtering for VLM Hallucination Suppression"},
    {id:'2602.00775v1',cat:'econ.EM',title:"Stable Time Series Prediction of Enterprise Carbon Emissions Based on Causal Inference"},
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
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable'],
      },
    },
  },
  required: ['ideas'],
}

function batchPrompt(batch) {
  const list = batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are 5 papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper (or combination of papers if a crossover idea is stronger), propose 2-4 ideas total across the batch, each tagged with one type:
- project: something buildable as a tool/library/service
- startup: a business angle
- youtube: a video/explainer concept
- demo: an interactive web toy that lets someone FEEL the paper's actual mathematical/scientific result

Score each idea 1-10 on:
- cool: how cool/shareable/wow is it
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) — demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
