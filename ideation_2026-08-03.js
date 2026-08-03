export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-03',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.02319v1',cat:'math.OC',title:'Refinement of Reliability Grid Codes in the Provision of Ancillary Services'},
    {id:'2607.10639v2',cat:'math.CO',title:'Characteristic Independence of Betti Numbers of Monomial Ideals in Five Variables'},
    {id:'2311.15180v1',cat:'q-fin.TR',title:'Benchmarking Large Language Model Volatility'},
    {id:'2607.02489v2',cat:'math.OC',title:"Almost Supermartingale Extensions of Olivier's Theorem"},
    {id:'2411.06798v2',cat:'q-bio.GN',title:'LA4SR: illuminating the dark proteome with generative AI'},
  ],
  [
    {id:'2606.29530v1',cat:'math.PR',title:'Cutoff profiles for colored top-m-to-random shuffles with growing block size'},
    {id:'2603.24676v1',cat:'physics.soc-ph',title:'When Is Collective Intelligence a Lottery? Multi-Agent Scaling Laws for Memetic Drift in LLMs'},
    {id:'2605.26886v1',cat:'cs.DS',title:'Parsimonious Learning-Augmented Online Metric Matching'},
    {id:'2603.24782v3',cat:'physics.soc-ph',title:'Mobility shapes heat exposure inequalities in cities'},
    {id:'2606.17179v2',cat:'cond-mat.stat-mech',title:'Why dimensional analysis works: general classification of self-similarity based on scale-invariance'},
  ],
  [
    {id:'2607.24180v1',cat:'cs.LG',title:'Monitoring Post-Disaster Urban Recovery Using High-Resolution SAR Time Series and Unsupervised Learning: Evidence from the 2023 Türkiye-Syria Earthquake'},
    {id:'2602.08910v1',cat:'q-bio.NC',title:'Structural coarse-graining enables noise-robust functional connectivity and reveals hidden inter-subject variability'},
    {id:'2606.24427v1',cat:'stat.ML',title:'NoLimits.jl: Flexible and Composable Nonlinear Mixed-Effects Modeling in Julia'},
    {id:'2606.17140v1',cat:'cond-mat.stat-mech',title:'Projected logical ensembles in surface codes via the random-matrix theory of quantum dots'},
    {id:'2602.18889v2',cat:'q-bio.QM',title:'Topological shape transform for thymus structures'},
  ],
  [
    {id:'2312.13057v3',cat:'q-fin.PM',title:'Cross-Currency Heath-Jarrow-Morton Framework in the Multiple-Curve Setting'},
    {id:'2603.24723v1',cat:'physics.soc-ph',title:'Dynamics of voting strategies and public good funding'},
    {id:'2607.25152v1',cat:'cs.AI',title:'When Do Agent Loops Mistake Stagnation for Progress? Self-Evaluation Bias and Externally Grounded Verification in Long-Running Autonomous LLM Agent Loops'},
    {id:'2605.27147v2',cat:'cs.DS',title:'Virtual-Memory Powersort'},
    {id:'2312.01018v1',cat:'q-fin.TR',title:'Decentralized Finance: Protocols, Risks, and Governance'},
  ],
  [
    {id:'2606.29557v2',cat:'math.PR',title:'Propagation of chaos for Belavkin equations beyond pure states'},
    {id:'2607.02279v1',cat:'math.OC',title:'Invariance Entropy in the Dust'},
    {id:'2602.19295v1',cat:'q-bio.QM',title:'Time-Varying Hazard Patterns and Co-Mutation Profiles of KRAS G12C and G12D in Real-World NSCLC'},
    {id:'2311.15974v1',cat:'q-fin.TR',title:'Adaptive Agents and Data Quality in Agent-Based Financial Markets'},
    {id:'2607.25130v1',cat:'cs.AI',title:'Learning from 53.6K Real-World Developer Edits of AI-Generated Code'},
  ],
  [
    {id:'2601.17860v1',cat:'econ.EM',title:'The Hellinger Bounds on the Kullback-Leibler Divergence and the Bernstein Norm'},
    {id:'2606.29622v2',cat:'math.PR',title:'Affine Structure of the Brownian Signature'},
    {id:'2606.17033v1',cat:'cond-mat.stat-mech',title:'Milestoning Markov-jump dynamics: Stationary properties, thermodynamic consistency, kinetic hysteresis, and fluctuation symmetries'},
    {id:'2606.24465v1',cat:'stat.ML',title:'History estimation in random recursive trees: Pointwise approach via iterated Jordan centralities'},
    {id:'2411.03522v1',cat:'q-bio.GN',title:'Exploring the Potentials and Challenges of Using Large Language Models for the Analysis of Transcriptional Regulation of Long Non-coding RNAs'},
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
