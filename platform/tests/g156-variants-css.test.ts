// G156 regression: a palette file's header comment once contained "variants/*/palette.json"; its "*/" closed the comment early,
// so browsers dropped the :root channel block that follows and the ORIGINAL palette lost its rgb(var(--c-…)) colours.
// Every theme's generated variants.css must have well-formed comments and a :root block outside any comment.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const THEMES = path.join(import.meta.dirname, '..', 'themes');

/** The CSS with comments removed the way a browser does; null when a comment is opened twice, closed without being open, or left open. */
function stripComments(css: string): string | null {
  let out = '';
  let i = 0;
  while (i < css.length) {
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      if (end < 0) return null;
      if (css.slice(i + 2, end).includes('/*')) return null;
      i = end + 2;
      continue;
    }
    if (css.startsWith('*/', i)) return null;
    out += css[i];
    i += 1;
  }
  return out;
}

test('variants.css of every theme: comments are well formed and the :root channel defaults stay outside them', () => {
  const files = readdirSync(THEMES)
    .map((id) => path.join(THEMES, id, 'variants.css'))
    .filter((f) => existsSync(f));
  assert.ok(files.length > 0, 'at least one theme has palettes');
  for (const f of files) {
    const css = stripComments(readFileSync(f, 'utf8'));
    assert.ok(css !== null, `${path.relative(THEMES, f)}: a comment is closed early or left open`);
    assert.match(css, /:root\s*\{[^}]*--c-[0-9a-f]{6}\s*:/, `${path.relative(THEMES, f)}: :root channel defaults`);
  }
});
