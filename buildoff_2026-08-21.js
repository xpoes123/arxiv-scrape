export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-21',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'city-growth-illusion',
    title: 'The City Growth Illusion',
    paper: 'arXiv:2603.30021 — On the Meaning of Urban Scaling',
    pitch: `Marquis & Barthelemy's core claim: the famous urban-scaling exponents (GDP, crime, patents ~ population^beta) measured by comparing many cities at one snapshot in time can be a statistical artifact of city heterogeneity, not evidence about how any individual city actually grows -- 'apparent sublinear or superlinear scaling can arise even when individual cities follow simpler dynamics.' Build a single-page sim: spawn a few hundred synthetic cities, each growing by an identical simple rule (e.g. linear/random growth, no built-in scaling law), stagger their founding dates and growth-rate draws, then take a cross-sectional snapshot and fit a log-log regression live -- watch a convincing 'superlinear' or 'sublinear' exponent pop out of the fit line even though you coded zero nonlinearity into any single city. Sliders for heterogeneity (founding-date spread, growth-rate variance) let you dial the illusion up and down, and a toggle overlays the *true* per-city growth curves next to the misleading aggregate fit. This is the whole paper's argument turned into something you can feel in 20 seconds.`,
  },
  {
    slug: 'wire-plane-sketchpad',
    title: 'Wire-Plane Sketchpad: Feel the Two-Thirds Power Law',
    paper: 'arXiv:2603.03337 — Does the motor cortex draw on a wire plane?',
    pitch: `Draw any curve on canvas with your mouse. A dot then retraces it at the velocity predicted by the two-thirds power law (v proportional to curvature^-1/3) versus a control dot moving at constant speed -- the power-law dot visibly slows through tight curls and speeds through gentle arcs, matching real human handwriting/drawing kinematics that the paper is trying to geometrically ground. The killer feature: a 'warp' mode where you drag a few control handles to smoothly deform the whole canvas (a diffeomorphism of the plane, i.e. literally the 'wire plane' construction), and the power-law dot's speed profile is recomputed under the warped equi-affine metric and still tracks the same relative slow/fast pattern -- a direct, feelable demonstration of the paper's core claim that the law is a fully covariant 3-tensor invariant under arbitrary smooth reparametrization, not an artifact of a particular coordinate patch.`,
  },
  {
    slug: 'curvature-trap',
    title: 'Curvature Trap: Chiral Particles vs. the Wall',
    paper: 'arXiv:2607.01948 — Curvature-driven wall accumulation in chiral active particles',
    pitch: `The paper's actual result: non-self-propelled but spinning (chiral) particles bounce around uniformly in a straight-walled channel, but the same particles pile up against the boundary once the container is curved (circular confinement) -- curvature alone, not activity, drives the accumulation via chirality-induced edge currents. Build a single HTML canvas demo: a box of spinning discs (each has a fixed rotation direction, so on wall contact it gets a tangential kick, like a rolling gear against a rail) inside a container whose wall curvature you drag from flat to fully circular with a slider. Live density heatmap along the boundary shows uniform -> accumulated in real time as curvature increases, plus a plotted radial density profile so you can literally see the paper's central claim happen under your cursor. No physics engine needed -- it's just point particles + wall-tangent friction/reflection rules, all doable in vanilla JS/canvas.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-21-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run \`openssl dgst -sha384 -binary | openssl base64 -A\` to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-21-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
