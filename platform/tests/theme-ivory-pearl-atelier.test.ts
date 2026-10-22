import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadTheme, readThemePage } from '../lib/theme/theme.ts';
import { validateContent } from '../lib/content/validate.ts';
import { themeOpenForClaims } from '../lib/themes/approval.ts';
import { DESIGN_COPY } from '../lib/marketing/designs.ts';
import { printLayout } from '../lib/print/layouts.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';

const id = 'ivory-pearl-atelier';
const dir = path.resolve('themes', id);
const content = JSON.parse(readFileSync(path.join(dir, 'content.demo.json'), 'utf8'));

test('Ivory Pearl: all five editable pages render the demo and their local assets exist', async () => {
  assert.equal(validateContent(content).ok, true);
  const t = await loadTheme(id);
  assert.ok(t);
  assert.equal(DESIGN_COPY[id].demoCouple, content.name_display);
  assert.equal(themeOpenForClaims(id, { env: { VERCEL_ENV: 'production' } }), true);
  for (const page of ['index', 'home', 'story', 'details', 'rsvp'] as const) {
    const source = await readThemePage(t, page);
    assert.ok(source);
    for (const m of source.matchAll(/(?:src|href)="(img\/[^"?]+)"/g)) {
      assert.ok(existsSync(path.join(dir, m[1])), `${page}: ${m[1]}`);
    }
  }
  assert.equal(Object.keys(t.manifest.photos).length, 5);
  assert.ok(printLayout(id), 'panel downloads have a print layout');
  assert.equal(t.share.ogImage, 'img/og-1200x630.jpg');
});

test('Ivory Pearl: actual content changes persist independently of demo data', async () => {
  const adapter = new LocalAdapter(mkdtempSync(path.join(os.tmpdir(), 'ivory-pearl-test-')));
  const own = structuredClone(content);
  own.partners[0].display_name = 'Amelia';
  own.name_display = `Amelia & ${own.partners[1].display_name}`;
  const created = await createSiteWithKeys(adapter, { slug: 'ivory-pearl-test', theme: id, content: own });
  await publishSite(adapter, created.site.id);
  const saved = await adapter.getSiteBySlug('ivory-pearl-test');
  assert.ok(saved);
  assert.equal(saved.content.partners[0].display_name, 'Amelia');
  assert.equal(content.partners[0].display_name, 'Clara', 'demo record is never overwritten');
});

test('Ivory Pearl: the new animation has a single shared envelope footprint and reduced-motion support', () => {
  const manifest = JSON.parse(readFileSync(path.join(dir, 'img/manifest.json'), 'utf8'));
  const css = readFileSync(path.join(dir, 'site.css'), 'utf8');
  for (const name of ['closed', 'inside', 'pocket', 'flap', 'flap-inside']) {
    assert.deepEqual([manifest.files[`${name}-960.webp`].width, manifest.files[`${name}-960.webp`].height], [960, 538]);
  }
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /pearl-orbit/);
  assert.match(css, /silk-left/);
  assert.match(css, /letter-arc/);
  assert.doesNotMatch(readFileSync(path.join(dir, 'site.js'), 'utf8'), /function flashes|function particles|layoutStrip/);
});
