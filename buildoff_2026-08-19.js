export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-19',
  description: '3-way subagent build-off: 3 builders each build one demo idea as a self-contained HTML file',
  phases: [
    { title: 'Build' },
  ],
}

const IDEAS = [
  {
    slug: 'nn-to-gp',
    file: 'demos/2026-08-19-nn-to-gp-a.html',
    paper: '2607.06290',
    title: 'Watch a Neural Net Become a Gaussian Process',
    pitch: `A single HTML file that instantiates hundreds of tiny random one-hidden-layer MLPs (plain JS typed-array matmuls, no backend needed) at a fixed input, and histograms their outputs live against the analytically-computed limiting Gaussian (NNGP kernel for ReLU/erf). A width slider (N=4 to N=4096) shows the empirical distribution snapping into the Gaussian as N grows, with a live-plotted empirical-distance-vs-width curve overlaid on the paper's claimed O(1/sqrt(N)) decay line so you can visually confirm the rate, not just the limit. A toggle simulates a weight-shared ('RNN/transformer-style') variant to show the architecture-agnostic claim holds too. This turns an abstract convergence theorem into something you drag a slider and watch happen. Ground every specific claim/rate in the actual abstract -- do not fabricate figures beyond what it states.`,
  },
  {
    slug: 'circuit-breaker-lab',
    file: 'demos/2026-08-19-circuit-breaker-lab-b.html',
    paper: '2309.10220',
    title: 'Circuit Breaker Lab',
    pitch: `Single-page canvas ABM: a toy limit-order-book market populated by zero-intelligence + momentum/panic traders, with a big 'fat-finger sell' or 'panic shock' button. Let the user pick a regulation mode -- none, price-limit (hard-clamp the tradable band), or circuit-breaker (halt trading for N ticks once price crosses a threshold) -- and expose the two knobs the paper says matter: limit price range and limit time range. Show live price path plus order-book depth so you can literally watch the paper's core finding: with matched range/time parameters the two mechanisms trace near-identical recovery curves, but when the price-limit's time window is shorter than typical order-cancellation time, sell orders pile up and block the floor from clearing, stalling recovery -- while switching to a circuit breaker on an 'erroneous order' shock recovers cleanly. It's a market-microstructure toy people can break in real time. Ground every claim in the actual abstract -- do not fabricate precise numeric thresholds it doesn't give.`,
  },
  {
    slug: 'mingling-physics',
    file: 'demos/2026-08-19-mingling-physics-c.html',
    paper: '2604.00652',
    title: 'Mingling Physics: Fake Social Butterflies',
    pitch: `The paper's punchline: real face-to-face contact-count distributions (the classic SocioPatterns 'some people talk to everyone, most talk to a few' heavy tail) can be reproduced by dumb 2D random walkers with simple local targeting and mixing -- no social memory, no personality, no preferential attachment needed. Build a single-file canvas demo: a crowd of dots doing biased random walks in a room (with configurable 'localized phases' -- clusters/corners people linger in), log every contact (dots that touch), and plot a live histogram of contacts-per-person next to it. Add a toggle for 'give agents memory of past contacts' vs 'pure spatial, no memory' and show the histograms come out statistically indistinguishable -- visually debunking the intuitive story that heavy-tailed social contact means some people are more 'social'. Strong whimsy hook: 'the popular kid at the party might just be standing in a good spot.' Ground the claim in the actual abstract -- do not fabricate precise numeric thresholds it doesn't give.`,
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
- Ground every specific number/claim you display in the actual paper abstract. If the abstract doesn't give a precise constant, represent the phenomenon qualitatively rather than inventing one.
- Before finishing, sanity-check your own HTML file is valid and self-contained (balanced tags, no syntax errors, DOM ids referenced in JS actually exist) -- a build that doesn't run is disqualified.

Report back in under 150 words: what you built, the file path, and confirmation you verified it's valid self-contained HTML.`
}

phase('Build')
const results = await parallel(IDEAS.map(idea => () =>
  agent(builderPrompt(idea), { label: `build-${idea.slug}`, phase: 'Build' })
))

return { results: results.map((r, i) => ({ slug: IDEAS[i].slug, report: r })) }
