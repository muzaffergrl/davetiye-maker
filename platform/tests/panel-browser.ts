// Browser check of the edit panel (G039, adapted to the panel v2 views of G060): real `next start` + Chromium at 390 px (phone).
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
// Against the device width: on a phone (isMobile) wide content widens the layout viewport itself (innerWidth grows too).
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - screen.width);
const saveState = (page: any) => page.getAttribute('[data-save-state]', 'data-save-state');
async function waitSaved(page: any) {
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') !== 'saved', null, { timeout: 1500 }).catch(() => undefined);
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
}
/** v2: each section is its own page (#edit/<id>); "couple" is "names" since G060. */
async function openSection(page: any, id: string) {
  const v2 = id === 'couple' ? 'names' : id;
  await page.evaluate((h: string) => (window.location.hash = h), `#edit/${v2}`);
  await page.waitForSelector(`#section-${v2}-body`);
}
async function openView(page: any, view: string) {
  await page.evaluate((h: string) => (window.location.hash = h), `#${view}`);
  await page.waitForTimeout(150);
}
/** Publish; the "Before you publish" notes sheet (sample text, empty photo places, …) is answered with "Publish anyway". */
async function publishNow(page: any): Promise<string> {
  await page.click('[data-publish]');
  await page.waitForSelector('[data-testid="live"], [data-testid="notes"]', { timeout: 15_000 });
  let notes = '';
  if (await page.locator('[data-testid="notes"]').count()) {
    notes = await page.locator('[data-testid="notes"]').innerText();
    // G060-fix: the first publish with the design's sample date waits for "… really is our wedding date".
    if (await page.locator('[data-testid="notes"] [data-confirm-sample-date]').count()) await page.click('[data-testid="notes"] [data-confirm-sample-date]');
    await page.click('[data-publish-anyway]');
  }
  await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
  return notes;
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

  // v2: a never-published site opens the setup wizard; this check works in the editor views (#home …).
  const res = await page.goto(`${EDIT_URL}#home`, { waitUntil: 'networkidle' });
  check('edit link opens the panel (200)', res.status() === 200);
  check('panel: response is not cached', /no-store/.test(res.headers()['cache-control'] ?? ''), res.headers()['cache-control']);
  check('panel: noindex + no-referrer', (await page.locator('meta[name="referrer"]').getAttribute('content')) === 'no-referrer');
  check('panel: header shows the names', (await page.locator('h1').innerText()) === 'Clara & Julian');
  check('panel: draft status card', /draft/i.test(await page.locator('[data-status-card]').innerText()));
  check('panel: no horizontal overflow at 390 px', (await overflow(page)) <= 0);
  const barBox = await page.locator('[data-publish]').boundingBox();
  check('panel: Publish button visible in the top bar', barBox && barBox.y >= 0 && barBox.y + barBox.height <= 70 && barBox.height >= 44, JSON.stringify(barBox));
  await shot(page, '01_panel_390');

  // Couple: change the names; names-as-shown and monogram follow.
  await openSection(page, 'couple');
  await page.fill('#f-partners-0-display_name', 'Elena');
  await page.fill('#f-partners-0-full_name', 'Elena Rossi');
  await page.fill('#f-partners-1-display_name', 'Marco');
  await page.fill('#f-partners-1-full_name', 'Marco Bianchi');
  await page.locator('#f-partners-1-full_name').blur();
  check('couple: names-as-shown follows the first names', (await page.inputValue('#f-name_display')) === 'Elena & Marco');
  check('couple: monogram follows', (await page.inputValue('#f-initials')) === 'E&M');
  // The fixed bar never hides the field that gets focus by keyboard (WCAG 2.4.11).
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.focus('#f-partners-0-display_name');
  await page.keyboard.press('Tab');
  const focusBox = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const b = el.getBoundingClientRect();
    const bar = document.querySelector('nav[aria-label="Editor"]')!.getBoundingClientRect(); // the fixed bottom navigation
    return { id: el.id, bottom: Math.round(b.bottom), barTop: Math.round(bar.top) };
  });
  check('focus: a field reached with Tab is not under the fixed bar', focusBox.id === 'f-partners-0-full_name' && focusBox.bottom <= focusBox.barTop, JSON.stringify(focusBox));
  await waitSaved(page);
  check('autosave: "All changes saved"', (await page.locator('[data-save-state]').innerText()).includes('All changes saved'));
  await openView(page, 'home');
  check('couple: Home heading updates', (await page.locator('h1').innerText()) === 'Elena & Marco');
  await openSection(page, 'couple');
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
  const menu = async (n: number, item: string) => {
    await page.getByRole('button', { name: `Options for event ${n}` }).click();
    await page.getByRole('menuitem', { name: item }).click();
  };
  await menu(before + 1, 'Move up');
  check('schedule: row moved up (menu "Move up")', (await page.inputValue(`#f-schedule-${before - 1}-label`)) === 'Sparkler send-off');
  check('schedule: time kept as 21:30', (await page.inputValue(`#f-schedule-${before - 1}-time`)) === '21:30');
  await waitSaved(page);
  await shot(page, '04_schedule_390');
  await menu(before, 'Move down');
  await page.waitForTimeout(50);
  check('schedule: focus follows the moved row', (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === `Options for event ${before + 1}`);
  await menu(before + 1, 'Move up');
  await menu(before, 'Remove');
  check('schedule: Remove at once, with Undo', (await rows()) === before && (await page.locator('[data-snackbar]').innerText()).includes('Undo'));
  await page.locator('[data-snackbar]').getByRole('button', { name: 'Undo' }).click();
  check('schedule: Undo brings the row back', (await rows()) === before + 1 && (await page.inputValue(`#f-schedule-${before - 1}-label`)) === 'Sparkler send-off');
  await menu(before, 'Remove');
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
  const thumbSrc = await page.getAttribute('[data-photo-slot="hero"] img', 'src');
  // G055: the draft stores "<random>-<width>w.jpg"; the panel thumbnail shows its 640 px variant.
  const stored = await (await fetch(`${BASE}/api/edit/${SLUG}`, { headers: { authorization: `Bearer ${seeded.editKey}` } })).json();
  const heroPath: string = stored.state?.content?.media?.hero_portrait ?? '';
  // Not published yet: the buyer's own views carry the preview key (the photo is not public).
  check('photo: uploaded and stored in the draft', /^\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}-\d+w\.jpg$/.test(heroPath), heroPath);
  const keyQuery = (thumbSrc ?? '').slice((thumbSrc ?? '').indexOf('?'));
  check('photo: the thumbnail is the small variant, with the preview key', /^\?preview=[A-Za-z0-9_.-]+$/.test(keyQuery) && thumbSrc === `${heroPath.replace(/-\d+w\.jpg$/, '-640w.jpg')}${keyQuery}`, thumbSrc ?? '');
  const heroSrc = `${heroPath}${keyQuery}`;
  check('photo: not public before publishing', (await fetch(`${BASE}${heroPath}`)).status === 404);
  const heroMeta = await sharp(Buffer.from(await (await fetch(`${BASE}${heroSrc}`)).arrayBuffer())).metadata();
  check('photo: server copy is a 4:5 JPEG without EXIF', heroMeta.format === 'jpeg' && Math.abs(heroMeta.width / heroMeta.height - 0.8) < 0.01 && !heroMeta.exif, `${heroMeta.width}x${heroMeta.height}`);
  check('photos: the page counts it', (await page.locator('[data-section="photos"]').innerText()).includes('1 of 5 photos'));
  await page.locator('[data-section="photos"]').scrollIntoViewIfNeeded();
  await shot(page, '06_photos_390');

  // Validation: a deadline after the wedding blocks publishing, with a clear message.
  await openSection(page, 'rsvp');
  await page.fill('#f-rsvp-deadline', '2027-06-01');
  await page.locator('#f-rsvp-deadline').blur();
  const inline = page.locator('#f-rsvp-deadline-issues');
  await inline.waitFor();
  check('validation: inline error under the field', (await inline.innerText()).includes('The RSVP deadline must be before the event date.'));
  await waitSaved(page);
  await openView(page, 'edit');
  check('validation: section badge "1 to fix"', (await page.locator('#section-rsvp').innerText()).includes('1 to fix'));
  await openSection(page, 'rsvp');
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
  await openView(page, 'home');
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
  check('preview: focus on Close (modal)', (await page.evaluate(() => document.activeElement?.hasAttribute('data-close-preview'))) === true);
  check('preview: form behind is inert', (await page.evaluate(() => (document.querySelector('[data-panel] main') as HTMLElement).inert)) === true);
  await shot(page, '08_preview_390', { photo: true });
  // Android back button / gesture closes the preview and stays in the editor.
  await page.goBack();
  await page.waitForTimeout(400);
  check('preview: Back closes it and stays in the editor', page.url() === `${EDIT_URL}#home` && !(await page.locator('[data-preview] iframe').isVisible()), page.url());
  check('preview: focus back on the Preview button', (await page.evaluate(() => document.activeElement?.hasAttribute('data-open-preview'))) === true);

  // Publish -> notes (empty photo places, link blocks without a link) -> "Publish anyway" -> live link + QR.
  const notes = await publishNow(page);
  check('publish: notes before publishing (empty photo places, sections without a link)', /Photo places without a photo/.test(notes) && /Sections without a link/.test(notes), notes.replace(/\s+/g, ' ').slice(0, 160));
  check('publish: "Your website is live"', (await page.locator('[data-testid="live"] h2').innerText()) === 'Your website is live');
  check('publish: public link shown', (await page.locator('[data-live-link]').getAttribute('href')) === PUBLIC_URL);
  const qr = page.locator('[data-testid="live"] svg[role="img"]');
  check('QR: generated from the public URL', (await qr.getAttribute('data-qr-text')) === PUBLIC_URL);
  check('QR: screenshot decodes to the public URL', (await decodeQrFrom(qr)) === PUBLIC_URL);
  await qr.scrollIntoViewIfNeeded();
  await shot(page, '09_live_qr_390');
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
  check('status card: live with link', (await page.locator('[data-public-link]').getAttribute('href')) === PUBLIC_URL);
  check('bar: a calm "Live" badge instead of Publish when up to date', (await page.locator('[data-live-badge]').count()) === 1 && (await page.locator('[data-publish]').count()) === 0);

  // Public page shows names and photo.
  const pub = await ctx.newPage();
  const pubRes = await pub.goto(PUBLIC_URL, { waitUntil: 'networkidle' });
  check('public page: 200', pubRes.status() === 200);
  check('public page: names', (await pub.locator('h1').innerText()) === 'Elena & Marco');
  const pubHero = await pub.evaluate(() => {
    const img = document.querySelector('img[data-photo="hero"]') as HTMLImageElement | null;
    return img ? { src: img.getAttribute('src'), w: img.naturalWidth, srcset: img.getAttribute('srcset'), current: img.currentSrc } : null;
  });
  check('public page: uploaded photo loads (public once published)', pubHero?.src === heroPath && pubHero.w > 0, JSON.stringify(pubHero));
  check('public page: srcset with the 640 px variant (G055), the browser loads one of the files', Boolean(pubHero?.srcset?.startsWith(`${heroPath.replace(/-\d+w\.jpg$/, '-640w.jpg')} 640w`)) && /-\d+w\.jpg$/.test(pubHero?.current ?? ''), pubHero?.current ?? '');
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
  await openView(page, 'guests');
  await page.click('[data-refresh-replies]');
  await page.waitForSelector('[data-reply]');
  const repliesText = (await page.locator('[data-replies]').innerText()).replace(/\s+/g, ' ');
  check('Guests: reply and counts listed', repliesText.includes('Ada Example') && /2 Guests coming/.test(repliesText) && /1 Replies/.test(repliesText), repliesText.slice(0, 160));
  await shot(page, '10b_replies_390');
  // A test or spam reply can be removed (asked once more); the counts follow.
  await page.getByRole('button', { name: 'Options for the reply from Ada Example' }).click();
  await page.getByRole('menuitem', { name: 'Remove reply' }).click();
  await page.click('[data-confirm-remove-reply]');
  await page.waitForFunction(() => !document.querySelector('[data-reply]'));
  check('Guests: a reply can be removed', (await page.locator('main').innerText()).includes('No replies yet.'));

  // Edit after publishing: guests keep the old text until "Publish changes". (The host line lives under Details since G060-fix.)
  await page.bringToFront();
  await openSection(page, 'details');
  await page.fill('#f-host_line', 'Together with our families');
  await page.locator('#f-host_line').blur();
  await waitSaved(page);
  // K29: one sticky bar says the live website is behind the draft; Review names what changed.
  const changesBar = (await page.locator('[data-changes-bar]').innerText()).replace(/\s+/g, ' ');
  check('bar (K29): "Unpublished changes: 1 · Review · Publish" after an edit', /Unpublished changes: 1\b/.test(changesBar) && changesBar.includes('Review') && (await page.locator('[data-changes-bar] [data-publish]').innerText()) === 'Publish', changesBar);
  await page.click('[data-changes-review]');
  await page.waitForSelector('[data-testid="review"]');
  const review = (await page.locator('[data-testid="review"]').innerText()).replace(/\s+/g, ' ');
  check('review (K29): lists the changed page (Details) and offers "Publish changes"', (await page.locator('[data-review-item]').allInnerTexts()).join('|') === 'Details' && review.includes('Publish changes'), review.slice(0, 200));
  await page.locator('[data-testid="review"]').getByRole('button', { name: 'Keep editing' }).last().click();
  await page.waitForSelector('[data-testid="review"]', { state: 'detached' });
  await pub.goto(`${PUBLIC_URL}/home`, { waitUntil: 'networkidle' });
  check('public page: unpublished edit not visible', (await pub.locator('.kicker').textContent()) === 'Together with their families');
  await publishNow(page);
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
  await pub.reload({ waitUntil: 'networkidle' });
  check('public page: change visible after "Publish changes"', (await pub.locator('.kicker').textContent()) === 'Together with our families');

  // Flaky phone network: a save is stored but its answer is lost -> the retry must not lock the panel ("another device").
  let lostOnce = true;
  await page.route(`**/api/edit/${SLUG}`, async (route: any) => {
    if (route.request().method() === 'PUT' && lostOnce) {
      lostOnce = false;
      await route.fetch(); // the server stores it...
      return route.abort('connectionreset'); // ...the phone never hears back
    }
    return route.continue();
  });
  await page.fill('#f-host_line', 'With joy, together with our families');
  await page.locator('#f-host_line').blur();
  await page.waitForFunction(() => ['saved', 'conflict'].includes(document.querySelector('[data-save-state]')?.getAttribute('data-save-state') ?? ''), null, { timeout: 30_000 });
  check('lost save answer: no false conflict, saved', (await saveState(page)) === 'saved' && !lostOnce, String(await saveState(page)));
  await page.unroute(`**/api/edit/${SLUG}`);
  // the browser logs the simulated reset and the 409 the panel then resolved; they are not page errors
  for (let i = problems.length - 1; i >= 0; i--) if (/ERR_CONNECTION_RESET|status of 409/.test(problems[i])) problems.splice(i, 1);

  // Typing while a slow publish is on its way: the edit is saved after it, no false conflict.
  await page.route(`**/api/edit/${SLUG}/publish`, async (route: any) => {
    const res = await route.fetch();
    await new Promise((r) => setTimeout(r, 2500));
    return route.fulfill({ response: res });
  });
  await page.click('[data-publish]');
  // K29: publishing changes goes straight out (no notes sheet): type while it is on its way ("Publishing…").
  await page.waitForSelector('[data-publish][aria-busy="true"], [data-testid="notes"]', { timeout: 15_000 });
  if (await page.locator('[data-testid="notes"]').count()) await page.click('[data-publish-anyway]');
  await page.waitForTimeout(300);
  check('slow publish: the bar\'s button says "Publishing…" meanwhile', (await page.locator('[data-publish]').innerText()).includes('Publishing'));
  await page.fill('#f-host_line', 'Typed during the publish');
  await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
  await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
  await waitSaved(page);
  const afterRace = (await adapter.getSiteById(seeded.site.id))!;
  check('typing during a slow publish: saved after it, no false conflict', (await saveState(page)) === 'saved' && afterRace.content.host_line === 'Typed during the publish', `${await saveState(page)} / ${afterRace.content.host_line}`);
  await page.unroute(`**/api/edit/${SLUG}/publish`);

  // Take offline, then publish again.
  await openView(page, 'share');
  await page.getByRole('button', { name: 'Take the website offline' }).click();
  await page.click('[data-confirm-offline]');
  await page.waitForFunction(() => document.querySelector('[data-panel]')?.getAttribute('data-status') === 'draft');
  check('offline: public page is 404', (await fetch(PUBLIC_URL)).status === 404);
  check('offline: the photo is not public any more', (await fetch(`${BASE}${heroPath}`)).status === 404);
  await shot(page, '11_offline_390');
  await publishNow(page);
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
  await dp.goto(`${EDIT_URL}#home`, { waitUntil: 'networkidle' });
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
