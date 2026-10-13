// The first real theme: platform/themes/blush-garden-rose (design 03, ported from G035 in task G038).
// Server-side rendering with the content record, photo slots, optional blocks, links, theme files and site.js contract.
// Browser checks (layout widths, opening flow, screenshots) live in scripts/theme-check.cjs.

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { ContentRecord } from '../lib/content/types.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { listThemes, loadTheme, type LoadedTheme, type PageName } from '../lib/theme/theme.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const ID = 'blush-garden-rose';
const DIR = path.join(PLATFORM_ROOT, 'themes', ID);
const PAGES: PageName[] = ['index', 'home', 'story', 'details', 'rsvp'];
const SLUG = 'clara-and-julian';
let theme: LoadedTheme;

before(async () => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('platform-bgr-data-');
  theme = (await loadTheme(ID))!;
});

function render(page: PageName, content: unknown = demoContent(), opts: { previewKey?: string } = {}) {
  const html = readFileSync(path.join(DIR, theme.manifest.pages[page]!), 'utf8');
  const result = renderTemplate({ html, content, theme: theme.manifest, page, slug: SLUG, ...opts });
  return { ...result, $: cheerio.load(result.html) };
}

// ---------------------------------------------------------------- independent en-US formatting (not the engine's code)
const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });
const fmtTime = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
function getPath(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
}
function expected(content: ContentRecord, field: string, format: string): string {
  const venue = content.venue as unknown as Record<string, string | null>;
  const derived: Record<string, string> = {
    'venue.city_region': [venue.city, venue.region].filter(Boolean).join(', '),
  };
  const v = field in derived ? derived[field] : getPath(content, field);
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    if (format === 'weekday') return fmtDate(s, { weekday: 'long' });
    if (format === 'month') return fmtDate(s, { month: 'long' });
    if (format === 'day') return String(Number(s.slice(8)));
    if (format === 'year') return s.slice(0, 4);
    return fmtDate(s);
  }
  if (/^\d{2}:\d{2}$/.test(s)) return fmtTime(s);
  return s;
}

/** Every text [data-field] equals the record; returns the number of checked fields. */
function assertFieldsMatch($: cheerio.CheerioAPI, content: ContentRecord, page: string): number {
  let n = 0;
  $('[data-field]').each((_, el) => {
    const field = $(el).attr('data-field')!;
    if (el.tagName === 'img' || field.startsWith('urls.')) return;
    const want = expected(content, field, $(el).attr('data-format') ?? '');
    assert.equal($(el).text(), want, `${page}: ${field}`);
    n++;
  });
  return n;
}

// ---------------------------------------------------------------- manifest + files

test('theme.json: public theme, five pages, photo slots with the window aspect ratios of the build', async () => {
  assert.ok(theme, 'theme loads');
  assert.equal(theme.manifest.name, 'Blush Garden Rose');
  assert.equal(theme.manifest.internal, undefined);
  assert.ok((await listThemes()).some((t) => t.id === ID), 'offered to buyers (not internal)');
  assert.deepEqual(Object.keys(theme.manifest.pages).sort(), [...PAGES].sort());
  const photos = theme.manifest.photos;
  assert.deepEqual(Object.keys(photos), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  assert.deepEqual(
    Object.values(photos).map((p) => p.source),
    ['media.hero_portrait', 'media.memory_photos.0', 'media.memory_photos.1', 'media.memory_photos.2', 'media.venue_image'],
  );
  const manifest = JSON.parse(readFileSync(path.join(DIR, 'img/manifest.json'), 'utf8'));
  const slotOf: Record<string, string> = { hero_portrait: 'card', story_1: 'arch', story_2: 'arch', story_3: 'arch', venue: 'landscape' };
  for (const [key, p] of Object.entries(photos)) {
    const [w, h] = manifest.photo_slots[slotOf[key]].box_px;
    assert.equal(p.aspect, `${w}/${h}`, `${key} aspect = window box`);
    assert.ok(existsSync(path.join(DIR, `img/ph_${key}-${key === 'venue' ? 480 : key === 'hero_portrait' ? 320 : 300}.webp`)), `${key} placeholder`);
  }
  // every slot used in the templates is declared, and every declared slot is used
  const used = new Set<string>();
  for (const page of PAGES) {
    cheerio.load(readFileSync(path.join(DIR, `${page}.html`), 'utf8'))('[data-photo]').each((_, el) => {
      used.add((el as unknown as { attribs: Record<string, string> }).attribs['data-photo']);
    });
  }
  assert.deepEqual([...used].sort(), Object.keys(photos).sort());
});

test('every theme file referenced by the pages and site.css exists (no broken image, no missing asset)', () => {
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
});

// ---------------------------------------------------------------- server-side content

test('all five pages render without engine warnings; every field equals the content record', () => {
  const content = demoContent();
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
    // no theme-relative link is left (they resolve wrongly under /<slug>/…)
    $('a[href]').each((_, el) => assert.match($(el).attr('href')!, /^(\/|#|https?:|mailto:|tel:)/, `${page}: ${$(el).attr('href')}`));
    $('link[rel="stylesheet"]').each((_, el) => assert.match($(el).attr('href')!, new RegExp(`^(https://fonts\\.googleapis\\.com/|/themes/${ID}/)`)));
  }
  assert.ok(fields > 50, `${fields} fields checked`);
  const index = render('index', content).$;
  assert.equal(index('title').text(), 'Clara & Julian · May 15, 2027');
  assert.equal(index('h1').text(), 'Clara & Julian');
  assert.equal(index('meta[property="og:description"]').attr('content'), "You're invited · Saturday, May 15, 2027 · Savannah, Georgia");
  assert.equal(index('a[data-enter]').attr('href'), `/${SLUG}/home`);
  assert.equal(index('a[data-skip]').attr('href'), `/${SLUG}/home`);
  assert.equal(render('story', content).$('title').text(), 'Our Story · Clara & Julian');
  const details = render('details', content).$;
  assert.equal(details('title').text(), 'The Day · Clara & Julian');
  assert.deepEqual(details('.sched-row .label').map((_, el) => details(el).text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.deepEqual(details('.sched-row .time').map((_, el) => details(el).text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  const home = render('home', content).$;
  assert.deepEqual(
    ['.side', '.mon', '.day', '.yr'].map((sel) => home(`.dateblock ${sel}`).first().text()).concat(home('.dateblock .side').last().text()),
    ['Saturday', 'May', '15', '2027', '4:00 PM'],
  );
  assert.equal(home('a[href="#invitation"]').length, 1, 'in-page anchor kept');
  assert.equal(home('a.replay').attr('href'), `/${SLUG}?replay=1`);
});

test('no personal text is hard-coded in the templates (the site record is the only source)', () => {
  const c = demoContent();
  const personal = [
    c.host_line, c.venue.name, c.venue.city, c.venue.region, c.dress_code, fmtDate(c.date), fmtDate(c.rsvp.deadline),
    ...c.partners.flatMap((p) => [p.display_name, p.full_name]), ...c.schedule.map((s) => s.location),
    ...(c.story?.items ?? []).map((i) => i.caption), c.story?.intro,
  ].filter((s): s is string => typeof s === 'string' && s.length > 2);
  for (const page of PAGES) {
    const raw = readFileSync(path.join(DIR, `${page}.html`), 'utf8').replace(/&amp;/g, '&');
    const hits = personal.filter((s) => raw.includes(s));
    assert.deepEqual(hits, [], `${page}.html contains personal text`);
  }
  // (site.css is not scanned for the region: "Georgia" is also a fallback font name there)
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.deepEqual(personal.filter((s) => s !== c.venue.region && css.includes(s)), []);
});

test('a content change shows on every page (names, date, venue, schedule rows, story, deadline)', () => {
  const c = demoContent();
  c.partners[0] = { display_name: 'Maren', full_name: 'Maren Holloway' };
  c.partners[1] = { display_name: 'Theo', full_name: 'Theo Castellan' };
  c.name_display = 'Maren & Theo';
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
    const text = $('body').text();
    assert.ok(!/Clara|Julian|Rosewater|Savannah/.test(text + $('title').text()), `${page}: old demo text left`);
  }
  const index = render('index', c).$;
  assert.equal(index('title').text(), 'Maren & Theo · September 23, 2028');
  assert.equal(index('.card-copy .kicker').last().text(), 'Bath', 'city without region: no stray comma');
  const details = render('details', c).$;
  assert.equal(details('.sched-row').length, 4);
  assert.deepEqual(details('.sched-row').map((_, el) => details(el).attr('data-repeat-item')).get(), ['schedule.0', 'schedule.1', 'schedule.2', 'schedule.3']);
  assert.equal(details('.sched-row').first().find('.loc').length, 0, 'row without a location has no empty location line');
  assert.equal(details('[data-field="venue.address"]').text(), '12 Orchard Lane');
  assert.equal(details('p[data-if="ceremony_time"]').text(), 'Ceremony at 3:30 PM', 'schedule.0 has no location → no " in …"');
  const home = render('home', c).$;
  assert.equal(home('[data-field="host_line"]').length, 0, 'empty host line removed');
  assert.equal(home('.teaser .sched-line').length, 4);
  assert.equal(home('.countdown').length, 1);
  const data = JSON.parse(home('#site-data').text());
  assert.equal(data.derived.countdown_target_utc, '2028-09-23T14:30:00.000Z', '15:30 BST');
  const story = render('story', c).$;
  assert.equal(story('.lede').text(), 'How a rainy afternoon became September 23, 2028.');
  assert.deepEqual(story('figcaption').map((_, el) => story(el).text()).get(), ['A shared umbrella', 'Paris', 'Yes!']);
});

// ---------------------------------------------------------------- photos, optional blocks, links

test('photo slots: buyer photo replaces the placeholder (srcset dropped, state "user"); missing photo keeps the placeholder', () => {
  const c = demoContent();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  const memories = ['https://storage.example.org/one.jpg', 'https://storage.example.org/two.jpg'];
  c.media.memory_photos = memories;
  for (const page of ['index', 'home', 'story', 'details'] as PageName[]) {
    const { $ } = render(page, c);
    $('[data-slot]').each((_, el) => {
      const slot = $(el);
      const key = slot.attr('data-slot')!;
      const img = slot.find('img[data-photo]');
      const want = ({ hero_portrait: c.media.hero_portrait, story_1: memories[0], story_2: memories[1] } as Record<string, unknown>)[key];
      if (want) {
        assert.equal(slot.attr('data-photo-state'), 'user', `${page}/${key}`);
        assert.equal(img.attr('src'), want);
        assert.equal(img.attr('srcset'), undefined);
      } else {
        assert.equal(slot.attr('data-photo-state'), 'placeholder', `${page}/${key}`);
        assert.match(img.attr('src')!, new RegExp(`^/themes/${ID}/img/ph_${key}-\\d+\\.webp$`));
        assert.equal(slot.find('.ph-mark').length, 1, 'placeholder label element present');
      }
    });
  }
  const unsafe = demoContent();
  unsafe.media.venue_image = 'javascript:alert(1)';
  const d = render('details', unsafe);
  assert.equal(d.$('[data-slot="venue"]').attr('data-photo-state'), 'placeholder');
  assert.ok(d.warnings.some((w) => w.includes('unsafe')));
});

test('optional blocks switch sections, the Story page and its links off', () => {
  const c = demoContent();
  Object.assign(c.optional_blocks, { our_story: false, countdown: false, dress_code: false, registry: false, travel_stay: false });
  assert.equal(render('story', c).disabled, true, 'story page → 404');
  for (const page of ['home', 'details', 'rsvp'] as PageName[]) {
    const { $ } = render(page, c);
    assert.equal($(`a[href="/${SLUG}/story"]`).length, 0, `${page}: no link to the switched-off story page`);
  }
  const home = render('home', c).$;
  assert.equal(home('.countdown').length, 0);
  assert.equal(home('.teaser').length, 2);
  const details = render('details', c).$;
  assert.equal(details('.dress').length, 0);
  assert.equal(details('.block').length, 1, 'only the venue block');
  const withLinks = demoContent();
  withLinks.record_kind = 'customer';
  withLinks.urls.registry = 'https://registry.example.org/maren';
  withLinks.urls.accommodation = 'https://hotel.example.org/block';
  const on = render('details', withLinks).$;
  assert.equal(on('.block').length, 3);
  assert.equal(on('.dress em').text(), 'Garden formal');
  // On but without a link: the block stays hidden (no button that only says "link will be added soon").
  assert.equal(render('details', demoContent()).$('.block').length, 1);
});

test('links: a missing URL removes its button (no dead buttons for guests); real URLs are set with rel', () => {
  const missing = render('details').$;
  for (const key of ['map', 'accommodation', 'registry']) assert.equal(missing(`a[data-field="urls.${key}"]`).length, 0, key);
  assert.equal(missing('a[data-url-missing]').length, 0);
  assert.doesNotMatch(missing('body').text(), /will be shared here/, 'no promise of travel tips the schema cannot hold');
  const c = demoContent();
  c.record_kind = 'customer';
  c.urls.map = 'https://maps.example.org/?q=larkspur';
  const set = render('details', c).$;
  const a = set('a[data-field="urls.map"]');
  assert.equal(a.attr('href'), 'https://maps.example.org/?q=larkspur');
  assert.equal(a.attr('rel'), 'noopener noreferrer');
  assert.equal(a.attr('data-url-missing'), undefined);
});

test('RSVP page follows the platform form contract (G042): fields by name, method post, state panels, form.js', () => {
  const { $, warnings } = render('rsvp');
  assert.deepEqual(warnings, []);
  const form = $('form[data-rsvp-form]');
  assert.equal(form.length, 1);
  assert.equal(form.attr('method'), 'post', 'without JS the data must not land in the URL');
  assert.equal(form.attr('action'), undefined);
  assert.equal(form.closest('[data-rsvp]').length, 1);
  for (const name of ['name', 'email', 'guests', 'message']) assert.equal(form.find(`[name="${name}"]`).length, 1, name);
  assert.deepEqual(form.find('input[name="attending"]').map((_, el) => $(el).attr('value')).get(), ['yes', 'no']);
  assert.equal(form.find('[name="website"]').length, 0, 'the honeypot name is reserved for the platform');
  assert.ok(form.find('[name="name"]').is('[required]'));
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
});

test('preview: every page link keeps ?preview=<key>; site-data pages map carries it too', () => {
  const key = 'pk_test_1234567890';
  for (const page of PAGES) {
    const { $ } = render(page, demoContent(), { previewKey: key });
    $(`a[href^="/${SLUG}"]`).each((_, el) => assert.match($(el).attr('href')!, /[?&]preview=pk_test_1234567890/, `${page}: ${$(el).attr('href')}`));
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.pages.home, `/${SLUG}/home?preview=${key}`);
  }
  assert.equal(render('home', demoContent(), { previewKey: key }).$('a.replay').attr('href'), `/${SLUG}?replay=1&preview=${key}`);
});

test('replies collected another way (rsvp.method "none"): no RSVP page, no reply call anywhere', () => {
  const c = demoContent();
  c.rsvp.method = 'none';
  assert.equal(render('rsvp', c).disabled, true, 'RSVP page → 404');
  for (const page of ['home', 'story', 'details'] as PageName[]) {
    const { $ } = render(page, c);
    assert.equal($(`a[href="/${SLUG}/rsvp"]`).length, 0, `${page}: no link to the RSVP page`);
    assert.doesNotMatch($('body').text(), /Kindly reply|Reply now|Reply by/, page);
  }
  const on = render('home').$;
  assert.ok(on(`a[href="/${SLUG}/rsvp"]`).length >= 3, 'with replies on: card, teaser and nav link to the RSVP page');
});

test('guests: placeholder label only in previews, photo alt text from the content, no template comments', () => {
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.match(css, /html\[data-preview="true"\] \.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark \{ display: flex; \}/);
  assert.doesNotMatch(css, /^\.photo-slot\[data-photo-state="placeholder"\] > \.ph-mark/m, 'no unscoped rule: guests never read "Your photo here"');
  assert.equal(render('home').$('html').attr('data-preview'), undefined, 'public page: label hidden');
  assert.equal(render('home', demoContent(), { previewKey: 'k'.repeat(20) }).$('html').attr('data-preview'), 'true');

  const c = demoContent();
  c.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.jpg';
  c.media.memory_photos = ['https://storage.example.org/one.jpg'];
  c.media.venue_image = 'https://storage.example.org/venue.jpg';
  const home = render('home', c).$;
  assert.equal(home('.hero-card img[data-photo="hero_portrait"]').attr('alt'), 'Photo of Clara & Julian');
  const story = render('story', c).$;
  assert.equal(story('img[data-photo="story_1"]').attr('alt'), 'First hello');
  assert.equal(story('img[data-photo="story_2"]').attr('alt'), '', 'placeholder image: decorative');
  assert.equal(render('details', c).$('img[data-photo="venue"]').attr('alt'), 'The Rosewater Conservatory');
  assert.equal(render('details').$('img[data-photo="venue"]').attr('alt'), '');
  // preview: platform photos carry the preview key (they are private until published)
  assert.equal(
    render('home', c, { previewKey: 'pk_test_1234567890' }).$('.hero-card img[data-photo="hero_portrait"]').attr('src'),
    `${c.media.hero_portrait}?preview=pk_test_1234567890`,
  );
  for (const page of PAGES) {
    const { html } = render(page, c);
    assert.ok(!html.includes('<!--'), `${page}: template comments (task ids, build notes) are not sent to guests`);
  }
});

// ---------------------------------------------------------------- G051: add to calendar, questions & answers, reply-form questions

function g051Content(): ContentRecord {
  const c = demoContent();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the venue?', a: 'Yes, free parking next to the conservatory.\nThe gate opens at 3:00 PM.' },
    { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only celebration.' },
  ];
  c.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] },
    { id: 'song', label: 'A song that gets you dancing', type: 'text' },
  ];
  return c;
}

test('G051 add to calendar: home and details carry the .ics link and a Google Calendar link (preview keeps its key)', () => {
  for (const page of ['home', 'details'] as PageName[]) {
    const { $, warnings } = render(page, g051Content());
    assert.deepEqual(warnings, [], page);
    assert.equal($('.cal a[data-calendar="ics"]').attr('href'), `/${SLUG}/event.ics`, page);
    const google = new URL($('.cal a[data-calendar="google"]').attr('href')!);
    assert.equal(google.hostname, 'calendar.google.com', page);
    assert.equal(google.searchParams.get('dates'), '20270515T200000Z/20270516T003000Z', `${page}: 4 PM EDT to two hours after the reception`);
    assert.equal($('.cal a[data-calendar="google"]').attr('rel'), 'noopener noreferrer');
    assert.equal($('.cal .kicker').text(), 'Add to your calendar');
  }
  const preview = render('details', g051Content(), { previewKey: 'pk_test_1234567890' }).$;
  assert.equal(preview('a[data-calendar="ics"]').attr('href'), `/${SLUG}/event.ics?preview=pk_test_1234567890`);
  const noDate = demoContent();
  noDate.date = '';
  assert.equal(render('home', noDate).$('a[data-calendar]').length, 0, 'no date yet: no calendar buttons');
  // the steps are timed in site.js (MOTION) like every other entrance
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  assert.match(js, /\['cta', 2800\], \['cal', 3050\]/);
  assert.match(js, /'details-faq':\s+\[\['title', 0\]/);
});

test('G051 questions & answers: a native accordion on the details page, in order, only while the block is on', () => {
  const c = g051Content();
  const { $, warnings } = render('details', c);
  assert.deepEqual(warnings, []);
  const items = $('.faq-sec details.faq-item');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((_, el) => $(el).find('summary .faq-q').text()).get(), ['Is there parking at the venue?', 'Can we bring our children?']);
  assert.equal(items.first().find('.faq-a').text(), c.faq![0].a, 'answer text kept (line breaks shown by CSS pre-line)');
  assert.deepEqual(items.map((_, el) => $(el).attr('data-repeat-item')).get(), ['faq.0', 'faq.1']);
  assert.equal(items.filter('[open]').length, 0, 'closed until a guest opens one');
  assert.equal($('.faq-sec h2').attr('id'), 'faq-title');
  assert.equal($('.faq-sec').attr('aria-labelledby'), 'faq-title');
  // reordered in the panel → reordered on the page
  const swapped = g051Content();
  swapped.faq!.reverse();
  assert.equal(render('details', swapped).$('.faq-q').first().text(), 'Can we bring our children?');
  // off, or on without questions: nothing in the page source
  const off = g051Content();
  off.optional_blocks.faq = false;
  off.faq = [{ q: 'PRIVATE-QUESTION', a: 'PRIVATE-ANSWER' }];
  const offHtml = render('details', off).html;
  assert.ok(!offHtml.includes('PRIVATE-'), 'switched-off Q&A is not in the source');
  assert.equal(cheerio.load(offHtml)('.faq-sec').length, 0);
  const empty = g051Content();
  empty.faq = [];
  assert.equal(render('details', empty).$('.faq-sec').length, 0);
  const css = readFileSync(path.join(DIR, 'site.css'), 'utf8');
  assert.match(css, /\.faq-a \{[^}]*white-space: pre-line/);
  assert.match(css, /\.faq-item summary::-webkit-details-marker \{ display: none; \}/);
});

test('G051 reply-form questions: one fieldset per question for guests who accept, choices as radios, text as a box, error slots', () => {
  const c = g051Content();
  const { $, warnings } = render('rsvp', c);
  assert.deepEqual(warnings, []);
  const form = $('form[data-rsvp-form]');
  const box = form.find('.questions');
  assert.equal(box.length, 1);
  assert.equal(box.attr('data-rsvp-if-attending'), '', 'asked of guests who accept (hidden and not sent for a "no")');
  const sets = box.find('fieldset[data-rsvp-question]');
  assert.deepEqual(sets.map((_, el) => $(el).attr('data-rsvp-question')).get(), ['meal', 'song']);
  const meal = sets.eq(0);
  assert.equal(meal.find('legend').text(), 'Meal choice');
  assert.deepEqual(meal.find('input[type="radio"]').map((_, el) => $(el).attr('value')).get(), ['Chicken', 'Fish', 'Vegetarian']);
  assert.deepEqual(meal.find('label span').map((_, el) => $(el).text()).get(), ['Chicken', 'Fish', 'Vegetarian']);
  assert.equal(meal.find('textarea').length, 0);
  assert.equal(meal.find('[data-rsvp-error-for]').attr('data-rsvp-error-for'), 'answer:meal');
  const song = sets.eq(1);
  assert.equal(song.find('input').length, 0);
  assert.equal(song.find('textarea').attr('maxlength'), '300');
  assert.equal(song.find('textarea').attr('aria-label'), 'A song that gets you dancing');
  assert.equal(song.find('[data-rsvp-error-for]').attr('data-rsvp-error-for'), 'answer:song');
  // names are given by /rsvp/form.js ("answer:<id>"); the template never invents one (and never "website")
  assert.equal(box.find('[name]').length, 0);
  // no questions: no block at all
  assert.equal(render('rsvp').$('.questions').length, 0);
  // question text is text, never markup
  const sneaky = g051Content();
  sneaky.rsvp.questions![0].label = '<img src=x onerror=alert(1)>';
  sneaky.rsvp.questions![0].options = ['<b>Fish</b>', 'Beef'];
  const s = render('rsvp', sneaky);
  assert.equal(s.$('fieldset[data-rsvp-question="meal"] img').length, 0);
  assert.equal(s.$('fieldset[data-rsvp-question="meal"] b').length, 0);
  assert.equal(s.$('fieldset[data-rsvp-question="meal"] input').first().attr('value'), '<b>Fish</b>');
});

// ---------------------------------------------------------------- site.js contract (G037 integration notes)

test('site.js reads #site-data, navigates with the page map and never hard-codes a page URL', () => {
  const js = readFileSync(path.join(DIR, 'site.js'), 'utf8');
  assert.match(js, /getElementById\('site-data'\)/);
  assert.match(js, /location\.href = PAGES\.home/);
  assert.match(js, /l\.href = PAGES\.home/, 'prefetch uses the page map');
  assert.doesNotMatch(js, /location\.href\s*=\s*['"]/, 'no literal navigation target');
  assert.doesNotMatch(js, /has-photo/, 'photo state comes from data-photo-state');
  assert.match(js, /a\[data-url-missing\]/);
  assert.match(js, /countdown_target_utc/);
  // the only page-file names left are the dev fallback page map (used only without #site-data)
  const literals = js.match(/'[a-z]+\.html'/g) ?? [];
  assert.deepEqual(literals, ["'index.html'", "'home.html'", "'story.html'", "'details.html'", "'rsvp.html'"]);
  assert.match(js, /const PAGES = \(SITE && SITE\.pages\) \|\|/);
  // speculation rules point at the server-rewritten "Enter" link, not at a URL
  const index = readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const rules = cheerio.load(index)('script[type="speculationrules"]').text();
  assert.doesNotMatch(rules, /\.html|"urls"/);
  assert.match(rules, /"selector_matches":"a\[data-enter\]"/);
  // session keys are per site (several sites share one origin)
  assert.match(index, /'invite:opened'\+k/);
  assert.match(readFileSync(path.join(DIR, 'home.html'), 'utf8'), /'invite:arrive'\+k/);
});

// ---------------------------------------------------------------- through the real routes

test('routes: a published site on this theme serves 200 pages with CSP hashes and the uploaded photo', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getAsset } = await import('../app/themes/[theme]/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'maren-and-theo', theme: ID, content: demoContent() });
  const saved = await adapter.savePhoto(created.site.id, { bytes: tinyPng() });
  const c = demoContent();
  c.media.venue_image = saved.url;
  await adapter.updateContent(created.site.id, c);
  await publishSite(adapter, created.site.id);
  const req = (p: string) => new Request(`http://localhost:3000${p}`);
  const index = await getIndex(req('/maren-and-theo'), { params: Promise.resolve({ slug: 'maren-and-theo' }) });
  assert.equal(index.status, 200);
  const scriptSrc = index.headers.get('content-security-policy')!.split('; ').find((d) => d.startsWith('script-src'))!;
  assert.equal(scriptSrc.match(/'sha256-/g)?.length, 2, 'inline state script + speculation rules');
  for (const page of ['home', 'story', 'details', 'rsvp']) {
    const res = await getPage(req(`/maren-and-theo/${page}`), { params: Promise.resolve({ slug: 'maren-and-theo', page }) });
    assert.equal(res.status, 200, page);
    if (page === 'details') {
      const $ = cheerio.load(await res.text());
      assert.equal($('img[data-photo="venue"]').attr('src'), saved.url);
      assert.equal($('[data-slot="venue"]').attr('data-photo-state'), 'user');
    }
  }
  for (const p of [['site.js'], ['site.css'], ['img', 'env_cflap-880.webp'], ['img', 'mask_landscape.png']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 200, p.join('/'));
  }
  // a guest reply through the RSVP API is stored for this site (theme without its own guest cap → platform default)
  const { GET: rsvpStatus, POST: rsvpPost } = await import('../app/api/rsvp/[slug]/route.ts');
  const rctx = { params: Promise.resolve({ slug: 'maren-and-theo' }) };
  const status = await (await rsvpStatus(req('/api/rsvp/maren-and-theo'), rctx)).json();
  assert.equal(status.open, true);
  assert.equal(status.maxGuests, 10);
  const posted = await rsvpPost(new Request('http://localhost:3000/api/rsvp/maren-and-theo', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.7' },
    body: JSON.stringify({ name: 'Ada Fictional', email: '', attending: 'yes', guests: '2', message: 'See you there', website: '' }),
  }), rctx);
  assert.equal(posted.status, 200);
  const replies = await adapter.listRsvps(created.site.id);
  assert.deepEqual(replies.map((r) => [r.name, r.attending, r.guests]), [['Ada Fictional', true, 2]]);
  for (const p of [['index.html'], ['theme.json'], ['build_images.py'], ['img', 'manifest.json']]) {
    const res = await getAsset(req(`/themes/${ID}/${p.join('/')}`), { params: Promise.resolve({ theme: ID, path: p }) });
    assert.equal(res.status, 404, `${p.join('/')} must not be served`);
  }
});

test('privacy: sections the couple switched off leave nothing in any page source (site-data included)', async () => {
  const { getDataAdapter } = await import('../lib/data/index.ts');
  const { createSiteWithKeys, publishSite } = await import('../lib/sites.ts');
  const { GET: getIndex } = await import('../app/[slug]/route.ts');
  const { GET: getPage } = await import('../app/[slug]/[page]/route.ts');
  const { GET: getMedia } = await import('../app/media/[...path]/route.ts');
  const adapter = getDataAdapter();
  const created = await createSiteWithKeys(adapter, { slug: 'quiet-and-private', theme: ID, content: demoContent() });
  const photos = await Promise.all([1, 2, 3].map(() => adapter.savePhoto(created.site.id, { bytes: tinyPng() })));
  const c = demoContent();
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
  const story = await getPage(req('/quiet-and-private/story'), { params: Promise.resolve({ slug: 'quiet-and-private', page: 'story' }) });
  assert.equal(story.status, 404);
  const secrets = ['PRIVATE-', ...photos.map((p) => p.path)];
  const pages: Array<[string, Response]> = [['index', await getIndex(req('/quiet-and-private'), { params: Promise.resolve({ slug: 'quiet-and-private' }) })]];
  for (const page of ['home', 'details', 'rsvp']) {
    pages.push([page, await getPage(req(`/quiet-and-private/${page}`), { params: Promise.resolve({ slug: 'quiet-and-private', page }) })]);
  }
  for (const [page, res] of pages) {
    assert.equal(res.status, 200, page);
    const html = await res.text();
    for (const secret of secrets) assert.ok(!html.includes(secret), `${page}: "${secret}" is in the page source`);
  }
  // the story photos themselves are not served while the story is off (only with the couple's preview key)
  for (const p of photos) {
    const res = await getMedia(req(p.url), { params: Promise.resolve({ path: p.path.split('/') }) });
    assert.equal(res.status, 404, p.path);
    const own = await getMedia(req(`${p.url}?preview=${created.previewKey}`), { params: Promise.resolve({ path: p.path.split('/') }) });
    assert.equal(own.status, 200);
  }
});
