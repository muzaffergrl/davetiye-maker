// G175: every design of lib/marketing/config.ts — live and off sale (22–38) — has its own opening sentence in
// lib/marketing/designs.ts, so the panel's first preview tab is named after it (openingTabLabel, G121) and never falls
// back to "Opening"; the START HERE guides (tools/build_customer_guides.py) print the same word. 26 Kintsugi & Washi had
// no sales copy (G164) and showed "Opening"; its object is the origami. Every opening word is translated on the sales
// site (OPENING_THINGS) and in the panel (I18N_STRICT, keys.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, catalogDesign, openingObject } from '../lib/marketing/designs.ts';
import { OPENING_THINGS } from '../lib/marketing/i18n.ts';
import { openingPlace, openingTabLabel } from '../lib/panel/model.ts';
import { themeOpening } from '../lib/panel/state.ts';

const COMING_OPENINGS: Record<string, string> = {
  'nocturne-lake-estate': 'envelope',
  'velvet-jewel-box': 'envelope',
  'grand-theatre-premiere': 'envelope',
  'orient-express-voyage': 'envelope',
  'kintsugi-washi': 'envelope',
  'riad-lantern-nights': 'envelope',
  'maison-patisserie': 'envelope',
  'celestial-observatory': 'envelope',
  'azulejo-mosaic': 'envelope',
  'sky-lantern-festival': 'envelope',
  'music-box-ballerina': 'envelope',
  'marigold-mehndi': 'envelope',
  'red-lacquer-double-happiness': 'envelope',
  'highland-tartan-thistle': 'envelope',
  'victorian-glasshouse': 'envelope',
  'art-nouveau-lily': 'envelope',
  'papel-picado-fiesta': 'envelope',
  'silver-photo-booth': 'envelope',
  'swan-chantilly-lace': 'envelope',
  'chartreuse-garden-party': 'envelope',
  'bordeaux-silk-bow': 'envelope',
  'monochrome-darkroom': 'envelope',
  'navy-ivory-crest': 'envelope',
  'painted-lily-pond': 'envelope',
  'espresso-pastoral': 'envelope',
  'blue-toile-pavilion': 'envelope',
  'suede-ranch-lace': 'envelope',
};

test('G175: every configured design has an opening object, and the panel tab is named after it', () => {
  assert.equal(MARKETING.designs.length, 49);
  for (const d of MARKETING.designs) {
    const copy = DESIGN_COPY[d.id];
    assert.ok(copy, `${d.id}: no sales copy in lib/marketing/designs.ts`);
    const word = openingObject(copy);
    assert.equal(themeOpening(d.id), word, d.id);
    const tab = openingTabLabel(themeOpening(d.id));
    assert.notEqual(tab, 'Opening', d.id);
    assert.equal(tab, word.charAt(0).toUpperCase() + word.slice(1), d.id);
    assert.equal(openingPlace(themeOpening(d.id)), word, d.id);
    assert.ok(OPENING_THINGS[word], `${d.id}: '${word}' missing from OPENING_THINGS`);
  }
  // 22–32 are off sale ('coming', or 'preview' in the catalogue since main f1228e88); the eleven rebuilt themes use the complete envelope opening
  const offSale = MARKETING.designs.filter((d) => d.status !== 'live');
  assert.deepEqual(Object.fromEntries(offSale.map((d) => [d.id, themeOpening(d.id)])), COMING_OPENINGS);
  // while in preview the catalogue shows the envelope cover and its envelope copy (main f1228e88), matching the rebuilt real template
  for (const d of offSale.filter((x) => x.status === 'preview')) {
    assert.equal(openingObject(catalogDesign(d.id)!.copy), 'envelope', d.id);
  }
});

test('G175: openingTabLabel still falls back to "Opening" for a design without copy', () => {
  assert.equal(openingTabLabel(themeOpening('_sample')), 'Opening');
  assert.equal(openingTabLabel('origami'), 'Origami');
  assert.equal(openingTabLabel('curtain'), 'Curtain');
});
