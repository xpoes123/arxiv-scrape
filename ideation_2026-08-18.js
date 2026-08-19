export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-18',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.11499v1',cat:'cs.LG',title:"HyperFix: Combinatorial Nonlinear Correction for Task Vector Merging"},
    {id:'2608.12476v1',cat:'cs.AI',title:"Governed Persistent Memory: Source-Bound State Semantics and Fail-Closed Release for Long-Horizon Agents"},
    {id:'2608.05806v1',cat:'cs.CL',title:"Hierarchical Latent Prediction for Language Models"},
    {id:'2607.21951v1',cat:'cs.CR',title:"SIREN (Luring LLMs onto the Rocks): PAIR-Driven Preference Manipulation in Web-RAG Recommenders"},
    {id:'2606.13272v1',cat:'cs.DS',title:"Split Tallies: A Discrete Certificate Calculus for Auditing Dynamic Ordered Sets in Constant Memory"},
  ],
  [
    {id:'2607.25490v1',cat:'math.CO',title:"An Exact Obstruction to Uniform Average Mixing on P_11"},
    {id:'2607.15021v2',cat:'math.OC',title:"Heilbronn's Problem in the Unit Triangle: Certified Optimal Configurations for up to n<=8"},
    {id:'2607.11756v3',cat:'math.PR',title:"Full replica symmetry breaking in the Sherrington-Kirkpatrick model"},
    {id:'2607.03257v1',cat:'math.NT',title:"Lubin's conjecture for height-one p-adic dynamical systems"},
    {id:'2607.12263v1',cat:'math.PR',title:"Random sets are close to low-discrepancy sets"},
  ],
  [
    {id:'2312.00033v1',cat:'q-fin.PM',title:"DeFi Security: Turning The Weakest Link Into The Strongest Attraction"},
    {id:'2309.10220v1',cat:'q-fin.TR',title:"Comparing effects of price limit and circuit breaker in stock exchanges by an agent-based model"},
    {id:'2602.01817v1',cat:'econ.EM',title:"Do designated market makers provide liquidity during downward extreme price movements?"},
    {id:'2607.05226v2',cat:'stat.ML',title:"The Exact Worst-Case Tail Probability under Bounded Kurtosis"},
    {id:'2607.04875v2',cat:'stat.ML',title:"On the Complexity of Low-Rank Matrix Signing and Entrywise Power Matrix Factorization"},
  ],
  [
    {id:'2602.13421v2',cat:'q-bio.NC',title:"Metabolic cost of information processing in Poisson variational autoencoders"},
    {id:'2505.04823v4',cat:'q-bio.BM',title:"ProteinGuide: On-the-fly property guidance for protein sequence generative models"},
    {id:'2410.16917v2',cat:'q-bio.GN',title:"DNAHLM -- DNA sequence and Human Language mixed large language Model"},
    {id:'2602.23324v2',cat:'q-bio.QM',title:"Discrete turn strategies emerge in information-limited navigation"},
    {id:'2511.01939v3',cat:'q-bio.PE',title:'Epidemic "momentum" and a conservation law for infectious disease dynamics'},
  ],
  [
    {id:'2605.21003v2',cat:'physics.chem-ph',title:"Thermodynamic and structural behavior of one-dimensional divalent patchy hard rods: Wertheim's first-order perturbation theory"},
    {id:'2605.26458v2',cat:'cond-mat.soft',title:"Directional Symmetry Breaking of Spherical Active Colloids by Magnetoviscous Coupling"},
    {id:'2605.25996v2',cat:'cond-mat.soft',title:"Topology of pulsating active matter: Defect asymmetry controls emergent motility"},
    {id:'2606.29751v1',cat:'cond-mat.stat-mech',title:"Finite-resolution exhaustive traversal of thermodynamic state spaces has divergent thermodynamic length"},
    {id:'2606.29235v2',cat:'cond-mat.stat-mech',title:"Imaginary pseudo entropy encodes temporal orientation"},
  ],
  [
    {id:'2606.29311v1',cat:'cond-mat.stat-mech',title:"Pseudo entropy and topological phases of matter"},
    {id:'2606.29042v2',cat:'cond-mat.stat-mech',title:"Exact Hilbert-space ergodicity from continuous monitoring"},
    {id:'2603.29593v1',cat:'physics.soc-ph',title:"Be Water: An Evolutionary Proof for Trend-Following"},
    {id:'2603.28949v2',cat:'physics.soc-ph',title:"The Planetary Cost of AI Acceleration: A Thermodynamic Outlook on Four Possible Paths Forward"},
    {id:'2603.29282v1',cat:'physics.soc-ph',title:"Social Amplification Dominates Collective Hazard Response"},
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
- buildable: how buildable TONIGHT as a single self-contained HTML file (canvas/svg/d3/three.js via CDN, no backend, no build step) -- demos should score highest here if they only need client-side math/sim

Ground every idea in the paper's actual claimed result, not just its title vibe. Return via the schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) => () =>
  agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
