export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-14',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'calibration-illusion',
    title: 'The Calibration Illusion',
    paper: 'arXiv:2610.13654 — TabReliBench: Evaluating Tabular Foundation Models Beyond Predictive Accuracy',
    pitch: `The paper's core claim: tabular foundation models that LOOK well-calibrated in aggregate (their overall reliability diagram sits right on the 45-degree line, predicted probability vs observed frequency) can have wildly miscalibrated SUBGROUP calibration -- the model's rankings on "which model is most reliable" flip completely depending whether you measure overall calibration, subgroup calibration, or interval efficiency. Aggregate calibration can mask total garbage on a slice that matters.

Build a single-file HTML toy that makes this visceral with a sports win-probability framing. Generate a synthetic dataset of N games (a few thousand) where each game has a TRUE win probability drawn from some generator, plus 2-3 binary subgroup attributes the user controls via toggles/sliders (e.g. favorite vs. underdog, home vs. road, rested vs. back-to-back). Build a "model" whose predicted probability is the true probability distorted by a REAL, deterministic miscalibration function that is DIFFERENT per subgroup (e.g. systematically overconfident on underdogs, systematically underconfident on back-to-backs) -- not a fake animation, an actual per-subgroup bias function applied to real simulated outcomes (Bernoulli draws from the true probability). Compute and plot TWO real reliability diagrams side by side from this real simulated data: (1) the overall/aggregate reliability diagram (bin predicted probabilities, plot mean predicted vs mean observed per bin) which should land close to the 45-degree line because the per-subgroup biases cancel out in aggregate, and (2) the SAME diagram split by subgroup, showing the subgroup curves fanning out away from the diagonal. Let the user drag a slider controlling how strong the per-subgroup miscalibration is and watch panel 1 stay flat/diagonal while panel 2 visibly fans apart. Add a live-computed "aggregate Expected Calibration Error" vs "worst-subgroup ECE" readout (both real computed numbers from the binned data, not fabricated) so the gap is quantified, not just visual. Make it visually polished -- dark theme, clean two-panel layout, smooth chart updates. Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real calibration-vs-subgroup-calibration result being demonstrated.`,
  },
  {
    slug: 'extinction-roulette',
    title: "Extinction Roulette: Your Bankroll's Hidden R0",
    paper: 'arXiv:2510.25777 — Evaluating the effectiveness of Stochastic CTMC and deterministic models in correlating rabies persistence in human and dog populations',
    pitch: `The paper's core claim: for a branching-process-style stochastic model (births = new infections, deaths = recoveries/extinction), there is an explicit STOCHASTIC extinction threshold distinct from the deterministic mean-field (ODE) prediction -- even when the deterministic model's mean trajectory climbs confidently upward (R0 > 1, "the epidemic grows"), a large fraction of actual stochastic sample paths still go extinct early purely from randomness, because extinction is a real absorbing state that a continuous mean-field model can't represent.

Build a single-file HTML+canvas toy porting this exact math to a betting bankroll framing. Implement a REAL discrete-state continuous-time (or simple discrete-time birth-death, which is an honest and simpler-to-verify equivalent) birth-death Markov chain where state = bankroll units, "birth" (unit gained) happens at a rate proportional to win probability p and bet size, "death" (unit lost) happens at rate proportional to (1-p), and 0 is an absorbing ruin state. Let the user set edge (p, e.g. 0.50-0.55) and bet/variance size via sliders -- these REALLY parameterize the birth/death rates, not just labels. Compute and draw the deterministic mean-field trajectory (closed-form or simply the expected-value recursion, a real formula) as a smooth climbing curve. Then actually SIMULATE 200 independent real stochastic sample paths of the same chain (real pseudorandom draws, Gillespie-style or discretized binomial steps, your choice as long as it's a real stochastic simulation not a canned animation) and draw them as faint traces underneath/around the mean curve, plus a live "fraction already busted (hit 0)" counter that updates as paths are drawn and keeps climbing even while the mean curve climbs too. Include a numeric readout of the real extinction-probability estimate (fraction of the 200 simulated paths that hit 0) next to the theoretical extinction probability if you can derive/approximate it (e.g. via the gambler's-ruin formula for birth-death chains, (q/p)^k for appropriate q,p,k) -- showing simulation and theory agree. Make it visually polished -- dark theme, smooth canvas rendering, a clear "mean lies, paths don't" framing. Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real stochastic-vs-deterministic extinction result being demonstrated.`,
  },
  {
    slug: 'dictator-or-decoy',
    title: 'Dictator or Decoy?',
    paper: 'arXiv:2609.31797 — Stability of the Courtade-Kumar inequality',
    pitch: `The paper's core claim: for a Boolean function f: {-1,1}^n -> {-1,1}, there's a precise notion of the function's "information" (related to how much a single random input bit, on average, tells you about the output -- the Courtade-Kumar inequality bounds this information in terms of each variable's individual influence, maximized exactly by DICTATOR functions, where the output literally just copies one input variable and ignores the rest). The STABILITY result: if a function's information is close to that extremal dictator value, the function itself must be probabilistically CLOSE to an actual dictator (close in the sense of agreeing with some single-variable function on all but a small fraction of inputs) -- with an explicit, dimension-free quantitative bound on "how close information implies how close to a dictator."

Build a single-file HTML toy letting the user construct a Boolean "betting signal" function of 4-6 binary inputs via an interactive truth table (toggle each of the 2^n rows' output by hand, n user-selectable from 4-6) or a simple rule-builder (AND/OR/majority-of-k of named inputs like "line moved", "star player out", "home dog", "back-to-back", "public heavy on one side", "revenge game"). From the REAL truth table the user built, compute real quantities: (1) each input variable's actual influence (fraction of input pairs differing only in that coordinate where the output flips -- a real combinatorial computation over all 2^n inputs, exactly computable for n<=6), (2) the function's total information/influence sum, (3) for each single variable i, the real agreement rate between f and "just copy variable i" (or its negation) over all 2^n inputs -- i.e. how close f actually is to being a dictator on variable i, computed exactly, not estimated. Display the closest-matching dictator variable and the REAL measured closeness (agreement fraction), plus a plot/gauge showing where the function's actual (information, distance-to-nearest-dictator) point falls relative to the paper's proven stability curve (you can render the qualitative shape of the bound -- close-to-max-information implies close-to-dictator -- using the paper's bound formula or a clearly-labeled qualitative version if the exact constants aren't practical to reproduce; be honest in the UI about which parts are the exact proven bound vs. an illustrative curve). Include a "gut-punch mode" with 2-3 preset multi-factor handicapper rules (e.g. majority-of-3, a weighted threshold rule) pre-loaded into the truth table so the user can immediately see most of them collapse onto one dominant variable. Make it visually polished -- dark theme, a clean interactive truth table / rule builder, smooth bar/gauge visuals. Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real information-implies-near-dictator result being demonstrated.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-14-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-14-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
