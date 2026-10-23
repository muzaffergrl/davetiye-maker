// Demo bar (owner request 2026-10-23) — browser checks on a production build (`next start`). Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/demo-bar-browser.ts [--url http://127.0.0.1:3000] [--shots <dir>]
//
// --url: check a server that is already running (e.g. `next dev`) instead of starting `next start`.
// At 360 / 390 / 430 / 768 / 1280 px, on an envelope page, an inner page in French and a story page (sound button):
// the pill is inside the viewport and clear of the corner buttons; no horizontal overflow (closed and open); Enter opens
// the catalogue (aria-expanded, focus on Close), Shift+Tab stays inside, every target ≥ 44 px, Esc closes and gives
// focus back; axe-core finds nothing serious in the bar. Then at 390: a tap on the pill and on the backdrop leaves the
// envelope closed and a tap on the envelope still opens it; ?lang=tr lasts through the opening and a nav tap; one tap on
// a design opens its demo on the same page; scrolling down hides the pill and scrolling up shows it; inside an iframe
// there is no bar. --shots writes a screenshot of each width closed and open. Exit 1 on any failure.

import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { loadChromium, startNext, waitForServer, type NextServer } from '../scripts/lib/browser.ts';

const { values: args } = parseArgs({ options: { url: { type: 'string' }, shots: { type: 'string' } } });
const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const PORT = Number(process.env.PORT || 3491);
let server: NextServer | null = null;
let BASE = args.url?.replace(/\/$/, '') ?? '';
if (!BASE) {
  server = startNext({ port: PORT, dataDir: mkdtempSync(path.join(os.tmpdir(), 'demo-bar-data-')) });
  BASE = server.base;
}
if (args.shots) mkdirSync(args.shots, { recursive: true });

const failures: string[] = [];
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!ok) failures.push(msg);
};

const PAGES = ['/start/demo/olive-ivory', '/start/demo/blush-garden-rose/details?lang=fr', '/start/demo/azulejo-mosaic/story'];
const WIDTHS: Array<[number, number]> = [
  [360, 740],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1280, 800],
];

async function main() {
  await waitForServer(`${BASE}/start/demo/olive-ivory`, 90_000, server ?? undefined);
  const chromium = loadChromium();
  const browser = await chromium.launch();
  try {
    for (const [w, h] of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800, bypassCSP: true });
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e: Error) => errors.push(e.message));
      for (const p of PAGES) {
        const at = `${w} ${p}`;
        await page.goto(BASE + p);
        await page.waitForSelector('.pdb-pill');
        await page.waitForTimeout(600);
        const closed = await page.evaluate(() => {
          const pill = document.querySelector('.pdb-pill')!.getBoundingClientRect();
          const se = document.scrollingElement!;
          const clash = [...document.querySelectorAll('.snd,.skip,[data-skip],.pl-lang')]
            .map((e) => e.getBoundingClientRect())
            .filter((r) => r.width && r.height && r.left < pill.right && r.right > pill.left && r.top < pill.bottom && r.bottom > pill.top).length;
          return { l: pill.left, r: pill.right, overflow: se.scrollWidth > se.clientWidth, clash };
        });
        check(closed.l >= 0 && closed.r <= w, `${at}: pill inside the viewport`);
        check(!closed.overflow, `${at}: no horizontal overflow (closed)`);
        check(closed.clash === 0, `${at}: pill clear of the corner buttons`);
        if (args.shots) await page.screenshot({ path: path.join(args.shots, `${w}-${p.replace(/\W+/g, '_')}-closed.png`) });
        await page.focus('.pdb-pill');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(350);
        const open = await page.evaluate(() => {
          const panel = document.querySelector<HTMLElement>('.pdb-panel')!;
          const r = panel.getBoundingClientRect();
          const se = document.scrollingElement!;
          const small = [...panel.querySelectorAll('a, button')].map((e) => e.getBoundingClientRect()).filter((b) => b.width < 43.5 || b.height < 43.5).length;
          return {
            expanded: document.querySelector('.pdb-pill')!.getAttribute('aria-expanded'),
            inside: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight + 1,
            overflow: se.scrollWidth > se.clientWidth,
            focus: document.activeElement?.className,
            small,
          };
        });
        check(open.expanded === 'true', `${at}: Enter opens the catalogue`);
        check(open.inside, `${at}: catalogue inside the viewport`);
        check(!open.overflow, `${at}: no horizontal overflow (open)`);
        check(open.focus === 'pdb-close', `${at}: focus moves to Close`);
        check(open.small === 0, `${at}: every target ≥ 44 px`);
        await page.addScriptTag({ content: AXE });
        const axe = await page.evaluate(async () => {
          const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: Array<{ id: string; impact: string }> }> } }).axe.run(
            { include: [['.pdb']] },
            { resultTypes: ['violations'] },
          );
          return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id);
        });
        check(axe.length === 0, `${at}: axe serious/critical in the bar: ${axe.join(', ') || 'none'}`);
        if (args.shots) await page.screenshot({ path: path.join(args.shots, `${w}-${p.replace(/\W+/g, '_')}-open.png`) });
        await page.keyboard.press('Shift+Tab');
        check(await page.evaluate(() => document.querySelector('.pdb-panel')!.contains(document.activeElement)), `${at}: Shift+Tab stays inside`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(150);
        const shut = await page.evaluate(() => ({ hidden: document.querySelector<HTMLElement>('.pdb-panel')!.hidden, focus: document.activeElement?.className }));
        check(shut.hidden && shut.focus === 'pdb-pill', `${at}: Esc closes, focus back on the pill`);
      }
      check(errors.length === 0, `${w}: no page errors ${errors.join(' | ')}`);
      await ctx.close();
    }

    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    // the pill never opens the envelope; the envelope still does
    await page.goto(`${BASE}/start/demo/olive-ivory?lang=tr`);
    await page.waitForSelector('.pdb-pill');
    await page.waitForTimeout(800);
    const state = () => page.evaluate(() => document.documentElement.className);
    const before = await state();
    await page.tap('.pdb-pill');
    await page.waitForTimeout(300);
    await page.touchscreen.tap(3, 420); // the backdrop's edge beside the catalogue
    await page.waitForTimeout(1200);
    check((await state()) === before && new URL(page.url()).pathname === '/start/demo/olive-ivory', 'pill and backdrop taps leave the envelope closed');
    await page.touchscreen.tap(195, 470);
    await page.waitForURL(/\/home/, { timeout: 15_000 }).catch(() => undefined);
    check(/\/start\/demo\/olive-ivory\/home\?lang=tr/.test(page.url()), `the envelope still opens; ?lang=tr kept (${page.url()})`);
    await page.waitForSelector('.pdb-pill');
    check((await page.evaluate(() => document.querySelector('.pdb')!.getAttribute('lang'))) === 'tr', 'the bar is still Turkish after the opening');
    // one tap = the other design, same page, same language
    await page.goto(`${BASE}/start/demo/olive-ivory/details?lang=tr`);
    await page.waitForSelector('.pdb-pill');
    await page.tap('.pdb-pill');
    await page.waitForTimeout(300);
    const href = await page.evaluate(() => document.querySelector('.pdb-item:not([aria-current])')!.getAttribute('href')!);
    await Promise.all([page.waitForURL(BASE + href, { timeout: 15_000 }).catch(() => undefined), page.tap(`.pdb-item[href="${href}"]`)]);
    check(page.url() === BASE + href && /\/details\?lang=tr$/.test(href), `one tap opens ${href}`);
    // away while scrolling down, back when scrolling up
    await page.goto(`${BASE}/start/demo/olive-ivory/story`);
    await page.waitForSelector('.pdb-pill');
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(500);
    const away = await page.evaluate(() => document.querySelector('.pdb')!.hasAttribute('data-away'));
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(500);
    const back = !(await page.evaluate(() => document.querySelector('.pdb')!.hasAttribute('data-away')));
    check(away && back, 'scrolling down hides the pill, scrolling up shows it');
    // framed (the /start preview, the sales site's demo dialog): no bar
    await page.goto(`${BASE}/start/demo/olive-ivory`);
    await page.setContent(`<iframe src="${BASE}/start/demo/olive-ivory" width="390" height="844"></iframe>`);
    await page.waitForTimeout(2500);
    const frame = page.frames().find((f: { url: () => string }) => f.url().includes('/start/demo/'));
    const inFrame = frame ? await frame.evaluate(() => document.querySelectorAll('.pdb, #demo-bar-data').length) : -1;
    check(inFrame === 0, 'no bar inside an iframe');
    await ctx.close();
  } finally {
    await browser.close();
    server?.stop();
  }
  console.log(failures.length ? `\n${failures.length} failure(s)` : '\nall checks passed');
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  server?.stop();
  process.exit(1);
});
