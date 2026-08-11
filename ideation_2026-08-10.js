export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-10',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.13965v1',cat:'cs.CR',title:'ProfMalPlus: Agent-Coordinated Detection of Malicious NPM Packages'},
    {id:'2607.04002v1',cat:'math.PR',title:'Collisions of random walks in unimodular random graphs: applications'},
    {id:'2312.10749v1',cat:'q-fin.PM',title:'A new behavioral model for portfolio selection using the Half-Full/Half-Empty framework'},
    {id:'2312.03294v1',cat:'q-fin.PM',title:'A General Framework for Portfolio Construction Based on Generative Models'},
    {id:'2608.03269v1',cat:'cs.AI',title:'Efficient Video Dataset Distillation via Cluster-Guided Prototype Blending'},
  ],
  [
    {id:'2608.02100v1',cat:'cs.LG',title:'From Information to Delegation: Mapping Human-AI Financial Decision Making'},
    {id:'2410.23433v1',cat:'q-bio.GN',title:'Assessing Concordance between RNA-Seq and NanoString Technologies'},
    {id:'2607.04076v1',cat:'math.PR',title:'A note on probabilistic powerdomains, RB-domains, and bc-domains'},
    {id:'2505.15849v2',cat:'q-bio.BM',title:'What Lives? A meta-analysis of diverse opinions on the definition of life'},
    {id:'2505.13940v2',cat:'q-bio.BM',title:'DrugPilot: LLM-based Parameterized Reasoning Agent for Drug Discovery'},
  ],
  [
    {id:'2505.12055v1',cat:'q-bio.BM',title:'Prediction of Novel CXCR7 Inhibitors Using QSAR Modeling and Validation via Molecular Docking'},
    {id:'2607.27591v1',cat:'cs.CL',title:'Prox: Training-Free FFN Activation Sparsity via Approximate Intermediate Outputs'},
    {id:'2608.02135v1',cat:'cs.LG',title:'Cardiovascular Digital Twins from Physics Based to Data Driven Approaches'},
    {id:'2607.13987v1',cat:'cs.CR',title:'Agent Skill Security: Threat Models, Attacks, Defenses, and Evaluation'},
    {id:'2602.11478v3',cat:'q-bio.NC',title:'Defining causal mechanism in dual process theory and two types of feedback control'},
  ],
  [
    {id:'2607.27595v1',cat:'cs.CL',title:'Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation'},
    {id:'2410.22452v2',cat:'q-bio.GN',title:'Explainable convolutional neural network model provides an alternative'},
    {id:'2602.21393v1',cat:'q-bio.QM',title:'An information-based model selection criterion for data-driven model discovery'},
    {id:'2607.07337v1',cat:'math.OC',title:'The linear regulator problem for passive systems with strong stability'},
    {id:'2601.21272v2',cat:'econ.EM',title:'Finite-Sample Properties of Model Specification Tests for Multivariate Dynamic Regression Models'},
  ],
  [
    {id:'2607.03924v1',cat:'math.PR',title:'Tree Coordinates and Range Martingales for Positive Operator-Valued Measures'},
    {id:'2602.22263v2',cat:'q-bio.QM',title:'CryoNet.Refine: A One-step Diffusion Model for Rapid Refinement of Structures'},
    {id:'2310.10500v2',cat:'q-fin.TR',title:'Few-Shot Learning Patterns in Financial Time-Series for Trend-Following'},
    {id:'2606.22407v1',cat:'cond-mat.stat-mech',title:'Perturbative Renormalization and Universality Diagram for Long-Range Quantum systems'},
    {id:'2606.24926v2',cat:'cond-mat.stat-mech',title:'A Minimal Active-Particle Realization of Non-Hermitian Chern Bulk-Boundary Correspondence'},
  ],
  [
    {id:'2607.07358v1',cat:'math.OC',title:'Maximal monotonicity of piecewise polyhedral mappings'},
    {id:'2607.04012v1',cat:'math.PR',title:'Hölder regularity for backward stochastic Volterra integral equations'},
    {id:'2607.27614v1',cat:'cs.CL',title:'DualAnchor: Preserving Language Priors and Improving Lexical Fidelity'},
    {id:'2606.27087v1',cat:'math.NT',title:'Inequalities among higher-order difference sets, or, remarks on a construction'},
    {id:'2606.29893v1',cat:'stat.ML',title:'AdaGrad does not adapt to Hölder-smoothness for composite objectives'},
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
