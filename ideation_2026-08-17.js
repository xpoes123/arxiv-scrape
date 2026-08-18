export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-17',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.09053v1',cat:'cs.LG',title:"Diagnosing as Cardiologists Do: ECG Agents with Doctor-Grounded Priors for Clinical Reasoning Across Diseases and Populations"},
    {id:'2608.09921v1',cat:'cs.AI',title:"GENCO - A Unified Neural Solver Embedded in a Development Framework for Steady-State Grid Analysis"},
    {id:'2608.04192v1',cat:'cs.CL',title:"Behavioral Skill Reconstruction: Reconstructing Hidden Functionality from LLM Agent Skills"},
    {id:'2607.19742v1',cat:'cs.CR',title:"An Automated Framework for Extracting Reachable Attack Chains from Cyber Threat Intelligence Reports"},
    {id:'2606.12694v1',cat:'cs.DS',title:"A unified complexity bound for logconcave sampling"},
  ],
  [
    {id:'2607.23663v2',cat:'math.CO',title:"Erd\u0151s--Ko--Rado theorems in $\\ell_2$-norm for three finite spaces"},
    {id:'2607.12942v1',cat:'math.OC',title:"Strict complementarity in semidefinite programming, singularity degree, and the (dis)connection of forward and backward errors"},
    {id:'2607.10512v1',cat:'math.PR',title:"Strong uniqueness and large deviation principle for mutually catalytic super Markov chains"},
    {id:'2607.01424v1',cat:'math.NT',title:"Utilizing Smoothing Techniques to Bound $|\u03b6(1+it)|$"},
    {id:'2311.13564v3',cat:'q-fin.PM',title:"High order universal portfolios"},
  ],
  [
    {id:'2309.14334v1',cat:'q-fin.TR',title:"Tasks Makyth Models: Machine Learning Assisted Surrogates for Tipping Points"},
    {id:'2602.02607v1',cat:'econ.EM',title:"The Innovation Tax: Generative AI Adoption, Productivity Paradox, and Systemic Risk in the U.S. Banking Sector"},
    {id:'2607.03596v1',cat:'stat.ML',title:"Empirical Bayes for correlated Gaussian sequence model"},
    {id:'2602.12811v2',cat:'q-bio.NC',title:"Left-right asymmetry in predicting brain activity from LLMs' representations emerges with their formal linguistic competence"},
    {id:'2505.07748v1',cat:'q-bio.BM',title:"In Silico Prediction and Validation of LmGt Inhibitors Using QSAR and Molecular Docking Approaches"},
  ],
  [
    {id:'2410.19236v4',cat:'q-bio.GN',title:"SHAP zero Explains Biological Sequence Models with Near-zero Marginal Cost for Future Queries"},
    {id:'2602.21993v1',cat:'q-bio.QM',title:"Prediction of source nutrients for microorganisms using metabolic networks"},
    {id:'2511.02882v1',cat:'q-bio.PE',title:"Asymptotic analysis of a stochastic SVEIS epidemic model using Black-Karasinski process"},
    {id:'2605.19361v3',cat:'physics.chem-ph',title:"Translating Spin-Adapted RPA to Spin-Adapted TDDFT"},
    {id:'2605.25215v1',cat:'cond-mat.soft',title:"First-passage time distribution of a Brownian particle harmonically confined in a viscoelastic bath"},
  ],
  [
    {id:'2606.28103v1',cat:'cond-mat.stat-mech',title:"Phase structure of the Random Language Model"},
    {id:'2603.28984v1',cat:'physics.soc-ph',title:"Truth and distortion in complex networks: a global consistency approach"},
    {id:'2608.09036v1',cat:'cs.LG',title:"Decision-Focused Learning in Network Interdiction Games"},
    {id:'2608.09902v1',cat:'cs.AI',title:"DSLE: A Learning Environment for Dark Souls Boss Encounters"},
    {id:'2608.04186v2',cat:'cs.CL',title:"Large Language Models for Low-Resource Languages: A Conceptual Framework for an Electronic Explanatory Dictionary of the Tajik Language"},
  ],
  [
    {id:'2607.20574v1',cat:'cs.CR',title:"AuthProbe: Specification-Driven, Multi-Identity Detection of Broken Object-Level Authorization in Recruitment API"},
    {id:'2606.12692v1',cat:'cs.DS',title:"Random Proposals: A Softmax-Based Local-Improvement Framework for Maximum Weighted Matching"},
    {id:'2607.23623v2',cat:'math.CO',title:"Total outer-independent coalition in graphs"},
    {id:'2607.12938v1',cat:'math.OC',title:"Sharp Optimal Algorithm for Derivative-Free Stochastic Convex Optimization in One Dimension"},
    {id:'2607.10510v1',cat:'math.PR',title:"Rigorous bound on the aspect ratio for the formation of a nematic phase in hard rod and hard rectangle systems on $\\mathbb{Z}^2$"},
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
