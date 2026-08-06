export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-05',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2402.10215v1',cat:'q-fin.TR',title:'The Mean Field Market Model Revisited'},
    {id:'2606.24988v1',cat:'math.NT',title:'Nonsimilar half-neighbors over fields of characteristic 2'},
    {id:'2607.04313v1',cat:'math.OC',title:'Exploiting Variable Implications in Presolve for Mixed Integer Programming'},
    {id:'2401.00507v1',cat:'q-fin.PM',title:'Optimization of portfolios with cryptocurrencies: Markowitz and GARCH-Copula model approach'},
    {id:'2606.24536v1',cat:'math.NT',title:'Zeta-regularization and natural boundaries: Sums and products of integers and primes'},
  ],
  [
    {id:'2605.31421v1',cat:'cs.DS',title:'Neuro-symbolic Syntactic Parsing: Shaping a Neural Network with the CYK Algorithm'},
    {id:'2601.20469v1',cat:'econ.EM',title:'The realized empirical distribution function of stochastic variance with application to goodness-of-fit testing'},
    {id:'2607.14312v1',cat:'math.CO',title:'The role of expanders in the spectral geometry of metric graphs'},
    {id:'2312.15385v1',cat:'q-fin.PM',title:'Discrete-Time Mean-Variance Strategy Based on Reinforcement Learning'},
    {id:'2601.21749v2',cat:'econ.EM',title:'fixest: A fast and feature-rich framework for econometric estimations in R'},
  ],
  [
    {id:'2505.17914v4',cat:'q-bio.BM',title:'Flexible MOF Generation with Torsion-Aware Flow Matching'},
    {id:'2605.13826v1',cat:'physics.chem-ph',title:'Reducing cross-sample prediction churn in scientific machine learning'},
    {id:'2605.19026v1',cat:'cond-mat.soft',title:'Work to insert a particle into an active fluid'},
    {id:'2603.26822v1',cat:'physics.soc-ph',title:'Modularity, asymmetry, and polarization shape consensus speed in the voter model'},
    {id:'2607.00586v2',cat:'math.PR',title:'Optimal scaling of MCMC algorithms: the Hamiltonian approach'},
  ],
  [
    {id:'2607.10392v4',cat:'cs.CR',title:'Dynamic Rowhammer Threshold Management: Temperature-Aware Threshold for In-DRAM Defenses'},
    {id:'2607.10451v1',cat:'cs.CR',title:'Threat Vectors and the State of the Art in Defense Methods for Security in Neurotechnology'},
    {id:'2607.28127v1',cat:'cs.LG',title:'FinSMART: Financial Sentiment Analysis for Algorithmic Trading through Market-Aligned Reinforcement Learning'},
    {id:'2607.10484v1',cat:'cs.CR',title:'Firewall3D: A Hardware Firewall for Defending 3D Printers Against Firmware Attacks'},
    {id:'2607.23440v1',cat:'cs.CL',title:'Reasoning or Memorization: Can LLMs Understand and Generate Chinese Xiehouyu Riddles?'},
  ],
  [
    {id:'2605.13244v2',cat:'physics.chem-ph',title:'Fluctuation-Dissipation Framework for Size-Dependent Surface Tension'},
    {id:'2606.28652v1',cat:'stat.ML',title:'Adaptive Iterative Hard Thresholding for Online High-dimensional Quantile Regression'},
    {id:'2607.10490v1',cat:'cs.CR',title:'NetInjectBench: Benchmarking Indirect Prompt Injection in Tool-Using Large Language Model Agents for Network Operations'},
    {id:'2607.28170v1',cat:'cs.LG',title:'Search Strategies for Optimal Classification and Regression Trees'},
    {id:'2601.22354v1',cat:'econ.EM',title:'Model Selection in Panel Data Models: A Generalization of the Vuong Test'},
  ],
  [
    {id:'2312.02081v1',cat:'q-fin.TR',title:'Copula-based deviation measure of cointegrated financial assets'},
    {id:'2505.17237v1',cat:'q-bio.BM',title:'Predicting protein folding dynamics using sequence information'},
    {id:'2607.04487v1',cat:'math.OC',title:'Two Black Boxes, One Solver: Encoder Probing and Decoder Attribution for Neural Multi-Attribute VRP under Hard-Mask and Recourse Decoders'},
    {id:'2606.20145v1',cat:'cond-mat.stat-mech',title:'Trends, Volatility, Correlations, and Critical Phenomena in Financial Markets'},
    {id:'2602.22263v2',cat:'q-bio.QM',title:'CryoNet.Refine: A One-step Diffusion Model for Rapid Refinement of Structural Models with Cryo-EM Density Map Restraints'},
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
    `You are mining arXiv papers for cool, buildable ideas. Here are 5 fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on cool_score (1-10, how cool/shareable) and buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend). Be creative and specific — reference the actual math/result, not just the title. Lean into math -> basketball/poker/games and whimsy angles where they fit naturally. Return via the schema.`,
    { label: `batch-${idx}`, schema: IDEA_SCHEMA }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
