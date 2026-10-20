// Nightly ideation on the homelab Ollama model, batch by batch. Any batch that fails (disabled, HTTP
// error, timeout, bad JSON, invalid shape, prompt too long) lands in `failed_batches` so the nightly
// runs the existing Sonnet Workflow (ideation_workflow.js) over just those — the cloud fallback.
//
//   node ideate_local.mjs <papers.json> <out.json> [votes.json]
//
// Env: OLLAMA_URL (empty = disabled), OLLAMA_MODEL (gemma4:12b), OLLAMA_TIMEOUT (s, 60),
// OLLAMA_NUM_CTX (16384 — shared GPU; any other value forces a model reload for other apps).
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const TAGS = ['betting', 'poker', 'sports', 'games', 'gambling', 'decision-theory', 'ai', 'math', 'bio', 'physics', 'econ', 'whimsy']
const TYPES = ['project', 'startup', 'youtube', 'demo']
const MAX_BATCHES = 6
const NUM_PREDICT = 2048

export const IDEA_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: TYPES },
          title: { type: 'string' },
          paper_id: { type: 'string' },
          pitch: { type: 'string' },
          cool_score: { type: 'number' },
          buildable_score: { type: 'number' },
          discussion_score: { type: 'number' },
          discussion_why: { type: 'string' },
          tags: { type: 'array', items: { type: 'string', enum: TAGS } },
        },
        required: ['type', 'title', 'paper_id', 'pitch', 'cool_score', 'buildable_score', 'discussion_score', 'discussion_why', 'tags'],
      },
    },
  },
  required: ['ideas'],
}

export function voteNote(votes) {
  const tags = Object.entries((votes && votes.tags) || {}).filter(([, v]) => v)
  if (!tags.length) return 'No recent community vote signal on tags.'
  return 'Recent community net votes by tag: ' + tags.map(([t, v]) => `${t} ${v > 0 ? '+' : ''}${v}`).join(', ') +
    '. Up-weight positive tags, down-weight negative ones. Soft bias only, don\'t force it.'
}

export function prompt(batch, votes) {
  return `You are mining arXiv papers for cool, buildable ideas for a betting/poker/sports/games Discord server. Here are 5 fresh papers (id, category, title, summary):

${batch.map(p => '- ' + p.id + ' [' + p.cat + '] ' + p.title + '\n  ' + p.summary).join('\n')}

For this batch, surface 2-4 ideas total (not necessarily one per paper) tagged by type: project (build long-term), startup (a business), youtube (a video concept), or demo (a single-file interactive HTML toy -- a playable explainer or visualization that lets someone FEEL the paper's result, no backend). Be creative and specific -- reference the actual math/result, not just the title.

Score each idea on:
- cool_score (1-10): how cool/shareable
- buildable_score (1-10): how buildable literally tonight (demos should skew toward buildable as a single self-contained HTML file)
- discussion_score (1-10): how much this would spark debate on a betting/poker/sports/games Discord -- blend (i) debate/relatability, (ii) fit with betting/poker/sports/games/gambling/decision-theory, (iii) surprise ('wait, really?'), and (iv) whimsy (weird-and-delightful). Explain the blend briefly in discussion_why. ${voteNote(votes)}
- tags: pick from ${TAGS.join(', ')} (as many as fit).

Return JSON matching the schema.`
}

const base = id => String(id).split('v')[0]

// Same constraints the Workflow schema enforces on the Sonnet path, plus paper_id must be in the batch.
export function validIdeas(obj, batch) {
  const ideas = obj && obj.ideas
  if (!Array.isArray(ideas) || ideas.length < 1 || ideas.length > 4) return null
  const ids = new Set(batch.map(p => base(p.id)))
  for (const x of ideas) {
    if (!x || typeof x !== 'object' || !ids.has(base(x.paper_id))) return null
    if (!TYPES.includes(x.type) || !x.title || !x.pitch || typeof x.discussion_why !== 'string') return null
    for (const k of ['cool_score', 'buildable_score', 'discussion_score'])
      if (typeof x[k] !== 'number' || x[k] < 1 || x[k] > 10) return null
    if (!Array.isArray(x.tags) || !x.tags.every(t => TAGS.includes(t))) return null
  }
  return ideas
}

// Returns validated ideas, or null on ANY failure (caller falls back to cloud). Never throws.
export async function localIdeate(batch, votes, env = process.env) {
  const url = (env.OLLAMA_URL || '').replace(/\/+$/, '')
  if (!url) return null
  const numCtx = Number(env.OLLAMA_NUM_CTX || 16384)
  const content = prompt(batch, votes)
  // Ollama truncates silently past num_ctx; ~3 chars/token is conservative.
  if (Math.floor(content.length / 3) + NUM_PREDICT > numCtx) {
    console.error('local ideate: prompt too long for num_ctx, using cloud')
    return null
  }
  try {
    const resp = await fetch(url + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL || 'gemma4:12b',
        messages: [{ role: 'user', content }],
        stream: false,
        think: false,
        keep_alive: '24h',
        format: IDEA_SCHEMA,
        options: { temperature: 0, num_ctx: numCtx, num_predict: NUM_PREDICT },
      }),
      signal: AbortSignal.timeout(Number(env.OLLAMA_TIMEOUT || 60) * 1000),
    })
    if (!resp.ok) {
      console.error(`local ideate: HTTP ${resp.status}, using cloud`)
      return null
    }
    const data = await resp.json()
    const ideas = validIdeas(JSON.parse((data.message && data.message.content) || ''), batch)
    if (!ideas) console.error('local ideate: invalid idea shape, using cloud')
    return ideas
  } catch (e) {
    console.error(`local ideate failed (${e.name}: ${e.message}), using cloud`)
    return null
  }
}

export function toBatches(papers) {
  const slim = papers.map(p => ({
    id: p.id, cat: p.cat || p.category, title: p.title, summary: String(p.summary || '').slice(0, 400),
  }))
  const batches = []
  for (let i = 0; i < slim.length && batches.length < MAX_BATCHES; i += 5) batches.push(slim.slice(i, i + 5))
  if (slim.length > MAX_BATCHES * 5) console.error(`local ideate: using first ${MAX_BATCHES * 5} of ${slim.length} papers`)
  return batches
}

export async function run(papers, votes, env = process.env) {
  const ideas = [], failed_batches = []
  // Sequential: one shared GPU, and 6 calls/night doesn't need concurrency.
  for (const batch of toBatches(papers)) {
    const got = await localIdeate(batch, votes, env)
    if (got) ideas.push(...got.map(x => ({ ...x, source: 'local' })))
    else failed_batches.push(batch)
  }
  return { ideas, failed_batches }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [papersPath, outPath, votesPath] = process.argv.slice(2)
  if (!papersPath || !outPath) {
    console.error('usage: node ideate_local.mjs <papers.json> <out.json> [votes.json]')
    process.exit(2)
  }
  let votes = {}
  try { votes = JSON.parse(readFileSync(votesPath || 'votes.json', 'utf8')) } catch {}
  const out = await run(JSON.parse(readFileSync(papersPath, 'utf8')), votes)
  writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log(`${out.ideas.length} local ideas; ${out.failed_batches.length} batch(es) need the Sonnet fallback`)
}
