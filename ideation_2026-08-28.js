export const meta = {
  name: 'arxiv-nightly-ideation-2026-08-28',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, scored on cool/buildable/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2602.05592v1',cat:'econ.EM',title:"An invariant modification of the bilinear form test"},
    {id:'2410.01795v2',cat:'q-bio.GN',title:"Knowledge-Driven Feature Selection and Engineering for Genotype Data with Large Language Models"},
    {id:'2608.17153v1',cat:'cs.CL',title:"Towards Safer RAG: Only Agents Capable of System 2 Thinking may Access Untrusted Documents"},
    {id:'2607.12579v2',cat:'stat.ML',title:"Wasserstein gradient flows for Coulomb discrepancies"},
    {id:'2607.11769v1',cat:'math.NT',title:"Adjoint Bloch--Kato Selmer groups of regular algebraic automorphic Galois representations"},
  ],
  [
    {id:'2310.09578v1',cat:'q-fin.PM',title:"Sparse Index Tracking via Topological Learning"},
    {id:'2607.23107v1',cat:'math.OC',title:"Optimization of Kinetic--Stoichiometric Growth Bounds over Autocatalytic Subnetworks"},
    {id:'2511.00138v1',cat:'q-bio.PE',title:"Incentives for self-isolation based on incidence rather than prevalence could help to flatten the curve: a modelling study"},
    {id:'2607.20919v1',cat:'math.PR',title:"Random unitary circuits with constant spectral gap"},
    {id:'2602.12547v1',cat:'q-bio.NC',title:"A consequence of failed sequential learning: A computational account of developmental amnesia"},
  ],
  [
    {id:'2505.00600v2',cat:'q-bio.BM',title:"Frustration, dynamics and catalysis"},
    {id:'2608.02821v1',cat:'cs.CR',title:"What the Detector Can See: Evaluating CPS Anomaly Detectors Independently of the Decision Rule"},
    {id:'2604.18596v2',cat:'physics.soc-ph',title:"Large language models converge on competitive rationality but diverge on cooperation across providers and generations"},
    {id:'2608.06348v1',cat:'math.CO',title:"Width Laws and Spectral Geometry"},
    {id:'2608.21555v1',cat:'cs.LG',title:"Tensor Seeks Layout: Formalizing Layout Selection for ML Compilers"},
  ],
  [
    {id:'2605.31203v2',cat:'physics.chem-ph',title:"Rigorous extension of semilocal collinear functionals to noncollinear DFT using $SU(2)$ rotations"},
    {id:'2603.02753v1',cat:'q-bio.QM',title:"Deep learning-guided evolutionary optimization for protein design"},
    {id:'2606.23614v1',cat:'cs.DS',title:"Log-concavity and tunneling: adiabatic quantum optimization for convex functions (with a spike)"},
    {id:'2309.00630v1',cat:'q-fin.TR',title:"Commodities Trading through Deep Policy Gradient Methods"},
    {id:'2607.07325v1',cat:'cond-mat.stat-mech',title:"Taming nonlinear energy diffusion: The case of time-crystal energy condensates"},
  ],
  [
    {id:'2608.22417v1',cat:'cs.AI',title:"LLMs for Survey Text Analysis - A Performance Comparison Between Humans and GPT-5 on Inductive Content Analysis"},
    {id:'2605.31542v1',cat:'cond-mat.soft',title:"Recovering the Shape of a Contact Line"},
    {id:'2602.04230v1',cat:'econ.EM',title:"Validating Causal Message Passing Against Network-Aware Methods on Real Experiments"},
    {id:'2410.04996v5',cat:'q-bio.GN',title:"Assumption-Lean Post-Integrated Inference with Surrogate Control Outcomes"},
    {id:'2608.17102v1',cat:'cs.CL',title:"Emotion Across Speech and Faces: Shared Affective Mechanisms in Multimodal Foundation Models"},
  ],
  [
    {id:'2608.13590v1',cat:'stat.ML',title:"Robust XGBoosting for Regression"},
    {id:'2607.11568v1',cat:'math.NT',title:"Submultiplicative Polynomials in Combinatorics"},
    {id:'2310.10760v1',cat:'q-fin.PM',title:"Towards reducing hallucination in extracting information from financial reports using Large Language Models"},
    {id:'2607.22981v2',cat:'math.OC',title:"Exact Reachability by Positive Vertex-Centroid Moves"},
    {id:'2511.01920v1',cat:'q-bio.PE',title:"Stochastic Models and Estimation of Undetected Infections in the Transmission of Zika Virus"},
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
