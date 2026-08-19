export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-19',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.12447v2',cat:'cs.LG',title:"Geometric and Behavioral Stratification in Transformer Residual Streams"},
    {id:'2608.13438v1',cat:'cs.AI',title:"ContactGuard: Pre-Contact Execution Monitoring with Action-Conditioned Latent World Models"},
    {id:'2608.06867v1',cat:'cs.CL',title:"LLMRouter: Unified Infrastructure for Developing, Evaluating, and Deploying LLM Routers"},
    {id:'2607.24866v1',cat:'cs.CR',title:"The Missing Layer: Specification Infrastructure for AI Oversight"},
    {id:'2606.14995v1',cat:'cs.DS',title:"Optimality of Random Regular Graphs in Sparse Network Designs"},
  ],
  [
    {id:'2607.27014v1',cat:'math.CO',title:"Upper bounds for the monotone rank of the unique disjointness matrix"},
    {id:'2607.16177v1',cat:'math.OC',title:"Physics-enhanced reinforcement learning for real-time optimal control of dynamical systems"},
    {id:'2607.13886v1',cat:'math.PR',title:"Dynamic Universal Approximation via Signature Controlled Differential Equations"},
    {id:'2607.03830v1',cat:'math.NT',title:"Modular elliptic curves and hyperbolic uniformization"},
    {id:'2311.12450v2',cat:'q-fin.PM',title:"Hedging carbon risk with a network approach"},
  ],
  [
    {id:'2309.10220v1',cat:'q-fin.TR',title:"Comparing effects of price limit and circuit breaker in stock exchanges by an agent-based model"},
    {id:'2602.02805v1',cat:'econ.EM',title:"Predicting Well-Being with Mobile Phone Data: Evidence from Four Countries"},
    {id:'2607.06290v1',cat:'stat.ML',title:"Quantitative Gaussian-Process limits of Tensor Programs"},
    {id:'2602.13887v1',cat:'q-bio.NC',title:"Human-Aligned Evaluation of a Pixel-wise DNN Color Constancy Model"},
    {id:'2505.06949v1',cat:'q-bio.BM',title:"Causal knowledge graph analysis identifies adverse drug effects"},
  ],
  [
    {id:'2410.16917v2',cat:'q-bio.GN',title:"DNAHLM -- DNA sequence and Human Language mixed large language Model"},
    {id:'2603.02274v3',cat:'q-bio.QM',title:"Contextual Invertible World Models: A Neuro-Symbolic Agentic Framework for Colorectal Cancer Drug Response"},
    {id:'2511.02437v1',cat:'q-bio.PE',title:"Asymptotic behavior for a general class of spreading models"},
    {id:'2605.22584v2',cat:'physics.chem-ph',title:"On the Regularity and Interpolation of Coupled Cluster Amplitudes in Canonical Orbital Basis"},
    {id:'2605.27108v1',cat:'cond-mat.soft',title:"Quantifying the liquid flow between a soap film and a vertical meniscus"},
  ],
  [
    {id:'2606.31832v2',cat:'cond-mat.stat-mech',title:"Navigating committor landscape of biomolecules with a general pairwise interaction model"},
    {id:'2604.00652v1',cat:'physics.soc-ph',title:"Simple spatial processes can generate heterogeneous contact distributions in face-to-face interactions"},
    {id:'2608.12446v1',cat:'cs.LG',title:"Personalized Scorer Modeling: A Learning-Based Framework for Deriving Robust Sleep Stage Labels from Multiple Experts"},
    {id:'2608.13433v1',cat:'cs.AI',title:"Algebraic Decomposition Theory for Transformer Length Generalization"},
    {id:'2608.06849v1',cat:'cs.CL',title:"Autonomy-of-Heads: Data-Free Sparse Attention from Frozen Query-Key Geometry"},
  ],
  [
    {id:'2607.23787v2',cat:'cs.CR',title:"Bitcoin Mempool Linearization"},
    {id:'2606.14951v1',cat:'cs.DS',title:"Differentially Private Submodular Maximization with a Knapsack Constraint"},
    {id:'2607.26956v1',cat:'math.CO',title:"An Optimal Bound for Ramsey Goodness of Cycles"},
    {id:'2607.16171v1',cat:'math.OC',title:"A Globally Asymptotically Stable Planar Homogeneous Polynomial Vector Field With No Polynomial Lyapunov Function"},
    {id:'2607.13849v1',cat:'math.PR',title:"Rearranged Stochastic Heat Equations with an Entropy Gradient Structure"},
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
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) -- demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
