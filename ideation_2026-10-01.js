export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-01',
  description: 'Ideate project/startup/youtube/demo ideas from 37 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.35752',cat:'cs.LG',title:"Neural Harmonic Measure Operator"},
    {id:'2609.35751',cat:'cs.LG',title:"How to Loop MoE: Flatten the Experts, Untie the Attention"},
    {id:'2609.35750',cat:'cs.LG',title:"KV-streams for Efficient Compaction in Agentic Reinforcement Learning"},
    {id:'2609.35954',cat:'cs.LG',title:"ROSS: Relearning from Self-Generated Rollouts through Selective Supervision"},
    {id:'2609.35748',cat:'cs.LG',title:"Improving Test-Time Scaling with Adaptive Looped Transformers"},
  ],
  [
    {id:'2609.35745',cat:'cs.LG',title:"Copy the Same, Distill the Difference: Initializing Linear Vision Transformers"},
    {id:'2609.35738',cat:'cs.LG',title:"Harness Learning Enables Generalizable Test-Time Adaptation"},
    {id:'2609.37500',cat:'cs.LG',title:"REVO: Rollout-Efficient Off-Policy Distillation via Variance-Guided Reuse"},
    {id:'2609.35958',cat:'cs.AI',title:"Solver Agent: an Agentic AI Framework for Theoretical Physics Computations Applied to F-theory Uplifts of O3-planes and S-folds"},
    {id:'2609.35770',cat:'cs.AI',title:"FurE: Efficient Instance-Specific 3D Fur Reconstruction without Animal-Fur Datasets"},
  ],
  [
    {id:'2609.35769',cat:'cs.AI',title:"Telescopic Language Models"},
    {id:'2609.35767',cat:'cs.AI',title:"Learning Native Reflection in Unified Models with Interleaved Reinforcement Learning"},
    {id:'2609.35760',cat:'cs.AI',title:"TokenCast: Forecasting Token Consumption During LLM Agent Execution"},
    {id:'2609.30414',cat:'cs.CL',title:"A Unified Account of Concepts and Chunks"},
    {id:'2609.30402',cat:'cs.CL',title:"What Improves Multimodal Misinformation Detection? Answers from a Large-Scale Empirical Study"},
  ],
  [
    {id:'2609.30250',cat:'cs.CL',title:"Agentic Detection of Online Conspiracies"},
    {id:'2609.30243',cat:'cs.CL',title:"JevOut: Natural Context Can Flip Decision Models"},
    {id:'2609.30238',cat:'cs.CL',title:"SemMSA: Latent Semantic-Aided Robust Multimodal Sentiment Analysis with Incomplete Data"},
    {id:'2609.30227',cat:'cs.CL',title:"To Trust or Not to Trust: Retrieval-Augmented Fact Checking in Speech"},
    {id:'2609.30226',cat:'cs.CL',title:"PoEM: Predicting RL Outcomes from Existing Policies"},
  ],
  [
    {id:'2609.30199',cat:'cs.CL',title:"ExplorationBench: Measuring AI Systems' Exploration in Verifiable Alien Worlds"},
    {id:'2609.11258',cat:'cs.CR',title:"SoulAuth: An Actor-native Identity Architecture and Rust Reference Implementation for Humans and Long-lived AI Actors"},
    {id:'2609.11251',cat:'cs.CR',title:"You've Got a BUD in Me: Authenticated Reads from Per-Block Write Logs"},
    {id:'2609.11218',cat:'cs.CR',title:"You Get What You Sample: Evaluating Sampling Strategies for Web Security Measurements"},
    {id:'2609.11195',cat:'cs.CR',title:"FST Pay: Deterministic Safety-Gated Architecture for Youth Digital Payments"},
  ],
  [
    {id:'2609.11194',cat:'cs.CR',title:"Domain-Incremental Learning for Multi-Channel Replay Speech Detection"},
    {id:'2609.11152',cat:'cs.CR',title:"terms.txt: A Consent and Compensation Protocol for Agentic Web Access"},
    {id:'2609.11137',cat:'cs.CR',title:"The Machines Are Calling: Measuring Automated and Synthetic Voices in Unwanted Inbound Calls"},
    {id:'2609.11082',cat:'cs.CR',title:"ToxicRAG: Compromising Retrieval-Augmented Generation Systems via Single-Shot Knowledge Poisoning Attacks"},
    {id:'2607.26630',cat:'cs.DS',title:"Cut Query Reachability for DAGs with Subquadratic Queries"},
  ],
  [
    {id:'2607.27264',cat:'cs.DS',title:"Stronger Lower Bounds for Tree Covers via Cyclic Symmetry"},
    {id:'2607.26592',cat:'cs.DS',title:"Graph k-Coloring in Average Sublinear Time"},
    {id:'2607.26590',cat:'cs.DS',title:"Inapproximability of Unique-Machine Precedence Scheduling for Unit-Length Jobs"},
    {id:'2607.26577',cat:'cs.DS',title:"Simultaneous Coverage and Efficiency Guarantee in Online Conformal Prediction"},
    {id:'2607.26530',cat:'cs.DS',title:"When to Treeify Hash Table Buckets: A Reproducible C Study of List, Hybrid, and Red-Black Tree Chaining"},
  ],
  [
    {id:'2607.26496',cat:'cs.DS',title:"An Efficient Algorithm for Computing Mountain Prominence in Almost Linear Time"},
    {id:'2607.26388',cat:'cs.DS',title:"Sensitivity and Differential Privacy in Metric Voting with Distortion below Three"},
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
    `You are mining arXiv papers for cool, buildable ideas. Here are fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on:\n- cool_score (1-10, how cool/shareable)\n- buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend)\n- discussion_score (1-10, how much this would spark debate on a betting/poker/sports/games Discord server) — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise/counterintuitiveness, (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick 1-4 from [betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy] that best describe the idea.\n\nBe creative and specific — reference the actual math/result, not just the title. Note: tonight's batch skews CS/AI/security-heavy (arXiv rate-limited math/bio/physics fetches) — lean on decision-theory, gambling, and whimsy angles for discussion_score rather than forcing sports/betting fit. Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
