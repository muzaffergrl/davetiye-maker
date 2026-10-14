// Browser checks of the editable design texts (G068, K28): real `next start` + Chromium. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g068-browser.ts
//
// Couple (panel, 390 × 844, 01 olive-ivory): Edit keeps six pages; Us ends with a folded "Headings & labels on this page"
// (the most-changed first, the design's text in grey) → a new envelope line → "Vow renewal" suggestion (+ Undo) → RSVP
// heading on the RSVP page → "Unpublished changes: 2" → Preview this page (the RSVP page with the new heading) → Review
// ("Us · Headings & labels", "RSVP · Headings & labels") → Publish → the guest pages show the couple's words → no
// name/date change used → "Reset to design text" → publish → the design's text is back. axe-core and touch targets on the
// section; 1280: the preview follows the text being edited. Guests (390, both themes): changed headings, menu and buttons
// on index / home / details / rsvp without horizontal scroll or broken images.
// PNG previews + checks.json → previews/g068/ (or $G068_SHOTS_DIR). Exit 1 on a failed check.
// Global Playwright and /opt/pw-browsers (never `playwright install`); data in a temporary folder; port $PORT (3368).

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { loadThemeEnv, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');
const PORT = Number(process.env.PORT || 3368);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G068_SHOTS_DIR || path.join(ROOT, 'previews/g068');
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g068-browser-data-'));
mkdirSync(OUT, { recursive: true });

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

/** The guest pages with the couple's own headings (the same words on both designs). */
const GUEST_COPY = {
  envelope_kicker: 'Join us in the garden',
  card_line: 'We’re renewing our vows',
  schedule_title: 'How the day unfolds',
  rsvp_title: 'Will you be there?',
  rsvp_by: 'Please answer by',
  form_send: 'Send my answer',
  nav_details: 'Our day',
  nav_rsvp: 'Reply',
  calendar_title: 'Save the date',
};
const panelSite = seed('olive-ivory', 'g068-panel');
const guests = {
  'olive-ivory': seed('olive-ivory', 'g068-olive', (c) => void (c.copy = GUEST_COPY)),
  'blush-garden-rose': seed('blush-garden-rose', 'g068-blush', (c) => void (c.copy = GUEST_COPY)),
};

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
    for (const el of document.querySelectorAll<HTMLElement>(`${sel} button, ${sel} a[href], ${sel} input:not([type=hidden]), ${sel} textarea`)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden]')) continue;
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, scope);
}
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
    return out;
  });
/** Lets a page's entrance choreography finish (every scene shown; as scripts/theme-check.cjs revealAll). */
const settle = async (page: any) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 240) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await page.waitForTimeout(3800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
};
/** A full-page picture: the fixed nav at the page's end (where a guest sees it after scrolling), not mid-page. */
const flattenNav = (page: any) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>('.site-nav');
    if (n && getComputedStyle(n).bottom === '0px') {
      n.style.position = 'absolute';
      n.style.bottom = 'auto';
      n.style.top = `${document.documentElement.scrollHeight - n.offsetHeight}px`;
    }
  });
/** Opens a folded section (a click right after a page load can land while the editor still scrolls to its heading). */
async function unfold(page: any, sel: string) {
  const btn = page.locator(`${sel} button[aria-expanded]`).first();
  for (let i = 0; i < 4 && (await btn.getAttribute('aria-expanded')) !== 'true'; i++) {
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(250);
  }
  return btn;
}
/** Goes to another editor page without reloading (the autosave keeps running). */
const editPage = async (page: any, id: string) => {
  await page.evaluate((h: string) => void (location.hash = h), `#edit/${id}`);
  await page.waitForSelector(`[data-page="${id}"]`);
  await page.waitForTimeout(400);
};
const text = async (page: any, sel: string) => ((await page.locator(sel).first().textContent()) ?? '').replace(/\s+/g, ' ').trim();

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  // ------------------------------------------------------------------------------------------ couple (panel)
  await block('panel: Headings & labels → suggestion → RSVP heading → preview → Review → publish → reset', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e: any) => errors.push(String(e)));
    const guest = await (await browser.newContext(PHONE)).newPage();
    const panel = `${BASE}/edit/${panelSite.slug}?k=${encodeURIComponent(panelSite.editKey)}`;

    await page.goto(`${panel}#edit`, { waitUntil: 'networkidle' });
    const rows = await page.locator('[data-section-row]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-section-row')));
    check('Edit keeps six pages (K29: no 7th "Wording" page)', rows.join() === 'us,day,photos,story,details,rsvp', rows.join());

    await page.goto(`${panel}#edit/us`, { waitUntil: 'networkidle' });
    const fold = page.locator('[data-disclosure="copy-us"] button[aria-expanded]');
    await fold.scrollIntoViewIfNeeded();
    check('Us ends with a folded "Headings & labels on this page"', (await fold.getAttribute('aria-expanded')) === 'false' && (await fold.innerText()).includes('Headings & labels on this page'), await fold.innerText());
    const last = await page.locator('.sectionPage > section, [data-page="us"] > section').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-section')));
    check('…as the last part of the page', last[last.length - 1] === 'copy', last.join());
    await page.waitForTimeout(500);
    await unfold(page, '[data-disclosure="copy-us"]');
    await page.locator('[data-copy-fields="us"]').waitFor();
    const keys = await page.locator('[data-copy-fields="us"] [data-copy-row]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-copy-row')));
    check('the most-changed texts first (envelope line, small card, invitation line)', keys.slice(0, 3).join() === 'envelope_kicker,card_line,invite_request', keys.join());
    const input = page.locator('#f-copy-envelope_kicker');
    check('a row shows the design\'s text in grey (placeholder) and an empty box', (await input.getAttribute('placeholder')) === 'You are invited' && (await input.inputValue()) === '');
    check('no "Reset" while the design\'s text is used', (await page.locator('[data-copy-reset]').count()) === 0);
    await axe(page, 'Headings & labels (Us)', '[data-disclosure="copy-us"]');
    const small = await smallTargets(page, '[data-disclosure="copy-us"]');
    check('touch targets ≥ 44 px in the section', !small.length, small.join('; '));

    await input.fill('Come celebrate with us');
    await page.locator('[data-copy-reset="envelope_kicker"]').waitFor();
    // (the quotation marks of <q> come from CSS)
    check('typed: "Design text: “You are invited”" + "Reset to design text" under the row', (await text(page, '[data-copy-row="envelope_kicker"]')).includes('Design text: You are invited'), await text(page, '[data-copy-row="envelope_kicker"]'));
    await page.click('[data-copy-preset="vow_renewal"]');
    const snack = page.locator('[data-snackbar]');
    await snack.waitFor();
    check('suggestion "Vow renewal": fills a few lines and says so', (await snack.innerText()).includes('Wording for a vow renewal: 2 texts changed.'), await snack.innerText());
    check('…the small card line is filled', (await page.locator('#f-copy-card_line').inputValue()) === 'We’re renewing our vows');
    check('…its chip is pressed', (await page.getAttribute('[data-copy-preset="vow_renewal"]', 'aria-pressed')) === 'true');
    await page.click('[data-snack-action="Undo"]');
    check('Undo puts the lines back (the envelope line typed before stays)', (await page.locator('#f-copy-card_line').inputValue()) === '' && (await input.inputValue()) === 'Come celebrate with us');
    await page.click('[data-copy-preset="vow_renewal"]');
    check('the section header counts the changed texts', (await fold.innerText()).includes('3 changed'), await fold.innerText());
    // the whole section in one phone-wide picture (a tall window: the bars stay at the top)
    await page.setViewportSize({ width: 390, height: 2400 });
    await page.locator('[data-disclosure="copy-us"]').evaluate((el: HTMLElement) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150));
    await shot(page, '01_panel_us_headings_labels_390');
    await page.setViewportSize({ width: 390, height: 844 });

    await editPage(page, 'rsvp');
    await unfold(page, '[data-disclosure="copy-rsvp"]');
    const rkeys = await page.locator('[data-copy-fields="rsvp"] [data-copy-row]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-copy-row')));
    check('RSVP page: the RSVP heading first', rkeys[0] === 'rsvp_title', rkeys.slice(0, 4).join());
    await page.fill('#f-copy-rsvp_title', 'Can you make it?');
    await page.waitForSelector('[data-changes-bar]', { timeout: 10_000 });
    await page.waitForFunction(() => (document.querySelector('[data-changes-count]')?.textContent ?? '') === '2', null, { timeout: 15_000 }).catch(() => null);
    check('the design texts count like any edit: "Unpublished changes: 2" (Us, RSVP)', (await page.locator('[data-changes-count]').innerText()) === '2', await page.locator('[data-changes-count]').innerText());

    await page.locator('button', { hasText: 'Preview this page' }).click();
    const frame = page.frameLocator('iframe[title="Preview of your website"]');
    const shown = await frame.locator('h1', { hasText: 'Can you make it?' }).waitFor({ timeout: 25_000 }).then(() => true, () => false);
    check('Preview this page: the RSVP page with the new heading (live preview after the autosave)', shown);
    await page.waitForTimeout(3000);
    await shot(page, '02_panel_preview_rsvp_390');
    await page.click('[data-close-preview]');

    await page.click('[data-changes-review]');
    const us = page.locator('[data-review-item="us"]');
    await us.waitFor();
    const rsvp = page.locator('[data-review-item="rsvp"]');
    check('Review: "Us · Headings & labels"', (await us.innerText()).replace(/\s+/g, ' ') === 'Us Headings & labels', (await us.innerText()).replace(/\s+/g, ' '));
    check('Review: "RSVP · Headings & labels"', (await rsvp.innerText()).replace(/\s+/g, ' ') === 'RSVP Headings & labels', (await rsvp.innerText()).replace(/\s+/g, ' '));
    await shot(page, '03_panel_review_390');
    await page.click('[data-review-publish]');
    const live = await page.waitForSelector('[data-testid="live"]', { timeout: 30_000 }).then(() => true, () => false);
    check('Publish from Review: "Your website is live"', live);
    await page.keyboard.press('Escape');

    const rights = await page.evaluate(async ({ slug, key }: { slug: string; key: string }) => {
      const r = await fetch(`/api/edit/${slug}`, { headers: { authorization: `Bearer ${key}` } });
      return (await r.json()).state.rights;
    }, { slug: panelSite.slug, key: panelSite.editKey });
    check('no name/date change was used (rights: 0 used)', rights.used === 0 && rights.remaining === rights.limit + rights.granted, JSON.stringify({ used: rights.used, remaining: rights.remaining }));

    await guest.goto(`${BASE}/${panelSite.slug}`, { waitUntil: 'networkidle' });
    check('guest envelope: the couple\'s line', (await text(guest, '.env-head .kicker')) === 'Come celebrate with us');
    check('guest envelope: the suggestion\'s card line', (await text(guest, '.card-copy .script')) === 'We’re renewing our vows');
    await guest.goto(`${BASE}/${panelSite.slug}/home`, { waitUntil: 'networkidle' });
    check('guest home: the invitation line of the suggestion', (await text(guest, '.invite-text .request')) === 'invite you to celebrate the renewal of their vows');
    check('guest home: the RSVP heading follows everywhere it appears', (await text(guest, '.v-rsvp .v-title')) === 'Can you make it?');
    await guest.goto(`${BASE}/${panelSite.slug}/rsvp`, { waitUntil: 'networkidle' });
    check('guest RSVP page: the new heading', (await text(guest, 'h1')) === 'Can you make it?');

    // reset: back to the design's text
    await page.goto(`${panel}#edit/us`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await unfold(page, '[data-disclosure="copy-us"]');
    await page.click('[data-copy-reset="envelope_kicker"]');
    check('Reset to design text: the box is empty again, the design\'s text in grey', (await page.locator('#f-copy-envelope_kicker').inputValue()) === '' && !(await page.locator('[data-copy-reset="envelope_kicker"]').count()));
    await page.locator('[data-copy-row="envelope_kicker"]').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
    await shot(page, '04_panel_reset_390');
    await page.waitForSelector('[data-changes-bar] [data-publish]');
    await page.waitForTimeout(1500);
    await page.click('[data-changes-bar] [data-publish]');
    await page.waitForSelector('[data-testid="live"]', { timeout: 20_000 });
    await guest.goto(`${BASE}/${panelSite.slug}`, { waitUntil: 'networkidle' });
    check('after the reset + publish, guests see the design\'s text again', (await text(guest, '.env-head .kicker')) === 'You are invited');
    check('panel: no page error', !errors.length, errors.join(' | '));
    await ctx.close();
  });

  // wide screens: the preview next to the editor follows the text being edited
  await block('panel 1280: the preview follows the design text', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/edit/${panelSite.slug}?k=${encodeURIComponent(panelSite.editKey)}#edit/details`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const frameSrc = () => page.evaluate(() => document.querySelector('iframe[title="Preview of your website"]')?.getAttribute('src') ?? '');
    check('1280: Details shows the Day page next to the editor', /\/g068-panel\/details\?/.test(await frameSrc()), await frameSrc());
    await unfold(page, '[data-disclosure="copy-details"]');
    await page.locator('#f-copy-registry_title').focus();
    await page.waitForTimeout(300);
    check('1280: a Details text shown on the Day page keeps the preview there', /\/g068-panel\/details\?/.test(await frameSrc()), await frameSrc());
    await editPage(page, 'story');
    await unfold(page, '[data-disclosure="copy-story"]');
    await page.locator('#f-copy-home_story_cue').focus();
    const followed = await page.waitForFunction(() => /\/home\?/.test(document.querySelector('iframe[title="Preview of your website"]')?.getAttribute('src') ?? ''), null, { timeout: 5000 }).then(() => true, () => false);
    check('1280: focusing a text shown on the home page moves the preview to home', followed);
    await ctx.close();
  });

  // ------------------------------------------------------------------------------------------ guests (both designs)
  for (const [theme, site] of Object.entries(guests)) {
    await block(`guest pages with the couple's headings: ${theme}`, async () => {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e: any) => errors.push(String(e)));
      page.on('console', (m: any) => m.type() === 'error' && errors.push(m.text()));
      await page.goto(`${BASE}/${site.slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      check(`${theme}: envelope line`, (await text(page, '.env-head .kicker')) === GUEST_COPY.envelope_kicker);
      await shot(page, `05_guest_index_${theme}_390`);
      await page.goto(`${BASE}/${site.slug}/details`, { waitUntil: 'networkidle' });
      await settle(page);
      check(`${theme}: schedule heading`, (await text(page, '[data-copy="schedule_title"]')) === GUEST_COPY.schedule_title);
      check(`${theme}: calendar line`, (await text(page, '[data-copy="calendar_title"]')) === GUEST_COPY.calendar_title);
      check(`${theme}: the menu`, (await text(page, '.site-nav [data-copy="nav_details"]')) === GUEST_COPY.nav_details && (await text(page, '.site-nav [data-copy="nav_rsvp"]')) === GUEST_COPY.nav_rsvp);
      await flattenNav(page);
      await shot(page, `06_guest_details_${theme}_390`, true);
      await page.goto(`${BASE}/${site.slug}/rsvp`, { waitUntil: 'networkidle' });
      await settle(page);
      check(`${theme}: RSVP heading, reply-by line and the form's button`, (await text(page, 'h1')) === GUEST_COPY.rsvp_title && (await text(page, '[data-copy="rsvp_by"]')) === GUEST_COPY.rsvp_by && (await text(page, 'button[type="submit"]')) === GUEST_COPY.form_send);
      check(`${theme}: the tab title follows the menu's RSVP word`, (await page.title()).startsWith(`${GUEST_COPY.nav_rsvp} · `), await page.title());
      await flattenNav(page);
      await shot(page, `07_guest_rsvp_${theme}_390`, true);
      const bad: string[] = [];
      for (const p of ['', '/home', '/story', '/details', '/rsvp']) {
        await page.goto(`${BASE}/${site.slug}${p}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(200);
        for (const x of await pageProblems(page)) bad.push(`${p || '/'}: ${x}`);
      }
      check(`${theme} 390: five pages without horizontal scroll or broken image`, !bad.length, bad.join('; '));
      check(`${theme}: no console or page error`, !errors.length, errors.slice(0, 3).join(' | '));
      await ctx.close();
    });
  }
} finally {
  await browser?.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), passed: checks.length - failed.length, failed: failed.length, checks }, null, 1) + '\n');
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → ${path.relative(ROOT, OUT)}`);
process.exit(failed.length ? 1 : 0);
