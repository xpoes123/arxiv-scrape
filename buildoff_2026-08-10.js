export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-10',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'sparse-brain',
    file: 'demos/2026-08-10-sparse-brain-a.html',
    paper: '2607.27591',
    title: 'Sparse Brain',
    pitch: `Prox's central bet is that you don't need the exact FFN intermediate values to know which channels matter -- the magnitude ranking of a cheap approximate intermediate state is enough to build the sparsity mask, giving up to 1.99x decoding speedup at 70% sparsity with near-zero quality loss across ten LLMs. Build a single-HTML canvas demo: simulate a toy FFN layer (e.g. 1024-dim intermediate, random-but-structured Gaussian activations per token), render the activation magnitudes as a live bar spectrum, and give the user a sparsity slider. As they drag it, show three things simultaneously in real time: (1) the magnitude-ranked top-k mask lighting up which channels survive, (2) the cosine similarity / reconstruction error between the sparse output and the true dense output (staying tiny even at 70% cut, mirroring the paper's claim), and (3) a simulated FLOPs/latency gauge dropping toward the paper's 1.99x number. Lets someone literally feel why "approximate ranking is enough" works -- the error curve staying flat while the speedup climbs is the whole paper in one interaction. The reconstruction-error and speedup calculations must be real computations on the simulated activations, not canned curves.`,
  },
  {
    slug: 'flocking-edge-modes',
    file: 'demos/2026-08-10-flocking-edge-modes-b.html',
    paper: '2606.24926',
    title: 'Flocking Edge Modes',
    pitch: `The paper shows a minimal frustrated Vicsek-Kuramoto active-particle model (self-propelled particles + a Sakaguchi phase lag) spontaneously produces chiral edge transport matching a non-Hermitian Chern bulk-boundary correspondence -- topological physics emerging from local flocking rules, no quantum mechanics required. Build a single-file canvas/WebGL sim: a few thousand self-propelled particles with alignment + phase coupling, a slider for the frustration/phase-lag parameter, and a hard boundary (disk or box). As you tune frustration past the topological transition, particles at the edge switch from disordered wandering to a one-directional chiral current sweeping the boundary -- literally watching bulk topology paint an edge current in real time. The particle update loop (alignment + phase coupling + boundary collision) must be a real physics simulation running live, not a pre-baked animation.`,
  },
  {
    slug: 'chase-random-graph',
    file: 'demos/2026-08-10-chase-random-graph-c.html',
    paper: '2607.04002',
    title: 'Chase on a Random Graph',
    pitch: `Single-page canvas toy: generate a random graph (pick from a Gilbert graph, a Delaunay/Gabriel triangulation over random points, or a preferential-attachment graph with heavy-tailed degrees) and drop two independent random walkers (a "pursuer" and an "evader") on it. A live counter tracks collisions. Switch graph type and you visually feel the paper's actual dichotomy: on bounded/moderate-degree graphs (Gilbert, Delaunay, Gabriel) the walkers collide infinitely often almost surely (recurrent regime); on heavy-tailed-degree graphs the Green-function integrability condition kicks in and collisions stop forever after some point (transient regime) -- the pursuer just loses them permanently. A bonus "voter model" mode recolors nodes on every collision, showing the paper's stated application (characterizing stationary measures of the voter model via these collision properties) as a spreading-consensus animation. The graph generation and random-walk stepping must be real live simulation, not pre-recorded.`,
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
