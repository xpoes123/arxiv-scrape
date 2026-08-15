export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-14',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.03610v2',cat:'cs.CL',title:"Language-Specialized Multi-Teacher On-Policy Distillation for Multilingual LLM-Based ASR"},
    {id:'2505.08632v1',cat:'q-bio.BM',title:"Computational Analysis using Multi-ligand Simultaneous Docking of Withaferin A and Garcinol Reveals Enhanced BCL-2 and AKT-1 Inhibition"},
    {id:'2607.23111v1',cat:'math.CO',title:"Algorithms and results on multiparameter counting of numerical semigroups"},
    {id:'2607.18770v1',cat:'cs.CR',title:"GLID: Gated Local Intrinsic Dimension Repairs the Blind Spots of Face-Forgery Detectors"},
    {id:'2607.12318v1',cat:'math.OC',title:"An adaptive interior-point method with backtracking line search for convex constrained optimization"},
  ],
  [
    {id:'2607.00332v1',cat:'math.NT',title:"Functional Equations Characterize Dirichlet Characters"},
    {id:'2511.03242v1',cat:'q-bio.PE',title:"Topography, climate, land cover, and biodiversity: Explaining endemic richness and management implications on a Mediterranean island"},
    {id:'2606.12179v1',cat:'cs.DS',title:"Nearly Instance Optimal Sparse Matrix Approximation from Matrix-Vector Products"},
    {id:'2410.20491v1',cat:'q-bio.GN',title:"Nanopore DNA Sequencing Technology: A Sociological Perspective"},
    {id:'2603.29282v1',cat:'physics.soc-ph',title:"Social Amplification Dominates Collective Hazard Response"},
  ],
  [
    {id:'2608.09109v1',cat:'cs.AI',title:"Different Feedback, Different Updates: Selective Self-Learning from User Interactions for Large Language Models"},
    {id:'2602.14843v1',cat:'q-bio.NC',title:"Evolutionarily Primitive Social Entities"},
    {id:'2607.02681v1',cat:'stat.ML',title:"Contaminated Multi-task Learning with Heterogeneity: Fundamental Limits and Optimal Algorithms"},
    {id:'2312.00202v2',cat:'q-fin.PM',title:"Investigate The ESG Score Methodology"},
    {id:'2605.18531v1',cat:'physics.chem-ph',title:"Enhanced Ionic Conductivity of confined Ionic-Liquid in Angstrom-scale 2D channels"},
  ],
  [
    {id:'2310.04027v2',cat:'q-fin.TR',title:"Enhancing Financial Sentiment Analysis via Retrieval Augmented Large Language Models"},
    {id:'2605.24901v1',cat:'cond-mat.soft',title:"Geometry, elasticity, and activity in the transport of self-propelled filaments in turbulence"},
    {id:'2606.27972v1',cat:'cond-mat.stat-mech',title:"A Finite Element Method for Fluctuating Navier--Stokes Equations"},
    {id:'2608.08182v1',cat:'cs.LG',title:"Biologically Informed Representation Learning for Robust Cross-Center Generalization of MALDI-TOF Mass Spectrometry"},
    {id:'2607.09946v1',cat:'math.PR',title:"Statistics on Yau's conjecture: Variance asymptotics"},
  ],
  [
    {id:'2602.22673v2',cat:'q-bio.QM',title:"Forecasting Bacterial Antimicrobial Resistance Trends Using Machine Learning on WHO GLASS Surveillance Data"},
    {id:'2602.02604v1',cat:'econ.EM',title:"AI Assisted Economics Measurement From Survey: Evidence from Public Employee Pension Choice"},
    {id:'2608.03617v1',cat:'cs.CL',title:"A machine-readable catalogue of the Tsiolkovsky papers, and a way to measure how well its handwriting can be read"},
    {id:'2505.08850v1',cat:'q-bio.BM',title:"High-throughput Screening of the Mechanical Properties of Peptide Assemblies"},
    {id:'2607.23101v2',cat:'math.CO',title:"The Excluded Vertex-Minors and Pivot-Minors for Rank-Width at Most Two"},
  ],
  [
    {id:'2607.18960v1',cat:'cs.CR',title:"SFGA: A Statistics-First Gating Architecture with Adjudicative Escalation for Trustworthy SFT Data Procurement"},
    {id:'2607.12431v2',cat:'math.OC',title:"Local Maxima of the Entrywise l4 Norm on the Orthogonal Group"},
    {id:'2607.00592v1',cat:'math.NT',title:"Character sums over smooth numbers"},
    {id:'2511.01122v1',cat:'q-bio.PE',title:"The Future Orchid Diversity of Great Britain and Ireland using an SDM Approach"},
    {id:'2606.11760v1',cat:'cs.DS',title:"A Fast Gaussian Mechanism under Continual Observation, with Applications"},
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
