export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-11',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'watermark-shredder',
    file: 'demos/2026-08-11-watermark-shredder-a.html',
    paper: '2607.16648',
    title: 'Watermark That Survives the Shredder',
    pitch: `The paper's core claim is that a watermark built from per-token-pair Reed-Solomon polynomial evaluations (hash picks the evaluation point, parity picks the bit) needs no block synchronization, so it survives insertions, deletions, and reordering that break conventional block-based LLM watermarks. Build one HTML file: user types/pastes text, JS embeds a toy version of the scheme using SubtleCrypto hashing of adjacent character/word pairs plus small finite-field polynomial arithmetic, encoding a fake "secret ID" into subtle character-level tweaks. Then give the user edit tools (delete sentences, shuffle paragraph order, paste in noise) and show two live "recovery confidence" meters side by side: the algebraic scheme staying robust, and a simulated naive block watermark collapsing to zero after the same edit. A visceral, one-screen proof of the paper's synchronization-free advantage.`,
  },
  {
    slug: 'sentropy-playground',
    file: 'demos/2026-08-11-sentropy-playground-b.html',
    paper: '2511.03849',
    title: 'Sentropy Playground: LCR vs. Vendi Score, felt in real time',
    pitch: `The paper's finding is that two "similarity-sensitive" diversity measures -- Leinster-Cobbold-Reeve (LCR) and the Vendi Score (VS) -- can diverge by orders of magnitude on the same dataset, and VS is provably an upper bound on LCR, tunable via a "half-distance" parameter that sets how quickly similarity decays. Build a single HTML/canvas toy: 20-40 draggable colored dots framed as an NBA five-man lineup's skill-vector positions (or a poker hand range's card cluster). As the user drags dots together/apart or slides the half-distance parameter, three live numbers update: raw Shannon entropy (which only sees discrete labels and stays flat), LCR diversity, and Vendi Score (computed as exp of the Renyi-2 entropy of the eigenvalues of the pairwise Gaussian-kernel similarity matrix -- doable client-side, N<=40). The "aha" moment: watch Shannon entropy stay constant while LCR and VS crater as you cluster "five shooters" into one corner, then watch VS and LCR themselves peel apart as you retune half-distance -- reproducing the paper's headline result (orders-of-magnitude divergence, VS>=LCR) as a felt interaction instead of a table in a PDF.`,
  },
  {
    slug: 'treejam',
    file: 'demos/2026-08-11-treejam-c.html',
    paper: '2606.06686',
    title: 'TreeJam — feel the NP-hardness of Pebble Motion',
    pitch: `The paper resolves a decades-old open question by proving Pebble Motion (move one pebble at a time to an adjacent empty vertex, minimize total moves) is NP-hard even on trees, and that the 2-colored variant gets the first-ever hardness result on any graph class -- with the hard instances living on simple "subdivided star" trees. Build an interactive puzzle: colored pebbles sit on nodes of a randomly generated subdivided-star tree, player drags pebbles to adjacent empty nodes trying to reach a target coloring in the fewest moves, while a background solver (brute force / small search in JS) races the same instance and visibly chokes as pebble count grows past ~10-12 -- letting the user literally feel the combinatorial wall the paper proves is fundamental. A slider toggles between "easy" trees (few branches) and the paper's adversarial subdivided-star construction so users can see hardness appear right where the theorem says it must.`,
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
