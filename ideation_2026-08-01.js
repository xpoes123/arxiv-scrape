export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-01',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.23370v1',cat:'cs.LG',title:'Bitcoin Price Direction Prediction via Regime-Aware Multi-Modal Fusion of Social and Market Data'},
    {id:'2607.24097v1',cat:'cs.AI',title:'MemChain: Learning Interpretable Memory Traces for Memory-Augmented LLM Agents'},
    {id:'2607.17219v2',cat:'cs.CL',title:'Auditing Question-Order Effects in Large Language Models with the QQ Equality'},
    {id:'2607.05914v1',cat:'cs.CR',title:'Reproducible Validation of Voucher-Based L2 Interoperability: Diagnosing an ERC-Based Exploit'},
    {id:'2605.27147v2',cat:'cs.DS',title:'Virtual-Memory Powersort'},
  ],
  [
    {id:'2607.09972v1',cat:'math.CO',title:'Free products, extremal matroids, and a generalization of perfect matroid designs'},
    {id:'2607.01478v1',cat:'math.OC',title:'Boundary-Aware Quantization: Finite-Scale Decision Geometry of Neural Classifiers'},
    {id:'2606.28869v1',cat:'math.PR',title:'A General Theory of Paths: Signatures, Jump Lifts, and Expected Signatures of Semimartingales'},
    {id:'2606.18500v1',cat:'math.NT',title:'On the Diophantine Inequality |x^2 - 2^a·3^b| < 3max{a,b}'},
    {id:'2401.00949v3',cat:'q-fin.PM',title:"A Portfolio's Common Causal Conditional Risk-neutral PDE"},
  ],
  [
    {id:'2402.10215v1',cat:'q-fin.TR',title:'The Mean Field Market Model Revisited'},
    {id:'2601.17773v1',cat:'econ.EM',title:'MarketGANs: Multivariate financial time-series data augmentation using generative adversarial networks'},
    {id:'2606.23627v1',cat:'stat.ML',title:'Diffusion Models Adapt to Low-Dimensional Structure Under Flexible Coefficient Choices'},
    {id:'2602.07816v3',cat:'q-bio.NC',title:'Beyond Expertise: Stable Individual Differences in Predictive Eye-Hand Coordination'},
    {id:'2505.18470v2',cat:'q-bio.BM',title:'Chemical classification program synthesis using generative artificial intelligence'},
  ],
  [
    {id:'2411.08073v1',cat:'q-bio.GN',title:'LoRA-BERT: a Natural Language Processing Model for Robust and Accurate Prediction'},
    {id:'2602.19295v1',cat:'q-bio.QM',title:'Time-Varying Hazard Patterns and Co-Mutation Profiles of KRAS G12C and G12D'},
    {id:'2511.11130v1',cat:'q-bio.PE',title:'Animal social networks as intersection graphs of random walks'},
    {id:'2605.11470v1',cat:'physics.chem-ph',title:'One-Step Relativistic Driven Similarity Renormalization Group Multireference Perturbation Theory'},
    {id:'2605.14130v1',cat:'cond-mat.soft',title:'The Role of Hydrogen Bridging Bonds in the Shear-Thickening and Jamming of Dense Suspensions'},
  ],
  [
    {id:'2606.16752v1',cat:'cond-mat.stat-mech',title:'Refining Unified Colored-Noise Approximation'},
    {id:'2603.24529v1',cat:'physics.soc-ph',title:'Cascading Failures and Critical Infrastructures in Future Renewable European Power Grids'},
    {id:'2602.08910v1',cat:'q-bio.NC',title:'Structural coarse-graining enables noise-robust functional connectivity and reveals hidden inter-subject variability'},
    {id:'2602.20218v3',cat:'q-bio.QM',title:'Robust Glioblastoma Segmentation and Volumetry Without T2-FLAIR: External Validation'},
    {id:'2606.20721v1',cat:'math.NT',title:'Unbounded Oscillation of Euler-Gompertz Diophantine Errors from Bell and Gould Numbers'},
  ],
  [
    {id:'2606.28945v1',cat:'math.PR',title:'The heat-kernel master field on Z^d at strong coupling'},
    {id:'2411.06785v2',cat:'q-bio.GN',title:'White-Box Diffusion Transformer for single-cell RNA-seq generation'},
    {id:'2511.08802v1',cat:'q-bio.PE',title:'Backcasting biodiversity at high spatiotemporal resolution using flexible site-occupancy models'},
    {id:'2606.16785v1',cat:'cond-mat.stat-mech',title:'Extracting Boundary Conformal Data from Periodic Non-Hermitian Critical Chains'},
    {id:'2411.11169v1',cat:'q-bio.GN',title:'Validating GWAS Findings through Reverse Engineering of Contingency Tables'},
  ],
]

const IDEA_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper_id: { type: 'string' },
          pitch: { type: 'string' },
          cool_score: { type: 'number' },
          buildable_score: { type: 'number' },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score'],
      },
    },
  },
  required: ['ideas'],
}

phase('Ideate')
const results = await pipeline(
  BATCHES,
  (batch, _item, idx) => agent(
    `You are mining arXiv papers for cool, buildable ideas. Here are 5 fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on cool_score (1-10, how cool/shareable) and buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend). Be creative and specific — reference the actual math/result, not just the title. Return via the schema.`,
    { label: `batch-${idx}`, schema: IDEA_SCHEMA }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
