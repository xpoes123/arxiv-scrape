export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-14',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'permutation-snap',
    file: 'demos/2026-08-14-permutation-snap-a.html',
    paper: '2607.12431',
    title: 'Permutation Snap: Watch Gradient Ascent Find the Only Maxima',
    pitch: `The paper proves that when you maximize sum(entry^4) over the orthogonal group, the ONLY local (hence global) maximizers are signed permutation matrices -- every other stationary point has an explicit escape direction. Build a single-page demo: for SO(2)/SO(3), plot the objective f(theta)=cos^4+sin^4+... as you rotate an orthogonal matrix around a slider, showing it has sharp peaks precisely at the axis-aligned rotations. Then run live gradient ascent from a random starting rotation and animate the matrix heatmap "snapping" toward a permutation matrix (all 0s and +/-1s) while a trajectory dot climbs the landscape curve. Bonus panel: apply the exact same gradient ascent to un-mix two blindly combined sine/audio waveforms (classic ICA-via-kurtosis setup) and let the user hear the mixed signal "de-scramble" into two clean tones as the rotation converges to a permutation -- this is the real-world reason this theorem matters (why ICA optimization landscapes have no bad local optima).`,
  },
  {
    slug: 'numerical-semigroup-tree',
    file: 'demos/2026-08-14-numerical-semigroup-tree-b.html',
    paper: '2607.23111',
    title: 'Numerical Semigroup Tree Explorer (the "unreachable score" game)',
    pitch: `The paper proves an exact formula for the number of numerical semigroups with a given genus, Frobenius number, AND multiplicity simultaneously (for m >= (F+1)/3), and grows the "tree of numerical semigroups" via a seeds/pruning algorithm to compute previously-unknown counts and tables up to F=128. Build a single-HTML canvas demo that frames this as a game: pick a set of "move values" (like darts, or a video-game combo scoring system), and watch the semigroup tree branch live as you increase genus, with the Frobenius number highlighted as "the largest score you can never make." A live counter shows the running total of semigroups matching the paper's exact multiparameter formula, so you can literally watch the theorem being verified node-by-node. Fits the math-to-games whimsy angle -- it's the Chicken McNugget problem with a real recent theorem behind it.`,
  },
  {
    slug: 'rank-width-playground',
    file: 'demos/2026-08-14-rank-width-playground-c.html',
    paper: '2607.23101',
    title: 'Rank-Width Playground: Pivot Your Way Past the Forbidden 25',
    pitch: `The paper computer-searched a huge number of graphs to find the complete list of forbidden substructures for rank-width <=2: exactly 25 excluded vertex-minors (8-10 vertices) and 609 excluded pivot-minors (8-12 vertices) -- any graph avoiding all of them provably has rank-width <=2. Build a single-page graph editor (canvas + adjacency matrix) where you draw a graph up to ~12 nodes and apply local complementation / vertex-deletion (vertex-minor moves) or edge-pivot operations live. Compute rank-width exactly and instantly by brute-forcing GF(2) matrix rank over all 2^n vertex bipartitions (trivial at n<=12) and show a running badge: "rank-width = 2, still safe" vs "rank-width jumped to 3 -- you just created a forbidden substructure." This makes an abstract linear-algebra graph invariant something you can feel by dragging edges around, and it's 100% client-side JS/canvas -- no data files needed, the whole theorem is computable from scratch.`,
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
