// Browser check of the edit panel (G039): real `next start` + Chromium at 390 px (phone).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/panel-browser.ts
//
// Flow: bad links -> open the edit link -> change names -> schedule rows -> upload + crop a photo ->
// validation blocks publishing -> preview shows the photo -> publish -> QR decodes to the public URL ->
// public page shows names + photo -> publish changes -> take offline -> publish again.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); seeds into temporary
// folders (platform/.data is not touched). Writes screenshots, a short MP4 (ffmpeg) and checks.json to
// previews/g039/ (or $PANEL_SHOTS_DIR). Exit code 1 when a check fails.

import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys } from '../lib/sites.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const PORT = Number(process.env.PORT || 3313);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.PANEL_SHOTS_DIR || path.join(ROOT, 'previews/g039');
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

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'panel-browser-data-'));
const themesDir = mkdtempSync(path.join(os.tmpdir(), 'panel-browser-themes-'));
const videoDir = mkdtempSync(path.join(os.tmpdir(), 'panel-browser-video-'));
mkdirSync(OUT, { recursive: true });
cpSync(path.join(ROOT, 'themes/_sample'), path.join(themesDir, '_sample'), { recursive: true });
process.env.PLATFORM_THEMES_DIR = themesDir;

const content = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const adapter = new LocalAdapter(dataDir);
const SLUG = 'clara-and-julian';
const seeded = await createSiteWithKeys(adapter, { slug: SLUG, theme: '_sample', content });
const PUBLIC_URL = `${BASE}/${SLUG}`;
const EDIT_URL = `${BASE}/edit/${SLUG}?k=${seeded.editKey}`;

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

/** PNG for UI screens; JPEG (q 82) for screens dominated by a photo, to keep previews/ small. */
const shot = async (page: any, name: string, opts: { fullPage?: boolean; photo?: boolean } = {}) => {
  await page.waitForTimeout(250);
  const file = path.join(OUT, `${name}.${opts.photo ? 'jpg' : 'png'}`);
  await page.screenshot({ path: file, fullPage: Boolean(opts.fullPage), ...(opts.photo ? { type: 'jpeg', quality: 82 } : {}) });
};
const overflow = (page: any) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const saveState = (page: any) => page.getAttribute('[data-save-state]', 'data-save-state');
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
let videoPath: string | null = null;
try {
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch({ slowMo: Number(process.env.PANEL_SLOWMO ?? 60) });
  const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

  // 1. Links that must not open the panel all look the same (and never tell whether the slug exists).
  {
    const ctx = await browser.newContext(device);
    const page = await ctx.newPage();
    const texts: string[] = [];
    for (const url of [
      `${BASE}/edit/${SLUG}?k=wrong-key-1234567890abcdef`,
      `${BASE}/edit/${SLUG}`,
      `${BASE}/edit/${SLUG}?k=${seeded.previewKey}`,
      `${BASE}/edit/nobody-here?k=${seeded.editKey}`,
    ]) {
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      texts.push(await page.locator('main').innerText());
      check(`bad edit link -> 404 (${url.replace(BASE, '').replace(/k=[^&]+/, 'k=…')})`, res.status() === 404, String(res.status()));
    }
    check('bad edit links: identical generic message', texts.every((t) => t === texts[0]) && /This edit link is not valid/.test(texts[0]));
    check('bad edit link page: noindex + no-referrer meta', (await page.locator('meta[name="robots"]').first().getAttribute('content'))?.includes('noindex') && (await page.locator('meta[name="referrer"]').getAttribute('content')) === 'no-referrer');
    await shot(page, '00_bad_link_390');
    await ctx.close();
  }

  // 2. The real flow, recorded.
  const ctx = await browser.newContext({ ...device, recordVideo: { dir: videoDir, size: { width: 390, height: 844 } } });
  const page = await ctx.newPage();
  const problems: string[] = [];
  page.on('console', (m: { type(): string; text(): string }) => m.type() === 'error' && problems.push(m.text()));
  page.on('pageerror', (e: unknown) => problems.push(String(e)));

  const res = await page.goto(EDIT_URL, { waitUntil: 'networkidle' });
  check('edit link opens the panel (200)', res.status() === 200);
  check('panel: response is not cached', /no-store/.test(res.headers()['cache-control'] ?? ''), res.headers()['cache-control']);
  check('panel: noindex + no-referrer', (await page.locator('meta[name="referrer"]').getAttribute('content')) === 'no-referrer');
  check('panel: header shows the names', (await page.locator('h1').innerText()) === 'Clara & Julian');
  check('panel: draft status card', /draft/i.test(await page.locator('[data-status-card]').innerText()));
  check('panel: no horizontal overflow at 390 px', (await overflow(page)) <= 0);
  const barBox = await page.locator('[data-publish]').boundingBox();
  check('panel: sticky Publish button visible at the bottom', barBox && barBox.y + barBox.height <= 844 && barBox.height >= 44, JSON.stringify(barBox));
  await shot(page, '01_panel_390');

  // Couple: change the names; names-as-shown and monogram follow.
  await page.fill('#f-partners-0-display_name', 'Elena');
  await page.fill('#f-partners-0-full_name', 'Elena Rossi');
  await page.fill('#f-partners-1-display_name', 'Marco');
  await page.fill('#f-partners-1-full_name', 'Marco Bianchi');
  await page.locator('#f-partners-1-full_name').blur();
  check('couple: names-as-shown follows the first names', (await page.inputValue('#f-name_display')) === 'Elena & Marco');
  check('couple: monogram follows', (await page.inputValue('#f-initials')) === 'E&M');
  check('couple: header updates', (await page.locator('h1').innerText()) === 'Elena & Marco');
  await waitSaved(page);
  check('autosave: "All changes saved"', (await page.locator('[data-save-state]').innerText()).includes('All changes saved'));
  await shot(page, '02_couple_390');

  // Date & time: dates are shown as "Saturday, May 15, 2027" and "4:00 PM".
  await openSection(page, 'date');
  const dateBody = await page.locator('#section-date-body').innerText();
  check('date: shown as "Saturday, May 15, 2027" and "4:00 PM"', dateBody.includes('Saturday, May 15, 2027') && dateBody.includes('4:00 PM'));
  check('date: time zone list filled', (await page.locator('#f-timezone option').count()) > 100);
  await shot(page, '03_date_390');

  // Schedule: add a row, fill it, move it up, remove it.
  await openSection(page, 'schedule');
  const rows = () => page.locator('[data-schedule-row]').count();
  const before = await rows();
  await page.getByRole('button', { name: 'Add an event' }).click();
  check('schedule: row added', (await rows()) === before + 1);
  await page.fill(`#f-schedule-${before}-time`, '21:30');
  await page.fill(`#f-schedule-${before}-label`, 'Sparkler send-off');
  await page.getByRole('button', { name: `Move event ${before + 1} up` }).click();
  check('schedule: row moved up', (await page.inputValue(`#f-schedule-${before - 1}-label`)) === 'Sparkler send-off');
  check('schedule: shown as 9:30 PM', (await page.locator(`[data-schedule-row="${before - 1}"]`).innerText()).includes('9:30 PM'));
  await waitSaved(page);
  await shot(page, '04_schedule_390');
  await page.getByRole('button', { name: `Remove event ${before}` }).click();
  check('schedule: row removed', (await rows()) === before);
  await waitSaved(page);

  // Photos: upload + crop the hero photo.
  await openSection(page, 'photos');
  await page.setInputFiles('input[data-slot="hero"]', PHOTO);
  await page.waitForSelector('[data-testid="cropper"] img');
  const frame = await page.locator('[data-testid="cropper"] [role="group"]').boundingBox();
  check('crop: frame has the slot ratio 4:5', frame && Math.abs(frame.width / frame.height - 0.8) < 0.02, frame ? (frame.width / frame.height).toFixed(3) : '');
  await page.mouse.move(frame.x + frame.width / 2, frame.y + frame.height / 2);
  await page.mouse.down();
  await page.mouse.move(frame.x + frame.width / 2, frame.y + frame.height / 2 - 60, { steps: 8 });
  await page.mouse.up();
  await page.fill('#crop-zoom', '1.15');
  await shot(page, '05_crop_390', { photo: true });
  await page.click('[data-crop-confirm]');
  await page.waitForSelector('[data-photo-slot="hero"] img', { timeout: 20_000 });
  await waitSaved(page);
  const heroSrc = await page.getAttribute('[data-photo-slot="hero"] img', 'src');
  check('photo: uploaded and stored in the draft', /^\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}\.jpg$/.test(heroSrc ?? ''), heroSrc ?? '');
  const heroMeta = await sharp(Buffer.from(await (await fetch(`${BASE}${heroSrc}`)).arrayBuffer())).metadata();
  check('photo: server copy is a 4:5 JPEG without EXIF', heroMeta.format === 'jpeg' && Math.abs(heroMeta.width / heroMeta.height - 0.8) < 0.01 && !heroMeta.exif, `${heroMeta.width}x${heroMeta.height}`);
  check('photos: section summary counts it', (await page.locator('#section-photos').innerText()).includes('1 of 5 added'));
  await page.locator('[data-section="photos"]').scrollIntoViewIfNeeded();
  await shot(page, '06_photos_390');

  // Validation: a deadline after the wedding blocks publishing, with a clear message.
  await openSection(page, 'rsvp');
  await page.fill('#f-rsvp-deadline', '2027-06-01');
  await page.locator('#f-rsvp-deadline').blur();
  const inline = page.locator('#f-rsvp-deadline-issues');
  await inline.waitFor();
  check('validation: inline error under the field', (await inline.innerText()).includes('The RSVP deadline must be before the event date.'));
  check('validation: section badge "1 to fix"', (await page.locator('#section-rsvp').innerText()).includes('1 to fix'));
  await waitSaved(page);
  await page.click('[data-publish]');
  await page.waitForSelector('[data-testid="issues"]');
  check('publish blocked: list of issues', (await page.locator('[data-testid="issues"]').innerText()).includes('The RSVP deadline must be before the event date.'));
  await shot(page, '07_publish_blocked_390');
  await page.locator('[data-testid="issues"] button', { hasText: 'RSVP deadline' }).click();
  await page.waitForTimeout(300);
  check('issue link focuses the field', (await page.evaluate(() => document.activeElement?.id)) === 'f-rsvp-deadline');
  await page.fill('#f-rsvp-deadline', '2027-04-03');
  await page.locator('#f-rsvp-deadline').blur();
  check('validation: error gone once fixed', !(await page.locator('#f-rsvp-deadline-issues').count()));
  check('RSVP deadline shown as a word date', (await page.locator('#section-rsvp-body').innerText()).includes('Saturday, April 3, 2027'));
  await waitSaved(page);

  // Preview shows the draft with the photo.
  await page.click('[data-open-preview]');
  const previewFrame = page.frameLocator('[data-preview] iframe');
  await previewFrame.locator('h1').waitFor();
  const pv = page.locator('[data-preview] iframe');
  const pvBox = await pv.boundingBox();
  check('preview: 390 px wide', pvBox && Math.round(pvBox.width) === 390, pvBox ? String(pvBox.width) : '');
  check('preview: shows the new names', (await previewFrame.locator('h1').innerText()) === 'Elena & Marco');
  const pvHero = previewFrame.locator('img[data-photo="hero"]');
  await page.waitForFunction(
    () => {
      const img = (document.querySelector('[data-preview] iframe') as HTMLIFrameElement | null)?.contentDocument?.querySelector('img[data-photo="hero"]') as HTMLImageElement | null;
      return Boolean(img && img.complete && img.naturalWidth > 0 && img.getAttribute('src')?.startsWith('/media/'));
    },
    null,
    { timeout: 10_000 },
  );
  check('preview: shows the uploaded photo', (await pvHero.getAttribute('src')) === heroSrc);
  await shot(page, '08_preview_390', { photo: true });
  await page.getByRole('button', { name: 'Close' }).click();

  // Publish -> live link + QR from the real URL.
  await page.click('[data-publish]');
  await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
  check('publish: "Your website is live"', (await page.locator('[data-testid="live"] h2').innerText()) === 'Your website is live');
  check('publish: public link shown', (await page.locator('[data-live-link]').innerText()) === PUBLIC_URL);
  const qr = page.locator('[data-testid="live"] svg[role="img"]');
  check('QR: generated from the public URL', (await qr.getAttribute('data-qr-text')) === PUBLIC_URL);
  check('QR: screenshot decodes to the public URL', (await decodeQrFrom(qr)) === PUBLIC_URL);
  await qr.scrollIntoViewIfNeeded();
  await shot(page, '09_live_qr_390');
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
  check('status card: live with link', (await page.locator('[data-public-link]').innerText()) === PUBLIC_URL);
  check('bar: button says "Share" when up to date', (await page.locator('[data-publish]').innerText()) === 'Share');

  // Public page shows names and photo.
  const pub = await ctx.newPage();
  const pubRes = await pub.goto(PUBLIC_URL, { waitUntil: 'networkidle' });
  check('public page: 200', pubRes.status() === 200);
  check('public page: names', (await pub.locator('h1').innerText()) === 'Elena & Marco');
  const pubHero = await pub.evaluate(() => {
    const img = document.querySelector('img[data-photo="hero"]') as HTMLImageElement | null;
    return img ? { src: img.getAttribute('src'), w: img.naturalWidth } : null;
  });
  check('public page: uploaded photo loads', pubHero?.src === heroSrc && pubHero.w > 0, JSON.stringify(pubHero));
  check('public page: no horizontal overflow', (await overflow(pub)) <= 0);
  await shot(pub, '10_public_390', { fullPage: true, photo: true });

  // A guest reply (public RSVP API) shows up in the panel's RSVP section.
  const reply = await fetch(`${BASE}/api/rsvp/${SLUG}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.7' },
    body: JSON.stringify({ name: 'Ada Example', attending: 'yes', guests: 2, message: 'See you there!' }),
  });
  check('guest reply accepted by the RSVP API', reply.status === 200, String(reply.status));
  await page.bringToFront();
  await openSection(page, 'rsvp');
  await page.click('[data-refresh-replies]');
  await page.waitForSelector('[data-replies] li');
  const repliesText = await page.locator('[data-replies]').innerText();
  check('RSVP section: reply and counts listed', repliesText.includes('Ada Example') && repliesText.includes('1 reply · 1 attending (2 guests)'), repliesText.replace(/\s+/g, ' ').slice(0, 120));
  await page.locator('[data-replies] li').first().scrollIntoViewIfNeeded();
  await shot(page, '10b_replies_390');

  // Edit after publishing: guests keep the old text until "Publish changes".
  await page.bringToFront();
  await openSection(page, 'couple');
  await page.fill('#f-host_line', 'Together with our families');
  await page.locator('#f-host_line').blur();
  await waitSaved(page);
  check('bar: "Publish changes" after an edit', (await page.locator('[data-publish]').innerText()) === 'Publish changes');
  await pub.goto(`${PUBLIC_URL}/home`, { waitUntil: 'networkidle' });
  check('public page: unpublished edit not visible', (await pub.locator('.kicker').textContent()) === 'Together with their families');
  await page.click('[data-publish]');
  await page.waitForSelector('[data-testid="live"]');
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
  await pub.reload({ waitUntil: 'networkidle' });
  check('public page: change visible after "Publish changes"', (await pub.locator('.kicker').textContent()) === 'Together with our families');

  // Take offline, then publish again.
  await page.locator('[data-status-card]').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Take the website offline' }).click();
  await page.click('[data-confirm-offline]');
  await page.waitForFunction(() => document.querySelector('[data-panel]')?.getAttribute('data-status') === 'draft');
  check('offline: public page is 404', (await fetch(PUBLIC_URL)).status === 404);
  await shot(page, '11_offline_390');
  await page.click('[data-publish]');
  await page.waitForSelector('[data-testid="live"]');
  check('published again: public page is 200', (await fetch(PUBLIC_URL)).status === 200);
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();

  check('panel: no horizontal overflow at the end', (await overflow(page)) <= 0);
  check('panel: no console or page errors', problems.length === 0, problems.join(' | '));
  check('stored draft is valid and published', (await adapter.getSiteById(seeded.site.id))?.status === 'published');

  await pub.close();
  // End the recording on the public site (everything is saved, so leaving the panel does not prompt).
  await page.goto(PUBLIC_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1200);
  const video = page.video();
  await ctx.close();
  videoPath = video ? await video.path() : null;

  // Wide screens: form and a 390 px preview side by side (no Preview button needed).
  const desk = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const dp = await desk.newPage();
  await dp.goto(EDIT_URL, { waitUntil: 'networkidle' });
  await dp.frameLocator('[data-preview] iframe').locator('h1').waitFor();
  const dBox = await dp.locator('[data-preview] iframe').boundingBox();
  check('desktop: preview shown next to the form, 390 px wide', dBox && Math.round(dBox.width) === 390 && dBox.x > 600, JSON.stringify(dBox));
  check('desktop: no Preview button', (await dp.locator('[data-open-preview]').count()) === 0);
  await shot(dp, '12_desktop_1280', { photo: true });
  await desk.close();
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

// Video: Playwright records WebM; convert to a small H.264 MP4 for previews/.
if (videoPath && existsSync(videoPath)) {
  const mp4 = path.join(OUT, 'panel_flow_390.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', videoPath, '-vf', 'scale=390:844,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-movflags', '+faststart', '-an', mp4]);
  check('video: MP4 written', r.status === 0 && existsSync(mp4), r.status === 0 ? path.relative(ROOT, mp4) : String(r.stderr));
} else {
  check('video: recorded', false, 'no video file');
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify({ base: 'next start (production build)', viewport: '390x844 (isMobile, touch)', theme: '_sample', checks }, null, 2) + '\n',
);
for (const dir of [dataDir, themesDir, videoDir]) rmSync(dir, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed; screenshots and video in ${path.relative(process.cwd(), OUT) || OUT}/ (${readdirSync(OUT).length} files)`);
