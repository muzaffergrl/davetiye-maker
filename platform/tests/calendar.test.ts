// "Add to calendar" (G051): event times (time zones, daylight saving), the .ics file (RFC 5545),
// the Google Calendar link, the engine's data-calendar marker and the /<slug>/event.ics route.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { calendarEvent, foldLine, googleCalendarUrl, icsFile, icsText, END_AFTER_LAST_MS } from '../lib/calendar.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

before(() => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-calendar-data-');
});

const utc = (e: ReturnType<typeof calendarEvent>) => {
  assert.ok(e && e.time.kind === 'utc', 'utc times');
  return { start: e.time.start.toISOString(), end: e.time.end.toISOString() };
};

/** Unfolds an .ics file and returns its content lines (RFC 5545 §3.1). */
function icsLines(ics: string): string[] {
  return ics.replace(/\r\n[ \t]/g, '').split('\r\n').filter(Boolean);
}
function icsProp(ics: string, name: string): string | undefined {
  const line = icsLines(ics).find((l) => l.startsWith(`${name}:`) || l.startsWith(`${name};`));
  return line?.slice(line.indexOf(':') + 1);
}
const unescapeText = (v: string) => v.replace(/\\n/g, '\n').replace(/\\([,;\\])/g, '$1');

// ---------------------------------------------------------------- event times

test('the demo event: ceremony start, ends two hours after the last schedule item, UTC from the site zone (EDT)', () => {
  const e = calendarEvent(demoContent(), { siteUrl: 'https://sites.example.test/clara-and-julian' })!;
  assert.equal(e.title, 'Clara & Julian’s Wedding');
  // 16:00 EDT (UTC-4) → 20:00Z; last item 18:30 + 2 h = 20:30 EDT → 00:30Z the next day
  assert.deepEqual(utc(e), { start: '2027-05-15T20:00:00.000Z', end: '2027-05-16T00:30:00.000Z' });
  assert.equal(e.timeZone, 'America/New_York');
  assert.equal(e.location, 'The Rosewater Conservatory, Savannah, Georgia, USA');
  assert.equal(
    e.description,
    [
      'Order of the day (America/New York time):',
      '4:00 PM  Ceremony · The Rose Garden',
      '5:00 PM  Cocktail Hour · The Glass Terrace',
      '6:30 PM  Reception · The Conservatory Hall',
      '',
      'Dress code: Garden formal',
      '',
      'Website: https://sites.example.test/clara-and-julian',
    ].join('\n'),
  );
  assert.equal(END_AFTER_LAST_MS, 7_200_000);
});

test('time zones and daylight saving: winter/summer offsets, southern hemisphere, a gap, an evening across midnight', () => {
  const at = (date: string, time: string, timezone: string, schedule: ContentRecord['schedule'] = []) => {
    const c = demoContent();
    Object.assign(c, { date, ceremony_time: time, timezone, schedule });
    return utc(calendarEvent(c));
  };
  assert.equal(at('2027-01-09', '16:30', 'America/New_York').start, '2027-01-09T21:30:00.000Z', 'EST (UTC-5)');
  assert.equal(at('2027-07-01', '18:00', 'Europe/London').start, '2027-07-01T17:00:00.000Z', 'BST (UTC+1)');
  assert.equal(at('2027-12-04', '18:00', 'Europe/London').start, '2027-12-04T18:00:00.000Z', 'GMT');
  assert.equal(at('2027-07-01', '18:00', 'Australia/Sydney').start, '2027-07-01T08:00:00.000Z', 'AEST (UTC+10)');
  assert.equal(at('2027-12-04', '17:00', 'Australia/Sydney').start, '2027-12-04T06:00:00.000Z', 'AEDT (UTC+11)');
  assert.equal(at('2027-06-12', '17:00', 'Asia/Kolkata').start, '2027-06-12T11:30:00.000Z', 'half-hour zone');
  // 02:30 does not exist on 2027-03-14 in New York (clocks jump 02:00 → 03:00): Temporal "compatible" → 03:30 EDT
  assert.equal(at('2027-03-14', '02:30', 'America/New_York').start, '2027-03-14T07:30:00.000Z');
  // UK clocks go back at 02:00 BST on 2027-10-31: a party from 22:00 (BST) whose last item is 23:30 (BST)
  // ends at 01:30 BST = 00:30Z, two real hours after 23:30 BST (22:30Z)
  assert.deepEqual(
    at('2027-10-30', '22:00', 'Europe/London', [
      { label: 'Ceremony', time: '22:00', location: null },
      { label: 'Fireworks', time: '23:30', location: null },
    ]),
    { start: '2027-10-30T21:00:00.000Z', end: '2027-10-31T00:30:00.000Z' },
  );
  // a schedule item before the ceremony (or after midnight) does not move the end before the start
  const early = at('2027-05-15', '16:00', 'America/New_York', [
    { label: 'Welcome drinks', time: '15:00', location: null },
    { label: 'Ceremony', time: '16:00', location: null },
  ]);
  assert.deepEqual(early, { start: '2027-05-15T20:00:00.000Z', end: '2027-05-15T22:00:00.000Z' }, 'at least two hours after the start');
});

test('without a ceremony time: earliest schedule time; without any time: an all-day event (end = next day)', () => {
  const c = demoContent();
  delete c.ceremony_time;
  assert.equal(utc(calendarEvent(c)).start, '2027-05-15T20:00:00.000Z', 'schedule 16:00 is the earliest');
  c.schedule = [];
  assert.deepEqual(calendarEvent(c)!.time, { kind: 'date', start: '20270515', end: '20270516' });
  c.date = '2027-12-31';
  assert.deepEqual(calendarEvent(c)!.time, { kind: 'date', start: '20271231', end: '20280101' }, 'year boundary');
});

test('unknown time zone: floating local times (no Z); unreadable date: no event', () => {
  const c = demoContent();
  c.timezone = 'Mars/Olympus';
  const e = calendarEvent(c)!;
  assert.deepEqual(e.time, { kind: 'floating', start: '20270515T160000', end: '20270515T203000' });
  assert.equal(e.timeZone, null);
  assert.match(e.description, /^Order of the day:/);
  const late = demoContent();
  late.timezone = 'Mars/Olympus';
  late.schedule = [{ label: 'Dancing', time: '23:30', location: null }];
  late.ceremony_time = '23:00';
  assert.deepEqual(calendarEvent(late)!.time, { kind: 'floating', start: '20270515T230000', end: '20270516T013000' }, 'rolls past midnight');
  const none = demoContent();
  none.date = '2027-02-30';
  assert.equal(calendarEvent(none), null);
});

test('title per event type and name; only what guests can see goes into the description', () => {
  const c = demoContent();
  c.name_display = 'Charles & James';
  c.partners = [{ display_name: 'Charles' }, { display_name: 'James' }];
  assert.equal(calendarEvent(c)!.title, 'Charles & James’ Wedding');
  c.event_type = 'engagement';
  assert.equal(calendarEvent(c)!.title, 'Charles & James’ Engagement Party');
  c.event_type = 'other';
  assert.equal(calendarEvent(c)!.title, 'Charles & James');
  const hidden = demoContent();
  hidden.optional_blocks.dress_code = false;
  hidden.dress_code = 'PRIVATE-DRESS';
  hidden.faq = [{ q: 'PRIVATE-Q', a: 'PRIVATE-A' }];
  const d = calendarEvent(hidden)!.description;
  assert.doesNotMatch(d, /PRIVATE|Dress code/);
  assert.doesNotMatch(d, /Website:/, 'no site address without one');
});

// ---------------------------------------------------------------- .ics and Google link

test('iCalendar text escaping and line folding at 75 octets without splitting a character', () => {
  assert.equal(icsText('A, B; C\\D\nE\r\nF'), 'A\\, B\\; C\\\\D\\nE\\nF');
  const long = 'DESCRIPTION:' + 'Ünïcødé café — '.repeat(12);
  const folded = foldLine(long);
  for (const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75, `${Buffer.byteLength(line)} octets`);
  assert.equal(folded.replace(/\r\n /g, ''), long, 'unfolds to the same line');
  assert.equal(foldLine('SHORT:x'), 'SHORT:x');
});

test('control characters never reach the .ics: soft line breaks become newlines, the rest is dropped, tab stays', () => {
  assert.equal(icsText('12 Rose Street\u000bSavannah'), '12 Rose Street\\nSavannah');
  assert.equal(icsText('a\u000cb\u2028c\u2029d'), 'a\\nb\\nc\\nd');
  assert.equal(icsText('Ceremony\u0007\u0000\u001b\u007f'), 'Ceremony');
  assert.equal(icsText('a\tb'), 'a\tb');

  const c = demoContent();
  c.venue.address = '12 Rose Street\u000bSavannah';
  c.schedule[0].label = 'Ceremony\u0007';
  c.dress_code = 'Garden\u0001 formal';
  c.optional_blocks.dress_code = true;
  const ics = icsFile(calendarEvent(c, { siteUrl: 'https://sites.example.test/x' })!, { uid: 'x@y' });
  const controls = [...ics.replace(/\r\n/g, '')].filter((ch) => /[\u0000-\u0008\u000A-\u001F\u007F]/.test(ch));
  assert.deepEqual(controls, [], 'no control characters other than tab (CRLF line ends aside)');
  assert.match(icsProp(ics, 'LOCATION')!, /12 Rose Street\\nSavannah/);
  assert.match(unescapeText(icsProp(ics, 'DESCRIPTION')!), /Ceremony/);
});

test('.ics file: VCALENDAR/VEVENT with UTC times, stable UID, escaped text, CRLF and folded lines', () => {
  const c = demoContent();
  c.venue.name = 'The Rosewater Conservatory; East Wing';
  const e = calendarEvent(c, { siteUrl: 'https://sites.example.test/clara-and-julian' })!;
  const ics = icsFile(e, { uid: 'clara-and-julian@sites.example.test', stamp: new Date('2026-10-13T09:30:00Z') });
  assert.ok(ics.endsWith('\r\n'));
  assert.doesNotMatch(ics.replace(/\r\n/g, ''), /[\r\n]/, 'only CRLF line ends');
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75, line);
  const lines = icsLines(ics);
  assert.deepEqual(lines.slice(0, 6), ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding website//Add to calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT']);
  assert.deepEqual(lines.slice(-2), ['END:VEVENT', 'END:VCALENDAR']);
  assert.equal(icsProp(ics, 'UID'), 'clara-and-julian@sites.example.test');
  assert.equal(icsProp(ics, 'DTSTAMP'), '20261013T093000Z');
  assert.equal(icsProp(ics, 'DTSTART'), '20270515T200000Z');
  assert.equal(icsProp(ics, 'DTEND'), '20270516T003000Z');
  assert.equal(unescapeText(icsProp(ics, 'SUMMARY')!), 'Clara & Julian’s Wedding');
  assert.equal(icsProp(ics, 'LOCATION'), 'The Rosewater Conservatory\\; East Wing\\, Savannah\\, Georgia\\, USA');
  assert.equal(unescapeText(icsProp(ics, 'DESCRIPTION')!), e.description);
  assert.equal(icsProp(ics, 'URL'), 'https://sites.example.test/clara-and-julian');

  const allDay = demoContent();
  delete allDay.ceremony_time;
  allDay.schedule = [];
  const day = icsFile(calendarEvent(allDay)!, { uid: 'x@y' });
  assert.ok(icsLines(day).includes('DTSTART;VALUE=DATE:20270515'));
  assert.ok(icsLines(day).includes('DTEND;VALUE=DATE:20270516'));
});

test('Google Calendar link: template URL with UTC dates, the event zone, details and location', () => {
  const e = calendarEvent(demoContent(), { siteUrl: 'https://sites.example.test/clara-and-julian' })!;
  const url = new URL(googleCalendarUrl(e));
  assert.equal(url.origin + url.pathname, 'https://calendar.google.com/calendar/render');
  assert.equal(url.searchParams.get('action'), 'TEMPLATE');
  assert.equal(url.searchParams.get('text'), 'Clara & Julian’s Wedding');
  assert.equal(url.searchParams.get('dates'), '20270515T200000Z/20270516T003000Z');
  assert.equal(url.searchParams.get('ctz'), 'America/New_York');
  assert.equal(url.searchParams.get('location'), e.location);
  assert.equal(url.searchParams.get('details'), e.description);
  const allDay = demoContent();
  delete allDay.ceremony_time;
  allDay.schedule = [];
  const day = new URL(googleCalendarUrl(calendarEvent(allDay)!));
  assert.equal(day.searchParams.get('dates'), '20270515/20270516');
  assert.equal(day.searchParams.get('ctz'), null);
});

// ---------------------------------------------------------------- engine marker

const THEME = { id: 't', pages: { index: 'index.html', home: 'home.html' }, photos: {} } as const;
const TEMPLATE = `<!doctype html><html><head><title>x</title></head><body>
<a data-calendar="ics" href="#">Apple / Outlook</a>
<a data-calendar="google" href="#" target="_blank">Google</a>
</body></html>`;

test('engine: data-calendar writes the .ics route and the Google link; preview keeps its key', () => {
  const r = renderTemplate({ html: TEMPLATE, content: demoContent(), theme: THEME, page: 'home', slug: 'clara-and-julian', origin: 'https://sites.example.test' });
  assert.deepEqual(r.warnings, []);
  const $ = cheerio.load(r.html);
  assert.equal($('a[data-calendar="ics"]').attr('href'), '/clara-and-julian/event.ics');
  const google = new URL($('a[data-calendar="google"]').attr('href')!);
  assert.equal(google.hostname, 'calendar.google.com');
  assert.match(google.searchParams.get('details')!, /Website: https:\/\/sites\.example\.test\/clara-and-julian$/);
  assert.equal($('a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
  const preview = cheerio.load(renderTemplate({ html: TEMPLATE, content: demoContent(), theme: THEME, page: 'home', slug: 'clara-and-julian', previewKey: 'pk_1234567890abcdef' }).html);
  assert.equal(preview('a[data-calendar="ics"]').attr('href'), '/clara-and-julian/event.ics?preview=pk_1234567890abcdef');
});

test('engine: no readable date → both links removed; unknown kind or a non-link → removed with a warning', () => {
  const c = demoContent();
  c.date = '';
  const none = renderTemplate({ html: TEMPLATE, content: c, theme: THEME, page: 'home', slug: 's-1' });
  assert.equal(cheerio.load(none.html)('a[data-calendar]').length, 0);
  assert.deepEqual(none.warnings, []);
  const odd = renderTemplate({
    html: '<html><body><a data-calendar="outlook" href="#">x</a><span data-calendar="ics">y</span></body></html>',
    content: demoContent(),
    theme: THEME,
    page: 'home',
    slug: 's-1',
  });
  assert.equal(cheerio.load(odd.html)('[data-calendar]').length, 0);
  assert.equal(odd.warnings.length, 2);
  // not settable through data-attr-* (engine marker)
  const attr = renderTemplate({ html: '<html><body><a data-attr-data-calendar="name_display">x</a></body></html>', content: demoContent(), theme: THEME, page: 'home', slug: 's-1' });
  assert.ok(attr.warnings.some((w) => w.includes('data-attr-data-calendar')));
});

// ---------------------------------------------------------------- routes

test('route /<slug>/event.ics: published → 200 text/calendar; draft, offline, unknown, reserved → 404; preview key → draft', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET } = await import('../app/[slug]/event.ics/route.ts');
  const adapter = getDataAdapter();
  const get = (slug: string, query = '') => GET(new Request(`https://sites.example.test/${slug}/event.ics${query}`), { params: Promise.resolve({ slug }) });

  const created = await createSiteWithKeys(adapter, { slug: 'ics-couple', theme: 'blush-garden-rose', content: demoContent() });
  assert.equal((await get('ics-couple')).status, 404, 'draft (never published) → 404');
  const draftPreview = await get('ics-couple', `?preview=${created.previewKey}`);
  assert.equal(draftPreview.status, 200, 'the couple can preview it');
  assert.equal(draftPreview.headers.get('cache-control'), 'private, no-store');
  assert.equal(draftPreview.headers.get('referrer-policy'), 'no-referrer');
  assert.equal((await get('ics-couple', '?preview=wrong-key-1234567890')).status, 404);

  await publishSite(adapter, created.site.id);
  const res = await get('ics-couple');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/calendar; charset=utf-8');
  assert.equal(res.headers.get('content-disposition'), 'attachment; filename="ics-couple.ics"');
  assert.equal(res.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  const ics = await res.text();
  assert.equal(icsProp(ics, 'UID'), 'ics-couple@sites.example.test');
  assert.equal(icsProp(ics, 'DTSTART'), '20270515T200000Z');
  assert.equal(icsProp(ics, 'URL'), 'https://sites.example.test/ics-couple');
  const site = (await adapter.getSiteById(created.site.id))!;
  assert.equal(icsProp(ics, 'DTSTAMP'), new Date(site.publishedAt!).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'), 'stamp = publish time');

  // an unpublished edit is not in the public file (guests see the published version)
  const edited = demoContent();
  edited.date = '2027-06-19';
  await adapter.updateContent(created.site.id, edited);
  assert.equal(icsProp(await (await get('ics-couple')).text(), 'DTSTART'), '20270515T200000Z');
  assert.equal(icsProp(await (await get('ics-couple', `?preview=${created.previewKey}`)).text(), 'DTSTART'), '20270619T200000Z');

  const upper = await get('ICS-Couple');
  assert.equal(upper.status, 308);
  assert.equal(new URL(upper.headers.get('location')!).pathname, '/ics-couple/event.ics');
  await adapter.unpublish(created.site.id);
  assert.equal((await get('ics-couple')).status, 404, 'taken offline → 404');
  assert.equal((await get('no-such-site')).status, 404);
  assert.equal((await get('edit')).status, 404, 'reserved slug');
});

test('route /start/demo/<theme>/event.ics: the demo event; internal or unknown theme → 404', async () => {
  const { GET } = await import('../app/start/demo/[theme]/event.ics/route.ts');
  const get = (theme: string) => GET(new Request(`https://sites.example.test/start/demo/${theme}/event.ics`), { params: Promise.resolve({ theme }) });
  const res = await get('blush-garden-rose');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/calendar; charset=utf-8');
  const ics = await res.text();
  assert.equal(icsProp(ics, 'UID'), 'demo-blush-garden-rose@sites.example.test');
  assert.equal(unescapeText(icsProp(ics, 'SUMMARY')!), 'Clara & Julian’s Wedding');
  assert.equal(icsProp(ics, 'URL'), 'https://sites.example.test/start/demo/blush-garden-rose');
  assert.equal((await get('_sample')).status, 404, 'internal theme');
  assert.equal((await get('no-such-theme')).status, 404);
});
