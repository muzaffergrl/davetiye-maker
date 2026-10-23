// Browser check of the /start claim flow (G045): real `next start` + Chromium at 390 px (phone).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/claim-browser.ts
//
// Flow: no/invalid theme link -> /start?theme=… shows the live demo -> field errors -> fill the form
// (address follows the names, availability hint) -> create -> big edit link + "Save this link" + copy
// -> reload keeps the link -> "Open my editor" opens the panel (G039) with the buyer's names ->
// the same order number + email again gets the choice (G951: open the order's website / start one more), "Open it" and
// "Start another website with this design" work, another email gets the friendly "already has a website" message
// (nothing leaked) ->
// a taken address moves to "-2" -> desktop layout. If platform/themes/blush-garden-rose exists (G038),
// its start page and editor are captured too.
// Fixture theme "sample-design" = a copy of _sample (test scaffolding, not a design) with the 03 demo record.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data in temp folders.
// Writes screenshots, a short MP4 (ffmpeg) and checks.json to previews/g045/ (or $CLAIM_SHOTS_DIR).
// Exit code 1 when a check fails.

import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LocalAdapter } from '../lib/data/local/index.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const PORT = Number(process.env.PORT || 3314);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.CLAIM_SHOTS_DIR || path.join(ROOT, 'previews/g045');
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

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'claim-browser-data-'));
const themesDir = mkdtempSync(path.join(os.tmpdir(), 'claim-browser-themes-'));
const videoDir = mkdtempSync(path.join(os.tmpdir(), 'claim-browser-video-'));
mkdirSync(OUT, { recursive: true });

// Fixture theme: _sample made buyer-visible, with the 03 demo record as its own content.demo.json.
const FIXTURE = 'sample-design';
cpSync(path.join(ROOT, 'themes/_sample'), path.join(themesDir, FIXTURE), { recursive: true });
const manifest = JSON.parse(readFileSync(path.join(themesDir, FIXTURE, 'theme.json'), 'utf8'));
manifest.id = FIXTURE;
manifest.name = 'Sample design (test fixture)';
delete manifest.internal;
writeFileSync(path.join(themesDir, FIXTURE, 'theme.json'), JSON.stringify(manifest, null, 2));
cpSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), path.join(themesDir, FIXTURE, 'content.demo.json'));
cpSync(path.join(ROOT, 'themes/_sample'), path.join(themesDir, '_sample'), { recursive: true });
const REAL_THEME = 'blush-garden-rose';
const hasRealTheme = existsSync(path.join(ROOT, 'themes', REAL_THEME, 'theme.json'));
if (hasRealTheme) cpSync(path.join(ROOT, 'themes', REAL_THEME), path.join(themesDir, REAL_THEME), { recursive: true });

const ORDER = '4821559031'; // fictional
const ORDER_TYPED = '#4821 5590 31';

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
const notes: string[] = [];

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

const shot = async (page: any, name: string, opts: { fullPage?: boolean; jpeg?: boolean } = {}) => {
  await page.waitForTimeout(300);
  const file = path.join(OUT, `${name}.${opts.jpeg ? 'jpg' : 'png'}`);
  await page.screenshot({ path: file, fullPage: Boolean(opts.fullPage), ...(opts.jpeg ? { type: 'jpeg', quality: 82 } : {}) });
};
const overflow = (page: any) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function fillForm(page: any, v: { order: string; email?: string; names: [string, string] }) {
  await page.fill('#start-order', v.order);
  if (v.email !== undefined) await page.fill('#start-email', v.email);
  await page.fill('#start-name1', v.names[0]);
  await page.fill('#start-name2', v.names[1]);
}

let browser: any;
let videoPath: string | null = null;
try {
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch({ slowMo: Number(process.env.CLAIM_SLOWMO ?? 40) });
  const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

  // 1. Start links without a valid theme.
  {
    const ctx = await browser.newContext(device);
    const page = await ctx.newPage();
    let res = await page.goto(`${BASE}/start`, { waitUntil: 'networkidle' });
    check('/start without theme: 200 + design list', res.status() === 200 && (await page.locator(`a[href="/start?theme=${FIXTURE}"]`).count()) === 1);
    check('/start without theme: internal _sample not offered', (await page.locator('a[href="/start?theme=_sample"]').count()) === 0);
    await shot(page, '00_no_theme_390');
    res = await page.goto(`${BASE}/start?theme=_sample`, { waitUntil: 'networkidle' });
    check('/start?theme=_sample (internal): "not valid" page', (await page.locator('h1').innerText()).includes('not valid'));
    res = await page.goto(`${BASE}/start?theme=nope`, { waitUntil: 'networkidle' });
    check('/start?theme=nope: "not valid" page', (await page.locator('h1').innerText()).includes('not valid'));
    await shot(page, '00b_bad_theme_390');
    await ctx.close();
  }

  // 2. Main flow (recorded).
  const ctx = await browser.newContext({ ...device, recordVideo: { dir: videoDir, size: { width: 390, height: 844 } } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  const page = await ctx.newPage();
  const problems: string[] = [];
  page.on('console', (m: any) => {
    // Chromium logs every non-2xx fetch; the 409 "order already used" answer is expected in this flow.
    if (m.type() === 'error' && !/status of 409 \(Conflict\)/.test(m.text())) problems.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e: any) => problems.push(`pageerror: ${e.message}`));

  await page.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
  check('start page: title', (await page.locator('h1').innerText()) === 'Start your website');
  check('start page: design name shown', (await page.locator('main').innerText()).includes('Sample design (test fixture)'));
  const demo = page.frameLocator('iframe');
  await demo.locator('body').waitFor();
  const demoText = await demo.locator('body').innerText();
  check('demo preview: live iframe shows the demo content', demoText.includes('Clara') && demoText.includes('Julian'), demoText.slice(0, 80));
  const frameSrc = await page.locator('iframe').getAttribute('src');
  check('demo preview: iframe is /start/demo/<theme>', frameSrc === `/start/demo/${FIXTURE}`, String(frameSrc));
  const box = await page.locator('iframe').boundingBox();
  check('demo preview: scaled mini iframe fits the phone', box && box.width < 260 && box.width > 150, JSON.stringify(box));
  check('start page: no horizontal overflow at 390 px', (await overflow(page)) <= 0);
  await shot(page, '01_start_390');
  await shot(page, '01b_start_full_390', { fullPage: true });

  // Field errors: empty submit, then a too-short order number.
  await page.click('button[type="submit"]');
  await page.waitForTimeout(200);
  const invalid = await page.locator('[aria-invalid="true"]').count();
  check('empty submit: 4 fields marked invalid, nothing sent', invalid === 4, String(invalid));
  check('empty submit: focus moves to the order number', (await page.evaluate(() => document.activeElement?.id)) === 'start-order');
  await page.fill('#start-order', '1234');
  await page.locator('#start-email').focus();
  const orderError = await page.locator('#start-order-error').innerText();
  check('order number format error shown', orderError.includes('8 to 12 digits'), orderError);
  await page.locator('#start-order').scrollIntoViewIfNeeded();
  await shot(page, '02_errors_390');

  // Fill the form: the address follows the names; the hint says it is free.
  await fillForm(page, { order: ORDER_TYPED, email: 'avery@example.test', names: ['Avery', 'Jordan'] });
  await page.waitForSelector('[data-slug-available]');
  check('address follows the names', (await page.inputValue('#start-slug')) === 'avery-and-jordan');
  check('address hint: available', (await page.locator('[data-slug-available]').innerText()).startsWith('Available'));
  check('no field errors once filled', (await page.locator('[aria-invalid="true"]').count()) === 0);
  await page.locator('#start-slug').scrollIntoViewIfNeeded();
  await shot(page, '03_filled_390');

  // Create.
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-edit-link]');
  const editUrl = await page.inputValue('[data-edit-link]');
  check('result: edit link shown', /^http:\/\/127\.0\.0\.1:\d+\/edit\/avery-and-jordan\?k=[A-Za-z0-9_-]{43}$/.test(editUrl), editUrl.replace(/k=.*/, 'k=…'));
  const resultText = await page.locator('main').innerText();
  check('result: "Save this link" warning', resultText.includes('Save this link') && resultText.includes('shortcut to your editor'));
  check('result: says email is not sent yet', resultText.includes('We cannot email it to you yet'));
  check('result: focus on the heading', (await page.evaluate(() => document.activeElement?.id)) === 'start-result-title');
  const fontSize = await page.locator('[data-edit-link]').evaluate((el: Element) => parseFloat(getComputedStyle(el).fontSize));
  check('result: link shown big (>= 16 px)', fontSize >= 16, `${fontSize}px`);
  check('result: no horizontal overflow', (await overflow(page)) <= 0);
  await shot(page, '04_edit_link_390');
  await page.click('[data-copy-link]');
  await page.waitForFunction(() => document.querySelector('[data-copy-link]')?.textContent === 'Copied');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check('copy button: clipboard holds the edit link', clip === editUrl);
  await shot(page, '04b_copied_390');

  const adapter = new LocalAdapter(dataDir);
  const site = await adapter.getSiteBySlug('avery-and-jordan');
  check('stored: draft site from the demo with the buyer names', site?.status === 'draft' && site.content.name_display === 'Avery & Jordan' && site.content.record_kind === 'customer');
  check('stored: order number as digits, owner email', site?.orderRef === ORDER && site?.ownerEmail === 'avery@example.test');
  const key = new URL(editUrl).searchParams.get('k')!;
  check('stored: edit key only as a hash', !readFileSync(path.join(dataDir, 'sites', `${site?.id}.json`), 'utf8').includes(key));
  check('public address is not live before Publish', (await fetch(`${BASE}/avery-and-jordan`)).status === 404);

  // Reload (pull to refresh) keeps the link in this tab.
  await page.reload({ waitUntil: 'networkidle' });
  check('reload: edit link still shown', (await page.locator('[data-edit-link]').count()) === 1 && (await page.inputValue('[data-edit-link]')) === editUrl);

  // Open the editor.
  await page.click('[data-open-editor]');
  await page.waitForURL(/\/edit\/avery-and-jordan\?k=.*#setup\/1$/);
  await page.waitForSelector('[data-setup="1"]');
  const firstName = await page.inputValue('#f-partners-0-display_name');
  check('editor opens with the edit link at setup step 1, names filled (panel v2, G060)', firstName === 'Avery' && (await page.locator('h1').first().innerText()).includes('Your names'), firstName);
  check('editor: draft status', (await page.getAttribute('[data-panel]', 'data-status')) === 'draft');
  await shot(page, '05_editor_390');

  // Back to /start: the stored result; "Start with a different order" gives an empty form (email kept).
  await page.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
  check('back on /start: the saved link is shown again', (await page.locator('[data-edit-link]').count()) === 1);
  await page.getByRole('button', { name: 'Start with a different order' }).click();
  await page.waitForSelector('#start-order');
  check('start another: form again, email kept', (await page.inputValue('#start-email')) === 'avery@example.test' && (await page.inputValue('#start-order')) === '');

  // G951: the same order number + the same email again -> the choice (open the order's website, or start one more —
  // only if the design was bought twice): no link in the page, no new site until the buyer asks for one.
  // (Selectors are data attributes: several elements carry role="status" — the address hint too — so a role locator is
  // not unique in Playwright's strict mode.)
  await fillForm(page, { order: ORDER, names: ['Other', 'Pair'] });
  await page.waitForSelector('[data-slug-available]');
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-start-choice]');
  const choiceText = await page.locator('[data-start-choice]').innerText();
  check(
    'second claim, same email: the choice',
    choiceText.includes('Your Etsy order already has a website.') && choiceText.includes('Open it') && choiceText.includes('Start another website with this design'),
    choiceText.slice(0, 200),
  );
  check(
    "second claim, same email: the order's website listed, no link",
    (await page.locator('[data-start-open="avery-and-jordan"]').count()) === 1 && !(await page.locator('main').innerText()).includes('k=') && (await page.locator('[data-edit-link]').count()) === 0,
  );
  check('second claim: no new site before the buyer asks', (await adapter.findSitesByOrderRef(ORDER)).length === 1 && !(await adapter.getSiteBySlug('other-and-pair')));
  check('choice: no horizontal overflow at 390 px', (await overflow(page)) <= 0);
  // review 2026-10-23: the choice is drawn at the top of the form, far above the tapped button on a phone; it must take
  // the focus and come on screen by itself (a timer focus ran before React rendered it: nothing seemed to happen)
  const onScreen = (selector: string) =>
    page
      .waitForFunction((sel: string) => document.activeElement === document.querySelector(sel), selector, { timeout: 3000 })
      .catch(() => null)
      .then(() =>
        page.evaluate((sel: string) => {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { focused: document.activeElement === el, top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight };
        }, selector),
      );
  const seen = await onScreen('[data-start-choice]');
  check('choice: focused and on screen after the tap (390 px)', !!seen && seen.focused && seen.top >= 0 && seen.top < seen.vh - 80, JSON.stringify(seen));
  await page.locator('[data-start-choice]').scrollIntoViewIfNeeded();
  await shot(page, '06_order_choice_390');

  // Another email with the same order number -> the friendly "already has a website" notice (the way to /my), nothing leaked.
  await page.fill('#start-email', 'someone@example.test');
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-start-my-link]');
  await page.evaluate(() => document.querySelector('[data-start-my-link]')?.closest('[tabindex="-1"]')?.setAttribute('data-test-message', ''));
  const msgSeen = await onScreen('[data-test-message]');
  check('message: focused and on screen after the tap (390 px)', !!msgSeen && msgSeen.focused && msgSeen.top >= 0 && msgSeen.top < msgSeen.vh - 80, JSON.stringify(msgSeen));
  const usedText = await page.locator('main').innerText();
  check(
    'second claim, another email: friendly message with the way to /my',
    usedText.includes('This order already has a website') && (await page.locator('[data-start-my-link]').getAttribute('href')) === '/my#continue',
  );
  check(
    'second claim, another email: no link or first address leaked',
    !usedText.includes('avery-and-jordan') && !usedText.includes('k=') && (await page.locator('[data-edit-link]').count()) === 0 && (await page.locator('[data-start-choice]').count()) === 0,
  );
  check('second claim, another email: still one site', (await adapter.findSitesByOrderRef(ORDER)).length === 1);
  await page.locator('[data-start-my-link]').scrollIntoViewIfNeeded();
  await shot(page, '06b_order_used_390');
  await page.fill('#start-email', 'avery@example.test');

  // The two buttons of the choice, each in a fresh tab (sessionStorage is per tab: no stored result there).
  {
    const tab = await ctx.newPage();
    await tab.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
    await fillForm(tab, { order: ORDER, email: 'avery@example.test', names: ['Other', 'Pair'] });
    await tab.waitForSelector('[data-slug-available]');
    await tab.click('button[type="submit"]');
    await tab.waitForSelector('[data-start-open="avery-and-jordan"]');
    await tab.click('[data-start-open="avery-and-jordan"]');
    await tab.waitForURL(/\/edit\/avery-and-jordan\?k=/);
    check('choice "Open it": the order\'s website opens on this device', /\/edit\/avery-and-jordan\?k=/.test(tab.url()));
    await tab.close();
  }
  {
    const tab = await ctx.newPage();
    await tab.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
    await fillForm(tab, { order: ORDER, email: 'avery@example.test', names: ['Other', 'Pair'] });
    await tab.waitForSelector('[data-slug-available]');
    await tab.click('button[type="submit"]');
    await tab.waitForSelector('[data-start-add]');
    await tab.click('[data-start-add]');
    await tab.waitForSelector('[data-edit-link]');
    check('choice "Start another website with this design": a second website of the order', (await tab.inputValue('[data-edit-link]')).includes('/edit/other-and-pair?k='));
    const both = await adapter.findSitesByOrderRef(ORDER);
    check('the order now has 2 websites (units 1 and 2)', both.length === 2 && both.map((x) => x.orderSlot ?? 1).sort().join() === '1,2');
    await tab.close();
  }

  // New order, same names: the automatic address moves to "-2"; typing the taken one offers the free one.
  await fillForm(page, { order: '4821559032', names: ['Avery', 'Jordan'] });
  await page.waitForFunction(() => (document.getElementById('start-slug') as HTMLInputElement)?.value === 'avery-and-jordan-2', null, { timeout: 8000 });
  await page.waitForSelector('[data-slug-available]');
  const adjusted = await page.locator('[data-slug-available]').innerText();
  check('taken address: automatic one moves to -2', adjusted.includes('"avery-and-jordan" is taken'), adjusted);
  await page.locator('#start-slug').scrollIntoViewIfNeeded();
  await shot(page, '07_slug_adjusted_390');
  await page.fill('#start-slug', 'avery-and-jordan');
  const useButton = page.getByRole('button', { name: 'Use avery-and-jordan-2' });
  await useButton.waitFor();
  check('typed taken address: "already taken" + suggestion button', (await page.locator('main').innerText()).includes('This address is already taken.'));
  await shot(page, '07b_slug_taken_390');
  await useButton.click();
  check('suggestion button fills the address', (await page.inputValue('#start-slug')) === 'avery-and-jordan-2');
  await page.waitForSelector('[data-slug-available]');
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-edit-link]');
  check('second order: created at avery-and-jordan-2', (await page.inputValue('[data-edit-link]')).includes('/edit/avery-and-jordan-2?k='));

  check('no console or page errors', problems.length === 0, problems.join(' | '));
  check('no horizontal overflow at the end', (await overflow(page)) <= 0);
  const video = page.video();
  await ctx.close();
  videoPath = video ? await video.path() : null;

  // 2b. Lost answer: the site is created but the phone never hears back -> the form retries with the same claim
  //     token and still shows a working edit link (not "this order already has a website").
  {
    const lc = await browser.newContext(device);
    const lp = await lc.newPage();
    const lostProblems: string[] = [];
    lp.on('pageerror', (e: Error) => lostProblems.push(e.message));
    let dropped = 0;
    await lp.route('**/api/start', async (route: any) => {
      if (route.request().method() === 'POST' && dropped === 0) {
        dropped++;
        const res = await route.fetch(); // created on the server…
        check('lost answer: the server created the site (201)', res.status() === 201, String(res.status()));
        return route.abort('connectionreset'); // …but the answer is lost
      }
      return route.continue();
    });
    await lp.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
    await fillForm(lp, { order: '7712345600', email: 'rowan@example.test', names: ['Rowan', 'Sage'] });
    await lp.waitForSelector('[data-slug-available]');
    await lp.click('button[type="submit"]');
    await lp.waitForSelector('[data-edit-link]', { timeout: 15_000 }).catch(() => null);
    const lostLink = (await lp.locator('[data-edit-link]').count()) ? await lp.inputValue('[data-edit-link]') : '';
    check('lost answer: the form retried by itself and shows the edit link', /\/edit\/rowan-and-sage\?k=/.test(lostLink), lostLink.replace(/k=.*/, 'k=…') || (await lp.locator('main').innerText()).slice(0, 120));
    check('lost answer: still one site for the order', (await adapter.findSitesByOrderRef('7712345600')).length === 1);
    const lostKey = new URL(lostLink || 'http://x/').searchParams.get('k');
    const lostSite = await adapter.getSiteBySlug('rowan-and-sage');
    check('lost answer: the shown link opens the editor', Boolean(lostSite && lostKey && (await fetch(`${BASE}/edit/rowan-and-sage?k=${lostKey}`)).status === 200));
    check('lost answer: no page errors', lostProblems.length === 0, lostProblems.join(' | '));
    await lc.close();
  }

  // 3. Desktop: preview next to the form.
  const desk = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const dp = await desk.newPage();
  await dp.goto(`${BASE}/start?theme=${FIXTURE}`, { waitUntil: 'networkidle' });
  await dp.frameLocator('iframe').locator('body').waitFor();
  const fBox = await dp.locator('iframe').boundingBox();
  const formBox = await dp.locator('form').boundingBox();
  check('desktop: preview left of the form', fBox && formBox && fBox.x + fBox.width < formBox.x, JSON.stringify({ fBox, formBox }));
  await shot(dp, '08_desktop_1280', { jpeg: true });
  await desk.close();

  // 4. The real theme (G038), when it is on this branch.
  if (hasRealTheme) {
    // Another buyer on another phone: its own client address (x-forwarded-for, as Vercel's edge sets it). The flow above
    // already spent this connection's 10 /start attempts per 15 minutes (G951's choice adds "Open it" and "Start
    // another website" posts), and that limit is working as intended — it is not what this step checks.
    const rc = await browser.newContext({ ...device, extraHTTPHeaders: { 'x-forwarded-for': '203.0.113.40' } });
    const rp = await rc.newPage();
    const res = await rp.goto(`${BASE}/start?theme=${REAL_THEME}`, { waitUntil: 'networkidle' });
    const ok = res.status() === 200 && (await rp.locator('h1').innerText()) === 'Start your website';
    check(`${REAL_THEME}: start page with live demo`, ok);
    await rp.waitForTimeout(1500); // let the envelope scene settle in the mini preview
    await shot(rp, '09_blush_start_390', { jpeg: true });
    await fillForm(rp, { order: '4821559033', email: 'clara.demo@example.test', names: ['Elena', 'Marco'] });
    await rp.waitForSelector('[data-slug-available]');
    await rp.click('button[type="submit"]');
    await rp.waitForSelector('[data-edit-link]');
    await rp.click('[data-open-editor]');
    await rp.waitForSelector('[data-setup="1"]');
    check(`${REAL_THEME}: editor opens for the claimed site (setup step 1, names filled)`, (await rp.inputValue('#f-partners-0-display_name')) === 'Elena' && (await rp.inputValue('#f-partners-1-display_name')) === 'Marco');
    await shot(rp, '10_blush_editor_390');
    await rc.close();
  } else {
    notes.push(`platform/themes/${REAL_THEME} is not on this branch yet (G038): only the fixture theme was used.`);
  }
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

if (videoPath && existsSync(videoPath)) {
  const mp4 = path.join(OUT, 'start_flow_390.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', videoPath, '-vf', 'scale=390:844,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-movflags', '+faststart', '-an', mp4]);
  check('video: MP4 written', r.status === 0 && existsSync(mp4), r.status === 0 ? path.relative(ROOT, mp4) : String(r.stderr));
} else {
  check('video: recorded', false, 'no video file');
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify(
    { base: 'next start (production build)', viewport: '390x844 (isMobile, touch); desktop 1280x860', theme: FIXTURE, notes, checks },
    null,
    2,
  ) + '\n',
);
for (const dir of [dataDir, themesDir, videoDir]) rmSync(dir, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed; screenshots in ${path.relative(process.cwd(), OUT) || OUT}/ (${readdirSync(OUT).length} files)`);
for (const n of notes) console.log(`note: ${n}`);
