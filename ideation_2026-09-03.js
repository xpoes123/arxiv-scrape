export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-03',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2608.27808v1',cat:'cs.LG',title:"CURA: Certified Runtime Alarms for Computer-Use Agents"},
    {id:'2608.29168v1',cat:'cs.AI',title:"JudgePanel: A Compact Judge with Panel Deliberation via Adaptive Multi-Reward Reinforcement Learning"},
    {id:'2608.29162v1',cat:'cs.AI',title:"Subtraction-Based Tumor Segmentation and Lesion-Centered pCR Prediction for the MAMA-MIA Challenge"},
    {id:'2608.26035v1',cat:'cs.CL',title:"Beyond Local Surprise: Grounded Dialogue as Selective Belief Revision under Referential Uncertainty"},
    {id:'2608.26013v2',cat:'cs.CL',title:"VISA: Agentic Self-Evolving Data Synthesis for Multimodal Instruction Following"},
  ],
  [
    {id:'2608.09075v2',cat:'cs.CR',title:"SLAC: Access-Driven CPU-to-GPU Side-channel Attacks via System-Level Cache on Apple Silicon"},
    {id:'2608.09069v2',cat:'cs.CR',title:"Telemetry and Concealment in Self-Adapting Generative AI: Logging Architecture, Adversarial Model Hiding, and the Limits of Detection"},
    {id:'2606.29186v1',cat:'cs.DS',title:"Computing Lewis weights to high precision using local relative smoothness"},
    {id:'2606.29152v1',cat:'cs.DS',title:"A Gossiping Protocol for Sparse Ad-Hoc Radio Networks"},
    {id:'2608.12237v2',cat:'math.CO',title:"On the Turán Density of $C_{10}$ in the Hypercube"},
  ],
  [
    {id:'2608.12207v1',cat:'math.CO',title:"The Hajnal-Szemerédi theorem in digraphs revisited"},
    {id:'2607.29024v1',cat:'math.OC',title:"A Policy Iteration Scheme for Semilinear Stochastic Hamilton-Jacobi-Bellman Equations with Exponential Convergence"},
    {id:'2607.29004v1',cat:'math.OC',title:"Global and local error bounds: characterizations via directional derivatives and tangent cones"},
    {id:'2608.00081v1',cat:'math.PR',title:"Value distributions for read-once polynomials on finite fields"},
    {id:'2607.27050v1',cat:'math.PR',title:"Second-Order Multi-Set Allocation Occupancy (MAO) Distributions under Pairwise-Intersection Constraints: Exact Laws, MAO Norms, Inequalities, and Limit Theory"},
  ],
  [
    {id:'2607.20571v1',cat:'math.NT',title:"A problem on sumset sizes of sets of lattice points"},
    {id:'2607.19525v1',cat:'math.NT',title:"Additive and multiplicative densities, prime valuations and symbolic models"},
    {id:'2310.01319v1',cat:'q-fin.PM',title:"CAD: Clustering And Deep Reinforcement Learning Based Multi-Period Portfolio Management Strategy"},
    {id:'2310.00747v2',cat:'q-fin.PM',title:"NoxTrader: LSTM-Based Stock Return Momentum Prediction for Quantitative Trading"},
    {id:'2309.00626v1',cat:'q-fin.TR',title:"An Ensemble Method of Deep Reinforcement Learning for Automated Cryptocurrency Trading"},
  ],
  [
    {id:'2602.06435v2',cat:'econ.EM',title:"Social Interactions Models with Latent Structures"},
    {id:'2607.16717v1',cat:'stat.ML',title:"A Causal Markov Condition for Value"},
    {id:'2602.16626v1',cat:'q-bio.NC',title:"A Systematic Evaluation of Sample-Level Tokenization Strategies for MEG Foundation Models"},
    {id:'2504.19538v1',cat:'q-bio.BM',title:"Towards Faster and More Compact Foundation Models for Molecular Property Prediction"},
    {id:'2409.15678v1',cat:'q-bio.GN',title:"Objectively Evaluating the Reliability of Cell Type Annotation Using LLM-Based Strategies"},
  ],
  [
    {id:'2603.03603v1',cat:'q-bio.QM',title:"Detection and Identification of Penguins Using Appearance and Motion Features"},
    {id:'2510.27030v4',cat:'q-bio.PE',title:"Generalizing matrix representations to fully heterochronous ranked tree shapes"},
    {id:'2606.05050v2',cat:'physics.chem-ph',title:"Autonomous heterogeneous catalyst discovery with a self-evolving multi-agent digital twin"},
    {id:'2606.07438v1',cat:'cond-mat.soft',title:"Flow of deformable droplets: self-pinned glasses and string-like flow"},
    {id:'2607.13833v2',cat:'cond-mat.stat-mech',title:"Cooling rate and glassy behavior in the Fermi--Pasta--Ulam system"},
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
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server — blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
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
