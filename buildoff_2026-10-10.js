export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-10',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'prophets-dilemma',
    title: "The Prophet's Dilemma",
    paper: 'arXiv:2608.08662 — Kernel Methods for Refined Prophet Inequalities',
    pitch: `The paper's setup: values arrive one at a time from a known distribution; you must accept or irrevocably pass on each one, trying to maximize your accepted value. The classic prophet-inequality result says the best possible single-threshold strategy guarantees at least half of what an all-knowing prophet (who sees every value in advance and picks the max) would get -- and that 1/2 bound is tight in the worst case. This paper's refinement uses a kernel-smoothed distributional distance (rather than only worst-case tail bounds) to show that on "nice" (non-adversarial) distributions you can provably guarantee much more than 50% of the prophet's payoff -- the worst-case bound is overly pessimistic once you have a real handle on how adversarial the input distribution actually is.

Build a single-file HTML toy: values stream in one at a time (visualized as bars rising on a track, or cards flipping), drawn from a distribution the user can tune via sliders -- uniform, exponential, heavy-tailed Pareto, and a "niceness" slider that interpolates toward more adversarial shapes. The user plays the decision-maker, clicking Accept or Pass on each value as it arrives (irrevocable). A ghost "optimal single-threshold" bot plays the same sequence alongside you. After each round, show: your realized value, the threshold-bot's realized value, and the prophet's realized value (the true max, revealed after the fact) -- with a running "% of prophet's take" gauge for both you and the bot. Implement the REAL math: compute the actual optimal single-threshold for the chosen distribution (not a fake number), and show how the achievable fraction changes as the niceness slider moves, using the paper's kernel-based bound rather than just the flat 1/2 worst-case line. Caption it as a formalized version of "when do you take the offer" debates (hedge now vs. let it ride).`,
  },
  {
    slug: 'the-matching-deficit',
    title: 'The Matching Deficit',
    paper: 'arXiv:2607.03549 — Intrinsic Matching Frustration in Fluctuating Finite Systems',
    pitch: `The paper's result: for complementary one-to-one matching between two pools A and B whose sizes fluctuate randomly round to round but have exactly equal means (E[A]=E[B]), the number of matches per round is min(A,B) each time. Because min() is a concave function, Jensen's inequality guarantees E[min(A,B)] < min(E[A],E[B]) strictly -- so a permanent structural "matching deficit" (unmatched leftover inventory) accumulates forever, purely from fluctuation, even though supply and demand are perfectly balanced on average. The deficit shrinks as pool size N grows (a finite-size effect) but never fully vanishes at finite N.

Build a single-file HTML toy framed as a live sportsbook/exchange order-matching floor: each round, draw random "backable" and "layable" stake pools (A and B) from a tunable distribution with equal means (slider for mean pool size, slider for variance/noise), compute matches = min(A,B) that round, and visualize the two pools as bars colliding into a matched region with the leftover (|A-B|) spilling into a running "unmatched inventory" counter that only grows. Plot a live histogram of the per-round deficit converging to the paper's actual IMF formula (implement the real closed-form or the real Monte-Carlo estimate of E[min(A,B)] - min(E[A],E[B]), not a fake animation). A pool-size slider should visibly shrink the deficit as N grows, demonstrating the finite-size effect is real. Caption connecting this to why a sportsbook/exchange with perfectly balanced average action still ends up holding unmatched risk, and why small poker rooms always have a lonely seat.`,
  },
  {
    slug: 'the-alibi-bluff',
    title: 'The Alibi Bluff',
    paper: 'arXiv:2609.24826 — OPBackdoor: Opportunistic Backdoors via Alibi-Aligned Reasoning',
    pitch: `The paper's core trick: most known LLM backdoors are "trigger-sufficient" -- they fire every time a trigger pattern appears, which is exactly what makes them detectable (the objective reveals itself unconditionally). OPBackdoor instead only fires when the model can construct a plausible contextual "alibi" for the bad behavior -- i.e. the backdoor is opportunistic, conditioned on surrounding context providing cover, not just on trigger presence. This defeats trigger-sufficient backdoor detection because the malicious behavior and the trigger are no longer tightly coupled -- you need the context to also look right.

Build a single-file HTML poker-table toy: render a Texas Hold'em board (community cards + a bet-sizing panel) that deals out random hands/boards as the user clicks "Next Hand" or drags board-texture controls (paired board, flush draw present, bet-sizing aggression). An AI agent (an actual rule-based scoring function computing a real "coherence score" from board texture + bet-sizing history -- e.g. scoring how consistent a big bluff-sized bet would look given the board's scare-card potential, not a fake random number) decides whether to "pull the bluff" (misrepresent its hand) only once that coherence score crosses a visible threshold slider; below threshold it plays straightforwardly. Show the live coherence score as a gauge next to the board, and let the user watch the bluff silently arm (score crosses threshold) and disarm (score drops) as they change board texture -- directly visualizing why a detector that only watches for "does a bluff happen here" (trigger-sufficient) misses one that waits for board cover (opportunistic). Caption connecting this to slow-rolling/sandbagging and why balanced/GTO-style bluff-catching assumes the wrong threat model.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-10-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- The underlying mechanism must be REAL: implement the actual math/algorithm described above, not a fake animation standing in for it. Double-check your formulas against the pitch description.
- Make it genuinely interactive (sliders, buttons, live-updating charts) and visually polished -- dark theme, clean typography, smooth updates. This is a competition for the single coolest, most "wow" demo.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Before finishing, actually sanity-check your own HTML: re-read the file, check every function referenced by an onclick/event listener is defined, check script tags resolve to real CDN URLs, check there's no infinite-resize or layout-thrash bug in any canvas/chart (a known failure mode in this pipeline -- a Chart.js canvas inside a container that resizes based on canvas content creates a feedback loop that blanks the page). If you have headless browser tooling available, open the file and confirm it renders and responds to interaction; if not, do a careful static trace of the control flow. Pay special attention to any toggle/checkbox that's the demo's CORE mechanic -- verify it actually responds to a real click event (not just a programmatic state change), since a hidden/unwired toggle has disqualified a build in this pipeline before. A build that doesn't actually run when opened in a browser is disqualified regardless of how clever the idea is.

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
  `You are judging a 3-way build-off of interactive HTML demos. Open each file, check it actually runs (no JS errors, no blank/broken rendering), drive its interactivity (click every toggle/button/slider, not just read the HTML statically), and score it on wow-factor, interactivity, polish, and fidelity to its paper's actual result (each 1-10). Disqualify (runs=false) anything that doesn't actually work when opened in a browser and exercised -- a previous night's build had a core toggle that looked correct in the HTML but was dead to real clicks, so actually click things, don't just trace the code. Then pick the single best overall winner among the ones that run.

Files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-10-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
