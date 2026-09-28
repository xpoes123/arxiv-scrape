export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-28',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2609.30633",cat:"cs.LG",title:"Stable initialization without the CLT"},
    {id:"2609.30489",cat:"cs.AI",title:"BioEVAL: A global, multi-institutional benchmark of large language and multimodal models for bioengineering"},
    {id:"2609.30784",cat:"cs.CL",title:"Symbiotic Architecture for Post-Hoc Audio Extension of Frozen Language Models"},
    {id:"2609.28899",cat:"cs.CR",title:"When Do Differentially Private Inputs Protect Graph Shift Operators?"},
    {id:"2609.25393",cat:"cs.DS",title:"On the generation of multiplicative groups by small primes"},
  ],
  [
    {id:"2609.28246",cat:"math.OC",title:"Near-Optimal Higher-Order Oracle Complexity for Convex--Concave Minimax Optimization"},
    {id:"2609.29887",cat:"q-fin.PM",title:"Cost-Sensitive Online Window Size Selection for Portfolio Management"},
    {id:"2609.31260",cat:"q-fin.TR",title:"Agentic Limit Order Books: Phase Transitions and Market Impact"},
    {id:"2609.28841",cat:"econ.EM",title:"Reduced-Rank Autoregressive Models for Matrix Time Series"},
    {id:"2609.28371",cat:"stat.ML",title:"Memory-Conditioned Diffusion Model for Generalized Langevin Dynamics"},
  ],
  [
    {id:"2609.30628",cat:"cs.LG",title:"OpenHail: An Event-Driven Gymnasium Environment for Electric Ride-Hailing Fleet Control"},
    {id:"2609.30484",cat:"cs.AI",title:"Do LLMs Understand Context? A Knowledge Graph-Based Evaluation Framework"},
    {id:"2609.30706",cat:"cs.CL",title:"LAVOIR: Teaching a Single-Pass Decision Encoder When and What to Ask with Amortized Value of Information"},
    {id:"2609.28843",cat:"cs.CR",title:"Blockchain-Enabled Artificial Intelligence and AI Agents for Secure Data Sharing and Cybersecurity Applications"},
    {id:"2609.25127",cat:"cs.DS",title:"Stable Regularity Lemmas: Efficient Algorithms and Essentially Tight Littlestone Bounds"},
  ],
  [
    {id:"2609.28238",cat:"math.OC",title:"Second-Order Stationarity with Common Random Losses: Matching Tolerance Bounds"},
    {id:"2609.27113",cat:"q-fin.PM",title:"Active Portfolio Management in Concentrated Equity Markets"},
    {id:"2609.31379",cat:"q-fin.TR",title:"How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks"},
    {id:"2609.27944",cat:"econ.EM",title:"Distributional Difference-in-Differences: Aggregation Before or After Quantile Inversion?"},
    {id:"2609.28177",cat:"stat.ML",title:"How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection?"},
  ],
  [
    {id:"2609.30605",cat:"cs.LG",title:"Probabilistic Robustness-driven Universal Adversarial Perturbations with Explainability against Deep Reinforcement Learning-based Intrusion Detection System"},
    {id:"2609.30469",cat:"cs.AI",title:"Pretrained ASR Pseudo-labeling for Noisy Police Audio"},
    {id:"2609.30657",cat:"cs.CL",title:"Prompt Injection Detection for Email Agents Through Attack Chain Modeling"},
    {id:"2609.28725",cat:"cs.CR",title:"Unmasking Shortcut Learning in IoT Intrusion Detection: A Forensic, Multi-Paradigm Evaluation of Feature Dependence and Data Leakage"},
    {id:"2609.07204",cat:"cs.DS",title:"Agentic Algorithm Engineering: Improving Shared-Memory Exact Minimum Cuts"},
  ],
  [
    {id:"2609.28202",cat:"math.OC",title:"Matching Upper and Lower Bounds for Higher-Order Nonconvex Finite-Sum Optimization"},
    {id:"2609.27051",cat:"q-fin.PM",title:"Propose, Don't Judge: An Anytime-Valid Referee for LLM Agents That Mine Investment Factors"},
    {id:"2609.29108",cat:"q-fin.TR",title:"Functional Architecture of European Electricity Trading Markets: Requirements for AI Supported Trading Systems under Regulatory Constraints"},
    {id:"2609.27691",cat:"econ.EM",title:"Testing for Heterogeneous Treatment Effects in Regression Discontinuity Designs"},
    {id:"2609.28122",cat:"stat.ML",title:"NPBoost: Neural Processes with Gradient-Boosted Fixed Effects"},
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
