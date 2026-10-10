export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-05',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'dutch-book-arena',
    title: 'Dutch Book Arena',
    paper: 'arXiv:2609.39341 — Understanding as No-Arbitrage: Bounded Dutch Books as a Definition and Training Objective',
    pitch: `The paper defines "understanding" as having no exploitable bounded Dutch book in your stated beliefs: if your probabilities on logically-linked events violate the constraints between them (implication, mutual exclusivity, subadditivity), there is a computable, guaranteed-profit combination of bets a bookmaker can construct against you, bounded by a max stake.

Build a single-file HTML toy: present 3-4 logically linked sports prop events for one game (e.g. "Team wins", "Team wins by 10+", "Star scores 30+", where winning-by-10+ implies winning, and there are only a handful of joint outcomes). Let the user set their own probability for each event via sliders. Live-compute, via a real small linear program (or brute-force vertex search over the actual small set of consistent joint outcomes -- genuinely solve it in-browser, don't fake it), the maximum guaranteed profit a bookmaker could lock in against the user's stated probabilities within a bounded total stake (e.g. $100). Visualize this as cash animating out of the user's "bank" into the bookmaker's pool across every possible world simultaneously when they're exploitable, and $0 extractable when their probabilities are coherent. Include a "make me coherent" button that projects the sliders back onto the nearest consistent probability assignment, so users can feel the gap between what they typed and what's logically allowed.`,
  },
  {
    slug: 'whale-finder',
    title: 'Whale Finder: The Planted-Submatrix Threshold',
    paper: 'arXiv:2609.06988 — Almost Sharp Equivalence between Approximate Message Passing and Low-Degree Polynomials',
    pitch: `The paper proves that for detecting a hidden correlated block (a "planted submatrix") buried in an otherwise random noise matrix, low-degree polynomial estimators are provably statistically equivalent to the much fancier Approximate Message Passing (AMP) algorithm -- right up until a sharp signal-to-noise threshold, past which polynomial estimators permanently cannot catch up, no matter their degree.

Build a single-file HTML toy: generate an n x n matrix (e.g. 40x40) of random Gaussian noise, with a hidden k x k "whale syndicate" submatrix (a block with elevated correlated values) planted at a random location -- re-rollable with a button, real randomness each time. Implement two real detectors that run live in-browser: (1) a naive low-degree estimator (e.g. degree-1 or degree-2 polynomial statistic -- literally sum/average of row-sums or similar, computed for real over the actual matrix) and (2) a simplified AMP iterative loop (a few rounds of belief-propagation-style updates refining a membership estimate, implemented for real, not faked). Sliders control submatrix size k and signal strength (the mean-shift of the planted block). As the user drags signal strength across the theoretical detection threshold (compute it from the paper's scaling, e.g. relate it to k/sqrt(n) or similar — approximate but mathematically grounded, not arbitrary), show the naive estimator's detection accuracy flatlining at chance while the AMP loop's accuracy keeps climbing -- a visible, real phase transition computed from live data, not a canned animation.`,
  },
  {
    slug: 'interference-odds',
    title: 'Interference Odds',
    paper: 'arXiv:2603.03358 — Contextuality, Incompatibility, and Intra-System Entanglement of Mental Markers',
    pitch: `The paper models human judgment on linked questions as non-commuting quantum-like observables rather than classical probabilities -- a well-documented real effect (cf. question-order/Wang-Busemeyer models) where asking "will the favorite cover?" then "will it go over?" yields a different joint probability estimate than asking in the reverse order, purely from sequencing, not new information.

Build a single-file HTML toy framed as a two-leg parlay builder. Let the user set their gut-feel confidence for two linked prop questions (e.g. "Team covers the spread?" and "Game goes over the total?") by clicking through a short elicitation flow -- first in order A-then-B, then reset and redo in order B-then-A. Record both resulting joint-probability estimates (computed from the actual sequential conditional answers the user gives, not hardcoded) and visualize the discrepancy between the two orderings as an interference-pattern overlay (e.g. two overlapping probability-amplitude-style wave visualizations on a canvas, genuinely rendered from the two different number sequences) next to a simple bar comparison of "Order AB joint probability" vs "Order BA joint probability." Include a short explainer of why classical probability requires these to match (commutativity) and what it means that they usually don't. Should work with a single user clicking through both orders themselves (no backend/multi-user needed) -- make the elicitation UI clear enough that one person can meaningfully do both passes.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-05-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page. Run the actual underlying math/dynamics live in-browser (the real LP/vertex-search for Dutch Book Arena, real low-degree + AMP detectors for Whale Finder, real sequential elicitation + visualization for Interference Odds) rather than a pre-canned or hand-tuned animation.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-05-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
