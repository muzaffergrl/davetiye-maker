// Browser check of G080: /start, the "save your edit link" screen and /signin in the BKE Studio look of the panel, and
// the production gate for designs in review. Real `next start` + Chromium. Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules PORT=41971 node tests/g080-browser.ts
//
// Server A runs with THEME_APPROVAL=enforce (= what VERCEL_ENV=production does): an approved design starts normally
// (G082: every approved design's /start page opens with its demo, and POST /api/start answers 201 for each),
// a design in review answers 404 with the honest page and POST /api/start 403, its demo stays open, the /start list
// shows approved designs only. Server B (PORT+1) has no gate: the same design in review can be started (local work).
// Look: panel fonts (Archivo / DM Sans), panel tokens (paper ground, aubergine button, no old green), BKE logo,
// axe-core 4.13.0 with no serious/critical violation (colour contrast included), touch targets ≥ 44 px, no sideways
// scroll at 320 / 390 px. Screens (390 full page, 1280 first screen) + checks.json -> previews/g080/ ($G080_SHOTS_DIR).
// Exit code 1 when a check fails.

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer, type NextServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';
import { approvedThemeIds, THEME_IN_REVIEW } from '../lib/themes/approval.ts';

const PORT = Number(process.env.PORT || 41971);
const OUT = process.env.G080_SHOTS_DIR || path.join(ROOT, 'previews/g080');
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const OLD_GREEN = 'rgb(51, 90, 75)'; // the G045 accent (#335a4b) that /start had before

const approved = approvedThemeIds();
const themeIds = readdirSync(path.join(ROOT, 'themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => JSON.parse(readFileSync(path.join(ROOT, 'themes', d.name, 'theme.json'), 'utf8')) as { id: string; internal?: boolean })
  .filter((m) => !m.internal)
  .map((m) => m.id);
// (02 dusty-blue-champagne was the design in review until G083 approved it; now 04)
const IN_REVIEW = themeIds.find((id) => !approved.includes(id) && id === 'vintage-airmail-love-letter') ?? themeIds.find((id) => !approved.includes(id));
const APPROVED = approved.includes('olive-ivory') ? 'olive-ivory' : approved[0];

mkdirSync(OUT, { recursive: true });
const checks: Array<{ name: string; ok: boolean; detail?: unknown }> = [];
const check = (name: string, ok: unknown, detail: unknown = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail !== '' ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== '' && !ok ? `  (${JSON.stringify(detail).slice(0, 300)})` : ''}`);
};

/** A check that passes when the list of problems is empty. */
const none = (name: string, problems: string[]) => check(name, problems.length === 0, problems);

const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const small = { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const desk = { viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 };

async function axeViolations(page: any): Promise<string[]> {
  await page.addScriptTag({ path: AXE });
  return page.evaluate(async () => {
    // the theme demo inside the iframe is the design itself (its own checks: theme-check); this page is checked
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'], iframes: false });
    return r.violations
      .filter((v: any) => v.impact === 'serious' || v.impact === 'critical')
      .map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
}

async function smallTargets(page: any): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('a[href], button, summary, input, select, textarea'))) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || r.right <= 0 || r.bottom <= 0) continue; // off-screen honeypot
      const block = el.closest('p, li, dd, td, th');
      if (el.tagName === 'A' && block && block !== el && text(block).length > text(el).length + 1) continue; // link in a sentence
      if (r.width < 43.5 || r.height < 43.5) out.push(`${el.tagName.toLowerCase()} "${text(el).slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  });
}

/** Fonts, colours and logo of the page: what makes it the panel's look. */
async function look(page: any) {
  return page.evaluate((oldGreen: string) => {
    const h1 = document.querySelector('h1');
    const body = document.querySelector('main h1 ~ p, main label') as HTMLElement | null; // (the eyebrow above h1 is Montserrat)
    const root = document.querySelector('[data-start]') ?? document.querySelector('main');
    let green = 0;
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const cs = getComputedStyle(el);
      if ([cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderLeftColor].includes(oldGreen)) green++;
    }
    const primary = document.querySelector('button[type="submit"], [data-open-editor]') as HTMLElement | null;
    return {
      h1Font: h1 ? getComputedStyle(h1).fontFamily : '',
      h1Weight: h1 ? getComputedStyle(h1).fontWeight : '',
      h1Color: h1 ? getComputedStyle(h1).color : '',
      bodyFont: body ? getComputedStyle(body).fontFamily : '',
      rootBg: root ? getComputedStyle(root).backgroundColor : '',
      rootWidth: root ? Math.round(root.getBoundingClientRect().width) : 0,
      htmlBg: getComputedStyle(document.documentElement).backgroundColor,
      primaryBg: primary ? getComputedStyle(primary).backgroundColor : null,
      primaryFont: primary ? getComputedStyle(primary).fontFamily : null,
      logo: Array.from(document.querySelectorAll('img')).some((i) => /\/brand\/bke-logo-horizontal-anchor\.svg$/.test(i.getAttribute('src') ?? '') && (i as HTMLImageElement).naturalWidth > 0),
      green,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  }, OLD_GREEN);
}

const PAPER = 'rgb(250, 247, 240)';
const ANCHOR = 'rgb(43, 21, 38)';

function lookChecks(name: string, l: Awaited<ReturnType<typeof look>>, opts: { primary?: boolean; width?: number } = {}) {
  check(`${name}: headings in Archivo 800, aubergine`, /archivo/i.test(l.h1Font) && l.h1Weight === '800' && l.h1Color === ANCHOR, [l.h1Font, l.h1Weight, l.h1Color]);
  check(`${name}: text in DM Sans`, /dm sans|dm_sans/i.test(l.bodyFont), l.bodyFont);
  check(`${name}: paper ground (panel token)`, l.rootBg === PAPER, l.rootBg);
  check(`${name}: BKE Studio logo (brand SVG)`, l.logo);
  check(`${name}: no trace of the old green look`, l.green === 0, l.green);
  if (opts.primary) check(`${name}: main button aubergine, heading face`, l.primaryBg === ANCHOR && /archivo/i.test(String(l.primaryFont)), [l.primaryBg, l.primaryFont]);
  if (opts.width) check(`${name}: paper fills the window (${opts.width} px)`, l.rootWidth >= opts.width - 1 || l.htmlBg === PAPER, [l.rootWidth, l.htmlBg]);
  check(`${name}: no sideways scroll`, l.overflow <= 0, l.overflow);
}

const shot = async (page: any, name: string, full = false) => {
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
};

const servers: NextServer[] = [];
const dataDirs: string[] = [];
let browser: any;
try {
  if (!IN_REVIEW) throw new Error('no theme in review to test with');
  const mk = (port: number, env: Record<string, string>) => {
    const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g080-data-'));
    dataDirs.push(dataDir);
    const s = startNext({ port, dataDir, env: { DATA_ADAPTER: 'local', ...env } });
    servers.push(s);
    return s;
  };
  // THEME_APPROVAL=enforce: the production gate (VERCEL_ENV=production on Vercel). VERCEL_ENV is removed so the
  // second server is really "not production".
  delete process.env.VERCEL_ENV;
  delete process.env.THEME_APPROVAL;
  const prod = mk(PORT, { THEME_APPROVAL: 'enforce' });
  const dev = mk(PORT + 1, {});
  await waitForServer(`${prod.base}/signin`, 40_000, prod);
  await waitForServer(`${dev.base}/signin`, 40_000, dev);
  const chromium = loadChromium();
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
  console.log(`approved: ${approved.join(', ')} · in review (tested): ${IN_REVIEW} · approved (tested): ${APPROVED}`);

  // ------------------------------------------------------------------ production: approved design, /start + claim
  {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e: Error) => errors.push(e.message));
    const res = await page.goto(`${prod.base}/start?theme=${APPROVED}`, { waitUntil: 'networkidle' });
    check(`prod /start?theme=${APPROVED} (approved): 200 + form`, res.status() === 200 && (await page.locator('h1').innerText()) === 'Start your website' && (await page.locator('form').count()) === 1);
    await page.frameLocator('iframe').locator('body').waitFor();
    await page.evaluate(() => document.fonts.ready);
    lookChecks('/start @390', await look(page), { primary: true });
    none('/start @390: axe-core, no serious/critical violations', await axeViolations(page));
    none('/start @390: touch targets ≥ 44 × 44 px', await smallTargets(page));
    await page.waitForTimeout(1200); // the demo's opening scene settles in the mini preview
    await shot(page, 'start_full_390', true);

    // errors shown: still readable (contrast) and the same rules as before
    await page.click('button[type="submit"]');
    await page.waitForTimeout(250);
    check('/start: empty submit marks 4 fields invalid', (await page.locator('[aria-invalid="true"]').count()) === 4);
    none('/start @390 with field errors: axe-core, no serious/critical violations', await axeViolations(page));

    await page.fill('#start-order', '6100012345');
    await page.fill('#start-email', 'elena.g080@example.test');
    await page.fill('#start-name1', 'Elena');
    if (await page.locator('#start-name2').count()) await page.fill('#start-name2', 'Marco');
    await page.waitForSelector('[data-slug-available]');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-edit-link]', { timeout: 15_000 });
    check('claim (approved, production): edit link shown', /\/edit\/elena-and-marco\?k=/.test(await page.inputValue('[data-edit-link]')));
    check('post-claim: title', (await page.locator('h1').innerText()) === 'Your website is ready to edit');
    lookChecks('post-claim @390', await look(page), { primary: true });
    none('post-claim @390: axe-core, no serious/critical violations', await axeViolations(page));
    none('post-claim @390: touch targets ≥ 44 × 44 px', await smallTargets(page));
    // the private key is masked in the picture only
    await page.evaluate(() => {
      const el = document.querySelector('[data-edit-link]') as HTMLTextAreaElement;
      el.value = el.value.replace(/k=[A-Za-z0-9_-]+/, 'k=••••••••••••••••');
    });
    await shot(page, 'claimed_390', true);
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('[data-open-editor]');
    await page.waitForSelector('[data-setup="1"]', { timeout: 15_000 });
    check('post-claim: "Open my editor" opens the panel at setup step 1', (await page.inputValue('#f-partners-0-display_name')) === 'Elena');
    check('/start flow: no page errors', errors.length === 0, errors);
    await ctx.close();

    const c320 = await browser.newContext(small);
    const p320 = await c320.newPage();
    await p320.goto(`${prod.base}/start?theme=${APPROVED}`, { waitUntil: 'networkidle' });
    check('/start @320: no sideways scroll', (await look(p320)).overflow <= 0);
    await c320.close();

    const dc = await browser.newContext(desk);
    const dp = await dc.newPage();
    await dp.goto(`${prod.base}/start?theme=${APPROVED}`, { waitUntil: 'networkidle' });
    await dp.frameLocator('iframe').locator('body').waitFor();
    await dp.evaluate(() => document.fonts.ready);
    const fBox = await dp.locator('iframe').boundingBox();
    const formBox = await dp.locator('form').boundingBox();
    check('/start @1280: preview left of the form', fBox && formBox && fBox.x + fBox.width < formBox.x, { fBox, formBox });
    lookChecks('/start @1280', await look(dp), { primary: true, width: 1280 });
    await dp.waitForTimeout(1200);
    await shot(dp, 'start_1280');
    // post-claim at 1280: a second order in the same tab
    await dp.fill('#start-order', '6100012346');
    await dp.fill('#start-email', 'clara.g080@example.test');
    await dp.fill('#start-name1', 'Clara');
    if (await dp.locator('#start-name2').count()) await dp.fill('#start-name2', 'Julian');
    await dp.waitForSelector('[data-slug-available]');
    await dp.click('button[type="submit"]');
    await dp.waitForSelector('[data-edit-link]', { timeout: 15_000 });
    await dp.evaluate(() => {
      const el = document.querySelector('[data-edit-link]') as HTMLTextAreaElement;
      el.value = el.value.replace(/k=[A-Za-z0-9_-]+/, 'k=••••••••••••••••');
    });
    await dp.mouse.move(2, 2); // the new "Open my editor" button appears under the pointer (hover colour)
    await dp.waitForTimeout(400);
    lookChecks('post-claim @1280', await look(dp), { primary: true, width: 1280 });
    await shot(dp, 'claimed_1280');
    await dc.close();
  }

  // ------------------------------------------------------------------ production: EVERY approved design opens (G082)
  // (a design approved later — 05 mediterranean-lemon in G082, 02 dusty-blue-champagne in G083 — is started like the
  // first ones: page, demo, API)
  {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    for (const id of approved) {
      const res = await page.goto(`${prod.base}/start?theme=${id}`, { waitUntil: 'networkidle' });
      const src = await page.locator('iframe').first().getAttribute('src').catch(() => null);
      check(
        `prod /start?theme=${id} (approved): 200 + form + its demo`,
        res.status() === 200 && (await page.locator('h1').innerText()) === 'Start your website' && (await page.locator('form').count()) === 1 && src === `/start/demo/${id}`,
        { status: res.status(), src },
      );
    }
    await ctx.close();
    for (const [i, id] of approved.filter((x) => x !== APPROVED).entries()) {
      const api = await fetch(`${prod.base}/api/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ theme: id, orderNumber: String(6100012457 + i * 7919), email: 'g082@example.test', names: [['Lucia', 'Paolo'], ['Chiara', 'Matteo'], ['Giulia', 'Luca']][i % 3], slug: '', website: '' }),
      });
      const body = (await api.json()) as Record<string, unknown>;
      check(`prod POST /api/start (${id}, approved): 201, a site is started`, api.status === 201 && typeof body.slug === 'string', { status: api.status, body });
    }
  }

  // ------------------------------------------------------------------ production: design in review
  {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    const res = await page.goto(`${prod.base}/start?theme=${IN_REVIEW}`, { waitUntil: 'networkidle' });
    check(`prod /start?theme=${IN_REVIEW} (in review): 404`, res.status() === 404, res.status());
    check('in review: honest title and message', (await page.locator('h1').innerText()) === THEME_IN_REVIEW.title && (await page.locator('main').innerText()).includes('not on sale yet'));
    check('in review: no form, no demo frame', (await page.locator('form').count()) === 0 && (await page.locator('iframe').count()) === 0);
    const links = await page.locator('main a[href^="/start?theme="]').evaluateAll((as: Element[]) => as.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get('theme')));
    check('in review: lists only approved designs', links.length === approved.length && links.every((id: string | null) => id && approved.includes(id)), links);
    check('in review: noindex', (await page.locator('meta[name="robots"]').first().getAttribute('content'))?.includes('noindex'));
    lookChecks('in review @390', await look(page));
    none('in review @390: axe-core, no serious/critical violations', await axeViolations(page));
    none('in review @390: touch targets ≥ 44 × 44 px', await smallTargets(page));
    await shot(page, 'in_review_390', true);

    const api = await fetch(`${prod.base}/api/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ theme: IN_REVIEW, orderNumber: '6100012399', email: 'x@example.test', names: ['Ann', 'Bo'], slug: '', website: '' }),
    });
    const body = (await api.json()) as Record<string, unknown>;
    check(`prod POST /api/start (${IN_REVIEW}): 403 theme_in_review`, api.status === 403 && body.code === 'theme_in_review', { status: api.status, body });
    const demo = await fetch(`${prod.base}/start/demo/${IN_REVIEW}`);
    check(`prod /start/demo/${IN_REVIEW}: demo stays open (200)`, demo.status === 200, demo.status);
    await page.goto(`${prod.base}/start`, { waitUntil: 'networkidle' });
    const listed = await page.locator('main a[href^="/start?theme="]').evaluateAll((as: Element[]) => as.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get('theme')));
    check('prod /start (no theme): only approved designs listed', listed.length === approved.length && !listed.includes(IN_REVIEW), listed);
    lookChecks('/start (no theme) @390', await look(page));
    none('/start (no theme) @390: axe-core, no serious/critical violations', await axeViolations(page));
    await shot(page, 'choose_design_390', true);
    await ctx.close();

    const dc = await browser.newContext(desk);
    const dp = await dc.newPage();
    await dp.goto(`${prod.base}/start?theme=${IN_REVIEW}`, { waitUntil: 'networkidle' });
    lookChecks('in review @1280', await look(dp), { width: 1280 });
    await shot(dp, 'in_review_1280');
    await dc.close();
  }

  // ------------------------------------------------------------------ /signin
  for (const [dev2, name] of [[phone, 'signin_390'], [desk, 'signin_1280']] as const) {
    const ctx = await browser.newContext(dev2);
    const page = await ctx.newPage();
    const res = await page.goto(`${prod.base}/signin`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    check(`/signin ${name}: 200, honest text, no form`, res.status() === 200 && (await page.locator('h1').innerText()) === 'Open your editor' && (await page.locator('form, input').count()) === 0);
    lookChecks(`/signin ${name}`, await look(page), { width: dev2.viewport.width });
    if (name === 'signin_390') {
      none('/signin @390: axe-core, no serious/critical violations', await axeViolations(page));
    }
    await shot(page, name, name === 'signin_390');
    await ctx.close();
  }

  // ------------------------------------------------------------------ not production: the design in review starts
  {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    const res = await page.goto(`${dev.base}/start?theme=${IN_REVIEW}`, { waitUntil: 'networkidle' });
    check(`local /start?theme=${IN_REVIEW}: 200 + form (theme work not blocked)`, res.status() === 200 && (await page.locator('h1').innerText()) === 'Start your website' && (await page.locator('form').count()) === 1);
    await page.goto(`${dev.base}/start`, { waitUntil: 'networkidle' });
    const listed = await page.locator('main a[href^="/start?theme="]').evaluateAll((as: Element[]) => as.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get('theme')));
    check('local /start: designs in review are listed too', listed.includes(IN_REVIEW), listed);
    await ctx.close();
  }
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  for (const s of servers) s.stop();
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify({ base: 'next start (production build); server A THEME_APPROVAL=enforce, server B no gate', approved, inReview: IN_REVIEW, checks }, null, 2) + '\n',
);
for (const d of dataDirs) rmSync(d, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.`);
  for (const s of servers) console.error(s.log().slice(-2000));
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed; screens in ${path.relative(process.cwd(), OUT) || OUT}/`);
