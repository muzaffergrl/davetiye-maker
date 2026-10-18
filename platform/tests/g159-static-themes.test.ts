// G159: theme CSS/JS/images as static files (public/themes, scripts/theme-assets.cjs) instead of one ~100 MB function.
// The copy step, the asset route that answers what has no copy, the next.config.ts rewrite/headers/excludes and the
// trace-check budgets. The real URLs on `next start` (public copies, variant fallback, 404s, demos at 390 px):
// tests/g159-browser.ts.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { GET as assetRoute } from '../app/themes/[theme]/[...path]/route.ts';
import { THEME_ASSET_CACHE, THEME_ASSET_TYPES, THEME_FILE_CSP } from '../lib/site/static.ts';
import { THEME_ID_RE } from '../lib/theme/theme.ts';
import { VARIANT_ID_RE, VARIANT_IMG_DIR, VARIANT_SEGMENT_PREFIX, variantOverridePath } from '../lib/theme/variants.ts';
import nextConfig, { THEME_ASSET_CACHE as CONFIG_CACHE, THEME_ASSET_HEADERS, THEME_FILE_CSP as CONFIG_CSP, VARIANT_REWRITE } from '../next.config.ts';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

const require = createRequire(import.meta.url);
const themeAssets = require('../scripts/theme-assets.cjs') as {
  PUBLIC_THEMES: string;
  ASSET_EXTENSIONS: string[];
  THEME_ID_RE: RegExp;
  VARIANT_ID_RE: RegExp;
  VARIANT_SEGMENT_PREFIX: string;
  VARIANT_IMG_DIR: string;
  publicPathOf: (rel: string) => string | null;
  publicPlan: (themesDir: string) => Map<string, string>;
  syncThemeAssets: (o: { themesDir?: string; publicDir?: string; clean?: boolean }) => { files: number; bytes: number; copied: number; removed: number };
};
const traceCheck = require('../scripts/trace-check.cjs') as {
  ROUTES: string[];
  ASSET_ROUTE: string;
  THEME_BUDGET_MB: number;
  FUNCTION_BUDGET_MB: number;
  checkTraces: (o: Record<string, unknown>) => { problems: string[]; functions: Array<{ name: string; bytes: number; themeBytes: number }> };
};
const { pathToRegexp, compile } = require('next/dist/compiled/path-to-regexp') as {
  pathToRegexp: (p: string, keys?: unknown[], o?: Record<string, unknown>) => RegExp;
  compile: (p: string) => (params: Record<string, unknown>) => string;
};

const FIX = 'g159-fixture';
let themes: string;
let fixture: string;

before(() => {
  themes = tmpDir('g159-themes-');
  fixture = path.join(themes, FIX);
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), fixture, { recursive: true });
  mkdirSync(path.join(fixture, 'img/variants/rose/deco'), { recursive: true });
  mkdirSync(path.join(fixture, 'img/variants/Bad'), { recursive: true });
  mkdirSync(path.join(fixture, '.cache'), { recursive: true });
  writeFileSync(path.join(fixture, 'img/dot.webp'), 'original dot');
  writeFileSync(path.join(fixture, 'img/plain.webp'), 'original plain');
  writeFileSync(path.join(fixture, 'img/variants/rose/dot.webp'), 'rose dot');
  writeFileSync(path.join(fixture, 'img/variants/rose/deco/leaf.png'), 'rose leaf');
  writeFileSync(path.join(fixture, 'img/variants/Bad/dot.webp'), 'bad id');
  writeFileSync(path.join(fixture, 'img/manifest.json'), '{}');
  writeFileSync(path.join(fixture, 'variants.css'), 'html[data-variant="rose"]{--c:#b76e79}');
  writeFileSync(path.join(fixture, 'build_images.py'), '# private');
  writeFileSync(path.join(fixture, 'README.md'), '# private');
  writeFileSync(path.join(fixture, '.cache/x.webp'), 'dot folder');
  writeFileSync(path.join(fixture, '.hidden.css'), 'dot file');
  writeFileSync(path.join(fixture, 'UPPER.WEBP'), 'upper case extension');
  mkdirSync(path.join(themes, 'Not_A_Theme'));
  writeFileSync(path.join(themes, 'Not_A_Theme/site.css'), 'x');
  process.env.PLATFORM_THEMES_DIR = themes;
});

// ------------------------------------------------------------------------------------------------ the copy step

test('theme-assets: same rules as the route (constants agree with lib/)', () => {
  assert.deepEqual([...themeAssets.ASSET_EXTENSIONS].sort(), Object.keys(THEME_ASSET_TYPES).sort());
  assert.equal(String(themeAssets.THEME_ID_RE), String(THEME_ID_RE));
  assert.equal(String(themeAssets.VARIANT_ID_RE), String(VARIANT_ID_RE));
  assert.equal(themeAssets.VARIANT_SEGMENT_PREFIX, VARIANT_SEGMENT_PREFIX);
  assert.equal(themeAssets.VARIANT_IMG_DIR, VARIANT_IMG_DIR);
  assert.equal(themeAssets.PUBLIC_THEMES, 'public/themes');
  // the copy's path is where the route would look: ~<v>/img/x  <->  img/variants/<v>/x
  assert.equal(themeAssets.publicPathOf('site.css'), 'site.css');
  assert.equal(themeAssets.publicPathOf('img/a.webp'), 'img/a.webp');
  assert.equal(themeAssets.publicPathOf('img/variants/rose/a.webp'), '~rose/img/a.webp');
  assert.equal(variantOverridePath('rose', 'img/a.webp'), 'img/variants/rose/a.webp');
  assert.equal(themeAssets.publicPathOf('img/variants/rose/deco/leaf.png'), '~rose/img/deco/leaf.png');
  assert.equal(variantOverridePath('rose', 'img/deco/leaf.png'), 'img/variants/rose/deco/leaf.png');
  assert.equal(themeAssets.publicPathOf('img/variants/Bad/a.webp'), null);
  assert.equal(themeAssets.publicPathOf('img/variants/rose/variants/x/a.webp'), null);
  assert.equal(themeAssets.publicPathOf('img/variants/rose'), null);
});

test('theme-assets: mirrors exactly the servable files; variant images only in ~<v>/; incremental; removes what went away', () => {
  const pub = tmpDir('g159-public-');
  const out = path.join(pub, 'themes', FIX);
  const r = themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub });
  const files = (dir: string, rel = ''): string[] =>
    readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(dir, `${rel}${e.name}/`) : [`${rel}${e.name}`]));
  const got = files(out).sort();
  assert.ok(got.includes('style.css') && got.includes('variants.css') && got.includes('img/dot.webp') && got.includes('assets/placeholder.svg'), got.join());
  assert.ok(got.includes('UPPER.WEBP'), 'the route lower-cases the extension');
  assert.ok(got.includes('~rose/img/dot.webp') && got.includes('~rose/img/deco/leaf.png'));
  assert.equal(readFileSync(path.join(out, '~rose/img/dot.webp'), 'utf8'), 'rose dot');
  for (const f of got) {
    assert.ok(!/\.(html|json|py|md)$/.test(f), `private file published: ${f}`);
    assert.ok(!f.split('/').some((s) => s.startsWith('.')), `dot file published: ${f}`);
    assert.ok(!f.startsWith('img/variants/'), `variant image published twice: ${f}`);
  }
  assert.ok(!existsSync(path.join(pub, 'themes/Not_A_Theme')), 'not a theme id');
  assert.equal(r.files, got.length);
  assert.equal(r.copied, got.length);
  // same size + mtime: nothing copied again; a changed file is
  assert.equal(themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub }).copied, 0);
  writeFileSync(path.join(fixture, 'img/plain.webp'), 'original plain, edited');
  const later = new Date(Date.now() + 5000);
  utimesSync(path.join(fixture, 'img/plain.webp'), later, later);
  const again = themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub });
  assert.equal(again.copied, 1);
  assert.equal(readFileSync(path.join(out, 'img/plain.webp'), 'utf8'), 'original plain, edited');
  // a new palette image appears by itself; a removed one disappears (with its empty folder)
  writeFileSync(path.join(fixture, 'img/variants/rose/plain.webp'), 'rose plain');
  assert.equal(themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub }).copied, 1);
  assert.equal(readFileSync(path.join(out, '~rose/img/plain.webp'), 'utf8'), 'rose plain');
  rmSync(path.join(fixture, 'img/variants/rose/deco'), { recursive: true });
  rmSync(path.join(fixture, 'img/variants/rose/plain.webp'));
  writeFileSync(path.join(out, 'stray.css'), 'not from themes/');
  const cleaned = themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub });
  assert.equal(cleaned.removed, 3);
  assert.ok(!existsSync(path.join(out, '~rose/img/deco')) && !existsSync(path.join(out, 'stray.css')));
  // --clean
  assert.ok(themeAssets.syncThemeAssets({ themesDir: themes, publicDir: pub, clean: true }).removed > 0);
  assert.ok(!existsSync(path.join(pub, 'themes')));
  rmSync(pub, { recursive: true, force: true });
});

test('theme-assets on the real themes: every servable file is planned, no template / JSON / script / README, palettes under ~<v>/img', () => {
  const dir = path.join(PLATFORM_ROOT, 'themes');
  const plan = themeAssets.publicPlan(dir);
  assert.ok(plan.size > 100);
  let variantFiles = 0;
  for (const [dest, src] of plan) {
    const [id, ...rest] = dest.split('/');
    const rel = rest.join('/');
    assert.ok(THEME_ID_RE.test(id), dest);
    assert.ok(Object.keys(THEME_ASSET_TYPES).includes(path.extname(dest).slice(1).toLowerCase()), dest);
    assert.ok(!rel.startsWith('img/variants/'), dest);
    if (rel.startsWith(VARIANT_SEGMENT_PREFIX)) {
      variantFiles += 1;
      const [seg, ...inner] = rel.split('/');
      assert.equal(src, path.join(dir, id, variantOverridePath(seg.slice(1), inner.join('/'))!));
    } else {
      assert.equal(src, path.join(dir, id, rel));
    }
    assert.ok(statSync(src).isFile());
  }
  // every palette image of every theme is in the plan
  for (const id of readdirSync(dir)) {
    const vdir = path.join(dir, id, VARIANT_IMG_DIR);
    if (!existsSync(vdir)) continue;
    for (const v of readdirSync(vdir).filter((n) => statSync(path.join(vdir, n)).isDirectory())) {
      for (const f of readdirSync(path.join(vdir, v)).filter((n) => !n.startsWith('.'))) {
        if (statSync(path.join(vdir, v, f)).isFile()) assert.ok(plan.has(`${id}/~${v}/img/${f}`), `${id}/${VARIANT_IMG_DIR}/${v}/${f}`);
      }
    }
  }
  assert.ok(variantFiles > 0, 'the G153 palettes are on this branch');
});

// ------------------------------------------------------------------------------------------------ the asset route

const get = async (url: string, params: { theme: string; path: string[] }) => {
  const res = await assetRoute(new Request(`http://sites.local.test${url}`), { params: Promise.resolve(params) });
  return { status: res.status, type: res.headers.get('content-type'), cache: res.headers.get('cache-control'), text: await res.text() };
};

test('asset route: a rewritten variant URL serves the override (?variant= or the address asked for); img/variants/… is no URL', async () => {
  const p = (...s: string[]) => ({ theme: FIX, path: s });
  // what next.config.ts VARIANT_REWRITE hands the route: the original's params, the variant in the query …
  assert.equal((await get(`/themes/${FIX}/img/dot.webp?variant=rose`, p('img', 'dot.webp'))).text, 'rose dot');
  // … or (next start) the address the browser asked for
  assert.equal((await get(`/themes/${FIX}/~rose/img/dot.webp`, p('img', 'dot.webp'))).text, 'rose dot');
  assert.equal((await get(`/themes/${FIX}/~rose/img/plain.webp`, p('img', 'plain.webp'))).text, 'original plain, edited');
  assert.equal((await get(`/themes/${FIX}/~rose/style.css`, p('style.css'))).type, 'text/css; charset=utf-8');
  // a bad id (the rewrite matches case-insensitively) or none: the original
  assert.equal((await get(`/themes/${FIX}/~Bad/img/dot.webp`, p('img', 'dot.webp'))).text, 'original dot');
  assert.equal((await get(`/themes/${FIX}/img/dot.webp?variant=..`, p('img', 'dot.webp'))).text, 'original dot');
  assert.equal((await get(`/themes/${FIX}/img/dot.webp`, p('img', 'dot.webp'))).text, 'original dot');
  // the ~<v> folder itself still works (direct calls, lib/print/render.ts)
  assert.equal((await get(`/themes/${FIX}/~rose/img/dot.webp`, p('~rose', 'img', 'dot.webp'))).text, 'rose dot');
  // img/variants/… directly: 404, like public/themes (no image has two URLs)
  for (const s of [['img', 'variants', 'rose', 'dot.webp'], ['~rose', 'img', 'variants', 'rose', 'dot.webp'], ['img', 'variants']]) {
    const r = await get(`/themes/${FIX}/${s.join('/')}`, p(...s));
    assert.equal(r.status, 404, s.join('/'));
    assert.equal(r.cache, 'no-store');
  }
  const css = await get(`/themes/${FIX}/style.css`, p('style.css'));
  assert.equal(css.status, 200);
  assert.equal(css.cache, THEME_ASSET_CACHE);
  for (const s of [['index.html'], ['theme.json'], ['README.md'], ['build_images.py'], ['nope.webp']]) assert.equal((await get(`/themes/${FIX}/${s[0]}`, p(...s))).status, 404, s[0]);
});

// ------------------------------------------------------------------------------------------------ next.config.ts

test('next.config: the variant rewrite (afterFiles), the headers of the static copies, no theme asset in any trace', async () => {
  const rewrites = (await nextConfig.rewrites!()) as { beforeFiles: unknown[]; afterFiles: unknown[] };
  assert.deepEqual(rewrites.afterFiles, [VARIANT_REWRITE], 'after the public files: an override copy wins, else the original');
  assert.ok(!JSON.stringify(rewrites.beforeFiles).includes('themes'));
  // the source as Next matches it (path-to-regexp, case-insensitive), the destination as Next builds it
  const re = pathToRegexp(VARIANT_REWRITE.source, [], { sensitive: false, strict: true });
  const m = re.exec('/themes/olive-ivory/~sage-gold/img/bg-640.webp');
  assert.deepEqual(m?.slice(1), ['olive-ivory', 'sage-gold', 'img/bg-640.webp']);
  assert.ok(re.test('/themes/olive-ivory/~sage-gold/site.css'));
  for (const no of ['/themes/olive-ivory/~sage-gold', '/themes/olive-ivory/img/x.webp', '/themes/olive-ivory/~-x/a.css', '/themes/olive-ivory/~a_b/a.css']) assert.ok(!re.test(no), no);
  const [dest, query] = VARIANT_REWRITE.destination.split('?');
  assert.equal(compile(dest)({ theme: 'olive-ivory', path: ['img', 'bg-640.webp'] }), '/themes/olive-ivory/img/bg-640.webp');
  assert.equal(query, 'variant=:variant');

  // headers = what the route sends (lib/site/static.ts)
  assert.equal(CONFIG_CACHE, THEME_ASSET_CACHE);
  assert.equal(CONFIG_CSP, THEME_FILE_CSP);
  const headers = (await nextConfig.headers!()) as Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  for (const h of THEME_ASSET_HEADERS) assert.ok(headers.some((x) => JSON.stringify(x) === JSON.stringify(h)), h.source);
  const rule = (key: string) => THEME_ASSET_HEADERS.filter((h) => h.headers.some((x) => x.key === key)).map((h) => pathToRegexp(h.source));
  const match = (key: string, url: string) => rule(key).some((r) => r.test(url));
  for (const e of Object.keys(THEME_ASSET_TYPES)) assert.ok(match('Cache-Control', `/themes/t/img/a.${e}`), e);
  assert.ok(match('Cache-Control', '/themes/t/~v/img/a.webp'));
  assert.ok(!match('Cache-Control', '/themes/t/index.html') && !match('Cache-Control', '/themes/t/theme.json'));
  assert.ok(match('Content-Security-Policy', '/themes/t/assets/a.svg') && !match('Content-Security-Policy', '/themes/t/a.webp'));
  assert.ok(match('X-Content-Type-Options', '/themes/t/a.webp') && match('X-Content-Type-Options', '/themes/t/index.html'));

  // traces: nothing of public/themes nor any theme asset, in every route
  const ex = nextConfig.outputFileTracingExcludes as Record<string, string[]>;
  assert.deepEqual(Object.keys(ex), ['**']);
  assert.ok(ex['**'].includes('./public/themes/**'));
  const pkg = JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'package.json'), 'utf8')) as { scripts: Record<string, string> };
  assert.equal(pkg.scripts.prebuild, 'node scripts/theme-assets.cjs', 'npm run build (and Vercel) copies first');
  assert.match(pkg.scripts.postbuild, /^node scripts\/trace-check\.cjs(?: && |$)/, 'trace-check first (G173 adds js-budget after it)');
  const ignored = (file: string) => readFileSync(file, 'utf8').split('\n').map((l) => l.trim());
  assert.ok(ignored(path.join(PLATFORM_ROOT, '..', '.gitignore')).includes('platform/public/themes/'));
  assert.ok(ignored(path.join(PLATFORM_ROOT, '.vercelignore')).includes('public/themes'));
});

// ------------------------------------------------------------------------------------------------ trace-check budgets

test('trace-check: every function is measured; theme assets anywhere, theme files over budget and big functions fail', () => {
  const dir = tmpDir('g159-tc-');
  const tdir = path.join(dir, 'themes');
  const pdir = path.join(dir, 'public');
  cpSync(fixture, path.join(tdir, FIX), { recursive: true });
  themeAssets.syncThemeAssets({ themesDir: tdir, publicDir: pdir });
  mkdirSync(path.join(dir, 'node_modules/big'), { recursive: true });
  writeFileSync(path.join(dir, 'node_modules/big/blob.bin'), Buffer.alloc(300 * 1024));
  const server = path.join(dir, '.next/server');
  const app = path.join(server, 'app');
  const templates = ['index.html', 'home.html', 'story.html', 'details.html', 'rsvp.html', 'theme.json', 'img/manifest.json'].map((f) => path.join(tdir, FIX, f));
  const write = (route: string, files: string[]) => {
    const nft = path.join(app, `${route}.js.nft.json`);
    mkdirSync(path.dirname(nft), { recursive: true });
    writeFileSync(nft, JSON.stringify({ version: 1, files: files.map((f) => path.relative(path.dirname(nft), f)) }));
  };
  for (const r of traceCheck.ROUTES) write(r, templates);
  write(traceCheck.ASSET_ROUTE, []);
  write('api/other/route', [path.join(dir, 'node_modules/big/blob.bin')]);
  const run = (o: Record<string, unknown> = {}) => traceCheck.checkTraces({ root: dir, appDir: app, themesDir: tdir, publicDir: pdir, ...o });

  const ok = run();
  assert.deepEqual(ok.problems, []);
  assert.equal(ok.functions.length, traceCheck.ROUTES.length + 2);
  assert.equal(ok.functions[0].name, 'app/api/other/route', 'largest first');
  assert.equal(ok.functions[0].bytes, 300 * 1024);
  assert.ok(ok.functions.find((f) => f.name === 'app/[slug]/route')!.themeBytes > 0);
  assert.equal(traceCheck.THEME_BUDGET_MB, 40);
  assert.ok(traceCheck.FUNCTION_BUDGET_MB <= 200);

  // budgets (tiny ones here, so the fixture exceeds them)
  const tiny = run({ themeBudgetMb: 0.001, functionBudgetMb: 0.25 });
  assert.ok(tiny.problems.some((p) => p.startsWith('app/[slug]/route:') && p.includes('of theme files — over the budget of 0.001 MB')), tiny.problems.join('\n'));
  assert.ok(tiny.problems.some((p) => p.startsWith('app/api/other/route: 0.3 MB in all — over the budget of 0.25 MB')), tiny.problems.join('\n'));

  // a theme image or a static copy in any function (not only the theme routes)
  write('api/other/route', [path.join(tdir, FIX, 'img/dot.webp')]);
  assert.ok(run().problems.some((p) => p.startsWith('app/api/other/route: carries 1 theme asset file(s)')));
  write('api/other/route', [path.join(pdir, 'themes', FIX, 'style.css')]);
  assert.ok(run().problems.some((p) => p.startsWith('app/api/other/route: carries 1 theme asset file(s) (public/themes/')));
  write('api/other/route', [path.join(tdir, FIX, 'theme.json')]);
  assert.deepEqual(run().problems, [], 'JSON is no asset');
  // a static copy that differs, a file that does not belong
  writeFileSync(path.join(pdir, 'themes', FIX, 'style.css'), 'edited by hand');
  writeFileSync(path.join(pdir, 'themes', FIX, 'extra.css'), 'x');
  const pub = run().problems;
  assert.ok(pub.some((p) => p.includes('differ from themes/') && p.includes(`${FIX}/style.css`)), pub.join('\n'));
  assert.ok(pub.some((p) => p.includes('not servable theme files') && p.includes(`${FIX}/extra.css`)), pub.join('\n'));
  rmSync(dir, { recursive: true, force: true });
});
