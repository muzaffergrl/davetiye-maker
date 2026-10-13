// RSVP API routes (G042): guest replies, form status, couple list/counts/CSV, key protection,
// and the theme form contract rendered through the real site route (fixture theme).
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as statusRoute, POST as postRoute } from '../app/api/rsvp/[slug]/route.ts';
import { GET as responsesRoute, POST as responsesPost } from '../app/api/rsvp/[slug]/responses/route.ts';
import { GET as exportRoute } from '../app/api/rsvp/[slug]/export/route.ts';
import { GET as getPage } from '../app/[slug]/[page]/route.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { DEFAULT_RSVP_LIMITS } from '../lib/rsvp/config.ts';
import { submitRsvp } from '../lib/rsvp/guest.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
type Keys = { id: string; editKey: string; previewKey: string };
const sites: Record<string, Keys> = {};

/** YYYY-MM-DD, `days` from today (UTC). Keeps the tests valid whatever day they run. */
function isoDay(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

function content(deadlineDays: number, eventDays: number, edit?: (c: ContentRecord) => void): ContentRecord {
  const c = demoContent();
  c.rsvp.deadline = isoDay(deadlineDays);
  c.date = isoDay(eventDays);
  edit?.(c);
  return c;
}

async function makeSite(slug: string, theme: string, c: ContentRecord, publish = true): Promise<Keys> {
  const adapter = getDataAdapter();
  const s = await createSiteWithKeys(adapter, { slug, theme, content: c });
  if (publish) await publishSite(adapter, s.site.id);
  return { id: s.site.id, editKey: s.editKey, previewKey: s.previewKey };
}

before(async () => {
  const themes = tmpDir('platform-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  cpSync(path.join(PLATFORM_ROOT, 'tests/fixtures/themes/rsvp-fixture'), path.join(themes, 'rsvp-fixture'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-data-');

  sites.open = await makeSite('open-site', 'rsvp-fixture', content(300, 400));
  sites.sample = await makeSite('sample-site', '_sample', content(300, 400));
  sites.closed = await makeSite('closed-site', 'rsvp-fixture', content(-2, 30));
  sites.off = await makeSite('off-site', 'rsvp-fixture', content(300, 400, (c) => (c.rsvp.method = 'none')));
  sites.draft = await makeSite('draft-site', 'rsvp-fixture', content(300, 400), false);
  sites.unpub = await makeSite('unpub-site', 'rsvp-fixture', content(300, 400));
  await getDataAdapter().unpublish(sites.unpub.id);
  sites.other = await makeSite('other-site', 'rsvp-fixture', content(300, 400));
});

beforeEach(() => setRsvpRateLimiter(new MemoryRateLimiter()));

let ipCounter = 0;
const freshIp = () => `198.51.100.${++ipCounter}`;

function post(slug: string, body: unknown, opts: { ip?: string; type?: string; raw?: string } = {}) {
  const req = new Request(`${BASE}/api/rsvp/${slug}`, {
    method: 'POST',
    headers: { 'content-type': opts.type ?? 'application/json', 'x-forwarded-for': opts.ip ?? freshIp() },
    body: opts.raw ?? JSON.stringify(body),
  });
  return postRoute(req, { params: Promise.resolve({ slug }) });
}
function status(slug: string, query = '') {
  return statusRoute(new Request(`${BASE}/api/rsvp/${slug}${query}`), { params: Promise.resolve({ slug }) });
}
function responses(slug: string, opts: { bearer?: string; query?: string } = {}) {
  const headers: Record<string, string> = opts.bearer ? { authorization: `Bearer ${opts.bearer}` } : {};
  return responsesRoute(new Request(`${BASE}/api/rsvp/${slug}/responses${opts.query ?? ''}`, { headers }), { params: Promise.resolve({ slug }) });
}
function csv(slug: string, opts: { bearer?: string; query?: string } = {}) {
  const headers: Record<string, string> = opts.bearer ? { authorization: `Bearer ${opts.bearer}` } : {};
  return exportRoute(new Request(`${BASE}/api/rsvp/${slug}/export${opts.query ?? ''}`, { headers }), { params: Promise.resolve({ slug }) });
}
const stored = (key: string) => getDataAdapter().listRsvps(sites[key].id);

const SUCCESS_BODY = { ok: true, state: 'success', message: 'Thank you! Your reply has been sent.' };

test('valid reply: 200 success, stored cleaned, response reveals nothing else', async () => {
  await post('open-site', { name: 'Previous Guest', email: 'prev@example.org', attending: 'yes', guests: 2 });
  const res = await post('open-site', { name: '  Mara  Quinn ', email: 'mara@example.org', attending: 'yes', guests: '3', message: 'See you there!', website: '' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  const text = await res.text();
  assert.deepEqual(JSON.parse(text), SUCCESS_BODY);
  assert.doesNotMatch(text, /Previous Guest|prev@example\.org|"id"/);
  const last = (await stored('open'))
    .filter((r) => r.name === 'Mara Quinn')
    .at(-1)!;
  assert.deepEqual(
    { name: last.name, email: last.email, attending: last.attending, guests: last.guests, message: last.message },
    { name: 'Mara Quinn', email: 'mara@example.org', attending: true, guests: 3, message: 'See you there!' },
  );
});

test('missing name: 400 with a field message, nothing stored', async () => {
  const before = (await stored('open')).length;
  const res = await post('open-site', { name: '   ', attending: 'yes', guests: 1 });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.state, 'error');
  assert.equal(body.code, 'invalid');
  assert.equal(body.message, 'Please enter your name.');
  assert.deepEqual(body.fields, { name: 'Please enter your name.' });
  assert.equal((await stored('open')).length, before);
});

test('guest cap comes from the theme: fixture allows 6, _sample uses the default 10', async () => {
  const tooMany = await post('open-site', { name: 'Big Family', attending: 'yes', guests: 7 });
  assert.equal(tooMany.status, 400);
  assert.equal((await tooMany.json()).fields.guests, 'Please enter a number of guests from 1 to 6.');
  assert.equal((await post('sample-site', { name: 'Big Family', attending: 'yes', guests: 7 })).status, 200);
  assert.equal((await (await status('open-site')).json()).maxGuests, 6);
  assert.equal((await (await status('sample-site')).json()).maxGuests, 10);
});

test('spam: a filled honeypot gets the normal success answer but is not stored', async () => {
  const before = (await stored('open')).length;
  const res = await post('open-site', { name: 'Buy Now', attending: 'yes', guests: 1, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), SUCCESS_BODY);
  // Even an otherwise invalid body: bots learn nothing from the answer.
  assert.deepEqual(await (await post('open-site', { website: 'x' })).json(), SUCCESS_BODY);
  assert.equal((await stored('open')).length, before);
});

test('rate limit per IP and site: post 31 to one site in 15 minutes is 429; the same address can still reply to another wedding', async () => {
  const ip = '203.0.113.50';
  for (let i = 0; i < DEFAULT_RSVP_LIMITS.perSiteIp.limit; i++) {
    const res = await post('open-site', { name: `Guest ${i}`, attending: 'no' }, { ip });
    assert.equal(res.status, 200, `post ${i}`);
  }
  const blocked = await post('open-site', { name: 'One more', attending: 'no' }, { ip });
  assert.equal(blocked.status, 429);
  const retry = Number(blocked.headers.get('retry-after'));
  assert.ok(retry > 0 && retry <= DEFAULT_RSVP_LIMITS.perSiteIp.windowMs / 1000, `Retry-After ${retry}`);
  const body = await blocked.json();
  assert.equal(body.code, 'rate_limited');
  assert.match(body.message, /Too many replies/);
  // Rejected and spam posts count too (every POST from the address to this site).
  assert.equal((await post('open-site', { website: 'x' }, { ip })).status, 429);
  assert.equal((await post('open-site', { name: 'Neighbour', attending: 'no' }, { ip: '203.0.113.51' })).status, 200);
  // Venue / office Wi-Fi: one busy wedding does not lock that address out of every other wedding.
  assert.equal((await post('other-site', { name: 'Same Wi-Fi', attending: 'no' }, { ip })).status, 200);
});

test('rate limit per IP across all sites is only an abuse ceiling', async () => {
  const limiter = new MemoryRateLimiter();
  const limits = { ...DEFAULT_RSVP_LIMITS, perIp: { limit: 3, windowMs: 60_000 } };
  const ctx = { adapter: getDataAdapter(), limiter, limits, ip: '192.0.2.77' };
  for (const slug of ['open-site', 'other-site', 'sample-site']) {
    assert.equal((await submitRsvp(ctx, slug, { name: `Cross ${slug}`, attending: 'no' })).status, 200, slug);
  }
  const res = await submitRsvp(ctx, 'other-site', { name: 'Fourth', attending: 'no' });
  assert.equal(res.status, 429);
  assert.equal(res.body.code, 'rate_limited');
});

test('unusual volume never locks real guests out: extra replies are held (not counted) and the couple keeps or removes them', async () => {
  const site = await makeSite('busy-site', 'rsvp-fixture', content(300, 400));
  const limiter = new MemoryRateLimiter();
  const limits = {
    ...DEFAULT_RSVP_LIMITS,
    perSite: { limit: 2, windowMs: 60_000 },
    perSiteIpStored: { limit: 2, windowMs: 60_000 },
    heldPerSite: { limit: 3, windowMs: 60_000 },
  };
  const ctx = { adapter: getDataAdapter(), limiter, limits };
  const send = (ip: string, name: string) => submitRsvp({ ...ctx, ip }, 'busy-site', { name, attending: 'yes', guests: 2 });
  assert.equal((await send('192.0.2.1', 'Real A')).status, 200);
  assert.equal((await send('192.0.2.2', 'Real B')).status, 200);
  // Spam and invalid posts do not use up the site budget.
  assert.equal((await submitRsvp({ ...ctx, ip: '192.0.2.3' }, 'busy-site', { name: 'S', attending: 'no', website: 'x' })).status, 200);
  assert.equal((await submitRsvp({ ...ctx, ip: '192.0.2.3' }, 'busy-site', { attending: 'no' })).status, 400);
  // Over the site budget: the guest still gets the normal success answer; the reply is held.
  const third = await send('192.0.2.4', 'Real C');
  assert.equal(third.status, 200);
  assert.deepEqual(third.body, SUCCESS_BODY, 'the answer never says a reply was held');
  assert.equal((await send('192.0.2.5', 'Junk 1')).status, 200);
  assert.equal((await send('192.0.2.6', 'Junk 2')).status, 200);
  // Only when the held store is full is a reply refused.
  const busy = await send('192.0.2.7', 'Junk 3');
  assert.equal(busy.status, 429);
  assert.equal(busy.body.code, 'busy');
  assert.ok(busy.headers?.['Retry-After']);
  const all = await getDataAdapter().listRsvps(site.id);
  assert.deepEqual(all.map((r) => [r.name, Boolean(r.held)]), [['Real A', false], ['Real B', false], ['Real C', true], ['Junk 1', true], ['Junk 2', true]]);

  // The couple: held replies are listed apart, not counted, not in the CSV.
  const summary = await (await responses('busy-site', { bearer: site.editKey })).json();
  assert.deepEqual(summary.counts, { responses: 2, attending: 2, notAttending: 0, totalGuests: 4, held: 3 });
  assert.deepEqual(summary.responses.filter((r: { held: boolean }) => r.held).map((r: { name: string }) => r.name).sort(), ['Junk 1', 'Junk 2', 'Real C']);
  assert.doesNotMatch(await (await csv('busy-site', { bearer: site.editKey })).text(), /Real C|Junk/);
  const id = (name: string) => all.find((r) => r.name === name)!.id;

  // Keep the real one, remove the junk (and a stray kept reply); a wrong key or a link (?k=) cannot act.
  const act = (body: unknown, opts: { bearer?: string; query?: string } = {}) =>
    responsesPost(
      new Request(`${BASE}/api/rsvp/busy-site/responses${opts.query ?? ''}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(opts.bearer ? { authorization: `Bearer ${opts.bearer}` } : {}) },
        body: JSON.stringify(body),
      }),
      { params: Promise.resolve({ slug: 'busy-site' }) },
    );
  assert.equal((await act({ action: 'remove', ids: [id('Junk 1')] }, { query: `?k=${site.editKey}` })).status, 401);
  assert.equal((await act({ action: 'remove', ids: [id('Junk 1')] }, { bearer: sites.other.editKey })).status, 401);
  assert.equal((await act({ action: 'explode', ids: [id('Junk 1')] }, { bearer: site.editKey })).status, 400);
  assert.equal((await act({ action: 'remove', ids: [] }, { bearer: site.editKey })).status, 400);
  const kept = await (await act({ action: 'keep', ids: [id('Real C')] }, { bearer: site.editKey })).json();
  assert.equal(kept.changed, 1);
  assert.deepEqual(kept.counts, { responses: 3, attending: 3, notAttending: 0, totalGuests: 6, held: 2 });
  const removed = await (await act({ action: 'remove', ids: [id('Junk 1'), id('Junk 2'), id('Real B')] }, { bearer: site.editKey })).json();
  assert.equal(removed.changed, 3);
  assert.deepEqual(removed.counts, { responses: 2, attending: 2, notAttending: 0, totalGuests: 4, held: 0 });
  assert.deepEqual((await getDataAdapter().listRsvps(site.id)).map((r) => r.name), ['Real A', 'Real C']);
  assert.match(await (await csv('busy-site', { bearer: site.editKey })).text(), /Real C/);
  // Another site's replies cannot be touched with this site's key.
  const otherReply = (await stored('other'))[0];
  if (otherReply) {
    assert.equal((await (await act({ action: 'remove', ids: [otherReply.id] }, { bearer: site.editKey })).json()).changed, 0);
    assert.ok((await stored('other')).some((r) => r.id === otherReply.id));
  }
});

test('one address cannot fill a site: after its own budget its replies are held, other guests stay normal', async () => {
  const site = await makeSite('one-ip-site', 'rsvp-fixture', content(300, 400));
  const limiter = new MemoryRateLimiter();
  const limits = { ...DEFAULT_RSVP_LIMITS, perSiteIpStored: { limit: 2, windowMs: 60_000 } };
  const ctx = { adapter: getDataAdapter(), limiter, limits };
  for (const n of ['A', 'B', 'C', 'D']) {
    assert.equal((await submitRsvp({ ...ctx, ip: '192.0.2.200' }, 'one-ip-site', { name: `Flood ${n}`, attending: 'yes', guests: 5 })).status, 200);
  }
  assert.equal((await submitRsvp({ ...ctx, ip: '192.0.2.201' }, 'one-ip-site', { name: 'Real Guest', attending: 'yes', guests: 1 })).status, 200);
  const list = await getDataAdapter().listRsvps(site.id);
  assert.deepEqual(list.map((r) => [r.name, Boolean(r.held)]), [['Flood A', false], ['Flood B', false], ['Flood C', true], ['Flood D', true], ['Real Guest', false]]);
});

test('after the deadline: POST is 403 closed with the date, GET status says closed', async () => {
  const before = (await stored('closed')).length;
  const res = await post('closed-site', { name: 'Late Guest', attending: 'yes', guests: 1 });
  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.state, 'closed');
  assert.equal(body.reason, 'deadline');
  assert.match(body.message, /^Replies closed on [A-Z][a-z]+ \d{1,2}, \d{4}\. If you still need to reply, please contact the couple directly\.$/);
  assert.equal((await stored('closed')).length, before);

  const st = await (await status('closed-site')).json();
  assert.equal(st.open, false);
  assert.equal(st.reason, 'deadline');
  assert.equal(st.message, body.message);
  assert.equal((await (await status('open-site')).json()).open, true);
});

test('deadline boundary: open until the end of the day in the site time zone', async () => {
  // Demo content: deadline April 3, 2027 in America/New_York -> closes 2027-04-04T04:00Z.
  const c = demoContent();
  const s = await makeSite('boundary-site', 'rsvp-fixture', c);
  const ctx = { adapter: getDataAdapter(), limiter: new MemoryRateLimiter(), ip: '192.0.2.10' };
  const lastMinute = await submitRsvp({ ...ctx, now: new Date('2027-04-04T03:59:59.999Z') }, 'boundary-site', { name: 'Just In Time', attending: 'no' });
  assert.equal(lastMinute.status, 200);
  const late = await submitRsvp({ ...ctx, now: new Date('2027-04-04T04:00:00.000Z') }, 'boundary-site', { name: 'Too Late', attending: 'no' });
  assert.equal(late.status, 403);
  assert.equal(late.body.message, 'Replies closed on April 3, 2027. If you still need to reply, please contact the couple directly.');
  assert.deepEqual((await getDataAdapter().listRsvps(s.id)).map((r) => r.name), ['Just In Time']);
});

test('rsvp.method "none": the form is closed (disabled)', async () => {
  const res = await post('off-site', { name: 'Someone', attending: 'yes' });
  assert.equal(res.status, 403);
  assert.equal((await res.json()).reason, 'disabled');
  assert.equal((await (await status('off-site')).json()).reason, 'disabled');
});

test('unpublished, draft, unknown and reserved slugs: 404, nothing stored', async () => {
  for (const slug of ['draft-site', 'unpub-site', 'nobody-here', 'api', 'edit', 'Bad Slug']) {
    const res = await post(slug, { name: 'Ghost', attending: 'yes' });
    assert.equal(res.status, 404, slug);
    assert.deepEqual(await res.json(), { ok: false, state: 'error', code: 'not_found', message: 'This RSVP form is not available.' });
    assert.equal((await status(slug)).status, 404, `status ${slug}`);
  }
  assert.equal((await stored('draft')).length, 0);
  assert.equal((await stored('unpub')).length, 0);
});

test('preview: status of a draft with its preview key; replies are still refused', async () => {
  const st = await status('draft-site', `?preview=${sites.draft.previewKey}`);
  assert.equal(st.status, 200);
  const body = await st.json();
  assert.equal(body.preview, true);
  assert.equal(body.open, true);
  assert.equal((await status('draft-site', '?preview=wrong-key-1234567890')).status, 404);
  assert.equal((await status('draft-site', `?preview=${sites.draft.editKey}`)).status, 404);
  assert.equal((await post('draft-site', { name: 'Tester', attending: 'yes' })).status, 404);
});

test('request format: JSON only, size-capped, malformed JSON rejected', async () => {
  const form = await post('open-site', null, { type: 'application/x-www-form-urlencoded', raw: 'name=A&attending=yes' });
  assert.equal(form.status, 415);
  assert.equal((await form.json()).code, 'unsupported');
  assert.equal((await post('open-site', null, { raw: '{"name": "A",' })).status, 400);
  const big = await post('open-site', { name: 'A', attending: 'yes', message: 'x'.repeat(9000) });
  assert.equal(big.status, 413);
  assert.equal((await big.json()).code, 'too_large');
});

test('double submit: an identical reply within minutes is stored once', async () => {
  const reply = { name: 'Twice Clicked', email: 'twice@example.org', attending: 'yes', guests: 2, message: 'Hi' };
  assert.equal((await post('open-site', reply)).status, 200);
  assert.equal((await post('open-site', reply)).status, 200);
  assert.equal((await post('open-site', { ...reply, guests: 3 })).status, 200); // changed answer = new reply
  assert.equal((await stored('open')).filter((r) => r.name === 'Twice Clicked').length, 2);
});

test('couple API: edit key required (header or ?k=); wrong, preview and other-site keys get 401', async () => {
  for (const res of [
    await responses('open-site'),
    await responses('open-site', { bearer: 'wrong-key-1234567890' }),
    await responses('open-site', { bearer: sites.open.previewKey }),
    await responses('open-site', { bearer: sites.other.editKey }),
    await responses('nobody-here', { bearer: sites.open.editKey }),
    await csv('open-site'),
    await csv('open-site', { query: `?k=${sites.open.previewKey}` }),
    await csv('open-site', { bearer: sites.other.editKey }),
  ]) {
    assert.equal(res.status, 401);
    assert.equal(res.headers.get('www-authenticate'), 'Bearer');
    const text = await res.text();
    assert.deepEqual(JSON.parse(text), { ok: false, code: 'unauthorized', message: 'This edit link is not valid.' });
    assert.doesNotMatch(text, /Mara|example\.org/);
  }
  assert.equal((await responses('open-site', { query: `?k=${sites.open.editKey}` })).status, 200);
  assert.equal((await csv('open-site', { query: `?k=${sites.open.editKey}` })).status, 200);
});

test('couple API: list (newest first) and counts for one site only', async () => {
  const fresh = await makeSite('count-site', 'rsvp-fixture', content(300, 400));
  await post('count-site', { name: 'Yes Two', attending: 'yes', guests: 2 });
  await post('count-site', { name: 'No One', attending: 'no', guests: 5 });
  await post('count-site', { name: 'Yes Four', attending: 'yes', guests: 4, email: 'four@example.org', message: 'Hello' });
  const res = await responses('count-site', { bearer: fresh.editKey });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.deepEqual(body.site, { slug: 'count-site', status: 'published' });
  assert.deepEqual(body.counts, { responses: 3, attending: 2, notAttending: 1, totalGuests: 6, held: 0 });
  assert.equal(body.window.open, true);
  assert.deepEqual(
    body.responses.map((r: { name: string; guests: number }) => [r.name, r.guests]),
    [['Yes Four', 4], ['No One', 0], ['Yes Two', 2]],
  );
  assert.deepEqual(Object.keys(body.responses[0]).sort(), ['attending', 'createdAt', 'email', 'guests', 'held', 'id', 'message', 'name']);
});

test('CSV export: attachment, BOM, formula cells escaped, only this site', async () => {
  const fresh = await makeSite('csv-site', 'rsvp-fixture', content(300, 400));
  await post('csv-site', { name: '=HYPERLINK("http://evil.example","x")', attending: 'yes', guests: 1, message: '@SUM(1+1)' });
  await post('csv-site', { name: '+Plus', email: 'plus@example.org', attending: 'no', message: '-minus "quoted"' });
  const res = await csv('csv-site', { bearer: fresh.editKey });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/csv; charset=utf-8');
  assert.match(res.headers.get('content-disposition')!, /^attachment; filename="rsvps-csv-site-\d{4}-\d{2}-\d{2}\.csv"$/);
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf]); // UTF-8 BOM
  const lines = new TextDecoder().decode(bytes).split('\r\n'); // decoder drops the BOM
  assert.equal(lines[0], '"Submitted (America/New_York)","Name","Email","Attending","Guests","Message"');
  assert.match(lines[1], /^"[A-Z][a-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M","'=HYPERLINK\(""http:\/\/evil\.example"",""x""\)","","Yes","1","'@SUM\(1\+1\)"$/);
  assert.match(lines[2], /,"'\+Plus","plus@example\.org","No","0","'-minus ""quoted"""$/);
  assert.equal(lines.length, 4); // header + 2 rows + trailing empty
});

test('fixture theme: the RSVP page keeps the form contract and allows /rsvp/form.js by CSP', async () => {
  const res = await getPage(new Request(`${BASE}/open-site/rsvp`), { params: Promise.resolve({ slug: 'open-site', page: 'rsvp' }) });
  assert.equal(res.status, 200);
  const csp = res.headers.get('content-security-policy')!;
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /connect-src 'self'/);
  const $ = cheerio.load(await res.text());
  assert.equal($('script[src="/rsvp/form.js"]').length, 1);
  const form = $('form[data-rsvp-form]');
  assert.equal(form.length, 1);
  assert.equal(form.attr('method'), 'post');
  for (const name of ['name', 'email', 'attending', 'guests', 'message']) assert.ok(form.find(`[name="${name}"]`).length, name);
  assert.deepEqual(
    $('[data-rsvp-state]').map((_, el) => $(el).attr('data-rsvp-state')).get(),
    ['success', 'closed', 'error', 'preview'],
  );
  assert.ok($('[data-rsvp-state]').toArray().every((el) => $(el).attr('hidden') !== undefined));
  const data = JSON.parse($('#site-data').text());
  assert.equal(data.slug, 'open-site');
  assert.equal(data.preview, false);
});
