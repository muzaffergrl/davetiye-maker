// Theme platform/themes/tuscan-vineyard (design 10 · Tuscan Vineyard, task G410) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json), the site.js contract, the G068 copy manifest (§3.7, the checks tests/g068-copy.test.ts runs on
// 01–05) and the G075 thank-you version (§3.6, the checks tests/g075-thank-you.test.ts runs on 01–05). Browser checks
// (widths, short phones, opening flow, stress record, weight, video) live in scripts/theme-check.cjs --theme
// tuscan-vineyard; G051 in the browser in tests/g051-browser.ts --theme tuscan-vineyard.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { THANK_YOU_DEFAULT_TITLE } from '../lib/content/thank-you.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { COPY_MAX_CEILING, STANDARD_COPY, stressCopy } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { listThemes, loadTheme, PAGE_NAMES, readThemePage, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'tuscan-vineyard';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/10_Tuscan_Vineyard/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'giulia-and-matteo';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-tv-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/10_Tuscan_Vineyard/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string; now?: Date } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  // before the wedding (2027-09-25) unless a test says otherwise: the thank-you version switches on by itself after it
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, now: new Date('2027-01-01'), ...opts });
  return { ...result, $: cheerio.load(result.html) };
}
const css = () => readFileSync(path.join(DIR, 'site.css'), 'utf8');
const js = () => readFileSync(path.join(DIR, 'site.js'), 'utf8');
const rules = () => [...css().replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const rule = (sel: string) => rules().filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');

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
  const derived: Record<string, string> = { 'venue.city_region': [venue.city, venue.region].filter(Boolean).join(', ') };
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
  assert.equal(theme.manifest.name, 'Tuscan Vineyard');
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
  for (const m of css().matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  for (const m of js().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  // G153: the colour palettes' images (img/variants/) are not part of the design's own budget (docs/25 §4)
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .filter((e) => !(e.isDirectory() && e.name === 'variants' && path.basename(d) === 'img'))
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // every <img> showing a GPT part with more than one width carries srcset + sizes (docs/11 §5.5)
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || $(el).attr('data-photo-state') === 'user' || $(el).hasClass('ty-photo')) return;
      if ((MANIFEST[m[1]]?.files ?? []).length < 2 || /^accent_/.test(m[1]) && !$(el).attr('srcset')) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes`);
    });
  }
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
  assert.ok(claim, '/start?theme=tuscan-vineyard works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Giulia');
  assert.equal(claim!.partnerCount, 2);
});

// ---------------------------------------------------------------- 3–5, 23: server-side content

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
    assert.equal($('main').length, 1, `${page}: one <main>`);
  }
  assert.ok(fields > 50, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Giulia & Matteo · September 25, 2027');
  assert.equal(index('h1').text(), 'Giulia & Matteo');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, September 25, 2027 · Montepulciano, Tuscany");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage').attr('aria-label'), 'Open the invitation');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Giulia & Matteo');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Giulia & Matteo');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Vineyard Terrace', 'The Cellar', 'The Cypress Courtyard']);
  assert.equal(details('.venue-city').text(), 'Montepulciano, Tuscany, Italy');
  assert.equal(details('.dress-val').text(), 'Garden formal');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'September', '25', '2027', 'at 4:00 PM']);
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  // no monogram: the cork disc is plain (W1.1, README) — the panel's Monogram field is not offered for this design
  for (const page of PAGES) assert.equal(render(page, content).$('[data-field="initials"]').length, 0, page);
});

test('4 no personal text is hard-coded in the templates, the stylesheet or the script (the site record is the only source)', () => {
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
  assert.deepEqual(personal.filter((s) => css().includes(s)), []);
  // site.js names them only inside DEV_CONTENT (the static design preview, never on the platform)
  const outsideDev = js().replace(/const DEV_CONTENT = \{[\s\S]*?\n\};/, '');
  assert.deepEqual(personal.filter((s) => outsideDev.includes(s)), []);
  // W1 comp demo text is a layout reference only
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Tenuta|Giulia|Matteo|Montepulciano|First pour|Among the vines|A fine vintage|Garden formal/);
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
    assert.ok(!/Giulia|Matteo|Tenuta|Montepulciano|Tuscany/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy .kicker').last().text(), 'Bath', 'city without region: no stray comma');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('.venue-city').text(), 'Bath, United Kingdom');
  assert.equal(details('p[data-if="ceremony_time !thank_you_on"]').text(), 'The ceremony begins at 3:30 PM.');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.r-day .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Good wine, long tables and golden vineyard sunsets led us to September 25, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /led us to 25 September 2027\.$/);
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
  // masks: every slot is masked by its GPT window (no CSS border-radius imitation)
  for (const m of ['card', 'portrait', 'landscape']) assert.match(css(), new RegExp(`\\.mask-${m} \\{[^}]*url\\("img/mask_${m}\\.png"\\)`));
  assert.doesNotMatch(css().replace(/\/\*[\s\S]*?\*\//g, ''), /\.photo-slot[^{]*\{[^}]*border-radius/);
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
  assert.equal(home('.vrow').length, 2, 'no story row');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=vineyard';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=vineyard');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
});

test('9 RSVP page follows the platform form contract (G042, G069): fields by name, method post, state panels, form.js, guest names', () => {
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
  // G069: the guest-names row right after the guests field, a nameless input, its error slot
  const tpl = cheerio.load($('template[data-rsvp-party]').html() ?? '');
  assert.equal($('[data-rsvp-if-attending]:has([name="guests"]) + [data-rsvp-error-for="guests"] + template[data-rsvp-party]').length, 1);
  assert.equal(tpl('[data-copy="form_party"]').text(), 'Name of guest');
  assert.equal(tpl('input').attr('name'), undefined);
  assert.equal(tpl('input').attr('maxlength'), '120');
  assert.equal(tpl('[data-rsvp-error-for="party"]').length, 1);
  assert.match(css(), /html\[data-rsvp-replied\] \.closing \.title/);
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
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 4, 'with replies on: hero, invitation, row and nav link to the RSVP page');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments, parts decorative', () => {
  assert.match(css(), /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(css(), /\.ph-mark \{ display: none; \}/);
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Giulia & Matteo');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'First pour');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Tenuta del Sole');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record

test('17 schedule of 1, 6 and 10 rows, long names, en-GB and the docs/11 §12 records render without warnings', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
    assert.equal(render('home', c).$('.r-day .sched-line').length, n, 'all rows in the source; CSS shows the first 4');
  }
  assert.match(css(), /\.sched-line:nth-child\(n\+5\) \{ display: none; \}/);
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & Matteo';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '25 September 2027');
  assert.equal(render('details', gb).$('.sched-row .time').first().text(), '4:00 pm');
  for (const [name, rec] of [['stress', stressRecord(demo())], ['range', rangeRecord(demo())]] as const) {
    assert.ok(validateContent(rec).ok, JSON.stringify(validateContent(rec).errors));
    for (const page of PAGES) {
      const { $, warnings } = render(page, rec);
      assert.deepEqual(warnings, [], `${name} ${page}`);
      assertFieldsMatch($, rec, page);
    }
  }
  assert.equal(render('details', stressRecord(demo())).$('.sched-row').length, 10);
  // the long-name fit is in site.js (fitNames → --names-scale), the CSS uses the variable; the card copy drops lines
  assert.match(js(), /--names-scale/);
  assert.match(css(), /var\(--names-scale, 1\)/);
  assert.match(js(), /for \(const d of \['', 'c', 's', 'c d', 's c d'\]\)/);
  // Italianno + Marcellus (the catalogue pair) both ship latin-ext (accented names, docs/11 §12); display=swap
  const href = render('index').$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
  assert.equal(href, 'https://fonts.googleapis.com/css2?family=Italianno&family=Marcellus&display=swap');
  // Marcellus has no italic or bold: no synthetic slant/bold anywhere
  assert.match(rule('body'), /font-synthesis: none/);
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the estate?', a: 'Yes, by the cellar.\nThe gate opens at 3:00 PM.' },
    { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only celebration.' },
  ];
  c.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] },
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
    assert.equal(google.searchParams.get('dates'), '20270925T140000Z/20270925T183000Z', `${page}: 4 PM CEST to two hours after the reception`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal a[data-calendar="google"]').attr('target'), '_blank');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  assert.equal(render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$('a[data-calendar="ics"]').attr('href'),
    `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demo();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  assert.match(js(), /'home-invite':[^\n]*\['cal', \d+\]/);
  assert.match(js(), /'details-card':[^\n]*\['cal', \d+\]/);
});

test('19 G051 questions & answers: a native accordion on the details page, in order, only while the block is on', () => {
  const c = g051Content();
  const { $, warnings } = render('details', c);
  assert.deepEqual(warnings, []);
  const items = $('.faq-sec details.faq-item');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the estate?', 'Can we bring our children?']);
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
  assert.match(css(), /\.faq-a \{[^}]*white-space: pre-line/);
  assert.match(css(), /\.faq-item summary::after \{ content: "\+"; content: "\+" \/ ""/, 'the "+" sign stays out of the accessible name');
  assert.match(css(), /\.faq-item summary \{[^}]*min-height: 52px/);
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
  assert.deepEqual(meal.find('input[type="radio"]').map((_, el) => $(el).attr('value')).get(), ['Chicken', 'Fish', 'Vegetarian']);
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
  c.partners[0] = { display_name: 'Giulia', full_name: null };
  c.partners[1] = { display_name: 'Matteo', full_name: 'Matteo Luca' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Giulia', 'Matteo Luca']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Giulia Rosa', 'Matteo Luca']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const all = rules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo|name|city)|\.vrow|\.mini-|\.card(?!-tie)|\.frame|\.wl|\.v-|\.table|\.dress|\.rest|\.closure/;
  let checked = 0;
  for (const [, sel, body] of all) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 30, `${checked} content-block rules checked`);
  assert.ok(all.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  const c = css().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(c, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // the only gradients: borderless light (paper light, the sunset glow over the backdrop), the nav's soft ground, and the
  // alpha masks that fade a GPT part into the paper (hero sky, the oak table's long edges, the hills, a corner's last rows)
  for (const [, sel, body] of all) {
    if (!/gradient\(/.test(body)) continue;
    const s = sel.trim();
    if (/^(body::before|\.scene-bg::after|\.site-nav)$/.test(s)) continue;
    assert.match(s, /^(\.hero-bg picture|\.table::before|\.vista|\.hero \.corner-br, \.page-corner\.corner-br)$/, `${s}: gradient only as a fade mask`);
    assert.ok([...body.matchAll(/gradient\(/g)].length === [...body.matchAll(/mask(-image)?:\s*linear-gradient\(/g)].length, `${s}: every gradient is a mask`);
  }
  // the hills band and the table are the GPT images (sky crop, oak_tile), never painted colour bands
  assert.match(rule('.vista'), /url\("img\/sky-460\.webp"\)/);
  assert.match(rule('.table::before'), /oak_tile-640\.webp/);
});

// ---------------------------------------------------------------- envelope: build geometry, layers, closure, motion

test('envelope (docs/11 §7.1/§7.3 kapak, wrapped closure): layers from the build, twine clipped to the envelope, card path, opening sentence', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.cuts.cflap.method, 'renk', 'flap edge found in the image (below the printed vine border)');
  assert.ok(st.cuts.cflap.line_score.every((s: number) => s >= 30), `flap edge lines ${st.cuts.cflap.line_score}`);
  assert.ok(st.cuts.cflap.edge_minus_v_px.every((d: number) => Math.abs(d) <= 6), 'the traced edge stays on the fitted V');
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  // the measured correction of the open envelope (kit_check: bottom −1.82 %) is applied and recorded
  assert.ok(Math.abs(st.align.open_scale[1] - 1) < 0.02 && Math.abs(st.align.open_offset_px[1]) > 5, JSON.stringify(st.align));
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.ok(MANIFEST.closure.clipped_to_envelope_px > 0, 'twine ends clipped at the envelope outline');
  const c = css();
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket']) {
    const [, top, , h] = st.parts[k];
    assert.ok(c.includes(`top: ${pct(top)}%`) && c.includes(`height: ${pct(h)}%`), `${k}: stage percentages from the manifest`);
  }
  const [cx, cy, cw, ch] = st.parts.closure;
  assert.match(rule('.closure-wrap'), new RegExp(`top: ${cy}%; width: 100%; height: ${ch}%`), 'the twine wrapper = the envelope box');
  assert.match(rule('.env .closure'), new RegExp(`left: ${cx}%; top: 0; width: ${cw}%`));
  const [kx, ky, kw] = st.parts.card;
  assert.match(rule('.env .card'), new RegExp(`left: ${kx}%; top: ${ky}%; width: ${kw}%`));
  assert.ok(c.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  const hinge = ((st.hinge_pct - st.parts.env_cflap[1]) / st.parts.env_cflap[3]) * 100;
  assert.match(rule('.env-cflap'), new RegExp(`transform-origin: 50% ${pct(Number(hinge.toFixed(3)))}%`), `hinge ${hinge}`);
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure-wrap'], 'layer order bottom → top');
  assert.equal($('.closure-wrap > img.closure[src*="img/closure-"]').length, 1);
  const s = js();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(s, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  // the sentence: the twine unwinds upward (first, < 250 ms) → the flap opens → the card rises as a vine tendril curls in
  const num = (k: string) => (/\[(\d+), (\d+)\]/.exec(new RegExp(`\\n\\s+${k}:\\s+(\\[\\d+, \\d+\\])`).exec(s)![1])!.slice(1).map(Number));
  const E = Object.fromEntries(['closure', 'lift', 'flap', 'rise', 'forward'].map((k) => [k, num(k)]));
  assert.ok(E.closure[0] <= 250, 'the twine moves at once');
  assert.ok(E.lift[0] > E.closure[0] + 0.6 * E.closure[1], 'the flap opens once the twine is (mostly) off');
  assert.ok(E.flap[0] >= E.lift[0] + E.lift[1] - 10 && E.rise[0] > E.flap[0] && E.forward[0] >= E.rise[0] + E.rise[1] - 10);
  const accentsAt = Number(/\n\s+accents:\s+(\d+)/.exec(s)![1]);
  assert.ok(Math.abs(accentsAt - E.rise[0]) <= 300, 'the tendril curls in as the card rises');
  assert.match(s, /open:\s+\[\{ file: 'img\/accent_2-200\.webp', count: 1, path: 'curl'/, 'one vine leaf with its tendril (accent_2)');
  assert.match(s, /A\(el\.closure, \[[\s\S]*?clipPath: 'inset\(0 0 \d+% 0\)'/, 'the lower strand gathers up (clip from below)');
  assert.match(s, /A\(el\.cflap, \[/);
  const go = Number(/go:\s+(\d+)/.exec(s)![1]);
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6)`);
  assert.match(s, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(s, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(c.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.out_translate_pct <= -86, `out ${st.card_path.out_translate_pct}`);
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
});

test('card morph, replay, backdrop: the envelope card lands on a visible home card; phone backdrop from parts', () => {
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(css(), /\.hero-card \{ view-transition-name: invite-card; \}/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(css(), /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  assert.match(js(), /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  assert.match(js(), /reset\(\); state = 'done'; go\(false\);/);
  assert.equal((css().match(/view-transition-name: invite-card/g) ?? []).length, 2, 'index .env .card + home .hero-card');
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('.card').length, 1, `${page}: one card with the transition name`);
    const tl = $('.scene-bg img.corner-tl'), br = $('.scene-bg img.corner-br');
    assert.equal(tl.length, 1, `${page}: decor_tl layer`);
    assert.equal(br.length, 1, `${page}: decor_br layer`);
    for (const k of [tl, br]) {
      assert.equal(k.attr('loading'), undefined, `${page}: the corner is in the first view (no lazy)`);
      assert.match(k.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/);
    }
    // phones: the sky-and-hills crop of bg_page (no cluster in it), landscape: the soft page
    assert.equal($('.scene-bg img.scene-img').attr('src'), `/themes/${ID}/img/sky-460.webp`);
    assert.equal($('.scene-bg source').attr('srcset'), `/themes/${ID}/img/mist-640.webp`);
  }
  assert.deepEqual(MANIFEST.sky.crop_x0y0x1y1, [0, 660, 460, 1536]);
  assert.ok(MANIFEST.sky.horizon_pct > 55 && MANIFEST.sky.horizon_pct < 72, `horizon ${MANIFEST.sky.horizon_pct}`);
});

test('story (W1.3): wine labels laid on the oak table — one scene, set down one by one, windows ≥ 38vw, fruit beside them', () => {
  const { $ } = render('story');
  assert.equal($('.table[data-scene="story-table"]').length, 1);
  assert.deepEqual($('.table .wl .frame').map((_, el) => $(el).attr('data-step')).get(), ['label', 'label', 'label']);
  assert.deepEqual($('.table .wl .frame').map((_, el) => $(el).attr('data-a')).get(), ['place', 'place', 'place']);
  assert.deepEqual($('.table .wl .frame').map((_, el) => $(el).attr('data-i')).get(), ['0', '1', '2']);
  assert.deepEqual($('.table img.rest').map((_, el) => /img\/(accent_\d)-/.exec($(el).attr('src')!)![1]).get(), ['accent_1', 'accent_3', 'accent_2'], 'grapes, olive leaf, vine leaf');
  const cw = Number(/\.wl \{ position: relative; width: min\((\d+)vw/.exec(css())![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(cw * win >= 38, `phone photo window ${(cw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(css(), /@media \(min-width: 720px\) \{\s*\.table \{ flex-direction: row;/, 'wide: side by side as drawn');
  assert.match(rule('.table'), /overflow-x: clip/, 'resting fruit never widens the page');
  assert.match(js(), /'story-table':\s+\[\['label', 0\], \['caption', \d+\], \['rest', \d+\]\]/);
});

test('size budget and small text: site.js ≤ 35 KB, site.css ≤ 45 KB; card copy, labels and cues ≥ 11 px; clean placeholders', () => {
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
  for (const sel of ['.card-copy .kicker', '.cd-lbl', '.cue', '.invite-text .host', '.dateblock .wd', '.sched-row .time', '.kicker', '.site-nav a']) {
    const b = rule(sel);
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(b) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(b) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(b) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(b);
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  for (const key of Object.keys(theme.manifest.photos)) assert.ok(MANIFEST[`ph_${key}`].min_lum >= 175, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
});

// ---------------------------------------------------------------- 13: site.js contract

test('13 site.js: reads #site-data, navigates with the page map, per-site session keys = <head> scripts, DEV_CONTENT = demo', () => {
  const s = js();
  assert.match(s, /getElementById\('site-data'\)/);
  assert.match(s, /location\.href = PAGES\.home/);
  assert.match(s, /l\.href = PAGES\.home/, 'prefetch uses the page map');
  assert.doesNotMatch(s, /location\.href\s*=\s*['"]/, 'no literal navigation target');
  assert.doesNotMatch(s, /innerHTML|eval\(|new Function/);
  assert.match(s, /a\[data-url-missing\]/);
  assert.match(s, /countdown_target_utc/);
  const literals = s.match(/'[a-z]+\.html'/g) ?? [];
  assert.deepEqual(literals, ["'index.html'", "'home.html'", "'story.html'", "'details.html'", "'rsvp.html'"], 'only the dev fallback page map');
  assert.match(s, /const PAGES = \(SITE && SITE\.pages\) \|\|/);
  assert.match(s, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(s, /const KEY = SITE && SITE\.slug \? ':' \+ SITE\.slug : ''/);
  const index = readFileSync(path.join(DIR, 'index.html'), 'utf8');
  assert.match(index, /'invite:opened'\+k/);
  assert.match(readFileSync(path.join(DIR, 'home.html'), 'utf8'), /'invite:arrive'\+k/);
  const sr = cheerio.load(index)('script[type="speculationrules"]').text();
  assert.doesNotMatch(sr, /\.html|"urls"/);
  assert.match(sr, /"selector_matches":"a\[data-enter\]"/);
  const devSrc = /const DEV_CONTENT = (\{[\s\S]*?\n\});/.exec(s)![1];
  const dev = new Function(`return (${devSrc});`)();
  assert.deepEqual(dev, demo());
  const map = new Function(`return (${/const PHOTO_SOURCES = (\{[^}]+\})/.exec(s)![1]});`)();
  assert.deepEqual(map, Object.fromEntries(Object.entries(theme.manifest.photos).map(([k, p]) => [k, p.source])));
  assert.match(s, /devRender[\s\S]*d\.if\.trim\(\)\.split\(\/\\s\+\/\)/, 'devRender reads several conditions (G075)');
});

// ---------------------------------------------------------------- 24: G068 copy (docs/11 §3.7)

test('24 G068: theme.json copy = the templates, no unmarked visible text, standard keys only, every key at its max renders', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGE_NAMES) pages[p] = (await readThemePage(theme, p)) ?? undefined;
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], `run node scripts/copy-manifest.ts --theme ${ID}`);
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy!);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const k of ['envelope_kicker', 'card_line', 'invite_request', 'rsvp_title', 'rsvp_by', 'story_title', 'day_title', 'schedule_title', 'nav_home', 'nav_rsvp', 'form_send', 'rsvp_closed_title', 'ty_kicker', 'form_party'])
    assert.ok(theme.manifest.copy![k], k);
  for (const [k, e] of Object.entries(theme.manifest.copy!)) assert.ok([...e.default].length <= e.max && e.max <= COPY_MAX_CEILING, k);
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy!);
  for (const page of PAGE_NAMES) {
    const html = (await readThemePage(theme, page))!;
    for (const thankYou of [false, true]) {
      const out = renderTemplate({ html, content: c, theme: theme.manifest, page, slug: 'stress', previewKey: thankYou ? 'k' : null, thankYouPreview: thankYou });
      assert.deepEqual(out.warnings, [], `${page}`);
      if (out.disabled) continue;
      const $ = cheerio.load(out.html);
      $('[data-copy]').each((_, el) => assert.equal($(el).text(), c.copy![$(el).attr('data-copy')!], `${page} ${$(el).attr('data-copy')}`));
    }
  }
  const story = cheerio.load(render('story', { ...demo(), copy: { story_title: 'How we met' } }).html);
  assert.equal(story('title').text().split(' · ')[0], 'How we met');
  const rsvp = cheerio.load(render('rsvp', { ...demo(), copy: { form_party: 'Guest name', form_optional: '(if you like)' } }).html);
  assert.equal(rsvp('[data-copy="form_party"]').text(), 'Guest name');
  assert.equal(rsvp('[data-copy="form_optional"]').length, 3);
});

// ---------------------------------------------------------------- G075: thank-you version (docs/11 §3.6)

test('G075 thank-you mode — envelope card, home thank-you card, honest closed RSVP, the Day page kept or hidden', async () => {
  assert.deepEqual(thankYouSupport(Object.fromEntries(PAGES.map((p) => [p, readFileSync(path.join(DIR, `${p}.html`), 'utf8')]))),
    { complete: true, partial: false, missing: [] });
  const after = { now: new Date('2027-10-15') };
  const navLabels = ($: cheerio.CheerioAPI) => $('.site-nav li').map((_, li) => $(li).text().trim()).get();
  const c = demo();
  c.media.hero_portrait = '/media/11111111-2222-3333-4444-555555555555/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200w.jpg';
  c.thank_you = { message: 'Thank you <b>all</b>!\nSecond line.', photo: '/media/11111111-2222-3333-4444-555555555555/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-1200w.jpg' };
  const idx = render('index', c, after);
  assert.deepEqual(idx.warnings, []);
  assert.equal(idx.$('html').attr('data-thank-you'), '');
  assert.match(idx.$('.env-head .kicker').text(), /With love and thanks/);
  assert.equal(idx.$('.card-copy [data-field="thank_you_title"]').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(idx.$('.card-copy [data-field="venue.city_region"]').length, 0);
  assert.equal(idx.$('.card [data-slot="hero_portrait"] img.ty-photo').attr('src'), c.thank_you.photo);
  assert.equal(idx.$('.ty-decor').length, 0);
  assert.ok(!idx.html.includes('aaaaaaaa') && !/ph_hero_portrait/.test(idx.$('.card').html() ?? ''));
  assert.equal(idx.$('.stage').length, 1, 'the envelope still opens');
  assert.equal(idx.$('link[href$="/thank-you.css"]').length, 1);
  const plain = structuredClone(c);
  delete plain.thank_you!.photo;
  const idx2 = render('index', plain, after);
  assert.equal(idx2.$('.card .ty-decor img[src*="img/closure-"]').length, 1, 'without a photo: the paper and the twine tie');
  assert.ok(!/ph_hero_portrait/.test(idx2.$('.card').html() ?? ''));
  const home = render('home', c, after);
  assert.deepEqual(home.warnings, []);
  assert.equal(home.$('[data-countdown]').length, 0);
  assert.equal(home.$('a[href*="/rsvp"]').length, 0);
  assert.equal(home.$('[data-calendar]').length, 0);
  assert.equal(home.$('#invitation').length, 0);
  assert.equal(home.$('#thank-you #ty-head').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(home.$('#thank-you [data-field="thank_you.message"]').text(), 'Thank you <b>all</b>!\nSecond line.');
  assert.deepEqual(navLabels(home.$), ['Home', 'Story', 'The Day']);
  const dc = structuredClone(c);
  dc.urls = { ...dc.urls, registry: 'https://registry.example.org/x', accommodation: 'https://hotel.example.org/y' };
  dc.optional_blocks = { ...dc.optional_blocks, registry: true, travel_stay: true, faq: true, dress_code: true };
  dc.faq = [{ q: 'Parking?', a: 'Yes.' }];
  const det = render('details', dc, after);
  assert.deepEqual(det.warnings, []);
  assert.equal(det.$('[data-calendar]').length, 0);
  assert.ok(!det.html.includes('Garden formal') && !det.html.includes('hotel.example.org') && !det.html.includes('Parking?'));
  assert.ok(det.html.includes('registry.example.org'));
  assert.match(det.$('p.note').text(), /The ceremony began at/);
  const hidden = structuredClone(c);
  hidden.thank_you = { ...hidden.thank_you, details: 'hide' };
  assert.equal(render('details', hidden, after).disabled, true);
  for (const p of ['home', 'story', 'rsvp'] as PageName[]) assert.equal(render(p, hidden, after).$('a[href$="/details"]').length, 0, p);
  const rsvp = render('rsvp', c, after);
  assert.equal(rsvp.$('form').length, 0);
  assert.equal(rsvp.$('h1').text().trim(), 'Replies are closed');
  assert.ok(rsvp.$(`a[href="/${SLUG}/home"]`).length >= 1);
  // before the wedding nothing of it is in the source
  const before = demo();
  before.thank_you = { title: 'PRIVATE-TITLE', message: 'PRIVATE-MESSAGE', photo: '/media/site/cccccccccccccccccccccccccccccccc-1200w.jpg' };
  for (const p of PAGES) assert.ok(!render(p, before).html.includes('PRIVATE-') && !render(p, before).html.includes('thank-you.css'), p);
  for (const m of readFileSync(path.join(DIR, 'thank-you.css'), 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) assert.ok(existsSync(path.join(DIR, m[1])), m[1]);
});

// ---------------------------------------------------------------- 14–15: real routes, privacy

test('14 routes: a published site on this theme serves 200 pages with CSP hashes, the uploaded photo and theme assets', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getAsset } = await import('../app/themes/[theme]/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-tv', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-tv'), { params: Promise.resolve({ slug: 'maren-and-theo-tv' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  // index: the early state script, the deferred opening parts (G180) and the speculation rules
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 3, 'inline state script + deferred parts + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/tuscan-vineyard\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Giulia & Matteo wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-tv/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-tv', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'env_cflap-880.webp'], ['img', 'closure-321.webp'], ['img', 'oak_tile-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-tv' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-tv'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-tv', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.10' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-vineyard-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-vineyard-site/story'), { params: Promise.resolve({ slug: 'quiet-vineyard-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-vineyard-site'), { params: Promise.resolve({ slug: 'quiet-vineyard-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-vineyard-site/${page}`), { params: Promise.resolve({ slug: 'quiet-vineyard-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
