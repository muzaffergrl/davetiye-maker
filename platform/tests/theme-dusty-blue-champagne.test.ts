// Theme platform/themes/dusty-blue-champagne (design 02 · Dusty Blue & Champagne, task G402) — docs/11_TEMA_STANDARDI.md
// §13.2. Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract. Browser checks (widths, short phones, landscape, opening flow, stress
// record, weight, video) live in scripts/theme-check.cjs --theme dusty-blue-champagne; G051 in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'dusty-blue-champagne';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/02_Dusty_Blue/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'eleanor-and-theo';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-db-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/02_Dusty_Blue/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
  return { ...result, $: cheerio.load(result.html) };
}

const cssText = () => readFileSync(path.join(DIR, 'site.css'), 'utf8');
const jsText = () => readFileSync(path.join(DIR, 'site.js'), 'utf8');
/** CSS rules without comments: [selector, body][] */
function cssRules(): Array<[string, string]> {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, s, b]) => [s.trim(), b]);
}
const rule = (sel: string) => cssRules().filter(([s]) => s === sel).map(([, b]) => b).join(';');

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
    if (el.tagName === 'img' || field.startsWith('urls.')) return;
    assert.equal($(el).text(), expected(content, field, $(el).attr('data-format') ?? ''), `${page}: ${field}`);
    n++;
  });
  return n;
}

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Dusty Blue & Champagne');
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
  for (const m of jsText().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  // docs/11 §1: no unused image in the theme folder (G402 review: bg_page-* and mist-640 were built for nothing)
  for (const f of readdirSync(path.join(DIR, 'img')).filter((n) => /\.(webp|jpg|png)$/.test(n))) {
    if (['og-1200x630.jpg', 'favicon.png'].includes(f)) continue;
    assert.ok(refs.has(`img/${f}`), `img/${f} is referenced by a page, site.css or site.js`);
  }
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.equal(MANIFEST.og.align, 'alt');
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
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
  assert.ok(claim, '/start?theme=dusty-blue-champagne works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Eleanor');
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
  assert.ok(fields > 50, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Eleanor & Theo · September 18, 2027');
  assert.equal(index('h1').text(), 'Eleanor & Theo');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, September 18, 2027 · Charleston, South Carolina");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage').attr('aria-label'), 'Open the invitation');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.deepEqual(index('.card-copy .kicker').map((_, el) => index(el).text()).get(), ['September 18, 2027', 'Charleston, South Carolina']);
  assert.equal(render('story', content).$('title').text(), 'Our Story · Eleanor & Theo');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Eleanor & Theo');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:30 PM', '5:30 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Garden Lawn', 'The Veranda', 'The Grand Hall']);
  assert.equal(details('.day-card .page-kicker').text().replace(/\s+/g, ' ').trim(), 'Saturday · September 18, 2027', 'the date heading on the card');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateline ${sel}`).text()), ['Saturday', 'September', '18', '2027', 'at 4:30 PM']);
  assert.equal(home('.hero-date').text().replace(/\s+/g, ' ').trim(), 'Saturday · September 18, 2027');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  // the monogram pressed into the seal is the record's initials (panel: Monogram field)
  assert.equal(index('.closure .seal-mono').text(), 'E&T');
  assert.equal(render('rsvp', content).$('.card-seal .seal-mono').text(), 'E&T');
  assert.equal(home('.mini-seal .seal-mono').text(), 'E&T');
});

test('4 no personal text is hard-coded in the templates or the stylesheet (the site record is the only source)', () => {
  const c = demo();
  const personal = [
    c.host_line, c.venue.name, c.venue.city, c.venue.region, c.dress_code, c.initials, fmtDate(c.date), fmtDate(c.rsvp.deadline!),
    ...c.partners.flatMap((p) => [p.display_name, p.full_name]), ...c.schedule.map((s) => s.location),
    ...(c.story?.items ?? []).map((i) => i.caption), c.story?.intro,
  ].filter((s): s is string => typeof s === 'string' && s.length > 2);
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8').replace(/&amp;/g, '&');
    assert.deepEqual(personal.filter((s) => raw.includes(s)), [], `${page}.html contains personal text`);
  }
  assert.deepEqual(personal.filter((s) => cssText().includes(s)), []);
  // W1 comp demo text is a layout reference only (the comps show the same demo couple; the templates carry none of it)
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Eleanor|Theo\b|Rosewood|Charleston|First hello|The proposal/);
});

test('5 a content change shows on every page (names, date, venue, schedule rows, story, deadline)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Maren', full_name: 'Maren Holloway' };
  c.partners[1] = { display_name: 'Jonah', full_name: 'Jonah Castellan' };
  c.name_display = 'Maren & Jonah';
  c.initials = 'M & J';
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
    assert.ok(!/Eleanor|Theo\b|Rosewood|Charleston|E&T/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Jonah · September 23, 2028');
  assert.equal(index('.card-copy .c-city').text(), 'Bath');
  assert.equal(index('.seal-mono').text(), 'M & J');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('p[data-if="ceremony_time"]').text(), 'The ceremony begins at 3:30 PM.');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.ch-day .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  assert.equal(home('.mini-cap').text(), 'A shared umbrella', 'the first caption written on the small print');
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Coffee dates, sea breezes and all the quiet moments in between brought us to September 18, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /brought us to 18 September 2027\.$/);
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
  for (const m of ['card', 'portrait', 'landscape']) assert.match(cssText(), new RegExp(`\\.mask-${m} \\{[^}]*url\\("img/mask_${m}\\.png"\\)`));
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
  assert.equal(home('.chapter').length, 2, 'no story chapter');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(home('.mini-cap').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Black tie optional');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=rosewood';
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=rosewood');
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
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 3, 'with replies on: hero pill, reply chapter and nav link to the RSVP page');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments', () => {
  const css = cssText();
  assert.match(css, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(css, /\.ph-mark \{ display: none; \}/);
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Eleanor & Theo');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Our first coffee');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Rosewood Manor');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record

test('17 schedule of 1 and 6 rows, long names, en-GB and the docs/11 §12 stress record render without warnings', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
    assert.equal(render('home', c).$('.ch-day .sched-line').length, n, 'all rows in the source; CSS shows the first 4');
  }
  assert.match(cssText(), /\.sched-line:nth-child\(n\+5\) \{ display: none; \}/);
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & Theo';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '18 September 2027');
  assert.equal(render('details', gb).$('.sched-row .time').first().text(), '4:30 pm');
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
  // Pinyon Script + Cormorant Garamond (both ship latin-ext: accented names, docs/11 §12); two families, display=swap
  const href = render('index').$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
  assert.equal(href, 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Pinyon+Script&display=swap');
  for (const page of PAGES) assert.equal(render(page).$('link[href^="https://fonts.googleapis.com/css2"]').attr('href'), href, `${page}: same font link`);
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the manor?', a: 'Yes, free parking by the gardens.\nThe gate opens at 3:30 PM.' },
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
    assert.match(google.searchParams.get('dates') ?? '', /^20270918T203000Z\/2027091\dT\d{6}Z$/, `${page}: 4:30 PM EDT`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal a[data-calendar="google"]').attr('target'), '_blank');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  assert.equal(render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$('a[data-calendar="ics"]').attr('href'),
    `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demo();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  assert.match(jsText(), /'home-cal':\s+\[\['cal', 0\]\]/, 'home: the calendar row enters on its own when it scrolls in');
  assert.match(jsText(), /'details-venue':[^\n]*\['cal', \d+\]/);
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
  c.partners[0] = { display_name: 'Eleanor', full_name: null };
  c.partners[1] = { display_name: 'Theo', full_name: 'Theodore Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Eleanor', 'Theodore Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Eleanor Grace', 'Theodore James']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateline|\.dmy|\.venue-(sec|text|print|name|city)|\.chapter|\.ch-|\.mini-|\.card(?!-seal)|\.print|\.cap|\.day-|\.rsvp-text|\.hero-/;
  let checked = 0;
  for (const [sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel}: a code-drawn frame`);
  }
  assert.ok(checked > 30, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /<svg|<canvas/i, `${page}: no drawn shapes`);
  assert.doesNotMatch(cssText(), /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // the only gradients: borderless light over the paper, the nav's soft ground, the fade mask that thins the home hero's
  // bottom cluster into the paper (docs/11 §5.7)
  for (const [sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /^\.page-bg::after, \.scene-bg::after$|^\.site-nav$|^\.hero-bg \.corner-br$/, sel);
  }
  // CSS hairlines are single 1 px separators only (the comp's nav rules, the venue and "With love" separators)
  for (const [sel, body] of rules) {
    if (/height: 1px/.test(body)) assert.match(sel, /\.site-nav ul::before|\.venue-city::after|\.rsvp-text \.love::before/, `${sel}: 1 px line`);
  }
});

// ---------------------------------------------------------------- this design: envelope, story, home, first screen

test('envelope (docs/11 §7.1/§7.3 kapak): layers from the build, the seal breaks free and falls (not carried by the flap)', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.cuts.cflap.method, 'renk', 'flap cut along the gold edge found in the image');
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.ok(st.cuts.cflap.continuity.max_step_px <= 6, `flap edge step ${st.cuts.cflap.continuity.max_step_px} px`);
  assert.equal(st.cuts.cflap.continuity.replaced_columns, 0);
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  assert.ok(st.hinge_align.open_scale_y > 0.9 && st.hinge_align.open_scale_y < 1, 'open layers rescaled onto the closed hinge');
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.match(MANIFEST.closure.anchor, /V flap tip/);
  const css = cssText();
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) {
    const [left, top, w] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`), `${k}: top from the manifest`);
    if (k === 'closure' || k === 'card') assert.ok(css.includes(`left: ${pct(left)}%`) && css.includes(`width: ${pct(w)}%`), `${k}: box from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`calc(var(--obj) * var(--env-fit, 1) / ${pct(st.closed_obj.frac_w)})`), 'stage width from the closed envelope share');
  // long names on a short screen: the envelope shrinks (≥ 72 %) until "Tap to open" is on screen; names ≥ 36 px
  assert.match(jsText(), /\['\.env-head \.names', 1\.7, 0\.22, 36\]/);
  assert.match(jsText(), /for \(let f = 1; f > 0\.73 && hint\.offsetParent && bottom\(hint\) > sv\(\) - 6; f -= 0\.04\)/);
  assert.ok(css.includes(`var(--w) * ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'the card room above the envelope from the manifest');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top');
  assert.equal($('.env-cflap-wrap').length, 0, 'the seal is not carried by the flap');
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'fall', 'head', 'lift', 'open', 'flap', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const closure = /closure:\s+\[(\d+), (\d+)\]/.exec(js)!;
  assert.ok(Number(closure[1]) <= 250, 'the seal moves at once (≤ 250 ms, docs/11 §7.1)');
  const fall = /fall:\s+\[(\d+), (\d+)\]/.exec(js)!, lift = /lift:\s+\[(\d+), (\d+)\]/.exec(js)!, rise = /rise:\s+\[(\d+), (\d+)\]/.exec(js)!;
  assert.ok(Number(fall[1]) < Number(lift[1]), 'the seal breaks free before the flap opens');
  assert.ok(Number(lift[1]) < Number(rise[1]), 'the flap opens before the card rises');
  assert.match(js, /A\(el\.closure, \[/, 'the seal has its own animation (breaks free, falls away)');
  assert.match(js, /A\(el\.cflap, \[/, 'the flap opens upward on its own hinge');
  // "… while a single eucalyptus leaf drifts down": accent_1 × 1, path fall, beside the card (never over its photo)
  assert.match(js, /open:\s+\[\{ file: 'img\/accent_1-\d+\.webp', count: 1, path: 'fall'[^\n]*avoid: '\.env \.card'/);
  const go = Number(/go:\s+(\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6)`);
  const acc = Number(/\n\s+accents:\s+(\d+)/.exec(js)![1]);
  assert.match(js, /accents\('open', E\.go - E\.accents - 80\)/, 'the leaf is off screen before home');
  assert.ok(acc < go);
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower (no up–down–up)');
});

test('envelope view transition: the card morphs into a visible home card; replay has no floating card; opened hides the hint', () => {
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
});

test('story: three instant prints fly in one after another and settle (window ≥ 38vw on phones), captions in the margins', () => {
  const { $ } = render('story');
  const prints = $('.prints .print');
  assert.equal(prints.length, 3);
  assert.deepEqual(prints.map((_, el) => $(el).attr('data-scene')).get(), ['story-print', 'story-print', 'story-print'], 'one scene per print: they land in turn');
  assert.deepEqual(prints.map((_, el) => $(el).find('.print-frame').attr('data-a')).get(), ['fly-l', 'fly-r', 'fly-b']);
  assert.deepEqual(prints.map((_, el) => $(el).find('figcaption .cap-t').attr('data-field')).get(),
    ['story.items.0.caption', 'story.items.1.caption', 'story.items.2.caption']);
  const css = cssText();
  const pw = Number(/\.prints \{ --pw: min\((\d+)vw/.exec(css)![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(pw * win >= 38, `phone photo window ${(pw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(css, /\.js \[data-a="fly-l"\] \{ transform: translate3d\(-105vw/);
  assert.match(css, /--settle: cubic-bezier\(\.17, 1\.16, \.38, 1\)/, 'the landing overshoots a hair and settles');
  assert.match(css, /@media \(min-width: 760px\) \{\s*\.prints \{ --pw: 265px; display: grid;/, 'wide: the comp layout, two above one');
  const js = jsText();
  assert.match(js, /'story-print':\s+\[\['print', 0\], \['caption', \d+\]\]/);
  assert.ok(Number(/batchGap: (\d+)/.exec(js)![1]) >= 300, 'prints entering together still land one after another');
  // captions are fitted (never under 11 px) inside the print margin; the band comes from the build
  assert.ok(MANIFEST.frame_portrait.caption_band_pct[1] - MANIFEST.frame_portrait.caption_band_pct[0] >= 12);
  assert.match(js, /document\.querySelectorAll\('\.cap, \.mini-cap'\)/);
  assert.match(js, /Math\.max\(0\.5, 11 \/ fontPx\(el\)\)/);
});

test('home: the instant-print card, the floral invitation with the names between its roses, the three chapters, one reply-by line', () => {
  const home = render('home').$;
  assert.equal(home('.hero-card .photo-slot[data-slot="hero_portrait"]').length, 1);
  assert.equal(home('.invite-card img.invite-img[src*="invitation_card-"]').length, 1, 'the GPT invitation card');
  assert.equal(home('.invite-wrap > .host').text(), 'Together with their families');
  // an invitation suite: host line → floral card (names) → the wording on the plain info_card tucked under it (3-slice)
  assert.deepEqual(home('.invite-wrap').children().map((_, el) => (home(el).attr('class') ?? '').split(' ').slice(0, 2).join(' ')).get(),
    ['kicker host', 'invite-card', 'paper info', 'cal']);
  const words = home('.invite-wrap > .paper.info.words');
  for (const sel of ['.request', '.dateline .dmy .day', '.venue', '.city']) assert.equal(words.find(sel).length, 1, `wording on the card: ${sel}`);
  assert.equal(words.find('img.paper-top[src*="info_card-"]').length, 1);
  const em = (sel: string) => Number(new RegExp(`max\\(\\d+px, ([\\d.]+)em\\)`).exec(rule(sel))![1]);
  assert.ok(em('.amp-line') >= 0.78 * em('.invite-text .nm'), 'the "&" about 0.8 × the names');
  assert.match(rule('.words'), /margin: -26% 0 0 4%/, 'the wording card tucks under the floral card (its top sprig hidden)');
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.chapter').map((_, el) => (home(el).attr('class') ?? '').split(' ')[1]).get(), ['ch-story', 'ch-day', 'ch-reply']);
  assert.ok(home('.chapter').toArray().every((el) => home(el).attr('data-scene') === 'home-chapter'), 'each chapter enters on its own');
  assert.equal(home('.ch-story .mini-print img[src*="frame_portrait-"]').length, 1);
  assert.equal(home('.ch-day .paper.info').length, 1);
  assert.equal(home('.ch-reply .mini-seal img[src*="closure-"]').length, 1);
  // the invitation text box is the plain paper of the GPT card (free_zone): no row of the box reaches painted roses
  const fz: Array<[number, number | null, number | null]> = MANIFEST.invitation_card.free_zone;
  const box = { l: 25.2, r: 100 - 19.5, t: 40.5, b: 100 - 28.5 };
  assert.ok(cssText().includes(`left: ${box.l}%; right: 19.5%; top: ${box.t}%; bottom: 28.5%;`));
  for (const [y, L, R] of fz) {
    if (y + 1 <= box.t || y >= box.b) continue;
    assert.ok(L !== null && R !== null && L <= box.l + 0.01 && R >= box.r - 0.01, `invitation band ${y}%: [${L}, ${R}] ⊇ [${box.l}, ${box.r}]`);
  }
  // srcset + sizes on every GPT part with more than one width (docs/11 §5.5)
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || /^accent_/.test(m[1]) || m[1] === 'paper' || $(el).attr('data-photo-state') === 'user') return;
      if ((MANIFEST[m[1]]?.files ?? []).length < 2) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes`);
    });
  }
});

test('qa lessons: backdrop from parts, clusters never cut by a straight line, ≥ 11 px text, tap highlight, first screen, timing', () => {
  // phones: the flower-free bokeh paper (crop of bg_page, checked for decor in the build) + the two clusters as layers
  assert.ok(MANIFEST.paper.busy_share <= 0.002, `paper crop decor share ${MANIFEST.paper.busy_share}`);
  for (const page of ['index'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('.scene-bg img.paper').length, 1);
    for (const c of ['corner-tl', 'corner-br']) {
      const img = $(`.scene-bg img.${c}`);
      assert.equal(img.length, 1, `${page}: ${c} layer`);
      assert.equal(img.attr('loading'), undefined, 'in the first view: not lazy');
      assert.match(img.attr('sizes') ?? '', /min-aspect-ratio: 1\/1/);
    }
  }
  for (const page of PAGES) assert.equal(render(page).$('.page-bg img, .scene-bg img.paper').length, 1, `${page}: the bokeh paper`);
  // clusters are never cut by a straight line (G402 review): the hero box clips only at the screen's sides, the lower
  // cluster ends on its own alpha 8 px above the nav band (no fade mask needed); the page-end cluster too (--navpad =
  // nav row + its 16 px fade + 8 px); theme-check measures it in the browser (theme_check.clusters)
  assert.doesNotMatch(rule('.site-main'), /padding-bottom/);
  assert.match(rule('.hero-bg'), /overflow-x: clip/);
  assert.doesNotMatch(rule('.hero-bg'), /overflow: (clip|hidden)/);
  assert.match(rule('.hero-bg .corner-br'), /bottom: 24px/);
  assert.doesNotMatch(rule('.hero-bg .corner-br'), /mask/);
  assert.match(cssText(), /--navpad: calc\(var\(--nav-h\) \+ 24px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(rule('.corner-br.page-corner'), /bottom: var\(--navpad\)/);
  assert.match(rule('.foot, .next-sec, .closing'), /padding: 44px 16px calc\(var\(--corner\) \* \.8 \+ var\(--navpad\)\)/);
  for (const sel of ['.foot, .next-sec, .closing', '.prints', '.chapters']) assert.doesNotMatch(rule(sel), /overflow: (clip|hidden)/, sel);
  assert.equal(MANIFEST.theme_check.clusters, '.corner, .page-corner');
  // small: no Android tap rectangle; tiny text ≥ 11 px
  assert.match(cssText(), /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  for (const sel of ['.card-copy .kicker', '.sched-line .t', '.rsvp-text .wait', '.cd-lbl', '.seal-mono', '.ch-sub', '.cal .kicker', '.rsvp-text .reply-by', '.day-card .page-kicker']) {
    const body = rule(sel);
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(body) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(body) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(body) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(body);
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  // the hero card never below 150 px (its copy stays ≥ 11 px); names ≥ 36 px (= manifest theme_check). W1.2 proportions
  // (G402 review): on phones a small tilted print (≈ 42vw) under large names; from 1024 px two columns
  const widths = [...cssText().matchAll(/\.hero-card \{[^}]*width: (clamp\((\d+)px[^;]+)/g)].map((m) => [m[1], Number(m[2])] as const);
  assert.ok(widths.length >= 4 && widths.every(([, min]) => min >= 150), widths.map(([w]) => w).join(' | '));
  assert.match(rule('.hero-card'), /width: clamp\(150px, min\(42vw, 30svh\), 250px\); rotate: -2\.5deg/);
  assert.match(cssText(), /@media \(min-width: 1024px\) \{[^}]*\}\s*\.hero-inner \{ grid-template-columns: auto minmax\(0, 560px\)/);
  const js = jsText();
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 36);
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(js, /const v = sv\(\), limit = v - nav\.offsetHeight - 8, below = v \+ 12/, 'fold: a piece not above the nav starts below the first screen');
  const two = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\), \(min-width: 1024px\) \{([\s\S]*?)\n\}/.exec(cssText());
  assert.ok(two, 'two-column hero: a phone on its side and wide screens');
  assert.match(two![1], /\.hero-inner \{\s*display: grid;/);
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(cssText());
  assert.ok(land, 'short-landscape layout');
  assert.match(land![1], /\.env-page \{[^}]*display: grid;/, 'envelope page on its side: names left, envelope right');
  assert.match(land![1], /\.stage \{[^}]*translate: 0 calc\(var\(--obj\) \/ 2\.8794 \+ 12px - 50svh\)/, 'the closed envelope centred');
  // card copy drops parts rather than overflowing or shrinking under 11 px; refitted on resize
  assert.match(js, /for \(const d of \['', 'n', 'c n', 's c n', 's c d'\]\) \{ c\.dataset\.drop = d; if \(fits\(c\)\) break; \}/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  // placeholders are clean crops of the paper; motion: no long idle wait after the card lands
  for (const key of Object.keys(theme.manifest.photos)) assert.ok(MANIFEST[`ph_${key}`].min_lum >= 175, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400, 'no empty wait after the card lands');
  assert.match(js, /arrive: +\[\{ file: 'img\/accent_2-200\.webp'[^\n]*avoid: '\.hero \[data-slot\]'/, 'arrival blossoms beside the photo, never over it');
  // GPT defects cleaned in the build (halo, fringe, window ring); no visible green
  assert.equal(MANIFEST.checks.green_px, 0);
  for (const k of ['card_small', 'frame_portrait', 'frame_landscape']) assert.ok(MANIFEST.cleanup[k].window_ring_px > 0, `${k}: window ring repainted`);
  for (const k of ['envelope_closed', 'envelope_open', 'closure', 'divider']) assert.ok(MANIFEST.cleanup[k].removed_px > 0, `${k}: halo removed`);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB (1 KB = 1000 B: headroom under either reading)
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35_000, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45_000, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
});

test('design range (docs/11 §12 level 1) renders every field; reduced motion skips the opening', () => {
  const range = rangeRecord(demo());
  assert.ok(validateContent(range).ok, JSON.stringify(validateContent(range).errors));
  for (const page of PAGES) {
    const { $, warnings } = render(page, range);
    assert.deepEqual(warnings, [], `range ${page}`);
    assertFieldsMatch($, range, page);
  }
  assert.equal(render('home', range).$('.hero-date').text().replace(/\s+/g, ' ').trim(), 'Wednesday · 29 September 2027');
  const css = cssText();
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.js \[data-step\] \{ opacity: 1 !important;/);
  assert.match(jsText(), /if \(reduce \|\| !Element\.prototype\.animate\) \{ go\(false\); return; \}/);
});

// ---------------------------------------------------------------- 13: site.js contract

test('G402 review: legible forward, deterministic leaf, landscape opening, mirrored print, wide paper, champagne fern', () => {
  const js = jsText(), css = cssText(), st = MANIFEST.stage;
  // forward reads as "coming forward": up (not down), × ≥ 1.08, and the view transition starts while the card still moves
  assert.ok(st.card_path.front_translate_pct < st.card_path.out_translate_pct, 'front goes up, never back down');
  assert.ok(st.card_path.front_scale >= 1.08 && st.card_path.front_scale <= 1.1);
  const fwd = /forward: \[(\d+), (\d+)\]/.exec(js)!, go = Number(/go:\s+(\d+)/.exec(js)![1]);
  assert.ok(go - Number(fwd[1]) <= 600 && go < Number(fwd[1]) + Number(fwd[2]), `go ${go} while forward ${fwd[1]}+${fwd[2]} still plays`);
  // the risen card keeps 12 px to the top: the stage glides down (on its side also to the centre); front clamp as well
  assert.match(js, /dy = Math\.max\(0, 12 \+ c\.height - c\.top\)/);
  assert.match(js, /fix = Math\.max\(0, r\.height \* 0\.08 \+ 12 - r\.top\)/);
  assert.match(js, /glide:\s+\[\d+, \d+\]/);
  // one leaf, always: the wider lane, size (≥ 28 px) and sway shrink to fit; no "no lane → no leaf"
  assert.doesNotMatch(js, /if \(!lanes\.length\) return null/);
  assert.match(js, /s = Math\.max\(28, Math\.min\(s, b - a - 8\)\)/);
  // the waiting card is clipped above the pocket's soft bottom edge (no 1 px strip under the envelope)
  const clipBottom = Number(/\.card-slot \{[^}]*clip-path: inset\(-140% -45% ([\d.]+)% -45%\)/.exec(css)![1]);
  assert.ok(clipBottom >= 1.2, `card-slot clip bottom ${clipBottom} %`);
  // story: print 2's frame mirrored (its sprig away from print 1's caption), window / caption follow; later prints lie under
  assert.match(css, /\.p-2 \.print-img, \.p-2 \.photo-slot, \.p-2 \.photo-slot > \* \{ scale: -1 1; \}/);
  const [pl, , pw] = MANIFEST.photo_slots.portrait.box_pct;
  assert.ok(css.includes(`.p-2 .photo-slot { left: ${(100 - pl - pw).toFixed(3)}%; }`), 'mirrored window from the manifest');
  const z = (k: number) => Number(/z-index: (\d+)/.exec(rule(`.p-${k}`))![1]);
  assert.ok(z(1) > z(2) && z(2) > z(3), 'the earlier print lies on the later one (sprig tucked under the caption margin)');
  for (const k of [2, 3]) assert.ok(Number(/margin: (-?\d+)vw/.exec(rule(`.p-${k}`))![1]) >= -6, `.p-${k}: small overlap`);
  // separator dots are .dot spans everywhere (stack() hides a dangling one) — the RSVP closing included
  const rs = render('rsvp').$;
  assert.equal(rs('.closing .kicker .dot').length, 1);
  for (const page of PAGES) {
    const { $ } = render(page);
    $('body *').each((_, el) => {
      const own = $(el).contents().filter((_, n) => n.type === 'text').text();
      assert.ok(!/\s·\s/.test(own), `${page}: a bare "·" in <${(el as any).tagName}>`);
    });
  }
  // docs/11 §3.2: the card copy names venue.city_region
  for (const page of ['index', 'home'] as PageName[]) {
    assert.equal(render(page).$('.card-copy .c-city').text(), 'Charleston, South Carolina', page);
  }
  // bokeh paper: phones the tall crop; wide / landscape screens the wide crop over the seamless bg_tile at its own scale
  for (const page of PAGES) {
    const { $ } = render(page);
    assert.match($('.page-bg picture source, .scene-bg picture source').attr('srcset') ?? '', /paper_wide-\d+\.webp/, page);
  }
  assert.equal(MANIFEST.paper_wide.busy_share, 0);
  assert.ok(MANIFEST.paper_wide.src_size[0] >= 750, 'wide paper ≥ 750 px');
  assert.match(css, /@media \(min-width: 700px\), \(min-aspect-ratio: 1\/1\) \{\s*\.page-bg, \.scene-bg \{ background: var\(--page\) url\("img\/bg_tile-640\.webp"\) 50% 0 \/ 640px repeat; \}/);
  for (const k of ['bg_page', 'mist']) assert.equal(MANIFEST[k], undefined, `${k}: not built (unused)`);
  // the GPT fern's orange pulled to champagne gold (hue-limited colour grade, recorded in the manifest)
  const fern = MANIFEST.cleanup.florals_br.fern_grade;
  assert.ok(fern.mean_sat_after <= 0.5 && fern.mean_sat_after < fern.mean_sat_before, JSON.stringify(fern));
});

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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-jonah-db', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-jonah-db'), { params: Promise.resolve({ slug: 'maren-and-jonah-db' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', new RegExp(`^https?://[^/]+/themes/${ID}/img/og-1200x630\\.jpg$`), 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Eleanor & Theo wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-jonah-db/${page}`), { params: Promise.resolve({ slug: 'maren-and-jonah-db', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['img', 'env_cflap-857.webp'], ['img', 'closure-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'paper-400.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-jonah-db' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-jonah-db'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-jonah-db', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-blue-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-blue-site/story'), { params: Promise.resolve({ slug: 'quiet-blue-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-blue-site'), { params: Promise.resolve({ slug: 'quiet-blue-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-blue-site/${page}`), { params: Promise.resolve({ slug: 'quiet-blue-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
