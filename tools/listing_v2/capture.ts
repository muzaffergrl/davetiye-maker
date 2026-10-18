// Real guest screens of one platform theme for the v2 Etsy listing images (G067). Driven by tools/listing_v2/build.py
// (`capture` step); can be run by hand after `cd platform && npm ci && npm run build`:
//
//   NODE_PATH=/opt/node22/lib/node_modules node tools/listing_v2/capture.ts --theme <id> --out <dir> --jobs <jobs.json>
//
// jobs.json: [{ "name": "envelope_867", "page": "envelope"|"home"|"story"|"details"|"rsvp", "height": 867 }, …]
// Every screen is 390 CSS px wide at deviceScaleFactor 3 (isMobile, touch). The height follows the green screen of
// the GPT scene it goes into (build.py measures it): the picture is what a phone with that screen shape shows, so it
// is never squeezed or cut afterwards. 844 = the G059 screens.
//
// Same way as G059's tools/listing_templates/capture.ts (which also records the buyer screens and the opening, and
// has fixed 390 × 844 screens): local production build (`next start`), local adapter, temp data folder; the theme's
// own demo record (fictional names) + its PAKET 2 sample photos are seeded as a published site; nothing is deployed
// and nothing is sent to the live site. Particle layers (falling petals/leaves) are hidden in stills, as in G059.
// Writes <out>/<name>.png (lossless) and <out>/capture.json. Exit code 1 when a step fails.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, '../../platform');
const { loadChromium, startNext, waitForServer } = await import(path.join(PLATFORM, 'scripts/lib/browser.ts'));
const { loadThemeEnv, demoSlug } = await import(path.join(PLATFORM, 'scripts/lib/theme-env.ts'));

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}
const THEME = arg('theme');
const OUT = arg('out');
const JOBS = arg('jobs');
const PUBLIC_URL = 'https://xn--bkestudo-zkb.com';
if (!THEME || !OUT || !JOBS) {
  console.error('usage: capture.ts --theme <id> --out <dir> --jobs <jobs.json>');
  process.exit(2);
}
type Job = { name: string; page: 'envelope' | 'home' | 'story' | 'details' | 'rsvp'; height: number };
const jobs: Job[] = JSON.parse(readFileSync(JOBS, 'utf8'));
mkdirSync(OUT, { recursive: true });

async function freePort(): Promise<number> {
  const net = await import('node:net');
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const p = (s.address() as { port: number }).port;
      s.close(() => resolve(p));
    });
  });
}

const env = loadThemeEnv({ theme: THEME });
const demo = structuredClone(env.demo);
const SLUG = demoSlug(demo);
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'listing-v2-data-'));
const contentFile = path.join(dataDir, 'demo-content.json');
writeFileSync(contentFile, JSON.stringify(demo));
const seed = spawnSync(
  process.execPath,
  [path.join(PLATFORM, 'scripts/seed.ts'), '--theme', THEME, '--slug', SLUG, '--content', contentFile, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos'])],
  { cwd: PLATFORM, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL }, encoding: 'utf8' },
);
if (seed.status !== 0) {
  console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`);
  process.exit(1);
}

const server = startNext({ port: await freePort(), dataDir, env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL } });
const BASE = server.base;
const PARTICLES = '.petal-layer, .accent-layer';
const done: Array<Job & { file: string; url: string }> = [];
let failed = false;
let browser: any;
try {
  await waitForServer(`${BASE}/`, 40_000, server);
  browser = await loadChromium().launch({ args: ['--disable-dev-shm-usage'] });
  for (const job of jobs) {
    // a renderer crash on the DPR 3 pages (seen in G059 on 03) is retried with a fresh context
    for (let attempt = 1; ; attempt++) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: job.height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      ctx.setDefaultTimeout(15_000);
      try {
        const page = await ctx.newPage();
        const url = job.page === 'envelope' || job.page === 'home' ? `${BASE}/${SLUG}` : `${BASE}/${SLUG}/${job.page}`;
        const res = await page.goto(url, { waitUntil: 'load' });
        if (res.status() !== 200) throw new Error(`${url}: HTTP ${res.status()}`);
        await page.evaluate(() => document.fonts.ready);
        if (job.page === 'envelope') {
          await page.waitForTimeout(2200);
        } else if (job.page === 'home') {
          // the guest's way in: tap the closed envelope, it opens and leads to home
          await page.waitForTimeout(1200);
          await page.tap('.stage');
          await page.waitForURL(`${BASE}/${SLUG}/home`, { timeout: 10_000 });
          await page.waitForTimeout(5600);
        } else {
          await page.waitForTimeout(3800);
        }
        await page.evaluate((sel: string) => document.querySelectorAll(sel).forEach((e) => ((e as HTMLElement).style.visibility = 'hidden')), PARTICLES);
        await page.waitForTimeout(400);
        const file = path.join(OUT, `${job.name}.png`);
        await page.screenshot({ path: file, type: 'png' });
        done.push({ ...job, file: path.basename(file), url: url.replace(BASE, '') + (job.page === 'home' ? ' → tap → /home' : '') });
        console.log(`shot  ${job.name}.png  ${job.page} 390×${job.height} @3x`);
        break;
      } catch (e) {
        if (attempt >= 3) throw e;
        console.error(`retry ${job.name} (${(e as Error).message.split('\n')[0]})`);
      } finally {
        await ctx.close().catch(() => undefined);
      }
    }
  }
} catch (e) {
  failed = true;
  console.error(`capture failed: ${(e as Error).stack ?? e}`);
} finally {
  await browser?.close().catch(() => undefined);
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}
writeFileSync(
  path.join(OUT, 'capture.json'),
  JSON.stringify({ theme: THEME, slug: SLUG, demo: env.demoSource, photos: env.photosSource, device: '390 × height CSS px, DPR 3, isMobile, hasTouch', public_url: PUBLIC_URL, shots: done }, null, 2),
);
process.exit(failed ? 1 : 0);
