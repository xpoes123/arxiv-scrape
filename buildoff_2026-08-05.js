export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-05',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'consensus-clock',
    file: 'demos/2026-08-05-consensus-clock-a.html',
    paper: '2603.26822v1',
    title: 'Consensus Clock: The Voter Model Polarization Playground',
    pitch: `Single-file HTML/canvas toy: a network of colored dots (red vs. blue opinions) plays out the voter model — each tick, a random node copies a random neighbor's color. Two sliders drive the paper's actual result: 'modularity' (how clustered the network is into red/blue-ish communities) and 'asymmetry' (how stubborn/zealous one camp is relative to the other). Hit play and watch a live-updating chart of time-to-consensus. Crank modularity up and consensus time blows up exponentially — you can literally watch two filter bubbles refuse to talk to each other; crank asymmetry and one side steamrolls the other even from a minority start. Whimsy hook: preset buttons labeled 'Group Chat', 'Reddit Thread', and 'Thanksgiving Dinner' that just set modularity/asymmetry to funny extremes.`,
  },
  {
    slug: 'critical-point-parlay',
    file: 'demos/2026-08-05-critical-point-parlay-b.html',
    paper: '2606.20145',
    title: 'Critical Point Parlay',
    pitch: `The paper models markets as a lattice gas near its critical point, showing volatility and correlations both ramp up (via a quadratic trend->vol/corr fit) as a downtrend strengthens — i.e. everything starts moving together right before things break. Build a single-file HTML toy: a grid of glowing nodes (label them as NBA player props during a blowout) each doing a mini random walk; a 'trend strength' slider pumps up a coupling constant (Ising-style), and as it rises past a threshold the nodes visibly synchronize/flip together in cascades — a felt demonstration of critical slowing down and correlation spikes. Basketball skin: label nodes as players' prop lines and show how garbage-time game script makes previously-independent props (points, rebounds, assists) suddenly move as one correlated blob, exactly the copula/critical-phenomena intuition bettors ignore when they price parlays with naive correlation.`,
  },
  {
    slug: 'jittery-droplet',
    file: 'demos/2026-08-05-jittery-droplet-c.html',
    paper: '2605.13244v2',
    title: 'The Jittery Droplet',
    pitch: `The paper uses a fluctuation-dissipation framework to derive how a droplet's surface tension shifts with its radius (the Tolman-length correction to gamma_inf) by linking capillary-wave fluctuation amplitude to the dissipation that resists them. Build a single-file HTML/canvas toy: draw a wobbly circular droplet whose edge is animated with a live sum of random capillary-wave modes (a small Langevin simulation), with a radius slider. As you shrink the radius, the wave amplitudes visibly grow (fluctuations dominate more at small R) and a live-updating readout shows gamma(R) = gamma_inf * (1 - 2*delta/R) ticking down/up in real time next to the equation — so you can literally watch 'why nanoscale droplets are jumpier' instead of reading it.`,
  },
]

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    ran_ok: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['file', 'ran_ok', 'notes'],
}

phase('Build')
const builds = await parallel(IDEAS.map((idea) => () => agent(
  `You are one of 3 competing builder subagents in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo grounded in a real arXiv paper's result. Repo root: /home/david/code/arxiv-scrape (write your file relative to there, e.g. ${idea.file}).

Paper: arXiv:${idea.paper} — fetch the abstract from https://arxiv.org/abs/${idea.paper} (or the paper's HTML) to ground your demo in the actual math/result, don't just wing it from the pitch alone.

Idea title: "${idea.title}"
Pitch: ${idea.pitch}

Requirements:
- Output ONE self-contained HTML file at ${idea.file}. No build step, no backend. CDN libraries (three.js, d3, Chart.js, p5.js, etc via <script src="https://cdn...">) are encouraged for richer visuals — use a well-known CDN (cdnjs/jsdelivr) and add integrity="sha384-..." crossorigin="anonymous" subresource-integrity attrs on the script tag (the CDN's own docs page usually lists the correct hash for the version you pick).
- Real interactivity (sliders/drag/click) that visibly changes behavior tied to the paper's actual result — not just a static animation.
- Good visual polish: dark theme, clear typography, a short explainer of the paper's result and what the controls do.
- Before you return, sanity-check the file: read it back, verify it's well-formed HTML/JS with no obvious syntax errors, and if you have browser/playwright tooling available, actually open the file and confirm it renders and the controls work without console errors. A demo that doesn't run is disqualified — fix any bug you find.

Return via the schema: the file path, whether it actually runs cleanly (ran_ok), and brief notes on what you built / verified.`,
  { label: `build-${idea.slug}`, phase: 'Build', schema: BUILD_SCHEMA }
).then(r => ({ ...idea, build: r }))))

const validBuilds = builds.filter(Boolean)
log(`${validBuilds.length}/3 builders returned`)

phase('Judge')
const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    winner_slug: { type: 'string' },
    reasoning: { type: 'string' },
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          runs: { type: 'boolean' },
          wow_factor: { type: 'number' },
          interactivity: { type: 'number' },
          polish: { type: 'number' },
          fidelity: { type: 'number' },
        },
        required: ['slug', 'runs', 'wow_factor', 'interactivity', 'polish', 'fidelity'],
      },
    },
  },
  required: ['winner_slug', 'reasoning', 'scores'],
}

const judgeList = validBuilds.map(b => `- slug: ${b.slug}\n  file: ${b.file}\n  title: ${b.title}\n  paper: arXiv:${b.paper}\n  builder self-report: ran_ok=${b.build?.ran_ok}, notes: ${b.build?.notes}`).join('\n\n')

const verdict = await agent(
  `You are the judge of a 3-way arXiv-demo build-off. Repo root: /home/david/code/arxiv-scrape. Open each of these files (read the HTML, and if you have browser/playwright tooling, actually load and interact with each one) and score them:\n\n${judgeList}\n\nFor each: does it actually run with no errors (runs), and score 1-10 on wow_factor, interactivity, polish, and fidelity to the paper's actual result. DISCARD (runs=false) any that error out, are blank, or are non-functional — a broken demo cannot win even if ambitious. Pick the single coolest one that actually works as winner_slug. Return via the schema.`,
  { label: 'judge', phase: 'Judge', schema: JUDGE_SCHEMA }
)

return { builds: validBuilds.map(b => ({ slug: b.slug, file: b.file, title: b.title, paper: b.paper, ran_ok: b.build?.ran_ok, notes: b.build?.notes })), verdict }
