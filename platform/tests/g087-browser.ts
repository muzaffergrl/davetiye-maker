// Browser journey of the shop admin (G087, K30) and the buyer side of an order waiting for the shop: real `next start`
// + Chromium. Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g087-browser.ts
//
// Buyer: /start (manual order check) → panel Home says the order is being confirmed (no Publish there) → the sample
// reply-by date follows the new wedding date. Shop: /admin off without ADMIN_PASSWORD → sign-in (wrong, right) → list
// ("Yapılacak" first, search) → site page → confirm the order → the buyer can publish → ready Etsy message → new edit
// link (old link dead, new link opens the panel) → delete needs the address. "My website" (/my, G146): order number +
// email first, the private edit link folded ("Have your private edit link?"); the sales-site header keeps its menu button
// on screen at 360, 390 and 430 px (TR). 390 × 844 and 1280 × 900; axe-core, touch
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
  let shopEdit = '';
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
    await phone.waitForSelector('[data-kpis]', { timeout: 15_000 });
    const cookies = await phoneCtx.cookies();
    const c = cookies.find((x: any) => x.name === 'bke_admin');
    check('session cookie is HttpOnly + SameSite=Strict', c && c.httpOnly && c.sameSite === 'Strict');
  });

  await block('overview (Özet)', async () => {
    check('overview: the waiting order is a to-do', (await phone.locator('[data-todo="confirm"]').count()) >= 1 && (await phone.locator('[data-todos]').innerText()).includes('Emma & Liam'));
    check('overview: "Onay bekleyen sipariş" counts it', Number(await phone.locator('[data-kpi="action"] p').first().innerText()) >= 1);
    check('overview: weekly sales chart', (await phone.locator('[data-weeks] [role="img"]').count()) === 1);
    check('overview 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await shot(phone, 'a01b_overview_390', true);
    await axe(phone, 'admin overview');
    const small = await smallTargets(phone);
    check('overview: touch targets ≥ 36 px', !small.length, small.join(', '));
    await phone.click('[data-nav="orders"]');
    await phone.waitForSelector('[data-filter="action"]');
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
    check('the "order confirmed" message is ready, filled in', /Emma & Liam/.test(msg) && /3456789012/.test(msg) && msg.includes(`/${slug}`) && !/[{}]/.test(msg), msg.slice(0, 160));
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

  await block('note, replies, content on the site page', async () => {
    await phone.fill('#note-text', 'Etsy: altın yazı istedi');
    await phone.click('[data-action="note"]');
    await phone.waitForSelector('section[data-note] [role="status"]');
    check('note saved', (await phone.locator('section[data-note]').innerText()).includes('Not kaydedildi'));
    check('replies section with CSV', (await phone.locator('[data-rsvp-csv]').count()) === 1);
    check('content section shows the venue', (await phone.locator('[data-content]').innerText()).length > 40);
    const preview = await phone.getAttribute('[data-quick-preview]', 'href');
    const ctx = await browser.newContext(BUYER);
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}${preview}`);
    check('"Taslağı gör" opens the draft', res.status() === 200, String(res.status()));
    await ctx.close();
    await shot(phone, 'a03b_site_sections_390', true);
  });

  await block('customers + designs', async () => {
    await phone.goto(`${BASE}/admin/customers`);
    await phone.waitForSelector('[data-customer]');
    check('customers: the buyer is listed by email', (await phone.locator('[data-customer]').first().innerText()).includes('@'));
    check('customers 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await axe(phone, 'admin customers');
    await shot(phone, 'a07_customers_390', true);
    await phone.goto(`${BASE}/admin/designs`);
    await phone.waitForSelector('[data-design]');
    check('designs: every design has a card', (await phone.locator('[data-design]').count()) >= 1);
    check('designs 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await axe(phone, 'admin designs');
    await shot(phone, 'a08_designs_390', true);
  });

  await block('Yeni sipariş', async () => {
    await phone.goto(`${BASE}/admin/new`);
    await phone.waitForSelector('[data-new-order]');
    await axe(phone, 'admin new order');
    await phone.click('[data-action="create"]');
    await phone.waitForSelector('[aria-invalid="true"]');
    check('empty form: fields marked', (await phone.locator('[aria-invalid="true"]').count()) >= 3);
    const theme = await phone.locator('#new-theme option').nth(1).getAttribute('value');
    await phone.selectOption('#new-theme', theme!);
    await phone.fill('#new-orderNumber', '9988776655');
    await phone.fill('#new-email', 'shopmade@example.com');
    await phone.fill('#new-name1', 'Nora');
    if (await phone.locator('#new-name2').isVisible()) await phone.fill('#new-name2', 'Sam');
    await phone.click('[data-action="create"]');
    await phone.waitForSelector('[data-created]');
    const text = await phone.inputValue('#created-msg');
    check('created: link + ready message', /\/edit\/nora/.test(text) && !/[{}]/.test(text), text.slice(0, 120));
    shopEdit = (/(https?:\/\/\S+\/edit\/\S+)/.exec(text) ?? [''])[0];
    check('new order 390: no horizontal scroll', (await overflow(phone)) <= 0);
    await shot(phone, 'a09_new_order_done_390', true);
    await phone.goto(`${BASE}/admin/orders?f=all`);
    await phone.waitForSelector('[data-site]');
    check('the new order is in the list', (await phone.locator('[data-site^="nora"]').count()) === 1);
  });

  await block('"My website" on the sales site', async () => {
    const ctx = await browser.newContext(BUYER);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/my`);
    // G146 (K46): the way in on any device is the Etsy order number + email; the private edit link is a folded
    // shortcut ("Have your private edit link?", opened by /my#link).
    await page.waitForSelector('[data-my-continue] [data-my-submit]');
    check('/my without a saved editor: no "On this device"', (await page.locator('[data-my-saved]').count()) === 0);
    check('/my: order number + email is the way in', (await page.locator('[data-my-continue] input').count()) >= 2);
    check('/my: the edit-link box is folded until asked for', !(await page.locator('#my-edit-link').isVisible()));
    await page.click('[data-my-link] summary');
    await page.waitForSelector('#my-edit-link');
    await page.fill('#my-edit-link', 'https://example.com/whatever');
    await page.click('[data-my-paste]');
    await page.waitForSelector('#my-edit-link-err');
    check('/my: a foreign link is refused', true);
    await axe(page, 'my website');
    await shot(page, 'a10_my_empty_390', true);
    // opening the editor once on this device makes "My website" one tap
    await page.goto(shopEdit);
    await page.waitForSelector('[data-status-card], [data-setup]', { timeout: 20_000 }).catch(() => undefined);
    await page.goto(`${BASE}/my`);
    await page.waitForSelector('[data-my-saved]');
    check('/my after opening the editor: "On this device" with Open editor', (await page.locator('[data-my-open]').count()) === 1);
    await shot(page, 'a11_my_saved_390');
    await page.click('[data-my-open]');
    await page.waitForURL(/\/edit\//);
    check('"Open editor" goes back into the panel', page.url().includes('/edit/nora'));
    await page.goto(`${BASE}/`);
    check('sales site header: "My website" button at 390', await page.locator('header [data-my-website]').isVisible());
    // the menu button (the header also holds the language switch's <summary>, G144)
    const MENU = 'header details:not([data-lang-switch]) > summary';
    const menu390 = await page.locator(MENU).boundingBox();
    check('sales site 390: the menu button is still on screen', Boolean(menu390 && menu390.x + menu390.width <= 390), JSON.stringify(menu390));
    check('sales site 390: no horizontal scroll', (await overflow(page)) <= 0);
    await shot(page, 'a12_home_header_390');
    await ctx.close();
    const small = await browser.newContext({ ...BUYER, viewport: { width: 360, height: 780 } });
    const p360 = await small.newPage();
    await p360.goto(`${BASE}/`);
    check('sales site 360: header fits', (await overflow(p360)) <= 0 && (await p360.locator('header [data-my-website]').isVisible()));
    const menu360 = await p360.locator(MENU).boundingBox();
    check('sales site 360: the menu button is still on screen', Boolean(menu360 && menu360.x + menu360.width <= 360), JSON.stringify(menu360));
    await shot(p360, 'a13_home_header_360');
    await small.close();
    // 430 px, Turkish (the longest "Create your website"): the one-line button pushed the menu button off the screen
    const wide = await browser.newContext({ ...BUYER, locale: 'tr-TR', viewport: { width: 430, height: 932 } });
    const p430 = await wide.newPage();
    await p430.goto(`${BASE}/tr`);
    const menu430 = await p430.locator(MENU).boundingBox();
    check('sales site 430 (TR): the menu button is still on screen', Boolean(menu430 && menu430.x + menu430.width <= 430), JSON.stringify(menu430));
    await shot(p430, 'a14_home_header_430_tr');
    await wide.close();
  });

  await block('delete needs the address', async () => {
    await phone.goto(`${BASE}/admin/orders?f=all&q=${encodeURIComponent(slug)}`);
    await phone.click(`[data-site="${slug}"]`);
    await phone.waitForSelector('#delete-confirm');
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
    await page.waitForSelector('[data-kpis]');
    check('1280 overview: no horizontal scroll', (await overflow(page)) <= 0);
    await shot(page, 'a05a_overview_1280', true);
    await page.goto(`${BASE}/admin/orders`);
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
