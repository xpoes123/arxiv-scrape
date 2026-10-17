export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-03',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.37930',cat:'cs.LG',title:"Learning What to Remember: Long-horizon Counterfactual Memory Optimization"},
    {id:'2609.37402',cat:'cs.AI',title:"Routing Should Pay for Itself: Sparse Supervision for Economical LLM Routing"},
    {id:'2609.32565',cat:'cs.CL',title:"Reading Is Not Leaking: Local, Auditable Measurement and Reduction of Inference Exposure from Public Footprints"},
    {id:'2609.13930',cat:'cs.CR',title:"Enforcement of In-Kernel Stateful Security Policies via eBPF"},
    {id:'2609.16376',cat:'math.CO',title:"Elementary proofs of congruences modulo 5 for overpartitions with restricted odd differences"},
  ],
  [
    {id:'2609.08537',cat:'math.OC',title:"The Exact Time-Uniform Rate Frontier for Stochastic Gradient Descent on Smooth Convex Objectives"},
    {id:'2609.06482',cat:'math.PR',title:"Fluctuating Kinetic Theory: A Poissonian Stochastic Boltzmann Equation"},
    {id:'2608.30608',cat:'math.NT',title:"Joint Equidistribution of Subspaces of Bounded Height in Rigid Adelic Spaces"},
    {id:'2306.10950',cat:'q-fin.PM',title:"Benchmarking Robustness of Deep Reinforcement Learning approaches to Online Portfolio Management"},
    {id:'2305.06704',cat:'q-fin.TR',title:"Robust Detection of Lead-Lag Relationships in Lagged Multi-Factor Models"},
  ],
  [
    {id:'2602.17543',cat:'econ.EM',title:"genriesz: A Python Package for Automatic Debiased Machine Learning with Generalized Riesz Regression"},
    {id:'2608.26060',cat:'stat.ML',title:"Fine-Tuning Whisper for Automatic Speech Recognition in Baniwa: A Preliminary Study"},
    {id:'2603.03355',cat:'q-bio.NC',title:"Inhibitory Cross-Talk Enables Functional Lateralization in Attention-Coupled Latent Memory"},
    {id:'2504.03590',cat:'q-bio.BM',title:"Towards a Unified Framework for Determining Conformational Ensembles of Disordered Proteins"},
    {id:'2407.13260',cat:'q-bio.GN',title:"High nucleotide skew palindromic DNA sequences function as replication origins due to their unzipping propensity"},
  ],
  [
    {id:'2603.12307',cat:'q-bio.QM',title:"SHREC: A Spectral Embedding-Based Approach for Ab-Initio Reconstruction of Helical Molecules"},
    {id:'2510.25085',cat:'q-bio.PE',title:"Explorations of Epidemiological Dynamics across Multiple Population Hubs"},
    {id:'2606.30494',cat:'physics.chem-ph',title:"Spontaneous Symmetry Breaking and Emergent Helicity in Achiral D4h-Symmetric Zinc Phthalocyanine Condensates"},
    {id:'2607.02171',cat:'cond-mat.soft',title:"Theory of collective learning in populations of adaptive agents"},
    {id:'2608.19325',cat:'cond-mat.stat-mech',title:"Statistical Mechanics of Non-Abelian Learnability Transitions"},
  ],
  [
    {id:'2604.22976',cat:'physics.soc-ph',title:"Statistical Mechanics of Household Income and Wealth: Derivation from Firm Dynamics via Maximum Entropy and Mixture Aggregation"},
    {id:'2609.37924',cat:'cs.LG',title:"Time-Anchored Diffusion Language Models: Latent-Space Caching for Fast Generation"},
    {id:'2609.37398',cat:'cs.AI',title:"Direct Experience World-Model Optimization: Learning the World Beyond Action Imitation"},
    {id:'2609.32560',cat:'cs.CL',title:"How to Reduce Whisper Hallucination"},
    {id:'2609.13889',cat:'cs.CR',title:"When Malicious Instructions Persist: Persistent Memory Poisoning Attack on Harness-Based Agents"},
  ],
  [
    {id:'2609.25063',cat:'math.CO',title:"Optimal complete-feedback card guessing under nonincreasing valley weights: A proof of the Diaconis-Fulman-Holmes shelf-shuffling conjecture"},
    {id:'2609.08522',cat:'math.OC',title:"Rank-Adaptive and Linearly Convergent Frank--Wolfe Method over Spectrahedron via Nonconvex Oracle"},
    {id:'2609.06459',cat:'math.PR',title:"Rate of convergence of a fully discrete structure-preserving midpoint scheme for the stochastic Landau--Lifshitz--Gilbert equation"},
    {id:'2608.30576',cat:'math.NT',title:"Relative Langlands duality of the Bump-Friedberg-Ginzburg $\\mathrm{GSO}_6$-integral"},
    {id:'2306.09421',cat:'q-fin.PM',title:"FLAIR: A Metric for Liquidity Provider Competitiveness in Automated Market Makers"},
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
    `You are mining arXiv papers for cool, buildable ideas. Here are fresh paper titles/categories/ids (fetch abstracts from arxiv.org/abs/<id> if you want more detail, but titles alone are often enough to riff on):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (something to actually build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy — a playable explainer or visualization that lets someone FEEL the paper's result). Score each on:\n- cool_score (1-10, how cool/shareable)\n- buildable_score (1-10, how buildable literally tonight — demos should skew toward buildable as a single self-contained HTML file with no backend)\n- discussion_score (1-10, how much this would spark debate on a betting/poker/sports/games Discord server) — blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports, games, gambling, decision-theory), (iii) surprise/counterintuitiveness, (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why.\n- tags: pick 1-4 from [betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy] that best describe the idea.\n\nBe creative and specific — reference the actual math/result, not just the title. The card-guessing/shelf-shuffling paper is a strong poker/games fit; the AMM liquidity-provider and portfolio-management papers fit betting/decision-theory; lean into those where relevant. Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
