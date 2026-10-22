// G155 (G090 P2-02, P2-03): theme CSS of the designs on sale.
//   P2-03: the stand-alone text links ("Open the envelope again", "Replay the envelope") are ≥ 44 px tall themselves —
//          padding given back by negative margins of the same size (1lh), so the layout stays (measured in a browser for
//          all 20 designs: box 44 px, text and page height unchanged; gorevler/G155-qa-kod.md). 21 Crimson's links were
//          already 44 px (inline-flex, min-height).
//   P2-02: 03 Blush and 21 Crimson set no text under 12 px (their G155 block, measured at 360 px in a browser).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { MARKETING } from '../lib/marketing/config.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const css = (id: string) => readFileSync(path.join(PLATFORM_ROOT, 'themes', id, 'site.css'), 'utf8');
const LIVE = MARKETING.designs.filter((d) => d.status === 'live').map((d) => d.id);

/** The CSS after the theme's G155 marker (the override block appended at the end of site.css). */
function g155Block(id: string, marker: string): string {
  const s = css(id);
  const at = s.indexOf(marker);
  assert.ok(at >= 0, `${id}: no "${marker}" block`);
  return s.slice(at);
}

/** Declarations (selector → body) of a CSS block, nested @media blocks flattened. */
function rules(block: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const m of block.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) out.push([m[1].trim(), m[2].trim()]);
  return out;
}

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

test('21 Crimson: the G155 block raises every small label to 12 px', () => {
  const block = rules(g155Block('crimson-rose-atelier', '/* G155 (G090 P2-02)'));
  assert.ok(block.length >= 20, `${block.length} rules`);
  for (const [sel, body] of block) {
    for (const m of body.matchAll(/font-size:\s*([^;]+)/g)) {
      const px = /^(\d+(?:\.\d+)?)px$/.exec(m[1].trim());
      assert.ok(px && Number(px[1]) >= 12, `${sel}: font-size ${m[1]}`);
    }
  }
  // every declaration under 12 px earlier in the file is overridden by the block (same selector)
  const s = css('crimson-rose-atelier');
  const before = s.slice(0, s.indexOf('/* G155 (G090 P2-02)'));
  const raised = new Set(block.map(([sel]) => sel.replace(/\s+/g, '')));
  // kept: the envelope's miniature card (aria-hidden, seen only while it rises out of the envelope): its text column is
  // ~70 px wide on a 360 px phone, 12 px lines do not fit (gorevler/G155-qa-kod.md)
  raised.add('.env-card.eyebrow');
  for (const [sel, body] of rules(before)) {
    if (sel.startsWith('@') || /^(from|to|\d+%)$/.test(sel)) continue;
    const fs = /font(?:-size)?:\s*(?:\d{3}\s+)?(\d+(?:\.\d+)?)px/.exec(body);
    if (fs && Number(fs[1]) < 12) assert.ok(raised.has(sel.replace(/\s+/g, '')), `${sel}: ${fs[1]} px not raised`);
  }
});
