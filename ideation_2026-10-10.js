export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-10',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.07550v1",cat:"cs.LG",title:"Foundation Model-Aided Multi-Agent Reinforcement Learning for Wireless Random Access Network Optimization",summary:"Random access (RA) is one of the most foundational medium access control (MAC) layer scheduling schemes for handling unpredictable data traffic from multiple terminals. While multi-agent reinforcement learning (MARL) has been explored to optimize RA-based wireless networks, its reliance on experience-driven, distribute"},
    {id:"2610.06830v1",cat:"cs.AI",title:"MemPilot: Orchestrating On-Demand Multimodal Memory Curation for LLM Agents",summary:"Memory has become integral to the LLM agent ecosystem, supporting information retention and reuse across interactions. However, most existing agent memory systems construct memory in a query-agnostic manner, which can incur unnecessary preprocessing cost and discard details that later prove essential. Recent studies ha"},
    {id:"2610.00850v1",cat:"cs.CL",title:"AuraForge: Scaling Security Supervision for Training Coding Agents",summary:"Coding agents are now proficient enough to generate complex software applications from a single prompt. As their capabilities have grown, human oversight has increasingly shifted from line-by-line code review toward hands-off evaluation of outcomes. However, recent studies have shown that such a transition exposes a cr"},
    {id:"2609.24826v1",cat:"cs.CR",title:"OPBackdoor: Opportunistic Backdoors via Alibi-Aligned Reasoning",summary:"When a backdoor trigger activates the target response regardless of the triggered prompt context, the backdoor objective reveals itself. Challenging this trigger-sufficient formulation across the LLM backdoor literature, we introduce Opportunistic Backdoors (OPBackdoor), in which the backdoor objective is elicited only"},
    {id:"2608.08706v1",cat:"cs.DS",title:"Towards Lower Bounds for Geometric Spanners in High Dimension",summary:"We study the stretch--size tradeoff for geometric spanners in high-dimensional $\\ell_p$ spaces. Our main contribution is a simple proof of a lower bound shown by Har-Peled, Indyk, and Sidiropoulos [SODA 2013]: Every $2$-hop $t$-spanner of the pointset $\\{0,1\\}^d$ under $\\ell_2$ norm has at least $(2^d)^{1+Ω(1/t^2)}$ ed"},
  ],
  [
    {id:"2609.24878v1",cat:"math.CO",title:"Equilibrium Numbers in Non-Square Bimatrix Games",summary:"Bimatrix games may have an exponential number of mixed Nash equilibria if both dimensions of the game are allowed to grow. Bounds on their maximal number give structural insights that have been used to construct hard-to-solve games. We show new sharp or asymptotically sharp bounds on the (polynomial) number of equilibr"},
    {id:"2609.17798v1",cat:"math.OC",title:"Random tilts to find stationary points in stochastic convex optimization",summary:"We consider the problem of finding stationary points of stochastic convex functions and related variational inequalities. For each, we show that regularized empirical risk minimization, coupled with a random tilting perturbation, obtains stationarity residual order $\\sqrt{d/n}$ for $d$-dimensional problems given $n$ ob"},
    {id:"2609.13959v1",cat:"math.PR",title:"Majorizing Measures for Canonical Processes with Log-Concave Tails",summary:"Let $Y_1,\\ldots,Y_n$ be independent symmetric random variables with log-concave tails. We give a dimension-free characterization of the expected supremum of the canonical process $X_x=\\sum_{i=1}^n x_iY_i$ without any $Δ_2$ or regular-growth assumption on the coordinate tails. The characterization is governed by scale-d"},
    {id:"2609.07639v1",cat:"math.NT",title:"Residual finiteness and cuspidal cohomology of Picard modular surfaces",summary:"We prove that, for every non-uniform arithmetic lattice in $\\mathrm{SU}(2,1)$, its inverse images in the universal cover and in all connected finite covers are residually finite. The key new input is that every commensurability class of such lattices contains a congruence arithmetic lattice $Γ$ for which $$H^1_{\\mathrm"},
    {id:"2305.17881v1",cat:"q-fin.PM",title:"Integrating Different Informations for Portfolio Selection",summary:"Following the idea of Bayesian learning via Gaussian mixture model, we organically combine the backward-looking information contained in the historical data and the forward-looking information implied by the market portfolio, which is affected by heterogeneous expectations and noisy trading behavior. The proposed combi"},
  ],
  [
    {id:"2304.11010v1",cat:"q-fin.TR",title:"Invariance properties of maximal extractable value",summary:"We develop a formalism for reasoning about trading on decentralized exchanges on blockchains and a formulation of a particular form of maximal extractable value (MEV) that represents the total arbitrage opportunity extractable from on-chain liquidity. We use this formalism to prove that for blockchains with determinist"},
    {id:"2602.19645v1",cat:"econ.EM",title:"Pre-averaging estimators of the ex-post covariance matrix in noisy diffusion models with non-synchronous data",summary:"We show how pre-averaging can be applied to the problem of measuring the ex-post covariance of financial asset returns under microstructure noise and non-synchronous trading. A pre-averaged realised covariance is proposed, and we present an asymptotic theory for this new estimator, which can be configured to possess an"},
    {id:"2609.12410v1",cat:"stat.ML",title:"A Multimodal Explainable Deep Learning Framework for Alzheimer's Disease Diagnosis using 3D Magnetic Resonance Imaging and Clinical Data",summary:"Dementia is a major and growing global health burden, with Alzheimer's disease (AD) accounting for most cases. Timely and accurate diagnosis is central to managing this burden and increasingly depends on integrating complementary clinical and imaging information. Multimodal deep learning can combine these modalities fo"},
    {id:"2603.06816v1",cat:"q-bio.NC",title:"\"Dark Triad\" Model Organisms of Misalignment: Narrow Fine-Tuning Mirrors Human Antisocial Behavior",summary:"The alignment problem refers to concerns regarding powerful intelligences, ensuring compatibility with human preferences and values as capabilities increase. Current large language models (LLMs) show misaligned behaviors, such as strategic deception, manipulation, and reward-seeking, that can arise despite safety train"},
    {id:"2503.21450v6",cat:"q-bio.BM",title:"CMADiff: Cross-Modal Aligned Diffusion for Controllable Protein Generation",summary:"AI-assisted protein design has emerged as a critical tool for advancing biotechnology, as deep generative models have demonstrated their reliability in this domain. However, most existing models primarily utilize protein sequence or structural data for training, neglecting the physicochemical properties of proteins.Mor"},
  ],
  [
    {id:"2407.09811v1",cat:"q-bio.GN",title:"CellAgent: An LLM-driven Multi-Agent Framework for Automated Single-cell Data Analysis",summary:"Single-cell RNA sequencing (scRNA-seq) data analysis is crucial for biological research, as it enables the precise characterization of cellular heterogeneity. However, manual manipulation of various tools to achieve desired outcomes can be labor-intensive for researchers. To address this, we introduce CellAgent (http:/"},
    {id:"2603.12351v1",cat:"q-bio.QM",title:"Probabilistic Joint and Individual Variation Explained (ProJIVE) for Data Integration",summary:"Collecting multiple types of data on the same set of subjects is common in modern scientific applications including, genomics, metabolomics, and neuroimaging. Joint and Individual Variance Explained (JIVE) seeks a low-rank approximation of the joint variation between two or more sets of features captured on common subj"},
    {id:"2510.23360v1",cat:"q-bio.PE",title:"Effect of intratumor heterogeneity in managing the go-or-grow dichotomy of cancer cells: a game theory modeling to understand metastasis",summary:"We study the effect of intratumor heterogeneity in the likelihood of cancer cells moving from a primary tumor to other sites in the human body, generating a metastatic process. We model different scenarios of competition between tumor cells using a static evolutionary game in which cells compete for nutrients and oxyge"},
    {id:"2607.03549v2",cat:"physics.chem-ph",title:"Intrinsic Matching Frustration in Fluctuating Finite Systems",summary:"We formulate intrinsic matching frustration (IMF), a fluctuation-induced, kinetics-independent reduction in the mean capacity permitted by a prescribed matching rule. For complementary one-to-one matching, the instantaneous capacity is set by the minority population, so fluctuations produce a nonzero mean deficit even "},
    {id:"2607.07102v1",cat:"cond-mat.soft",title:"Spontaneous patterning of cell size on curved surfaces",summary:"Tissue surfaces exhibit complex curvature during embryogenesis and oncogenesis. Evidence shows that cells can actively sense curvature to regulate behavior and fate, yet the underlying mechanism remains unclear. Here, we develop a vertex model for arbitrary curved surfaces and uncover spontaneous cell size patterning o"},
  ],
  [
    {id:"2608.24867v1",cat:"cond-mat.stat-mech",title:"Fast generation of spectrally-shaped disorder, on the sphere",summary:"The design of disordered point patterns with desirable properties is an exciting and ongoing research endeavor, with applications ranging from materials to computer science. A successful approach in recent years has been the optimization of point patterns through a loss function that enforces properties in their Fourie"},
    {id:"2605.18779v1",cat:"physics.soc-ph",title:"Achieving Generational Peace in Mali through Intergenerational Mean-Field-Type Game-based Incentives",summary:"This article develops an intergenerational mean-field-type game (MFTG) to model Mali's and neighbouring countries multi-actor conflict ecosystem, which includes formal state forces, traditional hunters, nonstate militias, jihadists, criminal networks, civil societies, and international proxies. Each decision-maker (age"},
    {id:"2610.07540v1",cat:"cs.LG",title:"Preserving Unstable Modes Through Inverse Dynamics in JEPA World Models",summary:"Robotic systems often exhibit unstable modes, along which small perturbations and disturbances can cause unbounded growth unless corrected through feedback. Controlling such systems from high-dimensional visual observations requires representations that preserve these modes. Joint-embedding predictive architectures (JE"},
    {id:"2610.07130v1",cat:"cs.AI",title:"Is this machine playing?",summary:"We placed a modern AI coding assistant in an unintended role: as the mind of a body on an unknown digital island. With only a minimal instruction mentioning no specific task, reward, or activity, the machine started animating its virtual body. Across thirty-hour runs, the embodied AI agent climbed hills, stacked blocks"},
    {id:"2610.00840v1",cat:"cs.CL",title:"Contextual trajectory and incremental contextual displacement: Towards using LLMs to understand dynamic, utterance-specific meaning construction",summary:"Transformer-based large language models (LLMs) such as RoBERTa represent text using contextual word embeddings (CWEs), which alter the embeddings associated with each token based on surrounding context. We construct token-wise incremental trajectories by repeatedly recomputing a token's CWE as successive words are adde"},
  ],
  [
    {id:"2609.24801v1",cat:"cs.CR",title:"Decoding Guardrails: XAI-Guided Perturbation Analysis of Prompt Injection Detection",summary:"Large language models (LLMs) are increasingly deployed in production systems, raising concerns about their exposure to adversarial manipulation through prompt injection and jailbreak attacks. Classifier-based guardrails, such as Prompt Guard 2, are widely used as a first line of defense against such attacks, but their "},
    {id:"2608.08662v1",cat:"cs.DS",title:"Kernel Methods for Refined Prophet Inequalities",summary:"The single-selection prophet inequality is a canonical Bayesian online selection problem in which independent nonnegative values arrive sequentially and the decision-maker must irrevocably select at most one. Classical single-threshold guarantees are tight in the worst case, but the hard instances that prove tightness "},
    {id:"2609.24845v1",cat:"math.CO",title:"Complete Reductions and Idempotent Representations for $RΠΣ^*$-towers",summary:"$RΠΣ^*$-extensions form a rich class of difference rings that provide a unified algebraic framework for modeling indefinite nested sums, transcendental products, and nested products over roots of unity structures that frequently appear in combinatorics, number theory, and particle physics. For a large subclass of these"},
    {id:"2609.17784v1",cat:"math.OC",title:"Centroids for weak optimal transport with barycentric cost",summary:"We generalize the theory of Wasserstein barycenters between N given measures from the Wasserstein distance to the weak optimal transport problem with barycentric cost. We find a multi-marginal formulation and its dual problem. The multi-marginal problem is new in itself; contrary to the classical multi-marginal optimal"},
    {id:"2609.17596v1",cat:"math.PR",title:"Joint Continuity and Selberg--ODE Equivalence for the $\\mathrm{Sine}_β$ Pair Correlation Function",summary:"We address two questions posed by Qu and Valkó in their study of the pair correlation function of the $\\mathrm{Sine}_β$ process. First, we prove that the pair correlation function admits a jointly continuous version in the inverse-temperature and spatial parameters on $(0,\\infty)\\times\\mathbb{R}$, removing the restrict"},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):\n\n${batch.map(p => `- ${p.id} [${p.cat}] ${p.title}\n  ${p.summary}`).join('\n')}\n\nFor this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.\n\nScore each idea on:\n- cool_score (1-10): how cool/shareable\n- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)\n- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: betting, decision-theory, math, and ai tags have mild positive community reception recently (soft bias, don't force it) -- no tags have negative reception yet.\n- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).\n\nReturn via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
