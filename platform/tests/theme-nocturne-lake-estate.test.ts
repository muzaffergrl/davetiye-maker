// Nocturne Lake Estate (22, G142): platform theme, demo route, sample photos, thank-you mode, audio cues, RSVP contract.
// The envelope contract shared with Crimson (docs/11 §3, §7, §11) is in tests/g142-crimson-nocturne.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { claimableTheme } from '../lib/claim/themes.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { DEMO_CITY_PINS } from '../lib/claim/demo-map.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, designStyles, openingObject } from '../lib/marketing/designs.ts';
import { designSound } from '../lib/audio/catalog.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import type { PageName } from '../lib/theme/theme.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const id = 'nocturne-lake-estate';
const ROOT = path.resolve(import.meta.dirname, '..');

test('Nocturne is a catalogued platform theme, kept off sale until approval', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  assert.equal(theme.name, 'Nocturne Lake Estate');
  // off sale until approval: 'coming' (hidden) or 'preview' (in the catalogue, no checkout, no /start; main f1228e88)
  assert.ok(['coming', 'preview'].includes(MARKETING.designs.find((d) => d.id === id)?.status ?? ''));
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), false);
  assert.equal(openingObject(DESIGN_COPY[id]), 'envelope');
  assert.equal(DESIGN_COPY[id].collection, '22_Nocturne_Lake_Estate');
  assert.ok(designStyles(id).includes('classic'));
  assert.ok(DEMO_CITY_PINS[id], 'demo map pin');
  assert.deepEqual(Object.keys(theme.manifest.photos).sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
});

test('demo record = collection record, fictional, URLs empty', async () => {
  const a = JSON.parse(await readFile(path.join(ROOT, 'themes', id, 'content.demo.json'), 'utf8'));
  const b = JSON.parse(await readFile(path.join(ROOT, '..', 'collections/22_Nocturne_Lake_Estate/content.demo.json'), 'utf8'));
  assert.deepEqual(a, b);
  assert.equal(a.record_kind, 'demo');
  for (const v of Object.values(a.urls)) assert.equal(v, null);
});

test('demo route renders every page with the bundled sample photos and preview navigation', async () => {
  for (const page of ['index', 'home', 'story', 'details', 'rsvp']) {
    const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + (page === 'index' ? '' : '/' + page)), id, page);
    assert.equal(response.status, 200, page);
    const $ = cheerio.load(await response.text());
    assert.equal($('h1').length, 1, page);
    const data = JSON.parse($('#site-data').text());
    assert.equal(data.preview, true);
    assert.match(data.pages.home, /^\/start\/demo\/nocturne-lake-estate\/home/);
    if (page === 'home') assert.match($('[data-photo="hero_portrait"]').attr('src') || '', /\/themes\/nocturne-lake-estate\/img\/couple-960\.webp/);
    if (page === 'story') assert.equal($('[data-gallery-open]').length, 3);
  }
});

test('every demo photo is a bundled theme asset; a buyer draft never inherits them', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const media = theme.demo.media;
  for (const url of [media.hero_portrait, ...(media.memory_photos ?? []), media.venue_image]) {
    assert.ok(url && url.startsWith('/themes/' + id + '/img/'), String(url));
    assert.ok((await stat(path.join(theme.loaded.dir, 'img', url.split('/img/')[1]))).size > 0);
  }
  const draft = draftFromDemo(theme.demo, ['Ada', 'Ben']);
  assert.deepEqual(draft.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
  assert.equal(draft.partners[0].full_name, null);
});

test('thank-you mode closes RSVP, keeps the story and the card carries the thank-you title', async () => {
  const theme = await claimableTheme(id);
  assert.ok(theme);
  const demo = structuredClone(theme.demo);
  const render = async (page: PageName, content: ContentRecord) => renderTemplate({
    html: await readFile(path.join(theme.loaded.dir, theme.manifest.pages[page]!), 'utf8'), theme: theme.manifest, content, page,
    slug: 'review', previewKey: 'demo', now: new Date('2026-10-17'),
  });
  demo.thank_you = { mode: 'on', message: 'Thank you for a night by the lake.', details: 'hide' };
  const index = cheerio.load((await render('index', demo)).html);
  assert.ok(index('.card [data-field="thank_you_title"]').text().trim().length > 0);
  assert.equal(index('.card [data-photo="hero_portrait"]').length, 0);
  const home = cheerio.load((await render('home', demo)).html);
  assert.match(home.text(), /Thank you for a night by the lake/);
  assert.equal(home('a[href*="/rsvp"]').length, 0);
  assert.equal(home('[data-countdown]').length, 0);
  assert.equal((await render('details', demo)).disabled, true);
  assert.equal((await render('story', demo)).disabled, false);
  assert.equal(cheerio.load((await render('rsvp', demo)).html)('[data-rsvp-form]').length, 0);
});

test('opening sounds start with steps of MOTION.envelope', () => {
  assert.deepEqual(designSound(id), { music: 'evening-strings', opening: [[0, 'seal'], [450, 'paper'], [1700, 'slide'], [3000, 'chime']] });
});

test('RSVP keeps the shared form contract; question labels leave room for the "(optional)" mark', async () => {
  const response = await handleDemoPage(new Request('https://preview.example/start/demo/' + id + '/rsvp'), id, 'rsvp');
  const $ = cheerio.load(await response.text());
  assert.equal($('script[src="/rsvp/form.js"][defer]').length, 1);
  assert.equal($('form[data-rsvp-form][method="post"]:not([action])').length, 1);
  for (const st of ['success', 'closed', 'error', 'preview']) assert.equal($(`[data-rsvp-state="${st}"][hidden]`).length, 1, st);
  for (const f of ['name', 'email', 'attending', 'guests', 'message']) assert.equal($(`[data-rsvp-error-for="${f}"]`).length, 1, f);
  assert.equal($('template[data-rsvp-party]').length, 1);
  const legend = $('[data-rsvp-question] legend').first();
  assert.equal(legend.attr('data-field'), undefined, 'the label is a child span, not the legend itself');
  assert.equal(legend.find('[data-field]').length, 1);
  assert.equal($('a[href="#reply"]').length, 1);
});
