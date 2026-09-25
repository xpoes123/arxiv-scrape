export const meta = {
  name: 'arxiv-nightly-buildoff-2026-09-25',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'spot-the-signal',
    title: 'Spot the Signal',
    paper: 'arXiv:2609.29183 — Predicting Emerging Topics from Outliers: A Prospective Study of Weak Signals in Embedding Space',
    pitch: `The paper studies "anticipatory outliers": documents that an embedding-based topic model initially classifies as pure noise, but which later turn out to be the first sighting of a real emerging topic. Using only information available at publication time (no hindsight), the paper shows these anticipatory outliers can be prospectively distinguished from ordinary noise (documents that stay noise, or reinforce an existing topic) with high accuracy (F1 around 0.9 on the high-consensus cases).

Build a single-file HTML toy: a canvas of scattered dots in a 2D "embedding space" projection, most of which are ordinary noise (they'll stay scattered/fade), but a subset are anticipatory outliers that will visibly cluster together into a new labeled "topic" a few seconds later in the animation. Before the reveal, let the user click the dots they predict will become part of tomorrow's emerging cluster. Run a simple real geometric heuristic in-browser (e.g. local density trajectory / drift-toward-neighbors over simulated time steps, something that actually mirrors "which outliers are moving toward forming a cluster" rather than being purely random) to decide which dots are the true anticipatory outliers, then reveal the answer and score the user against that model, prediction-market style, with a running accuracy/score tracker across rounds.`,
  },
  {
    slug: 'head-to-head-odds',
    title: 'Head-to-Head Residual Odds',
    paper: 'arXiv:2609.29268 — BridgeMem: Causal Dyadic Transition Residuals for Temporal Knowledge Graph Forecasting',
    pitch: `The paper argues that generic forecasters (in temporal knowledge graphs) mostly summarize each entity's own history and miss pair-specific transition evidence — how the prior relations between THIS specific pair of entities shift the odds of the target relation. BridgeMem estimates this pair-specific signal as a learned residual correction added on top of a frozen general forecaster's log-scores, retrieved from the pair's own past event history.

Build a single-file HTML toy that reskins this as an NBA matchup tool. Let the user pick two fictional teams (or generate two synthetic teams with random base power ratings) and generate a synthetic pairwise event history between them (a sequence of past "games" with randomized outcomes — blowouts, upsets, close games — rendered as a timeline). Show a baseline win probability from generic power ratings, then run a real (if simplified) residual calculation over the synthetic head-to-head event history — e.g. a recency-weighted log-odds adjustment derived from the actual sequence of past matchup outcomes shown on screen, not a canned number — and show a slider or toggle that blends the baseline and the head-to-head-adjusted probability live, with a fallback toggle that reverts to the generic baseline when the synthetic pairwise history is sparse (mirroring the paper's adaptive trust mechanism). Make the timeline and the probability bar genuinely reactive to each other.`,
  },
  {
    slug: 'sandwich-attack',
    title: 'Sandwich Attack Simulator',
    paper: 'arXiv:2609.28115 — No Place to Hide: An Analysis on Protected Order Flow Sandwich Attacks',
    pitch: `The paper is a three-year longitudinal measurement study showing that "protected" order flow (trades submitted via private RPCs / native protections meant to shield them from front-running) on Ethereum and Solana still gets sandwich-attacked at massive scale — tens of millions of attacks, 28 million on Solana alone — showing these protections provide much weaker guarantees than users assume.

Build a single-file HTML toy: an interactive AMM (constant-product, x*y=k) price-impact simulator. The user sets a trade size and a slippage tolerance, then hits submit. Animate an order-book / price-impact chart where a "sandwicher" bot detects the pending trade, front-runs it (buys first, pushing the price up), lets the user's trade execute at the worse price, then back-runs (sells), visually extracting the exact profit a real MEV sandwich attacker would pocket — computed from the actual constant-product-AMM math given the trade size, pool depth, and slippage tolerance, not a fixed canned number. Add a toggle "private RPC protection: ON/OFF" that, when on, only marginally reduces the attack's success chance (mirroring the paper's finding that these protections barely help) rather than eliminating it. Show a running tally of total value extracted across repeated simulated trades to make the "tens of millions of attacks" scale point land.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-09-25-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page. Run the actual underlying math/dynamics live in-browser (geometric outlier/clustering heuristic, recency-weighted log-odds residual, or constant-product-AMM sandwich math as applicable) rather than a pre-canned or hand-tuned animation.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Dark theme, clean typography, mobile-reasonable layout is a plus but not required.
- Before returning, sanity-check the HTML yourself: read the file back, confirm tags balance, no obvious JS syntax errors, all referenced CDN URLs are real, and that the interactive elements are wired up (event listeners present, canvas/svg actually draws). If you have a way to actually execute/render it (e.g. via a headless browser tool), do so and confirm zero console errors -- otherwise do a careful manual read-through.
- A build that doesn't run is disqualified, so err on the side of simpler-but-definitely-working over ambitious-but-broken.

Return a short (under 150 words) summary of what you built and confirmation that you verified the file is valid, self-contained HTML.`

phase('Build')
const builds = await parallel(IDEAS.map((idea, i) => () =>
  agent(BUILD_PROMPT(idea, String.fromCharCode(97 + i)), {
    label: `build-${idea.slug}`,
    phase: 'Build',
  })
))

log(`${builds.filter(Boolean).length}/3 builders completed`)

phase('Judge')
const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          runs: { type: 'boolean' },
          wow: { type: 'number' },
          interactivity: { type: 'number' },
          polish: { type: 'number' },
          fidelity: { type: 'number' },
          notes: { type: 'string' },
        },
        required: ['slug', 'runs', 'wow', 'interactivity', 'polish', 'fidelity', 'notes'],
      },
    },
    winnerSlug: { type: 'string' },
    reasoning: { type: 'string' },
  },
  required: ['scores', 'winnerSlug', 'reasoning'],
}

const judgePrompt = `Three builders each wrote a self-contained HTML demo tonight, competing to build the coolest interactive arXiv-paper demo. Open and evaluate each of these 3 files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-09-25-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
