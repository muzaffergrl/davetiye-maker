// Sharp stills of the envelope opening (DPR 3) for the editorial listing images (tools/listing_editorial.py).
// The recording in capture.ts is 390 × 844 CSS pixels (Playwright records CSS pixels), too soft for a large phone in a
// 2000 px listing image. Here each still is a fresh page load at DPR 3: tap the envelope, wait, pause every running
// animation (Web Animations API covers CSS animations and transitions), screenshot.
//
//   cd platform && npm run build                    (once)
//   NODE_PATH=/opt/node22/lib/node_modules node tools/listing_editorial/capture_opening.ts --theme <id> --out <dir> \
//        [--at 0,700,1600,2600]                     (ms after the tap; 0 = the closed envelope before the tap)
//        [--variants original,dusty-blue,…]         (G178: the same stills in each colour palette of theme.json, coming
//                                                    ones too; files <palette>_o01.jpg …, "original" = no palette)
//
// Same local setup as capture.ts (theme's own fictional demo record, local adapter, temp data folder); nothing is
// deployed. Writes <out>/o01.jpg … (one per --at value) and <out>/opening_stills.json.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, '../../platform');
const { loadChromium, startNext, waitForServer } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/browser.ts')).href);
const { loadThemeEnv, demoSlug } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/theme-env.ts')).href);

function arg(name: string, def: string | null = null): string | null {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}
const THEME = arg('theme');
const OUT = arg('out');
const AT = (arg('at', '0,700,1600,2600') as string).split(',').map(Number);
const VARIANTS_ARG = arg('variants');
const VARIANTS: Array<string | null> = VARIANTS_ARG ? VARIANTS_ARG.split(',').map((v) => (v === 'original' ? null : v)) : [null];
const PUBLIC_URL = 'https://bkestudio.com';
if (!THEME || !OUT) {
  console.error('usage: capture_opening.ts --theme <id> --out <dir> [--at ms,ms,…]');
  process.exit(2);
}
if (!existsSync(path.join(PLATFORM, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` in platform/ first.');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });
const env = loadThemeEnv({ theme: THEME });
const chromium = loadChromium();

const demo = structuredClone(env.demo);
const SLUG = demoSlug(demo);
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'listing-opening-data-'));
const contentFile = path.join(dataDir, 'demo-content.json');
writeFileSync(contentFile, JSON.stringify(demo));
// one published copy of the demo per palette (G178: seed --variant, coming palettes included)
const slugs = VARIANTS.map((v, i) => (VARIANTS_ARG ? `${SLUG.slice(0, 40)}-p${i}` : SLUG));
for (const [i, variant] of VARIANTS.entries()) {
  const seed = spawnSync(
    process.execPath,
    [path.join(PLATFORM, 'scripts/seed.ts'), '--theme', THEME, '--slug', slugs[i], '--content', contentFile, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos']), ...(variant ? ['--variant', variant] : [])],
    { cwd: PLATFORM, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL }, encoding: 'utf8' },
  );
  if (seed.status !== 0) {
    console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`);
    process.exit(1);
  }
}
const net = await import('node:net');
const PORT: number = await new Promise((resolve, reject) => {
  const s = net.createServer();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => { const p = (s.address() as { port: number }).port; s.close(() => resolve(p)); });
});
const server = startNext({ port: PORT, dataDir, env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL } });
const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' };
let browser: any;
let code = 0;
const stills: Array<{ file: string; ms: number; variant?: string }> = [];
try {
  await waitForServer(`${server.base}/`, 40_000, server);
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
  for (const [vi, variant] of VARIANTS.entries()) {
    const prefix = VARIANTS_ARG ? `${variant ?? 'original'}_` : '';
    for (const [i, ms] of AT.entries()) {
      const ctx = await browser.newContext(device);
      const page = await ctx.newPage();
      await page.goto(`${server.base}/${slugs[vi]}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const attr = await page.evaluate(() => document.documentElement.getAttribute('data-variant'));
      if ((attr || null) !== variant) throw new Error(`${slugs[vi]}: html[data-variant] is "${attr ?? ''}", not "${variant ?? ''}"`);
      await page.waitForTimeout(2200);
      // falling petals/leaves (JS particle layer) would freeze mid-air over the envelope
      await page.addStyleTag({ content: '.petal-layer,.accent-layer{display:none!important}' });
      if (ms > 0) {
        await page.tap('.stage');
        await page.waitForTimeout(ms);
        await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
      }
      const file = `${prefix}o${String(i + 1).padStart(2, '0')}.jpg`;
      await page.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 92 });
      stills.push({ file, ms, ...(VARIANTS_ARG ? { variant: variant ?? 'original' } : {}) });
      console.log(`PASS  ${file} at ${ms} ms (${page.url().replace(server.base, '')})`);
      await ctx.close();
    }
  }
  writeFileSync(path.join(OUT, 'opening_stills.json'), JSON.stringify({ theme: THEME, dpr: 3, size: '390x844', stills }, null, 2) + '\n');
} catch (e) {
  code = 1;
  console.error(String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.stop();
}
process.exit(code);
