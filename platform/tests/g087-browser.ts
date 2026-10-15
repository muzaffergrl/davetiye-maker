// Browser journey of the shop admin (G087, K30) and the buyer side of an order waiting for the shop: real `next start`
// + Chromium. Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g087-browser.ts
//
// Buyer: /start (manual order check) → panel Home says the order is being confirmed (no Publish there) → the sample
// reply-by date follows the new wedding date. Shop: /admin off without ADMIN_PASSWORD → sign-in (wrong, right) → list
// ("Yapılacak" first, search) → site page → confirm the order → the buyer can publish → ready Etsy message → new edit
// link (old link dead, new link opens the panel) → delete needs the address. 390 × 844 and 1280 × 900; axe-core, touch
// targets, no horizontal scroll. Screenshots + checks.json → previews/g087/ (or $G087_SHOTS_DIR). Exit 1 on a failed check.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');
const PORT = Number(process.env.PORT || 3387);
const PORT_OFF = PORT + 1;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G087_SHOTS_DIR || path.join(ROOT, 'previews/g087');
const PASSWORD = 'g087-browser-test-password';
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g087-browser-data-'));
mkdirSync(OUT, { recursive: true });

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
async function block(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    check(`${name}: ran to the end`, false, String((e as Error)?.stack ?? e).slice(0, 600));
  }
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' };
const DESK = { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' };
const BUYER = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' };
const shot = async (page: any, name: string, full = false) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
};
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - window.innerWidth);
async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  check(`a11y (axe-core): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}
async function smallTargets(page: any): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('main button, main a[href], main input:not([type=hidden]), main select')) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
      // inline text links inside sentences are exempt (WCAG 2.5.8 inline exception)
      if (el.tagName === 'A' && el.closest('p, li')) continue;
      if (r.height < 35.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  });
}

const server = startNext({ port: PORT, dataDir, env: { ADMIN_PASSWORD: PASSWORD, CLAIM_ORDER_VERIFICATION: 'manual', PLATFORM_PUBLIC_URL: BASE } });
const serverOff = startNext({ port: PORT_OFF, dataDir, env: { ADMIN_PASSWORD: '' } });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 60_000, server);
  await waitForServer(`http://127.0.0.1:${PORT_OFF}/start`, 60_000, serverOff);
  browser = await chromium.launch();
  let editUrl = '';
  let slug = '';

  await block('admin off without a password', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const res = await page.goto(`http://127.0.0.1:${PORT_OFF}/admin`);
    check('off: /admin answers 200 with an honest "kapalı" note', res.status() === 200 && (await page.locator('[data-admin-off]').count()) === 1);
    check('off: no sign-in form', (await page.locator('[data-admin-login]').count()) === 0);
    check('off: noindex + frame-ancestors none', /noindex/.test(await page.locator('meta[name="robots"]').getAttribute('content')) && /frame-ancestors 'none'/.test(res.headers()['content-security-policy'] ?? ''));
    await shot(page, 'a00_admin_off_390');
    await ctx.close();
  });

  await block('buyer starts a website (order waits for the shop)', async () => {
    const ctx = await browser.newContext(BUYER);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/start?theme=blush-garden-rose`);
    await page.fill('#start-order', '3456789012');
    await page.fill('#start-email', 'buyer@example.com');
    await page.fill('#start-name1', 'Emma');
    if (await page.locator('#start-name2').count()) await page.fill('#start-name2', 'Liam');
    await page.waitForTimeout(700);
    await page.click('button[type=submit]');
    await page.waitForSelector('#start-edit-link', { timeout: 15_000 });
    editUrl = await page.inputValue('#start-edit-link');
    slug = new URL(editUrl).pathname.split('/')[2];
    check('/start gives an edit link', /\/edit\/[a-z0-9-]+\?k=/.test(editUrl), editUrl.replace(/k=.*/, 'k=…'));
    await page.goto(editUrl.replace(/#.*$/, ''));
    await page.waitForSelector('[data-setup], [data-status-card]', { timeout: 15_000 });
    // set the wedding date in the first setup step: the sample reply-by date follows it
    const date = page.locator('input[type=date]').first();
    await date.fill('2027-09-18');
    await page.waitForTimeout(1500);
    await page.goto(editUrl.replace(/#.*$/, '') + '#home');
    await page.waitForSelector('[data-status-card]');
    const card = await page.locator('[data-status-card]').innerText();
    check('Home: the status card says the order is being confirmed', /Confirming your order/i.test(card) && /publish as soon as it is confirmed/i.test(card), card.replace(/\s+/g, ' ').slice(0, 160));
    check('Home: no Publish button in the status card while the order waits', !/^\s*Publish\s*$/m.test(card));
    const body = await page.locator('main').innerText();
    check('Home: replies close 6 weeks before the new date (not on the sample day)', /August 7, 2027/.test(body) && !/April 3, 2027/.test(body));
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, 'b01_buyer_home_pending_390');
    await ctx.close();
  });

  let phone: any;
  let phoneCtx: any;
  await block('shop signs in', async () => {
    phoneCtx = await browser.newContext(PHONE);
    phone = await phoneCtx.newPage();
    await phone.goto(`${BASE}/admin`);
    await phone.waitForSelector('[data-admin-login]');
    await shot(phone, 'a01_signin_390');
    await axe(phone, 'admin sign-in');
    await phone.fill('#admin-password', 'not the password');
    await phone.click('[data-admin-login] button[type=submit]');
    await phone.waitForSelector('#admin-login-error');
    check('wrong password: clear Turkish message', (await phone.locator('#admin-login-error').innerText()).includes('Şifre doğru değil'));
    await phone.fill('#admin-password', PASSWORD);
    await phone.click('[data-admin-login] button[type=submit]');
    await phone.waitForSelector('[data-filter="action"]', { timeout: 15_000 });
    const cookies = await phoneCtx.cookies();
    const c = cookies.find((x: any) => x.name === 'bke_admin');
    check('session cookie is HttpOnly + SameSite=Strict', c && c.httpOnly && c.sameSite === 'Strict');
  });

  await block('list', async () => {
    check('"Yapılacak" filter is selected and shows the new order', (await phone.getAttribute('[data-filter="action"]', 'aria-pressed')) === 'true' && (await phone.locator(`[data-site="${slug}"]`).count()) === 1);
    check('list: card says the order waits', (await phone.locator(`[data-site="${slug}"]`).innerText()).includes('Sipariş onayı bekliyor'));
    check('list 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await shot(phone, 'a02_list_action_390', true);
    await axe(phone, 'admin list');
    const small = await smallTargets(phone);
    check('list: touch targets ≥ 36 px', !small.length, small.join(', '));
    await phone.click('[data-filter="all"]');
    await phone.fill('#admin-search', '#3456');
    await phone.waitForTimeout(200);
    check('search by order number finds the site', (await phone.locator('[data-site]').count()) === 1);
    await phone.fill('#admin-search', 'nobody-matches-this');
    await phone.waitForSelector('[data-admin-empty]');
    check('search without a match: empty state', true);
    await phone.fill('#admin-search', '');
  });

  await block('site page: confirm the order', async () => {
    await phone.click(`[data-site="${slug}"]`);
    await phone.waitForSelector('[data-todo="confirm"]');
    await shot(phone, 'a03_site_pending_390');
    await shot(phone, 'a03_site_pending_390_full', true);
    check('site 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await axe(phone, 'admin site page');
    const small = await smallTargets(phone);
    check('site page: touch targets ≥ 36 px', !small.length, small.join(', '));
    await phone.click('[data-action="confirm"]');
    await phone.waitForSelector('[data-todo="confirm"]', { state: 'detached' });
    check('after confirm: the to-do box is gone', true);
    const msg = await phone.inputValue('#msg-text');
    check('the "order confirmed" message is ready, filled in', /Hi Emma & Liam!/.test(msg) && /#3456789012/.test(msg) && msg.includes(`/${slug}`), msg.slice(0, 120));
    check('history shows the confirmation', (await phone.locator('section[aria-labelledby="history-title"]').innerText()).includes('Sipariş onaylandı'));
  });

  await block('buyer can publish now', async () => {
    const ctx = await browser.newContext(BUYER);
    const page = await ctx.newPage();
    await page.goto(editUrl.replace(/#.*$/, '') + '#home');
    await page.waitForSelector('[data-status-card]');
    const card = await page.locator('[data-status-card]').innerText();
    check('buyer Home: no "confirming" any more', !/Confirming your order/i.test(card));
    await ctx.close();
  });

  await block('new edit link', async () => {
    await phone.click('[data-action="reissue"]');
    await phone.click('[data-action="reissue-confirm"]');
    await phone.waitForSelector('[data-new-link]');
    const fresh = (await phone.locator('[data-new-link] p').first().innerText()).trim();
    check('a new edit link is shown once', /\/edit\/[a-z0-9-]+\?k=[A-Za-z0-9_-]{43}$/.test(fresh), fresh.replace(/k=.*/, 'k=…'));
    const msg = await phone.inputValue('#msg-text');
    check('the "new editor link" message holds the new link', msg.includes(fresh));
    await shot(phone, 'a04_new_link_390');
    const ctx = await browser.newContext(BUYER);
    const page = await ctx.newPage();
    const old = await page.goto(editUrl);
    check('the old edit link no longer opens the panel', old.status() === 404);
    const ok = await page.goto(fresh);
    check('the new edit link opens the panel', ok.status() === 200);
    await ctx.close();
  });

  await block('delete needs the address', async () => {
    const del = phone.locator('[data-action="delete"]');
    check('delete is disabled until the address is typed', await del.isDisabled());
    await phone.fill('#delete-confirm', 'wrong');
    check('a wrong address keeps it disabled', await del.isDisabled());
  });

  await block('desktop', async () => {
    const ctx = await browser.newContext(DESK);
    await ctx.addCookies(await phoneCtx.cookies());
    const page = await ctx.newPage();
    await page.goto(`${BASE}/admin`);
    await page.waitForSelector('[data-filter="all"]');
    check('1280: no horizontal scroll', (await overflow(page)) <= 0);
    await shot(page, 'a05_list_1280');
    await page.click(`[data-site="${slug}"]`);
    await page.waitForSelector('#msg-text');
    await shot(page, 'a06_site_1280');
    await ctx.close();
  });

  await block('sign out', async () => {
    await phone.click('header button');
    await phone.waitForSelector('[data-admin-login]');
    check('sign out returns to the sign-in form', true);
    const api = await phone.evaluate(async () => (await fetch('/api/admin/sites')).status);
    check('API after sign-out: 401', api === 401, String(api));
  });
} finally {
  await browser?.close();
  server.stop();
  serverOff.stop();
  writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), checks }, null, 1));
  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  if (failed.length) process.exitCode = 1;
  void readFileSync;
}
