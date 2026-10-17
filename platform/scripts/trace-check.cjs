#!/usr/bin/env node
// Post-build check (runs as `postbuild`): what each server bundle carries from platform/themes/.
// Without the right tracing (next.config.ts outputFileTracingIncludes) a route works with
// `next start` (the files are on disk) but 404s / 500s on Vercel, where only traced files exist.
//
// For every theme folder (one with index.html) it checks, in .next/server/app/**/<route>.js.nft.json:
//  1. Each theme-reading route (ROUTES) traces themes/<id>/index.html (templates are there).
//  2. Those routes trace NOTHING from themes/ but *.html and *.json (G055, docs/11 §14 #7): theme images,
//     CSS and JS belong to the theme asset route only (20 themes x ~2.9 MB would otherwise go into every function).
//  3. The theme asset route (ASSET_ROUTE) traces every file it can serve (ASSET_EXTENSIONS = THEME_ASSET_TYPES
//     of lib/site/static.ts) — share image and icon included.
//  4. Share image / tab icon (lib/theme/share.ts): when img/og-1200x630.jpg or img/favicon.png is on disk, each
//     theme-reading route must "see" it the way the engine decides on Vercel: the file itself or a traced
//     img/manifest.json naming it ("og": {"file": …}, "favicon": {"file": …}). A manifest that names a missing
//     file is a problem too (the page would point at a 404).
// Exit 1 with a list of problems. `require()` gives the lists and checkTraces() (tests/g055-tracing.test.ts).
'use strict';
const fs = require('node:fs');
const path = require('node:path');

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

/** The route that serves theme CSS/JS/images (/themes/<theme>/<path>). */
const ASSET_ROUTE = 'themes/[theme]/[...path]/route';
/** What the asset route serves (lib/site/static.ts THEME_ASSET_TYPES; next.config.ts THEME_ASSET_EXTENSIONS). */
const ASSET_EXTENSIONS = ['css', 'js', 'mjs', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'ico', 'mp4', 'webm'];
/** The only theme files a theme-reading route may carry. */
const TEMPLATE_EXTENSIONS = ['html', 'json'];
/** lib/theme/share.ts: file -> key of img/manifest.json that records it. */
const SHARE_FILES = { 'img/og-1200x630.jpg': 'og', 'img/favicon.png': 'favicon' };
const MANIFEST_FILE = 'img/manifest.json';

const ext = (file) => path.extname(file).slice(1).toLowerCase();

function themeIds(themesDir) {
  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(themesDir, d.name, 'index.html')))
    .map((d) => d.name)
    .sort();
}

/** Files of a theme folder the asset route would serve (no dot files / dot folders: the route refuses them). */
function servableFiles(dir, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...servableFiles(dir, r));
    else if (e.isFile() && ASSET_EXTENSIONS.includes(ext(e.name))) out.push(r);
  }
  return out;
}

/** Absolute paths listed by a route's .nft.json; null when the trace file is missing. */
function readTrace(appDir, route) {
  const nft = path.join(appDir, `${route}.js.nft.json`);
  if (!fs.existsSync(nft)) return null;
  return new Set(JSON.parse(fs.readFileSync(nft, 'utf8')).files.map((f) => path.resolve(path.dirname(nft), f)));
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
      bytes += fs.statSync(f).size;
    } catch {
      /* listed but gone: not counted */
    }
  }
  return bytes;
}

/**
 * Runs checks 1–4. `root` = platform folder (themes/ in it, unless `themesDir`), `appDir` = .next/server/app.
 * Returns {problems: string[], themes, routeThemeBytes: {route: bytes}, assetFiles, assetBytes}.
 */
function checkTraces({ root = ROOT, appDir = path.join(root, '.next', 'server', 'app'), themesDir = path.join(root, 'themes') } = {}) {
  const problems = [];
  const themes = themeIds(themesDir);
  const inThemes = (f) => f.startsWith(themesDir + path.sep);
  const rel = (f) => path.relative(themesDir, f).split(path.sep).join('/');
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

  for (const route of ROUTES) {
    const traced = readTrace(appDir, route);
    if (!traced) {
      problems.push(`${route}: no trace file (${path.relative(root, path.join(appDir, `${route}.js.nft.json`))})`);
      continue;
    }
    const themeTraced = [...traced].filter(inThemes);
    routeThemeBytes[route] = sizeOf(themeTraced);
    for (const id of themes) {
      if (!traced.has(path.join(themesDir, id, 'index.html'))) problems.push(`${route}: themes/${id}/index.html is not traced`);
    }
    const extra = themeTraced.filter((f) => !TEMPLATE_EXTENSIONS.includes(ext(f)));
    if (extra.length) {
      const shown = extra.slice(0, 4).map(rel).join(', ');
      problems.push(`${route}: carries ${extra.length} theme file(s) other than *.html/*.json (${shown}${extra.length > 4 ? ', …' : ''}) — images/CSS/JS belong to the asset route only`);
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

  let assetFiles = 0;
  let assetBytes = 0;
  const assetTraced = readTrace(appDir, ASSET_ROUTE);
  if (!assetTraced) {
    problems.push(`${ASSET_ROUTE}: no trace file`);
  } else {
    for (const id of themes) {
      const dir = path.join(themesDir, id);
      for (const file of servableFiles(dir)) {
        const abs = path.join(dir, ...file.split('/'));
        if (!assetTraced.has(abs)) problems.push(`${ASSET_ROUTE}: themes/${id}/${file} is not traced (it would 404 on Vercel)`);
        else {
          assetFiles += 1;
          assetBytes += fs.statSync(abs).size;
        }
      }
    }
  }
  return { problems, themes, routeThemeBytes, assetFiles, assetBytes };
}

function main() {
  const appDir = path.join(ROOT, '.next', 'server', 'app');
  if (!fs.existsSync(appDir)) {
    console.error('trace-check: no build output (.next/server/app); run `next build` first.');
    process.exit(2);
  }
  const r = checkTraces({ root: ROOT, appDir });
  if (r.problems.length) {
    console.error(`trace-check: ${r.problems.length} problem(s) — see next.config.ts outputFileTracingIncludes:`);
    for (const p of r.problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  const maxRoute = Math.max(0, ...Object.values(r.routeThemeBytes));
  console.log(
    `trace-check: ${ROUTES.length} routes trace the templates of ${r.themes.length} themes (${r.themes.join(', ')}), ` +
      `*.html/*.json only (at most ${Math.round(maxRoute / 1024)} KB of theme files per route); ` +
      `the asset route traces all ${r.assetFiles} servable theme files (${Math.round(r.assetBytes / 1024)} KB).`,
  );
}

if (require.main === module) main();

module.exports = { ROUTES, ASSET_ROUTE, ASSET_EXTENSIONS, TEMPLATE_EXTENSIONS, SHARE_FILES, MANIFEST_FILE, checkTraces };
