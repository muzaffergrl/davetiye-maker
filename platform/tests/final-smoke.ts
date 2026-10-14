// Final smoke test of the platform at 390 px (phone) with a real theme, production build (`next start`).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/final-smoke.ts [--theme <id>] [--out <dir>]
//
// --theme defaults to blush-garden-rose (G052); the demo site is the theme's own demo record with its PAKET 2 sample
// photos (scripts/lib/theme-env.ts). Selectors come from the standard (docs/11 §3), not from one design.
// Guest journey (seeded demo site with the fictional sample photos): closed envelope -> tap -> home -> Story ->
//   Details -> RSVP -> reply sent and stored.
// Buyer journey: /start?theme=<id> -> edit link -> panel (top, Photos: upload + crop) -> Publish ->
//   "Before you publish" notes -> Publish anyway -> live link + QR (decoded) -> public site 200 -> a guest reply on the
//   buyer's site shows in the panel. Skipped for internal themes (theme.json "internal": not on /start).
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data in a temp folder (platform/.data
// is not touched). Writes screenshots + checks.json to --out, else $FINAL_SHOTS_DIR, else previews/final/
// (blush-garden-rose), previews/g4NN/final/ (catalog design NN) or a temp folder. Exit code 1 on a failed check.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { COLLECTION_03, demoSlug, loadThemeEnv, ROOT, themeArgs, type ThemeEnv } from '../scripts/lib/theme-env.ts';

const PORT = Number(process.env.PORT || 3321);
const require = createRequire(import.meta.url);
const sharp: any = require('sharp');
const jsQR: any = require('jsqr');
const chromium = loadChromium();

let env: ThemeEnv;
let args: ReturnType<typeof themeArgs>;
try {
  args = themeArgs();
  env = loadThemeEnv(args);
} catch (e) {
  console.error(`final-smoke: ${(e as Error).message}`);
  process.exit(2);
}
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const THEME = env.id;
const OUT = args.out
  ? path.resolve(args.out)
  : process.env.FINAL_SHOTS_DIR ||
    (THEME === 'blush-garden-rose'
      ? path.join(ROOT, 'previews/final')
      : env.catalog
        ? path.join(ROOT, `previews/g4${String(env.catalog.no).padStart(2, '0')}/final`)
        : mkdtempSync(path.join(os.tmpdir(), `final-smoke-${THEME}-`)));
const HERO = Object.hasOwn(env.manifest.photos, 'hero_portrait') ? 'hero_portrait' : Object.keys(env.manifest.photos)[0];
// a fictional sample photo for the buyer's upload: the theme's own PAKET 2 portrait, else the 03 one
const PHOTO = (HERO && env.photoFiles[HERO]) || Object.values(env.photoFiles)[0] || path.join(COLLECTION_03, 'assets/gpt/photos/hero_portrait.jpg');
const demo = env.demo;
const names = demo.partners.map((p) => p.display_name);
const year = String(demo.date ?? '').slice(0, 4);
console.log(`theme ${THEME} · demo record ${env.demoSource} · photos ${env.photosSource || 'none'}`);
for (const n of env.notes) console.log(`NOTE  ${n}`);

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'final-smoke-data-'));
mkdirSync(OUT, { recursive: true });

// Seed the demo site (published, sample photos) into the temp folder, exactly like `npm run seed`.
const DEMO = demoSlug(demo);
const contentFile = path.join(dataDir, 'demo-content.json');
writeFileSync(contentFile, JSON.stringify(demo));
const seed = spawnSync(
  process.execPath,
  [path.join(ROOT, 'scripts/seed.ts'), '--theme', THEME, '--slug', DEMO, '--content', contentFile, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos'])],
  { cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local' }, encoding: 'utf8' },
);
if (seed.status !== 0) {
  console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`);
  process.exit(1);
}
const adapter = new LocalAdapter(dataDir);

const server = startNext({ port: PORT, dataDir, env: { DATA_ADAPTER: 'local' } });
const BASE = server.base;
// A hung step must not hang the run.
setTimeout(() => {
  console.error('final-smoke: still running after 8 minutes, stopped');
  server.stop();
  process.exit(1);
}, 480_000).unref();

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
const skipped: string[] = [];

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
/** Panel v2 (G060): each section is its own page (#edit/<id>); Guests and Share are views (#guests, #share). */
async function openSection(page: any, id: string) {
  await page.evaluate((h: string) => (window.location.hash = h), `#edit/${id}`);
  await page.waitForSelector(`#section-${id}-body`);
}
async function openView(page: any, view: string) {
  await page.evaluate((h: string) => (window.location.hash = h), `#${view}`);
  await page.waitForTimeout(150);
}
async function decodeQrFrom(locator: any): Promise<string | null> {
  const png = await locator.screenshot();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
}
/** Throws a readable error when a standard element is missing (instead of a timeout). */
async function need(page: any, sel: string, what: string) {
  if (!(await page.$(sel))) throw new Error(`no ${sel} — ${what}`);
}
/** One journey: a missing element fails it with its message; the next journey still runs. */
async function journey(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    check(`${label}: run`, false, String((e as Error)?.message ?? e).split('\n')[0]);
  }
}

let browser: any;
try {
  await waitForServer(`${BASE}/`, 30_000, server);
  browser = await chromium.launch();
  const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
  const hasStory = demo.optional_blocks?.our_story === true;
  const rsvpOn = !demo.rsvp?.method;

  // ---------------------------------------------------------------- guest journey (seeded demo site)
  await journey('guest', async () => {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(10_000);
    const page = await ctx.newPage();
    const problems = watch(page);
    const res = await page.goto(`${BASE}/${DEMO}`, { waitUntil: 'load' });
    check('guest: envelope page 200', res.status() === 200, String(res.status()));
    await page.waitForTimeout(1500);
    check('guest: envelope has no horizontal overflow', (await overflow(page)) <= 0);
    check('guest: envelope names from the content record', (await page.locator('body').innerText()).includes(names[0]));
    await shot(page, '01_guest_envelope_390');

    await need(page, '.stage', 'the envelope stage (role=button, docs/11 §3.2)');
    await page.click('.stage');
    await page.waitForURL(`${BASE}/${DEMO}/home`, { timeout: 9000 });
    check('guest: tap on the envelope opens /home', true);
    await page.waitForTimeout(5200); // card entrance
    await revealAll(page);
    const home = await page.locator('body').innerText();
    check('guest: home shows names, date and venue', names.every((n) => home.includes(n)) && home.includes(year), home.replace(/\s+/g, ' ').slice(0, 120));
    check('guest: home has no broken images', (await brokenImages(page)).length === 0, (await brokenImages(page)).join(', '));
    check('guest: home has no horizontal overflow', (await overflow(page)) <= 0);
    check('guest: no "Your photo here" label for guests', !/Your photo here/i.test(home));
    await shot(page, '02_guest_home_390', { fullPage: true });

    if (hasStory) {
      await need(page, '.site-nav a[href$="/story"]', 'the Story link of nav.site-nav (docs/11 §3.1)');
      await page.click('.site-nav a[href$="/story"]');
      await page.waitForURL(`${BASE}/${DEMO}/story`, { timeout: 6000 });
      await revealAll(page);
      check('guest: story page via the nav', (await page.locator('body').innerText()).length > 50);
      check('guest: story has no broken images / overflow', (await brokenImages(page)).length === 0 && (await overflow(page)) <= 0);
      await shot(page, '03_guest_story_390', { fullPage: true });
    } else skipped.push('guest story page (our_story is off in the demo record)');

    await need(page, '.site-nav a[href$="/details"]', 'the Details link of nav.site-nav (docs/11 §3.1)');
    await page.click('.site-nav a[href$="/details"]');
    await page.waitForURL(`${BASE}/${DEMO}/details`, { timeout: 6000 });
    await revealAll(page);
    const details = await page.locator('body').innerText();
    check('guest: details shows the schedule time as "4:00 PM"-style', /\d{1,2}:\d{2}\s?(AM|PM)/i.test(details));
    check('guest: details has no broken images / overflow', (await brokenImages(page)).length === 0 && (await overflow(page)) <= 0);
    await shot(page, '04_guest_details_390', { fullPage: true });

    if (rsvpOn) {
      await need(page, '.site-nav a[href$="/rsvp"]', 'the RSVP link of nav.site-nav (docs/11 §3.1)');
      await page.click('.site-nav a[href$="/rsvp"]');
      await page.waitForURL(`${BASE}/${DEMO}/rsvp`, { timeout: 6000 });
      await revealAll(page);
      check('guest: RSVP page has the form', (await page.locator('[data-rsvp-form]').count()) === 1);
      check('guest: RSVP page has no overflow', (await overflow(page)) <= 0);
      await shot(page, '05_guest_rsvp_390', { fullPage: true });

      await need(page, '[data-rsvp] [data-rsvp-form]', 'the reply form (docs/11 §3.3)');
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
      await page.locator('[data-rsvp]').scrollIntoViewIfNeeded();
      await shot(page, '06_guest_rsvp_sent_390');
    } else skipped.push('guest RSVP (the demo record collects replies another way)');
    check('guest: no console or page errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  });

  // ---------------------------------------------------------------- buyer journey (/start -> panel -> publish)
  if (env.internal) {
    skipped.push('buyer journey: internal theme (theme.json "internal": true) is not offered on /start');
    console.log('SKIP  buyer journey: internal theme (not on /start)');
  } else await journey('buyer', async () => {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(10_000);
    const page = await ctx.newPage();
    const problems = watch(page);
    const res = await page.goto(`${BASE}/start?theme=${THEME}`, { waitUntil: 'networkidle' });
    check('buyer: /start page 200 with title', res.status() === 200 && (await page.locator('h1').innerText()) === 'Start your website');
    check('buyer: design name shown', (await page.locator('main').innerText()).includes(env.manifest.name), env.manifest.name);
    await page.frameLocator('iframe').locator('body').waitFor();
    await page.waitForTimeout(1800); // envelope scene in the mini preview
    check('buyer: /start has no horizontal overflow', (await overflow(page)) <= 0);
    await shot(page, '07_buyer_start_390');

    const ORDER = '5550012345'; // fictional
    const two = (await page.locator('#start-name2').count()) > 0;
    await page.fill('#start-order', ORDER);
    await page.fill('#start-email', 'elena.demo@example.test');
    await page.fill('#start-name1', 'Elena');
    if (two) await page.fill('#start-name2', 'Marco');
    await page.waitForSelector('[data-slug-available]');
    const SLUG = two ? 'elena-and-marco' : 'elena';
    check('buyer: address follows the names', (await page.inputValue('#start-slug')) === SLUG);
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-edit-link]', { timeout: 15_000 });
    const editUrl = await page.inputValue('[data-edit-link]');
    check('buyer: edit link shown', new RegExp(`/edit/${SLUG}\\?k=[A-Za-z0-9_-]{43}$`).test(editUrl), editUrl.replace(/k=.*/, 'k=…'));
    check('buyer: site not public before Publish', (await fetch(`${BASE}/${SLUG}`)).status === 404);
    await shot(page, '08_buyer_edit_link_390', { png: true });

    await page.click('[data-open-editor]');
    await page.waitForURL(new RegExp(`/edit/${SLUG}\\?k=.*#setup/1$`));
    await page.waitForSelector('[data-setup="1"]');
    check('buyer: the editor opens the setup at step 1 with the names (G060)', (await page.inputValue('#f-partners-0-display_name')) === 'Elena');
    check('buyer: panel draft status', (await page.getAttribute('[data-panel]', 'data-status')) === 'draft');
    check('buyer: setup has no horizontal overflow', (await overflow(page)) <= 0);
    await shot(page, '09_buyer_setup_390', { png: true });
    // Save & exit -> the editor's Home (this smoke test then uses the editor views).
    await page.click('[data-setup-exit]');
    await page.waitForSelector('[data-status-card]');
    check('buyer: Home shows the names', (await page.locator('[data-panel] h1').first().innerText()) === (two ? 'Elena & Marco' : 'Elena'));
    check('buyer: panel has no horizontal overflow', (await overflow(page)) <= 0);
    const bar = await page.locator('[data-publish]').boundingBox();
    check('buyer: Publish button in the top bar, >= 44 px', bar && bar.y >= 0 && bar.y + bar.height <= 70 && bar.height >= 44, JSON.stringify(bar));
    await shot(page, '09b_buyer_panel_home_390', { png: true });

    // Photos: upload + crop the portrait of the invitation card.
    const slots = Object.keys(env.manifest.photos).length;
    await openSection(page, 'photos');
    await page.setInputFiles(`input[data-slot="${HERO}"]`, PHOTO);
    await page.waitForSelector('[data-testid="cropper"] img');
    await page.click('[data-crop-confirm]');
    await page.waitForSelector(`[data-photo-slot="${HERO}"] img`, { timeout: 20_000 });
    await waitSaved(page);
    check(`buyer: photo uploaded (1 of ${slots} photos)`, (await page.locator('[data-section="photos"]').innerText()).includes(`1 of ${slots} photos`));
    await page.evaluate(() => window.scrollTo(0, 0));
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
      // G060-fix: with the design's sample date still in, the first publish waits for an explicit confirmation.
      const confirmDate = page.locator('[data-testid="notes"] [data-confirm-sample-date]');
      if (await confirmDate.count()) {
        check('buyer: the sample date holds the first publish until confirmed', await anyway.isDisabled());
        await confirmDate.click();
      }
      await anyway.click();
    }
    await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
    const PUBLIC_URL = `${BASE}/${SLUG}`;
    check('buyer: "Your website is live"', (await page.locator('[data-testid="live"] h2').innerText()) === 'Your website is live');
    check('buyer: public link shown', (await page.locator('[data-live-link]').getAttribute('href')) === PUBLIC_URL);
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
    await need(guest, '[data-skip]', 'the Skip link of the envelope page (docs/11 §3.2)');
    await guest.click('[data-skip]');
    await guest.waitForURL(`${PUBLIC_URL}/home`, { timeout: 6000 });
    await guest.waitForTimeout(800);
    const guestHome = await guest.locator('body').innerText();
    check('buyer site: home shows the buyer names', /Elena/.test(guestHome) && (!two || /Marco/.test(guestHome)));
    const heroSrc = await guest.evaluate((key: string) => (document.querySelector(`img[data-photo="${key}"]`) as HTMLImageElement | null)?.getAttribute('src') ?? null, HERO);
    check('buyer site: uploaded portrait is public after publishing', Boolean(heroSrc && heroSrc.startsWith('/media/') && !heroSrc.includes('preview=')), String(heroSrc));
    check('buyer site: no "Your photo here" label', !/Your photo here/i.test(guestHome));
    if (rsvpOn) {
      await guest.goto(`${PUBLIC_URL}/rsvp`, { waitUntil: 'load' });
      await guest.waitForTimeout(1500);
      await guest.fill('[data-rsvp-form] [name="name"]', 'Ben Fictional');
      await guest.check('[data-rsvp-form] [name="attending"][value="no"]');
      await guest.click('[data-rsvp-form] button[type="submit"]');
      await guest.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 }).catch(() => null);
      check('buyer site: guest reply sent', await guest.evaluate(() => !(document.querySelector('[data-rsvp-state="success"]') as HTMLElement).hidden));
    }
    check('buyer site: no console or page errors', guestProblems.length === 0, guestProblems.join(' | '));
    await guest.close();

    await page.bringToFront();
    if (rsvpOn) {
      await openView(page, 'guests');
      await page.click('[data-refresh-replies]');
      await page.waitForSelector('[data-reply]', { timeout: 8000 }).catch(() => null);
      const replies = await page.locator('[data-replies]').innerText().catch(() => '');
      check('buyer: the reply shows in the panel', replies.includes('Ben Fictional'), replies.replace(/\s+/g, ' ').slice(0, 120));
    }
    check('buyer: panel has no overflow at the end', (await overflow(page)) <= 0);
    check('buyer: no console or page errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  });
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.stop();
}

writeFileSync(
  path.join(OUT, 'checks.json'),
  JSON.stringify(
    {
      base: 'next start (production build), local adapter, seeded demo',
      viewport: '390x844 (isMobile, touch, DPR 2)',
      theme: THEME,
      setup: { demo_record: env.demoSource, photos: env.photosSource || null, notes: env.notes, skipped },
      checks,
    },
    null,
    2,
  ) + '\n',
);
rmSync(dataDir, { recursive: true, force: true });
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} of ${checks.length} check(s) failed (theme ${THEME}).\n--- server log ---\n${server.log().slice(-4000)}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed (theme ${THEME}${skipped.length ? `; skipped: ${skipped.join('; ')}` : ''}); screenshots in ${path.relative(process.cwd(), OUT) || OUT}/`);
