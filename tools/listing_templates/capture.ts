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
//   2. Guest screens at 390 × 844 (isMobile, touch, DPR 3): envelope, home, story, details (schedule, venue, Q&A), RSVP.
//   3. The public demo of the design (d01). (Buyer/editor screens: G065 moved them to gm03/capture.ts, panel v2.)
//   Every still is checked by clearEdges(): nothing cut by the top edge or by the bottom bar, nothing behind a
//   see-through menu; the page is moved a little, or the picture cut shorter, when needed.
//   4. The opening (tap → envelope opens → home → invitation card) recorded at 390 × 844 → opening.webm.
// PLATFORM_PUBLIC_URL = --public-url, so addresses in the screens read like the real ones (the live base URL).
// Writes <out>/<name>.jpg, <out>/opening.webm, <out>/capture.json (what was captured, settings, checks).
// Exit code 1 when a step fails (the files written so far stay).

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

type Clip = { x: number; y: number; width: number; height: number };
type EdgeOpts = { scroll?: boolean; keep?: string[]; deltas?: number[] };
/**
 * What a still picture must not show (G059 review): text or form fields cut by the top edge of the screen, or — when the
 * bottom menu lets the page show through (theme 01's menu has no blur) — text or photos behind the menu's labels, which
 * read as letters printed over each other.
 * Returns the problems at the current scroll position, plus whether every `keep` element is fully on screen.
 */
function edgeState(keep: string[]) {
  const vh = innerHeight;
  const fixed = (el: Element | null) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const p = getComputedStyle(e).position;
      if (p === 'fixed' || p === 'sticky') return true;
    }
    return false;
  };
  const shown = (el: Element) => (el as any).checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true;
  // the bottom bar: a fixed/sticky box across the screen, touching its bottom edge
  let bar: DOMRect | null = null;
  let barEl: Element | null = null;
  let seeThrough = false;
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < vh - 2 || r.height > 220 || r.height < 24 || r.width < innerWidth * 0.9 || !shown(el)) continue;
    if (!bar || r.top < bar.top) {
      bar = r;
      barEl = el;
      const alpha = Number((cs.backgroundColor.match(/rgba?\(([^)]+)\)/)?.[1].split(',')[3] ?? '1').trim());
      const blur = (cs.backdropFilter && cs.backdropFilter !== 'none') || ((cs as any).webkitBackdropFilter && (cs as any).webkitBackdropFilter !== 'none');
      seeThrough = !blur && !(alpha >= 0.97 && cs.backgroundImage === 'none');
    }
  }
  const navTop = bar ? bar.top : vh;
  // where the bar's own labels are (a see-through bar fades in above them: page text there still reads normally)
  let labelsTop = navTop;
  if (barEl) {
    const w = document.createTreeWalker(barEl, NodeFilter.SHOW_TEXT);
    let top = Infinity;
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.height > 2) top = Math.min(top, q.top);
    }
    if (top !== Infinity) labelsTop = Math.max(navTop, top - 10);
  }
  const boxes: Array<{ kind: string; top: number; bottom: number; label: string }> = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || !n.textContent?.trim() || !shown(el) || fixed(el) || el.closest('script, style, noscript, [hidden]')) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const q of range.getClientRects()) {
      if (q.width > 1 && q.height > 4 && q.bottom > 0 && q.top < vh) boxes.push({ kind: 'text', top: q.top, bottom: q.bottom, label: n.textContent.trim().slice(0, 24) });
    }
  }
  for (const el of document.querySelectorAll('input:not([type=hidden]), textarea, select, button, a.btn')) {
    const r = el.getBoundingClientRect();
    if (r.height > 4 && r.bottom > 0 && r.top < vh && shown(el) && !fixed(el)) boxes.push({ kind: 'field', top: r.top, bottom: r.bottom, label: el.tagName });
  }
  const decor = /\b(corner|page-corner|florals?|float|scene-img|divider|sprig|bow)\b/;
  for (const el of document.querySelectorAll('img')) {
    const r = el.getBoundingClientRect();
    if (r.width < 90 || r.bottom <= 0 || r.top >= vh || !shown(el) || fixed(el) || decor.test(el.className) || el.closest('.scene-bg, .hero-bg')) continue;
    boxes.push({ kind: 'image', top: r.top, bottom: r.bottom, label: el.getAttribute('src')?.split('/').pop()?.slice(0, 24) ?? 'img' });
  }
  const problems: string[] = [];
  let cutTop = 0;
  for (const b of boxes) {
    // (a line just above the edge still shows its descenders: g, y, p reach a few px below the line box)
    if (b.kind !== 'image' && b.top < -1 && b.bottom > (b.kind === 'text' ? -6 : 3)) {
      problems.push(`top cuts ${b.kind} "${b.label}"`);
      cutTop = Math.max(cutTop, b.bottom);
    }
    // an opaque or blurred bar (theme 03's menu, the editor's save bar) simply covers what scrolls under it, as on a
    // phone; a see-through one shows it between its own labels
    if (bar && seeThrough && b.bottom > labelsTop && b.top < bar.bottom) problems.push(`behind the menu: ${b.kind} "${b.label}"`);
  }
  const missing = keep.filter((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < 0 || r.bottom > navTop - 4;
  });
  return { problems, missing, navTop, labelsTop, seeThrough, cutTop, scrollY, maxY: document.documentElement.scrollHeight - vh };
}
/**
 * Moves the page a little (±20…120 px, or `deltas`) until nothing is cut at the edges and the `keep` elements are on
 * screen. When no position works, returns a clip that cuts the picture at the top of the bottom bar (and below a cut
 * line at the top) instead: a shorter picture, never a misleading one.
 */
async function clearEdges(page: any, opts: EdgeOpts = {}): Promise<Clip | null> {
  const keep = opts.keep ?? [];
  const base: number = await page.evaluate(() => scrollY);
  const steps = opts.scroll === false ? [0] : opts.deltas ?? [0, 20, -20, 40, -40, 60, -60, 80, -80, 100, -100, 120, -120];
  let first: any = null;
  for (const d of steps) {
    if (d !== 0 || first) await page.evaluate((y: number) => window.scrollTo({ top: Math.max(0, y), behavior: 'instant' }), base + d);
    await page.waitForTimeout(90);
    const st = await page.evaluate(edgeState, keep);
    if (!first) first = st;
    if (!st.problems.length && !st.missing.length) return null;
    if (d !== 0 && Math.abs(st.scrollY - (base + d)) > 2) continue; // page end: this position does not exist
  }
  await page.evaluate((y: number) => window.scrollTo({ top: y, behavior: 'instant' }), base);
  await page.waitForTimeout(120);
  const st = await page.evaluate(edgeState, keep);
  const top = st.cutTop > 0 && st.cutTop < 220 ? Math.ceil(st.cutTop + 6) : 0;
  const bottom = st.problems.some((p: string) => p.includes('behind the menu')) ? Math.floor(st.navTop) : 844;
  console.log(`edges: no clean position near ${base}px (${first?.problems.slice(0, 3).join('; ')}) → picture cut to ${top}–${bottom}px`);
  if (bottom - top < 420) return null;
  return top === 0 && bottom === 844 ? null : { x: 0, y: top, width: 390, height: bottom - top };
}
async function shot(page: any, name: string, what: string, opts: EdgeOpts & { edges?: boolean } = {}) {
  await page.evaluate((sel: string) => document.querySelectorAll(sel).forEach((e) => ((e as HTMLElement).style.visibility = 'hidden')), PARTICLES);
  const clip = opts.edges === false ? null : await clearEdges(page, opts);
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT as string, `${name}.jpg`), type: 'jpeg', quality: 88, ...(clip ? { clip } : {}) });
  shots.push({ name: `${name}.jpg`, what: clip ? `${what} (cut at ${clip.y}–${clip.y + clip.height} px: nothing clean to show at the edges)` : what });
  console.log(`shot  ${name}.jpg — ${what}${clip ? ` [clip ${clip.y}–${clip.y + clip.height}]` : ''}`);
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

let browser: any;
let failed = false;
const device = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
/** The guest who fills in the RSVP form in the pictures (fictional; shown in the form and in the replies list). */
const GUEST = 'Sofia Martin';
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
    await shot(page, 'g01_envelope', 'Guest: the closed envelope page (/<names>)', { scroll: false });
    await page.tap('.stage');
    await page.waitForURL(`${BASE}/${SLUG}/home`, { timeout: 10_000 });
    await page.waitForTimeout(5600);
    await shot(page, 'g02_home_top', 'Guest: home, first screen after the envelope opens', { scroll: false });
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
      await shot(page, 'g04_home_calendar', 'Guest: home, reply-by + add to calendar', { keep: ['a[data-calendar]'] });
    }
    await page.goto(`${BASE}/${SLUG}/story`, { waitUntil: 'load' });
    await page.waitForTimeout(3800);
    await shot(page, 'g05_story', 'Guest: Our Story page', { scroll: false });
    await page.goto(`${BASE}/${SLUG}/details`, { waitUntil: 'load' });
    await page.waitForTimeout(3600);
    await shot(page, 'g06_details_top', 'Guest: Details page, first screen', { scroll: false });
    await revealAll(page);
    const sched = await page.$('[data-repeat-item^="schedule."]');
    if (sched) {
      // the order of the day with its add-to-calendar buttons, both above the menu
      const cal = (await page.$('.cal a[data-calendar]')) ? '.cal a[data-calendar]' : '[data-repeat-item^="schedule."]';
      await page.evaluate((s: string) => {
        const r = document.querySelector(s)!.getBoundingClientRect();
        window.scrollTo({ top: Math.max(0, r.bottom + scrollY - innerHeight + 130), behavior: 'instant' });
      }, cal);
      await page.waitForTimeout(2600);
      await shot(page, 'g07_details_schedule', 'Guest: Details, order of the day + add to calendar', { keep: [cal, '[data-repeat-item="schedule.0"]'] });
    }
    if (await page.$('[data-slot="venue"]')) {
      await centerOn(page, '[data-slot="venue"]', 'center', 90, 2400);
      await shot(page, 'g12_details_venue', 'Guest: Details, the venue (photo, name, address)', { keep: ['[data-slot="venue"]'] });
    } else check('guest: venue block on details', false);
    const faq = 'details[data-repeat-item^="faq."]';
    if (await page.$(faq)) {
      await page.evaluate((s: string) => ((document.querySelector(s) as HTMLDetailsElement).open = true), faq);
      await centerOn(page, faq, 'start', -150, 2000);
      await shot(page, 'g08_details_faq', 'Guest: Details, questions & answers (first one open)', { keep: [faq] });
    } else check('guest: Q&A block on details', false);
    await page.goto(`${BASE}/${SLUG}/rsvp`, { waitUntil: 'load' });
    await page.waitForTimeout(3600);
    await shot(page, 'g09_rsvp_top', 'Guest: RSVP page, first screen', { scroll: false });
    await revealAll(page);
    await page.fill('[data-rsvp-form] [name="name"]', GUEST);
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.fill('[data-rsvp-form] [name="guests"]', '2');
    const meal = page.locator('fieldset[data-rsvp-question="meal"] label').filter({ hasText: 'Fish' });
    if (await meal.count()) await meal.first().click();
    // from the name field's label (24 px above it) down: no field without its label at the top edge
    await centerOn(page, '[data-rsvp-form] label.field', 'start', -24, 1200);
    await shot(page, 'g10_rsvp_form', 'Guest: RSVP form with the couple\'s question (Meal choice)', {
      keep: ['[data-rsvp-form] label.field'], deltas: [0, -8, 8, -16, 16, -24, 24, -32, -40, -48, -56, -64, -72, -80, -96, -112],
    });
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
    await shot(page, 'd01_demo_home', 'Public demo of the design: home (sample names, placeholder photos)', { scroll: false });
    await ctx.close();
  }

  // (G065) The buyer and panel screens of G059 (b01–b10, p01–p03) are gone: the editor changed (panel v2, hash views),
  // START HERE has no step pictures since G091, and the listing's editor/RSVP screens come from gm03/capture.ts.

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
    // (1.8 s on the home screen, then down to the card: its writing finishes about 1.5 s before the clip ends)
    await page.waitForTimeout(1800);
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
      notes: [`stills: nothing cut at the top edge or by the bottom bar, nothing behind a see-through menu (clearEdges; a picture is cut shorter when no position works)`, `guest who fills in the form: ${GUEST} (fictional)`, `particle layers (${PARTICLES}) hidden in the stills, not in the recording`, ...env.notes],
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
