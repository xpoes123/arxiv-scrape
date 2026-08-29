export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-29',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, scored on cool/buildable/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.21577v1',cat:'cs.LG',title:'Anchoring Bias: A Persistent Fairness Backdoor Attack against MLLMs under Continual Learning'},
    {id:'2608.23631v1',cat:'cs.AI',title:'TRACE: Transition-Aware Residual Control for Multi-Objective Materials Discovery'},
    {id:'2608.17150v1',cat:'cs.CL',title:'KnowSim: Evaluating Information Calibration in LLM Assistants with User Simulators that Learn'},
    {id:'2608.02774v1',cat:'cs.CR',title:'Privacy-Preserving AI Verification via Minimal Information Disclosure'},
    {id:'2606.23837v1',cat:'cs.DS',title:'Flood-It with Jewelry -- Characterizing the Game Complexity for Cograph Generalizations'},
  ],
  [
    {id:'2608.06372v1',cat:'math.CO',title:'Squarefree Matrix Formulas for the CWR Invariant of Alternating Knots and Links'},
    {id:'2607.23008v1',cat:'math.OC',title:'Nesterov acceleration in optimizing over probability measures'},
    {id:'2607.20882v2',cat:'math.PR',title:'An Eyring--Kramers Law for the Hypoelliptic Third-Order Langevin Diffusion'},
    {id:'2607.11763v1',cat:'math.NT',title:'Local-global compatibility of automorphic Galois representations over CM fields at $p$'},
    {id:'2310.10500v2',cat:'q-fin.PM',title:'Few-Shot Learning Patterns in Financial Time-Series for Trend-Following Strategies'},
  ],
  [
    {id:'2308.08066v1',cat:'q-fin.TR',title:'The Geometry of Constant Function Market Makers'},
    {id:'2602.05137v2',cat:'econ.EM',title:'Nested Pseudo-GMM Estimation of Demand for Differentiated Products'},
    {id:'2607.12501v3',cat:'stat.ML',title:'Gauge-Fixing the Forward-Forward Objective: A Whitened Goodness Derived from a Likelihood-Ratio Account'},
    {id:'2602.13368v3',cat:'q-bio.NC',title:'The Influence of Width Ratios on Structural Beauty in Male Faces'},
    {id:'2505.00530v1',cat:'q-bio.BM',title:'Leveraging Partial SMILES Validation Scheme for Enhanced Drug Design in Reinforcement Learning Frameworks'},
  ],
  [
    {id:'2410.02085v1',cat:'q-bio.GN',title:'Multi-Omic and Quantum Machine Learning Integration for Lung Subtypes Classification'},
    {id:'2603.05534v2',cat:'q-bio.QM',title:'In-batch Relational Features Enhance Precision in An Unsupervised Medical Anomaly Detection Task'},
    {id:'2511.01905v2',cat:'q-bio.PE',title:'The impact of nonheritable variation in division rates on population growth across environments'},
    {id:'2605.31188v1',cat:'physics.chem-ph',title:'Thermal chemical reactivity in Frenkel exciton-polariton cavities'},
    {id:'2606.00560v1',cat:'cond-mat.soft',title:'Velocity Resetting of Inertial Run-and-Tumble Particles in Non-Newtonian Media: Velocity Distribution, Diffusion and First-Passage Time'},
  ],
  [
    {id:'2607.07556v1',cat:'cond-mat.stat-mech',title:'Entanglement Asymmetry in Random Quantum Automata'},
    {id:'2604.00674v1',cat:'physics.soc-ph',title:'Managing the Mismatch: The Role of Flexibility on the Path to a Carbon-Neutral Energy System'},
    {id:'2608.06369v1',cat:'math.CO',title:'A proof of Andersen\'s rainbow path conjecture for large $n$'},
    {id:'2607.20838v1',cat:'math.PR',title:'Long-memory Markov chains with power-law intensities'},
    {id:'2607.22982v1',cat:'math.OC',title:'Finite-Time Analysis of the Natural Policy Gradient in Finite-Horizon Markov Decision Processes'},
  ],
  [
    {id:'2310.08284v1',cat:'q-fin.PM',title:'Statistical arbitrage portfolio construction based on preference relations'},
    {id:'2308.07329v1',cat:'q-fin.TR',title:'Variations on the Reinforcement Learning performance of Blackjack'},
    {id:'2602.04092v2',cat:'econ.EM',title:'Time-to-Event Estimation with Unreliably Reported Events in Medicare Health Plan Payment'},
    {id:'2606.23655v1',cat:'cs.DS',title:'Dynamic estimation of slowly varying sequences'},
    {id:'2607.12438v1',cat:'stat.ML',title:'Fisher Rank Inflation: A Spectral Signature of Memorization under Label Noise'},
  ],
];
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

For each paper (or combination of papers if a crossover idea is stronger), propose 2-4 ideas total across the batch, each tagged with one type:
- project: something buildable as a tool/library/service
- startup: a business angle
- youtube: a video/explainer concept
- demo: an interactive web toy that lets someone FEEL the paper's actual mathematical/scientific result

Score each idea 1-10 on:
- cool: how cool/shareable/wow is it
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) -- demos should score highest here if they only need client-side math/sim
- discussion: how much it would spark debate on a betting/poker/sports/games Discord server -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)

Also give a one-line discussion_why explaining the discussion score, and tag each idea with 1-3 tags from this exact list: betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy.

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
