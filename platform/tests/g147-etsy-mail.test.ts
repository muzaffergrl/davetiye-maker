// G147: automatic Etsy order check (EtsyOrderVerifier, the shop's OAuth connection, token refresh, re-checks) and email
// sending (SMTP EditLinkMailer, shop notice, admin test email). Etsy is a fake fetch, SMTP a fake transport (plus one real
// nodemailer connection to a closed local port): nothing leaves the machine.
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { GET as panelStateRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { GET as connGet, POST as connPost } from '../app/api/admin/connections/route.ts';
import { GET as etsyCallbackRoute } from '../app/api/etsy/callback/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { DisabledMailer, getEditLinkMailer, setEditLinkMailer, type EditLinkMessage } from '../lib/claim/mailer.ts';
import { getOrderVerifier, setOrderVerifier } from '../lib/claim/verify.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { apiKeyHeader, etsySetup, etsyTokenKey, verificationMode } from '../lib/etsy/config.ts';
import { codeChallenge, setEtsyFetch } from '../lib/etsy/client.ts';
import { recheckPendingOrders } from '../lib/etsy/recheck.ts';
import { disconnectEtsy, ETSY_DOC, etsyStatus, finishEtsyConnect, readEtsyDoc, SHOP_DOC_ID, shopAccessToken, startEtsyConnect } from '../lib/etsy/shop.ts';
import { EtsyOrderVerifier, evaluateReceipt, listingThemes } from '../lib/etsy/verify.ts';
import { parseTokenKey } from '../lib/google/config.ts';
import { mailSetup } from '../lib/mail/config.ts';
import { editLinkContent, getShopNotifier, mailStatus, maskAddress, setMailTransportFactory, setShopNotifier, SmtpEditLinkMailer, type OutgoingMail } from '../lib/mail/index.ts';
import { MailSendError, SmtpTransport } from '../lib/mail/transport.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
const KEYSTRING = 'test-keystring-g147';
const SHARED = 'test-shared-secret-g147';
const GOOGLE_KEY = 'ab'.repeat(32);
const SHOP_ID = 222;
const USER_ID = 111;
type Json = Record<string, any>;

// ---------------------------------------------------------------------------------------------
// Fixtures

function fixtureTheme(themes: string, id: string) {
  const dir = path.join(themes, id);
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = id;
  manifest.name = `Fixture ${id}`;
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
}

const ENV_KEYS = ['ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'GOOGLE_TOKEN_KEY', 'CLAIM_ORDER_VERIFICATION', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_PORT', 'SMTP_SECURE', 'MAIL_FROM', 'ADMIN_NOTIFY_EMAIL'];

function etsyEnv(on = true) {
  if (on) {
    process.env.ETSY_API_KEY = KEYSTRING;
    process.env.ETSY_SHARED_SECRET = SHARED;
    process.env.GOOGLE_TOKEN_KEY = GOOGLE_KEY;
  } else {
    delete process.env.ETSY_API_KEY;
    delete process.env.ETSY_SHARED_SECRET;
    delete process.env.GOOGLE_TOKEN_KEY;
  }
}

function smtpEnv() {
  process.env.SMTP_HOST = 'smtp.example.test';
  process.env.SMTP_USER = 'shop.sender@example.test';
  process.env.SMTP_PASS = 'abcd efgh ijkl mnop';
  process.env.ADMIN_NOTIFY_EMAIL = 'shop.owner@example.test';
}

before(() => {
  const themes = tmpDir('g147-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  fixtureTheme(themes, 'sample-design');
  fixtureTheme(themes, 'other-design');
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g147-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(async () => {
  for (const k of ENV_KEYS) delete process.env[k];
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  setShopNotifier(null);
  setMailTransportFactory(null);
  fake = newFakeEtsy();
  setEtsyFetch(fake.fetch);
  await disconnectEtsy(getDataAdapter());
});

after(() => {
  setEtsyFetch(null);
  setMailTransportFactory(null);
});

let ipCounter = 0;
const freshIp = () => `198.51.100.${(++ipCounter % 250) + 1}`;
let orderCounter = 0;
const freshOrder = () => String(7_100_000_000 + ++orderCounter * 7919);

async function postClaim(body: Json): Promise<{ status: number; body: Json; res: Response }> {
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': freshIp() }, body: JSON.stringify(body) }),
  );
  return { status: res.status, body: (await res.json()) as Json, res };
}

const form = (over: Json = {}): Json => ({
  theme: 'sample-design',
  orderNumber: freshOrder(),
  email: 'avery@example.test',
  names: ['Avery', 'Jordan'],
  slug: '',
  website: '',
  ...over,
});

/** Every console line written while `fn` runs (and what fn returns). */
async function captureLogs<T>(fn: () => Promise<T>): Promise<{ value: T; logs: string[] }> {
  const logs: string[] = [];
  const orig = { error: console.error, log: console.log, warn: console.warn, info: console.info };
  const grab = (...a: unknown[]) => void logs.push(a.map((x) => (x instanceof Error ? `${x.name} ${x.message} ${x.stack}` : String(x))).join(' '));
  console.error = grab;
  console.log = grab;
  console.warn = grab;
  console.info = grab;
  try {
    return { value: await fn(), logs };
  } finally {
    Object.assign(console, orig);
  }
}

// ---------------------------------------------------------------------------------------------
// Fake Etsy

interface FakeCall {
  url: URL;
  method: string;
  headers: Headers;
  body: URLSearchParams | null;
}

function newFakeEtsy() {
  const state = {
    calls: [] as FakeCall[],
    receipts: new Map<string, { status: number; body: unknown }>(),
    listReceipts: 200,
    validRefresh: new Set<string>(),
    n: 0,
    expiresIn: 3600,
    /** Next receipt read: throw (network) / time out. */
    failNext: null as null | 'network' | 'timeout',
    lastVerifier: '' as string,
    me: { user_id: USER_ID, shop_id: SHOP_ID } as Json,
  };
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  const issue = () => {
    state.n++;
    const refresh = `ref-token-${state.n}`;
    state.validRefresh.add(refresh);
    return { access_token: `acc-token-${state.n}`, token_type: 'Bearer', expires_in: state.expiresIn, refresh_token: refresh };
  };
  const fetch = async (input: string, init: RequestInit): Promise<Response> => {
    const url = new URL(input);
    const headers = new Headers(init.headers);
    const body = typeof init.body === 'string' ? new URLSearchParams(init.body) : null;
    state.calls.push({ url, method: init.method ?? 'GET', headers, body });
    if (url.href === 'https://api.etsy.com/v3/public/oauth/token') {
      if (body?.get('client_id') !== KEYSTRING) return reply(400, { error: 'invalid_client' });
      if (body.get('grant_type') === 'authorization_code') {
        if (body.get('code') !== 'good-code') return reply(400, { error: 'invalid_grant' });
        state.lastVerifier = body.get('code_verifier') ?? '';
        return reply(200, issue());
      }
      if (body.get('grant_type') === 'refresh_token') {
        const r = body.get('refresh_token') ?? '';
        if (!state.validRefresh.has(r)) return reply(400, { error: 'invalid_grant', error_description: `refresh ${r} unknown` });
        state.validRefresh.delete(r); // rotated
        return reply(200, issue());
      }
      return reply(400, { error: 'unsupported_grant_type' });
    }
    if (headers.get('x-api-key') !== `${KEYSTRING}:${SHARED}`) return reply(403, { error: 'Invalid API key' });
    const auth = headers.get('authorization') ?? '';
    if (!/^Bearer acc-token-\d+$/.test(auth)) return reply(401, { error: 'invalid_token' });
    const p = url.pathname;
    if (p === '/v3/application/users/me') return reply(200, state.me);
    if (p === `/v3/application/shops/${SHOP_ID}`) return reply(200, { shop_id: SHOP_ID, shop_name: 'FixtureShop' });
    if (p === `/v3/application/shops/${SHOP_ID}/receipts`) return reply(state.listReceipts, state.listReceipts === 200 ? { count: 0, results: [] } : { error: 'nope' });
    const m = new RegExp(`^/v3/application/shops/${SHOP_ID}/receipts/(\\d+)$`).exec(p);
    if (m) {
      if (state.failNext === 'network') {
        state.failNext = null;
        throw new TypeError('fetch failed');
      }
      if (state.failNext === 'timeout') {
        state.failNext = null;
        throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
      }
      const r = state.receipts.get(m[1]);
      return r ? reply(r.status, r.body) : reply(404, { error: `Receipt ${m[1]} not found` });
    }
    return reply(404, { error: 'unknown path' });
  };
  return { ...state, state, fetch };
}

let fake = newFakeEtsy();

function paidReceipt(order: string, over: Json = {}): Json {
  return { receipt_id: Number(order), seller_user_id: USER_ID, buyer_email: null, status: 'paid', is_paid: true, transactions: [{ listing_id: 555, seller_user_id: USER_ID }], ...over };
}

async function connectShop(): Promise<void> {
  const adapter = getDataAdapter();
  const { url, state } = await startEtsyConnect(adapter, BASE);
  const res = await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: state }, BASE);
  assert.deepEqual(res, { ok: true, shopName: 'FixtureShop' });
  assert.ok(url.startsWith('https://www.etsy.com/oauth/connect?'));
}

// ---------------------------------------------------------------------------------------------
// Etsy: settings

test('etsy settings: names only when missing; key derived from GOOGLE_TOKEN_KEY with HKDF; x-api-key = keystring:secret', () => {
  const missing = etsySetup({});
  assert.deepEqual(missing, { state: 'missing', missing: ['ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'GOOGLE_TOKEN_KEY'] });
  const ready = etsySetup({ ETSY_API_KEY: KEYSTRING, ETSY_SHARED_SECRET: SHARED, GOOGLE_TOKEN_KEY: GOOGLE_KEY });
  assert.equal(ready.state, 'ready');
  if (ready.state !== 'ready') return;
  const google = parseTokenKey(GOOGLE_KEY)!;
  assert.equal(ready.config.tokenKey.length, 32);
  assert.notDeepEqual(ready.config.tokenKey, google, 'never the Google key itself');
  assert.deepEqual(etsyTokenKey(google), ready.config.tokenKey, 'deterministic');
  assert.equal(apiKeyHeader(ready.config), `${KEYSTRING}:${SHARED}`);
  assert.equal(verificationMode({}), 'off');
  assert.equal(verificationMode({ CLAIM_ORDER_VERIFICATION: ' Etsy ' }), 'etsy');
  assert.equal(verificationMode({ CLAIM_ORDER_VERIFICATION: 'x' }), 'invalid');
});

// ---------------------------------------------------------------------------------------------
// Etsy: rules

test('evaluateReceipt: paid / cancelled / refunded / unpaid / email / listing → design / not ours', () => {
  const input = { orderNumber: '123456', email: 'Avery@Example.test', theme: 'sample-design' };
  const map = new Map([['555', 'sample-design'], ['777', 'other-design']]);
  const r = (over: Json = {}) => evaluateReceipt(paidReceipt('123456', over) as never, input, { listings: map, sellerUserId: USER_ID });
  assert.deepEqual(r(), { result: 'verified', units: 1 });
  assert.deepEqual(r({ status: 'completed' }), { result: 'verified', units: 1 });
  assert.deepEqual(r({ status: 'partially refunded' }), { result: 'verified', units: 1 }, 'a partial refund still counts as paid');
  assert.deepEqual(r({ status: 'canceled', is_paid: false }), { result: 'rejected', reason: 'not_paid' });
  assert.deepEqual(r({ status: 'fully refunded' }), { result: 'rejected', reason: 'not_paid' });
  assert.deepEqual(r({ status: 'payment processing', is_paid: false }), { result: 'pending', units: 1, unpaid: true }, 'not paid yet: wait, re-check later');
  assert.deepEqual(r({ status: 'open', is_paid: false }), { result: 'pending', units: 1, unpaid: true });
  // buyer_email: compared only when Etsy gives one
  assert.deepEqual(r({ buyer_email: null }), { result: 'verified', units: 1 });
  assert.deepEqual(r({ buyer_email: '' }), { result: 'verified', units: 1 });
  assert.deepEqual(r({ buyer_email: 'avery@example.TEST' }), { result: 'verified', units: 1 }, 'case-insensitive');
  assert.deepEqual(r({ buyer_email: 'someone@else.test' }), { result: 'rejected', reason: 'email_mismatch' });
  // listing -> design
  assert.deepEqual(r({ transactions: [{ listing_id: 777 }] }), { result: 'rejected', reason: 'theme_mismatch' });
  assert.deepEqual(r({ transactions: [{ listing_id: 999 }] }), { result: 'verified', units: 1 }, 'unmapped listing: no design check');
  // G152: an unmapped line counts as a design too (two lines = two websites) unless it is listed as a service
  assert.deepEqual(r({ transactions: [{ listing_id: 999 }, { listing_id: 555 }] }), { result: 'verified', units: 2 }, 'two design lines');
  assert.deepEqual(r({ transactions: [] }), { result: 'verified', units: 1 });
  // not ours
  assert.deepEqual(r({ receipt_id: 999 }), { result: 'rejected', reason: 'not_found' });
  assert.deepEqual(r({ seller_user_id: 4242 }), { result: 'rejected', reason: 'not_found' });
  assert.deepEqual(evaluateReceipt(null, input), { result: 'rejected', reason: 'not_found' });
  // the shipped mapping file is valid and empty until listings exist; bad entries are ignored
  assert.equal(listingThemes().size, 0);
  assert.deepEqual([...listingThemes({ listings: { '12': 'sample-design', x: 'a', '13': 5, '14': 'Bad Theme' } })], [['12', 'sample-design']]);
});

// ---------------------------------------------------------------------------------------------
// Etsy: connect, tokens, refresh

test('connect: PKCE S256 + state, tokens sealed at rest, state used once, wrong browser refused', async () => {
  etsyEnv();
  const adapter = getDataAdapter();
  const { url, state } = await startEtsyConnect(adapter, BASE);
  const u = new URL(url);
  assert.equal(u.origin + u.pathname, 'https://www.etsy.com/oauth/connect');
  assert.equal(u.searchParams.get('response_type'), 'code');
  assert.equal(u.searchParams.get('client_id'), KEYSTRING);
  assert.equal(u.searchParams.get('redirect_uri'), `${BASE}/api/etsy/callback`);
  assert.equal(u.searchParams.get('scope'), 'transactions_r shops_r');
  assert.equal(u.searchParams.get('state'), state);
  assert.equal(u.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(!url.includes(SHARED), 'the shared secret never goes to the browser');

  // another browser (no / other cookie): refused, nothing exchanged
  assert.deepEqual(await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: null }, BASE), { ok: false, reason: 'state' });
  assert.deepEqual(await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: 'x'.repeat(43) }, BASE), { ok: false, reason: 'state' });
  assert.equal(fake.state.calls.length, 0);

  const ok = await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: state }, BASE);
  assert.deepEqual(ok, { ok: true, shopName: 'FixtureShop' });
  // PKCE: the verifier sent to the token endpoint matches the challenge in the consent URL
  assert.equal(codeChallenge(fake.state.lastVerifier), u.searchParams.get('code_challenge'));
  const tokenCall = fake.state.calls[0];
  assert.equal(tokenCall.body?.get('redirect_uri'), `${BASE}/api/etsy/callback`);
  assert.equal(tokenCall.body?.get('client_secret'), null, 'public PKCE client: no secret in the body');
  // sealed at rest
  const raw = JSON.stringify(await adapter.readSiteDoc(SHOP_DOC_ID, ETSY_DOC));
  assert.ok(!raw.includes('acc-token') && !raw.includes('ref-token') && !raw.includes(fake.state.lastVerifier), 'no plain token / verifier stored');
  const doc = await readEtsyDoc(adapter);
  assert.equal(doc?.shopId, SHOP_ID);
  assert.equal(doc?.userId, USER_ID);
  assert.equal(doc?.pending, null);
  // the state is used once
  assert.deepEqual(await finishEtsyConnect(adapter, { state, code: 'good-code', error: null, cookieState: state }, BASE), { ok: false, reason: 'state' });
  // the owner said no on Etsy
  const second = await startEtsyConnect(adapter, BASE);
  assert.deepEqual(await finishEtsyConnect(adapter, { state: second.state, code: null, error: 'access_denied', cookieState: second.state }, BASE), { ok: false, reason: 'denied' });
  assert.equal((await etsyStatus(adapter)).connected, true, 'a refused re-connect keeps the old connection');
  // a user without a shop
  await disconnectEtsy(adapter);
  fake.state.me = { user_id: USER_ID };
  const third = await startEtsyConnect(adapter, BASE);
  assert.deepEqual(await finishEtsyConnect(adapter, { state: third.state, code: 'good-code', error: null, cookieState: third.state }, BASE), { ok: false, reason: 'no_shop' });
  assert.equal((await etsyStatus(adapter)).connected, false);
});

test('tokens: cached access token, refresh when expired (rotated refresh token stored), invalid_grant → reconnect', async () => {
  etsyEnv();
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  const adapter = getDataAdapter();
  await connectShop();
  const cfg = (etsySetup() as Extract<ReturnType<typeof etsySetup>, { state: 'ready' }>).config;
  fake.state.calls.length = 0;
  assert.equal(await shopAccessToken(adapter, cfg), 'acc-token-1', 'fresh token from the connect');
  assert.equal(fake.state.calls.length, 0, 'no refresh while it is valid');
  // an hour later: refresh, the NEW refresh token is stored
  const later = () => new Date(Date.now() + 3600_000);
  assert.equal(await shopAccessToken(adapter, cfg, { now: later }), 'acc-token-2');
  const refreshCall = fake.state.calls.find((c) => c.body?.get('grant_type') === 'refresh_token')!;
  assert.equal(refreshCall.body?.get('client_id'), KEYSTRING);
  assert.equal(refreshCall.body?.get('refresh_token'), 'ref-token-1');
  assert.ok(!fake.state.validRefresh.has('ref-token-1'));
  fake.state.calls.length = 0;
  assert.equal(await shopAccessToken(adapter, cfg, { now: () => new Date(Date.now() + 2 * 3600_000), force: true }), 'acc-token-3');
  assert.equal(fake.state.calls[0].body?.get('refresh_token'), 'ref-token-2', 'the rotated refresh token was kept');
  // Etsy forgets the grant: reconnect needed, /start falls back to pending
  fake.state.validRefresh.clear();
  const order = freshOrder();
  fake.state.receipts.set(order, { status: 200, body: paidReceipt(order) });
  const { value: check, logs } = await captureLogs(async () => {
    await assert.rejects(shopAccessToken(adapter, cfg, { force: true }), { name: 'EtsyNotConnectedError' });
    return new EtsyOrderVerifier().check({ orderNumber: order, email: 'avery@example.test', theme: 'sample-design' });
  });
  assert.deepEqual(check, { result: 'pending' });
  const status = await etsyStatus(adapter);
  assert.equal(status.reconnect, true);
  assert.equal(status.fallbackToManual, true);
  assert.equal(status.error, 'invalid_grant');
  for (const l of logs) assert.ok(!/acc-token|ref-token|test-shared-secret|test-keystring/.test(l), `no secret in logs: ${l}`);
});

// ---------------------------------------------------------------------------------------------
// Etsy: the verifier

test('EtsyOrderVerifier: not configured / not connected → pending without calling Etsy', async () => {
  const v = new EtsyOrderVerifier();
  const input = { orderNumber: freshOrder(), email: 'avery@example.test', theme: 'sample-design' };
  assert.deepEqual(await v.check(input), { result: 'pending' });
  etsyEnv();
  assert.deepEqual(await v.check(input), { result: 'pending' });
  assert.equal(fake.state.calls.length, 0);
  const s = await etsyStatus(getDataAdapter(), { ...process.env, CLAIM_ORDER_VERIFICATION: 'etsy' });
  assert.equal(s.configured, true);
  assert.equal(s.connected, false);
  assert.equal(s.fallbackToManual, true);
  etsyEnv(false);
  const n = await etsyStatus(getDataAdapter(), { CLAIM_ORDER_VERIFICATION: 'etsy' });
  assert.deepEqual(n.missing, ['ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'GOOGLE_TOKEN_KEY']);
  assert.equal(n.fallbackToManual, true);
});

test('EtsyOrderVerifier: paid → verified (headers right); 404 → not_found; 403 foreign vs refused; 429 / 5xx / network / timeout → unavailable; 401 → fresh token', async () => {
  etsyEnv();
  await connectShop();
  const v = new EtsyOrderVerifier();
  const check = (orderNumber: string, email = 'avery@example.test') => v.check({ orderNumber, email, theme: 'sample-design' });
  const paid = freshOrder();
  fake.state.receipts.set(paid, { status: 200, body: paidReceipt(paid) });
  fake.state.calls.length = 0;
  const { value, logs } = await captureLogs(async () => {
    const out: Json = {};
    out.paid = await check(paid);
    const call = fake.state.calls.find((c) => c.url.pathname.endsWith(`/receipts/${paid}`))!;
    assert.equal(call.headers.get('x-api-key'), `${KEYSTRING}:${SHARED}`);
    assert.match(call.headers.get('authorization') ?? '', /^Bearer acc-token-/);
    out.missing = await check(freshOrder());
    const foreign = freshOrder();
    fake.state.receipts.set(foreign, { status: 403, body: { error: 'You do not have permission' } });
    out.foreign = await check(foreign);
    fake.state.listReceipts = 403;
    out.refused = await check(foreign);
    fake.state.listReceipts = 200;
    const busy = freshOrder();
    fake.state.receipts.set(busy, { status: 429, body: { error: 'Too many requests' } });
    out.busy = await check(busy);
    const down = freshOrder();
    fake.state.receipts.set(down, { status: 503, body: { error: 'down' } });
    out.down = await check(down);
    fake.state.failNext = 'network';
    out.network = await check(paid);
    fake.state.failNext = 'timeout';
    out.timeout = await check(paid);
    out.notDigits = await check('12ab');
    return out;
  });
  assert.deepEqual(value.paid, { result: 'verified', units: 1 });
  assert.deepEqual(value.missing, { result: 'rejected', reason: 'not_found' });
  assert.deepEqual(value.foreign, { result: 'rejected', reason: 'not_found' }, '403 on one receipt while receipts can be read: not ours');
  assert.deepEqual(value.refused, { result: 'pending' }, 'the app may not read receipts: wait for the shop');
  assert.equal((await etsyStatus(getDataAdapter())).error, 'http_403', 'shown on the admin card');
  assert.deepEqual(value.busy, { result: 'unavailable' });
  assert.deepEqual(value.down, { result: 'unavailable' });
  assert.deepEqual(value.network, { result: 'unavailable' });
  assert.deepEqual(value.timeout, { result: 'unavailable' });
  assert.deepEqual(value.notDigits, { result: 'rejected', reason: 'not_found' });
  for (const l of logs) assert.ok(!/acc-token|ref-token|shared-secret|keystring|@example|permission|Too many/.test(l), `no secret / Etsy text in logs: ${l}`);
  // a successful call clears the remembered problem
  await check(paid);
  assert.equal((await etsyStatus(getDataAdapter())).error, null);

  // the stored access token is refused (revoked early): one refresh, one retry
  const doc = await readEtsyDoc(getDataAdapter());
  fake.state.calls.length = 0;
  const realFetch = fake.fetch;
  let refused = false;
  setEtsyFetch(async (input, init) => {
    const h = new Headers(init.headers);
    if (!refused && h.get('authorization') === 'Bearer acc-token-1') {
      refused = true;
      return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 });
    }
    return realFetch(input, init);
  });
  assert.deepEqual(await check(paid), { result: 'verified', units: 1 });
  assert.ok(refused);
  assert.ok(fake.state.calls.some((c) => c.body?.get('grant_type') === 'refresh_token'));
  assert.notEqual((await readEtsyDoc(getDataAdapter()))?.access, doc?.access, 'the new access token is stored');
});

// ---------------------------------------------------------------------------------------------
// Etsy: /start, re-checks, Publish

test('/start in etsy mode: paid → verified at once; not connected → pending (no 500); Etsy down → 503; mismatch → 403', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  assert.equal(getOrderVerifier().kind, 'etsy');
  // not configured at all
  const a = await postClaim(form({ names: ['Ada', 'Bo'] }));
  assert.equal(a.status, 201);
  assert.equal(a.body.orderPending, true);
  etsyEnv();
  const b = await postClaim(form({ names: ['Cy', 'Di'] }));
  assert.equal(b.status, 201);
  assert.equal(b.body.orderPending, true, 'configured but not connected: like manual');
  await connectShop();
  const order = freshOrder();
  fake.state.receipts.set(order, { status: 200, body: paidReceipt(order) });
  const c = await postClaim(form({ orderNumber: order, names: ['Eve', 'Finn'] }));
  assert.equal(c.status, 201);
  assert.equal(c.body.orderPending, false);
  const site = (await getDataAdapter().findSitesByOrderRef(order))[0];
  assert.equal(site.orderCheck?.status, 'verified');
  assert.equal(site.orderCheck?.by, 'etsy');
  const busy = freshOrder();
  fake.state.receipts.set(busy, { status: 429, body: { error: 'slow down' } });
  const d = await captureLogs(() => postClaim(form({ orderNumber: busy })));
  assert.equal(d.value.status, 503);
  assert.equal((await getDataAdapter().findSitesByOrderRef(busy)).length, 0, 'nothing stored');
  const wrong = freshOrder();
  fake.state.receipts.set(wrong, { status: 200, body: paidReceipt(wrong, { buyer_email: 'other@example.test' }) });
  const e = await postClaim(form({ orderNumber: wrong }));
  assert.equal(e.status, 403);
  assert.equal(e.body.code, 'order_not_verified');
  const refunded = freshOrder();
  fake.state.receipts.set(refunded, { status: 200, body: paidReceipt(refunded, { status: 'fully refunded' }) });
  assert.equal((await postClaim(form({ orderNumber: refunded }))).status, 403);
  assert.equal((await postClaim(form({ orderNumber: freshOrder() }))).status, 403, 'not a receipt of our shop');
});

test('pending sites verify themselves: admin re-check, the panel poll and Publish (etsy mode)', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  etsyEnv();
  const adapter = getDataAdapter();
  // three sites claimed before the shop was connected
  const orders = [freshOrder(), freshOrder(), freshOrder(), freshOrder()];
  const claims: Json[] = [];
  for (const [i, order] of orders.entries()) {
    const r = await postClaim(form({ orderNumber: order, names: [`Pat${i}`, `Sam${i}`] }));
    assert.equal(r.body.orderPending, true);
    claims.push(r.body);
  }
  assert.equal((await recheckPendingOrders(adapter)).problem, 'not_connected');
  await connectShop();
  fake.state.receipts.set(orders[0], { status: 200, body: paidReceipt(orders[0]) });
  fake.state.receipts.set(orders[1], { status: 200, body: paidReceipt(orders[1], { status: 'canceled', is_paid: false }) });
  // orders[2]: paid later; orders[3]: paid, opened by Publish

  // admin button
  const summary = await recheckPendingOrders(adapter);
  assert.equal(summary.ok, true);
  const mine = summary.results.filter((r) => orders.includes(r.orderRef ?? ''));
  assert.equal(mine.find((r) => r.orderRef === orders[0])?.result, 'verified');
  assert.deepEqual(
    { result: mine.find((r) => r.orderRef === orders[1])?.result, reason: mine.find((r) => r.orderRef === orders[1])?.reason },
    { result: 'rejected', reason: 'not_paid' },
  );
  assert.equal(mine.find((r) => r.orderRef === orders[2])?.result, 'rejected', 'no receipt yet → not found');
  const s0 = (await adapter.findSitesByOrderRef(orders[0]))[0];
  assert.equal(s0.orderCheck?.status, 'verified');
  assert.equal(s0.orderCheck?.by, 'etsy');
  assert.equal((await adapter.findSitesByOrderRef(orders[1]))[0].orderCheck?.status, 'pending', 'a rejected re-check changes nothing');

  // the buyer's panel poll
  fake.state.receipts.set(orders[2], { status: 200, body: paidReceipt(orders[2]) });
  const key2 = new URL(claims[2].editUrl).searchParams.get('k')!;
  const auth2 = { headers: { authorization: `Bearer ${key2}` } };
  const state = (await (await panelStateRoute(new Request(`${BASE}/api/edit/${claims[2].slug}`, auth2), { params: Promise.resolve({ slug: claims[2].slug }) })).json()) as Json;
  assert.equal(state.state.orderPending, false, 'confirmed on the poll');
  // polls are throttled per site
  fake.state.calls.length = 0;
  await panelStateRoute(new Request(`${BASE}/api/edit/${claims[2].slug}`, auth2), { params: Promise.resolve({ slug: claims[2].slug }) });
  assert.equal(fake.state.calls.length, 0, 'not pending any more: Etsy is not asked');

  // Publish on a pending order: one more Etsy check, then it publishes
  fake.state.receipts.set(orders[3], { status: 200, body: paidReceipt(orders[3]) });
  const key3 = new URL(claims[3].editUrl).searchParams.get('k')!;
  const pending = (await adapter.findSitesByOrderRef(orders[3]))[0];
  assert.equal(pending.orderCheck?.status, 'pending');
  const pub = await publishRoute(
    new Request(`${BASE}/api/edit/${claims[3].slug}/publish`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key3}`, 'content-type': 'application/json' },
      body: JSON.stringify({ baseUpdatedAt: pending.updatedAt }),
    }),
    { params: Promise.resolve({ slug: claims[3].slug }) },
  );
  assert.equal(pub.status, 200, JSON.stringify(await pub.clone().json()));
  const published = (await adapter.findSitesByOrderRef(orders[3]))[0];
  assert.equal(published.status, 'published');
  assert.equal(published.orderCheck?.by, 'etsy');

  // manual mode: no automatic Etsy calls from the panel
  process.env.CLAIM_ORDER_VERIFICATION = 'manual';
  const m = await postClaim(form({ names: ['Man', 'Ual'] }));
  fake.state.calls.length = 0;
  const km = new URL(m.body.editUrl).searchParams.get('k')!;
  const st = (await (await panelStateRoute(new Request(`${BASE}/api/edit/${m.body.slug}?orderCheck=now`, { headers: { authorization: `Bearer ${km}` } }), { params: Promise.resolve({ slug: m.body.slug }) })).json()) as Json;
  assert.equal(st.state.orderPending, true);
  assert.equal(fake.state.calls.length, 0);
});

// ---------------------------------------------------------------------------------------------
// Email

test('mail settings: off without the three names; Gmail defaults; app password spaces; notice address', () => {
  assert.deepEqual(mailSetup({}), { state: 'missing', missing: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] });
  assert.deepEqual(mailSetup({ SMTP_HOST: 'smtp.gmail.com' }), { state: 'missing', missing: ['SMTP_USER', 'SMTP_PASS'] });
  const g = mailSetup({ SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'shop@example.test', SMTP_PASS: 'abcd efgh ijkl mnop' }, 'BKE Studio');
  assert.equal(g.state, 'ready');
  if (g.state !== 'ready') return;
  assert.equal(g.config.port, 465);
  assert.equal(g.config.secure, true);
  assert.equal(g.config.pass, 'abcdefghijklmnop', 'Google shows app passwords in groups of four');
  assert.equal(g.config.from, '"BKE Studio" <shop@example.test>');
  assert.equal(g.config.notifyTo, 'shop@example.test');
  const s = mailSetup({ SMTP_HOST: 'h', SMTP_USER: 'u@example.test', SMTP_PASS: 'p w', SMTP_PORT: '587', MAIL_FROM: 'Shop <x@example.test>', ADMIN_NOTIFY_EMAIL: 'owner@example.test' });
  assert.equal(s.state === 'ready' && s.config.secure, false);
  assert.equal(s.state === 'ready' && s.config.pass, 'p w', 'other passwords are kept as they are');
  assert.equal(s.state === 'ready' && s.config.from, 'Shop <x@example.test>');
  assert.equal(s.state === 'ready' && s.config.notifyTo, 'owner@example.test');
  assert.equal(maskAddress('shop.owner@example.test'), 'sh***@example.test');
  assert.deepEqual(mailStatus({}), { enabled: false, missing: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'], notifyTo: null });
});

test('mailer: disabled without SMTP; enabled from env; both kinds; HTML escaped; text part; no secrets in a failure log', async () => {
  assert.ok(getEditLinkMailer() instanceof DisabledMailer);
  assert.equal(getShopNotifier().enabled, false);
  const sent: OutgoingMail[] = [];
  setMailTransportFactory(() => ({ async send(m) { sent.push(m); } }));
  smtpEnv();
  const mailer = getEditLinkMailer();
  assert.ok(mailer instanceof SmtpEditLinkMailer);
  assert.equal(mailer.enabled, true);
  const msg: EditLinkMessage = {
    to: 'buyer@example.test',
    editUrl: 'https://wed.example.test/edit/ava-and-jo?k=SECRETKEY123',
    siteUrl: 'https://wed.example.test/ava-and-jo',
    themeName: 'Rose <script>alert(1)</script>',
    orderNumber: '1234567890',
  };
  assert.deepEqual(await mailer.send(msg), { sent: true });
  const created = sent[0];
  assert.equal(created.to, 'buyer@example.test');
  assert.match(created.subject, /edit link/i);
  assert.ok(created.text.includes(msg.editUrl), 'the link is in the text part');
  assert.ok(created.text.includes('https://wed.example.test/my'), 'continue on any device at <origin>/my');
  assert.ok(created.text.includes('order number') && created.text.includes('#1234567890'));
  assert.ok(created.html.includes('href="https://wed.example.test/edit/ava-and-jo?k=SECRETKEY123"'));
  assert.ok(!created.html.includes('<script>'), 'names are escaped');
  assert.match(created.html, /<meta name="viewport"/);
  assert.ok(!/\$\d|USD|TRY|support@/.test(created.text), 'no invented price or support address');
  await mailer.send({ ...msg, kind: 'signin' });
  assert.match(sent[1].subject, /sign in/i);
  assert.ok(sent[1].text.includes(msg.editUrl));
  assert.ok(!sent[1].text.includes('/my and sign in'), 'the sign-in email is not the welcome email');
  assert.equal(editLinkContent({ ...msg, kind: 'created' }).subject, created.subject);
  assert.ok(!editLinkContent(msg).html.includes('javascript:'));
  assert.equal(editLinkContent({ ...msg, editUrl: 'javascript:alert(1)' }).html.includes('javascript:'), false, 'only http(s) links');

  // a failing provider: {sent: false}, one log line with a code only
  setMailTransportFactory(() => ({
    async send() {
      throw Object.assign(new Error('535 5.7.8 Username and Password not accepted for buyer@example.test'), { code: 'EAUTH', responseCode: 535 });
    },
  }));
  const { value, logs } = await captureLogs(() => getEditLinkMailer().send(msg));
  assert.deepEqual(value, { sent: false });
  assert.equal(logs.length, 1);
  assert.match(logs[0], /EAUTH 535/);
  for (const l of logs) assert.ok(!/buyer@|SECRETKEY|wed\.example|abcd|Password/.test(l), `nothing private in logs: ${l}`);
  // setEditLinkMailer(null) restores the env choice; without env it is disabled again
  setEditLinkMailer(null);
  for (const k of ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']) delete process.env[k];
  assert.ok(getEditLinkMailer() instanceof DisabledMailer);
});

test('real nodemailer: an unreachable server gives a safe MailSendError (code only)', async () => {
  const srv = createServer();
  await new Promise<void>((r) => srv.listen(0, '127.0.0.1', () => r()));
  const port = (srv.address() as { port: number }).port;
  await new Promise<void>((r) => srv.close(() => r()));
  const t = new SmtpTransport({ host: '127.0.0.1', port, secure: false, user: 'u@example.test', pass: 'pw-not-logged', from: 'u@example.test', notifyTo: 'u@example.test' });
  const err = await t.send({ to: 'buyer@example.test', subject: 's', text: 'https://x.test/edit/a?k=SECRET', html: '<p>x</p>' }).then(
    () => null,
    (e: unknown) => e,
  );
  assert.ok(err instanceof MailSendError);
  assert.match(err.code, /^E[A-Z_]+$/);
  assert.ok(!err.message.includes('buyer@') && !err.message.includes('SECRET') && !err.message.includes('pw-not'));
});

test('/start with SMTP: the buyer gets the "created" email; a NEW pending site notifies the shop (no link in it); retries and verified sites do not', async () => {
  const sent: OutgoingMail[] = [];
  setMailTransportFactory(() => ({ async send(m) { sent.push(m); } }));
  smtpEnv();
  process.env.CLAIM_ORDER_VERIFICATION = 'manual';
  const order = freshOrder();
  const token = 'claim-token-g147-0001';
  const r = await postClaim(form({ orderNumber: order, names: ['Noa', 'Lev'], claimToken: token }));
  assert.equal(r.status, 201);
  assert.equal(r.body.emailSent, true);
  assert.equal(sent.length, 2);
  const buyer = sent.find((m) => m.to === 'avery@example.test')!;
  const shop = sent.find((m) => m.to === 'shop.owner@example.test')!;
  assert.ok(buyer.text.includes(r.body.editUrl));
  const site = (await getDataAdapter().findSitesByOrderRef(order))[0];
  assert.match(shop.subject, /New website started — order needs a check/);
  assert.ok(shop.text.includes(`${BASE}/admin/site/${site.id}`));
  assert.ok(shop.text.includes(order));
  const key = new URL(r.body.editUrl).searchParams.get('k')!;
  assert.ok(!shop.text.includes(key) && !shop.html.includes(key) && !shop.text.includes('/edit/'), 'no buyer edit link in the shop notice');
  // the same claim again (its answer was lost): a new link for the buyer, no second shop notice
  sent.length = 0;
  const again = await postClaim(form({ orderNumber: order, names: ['Noa', 'Lev'], claimToken: token }));
  assert.equal(again.status, 201);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'avery@example.test');
  // checks off: not pending, no shop notice
  delete process.env.CLAIM_ORDER_VERIFICATION;
  sent.length = 0;
  await postClaim(form({ names: ['Off', 'Mode'] }));
  assert.equal(sent.length, 1);
  // a failing provider never fails the claim
  setMailTransportFactory(() => ({
    async send() {
      throw Object.assign(new Error('boom'), { code: 'ETIMEDOUT' });
    },
  }));
  process.env.CLAIM_ORDER_VERIFICATION = 'manual';
  const { value: failed, logs } = await captureLogs(() => postClaim(form({ names: ['Fail', 'Safe'] })));
  assert.equal(failed.status, 201);
  assert.equal(failed.body.emailSent, false);
  const failKey = new URL(failed.body.editUrl).searchParams.get('k')!;
  assert.ok(logs.length >= 1);
  for (const l of logs) assert.ok(!l.includes(failKey) && !l.includes('@example.test'), `nothing private in logs: ${l}`);
});

// ---------------------------------------------------------------------------------------------
// Admin

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null; origin?: string | null } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000' });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  if (init.origin !== null) headers.set('origin', init.origin ?? BASE);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

test('admin connections: status rows, test email, Etsy connect → callback → re-check → disconnect', async () => {
  assert.equal((await connGet(req('/api/admin/connections'))).status, 401);
  const cookie = await signIn();
  const off = (await (await connGet(req('/api/admin/connections', { cookie }))).json()) as Json;
  assert.equal(off.mail.enabled, false);
  assert.deepEqual(off.mail.missing, ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']);
  assert.equal(off.etsy.configured, false);
  assert.equal(off.etsy.mode, 'off');
  const post = (action: string, origin?: string | null) => connPost(req('/api/admin/connections', { method: 'POST', json: { action }, cookie, origin }));
  assert.equal((await post('mail-test')).status, 502);
  assert.equal((await post('etsy-connect')).status, 503);
  assert.equal((await post('mail-test', 'https://evil.example')).status, 403, 'same-origin writes only');

  // email on
  const sent: OutgoingMail[] = [];
  setMailTransportFactory(() => ({ async send(m) { sent.push(m); } }));
  smtpEnv();
  const on = (await (await connGet(req('/api/admin/connections', { cookie }))).json()) as Json;
  assert.equal(on.mail.enabled, true);
  assert.equal(on.mail.notifyTo, 'sh***@example.test');
  assert.ok(!JSON.stringify(on).includes('shop.owner@') && !JSON.stringify(on).includes('abcd'), 'no full address or password in the answer');
  const t = await post('mail-test');
  assert.equal(t.status, 200);
  assert.equal(sent[0].to, 'shop.owner@example.test');
  assert.ok(sent[0].text.includes(`${BASE}/admin`));
  setMailTransportFactory(() => ({
    async send() {
      throw Object.assign(new Error('535 bad credentials for shop.sender@example.test'), { code: 'EAUTH' });
    },
  }));
  const bad = await captureLogs(async () => (await post('mail-test')).json() as Promise<Json>);
  assert.match(bad.value.message, /EAUTH/);
  assert.ok(!JSON.stringify(bad.value).includes('shop.sender@') && !JSON.stringify(bad.value).includes('abcd'));

  // Etsy: connect from the admin, Etsy's redirect to the callback route, then re-check and disconnect
  setMailTransportFactory(() => ({ async send(m) { sent.push(m); } }));
  etsyEnv();
  process.env.CLAIM_ORDER_VERIFICATION = 'etsy';
  const pendingOrder = freshOrder();
  assert.equal((await postClaim(form({ orderNumber: pendingOrder, names: ['Ola', 'Per'] }))).body.orderPending, true);
  const c = await post('etsy-connect');
  assert.equal(c.status, 200);
  const { url } = (await c.json()) as Json;
  const setCookie = c.headers.get('set-cookie') ?? '';
  assert.match(setCookie, /^bke_estate=[A-Za-z0-9_-]{43}; Path=\/api\/etsy; Max-Age=600; HttpOnly; SameSite=Lax/);
  const state = new URL(url).searchParams.get('state')!;
  const cb = await etsyCallbackRoute(new Request(`${BASE}/api/etsy/callback?code=good-code&state=${state}`, { headers: { cookie: setCookie.split(';')[0] } }));
  assert.equal(cb.status, 200);
  const page = await cb.text();
  assert.match(page, /Etsy mağazası bağlandı/);
  assert.match(page, /href="\/admin#connections"/);
  assert.match(cb.headers.get('set-cookie') ?? '', /bke_estate=; Path=\/api\/etsy; Max-Age=0/);
  assert.match(cb.headers.get('content-security-policy') ?? '', /default-src 'none'/);
  const replay = await etsyCallbackRoute(new Request(`${BASE}/api/etsy/callback?code=good-code&state=${state}`, { headers: { cookie: setCookie.split(';')[0] } }));
  assert.equal(replay.status, 400);
  const connected = (await (await connGet(req('/api/admin/connections', { cookie }))).json()) as Json;
  assert.equal(connected.etsy.connected, true);
  assert.equal(connected.etsy.shopName, 'FixtureShop');
  assert.equal(connected.etsy.fallbackToManual, false);
  assert.ok(!JSON.stringify(connected).includes('acc-token') && !JSON.stringify(connected).includes(SHARED));
  fake.state.receipts.set(pendingOrder, { status: 200, body: paidReceipt(pendingOrder) });
  const rc = (await (await post('etsy-recheck')).json()) as Json;
  assert.equal(rc.ok, true);
  assert.ok(rc.summary.verified >= 1);
  assert.equal((await getDataAdapter().findSitesByOrderRef(pendingOrder))[0].orderCheck?.status, 'verified');
  const d = (await (await post('etsy-disconnect')).json()) as Json;
  assert.equal(d.etsy.connected, false);
  assert.equal(d.etsy.fallbackToManual, true);
  assert.equal((await post('etsy-recheck')).status, 409);
  assert.equal(await readEtsyDoc(getDataAdapter()), null, 'tokens deleted');
});

test('the shipped mapping file and the env names are documented, and no secret-looking value is in the new files', () => {
  const files = ['lib/etsy/config.ts', 'lib/etsy/client.ts', 'lib/etsy/shop.ts', 'lib/etsy/verify.ts', 'lib/etsy/recheck.ts', 'lib/mail/config.ts', 'lib/mail/index.ts', 'lib/mail/transport.ts', 'lib/mail/templates.ts', 'lib/admin/connections.ts'];
  for (const f of files) {
    const text = readFileSync(path.join(PLATFORM_ROOT, f), 'utf8');
    assert.ok(!/@gmail\.com/.test(text), `${f}: no real address`);
    assert.ok(!/[A-Za-z0-9]{24,}:[A-Za-z0-9]{8,}/.test(text), `${f}: no key:secret pair`);
  }
  const doc = readFileSync(path.join(PLATFORM_ROOT, '..', 'docs/10_SITE_PLATFORMU.md'), 'utf8');
  for (const name of ['ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_NOTIFY_EMAIL', '/api/etsy/callback']) {
    assert.ok(doc.includes(name), `docs/10 §3 names ${name}`);
  }
});
