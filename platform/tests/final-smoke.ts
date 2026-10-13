// Final smoke test of the platform at 390 px (phone), real theme blush-garden-rose, production build (`next start`).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/final-smoke.ts
//
// Guest journey (seeded demo site with the fictional sample photos): closed envelope -> tap -> home -> Story ->
//   Details -> RSVP -> reply sent and stored.
// Buyer journey: /start?theme=blush-garden-rose -> edit link -> panel (top, Photos: upload + crop) -> Publish ->
//   "Before you publish" notes -> Publish anyway -> live link + QR (decoded) -> public site 200 -> a guest reply on the
//   buyer's site shows in the panel.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data in a temp folder (platform/.data
// is not touched). Writes screenshots + checks.json to previews/final/ (or $FINAL_SHOTS_DIR). Exit code 1 on a failed check.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LocalAdapter } from '../lib/data/local/index.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const PORT = Number(process.env.PORT || 3321);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.FINAL_SHOTS_DIR || path.join(ROOT, 'previews/final');
const THEME = 'blush-garden-rose';
const PHOTO = path.join(REPO, 'collections/03_Blush_Garden_Rose/assets/gpt/photos/hero_portrait.jpg'); // fictional GPT sample photo
const require = createRequire(import.meta.url);
const sharp: any = require('sharp');
const jsQR: any = require('jsqr');

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

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'final-smoke-data-'));
mkdirSync(OUT, { recursive: true });

// Seed the demo site (published, sample photos) into the temp folder, exactly like `npm run seed`.
const seed = spawnSync(process.execPath, [path.join(ROOT, 'scripts/seed.ts')], { cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local' }, encoding: 'utf8' });
if (seed.status !== 0) {
  console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`);
  process.exit(1);
}
const DEMO = 'clara-and-julian';
const adapter = new LocalAdapter(dataDir);

const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));
// A hung step must not hang the run.
setTimeout(() => {
  console.error('final-smoke: still running after 8 minutes, stopped');
  server.kill('SIGTERM');
  process.exit(1);
}, 480_000).unref();

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

/** JPEG (q 80) for photo/painted pages, PNG for plain UI screens. */
const shot = async (page: any, name: string, opts: { fullPage?: boolean; png?: boolean } = {}) => {
  await page.waitForTimeout(300);
  const file = path.join(OUT, `${name}.${opts.png ? 'png' : 'jpg'}`);
  // A full-page capture draws the fixed bottom nav where the first screen ends (over the content): for the capture
  // only, the nav sits at the end of the page (over the padding the page keeps for it).
  const style = opts.fullPage ? await page.addStyleTag({ content: 'html { position: relative !important; } .site-nav { position: absolute !important; }' }) : null;
  await page.screenshot({ path: file, fullPage: Boolean(opts.fullPage), ...(opts.png ? {} : { type: 'jpeg', quality: 80 }) });
  if (style) await style.evaluate((el: Element) => el.remove());
};
// Against the device width: on a phone (isMobile) wide content widens the layout viewport itself.
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - screen.width);
/** Scroll through the page so scroll-triggered reveals run, then back to the top with all images loaded. */
async function revealAll(page: any) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 240) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  // Lazy images hidden on this layout (display:none) never load by themselves: wait only for the visible ones, bounded.
  await page.evaluate(() =>
    Promise.race([
      Promise.all([...document.images].filter((i) => i.offsetParent !== null && !i.complete).map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))),
      new Promise((r) => setTimeout(r, 8000)),
    ]),
  );
  await page.waitForTimeout(300);
}
const brokenImages = (page: any) =>
  page.evaluate(() => [...document.images].filter((i) => i.offsetParent !== null && i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')));
function watch(page: any, allow: RegExp | null = null) {
  const problems: string[] = [];
  page.on('console', (m: any) => m.type() === 'error' && !(allow && allow.test(m.text())) && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e: any) => problems.push(`pageerror: ${e.message}`));
  return problems;
}
async function waitSaved(page: any) {
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') !== 'saved', null, { timeout: 1500 }).catch(() => undefined);
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
}
async function openSection(page: any, id: string) {
  const button = page.locator(`#section-${id}`);
  if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
  await button.scrollIntoViewIfNeeded();
}
async function decodeQrFrom(locator: any): Promise<string | null> {
  const png = await locator.screenshot();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
}

let browser: any;
try {
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch();
  const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

  // ---------------------------------------------------------------- guest journey (seeded demo site)
  {
    const ctx = await browser.newContext(device);
    const page = await ctx.newPage();
    const problems = watch(page);
    const res = await page.goto(`${BASE}/${DEMO}`, { waitUntil: 'load' });
    check('guest: envelope page 200', res.status() === 200, String(res.status()));
    await page.waitForTimeout(1500);
    check('guest: envelope has no horizontal overflow', (await overflow(page)) <= 0);
    check('guest: envelope names from the content record', (await page.locator('body').innerText()).includes('Clara'));
    await shot(page, '01_guest_envelope_390');

    await page.click('.stage');
    await page.waitForURL(`${BASE}/${DEMO}/home`, { timeout: 9000 });
    check('guest: tap on the envelope opens /home', true);
    await page.waitForTimeout(5200); // card entrance
    await revealAll(page);
    const home = await page.locator('body').innerText();
    check('guest: home shows names, date and venue', /Clara/.test(home) && /Julian/.test(home) && /2027/.test(home), home.replace(/\s+/g, ' ').slice(0, 120));
    check('guest: home has no broken images', (await brokenImages(page)).length === 0, (await brokenImages(page)).join(', '));
    check('guest: home has no horizontal overflow', (await overflow(page)) <= 0);
    check('guest: no "Your photo here" label for guests', !/Your photo here/i.test(home));
    await shot(page, '02_guest_home_390', { fullPage: true });

    await page.click('.site-nav a[href$="/story"]');
    await page.waitForURL(`${BASE}/${DEMO}/story`, { timeout: 6000 });
    await revealAll(page);
    check('guest: story page via the nav', (await page.locator('body').innerText()).length > 50);
    check('guest: story has no broken images / overflow', (await brokenImages(page)).length === 0 && (await overflow(page)) <= 0);
    await shot(page, '03_guest_story_390', { fullPage: true });

    await page.click('.site-nav a[href$="/details"]');
    await page.waitForURL(`${BASE}/${DEMO}/details`, { timeout: 6000 });
    await revealAll(page);
    const details = await page.locator('body').innerText();
    check('guest: details shows the schedule time as "4:00 PM"-style', /\d{1,2}:\d{2}\s?(AM|PM)/.test(details));
    check('guest: details has no broken images / overflow', (await brokenImages(page)).length === 0 && (await overflow(page)) <= 0);
    await shot(page, '04_guest_details_390', { fullPage: true });

    await page.click('.site-nav a[href$="/rsvp"]');
    await page.waitForURL(`${BASE}/${DEMO}/rsvp`, { timeout: 6000 });
    await revealAll(page);
    check('guest: RSVP page has the form', (await page.locator('[data-rsvp-form]').count()) === 1);
    check('guest: RSVP page has no overflow', (await overflow(page)) <= 0);
    await shot(page, '05_guest_rsvp_390', { fullPage: true });

    await page.locator('[data-rsvp-form]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.fill('[data-rsvp-form] [name="name"]', 'Ada Fictional');
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.fill('[data-rsvp-form] [name="guests"]', '2');
    await page.fill('[data-rsvp-form] [name="message"]', 'So happy for you both!');
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 }).catch(() => null);
    check('guest: "thank you" panel after sending', await page.evaluate(() => !(document.querySelector('[data-rsvp-state="success"]') as HTMLElement).hidden));
    const demoSite = await adapter.getSiteBySlug(DEMO);
    const stored = demoSite ? await adapter.listRsvps(demoSite.id) : [];
    check('guest: reply stored for this site', stored.some((r: any) => r.name === 'Ada Fictional' && r.attending === true && r.guests === 2 && !r.held), String(stored.length));
    await page.locator('.reply-box').scrollIntoViewIfNeeded();
    await shot(page, '06_guest_rsvp_sent_390');
    check('guest: no console or page errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  }

  // ---------------------------------------------------------------- buyer journey (/start -> panel -> publish)
  {
    const ctx = await browser.newContext(device);
    const page = await ctx.newPage();
    const problems = watch(page);
    const res = await page.goto(`${BASE}/start?theme=${THEME}`, { waitUntil: 'networkidle' });
    check('buyer: /start page 200 with title', res.status() === 200 && (await page.locator('h1').innerText()) === 'Start your website');
    check('buyer: design name shown', (await page.locator('main').innerText()).includes('Blush Garden Rose'));
    await page.frameLocator('iframe').locator('body').waitFor();
    await page.waitForTimeout(1800); // envelope scene in the mini preview
    check('buyer: /start has no horizontal overflow', (await overflow(page)) <= 0);
    await shot(page, '07_buyer_start_390');

    const ORDER = '5550012345'; // fictional
    await page.fill('#start-order', ORDER);
    await page.fill('#start-email', 'elena.demo@example.test');
    await page.fill('#start-name1', 'Elena');
    await page.fill('#start-name2', 'Marco');
    await page.waitForSelector('[data-slug-available]');
    check('buyer: address follows the names', (await page.inputValue('#start-slug')) === 'elena-and-marco');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-edit-link]', { timeout: 15_000 });
    const editUrl = await page.inputValue('[data-edit-link]');
    check('buyer: edit link shown', /\/edit\/elena-and-marco\?k=[A-Za-z0-9_-]{43}$/.test(editUrl), editUrl.replace(/k=.*/, 'k=…'));
    check('buyer: site not public before Publish', (await fetch(`${BASE}/elena-and-marco`)).status === 404);
    await shot(page, '08_buyer_edit_link_390', { png: true });

    await page.click('[data-open-editor]');
    await page.waitForURL(/\/edit\/elena-and-marco\?k=/);
    await page.waitForSelector('[data-panel]');
    check('buyer: panel opens with the names', (await page.locator('[data-panel] h1').first().innerText()) === 'Elena & Marco');
    check('buyer: panel draft status', (await page.getAttribute('[data-panel]', 'data-status')) === 'draft');
    check('buyer: panel has no horizontal overflow', (await overflow(page)) <= 0);
    const bar = await page.locator('[data-publish]').boundingBox();
    check('buyer: Publish button in the fixed bar, >= 44 px', bar && bar.y + bar.height <= 844 && bar.height >= 44, JSON.stringify(bar));
    await shot(page, '09_buyer_panel_top_390', { png: true });

    // Photos: upload + crop the portrait of the invitation card.
    await openSection(page, 'photos');
    await page.setInputFiles('input[data-slot="hero_portrait"]', PHOTO);
    await page.waitForSelector('[data-testid="cropper"] img');
    await page.click('[data-crop-confirm]');
    await page.waitForSelector('[data-photo-slot="hero_portrait"] img', { timeout: 20_000 });
    await waitSaved(page);
    check('buyer: photo uploaded (1 of 5 added)', (await page.locator('#section-photos').innerText()).includes('1 of 5 added'));
    await page.locator('#section-photos').evaluate((el: Element) => el.scrollIntoView({ block: 'start' }));
    await page.evaluate(() => window.scrollBy(0, -8));
    await shot(page, '10_buyer_panel_photos_390');

    // Publish -> notes sheet -> Publish anyway -> live + QR.
    await page.click('[data-publish]');
    await page.waitForSelector('[data-testid="live"], [data-testid="notes"]', { timeout: 15_000 });
    const hadNotes = (await page.locator('[data-testid="notes"]').count()) > 0;
    const notes = hadNotes ? await page.locator('[data-testid="notes"]').innerText() : '';
    check('buyer: "Before you publish" notes (sample text from the demo, empty photo places)', hadNotes && /Photo places without a photo/.test(notes), notes.replace(/\s+/g, ' ').slice(0, 200));
    if (hadNotes) {
      await shot(page, '11_buyer_publish_notes_390', { png: true });
      const anyway = page.locator('[data-publish-anyway]');
      await anyway.scrollIntoViewIfNeeded();
      const box = await anyway.boundingBox();
      check('buyer: "Publish anyway" reachable on the phone (sheet scrolls)', box && box.y >= 0 && box.y + box.height <= 844 && box.height >= 44, JSON.stringify(box));
      await shot(page, '11b_buyer_publish_notes_end_390', { png: true });
      await anyway.click();
    }
    await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
    const PUBLIC_URL = `${BASE}/elena-and-marco`;
    check('buyer: "Your website is live"', (await page.locator('[data-testid="live"] h2').innerText()) === 'Your website is live');
    check('buyer: public link shown', (await page.locator('[data-live-link]').innerText()) === PUBLIC_URL);
    const qr = page.locator('[data-testid="live"] svg[role="img"]');
    check('buyer: QR decodes to the public URL', (await decodeQrFrom(qr)) === PUBLIC_URL);
    await qr.scrollIntoViewIfNeeded();
    await shot(page, '12_buyer_publish_live_qr_390', { png: true });
    await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();

    // The buyer's public site (a guest): envelope -> Skip -> home -> RSVP reply -> visible in the panel.
    const guest = await ctx.newPage();
    const guestProblems = watch(guest);
    const pubRes = await guest.goto(PUBLIC_URL, { waitUntil: 'load' });
    check('buyer site: public envelope 200', pubRes.status() === 200);
    await guest.click('[data-skip]');
    await guest.waitForURL(`${PUBLIC_URL}/home`, { timeout: 6000 });
    await guest.waitForTimeout(800);
    const guestHome = await guest.locator('body').innerText();
    check('buyer site: home shows the buyer names', /Elena/.test(guestHome) && /Marco/.test(guestHome));
    const heroSrc = await guest.evaluate(() => (document.querySelector('img[data-photo="hero_portrait"]') as HTMLImageElement | null)?.getAttribute('src') ?? null);
    check('buyer site: uploaded portrait is public after publishing', Boolean(heroSrc && heroSrc.startsWith('/media/') && !heroSrc.includes('preview=')), String(heroSrc));
    check('buyer site: no "Your photo here" label', !/Your photo here/i.test(guestHome));
    await guest.goto(`${PUBLIC_URL}/rsvp`, { waitUntil: 'load' });
    await guest.waitForTimeout(1500);
    await guest.fill('[data-rsvp-form] [name="name"]', 'Ben Fictional');
    await guest.check('[data-rsvp-form] [name="attending"][value="no"]');
    await guest.click('[data-rsvp-form] button[type="submit"]');
    await guest.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 }).catch(() => null);
    check('buyer site: guest reply sent', await guest.evaluate(() => !(document.querySelector('[data-rsvp-state="success"]') as HTMLElement).hidden));
    check('buyer site: no console or page errors', guestProblems.length === 0, guestProblems.join(' | '));
    await guest.close();

    await page.bringToFront();
    await openSection(page, 'rsvp');
    await page.click('[data-refresh-replies]');
    await page.waitForSelector('[data-replies] li', { timeout: 8000 }).catch(() => null);
    const replies = await page.locator('[data-replies]').innerText().catch(() => '');
    check('buyer: the reply shows in the panel', replies.includes('Ben Fictional'), replies.replace(/\s+/g, ' ').slice(0, 120));
    check('buyer: panel has no overflow at the end', (await overflow(page)) <= 0);
    check('buyer: no console or page errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  }
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify({ base: 'next start (production build), local adapter, seeded demo', viewport: '390x844 (isMobile, touch, DPR 2)', theme: THEME, checks }, null, 2) + '\n',
);
rmSync(dataDir, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed; screenshots in ${path.relative(process.cwd(), OUT) || OUT}/`);
