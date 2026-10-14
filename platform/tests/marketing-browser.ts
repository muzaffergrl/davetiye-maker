// G061 browser checks of the marketing site on a production build (`next start`). Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/marketing-browser.ts [--out previews/g061] [--no-shots]
//
// 1. Every marketing page at 390 × 844 (phone, touch), 1280 × 800 and 320 × 640 (smallest phone, no shots): HTTP 200,
//    no horizontal page scroll, nothing cut off at the right edge, one H1; full-page screenshots <page>_<390|1280>.jpg.
//    G066: at 390 every page also passes axe-core 4.13.0 (no serious/critical violation, incl. color contrast) and has
//    no touch target under 44 × 44 px (links inside running text excepted); the BKE Studio logos, tab icons and web
//    manifest are wired.
// 2. Live demo facade: before a tap no theme file is requested; on a phone the demo opens in a modal <dialog>
//    (iframe = /start/demo/<id>, the theme loads), Esc closes it and focus returns; on a wide screen it loads in place.
//    Card "Open live demo" opens the dialog; the mobile menu and FAQ <details> open; the sticky bar shows on phones.
// 3. Lab performance at 390 px with Lighthouse-like throttling (CPU 4×, 150 ms RTT, 1.6 Mbps down): LCP, CLS,
//    transferred bytes, script bytes — home, a design page, a guide.
// Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`). Exit 1 when a check fails.

import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { corePages } from '../lib/marketing/site.ts';

const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const args = process.argv.slice(2);
const argOut = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const OUT = path.resolve(argOut ?? path.join(ROOT, 'previews/g061'));
const SHOTS = !args.includes('--no-shots');
mkdirSync(OUT, { recursive: true });

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

const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: boolean, detail?: unknown) => {
  checks.push({ name, ok, ...(detail === undefined ? {} : { detail }) });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined && !ok ? ` — ${JSON.stringify(detail)}` : ''}`);
};

const PORT = Number(process.env.PORT) || (await freePort());
const server = startNext({ port: PORT, dataDir: mkdtempSync(path.join(os.tmpdir(), 'g061-data-')) });
const BASE = server.base;
const chromium = loadChromium();
const browser = await chromium.launch();
const metrics: Record<string, unknown> = {};

try {
  await waitForServer(`${BASE}/robots.txt`, 60_000, server);
  const designs = liveDesigns();
  const guides = loadGuides();
  const pagePaths = [...corePages().map((p) => p.path), ...designs.map((d) => `/designs/${d.id}`), ...guides.map((g) => g.path)];
  const shotName = (p: string) => (p === '/' ? 'home' : p.slice(1).replace(/\//g, '_'));

  // 1. pages × widths
  for (const vp of [
    { w: 390, h: 844, mobile: true },
    { w: 1280, h: 800, mobile: false },
    { w: 320, h: 640, mobile: true },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile });
    const page = await ctx.newPage();
    for (const p of pagePaths) {
      const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
      check(`${p} @${vp.w}: HTTP 200`, res?.status() === 200, res?.status());
      // Scroll through once so lazy images load before the full-page shot.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(250);
      const layout = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const cut: string[] = [];
        for (const el of Array.from(document.querySelectorAll('main *'))) {
          const r = (el as HTMLElement).getBoundingClientRect();
          if (!r.width || !r.height) continue;
          // Elements inside a horizontal scroller (screen rows, tables) may extend past the edge by design.
          if ((el as HTMLElement).closest('[data-scroll-x], ul[class*="screenRow"], div[class*="tableWrap"]')) continue;
          if (r.right > vw + 1 || r.left < -1) cut.push(`${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).slice(0, 30)} ${Math.round(r.left)}–${Math.round(r.right)}`);
        }
        return { scrollW: document.documentElement.scrollWidth, vw, h1: document.querySelectorAll('h1').length, cut: cut.slice(0, 5) };
      });
      check(`${p} @${vp.w}: no horizontal page scroll`, layout.scrollW <= layout.vw, layout);
      check(`${p} @${vp.w}: nothing cut off at the edges`, layout.cut.length === 0, layout.cut);
      check(`${p} @${vp.w}: one h1`, layout.h1 === 1, layout.h1);
      if (vp.w === 390) {
        // G066 accessibility: axe-core (serious + critical, color contrast included) and 44 px touch targets.
        await page.addScriptTag({ path: AXE });
        const axe = await page.evaluate(async () => {
          const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
          return r.violations
            .filter((v: any) => v.impact === 'serious' || v.impact === 'critical')
            .map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
        });
        check(`${p} @390: axe-core, no serious/critical violations`, axe.length === 0, axe);
        const small = await page.evaluate(() => {
          const out: string[] = [];
          const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
          for (const el of Array.from(document.querySelectorAll<HTMLElement>('a[href], button, summary, input, select, textarea'))) {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            if (!r.width || !r.height || cs.visibility === 'hidden' || r.bottom <= 0) continue;
            if (el.tagName !== 'SUMMARY' && el.closest('details:not([open])')) continue; // closed menu / FAQ answer
            // WCAG 2.5.5/2.5.8 inline exception: a link inside a sentence or block of text.
            const block = el.closest('p, li, dd, td, th');
            if (el.tagName === 'A' && block && block !== el && text(block).length > text(el).length + 1) continue;
            if (r.width < 43.5 || r.height < 43.5) out.push(`${el.tagName.toLowerCase()} "${text(el).slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
          }
          return out;
        });
        check(`${p} @390: touch targets ≥ 44 × 44 px`, small.length === 0, small.slice(0, 6));
      }
      // Full-page shots: every page except the 2nd+ guide (same template; keeps previews/ small). None at 320 px.
      const shot = SHOTS && vp.w !== 320 && !(p.startsWith('/guides/') && p !== guides[0].path);
      if (shot) await page.screenshot({ path: path.join(OUT, `${shotName(p)}_${vp.w}.jpg`), fullPage: true, type: 'jpeg', quality: 68 });
    }
    // first screen of the home page, PNG, sharper
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    if (SHOTS && vp.w !== 320) await page.screenshot({ path: path.join(OUT, `home_first_screen_${vp.w}.png`) });
    await ctx.close();
  }

  // 1b. G066 brand: logos from public/brand/, tab icons and the web manifest (also on a platform page: /start).
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.locator('footer img').scrollIntoViewIfNeeded(); // the footer logo is lazy
    await page.waitForFunction(() => document.querySelector<HTMLImageElement>('footer img')?.complete, null, { timeout: 5000 });
    const brand = await page.evaluate(() => {
      const img = (sel: string) => {
        const el = document.querySelector<HTMLImageElement>(sel);
        return el ? { src: new URL(el.src).pathname, alt: el.alt, ok: el.complete && el.naturalWidth > 0 } : null;
      };
      return {
        header: img('header img'),
        footer: img('footer img'),
        icons: Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')).map(
          (l) => `${l.rel} ${new URL(l.href).pathname}`,
        ),
      };
    });
    check(
      'brand: header logo is the anchor SVG, footer logo the reverse SVG, both load',
      brand.header?.src === '/brand/bke-logo-horizontal-anchor.svg' && brand.header.ok && /BKE Studio/.test(brand.header.alt) &&
        brand.footer?.src === '/brand/bke-logo-horizontal-reverse.svg' && brand.footer.ok,
      brand,
    );
    const want = ['icon /brand/favicon.ico', 'icon /brand/icon.svg', 'apple-touch-icon /brand/apple-touch-icon.png', 'manifest /brand/site.webmanifest'];
    check('brand: favicon, SVG icon, apple-touch-icon and manifest in <head>', want.every((w) => brand.icons.includes(w)), brand.icons);
    const files = await page.evaluate(async (paths: string[]) => {
      const out: Record<string, string> = {};
      for (const p of paths) {
        const r = await fetch(p);
        out[p] = `${r.status} ${r.headers.get('content-type')}`;
      }
      return out;
    }, ['/brand/favicon.ico', '/brand/icon.svg', '/brand/apple-touch-icon.png', '/brand/icon-192.png', '/brand/icon-512.png', '/brand/site.webmanifest', '/brand/pattern_tile.png']);
    check('brand: icon, manifest and pattern files answer 200', Object.values(files as Record<string, string>).every((v) => v.startsWith('200')), files);
    const manifest = await page.evaluate(async () => (await fetch('/brand/site.webmanifest')).json());
    check('brand: manifest names BKE Studio with 192 and 512 px icons', manifest.name === 'BKE Studio' && manifest.icons.some((i: any) => i.sizes === '192x192') && manifest.icons.some((i: any) => i.sizes === '512x512'), manifest);
    await page.goto(BASE + '/start', { waitUntil: 'domcontentloaded' });
    const startIcons = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')).map((l) => new URL(l.href).pathname));
    check('brand: platform pages (/start) carry the brand tab icon too', startIcons.includes('/brand/icon.svg'), startIcons);
    await ctx.close();
  }

  // 2a. demo facade on a phone
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const themeRequests: string[] = [];
    page.on('request', (r: any) => {
      if (new URL(r.url()).pathname.startsWith('/themes/') || new URL(r.url()).pathname.startsWith('/start/demo/')) themeRequests.push(r.url());
    });
    const events: unknown[] = [];
    await page.exposeFunction('__mkEvent', (e: unknown) => events.push(e));
    await page.addInitScript(() => window.addEventListener('mk:track', (e) => (window as any).__mkEvent((e as CustomEvent).detail)));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    check('demo: no theme or demo request before a tap', themeRequests.length === 0, themeRequests.slice(0, 3));
    check('demo: no iframe before a tap', (await page.locator('iframe').count()) === 0);
    const cta = page.getByRole('link', { name: 'Open the invitation' });
    await cta.click();
    const dialog = page.locator('dialog[open]');
    await dialog.waitFor({ timeout: 5000 });
    const src = await dialog.locator('iframe').getAttribute('src');
    check('demo (phone): opens a modal dialog with the theme demo', src === `/start/demo/${designs[0].id}`, src);
    const frame = page.frameLocator('dialog[open] iframe');
    await frame.locator('[data-page="index"], body').first().waitFor({ timeout: 15000 });
    await page.waitForTimeout(1200);
    check('demo (phone): the theme loads inside the dialog', themeRequests.some((u) => u.includes('/themes/')), themeRequests.length);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, 'demo_dialog_390.png') });
    const sizes = await dialog.evaluate((d: HTMLDialogElement) => {
      const f = d.querySelector('iframe')!.getBoundingClientRect();
      return { w: Math.round(f.width), h: Math.round(f.height) };
    });
    check('demo (phone): the demo fills the screen width', sizes.w >= 380, sizes);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    check('demo (phone): Esc closes the dialog', (await page.locator('dialog[open]').count()) === 0);
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    check('demo (phone): focus returns to the button', focused === 'Open the invitation', focused);
    check('demo: demo_open event fired', events.some((e: any) => e.name === 'demo_open'), events);

    // design chips switch the poster
    await page.getByRole('button', { name: designs[1].name, exact: true }).click();
    const poster = await page.locator('a[aria-label^="Tap to open the live demo"] img').getAttribute('src');
    check('demo: a design chip switches the poster', !!poster && poster.includes(designs[1].id), poster);

    // card button opens the dialog for its design
    await page.locator(`a[data-demo="${designs[1].id}"]`).first().click();
    await page.locator('dialog[open]').waitFor({ timeout: 5000 });
    check('demo: a card "Open live demo" opens its design', (await page.locator('dialog[open] iframe').getAttribute('src')) === `/start/demo/${designs[1].id}`);
    await page.getByRole('button', { name: 'Close the demo' }).click();
    check('demo: the close button closes it', (await page.locator('dialog[open]').count()) === 0);

    // mobile menu and FAQ
    await page.locator('summary', { hasText: 'Menu' }).click();
    check('mobile menu opens', await page.getByRole('navigation', { name: 'Main (mobile)' }).getByRole('link', { name: 'Pricing' }).isVisible());
    await page.locator('summary', { hasText: 'Menu' }).click();
    const faq = page.locator('details[id="canva-or-app"]');
    await faq.locator('summary').click();
    check('FAQ answer opens', (await faq.getAttribute('open')) !== null);

    // sticky bar on a design page (phone)
    await page.goto(`${BASE}/designs/${designs[0].id}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(200);
    const bar = await page.evaluate(() => {
      const el = document.querySelector('[class*="stickyBar"]') as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { bottom: Math.round(r.bottom), vh: innerHeight, visible: getComputedStyle(el).display !== 'none' };
    });
    check('design page (phone): sticky Live demo / Etsy bar at the bottom', !!bar && bar.visible && Math.abs(bar.bottom - bar.vh) <= 1, bar);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, `design_sticky_390.png`) });
    await ctx.close();
  }

  // 2b. demo in place on a wide screen
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Open the invitation' }).click();
    const iframe = page.locator('iframe[title^="Live demo"]');
    await iframe.waitFor({ timeout: 5000 });
    check('demo (wide): loads in place, no dialog', (await page.locator('dialog[open]').count()) === 0);
    await page.waitForTimeout(2500);
    const box = await iframe.evaluate((f: HTMLIFrameElement) => {
      const r = f.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), t: f.style.transform };
    });
    check('demo (wide): 390 × 844 demo scaled into the hero screen', box.w > 250 && box.w < 390 && Math.abs(box.h / box.w - 844 / 390) < 0.02, box);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, 'demo_inline_1280.png') });
    await page.getByRole('button', { name: 'Close demo' }).click();
    check('demo (wide): Close demo returns to the poster', (await page.locator('iframe').count()) === 0);
    await ctx.close();
  }

  // 3. lab performance (Lighthouse-like mobile throttling)
  for (const p of ['/', `/designs/${designs[1].id}`, guides[0].path]) {
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
    let fonts = 0;
    let images = 0;
    cdp.on('Network.responseReceived', (e: any) => types.set(e.requestId, e.type));
    cdp.on('Network.loadingFinished', (e: any) => {
      total += e.encodedDataLength;
      const t = types.get(e.requestId);
      if (t === 'Script') scripts += e.encodedDataLength;
      if (t === 'Font') fonts += e.encodedDataLength;
      if (t === 'Image') images += e.encodedDataLength;
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
    const t0 = Date.now();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 120_000 });
    await page.waitForTimeout(3000);
    const m = await page.evaluate(() => ({
      lcp: Math.round((window as any).__lcp),
      lcpElement: (window as any).__lcpEl,
      cls: Number((window as any).__cls.toFixed(4)),
      fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry | undefined)?.startTime ?? 0),
    }));
    const r = { ...m, loadMs: Date.now() - t0, transferredKB: Math.round(total / 1024), scriptKB: Math.round(scripts / 1024), fontKB: Math.round(fonts / 1024), imageKB: Math.round(images / 1024) };
    metrics[p] = r;
    check(`perf ${p}: LCP ≤ 2.5 s (lab, CPU 4×, slow 4G)`, r.lcp > 0 && r.lcp <= 2500, r);
    check(`perf ${p}: CLS ≤ 0.05`, r.cls <= 0.05, r.cls);
    check(`perf ${p}: first load ≤ 600 KB transferred`, r.transferredKB <= 600, r.transferredKB);
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
      tool: 'tests/marketing-browser.ts (G061, G066)',
      date: new Date().toISOString().slice(0, 10),
      server: 'next start (local production build), temp data folder',
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
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → ${path.relative(process.cwd(), OUT)}/checks.json`);
process.exit(failed.length ? 1 : 0);
