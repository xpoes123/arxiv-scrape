export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-26',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2609.27836",cat:"math.PR",title:"Optimal State-Space Order for Spectral Gaps of Sliding-Window Occupation Counts"},
    {id:"2609.25208",cat:"cond-mat.stat-mech",title:"Adaptive thresholding for scalable measurement-based qubit reset"},
    {id:"2609.25838",cat:"q-bio.PE",title:"Mutation Order and Selection Shape Intratumor Heterogeneity in Tumor Evolution"},
    {id:"2609.30013",cat:"q-bio.GN",title:"EMMA: an R/Bioconductor package to automate tracking of metadata in functional enrichment analyses"},
    {id:"2205.06398",cat:"stat.ML",title:"Outlier Detection for Multi-Network Data"},
  ],
  [
    {id:"2609.29155",cat:"q-bio.BM",title:"ProteoEM: probabilistic protein abundance estimation from iterative affinity traces"},
    {id:"2609.23451",cat:"physics.soc-ph",title:"Network imitation sustains misinformation despite a corrective factual field"},
    {id:"2609.28010",cat:"math.OC",title:"Optimal Bias Potentials via Ergodic Optimal Control and Generator Learning"},
    {id:"2609.22663",cat:"physics.chem-ph",title:"SPIBER: Reconstructing Free Energy Landscapes from Short, Unconverged Trajectories with Generative Flow Networks"},
    {id:"2609.28124",cat:"cond-mat.soft",title:"Active Self-Consistent Field Theory for Ornstein-Uhlenbeck Polymers"},
  ],
  [
    {id:"2609.29221",cat:"q-bio.QM",title:"PRAXIS-VirtualCell: A Programmable and Trustworthy Framework for Agentic Virtual Cell Experiments"},
    {id:"2609.28282",cat:"math.NT",title:"Computation of anisotropic singular sums from high-order derivatives of Epstein zeta functions"},
    {id:"2609.22643v1",cat:"cs.LG",title:"Monotone-Constrained Diffusion Models for Long-Horizon Production Forecasting"},
    {id:"2609.29887",cat:"q-fin.PM",title:"Cost-Sensitive Online Window Size Selection for Portfolio Management"},
    {id:"2609.28550",cat:"math.CO",title:"Graphical Discreteness, Coxeter Doublings and Generalized Polygons"},
  ],
  [
    {id:"2609.27996",cat:"cs.CR",title:"Your Model Is Leaking: Covert Information Transfer through LLM Residual Streams"},
    {id:"2609.29131",cat:"cs.CL",title:"Tag-Aware Structured Text Translation: Towards a Systematic Understanding"},
    {id:"2609.22939v1",cat:"cs.AI",title:"Beyond Linear Context: Graph-Guided Evidence Navigation for Long-Novel Reasoning with a Local 9B Language Model"},
    {id:"2609.25436",cat:"q-bio.NC",title:"Physics-constrained inference of somatic dynamics from dendritic recordings with sparse somatic supervision in weakly coupled two-compartment neuron model"},
    {id:"2609.24569",cat:"cs.DS",title:"Poisson Exchange Beyond Submodularity: Effective Approximation Algorithms for Offline and Online Subset Selection over Matroids"},
  ],
  [
    {id:"2609.29108",cat:"q-fin.TR",title:"Functional Architecture of European Electricity Trading Markets: Requirements for AI Supported Trading Systems under Regulatory Constraints"},
    {id:"2609.27796",cat:"math.PR",title:"Gaussian polytopes with large Banach-Mazur distance to the cross-polytope"},
    {id:"2609.25095",cat:"cond-mat.stat-mech",title:"Loop Equations for Multi-Matrix Models"},
    {id:"2609.25136",cat:"q-bio.PE",title:"Stochastic Field Theory of HIV Latency: Instanton Dynamics and the Path to Viral Rebound"},
    {id:"2609.28557",cat:"q-bio.GN",title:"BaseCamp --- An Agentic AI Framework for Automating DNA Sequencing Data Pipelines"},
  ],
  [
    {id:"2609.26624",cat:"stat.ML",title:"On Basis Function Selection for Sparse Gaussian Process Regression"},
    {id:"2609.28921",cat:"q-bio.BM",title:"PFArena: Benchmarking Language Models for Protein Modification"},
    {id:"2609.23066",cat:"physics.soc-ph",title:"What a collective can hold in common: a gauge framework for private representations"},
    {id:"2609.27918",cat:"math.OC",title:"Semi-differentiability of generalised $L^\\infty$ envelopes with applications to supremal functionals"},
    {id:"2609.22490",cat:"physics.chem-ph",title:"XC100: A Wavefunction-Derived Exchange-Correlation Energy Dataset for Atomic and Molecular Species"},
  ],
]

// Net-negative tags from last week's forum votes (votes.json) — soft down-weight, not a hard filter.
const VOTES_NOTE = "Soft bias from last week's forum votes: gambling, decision-theory, betting, and math tags are net-negative (down-weight ideas leaning hard on those unless the paper is a killer fit); poker/ai/sports/whimsy/games/econ/bio are neutral (0), so don't avoid them."

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
          discussion_score: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score', 'discussion_score', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

phase('Ideate')
const results = await pipeline(
  BATCHES,
  (batch, _item, idx) => agent(
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord community (SharpLab). Here are 5 fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result, buildable tonight with no backend). Be creative and specific — reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward a single self-contained HTML file)\n- discussion_score (1-10): how much it would spark debate on a betting/poker/sports/games Discord — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise ("wait, really?"), and (iv) whimsy (weird-and-delightful). ${VOTES_NOTE}\n- discussion_why: one line naming which axis it wins on\n- tags: 1-3 tags from the fixed list that best describe the idea\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
