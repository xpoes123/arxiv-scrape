export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-25',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'loop-catcher',
    title: 'Loop-Catcher Playground: watch a Brownian trace get loop-erased into an SLE curve',
    paper: 'arXiv:2607.18070 — The Brownian loop-catcher',
    pitch: `The paper's actual result: a "loop-catcher" is a random closed subset of a planar Brownian trace that interpolates between the continuum loop-erased random walk (LERW) and the full Brownian trace; adding back an independent Brownian loop soup to the loop-catcher recovers the original trace exactly, but only when the loop soup's central charge is in [-2,0] (it provably fails below -2); and the loop-catcher's outer boundary is an SLE_kappa-type curve for every kappa in [2, 8/3]. Build a single-page canvas demo: simulate a discretized 2D Brownian walk, run the classic stack-based loop-erasure algorithm on it live, and give the user a slider for "loop soup intensity" (central charge) that animates between the bare LERW skeleton and the full fractal Brownian trace by re-adding random loops sampled near the walk. A second overlay traces the outer boundary and lets you flip a kappa slider in [2, 8/3] to redraw it as a synthetic SLE-like curve (using the standard SLE trace simulation via Loewner's equation with driving function sqrt(kappa)*Brownian motion), so the user visually feels "the boundary of a random blob is itself a canonical fractal curve." No backend needed -- just canvas + a small RK4 Loewner-equation integrator, both classic self-contained JS.`,
  },
  {
    slug: 'granuloma-sandbox',
    title: 'Granuloma Sandbox: Latent vs. Active TB',
    paper: 'arXiv:2602.24258 — A model of tuberculosis progression using CompuCell3D',
    pitch: `A single-page cellular-automaton/agent-based sim (canvas, diffusion field for chemokines, simple agents for macrophages/bacteria) that reenacts the paper's actual finding: TB outcome is governed by the *spatial organization* of the immune response, not just cell counts. Sliders for cell adhesion, persistence of movement, and chemotactic strength let the user watch a granuloma either seal off the infection (latent TB) or rupture and let bacteria escape (active disease) in real time. Match the paper's robustness result by making the sim visibly fragile to adhesion/persistence changes but stable under chemotaxis changes -- so the demo isn't just pretty, it reproduces the actual sensitivity analysis.`,
  },
  {
    slug: 'bracket-vacuum',
    title: 'Bracket Vacuum — the Fermionic Nullity Playground',
    paper: 'arXiv:2605.27142 — Dyck language and fermionic second quantization: I. Theory',
    pitch: `The paper's real result is startling: whether a fermionic expectation value <vac| a-dagger a-dagger a a ... |vac> vanishes reduces to a purely syntactic check on a Dyck-bracket string (matching + a "depth" statistic), no algebra required. Build a single-page toy: you assemble a string of creation/annihilation operators as colored open/close brackets (like building a LEGO string), the app animates the bracket-matching/depth reduction live, and declares NULL or NONZERO the same way the paper's syntactic criteria would. Add a "guess before it reveals" quiz mode so people feel the punchline: quantum cancellation is literally balanced-parentheses checking. This is the single coolest "wow, that's just CS 101" moment in the batch.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-25-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-25-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
