export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-11',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.07529v1",cat:"cs.LG",title:"Targeted search shows that random-device testing underestimates worst-case error in a simulated wave-based neural operator",summary:"Wave-based processors promise fast, energy-efficient Fourier layers for neural operators. They are usually validated on randomly sampled devices, but using them requires knowing how large their error can become under fabrication and alignment variation. In a stylised numerical case study, a hybrid F"},
    {id:"2610.06814v2",cat:"cs.AI",title:"TAPDreamer: Transferable Adversarial Patches for World Action Models",summary:"World models learn to predict how their environment will evolve, making them an important foundation for general-purpose robotic control. Yet world action models depend on camera inputs whose manipulation can corrupt the visual representations used across tasks and action policies. Existing attacks "},
    {id:"2610.07127v1",cat:"cs.AI",title:"PlaySuite: A Large-Scale Benchmark for Interactive Visual Intelligence",summary:"Recent advances in multimodal foundation models yield strong performance on static perception and reasoning benchmarks, yet such evaluations largely overlook a central aspect of intelligence: acting competently in dynamic environments over extended time horizons. We introduce PlaySuite, a large-scal"},
    {id:"2610.00827v1",cat:"cs.CL",title:"Verbalized and Internal Probabilities Are Coupled in Large Language Models",summary:"Large language models carry an internal notion of uncertainty in their sampling distribution, i.e., the probabilities they place on generating one answer rather than another. They can also be asked to state a confidence, in words or as a number: a verbalized uncertainty. Prior work suggests that int"},
    {id:"2609.25173v1",cat:"cs.CR",title:"Attack Success Rate Is Not a Number: On Measurement Validity in Agentic AI Security Evaluation",summary:"Attack success rate (ASR) is the headline metric in nearly every published evaluation of attacks on, and defenses for, LLM agents. We argue that ASR as currently used is not a single quantity but a family of metrics parameterized by six design choices that papers seldom specify and never hold consta"},
  ],
  [
    {id:"2608.08616v3",cat:"cs.DS",title:"A Counting and Sampling Lovász Local Lemma",summary:"We establish counting and sampling analogues of the Lovász Local Lemma: we give efficient algorithms for approximately counting and exactly sampling satisfying assignments of general constraint satisfaction problems (CSPs) in the local lemma regime $$4 \\mathrm{e} p (D+1)^2\\leq 1, $$ where $p$ is the"},
    {id:"2608.08291v2",cat:"cs.DS",title:"CKR Partitions and Lower Bounds for Constrained Correlation Clustering and Variants",summary:"By using a simple textbook reduction from vertex cover, we show that the following three problems are all UG-hard to approximate with constant-factor smaller than two; minimum weakness strong triadic closure, cluster deletion and constrained correlation clustering. Additionally, we analyze the well-"},
    {id:"2609.24779v1",cat:"math.CO",title:"Notes on a strongly aperiodic monotile in $E^3$",summary:"We provide a clearer presentation of the Chair44 monotile, a new strongly aperiodic monotile in three-dimensional Euclidean space $E^3$."},
    {id:"2609.24775v1",cat:"math.CO",title:"Discrepancy theory, Tverberg's theorem, and regression depth",summary:"We prove new bounds for Tverberg's theorem with tolerance. We show that $N = rt+Θ_{d,r}(t^{1/2-1/(2d)})$, where $N$ is the smallest number such that any set of $N$ points in $\\mathbb{R}^d$ has a partition into $r$ parts such that the convex hulls of the parts intersect even if we remove any $t$ of t"},
    {id:"2609.17713v1",cat:"math.OC",title:"A tight 1/3-approximation algorithm and fully polynomial-time approximation schemes for the Colored Knapsack Problem",summary:"The $\\textit{Colored Knapsack Problem}$ (ColKP) generalizes the classical Knapsack Problem by partitioning the items into color classes and requiring the selected items to admit an ordering in which consecutive items have different colors. The problem is weakly $\\mathcal{NP}$-hard and admits two pse"},
  ],
  [
    {id:"2609.13828v1",cat:"math.PR",title:"Viscosity Solutions for Singular HJB Equations: BSDE Representations and Stochastic Control",summary:"We introduce a notion of viscosity solution for Hamilton--Jacobi--Bellman (HJB) equations with distributional drift, based on paracontrolled test functions and related through a Zvonkin transformation to classical viscosity theory. The equations considered are of the form \\[ \\left(\\partial_t+\\frac12"},
    {id:"2609.13570v1",cat:"math.PR",title:"Cutoff for q-deformed classical card shuffles in the type A Iwahori--Hecke algebra",summary:"We study the mixing behavior of three q-deformed card shuffles on $\\mathcal{H}_q(S_n)$: the short systematic scan introduced in \\cite{DiaconisRam2000}, the $q$--deformed random--to--random shuffle introduced in \\cite{AxelrodFreedBraunerChiangComminsLang2024}, and the $q$--deformed $k$--star transpos"},
    {id:"2609.07268v1",cat:"math.NT",title:"The exponent of harmonic LCM avoidance",summary:"Fix $k\\ge 3$, and let $f_k(N)$ be the largest harmonic sum of a subset of $[N]$ containing no $k$ distinct integers with a common pairwise least common multiple. We prove that $f_k(N)=(\\log N)^{γ_k+o(1)}$ for a well-defined exponent $γ_k\\in(0,1]$. Following the weighted-pressure idea of Chojecki, we"},
    {id:"2305.14604v2",cat:"q-fin.PM",title:"Automated Market Making and Arbitrage Profits in the Presence of Fees",summary:"We consider the impact of trading fees on the profits of arbitrageurs trading against an automated market maker (AMM) or, equivalently, on the adverse selection incurred by liquidity providers (LPs) due to arbitrage. We extend the model of Milionis et al. [2022] for a general class of two asset AMMs"},
    {id:"2304.06037v2",cat:"q-fin.TR",title:"Quantitative Trading using Deep Q Learning",summary:"Reinforcement learning (RL) is a subfield of machine learning that has been used in many fields, such as robotics, gaming, and autonomous systems. There has been growing interest in using RL for quantitative trading, where the goal is to make trades that generate profits in financial markets. This p"},
  ],
  [
    {id:"2602.18592v1",cat:"econ.EM",title:"A Roof Over Risk: A House Price-at-Risk Framework for Hungary",summary:"This paper develops a House Price-at-Risk framework to examine how housing subsidies, credit conditions, and supply factors influence the distribution of house price growth in Hungary. Using quantile regression with adaptive LASSO variable selection, we identify variables driving downside versus ups"},
    {id:"2609.12243v1",cat:"stat.ML",title:"Chopthin-Consensus Power Sampling: A Diversity-Preserving Approach to LLM Decoding",summary:"Inference-time power sampling via Sequential Monte Carlo (SMC) can substantially improve large language model (LLM) reasoning without requiring post-training. However, many existing SMC approaches rely on equal-weight resampling, which can aggressively prune low-weight trajectories, discarding poten"},
    {id:"2603.04688v1",cat:"q-bio.NC",title:"Why the Brain Consolidates: Predictive Forgetting for Optimal Generalisation",summary:"Standard accounts of memory consolidation emphasise the stabilisation of stored representations, but struggle to explain representational drift, semanticisation, or the necessity of offline replay. Here we propose that high-capacity neocortical networks optimise stored representations for generalisa"},
    {id:"2603.04149v1",cat:"q-bio.NC",title:"Topological Origin of the Diversity of Timescales in Recurrent Neural Circuits",summary:"Structural and functional heterogeneity are hallmarks of cortical circuits, from broad degree distributions in the mouse connectome to diverse intrinsic neuronal timescales. Yet a mechanistic link between connectivity heterogeneity and functional diversity is lacking. To bridge this gap, we introduc"},
    {id:"2503.19067v1",cat:"q-bio.BM",title:"Clustering data by reordering them",summary:"Grouping elements into families to analyse them separately is a standard analysis procedure in many areas of sciences. We propose herein a new algorithm based on the simple idea that members from a family look like each other, and don't resemble elements foreign to the family. After reordering the d"},
  ],
  [
    {id:"2503.19821v2",cat:"q-bio.BM",title:"IgCraft: A versatile sequence generation framework for antibody discovery and engineering",summary:"Designing antibody sequences to better resemble those observed in natural human repertoires is a key challenge in biologics development. We introduce IgCraft: a multi-purpose model for paired human antibody sequence generation, built on Bayesian Flow Networks. IgCraft presents one of the first unifi"},
    {id:"2407.07265v1",cat:"q-bio.GN",title:"Pseudo-perplexity in One Fell Swoop for Protein Fitness Estimation",summary:"Protein language models trained on the masked language modeling objective learn to predict the identity of hidden amino acid residues within a sequence using the remaining observable sequence as context. They do so by embedding the residues into a high dimensional space that encapsulates the relevan"},
    {id:"2510.22220v1",cat:"q-bio.PE",title:"Evolution of the lexicon: a probabilistic point of view",summary:"The Swadesh approach for determining the temporal separation between two languages relies on the stochastic process of words replacement (when a complete new word emerges to represent a given concept). It is well known that the basic assumptions of the Swadesh approach are often unrealistic due to v"},
    {id:"2510.18589v2",cat:"q-bio.PE",title:"Inheritance Entropy: A Model-Independent Method to Probe the Hereditary Structure of Cell Lineage Trees",summary:"Human bone marrow stromal cells (BMSC) include skeletal stem cells with ground-breaking therapeutic potential. However, BMSC colonies have very heterogeneous in vivo behaviour, due to their different potency; this unpredictability is the greatest hurdle to the development of skeletal regeneration th"},
    {id:"2607.02946v1",cat:"physics.chem-ph",title:"Chemical applicability of $π$-Sombor index",summary:"The Sombor index ($SO$) and the modified Sombor index (${}^m SO$) are two closely related vertex-degree-based graph invariants. Both were introduced in the early 2020s and have found diverse applications in chemical, physicochemical, and network-theoretical studies. In 2023, the $π$-Sombor index was"},
  ],
  [
    {id:"2607.02784v1",cat:"physics.chem-ph",title:"Auditing Haldane Consistency in Reversible Enzyme Kinetics: A Curated Two-Sided Backbone and a Labeled Fold-Error Benchmark",summary:"Reversible enzyme kinetic constants can be audited through the Haldane relation: the apparent equilibrium constant implied by the rate law should match biochemical thermodynamics under matched conditions. We use the reciprocal cost $C_{\\mathrm{Haldane}}=J(K'_{\\mathrm{eq,kin}}/K'_{\\mathrm{eq,thermo}}"},
    {id:"2608.24382v1",cat:"cond-mat.stat-mech",title:"Exact autoregressive sampling of planar Ising spin glasses via the Kac--Ward theory",summary:"Exact sampling from the Boltzmann distribution of spin glasses remains an outstanding challenge: Markov chain Monte Carlo methods suffer from critical slowing down and metastable trapping, while modern neural autoregressive samplers such as variational autoregressive networks are approximate and, in"},
    {id:"2608.24689v1",cat:"cond-mat.stat-mech",title:"Jerky Motion of Active Granular Particles",summary:"Abrupt transitions between rest and motion can render the standard Newtonian description -- based on position, velocity, and acceleration -- incomplete, requiring higher-order derivatives such as the jerk, the third time derivative of position. Here, we show that the interplay between activity and d"},
    {id:"2604.24998v1",cat:"physics.soc-ph",title:"Relocation without preference: A destination-agnostic Schelling-type metapopulation model",summary:"In this work, we propose and analyze a novel Schelling-type metapopulation model that examines how random relocations of families between neighborhoods can lead to segregation. The model consists of a large number of houses organized into $N$ neighborhoods with $L$ houses each, without any spatial s"},
    {id:"2604.25175v1",cat:"physics.soc-ph",title:"Indirect reciprocity beyond pairwise interactions",summary:"Cooperation in groups underpins collective responses to challenges from climate governance to public goods provision, yet how moral evaluation sustains it remains poorly understood. Indirect reciprocity -- cooperating to build a good reputation -- is well characterized for pairwise interactions, but"},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, math, decision-theory tags have mild positive community reception recently, games mildly positive too, gambling/ai slightly positive -- no tags have negative reception (soft bias, don't force it).\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
