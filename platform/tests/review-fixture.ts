// G085: a design in review for the /start gate tests (G080). Since 04 went live every real theme is approved, so the
// gate's "in review" path is tested with a fixture: a themes folder holding every real theme (symlinked, nothing
// copied) plus REVIEW_FIXTURE_ID — the internal _sample scaffolding made buyer-facing, with a valid demo record — which
// the sales site does not list, so it is in review (lib/themes/approval.ts). Point PLATFORM_THEMES_DIR at it (unit
// tests: process.env; browser tests: the next start env). Not a test file itself (no .test.ts).
import { cpSync, mkdtempSync, readdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLATFORM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REVIEW_FIXTURE_ID = 'in-review-fixture';
export const REVIEW_FIXTURE_NAME = 'In Review Fixture';

/** Builds the folder in the system temp dir and returns its path (the caller may delete it). */
export function reviewFixtureThemesDir(): string {
  const real = path.join(PLATFORM, 'themes');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'review-fixture-themes-'));
  for (const d of readdirSync(real, { withFileTypes: true })) {
    if (d.isDirectory()) symlinkSync(path.join(real, d.name), path.join(dir, d.name), 'dir');
  }
  const own = path.join(dir, REVIEW_FIXTURE_ID);
  cpSync(path.join(real, '_sample'), own, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(own, 'theme.json'), 'utf8')) as Record<string, unknown>;
  delete manifest.internal;
  writeFileSync(path.join(own, 'theme.json'), JSON.stringify({ ...manifest, id: REVIEW_FIXTURE_ID, name: REVIEW_FIXTURE_NAME }, null, 2) + '\n');
  // a valid demo record (fictional, record_kind "demo"): the one design 01 ships with
  cpSync(path.join(real, 'olive-ivory', 'content.demo.json'), path.join(own, 'content.demo.json'));
  return dir;
}
