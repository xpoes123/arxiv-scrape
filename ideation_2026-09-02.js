export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-02',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, scored on cool/buildable/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.12585v1',cat:'cond-mat.stat-mech',title:"From phase space to Krylov space, one shell at a time"},
    {id:'2603.16894v1',cat:'q-bio.QM',title:"Less Is More in Chemotherapy of Breast Cancer"},
    {id:'2608.06984v1',cat:'cs.CR',title:"HarnessSafe: Evaluating Safety Across Persistent Carriers in Agent Harnesses"},
    {id:'2607.25002v2',cat:'math.PR',title:"How Random Is the Möbius Function? Smoothing, Probability, and the Riemann Hypothesis"},
    {id:'2510.26115v2',cat:'q-bio.PE',title:"Quenched coalescent for diploid population models with selfing and overlapping generations"},
  ],
  [
    {id:'2310.00553v3',cat:'q-fin.PM',title:"Robust Asset-Liability Management"},
    {id:'2608.10661v1',cat:'math.CO',title:"Zero-sum Inverse Realization and Property~(P) under Join Operations"},
    {id:'2606.27545v1',cat:'cs.DS',title:"A simple proof of rapid mixing on random regular graphs beyond uniqueness"},
    {id:'2602.04060v1',cat:'econ.EM',title:"The Output Convergence Debate Revisited: Lessons from recent developments in the analysis of panel data models"},
    {id:'2604.04081v1',cat:'physics.soc-ph',title:"Co-Authoring with AI: How I Wrote a Physics Paper About AI, Using AI"},
  ],
  [
    {id:'2504.19790v1',cat:'q-bio.BM',title:"TDP-43 multidomains and RNA modulate interactions and viscoelasticity in biomolecular condensates"},
    {id:'2602.14843v1',cat:'q-bio.NC',title:"Evolutionarily Primitive Social Entities"},
    {id:'2603.05534v2',cat:'q-bio.QM',title:"In-batch Relational Features Enhance Precision in An Unsupervised Medical Anomaly Detection Task"},
    {id:'2608.28067v1',cat:'cs.AI',title:"SEPO: Evidence-Grounded Prompt Optimization via Structural Editing"},
    {id:'2607.24695v1',cat:'math.PR',title:"Spectral aspects of random heavy-tailed tensors"},
  ],
  [
    {id:'2604.03683v1',cat:'physics.soc-ph',title:"Asymmetric reformulation of draw rules in chess and its implications for game theory: Repetition as loss for White"},
    {id:'2409.11683v1',cat:'q-bio.GN',title:"k-mer-based approaches to bridging pangenomics and population genetics"},
    {id:'2608.28069v1',cat:'cs.AI',title:"VersaGauss: A Versatile Framework for Generating Multiphase Dynamics with 3D Gaussians"},
    {id:'2510.23297v1',cat:'q-bio.PE',title:"Drivers of Variation in the Optimal Spatial Structure of Collective Information Gatherers"},
    {id:'2607.25065v1',cat:'math.PR',title:"Topology and dynamics of unimodular random hyperbolic manifolds"},
  ],
  [
    {id:'2504.19017v1',cat:'q-bio.BM',title:"Sparks: Multi-Agent Artificial Intelligence Model Discovers Protein Design Principles"},
    {id:'2504.18367v2',cat:'q-bio.BM',title:"A Novel 4-D Dataset Paradigm for Studying Complete Ligand-Protein Dissociation Dynamics"},
    {id:'2606.28301v1',cat:'cs.DS',title:"VGB for Masked Diffusion Model: Efficient Test-time Scaling for Reward Satisfaction and Sample Editing"},
    {id:'2607.27073v1',cat:'math.OC',title:"Parameter-Free Dynamic Regret for Online Convex Optimization under Heavy-Tailed Noise"},
    {id:'2608.10772v1',cat:'math.CO',title:"Differential equations for bipartite maps with bounded face degrees"},
  ],
  [
    {id:'2607.27476v1',cat:'math.OC',title:"Entropy-Smooth Convex Optimization Cannot Be Accelerated"},
    {id:'2608.26462v1',cat:'cs.LG',title:"Diff Mining: Logit Differences Reveal Finetuning Objectives"},
    {id:'2307.13422v2',cat:'q-fin.TR',title:"VolTS: A Volatility-based Trading System to forecast Stock Markets Trend using Statistics and Machine Learning"},
    {id:'2307.13832v1',cat:'q-fin.TR',title:"Multi-Factor Inception: What to Do with All of These Features?"},
    {id:'2606.04791v1',cat:'cond-mat.soft',title:"Surface Charge Doping for Ion-Pairing Criticality in Confined Electrolytes"},
  ],
]

const SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper: { type: 'string' },
          pitch: { type: 'string' },
          cool: { type: 'number' },
          buildable: { type: 'number' },
          discussion: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable', 'discussion', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

function batchPrompt(batch) {
  const list = batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are 5 papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper, propose 2-4 concrete ideas. Tag each idea's type: project (something to build/ship), startup (a business), youtube (a video/explainer concept), or demo (an interactive toy/visualization). Score each on:
- cool (1-10): how cool/shareable is this
- buildable (1-10): how buildable TONIGHT as a single self-contained HTML file with no backend (prefer interactive visualizations, playable toys, mind-bending demos)
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server — blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
- discussion_why: one sentence naming which axis it wins on
- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy

Return via the structured schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) =>
  () => agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas surfaced across ${BATCHES.length} batches`)
return { ideas: allIdeas }
