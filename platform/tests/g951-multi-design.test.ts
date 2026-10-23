// G951 (1): two or more designs in ONE Etsy order. An order may own up to MAX_ORDER_SITES websites (one per design
// unit bought). /start with the same order + the same email asks: open the order's website, or start one more (only when
// the order may get one); another email stays refused (409). Etsy receipt read -> only within its units; trust (Gmail /
// nothing yet) -> allowed and the admin gets a To-do AT ONCE; manual -> pending like any claim. The admin sees every
// website of an order and can add one to an existing order after an explicit confirmation.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { adminCreateSite } from '../lib/admin/create.ts';
import { adminSite, orderSitesOf } from '../lib/admin/api.ts';
import { adminDashboard, summarizeSite } from '../lib/admin/summary.ts';
import { claimSite, orderRoom } from '../lib/claim/claim.ts';
import { continueWithOrder } from '../lib/claim/continue.ts';
import { sweepProvisionalOrders } from '../lib/claim/trust.ts';
import { MAX_ORDER_SITES, type OrderCheck, type OrderVerifier } from '../lib/claim/verify.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { DataAdapter } from '../lib/data/types.ts';
import { setShopNotifier } from '../lib/mail/index.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { confirmOrder, createSiteWithKeys } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
type Json = Record<string, any>;

before(() => {
  const themes = tmpDir('g951-themes-');
  for (const [id, name] of [['sample-design', 'Sample Design'], ['second-design', 'Second Design']]) {
    cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, id), { recursive: true });
    const file = path.join(themes, id, 'theme.json');
    const manifest = JSON.parse(readFileSync(file, 'utf8'));
    manifest.id = id;
    manifest.name = name;
    delete manifest.internal;
    writeFileSync(file, JSON.stringify(manifest));
    writeFileSync(path.join(themes, id, 'content.demo.json'), JSON.stringify(demoContent()));
  }
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g951-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
});
const quiet = { enabled: false, async pendingOrder() { return { sent: false as const }; } };
beforeEach(() => setShopNotifier(quiet as never));

let n = 0;
const freshOrder = () => String(7_520_000_000 + ++n * 7919);
const verifier = (kind: string, answer: OrderCheck): OrderVerifier => ({ kind, async check() { return answer; } });
const TRUST = verifier('trust', { result: 'provisional' });
const MANUAL = verifier('manual', { result: 'pending' });
const etsy = (units: number) => verifier('etsy', { result: 'verified', units });

async function claim(adapter: DataAdapter, v: OrderVerifier, body: Json, limiter = new MemoryRateLimiter()): Promise<{ status: number; body: Json }> {
  return claimSite(
    { adapter, origin: BASE, ip: `198.51.100.${(++n % 250) + 1}`, verifier: v, limiter },
    { theme: 'sample-design', email: 'avery@example.test', names: ['Avery', 'Jordan'], claimToken: crypto.randomUUID(), ...body },
  );
}

test('trust mode: a second design of the order — the choice, then "Start a second website"; the admin is told at once', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const a = await claim(adapter, TRUST, { orderNumber: order });
  assert.equal(a.status, 201);
  // the same order + email with ANOTHER design: never silently the first website's editor
  const ask = await claim(adapter, TRUST, { orderNumber: order, theme: 'second-design', names: ['Sam', 'Lee'] });
  assert.equal(ask.status, 200);
  assert.equal(ask.body.next, 'choose');
  assert.equal(ask.body.existing, undefined, 'no editor opened by itself');
  assert.equal(ask.body.editPath, undefined);
  assert.deepEqual(ask.body.sites, [{ slug: a.body.slug, names: 'Avery & Jordan', design: 'Sample Design', sameDesign: false }]);
  assert.deepEqual(ask.body.add, { design: 'Second Design', sameDesign: false });
  // "Open it": the first website, on this device
  const open = await claim(adapter, TRUST, { orderNumber: order, theme: 'second-design', intent: 'open', openSlug: a.body.slug });
  assert.equal(open.status, 200);
  assert.equal(open.body.existing, true);
  assert.equal(open.body.slug, a.body.slug);
  const wrong = await claim(adapter, TRUST, { orderNumber: order, intent: 'open', openSlug: 'not-a-site-of-this-order' });
  assert.equal(wrong.status, 409);
  // "Start a second website with Second Design"
  const b = await claim(adapter, TRUST, { orderNumber: order, theme: 'second-design', names: ['Sam', 'Lee'], intent: 'add' });
  assert.equal(b.status, 201, JSON.stringify(b.body));
  const sites = await adapter.findSitesByOrderRef(order);
  const second = sites.find((s) => s.slug === b.body.slug)!;
  assert.deepEqual([second.theme, second.orderSlot, second.orderCheck?.status], ['second-design', 2, 'provisional']);
  // the admin: To-do now, not after 48 h
  const sum = sites.map((s) => summarizeSite(s, 0));
  const extra = sum.find((s) => s.id === second.id)!;
  assert.deepEqual([extra.orderSlot, extra.orderExtraUnconfirmed, extra.needsAction], [2, true, true]);
  assert.equal(sum.find((s) => s.slug === a.body.slug)!.needsAction, false, 'the first website is not in question');
  const todos = adminDashboard(sum).todos.filter((t) => t.site.orderRef === order);
  assert.deepEqual(todos.map((t) => [t.kind, t.text]), [['order_sites', `Sipariş #${order} artık 2 siteye sahip — Etsy siparişinde 2 tasarım olduğunu kontrol edin`]]);
  // the shop checked Etsy and confirms: the To-do is gone
  await confirmOrder(adapter, second.id, 'two designs in the Etsy order');
  const after = (await adapter.findSitesByOrderRef(order)).map((s) => summarizeSite(s, 0));
  assert.equal(adminDashboard(after).todos.filter((t) => t.site.orderRef === order).length, 0);
  // the admin's site page lists every website of the order
  const detail = (await adminSite(second.id, adapter))!;
  assert.deepEqual(detail.orderSites.map((o) => [o.slot, o.themeName, o.current]), [[1, 'Sample Design', false], [2, 'Second Design', true]]);
});

test('the same design bought twice: "Start another website with this design"; another email is refused', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const a = await claim(adapter, TRUST, { orderNumber: order });
  const ask = await claim(adapter, TRUST, { orderNumber: order, names: ['Second', 'Couple'] });
  assert.equal(ask.body.next, 'choose');
  assert.deepEqual(ask.body.add, { design: 'Sample Design', sameDesign: true });
  assert.equal(ask.body.sites[0].sameDesign, true);
  const b = await claim(adapter, TRUST, { orderNumber: order, names: ['Second', 'Couple'], intent: 'add' });
  assert.equal(b.status, 201);
  assert.notEqual(b.body.slug, a.body.slug);
  for (const body of [{}, { intent: 'add' }, { intent: 'open', openSlug: a.body.slug }]) {
    const r = await claim(adapter, TRUST, { orderNumber: order, email: 'stranger@example.test', ...body });
    assert.equal(r.status, 409, JSON.stringify(body));
    assert.equal(r.body.code, 'order_used');
    assert.deepEqual(Object.keys(r.body).sort(), ['code', 'message', 'ok'], 'nothing about the order is revealed');
  }
  // /my lists every website of the order this email started, with its design: the buyer chooses (never the first by default)
  const my = await continueWithOrder({ adapter, origin: BASE, ip: '198.51.100.200', limiter: new MemoryRateLimiter() }, { orderNumber: order, email: 'avery@example.test' });
  assert.equal(my.body.next, 'choose');
  assert.deepEqual((my.body.sites as Json[]).map((s) => s.slug).sort(), [a.body.slug, b.body.slug].sort());
  assert.ok((my.body.sites as Json[]).every((s) => s.design === 'Sample Design'));
});

test('Etsy receipt read: only within its units — 1 design: no second website (the choice says why); 2: the second is verified', async () => {
  const adapter = getDataAdapter();
  const one = freshOrder();
  const a = await claim(adapter, etsy(1), { orderNumber: one });
  assert.equal(a.status, 201);
  const ask = await claim(adapter, etsy(1), { orderNumber: one, theme: 'second-design' });
  assert.equal(ask.status, 200);
  assert.equal(ask.body.next, 'choose');
  assert.equal(ask.body.add, null);
  assert.equal(ask.body.full, 'receipt');
  assert.match(ask.body.message, /Every design in this Etsy order already has its website/);
  const add = await claim(adapter, etsy(1), { orderNumber: one, theme: 'second-design', intent: 'add' });
  assert.equal(add.status, 409);
  assert.equal(add.body.code, 'order_full');
  // its own design again with nothing to add: the lost-link case opens it at once (as before)
  const same = await claim(adapter, etsy(1), { orderNumber: one });
  assert.equal(same.status, 200);
  assert.equal(same.body.existing, true);
  assert.equal(same.body.slug, a.body.slug);
  assert.equal((await adapter.findSitesByOrderRef(one)).length, 1);

  const two = freshOrder();
  assert.equal((await claim(adapter, etsy(2), { orderNumber: two })).status, 201);
  const b = await claim(adapter, etsy(2), { orderNumber: two, theme: 'second-design', intent: 'add' });
  assert.equal(b.status, 201);
  const second = (await adapter.findSitesByOrderRef(two)).find((s) => s.slug === b.body.slug)!;
  assert.deepEqual([second.orderSlot, second.orderCheck?.status, second.orderCheck?.units], [2, 'verified', 2]);
  assert.equal(summarizeSite(second, 0).orderExtraUnconfirmed, false, 'the receipt pays for it: no To-do');
});

test('manual mode: one more website is made pending (the shop confirms it, like any claim)', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  assert.equal((await claim(adapter, MANUAL, { orderNumber: order })).status, 201);
  const b = await claim(adapter, MANUAL, { orderNumber: order, theme: 'second-design', intent: 'add' });
  assert.equal(b.status, 201);
  assert.equal(b.body.orderPending, true);
  const second = (await adapter.findSitesByOrderRef(order)).find((s) => s.slug === b.body.slug)!;
  assert.deepEqual([second.orderSlot, second.orderCheck?.status], [2, 'pending']);
  const sum = summarizeSite(second, 0);
  assert.equal(sum.needsAction, true);
});

test('limits stay: the order number\'s attempts (shared with /my) and MAX_ORDER_SITES', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const limiter = new MemoryRateLimiter();
  assert.equal((await claim(adapter, TRUST, { orderNumber: order }, limiter)).status, 201);
  const statuses: number[] = [];
  for (let i = 0; i < 7; i++) statuses.push((await claim(adapter, TRUST, { orderNumber: order, theme: 'second-design' }, limiter)).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 200, 429], 'six a window per order number (DEFAULT_CONTINUE_LIMITS.perOrder)');
  // never more than MAX_ORDER_SITES
  const full = Array.from({ length: MAX_ORDER_SITES }, (_, i) => ({ orderSlot: i + 1 }));
  assert.deepEqual(orderRoom(full, { result: 'provisional' }), { slot: null, full: 'max' });
  assert.deepEqual(orderRoom([{}, { orderSlot: 3 }], { result: 'provisional' }), { slot: 2 }, 'the first free unit');
  assert.deepEqual(orderRoom([{}], { result: 'verified', units: 1 }), { slot: null, full: 'receipt' });
  assert.deepEqual(orderRoom([{}], { result: 'verified', units: 3 }), { slot: 2 });
  assert.deepEqual(orderRoom([{}], { result: 'verified', units: 1, source: 'mail' }), { slot: 2 }, 'a mail never decides how many');
  assert.deepEqual(orderRoom([{}], { result: 'not_checked' }), { slot: 2 });
  assert.deepEqual(orderRoom([{}], { result: 'provisional' }, false, new Set([2])), { slot: 3 }, 'a unit another instance just took');
});

test('the hourly check: a further website is verified only by the receipt\'s units, never by a sale email', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  await claim(adapter, TRUST, { orderNumber: order });
  const b = await claim(adapter, TRUST, { orderNumber: order, theme: 'second-design', intent: 'add' });
  const id = (await adapter.findSitesByOrderRef(order)).find((s) => s.slug === b.body.slug)!.id;
  const mail = await sweepProvisionalOrders(adapter, { verifier: verifier('chain', { result: 'verified', source: 'mail', units: 2 }), notifier: quiet as never });
  assert.equal(mail.results.find((r) => r.siteId === id)?.result, 'waiting');
  assert.equal((await adapter.getSiteById(id))!.orderCheck?.status, 'provisional');
  const receipt = await sweepProvisionalOrders(adapter, { verifier: verifier('chain', { result: 'verified', units: 2 }), notifier: quiet as never });
  assert.equal(receipt.results.find((r) => r.siteId === id)?.result, 'verified');
  const site = (await adapter.getSiteById(id))!;
  assert.deepEqual([site.orderCheck?.status, site.orderCheck?.units], ['verified', 2]);
  assert.equal(summarizeSite(site, 0).orderExtraUnconfirmed, false);
});

test('admin "Yeni sipariş": an order with a website is refused with its list; with the explicit confirmation one more is added', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const first = await claim(adapter, TRUST, { orderNumber: order });
  assert.equal(first.status, 201);
  const form = { theme: 'second-design', orderNumber: order, email: 'avery@example.test', name1: 'Sam', name2: 'Lee' };
  const refused = await adminCreateSite(adapter, BASE, form);
  assert.equal(refused.ok, false);
  if (refused.ok) return;
  assert.match(refused.message, /zaten bir sitesi var/);
  assert.deepEqual(refused.orderSites?.map((o) => o.slug), [first.body.slug]);
  assert.equal((await adapter.findSitesByOrderRef(order)).length, 1, 'nothing made without the confirmation');
  const added = await adminCreateSite(adapter, BASE, { ...form, addToOrder: true });
  assert.equal(added.ok, true, JSON.stringify(added));
  if (!added.ok) return;
  assert.equal(added.orderSlot, 2);
  const site = (await adapter.getSiteById(added.id))!;
  assert.deepEqual([site.orderSlot, site.orderCheck?.status, site.orderCheck?.by], [2, 'verified', 'support']);
  assert.equal(summarizeSite(site, 0).orderExtraUnconfirmed, false, 'the shop made it: confirmed');
  assert.deepEqual(orderSitesOf(await adapter.findSitesByOrderRef(order), site.id).map((o) => o.slot), [1, 2]);
  // a new order number still works in one step
  const fresh = await adminCreateSite(adapter, BASE, { ...form, orderNumber: freshOrder() });
  assert.equal(fresh.ok, true);
  // never past MAX_ORDER_SITES
  const big = freshOrder();
  for (let slot = 1; slot <= MAX_ORDER_SITES; slot++) {
    await createSiteWithKeys(adapter, { slug: `g951-max-${n}-${slot}`, theme: 'sample-design', content: demoContent(), orderRef: big, ownerEmail: 'avery@example.test', orderSlot: slot });
  }
  const over = await adminCreateSite(adapter, BASE, { ...form, orderNumber: big, addToOrder: true });
  assert.equal(over.ok, false);
});
