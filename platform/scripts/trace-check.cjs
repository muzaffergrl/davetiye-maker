#!/usr/bin/env node
// Post-build check (runs as `postbuild`): every server bundle that reads theme templates from disk
// must have them traced (next.config.ts outputFileTracingIncludes). Without that, a route works with
// `next start` (the files are on disk) but 404s / 500s on Vercel, where only traced files exist.
//
// For each route below, its .next/server/app/**/<route|page>.js.nft.json must list
// themes/<id>/index.html for every theme folder. Exit 1 with a list of what is missing.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, '.next', 'server', 'app');

/** Route folders (under app/) whose handlers or pages read theme files. */
const ROUTES = [
  '[slug]/route',
  '[slug]/[page]/route',
  'themes/[theme]/[...path]/route',
  'edit/[slug]/page',
  'api/edit/[slug]/route',
  'api/edit/[slug]/photo/route',
  'api/edit/[slug]/publish/route',
  'api/edit/[slug]/unpublish/route',
  'api/rsvp/[slug]/route',
  'api/rsvp/[slug]/export/route',
  'api/rsvp/[slug]/responses/route',
  'start/page',
  'start/demo/[theme]/route',
  'start/demo/[theme]/[page]/route',
  'start/demo/[theme]/event.ics/route',
  'api/start/route',
  'api/start/slug/route',
];

if (!fs.existsSync(APP)) {
  console.error('trace-check: no build output (.next/server/app); run `next build` first.');
  process.exit(2);
}

const themes = fs
  .readdirSync(path.join(ROOT, 'themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'themes', d.name, 'index.html')))
  .map((d) => d.name);

const problems = [];
for (const route of ROUTES) {
  const nft = path.join(APP, `${route}.js.nft.json`);
  if (!fs.existsSync(nft)) {
    problems.push(`${route}: no trace file (${path.relative(ROOT, nft)})`);
    continue;
  }
  const files = JSON.parse(fs.readFileSync(nft, 'utf8')).files.map((f) => path.resolve(path.dirname(nft), f));
  for (const theme of themes) {
    const want = path.join(ROOT, 'themes', theme, 'index.html');
    if (!files.includes(want)) problems.push(`${route}: themes/${theme}/index.html is not traced`);
  }
}

if (problems.length) {
  console.error(`trace-check: ${problems.length} problem(s) — add the route to outputFileTracingIncludes in next.config.ts:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`trace-check: ${ROUTES.length} routes trace the templates of ${themes.length} themes (${themes.join(', ')}).`);
