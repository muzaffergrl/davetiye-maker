// Slow-motion screen recording of one scene of a theme (smooth 60 fps listing video; see smooth.mjs for the method).
// usage: node rec.mjs <info.json from serve.ts> <scene: opening|rsvp|edit> <outdir> [S=20] [dpr=2]
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const [infoFile, scene, out, Sarg, dprArg] = process.argv.slice(2);
const info = JSON.parse(readFileSync(infoFile, 'utf8'));
const S = Number(Sarg || 20), DPR = Number(dprArg || 2);
const VW = Number(process.argv[7] || 390), VH = Number(process.argv[8] || 844);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const slow = `(() => { const S = ${S};
  const pn = performance.now.bind(performance), dn = Date.now, t0p = pn(), t0d = dn();
  performance.now = () => t0p + (pn() - t0p) / S;
  Date.now = () => t0d + (dn() - t0d) / S;
  const st = window.setTimeout, si = window.setInterval;
  window.setTimeout = (f, d, ...a) => st(f, (d || 0) * S, ...a);
  window.setInterval = (f, d, ...a) => si(f, (d || 0) * S, ...a);
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((ts) => cb(t0p + (ts - t0p) / S));
})();`;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' });
ctx.setDefaultTimeout(30_000 * S);
const page = await ctx.newPage();
const B = info.base, SLUG = info.slug;

// warm-up visit at normal speed (fonts, images, scripts cached), then slow motion from a fresh load
const warm = { opening: `${B}/${SLUG}`, rsvp: `${B}/${SLUG}/rsvp`, edit: `${B}/edit/${SLUG}?k=${info.key}#edit` }[scene];
await page.goto(warm, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
if (scene === 'opening') { await page.goto(`${B}/${SLUG}/home`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500); }

await ctx.addInitScript(slow);
const cdp = await ctx.newCDPSession(page);
const setRate = async () => { try { await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / S }); } catch {} };
page.on('framenavigated', (f) => { if (f === page.mainFrame()) setRate(); });
await setRate();

const wait = (ms) => page.waitForTimeout(ms * S); // page-time milliseconds
async function smoothScroll(y, ms) {
  await page.evaluate(async ([y, ms]) => {
    const y0 = scrollY, t = performance.now();
    await new Promise((res) => { (function f() { const k = Math.min(1, (performance.now() - t) / ms); const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; scrollTo({ top: y0 + (y - y0) * e, behavior: 'instant' }); if (k < 1) requestAnimationFrame(f); else res(); })(); });
  }, [y, ms]);
}
const topOf = (sel, off = 0) => page.evaluate(([s, o]) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + scrollY + o : null; }, [sel, off]);
async function tapEl(sel) { const b = await page.locator(sel).first().boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); }
const type = (text, perChar = 70) => page.keyboard.type(text, { delay: perChar * S });

// ---- load the scene's page in slow motion, then start the camera
const start = { opening: `${B}/${SLUG}`, rsvp: `${B}/${SLUG}/rsvp`, edit: warm }[scene];
await page.goto(start, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const marks = {};
const frames = [];
let capturing = true, t0 = 0;
const now = () => (Date.now() - t0) / 1000 / S;

if (scene === 'opening') {
  await wait(2500);                    // entrance animations of the envelope page settle before the camera starts
} else if (scene === 'rsvp') {
  await wait(3000);
  const y = await topOf('[data-rsvp-form] label.field', -170);
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.max(0, y - 260));
  await wait(2500);
} else if (scene === 'edit') {
  await wait(2500);
}

const shoot = (async () => {
  t0 = Date.now();
  while (capturing) {
    const t = Date.now();
    try {
      const buf = await page.screenshot({ type: 'jpeg', quality: 92, animations: 'allow', caret: 'initial', scale: 'device' });
      const f = `f${String(frames.length).padStart(5, '0')}.jpg`;
      writeFileSync(path.join(out, f), buf);
      frames.push({ file: f, t: ((t + Date.now()) / 2 - t0) / 1000 / S });
    } catch { await new Promise((r) => setTimeout(r, 20)); }
  }
})();
await new Promise((r) => setTimeout(r, 50));

if (scene === 'opening') {
  await wait(300);
  marks.tap = now();
  await page.tap('.stage');
  await page.waitForURL(/\/home(\?|$)/);
  marks.home = now();
  await wait(1700);
  const y = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-field="partners.0.full_name"], [data-field="partners.1.full_name"]')].find((e) => e.offsetParent);
    return el ? el.getBoundingClientRect().top + scrollY - innerHeight * 0.38 : document.documentElement.scrollHeight * 0.3;
  });
  marks.scroll = now();
  await smoothScroll(y, 1600);
  marks.scrolled = now();
  await wait(3000);
} else if (scene === 'rsvp') {
  await wait(300);
  const y = await topOf('[data-rsvp-form] label.field', -150);
  marks.scroll = now();
  await smoothScroll(y, 700);
  await wait(200);
  await tapEl('[data-rsvp-form] [name="name"]');
  marks.type = now();
  await type('Sofia Martin', 55);
  await wait(250);
  await page.keyboard.press('Tab'); // leave the field (closes the on-screen caret)
  await page.evaluate(() => document.activeElement?.blur());
  marks.yes = now();
  const yes = '[data-rsvp-form] [name="attending"][value="yes"]';
  const yesLabel = await page.evaluate((s) => { const i = document.querySelector(s); const l = i?.closest('label') ?? (i?.id && document.querySelector(`label[for="${i.id}"]`)); if (l) { l.setAttribute('data-v-yes', ''); return '[data-v-yes]'; } return s; }, yes);
  await tapEl(yesLabel);
  await wait(450);
  const y2 = await topOf('fieldset[data-rsvp-question="meal"]', -300);
  if (y2 !== null) { await smoothScroll(y2, 600); await wait(150); }
  const meal = page.locator('fieldset[data-rsvp-question="meal"] label').filter({ hasText: 'Fish' });
  if (await meal.count()) { marks.meal = now(); const b = await meal.first().boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await wait(450); }
  const y3 = await topOf('[data-rsvp-form] button[type="submit"]', -560);
  await smoothScroll(y3, 600);
  await wait(200);
  marks.send = now();
  await tapEl('[data-rsvp-form] button[type="submit"]');
  await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])').catch(() => null);
  marks.sent = now();
  const y4 = await topOf('[data-rsvp]', -120);
  if (y4 !== null) await smoothScroll(y4, 600);
  await wait(2200);
} else if (scene === 'edit') {
  await wait(700);
  marks.tapStory = now();
  await tapEl('#section-story');
  await page.waitForSelector('#f-story-items-0-caption');
  marks.story = now();
  await wait(500);
  const y = await topOf('#f-story-items-0-caption', -380);
  await smoothScroll(y, 550);
  await wait(150);
  await tapEl('#f-story-items-0-caption');
  await wait(200);
  await page.evaluate(() => { const i = document.querySelector('#f-story-items-0-caption'); i.setSelectionRange(0, i.value.length); });
  await wait(350);
  marks.type = now();
  await type('Where it all began', 55);
  await wait(400);
  await page.evaluate(() => document.activeElement?.blur());
  await wait(450);
  marks.publish = now();
  const pub = page.getByRole('button', { name: 'Publish', exact: true }).first();
  const pb = await pub.boundingBox();
  await page.touchscreen.tap(pb.x + pb.width / 2, pb.y + pb.height / 2);
  await page.getByText('Your website is live').first().waitFor();
  marks.live = now();
  await wait(2000);
}
capturing = false; await shoot;
writeFileSync(path.join(out, 'frames.json'), JSON.stringify({ S, DPR, scene, marks, frames }, null, 1));
const gaps = frames.slice(1).map((f, i) => f.t - frames[i].t);
console.log(`${scene}: frames ${frames.length}, page-time ${frames.at(-1).t.toFixed(2)} s, mean step ${(1000 * gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1)} ms, max ${(1000 * Math.max(...gaps)).toFixed(1)} ms, marks ${JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +v.toFixed(2)])))}`);
await browser.close();
