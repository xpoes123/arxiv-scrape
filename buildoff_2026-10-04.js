export const meta = {
  name: 'arxiv-nightly-buildoff-2026-10-04',
  description: '3-way build-off of demo ideas from tonight\'s forum top-3, then judge picks the winner',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'normal-at-last',
    title: 'How Many Bets Until You\'re "Normal"?',
    paper: 'arXiv:2609.06358 — The Berry-Esseen Constant Conjecture is Eventually True',
    pitch: `The paper proves the Berry-Esseen inequality sup_x |F_n(x) - Phi(x)| <= C * rho / (sigma^3 * sqrt(n)) holds with the sharp constant C ~ 0.4097 once n is past a (huge, but finite) threshold -- rho is the third absolute moment of your per-trial outcome distribution, sigma its standard deviation.

Build a single-file HTML toy: user picks a bet shape via two presets (or sliders) -- a near-coinflip -110 bet (win 52.4% for 1x payout) vs a longshot bet (e.g. win 25% for a 3x payout) -- both tuned to roughly the same edge. The page live-simulates thousands of n-bet sample paths in-browser (real random sampling, not canned), plots the empirical CDF of the average outcome after n bets against the normal-approximation CDF, and shades the Berry-Esseen error envelope C*rho/(sigma^3*sqrt(n)) shrinking as n grows via a slider (n = 10, 50, 200, 1000...). Make the divergence visually obvious: the longshot bet's empirical CDF should visibly lag/wobble away from the normal curve far longer than the coinflip bet's, with the shrinking error band explaining why. Compute rho, sigma, and the envelope from the actual chosen bet parameters live, not hardcoded.`,
  },
  {
    slug: 'cluster-mirage',
    title: 'Cluster Mirage',
    paper: 'arXiv:2603.11344 — Hybrid eTFCE-GRF: Exact Cluster-Size Retrieval with Analytical p-Values for Voxel-Based Morphometry',
    pitch: `The paper replaces slow permutation testing for cluster-extent inference (used in brain-scan neuroimaging to decide "is this blob of activity real or noise") with closed-form analytical p-values derived from Gaussian Random Field (GRF) theory -- it tells you exactly how large a contiguous "blob" of statistically-significant cells has to be before it stops being explainable by pure noise, given the grid's smoothness.

Build a single-file HTML toy: a canvas grid (e.g. 50x50 cells, representing games x prop/split combinations) filled with pure random noise (real randomness, re-rollable with a button) smoothed slightly (simple blur convolution to mimic spatial correlation, mirroring the GRF smoothness parameter). Compute per-cell naive p-values from the noise and threshold at p<0.05 -- light up every cell that "looks significant" on its own (there will be many, purely from chance). Then apply a real cluster-extent correction: find connected components (union-find/flood-fill) of thresholded cells, compute each cluster's size, and use an actual GRF-style analytical formula (expected Euler characteristic / cluster-size null distribution, simplified but mathematically real, not faked) to compute a corrected p-value per cluster -- clusters below the corrected significance size fade out. The "wow" is watching dozens of fake significant cells light up, then almost all of them vanish once the real cluster-size correction is applied. Add a slider for grid smoothness and a re-roll button to show this happens every time from zero real signal.`,
  },
  {
    slug: 'hot-hand-illusion',
    title: 'Hot Hand Illusion Machine',
    paper: 'arXiv:2304.11883 — Recurrent neural network based parameter estimation of Hawkes model on high-frequency financial data',
    pitch: `The paper fits Hawkes self-exciting point processes (where each event temporarily raises the intensity/rate of the next event) to high-frequency trading data using an RNN, as a faster alternative to maximum-likelihood estimation -- same underlying math used to model clustered bursts of activity (trades, or, reskinned here, made shots).

Build a single-file HTML toy: two side-by-side live "shot tickers" running for ~60 simulated seconds each, both tuned to the SAME long-run average make-rate. Stream A is a plain homogeneous Poisson process (makes happen at a constant rate, independent of history -- real randomness). Stream B is a Hawkes process: implement the actual self-exciting intensity function lambda(t) = mu + alpha * sum(exp(-beta*(t - t_i)) for past makes t_i) in-browser, with sliders for alpha (excitation) and beta (decay), and simulate it with a real thinning/Ogata algorithm (not faked bursts) so makes genuinely cluster when alpha is high. Show a live intensity curve under each ticker. Ask the user to guess, before a reveal toggle, which stream is "streaky" / has a hot hand -- almost everyone will pick the Hawkes stream even though both have identical average rates and zero actual skill differential. Track a running tally of how often users guess "Hawkes = hot hand" to reinforce the illusion point. Include a reset/reroll so every run is a fresh random simulation.`,
  },
]

const BUILD_PROMPT = (idea, letter) => `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the actual arXiv paper's result:

Title: ${idea.title}
Paper: ${idea.paper}
Pitch: ${idea.pitch}

Requirements:
- Fetch the paper's abstract from arxiv.org/abs/<id> (strip the version suffix if needed) to ground the actual numbers/claims/mechanism you show -- don't just go on the pitch text, verify against the real abstract. If arxiv.org is unreachable/rate-limited after a couple tries, proceed using the pitch's description of the result (it was derived from the abstract) and note that in your summary.
- Write ONE self-contained HTML file to /home/david/code/arxiv-scrape/demos/2026-10-04-${idea.slug}-${letter}.html -- inline all CSS/JS, no build step, no backend. CDN libraries (three.js, d3, p5.js, Chart.js, etc via <script src="https://cdn..."></script>) are encouraged for richer visuals -- if you use one, add integrity="sha384-..." crossorigin="anonymous" to the tag (fetch the file and run openssl dgst -sha384 -binary | openssl base64 -A to compute the real hash, don't guess).
- Make it genuinely interactive (sliders, drag, click, live-updating charts/canvas) with a real "wow" -- not a static explainer page. Run the actual underlying math/dynamics live in-browser (the real Berry-Esseen envelope computation, real GRF-style cluster correction, or a real Hawkes thinning simulation, as applicable) rather than a pre-canned or hand-tuned animation.
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
${IDEAS.map((idea, i) => `- /home/david/code/arxiv-scrape/demos/2026-10-04-${idea.slug}-${String.fromCharCode(97 + i)}.html (paper: ${idea.paper})`).join('\n')}

For each: verify it actually runs (open/read the HTML, check for balanced tags, JS syntax sanity, that interactive elements are wired up -- use a headless browser/node check if you have the tools, otherwise a careful manual read). Disqualify (runs=false) anything broken, and note why.

Score the ones that run 1-10 on: wow-factor, interactivity, polish, and fidelity to the paper's actual claimed result (re-check against the real arXiv abstract). Pick the single coolest one that actually runs as winnerSlug. Return via the schema.`

const judgement = await agent(judgePrompt, { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA })

return { ideas: IDEAS, builds, judgement }
