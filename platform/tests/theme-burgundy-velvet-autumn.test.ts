// Theme platform/themes/burgundy-velvet-autumn (design 07 · Burgundy Velvet Autumn, task G407) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract; the thank-you version (G075, §3.6), the editable design texts (G068,
// §3.7) and the guest-names row (G069/G084) of this theme. Browser checks (widths, short phones, landscape, opening flow,
// stress record, weight, video) live in scripts/theme-check.cjs --theme burgundy-velvet-autumn; G051 in tests/g051-browser.ts;
// the first-screen rules of this design are measured below with the global Playwright (skipped without it).

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { THANK_YOU_DEFAULT_TITLE } from '../lib/content/thank-you.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { STANDARD_COPY, stressCopy, COPY_MAX_CEILING } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';
import { thankYouSupport } from '../lib/theme/thank-you-support.ts';
import { listThemes, loadTheme, PAGE_NAMES, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'burgundy-velvet-autumn';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/07_Burgundy_Velvet/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'rosalind-and-edward';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-bv-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/07_Burgundy_Velvet/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string; now?: Date; thankYouPreview?: boolean } = {}) {
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
  assert.equal(theme.manifest.name, 'Burgundy Velvet Autumn');
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
  const ty = demo();
  ty.thank_you = { mode: 'on' };
  for (const content of [demo(), ty]) {
    for (const page of PAGES) {
      const { $ } = render(page, content);
      $('[src], [href], [srcset]').each((_, el) => {
        const a = (el as unknown as { attribs: Record<string, string> }).attribs;
        for (const v of [a.src, a.href, ...(a.srcset ? a.srcset.split(',').map((c) => c.trim().split(/\s+/)[0]) : [])]) {
          if (v && v.startsWith(`/themes/${ID}/`)) refs.add(v.slice(`/themes/${ID}/`.length));
        }
      });
    }
  }
  for (const css of ['site.css', 'thank-you.css']) {
    for (const m of readFileSync(path.join(DIR, css), 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  }
  for (const m of jsText().matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 45, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.equal(MANIFEST.og.align, 'alt', 'web_hero cropped from the bottom: envelope + bow whole, no text');
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', '__pycache__']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // docs/11 §6: no single WebP over 250 KB (≤ 200 KB in a first view: the largest first-view parts are named here)
  for (const f of readdirSync(path.join(DIR, 'img')).filter((n) => n.endsWith('.webp'))) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 250 * 1024, `${f} ≤ 250 KB`);
  }
  for (const f of ['florals_tl-720.webp', 'florals_br-720.webp', 'env_body-880.webp', 'card_small-640.webp', 'info_card-837.webp']) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 200 * 1024, `${f} ≤ 200 KB (first view)`);
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
  assert.ok(claim, '/start?theme=burgundy-velvet-autumn works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Rosalind');
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
  assert.equal(index('title').text(), 'Rosalind & Edward · October 23, 2027');
  assert.equal(index('h1').text(), 'Rosalind & Edward');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, October 23, 2027 · Asheville, North Carolina");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(index('.card-copy .kicker').text(), 'October 23, 2027 · Asheville', 'card: date · town (W1.2)');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Rosalind & Edward');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Rosalind & Edward');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Chapel Lawn', 'The Hearth Room', 'The Great Hall']);
  assert.equal(details('.venue-place').text(), 'Asheville, North Carolina, USA');
  const home = render('home', content).$;
  assert.deepEqual(['.mon', '.wd', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['October', 'Saturday', '23', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-city').text(), 'Asheville, North Carolina', 'W1.2: city, region');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
});

test('4 no personal text is hard-coded in the templates or the stylesheets (the site record is the only source)', () => {
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
  for (const css of ['site.css', 'thank-you.css']) assert.deepEqual(personal.filter((s) => readFileSync(path.join(DIR, css), 'utf8').includes(s)), []);
  // W1 comp demo text is a layout reference only
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Rosalind|Edward|Hawthorne|Asheville|Carolina|Chapel Lawn|Hearth/);
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
    assert.ok(!/Rosalind|Edward|Hawthorne|Asheville|Carolina/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
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
  assert.equal($('.lede').text(), 'Warm cider, long autumn walks and many cozy evenings in between brought us to October 23, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /brought us to 23 October 2027\.$/);
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
  assert.equal(home('.teaser').length, 1, 'only the venue frame (The Day) stays');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Formal attire');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=hall';
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=hall');
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

test('G069/G084 guest names: one <template data-rsvp-party> row right after "Number of guests", in the form\'s own field style', () => {
  const raw = cheerio.load(readFileSync(path.join(DIR, 'rsvp.html'), 'utf8'));
  const tpl = raw('form[data-rsvp-form] template[data-rsvp-party]');
  assert.equal(tpl.length, 1);
  assert.ok(tpl.prev().is('[data-rsvp-error-for="guests"]'), 'right after the guests field (and its error slot)');
  const row = cheerio.load(tpl.html()!);
  assert.equal(row('label.field').length, 1, 'the form\'s own .field style (no new decoration)');
  assert.equal(row('[data-copy="form_party"]').text(), 'Name of guest');
  assert.equal(row('[data-rsvp-party-number]').length, 1);
  assert.equal(row('[data-copy="form_optional"]').length, 1);
  assert.equal(row('input').length, 1);
  assert.equal(row('input').attr('name'), undefined, 'form.js names it party:<n>');
  assert.equal(row('input').attr('maxlength'), '120');
  assert.equal(row('[data-rsvp-error-for="party"]').length, 1);
  const { $, warnings } = render('rsvp', { ...demo(), copy: { form_party: 'Guest name' } });
  assert.deepEqual(warnings, []);
  assert.match($('template[data-rsvp-party]').html()!, /Guest name/);
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
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Rosalind & Edward');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'By the fire');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'Hawthorne Hall');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    // every GPT part is decorative (alt=""); only photos carry content alt text
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record

test('17 schedule of 1, 6 and 10 rows, long names, en-GB, the design-range and §12 stress records render without warnings', () => {
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
  gb.name_display = 'Anne-Sophie Élodie & Edward';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '23 October 2027');
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
  // Pinyon Script + Cinzel (catalogue) + Cormorant Garamond (the comp's italic venue / place lines and the body text; Cinzel
  // has capitals only): three families (docs/11 §6), all with latin-ext (accented names, §12), display=swap
  for (const page of PAGES) {
    const href = render(page).$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
    assert.equal(href, 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Pinyon+Script&display=swap', page);
  }
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the hall?', a: 'Yes, by the chapel lawn.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20271023T200000Z/20271024T003000Z', `${page}: 4 PM EDT to two hours after the reception`);
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
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the hall?', 'Can we bring our children?']);
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
  c.partners[0] = { display_name: 'Ros', full_name: null };
  c.partners[1] = { display_name: 'Edward', full_name: 'Edward Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Ros', 'Edward Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Rosalind Mae', 'Edward James']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const rules = cssRules();
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.drow|\.venue-(sec|text|photo|name|place)|\.teaser|\.t-|\.card(?!-tie)|\.frame|\.closure|\.cl-|\.hang|\.garland|\.swag|\.glow|\.orn/;
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
  // gradients only as borderless light / fade masks / the interface pill and nav ground (docs/11 §5.7): candlelight on the
  // wall, the wall's fade below the first screen, the candle glow behind the rising card, the nav's soft ground, the pill
  for (const [, sel, body] of rules) {
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /body::before|\.hero-bg picture|^\s*\.glow\s*$|^\s*\.site-nav\s*$|^\s*\.btn\s*$/, sel.trim());
  }
  // the dahlia clusters are whole GPT parts: no mask / clip on them
  for (const [, sel, body] of rules) if (/corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, sel.trim());
  // the nav: no hard top edge and an opaque label row nothing ghosts through
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top/, '.site-nav: no hard band');
  assert.match(nav, /mask: linear-gradient\(transparent, #000 \d+px\)/, 'the top edge fades');
  const alphas = [...nav.matchAll(/rgba\(242, 212, 190, (\.\d+)\) \d+px, rgba\(242, 212, 190, (\.\d+)\)/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(alphas.length === 2 && alphas.every((a) => a >= 0.96), `label row ≥ .96 (${alphas})`);
  // the only lines are 1 px interface dividers: the charm / sprig hairlines, the date row's and the wide schedule row's
  // two dividers
  for (const [, sel, body] of rules) {
    if (/(^|;|\s)height: 1px/.test(body)) assert.match(sel, /\.orn::before/, sel.trim());
    if (/(^|;|\s)width: 1px/.test(body)) assert.match(sel, /\.drow \.day::before|\.sched-row \.label::before/, sel.trim());
  }
});

// ---------------------------------------------------------------- the envelope (docs/11 §7.1/§7.3 kapak, wrapped closure)

test('envelope (kapak, dikdörtgen kapak, sarılı kurdele): layers from the build, measured alignment, the ribbon cut at the knot', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'cl_l', 'cl_c', 'cl_r', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.equal(st.cuts.cflap.method, 'renk', 'the straight flap edge (rounded corners) is found in the image');
  assert.equal(st.cuts.cflap.shape, 'egri');
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.equal(st.cuts.pocket.shape, 'trapez');
  assert.deepEqual(st.cuts.pocket.warnings, []);
  assert.equal(st.cuts.pocket.liner_below_edge_px, 0, 'no liner on the pocket where the card passes');
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.ok(st.checks.closure_pieces_overlap_diff <= 0.01, 'the three ribbon pieces recompose the closure');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  // measured transforms: the open envelope sits on the closed one; the ribbon ends on the envelope's edges (±2 px)
  for (const [k, v] of Object.entries(st.align_fix.after_px)) assert.ok(Math.abs(Number(v)) <= 1, `${k} ${v} px after the fix`);
  for (const [k, v] of Object.entries(MANIFEST.closure.align_fix.after)) assert.ok(Math.abs(Number(v)) <= 2, `${k} ${v} px after the fix`);
  assert.equal(MANIFEST.closure.wrapped, true, 'wrapped closure: the same canvas as the envelope, 1:1');
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  const css = cssText();
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket']) {
    const [, top, , h] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`) && css.includes(`height: ${pct(h)}%`), `${k}: stage percentages from the manifest`);
  }
  for (const k of ['cl_l', 'cl_c', 'cl_r']) {
    const [l, top, w, h] = st.parts[k];
    assert.ok(css.includes(`.${k.replace('_', '-')} { left: ${pct(l)}%; top: ${pct(top)}%; width: ${pct(w)}%; height: ${pct(h)}%;`), `${k} from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  assert.ok(css.includes(`var(--w) * ${pct(st.closed_obj.top_frac_of_stage_w)}`), 'empty stage top from the manifest');
  assert.ok(css.includes(`--w: calc(var(--obj) * var(--ok, 1) / ${pct(st.closed_obj.frac_w)})`), 'closed envelope share of the stage from the manifest');
  assert.ok(jsText().includes(`${pct(st.closed_obj.top_frac_of_stage_w)}`), 'envFit uses the same empty top');
  assert.ok(css.includes(`.glow { position: absolute; left: ${st.card_front_center_pct[0]}%; top: ${st.card_front_center_pct[1]}%;`), 'the candle glow around the card\'s last place');
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'glow', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap', 'closure'], 'layer order bottom → top');
  assert.deepEqual($('.closure').children().map((_, el) => $(el).attr('class')).get(), ['cl-l', 'cl-c', 'cl-r']);
  assert.ok(css.includes(`.env .card { position: absolute; left: ${st.parts.card[0]}%; top: ${st.parts.card[1]}%;`), 'card top from the manifest');
  assert.ok(st.card_path.photo_above_pocket <= 0.1, 'the card waits low in the pocket: faces never cut by the pocket edge');
  const js = jsText();
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
});

test('envelope opening = the catalogue sentence: the bow unties and the ribbon slides off the sides, the flap lifts, the card rises in candlelight, one copper leaf drifts down', () => {
  const js = jsText();
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'glow', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  const E = Object.fromEntries([...js.matchAll(/\n\s+(closure|lift|flap|glow|rise|accents|go):\s+(\[\d+, \d+\]|\d+)/g)].map(([, k, v]) => [k, JSON.parse(v)]));
  assert.ok(E.closure[0] <= 250, 'first motion ≤ 250 ms (docs/11 §7.1)');
  assert.ok(E.lift[0] >= E.closure[0] + 0.8 * E.closure[1], 'the flap lifts once the ribbon has slid off (it crosses the flap edge)');
  assert.ok(E.flap[0] > E.lift[0] && E.rise[0] > E.flap[0], 'then the open flap, then the card');
  assert.ok(E.glow[0] <= E.rise[0] && E.glow[0] + E.glow[1] >= E.rise[0] + 600, 'the card rises in warm candlelight');
  assert.ok(E.go >= 3200 && E.go <= 5000, `tap → home ${E.go} ms (docs/11 §6)`);
  // the three pieces move on their own: the halves to the left / right (mirrored), the band with the knot and charm down;
  // they fade only in the last part of their path (past the envelope's edges), never at rest
  assert.match(js, /A\(el\.clL, side\(-1\), E\.closure/);
  assert.match(js, /A\(el\.clR, side\(1\), E\.closure/);
  assert.match(js, /A\(el\.clC, \[T\(0, 0, 0, 1, 0\), T\(0, SH \* \.012, 0, 1, \.28\), T\(0, SH \* \.22, 0, 1, \.66\), T\(0, SH \* \.4, 0, 0, 1\)\]/);
  const side = /const side = \(s\) => \[([^\n]*)\];/.exec(js)![1];
  assert.match(side, /T\(0, 0, 0, 1, 0\), T\(s \* SW \* \.02, SH \* \.008, s \* 6, 1, \.28\)/, 'unties: the halves part a little, ≤ 7°');
  assert.match(side, /T\(s \* SW \* \.5, SH \* \.05, s \* 12, 0, 1\)$/, 'ends half a stage out, gone');
  assert.ok(MANIFEST.stage.parts.cl_l[0] + MANIFEST.stage.parts.cl_l[2] <= 50 && MANIFEST.stage.parts.cl_r[0] >= 50, 'halves meet at the knot');
  assert.match(js, /A\(el\.cflap, \[/, 'the flap lifts on its own');
  assert.match(js, /A\(el\.glow, \[\{ opacity: 0 \}, \{ opacity: 1 \}\], E\.glow/);
  // "… while a single copper leaf drifts down": accent_1 (the copper maple leaf) × 1, falling beside the rising card, gone
  // before go
  assert.match(js, /open: \[\{ file: 'img\/accent_1-194\.webp', count: 1, path: 'fall', origin: 'card'[^\n]*avoid: '\.env \.card'/);
  const dur = /open: \[\{[^\n]*dur: \[(\d+), (\d+)\]/.exec(js)!;
  assert.ok(E.accents + Number(dur[1]) <= E.go, 'the leaf has settled before go');
  assert.ok(E.accents >= E.rise[0], 'while the card rises');
});

test('the card lands visibly on home; replay has no floating card; the opened state hides the hint and keeps the candlelight', () => {
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(rule('.hero-card'), /view-transition-name:\s*invite-card/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(cssText(), /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  const js = jsText();
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  assert.match(rule('.is-opened .glow'), /opacity:\s*1/);
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
});

// ---------------------------------------------------------------- this design: wall, garland, frames, cards

test('phone backdrop: the candlelit wall from flower-free bg_page crops, both dahlia clusters whole as layers, clean placeholders', () => {
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
    assert.ok(MANIFEST[`ph_${key}`].min_lum >= 155, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
    assert.ok(MANIFEST[`ph_${key}`].max_sat <= 60, `ph_${key}: no dahlia or leaf in the crop (${MANIFEST[`ph_${key}`].max_sat})`);
  }
  assert.equal(MANIFEST.checks.green_check.chroma_key_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
  // the leaf maps in site.js are the build's (WebP alpha of florals_tl / florals_br)
  assert.ok(jsText().includes(`const MAP = { tl: '${MANIFEST.florals_tl.leaf_map}', br: '${MANIFEST.florals_br.leaf_map}' }`));
});

test('story: the velvet garland — one GPT swag with three gold frames tied along it from 720 px, one swag per frame on phones; each frame drops on its bow and sways; window ≥ 38vw', () => {
  const { $ } = render('story');
  assert.equal($('.garland > img.swag-wide[src*="velvet_swag"]').length, 1);
  const hangs = $('.garland > figure.hang');
  assert.equal(hangs.length, 3);
  assert.deepEqual(hangs.map((_, el) => $(el).attr('data-scene')).get(), ['story-frame', 'story-frame', 'story-frame'], 'each frame its own scene (tied one after another)');
  assert.equal($('.hang > img.swag-unit[src*="velvet_swag"]').length, 3);
  assert.deepEqual($('.hang > .frame').map((_, el) => `${$(el).attr('data-a')} ${$(el).hasClass('sway')}`).get(), ['hang true', 'hang true', 'hang true']);
  const css = cssText();
  assert.match(css, /\.js \.sway \{ transform-origin: 50% 0; animation: sway [\d.]+s ease-in-out infinite alternate; \}/);
  assert.match(css, /@keyframes sway \{ from \{ rotate: -1\.2deg; \} to \{ rotate: 1\.2deg; \} \}/, 'sways slightly');
  assert.match(css, /\.js \[data-a="hang"\] \{ transform: translate3d\(0, -22px, 0\) rotate\(-5deg\); transform-origin: 50% 0;/);
  // phone frame width × the window's share ≥ 38vw (docs/11 §9)
  const vw = Number(/\.hang \.frame \{ z-index: 1; width: (\d+)vw;/.exec(css)![1]);
  assert.ok(vw * MANIFEST.photo_slots.portrait.box_pct[2] / 100 >= 38, `phone photo window ${(vw * MANIFEST.photo_slots.portrait.box_pct[2] / 100).toFixed(1)}vw`);
  // strap tops on the ribbon: the measured ribbon (manifest velvet_swag.hang) at 26 / 50 / 74 %, 30 % into its thickness
  const strap = (h: { top_pct_of_w: number; bottom_pct_of_w: number }) => +(h.top_pct_of_w + 0.3 * (h.bottom_pct_of_w - h.top_pct_of_w)).toFixed(2);
  const [a, b, c] = MANIFEST.velvet_swag.hang.map(strap);
  assert.deepEqual(MANIFEST.velvet_swag.hang.map((h: { x_pct: number }) => h.x_pct), [26, 50, 74]);
  assert.ok(Math.abs(a - 16.68) < .05 && Math.abs(b - 21.67) < .05 && Math.abs(c - 16.29) < .05, `${a} ${b} ${c}`);
  assert.match(css, /\.hang \{ width: 23%; margin: 16\.68% 0 6px 14%; flex: none; \}/);
  assert.match(css, /\.h-2 \{ margin-top: 21\.67%; margin-left: 1\.5%; \}/, 'the middle frame lowest (W1.3)');
  assert.match(css, /\.h-3 \{ margin-top: 16\.29%; margin-left: 1\.5%; \}/);
  // phones: the strap meets the ribbon of its own swag at the dip (swag height 28.823 % of its width)
  assert.equal(MANIFEST.velvet_swag.aspect_hw, 0.28823);
  assert.match(css, /margin: -7\.15vw auto 0; \} \/\* 28\.823 − 21\.67/);
  assert.equal($('.garland .hang[data-fold]').length, 3, 'on phones each frame is a fold unit');
  assert.match(jsText(), /for \(let w = g\.offsetWidth; w > 560 && bottom\(g\) > sv\(\) - navH\(\) - 8;\) g\.style\.setProperty\('--gw'/);
});

test('inner pages (story, details, rsvp): the candlelit wall of W1.3–W1.5 behind the first screen — wall crop, both clusters whole, loose pieces', () => {
  for (const page of ['story', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page);
    const bg = $('.page-bg');
    assert.equal(bg.length, 1, page);
    assert.equal(bg.attr('aria-hidden'), 'true');
    assert.equal(bg.find('img.scene-img').attr('src'), `/themes/${ID}/img/wall-${MANIFEST.wall.files[0].w}.webp`);
    for (const c of ['corner-tl', 'corner-br']) {
      const img = bg.find(`img.${c}`);
      assert.equal(img.length, 1, `${page}: ${c}`);
      assert.equal(img.attr('loading'), undefined, `${page}: ${c} in the first view`);
      assert.match(img.attr('srcset') ?? '', /-720\.webp 720w/, `${page}: ${c} 720 px variant`);
    }
    assert.ok(bg.find('img.float').length >= 2, `${page}: loose pieces on the wall`);
  }
  assert.match(rule('.page-bg'), /height: 100svh/);
  assert.match(rule('.page-bg .corner-br'), /bottom: calc\(var\(--nav-h\) \+ \d+px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(rule('.hero .scene-bg .corner-br'), /bottom: 22px/);
  assert.match(jsText(), /c\.style\.bottom = `\$\{Math\.max\(22, top\(bg\) \+ bg\.offsetHeight - sv\(\) \+ navH\(\) \+ 2\)\}px`/);
});

test('cards (docs/11 §9 3-slice): only plain paper is stretched — invitation_card 55–59 %, info_card 17–91 % from the build', () => {
  const inv = MANIFEST.invitation_card.slices, info = MANIFEST.info_card.slices;
  assert.deepEqual([inv.top_end_pct, inv.bottom_start_pct], [55, 59]);
  assert.deepEqual([info.top_end_pct, info.bottom_start_pct], [17, 91]);
  const css = cssText();
  assert.ok(css.includes(`.invite { --ar: ${pct(inv.ratio)}; --t: .55; --b: .59; }`));
  assert.ok(css.includes(`.info { --ar: ${pct(info.ratio)}; --t: .17; --b: .91; }`));
  assert.match(css, /\.invite::before \{ background-size: 100% 2500%; background-position: 0 57\.292%; \}/);
  assert.match(css, /\.info::before \{ background-size: 100% 135\.135%; background-position: 0 65\.385%; \}/);
  // every free_zone row of the stretched band is full-width plain paper (no flower tip stretched)
  for (const [nm, s] of [['invitation_card', inv], ['info_card', info]] as const) {
    for (const [y, L, R] of MANIFEST[nm].free_zone) if (y >= s.top_end_pct && y < s.bottom_start_pct) assert.ok(L !== null && R - L >= 85, `${nm} ${y}%: ${L}–${R}`);
  }
  // the invitation text starts under the top cascade (41 % of the card) and ends above the bottom cluster
  assert.match(rule('.invite-text'), /padding: 60cqw 13% 57cqw; min-height: calc\(100cqw \/ \.68234\)/);
});

test('inner pages: nothing half under the nav on the first screen — fold units, one small lift, the RSVP bow rides on the signature', () => {
  const d = render('details').$;
  assert.equal(d('.day-card h1.card-title[data-fold]').length, 1);
  assert.equal(d('.sched-list > li.sched-row[data-fold]').length, demo().schedule.length, 'each schedule row');
  assert.equal(d('.venue-photo[data-fold]').length, 1);
  assert.equal(d('.cal[data-fold]').length, 1);
  const r = render('rsvp').$;
  assert.equal(r('.rsvp-text > [data-fold]').length, 5, 'title, reply-by, pill, the wait line, the signature');
  assert.equal(r('.rsvp-text > .sig-unit[data-fold] > .card-tie > img[src*="bow-"]').length, 1, 'the bow folds with "With love," + the names');
  assert.equal(r('.reply-box > [data-fold] > h2').length, 1);
  assert.ok(r('.reply-form > [data-fold]').length >= 6, 'form rows fold one by one');
  const s = render('story').$;
  assert.equal(s('.page-head > .unit[data-fold] > .kicker').length, 1);
  assert.equal(s('.page-head > .lede[data-fold]').length, 1);
  assert.equal(s('section.next-sec[data-fold]').length, 1);
  const js = jsText();
  assert.match(js, /const f = \$\('\.page-bg \+ \*'\), a = \[\.\.\.\$\$\('\[data-fold\], \.garland'\)\]/);
  assert.match(js, /Math\.min\(40, parseFloat\(getComputedStyle\(f\.parentElement\)\.paddingTop\) \* \.34\)/);
  assert.match(js, /d <= lift \? \[f, -d\] : \[el, v \+ 6 - t\]/);
  assert.match(js, /for \(let k = 1; d > lift && k > \.73 && el\.matches\('\.sig-unit'\); d = D\(\)\) el\.style\.setProperty\('--sg', k -= \.04\);/);
  assert.match(rule('.sig-unit'), /--sg: 1; position: relative; padding-bottom: calc\(6cqw \* var\(--sg\)\)/);
  // the bow: its band (30.67 % of the bow's height) 4cqw above the card's bottom edge (bot-h 13.16cqw below the text)
  assert.match(cssText(), /\.card-tie \{ position: absolute; z-index: 2; left: 50%; top: calc\(100% \+ 13\.16cqw - 4cqw - 11\.85cqw \* var\(--sg\)\); width: calc\(62cqw \* var\(--sg\)\); aspect-ratio: 693 \/ 432;/);
  assert.deepEqual(MANIFEST.bow.knot_in_crop_pct.map(Math.round), [51, 19, 42]);
  assert.equal(MANIFEST.bow.src_size.join('/'), '693/432');
});

test('nav, hint, countdown and dress code: the GPT gold oak-leaf charm (closure crop) on a hairline (W1.1, W1.2, W1.4)', () => {
  assert.equal(MANIFEST.charm.source, 'closure');
  assert.ok(MANIFEST.charm.files.length === 1 && MANIFEST.charm.files[0].bytes < 10_000);
  for (const page of ['home', 'story', 'details', 'rsvp'] as PageName[]) {
    assert.equal(render(page).$('nav.site-nav > .orn[aria-hidden="true"] > img[src$="charm-48.webp"]').length, 1, page);
  }
  assert.equal(render('index').$('.env-hint .orn > img[src$="charm-48.webp"]').length, 1);
  assert.equal(render('home').$('.countdown > .orn > img[src$="charm-48.webp"]').length, 1);
  const d = render('details').$;
  assert.equal(d('.dress > .orn > img[src$="charm-48.webp"]').length, 1);
  assert.equal(d('.dress em[data-field="dress_code"]').text(), 'Formal attire');
});

test('home: The Day frame lists the first four schedule rows (docs/11 §3.2: label · time); the reply-by line once; srcset everywhere', () => {
  const c = demo();
  c.schedule = Array.from({ length: 6 }, (_, i) => ({ label: `Event ${i + 1}`, time: `${12 + i}:00`, location: null })) as ContentRecord['schedule'];
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  const rows = $('.t-day .t-sched .t-row');
  assert.equal(rows.length, 6, 'every row in the source; CSS shows the first four');
  assert.equal(rows.first().text(), 'Event 1 · 12:00 PM');
  assert.match(cssText(), /\.t-row:nth-child\(n\+5\) \{ display: none; \}/);
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home');
  assert.deepEqual(home('.teaser .t-title').map((_, el) => home(el).text()).get(), ['Our Story', 'The Day']);
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

test('lessons kept: first screen above the nav (fitNames + fold), names ≥ 36 px, landscape grid, ≥ 11 px text, no tap rectangle, budgets', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  const js = jsText();
  assert.match(rule('.hero'), /padding-bottom: 27px/);
  assert.match(css, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(js);
  assert.ok(floor && Number(floor[1]) >= 36);
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.match(js, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(js, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(css);
  assert.ok(land, 'short-landscape block');
  assert.match(land![1], /\.hero-inner \{\s*display: grid; grid-template: 1fr repeat\(6, auto\) 1fr \/ auto minmax\(0, 460px\)/);
  for (const [sel, row] of [['.hero .names', 2], ['.hero-date', 3], ['.hero-venue', 4], ['.hero-city', 5], ['.countdown', 6], ['.hero-cta', 7]] as const) {
    assert.match(land![1], new RegExp(`\\n  ${sel.replace(/\./g, '\\.')} \\{ grid-area: ${row} \\/ 2;`), `${sel} in row ${row} beside the card`);
  }
  const widths = [...rule('.hero-card').matchAll(/width: ([^;]+)/g)].map((m) => m[1]);
  assert.ok(widths.length >= 3 && widths.every((w) => w.startsWith('clamp(150px')), widths.join(' | '));
  for (const sel of ['.card-copy .kicker', '.rsvp-text .wait', '.cd-lbl', '.cue', '.invite-text .host', '.drow .wd, .drow .yr', '.sched-row .time', '.kicker', '.site-nav a']) {
    const fs = /font-size: max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ max\((\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font: \d+ (\d+(?:\.\d+)?)px/.exec(rule(sel)) ?? /font-size: (\d+(?:\.\d+)?)px/.exec(rule(sel));
    assert.ok(fs && Number(fs[1]) >= 11, `${sel}: smallest font size ${fs && fs[1]} px`);
  }
  assert.match(js, /for \(const \[wrap, d\] of \[\[false, ''\], \[true, ''\], \[true, 'c'\], \[true, 'c s'\]\]\)/);
  assert.match(js, /new ResizeObserver\(fitCopy\)/);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(js)![1]) <= 400);
  for (const m of js.matchAll(/\{ file: 'img\/accent_\d-\d+\.webp'[^}]*\}/g)) {
    if (/origin: 'card'/.test(m[0])) continue;
    assert.match(m[0], /avoid: '[^']+', host: '\.(hero|closing)'/, m[0]);
  }
  assert.match(cssText(), /\.accent-layer\.in-host \{ position: absolute; z-index: 0; \}/);
  // docs/11 §8: last step of a scene ≤ 3000 ms; one entrance 600–1800 ms
  for (const [, steps] of js.matchAll(/\n    '[a-z-]+': +(\[\[[^\n]*\]\])/g)) {
    const t = JSON.parse(steps.replace(/'/g, '"')) as [string, number][];
    assert.ok(t[0][1] <= 150 && t[t.length - 1][1] <= 3000, steps);
  }
  for (const [, d] of cssText().matchAll(/--dur: (\d+)ms/g)) assert.ok(Number(d) >= 600 && Number(d) <= 1800, `--dur ${d}`);
  // reduced motion: no sway, no breathing hint, no floating pieces, entrances instant
  assert.match(cssText(), /\.js \.env-hint, \.js \.float, \.js \.sway \{ animation: none !important; \}/);
  assert.match(rule('.amp'), /font-size: max\(11px, \.62em\)/);
  assert.match(cssText(), /\.card-copy \.kicker:has\(\.cc-city\[data-empty\]\) \.sep/);
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB (KiB)
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
});

test('smooth scrolling only for the RSVP page\'s #reply jump, never with reduced motion', () => {
  const css = cssText().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/scroll-behavior: smooth/g) || []).length, 1);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ html:has\(#reply\) \{ scroll-behavior: smooth; \} \}/);
  for (const page of ['index', 'home', 'story', 'details'] as const) assert.equal(render(page).$('#reply').length, 0, `${page}: no #reply, no smooth scroll`);
});

// ---------------------------------------------------------------- G075 thank-you mode, G068 design texts (this theme)

const navLabels = ($: cheerio.CheerioAPI) => $('.site-nav li').map((_, li) => $(li).text().trim()).get();

test('G075 thank-you mode: envelope card (photo or the velvet bow on the wall), home thank-you card, honest closed RSVP, the Day page kept or hidden', () => {
  assert.deepEqual(thankYouSupport(Object.fromEntries(PAGES.map((p) => [p, readFileSync(path.join(DIR, `${p}.html`), 'utf8')]))), { complete: true, partial: false, missing: [] });
  const after = new Date('2027-10-30T12:00:00Z');
  const c = demo();
  c.media.hero_portrait = '/media/11111111-2222-3333-4444-555555555555/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200w.jpg';
  c.thank_you = { message: 'Thank you <b>all</b>!\nSecond line.', photo: '/media/11111111-2222-3333-4444-555555555555/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-1200w.jpg' };
  const r = (p: PageName, cc: unknown = c) => { const x = render(p, cc, { now: after }); assert.deepEqual(x.warnings, [], p); return x; };
  const idx = r('index');
  assert.equal(idx.$('html').attr('data-thank-you'), '');
  assert.equal(idx.$('.env-head .kicker').text(), 'With love and thanks');
  assert.equal(idx.$('.card-copy [data-field="thank_you_title"]').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(idx.$('.card-copy .cc-city').length, 0, 'title + date, no place');
  assert.equal(idx.$('.card [data-slot="hero_portrait"] img.ty-photo').attr('src'), c.thank_you.photo);
  assert.ok(!idx.html.includes('aaaaaaaa') && !/ph_hero_portrait/.test(idx.$('.card').html() ?? ''), 'never the portrait or a placeholder');
  const plain = structuredClone(c);
  delete plain.thank_you!.photo;
  assert.equal(r('index', plain).$('.card .ty-decor img[src*="bow-"]').length, 1, 'without a photo: the velvet bow (GPT closure crop) on the wall');
  const home = r('home');
  assert.equal(home.$('[data-countdown]').length, 0);
  assert.equal(home.$('a[href*="/rsvp"]').length, 0);
  assert.equal(home.$('[data-calendar]').length, 0);
  assert.equal(home.$('#invitation').length, 0);
  assert.equal(home.$('#thank-you #ty-head').text(), THANK_YOU_DEFAULT_TITLE);
  assert.equal(home.$('#thank-you [data-field="thank_you.message"]').text(), 'Thank you <b>all</b>!\nSecond line.');
  assert.deepEqual(navLabels(home.$), ['Home', 'Story', 'The Day']);
  const det = r('details');
  assert.match(det.$('p.note').text(), /The ceremony began at 4:00 PM\./);
  assert.equal(det.$('[data-calendar]').length, 0);
  const hidden = structuredClone(c);
  hidden.thank_you = { ...hidden.thank_you, details: 'hide' };
  assert.equal(render('details', hidden, { now: after }).disabled, true);
  for (const p of ['home', 'story', 'rsvp'] as PageName[]) assert.equal(render(p, hidden, { now: after }).$('a[href$="/details"]').length, 0, p);
  const rsvp = r('rsvp');
  assert.equal(rsvp.$('form').length, 0);
  assert.equal(rsvp.$('h1').text().trim(), 'Replies are closed');
  assert.equal(rsvp.$(`a.btn[href="/${SLUG}/home"]`).text(), 'Home');
  assert.equal(rsvp.$('.sig-unit .card-tie').length, 1, 'the signature and the bow stay');
  // before the wedding nothing of it is in the source; the stylesheet only in thank-you mode
  for (const p of PAGES) {
    const before = render(p, c, { now: new Date('2027-10-01T12:00:00Z') });
    for (const secret of ['bbbbbbbb', 'thank-you.css', 'data-thank-you', 'Second line']) assert.ok(!before.html.includes(secret), `${p}: ${secret}`);
  }
  assert.equal(idx.$(`link[href="/themes/${ID}/thank-you.css"]`).length, 1);
});

test('G068 design texts: theme.json copy = the templates, no unmarked visible text, standard keys; every key at its max renders (thank-you mode too)', async () => {
  const pages: Partial<Record<PageName, string>> = {};
  for (const p of PAGE_NAMES) pages[p] = readFileSync(path.join(DIR, `${p}.html`), 'utf8');
  const scan = scanCopy(pages);
  assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], 'run node scripts/copy-manifest.ts --theme burgundy-velvet-autumn');
  assert.deepEqual(scan.unmarked, [], 'visible fixed text without data-copy (docs/11 §3.7)');
  assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, 'the generator writes what is stored');
  const keys = Object.keys(theme.manifest.copy!);
  assert.ok(keys.length >= 70, `${keys.length} keys`);
  assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), [], 'standard keys only');
  for (const [k, e] of Object.entries(theme.manifest.copy!)) assert.ok([...e.default].length <= e.max && e.max <= COPY_MAX_CEILING, k);
  const c = demo();
  c.copy = stressCopy(theme.manifest.copy!);
  for (const page of PAGES) {
    for (const thankYouPreview of [false, true]) {
      const out = render(page, c, { previewKey: thankYouPreview ? 'k' : undefined, thankYouPreview });
      assert.deepEqual(out.warnings, [], page);
      if (out.disabled) continue;
      out.$('[data-copy]').each((_, el) => assert.equal(out.$(el).text(), c.copy![out.$(el).attr('data-copy')!], `${page} ${out.$(el).attr('data-copy')}`));
    }
  }
  const ty = demo();
  ty.thank_you = { mode: 'on', title: 'Thank you, friends' };
  ty.copy = { ty_kicker: 'Grateful hearts', rsvp_closed_title: 'All replies are in', home_link: 'Back home' };
  assert.equal(render('index', ty).$('.env-head .kicker').text(), 'Grateful hearts');
  assert.equal(render('index', ty).$('.ty-title').text(), 'Thank you, friends');
  assert.equal(render('rsvp', ty).$('h1').text(), 'All replies are in');
  assert.equal(render('rsvp', ty).$('a.btn[href$="/home"]').text(), 'Back home');
});

// ---------------------------------------------------------------- the first-screen rules, measured in a browser
// Playwright from the global install (docs/11 §13.3; never `playwright install`): the pages are rendered here with the
// engine and served from the theme folder, so the layout code (site.css + site.js folds/garland) runs for real. Skipped when
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
// in the page: the nav line, the story frames (+ captions), the details title / first row, the RSVP signature (+ bow), viewport px
const MEASURE = `(() => {
  const r = (e) => e && e.getBoundingClientRect(), nav = r(document.querySelector('.site-nav')).top;
  const hangs = [...document.querySelectorAll('.hang')].map((h) => ({ top: r(h.querySelector('.frame')).top, bottom: Math.max(r(h.querySelector('.frame')).bottom, r(h.querySelector('figcaption')).bottom) }));
  const row = r(document.querySelector('.sched-row')), title = r(document.querySelector('.card-title'));
  const sig = document.querySelector('.sig-unit');
  const s = sig && { top: r(sig).top, ink: Math.max(r(sig.querySelector('.sign')).bottom, r(sig.querySelector('.card-tie')).bottom) };
  const head = r(document.querySelector('.page-head'));
  return { vh: innerHeight, nav, hangs, row: row && { top: row.top, bottom: row.bottom }, title: title && { top: title.top, bottom: title.bottom }, sig: s,
    head: head && { top: head.top, bottom: head.bottom }, sw: document.documentElement.scrollWidth };
})()`;

test('browser: story garland whole on the first screen on laptops, never half under the nav on phones (head centred when the first frame folds); details title + first row on short landscape; RSVP signature + bow at 390×844', async (t) => {
  await withBrowser(t, async (open) => {
    for (const [w, h] of [[1280, 800], [1366, 657], [1024, 768], [1920, 1080], [768, 1024]]) {
      for (const [name, rec] of [['demo', demo()], ['stress', stressRecord(demo())]] as const) {
        const m = await open('story', rec, w, h);
        const at = `story ${w}×${h} ${name}`;
        const on = m.hangs.filter((x: { top: number }) => x.top < m.vh).length;
        assert.equal(on, 3, `${at}: the three frames are on the first screen`);
        const end = Math.max(...m.hangs.map((x: { bottom: number }) => x.bottom));
        assert.ok(end <= m.nav, `${at}: the garland ends above the nav (${Math.round(end)} > ${Math.round(m.nav)})`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
      }
    }
    for (const [w, h] of [[360, 640], [390, 844], [430, 932], [375, 667]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())]] as const) {
        const m = await open('story', rec, w, h);
        const at = `story ${w}×${h} ${name}`;
        for (const x of m.hangs) assert.ok(x.top >= m.vh || x.bottom <= m.nav, `${at}: a frame half under the nav (${Math.round(x.top)}–${Math.round(x.bottom)}, nav ${Math.round(m.nav)})`);
        if (m.hangs[0].top >= m.vh) assert.ok(m.nav - m.head.bottom < 0.62 * (m.nav - 0) , `${at}: the head sits in the first screen's middle`);
        assert.ok(m.sw <= w, `${at}: no sideways scroll`);
      }
    }
    for (const [w, h] of [[844, 390], [740, 360], [667, 375]]) {
      const m = await open('details', demo(), w, h);
      const at = `details ${w}×${h}`;
      assert.ok(m.title.bottom <= m.nav, `${at}: the card title above the nav`);
      assert.ok(m.row.bottom <= m.nav, `${at}: the first schedule row too (never a card with its title only, G404 qa)`);
    }
    for (const [w, h] of [[390, 844], [430, 932], [1280, 800]]) {
      const m = await open('rsvp', demo(), w, h);
      assert.ok(m.sig.top < m.vh && m.sig.ink <= m.nav, `rsvp ${w}×${h}: "With love," + the names + the bow on the first screen above the nav`);
    }
  });
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
  assert.equal((cssText().match(/view-transition-name: invite-card/g) ?? []).length, 2, 'index .env .card + home .hero-card');
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-bv', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-bv'), { params: Promise.resolve({ slug: 'maren-and-theo-bv' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/burgundy-velvet-autumn\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Rosalind & Edward wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-bv/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-bv', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['thank-you.css'], ['img', 'env_cflap-880.webp'], ['img', 'cl_c-113.webp'], ['img', 'bow-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg'], ['img', 'wall-560.webp']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-bv' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-bv'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-bv', {
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-velvet-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-velvet-site/story'), { params: Promise.resolve({ slug: 'quiet-velvet-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-velvet-site'), { params: Promise.resolve({ slug: 'quiet-velvet-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-velvet-site/${page}`), { params: Promise.resolve({ slug: 'quiet-velvet-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
