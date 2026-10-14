// Real screenshots + opening recording of one platform theme for the Etsy listing kit and the START HERE guide (G059).
// Driven by tools/listing_kit.py (`capture` step); can be run by hand:
//
//   cd platform && npm ci && npm run build          (once)
//   NODE_PATH=/opt/node22/lib/node_modules node tools/listing_templates/capture.ts --theme <id> --out <dir> \
//        [--public-url https://davetiye-platform-five.vercel.app] [--port 3331]
//
// What it does (local production build `next start`, local adapter, temp data folder; nothing is deployed, nothing is
// sent to the live site):
//   1. Seeds the theme's own demo record (fictional names, PAKET 2 sample photos) as a published site, plus three
//      sample questions & answers and one RSVP question ("Meal choice") so these features show. Posts four fictional
//      guest replies through the public RSVP API.
//   2. Guest screens at 390 × 844 (isMobile, touch, DPR 3): envelope, home, story, details, Q&A, RSVP.
//   3. Buyer screens (DPR 3): /start, form, edit link (the private key is masked in the picture), panel, photo crop,
//      photos, preview, "Before you publish", live link + QR (QR blurred: it would point at a site that only exists in
//      this local run), and the RSVP replies of the seeded site in its panel.
//   4. The opening (tap → envelope opens → home → invitation card) recorded at 390 × 844 → opening.webm.
// PLATFORM_PUBLIC_URL = --public-url, so addresses in the screens read like the real ones (the live base URL).
// Writes <out>/<name>.jpg, <out>/opening.webm, <out>/capture.json (what was captured, settings, checks).
// Exit code 1 when a step fails (the files written so far stay).

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, '../../platform');
const { loadChromium, startNext, waitForServer } = await import(path.join(PLATFORM, 'scripts/lib/browser.ts'));
const { loadThemeEnv, demoSlug } = await import(path.join(PLATFORM, 'scripts/lib/theme-env.ts'));

function arg(name: string, def: string | null = null): string | null {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.slice(name.length + 3) : def;
}
const THEME = arg('theme');
const OUT = arg('out');
const PUBLIC_URL = (arg('public-url', 'https://davetiye-platform-five.vercel.app') as string).replace(/\/+$/, '');
/** A free local port (other agents' servers often hold the usual ones). */
async function freePort(): Promise<number> {
  const net = await import('node:net');
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const p = (s.address() as { port: number }).port;
      s.close(() => resolve(p));
    });
  });
}
const PORT = Number(arg('port', process.env.PORT || '')) || (await freePort());
if (!THEME || !OUT) {
  console.error('usage: capture.ts --theme <id> --out <dir> [--public-url <url>] [--port <n>]');
  process.exit(2);
}
if (!existsSync(path.join(PLATFORM, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` in platform/ first.');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });
const env = loadThemeEnv({ theme: THEME });
const chromium = loadChromium();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ demo site (published, sample photos, Q&A, question)
const demo = structuredClone(env.demo);
demo.optional_blocks = { ...demo.optional_blocks, faq: true };
demo.faq = [
  { q: 'Is there parking at the venue?', a: 'Yes, free parking next to the main house.\nThe gate opens at 3:00 PM.' },
  { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only celebration so everyone can relax and dance.' },
  { q: 'What happens if it rains?', a: 'The ceremony moves indoors. Same time, same flowers.' },
];
demo.rsvp = { ...demo.rsvp, questions: [{ id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] }] };
const SLUG = demoSlug(demo);
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'listing-capture-data-'));
const contentFile = path.join(dataDir, 'demo-content.json');
writeFileSync(contentFile, JSON.stringify(demo));
const seed = spawnSync(
  process.execPath,
  [path.join(PLATFORM, 'scripts/seed.ts'), '--theme', THEME, '--slug', SLUG, '--content', contentFile, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos'])],
  { cwd: PLATFORM, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL }, encoding: 'utf8' },
);
if (seed.status !== 0) {
  console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`);
  process.exit(1);
}
const keys = JSON.parse(readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8'));
const DEMO_EDIT_KEY: string = keys.editKey;

const server = startNext({ port: PORT, dataDir, env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL } });
const BASE = server.base;
setTimeout(() => {
  console.error('capture: still running after 10 minutes, stopped');
  server.stop();
  process.exit(1);
}, 600_000).unref();

const shots: Array<{ name: string; what: string }> = [];
const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
/** Particle layers (falling petals/leaves, JS) are hidden in still pictures, as in theme-check: a petal frozen over a
 *  word reads as a defect in a photo. They stay in the recording. */
const PARTICLES = '.petal-layer, .accent-layer';
async function shot(page: any, name: string, what: string) {
  await page.evaluate((sel: string) => document.querySelectorAll(sel).forEach((e) => ((e as HTMLElement).style.visibility = 'hidden')), PARTICLES);
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT as string, `${name}.jpg`), type: 'jpeg', quality: 88 });
  shots.push({ name: `${name}.jpg`, what });
  console.log(`shot  ${name}.jpg — ${what}`);
}
/** Scroll through the page so scroll-triggered entrances run, then back to the top. */
async function revealAll(page: any) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 240) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 110));
    }
  });
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
}
async function centerOn(page: any, sel: string, block: 'center' | 'start' = 'center', offset = 0, settle = 2600) {
  // one instant scroll to the target (the themes use `scroll-behavior: smooth`: a second smooth scroll right after
  // scrollIntoView would cancel the first one)
  await page.evaluate(({ s, b, o }: { s: string; b: string; o: number }) => {
    const el = document.querySelector(s);
    if (!el) throw new Error(`no ${s}`);
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY - (b === 'center' ? (window.innerHeight - r.height) / 2 : 0) + o;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  }, { s: sel, b: block, o: offset });
  await page.waitForTimeout(settle);
}
async function waitSaved(page: any) {
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') !== 'saved', null, { timeout: 1500 }).catch(() => undefined);
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
}
async function openSection(page: any, id: string) {
  const button = page.locator(`#section-${id}`);
  if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
  await page.evaluate((i: string) => {
    const el = document.getElementById(`section-${i}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'instant' });
  }, id);
  await page.waitForTimeout(400);
}

let browser: any;
let failed = false;
const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const HERO = Object.hasOwn(env.manifest.photos, 'hero_portrait') ? 'hero_portrait' : Object.keys(env.manifest.photos)[0];
const PHOTO = env.photoFiles[HERO] ?? Object.values(env.photoFiles)[0];
try {
  await waitForServer(`${BASE}/`, 40_000, server);
  // /dev/shm is small in containers: DPR 3 pages of 03 crashed the renderer twice without this flag
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });

  // fictional guest replies (public RSVP API, like a guest's phone)
  const replies = [
    { name: 'Olivia Bennett', email: '', attending: 'yes', guests: 2, message: 'We would not miss it!', answers: { meal: 'Fish' } },
    { name: 'Marcus Reed', email: '', attending: 'yes', guests: 1, message: '', answers: { meal: 'Vegetarian' } },
    { name: 'Hannah Clarke', email: '', attending: 'no', guests: 0, message: 'So sorry to miss it. Sending love!', answers: {} },
    { name: 'The Alvarez Family', email: '', attending: 'yes', guests: 4, message: 'Counting the days.', answers: { meal: 'Chicken' } },
  ];
  for (const r of replies) {
    const res = await fetch(`${BASE}/api/rsvp/${SLUG}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...r, website: '' }) });
    check(`reply stored: ${r.name}`, res.status === 200, String(res.status));
    await sleep(150);
  }

  // ---------------------------------------------------------------- guest screens
  {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(12_000);
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}/${SLUG}`, { waitUntil: 'load' });
    check('guest: envelope page 200', res.status() === 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);
    await shot(page, 'g01_envelope', 'Guest: the closed envelope page (/<names>)');
    await page.tap('.stage');
    await page.waitForURL(`${BASE}/${SLUG}/home`, { timeout: 10_000 });
    await page.waitForTimeout(5600);
    await shot(page, 'g02_home_top', 'Guest: home, first screen after the envelope opens');
    await revealAll(page);
    // the invitation card = the painted card holding the full names
    // the invitation card = where the full names are (docs/11: the card shows partners.N.full_name)
    // (centred on the card that holds them: the smallest ancestor at least 400 px tall, if it fits the screen)
    const cardSel = await page.evaluate(() => {
      const el = [...document.querySelectorAll('[data-field="partners.0.full_name"], [data-field="partners.1.full_name"]')].find((e) => (e as HTMLElement).offsetParent);
      if (!el) return null;
      let host: Element = el;
      while (host.parentElement && host.parentElement !== document.body && host.getBoundingClientRect().height < 400) host = host.parentElement;
      if (host.getBoundingClientRect().height > innerHeight * 0.95) host = el;
      host.setAttribute('data-lk-card', '');
      return '[data-lk-card]';
    });
    if (cardSel) {
      await centerOn(page, cardSel, 'center', 0, 3000);
      await shot(page, 'g03_home_invitation', 'Guest: home, the invitation card');
    } else check('guest: invitation card found', false);
    if (await page.$('a[data-calendar]')) {
      await centerOn(page, 'a[data-calendar]', 'center', -80, 2400);
      await shot(page, 'g04_home_calendar', 'Guest: home, reply-by + add to calendar');
    }
    await page.goto(`${BASE}/${SLUG}/story`, { waitUntil: 'load' });
    await page.waitForTimeout(3800);
    await shot(page, 'g05_story', 'Guest: Our Story page');
    await page.goto(`${BASE}/${SLUG}/details`, { waitUntil: 'load' });
    await page.waitForTimeout(3600);
    await shot(page, 'g06_details_top', 'Guest: Details page, first screen');
    await revealAll(page);
    const sched = await page.$('[data-repeat-item^="schedule."]');
    if (sched) {
      await centerOn(page, '[data-repeat-item^="schedule."]', 'center', 60, 2600);
      await shot(page, 'g07_details_schedule', 'Guest: Details, order of the day');
    }
    const faq = 'details[data-repeat-item^="faq."]';
    if (await page.$(faq)) {
      await page.evaluate((s: string) => ((document.querySelector(s) as HTMLDetailsElement).open = true), faq);
      await centerOn(page, faq, 'start', -150, 2000);
      await shot(page, 'g08_details_faq', 'Guest: Details, questions & answers (first one open)');
    } else check('guest: Q&A block on details', false);
    await page.goto(`${BASE}/${SLUG}/rsvp`, { waitUntil: 'load' });
    await page.waitForTimeout(3600);
    await shot(page, 'g09_rsvp_top', 'Guest: RSVP page, first screen');
    await revealAll(page);
    await page.fill('[data-rsvp-form] [name="name"]', 'Ada Fictional');
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.fill('[data-rsvp-form] [name="guests"]', '2');
    const meal = page.locator('fieldset[data-rsvp-question="meal"] label').filter({ hasText: 'Fish' });
    if (await meal.count()) await meal.first().click();
    await centerOn(page, '[data-rsvp-form] [name="attending"]', 'start', -120, 1200);
    await shot(page, 'g10_rsvp_form', 'Guest: RSVP form with the couple\'s question (Meal choice)');
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 }).catch(() => null);
    const sent = await page.evaluate(() => !(document.querySelector('[data-rsvp-state="success"]') as HTMLElement | null)?.hidden);
    check('guest: reply sent ("thank you")', sent);
    await centerOn(page, '[data-rsvp]', 'center', 0, 1500);
    await shot(page, 'g11_rsvp_sent', 'Guest: RSVP sent');
    await ctx.close();
  }

  // ---------------------------------------------------------------- the public demo of the design (what /start and the
  // listing's "live demo" show: sample names, placeholder photos)
  {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(12_000);
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}/start/demo/${THEME}/home?preview=demo`, { waitUntil: 'load' });
    check('demo: /start/demo/<theme>/home 200', res.status() === 200);
    await page.waitForTimeout(5200);
    await shot(page, 'd01_demo_home', 'Public demo of the design: home (sample names, placeholder photos)');
    await ctx.close();
  }

  // ---------------------------------------------------------------- buyer: /start -> panel -> publish
  {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(12_000);
    const page = await ctx.newPage();
    const res = await page.goto(`${BASE}/start?theme=${THEME}`, { waitUntil: 'networkidle' });
    check('buyer: /start 200', res.status() === 200);
    await page.frameLocator('iframe').locator('body').waitFor();
    await page.waitForTimeout(2600);
    await shot(page, 'b01_start', 'Buyer: /start page (design preview)');
    await page.fill('#start-order', '5550012345');
    await page.fill('#start-email', 'elena.demo@example.test');
    await page.fill('#start-name1', 'Elena');
    const two = (await page.locator('#start-name2').count()) > 0;
    if (two) await page.fill('#start-name2', 'Marco');
    await page.waitForSelector('[data-slug-available]');
    await centerOn(page, '#start-email', 'start', -90, 600);
    await shot(page, 'b02_start_form', 'Buyer: /start form filled (fictional order number)');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-edit-link]', { timeout: 15_000 });
    const editUrl: string = await page.inputValue('[data-edit-link]');
    check('buyer: edit link uses the public base URL', editUrl.startsWith(`${PUBLIC_URL}/edit/`), editUrl.replace(/k=.*/, 'k=…'));
    // mask the private key in the picture only
    await page.evaluate(() => {
      const el = document.querySelector('[data-edit-link]') as HTMLInputElement | HTMLTextAreaElement;
      el.value = el.value.replace(/k=[A-Za-z0-9_-]+/, 'k=••••••••••••••••');
    });
    await shot(page, 'b03_edit_link', 'Buyer: "Save this link" (key masked in this picture)');
    const localEdit = editUrl.replace(PUBLIC_URL, BASE);
    await page.goto(localEdit, { waitUntil: 'load' });
    await page.waitForSelector('[data-panel]');
    await page.waitForTimeout(800);
    await shot(page, 'b04_panel_top', 'Buyer: editor, top (draft, Couple section)');
    await openSection(page, 'date');
    await shot(page, 'b05_panel_date', 'Buyer: editor, Date & time section');
    await openSection(page, 'photos');
    await page.setInputFiles(`input[data-slot="${HERO}"]`, PHOTO);
    await page.waitForSelector('[data-testid="cropper"] img');
    await page.waitForTimeout(900);
    await shot(page, 'b06_panel_crop', 'Buyer: editor, cropping a photo to the design\'s shape');
    await page.click('[data-crop-confirm]');
    await page.waitForSelector(`[data-photo-slot="${HERO}"] img`, { timeout: 25_000 });
    await waitSaved(page);
    await openSection(page, 'photos');
    await shot(page, 'b07_panel_photos', 'Buyer: editor, Photos section after the upload');
    await page.click('[data-open-preview]');
    await page.waitForTimeout(4500);
    await shot(page, 'b08_panel_preview', 'Buyer: editor, preview of the draft');
    await page.click('[data-close-preview]').catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(600);
    await page.click('[data-publish]');
    await page.waitForSelector('[data-testid="live"], [data-testid="notes"]', { timeout: 15_000 });
    if (await page.locator('[data-testid="notes"]').count()) {
      await shot(page, 'b09_publish_notes', 'Buyer: "Before you publish" (sample text still in place)');
      const anyway = page.locator('[data-publish-anyway]');
      await anyway.scrollIntoViewIfNeeded();
      await anyway.click();
    }
    await page.waitForSelector('[data-testid="live"]', { timeout: 15_000 });
    const live = await page.locator('[data-live-link]').innerText();
    check('buyer: live link = public base URL + address', live === `${PUBLIC_URL}/${two ? 'elena-and-marco' : 'elena'}`, live);
    await page.addStyleTag({ content: '[data-testid="live"] svg[role="img"] { filter: blur(7px); }' });
    await page.locator('[data-testid="live"] svg[role="img"]').scrollIntoViewIfNeeded();
    await shot(page, 'b10_live_qr', 'Buyer: "Your website is live" + QR (QR blurred in this picture)');
    await ctx.close();
  }

  // ---------------------------------------------------------------- panel of the seeded site: RSVP replies + questions
  {
    const ctx = await browser.newContext(device);
    ctx.setDefaultTimeout(12_000);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/edit/${SLUG}?k=${DEMO_EDIT_KEY}`, { waitUntil: 'load' });
    await page.waitForSelector('[data-panel]');
    await openSection(page, 'rsvp');
    await page.click('[data-refresh-replies]').catch(() => undefined);
    await page.waitForSelector('[data-replies] li', { timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
    await centerOn(page, '[data-replies]', 'start', -110, 500);
    const listed = await page.locator('[data-replies]').innerText().catch(() => '');
    check('panel: replies listed', listed.includes('Olivia Bennett') && listed.includes('Ada Fictional'), listed.replace(/\s+/g, ' ').slice(0, 100));
    await shot(page, 'p01_panel_replies', 'Couple: editor, RSVP replies with counts');
    const csv = page.getByText('Download all replies (CSV)');
    if (await csv.count()) {
      await csv.first().evaluate((el: Element) => el.setAttribute('data-lk-csv', ''));
      await centerOn(page, '[data-lk-csv]', 'center', 120, 500);
      await shot(page, 'p02_panel_csv', 'Couple: editor, CSV download of all replies');
    }
    if (await page.$('[data-rsvp-questions]')) {
      await centerOn(page, '[data-rsvp-questions]', 'start', -12, 500);
      await shot(page, 'p03_panel_questions', 'Couple: editor, questions for your guests');
    }
    const res = await fetch(`${BASE}/api/rsvp/${SLUG}/export`, { headers: { authorization: `Bearer ${DEMO_EDIT_KEY}` } });
    const text = (await res.text()).replace(/^﻿/, '');
    writeFileSync(path.join(OUT as string, 'replies_sample.csv'), text);
    check('panel: CSV export has the replies and the Meal choice column', res.status === 200 && /"Meal choice"/.test(text) && text.includes('Olivia Bennett'), String(res.status));
    await ctx.close();
  }

  // ---------------------------------------------------------------- opening recording (390 × 844)
  // Playwright records CSS pixels: a larger `size` (or a higher deviceScaleFactor) only pads the frames, it does not
  // sharpen them (tried: DPR 2 + 780 × 1688 gave the 390 × 844 picture in a grey frame). The listing video shows the
  // screen at 444 × 960, a 1.14× scale of this recording.
  {
    const vdir = mkdtempSync(path.join(os.tmpdir(), 'listing-capture-video-'));
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, recordVideo: { dir: vdir, size: { width: 390, height: 844 } } });
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto(`${BASE}/${SLUG}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const leadIn = (Date.now() - t0 + 150) / 1000;
    // timing tuned so the listing clip (≤ 14.5 s from the first painted frame) ends on the finished invitation card
    await page.waitForTimeout(1200);
    await page.tap('.stage');
    await page.waitForURL(`${BASE}/${SLUG}/home`, { timeout: 10_000 });
    await page.waitForTimeout(2800);
    const target = await page.evaluate(() => {
      const el = [...document.querySelectorAll('[data-field="partners.0.full_name"], [data-field="partners.1.full_name"]')].find((e) => (e as HTMLElement).offsetParent);
      return el ? el.getBoundingClientRect().top + scrollY - innerHeight * 0.42 : document.documentElement.scrollHeight * 0.3;
    });
    await page.evaluate(async ([y, ms]: number[]) => {
      const y0 = window.scrollY, t = performance.now();
      await new Promise<void>((res) => { (function f(n: number) { const k = Math.min(1, (n - t) / ms); const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; window.scrollTo({ top: y0 + (y - y0) * e, behavior: 'instant' }); if (k < 1) requestAnimationFrame(f); else res(); })(t); });
    }, [target, 1400]);
    await page.waitForTimeout(3600);
    const vpath = await page.video().path();
    await ctx.close();
    copyFileSync(vpath, path.join(OUT as string, 'opening.webm'));
    rmSync(vdir, { recursive: true, force: true });
    writeFileSync(path.join(OUT as string, 'opening.json'), JSON.stringify({ lead_in_s: Number(leadIn.toFixed(2)), size: '390x844', content: '390x844' }, null, 2) + '\n');
    check('recording: opening.webm written', existsSync(path.join(OUT as string, 'opening.webm')));
  }
} catch (e) {
  failed = true;
  check('run', false, String((e as Error)?.stack ?? e).split('\n').slice(0, 3).join(' | '));
} finally {
  if (browser) await browser.close();
  server.stop();
}

writeFileSync(
  path.join(OUT, 'capture.json'),
  JSON.stringify(
    {
      tool: 'tools/listing_templates/capture.ts (G059)',
      theme: THEME,
      date: new Date().toISOString().slice(0, 10),
      server: 'next start (local production build of this checkout), local adapter, temp data folder',
      public_url_shown: PUBLIC_URL,
      viewport: '390x844, isMobile, touch, DPR 3 (screens) / 390x844 (recording)',
      demo_site: `/${SLUG} — the theme's demo record (fictional) + 3 sample Q&A + 1 RSVP question; sample photos: ${env.photosSource || 'none'}`,
      buyer_site: 'Elena & Marco, order 5550012345, elena.demo@example.test (fictional)',
      notes: ['edit key masked in b03_edit_link.jpg', 'QR blurred in b10_live_qr.jpg (local-only site)', `particle layers (${PARTICLES}) hidden in the stills, not in the recording`, ...env.notes],
      shots,
      checks,
    },
    null,
    2,
  ) + '\n',
);
rmSync(dataDir, { recursive: true, force: true });
const bad = checks.filter((c) => !c.ok);
if (failed || bad.length) {
  console.error(`\n${bad.length} check(s) failed.\n--- server log ---\n${server.log().slice(-3000)}`);
  process.exit(1);
}
console.log(`\ncapture: ${shots.length} screens + opening.webm in ${OUT}`);
void readdirSync;
