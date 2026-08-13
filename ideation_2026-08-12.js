export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-12',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.05605v1',cat:'cs.LG',title:"Enhancing Anomaly Resilience in Research Networks: A Large-Scale Forecasting Benchmark for Dynamic Security Baselining"},
    {id:'2608.07147v1',cat:'cs.AI',title:"DiDPO: Diff-in-Diff Policy Optimization for Coding Agent Training"},
    {id:'2608.01672v1',cat:'cs.CL',title:"Learning What to Remember: Test-Time Training via Context Distillation"},
    {id:'2607.17075v2',cat:'cs.CR',title:"A Systematic Evaluation of Traditional Privacy Policy Analysis Tools Against LLMs"},
    {id:'2606.08713v1',cat:'cs.DS',title:"The price of incrementality in k-center clustering"},
  ],
  [
    {id:'2607.20422v2',cat:'math.CO',title:"The sharp exponent for the minimal distance problem"},
    {id:'2607.10459v1',cat:'math.OC',title:"A column generation-based fixed-point heuristic for the service-aware multi-commodity flow problem"},
    {id:'2607.07589v1',cat:'math.PR',title:"Surviving from the tip of a cone in competing first-passage percolation"},
    {id:'2606.29478v1',cat:'math.NT',title:"The Categorical Local Langlands Correspondence and Anabelomorphy"},
    {id:'2312.05169v2',cat:'q-fin.PM',title:"Onflow: a model free, online portfolio allocation algorithm robust to transaction fees"},
  ],
  [
    {id:'2310.10500v2',cat:'q-fin.TR',title:"Few-Shot Learning Patterns in Financial Time-Series for Trend-Following Strategies"},
    {id:'2602.02607v1',cat:'econ.EM',title:"The Innovation Tax: Generative AI Adoption, Productivity Paradox, and Systemic Risk in the U.S. Banking Sector"},
    {id:'2607.19378v3',cat:'stat.ML',title:"Native Multi-Dimensional Subquadratic Operators via Input Dependent Long Convolutions"},
    {id:'2602.12547v1',cat:'q-bio.NC',title:"A consequence of failed sequential learning: A computational account of developmental amnesia"},
    {id:'2505.08956v2',cat:'q-bio.BM',title:"QMProt: A Comprehensive Dataset of Quantum Properties for Proteins"},
  ],
  [
    {id:'2410.21345v1',cat:'q-bio.GN',title:"Absorb & Escape: Overcoming Single Model Limitations in Generating Genomic Sequences"},
    {id:'2602.23324v2',cat:'q-bio.QM',title:"Discrete turn strategies emerge in information-limited navigation"},
    {id:'2511.03346v3',cat:'q-bio.PE',title:"Life as a Categorical Information-Handling System: An Evolutionary Information-Theoretic Model of the Holobiont"},
    {id:'2605.17385v1',cat:'physics.chem-ph',title:"Phase Space Bottlenecks in an Adiabatic Marcus Hamiltonian: Cusp Geometry, NHIMs, and Mixed Valence Electron Transfer"},
    {id:'2605.22951v1',cat:'cond-mat.soft',title:"Amorphous Radial Frustration and Water-Like Anomalies in a Ramp-Shoulder Fluid"},
  ],
  [
    {id:'2606.25229v1',cat:'cond-mat.stat-mech',title:"Accelerating Chemical Potential Calculations with Minimal Normalizing Flows"},
    {id:'2603.26896v1',cat:'physics.soc-ph',title:"Interplay between social contact and media exposure in the overestimation of racial diversity in the U.S"},
    {id:'2608.05611v1',cat:'cs.LG',title:"FOCUS: Decoupling Expert Personas in LLMs to Enhance Domain Expert Capabilities"},
    {id:'2608.07167v1',cat:'cs.AI',title:"NiyamAI - An Intent-Bound AI Agent with Cryptographically Verifiable Guardrails using Zero-Knowledge Proofs"},
    {id:'2608.01662v2',cat:'cs.CL',title:"LongCat Sparse Attention: Taming the Lightning via Streaming-aware Hierarchical Cross-Layer Indexing"},
  ],
  [
    {id:'2607.17105v1',cat:'cs.CR',title:"A Multi-Model Hybrid Defense Approach Against White-box Adversarial Attacks in Computer Network Traffic"},
    {id:'2606.08412v1',cat:'cs.DS',title:"Complexity and Algorithms for Unary Translocation Distance"},
    {id:'2607.20299v1',cat:'math.CO',title:"On (3,1)-regular graphs with one more vertex than edges"},
    {id:'2607.10482v1',cat:'math.OC',title:"Tulip-Shaped Orbits for Lunar South-Pole PNT and Direct-to-Earth Relay Missions"},
    {id:'2607.07598v1',cat:'math.PR',title:"Universal Central Limit Theorem for non-exchangeable interacting diffusions"},
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
