export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-20',
  description: '3-way build-off of demo ideas from tonight\'s ideation, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'mvp-ballot-aggregator',
    title: 'The MVP Ballot Aggregator: NP-Hard in Real Time',
    paper: 'arXiv:2607.28588 — The Complexity of Kemeny Aggregation with Three Rankings',
    pitch: `Feed it 3 ranked ballots (default: three different NBA MVP straw-poll rankings, fully editable, up to ~9 candidates) and it brute-forces the Kemeny consensus by minimizing total Kendall-tau distance across all permutations, with a live counter showing the search space exploding (9! = 362,880) -- the exact reason the paper proves Kemeny Score is NP-complete even for just three rankings. A pairwise-agreement heatmap plus a 'support level' slider demonstrate the paper's sharp dichotomy: some ballot configurations resolve instantly, others blow up, and the winning consensus order is shown scored against each input ballot so the Kendall-tau math is visible, not just the answer.`,
  },
  {
    slug: 'cnot-golf',
    title: 'CNOT Golf: the 4n-o(n) puzzle',
    paper: 'arXiv:2607.28598 — Explicit Matrices over Z_2 with CNOT and Row Complexity 4n-o(n) and Local Logic Gates',
    pitch: `The paper's actual result is an explicit family of invertible n×n matrices over Z_2 that PROVABLY need at least 4n-o(n) elementary operations (CNOT gates / row ops) to reduce to identity. Build a single-file HTML puzzle: render an n×n binary matrix as a grid, let the player apply CNOT gates (row_i ^= row_j) via click-click, race to reduce it to the identity in as few gates as possible. Seed the puzzle with hard instances approaching the bound and show a live counter next to the proven 4n-o(n) lower bound, so the player literally feels how close a 'greedy human' gets to the theoretical floor. Bonus mode: 'local logic gates' (arbitrary invertible 2x2 blocks instead of just CNOT) unlock a looser bound, visually showing why richer gate sets shrink circuit depth. Pure GF(2) linear algebra in vanilla JS, canvas grid + gate-count HUD, zero dependencies.`,
  },
  {
    slug: 'outbreak-radius',
    title: 'Outbreak Radius: the size-dependent dispersion sandbox',
    paper: 'arXiv:2606.31942 — Invasion with size-dependent dispersion range',
    pitch: `A single-page canvas sim of the paper's actual model: secondary colonies bud off at distances proportional to the parent colony's size (parameter mu), instead of the usual fixed dispersal range. Give the user a mu slider from 0 to 1 and watch the population visibly shift through the paper's regimes -- linear expansion, power-law growth, exponential blowup, and finite-time blow-up -- with a live log-log plot of radius vs time tracking the theory curve. Add a toggle that overlays the paper's 'coalescing colony' theoretical prediction against the spatially-explicit particle simulation so you can SEE where it diverges (it nails perimeter scaling but misses volume/area scaling -- colonies clump irregularly instead of forming the clean disk theory predicts). Mark mu* ≈ 0.7 as a highlighted threshold where 'satellite' outposts should theoretically die out but visibly don't in the sim -- that mismatch is the punchline. Frame it as zombie outbreak / dandelion spread / cancer metastasis skin for shareability.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-20-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run \`openssl dgst -sha384 -binary | openssl base64 -A\` to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-20-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
