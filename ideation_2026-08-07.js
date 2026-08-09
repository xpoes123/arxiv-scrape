export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-07',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2607.26512v1',cat:'cs.CL',title:'Evidence-Ledger Adjudication for Claim-Evidence Traceability'},
    {id:'2607.13346v1',cat:'cs.CR',title:'The Refusal Residue: When Probes Catch Alignment Faking and When They Don\'t'},
    {id:'2605.20882v2',cat:'cond-mat.soft',title:'Monte Carlo simulation of selective adsorption in a binary hard-disk mixture on patterned adhesive surfaces'},
    {id:'2602.21648v1',cat:'q-bio.QM',title:'Multimodal Survival Modeling and Fairness-Aware Clinical Machine Learning for 5-Year Breast Cancer Risk Prediction'},
    {id:'2607.06863v1',cat:'math.OC',title:'Jacobi-like relative value iteration algorithms for ergodic risk-sensitive control of Markov chains'},
  ],
  [
    {id:'2606.27034v2',cat:'math.NT',title:'Averaged Fourier Estimates and Dyadic Approximation on the Cantor set'},
    {id:'2606.30388v3',cat:'stat.ML',title:'A Stochastic--Geometric Theory of Scaling Laws in Grokking'},
    {id:'2608.02671v1',cat:'cs.LG',title:'On the Performance of Malware Detection Classifiers Using Hardware Performance Counters'},
    {id:'2312.13719v2',cat:'q-fin.PM',title:'Market-Adaptive Ratio for Portfolio Management'},
    {id:'2511.04417v3',cat:'q-bio.PE',title:'The evolutionary advantage of replacers in the Moran process'},
  ],
  [
    {id:'2607.16382v1',cat:'math.CO',title:'The Zombie Damage Number of a Graph'},
    {id:'2605.15381v1',cat:'physics.chem-ph',title:'Chemical Origins of Non-Bonded Interactions Within and Between Solids'},
    {id:'2606.02948v1',cat:'cs.DS',title:'From Non-Convex to Strongly Convex: Curvature-Adaptive FTPL for Online Optimization'},
    {id:'2607.03318v1',cat:'math.PR',title:'Continuous Differentiability of the Value Function for Infinite-Dimensional Finite-Horizon Optimal Stopping and Related Variational Inequalities'},
    {id:'2411.03522v1',cat:'q-bio.GN',title:'Exploring the Potentials and Challenges of Using Large Language Models for the Analysis of Transcriptional Regulation of Long Non-coding RNAs'},
  ],
  [
    {id:'2602.13421v2',cat:'q-bio.NC',title:'Metabolic cost of information processing in Poisson variational autoencoders'},
    {id:'2606.22209v1',cat:'cond-mat.stat-mech',title:'Giant Fluctuations in Self-Propelled Particles with Age-Dependent Switching'},
    {id:'2604.20872v1',cat:'physics.soc-ph',title:'Dynamical Model for the Sustainable Development Goals'},
    {id:'2505.15054v4',cat:'q-bio.BM',title:'MolLangBench: A Comprehensive Benchmark for Language-Prompted Molecular Structure Recognition, Editing, and Generation'},
    {id:'2602.02607v1',cat:'econ.EM',title:'The Innovation Tax: Generative AI Adoption, Productivity Paradox, and Systemic Risk in the U.S. Banking Sector'},
  ],
  [
    {id:'2311.18283v1',cat:'q-fin.TR',title:'The two square root laws of market impact and the role of sophisticated market participants'},
    {id:'2608.02089v1',cat:'cs.AI',title:'How Much Does a Reasoning Summary Reveal? An Observability Ladder for Large Language Models'},
    {id:'2607.26497v3',cat:'cs.CL',title:'BM25 Wins at Scale: A Scaling Study of Retrieval-Augmented Generation Paradigms'},
    {id:'2607.13369v1',cat:'cs.CR',title:'xChk: Bring Your Own Identity -- Heterogeneous Assurance with Verifier-Determined Sufficiency'},
    {id:'2605.19795v4',cat:'cond-mat.soft',title:'Function, Complexity and Thermodynamics in Adaptive and Intelligent Soft Matter Systems: An Information-Theoretical Framework'},
  ],
  [
    {id:'2602.22263v2',cat:'q-bio.QM',title:'CryoNet.Refine: A One-step Diffusion Model for Rapid Refinement of Structural Models with Cryo-EM Density Map Restraints'},
    {id:'2607.06742v1',cat:'math.OC',title:'Linear-Quadratic Mean Field Games with Hybrid Local-Global Interactions on Manifolds'},
    {id:'2606.26950v1',cat:'math.NT',title:'Proof of Cigler\'s conjecture on $q$-Hoggatt numbers'},
    {id:'2606.30455v1',cat:'stat.ML',title:'Curvature-Weighted Gradient Diversity: A Noise Measure for Geometry-Adaptive SGD Schedules'},
    {id:'2608.01268v1',cat:'cs.LG',title:'How fine a change can moments see? A scale law for detecting distribution shift, with a kernel calibration rule'},
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
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable'],
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
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) — demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
