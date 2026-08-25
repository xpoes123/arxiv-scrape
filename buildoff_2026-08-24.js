export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-24',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'memory-playground',
    title: 'Memory Playground: When Sticky Environments Make Active Matter Freeze',
    paper: 'arXiv:2605.29162 — Passive memory reshapes active persistence',
    pitch: `The paper's actual result: self-propelled particles in a viscoelastic (memory-bearing) medium show two regimes as you tune the memory relaxation timescale relative to the particle's self-propulsion persistence time. At INTERMEDIATE memory (comparable to persistence time), the delayed drag response acts like effective anti-persistence -- particles get "braked" just as they try to commit to a direction, which suppresses clustering and produces a long-lived metastable gas with slow nucleation. At LONG memory, early-time friction drops (the medium hasn't "caught up" yet), effectively boosting propulsion and restoring normal MIPS-like phase separation. Build a single-file canvas demo: N self-propelled disks, each carrying an exponential memory kernel that convolves its velocity history into a delayed drag force (implement with a simple leaky-integrator recurrence, no real convolution needed -- O(1) per particle per step). One slider controls memory timescale tau_m relative to persistence time tau_p. Sweep the slider live and watch the population go: normal clumping (short tau_m) -> a scattered, slow-nucleating haze (tau_m ~ tau_p, the paper's headline surprising regime) -> big clumps again (tau_m >> tau_p). Color particles by local density so the metastable regime is visually obvious as "it just won't clump no matter how long you wait." This is a strong feel-the-paper toy because the nonmonotonic clustering-vs-memory curve is the whole finding.`,
  },
  {
    slug: 'dla-grower',
    title: 'DLA Grower: Watch the Fractal Amplitude Lock to the Dimension',
    paper: 'arXiv:2607.02216 — Exact amplitude relations for diffusion-limited aggregation',
    pitch: `Build a canvas DLA simulator (classic: launch random walkers from a circle, let them stick on contact to a growing seed cluster) and overlay a live-updating readout panel showing the cluster's fractal dimension (box-counting on the fly) next to the third moment of the harmonic measure's multifractal spectrum (approximated via the local growth-probability distribution around the cluster boundary -- walker-hit density serves as a harmonic-measure proxy). The paper's actual claim is that these two numbers are exactly, universally linked via the Hastings-Levitov formulation, not just loosely correlated as previously known -- so the demo's hook is watching the two live numbers visibly track each other as the cluster grows from 100 to 50,000 particles, across circular vs. a toggleable "cylindrical/periodic" boundary mode (both geometries the paper covers). It's the most visually iconic stat-mech pattern (looks like lightning/coral/frost) paired with a number that actually means something instead of just being decoration.`,
  },
  {
    slug: 'variance-is-a-loan',
    title: 'Variance Is a Loan: Population Bet-Hedging Meets the Kelly Criterion',
    paper: 'arXiv:2511.01905 — The impact of nonheritable variation in division rates on population growth across environments',
    pitch: `The paper's math: population growth rate is the dominant eigenvalue of a linear model with phenotypically-structured (non-heritable) division-rate variance, and that eigenvalue responds NONLINEARLY to variance -- in a good environment, variance in individual division rates strictly drags the growth rate down below the mean-rate case (Jensen's-gap style loss), while in a stressed/declining environment the SAME variance slows the decline (some lucky sub-population divides fast enough to rescue the group). That's exactly the shape of the Kelly-criterion tradeoff in compounding bankrolls (geometric vs arithmetic mean, variance drag) -- a direct math-to-poker/trading bridge worth making explicit. Build a demo with two panels side by side, driven by literally the same eigenvalue formula: left panel is "cells", right panel is "bankroll". One slider for environment harshness (nutrient/mean growth rate, negative to positive) and one for variance (heterogeneity in individual rates / bet size variance). Plot the realized long-run growth-rate curve vs variance for a few environment settings, and let the user drag a marker along it to see the crossover point where more variance flips from "kills you" to "saves you" -- the paper's literal headline claim, made tactile. Cite the Chlamydomonas mutation-accumulation validation as the real-world grounding in a footnote/tooltip.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-24-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run \`openssl dgst -sha384 -binary | openssl base64 -A\` to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-24-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
