export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-08',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'phase-sync',
    file: 'demos/2026-08-08-phase-sync-a.html',
    paper: '2607.06762',
    title: 'Phase Sync Playground: Watch Spectral Recovery Hit Its Threshold',
    pitch: `The paper reduces power-grid voltage-angle estimation to phase synchronization and proves a spectral method (top eigenvector of a noisy phase-connection graph) recovers the true angles to first order below a threshold set by measurement noise normalized against the classical "observability margin" -- with exact recovery and a zero-duality-gap certificate in the noiseless case. Build a canvas/D3 demo: draw a grid graph (nodes = buses, edges = angle-difference measurements), let the user drag a noise slider and an edge-density (observability margin) slider. Live-recompute the top eigenvector of the Hermitian connection matrix each frame (small dense eigensolve, trivial in JS for <100 nodes), overlay recovered angles as arrows next to ground truth, and show a "certified / not certified" badge flipping exactly at the theoretical threshold curve, plus the duality-gap number ticking toward zero as noise drops. Make an otherwise dry convex-optimization proof into a literal watch-it-snap-into-focus toy. This must be a REAL eigenvector computation on a REAL complex/Hermitian matrix built from the graph and noise model -- no faked animation.`,
  },
  {
    slug: 'insurability-cliff',
    file: 'demos/2026-08-08-insurability-cliff-b.html',
    paper: '2607.13230',
    title: 'The Insurability Cliff: Price Your AI Agent',
    pitch: `The paper defines a risk-state for an agentic-AI deployment (autonomy, operational authority, permission exposure, governance maturity, dependency concentration), maps it to event probabilities/premiums/deductibles, and proves a monotone deterioration of insurance feasibility as exposure rises, with governance-certification thresholds. Build a single page with five sliders (autonomy, operational authority, permission exposure, governance maturity, dependency concentration) feeding a real implementation of the paper's risk-state-to-premium mapping (loss severity x event probability, minus a governance discount, checked against a participation/profitability constraint). A live gauge shows computed premium + deductible, and as the user cranks permission exposure or autonomy past the governance-maturity line, the panel should visibly flip into an "infeasible / uninsurable" red zone -- showing the paper's proven monotone feasibility collapse as a cliff you can walk off. Topical for anyone deploying agentic AI right now.`,
  },
  {
    slug: 'sweet-spot',
    file: 'demos/2026-08-08-sweet-spot-c.html',
    paper: '2605.19795',
    title: 'The Sweet Spot: Optimal Complexity in Smart Materials',
    pitch: `The paper's core finding is a non-monotonic relationship between a material's internal complexity (N) and how much stimulus-response information it can transmit (I3), with an optimal N* set by stimulus energy and thermal noise, plus a striking efficiency gap: synthetic soft matter operates 10^18-10^20x above the Landauer-Bérut thermodynamic floor versus only 10^5-10^8x for evolved biology. Build a two-panel interactive: panel 1 plots I3(N) live as the user drags sliders for stimulus energy and thermal noise, with a marker hunting the shifting peak N* in real time (the "too simple to respond / too complex to stay coherent" curve visibly bending); panel 2 is a log-scale benchmarking plane (efficiency vs Landauer floor) with draggable/placed points for "synthetic gel", "protein network", "neuron", "DNA circuit" showing the ~10-order-of-magnitude biology-vs-synthetic gap the paper reports.`,
  },
]

function builderPrompt(idea) {
  return `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the real arXiv paper arxiv.org/abs/${idea.paper} — fetch the abstract (and paper page if useful) first to ground the actual numbers/claims, then build.

Idea: ${idea.title}
${idea.pitch}

Requirements:
- Write the ENTIRE demo as ONE self-contained HTML file at ${idea.file} (relative to /home/david/code/arxiv-scrape). No build step, no backend. CDN <script> tags (three.js, d3, Chart.js, p5.js, etc.) are encouraged for richer visuals.
- Real interactivity (sliders/drag/toggle/keyboard) that changes what's rendered, not a static page.
- Good visual polish: real layout/typography/color, not browser defaults. Dark-mode friendly.
- A short in-page panel explaining the paper's real result in plain language, with the arXiv id linked.
- Ground every claimed number/formula in what the actual abstract says — do not fabricate constants.
- Before returning, verify the file is valid, self-contained HTML that actually renders and runs (open/read it back, check for JS errors in the logic, check all tags are balanced). A demo that doesn't run is disqualified — this matters more than extra polish.

Return a short summary: what you built, which real paper numbers you grounded it in, and confirmation you verified it runs.`
}

phase('Build')
const builds = await parallel(IDEAS.map(idea => () =>
  agent(builderPrompt(idea), { label: `build:${idea.slug}`, phase: 'Build' })
))

IDEAS.forEach((idea, i) => log(`Builder ${idea.slug}: ${builds[i] ? 'returned' : 'FAILED'}`))

phase('Judge')
const judgePrompt = `Three subagents each built a competing single-file HTML demo for tonight's arxiv-scrape nightly build-off. Judge them and pick ONE winner.

Files to open and inspect (read the raw HTML, and if you have browser/playwright tooling available, actually load each one and interact with it — sliders, drags, toggles):
${IDEAS.map(idea => `- ${idea.file} (paper arxiv.org/abs/${idea.paper}, idea: ${idea.title})`).join('\n')}

Builder self-reports:
${IDEAS.map((idea, i) => `--- ${idea.slug} ---\n${builds[i] || '(builder failed / no result)'}`).join('\n\n')}

For each demo that actually exists and is valid self-contained HTML:
1. Verify it isn't broken (balanced tags, no obviously undefined functions called on interaction, CDN scripts referenced correctly).
2. Cross-check its claimed numbers/formulas against the real arXiv abstract for that paper id (fetch it) — penalize fabricated numbers.
3. Score 1-9 each on: wow-factor, interactivity, polish, fidelity to the paper. Disqualify (score 0) anything that doesn't actually run/is not self-contained.
4. Pick the single coolest one that runs. If all fail, say so explicitly.

Return: per-demo scores + short justification, then a clear WINNER: <slug> line at the end (or WINNER: none if all failed).`

const judgment = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { ideas: IDEAS, builds, judgment }
