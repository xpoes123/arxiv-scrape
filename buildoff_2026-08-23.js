export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-23',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'baby-entropy-engine',
    title: 'Baby Entropy Engine',
    paper: 'arXiv:2603.29312 — A Preliminary Theory of Infantile Dynamics',
    pitch: `Faithfully build the paper's own toy model (an April Fools' physics paper with real, simple math): a canvas split into an "organized zone" and a "play zone," with toy-particles doing biased diffusion between them. An entropy-production meter ticks up per the paper's proven result that entropy production is nonnegative and the long-run state is play-area-dominated. A "Maxwell-demon parent" button lets the user manually sort toys back, but diffusion always outpaces them at steady state -- you can feel the second law losing to a toddler in real time. A "novelty spike" toggle reproduces the paper's other finding: a curiosity/dopamine burst reorganizes things briefly better than punishment does. Whimsical, shareable, joke-that's-secretly-correct-physics.`,
  },
  {
    slug: 'hot-hand-erw',
    title: 'Hot Hand: The Elephant Random Walk Simulator',
    paper: 'arXiv:2607.15125v1 — Asymptotics for the Laplace transform of the Elephant Random Walk via Schwarz-Christoffel mappings',
    pitch: `The Elephant Random Walk (ERW) is a random walk that, at each step, either repeats a uniformly-chosen past step (w.p. its memory parameter p) or does something new. The classical result is a sharp phase transition at p=3/4: diffusive (n^{1/2}) below it, marginally diffusive at it, and superdiffusive (n^{2p-1}) above it; this paper sharpens the asymptotics of the walk's Laplace transform in that superdiffusive regime. Build a single-page canvas demo: a slider for p from 0 to 1, live-drawing ~200 simultaneous ERW trajectories (color-coded), with a running log-log plot of E[|S_n|] vs n whose fitted slope updates in real time and visibly locks onto 2p-1 once you cross p=3/4 -- the user literally watches the phase transition happen. Frame it as a "hot hand" toy: relabel steps as made/missed shots and let the user feel how a shooter with p>0.75 "streak memory" produces genuinely superdiffusive scoring runs, versus p<0.75 washing out to normal variance -- a fun, rigorous toy for hot-hand debates.`,
  },
  {
    slug: 'poincare-coreset',
    title: 'Poincaré Coreset Playground',
    paper: 'arXiv:2606.16061v1 — Coresets for Continuous k-Center in Hyperbolic Space',
    pitch: `A single-page canvas demo of the Poincaré disk: scatter a few hundred draggable points, run greedy farthest-point k-center clustering live, then toggle "coreset mode" which highlights the tiny (1/eps)^O(kD)-size subset the paper proves is sufficient to guarantee a (1+eps)-approximation for the FULL point set. A side-by-side readout shows the k-center radius computed on the coreset vs. the full set converging as eps shrinks, and a counter shows coreset size staying flat while the user keeps adding hundreds more background points -- visually proving the paper's headline claim that coreset size is independent of n. An optional second panel shows the same experiment in flat Euclidean space so people feel *why* hyperbolic volume growth (the paper's core obstacle) makes this harder and the shell-cone decomposition trick necessary.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-23-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run \`openssl dgst -sha384 -binary | openssl base64 -A\` to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-23-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
