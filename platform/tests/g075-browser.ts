// Browser checks of the post-wedding thank-you mode (G075, K28): real `next start` + Chromium. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g075-browser.ts
//
// Guests (01 olive-ivory, 03 blush-garden-rose; G081: 02 dusty-blue-champagne, 05 mediterranean-lemon, 04 vintage-airmail-love-letter — G075_THEMES=<id,…>
// runs only those designs and skips the couple's part): a site whose wedding was two days ago is a thank-you page by itself
// (envelope opens, card with the thank-you title, home thank-you card, honest closed RSVP, API 403); five pages × 360 /
// 390 / 430 / 1280 without horizontal scroll, broken image or console/CSP error; the card's window with the thank-you
// photo and — without one — the design's decoration; the Day page hidden (404, no link); a 60-character title on the card
// at 360 px. Couple (panel, 390 × 844): Day & place → "After the wedding" → On now + a message → preview of the thank-you
// page → Review names it → Publish → the guest sees it → Home card "Your website switched to thank-you mode" → Edit →
// Off → publish → the invitation is back; axe-core on the section and the Home card; touch targets.
// PNG previews + checks.json → previews/g075/ (or $G075_SHOTS_DIR). Exit 1 on a failed check.
// Global Playwright and /opt/pw-browsers (never `playwright install`); data in a temporary folder; port $PORT (3375).

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { builtDesignThemes, collectionDir } from './design-themes.ts';
import { loadThemeEnv, REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');
const PORT = Number(process.env.PORT || 3375);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G075_SHOTS_DIR || path.join(ROOT, 'previews/g075');
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g075-browser-data-'));
mkdirSync(OUT, { recursive: true });

const ALL_THEMES = builtDesignThemes();
const ONLY = (process.env.G075_THEMES ?? '').split(',').filter(Boolean);
const THEMES = ALL_THEMES.filter((t) => !ONLY.length || ONLY.includes(t));
/** The couple's panel journey (03 + 01's automatic switch) runs in the full run only. */
const PANEL = !ONLY.length;
const PHOTO: Record<string, string> = Object.fromEntries(ALL_THEMES.map((id) => [id, path.join(collectionDir(id), 'assets/gpt/photos/story_2.jpg')]));
const MESSAGE = 'What a day! Thank you for the laughter, the dancing and every kind word.\nWe will treasure it always.';
const DAY = 86_400_000;
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Seeds a published site of `theme` (its demo record + sample photos), with `edit` applied to the record. */
function seed(theme: string, slug: string, edit: (c: any) => void = () => {}): { slug: string; editKey: string; theme: string } {
  const env = loadThemeEnv({ theme });
  const content = structuredClone(env.demo) as any;
  edit(content);
  const file = path.join(dataDir, `${slug}.json`);
  writeFileSync(file, JSON.stringify(content));
  const res = spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts/seed.ts'), '--theme', theme, '--slug', slug, '--content', file, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos'])],
    { cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local' }, encoding: 'utf8' },
  );
  if (res.status !== 0) throw new Error(`seed ${theme} failed:\n${res.stdout}\n${res.stderr}`);
  const keys = JSON.parse(readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8')) as { editKey: string };
  return { slug, editKey: keys.editKey, theme };
}
/** The wedding was `days` days ago (UTC), replies closed a week before it. */
const weddingDaysAgo = (days: number) => (c: any) => {
  c.timezone = 'UTC';
  c.date = isoDay(Date.now() - days * DAY);
  c.rsvp = { ...c.rsvp, deadline: isoDay(Date.now() - (days + 7) * DAY) };
};

const sites = Object.fromEntries(
  THEMES.flatMap((t) => [
    [`after-${t}`, seed(t, `after-${t}`, weddingDaysAgo(2))],
    [`plain-${t}`, seed(t, `plain-${t}`, (c) => {
      weddingDaysAgo(3)(c);
      c.thank_you = { details: 'hide', title: 'Thank you for being part of our day — love, us two!!' };
    })],
  ]),
);
const panelSite = PANEL ? seed('blush-garden-rose', 'clara-and-julian') : null!;

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
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' };
const shot = async (page: any, name: string, fullPage = false) => {
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
};
async function axe(page: any, view: string, include?: string) {
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async (inc: string | null) => {
    const r = await (window as any).axe.run(inc ? { include: [inc] } : document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  }, include ?? null);
  check(`a11y (axe-core): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}
async function smallTargets(page: any, scope: string): Promise<string[]> {
  return page.evaluate((sel: string) => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(`${sel} button, ${sel} a[href], ${sel} input:not([type=hidden]):not([type=radio]):not([type=file]), ${sel} label:has(input[type=radio]), ${sel} textarea`)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden]')) continue;
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, scope);
}
/** Waits until the entrances (finite transitions / animations: a print flying in from the side, G081 02) have played —
 *  a layout is measured at rest; endless decor loops (floats, the hint) do not count. */
const entrancesDone = (page: any) =>
  page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().iterations === Infinity), null, { timeout: 6000 }).catch(() => null);
/** Layout problems of a guest page: horizontal scroll, images not loaded, a "Your photo here" label, card text outside its card. */
const pageProblems = (page: any) =>
  page.evaluate(() => {
    const out: string[] = [];
    const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    if (over > 1) out.push(`horizontal scroll ${over}px`);
    for (const img of Array.from(document.images)) {
      if (img.closest('[hidden]') || getComputedStyle(img).display === 'none') continue;
      if (img.loading === 'lazy' && !img.complete) continue;
      if (!img.complete || !img.naturalWidth) out.push(`image not loaded: ${img.currentSrc || img.src}`);
    }
    for (const m of Array.from(document.querySelectorAll<HTMLElement>('.ph-mark'))) if (m.offsetParent) out.push('a "Your photo here" label is visible');
    for (const t of Array.from(document.querySelectorAll<HTMLElement>('.card-copy [data-field="thank_you_title"]'))) {
      const card = t.closest('.card')!.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      if (r.width && (r.bottom > card.bottom + 1 || r.left < card.left - 1 || r.right > card.right + 1)) out.push(`card title outside the card (${Math.round(r.bottom - card.bottom)}px)`);
    }
    return out;
  });

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  // ------------------------------------------------------------------------------------------ guests
  for (const theme of THEMES) {
    const after = sites[`after-${theme}`];
    const plain = sites[`plain-${theme}`];
    // the thank-you photo + message through the panel API (as the panel does): upload, save, publish
    await block(`${theme}: thank-you photo and message via the panel API`, async () => {
      const auth = { authorization: `Bearer ${after.editKey}` };
      const state = (await (await fetch(`${BASE}/api/edit/${after.slug}`, { headers: auth })).json()).state;
      const up = await fetch(`${BASE}/api/edit/${after.slug}/photo?slot=thank_you`, { method: 'POST', headers: { ...auth, 'content-type': 'image/jpeg' }, body: readFileSync(PHOTO[theme]) });
      const photo = await up.json();
      check(`${theme}: upload to the thank-you photo place (slot=thank_you)`, up.status === 200 && photo.source === 'thank_you.photo', `${up.status} ${photo.source}`);
      const content = { ...state.content, thank_you: { message: MESSAGE, photo: photo.url } };
      const put = await fetch(`${BASE}/api/edit/${after.slug}`, { method: 'PUT', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ content, baseUpdatedAt: state.updatedAt }) });
      const pub = await fetch(`${BASE}/api/edit/${after.slug}/publish`, { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: '{}' });
      check(`${theme}: saved and published`, put.status === 200 && pub.status === 200, `${put.status} ${pub.status}`);
    });

    await block(`${theme}: guest pages in thank-you mode`, async () => {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('console', (m: any) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e: any) => errors.push(String(e)));
      const res = await page.goto(`${BASE}/${after.slug}`, { waitUntil: 'networkidle' });
      check(`${theme}: two days after the wedding the envelope page is the thank-you version by itself`, res.status() === 200 && (await page.locator('html[data-thank-you]').count()) === 1);
      check(`${theme}: envelope kicker + card title`, (await page.locator('.env-head .kicker').first().innerText()).toLowerCase().includes('thank') && (await page.locator('.card-copy').innerText()).toLowerCase().includes('thank you for celebrating with us'));
      check(`${theme}: the thank-you photo is in the card window`, (await page.locator('.card img.ty-photo').count()) === 1 && (await page.locator('.card img.ty-photo').evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)));
      await shot(page, `01_envelope_${theme}`);
      // tap: the opening show is the same; the card flies to home
      await page.locator('.stage').click();
      await page.waitForURL(/\/home$/, { timeout: 15_000 });
      check(`${theme}: tap → the envelope opens and goes to home (thank-you version)`, (await page.locator('html[data-thank-you]').count()) === 1);
      await page.goto(`${BASE}/${after.slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      check(`${theme}: back to the envelope: opened, the thank-you card up`, await page.locator('html.is-opened').count());
      await shot(page, `02_envelope_open_${theme}`);
      await page.goto(`${BASE}/${after.slug}/home`, { waitUntil: 'networkidle' });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload({ waitUntil: 'networkidle' });
      const card = page.locator('#thank-you');
      check(`${theme}: home thank-you card with the message (line break kept)`, (await card.innerText()).includes('We will treasure it always.') && (await card.locator('[data-field="thank_you.message"]').evaluate((p: HTMLElement) => getComputedStyle(p).whiteSpace)) === 'pre-line');
      check(`${theme}: home has no countdown, RSVP link or calendar`, (await page.locator('[data-countdown], a[href*="/rsvp"], [data-calendar]').count()) === 0);
      await shot(page, `03_home_${theme}`, true);
      const rsvp = await page.goto(`${BASE}/${after.slug}/rsvp`, { waitUntil: 'networkidle' });
      check(`${theme}: RSVP page answers old links (200) with "Replies are closed", no form`, rsvp.status() === 200 && (await page.locator('h1').innerText()).toLowerCase().includes('replies are closed') && (await page.locator('form').count()) === 0);
      // through the context's request API (a refused fetch in the page would log a console error)
      const r = await page.request.post(`${BASE}/api/rsvp/${after.slug}`, { data: { name: 'Ada', attending: 'yes', guests: 1 } });
      const api = { status: r.status(), body: await r.json() };
      check(`${theme}: RSVP API refuses replies: 403 closed (thank_you)`, api.status === 403 && api.body.code === 'closed' && api.body.reason === 'thank_you', JSON.stringify(api));
      await shot(page, `04_rsvp_closed_${theme}`);
      // five pages × widths
      for (const w of [360, 390, 430, 1280]) {
        await page.setViewportSize({ width: w, height: w > 1000 ? 860 : 780 });
        const bad: string[] = [];
        for (const p of ['', '/home', '/story', '/details', '/rsvp']) {
          const r = await page.goto(`${BASE}/${after.slug}${p}`, { waitUntil: 'networkidle' });
          if (r.status() !== 200) bad.push(`${p || '/'} ${r.status()}`);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(150);
          await entrancesDone(page);
          for (const x of await pageProblems(page)) bad.push(`${p || '/'}: ${x}`);
        }
        check(`${theme} ${w} px: five thank-you pages without overflow, broken image or label`, !bad.length, bad.join('; '));
        if (w === 1280 && theme === 'blush-garden-rose') {
          await page.goto(`${BASE}/${after.slug}/home`, { waitUntil: 'networkidle' });
          await shot(page, `09_home_1280_${theme}`);
        }
      }
      check(`${theme}: no console or CSP error`, !errors.length, errors.slice(0, 3).join(' | '));

      // without a photo: the design's decoration; a long title on the card at 360 px; the Day page hidden
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/${plain.slug}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => sessionStorage.setItem(`invite:opened:${JSON.parse(document.getElementById('site-data')!.textContent!).slug}`, '1'));
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      check(`${theme}: no thank-you photo → the design's decoration in the window (not a placeholder)`, (await page.locator('.card .ty-decor img').count()) === 1 && !(await page.locator('.card img[src*="ph_hero_portrait"]').count()));
      await shot(page, `05_card_decoration_${theme}`);
      await page.setViewportSize({ width: 360, height: 640 });
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      check(`${theme} 360 × 640: a long thank-you title stays on the card`, !(await pageProblems(page)).length, (await pageProblems(page)).join('; '));
      const det = await page.goto(`${BASE}/${plain.slug}/details`);
      check(`${theme}: the Day page hidden by the couple is 404`, det.status() === 404);
      await page.goto(`${BASE}/${plain.slug}/home`, { waitUntil: 'networkidle' });
      check(`${theme}: and nothing links to it`, (await page.locator('a[href$="/details"]').count()) === 0);
      await ctx.close();
    });
  }

  // ------------------------------------------------------------------------------------------ couple (panel)
  if (PANEL) await block('panel: After the wedding → On now → preview → publish → Home card → Off', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e: any) => errors.push(String(e)));
    const guest = await (await browser.newContext(PHONE)).newPage();
    const panel = `${BASE}/edit/${panelSite.slug}?k=${encodeURIComponent(panelSite.editKey)}`;
    await guest.goto(`${BASE}/${panelSite.slug}/home`, { waitUntil: 'networkidle' });
    check('before: the invitation (the wedding is in 2027, mode automatic)', !(await guest.locator('html[data-thank-you]').count()));

    await page.goto(`${panel}#edit`, { waitUntil: 'networkidle' });
    const rows = await page.locator('[data-section-row]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-section-row')));
    check('Edit keeps six pages (K29: no 7th page)', rows.join() === 'us,day,photos,story,details,rsvp', rows.join());
    await page.goto(`${panel}#edit/day`, { waitUntil: 'networkidle' });
    const fold = page.locator('[data-disclosure="thank-you"] button[aria-expanded]');
    await fold.scrollIntoViewIfNeeded();
    check('Day & place ends with a folded "After the wedding" section that says "Automatic"', (await fold.getAttribute('aria-expanded')) === 'false' && (await fold.innerText()).includes('Automatic'), await fold.innerText());
    await fold.click();
    const box = page.locator('[data-thank-you-settings]');
    await box.waitFor();
    check('it says when it switches by itself ("From Sunday, May 16, 2027")', (await box.innerText()).includes('From Sunday, May 16, 2027'), (await page.locator('#f-thank_you-mode').innerText()).replace(/\s+/g, ' '));
    await axe(page, 'After the wedding (panel)', '[data-disclosure="thank-you"]');
    const small = await smallTargets(page, '[data-disclosure="thank-you"]');
    check('touch targets ≥ 44 px in the section', !small.length, small.join('; '));

    await page.locator('#f-thank_you-mode label:has(input[value="on"])').click();
    await page.fill('#f-thank_you-message', MESSAGE);
    check('status line: guests see the thank-you page now, replies closed', (await page.locator('[data-thank-you-now]').innerText()).includes('Replies are closed'));
    // the whole section in one phone-wide picture (a tall window: the sticky bars stay at the top, nothing overlaps)
    await page.setViewportSize({ width: 390, height: 1560 });
    await page.locator('[data-disclosure="thank-you"]').evaluate((el: HTMLElement) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 140));
    await shot(page, '10_panel_after_the_wedding');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForSelector('[data-changes-bar]', { timeout: 10_000 });
    await page.waitForFunction(() => (document.querySelector('[data-changes-count]')?.textContent ?? '') !== '', null, { timeout: 10_000 });
    check('the change counts like any other ("Unpublished changes: 1")', (await page.locator('[data-changes-count]').innerText()) === '1');

    await page.click('[data-preview-thank-you]');
    const frame = page.frameLocator('iframe[title="Preview of your website"]');
    await frame.locator('html[data-thank-you]').waitFor({ timeout: 15_000 });
    // the preview reloads once the autosave has settled (PREVIEW_SETTLE_MS): the message arrives with it
    const shown = await frame.locator('#thank-you', { hasText: 'We will treasure it always.' }).waitFor({ timeout: 20_000 }).then(() => true, () => false);
    check('Preview the thank-you page: the preview shows it (home, the message)', shown);
    check('the preview says what it shows', (await page.locator('[data-preview-thanks]').innerText()).includes('after the wedding'));
    await page.waitForTimeout(3500); // the page's entrance choreography
    await shot(page, '11_panel_preview_thank_you');
    await page.click('[data-close-preview]');

    await page.click('[data-changes-review]');
    const item = page.locator('[data-review-item="day"]');
    await item.waitFor();
    check('Review names the page and the part: Day & place · After the wedding', (await item.innerText()).includes('After the wedding'), (await item.innerText()).replace(/\s+/g, ' '));
    await shot(page, '12_panel_review');
    await page.click('[data-review-publish]');
    const live = await page.waitForSelector('[data-testid="live"]', { timeout: 30_000 }).then(() => true, () => false);
    check('Publish from Review: "Your website is live"', live, live ? '' : (await page.locator('[role="dialog"], [role="alert"]').allInnerTexts()).join(' | ').slice(0, 300));
    await page.keyboard.press('Escape');
    await guest.reload({ waitUntil: 'networkidle' });
    check('after publishing, guests see the thank-you page', (await guest.locator('html[data-thank-you]').count()) === 1 && (await guest.locator('#thank-you').innerText()).includes('We will treasure it always.'));

    await page.goto(`${panel}#home`, { waitUntil: 'networkidle' });
    const homeCard = page.locator('[data-thank-you-card]');
    await homeCard.waitFor();
    check('Home: "Your website switched to thank-you mode"', (await homeCard.innerText()).includes('Your website switched to thank-you mode'));
    await shot(page, '13_panel_home_card');
    await axe(page, 'Home with the thank-you card', '[data-thank-you-card]');
    await page.click('[data-edit-thank-you]');
    await page.waitForFunction(() => location.hash === '#edit/thankyou');
    const open = page.locator('[data-disclosure="thank-you"] button[aria-expanded]');
    check('"Edit the thank-you page" opens Day & place at After the wedding, unfolded', (await open.getAttribute('aria-expanded')) === 'true');
    await page.locator('#f-thank_you-mode label:has(input[value="off"])').click();
    await page.waitForSelector('[data-changes-bar] [data-publish]');
    await page.waitForTimeout(1200);
    await page.click('[data-changes-bar] [data-publish]');
    await page.waitForSelector('[data-testid="live"]', { timeout: 20_000 });
    await guest.reload({ waitUntil: 'networkidle' });
    check('Off + publish: the invitation is back', !(await guest.locator('html[data-thank-you]').count()) && (await guest.locator('[data-calendar]').count()) > 0);
    await page.goto(`${panel}#home`, { waitUntil: 'networkidle' });
    check('Home: the card is gone', !(await page.locator('[data-thank-you-card]').count()));
    check('panel: no page error', !errors.length, errors.join(' | '));
    await ctx.close();
  });

  // automatic mode in the panel: two days after the wedding the Home card is there without any setting
  if (PANEL) await block('panel: automatic switch shows the Home card', async () => {
    const after = sites['after-olive-ivory'];
    const page = await (await browser.newContext(PHONE)).newPage();
    await page.goto(`${BASE}/edit/${after.slug}?k=${encodeURIComponent(after.editKey)}#home`, { waitUntil: 'networkidle' });
    await page.locator('[data-thank-you-card]').waitFor({ timeout: 10_000 });
    check('automatic: the Home card after the wedding day', true);
    await page.goto(`${BASE}/edit/${after.slug}?k=${encodeURIComponent(after.editKey)}#edit/thankyou`, { waitUntil: 'networkidle' });
    check('automatic: the section says guests see the thank-you page', (await page.locator('[data-thank-you-now]').innerText()).includes('Your wedding day has passed'));
  });
} finally {
  await browser?.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), passed: checks.length - failed.length, failed: failed.length, checks }, null, 1) + '\n');
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → ${path.relative(ROOT, OUT)}`);
process.exit(failed.length ? 1 : 0);
