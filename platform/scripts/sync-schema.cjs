#!/usr/bin/env node
// Regenerates lib/content/schema.ts from the repo's single content schema
// (docs/03_URUN_ICERIK_SEMASI.json). Run from platform/: node scripts/sync-schema.cjs
const fs = require('node:fs');
const path = require('node:path');

const src = path.resolve(__dirname, '../../docs/03_URUN_ICERIK_SEMASI.json');
const dest = path.resolve(__dirname, '../lib/content/schema.ts');
const schema = JSON.parse(fs.readFileSync(src, 'utf8'));
const out =
  '// Verbatim copy of docs/03_URUN_ICERIK_SEMASI.json (the single content schema).\n' +
  '// Do not edit by hand: tests/content.test.ts fails when this copy drifts from the docs file.\n' +
  '// Regenerate: node scripts/sync-schema.cjs\n\n' +
  'export const CONTENT_SCHEMA = ' +
  JSON.stringify(schema, null, 2) +
  ' as const;\n';
fs.writeFileSync(dest, out);
console.log(`wrote ${path.relative(process.cwd(), dest)}`);
