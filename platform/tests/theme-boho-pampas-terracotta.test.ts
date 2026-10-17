// Theme platform/themes/boho-pampas-terracotta (design 11 · Boho Pampas Terracotta, task G411) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json), the copy manifest (G068), thank-you mode (G075) and the site.js contract. Browser checks
// (widths, short phones, opening flow, stress record, weight, video) live in scripts/theme-check.cjs --theme
// boho-pampas-terracotta; G051 in the browser in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { STANDARD_COPY } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { listThemes, loadTheme, PAGE_NAMES, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'boho-pampas-terracotta';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/11_Boho_Pampas/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'luna-and-river';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-bpt-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/11_Boho_Pampas/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string; thankYouPreview?: boolean; now?: Date } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
  return { ...result, $: cheerio.load(result.html) };
}
const cssText = () => readFileSync(path.join(DIR, 'site.css'), 'utf8');
const jsText = () => readFileSync(path.join(DIR, 'site.js'), 'utf8');
const rulesOf = (css: string) => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const rule = (css: string, sel: string) => rulesOf(css).filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');

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
  assert.equal(theme.manifest.name, 'Boho Pampas Terracotta');
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

test('2 every theme file referenced by the pages, site.css, thank-you.css and site.js exists; share image + icon; folder ≤ 3 MB, no sources', () => {
  const refs = new Set<string>();
  for (const page of PAGES) {
    for (const ty of [false, true]) {
      const { $ } = render(page, demo(), ty ? { previewKey: 'k'.repeat(20), thankYouPreview: true } : {});
      $('[src], [href], [srcset]').each((_, el) => {
        const a = (el as unknown as { attribs: Record<string, string> }).attribs;
        for (const v of [a.src, a.href, ...(a.srcset ? a.srcset.split(',').map((c) => c.trim().split(/\s+/)[0]) : [])]) {
          if (v && v.startsWith(`/themes/${ID}/`)) refs.add(v.slice(`/themes/${ID}/`.length).replace(/\?.*$/, ''));
        }
      });
    }
  }
  for (const f of ['site.css', 'thank-you.css']) {
    for (const m of readFileSync(path.join(DIR, f), 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  }
  for (const m of jsText().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', '__pycache__']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  // G153: the colour palettes' images (img/variants/) are not part of the design's own budget (docs/25 §4)
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .filter((e) => !(e.isDirectory() && e.name === 'variants' && path.basename(d) === 'img'))
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // only files the theme uses are in img/ (no leftover parts)
  const files = readdirSync(path.join(DIR, 'img')).filter((f) => f !== 'manifest.json' && f !== 'variants');
  const unused = files.filter((f) => ![...refs].some((r) => r.endsWith(f)) && !/^(og-1200x630\.jpg|favicon\.png)$/.test(f) && !/-(\d+)\.webp$/.test(f));
  assert.deepEqual(unused, [], 'unused images');
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
  assert.ok(claim, `/start?theme=${ID} works`);
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Luna');
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
  }
  assert.ok(fields > 50, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Luna & River · April 17, 2027');
  assert.equal(index('h1').text(), 'Luna & River');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, April 17, 2027 · Joshua Tree, California");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Luna & River');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Luna & River');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Desert Garden', 'The Adobe Patio', 'The Starlight Pavilion']);
  assert.equal(details('.venue-name').text(), 'Desert Bloom Ranch');
  assert.equal(details('.dress em').text(), 'Boho chic');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'April', '17', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-date').text().replace(/\s+/g, ' ').trim(), 'Saturday · April 17, 2027');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('.deadline').first().text(), 'March 6, 2027');
});

test('4 no personal text is hard-coded in the templates, the stylesheets or site.js outside DEV_CONTENT', () => {
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
  for (const f of ['site.css', 'thank-you.css']) assert.deepEqual(personal.filter((s) => readFileSync(path.join(DIR, f), 'utf8').includes(s)), [], f);
  const js = jsText().replace(/const DEV_CONTENT = \{[\s\S]*?\n\};/, '');
  assert.deepEqual(personal.filter((s) => js.includes(s)), [], 'site.js outside DEV_CONTENT');
  // W1 comp demo text is a layout reference only (the comps show the same demo couple: nothing from them is typed in)
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Luna|River|Desert Bloom|Joshua Tree|Boho chic|186/);
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
    assert.ok(!/Luna|River|Desert Bloom|Joshua|California|Desert Garden/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy .kicker').last().text(), 'Bath', 'city without region: no stray comma');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('p[data-if="ceremony_time !thank_you_on"]').text(), 'The ceremony begins at 3:30 PM.');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.t-day .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').first().text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Wide skies, open roads and a few wild-hearted adventures carried us to April 17, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /carried us to 17 April 2027\.$/);
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
  const css = cssText();
  for (const m of ['card', 'portrait', 'landscape']) assert.match(css, new RegExp(`\\.mask-${m} \\{[^}]*url\\("img/mask_${m}\\.png"\\)`));
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /\.photo-slot[^{]*\{[^}]*border-radius/, 'no CSS window shape');
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
  assert.equal(home('.tile').length, 2, 'no story tile');
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
  c.urls.map = 'https://maps.example.org/?q=ranch';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=ranch');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
  assert.equal(a.text(), 'View map');
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
  // G069: the guest-name row right after "Number of guests", in the form's own field style
  const raw = readFileSync(path.join(DIR, 'rsvp.html'), 'utf8');
  const tpl = cheerio.load(raw)('template[data-rsvp-party]');
  assert.equal(tpl.length, 1);
  assert.match(raw, /name="guests"[\s\S]*?<p class="field-error" data-rsvp-error-for="guests"><\/p>\s*<!--[\s\S]*?-->\s*<template data-rsvp-party>/);
  const inner = cheerio.load(tpl.html()!);
  assert.equal(inner('label.field [data-copy="form_party"]').text(), 'Name of guest');
  assert.equal(inner('[data-rsvp-party-number]').length, 1);
  assert.equal(inner('input:not([name])').attr('maxlength'), '120');
  assert.equal(inner('[data-rsvp-error-for="party"]').length, 1);
  assert.match(cssText(), /html\[data-rsvp-replied\] \.closing \.title/);
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
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 4, 'with replies on: hero, invitation, tile and nav link to the RSVP page');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments, decorative parts alt=""', () => {
  const css = cssText();
  assert.match(css, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(css, /\.ph-mark \{ display: none; \}/);
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Luna & River');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Where it began');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Desert Bloom Ranch');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record, fonts

test('17 schedule of 1, 6 and 10 rows, long names, en-GB and the docs/11 §12 records render without warnings; fonts', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
    assert.equal(render('home', c).$('.t-day .sched-line').length, n, 'all rows in the source; CSS shows the first 4');
  }
  assert.match(cssText(), /\.sched-line:nth-child\(n\+5\) \{ display: none; \}/);
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & River';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '17 April 2027');
  assert.equal(render('details', gb).$('.sched-row .time').first().text(), '4:00 pm');
  for (const [label, rec] of [['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
    assert.ok(validateContent(rec).ok, JSON.stringify(validateContent(rec).errors));
    for (const page of PAGES) {
      const { $, warnings } = render(page, rec);
      assert.deepEqual(warnings, [], `${label} ${page}`);
      assertFieldsMatch($, rec, page);
    }
  }
  assert.equal(render('details', stressRecord(demo())).$('.sched-row').length, 10);
  // the long-name fit is in site.js (fitNames → --names-scale), the CSS uses the variable
  assert.match(jsText(), /--names-scale/);
  assert.match(cssText(), /var\(--names-scale, 1\)/);
  // the catalogue pair: Sacramento (latin + latin-ext: accented names) + Josefin Slab (latin), display=swap, two families
  const href = render('index').$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
  assert.equal(href, 'https://fonts.googleapis.com/css2?family=Josefin+Slab:ital,wght@0,400;0,600;1,400;1,600&family=Sacramento&display=swap');
  for (const page of PAGES) assert.equal(render(page).$('link[href^="https://fonts.googleapis.com/css2"]').attr('href'), href, page);
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the ranch?', a: 'Yes, free parking by the gate.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20270417T230000Z/20270418T033000Z', `${page}: 4 PM PDT to two hours after the reception`);
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
  // ≥ 44 px buttons
  assert.match(rule(cssText(), '.btn-sm'), /min-height: 44px/);
});

test('19 G051 questions & answers: a native accordion on the details page, in order, only while the block is on', () => {
  const c = g051Content();
  const { $, warnings } = render('details', c);
  assert.deepEqual(warnings, []);
  const items = $('.faq-sec details.faq-item');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the ranch?', 'Can we bring our children?']);
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
  c.partners[0] = { display_name: 'Luna', full_name: null };
  c.partners[1] = { display_name: 'River', full_name: 'River Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Luna', 'River Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Luna Grace', 'River James']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = rulesOf(css);
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo)|\.tile|\.card(?!-tie)|\.frame|\.arch|\.mini-|\.day-mini/;
  let checked = 0;
  for (const [, sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 20, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  assert.doesNotMatch(css, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // the only gradients: borderless light (body haze), the hero paper fade mask, the nav's soft ground (docs/11 §5.7) and
  // the rainbow reveal (a circle clip over the GPT frame)
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.hero-bg picture|^\s*\.site-nav\s*$/, sel.trim());
  }
  // the one CSS line in the content (dress code) is a single 1 px hairline, as in W1.4 (interface, §5.7)
  assert.match(rule(css, '.dress'), /border-top: 1px solid/);
  assert.doesNotMatch(rule(css, '.dress'), /border-(bottom|left|right)|box-shadow/);
  // the drawn-rainbow preset only clips the GPT frame (clip-path), it draws nothing
  assert.match(css, /\.js \[data-a="rainbow"\] \{[^}]*clip-path: circle\(0% at 50% 100%\)/);
});

// ---------------------------------------------------------------- envelope: build geometry, layers, closure, motion

test('envelope (docs/11 §7.2 "kapak — kemer cep", §7.3): curved cuts from the image, silhouette alignment, layers, closure, motion', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  // both cuts read from the image (no geometric fallback): the arch flap's curved edge, the pocket's arched edge
  assert.equal(st.cuts.cflap.method, 'renk');
  assert.equal(st.cuts.cflap.shape, 'egri');
  assert.ok(st.cuts.cflap.residual_sd <= 3, `flap curve residual ${st.cuts.cflap.residual_sd}`);
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.deepEqual(st.cuts.pocket.warnings, []);
  assert.ok(st.cuts.pocket.residual_px_p50_p90[0] <= 2, `pocket edge residual ${st.cuts.pocket.residual_px_p50_p90}`);
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  // the measured transform: the open pocket's dome sits where the closed one is (top edges within 2 % of the canvas)
  const ha = st.hinge_align;
  assert.ok(Math.abs(ha.top_edge_after_px.open - ha.top_edge_after_px.closed) <= 0.02 * st.canvas[1], JSON.stringify(ha.top_edge_after_px));
  assert.ok(ha.open_scale_y > 0.7 && ha.open_scale_y < 1, `open scale ${ha.open_scale_y}`);
  // the closure: tied to the flap tip with the comp's measured size and offset; it slips off (not carried by the flap)
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.ok(Math.abs(MANIFEST.closure.comp.closure_h_over_env_w - 0.7302) < 0.001);
  const css = cssText();
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) {
    const [left, top, w, h] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`) && css.includes(left === 0 ? 'left: 0;' : `left: ${pct(left)}%`) && css.includes(`width: ${pct(w)}%`), `${k}: stage percentages from the manifest`);
    if (k !== 'card') assert.ok(css.includes(`height: ${pct(h)}%`), `${k}: height`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`transform-origin: 50% ${pct(st.hinge_pct_of_flap)}%`), 'the closed flap turns on its top edge');
  assert.ok(css.includes(`calc(var(--obj) / ${pct(st.closed_obj.frac_w)})`), 'stage width from the closed pocket');
  assert.ok(css.includes(`calc(45svh * ${pct(st.closed_obj.aspect)})`), 'docs/11 §7.1: --obj = min(84vw, 45svh × objAspect, 440px)');
  assert.ok(css.includes(`var(--w) * ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'the stage tucks its upper part under the names');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top (docs/11 §7.2)');
  assert.equal($('.stage .seal-mono').length, 0, 'the tie has no monogram (no empty seal centre in the GPT part)');
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = (k: string) => JSON.parse(new RegExp(`\\n\\s+${k}:\\s+(\\[[^\\]]+\\])`).exec(js)![1]) as [number, number];
  // the sentence's order: the tie slips off (at once, < 250 ms) → the flap folds up → the card slides slowly up
  assert.ok(E('closure')[0] < 250, 'first motion at once');
  assert.ok(E('closure')[0] < E('lift')[0] && E('lift')[0] < E('flap')[0] && E('flap')[0] < E('rise')[0] && E('rise')[0] < E('forward')[0]);
  assert.ok(E('rise')[1] >= 1800, `a slow rise (${E('rise')[1]} ms): "slides slowly up … like a rising sun"`);
  assert.ok(E('lift')[0] + E('lift')[1] <= E('flap')[0] + 40, '90° hand-off: the lined arch takes over when the flap is edge-on');
  // "… while a pampas plume sways in from the side": accent_1 (the plume) × 1, across from a side, swaying
  assert.match(js, /open:\s+\[\{ file: 'img\/accent_1-66\.webp', count: 1, path: 'across', origin: 'left', sway: true/);
  const accentsAt = Number(/\n\s+accents:\s+(\d+)/.exec(js)![1]);
  assert.ok(accentsAt > E('rise')[0] - 200 && accentsAt < E('rise')[0] + E('rise')[1], 'the plume comes while the card rises');
  const go = Number(/go:\s+(\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6)`);
  assert.ok(E('forward')[0] + E('forward')[1] <= go);
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.out_translate_pct <= -86, 'out of the arch: the card clears the pocket');
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower (no drop back)');
  assert.match(js, /A\(el\.closure, \[/, 'the tie moves on its own');
  assert.match(js, /A\(el\.cflap, \[/, 'the flap turns on its own');
});

test('view transitions, replay and reduced motion: the card lands on a visible home card; names unique per page', () => {
  const css = cssText();
  assert.match(rule(css, '.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule(css, '.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(rule(css, '.hero-card'), /view-transition-name:\s*invite-card/);
  assert.doesNotMatch(rule(css, '.env .card'), /view-transition-name/);
  assert.match(css, /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  assert.equal((css.match(/view-transition-name: invite-card/g) ?? []).length, 2, 'index .env .card + home .hero-card');
  assert.match(css, /@view-transition \{ navigation: auto; \}/);
  assert.match(rule(css, '.site-nav'), /view-transition-name: site-nav/);
  const js = jsText();
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule(css, '.is-opened .env-hint'), /display:\s*none/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(js, /if \(reduce \|\| !Element\.prototype\.animate\) \{ go\(false\); return; \}/, 'reduced motion: straight to home');
  assert.match(js, /e\.persisted && state !== 'closed'/, 'bfcache return: opened, no trap');
  const red = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/.exec(css)![1];
  assert.match(red, /scroll-behavior: auto/);
  assert.match(red, /\.js \[data-step\] \{ opacity: 1 !important;/);
  assert.match(red, /animation: none !important/);
});

test('story (W1.3): three arch frames, the middle tallest; phones step them down with windows ≥ 38vw; the rainbow reveal', () => {
  const { $ } = render('story');
  assert.equal($('.arches[data-scene="story-arches"]').length, 1, 'one scene: the arches open together');
  assert.deepEqual($('.arches .frame').map((_, el) => $(el).attr('data-step')).get(), ['side', 'mid', 'side']);
  assert.deepEqual($('.arches .frame').map((_, el) => $(el).attr('data-a')).get(), ['rainbow', 'rainbow', 'rainbow']);
  const css = cssText();
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  for (const [sel, re] of [['.a-1, .a-3', /grid-template-columns: (\d+)vw/], ['.a-2', /grid-template-columns: minmax\(0, 1fr\) (\d+)vw/]] as const) {
    const vw = Number(re.exec(rule(css, sel))![1]);
    assert.ok(vw * win >= 38, `${sel}: phone photo window ${(vw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  }
  const wide = /@media \(min-width: 720px\) \{([\s\S]*?)\n\}/.exec(css.slice(css.indexOf('page 3 — Our Story')))![1];
  const fw = Number(/\.arch \.frame \{ width: (\d+)px; \}/.exec(wide)![1]);
  const mw = Number(/\.a-2 \.frame \{ order: 0; width: (\d+)px;/.exec(wide)![1]);
  assert.ok(mw > fw, 'wide: the middle arch is the tallest (comp)');
  assert.match(jsText(), /'story-arches':\s+\[\['mid', 0\], \['side', \d+\], \['caption', \d+\]\]/, 'the middle arch first, then its neighbours');
});

test('home first screen and card copy: fold + fit logic, card height from the screen, copy lines drop instead of overflowing', () => {
  const css = cssText();
  const js = jsText();
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor, 'hero names floor in fitNames');
  assert.equal(Number(floor![1]), MANIFEST.theme_check.first_screen.names_min_px);
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(js, /const v = sv\(\), limit = v - nav\.offsetHeight - 8, below = v \+ 12/);
  assert.match(js, /for \(const d of \['', 'c', 's', 'c d', 's c d'\]\) \{ c\.dataset\.drop = d; if \(fits\(c\)\) break; \}/);
  assert.match(css, /\.card-copy\[data-drop~="s"\] \.script, \.card-copy\[data-drop~="d"\] \[data-field="date"\], \.card-copy\[data-drop~="c"\] \[data-field="venue\.city_region"\] \{ display: none; \}/);
  assert.match(rule(css, '.hero-card'), /--ch: clamp\(150px, 100svh - 440px, 350px\)/);
  assert.match(css, /\.hero \.scene-bg \{ position: absolute; z-index: 0; bottom: var\(--fold, 0px\); \}/);
  for (const page of ['index', 'home'] as const) {
    const copy = render(page).$(page === 'index' ? '.env .card .card-copy' : '.hero-card .card-copy');
    assert.equal(copy.find('.script').length, 1);
    assert.equal(copy.find('[data-field="date"]').length, 1);
    assert.equal(copy.find('[data-field="venue.city_region"]').length, 1);
  }
  // small text ≥ 11 px
  for (const sel of ['.card-copy .kicker', '.sched-line .t', '.rsvp-text .wait', '.invite-text .host', '.dateblock .wd']) {
    const fs = /max\((\d+(?:\.\d+)?)px/.exec(rule(css, sel)) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(rule(css, sel));
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: ≥ 11 px`);
  }
  assert.match(rule(css, '.cd-lbl'), /font: 600 11px/);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
  // the clean placeholders: crops of the sand wall without a cluster
  for (const key of Object.keys(theme.manifest.photos)) assert.ok(MANIFEST[`ph_${key}`].min_lum >= 175, `ph_${key}`);
});

// ---------------------------------------------------------------- 24: G068 design copy

test('24 G068: theme.json copy = the templates, no unmarked visible text, standard keys only; every key at its max renders', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGE_NAMES) pages[p] = readFileSync(path.join(DIR, theme.manifest.pages[p]!), 'utf8');
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], `run node scripts/copy-manifest.ts --theme ${ID}`);
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy!);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const [k, e] of Object.entries(theme.manifest.copy!)) assert.ok([...e.default].length <= e.max, k);
  const c = demo();
  c.copy = Object.fromEntries(Object.entries(theme.manifest.copy!).map(([k, e]) => [k, 'Wanderlust'.repeat(40).slice(0, e.max)]));
  for (const page of PAGES) {
    for (const thankYou of [false, true]) {
      const out = render(page, c, thankYou ? { previewKey: 'k'.repeat(20), thankYouPreview: true } : {});
      assert.deepEqual(out.warnings, [], `${page}${thankYou ? ' (thank-you)' : ''}`);
      if (out.disabled) continue;
      out.$('[data-copy]').each((_, el) => assert.equal(out.$(el).text(), c.copy![out.$(el).attr('data-copy')!], `${page} ${out.$(el).attr('data-copy')}`));
    }
  }
  const story = render('story', { ...demo(), copy: { story_title: 'How we met' } }).$;
  assert.equal(story('title').text().split(' · ')[0], 'How we met');
});

// ---------------------------------------------------------------- G075: thank-you mode

test('G075 thank-you mode: envelope card, home thank-you card, honest closed RSVP, the Day page kept or hidden; markers complete', () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  assert.deepEqual(thankYouSupport(pages), { complete: true, partial: false, missing: [] });
  const after = new Date('2027-10-15T12:00:00Z');
  const c = demo();
  c.media.hero_portrait = '/media/11111111-2222-3333-4444-555555555555/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200w.jpg';
  c.thank_you = { message: 'Thank you <b>all</b>!\nSecond line.', photo: '/media/11111111-2222-3333-4444-555555555555/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-1200w.jpg' };
  const idx = render('index', c, { now: after });
  assert.deepEqual(idx.warnings, []);
  assert.equal(idx.$('html').attr('data-thank-you'), '');
  assert.match(idx.$('.env-head .kicker').text(), /With love and thanks/);
  assert.equal(idx.$('.card-copy [data-field="venue.city_region"]').length, 0);
  assert.equal(idx.$('.card [data-slot="hero_portrait"] img.ty-photo').attr('src'), c.thank_you.photo);
  assert.ok(!idx.html.includes('aaaaaaaa'), 'the hero portrait is not on the thank-you card');
  assert.equal(idx.$('link[href$="thank-you.css"]').length, 1);
  const plain = structuredClone(c);
  delete plain.thank_you!.photo;
  const idx2 = render('index', plain, { now: after }).$;
  assert.equal(idx2('.card .ty-decor img[src*="img/closure-"]').length, 1, 'without a photo: the tie on sand paper (GPT part), never a placeholder');
  assert.ok(!/ph_hero_portrait/.test(idx2('.card').html() ?? ''));
  const home = render('home', c, { now: after });
  assert.deepEqual(home.warnings, []);
  assert.equal(home.$('[data-countdown]').length, 0);
  assert.equal(home.$('a[href*="/rsvp"]').length, 0, 'no reply links');
  assert.equal(home.$('[data-calendar]').length, 0);
  assert.equal(home.$('#invitation').length, 0);
  assert.equal(home.$('#thank-you [data-field="thank_you.message"]').text(), 'Thank you <b>all</b>!\nSecond line.');
  assert.ok(!home.html.includes('<b>all</b>'));
  assert.deepEqual(home.$('.site-nav li').map((_, li) => home.$(li).text().trim()).get(), ['Home', 'Story', 'The Day']);
  const rsvp = render('rsvp', c, { now: after });
  assert.equal(rsvp.disabled, false, 'the RSVP page stays for old links');
  assert.equal(rsvp.$('h1').text(), 'Replies are closed');
  assert.equal(rsvp.$('form').length, 0);
  const hide = structuredClone(c);
  hide.thank_you = { ...hide.thank_you, details: 'hide' };
  assert.equal(render('details', hide, { now: after }).disabled, true, 'the couple hid the Day page');
  assert.equal(render('story', hide, { now: after }).$(`a[href="/${SLUG}/home"]`).length >= 1, true);
  const css = readFileSync(path.join(DIR, 'thank-you.css'), 'utf8');
  assert.match(css, /\.ty-message \{[^}]*white-space: pre-line/);
  assert.doesNotMatch(cssText(), /\.ty-(photo|decor|head|message)/, 'thank-you styles only in thank-you.css (site.css budget)');
});

// ---------------------------------------------------------------- 13: site.js contract

test('13 site.js: reads #site-data, navigates with the page map, per-site session keys = <head> scripts, DEV_CONTENT = demo', () => {
  const js = jsText();
  assert.match(js, /getElementById\('site-data'\)/);
  assert.match(js, /location\.href = PAGES\.home/);
  assert.match(js, /l\.href = PAGES\.home/, 'prefetch uses the page map');
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
  assert.doesNotMatch(js, /localStorage|document\.cookie/);
  const rules = cheerio.load(index)('script[type="speculationrules"]').text();
  assert.doesNotMatch(rules, /\.html|"urls"/);
  assert.match(rules, /"selector_matches":"a\[data-enter\]"/);
  const devSrc = /const DEV_CONTENT = (\{[\s\S]*?\n\});/.exec(js)![1];
  const dev = new Function(`return (${devSrc});`)();
  assert.deepEqual(dev, demo());
  const map = new Function(`return (${/const PHOTO_SOURCES = (\{[^}]+\})/.exec(js)![1]});`)();
  assert.deepEqual(map, Object.fromEntries(Object.entries(theme.manifest.photos).map(([k, p]) => [k, p.source])));
  for (const page of ['index', 'home'] as PageName[]) assert.equal(render(page).$('.card').length, 1, `${page}: one card with the transition name`);
});

// ---------------------------------------------------------------- 14–15: real routes, privacy

test('14 routes: a published site on this theme serves 200 pages with CSP hashes, the uploaded photo and theme assets', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getAsset } = await import('../app/themes/[theme]/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-bpt', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-bpt'), { params: Promise.resolve({ slug: 'maren-and-theo-bpt' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', new RegExp(`^https?://[^/]+/themes/${ID}/img/og-1200x630\\.jpg$`), 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Luna & River wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-bpt/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-bpt', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'env_cflap-648.webp'], ['img', 'closure-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-bpt' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-bpt'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-bpt', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.11' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-pampas-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-pampas-site/story'), { params: Promise.resolve({ slug: 'quiet-pampas-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-pampas-site'), { params: Promise.resolve({ slug: 'quiet-pampas-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-pampas-site/${page}`), { params: Promise.resolve({ slug: 'quiet-pampas-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
