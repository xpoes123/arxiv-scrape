export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-28',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'trust-arena',
    title: 'LLM Trust Arena',
    paper: 'arXiv:2604.18596 — Large language models converge on competitive rationality but diverge on cooperation across providers and generations',
    pitch: `The paper ran 51,906 game-theoretic trials (826,990 decisions) across 25 LLMs from 7 developers in 38 canonical games. Headline result: models converge tightly on competitive/coordination behavior (coefficient of variation 0.06-0.11) but diverge 48-fold on cooperation -- from 1.5% (GPT-5 Nano) to 71.5% (Claude Opus 4.6). Provider identity is the dominant predictor. Generational drift is real and non-monotonic: OpenAI cooperation fell 50.3%->1.5% across 4 generations, Google rose 8.3%->56.8%. Endgame analysis: Anthropic frontier models still cooperate 57% in the FINAL round of finitely repeated games (where backward induction predicts zero), while newest Google models cooperate until punishment becomes impossible, then universally defect.
Build a single-page toy: let the user pick two AI personas (seeded from the paper's real per-provider/generation cooperation rates) and run an iterated Prisoner's Dilemma / trust game hundreds of rounds client-side, with a "rounds remaining" slider/countdown so the user can watch endgame behavior emerge live -- most personas defect hard as the counter hits zero (backward induction), but the Anthropic-calibrated persona keeps cooperating anyway. Live payoff chart, cumulative score, and a "who would you trust with your bankroll" framing. No backend, pure client-side JS driving the persona's cooperation probability each round (drawn from the paper's real numbers, with visible per-round jitter, not literally scripted).`,
  },
  {
    slug: 'auc-lies',
    title: 'Your Backtest\'s AUC Is Lying to You',
    paper: 'arXiv:2608.02821 — What the Detector Can See: Evaluating CPS Anomaly Detectors Independently of the Decision Rule',
    pitch: `The paper treats an anomaly detector as a two-stage pipeline (observations -> residuals -> alarms) and shows that scoring only the final alarm (precision/recall/F1/AUC at one operating point) hides huge differences. Applied to 5 real detectors (GDN, FuSAGNet, TranAD, NSIBF, GeCo) across 3 CPS benchmarks (SWaT, WADI, HAI): detectors with SIMILAR ROC-AUC on SWaT differ by more than an order of magnitude in actual detection rate at a common false-alarm rate, and rankings completely flip across testbeds -- TranAD is #1 on HAI but LAST on SWaT; NSIBF is #1 on WADI but last on HAI.
Build an interactive toy with two synthetic detectors that report nearly identical AUC (~0.85, drawn as overlapping ROC curves) but have very different underlying residual distributions (one has a heavy-tailed/bimodal residual distribution, one is cleanly separated). Let the user drag an "operating threshold" (false-alarm-rate) slider and watch the true detection rate for each diverge wildly in real time -- at low false-alarm-rate one detector catches almost everything and the other misses most attacks, even though their AUC badge reads the same. Reframe explicitly for a betting audience: "your model's AUC doesn't tell you if it's profitable at the threshold you actually bet at." Live numeric readout of detection-rate gap at the current threshold.`,
  },
  {
    slug: 'tunnel-or-climb',
    title: 'Tunnel or Climb',
    paper: 'arXiv:2606.23614 — Log-concavity and tunneling: adiabatic quantum optimization for convex functions (with a spike)',
    pitch: `The paper proves that for a broad family of 1D discrete Schrodinger operators whose ground state is log-concave (includes convex potentials, i.e. smooth bowls, plus some potentials with local minima), quantum tunneling gives a provable spectral-gap speedup over classical search specifically when the potential is "convex with a spike" -- a smooth bowl with one narrow, tall barrier stuck in it. This generalizes the exactly-solvable linear "Hamming weight with a spike" (HWS) case to the quadratic (non-exactly-solvable) case, extending Reichardt's 2004 perturbative analysis via new spectral gap bounds.
Build a single-page demo: draw a 1D convex landscape (e.g. a quadratic bowl) with a user-adjustable narrow spike/barrier placed partway up one side. Race two agents across it in real time -- a classical hill-climber/simulated annealer (has to physically walk up and over the spike, or gets stuck oscillating against it) versus a simple discrete-time Schrodinger/quantum-walk simulation (explicit finite-difference or Crank-Nicolson time evolution of a wavepacket on the same discretized potential) whose probability amplitude visibly leaks straight THROUGH the barrier. Sliders for spike height and width let the user watch the classical walker's success rate collapse as the barrier grows while the quantum probability current barely notices -- directly visualizing the paper's spectral-gap advantage. Frame it for the audience as "cheating past a bad beat / escaping a losing streak," with a caption noting that's a metaphor, not a physical claim.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-08-28-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-08-28-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
