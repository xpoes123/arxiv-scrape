export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-07',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'fake-tiers-detector',
    title: 'Fake Tiers Detector',
    paper: 'arXiv:2609.05683 — Nonparametric Hypothesis Testing of High-dimensional Clustering With Application to Single-cell RNA Data',
    pitch: `The paper gives a nonparametric test for whether a cluster split you drew on noisy high-dimensional data is real structure or just sampling variability that happened to look clean -- given the within-cluster variance, it checks whether the observed between-cluster separation is statistically distinguishable from what pure noise with the same variance would produce.

Build a single-file HTML toy: a 2D scatterplot of synthetic "player stat" points, theme-selectable (NBA archetypes / poker player types / QB tiers -- same math, relabeled axes/colors). Run a real k-means split (k=2 or 3) into visual "tiers". A noise slider controls within-cluster variance. Hitting "run the test" runs a real permutation test in-browser: resample noise-only data at the matched variance many times (a few hundred), recompute a separation statistic (e.g. between/within variance ratio) on each noise-only resample, and report an empirical p-value plus a verdict ("real tiers" vs "numerology -- busted"), with a histogram of the null distribution and the observed statistic marked.`,
  },
  {
    slug: 'gamblers-ruin-ctmc',
    title: "Gambler's Ruin, the CTMC Way",
    paper: 'arXiv:2510.25777 — Evaluating the effectiveness of Stochastic CTMC and deterministic models in correlating rabies persistence in human and dog populations',
    pitch: `The paper's point: a deterministic ODE epidemic model with R0 > 1 says the disease reservoir persists forever, but the stochastic CTMC version of the exact same model, run at realistic small population sizes, shows a real computable chance of full extinction from pure demographic randomness -- shrinking toward zero as population size N grows.

Build a single-file HTML toy reframed as bankroll ruin: two side-by-side panels share the same positive edge, bankroll/population size N, and horizon. Panel 1 draws the deterministic exponential-growth curve. Panel 2 runs a real Gillespie algorithm (exact event-driven stochastic simulation with exponential waiting times from birth/death rates derived from the edge and current state, absorbing at zero) with a "Roll Again" button revealing trajectories live and tallying busts vs. survivals. A slider for N drives an empirical extinction-probability curve that collapses toward 0 as N grows -- the paper's actual reservoir-size result, interactive.`,
  },
  {
    slug: 'printing-press-phase-diagram',
    title: 'Printing Press Phase Diagram',
    paper: 'arXiv:2604.24035 — A phase transition in monetary function explains expansion without inflation',
    pitch: `The paper's claim: newly issued base money occupies different "phases" (idle reserves vs. actively circulating cash), and inflation is triggered by crossing a phase boundary, not by the raw money-supply growth rate -- with hysteresis, so reversing the growth rate doesn't retrace the same path back down.

Build a single-file HTML toy: a money-growth-rate slider and a "phase knob" (how much new money is parked vs. spent) drive a small dynamical model (a toy difference equation with a phase-dependent effective velocity-of-money term and a hysteresis state variable). A live chart shows price level staying flat while the money supply balloons, then kinking upward once the phase knob crosses a threshold. On reversal, plot the forward and reverse paths as distinct, visibly diverging curves to make the hysteresis concrete. Include QE and COVID-stimulus preset buttons tied to illustrative slider positions.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-07-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- run the actual underlying math/dynamics live in-browser rather than a pre-canned animation.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Before returning, sanity-check the HTML yourself (tags balance, no JS syntax errors, interactive elements wired up) -- ideally via a headless browser confirming zero console errors. A build that doesn't run is disqualified.

Return a short summary of what you built and confirmation it runs cleanly.`

// Executed tonight via 3 parallel Agent tool calls + 1 judge Agent call
// (not the Workflow tool) -- kept here as a buildoff_*.js record for
// consistency with prior nights' committed scripts.
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

const judgePrompt = `Three builders each wrote a self-contained HTML demo tonight. Open and evaluate each of these 3 files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-07-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs. Disqualify (runs=false) anything broken, and note why. Score the ones that run 1-10 on wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result. Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

// Actual result from tonight's run (recorded here, not replayed):
// winner = gamblers-ruin-ctmc. fake-tiers-detector disqualified -- correct
// permutation-test math, but a CSS/Chart.js resize feedback loop sent its
// canvases to tens of thousands of pixels tall, rendering blank off-screen.
// printing-press-phase-diagram was a close second (zero defects, a genuine
// divergent hysteresis loop). gamblers-ruin-ctmc won on zero defects, the
// richest real computation (live Gillespie SSA + closed-form validation side
// by side), and the clearest payoff for a betting audience.

return { ideas: IDEAS, builds, judgement }
