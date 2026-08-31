export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-31',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'gut-vs-grind',
    title: 'Gut vs Grind: A System-1/System-2 Betting Decision Trainer',
    paper: 'arXiv:2602.11478 — Defining causal mechanism in dual process theory and two types of feedback control',
    pitch: `The paper formally models dual-process cognition as TWO SEPARATE causal feedback-control loops operating on a supervenience/subvenience hierarchy: Type 1 (fast, pattern-matching, low-level neural-network feedback) and Type 2 (slow, deliberate, higher-level error-correcting feedback) -- not one fast/slow dial, but genuinely distinct control mechanisms with their own feedback-error dynamics.
Build a single-page quiz/trainer toy: present a series of short betting or poker decision scenarios (e.g. "you're dealt this situation, quick -- call, fold, or raise?" with realistic-looking numbers). For each round, first force a fast GUT pick under a 5-second countdown (Type 1: no time to compute, pure pattern-match), then reveal the full odds/EV breakdown and let the user make a slow, deliberate GRIND pick (Type 2: calculated, error-corrected). Track both pathways' "hit rate" (did the fast pick match the correct EV-optimal answer?) and simulate a running bankroll for each pathway separately across the session (persisted via localStorage so it accumulates round to round). End with a chart comparing Type-1 vs Type-2 performance this session -- score, accuracy, and cumulative simulated bankroll -- so the user gets a real answer to "was my gut actually right, or was I just lucky?" Ground the framing explicitly in the paper's two-feedback-loop causal model, not just "fast vs slow" folklore.`,
  },
  {
    slug: 'market-maker-stress-test',
    title: 'Market Maker Stress Test',
    paper: 'arXiv:2602.01817 — Do designated market makers provide liquidity during downward extreme price movements?',
    pitch: `Using audit-trail data on designated market makers (DMMs), the paper shows DMMs provide liquidity (buy the dip, keep spreads tight) when a downward shock hits ONE stock in isolation -- but when several stocks crash together (a systemic/correlated shock), DMMs flip to consuming liquidity themselves, dumping inventory and widening spreads, leaving slower traders to absorb the risk. "Lean with the wind" behavior emerges specifically under correlated stress, not idiosyncratic stress.
Build an interactive simulator: a grid of N "stocks" (or reframe as "games on tonight's slate") each with a live price/line and a visible bid-ask spread. A slider controls how many are hit by a simultaneous downward shock (1 = idiosyncratic, all = systemic/correlated). An animated market-maker AI agent visibly changes behavior in real time as the slider moves -- narrowing spreads and absorbing sell pressure when the shock is isolated to one asset, then visibly widening spreads and dumping its own inventory (a "running away" animation) once multiple assets crash together. Live readouts: DMM inventory position, spread width, and a "liquidity provided vs consumed" meter per scenario. Explicitly frame the isolated-vs-correlated distinction as "one book losing on a single upset" vs "the whole slate going against the house at once" so a betting audience maps it instantly to sportsbooks pulling limits during a correlated bad-beat wave.`,
  },
  {
    slug: 'pay-to-peek',
    title: 'Pay-to-Peek: The Testing Game',
    paper: 'arXiv:2606.25166 — Scheduling with Testing: Competitive Algorithms for Minimizing the Total Weighted Completion Time in the Adversarial Model',
    pitch: `The paper studies scheduling jobs that each come with only an upper-bound processing time and a weight (importance); before running a job you may pay a "testing time" cost to reveal its true, potentially much shorter, processing time. In the adversarial model (an adversary picks worst-case true times subject to the upper bounds), the paper proves the first constant-competitive algorithms for job-dependent weights: a deterministic algorithm with competitive ratio 2.3166, and a randomized algorithm achieving 2.1523 -- both provably close to the best possible against an adversary.
Build an interactive HTML game: the player is handed a queue of jobs, each shown only as an upper-bound time and a weight/importance (higher weight = costs more per unit of delay). For each job the player chooses: run it blind at the upper-bound time, OR pay a fixed "test cost" to reveal its true (adversarially-chosen, but bounded) processing time before deciding how/when to schedule it -- directly mirroring "pay to see one more card before you commit." Live-track the player's cumulative weighted completion time as they build a schedule, and run the paper's proven-optimal randomized algorithm as a ghost/AI opponent scheduling the SAME adversarial job sequence alongside, so the player can see in real time how close their intuitive pay-to-peek choices come to the formally optimal 2.1523-competitive strategy. End-of-round scoreboard: player's ratio vs optimal vs a naive "always test" / "never test" baseline.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-31-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-31-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
