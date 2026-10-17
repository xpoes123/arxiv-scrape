export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-16',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2510.18889v1",cat:"q-bio.PE",title:"Prejudice driven spite: A discontinuous phase transition in ultimatum game",summary:"Mixes prejudiced and unprejudiced agents in the classic ultimatum game (split-the-pot, reject-if-unfair) and finds that cranking up prejudice doesn't smoothly increase unfairness -- it snaps abruptly past a threshold into a spiteful, low-offer society, a sharp phase transition rather than a gradual slide."},
    {id:"2510.17016v1",cat:"q-bio.PE",title:"Ambush strategy impacts species predominance and coexistence in rock-paper-scissors models",summary:"In a spatial rock-paper-scissors ecosystem, lets one species 'scout' local density before deciding to ambush-attack or lie in wait -- a cognitive upgrade to the classic cyclic-dominance game that can flip who wins the three-way standoff and whether all three species survive at all."},
    {id:"2609.21359v1",cat:"math.PR",title:"Limit shape, avalanches, and stabilisation of abelian sandpiles on comb lattices",summary:"Drops grains of sand one at a time onto a comb-shaped lattice and proves exactly what shape the pile settles into and how big the resulting avalanches are -- a rigorous answer to 'how does a cascading collapse scale' on a lattice shaped like teeth on a comb."},
    {id:"2609.27206v1",cat:"stat.ML",title:"Prediction with Expert Advice: Anytime Regret with Many Experts Matches the Fixed-Time Constant",summary:"The classic 'listen to the best-performing tipster' algorithm (weighted-majority / multiplicative weights) usually needs to know the game length in advance to get the best regret bound -- this shows you can get the same optimal bound without knowing when the game ends, even with a huge pool of experts."},
    {id:"2609.21684v1",cat:"math.PR",title:"Equilibrium prices under hidden Markov fundamentals",summary:"Builds an asset-pricing model where the true economic 'regime' driving dividends is a hidden Markov chain nobody can directly observe, and solves for what the equilibrium price-to-dividend ratio must look like once the market is doing its best Bayesian filtering on the hidden state."},
  ],
  [
    {id:"2609.27878v1",cat:"cs.DS",title:"The Exact Approximation Ratio of the Optimal Fixed-Price Mechanism in Bilateral Trade",summary:"Pins down, to 10 decimal places (0.7380243357...), exactly how much total value a single take-it-or-leave-it posted price sacrifices versus a perfect all-knowing broker when matching one buyer and one seller -- the precise 'price of simplicity' for a one-shot haggle."},
    {id:"2604.28168v3",cat:"physics.soc-ph",title:"Phase Transitions in Economic Inequality: Taxation and Extremal Replacement Dynamics",summary:"A toy economy where the poorest agent's wealth keeps getting randomly reset, funded by taxing everyone else -- sweeping the tax's progressivity reveals a sharp phase transition between a fair, mixed society and a frozen oligarchy, with no smooth in-between."},
    {id:"2604.28021v1",cat:"physics.soc-ph",title:"Universal statistical laws governing culinary design",summary:"Treats a huge corpus of traditional recipes like a language and finds the same Zipf-style statistical laws that govern word frequencies in human languages also govern ingredient and technique frequencies in cooking -- cuisines as dialects of one universal grammar."},
    {id:"2604.27961v2",cat:"physics.soc-ph",title:"Clustering in co-evolving opinion dynamics: reduced SPDE models",summary:"When who-you-talk-to and what-you-believe evolve together (friendships form/break based on agreement), derives a simplified stochastic-PDE description of exactly how and when the population splits into echo-chamber clusters -- a continuous, tractable theory for 'how a crowd polarizes.'"},
    {id:"2605.00758v1",cat:"physics.soc-ph",title:"Optimal network structure for collective performance with strategic information sharing",summary:"Models a group where sharing information helps everyone but also helps your rivals, so agents evolve strategic (sometimes selfish) sharing behavior -- finds which network shapes let a group perform best once you account for the fact that nobody wants to tip off the competition."},
  ],
  [
    {id:"2609.28263v1",cat:"math.OC",title:"Resource-Adaptive Stochastic Gradient Descent for Online Linear Programming without Re-solving",summary:"For a seller watching requests arrive one-by-one with a fixed inventory (think: selling seats, slots, or ad impressions in real time), gives a dead-simple price-update rule that only needs the current request and remaining stock -- no expensive re-optimizing the whole plan every time a sale comes in."},
    {id:"2609.35896v1",cat:"math.CO",title:"Minimal Resolving Sets in Rectangular Grid Graphs: A Complete Characterization and Enumeration",summary:"On a city-block grid, finds every minimal set of 'landmark' points such that knowing your taxicab distance to each landmark uniquely pins down your location -- a complete, counted catalog of the smallest possible 'guess where I am' landmark sets for any grid size."},
    {id:"2608.20077v1",cat:"cs.DS",title:"Parameterized Complexity of Temporal Agony",summary:"Given a network of interactions that changes over time, studies how hard it is to assign everyone a rank (1 to k) so that almost all interactions flow from lower to higher rank -- a hierarchy-discovery problem whose difficulty is pinned down exactly as a function of how many ranks and how much disagreement you allow."},
    {id:"2609.21476v1",cat:"math.PR",title:"A short proof of the Bernoulli decomposition theorem",summary:"Gives a slick, short new proof that any sufficiently random process can be split into a genuinely fair, independent coin-flip sequence plus 'leftover' randomness -- a cleaner path to the classic result that true randomness can always be carved out of noisy randomness."},
    {id:"2603.16741v1",cat:"q-bio.QM",title:"Bayesian Inference of Psychometric Variables From Brain and Behavior in Implicit Association Tests",summary:"Replaces the standard reaction-time-only scoring of the Implicit Association Test (the famous 'how biased are you, really' test) with a Bayesian model that also uses brain signals -- substantially sharper at predicting the underlying psychometric trait than the old reaction-time-only score."},
  ],
  [
    {id:"2607.11650v2",cat:"cond-mat.soft",title:"How do 3M Command strips work? A fracture mechanics approach",summary:"Works out the actual physics of why a Command strip holds a heavy picture frame for years yet peels off cleanly with zero damage when you pull it a specific way -- a stretchy adhesive layer that progressively debonds under controlled fracture, explained with real equations."},
    {id:"2607.12158v2",cat:"cond-mat.soft",title:"Oscillatory Active Brownian Motion: A Minimal Model for Sperm Dynamics",summary:"Adds a built-in wiggle (periodic oscillation) to the standard random-walk model of self-propelled particles, matching how real sperm cells swim with a beating-tail rhythm layered on top of their random drift -- a minimal model that actually looks like swimming instead of just drunk-walking."},
    {id:"2609.00144v1",cat:"cond-mat.stat-mech",title:"Bayesian Tracking of a Diffusing Target in Two and Three Dimensions",summary:"Models the classic 'submarine hunt' problem -- a target randomly drifting around while a network of noisy sensors tries to triangulate it -- and maps out, in 2D and 3D, exactly how good the best-possible Bayesian tracker can ever be versus a sloppier one, via a surprising link to surface-growth physics."},
    {id:"2608.31130v1",cat:"cond-mat.stat-mech",title:"Colorful Exponential Random Graph Models",summary:"Extends the standard 'random network with a few knobs' model (ERGM) to networks with several different-colored types of connections at once, and derives exactly what large-scale structure the network settles into for any setting of those knobs."},
    {id:"2602.19384v1",cat:"econ.EM",title:"How Robust are Robustness Checks?",summary:"Points out that economists run 'robustness checks' on their headline result all the time but never formally measure how different those robustness-check specifications actually are from the main one -- proposes a single 'robustness radius' number to quantify exactly how much wiggle room a robustness check really tests."},
  ],
  [
    {id:"2609.27241v1",cat:"stat.ML",title:"On the Sample Complexity of Active Learning with Membership Queries",summary:"Asks: if you can ask ANY yes/no question (not just pick from a fixed pool), how much easier does learning get? Finds that for some concept classes, this 'ask anything' power (think: 20 Questions where you can invent any question) collapses the number of queries needed from huge to tiny -- a formal gap between pool-based and fully synthetic active learning."},
    {id:"2603.09384v1",cat:"q-bio.NC",title:"Dreaming improves memorization in a Hopfield model with bounded synaptic strength",summary:"In a classic associative-memory neural network with a realistic cap on how strong any single connection can get, shows that adding a 'dreaming' phase -- replaying and consolidating patterns offline -- lets it store dramatically more memories before it catastrophically forgets everything, a mechanistic case for why brains sleep."},
    {id:"2503.14956v1",cat:"q-bio.BM",title:"Machine learning predictions from unpredictable chaos",summary:"Takes famously unpredictable chaotic systems (sensitive to initial conditions, no periodicity) and shows a new topological feature-extraction method lets ML models still extract real predictive signal out of them -- 'unpredictable' turns out to have exploitable structure if you look at the right shape of the data."},
    {id:"2610.17205v1",cat:"cs.AI",title:"Releasing the Inner Jev: A Simple Recipe for Open Decision Models",summary:"Shows that regular open instruction-tuned LLMs, given a typed situation + a question + a list of options, can match the buzzy proprietary 'Jev' decision-model approach (return a probability for each option in one forward pass, no chit-chat) with a simple recipe -- a free, open recipe for a model that just makes the call."},
    {id:"2609.33831v1",cat:"cs.CR",title:"The Cost of Stability: Deanonymizing Onion Services Long-Lived Introduction Circuits",summary:"Shows that Tor hidden services which keep the same 'introduction circuit' open for a long time (for stability/performance) leak enough timing structure for a single well-placed relay to actually identify the other relays in the circuit -- stability and anonymity trade directly against each other."},
  ],
  [
    {id:"2607.10761v1",cat:"physics.chem-ph",title:"A Three-Degree-of-Freedom Chesnavich Model for Roaming: Derivation, Phase-Space Geometry, NHIM-Anchored Dividing Surfaces, and Roaming Transport",summary:"Studies 'roaming' chemical reactions, where a breaking molecule doesn't follow the obvious energy-minimizing path but instead wanders a flat plateau of the energy landscape before suddenly reacting -- maps out exactly which wandering trajectories lead to reaction via the geometry of unstable orbits, like a chemistry version of 'how long can you stall before you have to commit.'"},
    {id:"2607.12674v1",cat:"cond-mat.soft",title:"How Quasicrystals Remember: Hierarchical Memory Under Cyclic Shear",summary:"Repeatedly shears a 2D quasicrystal (an exotic non-repeating-but-ordered structure) back and forth and finds it encodes a layered, hierarchical memory of its shear history in its defect structure -- a weird middle-ground material that's neither a crystal nor a glass remembering like neither."},
    {id:"2603.20246v1",cat:"q-bio.NC",title:"Decoding the decoder: Contextual sequence-to-sequence modeling for intracortical speech decoding",summary:"For brain-computer-interface speech decoding (translating brain signals straight into words for paralyzed patients), tests whether decoding whole sequences with context -- instead of one phoneme-frame at a time -- actually helps, pulling apart exactly what the extra context is buying you."},
    {id:"2609.33903v1",cat:"cs.CR",title:"Can Prompt Anonymity Protect Your Identity From LLM Providers?",summary:"Tests whether stripping identifying info from your prompts before sending them to an LLM provider actually protects you -- finds the provider can often re-identify or profile you anyway from writing style and content, poking a hole in the 'anonymizing proxy' privacy pitch."},
    {id:"2605.00108v1",cat:"physics.soc-ph",title:"Urban Science Beyond Samples: Up-to-Date Street Network Models and Indicators for Every Urban Area in the World",summary:"Builds current, consistent street-network maps and walkability/resilience indicators for literally every urban area on Earth using 2025 satellite-derived boundaries -- no more studying cities only where someone happened to already have clean data."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, decision-theory, math, games tags have mild positive community reception recently (net +2 each), gambling mild positive (+1) -- soft bias, don't force it; no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
