export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-06',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'topological-knob',
    file: 'demos/2026-08-06-topological-knob-a.html',
    paper: '2605.19664',
    title: 'Topological Knob: Voltage-Tunable SSH Chain',
    pitch: `A tight-binding SSH-chain simulator styled after the paper's real device: two coupled chains of sites representing orthogonal light polarizations (photonic pseudospin) in a liquid-crystal microcavity, with intracell hopping v fixed and intercell hopping w controlled by a single "applied voltage" slider — mirroring how the real experiment uses voltage to tune interchain coupling on a dimerized uniform-lying-helix texture. Diagonalize the small tridiagonal Hamiltonian live in JS, plot the energy spectrum, and render site amplitudes along the chain. As the slider crosses v=w, the gap should close and reopen and a localized mid-gap edge state should light up glowing at the chain ends — the topological phase transition made physically tangible with the same tuning knob (voltage) the real experiment uses. A second toggle splits the two polarization chains to show the polarization-dependent "pseudospin" feature. Fetch the actual abstract at arxiv.org/abs/2605.19664 and ground the parameter ranges/framing in it.`,
  },
  {
    slug: 'diversity-illusion',
    file: 'demos/2026-08-06-diversity-illusion-b.html',
    paper: '2603.26896',
    title: 'The Diversity Illusion Simulator',
    pitch: `An interactive toy reproducing the paper's real mechanism: people overestimate a minority group's population share more at the national scale than the local scale, and the DRIVER differs by scale — local overestimation tracks direct interethnic contact, national overestimation tracks perceived news/media coverage, and social-media use inflates the bias while regular news consumption shrinks it. Build a single HTML page with two sliders ("your neighborhood contact rate" and "your social media diet") plus a scale toggle (neighborhood/city/national). Underneath, run a small canvas grid of colored dots representing the true demographic composition, and a separate "perceived composition" bar that updates live based on a simple weighted formula grounded in the paper's actual regression logic (contact-weighted at local scale, media-weighted at national scale, social media adds a multiplicative overestimation bump). The punchline: crank social media exposure and watch the "perceived %" diverge from the fixed "actual %" bar — visceral, shareable, and literally the paper's finding, not a vibe. Fetch the actual abstract at arxiv.org/abs/2603.26896 and ground the numbers/framing in it — do not just wing the formula, cite the paper's actual reported effect directions and, if given, magnitudes.`,
  },
  {
    slug: 'schur-colorer',
    file: 'demos/2026-08-06-schur-colorer-c.html',
    paper: '2607.15034',
    title: 'Schur Sum-Free Colorer',
    pitch: `A single-page canvas/grid puzzle: drag integers 1..N into k colored bins trying to keep every bin "sum-free" (no x+y=z within the same color) — literally the Schur number problem. A verify button flashes any x+y=z violation in red/highlights the offending triple. Preload a known optimal coloring (e.g. a valid witness for a small S(k)) as a starting puzzle, plus a "build it recursively" mode that animates the paper's actual shifted S-template construction: take a valid k-coloring, apply the shift-and-double trick, and watch a valid (k+2)-coloring on roughly 10x+2 more integers pop out live — visualizing the new recurrence S(k+2) >= 10*S(k)+2 that beats the older Abbott-Hanson bound (9*S(k)+4). Include the fun framing hook in an info panel: the paper credits the construction idea to a conversation with ChatGPT 5.5 Pro, then rigorously human-verified — a concrete, checkable instance of AI-assisted math discovery. Fetch the actual abstract at arxiv.org/abs/2607.15034 and ground the exact numbers (S(k) values, the recurrence constants) in it — do not invent numbers, use what the abstract/paper actually states.`,
  },
]

function builderPrompt(idea) {
  return `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the real arXiv paper arxiv.org/abs/${idea.paper} — fetch the abstract (and paper page if useful) first to ground the actual numbers/claims, then build.

Idea: ${idea.title}
${idea.pitch}

Requirements:
- Write the ENTIRE demo as ONE self-contained HTML file at ${idea.file} (relative to /home/david/code/arxiv-scrape). No build step, no backend. CDN <script> tags (three.js, d3, Chart.js, p5.js, etc.) are encouraged for richer visuals.
- Real interactivity (sliders/drag/toggle) that changes what's rendered, not a static page.
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
