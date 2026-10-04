export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-04',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.37918v1',cat:'cs.LG',title:"SYNCR: Diagnosing and Learning Cross-Video Reasoning from Simulation"},
    {id:'2609.37378v1',cat:'cs.AI',title:"Do-JEPA: From Masking to Intervention in Latent World Models"},
    {id:'2609.32546v1',cat:'cs.CL',title:"Shared Autoregressive Context Can Distort Relationships in Synthetic Data"},
    {id:'2609.13816v1',cat:'cs.CR',title:"Exploring Automated Vulnerability Identification in JavaScript Code Using Large Language Models"},
    {id:'2607.28575v1',cat:'cs.DS',title:"Algorithms for Structured Elections under Thiele Voting Rules"},
  ],
  [
    {id:'2609.16357v1',cat:'math.CO',title:"Independent domination in central graphs"},
    {id:'2609.08440v1',cat:'math.OC',title:"Identification of forward models: a nonparametric approach"},
    {id:'2609.06394v1',cat:'math.PR',title:"Beyond Worst-Case Coreset Bounds for k-Clustering via Determinantal Sampling"},
    {id:'2609.25045v1',cat:'math.NT',title:"An irreducible decomposition of the Weil representation restricted to open compact subgroups"},
    {id:'2306.08105v1',cat:'q-fin.PM',title:"Model-Free Market Risk Hedging Using Crowding Networks"},
  ],
  [
    {id:'2304.11883v1',cat:'q-fin.TR',title:"Recurrent neural network based parameter estimation of Hawkes model on high-frequency financial data"},
    {id:'2602.16376v3',cat:'econ.EM',title:"Two-way Clustering Robust Variance Estimator in Quantile Regression Models"},
    {id:'2608.25887v1',cat:'stat.ML',title:"Efficient Estimation of High Information Projections using Nearest Neighbours"},
    {id:'2602.23202v1',cat:'q-bio.NC',title:"Collective Dynamics in Spiking Neural Networks Beyond Dale's Principle"},
    {id:'2504.01389v1',cat:'q-bio.BM',title:"De Novo Molecular Design Enabled by Direct Preference Optimization and Curriculum Learning"},
  ],
  [
    {id:'2407.11435v2',cat:'q-bio.GN',title:"Genomic Language Models: Opportunities and Challenges"},
    {id:'2603.11344v2',cat:'q-bio.QM',title:"Hybrid eTFCE-GRF: Exact Cluster-Size Retrieval with Analytical p-Values for Voxel-Based Morphometry"},
    {id:'2510.23360v1',cat:'q-bio.PE',title:"Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells"},
    {id:'2606.30235v1',cat:'physics.chem-ph',title:"Surviving the Attack of the Clones"},
    {id:'2607.01603v1',cat:'cond-mat.soft',title:"Tuning nonlinear waves in nonreciprocal active filaments"},
  ],
  [
    {id:'2608.19305v1',cat:'cond-mat.stat-mech',title:"Holographic Local Operator Quenches with Conserved Momentum and Spin"},
    {id:'2605.05229v1',cat:'physics.soc-ph',title:"The Rise and Possible Decline of Societal Complexity"},
    {id:'2609.37917v1',cat:'cs.LG',title:"Search Dimension in Unlabeled Projection Pursuit: A Scaling Law for Subspace Restriction"},
    {id:'2609.37377v1',cat:'cs.AI',title:"Beyond Prompt Count: How Data Shapes Transfer in On-Policy Distillation"},
    {id:'2609.32536v1',cat:'cs.CL',title:"Do Audio LLMs Listen Before They Act? Diagnosing Acoustic-Context Gating in Voice Agents"},
  ],
  [
    {id:'2609.13781v1',cat:'cs.CR',title:"PQLN: Post-Quantum Security for the Bitcoin Lightning Network's Off-Chain Surfaces"},
    {id:'2607.28574v2',cat:'cs.DS',title:"Finite Pinwheel Covering"},
    {id:'2609.16345v1',cat:'math.CO',title:"Matroids and isomorphism problems for Bestvina-Brady groups"},
    {id:'2609.08380v1',cat:'math.OC',title:"How to Make the Gradient Mapping Small for Constrained Stochastic Min-Max Problems and Beyond"},
    {id:'2609.06358v3',cat:'math.PR',title:"The Berry-Esseen Constant Conjecture is Eventually True"},
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
    `You are mining arXiv papers for cool, buildable ideas. Here are fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on:\n- cool_score (1-10, how cool/shareable)\n- buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend)\n- discussion_score (1-10, how much this would spark debate on a betting/poker/sports/games Discord server) — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise/counterintuitiveness, (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick 1-4 from [betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy] that best describe the idea.\n\nBe creative and specific — reference the actual math/result, not just the title. Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
