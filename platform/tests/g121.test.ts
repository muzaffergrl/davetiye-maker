// G121 (docs/18 P2 + docs/19 §6 remainder): the admin's editable Etsy message (the "cannot be sent yet" check on the
// edited text), the copied-message log (template + time, never the text; shop only), the template the message box opens
// with, the "order without a website" search hint, and the /designs style filter data (every live design has a style;
// the CSS has a hiding rule for every style). Browser behaviour: tests/g121-browser.ts.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as actionPost } from '../app/api/admin/sites/[id]/[action]/route.ts';
import { MESSAGE_LOG_LIMIT, messageMissing, messageTemplate, renderMessage, withMessageLog } from '../lib/admin/messages.ts';
import { siteHistory } from '../lib/admin/summary.ts';
import { defaultTemplateId, orderWithoutSite } from '../lib/admin/view.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { DESIGN_STYLES, designStyles, liveDesigns, STYLE_FILTER_MIN_DESIGNS, STYLE_FILTERS, styleFilterChips } from '../lib/marketing/designs.ts';
import { openingPlace, openingTabLabel } from '../lib/panel/model.ts';
import { panelState, panelTheme, themeOpening, withOpeningWords } from '../lib/panel/state.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';

before(() => {
  const themes = tmpDir('g121-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g121-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
});

function req(url: string, init: { method?: string; json?: unknown; cookie?: string | null } = {}): Request {
  const headers = new Headers({ host: 'localhost:3000', origin: BASE });
  if (init.json !== undefined) headers.set('content-type', 'application/json');
  if (init.cookie) headers.set('cookie', init.cookie);
  return new Request(`${BASE}${url}`, { method: init.method ?? 'GET', headers, body: init.json !== undefined ? JSON.stringify(init.json) : undefined });
}

async function signIn(): Promise<string> {
  const res = await sessionPost(req('/api/admin/session', { method: 'POST', json: { password: PASSWORD } }));
  assert.equal(res.status, 200);
  return (res.headers.get('set-cookie') ?? '').split(';')[0];
}

function act(id: string, action: string, cookie: string, json: unknown = {}) {
  return actionPost(req(`/api/admin/sites/${id}/${action}`, { method: 'POST', json, cookie }), { params: Promise.resolve({ id, action }) });
}

test('editable message: the "cannot be sent yet" check runs on the edited text too', () => {
  // G135 took the undecided time out of publish_blocked_pending; date_moved still waits for a decision.
  const t = messageTemplate('date_moved')!;
  const r = renderMessage(t, { names: 'Ada & Grace', order: '1234567890', design: 'Blush Garden Rose', siteUrl: 'https://x/ada', startUrl: 'https://x/start' });
  // the template still waits for a decision ([POSTPONEMENT POLICY])
  assert.deepEqual(r.missing, messageMissing(r.text));
  assert.ok(r.missing.includes('[POSTPONEMENT POLICY]'));
  // the shop writes the policy in by hand: the edited text can be copied
  const edited = r.text.replace('[POSTPONEMENT POLICY]', 'We can move it once for free.');
  assert.deepEqual(messageMissing(edited), []);
  // a half-written edit is caught
  assert.deepEqual(messageMissing('Hi {names}, see [EXTENSION POLICY].'), ['{names}', '[EXTENSION POLICY]']);
});

test('message log: capped, newest last, template + time only', () => {
  let log = withMessageLog(null, 'how_to_publish', '2026-10-16T09:00:00.000Z');
  assert.deepEqual(log, [{ id: 'how_to_publish', at: '2026-10-16T09:00:00.000Z' }]);
  for (let i = 0; i < MESSAGE_LOG_LIMIT + 5; i++) log = withMessageLog(log, 'general_help', `2026-10-16T10:${String(i % 60).padStart(2, '0')}:00.000Z`);
  assert.equal(log.length, MESSAGE_LOG_LIMIT);
  assert.equal(log.at(-1)!.id, 'general_help');
  assert.deepEqual(Object.keys(log[0]).sort(), ['at', 'id']);
});

test('admin "message-log" action: history line for the shop, unknown template refused, never in the buyer panel', async () => {
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'g121-log', theme: '_sample', content: demoContent(), orderRef: '7788990011', ownerEmail: 'b@example.com' });
  const id = created.site.id;
  const cookie = await signIn();

  let res = await act(id, 'message-log', cookie, { template: 'no_such_template' });
  assert.equal(res.status, 400);

  res = await act(id, 'message-log', cookie, { template: 'how_to_publish' });
  assert.equal(res.status, 200);
  const body = (await res.json()) as { ok: boolean; history: Array<{ text: string; by: string }> };
  assert.equal(body.ok, true);
  const line = body.history.find((h) => h.text.startsWith('Etsy mesajı kopyalandı'));
  assert.ok(line, 'the copy shows in the history');
  assert.equal(line!.by, 'support');
  assert.ok(line!.text.includes(messageTemplate('how_to_publish')!.title));

  const site = (await adapter.getSiteById(id))!;
  assert.deepEqual(site.messageLog?.map((m) => m.id), ['how_to_publish']);
  assert.ok(!JSON.stringify(site.messageLog).includes('Hi'), 'the message text is never kept');
  assert.ok(siteHistory(site).some((h) => h.text.startsWith('Etsy mesajı kopyalandı')));
  const state = JSON.stringify(await panelState(site, BASE));
  assert.ok(!state.includes('messageLog') && !state.includes('Etsy mesajı'), 'the buyer never sees the shop log');

  // signed out: refused
  res = await act(id, 'message-log', '', { template: 'how_to_publish' });
  assert.equal(res.status, 401);
});

test('message box opens with the fitting template (waiting order / closing soon / how to publish)', () => {
  const now = Date.parse('2026-10-16T12:00:00.000Z');
  assert.equal(defaultTemplateId({ needsAction: true, state: 'draft', onlineUntil: null }, now), 'publish_blocked_pending');
  assert.equal(defaultTemplateId({ needsAction: false, state: 'published', onlineUntil: '2026-11-01' }, now), 'archive_notice');
  assert.equal(defaultTemplateId({ needsAction: false, state: 'published', onlineUntil: '2027-11-01' }, now), 'how_to_publish');
  assert.equal(defaultTemplateId({ needsAction: false, state: 'draft', onlineUntil: null }, now), 'how_to_publish');
  for (const id of ['publish_blocked_pending', 'archive_notice', 'how_to_publish']) assert.ok(messageTemplate(id), id);
});

test('order search: an Etsy order number without a website (the /start number rule)', () => {
  const sites = [{ orderRef: '1234567890' }, { orderRef: null }];
  assert.equal(orderWithoutSite(sites, '#1234567890'), null, 'has a website');
  assert.equal(orderWithoutSite(sites, 'Order #3456 7890 12'), '3456789012');
  assert.equal(orderWithoutSite(sites, '9988776655'), '9988776655');
  assert.equal(orderWithoutSite(sites, 'ada'), null, 'not an order number');
  assert.equal(orderWithoutSite(sites, '123'), null, 'too short');
});

test('/designs style filter: every live design has a known style; chips with counts; a CSS rule per style', () => {
  const live = liveDesigns();
  const known = new Set<string>(STYLE_FILTERS.map((f) => f.id));
  for (const d of live) {
    assert.ok(designStyles(d.id).length > 0, `${d.id} has a style`);
    for (const s of designStyles(d.id)) assert.ok(known.has(s), `${d.id}: ${s}`);
  }
  for (const [id, styles] of Object.entries(DESIGN_STYLES)) assert.ok(styles.length > 0, `${id}: at least one style`);
  assert.ok(live.length >= STYLE_FILTER_MIN_DESIGNS, 'the filter shows with today\'s designs');
  const chips = styleFilterChips(live);
  assert.equal(chips.length, STYLE_FILTERS.length, 'every style has at least one design today');
  for (const c of chips) assert.equal(c.count, live.filter((d) => designStyles(d.id).includes(c.id)).length);
  assert.deepEqual(styleFilterChips(live.slice(0, 1)).map((c) => c.id), [...designStyles(live[0].id)].sort((a, b) => STYLE_FILTERS.findIndex((f) => f.id === a) - STYLE_FILTERS.findIndex((f) => f.id === b)));

  const css = readFileSync(path.join(PLATFORM_ROOT, 'components/marketing/marketing.module.css'), 'utf8');
  for (const f of STYLE_FILTERS) {
    assert.ok(css.includes(`.gallery:has(.filterInput[value='${f.id}']:checked) [data-styles]:not([data-styles~='${f.id}'])`), `CSS hides the other cards for ${f.id}`);
  }
});

test('panel names the design\'s own opening: preview tab, sentences, editable-text labels (not "Envelope" everywhere)', async () => {
  const want: Record<string, string> = {
    'art-deco-black-tie': 'gatefold',
    'ivory-lace-pearls': 'gatefold',
    'lavender-provence': 'pouch',
    'tropical-destination': 'wallet',
    'enchanted-forest-storybook': 'book',
    'wildflower-meadow-vellum': 'sleeve',
    'blush-garden-rose': 'envelope',
    'olive-ivory': 'envelope',
  };
  for (const [id, noun] of Object.entries(want)) assert.equal(themeOpening(id), noun, id);
  for (const d of liveDesigns()) assert.ok(themeOpening(d.id), `${d.id} has an opening noun`);
  assert.equal(themeOpening('_sample'), null);
  assert.equal(openingTabLabel('book'), 'Book');
  assert.equal(openingTabLabel('envelope'), 'Envelope');
  assert.equal(openingTabLabel(null), 'Opening');
  assert.equal(openingPlace('wallet'), 'wallet');
  assert.equal(openingPlace(null), 'opening page');
  const entries = [
    { key: 'envelope_kicker', label: 'Above your names on the envelope' },
    { key: 'envelope_replay', label: 'Open the envelope again (envelope page)' },
    { key: 'story_title', label: 'Our Story heading' },
  ] as Parameters<typeof withOpeningWords>[0];
  assert.deepEqual(
    withOpeningWords(entries, 'book').map((e) => e.label),
    ['Above your names on the book', 'Open the book again (book page)', 'Our Story heading'],
  );
  assert.equal(withOpeningWords(entries, 'envelope'), entries, 'envelope designs keep their labels');
  assert.equal((await panelTheme('_sample')).opening, null, 'a design without sales copy: "Opening"');
});

