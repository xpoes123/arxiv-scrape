export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-11',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.04524v1',cat:'cs.LG',title:'ODRA: Synthesizing Cognitive Behavioral Therapy Sessions with Structured Chain-Of-Thought and Dynamic Patient Resistance'},
    {id:'2608.04455v1',cat:'cs.LG',title:'Multi-Objective Ranking for Live-Streaming: Balancing Fresh and Delayed Signals with Segmented Interpolation'},
    {id:'2608.05970v1',cat:'cs.AI',title:'SkillMemo: Expert-guided Skill Memory Framework for Compositional Embodied Manipulation'},
    {id:'2608.00528v1',cat:'cs.CL',title:'S4R: Selective Sampling, Subspaces, and Sparse Reconstruction for Compressed Long-Context Attention'},
    {id:'2607.16648v1',cat:'cs.CR',title:'Synchronization-Free Algebraic Fingerprints for Large Language Models: From Autoregressive Generation to Verification'},
  ],
  [
    {id:'2607.16487v1',cat:'cs.CR',title:"Fuzz'EMup: Leveraging EM Side-Channel Emanation to Guide Black-Box Embedded Firmware Fuzzing"},
    {id:'2606.06686v1',cat:'cs.DS',title:'On the Hardness of Optimal Motion on Trees'},
    {id:'2607.19283v1',cat:'math.CO',title:'Resolution of the ENO-TV conjecture: a parity dichotomy'},
    {id:'2607.09566v1',cat:'math.OC',title:'Large-Scale Portfolio Optimization Problem Under Cardinality Constraint With Enhanced Multi-Objective Evolutionary Algorithm'},
    {id:'2607.09495v1',cat:'math.OC',title:'Inertial forward-backward algorithm with exterior penalization and Tikhonov regularization'},
  ],
  [
    {id:'2607.06151v1',cat:'math.PR',title:'Leveraging Extragradient for Effective Sharpness-Aware Minimization in Deep Learning'},
    {id:'2606.29062v2',cat:'math.NT',title:"A Resolution of Erdős Problem 731 under Dyadic Regularity"},
    {id:'2312.09707v1',cat:'q-fin.PM',title:'A return-diversification approach to portfolio selection'},
    {id:'2312.01668v2',cat:'q-fin.PM',title:'Optimal dividend payout with path-dependent drawdown constraint'},
    {id:'2310.14973v2',cat:'q-fin.TR',title:'Reconciling Open Interest with Traded Volume in Perpetual Swaps'},
  ],
  [
    {id:'2602.01817v1',cat:'econ.EM',title:'Do designated market makers provide liquidity during downward extreme price movements?'},
    {id:'2607.00149v1',cat:'stat.ML',title:'Uniform-in-time Propagation-of-Chaos for Stein Variational Gradient Descent'},
    {id:'2606.31769v1',cat:'stat.ML',title:'Policy Optimization Achieves Data-Dependent Regret Bounds in MDPs with Unknown Transitions'},
    {id:'2602.11054v1',cat:'q-bio.NC',title:'A Dynamical Microscope for Multivariate Oscillatory Signals: Validating Regime Recovery on Synthetic and Real Neural Data'},
    {id:'2505.11610v1',cat:'q-bio.BM',title:'Foundation Models for AI-Enabled Biological Design'},
  ],
  [
    {id:'2411.00749v1',cat:'q-bio.GN',title:'PathoGen-X: A Cross-Modal Genomic Feature Trans-Align Network for Enhanced Survival Prediction'},
    {id:'2411.08900v1',cat:'q-bio.GN',title:'RNA-GPT: Multimodal Generative System for RNA Sequence Understanding'},
    {id:'2602.23269v2',cat:'q-bio.QM',title:'An Active Learning Framework for Data-Efficient, Human-in-the-Loop Enzyme Function Prediction'},
    {id:'2511.03849v4',cat:'q-bio.PE',title:'Which Similarity-Sensitive Entropy (Sentropy)?'},
    {id:'2605.20242v1',cat:'physics.chem-ph',title:'LEAP: A closed-loop framework for perovskite precursor additive discovery'},
  ],
  [
    {id:'2605.17083v1',cat:'physics.chem-ph',title:'Basis-free neural-network geminal and Jastrow factors for variational Monte Carlo'},
    {id:'2605.21826v1',cat:'cond-mat.soft',title:'A diffuse-interface theory of active nematic interfaces: transport mechanisms and modal stability'},
    {id:'2606.24809v1',cat:'cond-mat.stat-mech',title:'Optical mapping of phases and phase boundaries in nanoconfined fluids'},
    {id:'2603.27845v1',cat:'physics.soc-ph',title:'Affective Polarization on Small-World and Scale-Free Networks'},
    {id:'2603.26590v1',cat:'physics.soc-ph',title:'How libraries classified physics preprints before arXiv and set the stage for distinguishing physics from other sciences'},
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
