// G180 theme performance checks on a production build (`next start`), every theme's demo. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g180-browser.ts [--only <substring>] [--skip-perf] [--out <file.json>]
//
// 1. CLS of the envelope page at 390 × 844 DPR 2, CPU 4×, 150 ms RTT, 1.6 Mbps (the G173 method), twice: as it comes,
//    and with every Google Fonts file held back 3 s (the web face lands after site.js fitted the names on the fallback,
//    the worst case of a slow font) — both ≤ 0.1. LCP is reported (not a budget here: G173 / docs/14 §9.8).
// 2. Names fallback faces (scripts/font-fallback.ts): with fonts.gstatic.com blocked the names, the kicker and the
//    stage sit where they sit with the web fonts (±2 px).
// 3. Deferred opening parts ([data-defer], docs/11 §6): on the throttled link no deferred image is requested before
//    the stage's high-priority image has loaded, and all of them have loaded by 3 s after the load event (before a tap).
// 4. Fixed bottom nav: on every inner page (and the RSVP page with "accept" chosen) scrolled to the very end, no text or
//    control of the page lies under the fixed nav.
// Writes previews/g180/<out> (default metrics.json); exit 1 when a check fails. Playwright from NODE_PATH and
// /opt/pw-browsers (never `playwright install`).

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';

const { values: args } = parseArgs({ options: { out: { type: 'string', default: 'metrics.json' }, only: { type: 'string' }, 'skip-perf': { type: 'boolean' } } });
const OUT = path.join(ROOT, 'previews/g180');
mkdirSync(OUT, { recursive: true });
const PORT = Number(process.env.PORT || 3480);
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' };
const ids = readdirSync(path.join(ROOT, 'themes'))
  .filter((d) => !d.startsWith('_') && existsSync(path.join(ROOT, 'themes', d, 'theme.json')))
  .filter((d) => !args.only || d.includes(args.only));
// designs added after G180 (no names fallback faces yet, scripts/font-fallback.ts) are listed, not checked
const later = ids.filter((d) => !readFileSync(path.join(ROOT, 'themes', d, 'index.html'), 'utf8').includes('names fallback: scripts/font-fallback.ts'));
if (later.length) console.log(`not checked (no names fallback faces yet): ${later.join(', ')}`);
ids.splice(0, ids.length, ...ids.filter((d) => !later.includes(d)));

const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: boolean, detail?: unknown) => {
  checks.push({ name, ok, ...(detail === undefined ? {} : { detail }) });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
};

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g180-data-'));
const server = startNext({ port: PORT, dataDir });
const BASE = server.base;
const browser = await loadChromium().launch();
const results: Record<string, any> = {};

const OBSERVE = () => {
  const w = window as any;
  Object.assign(w, { __lcp: 0, __lcpEl: '', __cls: 0, __shifts: [] });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries() as any[]) [w.__lcp, w.__lcpEl] = [e.startTime, `${e.element?.className ?? ''} ${(e.url ?? '').split('/').pop()}`.trim()];
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries() as any[]) {
      if (e.hadRecentInput) continue;
      w.__cls += e.value;
      if (e.value > 0.005) w.__shifts.push([Math.round(e.startTime), Number(e.value.toFixed(4)), (e.sources ?? []).map((s: any) => `${s.node?.nodeName ?? ''}.${typeof s.node?.className === 'string' ? s.node.className.split(' ')[0] : ''}`).join(',')]);
    }
  }).observe({ type: 'layout-shift', buffered: true });
};

/** The envelope page on the throttled link; lateFont holds every fonts.gstatic.com file back that many ms. */
async function envelope(id: string, lateFont = 0) {
  const ctx = await browser.newContext(PHONE);
  if (lateFont) await ctx.route(/fonts\.gstatic\.com/, async (r: any) => (await new Promise((x) => setTimeout(x, lateFont)), r.continue()));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const req = new Map<string, { url: string; start: number; end?: number; bytes?: number }>();
  cdp.on('Network.requestWillBeSent', (e: any) => req.set(e.requestId, { url: e.request.url, start: e.timestamp }));
  cdp.on('Network.loadingFinished', (e: any) => Object.assign(req.get(e.requestId) ?? {}, { end: e.timestamp, bytes: e.encodedDataLength }));
  await page.addInitScript(OBSERVE);
  await page.goto(`${BASE}/start/demo/${id}`, { waitUntil: 'load', timeout: 180_000 });
  const loadAt = Date.now();
  await page.waitForTimeout(6000 + lateFont);
  const m: { lcp: number; lcpElement: string; cls: number; shifts: unknown[]; high: string[]; shared: string[]; deferred: Array<{ url: string; done: boolean }> } = await page.evaluate(() => {
    const w = window as any;
    const urls = (sel: string) => [...document.querySelectorAll<HTMLImageElement>(sel)].map((i) => i.currentSrc || i.src).filter(Boolean);
    return {
      lcp: Math.round(w.__lcp), lcpElement: w.__lcpEl, cls: Number(w.__cls.toFixed(4)), shifts: w.__shifts,
      high: urls('.stage img[fetchpriority="high"]'),
      // a deferred part that shares its file with an image shown at once (a divider, an accent) is fetched for that one
      shared: urls('img:not([data-defer])'),
      deferred: [...document.querySelectorAll<HTMLImageElement>('img[data-defer]')].filter((i) => i.getClientRects().length).map((i) => ({ url: i.currentSrc, done: i.complete && i.naturalWidth > 0 })),
    };
  });
  const list = [...req.values()];
  const at = (u: string) => list.find((r) => r.url === u);
  const highEnd = Math.max(0, ...m.high.map((u) => at(u)?.end ?? 0));
  const early = m.deferred.filter((d) => !m.shared.includes(d.url)).map((d) => at(d.url)).filter((r) => r && highEnd && r.start < highEnd - 0.001).map((r) => r!.url.split('/').pop());
  await ctx.close();
  return { ...m, kb: Math.round(list.reduce((a, r) => a + (r.bytes ?? 0), 0) / 1024), early, sinceLoad: Date.now() - loadAt };
}

/** Names / kicker / stage boxes of the envelope page, with or without the web fonts. */
async function geometry(id: string, blockFonts: boolean) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (blockFonts) await ctx.route(/fonts\.gstatic\.com/, (r: any) => r.abort());
  const page = await ctx.newPage();
  await page.goto(`${BASE}/start/demo/${id}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const g = await page.evaluate(() =>
    Object.fromEntries(['.names', '.kicker', '.stage'].map((s) => {
      const r = document.querySelector(s)?.getBoundingClientRect();
      return [s, r ? [Math.round(r.top), Math.round(r.height)] : null];
    })),
  );
  await ctx.close();
  return g as Record<string, [number, number] | null>;
}

/** Text and controls under the fixed bottom nav, each inner page scrolled to the very end. */
async function underNav(id: string) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const out: Record<string, string[]> = {};
  for (const pg of ['home', 'story', 'details', 'rsvp', 'rsvp+accept']) {
    const res = await page.goto(`${BASE}/start/demo/${id}/${pg.replace('+accept', '')}?preview=demo`, { waitUntil: 'load' }).catch(() => null);
    if (!res || res.status() >= 400) continue;
    await page.evaluate(() => document.fonts.ready);
    if (pg === 'rsvp+accept') await page.locator('input[type=radio]').first().check({ force: true }).catch(() => {});
    // walk down (scroll-in reveals), then the very end
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) (scrollTo(0, y), await new Promise((r) => setTimeout(r, 60)));
      scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.waitForTimeout(900);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    out[pg] = await page.evaluate(() => {
      const vh = innerHeight;
      const navs = [...document.querySelectorAll<HTMLElement>('body *')].filter((e) => {
        const cs = getComputedStyle(e), r = e.getBoundingClientRect();
        return (cs.position === 'fixed' || cs.position === 'sticky') && r.width > 200 && r.height > 20 && r.bottom >= vh - 2 && r.top > vh * 0.6 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.1;
      });
      if (!navs.length) return [];
      const top = Math.min(...navs.map((n) => n.getBoundingClientRect().top));
      const hidden = (el: Element) => { for (let a: Element | null = el; a; a = a.parentElement) { const c = getComputedStyle(a); if (c.display === 'none' || Number(c.opacity) === 0 || c.visibility === 'hidden') return true; } return false; };
      const hits: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (!n.textContent?.trim() || !el || navs.some((v) => v.contains(el)) || el.closest('[aria-hidden="true"]') || hidden(el)) continue;
        const rg = document.createRange();
        rg.selectNodeContents(n);
        if ([...rg.getClientRects()].some((rc) => rc.height > 0 && rc.width > 0 && rc.bottom > top + 1 && rc.top < vh)) hits.push(n.textContent.trim().slice(0, 30));
      }
      for (const el of document.querySelectorAll('input, button, select, textarea, a')) {
        if (navs.some((v) => v.contains(el)) || hidden(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.bottom > top + 1 && r.top < vh) hits.push(`<${el.tagName.toLowerCase()}> ${(el.textContent || (el as HTMLInputElement).name || '').trim().slice(0, 24)}`);
      }
      return hits;
    });
  }
  await ctx.close();
  return out;
}

try {
  await waitForServer(BASE, 60_000, server);
  for (const id of ids) {
    await fetch(`${BASE}/start/demo/${id}`).catch(() => {});
    const r: Record<string, any> = (results[id] = {});
    if (!args['skip-perf']) {
      r.load = await envelope(id);
      r.lateFont = await envelope(id, 3000);
      console.log(`${id}: LCP ${r.load.lcp} ms (${r.load.lcpElement}) ${r.load.kb} KB · CLS ${r.load.cls} · fonts +3 s CLS ${r.lateFont.cls}`);
      check(`${id}: CLS ≤ 0.1`, r.load.cls <= 0.1, r.load.cls > 0.1 ? r.load.shifts : r.load.cls);
      check(`${id}: CLS ≤ 0.1 with the fonts 3 s late`, r.lateFont.cls <= 0.1, r.lateFont.cls > 0.1 ? r.lateFont.shifts : r.lateFont.cls);
      if (r.load.deferred.length) {
        check(`${id}: no deferred opening part requested before the closed object loaded`, r.load.early.length === 0, r.load.early.length ? r.load.early : undefined);
        const missing = r.load.deferred.filter((d: any) => !d.done).map((d: any) => d.url.split('/').pop());
        check(`${id}: every deferred opening part loaded before the tap (load + 6 s)`, missing.length === 0, missing.length ? missing : r.load.deferred.length);
      }
    }
    const [web, fb] = [await geometry(id, false), await geometry(id, true)];
    const off = Object.keys(web).filter((k) => web[k] && fb[k] && (Math.abs(web[k]![0] - fb[k]![0]) > 2 || Math.abs(web[k]![1] - fb[k]![1]) > 2));
    r.geometry = { web, fallback: fb };
    check(`${id}: names fallback sets the names where the web font does (±2 px)`, off.length === 0, off.length ? off.map((k) => `${k} ${web[k]} → ${fb[k]}`) : undefined);
    r.underNav = await underNav(id);
    const hits = Object.entries(r.underNav).filter(([, h]) => (h as string[]).length);
    check(`${id}: nothing under the fixed bottom nav at the end of a page`, hits.length === 0, hits.length ? Object.fromEntries(hits) : undefined);
  }
} finally {
  writeFileSync(path.join(OUT, args.out!), JSON.stringify({ date: new Date().toISOString(), results, checks }, null, 2) + '\n');
  await browser.close();
  server.stop();
}
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → previews/g180/${args.out}`);
process.exit(failed.length ? 1 : 0);
