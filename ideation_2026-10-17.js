export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-17',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2609.33597v1",cat:"cs.CR",title:"The Price of Peeking: Anytime-Valid Leakage Detection on ML-KEM EM Traces",summary:"Side-channel testers usually peek at live data and stop early, which secretly inflates false-alarm rates on fixed-horizon tests -- this builds a \"testing by betting\" detector (an e-process) that lets you watch a stream of leakage traces and legitimately stop or keep extending the moment you're confident, with provable error control the whole time."},
    {id:"2608.20018v2",cat:"cs.DS",title:"The Greedy Superstring Algorithm Achieves Ratio 2 for Strings of Length 6 Already",summary:"The decades-old \"greedy superstring conjecture\" says the simplest merge-the-most-overlapping-pair algorithm for stitching strings together never does worse than 2x optimal -- this proves the bound is already tight at the smallest interesting case, strings of length 6."},
    {id:"2608.19952v1",cat:"cs.DS",title:"New Complexity Results for Fair Repetitive Scheduling",summary:"Given clients who each submit one job per day over many days, this pins down exactly how hard it is to build a rotating daily schedule that's provably fair to everyone over the long run, not just efficient on any single day -- the complexity of a recurring \"whose turn is it\" problem."},
    {id:"2609.35896v1",cat:"math.CO",title:"Minimal Resolving Sets in Rectangular Grid Graphs: A Complete Characterization and Enumeration",summary:"A \"resolving set\" is the smallest group of beacon vertices on an m x n grid whose distances to everyone else uniquely pin down every other point's location -- this completely characterizes and counts every minimal beacon placement, solving optimal landmark/sensor placement on a grid exactly."},
    {id:"2610.17203v1",cat:"cs.LG",title:"Online LLM Personalization from Pairwise Preferences Across Users",summary:"Instead of learning one global \"best\" chatbot persona, this treats picking a response style for each new user as an online bandit problem: show two candidate personas, watch which one the user clicks, and adapt, since everyone's hidden taste differs and users arrive sequentially."},
  ],
  [
    {id:"2610.17192v1",cat:"cs.AI",title:"Size Generalization for Diffusion Routing Solvers",summary:"Diffusion models can learn to spit out near-optimal routes for problems like the Traveling Salesman Problem, but they fall apart on bigger maps than they trained on because the \"optimal\" training routes get harder to generate at scale -- this diagnoses and fixes that gap so a solver trained small still performs on much larger road networks."},
    {id:"2610.17205v1",cat:"cs.AI",title:"Releasing the Inner Jev: A Simple Recipe for Open Decision Models",summary:"\"Jev\"-style decision models skip text generation entirely and just output a probability for each candidate answer in one forward pass, like a well-calibrated bookmaker -- this shows ordinary open instruction-tuned LLMs can be turned into these cheap, fast decision heads without any proprietary secret sauce."},
    {id:"2610.11978v1",cat:"cs.CL",title:"Specialized Decision Models vs. General-Purpose LLMs: Benchmarking Jev Across Knowledge, Reasoning, and Multilingual Tasks",summary:"Benchmarks a \"System One\" decision model (Jev) that answers multiple-choice questions by outputting a probability per option instead of writing text, against 19 full LLMs on knowledge/reasoning/multilingual tasks -- testing whether a tiny odds-making machine can match a much bigger general reasoner."},
    {id:"2609.28263v1",cat:"math.OC",title:"Resource-Adaptive Stochastic Gradient Descent for Online Linear Programming without Re-solving",summary:"Online linear programming -- allocating a limited resource one request at a time without ever re-solving the whole problem from scratch -- gets a gradient method that updates prices per-request in O(m) time, essentially real-time bankroll/inventory management under a hard budget constraint."},
    {id:"2609.21359v1",cat:"math.PR",title:"Limit shape, avalanches, and stabilisation of abelian sandpiles on comb lattices",summary:"Drop grains of sand one at a time onto a comb-shaped lattice (the classic self-organizing-criticality model) and the pile's long-run stationary state turns out to concentrate entirely on the fully \"saturated\" configuration -- the paper also works out the exact shape of the cascading avalanches that follow each new grain, a clean testbed for cascading-failure/tail-risk intuition."},
  ],
  [
    {id:"2609.21476v1",cat:"math.PR",title:"A short proof of the Bernoulli decomposition theorem",summary:"Gives a much shorter, more direct construction proving that any sufficiently \"random\" process can always be cleanly split into independent fair-coin-flip pieces -- a tidy, almost aesthetic result about how randomness decomposes."},
    {id:"2609.16716v1",cat:"math.NT",title:"Distribution of squarefree integers with double congruence conditions",summary:"Split squarefree integers by congruence class and count them by how many prime factors land in each class -- the expected even split doesn't always happen, and the paper documents (and conjectures) a genuine numerical \"bias,\" like finding a loaded die hiding in pure arithmetic."},
    {id:"2305.06704v3",cat:"q-fin.PM",title:"Robust Detection of Lead-Lag Relationships in Lagged Multi-Factor Models",summary:"Builds a clustering-based method to robustly detect which time series are quietly leading and which are lagging behind others in noisy multi-factor systems -- a principled way to find who's tipping off whom before the market (or the line) catches up."},
    {id:"2305.08530v2",cat:"q-fin.PM",title:"Portfolio Optimization Rules beyond the Mean-Variance Approach",summary:"Swaps the usual Gaussian-return assumption behind Markowitz portfolio theory for asymmetric Laplace returns (fatter, skewed tails) and derives the resulting optimal allocation -- in the small-skew limit it recovers classic mean-variance plus an extra term that explicitly chases lottery-like upside."},
    {id:"2303.06051v1",cat:"q-fin.TR",title:"NFT Bubbles",summary:"Tracks NFT trades on-chain to catch actual price run-ups and crashes as they happen, then shows which investor traits (sophistication, herd behavior, heterogeneity) predict who buys the top and who dumps -- a rare case where a speculative bubble's entire anatomy is fully visible because every trade is public."},
  ],
  [
    {id:"2303.08867v4",cat:"q-fin.TR",title:"A Bayesian theory of market impact",summary:"When a big trader splits a large order into a sequence of smaller ones (a \"meta-order\") to avoid moving the price too much, other traders don't know this in advance -- this models their price-impact estimates as a Bayesian inference problem, explaining why large orders move prices the way they empirically do."},
    {id:"2303.10043v1",cat:"q-fin.TR",title:"Optimal liquidation with temporary and permanent price impact, an application to cryptocurrencies",summary:"Works out the optimal way to sell off a large crypto position while accounting for both the temporary price dent your own selling causes and a permanent, lasting price shift, then fits the actual shape of that impact curve from real BNB order-book data instead of just assuming it."},
    {id:"2602.19384v1",cat:"econ.EM",title:"How Robust are Robustness Checks?",summary:"Proposes a \"robustness radius\" -- a formal number quantifying how far a paper's robustness-check estimates are allowed to drift from its headline result before you should stop trusting the headline -- turning \"we also ran it a few other ways and got similar numbers\" from a vibe into an actual measurable statistic."},
    {id:"2609.27206v1",cat:"stat.ML",title:"Prediction with Expert Advice: Anytime Regret with Many Experts Matches the Fixed-Time Constant",summary:"In the classic \"combine n experts' predictions\" problem, the best achievable regret bound usually requires knowing the time horizon in advance to tune your learning rate -- this shows you can get essentially that same optimal regret at every possible stopping time simultaneously, i.e. a tipster-aggregation strategy that's just as good whether you quit after one day or one year."},
    {id:"2609.27179v1",cat:"stat.ML",title:"Change detection with conformal martingales: new optimal constructions, and suboptimality of existing methods",summary:"Detecting when a data stream's underlying distribution has secretly shifted (without knowing what it shifts to) can be framed as literally betting against the null hypothesis and watching your wealth grow -- this builds new provably-optimal versions of these \"testing by betting\" detectors and shows several existing ones were leaving money on the table."},
  ],
  [
    {id:"2603.09384v1",cat:"q-bio.NC",title:"Dreaming improves memorization in a Hopfield model with bounded synaptic strength",summary:"Classical Hopfield associative-memory networks catastrophically forget once you cram in too many patterns, especially once synapse strength is capped at biologically realistic bounds -- adding a \"dreaming\" phase that replays and prunes spurious memories, much like REM sleep, measurably rescues storage capacity."},
    {id:"2503.14956v1",cat:"q-bio.BM",title:"Machine learning predictions from unpredictable chaos",summary:"Chaotic systems are the textbook example of \"unpredictable,\" but this introduces a multiscale topological feature-extraction method (\"chaotic learning\") that lets ML models still pull useful predictive signal out of raw chaotic time series -- directly relevant to anyone hunting for edge in markets, weather, or sports outcomes that look chaotic on the surface."},
    {id:"2407.02538v2",cat:"q-bio.GN",title:"CGRclust: Chaos Game Representation for Twin Contrastive Clustering of Unlabelled DNA Sequences",summary:"Turns raw DNA sequences into 2D fractal \"Chaos Game\" images (each base nudges a point toward a corner of a square) and then clusters those images with a contrastive CNN -- the first time unsupervised image classification has been used to sort unlabeled DNA by species or type with no training labels."},
    {id:"2603.16741v1",cat:"q-bio.QM",title:"Bayesian Inference of Psychometric Variables From Brain and Behavior in Implicit Association Tests",summary:"The standard way to score an Implicit Association Test (the classic hidden-bias/reaction-time test) tops out around 0.7 AUC at predicting mental-health traits -- this replaces it with a sparse hierarchical Bayesian model that fuses brain and behavioral data for meaningfully better prediction of people's hidden biases."},
    {id:"2510.18889v1",cat:"q-bio.PE",title:"Prejudice driven spite: A discontinuous phase transition in ultimatum game",summary:"Mix prejudiced and unprejudiced agents in the classic ultimatum game (split-the-pot, reject-if-unfair) and crank up the fraction who are prejudiced -- the whole population doesn't drift slowly toward unfairness, it snaps in one step past a critical threshold from a generous-offer norm into a low-offer, high-rejection 'spite' norm."},
  ],
  [
    {id:"2510.17016v1",cat:"q-bio.PE",title:"Ambush strategy impacts species predominance and coexistence in rock-paper-scissors models",summary:"In a spatial rock-paper-scissors ecosystem, let one species \"ambush\" -- sense local density of its prey and choose to strike directly or lie in wait -- and this single added strategic option reshapes which species wins outright and which combinations manage to coexist, turning a classic cyclic-dominance game into a study of bluffing and timing payoffs."},
    {id:"2607.10761v1",cat:"physics.chem-ph",title:"A Three-Degree-of-Freedom Chesnavich Model for Roaming: Derivation, Phase-Space Geometry, NHIM-Anchored Dividing Surfaces, and Roaming Transport",summary:"\"Roaming\" chemical reactions dodge the usual minimum-energy path and instead wander through a flat, chaotic region of phase space before reacting -- this builds a full 3-degree-of-freedom version of the classic Chesnavich toy model and maps the exact unstable orbits and dividing surfaces that organize that wandering, a rare clean geometric picture of chaos steering a real chemical outcome."},
    {id:"2607.11650v2",cat:"cond-mat.soft",title:"How do 3M Command strips work? A fracture mechanics approach",summary:"3M Command strips hold heavy loads but peel off cleanly when you pull the tab -- this is a fracture-mechanics explanation of exactly why: the highly stretchable adhesive backing elongates under the pull, progressively debonding from the wall in a controlled peeling front rather than ripping."},
    {id:"2609.00144v1",cat:"cond-mat.stat-mech",title:"Bayesian Tracking of a Diffusing Target in Two and Three Dimensions",summary:"Tracking a randomly diffusing target using only noisy readings from a distributed sensor array maps exactly onto KPZ surface growth with a moving defect -- this extends that mapping from 1D to 2D and 3D and works out when Bayes-optimal tracking phase-transitions into failure, basically how good you can ever be at finding a randomly moving target from noisy pings."},
    {id:"2604.28021v1",cat:"physics.soc-ph",title:"Universal statistical laws governing culinary design",summary:"Treats recipes like sentences in a language and finds that cuisines across cultures and centuries obey the same statistical laws (Zipf-like ingredient frequency, consistent combination \"grammar\") that show up in human languages -- evidence that cooking has its own universal syntax despite looking totally unstructured."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: decision-theory, betting, math, games tags have mild positive community reception recently (net +2 votes each), gambling mildly positive (+1); no tags have negative reception. Soft bias only, don't force it.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
