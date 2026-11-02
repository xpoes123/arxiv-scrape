export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-06',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'max-entropy-range',
    title: 'Max-Entropy Range Builder',
    paper: 'arXiv:2510.27006 — Generalized Maximum Entropy: When and Why you need it',
    pitch: `The paper's core claim: standard Shannon/Boltzmann maximum entropy is the wrong inference tool once your constraints have certain structure (correlated / power-law-ish), and you need a generalized entropy functional (Tsallis/Renyi-style, parameterized by q) to recover the actually-justified distribution.

Build a single-file HTML/JS poker toy: user ticks constraints on a villain's range (e.g. "bets flop 80%+ with top pair or better", "checks turn with draws"), and the tool renders a 13x13 starting-hand-matrix heatmap of the inferred range two ways side-by-side -- classical Shannon maxent vs. generalized q-entropy maxent -- with a slider sweeping q from 1 (smooth/diffuse, "textbook GTO range") out to clumpy/sparse extremes. Compute both distributions live from the actual ticked constraints (real constrained optimization / iterative proportional fitting in-browser, not canned), so dragging q visibly redistributes probability mass across the matrix in real time. Make visible exactly when the "assume max entropy" heuristic poker players lean on is quietly the wrong model.`,
  },
  {
    slug: 'lexicographic-kelly',
    title: 'Lexicographic Kelly',
    paper: 'arXiv:2610.02359 — Lexicographic Multi-Objective On-Policy Distillation',
    pitch: `The paper's core trick is lexicographic multi-objective optimization -- satisfy objective 1 (e.g. safety) to its hard bound FIRST, then optimize objective 2 only within whatever slack remains, never trading objective 1 away for gains on objective 2 no matter the weight.

Port that exactly to bankroll management: build an interactive HTML toy with two sliders -- "max acceptable risk of ruin" and "bet aggressiveness" -- and run two bankroll-growth simulations side by side on the SAME random bet sequence (real random sampling, re-rollable): (a) standard weighted-sum optimization (blend EV and variance with a risk-aversion coefficient, a la fractional Kelly) vs (b) strict lexicographic optimization (first clamp risk-of-ruin below the threshold, THEN maximize growth rate within that feasible set). Compute both bet-sizing rules live from the actual slider values each round. Let the user drag the weighted-sum model's weight slider up and watch it quietly breach the risk threshold for a little extra EV -- exactly the reward-hacking failure mode the paper calls out. The lexicographic model structurally can't do that. Show both bankroll curves and a running "risk-of-ruin breached?" indicator for each.`,
  },
  {
    slug: 'ferromagnet-of-parlays',
    title: 'Ferromagnet of Parlays',
    paper: 'arXiv:2609.08980 — The Ding-Song-Sun inequality for a class of even ferromagnets',
    pitch: `Single-file HTML/canvas Ising-style lattice where each spin is a bet leg and bond strength is correlation. The Ding-Song-Sun result generalizes Griffiths' second inequality: for even subsets A, B of a ferromagnet, <sigma_A sigma_B> >= <sigma_A><sigma_B> always holds, no matter how the couplings are arranged.

Let users drag a slider to set correlation between parlay legs (e.g. same-game player props) and watch a live joint-probability readout computed from an actual simulated correlated-spin system (real Monte Carlo / Glauber dynamics sampling, not faked) that never drops below the naive independent product -- directly refuting the "books inflate parlay odds because legs partially cancel" intuition. A second panel shows simulated bankroll variance rising as correlation increases, with the inequality's lower bound drawn as a hard floor the simulated outcomes can never cross below. Include a toggle between "ferromagnetic" (same-direction correlation, realistic for props) and a broken antiferromagnetic toy case to show where the inequality's guarantee disappears.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-06-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page. Run the actual underlying math/dynamics live in-browser (the real constrained-maxent optimization, real lexicographic bet-sizing logic, or a real correlated-spin simulation, as applicable) rather than a pre-canned or hand-tuned animation.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-06-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
