export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-16',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'broken-gate',
    file: 'demos/2026-08-16-broken-gate-a.html',
    paper: '2607.18659',
    title: 'Broken Gate: Spot the Agent',
    pitch: `The paper's headline finding: challenge-based bot defenses (CAPTCHAs etc.) are broadly ineffective against commercial LLM-agent solvers, which achieve near-perfect bypass at negligible cost -- and critically, two agents with nearly indistinguishable BEHAVIORAL footprints (mouse movement, click timing) can yield divergent pass/block outcomes, because real bot gates key off environment-authenticity signals (headless flag, WebDriver property, TLS/JA3 fingerprint, execution-environment noise), not behavior. Build a single HTML page 'spot the bot' game: procedurally generate a handful of animated cursor-movement traces on a canvas (jittery/human-like vs bezier-smooth/bot-like, some deliberately near-identical to each other), ask the visitor to classify each as human or LLM-agent before a timer runs out, then reveal the twist -- a 'behind the curtain' panel showing the actual environment-authenticity signals (a mocked headless flag / WebDriver property / fingerprint noise reading) that would have determined a real CAPTCHA's verdict, which frequently disagrees with what the behavior alone suggested. Score the player on both guesses AND on whether they realize behavior alone is the wrong signal. Ground every specific claim (near-perfect bypass rates, environment vs behavior distinction) in the actual abstract -- do not fabricate numbers not stated in it.`,
  },
  {
    slug: 'interpolation-roulette',
    file: 'demos/2026-08-16-interpolation-roulette-b.html',
    paper: '2607.09547',
    title: 'Interpolation Roulette',
    pitch: `The paper proves ridgeless (min-norm interpolating) regression in high dimensions is accurate on average but has a heavy right tail of catastrophic prediction errors decaying only like a slow polynomial rate, versus ridge-regularized regression's much faster tail decay -- i.e. interpolators look fine on average but are statistically fragile in the tail. Build a single HTML 'spin the wheel' simulator: generate synthetic high-dimensional linear regression data with heavy-tailed noise client-side, fit both a ridge model and a ridgeless (min-norm interpolating) model repeatedly, and animate each trial as a spin landing on a live-updating histogram/roulette wheel of held-out prediction errors for each model side by side. Ridge trials should cluster tight and boring; ridgeless trials look similar most of the time but every so often land on a huge spike bar -- a visceral 'accurate on average, fragile in the tail' moment. A slider for the dimension/sample-size ratio (d/n approaching 1) should visibly dial up ridgeless fragility live, reproducing the paper's large-deviation regime. Ground the demo's framing in the paper's actual claimed tail-decay comparison -- do not invent precise numeric rates beyond what the abstract supports; if the abstract only gives qualitative/asymptotic claims, represent it qualitatively rather than fabricating exact constants.`,
  },
  {
    slug: 'brownian-bridge-box-score',
    file: 'demos/2026-08-16-brownian-bridge-box-score-c.html',
    paper: '2606.11760',
    title: 'Brownian Bridge Box Score',
    pitch: `The paper's result: for privately releasing a running cumulative sum under continual observation (the classic binary-tree/Gaussian mechanism), querying any past partial sum normally requires summing O(log T) noise terms up/down a binary tree; the paper shows the correctly-correlated noise for ANY node can instead be sampled in constant time by treating the tree's noise process as a Brownian bridge and interpolating directly. Build a single HTML demo framed as a live, privacy-noised running basketball box score -- a team's cumulative point total ticking up possession by possession (or a poker player's cumulative net winnings hand by hand). Run two panels side by side racing to answer 'what was the noised cumulative total at query time X': a 'Naive tree mechanism' panel that visibly animates walking up/down O(log T) binary-tree nodes summing noise terms, and a 'Brownian bridge' panel that instantly interpolates the same (correctly-correlated) noise value as a continuous stochastic bridge path snapping to the sampled point. A slider for T (number of events/possessions) should show the naive method's per-query animation/cost visibly growing while the bridge method stays flat -- making the paper's asymptotic claim about constant-time vs O(log T) queries visible and race-able. This is pure client-side math (cumulative sums, Gaussian noise sampling, Brownian bridge interpolation) -- ground the noise-correlation structure and the constant-time claim in the actual abstract.`,
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
