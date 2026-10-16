// Theme platform/themes/vintage-airmail-love-letter (design 04 · Vintage Airmail Love Letter, task G404) — docs/11 §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract. Browser checks (widths, short phones, landscape, opening flow, stress
// and design-range records, weight, video) live in scripts/theme-check.cjs --theme vintage-airmail-love-letter --stress;
// G051 in the browser in tests/g051-browser.ts --theme vintage-airmail-love-letter.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { withPreviewBar } from '../lib/site/render.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { rangeRecord, stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'vintage-airmail-love-letter';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/04_Vintage_Airmail/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'margot-and-henry';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
const CSS = readFileSync(path.join(DIR, 'site.css'), 'utf8');
const CSS_NC = CSS.replace(/\/\*[\s\S]*?\*\//g, '');
const JS = readFileSync(path.join(DIR, 'site.js'), 'utf8');
const RULES = [...CSS_NC.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
/** The declarations of every rule whose selector is exactly `sel` (comments removed). */
const rule = (sel: string) => RULES.filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-va-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/04_Vintage_Airmail/content.demo.json). Fresh copy each call. */
function demo(): ContentRecord {
  return JSON.parse(readFileSync(path.join(DIR, 'content.demo.json'), 'utf8')) as ContentRecord;
}

function render(page: PageName, content: unknown = demo(), opts: { previewKey?: string } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
  return { ...result, $: cheerio.load(result.html) };
}

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
/** WCAG contrast ratio of two sRGB colours. */
function contrast(a: number[], b: number[]): number {
  const lum = (c: number[]) => {
    const [r, g, bl] = c.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const token = (name: string) => hex(new RegExp(`--${name}: (#[0-9A-Fa-f]{6});`).exec(CSS)![1]);

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Vintage Airmail Love Letter');
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
  // the window boxes in the stylesheet are the build's (card, portrait ×2 places, landscape)
  const box = (k: string) => MANIFEST.photo_slots[k].box_pct.map((n: number) => `${n}%`);
  const [cl, ct, cw, ch] = box('card');
  assert.ok(CSS.includes(`.card > .photo-slot { left: ${cl}; top: ${ct}; width: ${cw}; height: ${ch}; }`));
  const [pl, pt, pw, ph] = box('portrait');
  for (const sel of ['.mini-stamp .photo-slot', '.stamp .photo-slot']) assert.ok(CSS.includes(`${sel} { left: ${pl}; top: ${pt}; width: ${pw}; height: ${ph}; }`), sel);
  const [ll, lt, lw, lh] = box('landscape');
  assert.ok(CSS.includes(`.venue-photo .photo-slot { left: ${ll}; top: ${lt}; width: ${lw}; height: ${lh}; }`));
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
  for (const m of CSS.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  for (const m of JS.matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  // og:image (1200×630, nameless) and the tab icon (the wax seal only)
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.match(MANIFEST.favicon.source, /^closure/);
  // docs/11 §1: no GPT sources / prep output / previews in the theme folder; total ≤ 3 MB
  for (const bad of ['img_src', 'assets', 'previews', 'node_modules', 'prep']) assert.ok(!existsSync(path.join(DIR, bad)), bad);
  const walk = (d: string): number => readdirSync(d, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : statSync(path.join(d, e.name)).size), 0);
  assert.ok(walk(DIR) <= 3_000_000, `theme folder ${walk(DIR)} bytes`);
  // docs/11 §6: single WebP ≤ 250 KB (≤ 200 KB in a first view: the envelope, hero, story desk)
  for (const f of readdirSync(path.join(DIR, 'img')).filter((n) => n.endsWith('.webp'))) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 250 * 1024, f);
  }
  for (const f of ['env_open-880.webp', 'bg_page-1024.webp', 'decor_tl-760.webp', 'decor_br-760.webp', 'card_small-640.webp', 'bg_desk_pair-640.webp', 'bg_desk_pair_2x-768.webp', 'invitation_card-960.webp']) {
    assert.ok(statSync(path.join(DIR, 'img', f)).size <= 200 * 1024, `${f} (first view) ≤ 200 KB`);
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
  assert.ok(claim, `/start?theme=${ID} works`);
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Margot');
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
    // the story page is the dark writing desk: its own browser-bar colour
    assert.equal($('meta[name="theme-color"]').attr('content'), page === 'story' ? '#4A2E1C' : MANIFEST.page_color, page);
  }
  assert.ok(fields > 50, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Margot & Henry · October 2, 2027');
  assert.equal(index('h1').text().replace(/\s+/g, ' '), 'Margot & Henry');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, October 2, 2027 · Hudson, New York");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage').attr('aria-label'), 'Open the invitation');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Margot & Henry');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Margot & Henry');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Orchard Lawn', 'The Library Bar', 'The Post Hall']);
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'October', '2', '2027', 'at 4:00 PM']);
  assert.equal(home('.hero-date').text().replace(/\s+/g, ' ').trim(), 'Saturday · October 2, 2027');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  // the monogram pressed into every wax seal is the record's initials (panel: Monogram field)
  assert.equal(index('.closure .seal-mono').text(), 'M&H');
  assert.equal(home('.mini-seal .seal-mono').text(), 'M&H');
  assert.equal(render('rsvp', content).$('.card-seal .seal-mono').text(), 'M&H');
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
  assert.deepEqual(personal.filter((s) => CSS.includes(s)), []);
  // W1 comp demo text is a layout reference only
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Margot|Henry|Old Post House|Hudson|October 2|A table for two|Sealed with a yes|Yours, always/);
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
    assert.ok(!/Margot|Henry|Old Post House|Hudson|M&H/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy [data-field="venue.city_region"]').text(), 'Bath', 'city without region: no stray comma');
  assert.equal(index('.seal-mono').text(), 'M & T');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('p[data-if="ceremony_time !thank_you_on"]').text(), 'The ceremony begins at 3:30 PM.');
  assert.equal(details('.venue-text .kicker').text(), 'Bath · United Kingdom');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.day-mini .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Some love stories are written one letter at a time. Ours led us to October 2, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /led us to 2 October 2027\.$/);
});

// ---------------------------------------------------------------- 6–12: photos, optional blocks, links, RSVP, preview

test('6 photo slots: a buyer photo replaces the placeholder (variants srcset + the template sizes; older single file: no srcset)', () => {
  const site = '0b9f2c1e-0000-4000-8000-000000000000';
  const h32 = '0123456789abcdef0123456789abcdef';
  const c = demo();
  c.media.hero_portrait = `/media/${site}/${h32}-2000w.jpg`;
  const memories = [`/media/${site}/${h32.replace('0', '1')}.jpg`, 'https://storage.example.org/two.jpg'];
  c.media.memory_photos = memories;
  let checked = 0;
  for (const page of ['index', 'home', 'story', 'details'] as PageName[]) {
    const { $ } = render(page, c);
    const template = cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'));
    $('[data-slot]').each((_, el) => {
      const slot = $(el);
      const key = slot.attr('data-slot')!;
      const img = slot.find('img[data-photo]');
      const want = ({ hero_portrait: c.media.hero_portrait, story_1: memories[0], story_2: memories[1] } as Record<string, unknown>)[key];
      checked++;
      if (want) {
        assert.equal(slot.attr('data-photo-state'), 'user', `${page}/${key}`);
        assert.equal(img.attr('data-photo-state'), 'user');
        assert.equal(img.attr('src'), want);
        if (key === 'hero_portrait') {
          assert.equal(img.attr('srcset'), `/media/${site}/${h32}-640w.jpg 640w, /media/${site}/${h32}-1280w.jpg 1280w, /media/${site}/${h32}-2000w.jpg 2000w`);
          assert.equal(img.attr('sizes'), template(`[data-slot="${key}"] img[data-photo]`).attr('sizes'), 'the template sizes (slot width) is kept');
        } else assert.equal(img.attr('srcset'), undefined, 'single-file photo: no srcset');
      } else {
        assert.equal(slot.attr('data-photo-state'), 'placeholder', `${page}/${key}`);
        assert.match(img.attr('src')!, new RegExp(`^/themes/${ID}/img/ph_${key}-\\d+\\.webp$`));
        assert.equal(slot.find('.ph-mark').length, 1, 'placeholder label element present');
      }
    });
  }
  assert.ok(checked >= 7, `${checked} slots (index card, hero card, home stamp, 3 story frames, venue)`);
  // masks: every slot is masked by its GPT window (no CSS border-radius imitation)
  for (const m of ['card', 'portrait', 'landscape']) assert.ok(CSS.includes(`.mask-${m} { --m: url("img/mask_${m}.png"); }`), m);
  assert.match(CSS, /\[class\*="mask-"\] \{ -webkit-mask: var\(--m\) center \/ 100% 100% no-repeat; mask: var\(--m\)/);
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
  assert.equal(home('.more-sec .item').length, 2, 'no story piece in "Inside this letter"');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress-v').text(), 'Cocktail attire');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=post-house';
  c.maps = { venue: { show_map: false, show_directions: false } }; // G127: the old 'View map' link (map block off)
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=post-house');
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
  assert.equal($('a[href="#reply"]').length, 1, 'the sheet\'s pill jumps to the form');
  assert.equal($('#reply').length, 1);
  // the generic thank-you below the form is hidden once a reply was sent (site.js rsvp:state → html[data-rsvp-replied])
  assert.match(CSS, /html\[data-rsvp-replied\] \.closing \.title/);
  assert.match(JS, /root\.setAttribute\('data-rsvp-replied', ''\)/);
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
    assert.doesNotMatch($('body').text(), /Kindly reply|Will You Join Us|\bRSVP\b/, page);
  }
  assert.equal(render('home', c).$('.more-sec .twine').length, 1, 'the twine before the removed seal goes too');
  assert.equal(render('home').$(`a[href="/${SLUG}/rsvp"]`).length, 4, 'with replies on: hero pill, letter, the seal piece and the nav');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments', () => {
  assert.match(CSS, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(CSS, /\.ph-mark \{ display: none; \}/);
  assert.doesNotMatch(CSS, /^\.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/m, 'no unscoped rule');
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Margot & Henry');
  assert.equal(render('index', c).$('.stage img[data-photo="hero_portrait"]').attr('alt'), '', 'the envelope card is aria-hidden');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'A table for two');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'The Old Post House');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  assert.equal(render('home', c, { previewKey: 'pk_test_1234567890' }).$('.hero-card img[data-photo="hero_portrait"]').attr('src'),
    `${c.media.hero_portrait}?preview=pk_test_1234567890`);
  for (const page of PAGES) {
    const { html, $ } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments are not sent to guests`);
    // every GPT part is decorative (alt=""); only photos carry content alt text
    $('img:not([data-photo])').each((_, el) => assert.equal($(el).attr('alt'), '', `${page}: ${$(el).attr('src')}`));
  }
});

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress + range records

test('17 schedule of 1, 6 and 10 rows, long names, en-GB, the design-range and §12 stress records render without warnings', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
    assert.equal(render('home', c).$('.day-mini .sched-line').length, n, 'all rows in the source; CSS shows the first 3 on the small sheet');
  }
  assert.match(rule('.sched-line:nth-child(n+4)'), /display: none/);
  // 6+ rows: no twine between the rows (spacing only), the sheet grows by whole bands
  assert.match(CSS_NC, /\.sched-list:has\(> \.sched-row:nth-child\(6\)\) \.sched-row \+ \.sched-row::before \{ display: none; \}/);
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & Henry';
  for (const page of PAGES) {
    const { $, warnings } = render(page, gb);
    assert.deepEqual(warnings, [], `en-GB ${page}`);
    assertFieldsMatch($, gb, page);
  }
  assert.equal(render('home', gb).$('.hero-date [data-field="date"]').last().text(), '2 October 2027');
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
  assert.equal(render('home', rangeRecord(demo())).$('.hero-date').text().replace(/\s+/g, ' ').trim(), 'Wednesday · 29 September 2027');
  // the long-name fit is in site.js (fitNames → --names-scale), the CSS uses the variable on both pages
  assert.match(JS, /--names-scale/);
  assert.equal((CSS_NC.match(/var\(--names-scale, 1\)/g) ?? []).length, 3, 'envelope names (portrait + landscape) and hero names');
  // Homemade Apple (fountain pen) + Special Elite (typewriter), display=swap, exactly two families. Homemade Apple ships
  // only the `latin` subset (U+0000–00FF: "Élodie", "Zoë" are in it; latin-ext names fall back) — README / Sonuç limit
  const href = render('index').$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
  assert.equal(href, 'https://fonts.googleapis.com/css2?family=Homemade+Apple&family=Special+Elite&display=swap');
  assert.match(CSS, /--script: "Homemade Apple", "Segoe Script", "Bradley Hand", cursive;/);
  assert.match(CSS, /--type: "Special Elite", "American Typewriter", "Courier New", Courier, monospace;/);
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the venue?', a: 'Yes, free parking behind the post house.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20271002T200000Z/20271003T003000Z', `${page}: 4 PM EDT to two hours after the reception`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal a[data-calendar="google"]').attr('target'), '_blank');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  assert.equal(render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$('a[data-calendar="ics"]').attr('href'),
    `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demo();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  assert.match(JS, /'home-invite':[^\n]*\['cal', \d+\]/);
  assert.match(JS, /'details-card':[^\n]*\['cal', \d+\]/);
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
  assert.match(rule('.faq-a'), /white-space: pre-line/);
  assert.match(CSS, /\.faq-item summary::after \{ content: "\+"; content: "\+" \/ ""/, 'the "+" sign stays out of the accessible name');
  assert.match(rule('.faq-item summary'), /min-height: 52px/);
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
  const s = render('rsvp', sneaky);
  assert.equal(s.$('fieldset[data-rsvp-question="meal"] img').length, 0, 'question text is text, never markup');
});

// ---------------------------------------------------------------- 21–22: full-name fallback, K21

test('21 invitation letter: without a full name the first name is shown (never an empty name line)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Margot', full_name: null };
  c.partners[1] = { display_name: 'Henry', full_name: 'Henry Arthur Blake' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Margot', 'Henry Arthur Blake']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  const d = render('home').$;
  assert.deepEqual(d('.invite-text .nm').map((_, el) => d(el).text()).get(), ['Margot Elise', 'Henry Arthur']);
});

test('22 K21: no code-drawn frames — countdown, sheets, stamps, seals without border / outline / box-shadow; no SVG or CSS shapes', () => {
  // (.env-after: the Replay link's soft pill is interface, like the buttons)
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo)|\.card(?!-seal)|\.card-seal|\.frame|\.stamp|\.mini-|\.day-|\.item|\.closure|\.env(?!-after)|\.desk|\.postmark|\.tuck/;
  let checked = 0;
  for (const [, sel, body] of RULES) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 40, `${checked} content-block rules checked`);
  assert.ok(RULES.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8');
    assert.doesNotMatch(raw, /<svg|<canvas/i, `${page}: no drawn shapes`);
  }
  assert.doesNotMatch(CSS_NC, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // the only gradients are edgeless light (window light, the desk's lamp light and darker edges, the nav's soft ground) and
  // the alpha masks that thin the hero / inner-page backdrop into the paper (docs/11 §5.7); no corner cluster is masked
  // (qa review: clusters are whole, never faded or cut)
  for (const [, sel, body] of RULES) {
    if (/corner/.test(sel)) assert.doesNotMatch(body, /mask|clip-path/, `${sel.trim()}: a cluster stays whole`);
    if (!/gradient\(/.test(body)) continue;
    assert.match(sel, /^\s*(body::before|\.hero-bg picture|\.page-bg picture|\.site-nav|\.page-desk::before|\.page-desk \.site-nav|\.page-desk :is\(\.page-title, \.kicker, \.lede, figcaption\)::before)\s*$/, sel.trim());
  }
  // the countdown: plain typed numerals (W1.2's boxed tiles would be code-drawn boxes)
  assert.doesNotMatch(rule('.cd-cell') + rule('.cd-num'), /background|border/);
});

// ---------------------------------------------------------------- envelope: build geometry, layers, closure, the opening

test('envelope (docs/11 §7.2 kapak — yırtma şeridi): layers from the build, measured alignment, seal on the strip, card path', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_open', 'env_strip', 'env_torn', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  // the strip = closed − open alpha; strip + open recompose the closed envelope; the tear line found in the image
  assert.ok(MANIFEST.checks.strip_plus_open_vs_closed_diff <= 0.01, 'strip + body = the closed envelope');
  assert.equal(MANIFEST.checks.green_px, 0);
  assert.deepEqual(MANIFEST.checks.windows_transparent, { card: [0, 0], portrait: [0, 0], landscape: [0, 0] });
  assert.equal(st.cuts.perforation.method, 'renk', 'perforation row measured in the image (no geometric fallback)');
  assert.equal(st.cuts.perforation.missing_columns, 0);
  assert.ok(st.cuts.perforation.max_step_px <= 8, `perforation step ${st.cuts.perforation.max_step_px} px`);
  assert.equal(st.cuts.torn.method, 'alfa');
  // the GPT open envelope sits ~1.6 % lower than the closed one: a measured scale + offset puts it back (≤ ±0.5 % after)
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `raw closed/open alignment ${MANIFEST.align.durum}`);
  assert.equal(st.align.method, 'olculen_donusum');
  for (const e of st.align.after) assert.ok(Math.abs(e.fark_pct) <= 0.5, `${e.kenar} ${e.fark_pct} % after the correction`);
  assert.equal(st.align.after_check.durum, 'tamam');
  // the seal: anchored at the strip's centre, sized from the comp; it sits on the strip (not carried by a flap)
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, false);
  assert.match(MANIFEST.closure.anchor, /tear strip box centre/);
  const pct = (n: number) => String(n).replace(/^0\./, '.').replace(/^0$/, '0');
  for (const [sel, k] of [['.env-open', 'env_open'], ['.env-strip', 'env_strip'], ['.env-torn', 'env_torn'], ['.closure', 'closure']] as const) {
    const [l, t, w, h] = st.parts[k];
    const body = rule(sel);
    for (const [prop, v] of [['left', l], ['top', t], ['width', w], ['height', h]] as const) {
      assert.match(body, new RegExp(v === 0 ? `${prop}: 0%?;` : `${prop}: ${pct(v).replace('.', '\\.')}%`), `${sel} ${prop} = manifest stage.parts.${k}`);
    }
  }
  const [cl, ct, cw] = st.parts.card;
  assert.ok(CSS.includes(`.env .card { position: absolute; left: ${cl}%; top: ${ct}%; width: ${cw}%; }`), 'card from the manifest');
  assert.match(rule('.stage'), new RegExp(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  // the stage's room above the envelope (closed_obj.top_frac_of_stage_w) is tucked under the heading
  assert.match(rule('.stage'), new RegExp(`margin-top: calc\\(18px - var\\(--w\\) \\* ${pct(st.closed_obj.top_frac_of_stage_w)}\\)`));
  assert.match(rule('.env-page'), new RegExp(`--w: calc\\(var\\(--obj\\) / ${pct(st.closed_obj.frac_w)}\\)`));
  // the waiting card is clipped at the body's bottom edge
  assert.match(rule('.card-slot'), new RegExp(`clip-path: inset\\(-150% -45% ${pct(Math.round((100 - st.body_bottom_pct) * 100) / 100)}% -45%\\)`));
  // monogram in the seal's smooth centre
  const [ml, mt, mw, mh] = MANIFEST.closure.mono_in_crop_pct;
  assert.match(rule('.seal-mono'), new RegExp(`left: ${ml}%; top: ${mt}%; width: ${mw}%; height: ${mh}%;`));
  const { $ } = render('index');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['card-slot', 'env-open', 'env-strip', 'env-torn', 'closure'], 'layer order bottom → top');
  assert.equal($('.stage .closure img[src*="img/closure-"]').length, 1);
  // card path: out of the envelope clear of the torn edge, then forward ≤ 4 % lower
  assert.ok(st.card_path.out_translate_pct <= -100, `out ${st.card_path.out_translate_pct}`);
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4);
  assert.ok(JS.includes(`const ENVELOPE_GEOMETRY = { out: 'translateY(${st.card_path.out_translate_pct}%)', front: 'translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale})' };`));
  assert.ok(CSS.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
});

test('envelope opening = the design sentence: seal pops off, strip rips left → right, card slides up, one pressed flower falls', () => {
  const env = /envelope: \{([\s\S]*?)\n {1,2}\}/.exec(JS)![1];
  const t = (k: string) => { const m = new RegExp(`\\n\\s+${k}:\\s+\\[(\\d+), (\\d+)\\]`).exec(env); assert.ok(m, k); return [Number(m![1]), Number(m![2])]; };
  const n = (k: string) => Number(new RegExp(`\\n\\s+${k}:\\s+(\\d+)`).exec(env)![1]);
  const [closure, tear, rise, forward] = [t('closure'), t('tear'), t('rise'), t('forward')];
  for (const k of ['hint', 'tug', 'head', 'fly']) t(k);
  const go = n('go'), accentsAt = n('accents');
  // order: the seal goes first (at the tap), the tear starts after its hop, the card rises once the strip is (almost) gone
  assert.equal(closure[0], 0, 'the seal pops at once (no idle wait after the tap)');
  assert.ok(tear[0] > closure[0] && tear[0] < closure[0] + closure[1], 'the strip rips while the seal tumbles away');
  assert.ok(rise[0] >= tear[0] + 0.9 * tear[1], 'the card rises once the strip is torn');
  assert.ok(forward[0] >= rise[0] + 0.9 * rise[1], 'it comes forward when it is out');
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6)`);
  assert.ok(go - (forward[0] + forward[1]) <= 600, 'no long idle wait after the card lands');
  // the seal: a hop, then it tumbles away and is gone (its own element, one animation)
  assert.match(JS, /A\(el\.closure, \[[\s\S]*?scale\(1\.12\)[\s\S]*?opacity: 0 \}\s*\], E\.closure, 'linear'\);/);
  // the tear: the attached strip is clipped from the left, the torn part shows left of the tear point and peels up there
  assert.match(JS, /strip\.push\(\{ clipPath: `inset\(-2% 0 -2% \$\{x\.toFixed\(2\)\}%\)`/);
  assert.match(JS, /torn\.push\(\{ clipPath: `inset\(-60% \$\{\(100 - x\)\.toFixed\(2\)\}% -20% -4%\)`, transformOrigin: `\$\{x\.toFixed\(2\)\}% 100%`/);
  assert.match(JS, /A\(el\.strip, tf\.strip, E\.tear, 'linear', 'forwards'\);/);
  // the card slides up out of the envelope (its own element), then forward
  assert.match(JS, /A\(el\.card, \[\{ transform: 'translateY\(0\)' \}, \{ transform: ENVELOPE_GEOMETRY\.out \}\], E\.rise/);
  // "… while a pressed flower flutters down": one accent_2 falling beside the card, never over its photo, gone before `go`
  const open = /\n\s+open:\s+\[(\{[^\n]*\})\]/.exec(JS)![1];
  assert.match(open, /file: 'img\/accent_2-200\.webp', count: 1, path: 'fall'/);
  assert.match(open, /avoid: '\.env \.card'/);
  // second QA: on 320–390 px phones no lane held a 62–74 px flower + sway, so often none fell (320×568 0 of 6). Now always
  // one: the lane's flower and sway shrink to fit (≥ 36 px), else it falls over the envelope body (the card is behind it)
  assert.match(open, /over: '\.env-open'/);
  assert.doesNotMatch(JS, /if \(!lanes\.length\) return null/);
  assert.match(JS, /\.filter\(\(\[a, b\]\) => b - a >= 36\);/);
  assert.match(JS, /if \(!l\) \{ if \(!ov\) return null; l = \[ov\.left \+ sway, ov\.right - sway, sway\]; y0 = ov\.top \+ 2 \* s; \}/);
  assert.match(JS, /sway = l\[2\]; s = Math\.min\(s, l\[1\] - l\[0\]\);/);
  const dur = Number(/dur: \[(\d+), \d+\]/.exec(open)![1]);
  assert.ok(accentsAt + dur < go, `the flower has fallen before home (${accentsAt} + ${dur} < ${go})`);
  assert.match(JS, /accents\('open', E\.go - E\.accents - 60\)/);
  // arrival particles keep out of the hero photo; the names start as the card lands (no wait)
  assert.match(JS, /arrive: +\[\{ file: 'img\/accent_2-200\.webp'[^\n]*avoid: '\.hero \[data-slot\]'/);
  assert.ok(Number(/arriveDelay: (\d+)/.exec(JS)![1]) <= 400);
  // reduced motion / no WAAPI: straight to home; Skip; keyboard on the stage
  assert.match(JS, /if \(reduce \|\| !Element\.prototype\.animate\) \{ go\(false\); return; \}/);
  assert.match(JS, /reset\(\); state = 'done'; go\(false\);/);
  assert.match(JS, /if \(e\.key === 'Enter' \|\| e\.key === ' '\) \{ e\.preventDefault\(\); stage\.click\(\); \}/);
});

test('envelope view transition: the card morphs into the hero card; replay starts closed; opened state hides the hint', () => {
  assert.match(rule('.from-envelope .hero-card-wrap[data-step]'), /opacity: 1/);
  assert.match(rule('.from-envelope .hero-card-wrap[data-step]'), /transition: none/);
  assert.match(rule('.hero-card'), /view-transition-name: invite-card/);
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(CSS_NC, /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  assert.match(JS, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  assert.match(rule('.is-opened .env-hint'), /display: none/);
  assert.match(CSS_NC, /\.is-opened \.env-strip, \.is-opened \.env-torn, \.is-opened \.closure \{ opacity: 0; visibility: hidden; \}/);
});

// ---------------------------------------------------------------- story: frames dropped one by one onto the desk

test('story: three stamp frames, each its own scene dropped onto the desk one after another; window ≥ 38vw; desk tile', () => {
  const { $ } = render('story');
  const stamps = $('.desk figure.stamp');
  assert.equal(stamps.length, 3);
  assert.deepEqual(stamps.map((_, el) => $(el).attr('data-scene')).get(), ['story-stamp', 'story-stamp', 'story-stamp'], 'each frame drops when it scrolls into view');
  assert.deepEqual(stamps.map((_, el) => $(el).find('.frame').attr('data-a')).get(), ['drop', 'drop', 'drop']);
  assert.equal($('.desk .postmark[data-a="strike"]').length, 1, 'the postmark is struck over the first frame');
  assert.deepEqual(stamps.map((_, el) => $(el).find('figcaption[data-a="write"]').length).get(), [1, 1, 1]);
  assert.match(JS, /'story-stamp': +\[\['drop', 0\], \['acc', \d+\], \['mark', \d+\], \['caption', \d+\]\]/);
  assert.match(JS, /let base = i \* \(s\.dataset\.scene === 'story-stamp' \? 760 : MOTION\.batchGap\);/, 'frames entering together land one after another');
  // the drop preset: from above, turned, with a deep shadow that settles to the resting one
  assert.match(rule('.js [data-a="drop"]'), /transform: translate3d\(var\(--dx, 0\), -40px, 0\) rotate\(var\(--dr, -7deg\)\) scale\(var\(--ds, 1\.1\)\)/);
  assert.match(rule('.js [data-a="drop"].in'), /filter: var\(--rest-shadow, none\)/);
  // phones: the photo window ≥ 38vw (frame 64vw × the portrait window width; site.js shrinks a frame to fit the first
  // screen only down to 48.5vw, else the frame folds)
  const fw = Number(/\.desk \{ --fw: min\((\d+)vw/.exec(CSS_NC)![1]);
  const win = fw * MANIFEST.photo_slots.portrait.box_pct[2] / 100;
  assert.ok(win >= 38, `phone photo window ${win.toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  const lo = Number(/lo = row \? 160 : innerWidth \* ([\d.]+)/.exec(JS)![1]);
  assert.ok(lo * MANIFEST.photo_slots.portrait.box_pct[2] >= 38, `smallest phone window ${(lo * MANIFEST.photo_slots.portrait.box_pct[2]).toFixed(1)}vw`);
  // ≥ 720 px: one row of three (W1.3's high / low / middle scatter), one fold unit — never a lone frame (qa)
  assert.match(CSS_NC, /@media \(min-width: 720px\) \{\s*\.desk \{ --fw: [^;]+; display: grid; grid-template-columns: repeat\(3, var\(--fw\)\);/);
  assert.equal($('.desk').attr('data-fold'), 'row');
  assert.deepEqual(stamps.map((_, el) => $(el).attr('data-fold')).get(), ['12', '12', '12'], 'phones: each frame its own unit (12 px for its tilt)');
  // no sideways scrolling on the story page (so no swipe affordance is needed)
  assert.doesNotMatch(CSS_NC, /overflow-x: (auto|scroll)|scroll-snap-type/);
  // the desk: GPT bg_desk + its mirror, one seamless vertical tile repeated down the page (no fixed layer: iOS, full-page shots)
  assert.equal($('body').attr('class'), 'page-long page-desk');
  assert.match(rule('.page-desk'), /image-set\(url\("img\/bg_desk_pair-640\.webp"\) 1x, url\("img\/bg_desk_pair_2x-768\.webp"\) 2x\) 50% 0 \/ max\(100%, 640px\) auto repeat-y/);
  assert.doesNotMatch(CSS_NC, /background-attachment: fixed/);
  assert.equal(MANIFEST.bg_desk_pair.src_size[1], 2 * 1536, 'desk + mirrored desk');
  // cream type on the desk: ≥ 4.5:1 against the desk's mean tone (before the darkening layer and the text shadow)
  const desk = MANIFEST.bg_desk_pair.tone as number[];
  assert.ok(contrast(token('cream'), desk) >= 4.5, `cream on the desk ${contrast(token('cream'), desk).toFixed(2)}:1`);
});

// ---------------------------------------------------------------- the letter sheets: repeated airmail band, never stretched

test('letter sheets (docs/11 §9): top slice · one stripe period repeated · bottom slice; site.js rounds to whole bands', () => {
  for (const [cls, key] of [['.invite', 'invitation_card'], ['.info', 'info_card']] as const) {
    const s = MANIFEST[key].slices;
    assert.match(s.method, /tekrar/);
    const pct = (n: number) => String(Math.round(n * 100000) / 100000).replace(/^0\./, '.');
    assert.ok(CSS.includes(`${cls} { --ar: ${pct(MANIFEST[key].ratio)}; --t: ${pct(s.top_end_pct / 100)}; --b: ${pct(s.bottom_start_pct / 100)}; }`), `${cls} slices from the manifest`);
    // the band file is exactly the band (one period of the stripes)
    const H = MANIFEST[key].src_size[1];
    assert.ok(Math.abs((s.bottom_start_pct - s.top_end_pct) / 100 * H - MANIFEST[`${key}_band`].src_size[1]) <= 1.5, `${key} band height`);
    assert.ok(s.band_px[1] >= s.period_range_px[0] && s.band_px[1] <= s.period_range_px[1]);
  }
  assert.match(rule('.paper::before'), /background-repeat: no-repeat round/, 'repeated, never stretched');
  assert.match(JS, /document\.querySelectorAll\('\.paper\[data-band\]'\)/);
  // (1.5 px: offsetHeight rounds up — 0.004 of a band added a whole band at 390 px, qa review)
  assert.match(JS, /const n = Math\.max\(1, Math\.ceil\(\(need - top - bot - 1\.5\) \/ band\)\);/);
  for (const [page, sel] of [['home', '.invite'], ['home', '.day-mini'], ['details', '.day-card'], ['rsvp', '.rsvp-card']] as const) {
    assert.equal(render(page).$(`.paper${sel}[data-band]`).length, 1, `${page} ${sel}`);
  }
  // the wax seal is decor beside the RSVP sheet, not text on it
  assert.equal(render('rsvp').$('.rsvp-card .card-seal').length, 0);
  assert.equal(render('rsvp').$('.wrap > .card-seal').length, 1);
});

// ---------------------------------------------------------------- qa lessons (docs/11 §15 + qa-kontrol of 01/03)

test('qa lessons: clean placeholders, first screen above the nav, uncut clusters, ≥ 11 px text, contrast, sizes', () => {
  // neutral placeholders are clean crops of the paper (min luminance ≥ 170)
  for (const key of Object.keys(theme.manifest.photos)) assert.ok(MANIFEST[`ph_${key}`].min_lum >= 170, `ph_${key} min luminance ${MANIFEST[`ph_${key}`].min_lum}`);
  // GPT defects cleaned in the pipeline (not redrawn): halo/specks removed, stains in the writing areas softened
  for (const k of ['envelope_closed', 'envelope_open', 'closure']) assert.ok(MANIFEST.cleanup[k].removed_px >= 0, k);
  assert.equal(MANIFEST.card_small.leke_px, 0, 'no stain left in the card\'s writing area');
  // first screen: hero names floor = manifest theme_check (36 px), landscape phones checked; the fold logic is there
  const floor = /\['\.hero \.names', 3\.2, 0\.3, (\d+)\]/.exec(JS);
  assert.ok(floor, 'hero names floor in fitNames');
  assert.deepEqual(MANIFEST.theme_check.first_screen, { landscape: true, names_min_px: Number(floor![1]) });
  assert.ok(Number(floor![1]) >= 36);
  assert.equal(MANIFEST.theme_check.particles, '.accent-layer');
  assert.match(JS, /p\.style\.cssText = 'position:fixed;height:100svh'/);
  assert.match(JS, /for \(const \[cls, navFloor\] of \[\[\[\], 0\.76\], \[\['is-tight'\], 0\], \[\['is-tight', 'is-long'\], 0\], \[\[\], 1\]\]\)/);
  assert.match(JS, /const pieces = \(\) => \[\.\.\.inner\.children\]\.filter\(\(c\) => c\.offsetParent && !c\.matches\('\.hero-card-wrap'\)\);/);
  assert.match(rule('.hero .scene-bg'), /bottom: var\(--fold, 0px\)/);
  // short landscape: the card beside the names (grid), both pages
  const land = /@media \(min-aspect-ratio: 1\/1\) and \(max-height: 620px\) \{([\s\S]*?)\n\}/.exec(CSS_NC);
  assert.ok(land, 'short-landscape block');
  assert.match(land![1], /\.hero-inner \{\s*display: grid; grid-template: 1fr repeat\(6, auto\) 1fr \/ auto minmax\(0, 460px\)/);
  assert.match(land![1], /\.hero-card-wrap \{ grid-area: 1 \/ 1 \/ -1;/);
  assert.match(land![1], /\.is-opened \.env-page \{[^}]*flex-direction: row;/, 'opened envelope beside Enter / Replay');
  // the hero card ≥ 150 px on phones and laptops; on short landscape screens it follows the first screen (third QA: with the
  // preview bar the 150 px floor put the card 10 px into the nav ground at 640×360 / 740×360); its copy stays ≥ 11 px
  const widths = RULES.filter(([, s]) => s.trim() === '.hero-card-wrap').flatMap(([, , b]) => [...b.matchAll(/width: ([^;]+)/g)].map((m) => m[1]));
  assert.ok(widths.length >= 3 && widths.filter((w) => !w.startsWith('clamp(150px')).length === 1, widths.join(' | '));
  assert.match(land![1], /\.hero-card-wrap \{[^}]*width: min\(\(var\(--vh\) - var\(--nav-h\) - 48px\) \* \.5886, 230px\);/);
  // clusters (qa review): whole — no mask, no clipping box; the hero's ends 8 px above the nav ground (26 px), smaller or
  // gone where its painted part would meet the hero's line boxes (site.js corner); page ends 8 px above the nav
  assert.match(rule('.hero .scene-bg .corner-br'), /bottom: 26px/);
  assert.match(rule(':is(.foot, .next-sec, .closing) > .page-corner'), /bottom: 8px/);
  assert.doesNotMatch(CSS_NC, /corner[^{]*\{[^}]*mask/);
  assert.match(JS, /const corner = \(hero\) => \{/);
  // second QA (2026-10-14): `hidden` lost to `.corner { display: block }` (47 of 297 loads) and the test used block boxes.
  // Now: the painted edge measured from decor_br / decor_tl (24 rows), line boxes (Range rects), display none below 64 px
  const edge = /const EDGE = \{ br: \[([\d.]+), '([^']{24})'\], tl: \[([\d.]+), '([^']{24})'\] \};/.exec(JS);
  assert.ok(edge, 'painted-edge profiles of both clusters');
  assert.ok(Math.abs(Number(edge![1]) - 1.234) < 0.01 && Math.abs(Number(edge![3]) - 1.105) < 0.01, 'h / w of decor_br / decor_tl');
  for (const k of [2, 4]) assert.ok([...edge![k]].every((c) => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 80), 'edges in 32nds of the width');
  assert.match(JS, /r\[e\.matches\('\.btn, \.card'\) \? 'selectNode' : 'selectNodeContents'\]\(e\);/, 'line boxes, not block boxes');
  assert.match(JS, /if \(\(w \*= 0\.94\) < 64\) return c\.style\.display = 'none';/, 'gone means display: none (the [hidden] attribute lost to the CSS)');
  assert.doesNotMatch(JS, /br\.hidden = true/);
  assert.match(JS, /giveWay\(br, ink\(\[\.\.\.inner\.querySelectorAll\('\.names, \.hero-date, \.hero-venue, \.hero-city, \.cd-cell, \.cd-done, \.btn, \.card'\)\]\)\);/);
  // the envelope page and the inner-page heads: the clusters give way to the texts too (qa: "You are invited", "Tap to
  // open", "WEDNESDAY" touched them); the preview bar comes off the first screen (--vh)
  assert.match(JS, /const ts = ink\(\[h1\.previousElementSibling, h1, hint\]\);\s*cs\.forEach\(\(c\) => giveWay\(c, ts\)\);/);
  assert.match(JS, /hu = list\.filter\(\(x\) => x\.parentNode === head\);/);
  assert.match(JS, /if \(pc\) giveWay\(pc, ink\(hu\)\);/);
  assert.match(JS, /root\.style\.setProperty\('--bar', \(document\.querySelector\('\[data-platform-preview-bar\]'\)\?\.offsetHeight \|\| 0\) \+ 'px'\)/);
  assert.match(CSS_NC, /--vh: calc\(100svh - var\(--bar, 0px\)\);/);
  for (const sel of ['.env-page', '.hero', '.page-bg']) assert.match(rule(sel), /var\(--vh\)/, `${sel}: the first screen without the preview bar`);
  assert.doesNotMatch(rule('.page-bg'), /100svh/);
  // the hero names: room for Homemade Apple's descenders (≈ .34 em below the line box) before the date (qa: "Margot" g
  // through "SATURDAY", 10 % at 1280×650)
  assert.match(rule('.hero .names'), /margin: clamp\(4px, 1\.6svh, 18px\) 0 \.34em;/);
  assert.match(rule('.hero.is-tight .names'), /margin: 2px 0 \.4em;/);
  assert.doesNotMatch(rule('.hero-date') + rule('.hero.is-tight .hero-date'), /margin-top/);
  assert.equal(MANIFEST.theme_check.clusters, '.corner', 'theme-check measures the clusters (cuts, nav band)');
  // inner pages: the first-screen fold units, the head that lifts, the flex columns that pack, the signature unit
  for (const [page, n] of [['story', 7], ['details', 10], ['rsvp', 6]] as const) {
    const { $ } = render(page);
    assert.equal($('[data-lift]').length, 1, `${page}: one head lifts`);
    assert.ok($('main [data-fold]').length >= n, `${page}: ${$('main [data-fold]').length} fold units`);
  }
  assert.equal(render('rsvp').$('.rsvp-text > .sig[data-fold] > .love + .sign').length, 1);
  assert.equal(render('details').$('.sched-list[data-pack] > .sched-row[data-fold]').length, 3);
  // RSVP (second QA: up to 465 px of blank letter when the signature folded): tighter rhythm, then a narrower letter (names
  // ≥ 18 px); a fold leaves no blank paper — its blank is spread over the gaps above (≤ 72 px each); one fold per page
  assert.match(JS, /if \(!wrap\.classList\.contains\('tight'\)\) \{ wrap\.classList\.add\('tight'\); continue; \}/);
  assert.match(JS, /if \(cw > 225\) \{ head\.style\.setProperty\('--cw', \(cw = Math\.max\(225, cw \* 0\.94\)\) \+ 'px'\); continue; \}/);
  assert.ok(225 * 0.08 >= 18, 'names (8cqw) ≥ 18 px at the narrowest letter');
  assert.match(rule('.tight .pill .btn'), /min-height: 44px/, 'the pill keeps a 44 px target');
  assert.match(JS, /units\.forEach\(\(x\) => \{ x\.style\.marginTop = ''; \}\);\s*const gap = up\.length/, 'one push per page: any earlier one is stale');
  // third QA: a letter never shows only its title — its first unit (details: the title or the first schedule row; RSVP: the
  // title) gets the signature's steps (full lift, .tight, --cw ≥ 225), else the whole letter folds and the blank goes above it
  assert.match(JS, /ld = u === sig \|\| !up\.length && u\.closest\('\[data-lift\] \.paper'\);/);
  assert.match(JS, /if \(u !== sig\) up = hu, u = wrap;/);
  assert.match(CSS_NC, /\.tight :is\(\.card-title, \.sched-row > \*\) \{ line-height: 1\.25; \}/);
  assert.match(rule('.tight .info-text'), /padding-top: 20cqw/, 'the title stays under the pressed flower (17.7 % of the width)');
  assert.match(rule('.details-top .tight'), /margin-top: -8px/);
  assert.match(CSS_NC, /\.details-top \{ --pt0: clamp\(24px, 7svh, 80px\); padding-top: calc\(var\(--pt0\) - var\(--lift, 0px\)\); \}/, 'the full lift on landscape screens');
  assert.match(JS, /Math\.min\(72, \(limit - 1 - bottom\(u\.previousElementSibling\)\) \/ up\.length\)/, "the blank under the last piece above (a twine too)");
  // details: "packed" must win over the list's space-evenly (it did not: a stale second fold, qa 148 + 87 px)
  assert.match(CSS_NC, /\.paper \[data-pack\]\.packed \{ justify-content: flex-start; \}/);
  assert.doesNotMatch(CSS_NC + JS, /--sg/);
  // the envelope page keeps "Tap to open" on screen: the stage gives way, then the names (landscape: between the clusters)
  assert.match(CSS_NC, /--obj: calc\(min\(86vw, 45svh \* 1\.5556, 440px\) \* var\(--ok, 1\)\)/);
  assert.match(CSS_NC, /\.env-head \{ width: min\(100%, 560px, 100vw - 1\.6 \* min\(32vw, 48vh, 500px\)\); \}/);
  assert.match(JS, /for \(let k = 1; k > 0\.63 && low\(\);\) page\.style\.setProperty\('--ok'/);
  // particles (qa review): arrival and closing in their own section, behind its text (z 0) and clipped to it
  assert.match(CSS_NC, /\.hero > \.accent-layer, \.closing > \.accent-layer \{ position: absolute; z-index: 0; \}/);
  assert.match(JS, /accents\('arrive', 0, document\.querySelector\('\.hero'\)\)/);
  // third QA: on landscape phones the arrival lane beside the card ends at the names column (the flowers passed behind the
  // names, date, venue and countdown at 667×375 / 844×390)
  assert.match(JS, /arrive: [^\n]*text: '\.hero \.names' \}\]/);
  assert.match(JS, /flightPath\(g\.path, t && r && t\.top < r\.bottom \? t\.left - 4 : W,/);
  assert.match(JS, /accents\('closing', 0, closing\)/);
  assert.match(JS, /closing: \[\{[^\n]*from: '\.replay-line' \}/);
  // second QA: the path started 1.6 flower heights above its y0 — now the whole flower starts below the Replay line
  assert.match(JS, /const y0 = fr \? fr\.bottom \+ 1\.6 \* g\.size\[1\] : 0/);
  assert.match(JS, /const y = down \? y0 - s \* 1\.6 \+/);
  // no Android tap rectangle
  assert.match(CSS_NC, /a, button, summary, label, \[role="button"\] \{ -webkit-tap-highlight-color: transparent; \}/);
  assert.match(rule('.stage'), /-webkit-tap-highlight-color: transparent/);
  // every absolute font size ≥ 11 px (cqw sizes carry a max(11px, …) floor where they can get small)
  for (const m of CSS_NC.matchAll(/font(?:-size)?: (?:\d{3} )?(\d+(?:\.\d+)?)px/g)) assert.ok(Number(m[1]) >= 11, `font ${m[0]}`);
  for (const sel of ['.card-copy .type', '.seal-mono', '.invite-text .host', '.dateblock .wd', '.dateblock .at', '.rsvp-text .wait', '.rsvp-text .kicker', '.invite-text .city', '.amp']) {
    assert.match(rule(sel), /font-size: max\(11px, /, `${sel}: 11 px floor`);
  }
  for (const sel of ['.sched-line .t', '.sched-line .l']) assert.match(rule(sel), /font: 400 max\(11px, /, sel);
  // contrast ≥ 4.5:1 on the parchment (page colour) and the sheets (ivory)
  const page = hex(MANIFEST.page_color);
  for (const k of ['ink', 'ink-soft', 'pen', 'red-ink', 'navy-ink']) {
    assert.ok(contrast(token(k), page) >= 4.5, `${k} on the page ${contrast(token(k), page).toFixed(2)}:1`);
    assert.ok(contrast(token(k), token('ivory')) >= 4.5, `${k} on the sheet`);
  }
  assert.ok(contrast(token('ivory'), token('navy')) >= 4.5, 'pill label');
  // docs/11 §6: site.js ≤ 35 KB, site.css ≤ 45 KB, no library
  assert.ok(statSync(path.join(DIR, 'site.js')).size <= 35 * 1024, `site.js ${statSync(path.join(DIR, 'site.js')).size} B`);
  assert.ok(statSync(path.join(DIR, 'site.css')).size <= 45 * 1024, `site.css ${statSync(path.join(DIR, 'site.css')).size} B`);
  for (const page of PAGES) {
    render(page).$('script[src]').each((_, el) => {
      const src = (el as unknown as { attribs: Record<string, string> }).attribs.src;
      assert.ok(src === '/rsvp/form.js' || src === `/themes/${ID}/site.js`, `${page}: ${src}`);
    });
  }
  // reduced motion: every entrance visible at once, the hint and floats still
  assert.match(CSS_NC, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.js \[data-step\] \{ opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; \}/);
});

test('srcset on every multi-size part; images below the first screen are lazy', () => {
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || $(el).attr('data-photo-state') === 'user' || $(el).closest('.ph-mark').length) return;
      const files = (MANIFEST[m[1]]?.files ?? []).length;
      if (files < 2 || $(el).hasClass('float')) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes (docs/11 §5.5)`);
    });
  }
  const home = render('home').$;
  for (const sel of ['.invite .paper-top', '.mini-stamp .frame-img', '.day-mini .paper-top', '.mini-seal img', '.foot .page-corner']) {
    assert.equal(home(sel).attr('loading'), 'lazy', `home ${sel}`);
  }
  const index = render('index').$;
  assert.equal(index('img[loading="lazy"]').length, 0, 'the envelope page is all first view');
  assert.equal(index('.env-open').attr('fetchpriority'), 'high');
});

// ---------------------------------------------------------------- 13: site.js contract

test('13 site.js: reads #site-data, navigates with the page map, per-site session keys = <head> scripts, DEV_CONTENT = demo', () => {
  assert.match(JS, /getElementById\('site-data'\)/);
  assert.match(JS, /location\.href = PAGES\.home/);
  assert.match(JS, /l\.href = PAGES\.home/, 'prefetch uses the page map');
  assert.doesNotMatch(JS, /location\.href\s*=\s*['"]/, 'no literal navigation target');
  assert.doesNotMatch(JS, /innerHTML|eval\(|new Function/);
  assert.match(JS, /a\[data-url-missing\]/);
  assert.match(JS, /countdown_target_utc/);
  const literals = JS.match(/'[a-z]+\.html'/g) ?? [];
  assert.deepEqual(literals, ["'index.html'", "'home.html'", "'story.html'", "'details.html'", "'rsvp.html'"], 'only the dev fallback page map');
  assert.match(JS, /const PAGES = \(SITE && SITE\.pages\) \|\|/);
  assert.match(JS, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
  assert.match(JS, /const KEY = SITE && SITE\.slug \? ':' \+ SITE\.slug : ''/);
  const index = readFileSync(path.join(DIR, 'index.html'), 'utf8');
  assert.match(index, /'invite:opened'\+k/);
  assert.match(readFileSync(path.join(DIR, 'home.html'), 'utf8'), /'invite:arrive'\+k/);
  const rules = cheerio.load(index)('script[type="speculationrules"]').text();
  assert.doesNotMatch(rules, /\.html|"urls"/);
  assert.match(rules, /"selector_matches":"a\[data-enter\]"/);
  // DEV_CONTENT (static preview only) = content.demo.json
  const devSrc = /const DEV_CONTENT = (\{[\s\S]*?\n\});/.exec(JS)![1];
  const dev = new Function(`return (${devSrc});`)();
  assert.deepEqual(dev, demo());
  // devRender's photo map = theme.json
  const map = new Function(`return (${/const PHOTO_SOURCES = (\{[^}]+\})/.exec(JS)![1]});`)();
  assert.deepEqual(map, Object.fromEntries(Object.entries(theme.manifest.photos).map(([k, p]) => [k, p.source])));
  // view-transition names: one element each per page
  assert.equal((CSS.match(/view-transition-name: invite-card/g) ?? []).length, 2, 'index .env .card + home .hero-card');
  for (const page of ['index', 'home'] as PageName[]) assert.equal(render(page).$('.card').length, 1, `${page}: one card with the transition name`);
  assert.match(JS, /root\.dataset\.js = 'ready';/);
});

// ---------------------------------------------------------------- 14–15: real routes, privacy

test('14 routes: a published site on this theme serves 200 pages with CSP hashes, the uploaded photo and theme assets', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getAsset } = await import('../app/themes/[theme]/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-va', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-va'), { params: Promise.resolve({ slug: 'maren-and-theo-va' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', new RegExp(`^https?://[^/]+/themes/${ID}/img/og-1200x630\\.jpg$`), 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Margot & Henry wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-va/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-va', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['img', 'env_open-880.webp'], ['img', 'env_torn-880.webp'], ['img', 'closure-480.webp'], ['img', 'mask_portrait.png'], ['img', 'bg_desk_pair-640.webp'], ['img', 'og-1200x630.jpg']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-va' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-va'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-va', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
    body: JSON.stringify({ name: 'Ada Fictional', email: '', attending: 'yes', guests: '2', message: 'See you there', website: '' }),
  }), rctx);
  assert.equal(posted.status, 200);
  assert.deepEqual((await adapter.listRsvps(created.site.id)).map((r) => [r.name, r.attending, r.guests]), [['Ada Fictional', true, 2]]);
  for (const p of [['index.html'], ['theme.json'], ['content.demo.json'], ['build_images.py'], ['img', 'manifest.json']]) {
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-airmail-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-airmail-site/story'), { params: Promise.resolve({ slug: 'quiet-airmail-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-airmail-site'), { params: Promise.resolve({ slug: 'quiet-airmail-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-airmail-site/${page}`), { params: Promise.resolve({ slug: 'quiet-airmail-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});

// ---------------------------------------------------------------- the first-screen rules, measured in a browser (qa review)
// Playwright from the global install (docs/11 §13.3; never `playwright install`): the pages are rendered here with the
// engine and served from the theme folder, so site.css + site.js (folds, tiles, the signature, envFit) run for real.
// Skipped when Playwright or its browsers are not installed. Google Fonts load through the proxy when there is one (else
// the fallback fonts: the rules hold either way, site.js measures). Reduced motion: every entrance at rest.
type Probe = (p: any) => Promise<any>;
async function withBrowser(t: { skip: (m: string) => void }, fn: (open: (page: PageName, content: unknown, w: number, h: number, probe?: Probe, motion?: boolean, bar?: boolean) => Promise<any>) => Promise<void>) {
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
    await fn(async (page, content, w, h, probe, motion, bar) => {
      // bar: the shared preview link's "Preview" bar (the platform's own markup, first in <body>)
      const html = bar ? withPreviewBar(render(page, content).html, false) : render(page, content).html;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: motion ? 'no-preference' : 'reduce', hasTouch: !!motion });
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
      await p.waitForTimeout(450); // site.js runs again on fonts.ready
      const m = await (probe ? probe(p) : p.evaluate(MEASURE));
      await ctx.close();
      return m;
    });
  } finally {
    await browser.close();
  }
}
// in the page (viewport px): the nav top; every text, control, photo slot and frame / card / seal image whose box crosses
// the nav top or starts under it on the first screen ("half under the nav"); the story frames; the RSVP signature unit
// with its seal; the envelope hint
const MEASURE = `(() => {
  const vh = innerHeight, r = (e) => e.getBoundingClientRect(), navEl = document.querySelector('.site-nav'), nav = navEl ? r(navEl).top : vh;
  const decor = '.corner, .float, .scene-bg, .accent-layer, .paper-top, .tuck, .desk-acc, .postmark, .twine, .seal-mono, .ph-mark, .site-nav, .skip';
  const shown = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return r(e).width > 0.5 && r(e).height > 0.5; };
  const half = [];
  for (const e of document.querySelectorAll('main *')) {
    if (e.closest(decor) || e.closest('[hidden]')) continue;
    const text = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!(text || e.matches('a, button, input, textarea, .photo-slot, .frame-img, .vframe, .card-img, .card-seal > img, .mini-seal > img')) || !shown(e)) continue;
    const b = r(e);
    if (b.top < vh - 1 && b.bottom > nav + 0.5) half.push((e.className || e.tagName) + ' ' + Math.round(b.top) + '..' + Math.round(b.bottom));
  }
  const frames = [...document.querySelectorAll('.stamp')].map((s) => ({ top: r(s.querySelector('.frame')).top, bottom: r(s).bottom, win: r(s.querySelector('.photo-slot')).width }));
  const sig = document.querySelector('.sig'), seal = document.querySelector('.card-seal'), hint = document.querySelector('.env-hint');
  return { vh, nav, half, frames, sw: document.documentElement.scrollWidth, hint: hint && r(hint).bottom,
    sig: sig && { top: r(sig).top, end: Math.max(r(sig).bottom, r(seal).bottom), names: parseFloat(getComputedStyle(sig.querySelector('.sign')).fontSize) } };
})()`;

test('browser (qa review): nothing half under the nav; the story row whole on laptops; the RSVP signature + seal before the fold; the envelope hint on landscape phones', async (t) => {
  await withBrowser(t, async (open) => {
    // rule 3 (G402 / G405 lesson): every first-screen piece ends above the nav or starts below the first screen
    // (before the review: story 51/51 screens, details 29/51, RSVP 43/51 had a piece across the nav line)
    for (const page of ['story', 'details', 'rsvp'] as PageName[]) {
      for (const [w, h] of [[375, 667], [390, 844], [844, 390], [1366, 657]]) {
        for (const [name, rec] of [['demo', demo()], ['stress', stressRecord(demo())]] as const) {
          const m = await open(page, rec, w, h);
          const at = `${page} ${w}×${h} ${name}`;
          assert.deepEqual(m.half, [], `${at}: pieces half under the nav (top ${Math.round(m.nav)})`);
          assert.ok(m.sw <= w, `${at}: no sideways scroll`);
        }
      }
    }
    // rule 4: story on laptops — the three frames on the first screen as one row (never one or two alone), above the nav
    // (before: 1280×650 / 1366×657 no frame, 1280×720–800 a frame across the nav)
    for (const [w, h] of [[1280, 650], [1280, 720], [1366, 768], [1280, 800]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())]] as const) {
        const m = await open('story', rec, w, h);
        const at = `story ${w}×${h} ${name}`;
        const on = m.frames.filter((f: { top: number }) => f.top < m.vh).length;
        assert.equal(on, 3, `${at}: ${on} of 3 frames on the first screen`);
        assert.ok(Math.max(...m.frames.map((f: { bottom: number }) => f.bottom)) <= m.nav, `${at}: the row ends above the nav`);
        assert.ok(m.frames[0].win >= 140, `${at}: photo window ${Math.round(m.frames[0].win)} px`);
      }
    }
    // phones: the first frame with its caption above the nav where it fits with a window ≥ 38vw
    for (const [w, h] of [[390, 844], [375, 667]]) {
      const m = await open('story', demo(), w, h);
      assert.ok(m.frames[0].bottom <= m.nav && m.frames[0].win >= 0.38 * w, `story ${w}×${h}: the first frame on screen, window ${Math.round(m.frames[0].win)} px`);
    }
    // rule 5: RSVP "With love," + the names + the wax seal end above the nav before anything folds (range names
    // "Alexandrina Rose & Maximilian James"; before: at 390×844 the seal ran under the nav, at 360–375 px the names did)
    for (const [w, h] of [[360, 640], [390, 844], [430, 932], [1280, 720], [1280, 800]]) {
      const m = await open('rsvp', rangeRecord(demo()), w, h);
      const at = `rsvp ${w}×${h} range`;
      assert.ok(m.sig.top < m.vh && m.sig.end <= m.nav, `${at}: signature + seal on the first screen (end ${Math.round(m.sig.end)}, nav ${Math.round(m.nav)})`);
      assert.ok(m.sig.names >= 15, `${at}: names ${m.sig.names} px`);
    }
    // the envelope on a phone on its side and a short laptop: "Tap to open" on screen with long names (before: off screen)
    for (const [w, h] of [[667, 375], [844, 390], [1280, 650]]) {
      for (const [name, rec] of [['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
        const m = await open('index', rec, w, h);
        assert.ok(m.hint <= m.vh, `index ${w}×${h} ${name}: "Tap to open" ends at ${Math.round(m.hint)} of ${m.vh}`);
      }
    }
  });
});

// second QA (2026-10-14): text never on painted decor or on other text (docs/11 §12: target 0 %, ≤ 2 % anti-aliasing), the
// RSVP letter without blank paper, one fold per page, the opening flower on every phone
/** Share (%) of each listed text's line boxes (ink band: 12 % off top and bottom) whose pixels change between two states. */
async function inkShare(p: any, sel: string, before: string, after: string): Promise<Array<[string, number]>> {
  const boxes: Array<[string, number, number, number, number]> = await p.evaluate((sel: string) => {
    for (let i = 1; i < 5000; i++) clearInterval(i);
    const out: Array<[string, number, number, number, number]> = [];
    document.querySelectorAll(sel).forEach((el) => {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      for (const q of el.matches('.btn') ? [el.getBoundingClientRect()] : [...rg.getClientRects()]) {
        if (q.width < 2 || q.bottom <= 0 || q.top >= innerHeight) continue;
        out.push([`${String(el.className).split(' ')[0]} "${(el.textContent || '').trim().slice(0, 18)}"`, Math.max(0, Math.round(q.left)),
          Math.max(0, Math.round(q.top + q.height * 0.12)), Math.min(innerWidth, Math.round(q.right)), Math.min(innerHeight, Math.round(q.bottom - q.height * 0.12))]);
      }
    });
    return out;
  }, sel);
  const shot = async (css: string) => {
    const tag = await p.addStyleTag({ content: css });
    await p.waitForTimeout(80);
    const b = await sharp(await p.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    await tag.evaluate((e: Element) => e.remove());
    return b;
  };
  const A = await shot(before), B = await shot(after);
  return boxes.map(([k, x0, y0, x1, y1]) => {
    let n = 0, d = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * A.info.width + x) * 3;
      n++;
      if (Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2])) > 40) d++;
    }
    return [k, n ? (100 * d) / n : 0];
  });
}
const CLEAR = '*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; } .site-nav { visibility: hidden !important; }';

test('browser (second QA): hero and envelope text off the clusters, names off the date, the RSVP letter without blank paper, one fold, the opening flower', async (t) => {
  await withBrowser(t, async (open) => {
    // 1 the hero's lower-right cluster never under the hero's text (before: 47 of 297 loads, range 360×640 venue 14.4 %,
    // stress 384×854 date 52.9 %, 375×812 names 17.7 %): decor shown vs hidden, every hero line box ≤ 2 %
    const heroText = '.hero-inner :is(.names, .hero-date, .hero-venue, .hero-city, .cd-num, .cd-lbl, .btn)';
    const hero: Array<[string, ContentRecord, number, number]> = [['range', rangeRecord(demo()), 360, 640], ['range', rangeRecord(demo()), 320, 740],
      ['stress', stressRecord(demo()), 375, 812], ['stress', stressRecord(demo()), 384, 854], ['stress', stressRecord(demo()), 640, 360], ['demo', demo(), 390, 844]];
    for (const [name, rec, w, h] of hero) {
      const r = await open('home', rec, w, h, (p) => inkShare(p, heroText, CLEAR, `${CLEAR} .hero .scene-bg .corner { visibility: hidden !important; }`));
      assert.ok(r.length > 4, `home ${w}×${h} ${name}: hero text found`);
      for (const [k, v] of r) assert.ok(v <= 2, `home ${w}×${h} ${name}: ${k} ${v.toFixed(1)} % on the cluster`);
    }
    // 3 the envelope page: "You are invited", the names and "Tap to open" off both clusters (before: range 340×720 kicker
    // 4.1 %, 360×740 hint 3.0 %)
    for (const [w, h] of [[320, 568], [340, 720], [360, 740]]) {
      const r = await open('index', rangeRecord(demo()), w, h, (p) => inkShare(p, '.env-head :is(.kicker, .names), .env-hint',
        `${CLEAR} .stage { visibility: hidden !important; }`, `${CLEAR} .stage, .corner, .float { visibility: hidden !important; }`));
      for (const [k, v] of r) assert.ok(v <= 2, `index ${w}×${h} range: ${k} ${v.toFixed(1)} % on decor`);
    }
    // 2 Homemade Apple's descenders ("Margot", "Henry") never into the date line (before: 1280×650 10 %, 1366×657 9.9 %)
    for (const [w, h] of [[390, 844], [320, 568], [1280, 650], [1366, 657], [1280, 800]]) {
      const r = await open('home', demo(), w, h, (p) => inkShare(p, '.hero-date', CLEAR,
        `${CLEAR} .hero .names, .hero .names * { color: #000 !important; -webkit-text-fill-color: #000 !important; }`));
      for (const [k, v] of r) assert.ok(v <= 0.5, `home ${w}×${h}: names ink in ${k} ${v.toFixed(2)} %`);
    }
    // 4 the RSVP letter: "With love," + names + seal on the first screen where they fit with names ≥ 18 px (before: blank
    // 149 px at 320×568, 316–392 px on stress laptops); else one fold whose blank goes into the gaps above (in-letter gap
    // ≤ the nav band + 16 px, first-screen blank ≤ 16 px)
    const RSVP = (p: any) => p.evaluate(() => {
      const r = (e: Element) => e.getBoundingClientRect(), nav = r(document.querySelector('.site-nav')!).top, sig = document.querySelector('.sig')!;
      const units = [...document.querySelectorAll('.rsvp-text > [data-fold]')], end = Math.max(r(sig).bottom, r(document.querySelector('.card-seal')!).bottom);
      const above = units.filter((u) => u !== sig && r(u).bottom <= nav);
      return { nav, vh: innerHeight, sigTop: r(sig).top, end, last: Math.max(...above.map((u) => r(u).bottom)),
        names: parseFloat(getComputedStyle(sig.querySelector('.sign')!).fontSize), band: innerHeight - nav };
    });
    for (const [name, rec, w, h] of [['demo', demo(), 320, 568], ['range', rangeRecord(demo()), 360, 640], ['stress', stressRecord(demo()), 1024, 768], ['stress', stressRecord(demo()), 1280, 800]] as const) {
      const m = await open('rsvp', rec, w, h, RSVP);
      assert.ok(m.end <= m.nav - 8 && m.names >= 18, `rsvp ${w}×${h} ${name}: signature + seal end ${Math.round(m.end)} (nav ${Math.round(m.nav)}), names ${m.names} px`);
    }
    for (const [name, rec, w, h] of [['stress', stressRecord(demo()), 360, 640], ['stress', stressRecord(demo()), 375, 667], ['stress', stressRecord(demo()), 1366, 657], ['demo', demo(), 844, 390]] as const) {
      const m = await open('rsvp', rec, w, h, RSVP);
      const at = `rsvp ${w}×${h} ${name}`;
      assert.ok(m.sigTop >= m.vh, `${at}: the signature folds whole`);
      assert.ok(m.nav - m.last <= 16, `${at}: ${Math.round(m.nav - m.last)} px blank on the first screen`);
      assert.ok(m.sigTop - m.last <= m.band + 16, `${at}: ${Math.round(m.sigTop - m.last)} px gap in the letter (nav band ${Math.round(m.band)})`);
    }
    // 5 details: one fold in the "Order of the Day" letter (before: 148 + 87 px at 375×667 range, a stale second push)
    for (const [w, h] of [[375, 667], [1280, 650], [1366, 657]]) {
      const pushes: number[] = await open('details', rangeRecord(demo()), w, h, (p) => p.evaluate(() => [...document.querySelectorAll('main [data-fold]')].map((u) => {
        const el = u as HTMLElement, inl = el.style.marginTop, now = parseFloat(getComputedStyle(el).marginTop);
        el.style.marginTop = '';
        const add = now - parseFloat(getComputedStyle(el).marginTop);
        el.style.marginTop = inl;
        return add;
      }).filter((a) => a > 72.5)));
      assert.ok(pushes.length <= 1, `details ${w}×${h} range: ${pushes.length} folds (${pushes.map(Math.round).join(' + ')} px)`);
    }
    // 6 "… while a pressed flower flutters down": on every phone (before: 320×568 0 of 6, 360×640 2 of 6), never over the photo
    for (const [w, h] of [[320, 568], [360, 640], [390, 844]]) {
      for (let k = 0; k < 2; k++) {
        const f = await open('index', demo(), w, h, async (p) => {
          const st = await p.locator('.stage').boundingBox();
          await p.touchscreen.tap(st.x + st.width / 2, st.y + st.height * 0.75);
          await p.waitForTimeout(1800);
          return p.evaluate(() => {
            const slot = document.querySelector('.env .card [data-slot]')!.getBoundingClientRect();
            return [...document.querySelectorAll('.accent-layer img')].map((i) => {
              const b = i.getBoundingClientRect();
              return { w: b.width, over: (Math.max(0, Math.min(b.right, slot.right) - Math.max(b.left, slot.left)) * Math.max(0, Math.min(b.bottom, slot.bottom) - Math.max(b.top, slot.top))) / (b.width * b.height) };
            });
          });
        }, true);
        assert.equal(f.length, 1, `index ${w}×${h}: ${f.length} flowers fall`);
        assert.ok(f[0].w >= 30 && f[0].over <= 0.3, `index ${w}×${h}: flower ${Math.round(f[0].w)} px, ${(100 * f[0].over).toFixed(0)} % over the photo`);
      }
    }
  });
});

// third QA (2026-10-15): landscape phones, live and through the shared preview link (the platform's "Preview" bar on top)
test('browser (third QA): the details letter never shows only its title on landscape screens; the hero card off the nav ground with the preview bar', async (t) => {
  await withBrowser(t, async (open) => {
    // 1 details (before: stress 640×360 107 px blank first screen / 180 px gap in the letter, 667×375 121 / 194, 740×360
    // 107 / 180; with the bar demo 640×360 / 740×360 72 / 145, stress 71 / 144 … 844×390 99 / 172): the title and at least
    // the first row above the nav, the next row folded with ≤ 16 px blank paper above the nav
    const DET = (p: any) => p.evaluate(() => {
      const r = (e: Element) => e.getBoundingClientRect(), nav = r(document.querySelector('.site-nav')!).top, vh = innerHeight;
      const units = [...document.querySelectorAll('.day-card [data-fold]')].map((u) => [r(u).top, r(u).bottom]);
      const on = units.filter(([, b]) => b <= nav), next = units.find(([tp]) => tp >= vh);
      return { nav, vh, band: vh - nav, on: on.length, last: Math.max(...on.map(([, b]) => b)), next: next ? next[0] : null,
        half: units.filter(([tp, b]) => tp < vh && b > nav).length, paper: r(document.querySelector('.day-card')!).top };
    });
    for (const [w, h] of [[640, 360], [667, 375], [740, 360], [844, 390]]) {
      for (const [name, rec] of [['demo', demo()], ['stress', stressRecord(demo())]] as const) {
        for (const bar of [false, true]) {
          const m = await open('details', rec, w, h, DET, false, bar);
          const at = `details ${w}×${h} ${name}${bar ? ' + preview bar' : ''}`;
          assert.equal(m.half, 0, `${at}: a letter unit half under the nav`);
          assert.ok(m.on >= 2, `${at}: ${m.on} unit(s) of the letter on the first screen (the title alone?)`);
          assert.ok(m.nav - m.last <= 16, `${at}: ${Math.round(m.nav - m.last)} px blank paper on the first screen`);
          if (m.next !== null) assert.ok(m.next - m.last <= m.band + 16, `${at}: ${Math.round(m.next - m.last)} px gap in the letter (nav band ${Math.round(m.band)})`);
        }
      }
    }
    // where even the tight letter's first row cannot fit (568×320, stress names + schedule), the whole letter folds
    const low = await open('details', stressRecord(demo()), 568, 320, DET, false, true);
    assert.ok(low.half === 0 && low.on === 0 && low.paper >= low.vh, `details 568×320 stress + bar: the letter starts ${Math.round(low.paper)} (screen ${low.vh})`);
    // 2 home with the preview bar (before: 640×360 / 740×360, all three records: the card 48–303 px, nav 293 — 10 px into
    // the nav ground, the RSVP pill folded): the card ends ≥ 8 px above the nav, its copy ≥ 11 px, nothing half under the nav
    const HOME = (p: any) => p.evaluate(`(() => { const m = ${MEASURE}; const c = document.querySelector('.hero-card').getBoundingClientRect();
      return { ...m, card: c.bottom, copy: Math.min(...[...document.querySelectorAll('.card-copy > *')].filter((e) => e.offsetParent).map((e) => parseFloat(getComputedStyle(e).fontSize))) }; })()`);
    for (const [w, h] of [[640, 360], [740, 360], [667, 375], [844, 390]]) {
      for (const [name, rec] of [['demo', demo()], ['range', rangeRecord(demo())], ['stress', stressRecord(demo())]] as const) {
        const m = await open('home', rec, w, h, HOME, false, true);
        const at = `home ${w}×${h} ${name} + preview bar`;
        assert.deepEqual(m.half, [], `${at}: pieces half under the nav (top ${Math.round(m.nav)})`);
        assert.ok(m.card <= m.nav - 8, `${at}: the card ends at ${Math.round(m.card)} (nav ${Math.round(m.nav)})`);
        assert.ok(m.copy >= 11, `${at}: card copy ${m.copy} px`);
      }
    }
  });
});
