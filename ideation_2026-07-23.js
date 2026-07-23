export const meta = {
  name: 'arxiv-nightly-ideation-2026-07-23',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.15485v1',cat:'cs.LG',title:'Diffusion models recover accurate mixture weights despite score function insensitivity'},
    {id:'2607.15592v1',cat:'cs.AI',title:'MGDT: MLLM-Guided Diffusion Transformer with Relation-Adaptive Mixture-of-Experts for Multimodal Knowledge Graph Completion'},
    {id:'2607.08625v1',cat:'cs.CL',title:'The complexities of patient-centred conversational artificial intelligence'},
    {id:'2606.30566v2',cat:'cs.CR',title:'Forensic Trajectory Signatures for Agent Memory Poisoning Detection'},
    {id:'2605.17492v1',cat:'cs.DS',title:'Finding the Balance Rate of Uncertain Signed Graphs'},
  ],
  [
    {id:'2607.03603v1',cat:'math.CO',title:'The disjoint separators problem in graphs'},
    {id:'2606.26991v1',cat:'math.OC',title:'Enabling self-supervised learned primal dual with Noise2Inverse'},
    {id:'2606.21049v1',cat:'math.PR',title:'Locality of rough path lifts'},
    {id:'2606.09693v1',cat:'math.NT',title:'Bertini theorems for Hilbert-Samuel multiplicity over finite fields'},
    {id:'2402.17194v1',cat:'q-fin.PM',title:'The Random Forest Model for Analyzing and Forecasting the US Stock Market in the Context of Smart Finance'},
  ],
  [
    {id:'2402.03953v4',cat:'q-fin.TR',title:"Exploring the Impact: How Decentralized Exchange Designs Shape Traders' Behavior on Perpetual Future Contracts"},
    {id:'2601.16613v1',cat:'econ.EM',title:'Is the diurnal pattern sufficient to explain intraday variation in volatility? A nonparametric assessment'},
    {id:'2606.17777v1',cat:'stat.ML',title:'On Response-Adaptive Targeting Strategies for Multi-Treatment Experiments'},
    {id:'2602.07233v1',cat:'q-bio.NC',title:'Extracting Root-Causal Brain Activity Driving Psychopathology from Resting State fMRI'},
    {id:'2506.00925v1',cat:'q-bio.BM',title:'ProtInvTree: Deliberate Protein Inverse Folding with Reward-guided Tree Search'},
  ],
  [
    {id:'2412.00651v1',cat:'q-bio.GN',title:'Towards Unified Molecule-Enhanced Pathology Image Representation Learning via Integrating Spatial Transcriptomics'},
    {id:'2602.18643v1',cat:'q-bio.QM',title:'Project Hermes: A Model-Agnostic Validation Layer for Wearable Health Prediction Systems'},
    {id:'2511.12536v1',cat:'q-bio.PE',title:'A mark and recapture perspective on vaccination touchpoints'},
    {id:'2605.05658v2',cat:'physics.chem-ph',title:'Quantum-classical solvation hydrodynamics: a Hamiltonian modeling framework'},
    {id:'2605.09172v1',cat:'cond-mat.soft',title:'Lubrication-Induced Newtonianization Enables Passive Transport of Non-Newtonian materials'},
  ],
  [
    {id:'2606.08342v1',cat:'cond-mat.stat-mech',title:'A spectral model of power-law decay in natural and engineered systems'},
    {id:'2603.21552v1',cat:'physics.soc-ph',title:'Emergent Detailed Balance in Human Mobility under Temporal Coarse-Graining'},
    {id:'2411.19427v1',cat:'q-bio.GN',title:'MAFcounter: An efficient tool for counting the occurrences of k-mers in MAF files'},
    {id:'2602.18915v1',cat:'q-bio.QM',title:'AAVGen: Precision Engineering of Adeno-associated Viral Capsids for Renal Selective Targeting'},
    {id:'2602.19295v1',cat:'q-bio.QM',title:'Time-Varying Hazard Patterns and Co-Mutation Profiles of KRAS G12C and G12D in Real-World NSCLC'},
  ],
  [
    {id:'2607.15593v1',cat:'cs.AI',title:'Scalable LLM Agent Tool Access in the Cloud'},
    {id:'2506.01177v2',cat:'q-bio.BM',title:'Bridging Quantum and Classical Computing in Drug Design: Architecture Principles for Improved Molecule Generation'},
    {id:'2401.08302v1',cat:'q-fin.TR',title:'Do backrun auctions protect traders?'},
    {id:'2607.15482v1',cat:'cs.LG',title:'Inpainting Insights: Elevating Visual XAI with Photorealistic Perturbations'},
    {id:'2401.14761v1',cat:'q-fin.TR',title:'ESG driven pairs algorithm for sustainable trading: Analysis from the Indian market'},
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
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
