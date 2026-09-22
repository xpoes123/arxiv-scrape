export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-22',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.17223',title:"Memorisation bias in medical AI"},
    {id:'2609.17731',title:"A Systematic Evaluation of the COTQ Provincial Land Cover Product"},
    {id:'2609.10935',title:"Empirical Evaluation of Membership Inference Attacks on NLP Text Classifiers: A Baseline Study on SST-2"},
    {id:'2609.05503',title:"A Survey on Adversarial Attacks and Defenses for Diffusion Models Across Multiple Modalities"},
    {id:'2607.13247',title:"Quadratic Probing Revisited: Smoothed Analysis and the Fall of Robin Hood"},
  ],
  [
    {id:'2609.04054',title:"An obstruction to the maximal singularity of the Hilbert scheme of points on threefolds"},
    {id:'2608.22829',title:"Partial Progress on Stone's Conjecture: P0-Membership of Fully Semimonotone Matrices with Positive Determinant"},
    {id:'2608.25689',title:"Analysis of a first-order explicit positivity preserving scheme for a class of scalar SDEs"},
    {id:'2608.15553',title:"Beyond endoscopy for GL_2 over Q with ramification 5: cancellation theory"},
    {id:'2307.09332',title:"Company2Vec -- German Company Embeddings based on Corporate Websites"},
  ],
  [
    {id:'2306.00599',title:"The Cost of Misspecifying Price Impact"},
    {id:'2602.12043',title:"Improved Inference for CSDID Using the Cluster Jackknife"},
    {id:'2608.03889',title:"Confidence Horizons"},
    {id:'2602.16072',title:"Omni-iEEG: A Large-Scale, Comprehensive iEEG Dataset and Benchmark for Epilepsy Research"},
    {id:'2504.02014',title:"HCAF-DTA: drug-target binding affinity prediction with cross-attention fused hypergraph neural networks"},
  ],
  [
    {id:'2408.05258',title:"scASDC: Attention Enhanced Structural Deep Clustering for Single-cell RNA-seq Data"},
    {id:'2603.04638',title:"Spinverse: Differentiable Physics for Permeability-Aware Microstructure Reconstruction from Diffusion MRI"},
    {id:'2510.23360',title:"Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells: game theory modeling of metastasis"},
    {id:'2606.19418',title:"Sequential replica exchange with solute tempering for atomistic modeling of supramolecular polymer structures"},
    {id:'2606.22250',title:"Quasi-two-dimensional dispersions of Brownian particles with competitive interactions"},
  ],
  [
    {id:'2608.03355',title:"Discrepancy between the H-Function and Entropy: Boltzmann equation for hard-sphere gases"},
    {id:'2604.13885',title:"Role of volatility mixing in wealth condensation transition"},
    {id:'2609.17755',title:"Evolution of US Oral Political Language"},
    {id:'2609.17745',title:"REVERSAL-BENCH: A Reversibility Axis and Reset Oracle for Measuring the Reset-Free RL Cliff"},
    {id:'2609.11022',title:"New Evidence, Same Choice: Testing Physical Experiment Selection in Vision Language Models"},
  ],
  [
    {id:'2609.16023',title:"Are We Grading Properly? Understanding Failure Modes in Medical Benchmarks"},
    {id:'2602.13887',title:"Human-Aligned Evaluation of a Pixel-wise DNN Color Constancy Model"},
    {id:'2602.16004',title:"Time-Varying Directed Interactions in Functional Brain Networks: Modeling and Validation"},
    {id:'2510.22220',title:"Evolution of the lexicon: a probabilistic point of view"},
    {id:'2510.21371',title:"SIR models with demography, random transmission coefficient and non-autonomous vaccination rate"},
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
  const list = batch.map(p => `- ${p.id} ${p.title}`).join('\n')
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
