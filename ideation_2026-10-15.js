export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-15',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2609.19905v1",cat:"math.PR",title:"Percolation Markov Decision Processes",summary:"A decision maker repeatedly moves a token through a d-dimensional integer lattice with deterministic moves but random payoffs fixed on edges before the process starts, trying to maximize accumulated payoff over a fixed horizon -- a clean lattice-walk gambling model with pre-revealed randomness."},
    {id:"2609.19792v1",cat:"math.PR",title:"Whittle index approach to multi-server scheduling with convex delay costs and impatient customers",summary:"Uses the Whittle index (the classic 'which bandit arm to pull' heuristic) to schedule a multi-class queue where customers get impatient and abandon, with convex delay costs -- a principled priority rule for who gets served first when everyone's getting antsy."},
    {id:"2608.18772v1",cat:"cs.DS",title:"Decisive Margins in Differentially Private Voting",summary:"Measures exactly how much noise differential privacy can inject into published election results (Plurality, Condorcet, STV, etc.) before a close election's winner becomes unreliable -- quantifying the privacy/accuracy tradeoff for voting systems."},
    {id:"2609.27113v2",cat:"math.OC",title:"Active Portfolio Management in Concentrated Equity Markets",summary:"Uses stochastic portfolio theory to explain WHY the boring equal-weighted portfolio beats cap-weighted benchmarks in some regimes and loses in others, tied to market concentration -- a rigorous answer to 'should I just buy the equal-weight index.'"},
    {id:"2303.11959v2",cat:"q-fin.TR",title:"Optimizing Trading Strategies in Quantitative Markets using Multi-Agent Reinforcement Learning",summary:"Trains RL trading agents against each other in a simulated quantitative market to find profit-driven strategies -- a multi-agent arena where the 'market' itself emerges from the agents' competition."},
  ],
  [
    {id:"2303.07393v4",cat:"q-fin.TR",title:"Many learning agents interacting with an agent-based market model",summary:"Builds a 3-trophic-level market ecosystem -- optimal-execution RL agents, dumb liquidity takers, and fast electronic market makers -- and watches what equilibrium strategies emerge when they all learn simultaneously, like a food web for order flow."},
    {id:"2303.10043v1",cat:"q-fin.TR",title:"Optimal liquidation with temporary and permanent price impact, an application to cryptocurrencies",summary:"Solves for the optimal way to sell off a large crypto position (BNB specifically) given that selling moves the price both temporarily and permanently, fit directly to real order-book data."},
    {id:"2303.08867v4",cat:"q-fin.TR",title:"A Bayesian theory of market impact",summary:"Models how a big institutional trader's order-splitting strategy ('meta-orders') moves prices, using Bayesian updating about the trader's true size/intent as the mechanism behind the classic square-root impact law."},
    {id:"2305.14604v2",cat:"q-fin.PM",title:"Automated Market Making and Arbitrage Profits in the Presence of Fees",summary:"Extends the famous Milionis et al. AMM-arbitrage model to include trading fees and discrete block times, pinning down exactly how much arbitrageurs bleed out of liquidity providers on a DEX as a function of the fee knob."},
    {id:"2604.27188v1",cat:"physics.soc-ph",title:"Nothing Deceives Like Success: Social Learning and the Illusion of Understanding in Science",summary:"Asks whether scientists copying whichever methods look 'successful' actually converges on truth or just on the appearance of it -- a model of how an entire field can confidently believe something that's wrong because success is a bad enough proxy for correctness."},
  ],
  [
    {id:"2604.26726v2",cat:"physics.soc-ph",title:"Swap distance minimization shapes the order of subject, object and verb in languages of the world",summary:"Argues that the two dominant word orders across world languages (SOV, SVO) exist because they minimize a 'swap distance' metric between word orders -- a single optimization principle behind why most languages pick one of two options and not the other four."},
    {id:"2604.27226v1",cat:"physics.soc-ph",title:"Ratio-Dependent Contrarian Activation in Opinion Dynamics",summary:"In the classic majority-vote opinion model, lets contrarians flip based on the local majority/minority ratio rather than a fixed probability, and derives exact phase transitions for group-of-3 discussions -- a tunable 'devil's advocate' dial for crowd opinion simulations."},
    {id:"2510.22220v1",cat:"q-bio.PE",title:"Evolution of the lexicon: a probabilistic point of view",summary:"Models how languages replace words over time as a stochastic process, used to date when two languages split -- revisits the Swadesh method with cleaner probabilistic assumptions about word death and replacement."},
    {id:"2510.20500v1",cat:"q-bio.PE",title:"Fitness inference tested by in silico population genetics",summary:"Asks, in simulated evolving populations, whether you can actually recover each genotype's fitness and fitness ranking just from genome sequencing data -- and maps out exactly when that inference problem is solvable vs. hopeless."},
    {id:"2510.19843v1",cat:"q-bio.PE",title:"Memory Effects in Disease Modelling Through Kernel Estimates with Oscillatory Time History",summary:"Builds an SIR/SEIR epidemic model where the infectious period has 'memory' -- an oscillating time-delay kernel instead of the usual memoryless exponential -- showing standard epidemic models miss real history-dependent effects."},
  ],
  [
    {id:"2603.08409v2",cat:"q-bio.NC",title:"Embodied intelligence solves the centipede's dilemma",summary:"A full-body dynamical model of centipede locomotion (leg-ground contact + passive body mechanics + active muscle control) settles whether the undulating body wave seen in multi-legged walkers is actively driven by muscle or just a passive mechanical echo of the legs."},
    {id:"2603.07217v1",cat:"q-bio.NC",title:"A Miniature Brain Transformer: Thalamic Gating, Hippocampal Lateralization, Amygdaloid Salience, and Prefrontal Working Memory in Attention-Coupled Latent Memory",summary:"Bolts brain-region-inspired modules (thalamic relay, amygdala salience, prefrontal working memory, lateralized hippocampal banks) onto a transformer's latent memory and tests whether the neuroscience-flavored wiring actually helps on benchmarks."},
    {id:"2609.32688v1",cat:"math.CO",title:"The diameter of recoloring graphs under a maximum average degree bound",summary:"Studies the 'recoloring graph' where two colorings of a graph are adjacent if they differ at exactly one vertex -- bounding how many single-vertex recolors it takes to get from any proper coloring to any other, a puzzle about how connected the space of valid colorings is."},
    {id:"2609.32738v1",cat:"math.CO",title:"Network Topology That Excludes Braess's Paradox and Maintains Monotonicity in Flows Over Time",title2:"", summary:"Characterizes exactly which road-network shapes can NEVER exhibit Braess's Paradox (adding a road makes everyone's commute worse) under realistic time-varying flow with queueing -- settles two open conjectures about when 'more capacity' is provably never bad."},
    {id:"2608.18875v1",cat:"cs.DS",title:"Computing All Optimal Partial $p$-Wasserstein Matchings on the Line",summary:"For points on a number line, finds every possible optimal partial matching (you don't have to match everyone, just the cheapest subset) under Wasserstein-style transport cost -- a cleaner algorithmic picture of 'who should pair with whom, and who sits out.'"},
  ],
  [
    {id:"2608.19050v1",cat:"cs.DS",title:"Online Permutation Embedding: Optimal Stopping and Scaling Laws",summary:"Generalizes the classic 'spot the increasing subsequence as numbers stream by' optimal-stopping problem to ANY target permutation pattern, giving an exact dynamic program and scaling laws for how good you can possibly do -- secretary-problem math on steroids."},
    {id:"2608.18612v1",cat:"cs.DS",title:"An FPRAS for Antiferromagnetic Ising Models on Random Regular Bipartite Graphs",summary:"Gives a provably fast randomized algorithm to approximate the partition function of antiferromagnetic Ising models (competing-neighbor magnet physics) on random bipartite graphs, pushing past the previous 'uniqueness threshold' where sampling was known to be easy."},
    {id:"2609.32651v1",cat:"math.CO",title:"Semifields in prime dimensions and counterexamples to Kaplansky's conjecture",summary:"Disproves a 50-year-old conjecture of Kaplansky about 5-dimensional division algebras by explicitly constructing counterexample semifields for a whole infinite family of dimensions -- a clean 'the famous guess was wrong, here's the receipt' result."},
    {id:"2609.15329v1",cat:"math.NT",title:"Optimising Selberg's method for critical zeros",summary:"Revives a little-known 1974 Russian result and modernizes it to push up the proven fraction of Riemann zeta zeros that provably sit on the critical line -- incremental but real progress adjacent to the Riemann Hypothesis."},
    {id:"2609.15166v1",cat:"math.NT",title:"On the largest prime factors less than $y$ of consecutive shifted primes",summary:"Chases an Erdős-Turán-style conjecture about whether a prime's largest-factor-of-neighbor relationship is a coin flip -- the kind of 'obviously 50/50, fiendishly hard to prove' number theory claim."},
  ],
  [
    {id:"2610.15415v1",cat:"cs.AI",title:"Sensitivity or Criterion? Measuring and Moving When Language Models Act",summary:"Uses signal-detection theory to split 'can the model tell when action is warranted' from 'is the model just trigger-happy or trigger-shy' -- a diagnostic for whether an AI agent's bad call is a knowledge gap or a nerve problem."},
    {id:"2609.32390v1",cat:"cs.CR",title:"Reward Hacking and Agent Containment Failure: A Monte Carlo Study Based on the 2026 Hugging Face Incident",summary:"Builds a 5-stage probabilistic risk model (reward hacking -> containment escape -> usable access -> persistence -> detection failure) and runs 100,000 Monte Carlo trials to quantify how likely a capable misaligned agent is to turn into a real breach, calibrated to an actual 2026 incident."},
    {id:"2604.26858v2",cat:"physics.soc-ph",title:"A well-motivated model of pedestrian dynamics",summary:"Replaces the usual fixed 'desired walking speed' in crowd simulations with a psychology-grounded motivation model (expectancy-value theory) that fluctuates with crowd conditions -- pedestrians that get impatient or discouraged like real people, not robots on rails."},
    {id:"2609.19769v1",cat:"math.PR",title:"Convergence of Densities for the Euler-Maruyama Approximation of Brownian-Driven McKean-Vlasov Equations",summary:"Proves the standard numerical scheme for simulating 'mean-field' stochastic systems (where each particle's dynamics depend on the whole population's distribution) converges in a strong, density-level sense, not just in expectation -- tightens the theoretical floor under a lot of crowd/swarm/finance simulations."},
    {id:"2602.19290v1",cat:"econ.EM",title:"Distributional Discontinuity Design",summary:"Extends the regression-discontinuity design (comparing just-above vs just-below a policy cutoff) from comparing means to comparing entire outcome distributions via Wasserstein distance -- catches policy effects that only change the spread or shape, not the average."},
  ],
]

const IDEA_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper_id: { type: 'string' },
          pitch: { type: 'string' },
          cool_score: { type: 'number' },
          buildable_score: { type: 'number' },
          discussion_score: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score', 'discussion_score', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

phase('Ideate')
const results = await pipeline(
  BATCHES,
  (batch, _item, idx) => agent(
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: games, decision-theory, betting, math, gambling tags have mild positive community reception recently (soft bias, don't force it); no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
