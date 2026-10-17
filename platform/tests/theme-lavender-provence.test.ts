// Theme platform/themes/lavender-provence (design 09 · Lavender Provence, task G409) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json: the linen pouch, docs/11 §7.6) and the site.js contract. Browser checks (widths, short phones,
// landscape, opening flow, stress record, weight, video) live in scripts/theme-check.cjs --theme lavender-provence; G051 in
// tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { STANDARD_COPY, stressCopy } from '../lib/theme/copy.ts';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'lavender-provence';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/09_Lavender_Provence/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'amelie-and-louis';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-lp-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/09_Lavender_Provence/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
  return { ...result, $: cheerio.load(result.html) };
}
const cssText = () => readFileSync(path.join(DIR, 'site.css'), 'utf8');
const cssRules = () => [...cssText().replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const rule = (sel: string) => cssRules().filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');
const jsText = () => readFileSync(path.join(DIR, 'site.js'), 'utf8');
const pct = (n: number) => String(n).replace(/^0\./, '.');

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

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Lavender Provence');
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
  // every srcset width is the file's real width (no upscaled or mislabelled candidate)
  for (const page of PAGES) {
    const $ = cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'));
    $('[srcset]').each((_, el) => {
      for (const c of $(el).attr('srcset')!.split(',').map((s) => s.trim().split(/\s+/))) {
        const m = /-(\d+)\.webp$/.exec(c[0]);
        if (m && c[0].startsWith('img/')) assert.equal(c[1], `${m[1]}w`, `${page}: ${c.join(' ')}`);
      }
    });
  }
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
  // docs/11 §6: no single WebP over 250 KB; the first-view ones (corner bouquets at 640) under 200 KB
  for (const f of readdirSync(path.join(DIR, 'img')).filter((f) => f.endsWith('.webp'))) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 250 * 1024, `${f}: ${statSync(path.join(DIR, 'img', f)).size} B`);
  }
  for (const f of ['florals_tl-640.webp', 'florals_br-640.webp', 'pouch_closed-662.webp']) assert.ok(statSync(path.join(DIR, 'img', f)).size <= 200 * 1024, f);
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
  assert.ok(claim, '/start?theme=lavender-provence works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Amélie');
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
    if (page !== 'index') {
      assert.equal($('nav.site-nav').attr('aria-label'), 'Wedding pages', page);
      assert.equal($(`nav.site-nav a[aria-current="page"][href="/${SLUG}/${page}"]`).length, 1, `${page}: current page in the nav`);
    }
  }
  assert.ok(fields > 45, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Amélie & Louis · July 3, 2027');
  assert.equal(index('h1').text(), 'Amélie & Louis');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, July 3, 2027 · Gordes, Provence");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage').attr('aria-label'), 'Open the invitation');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'July 3, 2027 · Gordes', 'card: date · town (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Amélie & Louis');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Amélie & Louis');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Lavender Field', 'The Stone Terrace', 'The Old Barn']);
  assert.equal(details('.venue-place').text(), 'Gordes, Provence, France');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.dl', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'July 3, 2027', 'at 4:00 PM']);
  assert.equal(home('.hero-city').text(), 'Gordes, Provence, France');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
});

test('4 no personal text is hard-coded in the templates, the stylesheets or the script (the site record is the only source)', () => {
  const c = demo();
  const personal = [
    c.host_line, c.venue.name, c.venue.city, c.venue.region, c.dress_code, fmtDate(c.date), fmtDate(c.rsvp.deadline!),
    ...c.partners.flatMap((p) => [p.display_name, p.full_name]), ...c.schedule.map((s) => s.location),
    ...(c.story?.items ?? []).map((i) => i.caption), c.story?.intro,
  ].filter((s): s is string => typeof s === 'string' && s.length > 2);
  for (const page of PAGES) {
    // the design's own name ("Lavender Provence", comments) is not the couple's region
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8').replace(/&amp;/g, '&').replace(/Lavender Provence/g, '');
    assert.deepEqual(personal.filter((s) => raw.includes(s)), [], `${page}.html contains personal text`);
    // W1 comp demo text is a layout reference only
    assert.doesNotMatch(raw, /Amélie|Louis|Lavande|Gordes|Rosé in the square|Summer chic/, page);
  }
  // the design's own name in the file headers is not the couple's region
  const own = (t: string) => t.replace(/Lavender Provence/g, '');
  assert.deepEqual(personal.filter((s) => own(cssText()).includes(s)), []);
  assert.deepEqual(personal.filter((s) => own(readFileSync(path.join(DIR, 'thank-you.css'), 'utf8')).includes(s)), []);
  // site.js: personal text only inside DEV_CONTENT (the static design preview), never written by the script
  const js = own(jsText()).replace(/const DEV_CONTENT = \{[\s\S]*?\n\};/, '');
  assert.deepEqual(personal.filter((s) => js.includes(s)), []);
  assert.doesNotMatch(js, /textContent = (CONTENT|SITE)/, 'the script never writes personal text');
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
    assert.ok(!/Amélie|Louis|Lavande|Gordes|Provence/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
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
  assert.deepEqual(home('.tz-row').map((_, el) => home(el).text()).get(), ['Welcome Drinks · 2:45 PM', 'Ceremony · 3:30 PM', 'Dinner · 6:00 PM', 'Dancing · 8:30 PM']);
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Long summer evenings and fields of lavender carried us all the way to July 3, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /all the way to 3 July 2027\.$/);
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
  // the photo sits under its frame, in the window box of the build (+2 px), shaped by the mask — no border-radius
  const slots = MANIFEST.photo_slots;
  assert.ok(cssText().includes(`.card > .photo-slot { left: ${slots.card.box_pct[0]}%; top: ${slots.card.box_pct[1]}%; width: ${slots.card.box_pct[2]}%; height: ${slots.card.box_pct[3]}%; }`));
  assert.ok(cssText().includes(`.tile .photo-slot { left: ${slots.portrait.box_pct[0]}%; top: ${slots.portrait.box_pct[1]}%; width: ${slots.portrait.box_pct[2]}%; height: ${slots.portrait.box_pct[3]}%; }`));
  assert.ok(cssText().includes(`.venue-photo .photo-slot { left: ${slots.landscape.box_pct[0]}%; top: ${slots.landscape.box_pct[1]}%; width: ${slots.landscape.box_pct[2]}%; height: ${slots.landscape.box_pct[3]}%; }`));
  assert.doesNotMatch(rule('.photo-slot'), /border-radius/);
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
  assert.equal(home('.teaser').length, 2, 'The Day and the reply card stay');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Summer chic');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=lavande';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=lavande');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
  assert.equal(a.text(), 'View map');
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
  assert.equal($('#reply').length, 1);
  // G069: the guests' names row right after "Number of guests", in the form's own field style
  const raw = cheerio.load(readFileSync(path.join(DIR, 'rsvp.html'), 'utf8'));
  const tpl = raw('template[data-rsvp-party]');
  assert.equal(tpl.length, 1);
  assert.ok(raw('[name="guests"]').closest('label').next().next().is('template[data-rsvp-party]'), 'directly after the guests field + its error');
  const row = cheerio.load(tpl.html()!);
  assert.equal(row('label.field input:not([name])').length, 1);
  assert.equal(row('[data-copy="form_party"]').length, 1);
  assert.equal(row('[data-rsvp-error-for="party"]').length, 1);
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
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 4, 'with replies on: hero, invitation, reply card and nav link to the RSVP page');
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
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Amélie & Louis');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Rosé in the square');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Les Jardins de Lavande');
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
  gb.name_display = 'Anne-Sophie Élodie & Louis';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '3 July 2027');
  assert.equal(render('home', gb).$('.dateblock .dl').text(), '3 July 2027', 'the stacked date follows the locale (motor format)');
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
  // Alex Brush + Cormorant Garamond (catalogue pair; both ship latin-ext for accented names, docs/11 §12), display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap', page);
  }
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
    { q: 'Is there parking at the venue?', a: 'Yes, by the stone terrace.\nThe gate opens at 3:00 PM.' },
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
    assert.match(google.searchParams.get('dates') ?? '', /^20270703T140000Z\//, `${page}: 4 PM CEST`);
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
  assert.match(rule('.btn-sm'), /min-height: 44px/, 'calendar buttons ≥ 44 px');
});

test('19 G051 questions & answers: a native accordion on the details page, in order, only while the block is on', () => {
  const c = g051Content();
  const { $, warnings } = render('details', c);
  assert.deepEqual(warnings, []);
  const items = $('.faq-sec details.faq-item');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the venue?', 'Can we bring our children?']);
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

// ---------------------------------------------------------------- 21–22, 24: full-name fallback, K21, design texts

test('21 invitation card: without a full name the first name is shown (never an empty name line)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Amé', full_name: null };
  c.partners[1] = { display_name: 'Louis', full_name: 'Louis Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Amé', 'Louis Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Amélie Claire', 'Louis Henri']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo|name|place)|\.tile|\.teaser|\.tz-|\.pressed|\.card(?!-tie)|\.frame|\.pouch|\.bundle|\.tie|\.loose|\.sprig|\.stage/;
  let checked = 0;
  for (const [, sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 20, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // gradients only as borderless light, the nav's soft ground and the interface pill (docs/11 §5.7)
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the corner bouquets are whole GPT parts: no mask / clip on them
  for (const [, sel, body] of rules) if (/corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
  const alphas = [...nav.matchAll(/rgb\(var\(--c-dcd3e9\)\/(\.\d+)\) \d+px, rgb\(var\(--c-dcd3e9\)\/(\.\d+)\)/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(alphas.length === 2 && alphas.every((a) => a >= 0.95), `label row ≥ .95 (${alphas})`);
  // the only lines are 1 px interface dividers (the hairline with the lavender bud)
  for (const [, sel, body] of rules) if (/height: 1px/.test(body)) assert.match(sel, /\.orn::before/, sel.trim());
  // the hairline ornament is a GPT crop (the lavender bud of accent_1), not drawn
  assert.equal(MANIFEST.bud.source, 'accent_1');
  for (const page of PAGES) {
    const $ = cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'));
    $('.orn').each((_, el) => assert.equal($(el).find('img[src="img/bud-80.webp"]').length, 1, `${page}: .orn carries the bud`));
  }
});

test('24 design texts (G068): theme.json copy = the templates, every visible fixed text marked, standard keys, max-length render', () => {
  const pages = Object.fromEntries(PAGES.map((p) => [p, readFileSync(path.join(DIR, `${p}.html`), 'utf8')]));
  const scan = scanCopy(pages);
  assert.deepEqual(scan.unmarked, [], 'no unmarked visible text');
  assert.deepEqual(manifestProblems(theme.manifest.copy ?? {}, scan), []);
  const keys = Object.keys(theme.manifest.copy ?? {});
  assert.ok(keys.length >= 60, `${keys.length} keys`);
  for (const k of keys) assert.ok(k in STANDARD_COPY, `${k}: a standard key (no design key without label)`);
  // every key at its max length renders without warnings on every page, thank-you mode included
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy!);
  for (const page of PAGES) {
    const { warnings } = render(page, c);
    assert.deepEqual(warnings, [], `copy at max: ${page}`);
  }
});

// ---------------------------------------------------------------- the linen pouch (docs/11 §7.1/§7.6 kese) and its opening

test('pouch (kese): layers from the build, the twine cut in three, the front wall cut at the lining, the card path', () => {
  const st = MANIFEST.stage;
  for (const k of ['pouch_closed', 'pouch_back', 'pouch_front', 'tie_l', 'tie_r', 'bundle', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.type, 'kese (docs/11 §7.6)');
  // alignment: kit_check's UYARI (bottom −2.15 %, twine ends ~−1.3 %) fixed by the measured transform (manifest.stage.align)
  assert.equal(st.align.before.durum, 'uyari');
  assert.equal(st.align.after.durum, 'tamam');
  for (const [k, v] of Object.entries(st.align.open_after_px)) assert.ok(Math.abs(Number(v)) <= 1, `open pouch ${k} ${v} px after the fix`);
  for (const e of st.align.after.kenarlar.concat(st.align.after.kapanis.kenarlar)) assert.ok(Math.abs(e.fark_pct) <= 1.5, `${e.kenar} ${e.fark_pct} %`);
  // the front wall: found in the image (the lilac lining's lower edge), the open pouch recomposed
  assert.match(st.rim.cut.method, /^renk/);
  assert.ok(st.rim.cut.columns_found >= 300, `${st.rim.cut.columns_found} columns with lining`);
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01);
  assert.equal(st.checks.closure_pieces_overlap_diff, 0, 'the three twine cuts recompose closure.png exactly');
  // the closure is wrapped, 1:1 on the pouch canvas (docs/11 §7.1), cut in three; the card sits inside the mouth's lining
  assert.equal(MANIFEST.closure.wrapped, true);
  assert.deepEqual(MANIFEST.closure.pieces, ['tie_l', 'tie_r', 'bundle']);
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.ok(st.card_path.card_w_of_mouth < 1, 'the card is narrower than the mouth');
  const css = cssText();
  const part = (k: string) => st.parts[k].map((n: number) => `${n}%`);
  for (const [cls, k] of [['.pouch-back', 'pouch_back'], ['.pouch-front', 'pouch_front'], ['.pouch-closed', 'pouch_closed'], ['.tie-l', 'tie_l'], ['.tie-r', 'tie_r'], ['.bundle', 'bundle']]) {
    const [l, t, w, h] = part(k);
    assert.ok(css.includes(`${cls} { left: ${l === '0%' ? '0' : l}; top: ${t}; width: ${w}; height: ${h};`), `${cls}: stage percentages from the manifest`);
  }
  assert.ok(css.includes(`.env .card { position: absolute; left: ${st.parts.card[0]}%; top: ${st.parts.card[1]}%; width: ${st.parts.card[2]}%; }`));
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`transform-origin: ${st.loosen_origin_pct[0]}% ${st.loosen_origin_pct[1]}%`), 'the pouch loosens about its bottom edge');
  // the card slot is clipped along the front wall's rim (the card never shows beside the gathered neck)
  const clip = /\.card-slot \{[^}]*clip-path: polygon\(([^)]+)\)/.exec(css)![1];
  for (const [x, y] of st.rim.clip) assert.ok(clip.includes(`${x}% ${y}%`), `rim point ${x}% ${y}%`);
  // the closed-object fractions behind --w and the empty top (the card's way out)
  assert.ok(css.includes(`/ ${pct(st.closed_obj.frac_w)}`), 'closed_obj.frac_w');
  assert.ok(css.includes(`* ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'closed_obj.top_frac_of_stage_w');
  assert.ok(jsText().includes(`st.offsetWidth * ${pct(st.closed_obj.top_frac_of_stage_w)}`));
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['pouch', 'pouch-closed', 'tie', 'tie', 'bundle'], 'layer order bottom → top');
  assert.deepEqual($('.stage .pouch').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['pouch-back', 'card-slot', 'pouch-front'], 'the card between the back wall and the front wall');
});

test('opening sentence: twine unties and slips away → pouch loosens and opens → card slides up, lavender buds on a breeze', () => {
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'loosen', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|slip|head|loosen|rise|forward|accents|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  assert.ok(E.closure[0] <= 250, 'first motion ≤ 250 ms');
  assert.ok(E.slip[0] > E.closure[0], 'the loops slacken first, then the bundle slips');
  assert.ok(E.loosen[0] >= E.closure[0] + 0.6 * E.closure[1], 'the pouch loosens once the twine is untied');
  assert.ok(E.rise[0] >= E.loosen[0] + 0.6 * E.loosen[1], 'the card slides up out of the opened pouch');
  assert.ok(E.accents >= E.rise[0] && E.accents <= E.rise[0] + 400, 'the buds scatter as the card comes out');
  assert.ok(E.forward[0] >= E.rise[0] + E.rise[1] - 100, 'forward after the rise');
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  for (const n of ['tieL', 'tieR', 'bundle', 'closed', 'pouch', 'card']) assert.match(js, new RegExp(`A\\(el\\.${n}, `), `${n} moves on its own`);
  // the loosen: closed → open with scaleX 1.03 → 1, scaleY .97 → 1 (docs/11 §7.6), bottom edge fixed (transform-origin)
  assert.match(js, /A\(el\.pouch, \[\{ opacity: 0, transform: 'scale\(1\.03, \.97\)' \}[^\n]*\{ opacity: 1, transform: 'scale\(1, 1\)' \}\]/);
  // "dried lavender buds scatter on a summer breeze": the bud crop of accent_1, a breeze out of the mouth, settled before go
  const open = /open: +\[\{ file: 'img\/bud-80\.webp', count: (\d+), path: 'breeze', origin: 'mouth', dur: \[(\d+), (\d+)\]/.exec(js);
  assert.ok(open, 'open: lavender buds on a breeze');
  assert.ok(Number(open![1]) >= 5, 'buds (plural)');
  assert.match(js, /accents\('open', E\.go - E\.accents - 60\)/, 'cut short at go');
  assert.match(js, new RegExp(`out: 'translateY\\(${MANIFEST.stage.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${MANIFEST.stage.card_path.front_translate_pct}%\\) scale\\(${MANIFEST.stage.card_path.front_scale}\\)'`));
  assert.ok(cssText().includes(`.is-opened .env .card { transform: translateY(${MANIFEST.stage.card_path.front_translate_pct}%) scale(${MANIFEST.stage.card_path.front_scale});`));
  // the twine never passes through the pouch: the loops move outward, the bundle slides down the front and away
  assert.doesNotMatch(js, /el\.(tieL|tieR|bundle)[^\n]*zIndex/);
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
  assert.match(rule('.is-opened .env-hint'), /animation:\s*none/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(js, /addEventListener\('pageshow'/);
});

// ---------------------------------------------------------------- this design: paper, bouquets, pressed cards

test('backdrop: the lilac paper (bg_page band + mirror), both bouquets whole as layers, clean placeholders, no linen tile', () => {
  assert.deepEqual(MANIFEST.paper_tile.band, [0, 560, 1024, 880]);
  assert.equal(MANIFEST.paper_tile.mirrored, 'vertical');
  assert.match(rule('body'), /paper_tile-640\.webp[^;]*repeat-y/);
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    for (const c of [$('.scene-bg img.corner-tl'), $('.scene-bg img.corner-br')]) {
      assert.equal(c.length, 1, `${page}: corner layer`);
      assert.equal(c.attr('loading'), undefined, `${page}: in the first view (no lazy)`);
      assert.match(c.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/);
    }
  }
  for (const page of ['story', 'details', 'rsvp'] as PageName[]) assert.equal(render(page).$('.page-bg img.corner-tl').length, 1, page);
  for (const key of Object.keys(theme.manifest.photos)) {
    assert.ok(MANIFEST[`ph_${key}`].min_lum >= 170, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
    assert.ok(MANIFEST[`ph_${key}`].max_sat <= 40, `ph_${key}: no lavender in the crop`);
  }
  assert.equal(MANIFEST.checks.green_check.chroma_key_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
  // decor never under text: the leaf maps of florals_tl / florals_br are the ones in site.js
  assert.ok(jsText().includes(`tl: '${MANIFEST.florals_tl.leaf_map}', br: '${MANIFEST.florals_br.leaf_map}'`));
  for (const f of readdirSync(path.join(DIR, 'img'))) assert.doesNotMatch(f, /^bg_tile/, 'the linen tile is not used (README)');
});

test('story: three pressed-flower cards at loose angles (left, right, left), tumbling in on a breeze; window ≥ 38vw on phones', () => {
  const { $ } = render('story');
  const tiles = $('.tiles .tile');
  assert.equal(tiles.length, 3);
  assert.deepEqual(tiles.map((_, el) => $(el).attr('data-scene')).get(), ['story-tile', 'story-tile', 'story-tile'], 'each card its own scene');
  assert.deepEqual($('.tiles .frame').map((_, el) => $(el).attr('data-a')).get(), ['tumble-l', 'tumble-r', 'tumble-l'], 'left, right, left');
  const css = cssText();
  assert.match(css, /\.js \[data-a="tumble-l"\] \{ transform: translate3d\(-\d+vw, -\d+vh, 0\) rotate\(-\d+deg\);/);
  assert.match(css, /\.js \[data-a="tumble-r"\] \{ transform: translate3d\(\d+vw, -\d+vh, 0\) rotate\(\d+deg\);/);
  // loose angles: each card rests at its own tilt (CSS rotate, apart from the entrance transform)
  const tilts = [1, 2, 3].map((i) => Number(/--tilt: (-?\d+(?:\.\d+)?)deg/.exec(rule(`.t-${i}`))![1]));
  assert.ok(tilts[0] < 0 && tilts[1] > 0 && tilts[2] < 0 && tilts.every((t) => Math.abs(t) >= 2 && Math.abs(t) <= 6), `tilts ${tilts}`);
  assert.match(rule('.tile'), /rotate: var\(--tilt, 0deg\)/);
  const tw = Number(/--tw: min\((\d+)vw/.exec(css)![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(tw * win >= 38, `phone photo window ${(tw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(rule('.t-2'), /margin-left: auto/, 'the middle card on the right');
  assert.match(rule('.tiles'), /overflow-x: clip/);
  assert.equal($('.tiles .tile[data-fold]').length, 3);
  for (const t of [1, 2, 3]) assert.equal($(`.tiles .t-${t} > .loose`).length, 2, `card ${t}: a bud and a daisy on the paper`);
  // the caption: in the script under its card (the frame's plain band is ~7 % of its height: README)
  assert.equal($('.tiles figcaption.cap').length, 3);
  $('.tiles .tile').each((_, el) => assert.ok($(el).children().last().is('figcaption'), 'figcaption is the figure\'s last child'));
  assert.match(jsText(), /const fitCaps = \(\) =>/);
});

test('home: the comp hero, the invitation card in the plain paper beside its bouquet, three pressed cards, the reply line once', () => {
  const { $ } = render('home');
  assert.deepEqual($('.hero-inner').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['card', 'script', 'kicker', 'hero-venue', 'hero-city', 'countdown', 'hero-cta'], 'W1.2 order');
  assert.equal($('.hero .countdown .cd-cell').length, 4);
  assert.equal($('.teaser').length, 3);
  assert.deepEqual($('.teaser').map((_, el) => $(el).attr('href')).get(), [`/${SLUG}/story`, `/${SLUG}/details`, `/${SLUG}/rsvp`]);
  assert.equal($('.tz-row').length, 3);
  assert.match(rule('.tz-row:nth-child(n+5)'), /display: none/, 'The Day teaser shows the first four rows');
  assert.equal($('.reply .kicker').text(), 'Kindly reply by May 22, 2027');
  assert.equal($('body').text().match(/Kindly reply by/g)!.length, 1);
  // the invitation card's text sits right of the bouquet (free_zone) and the card stretches only in its plain band
  const s = MANIFEST.invitation_card.slices;
  assert.equal(rule('.invite').includes(`--t: ${pct(s.top_end_pct / 100)}; --b: ${pct(s.bottom_start_pct / 100)}`), true);
  const fz = MANIFEST.invitation_card.free_zone.filter(([y]: number[]) => y >= s.top_end_pct && y < s.bottom_start_pct);
  assert.ok(fz.every(([, L]: number[]) => L !== null && L <= 6), 'the stretched band is plain across the card');
  const left = Number(/padding: [^;]* (\d+)%;/.exec(rule('.invite-text'))![1]);
  assert.ok(left >= 22, `text column starts at ${left} % (the bouquet's stems reach ~19 %)`);
});

test('lessons kept: first screen above the nav (fitNames + fold), names ≥ 36 px, landscape grid, ≥ 11 px text, budgets', () => {
  const js = jsText();
  assert.match(js, /\['\.hero \.names', 3\.2, 0\.3, 36\]/, 'hero names ≥ 36 px');
  assert.match(js, /const fold = \(hero\) =>/);
  assert.match(js, /const folds = \(\) =>/);
  assert.match(js, /const envFit = \(h1\) =>/);
  assert.match(cssText(), /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\)/, 'short landscape grid');
  assert.equal(MANIFEST.theme_check.first_screen.names_min_px, 36);
  for (const sel of ['.card-copy .kicker', '.rsvp-text .wait', '.cd-lbl', '.invite-text .host', '.dateblock .wd', '.sched-row .time', '.rsvp-text .kicker']) {
    const r = rule(sel);
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(r) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(r) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(r);
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'c'\], \[true, 'c s'\]\]\)/);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  assert.match(js, /arrive: +\[\{ file: 'img\/bud-80\.webp'[^\n]*avoid: '\.hero-inner > \*', host: '\.hero'/);
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: first step of a scene ≤ 150 ms, last ≤ 3000 ms; one entrance 600–1800 ms
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  assert.match(js, /stagger: (1[5-9]\d|2[0-4]\d|250),/);
  assert.match(js, /batchGap: (3[0-9]\d|4[0-4]\d|450),/);
  // reduced motion: no animation, no endless loops
  assert.match(cssText(), /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.js \.env-hint, \.js \.float \{ animation: none !important; \}/);
  assert.match(js, /if \(reduce \|\| !Element\.prototype\.animate\) \{ go\(false\); return; \}/);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
});

test('thank-you mode (G075): every page keeps its look, the card window shows the lavender bundle, no reply call', () => {
  const c = demo();
  c.thank_you = { mode: 'on', title: 'Thank you for a perfect summer day', message: 'We loved every moment.\nWith love,' };
  for (const page of PAGES) {
    const { $, warnings } = render(page, c);
    assert.deepEqual(warnings, [], page);
    assert.equal($('html').attr('data-thank-you'), '', page);
    if (page !== 'story') assert.equal($('link[href$="thank-you.css"]').length, ['index', 'home', 'rsvp'].includes(page) ? 1 : 0, page);
  }
  const index = render('index', c).$;
  assert.equal(index('.card-copy .ty-title').text(), 'Thank you for a perfect summer day');
  assert.equal(index('.ty-decor img').attr('src'), `/themes/${ID}/img/closure-320.webp`, 'the lavender bundle, never a placeholder');
  assert.equal(index('img[data-photo="hero_portrait"]').length, 0);
  const home = render('home', c).$;
  assert.equal(home('.countdown').length, 0);
  assert.equal(home('.hero-cta').length, 0);
  assert.equal(home('#thank-you .ty-message').text(), 'We loved every moment.\nWith love,');
  assert.equal(home('.cal').length, 0);
  assert.equal(home(`a[href="/${SLUG}/rsvp"]`).length, 0);
  const rsvp = render('rsvp', c).$;
  assert.equal(rsvp('h1').text(), 'Replies are closed');
  assert.equal(rsvp('form').length, 0);
  c.thank_you.details = 'hide';
  assert.equal(render('details', c).disabled, true);
  assert.equal(render('story', c).$(`a[href="/${SLUG}/home"]`).length >= 1, true);
});

// ---------------------------------------------------------------- 13: site.js contract

test('smooth scrolling only for the RSVP page\'s #reply jump, never with reduced motion', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/scroll-behavior: smooth/g) || []).length, 1);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ html:has\(#reply\) \{ scroll-behavior: smooth; \} \}/);
  for (const page of ['index', 'home', 'story', 'details'] as const) assert.equal(render(page).$('#reply').length, 0, `${page}: no #reply`);
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
  const n = (cssText().match(/view-transition-name: invite-card/g) ?? []).length;
  assert.equal(n, 2, 'index .env .card + home .hero-card');
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-lp', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-lp'), { params: Promise.resolve({ slug: 'maren-and-theo-lp' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/lavender-provence\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Amélie & Louis wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-lp/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-lp', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'pouch_closed-662.webp'], ['img', 'bundle-349.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'paper_tile-640.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-lp' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-lp'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-lp', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.29' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-lavender-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-lavender-site/story'), { params: Promise.resolve({ slug: 'quiet-lavender-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-lavender-site'), { params: Promise.resolve({ slug: 'quiet-lavender-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-lavender-site/${page}`), { params: Promise.resolve({ slug: 'quiet-lavender-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
