// Theme platform/themes/olive-ivory (design 01 · Olive & Ivory, task G401) — docs/11_TEMA_STANDARDI.md §13.2.
// Server-side rendering with the content record, photo slots, optional blocks, links, the theme files, the GPT image
// build (img/manifest.json) and the site.js contract. Browser checks (widths, short phones, opening flow, stress record,
// weight, video) live in scripts/theme-check.cjs --theme olive-ivory; G051 in the browser in tests/g051-browser.ts.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { stressRecord } from '../scripts/lib/theme-env.ts';
import { PLATFORM_ROOT, REPO_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'olive-ivory';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const COLLECTION_RECORD = path.join(REPO_ROOT, 'collections/01_Olive_Ivory/content.demo.json');
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'avery-and-jordan';
const MANIFEST = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-oi-data-');
  theme = (await loadTheme(ID))!;
});

/** The theme's own demo record (= collections/01_Olive_Ivory/content.demo.json). Fresh copy each call. */
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

// ---------------------------------------------------------------- 1–2, 16: manifest, files, demo record, /start

test('1 theme.json: public theme, five pages, the five standard photo slots with the window boxes of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Olive & Ivory');
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
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  for (const m of js.matchAll(/'(img\/[^']+\.webp)'/g)) refs.add(m[1]);
  assert.ok(refs.size > 40, `${refs.size} references`);
  for (const r of refs) assert.ok(existsSync(path.join(DIR, r)), `missing theme file: ${r}`);
  // og:image (1200×630, nameless) and the tab icon: files of the theme, tags written by the engine (G055)
  assert.ok(statSync(path.join(DIR, 'img/og-1200x630.jpg')).size > 20_000);
  assert.deepEqual(MANIFEST.og.size, [1200, 630]);
  assert.ok(existsSync(path.join(DIR, 'img/favicon.png')));
  assert.equal(MANIFEST.favicon.source, 'closure');
  // (the og:image / icon tags themselves are written by the route: test 14)
  // docs/11 §1: no GPT sources / prep output / previews in the theme folder; total ≤ 3 MB
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
  assert.ok(claim, '/start?theme=olive-ivory works');
  assert.equal(claim!.demoSource, 'theme', 'demo content from the theme folder');
  assert.equal(claim!.demo.partners[0].display_name, 'Avery');
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
  assert.equal(index('title').text(), 'Avery & Jordan · June 12, 2027');
  assert.equal(index('h1').text(), 'Avery & Jordan');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, June 12, 2027 · Napa, California");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.nojs-only a').attr('href'), `/${SLUG}/home`);
  assert.equal(index('.stage').attr('role'), 'button');
  assert.equal(index('.stage').attr('tabindex'), '0');
  assert.equal(index('.stage .card').attr('aria-hidden'), 'true');
  assert.equal(render('story', content).$('title').text(), 'Our Story · Avery & Jordan');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Avery & Jordan');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(details('.sched-row .loc').map((_, el) => details(el).text()).get(), ['The Garden Terrace', 'The Olive Courtyard', 'The Grand Ballroom']);
  const home = render('home', content).$;
  assert.deepEqual(['.wd', '.mon', '.day', '.yr', '.at'].map((sel) => home(`.dateblock ${sel}`).text()), ['Saturday', 'June', '12', '2027', 'at 4:00 PM']);
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
  assert.equal(render('rsvp', content).$('a.textlink[href*="replay=1"]').attr('href'), `/${SLUG}?replay=1`);
  // the monogram pressed into the seal is the record's initials (panel: Monogram field)
  assert.equal(index('.closure .seal-mono').text(), 'A & J');
  assert.equal(render('rsvp', content).$('.card-seal .seal-mono').text(), 'A & J');
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
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.deepEqual(personal.filter((s) => css.includes(s)), []);
  // W1 comp demo text is a layout reference only
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /Willow Grove|Avery|Jordan|First hello|The proposal/);
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
    assert.ok(!/Avery|Jordan|Willow|Napa|A & J/.test($('body').text() + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy .kicker').last().text(), 'Bath', 'city without region: no stray comma');
  assert.equal(index('.seal-mono').text(), 'M & T');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location: no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('p[data-if="ceremony_time"]').text(), 'The ceremony begins at 3:30 PM.', 'schedule.0 without a location → no " in …"');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.v-day .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  assert.equal(JSON.parse(home('#site-data').text()).derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
  assert.equal(render('rsvp', c).$('.deadline').text(), 'August 1, 2028');
});

test('23 story intro: one sentence ending with the formatted date and a full stop; no paragraph without an intro', () => {
  const { $ } = render('story');
  assert.equal($('.lede').text(), 'Slow lunches, golden evenings and one walk through the olive grove led us to June 12, 2027.');
  const c = demo();
  c.story!.intro = '';
  assert.equal(render('story', c).$('.lede').length, 0);
  const gb = demo();
  gb.locale = 'en-GB';
  assert.match(render('story', gb).$('.lede').text(), /led us to 12 June 2027\.$/);
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
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  for (const m of ['card', 'portrait', 'landscape']) assert.match(css, new RegExp(`\\.mask-${m} \\{[^}]*url\\("img/mask_${m}\\.png"\\)`));
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
  assert.equal(home('.vignette').length, 2, 'no story vignette');
  assert.equal(home('[data-slot="story_1"]').length, 0);
  assert.equal(render('details', c).$('.dress').length, 0);
  const withLinks = demo();
  withLinks.record_kind = 'customer';
  Object.assign(withLinks.optional_blocks, { registry: true, travel_stay: true });
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 2);
  assert.equal(on('.dress em').text(), 'Formal Attire');
  assert.equal(render('details', demo()).$('.block').length, 0, 'on but without a link: hidden (no dead "link will be added soon" button)');
  assert.equal(render('details').$('[data-optional="guest_policy"]').length, 0);
  for (const page of PAGES) assert.doesNotMatch(readFileSync(path.join(DIR, `${page}.html`), 'utf8'), /guest_policy/, 'guest_policy is not used (docs/11 §3)');
});

test('8 links: a missing URL removes its button; real URLs get rel="noopener noreferrer"', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  const c = demo();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=willow';
  const a = render('details', c).$('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=willow');
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
  // the generic thank-you below the form is hidden once a reply was sent (site.js rsvp:state → html[data-rsvp-replied])
  assert.match(readFileSync(path.join(DIR, 'site.css'), 'utf8'), /html\[data-rsvp-replied\] \.closing \.title/);
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
    assert.doesNotMatch($('body').text(), /Kindly reply|Reply now|Will You Join Us/, page);
  }
  assert.ok(render('home').$(`a[href="/${SLUG}/rsvp"]`).length >= 4, 'with replies on: hero, invitation, vignette and nav link to the RSVP page');
});

test('12 guests: "Your photo here" only in previews, photo alt text from the content, no template comments', () => {
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.match(css, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/);
  assert.match(css, /\.ph-mark \{ display: none; \}/);
  assert.doesNotMatch(css, /^\.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/m, 'no unscoped rule');
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demo(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');
  const c = demo();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  assert.equal(render('home', c).$('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Avery & Jordan');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'Our first lunch');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'The Willow Grove Estate');
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

// ---------------------------------------------------------------- 17: lengths, schedule sizes, en-GB, stress record

test('17 schedule of 1 and 6 rows, long names, en-GB and the docs/11 §12 stress record render without warnings', () => {
  for (const n of [1, 6, 10]) {
    const c = demo();
    c.schedule = Array.from({ length: n }, (_, i) => ({ label: `Event ${i + 1}`, time: `${String(13 + i).padStart(2, '0')}:00`, location: i % 2 ? 'The Lawn' : null })) as ContentRecord['schedule'];
    c.ceremony_time = '13:00';
    const { $, warnings } = render('details', c);
    assert.deepEqual(warnings, [], `${n} rows`);
    assert.equal($('.sched-row').length, n);
    assert.equal(render('home', c).$('.v-day .sched-line').length, n, 'all rows in the source; CSS shows the first 4');
  }
  const gb = demo();
  gb.locale = 'en-GB';
  gb.partners[0] = { display_name: 'Anne-Sophie Élodie', full_name: 'Anne-Sophie Élodie Beaumont' };
  gb.name_display = 'Anne-Sophie Élodie & Jordan';
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
  // the long-name fit of the envelope page is in site.js (fitNames → --names-scale), the CSS uses the variable
  assert.match(readFileSync(path.join(DIR, 'site.js'), 'utf8'), /--names-scale/);
  assert.match(readFileSync(path.join(DIR, 'site.css'), 'utf8'), /var\(--names-scale, 1\)/);
  // Great Vibes + EB Garamond both ship latin-ext (accented names, docs/11 §12); exactly two families, display=swap
  const href = render('index').$('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').attr('href')!;
  assert.match(href, /family=EB\+Garamond:ital,wght@0,400;0,500;1,400&family=Great\+Vibes&display=swap/);
});

// ---------------------------------------------------------------- 18–20: G051

function g051Content(): ContentRecord {
  const c = demo();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the estate?', a: 'Yes, free parking by the olive grove.\nThe gate opens at 3:00 PM.' },
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
    assert.equal(google.searchParams.get('dates'), '20270612T230000Z/20270613T033000Z', `${page}: 4 PM PDT to two hours after the reception`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal a[data-calendar="google"]').attr('target'), '_blank');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  assert.equal(render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$('a[data-calendar="ics"]').attr('href'),
    `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demo();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  assert.match(js, /'home-invite':[^\n]*\['cal', \d+\]/);
  assert.match(js, /'details-card':[^\n]*\['cal', \d+\]/);
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
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
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
  const s = render('rsvp', sneaky);
  assert.equal(s.$('fieldset[data-rsvp-question="meal"] img').length, 0, 'question text is text, never markup');
});

// ---------------------------------------------------------------- 21–22: full-name fallback, K21

test('21 invitation card: without a full name the first name is shown (never an empty name line)', () => {
  const c = demo();
  c.partners[0] = { display_name: 'Avery', full_name: null };
  c.partners[1] = { display_name: 'Jordan', full_name: 'Jordan Ellis' };
  const { $, warnings } = render('home', c);
  assert.deepEqual(warnings, []);
  assert.deepEqual($('.invite-text .nm').map((_, el) => $(el).text()).get(), ['Avery', 'Jordan Ellis']);
  assert.equal($('.invite-text .nm[data-empty]').length, 0);
  assert.deepEqual(render('home').$('.invite-text .nm').map((_, el) => render('home').$(el).text()).get(), ['Avery Louise', 'Jordan Samuel']);
});

test('22 K21: no code-drawn frames — countdown and content blocks without border / outline / box-shadow; no SVG or CSS shapes', () => {
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const blocks = /\.cd-|\.countdown|\.paper|\.invite|\.info|\.sched|\.dateblock|\.venue-(sec|text|photo)|\.vignette|\.card(?!-seal)|\.frame|\.fan|\.v-/;
  let checked = 0;
  for (const [, sel, body] of rules) {
    if (!blocks.test(sel) || /:focus/.test(sel)) continue;
    checked++;
    assert.doesNotMatch(body, /(^|;|\s)(border(-[a-z]+)*|outline|box-shadow)\s*:/, `${sel.trim()}: a code-drawn frame`);
  }
  assert.ok(checked > 20, `${checked} content-block rules checked`);
  assert.ok(rules.some(([sel]) => /\.cd-/.test(sel)), 'countdown rules found');
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8');
    assert.doesNotMatch(raw, /<svg|<canvas/i, `${page}: no drawn shapes`);
  }
  assert.doesNotMatch(css, /conic-gradient|repeating-(linear|radial)-gradient/, 'no gradient-drawn pattern');
  // the only gradients are borderless light (body light, hero paper fade mask, the nav's soft ground — docs/11 §5.7)
  for (const [, sel, body] of rules) if (/gradient\(/.test(body)) assert.match(sel, /body::before|\.hero-bg|^\s*\.site-nav\s*$/, sel.trim());
  // the nav is no opaque slab with a hard edge across painted corners (G401 review): no border-top / backdrop slab on it
  const nav = rules.find(([, sel]) => /^\s*\.site-nav\s*$/.test(sel))![2];
  assert.doesNotMatch(nav, /border-top|backdrop-filter/, '.site-nav: no hard band');
});

// ---------------------------------------------------------------- G401 review: the card lands, the backdrop keeps its roses

test('G401 review: the envelope card morphs into a visible home card; replay has no floating card; opened state hides the hint', () => {
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = (sel: string) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, s]) => s.trim() === sel).map(([, , b]) => b).join(';');
  // arriving from the envelope the hero card is visible at the first frame (the scene entrance must not hide it)
  assert.match(rule('.from-envelope .hero-card[data-step]'), /opacity:\s*1/);
  assert.match(rule('.from-envelope .hero-card[data-step]'), /transition:\s*none/);
  assert.match(rule('.hero-card'), /view-transition-name:\s*invite-card/);
  // the envelope's card is named only when it may morph: opened, or go(true) in site.js
  assert.doesNotMatch(rule('.env .card'), /view-transition-name/);
  assert.match(css, /\.is-opened \.env \.card \{[^}]*view-transition-name: invite-card/);
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  assert.match(js, /if \(withCard\) \{ store\.set\(ARRIVE, '1'\); el\.card\.style\.viewTransitionName = 'invite-card'; \}/);
  // ?replay=1 starts closed already in the <head> script (the snapshot is taken before site.js runs)
  assert.match(readFileSync(path.join(DIR, 'index.html'), 'utf8'), /!\/\[\?&\]replay=1\(&\|\$\)\/\.test\(location\.search\)\)r\.classList\.add\('is-opened'\)/);
  // a running "breathe" animation would beat a plain opacity: 0 — the opened state removes the hint
  assert.match(rule('.is-opened .env-hint'), /display:\s*none/);
  // Skip leaves the state 'done' so a back/forward-cache return clears the fallback fade
  assert.match(js, /reset\(\); state = 'done'; go\(false\);/);
});

test('G401 review: phone backdrop from parts (both rose clusters whole), corners on index/home, card path keeps the card high', () => {
  for (const page of ['index', 'home'] as PageName[]) {
    const { $ } = render(page);
    const tl = $('.scene-bg img.corner-tl'), br = $('.scene-bg img.corner-br');
    assert.equal(tl.length, 1, `${page}: decor_tl layer`);
    assert.equal(br.length, 1, `${page}: decor_br layer`);
    for (const c of [tl, br]) {
      assert.equal(c.attr('loading'), undefined, `${page}: the corner is in the first view on phones (no lazy)`);
      assert.match(c.attr('sizes') ?? '', /min-aspect-ratio: 3\/4/, `${page}: sizes for phones and landscape`);
    }
    assert.equal($('.land-only').length, 0, `${page}: no landscape-only layer left`);
  }
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.match(css, /\.scene-bg \.scene-img \{ inset: auto; left: -135\.94vw; top: 0; width: 235\.94vw;/, 'phones: the flower-free sunlit crop of bg_page');
  const st = MANIFEST.stage;
  // out: the card's bottom corners clear the pocket edge before it comes forward; front: no drop back over the pocket
  assert.ok(st.card_path.out_translate_pct <= -86, `out ${st.card_path.out_translate_pct}`);
  assert.ok(st.card_path.front_translate_pct - st.card_path.out_translate_pct <= 4, 'forward settles at most 4 % lower');
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  assert.match(js, new RegExp(`front: 'translateY\\(${st.card_path.front_translate_pct}%\\) scale\\(${st.card_path.front_scale}\\)'`));
  assert.ok(css.includes(`.is-opened .env .card { transform: translateY(${st.card_path.front_translate_pct}%) scale(${st.card_path.front_scale});`));
  // the lace-edge flap cut is continuous (no tab of envelope body under the lace)
  const cont = st.cuts.cflap.continuity;
  assert.ok(cont.max_step_px <= 24, `flap edge step ${cont.max_step_px} px`);
  assert.ok(cont.replaced_columns <= 0.06 * (st.cuts.cflap.columns[1] - st.cuts.cflap.columns[0] + 1));
});

test('G401 review: home copy in this design\'s voice, the reply-by line once, every seal with its monogram, srcset on every part', () => {
  const home = render('home').$;
  assert.equal((home('body').text().match(/Kindly reply by/g) ?? []).length, 1, 'the deadline line once on home (invitation block)');
  assert.equal(home('.trio .vignette').length, 3, 'the fanned trio: story frame, day card, seal');
  assert.equal(home('.v-rsvp .seal-mono[data-field="initials"]').text(), 'A & J');
  assert.doesNotMatch(home('body').text(), /More about the day|Moments we hold dear|Read our story|Schedule & venue|Reply now|With love|Replay the envelope/i);
  const rsvp = render('rsvp').$;
  assert.notEqual(rsvp('.closing .line').text().trim(), rsvp('.rsvp-text .wait').text().trim().replace(/^./, (c) => c), 'closing ≠ card line');
  assert.doesNotMatch(rsvp('.closing').text(), /can't wait to celebrate/i);
  for (const page of PAGES) {
    const { $ } = render(page);
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      const m = /img\/([a-z_]+(?:_\d)?)-\d+\.webp$/.exec(src);
      if (!m || /^accent_/.test(m[1]) || $(el).attr('data-photo-state') === 'user') return;
      const files = (MANIFEST[m[1]]?.files ?? []).length;
      if (files < 2) return;
      assert.ok($(el).attr('srcset') && $(el).attr('sizes'), `${page}: ${src} has srcset + sizes (docs/11 §5.5)`);
    });
  }
  // details: the ceremony line no longer claims the first programme row is the ceremony's place
  const c = demo();
  c.schedule = [{ label: 'Welcome drinks', time: '15:00', location: 'The Bar' }, ...c.schedule];
  assert.equal(render('details', c).$('p[data-if="ceremony_time"]').text(), 'The ceremony begins at 4:00 PM.');
});

test('G401 review: the story keeps the hand of cards on phones (swipeable fan, window ≥ 38vw) and overlaps on wide screens', () => {
  const { $ } = render('story');
  assert.equal($('.fan[data-scene="story-fan"]').length, 1, 'one scene: the hand opens together');
  assert.deepEqual($('.fan .frame').map((_, el) => $(el).attr('data-step')).get(), ['side', 'mid', 'side']);
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  const cw = Number(/\.fan \{ --cw: min\((\d+)vw/.exec(css)![1]);
  assert.ok(cw * 0.78865 >= 38, `phone photo window ${(cw * 0.78865).toFixed(1)}vw ≥ 38vw (docs/11 §9)`);
  assert.match(css, /scroll-snap-type: x mandatory/);
  assert.match(css, /\.fc-1 \{ rotate: -8deg; margin-right: calc\(var\(--cw\) \* -\.06\); \}/, 'wide: side cards tucked under the middle one');
  assert.match(readFileSync(path.join(DIR, 'site.js'), 'utf8'), /function initFan\(\)/);
});

// ---------------------------------------------------------------- envelope: build geometry, layers, closure, motion

test('envelope (docs/11 §7.1/§7.3 kapak): layers from the build, the seal rides the flap in one wrapper, card path, opening sentence', () => {
  const st = MANIFEST.stage;
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure', 'card']) assert.equal(st.parts[k].length, 4, k);
  assert.ok(['renk', 'alfa'].includes(st.cuts.cflap.method), `flap cut found in the image (${st.cuts.cflap.method})`);
  assert.equal(st.cuts.pocket.method, 'renk');
  assert.ok(st.checks.open_layers_overlap_diff <= 0.01, 'cut layers recompose the open envelope');
  assert.equal(st.checks.cflap_outside_closed_px, 0);
  assert.ok(['tamam', 'uyari'].includes(MANIFEST.align.durum), `closed/open alignment ${MANIFEST.align.durum}`);
  assert.equal(MANIFEST.closure.measured_from, 'comps/web_1_envelope.png');
  assert.equal(MANIFEST.closure.carried_by_flap, true);
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  const pct = (n: number) => String(n).replace(/^0\./, '.');
  assert.ok(css.includes(`transform-origin: 50% ${pct(st.hinge_pct)}%`), 'hinge row from the manifest');
  for (const k of ['env_closed', 'env_cflap', 'env_flap', 'env_body', 'env_pocket', 'closure']) {
    const [, top, , h] = st.parts[k];
    assert.ok(css.includes(`top: ${pct(top)}%`) && css.includes(`height: ${pct(h)}%`), `${k}: stage percentages from the manifest`);
  }
  assert.ok(css.includes(`aspect-ratio: ${pct(st.ratio)}`), 'stage ratio from the manifest');
  const { $ } = render('index');
  const wrap = $('.stage .env-cflap-wrap');
  assert.equal(wrap.length, 1);
  assert.equal(wrap.children('.env-cflap').length, 1);
  assert.equal(wrap.find('.closure img[src*="img/closure-"]').length, 1, 'the closure (seal + sprig) is inside the flap wrapper');
  assert.deepEqual($('.stage .env').children().map((_, el) => ($(el).attr('class') ?? '').split(' ')[0]).get(),
    ['env-flap', 'env-body', 'card-slot', 'env-pocket', 'env-closed', 'env-cflap-wrap'], 'layer order bottom → top');
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  for (const k of ['hint', 'tug', 'closure', 'head', 'lift', 'open', 'flap', 'rise', 'forward', 'accents', 'go', 'fadeOut']) {
    assert.match(js, new RegExp(`\\n\\s+${k}:\\s+(\\[|\\d)`), `MOTION.envelope.${k}`);
  }
  assert.match(js, /A\(el\.wrap, \[/, 'one animation turns flap + seal together');
  assert.doesNotMatch(js, /A\(el\.cflap/, 'the flap is never animated apart from the seal');
  // "… while two olive leaves float across the screen": accent_1 × 2, path across
  assert.match(js, /open:\s+\[\{ file: 'img\/accent_1-200\.webp', count: 2, path: 'across'/);
  const go = Number(/go:\s+(\d+)/.exec(js)![1]);
  assert.ok(go >= 3200 && go <= 5000, `tap → home ${go} ms (docs/11 §6)`);
  assert.match(js, new RegExp(`out: 'translateY\\(${st.card_path.out_translate_pct}%\\)'`), 'card path from the manifest');
});

// ---------------------------------------------------------------- 13: site.js contract

test('13 site.js: reads #site-data, navigates with the page map, per-site session keys = <head> scripts, DEV_CONTENT = demo', () => {
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
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
  // DEV_CONTENT (static preview only) = content.demo.json
  const devSrc = /const DEV_CONTENT = (\{[\s\S]*?\n\});/.exec(js)![1];
  const dev = new Function(`return (${devSrc});`)();
  assert.deepEqual(dev, demo());
  // devRender's photo map = theme.json
  const map = new Function(`return (${/const PHOTO_SOURCES = (\{[^}]+\})/.exec(js)![1]});`)();
  assert.deepEqual(map, Object.fromEntries(Object.entries(theme.manifest.photos).map(([k, p]) => [k, p.source])));
  // view-transition names: one element each per page
  for (const page of ['index', 'home'] as PageName[]) {
    const n = (readFileSync(path.join(DIR, 'site.css'), 'utf8').match(/view-transition-name: invite-card/g) ?? []).length;
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
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo-oi', theme: ID, content: demo() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demo();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo-oi'), { params: Promise.resolve({ slug: 'maren-and-theo-oi' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  const $index = cheerio.load(await index.text());
  assert.match($index('meta[property="og:image"]').attr('content') ?? '', /^https?:\/\/[^/]+\/themes\/olive-ivory\/img\/og-1200x630\.jpg$/, 'absolute og:image');
  assert.equal($index('meta[property="og:image:alt"]').attr('content'), 'Avery & Jordan wedding invitation');
  assert.equal($index('link[rel="icon"]').attr('href'), `/themes/${ID}/img/favicon.png`);
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo-oi/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo-oi', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['img', 'env_cflap-880.webp'], ['img', 'closure-640.webp'], ['img', 'mask_portrait.png'], ['img', 'og-1200x630.jpg']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo-oi' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo-oi'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10, 'no theme guest cap → platform default');
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo-oi', {
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
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-olive-site', theme: ID, content: demo() });
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
  const story = await getPage(req('/quiet-olive-site/story'), { params: Promise.resolve({ slug: 'quiet-olive-site', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-olive-site'), { params: Promise.resolve({ slug: 'quiet-olive-site' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-olive-site/${page}`), { params: Promise.resolve({ slug: 'quiet-olive-site', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
});
