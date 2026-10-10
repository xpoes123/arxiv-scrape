export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-08',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.05732v1",cat:"cs.LG",title:"PACMI: Provenance-Aware Cascading Memory Invalidation for Long-Term LLM Agents",summary:"LLM agents rely on long-term memory to retain and reuse information over long horizons. PACMI handles memories that become outdated as new, contradicting information arrives, cascading invalidation through dependent memories."},
    {id:"2610.05240v1",cat:"cs.AI",title:"Pythia: Toward Foundation World Models for Multimodal Time Series",summary:"A unified foundation model for forecasting across heterogeneous domains, fusing textual context and auxiliary observations with numeric time series."},
    {id:"2609.39045v1",cat:"cs.CL",title:"RSIGame: Autonomous Agentic Game Development with Recursive Self-improvement",summary:"LLM agents that automatically generate games and then recursively improve them beyond a bare playable version, closing the loop between generation and iterative critique."},
    {id:"2609.38997v1",cat:"cs.CL",title:"Settle: Learning When to Stop Reasoning",summary:"Reasoning models often keep generating after their answer has already settled. Settle trains a model to detect answer stability in its own reasoning trace and stop early, saving compute."},
    {id:"2608.07134v1",cat:"cs.DS",title:"The Sync Heap: Delete First, Ask Questions Later",summary:"Revisits the textbook assumption that building a heap requires comparisons up front; a heap variant that defers comparisons, deleting optimistically and reconciling later."},
  ],
  [
    {id:"2609.23777v1",cat:"math.CO",title:"Arc Kayles is PSPACE-complete",summary:"Arc Kayles is a combinatorial game played on a graph where players remove edges and their neighbors; this paper settles a 1978 open question by showing determining the winner is PSPACE-complete."},
    {id:"2609.23746v1",cat:"math.CO",title:"On convex spiral equicoverings of masses",summary:"Convex spiral equicoverings tile a mass distribution with nested convex spiral regions of equal mass; resolves an open question about whether every planar mass admits one."},
    {id:"2609.15491v2",cat:"math.OC",title:"Optimal Sensitivity of the general Wheatstone Bridge",summary:"Optimizes the sensitivity of the unbalance voltage in a Wheatstone bridge circuit with respect to component parameter changes — a classic circuit-design tradeoff made rigorous."},
    {id:"2609.12321v1",cat:"math.PR",title:"Expected Infimum and persistence probabilities of Log-Normal Stationary Brown-Resnick Processes",summary:"Studies how low a log-normal Brown-Resnick stationary process (used to model extremes) is expected to dip, and the probability it stays above a level for a long time — i.e. a 'cold streak' probability."},
    {id:"2609.12238v1",cat:"math.PR",title:"Predictable subordination, sharp martingale inequalities and applications",summary:"A new method for sharp Lp estimates on martingales — the mathematical model of a fair gambling process — under predictable time-change ('subordination'), comparing continuous vs. jump variation."},
  ],
  [
    {id:"2609.12150v1",cat:"math.PR",title:"Lehmer-Lambert Distribution",summary:"The Lehmer transform of a signal is the ratio of consecutive power sums, forming a strictly increasing curve; this paper derives a new probability distribution from it with closed-form properties."},
    {id:"2609.05810v1",cat:"math.NT",title:"Primes with Restricted-Digit Differences",summary:"Studies how many primes exist whose base-b digits are restricted to a chosen digit set — e.g. primes writable using only digits {1,3,7,9} — and the gaps/differences between them."},
    {id:"2609.05349v1",cat:"math.NT",title:"Arithmetic Polyhedra",summary:"Classifies which 3D polyhedra, via the Koebe-Andreev-Thurston correspondence to hyperbolic reflection groups, are 'arithmetic' — i.e. built from algebraic number fields in a precise sense."},
    {id:"2306.02764v1",cat:"q-fin.PM",title:"Optimal Market Making in the Chinese Stock Market: A Stochastic Control and Scenario Analysis",summary:"Stochastic-control framework for a market maker quoting bid/ask in the Chinese stock market, with scenario analysis of inventory risk and adverse selection."},
    {id:"2305.17523v1",cat:"q-fin.PM",title:"A Comparative Analysis of Portfolio Optimization Using Mean-Variance, Hierarchical Risk Parity, and Reinforcement Learning",summary:"Head-to-head comparison of three portfolio construction approaches — classic mean-variance, hierarchical risk parity (clustering-based), and RL — on Indian equities."},
  ],
  [
    {id:"2305.06704v3",cat:"q-fin.TR",title:"Robust Detection of Lead-Lag Relationships in Lagged Multi-Factor Models",summary:"Detects which time series moves first and which follows (lead-lag), robust to noise, in multi-factor financial models — e.g. does one market/player's move predict another's with a delay."},
    {id:"2304.08590v1",cat:"q-fin.TR",title:"Risks and opportunities in arbitrage and market-making in blockchain-based currency markets",summary:"Practical introduction to high-frequency trading risk on blockchain-based currency markets, covering the specific risks (latency, front-running, failed transactions) distinct from traditional markets."},
    {id:"2602.19201v3",cat:"econ.EM",title:"Panel Quantile Regression with Common Shocks",summary:"Inferential theory for panel quantile regression robust to shocks that hit every unit simultaneously (common shocks), which otherwise induce spurious cross-sectional correlation."},
    {id:"2609.09855v1",cat:"stat.ML",title:"A Unifying Perspective on Probabilities as Model Predictions",summary:"Reconciles Bayesian vs. frequentist disagreements about what a predicted probability *means*, proposing a unifying framework for interpreting model-output probabilities."},
    {id:"2609.09656v1",cat:"stat.ML",title:"Why Learning Rediscovers the Closed-Form Diagonal Regularizer",summary:"Shows that under isotropic truncation noise, the Bayes-optimal regularization shape in inverse problems is a specific closed-form power law — learned regularizers converge to it."},
  ],
  [
    {id:"2603.04688v1",cat:"q-bio.NC",title:"Why the Brain Consolidates: Predictive Forgetting for Optimal Generalisation",summary:"Argues memory consolidation during sleep isn't about stabilizing memories but about predictive forgetting — selectively discarding detail to optimize future generalization, explaining representational drift."},
    {id:"2603.03870v1",cat:"q-bio.NC",title:"Two-phase quadratic integrate-and-fire neurons",summary:"A neuron model whose membrane potential follows two alternating Riccati equations within finite voltage bounds — an exact, tractable low-dimensional description for ensembles of realistic spiking neurons."},
    {id:"2503.20581v1",cat:"q-bio.BM",title:"Structured Random Binding: a minimal model of protein-protein interactions",summary:"A minimal statistical-physics model where nonspecific protein-protein binding emerges as a generic consequence of disorder, not from hand-tuned sequence complementarity."},
    {id:"2510.22220v1",cat:"q-bio.PE",title:"Evolution of the lexicon: a probabilistic point of view",summary:"Models the Swadesh method for dating language divergence as a stochastic word-replacement process, re-deriving the classic glottochronology formula probabilistically."},
    {id:"2510.23297v1",cat:"q-bio.PE",title:"Drivers of Variation in the Optimal Spatial Structure of Collective Information Gatherers",summary:"Studies when a group (e.g. foragers, scouts) should spread out vs. cluster to best collect and share information about a patchy, changing environment."},
  ],
  [
    {id:"2607.09737v1",cat:"physics.chem-ph",title:"Q-Score: A Quantum-Native Scoring Function for Molecular Docking",summary:"A molecular-docking scoring function derived from quantum-mechanical effects, rather than classical empirical pairwise contacts — addressing a key bottleneck in computational drug discovery."},
    {id:"2607.06051v1",cat:"cond-mat.soft",title:"From Active to Odd to Smart Matter",summary:"A review-style arc tracing active matter (self-propelled particles) through 'odd' matter (non-reciprocal interactions) to 'smart' matter (particles that sense and adapt) — a ladder of increasingly intelligent material."},
    {id:"2608.23764v1",cat:"cond-mat.stat-mech",title:"Entropy Production Bounds the Accuracy of Computation in Markov Networks",summary:"Shows a fundamental thermodynamic tradeoff: a stochastic network (biological or artificial) that computes faster/more accurately on a time-varying input must produce more entropy — a speed-accuracy-energy triangle."},
    {id:"2604.25175v1",cat:"physics.soc-ph",title:"Indirect reciprocity beyond pairwise interactions",summary:"Extends 'indirect reciprocity' (helping people with good reputations) models beyond one-on-one interactions to group settings, showing how moral reputation sustains cooperation in group challenges like public goods."},
    {id:"2604.24998v1",cat:"physics.soc-ph",title:"Relocation without preference: A destination-agnostic Schelling-type metapopulation model",summary:"A Schelling-segregation-style model where families relocate between neighborhoods completely at random (no preference for who their neighbors are) — and segregation still emerges from the relocation dynamics alone."},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific — reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord — blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
