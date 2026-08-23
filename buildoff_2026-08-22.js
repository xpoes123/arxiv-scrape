export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-22',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'bullwhip-sandbox',
    title: 'Bullwhip Sandbox',
    paper: 'arXiv:2607.17491v3 — Supply Chain Networks',
    pitch: `The paper's core claim is that the bullwhip effect (demand-variance amplification moving upstream) is an unavoidable topological property of coordinated logistics networks, not just a byproduct of noisy forecasting or poor info-sharing -- and they validate this on real oil-trade data around a Strait-of-Hormuz-style shock. Build a single-file canvas sim: draw a multi-echelon network (retailer -> distributor -> wholesaler -> manufacturer, with a few alternate topologies: chain, tree, small-world), give each node a simple order-up-to inventory policy driven only by local demand it observes (moving-average forecast), then feed in a base demand stream. Live sparklines per echelon show order variance amplifying upstream purely from the network structure, with zero noise added by the user. Let the user click a node to inject a capacity shock ('Strait of Hormuz') and watch the cascading stockout/reallocation ripple through the graph in real time, with an on-screen readout of variance ratio per hop to make the amplification visually and numerically undeniable. This is essentially a souped-up 'Beer Game' that makes the paper's structural (not behavioral) claim about bullwhip legible in 30 seconds.`,
  },
  {
    slug: 'impossible-memory',
    title: 'Impossible Memory: a Bilayer Ising Ratchet You Can Poke',
    paper: 'arXiv:2607.01231 — Brownian ratchets and pumps universally simulate many-body active dynamics',
    pitch: `The paper's punchline demo is a two-layer ferromagnetic Ising ratchet: layer A sits on a hot bath, layer B on a cold bath, and the steady-state heat current between them stabilizes a magnetized 'memory' state even under a symmetry-breaking field -- something the authors explicitly say is 'impossible in equilibrium.' Build a single HTML canvas with two overlaid NxN spin grids (Glauber/Metropolis updates), sliders for T_hot, T_cold, interlayer coupling J, and an external field h. Run equilibrium mode (both layers same T) side-by-side with ratchet mode (split T) so the user watches the equilibrium grid get erased by the field while the ratchet grid stubbornly holds its magnetization -- the paper's actual result, felt in real time. A readout plot of net magnetization vs. time for both modes makes the 'nonequilibrium beats equilibrium' claim undeniable.`,
  },
  {
    slug: 'urban-scaling-illusion',
    title: 'The Urban Scaling Illusion: one line, zero real cities',
    paper: 'arXiv:2603.30021 — On the Meaning of Urban Scaling',
    pitch: `A Simpson's-paradox-style scatter toy. Generate ~150 synthetic 'cities' each with its own noisy, roughly-linear growth trajectory (population vs. some output like patents or GDP) over decades. Plot all cities' snapshots at one moment -- a clean superlinear power law pops out with an eye-catching fitted exponent (the classic urban-scaling headline number). Then hit 'play' and watch each city's actual trajectory animate as a thin trail; almost none of them follow the fitted cross-sectional slope -- most look locally linear or erratic. Click any city to isolate its real path against the aggregate curve. This is a direct, visceral demonstration of the paper's stated result: 'an exponent measured by comparing many cities at one date does not, in general, describe the trajectory of any individual city.' Great single-chart 'wait, that's not real' shareable moment -- this is basically Simpson's paradox for city science.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-22-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run \`openssl dgst -sha384 -binary | openssl base64 -A\` to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-22-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
