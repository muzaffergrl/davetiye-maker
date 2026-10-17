// Theme platform/themes/mediterranean-lemon (design 05 · Mediterranean Lemon, task G405) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract. Browser checks (widths, short phones, landscape, opening flow, stress
// record, weight, video) live in scripts/theme-check.cjs --theme mediterranean-lemon; G051 in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'mediterranean-lemon';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/05_Lemon_Mediterranean/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'isabella-and-marco';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-ml-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/05_Lemon_Mediterranean/content.demo.json). Fresh copy each call. */
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
  assert.equal(theme.manifest.name, 'Mediterranean Lemon');
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
  assert.ok(claim, '/start?theme=mediterranean-lemon works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Isabella');
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
  assert.equal(index('title').text(), 'Isabella & Marco · June 12, 2027');
  assert.equal(index('h1').text(), 'Isabella & Marco');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, June 12, 2027 · Sorrento, Campania");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'June 12, 2027 · Sorrento', 'card: date · town (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Isabella & Marco');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Isabella & Marco');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Lemon Grove', 'The Sea Terrace', 'The Villa Courtyard']);
  assert.equal(details('.venue-place').text(), 'Sorrento, Campania, Italy');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'June', '12', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-city').text(), 'Sorrento, Campania, Italy');
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
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Isabella|Marco|Limonaia|Sorrento|piazza|sweetest/);
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
    assert.ok(!/Isabella|Marco|Limonaia|Sorrento|Campania/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
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
  assert.equal($('.lede').text(), 'Under the lemon trees, one sunny day at a time, we found our way to June 12, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /found our way to 12 June 2027\.$/);
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
  assert.equal(home('.panel-link').length, 1, 'only the venue panel (The Day) stays');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Summer formal');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=villa';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=villa');
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
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Isabella & Marco');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'On the piazza');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Villa Limonaia');
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
  gb.name_display = 'Anne-Sophie Élodie & Marco';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '12 June 2027');
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
  // Allura + Playfair Display both ship latin-ext (accented names, docs/11 §12); exactly two families, display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Allura&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap', page);
  }
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the villa?', a: 'Yes, by the lemon grove.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20270612T140000Z/20270612T183000Z', `${page}: 4 PM CEST to two hours after the reception`);
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
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the villa?', 'Can we bring our children?']);
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
  c.partners[0] = { display_name: 'Isa', full_name: null };
  c.partners[1] = { display_name: 'Marco', full_name: 'Marco Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Isa', 'Marco Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Isabella Marie', 'Marco Antonio']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo|name|place)|\.tile|\.panel|\.pl-|\.card(?!-tie)|\.frame|\.closure|\.wall-piece|\.sprig/;
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
  // gradients only as borderless light / fade masks / the interface pill (docs/11 §5.7): sunlight on the wall, the wall's
  // fade below the first screen, the sky wash fading in at the foot, the nav's soft ground, the button
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.hero-bg picture|\.wash-end::before|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the corner clusters are whole GPT parts: no mask / clip on them (G405 review: a fade mask hid the cut, not fixed it)
  for (const [, sel, body] of rules) if (/corner|page-corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  // the nav: no hard top edge (G401 review: it fades in over 12 px) and an opaque label row nothing ghosts through
  // (G405 review: .74–.9 let the content scroll visibly behind the labels)
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
  // G156: the colour may be rgba(), #rrggbbaa or the palette channel token rgb(var(--c-…)/a) (tools/recolor_parts.py)
  const col = String.raw`(?:rgba\(246, 241, 233, (\.\d+)\)|#f6f1e9([0-9a-f]{2})|rgb\(var\(--c-f6f1e9\)\/(\.\d+)\))`;
  const alpha = (m: RegExpMatchArray, i: number) => (m[i] ? Number(m[i]) : m[i + 1] ? parseInt(m[i + 1], 16) / 255 : Number(m[i + 2]));
  const alphas = [...nav.matchAll(new RegExp(`${col} \\d+px, ${col}`, 'g'))].flatMap((m) => [alpha(m, 1), alpha(m, 4)]);
  assert.ok(alphas.length === 2 && alphas.every((a) => a >= 0.96), `label row ≥ .96 (${alphas})`);
  assert.match(nav, /backdrop-filter: blur\(\d+px\)/);
  // the only lines are 1 px interface dividers (the tile-flower hairline of nav and dress code, the RSVP card's two
  // hairlines, FAQ rules)
  for (const [, sel, body] of rules) {
    const h = /height: 1px/.test(body);
    if (h) assert.match(sel, /\.orn::before|\.hairs span/, sel.trim());
  }
});

// ---------------------------------------------------------------- the envelope (docs/11 §7.1/§7.3 kapak) and its opening

test('envelope (kapak): layers from the build, the lemon tie on the scalloped tip apart from the flap, card path, opening sentence', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.cuts.cflap.method, 'renk', 'the flap is cut below the painted cobalt scallop line, found in the image');
  assert.ok(st.cuts.cflap.continuity.max_step_px <= 24 && st.cuts.cflap.continuity.missing_columns <= 0.03 * (st.cuts.cflap.columns[1] - st.cuts.cflap.columns[0] + 1));
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.equal(st.cuts.pocket.shape, 'trapez');
  assert.deepEqual(st.cuts.pocket.warnings, []);
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  // measured transform: after it the open envelope sits on the closed one (left, right, bottom within 1 px)
  for (const [k, v] of Object.entries(st.align_fix.after_px)) assert.ok(Math.abs(Number(v)) <= 1, `${k} ${v} px after the fix`);
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, false, '"the lemon tie slips loose and rolls away" — not carried by the flap');
  const css = cssText();
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure']) {
    const [, top, , h] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`) && css.includes(`height: ${pct(h)}%`), `${k}: stage percentages from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`transform-origin: ${MANIFEST.closure.lemon_center_in_crop_pct[0]}% ${MANIFEST.closure.lemon_center_in_crop_pct[1]}%`), 'the tie rolls about its lemon');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top');
  assert.equal($('.env-cflap-wrap').length, 0);
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'sway', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|lift|rise|sway|accents|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  // the order of the sentence: the tie first (moving within 250 ms), then the flap, then the card while the branch sways
  assert.ok(E.closure[0] <= 250, 'first motion ≤ 250 ms');
  assert.ok(E.lift[0] > E.closure[0] && E.lift[0] >= 0.4 * E.closure[1], 'the flap lifts once the tie has slipped loose');
  assert.ok(E.rise[0] > E.lift[0] && E.sway[0] >= E.rise[0] - 100 && E.sway[0] <= E.rise[0] + 300, 'the branch sways in as the card rises');
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  assert.match(js, /A\(el\.closure, \[/, 'the tie moves on its own');
  // G405 review: slip (≤ 350 ms) → drop onto the bottom edge → roll right ≤ 150° (angle = distance / lemon radius) → off the
  // screen's right edge; no fade on the envelope
  const tie = /A\(el\.closure, \[([\s\S]*?)\], E\.closure/.exec(js)![1];
  assert.match(tie, /T\(SW \* \.004, dy \* \.2, 5, \{ offset: \.25/, 'slips loose by 350 ms');
  const roll = [...tie.matchAll(/T\(SW \* \.02( \+ d1)?, dy, (\d+), \{ offset: (\.\d+)/g)];
  assert.equal(roll.length, 2);
  assert.ok(Number(roll[1][2]) - Number(roll[0][2]) <= 150, 'rolls ≤ 150° on the envelope');
  assert.match(js, /d1 = r \* 2\.44/, '140° = 2.44 rad × the lemon radius');
  assert.match(tie, /T\(out, dy, \d+\)\s*$/, 'ends off the screen');
  assert.match(js, /out = innerWidth - cr\.left \+ cr\.height \* \.6/, 'past the right edge, leaves included');
  assert.doesNotMatch(tie, /opacity/, 'never fades on the envelope');
  assert.ok(E.lift[0] >= 650, `the flap lifts after the tie has dropped clear (${E.lift[0]} ms)`);
  // the card waits low in the pocket: the tile header and ≤ 10 % of the photo above the pocket edge (faces never cut)
  assert.ok(st.card_path.photo_above_pocket <= 0.1);
  assert.ok(css.includes(`.env .card { position: absolute; left: ${st.parts.card[0]}%; top: ${st.parts.card[1]}%;`), 'card top from the manifest');
  assert.match(js, /A\(el\.cflap, \[/, 'the flap lifts on its own');
  assert.match(js, /A\(el\.branch, \[/, 'the top-corner lemon branch sways in');
  // "… and a blossom drifts down": accent_2 (the blossom) × 1, drifting, beside the card, gone before go; 46–56 px, down
  // the cobalt tile liner between the card and the envelope's edge (white on white plaster was invisible, G405 review)
  assert.match(js, /open:\s+\[\{ file: 'img\/accent_2-200\.webp', count: 1, path: 'drift', origin: 'liner'[^\n]*size: \[(4[6-9]|5\d), (4[6-9]|5[0-6])\][^\n]*avoid: '\.env \.card'/);
  // qa 2026-10-14: the lane (card edge → stage edge) left no room on most phones and the blossom never appeared. Now it may
  // run ≤ 3 % of the stage over the card's white edge (the photo window ends 11 % inside it) and the blossom is ≤ 16 % of
  // the stage: lane ≥ 8 % of the stage on every size
  assert.match(js, /ln = \[\[cd\.right - st\.width \* \.03 - R\.left, st\.right - st\.width \* \.01 - s - R\.left\]\]/);
  assert.match(js, /s = Math\.min\(rand\(g\.size\[0\], g\.size\[1\]\), st \? st\.width \* \.16 : 1e3\)/);
  const cardRight = st.parts.card[0] + st.parts.card[2], photoRight = st.parts.card[0] + st.parts.card[2] * (MANIFEST.photo_slots.card.box_pct[0] + MANIFEST.photo_slots.card.box_pct[2]) / 100;
  assert.ok(cardRight - 3 > photoRight + 5, `lane start ${cardRight - 3} % clear of the photo window (${photoRight.toFixed(1)} %)`);
  assert.ok(99 - (cardRight - 3) - 16 >= 8, 'lane ≥ 8 % of the stage');
  const dur = /open: +\[\{[^\n]*dur: \[(\d+), (\d+)\]/.exec(js)!;
  assert.ok(E.accents + Number(dur[1]) <= E.go, 'the blossom has settled before go');
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.out_translate_pct <= -86, `out ${st.card_path.out_translate_pct}`);
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
});

test('the card lands visibly on home; replay has no floating card; the opened state hides the hint and keeps the branch swayed', () => {
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(rule('.hero-card'), /view-transition-name:\s*invite-card/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(cssText(), /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  const js = jsText();
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  assert.match(rule('.is-opened .scene-bg .corner-tl'), /translate\(2%, 2%\) rotate\(2\.5deg\)/, 'the end of MOTION.envelope.sway');
  assert.match(js, /\{ transform: 'translate\(2%, 2%\) rotate\(2\.5deg\)' \}/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
});

// ---------------------------------------------------------------- this design: wall, tile panels, home, lessons kept

test('phone backdrop: the plaster wall from flower-free bg_page crops, both lemon branches whole as layers, clean placeholders', () => {
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('.scene-bg img.scene-img').attr('src'), `/themes/${ID}/img/wall-${MANIFEST.wall.files[0].w}.webp`);
    assert.equal($('.scene-bg source').attr('srcset'), `/themes/${ID}/img/wall_wide-${MANIFEST.wall_wide.files[0].w}.webp`);
    for (const c of [$('.scene-bg img.corner-tl'), $('.scene-bg img.corner-br')]) {
      assert.equal(c.length, 1, `${page}: corner layer`);
      assert.equal(c.attr('loading'), undefined, `${page}: the corner is in the first view (no lazy)`);
      assert.match(c.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/, `${page}: sizes for phones and landscape`);
    }
  }
  assert.ok(MANIFEST.wall.top_crop && MANIFEST.wall.bottom_crop, 'wall crops recorded');
  for (const key of Object.keys(theme.manifest.photos)) {
    assert.ok(MANIFEST[`ph_${key}`].min_lum >= 175, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
    assert.ok(MANIFEST[`ph_${key}`].max_warm <= 24, `ph_${key}: no lemon or leaf in the crop (${MANIFEST[`ph_${key}`].max_warm})`);
  }
  // the green check: no bright #00FF00 key colour anywhere (the foliage count is reported, not hidden)
  assert.equal(MANIFEST.checks.green_check.chroma_key_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
});

test('story: three tile panels in a staggered column (left, right, left), straight, each turning in; window ≥ 38vw on phones', () => {
  const { $ } = render('story');
  const tiles = $('.tiles .tile');
  assert.equal(tiles.length, 3);
  assert.deepEqual(tiles.map((_, el) => $(el).attr('data-scene')).get(), ['story-tile', 'story-tile', 'story-tile'], 'each panel its own scene');
  assert.deepEqual($('.tiles .frame').map((_, el) => $(el).attr('data-a')).get(), ['turn-l', 'turn-r', 'turn-l'], 'left, right, left');
  const css = cssText();
  assert.match(css, /\.js \[data-a="turn-l"\] \{ transform: perspective\(900px\) rotateY\(\d+deg\); transform-origin: 0 50%;/);
  assert.match(css, /\.js \[data-a="turn-r"\] \{ transform: perspective\(900px\) rotateY\(-\d+deg\); transform-origin: 100% 50%;/);
  const tw = Number(/--tw: min\((\d+)vw/.exec(css)![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(tw * win >= 38, `phone photo window ${(tw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(rule('.t-2'), /margin-left: auto/, 'the middle panel on the right');
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /\.tile[^{]*\{[^}]*(rotate:|rotate\()/, 'panels stand perfectly straight');
  assert.doesNotMatch(css, /scroll-snap|overflow-x: auto/, 'a vertical column: no sideways scroll, so no swipe hint needed');
  // W1.3 corner bouquets: the GPT divider (lemon, blossoms, leaves) across the outer lower corner + a blossom, off the
  // photo window (G405 review: a lone accent lemon read as a sticker); two loose pieces beside each panel
  assert.equal($('.tiles .frame img.sprig-tuck[src$="divider-300.webp"]').length, 3);
  assert.equal($('.tiles .frame img.tuck-bloom').length, 3);
  assert.match(rule('.sprig-tuck'), /width: 5\d%;[^;]*; left: -\d+%; bottom: \d+%; rotate: \d+deg;/);
  // the bouquets run off the screen edge: .tiles (full width) clips sideways, so only the viewport edge cuts them
  assert.match(rule('.tiles'), /overflow-x: clip/);
  for (const t of [1, 2, 3]) assert.equal($(`.tiles .t-${t} > .wall-piece`).length, 2, `panel ${t}: two pieces on the wall`);
  // a panel crossing the nav line starts below the first screen (never half under the nav)
  assert.equal($('.tiles .tile[data-fold]').length, 3);
});

test('inner pages (story, details, rsvp): the sunlit wall of W1.3–W1.5 behind the first screen — wall crop, both clusters whole, loose pieces', () => {
  for (const page of ['story', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page);
    const bg = $('.page-bg');
    assert.equal(bg.length, 1, page);
    assert.equal(bg.attr('aria-hidden'), 'true');
    assert.equal(bg.find('img.scene-img').attr('src'), `/themes/${ID}/img/wall-${MANIFEST.wall.files[0].w}.webp`);
    assert.equal(bg.find('source').attr('srcset'), `/themes/${ID}/img/wall_wide-${MANIFEST.wall_wide.files[0].w}.webp`);
    for (const c of ['corner-tl', 'corner-br']) {
      const img = bg.find(`img.${c}`);
      assert.equal(img.length, 1, `${page}: ${c}`);
      assert.equal(img.attr('loading'), undefined, `${page}: ${c} in the first view`);
      assert.match(img.attr('srcset') ?? '', /-720\.webp 720w/, `${page}: ${c} 720 px variant`);
    }
    assert.ok(bg.find('img.float').length >= 2, `${page}: loose pieces on the wall`);
    assert.equal($('.page-corner.corner-tl').length, 0, `${page}: the old lone corner is gone`);
  }
  const css = cssText();
  assert.match(rule('.page-bg'), /height: 100svh/);
  // the bottom-right cluster ends above the nav on the first screen
  assert.match(rule('.page-bg .corner-br'), /bottom: calc\(var\(--nav-h\) \+ \d+px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /\.hero-bg picture, \.page-bg picture \{ -webkit-mask-image: linear-gradient\(#000 \d+%, transparent\)/, 'the wall fades out, no edge');
  // the hero's cluster sits whole inside the hero (no negative bottom, no mask); site.js lifts it above the first screen's nav
  assert.match(rule('.hero .scene-bg .corner-br'), /bottom: 22px/);
  const js = jsText();
  assert.match(js, /c\.style\.bottom = `\$\{Math\.max\(22, top\(bg\) \+ bg\.offsetHeight - sv\(\) \+ navH\(\) \+ 2\)\}px`/);
  // decor never under wall text: the 16 × 16 leaf maps are the WebP alpha of decor_tl / decor_br
  const map = /const MAP = \{ tl: '([0-9a-f]{64})', br: '([0-9a-f]{64})' \}/.exec(js);
  assert.ok(map, 'leaf maps');
  // the details calendar pair folds below the first screen when it would cross the nav line
  assert.equal(render('details').$('.cal[data-fold]').length, 1);
});

test('inner pages: nothing half under the nav on the first screen — fold units, one small lift, desktop story row (qa 2026-10-14)', () => {
  // every unit a first screen can end on is a [data-fold]: it ends above the nav or starts below the first screen
  const d = render('details').$;
  assert.equal(d('.day-card h1.card-title[data-fold]').length, 1);
  assert.equal(d('.sched-list > li.sched-row[data-fold]').length, demo().schedule.length, 'each schedule row');
  assert.equal(d('.venue-photo[data-fold]').length, 1);
  const r = render('rsvp').$;
  assert.equal(r('.rsvp-text > [data-fold]').length, 5, 'title, reply-by, pill, the wait line, the signature');
  // "With love," + the names + the lemon tie fold together: the tie rides on the signature unit, not on the card
  assert.equal(r('.rsvp-text > .sig-unit[data-fold] > .card-tie').length, 1);
  assert.equal(r('.rsvp-card > .card-tie').length, 0);
  assert.equal(r('.rsvp-text > .unit[data-fold] > .deadline[data-field="rsvp.deadline"]').length, 1);
  assert.equal(r('.reply-box > [data-fold] > h2').length, 1);
  assert.ok(r('.reply-form > [data-fold]').length >= 6, 'form rows fold one by one');
  const s = render('story').$;
  assert.equal(s('.page-head > .kicker[data-fold]').length, 1);
  assert.equal(s('.page-head > .lede[data-fold]').length, 1);
  // the story's next section folds too: on desktop the row now ends just above the nav, "The Day →" would sit under it
  assert.equal(s('section.next-sec[data-fold]').length, 1);
  const js = jsText();
  // a unit (+ its .card-tie) crossing the nav line starts 6 px below the first screen; the first crossing one may lift the
  // whole first section instead (the element after .page-bg, ≤ 40 px and ≤ 34 % of the top padding)
  assert.match(js, /const f = \$\('\.page-bg \+ \*'\), a = \[\.\.\.\$\$\('\[data-fold\], \.tiles'\)\]/);
  assert.match(js, /Math\.min\(40, parseFloat\(getComputedStyle\(f\.parentElement\)\.paddingTop\) \* \.34\)/);
  assert.match(js, /querySelectorAll\('\.card-tie'\)\]\.map\(bottom\)\) - v \+ navH\(\) \+ 8/);
  assert.match(js, /d <= lift \? \[f, -d\] : \[el, v \+ 6 - t\]/);
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /\.page-rsvp \.site-main \{ display: grid/, 'no side-by-side form: it would always run under the nav');
  // desktop story (QA: half the first screen was an empty wall; final QA: at 650–760 px all three panels, or two of them,
  // were pushed below the first screen and a lone panel stood under the title): the three panels are ONE fold unit — in the
  // 3-column row site.js folds .tiles as a whole, never a panel alone; the panels shrink (≥ 140 px) until the row ends above
  // the nav; the head shrinks with the height (its padding beats the ≥ 768 px 150 px rule) and the panels do not stretch to
  // the row (a stretched panel's box ran to the row's end and folded on its own)
  const desk = /@media \(min-width: 1024px\) and \(min-aspect-ratio: 5\/4\) and \(min-height: 621px\) \{([\s\S]*?)\n\}/.exec(css);
  assert.ok(desk, 'desktop story block');
  assert.match(desk![1], /grid-template-columns: repeat\(3, var\(--tw\)\)/);
  assert.match(desk![1], /\.tile\.t-2 \{ margin-top: calc\(var\(--tw\) \* \.\d+\); \}/, 'the middle panel lower');
  assert.match(desk![1], /\.tile\.tile \{ grid-row: 1; margin: 0; align-self: start; \}/);
  assert.match(desk![1], /\.page-head\.page-head \{ padding-top: clamp\(\d+px, [\d.]+svh - \d+px, \d+px\); \}/);
  assert.match(desk![1], /\.page-title \{ font-size: clamp\(\d+px, [\d.]+svh - \d+px, \d+px\); \}/);
  const later = css.slice(css.indexOf(desk![0]) + desk![0].length);
  assert.match(later, /\.page-head \{ padding-top: 150px; \}/, 'the later ≥ 768 px rule the doubled selector has to beat');
  assert.match(js, /w > 140 && bottom\(g\) > sv\(\) - navH\(\) - 8;\) g\.style\.setProperty\('--tw'/);
  assert.match(js, /const g = tiles\(\), u = a\.filter\(\(e\) => e\.matches\(g \? ':not\(\.tile\)' : '\[data-fold\]'\)\)/, 'the row folds whole');
  // two columns (720–1023 px): the middle panel is offset by a margin, so a fold push moves it fully (align-self: center halved it)
  assert.match(css, /\.t-2 \{ grid-column: 2; grid-row: 1 \/ span 2; align-self: start; margin: calc\(var\(--tw\) \* \.\d+\) 0 0; \}/);
  // RSVP (final QA: with two-word names the signature folded and left up to 349 px of blank card): before it folds, the
  // signature unit shrinks — --sg from 1 down to .72: "With love,", the names (tighter lines), the tie and the room it
  // rests in; it folds (at full size) only when that is not enough
  assert.match(js, /for \(let k = 1; d > lift && k > \.73 && el\.matches\('\.sig-unit'\); d = D\(\)\) el\.style\.setProperty\('--sg', k -= \.04\);/);
  assert.match(js, /if \(d > lift\) el\.style\.removeProperty\('--sg'\);/);
  assert.match(rule('.sig-unit'), /--sg: 1; position: relative; padding-bottom: calc\(22cqw \* var\(--sg\)\)/);
  assert.match(rule('.rsvp-text .sign'), /font-size: calc\(11\.2cqw \* var\(--sg\)\); line-height: calc\(\.72 \+ \.4 \* var\(--sg\)\)/);
  assert.match(rule('.rsvp-text .love'), /margin-top: calc\(5\.4cqw \* var\(--sg\)\); font-size: calc\(10\.6cqw \* var\(--sg\)\)/);
  // the tie keeps its place on the card's edge (bot-h + 22cqw · sg below the names), 15cqw · sg past it at full size
  assert.match(css, /\.card-tie \{ position: absolute; z-index: 2; left: 50%; top: calc\(100% - 11\.28cqw \* var\(--sg\)\); width: calc\(38cqw \* var\(--sg\)\);/);
  assert.match(rule('.rsvp-text'), /padding: calc\(var\(--top-h\) \+ 2cqw\) 11% var\(--bot-h\)/);
});

// ---------------------------------------------------------------- the two first-screen rules, measured in a browser
// Playwright from the global install (docs/11 §13.3; never `playwright install`): the pages are rendered here with the
// engine and served from the theme folder, so the layout code (site.css + site.js folds/tiles) runs for real. Skipped when
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
// in the page: the nav line, the story panels (frame + caption) and the RSVP signature (names + tie), viewport px
const MEASURE = `(() => {
  const r = (e) => e.getBoundingClientRect(), nav = r(document.querySelector('.site-nav')).top;
  const tiles = [...document.querySelectorAll('.tiles .tile')].map((t) => ({ top: r(t.querySelector('.frame')).top, bottom: Math.max(r(t.querySelector('.frame')).bottom, r(t.querySelector('figcaption')).bottom) }));
  const sig = document.querySelector('.sig-unit'), units = [...document.querySelectorAll('.rsvp-text > [data-fold]:not(.sig-unit)')].map(r);
  const s = sig && { top: r(sig).top, ink: Math.max(r(sig.querySelector('.sign')).bottom, r(sig.querySelector('.card-tie')).bottom), card: r(document.querySelector('.rsvp-card')).bottom,
    above: Math.max(...units.filter((u) => u.top < innerHeight).map((u) => u.bottom)) };
  return { vh: innerHeight, nav, tiles, sig: s, sw: document.documentElement.scrollWidth };
})()`;

test('browser: the story row is one unit on desktop 650–800 px (never a lone panel) and ends above the nav; the RSVP signature + tie on the first screen at 390×844 (final QA)', async (t) => {
  await withBrowser(t, async (open) => {
    // story (final QA: at 1366×657, 1280×650, 1280×720 all three panels were pushed below the first screen — 247–308 px of
    // empty wall; at 1024×768, 1366×768, 1280×760, 1536×753 the left panel stood alone): demo, design range, stress
    for (const [w, h] of [[1280, 650], [1366, 657], [1280, 720], [1536, 753], [1280, 760], [1024, 768], [1366, 768], [1280, 800]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
        const m = await open('story', rec, w, h);
        const at = `story ${w}×${h} ${name}`;
        const on = m.tiles.filter((x: { top: number }) => x.top < m.vh).length;
        assert.equal(m.tiles.length, 3, at);
        assert.ok(on === 0 || on === 3, `${at}: ${on} of 3 panels on the first screen (never one or two alone)`);
        assert.equal(on, 3, `${at}: the three panels are on the first screen`);
        const end = Math.max(...m.tiles.map((x: { bottom: number }) => x.bottom));
        assert.ok(end <= m.nav, `${at}: the row ends above the nav (${Math.round(end)} > ${Math.round(m.nav)})`);
        assert.ok(m.nav - end <= 0.12 * m.vh, `${at}: ${Math.round(m.nav - end)} px of empty wall under the row (≤ 12 %)`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
      }
    }
    // RSVP 390×844 (the reference phone) and 430×932, 1280×800 with the design-range names ("Alexandrina Rose & Maximilian
    // James", final QA: unit pushed 349 px, 267 px of blank card): "With love," + the names + the tie end above the nav
    for (const [w, h] of [[390, 844], [430, 932], [1280, 800]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())]] as const) {
        const m = await open('rsvp', rec, w, h);
        const at = `rsvp ${w}×${h} ${name}`;
        assert.ok(m.sig.top < m.vh && m.sig.ink <= m.nav, `${at}: the signature unit on the first screen (top ${Math.round(m.sig.top)}, names + tie end ${Math.round(m.sig.ink)}, nav ${Math.round(m.nav)})`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
      }
    }
    // when it cannot fit (360×640: ~190 px needed, ~90 px + a ≤ 37 px lift left) it folds whole; the blank card above the
    // nav is then the space under the wait line, ≤ 110 px (was 97 / 107 px at 360×640 / 375×667 before, unchanged)
    for (const [w, h] of [[360, 640], [375, 667]]) {
      const m = await open('rsvp', rangeRecord(demo()), w, h);
      const at = `rsvp ${w}×${h} range`;
      if (m.sig.top >= m.vh) assert.ok(Math.min(m.sig.card, m.nav) - m.sig.above <= 110, `${at}: ${Math.round(Math.min(m.sig.card, m.nav) - m.sig.above)} px of blank card`);
      else assert.ok(m.sig.ink <= m.nav, `${at}: on the first screen, above the nav`);
    }
  });
});

test('nav and dress code: the GPT tile flower (frame_portrait crop) on a hairline (W1.2, W1.4)', () => {
  assert.equal(MANIFEST.tile_flower.source, 'frame_portrait');
  assert.ok(MANIFEST.tile_flower.files.length === 1 && MANIFEST.tile_flower.files[0].bytes < 10_000);
  for (const page of ['home', 'story', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page);
    assert.equal($('nav.site-nav > .orn[aria-hidden="true"] > img[src$="tile_flower-73.webp"]').length, 1, page);
  }
  const d = render('details').$;
  assert.equal(d('.dress > .orn > img[src$="tile_flower-73.webp"]').length, 1);
  assert.equal(d('.dress em[data-field="dress_code"]').text(), 'Summer formal');
});

test('home: The Day teaser lists the first four schedule rows (docs/11 §3.2: label · time)', () => {
  const c = demo();
  c.schedule = Array.from({ length: 6 }, (_, i) => ({ label: `Event ${i + 1}`, time: `${12 + i}:00`, location: null })) as ContentRecord['schedule'];
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  const rows = $('.pl-day .pl-sched .pl-row');
  assert.equal(rows.length, 6, 'every row in the source; CSS shows the first four');
  assert.equal(rows.first().text(), 'Event 1 · 12:00 PM');
  assert.match(cssText(), /\.pl-row:nth-child\(n\+5\) \{ display: none; \}/);
  assert.deepEqual(render('home').$('.pl-day .pl-row').map((_, el) => render('home').$(el).text()).get(), ['Ceremony · 4:00 PM', 'Cocktail Hour · 5:00 PM', 'Reception · 6:30 PM']);
});

test('home: the comp hero, a stacked Didone date on the invitation card, two tile panels in the wall, the reply-by line once', () => {
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.panel-link .pl-title').map((_, el) => home(el).text()).get(), ['Our Story', 'The Day']);
  assert.equal(home('.pl-story [data-slot="story_1"]').length, 1);
  assert.equal(home('.pl-day [data-slot="venue"]').length, 1);
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

test('lessons kept: first screen above the nav (fitNames + fold), names ≥ 36 px, landscape grid, ≥ 11 px text, no tap rectangle', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const js = jsText();
  assert.match(rule('.hero'), /padding-bottom: 27px/);
  assert.match(css, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 36);
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(js, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  assert.match(js, /const v = sv\(\), limit = v - navH\(\) - 8, below = v \+ 12/);
  assert.match(css, /\.hero \.scene-bg \{ position: absolute; z-index: 0; bottom: var\(--fold, 0px\); \}/);
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(css);
  assert.ok(land, 'short-landscape block');
  assert.match(land![1], /\.hero-inner \{\s*display: grid; grid-template: 1fr repeat\(6, auto\) 1fr \/ auto minmax\(0, 460px\)/);
  for (const [sel, row] of [['.hero .names', 2], ['.hero-date', 3], ['.hero-venue', 4], ['.hero-city', 5], ['.countdown', 6], ['.hero-cta', 7]] as const) {
    assert.match(land![1], new RegExp(`\\n  ${sel.replace(/\./g, '\\.')} \\{ grid-area: ${row} \\/ 2;`), `${sel} in row ${row} beside the card`);
  }
  const widths = [...rule('.hero-card').matchAll(/width: ([^;]+)/g)].map((m) => m[1]);
  assert.ok(widths.length >= 3 && widths.every((w) => w.startsWith('clamp(150px')), widths.join(' | '));
  for (const sel of ['.card-copy .kicker', '.rsvp-text .wait', '.cd-lbl', '.cue', '.invite-text .host', '.dateblock .wd', '.sched-row .time']) {
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(rule(sel));
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  // card copy: date · town on one line, else two, else lines drop; refitted when the card resizes
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'c'\], \[true, 'c s'\]\]\)/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  // motion: no empty wait after the card lands; the arrival / closing blossoms fly inside their section, behind its text,
  // in lanes beside the photo and the text column (G405 review: blossoms crossed the names, the closing line, the form)
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  assert.match(js, /arrive: +\[\{ file: 'img\/accent_2-200\.webp'[^\n]*avoid: '\.hero-inner > \*', host: '\.hero'/);
  for (const m of js.matchAll(/\{ file: 'img\/accent_\d-200\.webp'[^}]*\}/g)) {
    if (/origin: 'liner'/.test(m[0])) continue;
    assert.match(m[0], /avoid: '[^']+', host: '\.(hero|closing)'/, m[0]);
  }
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: last step of a scene ≤ 3000 ms; one entrance 600–1800 ms
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  // text floors: the ampersand never below 11 px; no lone separator when the town is empty
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-ml', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-ml'), { params: Promise.resolve({ slug: 'maren-and-theo-ml' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/mediterranean-lemon\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Isabella & Marco wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-ml/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-ml', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['img', 'env_cflap-880.webp'], ['img', 'closure-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'wall-540.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-ml' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-ml'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-ml', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.19' },
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-lemon-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-lemon-site/story'), { params: Promise.resolve({ slug: 'quiet-lemon-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-lemon-site'), { params: Promise.resolve({ slug: 'quiet-lemon-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-lemon-site/${page}`), { params: Promise.resolve({ slug: 'quiet-lemon-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
