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
// there is no bar; the thumbnails are 3:5. Review 2026-10-23 (21 Crimson Rose Atelier): its story page opens at its title
// (390, 1280) and at 900 / 1280 its roses run past the column with no sideways scroll.
// Search (owner request 2026-10-24), at every width on the envelope page: the field sits between the links and the grid
// and stays in view while the grid scrolls; on a touch screen opening does not focus it (no keyboard), with a mouse it
// does; typing "rose" filters (and is read out), nothing found shows the message and "Show all designs", × clears, Esc
// clears first and closes next, no sideways overflow, axe on the open panel while searching. At 360 / 390 / 1280 a Turkish
// visitor typing "altın" and "kır"; at 1280 Enter opens the first result; at 390 a phone keyboard (a smaller visual
// viewport) leaves the field and the first results above it.
// Review 2026-10-24: "gold and rose" = "gold rose" ("ve", "y", "und", "et" too); "rose" is not the colour "rose gold";
// a "$&" typed shows as typed; "Show all designs" on a touch screen does not bring the keyboard back (focus on the first
// design), with a mouse it goes back to the field; Esc on the × leaves the focus in the field; in forced colours the
// focused field has an outline; the ×'s focus ring stays inside the field; a short touch screen (a keyboard that
// shortens the whole page) leaves out the links while typing.
// --shots writes a screenshot of each width closed and open (and at 360 / 390 / 1280: "rose", "altın", nothing found).
// Exit 1 on any failure.

import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import type { Page } from 'playwright-core';
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

async function overflow(p: Page): Promise<boolean> {
  return p.evaluate(() => {
    const se = document.scrollingElement!;
    const wide = (s: string) => [...document.querySelectorAll<HTMLElement>(s)].some((e) => e.scrollWidth > e.clientWidth + 1);
    return se.scrollWidth > se.clientWidth || wide('.pdb-panel') || wide('.pdb-scroll') || wide('.pdb-search');
  });
}

async function shownNames(p: Page): Promise<string[]> {
  return p.evaluate(() => [...document.querySelectorAll('.pdb-item')].filter((a) => a.getClientRects().length).map((a) => a.querySelector('.pdb-item-name')!.textContent!));
}

/** The search in the open catalogue (envelope page, English); leaves it open with the field empty. */
async function searchChecks(page: Page, w: number, at: string) {
  const shots = args.shots;
  const total = await page.locator('.pdb-item').count();
  // between the links and the grid; still in view (and covering no card) when the grid is scrolled to its end
  const place = await page.evaluate(() => {
    const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
    const list = document.querySelector<HTMLElement>('.pdb-scroll')!;
    list.scrollTop = list.scrollHeight;
    const after = r('.pdb-input');
    return { links: r('.pdb-links').bottom, input: after, list: r('.pdb-scroll').top, scrolled: list.scrollTop > 0 };
  });
  check(
    place.input.top >= place.links && place.input.bottom <= place.list + 1 && place.input.top >= 0 && place.input.height >= 44 && place.scrolled,
    `${at}: search field between the links and the grid, in view while the grid scrolls (${JSON.stringify(place)})`,
  );
  check(place.input.width >= Math.min(w, 680) - 80, `${at}: search field full width (${Math.round(place.input.width)} px)`);
  // "rose": live, read out after a pause
  const tall = await page.evaluate(() => document.querySelector('.pdb-panel')!.getBoundingClientRect().height);
  await page.fill('.pdb-input', 'rose');
  await page.waitForTimeout(800);
  const rose = await shownNames(page);
  check(
    rose.length > 0 && rose.length < total && rose.includes('Blush Garden Rose') && rose.includes('Crimson Rose Atelier') && !rose.includes('Mediterranean Lemon') && !rose.includes('Velvet Jewel Box'),
    `${at}: "rose" filters, roses not "rose gold" (${rose.length} of ${total})`,
  );
  check((await page.textContent('.pdb-panel [role="status"]')) === `Designs found: ${rose.length}`, `${at}: the count is read out`);
  check(!(await overflow(page)), `${at}: no sideways overflow while searching`);
  const clearBox = await page.locator('.pdb-clear').boundingBox();
  check(!!clearBox && clearBox.width >= 44 && clearBox.height >= 44, `${at}: × shown, ≥ 44 px`);
  if (shots && [360, 390, 1280].includes(w)) await page.screenshot({ path: path.join(shots, `${w}-search-rose.png`) });
  // × clears, focus stays in the field
  await page.click('.pdb-clear');
  check((await page.inputValue('.pdb-input')) === '' && (await shownNames(page)).length === total, `${at}: × shows every design again`);
  check(await page.evaluate(() => document.activeElement?.className === 'pdb-input'), `${at}: × leaves the focus in the field`);
  // nothing found
  await page.fill('.pdb-input', 'zzqx');
  await page.waitForTimeout(100);
  const none = await page.evaluate(() => ({
    text: document.querySelector('.pdb-empty-text')?.textContent,
    headings: [...document.querySelectorAll('.pdb-group')].filter((g) => g.getClientRects().length).length,
    all: document.querySelector('.pdb-all')!.getBoundingClientRect().height,
  }));
  check(none.text === 'No designs match "zzqx"' && none.headings === 0 && none.all >= 44, `${at}: nothing found: message, no empty headings, "Show all designs" (${JSON.stringify(none)})`);
  const short = await page.evaluate(() => document.querySelector('.pdb-panel')!.getBoundingClientRect().height);
  check(Math.abs(short - tall) < 2, `${at}: the panel keeps its height while searching (${Math.round(tall)} → ${Math.round(short)} px)`);
  check(!(await overflow(page)), `${at}: no sideways overflow (nothing found)`);
  await page.addScriptTag({ content: AXE });
  const axe = await page.evaluate(async () => {
    const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: Array<{ id: string; impact: string }> }> } }).axe.run(
      { include: [['.pdb']] },
      { resultTypes: ['violations'] },
    );
    return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id);
  });
  check(axe.length === 0, `${at}: axe serious/critical while searching: ${axe.join(', ') || 'none'}`);
  if (shots && [360, 390, 1280].includes(w)) await page.screenshot({ path: path.join(shots, `${w}-search-empty.png`) });
  // "$&" is shown as typed
  await page.fill('.pdb-input', 'zz$&');
  check((await page.textContent('.pdb-empty-text')) === 'No designs match "zz$&"', `${at}: "zz$&" shown as typed`);
  await page.click('.pdb-all');
  check((await page.inputValue('.pdb-input')) === '' && (await shownNames(page)).length === total, `${at}: "Show all designs" brings them back`);
  // a touch screen: on the first design (no keyboard popping up again); a mouse: back in the field
  const after = await page.evaluate(() => document.activeElement?.className);
  check(after === (w < 800 ? 'pdb-item' : 'pdb-input'), `${at}: after "Show all designs" the focus is on ${w < 800 ? 'the first design' : 'the field'} (${after})`);
  // little words: "gold and rose" = "gold rose"
  await page.fill('.pdb-input', 'gold rose');
  const plain = await shownNames(page);
  await page.fill('.pdb-input', 'gold and rose');
  const withAnd = await shownNames(page);
  check(plain.length > 0 && withAnd.join() === plain.join(), `${at}: "gold and rose" = "gold rose" (${withAnd.length})`);
  // Esc: clears first, the panel stays open; from the × the focus stays in the field
  await page.fill('.pdb-input', 'gold');
  await page.focus('.pdb-clear');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  const esc = await page.evaluate(() => ({
    value: document.querySelector<HTMLInputElement>('.pdb-input')!.value,
    open: !document.querySelector<HTMLElement>('.pdb-panel')!.hidden,
    focus: document.activeElement?.className,
  }));
  check(esc.value === '' && esc.open && esc.focus === 'pdb-input', `${at}: first Esc (on the ×) clears the search, the panel stays open, focus in the field (${JSON.stringify(esc)})`);
}

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
          // what is shown (the search's × and "Show all designs" wait hidden)
          const small = [...panel.querySelectorAll('a, button, input')]
            .map((e) => e.getBoundingClientRect())
            .filter((b) => b.width && b.height && (b.width < 43.5 || b.height < 43.5)).length;
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
        // a touch screen: Close (no keyboard popping up); a mouse: straight into the search field
        check(open.focus === (w < 800 ? 'pdb-close' : 'pdb-input'), `${at}: focus moves to ${w < 800 ? 'Close' : 'the search field'} (${open.focus})`);
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
        if (p === PAGES[0]) await searchChecks(page, w, at);
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

    // search: a Turkish visitor ("altın" = gold, "kır" = country / rustic, not "kırmızı" = red)
    for (const [w, h] of WIDTHS.filter(([x]) => [360, 390, 1280].includes(x))) {
      const touch = w < 800;
      const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/olive-ivory?lang=tr`);
      await p.waitForSelector('.pdb-pill');
      await p.click('.pdb-pill');
      await p.waitForTimeout(300);
      const total = await p.locator('.pdb-item').count();
      check((await p.getAttribute('.pdb-input', 'placeholder')) === 'Tasarım ara', `${w} tr: the field is Turkish`);
      await p.fill('.pdb-input', 'altın');
      await p.waitForTimeout(800);
      const altin = await shownNames(p);
      const said = await p.textContent('.pdb-panel [role="status"]');
      check(altin.length > 5 && altin.length < total && altin.includes('Crimson Rose Atelier'), `${w} tr: "altın" finds the gold designs (${altin.length} of ${total})`);
      check(said === `Bulunan tasarım: ${altin.length}`, `${w} tr: read out in Turkish (${said})`);
      check(!(await overflow(p)), `${w} tr: no sideways overflow while searching`);
      if (args.shots) await p.screenshot({ path: path.join(args.shots, `${w}-search-altin-tr.png`) });
      await p.fill('.pdb-input', 'kır');
      const kir = await shownNames(p);
      check(kir.includes('Lavender Provence') && kir.includes('Sunflower Rustic Barn') && !kir.includes('Vintage Airmail Love Letter'), `${w} tr: "kır" = rustic, not "kırmızı" (${kir.join(', ')})`);
      await p.fill('.pdb-input', 'zzqx');
      check((await p.textContent('.pdb-empty-text')) === '"zzqx" ile eşleşen tasarım yok', `${w} tr: the empty message is Turkish`);
      await c.close();
    }
    // search: Enter opens the first design shown (a mouse: the field has focus on opening)
    {
      const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/olive-ivory/details`);
      await p.waitForSelector('.pdb-pill');
      await p.click('.pdb-pill');
      await p.waitForTimeout(300);
      await p.keyboard.type('lemon');
      const first = await p.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('.pdb-item')].find((a) => a.getClientRects().length)?.getAttribute('href'));
      await Promise.all([p.waitForURL(/mediterranean-lemon/, { timeout: 15_000 }).catch(() => undefined), p.keyboard.press('Enter')]);
      check(first === '/start/demo/mediterranean-lemon/details' && p.url() === BASE + first, `1280: Enter opens the first result (${p.url()})`);
      await c.close();
    }
    // search: a Turkish "ve", a German "und" (little words) change nothing
    for (const [lang, q, plainQ] of [
      ['tr', 'altın ve gül', 'altın gül'],
      ['de', 'gold und rosen', 'gold rosen'],
    ]) {
      const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/olive-ivory?lang=${lang}`);
      await p.waitForSelector('.pdb-pill');
      await p.tap('.pdb-pill');
      await p.waitForTimeout(300);
      await p.fill('.pdb-input', plainQ);
      const plain = await shownNames(p);
      await p.fill('.pdb-input', q);
      const got = await shownNames(p);
      check(plain.length > 0 && got.join() === plain.join(), `390 ${lang}: "${q}" = "${plainQ}" (${got.length})`);
      await c.close();
    }
    // focus rings at 1280 (a mouse: the field has focus on opening): forced colours (Windows contrast themes) show an
    // outline on the field; the ×'s ring stays inside the field
    {
      const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p = await c.newPage();
      await p.emulateMedia({ forcedColors: 'active' });
      await p.goto(`${BASE}/start/demo/olive-ivory`);
      await p.waitForSelector('.pdb-pill');
      await p.click('.pdb-pill');
      await p.waitForTimeout(300);
      const fc = await p.evaluate(() => {
        const i = document.activeElement as HTMLElement;
        const cs = getComputedStyle(i);
        return { focus: i.className, style: cs.outlineStyle, width: cs.outlineWidth, forced: matchMedia('(forced-colors: active)').matches };
      });
      check(fc.forced && fc.focus === 'pdb-input' && fc.style === 'solid' && fc.width === '2px', `1280 forced colours: the focused field has an outline (${JSON.stringify(fc)})`);
      if (args.shots) await p.screenshot({ path: path.join(args.shots, '1280-forced-colors-focus.png'), clip: { x: 300, y: 120, width: 680, height: 160 } });
      await p.emulateMedia({ forcedColors: 'none' });
      await p.keyboard.type('gold');
      await p.keyboard.press('Tab');
      const ring = await p.evaluate(() => {
        const x = document.activeElement as HTMLElement;
        const cs = getComputedStyle(x);
        const grow = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth);
        const b = x.getBoundingClientRect();
        const f = document.querySelector('.pdb-input')!.getBoundingClientRect();
        return {
          focus: x.className,
          visible: x.matches(':focus-visible'),
          inside: b.top - grow >= f.top - 0.5 && b.bottom + grow <= f.bottom + 0.5 && b.right + grow <= f.right + 0.5,
          box: [b.left, b.top, b.width, b.height].map(Math.round),
          clip: { x: Math.round(f.right - 120), y: Math.round(f.top - 12), width: 132, height: Math.round(f.height + 24) },
        };
      });
      check(ring.focus === 'pdb-clear' && ring.visible && ring.inside, `1280: the ×'s focus ring stays inside the field (${JSON.stringify(ring)})`);
      if (args.shots) await p.screenshot({ path: path.join(args.shots, '1280-clear-focus.png'), clip: ring.clip });
      await c.close();
    }
    // a short touch screen while typing (a keyboard that shortens the whole page, so the visual viewport tells nothing):
    // the links make room for the results; back when the field loses focus
    {
      const c = await browser.newContext({ viewport: { width: 360, height: 400 }, isMobile: true, hasTouch: true });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/olive-ivory`);
      await p.waitForSelector('.pdb-pill');
      await p.tap('.pdb-pill');
      await p.waitForTimeout(300);
      const shown = () =>
        p.evaluate(() => ({
          links: document.querySelector('.pdb-links')!.getClientRects().length,
          start: document.querySelector('.pdb-start')!.getClientRects().length,
          kb: document.querySelector('.pdb')!.hasAttribute('data-kb'),
          list: Math.round(document.querySelector('.pdb-scroll')!.getBoundingClientRect().height),
        }));
      const idle = await shown();
      await p.tap('.pdb-input');
      await p.keyboard.type('gold');
      await p.waitForTimeout(150);
      const typing = await shown();
      if (args.shots) await p.screenshot({ path: path.join(args.shots, '360x400-typing.png') });
      await p.evaluate(() => (document.activeElement as HTMLElement).blur());
      await p.waitForTimeout(100);
      const blurred = await shown();
      check(
        idle.links === 1 && idle.start === 1 && !typing.kb && typing.links === 0 && typing.start === 0 && typing.list > idle.list + 80 && blurred.links === 1,
        `360×400 touch: typing leaves out the links (${JSON.stringify({ idle, typing, blurred })})`,
      );
      await c.close();
    }
    // search: the phone keyboard (a visual viewport shorter than the page): the field and the first results stay above it
    {
      const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await c.addInitScript(() => {
        const vv = Object.assign(new EventTarget(), { width: innerWidth, height: innerHeight, offsetTop: 0, offsetLeft: 0, scale: 1 });
        Object.defineProperty(window, 'visualViewport', { get: () => vv });
        (window as unknown as { kb: (h: number) => void }).kb = (h: number) => {
          vv.height = h;
          vv.dispatchEvent(new Event('resize'));
        };
      });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/olive-ivory`);
      await p.waitForSelector('.pdb-pill');
      await p.tap('.pdb-pill');
      await p.waitForTimeout(300);
      await p.fill('.pdb-input', 'gold');
      await p.evaluate(() => (window as unknown as { kb: (h: number) => void }).kb(470));
      await p.waitForTimeout(200);
      const kb = await p.evaluate(() => {
        const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        const card = [...document.querySelectorAll('.pdb-item')].find((a) => a.getClientRects().length)!.getBoundingClientRect();
        return { panel: r('.pdb-panel').bottom, input: r('.pdb-input').bottom, card: card.top, links: document.querySelector('.pdb-links')!.getClientRects().length };
      });
      check(kb.panel <= 471 && kb.input < 200 && kb.card < 470 - 60 && kb.links === 0, `390: with the keyboard open the panel ends above it (${JSON.stringify(kb)})`);
      if (args.shots) await p.screenshot({ path: path.join(args.shots, '390-search-keyboard.png') });
      await c.close();
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
    // review 2026-10-23: the thumbnails are 3:5 crops of the envelope screen (the 4:5 crop halved the names line)
    await page.goto(`${BASE}/start/demo/olive-ivory`);
    await page.waitForSelector('.pdb-pill');
    await page.tap('.pdb-pill');
    await page.waitForTimeout(400);
    const ratios: number[] = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.pdb-thumb')).map((t) => t.getBoundingClientRect().width / t.getBoundingClientRect().height),
    );
    check(ratios.length > 0 && ratios.every((r) => Math.abs(r - 0.6) < 0.02), `thumbnails are 3:5 (${ratios.length})`);
    await ctx.close();
    // 21 (review 2026-10-23): its story page opens at the top (no #chapter-1 written while loading: the browser scrolled
    // past the title to it) and, wider than its columns, its roses neither stop in a straight line nor scroll sideways
    for (const w of [390, 1280]) {
      const c = await browser.newContext({ viewport: { width: w, height: 844 } });
      const p = await c.newPage();
      await p.goto(`${BASE}/start/demo/crimson-rose-atelier/story`, { waitUntil: 'load' });
      await p.waitForTimeout(1200);
      const top = await p.evaluate(() => ({ y: scrollY, hash: location.hash }));
      check(top.y === 0 && top.hash === '', `${w}: 21 story opens at its title (${JSON.stringify(top)})`);
      await c.close();
    }
    for (const w of [900, 1280]) {
      const c = await browser.newContext({ viewport: { width: w, height: 860 } });
      const p = await c.newPage();
      for (const pg of ['', '/details', '/rsvp']) {
        await p.goto(`${BASE}/start/demo/crimson-rose-atelier${pg}`, { waitUntil: 'load' });
        await p.waitForTimeout(1500);
        const x = await p.evaluate(() => {
          scrollTo({ left: 400, top: 0, behavior: 'instant' as ScrollBehavior });
          const moved = scrollX;
          const flower = document.querySelector('.opening .rose-a, .head-rose');
          const col = flower?.closest('.opening, .programme, .rsvp-page');
          return {
            sw: document.scrollingElement!.scrollWidth - innerWidth,
            moved,
            past: flower && col ? Math.round(flower.getBoundingClientRect().right - col.getBoundingClientRect().right) : 0,
            clip: col ? getComputedStyle(col).overflowX : '',
          };
        });
        check(x.sw <= 0 && x.moved === 0 && x.clip === 'visible', `${w}: 21${pg || ' envelope'} roses run past the column, no sideways scroll (${JSON.stringify(x)})`);
      }
      await c.close();
    }
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
