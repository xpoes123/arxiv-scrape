export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-18',
  description: '3-way subagent build-off: 3 builders each build one demo idea as a self-contained HTML file',
  phases: [
    { title: 'Build' },
  ],
}

const IDEAS = [
  {
    slug: 'prompt-poison-playground',
    file: 'demos/2026-08-18-prompt-poison-playground-a.html',
    paper: '2607.21951',
    title: 'Prompt-Poison Playground: gaming an AI shopping recommender',
    pitch: `An interactive single-page toy that simulates (client-side, no real LLM calls needed for the core loop) what SIREN actually demonstrated: that editing the CONTENT of one already-retrieved webpage -- while holding the rest of the retrieved context fixed -- can flip an LLM recommender's #1 pick, and that declarative/seeded-list framings beat directive ('buy me!') injections. Set up a fake 3-5 product comparison page (RAG context) with one editable 'your listing' textarea. Give the user a palette of the paper's actual technique categories (e.g. declarative ranking claims like 'Consensus: reviewers rank this #1', seeded competitor lists, review-injection, structured-data spoofing) as draggable snippet buttons they can insert into their listing. A simple, transparent scoring function (documented on-screen, weighted keyword/framing heuristics standing in for the LLM judge, calibrated loosely to the paper's finding that declarative+seeded beats directive) recomputes live and animates the ranking reshuffling, with a probability meter modeled on the paper's reported 0.805 mean reproduction rate once a payload 'reaches rank 1.' Ground every specific claim/number in the actual abstract -- do not fabricate figures beyond what it states.`,
  },
  {
    slug: 'defect-drift-playground',
    file: 'demos/2026-08-18-defect-drift-playground-b.html',
    paper: '2605.25996',
    title: 'Defect Drift Playground: Spiral vs Fiber Waves',
    pitch: `The paper shows that in pulsating (oscillating, non-self-propelled) active matter, mechanochemical coupling between local pulsation and repulsion breaks spatial/time-reversal symmetry, making topological defects drift -- with a parameter controlling a crossover from slow spiral waves to fast fiber-like waves, explicitly analogized to cardiac arrhythmia. Build an HTML canvas demo running a local phase-oscillator lattice (simple coupled-oscillator / excitable-medium update rule, plain 2D canvas at 60fps is fine) seeded with a rotating defect. An 'asymmetry' slider tunes the coupling term; as you increase it, the defect core should visibly detach from its pinned spiral center and start drifting across the grid, and the wave pattern morphs from smooth spirals into thin fast-moving fiber-like fronts -- a direct, tactile illustration of the paper's central claim, framed with the cardiac-arrhythmia hook for shareability. Ground the symmetry-breaking / drift claim in the actual abstract -- do not invent precise numeric thresholds it doesn't give.`,
  },
  {
    slug: 'trend-tide',
    file: 'demos/2026-08-18-trend-tide-c.html',
    paper: '2603.29593',
    title: 'Trend-Tide: Watch Mean-Reversion Go Extinct',
    pitch: `A single-page canvas sim that recreates the paper's core finding: seed a population of toy agents split across trader archetypes (trend-followers, mean-reverters, noise traders, fundamentalists, momentum-chasers), run a simplified order-flow price formation loop, and animate each agent's wealth as a colored dot growing/shrinking. Sliders control friction and a 'basic income'-equivalent parameter (the paper's frictionless+UBI-style assumption is what lets trend-following dominate evolutionarily). Watch mean-reversion wealth bars visibly collapse toward zero over simulated time while trend-following wealth share climbs toward saturation -- the 'structurally fragile vs. evolutionarily dominant' result from the abstract, felt in real time instead of read as a claim. Add a toggle to reintroduce transaction costs and watch the result partially reverse. Ground the archetype dynamics and evolutionary-dominance claim in the actual abstract -- do not fabricate precise numeric thresholds it doesn't give.`,
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
