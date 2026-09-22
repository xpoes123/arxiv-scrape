export const meta = {
  name: 'arxiv-nightly-buildoff-2026-09-22',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'grow-or-go',
    title: 'Grow or Go: Cancer Cells Play GTO Poker',
    paper: 'arXiv:2510.23360 — Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells',
    pitch: `The paper models cancer cells inside a tumor as players in an evolutionary game: each cell can "stay and grow" (proliferate in place) or "go" (migrate to find resources / metastasize), competing for nutrients and oxygen. Depending on nutrient scarcity and mutation/heterogeneity parameters, the population settles into an evolutionarily stable mixed equilibrium — a fixed fraction stays, a fixed fraction goes — validated against real clear-cell renal carcinoma data. This is structurally identical to a GTO poker player randomizing between two actions in the right proportion so no deviation is profitable.

Build a single-file HTML toy: a canvas of many small cell-dots, each independently "choosing" grow (stay, pulse and multiply in place) or go (detach and migrate toward the edge, some reaching a "metastatic site" region). Sliders for nutrient scarcity and intratumor heterogeneity/mutation rate drive real replicator-dynamics equations (not a hand-tuned animation) that push the population's grow/go mix toward the evolutionarily stable equilibrium — show a live pie/bar readout of the current stay-vs-go ratio converging toward the theoretical ESS value as the simulation runs, and let the user drag the sliders mid-run and watch it re-converge. Explicitly draw the GTO-poker analogy on-page ("this is the same math as a solver's mixed-strategy frequencies").`,
  },
  {
    slug: 'solver-leak',
    title: 'Did the Solver Train on Your Hands?',
    paper: 'arXiv:2609.10935 — Empirical Evaluation of Membership Inference Attacks on NLP Text Classifiers',
    pitch: `The paper shows that a simple confidence-score/loss-threshold test — no gradients, no hacking — can tell with high accuracy whether a specific piece of text was part of a classifier's training set (tested on SST-2 sentiment classification with a fine-tuned DistilBERT reaching ~0.95 accuracy, and membership inference beating chance by exploiting that the model is measurably more confident on training members than non-members).

Build a single-file HTML toy that reskins this as a poker-solver leak detector. Train a tiny in-browser text/sentiment-style classifier (or a stand-in toy classifier over short synthetic "hand summary" strings) on a fixed set of "known" synthetic poker hand histories. Then let the user click through a mix of hands: some were in the training set, some are fresh/unseen. For each, show the model's confidence score and let the user guess member-or-not before revealing the real membership-inference verdict (threshold the confidence score, exactly like the paper's method) — and keep a running scoreboard of the user's guesses vs the simple-threshold attacker's guesses to make the "a confidence score alone beats your intuition" point land. Ground the actual threshold/accuracy numbers in the real paper.`,
  },
  {
    slug: 'pandemic-odds',
    title: 'Pandemic Odds: Bet the Threshold',
    paper: 'arXiv:2510.21371 — SIR models with demography, random transmission coefficient and non-autonomous vaccination rate',
    pitch: `The paper extends the classic SIR epidemic model with a randomly fluctuating (not fixed) transmission coefficient and a time-varying vaccination policy, and proves there's a sharp mathematical threshold: depending on the interplay of the randomness and the vaccination curve, the disease either goes extinct for good or settles into a permanent endemic equilibrium. Small changes near the threshold flip the long-run outcome entirely.

Build a single-file HTML toy that turns this into a betting game. Show the user a transmission-coefficient distribution (a slider for its mean and variance/"noise") and a vaccination-rate curve (a slider or simple curve editor for how aggressively vaccination ramps over time). Before running anything, the user wagers play-money on "eradication" or "endemic". Then run a live Monte Carlo simulation of the SIR trajectory (real stochastic differential/difference equations driven by the chosen parameters, not a canned animation) many times in-browser, show a fan chart of the trajectories, and reveal the empirical eradication-vs-endemic split alongside the paper's actual theoretical threshold condition — score the user's bet against both the simulated outcome and the "sharp bettor" (the theoretical threshold). Track a running bankroll across rounds so replaying and re-betting has stakes.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-09-22-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page. Run the actual underlying math/dynamics live in-browser (replicator dynamics / confidence-threshold classifier / stochastic SIR simulation as applicable) rather than a pre-canned or hand-tuned animation.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-09-22-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
