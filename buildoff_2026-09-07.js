export const meta = {
  name: 'arxiv-nightly-buildoff-2026-09-07',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'tilt-reset-calculator',
    title: 'Tilt Reset Calculator',
    paper: 'arXiv:2607.16474 — Stochastic Resetting: A Non-Equilibrium Framework for Prediction, Inference and Design',
    pitch: `The paper shows that for a wide class of random search/first-passage processes, occasionally resetting the process back to its start (rather than letting it run uninterrupted) can strictly REDUCE the expected time to hit a target -- and there is a provably optimal, non-zero resetting rate that beats both "never reset" and "reset too often."

Build a gambler's-ruin-with-resetting toy: a bankroll does a random walk (session variance around some house edge / edge-per-hand), and the user sets a "reset rule" -- e.g. walk away and restart fresh after N buy-ins down, or after T minutes/hands of play. Simulate thousands of sessions live (fast enough to feel instant -- vectorize or batch the random walks) and plot expected time-to-target and bankroll-survival probability as a function of the resetting rate, with the paper's real optimal-rate result overlaid so the user can see exactly when "just walk away and come back tomorrow" beats grinding through the downswing, and when a nonzero reset rate is actually worse than never resetting (e.g. when there's no real edge to protect). Let the user drag the reset threshold and watch the outcome distribution shift in real time.`,
  },
  {
    slug: 'the-618-dial',
    title: 'The 61.8% Dial',
    paper: 'arXiv:2602.15266 — A golden-ratio partition of information and the balance between prediction and surprise: a neuro-cognitive route to antifragility',
    pitch: `The paper argues that adaptive, antifragile systems (brains included) partition their information budget in a golden-ratio split: roughly 61.8% committed to confident prediction, 38.2% held in reserve to absorb surprise -- and that this specific ratio, not just "some balance," is what makes the system robust to shocks rather than brittle or over-hedged.

Build a single-file interactive dial/gauge: the user enters (or drags a slider to set) their stated confidence in a bet, poker read, or prediction-market call. The demo renders a dial with three color zones -- "overconfident / brittle" (too far past 61.8%), a highlighted "antifragile sweet spot" band centered on 61.8%, and "over-hedged / no edge" (too far under it) -- and animates a little "shock absorption" simulation showing how a system at each confidence level responds to a simulated surprise event (a bad beat, a shock headline) hitting its prediction. Ground the 61.8% claim explicitly in the paper's actual derivation (fetch the abstract, don't just assert the number) and be honest on-page about what the golden-ratio claim is actually measuring vs. where it's more evocative than rigorous.`,
  },
  {
    slug: 'patch-forager',
    title: 'Patch Forager: Stay or Leave the Table',
    paper: 'arXiv:2607.29476 — Resource depletion accelerates rate learning but not composition learning in patch foraging',
    pitch: `The paper's finding: agents foraging in depleting "patches" learn how FAST a patch depletes (rate learning) just fine under reward-maximizing pressure, but systematically fail to learn WHAT the patch actually contains (composition learning) -- because composition learning requires exploring past the point where leaving already looks locally optimal. Reward-maximizers reliably under-harvest rich patches as a result.

Build a single-file browser game: the player is dropped into a sequence of hidden-quality "patches" (framed as poker tables or loot-farming zones, player's choice of skin) and on each turn must decide stay-and-deplete vs leave-and-sample a new patch, with a visible depleting reward rate per patch and a hidden true "composition" (patch quality) that can only be learned by staying past the point where leaving looks locally best. Run two AI ghost-agents alongside the player in the same environment -- a pure reward-maximizer and an explicit info-seeker -- and show a live/end-of-run comparison: cumulative score AND how accurately each agent (player included) actually learned each patch's true composition. Make the paper's real finding land as the punchline: the reward-maximizer scores fine short-term but is measurably wrong about which patches were actually good.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-09-07-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Dark theme, clean typography, mobile-reasonable layout is a plus but not required.
- Before returning, sanity-check the HTML yourself: read the file back, confirm tags balance, no obvious JS syntax errors, all referenced CDN URLs are real, and that the interactive elements are wired up (event listeners present, canvas/svg actually draws). If you have a way to actually execute/render it (e.g. via a headless browser tool), do so and confirm zero console errors -- otherwise do a careful manual read-through.
- A build that doesn't run is disqualified, so err on the side of simpler-but-definitely-working over ambitious-but-broken.

Return a short (under 150 words) summary of what you built and confirmation that you verified the file is valid, self-contained HTML.`

phase('Build')
const builds = await parallel(IDEAS.map((idea, i) => () =>
  agent(BUILD_PROMPT(idea, String.fromCharCode(97 + i)), {
    label: `build-${idea.slug}`,
    phase: 'Build',
  })
))

log(`${builds.filter(Boolean).length}/3 builders completed`)

phase('Judge')
const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          runs: { type: 'boolean' },
          wow: { type: 'number' },
          interactivity: { type: 'number' },
          polish: { type: 'number' },
          fidelity: { type: 'number' },
          notes: { type: 'string' },
        },
        required: ['slug', 'runs', 'wow', 'interactivity', 'polish', 'fidelity', 'notes'],
      },
    },
    winnerSlug: { type: 'string' },
    reasoning: { type: 'string' },
  },
  required: ['scores', 'winnerSlug', 'reasoning'],
}

const judgePrompt = `Three builders each wrote a self-contained HTML demo tonight, competing to build the coolest interactive arXiv-paper demo. Open and evaluate each of these 3 files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-09-07-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
