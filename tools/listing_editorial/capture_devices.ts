// Real screens of "continue on any device" (G146, K46) for listing image 9 (G148, K47): the /my form on a phone and the
// editor's Share → "Use on another device" card listing the devices signed in with the order number.
//
//   cd platform && npm run build                    (once)
//   NODE_PATH=/opt/node22/lib/node_modules node tools/listing_editorial/capture_devices.ts --theme <id> --out <dir>
//
// Local production build (`next start`, local adapter, temp data folder, order check off, no e-mail sender); nothing is
// deployed. The buyer flow is the real one, with fictional data (the design's demo couple, order 5550012345,
// <first name>.demo@example.test):
//   1. a computer starts the website on /start (the form, as a buyer does), then signs in on /my with the order number
//      and e-mail (a device key);
//   2. an Android phone signs in on /my the same way;
//   3. an iPhone opens /my, fills in the order number and e-mail → m01_my_form.jpg; Continue → the editor opens →
//      Share → "Use on another device" → m02_devices.jpg (three devices, "This device" on the iPhone).
// The devices are named from the browser's user agent (lib/device-keys.ts deviceLabel); this script sets the three user
// agents (Chromium renders every page). Listing images carry no web address and no QR code (Etsy Off-Platform policy,
// docs/15 §4.1): in m02 the card's first line (the /my address) and its QR row are hidden, and so are the Share cards
// above it (they would show through the editor's see-through top bar); the check below fails when
// any visible text holds the host or "/my", or a QR-sized svg is visible. Writes <out>/m01_my_form.jpg,
// <out>/m02_devices.jpg and <out>/devices_capture.json. Exit 1 when a check fails.

import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, '../../platform');
const { loadChromium, startNext, waitForServer } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/browser.ts')).href);
const { loadThemeEnv } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/theme-env.ts')).href);

function arg(name: string, def: string | null = null): string | null {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}
const THEME = arg('theme');
const OUT = arg('out');
const PUBLIC_URL = 'https://davetiye-platform-five.vercel.app';
const HOST = new URL(PUBLIC_URL).host;
if (!THEME || !OUT) {
  console.error('usage: capture_devices.ts --theme <id> --out <dir>');
  process.exit(2);
}
if (!existsSync(path.join(PLATFORM, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` in platform/ first.');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });
const env = loadThemeEnv({ theme: THEME });
const names: string[] = (env.demo.partners ?? []).map((p: { display_name?: string }) => p.display_name ?? '').filter(Boolean);
const ORDER = '5550012345';
const EMAIL = `${(names[0] ?? 'demo').toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '')}.demo@example.test`;

const UA = {
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
};
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' };
const computer = { viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'America/New_York' };

const net = await import('node:net');
const PORT: number = await new Promise((resolve, reject) => {
  const s = net.createServer();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => {
    const p = (s.address() as { port: number }).port;
    s.close(() => resolve(p));
  });
});
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'listing-devices-data-'));
const server = startNext({
  port: PORT,
  dataDir,
  env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL, CLAIM_ORDER_VERIFICATION: 'off', SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '' },
});
const BASE = server.base;
const chromium = loadChromium();
const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

/** /my → order number + e-mail → Continue → the editor (a device key for this browser). */
async function signIn(page: any, label: string) {
  await page.goto(`${BASE}/my`, { waitUntil: 'networkidle' });
  await page.fill('#my-order', ORDER);
  await page.fill('#my-email', EMAIL);
  await page.click('[data-my-submit]');
  await page.waitForURL(/\/edit\//, { timeout: 15_000 });
  check(`${label}: /my opens the editor`, page.url().includes('/edit/'), page.url().replace(/[?#].*$/, ''));
}

let browser: any;
let failed = false;
try {
  await waitForServer(`${BASE}/`, 40_000, server);
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });

  // 1. the computer: /start (as a buyer), then /my
  {
    const ctx = await browser.newContext({ ...computer, userAgent: UA.mac });
    ctx.setDefaultTimeout(15_000);
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}/start?theme=${THEME}`, { waitUntil: 'networkidle' });
    check('computer: /start 200', res.status() === 200);
    await page.fill('#start-order', ORDER);
    await page.fill('#start-email', EMAIL);
    await page.fill('#start-name1', names[0] ?? 'Avery');
    if ((await page.locator('#start-name2').count()) > 0) await page.fill('#start-name2', names[1] ?? 'Jordan');
    await page.waitForSelector('[data-slug-available]');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-edit-link]');
    check('computer: website started', true);
    await signIn(page, 'computer');
    await ctx.close();
  }
  // 2. the Android phone
  {
    const ctx = await browser.newContext({ ...phone, userAgent: UA.android });
    ctx.setDefaultTimeout(15_000);
    await signIn(await ctx.newPage(), 'android');
    await ctx.close();
  }
  // 3. the iPhone: the /my form, then the devices card
  {
    const ctx = await browser.newContext({ ...phone, userAgent: UA.iphone });
    ctx.setDefaultTimeout(15_000);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/my`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.fill('#my-order', ORDER);
    await page.fill('#my-email', EMAIL);
    await page.locator('#my-email').blur();
    // from "Where is my order number?" (and "No account or password …") down to the Continue button
    // (from step 3, "Enter your order number and email here": the top edge sits in the gap above it, no line cut)
    await page.evaluate(() => {
      const el = (document.querySelector('[data-my-steps] li:last-of-type') ?? document.querySelector('[data-my-where]')) as HTMLElement;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: 'instant' });
    });
    await page.waitForTimeout(500);
    const fits = await page.evaluate(() => (document.querySelector('[data-my-submit]') as HTMLElement).getBoundingClientRect().bottom <= innerHeight - 8);
    check('iphone: /my from "Where is my order number?" to Continue on one screen', fits);
    await page.screenshot({ path: path.join(OUT, 'm01_my_form.jpg'), type: 'jpeg', quality: 88 });
    await page.click('[data-my-submit]');
    await page.waitForURL(/\/edit\//, { timeout: 15_000 });
    await page.waitForSelector('[data-panel]');
    await page.evaluate(() => void (location.hash = '#share'));
    await page.waitForSelector('[data-disclosure="devices"] button');
    await page.click('[data-disclosure="devices"] button');
    await page.waitForSelector('[data-device]');
    await page.waitForFunction(() => document.querySelectorAll('[data-device]').length >= 3, null, { timeout: 8000 }).catch(() => null);
    const rows: string[] = await page.locator('[data-device]').allInnerTexts();
    check('iphone: three signed-in devices, this one marked', rows.length === 3 && rows.some((r) => /iPhone · Safari[\s\S]*This device/.test(r)),
      rows.map((r) => r.replace(/\s+/g, ' ')).join(' | '));
    // no web address and no QR code in a listing picture: the card's /my line and its QR row are hidden
    await page.evaluate(() => {
      const card = document.querySelector('[data-devices]') as HTMLElement;
      (card.firstElementChild as HTMLElement).style.display = 'none';
      const qr = card.querySelector('[data-devices-qr]');
      if (qr?.parentElement) qr.parentElement.style.display = 'none';
      // the Share cards above it (link, message, downloads, password, edit link) are hidden in this picture, so no
      // card shows half-way through the editor's see-through top bar
      const head = document.querySelector('[data-disclosure="devices"]') as HTMLElement;
      for (let el = head.previousElementSibling; el; el = el.previousElementSibling) (el as HTMLElement).style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(700);
    const leaks = await page.evaluate((host: string) => {
      const out: string[] = [];
      const shown = (el: Element) => (el as any).checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const t = n.textContent ?? '';
        if (!n.parentElement || !shown(n.parentElement) || !(t.includes(host) || /(^|\s)\/my\b/.test(t))) continue;
        const r = n.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight && r.width > 0) out.push(t.trim().slice(0, 60));
      }
      for (const svg of document.querySelectorAll('svg')) {
        const r = svg.getBoundingClientRect();
        if (r.width >= 80 && Math.abs(r.width - r.height) <= 4 && r.bottom > 0 && r.top < innerHeight && shown(svg)) out.push('QR-sized svg');
      }
      return out;
    }, HOST);
    check('iphone: no web address or QR in the devices picture', leaks.length === 0, leaks.join(' | '));
    const listed = await page.evaluate(() => {
      const b = document.querySelector('[data-sign-out-others]') as HTMLElement | null;
      return b ? b.getBoundingClientRect().bottom <= innerHeight - 70 : false;
    });
    check('iphone: the device list and "Sign out other devices" on one screen', listed);
    await page.screenshot({ path: path.join(OUT, 'm02_devices.jpg'), type: 'jpeg', quality: 88 });
    await ctx.close();
  }
} catch (e) {
  failed = true;
  check('run', false, String((e as Error)?.stack ?? e).split('\n').slice(0, 3).join(' | '));
} finally {
  if (browser) await browser.close();
  server.stop();
}
writeFileSync(
  path.join(OUT, 'devices_capture.json'),
  JSON.stringify(
    {
      tool: 'tools/listing_editorial/capture_devices.ts (G148)',
      theme: THEME,
      date: new Date().toISOString().slice(0, 10),
      server: 'next start (local production build of this checkout), local adapter, temp data folder, order check off, no e-mail sender',
      buyer: `${names.join(' & ')}, order ${ORDER}, ${EMAIL} (fictional)`,
      devices: 'Mac · Chrome (started on /start, then /my), Android · Chrome (/my), iPhone · Safari (/my, the pictures): user agents set by this script; Chromium renders every page',
      shots: ['m01_my_form.jpg: /my on the iPhone, order number + e-mail filled in', 'm02_devices.jpg: editor → Share → Use on another device, three devices (the /my address line and its QR row, and the Share cards above this one, hidden in this picture)'],
      checks,
    },
    null,
    2,
  ) + '\n',
);
rmSync(dataDir, { recursive: true, force: true });
const bad = checks.filter((c) => !c.ok);
if (failed || bad.length) {
  console.error(`\n${bad.length} check(s) failed.\n--- server log ---\n${server.log().slice(-2000)}`);
  process.exit(1);
}
console.log(`\ncapture_devices: 2 screens in ${OUT}`);
