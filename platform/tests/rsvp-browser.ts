// Browser check of the RSVP form contract (G042): real `next start` + Chromium at 390 px,
// fixture theme tests/fixtures/themes/rsvp-fixture. Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/rsvp-browser.ts
//
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`). Seeds into temporary
// folders (platform/.data is not touched). Screenshots go to $RSVP_SHOTS_DIR (default: a temp folder).
// Exit code 1 when a check fails.

import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 3312);
const BASE = `http://127.0.0.1:${PORT}`;
const require = createRequire(import.meta.url);

let chromium: any;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
  try {
    ({ chromium } = require(id));
    break;
  } catch {
    /* next location */
  }
}
if (!chromium) {
  console.error('playwright not found: run with NODE_PATH=/opt/node22/lib/node_modules');
  process.exit(2);
}
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const demo = (): ContentRecord =>
  JSON.parse(readFileSync(path.join(ROOT, '../collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'rsvp-browser-data-'));
const themesDir = mkdtempSync(path.join(os.tmpdir(), 'rsvp-browser-themes-'));
const shots = process.env.RSVP_SHOTS_DIR || mkdtempSync(path.join(os.tmpdir(), 'rsvp-browser-shots-'));
mkdirSync(shots, { recursive: true });
cpSync(path.join(ROOT, 'tests/fixtures/themes/rsvp-fixture'), path.join(themesDir, 'rsvp-fixture'), { recursive: true });
process.env.PLATFORM_THEMES_DIR = themesDir;

const adapter = new LocalAdapter(dataDir);
async function seed(slug: string, deadlineDays: number, publish: boolean) {
  const c = demo();
  c.rsvp.deadline = isoDay(deadlineDays);
  c.date = isoDay(deadlineDays + 60);
  const s = await createSiteWithKeys(adapter, { slug, theme: 'rsvp-fixture', content: c });
  if (publish) await publishSite(adapter, s.site.id);
  return s;
}
const open = await seed('open-demo', 120, true);
await seed('closed-demo', -3, true);
const draft = await seed('draft-demo', 120, false);

const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, PLATFORM_DATA_DIR: dataDir, PLATFORM_THEMES_DIR: themesDir, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

async function waitForServer(url: string, ms = 30_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`server did not start at ${url}`);
}

let browser: any;
try {
  await waitForServer(`${BASE}/`);
  const js = await fetch(`${BASE}/rsvp/form.js`);
  check('/rsvp/form.js is served as JavaScript', js.status === 200 && /javascript/.test(js.headers.get('content-type') ?? ''), `${js.status} ${js.headers.get('content-type')}`);

  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const newPage = async (url: string): Promise<{ page: any; problems: string[] }> => {
    const page = await context.newPage();
    const problems: string[] = [];
    page.on('console', (m: { type(): string; text(): string }) => {
      // 4xx answers of the API are expected in some steps; anything else is a problem.
      if (m.type() === 'error' && !/status of 4\d\d/.test(m.text())) problems.push(m.text());
    });
    page.on('pageerror', (e: unknown) => problems.push(String(e)));
    await page.goto(url, { waitUntil: 'networkidle' });
    return { page, problems };
  };
  const visible = (page: { isVisible(s: string): Promise<boolean> }, sel: string) => page.isVisible(sel);

  // 1. Open site: fill and send a "yes" reply.
  {
    const { page, problems } = await newPage(`${BASE}/open-demo/rsvp`);
    const info = await page.evaluate(() => {
      const hp = document.querySelector('[data-rsvp-honeypot] input[name="website"]') as HTMLInputElement | null;
      const r = hp?.getBoundingClientRect();
      return {
        status: document.querySelector('form[data-rsvp-form]')?.getAttribute('data-rsvp-status'),
        max: (document.querySelector('input[name="guests"]') as HTMLInputElement).max,
        honeypot: hp ? { tab: hp.tabIndex, right: r!.right, hidden: hp.closest('[aria-hidden="true"]') !== null } : null,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    check('open: script ready', info.status === 'ready', String(info.status));
    check('open: guests max set from theme (6)', info.max === '6', info.max);
    check('open: honeypot added off-screen, aria-hidden, not tabbable', info.honeypot && info.honeypot.right <= 0 && info.honeypot.hidden && info.honeypot.tab === -1, JSON.stringify(info.honeypot));
    check('open: no horizontal overflow at 390 px', info.overflow <= 0, String(info.overflow));
    check('open: all state panels hidden at start', !(await visible(page, '[data-rsvp-state="success"]')) && !(await visible(page, '[data-rsvp-state="error"]')));
    await page.screenshot({ path: path.join(shots, 'rsvp_open_390.png'), fullPage: true });

    await page.fill('input[name="name"]', 'Mara Quinn');
    await page.fill('input[name="email"]', 'mara@example.org');
    await page.check('input[name="attending"][value="yes"]');
    await page.fill('input[name="guests"]', '2');
    await page.fill('textarea[name="message"]', 'So happy for you both!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 5000 });
    check('send yes: success panel shown, form hidden', (await visible(page, '[data-rsvp-state="success"]')) && !(await visible(page, 'form[data-rsvp-form]')));
    check('send yes: "yes" text shown, "no" text hidden', (await visible(page, '[data-rsvp-reply="yes"]')) && !(await visible(page, '[data-rsvp-reply="no"]')));
    const list1 = await adapter.listRsvps(open.site.id);
    check('send yes: stored once with the typed values', list1.length === 1 && list1[0].name === 'Mara Quinn' && list1[0].guests === 2 && list1[0].attending === true, JSON.stringify(list1.map((r) => [r.name, r.guests])));
    await page.screenshot({ path: path.join(shots, 'rsvp_success_390.png'), fullPage: true });

    // 2. "Send another reply" -> decline; the guests field hides.
    await page.click('[data-rsvp-again]');
    check('again: form back, panels hidden', (await visible(page, 'form[data-rsvp-form]')) && !(await visible(page, '[data-rsvp-state="success"]')));
    await page.fill('input[name="name"]', 'Theo Park');
    await page.check('input[name="attending"][value="no"]');
    check('decline: guests field hidden', !(await visible(page, '[data-rsvp-if-attending]')));
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 5000 });
    check('decline: "no" text shown', (await visible(page, '[data-rsvp-reply="no"]')) && !(await visible(page, '[data-rsvp-reply="yes"]')));
    const list2 = await adapter.listRsvps(open.site.id);
    check('decline: stored with 0 guests', list2.length === 2 && list2[1].attending === false && list2[1].guests === 0);

    // 3a. Client-side check: the theme's error slots (English, styled), not the browser bubble; nothing is sent.
    await page.click('[data-rsvp-again]');
    const posts: string[] = [];
    page.on('request', (rq: any) => { if (rq.method() === 'POST') posts.push(rq.url()); });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const client = await page.evaluate(() => {
      const f = document.querySelector('form[data-rsvp-form]') as HTMLFormElement;
      const name = f.querySelector('input[name="name"]')!;
      const att = f.querySelector('input[name="attending"]')!;
      const slot = (n: string) => document.querySelector(`[data-rsvp-error-for="${n}"]`) as HTMLElement;
      return {
        noValidate: f.noValidate,
        name: slot('name').textContent,
        // the fixture has no slot for "attending": that field falls back to the browser's message (setCustomValidity)
        attending: (att as HTMLInputElement).validationMessage,
        attendingInvalid: att.getAttribute('aria-invalid'),
        linked: (name.getAttribute('aria-describedby') || '').split(' ').includes(slot('name').id),
        focus: document.activeElement === name,
        errorPanel: !(document.querySelector('[data-rsvp-state="error"]') as HTMLElement).hidden,
      };
    });
    check('client check: messages in the theme slots, linked to the fields, focus on the first', client.noValidate && client.name === 'Please enter your name.' && client.attending === 'Please let us know if you can attend.' && client.attendingInvalid === 'true' && client.linked && client.focus && !client.errorPanel, JSON.stringify(client));
    check('client check: nothing sent', posts.length === 0, posts.join(', '));
    await page.screenshot({ path: path.join(shots, 'rsvp_client_errors_390.png'), fullPage: true });

    // 3b. Server-side validation message (a name of spaces passes the browser's check, the server trims it).
    await page.fill('input[name="name"]', '   ');
    await page.check('input[name="attending"][value="yes"]');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="error"]:not([hidden])', { timeout: 5000 });
    const err = await page.evaluate(() => ({
      panel: document.querySelector('[data-rsvp-state="error"] [data-rsvp-message]')?.textContent,
      field: document.querySelector('[data-rsvp-error-for="name"]')?.textContent,
      invalid: document.querySelector('input[name="name"]')?.getAttribute('aria-invalid'),
      formVisible: !(document.querySelector('form[data-rsvp-form]') as HTMLElement).hidden,
    }));
    check('invalid: error panel shows the server message', err.panel === 'Please enter your name.', String(err.panel));
    check('invalid: field message + aria-invalid, form stays', err.field === 'Please enter your name.' && err.invalid === 'true' && err.formVisible);
    await page.screenshot({ path: path.join(shots, 'rsvp_error_390.png'), fullPage: true });
    await page.fill('input[name="name"]', 'Mara Quinn Jr');
    const cleared = await page.evaluate(() => document.querySelector('input[name="name"]')?.getAttribute('aria-invalid'));
    check('invalid: typing clears the field error', cleared === null, String(cleared));
    check('open page: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // 4. Closed site: the closed panel shows on load.
  {
    const { page, problems } = await newPage(`${BASE}/closed-demo/rsvp`);
    await page.waitForSelector('[data-rsvp-state="closed"]:not([hidden])', { timeout: 5000 });
    const msg = await page.textContent('[data-rsvp-state="closed"] [data-rsvp-message]');
    check('closed: panel shown on load, form hidden', !(await visible(page, 'form[data-rsvp-form]')));
    check('closed: friendly message with the date', /^Replies closed on [A-Z][a-z]+ \d{1,2}, \d{4}\./.test(msg ?? ''), String(msg));
    check('closed page: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.screenshot({ path: path.join(shots, 'rsvp_closed_390.png'), fullPage: true });
    await page.close();
  }

  // 5. Draft in preview: nothing is sent.
  {
    const { page, problems } = await newPage(`${BASE}/draft-demo/rsvp?preview=${draft.previewKey}`);
    let posted = false;
    page.on('request', (r: { method(): string; url(): string }) => {
      if (r.method() === 'POST' && r.url().includes('/api/rsvp/')) posted = true;
    });
    await page.fill('input[name="name"]', 'Couple Testing');
    await page.check('input[name="attending"][value="yes"]');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="preview"]:not([hidden])', { timeout: 5000 });
    check('preview: preview panel shown, no POST sent', !posted);
    check('preview: nothing stored', (await adapter.listRsvps(draft.site.id)).length === 0);
    check('preview page: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.screenshot({ path: path.join(shots, 'rsvp_preview_390.png'), fullPage: true });
    await page.close();
  }
} catch (e) {
  check('run', false, String(e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
  rmSync(dataDir, { recursive: true, force: true });
  rmSync(themesDir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
console.log(`\nScreenshots: ${shots}`);
if (failed.length) {
  console.error(`${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
  process.exit(1);
}
console.log(`All ${checks.length} checks passed.`);
