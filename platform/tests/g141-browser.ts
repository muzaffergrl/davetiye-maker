// G141 (K45 item 7) interactive showcase — browser checks on a production build (`next start`). Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g141-browser.ts [--no-shots] [--no-perf]
//
// 1. Lab performance at 390 px, the marketing-browser.ts budget (CPU 4×, 150 ms RTT, 1.6 Mbps down, cache off):
//    LCP ≤ 2.5 s, CLS ≤ 0.05, ≤ 600 KB transferred — home, /designs, two design pages. No opening clip is requested
//    before a visitor scrolls or interacts (first screen of / and /designs).
// 2. Interactions: hover on a card (1280) plays its real opening; ▶ on a phone card plays it and ■ stops it; ticking two
//    cards shows the compare tray, "Compare side by side" opens a dialog with two playing recordings, Esc closes it;
//    the editing tour's step buttons switch the panel screen and caption; reduced motion: hover does not play, the tour
//    does not move by itself, no section waits for a reveal.
// 3. axe-core (serious / critical) on /, /designs and a design page at 390; no horizontal page scroll at 390 / 1280.
// 4. Screenshots 390 / 1280 → previews/g141/.
// Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`). Exit 1 when a check fails.

import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';

const args = process.argv.slice(2);
const SHOTS = !args.includes('--no-shots');
const PERF = !args.includes('--no-perf');
const OUT = path.join(ROOT, 'previews/g141');
mkdirSync(OUT, { recursive: true });
const PORT = Number(process.env.PORT || 3491);
const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: boolean, detail?: unknown) => {
  checks.push({ name, ok, ...(detail === undefined ? {} : { detail }) });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
};

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g141-data-'));
const server = startNext({ port: PORT, dataDir });
const BASE = server.base;
const browser = await loadChromium().launch();
const metrics: Record<string, unknown> = {};
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' };
const WIDE = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'en-US' };
// This Chromium build has no H.264 decoder (canPlayType('avc1') === ''): the openings (H.264 MP4) cannot play here, so
// the check falls back to "the <video> with the design's real clip was created and its file requested". Real playback
// is then NOT verified by this run (say so in the report).
let H264 = true;
const playing = (page: any, sel: string) =>
  page.evaluate((s: string) => {
    const v = document.querySelector(s) as HTMLVideoElement | null;
    const e = performance.getEntriesByType('resource').some((r) => v && r.name.endsWith(v.getAttribute('src') || '~'));
    return v ? { paused: v.paused, t: Number(v.currentTime.toFixed(2)), src: v.getAttribute('src'), requested: e } : null;
  }, sel);
const started = (v: any) => !!v && (H264 ? !v.paused && v.t > 0 : /\/opening\.mp4$/.test(v.src) && v.requested);

try {
  await waitForServer(`${BASE}/robots.txt`, 60_000, server);
  const designs = liveDesigns();
  {
    const page = await browser.newPage();
    H264 = (await page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"'))) !== '';
    await page.close();
    check(`note: this Chromium ${H264 ? 'plays' : 'cannot play'} H.264 (playback checks ${H264 ? 'real' : 'fall back to element + request'})`, true);
  }

  if (PERF) {
    for (const p of ['/', '/designs', `/designs/${designs[1].id}`, `/designs/${designs[designs.length - 1].id}`]) {
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
      const mp4: string[] = [];
      cdp.on('Network.requestWillBeSent', (e: any) => {
        if (/\.mp4(\?|$)/.test(e.request.url)) mp4.push(e.request.url.replace(BASE, ''));
      });
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
      });
      await page.goto(BASE + p, { waitUntil: 'load', timeout: 120_000 });
      await page.waitForTimeout(3000);
      const m = await page.evaluate(() => {
        const w = window as any;
        return { lcp: Math.round(w.__lcp), lcpElement: w.__lcpEl, cls: Number(w.__cls.toFixed(4)) };
      });
      const r = { ...m, transferredKB: Math.round(total / 1024), scriptKB: Math.round(scripts / 1024), mp4 };
      metrics[p] = r;
      check(`perf ${p}: LCP ≤ 2.5 s (lab, CPU 4×, slow 4G)`, r.lcp > 0 && r.lcp <= 2500, { lcp: r.lcp, el: r.lcpElement });
      check(`perf ${p}: CLS ≤ 0.05`, r.cls <= 0.05, r.cls);
      check(`perf ${p}: first load ≤ 600 KB transferred`, r.transferredKB <= 600, { total: r.transferredKB, script: r.scriptKB });
      if (p === '/' || p === '/designs') check(`perf ${p}: no opening clip requested before a scroll or a tap`, mp4.length === 0, mp4);
      await ctx.close();
    }
  }

  // ---- interactions, wide: hover plays the real opening, compare dialog, tour
  {
    const ctx = await browser.newContext(WIDE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/designs`, { waitUntil: 'networkidle' });
    const card = page.locator('[data-gallery="designs"] article').nth(2);
    await card.scrollIntoViewIfNeeded();
    await card.locator('a[tabindex="-1"]').hover();
    await page.waitForTimeout(1500);
    const hv = await playing(page, '[data-gallery="designs"] article:nth-child(3) video');
    check('1280 /designs: hovering a card plays its opening recording', started(hv), hv);
    if (SHOTS) await card.screenshot({ path: path.join(OUT, 'card_hover_1280.png') });
    await page.mouse.move(5, 5);
    await page.waitForTimeout(400);
    const left = await playing(page, '[data-gallery="designs"] article:nth-child(3) video');
    check('1280 /designs: leaving the card pauses and rewinds it', !!left && left.paused && left.t === 0, left);
    check('1280 /designs: the video only exists on the hovered card', (await page.locator('[data-gallery="designs"] article video').count()) === 1);

    await page.locator('[data-gallery="designs"] input[data-compare]').nth(0).check();
    await page.locator('[data-gallery="designs"] input[data-compare]').nth(4).check();
    await page.waitForSelector('[data-compare-tray]');
    check('1280 /designs: two ticks show the compare tray', (await page.locator('[data-compare-tray]').innerText()).includes('Compare 2 designs'));
    if (SHOTS) await page.screenshot({ path: path.join(OUT, 'compare_tray_1280.png') });
    await page.click('[data-compare-open]');
    await page.waitForSelector('dialog[open] video');
    await page.waitForTimeout(2500);
    const vids = await page.evaluate(() => Array.from(document.querySelectorAll('dialog[open] video')).map((v) => ({ playing: !(v as HTMLVideoElement).paused, src: v.getAttribute('src') })));
    check('1280 compare dialog: the two picked designs\' recordings', vids.length === 2 && vids.every((v: any) => (H264 ? v.playing : /opening\.mp4$/.test(v.src || ''))), vids);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, 'compare_dialog_1280.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check('1280 compare dialog: Esc closes it', (await page.locator('dialog[open]').count()) === 0);

    await page.goto(`${BASE}/#edit`, { waitUntil: 'networkidle' });
    await page.locator('[data-tour] button[aria-current]').waitFor();
    await page.locator('[data-tour] ol button').nth(5).click();
    await page.waitForTimeout(600);
    const cap = await page.locator('[data-tour] h3').innerText();
    check('1280 tour: a step button shows that step (Music)', /music/i.test(cap), cap);
    if (SHOTS) await page.locator('[data-tour]').screenshot({ path: path.join(OUT, 'tour_1280.png') });
    await ctx.close();
  }

  // ---- interactions, phone: ▶ plays, ■ stops
  {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const btn = page.locator('[data-gallery="home"] [data-card-play]').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.tap();
    await page.waitForTimeout(1500);
    const v = await playing(page, '[data-gallery="home"] article:first-child video');
    check('390 /: ▶ on a card plays its opening', started(v), v);
    if (SHOTS) await page.locator('[data-gallery="home"] article').first().screenshot({ path: path.join(OUT, 'card_play_390.png') });
    if (H264) {
      await btn.tap();
      await page.waitForTimeout(300);
      const st = await playing(page, '[data-gallery="home"] article:first-child video');
      check('390 /: ■ stops it', !!st && st.paused, st);
    }
    await page.evaluate(() => document.querySelector('[data-tour] > :first-child')!.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(500);
    const before = await page.locator('[data-tour] h3').innerText();
    await page.waitForTimeout(4300);
    const after = await page.locator('[data-tour] h3').innerText();
    check('390 /: the tour moves on by itself while on screen', before !== after, { before, after });
    if (SHOTS) await page.locator('#edit').locator('xpath=ancestor::section').screenshot({ path: path.join(OUT, 'tour_390.png') });
    await ctx.close();
  }

  // ---- reduced motion
  {
    const ctx = await browser.newContext({ ...WIDE, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const hidden = await page.evaluate(() => document.querySelectorAll('[data-fx-reveal]:not([data-fx-in])').length);
    check('reduced motion: no section waits for a reveal on /', hidden === 0, hidden);
    const card = page.locator('[data-gallery="home"] article').first();
    await card.locator('a[tabindex="-1"]').hover();
    await page.waitForTimeout(800);
    check('reduced motion: hover does not play a card', (await page.locator('[data-gallery="home"] article:first-child video').count()) === 0);
    await page.locator('#edit').scrollIntoViewIfNeeded();
    const before = await page.locator('[data-tour] h3').innerText();
    await page.waitForTimeout(4300);
    check('reduced motion: the tour stays on its step', before === (await page.locator('[data-tour] h3').innerText()));
    await ctx.close();
  }

  // ---- axe + overflow + screenshots
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
      if (SHOTS) await page.screenshot({ path: path.join(OUT, `${name}_${w}_top.png`) });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${p} @${w}: no horizontal page scroll`, over <= 0, over);
      if (w === 390) {
        await page.addScriptTag({ content: AXE });
        const v = await page.evaluate(async () => {
          const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
          return r.violations.filter((x: any) => x.impact === 'serious' || x.impact === 'critical').map((x: any) => `${x.id}: ${x.nodes.length} (${x.nodes[0]?.target})`);
        });
        check(`${p} @390: axe — no serious/critical violation`, v.length === 0, v);
      }
      if (SHOTS) await page.screenshot({ path: path.join(OUT, `${name}_${w}_full.jpg`), fullPage: true, quality: 62 });
    }
    await ctx.close();
  }
} catch (e) {
  check('run', false, String((e as Error).stack ?? e));
} finally {
  await browser.close();
  server.stop();
}

const failed = checks.filter((c) => !c.ok);
writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify(
    {
      tool: 'tests/g141-browser.ts (G141)',
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
