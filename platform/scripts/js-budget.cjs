#!/usr/bin/env node
// Post-build check (G173, runs as `postbuild` after trace-check): the first-load JavaScript of every page route, gzip,
// against a budget per route group. A route's JS = the build's rootMainFiles (Next + React runtime) + every chunk its
// page_client-reference-manifest.js lists in entryJSFiles (its layouts, page, boundaries). The legacy polyfill file is
// left out (`noModule`: modern browsers never download it). Sizes are gzip level 6 (what `next start` and Vercel send,
// within a few %); the lab transfer in tests/g173-browser.ts is the same number plus headers.
//
// Budgets: docs/14 §9.8 asks ≤ 130 KB for the sales site; the Next 16 + React 19 runtime alone is ~125 KB of it, so the
// sales pages were already at ~144 KB (G061, G141, G173). The budgets below are that measured state plus a small margin:
// they stop the next regression (a heavy client component, an icon set, a library in a layout) rather than bless it.
// Exit 1 with the routes over budget. `require()` gives routeJs() / checkBudgets() (tests/g173-js-budget.test.ts).
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.resolve(__dirname, '..');

/** [route prefix (app path of the page, without route groups), KB gzip]; the first match wins. */
const BUDGETS = [
  ['/edit/', 205], // the buyer's editor: the shell + runtime; each view is its own chunk (G173: 256 KB in one; G181 split: 188 KB)
  ['/admin', 175], // G173: 139–161 KB
  ['/start', 160], // claim form + palette picker (G173: 146 KB)
  ['/', 155], // sales site in every language, /my, /signin (G173: 132–144 KB)
];

function budgetFor(route) {
  for (const [prefix, kb] of BUDGETS) if (route === prefix.replace(/\/$/, '') || route.startsWith(prefix)) return kb;
  return BUDGETS[BUDGETS.length - 1][1];
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'page_client-reference-manifest.js') out.push(p);
  }
  return out;
}

/** The manifest's own object (it is a script that assigns globalThis.__RSC_MANIFEST[route]). */
function readManifest(file) {
  const g = { __RSC_MANIFEST: {} };
  new Function('globalThis', fs.readFileSync(file, 'utf8'))(g);
  const [key] = Object.keys(g.__RSC_MANIFEST);
  return { key, manifest: g.__RSC_MANIFEST[key] };
}

/** "/(marketing)/(en)/designs/[design]/page" → "/designs/[design]" */
function routeOf(key) {
  const r = key.replace(/\/page$/, '').split('/').filter((s) => s && !/^\(.*\)$/.test(s)).join('/');
  return '/' + r;
}

const gzCache = new Map();
function gzipKB(file) {
  if (!gzCache.has(file)) gzCache.set(file, zlib.gzipSync(fs.readFileSync(file), { level: 6 }).length / 1024);
  return gzCache.get(file);
}

/** [{ route, files, kb, budget }] for every page route of the build in `nextDir`. */
function routeJs(nextDir = path.join(ROOT, '.next')) {
  const build = JSON.parse(fs.readFileSync(path.join(nextDir, 'build-manifest.json'), 'utf8'));
  const root = build.rootMainFiles || [];
  const out = [];
  for (const file of walk(path.join(nextDir, 'server/app'))) {
    const { key, manifest } = readManifest(file);
    const files = new Set(root);
    for (const list of Object.values(manifest.entryJSFiles || {})) for (const f of list) files.add(f.replace(/^\//, '').replace(/^_next\//, ''));
    for (const f of build.polyfillFiles || []) files.delete(f);
    const kb = [...files].reduce((a, f) => a + gzipKB(path.join(nextDir, f)), 0);
    const route = routeOf(key);
    out.push({ route, files: [...files], kb: Math.round(kb * 10) / 10, budget: budgetFor(route) });
  }
  return out.sort((a, b) => b.kb - a.kb);
}

function checkBudgets(nextDir) {
  const rows = routeJs(nextDir);
  return { rows, problems: rows.filter((r) => r.kb > r.budget).map((r) => `${r.route}: ${r.kb} KB gzip first-load JS > budget ${r.budget} KB`) };
}

module.exports = { BUDGETS, budgetFor, routeOf, routeJs, checkBudgets };

if (require.main === module) {
  const { rows, problems } = checkBudgets();
  if (!rows.length) {
    console.error('js-budget: no page_client-reference-manifest.js under .next/server/app — run `next build` first');
    process.exit(1);
  }
  const top = rows.slice(0, 6).map((r) => `${r.route} ${r.kb}/${r.budget}`).join(', ');
  if (problems.length) {
    console.error(`js-budget: ${problems.length} route(s) over their first-load JS budget (gzip):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`js-budget: ${rows.length} page routes within their first-load JS budget (gzip KB, largest: ${top}).`);
}
