// Writes (or checks) a theme's editable-text manifest, theme.json "copy" (G068, docs/11 §3.7), from its templates:
// every data-copy / data-copy-attr / {copy.<key>} key with its default (the template's text) and pages; `max` kept from
// theme.json (else the catalogue's suggestion, lib/theme/copy.ts STANDARD_COPY). Also lists visible fixed text that has no
// key yet (allow list: lib/theme/copy-scan.ts COPY_ALLOW_SELECTORS).
//
//   node scripts/copy-manifest.ts --theme <id>           write theme.json "copy"
//   node scripts/copy-manifest.ts --theme <id> --check   exit 1 when theme.json is behind the templates or text is unmarked
//
// A key used only inside a {copy.…} template (e.g. share_invited in a meta description) needs its default written into
// theme.json once by hand; after that the script keeps it.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCopyManifest, type CopyManifest } from '../lib/theme/copy.ts';
import { buildCopyManifest, manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function arg(name: string): string | null {
  const i = process.argv.indexOf(name);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
}

const theme = arg('--theme');
if (!theme || !/^[a-z0-9_-]+$/.test(theme)) {
  console.error('usage: node scripts/copy-manifest.ts --theme <id> [--check]');
  process.exit(2);
}
const dir = path.join(process.env.PLATFORM_THEMES_DIR || path.join(ROOT, 'themes'), theme);
const file = path.join(dir, 'theme.json');
const json = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
const pages = Object.fromEntries(
  Object.entries((json.pages ?? {}) as Record<string, string>).map(([p, f]) => [p, readFileSync(path.join(dir, f), 'utf8')]),
);
const scan = scanCopy(pages);
const previous: CopyManifest = parseCopyManifest(json.copy ?? {}).manifest;

if (process.argv.includes('--check')) {
  const problems = manifestProblems(previous, scan);
  for (const u of scan.unmarked) problems.push(`unmarked text on ${u.page} ${u.where}: ${JSON.stringify(u.text)}`);
  if (problems.length) {
    console.error(`${theme}: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`${theme}: theme.json copy = templates (${Object.keys(previous).length} keys), no unmarked text`);
  process.exit(0);
}

const copy = buildCopyManifest(scan, previous);
// theme.json keeps its hand-written look: one line per photo place and per text
const inline = (v: unknown): string =>
  Array.isArray(v)
    ? `[${v.map(inline).join(', ')}]`
    : v && typeof v === 'object'
      ? `{ ${Object.entries(v as Record<string, unknown>).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')} }`
      : JSON.stringify(v);
const lines = (obj: Record<string, unknown>) =>
  Object.entries(obj)
    .map(([k, v]) => `    ${JSON.stringify(k)}: ${inline(v)}`)
    .join(',\n');
const out: string[] = [];
for (const [key, value] of Object.entries({ ...json, copy })) {
  if ((key === 'photos' || key === 'copy' || key === 'pages') && value && typeof value === 'object') {
    out.push(`  ${JSON.stringify(key)}: {\n${lines(value as Record<string, unknown>)}\n  }`);
  } else out.push(`  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
}
writeFileSync(file, `{\n${out.join(',\n')}\n}\n`);
console.log(`${theme}: wrote ${Object.keys(copy).length} copy keys to theme.json`);
for (const u of scan.unmarked) console.log(`  unmarked text on ${u.page} ${u.where}: ${JSON.stringify(u.text)}`);
