// G098: four small bugs found in the G096 live test (gorevler/G092-canli-admin.md "Ek gözlemler").
//  1. the admin overview counted the seeded demo sites (order DEMO-SEED-…) as sales;
//  2. /my "On this device" kept showing a website after it was deleted;
//  3. the "Sipariş onaylanıyor" Etsy message could not be sent ([ORDER CHECK TIME]) and showed a developer note;
//  4. the setup showed the design's sample time zone while the stored draft already had the phone's.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import { GET as stateRoute } from '../app/api/edit/[slug]/route.ts';
import { messageTemplate, MESSAGE_TEMPLATES, renderMessage } from '../lib/admin/messages.ts';
import { adminCustomers, adminDashboard, adminDesigns, isDemo, isSale, type AdminSiteSummary } from '../lib/admin/summary.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { claimSite, claimTimeZone, draftFromDemo } from '../lib/claim/claim.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { sampleNotes } from '../lib/panel/model.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { checkEditor, dropGoneEditors, readEditors, REMEMBER_KEY, type RememberedEditor } from '../lib/panel/remember.ts';
import { createSiteWithKeys, reissueKeys } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

before(() => {
  const themes = tmpDir('g098-themes-');
  for (const t of ['_sample', 'blush-garden-rose']) cpSync(path.join(PLATFORM_ROOT, 'themes', t), path.join(themes, t), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g098-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

// ------------------------------------------------------------------------------------------------ 1. demo sites

function fake(over: Partial<AdminSiteSummary>): AdminSiteSummary {
  return {
    id: over.slug ?? 'x',
    slug: 'x',
    theme: 'blush-garden-rose',
    themeName: 'Blush Garden Rose',
    names: 'A & B',
    orderRef: '1234567890',
    ownerEmail: 'a@example.com',
    state: 'draft',
    order: 'not_required',
    orderNote: null,
    orderCheckedAt: null,
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z',
    publishedAt: null,
    firstPublishedAt: null,
    weddingDate: '2027-06-12',
    onlineUntil: null,
    archiveSource: null,
    replies: 0,
    changes: null,
    guestPassword: false,
    unpublishedChanges: false,
    needsAction: false,
    note: null,
    noteAt: null,
    place: null,
    madeByShop: false,
    ...over,
  };
}

test('1. seeded demo sites (DEMO-SEED-…) are listed but never counted as sales', () => {
  const now = new Date('2026-10-15T12:00:00.000Z');
  const demos = ['olive-ivory', 'olive-ivory', 'dusty-blue', 'blush-garden-rose', 'vintage-airmail'].map((theme, i) =>
    fake({ slug: `demo-${i}`, orderRef: `DEMO-SEED-demo-${i}`, ownerEmail: null, theme, themeName: theme, state: 'published', createdAt: '2026-10-15T07:00:00.000Z' }),
  );
  const sale = fake({ slug: 'real', orderRef: '20261018', createdAt: '2026-10-15T08:00:00.000Z' });
  const list = [...demos, sale];

  assert.equal(isDemo(demos[0]), true);
  assert.equal(isSale(demos[0]), false);
  assert.equal(isDemo(sale), false);
  assert.equal(isSale(sale), true);
  assert.equal(isDemo(fake({ orderRef: null })), false);

  const d = adminDashboard(list, now);
  assert.deepEqual(d.sales, { total: 1, today: 1, last7: 1, last30: 1, thisMonth: 1 }, 'was "Bugün 6 satış · toplam 7" live');
  assert.equal(d.weeks.reduce((n, w) => n + w.count, 0), 1, 'weekly chart: only the real order');
  assert.deepEqual(d.byDesign.map((b) => [b.theme, b.count]), [['blush-garden-rose', 1]], 'best sellers: only the real order');
  assert.equal(d.sites.total, 6, 'the demos still count as sites');
  assert.ok(d.recent.some((s) => s.slug === 'demo-0'), 'the demos still appear in the lists (with a Demo badge)');

  const designs = adminDesigns(list, [{ id: 'olive-ivory', name: 'Olive & Ivory', live: true }]);
  assert.equal(designs.find((r) => r.id === 'olive-ivory')!.sales, 0);
  assert.equal(designs.find((r) => r.id === 'olive-ivory')!.published, 2);

  const withEmail = adminCustomers([fake({ slug: 'demo-m', orderRef: 'DEMO-SEED-demo-m' }), sale]);
  assert.equal(withEmail[0].orders, 1, 'a demo with an email is not an order of that customer');
});

// ------------------------------------------------------------------------------------------------ 2. /my list

function memoryStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const map = new Map<string, string>();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, String(v)) };
}

/** fetch() that answers same-origin /api/edit/<slug> through the real route. */
const routeFetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = new URL(String(input), 'http://localhost:3000');
  const slug = decodeURIComponent(url.pathname.split('/').pop() ?? '');
  return stateRoute(new Request(url, { headers: init?.headers }), { params: Promise.resolve({ slug }) });
}) as typeof fetch;

function entry(slug: string, key: string, at: string): RememberedEditor {
  return { slug, path: `/edit/${slug}?k=${encodeURIComponent(key)}`, names: slug, at };
}

test('2. /my: an editor whose website was deleted, or whose link was replaced, is dropped; others stay', async () => {
  const adapter = getDataAdapter();
  const kept = await createSiteWithKeys(adapter, { slug: 'g098-kept', theme: '_sample', content: demoContent() });
  const deleted = await createSiteWithKeys(adapter, { slug: 'g098-deleted', theme: '_sample', content: demoContent() });
  const replaced = await createSiteWithKeys(adapter, { slug: 'g098-replaced', theme: '_sample', content: demoContent() });

  const storage = memoryStorage();
  storage.setItem(
    REMEMBER_KEY,
    JSON.stringify([
      entry('g098-kept', kept.editKey, '2026-10-16T10:00:00.000Z'),
      entry('g098-deleted', deleted.editKey, '2026-10-16T09:00:00.000Z'),
      entry('g098-replaced', replaced.editKey, '2026-10-16T08:00:00.000Z'),
    ]),
  );
  assert.equal(await checkEditor(readEditors(storage)[1], routeFetch), 'ok', 'before the delete the link works');

  await adapter.deleteSite(deleted.site.id);
  await reissueKeys(adapter, replaced.site.id);

  const r = await dropGoneEditors(storage, routeFetch);
  assert.deepEqual(r.gone.map((e) => e.slug).sort(), ['g098-deleted', 'g098-replaced']);
  assert.deepEqual(r.editors.map((e) => e.slug), ['g098-kept']);
  assert.deepEqual(readEditors(storage).map((e) => e.slug), ['g098-kept'], 'forgotten on this device');
});

test('2. /my: network errors and server errors keep the editor (it may open later)', async () => {
  const e = entry('g098-any', 'k'.repeat(20), '2026-10-16T10:00:00.000Z');
  const offline = (async () => {
    throw new TypeError('Failed to fetch');
  }) as typeof fetch;
  const status = (n: number) => (async () => new Response('{}', { status: n })) as typeof fetch;
  assert.equal(await checkEditor(e, offline), 'unknown');
  assert.equal(await checkEditor(e, status(500)), 'unknown');
  assert.equal(await checkEditor(e, status(429)), 'unknown');
  assert.equal(await checkEditor(e, status(401)), 'gone');
  assert.equal(await checkEditor(e, status(404)), 'gone');

  const storage = memoryStorage();
  storage.setItem(REMEMBER_KEY, JSON.stringify([e]));
  const r = await dropGoneEditors(storage, offline);
  assert.deepEqual(r.gone, []);
  assert.equal(readEditors(storage).length, 1);
});

// ------------------------------------------------------------------------------------------------ 3. Etsy message

test('3. "Sipariş onaylanıyor" can be copied: no undecided time promise, no developer note in the admin', () => {
  const t = messageTemplate('publish_blocked_pending')!;
  const r = renderMessage(t, { names: 'A & B', order: '20261018', design: 'Olive & Ivory', siteUrl: 'https://x/a', startUrl: 'https://x/start' });
  assert.deepEqual(r.missing, [], 'nothing left to decide: the message is ready');
  assert.doesNotMatch(r.text, /ORDER CHECK TIME|usually|within|hours|days/i, 'no promise of how long the check takes');
  assert.match(r.text, /order 20261018 is confirmed/);
  assert.ok(t.note && /Siparişi onayla/.test(t.note), 'a Turkish note on what to do');
  for (const m of MESSAGE_TEMPLATES) {
    assert.doesNotMatch(m.note ?? '', /node |scripts\/|\.ts\b|docs\/|§/, `${m.id}: no developer note in the shop admin`);
  }
});

// ------------------------------------------------------------------------------------------------ 4. time zone

test('4. /start stores the phone’s time zone: the draft, the setup and the admin agree from the start', async () => {
  assert.equal(claimTimeZone('Europe/Istanbul'), 'Europe/Istanbul');
  assert.equal(claimTimeZone('America/Argentina/Buenos_Aires'), 'America/Argentina/Buenos_Aires');
  for (const bad of [null, '', 'UTC', 'Mars/Olympus_Mons', 'Europe/Istanbul; drop', 'x'.repeat(80), 42]) assert.equal(claimTimeZone(bad), null, String(bad));

  const theme = (await claimableTheme('blush-garden-rose'))!;
  assert.equal(theme.demo.timezone, 'America/New_York', 'the design’s sample zone');
  const draft = draftFromDemo(theme.demo, ['Iris', 'Kai'], 'Europe/Istanbul');
  assert.equal(draft.timezone, 'Europe/Istanbul');
  assert.equal(draft.date, theme.demo.date, 'only the zone: the sample date stays (the setup still asks for it)');
  assert.equal(draftFromDemo(theme.demo, ['Iris', 'Kai']).timezone, 'America/New_York', 'no zone sent: the sample stays');
  const notes = sampleNotes(draft, theme.demo, { deviceZone: 'Europe/Istanbul' }).map((n) => n.path);
  assert.ok(!notes.includes('timezone'), 'the zone is not flagged as sample text (no "Sample" tag in the setup)');
  assert.ok(notes.includes('date'), 'the date still is');

  const claim = (timeZone: unknown, orderNumber: string, names: string[]) =>
    claimSite(
      { adapter: getDataAdapter(), origin: 'http://localhost:3000', ip: '192.0.2.98', limiter: new MemoryRateLimiter(), approvalEnv: {} },
      { theme: 'blush-garden-rose', orderNumber, email: 'g098@example.test', names, slug: '', website: '', timeZone },
    );
  const res = await claim('Europe/Istanbul', '98000001', ['Iris', 'Kai']);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const stored = await getDataAdapter().getSiteBySlug(String((res.body as { slug?: unknown }).slug));
  assert.equal(stored!.content.timezone, 'Europe/Istanbul', 'what the admin shows as "Saat dilimi"');

  const bad = await claim('Not/AZone', '98000002', ['Una', 'Bo']);
  assert.equal(bad.status, 201, 'an unknown zone never blocks the claim');
  const storedBad = await getDataAdapter().getSiteBySlug(String((bad.body as { slug?: unknown }).slug));
  assert.equal(storedBad!.content.timezone, 'America/New_York');
});
