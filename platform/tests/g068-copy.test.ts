// G068 (K28): almost every text of a design changes from the panel — the engine (data-copy, data-copy-attr, {copy.<key>}:
// escaped, one line, at most the key's max, empty = the design's text), the schema (TS + Python parity), the theme.json
// "copy" manifest of 01 olive-ivory and 03 blush-garden-rose (G081: also 02 dusty-blue-champagne, 05 mediterranean-lemon)
// (= their templates, every visible fixed text marked, standard keys or a design key with its own label), the theme-dependent checks (too long blocks publishing, a new unknown key is refused when saving), the panel
// API (a copy edit never uses a name/date change), the guest pages after publishing (both themes, thank-you mode too) and
// the panel helpers (Unpublished changes by page, Review's "Headings & labels", suggestions, reset). The browser journey
// and previews: tests/g068-browser.ts.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as pageRoute } from '../app/[slug]/[page]/route.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { schemaIssues, validateContent } from '../lib/content/validate.ts';
import { CONTENT_SCHEMA } from '../lib/content/schema.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { prepareDraft } from '../lib/panel/draft.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import {
  applyCopyPreset,
  COPY_MAX_CEILING,
  COPY_MAX_KEYS,
  COPY_PRESETS,
  copyIssues,
  copyPanelPage,
  copyText,
  currentPreset,
  panelCopyEntries,
  parseCopyManifest,
  resolveCopy,
  STANDARD_COPY,
  stressCopy,
  stressText,
  unknownNewCopyKeys,
  withCopy,
  type CopyManifest,
} from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy, unmarkedText } from '../lib/theme/copy-scan.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { clearThemeCache, loadTheme, parseManifest, readThemePage, PAGE_NAMES, type PageName } from '../lib/theme/theme.ts';
import { changedCopyPages, changedPages, COPY_TITLE } from '../components/panel/pages.ts';
import { PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const THEMES = ['olive-ivory', 'blush-garden-rose', 'dusty-blue-champagne', 'mediterranean-lemon'] as const;
type Theme = (typeof THEMES)[number];
const COLLECTION: Record<Theme, string> = {
  'olive-ivory': '01_Olive_Ivory',
  'blush-garden-rose': '03_Blush_Garden_Rose',
  'dusty-blue-champagne': '02_Dusty_Blue',
  'mediterranean-lemon': '05_Lemon_Mediterranean',
};
/** Design keys outside the catalogue (docs/11 §3.7: theme.json gives them a label and a panel page). */
const DESIGN_KEYS: Record<Theme, string[]> = {
  'olive-ivory': [],
  'blush-garden-rose': [],
  'dusty-blue-champagne': ['home_day_sub'],
  'mediterranean-lemon': [],
};
const record = (theme: Theme = 'olive-ivory'): ContentRecord =>
  JSON.parse(readFileSync(path.join(REPO_ROOT, 'collections', COLLECTION[theme], 'content.demo.json'), 'utf8')) as ContentRecord;

before(() => {
  const themes = tmpDir('g068-themes-');
  for (const t of ['_sample', ...THEMES]) cpSync(path.join(PLATFORM_ROOT, 'themes', t), path.join(themes, t), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g068-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  clearThemeCache();
});

const MINI: CopyManifest = {
  envelope_kicker: { default: 'You are invited', max: 20, pages: ['index'] },
  travel_title: { default: 'Travel & Stay', max: 30, pages: ['index'] },
  envelope_open: { default: 'Open the invitation', max: 30, pages: ['index'] },
  share_invited: { default: "You're invited", max: 40, pages: ['index'] },
  form_party: { default: 'Name of guest', max: 24, pages: ['index'] },
  view_map: { default: 'View map', max: 24, pages: ['index'] },
};
const MINI_HTML = `<!doctype html><html lang="en"><head><title data-text="{copy.share_invited} · {name_display}">x</title>
<meta name="description" data-attr-content="{copy.share_invited} · {date}" content="x"></head><body>
<p class="kicker" data-copy="envelope_kicker">You are invited</p>
<h2 class="script" data-copy="travel_title">Travel <span class="amp">&amp;</span> Stay</h2>
<div class="stage" role="button" aria-label="Open the invitation" data-copy-attr="aria-label:envelope_open"></div>
<a class="btn" href="#" data-field="urls.map" data-copy="view_map">View map</a>
<form><template data-rsvp-party><label><span data-copy="form_party">Name of guest</span></label></template></form>
</body></html>`;
const render = (content: unknown, manifest: CopyManifest = MINI, html = MINI_HTML) =>
  renderTemplate({ html, content, theme: { id: 'mini', pages: { index: 'index.html' }, photos: {}, copy: manifest }, page: 'index', slug: 'clara-and-julian' });

// ---------------------------------------------------------------------------------------------- engine

test('engine: data-copy keeps the design text when empty; the couple\'s text is escaped, one line, limited to max', () => {
  const plain = render(record());
  assert.deepEqual(plain.warnings, []);
  let $ = cheerio.load(plain.html);
  assert.equal($('[data-copy="envelope_kicker"]').text(), 'You are invited');
  assert.equal($('title').text(), "You're invited · Avery & Jordan", '{copy.<key>} = the design text');
  assert.equal($('[data-copy="travel_title"] .amp').length, 1, 'the template markup stays as written');

  const c = record();
  c.copy = {
    envelope_kicker: '  <b>Join\nus</b> \u0007 tonight under the stars  ',
    travel_title: 'Rooms & Rides',
    envelope_open: 'Tap to open our card',
    share_invited: '',
    form_party: 'Guest',
    view_map: 'Directions',
  };
  const out = render(c);
  assert.deepEqual(out.warnings, []);
  $ = cheerio.load(out.html);
  const kicker = $('[data-copy="envelope_kicker"]');
  assert.equal(kicker.text(), '<b>Join us</b> tonig', 'one line, no control characters, cut at max 20 (the panel stops typing there)');
  assert.equal(kicker.children().length, 0, 'never markup');
  assert.match(out.html, /&lt;b&gt;Join us&lt;\/b&gt;/);
  assert.equal($('[data-copy="travel_title"]').text(), 'Rooms & Rides');
  assert.equal($('[data-copy="travel_title"] .amp').length, 1, 'a heading with the script "&" keeps its .amp styling');
  assert.equal($('.stage').attr('aria-label'), 'Tap to open our card', 'data-copy-attr');
  assert.equal($('title').text(), "You're invited · Avery & Jordan", 'empty = the design text');
  assert.equal($('[data-copy="form_party"]').text(), 'Guest', 'inside a <template> too (the RSVP guest row)');
  const map = $('[data-copy="view_map"]');
  assert.equal(map.text(), 'Directions', 'a urls.* link keeps its href rule and takes the couple\'s words');
  assert.equal(map.attr('href'), '#');
  assert.equal(map.attr('data-url-missing'), '');
});

test('engine: unknown keys are ignored (content) or warned about (template); a theme without a manifest keeps its texts', () => {
  const c = record();
  c.copy = { not_in_design: 'Hello', envelope_kicker: null };
  const out = render(c);
  assert.deepEqual(out.warnings, []);
  assert.doesNotMatch(out.html, /Hello/);
  const extra = render(c, MINI, MINI_HTML.replace('</body>', '<p data-copy="ghost_key">Ghost</p></body>'));
  assert.ok(extra.warnings.some((w) => /ghost_key/.test(w)));
  // a theme without "copy" (02/04/05 today): data-copy elements keep their text, {copy.x} is empty, no warnings
  const none = renderTemplate({ html: MINI_HTML, content: { ...record(), copy: { envelope_kicker: 'Hi' } }, theme: { id: 'mini', pages: { index: 'index.html' }, photos: {} }, page: 'index', slug: 's' });
  assert.deepEqual(none.warnings, []);
  assert.equal(cheerio.load(none.html)('[data-copy="envelope_kicker"]').text(), 'You are invited');
  // content cannot create copy markers through data-attr-data-*
  const sneaky = renderTemplate({ html: '<html><body><p data-attr-data-copy="name_display">x</p></body></html>', content: record(), theme: { id: 'mini', pages: { index: 'index.html' }, photos: {}, copy: MINI }, page: 'index', slug: 's' });
  assert.ok(sneaky.warnings.some((w) => /data-attr-data-copy is not allowed/.test(w)));
});

test('copy values: copyText, resolveCopy, withCopy, stress texts', () => {
  assert.equal(copyText(' a‮ b\n'), 'a b');
  assert.equal(copyText(42), '');
  assert.equal(copyText('x'.repeat(500)), 'x'.repeat(COPY_MAX_CEILING));
  assert.equal(copyText('Celebrate tonight', 10), 'Celebrate');
  const resolved = resolveCopy({ copy: { envelope_kicker: 'Hello there', view_map: '   ' } }, MINI);
  assert.equal(resolved.envelope_kicker, 'Hello there');
  assert.equal(resolved.view_map, 'View map');
  const c = record();
  const set = withCopy(c, 'view_map', 'Directions');
  assert.deepEqual(set.copy, { view_map: 'Directions' });
  assert.equal(withCopy(set, 'view_map', null).copy, undefined, 'reset removes the key (and an empty copy object)');
  assert.equal(withCopy(set, 'view_map', 'View map', MINI.view_map).copy, undefined, 'typing the design text = reset');
  for (const n of [1, 2, 9, 10, 24, 60, 200]) assert.equal([...stressText(n)].length, n);
  const stress = stressCopy(MINI);
  for (const [k, e] of Object.entries(MINI)) assert.equal([...stress[k]].length, e.max);
});

// ---------------------------------------------------------------------------------------------- schema

test('schema: content.copy — key pattern, string or null, ≤ 300, ≤ 200 keys; the panel refuses a broken shape', () => {
  const ok = record();
  ok.copy = { envelope_kicker: 'Hi', rsvp_title: null };
  assert.equal(validateContent(ok).ok, true);
  const issues = (copy: unknown) => schemaIssues({ ...record(), copy }).map((i) => `${i.code} ${i.path}`);
  assert.deepEqual(issues({ 'Bad-Key': 'x' }), ['schema_unknown_field copy.Bad-Key']);
  assert.deepEqual(issues({ a: 3 }), ['schema_type copy.a']);
  assert.deepEqual(issues({ a: 'x'.repeat(301) }), ['schema_max_length copy.a']);
  assert.deepEqual(issues(Object.fromEntries(Array.from({ length: COPY_MAX_KEYS + 1 }, (_, i) => [`k${i}`, 'x']))), ['schema_max_properties copy']);
  assert.deepEqual(issues([]), ['schema_type copy']);
  // the schema ceiling and lib/theme/copy.ts agree
  const schemaCopy = (CONTENT_SCHEMA.properties as any).copy;
  assert.equal(schemaCopy.additionalProperties.maxLength, COPY_MAX_CEILING);
  assert.equal(schemaCopy.maxProperties, COPY_MAX_KEYS);
  // a draft with a broken copy is refused (structural); a too-long value is saved (an error that blocks publishing)
  assert.throws(() => prepareDraft(record(), { ...record(), copy: { a: 3 } }));
  assert.throws(() => prepareDraft(record(), { ...record(), copy: Object.fromEntries(Array.from({ length: 201 }, (_, i) => [`k${i}`, 'x'])) }));
  assert.doesNotThrow(() => prepareDraft(record(), { ...record(), copy: { a: 'x'.repeat(301) } }));
});

test('schema: Python (tools/validate_content.py, jsonschema) passes and fails the same copy records', (t) => {
  if (spawnSync('python3', ['-c', 'import jsonschema'], { stdio: 'ignore' }).status !== 0) return t.skip('python3 + jsonschema not available');
  const dir = tmpDir('g068-py-');
  const cases: Array<[string, unknown, boolean]> = [
    ['ok', { envelope_kicker: 'You’re invited to our vow renewal', rsvp_title: null }, true],
    ['bad-key', { 'Bad-Key': 'x' }, false],
    ['number', { a: 3 }, false],
    ['long', { a: 'é'.repeat(301) }, false],
    ['edge', { a: '😀'.repeat(300) }, true],
  ];
  for (const [name, copy, valid] of cases) {
    const c = { ...record(), copy };
    const file = path.join(dir, `${name}.json`);
    writeFileSync(file, JSON.stringify(c));
    const ts = validateContent(c).ok;
    let py = true;
    try {
      execFileSync('python3', [path.join(REPO_ROOT, 'tools/validate_content.py'), file], { stdio: 'pipe' });
    } catch {
      py = false;
    }
    assert.equal(ts, valid, `TS ${name}`);
    assert.equal(py, valid, `Python ${name}`);
  }
});

// ---------------------------------------------------------------------------------------------- manifest

test('theme.json copy: parse rules (key, default, max, pages, label for a non-standard key)', () => {
  assert.deepEqual(parseCopyManifest(undefined), { manifest: {}, problems: [] });
  const bad = parseCopyManifest({
    'Bad': { default: 'x', max: 5, pages: ['index'] },
    a_long: { default: 'longer than max', max: 3, pages: ['index'], label: 'A' },
    no_pages: { default: 'x', max: 5, pages: [], label: 'B' },
    custom: { default: 'x', max: 5, pages: ['home'] },
    envelope_kicker: { default: '', max: 0, pages: ['nowhere'] },
  });
  assert.equal(bad.problems.length, 7, bad.problems.join(' | '));
  assert.ok(bad.problems.some((p) => /custom is not a standard key/.test(p)));
  assert.throws(() => parseManifest({ id: 'x', name: 'X', pages: { index: 'index.html' }, copy: { envelope_kicker: { default: 'x', max: 400, pages: ['index'] } } }, 'x'), /copy\.envelope_kicker\.max/);
  const ok = parseManifest({ id: 'x', name: 'X', pages: { index: 'index.html' }, copy: { custom: { default: 'Hi', max: 9, pages: ['index'], label: 'Greeting', panel: 'us' } } }, 'x');
  assert.deepEqual(ok.copy, { custom: { default: 'Hi', max: 9, pages: ['index'], label: 'Greeting', panel: 'us' } });
});

test('01, 02, 03, 05: theme.json copy = the templates; no unmarked visible text; standard keys; most-changed keys present', async () => {
  for (const id of THEMES) {
    const theme = (await loadTheme(id))!;
    const pages: Partial<Record<PageName, string>> = {};
    for (const p of PAGE_NAMES) pages[p] = (await readThemePage(theme, p)) ?? undefined;
    const scan = scanCopy(pages);
    assert.deepEqual(manifestProblems(theme.manifest.copy, scan), [], `${id}: run node scripts/copy-manifest.ts --theme ${id}`);
    assert.deepEqual(scan.unmarked, [], `${id}: visible fixed text without data-copy (docs/11 §3.7)`);
    assert.deepEqual(buildCopyManifest(scan, theme.manifest.copy), theme.manifest.copy, `${id}: the generator writes what is stored`);
    const keys = Object.keys(theme.manifest.copy);
    assert.ok(keys.length >= 70, `${id}: ${keys.length} keys`);
    assert.deepEqual(keys.filter((k) => !STANDARD_COPY[k]), DESIGN_KEYS[id], `${id}: standard keys (+ its design keys)`);
    for (const k of DESIGN_KEYS[id]) assert.ok(theme.manifest.copy[k].label && theme.manifest.copy[k].panel, `${id}: ${k} has a label and a panel page`);
    for (const k of ['envelope_kicker', 'card_line', 'invite_request', 'rsvp_title', 'rsvp_by', 'story_title', 'day_title', 'schedule_title', 'nav_home', 'nav_rsvp', 'form_send', 'rsvp_closed_title', 'ty_kicker'])
      assert.ok(theme.manifest.copy[k], `${id}: ${k}`);
    // every default fits its max; every max is within the schema ceiling
    for (const [k, e] of Object.entries(theme.manifest.copy)) assert.ok([...e.default].length <= e.max && e.max <= COPY_MAX_CEILING, `${id}: ${k}`);
  }
});

test('unmarkedText: finds text outside the markers, skips the allow list (photo label, platform messages, fixed) and signs', () => {
  const html = `<html><head><title>T</title><script>var x = 'Hello'</script></head><body>
    <p>Hello <b>world</b></p><p data-field="a">x</p><span class="ph-mark"><span>Your photo here</span></span>
    <a data-field="urls.map">View map</a><a data-field="urls.map" data-copy="view_map">View map</a><p>· → 12 / 3 &amp;</p>
    <template><label>Name of guest</label></template><p aria-hidden="true">Tap to open</p>
    <p data-rsvp-message>We could not send it.</p><p data-copy-fixed>Turn on JavaScript.</p></body></html>`;
  assert.deepEqual(unmarkedText('t', html).map((u) => u.text), ['Hello', 'world', 'View map', 'Name of guest', 'Tap to open']);
});

test('copyIssues / unknownNewCopyKeys: too long = error, unknown = warning; only new unknown keys are refused', () => {
  const c = { copy: { envelope_kicker: 'x'.repeat(21), ghost: 'x', view_map: 'ok' } };
  const issues = copyIssues(c, MINI);
  assert.deepEqual(
    issues.map((i) => `${i.level} ${i.code} ${i.path}`),
    ['error copy_too_long copy.envelope_kicker', 'warning copy_unknown_key copy.ghost'],
  );
  assert.match(issues[0].message, /is 21 characters\. Please shorten it to 20\./);
  assert.deepEqual(unknownNewCopyKeys({ copy: { ghost: 'old' } }, { copy: { ghost: 'x', other: 'y', view_map: 'z' } }, MINI), ['other']);
});

// ---------------------------------------------------------------------------------------------- panel API + guest pages

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: { method?: string; key?: string; json?: unknown } = {}) {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.68' });
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  let body: string | undefined;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve(params) });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* html */
  }
  return { status: res.status, data, text };
}

let n = 0;
async function site(theme: Theme) {
  const c = record(theme);
  const slug = `g068-${theme}-${++n}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme, content: c });
  return { id: s.site.id, slug, editKey: s.editKey };
}

test('panel API: copy edits save, count as unpublished changes, never use a name/date change; limits and unknown keys', async () => {
  const k = await site('olive-ivory');
  const first = await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: {} });
  assert.equal(first.status, 200, JSON.stringify(first.data));
  const state = (await call(stateRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { key: k.editKey })).data.state;
  assert.equal(state.rights.used, 0);
  // the panel gets the design's texts: by page, the most-changed first, "after the wedding" last
  const us = state.theme.copy.filter((e: any) => e.panel === 'us');
  assert.equal(us[0].key, 'envelope_kicker');
  assert.equal(us[0].default, 'You are invited');
  assert.ok(us[0].top);
  const day = state.theme.copy.filter((e: any) => e.panel === 'day');
  assert.ok(day.findIndex((e: any) => e.after) > day.findIndex((e: any) => !e.after));
  assert.ok(day.slice(day.findIndex((e: any) => e.after)).every((e: any) => e.after));

  const put = (content: unknown, base: string) => call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content, baseUpdatedAt: base } });
  const draft: ContentRecord = structuredClone(state.content);
  draft.copy = { envelope_kicker: 'Come celebrate with us', rsvp_title: 'Can you make it?', nav_home: 'Start' };
  const saved = await put(draft, state.updatedAt);
  assert.equal(saved.status, 200, JSON.stringify(saved.data));
  assert.equal(saved.data.hasUnpublishedChanges, true);
  assert.equal(saved.data.rights.used, 0, 'design texts are not names or the date');
  assert.equal(saved.data.identityKept, undefined);
  assert.equal(saved.data.validation.ok, true);

  // a key the design does not have: refused (400); one a stored draft already holds (an older design version): kept
  const unknown = await put({ ...draft, copy: { ...draft.copy, ghost_key: 'Boo' } }, saved.data.updatedAt);
  assert.equal(unknown.status, 400);
  assert.equal(unknown.data.code, 'invalid_shape');
  assert.equal(unknown.data.issues[0].path, 'copy.ghost_key');

  // longer than the design carries: saved while typing, an error, publishing refused
  const max = state.theme.copy.find((e: any) => e.key === 'rsvp_title').max;
  const long = await put({ ...draft, copy: { ...draft.copy, rsvp_title: 'y'.repeat(max + 1) } }, saved.data.updatedAt);
  assert.equal(long.status, 200);
  assert.ok(long.data.validation.errors.some((e: any) => e.path === 'copy.rsvp_title' && e.code === 'copy_too_long'));
  const refused = await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: {} });
  assert.equal(refused.status, 422);
  assert.ok(refused.data.issues.some((e: any) => e.path === 'copy.rsvp_title'));

  const back = await put(draft, long.data.updatedAt);
  assert.equal(back.status, 200);
  const pub = await call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: {} });
  assert.equal(pub.status, 200);
  assert.equal(pub.data.rights.used, 0, 'publishing design texts uses no change either');

  // guests see the couple's words; the design text is gone where it was replaced, the others stay
  const index = cheerio.load((await call(siteRoute, `/${k.slug}`, { slug: k.slug })).text);
  assert.equal(index('.env-head .kicker').first().text(), 'Come celebrate with us');
  const home = cheerio.load((await call(pageRoute, `/${k.slug}/home`, { slug: k.slug, page: 'home' })).text);
  assert.equal(home('.v-rsvp .v-title').text(), 'Can you make it?');
  assert.equal(home('.site-nav [data-copy="nav_home"]').text(), 'Start');
  assert.equal(home('.v-story .v-title').text(), 'Our Story');
  const rsvp = cheerio.load((await call(pageRoute, `/${k.slug}/rsvp`, { slug: k.slug, page: 'rsvp' })).text);
  assert.equal(rsvp('h1').first().text(), 'Can you make it?');
  assert.match(rsvp('title').text(), /^RSVP · /);

  // a stored key the design dropped later stays (saving keeps working) and is ignored by the site
  const site2 = (await getDataAdapter().getSiteById(k.id))!;
  await getDataAdapter().patchSite(k.id, { content: { ...site2.content, copy: { ...site2.content.copy, retired_key: 'old' } } });
  const fresh = (await call(stateRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { key: k.editKey })).data.state;
  const keep = await put({ ...fresh.content, copy: { ...fresh.content.copy, retired_key: 'still old' } }, fresh.updatedAt);
  assert.equal(keep.status, 200);
  assert.ok(keep.data.validation.warnings.some((w: any) => w.path === 'copy.retired_key'));
});

test('every theme: every key at its max renders without engine warnings; titles and the RSVP form follow the copy', async () => {
  for (const id of THEMES) {
    const theme = (await loadTheme(id))!;
    const c = record(id);
    c.copy = stressCopy(theme.manifest.copy);
    for (const page of PAGE_NAMES) {
      const html = (await readThemePage(theme, page))!;
      for (const thankYou of [false, true]) {
        const out = renderTemplate({ html, content: c, theme: theme.manifest, page, slug: 'stress', previewKey: thankYou ? 'k' : null, thankYouPreview: thankYou });
        assert.deepEqual(out.warnings, [], `${id} ${page}`);
        if (out.disabled) continue;
        const $ = cheerio.load(out.html);
        $('[data-copy]').each((_, el) => {
          const key = $(el).attr('data-copy')!;
          assert.equal($(el).text(), c.copy![key], `${id} ${page} ${key}`);
        });
      }
    }
    const story = renderTemplate({ html: (await readThemePage(theme, 'story'))!, content: { ...record(id), copy: { story_title: 'How we met' } }, theme: theme.manifest, page: 'story', slug: 's' });
    const $ = cheerio.load(story.html);
    assert.equal($('title').text().split(' · ')[0], 'How we met');
    assert.equal($('meta[property="og:title"]').attr('content')!.split(' · ')[0], 'How we met');
    const rsvp = cheerio.load(renderTemplate({ html: (await readThemePage(theme, 'rsvp'))!, content: { ...record(id), copy: { form_party: 'Guest name', form_optional: '(if you like)' } }, theme: theme.manifest, page: 'rsvp', slug: 's' }).html);
    // the guest-names row (G069, <template data-rsvp-party>): 01, 03 and (G084) 02, 05 — 04 not yet
    if (theme.manifest.copy.form_party) assert.equal(rsvp('[data-copy="form_party"]').text(), 'Guest name', 'the guest row inside <template data-rsvp-party>');
    assert.equal(rsvp('[data-copy="form_optional"]').length, theme.manifest.copy.form_party ? 3 : 2);
    assert.ok(rsvp('[data-copy="form_optional"]').toArray().every((e) => rsvp(e).text() === '(if you like)'));
  }
});

test('thank-you mode: its texts are copy keys too (thank_you.title keeps working next to them)', async () => {
  for (const id of THEMES) {
    const theme = (await loadTheme(id))!;
    const c = record(id);
    c.thank_you = { mode: 'on', title: 'Thank you, friends' };
    c.copy = { ty_kicker: 'Grateful hearts', rsvp_closed_title: 'All replies are in', home_link: 'Back home' };
    const html = (p: PageName) => renderTemplate({ html: readFileSync(path.join(PLATFORM_ROOT, 'themes', id, `${p}.html`), 'utf8'), content: c, theme: theme.manifest, page: p, slug: 's' }).html;
    const index = cheerio.load(html('index'));
    assert.equal(index('.env-head .kicker').text(), 'Grateful hearts');
    assert.equal(index('.ty-title').text(), 'Thank you, friends');
    const rsvp = cheerio.load(html('rsvp'));
    assert.equal(rsvp('h1').text(), 'All replies are in');
    assert.equal(rsvp('a.btn[href$="/home"]').text(), 'Back home');
  }
});

// ---------------------------------------------------------------------------------------------- panel helpers

test('panel helpers: changes by page ("Headings & labels"), entries, jumps, suggestions', async () => {
  const theme = (await loadTheme('olive-ivory'))!;
  const entries = panelCopyEntries(theme.manifest.copy);
  const pub = record();
  const draft = record();
  draft.copy = { envelope_kicker: 'Hello', nav_rsvp: 'Reply' };
  assert.deepEqual(changedCopyPages(draft, pub, entries), ['us', 'details']);
  assert.deepEqual(changedPages(draft, pub, entries), ['us', 'details']);
  assert.deepEqual(changedPages(draft, pub), [], 'without the entries the copy has no page (older callers)');
  assert.deepEqual(changedCopyPages({ ...draft, copy: { envelope_kicker: '' } }, pub, entries), [], 'empty = the design text = unchanged');
  assert.equal(COPY_TITLE, 'Headings & labels');
  assert.equal(copyPanelPage('copy.rsvp_title', entries), 'rsvp');
  assert.equal(copyPanelPage('copy.nope', entries), null);
  assert.equal(copyPanelPage('venue.name', entries), null);
  // order: the most-changed first on each page, the after-the-wedding texts last
  const rsvp = entries.filter((e) => e.panel === 'rsvp');
  assert.deepEqual(rsvp.slice(0, 2).map((e) => e.key), ['rsvp_title', 'rsvp_by']);
  assert.ok(entries.filter((e) => e.panel === 'details').every((e) => e.label && e.max >= [...e.default].length));
  assert.ok(entries.filter((e) => e.multiline).every((e) => e.max > 80));

  // suggestions: fill the keys the design has, Wedding = back to the design's text, never longer than max
  const vow = COPY_PRESETS.find((p) => p.id === 'vow_renewal')!;
  const applied = applyCopyPreset(record(), vow, theme.manifest.copy);
  assert.deepEqual(applied.changed.sort(), ['card_line', 'invite_request']);
  assert.ok(applied.changed.every((k) => STANDARD_COPY[k].panel === 'us'), 'a suggestion only touches texts listed next to it (Us)');
  assert.equal(applied.content.copy!.card_line, 'We’re renewing our vows');
  assert.equal(currentPreset(applied.content, theme.manifest.copy), 'vow_renewal');
  assert.equal(currentPreset(record(), theme.manifest.copy), 'wedding');
  const back = applyCopyPreset(applied.content, COPY_PRESETS[0], theme.manifest.copy);
  assert.equal(back.content.copy, undefined);
  for (const p of COPY_PRESETS) for (const [key, v] of Object.entries(p.values)) if (v) assert.ok([...v].length <= STANDARD_COPY[key].max, `${p.id} ${key}`);
  const own = { ...record(), copy: { card_line: 'Our own words' } };
  assert.equal(currentPreset(own, theme.manifest.copy), null);
});
