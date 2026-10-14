// G080: the sales site names the panel's replies download by its real label ("Download list", Guests view), not the
// old RSVP section's "Download all replies (CSV)".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { PANEL_REPLIES_DOWNLOAD, REPLIES_SCREEN_ALT } from '../lib/marketing/facts.ts';
import { PLATFORM_ROOT } from './helpers.ts';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|md|json)$/.test(name) ? [p] : [];
  });
}

test('the label in facts.ts is the panel button\'s own label', () => {
  const guests = readFileSync(path.join(PLATFORM_ROOT, 'components/panel/guests.tsx'), 'utf8');
  assert.ok(guests.includes(`<span>${PANEL_REPLIES_DOWNLOAD}</span>`), 'components/panel/guests.tsx no longer shows this label');
  assert.ok(REPLIES_SCREEN_ALT.includes(`"${PANEL_REPLIES_DOWNLOAD}"`));
});

test('no sales-site source still uses the old button name', () => {
  const roots = ['app/(marketing)', 'components/marketing', 'lib/marketing', 'content'].map((r) => path.join(PLATFORM_ROOT, r));
  const hits = roots.flatMap(files).filter((f) => /Download all replies/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(hits.map((f) => path.relative(PLATFORM_ROOT, f)), []);
});
