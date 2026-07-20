export const meta = {
  name: 'arxiv-nightly-ideation',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2607.10931v1",cat:"cs.LG",title:"Fast Whole-Brain, Geometry-Aware Functional Alignment for Cross-Subject Decoding"},
    {id:"2607.11193v2",cat:"cs.AI",title:"RepTran: Search-Based Repair of Transformer Models"},
    {id:"2607.07727v1",cat:"cs.CL",title:"SPL: Orchestrating Workflows with Declarative Deterministic-Probabilistic Composition"},
    {id:"2606.26479v1",cat:"cs.CR",title:"Adaptive Evaluation of Out-of-Band Defenses Against Prompt Injection in LLM Agents"},
    {id:"2605.14112v2",cat:"cs.DS",title:"Fast Leaf-to-Ancestor Minimum Query in the Oracle Model"},
  ],
  [
    {id:"2606.30612v1",cat:"math.CO",title:"Nearly-uniform degree distributions in spanning subgraphs"},
    {id:"2606.22542v1",cat:"math.OC",title:"Quantum Restricted Boltzmann Machine for Fast Unit Commitment"},
    {id:"2606.16025v1",cat:"math.PR",title:"Universality in the target arrival statistics of non-conservative search processes"},
    {id:"2606.07139v1",cat:"math.NT",title:"Multi-scale properties of continued fraction sets"},
    {id:"2403.11622v2",cat:"q-fin.PM",title:"Asset management with an ESG mandate"},
  ],
  [
    {id:"2402.08233v1",cat:"q-fin.TR",title:"End-to-End Policy Learning of a Statistical Arbitrage Autoencoder Architecture"},
    {id:"2601.16613v1",cat:"econ.EM",title:"Is the diurnal pattern sufficient to explain intraday variation in volatility? A nonparametric assessment"},
    {id:"2606.15201v1",cat:"stat.ML",title:"A Koopman-PINN Framework for Epidemic Models: Parameter Inference and Forecasting"},
    {id:"2602.03766v2",cat:"q-bio.NC",title:"FOVI: A biologically-inspired foveated interface for deep vision models"},
    {id:"2506.04490v2",cat:"q-bio.BM",title:"Multiscale guidance of protein structure prediction with heterogeneous cryo-EM data"},
  ],
  [
    {id:"2412.01649v1",cat:"q-bio.GN",title:"Microbial Mat Metagenomes from Waikite Valley, Aotearoa New Zealand"},
    {id:"2603.06618v1",cat:"q-bio.QM",title:"Distilling and Adapting: A Topology-Aware Framework for Zero-Shot Interaction Prediction in Multiplex Biological Networks"},
    {id:"2511.15721v2",cat:"q-bio.PE",title:"8 quick tips for data-model integration in ecology"},
    {id:"2605.00998v2",cat:"physics.chem-ph",title:"Accurate, full-dimensional computations of thousands of complex vibrational eigenstates with tree tensor network states"},
    {id:"2605.04473v1",cat:"cond-mat.soft",title:"Programming sequential deployment of origami via kinematic transition fronts"},
  ],
  [
    {id:"2606.04961v1",cat:"cond-mat.stat-mech",title:"Theory of frozen flux in a narrow uniform superconducting strip after cooling in a small magnetic field"},
    {id:"2603.18128v1",cat:"physics.soc-ph",title:"Myopic Best Response as a Double-Edged Mechanism in Networked Social Dilemmas with Individual Solutions"},
    {id:"2607.10930v1",cat:"cs.LG",title:"The Singularity Space: A Generative Diffusion Framework for Signal Representation"},
    {id:"2607.11185v1",cat:"cs.AI",title:"SCALECUA: Scaling Computer Use Agents with Verifiable Task Synthesis and Efficient Online RL"},
    {id:"2607.04640v1",cat:"cs.CL",title:"Wrong Before Right: Late Rescue and Interface Failure in Aligned Language Models"},
  ],
  [
    {id:"2606.26449v1",cat:"cs.CR",title:"ProvenAI: Provenance-Native Traces of Evidence in Generated Answers"},
    {id:"2605.14093v2",cat:"cs.DS",title:"New Algorithms for Parity-SAT and Its Bounded-Occurrence Versions"},
    {id:"2606.30593v1",cat:"math.CO",title:"A Polynomial Improvement of Naslund-Sawin Bound for Sunflower-Free Families Using Triangular Tensors"},
    {id:"2606.22536v1",cat:"math.OC",title:"Generative Robust Optimisation"},
    {id:"2606.16018v2",cat:"math.PR",title:"A non-asymptotic bound on the TV distance between a Wishart matrix and an appropriately scaled GOE matrix"},
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
