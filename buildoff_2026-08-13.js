export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-13',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'nursery-entropy',
    file: 'demos/2026-08-13-nursery-entropy-a.html',
    paper: '2603.29312',
    title: 'The Nursery Entropy Simulator (Maxwell\'s-Demon Playroom)',
    pitch: `A deliberately deadpan interactive toy: particles ("toys") random-walk-diffuse from a shelf region into a play-area region while a live entropy meter (Shannon/Boltzmann over the two-region occupancy) climbs monotonically, visualizing the paper's claim that entropy production is nonnegative and long-time behavior is typically play-area dominated. A "Parent Demon" button lets you manually drag toys back to the shelf for a few seconds -- a transient local-ordering episode -- before diffusion resumes and entropy keeps climbing, exactly the "volatile Maxwell's demon" the paper describes. A second toggle compares "novelty" mode (toys periodically wiggle/light up) vs. "reinforcement" mode, showing novelty remixes the room faster, matching the paper's short-term finding. Single HTML canvas, no backend: a 2D particle diffusion sim, a live entropy readout plotted over time, and the demon-intervention + novelty/reinforcement controls.`,
  },
  {
    slug: 'vortex-playground',
    file: 'demos/2026-08-13-vortex-playground-b.html',
    paper: '2607.08435',
    title: 'Vortex Playground: Steer the Swarm, Watch it Forget',
    pitch: `Canvas N-body toy with a dropdown for the interaction kernel (Coulomb 1/r, Riesz, Yukawa -- the exact singular kernels the paper treats). Controllability mode: you drag a small highlighted subset of "control" particles and watch the whole swarm -- despite chaotic, singular pairwise interactions -- get steered into an arbitrary target formation (spell a word, draw a shape) in finite time, dramatizing the paper's "global exact / solid controllability" result. Mixing mode: inject noise on the controls and watch a live KL-divergence-to-equilibrium meter tick toward zero as the swarm forgets its initial configuration and converges to the same statistically stationary cloud regardless of where it started, illustrating the proven ergodicity and exponential mixing. Kernel singularities handled with standard N-body softening at short range -- fully client-side, no backend.`,
  },
  {
    slug: 'outbreak-roulette',
    file: 'demos/2026-08-13-outbreak-roulette-c.html',
    paper: '2511.02882',
    title: 'Outbreak Roulette: Noise-Induced Epidemics',
    pitch: `The paper's core result is genuinely counterintuitive: perturb an SVEIS (Susceptible-Vaccinated-Exposed-Infected-Susceptible) epidemic model with Black-Karasinski noise (the mean-reverting log-normal process banks use for interest rates) and prove that above a stochastic threshold Rs0>1 the disease has a stationary distribution (persists forever), below Re0<1 it dies out exponentially fast -- and crucially, random fluctuations can facilitate disease outbreak, i.e. noise can push a disease that would go extinct deterministically into persisting. Build a single HTML/canvas page that runs the SVEIS SDE via Euler-Maruyama in real time: sliders for R0, vaccination rate, and Black-Karasinski volatility/mean-reversion speed. Two panels run side by side -- deterministic ODE vs. noisy SDE with identical R0<1 -- so the user watches the "safe" deterministic line decay to zero while the noisy twin randomly outbreaks and stabilizes into a stationary cloud. A live histogram builds the stationary distribution in real time.`,
  },
]

function builderPrompt(idea) {
  return `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the real arXiv paper arxiv.org/abs/${idea.paper} -- fetch the abstract (and paper page if useful) first to ground the actual numbers/claims, then build.

Idea: ${idea.title}
${idea.pitch}

Requirements:
- Write the ENTIRE demo as ONE self-contained HTML file at ${idea.file} (relative to /home/david/code/arxiv-scrape). No build step, no backend. CDN <script> tags (three.js, d3, Chart.js, p5.js, etc.) are encouraged for richer visuals.
- Real interactivity (sliders/drag/toggle/keyboard) that changes what's rendered, not a static page.
- Good visual polish: real layout/typography/color, not browser defaults. Dark-mode friendly.
- A short in-page panel explaining the paper's real result in plain language, with the arXiv id linked.
- Ground every claimed number/formula in what the actual abstract says -- do not fabricate constants.
- Before returning, verify the file is valid, self-contained HTML that actually renders and runs (open/read it back, check for JS errors in the logic, check all tags are balanced). A demo that doesn't run is disqualified -- this matters more than extra polish.

Return a short summary: what you built, which real paper numbers you grounded it in, and confirmation you verified it runs.`
}

phase('Build')
const builds = await parallel(IDEAS.map(idea => () =>
  agent(builderPrompt(idea), { label: `build-${idea.slug}`, phase: 'Build' })
))

phase('Judge')
const judgePrompt = `You are the judge for a 3-way subagent build-off from the arxiv-scrape nightly scout project at /home/david/code/arxiv-scrape. Three builder subagents each built a self-contained interactive HTML demo grounded in a real arXiv paper. Open/read all three, verify each is valid self-contained HTML that would actually run (balanced tags, no obvious JS syntax errors, CDN references resolve, DOM ids referenced in JS actually exist), cross-check each demo's claimed numbers/formulas against the real arXiv paper's abstract (fetch https://arxiv.org/abs/<id> for each), then score wow-factor, interactivity, polish, and fidelity to the paper (1-10 each, sum out of 40). Disqualify any that don't run. Pick the single coolest one that runs.

The three files:
${IDEAS.map((idea, i) => `- ${String.fromCharCode(65 + i)}: ${idea.file} -- "${idea.title}", paper arXiv:${idea.paper}`).join('\n')}

Report back in plain text (under 400 words): for each demo, whether it runs + scores + one-sentence fidelity note; the winner (letter + slug) with 1-2 sentence justification; the winning file's exact path. Read-only pass, do not modify any files.`

const judgeVerdict = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { builds, judgeVerdict }
