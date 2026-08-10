export const meta = {
  name: 'arxiv-nightly-buildoff-2026-08-09',
  description: '3-way builder subagent build-off + judge for tonight\'s demo',
  phases: [
    { title: 'Build' },
    { title: 'Judge' },
  ],
}

const IDEAS = [
  {
    slug: 'curvature-mass',
    file: 'demos/2026-08-09-curvature-mass-a.html',
    paper: '2605.19183',
    title: 'Curvature Mass Playground',
    pitch: `Single-file three.js toy: morph a parametric mesh between a flat plane, sphere, saddle, and torus-neck via sliders. At every vertex, numerically estimate the extrinsic curvature tensor K_ab from the surface's second fundamental form and color the mesh by the paper's actual result m^2 = K_ab K^ab -- the "geometric mass" a nematic excitation acquires purely from being confined to that curved surface. Drop a draggable "defect" marker on the surface and a live side chart plots its effective mass spiking as you drag it toward high-curvature necks/saddle points vs. going flat (mass -> 0) on the plane. This turns an abstract differential-geometry claim (curvature literally engineers a mass term) into something you can feel by dragging a dot around a torus neck. The curvature computation must be real (numerically estimated from the mesh geometry, not faked/precomputed per shape).`,
  },
  {
    slug: 'shift-scope',
    file: 'demos/2026-08-09-shift-scope-b.html',
    paper: '2608.01268',
    title: 'Shift Scope: The Moment-Detection Scale Law You Can Feel',
    pitch: `The paper proves a hard limit: certifying a distribution-shift feature of spatial scale epsilon carrying mass fraction f requires a polynomial test of degree N* >= log(1/f)/(2*epsilon) -- and that the optimal witness is an RBF/MMD kernel with bandwidth sigma* = epsilon (empirically sigma*/epsilon median 1.12 across 26 real settings, AUC >= 0.95). Build a single-page demo: two overlapping 1D/2D point clouds (baseline vs. "shifted"), with sliders for the bump's width epsilon and mass f. Live-compute low-order moment tests (mean/variance/skew) and an RBF-MMD statistic as you sweep the kernel bandwidth slider -- watch moment tests go blind exactly where the formula predicts, and watch the MMD detection curve peak right at sigma=epsilon. A second panel plots N*(epsilon,f) from the formula against a "shift detected: yes/no" indicator so the user feels the log(1/f)/(2*epsilon) wall instead of reading it. The moment tests and MMD statistic must be real computations on real sampled point sets, not canned curves.`,
  },
  {
    slug: 'life-space',
    file: 'demos/2026-08-09-life-space-c.html',
    paper: '2505.15849',
    title: 'Life-Space: An Interactive Map of What Counts as "Alive"',
    pitch: `The paper's actual result isn't a definition of life -- it's that when you turn dozens of expert definitions into feature vectors and cluster/t-SNE them, life turns out to be a continuous landscape of themes (metabolism, reproduction, boundary, evolution, information-processing, etc.) rather than a binary category. Build a single-page toy that recreates that landscape: construct a small 2D embedding (using a handful of thematic axes pulled straight from the paper's clusters -- metabolism, reproduction, boundary, evolution, information-processing, etc., each entity scored on each axis) and place ~25 borderline entities on it -- virus, fire, prion, coral, AI chatbot, self-replicating 3D-printer, ecosystem, a frozen embryo, a beehive, a Von Neumann probe, crystal, etc. Let the user drag sliders defining a custom "entity" (toggle/weight which criteria it satisfies) and watch a dot glide across the same latent space, landing nearest to its closest real cluster (e.g. "fire" sits near "virus" -- high metabolism/reproduction, low boundary/evolution). The embedding math (distance/projection) must be real and computed live from the axis scores, not a static image.`,
  },
]

function builderPrompt(idea) {
  return `You are one of 3 competing builders in a nightly build-off. Build a genuinely polished, interactive single-file HTML demo for this idea, grounded in the real arXiv paper arxiv.org/abs/${idea.paper} -- fetch the abstract (and paper page if useful) first to ground the actual numbers/claims, then build.

Idea: ${idea.title}
${idea.pitch}

Requirements:
- Write the ENTIRE demo as ONE self-contained HTML file at ${idea.file} (relative to /home/david/code/arxiv-scrape). No build step, no backend. CDN <script> tags (three.js, d3, Chart.js, p5.js, etc.) are encouraged for richer visuals.
- Real interactivity (sliders/drag/toggle/keyboard) that changes what's rendered, not a static page.
- Good visual polish: real layout/typography/color, not browser defaults. Dark-mode friendly.
- A short in-page panel explaining the paper's real result in plain language, with the arXiv id linked.
- Ground every claimed number/formula in what the actual abstract says -- do not fabricate constants.
- Before returning, verify the file is valid, self-contained HTML that actually renders and runs (open/read it back, check for JS errors in the logic, check all tags are balanced). A demo that doesn't run is disqualified -- this matters more than extra polish.

Return a short summary: what you built, which real paper numbers you grounded it in, and confirmation you verified it runs.`
}

phase('Build')
const builds = await parallel(IDEAS.map(idea => () =>
  agent(builderPrompt(idea), { label: `build:${idea.slug}`, phase: 'Build' })
))

IDEAS.forEach((idea, i) => log(`Builder ${idea.slug}: ${builds[i] ? 'returned' : 'FAILED'}`))

phase('Judge')
const judgePrompt = `Three subagents each built a competing single-file HTML demo for tonight's arxiv-scrape nightly build-off. Judge them and pick ONE winner.

Files to open and inspect (read the raw HTML, and if you have browser/playwright tooling available, actually load each one and interact with it -- sliders, drags, toggles):
${IDEAS.map(idea => `- ${idea.file} (paper arxiv.org/abs/${idea.paper}, idea: ${idea.title})`).join('\n')}

Builder self-reports:
${IDEAS.map((idea, i) => `--- ${idea.slug} ---\n${builds[i] || '(builder failed / no result)'}`).join('\n\n')}

For each demo that actually exists and is valid self-contained HTML:
1. Verify it isn't broken (balanced tags, no obviously undefined functions called on interaction, CDN scripts referenced correctly).
2. Cross-check its claimed numbers/formulas against the real arXiv abstract for that paper id (fetch it) -- penalize fabricated numbers.
3. Score 1-9 each on: wow-factor, interactivity, polish, fidelity to the paper. Disqualify (score 0) anything that doesn't actually run/is not self-contained.
4. Pick the single coolest one that runs. If all fail, say so explicitly.

Return: per-demo scores + short justification, then a clear WINNER: <slug> line at the end (or WINNER: none if all failed).`

const judgment = await agent(judgePrompt, { label: 'judge', phase: 'Judge' })

return { ideas: IDEAS, builds, judgment }
