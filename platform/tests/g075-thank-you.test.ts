// G075 (K28): post-wedding thank-you mode — the rule (end of the wedding day in the site's time zone, DST included),
// Automatic / On now / Off, the engine's multi-condition data-if, the themes with a thank-you version (01 olive-ivory,
// 03 blush-garden-rose; G081: 02 dusty-blue-champagne, 05 mediterranean-lemon, 04 vintage-airmail-love-letter) in thank-you mode, the RSVP API's 403 closed (reason thank_you), the thank-you photo route, the panel API (schema,
// limits, the thank-you photo place), panel helpers (sections, Review, readiness) and the theme-check rule for themes
// without a thank-you version. The browser journey and previews: tests/g075-browser.ts.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as pageRoute } from '../app/[slug]/[page]/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import { GET as rsvpStatusRoute, POST as rsvpPostRoute } from '../app/api/rsvp/[slug]/route.ts';
import { GET as demoRoute } from '../app/start/demo/[theme]/route.ts';
import { buildView } from '../lib/content/derive.ts';
import { CONTENT_LIMITS } from '../lib/content/limits.ts';
import {
  dayEndsAt,
  isThankYouOn,
  THANK_YOU_DEFAULT_TITLE,
  thankYouDay,
  thankYouMode,
  thankYouStartsAt,
  thankYouState,
  thankYouTitle,
  withThankYou,
} from '../lib/content/thank-you.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { pageShown, photoAt, sectionForPath, withPhoto } from '../lib/panel/model.ts';
import { panelTheme, themeFieldUse } from '../lib/panel/state.ts';
import { closedMessage, rsvpWindow } from '../lib/rsvp/deadline.ts';
import { deadlineInsight, deadlineText } from '../lib/rsvp/insights.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { guestCookieName, guestCookieValue, setAccessRateLimiter, setGuestAccess } from '../lib/site/access.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { loadTheme, readThemePage, type PageName } from '../lib/theme/theme.ts';
import { changedPages, changedSections, PAGE_SECTIONS, parseEditTarget, readiness } from '../components/panel/pages.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const THEMES = ['olive-ivory', 'blush-garden-rose', 'dusty-blue-champagne', 'mediterranean-lemon', 'vintage-airmail-love-letter'] as const;
const COLLECTION: Record<(typeof THEMES)[number], string> = {
  'olive-ivory': '01_Olive_Ivory',
  'blush-garden-rose': '03_Blush_Garden_Rose',
  'dusty-blue-champagne': '02_Dusty_Blue',
  'mediterranean-lemon': '05_Lemon_Mediterranean',
  'vintage-airmail-love-letter': '04_Vintage_Airmail',
};
const DAY = 86_400_000;

const record = (theme: (typeof THEMES)[number] = 'blush-garden-rose'): ContentRecord =>
  JSON.parse(readFileSync(path.join(REPO_ROOT, 'collections', COLLECTION[theme], 'content.demo.json'), 'utf8')) as ContentRecord;

/** YYYY-MM-DD of `ms` in UTC. */
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

before(() => {
  const themes = tmpDir('g075-themes-');
  for (const t of ['_sample', ...THEMES]) cpSync(path.join(PLATFORM_ROOT, 'themes', t), path.join(themes, t), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g075-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  setRsvpRateLimiter(new MemoryRateLimiter());
  setAccessRateLimiter(new MemoryRateLimiter());
});

// ---------------------------------------------------------------------------------------------- the rule

test('the switch is 00:00 of the day after the wedding in the site time zone — DST, both hemispheres, gaps, extremes', () => {
  const cases: Array<[string, string, string]> = [
    ['2027-05-15', 'America/New_York', '2027-05-16T04:00:00.000Z'], // EDT
    ['2027-03-13', 'America/New_York', '2027-03-14T05:00:00.000Z'], // the night DST starts (02:00): midnight is still EST
    ['2027-11-06', 'America/New_York', '2027-11-07T04:00:00.000Z'], // the night DST ends (02:00): midnight is still EDT
    ['2027-10-30', 'Europe/London', '2027-10-30T23:00:00.000Z'], // BST ends at 02:00 on the 31st: midnight is BST
    ['2027-03-27', 'Europe/London', '2027-03-28T00:00:00.000Z'], // BST starts at 01:00: midnight is GMT
    ['2027-03-27', 'Asia/Beirut', '2027-03-27T22:00:00.000Z'], // midnight does not exist (00:00 → 01:00): 01:00, never early
    ['2027-09-04', 'America/Santiago', '2027-09-05T04:00:00.000Z'], // the same gap in the south: 01:00 local
    ['2027-04-03', 'America/Santiago', '2027-04-04T04:00:00.000Z'], // clocks go back at midnight: once the 4th has begun for good
    ['2027-04-03', 'Australia/Sydney', '2027-04-03T13:00:00.000Z'], // AEDT (+11) the night before DST ends
    ['2027-10-02', 'Australia/Sydney', '2027-10-02T14:00:00.000Z'], // AEST (+10) the night before DST starts
    ['2027-06-12', 'Pacific/Kiritimati', '2027-06-12T10:00:00.000Z'], // UTC+14
    ['2027-06-12', 'Pacific/Pago_Pago', '2027-06-13T11:00:00.000Z'], // UTC-11
    ['2027-12-31', 'Asia/Tokyo', '2027-12-31T15:00:00.000Z'], // over the year end
    ['2027-06-12', 'Not/AZone', '2027-06-13T12:00:00.000Z'], // unknown zone: anywhere on earth (UTC-12), never early
  ];
  for (const [date, tz, want] of cases) {
    assert.equal(dayEndsAt(date, tz)?.toISOString(), want, `${date} ${tz}`);
    const c = { ...record(), date, timezone: tz };
    assert.equal(thankYouStartsAt(c)?.toISOString(), want);
    const at = Date.parse(want);
    assert.equal(isThankYouOn(c, new Date(at - 1)), false, `${date} ${tz}: still the wedding day 1 ms before`);
    assert.equal(isThankYouOn(c, new Date(at)), true, `${date} ${tz}: thank-you mode at ${want}`);
  }
  // 1 ms before, the wedding day is still on the site's own clock (the Santiago night that happens twice included)
  const local = (ms: number, tz: string) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ms);
  for (const [date, tz, want] of cases.filter(([, tz]) => tz !== 'Not/AZone')) {
    assert.equal(local(Date.parse(want) - 1, tz), date, `${tz}: the wedding day until the switch`);
    assert.notEqual(local(Date.parse(want), tz), date, `${tz}: the next day at the switch`);
  }
  assert.equal(dayEndsAt('2027-02-30', 'UTC'), null, 'no such day');
  assert.equal(dayEndsAt(undefined, 'UTC'), null);
  assert.equal(thankYouDay({ date: '2027-12-31' }), '2028-01-01');
  assert.equal(thankYouDay({ date: 'soon' }), null);
});

test('modes: Automatic (default, also without thank_you), On now, Off; an unreadable date never switches by itself', () => {
  const c = record(); // 2027-05-15, America/New_York
  const at = Date.parse('2027-05-16T04:00:00.000Z');
  const before = new Date(at - DAY);
  const after = new Date(at + 1);
  assert.equal(thankYouMode(c), 'auto');
  assert.deepEqual(thankYouState(c, before), { mode: 'auto', on: false, startsAt: '2027-05-16T04:00:00.000Z' });
  assert.equal(thankYouState(c, after).on, true);

  c.thank_you = { mode: 'on' };
  assert.equal(isThankYouOn(c, new Date('2026-01-01')), true, 'on now: long before the wedding');
  c.thank_you = { mode: 'off' };
  assert.equal(isThankYouOn(c, new Date('2099-01-01')), false, 'off: never (until the archive, G060)');
  c.thank_you = { mode: 'auto' };
  assert.equal(isThankYouOn(c, after), true);
  assert.equal(thankYouMode({ thank_you: { mode: 'sometimes' } }), 'auto', 'unknown values read as automatic');
  assert.equal(thankYouMode({ thank_you: 'on' }), 'auto');

  const noDate = { ...record() } as Partial<ContentRecord>;
  delete noDate.date;
  assert.equal(isThankYouOn(noDate, new Date('2099-01-01')), false);
  assert.equal(isThankYouOn({ ...noDate, thank_you: { mode: 'on' } }), true);
});

test('title, derived view fields, the Day page choice; tidy panel writes', () => {
  const c = record();
  assert.equal(thankYouTitle(c), THANK_YOU_DEFAULT_TITLE);
  c.thank_you = { title: '  With all our thanks  ', details: 'hide' };
  assert.equal(thankYouTitle(c), 'With all our thanks');
  const before = buildView(c, { now: new Date('2027-01-01') });
  assert.equal(before.thank_you_on, false);
  assert.equal(before.thank_you_hides_details, false, 'the Day page is hidden only while thank-you mode is on');
  const after = buildView(c, { now: new Date('2027-06-01') });
  assert.equal(after.thank_you_on, true);
  assert.equal(after.thank_you_title, 'With all our thanks');
  assert.equal(after.thank_you_hides_details, true);
  assert.equal(buildView(c, { now: new Date('2027-01-01'), thankYou: true }).thank_you_on, true, 'the couple\'s preview');

  // the panel writes leave defaults and empties out: going back to the start is no change
  const d = record();
  withThankYou(d, { mode: 'on', title: 'Thanks!' });
  assert.deepEqual(d.thank_you, { mode: 'on', title: 'Thanks!' });
  withThankYou(d, { mode: 'auto', title: null, details: 'keep', message: '' });
  assert.equal(d.thank_you, undefined);
  assert.deepEqual(changedPages(d, record()), []);
});

test('schema: thank_you shape and limits (title ≤ 60, message ≤ 400) in the schema, the validator and CONTENT_LIMITS', () => {
  assert.equal(CONTENT_LIMITS.thankYouTitle, 60);
  assert.equal(CONTENT_LIMITS.thankYouMessage, 400);
  const c = record();
  c.thank_you = { mode: 'on', title: 'T'.repeat(60), message: 'm'.repeat(400), photo: null, details: 'keep' };
  assert.deepEqual(validateContent(c, { platform: true }).errors, []);
  c.thank_you = { title: 'T'.repeat(61), message: '😀'.repeat(401) };
  const errors = validateContent(c, { platform: true }).errors.map((e) => `${e.path}:${e.code}`).sort();
  assert.deepEqual(errors, ['thank_you.message:schema_max_length', 'thank_you.title:schema_max_length'], 'characters = code points');
  const bad = record() as unknown as Record<string, unknown>;
  bad.thank_you = { mode: 'sometimes', extra: 1 };
  const codes = validateContent(bad).errors.map((e) => e.code).sort();
  assert.ok(codes.includes('schema_enum') && codes.includes('schema_unknown_field'), codes.join());
});

// ---------------------------------------------------------------------------------------------- engine + RSVP rule

test('engine: data-if takes several conditions (all must hold), on <body> too; thank-you preview needs a preview key', () => {
  const theme = { id: '_t', pages: { index: 'index.html', home: 'home.html' }, photos: {} };
  const html =
    '<html><head></head><body data-if="date !thank_you_hides_details">' +
    '<p id="a" data-if="dress_code !thank_you_on">A</p><p id="b" data-if="dress_code thank_you_on">B</p>' +
    '<p id="c" data-if="!rsvp.method !thank_you_on">C</p><a id="l" href="home.html">home</a></body></html>';
  const c = record();
  const r1 = renderTemplate({ html, content: c, theme, page: 'index', slug: 's', now: new Date('2027-01-01') });
  const $1 = cheerio.load(r1.html);
  assert.deepEqual([$1('#a').length, $1('#b').length, $1('#c').length], [1, 0, 1]);
  assert.equal($1('#a').attr('data-if'), 'dress_code !thank_you_on', 'conditions stay readable (absolute paths)');
  assert.equal($1('html').attr('data-thank-you'), undefined);
  const r2 = renderTemplate({ html, content: c, theme, page: 'index', slug: 's', now: new Date('2027-06-01') });
  const $2 = cheerio.load(r2.html);
  assert.deepEqual([$2('#a').length, $2('#b').length, $2('#c').length], [0, 1, 0]);
  assert.equal($2('html').attr('data-thank-you'), '');
  assert.equal(JSON.parse($2('#site-data').text()).derived.thank_you_on, true);
  c.thank_you = { details: 'hide' };
  assert.equal(renderTemplate({ html, content: c, theme, page: 'index', slug: 's', now: new Date('2027-06-01') }).disabled, true);
  assert.equal(renderTemplate({ html, content: c, theme, page: 'index', slug: 's', now: new Date('2027-01-01') }).disabled, false);
  // ?thanks=1: only with a preview key (the couple), and the page links keep it
  const guest = renderTemplate({ html, content: record(), theme, page: 'index', slug: 's', now: new Date('2027-01-01'), thankYouPreview: true });
  assert.equal(cheerio.load(guest.html)('#b').length, 0, 'a guest\'s ?thanks=1 changes nothing');
  const couple = renderTemplate({ html, content: record(), theme, page: 'index', slug: 's', now: new Date('2027-01-01'), thankYouPreview: true, previewKey: 'k' });
  const $c = cheerio.load(couple.html);
  assert.equal($c('#b').length, 1);
  assert.equal($c('#l').attr('href'), '/s/home?preview=k&thanks=1');
  assert.equal(JSON.parse($c('#site-data').text()).pages.home, '/s/home?preview=k&thanks=1');
});

test('RSVP rule: thank-you mode closes the form (reason thank_you) before the deadline is even looked at', () => {
  const c = record(); // deadline 2027-04-03, wedding 2027-05-15
  c.thank_you = { mode: 'on' };
  const w = rsvpWindow(c, new Date('2027-01-01'));
  assert.equal(w.open, false);
  assert.equal(w.reason, 'thank_you');
  assert.equal(closedMessage(w), 'Replies are closed. Thank you for celebrating with us.');
  assert.equal(deadlineInsight(c, new Date('2027-01-01')).state, 'thank_you');
  assert.match(deadlineText(deadlineInsight(c, new Date('2027-01-01')))!, /thank-you page/);
  const auto = record();
  assert.equal(rsvpWindow(auto, new Date('2027-06-01')).reason, 'thank_you', 'automatic, after the wedding');
  auto.thank_you = { mode: 'off' };
  assert.equal(rsvpWindow(auto, new Date('2027-06-01')).reason, 'deadline', 'off: the deadline as before');
  auto.rsvp.method = 'none';
  auto.thank_you = { mode: 'on' };
  assert.equal(rsvpWindow(auto, new Date('2027-01-01')).reason, 'disabled', 'replies off stays "disabled"');
});

// ---------------------------------------------------------------------------------------------- the themes

const SLUG = 'ty-test';
// the default "now" is after every demo wedding (04's is October 2, 2027): Automatic is on
async function renderPage(themeId: string, page: PageName, content: unknown, opts: { now?: Date; previewKey?: string; thankYouPreview?: boolean } = {}) {
  const theme = (await loadTheme(themeId))!;
  const html = (await readThemePage(theme, page))!;
  const r = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, now: opts.now ?? new Date('2027-10-15'), ...opts });
  assert.deepEqual(r.warnings, [], `${themeId}/${page}: engine warnings`);
  return { ...r, $: cheerio.load(r.html) };
}
const navLabels = ($: cheerio.CheerioAPI) => $('.site-nav li').map((_, li) => $(li).text().trim()).get();

for (const themeId of THEMES) {
  test(`${themeId}: thank-you mode — envelope card, home thank-you card, honest closed RSVP, the Day page kept or hidden`, async () => {
    const c = record(themeId);
    c.media.hero_portrait = '/media/11111111-2222-3333-4444-555555555555/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200w.jpg';
    c.thank_you = { message: 'Thank you <b>all</b>!\nSecond line.', photo: '/media/11111111-2222-3333-4444-555555555555/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-1200w.jpg' };
    const names = c.name_display!;

    // envelope: same opening, thank-you card (title + date, no place), the photo in the card window
    const idx = await renderPage(themeId, 'index', c);
    assert.equal(idx.$('html').attr('data-thank-you'), '');
    assert.match(idx.$('.env-head .kicker').text(), /With love and thanks/);
    assert.equal(idx.$('.card-copy').find('[data-field="thank_you_title"]').text(), THANK_YOU_DEFAULT_TITLE);
    assert.equal(idx.$('.card-copy [data-field="venue.city_region"]').length, 0);
    const photo = idx.$('.card [data-slot="hero_portrait"] img.ty-photo');
    assert.equal(photo.attr('src'), c.thank_you.photo);
    assert.match(photo.attr('srcset') ?? '', /-640w\.jpg 640w/, 'variants (G055)');
    assert.equal(idx.$('.ty-decor').length, 0);
    assert.ok(!idx.html.includes('aaaaaaaa'), 'the hero portrait is not on the thank-you card');
    assert.ok(!idx.html.includes('Your photo here') && !/ph_hero_portrait/.test(idx.$('.card').html() ?? ''), 'never a photo placeholder');
    assert.equal(idx.$('.stage').length, 1, 'the envelope still opens');
    assert.match(idx.$('meta[name="description"]').attr('content') ?? '', new RegExp(`^${THANK_YOU_DEFAULT_TITLE} · ${names.replace('&', '&')}`));
    assert.equal(idx.$('meta[name="description"]').length, 1);
    assert.ok(!(idx.$('meta[property="og:description"]').attr('content') ?? '').includes("You're invited"));

    // without a photo: the design's decoration (GPT part), not the placeholder
    const plain = structuredClone(c);
    delete plain.thank_you!.photo;
    const idx2 = await renderPage(themeId, 'index', plain);
    assert.equal(idx2.$('.ty-photo').length, 0);
    assert.equal(idx2.$('.card .ty-decor img').length, 1);
    assert.ok(!/ph_hero_portrait/.test(idx2.$('.card').html() ?? ''));

    // home: card + names + date stay; countdown, RSVP, calendar go; the thank-you card with the escaped message
    const home = await renderPage(themeId, 'home', c);
    assert.equal(home.$('[data-countdown]').length, 0);
    assert.equal(home.$('a[href*="/rsvp"]').length, 0, 'no reply links');
    assert.equal(home.$('[data-calendar]').length, 0);
    assert.equal(home.$('#invitation').length, 0);
    const card = home.$('#thank-you');
    assert.equal(card.find('#ty-head').text(), THANK_YOU_DEFAULT_TITLE);
    assert.equal(card.find('[data-field="thank_you.message"]').text(), 'Thank you <b>all</b>!\nSecond line.', 'text, never HTML');
    assert.ok(!home.html.includes('<b>all</b>'));
    assert.match(card.text(), /With love,/);
    assert.deepEqual(navLabels(home.$), ['Home', 'Story', 'The Day']);
    assert.equal(home.$('h1.names').length, 1);

    // story stays; its nav too
    const story = await renderPage(themeId, 'story', c);
    assert.equal(story.disabled, false);
    assert.deepEqual(navLabels(story.$), ['Home', 'Story', 'The Day']);

    // details kept as "The Day": no calendar, dress code, travel, questions, RSVP; the ceremony in the past tense
    const dc = structuredClone(c);
    dc.urls = { ...dc.urls, registry: 'https://registry.example.org/x', accommodation: 'https://hotel.example.org/y' };
    dc.optional_blocks = { ...dc.optional_blocks, registry: true, travel_stay: true, faq: true, dress_code: true };
    dc.dress_code = 'Garden formal';
    dc.faq = [{ q: 'Parking?', a: 'Yes.' }];
    const det = await renderPage(themeId, 'details', dc);
    assert.equal(det.disabled, false);
    assert.equal(det.$('[data-calendar]').length, 0);
    assert.ok(!det.html.includes('Garden formal') && !det.html.includes('hotel.example.org') && !det.html.includes('Parking?'));
    assert.ok(det.html.includes('registry.example.org'), 'the registry stays (gifts after the wedding)');
    assert.equal(det.$('a[href*="/rsvp"]').length, 0);
    assert.match(det.$('p.note').text(), /The ceremony began at/);
    // hidden by the couple: 404, and no link leads there
    const hidden = structuredClone(c);
    hidden.thank_you = { ...hidden.thank_you, details: 'hide' };
    assert.equal((await renderPage(themeId, 'details', hidden)).disabled, true);
    for (const p of ['home', 'story', 'rsvp'] as PageName[]) {
      const r = await renderPage(themeId, p, hidden);
      assert.equal(r.$('a[href$="/details"]').length, 0, `${p}: no link to the hidden Day page`);
    }

    // RSVP: the page stays for old links — honest copy, no form, a way home
    const rsvp = await renderPage(themeId, 'rsvp', c);
    assert.equal(rsvp.disabled, false);
    assert.equal(rsvp.$('form').length, 0);
    assert.equal(rsvp.$('[data-rsvp]').length, 0);
    assert.equal(rsvp.$('h1').text().trim(), 'Replies are closed');
    assert.equal(rsvp.$(`a[href="/${SLUG}/home"]`).length >= 1, true);
    assert.deepEqual(navLabels(rsvp.$), ['Home', 'Story', 'The Day']);

    // the thank-you stylesheet only in thank-you mode; every theme file the thank-you pages and thank-you.css name exists
    assert.equal(idx.$(`link[href$="/thank-you.css"]`).length, 1);
    const dir = path.join(PLATFORM_ROOT, 'themes', themeId);
    const refs = new Set<string>();
    for (const r of [idx, idx2, home, det, rsvp]) {
      r.$('[src], [href], [srcset]').each((_, el) => {
        const a = (el as unknown as { attribs: Record<string, string> }).attribs;
        for (const v of [a.src, a.href, ...(a.srcset ? a.srcset.split(',').map((x) => x.trim().split(/\s+/)[0]) : [])]) {
          if (v && v.startsWith(`/themes/${themeId}/`)) refs.add(v.slice(`/themes/${themeId}/`.length));
        }
      });
    }
    for (const m of readFileSync(path.join(dir, 'thank-you.css'), 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
    for (const f of refs) assert.ok(existsSync(path.join(dir, f)), `${themeId}: missing theme file ${f}`);
    assert.ok([...refs].includes('thank-you.css'));
    const inv = await renderPage(themeId, 'index', record(themeId), { now: new Date('2027-01-01') });
    assert.equal(inv.$(`link[href$="/thank-you.css"]`).length, 0);
  });

  test(`${themeId}: before the wedding (and with mode off) nothing of the thank-you version is in any page source`, async () => {
    const c = record(themeId);
    c.thank_you = { title: 'PRIVATE-TITLE', message: 'PRIVATE-MESSAGE', photo: '/media/site/cccccccccccccccccccccccccccccccc-1200w.jpg', details: 'hide' };
    for (const [now, mode] of [[new Date('2027-01-01'), undefined], [new Date('2099-01-01'), 'off']] as const) {
      const cc = structuredClone(c);
      if (mode) cc.thank_you!.mode = mode;
      for (const p of ['index', 'home', 'story', 'details', 'rsvp'] as PageName[]) {
        const r = await renderPage(themeId, p, cc, { now });
        assert.equal(r.disabled, false, `${p} is served`);
        for (const secret of ['PRIVATE-TITLE', 'PRIVATE-MESSAGE', 'cccccccc', 'thank-you.css', 'data-thank-you']) assert.ok(!r.html.includes(secret), `${p}: ${secret}`);
        assert.equal(JSON.parse(r.$('#site-data').text()).derived.thank_you_on, false);
      }
      const rsvp = await renderPage(themeId, 'rsvp', cc, { now });
      assert.equal(rsvp.$('form[data-rsvp-form]').length, 1, 'the invitation keeps its form');
    }
  });

  test(`${themeId}: the couple's preview of the thank-you page (?thanks=1) keeps it across pages; a 60-character title renders`, async () => {
    const c = record(themeId);
    c.thank_you = { title: 'W'.repeat(30) + ' ' + 'x'.repeat(29) };
    const r = await renderPage(themeId, 'home', c, { now: new Date('2027-01-01'), previewKey: 'tok', thankYouPreview: true });
    assert.equal(r.$('html').attr('data-thank-you'), '');
    assert.equal(r.$('#ty-head').text(), c.thank_you.title);
    assert.ok(r.$('.site-nav a').toArray().every((a) => (r.$(a).attr('href') ?? '').endsWith('preview=tok&thanks=1')));
    assert.equal(c.thank_you.title!.length, 60);
  });
}

// ---------------------------------------------------------------------------------------------- real routes

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: { method?: string; key?: string; json?: unknown; body?: BodyInit; type?: string; cookie?: string } = {}) {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.75' });
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  if (opts.cookie) headers.set('cookie', opts.cookie);
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  if (opts.type) headers.set('content-type', opts.type);
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve(params) });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* html */
  }
  return { status: res.status, data, text, headers: res.headers };
}

let n = 0;
/** A published site whose wedding was `daysAgo` days ago (negative: in the future); deadline a week before it. */
async function site(theme: string, daysAgo: number, thankYou?: ContentRecord['thank_you']) {
  const c = record((THEMES as readonly string[]).includes(theme) ? (theme as (typeof THEMES)[number]) : 'blush-garden-rose');
  c.timezone = 'UTC';
  c.date = isoDay(Date.now() - daysAgo * DAY);
  c.rsvp = { ...c.rsvp, deadline: isoDay(Date.now() - (daysAgo + 7) * DAY) };
  c.schedule = c.schedule.map((s) => ({ ...s }));
  if (thankYou) c.thank_you = thankYou;
  const slug = `g075-site-${++n}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme, content: c });
  await publishSite(getDataAdapter(), s.site.id);
  return { id: s.site.id, slug, editKey: s.editKey, previewKey: s.previewKey };
}
const index = (slug: string, q = '') => call(siteRoute, `/${slug}${q}`, { slug });
const sub = (slug: string, page: string, q = '') => call(pageRoute, `/${slug}/${page}${q}`, { slug, page });
const reply = (slug: string) =>
  call(rsvpPostRoute, `/api/rsvp/${slug}`, { slug }, { method: 'POST', json: { name: 'Ada Lovelace', attending: 'yes', guests: 1, website: '' } });

test('routes: the day after the wedding the site is a thank-you page by itself; RSVP API GET closed, POST 403 closed, nothing stored', async () => {
  for (const theme of THEMES) {
    const k = await site(theme, 2);
    const page = await index(k.slug);
    assert.equal(page.status, 200);
    assert.match(page.text, /data-thank-you/);
    assert.match(page.text, /Thank you for celebrating with us/);
    const status = await call(rsvpStatusRoute, `/api/rsvp/${k.slug}`, { slug: k.slug });
    assert.equal(status.status, 200);
    assert.equal(status.data.open, false);
    assert.equal(status.data.reason, 'thank_you');
    const post = await reply(k.slug);
    assert.equal(post.status, 403);
    assert.equal(post.data.code, 'closed');
    assert.equal(post.data.state, 'closed');
    assert.equal(post.data.reason, 'thank_you');
    assert.deepEqual(await getDataAdapter().listRsvps(k.id), [], 'nothing stored');
    assert.equal((await sub(k.slug, 'rsvp')).status, 200, 'the RSVP page still answers old links');
    assert.equal((await sub(k.slug, 'details')).status, 200);
  }
  // the wedding is tomorrow: the invitation, the form open
  // the wedding is tomorrow (its deadline passed a week ago): closed for the deadline, not thank-you
  const soon = await site('olive-ivory', -1);
  const s2 = await call(rsvpStatusRoute, `/api/rsvp/${soon.slug}`, { slug: soon.slug });
  assert.equal(s2.data.reason, 'deadline');
  assert.doesNotMatch((await index(soon.slug)).text, /data-thank-you/);
  // On now before the wedding: replies close at once (even with an open deadline)
  const on = await site('blush-garden-rose', -60, { mode: 'on' });
  const c = (await getDataAdapter().getSiteById(on.id))!.publishedContent!;
  assert.ok(rsvpWindow({ ...c, thank_you: undefined }, new Date()).open, 'the deadline alone would accept replies');
  assert.equal((await reply(on.slug)).status, 403);
  // Off after the wedding: the invitation stays (replies closed for the deadline only)
  const off = await site('blush-garden-rose', 5, { mode: 'off' });
  assert.doesNotMatch((await index(off.slug)).text, /data-thank-you/);
  assert.equal((await reply(off.slug)).data.reason, 'deadline');
  // Hidden Day page: 404
  const hidden = await site('olive-ivory', 3, { details: 'hide' });
  assert.equal((await sub(hidden.slug, 'details')).status, 404);
});

test('routes: archive rules unchanged (410 whatever the mode); password page first, its link preview says thank you', async () => {
  const k = await site('blush-garden-rose', 3, { mode: 'on' });
  await setArchiveOverride(getDataAdapter(), k.id, isoDay(Date.now() - DAY), 'test');
  assert.equal((await index(k.slug)).status, 410);
  assert.equal((await reply(k.slug)).status, 404, 'archived: no form at all (G060)');

  const p = await site('olive-ivory', 3);
  await setGuestAccess(getDataAdapter(), p.id, { enabled: true, password: 'OliveRiver27' });
  const gate = await index(p.slug);
  assert.equal(gate.status, 200);
  assert.doesNotMatch(gate.text, /data-thank-you/, 'the password page comes first (G076)');
  assert.equal((await reply(p.slug)).status, 401);
  // with the guest cookie: the thank-you page; link previews carry the names + the fixed thank-you line only
  const stored = (await getDataAdapter().getSiteById(p.id))!;
  const cookie = `${guestCookieName(p.id)}=${guestCookieValue(stored)}`;
  const inside = await call(siteRoute, `/${p.slug}`, { slug: p.slug }, { cookie });
  assert.match(inside.text, /data-thank-you/);
  const $ = cheerio.load(inside.text);
  assert.equal($('meta[name="description"]').attr('content'), THANK_YOU_DEFAULT_TITLE);
  assert.equal($('meta[property="og:description"]').attr('content'), THANK_YOU_DEFAULT_TITLE);
  assert.equal((await call(rsvpPostRoute, `/api/rsvp/${p.slug}`, { slug: p.slug }, { method: 'POST', cookie, json: { name: 'Ada', attending: 'yes', guests: 1 } })).status, 403);
});

test('routes: the thank-you photo is public only while thank-you mode shows it; the demo page stays an invitation', async () => {
  const adapter = getDataAdapter();
  const k = await site('olive-ivory', -30);
  const saved = await adapter.savePhoto(k.id, { bytes: tinyPng() });
  const s = (await adapter.getSiteById(k.id))!;
  const withPhoto = { ...s.content, thank_you: { photo: saved.url } };
  await adapter.updateContent(k.id, withPhoto);
  await publishSite(adapter, k.id);
  const mediaPath = saved.url.replace(/^\/media\//, '').split('/');
  const get = () => call(mediaRoute, saved.url, { path: mediaPath });
  assert.equal((await get()).status, 404, 'before the wedding nobody sees it');
  await adapter.updateContent(k.id, { ...withPhoto, thank_you: { photo: saved.url, mode: 'on' } });
  await publishSite(adapter, k.id);
  assert.equal((await get()).status, 200);
  assert.match((await index(k.slug)).text, new RegExp(saved.url.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')));

  // /start/demo: the fictional date passing never turns the demo into a thank-you page
  const demo = await call(demoRoute, '/start/demo/olive-ivory', { theme: 'olive-ivory' });
  assert.equal(demo.status, 200);
  assert.doesNotMatch(demo.text, /data-thank-you/);
});

test('panel API: thank_you saves like any edit (shape refused, limits block publishing), the thank-you photo place', async () => {
  const k = await site('blush-garden-rose', -40);
  const state = (await call(stateRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { key: k.editKey })).data.state;
  assert.equal(state.theme.fields.thankYou, true);
  assert.deepEqual(state.theme.thankYou.photo, {
    key: 'thank_you',
    label: 'Thank-you photo',
    source: 'thank_you.photo',
    aspect: state.theme.photos.find((p: { key: string }) => p.key === 'hero_portrait').aspect,
    ratio: state.theme.photos.find((p: { key: string }) => p.key === 'hero_portrait').ratio,
  });
  assert.ok(!state.theme.photos.some((p: { key: string }) => p.key === 'thank_you'), 'not one of the Photos page places');
  const put = (content: unknown, base: string) => call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content, baseUpdatedAt: base } });
  const draft = structuredClone(state.content);
  draft.thank_you = { mode: 'on', title: 'With love', message: 'See you soon' };
  const ok = await put(draft, state.updatedAt);
  assert.equal(ok.status, 200);
  assert.equal(ok.data.hasUnpublishedChanges, true, 'counted like any other edit (Review bar)');
  const bad = await put({ ...draft, thank_you: { mode: 'sometimes' } }, ok.data.updatedAt);
  assert.equal(bad.status, 400);
  assert.equal(bad.data.code, 'invalid_shape');
  const long = await put({ ...draft, thank_you: { message: 'x'.repeat(401) } }, ok.data.updatedAt);
  assert.equal(long.status, 200, 'saved while typing');
  assert.ok(long.data.validation.errors.some((e: { path: string }) => e.path === 'thank_you.message'));
  const pub = await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: {} });
  assert.equal(pub.status, 422);
  // the photo place: cropped to the portrait's shape, stored like the others
  const up = await call(photoRoute, `/api/edit/${k.slug}/photo?slot=thank_you`, { slug: k.slug }, { method: 'POST', key: k.editKey, body: Buffer.from(tinyPng()), type: 'image/png' });
  assert.equal(up.status, 200);
  assert.equal(up.data.source, 'thank_you.photo');
  // a design without a thank-you version has no such place
  const plain = await createSiteWithKeys(getDataAdapter(), { slug: 'g075-plain', theme: '_sample', content: record() });
  const none = await call(photoRoute, `/api/edit/g075-plain/photo?slot=thank_you`, { slug: 'g075-plain' }, { method: 'POST', key: plain.editKey, body: Buffer.from(tinyPng()), type: 'image/png' });
  assert.equal(none.status, 400);
  assert.equal(none.data.code, 'unknown_slot');
});

// ---------------------------------------------------------------------------------------------- panel helpers

test('panel: After the wedding sits in Day & place (no 7th page); Review names it; readiness ignores it; photo helpers', async () => {
  assert.deepEqual(PAGE_SECTIONS.day, ['date', 'venue', 'schedule', 'thankyou']);
  assert.deepEqual(parseEditTarget('thankyou'), { page: 'day', focus: 'thankyou' });
  assert.equal(sectionForPath('thank_you.message'), 'thankyou');
  const pub = record();
  const draft = record();
  withThankYou(draft, { message: 'Thank you!' });
  assert.deepEqual(changedPages(draft, pub), ['day']);
  assert.deepEqual(changedSections(draft, pub), ['thankyou']);
  const theme = await panelTheme('blush-garden-rose');
  const score = (c: ContentRecord) => readiness({ sections: ['date', 'venue', 'thankyou'], errors: [], notes: { sample: [], photos: [], links: [], empty: [] }, theme, content: c, published: true }).percent;
  assert.equal(score(draft), score(pub));
  const p = withPhoto(record(), 'thank_you.photo', '/media/x/y.jpg');
  assert.equal(photoAt(p, 'thank_you.photo'), '/media/x/y.jpg');
  assert.equal(photoAt(withPhoto(p, 'thank_you.photo', null), 'thank_you.photo'), null);
  // the preview tab list follows the hidden Day page only in thank-you mode (and in the thank-you preview)
  const rule = theme.pageRules.details;
  const hide = record();
  hide.thank_you = { details: 'hide' };
  assert.equal(pageShown(rule, hide, { now: new Date('2027-01-01') }), true);
  assert.equal(pageShown(rule, hide, { now: new Date('2027-01-01'), thankYou: true }), false);
  assert.equal(pageShown(rule, hide, { now: new Date('2027-06-01') }), false);
  assert.equal(themeFieldUse(['<p data-if="dress_code !thank_you_on"></p>']).thankYou, true);
  assert.equal(themeFieldUse(['<p data-if="dress_code"></p>']).thankYou, false);
  assert.equal((await panelTheme('_sample')).thankYou, null);
});

test('theme-check rule (docs/11 §3.6): 01, 02, 03, 04 and 05 complete; every other theme is reported (a warning), never half-done silently', async () => {
  // every theme of the repo (also those other tasks are building now), not the test copy
  const dir = path.join(PLATFORM_ROOT, 'themes');
  for (const id of readdirSync(dir).filter((d) => !d.startsWith('.')).sort()) {
    let manifest: { pages: Record<string, string> };
    try {
      manifest = JSON.parse(readFileSync(path.join(dir, id, 'theme.json'), 'utf8'));
    } catch {
      continue;
    }
    const pages: Partial<Record<PageName, string>> = {};
    for (const [p, f] of Object.entries(manifest.pages)) pages[p as PageName] = readFileSync(path.join(dir, id, f), 'utf8');
    const s = thankYouSupport(pages);
    if ((THEMES as readonly string[]).includes(id)) assert.deepEqual(s, { complete: true, partial: false, missing: [] }, id);
    else if (!s.complete) console.log(`# WARN theme ${id}: no thank-you version (G075) — ${s.missing.length} of the docs/11 §3.6 markers missing`);
  }
  assert.equal(thankYouSupport({ index: '<p data-if="thank_you_on"></p>' }).partial, true);
  assert.equal(thankYouSupport({}).partial, false);
});
