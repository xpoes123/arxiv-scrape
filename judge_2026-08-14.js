export const meta = {
  name: 'arxiv-nightly-judge-2026-08-14',
  description: 'Judge-only pass for the already-built 2026-08-14 build-off (3rd build never completed)',
  phases: [
    { title: 'Judge' },
  ],
}

const IDEAS = [
  { slug: 'permutation-snap', file: 'demos/2026-08-14-permutation-snap-a.html', paper: '2607.12431', title: 'Permutation Snap: Watch Gradient Ascent Find the Only Maxima' },
  { slug: 'numerical-semigroup-tree', file: 'demos/2026-08-14-numerical-semigroup-tree-b.html', paper: '2607.23111', title: 'Numerical Semigroup Tree Explorer (the "unreachable score" game)' },
]

phase('Judge')
const judgePrompt = `You are the judge for a build-off from the arxiv-scrape nightly scout project at /home/david/code/arxiv-scrape. This was supposed to be a 3-way build-off but the third builder (a "Rank-Width Playground" demo for arXiv:2607.23101) never produced a file -- only 2 of 3 builds completed. Judge between the 2 that exist. Open/read both, verify each is valid self-contained HTML that would actually run (balanced tags, no obvious JS syntax errors, CDN references resolve, DOM ids referenced in JS actually exist), cross-check each demo's claimed numbers/formulas against the real arXiv paper's abstract (fetch https://arxiv.org/abs/<id> for each), then score wow-factor, interactivity, polish, and fidelity to the paper (1-10 each, sum out of 40). Disqualify any that don't run. Pick the single coolest one that runs.

The two files:
${IDEAS.map((idea, i) => `- ${String.fromCharCode(65 + i)}: ${idea.file} -- "${idea.title}", paper arXiv:${idea.paper}`).join('\n')}

Report back in plain text (under 400 words): for each demo, whether it runs + scores + one-sentence fidelity note; the winner (letter + slug) with 1-2 sentence justification; the winning file's exact path. Read-only pass, do not modify any files.`

const judgeVerdict = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { judgeVerdict }
