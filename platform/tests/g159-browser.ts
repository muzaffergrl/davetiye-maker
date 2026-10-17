// G159 on a production build (`next start`): theme CSS/JS/images come from their static copies (public/themes,
// scripts/theme-assets.cjs) — no function — and the asset route answers only what has no copy. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g159-browser.ts
//
// 1. HTTP, static copies: CSS / JS / images of 3 themes (200, type, the route's Cache-Control, nosniff, bytes = themes/),
//    a palette's virtual folder (its own image = img/variants/<v>/x, any other file = the original, under the variant
//    URL), the SVG CSP, and 404s (templates, theme.json, README/scripts, unknown file / theme, img/variants/… directly).
// 2. Chromium at 390 x 844: demos of 3 themes (envelope + home) and 2 palettes (envelope, home, details): no failed
//    request of this server, no console error, no broken image; html[data-variant]; a palette's own images arrive.
// 3. Without public/themes (`next dev`, a test's own themes folder): the asset route serves from disk and a palette URL
//    still gets its override (next.config.ts rewrite + route). The copies are restored afterwards.
// Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`). Screenshots + checks.json ->
// $G159_SHOTS_DIR (default: a new temporary folder, printed at the end). Exit code 1 on a failed check.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer, type NextServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const themeAssets = require('../scripts/theme-assets.cjs') as {
  syncThemeAssets: (o?: { themesDir?: string; clean?: boolean }) => { files: number; copied: number; removed: number };
};

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address() as net.AddressInfo;
      srv.close(() => resolve(port));
    });
  });
}

if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const OUT = process.env.G159_SHOTS_DIR || mkdtempSync(path.join(os.tmpdir(), 'g159-shots-'));
mkdirSync(OUT, { recursive: true });
const THEMES = path.join(ROOT, 'themes');
const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
const md5 = (b: Buffer | Uint8Array) => createHash('md5').update(b).digest('hex');
const disk = (theme: string, rel: string) => md5(readFileSync(path.join(THEMES, theme, ...rel.split('/'))));

/** A palette and two of its files: one with its own image, one without. */
function palette(theme: string, variant: string) {
  const own = readdirSync(path.join(THEMES, theme, 'img/variants', variant)).filter((f) => f.endsWith('.webp')).sort();
  const without = readdirSync(path.join(THEMES, theme, 'img')).filter((f) => f.endsWith('.webp') && !own.includes(f)).sort()[0];
  return { theme, variant, own: own[0], without };
}

async function fetchAsset(base: string, url: string) {
  const res = await fetch(base + url);
  const body = Buffer.from(await res.arrayBuffer());
  return { status: res.status, type: res.headers.get('content-type') ?? '', cache: res.headers.get('cache-control') ?? '', nosniff: res.headers.get('x-content-type-options') === 'nosniff', csp: res.headers.get('content-security-policy') ?? '', md5: md5(body) };
}

const CACHE = 'public, max-age=3600, s-maxage=86400';
const DEMOS = ['olive-ivory', 'blush-garden-rose', 'crimson-rose-atelier'];
const PALETTES = [palette('olive-ivory', 'sage-gold'), palette('crimson-rose-atelier', 'midnight-navy')];

async function httpChecks(base: string) {
  for (const theme of DEMOS) {
    const css = await fetchAsset(base, `/themes/${theme}/site.css`);
    check(`${theme}: site.css 200 text/css, route's cache, nosniff, = themes/`, css.status === 200 && css.type.startsWith('text/css') && css.cache === CACHE && css.nosniff && css.md5 === disk(theme, 'site.css'), `${css.status} ${css.type} ${css.cache}`);
    const js = await fetchAsset(base, `/themes/${theme}/site.js`);
    check(`${theme}: site.js 200 JavaScript, = themes/`, js.status === 200 && /^(text|application)\/javascript/.test(js.type) && js.cache === CACHE && js.md5 === disk(theme, 'site.js'), `${js.status} ${js.type}`);
    const og = await fetchAsset(base, `/themes/${theme}/img/og-1200x630.jpg`);
    check(`${theme}: share image 200 image/jpeg`, og.status === 200 && og.type === 'image/jpeg' && og.md5 === disk(theme, 'img/og-1200x630.jpg'), `${og.status} ${og.type}`);
    for (const p of ['index.html', 'theme.json', 'content.demo.json', 'README.md', 'build_images.py', 'img/manifest.json', 'img/nope.webp']) {
      const r = await fetchAsset(base, `/themes/${theme}/${p}`);
      check(`${theme}: ${p} -> 404`, r.status === 404, String(r.status));
    }
  }
  for (const { theme, variant, own, without } of PALETTES) {
    const o = await fetchAsset(base, `/themes/${theme}/~${variant}/img/${own}`);
    check(`${theme} ~${variant}: own image ${own} = img/variants/${variant}/${own}`, o.status === 200 && o.type === 'image/webp' && o.cache === CACHE && o.md5 === disk(theme, `img/variants/${variant}/${own}`) && o.md5 !== disk(theme, `img/${own}`), `${o.status}`);
    if (without) {
      const w = await fetchAsset(base, `/themes/${theme}/~${variant}/img/${without}`);
      check(`${theme} ~${variant}: ${without} (no override) = the original`, w.status === 200 && w.md5 === disk(theme, `img/${without}`), `${w.status}`);
    }
    for (const f of ['site.css', 'variants.css', 'site.js']) {
      const r = await fetchAsset(base, `/themes/${theme}/~${variant}/${f}`);
      check(`${theme} ~${variant}: ${f} = the original`, r.status === 200 && r.md5 === disk(theme, f) && r.cache === CACHE, `${r.status} ${r.type}`);
    }
    const direct = await fetchAsset(base, `/themes/${theme}/img/variants/${variant}/${own}`);
    check(`${theme}: img/variants/${variant}/${own} directly -> 404 (only through ~${variant}/)`, direct.status === 404, String(direct.status));
    check(`${theme}: ~${variant} alone -> 404`, (await fetchAsset(base, `/themes/${theme}/~${variant}`)).status === 404);
  }
  const svg = await fetchAsset(base, '/themes/_sample/assets/placeholder.svg');
  check('_sample: SVG with the file CSP', svg.status === 200 && svg.type.startsWith('image/svg+xml') && svg.csp.startsWith("default-src 'none'"), `${svg.status} ${svg.csp}`);
  check('unknown theme -> 404', (await fetchAsset(base, '/themes/no-such-theme/site.css')).status === 404);
}

async function browserChecks(base: string) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const pages: Array<{ url: string; variant?: string; ownImage?: string; theme: string; name: string }> = [];
    for (const theme of DEMOS) for (const p of ['', '/home']) pages.push({ theme, url: `/start/demo/${theme}${p}`, name: `${theme}${p.replace('/', '_') || '_index'}` });
    for (const { theme, variant, own } of PALETTES) {
      for (const p of ['', '/home', '/details']) pages.push({ theme, variant, ownImage: own, url: `/start/demo/${theme}${p}?variant=${variant}`, name: `${theme}~${variant}${p.replace('/', '_') || '_index'}` });
    }
    for (const spec of pages) {
      const page = await context.newPage();
      const failed: string[] = [];
      const errors: string[] = [];
      const themeOk: string[] = [];
      const bodies: Record<string, string> = {};
      page.on('requestfailed', (r: any) => {
        if (r.url().startsWith(base)) failed.push(`${r.url().slice(base.length)} ${r.failure()?.errorText ?? ''}`);
      });
      page.on('response', async (r: any) => {
        if (!r.url().startsWith(base)) return;
        const u = r.url().slice(base.length);
        if (r.status() >= 400) failed.push(`${u} ${r.status()}`);
        else if (u.startsWith('/themes/')) {
          themeOk.push(u);
          if (spec.ownImage && u.endsWith(`/img/${spec.ownImage}`)) {
            try {
              bodies[u] = md5(await r.body());
            } catch {
              /* redirected / gone */
            }
          }
        }
      });
      page.on('console', (m: any) => {
        if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com|ERR_TUNNEL|ERR_PROXY|net::ERR_FAILED/.test(m.text())) errors.push(m.text());
      });
      await page.goto(base + spec.url, { waitUntil: 'networkidle' }).catch((e: Error) => failed.push(`goto ${e.message}`));
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => undefined);
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await page.waitForTimeout(600);
      const info = await page.evaluate(() => ({
        variant: document.documentElement.dataset.variant ?? null,
        broken: Array.from(document.images).filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0).map((i) => i.currentSrc),
        sheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => (l as HTMLLinkElement).href),
        scroll: document.documentElement.scrollWidth > window.innerWidth + 1,
      }));
      await page.screenshot({ path: path.join(OUT, `${spec.name}_390.png`) });
      check(`${spec.name}: no failed request of this server`, failed.length === 0, failed.slice(0, 4).join(' | '));
      check(`${spec.name}: no console error`, errors.length === 0, errors.slice(0, 3).join(' | '));
      check(`${spec.name}: no broken image`, info.broken.length === 0, info.broken.slice(0, 3).join(' | '));
      check(`${spec.name}: theme files loaded from /themes/${spec.theme}/`, themeOk.filter((u) => u.startsWith(`/themes/${spec.theme}/`)).length >= 2, `${themeOk.length} theme requests`);
      if (spec.variant) {
        check(`${spec.name}: html[data-variant="${spec.variant}"], assets from ~${spec.variant}/`, info.variant === spec.variant && info.sheets.some((s: string) => s.includes(`/~${spec.variant}/`)) && themeOk.some((u) => u.includes(`/~${spec.variant}/img/`)), `${info.variant}; ${themeOk.filter((u) => u.includes('~')).length} palette requests`);
        const got = Object.values(bodies);
        if (got.length) check(`${spec.name}: the palette's own ${spec.ownImage} arrived (not the original)`, got.every((h) => h === disk(spec.theme, `img/variants/${spec.variant}/${spec.ownImage}`)));
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g159-data-'));
let server: NextServer | null = null;
try {
  // 1 + 2: with the static copies (startNext brings public/themes up to date first)
  let port = await freePort();
  server = startNext({ port, dataDir });
  await waitForServer(`${server.base}/robots.txt`, 30_000, server);
  await httpChecks(server.base);
  await browserChecks(server.base);
  server.stop();
  await new Promise((r) => server!.proc.once('exit', r));

  // 3: no copies — the route serves from disk (a themes folder of its own keeps startNext from copying)
  const removed = themeAssets.syncThemeAssets({ clean: true }).removed;
  const link = path.join(mkdtempSync(path.join(os.tmpdir(), 'g159-themes-')), 'themes');
  symlinkSync(THEMES, link);
  port = await freePort();
  server = startNext({ port, dataDir, env: { PLATFORM_THEMES_DIR: link } });
  await waitForServer(`${server.base}/robots.txt`, 30_000, server);
  check(`without public/themes (${removed} copies removed): ${PALETTES.length} palettes`, !existsSync(path.join(ROOT, 'public/themes')));
  for (const { theme, variant, own, without } of PALETTES) {
    const o = await fetchAsset(server.base, `/themes/${theme}/~${variant}/img/${own}`);
    check(`route: ${theme} ~${variant} own image = img/variants/${variant}/${own}`, o.status === 200 && o.md5 === disk(theme, `img/variants/${variant}/${own}`) && o.cache === CACHE, `${o.status} ${o.type}`);
    if (without) {
      const w = await fetchAsset(server.base, `/themes/${theme}/~${variant}/img/${without}`);
      check(`route: ${theme} ~${variant} ${without} = the original`, w.status === 200 && w.md5 === disk(theme, `img/${without}`), String(w.status));
    }
    const css = await fetchAsset(server.base, `/themes/${theme}/~${variant}/site.css`);
    check(`route: ${theme} ~${variant} site.css = the original, text/css`, css.status === 200 && css.type.startsWith('text/css') && css.md5 === disk(theme, 'site.css'), `${css.status} ${css.type}`);
    check(`route: ${theme} img/variants/… directly -> 404`, (await fetchAsset(server.base, `/themes/${theme}/img/variants/${variant}/${own}`)).status === 404);
  }
  check('route: index.html -> 404', (await fetchAsset(server.base, '/themes/olive-ivory/index.html')).status === 404);
} catch (e) {
  check('run', false, String((e as Error).stack ?? e).slice(0, 800));
} finally {
  server?.stop();
  const r = themeAssets.syncThemeAssets();
  console.log(`public/themes restored: ${r.files} files (${r.copied} copied)`);
  rmSync(dataDir, { recursive: true, force: true });
}

writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(checks, null, 2));
const failedChecks = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failedChecks.length}/${checks.length} checks passed. Screenshots + checks.json: ${OUT}`);
process.exit(failedChecks.length ? 1 : 0);
