export const meta = {
  name: 'arxiv-nightly-buildoff-2026-09-16',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'hot-hand-head-fake',
    title: 'Hot Hand or Head Fake',
    paper: 'arXiv:2602.09382 — Initial-Condition-Robust Inference in Autoregressive Models',
    pitch: `The paper shows that standard confidence intervals for an AR(1)-type process implicitly assume you started observing it at its long-run stationary mean. If the process actually started "hot" or "cold" (e.g. a shooting streak, a poker bankroll, a betting model's residual series right after it happens to run good or bad), the textbook CI's true coverage can collapse to roughly 40-60% instead of the advertised 95% — and the paper derives a corrected, initial-condition-robust interval that stays honest regardless of starting point.

Build a single-file HTML toy: simulate an AR(1) process live (sliders for autocorrelation rho, initial condition offset, and sample size), run thousands of repeated draws in-browser, and plot empirical coverage of (a) a naive textbook CI and (b) the paper's initial-condition-robust CI as the user drags the initial-condition slider away from the stationary mean. Make the naive CI's coverage visibly collapse toward 40-60% while the robust one stays near 95% — a visceral "the stat you trusted was lying" moment. Frame it explicitly for a betting/poker audience: this is the hot-hand fallacy argument, but with the actual math showing exactly how your confidence interval breaks when you eyeball a "hot" streak.`,
  },
  {
    slug: 'signal-or-ghost',
    title: 'Real Signal or Ghost? Mutual-Information Permutation Tester',
    paper: 'arXiv:2603.04622 — INTENSE: Detecting and disentangling neuronal selectivity in calcium imaging data',
    pitch: `INTENSE is a neuroscience tool for proving a neuron's activity is genuinely related to a stimulus (not coincidence) by computing mutual information between the two signals, then testing it against a proper null distribution built via circular-shift permutation (shifting one series by random amounts many times, recomputing MI each time, and seeing where the real MI falls relative to that shuffled distribution). The same statistical weapon works on any two time series you suspect share real signal vs. spurious correlation — including a "hot hand" shooting/betting streak.

Build a single-file HTML toy: let the user pick from a few synthetic time-series pairs (a genuine correlated pair simulating a real hot-hand-like signal, a confounded pair that looks correlated but shares a hidden common cause, and a pure-noise pair), compute mutual information between the chosen pair live in-browser, then run the circular-shift permutation test step by step — animate the shuffles accumulating into a null-distribution histogram with the real observed MI marked as a vertical line, and a p-value readout ticking down/settling as more shuffles run. Make the "is this real" verdict satisfying and visual. Frame it for the audience as the rigorous version of "is the hot hand real" — borrowed straight from neuroscience.`,
  },
  {
    slug: 'bettor-swarm',
    title: 'Bettor Swarm: Sharp Money vs. the Herd',
    paper: 'arXiv:2606.19498 — Collective phases in overdamped magnetic self-propelled spherocylinders',
    pitch: `The paper studies self-propelled magnetic rod-shaped particles and shows they settle into qualitatively distinct collective phases — scattered independent motion (gas), aligned flocking, contrarian chains, panic-driven vortices, and locked pairs — depending on just two dials: self-propulsion strength and magnetic coupling strength between neighbors, with sharp transitions between phases as those dials move.

Build a single-file HTML canvas simulation: reskin the same active-matter physics as a betting market. Particles are "bettors" (small dots/rods); "magnetic coupling" becomes a "herd coupling" slider (how much each bettor's direction is pulled toward its neighbors' — i.e. line-chasing/groupthink); "self-propulsion" becomes a "signal strength" slider (how much each bettor moves on its own independent read). Run the simulation live so dragging the sliders visibly morphs the swarm between: scattered independent sharps (gas phase), one big consensus flock (public money piling on), contrarian chains, a panic-driven vortex, and paired arbitrage "locked dimers" — an explicit, playable physics metaphor for betting-market herding and line movement. Label each observed phase on screen as it's reached. Ground the actual phase-boundary behavior in the real paper (fetch the abstract), don't just hand-wave a smooth blend.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-09-16-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-09-16-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
