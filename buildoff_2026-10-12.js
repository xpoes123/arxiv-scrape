export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-12',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'clutch-gene-or-statistical-ghost',
    title: 'Clutch Gene or Statistical Ghost',
    paper: 'arXiv:2610.02173 — Every Ablation Is a Dose: Counterweights and the Semblance of Self-Repair',
    pitch: `The paper's core claim: when you ablate (knock out) a causally important component of a language model, other components appear to "step up" and compensate -- a phenomenon called self-repair. The paper shows this isn't heroic compensation kicking in on demand: each unit's response follows a fixed affine law E_r(λ) = own_r + γ_r·λ, where λ is the signed strength of the ablation/contrast and γ_r is a FIXED coefficient baked into the model's weights before any intervention happens. So the "repair" you see after ablation is just that same fixed linear response evaluated at a different point on the λ axis -- there's no new compensating behavior, only a straight line you were already on.

Build a single-file HTML toy that makes this viscerally legible via a sports-team metaphor: a starting 5-man lineup, each player with a baseline stat line (points/usage). A "star" slider controls λ -- the signed strength of removing/reducing the star's involvement (0 = star fully in, 1 = star fully out, and allow negative λ too, i.e. star getting EXTRA usage, to show the law runs both directions). Each teammate's response to the slider must be a REAL affine function E_r(λ) = own_r + γ_r·λ with a genuine per-player fixed slope γ_r (pick distinct slopes, some positive/counteracting = "counterweights", some near zero) -- as the user drags λ, every teammate's bar moves along ITS OWN straight line, live, with the line itself drawn on a small inset chart so you can see it's linear, not some scripted "surge" animation. Add a toggle: "Naive self-repair narrative" (just show the post-ablation stat bump, inviting the "he stepped up!" read) vs "Counterweight view" (show the full E_r(λ) line across the whole λ range, revealing the bump was already determined before ablation). Caption crediting the paper and connecting it to prop markets pricing a role-player's expected bump when a star sits.`,
  },
  {
    slug: 'elos-noise-floor',
    title: "Elo's Noise Floor",
    paper: 'arXiv:2609.14922 — Steady-State Convergence of Stochastic Approximation',
    pitch: `The paper's result: for constant-stepsize stochastic approximation (the exact structure of an Elo/Glicko rating update: rating += K * (actual - expected)), the rating doesn't converge to a single number -- it converges in distribution to a STATIONARY law whose spread scales with the stepsize α (the K-factor). Under local quadratic linearization, the steady-state distribution is well-approximated by a Gaussian with spread of order sqrt(α) (Wasserstein-2 rate), i.e. the noise floor's WIDTH scales with the square root of the step size, not linearly -- a real quantitative bias/variance law, not just "bigger K = more noise" vibes.

Build a single-file HTML simulator: a "player" with a fixed true skill (hidden, but used to generate real match outcomes via a logistic win-probability model against opponents of varying skill), and a visible Elo-style rating that updates every simulated match via rating += K*(actual-expected). A K-factor slider (e.g. 4 to 64) controls α. Run matches continuously (fast-forward button) and plot: (1) a live trace of the rating over time, and (2) a running histogram of the rating's steady-state distribution once it's equilibrated, with the REAL computed standard deviation displayed numerically and compared against the paper's sqrt(α) scaling prediction (show both the empirical std and the theoretical sqrt(α)-scaled prediction so the user can see they track). Let the user crank K up (watch the histogram visibly widen, fast-reacting but noisy) and down (narrower but slower to track a true skill change you can trigger with a "skill shock" button). Caption crediting the paper and connecting it to why chess/Elo/sports-power-ranking communities argue endlessly about K-factor -- it's a bias/variance knob with a provable noise-floor law, not opinion.`,
  },
  {
    slug: 'hot-hand-diffusion-lab',
    title: 'Hot Hand Diffusion Lab',
    paper: 'arXiv:2608.25916 — Current fluctuations in a gas of active Ornstein-Uhlenbeck particles',
    pitch: `The paper studies time-integrated "current" (net displacement) for particles whose velocity is itself a correlated (active Ornstein-Uhlenbeck) process rather than independent random noise. For PASSIVE (ordinary, memoryless) diffusion, current fluctuations always scale sub-diffusively/diffusively in a universal way -- variance grows like time. For ACTIVE particles with a persistence time τ (how long a "streak" of correlated motion lasts), the variance of cumulative current can scale diffusively, SUPER-diffusively, or sub-diffusively depending on τ and the time window you look at, all governed by one scaled cumulant generating function.

Build a single-file HTML canvas simulator framed as bankroll walkers: each walker's per-step "bet outcome" is driven by an Ornstein-Uhlenbeck-correlated process (REAL OU process: dv = -v/τ dt + noise, not a fake streak-injection hack) instead of plain i.i.d. coin flips. A τ slider (0 = memoryless/i.i.d. baseline, higher = more "hot hand"-like persistence) controls the correlation time. Run many walkers simultaneously on a canvas, each accumulating a running bankroll curve, and continuously plot a log-log chart of Var(cumulative current) vs time elapsed, with a live-fit slope (the scaling exponent) displayed numerically -- at τ=0 it should sit near the standard diffusive exponent (slope ≈1 on log-log of variance vs time), and as τ increases the fitted exponent should visibly shift away from 1, matching the paper's claim that persistence breaks the universal sqrt(time) scaling Kelly betting assumes. Caption crediting the paper and connecting it directly to the "is the hot hand real" debate and why streak-correlated outcomes can make naive Kelly-style variance assumptions wrong.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-12-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- The underlying mechanism must be REAL: implement the actual math/algorithm described above, not a fake animation standing in for it. Double-check your formulas against the pitch description.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-12-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
