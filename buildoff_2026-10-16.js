export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-16',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'spite-snap',
    title: 'The Spite Snap: Final-Table Deal Simulator',
    paper: 'arXiv:2510.18889 — Prejudice driven spite: A discontinuous phase transition in ultimatum game',
    pitch: `The paper's core claim: mix prejudiced and unprejudiced agents into a population repeatedly playing the ultimatum game (a proposer offers a split of a pot; a responder accepts or rejects, and rejection zeroes both payoffs), where prejudiced proposers offer less to out-group responders and prejudiced responders are more willing to spitefully reject low offers from the out-group. As the fraction of prejudiced agents in the population rises, the population's evolving equilibrium (average offer, average rejection rate) does NOT drift smoothly toward unfairness — it stays near a "fair" equilibrium (offers around 0.4-0.5 of the pot, low rejection) right up until a critical fraction, then jumps discontinuously to a "spiteful" equilibrium (offers near 0.1-0.2, high rejection), with no stable intermediate state. Before building, fetch https://arxiv.org/abs/2510.18889 to check the exact model setup (is it two fixed types, or evolving continuous prejudice intensity? one population or two interacting groups?) and ground your implementation in whatever the real model turns out to be; if any specific functional form isn't practical to reproduce exactly, implement the closest faithful evolutionary-game analog that genuinely produces a discontinuous (not gradual) jump as the prejudice fraction crosses a threshold — don't fake the discontinuity with an if-statement, derive it from real bistable replicator dynamics (e.g. a payoff function with a conformity/in-group bonus term that creates two locally-stable equilibria whose basins of attraction swap dominance at a critical prejudice fraction, a legitimate mechanism for first-order phase transitions in evolutionary game theory).

Build a single-file HTML+canvas toy: a population of N agents (N~200), each with an offer strategy and an acceptance threshold, updated generation-by-generation via real replicator dynamics (strategies with higher average payoff against randomly-matched opponents grow in frequency next generation — an actual simulated tournament each generation, not a canned animation). A slider controls the fraction of agents that are "prejudiced." As the user drags it, run the dynamics to convergence each step and plot TWO real, live-computed things: (1) a running population-state chart (average offer + average rejection rate over generations, redrawn each time the slider moves) showing the population visibly snap from one equilibrium to the other rather than creep, and (2) a bifurcation diagram (x-axis = prejudice fraction, y-axis = converged equilibrium offer) that the user builds up point-by-point by scrubbing the slider across its range, revealing the S-shaped/discontinuous curve. Frame it explicitly as a poker final-table ICM chop negotiation or staking-deal split: add a short on-page blurb using that framing, plus a "nudge one agent" button that flips one agent's type and shows how close to the cliff the current population already is. Dark theme, clean typography, smooth chart updates. Credit the paper (title + arXiv id) on-page.`,
  },
  {
    slug: 'hidden-shape-of-chaos',
    title: 'The Hidden Shape of Chaos: Can You Beat the Logistic Map?',
    paper: 'arXiv:2503.14956 — Machine learning predictions from unpredictable chaos',
    pitch: `The paper's core claim: chaotic systems are the textbook definition of unpredictable (sensitive to initial conditions, aperiodic, no obvious structure in the raw output sequence) — yet a topological feature-extraction method that looks at the SHAPE of the system's trajectory in reconstructed phase space, rather than the raw 1D sequence, can still pull out a real, measurable predictive edge. Fetch https://arxiv.org/abs/2503.14956 first to confirm the core mechanism (delay-embedding / topological data analysis on a chaotic generator) and ground the demo in it; if the exact method isn't practical to reproduce in a single HTML file, implement the closest honest analog: use the logistic map x_{n+1} = r*x_n*(1-x_n) at r=4 (the canonical fully-chaotic regime) as the chaos generator, derive a binary "coin flip" sequence from it (bit_n = 1 if x_n > 0.5 else 0), and make the REAL point that a 2D delay-embedding reconstruction (plotting (x_n, x_{n-1}) pairs) reveals an obvious parabolic structure totally invisible in the raw bit sequence — and that binning that reconstructed phase space and tracking each bin's empirical next-bit frequency (an honest, data-driven lookup table built from real simulated trajectory data, not fabricated) lets you predict the next bit measurably above 50%, while a naive predictor using only the raw recent-bit history stays stuck at ~50%. Compute all probabilities and accuracies from real simulated draws of the map, not scripted/staged numbers.

Build a single-file HTML+canvas toy with three live panels: (1) the raw bit sequence animating in as it's generated (just a scrolling 0/1 strip — visually boring on purpose, to sell the "looks random" setup), (2) a live scatter plot of the delay-embedded (x_n, x_{n-1}) pairs accumulating into the visible parabola shape as more points are generated, and (3) two running accuracy counters racing against each other — "Naive (raw sequence)" hovering near 50%, and "Topological (phase-space bins)" climbing measurably above it as enough data accumulates — both computed honestly online from real predictions-vs-actual-outcomes tallies, not hardcoded. A speed slider controls how fast new points stream in. Frame it explicitly for a sports-betting audience: the on-page blurb should tie this directly to the "hot hand"/"streaks are just variance" debate — a textbook-chaotic, provably-unpredictable sequence can still hide a small real edge once you look at the right geometric shape of the data, which is exactly the kind of claim that would reignite that argument. Dark theme, clean typography, smooth updates. Credit the paper (title + arXiv id) on-page.`,
  },
  {
    slug: 'sperm-derby',
    title: 'Sperm Derby',
    paper: 'arXiv:2607.12158 — Oscillatory Active Brownian Motion: A Minimal Model for Sperm Dynamics',
    pitch: `The paper's core claim: standard Active Brownian Motion (a self-propelled particle moving at constant speed with a heading angle that does a random walk) misses the fact that real microswimmers like sperm cells have a built-in periodic wiggle (from the beating flagellum) layered on top of that random heading drift — adding an explicit oscillation term changes the particle's effective long-run transport/diffusion in a way that depends on the oscillation's amplitude and frequency relative to the angular noise. Fetch https://arxiv.org/abs/2607.12158 first to confirm the exact model (how the oscillation term enters the heading-angle equation, and how it couples to the angular diffusion coefficient) and ground the implementation in it as closely as practical; the demo's racer dynamics must be a REAL simulated stochastic process (actual per-frame random draws integrated forward, e.g. via Euler-Maruyama on the heading angle: dtheta = [oscillation term A*sin(2*pi*f*t + phase)] dt + sqrt(2*D_r) dW, then position advances at fixed speed v0 in direction theta, plus optionally small translational noise), not a fake animation standing in for the physics.

Build a single-file HTML+canvas toy: a multi-lane "derby" where each lane has a racer particle governed by the real oscillatory-ABM equations above, with user-adjustable oscillation amplitude and frequency per racer (sliders, within a sane small range so races stay competitive and don't look rigged) plus a shared angular-noise level slider. Add a simple parimutuel betting panel: the user allocates virtual chips across racers before a heat, the race animates in real time on canvas to a finish line, and payouts are computed parimutuel-style (pooled chips split among winners' backers, proportional to stake) from the actual simulated outcome. Run many heats (fast-forward mode) and track each racer's empirical win rate, displayed next to a theoretical win-probability estimate derived from each racer's effective forward progress rate (a real computed quantity from the oscillation parameters — e.g. average effective speed numerically estimated from running many short simulated trajectories at those parameters, not an arbitrary formula) — so the user can see whether the "edge" from tuning a racer's wiggle is real signal (empirical win rate tracks the theoretical estimate) or just noise (it doesn't, at low heat counts). Dark theme, clean typography, satisfying race animation. Credit the paper (title + arXiv id) on-page and frame it explicitly as a silly-but-real physics parimutuel game.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-16-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- The underlying mechanism must be REAL: implement the actual math/algorithm described above, not a fake animation standing in for it. Fetch the paper's abstract first and double-check your formulas/model against it.
- Make it genuinely interactive (sliders, buttons, live-updating charts) and visually polished -- dark theme, clean typography, smooth updates. This is a competition for the single coolest, most "wow" demo.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Before finishing, actually sanity-check your own HTML: re-read the file, check every function referenced by an onclick/event listener is defined, check script tags resolve to real CDN URLs, check there's no infinite-resize or layout-thrash bug in any canvas/chart (a known failure mode in this pipeline -- a Chart.js canvas inside a container that resizes based on canvas content creates a feedback loop that blanks the page). If you have headless browser tooling available, open the file and confirm it renders and responds to interaction; if not, do a careful static trace of the control flow. Pay special attention to any toggle/checkbox/slider that's the demo's CORE mechanic -- verify it actually responds to a real click/input event (not just a programmatic state change), since a hidden/unwired toggle has disqualified a build in this pipeline before. A build that doesn't actually run when opened in a browser is disqualified regardless of how clever the idea is.

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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-16-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
