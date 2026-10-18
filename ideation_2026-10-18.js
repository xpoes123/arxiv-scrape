export const meta = {
  name: 'arxiv-nightly-ideation-2026-10-18',
  description: 'Ideate project/startup/youtube/demo ideas from 30 fresh arXiv papers in batches of 5, with a discussion axis',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:"2610.17190v1",cat:"cs.LG",title:"CartoVec: General-Purpose Location Embeddings from Open Map Data",summary:"Geographic coordinates are common inputs in applied machine learning, but latitude and longitude describe position rather than the surrounding environment. Image-grounded location encoders learn this context from satellite or ground-level imagery; structured open map data offers another source of supervision whose utility for continuous coordinate encoders remains less explored. We introduce Carto"},
    {id:"2610.17189v1",cat:"cs.LG",title:"Soft Teacher Forcing",summary:"Soft tokens have so far been used to replace discrete chain-of-thought in latent reasoning methods. These approaches typically require multi-stage training and, in some cases, auxiliary modules, yet they still underperform supervised fine-tuning (SFT) on <input, chain-of-thought, output> triples. In this paper, we ask whether soft tokens can be used to improve SFT itself, instead of as an avenue f"},
    {id:"2610.17206v1",cat:"cs.AI",title:"AutoMARS: Automatic and Scalable Multi-Agent Large Language Model Framework for Supply Chain Risk Assessment",summary:"We propose AutoMARS (Automatic Multi-Agent Risk Assessment), an agentic framework for automatic and scalable comparative risk assessment in supply chain networks. The framework enables end-to-end execution of analytical workflows by automatically planning tasks, coordinating specialized agents, invoking external analytical tools, and synthesizing domain-specific results into integrated risk evalua"},
    {id:"2610.11959v1",cat:"cs.CL",title:"MiMo-V2.6: Scaling Reinforcement Learning Towards Self-Improvement",summary:"Reinforcement learning (RL) is the central training paradigm for advancing large foundation models towards self-improvement. This report introduces the MiMo-V2.6 series, an omni-modal family that pushes the frontier of model intelligence by scaling RL compute. Prior to RL, we conduct mid-training on a broad multimodal corpus to provide ample exploration space, and build a solid infrastructure on t"},
    {id:"2609.33763v1",cat:"cs.CR",title:"SecProbe: Adaptive Evaluation of Coding Agents on Cybersecurity Vulnerabilities",summary:"Assessing cybersecurity vulnerability awareness in coding agents requires evaluations that reveal capability gaps and remain informative as models evolve. Static benchmarks offer fixed coverage and difficulty, while scarce vulnerable repositories and costly expert authoring limit their renewal at scale. We introduce SecProbe, a framework for adaptive evaluation that combines Item Response Theory ("},
  ],
  [
    {id:"2608.20018v2",cat:"cs.DS",title:"The Greedy Superstring Algorithm Achieves Ratio 2 for Strings of Length 6 Already",summary:"In the Shortest Common Superstring (SCS) problem, one is given a set of strings and is asked to find a string of minimum length containing each of the input strings as a substring. The greedy superstring conjecture states that the following natural greedy algorithm has approximation ratio $2$: while there is more than one string, select the pair of strings with the maximum overlap, merge them, and"},
    {id:"2609.33919v2",cat:"math.CO",title:"Uniform Factor-Balancedness in Arnoux-Rauzy Words",summary:"We characterize uniform factor-balancedness in Arnoux-Rauzy words, generalizing the work of Espinoza, Popoli, and Stipulanti on ternary alphabets to finite alphabets of any size. In particular, we prove that an Arnoux-Rauzy word $\\mathbf{x}$ is uniformly factor-balanced if and only if $\\mathbf{x}$ has bounded weak partial quotients."},
    {id:"2609.28263v1",cat:"math.OC",title:"Resource-Adaptive Stochastic Gradient Descent for Online Linear Programming without Re-solving",summary:"The growth of large language model (LLM) inference and search services increases the scale of online linear programming problems, motivating computationally efficient algorithms. We develop resource-adaptive stochastic gradient descent (RASGD) for stochastic online linear programming. The algorithm uses one request and current inventory to update resource prices, requiring O(m) operations for m re"},
    {id:"2609.21476v1",cat:"math.PR",title:"A short proof of the Bernoulli decomposition theorem",summary:"We give a construction of admissible partitions that yields the Bernoulli decomposition theorem"},
    {id:"2609.21359v1",cat:"math.PR",title:"Limit shape, avalanches, and stabilisation of abelian sandpiles on comb lattices",summary:"We study two aspects of the abelian sandpile model on comb lattices. First, we prove that the infinite-volume limit of the stationary measures is supported on the saturated configuration. We then investigate the shape of avalanches induced by adding a particle at the origin in finite boxes of size $(2n+1)\\times(2n+1)$ around the origin. In the stationary distribution on these finite boxes, we show"},
  ],
  [
    {id:"2609.16700v1",cat:"math.NT",title:"Triple divisor type functions in arithmetic progressions to prime power moduli",summary:"We study the equidistribution in arithmetic progressions modulo powers of a fixed odd prime of Hecke eigenvalues of noncuspidal $\\mathrm{GL}_3$ automorphic forms, with a focus on the convolution coefficients $\u03bb_{1\\boxplus f}(n)=(\u03bb_f\\star 1)(n)$,attached to a level $1$ holomorphic primitive cusp form $f$. Utilizing techniques introduced by Kowalski--Lin--Michel and Mili\u0107evi\u0107, we prove the exponent "},
    {id:"2305.05663v1",cat:"q-fin.PM",title:"Proofs that the Gerber Statistic is Positive Semidefinite",summary:"In this brief note, we prove that both forms of the Gerber statistic introduced in Gerber et al. (2022) are positive semi-definite."},
    {id:"2305.08740v1",cat:"q-fin.PM",title:"Temporal and Heterogeneous Graph Neural Network for Financial Time Series Prediction",summary:"The price movement prediction of stock market has been a classical yet challenging problem, with the attention of both economists and computer scientists. In recent years, graph neural network has significantly improved the prediction performance by employing deep learning on company relations. However, existing relation graphs are usually constructed by handcraft human labeling or nature language"},
    {id:"2303.08867v4",cat:"q-fin.TR",title:"A Bayesian theory of market impact",summary:"The available liquidity at any time in financial markets falls largely short of the typical size of the orders that institutional investors would trade. In order to reduce the impact on prices due to the execution of large orders, traders in financial markets split large orders into a series of smaller ones, which are executed sequentially. The resulting sequence of trades is called a meta-order. "},
    {id:"2303.11959v2",cat:"q-fin.TR",title:"Optimizing Trading Strategies in Quantitative Markets using Multi-Agent Reinforcement Learning",summary:"Quantitative markets are characterized by swift dynamics and abundant uncertainties, making the pursuit of profit-driven stock trading actions inherently challenging. Within this context, reinforcement learning (RL), which operates on a reward-centric mechanism for optimal control, has surfaced as a potentially effective solution to the intricate financial decision-making conundrums presented. Thi"},
  ],
  [
    {id:"2602.19287v1",cat:"econ.EM",title:"Asymptotic theory of range-based multipower variation",summary:"In this paper, we present a realized range-based multipower variation theory, which can be used to estimate return variation and draw jump-robust inference about the diffusive volatility component, when a high-frequency record of asset prices is available. The standard range-statistic -- routinely used in financial economics to estimate the variance of securities prices -- is shown to be biased wh"},
    {id:"2609.27241v1",cat:"stat.ML",title:"On the Sample Complexity of Active Learning with Membership Queries",summary:"This work revisits a fundamental question in active learning: how powerful is the ability to synthesize arbitrary queries? Compared to pool-based active learning, where the learner only selects queries from a given unlabeled pool, we find that this seemingly mild change in query ability may dramatically alter the difficulty of statistical learning. In particular, some hypothesis classes that are i"},
    {id:"2609.27206v1",cat:"stat.ML",title:"Prediction with Expert Advice: Anytime Regret with Many Experts Matches the Fixed-Time Constant",summary:"Prediction with expert advice is a fundamental problem in online learning. When the time horizon $T$ is known in advance, the minimax cumulative regret over $n$ experts is asymptotically $\\sqrt{\\frac{T \\ln n}{2}}$. This is achieved by the Multiplicative Weights Update algorithm with a learning rate tuned to $T$, and is known to be tight. If instead the regret bound is required to hold simultaneous"},
    {id:"2603.09089v2",cat:"q-bio.NC",title:"Sampling on Discrete Spaces with Temporal Point Processes",summary:"Temporal point processes offer a powerful framework for sampling from discrete distributions, yet they remain underutilized in existing literature. We show how to construct, for any target multivariate count distribution with downward-closed support, a multivariate temporal point process whose event-count vector in a fixed-length sliding window converges in distribution to the target as time tends"},
    {id:"2504.02839v2",cat:"q-bio.BM",title:"PETIMOT: A Novel Framework for Inferring Protein Motions from Sparse Data Using SE(3)-Equivariant Graph Neural Networks",summary:"Proteins move and deform to ensure their biological functions. Despite significant progress in protein structure prediction, approximating conformational ensembles at physiological conditions remains a fundamental open problem. This paper presents a novel perspective on the problem by directly targeting continuous compact representations of protein motions inferred from sparse experimental observa"},
  ],
  [
    {id:"2407.02538v2",cat:"q-bio.GN",title:"CGRclust: Chaos Game Representation for Twin Contrastive Clustering of Unlabelled DNA Sequences",summary:"This study proposes CGRclust, a novel combination of unsupervised twin contrastive clustering of Chaos Game Representations (CGR) of DNA sequences, with convolutional neural networks (CNNs). To the best of our knowledge, CGRclust is the first method to use unsupervised learning for image classification (herein applied to two-dimensional CGR images) for clustering datasets of DNA sequences. CGRclus"},
    {id:"2603.16185v1",cat:"q-bio.QM",title:"Sample-Efficient Adaptation of Drug-Response Models to Patient Tumors under Strong Biological Domain Shift",summary:"Predicting drug response in patients from preclinical data remains a major challenge in precision oncology due to the substantial biological gap between in vitro cell lines and patient tumors. Rather than aiming to improve absolute in vitro prediction accuracy, this work examines whether explicitly separating representation learning from task supervision enables more sample-efficient adaptation of"},
    {id:"2510.17016v1",cat:"q-bio.PE",title:"Ambush strategy impacts species predominance and coexistence in rock-paper-scissors models",summary:"We investigate the adaptive Ambush strategy in cyclic models following the rules of the spatial rock-paper-scissors game. In our model, individuals of one species possess cognitive abilities to perceive environmental cues and assess the local density of the species they dominate in the spatial competition for natural resources. Based on this assessment, they either initiate a direct attack or, if "},
    {id:"2510.18889v1",cat:"q-bio.PE",title:"Prejudice driven spite: A discontinuous phase transition in ultimatum game",summary:"In a mix of prejudiced and unprejudiced individuals engaged in strategic interactions, the individual intensity of prejudice is expected to have effect on overall level of societal prejudice. High level of prejudice should lead to discrimination that may manifest as unfairness and, perhaps, even spite. In this paper, we investigate this idea in the classical paradigm of the ultimatum game which we"},
    {id:"2607.10514v1",cat:"physics.chem-ph",title:"Theoretical study of electronic structure and spectroscopic properties of the TlO molecule",summary:"The electronic structure and properties of the thallium monoxide (TlO) molecule, as well as its cation and anion, have been systematically studied using both the relativistic Fock-space coupled cluster method with full inclusion of connected triple excitations and the density functional theory. For the first time, detailed data on the low-lying electronic states of TlO, its cation, and anion have "},
  ],
  [
    {id:"2607.11799v2",cat:"cond-mat.soft",title:"Universal scalings and switching entropy in yield-stress fluids",summary:"Yield-stress fluids transition from solid-like to liquid-like behavior at a critical stress threshold, governing phenomena from industrial processing to geological flows. While predominantly investigated under steady shear, large-amplitude oscillatory tests force these materials to cyclically navigate between arrested and fluidized states. Here, we discover a hidden universal behavior where the dy"},
    {id:"2608.31130v1",cat:"cond-mat.stat-mech",title:"Colorful Exponential Random Graph Models",summary:"In this paper, we initiate the study of colored exponential random graph models (ERGMs), a class of exponential-family models for networks with multiple types of edge relations. Using the framework of probability graphons, we first derive a variational representation for the limiting free energy, whose maximizers determine the asymptotic structure of typical samples from the model. Then we identif"},
    {id:"2608.31114v1",cat:"cond-mat.stat-mech",title:"Overcoming critical slowing down in frustrated spin systems by learned multiscale sampling",summary:"Cluster algorithms, such as the Swendsen--Wang and Wolff methods, are among the most successful MCMC methods for mitigating critical slowing down in statistical systems. These constructive cluster algorithms, however, fail in the presence of even extremely weak frustration. Here, we sidestep this fundamental limitation by learning rather than constructing the relevant clusters. Specifically, we us"},
    {id:"2604.28003v2",cat:"physics.soc-ph",title:"The Synergistic Route to Stretched Criticality",summary:"Griffiths phases are typically associated with quenched disorder, while frustration gives rise to multistability and spin-glass behavior. Whether extended criticality can arise in other contexts remains an open question. Here, we show that synergistic interactions provide a distinct route to non-conventional critical phenomena. By combining spreading mechanisms that reinforce activity through comp"},
    {id:"2604.27961v2",cat:"physics.soc-ph",title:"Clustering in co-evolving opinion dynamics: reduced SPDE models",summary:"Clustering is a fundamental collective phenomenon in agent-based models (ABMs) of opinion dynamics. To study clustering in systems with co-evolving social and opinion variables, we derive stochastic partial differential equation (SPDE) models that describe the evolution of clusters. Specifically, these SPDE models are reduced in the sense that their domain accounts only for social variables, while"},
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
    `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):

${batch.map(p => '- ' + p.id + ' [' + p.cat + '] ' + p.title + '\n  ' + p.summary).join('\n')}

For this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.

Score each idea on:
- cool_score (1-10): how cool/shareable
- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)
- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. Note: decision-theory, betting, math, games tags have mild positive community reception recently (net +2 votes each), gambling mildly positive (+1); no tags have negative reception. Soft bias only, don't force it.
- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy (as many as fit).

Return via the schema.`,
    { schema: IDEA_SCHEMA, label: `batch-${idx + 1}`, phase: 'Ideate' }
  )
)

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas || [])
log(`${allIdeas.length} ideas generated across ${BATCHES.length} batches`)
return { ideas: allIdeas }
