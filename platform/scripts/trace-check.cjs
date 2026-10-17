#!/usr/bin/env node
// Post-build check (runs as `postbuild`): what each server bundle carries from platform/themes/, and how big it is.
// Without the right tracing (next.config.ts outputFileTracingIncludes) a route works with
// `next start` (the files are on disk) but 404s / 500s on Vercel, where only traced files exist.
//
// For every theme folder (one with index.html) it checks, in .next/server/app/**/<route>.js.nft.json:
//  1. Each theme-reading route (ROUTES) traces themes/<id>/index.html (templates are there).
//  2. Those routes trace NOTHING from themes/ but *.html and *.json (G055, docs/11 §14 #7).
//  3. G159: no other function traces a theme asset either (CSS/JS/images of themes/, anything of public/themes/): they
//     are static files. Before G159 the asset route traced all of them (~100 MB, growing ~7 MB per design's palettes).
//  4. G159: every file the asset route would serve (ASSET_EXTENSIONS = THEME_ASSET_TYPES of lib/site/static.ts) has its
//     static copy in public/themes/ (scripts/theme-assets.cjs, `prebuild`): same path — a variant image
//     img/variants/<v>/<x> at ~<v>/img/<x> — and same size; nothing else is in there.
//  5. Share image / tab icon (lib/theme/share.ts): when img/og-1200x630.jpg or img/favicon.png is on disk, each
//     theme-reading route must "see" it the way the engine decides on Vercel: the file itself or a traced
//     img/manifest.json naming it ("og": {"file": …}, "favicon": {"file": …}). A manifest that names a missing
//     file is a problem too (the page would point at a 404).
//  6. G159 budgets, for EVERY function (.next/server/**/*.nft.json + its own .js): at most THEME_BUDGET_MB of theme
//     files (themes/ + public/themes/), at most FUNCTION_BUDGET_MB in all (node_modules included; Vercel's limit is
//     250 MB unzipped). The largest functions are printed.
// Exit 1 with a list of problems. `require()` gives the lists and checkTraces() (tests/g055-share-tracing.test.ts,
// tests/g159-static-themes.test.ts).
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { ASSET_EXTENSIONS, PUBLIC_THEMES, publicPlan } = require('./theme-assets.cjs');

const ROOT = path.resolve(__dirname, '..');

/** Route files (under app/) whose handlers or pages read theme templates / JSON. Same set as next.config.ts THEME_ROUTES. */
const ROUTES = [
  '[slug]/route',
  '[slug]/[page]/route',
  'edit/[slug]/page',
  'api/edit/[slug]/route',
  'api/edit/[slug]/photo/route',
  'api/edit/[slug]/publish/route',
  'api/edit/[slug]/unpublish/route',
  'api/edit/[slug]/variant/route',
  'api/edit/[slug]/download/route',
  'api/rsvp/[slug]/route',
  'api/rsvp/[slug]/export/route',
  'api/rsvp/[slug]/responses/route',
  'start/page',
  'my/page',
  'start/demo/[theme]/route',
  'start/demo/[theme]/[page]/route',
  'start/demo/[theme]/event.ics/route',
  'api/start/route',
  'api/start/slug/route',
];

/** The route that serves theme files without a static copy (/themes/<theme>/<path>). */
const ASSET_ROUTE = 'themes/[theme]/[...path]/route';
/** The only theme files a theme-reading route may carry. */
const TEMPLATE_EXTENSIONS = ['html', 'json'];
/** lib/theme/share.ts: file -> key of img/manifest.json that records it. */
const SHARE_FILES = { 'img/og-1200x630.jpg': 'og', 'img/favicon.png': 'favicon' };
const MANIFEST_FILE = 'img/manifest.json';
/** G159: theme files (themes/ + public/themes/) one function may carry. Today ~2.5 MB of templates/JSON per route. */
const THEME_BUDGET_MB = 40;
/** G159: everything one function may carry (Vercel: 250 MB unzipped; the PDF route with Chromium is the largest). */
const FUNCTION_BUDGET_MB = 200;
const MB = 1024 * 1024;

const ext = (file) => path.extname(file).slice(1).toLowerCase();
const mb = (bytes) => (bytes / MB).toFixed(1);

function themeIds(themesDir) {
  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(themesDir, d.name, 'index.html')))
    .map((d) => d.name)
    .sort();
}

/** Absolute paths listed by a trace file. */
function readNft(nft) {
  return new Set(JSON.parse(fs.readFileSync(nft, 'utf8')).files.map((f) => path.resolve(path.dirname(nft), f)));
}

/** Absolute paths listed by a route's .nft.json; null when the trace file is missing. */
function readTrace(appDir, route) {
  const nft = path.join(appDir, `${route}.js.nft.json`);
  return fs.existsSync(nft) ? readNft(nft) : null;
}

/** Every .nft.json under dir (one per server function). */
function nftFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...nftFiles(p));
    else if (e.name.endsWith('.nft.json')) out.push(p);
  }
  return out.sort();
}

function readManifest(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function sizeOf(files) {
  let bytes = 0;
  for (const f of files) {
    try {
      const st = fs.statSync(f);
      if (st.isFile()) bytes += st.size;
    } catch {
      /* listed but gone: not counted */
    }
  }
  return bytes;
}

function listFiles(dir, rel = '') {
  if (!fs.existsSync(path.join(dir, rel))) return [];
  const out = [];
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(dir, r));
    else out.push(r);
  }
  return out;
}

const some = (list, n = 4) => `${list.slice(0, n).join(', ')}${list.length > n ? ', …' : ''}`;

/**
 * Runs checks 1–6. `root` = platform folder (themes/ and public/ in it, unless `themesDir` / `publicDir`),
 * `appDir` = .next/server/app (every function is looked for in its parent, .next/server).
 * Returns {problems, themes, routeThemeBytes: {route: bytes}, assetFiles, assetBytes, functions: [{name, bytes, themeBytes}]}
 * (functions largest first).
 */
function checkTraces({
  root = ROOT,
  appDir = path.join(root, '.next', 'server', 'app'),
  themesDir = path.join(root, 'themes'),
  publicDir = path.join(root, 'public'),
  themeBudgetMb = THEME_BUDGET_MB,
  functionBudgetMb = FUNCTION_BUDGET_MB,
} = {}) {
  const problems = [];
  const themes = themeIds(themesDir);
  const publicThemes = path.join(publicDir, 'themes');
  const inThemes = (f) => f.startsWith(themesDir + path.sep);
  const inPublicThemes = (f) => f.startsWith(publicThemes + path.sep);
  const isThemeAsset = (f) => (inThemes(f) && ASSET_EXTENSIONS.includes(ext(f))) || inPublicThemes(f);
  const rel = (f) => (inThemes(f) ? path.relative(themesDir, f) : path.relative(root, f)).split(path.sep).join('/');
  const routeThemeBytes = {};

  // Share files on disk and what each theme's manifest names.
  const share = themes.map((id) => {
    const dir = path.join(themesDir, id);
    const manifest = readManifest(path.join(dir, MANIFEST_FILE));
    const files = Object.entries(SHARE_FILES).map(([file, key]) => {
      const declared = manifest && manifest[key] && typeof manifest[key].file === 'string' ? manifest[key].file : null;
      const onDisk = fs.existsSync(path.join(dir, file));
      if (declared === path.posix.basename(file) && !onDisk) {
        problems.push(`themes/${id}/${MANIFEST_FILE} names ${declared} ("${key}"), but themes/${id}/${file} does not exist`);
      }
      return { file, key, onDisk, declared: declared === path.posix.basename(file) };
    });
    return { id, dir, files };
  });

  // 1, 2, 5: theme-reading routes
  for (const route of ROUTES) {
    const traced = readTrace(appDir, route);
    if (!traced) {
      problems.push(`${route}: no trace file (${path.relative(root, path.join(appDir, `${route}.js.nft.json`))})`);
      continue;
    }
    const themeTraced = [...traced].filter((f) => inThemes(f) || inPublicThemes(f));
    routeThemeBytes[route] = sizeOf(themeTraced);
    for (const id of themes) {
      if (!traced.has(path.join(themesDir, id, 'index.html'))) problems.push(`${route}: themes/${id}/index.html is not traced`);
    }
    const extra = themeTraced.filter((f) => inPublicThemes(f) || !TEMPLATE_EXTENSIONS.includes(ext(f)));
    if (extra.length) {
      problems.push(`${route}: carries ${extra.length} theme file(s) other than *.html/*.json (${some(extra.map(rel))}) — theme CSS/JS/images are static files (public/themes), in no function`);
    }
    for (const t of share) {
      const manifestTraced = traced.has(path.join(t.dir, MANIFEST_FILE));
      for (const f of t.files) {
        if (!f.onDisk) continue;
        const seen = traced.has(path.join(t.dir, f.file)) || (manifestTraced && f.declared);
        if (!seen) {
          problems.push(
            `${route}: themes/${t.id}/${f.file} exists but this route cannot see it (needs a traced ${MANIFEST_FILE} with "${f.key}": {"file": "${path.posix.basename(f.file)}"}) — no ${f.key === 'og' ? 'og:image' : 'icon'} tag would be written on Vercel`,
          );
        }
      }
    }
  }
  if (!fs.existsSync(path.join(appDir, `${ASSET_ROUTE}.js.nft.json`))) problems.push(`${ASSET_ROUTE}: no trace file`);

  // 3, 6: every function — theme assets, budgets, sizes
  const serverDir = path.dirname(appDir);
  const routeFiles = new Set(ROUTES.map((r) => path.join(appDir, `${r}.js.nft.json`)));
  const functions = [];
  for (const nft of nftFiles(serverDir)) {
    const name = path.relative(serverDir, nft).split(path.sep).join('/').replace(/\.nft\.json$/, '').replace(/\.js$/, '');
    const traced = readNft(nft);
    const own = nft.replace(/\.nft\.json$/, '');
    if (fs.existsSync(own)) traced.add(own);
    const files = [...traced];
    const themeBytes = sizeOf(files.filter((f) => inThemes(f) || inPublicThemes(f)));
    const bytes = sizeOf(files);
    functions.push({ name, bytes, themeBytes });
    if (!routeFiles.has(nft)) {
      const assets = files.filter(isThemeAsset);
      if (assets.length) {
        problems.push(`${name}: carries ${assets.length} theme asset file(s) (${some(assets.map(rel))}) — theme CSS/JS/images are static files (public/themes), in no function (next.config.ts THEME_ASSET_EXCLUDES)`);
      }
    }
    if (themeBytes > themeBudgetMb * MB) problems.push(`${name}: ${mb(themeBytes)} MB of theme files — over the budget of ${themeBudgetMb} MB per function`);
    if (bytes > functionBudgetMb * MB) problems.push(`${name}: ${mb(bytes)} MB in all — over the budget of ${functionBudgetMb} MB per function (Vercel: 250 MB unzipped)`);
  }
  functions.sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name));

  // 4: the static copies
  const plan = publicPlan(themesDir);
  let assetFiles = 0;
  let assetBytes = 0;
  const missing = [];
  const differ = [];
  for (const [dest, src] of plan) {
    const copy = path.join(publicThemes, ...dest.split('/'));
    let size = -1;
    try {
      size = fs.statSync(copy).size;
    } catch {
      missing.push(dest);
      continue;
    }
    const want = fs.statSync(src).size;
    if (size !== want) differ.push(dest);
    else {
      assetFiles += 1;
      assetBytes += size;
    }
  }
  const stray = listFiles(publicThemes).filter((f) => !plan.has(f));
  const run = 'run `node scripts/theme-assets.cjs` (`npm run build` does it first)';
  if (missing.length) problems.push(`${PUBLIC_THEMES}: ${missing.length} servable theme file(s) have no static copy (${some(missing)}) — they would 404 on Vercel; ${run}`);
  if (differ.length) problems.push(`${PUBLIC_THEMES}: ${differ.length} static cop(ies) differ from themes/ (${some(differ)}); ${run}`);
  if (stray.length) problems.push(`${PUBLIC_THEMES}: ${stray.length} file(s) that are not servable theme files (${some(stray)}) — the folder is generated, never edited; ${run}`);

  return { problems, themes, routeThemeBytes, assetFiles, assetBytes, functions };
}

function main() {
  const appDir = path.join(ROOT, '.next', 'server', 'app');
  if (!fs.existsSync(appDir)) {
    console.error('trace-check: no build output (.next/server/app); run `next build` first.');
    process.exit(2);
  }
  const r = checkTraces({ root: ROOT, appDir });
  const largest = r.functions
    .slice(0, 6)
    .map((f) => `${f.name} ${mb(f.bytes)} MB`)
    .join(', ');
  if (r.problems.length) {
    console.error(`trace-check: ${r.problems.length} problem(s) — see next.config.ts outputFileTracingIncludes / Excludes:`);
    for (const p of r.problems) console.error(`  - ${p}`);
    console.error(`trace-check: largest functions: ${largest}`);
    process.exit(1);
  }
  const maxRoute = Math.max(0, ...Object.values(r.routeThemeBytes));
  const maxTheme = Math.max(0, ...r.functions.map((f) => f.themeBytes));
  console.log(
    `trace-check: ${ROUTES.length} routes trace the templates of ${r.themes.length} themes (${r.themes.join(', ')}), ` +
      `*.html/*.json only (at most ${Math.round(maxRoute / 1024)} KB of theme files per route); ` +
      `no function carries a theme asset — all ${r.assetFiles} servable theme files (${mb(r.assetBytes)} MB) are static copies in ${PUBLIC_THEMES}/.`,
  );
  console.log(
    `trace-check: ${r.functions.length} functions; budgets per function: theme files ${mb(maxTheme)} / ${THEME_BUDGET_MB} MB, ` +
      `total ${mb(r.functions[0]?.bytes ?? 0)} / ${FUNCTION_BUDGET_MB} MB. Largest: ${largest}.`,
  );
}

if (require.main === module) main();

module.exports = {
  ROUTES,
  ASSET_ROUTE,
  ASSET_EXTENSIONS,
  TEMPLATE_EXTENSIONS,
  SHARE_FILES,
  MANIFEST_FILE,
  THEME_BUDGET_MB,
  FUNCTION_BUDGET_MB,
  checkTraces,
};
