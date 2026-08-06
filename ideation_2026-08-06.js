export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-06',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2312.13719v2',cat:'q-fin.PM',title:'Market-Adaptive Ratio for Portfolio Management'},
    {id:'2607.15034v1',cat:'math.CO',title:'Shifted S-templates and improved lower bounds for Schur numbers'},
    {id:'2607.13093v4',cat:'cs.CR',title:'Efficient and Privacy Aware Edge Cloud Collaborative Inference for Large Models'},
    {id:'2605.20709v1',cat:'cond-mat.soft',title:'What Lies Between Crystal and Randomly Packed Structures? A General Characterization'},
    {id:'2602.02604v1',cat:'econ.EM',title:'AI Assisted Economics Measurement From Survey: Evidence from Public Employment'},
  ],
  [
    {id:'2311.18283v1',cat:'q-fin.TR',title:'The two square root laws of market impact and the role of sophisticated market participants'},
    {id:'2607.05640v2',cat:'math.OC',title:'Input-to-State Stability Implications in Contraction Theory'},
    {id:'2608.01223v1',cat:'cs.AI',title:'Perspectives on Tsallis Statistics for Artificial Intelligence'},
    {id:'2602.22289v2',cat:'q-bio.QM',title:'What Topological and Geometric Structure Do Biological Foundation Models Learn?'},
    {id:'2603.26590v1',cat:'physics.soc-ph',title:'How libraries classified physics preprints before arXiv and set the standard'},
  ],
  [
    {id:'2411.05055v1',cat:'q-bio.GN',title:'Integrating Large Language Models for Genetic Variant Classification'},
    {id:'2607.05683v1',cat:'math.OC',title:'Deep Reinforcement Learning for Dynamic Battery Management of Autonomous Systems'},
    {id:'2602.01417v1',cat:'econ.EM',title:'Identification and Estimation in Fuzzy Regression Discontinuity Design'},
    {id:'2603.26896v1',cat:'physics.soc-ph',title:'Interplay between social contact and media exposure in the overestimation of risk'},
    {id:'2605.14584v1',cat:'physics.chem-ph',title:'All-atomistic Transferable Neural Potentials for Protein Solvation'},
  ],
  [
    {id:'2607.01877v1',cat:'math.PR',title:"Coupling some conditioned Lévy trees with the Kesten tree"},
    {id:'2607.02013v1',cat:'math.PR',title:'Resolution of the Detection Threshold Conjecture for Random Geometric Graphs'},
    {id:'2606.21095v2',cat:'cond-mat.stat-mech',title:'Asymptotic hydrographs and anomalous dispersion in mass-conserving stochastic transport'},
    {id:'2505.15093v2',cat:'q-bio.BM',title:'Steering Generative Models with Experimental Data for Protein Fitness'},
    {id:'2605.19664v1',cat:'cond-mat.soft',title:'Engineering Tunable Synthetic Su-Schrieffer-Heeger Chains in Liquid Crystals'},
  ],
  [
    {id:'2607.05697v1',cat:'math.OC',title:'Stability and Dual Valuation of Contingent Claims under Rockafellian Perturbation'},
    {id:'2606.21226v1',cat:'cond-mat.stat-mech',title:'Synchronization in the quantum regime'},
    {id:'2411.03871v4',cat:'q-bio.GN',title:'Safe Sequences via Dominators in DAGs for Path-Covering Problems'},
    {id:'2411.02125v1',cat:'q-bio.GN',title:'Revisiting K-mer Profile for Effective and Scalable Genome Representation'},
    {id:'2606.01309v1',cat:'cs.DS',title:'Multiagent Matroid Upgrading: Greedy is Fair and Efficient'},
  ],
  [
    {id:'2606.01333v1',cat:'cs.DS',title:'Adversarial Configurations for the ReCom Transition Function'},
    {id:'2605.14424v1',cat:'physics.chem-ph',title:'Observation of spontaneous N-bearing PAH formation using ion trap: a novel route'},
    {id:'2606.01342v3',cat:'cs.DS',title:'Towards Optimal Robustness in Learning-Augmented Paging'},
    {id:'2605.19684v1',cat:'cond-mat.soft',title:'The fracture resistance of elastic networks increases with the density of defects'},
    {id:'2607.25270v1',cat:'cs.CL',title:'Where Steering Signals Come From: Activation Source Selection in Activation Steering'},
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
