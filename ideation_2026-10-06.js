export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-06',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2610.02363v1',cat:'cs.LG',title:"ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time"},
    {id:'2610.01936v1',cat:'cs.AI',title:"Mapping the RAG Landscape: A Four Axis Taxonomy of Efficiency, Defense, Interactivity, and Reasoning"},
    {id:'2609.36218v1',cat:'cs.CL',title:"CineSubBench: Evaluating LLMs on Long-Form Narrative and Cultural Understanding from Multilingual Subtitles"},
    {id:'2609.18275v1',cat:'cs.CR',title:"Witness Encryption via Prime-Order Generic Groups"},
    {id:'2609.12979v1',cat:'math.OC',title:"Directional differentiability for the solution map of the bilateral parabolic obstacle problem"},
  ],
  [
    {id:'2609.08991v1',cat:'math.PR',title:"Endpoint and Vanishing-Density Asymptotics for Hardy-Szego Zero Counts"},
    {id:'2609.20522v1',cat:'math.CO',title:"Infinite prime sumsets in structured and U^k(Phi)-uniform sets"},
    {id:'2608.03830v1',cat:'cs.DS',title:"A Single-Exponential FPT Algorithm for 2-Vertex-Connectivity Augmentation"},
    {id:'2609.03112v1',cat:'math.NT',title:"Poissonian pair correlations for the three-particle Sutherland model"},
    {id:'2306.05568v2',cat:'q-fin.PM',title:"Maximally Machine-Learnable Portfolios"},
  ],
  [
    {id:'2305.06961v2',cat:'q-fin.TR',title:"Copula-Based Trading of Cointegrated Cryptocurrency Pairs"},
    {id:'2602.19384v1',cat:'econ.EM',title:"How Robust are Robustness Checks?"},
    {id:'2609.01576v2',cat:'stat.ML',title:"Simultaneous Pointwise Majorization for Mixed Tail Processes with Applications in Gaussian Processes"},
    {id:'2603.16897v1',cat:'q-bio.NC',title:"EEG-Based Brain-LLM Interface for Human Preference Aligned Generation"},
    {id:'2503.23341v2',cat:'q-bio.BM',title:"GPx4 is bound to peroxidized membranes by a hydrophobic anchor"},
  ],
  [
    {id:'2407.13182v1',cat:'q-bio.GN',title:"SpaDiT: Diffusion Transformer for Spatial Gene Expression Prediction using scRNA-seq"},
    {id:'2603.12349v1',cat:'q-bio.QM',title:"Budget-Sensitive Discovery Scoring: A Formally Verified Framework for Evaluating AI-Guided Research"},
    {id:'2510.27006v1',cat:'q-bio.PE',title:"Generalized Maximum Entropy: When and Why you need it"},
    {id:'2606.31660v1',cat:'physics.chem-ph',title:"Contrastive Regularization of Machine Learning Potentials"},
    {id:'2607.04897v1',cat:'cond-mat.soft',title:"Size Effect of Monovalent Ions on Polyelectrolyte Brushes"},
  ],
  [
    {id:'2608.21261v1',cat:'cond-mat.stat-mech',title:"Meandering stripes in the frustrated J_1-J_2 Ising model on the honeycomb lattice"},
    {id:'2604.23714v1',cat:'physics.soc-ph',title:"Temporal connection probabilities in real networks"},
    {id:'2610.02359v1',cat:'cs.LG',title:"Lexicographic Multi-Objective On-Policy Distillation"},
    {id:'2610.01921v2',cat:'cs.AI',title:"Cross-Lingual Alignment for Decoder-Only Models using MoE Routers"},
    {id:'2609.36214v1',cat:'cs.CL',title:"Lost in Translation: Measuring the Effect of Non-Native English on End User Performance"},
  ],
  [
    {id:'2609.18272v1',cat:'cs.CR',title:"Who Audits Whom, on What Substrate, with What Evidence? An Independence-Graded Audit Protocol"},
    {id:'2609.12961v1',cat:'math.OC',title:"Sampled-data optimal control of linear fractional-order systems"},
    {id:'2609.08980v2',cat:'math.PR',title:"The Ding-Song-Sun inequality for a class of even ferromagnets"},
    {id:'2609.20520v1',cat:'math.CO',title:"Sharp spectral norm concentration of sparse random tensors"},
    {id:'2608.03819v2',cat:'cs.DS',title:"From b-Coloring to b*-Coloring: Large Girth and Parameterized Complexity"},
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
    `You are mining arXiv papers for cool, buildable ideas. Here are fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on:\n- cool_score (1-10, how cool/shareable)\n- buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend)\n- discussion_score (1-10, how much this would spark debate on a betting/poker/sports/games Discord server) — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise/counterintuitiveness, (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: decision-theory, betting, ai, and math tags have scored net-positive in last week's forum votes (mild upweight if a good fit); gambling/econ/poker/whimsy/sports/games are neutral — don't force a tag that doesn't fit.\n- tags: pick 1-4 from [betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy] that best describe the idea.\n\nBe creative and specific — reference the actual math/result, not just the title. Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
