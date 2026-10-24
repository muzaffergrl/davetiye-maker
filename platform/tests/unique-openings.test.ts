// The openings of the eleven designs 22–32 (docs/35_22_32_YENIDEN_TASARIM.md). Until 2026-10-22 this file guarded the
// Codex "envelope-v3" openings (hashes of the finished interiors, mirrored back faces, contrast of envelope-v3.css, the
// legacy session key). The redesign G422–G432 rebuilt each design from its own layered GPT parts and removed those files,
// so the file now guards what still matters across the eleven (main 0f437b58e, 2026-10-23: the catalogue, the panel tab,
// START HERE, the Etsy listing and the guest labels must name the object the guest really taps):
// - every manifest loads through the production parser;
// - the opening object is the same word in the catalogue copy, the panel's first preview tab and the theme's own open
//   button (K23 strict: the first page is a closed envelope; 25's is a ticket sleeve, an envelope of its own kind);
// - while the opening plays there is no button or pill on screen (docs/35 §3: Skip and Esc are enough), so no theme keeps
//   the old editable close-button key;
// - the replay links go back to the opening;
// - no file of the old openings is left, and each design is closed by its own fastening.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, openingObject } from '../lib/marketing/designs.ts';
import { parseManifest } from '../lib/theme/theme.ts';
import { openingTabLabel } from '../lib/panel/model.ts';
import { themeOpening } from '../lib/panel/state.ts';

const root = path.resolve(import.meta.dirname, '..');

// what the theme's open button says (theme.json copy envelope_open, also the stage's aria-label)
const OPEN_LABEL: Record<string, string> = {
  'nocturne-lake-estate': 'Open the envelope',
  'velvet-jewel-box': 'Open the envelope',
  'grand-theatre-premiere': 'Open the envelope',
  'orient-express-voyage': 'Open the ticket sleeve',
  'kintsugi-washi': 'Open the invitation',
  'riad-lantern-nights': 'Open the invitation',
  'maison-patisserie': 'Open the envelope',
  'celestial-observatory': 'Open the envelope',
  'azulejo-mosaic': 'Open the envelope',
  'sky-lantern-festival': 'Open the envelope',
  'music-box-ballerina': 'Open the invitation',
};
const ids = Object.keys(OPEN_LABEL);

// the fastening that closes each envelope (docs/35 §4), named in its own opening sentence
const CLOSURE: Record<string, RegExp> = {
  'nocturne-lake-estate': /gold seal/,
  'velvet-jewel-box': /\bring\b/,
  'grand-theatre-premiere': /gold cord/,
  'orient-express-voyage': /turn-lock/,
  'kintsugi-washi': /porcelain button/,
  'riad-lantern-nights': /brass lantern/,
  'maison-patisserie': /satin bow/,
  'celestial-observatory': /astrolabe/,
  'azulejo-mosaic': /swallow tile/,
  'sky-lantern-festival': /paper lantern/,
  'music-box-ballerina': /brass key/,
};

const page = (id: string, name: string) => cheerio.load(readFileSync(path.join(root, 'themes', id, name + '.html'), 'utf8'));
const manifest = (id: string) => parseManifest(JSON.parse(readFileSync(path.join(root, 'themes', id, 'theme.json'), 'utf8')), id);

test('the eleven are the off-sale designs 22–32 and load through the production parser', () => {
  const numbered = MARKETING.designs.filter((d) => ids.includes(d.id));
  assert.deepEqual(numbered.map((d) => d.id).sort(), [...ids].sort());
  for (const d of numbered) assert.equal(d.status, 'preview', d.id);
  for (const id of ids) {
    const m = manifest(id);
    for (const k of ['envelope_open', 'envelope_hint_tap', 'envelope_skip', 'envelope_replay', 'home_replay', 'rsvp_replay']) {
      assert.ok(m.copy[k]?.default, `${id}: copy ${k}`);
    }
    assert.equal(m.copy.envelope_close, undefined, `${id}: no close button while the opening plays`);
  }
});

test('catalogue, panel tab and the theme’s open button name the object the guest taps', () => {
  for (const id of ids) {
    const word = openingObject(DESIGN_COPY[id]);
    assert.equal(word, 'envelope', id);
    assert.equal(themeOpening(id), word, id);
    assert.equal(openingTabLabel(themeOpening(id)), 'Envelope', id);
    assert.equal(manifest(id).copy.envelope_open.default, OPEN_LABEL[id], id);
    const $ = page(id, 'index');
    assert.equal($('[data-copy-attr="aria-label:envelope_open"]').attr('aria-label'), OPEN_LABEL[id], id);
    for (const e of $('[data-copy="envelope_open"]').toArray()) assert.equal($(e).text(), OPEN_LABEL[id], id);
    // the label never names another object than the catalogue (no box, curtain, wallet, door … of the old openings)
    assert.match(OPEN_LABEL[id], /^Open the (envelope|ticket sleeve|invitation)$/, id);
    assert.doesNotMatch($.text(), /\b(Close envelope|Close the (box|curtain|wallet|doors|parcel|star chart|tile panel|pouch|music box)|Fold the origami)\b/, id);
  }
});

test('the replay links on home and RSVP go back to the opening and show their editable text', () => {
  for (const id of ids) {
    const m = manifest(id);
    for (const [name, key] of [['home', 'home_replay'], ['rsvp', 'rsvp_replay']] as const) {
      const $ = page(id, name);
      const el = $(`[data-copy="${key}"]`);
      assert.equal(el.length, 1, `${id}/${name}`);
      assert.equal(el.text(), m.copy[key].default, `${id}/${name}`);
      assert.equal(el.closest('a').attr('href'), 'index.html?replay=1', `${id}/${name}`);
    }
  }
});

test('no file of the old envelope-v3 openings is left, and each envelope has its own fastening', () => {
  for (const id of ids) {
    const dir = path.join(root, 'themes', id);
    const files = readdirSync(dir);
    assert.deepEqual(files.filter((f) => /^(envelope-v3|opening|interior)|^parts\.css$/.test(f)), [], id);
    assert.deepEqual(readdirSync(path.join(dir, 'img')).filter((f) => /^v[34]-/.test(f)), [], `${id}/img`);
    for (const f of ['site.css', 'site.js', 'thank-you.css', 'build_images.py', 'img/manifest.json']) assert.ok(existsSync(path.join(dir, f)), `${id}/${f}`);
    assert.match(DESIGN_COPY[id].opening, CLOSURE[id], id);
  }
  const styles = ids.map((id) => DESIGN_COPY[id].style);
  assert.equal(new Set(styles).size, styles.length, 'eleven different envelopes');
});
