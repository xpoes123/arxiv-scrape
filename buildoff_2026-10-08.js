export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-08',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'segregation-from-nothing',
    title: 'Segregation From Nothing',
    paper: 'arXiv:2604.24998 — Relocation without preference: A destination-agnostic Schelling-type metapopulation model',
    pitch: `The paper's result: unlike the classic Schelling model (agents choose to move AWAY from neighbors unlike them), this model has families relocate completely at random -- the destination is picked with zero regard for who's already there. Segregation still emerges from the move dynamics alone, no preference required.

Build a single-file HTML toy: a canvas grid of two "colors" of agents on a lattice. Implement the actual destination-agnostic relocation rule from the paper (pick a random occupied-or-empty cell, move a random agent there -- NOT a preference-based swap). A "tick" button (and an auto-play toggle) advances the simulation, and a live segregation index (e.g. mean fraction of same-color neighbors, normalized against the random-grid baseline) climbs on a running chart as ticks accumulate. Include an explicit, honest "preference weight = 0" toggle/readout so skeptical users can confirm no clustering bias was secretly coded in. Add a caption connecting it to real-world clustering (betting-syndicate cliques, sports fanbases) that nobody consciously chose.`,
  },
  {
    slug: 'market-maker-arena',
    title: 'Market Maker Arena',
    paper: 'arXiv:2306.02764 — Optimal Market Making in the Chinese Stock Market: A Stochastic Control and Scenario Analysis',
    pitch: `The paper derives optimal bid/ask quoting under inventory risk and adverse selection via stochastic control: a market maker's optimal quotes skew around a "reservation price" that shifts with current inventory, and widen/narrow with a risk-aversion parameter, to defend against informed order flow mixed into noise-trader flow.

Build a single-file HTML arcade game: each tick, the player sets a bid/ask spread (sliders or +/- buttons) against simulated incoming order flow that's a mix of noise trades and a hidden informed trader whose trades are adverse-selected against the quote. Track and display live inventory and PnL. Implement the actual reservation-price formula from the paper (skewing quotes based on signed inventory and a risk-aversion term) and draw it as a reference line/ghost quote so the player can see exactly how the optimal control would have quoted versus their own quotes. End-of-round score compares the player's PnL/inventory-risk tradeoff against the stochastic-control benchmark running the same order flow -- "can you out-quote the HFT math" as a 2-minute game.`,
  },
  {
    slug: 'what-does-65-mean',
    title: 'What Does 65% Even Mean',
    paper: 'arXiv:2609.09855 — A Unifying Perspective on Probabilities as Model Predictions',
    pitch: `The paper reconciles the Bayesian vs. frequentist reading of a model's predicted probability (e.g. "65% win probability") -- both are describing the same underlying object, just viewed at different zoom levels (repeated-trial frequency vs. single-event credence), and a well-calibrated model is consistent with both readings simultaneously.

Build a single-file HTML explainer with three linked panels: (1) Frequentist view -- simulate many independent replays of a bet/game at a stated probability p and watch the empirical win-rate converge live to p as replays accumulate (law of large numbers, animated). (2) Bayesian view -- a single non-repeatable scenario where draggable sliders (e.g. injury news, late line move) update a toy posterior credence in real time, with no replays, emphasizing this game only happens once. (3) Calibration view -- pool many different one-off bets/games at many different stated probabilities and plot a real calibration curve (predicted p vs. empirical outcome rate, binned), showing the model can be well-calibrated in aggregate even though no single game in it was ever repeated -- visually proving both camps are compatible. Let the user drag in a "miscalibrated" model (biased probabilities) and watch the calibration plot visibly bend away from the diagonal.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-08-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (Chart.js, d3, three.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- pin with integrity="sha384-..." crossorigin="anonymous" where used.
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- run the actual underlying math/dynamics live in-browser rather than a pre-canned animation.
- Include a short on-page blurb crediting the paper (title + arXiv id) and explaining what result it's demonstrating.
- Before returning, sanity-check the HTML yourself (tags balance, no JS syntax errors, interactive elements wired up) -- ideally via a headless browser confirming zero console errors. A build that doesn't run is disqualified.

Return a short summary of what you built and confirmation it runs cleanly.`

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

const judgePrompt = `Three builders each wrote a self-contained HTML demo tonight. Open and evaluate each of these 3 files:
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-08-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs. Disqualify (runs=false) anything broken, and note why. Score the ones that run 1-10 on wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result. Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
