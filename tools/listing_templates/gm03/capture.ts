// Real screens for the G065 listing images LC4 (editor), LC5 (RSVP) of one platform theme. Driven by
// tools/listing_templates/gm03/build.py (`capture`); can be run by hand after `cd platform && npm ci && npm run build`:
//
//   NODE_PATH=/opt/node22/lib/node_modules node tools/listing_templates/gm03/capture.ts --theme <id> --out <dir> --jobs <jobs.json>
//
// jobs.json: [{ "name", "kind": "guest", "page": "envelope"|"home"|"story"|"details"|"rsvp", "width", "height", "dpr" }
//             | { "name", "kind": "panel", "view": "edit"|"guests"|"home", "width", "height", "dpr" }, …]
// The size follows the green screen of the GPT scene it goes into (build.py measures it), so a picture is never squeezed
// or cut afterwards. Phones: 390 CSS px wide, isMobile + touch. Laptop: a desktop browser of that size.
//
// Same way as tools/listing_v2/capture.ts (guest screens, G067) and platform/scripts/marketing-assets.ts (panel v2, G080):
// local production build (`next start`), local adapter, temp data folder; the theme's own demo record (fictional names)
// + its PAKET 2 sample photos are seeded as a published site with one RSVP question ("Meal choice") and five fictional
// replies posted through the public RSVP API; the couple's editor is opened with the seed's edit key. Nothing is
// deployed and nothing is sent to the live site. Particle layers are hidden in stills.
// Writes <out>/<name>.png (lossless) and <out>/capture.json. Exit code 1 when a step fails.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, '../../../platform');
const { loadChromium, startNext, waitForServer } = await import(path.join(PLATFORM, 'scripts/lib/browser.ts'));
const { loadThemeEnv, demoSlug } = await import(path.join(PLATFORM, 'scripts/lib/theme-env.ts'));

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}
const THEME = arg('theme');
const OUT = arg('out');
const JOBS = arg('jobs');
const PUBLIC_URL = 'https://davetiye-platform-five.vercel.app';
if (!THEME || !OUT || !JOBS) {
  console.error('usage: capture.ts --theme <id> --out <dir> --jobs <jobs.json>');
  process.exit(2);
}
type Job = { name: string; kind: 'guest' | 'panel'; page?: string; view?: string; width: number; height: number; dpr: number };
const jobs: Job[] = JSON.parse(readFileSync(JOBS, 'utf8'));
mkdirSync(OUT, { recursive: true });

/** Fictional replies (as on the marketing site, G080): 9 coming · 1 not coming · 5 replies. */
const REPLIES = [
  { name: 'Olivia Bennett', attending: 'yes', guests: 2, message: 'We would not miss it!', answers: { meal: 'Fish' } },
  { name: 'Marcus Reed', attending: 'yes', guests: 1, message: '', answers: { meal: 'Vegetarian' } },
  { name: 'Hannah Clarke', attending: 'no', guests: 0, message: 'So sorry to miss it. Sending love!', answers: {} },
  { name: 'The Alvarez Family', attending: 'yes', guests: 4, message: 'Counting the days.', answers: { meal: 'Chicken' } },
  { name: 'Sofia Martin', attending: 'yes', guests: 2, message: '', answers: { meal: 'Fish' } },
];

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
demo.rsvp = { ...demo.rsvp, questions: [{ id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] }] };
const SLUG = demoSlug(demo);
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'listing-gm03-data-'));
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
const EDIT_KEY: string = JSON.parse(readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8')).editKey;

const server = startNext({ port: await freePort(), dataDir, env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL, VERCEL_ENV: '', THEME_APPROVAL: '' } });
const BASE = server.base;
const PARTICLES = '.petal-layer, .accent-layer';
const done: Array<Job & { file: string; url: string }> = [];
let failed = false;
let browser: any;
try {
  await waitForServer(`${BASE}/signin`, 40_000, server);
  for (const [i, r] of REPLIES.entries()) {
    const res = await fetch(`${BASE}/api/rsvp/${SLUG}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${i + 10}` },
      body: JSON.stringify({ ...r, email: '', website: '' }),
    });
    if (res.status !== 200) throw new Error(`reply "${r.name}": ${res.status} ${await res.text()}`);
  }
  browser = await loadChromium().launch({ args: ['--disable-dev-shm-usage'] });
  for (const job of jobs) {
    for (let attempt = 1; ; attempt++) {
      const phone = job.width <= 480;
      const ctx = await browser.newContext({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: job.dpr, isMobile: phone, hasTouch: phone });
      ctx.setDefaultTimeout(15_000);
      // every reply has been seen: no "new" badges in the picture
      await ctx.addInitScript(({ key }: { key: string }) => {
        try { window.localStorage.setItem(key, new Date(Date.now() + 60_000).toISOString()); } catch { /* none */ }
      }, { key: `seen:${SLUG}` });
      try {
        const page = await ctx.newPage();
        let url: string;
        if (job.kind === 'guest') {
          url = job.page === 'envelope' || job.page === 'home' ? `${BASE}/${SLUG}` : `${BASE}/${SLUG}/${job.page}`;
          const res = await page.goto(url, { waitUntil: 'load' });
          if (res.status() !== 200) throw new Error(`${url}: HTTP ${res.status()}`);
          await page.evaluate(() => document.fonts.ready);
          if (job.page === 'home') {
            await page.waitForTimeout(1200);
            await page.tap('.stage');
            await page.waitForURL(`${BASE}/${SLUG}/home`, { timeout: 10_000 });
            await page.waitForTimeout(5600);
          } else {
            await page.waitForTimeout(job.page === 'envelope' ? 2200 : 3800);
          }
          await page.evaluate((sel: string) => document.querySelectorAll(sel).forEach((e) => ((e as HTMLElement).style.visibility = 'hidden')), PARTICLES);
        } else {
          url = `${BASE}/edit/${SLUG}?k=${EDIT_KEY}#${job.view}`;
          const res = await page.goto(url, { waitUntil: 'load' });
          if (res.status() !== 200) throw new Error(`/edit/${SLUG}#${job.view}: HTTP ${res.status()}`);
          await page.waitForSelector('[data-panel-root], [data-panel]');
          if (job.view === 'guests') await page.waitForSelector('[data-reply]');
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(job.view === 'home' ? 1500 : 900);
          await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
          url = `/edit/${SLUG}?k=…#${job.view}`;
        }
        await page.waitForTimeout(400);
        const file = path.join(OUT, `${job.name}.png`);
        await page.screenshot({ path: file, type: 'png' });
        done.push({ ...job, file: path.basename(file), url: url.replace(BASE, '') });
        console.log(`shot  ${job.name}.png  ${job.kind} ${job.page ?? job.view} ${job.width}×${job.height} @${job.dpr}x`);
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
  JSON.stringify({ theme: THEME, slug: SLUG, demo: env.demoSource, photos: env.photosSource, public_url: PUBLIC_URL,
    replies: 'five fictional replies (9 coming · 1 not coming), one RSVP question "Meal choice"', shots: done }, null, 2),
);
process.exit(failed ? 1 : 0);
