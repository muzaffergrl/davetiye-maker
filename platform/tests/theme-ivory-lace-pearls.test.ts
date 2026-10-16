// Theme platform/themes/ivory-lace-pearls (design 14 · Ivory Lace & Pearls, task G414) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json: the gatefold cut, per-part alignment, the lace pocket, clasp, card path) and the site.js contract; thank-you mode (G075),
// design texts (G068) and the guests' names row (G069) for this theme. Browser checks (widths, short phones, landscape,
// opening flow, stress record, weight, video) live in scripts/theme-check.cjs --theme ivory-lace-pearls; G051 in
// tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { THANK_YOU_DEFAULT_TITLE } from '../lib/content/thank-you.ts';
import { STANDARD_COPY, COPY_MAX_CEILING, stressCopy } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { listThemes, loadTheme, readThemePage, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'ivory-lace-pearls';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/14_Ivory_Lace_Pearl/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'charlotte-and-william';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-ilp-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/14_Ivory_Lace_Pearl/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string; now?: Date; thankYouPreview?: boolean } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, now: opts.now ?? new Date('2026-10-15'), ...opts });
  return { ...result, $: cheerio.load(result.html) };
}
const cssText = () => readFileSync(path.join(DIR, 'site.css'), 'utf8');
const cssRules = () => [...cssText().replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const rule = (sel: string) => cssRules().filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');
const jsText = () => readFileSync(path.join(DIR, 'site.js'), 'utf8');

// ---------------------------------------------------------------- independent en-US / en-GB formatting (not the engine's code)
const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }, loc = 'en-US') =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(loc, { timeZone: 'UTC', ...opts });
const fmtTime = (hm: string, us = true) => {
  const [h, m] = hm.split(':').map(Number);
  const s = h < 12 ? 'AM' : 'PM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${us ? s : s.toLowerCase()}`;
};
function getPath(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
}
function expected(content: ContentRecord, field: string, format: string): string {
  const us = (content.locale ?? 'en-US') === 'en-US';
  const loc = us ? 'en-US' : 'en-GB';
  const venue = content.venue as unknown as Record<string, string | null>;
  const derived: Record<string, string> = {
    'venue.city_region': [venue.city, venue.region].filter(Boolean).join(', '),
    'venue.city_region_country': [venue.city, venue.region, venue.country].filter(Boolean).join(', '),
  };
  const v = field in derived ? derived[field] : getPath(content, field);
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    if (format === 'weekday') return fmtDate(s, { weekday: 'long' }, loc);
    if (format === 'month') return fmtDate(s, { month: 'long' }, loc);
    if (format === 'day') return String(Number(s.slice(8)));
    if (format === 'year') return s.slice(0, 4);
    return fmtDate(s, undefined, loc);
  }
  if (/^\d{2}:\d{2}$/.test(s) && format !== 'raw') return fmtTime(s, us);
  return s;
}
/** Every text [data-field] equals the record; returns the number of checked fields. */
function assertFieldsMatch($: cheerio.CheerioAPI, content: ContentRecord, page: string): number {
  let n = 0;
  $('[data-field]').each((_, el) => {
    const field = $(el).attr('data-field')!;
    if (el.tagName === 'img' || field.startsWith('urls.') || field.startsWith('thank_you')) return;
    assert.equal($(el).text(), expected(content, field, $(el).attr('data-format') ?? ''), `${page}: ${field}`);
    n++;
  });
  return n;
}

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Ivory Lace & Pearls');
  assert.equal(theme.manifest.internal, undefined);
  assert.ok((await listThemes()).some((t) => t.id === ID), 'offered to buyers (not internal)');
  assert.deepEqual(Object.keys(theme.manifest.pages).sort(), [...PAGES].sort());
  const photos = theme.manifest.photos;
  assert.deepEqual(Object.keys(photos), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  assert.deepEqual(Object.values(photos).map((p) => p.source),
    ['media.hero_portrait', 'media.memory_photos.0', 'media.memory_photos.1', 'media.memory_photos.2', 'media.venue_image']);
  const slotOf: Record<string, string> = { hero_portrait: 'card', story_1: 'portrait', story_2: 'portrait', story_3: 'portrait', venue: 'landscape' };
  for (const [key, p] of Object.entries(photos)) {
    const [w, h] = MANIFEST.photo_slots[slotOf[key]].box_px;
    assert.equal(p.aspect, `${w}/${h}`, `${key} aspect = window box (manifest photo_slots)`);
    assert.ok(MANIFEST[`ph_${key}`].files.every((f: { file: string }) => existsSync(path.join(DIR, 'img', f.file))), `${key} placeholder`);
  }
  const used = new Set<string>();
  for (const page of PAGES) {
    cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'))('[data-photo]').each((_, el) => {
      used.add((el as unknown as { attribs: Record<string, string> }).attribs['data-photo']);
    });
  }
  assert.deepEqual([...used].sort(), Object.keys(photos).sort(), 'every slot is used, every used slot is declared');
});

test('2 every theme file referenced by the pages, site.css and site.js exists; share image + icon; folder ≤ 3 MB, no sources', () => {
  const refs = new Set<string>();
  for (const page of PAGES) {
    const { $ } = render(page);
    $('[src], [href], [srcset]').each((_, el) => {
      const a = (el as unknown as { attribs: Record<string, string> }).attribs;
      for (const v of [a.src, a.href, ...(a.srcset ? a.srcset.split(',').map((c) => c.trim().split(/\s+/)[0]) : [])]) {
        if (v && v.startsWith(`/themes/${ID}/`)) refs.add(v.slice(`/themes/${ID}/`.length));
      }
    });
  }
  for (const m of cssText().matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  for (const m of readFileSync(path.join(DIR, 'thank-you.css'), 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  for (const m of jsText().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', '__pycache__']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // only files the theme names (no stray build output)
  const files = readdirSync(path.join(DIR, 'img')).filter((f) => f !== 'manifest.json');
  const named = new Set([...refs].filter((r) => r.startsWith('img/')).map((r) => r.slice(4)).concat(['og-1200x630.jpg', 'favicon.png']));
  for (const f of files) assert.ok(named.has(f) || /-(\d+)\.webp$/.test(f), `unused ${f}`);
});

test('16 content.demo.json = the collection record (story included), a valid demo record; /start offers the theme', async () => {
  assert.equal(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8'), readFileSync(COLLECTION_RECORD, 'utf8'), 'byte for byte');
  const c = demo();
  assert.equal(c.record_kind, 'demo');
  assert.ok(validateContent(c).ok, JSON.stringify(validateContent(c).errors));
  assert.deepEqual(Object.values(c.urls), [null, null, null, null, null], 'demo URLs stay null');
  assert.equal(c.story?.items?.length, 3);
  const { claimableTheme } = await import('../lib/claim/themes.ts');
  const claim = await claimableTheme(ID);
  assert.ok(claim, '/start?theme=ivory-lace-pearls works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Charlotte');
  assert.equal(claim!.partnerCount, 2);
});

// ---------------------------------------------------------------- 3–5: server-side content

test('3 all five pages render without engine warnings; every field equals the content record', () => {
  const content = demo();
  let fields = 0;
  for (const page of PAGES) {
    const { $, warnings, disabled, scriptHashes } = render(page, content);
    assert.equal(disabled, false, page);
    assert.deepEqual(warnings, [], `${page}: ${warnings.join(' | ')}`);
    assert.ok(scriptHashes.length >= 1, `${page}: inline script hashed for CSP`);
    fields += assertFieldsMatch($, content, page);
    assert.equal($('[data-repeat]').length, 0, `${page}: no unexpanded data-repeat`);
    assert.doesNotMatch($('title').text(), /[{}]/, `${page}: title template filled`);
    $('meta[content]').each((_, el) => assert.doesNotMatch($(el).attr('content')!, /[{}]/, `${page}: meta filled`));
    $('a[href]').each((_, el) => assert.match($(el).attr('href')!, /^(\/|#|https?:|mailto:|tel:)/, `${page}: ${$(el).attr('href')}`));
    $('link[rel="stylesheet"]').each((_, el) => assert.match($(el).attr('href')!, new RegExp(`^(https://fonts\\.googleapis\\.com/|/themes/${ID}/)`)));
    assert.equal($('h1').length, 1, `${page}: one <h1>`);
    assert.equal($('html').attr('lang'), 'en');
    assert.equal($('meta[name="theme-color"]').attr('content'), MANIFEST.page_color);
  }
  assert.ok(fields > 45, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Charlotte & William · June 5, 2027');
  assert.equal(index('h1').text(), 'Charlotte & William');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, June 5, 2027 · Newport, Rhode Island");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'June 5, 2027 · Newport', 'card: date · city (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Charlotte & William');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Charlotte & William');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ["St. Mary's Chapel Garden", 'The Pearl Room', 'The Ashbury Ballroom']);
  assert.equal(details('.venue-place').text(), 'Newport, Rhode Island, USA');
  assert.equal(details('.dress-val').text(), 'Black tie optional');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'June', '5', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-venue').text(), 'Ashbury Manor');
  assert.equal(home('.hero-city').text(), 'Newport, Rhode Island');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
});

test('4 no personal text is hard-coded in the templates or the stylesheet (the site record is the only source)', () => {
  const c = demo();
  const personal = [
    c.host_line, c.venue.name, c.venue.city, c.venue.region, c.dress_code, fmtDate(c.date), fmtDate(c.rsvp.deadline!),
    ...c.partners.flatMap((p) => [p.display_name, p.full_name]), ...c.schedule.map((s) => s.location),
    ...(c.story?.items ?? []).map((i) => i.caption), c.story?.intro,
  ].filter((s): s is string => typeof s === 'string' && s.length > 2);
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8').replace(/&amp;/g, '&');
    assert.deepEqual(personal.filter((s) => raw.includes(s)), [], `${page}.html contains personal text`);
  }
  assert.deepEqual(personal.filter((s) => cssText().includes(s)), []);
  // W1 comp demo text is a layout reference only
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Charlotte|William|Ashbury|Newport|Rhode Island|Afternoon tea|Pearl Room|Chapel Garden|Black tie/i);
});

test('5 a content change shows on every page (names, date, venue, schedule rows, story, deadline)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Maren', full_name: 'Maren Holloway' };
  c.partners[1] = { display_name: 'Theo', full_name: 'Theo Castellan' };
  c.name_display = 'Maren & Theo';
  c.initials = 'M & T';
  c.date = '2028-09-23';
  c.ceremony_time = '15:30';
  c.timezone = 'Europe/London';
  c.venue = { name: 'Larkspur Hall', city: 'Bath', region: null, country: 'United Kingdom', address: '12 Orchard Lane' } as ContentRecord['venue'];
  c.schedule = [
    { label: 'Welcome Drinks', time: '14:45' },
    { label: 'Ceremony', time: '15:30', location: 'The Walled Garden' },
    { label: 'Dinner', time: '18:00', location: 'The Long Room' },
    { label: 'Dancing', time: '20:30', location: 'The Ballroom' },
  ] as ContentRecord['schedule'];
  c.rsvp.deadline = '2028-08-01';
  c.host_line = '';
  c.story = { intro: 'How a rainy afternoon became', items: [{ caption: 'A shared umbrella' }, { caption: 'Paris' }, { caption: 'Yes!' }] };
  for (const page of PAGES) {
    const { $, warnings } = render(page, c);
    assert.deepEqual(warnings, [], page);
    assertFieldsMatch($, c, page);
    assert.ok(!/Charlotte|William|Ashbury|Newport|Rhode Island/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy .cc-city').text(), 'Bath');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('.venue-place').text(), 'Bath, United Kingdom', 'no region: no stray comma');
  assert.equal(details('p[data-if="ceremony_time !thank_you_on"]').text(), 'The ceremony begins at 3:30 PM.');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.countdown').length, 1);
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Tea for two, a rose garden and one promise we will always keep brought us to June 5, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /brought us to 5 June 2027\.$/);
});

// ---------------------------------------------------------------- 6–12: photos, optional blocks, links, RSVP, preview

test('6 photo slots: a buyer photo replaces the placeholder (variants srcset + the template sizes; older single file: no srcset)', () => {
  const site = '0b9f2c1e-0000-4000-8000-000000000000';
  const hex = '0123456789abcdef0123456789abcdef';
  const c = demo();
  c.media.hero_portrait = `/media/${site}/${hex}-2000w.jpg`;
  const memories = [`/media/${site}/${hex.replace('0', '1')}.jpg`, 'https://storage.example.org/two.jpg'];
  c.media.memory_photos = memories;
  for (const page of ['index', 'home', 'story', 'details'] as PageName[]) {
    const { $ } = render(page, c);
    const template = cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'));
    $('[data-slot]').each((_, el) => {
      const slot = $(el);
      const key = slot.attr('data-slot')!;
      const img = slot.find('img[data-photo]');
      const want = ({ hero_portrait: c.media.hero_portrait, story_1: memories[0], story_2: memories[1] } as Record<string, unknown>)[key];
      if (want) {
        assert.equal(slot.attr('data-photo-state'), 'user', `${page}/${key}`);
        assert.equal(img.attr('data-photo-state'), 'user');
        assert.equal(img.attr('src'), want);
        if (key === 'hero_portrait') {
          assert.equal(img.attr('srcset'), `/media/${site}/${hex}-640w.jpg 640w, /media/${site}/${hex}-1280w.jpg 1280w, /media/${site}/${hex}-2000w.jpg 2000w`);
          assert.equal(img.attr('sizes'), template(`[data-slot="${key}"] img[data-photo]`).attr('sizes'), 'the template sizes (slot width) is kept');
        } else assert.equal(img.attr('srcset'), undefined, 'single-file photo: no srcset');
      } else {
        assert.equal(slot.attr('data-photo-state'), 'placeholder', `${page}/${key}`);
        assert.match(img.attr('src')!, new RegExp(`^/themes/${ID}/img/ph_${key}-\\d+\\.webp$`));
        assert.equal(slot.find('.ph-mark').length, 1, 'placeholder label element present');
      }
    });
  }
  for (const m of ['card', 'portrait', 'landscape']) assert.match(cssText(), new RegExp(`\\.mask-${m} \\{[^}]*url\\("img/mask_${m}\\.png"\\)`));
  const unsafe = demo();
  unsafe.media.venue_image = 'javascript:alert(1)';
  const d = render('details', unsafe);
  assert.equal(d.$('[data-slot="venue"]').attr('data-photo-state'), 'placeholder');
  assert.ok(d.warnings.some((w) => w.includes('unsafe')));
});

test('7 optional blocks switch sections, the Story page and its links off', () => {
  const c = demo();
  Object.assign(c.optional_blocks, { our_story: false, countdown: false, dress_code: false, registry: false, travel_stay: false });
  assert.equal(render('story', c).disabled, true, 'story page → 404');
  for (const page of ['home', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page, c);
    assert.equal($(`a[href="/${SLUG}/story"]`).length, 0, `${page}: no link to the switched-off story page`);
  }
  const home = render('home', c).$;
  assert.equal(home('.countdown').length, 0);
  assert.equal(home('.panel-link').length, 1, 'only the venue frame (The Day) stays');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress-val').text(), 'Black tie optional');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=hotel';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=hotel');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
});

test('9 RSVP page follows the platform form contract (G042): fields by name, method post, state panels, form.js', () => {
  const { $, warnings } = render('rsvp');
  assert.deepEqual(warnings, []);
  const form = $('form[data-rsvp-form]');
  assert.equal(form.length, 1);
  assert.equal(form.attr('method'), 'post');
  assert.equal(form.attr('action'), undefined);
  assert.equal(form.closest('[data-rsvp]').length, 1);
  for (const name of ['name', 'email', 'guests', 'message']) assert.equal(form.find(`[name="${name}"]`).length, 1, name);
  assert.deepEqual(form.find('input[name="attending"]').map((_, el) => $(el).attr('value')).get(), ['yes', 'no']);
  assert.equal(form.find('[name="website"]').length, 0, 'the honeypot name is reserved for the platform');
  assert.ok(form.find('[name="name"]').is('[required]'));
  assert.equal(form.find('[name="name"]').attr('maxlength'), '120');
  assert.equal(form.find('[name="message"]').attr('maxlength'), '500');
  assert.equal(form.find('[data-rsvp-if-attending] [name="guests"]').length, 1);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  for (const state of ['success', 'closed', 'error', 'preview']) {
    const p = $(`[data-rsvp-state="${state}"]`);
    assert.equal(p.length, 1, state);
    assert.ok(p.is('[hidden]'), `${state} starts hidden`);
  }
  for (const state of ['closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${state}"] [data-rsvp-message]`).length, 1, state);
  assert.deepEqual($('[data-rsvp-reply]').map((_, el) => $(el).attr('data-rsvp-reply')).get(), ['yes', 'no']);
  assert.equal($('[data-rsvp-again]').length, 1);
  assert.equal($('script[src="/rsvp/form.js"]').length, 1, 'platform script, root path kept');
  assert.equal($('a[href="#reply"]').length, 1, 'the card button jumps to the form');
  assert.equal($('#reply').length, 1);
  assert.match(cssText(), /html\[data-rsvp-replied\] \.closing \.title/);
});

test('G069 guests\' names: a <template data-rsvp-party> right after the guests field, in the form\'s own field style', () => {
  const { $ } = render('rsvp');
  const guests = $('form [name="guests"]').closest('label');
  const tpl = guests.nextAll('template[data-rsvp-party]');
  assert.equal(tpl.length, 1);
  assert.equal(guests.next().attr('data-rsvp-error-for'), 'guests');
  assert.equal(guests.next().next().is('template[data-rsvp-party]'), true, 'directly after the guests field and its error slot');
  const inner = cheerio.load(tpl.html()!);
  assert.equal(inner('label.field input[maxlength="120"]').length, 1);
  assert.equal(inner('label.field input[name]').length, 0, 'form.js names it');
  assert.equal(inner('[data-copy="form_party"]').text(), 'Name of guest');
  assert.equal(inner('[data-rsvp-party-number]').length, 1);
  assert.equal(inner('[data-rsvp-error-for="party"]').length, 1);
});

test('10 preview: every page link keeps ?preview=<key>; site-data pages map carries it too', () => {
  const key = 'pk_test_1234567890';
  for (const page of PAGES) {
    const { $ } = render(page, demo(), { previewKey: key });
    $(`a[href^="/${SLUG}"]`).each((_, el) => assert.match($(el).attr('href')!, /[?&]preview=pk_test_1234567890/, `${page}: ${$(el).attr('href')}`));
    assert.equal(JSON.parse($('#site-data').text()).pages.home, `/${SLUG}/home?preview=${key}`);
  }
  assert.equal(render('home', demo(), { previewKey: key }).$('a.replay').attr('href'), `/${SLUG}?replay=1&preview=${key}`);
});

test('11 replies collected another way (rsvp.method "none"): no RSVP page, no reply call anywhere', () => {
  const c = demo();
  c.rsvp.method = 'none';
  assert.equal(render('rsvp', c).disabled, true, 'RSVP page → 404');
  for (const page of ['index', 'home', 'story', 'details'] as PageName[]) {
    const { $ } = render(page, c);
    assert.equal($(`a[href="/${SLUG}/rsvp"]`).length, 0, `${page}: no link to the RSVP page`);
    assert.doesNotMatch($('body').text(), /Kindly reply|Will You Join Us/, page);
  }
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 3, 'with replies on: hero, invitation and nav link to the RSVP page');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments', () => {
  const css = cssText();
  assert.match(css, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(css, /\.ph-mark \{ display: none; \}/);
  assert.doesNotMatch(css, /^\.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/m, 'no unscoped rule');
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Charlotte & William');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Afternoon tea');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Ashbury Manor');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    // every GPT part is decorative (alt=""); only photos carry content alt text
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record

test('17 schedule of 1, 6 and 10 rows, long names, en-GB and the docs/11 §12 stress record render without warnings', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
  }
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & William';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '5 June 2027');
  assert.equal(render('details', gb).$('.sched-row .time').first().text(), '4:00 pm');
  const stress = stressRecord(demo());
  assert.ok(validateContent(stress).ok, JSON.stringify(validateContent(stress).errors));
  for (const page of PAGES) {
    const { $, warnings } = render(page, stress);
    assert.deepEqual(warnings, [], `stress ${page}`);
    assertFieldsMatch($, stress, page);
  }
  assert.equal(render('details', stress).$('.sched-row').length, 10);
  assert.match(jsText(), /--names-scale/);
  assert.match(cssText(), /var\(--names-scale, 1\)/);
  // the catalogue pair: Mrs Saint Delafield (copperplate script) + Bodoni Moda (high-contrast serif, optical sizes); both
  // ship latin-ext (Google Fonts CSS checked); exactly two families, display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Mrs+Saint+Delafield&display=swap', page);
  }
  // the script's fallback is the loaded Bodoni Moda (never an unloaded family: theme-check would report it)
  assert.match(cssText(), /--script: "Mrs Saint Delafield", "Bodoni Moda", serif;/);
});

test('design range (docs/11 §12 level 1) renders every field', () => {
  const range = rangeRecord(demo());
  assert.ok(validateContent(range).ok, JSON.stringify(validateContent(range).errors));
  for (const page of PAGES) {
    const { $, warnings } = render(page, range);
    assert.deepEqual(warnings, [], `range ${page}`);
    assertFieldsMatch($, range, page);
  }
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the manor?', a: 'Yes, valet parking at the main entrance.\nThe gates open at 3:30 PM.' },
    { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only evening.' },
  ];
  c.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Beef', 'Fish', 'Vegetarian'] },
    { id: 'song', label: 'A song that gets you dancing', type: 'text' },
  ];
  return c;
}

test('18 G051 add to calendar: home and details carry the .ics link and a Google Calendar link (preview keeps its key)', () => {
  for (const page of ['home', 'details'] as PageName[]) {
    const { $, warnings } = render(page, g051Content());
    assert.deepEqual(warnings, [], page);
    assert.equal($('.cal a[data-calendar="ics"]').attr('href'), `/${SLUG}/event.ics`, page);
    const google = new URL($('.cal a[data-calendar="google"]').attr('href')!);
    assert.equal(google.hostname, 'calendar.google.com', page);
    assert.equal(google.searchParams.get('dates'), '20270605T200000Z/20270606T003000Z', `${page}: 4 PM EDT to two hours after the reception`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal a[data-calendar="google"]').attr('target'), '_blank');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  assert.equal(render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$('a[data-calendar="ics"]').attr('href'),
    `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demo();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  assert.match(jsText(), /'home-invite':[^\n]*\['cal', \d+\]/);
  assert.match(jsText(), /'details-card':[^\n]*\['cal', \d+\]/);
});

test('19 G051 questions & answers: a native accordion on the details page, in order, only while the block is on', () => {
  const c = g051Content();
  const { $, warnings } = render('details', c);
  assert.deepEqual(warnings, []);
  const items = $('.faq-sec details.faq-item');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the manor?', 'Can we bring our children?']);
  assert.equal(items.first().find('.faq-a').text(), c.faq![0].a);
  assert.deepEqual(items.map((_, el) => $(el).attr('data-repeat-item')).get(), ['faq.0', 'faq.1']);
  assert.equal(items.filter('[open]').length, 0);
  assert.equal($('.faq-sec').attr('aria-labelledby'), 'faq-title');
  const off = g051Content();
  off.optional_blocks.faq = false;
  off.faq = [{ q: 'PRIVATE-QUESTION', a: 'PRIVATE-ANSWER' }];
  assert.ok(!render('details', off).html.includes('PRIVATE-'), 'switched-off Q&A is not in the source');
  const empty = g051Content();
  empty.faq = [];
  assert.equal(render('details', empty).$('.faq-sec').length, 0);
  const css = cssText();
  assert.match(css, /\.faq-a \{[^}]*white-space: pre-line/);
  assert.match(css, /\.faq-item summary::after \{ content: "\+"; content: "\+" \/ ""/, 'the "+" sign stays out of the accessible name');
  assert.match(css, /\.faq-item summary \{[^}]*min-height: 52px/);
});

test('20 G051 reply-form questions: one fieldset per question for guests who accept, radios / short answer, error slots', () => {
  const c = g051Content();
  const { $, warnings } = render('rsvp', c);
  assert.deepEqual(warnings, []);
  const box = $('form[data-rsvp-form] .questions');
  assert.equal(box.length, 1);
  assert.equal(box.attr('data-rsvp-if-attending'), '');
  const sets = box.find('fieldset[data-rsvp-question]');
  assert.deepEqual(sets.map((_, el) => $(el).attr('data-rsvp-question')).get(), ['meal', 'song']);
  const meal = sets.eq(0);
  assert.equal(meal.find('legend').text(), 'Meal choice');
  assert.deepEqual(meal.find('input[type="radio"]').map((_, el) => $(el).attr('value')).get(), ['Beef', 'Fish', 'Vegetarian']);
  assert.equal(meal.find('textarea').length, 0);
  assert.equal(meal.find('[data-rsvp-error-for]').attr('data-rsvp-error-for'), 'answer:meal');
  const song = sets.eq(1);
  assert.equal(song.find('input').length, 0);
  assert.equal(song.find('textarea').attr('maxlength'), '300');
  assert.equal(song.find('textarea').attr('aria-label'), 'A song that gets you dancing');
  assert.equal(song.find('[data-rsvp-error-for]').attr('data-rsvp-error-for'), 'answer:song');
  assert.equal(box.find('[name]').length, 0, 'names are given by /rsvp/form.js');
  assert.equal(render('rsvp').$('.questions').length, 0, 'no questions: no block');
  const sneaky = g051Content();
  sneaky.rsvp.questions![0].label = '<img src=x onerror=alert(1)>';
  assert.equal(render('rsvp', sneaky).$('fieldset[data-rsvp-question="meal"] img').length, 0, 'question text is text, never markup');
});

// ---------------------------------------------------------------- 21–22: full-name fallback, K21

test('21 invitation card: without a full name the first name is shown (never an empty name line)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Lottie', full_name: null };
  c.partners[1] = { display_name: 'William', full_name: 'William Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Lottie', 'William Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Charlotte Anne', 'William George']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.dline|\.venue-(sec|text|photo|name|place)|\.tile|\.panel|\.pl-|\.card(?!-clasp)|\.frame|\.oval-frame|\.land-frame|\.closure|\.dress|\.door|\.center|\.pocket|\.corner|\.float|\.hint-orn/;
  let checked = 0;
  for (const [, sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 30, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // gradients only as borderless light / fade masks / the interface pill (docs/11 §5.7): the window light from the top-left,
  // the satin's fade below the first screen, the glints of light over the pearls (14 "glint": the strand in the opening,
  // the story frames, the venue frame), the nav's soft ground, the button
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.page-bg::before|\.glint-band|\[data-a="glint"\]::after|\.frame-in::after|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the glints are soft bands of light (no hard stops: transparent at both ends), never a drawn line
  for (const sel of ['.glint-band', '.js [data-a="glint"]::after, .js .tile [data-a="descend"] .frame-in::after']) {
    const body = rule(sel);
    const alphas = [...body.matchAll(/rgba\(255, 252, 240, (\.?\d+)\)/g)].map((m) => Number(m[1]));
    assert.ok(alphas.length >= 3 && Math.max(...alphas) <= 0.95 && alphas[0] === 0 && alphas.at(-1) === 0, `${sel}: ${alphas}`);
  }
  // masked to a GPT part (light on the pearls / the carved ivory, never a lit rectangle on the satin)
  for (const sel of ['.glint-band', '.tile .frame-in::after', '.venue-photo::after']) assert.match(rule(sel), /mask: url\("img\//, sel);
  // the corner clusters are whole GPT parts: no mask / clip on them
  for (const [, sel, body] of rules) if (/corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  // the nav: no hard top edge (it fades in over 12 px) and an opaque label row nothing ghosts through
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
  const alphas = [...nav.matchAll(/rgba\(246, 240, 233, (\.\d+)\) \d+px, rgba\(246, 240, 233, (\.\d+)\)/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(alphas.length === 2 && alphas.every((a) => a >= 0.96), `label row ≥ .96 (${alphas})`);
  assert.match(nav, /backdrop-filter: blur\(\d+px\)/);
  // the divider ornaments are the GPT divider (a strand of pearls with a lace bow), never a CSS line
  for (const [, sel, body] of rules) assert.doesNotMatch(body, /height: 1px/, sel.trim());
  for (const page of ['home', 'story', 'details', 'rsvp'] as PageName[]) {
    assert.equal(render(page).$('nav.site-nav > img.orn[src$="divider-300.webp"]').length, 1, page);
  }
});

// ---------------------------------------------------------------- the gatefold (docs/11 §7.1/§7.4 kapi) and its opening

test('gatefold (kapi): layers from the build, the seam and fold lines measured, alignment fixed per part, the clasp on the seam', () => {
  const st = MANIFEST.stage;
  for (const k of ['door_l_in', 'door_r_in', 'center', 'pocket', 'door_l', 'door_r', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  // the seam: the contact line in the plain gap between the two lace doors, at the middle of the folder (± 1 %)
  const [x0, , cw] = st.closed_obj.box_pct;
  assert.ok(Math.abs(st.seam_pct - (x0 + cw / 2)) <= 1, `seam ${st.seam_pct} % vs folder middle ${x0 + cw / 2} %`);
  assert.equal(st.cuts.seam.method, 'renk');
  assert.equal(st.cuts.folds.method, 'renk');
  // the pocket: its flat top edge + the lace that rises above it in both corners (traced column by column)
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.ok(st.cuts.pocket.found >= 0.8 * (st.cuts.pocket.columns[1] - st.cuts.pocket.columns[0] - 48), 'edge found on most columns');
  assert.ok(st.cuts.pocket.corner_top_y < st.cuts.pocket.flat_edge_y - 15, 'the corner lace belongs to the pocket (above its flat edge)');
  assert.ok(st.checks.closed_layers_overlap_diff <= 0.01 && st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the sources');
  // alignment (docs/11 §7.1, kapi): kit_check's UYARI (fold lines +1.99 / −2.51 %) is under 4 %; the measured transform —
  // per part: the centre panel stretched to the closed width, the door insides scaled evenly onto the closed edges —
  // brings every hinge and edge to ≤ 1 px
  assert.notEqual(st.align.durum, 'hata');
  for (const e of st.align.kenarlar) assert.ok(Math.abs(e.fark_pct) <= 4, `${e.kenar} ${e.fark_pct} %`);
  for (const [k, v] of Object.entries(st.align_fix.after_px)) assert.ok(Math.abs(Number(v)) <= 1, `${k} ${v} px after the fix`);
  assert.equal(st.align_fix.door_l_in.scale[0], st.align_fix.door_l_in.scale[1], 'door insides keep their aspect');
  assert.ok(st.align_fix.center.scale[0] > 1.05 && st.align_fix.center.scale[0] < 1.15, 'the GPT centre panel is ~10 % narrow');
  // hinges: door_l turns on the folder's left edge = door_l_in's right edge; the same on the right
  const P = st.parts;
  assert.ok(Math.abs(P.door_l[0] - (P.door_l_in[0] + P.door_l_in[2])) <= 0.3, 'left hinge shared');
  assert.ok(Math.abs(P.door_r[0] + P.door_r[2] - P.door_r_in[0]) <= 0.3, 'right hinge shared');
  // the clasp: anchored on the seam at mid-height, measured on W1.1, not carried by a door
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_door, false);
  assert.ok(Math.abs(MANIFEST.closure.center_pct[0] - st.seam_pct) <= 0.01, 'clasp centre on the seam');
  const yc = MANIFEST.closure.comp.clasp_center_y_of_env_h;
  assert.ok(yc > 0.44 && yc < 0.53, `"at mid-height" (${yc})`);
  const css = cssText();
  const pct = (n: number) => String(n).replace(/^0\./, '.').replace(/^-0\./, '-.');
  for (const k of ['door_l_in', 'door_r_in', 'center', 'pocket', 'door_l', 'door_r', 'closure']) {
    const [left, top, w, h] = P[k];
    for (const [prop, v] of [['left', left], ['top', top], ['width', w], ['height', h]] as const) assert.ok(css.includes(`${prop}: ${pct(v)}%`), `${k}: ${prop} ${v} % from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`/ ${String(st.closed_obj.frac_w).replace(/^0\./, '.')})`), 'stage width = closed folder / frac_w');
  assert.ok(css.includes(`- var(--w) * ${String(st.closed_obj.top_frac_of_stage_w).replace(/^0\./, '.')})`), 'the card room tucks under the heading');
  assert.ok(css.includes(`transform-origin: ${MANIFEST.closure.pearl_center_in_crop_pct[0]}% ${MANIFEST.closure.pearl_center_in_crop_pct[1]}%`), 'the clasp moves about its centre pearl');
  assert.ok(css.includes(`transform-origin: 50% ${st.closed_obj.center_pct[1]}%`), 'the stage fits the open folder about the closed folder\'s centre');
  // origins: doors on their outer edges, insides on their inner edges (docs/11 §7.1 direction table)
  assert.match(rule('.door-l'), /transform-origin: 0 50%/);
  assert.match(rule('.door-r'), /transform-origin: 100% 50%/);
  assert.match(rule('.door-l-in'), /transform-origin: 100% 50%; transform: perspective\(1100px\) rotateY\(90deg\)/);
  assert.match(rule('.door-r-in'), /transform-origin: 0 50%; transform: perspective\(1100px\) rotateY\(-90deg\)/);
  for (const sel of ['.door-l', '.door-r', '.door-l-in', '.door-r-in']) assert.match(rule(sel), /backface-visibility: hidden/, sel);
  const { $ } = render('index');
  assert.deepEqual($('.stage').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(), ['env', 'closure']);
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['door-l-in', 'door-r-in', 'center', 'card-slot', 'pocket', 'door-l', 'door-r'], 'layer order bottom → top (docs/11 §7.2 kapi)');
});

test('the opening sentence: the pearl clasp unhooks and slips away, the lace doors part slowly like a lifted veil, the card rises as a strand of tiny pearls glints', () => {
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'doors', 'inner', 'rise', 'glint', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|doors|inner|rise|glint|forward|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  assert.ok(E.closure[0] <= 250, 'first motion ≤ 250 ms');
  assert.ok(E.doors[0] >= 0.5 * E.closure[1] && E.doors[0] >= E.closure[0] + 0.5 * E.closure[1], 'the doors part once the clasp has unhooked and slipped');
  assert.ok(E.doors[1] >= 900 && E.inner[1] >= 800, 'slowly (≥ 0.9 s + 0.8 s of door motion)');
  assert.ok(Math.abs(E.inner[0] - (E.doors[0] + E.doors[1])) <= 20, 'the lace-lined insides take over at 90°');
  assert.ok(E.rise[0] >= E.inner[0] && Math.abs(E.glint[0] - E.rise[0]) <= 300, 'the card rises while the strand of pearls glints');
  assert.ok(E.forward[0] >= E.rise[0] + E.rise[1] - 100);
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  // the clasp: unhooks (lifts towards the viewer: larger, its shadow wider, tilted), then slips away down the seam, fading
  const clasp = /A\(el\.closure, \[([\s\S]*?)\], E\.closure/.exec(js)![1];
  assert.match(clasp, /C\(0, -5, -8, 1\.1, 16\), offset: \.3/, 'unhooks first');
  assert.match(clasp, /C\(9, down, 16, \.98, 6\), opacity: 0, offset: \.86/, 'slips away');
  assert.match(js, /down = cr\.height \* 1\.7/);
  // both doors together (no stagger), 0 → ∓90° with a slight lift (a veil), handing over at 90° (offset .995)
  assert.match(js, /A\(el\.doorL, \[\{ \.\.\.Y\(0, 1, 0\)[^\n]*Y\(-90, \.9, -1\.6\), offset: \.995 \}, Y\(-90, \.9, -1\.6, 0\)\], \[d0, dd\]/);
  assert.match(js, /A\(el\.doorR, \[\{ \.\.\.Y\(0, 1, 0\)[^\n]*Y\(90, \.9, -1\.6\), offset: \.995 \}, Y\(90, \.9, -1\.6, 0\)\], \[d0, dd\]/);
  assert.match(js, /A\(el\.inL, \[Y\(90, \.86, -1\.6\), Y\(0, 1, 0\)\], \[i0, id\]/);
  assert.match(js, /A\(el\.inR, \[Y\(-90, \.86, -1\.6\), Y\(0, 1, 0\)\], \[i0, id\]/);
  assert.match(js, /transform: `perspective\(1100px\) translateY\(\$\{lift\}%\) rotateY\(\$\{a\}deg\)`/);
  // the opened folder fits the screen: × min(1, .94 × 100vw / open spread) (docs/11 §7.1)
  assert.equal(MANIFEST.stage.open_obj.frac_w, 1);
  assert.match(js, /const OPEN_FRAC = 1;/);
  assert.match(js, /Math\.min\(1, \.94 \* innerWidth \/ \(st\.offsetWidth \* OPEN_FRAC\)\)/);
  assert.match(rule('.is-opened .env'), /transform: scale\(var\(--os, \.65\)\)/);
  // "a strand of tiny pearls glints": the GPT strand under the hint stays, a borderless light runs along it (masked to it)
  const { $ } = render('index');
  assert.equal($('.hint-orn img[src$="divider-300.webp"]').length, 1);
  assert.equal($('.hint-orn .glint-band').length, 1);
  assert.match(js, /A\(el\.glint, \[\{ opacity: 0, backgroundPosition: '100% 0' \}[\s\S]*?backgroundPosition: '0% 0' \}\], E\.glint/);
  assert.match(rule('.glint-band'), /mask: url\("img\/divider-300\.webp"\)/);
  // no particles at the opening: the sentence names none (docs/11 §8: the sentence's kind and count bind)
  assert.match(js, /open: \[\],/);
  // the card path from the manifest
  const st = MANIFEST.stage;
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(cssText().includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.out_translate_pct <= -90, `out ${st.card_path.out_translate_pct}`);
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
  // waiting in the pocket only the card's top band shows: the photo window stays below the pocket edge
  assert.ok(st.card_path.card_top_above_pocket < st.card_path.window_top_frac, 'faces never cut by the pocket edge');
  assert.ok(cssText().includes(`.env .card { position: absolute; left: ${st.parts.card[0]}%; top: ${st.parts.card[1]}%;`), 'card top from the manifest');
});

test('the card lands visibly on home; replay has no floating card; the opened state hides the hint', () => {
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(cssText(), /\.hero-card \{ view-transition-name: invite-card; \}/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(cssText(), /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  const js = jsText();
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(rule('.env-page'), /overflow-x: clip/, 'the wide stage (open spread) never scrolls sideways');
});

// ---------------------------------------------------------------- this design: backdrop, hanging frames, lessons kept

test('backdrop: the satin with its window light (bg_page\'s flower-free middle), both lace corners whole, the comp\'s small pieces, clean placeholders', () => {
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    for (const c of [$('.scene-bg img.corner-tl'), $('.scene-bg img.corner-br')]) {
      assert.equal(c.length, 1, `${page}: corner layer`);
      assert.equal(c.attr('loading'), undefined, `${page}: the corner is in the first view (no lazy)`);
      assert.match(c.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/, `${page}: sizes for phones and landscape`);
    }
    assert.deepEqual($('.scene-bg img.float').map((_, el) => $(el).attr('src')!.split('/').pop()).get(),
      ['accent_1-96.webp', 'accent_2-200.webp', 'accent_3-200.webp', 'accent_2-200.webp'], 'W1: the pearl drop, a petal, the satin bow, a petal');
  }
  assert.match(cssText(), /\.scene-bg::before, \.page-bg::before \{ content: ""; position: absolute; inset: 0; background: url\("img\/mist-640\.webp"\)/);
  assert.deepEqual(MANIFEST.mist.crop, [176, 336, 800, 1200]);
  assert.ok(MANIFEST.mist.local_contrast <= 9, 'the satin crop has no lace / roses');
  for (const key of Object.keys(theme.manifest.photos)) assert.ok(MANIFEST[`ph_${key}`].max_busy <= 9, `ph_${key}: no decor in the crop (${MANIFEST[`ph_${key}`].max_busy})`);
  assert.equal(MANIFEST.checks.green_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
  assert.ok(MANIFEST.frame_landscape.leke_px > 0, 'the landscape window\'s GPT smudge was filled (G214 note)');
  // inner pages: the first screen's backdrop (W1.3–W1.5: lace corners + small pieces)
  for (const page of ['story', 'details', 'rsvp'] as PageName[]) {
    const bg = render(page).$('.page-bg');
    assert.equal(bg.length, 1);
    assert.equal(bg.find('img.corner-tl').length + bg.find('img.corner-br').length, 2, page);
    assert.ok(bg.find('img.float').length >= 2, page);
  }
  assert.match(rule('.page-bg'), /height: 100svh/);
  assert.match(rule('.page-bg .corner-br'), /bottom: calc\(var\(--nav-h\) \+ \d+px \+ env\(safe-area-inset-bottom\)\)/);
  const map = /const MAP = \{ tl: '([0-9a-f]{64})', br: '([0-9a-f]{64})' \}/.exec(jsText());
  assert.ok(map, 'decor alpha maps');
  // the bg_tile seam (GPT tile not seamless): repaired, its edge no rougher than ~1.3 × the texture
  assert.ok(MANIFEST.bg_tile.seam <= 1.3 * MANIFEST.bg_tile.seam_neighbour, `bg_tile seam ${MANIFEST.bg_tile.seam}`);
});

test('story: three carved oval frames hanging on strands of different lengths — a zigzag on phones (window ≥ 38vw), the comp\'s row from 900 px; each descends and glints', () => {
  const { $ } = render('story');
  const tiles = $('.tiles .tile');
  assert.equal(tiles.length, 3);
  assert.deepEqual(tiles.map((_, el) => $(el).attr('data-scene')).get(), ['story-tile', 'story-tile', 'story-tile'], 'each frame its own scene');
  assert.deepEqual($('.tiles .frame').map((_, el) => $(el).attr('data-a')).get(), ['descend', 'descend', 'descend']);
  assert.equal($('.tiles .frame > .frame-in > img.frame-img[src$="frame_portrait-320.webp"]').length, 3);
  assert.equal($('.tiles .tile[data-fold]').length, 3);
  assert.equal($('.tiles .tile .cap-orn').length, 3, 'a strand of pearls under each caption (W1.3)');
  const css = cssText();
  const tw = Number(/\.tiles \{[^}]*--tw: min\((\d+)vw/.exec(css)![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(tw * win >= 38, `phone photo window ${(tw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  // strands of different lengths: the strand is the top 33.78 % of the part; the middle frame keeps it whole (the lowest
  // in the comp's row), the first the shortest (the highest)
  assert.ok(Math.abs(MANIFEST.frame_portrait.strand.oval_top_pct - 33.78) < 1.5, 'strand measured');
  const cut = (sel: string) => Number(new RegExp(`${sel.replace('.', '\\.')} \\{[^}]*--cut: (\\.?\\d+)`).exec(css)![1]);
  assert.ok(cut('.tile') > cut('.t-3') && cut('.t-3') > cut('.t-2') && cut('.t-2') === 0, 'left the highest, the middle the lowest');
  assert.match(rule('.frame-in'), /clip-path: inset\(calc\(var\(--cut\) \* 100%\) -30% -30% -30%\)/, 'the strand is cropped at its top only');
  assert.match(rule('.t-2'), /margin-left: auto/, 'the second on the right (a zigzag)');
  assert.match(css, /\.t-2, \.t-3 \{ margin-top: calc\(var\(--tw\) \* 1\.93405 \* \(var\(--cut\) - \.3378\) \+ 14px\); \}/, 'each strand rises beside the frame above');
  assert.match(css, /grid-template-columns: repeat\(3, var\(--tw\)\)/, 'the comp\'s row');
  assert.match(rule('.tiles'), /overflow-x: clip/);
  // descend: from above, swinging about the top of the strand (overshoot ease), then the glint runs over it
  assert.match(rule('.js [data-a="descend"]'), /transform: translate3d\(0, -30%, 0\) rotate\(-3deg\); transform-origin: 50% 0;/);
  assert.match(rule('.js .tile [data-a="descend"].in .frame-in::after'), /animation: glint/);
  assert.match(rule('.tile .frame-in::after'), /mask: url\("img\/frame_portrait-320\.webp"\)[^;]*url\("img\/mask_portrait\.png"\)/);
  assert.match(rule('.venue-photo::after'), /mask: url\("img\/frame_landscape-480\.webp"\)[^;]*url\("img\/mask_landscape\.png"\)/);
  assert.match(jsText(), /w > 140 && bottom\(g\) > sv\(\) - navH\(\) - 8;\) g\.style\.setProperty\('--tw'/, 'the row is one fold unit');
  assert.match(jsText(), /n\.style\.setProperty\('--d', t \+ 'ms'\)/, 'the glint starts with its step');
});

test('home: the comp hero, the engraved date on the invitation card, two hanging pearl frames, the reply-by line once; srcset everywhere', () => {
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.panel-link .pl-title').map((_, el) => home(el).text()).get(), ['Our Story', 'The Day']);
  assert.equal(home('.pl-story [data-slot="story_1"]').length, 1);
  assert.equal(home('.pl-day [data-slot="venue"]').length, 1);
  assert.equal(home('.paper.invite').attr('data-a'), 'set', 'a painted card is set down, always opaque');
  assert.equal(home('.hero-inner > img.names-orn').length, 1, 'W1.2: the strand of pearls under the date');
  assert.deepEqual(home('.hero-inner').children().map((_, el) => (home(el).attr('class') ?? '').split(' ').find((c) => /^(hero-|names|countdown)/.test(c)) ?? '').get(),
    ['hero-card', 'names', 'hero-date', 'names-orn', 'hero-venue', 'hero-city', 'countdown', 'hero-cta'], 'W1.2 order');
  const c = demo();
  c.schedule = Array.from({ length: 6 }, (_, i) => ({ label: `Event ${i + 1}`, time: `${12 + i}:00`, location: null })) as ContentRecord['schedule'];
  const six = render('home', c).$;
  assert.equal(six('.pl-day .pl-row').length, 6, 'every row in the source; CSS shows the first four');
  assert.match(cssText(), /\.pl-row:nth-child\(n\+5\) \{ display: none; \}/);
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || /^accent_/.test(m[1]) || $(el).attr('data-photo-state') === 'user' || $(el).closest('.card-copy').length) return;
      if ((MANIFEST[m[1]]?.files ?? []).length < 2) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes (docs/11 §5.5)`);
    });
  }
});

test('lessons kept: first screen above the nav (fitNames + fold), names ≥ 32 px, landscape grid, ≥ 11 px text, no tap rectangle', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const js = jsText();
  assert.match(rule('.hero'), /padding-bottom: 27px/);
  assert.match(css, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 32);
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(js, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  assert.match(js, /const v = sv\(\), limit = v - navH\(\) - 8, below = v \+ 12/);
  assert.match(css, /\.hero \.scene-bg \{ position: absolute; z-index: 0; bottom: var\(--fold, 0px\); \}/);
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(css);
  assert.ok(land, 'short-landscape block');
  assert.match(land![1], /\.hero-inner \{\s*display: grid; grid-template: 1fr repeat\(7, auto\) 1fr \/ auto minmax\(0, 460px\)/);
  for (const [sel, row] of [['.hero .names', 2], ['.hero-date', 3], ['.names-orn', 4], ['.hero-venue', 5], ['.hero-city', 6], ['.countdown', 7], ['.hero-cta', 8]] as const) {
    assert.match(land![1], new RegExp(`\\n  ${sel.replace(/\./g, '\\.')} \\{ grid-area: ${row} \\/ 2;`), `${sel} in row ${row} beside the card`);
  }
  const widths = [...css.matchAll(/\.hero-card \{[^}]*width: (clamp\([^;]+)/g)].map((m) => m[1]);
  assert.ok(widths.length >= 3 && widths.every((w) => /^clamp\(1[3-9]\dpx/.test(w)), widths.join(' | '));
  for (const sel of ['.card-copy .kicker', '.rsvp-text .wait', '.cd-lbl', '.cue', '.invite-text .host', '.dateblock .wd', '.sched-row .time', '.sched-row .loc', '.dline .mon, .dline .yr']) {
    const r = rule(sel);
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: [a-z ]*\d+ max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: [a-z ]*\d+ (\d+(?:\.\d+)?)px/.exec(r) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(r);
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'c'\], \[true, 'c s'\]\]\)/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  for (const m of js.matchAll(/\{ file: 'img\/accent_\d-\d+\.webp'[^}]*\}/g)) assert.match(m[0], /path: 'fall'[^}]*avoid: '[^']+', host: '\.(hero|closing)'/, m[0]);
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: first step of a scene ≤ 150 ms, last ≤ 3000 ms; one entrance 600–1800 ms
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  assert.match(rule('.amp'), /font-size: max\(11px, \.5em\)/);
  assert.match(cssText(), /\.card-copy \.kicker:has\(\.cc-city\[data-empty\]\) \.sep/);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
});

test('smooth scrolling only for the RSVP page\'s #reply jump, never with reduced motion (a scripted scroll is never eased)', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/scroll-behavior: smooth/g) || []).length, 1);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ html:has\(#reply\) \{ scroll-behavior: smooth; \} \}/);
  for (const page of ['index', 'home', 'story', 'details'] as const) assert.equal(render(page).$('#reply').length, 0, `${page}: no #reply, no smooth scroll`);
});

test('24 G068: theme.json copy = the templates; no unmarked visible text; standard keys; every key at its max renders', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = (await readThemePage(theme, p)) ?? undefined;
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], `run node scripts/copy-manifest.ts --theme ${ID}`);
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy!);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const [k, e] of Object.entries(theme.manifest.copy!)) assert.ok([...e.default].length <= e.max && e.max <= COPY_MAX_CEILING, k);
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy!);
  for (const page of PAGES) {
    for (const thankYou of [false, true]) {
      const out = render(page, c, { previewKey: thankYou ? 'k' : undefined, thankYouPreview: thankYou });
      assert.deepEqual(out.warnings, [], page);
      if (out.disabled) continue;
      out.$('[data-copy]').each((_, el) => assert.equal(out.$(el).text(), c.copy![out.$(el).attr('data-copy')!], `${page} ${out.$(el).attr('data-copy')}`));
    }
  }
});

test('G075 thank-you mode: every marker (docs/11 §3.6); envelope card, home thank-you card, honest closed RSVP, the Day page kept or hidden', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  assert.deepEqual(thankYouSupport(pages), { complete: true, partial: false, missing: [] });
  const after = new Date('2027-07-15');
  const c = demo();
  c.media.hero_portrait = '/media/11111111-2222-3333-4444-555555555555/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200w.jpg';
  c.thank_you = { message: 'Thank you <b>all</b>!\nSecond line.', photo: '/media/11111111-2222-3333-4444-555555555555/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-1200w.jpg' };
  const idx = render('index', c, { now: after });
  assert.deepEqual(idx.warnings, []);
  assert.equal(idx.$('html').attr('data-thank-you'), '');
  assert.equal(idx.$('.env-head .kicker').text(), 'With love and thanks');
  assert.equal(idx.$('.card-copy [data-field="thank_you_title"]').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(idx.$('.card-copy .cc-city').length, 0);
  assert.equal(idx.$('.card img.ty-photo').attr('src'), c.thank_you.photo);
  assert.ok(!idx.html.includes('aaaaaaaa') && !idx.html.includes('Your photo here'));
  const plain = structuredClone(c);
  delete plain.thank_you!.photo;
  const idx2 = render('index', plain, { now: after });
  assert.equal(idx2.$('.card .ty-decor img[src*="closure"]').length, 1, 'without a photo: the pearl clasp on the ivory satin (never a placeholder)');
  const home = render('home', c, { now: after });
  assert.equal(home.$('[data-countdown]').length, 0);
  assert.equal(home.$('a[href*="/rsvp"]').length, 0);
  assert.equal(home.$('[data-calendar]').length, 0);
  assert.equal(home.$('#thank-you #ty-head').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(home.$('#thank-you [data-field="thank_you.message"]').text(), 'Thank you <b>all</b>!\nSecond line.');
  assert.deepEqual(home.$('.site-nav li').map((_, li) => home.$(li).text().trim()).get(), ['Home', 'Story', 'The Day']);
  const rsvp = render('rsvp', c, { now: after });
  assert.equal(rsvp.$('form').length, 0);
  assert.equal(rsvp.$('h1').text().trim(), 'Replies are closed');
  assert.equal(rsvp.$(`a.btn[href="/${SLUG}/home"]`).length, 1);
  const det = render('details', c, { now: after });
  assert.match(det.$('p.note').text(), /The ceremony began at/);
  const hidden = structuredClone(c);
  hidden.thank_you = { ...hidden.thank_you, details: 'hide' };
  assert.equal(render('details', hidden, { now: after }).disabled, true);
  assert.equal(render('story', hidden, { now: after }).$('a[href$="/details"]').length, 0);
  // thank-you.css only after the wedding; its files exist
  assert.equal(idx.$('link[href$="/thank-you.css"]').length, 1);
  assert.equal(render('index').$('link[href$="/thank-you.css"]').length, 0);
});

// ---------------------------------------------------------------- 13: site.js contract

test('13 site.js: reads #site-data, navigates with the page map, per-site session keys = <head> scripts, DEV_CONTENT = demo', () => {
  const js = jsText();
  assert.match(js, /getElementById\('site-data'\)/);
  assert.match(js, /location\.href = PAGES\.home/);
  assert.match(js, /rel: 'prefetch', href: PAGES\.home/, 'prefetch uses the page map');
  assert.doesNotMatch(js, /location\.href\s*=\s*['"]/, 'no literal navigation target');
  assert.doesNotMatch(js, /innerHTML|eval\(|new Function/);
  assert.match(js, /a\[data-url-missing\]/);
  assert.match(js, /countdown_target_utc/);
  const literals = js.match(/'[a-z]+\.html'/g) ?? [];
  assert.deepEqual(literals, ["'index.html'", "'home.html'", "'story.html'", "'details.html'", "'rsvp.html'"], 'only the dev fallback page map');
  assert.match(js, /const PAGES = \(SITE && SITE\.pages\) \|\|/);
  assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(js, /const KEY = SITE && SITE\.slug \? ':' \+ SITE\.slug : ''/);
  const index = readFileSync(path.join(DIR, 'index.html'), 'utf8');
  assert.match(index, /'invite:opened'\+k/);
  assert.match(readFileSync(path.join(DIR, 'home.html'), 'utf8'), /'invite:arrive'\+k/);
  const rules = cheerio.load(index)('script[type="speculationrules"]').text();
  assert.doesNotMatch(rules, /\.html|"urls"/);
  assert.match(rules, /"selector_matches":"a\[data-enter\]"/);
  const devSrc = /const DEV_CONTENT = (\{[\s\S]*?\n\});/.exec(js)![1];
  const dev = new Function(`return (${devSrc});`)();
  assert.deepEqual(dev, demo());
  const map = new Function(`return (${/const PHOTO_SOURCES = (\{[^}]+\})/.exec(js)![1]});`)();
  assert.deepEqual(map, Object.fromEntries(Object.entries(theme.manifest.photos).map(([k, p]) => [k, p.source])));
  for (const page of ['index', 'home'] as PageName[]) {
    const n = (cssText().match(/view-transition-name: invite-card/g) ?? []).length;
    assert.equal(n, 2, 'index .env .card + home .hero-card');
    assert.equal(render(page).$('.card').length, 1, `${page}: one card with the transition name`);
  }
});

// ---------------------------------------------------------------- 14–15: real routes, privacy

test('14 routes: a published site on this theme serves 200 pages with CSP hashes, the uploaded photo and theme assets', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getAsset } = await import('../app/themes/[theme]/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-ilp', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-ilp'), { params: Promise.resolve({ slug: 'maren-and-theo-ilp' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/ivory-lace-pearls\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Charlotte & William wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-ilp/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-ilp', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'door_l-358.webp'], ['img', 'closure-480.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'mist-640.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-ilp' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-ilp'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-ilp', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.21' },
    body: JSON.stringify({ name: 'Ada Fictional', email: '', attending: 'yes', guests: '2', message: 'See you there', website: '' }),
  }), rctx);
  assert.equal(posted.status, 200);
  assert.deepEqual((await adapter.listRsvps(created.site.id)).map((r) => [r.name, r.attending, r.guests]), [['Ada Fictional', true, 2]]);
  for (const p of [['index.html'], ['theme.json'], ['content.demo.json'], ['build_images.py'], ['README.md'], ['img', 'manifest.json']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 404, `${p.join('/')} must not be served`);
  }
});

test('15 privacy: sections the couple switched off leave nothing in any page source (site-data included)', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-lace-site', theme: ID, content: demo() });
  const photos = await Promise.all([1, 2, 3].map(() => adapter.savePhoto(created.site.id, { bytes: tinyPng() })));
  const c = demo();
  c.record_kind = 'customer';
  c.story = { intro: 'PRIVATE-INTRO', items: [{ caption: 'PRIVATE-CAPTION-1' }, { caption: 'PRIVATE-CAPTION-2' }, { caption: 'PRIVATE-CAPTION-3' }] };
  c.media.memory_photos = photos.map((p) => p.url);
  c.urls.registry = 'https://registry.example.org/PRIVATE-REGISTRY';
  c.urls.accommodation = 'https://hotel.example.org/PRIVATE-HOTEL';
  c.dress_code = 'PRIVATE-DRESS';
  Object.assign(c.optional_blocks, { our_story: false, registry: false, travel_stay: false, dress_code: false });
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const story = await getPage(req('/quiet-deco-site/story'), { params: Promise.resolve({ slug: 'quiet-lace-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-deco-site'), { params: Promise.resolve({ slug: 'quiet-lace-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-deco-site/${page}`), { params: Promise.resolve({ slug: 'quiet-lace-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});

// ---------------------------------------------------------------- the first screens, measured in a browser
// Playwright from the global install (docs/11 §13.3; never `playwright install`): the pages are rendered here with the
// engine and served from the theme folder, so the layout code (site.css + site.js) runs for real. Skipped when Playwright
// or its browsers are not installed.
async function withBrowser(t: { skip: (m: string) => void }, fn: (open: (page: PageName, content: unknown, w: number, h: number, measure: string) => Promise<any>) => Promise<void>) {
  process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
  process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';
  const req = createRequire(import.meta.url);
  let chromium: any = null;
  for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { chromium = req(id).chromium; break; } catch { /* next */ }
  }
  if (!chromium) return t.skip('playwright not installed');
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  let browser: any;
  try {
    browser = await chromium.launch(proxy ? { proxy: { server: proxy, bypass: 'theme.test' } } : {});
  } catch (e) {
    return t.skip(`no browser: ${String(e).slice(0, 80)}`);
  }
  const types: Record<string, string> = { '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
  try {
    await fn(async (page, content, w, h, measure) => {
      const html = render(page, content).html;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      await p.route('**/*', (route: any) => {
        const u = new URL(route.request().url());
        if (u.hostname === 'theme.test') {
          const rel = u.pathname.startsWith(`/themes/${ID}/`) ? decodeURIComponent(u.pathname.slice(ID.length + 9)) : null;
          if (rel && existsSync(path.join(DIR, rel))) return route.fulfill({ body: readFileSync(path.join(DIR, rel)), contentType: types[path.extname(rel)] ?? 'application/octet-stream' });
          if (u.pathname === `/${SLUG}/${page}`) return route.fulfill({ body: html, contentType: 'text/html' });
          return route.fulfill({ status: u.pathname === '/rsvp/form.js' ? 200 : 404, body: '', contentType: 'text/javascript' });
        }
        return /^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname) ? route.continue() : route.abort();
      });
      await p.goto(`http://theme.test/${SLUG}/${page}`, { waitUntil: 'load' });
      await p.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]));
      await p.waitForTimeout(400); // site.js runs again on fonts.ready and load
      const m = await p.evaluate(measure);
      await ctx.close();
      return m;
    });
  } finally {
    await browser.close();
  }
}

test('browser: the opened gatefold fits the screen (no sideways scroll, ≤ 94 % wide); the story row ends above the nav on desktop', async (t) => {
  await withBrowser(t, async (open) => {
    // the stage is wider than a phone (its open spread): clipped, never scrolled; the open spread fits after --os
    for (const [w, h] of [[360, 640], [390, 844], [430, 932], [844, 390], [1280, 800]]) {
      const m = await open('index', demo(), w, h, `(() => { const st = document.querySelector('.stage'); const os = Number(getComputedStyle(document.querySelector('.env-page')).getPropertyValue('--os')); return { sw: document.documentElement.scrollWidth, iw: innerWidth, os, spread: st.offsetWidth * os }; })()`);
      assert.ok(m.sw <= m.iw, `${w}×${h}: no sideways scroll (${m.sw})`);
      assert.ok(m.os > 0 && m.os <= 1 && m.spread <= 0.94 * m.iw + 1, `${w}×${h}: open spread ${Math.round(m.spread)} px ≤ 94 % of ${m.iw}`);
    }
    for (const [w, h] of [[1280, 720], [1280, 800], [1440, 900]]) {
      for (const [name, rec] of [['demo', demo()], ['stress', stressRecord(demo())]] as const) {
        const m = await open('story', rec, w, h, `(() => { const r = (e) => e.getBoundingClientRect(); const nav = r(document.querySelector('.site-nav')).top; const t = [...document.querySelectorAll('.tiles .tile')].map((x) => ({ top: r(x).top, bottom: r(x).bottom })); return { vh: innerHeight, nav, t, sw: document.documentElement.scrollWidth }; })()`);
        const on = m.t.filter((x: { top: number }) => x.top < m.vh).length;
        assert.ok(on === 0 || on === 3, `story ${w}×${h} ${name}: ${on} of 3 frames on the first screen (never one or two alone)`);
        if (on === 3) assert.ok(Math.max(...m.t.map((x: { bottom: number }) => x.bottom)) <= m.nav + 1, `story ${w}×${h} ${name}: the row ends above the nav`);
        assert.ok(m.sw <= w, `story ${w}×${h} ${name}: no sideways scroll`);
      }
    }
  });
});
