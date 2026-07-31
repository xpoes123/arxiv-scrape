export const meta = {
  name: 'arxiv-nightly-ideation-2026-07-31',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2312.09353v2',cat:'q-fin.TR',title:'Residual U-net with Self-Attention to Solve Multi-Agent Time-Consistent Optimal Trade Execution'},
    {id:'2607.05989v1',cat:'cs.CR',title:'ProvICS: A Provenance-based Intrusion Detection for Industrial Control Systems'},
    {id:'2602.21393v1',cat:'q-bio.QM',title:'An information-based model selection criterion for data-driven model discovery'},
    {id:'2606.18579v1',cat:'math.NT',title:'Modular Heights of Unitary Shimura Varieties II: Arithmetic Generating Series of Divisors'},
    {id:'2606.24236v1',cat:'stat.ML',title:'Automated Residual Plot Assessment With the R Package autovi and the Shiny Application autovi.web'},
  ],
  [
    {id:'2602.08910v1',cat:'q-bio.NC',title:'Structural coarse-graining enables noise-robust functional connectivity and reveals hidden inter-subject variability'},
    {id:'2605.26816v1',cat:'cs.DS',title:'Where to Split and When to Charge: Optimal Route Construction from Customer Permutations in Electric Vehicle Routing'},
    {id:'2602.09997v2',cat:'q-bio.NC',title:'Popularity Feedback Constrains Innovation in Cultural Markets'},
    {id:'2605.14702v1',cat:'cond-mat.soft',title:'Weakly nonlinear analysis of Hopf bifurcations in the elastohydrodynamics of Cosserat rods'},
    {id:'2401.05264v1',cat:'q-fin.PM',title:'Comparison of Markowitz Model and Single-Index Model on Portfolio Selection of Malaysian Stocks'},
  ],
  [
    {id:'2607.24167v1',cat:'cs.AI',title:'Falsifiable Commitment Planning for Self-Correcting Web Agents'},
    {id:'2401.02601v1',cat:'q-fin.PM',title:'Constrained Max Drawdown: a Fast and Robust Portfolio Optimization Approach'},
    {id:'2607.23395v1',cat:'cs.LG',title:'Music-Source-Separation-Training (MSST): A Unified Framework for Training and Evaluating Music Demixing Models'},
    {id:'2606.17018v1',cat:'cond-mat.stat-mech',title:'Distributed Acoustic Sensing for Urban Monitoring: Coverage Thresholds and Percolation'},
    {id:'2506.10015v1',cat:'q-bio.BM',title:'Identifying critical residues of a protein using meaningfully-thresholded Random Geometric Graphs'},
  ],
  [
    {id:'2605.11941v1',cat:'physics.chem-ph',title:'Poisoning mechanism of ammonia on proton transport and ionomer structure in cathode catalyst layer of PEM fuel cells'},
    {id:'2606.29132v1',cat:'math.PR',title:'Local well-posedness of general mean field game master equations'},
    {id:'2607.10036v1',cat:'math.CO',title:'On the Turán number of the directed path'},
    {id:'2312.15730v1',cat:'q-fin.TR',title:'Deep Reinforcement Learning for Quantitative Trading'},
    {id:'2606.28945v1',cat:'math.PR',title:'The heat-kernel master field on $\\mathbb{Z}^d$ at strong coupling'},
  ],
  [
    {id:'2606.20721v1',cat:'math.NT',title:'Unbounded Oscillation of Euler-Gompertz Diophantine Errors from Bell and Gould Numbers'},
    {id:'2411.12769v1',cat:'q-bio.GN',title:'ukbFGSEA: an R Package for Applying Fast Preranked Gene Set Enrichment Analysis to UK Biobank Exome Data'},
    {id:'2601.17712v1',cat:'econ.EM',title:'The Proximal Surrogate Index: Long-Term Treatment Effects under Unobserved Confounding'},
    {id:'2603.25760v1',cat:'physics.soc-ph',title:'Topology as a Language for Emergent Organization in Complex Systems: Multiscale Structure, Higher-Order Interactions, and Early Warning Signals'},
    {id:'2511.10807v1',cat:'q-bio.PE',title:'Invading activity fronts stabilize excitable systems against stochastic extinction'},
  ],
  [
    {id:'2511.15721v2',cat:'q-bio.PE',title:'8 quick tips for data-model integration in ecology'},
    {id:'2604.03287v1',cat:'physics.soc-ph',title:'A comparative, multiscalar, and multidimensional study of residential segregation in seven European capital cities'},
    {id:'2603.25772v1',cat:'physics.soc-ph',title:"SF2A Environmental Transition Commission: Chosen pieces from the survey 'French astronomy and astrophysics research activities in the face of the environmental crisis, from 2019 to 2024'"},
    {id:'2607.01552v1',cat:'math.OC',title:'Symbolic Discovery of Iterative Algorithms: A Continuous Latent Space Bayesian Optimization Framework'},
    {id:'2607.17237v1',cat:'cs.CL',title:'AI_LectureNote: A Retrospective Pilot Study of a Post-ASR Workflow for English-Script Rendering and Semantic Drift in Korean-English Medical Lectures'},
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
