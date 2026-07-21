export const meta = {
  name: 'arxiv-nightly-ideation-2026-07-21',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2605.15859v1",cat:"cs.DS",title:"Complexity of Non-Log-Concave Sampling in Fisher Information"},
    {id:"2607.01169v2",cat:"math.CO",title:"Vector-valued smoothing for finite Sidon sets"},
    {id:"2606.24879v1",cat:"math.OC",title:"New Bounds for the Last Iterate of the Stochastic subGradient Method"},
    {id:"2606.19075v2",cat:"math.PR",title:"Random Schrödinger operators on manifolds and abstract bounds for multiplier-type operators"},
    {id:"2606.08650v1",cat:"math.NT",title:"Restriction estimates for toral eigenfunctions and lattice points in spherical regions"},
  ],
  [
    {id:"2403.11622v2",cat:"q-fin.PM",title:"Asset management with an ESG mandate"},
    {id:"2402.09129v1",cat:"q-fin.TR",title:"Optimal Automated Market Makers: Differentiable Economics and Strong Duality"},
    {id:"2601.17712v1",cat:"econ.EM",title:"The Proximal Surrogate Index: Long-Term Treatment Effects under Unobserved Confounding"},
    {id:"2606.16773v1",cat:"stat.ML",title:"Generative Predictive Distributions for Time Series"},
    {id:"2602.04095v1",cat:"q-bio.NC",title:"A computational account of dreaming: learning and memory consolidation"},
  ],
  [
    {id:"2506.03800v2",cat:"q-bio.BM",title:"STELLA: A Multimodal LLM for Protein Functional Annotation via Unified Sequence-Structure Encoding"},
    {id:"2412.02882v2",cat:"q-bio.GN",title:"iSEEtree: interactive explorer for hierarchical data"},
    {id:"2602.18727v1",cat:"q-bio.QM",title:"Statistical methods for reference-free single-molecule localisation microscopy"},
    {id:"2511.12223v1",cat:"q-bio.PE",title:"AMR-MoEGA: Antimicrobial Resistance Prediction using Mixture of Experts and Genetic Algorithms"},
    {id:"2605.16330v1",cat:"physics.chem-ph",title:"A Data-Driven Parametric Reduced-Order Chemical Kinetics Model Derived from Atomistic Simulations"},
  ],
  [
    {id:"2605.06513v1",cat:"cond-mat.soft",title:"Cooking crystalline candies and the ductile to brittle transition in concentrated suspensions"},
    {id:"2606.07002v1",cat:"cond-mat.stat-mech",title:"Phase lag enhances synchronization in coupled oscillators with inertia"},
    {id:"2603.19641v1",cat:"physics.soc-ph",title:"On the existence of fair zero-determinant strategies in the periodic prisoner's dilemma game"},
    {id:"2605.15833v1",cat:"cs.DS",title:"Exploration of $k$-edge-deficient temporal graphs in linear time"},
    {id:"2607.02613v1",cat:"math.CO",title:"Counting Unlabeled Chordal Graphs by Equivariant Evaporation"},
  ],
  [
    {id:"2606.24782v1",cat:"math.OC",title:"A new perspective in linear Cauchy Elasticity: variational minimum principles for statics, dynamics, and heterogeneous materials"},
    {id:"2606.19060v1",cat:"math.PR",title:"Delayed blow-up by transport noise for the 3D Navier-Stokes equation with Navier-slip boundary conditions"},
    {id:"2606.08640v2",cat:"math.NT",title:"On special perfect polynomials over F_2"},
    {id:"2403.10482v2",cat:"q-fin.PM",title:"Can a GPT4-Powered AI Agent Be a Good Enough Performance Attribution Analyst?"},
    {id:"2402.08233v1",cat:"q-fin.TR",title:"End-to-End Policy Learning of a Statistical Arbitrage Autoencoder Architecture"},
  ],
  [
    {id:"2601.17648v1",cat:"econ.EM",title:"Statistical Decisions and Partial Identification: With Application to Boundary Discontinuity Design"},
    {id:"2606.16730v2",cat:"stat.ML",title:"Attention is Just Another Name for Coupling? A Fast-Slow ODE Perspective on Hierarchical Pretraining"},
    {id:"2602.03766v2",cat:"q-bio.NC",title:"FOVI: A biologically-inspired foveated interface for deep vision models"},
    {id:"2506.03237v3",cat:"q-bio.BM",title:"UniSite: The First Cross-Structure Dataset and Learning Framework for End-to-End Ligand Binding Site Detection"},
    {id:"2412.01649v1",cat:"q-bio.GN",title:"Microbial Mat Metagenomes from Waikite Valley, Aotearoa New Zealand"},
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
