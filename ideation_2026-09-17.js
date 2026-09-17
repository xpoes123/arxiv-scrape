export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-17',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2606.20049',cat:'cond-mat.soft',title:'Constraint-Limited Tube Orientation of Entangled Polymers in Oscillatory Shear'},
    {id:'2607.27305',cat:'cond-mat.stat-mech',title:'Mean-Field Theory of Chiral Active Model B: Arrested Coarsening and Chimera States'},
    {id:'2609.12814',cat:'cs.AI',title:'RunningTensor: Generalizing Linear Attention to Higher-Order Recurrent Memory'},
    {id:'2609.06771',cat:'cs.CL',title:'AuthBench: A Large-Scale Multilingual Benchmark for Authorship Representation'},
    {id:'2608.25091',cat:'cs.CR',title:'Auto-Policy, not Auto-Skill: Compiled Agent Skills for the Physical World'},
  ],
  [
    {id:'2607.09268',cat:'cs.DS',title:'Matroid Contention Resolution with Concentration'},
    {id:'2609.12223',cat:'cs.LG',title:'Predicting Collision Cross Sections with GRACE: Geometric Residual Additive Coupling'},
    {id:'2602.12023',cat:'econ.EM',title:'Decomposition of Spillover Effects Under Misspecification: Pseudo-true Effects'},
    {id:'2608.28971',cat:'math.CO',title:'Calculus of the Facial Distance'},
    {id:'2608.09906',cat:'math.NT',title:'On the β=2 Partition function for Dirichlet L-functions'},
  ],
  [
    {id:'2608.17808',cat:'math.OC',title:'Self-Consistent Adjoint Policy Iteration for Constrained Dynamic Portfolio'},
    {id:'2608.18431',cat:'math.PR',title:'Process Optimization Under Uncertainty for Improving Bond Quality'},
    {id:'2606.16147',cat:'physics.chem-ph',title:'Stitching Molecular Worlds Together with Physics-Coupled Diffusion Models'},
    {id:'2604.22815',cat:'physics.soc-ph',title:'On Common Misconceptions in Classical Vehicle Dynamics'},
    {id:'2504.05564',cat:'q-bio.BM',title:'Comprehensive Insights into Cholesterol-Mediated Modulation of Membranes'},
  ],
  [
    {id:'2408.12031',cat:'q-bio.GN',title:'Comparison of algorithms used in single-cell transcriptomic data analysis'},
    {id:'2602.16004',cat:'q-bio.NC',title:'Time-Varying Directed Interactions in Functional Brain Networks'},
    {id:'2510.23360',cat:'q-bio.PE',title:'Effect of intratumor heterogeneity in managing the go-or-grow dichotomy'},
    {id:'2603.06740',cat:'q-bio.QM',title:'ViroGym: Realistic Large-Scale Benchmarks for Evaluating Viral Protein Design'},
    {id:'2307.13546',cat:'q-fin.PM',title:'Transfer Learning for Portfolio Optimization'},
  ],
  [
    {id:'2309.03202',cat:'q-fin.TR',title:'Evaluation of Reinforcement Learning Techniques for Trading on a Diverse Portfolio'},
    {id:'2607.27995',cat:'stat.ML',title:'The Noise Premium in Adversarial Training for Kernel Regression'},
    {id:'2606.20261',cat:'cond-mat.soft',title:'Activity driven buckling and pattern formation in shells of oriented self-propelled particles'},
    {id:'2609.06811',cat:'cs.CL',title:'Measuring GEO Visibility: Prompt Corpora Define the Answer Market'},
    {id:'2609.16028',cat:'cs.LG',title:'Molecular representation shapes the balance between target fidelity and generalization'},
  ],
  [
    {id:'2608.10551',cat:'math.NT',title:'Mutation-preserving generalized cluster algebras and Laurent mutation'},
    {id:'2606.16156',cat:'physics.chem-ph',title:'Phase Behavior of Unilamellar Hybrid Lipid-Diblock Copolymer Membranes'},
    {id:'2408.09635',cat:'q-bio.GN',title:'Meta-Learning on Augmented Gene Expression Profiles for Enhanced Lung Cancer Prediction'},
    {id:'2603.04480',cat:'q-bio.QM',title:'AbAffinity: A Large Language Model for Predicting Antibody Binding Affinity'},
    {id:'2607.28408',cat:'stat.ML',title:'On-Policy and Off-Policy Learning for Large Action Spaces'},
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
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are these papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper, propose 2-4 concrete ideas. Tag each idea's type: project (something to build/ship), startup (a business), youtube (a video/explainer concept), or demo (an interactive toy/visualization). Score each on:
- cool (1-10): how cool/shareable is this
- buildable (1-10): how buildable TONIGHT as a single self-contained HTML file with no backend (prefer interactive visualizations, playable toys, mind-bending demos)
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
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
