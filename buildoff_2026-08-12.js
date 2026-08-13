export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-12',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'cone-of-no-escape',
    file: 'demos/2026-08-12-cone-of-no-escape-a.html',
    paper: '2607.07589',
    title: 'Cone of No Escape',
    pitch: `An interactive competitive-growth simulator that literally shows the paper's theorem: place a "you" seed at the origin of a grid and an "opponent" occupying an infinite wedge of angle theta pointed at you; both spread to neighboring cells with random passage times (standard first-passage percolation rule). Drag a slider to change theta and watch your territory escape to infinity when theta < pi/2 and get swallowed/trapped when theta >= pi/2 -- the exact phase transition proved using Busemann functions. Single HTML canvas, no backend: a grid, an exponential-clock priority queue (or a discretized Eden-growth approximation), and a theta slider. Overlay a live counter of "your" cell count vs time and a big flashing SURVIVES / SWALLOWED verdict once growth stalls or explodes.`,
  },
  {
    slug: 'tumble-or-steer',
    file: 'demos/2026-08-12-tumble-or-steer-b.html',
    paper: '2602.23324',
    title: 'Tumble or Steer: The Discrete-Navigation Phase Explorer',
    pitch: `The paper frames chemotactic navigation as an optimization (maximize up-gradient speed subject to a bits-per-second sensing budget) and finds the optimal strategy bifurcates discretely: at very low info, all-or-nothing reversals (run-and-tumble) win; at medium info, a fixed small number of discrete turn angles beats everything; only at high info does smooth continuous steering become optimal. Build a single-page canvas demo: an agent (or small population of agents racing head-to-head) climbs a 2D chemical gradient field, and a slider sets the info budget in bits/step. Underneath, precompute/grid-search the expected up-gradient speed for each candidate strategy (reversal-only, N-angle tumble for N=2..6, continuous) at that info level using the paper's info-vs-speed tradeoff, highlight the winning strategy, and actually animate agents using it. Dragging the slider visibly flips the population from smooth arcs to jerky tumbles to binary reversals -- you feel the bifurcation the paper proves analytically.`,
  },
  {
    slug: 'diversity-illusion',
    file: 'demos/2026-08-12-diversity-illusion-c.html',
    paper: '2603.26896',
    title: 'The Diversity Illusion Simulator',
    pitch: `A shareable "guess the real number" toy that dramatizes the paper's actual mechanism. Three sliders -- local interethnic contact, perceived national news coverage of minorities, social media usage -- feed a live gauge comparing "your perceived diversity" vs "actual Census diversity" at neighborhood, city, and national scale. Wired directly to the paper's findings: overestimation probability rises monotonically from local to national scale; at the local level contact is the dominant driver (more contact = higher local overestimation for white respondents); at the national level perceived media exposure takes over as the dominant driver; traditional news consumption pulls the estimate down while social-media use pushes it up. Ends on the paper's actual punchline as a shareable card: the "illusion of diversity" effect, and how it can quietly erode support for equity policy by making people think diversity goals are already met.`,
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
