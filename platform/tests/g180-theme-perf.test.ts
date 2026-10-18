// G180 theme-standard performance markers (docs/11 §6, §12), checked on the template sources of every theme:
// 1. the names fallback faces (scripts/font-fallback.ts): every page carries the same inline <style> with fb1 / fb2
//    right before site.css, and site.css names fb1, fb2 right after the web family of the names heading;
// 2. the deferred opening parts on the envelope page: [data-defer] images are lazy, never high priority, and the page
//    carries the release snippet (one copy of it, identical in every theme) after the early-state script;
// 3. site.css stays within the 45 KB budget.
// The measured side (CLS / LCP / nav) is tests/g180-browser.ts (production build, not part of npm test).

import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import * as cheerio from 'cheerio';
import { ROOT } from '../scripts/lib/theme-env.ts';

const THEMES = path.join(ROOT, 'themes');
const ids = readdirSync(THEMES).filter((d) => !d.startsWith('_') && existsSync(path.join(THEMES, d, 'site.css')));
const read = (id: string, f: string) => readFileSync(path.join(THEMES, id, f), 'utf8');
const pages = (id: string) => readdirSync(path.join(THEMES, id)).filter((f) => f.endsWith('.html'));
const FACES = /<style>\/\* names fallback: scripts\/font-fallback\.ts \*\/\n@font-face\{font-family:fb1;[^\n]*\}\n@font-face\{font-family:fb2;[^\n]*\}<\/style>\n<link rel="stylesheet" href="site\.css">/;
const RELEASE = /<style>\.js:not\(\.parts-on\) img\[data-defer\]\{display:none!important\}<\/style>\n<script>\/\* deferred opening parts \(G180[\s\S]*?<\/script>\n/;

// every theme, 01–32 since G180 and 33–38 since G188; a new design runs scripts/font-fallback.ts when it is built
test('names fallback faces: the same inline block before site.css on every page, fb1, fb2 in the site.css stack', () => {
  assert.ok(ids.length >= 38, `themes: ${ids.length}`);
  for (const id of ids) {
    const blocks = pages(id).map((f) => read(id, f).match(FACES)?.[0]);
    blocks.forEach((b, i) => assert.ok(b, `${id}/${pages(id)[i]}: names fallback <style> right before site.css`));
    assert.equal(new Set(blocks).size, 1, `${id}: one measurement on every page`);
    const src = /src:local\(Times New Roman\),local\(Liberation Serif\),local\(Tinos\);[\s\S]*src:local\(Noto Serif\),local\(Droid Serif\);/;
    assert.match(blocks[0]!, src, `${id}: fb1 = Times metrics, fb2 = Noto Serif`);
    for (const d of ['size-adjust', 'ascent-override', 'descent-override', 'line-gap-override']) assert.equal(blocks[0]!.split(`${d}:`).length, 3, `${id}: ${d} on both faces`);
    assert.match(read(id, 'site.css'), /["'][^"',;]+["'],fb1,fb2,/, `${id}: site.css names fb1, fb2 after the web family`);
  }
});

test('deferred opening parts: lazy, low, never the closed object; one identical release snippet after the early-state script', () => {
  const snippets = new Set<string>();
  let themes = 0;
  for (const id of ids) {
    const html = read(id, 'index.html');
    const $ = cheerio.load(html);
    const deferred = $('img[data-defer]');
    if (!deferred.length) {
      assert.doesNotMatch(html, /parts-on/, `${id}: no release snippet without deferred parts`);
      continue;
    }
    themes++;
    deferred.each((_, el) => {
      const a = $(el).attr();
      assert.equal(a?.loading, 'lazy', `${id}: ${a?.class ?? a?.src} is lazy (the preload scanner skips it)`);
      assert.notEqual(a?.fetchpriority, 'high', `${id}: ${a?.class ?? a?.src} is not high priority`);
    });
    assert.ok($('.stage img[fetchpriority="high"]').length >= 1, `${id}: the closed object is high priority`);
    const m = html.match(RELEASE);
    assert.ok(m, `${id}: release snippet`);
    assert.ok(html.indexOf(m![0]) > html.indexOf("classList.replace('no-js','js')"), `${id}: after the early-state script`);
    snippets.add(m![0]);
  }
  assert.ok(themes >= 21, `envelope themes with deferred parts: ${themes}`);
  assert.equal(snippets.size, 1, 'the same release snippet in every theme');
});

test('site.css within the 45 KB budget (docs/11 §6)', () => {
  for (const id of ids) assert.ok(Buffer.byteLength(read(id, 'site.css')) <= 45 * 1024, `${id}: site.css ${Buffer.byteLength(read(id, 'site.css'))} B`);
});
