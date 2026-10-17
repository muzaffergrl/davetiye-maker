#!/usr/bin/env node
// G159: theme CSS/JS/images as static files (runs as `prebuild`, so `npm run build` — locally and on Vercel — does it).
//
// The asset route (/themes/<theme>/<path>, lib/site/static.ts) used to read every theme image from disk, so all of them
// were traced into ONE serverless function (~100 MB with 29 themes, growing ~7 MB per design with the G153 palettes;
// Vercel's limit is 250 MB). Now this step mirrors every file that route can serve into public/themes/, where Vercel's
// CDN serves it with no function at all; next.config.ts traces no theme asset into any function and trace-check.cjs
// fails the build when one does.
//
//   themes/<id>/<path>                     -> public/themes/<id>/<path>            (same URL: /themes/<id>/<path>)
//   themes/<id>/img/variants/<v>/<path>    -> public/themes/<id>/~<v>/img/<path>   (the variant's virtual folder, G153)
//
// A colour variant's page asks for /themes/<id>/~<v>/<path>: its own image is that public file; for everything else
// (CSS, JS, images without an override) next.config.ts rewrites to /themes/<id>/<path>?variant=<v> after the public
// files are checked — the original, still under the variant URL, so relative url(img/…) keep following the variant.
// img/variants/** is not mirrored at its own path (the route refuses that path too): no image is published twice.
//
// Same rules as the route: theme folders named like THEME_ID_RE, no dot files / dot folders, only THEME_ASSET_TYPES
// (templates, theme.json, README.md, build scripts stay private). Incremental: a file is copied when its size or mtime
// differs; files that are no longer servable are removed. public/themes/ is generated (git-ignored): never edit it.
//
//   node scripts/theme-assets.cjs           sync public/themes from themes/ (or $PLATFORM_THEMES_DIR)
//   node scripts/theme-assets.cjs --clean   remove public/themes (then the route serves everything from disk, as before)
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
/** Where the copies go, relative to the platform folder. Its URL is /themes/… (Next serves public/ at the root). */
const PUBLIC_THEMES = 'public/themes';
/** = THEME_ASSET_TYPES of lib/site/static.ts (tests compare them). */
const ASSET_EXTENSIONS = ['css', 'js', 'mjs', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'ico', 'mp4', 'webm'];
/** = lib/theme/theme.ts THEME_ID_RE and lib/theme/variants.ts VARIANT_ID_RE / VARIANT_SEGMENT_PREFIX / VARIANT_IMG_DIR. */
const THEME_ID_RE = /^[a-z0-9_][a-z0-9_-]{0,63}$/;
const VARIANT_ID_RE = /^[a-z][a-z0-9-]{0,31}$/;
const VARIANT_SEGMENT_PREFIX = '~';
const VARIANT_IMG_DIR = 'img/variants';

const ext = (file) => path.extname(file).slice(1).toLowerCase();

function defaultThemesDir() {
  return process.env.PLATFORM_THEMES_DIR || path.join(ROOT, 'themes');
}

/** Servable files of one theme folder (paths relative to it, "/"-separated). Symlinks only when they stay inside. */
function servableFiles(dir, rel = '', realRoot = fs.realpathSync(dir)) {
  const out = [];
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    let isDir = e.isDirectory();
    let isFile = e.isFile();
    if (e.isSymbolicLink()) {
      try {
        const real = fs.realpathSync(path.join(dir, r));
        if (!real.startsWith(realRoot + path.sep)) continue;
        const st = fs.statSync(real);
        isDir = st.isDirectory();
        isFile = st.isFile();
      } catch {
        continue;
      }
    }
    if (isDir) out.push(...servableFiles(dir, r, realRoot));
    else if (isFile && ASSET_EXTENSIONS.includes(ext(e.name))) out.push(r);
  }
  return out;
}

/**
 * Public path (relative to public/themes/<id>/) of a servable theme file: the file's own path, or for a variant image
 * img/variants/<v>/<x> the virtual folder ~<v>/img/<x>; null = not published (a variant folder with a bad id).
 */
function publicPathOf(rel) {
  if (!rel.startsWith(`${VARIANT_IMG_DIR}/`)) return rel;
  const [variant, ...rest] = rel.slice(VARIANT_IMG_DIR.length + 1).split('/');
  // ~<v>/img/variants/… is never an override (lib/theme/variants.ts variantOverridePath)
  if (!VARIANT_ID_RE.test(variant) || !rest.length || rest[0] === 'variants') return null;
  return `${VARIANT_SEGMENT_PREFIX}${variant}/img/${rest.join('/')}`;
}

/** Theme folder names the route would serve. */
function themeFolders(themesDir) {
  if (!fs.existsSync(themesDir)) return [];
  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((d) => (d.isDirectory() || d.isSymbolicLink()) && THEME_ID_RE.test(d.name))
    .filter((d) => {
      try {
        return fs.statSync(path.join(themesDir, d.name)).isDirectory();
      } catch {
        return false;
      }
    })
    .map((d) => d.name)
    .sort();
}

/** Map "<id>/<public path>" -> absolute source file, for every theme. */
function publicPlan(themesDir = defaultThemesDir()) {
  const plan = new Map();
  for (const id of themeFolders(themesDir)) {
    const dir = path.join(themesDir, id);
    for (const rel of servableFiles(dir)) {
      const dest = publicPathOf(rel);
      if (dest) plan.set(`${id}/${dest}`, path.join(dir, ...rel.split('/')));
    }
  }
  return plan;
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

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) removeEmptyDirs(path.join(dir, e.name));
  if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
}

/**
 * Makes <publicDir>/themes an exact mirror of the plan. Returns {files, bytes, copied, removed, ms}.
 * `clean`: remove the folder instead.
 */
function syncThemeAssets({ themesDir = defaultThemesDir(), publicDir = path.join(ROOT, 'public'), clean = false } = {}) {
  const t0 = Date.now();
  const out = path.join(publicDir, 'themes');
  if (clean) {
    const removed = listFiles(out).length;
    fs.rmSync(out, { recursive: true, force: true });
    return { files: 0, bytes: 0, copied: 0, removed, ms: Date.now() - t0 };
  }
  const plan = publicPlan(themesDir);
  let bytes = 0;
  let copied = 0;
  let removed = 0;
  for (const [dest, src] of plan) {
    const target = path.join(out, ...dest.split('/'));
    const s = fs.statSync(src);
    bytes += s.size;
    let same = false;
    try {
      const t = fs.statSync(target);
      // utimes keeps the time to about a millisecond (float seconds), so "same" allows 2 ms
      same = t.isFile() && t.size === s.size && Math.abs(t.mtimeMs - s.mtimeMs) < 2;
    } catch {
      /* not there yet */
    }
    if (same) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // copy + rename: a server reading the folder at the same time never sees half a file
    const tmp = `${target}.${process.pid}.tmp`;
    fs.copyFileSync(src, tmp, fs.constants.COPYFILE_FICLONE);
    fs.utimesSync(tmp, s.atime, s.mtime);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) fs.rmSync(target, { recursive: true, force: true });
    fs.renameSync(tmp, target);
    copied += 1;
  }
  for (const f of listFiles(out)) {
    if (!plan.has(f)) {
      fs.rmSync(path.join(out, ...f.split('/')), { force: true });
      removed += 1;
    }
  }
  removeEmptyDirs(out);
  return { files: plan.size, bytes, copied, removed, ms: Date.now() - t0 };
}

function main() {
  const clean = process.argv.includes('--clean');
  const r = syncThemeAssets({ clean });
  if (clean) console.log(`theme-assets: removed ${PUBLIC_THEMES}/ (${r.removed} files); /themes/… is served from themes/ by the asset route.`);
  else {
    console.log(
      `theme-assets: ${PUBLIC_THEMES}/ mirrors ${r.files} servable theme files (${(r.bytes / 1048576).toFixed(1)} MB): ` +
        `${r.copied} copied, ${r.removed} removed, ${r.ms} ms.`,
    );
  }
}

if (require.main === module) main();

module.exports = {
  PUBLIC_THEMES,
  ASSET_EXTENSIONS,
  THEME_ID_RE,
  VARIANT_ID_RE,
  VARIANT_SEGMENT_PREFIX,
  VARIANT_IMG_DIR,
  servableFiles,
  publicPathOf,
  publicPlan,
  syncThemeAssets,
};
