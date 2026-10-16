// G089 (K31) motion polish — performance budget + screenshots on a production build (`next start`). Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g089-browser.ts [--label before|after] [--no-shots] [--no-perf]
//
// 1. Lab performance at 390 px, the marketing-browser.ts budget (CPU 4×, 150 ms RTT, 1.6 Mbps down, cache off):
//    LCP ≤ 2.5 s, CLS ≤ 0.05, ≤ 600 KB transferred — home, two design pages, /designs, a guide. Plus: the hero h1 and
//    the primary button are fully opaque and untransformed in the first frame (no entrance delay on the first screen).
// 2. Reduced motion: with prefers-reduced-motion the below-the-fold sections are never hidden (no data-fx-reveal).
// 3. Screenshots 390 / 1280 of the changed screens (sales site, buyer panel, admin) → previews/g089/.
// Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`). Exit 1 when a check fails.

import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const args = process.argv.slice(2);
const LABEL = args.includes('--label') ? args[args.indexOf('--label') + 1] : 'after';
const SHOTS = !args.includes('--no-shots');
const PERF = !args.includes('--no-perf');
const OUT = path.join(ROOT, 'previews/g089');
mkdirSync(OUT, { recursive: true });
const PORT = Number(process.env.PORT || 3489);
const PASSWORD = 'g089-browser-test-password';

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g089-data-'));
const adapter = new LocalAdapter(dataDir);
const THEME = 'blush-garden-rose';
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const setupSite = await createSiteWithKeys(adapter, { slug: 'elena-and-marco', theme: THEME, content: draftFromDemo(demo, ['Elena', 'Marco']) });
const liveSite = await createSiteWithKeys(adapter, { slug: 'nora-and-sam', theme: THEME, content: draftFromDemo(demo, ['Nora', 'Sam']) });
await publishSite(adapter, liveSite.site.id);

const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: boolean, detail?: unknown) => {
  checks.push({ name, ok, ...(detail === undefined ? {} : { detail }) });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
};

const server = startNext({ port: PORT, dataDir, env: { ADMIN_PASSWORD: PASSWORD } });
const BASE = server.base;
const browser = await loadChromium().launch();
const metrics: Record<string, unknown> = {};
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' };
const WIDE = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'en-US' };
const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;

try {
  await waitForServer(`${BASE}/robots.txt`, 60_000, server);
  const designs = liveDesigns();
  const guides = loadGuides();

  if (PERF) {
    for (const p of ['/', '/designs', `/designs/${designs[1].id}`, `/designs/${designs[designs.length - 1].id}`, guides[0].path]) {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      const types = new Map<string, string>();
      let total = 0;
      let scripts = 0;
      cdp.on('Network.responseReceived', (e: any) => types.set(e.requestId, e.type));
      cdp.on('Network.loadingFinished', (e: any) => {
        total += e.encodedDataLength;
        if (types.get(e.requestId) === 'Script') scripts += e.encodedDataLength;
      });
      await page.addInitScript(() => {
        const w = window as any;
        w.__lcp = 0;
        w.__lcpEl = '';
        w.__cls = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as any[]) {
            w.__lcp = e.startTime;
            w.__lcpEl = `${e.element?.tagName ?? ''} ${e.url ?? ''}`.trim();
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) w.__cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        // First-frame state of the h1 and the first button (opacity / transform) — must be final from the start.
        const first = () => {
          const read = (el: Element | null) => (el ? { o: getComputedStyle(el).opacity, t: getComputedStyle(el).transform } : null);
          w.__first = { h1: read(document.querySelector('main h1')), btn: read(document.querySelector('main a[class*="btn"], main [data-demo]')) };
        };
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(first));
      });
      await page.goto(BASE + p, { waitUntil: 'load', timeout: 120_000 });
      await page.waitForTimeout(3000);
      const m = await page.evaluate(() => {
        const w = window as any;
        return {
          lcp: Math.round(w.__lcp),
          lcpElement: w.__lcpEl,
          cls: Number(w.__cls.toFixed(4)),
          fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry | undefined)?.startTime ?? 0),
          first: w.__first,
        };
      });
      const r = { ...m, transferredKB: Math.round(total / 1024), scriptKB: Math.round(scripts / 1024) };
      metrics[p] = r;
      check(`perf ${p}: LCP ≤ 2.5 s (lab, CPU 4×, slow 4G)`, r.lcp > 0 && r.lcp <= 2500, { lcp: r.lcp, el: r.lcpElement });
      check(`perf ${p}: CLS ≤ 0.05`, r.cls <= 0.05, r.cls);
      check(`perf ${p}: first load ≤ 600 KB transferred`, r.transferredKB <= 600, { total: r.transferredKB, script: r.scriptKB });
      const still = (x: { o: string; t: string } | null) => !x || (x.o === '1' && (x.t === 'none' || x.t === 'matrix(1, 0, 0, 1, 0, 0)'));
      check(`perf ${p}: h1 and first button final in the first frame`, still(m.first?.h1) && still(m.first?.btn), m.first);
      await ctx.close();
    }
  }

  // reduced motion: nothing below the fold waits for a reveal
  {
    const ctx = await browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const hidden = await page.evaluate(() => document.querySelectorAll('[data-fx-reveal]:not([data-fx-in])').length);
    check('reduced motion: no section waits for a reveal on /', hidden === 0, hidden);
    await ctx.close();
  }

  if (SHOTS) {
    const settle = async (page: any) => {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
    };
    for (const [w, opts] of [
      [390, PHONE],
      [1280, WIDE],
    ] as const) {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      for (const [name, p] of [
        ['home', '/'],
        ['designs', '/designs'],
        ['design', `/designs/${designs[1].id}`],
      ]) {
        await page.goto(BASE + p, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(OUT, `${LABEL}_${name}_${w}_top.png`) });
        await settle(page);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        check(`${p} @${w}: no horizontal page scroll`, over <= 0, over);
        const waiting = await page.evaluate(() => document.querySelectorAll('[data-fx-reveal]:not([data-fx-in])').length);
        check(`${p} @${w}: every section revealed after scrolling through`, waiting === 0, waiting);
        await page.screenshot({ path: path.join(OUT, `${LABEL}_${name}_${w}_full.jpg`), fullPage: true, quality: 70 });
      }
      // panel: setup, home, an edit page, share
      for (const [name, url] of [
        ['panel_setup1', editUrl('elena-and-marco', setupSite.editKey, '#setup/1')],
        ['panel_home', editUrl('nora-and-sam', liveSite.editKey, '#home')],
        ['panel_edit', editUrl('nora-and-sam', liveSite.editKey, '#edit')],
        ['panel_edit_day', editUrl('nora-and-sam', liveSite.editKey, '#edit/day')],
      ]) {
        await page.goto(url);
        await page.waitForTimeout(1200);
        await page.screenshot({ path: path.join(OUT, `${LABEL}_${name}_${w}.png`) });
      }
      await ctx.close();
    }
    // the publish success screen (phone) and the admin list (both widths)
    {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      await page.goto(editUrl('elena-and-marco', setupSite.editKey, '#setup/1'));
      await page.waitForSelector('[data-setup="1"]');
      await page.fill('#f-date', '2027-09-18');
      await page.fill('#f-ceremony_time', '16:30');
      await page.waitForTimeout(2500);
      await page.goto(editUrl('elena-and-marco', setupSite.editKey, '#setup/3'));
      await page.waitForSelector('[data-setup="3"]');
      await page.click('[data-setup-publish]');
      await page.waitForSelector('[data-setup-done]', { timeout: 20_000 });
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(OUT, `${LABEL}_panel_published_390_burst.png`) });
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(OUT, `${LABEL}_panel_published_390.png`) });
      await ctx.close();
    }
    for (const [w, opts] of [
      [390, PHONE],
      [1280, WIDE],
    ] as const) {
      const ctx = await browser.newContext({ ...opts, locale: 'tr-TR' });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/admin`);
      await page.waitForSelector('[data-admin-login]');
      await page.fill('#admin-password', PASSWORD);
      await page.click('[data-admin-login] button[type=submit]');
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT, `${LABEL}_admin_${w}.png`) });
      await ctx.close();
    }
  }
} catch (e) {
  check('run', false, String((e as Error).stack ?? e));
} finally {
  await browser.close();
  server.stop();
}

const failed = checks.filter((c) => !c.ok);
writeFileSync(
  path.join(OUT, `checks_${LABEL}.json`),
  JSON.stringify(
    {
      tool: 'tests/g089-browser.ts (G089)',
      label: LABEL,
      date: new Date().toISOString().slice(0, 10),
      throttling: 'perf: CDP CPU 4×, 150 ms RTT, 1.6 Mbps down / 750 kbps up, cache disabled, 390 × 844 DPR 2',
      passed: checks.length - failed.length,
      failed: failed.length,
      metrics,
      checks,
    },
    null,
    2,
  ) + '\n',
);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
