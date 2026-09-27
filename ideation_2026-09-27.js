export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-27',
  description: 'Ideate project/startup/youtube/demo ideas from 28 fresh arXiv papers in batches of 5, scored for coolness/buildability/discussion',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2609.29142",cat:"cs.LG",title:"Not Every Token Is Worth Distilling: Selective Supervision for Direct-OPD"},
    {id:"2609.29144",cat:"cs.AI",title:"Scope Before You Persist: Preventing Cross-Family Interference in Agent Memory"},
    {id:"2609.29056",cat:"cs.CL",title:"Empath: Tracing Multi-Level Emotion Dynamics in Crisis Counseling Dialogues"},
    {id:"2609.27857",cat:"cs.CR",title:"ChronosAttack: Adversarial Tool Scheduling Attacks on LLM Agents"},
    {id:"2609.23855",cat:"cs.DS",title:"Kadison--Singer partitions and Bilu--Linial graph signings in polynomial time"},
  ],
  [
    {id:"2609.28455",cat:"math.CO",title:"On the multicolour Ramsey numbers $R(3,3,k)$"},
    {id:"2609.27902",cat:"math.OC",title:"Resilient Monitoring of Social Dynamical Systems through Collaborative Multi-Agent Networks under Latency"},
    {id:"2609.27765",cat:"math.PR",title:"The Type-II Error of Test Supermartingales: e-Power versus the Chernoff-Stein Exponent"},
    {id:"2609.28141",cat:"math.NT",title:"Locally analytic representations in mixed characteristic via stacks"},
    {id:"2609.29887",cat:"q-fin.PM",title:"Cost-Sensitive Online Window Size Selection for Portfolio Management"},
  ],
  [
    {id:"2609.29108",cat:"q-fin.TR",title:"Functional Architecture of European Electricity Trading Markets: Requirements for AI Supported Trading Systems under Regulatory Constraints"},
    {id:"2609.27912",cat:"econ.EM",title:"Global tree forecasters collapse at the hierarchical aggregate: a five-panel failure characterization"},
    {id:"2609.26406",cat:"stat.ML",title:"SuperPCA: subspace analysis and an efficient algorithm for high-dimensional PCA"},
    {id:"2609.23977",cat:"q-bio.NC",title:"Binding-Motivated Contextuality: A Cross-Domain Cyclic Test in Perception and Judgment"},
    {id:"2609.29155",cat:"q-bio.BM",title:"ProteoEM: probabilistic protein abundance estimation from iterative affinity traces"},
  ],
  [
    {id:"2609.30013",cat:"q-bio.GN",title:"EMMA: an R/Bioconductor package to automate tracking of metadata in functional enrichment analyses"},
    {id:"2609.29523",cat:"q-bio.QM",title:"Towards Trustworthy Biological Alignment in TabPFN-Probed Pathology Foundation Models"},
    {id:"2609.30154",cat:"q-bio.PE",title:"Consistent determination of stability regimes in natural ecological communities from abundance time series"},
    {id:"2609.24342",cat:"physics.chem-ph",title:"Bubble detachment from circular cavities and flat surfaces"},
    {id:"2609.27410",cat:"cond-mat.soft",title:"Multigeometric Breathing Mode Framework for viruses"},
  ],
  [
    {id:"2609.24993",cat:"cond-mat.stat-mech",title:"Quantum Mpemba effect from Stark localization"},
    {id:"2609.27113",cat:"q-fin.PM",title:"Active Portfolio Management in Concentrated Equity Markets"},
    {id:"2609.27786",cat:"q-fin.TR",title:"Feasible Multi-Asset Optimal Execution under Cash Constraints"},
    {id:"2609.27200",cat:"econ.EM",title:"Local Optimality and Rigidity of Frobenius Tests for Dense High-Dimensional Covariance Alternatives"},
    {id:"2609.27757",cat:"math.PR",title:"Negative moments of the support function and applications to isotropic convex bodies"},
  ],
  [
    {id:"2609.28417",cat:"math.CO",title:"Ehrhart polynomials of cyclic polytopes as averages of zonotope Ehrhart polynomials"},
    {id:"2609.29972",cat:"q-bio.PE",title:"Mathematical Modelling of Within-Host HIV Dynamics with Cytotoxic Immune Response and Antiretroviral Therapy"},
    {id:"2609.24905",cat:"cond-mat.stat-mech",title:"Channel concentration of critical quantum geometry"},
  ],
]

const IDEA_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper_id: { type: 'string' },
          pitch: { type: 'string' },
          cool_score: { type: 'number' },
          buildable_score: { type: 'number' },
          discussion_score: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score', 'discussion_score', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

phase('Ideate')
const results = await pipeline(
  BATCHES,
  (batch, _item, idx) => agent(
    `You are mining arXiv papers for cool, buildable ideas. Here are fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on:\n- cool_score (1-10, how cool/shareable)\n- buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend)\n- discussion_score (1-10, how much this would spark debate on a betting/poker/sports/games Discord server) — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise/counterintuitiveness, (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick 1-4 from [betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy] that best describe the idea.\n\nBe creative and specific — reference the actual math/result, not just the title. Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
