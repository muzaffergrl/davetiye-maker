// "Trust first, verify later" (CLAIM_ORDER_VERIFICATION=trust, lib/claim/trust.ts): /start makes a provisional site that
// can be published at once; the later check verifies it, holds it (offline + pending) or tells the shop once after 48 h.
// Etsy is a fake verifier, email a fake notifier: nothing leaves the machine.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as adminAction } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { GET as cronRoute } from '../app/api/cron/orders/route.ts';
import { defaultTemplateId } from '../lib/admin/view.ts';
import { siteHistory, summarizeSite } from '../lib/admin/summary.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer } from '../lib/claim/mailer.ts';
import { cronOrdersRoute, sweepOrder, sweepProvisionalOrders, TRUST_WINDOW_MS } from '../lib/claim/trust.ts';
import { getOrderVerifier, setOrderVerifier, TrustOrderVerifier, type OrderCheck, type OrderCheckInput, type OrderVerifier } from '../lib/claim/verify.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { SiteRecord } from '../lib/data/types.ts';
import { verificationMode } from '../lib/etsy/config.ts';
import { autoRecheck, recheckSite } from '../lib/etsy/recheck.ts';
import { pendingOrderEmail, type PendingOrderNotice } from '../lib/mail/templates.ts';
import { setShopNotifier, type ShopNotifier } from '../lib/mail/index.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
type Json = Record<string, any>;

before(() => {
  const themes = tmpDir('trust-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  const dir = path.join(themes, 'sample-design');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = 'sample-design';
  manifest.name = 'Fixture sample-design';
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('trust-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

let notices: PendingOrderNotice[] = [];
const fakeNotifier: ShopNotifier = {
  enabled: true,
  async pendingOrder(n) {
    notices.push(n);
    return { sent: true };
  },
};

beforeEach(() => {
  for (const k of ['CLAIM_ORDER_VERIFICATION', 'ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'GOOGLE_TOKEN_KEY', 'CRON_SECRET']) delete process.env[k];
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  notices = [];
  setShopNotifier(fakeNotifier);
});

let ipCounter = 0;
let orderCounter = 0;
const freshOrder = () => String(7_300_000_000 + ++orderCounter * 7919);

async function claim(order = freshOrder(), names = ['Avery', 'Jordan']): Promise<{ order: string; body: Json; site: SiteRecord; key: string }> {
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${(++ipCounter % 250) + 1}` },
      body: JSON.stringify({ theme: 'sample-design', orderNumber: order, email: 'avery@example.test', names, slug: '', website: '' }),
    }),
  );
  const body = (await res.json()) as Json;
  assert.equal(res.status, 201, JSON.stringify(body));
  const site = (await getDataAdapter().findSitesByOrderRef(order))[0];
  return { order, body, site, key: new URL(body.editUrl).searchParams.get('k')! };
}

async function publish(slug: string, key: string): Promise<Response> {
  const site = (await getDataAdapter().getSiteBySlug(slug))!;
  return publishRoute(
    new Request(`${BASE}/api/edit/${slug}/publish`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ baseUpdatedAt: site.updatedAt }),
    }),
    { params: Promise.resolve({ slug }) },
  );
}

/** A fake Etsy: one answer per order number (default: Etsy cannot tell). */
function fakeVerifier(answers: Record<string, OrderCheck>): OrderVerifier & { asked: string[] } {
  const asked: string[] = [];
  return {
    kind: 'fake',
    asked,
    async check(input: OrderCheckInput) {
      asked.push(input.orderNumber);
      return answers[input.orderNumber] ?? { result: 'pending' };
    },
  };
}

async function adminCookie(): Promise<string> {
  const res = await sessionPost(
    new Request(`${BASE}/api/admin/session`, { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ password: PASSWORD }) }),
  );
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

async function admin(id: string, action: string, body: Json = {}): Promise<{ status: number; body: Json }> {
  const res = await adminAction(
    new Request(`${BASE}/api/admin/sites/${id}/${action}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: await adminCookie(), host: 'localhost:3000', origin: BASE },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id, action }) },
  );
  return { status: res.status, body: (await res.json()) as Json };
}

const later = (ms: number) => new Date(Date.now() + ms);
const reload = async (id: string) => (await getDataAdapter().getSiteById(id))!;

// ---------------------------------------------------------------------------------------------

test('trust verifier: Etsy\'s definite answers stand; anything open is provisional; env switch "trust"', async () => {
  const input = { orderNumber: '7300000001', email: 'a@example.test', theme: 'sample-design' };
  const via = async (r: OrderCheck) => new TrustOrderVerifier({ inner: { kind: 'x', check: async () => r } }).check(input);
  assert.deepEqual(await via({ result: 'verified', units: 2 }), { result: 'verified', units: 2 });
  assert.deepEqual(await via({ result: 'rejected', reason: 'not_found' }), { result: 'rejected', reason: 'not_found' });
  assert.deepEqual(await via({ result: 'pending', units: 2, unpaid: true }), { result: 'provisional', units: 2 }, 'unpaid for now: in, checked later');
  assert.deepEqual(await via({ result: 'pending' }), { result: 'provisional' }, 'Etsy not connected');
  assert.deepEqual(await via({ result: 'unavailable' }), { result: 'provisional' }, 'Etsy not answering: the buyer is not asked to retry');
  assert.deepEqual(await via({ result: 'not_checked' }), { result: 'provisional' });
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  assert.equal(getOrderVerifier().kind, 'trust');
  assert.equal(verificationMode(), 'trust');
  // Etsy not set up: the real trust verifier answers provisional (never a 500)
  assert.deepEqual(await getOrderVerifier().check(input), { result: 'provisional' });
});

test('/start in trust mode: provisional site, publishable at once, shop told once', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const c = await claim();
  assert.equal(c.body.orderPending, false, 'the buyer never sees "we are confirming your order"');
  assert.equal(c.site.orderCheck?.status, 'provisional');
  assert.equal(c.site.orderCheck?.by, 'claim');
  assert.equal(notices.length, 1);
  assert.equal(notices[0].kind, 'provisional');
  assert.equal(notices[0].orderNumber, c.order);
  const pub = await publish(c.site.slug, c.key);
  assert.equal(pub.status, 200, JSON.stringify(await pub.clone().json()));
  assert.equal((await reload(c.site.id)).status, 'published');
  // Etsy says no at /start: refused right there, as in etsy mode
  setOrderVerifier(new TrustOrderVerifier({ inner: fakeVerifier({ '7300009999': { result: 'rejected', reason: 'not_found' } }) }));
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
      body: JSON.stringify({ theme: 'sample-design', orderNumber: '7300009999', email: 'x@example.test', names: ['Ann', 'Bo'], slug: '', website: '' }),
    }),
  );
  assert.equal(res.status, 403);
});

test('sweep: Etsy verifies, holds a wrong order (offline + pending, shop told), unpaid is held only after 48 h', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const adapter = getDataAdapter();
  const good = await claim(freshOrder(), ['Good', 'One']);
  const bad = await claim(freshOrder(), ['Bad', 'Two']);
  const unpaid = await claim(freshOrder(), ['Slow', 'Three']);
  assert.equal((await publish(bad.site.slug, bad.key)).status, 200);
  notices = [];
  const etsy = fakeVerifier({
    [good.order]: { result: 'verified', units: 1 },
    [bad.order]: { result: 'rejected', reason: 'not_paid' },
    [unpaid.order]: { result: 'pending', units: 1, unpaid: true },
  });

  const first = await sweepProvisionalOrders(adapter, { verifier: etsy, origin: BASE });
  const mine = (o: string, s = first) => s.results.find((r) => r.orderRef === o);
  assert.equal(mine(good.order)?.result, 'verified');
  assert.deepEqual({ result: mine(bad.order)?.result, reason: mine(bad.order)?.reason }, { result: 'held', reason: 'not_paid' });
  assert.equal(mine(unpaid.order)?.result, 'waiting', 'unpaid inside the window: wait');

  const g = await reload(good.site.id);
  assert.deepEqual([g.orderCheck?.status, g.orderCheck?.by], ['verified', 'etsy']);
  const b = await reload(bad.site.id);
  assert.deepEqual([b.orderCheck?.status, b.orderCheck?.by, b.status], ['pending', 'etsy', 'draft']);
  assert.match(b.orderCheck?.note ?? '', /iptal/);
  assert.equal(notices.length, 1);
  assert.deepEqual([notices[0].kind, notices[0].orderNumber], ['held', bad.order]);
  assert.match(notices[0].adminUrl, new RegExp(`^${BASE}/admin/site/`));
  // held = pending: the buyer cannot publish again
  const again = await publish(bad.site.slug, bad.key);
  assert.equal(again.status, 403);
  assert.equal(((await again.json()) as Json).code, 'order_pending');

  const second = await sweepProvisionalOrders(adapter, { verifier: etsy, now: later(TRUST_WINDOW_MS + 60_000), origin: BASE });
  assert.deepEqual({ result: mine(unpaid.order, second)?.result, reason: mine(unpaid.order, second)?.reason }, { result: 'held', reason: 'not_paid_in_time' });
  assert.equal(mine(good.order, second), undefined, 'a verified site is not checked again');
  assert.equal((await reload(unpaid.site.id)).orderCheck?.status, 'pending');
});

test('sweep without Etsy: the site stays online; after 48 h the shop is told ONCE and the admin lists it', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const adapter = getDataAdapter();
  const c = await claim(freshOrder(), ['Nora', 'Eli']);
  assert.equal((await publish(c.site.slug, c.key)).status, 200);
  notices = [];
  const early = await sweepProvisionalOrders(adapter, { verifier: null });
  assert.equal(early.etsy, false);
  assert.equal(early.results.find((r) => r.orderRef === c.order)?.result, 'waiting');
  assert.equal(summarizeSite(await reload(c.site.id), 0).needsAction, false, 'inside the window: nothing to do');

  const at = later(TRUST_WINDOW_MS + 60_000);
  const late = await sweepProvisionalOrders(adapter, { verifier: null, now: at });
  assert.equal(late.results.find((r) => r.orderRef === c.order)?.result, 'review');
  assert.deepEqual(notices.map((n) => [n.kind, n.orderNumber]), [['review', c.order]]);
  const site = await reload(c.site.id);
  assert.deepEqual([site.orderCheck?.status, site.status], ['provisional', 'published'], 'nothing is decided against the buyer without an answer');
  assert.equal(site.orderCheck?.reviewAt, at.toISOString());
  const again = await sweepProvisionalOrders(adapter, { verifier: null, now: later(TRUST_WINDOW_MS + 120_000) });
  assert.equal(again.results.find((r) => r.orderRef === c.order)?.result, 'waiting');
  assert.equal(notices.length, 1, 'told once');

  const summary = summarizeSite(site, 0, at);
  assert.deepEqual([summary.order, summary.orderReview, summary.needsAction], ['provisional', true, true]);
  assert.notEqual(defaultTemplateId(summary), 'publish_blocked_pending', 'the buyer is not blocked: no "Publish is waiting" message');
  assert.ok(siteHistory(site).some((h) => /48 saatte/.test(h.text)));
});

test('admin: hold a provisional order (offline, never released by an Etsy re-check), confirm releases it', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const c = await claim(freshOrder(), ['Hal', 'Ida']);
  assert.equal((await publish(c.site.slug, c.key)).status, 200);
  const held = await admin(c.site.id, 'hold', { note: 'Etsy\'de yok' });
  assert.equal(held.status, 200, JSON.stringify(held.body));
  let site = await reload(c.site.id);
  assert.deepEqual([site.orderCheck?.status, site.orderCheck?.by, site.orderCheck?.note, site.status], ['pending', 'support', 'Etsy\'de yok', 'draft']);
  assert.equal((await admin(c.site.id, 'hold')).status, 409, 'only a provisional order can be held');
  // the buyer's panel re-check never releases a site the shop held
  assert.equal((await autoRecheck(getDataAdapter(), site)).orderCheck?.status, 'pending');
  const paid = fakeVerifier({ [c.order]: { result: 'verified', units: 1 } });
  assert.equal((await recheckSite(getDataAdapter(), site, { verifier: paid })).result, 'skipped');
  assert.deepEqual(paid.asked, [], 'Etsy is not even asked');
  assert.equal((await admin(c.site.id, 'confirm', { note: 'Etsy\'de bulundu' })).status, 200);
  site = await reload(c.site.id);
  assert.equal(site.orderCheck?.status, 'verified');
  assert.equal((await publish(c.site.slug, c.key)).status, 200, 'the buyer publishes again');
});

test('cron route: needs CRON_SECRET, works only in trust mode, answers counts only', async () => {
  const req = (auth?: string) => new Request(`${BASE}/api/cron/orders`, { headers: auth ? { authorization: auth } : {} });
  assert.equal((await cronRoute(req('Bearer whatever'))).status, 503, 'no secret configured: refused');
  process.env.CRON_SECRET = 'cron-secret-0123456789';
  assert.equal((await cronRoute(req())).status, 401);
  assert.equal((await cronRoute(req('Bearer wrong-secret-0123456789'))).status, 401);
  const off = await cronRoute(req('Bearer cron-secret-0123456789'));
  assert.deepEqual(await off.json(), { ok: true, skipped: 'mode' });
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const c = await claim(freshOrder(), ['Cron', 'Job']);
  const on = await cronOrdersRoute(req('Bearer cron-secret-0123456789'));
  const body = (await on.json()) as Json;
  assert.equal(on.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.etsy, false);
  assert.ok(body.checked >= 1);
  assert.ok(!JSON.stringify(body).includes(c.order), 'no order numbers in the cron answer');
});

test('shop emails for trust mode: Turkish, one-line subject, escaped', () => {
  const base = { orderNumber: '7300000123', themeName: 'Olive <Ivory>', adminUrl: `${BASE}/admin/site/x` };
  const p = pendingOrderEmail({ ...base, kind: 'provisional' });
  assert.match(p.subject, /not verified yet \(#7300000123\)$/);
  assert.match(p.text, /önce güven/i);
  assert.ok(p.html.includes('Olive &#60;Ivory&#62;'));
  const h = pendingOrderEmail({ ...base, kind: 'held', reason: 'Etsy\'de <yok>' });
  assert.match(h.subject, /taken offline/);
  assert.ok(h.html.includes('&#60;yok&#62;') && !h.html.includes('<yok>'));
  assert.match(pendingOrderEmail({ ...base, kind: 'review' }).text, /48 saatte/);
  assert.match(pendingOrderEmail(base).subject, /needs a check/, 'default stays the manual-mode notice');
  for (const m of [p, h]) assert.ok(!/[\r\n]/.test(m.subject));
});

// G953: the sweep's order. Before, the oldest RECHECK_BATCH (100) provisional sites went first in every run: once 100
// unresolved orders had piled up (the shop already told about each), a new site was never checked again.
test('sweepOrder: new sites first, then the unreported ones, then a rotating share of the reported ones — none starves', () => {
  const now = new Date('2026-10-23T12:00:00Z');
  const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();
  const H = 3_600_000;
  const mk = (id: string, at: string, reviewAt?: string) =>
    ({ id, slug: id, createdAt: at, orderRef: '1', orderCheck: { status: 'provisional', at, by: 'claim', ...(reviewAt ? { reviewAt } : {}) } }) as unknown as SiteRecord;
  const told = Array.from({ length: 150 }, (_, i) => mk(`told-${String(i).padStart(3, '0')}`, ago(30 * 24 * H + i * H), ago(20 * 24 * H - i * 60_000)));
  const open = [mk('open-old', ago(40 * H)), mk('open-new', ago(5 * H))];
  const fresh = [mk('fresh-1', ago(30 * 60_000)), mk('fresh-2', ago(90 * 60_000))];
  const all = [...told, ...open, ...fresh];

  const run = sweepOrder(all, now);
  assert.equal(run.length, 100);
  assert.deepEqual(run.slice(0, 4).map((s) => s.id), ['fresh-1', 'fresh-2', 'open-old', 'open-new'], 'never-checked first, then the unreported ones oldest first');
  assert.equal(new Set(run.map((s) => s.id)).size, 100, 'no site twice');
  // every reported site comes round within a few hourly runs (96 places per run here)
  const seen = new Set<string>();
  for (let h = 0; h < 2; h++) for (const s of sweepOrder(all, new Date(now.getTime() + h * H))) seen.add(s.id);
  assert.equal(told.filter((s) => !seen.has(s.id)).length, 0, 'all 150 reported sites checked within 2 runs');
  // a site claimed now is in the very next run however many old ones wait
  const newcomer = mk('just-now', ago(60_000));
  assert.equal(sweepOrder([...told, newcomer], now)[0].id, 'just-now');
  // small numbers: everything, in the same order
  assert.deepEqual(sweepOrder([...fresh, ...open], now).map((s) => s.id), ['fresh-1', 'fresh-2', 'open-old', 'open-new']);
  assert.deepEqual(sweepOrder([], now), []);
});
