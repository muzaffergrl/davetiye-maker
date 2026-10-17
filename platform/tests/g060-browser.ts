// Browser journey of the panel v2 (G060, docs/16 §14 C–F): real `next start` + Chromium at 390 × 844 (phone, touch).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g060-browser.ts
//
// 1. Recorded journey (MP4): first-run setup 1→6 (names, date, venue, photo with crop, preview, rules) → publish →
//    "Your website is live" (QR decoded) → editor → Names locked → change (typo free, then 1 change) → rights left
//    on Home → publish changes.
// 2. Checks without video: resume step (reload / other device), Back keeps values, phone back = previous step, first
//    publish from the editor shows the rules, rights 0, Undo, Guests, Share, offline + local copy, conflict, 401,
//    archive, 1280 / 960 layouts, 320 px, axe-core (serious/critical = 0), touch targets ≥ 44 px, reduced motion.
// Writes screenshots, g060_journey_390.mp4 and checks.json to previews/g060/ (or $G060_SHOTS_DIR). Exit 1 on a failed check.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data lives in temporary folders.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite, reissueKeys, setArchiveOverride } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const sharp: any = require('sharp');
const jsQR: any = require('jsqr');
const AXE = require.resolve('axe-core/axe.min.js');

const PORT = Number(process.env.PORT || 3341);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G060_SHOTS_DIR || path.join(ROOT, 'previews/g060');
const PHOTO = path.join(REPO, 'collections/03_Blush_Garden_Rose/assets/gpt/photos/hero_portrait.jpg'); // fictional GPT sample photo
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g060-browser-data-'));
const videoDir = mkdtempSync(path.join(os.tmpdir(), 'g060-browser-video-'));
mkdirSync(OUT, { recursive: true });
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const adapter = new LocalAdapter(dataDir);
const THEME = 'blush-garden-rose';

// The buyer's site as /start creates it (the design's demo record with the buyer's names).
const journey = await createSiteWithKeys(adapter, { slug: 'elena-and-marco', theme: THEME, content: draftFromDemo(demo, ['Elena', 'Marco']), orderRef: '3456789012' });
// More sites for the checks that do not belong in the video.
const other = await createSiteWithKeys(adapter, { slug: 'nora-and-sam', theme: THEME, content: draftFromDemo(demo, ['Nora', 'Sam']) });
const live = await createSiteWithKeys(adapter, { slug: 'clara-and-julian', theme: THEME, content: demo });
await publishSite(adapter, live.site.id);
const archivedSite = await createSiteWithKeys(adapter, { slug: 'old-wedding', theme: THEME, content: draftFromDemo(demo, ['Ava', 'Leo']) });
await publishSite(adapter, archivedSite.site.id);
await setArchiveOverride(adapter, archivedSite.site.id, '2026-01-01', 'browser check: archive');
for (const [name, attending, guests] of [
  ['Ada Lovelace', true, 2],
  ['Grace Hopper', true, 1],
  ['Alan Turing', false, 1],
  ['Katherine Johnson', true, 3],
  ['Mary Jackson', true, 2],
  ['Dorothy Vaughan', false, 1],
  ['Hedy Lamarr', true, 2],
  ['Margaret Hamilton', true, 1],
] as const) {
  await adapter.saveRsvp(live.site.id, { name, attending, guests, email: `${name.split(' ')[0].toLowerCase()}@example.com`, message: attending ? 'We can’t wait!' : 'So sorry to miss it.' });
}
const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;
const J = editUrl('elena-and-marco', journey.editKey);
const PUBLIC = `${BASE}/elena-and-marco`;

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

// A couple in the design's own time zone (New York) by default; the recorded journey is a UK couple (London, en-GB).
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'America/New_York', locale: 'en-US' };
const UK_PHONE = { ...PHONE, timezoneId: 'Europe/London', locale: 'en-GB' };
/** PNG for UI screens; JPEG (q 82) for screens dominated by the design's preview or a photo (keeps previews/ small). */
const shot = async (page: any, name: string, opts: { full?: boolean; jpeg?: boolean } = {}) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, `${name}.${opts.jpeg ? 'jpg' : 'png'}`), fullPage: Boolean(opts.full), ...(opts.jpeg ? { type: 'jpeg', quality: 82 } : {}) });
};
const saveState = (page: any) => page.getAttribute('[data-save-state]', 'data-save-state');
async function waitSaved(page: any) {
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') !== 'saved', null, { timeout: 1500 }).catch(() => undefined);
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
}
const h1 = (page: any) => page.locator('h1').first().innerText();
const focusedIsH1 = (page: any) => page.evaluate(() => document.activeElement?.tagName === 'H1');
async function decodeQr(locator: any): Promise<string | null> {
  const png = await locator.screenshot();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
}
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - screen.width);
/** Controls of the fixed bars (header / footer) that stick out of the screen: a fixed bar never widens the page, so `overflow` misses them (G060-fix). */
const outOfScreen = (page: any, selector: string) =>
  page.evaluate((sel: string) => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(`${sel} button, ${sel} a[href], ${sel} [data-save-state]`)) {
      const r = el.getBoundingClientRect();
      if (!r.width || getComputedStyle(el).visibility === 'hidden') continue;
      if (r.left < -0.5 || r.right > window.innerWidth + 0.5) out.push(`${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24)} ${Math.round(r.left)}–${Math.round(r.right)} / ${window.innerWidth}`);
    }
    return out;
  }, selector);

/** axe-core: serious + critical violations of the current view (docs/16 §14 #34). */
const axeResults: Record<string, string[]> = {};
async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  axeResults[view] = res;
  check(`a11y (axe-core 4.13.0): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}

/** Visible interactive elements smaller than 44 × 44 px (inline links inside running text excepted, WCAG 2.5.8). */
async function smallTargets(page: any): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const els = document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea, [role="switch"], label[for]');
    for (const el of els) {
      if (el.closest('p') && (el.tagName === 'A' || el.tagName === 'BUTTON') && el.closest('p') !== el) continue; // inline in text
      if (el.matches('input[type=file], input[type=radio]')) continue; // visually hidden, the label is the target
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (el.closest('[inert]')) continue;
      // A switch's 32 px track has a 44 px hit area (::before); a label of a 48 px input is fine as text.
      if (el.matches('[role="switch"]')) continue;
      if (el.tagName === 'LABEL' && !el.className.includes('btn')) continue;
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  });
}

const server = startNext({ port: PORT, dataDir });
let browser: any;
let videoPath: string | null = null;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  // =========================================================================== 1. recorded journey
  await block('journey', async () => {
    const ctx = await browser.newContext({ ...UK_PHONE, recordVideo: { dir: videoDir, size: { width: 390, height: 844 } } });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
    const page = await ctx.newPage();
    const pause = (ms = 700) => page.waitForTimeout(ms);
    await page.goto(`${J}#setup/1`);
    await page.waitForSelector('[data-setup="1"]');
    check('setup 1: opens at "#setup/1" with the names from /start', (await h1(page)).includes('Your names') && (await page.inputValue('#f-partners-0-display_name')) === 'Elena' && (await page.inputValue('#f-partners-1-display_name')) === 'Marco');
    // G100: the rule in one line ("After publishing you can change names or the date 3 times.") + "Learn more".
    check('setup 1: rights rule shown before publishing (one line + "Learn more")', (await page.locator('main').innerText()).includes('After publishing you can change names or the date 3 times.') && (await page.locator('[data-rights-note] [data-rights-more]').count()) === 1);
    check('setup 1: no character counters on short names (G060-fix)', !(await page.locator('main').innerText()).includes('/40'));
    check('setup: no bottom navigation in the wizard', (await page.locator('nav[aria-label="Editor"]').count()) === 0);
    check('setup: no horizontal scroll at 390 px', (await overflow(page)) <= 0, String(await overflow(page)));
    await shot(page, '01_setup1_names');
    await axe(page, 'setup 1');
    await pause();
    // K29: names and date are one step; the full names fold away (optional) and open on a tap.
    const fullNames = page.locator('[data-disclosure="full-names"] button[aria-expanded]');
    check('setup 1 (K29): full names folded, optional', (await fullNames.getAttribute('aria-expanded')) === 'false' && (await page.locator('#f-partners-0-full_name').isHidden()));
    await fullNames.click();
    await page.locator('#f-partners-0-full_name').fill('Elena Rossi');
    await page.locator('#f-partners-1-full_name').fill('Marco Bianchi');
    await waitSaved(page);
    await pause(400);
    const s1 = await page.locator('main').innerText();
    // G100: one sample-text line instead of a "Sample" tag per field; no "How your names appear" in the first step.
    check('setup 1 (K29, G100): the date is on the same step, no banners above it, the rule shown once, one sample line and no tags', !s1.includes('These are still the sample details') && s1.split('change names or the date 3 times').length === 2 && (await page.locator('[data-sample-line]').count()) === 1 && (await page.locator('[data-sample-tag]').count()) === 0 && (await page.locator('#f-name_display').count()) === 0, s1.slice(0, 200));
    check('setup 1 (K29): no venue in the setup (later, under Edit → Day & place)', (await page.locator('#f-venue-name').count()) === 0);
    await page.waitForSelector('[data-zone-from-phone]');
    check('setup 1: the time zone follows the phone ("We\u2019ll use London time, from your phone")', (await page.locator('[data-zone-from-phone]').innerText()).includes('London'));
    check('setup 1: date style from the phone (en-GB), no country list in the setup', (await page.locator('#f-locale').count()) === 0);
    await page.fill('#f-date', '2027-09-18');
    await page.fill('#f-ceremony_time', '16:30');
    await waitSaved(page);
    check('setup 1: date written out (day first, from the phone)', (await page.locator('main').innerText()).includes('Saturday, 18 September 2027'));
    await shot(page, '02_setup1_date');
    await pause();
    await page.click('[data-setup-next]');
    await page.waitForSelector('[data-setup="2"]');
    check('setup 2: "Add your photo", focus on the heading', (await h1(page)).includes('Add your photo') && (await focusedIsH1(page)));
    // Back keeps the values; the phone's back gesture goes to the previous step too.
    await page.click('[data-setup-back]');
    await page.waitForSelector('[data-setup="1"]');
    check('setup: Back keeps what was typed', (await page.inputValue('#f-date')) === '2027-09-18' && (await page.inputValue('#f-ceremony_time')) === '16:30' && (await page.inputValue('#f-partners-0-full_name')) === 'Elena Rossi');
    await page.click('[data-setup-next]');
    await page.waitForSelector('[data-setup="2"]');
    await page.goBack();
    await page.waitForSelector('[data-setup="1"]');
    check('setup: phone back = previous step', true);
    await page.goForward();
    await page.waitForSelector('[data-setup="2"]');
    check('setup 2: photo counter "0 of 5 photos"', (await page.locator('[data-photo-count]').innerText()).includes('0 of 5 photos'));
    // G121 (docs/18 §1 P2): only the portrait; the 4 other places are named and left to Edit → Photos (no "More photos" fold).
    check('setup 2 (K29, G121): one photo asked for (the portrait); the 4 others under Edit → Photos, no "More photos" in the setup', (await page.locator('[data-setup="2"] [data-photo-slot]').count()) === 1 && (await page.locator('[data-disclosure="more-photos"]').count()) === 0 && (await page.locator('[data-more-photos-later]').innerText()).includes('4 more photo places'));
    await shot(page, '04_setup2_photos');
    await page.setInputFiles('input[data-slot="hero_portrait"]', PHOTO);
    await page.waitForSelector('[data-testid="cropper"] img');
    const frame = await page.locator('[data-testid="cropper"] [role="group"]').boundingBox();
    await page.mouse.move(frame.x + frame.width / 2, frame.y + frame.height / 2);
    await page.mouse.down();
    await page.mouse.move(frame.x + frame.width / 2, frame.y + frame.height / 2 - 40, { steps: 8 });
    await page.mouse.up();
    await shot(page, '05_setup4_crop', { jpeg: true });
    await page.click('[data-crop-confirm]');
    await page.waitForSelector('[data-photo-slot="hero_portrait"] img', { timeout: 30_000 });
    await waitSaved(page);
    check('setup 2: upload + crop, counter "1 of 5 photos"', (await page.locator('[data-photo-count]').innerText()).includes('1 of 5 photos'));
    await pause();
    await page.click('[data-setup-next]');
    await page.waitForSelector('[data-setup="3"]');
    await page.frameLocator('[data-setup="3"] iframe').locator('body').waitFor();
    await page.waitForTimeout(1500);
    // K29: the last step checks once (the real preview) and publishes — no list or count of sample text, one calm line.
    const s3 = (await page.locator('[data-setup="3"] main').innerText()).replace(/\s+/g, ' ');
    const calm = await page.locator('[data-calm-note]').innerText();
    check('setup 3 (K29): preview + one calm line instead of a sample-text list or count', (await page.locator('[data-setup="3"] iframe').count()) === 1 && (await page.locator('[data-sample-list], [data-sample-line]').count()) === 0 && !/\d+ things?\b|Still sample text from the design \(/.test(s3) && calm.includes('any time, before or after you publish'), calm);
    check('setup 3: the step bar says "Step 3 of 3" and Publish is the main action (no Skip)', (await page.locator('[data-setup="3"] header').innerText()).includes('Step 3 of 3') && (await page.locator('[data-setup-skip]').count()) === 0 && (await page.locator('[data-setup-publish]').count()) === 1);
    check('setup 3: no horizontal scroll', (await overflow(page)) <= 0, String(await overflow(page)));
    await shot(page, '06_setup3_check', { jpeg: true });
    await pause();
    const rules = await page.locator('[data-rules]').innerText();
    check('setup 3: rules box in plain words (3 in total, free fixes incl. a week for the date, undo, online until, closes for guests)', rules.includes('3 changes in total') && rules.includes('moving your date by up to 7 days') && rules.includes('Undo it right away') && rules.includes('18 September 2028') && rules.includes('closes for guests'), rules.replace(/\s+/g, ' '));
    const summary = await page.locator('[data-publish-summary]').innerText();
    check('setup 3: summary shows names, the invitation-card names, date and address', summary.includes('Elena & Marco') && summary.includes('On the invitation card: Elena Rossi & Marco Bianchi'), summary);
    check('setup 3: no sample-date gate once the real date is set', (await page.locator('[data-sample-date-gate]').count()) === 0 && !(await page.locator('[data-setup-publish]').isDisabled()));
    await shot(page, '08_setup3_publish');
    await axe(page, 'setup 3');
    await pause(900);
    await page.click('[data-setup-publish]');
    await page.waitForSelector('[data-setup-done]', { timeout: 20_000 });
    check('publish: "Your website is live"', (await h1(page)).includes('Your website is live'));
    // G100: the QR code folds under "More ways to share" (the link and Share / Copy / Open come first).
    check('publish (G100): the QR code is folded under "More ways to share"', (await page.getAttribute('[data-setup-done] [data-disclosure="more-ways"] button[aria-expanded]', 'aria-expanded')) === 'false');
    await page.click('[data-setup-done] [data-disclosure="more-ways"] button[aria-expanded]');
    const qrText = await page.locator('[data-setup-done] svg[role="img"]').getAttribute('data-qr-text');
    const decoded = await decodeQr(page.locator('[data-setup-done] svg[role="img"]'));
    check('publish: QR made from the public URL and decodes to it', qrText === PUBLIC && decoded === PUBLIC, `${qrText} / ${decoded}`);
    check('publish: the address is a link, with an "Open website" button', (await page.getAttribute('[data-setup-done] [data-live-link]', 'href')) === PUBLIC && (await page.getAttribute('[data-setup-done] [data-open-site]', 'href')) === PUBLIC);
    await page.click('[data-copy-link]');
    await page.waitForFunction(() => document.querySelector('[data-copy-status]')?.textContent === 'Link copied', null, { timeout: 3000 });
    const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
    check('publish: "Copy link" -> button says "Copied", status "Link copied" (announced), clipboard holds the URL', (await page.locator('[data-copy-link]').innerText()).includes('Copied') && (await page.getAttribute('[data-copy-status]', 'role')) === 'status' && clip === PUBLIC, String(clip));
    check('publish: no snackbar over "Go to my editor" (there is no bottom navigation here)', (await page.locator('[data-snackbar]').count()) === 0);
    await page.waitForTimeout(2300);
    check('publish: the button says "Copy link" again after 2 s', (await page.locator('[data-copy-link]').innerText()).includes('Copy link'));
    await shot(page, '09_published');
    await pause(1200);
    await page.click('[data-go-editor]');
    await page.waitForSelector('[data-status-card]');
    check('editor: Home after publishing, status Live', (await page.locator('[data-status-card]').innerText()).includes('Live') && page.url().endsWith('#home'));
    // K29: Home = how ready the website is + only the next three tasks (the sample-text reminders live here).
    const progress = (await page.locator('[data-next-steps]').innerText()).replace(/\s+/g, ' ');
    const ready = Number(await page.getAttribute('[data-next-steps]', 'data-readiness'));
    check('home (K29): "Your website is N% ready" with at most 3 next steps, sample text among them', ready > 0 && ready < 100 && progress.includes(`Your website is ${ready}% ready`) && (await page.locator('[data-next-step]').count()) <= 3 && (await page.locator('[data-next-step]').count()) >= 1 && progress.includes('replace the sample'), progress.slice(0, 200));
    check('home (K29): a progress bar with its value', (await page.getAttribute('[data-next-steps] [role="progressbar"]', 'aria-valuenow')) === String(ready));
    const statusText = await page.locator('[data-status-card]').innerText();
    check('editor: Live status, no "up to date" claim while sample text is left', statusText.includes('Your website is live') && !statusText.includes('up to date'), statusText.replace(/\s+/g, ' ').slice(0, 160));
    check('home (K29): the name & date changes are not on Home (only next to those fields)', (await page.locator('[data-rights-card]').count()) === 0);
    check('editor: no Home-screen setup prompt after publish (setup never reopens)', !(await page.locator('[data-status-card]').innerText()).includes('Continue setup'));
    await shot(page, '10_home_live');
    await axe(page, 'home');
    // Phone preview: a full-screen layer over the editor (which is inert meanwhile); back closes it.
    await page.click('[data-open-preview]');
    await page.frameLocator('[data-preview] iframe').locator('body').waitFor();
    await page.waitForTimeout(1200);
    const pvBox = await page.locator('[data-preview] iframe').boundingBox();
    check('preview (phone): full-screen layer, the editor behind is inert', pvBox && pvBox.width >= 380 && pvBox.height > 600 && (await page.evaluate(() => (document.querySelector('main#main') as HTMLElement).inert)), JSON.stringify(pvBox));
    await shot(page, '10b_preview_phone', { jpeg: true });
    await page.goBack();
    await page.waitForTimeout(400);
    check('preview (phone): back gesture closes it and stays on Home', !(await page.locator('[data-preview] iframe').isVisible()) && page.url().endsWith('#home'));
    await pause();
    // Edit (K29): six big rows, no sample-text badges, no lock badges; the changes left only inside Us / Day & place.
    await page.click('[data-nav="edit"]');
    await page.waitForSelector('[data-section-row="us"]');
    const rows = await page.locator('[data-section-row]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-section-row')));
    check('edit (K29): six pages — Us, Day & place, Photos, Our Story, Details, RSVP', rows.join(',') === 'us,day,photos,story,details,rsvp', rows.join(','));
    const listText = await page.locator('main').innerText();
    check('edit (K29): no "Sample" and no "changes left" badges on the list', !listText.includes('Sample') && !listText.includes('changes left'), listText.replace(/\s+/g, ' ').slice(0, 200));
    check('edit: no separate "Optional sections"', !listText.includes('Optional sections'));
    await shot(page, '11_edit_list', { full: true });
    await axe(page, 'edit');
    await page.click('[data-section-row="us"]');
    await page.waitForSelector('[data-locked-identity="names"]');
    check('names: identity read only after publishing (no name inputs)', (await page.locator('#f-partners-0-display_name').count()) === 0);
    check('Us (K29): the one place for the name & date changes: "3 of 3 changes left" next to the names', (await page.locator('[data-rights-card]').innerText()).includes('3 of 3 changes left'));
    await shot(page, '12_names_locked');
    await axe(page, 'section: names');
    await pause();
    await page.click('[data-change-identity="names"]');
    await page.waitForSelector('[data-testid="identity"]');
    const firstInput = page.locator('[data-testid="identity"] input').first();
    await firstInput.fill('Elina');
    await page.waitForTimeout(200);
    check('identity sheet: a 1-letter change is a free typo ("Save — free")', (await page.getAttribute('[data-identity-class]', 'data-identity-class')) === 'typo' && (await page.locator('[data-identity-submit]').innerText()).includes('free'));
    await shot(page, '13_identity_typo');
    await pause();
    await firstInput.fill('Sofia');
    await page.locator('[data-testid="identity"] input').nth(1).fill('Sofia Rossi');
    await page.waitForTimeout(200);
    const cost = await page.locator('[data-identity-class]').innerText();
    check('identity sheet: a real change says what it uses ("Use 1 change", 2 left)', (await page.getAttribute('[data-identity-class]', 'data-identity-class')) === 'change' && cost.includes("You'll have 2 left") && (await page.locator('[data-identity-submit]').innerText()).includes('Use 1 change'), cost);
    await shot(page, '14_identity_change');
    await axe(page, 'identity sheet');
    await pause(900);
    await page.click('[data-identity-submit]');
    await page.waitForSelector('[data-testid="identity"]', { state: 'detached' });
    await page.waitForSelector('[data-snackbar]');
    check('identity: snackbar "… 2 name & date changes left" with Undo and Publish', (await page.locator('[data-snackbar]').innerText()).includes('2 name & date changes left') && (await page.locator('[data-snack-action="Undo"]').count()) === 1 && (await page.locator('[data-snack-action="Publish"]').count()) === 1);
    check('names: meter now "2 of 3 changes left"', (await page.locator('[data-locked-identity="names"]').innerText()).includes('2 of 3 changes left'));
    await shot(page, '15_names_after_change');
    // Forgiving (G060-fix): Undo right away gives the change back.
    await pause(700);
    await page.click('[data-snack-action="Undo"]');
    await page.waitForFunction(() => document.querySelector('[data-locked-identity="names"]')?.textContent?.includes('3 of 3 changes left'), null, { timeout: 15_000 });
    check('undo: the change is given back (3 of 3) and the names are as before', (await page.locator('[data-locked-identity="names"]').innerText()).includes('Elena'));
    await shot(page, '15b_names_after_undo');
    await pause(700);
    await page.click('[data-change-identity="names"]');
    await page.waitForSelector('[data-testid="identity"]');
    await page.locator('[data-testid="identity"] input').first().fill('Sofia');
    await page.locator('[data-testid="identity"] input').nth(1).fill('Sofia Rossi');
    await page.click('[data-identity-submit]');
    await page.waitForSelector('[data-testid="identity"]', { state: 'detached' });
    await page.waitForFunction(() => document.querySelector('[data-locked-identity="names"]')?.textContent?.includes('2 of 3 changes left'), null, { timeout: 15_000 });
    check('change again after the undo: 2 of 3 left', true);
    await pause(900);
    await page.click('[data-nav="home"]');
    await page.waitForSelector('[data-changes-bar]');
    // K29: one sticky bar while guests see an older version; Review names the changed page.
    const bar = (await page.locator('[data-changes-bar]').innerText()).replace(/\s+/g, ' ');
    check('home (K29): sticky bar "Unpublished changes: 1 · Review · Publish"', /Unpublished changes: 1\b/.test(bar) && (await page.locator('[data-changes-bar] [data-publish]').count()) === 1 && (await page.locator('header [data-publish]').count()) === 1, bar);
    check('home (K29): no second "Publish changes" in the status card', !(await page.locator('[data-status-card]').innerText()).includes('Publish changes'));
    await shot(page, '16_home_unpublished');
    await page.click('[data-changes-review]');
    await page.waitForSelector('[data-testid="review"]');
    check('review (K29): the changed page is "Us"', (await page.locator('[data-review-item]').allInnerTexts()).join('|') === 'Us');
    await shot(page, '16b_review');
    await axe(page, 'review sheet');
    await page.locator('[data-testid="review"]').getByRole('button', { name: 'Keep editing' }).last().click();
    await page.waitForSelector('[data-testid="review"]', { state: 'detached' });
    await pause();
    await page.click('[data-publish]');
    await page.waitForSelector('[data-testid="live"], [data-testid="notes"]', { timeout: 15_000 });
    if (await page.locator('[data-testid="notes"]').count()) await page.click('[data-publish-anyway]');
    await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
    await pause(1200);
    await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
    // G121 (docs/18 §3 P2): on Home the status card is the one "Live" label; the bar shows it on the other views.
    check('publish changes: no Publish left; Home\'s status card says Live (not repeated in the bar)', (await page.locator('[data-publish]').count()) === 0 && (await page.locator('[data-live-badge]').count()) === 0 && (await page.locator('[data-status-card]').innerText()).includes('Live'));
    await page.click('[data-nav="edit"]');
    await page.waitForSelector('[data-live-badge]');
    check('publish changes: the Live badge replaces the Publish button (bar, outside Home)', (await page.locator('[data-live-badge]').count()) === 1);
    await page.click('[data-nav="home"]');
    await page.waitForSelector('[data-status-card]');
    const pub = await ctx.newPage();
    await pub.goto(PUBLIC);
    check('public page shows the new name', (await pub.locator('body').innerText()).includes('Sofia'));
    await pub.close();
    await pause(800);
    videoPath = await page.video()?.path();
    await ctx.close();
  });

  // =========================================================================== 2. resume + first publish from the editor
  await block('resume', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const N = editUrl('nora-and-sam', other.editKey);
    await page.goto(N);
    await page.waitForSelector('[data-setup]');
    check('resume: a fresh device opens the first unfinished step (1: the date is still sample)', (await page.getAttribute('[data-setup]', 'data-setup')) === '1');
    check('setup 1 (phone in the design\'s own zone): the zone stays New York, shown as the phone\'s', (await page.locator('[data-zone-from-phone]').innerText()).includes('New York'));
    // The publish step with the design's sample date: blocked until the date is set or confirmed (G060-fix). An old
    // address of the 6-step wizard (#setup/6) lands on the publish step (K29).
    await page.goto(`${N}#setup/6`);
    await page.waitForSelector('[data-setup="3"] [data-sample-date-gate]');
    check('old address #setup/6 opens the publish step (#setup/3)', page.url().endsWith('#setup/3'));
    const gate = await page.locator('[data-sample-date-gate]').innerText();
    check('setup 3: "Your wedding date is still the design\u2019s sample" above Publish, Publish disabled', gate.includes('still the design') && (await page.locator('[data-setup-publish]').isDisabled()), gate.replace(/\s+/g, ' '));
    await shot(page, '08b_setup3_sample_date');
    await axe(page, 'setup 3 with sample date');
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 700 });
      await page.waitForTimeout(300);
      const out = await outOfScreen(page, '[data-setup]');
      check(`setup 3 at ${width} px: every control of the fixed bars stays on screen`, !out.length, out.join(' ; '));
      if (width === 360) await shot(page, '08c_setup3_360');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('[data-confirm-sample-date]');
    check('setup 3: "… really is our wedding date" unlocks Publish', !(await page.locator('[data-setup-publish]').isDisabled()));
    await page.click('[data-confirm-sample-date]');
    await page.click('[data-fix-date]');
    await page.waitForSelector('[data-setup="1"]');
    check('setup 3: "Set our date" goes to the date step (step 1)', page.url().endsWith('#setup/1'));
    // 360 × 640: the first field is well above the fixed bar (no banners above it; the rule sits under the names).
    await page.setViewportSize({ width: 360, height: 640 });
    await page.waitForTimeout(300);
    const fit = await page.evaluate(() => {
      const bar = document.querySelector('footer')!.getBoundingClientRect().top;
      const first = document.getElementById('f-partners-0-display_name')!.getBoundingClientRect();
      return { bar, first: first.top, firstBottom: first.bottom };
    });
    check('setup 1 at 360 × 640: the first name field starts well above the bar (no banners)', fit.first < 360 && fit.firstBottom < fit.bar, JSON.stringify(fit));
    await shot(page, '02b_setup1_360x640');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(N);
    await page.waitForSelector('[data-setup="1"]');
    await page.click('[data-setup-skip]');
    await page.waitForSelector('[data-setup="2"]');
    await page.reload();
    await page.waitForSelector('[data-setup]');
    check('resume: reload returns to the step on this phone (2)', (await page.getAttribute('[data-setup]', 'data-setup')) === '2');
    // Save & exit -> Home with "Continue setup · Step 2 of 3"
    await page.click('[data-setup-exit]');
    await page.waitForSelector('[data-status-card]');
    check('save & exit: Home offers "Continue setup · Step 2 of 3"', (await page.locator('[data-status-card]').innerText()).includes('Continue setup · Step 2 of 3'));
    await shot(page, '17_home_draft');
    await page.reload();
    await page.waitForSelector('[data-status-card]');
    check('save & exit: the wizard stays closed on this phone', (await page.locator('[data-setup]').count()) === 0);
    // The first publish from the editor shows the rules too.
    await page.click('[data-publish]');
    await page.waitForSelector('[data-testid="notes"]');
    const sheet = await page.locator('[data-testid="notes"]').innerText();
    check('first publish from the editor: rules box shown', sheet.includes('Good to know before you publish') && sheet.includes('3 changes in total'), sheet.slice(0, 200));
    check('first publish from the editor: the sample date blocks "Publish my website" until confirmed', (await page.locator('[data-testid="notes"] [data-sample-date-gate]').count()) === 1 && (await page.locator('[data-publish-anyway]').isDisabled()));
    await page.click('[data-testid="notes"] [data-confirm-sample-date]');
    check('first publish from the editor: confirming the date unlocks it', !(await page.locator('[data-publish-anyway]').isDisabled()));
    await shot(page, '18_first_publish_rules');
    await axe(page, 'first publish sheet');
    await page.locator('[data-testid="notes"]').getByRole('button', { name: 'Keep editing' }).last().click();
    // Views: focus to h1, hash changes, back = previous view.
    await page.click('[data-nav="guests"]');
    await page.waitForSelector('h1:has-text("Guests")');
    check('nav: Guests view, hash #guests, focus on its heading', page.url().endsWith('#guests') && (await focusedIsH1(page)));
    check('guests: empty state before publishing', (await page.locator('main').innerText()).includes('Replies appear here after you publish your website.'));
    await page.click('[data-nav="share"]');
    await page.waitForSelector('h1:has-text("Share")');
    await page.goBack();
    await page.waitForSelector('h1:has-text("Guests")');
    check('nav: back gesture returns to the previous view', page.url().endsWith('#guests'));
    // Schedule: remove -> Undo.
    await page.goto(`${N}#edit/schedule`);
    await page.waitForSelector('[data-schedule-row]');
    const rows = await page.locator('[data-schedule-row]').count();
    await page.getByRole('button', { name: 'Options for event 2' }).click();
    await shot(page, '19_schedule_menu');
    await page.getByRole('menuitem', { name: 'Remove' }).click();
    await page.waitForSelector('[data-snackbar]');
    check('list: Remove happens at once with an Undo snackbar', (await page.locator('[data-schedule-row]').count()) === rows - 1 && (await page.locator('[data-snackbar]').innerText()).includes('Event removed'));
    await page.locator('[data-snackbar]').getByRole('button', { name: 'Undo' }).click();
    await page.waitForTimeout(200);
    check('list: Undo puts the event back', (await page.locator('[data-schedule-row]').count()) === rows);
    await waitSaved(page);
    // On/off switches live next to their content.
    await page.goto(`${N}#edit/story`);
    await page.waitForSelector('#optional-our_story');
    check('switches: Our Story on/off sits on the Our Story page', (await page.locator('#optional-our_story').count()) === 1);
    await axe(page, 'section: story');
    await page.goto(`${N}#edit/details`);
    await page.waitForSelector('[data-section="details"]');
    check('switches: Details has the dress code / travel / registry switches next to their fields', (await page.locator('[data-section="details"] [role="switch"]').count()) >= 3);
    await shot(page, '20_details', { full: true });
    await axe(page, 'section: details');
    // 320 px: no horizontal scroll; the fixed bars keep every control on screen (320 / 360).
    await page.setViewportSize({ width: 320, height: 700 });
    for (const view of ['#home', '#edit', '#edit/date', '#share']) {
      await page.goto(`${N}${view}`);
      await page.waitForTimeout(400);
      check(`320 px: no horizontal scroll on ${view}`, (await overflow(page)) <= 0, String(await overflow(page)));
    }
    for (const width of [320, 360]) {
      await page.setViewportSize({ width, height: 700 });
      for (const view of ['#setup/1', '#setup/4', '#edit/venue', '#home']) {
        await page.goto(`${N}${view}`);
        await page.waitForTimeout(400);
        const out = [...(await outOfScreen(page, 'header')), ...(await outOfScreen(page, 'footer'))];
        check(`${width} px: header / footer controls on screen on ${view}`, !out.length, out.join(' ; '));
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await ctx.close();
  });

  // =========================================================================== 2b. crop sheet on a short phone (360 × 640)
  await block('crop 360x640', async () => {
    const ctx = await browser.newContext({ ...PHONE, viewport: { width: 360, height: 640 } });
    const page = await ctx.newPage();
    await page.goto(editUrl('nora-and-sam', other.editKey, '#edit/photos'));
    await page.waitForSelector('input[data-slot="hero_portrait"]', { state: 'attached' });
    await page.setInputFiles('input[data-slot="hero_portrait"]', PHOTO);
    await page.waitForSelector('[data-testid="cropper"] img');
    await page.waitForTimeout(400);
    const hit = await page.evaluate(() => {
      const r = document.getElementById('crop-zoom')!.getBoundingClientRect();
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { id: el?.id ?? el?.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom) };
    });
    check('crop at 360 × 640: the zoom slider is not under "Use this photo"', hit.id === 'crop-zoom', JSON.stringify(hit));
    await shot(page, '05b_crop_360x640', { jpeg: true });
    await ctx.close();
  });

  // =========================================================================== 3. live site: guests, share, rights 0, offline, conflict
  await block('live', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const L = editUrl('clara-and-julian', live.editKey);
    await page.goto(`${L}#guests`);
    await page.waitForSelector('[data-reply]');
    const stats = await page.locator('main').innerText();
    check('guests: numbers (11 guests coming, 2 not coming, 8 replies)', /11\s*Guests coming/.test(stats) && /2\s*Not coming/.test(stats) && /8\s*Replies/.test(stats), stats.slice(0, 160).replace(/\s+/g, ' '));
    check('guests: search shown from 8 replies', (await page.locator('#reply-search').count()) === 1);
    await page.fill('#reply-search', 'grace');
    check('guests: search filters by name', (await page.locator('[data-reply]').count()) === 1);
    await page.fill('#reply-search', '');
    await page.getByRole('button', { name: 'Not coming', exact: true }).click();
    check('guests: filter "Not coming"', (await page.locator('[data-reply]').count()) === 2);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await page.locator('[data-reply] button[aria-expanded]').first().click();
    check('guests: a reply opens to show its message', (await page.locator('[data-reply]').first().innerText()).includes('margaret@example.com'));
    await shot(page, '21_guests');
    await axe(page, 'guests');
    await page.getByRole('button', { name: 'Options for the reply from Margaret Hamilton' }).click();
    await page.getByRole('menuitem', { name: 'Remove reply' }).click();
    await page.waitForSelector('[data-testid="remove-reply"]');
    check('guests: removing a reply asks first', true);
    await page.click('[data-confirm-remove-reply]');
    await page.waitForFunction(() => !document.body.innerText.includes('Margaret Hamilton'));
    check('guests: reply removed', (await page.locator('[data-reply]').count()) === 7);
    check('guests: CSV link present', (await page.locator('[data-csv]').count()) === 1);
    // Share
    await page.click('[data-nav="share"]');
    await page.waitForSelector('[data-share-url]');
    // K29 + G121 (docs/18 §4 P2): the link first; the QR code, the guest password and the private edit link fold away below.
    const folds = await page.locator('[data-disclosure] button[aria-expanded]').evaluateAll((els: Element[]) =>
      els.map((e) => `${e.closest('[data-disclosure]')!.getAttribute('data-disclosure')}:${e.getAttribute('aria-expanded')}`),
    );
    check('share (K29, G121): link on top; QR code, guest password and edit link folded', (await page.locator('[data-share-qr] svg[role="img"]').count()) === 1 && folds.join(',') === 'qr:false,password:false,edit-link:false', folds.join(','));
    await page.click('[data-disclosure="edit-link"] button[aria-expanded]');
    await page.waitForSelector('[data-copy-edit-link]');
    const share = await page.locator('main').innerText();
    check('share: link + edit-link warning and tip; no "Sign in by email" card for a feature that does not exist', share.includes('Anyone with this link can edit your website') && share.includes('add this page to your Home Screen') && !share.includes('Sign in by email') && !share.includes('Not available yet'));
    const urlBox = await page.locator('[data-share-url]').boundingBox();
    check('share: the address does not break inside "clara-and-julian"', (await page.locator('[data-share-url]').innerText()).includes('clara-and-julian') && urlBox!.height < 60, String(urlBox?.height));
    await shot(page, '22_share', { full: true });
    await axe(page, 'share');
    await page.getByRole('button', { name: 'Take the website offline' }).click();
    await page.waitForSelector('[data-testid="offline"]');
    await page.click('[data-confirm-offline]');
    await page.waitForFunction(() => document.querySelector('[data-panel]')?.getAttribute('data-status') === 'draft');
    check('share: "Take offline" (confirmed) unpublishes', true);
    await page.click('[data-publish]');
    await page.waitForSelector('[data-testid="live"], [data-testid="notes"]');
    if (await page.locator('[data-testid="notes"]').count()) await page.click('[data-publish-anyway]');
    await page.waitForSelector('[data-testid="live"]');
    await page.locator('[data-testid="live"]').getByRole('button', { name: 'Close' }).click();
    check('share: "Publish again" brings it back', (await page.getAttribute('[data-panel]', 'data-status')) === 'published');

    // Rights 0: the sheet says so (with the support placeholders); a typo stays free.
    // Dates move by days (G060-fix): a few days is free and says so; a month uses a change and says why.
    // (This site was published with the design's sample date, whose first replacement is free: give it a real one first.)
    const pre = (await adapter.getSiteById(live.site.id))!;
    await adapter.patchSite(pre.id, { content: { ...pre.content, date: '2027-06-12' }, identity: { ...pre.identity!, anchor: { ...pre.identity!.anchor, date: '2027-06-12' } } });
    await page.goto(`${L}#edit/date`);
    await page.reload();
    await page.waitForSelector('[data-change-identity="date"]');
    await page.click('[data-change-identity="date"]');
    await page.waitForSelector('[data-testid="identity"]');
    const dateInput = page.locator('[data-testid="identity"] input[type="date"]');
    await dateInput.fill('2027-06-15');
    const near = await page.locator('[data-identity-class]').innerText();
    check('date: 3 days later is free ("Moving your date by up to 7 days is free.")', (await page.getAttribute('[data-identity-class]', 'data-identity-class')) === 'typo' && near.includes('Moving your date by up to 7 days is free'), near);
    await shot(page, '22b_date_moved_free');
    await dateInput.fill('2027-07-20');
    const far = await page.locator('[data-identity-class]').innerText();
    check('date: a month later uses a change and says only a week is free', (await page.getAttribute('[data-identity-class]', 'data-identity-class')) !== 'typo' && far.includes('Only date moves of up to 7 days are free'), far);
    await page.locator('[data-testid="identity"]').getByRole('button', { name: 'Undo my edits' }).click();
    await page.locator('[data-testid="identity"]').getByRole('button', { name: 'Cancel' }).click();
    const site = (await adapter.getSiteById(live.site.id))!;
    await adapter.patchSite(site.id, { identity: { ...site.identity!, used: 3, undo: null } });
    await page.goto(`${L}#edit/names`);
    await page.reload();
    await page.waitForSelector('[data-locked-identity="names"]');
    await page.click('[data-change-identity="names"]');
    await page.waitForSelector('[data-testid="identity"]');
    const first = page.locator('[data-testid="identity"] input').first();
    await first.fill('Hannah');
    const zero = await page.locator('[data-identity-class]').innerText();
    check('rights 0: §11.8 text with the support email and the shop name (K33)', zero.includes("You've used all 3 name and date changes") && zero.includes('bkestudio@gmail.com') && zero.includes('BKE Studio'), zero);
    check('rights 0: the change button is disabled', await page.locator('[data-identity-submit]').isDisabled());
    await shot(page, '23_identity_no_rights');
    await first.fill('Clare');
    check('rights 0: a typo is still free ("Save — free")', (await page.locator('[data-identity-submit]').innerText()).includes('free') && !(await page.locator('[data-identity-submit]').isDisabled()));
    await page.click('[data-identity-submit]');
    await page.waitForSelector('[data-testid="identity"]', { state: 'detached' });
    check('rights 0: typo saved', (await page.locator('[data-locked-identity="names"]').innerText()).includes('Clare'));

    // Offline: banner, publish disabled, the edit is kept on the phone and saved when back online.
    await page.goto(`${L}#edit/details`);
    await page.waitForSelector('#f-host_line');
    await ctx.setOffline(true);
    await page.waitForSelector('[data-offline-banner]');
    await page.fill('#f-host_line', 'With joy, together with their families');
    await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'offline', null, { timeout: 10_000 });
    check('offline: banner + "Offline" save state', (await page.locator('[data-offline-banner]').innerText()).includes('offline'));
    check('offline: the draft is kept on this phone', await page.evaluate(() => Boolean(localStorage.getItem('draft:clara-and-julian'))));
    check('offline: Publish is disabled', await page.locator('[data-publish]').isDisabled());
    await shot(page, '24_offline');
    await ctx.setOffline(false);
    await waitSaved(page);
    check('offline: saved once back online, local copy removed', !(await page.evaluate(() => localStorage.getItem('draft:clara-and-julian'))));

    // Local copy left on the phone (the page was closed before it could save): offered on the next visit.
    // Written directly, because whether the browser's last keepalive save got through while closing is a race.
    const stamp = (await adapter.getSiteById(live.site.id))!;
    await page.evaluate(
      ({ slug, base, content }: { slug: string; base: string; content: unknown }) =>
        localStorage.setItem(`draft:${slug}`, JSON.stringify({ baseUpdatedAt: base, content, at: new Date().toISOString() })),
      { slug: 'clara-and-julian', base: stamp.updatedAt, content: { ...stamp.content, host_line: 'Kept on this phone' } },
    );
    await page.close();
    const again = await ctx.newPage();
    await again.goto(`${L}#edit/details`);
    await again.waitForSelector('[data-backup-banner]');
    check('local copy: "You have unsaved changes from this phone." with Restore', (await again.locator('[data-backup-banner]').innerText()).includes('You have unsaved changes from this phone.'));
    await shot(again, '25_restore_backup');
    await again.locator('[data-backup-banner]').getByRole('button', { name: 'Restore' }).click();
    await waitSaved(again);
    check('local copy: restored and saved', (await again.inputValue('#f-host_line')) === 'Kept on this phone' && (await adapter.getSiteById(live.site.id))!.content.host_line === 'Kept on this phone');
    // A copy made on an older version is never applied silently.
    await again.evaluate((slug: string) => localStorage.setItem(`draft:${slug}`, JSON.stringify({ baseUpdatedAt: '2000-01-01T00:00:00.000Z', content: { host_line: 'old' }, at: '' })), 'clara-and-julian');
    await again.reload();
    await again.waitForSelector('[data-backup-banner]');
    check('local copy: an older-version copy offers only Discard', (await again.locator('[data-backup-banner]').getByRole('button', { name: 'Restore' }).count()) === 0);
    await again.locator('[data-backup-banner]').getByRole('button', { name: 'Discard' }).click();

    // Conflict: another tab saved meanwhile.
    const tabB = await ctx.newPage();
    await tabB.goto(`${L}#edit/details`);
    await tabB.waitForSelector('#f-host_line');
    await again.fill('#f-host_line', 'Saved in tab A');
    await waitSaved(again);
    await tabB.fill('#f-host_line', 'Typed in tab B');
    await tabB.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'conflict', null, { timeout: 15_000 });
    check('conflict: "Saving paused" banner with Reload', (await tabB.locator('main').innerText()).includes('Reload'));
    await shot(tabB, '26_conflict');
    await ctx.close();
  });

  // =========================================================================== 4. archive, 401, desktop, motion
  await block('archive', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(editUrl('old-wedding', archivedSite.editKey, '#home'));
    await page.waitForSelector('[data-status-card]');
    check('archive: Home says the website is closed for guests', (await page.locator('[data-status-card]').innerText()).includes('closed for guests'));
    check('archive: no Publish button, "Archived" badge', (await page.locator('[data-publish]').count()) === 0 && (await page.locator('header').innerText()).includes('Archived'));
    await shot(page, '27_archived');
    await axe(page, 'archived home');
    // K29: the name & date changes live next to the names (Us page), also when archived.
    await page.goto(editUrl('old-wedding', archivedSite.editKey, '#edit/us'));
    await page.waitForSelector('[data-rights-card]');
    check('archive: Us says names and date can no longer be changed (no Change button)', (await page.locator('[data-rights-card]').innerText()).includes('can no longer be changed') && (await page.locator('[data-change-identity]').count()) === 0);
    await page.goto(editUrl('old-wedding', archivedSite.editKey, '#edit/venue'));
    await page.waitForSelector('#f-venue-name');
    check('archive: banner "Your website closed for guests on …" in the editor', (await page.locator('[data-archived-banner]').innerText()).includes('Your website closed for guests on'));
    check('archive: fields are read only', (await page.getAttribute('#f-venue-name', 'readonly')) !== null);
    const res = await page.request.get(`${BASE}/old-wedding`);
    check('archive: the public address answers 410', res.status() === 410);
    await ctx.close();
  });

  await block('unauthorized', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const fresh = await createSiteWithKeys(adapter, { slug: 'lost-link', theme: THEME, content: draftFromDemo(demo, ['Mia', 'Tom']) });
    await page.goto(editUrl('lost-link', fresh.editKey, '#edit/details'));
    await page.waitForSelector('#f-host_line');
    await reissueKeys(adapter, fresh.site.id);
    await page.fill('#f-host_line', 'after the link changed');
    await page.waitForSelector('text=This edit link no longer works', { timeout: 15_000 });
    check('401: full-screen "This edit link no longer works" + order number way back + shop text', (await page.locator('main').innerText()).includes('BKE Studio on Etsy') && (await page.locator('[data-continue-order]').count()) === 1);
    await page.goto(`${BASE}/edit/lost-link?k=wrong`);
    const nf = await page.locator('main').innerText();
    // G146: the bad-link page sends the buyer to /my (order number + email) or to paste the saved link.
    check('bad link page: "Continue with your order number" + "Paste your edit link"', nf.includes('Continue with your order number') && nf.includes('Paste your edit link'));
    const signin = await page.request.post(`${BASE}/api/signin`, { data: { email: 'someone@example.com' } });
    check('sign-in API: 503 "unavailable" (no e-mail provider)', signin.status() === 503 && (await signin.json()).code === 'unavailable');
    await page.goto(`${BASE}/signin`);
    check('/signin: no form, the way in is /my', (await page.locator('form').count()) === 0 && (await page.locator('main a[href="/my#continue"]').count()) === 1);
    await ctx.close();
  });

  await block('touch targets', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const L = editUrl('clara-and-julian', live.editKey);
    const all: string[] = [];
    for (const view of ['#home', '#edit', '#edit/names', '#edit/date', '#edit/schedule', '#edit/rsvp', '#edit/photos', '#guests', '#share']) {
      await page.goto(`${L}${view}`);
      await page.waitForTimeout(500);
      for (const s of await smallTargets(page)) all.push(`${view}: ${s}`);
    }
    await page.goto(editUrl('nora-and-sam', other.editKey, '#setup/2'));
    await page.waitForSelector('[data-setup]');
    for (const s of await smallTargets(page)) all.push(`#setup: ${s}`);
    check('touch targets: every visible control is at least 44 × 44 px', !all.length, all.slice(0, 12).join(' ; '));
    // Reduced motion: no transforms in transitions.
    const rm = await browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    const p2 = await rm.newPage();
    await p2.goto(`${L}#home`);
    await p2.waitForSelector('[data-status-card]');
    const dur = await p2.evaluate(() => getComputedStyle(document.querySelector('[data-status-card] button') as Element).transitionDuration);
    check('reduced motion: transitions shortened to ~0', /^(0\.001s|1ms|0s)/.test(dur), dur);
    await rm.close();
    await ctx.close();
  });

  await block('shared preview', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    // The long-lived preview key (never shown in the panel any more) opens the draft only under a bar (G060-fix).
    await page.goto(`${BASE}/nora-and-sam?preview=${other.previewKey}`);
    await page.waitForSelector('[data-platform-preview-bar]');
    const bar = await page.locator('[data-platform-preview-bar]').boundingBox();
    check('shared preview: "Preview — this website is not published" bar at the top', (await page.locator('[data-platform-preview-bar]').innerText()).includes('not published') && bar && bar.y <= 1 && bar.width >= 380, JSON.stringify(bar));
    await page.waitForTimeout(800);
    await shot(page, '31_shared_preview_bar', { jpeg: true });
    const panelHtml = await (await page.request.get(`${BASE}/clara-and-julian`)).text();
    check('public page: no preview bar for guests', !panelHtml.includes('data-platform-preview-bar'));
    await ctx.close();
  });

  await block('desktop', async () => {
    const L = editUrl('clara-and-julian', live.editKey);
    const desk = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    const d = await desk.newPage();
    await d.goto(`${L}#home`);
    await d.frameLocator('[data-preview] iframe').locator('body').waitFor();
    await d.waitForTimeout(1500);
    const nav = await d.locator('nav[aria-label="Editor"]').boundingBox();
    const main = await d.locator('main#main').boundingBox();
    const pv = await d.locator('[data-preview] iframe').boundingBox();
    check('1280 (K29): two columns — editing with the tabs above it, the sticky live preview on the right', nav && main && pv && nav.height < 80 && nav.y + nav.height <= main.y + 1 && pv.x > main.x + main.width - 40 && pv.x > 640, JSON.stringify({ nav, main, pv }));
    check('1280: no phone Preview button', (await d.locator('[data-open-preview]').count()) === 0);
    await d.screenshot({ path: path.join(OUT, '28_desktop_1280_home.jpg'), type: 'jpeg', quality: 82 });
    await d.goto(`${L}#edit/schedule`);
    await d.waitForTimeout(1200);
    check('1280: the preview follows the open section (Schedule -> Details tab)', (await d.locator('[data-preview] [role="tab"][aria-selected="true"]').innerText()) === 'Details');
    await d.goto(`${L}#edit/venue`);
    await d.waitForTimeout(1500);
    // Typing slowly reloads the preview once, after saving has settled (not after every autosave).
    await d.evaluate(() => {
      (window as any).__loads = 0;
      document.querySelector('[data-preview] iframe')!.addEventListener('load', () => ((window as any).__loads += 1));
    });
    for (const ch of ' Hall') {
      await d.locator('#f-venue-name').press(ch === ' ' ? 'Space' : ch);
      await d.waitForTimeout(900);
    }
    await d.waitForTimeout(4500);
    const loads = await d.evaluate(() => (window as any).__loads);
    check('1280: 5 slow keystrokes reload the preview once (settled), not 5 times', loads === 1, String(loads));
    await d.screenshot({ path: path.join(OUT, '29_desktop_1280_venue.jpg'), type: 'jpeg', quality: 82 });
    await axe(d, 'desktop 1280 section');
    await desk.close();
    const mid = await browser.newContext({ viewport: { width: 1000, height: 820 } });
    const m = await mid.newPage();
    await m.goto(`${L}#edit`);
    await m.waitForTimeout(1500);
    const mnav = await m.locator('nav[aria-label="Editor"]').boundingBox();
    const mpv = await m.locator('[data-preview] iframe').boundingBox();
    check('960–1279: tabs above the content + preview column', mnav && mpv && mnav.height < 80 && mpv.x > 500, JSON.stringify({ mnav, mpv }));
    await m.screenshot({ path: path.join(OUT, '30_tablet_1000_edit.jpg'), type: 'jpeg', quality: 82 });
    await mid.close();
  });
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.proc.kill('SIGTERM');
}

// Video: Playwright records WebM; convert to a small H.264 MP4 for previews/.
if (videoPath && existsSync(videoPath)) {
  const mp4 = path.join(OUT, 'g060_journey_390.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', videoPath, '-vf', 'scale=390:844,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-movflags', '+faststart', '-an', mp4]);
  check('video: MP4 written', r.status === 0 && existsSync(mp4), r.status === 0 ? path.relative(ROOT, mp4) : String(r.stderr));
} else {
  check('video: recorded', false, 'no video file');
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify({ base: 'next start (production build)', viewport: '390x844 (isMobile, touch) + 320, 1000, 1280', theme: THEME, axe: axeResults, checks }, null, 2) + '\n',
);
for (const dir of [dataDir, videoDir]) rmSync(dir, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} of ${checks.length} check(s) failed.\n--- server log ---\n${server.log().slice(-3000)}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed; screenshots and video in ${path.relative(process.cwd(), OUT) || OUT}/ (${readdirSync(OUT).length} files)`);
