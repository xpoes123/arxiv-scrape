export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-05',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.39341v1',cat:'cs.LG',title:"Understanding as No-Arbitrage: Bounded Dutch Books as a Definition and Training Objective"},
    {id:'2609.38809v1',cat:'cs.AI',title:"StateTree: Enhancing Long-Term Dialogue Reasoning via Reinforcement Learning"},
    {id:'2609.33485v1',cat:'cs.CL',title:"DISCO: Distributed Long Context Scaling with Grounding-Reasoning Disaggregation"},
    {id:'2609.15017v1',cat:'cs.CR',title:"PIDS-Bench: Evaluating Prompt-Injection Detectors Under Over-Defense, Obfuscation, and Distribution Shift"},
    {id:'2608.00451v4',cat:'cs.DS',title:"Learning Latent Algebraic Structure from Ambiguous Set Observations"},
  ],
  [
    {id:'2609.17760v1',cat:'math.CO',title:"Every graph with no $K_7^=$ minor is 6-colorable"},
    {id:'2609.10004v1',cat:'math.OC',title:"Minimum-makespan completion and vertex selection leave the Wang-Sitters constant at 11/6"},
    {id:'2609.07026v1',cat:'math.PR',title:"Locality of Bernoulli Site Percolation on Transitive Graphs"},
    {id:'2609.00672v1',cat:'math.NT',title:"Deciding superellipticity and computing the Weierstrass normal form"},
    {id:'2306.05667v1',cat:'q-fin.PM',title:"Random matrix theory and nested clustered portfolios on Mexican markets"},
  ],
  [
    {id:'2305.00585v1',cat:'q-fin.TR',title:"Prospects of BRICS currency dominance in international trade"},
    {id:'2602.16527v1',cat:'econ.EM',title:"Model selection confidence sets for time series models with applications to electricity load"},
    {id:'2603.03358v1',cat:'q-bio.NC',title:"Contextuality, Incompatibility, and Intra-System Entanglement of Mental Markers"},
    {id:'2503.23341v2',cat:'q-bio.BM',title:"GPx4 is bound to peroxidized membranes by a hydrophobic anchor"},
    {id:'2407.11242v3',cat:'q-bio.GN',title:"Bridging Sequence-Structure Alignment in RNA Foundation Models"},
  ],
  [
    {id:'2510.23297v1',cat:'q-bio.PE',title:"Drivers of Variation in the Optimal Spatial Structure of Collective Information Gatherers"},
    {id:'2607.18281v3',cat:'physics.chem-ph',title:"Position: The Inevitable Transition to Machine Learning in Quantum Chemistry"},
    {id:'2607.02762v1',cat:'cond-mat.soft',title:"Shear and crystallization in deformable granular packings: why don't auxetics order?"},
    {id:'2608.20067v1',cat:'cond-mat.stat-mech',title:"Kibble-Zurek Scaling in the Dicke Model at Mesoscopic Scales"},
    {id:'2604.23157v1',cat:'physics.soc-ph',title:"Quantifying opinion homophily in online social networks: A bounded confidence perspective"},
  ],
  [
    {id:'2608.27229v1',cat:'stat.ML',title:"On the approximation of posterior laws in compound loss models by conditional Wasserstein barycenters"},
    {id:'2603.11330v1',cat:'q-bio.QM',title:"Ill-Conditioning in Dictionary-Based Dynamic-Equation Learning: A Systems Biology Case Study"},
    {id:'2609.39340v1',cat:'cs.LG',title:"ElectrolyteFM: Unifying Electrolyte Property Prediction through Cross-Property Knowledge Learning"},
    {id:'2609.38805v1',cat:'cs.AI',title:"Explicit Trajectory Diversity for RL-Based Post-Training of LLM Agents"},
    {id:'2609.37488v1',cat:'cs.CL',title:"FORUM: Frozen Outputs Reconciled Using Model Agreement for Visual Grounding"},
  ],
  [
    {id:'2609.14987v1',cat:'cs.CR',title:"ActGuard: Pre-execution Action Auditing against Indirect Prompt Injection in LLM Agents"},
    {id:'2608.00203v1',cat:'cs.DS',title:"A Subsampling Theorem for Constraint Satisfaction Problems with Large Arity"},
    {id:'2609.17744v1',cat:'math.CO',title:"The Theta Conjecture"},
    {id:'2609.09982v1',cat:'math.OC',title:"Boundary approximate controllability of some linear parabolic systems"},
    {id:'2609.06988v1',cat:'math.PR',title:"Almost Sharp Equivalence between Approximate Message Passing and Low-Degree Polynomials"},
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
