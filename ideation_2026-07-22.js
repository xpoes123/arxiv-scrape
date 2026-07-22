export const meta = {
  name: 'arxiv-nightly-ideation-0722',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2607.14345",cat:"cs.LG",title:"Value Leakage: An LLM's Answers Are Silently Shaped by Its Own Values"},
    {id:"2607.14659",cat:"cs.AI",title:"LLM-Driven Approach to Modeling Tool Interoperability in Automotive Domain"},
    {id:"2607.07895",cat:"cs.CL",title:"Scalable and Culturally Specific Stereotype Dataset Construction via Human-LLM Collaboration"},
    {id:"2606.29504",cat:"cs.CR",title:"Empirical Evaluation of Multi-Modal Touch Detection in Over-the-Shoulder Video Surveillance"},
    {id:"2605.17051",cat:"cs.DS",title:"Online Graph Embedding in Star Graphs"},
  ],
  [
    {id:"2607.02410",cat:"math.CO",title:"Polynomial mixing for polygonal side matchings"},
    {id:"2606.25753",cat:"math.OC",title:"Gradient-based inverse lithography for EUV masks via the waveguide method and a physics-informed neural operator"},
    {id:"2606.20169",cat:"math.PR",title:"Theory of uncertain probability: can we derive the probability density function of uncertain random experiments with continuously changing conditions?"},
    {id:"2606.09214",cat:"math.NT",title:"Insufficiency of the algebraic Brauer--Manin obstruction for homogeneous spaces"},
    {id:"2403.10482",cat:"q-fin.PM",title:"Can a GPT4-Powered AI Agent Be a Good Enough Performance Attribution Analyst?"},
  ],
  [
    {id:"2403.18831",cat:"q-fin.TR",title:"DeepTraderX: Challenging Conventional Trading Strategies with Deep Learning in Multi-Threaded Market Simulations"},
    {id:"2602.23382",cat:"q-bio.NC",title:"Audited calibration under regime shift as a computational test of support-structured broadcast"},
    {id:"2506.03237",cat:"q-bio.BM",title:"UniSite: The First Cross-Structure Dataset and Learning Framework for End-to-End Ligand Binding Site Detection"},
    {id:"2412.01352",cat:"q-bio.GN",title:"The influence of chromosomal inversions on genetic variation and clinal patterns in genomic data of Drosophila melanogaster"},
    {id:"2602.18889",cat:"q-bio.QM",title:"Topological shape transform for thymus structures"},
  ],
  [
    {id:"2511.14090",cat:"q-bio.PE",title:"Evolutionary Hysteresis: Cycling about in a Rugged Landscape"},
    {id:"2605.04483",cat:"physics.chem-ph",title:"CDFCI: High-Performance Parallel Software for Many-Body Large-Scale Eigenvalue Problems"},
    {id:"2605.06867",cat:"cond-mat.soft",title:"Asymptotic analysis of the energy for a ferroelectric nematic"},
    {id:"2606.08004",cat:"cond-mat.stat-mech",title:"Tracking metastable phases by complex Lee-Yang zeros"},
    {id:"2603.21896",cat:"physics.soc-ph",title:"Scientific Research as a Weapon in Russia's Hybrid War in Europe: an Example of the Joint Institute for Nuclear Research in Dubna, Russia"},
  ],
  [
    {id:"2607.14338",cat:"cs.LG",title:"Beyond scalar losses: calibrating segmentation models via gradient vector field surgery"},
    {id:"2607.14658",cat:"cs.AI",title:"TopoAgent: A Self-Evolving Topological Agent for Multimodal Scientific Reasoning"},
    {id:"2607.07891",cat:"cs.CL",title:"How Do I Know What to Say Next? Barenholtz's Autogenerative Theory as an Enrichment of Harrisean Integrationism"},
    {id:"2606.29484",cat:"cs.CR",title:"The Calibrated Deepfake Trust Score (CDTS): Competence-Coupled Trust Degradation Across Deepfake Detectors"},
    {id:"2605.16791",cat:"cs.DS",title:"Improved Parallel Algorithms for EF1 Allocations"},
  ],
  [
    {id:"2607.02400",cat:"math.CO",title:"From Ham-Sandwich to Centerpoints: Semialgebraic Algorithms for Cutting Polytopal Measures"},
    {id:"2606.25731",cat:"math.OC",title:"Pontryagin-Based Solver with Smoothed Hamiltonian, Adaptive $Δt$, and PA-Bundle Refinement"},
    {id:"2606.20062",cat:"math.PR",title:"Optimal Coarse Correlated Equilibria in Mean Field Games: Linear Programming and No-Regret Learning"},
    {id:"2606.09136",cat:"math.NT",title:"Fourier Coefficients of Siegel-Eisenstein Series of Degree $2m$ and Weight $m+1$"},
    {id:"2403.10273",cat:"q-fin.PM",title:"Optimal Portfolio Choice with Cross-Impact Propagators"},
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
