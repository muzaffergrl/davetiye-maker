// Theme platform/themes/tropical-destination (design 12 · Tropical Destination, task G412) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json), the site.js contract, the editable design texts (G068) and the thank-you mode (G075). Browser
// checks (widths, short phones, opening flow, stress record, weight, video) live in scripts/theme-check.cjs
// --theme tropical-destination; G051 in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { COPY_MAX_CEILING, STANDARD_COPY, stressCopy } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'tropical-destination';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/12_Tropical_Destination/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'maya-and-kai';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-td-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/12_Tropical_Destination/content.demo.json). Fresh copy each call. */
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
    if (el.tagName === 'img' || field.startsWith('urls.') || field.startsWith('thank_you')) return;
    assert.equal($(el).text(), expected(content, field, $(el).attr('data-format') ?? ''), `${page}: ${field}`);
    n++;
  });
  return n;
}

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Tropical Destination');
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
    for (const opts of [{}, { previewKey: 'k'.repeat(20), thankYouPreview: true }]) {
      const { $ } = render(page, demo(), opts);
      $('[src], [href], [srcset]').each((_, el) => {
        const a = (el as unknown as { attribs: Record<string, string> }).attribs;
        for (const v of [a.src, a.href, ...(a.srcset ? a.srcset.split(',').map((c) => c.trim().split(/\s+/)[0]) : [])]) {
          if (v && v.startsWith(`/themes/${ID}/`)) refs.add(v.slice(`/themes/${ID}/`.length).split('?')[0]);
        }
      });
    }
  }
  for (const css of [cssText(), readFileSync(path.join(DIR, 'thank-you.css'), 'utf8')]) {
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  }
  for (const m of jsText().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', '__pycache__']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  // nothing in img/ that no page, stylesheet or script uses (docs/11 §1: no unused image)
  const base = (f: string) => f.replace(/^img\//, '').replace(/-\d+\.webp$/, '');
  const usedBases = new Set([...refs].map(base));
  for (const f of readdirSync(path.join(DIR, 'img'))) {
    if (f === 'manifest.json' || f === 'og-1200x630.jpg' || f === 'favicon.png') continue;
    assert.ok(usedBases.has(base(f)), `unused image ${f}`);
  }
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
  assert.ok(claim, '/start?theme=tropical-destination works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Maya');
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
    assert.equal($('main').length, 1, `${page}: main landmark`);
  }
  assert.ok(fields > 45, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Maya & Kai · June 19, 2027');
  assert.equal(index('h1').text(), 'Maya & Kai');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, June 19, 2027 · Wailea, Hawaii");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage').attr('aria-label'), 'Open the invitation');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'June 19, 2027 · Wailea', 'tag: date · town (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Maya & Kai');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Maya & Kai');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Ocean Lawn', 'The Sunset Deck', 'The Palm Pavilion']);
  assert.equal(details('.venue-place').text(), 'Wailea, Hawaii, USA');
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateline ${sel}`).text()), ['Saturday', 'June', '19', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-city').text(), 'Wailea, Hawaii');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  const rsvp = render('rsvp', content).$;
  assert.equal(rsvp('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(rsvp('.rsvp-venue .venue-name').text(), 'Coral Bay Resort');
  assert.equal(rsvp('.rsvp-venue .dress em').text(), 'Beach formal');
});

test('4 no personal text is hard-coded in the templates, the stylesheets or the script (the site record is the only source)', () => {
  const c = demo();
  const personal = [
    c.host_line, c.venue.name, c.venue.city, c.venue.region, c.dress_code, fmtDate(c.date), fmtDate(c.rsvp.deadline!),
    ...c.partners.flatMap((p) => [p.display_name, p.full_name]), ...c.schedule.map((s) => s.location),
    ...(c.story?.items ?? []).map((i) => i.caption), c.story?.intro,
  ].filter((s): s is string => typeof s === 'string' && s.length > 2);
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8').replace(/&amp;/g, '&');
    assert.deepEqual(personal.filter((s) => raw.includes(s)), [], `${page}.html contains personal text`);
    assert.doesNotMatch(raw, /Maya|Kai\b|Coral Bay|Wailea|Hawaii|Beach formal/, `${page}.html: W1 comp demo text`);
  }
  assert.deepEqual(personal.filter((s) => cssText().includes(s)), []);
  // site.js: only DEV_CONTENT (the static design preview) carries the demo record
  const js = jsText().replace(/const DEV_CONTENT = \{[\s\S]*?\n\};/, '');
  assert.deepEqual(personal.filter((s) => js.includes(s)), [], 'site.js outside DEV_CONTENT');
  assert.doesNotMatch(js, /textContent = [^;]*(CONTENT|SITE)\./, 'no personal text written by JS');
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
    assert.ok(!/Maya|Leilani|Coral Bay|Wailea|Hawaii/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
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
  assert.equal($('.lede').text(), 'Every adventure and every island sunset has brought us closer to June 19, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /closer to 19 June 2027\.$/);
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
  assert.equal(home('.tag-link').length, 1, 'only the venue tag (The Day) stays');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  assert.equal(render('rsvp', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Beach formal');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=resort';
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=resort');
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
  assert.match(cssText(), /html\[data-rsvp-replied\] \.closing \.title/);
  // G069: the guest-name row right after "Number of guests", in the form's own field style
  const tpl = cheerio.load($('template[data-rsvp-party]').html() ?? '');
  assert.equal($('template[data-rsvp-party]').length, 1);
  assert.equal($('template[data-rsvp-party]').prev().attr('data-rsvp-error-for'), 'guests');
  assert.equal(tpl('label.field [data-copy="form_party"]').length, 1);
  assert.equal(tpl('input').attr('maxlength'), '120');
  assert.equal(tpl('input').attr('name'), undefined);
  assert.equal(tpl('[data-rsvp-error-for="party"]').length, 1);
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

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments, GPT parts decorative', () => {
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
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Maya & Kai');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Island time');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Coral Bay Resort');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record, fonts

test('17 schedule of 1, 6 and 10 rows, long names, en-GB, the design range and the docs/11 §12 stress record render without warnings', () => {
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
  gb.name_display = 'Anne-Sophie Élodie & Kai';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '19 June 2027');
  assert.equal(render('details', gb).$('.sched-row .time').first().text(), '4:00 pm');
  for (const [name, rec] of [['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
    assert.ok(validateContent(rec).ok, JSON.stringify(validateContent(rec).errors));
    for (const page of PAGES) {
      const { $, warnings } = render(page, rec);
      assert.deepEqual(warnings, [], `${name} ${page}`);
      assertFieldsMatch($, rec, page);
    }
  }
  assert.equal(render('details', stressRecord(demo())).$('.sched-row').length, 10);
  assert.match(jsText(), /--names-scale/);
  assert.match(cssText(), /var\(--names-scale, 1\)/);
  // Dancing Script + Raleway (catalogue pair), both with latin-ext (accented names, docs/11 §12); two families, display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&family=Raleway:ital,wght@0,400;0,500;0,600;1,400&display=swap', page);
  }
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the resort?', a: 'Yes, by the palm garden.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20270620T020000Z/20270620T063000Z', `${page}: 4 PM HST to two hours after the reception`);
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
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the resort?', 'Can we bring our children?']);
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
  c.partners[0] = { display_name: 'Maya', full_name: null };
  c.partners[1] = { display_name: 'Kai', full_name: 'Kai Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Maya', 'Kai Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Maya Leilani', 'Kai Andrew']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateline|\.dl-|\.venue-|\.tag|\.tl-|\.card(?!-copy \.kicker)|\.closure|\.sprig|\.spray|\.rsvp-|\.dress|\.hero-/;
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
  // gradients only as borderless light / fade masks / the interface pill and nav (docs/11 §5.7)
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.hero-bg picture|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the corner clusters are whole GPT parts: no mask / clip on them
  for (const [, sel, body] of rules) if (/corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  // the only lines are 1 px interface dividers: the plumeria hairline (.orn), the date line's two separators (.vr)
  for (const [, sel, body] of rules) {
    if (/height: 1px|width: 1px/.test(body)) assert.match(sel, /\.orn::before|\.vr/, sel.trim());
  }
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
});

// ---------------------------------------------------------------- the wallet (docs/11 §7.2 kapak — cüzdan) and its opening

test('wallet (kapak — cüzdan): layers from the build, rounded flap + strap cut, curved pocket, alignment, closure anchored on the cut', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  const flap = st.cuts.cflap;
  assert.equal(flap.method, 'renk', 'the flap edge is found in the image');
  assert.ok(flap.ellipse.kept >= 0.7 * flap.ellipse.points, `ellipse fit ${flap.ellipse.kept}/${flap.ellipse.points}`);
  assert.ok(flap.traced_columns > flap.from_fit_columns, `traced ${flap.traced_columns} > from fit ${flap.from_fit_columns}`);
  assert.ok(flap.trace_minus_fit_px_p50_p95[1] <= 8);
  assert.deepEqual(flap.warnings, []);
  assert.ok(flap.strap.columns[1] - flap.strap.columns[0] >= 60, 'the strap is part of the flap layer');
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.equal(st.cuts.pocket.shape, 'egri');
  assert.deepEqual(st.cuts.pocket.warnings, []);
  assert.ok(st.cuts.pocket.edge_at.mid > st.cuts.pocket.edge_at.x0 + 100, 'a smile: the pocket edge dips in the middle');
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open wallet');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  for (const [k, v] of Object.entries(st.align_fix.after_px)) assert.ok(Math.abs(Number(v)) <= 1, `${k} ${v} px after the fix`);
  const css = cssText();
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure']) {
    const [, top, , h] = st.parts[k];
    assert.ok(css.includes(`top: ${top}%`) && css.includes(`height: ${h}%`), `${k}: stage percentages from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`transform-origin: 50% ${st.hinge_in_cflap_pct}%`), 'the flap turns on the hinge row');
  assert.ok(css.includes(`--w: calc(var(--obj) * var(--ok, 1) / ${pct(st.closed_obj.frac_w)})`));
  assert.ok(css.includes(`var(--w) * ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'the empty room above the wallet from the manifest');
  const cl = MANIFEST.closure;
  assert.equal(cl.measured_from, 'comps/web_1_envelope.png');
  assert.equal(cl.carried_by_flap, false, '"the brass snap pops open and the plumeria tab swings away" — before the flap lifts');
  assert.ok(Math.abs(cl.anchor_px[0] - flap.strap.axis_x) <= 2, 'anchored on the strap axis');
  assert.ok(Math.abs(cl.ball_center_px[0] - cl.anchor_px[0]) <= 1 && cl.ball_center_px[1] < cl.anchor_px[1], 'the snap sits on the strap, above the flap tip (W1.1)');
  assert.ok(Math.abs(cl.comp.closure_w_over_env_w - 0.445) < 0.01);
  assert.ok(css.includes(`transform-origin: ${cl.pivot_in_crop_pct[0]}% ${cl.pivot_in_crop_pct[1]}%`), 'the tab swings about the snap');
  assert.ok(existsSync(path.join(PLATFORM_ROOT, 'previews/g412/compare_closure.jpg')), 'compare_closure.jpg (docs/11 §7.1)');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top');
});

test('opening sentence: snap + tab first (≤ 250 ms), flap with strap, liner, the tag slides up, a monstera leaf and a white plumeria drift across', () => {
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|lift|open|flap|rise|forward|accents|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  assert.ok(E.closure[0] <= 250, 'first motion ≤ 250 ms');
  assert.ok(E.lift[0] >= 0.55 * E.closure[1], 'the flap lifts once the tab has swung away');
  assert.ok(E.flap[0] >= E.lift[0] + E.lift[1] - 40, 'the liner side takes over at 90°');
  assert.ok(E.rise[0] >= E.flap[0], 'the tag slides up after the flap flipped');
  assert.ok(E.accents >= E.rise[0] - 100 && E.accents <= E.rise[0] + 300, 'the leaf and the flower drift while the tag slides up');
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  assert.match(js, /A\(el\.closure, \[/, 'the closure moves on its own');
  assert.match(js, /A\(el\.cflap, \[/, 'the flap lifts on its own');
  // the snap pops (scale up), the tab swings about the snap (rotation) and leaves past the screen's right edge
  const tab = /A\(el\.closure, \[([\s\S]*?)\], E\.closure/.exec(js)![1];
  assert.match(tab, /T\(0, -SW \* \.\d+, -\d+, 1\.0\d, \{ offset: \.1\d/, 'pops');
  assert.match(tab, /T\(out, SW \* \.\d+, \d+, 1, \{ offset: \.9\d, opacity: 1 \}\),\s*T\(out, SW \* \.\d+, \d+, 1, \{ opacity: 0 \}\)\s*$/, 'leaves off screen, fully opaque until then (never fades on the wallet)');
  // "a monstera leaf and a white plumeria drift across the screen": accent_2 (monstera) × 1 and accent_1 (plumeria) × 1, across
  const open = /open: \[([\s\S]*?)\],\n\s+arrive/.exec(js)![1];
  const groups = [...open.matchAll(/\{ file: 'img\/(accent_\d)-200\.webp', count: (\d+), path: '(\w+)'/g)].map((m) => [m[1], Number(m[2]), m[3]]);
  assert.deepEqual(groups, [['accent_2', 1, 'across'], ['accent_1', 1, 'across']]);
  for (const [, d] of open.matchAll(/dur: \[\d+, (\d+)\]/g)) assert.ok(E.accents + Number(d) + 300 <= E.go + 300, 'settled before go');
  const st = MANIFEST.stage;
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(cssText().includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.photo_above_pocket <= 0.1, 'faces are not cut by the pocket edge while the tag waits');
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
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(js, /addEventListener\('pageshow'/, 'bfcache: back to an opened envelope');
});

// ---------------------------------------------------------------- this design: lagoon, tags, home

test('backdrop: the lagoon wash from flower-free bg_page crops, both clusters whole as layers, clean placeholders, no chroma key', () => {
  for (const page of PAGES) {
    const { $ } = render(page);
    const bg = $('.scene-bg, .page-bg').first();
    assert.equal(bg.attr('aria-hidden'), 'true', page);
    assert.equal(bg.find('img.scene-img').attr('src'), `/themes/${ID}/img/lagoon-${MANIFEST.lagoon.files[0].w}.webp`, page);
    assert.equal(bg.find('source').attr('srcset'), `/themes/${ID}/img/lagoon_wide-${MANIFEST.lagoon_wide.files[0].w}.webp`, page);
    for (const c of ['corner-tl', 'corner-br']) {
      const img = bg.find(`img.${c}`);
      assert.equal(img.length, 1, `${page}: ${c}`);
      assert.equal(img.attr('loading'), undefined, `${page}: ${c} in the first view (no lazy)`);
      assert.match(img.attr('srcset') ?? '', /-800\.webp 800w/, `${page}: ${c} 800 px variant (DPR 3 phones)`);
    }
    assert.ok(bg.find('img.float').length >= 2, `${page}: loose flowers on the wash`);
  }
  assert.ok(MANIFEST.lagoon.top_crop && MANIFEST.lagoon.bottom_crop && MANIFEST.lagoon_wide.crop, 'crops recorded');
  for (const key of Object.keys(theme.manifest.photos)) {
    assert.ok(MANIFEST[`ph_${key}`].min_lum >= 170, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
    assert.ok(MANIFEST[`ph_${key}`].decor_px <= 40, `ph_${key}: no flower or leaf in the crop`);
  }
  assert.equal(MANIFEST.checks.green_check.chroma_key_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
  // the leaf maps in site.js are the build's (16 × 16 alpha of florals_tl / florals_br)
  const map = /const MAP = \{ tl: '([0-9a-f]{64})', br: '([0-9a-f]{64})' \}/.exec(jsText());
  assert.ok(map);
  assert.deepEqual([map![1], map![2]], [MANIFEST.florals_tl.map16, MANIFEST.florals_br.map16]);
});

test('story: three kraft luggage tags hanging from their strings, swinging in one by one (zigzag on phones, ≥ 38vw window; a row from 720 px)', () => {
  const { $ } = render('story');
  const tags = $('.tags .tag');
  assert.equal(tags.length, 3);
  assert.deepEqual(tags.map((_, el) => $(el).attr('data-scene')).get(), ['story-tag', 'story-tag', 'story-tag'], 'each tag its own scene');
  assert.deepEqual($('.tags .tag-art').map((_, el) => $(el).attr('data-a')).get(), ['swing', 'swing', 'swing']);
  assert.equal($('.tags .tag-art > .tag-sway > img.frame-img[src$="frame_portrait-320.webp"]').length, 3);
  assert.deepEqual($('.tags .tuck').map((_, el) => $(el).attr('src')!.replace(/^.*img\//, '')).get(),
    ['accent_1-200.webp', 'accent_2-200.webp', 'accent_3-200.webp'], 'a plumeria, a monstera leaf, a hibiscus tucked at the tags');
  const css = cssText();
  assert.match(css, /\.js \[data-a="swing"\] \{[^}]*transform: rotate\(var\(--sw, \d+deg\)\)[^}]*transform-origin: var\(--so, 50% 0\)/);
  const [sx] = MANIFEST.frame_portrait.string_top_pct;
  assert.ok(css.includes(`--so: ${sx}% 0%`) && css.includes(`transform-origin: ${sx}% 0%`), 'the swing turns on the string\'s top (manifest)');
  assert.match(css, /@keyframes sway \{ from \{ transform: rotate\(-1\.\d+deg\); \} to \{ transform: rotate\(1\.\d+deg\); \} \}/);
  const tw = Number(/\.tags \{[^}]*--tw: min\((\d+)vw/.exec(css)![1]);
  const win = MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(tw * win >= 38, `phone photo window ${(tw * win).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(rule('.t-2'), /margin-left: auto/, 'the middle tag on the right (zigzag)');
  assert.match(css, /@media \(min-width: 720px\) \{\n  \/\* the comp's row at slightly different heights \*\/\n  \.tags \{[^}]*grid-template-columns: repeat\(3, var\(--tw\)\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.js \.tag-sway[^}]*animation: none !important/);
  assert.match(jsText(), /'story-tag': \[\['tag', 0\], \['caption', \d+\]\]/);
});

test('home: the comp hero (tag, names, date, venue, countdown, pill), the invitation on the arch card, two kraft tags, the reply-by line once', () => {
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.hero-inner').children().map((_, el) => (home(el).attr('class') ?? '').split(' ').slice(0, 2).join(' ')).get().slice(0, 7),
    ['card hero-card', 'script names', 'kicker hero-date', 'hero-venue', 'hero-city', 'countdown', 'hero-cta']);
  assert.deepEqual(home('.tag-link .tl-title').map((_, el) => home(el).text()).get(), ['Our Story', 'The Day']);
  assert.equal(home('.tl-story [data-slot="story_1"]').length, 1);
  assert.equal(home('.tl-day [data-slot="venue"]').length, 1);
  assert.equal(home('.paper.info.invite').attr('data-a'), 'set', 'a painted card is set down, always opaque');
  assert.deepEqual(home('.tl-day .tl-row').map((_, el) => home(el).text()).get(), ['Ceremony · 4:00 PM', 'Cocktail Hour · 5:00 PM', 'Reception · 6:30 PM']);
  assert.match(cssText(), /\.tl-row:nth-child\(n\+5\) \{ display: none; \}/);
  // short phones: the tag beside the names (the first screen ends above the nav; theme-check "home first screen")
  assert.match(cssText(), /@media \(max-aspect-ratio: 3\/4\) and \(max-height: 700px\) \{[\s\S]*?\.hero-inner \{ grid-template-columns: auto minmax\(0, 1fr\)/);
  for (const page of PAGES) {
    const { $: p } = render(page);
    p('img').each((_, el) => {
      const src = p(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || /^accent_/.test(m[1]) || p(el).attr('data-photo-state') === 'user') return;
      if ((MANIFEST[m[1]]?.files ?? []).length < 2) return;
      assert.ok(p(el).attr('srcset') && p(el).attr('sizes'), `${page}: ${src} has srcset + sizes (docs/11 §5.5)`);
    });
  }
});

test('lessons kept: names ≥ 32 px on home, fold below the first screen, tag copy refit, ≥ 11 px text, budgets, timings', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const js = jsText();
  assert.match(css, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 32);
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: false, names_min_px: Number(floor![1]) });
  assert.match(js, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  assert.match(js, /const v = sv\(\), limit = v - navH\(\) - 8, below = v \+ 12/);
  assert.match(css, /\.hero \.scene-bg \{ position: absolute; z-index: 0; bottom: var\(--fold, 0px\); \}/);
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'c'\], \[true, 'c s'\]\]\)/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  for (const sel of ['.card-copy .kicker', '.cd-lbl', '.cue', '.invite-text .host', '.dateline .wd', '.sched-row .time', '.rsvp-text .kicker', '.kicker']) {
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(rule(sel));
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  assert.match(rule('.amp'), /font-size: max\(11px, \.5em\)/);
  assert.match(cssText(), /\.card-copy \.kicker:has\(\.cc-city\[data-empty\]\) \.sep/);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  for (const m of js.matchAll(/\{ file: 'img\/accent_\d-200\.webp'[^}]*path: 'fall'[^}]*\}/g)) assert.match(m[0], /avoid: '[^']+', host: '\.(hero|closing)'/, m[0]);
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: last step of a scene ≤ 3000 ms, first ≤ 150 ms; one entrance 600–1800 ms; stagger 150–250, batchGap 300–450
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  const stagger = Number(/stagger: (\d+)/.exec(js)![1]), gap = Number(/batchGap: (\d+)/.exec(js)![1]);
  assert.ok(stagger >= 150 && stagger <= 250 && gap >= 300 && gap <= 450);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
  // reduced motion: entrances, the hint, the loose flowers and the swinging tags stand still
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.js \[data-step\] \{ opacity: 1 !important;/);
});

test('smooth scrolling only for the RSVP page\'s #reply jump, never with reduced motion', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/scroll-behavior: smooth/g) || []).length, 1);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ html:has\(#reply\) \{ scroll-behavior: smooth; \} \}/);
  for (const page of ['index', 'home', 'story', 'details'] as const) assert.equal(render(page).$('#reply').length, 0, `${page}: no #reply`);
});

// ---------------------------------------------------------------- 24: G068 editable design texts, G075 thank-you mode

test('24 G068: theme.json copy = the templates, no unmarked visible text, standard keys only; every key at its max renders', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], `run node scripts/copy-manifest.ts --theme ${ID}`);
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const k of ['envelope_kicker', 'card_line', 'invite_request', 'rsvp_title', 'rsvp_by', 'story_title', 'day_title', 'schedule_title', 'nav_home', 'nav_rsvp', 'form_send', 'rsvp_closed_title', 'ty_kicker', 'form_party'])
    assert.ok(theme.manifest.copy[k], k);
  for (const [k, e] of Object.entries(theme.manifest.copy)) assert.ok([...e.default].length <= e.max && e.max <= COPY_MAX_CEILING, k);
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy);
  for (const page of PAGES) {
    for (const thankYou of [false, true]) {
      const out = render(page, c, { previewKey: thankYou ? 'k'.repeat(20) : undefined, thankYouPreview: thankYou });
      assert.deepEqual(out.warnings, [], `${page} thank-you ${thankYou}`);
      if (out.disabled) continue;
      out.$('[data-copy]').each((_, el) => assert.equal(out.$(el).text(), c.copy![out.$(el).attr('data-copy')!], `${page} ${out.$(el).attr('data-copy')}`));
    }
  }
});

test('G075 thank-you mode: every docs/11 §3.6 marker; the tag shows the thank-you title, photo or the brass snap; no placeholder', () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  assert.deepEqual(thankYouSupport(pages), { complete: true, partial: false, missing: [] });
  const c = demo();
  c.thank_you = { mode: 'on', title: 'Thank you, friends', message: 'Line one\nLine two' } as ContentRecord['thank_you'];
  c.copy = { ty_kicker: 'Grateful hearts' };
  const index = render('index', c).$;
  assert.equal(index('.env-head .kicker').text(), 'Grateful hearts');
  assert.equal(index('.ty-title').text(), 'Thank you, friends');
  assert.equal(index('img[data-photo]').length, 0, 'no photo placeholder in thank-you mode');
  assert.equal(index('.ty-decor img').attr('src'), `/themes/${ID}/img/closure-320.webp`, 'without a photo: the brass snap with its plumeria');
  const home = render('home', c).$;
  assert.equal(home('.countdown').length, 0);
  assert.equal(home('.hero-cta').length, 0);
  assert.equal(home('.ty-message').text(), 'Line one\nLine two');
  assert.equal(home('a[data-calendar]').length, 0);
  assert.equal(home('link[href$="thank-you.css"]').length, 1);
  assert.equal(render('home').$('link[href$="thank-you.css"]').length, 0, 'thank-you.css only after the wedding');
  const rsvp = render('rsvp', c).$;
  assert.equal(rsvp('h1').text(), 'Replies are closed');
  assert.equal(rsvp('form').length, 0);
  assert.equal(rsvp('a.btn[href$="/home"]').text(), 'Home');
  const hide = demo();
  hide.thank_you = { mode: 'on', details: 'hide' } as ContentRecord['thank_you'];
  assert.equal(render('details', hide).disabled, true, 'the couple hid The Day: 404');
  assert.equal(render('story', hide).$(`a[href="/${SLUG}/details"]`).length, 0);
  assert.match(readFileSync(path.join(DIR, 'thank-you.css'), 'utf8'), /\.ty-message \{[^}]*white-space: pre-line/);
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-td', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-td'), { params: Promise.resolve({ slug: 'maren-and-theo-td' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/tropical-destination\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Maya & Kai wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-td/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-td', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'env_cflap-567.webp'], ['img', 'closure-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'lagoon-504.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-td' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-td'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-td', {
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-lagoon-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-lagoon-site/story'), { params: Promise.resolve({ slug: 'quiet-lagoon-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-lagoon-site'), { params: Promise.resolve({ slug: 'quiet-lagoon-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-lagoon-site/${page}`), { params: Promise.resolve({ slug: 'quiet-lagoon-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
