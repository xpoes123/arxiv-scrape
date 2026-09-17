export const meta = {
  name: 'arxiv-nightly-buildoff-2026-09-14',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'bluff-catcher',
    title: '100ms: The Bluff-Catcher',
    paper: 'arXiv:2608.19135 — Autonomous Cyber Defense in Connected Vehicles: A Multi-Agent Approach to V2X Security',
    pitch: `The paper builds an onboard multi-agent defender for connected vehicles: incoming V2X messages (some real emergency alerts, some spoofed/malicious) must be triaged under a hard, very short time budget, and the scoring is deliberately asymmetric -- missing a real threat costs far more than raising a false alarm.

Build a reaction-time browser game modeled directly on this: incoming "messages" flash on screen (mix of real emergency brakes/alerts and spoofed attacks), the player has a shrinking time budget (start around 100ms-equivalent, i.e. genuinely tight — tune for playability) to hit Accept / Drop / Escalate, and scoring mirrors the paper's real asymmetric cost structure (missing a real alert costs much more than a false escalate). Track a running score and a calibration readout (not just "how fast" but "how well-calibrated to the real asymmetric stakes" -- e.g. show how many real threats were missed vs false escalates raised). Frame it explicitly as a poker-style snap read: same asymmetric-stakes decision under a clock, just wearing a car-security hat. Include a leaderboard/best-run display (localStorage is fine).`,
  },
  {
    slug: 'stubborn-minority',
    title: 'The Stubborn Minority Simulator',
    paper: 'arXiv:2608.11071 — Scaling Laws for Majority-based Opinion Dynamics in the Presence of Stubborn Agents',
    pitch: `The paper studies majority-rule opinion dynamics (agents flip 0/1 opinions via a k-choices majority rule) in the presence of "stubborn" agents on each side who never change their mind. Its headline result is a sharp phase transition in time-to-consensus: exponential (effectively "never converges") when both sides' stubborn fractions are small and close to each other, collapsing to logarithmic (fast convergence) the instant one side's stubborn fraction crosses a threshold relative to the other.

Build a single-file canvas simulation: a grid/network of agents whose opinion (color) updates each tick via the majority rule, with two sliders controlling gamma_0 and gamma_1 (fraction of permanently-stubborn agents on each side) and a network-size control. Run the simulation live and plot time-to-consensus on a log axis as the user drags the sliders near the critical boundary, so the phase transition is visibly felt -- consensus time should visibly explode toward one edge of the slider range and collapse toward the other. Frame it for a betting audience: "a market/line that never moves and one that snaps overnight are the same system on opposite sides of one threshold." Ground the actual threshold condition and scaling law in the real paper (fetch the abstract), don't just hand-wave a smooth curve.`,
  },
  {
    slug: 'secret-handshake',
    title: 'Secret Handshake Auction',
    paper: 'arXiv:2608.19161 — Beyond the Transcript: Detecting Covert Coordination in Latent Multi-Agent Communication',
    pitch: `The paper shows that AI agents can covertly coordinate via a shared latent signal that leaves their visible communication transcript looking completely clean -- but watching internal activations/latents instead of the transcript catches the collusion with very high accuracy (paper reports ~0.99 AUROC).

Build a single-page simulated multi-bidder auction: 5 AI bidders submit bids across several rounds, and the player can toggle "collusion mode" on any 2 of them (a hidden shared signal nudges their bids down in a way that's invisible in the public transcript/log of bids and any chat-style messages shown). Show the public transcript panel looking totally clean/normal. Then let the player flip on a "latent monitor" panel that visualizes each bidder's internal (simulated) activation trace and computes a live anomaly/similarity score between every pair, lighting up exactly the colluding pair once enough rounds have run -- a playable version of the paper's real result that transcript-level monitoring misses collusion but latent-level monitoring catches it. Make the reveal satisfying (visual highlight, score readout climbing toward the colluding pair). Frame it for a poker/betting audience: this is the formal version of "the bots aren't saying anything suspicious, but something's off."`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-09-14-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-09-14-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
