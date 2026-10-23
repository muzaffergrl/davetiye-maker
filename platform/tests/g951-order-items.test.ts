// G951 (2): what an Etsy order's LINES say. A service-only order (setup, extra revision, custom design — the service
// listings in collections/_services) must not confirm a ready-design website: neither from the Etsy receipt (while
// lib/etsy/listings.json maps no listing, a line is a service by its title) nor from Etsy's sale email (its item lines).
// Such a site is never "verified": trust mode keeps it provisional (publishable), other modes pending, and the admin gets
// a To-do "order contains no design". The number of design items of a mail is information only.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { adminDashboard, summarizeSite } from '../lib/admin/summary.ts';
import { claimOrderCheck, claimSite } from '../lib/claim/claim.ts';
import { sweepProvisionalOrders } from '../lib/claim/trust.ts';
import { checkCoversSlot, orderCoverage, TrustOrderVerifier, type OrderCheck, type OrderVerifier } from '../lib/claim/verify.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { DataAdapter } from '../lib/data/types.ts';
import { recheckSite } from '../lib/etsy/recheck.ts';
import { designOfTitle, itemsInText, normTitle, SERVICE_TITLES, serviceKindOfTitle } from '../lib/etsy/services.ts';
import { customUnits, designUnits, evaluateReceipt } from '../lib/etsy/verify.ts';
import { setShopNotifier } from '../lib/mail/index.ts';
import type { OrderMail } from '../lib/mailbox/orders.ts';
import { saleMailItems } from '../lib/mailbox/orders.ts';
import { MailOrderVerifier } from '../lib/mailbox/verify.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
type Json = Record<string, any>;

before(() => {
  const themes = tmpDir('g951-items-themes-');
  const dir = path.join(themes, 'olive-ivory');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = 'olive-ivory';
  manifest.name = 'Olive & Ivory';
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g951-items-data-');
  delete process.env.CLAIM_ORDER_VERIFICATION;
});
beforeEach(() => setShopNotifier({ enabled: false, async pendingOrder() { return { sent: false }; } }));

const SETUP = SERVICE_TITLES.find((s) => s.kind === 'setup')!.title;
const CUSTOM = SERVICE_TITLES.find((s) => s.kind === 'custom_design')!.title;
const REVISION = SERVICE_TITLES.find((s) => s.kind === 'extra_revision')!.title;
const OLIVE = 'Olive & Ivory Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Greenery';
const COASTAL = 'Coastal Seaside Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Beach';

test('service titles = the service listings (collections/_services/*/package/listing/etsy_upload.json)', (t) => {
  const root = path.join(REPO_ROOT, 'collections', '_services');
  if (!existsSync(root)) return t.skip('collections/_services not in this checkout');
  const onDisk = readdirSync(root)
    .filter((d) => existsSync(path.join(root, d, 'package/listing/etsy_upload.json')))
    .map((d) => ({ listing: d, title: JSON.parse(readFileSync(path.join(root, d, 'package/listing/etsy_upload.json'), 'utf8')).title as string }))
    .sort((a, b) => a.listing.localeCompare(b.listing));
  assert.deepEqual(onDisk, SERVICE_TITLES.map((s) => ({ listing: s.listing, title: s.title })).sort((a, b) => a.listing.localeCompare(b.listing)));
});

test('a line is a service or a design by the start of its title (cut short, other punctuation, other case)', () => {
  assert.equal(serviceKindOfTitle(SETUP), 'setup');
  assert.equal(serviceKindOfTitle(CUSTOM), 'custom_design');
  assert.equal(serviceKindOfTitle(REVISION), 'extra_revision');
  assert.equal(serviceKindOfTitle('wedding website SETUP service, we enter your det…'), 'setup');
  assert.equal(serviceKindOfTitle(OLIVE), null);
  assert.equal(serviceKindOfTitle(''), null);
  assert.equal(designOfTitle(OLIVE), 'olive-ivory');
  assert.equal(designOfTitle('OLIVE AND IVORY wedding website with RSVP'), 'olive-ivory');
  assert.equal(designOfTitle(COASTAL), 'coastal-seaside');
  assert.equal(designOfTitle(SETUP), null);
  assert.equal(normTitle('Café & Co.'), 'cafe and co');
});

test('Etsy receipt with no listing mapped: services never count; services only = 0 websites; custom designs apart', () => {
  const none = new Map<string, never>();
  const r = (...lines: Array<{ title: string; quantity?: number }>) => ({ transactions: lines.map((l, i) => ({ listing_id: 1000 + i, ...l })) });
  assert.equal(designUnits(r({ title: OLIVE }), none), 1);
  assert.equal(designUnits(r({ title: OLIVE }, { title: SETUP }), none), 1, 'design + setup service: one website');
  assert.equal(designUnits(r({ title: OLIVE, quantity: 2 }, { title: COASTAL }), none), 3);
  assert.equal(designUnits(r({ title: SETUP }), none), 0, 'setup only: no design');
  assert.equal(designUnits(r({ title: REVISION }, { title: CUSTOM }), none), 0);
  assert.equal(customUnits(r({ title: REVISION }, { title: CUSTOM }), none), 1);
  assert.equal(designUnits({ transactions: [] }, none), 1, 'no readable line: one website, as before');
  assert.equal(designUnits(r({ title: 'Something we do not know' }), none), 1, 'an unknown line counts as a design (as before)');
  const input = { orderNumber: '123456', email: 'a@example.test', theme: 'olive-ivory' };
  const receipt = (lines: Json[]) => ({ receipt_id: 123456, status: 'paid', is_paid: true, transactions: lines });
  assert.deepEqual(evaluateReceipt(receipt([{ listing_id: 1, title: SETUP }]) as never, input, { listings: new Map(), services: none }), { result: 'verified', units: 0 });
  assert.deepEqual(evaluateReceipt(receipt([{ listing_id: 1, title: CUSTOM }]) as never, input, { listings: new Map(), services: none }), { result: 'verified', units: 0, custom: 1 });
});

test('coverage: services only confirm no website; a custom design confirms its own private design; a mail never adds websites', () => {
  const v = (x: Json) => ({ result: 'verified', ...x }) as OrderCheck;
  assert.deepEqual(orderCoverage(v({ units: 0 })), { units: 0, receipt: true, noDesign: true });
  assert.deepEqual(orderCoverage(v({ units: 0, custom: 1 }), true), { units: 1, receipt: true, noDesign: false });
  assert.deepEqual(orderCoverage(v({ units: 0, custom: 1 }), false), { units: 0, receipt: true, noDesign: true }, 'a custom design is not a ready design');
  assert.deepEqual(orderCoverage(v({})), { units: null, receipt: false, noDesign: false }, 'lines unknown');
  assert.equal(checkCoversSlot(v({}), 1), true, 'unknown lines: the first website, as before');
  assert.equal(checkCoversSlot(v({ units: 0 }), 1), false);
  assert.equal(checkCoversSlot(v({ units: 2 }), 2), true, 'the receipt pays for a second website');
  assert.equal(checkCoversSlot(v({ units: 2, source: 'mail' }), 2), false, 'a mail: the shop looks');
  assert.equal(checkCoversSlot(v({ units: 1, source: 'mail' }), 1), true);
  assert.equal(checkCoversSlot({ result: 'pending', units: 1 }, 1), false);
  // the order check a new site starts with
  const at = '2026-10-23T10:00:00.000Z';
  assert.deepEqual(claimOrderCheck(v({ units: 0 }), 'trust', at), { status: 'provisional', at, by: 'claim', noDesign: true });
  assert.deepEqual(claimOrderCheck(v({ units: 0 }), 'etsy', at), { status: 'pending', at, by: 'claim', noDesign: true });
  assert.deepEqual(claimOrderCheck(v({ units: 2 }), 'etsy', at), { status: 'verified', at, by: 'etsy', units: 2 });
  assert.deepEqual(claimOrderCheck(v({ units: 1, source: 'mail' }), 'trust', at), { status: 'verified', at, by: 'etsy' });
  assert.deepEqual(claimOrderCheck({ result: 'provisional', units: 0 }, 'trust', at), { status: 'provisional', at, by: 'claim', noDesign: true });
  assert.equal(claimOrderCheck({ result: 'not_checked' }, 'format-only', at), null);
});

// --- the sale email ------------------------------------------------------------------------------------------

const AUTH = 'mx.google.com; dkim=pass header.i=@etsy.com; spf=pass smtp.mailfrom=transaction@etsy.com; dmarc=pass (p=REJECT) header.from=etsy.com';
const mail = (order: string, text: string, subject = `You made a sale on Etsy - Ship by Oct 25 - [₺1,190.00, Order #${order}]`): OrderMail => ({
  from: 'transaction@etsy.com',
  subject,
  authResults: [AUTH],
  text: `Congratulations on your sale!\nOrder #${order}\n${text}`,
});

test('itemsInText: item lines, quantities, a title repeated (image alt + link) counted once; unknown format -> null', () => {
  assert.deepEqual(itemsInText(`${OLIVE}\nQuantity: 1\nPrice: ₺1,190.00`), { designs: 1, custom: 0, services: 0 });
  assert.deepEqual(itemsInText(`Item: ${SETUP}\nQuantity: 1\nTransaction ID: 1`), { designs: 0, custom: 0, services: 1 });
  assert.deepEqual(itemsInText(`${OLIVE}\n${OLIVE}\nQuantity: 2\n\n${SETUP}\nQuantity: 1`), { designs: 2, custom: 0, services: 1 });
  assert.deepEqual(itemsInText(`${OLIVE}\nQty: 1\n${COASTAL}\nQty: 1`), { designs: 2, custom: 0, services: 0 });
  assert.deepEqual(itemsInText(`${CUSTOM}\nQuantity: 1\n${REVISION}\nQuantity: 2`), { designs: 0, custom: 1, services: 2 });
  assert.deepEqual(itemsInText(`${OLIVE} Quantity: 3`), { designs: 3, custom: 0, services: 0 }, 'quantity on the same line');
  assert.equal(itemsInText('Order details\nTransaction ID: 5566778899'), null);
  // only signed sale mails of this order count
  const order = '3456789020';
  assert.deepEqual(saleMailItems([mail(order, `Item: ${SETUP}\nQuantity: 1`)], order), { designs: 0, custom: 0, services: 1 });
  assert.equal(saleMailItems([{ ...mail(order, `Item: ${OLIVE}`), authResults: ['mx.google.com; dmarc=fail header.from=etsy.com'] }], order), null);
  assert.equal(saleMailItems([mail(order, `Item: ${OLIVE}`, `Order #${order} was cancelled`)], order), null);
});

function box(mails: Record<string, OrderMail[]>) {
  return () => ({ async find(n: string) { return mails[n] ?? []; }, async close() {} });
}

test('MailOrderVerifier: a sale mail of a design -> verified (units = designs); services only -> verified with 0 units', async () => {
  const design = '3456789021';
  const setup = '3456789022';
  const unknown = '3456789023';
  const v = new MailOrderVerifier({
    mailbox: box({
      [design]: [mail(design, `Item: ${OLIVE}\nQuantity: 1`)],
      [setup]: [mail(setup, `Item: ${SETUP}\nQuantity: 1`)],
      [unknown]: [mail(unknown, 'Listing #4433221100')],
    }),
  });
  const input = (orderNumber: string) => ({ orderNumber, email: 'a@example.test', theme: 'olive-ivory' });
  assert.deepEqual(await v.check(input(design)), { result: 'verified', source: 'mail', units: 1 });
  assert.deepEqual(await v.check(input(setup)), { result: 'verified', source: 'mail', units: 0 });
  assert.deepEqual(await v.check(input(unknown)), { result: 'verified', source: 'mail' });
  // trust mode keeps the reading (Etsy not connected -> the mail)
  const trust = new TrustOrderVerifier({ inner: v });
  assert.deepEqual(await trust.check(input(setup)), { result: 'verified', source: 'mail', units: 0 });
});

// --- /start, the hourly sweep, the admin ---------------------------------------------------------------

let n = 0;
const freshOrder = () => String(7_510_000_000 + ++n * 7919);
const fixed = (answers: Record<string, OrderCheck>, kind = 'trust'): OrderVerifier => ({ kind, async check(i) { return answers[i.orderNumber] ?? { result: 'provisional' }; } });

async function claim(adapter: DataAdapter, order: string, verifier: OrderVerifier) {
  return claimSite(
    { adapter, origin: BASE, ip: `198.51.100.${(n % 250) + 1}`, verifier, limiter: new MemoryRateLimiter() },
    { theme: 'olive-ivory', orderNumber: order, email: 'avery@example.test', names: ['Avery', 'Jordan'], claimToken: crypto.randomUUID() },
  );
}

test('/start with a setup-only order (trust mode): the site is made, provisional (publishable), flagged "no design"; admin To-do', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const res = await claim(adapter, order, fixed({ [order]: { result: 'verified', source: 'mail', units: 0 } }));
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const site = (await adapter.findSitesByOrderRef(order))[0];
  assert.deepEqual([site.orderCheck?.status, site.orderCheck?.noDesign], ['provisional', true]);
  const sum = summarizeSite(site, 0);
  assert.equal(sum.orderNoDesign, true);
  assert.equal(sum.needsAction, true, 'at once, not after 48 h');
  const todo = adminDashboard([sum]).todos.find((t) => t.site.id === site.id);
  assert.match(todo?.text ?? '', new RegExp(`Sipariş #${order}: siparişte tasarım görünmüyor`));
  // Etsy mode: the same answer waits for the shop (pending)
  const other = freshOrder();
  assert.equal((await claim(adapter, other, fixed({ [other]: { result: 'verified', units: 0 } }, 'etsy'))).status, 201);
  const pending = (await adapter.findSitesByOrderRef(other))[0];
  assert.deepEqual([pending.orderCheck?.status, pending.orderCheck?.noDesign], ['pending', true]);
  // a design order is verified as before (and keeps the receipt's units)
  const good = freshOrder();
  assert.equal((await claim(adapter, good, fixed({ [good]: { result: 'verified', units: 1 } }, 'etsy'))).status, 201);
  const ok = (await adapter.findSitesByOrderRef(good))[0];
  assert.deepEqual([ok.orderCheck?.status, ok.orderCheck?.units, ok.orderCheck?.noDesign], ['verified', 1, undefined]);
  assert.equal(summarizeSite(ok, 0).needsAction, false);
});

test('sweep / re-check: a services-only answer never verifies; the site keeps waiting and is flagged for the shop', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  assert.equal((await claim(adapter, order, fixed({}))).status, 201);
  const site = (await adapter.findSitesByOrderRef(order))[0];
  assert.equal(site.orderCheck?.status, 'provisional');
  assert.equal(site.orderCheck?.noDesign, undefined);
  const s = await sweepProvisionalOrders(adapter, { verifier: fixed({ [order]: { result: 'verified', source: 'mail', units: 0 } }), notifier: { enabled: false, async pendingOrder() { return { sent: false }; } } });
  assert.equal(s.results.find((r) => r.orderRef === order)?.result, 'waiting');
  const after = (await adapter.getSiteById(site.id))!;
  assert.deepEqual([after.orderCheck?.status, after.orderCheck?.noDesign], ['provisional', true]);
  // pending site (manual / etsy): an Etsy re-check that says "services only" leaves it pending
  const p = freshOrder();
  assert.equal((await claim(adapter, p, fixed({ [p]: { result: 'pending' } }, 'manual'))).status, 201);
  const pend = (await adapter.findSitesByOrderRef(p))[0];
  const r = await recheckSite(adapter, pend, { verifier: fixed({ [p]: { result: 'verified', units: 0 } }, 'etsy') });
  assert.deepEqual([r.result, r.reason], ['pending', 'no_design']);
  const pendAfter = (await adapter.getSiteById(pend.id))!;
  assert.deepEqual([pendAfter.orderCheck?.status, pendAfter.orderCheck?.noDesign], ['pending', true]);
  const good = await recheckSite(adapter, pendAfter, { verifier: fixed({ [p]: { result: 'verified', units: 1 } }, 'etsy') });
  assert.equal(good.result, 'verified', 'the buyer gave the design order later / the shop mapped the listing');
});
