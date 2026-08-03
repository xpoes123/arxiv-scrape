export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-02',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2605.11253v2',cat:'physics.chem-ph',title:'Low-rank compression of two-electron reduced density matrices'},
    {id:'2601.16865v2',cat:'econ.EM',title:'Distributional Instruments: Identification and Estimation with Quantile Least Squares'},
    {id:'2601.16668v1',cat:'econ.EM',title:'Inference from high-frequency data: A subsampling approach'},
    {id:'2607.24097v1',cat:'cs.AI',title:'MemChain: Learning Interpretable Memory Traces for Memory-Augmented LLM Agents'},
    {id:'2605.10458v1',cat:'physics.chem-ph',title:'QT-Net: Rethinking Evaluation of AI Models in Atomic Chemical Space'},
  ],
  [
    {id:'2606.18041v1',cat:'math.NT',title:'Perturbed Polynomial Powers and Bourgain Entropy Obstructions for Khintchin Averages'},
    {id:'2606.28631v1',cat:'math.PR',title:'On the maximal displacement of subcritical branching random walks with stretched exponential tails'},
    {id:'2411.06798v2',cat:'q-bio.GN',title:'LA4SR: illuminating the dark proteome with generative AI'},
    {id:'2605.25678v2',cat:'cs.DS',title:'PAC Learning with Bandit Feedback: Sharp Sample Complexity in the Realizable Setting'},
    {id:'2606.16483v1',cat:'cond-mat.stat-mech',title:'Geometric decomposition of the d-dimensional hard-sphere partition function'},
  ],
  [
    {id:'2605.14562v1',cat:'cond-mat.soft',title:'Autonomous Reshaping of Expression Landscapes by DNA Methylation'},
    {id:'2605.25927v1',cat:'cs.DS',title:'On the Complexity of Bilevel Independent Set Problem'},
    {id:'2602.08079v2',cat:'q-bio.NC',title:'Bootstrapping Life-Inspired Machine Intelligence: The Biological Route from Chemistry to Cognition'},
    {id:'2606.16427v2',cat:'cond-mat.stat-mech',title:'Criticality of nonreciprocal phase oscillators with long-range interactions'},
    {id:'2606.23601v1',cat:'stat.ML',title:'Neural Networks as Linear Regression: An Introduction for Statisticians'},
  ],
  [
    {id:'2606.16339v1',cat:'cond-mat.stat-mech',title:'Thermodynamic Uncertainty Relation For a Multi-Phase Alternating Renewal Random Process'},
    {id:'2505.20346v3',cat:'q-bio.BM',title:'PDFBench: A Benchmark for De novo Protein Design from Function'},
    {id:'2607.09497v1',cat:'math.CO',title:'An Improved Lower Bound for Diamond-Free Families'},
    {id:'2607.01347v1',cat:'math.OC',title:'Bilinear control of age-space structured populations'},
    {id:'2607.23344v1',cat:'cs.LG',title:'BERT-based Models vs. Large Language Models for Low-Resource Named Entity Recognition'},
  ],
  [
    {id:'2607.17219v2',cat:'cs.CL',title:'Auditing Question-Order Effects in Large Language Models with the QQ Equality'},
    {id:'2602.22235v1',cat:'q-bio.QM',title:'Unsupervised Denoising of Diffusion-Weighted Images with Bias and Variance Correction'},
    {id:'2607.01203v1',cat:'math.OC',title:'GPU-Parallel Linearization Error Bounds for Real-Time Robust Optimal Control'},
    {id:'2603.24403v2',cat:'physics.soc-ph',title:'Opinion-Driven Vaccination and Epidemic Dynamics on Heterogeneous Networks'},
    {id:'2312.05827v2',cat:'q-fin.TR',title:'Detecting Toxic Flow'},
  ],
  [
    {id:'2607.05868v1',cat:'cs.CR',title:'Code-Level Cost Function Generation for Spatial Image Steganography Using RAG-Enhanced Generation'},
    {id:'2312.16448v1',cat:'q-fin.PM',title:'Randomized Signature Methods in Optimal Portfolio Selection'},
    {id:'2511.10807v1',cat:'q-bio.PE',title:'Invading activity fronts stabilize excitable systems against stochastic extinction'},
    {id:'2607.23348v1',cat:'cs.LG',title:'Logit-Coordinate Generative Models for Mixed Continuous-Categorical Tabular Data'},
    {id:'2603.24381v1',cat:'physics.soc-ph',title:'On a Co-evolving Opinion-Leadership Model in Social Networks'},
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
