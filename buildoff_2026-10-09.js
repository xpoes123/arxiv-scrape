export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-09',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'martingale-blowup-lab',
    title: 'Martingale Blowup Lab',
    paper: 'arXiv:2609.13963 — Non-blowup of stochastic heat equations by noise',
    pitch: `The paper's result: a superlinear reaction term that would deterministically blow up a heat equation in finite time gets RESCUED from blowup once you add stochastic noise to the equation -- noise acts as a stabilizer, not a destroyer, contrary to the usual intuition that variance is what kills you.

Build a single-file HTML toy: two side-by-side bankroll panels running the same "double-after-loss" martingale betting system (deterministic doubling schedule after each loss). Panel A is the pure deterministic version -- it marches toward either a scheduled blowup (bet size diverges) or a clean payoff, with a live "time to blowup" counter. Panel B injects a genuine stochastic noise term (modeled after the paper's noise coefficient acting on the superlinear growth term) into the bet-sizing dynamics, and the trajectory visibly survives far longer / stays bounded where panel A detonates. A single prominent "Add Noise" toggle flips B between its noisy and noiseless behavior live, so the user can directly compare. Make the underlying math real (an actual discretized SDE step, not a fake random wiggle) -- the whole point is that this is a rigorous result, not a vibes-based chart. Caption it as "is variance your enemy or your airbag?" framed for a martingale-betting-system argument.`,
  },
  {
    slug: 'the-hedge-floor',
    title: 'The Hedge Floor',
    paper: 'arXiv:2608.10040 — Online Discrepancy Minimization for Sub-Gaussian Inputs via Regularization and Restriction',
    pitch: `The paper's setup: vectors arrive one at a time and each must immediately get a sign (+1/-1) assigned, trying to keep the running signed sum as close to zero as possible (minimize discrepancy). The paper's polynomial-time algorithm combines regularizing the L-infinity norm with restricting updates to an adaptively chosen coordinate set, and provably beats the naive sqrt(n) bound that a greedy or random strategy gets stuck with.

Build a single-file HTML toy framed as a live sportsbook risk desk: random sub-Gaussian "bet-exposure" vectors stream in one at a time (visualized as bars/arrows on a canvas), and three lanes race side by side to keep their running liability (the signed sum) near zero -- (1) pure-greedy (picks the sign that locally minimizes the instantaneous norm), (2) the paper's actual regularize-then-restrict-to-adaptive-coordinates algorithm (implement the real mechanism, not a stand-in), and (3) a dumb random bookmaker that signs coin-flip style. Plot each lane's running liability as a live line chart. The regularized lane should visibly hug zero while the random lane visibly walks off into a growing deficit, with a running numeric liability readout per lane so it reads as "how exposed is this book" rather than an abstract norm. Let the user restart/reseed the stream.`,
  },
  {
    slug: 'spread-setter',
    title: "Spread Setter: Vegas Moves First",
    paper: 'arXiv:2609.17927 — Day-ahead Coordination of Virtual Power Plants within Active Distribution Networks using Deterministic Bi-Level Optimization',
    pitch: `The paper's setup: a bi-level Stackelberg game where a leader (grid operator) commits to prices/constraints first to minimize its own cost (expenditure + voltage deviation), and follower Virtual Power Plants then best-respond by optimizing their own dispatch given those committed prices -- the leader's first-mover commitment is what lets it steer the followers' best response toward a good outcome.

Build a single-file HTML toy: the user plays the leader (a sportsbook) by dragging a spread slider and a vig slider for a hypothetical game. A simulated pool of "sharp" bettor agents then best-responds by optimally allocating stake across the line (an actual optimization over their utility given the posted line, not a fake animation), and a live chart shows the book's expected margin vs. liability variance updating in real time as the sharps respond. Add a toggle: "Leader moves first" ON (the normal Stackelberg order -- book commits, sharps respond, book's margin/variance tradeoff is favorable) vs OFF (bettors see the model-optimal line being computed and front-run it before the book commits, degrading the book's edge) -- make the degradation in the OFF case a real, computed consequence of the changed information order, not a scripted effect. Caption connecting this directly to why books move limits/release windows the way they do.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-09-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- The underlying mechanism must be REAL: implement the actual math/algorithm described above, not a fake animation standing in for it. Double-check your formulas against the pitch description.
- Make it genuinely interactive (sliders, buttons, live-updating charts) and visually polished -- dark theme, clean typography, smooth updates. This is a competition for the single coolest, most "wow" demo.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Before finishing, actually sanity-check your own HTML: re-read the file, check every function referenced by an onclick/event listener is defined, check script tags resolve to real CDN URLs, check there's no infinite-resize or layout-thrash bug in any canvas/chart (a known failure mode in this pipeline -- a Chart.js canvas inside a container that resizes based on canvas content creates a feedback loop that blanks the page). If you have headless browser tooling available, open the file and confirm it renders and responds to interaction; if not, do a careful static trace of the control flow. A build that doesn't actually run when opened in a browser is disqualified regardless of how clever the idea is.

Return a short summary of what you built and confirmation that you checked it runs.`

phase('Build')
const builds = await parallel(IDEAS.map((idea, i) => () =>
  agent(BUILD_PROMPT(idea, String.fromCharCode(97 + i)), {
    label: `build-${idea.slug}`,
    phase: 'Build',
  })
))

const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    entries: {
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
    winner_slug: { type: 'string' },
    winner_reason: { type: 'string' },
  },
  required: ['entries', 'winner_slug', 'winner_reason'],
}

phase('Judge')
const judged = await agent(
  `You are judging a 3-way build-off of interactive HTML demos. Open each file, check it actually runs (no JS errors, no blank/broken rendering), drive its interactivity, and score it on wow-factor, interactivity, polish, and fidelity to its paper's actual result (each 1-10). Disqualify (runs=false) anything that doesn't actually work when opened in a browser. Then pick the single best overall winner among the ones that run.

Files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-09-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
