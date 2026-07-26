export const meta = {
  name: 'arxiv-nightly-ideation-2026-07-26',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.16455v1',cat:'cs.LG',title:'Compact convolutional neural networks for AI-based drone detection systems'},
    {id:'2607.16955v1',cat:'cs.AI',title:'CADENCE: Closing the Reasoning Gap via Coverage-Adaptive On-Policy Distillation'},
    {id:'2607.10194v1',cat:'cs.CL',title:'Instruction Set and Language for Hypergraphs'},
    {id:'2606.31159v1',cat:'cs.CR',title:'An Empirical Study of Security Calibration in Large Language Models for Code'},
    {id:'2605.18042v1',cat:'cs.DS',title:'On efficient robust regression with subquadratic samples'},
  ],
  [
    {id:'2607.04347v1',cat:'math.CO',title:'Strong Subgraph-Count Stability in C_{2l+1}-Free Graphs'},
    {id:'2606.27551v2',cat:'math.OC',title:'Any-dimensional Positivstellensatze for symmetric functions'},
    {id:'2606.21778v1',cat:'math.PR',title:'Pontryagin Maximum Principle in Free Probability Theory'},
    {id:'2606.10584v1',cat:'math.NT',title:'Hilbert irreducibility for algebraic points'},
    {id:'2402.16609v1',cat:'q-fin.PM',title:'Combining Transformer based Deep Reinforcement Learning with Black-Litterman for Portfolio Optimization'},
  ],
  [
    {id:'2401.06724v2',cat:'q-fin.TR',title:'Equity auction dynamics: latent liquidity models with activity acceleration'},
    {id:'2601.16749v1',cat:'econ.EM',title:'Finite Population Inference for Factorial Designs and Panel Experiments with Imperfect Compliance'},
    {id:'2607.14122v1',cat:'stat.ML',title:'Generalized Neural Distributional Regression'},
    {id:'2602.04270v1',cat:'q-bio.NC',title:'Multi-Integration of Labels across Categories for Component Identification (MILC)'},
    {id:'2506.02052v3',cat:'q-bio.BM',title:'General Protein Pretraining or Domain-Specific Designs? Benchmarking Protein Models'},
  ],
  [
    {id:'2411.16793v1',cat:'q-bio.GN',title:'ST-Align: A Multimodal Foundation Model for Image-Gene Alignment in Spatial Transcriptomics'},
    {id:'2602.18727v1',cat:'q-bio.QM',title:'Statistical methods for reference-free single-molecule localisation microscopy'},
    {id:'2511.12183v1',cat:'q-bio.PE',title:'DNA Replication Timing, Genome Stability and Non-adaptive Radiation'},
    {id:'2605.06215v2',cat:'physics.chem-ph',title:'COF26: A new on-top functional for multiconfiguration pair-density functional theory'},
    {id:'2605.07759v1',cat:'cond-mat.soft',title:'Elastocapillary morphing of self-encapsulated droplets floating at the interface'},
  ],
  [
    {id:'2606.09040v1',cat:'cond-mat.stat-mech',title:'Natural Selection in the Wake of Catastrophe'},
    {id:'2603.21552v1',cat:'physics.soc-ph',title:'Emergent Detailed Balance in Human Mobility under Temporal Coarse-Graining'},
    {id:'2607.16449v1',cat:'cs.LG',title:'EA-RMENet -- Path Loss Prediction in Urban Environments using Deep Learning'},
    {id:'2607.16941v1',cat:'cs.AI',title:'Investigation of Polycystic Ovary Syndrome (PCOS) Diagnosis Using Machine Learning'},
    {id:'2607.10179v1',cat:'cs.CL',title:'From Patent Expiry to Business Pathways: AI Workflows for Activating Innovation'},
  ],
  [
    {id:'2606.31066v1',cat:'cs.CR',title:'Secure-CHG: A Comprehensive Framework for Robust and Fair Federated Learning'},
    {id:'2605.18034v1',cat:'cs.DS',title:'On Occurrence-Preserving Morphisms'},
    {id:'2607.04324v2',cat:'math.CO',title:'Connected graphs with a large dissociation number attaining the minimum'},
    {id:'2606.27503v1',cat:'math.OC',title:'Tropical Fermat-Weber Problems over Non-Finite Data and their Inverse'},
    {id:'2606.21759v2',cat:'math.PR',title:'Note On Gaussian Random Fields & Underlying Markov Processes'},
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
