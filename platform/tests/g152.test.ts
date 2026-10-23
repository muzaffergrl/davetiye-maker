// G152: follow-ups of G146 / G147 / G150.
//  1. multi-item Etsy orders: design units of a receipt (quantities; service listings never count), N websites per order
//     on /start in Etsy mode (one in off / manual), the per-unit order index of the blob adapter (two instances cannot
//     take the same unit; a lost race takes the next unit), claim retry first, then sign-in / order_used when all units
//     are used; /my: several websites of the order for one email → a chooser, then the chosen one; sign-in emails per site;
//  2. "Email me when a guest replies": off by default, offered only with SMTP, to the owner email on record, guest name /
//     answer / party size / short answers, a link to /my and never a key, daily cap + "N more" summary, failures never
//     touch the RSVP, nothing logged; the panel route (owner/device yes, shop no, 503 without SMTP);
//  3. admin: devices signed in (labels, dates) + "sign out all devices" (the edit link stays);
//  4. (<html lang> on buyer screens: tests/g150-i18n.test.ts checks the root layouts; build + browser in the task file);
//  and every G152 text in all four languages.
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { POST as rsvpRoute } from '../app/api/rsvp/[slug]/route.ts';
import { GET as notifyGet, POST as notifyPost } from '../app/api/edit/[slug]/notify/route.ts';
import { GET as stateRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as adminAction } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { claimSite } from '../lib/claim/claim.ts';
import { continueWithOrder, emailSignInLink } from '../lib/claim/continue.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer, type EditLinkMailer, type EditLinkMessage } from '../lib/claim/mailer.ts';
import { MAX_ORDER_SITES, orderUnits, setOrderVerifier, type OrderCheck, type OrderVerifier } from '../lib/claim/verify.ts';
import { adminSite } from '../lib/admin/api.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { OrderRefTakenError, type DataAdapter, type SiteRecord } from '../lib/data/types.ts';
import { mintDeviceKey } from '../lib/device-keys.ts';
import { designUnits, evaluateReceipt, listingServices } from '../lib/etsy/verify.ts';
import { loadDict } from '../lib/i18n/dicts.ts';
import { scanSource } from '../lib/i18n/scan.ts';
import { rsvpReplyEmail } from '../lib/mail/templates.ts';
import { setMailTransportFactory, setRsvpNotifier, type OutgoingMail } from '../lib/mail/index.ts';
import { DAILY_LIMIT, NOTIFY_DOC, notifyCouple, reserve, setNotify, type NotifyDoc } from '../lib/rsvp/notify.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, issueShopEditKey, publishSite } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const SMTP = { SMTP_HOST: 'smtp.example.test', SMTP_USER: 'shop.sender@example.test', SMTP_PASS: 'abcd efgh ijkl mnop' };
type Json = Record<string, any>;

before(() => {
  const themes = tmpDir('g152-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  for (const id of ['sample-design', 'second-design']) {
    cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, id), { recursive: true });
    const file = path.join(themes, id, 'theme.json');
    const manifest = JSON.parse(readFileSync(file, 'utf8'));
    manifest.id = id;
    manifest.name = id === 'sample-design' ? 'Sample Design' : 'Second Design';
    delete manifest.internal;
    writeFileSync(file, JSON.stringify(manifest));
    writeFileSync(path.join(themes, id, 'content.demo.json'), JSON.stringify(demoContent()));
  }
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g152-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
  for (const k of Object.keys(SMTP)) delete process.env[k];
});

beforeEach(() => {
  setClaimRateLimiter(new MemoryRateLimiter());
  setRsvpRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  setRsvpNotifier(null);
  setMailTransportFactory(null);
  for (const k of Object.keys(SMTP)) delete process.env[k];
  process.env.ADMIN_PASSWORD = PASSWORD;
});

after(() => {
  setEditLinkMailer(null);
  setOrderVerifier(null);
  setMailTransportFactory(null);
  for (const k of Object.keys(SMTP)) delete process.env[k];
});

let counter = 0;
const freshOrder = () => String(7_200_000_000 + ++counter * 7919);
let ipCounter = 0;
const freshIp = () => `198.51.100.${(++ipCounter % 250) + 1}`;

/** A verifier that read a receipt paying for `units` websites (Etsy mode). */
const unitsVerifier = (units: number, result: 'verified' | 'pending' = 'verified'): OrderVerifier => ({
  kind: 'fake-etsy',
  async check(): Promise<OrderCheck> {
    return { result, units };
  },
});

function claim(adapter: DataAdapter, body: Json, opts: { verifier?: OrderVerifier } = {}) {
  return claimSite(
    { adapter, origin: BASE, ip: freshIp(), userAgent: IPHONE, verifier: opts.verifier, limiter: new MemoryRateLimiter() },
    { theme: 'sample-design', names: ['Avery', 'Jordan'], claimToken: crypto.randomUUID(), ...body },
  );
}

const keyOf = (editPath: string) => new URL(editPath, BASE).searchParams.get('k')!;

// ------------------------------------------------------------------------------------------------ 1. Etsy units

test('designUnits: quantities of design lines; service listings never count; 1 without readable lines, at most MAX_ORDER_SITES', () => {
  const services = listingServices({ services: { '900': 'setup', '901': 'custom_design', '902': 'extra_revision', '903': 'other', x: 'setup' } });
  assert.deepEqual([...services], [['900', 'setup'], ['901', 'custom_design'], ['902', 'extra_revision']], 'unknown kinds and bad ids are ignored');
  assert.equal(listingServices().size, 0, 'the shipped file has no services yet');
  assert.equal(designUnits({ transactions: [{ listing_id: 1, quantity: 1 }] }, services), 1);
  assert.equal(designUnits({ transactions: [{ listing_id: 1, quantity: 2 }] }, services), 2, 'one design bought twice = two websites');
  assert.equal(designUnits({ transactions: [{ listing_id: 1 }, { listing_id: 2, quantity: 1 }] }, services), 2, 'two designs');
  assert.equal(designUnits({ transactions: [{ listing_id: 1 }, { listing_id: 900 }, { listing_id: 901, quantity: 3 }, { listing_id: 902 }] }, services), 1, 'setup / custom design / revision never count');
  assert.equal(designUnits({ transactions: [{ listing_id: 900 }] }, services), 0, 'G951: only a service line: no design website (the shop looks)');
  assert.equal(designUnits({ transactions: [] }, services), 1);
  assert.equal(designUnits(null, services), 1);
  assert.equal(designUnits({ transactions: [{ listing_id: 1, quantity: 0 }, { listing_id: 2, quantity: -3 }, { listing_id: 3, quantity: 1.5 as never }] }, services), 3, 'odd quantities count as 1');
  assert.equal(designUnits({ transactions: [{ listing_id: 1, quantity: 500 }] }, services), MAX_ORDER_SITES);

  const input = { orderNumber: '123456', email: 'avery@example.test', theme: 'sample-design' };
  const receipt = (over: Json) => ({ receipt_id: 123456, status: 'paid', is_paid: true, transactions: [{ listing_id: 1, quantity: 1 }], ...over });
  const listings = new Map([['555', 'sample-design'], ['777', 'second-design']]);
  assert.deepEqual(evaluateReceipt(receipt({ transactions: [{ listing_id: 555 }, { listing_id: 777 }] }) as never, input, { listings, services }), { result: 'verified', units: 2 });
  assert.deepEqual(evaluateReceipt(receipt({ transactions: [{ listing_id: 555, quantity: 2 }, { listing_id: 900 }] }) as never, input, { listings, services }), { result: 'verified', units: 2 });
  assert.deepEqual(evaluateReceipt(receipt({ is_paid: false, status: 'open', transactions: [{ listing_id: 1, quantity: 3 }] }) as never, input, { listings, services }), { result: 'pending', units: 3, unpaid: true });
  assert.deepEqual(evaluateReceipt(receipt({ transactions: [{ listing_id: 777, quantity: 2 }] }) as never, input, { listings, services }), { result: 'rejected', reason: 'theme_mismatch' });

  assert.equal(orderUnits({ result: 'not_checked' }), 1, 'off: one site per order');
  assert.equal(orderUnits({ result: 'pending' }), 1, 'manual / Etsy not connected: one');
  assert.equal(orderUnits({ result: 'verified', units: 3 }), 3);
  assert.equal(orderUnits({ result: 'pending', units: 2 }), 2);
  assert.equal(orderUnits({ result: 'verified', units: 99 }), MAX_ORDER_SITES);
  assert.equal(orderUnits({ result: 'verified', units: 0 }), 1);
});

for (const kind of ['local', 'blob'] as const) {
  const open = (): DataAdapter => {
    if (kind === 'local') return new LocalAdapter(tmpDir('g152-local-'));
    const fake = new FakeBlobStore();
    return new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 });
  };

  test(`${kind}: an order with 2 design units holds 2 websites (the buyer asks for the second); then sign-in (same email) or order_used`, async () => {
    const adapter = open();
    const order = freshOrder();
    const etsy = unitsVerifier(2);
    const a = await claim(adapter, { orderNumber: order, email: 'avery@example.test' }, { verifier: etsy });
    assert.equal(a.status, 201);
    // G951: the second design of the order: first the choice (open the first website / start a second one) …
    const ask = await claim(adapter, { orderNumber: order, email: 'avery@example.test', theme: 'second-design', names: ['Sam', 'Lee'] }, { verifier: etsy });
    assert.equal(ask.status, 200);
    assert.equal(ask.body.next, 'choose');
    assert.deepEqual(ask.body.sites, [{ slug: a.body.slug, names: 'Avery & Jordan', design: 'Sample Design', sameDesign: false }]);
    assert.deepEqual(ask.body.add, { design: 'Second Design', sameDesign: false });
    assert.equal((await adapter.findSitesByOrderRef(order)).length, 1, 'nothing made before the buyer chooses');
    // … then "Start a second website with Second Design"
    const b = await claim(adapter, { orderNumber: order, email: 'avery@example.test', theme: 'second-design', names: ['Sam', 'Lee'], intent: 'add' }, { verifier: etsy });
    assert.equal(b.status, 201, 'the second unit: a new website');
    assert.notEqual(b.body.slug, a.body.slug);
    const full = await claim(adapter, { orderNumber: order, email: 'avery@example.test', intent: 'add' }, { verifier: etsy });
    assert.equal(full.status, 409, 'the receipt pays for two: no third');
    assert.equal(full.body.code, 'order_full');
    const sites = await adapter.findSitesByOrderRef(order);
    assert.equal(sites.length, 2);
    assert.deepEqual(sites.map((s) => s.orderSlot ?? 1).sort(), [1, 2]);
    assert.deepEqual(sites.map((s) => s.theme).sort(), ['sample-design', 'second-design']);

    // all units used: the same email signs in — into the website of the design it starts
    const again = await claim(adapter, { orderNumber: order, email: 'Avery@Example.test', theme: 'second-design' }, { verifier: etsy });
    assert.equal(again.status, 200);
    assert.equal(again.body.existing, true);
    assert.equal(again.body.slug, b.body.slug, 'the website of this design');
    assert.ok(!('editUrl' in again.body));
    const other = await claim(adapter, { orderNumber: order, email: 'someone@else.test' }, { verifier: etsy });
    assert.equal(other.status, 409);
    assert.equal(other.body.code, 'order_used');
    assert.equal((await adapter.findSitesByOrderRef(order)).length, 2, 'never a third');
  });

  test(`${kind}: another email never gets a website of the order; a claim retry recovers its link instead of using a unit`, async () => {
    const adapter = open();
    const order = freshOrder();
    assert.equal((await claim(adapter, { orderNumber: order, email: 'avery@example.test' })).status, 201);
    const second = await claim(adapter, { orderNumber: order, email: 'other@example.test', theme: 'second-design' });
    assert.equal(second.status, 409, 'another email: order used');
    const added = await claim(adapter, { orderNumber: order, email: 'other@example.test', theme: 'second-design', intent: 'add' });
    assert.equal(added.status, 409, 'not even when asking for one more');
    assert.equal(added.body.code, 'order_used');
    const manual = freshOrder();
    const pending: OrderVerifier = { kind: 'manual', check: async () => ({ result: 'pending' }) };
    assert.equal((await claim(adapter, { orderNumber: manual, email: 'avery@example.test' }, { verifier: pending })).status, 201);
    assert.equal((await claim(adapter, { orderNumber: manual, email: 'x@example.test' }, { verifier: pending })).status, 409);

    // Etsy mode, 2 units: the same claim token again (its answer was lost) → the same site with a new link, not unit 2
    const etsyOrder = freshOrder();
    const etsy = unitsVerifier(2);
    const token = crypto.randomUUID();
    const first = await claim(adapter, { orderNumber: etsyOrder, email: 'avery@example.test', claimToken: token }, { verifier: etsy });
    const retry = await claim(adapter, { orderNumber: etsyOrder, email: 'avery@example.test', claimToken: token }, { verifier: etsy });
    assert.equal(retry.status, 201);
    assert.equal(retry.body.slug, first.body.slug);
    assert.notEqual(retry.body.editUrl, first.body.editUrl, 'reissued');
    assert.equal((await adapter.findSitesByOrderRef(etsyOrder)).length, 1, 'the retry did not use the second unit');
  });
}

test('blob: one order index file per unit — the same unit twice is refused, other units are found, delete frees its unit', async () => {
  const fake = new FakeBlobStore();
  const one = new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 });
  const two = new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 }); // another server instance
  const order = freshOrder();
  const make = (a: DataAdapter, slot: number, slug: string) =>
    createSiteWithKeys(a, { slug, theme: '_sample', content: demoContent(), orderRef: order, ownerEmail: 'avery@example.test', orderSlot: slot });
  const s1 = await make(one, 1, `g152-u1-${counter}`);
  await assert.rejects(make(two, 1, `g152-u1b-${counter}`), OrderRefTakenError);
  const s2 = await make(two, 2, `g152-u2-${counter}`);
  await assert.rejects(make(one, 2, `g152-u2b-${counter}`), OrderRefTakenError);
  const s3 = await make(one, 3, `g152-u3-${counter}`);
  assert.deepEqual((await one.findSitesByOrderRef(order)).map((s) => s.id), [s1.site.id, s2.site.id, s3.site.id]);
  assert.equal(s1.site.orderSlot, undefined, 'unit 1 records look like before');
  assert.equal(s2.site.orderSlot, 2);
  await two.deleteSite(s2.site.id);
  assert.deepEqual((await one.findSitesByOrderRef(order)).map((s) => s.id), [s1.site.id, s3.site.id]);
  const again = await make(two, 2, `g152-u2c-${counter}`);
  assert.equal(again.site.orderSlot, 2, 'the deleted website freed its unit');
  // another order number that starts with the same digits is never mixed in
  await createSiteWithKeys(one, { slug: `g152-px-${counter}`, theme: '_sample', content: demoContent(), orderRef: `${order}5`, ownerEmail: 'x@example.test' });
  assert.equal((await one.findSitesByOrderRef(order)).length, 3);
});

test('blob: a claim that loses the race for a unit (another instance, not visible yet) takes the next free unit', async () => {
  const fake = new FakeBlobStore();
  const adapter = new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 });
  const order = freshOrder();
  // another instance made unit 1 a moment ago; this instance's first look at the order does not see it yet
  await createSiteWithKeys(adapter, { slug: `g152-race-${counter}`, theme: '_sample', content: demoContent(), orderRef: order, ownerEmail: 'first@example.test' });
  const lagging = () => {
    let stale = true;
    return new Proxy(adapter, {
      get(target, prop) {
        if (prop === 'findSitesByOrderRef') {
          return async (ref: string) => {
            if (stale) {
              stale = false;
              return [];
            }
            return target.findSitesByOrderRef(ref);
          };
        }
        const v = Reflect.get(target, prop, target);
        return typeof v === 'function' ? v.bind(target) : v;
      },
    }) as DataAdapter;
  };
  // G951: the same email without asking for one more: the lost race ends in the choice, nothing is made
  const ask = await claim(lagging(), { orderNumber: order, email: 'first@example.test' }, { verifier: unitsVerifier(2) });
  assert.equal(ask.status, 200);
  assert.equal(ask.body.next, 'choose');
  // asking for one more: unit 1 is refused by its index file, unit 2 is taken
  const r = await claim(lagging(), { orderNumber: order, email: 'first@example.test', intent: 'add' }, { verifier: unitsVerifier(2) });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const sites = await adapter.findSitesByOrderRef(order);
  assert.deepEqual(sites.map((s) => s.orderSlot ?? 1), [1, 2]);
  // another email (racing or not): order_used
  assert.equal((await claim(lagging(), { orderNumber: order, email: 'third@example.test', intent: 'add' }, { verifier: unitsVerifier(3) })).status, 409);
  assert.equal((await claim(adapter, { orderNumber: order, email: 'third@example.test' }, { verifier: unitsVerifier(2) })).status, 409);
});

test('/my: several websites of the order started with this email → a chooser (names + address), then the chosen one', async () => {
  const adapter = getDataAdapter();
  const order = freshOrder();
  const etsy = unitsVerifier(3);
  const a = await claim(adapter, { orderNumber: order, email: 'avery@example.test' }, { verifier: etsy });
  const b = await claim(adapter, { orderNumber: order, email: 'avery@example.test', theme: 'second-design', names: ['Sam', 'Lee'], intent: 'add' }, { verifier: etsy });
  assert.deepEqual([a.status, b.status], [201, 201]);
  // a website of the same order with another email (made by the shop in the admin): never shown to this email
  const made = await createSiteWithKeys(adapter, { slug: `g152-friend-${counter}`, theme: 'sample-design', content: demoContent(), orderRef: order, ownerEmail: 'friend@example.test', orderSlot: 3 });
  const c = { body: { slug: made.site.slug } };
  const ctx = () => ({ adapter, origin: BASE, ip: freshIp(), userAgent: IPHONE, limiter: new MemoryRateLimiter() });

  const choose = await continueWithOrder(ctx(), { orderNumber: order, email: 'Avery@example.test' });
  assert.equal(choose.status, 200);
  assert.equal(choose.body.next, 'choose');
  const list = choose.body.sites as Json[];
  assert.deepEqual(list.map((s) => s.slug).sort(), [a.body.slug, b.body.slug].sort(), 'only the websites this email started');
  assert.ok(list.every((s) => typeof s.names === 'string' && s.names.length && Object.keys(s).sort().join() === 'design,names,slug'), 'no key, no email');
  assert.deepEqual(list.map((s) => s.design).sort(), ['Sample Design', 'Second Design'], 'G951: each with its design');
  assert.ok(!JSON.stringify(choose.body).includes('?k='));

  const picked = await continueWithOrder(ctx(), { orderNumber: order, email: 'avery@example.test', slug: b.body.slug });
  assert.equal(picked.body.next, 'edit');
  assert.equal(picked.body.slug, b.body.slug);
  const bSlug = String(b.body.slug);
  const state = await stateRoute(new Request(`${BASE}/api/edit/${bSlug}`, { headers: { authorization: `Bearer ${keyOf(String(picked.body.editPath))}` } }), {
    params: Promise.resolve({ slug: bSlug }),
  });
  assert.equal(state.status, 200, 'the device key opens the chosen website');

  const foreign = await continueWithOrder(ctx(), { orderNumber: order, email: 'avery@example.test', slug: c.body.slug });
  assert.equal(foreign.status, 403, "another buyer's website of the same order is never opened");
  assert.equal(foreign.body.code, 'no_match');
  const single = await continueWithOrder(ctx(), { orderNumber: order, email: 'friend@example.test' });
  assert.equal(single.body.next, 'edit', 'one website for this email: straight in');
  assert.equal(single.body.slug, c.body.slug);

  // sign-in link by email: one per website of this email
  const sent: EditLinkMessage[] = [];
  const mailer: EditLinkMailer = { enabled: true, send: async (m) => (sent.push(m), { sent: true }) };
  const r = await emailSignInLink({ ...ctx(), mailer }, { orderNumber: order, email: 'avery@example.test' });
  assert.equal(r.status, 200);
  assert.equal(sent.length, 2);
  assert.ok(sent.every((m) => m.to === 'avery@example.test' && m.kind === 'signin'));
  assert.deepEqual(sent.map((m) => new URL(m.editUrl).pathname).sort(), [`/edit/${a.body.slug}`, `/edit/${b.body.slug}`].sort());
});

// ------------------------------------------------------------------------------------------------ 2. reply emails

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

async function publishedSite(opts: { email?: string | null } = {}) {
  const adapter = getDataAdapter();
  const content = demoContent();
  content.rsvp.deadline = isoDay(300);
  content.date = isoDay(400);
  content.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish'] },
    { id: 'song', label: 'A song for the dance floor', type: 'text' },
  ] as never;
  const slug = `g152-rsvp-${++counter}`;
  const created = await createSiteWithKeys(adapter, { slug, theme: '_sample', content, orderRef: freshOrder(), ownerEmail: opts.email === undefined ? 'avery@example.test' : opts.email });
  await publishSite(adapter, created.site.id);
  return { ...created, slug, site: (await adapter.getSiteById(created.site.id))! };
}

function smtpOn(sent: OutgoingMail[], fail = false) {
  Object.assign(process.env, SMTP);
  setMailTransportFactory(() => ({
    async send(m) {
      if (fail) throw Object.assign(new Error('connect ECONNREFUSED to avery@example.test'), { code: 'ESOCKET' });
      sent.push(m);
    },
  }));
}

function captureLogs(): { lines: string[]; restore: () => void } {
  const lines: string[] = [];
  const orig = { error: console.error, warn: console.warn, log: console.log };
  for (const k of ['error', 'warn', 'log'] as const) console[k] = (...a: unknown[]) => void lines.push(a.map(String).join(' '));
  return { lines, restore: () => Object.assign(console, orig) };
}

test('reserve(): at most DAILY_LIMIT emails a day, the rest counted; the next email says how many more', () => {
  const day1 = new Date('2027-03-01T10:00:00Z');
  let doc: NotifyDoc | null = { v: 1, enabled: true, changedAt: day1.toISOString() };
  for (let i = 0; i < DAILY_LIMIT; i++) {
    const r = reserve(doc, day1);
    assert.equal(r.send, true);
    assert.equal(r.more, 0);
    doc = r.next;
  }
  for (let i = 0; i < 3; i++) {
    const r = reserve(doc, day1);
    assert.equal(r.send, false, 'over the cap: counted, not sent');
    doc = r.next;
  }
  assert.equal(doc?.skipped, 3);
  const next = reserve(doc, new Date('2027-03-02T08:00:00Z'));
  assert.equal(next.send, true);
  assert.equal(next.more, 3, '"3 more replies since our last email"');
  assert.equal(next.next?.sent, 1);
  assert.equal(next.next?.skipped, 0);
  assert.equal(reserve({ v: 1, enabled: false, changedAt: '' }, day1).send, false);
  assert.equal(reserve(null, day1).send, false);
});

test('rsvpReplyEmail: guest, answer, party size, answers, /my link; guest text escaped; English', () => {
  const m = rsvpReplyEmail({
    names: 'Avery & Jordan',
    guestName: 'Sam <b>Lee</b>\r\nBcc: x@example.test',
    attending: true,
    guests: 3,
    answers: [{ question: 'Meal choice', answer: 'Fish' }],
    message: 'See you <script>!</script>',
    moreReplies: 2,
    dailyLimit: 20,
    myUrl: `${BASE}/my`,
    siteUrl: `${BASE}/avery-and-jordan`,
  });
  assert.doesNotMatch(m.subject, /[\r\n]/, 'one-line subject');
  assert.match(m.subject, /^New RSVP: Sam <b>Lee<\/b> Bcc: x@example\.test — attending$/);
  assert.match(m.text, /Party size: 3 people/);
  assert.match(m.text, /Meal choice: Fish/);
  assert.match(m.text, /2 more replies arrived since our last email \(we send at most 20 reply emails a day\)/);
  assert.match(m.text, new RegExp(`open ${BASE}/my and sign in with your Etsy order number`));
  assert.doesNotMatch(m.html, /<script>|<b>Lee/, 'escaped');
  assert.match(m.html, /&#60;b&#62;Lee/);
  assert.match(m.html, /<html lang="en">/);
  const no = rsvpReplyEmail({ names: '', guestName: 'Kim', attending: false, guests: 0, answers: [], message: null, moreReplies: 0, dailyLimit: 20, myUrl: `${BASE}/my`, siteUrl: `${BASE}/x` });
  assert.match(no.subject, /not attending$/);
  assert.doesNotMatch(no.text, /Party size|more repl/);
});

test('reply emails: off by default; on → to the owner email on record, no key in it; held / couple replies never; failures never logged with data', async () => {
  const sent: OutgoingMail[] = [];
  smtpOn(sent);
  const s = await publishedSite();
  const adapter = getDataAdapter();
  const reply = async (over: Json = {}) => adapter.saveRsvp(s.site.id, { name: 'Sam Lee', attending: true, guests: 2, message: 'Can’t wait!', answers: [{ id: 'meal', question: 'Meal choice', answer: 'Fish' }], ...over } as never);

  assert.deepEqual(await notifyCouple(adapter, s.site, await reply(), BASE), { sent: false }, 'off by default');
  assert.equal(sent.length, 0);
  await setNotify(adapter, s.site, true);
  assert.deepEqual(await notifyCouple(adapter, s.site, await reply(), BASE), { sent: true });
  assert.equal(sent.length, 1);
  const m = sent[0];
  assert.equal(m.to, 'avery@example.test', 'the owner email on record');
  assert.match(m.text, /Guest: Sam Lee/);
  assert.match(m.text, /Answer: Attending/);
  assert.match(m.text, /Party size: 2 people/);
  assert.match(m.text, /Meal choice: Fish/);
  assert.match(m.text, /Note: Can’t wait!/);
  assert.match(m.text, new RegExp(`${BASE}/my`));
  assert.doesNotMatch(`${m.text}${m.html}`, /\?k=|\/edit\//, 'never an edit or device key');
  assert.ok(!`${m.text}${m.html}`.includes(s.editKey));

  assert.deepEqual(await notifyCouple(adapter, s.site, await reply({ held: true }), BASE), { sent: false }, 'held replies are not emailed');
  assert.deepEqual(await notifyCouple(adapter, s.site, await reply({ source: 'couple' }), BASE), { sent: false }, 'replies the couple adds are not emailed');
  assert.equal(sent.length, 1);

  // the cap holds across parallel replies (the count is reserved in the site document)
  await adapter.updateSiteDoc<NotifyDoc>(s.site.id, NOTIFY_DOC, (cur) => ({ ...(cur as NotifyDoc), sent: DAILY_LIMIT - 2, day: new Date().toISOString().slice(0, 10) }));
  const results = await Promise.all(Array.from({ length: 5 }, async () => notifyCouple(adapter, s.site, await reply(), BASE)));
  assert.equal(results.filter((r) => r.sent).length, 2, 'only the 2 left today');
  const doc = (await adapter.readSiteDoc(s.site.id, NOTIFY_DOC)) as NotifyDoc;
  assert.equal(doc.sent, DAILY_LIMIT);
  assert.equal(doc.skipped, 3);

  // turned off: nothing more
  await setNotify(adapter, s.site, false);
  const before = sent.length;
  await notifyCouple(adapter, s.site, await reply(), BASE);
  assert.equal(sent.length, before);

  // a failing SMTP server: {sent: false}, no throw, and the log has a code only
  const failing: OutgoingMail[] = [];
  smtpOn(failing, true);
  const f = await publishedSite();
  await setNotify(adapter, f.site, true);
  const logs = captureLogs();
  try {
    assert.deepEqual(await notifyCouple(adapter, f.site, await adapter.saveRsvp(f.site.id, { name: 'Sam Lee', attending: false, guests: 0 } as never), BASE), { sent: false });
  } finally {
    logs.restore();
  }
  assert.ok(logs.lines.some((l) => /\[mail\] rsvp notice: ESOCKET/.test(l)));
  assert.ok(logs.lines.every((l) => !/@|Sam Lee|\/my/.test(l)), 'no address, guest or link in the log');

  // without SMTP: never
  for (const k of Object.keys(SMTP)) delete process.env[k];
  setMailTransportFactory(null);
  const quiet = await publishedSite();
  await setNotify(adapter, quiet.site, true);
  assert.deepEqual(await notifyCouple(adapter, quiet.site, await reply(), BASE), { sent: false });
  // no owner email: never
  smtpOn(sent);
  const anon = await publishedSite({ email: null });
  await setNotify(adapter, anon.site, true);
  assert.deepEqual(await notifyCouple(adapter, anon.site, await reply(), BASE), { sent: false });
});

async function guestReply(slug: string, body: Json) {
  const res = await rsvpRoute(
    new Request(`${BASE}/api/rsvp/${slug}`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': freshIp() }, body: JSON.stringify(body) }),
    { params: Promise.resolve({ slug }) },
  );
  return { status: res.status, body: (await res.json()) as Json };
}

const waitFor = async (cond: () => boolean, ms = 2000) => {
  const end = Date.now() + ms;
  while (!cond() && Date.now() < end) await new Promise((r) => setTimeout(r, 10));
  return cond();
};

test('RSVP route: a guest reply emails the couple when it is on; a failed send never changes the guest’s answer', async () => {
  const sent: OutgoingMail[] = [];
  smtpOn(sent);
  const s = await publishedSite();
  await setNotify(getDataAdapter(), s.site, true);
  const r = await guestReply(s.slug, { name: 'Robin Gray', attending: 'yes', guests: 2, answers: { meal: 'Chicken', song: 'September' } });
  assert.equal(r.status, 200);
  assert.ok(await waitFor(() => sent.length === 1), 'the email went out after the answer');
  assert.match(sent[0].text, /Guest: Robin Gray/);
  assert.match(sent[0].text, /Meal choice: Chicken/);
  assert.match(sent[0].text, /A song for the dance floor: September/);

  const failing: OutgoingMail[] = [];
  smtpOn(failing, true);
  const f = await publishedSite();
  await setNotify(getDataAdapter(), f.site, true);
  const logs = captureLogs();
  try {
    const bad = await guestReply(f.slug, { name: 'Robin Gray', attending: 'no' });
    assert.equal(bad.status, 200);
    assert.equal(bad.body.state, 'success');
    await waitFor(() => logs.lines.some((l) => l.includes('rsvp notice')));
  } finally {
    logs.restore();
  }
  assert.equal((await getDataAdapter().listRsvps(f.site.id)).length, 1, 'the reply is stored');
});

async function notifyCall(slug: string, key: string, body?: Json) {
  const req = new Request(`${BASE}/api/edit/${slug}/notify`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${key}`, ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const res = await (body ? notifyPost : notifyGet)(req, { params: Promise.resolve({ slug }) });
  return { status: res.status, body: (await res.json()) as Json };
}

test('panel route /notify: hidden without SMTP (503 to turn on); owner and device turn it on/off; shop link 403; wrong key 401', async () => {
  const s = await publishedSite();
  const off = await notifyCall(s.slug, s.editKey);
  assert.equal(off.status, 200);
  assert.deepEqual(off.body.notify, { available: false, enabled: false, to: 'av***@example.test' });
  assert.equal((await notifyCall(s.slug, s.editKey, { enabled: true })).status, 503);

  smtpOn([]);
  const on = await notifyCall(s.slug, s.editKey, { enabled: true });
  assert.equal(on.status, 200);
  assert.deepEqual(on.body.notify, { available: true, enabled: true, to: 'av***@example.test' });
  assert.ok(!JSON.stringify(on.body).includes('avery@example.test'), 'the address is shown partly hidden');
  const { key: device } = await mintDeviceKey(getDataAdapter(), s.site, { via: 'continue', label: 'iPhone · Safari' });
  assert.equal((await notifyCall(s.slug, device, { enabled: false })).body.notify.enabled, false, 'a signed-in device can switch it');
  const shop = await issueShopEditKey(getDataAdapter(), s.site.id);
  assert.equal((await notifyCall(s.slug, shop.editKey)).status, 200, 'the shop sees it');
  assert.equal((await notifyCall(s.slug, shop.editKey, { enabled: true })).status, 403, 'but cannot turn on emails to the couple');
  assert.equal((await notifyCall(s.slug, 'x'.repeat(43))).status, 401);
  assert.equal((await notifyCall(s.slug, s.editKey, { enabled: 'yes' })).status, 400);
  const anon = await publishedSite({ email: null });
  assert.equal((await notifyCall(anon.slug, anon.editKey, { enabled: true })).status, 409, 'no address on record');
  assert.equal((await notifyCall(anon.slug, anon.editKey)).body.notify.to, null);
});

// ------------------------------------------------------------------------------------------------ 3. admin devices

async function adminCookie(): Promise<string> {
  const res = await sessionPost(new Request(`${BASE}/api/admin/session`, { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ password: PASSWORD }) }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

test('admin: devices signed in (labels + dates, no keys) and "sign out all devices" — the edit link stays', async () => {
  const adapter = getDataAdapter();
  const s = await publishedSite();
  const site = (await adapter.getSiteById(s.site.id)) as SiteRecord;
  const one = await mintDeviceKey(adapter, site, { via: 'continue', label: 'iPhone · Safari', now: new Date('2027-01-01T10:00:00Z') });
  const two = await mintDeviceKey(adapter, site, { via: 'email', label: '', now: new Date('2027-01-02T10:00:00Z') });
  const detail = (await adminSite(s.site.id))!;
  assert.deepEqual(detail.devices, [
    { label: '', createdAt: '2027-01-02T10:00:00.000Z', via: 'email' },
    { label: 'iPhone · Safari', createdAt: '2027-01-01T10:00:00.000Z', via: 'continue' },
  ]);
  assert.ok(!JSON.stringify(detail).includes(one.key) && !JSON.stringify(detail.devices).includes('hash'));

  const cookie = await adminCookie();
  const action = (name: string) =>
    adminAction(new Request(`${BASE}/api/admin/sites/${s.site.id}/${name}`, { method: 'POST', headers: { 'content-type': 'application/json', cookie, host: 'localhost:3000', origin: BASE }, body: '{}' }), {
      params: Promise.resolve({ id: s.site.id, action: name }),
    });
  const unauth = await adminAction(new Request(`${BASE}/api/admin/sites/${s.site.id}/devices-signout`, { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: BASE }, body: '{}' }), {
    params: Promise.resolve({ id: s.site.id, action: 'devices-signout' }),
  });
  assert.equal(unauth.status, 401);
  const res = await action('devices-signout');
  assert.equal(res.status, 200);
  const body = (await res.json()) as Json;
  assert.equal(body.removed, 2);
  assert.deepEqual(body.devices, []);
  const state = (key: string) => stateRoute(new Request(`${BASE}/api/edit/${s.slug}`, { headers: { authorization: `Bearer ${key}` } }), { params: Promise.resolve({ slug: s.slug }) });
  assert.equal((await state(one.key)).status, 401);
  assert.equal((await state(two.key)).status, 401);
  assert.equal((await state(s.editKey)).status, 200, "the buyer's private edit link keeps working");
});

// ------------------------------------------------------------------------------------------------ texts

test('every G152 text is translated in tr/es/de/fr', async () => {
  const files = ['components/panel/ReplyNoticeCard.tsx', 'lib/panel/notify.ts', 'components/my/MyWebsite.tsx'];
  const keys = new Set(files.flatMap((f) => scanSource(readFileSync(path.join(PLATFORM_ROOT, f), 'utf8'))));
  for (const k of ['Which website do you want to open?', 'Email me when a guest replies', 'Reply emails are not available yet.']) assert.ok(keys.has(k), k);
  for (const lang of ['tr', 'es', 'de', 'fr'] as const) {
    const dict = await loadDict('panel', lang);
    const missing = [...keys].filter((k) => !dict[k]);
    assert.deepEqual(missing, [], lang);
  }
});
