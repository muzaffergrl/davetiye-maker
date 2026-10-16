// G089 (K31): the motion effects of the sales site and the panel (components/fx/). Pure helpers, the reduced-motion
// guards in the CSS, the license header of the adapted React Bits Pro files, and that no motion library was added.
// The effects themselves are checked in a browser by tests/g089-browser.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { revealDelay, revealTargets, splitWords, tiltFor } from '../components/fx/fx.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const read = (p: string) => readFileSync(path.join(PLATFORM_ROOT, p), 'utf8');

/** CSS with comments removed and every `@media (prefers-reduced-motion: no-preference) { … }` and `@media print { … }`
 * block cut out (print only switches the effects off). */
function outsideMotionBlocks(css: string): string {
  let s = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (;;) {
    const i = s.search(/@media[^{]*(prefers-reduced-motion:\s*no-preference|print)[^{]*\{/);
    if (i < 0) return s;
    let depth = 0;
    let j = s.indexOf('{', i);
    for (; j < s.length; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}' && --depth === 0) break;
    }
    s = s.slice(0, i) + s.slice(j + 1);
  }
}

test('splitWords keeps every word in order and drops empty ones', () => {
  assert.deepEqual(splitWords('Wedding websites  that open\nlike an invitation'), ['Wedding', 'websites', 'that', 'open', 'like', 'an', 'invitation']);
  assert.deepEqual(splitWords('  '), []);
  assert.equal(splitWords('A — B').join(' '), 'A — B');
});

test('tiltFor: 0 at the centre, ±max at the edges, clamped outside', () => {
  assert.deepEqual(tiltFor(100, 50, 200, 100, 6), { rx: 0, ry: 0 });
  assert.deepEqual(tiltFor(200, 100, 200, 100, 6), { rx: -6, ry: 6 });
  assert.deepEqual(tiltFor(0, 0, 200, 100, 6), { rx: 6, ry: -6 });
  assert.deepEqual(tiltFor(900, -400, 200, 100, 6), { rx: 6, ry: 6 });
  assert.deepEqual(tiltFor(10, 10, 0, 100, 6), { rx: 0, ry: 0 });
});

test('revealTargets hides only blocks below the first screen', () => {
  assert.deepEqual(revealTargets([-500, 0, 400, 843, 844, 2000], 844), [4, 5]);
  assert.deepEqual(revealTargets([], 844), []);
});

test('revealDelay: 70 ms steps, at most 4', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 9, -1].map(revealDelay), [0, 70, 140, 210, 280, 280, 0]);
});

test('every animation and the hidden reveal state only exist under prefers-reduced-motion: no-preference', () => {
  for (const file of ['components/fx/fx.module.css', 'components/marketing/marketing.module.css']) {
    const rest = outsideMotionBlocks(read(file));
    const fx = rest.split('\n').filter((l) => /data-reveal|fx-word|fx-rise|fx-reveal/.test(l) && !/@keyframes/.test(l));
    assert.deepEqual(fx, [], `${file}: G089 rules outside a no-preference block`);
  }
  const fx = read('components/fx/fx.module.css');
  assert.match(fx, /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.stagger \.word \{\s*animation:/);
  const mk = read('components/marketing/marketing.module.css');
  assert.match(mk, /\[data-reveal='wait'\][^{]*\{[^}]*opacity: 0/);
});

test('the scripted effects check reduced motion themselves', () => {
  assert.match(read('components/fx/DepthTilt.tsx'), /prefers-reduced-motion: no-preference/);
  assert.match(read('components/fx/RevealOnScroll.tsx'), /prefers-reduced-motion: reduce\)'\)\.matches\) return/);
  assert.match(read('components/fx/useViewFade.ts'), /prefers-reduced-motion: reduce\)'\)\.matches\) return/);
});

test('adapted React Bits Pro files carry their source and license note', () => {
  for (const f of ['components/fx/StaggeredText.tsx', 'components/fx/DepthTilt.tsx']) {
    const head = read(f).slice(0, 900);
    assert.match(head, /React Bits Pro/, f);
    assert.match(head, /https:\/\/pro\.reactbits\.dev\/license/, f);
    assert.match(head, /private/i, f);
  }
});

test('no animation library and no Tailwind were added (G089 uses CSS and a few lines of script)', () => {
  const pkg = JSON.parse(read('package.json'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of ['motion', 'framer-motion', 'gsap', 'three', 'tailwindcss', '@tailwindcss/postcss']) {
    assert.equal(deps[name], undefined, name);
  }
});

test('the license key never lands in the repository', () => {
  const ignore = read('.gitignore');
  assert.match(ignore, /^\.env\*$/m);
});
