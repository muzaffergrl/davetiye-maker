// G155 (G090 P2-02, P2-03): theme CSS of the designs on sale.
//   P2-03: the stand-alone text links ("Open the envelope again", "Replay the envelope") are ≥ 44 px tall themselves —
//          padding given back by negative margins of the same size (1lh), so the layout stays (measured in a browser for
//          all 20 designs: box 44 px, text and page height unchanged; gorevler/G155-qa-kod.md). 21 Crimson's links were
//          already 44 px (inline-flex, min-height).
//   P2-02: 03 Blush and 21 Crimson set no text under 12 px (21: since its 2026-10-23 redesign, every fixed size is ≥ 12 px).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { MARKETING } from '../lib/marketing/config.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const css = (id: string) => readFileSync(path.join(PLATFORM_ROOT, 'themes', id, 'site.css'), 'utf8');
const LIVE = MARKETING.designs.filter((d) => d.status === 'live').map((d) => d.id);

for (const id of LIVE) {
  test(`${id}: stand-alone text links are a ≥ 44 px touch target (padding + equal negative margins)`, () => {
    const s = css(id);
    if (id === 'ivory-pearl-atelier') {
      // Inline anchors need inline-flex for min-height to create a real touch target.
      assert.match(s, /\.textlink\{[^}]*display:inline-flex[^}]*min-height:44px/);
      return;
    }
    if (id === 'crimson-rose-atelier') {
      assert.match(s, /\.textlink\{[^}]*min-height:44px/);
      return;
    }
    if (id === 'blush-garden-rose') {
      // the underline is a border under the text: the padding goes above it, the top margin gives it back
      // (home: 22 + 19.8 line + 3 = 44.8 px; RSVP closing link as inline-block: 23 + 19.5 + 3 = 45.5 px)
      assert.match(s, /\n\.foot \.replay \{ margin-top: -6px; padding-top: 22px; display: inline-block; \}/);
      assert.match(s, /\n\.closing \.textlink\{display:inline-block;padding-top:23px;margin:-23px 0 -3px\}/);
      return;
    }
    // 14 px padding above and below (≥ 44 px for every link line of 17.6–21 px), the same 14 px given back by the margins;
    // the home and reply-panel links keep their own 18 / 20 px gap (now 4 / 6 px + the padding). The group rule comes before
    // their own rules so their margin-top wins and the negative bottom margin stays.
    const group = s.indexOf(':is(.foot,.closing,.reply-panel) .textlink{padding:14px 0;margin:-14px 0}');
    assert.ok(group > 0, `${id}: group rule`);
    const foot = /\n\.foot \.textlink ?\{ ?margin-top: ?([46])px;? ?\}/.exec(s);
    const panel = /\n\.reply-panel \.textlink ?\{ ?margin-top: ?4px/.exec(s);
    assert.ok(foot && foot.index > group, `${id}: .foot link margin`);
    assert.ok(panel && panel.index > group, `${id}: reply panel link margin`);
    // docs/11 §6: the budget still holds
    assert.ok(Buffer.byteLength(s) <= 45 * 1024, `${id}: site.css ${Buffer.byteLength(s)} B`);
  });
}

test('03 Blush: no font size under 12 px in site.css (fixed px, or a max() floor of at least 12 px)', () => {
  for (const m of css('blush-garden-rose').matchAll(/font-size:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    const px = /^(\d+(?:\.\d+)?)px$/.exec(v) ?? /^max\((\d+(?:\.\d+)?)px,/.exec(v);
    if (px) assert.ok(Number(px[1]) >= 12, `font-size ${v}`);
    else assert.match(v, /^(\.\d+em|\d+(\.\d+)?cqw|calc\(|clamp\((2[6-9]|[3-9]\d)px)/, `font-size ${v}`);
  }
});

test('21 Crimson (2026-10-23 atelier redesign): no fixed font size under 12 px; type inside the deckled card scales with it', () => {
  for (const m of css('crimson-rose-atelier').matchAll(/font(?:-size)?:\s*(?:\d{3}\s+)?([^;}]+)/g)) {
    const v = m[1].trim();
    const px = /^(\d+(?:\.\d+)?)px\b/.exec(v) ?? /^max\((\d+(?:\.\d+)?)px,/.exec(v);
    if (px) assert.ok(Number(px[1]) >= 12, `font ${v}`);
  }
  // the envelope's miniature card (aria-hidden, seen only while it rises out of the envelope) keeps the home card's
  // proportions (cqw, no floor); the home hero card itself has a 12 px floor for its date line
  const s = css('crimson-rose-atelier');
  assert.match(s, /\.card-date\{font-size:max\(12px,3\.7cqw\)/);
  assert.match(s, /\.env-card \.card-date\{font-size:3\.7cqw\}/);
});
