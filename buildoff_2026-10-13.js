export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-13',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'capper-credibility-ladder',
    title: 'Capper Credibility Ladder',
    paper: 'arXiv:2610.02142 — Keyword Harnesses Fail Open: A Cheap Diagnostic Ladder for Tool-Use Claims in Small Language Models',
    pitch: `The paper's core claim: keyword-matching benchmarks can credit a small language model with "using a tool" when it never actually executed one -- it just emitted the right buzzwords in its output text. The authors catch a real false-positive case and fix it with a LADDER of increasingly strict diagnostics: first a cheap keyword check, then a check for whether a structured tool-call syntax actually appears, then a check for whether the claimed tool output is consistent with what the tool would really return, escalating only when a cheaper check can't resolve it. The ladder's point is that each rung is strictly harder to fake than the last, and most "tool use" claims that are empty pass rung 1 but fail by rung 2 or 3.

Build a single-file HTML toy that reskins this exact ladder as a satirical "capper credibility" checker for sports-betting tout marketing copy. Give the user a textarea pre-filled with a few toggleable sample tout posts (e.g. "Our proprietary AI model identified this 94% lock 🔒", "Sharp money is all over this side, fade the public", "Model edge +7.3% per our backtested algorithm") plus a free-text box to paste their own. Implement the ladder as REAL sequential checks against the pasted text (not a random number):
  Rung 1 (keyword check): does it contain tool/model buzzwords ("model", "algorithm", "proprietary", "backtested", "sharp money", "AI")? -- cheap, easy to pass, and the demo should show that passing rung 1 alone means almost nothing.
  Rung 2 (shows-its-work check): does it contain any concrete, falsifiable claim structure -- a specific number tied to a named quantity (e.g. a percentage next to the word "edge", "ROI", "CLV", "sample size", "units"), or is it ONLY adjectives/buzzwords with no attached number or methodology?
  Rung 3 (consistency check): if it claims a specific win-rate or ROI number, is that number even plausible for sports betting (e.g. flag anything claiming >65% win rate on spread/ML bets, or any "lock" language, as a red flag -- real edges are small) -- a real plausibility rule, not fake.
Each rung that fails stops the ladder there and assigns a credibility tier (Keyword Theater / Buzzword Soup / Plausible-but-unverified / Shows real work), visibly highlighting WHICH words/numbers in the pasted text triggered each rung's verdict (e.g. highlight "proprietary AI model" in red for rung 1, highlight the "94%" in red for rung 3). Make it visually polished -- dark theme, a literal vertical ladder graphic that lights up rung by rung as the text climbs or falls off it. Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real diagnostic-ladder methodology this is based on.`,
  },
  {
    slug: 'hot-hand-stress-test',
    title: 'Hot Hand or Fluke? The Iterated-Logarithm Stress Test',
    paper: 'arXiv:2609.14923 — Moderate deviations and laws of the iterated logarithm for geometric functionals in the sparse regime',
    pitch: `The paper's core claim: for geometric/topological functionals of sparse point processes (think: counting connected clusters as points/makes accumulate), the fluctuations around the mean obey a precise Law of the Iterated Logarithm (LIL) envelope -- the running deviation, almost surely, infinitely often gets as large as sqrt(2 * V(n) * log(log(n))) for the right variance scale V(n), and almost surely never exceeds it by more than that for large n. The point: a PURELY RANDOM, memoryless process is mathematically GUARANTEED to produce deviations that poke right up against this envelope infinitely often -- streaks and excursions that look alarming are not evidence of a hidden trend, they are a certainty of randomness itself.

Build a single-file HTML toy that makes this viscerally real using a basketball free-throw / shooting-streak framing. Simulate a sequence of n shots (n up to several thousand, fast-forward-able) where each shot is Bernoulli(p) for a TRUE fixed shooting percentage p (user-adjustable slider, default 0.5) -- this is a REAL i.i.d. Bernoulli process, not scripted streaks. Track S(n) = cumulative makes - n*p (the running deviation from expectation) and plot it live as a random walk. Overlay the REAL computed LIL envelope curve +-sqrt(2*p*(1-p)*n*log(log(n))) (compute log(log(n)) correctly, guard n small where loglog is undefined/negative by starting the overlay only once n is large enough for it to be real and positive) as dashed boundary curves on the same chart. Let the user hit "run many trials" to overlay multiple independent runs (say 20-50 faint traces) simultaneously, so they can SEE that individual runs repeatedly touch/graze the envelope but (almost) never cross it for good, while any one run, viewed in isolation during a touch point, looks exactly like a "hot streak". Add a toggle: "fair shooter (p=0.5, i.i.d.)" vs "lucky seed replay" (just re-run with a new random seed) -- both use the exact same fair process, driving home that there is no secret hot-hand mechanic, only randomness hitting its guaranteed envelope. Include a "this run's longest streak" readout and a one-line callout when the current trace grazes the envelope: "Statistically guaranteed to happen -- not evidence of a hot hand." Make it visually polished -- dark theme, smooth canvas or lightweight charting (plain canvas 2D is fine, no heavy dependency needed). Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real LIL result being demonstrated.`,
  },
  {
    slug: 'fitness-inference-arena',
    title: 'Fitness Inference Arena',
    paper: 'arXiv:2510.20500 — Fitness inference tested by in silico population genetics',
    pitch: `The paper's core claim: given an evolving population where every genotype has a hidden, GROUND-TRUTH fitness value, and outcomes unfold through selection + mutation + recombination across generations, the paper tests whether fitness parameters and the TRUE fitness ranking can actually be recovered from only the observed outcome data (who reproduced/survived each generation) -- using simulated ("in silico") populations where the real answer is known for scoring. The gut-punch finding: recovery accuracy (e.g. Spearman correlation between inferred and true ranking) degrades well before the data looks obviously noisy, and even near-optimal inference methods can't fully recover the true ranking under realistic mutation/drift rates.

Build a single-file HTML simulator that reskins this exact setup as a fantasy-sports/poker power-ranking arena. Create N "players" (e.g. N=12), each secretly assigned a HIDDEN true skill value (normally distributed, fixed at the start of a run and shown only on the reveal screen). Simulate "seasons" (generations): each season, players are paired up in matches, and match outcomes are REAL stochastic draws whose win probability is a logistic function of the skill difference between the two players (not a coin flip divorced from skill, and not a deterministic always-better-player-wins rule either) -- this is the actual signal-plus-noise structure the paper's inference problem is built on. Add a "mutation/drift" slider that injects per-season random jitter into the true skill values between seasons (so the ground truth itself can drift, mirroring the paper's mutation term), and a "recombination noise" slider controlling match outcome randomness beyond pure skill. After the user plays through several seasons (a fast-forward button advancing season by season, accumulating a visible win/loss record table), show a reveal screen with THREE rankings side by side: (1) the user's own manual guess (built by letting them drag-and-drop or rank players before the reveal, based only on the win/loss table they watched), (2) a naive win-rate ranking (just sort by win percentage -- a real computation off the simulated match log), (3) a maximum-likelihood-flavored fitness estimator (a real iterative method, e.g. Bradley-Terry / Elo-style iterative fitting on the actual match log, not a fake shortcut), each scored by REAL Spearman correlation against the hidden ground-truth ranking. Let the user crank the mutation-rate slider and rerun to watch even the best (method 3) estimator's correlation collapse well before the match log "looks" especially random. Make it visually polished -- dark theme, a clean standings table, a simple bar or dot chart comparing the three rankings' Spearman scores. Include a short on-page blurb crediting the paper (title + arXiv id) and explaining the real in-silico fitness-inference result being demonstrated.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}

${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-13-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-13-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

Builder reports for context:
${builds.map((b, i) => `--- ${IDEAS[i].slug} ---\n${b}`).join('\n\n')}

Return via the schema.`,
  { schema: JUDGE_SCHEMA, label: 'judge', phase: 'Judge' }
)

log(`Winner: ${judged.winner_slug} — ${judged.winner_reason}`)
return { ideas: IDEAS, builds, judged }
