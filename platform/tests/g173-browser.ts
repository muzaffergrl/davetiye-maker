// G173 performance + accessibility pass at phone size — browser checks on a production build (`next start`). Not part
// of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g173-browser.ts [--out <file.json>] [--only <substring>] [--no-a11y]
//
// For each route (sales site, /start, six sold and two coming demos with the opening sequence, a fresh local site's
// editor made through the /start claim flow):
// 1. Lab performance, cold cache, 390 × 844 DPR 2, CPU 4×, 150 ms RTT, 1.6 Mbps down (docs/14 §9.8): LCP (+ element),
//    CLS, TBT (long tasks after FCP until load + 3 s), INP-like worst interaction (Event Timing, one real tap), total
//    transfer, JS transfer, image transfer and the largest image.
// 2. Accessibility at 390 (unthrottled): axe-core serious / critical, tap targets under 24 × 24 px (WCAG 2.5.8; inline
//    links in text excluded), the first Tab stops (each must show a focus indicator), horizontal overflow, and with
//    prefers-reduced-motion: running CSS animations longer than 0.1 s.
// Writes previews/g173/<out> (default metrics.json). Exit 1 when a budget check fails (LCP ≤ 2.5 s, CLS ≤ 0.1,
// axe serious/critical = 0). Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`).

import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { MARKETING } from '../lib/marketing/config.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';

const { values: args } = parseArgs({ options: { out: { type: 'string', default: 'metrics.json' }, only: { type: 'string' }, 'no-a11y': { type: 'boolean' } } });
const OUT = path.join(ROOT, 'previews/g173');
mkdirSync(OUT, { recursive: true });
const PORT = Number(process.env.PORT || 3473);
const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' };

const SOLD = ['olive-ivory', 'blush-garden-rose', 'mediterranean-lemon', 'coastal-seaside', 'art-deco-black-tie', 'crimson-rose-atelier'];
const COMING = ['nocturne-lake-estate', 'music-box-ballerina'];
const live = liveDesigns().map((d) => d.id);
for (const id of SOLD) if (!live.includes(id)) throw new Error(`${id} is not a live design any more: pick another`);

type Interact = 'menu' | 'envelope' | 'button' | 'none';
const ROUTES: Array<{ path: string; interact: Interact }> = [
  { path: '/', interact: 'menu' },
  { path: '/designs', interact: 'menu' },
  { path: '/designs/olive-ivory', interact: 'menu' },
  { path: '/designs/coastal-seaside', interact: 'menu' },
  { path: '/my', interact: 'menu' },
  { path: '/pricing', interact: 'menu' },
  { path: '/faq', interact: 'menu' },
  { path: '/tr', interact: 'menu' },
  { path: '/de/designs', interact: 'menu' },
  { path: '/start?theme=olive-ivory', interact: 'button' },
  ...[...SOLD, ...COMING].map((id) => ({ path: `/start/demo/${id}`, interact: 'envelope' as Interact })),
];

const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: boolean, detail?: unknown) => {
  checks.push({ name, ok, ...(detail === undefined ? {} : { detail }) });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
};

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g173-data-'));
const server = startNext({ port: PORT, dataDir });
const BASE = server.base;
const browser = await loadChromium().launch();
const results: Record<string, any> = {};

const OBSERVE = () => {
  const w = window as any;
  Object.assign(w, { __lcp: 0, __lcpEl: '', __cls: 0, __long: [] as number[][], __fcp: 0, __inp: 0, __inpName: '' });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries() as any[]) {
      w.__lcp = e.startTime;
      const el = e.element as Element | null;
      w.__lcpEl = `${el?.tagName ?? ''}${el?.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} ${e.url ?? ''}`.trim();
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) w.__cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) w.__long.push([e.startTime, e.duration]);
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') w.__fcp = e.startTime;
  }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries() as any[]) if (e.interactionId && e.duration > w.__inp) [w.__inp, w.__inpName] = [e.duration, e.name];
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);
};

async function interact(page: any, kind: Interact): Promise<string> {
  if (kind === 'menu') {
    const b = page.locator('header button[aria-expanded]:visible, header summary:visible').first();
    if ((await b.count()) && (await b.tap({ timeout: 5000 }).then(() => true, () => false))) return 'header menu';
  }
  if (kind === 'envelope') {
    const s = page.locator('[role="button"][tabindex="0"]:visible').first();
    if ((await s.count()) && (await s.tap({ timeout: 5000 }).then(() => true, () => false))) return 'envelope';
  }
  const b = page.locator('main button:visible').first();
  if ((await b.count()) && (await b.tap({ timeout: 5000 }).then(() => true, () => false))) return 'first button';
  return 'none';
}

async function perf(url: string, kind: Interact, label: string) {
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const req = new Map<string, { url: string; type: string }>();
  const done: Array<{ url: string; type: string; bytes: number }> = [];
  cdp.on('Network.responseReceived', (e: any) => req.set(e.requestId, { url: e.response.url, type: e.type }));
  cdp.on('Network.loadingFinished', (e: any) => {
    const r = req.get(e.requestId);
    if (r) done.push({ ...r, bytes: e.encodedDataLength });
  });
  await page.addInitScript(OBSERVE);
  await page.goto(url, { waitUntil: 'load', timeout: 180_000 });
  const loadAt = await page.evaluate(() => performance.now());
  // long enough for a late LCP image on the throttled link (an envelope behind ~800 KB of opening parts)
  await page.waitForTimeout(6000);
  const firstLoad = done.slice();
  // load metrics are read BEFORE the tap: an envelope opens the home page as a new document (K23), whose observers
  // start from zero
  const m: Record<string, any> = await page.evaluate((loadAt: number) => {
    const w = window as any;
    const end = loadAt + 3000;
    const tbt = (w.__long as number[][]).filter(([s]) => s >= w.__fcp && s <= end).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
    return { lcp: Math.round(w.__lcp), lcpElement: w.__lcpEl, cls: Number(w.__cls.toFixed(4)), fcp: Math.round(w.__fcp), tbt: Math.round(tbt) };
  }, loadAt);
  const url0 = page.url();
  const did = await interact(page, kind);
  await page.waitForTimeout(kind === 'envelope' ? 6000 : 1500);
  // the interaction's Event Timing entry (the tap's own document; an opening that navigated reports on its new page)
  const inp = await page.evaluate(() => ({ inp: Math.round((window as any).__inp ?? 0), inpEvent: (window as any).__inpName ?? '', nav: performance.getEntriesByType('navigation').length }));
  Object.assign(m, { inp: inp.inp, inpEvent: inp.inpEvent, navigated: page.url() !== url0 });
  const kb = (list: typeof done, f: (r: (typeof done)[0]) => boolean) => Math.round(list.filter(f).reduce((a, r) => a + r.bytes, 0) / 1024);
  const imgs = firstLoad.filter((r) => r.type === 'Image').sort((a, b) => b.bytes - a.bytes);
  const r: Record<string, any> = {
    ...m,
    interaction: did,
    transferKB: kb(firstLoad, () => true),
    jsKB: kb(firstLoad, (r) => r.type === 'Script'),
    cssKB: kb(firstLoad, (r) => r.type === 'Stylesheet'),
    fontKB: kb(firstLoad, (r) => r.type === 'Font'),
    imageKB: kb(firstLoad, (r) => r.type === 'Image'),
    largestImage: imgs[0] ? { url: imgs[0].url.replace(BASE, ''), kb: Math.round(imgs[0].bytes / 1024) } : null,
    afterInteractionKB: kb(done.slice(firstLoad.length), () => true),
  };
  await ctx.close();
  return r;
}

async function a11y(url: string) {
  const out: any = {};
  {
    const ctx = await browser.newContext({ ...PHONE, bypassCSP: true });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
    await page.waitForTimeout(1500);
    await page.addScriptTag({ content: AXE });
    const ax = await page.evaluate(async () => {
      const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v: any) => ({ id: v.id, impact: v.impact, n: v.nodes.length, target: v.nodes.slice(0, 3).map((n: any) => n.target.join(' ')) }));
    });
    out.axe = ax.filter((v: any) => v.impact === 'serious' || v.impact === 'critical');
    out.axeMinor = ax.filter((v: any) => v.impact !== 'serious' && v.impact !== 'critical').map((v: any) => `${v.id}×${v.n}`);
    const geo = await page.evaluate(() => {
      const small: string[] = [];
      for (const el of Array.from(document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex="0"]'))) {
        // a control inside its <label> is tapped through the label; tabindex -1 (honeypot) and 1-px visually hidden file
        // inputs (their visible label is the target) are not targets of their own
        if (el.getAttribute('tabindex') === '-1') continue;
        const r = (el.tagName === 'INPUT' && el.closest('label') ? el.closest('label')! : el).getBoundingClientRect();
        if (r.width <= 2 && r.height <= 2) continue;
        const cs = getComputedStyle(el);
        if (!r.width || !r.height || !(el as any).checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })) continue;
        // inline links inside running text are exempt (WCAG 2.5.8 "inline")
        if (el.tagName === 'A' && cs.display === 'inline' && el.parentElement && /^(P|LI|SPAN|SMALL|DD|TD)$/.test(el.parentElement.tagName) && (el.parentElement.textContent || '').trim().length > (el.textContent || '').trim().length + 10) continue;
        if (r.width < 24 || r.height < 24) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return { small, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    out.smallTargets = geo.small;
    out.overflowX = geo.overflow;
    const stops: string[] = [];
    let noRing = 0;
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' || cs.textDecorationLine.includes('underline');
        return { name: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 24)}"`, ring };
      });
      if (!s) continue;
      stops.push(s.name);
      if (!s.ring) noRing++;
    }
    out.focusStops = stops;
    out.focusWithoutRing = noRing;
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
    await page.waitForTimeout(1200);
    out.reducedMotionAnimations = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running' && Number((a.effect as any)?.getComputedTiming?.().duration ?? 0) > 100)
        .map((a) => `${(a as any).animationName ?? a.constructor.name} ${((a.effect as any)?.target as Element)?.tagName ?? ''}`)
        .slice(0, 6),
    );
    await ctx.close();
  }
  return out;
}

async function claimEditor(): Promise<string> {
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/start?theme=olive-ivory`, { waitUntil: 'networkidle' });
  await page.fill('#start-order', '4821559173');
  await page.fill('#start-email', 'g173@example.test');
  await page.fill('#start-name1', 'Avery');
  await page.fill('#start-name2', 'Jordan');
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-edit-link]', { timeout: 60_000 });
  const url = await page.inputValue('[data-edit-link]');
  await ctx.close();
  return url;
}

try {
  await waitForServer(`${BASE}/robots.txt`, 90_000, server);
  const want = (p: string) => !args.only || p.includes(args.only);
  const routes: Array<{ path: string; interact: Interact; url: string }> = ROUTES.filter((r) => want(r.path)).map((r) => ({ ...r, url: BASE + r.path }));
  if (want('/edit')) {
    const edit = await claimEditor();
    for (const v of ['setup/1', 'home', 'edit', 'edit/photos', 'guests', 'share']) routes.push({ path: `/edit/<slug>#${v}`, interact: 'button', url: `${edit}#${v}` });
  }
  // Every design's envelope (live and coming): Tab reaches the stage and it shows a focus ring (docs/11 §10).
  if (want('/start/demo') && !args['no-a11y']) {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const missing: string[] = [];
    for (const d of MARKETING.designs) {
      await page.goto(`${BASE}/start/demo/${d.id}`, { waitUntil: 'load', timeout: 120_000 });
      let ring: boolean | null = null;
      for (let i = 0; i < 4 && ring === null; i++) {
        await page.keyboard.press('Tab');
        ring = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || !el.matches('[role="button"][tabindex="0"]')) return null;
          // a ring = some outline / filter / shadow of the stage or a part inside it that differs from the unfocused stage
          const look = () =>
            [el, ...Array.from(el.querySelectorAll('*'))]
              .map((e) => {
                const cs = getComputedStyle(e);
                return `${cs.outlineStyle === 'none' ? '' : cs.outlineStyle + cs.outlineWidth + cs.outlineColor}|${cs.filter}|${cs.boxShadow}`;
              })
              .join(';');
          const focused = look();
          el.blur();
          const plain = look();
          el.focus();
          return focused !== plain;
        });
      }
      if (ring !== true) missing.push(`${d.id}${ring === null ? ' (stage not reached)' : ''}`);
    }
    check(`all ${MARKETING.designs.length} demos: the focused envelope shows a focus ring`, missing.length === 0, missing.length ? missing : undefined);
    await ctx.close();
  }
  for (const r of routes) {
    // warm the route once (compiles nothing in prod, but fills the server's caches) so the lab run measures the page
    await fetch(r.url.replace(/#.*/, '')).catch(() => {});
    const p = await perf(r.url, r.interact, r.path);
    const a = args['no-a11y'] ? {} : await a11y(r.url);
    results[r.path] = { ...p, ...a };
    console.log(`${r.path}: LCP ${p.lcp} ms (${p.lcpElement}) CLS ${p.cls} TBT ${p.tbt} INP~${p.inp} (${p.interaction}) ${p.transferKB} KB (JS ${p.jsKB}, img ${p.imageKB}, font ${p.fontKB})`);
    check(`${r.path}: LCP ≤ 2.5 s`, p.lcp > 0 && p.lcp <= 2500, p.lcp);
    check(`${r.path}: CLS ≤ 0.1`, p.cls <= 0.1, p.cls);
    if (!args['no-a11y']) {
      check(`${r.path}: axe serious/critical = 0`, a.axe.length === 0, a.axe.length ? a.axe : undefined);
      check(`${r.path}: no horizontal overflow at 390`, a.overflowX <= 0, a.overflowX || undefined);
      if (a.smallTargets.length) console.log(`     small targets: ${a.smallTargets.slice(0, 6).join(' | ')}`);
      if (a.focusWithoutRing) console.log(`     focus stops without a visible ring: ${a.focusWithoutRing}/${a.focusStops.length}`);
      if (a.reducedMotionAnimations.length) console.log(`     reduced motion still animating: ${a.reducedMotionAnimations.join(' | ')}`);
    }
  }
} finally {
  writeFileSync(path.join(OUT, args.out!), JSON.stringify({ date: new Date().toISOString(), results, checks }, null, 2) + '\n');
  await browser.close();
  server.stop();
}
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → previews/g173/${args.out}`);
process.exit(failed.length ? 1 : 0);
