// G175: every design of lib/marketing/config.ts — live and off sale (22–38) — has its own opening sentence in
// lib/marketing/designs.ts, so the panel's first preview tab is named after it (openingTabLabel, G121) and never falls
// back to "Opening"; the START HERE guides (tools/build_customer_guides.py) print the same word. 26 Kintsugi & Washi had
// no sales copy (G164) and showed "Opening"; its object was the origami until the docs/35 redesign. Every opening word
// is translated on the sales site (OPENING_THINGS) and in the panel (I18N_STRICT, keys.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
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
  // 22–32 are off sale ('coming', or 'preview' in the catalogue since main f1228e88); since the docs/35 redesign
  // (G422–G432, merged 2026-10-23) each of them opens from its own closed envelope (K23 strict)
  const offSale = MARKETING.designs.filter((d) => d.status !== 'live');
  assert.deepEqual(Object.fromEntries(offSale.map((d) => [d.id, themeOpening(d.id)])), COMING_OPENINGS);
  // while in preview the catalogue copy names the same object as the panel and START HERE
  for (const d of offSale.filter((x) => x.status === 'preview')) {
    assert.equal(openingObject(catalogDesign(d.id)!.copy), COMING_OPENINGS[d.id], d.id);
  }
});

// The START HERE guides (tools/build_customer_guides.py) and the Etsy check (tools/etsy_upload.py) read the opening and the
// fonts from the source text of DESIGN_COPY; nothing may replace a design's copy when the module loads (the 22–32 preview
// overrides were folded into DESIGN_COPY on 2026-10-23). Both must agree, or the guide names another object or other
// fonts than the site and the panel.
test('G175: the opening sentence and the fonts the tools read from designs.ts are the ones the site and the panel use', () => {
  const src = readFileSync(path.join(import.meta.dirname, '..', 'lib', 'marketing', 'designs.ts'), 'utf8');
  for (const d of MARKETING.designs) {
    // the first entry of the id is DESIGN_COPY's (the same regex as build_customer_guides.py design_block)
    const block = new RegExp(`^  '${d.id}': \\{([\\s\\S]*?)^  \\},`, 'm').exec(src)?.[1];
    assert.ok(block, `${d.id}: no DESIGN_COPY entry in the source`);
    const opening = /(?:\bopening|"opening"):\s*(?:msg\(\s*)?(['"])((?:\\.|(?!\1).)*)\1/.exec(block);
    assert.ok(opening, `${d.id}: no opening in the source`);
    assert.equal(opening[2].replace(/\\(.)/g, '$1'), DESIGN_COPY[d.id].opening, `${d.id}: source opening ≠ runtime opening`);
    const fonts = /(?:\bfonts|"fonts"):\s*\[([^\]]*)\]/.exec(block);
    assert.ok(fonts, `${d.id}: no fonts in the source`);
    assert.deepEqual([...fonts[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]), DESIGN_COPY[d.id].fonts, `${d.id}: source fonts ≠ runtime fonts`);
  }
});

// The fonts on /designs/<id> are the ones the theme loads (Google Fonts family= of its pages).
test('G175: the rebuilt 22–32 designs list the fonts their pages load', () => {
  for (const id of Object.keys(COMING_OPENINGS).slice(0, 11)) {
    const html = readFileSync(path.join(import.meta.dirname, '..', 'themes', id, 'index.html'), 'utf8');
    const loaded = [...html.matchAll(/family=([^:&"]+)/g)].map((m) => decodeURIComponent(m[1].replace(/\+/g, ' ')));
    assert.deepEqual([...DESIGN_COPY[id].fonts].sort(), [...new Set(loaded)].sort(), id);
  }
});

test('G175: openingTabLabel still falls back to "Opening" for a design without copy', () => {
  assert.equal(openingTabLabel(themeOpening('_sample')), 'Opening');
  assert.equal(openingTabLabel('origami'), 'Origami');
  assert.equal(openingTabLabel('curtain'), 'Curtain');
});
