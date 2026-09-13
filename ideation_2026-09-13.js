export const meta = {
  name: 'arxiv-nightly-ideation-2026-09-13',
  description: 'Ideate project/startup/youtube/demo ideas from 15 fresh arXiv papers in batches of 5 (degraded fetch night: arXiv hard-blocked, only cs.AI/cs.CL categories succeeded)',
  phases: [
    { title: 'Ideate' },
  ],
}

const BATCHES = [
  [
    {id:'2609.05774v1',cat:'cs.AI',title:'Inference-Time Graph Engineering for Multi-Agent LLM Workflows'},
    {id:'2609.05766v1',cat:'cs.AI',title:'Data Scout: Targeted Web Crawling for Domain-Specific Pretraining Corpora'},
    {id:'2609.05764v1',cat:'cs.AI',title:'Interface-Aware KV Cache Quantization for Dense On-Chip NVM in Long-Context LLM Decoding'},
    {id:'2609.05761v1',cat:'cs.AI',title:'GeoContext: One Context Ladder, Two Failure Modes in Vision-Language Geolocation'},
    {id:'2609.05760v1',cat:'cs.AI',title:'RAGMark: A Comprehensive Framework for Benchmarking Retrieval-Augmented Generation Systems'},
  ],
  [
    {id:'2609.05758v2',cat:'cs.AI',title:'From Monolithic Blending to Agentic Orchestration: Dynamic Response for Conversational Assistants at Scale'},
    {id:'2609.05756v1',cat:'cs.AI',title:'Concord: A Video Relational Algebra for Cross-Modal Query Optimization'},
    {id:'2609.05749v1',cat:'cs.AI',title:'The Normalization of Deviance in AI Development'},
    {id:'2609.01182v1',cat:'cs.CL',title:'LLMPEDIA: Browsing, Verifying, and Comparing the Parametric Encyclopedic Knowledge of LLMs'},
    {id:'2609.01151v1',cat:'cs.CL',title:'Subword Segmental BabyLMs: Learning to Tokenise for Sample-Efficient Pretraining'},
  ],
  [
    {id:'2609.01147v1',cat:'cs.CL',title:'On the Design Fundamentals of Pixel Text Representation Learning'},
    {id:'2609.01139v1',cat:'cs.CL',title:'Does task decomposition improve automatic NLG evaluation?'},
    {id:'2609.01135v1',cat:'cs.CL',title:'Overfitting Mitigation via Singular Value Decomposition in Minimum Bayes Risk Decoding'},
    {id:'2609.01117v1',cat:'cs.CL',title:'Latent Recurrent Thoughts: Recurrent Refinement of Proposed Latents for Reasoning with Frozen LLMs'},
    {id:'2609.01113v1',cat:'cs.CL',title:'EDRAC: Benchmarking Arabic Dialect Reading Comprehension'},
  ],
]

const SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['project', 'startup', 'youtube', 'demo'] },
          title: { type: 'string' },
          paper: { type: 'string' },
          pitch: { type: 'string' },
          cool: { type: 'number' },
          buildable: { type: 'number' },
          discussion: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: ['betting','poker','sports','games','gambling','decision-theory','ai','math','bio','physics','econ','whimsy'] } },
        },
        required: ['type', 'title', 'paper', 'pitch', 'cool', 'buildable', 'discussion', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

function batchPrompt(batch) {
  const list = batch.map(p => `- ${p.id} [${p.cat}] ${p.title}`).join('\n')
  return `You're mining fresh arXiv papers for cool project/startup/YouTube-video/demo ideas. Here are 5 papers (fetch each abstract from arxiv.org/abs/<id> if you need more than the title to judge the actual result):
${list}

For each paper, propose 2-4 concrete ideas. Tag each idea's type: project (something to build/ship), startup (a business), youtube (a video/explainer concept), or demo (an interactive toy/visualization). Score each on:
- cool (1-10): how cool/shareable is this
- buildable (1-10): how buildable TONIGHT as a single self-contained HTML file with no backend (prefer interactive visualizations, playable toys, mind-bending demos)
- discussion (1-10): how much would this spark debate on a betting/poker/sports/games Discord server -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ("wait, really?"), (iv) whimsy (weird-and-delightful)
- discussion_why: one sentence naming which axis it wins on
- tags: pick from betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy

Return via the structured schema.`
}

phase('Ideate')
const results = await parallel(BATCHES.map((batch, i) =>
  () => agent(batchPrompt(batch), { label: `batch-${i + 1}`, phase: 'Ideate', schema: SCHEMA })
))

const allIdeas = results.filter(Boolean).flatMap(r => r.ideas)
log(`${allIdeas.length} ideas surfaced across ${BATCHES.length} batches`)
return { ideas: allIdeas }
