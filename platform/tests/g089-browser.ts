// G089 browser checks of the K31 effects on a production build (`next start`). Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=<folder with playwright> node tests/g089-browser.ts [--out previews/g089] [--label after] [--perf-only]
//   (--perf-only: only §4, e.g. on the build from before G089 for the before/after numbers)
//
// 1. Reduced motion (prefers-reduced-motion: reduce) at 390 and 1280: on /, /designs and a design page every word of
//    the staggered H1 is fully visible at once (opacity 1, no transform), no block is hidden for the scroll reveal
//    (no data-reveal), and the design cards never tilt.
// 2. Normal motion at 390 and 1280: the H1 words end fully visible; blocks below the first screen wait
//    (data-reveal="wait"), blocks on the first screen are never hidden; after scrolling to the end every block is in
//    (data-reveal="in", opacity 1); CLS over load + full scroll stays ≤ 0.1. At 1280 a mouse over a design card tilts it
//    and it settles back flat when the mouse leaves.
// 3. Panel (seeded _sample site): changing view (#home → #edit → #share) fades the main column in (an opacity
//    animation runs) and nothing fades with reduced motion.
// 4. Lab performance at 390 px (same throttling as tests/marketing-browser.ts §3: CPU 4×, 150 ms RTT, 1.6 Mbps): LCP,
//    LCP element, CLS, transferred and script KB for / , /designs and a design page; written to <out>/perf_<label>.json.
// 5. Screenshots (viewport, scrolled through so every block has revealed): <out>/<page>_<390|1280>.jpg.
// Playwright from NODE_PATH (or /opt/node22); never runs `playwright install`. Exit 1 when a check fails.

import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';

const args = process.argv.slice(2);
const opt = (name: string, dflt: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const OUT = path.resolve(ROOT, opt('--out', 'previews/g089'));
const LABEL = opt('--label', 'after');
const PERF_ONLY = args.includes('--perf-only');
const PORT = Number(process.env.PORT || 3389);
mkdirSync(OUT, { recursive: true });

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok || detail === undefined ? '' : ` — ${JSON.stringify(detail)}`}`);
}

const designs = liveDesigns();
const PAGES = ['/', '/designs', `/designs/${designs[0].id}`];
const shotName = (p: string) => (p === '/' ? 'home' : p.slice(1).replace(/\//g, '_'));

// Panel site: the _sample theme and the demo content, as tests/panel-browser.ts seeds it.
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g089-data-'));
const themesDir = mkdtempSync(path.join(os.tmpdir(), 'g089-themes-'));
cpSync(path.join(ROOT, 'themes/_sample'), path.join(themesDir, '_sample'), { recursive: true });
process.env.PLATFORM_THEMES_DIR = themesDir;
const content = JSON.parse(readFileSync(path.join(ROOT, '..', 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const adapter = new LocalAdapter(dataDir);
const SLUG = 'clara-and-julian';
const seeded = await createSiteWithKeys(adapter, { slug: SLUG, theme: '_sample', content });
const server = startNext({ port: PORT, dataDir, env: { PLATFORM_THEMES_DIR: themesDir } });
const BASE = server.base;
const chromium = loadChromium();
const browser = await chromium.launch();
const metrics: Record<string, unknown> = {};

/** Scrolls to the end in viewport steps (so the IntersectionObserver sees every block), then back to the top. */
async function scrollThrough(page: any) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 700));
  });
}

async function state(page: any) {
  return page.evaluate(() => {
    const words = Array.from(document.querySelectorAll<HTMLElement>('[data-fx="stagger"] > span'));
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    return {
      words: words.length,
      wordsVisible: words.every((w) => {
        const cs = getComputedStyle(w);
        return cs.opacity === '1' && (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)');
      }),
      text: document.querySelector('h1')?.textContent ?? '',
      waiting: blocks.filter((b) => b.dataset.reveal === 'wait').length,
      revealed: blocks.filter((b) => b.dataset.reveal === 'in').length,
      hiddenOnFirstScreen: blocks.filter((b) => b.dataset.reveal === 'wait' && b.getBoundingClientRect().top < window.innerHeight).length,
      notOpaque: blocks.filter((b) => b.dataset.reveal === 'in' && getComputedStyle(b).opacity !== '1').length,
    };
  });
}

try {
  await waitForServer(`${BASE}/`, 60_000, server);

  for (const width of PERF_ONLY ? [] : [390, 1280]) {
    const height = width === 390 ? 844 : 800;
    const mobile = width === 390;
    const ctxOpts = { viewport: { width, height }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile };

    // 1. reduced motion
    const rctx = await browser.newContext({ ...ctxOpts, reducedMotion: 'reduce' });
    const rpage = await rctx.newPage();
    for (const p of PAGES) {
      await rpage.goto(BASE + p, { waitUntil: 'load' });
      await rpage.waitForTimeout(150);
      const st = await state(rpage);
      check(`reduced ${width} ${p}: H1 words all visible at once`, st.words > 0 && st.wordsVisible, st);
      check(`reduced ${width} ${p}: nothing hidden for the scroll reveal`, st.waiting + st.revealed === 0, st);
    }
    if (!mobile) {
      await rpage.goto(`${BASE}/designs`, { waitUntil: 'load' });
      const card = rpage.locator('[data-fx="tilt"]').first();
      const box = await card.boundingBox();
      await rpage.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.9, { steps: 6 });
      await rpage.waitForTimeout(400);
      check(`reduced ${width}: design card does not tilt`, (await card.evaluate((e: HTMLElement) => e.style.transform)) === '');
    }
    await rctx.close();

    // 2. normal motion + 5. screenshots
    const ctx = await browser.newContext(ctxOpts);
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const p of PAGES) {
      await page.goto(BASE + p, { waitUntil: 'load' });
      if (p === '/' && mobile) {
        // a frame from the middle of the entrance (words still dropping in) for the previews
        await page.reload({ waitUntil: 'commit' });
        await page.waitForSelector('[data-fx="stagger"]');
        await page.waitForTimeout(260);
        await page.screenshot({ path: path.join(OUT, 'home_390_intro_frame.jpg'), quality: 80 });
      }
      await page.waitForTimeout(1600);
      const before = await state(page);
      check(`motion ${width} ${p}: H1 words end fully visible`, before.words > 0 && before.wordsVisible, before);
      check(`motion ${width} ${p}: blocks on the first screen are never hidden`, before.hiddenOnFirstScreen === 0, before);
      check(`motion ${width} ${p}: blocks below the first screen wait for the scroll reveal`, before.waiting > 0, before);
      await page.screenshot({ path: path.join(OUT, `${shotName(p)}_${width}_top.jpg`), quality: 80 });
      await scrollThrough(page);
      const after = await state(page);
      check(`motion ${width} ${p}: every block revealed after scrolling`, after.waiting === 0 && after.notOpaque === 0, after);
      const cls = await page.evaluate(() => Number((window as any).__cls.toFixed(4)));
      check(`motion ${width} ${p}: CLS ≤ 0.1 over load and full scroll`, cls <= 0.1, cls);
      metrics[`cls_scroll_${width}_${p}`] = cls;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, `${shotName(p)}_${width}.jpg`), fullPage: true, quality: 72 });
    }
    if (!mobile) {
      await page.goto(`${BASE}/designs`, { waitUntil: 'load' });
      const card = page.locator('[data-fx="tilt"]').first();
      await card.scrollIntoViewIfNeeded();
      const box = await card.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.1, { steps: 8 });
      await page.waitForTimeout(500);
      const tilted = await card.evaluate((e: HTMLElement) => e.style.transform);
      check(`motion ${width}: design card tilts under the mouse`, /rotateX\(-?[\d.]+deg\) rotateY\([\d.]+deg\)/.test(tilted) && tilted !== '', tilted);
      await page.screenshot({ path: path.join(OUT, `designs_card_tilt_${width}.jpg`), clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 40), width: box.width + 80, height: box.height + 80 }, quality: 85 });
      await page.mouse.move(5, 5, { steps: 4 });
      await page.waitForTimeout(1500);
      check(`motion ${width}: design card settles back flat`, (await card.evaluate((e: HTMLElement) => e.style.transform)) === '');
    }
    await ctx.close();
  }

  // 3. panel view fade
  for (const reduced of PERF_ONLY ? [] : [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/edit/${SLUG}?k=${seeded.editKey}#home`, { waitUntil: 'load' });
    await page.waitForSelector('main#main h1');
    await page.waitForTimeout(500);
    const fades: number[] = [];
    for (const hash of ['#edit', '#share', '#home']) {
      await page.evaluate((h: string) => (window.location.hash = h), hash);
      await page.waitForTimeout(40);
      fades.push(await page.evaluate(() => document.querySelector('main#main')!.getAnimations().length));
      await page.waitForTimeout(400);
    }
    if (reduced) check('panel reduced: no view fade', fades.every((n) => n === 0), fades);
    else {
      check('panel: changing view fades the main column in', fades.every((n) => n > 0), fades);
      await page.evaluate(() => (window.location.hash = '#edit'));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, 'panel_edit_390.jpg'), quality: 80 });
    }
    await ctx.close();
  }

  // 4. lab performance
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
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
      (window as any).__lcp = 0;
      (window as any).__lcpEl = '';
      (window as any).__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as any[]) {
          (window as any).__lcp = e.startTime;
          (window as any).__lcpEl = `${e.element?.tagName ?? ''} ${e.url ?? ''}`.trim();
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 120_000 });
    await page.waitForTimeout(3000);
    const m = await page.evaluate(() => ({
      lcp: Math.round((window as any).__lcp),
      lcpElement: (window as any).__lcpEl,
      cls: Number((window as any).__cls.toFixed(4)),
    }));
    metrics[p] = { ...m, transferredKB: Math.round(total / 1024), scriptKB: Math.round(scripts / 1024) };
    check(`perf ${p}: CLS ≤ 0.1`, m.cls <= 0.1, m);
    await ctx.close();
  }
} catch (e) {
  check('run', false, String((e as Error).stack ?? e));
} finally {
  writeFileSync(path.join(OUT, `perf_${LABEL}.json`), `${JSON.stringify(metrics, null, 2)}\n`);
  await browser.close();
  server.stop();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
