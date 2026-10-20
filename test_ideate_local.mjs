// node --test test_ideate_local.mjs
import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { run, localIdeate } from './ideate_local.mjs'

const PAPERS = Array.from({ length: 10 }, (_, i) => ({ id: `2610.0000${i}v1`, category: 'cs.LG', title: `P${i}`, summary: 's' }))
const ENV = { OLLAMA_URL: 'http://ollama.test:11434', OLLAMA_NUM_CTX: '16384' }
const realFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = realFetch })

const idea = id => ({
  type: 'demo', title: 't', paper_id: id, pitch: 'p', cool_score: 7, buildable_score: 8,
  discussion_score: 6, discussion_why: 'w', tags: ['math'],
})
const reply = obj => ({ ok: true, status: 200, json: async () => ({ message: { content: JSON.stringify(obj) } }) })

test('local success: all batches local, request shape', async () => {
  const bodies = []
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body); bodies.push(body)
    assert.equal(url, 'http://ollama.test:11434/api/chat')
    const first = body.messages[0].content.match(/- (\S+) \[/)[1]
    return reply({ ideas: [idea(first), idea(first.replace('v1', ''))] })
  }
  const out = await run(PAPERS, {}, ENV)
  assert.equal(out.ideas.length, 4)
  assert.deepEqual(out.failed_batches, [])
  assert.ok(out.ideas.every(x => x.source === 'local'))
  const b = bodies[0]
  assert.equal(b.options.num_ctx, 16384)
  assert.equal(b.options.temperature, 0)
  assert.equal(b.stream, false)
  assert.equal(b.think, false)
  assert.equal(b.keep_alive, '24h')
  assert.equal(b.model, 'gemma4:12b')
  assert.equal(typeof b.format, 'object')
})

test('fallback: HTTP error, bad JSON, wrong paper_id, network error -> failed_batches', async () => {
  const cases = [
    async () => ({ ok: false, status: 500, json: async () => ({}) }),
    async () => ({ ok: true, status: 200, json: async () => ({ message: { content: 'not json' } }) }),
    async () => reply({ ideas: [idea('9999.99999v1')] }),
    async () => reply({ ideas: [{ ...idea('2610.00000v1'), cool_score: 11 }] }),
    async () => { throw new TypeError('fetch failed') },
  ]
  for (const f of cases) {
    globalThis.fetch = f
    assert.equal(await localIdeate(PAPERS.slice(0, 5).map(p => ({ ...p, cat: p.category })), {}, ENV), null)
  }
  globalThis.fetch = cases[0]
  const out = await run(PAPERS, {}, ENV)
  assert.equal(out.ideas.length, 0)
  assert.equal(out.failed_batches.length, 2)
  assert.equal(out.failed_batches[0][0].cat, 'cs.LG')
})

test('disabled: empty OLLAMA_URL makes no request', async () => {
  globalThis.fetch = async () => { throw new Error('should not be called') }
  const out = await run(PAPERS, {}, { OLLAMA_URL: '' })
  assert.equal(out.ideas.length, 0)
  assert.equal(out.failed_batches.length, 2)
})

test('prompt too long for num_ctx -> cloud without a request', async () => {
  globalThis.fetch = async () => { throw new Error('should not be called') }
  assert.equal(await localIdeate([{ id: 'x', cat: 'c', title: 't', summary: 's' }], {}, { ...ENV, OLLAMA_NUM_CTX: '1000' }), null)
})
