// Theme platform/themes/cherry-blossom-spring (design 15 · Cherry Blossom Spring, task G415) — docs/11_TEMA_STANDARDI.md
// §13.2. Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract. Browser checks (widths, short phones, landscape, opening flow, stress
// record, weight, video) live in scripts/theme-check.cjs --theme cherry-blossom-spring; G051 in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { STANDARD_COPY, stressCopy } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'cherry-blossom-spring';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/15_Cherry_Blossom/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'hana-and-ethan';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
const DEMO_TEXT = /Hana|Ethan|Blossom Hill|Washington|Blossom Walk|Pavilion Terrace|Garden Hall/;
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-cb-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/15_Cherry_Blossom/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string; thankYouPreview?: boolean } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
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
    if (el.tagName === 'img' || field.startsWith('urls.')) return;
    assert.equal($(el).text(), expected(content, field, $(el).attr('data-format') ?? ''), `${page}: ${field}`);
    n++;
  });
  return n;
}

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

// G158: the palette build (tools/recolor_parts.py) writes a fixed colour as rgb(var(--c-rrggbb)/a) or #rrggbbaa; read both as rgba()
const asRgba = (css: string): string => css
  .replace(/rgb\(var\(--c-([0-9a-f]{6})\)\s*\/\s*(\d*\.?\d+)\)/gi, (_, h: string, a: string) => `rgba(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ')}, ${a})`)
  .replace(/#([0-9a-f]{6})([0-9a-f]{2})\b/gi, (_, h: string, a: string) => `rgba(${[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ')}, ${parseInt(a, 16) === 0 ? '0' : `.${String(Math.round((parseInt(a, 16) / 255) * 100)).padStart(2, '0')}`})`);

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Cherry Blossom Spring');
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
  assert.equal(MANIFEST.og.align, 'alt');
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', '__pycache__']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  // G158: the colour palettes' images (img/variants/) are not part of the design's own budget (docs/25 §4)
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .filter((e) => !(e.isDirectory() && e.name === 'variants' && path.basename(d) === 'img'))
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // docs/11 §6: a first-view WebP ≤ 200 KB, a lazy / wide-screen one ≤ 250 KB
  for (const f of readdirSync(path.join(DIR, 'img')).filter((n) => n.endsWith('.webp'))) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 200 * 1024, `${f}: ${statSync(path.join(DIR, 'img', f)).size} B`);
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
  assert.ok(claim, '/start?theme=cherry-blossom-spring works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Hana');
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
  assert.equal(index('title').text(), 'Hana & Ethan · April 3, 2027');
  assert.equal(index('h1').text(), 'Hana & Ethan');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, April 3, 2027 · Washington, D.C.");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'April 3, 2027 · Washington', 'card: date · town (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Hana & Ethan');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Hana & Ethan');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Blossom Walk', 'The Pavilion Terrace', 'The Garden Hall']);
  assert.equal(details('.venue-place').text(), 'Washington, D.C., USA');
  const home = render('home', content).$;
  assert.deepEqual(['.dline .mon', '.dline .day', '.dline .yr', '.wd'].map((sel) => home(`.dateblock ${sel}`).text()), ['April', '3', '2027', 'Saturday · at 4:00 PM']);
  assert.equal(home('.hero-city').text(), 'Washington, D.C.', 'W1.2: town, region');
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
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), DEMO_TEXT);
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
    assert.ok(!DEMO_TEXT.test($('body').text() + $('title').text()), `${page}: old demo text left`);
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
  assert.equal(home('.hero-city').text(), 'Bath');
  assert.equal(home('.dateblock .wd').text(), 'Saturday · at 3:30 PM');
  const noTime = demo();
  noTime.ceremony_time = null as unknown as string;
  assert.equal(render('home', noTime).$('.dateblock .wd').text(), 'Saturday', 'no time: no "· at"');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Like the first blossoms of spring, our story unfolded slowly and led us to April 3, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /led us to 3 April 2027\.$/);
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
  assert.equal(home('.tz-link').length, 1, 'only the venue frame (The Day) stays');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Spring formal');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=gardens';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=gardens');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
});

test('9 RSVP page follows the platform form contract (G042, G069): fields by name, method post, state panels, form.js', () => {
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
  assert.equal($('a[href="#reply"]').text(), 'RSVP', 'the pill\'s accessible text (its blossoms are decorative)');
  assert.equal($('#reply').length, 1);
  assert.match(cssText(), /html\[data-rsvp-replied\] \.closing \.title/);
  // G069 (G084 pattern): the guest-names row right after "Number of guests", in the form's own field style
  const raw = cheerio.load(readFileSync(path.join(DIR, 'rsvp.html'), 'utf8'));
  const tpl = raw('template[data-rsvp-party]');
  assert.equal(tpl.length, 1);
  assert.ok(tpl.prev().is('p.field-error[data-rsvp-error-for="guests"]'), 'right after the guests field');
  const row = cheerio.load(tpl.html()!);
  assert.equal(row('label.field[data-fold] [data-copy="form_party"]').text(), 'Name of guest');
  assert.equal(row('[data-rsvp-party-number]').length, 1);
  assert.equal(row('[data-copy="form_optional"]').length, 1);
  assert.equal(row('input:not([name])[maxlength="120"]').length, 1, 'no name: form.js names it party:<n>');
  assert.equal(row('[data-rsvp-error-for="party"]').length, 1);
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
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Hana & Ethan');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Our first spring');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Blossom Hill Gardens');
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
    assert.equal($('.sched-row .row-orn').length, n, 'each row carries the twig; CSS hides the first one and all from 6 rows');
  }
  assert.match(cssText(), /\.sched-row:first-child \.row-orn, \.sched-list:has\(> \.sched-row:nth-child\(6\)\) \.row-orn \{ display: none; \}/);
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & Ethan';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '3 April 2027');
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
  // Petit Formal Script + Noto Serif Display both ship latin-ext (accented names, docs/11 §12); two families, display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@0,400;0,500;1,400&family=Petit+Formal+Script&display=swap', page);
  }
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the gardens?', a: 'Yes, by the main gate.\nThe car park opens at 2:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20270403T200000Z/20270404T003000Z', `${page}: 4 PM EDT to two hours after the reception`);
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
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the gardens?', 'Can we bring our children?']);
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
  c.partners[0] = { display_name: 'Noa', full_name: null };
  c.partners[1] = { display_name: 'Ethan', full_name: 'Ethan Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Noa', 'Ethan Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Hana Grace', 'Ethan Michael']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.dline|\.venue-(sec|text|photo|name|place)|\.pf|\.petal-frames|\.tz-|\.teasers|\.card(?!-copy \.kicker)|\.frame|\.closure|\.card-twig|\.dress|\.row-orn/;
  let checked = 0;
  for (const [, sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 25, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // gradients only as borderless light / fade masks / the interface pill (docs/11 §5.7): daylight on the mist, the mist's
  // fade below the first screen, the petal bokeh fading in at the foot, the nav's soft ground, the button
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.hero-bg picture|\.petal-end::before|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the blossom branches are whole GPT parts: no mask / clip on them
  for (const [, sel, body] of rules) if (/corner|page-corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  // the nav: no hard top edge (it fades in) and an opaque label row nothing ghosts through
  const nav = asRgba(rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2]);
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
  const alphas = [...nav.matchAll(/rgba\(243, 232, 234, (\.\d+)\) \d+px, rgba\(243, 232, 234, (\.\d+)\)/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(alphas.length === 2 && alphas.every((a) => a >= 0.96), `label row ≥ .96 (${alphas})`);
  assert.match(nav, /backdrop-filter: blur\(\d+px\)/);
  // the only lines are 1 px interface dividers: the W1 hairlines beside the GPT blossom (.orn) and the GPT twig (.row-orn),
  // the nav's hairline, the two beside the invitation card's day numeral, FAQ rules
  for (const [, sel, body] of rules) {
    if (/(^|;)\s*(height|width): 1px/.test(body)) assert.match(sel, /\.orn::before|\.row-orn::before|\.site-nav::before|\.dline \.day::before, \.dline \.day::after/, sel.trim());
  }
});

// ---------------------------------------------------------------- the envelope (docs/11 §7.1/§7.3 kapak, round flap) and its opening

test('envelope (kapak, round flap): layers from the build, the twig on the flap\'s lowest point apart from the flap, card path, opening sentence', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.cuts.cflap.method, 'renk', 'the round flap is cut along its white deckled edge, found in the image');
  assert.equal(st.cuts.cflap.shape, 'egri');
  assert.ok(st.cuts.cflap.monotone_fix_columns < 120, 'only the steep left end of the curve was straightened');
  assert.equal(st.cuts.pocket.method, 'renk', 'the pocket\'s smile-shaped edge is found in the image');
  assert.deepEqual(st.cuts.pocket.warnings, []);
  assert.ok(st.cuts.pocket.residual_sd <= 4, `pocket arc fit ${st.cuts.pocket.residual_sd} px`);
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.equal(MANIFEST.align.durum, 'tamam', 'closed/open alignment within 1.5 % (no transform needed)');
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, false, '"the blossom twig loosens and drifts off" — not carried by the flap');
  assert.deepEqual(MANIFEST.closure.anchor_px, st.cuts.cflap.tip, 'anchored on the lowest point of the cut round flap');
  const css = cssText();
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure']) {
    const [, top, , h] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`) && css.includes(`height: ${pct(h)}%`), `${k}: stage percentages from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`transform-origin: 50% ${pct(st.hinge_in_cflap_pct)}%`), 'the flap turns on the hinge row');
  assert.ok(css.includes(`/ ${pct(st.closed_obj.frac_w)})`) && css.includes(`* ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'stage size from the closed envelope');
  assert.ok(jsText().includes(`st.offsetWidth * ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'envFit uses the same empty top');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top');
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'accents', 'forward', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|lift|open|flap|rise|accents|forward|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  // the order of the sentence: the twig loosens and drifts off, the curved flap lifts, the card rises as the petals swirl up
  assert.ok(E.closure[0] <= 250, 'first motion of the twig ≤ 250 ms');
  assert.ok(E.lift[0] >= E.closure[0] + 0.6 * E.closure[1], 'the flap lifts once the twig has drifted clear');
  assert.ok(E.flap[0] > E.lift[0] && E.rise[0] > E.flap[0], 'flap, then the card');
  assert.equal(E.accents, E.rise[0], 'the petals swirl up as the card rises');
  assert.ok(E.forward[0] >= E.rise[0] + E.rise[1] - 20 && E.go >= E.forward[0] + E.forward[1], 'forward, then go');
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  const twig = /A\(el\.closure, \[([\s\S]*?)\], E\.closure/.exec(js)![1];
  assert.doesNotMatch(twig, /opacity/, 'never fades on the envelope: it drifts off the screen');
  assert.match(twig, /T\(side, -up, \d+, 1\)\s*$/, 'ends past the top-right of the screen');
  assert.match(js, /up = Math\.max\(cr\.bottom \+ 24, SH \* \.6\), side = Math\.max\(innerWidth - cr\.left \+ 24/);
  assert.match(js, /A\(el\.cflap, \[/, 'the flap lifts on its own');
  // "a gentle flurry of cherry petals swirls up and floats across the screen": only the GPT petal (accent_1), path swirl
  const open = /open: \[([\s\S]*?)\],\n\s+arrive/.exec(js)![1];
  assert.match(open, /\{ file: 'img\/accent_1-200\.webp', count: \d+, path: 'swirl', origin: 'stage'/);
  assert.doesNotMatch(open, /accent_[23]/, 'no whole blossoms or buds in the opening sentence');
  const count = Number(/count: (\d+), path: 'swirl'/.exec(open)![1]);
  assert.ok(count >= 8 && count <= 18, `a gentle flurry: ${count} petals`);
  assert.match(js, /if \(g\.path === 'swirl'\)/);
  assert.match(js, /accents\('open', E\.go - E\.accents - 60\)/);
  // the card waits low in the pocket: the wreath and ≤ 10 % of the photo above the pocket's lowest point
  assert.ok(st.card_path.photo_above_pocket <= 0.1);
  assert.ok(css.includes(`.env .card { position: absolute; left: ${st.parts.card[0]}%; top: ${st.parts.card[1]}%; width: ${st.parts.card[2]}%; }`), 'card box from the manifest');
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
});

test('the card lands visibly on home; replay has no floating card; the opened state hides the hint', () => {
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(rule('.hero-card'), /view-transition-name:\s*invite-card/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(cssText(), /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  const js = jsText();
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  assert.match(rule('.is-opened .env-hint p'), /animation:\s*none/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(cssText(), /::view-transition-new\(site-nav\):only-child \{ animation: none; \}/);
  assert.match(cssText(), /html:has\(\.page-envelope\)::view-transition-group\(site-nav\) \{ display: none; \}/);
});

// ---------------------------------------------------------------- this design: blush mist, blossom frames, home, lessons

test('phone backdrop: the blush mist from branch-free bg_page crops, both blossom branches whole as layers, clean placeholders', () => {
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('.scene-bg img.scene-img').attr('src'), `/themes/${ID}/img/mist-${MANIFEST.mist.files[0].w}.webp`);
    assert.equal($('.scene-bg source').attr('srcset'), `/themes/${ID}/img/mist_wide-${MANIFEST.mist_wide.files[0].w}.webp`);
    for (const c of [$('.scene-bg img.corner-tl'), $('.scene-bg img.corner-br')]) {
      assert.equal(c.length, 1, `${page}: corner layer`);
      assert.equal(c.attr('loading'), undefined, `${page}: the branch is in the first view (no lazy)`);
      assert.match(c.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/, `${page}: sizes for phones and landscape`);
    }
    // W1.1 / W1.2: single cherry petals floating on the mist (the GPT petal, one of them soft-focus)
    const floats = $('.scene-bg img.float').map((_, el) => $(el).attr('src')!.replace(/^.*img\//, '')).get();
    assert.ok(floats.length >= 3 && floats.every((f) => f === 'accent_1-200.webp'), floats.join(' '));
    assert.equal($('.scene-bg img.float.f-soft').length, 1);
  }
  assert.match(rule('.f-soft'), /filter: blur\(3px\) opacity\(\.7\)/, 'soft focus = blur on the GPT petal (§5.7)');
  assert.ok(MANIFEST.mist.top_crop && MANIFEST.mist.bottom_crop, 'mist crops recorded');
  for (const key of Object.keys(theme.manifest.photos)) {
    assert.ok(MANIFEST[`ph_${key}`].min_lum >= 175, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
    assert.ok(MANIFEST[`ph_${key}`].max_sat <= 26, `ph_${key}: no blossom or petal in the crop (${MANIFEST[`ph_${key}`].max_sat})`);
  }
  assert.equal(MANIFEST.checks.green_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
});

test('story: three blossom frames of different sizes stepping down in a diagonal, each drifting in like a falling petal; window ≥ 38vw on phones', () => {
  const { $ } = render('story');
  const frames = $('.petal-frames .pf');
  assert.equal(frames.length, 3);
  assert.deepEqual(frames.map((_, el) => $(el).attr('data-scene')).get(), ['story-frame', 'story-frame', 'story-frame'], 'each frame its own scene');
  assert.deepEqual(frames.map((_, el) => $(el).find('.frame').attr('data-a')).get(), ['petal-l', 'petal-r', 'petal-l'], 'they drift in from alternate sides');
  frames.each((_, el) => {
    const kids = $(el).find('.frame').children().map((__, k) => ($(k).attr('class') ?? '').split(' ')[0]).get();
    assert.deepEqual(kids, ['photo-slot', 'frame-img'], 'photo under the frame');
    assert.equal($(el).find('figcaption + .orn > img[src$="accent_2-200.webp"]').length, 1, 'W1.3: a blossom between hairlines under each caption');
  });
  const css = cssText();
  assert.match(css, /@keyframes petal-l \{/);
  assert.match(css, /@keyframes petal-r \{/);
  assert.match(css, /\.js \[data-a="petal-l"\]\.in \{ animation: petal-l \d+ms/);
  assert.match(css, /animation: none !important/, 'reduced motion: frames simply in place');
  assert.match(jsText(), /n\.style\.animationDelay = t \+ 'ms'/, 'the keyframes follow the scene plan');
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  const fws = ['.pf-1', '.pf-2', '.pf-3'].map((sel) => Number(/--fw: min\((\d+)vw/.exec(rule(sel))![1]));
  assert.equal(new Set(fws).size, 3, `three different sizes (${fws})`);
  for (const fw of fws) assert.ok(fw * win >= 38, `phone photo window ${(fw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(rule('.pf-1'), /align-self: flex-start/);
  assert.match(rule('.pf-2'), /align-self: flex-end/, 'the diagonal: left, right, left');
  assert.match(css, /@media \(min-width: 720px\) \{\n  \/\* the comp's diagonal/);
  assert.match(jsText(), /'story-frame': \[\['frame', 0\], \['caption', \d+\], \['orn', \d+\]\]/, 'frame, then the caption, then its blossom');
  assert.equal($('.petal-frames .pf[data-fold]').length, 3, 'a frame crossing the nav line starts below the first screen');
  assert.match(rule('.tf-portrait .photo-slot, .pf .photo-slot'), /left: 9\.582%; top: 18\.286%; width: 79\.607%; height: 78\.71%/, 'the photo = the oval window');
});

test('inner pages (story, details, rsvp): the blush mist of W1.3–W1.5 behind the first screen — mist crop, both branches whole, floating petals', () => {
  for (const page of ['story', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page);
    const bg = $('.page-bg');
    assert.equal(bg.length, 1, page);
    assert.equal(bg.attr('aria-hidden'), 'true');
    assert.equal(bg.find('img.scene-img').attr('src'), `/themes/${ID}/img/mist-${MANIFEST.mist.files[0].w}.webp`);
    assert.equal(bg.find('source').attr('srcset'), `/themes/${ID}/img/mist_wide-${MANIFEST.mist_wide.files[0].w}.webp`);
    for (const c of ['corner-tl', 'corner-br']) {
      const img = bg.find(`img.${c}`);
      assert.equal(img.length, 1, `${page}: ${c}`);
      assert.equal(img.attr('loading'), undefined, `${page}: ${c} in the first view`);
      assert.match(img.attr('srcset') ?? '', /-720\.webp 720w/, `${page}: ${c} 720 px variant`);
    }
    assert.equal(bg.find('img.float').length, 3, `${page}: the comp's floating petals`);
  }
  assert.match(rule('.page-bg'), /height: 100svh/);
  assert.match(rule('.page-bg .corner-br'), /bottom: calc\(var\(--nav-h\) \+ \d+px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(cssText(), /\.hero-bg picture, \.page-bg picture \{ -webkit-mask-image: linear-gradient\(#000 \d+%, transparent\)/, 'the mist fades out, no edge');
  assert.match(rule('.hero .scene-bg .corner-br'), /bottom: 22px/);
  const js = jsText();
  assert.match(js, /c\.style\.bottom = `\$\{Math\.max\(22, top\(bg\) \+ bg\.offsetHeight - sv\(\) \+ navH\(\) \+ 2\)\}px`/);
  // decor never under mist text: the 16 × 16 blossom maps are the WebP alpha of florals_tl / florals_br
  assert.ok(js.includes(`const MAP = { tl: '${MANIFEST.florals_tl.occupancy_16}', br: '${MANIFEST.florals_br.occupancy_16}' }`), 'MAP = manifest occupancy');
  assert.equal(render('details').$('.cal[data-fold]').length, 1);
});

test('inner pages: nothing half under the nav on the first screen — fold units, one small lift', () => {
  const d = render('details').$;
  assert.equal(d('.day-card h1.card-title[data-fold]').length, 1);
  assert.equal(d('.sched-list > li.sched-row').length, demo().schedule.length);
  assert.equal(d('.sched-list > li.sched-row[data-fold]').length, 0, 'schedule rows are not fold units: a pushed row left a blank hole in the painted card (qa-kontrol 2026-10-16)');
  assert.equal(d('.venue-photo[data-fold]').length, 1);
  const r = render('rsvp').$;
  assert.equal(r('.rsvp-text > [data-fold]').length, 5, 'title, reply-by, pill, the wait line, the signature');
  assert.equal(r('.rsvp-card > .card-twig > img[src$="closure-240.webp"]').length, 1, 'W1.5: the envelope\'s twig on the card\'s lower edge');
  assert.equal(r('.rsvp-text > .sig-unit[data-fold] > .love + .sign').length, 1, '"With love," and the names');
  assert.equal(r('.rsvp-text > .unit[data-fold] > .deadline[data-field="rsvp.deadline"]').length, 1);
  assert.equal(r('.rsvp-text > .pill > a.btn-bloom > img.pb').length, 2, 'W1.5: a GPT blossom at each end of the pill');
  assert.equal(r('.reply-box > [data-fold] > h2').length, 1);
  assert.ok(r('.reply-form > [data-fold]').length >= 6, 'form rows fold one by one');
  const s = render('story').$;
  assert.equal(s('.page-head > .kicker[data-fold]').length, 1);
  assert.equal(s('.page-head > .lede[data-fold]').length, 1);
  assert.equal(s('section.next-sec[data-fold]').length, 1);
  const js = jsText();
  assert.match(js, /const f = \$\('\.page-bg \+ \*'\), a = \[\.\.\.\$\$\('\[data-fold\]'\)\]/);
  assert.match(js, /Math\.min\(40, parseFloat\(getComputedStyle\(f\.parentElement\)\.paddingTop\) \* \.34\)/);
  assert.match(js, /d <= lift \? \[f, -d\] : \[el, v \+ 6 - t\]/);
  // the signature shrinks (--sg ≥ .72) before it folds
  assert.match(js, /for \(let k = 1; d > lift && k > \.73 && el\.matches\('\.sig-unit'\); d = D\(\)\) el\.style\.setProperty\('--sg', k -= \.04\);/);
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /\.page-rsvp \.site-main \{ display: grid/, 'no side-by-side form: it would always run under the nav');
});

// ---------------------------------------------------------------- the first-screen rules, measured in a browser
// Playwright from the global install (docs/11 §13.3; never `playwright install`): the pages are rendered here with the
// engine and served from the theme folder, so the layout code (site.css + site.js folds) runs for real. Skipped when
// Playwright or its browsers are not installed. Google Fonts load through the proxy when there is one (else the fallback
// fonts: the rules must hold either way, site.js measures).
async function withBrowser(t: { skip: (m: string) => void }, fn: (open: (page: PageName, content: unknown, w: number, h: number) => Promise<any>) => Promise<void>) {
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
    await fn(async (page, content, w, h) => {
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
      const m = await p.evaluate(MEASURE);
      await ctx.close();
      return m;
    });
  } finally {
    await browser.close();
  }
}
// in the page: the nav line, the story frames (frame + caption) and the RSVP signature, viewport px
const MEASURE = `(() => {
  const r = (e) => e.getBoundingClientRect(), nav = r(document.querySelector('.site-nav')).top;
  const frames = [...document.querySelectorAll('.petal-frames .pf')].map((t) => ({ top: r(t.querySelector('.frame')).top, bottom: Math.max(r(t.querySelector('.frame')).bottom, r(t.querySelector('figcaption')).bottom), w: r(t.querySelector('.photo-slot')).width }));
  const sig = document.querySelector('.sig-unit');
  const s = sig && { top: r(sig).top, ink: r(sig.querySelector('.sign')).bottom };
  return { vh: innerHeight, vw: innerWidth, nav, frames, sig: s, sw: document.documentElement.scrollWidth };
})()`;

test('browser: story frames end above the nav or start below the first screen (phones and desktops); a phone window ≥ 38vw; the RSVP signature on the first screen at 390×844', async (t) => {
  await withBrowser(t, async (open) => {
    for (const [w, h] of [[1280, 650], [1366, 657], [1280, 720], [1536, 753], [1024, 768], [1280, 800], [360, 640], [390, 844], [430, 932], [844, 390]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
        const m = await open('story', rec, w, h);
        const at = `story ${w}×${h} ${name}`;
        assert.equal(m.frames.length, 3, at);
        for (const x of m.frames) assert.ok(x.top >= m.vh || x.bottom <= m.nav, `${at}: a frame ends above the nav or starts below the first screen (${Math.round(x.top)}–${Math.round(x.bottom)}, nav ${Math.round(m.nav)})`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
        if (w < 720) assert.ok(m.frames.every((x: { w: number }) => x.w >= 0.38 * m.vw), `${at}: photo windows ${m.frames.map((x: { w: number }) => Math.round(x.w)).join('/')} px ≥ 38vw`);
      }
    }
    for (const [w, h] of [[390, 844], [430, 932]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())]] as const) {
        const m = await open('rsvp', rec, w, h);
        const at = `rsvp ${w}×${h} ${name}`;
        assert.ok(m.sig.top < m.vh && m.sig.ink <= m.nav, `${at}: the signature on the first screen (top ${Math.round(m.sig.top)}, ends ${Math.round(m.sig.ink)}, nav ${Math.round(m.nav)})`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
      }
    }
  });
});

test('nav, dress code and the W1 dividers: a GPT blossom between two hairlines, the GPT twig between rows; nav labels on one hairline', () => {
  for (const page of ['home', 'story', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('nav.site-nav > ul > li').length >= 3, true, page);
    assert.equal($('nav.site-nav a[aria-current="page"]').length, 1, page);
  }
  assert.match(rule('.site-nav::before'), /height: 1px; margin: 0 auto; background: var\(--hair\)/);
  const d = render('details').$;
  assert.equal(d('.dress > .orn > img[src$="accent_2-200.webp"]').length, 1);
  assert.equal(d('.dress em[data-field="dress_code"]').text(), 'Spring formal');
  assert.equal(d('.sched-row .row-orn > img[src$="divider-300.webp"]').length, 3, 'W1.4: the blossoming twig between rows');
  assert.equal(render('home').$('.hero-orn > img[src$="accent_2-200.webp"]').length, 1, 'W1.2: under the RSVP pill');
  assert.equal(render('home').$('.hero-cta a.btn-bloom > img.pb[src$="accent_2-200.webp"]').length, 2, 'W1.2: the pill\'s blossoms');
  assert.equal(render('home').$('.hero-card .card-copy .cc-orn > img').length, 1, 'W1.2: the card\'s blossom between hairlines');
  assert.equal(render('index').$('.env-hint .orn > img[src$="accent_2-200.webp"]').length, 1, 'W1.1: under "Tap to open"');
});

test('home: The Day frame lists the first four schedule rows (docs/11 §3.2: label · time)', () => {
  const c = demo();
  c.schedule = Array.from({ length: 6 }, (_, i) => ({ label: `Event ${i + 1}`, time: `${12 + i}:00`, location: null })) as ContentRecord['schedule'];
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  const rows = $('.tz-day .tz-sched .tz-row');
  assert.equal(rows.length, 6, 'every row in the source; CSS shows the first four');
  assert.equal(rows.first().text(), 'Event 1 · 12:00 PM');
  assert.match(cssText(), /\.tz-row:nth-child\(n\+5\) \{ display: none; \}/);
  const h = render('home').$;
  assert.deepEqual(h('.tz-day .tz-row').map((_, el) => h(el).text()).get(), ['Ceremony · 4:00 PM', 'Cocktail Hour · 5:00 PM', 'Reception · 6:30 PM']);
});

test('home: the comp hero, the invitation card with MONTH | day | YEAR, two blossom frames, the reply-by line once', () => {
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.tz-link .tz-title').map((_, el) => home(el).text()).get(), ['Our Story', 'The Day']);
  assert.equal(home('.tz-story [data-slot="story_1"] + img.frame-img').length, 1, 'story_1 under the oval portrait frame');
  assert.equal(home('.tz-day [data-slot="venue"]').length, 1);
  assert.deepEqual(home('.tz-link').map((_, el) => home(el).attr('data-a')).get(), ['petal-l', 'petal-r'], 'they drift in like petals too');
  assert.equal(home('.paper.invite').attr('data-a'), 'set', 'a painted card is set down, always opaque');
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || /^accent_/.test(m[1]) || $(el).attr('data-photo-state') === 'user') return;
      if ((MANIFEST[m[1]]?.files ?? []).length < 2) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes (docs/11 §5.5)`);
    });
  }
});

test('lessons kept: first screen above the nav (fitNames + fold), names ≥ 32 px, landscape grid, ≥ 11 px text, sizes', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const js = jsText();
  assert.match(css, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 32, 'qa-kontrol 2026-10-16: 32 px so long names take 2–3 lines on 375×553');
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-short'\], 0\], \[\['is-tight', 'is-short', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  // qa-kontrol 2026-10-16: on a short phone the card shrinks so the RSVP stays on the first screen; the names are never pushed
  assert.match(css, /@media \(max-aspect-ratio: 3\/4\) \{ \.hero\.is-short \.hero-card \{ width: clamp\(/);
  assert.match(js, /const cut = \(\) => pieces\(\)\.filter\(\(c\) => !c\.matches\('\.names'\) && bottom\(c\) > limit\)/);
  assert.match(js, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  assert.match(js, /const v = sv\(\), limit = v - navH\(\) - 8, below = v \+ 12/);
  assert.match(css, /\.hero \.scene-bg \{ position: absolute; z-index: 0; bottom: var\(--fold, 0px\); \}/);
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(css);
  assert.ok(land, 'short-landscape block');
  assert.match(land![1], /\.hero-inner \{\s*display: grid; grid-template: 1fr repeat\(7, auto\) 1fr \/ auto minmax\(0, 460px\)/);
  for (const [sel, row] of [['.hero .names', 2], ['.hero-date', 3], ['.hero-venue', 4], ['.hero-city', 5], ['.countdown', 6], ['.hero-cta', 7]] as const) {
    assert.match(land![1], new RegExp(`\\n  ${sel.replace(/\./g, '\\.')} \\{ grid-area: ${row} \\/ 2;`), `${sel} in row ${row} beside the card`);
  }
  const widths = [...rule('.hero-card').matchAll(/width: ([^;]+)/g)].map((m) => m[1]);
  assert.ok(widths.length >= 3 && widths.every((w) => w.startsWith('clamp(150px')), widths.join(' | '));
  for (const sel of ['.card-copy .kicker', '.rsvp-text .wait', '.cd-lbl', '.cue', '.invite-text .host', '.dateblock .wd', '.sched-row .time', '.dline .mon, .dline .yr', '.kicker', '.site-nav a']) {
    const r = rule(sel);
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(r) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(r);
    assert.ok(fs && Number(fs[1]) >= 10.5, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  // card copy: date · town on one line, else two, else the blossom, the town and the script drop, then tighter capitals,
  // then the date wraps; refitted on resize
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'o'\], \[true, 'o c'\], \[true, 'o c s'\], \[true, 'o c s t'\], \[true, 'o c s t w'\]\]\)/);
  assert.match(cssText(), /\.card-copy\[data-drop~="t"\] \.kicker \{ letter-spacing: \.02em; \}/);
  assert.match(cssText(), /\.card-copy\[data-drop~="w"\] \.nowrap \{ white-space: normal; \}/);
  assert.match(cssText(), /\.card-copy\[data-drop~="o"\] \.cc-orn/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  // motion: no empty wait after the card lands; the arrival / closing petals fall inside their section, behind its text,
  // in lanes beside the text column
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  assert.match(js, /arrive: \[\{ file: 'img\/accent_1-200\.webp'[^\n]*avoid: '\.hero-inner > \*', host: '\.hero'/);
  assert.match(js, /closing: \[\{ file: 'img\/accent_1-200\.webp'[^\n]*avoid: '\.closing > p, \.closing > h2', host: '\.closing'/);
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: first step ≤ 150 ms, last step of a scene ≤ 3000 ms; one entrance 600–1800 ms
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  for (const [, d] of cssText().matchAll(/animation: petal-[lr] (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `petal ${d}`);
  assert.match(rule('.amp'), /font-size: max\(11px, \.5em\)/);
  assert.match(cssText(), /\.card-copy \.kicker:has\(\.cc-city\[data-empty\]\) \.sep/);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
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

// ---------------------------------------------------------------- 24: editable design texts (G068), thank-you mode (G075)

test('24 G068: theme.json copy = the templates, no unmarked visible text, standard keys only; every key at its max renders', () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], 'run node scripts/copy-manifest.ts --theme cherry-blossom-spring');
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const [k, e] of Object.entries(theme.manifest.copy)) assert.ok([...e.default].length <= e.max, k);
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy);
  for (const page of PAGES) {
    for (const thankYouPreview of [false, true]) {
      const out = render(page, c, thankYouPreview ? { previewKey: 'k'.repeat(20), thankYouPreview } : {});
      assert.deepEqual(out.warnings, [], `${page}${thankYouPreview ? ' thank-you' : ''}`);
      if (out.disabled) continue;
      out.$('[data-copy]').each((_, el) => assert.equal(out.$(el).text(), c.copy![out.$(el).attr('data-copy')!], `${page} ${out.$(el).attr('data-copy')}`));
    }
  }
});

test('G075 thank-you mode: the same pages, no reply call, the thank-you card on the invitation paper, the twig in the window', () => {
  const c = demo();
  c.thank_you = { mode: 'on', title: 'Thank you for a beautiful spring day', message: 'We loved every moment.\nThank you for coming.' } as ContentRecord['thank_you'];
  const index = render('index', c).$;
  assert.equal(index('.env-head .kicker').text(), 'With love and thanks');
  assert.equal(index('.card .ty-title').text(), 'Thank you for a beautiful spring day');
  assert.equal(index('.card img[data-photo]').length, 0, 'no photo placeholder in thank-you mode');
  assert.equal(index('.card .ty-decor img[src*="closure-240.webp"]').length, 1, 'the envelope\'s twig on the blush mist');
  assert.equal(index('link[href$="thank-you.css"]').length, 1);
  const home = render('home', c).$;
  assert.equal(home('.countdown').length, 0);
  assert.equal(home('.hero-cta').length, 0);
  assert.equal(home('#invitation').length, 0);
  assert.equal(home('#thank-you .ty-head').text(), 'Thank you for a beautiful spring day');
  assert.equal(home('#thank-you .ty-message').text(), 'We loved every moment.\nThank you for coming.');
  assert.equal(home('a[data-calendar]').length, 0);
  assert.equal(home(`a[href="/${SLUG}/rsvp"]`).length, 0);
  const details = render('details', c).$;
  assert.equal(details('.cal').length, 0);
  assert.equal(details('.dress').length, 0);
  assert.equal(details('p[data-if="ceremony_time thank_you_on"]').text(), 'The ceremony began at 4:00 PM.');
  assert.equal(details('nav a[aria-current="page"]').text(), 'The Day');
  const rsvp = render('rsvp', c).$;
  assert.equal(rsvp('h1').text(), 'Replies are closed');
  assert.equal(rsvp('#reply').length, 0, 'no form');
  assert.equal(rsvp(`.pill a[href="/${SLUG}/home"]`).length, 1);
  const hidden = demo();
  hidden.thank_you = { mode: 'on', title: 'Thanks', details: 'hide' } as ContentRecord['thank_you'];
  assert.equal(render('details', hidden).disabled, true, 'the couple hid The Day: 404');
  assert.equal(render('story', hidden).$(`a[href="/${SLUG}/details"]`).length, 0);
  const tyCss = readFileSync(path.join(DIR, 'thank-you.css'), 'utf8');
  assert.match(tyCss, /\.ty-message \{[^}]*white-space: pre-line/);
});

// ---------------------------------------------------------------- 13: site.js contract

test('smooth scrolling only for the RSVP page\'s #reply jump, never with reduced motion (a scripted scroll is never eased)', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/scroll-behavior: smooth/g) || []).length, 1);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ html:has\(#reply\) \{ scroll-behavior: smooth; \} \}/);
  const { $ } = render('rsvp');
  assert.equal($('#reply').length, 1, 'the RSVP page has the #reply target');
  assert.equal($('a[href="#reply"]').length, 1);
  for (const page of ['index', 'home', 'story', 'details'] as const) assert.equal(render(page).$('#reply').length, 0, `${page}: no #reply, no smooth scroll`);
});

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
  assert.match(js, /d\.if\?\.split\(' '\)/, 'devRender reads several data-if conditions (G075)');
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-cb', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-cb'), { params: Promise.resolve({ slug: 'maren-and-theo-cb' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  // index: the early state script, the deferred opening parts (G180) and the speculation rules
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 3, 'inline state script + deferred parts + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/cherry-blossom-spring\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Hana & Ethan wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-cb/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-cb', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'env_cflap-880.webp'], ['img', 'closure-480.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'mist-640.webp'], ['img', 'divider-300.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-cb' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-cb'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-cb', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.31' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-spring-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-spring-site/story'), { params: Promise.resolve({ slug: 'quiet-spring-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-spring-site'), { params: Promise.resolve({ slug: 'quiet-spring-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-spring-site/${page}`), { params: Promise.resolve({ slug: 'quiet-spring-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
