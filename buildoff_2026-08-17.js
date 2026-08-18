export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-17',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'ai-contagion-network',
    file: 'demos/2026-08-17-ai-contagion-network-a.html',
    paper: '2602.02607',
    title: 'AI Contagion Network: the Implementation Tax simulator',
    pitch: `The paper's causal estimate: gen-AI-adopting banks eat a 428bps ROE hit on average from integration costs (517bps for small banks vs 129bps for large ones), while simultaneously becoming more correlated with each other via shared algorithmic tooling -- a new contagion channel where one model failure can trigger correlated shocks across the network. Build a single HTML force-directed network demo: nodes are banks sized by assets, colored by ROE (drains as you crank an "AI adoption" slider, hitting small banks harder per the paper's own size asymmetry). A second slider is "algorithmic coupling strength" -- crank it and a single injected "model failure" pulse cascades through edges, visibly taking down correlated banks in a chain reaction; toggle coupling off and the same shock stays isolated. Make the paper's "efficiency now, fragility later" thesis viscerally felt in under a minute. Ground every specific number (428bps, 517bps, 129bps) in the actual abstract -- do not fabricate figures beyond what it states.`,
  },
  {
    slug: 'rod-rave',
    file: 'demos/2026-08-17-rod-rave-b.html',
    paper: '2607.10510',
    title: 'Rod Rave — Watch Hard Rectangles Spontaneously Align',
    pitch: `The paper rigorously proves l×w hard rectangles on the 2D square lattice must form a nematic (aligned) phase once the aspect ratio k=l/w exceeds roughly 10^72 -- a real theorem, but a number so absurd it's almost a joke next to the numerically-estimated empirical threshold of k≈7. Build a single-file HTML canvas Monte Carlo simulator: local moves insert/delete/shift/rotate non-overlapping rectangles on a lattice at a chosen density, with a live nematic order-parameter S readout as a slider drags aspect ratio k from 1 to 25+. Watch the rods visibly snap into alignment around k≈7-10, then flash a callout: "the theorem only guarantees this at k≥10^72 -- you just watched it happen at k=8." That gap between rigorous proof and empirical reality is the whole hook, and it must be genuinely visible/feelable in the live simulation, not just asserted in text. Ground the exact aspect-ratio claims in the actual abstract -- do not invent precise constants it doesn't state.`,
  },
  {
    slug: 'glassy-grammar',
    file: 'demos/2026-08-17-glassy-grammar-c.html',
    paper: '2606.28103',
    title: 'Glassy Grammar: the Random Language Model phase-transition toy',
    pitch: `The paper's core result: a Random Language Model in the double-scaling limit behaves like a Random Energy Model and undergoes a hierarchy of phase transitions as "grammar temperature" drops -- first symbol correlations appear, then single-symbol distributions go non-uniform, then rule usage freezes into a glassy phase. Build a single-file HTML/JS toy implementing a toy REM (N random "rule energies", Boltzmann-weighted sampling at temperature T), driven by a temperature slider, with three linked live panels: (1) an entropy/participation-ratio curve vs T with visible kinks at each transition, (2) a vocabulary-growth curve that visibly changes shape across the transitions, (3) a "generated text" panel where symbols are drawn from the current weighted distribution -- at high T diverse gibberish, sliding toward the glassy regime it visibly crystallizes into a handful of repeated frozen rules. Let someone feel a physics-of-language phase transition instead of reading about it. Ground the transition structure/claims in the actual abstract -- do not fabricate precise numeric thresholds it doesn't give.`,
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
