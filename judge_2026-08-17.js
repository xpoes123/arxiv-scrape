export const meta = {
  name: 'arxiv-nightly-judge-2026-08-17',
  description: 'Judge-only pass for the already-built 2026-08-17 build-off (build phase finished, judge/publish/log never ran)',
  phases: [
    { title: 'Judge' },
  ],
}

const IDEAS = [
  { slug: 'ai-contagion-network', file: 'demos/2026-08-17-ai-contagion-network-a.html', paper: '2602.02607', title: 'AI Contagion Network: the Implementation Tax simulator' },
  { slug: 'rod-rave', file: 'demos/2026-08-17-rod-rave-b.html', paper: '2607.10510', title: 'Rod Rave — Watch Hard Rectangles Spontaneously Align' },
  { slug: 'glassy-grammar', file: 'demos/2026-08-17-glassy-grammar-c.html', paper: '2606.28103', title: 'Glassy Grammar: the Random Language Model phase-transition toy' },
]

phase('Judge')
const judgePrompt = `You are the judge for a 3-way subagent build-off from the arxiv-scrape nightly scout project at /home/david/code/arxiv-scrape. Three builder subagents each built a self-contained interactive HTML demo grounded in a real arXiv paper. Open/read all three, verify each is valid self-contained HTML that would actually run (balanced tags, no obvious JS syntax errors, CDN references resolve, DOM ids referenced in JS actually exist), cross-check each demo's claimed numbers/formulas against the real arXiv paper's abstract (fetch https://arxiv.org/abs/<id> for each), then score wow-factor, interactivity, polish, and fidelity to the paper (1-10 each, sum out of 40). Disqualify any that don't run. Pick the single coolest one that runs.

The three files:
${IDEAS.map((idea, i) => `- ${String.fromCharCode(65 + i)}: ${idea.file} -- "${idea.title}", paper arXiv:${idea.paper}`).join('\n')}

Report back in plain text (under 400 words): for each demo, whether it runs + scores + one-sentence fidelity note; the winner (letter + slug) with 1-2 sentence justification; the winning file's exact path. Read-only pass, do not modify any files.`

const judgeVerdict = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { judgeVerdict }
