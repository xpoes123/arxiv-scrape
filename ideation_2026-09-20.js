export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-20',
  description: 'Ideate project/startup/youtube/demo ideas from ~30 fresh arXiv papers in batches of ~5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.13703',title:"Gap Entropy and Almost Instance-Wise Optimal Best-Arm Identification"},
    {id:'2609.07808',title:"You Can't Prefer Emotions You Don't Sample: Intensity Undershoot in DPO-Tuned LLMs"},
    {id:'2608.25670',title:"An Analysis of the Impact of Psychological Factors and Techniques Across Different Types of Social Engineering"},
    {id:'2608.30604',title:"A Full-Sequence Quantitative Gap Between the Chromatic and Cochromatic Numbers of a Random Graph"},
    {id:'2608.18785',title:"Mitigating Regional Traffic Congestion via School Start Time Scheduling: A Bilevel Alternating Optimization Approach"},
  ],
  [
    {id:'2608.18708',title:"Modeling Network Congestion under Demand Uncertainty Using Wardrop Principles"},
    {id:'2608.18676',title:"Long-run risk-sensitive portfolio optimisation with proportional transaction costs and log Lévy asset prices"},
    {id:'2608.20337',title:"Information on trajectories: martingales and random times"},
    {id:'2307.07811',title:"Generative Meta-Learning Robust Quality-Diversity Portfolio"},
    {id:'2306.02148',title:"The Role of Twitter in Cryptocurrency Pump-and-Dumps"},
  ],
  [
    {id:'2602.12490',title:"Transformer-based CoVaR: Systemic Risk in Textual Information"},
    {id:'2602.10925',title:"Fact or friction: Jumps at ultra high frequency"},
    {id:'2607.29375',title:"The Greedy Advantage in Finite-Horizon Bandits"},
    {id:'2602.14843',title:"Evolutionarily Primitive Social Entities"},
    {id:'2602.13368',title:"The Influence of Width Ratios on Structural Beauty in Male Faces"},
  ],
  [
    {id:'2602.12811',title:"Left-right asymmetry in predicting brain activity from LLMs' representations emerges with their formal linguistic competence"},
    {id:'2603.03337',title:"Does the motor cortex draw on a wire plane?"},
    {id:'2504.15288',title:"Magnetic Field-dependent Isotope Effect Supports Radical Pair Mechanism in Tubulin Polymerization"},
    {id:'2603.06694',title:"A Modelling Assessment of the Impact of Control Measures on Simulated Foot-and-Mouth Disease Spread in Mato Grosso do Sul, Brazil"},
    {id:'2603.03604',title:"Tracking Feral Horses in Aerial Video Using Oriented Bounding Boxes"},
  ],
  [
    {id:'2603.03603',title:"Detection and Identification of Penguins Using Appearance and Motion Features"},
    {id:'2510.23297',title:"Drivers of Variation in the Optimal Spatial Structure of Collective Information Gatherers"},
    {id:'2510.22220',title:"Evolution of the lexicon: a probabilistic point of view"},
    {id:'2606.20070',title:"E. coli bacterium near corrugated surfaces: near-surface swimming, escape, and hydrodynamic trapping"},
    {id:'2606.19844',title:"Epithelia Realize Nematopolar Topological Defect Structures"},
  ],
  [
    {id:'2607.28172',title:"From Exponential to Gaussian Tails: Fractal Wavefront Scaling and the κ-Weibull Distribution at Phase Transitions"},
    {id:'2607.27998',title:"Mpemba effect in a chemomechanical model of the Kinesin molecular motor"},
    {id:'2604.13774',title:"Projections of Earth's Technosphere: Civilization Collapse-Recovery Dynamics and Detectability"},
    {id:'2604.13184',title:"Simon's model does not produce Zipf's law: The fundamental rich-get-richer mechanism for any power-law size ranking"},
    {id:'2604.12546',title:"Predicting success of cooperators across arbitrary heterogeneous environmental landscapes"},
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
