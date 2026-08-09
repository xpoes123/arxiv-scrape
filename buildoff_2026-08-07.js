export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-07',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'sticky-disks',
    file: 'demos/2026-08-07-sticky-disks-a.html',
    paper: '2605.20882',
    title: 'Sticky Disks: Selective Adsorption Sandbox',
    pitch: `The paper's core, verifiable result: two same-size particle species with different adhesive affinities sort themselves onto a patterned sticky surface, and selectivity depends sharply on the size of the adhesive domains relative to particle diameter (domains near particle-diameter size maximize selectivity; shrinking small domains further pushes the system toward uniform-surface-like behavior). Build a real-time hard-disk Monte Carlo simulation in canvas: two colors of disks bounce/diffuse in a box above a patterned floor of sticky domains, sliders control domain size, coverage, and adhesion strength (chemical potential proxy), and a live histogram/readout shows the emergent selectivity ratio. Watching the sorting self-organize in real time as you drag the domain-size slider is a direct, feelable demonstration of the paper's headline finding.`,
  },
  {
    slug: 'replacers-edge',
    file: 'demos/2026-08-07-replacers-edge-b.html',
    paper: '2511.04417',
    title: "The Replacer's Edge — Moran Process Invasion Simulator",
    pitch: `Single-page canvas sim of a Moran process on a population of size N. Introduce one "replacer" — a phenotype that, whenever picked to reproduce, always displaces a different-type neighbor rather than a random one — and run many Monte Carlo trials to empirically trace out fixation probability vs N. The paper proves a neutral replacer fixes with probability ~1/sqrt(N) instead of the standard 1/N; sliders for N and the replacer's relative reproductive rate let the viewer watch the empirical curve bend away from the classic 1/N line live, ideally with a 1D spatial-lattice mode too. Whimsy hook: "hard counter" characters in MOBAs/CCGs (always beat whatever they're matched against) are literally replacers, which is why counter-pick metas spread through a playerbase far faster than raw stat buffs — a direct math-to-games crossover, worth calling out in the explainer panel.`,
  },
  {
    slug: 'zombie-damage',
    file: 'demos/2026-08-07-zombie-damage-c.html',
    paper: '2607.16382',
    title: 'Last One Damaged: The Zombie Pursuit Game',
    pitch: `A single-page canvas game literally implementing the paper's "damage variant of Cops and Robber": one cop (the zombie) is constrained to move along the shortest path toward the survivor every turn (geodesic pursuit) instead of playing optimally, while the survivor (the user, via click/drag/arrow-key movement) tries to visit as many distinct vertices as possible before capture. Let the user pick a graph family from the paper's exact theorems — a cycle C_n (proven zeta_dmg = n for n>=5), a tree (proven zero extra damage), a complete multipartite graph K_{n1,...,nk} (proven zeta_dmg = n1+n2-2), or a random sparse girth-5 graph (proven every vertex gets damaged) — run the simulation, and watch a live "damage counter" converge toward the closed-form value the paper proves for that graph family. It's a combinatorics theorem that is also just a fun chase game — make the shortest-path zombie pursuit visually clear (e.g. highlight its planned path) so the viewer can feel why constraining the cop to greedy shortest-path chasing is so much worse than optimal pursuit.`,
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
