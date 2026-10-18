// Buyer content must reach the same five-page contract as the original designs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { loadTheme, readThemePage, PAGE_NAMES } from '../lib/theme/theme.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { DEMO_CITY_PINS, withDemoMap } from '../lib/claim/demo-map.ts';
import type { ContentRecord } from '../lib/content/types.ts';

const ids = ['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere',
  'orient-express-voyage', 'kintsugi-washi', 'riad-lantern-nights', 'maison-patisserie',
  'celestial-observatory', 'azulejo-mosaic', 'sky-lantern-festival', 'music-box-ballerina'];

for (const id of ids) {
  test(`${id}: buyer names and photos reach all five pages without sample data`, async () => {
    const theme = await loadTheme(id);
    assert.ok(theme);
    const demo = JSON.parse(await readFile(path.join(theme.dir, 'content.demo.json'), 'utf8')) as ContentRecord;
    const buyer = draftFromDemo(demo, ['BuyerAmélie', 'BuyerRémi']);
    buyer.media = {
      hero_portrait: '/uploads/buyer-portrait.webp',
      memory_photos: ['/uploads/buyer-story-1.webp', '/uploads/buyer-story-2.webp', '/uploads/buyer-story-3.webp'],
      venue_image: '/uploads/buyer-venue.webp', couple_clip: null,
    };
    const visiblePhotos = new Set<string>();
    for (const page of PAGE_NAMES) {
      const html = await readThemePage(theme, page);
      assert.ok(html, page);
      const rendered = renderTemplate({ html, theme: theme.manifest, content: buyer, page,
        slug: 'buyer-couple', previewKey: 'parity', now: new Date('2026-10-18') });
      assert.equal(rendered.disabled, false, page);
      const $ = cheerio.load(rendered.html);
      assert.equal($('h1').length, 1, `${page}: one main heading`);
      if (page !== 'details') assert.ok($('body').text().includes('BuyerAmélie'), `${page}: buyer names are live text`);
      for (const partner of demo.partners) {
        assert.ok(!$('body').text().includes(partner.full_name || partner.display_name), `${page}: no sample couple`);
      }
      $('img[data-photo]').each((_, el) => {
        const src = $(el).attr('src') || '';
        assert.ok(src.startsWith('/uploads/buyer-'), `${page}: buyer photo, got ${src}`);
        visiblePhotos.add($(el).attr('data-photo')!);
      });
      if (page === 'index') assert.ok($('a[data-skip]').attr('href')?.includes('/buyer-couple/home'));
      if (page === 'home' || page === 'details') {
        assert.equal($('[data-calendar="ics"]').length, 1, `${page}: calendar download`);
        assert.equal($('[data-calendar="google"]').length, 1, `${page}: Google calendar`);
      }
      if (page === 'rsvp') assert.equal($('form[data-rsvp-form]').length, 1, 'shared RSVP form');
    }
    assert.deepEqual([...visiblePhotos].sort(), Object.keys(theme.manifest.photos).sort(), 'all five editable photo slots render');
  });
}

test('Maison demo map agrees with Newport and never adds a pin to buyer content', () => {
  assert.deepEqual(DEMO_CITY_PINS['maison-patisserie'], { lat: 41.4901, lng: -71.3128 });
  const ownPin = { maps: { venue: { lat: 40, lng: 29 } } };
  assert.equal(withDemoMap('maison-patisserie', ownPin), ownPin);
});
