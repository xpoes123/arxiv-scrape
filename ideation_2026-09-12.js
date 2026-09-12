export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-12',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.05207v1',cat:'cs.LG',title:'FluxDisco: Symbolic Regression for Stoichiometric Dynamical Systems via Monte Carlo Graph Search'},
    {id:'2609.05782v1',cat:'cs.AI',title:'Distilling Vision-Language Models for On-Device Fire Understanding'},
    {id:'2609.01202v1',cat:'cs.CL',title:'Towards AI-Assisted Clinical Trial Matching: Practical Considerations, Multicenter Evaluation, and Real-World Deployment'},
    {id:'2608.18289v1',cat:'cs.CR',title:'Evaluating Structured Information Extraction with Open Models in a High Risk Public Sector Application'},
    {id:'2607.02444v1',cat:'cs.DS',title:'Optimal Stabilizer Testing and Learning with Limited Quantum Memory'},
  ],
  [
    {id:'2608.20824v1',cat:'math.CO',title:'A new lower bound for two-color van der Waerden numbers'},
    {id:'2608.10197v1',cat:'math.OC',title:'An Optimal Energy Production Problem with Energy Source Switching and Load Following Nuclear Power Plants'},
    {id:'2608.09465v1',cat:'math.PR',title:'Balancing fractional Brownian motion'},
    {id:'2608.01057v1',cat:'math.NT',title:'Arithmetic of elliptic curves induced by regular Diophantine triples'},
    {id:'2308.15384v2',cat:'q-fin.PM',title:'Hedging Forecast Combinations With an Application to the Random Forest'},
  ],
  [
    {id:'2307.01085v1',cat:'q-fin.TR',title:'Some challenges of calibrating differentiable agent-based models'},
    {id:'2602.06885v1',cat:'econ.EM',title:'Identification and Estimation of Network Models with Nonparametric Unobserved Heterogeneity'},
    {id:'2607.22934v1',cat:'stat.ML',title:'Amortized Bayesian Causal Discovery of Extended Factor Graphs'},
    {id:'2602.16887v1',cat:'q-bio.NC',title:'Construction of a classification model for dementia among Brazilian adults aged 50 and over'},
    {id:'2504.16479v1',cat:'q-bio.BM',title:'The Dance of Atoms-De Novo Protein Design with Diffusion Model'},
  ],
  [
    {id:'2409.02116v1',cat:'q-bio.GN',title:'Discovering Candidate Genes Regulated by GWAS Signals in Cis and Trans'},
    {id:'2603.03604v1',cat:'q-bio.QM',title:'Tracking Feral Horses in Aerial Video Using Oriented Bounding Boxes'},
    {id:'2510.24602v1',cat:'q-bio.PE',title:'Learning to generalize in evolution through annealed population heterogeneity'},
    {id:'2606.12292v1',cat:'physics.chem-ph',title:'Coupling of diffusion and reaction in a thin cylindrical tube: Methodological drawbacks of the Fick-Jacobs approach'},
    {id:'2606.14678v1',cat:'cond-mat.soft',title:'Interfacial mass transfer resistance at fluid-fluid interfaces'},
  ],
  [
    {id:'2608.14628v1',cat:'cond-mat.stat-mech',title:'A formal framework for higher-order spin models via hypergraphs, polymatroids, and the Tutte polynomial'},
    {id:'2604.05990v2',cat:'physics.soc-ph',title:"Direct Air Capture in Europe's 2050 Energy System: Integration, Storage and Cost Drivers"},
    {id:'2609.05194v1',cat:'cs.LG',title:'Phase Transition Frequency as a Training Time Predictor of Test Accuracy in ResNets'},
    {id:'2609.05779v1',cat:'cs.AI',title:'Diffs vs. Whole Files: An Empirical Comparison of Iterative Edit-Based and Direct Generation for Flutter/Dart Code Models'},
    {id:'2609.01198v2',cat:'cs.CL',title:'FinLifeBench: Exhaustive Life-Event History and Financial-State Reconstruction from Longitudinal Banking Dialogue'},
  ],
  [
    {id:'2608.18274v1',cat:'cs.CR',title:'Model Card for OpenAI Privacy Filter'},
    {id:'2607.02443v3',cat:'cs.DS',title:'Improved Approximation Algorithms for n-Pairs Shortest Paths'},
    {id:'2608.21475v1',cat:'math.CO',title:'Unimodular Bicyclic Graphs'},
    {id:'2608.10158v1',cat:'math.OC',title:'A New Approach for Feedback Stabilization and its Application for Data-Driven Control of Polynomial Systems'},
    {id:'2608.09419v1',cat:'math.PR',title:'Left-tail expansions for Schroder branching processes with explicit convergence rates'},
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
