export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-09',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2604.06224v2',cat:'physics.soc-ph',title:'The new Geological Age that never was or the multiple layers of the Transientocene'},
    {id:'2606.29835v1',cat:'stat.ML',title:'A Sieve-Accelerated Quadrature Method for Exact Privacy Accounting in the 2020 U.S. Decennial Census'},
    {id:'2605.19183v1',cat:'cond-mat.soft',title:'Mass Generation from Embedding Geometry in Surface Nematics'},
    {id:'2607.16069v1',cat:'math.CO',title:'Complex generalised weighing matrices in centraliser algebras of monomial representations'},
    {id:'2605.14687v1',cat:'physics.chem-ph',title:'Generalized Suzuki-Chin Factorization in Bosonic Path Integral Molecular Dynamics'},
  ],
  [
    {id:'2505.15849v2',cat:'q-bio.BM',title:'What Lives? A meta-analysis of diverse opinions on the definition of life'},
    {id:'2311.02088v1',cat:'q-fin.TR',title:'Combining Deep Learning on Order Books with Reinforcement Learning for Profitable Trading'},
    {id:'2312.10739v1',cat:'q-fin.PM',title:'Managing ESG Ratings Disagreement in Sustainable Portfolio Selection'},
    {id:'2602.20218v3',cat:'q-bio.QM',title:'Robust Glioblastoma Segmentation and Volumetry Without T2-FLAIR: External Validation of Targeted Dropout Training'},
    {id:'2607.13336v1',cat:'cs.CR',title:'Delving into the Temporal Challenges of Unified Video Protection Against Image-to-Video and Fine-Tuning-based Customization'},
  ],
  [
    {id:'2511.04327v3',cat:'q-bio.PE',title:'Feasibility and Single Parameter Scaling of Extinctions in Large Ecological Communities'},
    {id:'2601.21272v2',cat:'econ.EM',title:'Finite-Sample Properties of Model Specification Tests for Multivariate Dynamic Regression Models'},
    {id:'2608.01268v1',cat:'cs.LG',title:'How fine a change can moments see? A scale law for detecting distribution shift, with a kernel calibration rule'},
    {id:'2606.21681v1',cat:'cond-mat.stat-mech',title:'Heavy-Tailed Dispersal Kernels from Stopped Subdiffusive Fractional Brownian Motion'},
    {id:'2411.00749v1',cat:'q-bio.GN',title:'PathoGen-X: A Cross-Modal Genomic Feature Trans-Align Network for Enhanced Survival Prediction from Histopathology Images'},
  ],
  [
    {id:'2607.06425v1',cat:'math.OC',title:'Adaptive and Neural Operator Control of Nonlinear Volterra Hyperbolic PDEs'},
    {id:'2606.01693v1',cat:'cs.DS',title:'Scalable Concurrent Queues for GPU'},
    {id:'2608.02050v1',cat:'cs.AI',title:'TextNCA: Neural Cellular Automata for Language Modeling via Hierarchical Local Attention'},
    {id:'2607.26355v1',cat:'cs.CL',title:'Symphony of Bias: Exploring Gender Associations with Musical Instruments in Multimodal LLMs'},
    {id:'2607.02446v2',cat:'math.PR',title:'On a Rosenzweig-Porter-type model'},
  ],
  [
    {id:'2606.25903v1',cat:'math.NT',title:'Chebotarev geodesic theorem: split case'},
    {id:'2602.11478v3',cat:'q-bio.NC',title:'Defining causal mechanism in dual process theory and two types of feedback control'},
    {id:'2603.25542v1',cat:'physics.soc-ph',title:'Migration of Voters in Florida, 2017-2022'},
    {id:'2606.29893v1',cat:'stat.ML',title:'AdaGrad does not adapt to Hölder-smoothness for composite objectives'},
    {id:'2605.19026v1',cat:'cond-mat.soft',title:'Work to insert a particle into an active fluid'},
  ],
  [
    {id:'2607.16103v1',cat:'math.CO',title:'An improved upper bound for the planar Turán number of $C_8$'},
    {id:'2605.14584v1',cat:'physics.chem-ph',title:'All-atomistic Transferable Neural Potentials for Protein Solvation'},
    {id:'2505.12055v1',cat:'q-bio.BM',title:'Prediction of Novel CXCR7 Inhibitors Using QSAR Modeling and Validation via Molecular Docking'},
    {id:'2311.04727v2',cat:'q-fin.TR',title:'Forecasting Volatility with Machine Learning and Rough Volatility: Example from the Crypto-Winter'},
    {id:'2312.09707v1',cat:'q-fin.PM',title:'A return-diversification approach to portfolio selection'},
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
