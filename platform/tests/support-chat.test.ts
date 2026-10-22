// AI support chat (lib/support): settings, request checks, limits, the panel's site facts and the Gemini call — with a
// fake fetch (no request leaves the machine) and local storage.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import { getDataAdapter } from '../lib/data/index.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { supportChat, supportStatus, parseTurns } from '../lib/support/chat.ts';
import { supportConfig, SUPPORT_LIMITS, type SupportConfig } from '../lib/support/config.ts';
import { askGemini, geminiBody, type FetchLike } from '../lib/support/gemini.ts';
import { systemInstruction } from '../lib/support/knowledge.ts';
import { chatCopy } from '../components/support/copy.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

before(() => {
  const themes = tmpDir('support-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('support-data-');
});

const LIVE: SupportConfig = { mode: 'live', available: true, apiKey: 'test-key-123', model: 'gemini-2.5-flash', dailyLimit: 200 };

function chatReq(body: unknown, opts: { key?: string; ip?: string; type?: string } = {}): Request {
  const headers = new Headers({ 'content-type': opts.type ?? 'application/json', 'x-forwarded-for': opts.ip ?? '203.0.113.7' });
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  return new Request('http://localhost:3000/api/support/chat', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });
}

const ask = (text: string, extra: Record<string, unknown> = {}) => ({ messages: [{ role: 'user', text }], context: 'market', ...extra });

/** A fake Gemini: records each call and answers with `reply` (or a status). */
function fakeGemini(answer: { status?: number; reply?: string; body?: unknown } = {}) {
  const calls: Array<{ url: string; headers: Headers; body: any }> = [];
  const fetchImpl: FetchLike = async (url, init) => {
    calls.push({ url, headers: new Headers(init.headers), body: JSON.parse(String(init.body)) });
    const status = answer.status ?? 200;
    const body = answer.body ?? { candidates: [{ content: { parts: [{ text: answer.reply ?? 'You buy it on Etsy. See the [FAQ](/faq).' }] }, finishReason: 'STOP' }] };
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  };
  return { calls, fetch: fetchImpl };
}

test('config: no key = not available; demo and off modes; model and daily limit from the environment', () => {
  assert.equal(supportConfig({}).available, false);
  assert.equal(supportConfig({}).model, 'gemini-2.5-flash');
  assert.equal(supportConfig({ GEMINI_API_KEY: ' k ' }).apiKey, 'k');
  assert.equal(supportConfig({ GEMINI_API_KEY: 'k' }).available, true);
  assert.equal(supportConfig({ GEMINI_API_KEY: 'k', SUPPORT_CHAT: 'off' }).available, false);
  assert.equal(supportConfig({ SUPPORT_CHAT: 'demo' }).available, true);
  assert.equal(supportConfig({ GEMINI_MODEL: 'gemini-2.5-flash-lite' }).model, 'gemini-2.5-flash-lite');
  assert.equal(supportConfig({ GEMINI_MODEL: '../../evil?x=1' }).model, 'gemini-2.5-flash');
  assert.equal(supportConfig({ SUPPORT_DAILY_LIMIT: '50' }).dailyLimit, 50);
  assert.equal(supportConfig({ SUPPORT_DAILY_LIMIT: 'abc' }).dailyLimit, 200);
});

test('status: tells the window whether the assistant can answer', async () => {
  assert.deepEqual(await (await supportStatus({ config: { ...LIVE, available: false, apiKey: null } })).json(), { ok: true, available: false });
  assert.deepEqual(await (await supportStatus({ config: LIVE })).json(), { ok: true, available: true });
});

test('turns: alternating, last from the user, greeting dropped, limits enforced', () => {
  assert.equal(parseTurns([]), null);
  assert.equal(parseTurns('hi'), null);
  assert.equal(parseTurns([{ role: 'system', text: 'x' }]), null);
  assert.equal(parseTurns([{ role: 'user', text: 'a' }, { role: 'assistant', text: 'b' }]), null, 'must end with the user');
  assert.equal(parseTurns([{ role: 'user', text: 'x'.repeat(SUPPORT_LIMITS.userChars + 1) }]), null);
  assert.deepEqual(parseTurns([{ role: 'assistant', text: 'Hi!' }, { role: 'user', text: ' Hello ' }]), [{ role: 'user', text: 'Hello' }]);
  const many = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: `m${i}` }));
  many.push({ role: 'user', text: 'last' });
  const turns = parseTurns(many)!;
  assert.ok(turns.length <= SUPPORT_LIMITS.maxTurns);
  assert.equal(turns[0].role, 'user');
  assert.equal(turns.at(-1)!.text, 'last');
});

test('chat without a key: 503 not_ready, Google is never called', async () => {
  const g = fakeGemini();
  const res = await supportChat(chatReq(ask('Hi')), { config: supportConfig({}), fetch: g.fetch, limiter: new MemoryRateLimiter() });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).code, 'not_ready');
  assert.equal(g.calls.length, 0);
});

test('chat: bad requests', async () => {
  const deps = { config: LIVE, fetch: fakeGemini().fetch, limiter: new MemoryRateLimiter() };
  assert.equal((await supportChat(chatReq(ask('Hi'), { type: 'text/plain' }), deps)).status, 415);
  assert.equal((await supportChat(chatReq('{nope'), deps)).status, 400);
  assert.equal((await supportChat(chatReq({ messages: [] }), deps)).status, 400);
  assert.equal((await supportChat(chatReq('x'.repeat(SUPPORT_LIMITS.maxBodyBytes + 10)), deps)).status, 413);
});

test('chat: asks Gemini with the key in a header (not the URL), the shop knowledge and the conversation', async () => {
  const g = fakeGemini({ reply: 'You buy it on Etsy.' });
  const res = await supportChat(
    chatReq({ messages: [{ role: 'assistant', text: 'Hi! greeting' }, { role: 'user', text: 'How do I buy?' }], context: 'market', page: '/designs/olive-ivory' }),
    { config: LIVE, fetch: g.fetch, limiter: new MemoryRateLimiter() },
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, reply: 'You buy it on Etsy.' });
  assert.equal(g.calls.length, 1);
  const call = g.calls[0];
  assert.match(call.url, /\/v1beta\/models\/gemini-2\.5-flash:generateContent$/);
  assert.ok(!call.url.includes('test-key-123'), 'key never in the URL');
  assert.equal(call.headers.get('x-goog-api-key'), 'test-key-123');
  assert.deepEqual(call.body.contents, [{ role: 'user', parts: [{ text: 'How do I buy?' }] }]);
  const system: string = call.body.systemInstruction.parts[0].text;
  assert.match(system, /Use ONLY the knowledge below/);
  assert.match(system, /Etsy/);
  assert.match(system, /frequently asked questions/);
  assert.match(system, /\/designs\/olive-ivory/);
  assert.deepEqual(call.body.generationConfig.thinkingConfig, { thinkingBudget: 0 });
});

test('chat: Google errors become calm answers (busy, not ready, blocked, failed)', async () => {
  const cases: Array<[number | null, unknown, number, string]> = [
    [429, { error: {} }, 502, 'busy'],
    [503, { error: {} }, 502, 'busy'],
    [400, { error: {} }, 503, 'not_ready'],
    [403, { error: {} }, 503, 'not_ready'],
    [500, { error: {} }, 502, 'failed'],
    [200, { promptFeedback: { blockReason: 'SAFETY' } }, 502, 'failed'],
    [200, { candidates: [] }, 502, 'failed'],
  ];
  for (const [status, body, want, code] of cases) {
    const g = fakeGemini({ status: status ?? 200, body });
    const res = await supportChat(chatReq(ask('Hi')), { config: LIVE, fetch: g.fetch, limiter: new MemoryRateLimiter() });
    assert.equal(res.status, want, `${status}`);
    assert.equal((await res.json()).code, code, `${status}`);
  }
  const thrown = await askGemini({ apiKey: 'k', model: 'm', system: 's', turns: [{ role: 'user', text: 'x' }] }, async () => {
    throw new Error('network');
  });
  assert.deepEqual(thrown, { ok: false, reason: 'failed' });
});

test('chat: per-visitor limit and the platform daily budget', async () => {
  const limiter = new MemoryRateLimiter();
  const g = fakeGemini();
  const deps = { config: LIVE, fetch: g.fetch, limiter };
  for (let i = 0; i < SUPPORT_LIMITS.perIpShort.limit; i++) assert.equal((await supportChat(chatReq(ask(`q${i}`), { ip: '198.51.100.1' }), deps)).status, 200);
  const blocked = await supportChat(chatReq(ask('again'), { ip: '198.51.100.1' }), deps);
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).code, 'rate_limited');
  assert.ok(Number(blocked.headers.get('retry-after')) > 0);
  // another visitor is fine
  assert.equal((await supportChat(chatReq(ask('hi'), { ip: '198.51.100.2' }), deps)).status, 200);

  const budget = { ...deps, limiter: new MemoryRateLimiter(), config: { ...LIVE, dailyLimit: 2 } };
  assert.equal((await supportChat(chatReq(ask('a'), { ip: '192.0.2.1' }), budget)).status, 200);
  assert.equal((await supportChat(chatReq(ask('b'), { ip: '192.0.2.2' }), budget)).status, 200);
  const over = await supportChat(chatReq(ask('c'), { ip: '192.0.2.3' }), budget);
  assert.equal(over.status, 429);
  assert.equal((await over.json()).code, 'daily_limit');
});

test('panel: a valid edit key adds facts about the website (no names, no key); a wrong key adds nothing', async () => {
  const c = demoContent();
  const site = await createSiteWithKeys(getDataAdapter(), { slug: 'support-site-1', theme: '_sample', content: c });
  const g = fakeGemini();
  const deps = { config: LIVE, fetch: g.fetch, limiter: new MemoryRateLimiter() };
  const ok = await supportChat(chatReq(ask('Can I change our names?', { context: 'panel', slug: 'support-site-1', page: `/edit/support-site-1` }), { key: site.editKey }), deps);
  assert.equal(ok.status, 200);
  const system: string = g.calls[0].body.systemInstruction.parts[0].text;
  assert.match(system, /inside the couple's editor/);
  assert.match(system, /# The user's own website/);
  assert.match(system, /Status: draft/);
  assert.match(system, /free until the first publish/);
  assert.match(system, /The user is on the page: \/edit \(the panel\)/);
  assert.ok(!system.includes(site.editKey), 'edit key never sent');
  const facts = system.slice(system.indexOf("# The user's own website"));
  for (const name of JSON.stringify(c.partners).match(/[A-Z][a-z]{2,}/g) ?? []) assert.ok(!facts.includes(name), `no names in the site facts (${name})`);

  const wrong = await supportChat(chatReq(ask('Hi', { context: 'panel', slug: 'support-site-1' }), { key: 'not-the-key' }), deps);
  assert.equal(wrong.status, 200);
  const system2: string = g.calls[1].body.systemInstruction.parts[0].text;
  assert.ok(!system2.includes("# The user's own website"));
});

test('demo mode answers without calling Google', async () => {
  const g = fakeGemini();
  const res = await supportChat(chatReq(ask('Hello there')), { config: supportConfig({ SUPPORT_CHAT: 'demo' }), fetch: g.fetch, limiter: new MemoryRateLimiter() });
  assert.equal(res.status, 200);
  assert.match((await res.json()).reply, /demo answer/);
  assert.equal(g.calls.length, 0);
});

test('knowledge: the shop facts come from the marketing config; the request body has no thinking config for other models', () => {
  const sys = systemInstruction('market');
  assert.match(sys, /one-time purchase on Etsy|You buy it on Etsy/);
  assert.match(sys, /Never invent or change prices/);
  assert.ok(sys.length < 40_000, `system instruction stays small for the free quota (${sys.length} chars)`);
  assert.equal((geminiBody('s', [{ role: 'user', text: 'x' }], 'gemini-3-flash').generationConfig as any).thinkingConfig, undefined);
});

test('copy: the window speaks the page language through t()', () => {
  const copy = chatCopy((en, vars) => `[${en}]${vars ? JSON.stringify(vars) : ''}`, { context: 'panel', brand: 'B', shop: 'S', email: null, maxChars: 800 });
  assert.equal(copy.email, null);
  assert.equal(copy.suggestions.length, 4);
  assert.match(copy.tooLong, /"n":800/);
  assert.match(copy.etsy, /"shop":"S"/);
});
