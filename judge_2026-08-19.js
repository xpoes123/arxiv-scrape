export const meta = {
  name: 'arxiv-nightly-judge-2026-08-19',
  description: 'Judge pass for the 2026-08-19 build-off: 3 builders finished, pick the winner',
  phases: [
    { title: 'Judge' },
  ],
}

const IDEAS = [
  { slug: 'nn-to-gp', file: 'demos/2026-08-19-nn-to-gp-a.html', paper: '2607.06290', title: 'Watch a Neural Net Become a Gaussian Process' },
  { slug: 'circuit-breaker-lab', file: 'demos/2026-08-19-circuit-breaker-lab-b.html', paper: '2309.10220', title: 'Circuit Breaker Lab' },
  { slug: 'mingling-physics', file: 'demos/2026-08-19-mingling-physics-c.html', paper: '2604.00652', title: 'Mingling Physics: Fake Social Butterflies' },
]

phase('Judge')
const judgePrompt = `You are the judge for a 3-way subagent build-off from the arxiv-scrape nightly scout project at /home/david/code/arxiv-scrape. Three builder subagents each built a self-contained interactive HTML demo grounded in a real arXiv paper. Open/read all three, verify each is valid self-contained HTML that would actually run (balanced tags, no obvious JS syntax errors, CDN references resolve, DOM ids referenced in JS actually exist), cross-check each demo's claimed numbers/formulas against the real arXiv paper's abstract (fetch https://arxiv.org/abs/<id> for each), then score wow-factor, interactivity, polish, and fidelity to the paper (1-10 each, sum out of 40). Disqualify any that don't run. Pick the single coolest one that runs.

The three files:
${IDEAS.map((idea, i) => `- ${String.fromCharCode(65 + i)}: ${idea.file} -- "${idea.title}", paper arXiv:${idea.paper}`).join('\n')}

Report back in plain text (under 400 words): for each demo, whether it runs + scores + one-sentence fidelity note; the winner (letter + slug) with 1-2 sentence justification; the winning file's exact path. Read-only pass, do not modify any files.`

const judgeVerdict = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { judgeVerdict }
