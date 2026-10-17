// Browser checks of G121 (docs/18 P2 + docs/19 §6 remainder): real `next start` + Chromium. Not part of `npm test`
// (needs a build):
//
//   npm run build
//   PORT=3490 NODE_PATH=/opt/node22/lib/node_modules node tests/g121-browser.ts
//
// 1. Setup: step 2 asks for the opening photo only (the other places named, left to Edit → Photos) and "Skip for now"
//    sits beside "Continue" with the same weight; step 3 says in one sentence what publishing does.
// 2. Home: one calm status label with its action beside it (the bar does not repeat "Live" there); a smaller names
//    heading; Settings value rows (time zone, date style, name & date changes, guest password) open their places.
// 3. Editor: the "Unpublished changes" bar only while the draft differs from the live website (typing back the old text
//    hides it again); "Saved" shows in words after an autosave; Review has a preview button per changed page.
// 4. Share: the link first; the QR code folded like the password and the edit link. Guests (no replies): no e-mail
//    notifications said plainly. /start: the Home Screen tip.
// 5. Admin site page: facts → note → Etsy message → support actions → … → high-impact actions apart → history; the message
//    can be edited (a decided [POLICY] filled in by hand), copying it leaves a history line; the box opens with the
//    fitting template; "Vazgeç" left of "Kalıcı olarak sil"; the wrong-design hint on an unpublished draft; an order
//    number without a website in the order search.
// 6. Sales site: /designs style filter (CSS only — also without JavaScript), the designs right after the hero on /.
// axe-core (serious/critical = 0), touch targets ≥ 44 px (panel) / ≥ 36 px (admin, as G087), no horizontal scroll.
// Screenshots (390 / 1280) + checks.json → previews/g121/ (or $G121_SHOTS_DIR). Exit 1 on a failed check.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { designStyles, liveDesigns } from '../lib/marketing/designs.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');

const PORT = Number(process.env.PORT || 3490);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G121_SHOTS_DIR || path.join(ROOT, 'previews/g121');
const PASSWORD = 'g121-browser-test-password';
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g121-browser-data-'));
mkdirSync(OUT, { recursive: true });

const THEME = 'blush-garden-rose';
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const adapter = new LocalAdapter(dataDir);

// A: never published → setup. B: published with the design's sample text, no replies → Home, editor, Share, Guests.
const setupSite = await createSiteWithKeys(adapter, { slug: 'elena-and-marco', theme: THEME, content: draftFromDemo(demo, ['Elena', 'Marco']) });
const liveSite = await createSiteWithKeys(adapter, { slug: 'nora-and-sam', theme: THEME, content: draftFromDemo(demo, ['Nora', 'Sam']) });
await publishSite(adapter, liveSite.site.id);
// C: an order the shop still has to confirm (admin). D: live and closing in 15 days (admin: "closing soon" message).
const pendingSite = await createSiteWithKeys(adapter, {
  slug: 'emma-and-liam',
  theme: THEME,
  content: draftFromDemo(demo, ['Emma', 'Liam']),
  orderRef: '3456789012',
  ownerEmail: 'emma@example.com',
  orderCheck: { status: 'pending', at: new Date().toISOString(), by: 'claim' },
});
const closingSite = await createSiteWithKeys(adapter, { slug: 'ada-and-grace', theme: THEME, content: draftFromDemo(demo, ['Ada', 'Grace']), orderRef: '4567890123', ownerEmail: 'ada@example.com' });
await publishSite(adapter, closingSite.site.id);
await setArchiveOverride(adapter, closingSite.site.id, isoDay(15), 'test: closing soon');

// E: a design that opens from a book (13): the panel names its opening "Book", not "Envelope".
const bookDemo = JSON.parse(readFileSync(path.join(ROOT, 'themes/enchanted-forest-storybook/content.demo.json'), 'utf8')) as ContentRecord;
const bookSite = await createSiteWithKeys(adapter, { slug: 'aurora-and-rowan', theme: 'enchanted-forest-storybook', content: draftFromDemo(bookDemo, ['Aurora', 'Rowan']) });
await publishSite(adapter, bookSite.site.id);

const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;
const SETUP = editUrl('elena-and-marco', setupSite.editKey);
const LIVE = editUrl('nora-and-sam', liveSite.editKey);
const LIVE_PUBLIC = `${BASE}/nora-and-sam`;

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
async function block(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    check(`${name}: ran to the end`, false, String((e as Error)?.stack ?? e).slice(0, 800));
  }
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'America/New_York', locale: 'en-US' };
const WIDE = { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, timezoneId: 'America/New_York', locale: 'en-US' };
const ADMIN_PHONE = { ...PHONE, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' };
const ADMIN_WIDE = { ...WIDE, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' };
const shot = async (page: any, name: string, opts: { full?: boolean } = {}) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: Boolean(opts.full) });
};
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - window.innerWidth);
const text = async (page: any, sel: string) => ((await page.locator(sel).first().innerText()) as string).replace(/\s+/g, ' ').trim();
async function waitSaved(page: any) {
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') !== 'saved', null, { timeout: 1500 }).catch(() => undefined);
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
}
async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  check(`a11y (axe-core): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}
/** Visible interactive elements smaller than min × min px (inline links / buttons inside running text excepted, WCAG 2.5.8). */
async function smallTargets(page: any, scope: string, min = 44): Promise<string[]> {
  return page.evaluate(
    ([root, m]: [string, number]) => {
      const out: string[] = [];
      for (const el of document.querySelector(root)!.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea')) {
        if (el.closest('p') && (el.tagName === 'A' || el.tagName === 'BUTTON')) continue;
        if (el.matches('input[type=radio], input[type=file]')) continue;
        if (el.matches('input[type=checkbox]') && el.closest('label')) continue;
        if (el.matches('[role="switch"]')) continue;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[inert], [hidden]')) continue;
        if (r.height < m - 0.5 || r.width < m - 0.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return out;
    },
    [scope, min],
  );
}
async function targets(page: any, view: string, scope: string, min = 44) {
  const small = await smallTargets(page, scope, min);
  check(`${view}: touch targets ≥ ${min} px`, small.length === 0, small.join('; '));
}
const box = async (page: any, sel: string) => (await page.locator(sel).first().boundingBox()) as { x: number; y: number; width: number; height: number };

const server = startNext({ port: PORT, dataDir, env: { ADMIN_PASSWORD: PASSWORD } });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 60_000, server);
  browser = await chromium.launch();

  // =========================================================================== 1. setup steps 2 and 3
  await block('setup', async () => {
    for (const width of [390, 1280]) {
      const ctx = await browser.newContext(width === 1280 ? WIDE : PHONE);
      const page = await ctx.newPage();
      await page.goto(`${SETUP}#setup/2`);
      await page.waitForSelector('[data-setup="2"]');
      await page.waitForTimeout(600);
      if (width === 390) {
        const later = await text(page, '[data-more-photos-later]');
        check('setup 2: one photo place (the opening photo); no "More photos" fold', (await page.locator('[data-setup="2"] [data-photo-slot]').count()) === 1 && (await page.locator('[data-disclosure="more-photos"]').count()) === 0);
        check('setup 2: the other photo places are named and left to Edit → Photos', /\d+ more photo places/.test(later) && later.includes('Edit → Photos'), later);
        const skip = await box(page, '[data-setup-skip]');
        const next = await box(page, '[data-setup-next]');
        check('setup 2: "Skip for now" beside "Continue", same row and same weight (a button, not a small link)', Math.abs(skip.y - next.y) <= 2 && skip.height >= 44 && Math.abs(skip.height - next.height) <= 2 && skip.width >= next.width * 0.6, JSON.stringify({ skip, next }));
        check('setup 2: Skip is no longer underlined text', (await page.evaluate(() => getComputedStyle(document.querySelector('[data-setup-skip]')!).textDecorationLine)) !== 'underline');
        await axe(page, 'setup 2');
        await targets(page, 'setup 2', '[data-setup]');
        check('setup 2: no horizontal scroll at 390', (await overflow(page)) <= 0);
      }
      await shot(page, `01_setup2_${width}`);
      await page.goto(`${SETUP}#setup/3`);
      await page.waitForSelector('[data-setup="3"]');
      await page.waitForTimeout(900);
      if (width === 390) {
        const explain = await text(page, '[data-publish-explain]');
        const e = await box(page, '[data-publish-explain]');
        const pub = await box(page, '[data-setup-publish]');
        check('setup 3: one sentence on what publishing does, right above "Publish my website"', explain === 'Guests can open your website with the link. You can keep editing after.' && e.y + e.height <= pub.y + 1, explain);
        check('setup 3: no Skip on the publish step', (await page.locator('[data-setup-skip]').count()) === 0);
      }
      await shot(page, `02_setup3_${width}`);
      if (width === 390) {
        await page.setViewportSize({ width: 320, height: 640 });
        await page.goto(`${SETUP}#setup/2`);
        await page.waitForSelector('[data-setup="2"]');
        await page.waitForTimeout(400);
        const on = await page.evaluate(() => [...document.querySelectorAll('footer button')].every((b) => { const r = b.getBoundingClientRect(); return r.left >= 0 && r.right <= window.innerWidth + 0.5; }));
        check('setup 2 at 320 px: Back, Skip and Continue stay on screen; no horizontal scroll', on && (await overflow(page)) <= 0);
        await shot(page, '01_setup2_320');
      }
      await ctx.close();
    }
  });

  // =========================================================================== 2. Home: status + Settings
  await block('home', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${LIVE}#home`);
    await page.waitForSelector('[data-status-card]');
    await page.waitForTimeout(800);
    const badge = await box(page, '[data-status-card] [class*="badge"]');
    const action = await box(page, '[data-status-action]');
    check('home: one status label with its action beside it ("Live" · Share)', (await text(page, '[data-status-card]')).startsWith('Live') && (await text(page, '[data-status-action]')) === 'Share' && Math.abs(badge.y + badge.height / 2 - (action.y + action.height / 2)) <= 6, JSON.stringify({ badge, action }));
    check('home: the bar does not repeat "Live"', (await page.locator('header [data-live-badge]').count()) === 0 && (await page.locator('header [data-publish]').count()) === 0);
    const size = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('main h1')!).fontSize));
    check('home: the names heading is smaller (≤ 40 px)', size <= 40, String(size));
    const rows = await page.locator('[data-setting]').evaluateAll((els: Element[]) => els.map((e) => `${e.getAttribute('data-setting')}=${[...e.querySelectorAll('span')].map((x) => (x.textContent ?? '').trim()).join(' ')}`));
    check('home: Settings rows — time zone, date style, name & date changes left, guest password', rows.length === 4 && /^timezone=Time zone New York/.test(rows[0]) && /^locale=Date style Month first/.test(rows[1]) && /^changes=Name & date changes left 3 of 3/.test(rows[2]) && /^password=Guest password Off/.test(rows[3]), rows.join(' | '));
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '03_home_390');
    await shot(page, '03_home_390_full', { full: true });
    await axe(page, 'home');
    await targets(page, 'home', 'main');
    // each row opens its place
    await page.click('[data-setting="timezone"]');
    await page.waitForSelector('#f-timezone', { state: 'visible', timeout: 10_000 });
    await page.waitForTimeout(400);
    check('Settings → Time zone: Day & place with "More options" open, the time zone field focused', /#edit\//.test(page.url()) && (await page.getAttribute('[data-disclosure="date-more"] button[aria-expanded]', 'aria-expanded')) === 'true' && (await page.evaluate(() => document.activeElement?.id)) === 'f-timezone', page.url());
    await shot(page, '03b_settings_timezone_390');
    await page.click('[data-nav="home"]');
    await page.waitForSelector('[data-setting="locale"]');
    await page.click('[data-setting="locale"]');
    await page.waitForSelector('#f-locale', { state: 'visible', timeout: 10_000 });
    check('Settings → Date style: the date style choice is on screen', await page.locator('#f-locale').isVisible());
    await page.click('[data-nav="home"]');
    await page.waitForSelector('[data-setting="password"]');
    await page.click('[data-setting="password"]');
    await page.waitForSelector('[data-share-url]');
    check('Settings → Guest password: Share (where the password is)', page.url().endsWith('#share') && (await page.locator('[data-disclosure="password"]').count()) === 1);
    await page.click('[data-nav="home"]');
    await page.waitForSelector('[data-setting="changes"]');
    await page.click('[data-setting="changes"]');
    await page.waitForSelector('[data-testid="help"]');
    check('Settings → Name & date changes: Help opens on the change rule', (await text(page, '[data-testid="help"]')).includes('How do name and date changes work?'));
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`${LIVE}#home`);
    await page.waitForSelector('[data-settings-card]');
    await page.waitForTimeout(400);
    check('home at 320 px: no horizontal scroll', (await overflow(page)) <= 0, String(await overflow(page)));
    await ctx.close();

    const wide = await browser.newContext(WIDE);
    const wp = await wide.newPage();
    await wp.goto(`${LIVE}#home`);
    await wp.waitForSelector('[data-settings-card]');
    await wp.waitForTimeout(1500);
    await shot(wp, '03_home_1280');
    check('home at 1280: no horizontal scroll', (await overflow(wp)) <= 0);
    await wide.close();

    // a draft with a long action: the action gets its own row (no squeezed button)
    const d = await browser.newContext(PHONE);
    const dp = await d.newPage();
    await dp.goto(`${SETUP}#home`);
    await dp.waitForSelector('[data-status-card]');
    await dp.waitForTimeout(500);
    const label = await text(dp, '[data-status-action]');
    const card = await box(dp, '[data-status-card]');
    const btn = await box(dp, '[data-status-action]');
    check('home (draft): "Continue setup · Step n of 3" on its own full-width row', /^Continue setup · Step \d of 3$/.test(label) && btn.width >= card.width - 2 * 24 - 2, `${label} ${Math.round(btn.width)}/${Math.round(card.width)}`);
    await shot(dp, '03c_home_draft_390');
    await d.close();
  });

  // =========================================================================== 3. editor: changes bar, "Saved", Review
  await block('editor', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${LIVE}#edit/day`);
    await page.waitForSelector('#f-venue-name');
    await page.waitForTimeout(600);
    const orig = await page.inputValue('#f-venue-name');
    check('editor: up to date — no changes bar, the calm "Live" label in the bar', (await page.locator('[data-changes-bar]').count()) === 0 && (await page.locator('[data-live-badge]').count()) === 1);
    await page.fill('#f-venue-name', `${orig} Hall`);
    await page.waitForSelector('[data-changes-bar]', { timeout: 5000 });
    check('editor: a real change brings the "Unpublished changes" bar at once', true);
    await waitSaved(page);
    const flash = await page.evaluate(() => {
      const el = document.querySelector('[data-save-flash]');
      const t = el?.querySelector('[data-save-text]') as HTMLElement | null;
      const r = t?.getBoundingClientRect();
      return { on: Boolean(el), text: (t?.textContent ?? '').trim(), w: r ? Math.round(r.width) : 0 };
    });
    check('editor: after the autosave "Saved" shows in words on a phone', flash.on && flash.text === 'Saved' && flash.w > 20, JSON.stringify(flash));
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '04_changes_saved_390');
    await page.waitForTimeout(3000);
    check('editor: "Saved" goes back to the quiet icon after a moment', (await page.locator('[data-save-flash]').count()) === 0);
    // Review: a preview button per changed page
    await page.click('[data-changes-review]');
    await page.waitForSelector('[data-testid="review"]');
    const items = await page.locator('[data-review-item]').count();
    const previews = await page.locator('[data-review-preview]').count();
    check('Review: every changed page has its own preview button', items >= 1 && previews === items, `${items}/${previews}`);
    const pv = await box(page, '[data-review-preview]');
    check('Review: the preview button is a 44 px+ target', pv.width >= 44 && pv.height >= 44, JSON.stringify(pv));
    await shot(page, '05_review_390');
    await axe(page, 'Review sheet');
    await page.click('[data-review-preview]');
    await page.waitForSelector('[data-testid="review"]', { state: 'detached' });
    await page.waitForTimeout(800);
    check('Review → preview: the phone preview opens (the review sheet closes)', await page.locator('[data-preview] iframe').isVisible());
    await shot(page, '05b_review_preview_390');
    await page.goBack();
    await page.waitForTimeout(500);
    // type the old text back: the draft equals the live website again → the bar goes away by itself
    await page.fill('#f-venue-name', orig);
    await waitSaved(page);
    await page.waitForSelector('[data-changes-bar]', { state: 'detached', timeout: 10_000 }).catch(() => undefined);
    check('editor: back to the published text — the changes bar goes away, "Live" returns', (await page.locator('[data-changes-bar]').count()) === 0 && (await page.locator('[data-live-badge]').count()) === 1);
    await ctx.close();
  });

  // =========================================================================== 3b. the design's own opening name
  await block('opening name', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const book = editUrl('aurora-and-rowan', bookSite.editKey);
    await page.goto(`${book}#edit/us`);
    await page.waitForSelector('[data-open-preview]');
    await page.waitForTimeout(500);
    await page.click('[data-open-preview]');
    await page.waitForSelector('[data-preview] [role="tab"]');
    const tabs = await page.locator('[data-preview] [role="tab"]').allInnerTexts();
    check('opening name: a book design\'s first preview tab says "Book" (not "Envelope")', tabs[0]?.trim() === 'Book', tabs.join(' | '));
    await shot(page, '05c_preview_tab_book_390');
    await page.goBack();
    await page.waitForTimeout(400);
    await page.click('[data-disclosure="copy-us"] button[aria-expanded]');
    const labels: string[] = await page.locator('[data-copy-row] label').allInnerTexts();
    check('opening name: the editable-text rows say "on the book"', labels.some((l) => l.includes('Above your names on the book')) && !labels.some((l) => /envelope/i.test(l)), labels.slice(0, 4).join(' | '));
    // a published site: the names sit behind "Change" — its sheet says where they appear
    await page.click('[data-change-identity="names"]');
    await page.waitForSelector('[data-testid="identity"]');
    const hint = await text(page, '[data-testid="identity"]');
    check('opening name: "Change names or date" says the names are "on the book"', hint.includes('Your names and date are on the book, the page titles'), hint.slice(0, 160));
    await page.keyboard.press('Escape');
    await ctx.close();
    // an envelope design keeps "Envelope"
    const c2 = await browser.newContext(PHONE);
    const p2 = await c2.newPage();
    await p2.goto(`${LIVE}#home`);
    await p2.waitForSelector('[data-open-preview]');
    await p2.click('[data-open-preview]');
    await p2.waitForSelector('[data-preview] [role="tab"]');
    check('opening name: an envelope design\'s first tab stays "Envelope"', (await p2.locator('[data-preview] [role="tab"]').first().innerText()).trim() === 'Envelope');
    await c2.close();
  });

  // =========================================================================== 4. Share, Guests, /start
  await block('share', async () => {
    for (const width of [390, 1280]) {
      const ctx = await browser.newContext(width === 1280 ? WIDE : PHONE);
      const page = await ctx.newPage();
      await page.goto(`${LIVE}#share`);
      await page.waitForSelector('[data-share-url]');
      await page.waitForTimeout(600);
      if (width === 390) {
        const folds = await page.locator('[data-disclosure] button[aria-expanded]').evaluateAll((els: Element[]) =>
          els.map((e) => `${e.closest('[data-disclosure]')!.getAttribute('data-disclosure')}:${e.getAttribute('aria-expanded')}`),
        );
        check('Share: the link first; QR code, guest password and edit link folded', folds.join(',') === 'qr:false,password:false,edit-link:false', folds.join(','));
        check('Share: the QR fold keeps its name "QR code for printed cards"', (await text(page, '[data-disclosure="qr"] button')).startsWith('QR code for printed cards'));
        const copy = await box(page, 'main [data-share-url] ~ div button');
        check('Share: Copy is on the first screen', copy.y + copy.height <= 844);
        const last = await page.evaluate(() => {
          const btns = [...document.querySelectorAll('main button')].filter((b) => (b as HTMLElement).offsetParent !== null);
          return (btns.at(-1)?.textContent ?? '').trim();
        });
        check('Share: "Take the website offline" is the last action', last === 'Take the website offline', last);
        await shot(page, '06_share_390');
        await axe(page, 'Share');
        await targets(page, 'Share', 'main');
        await page.click('[data-disclosure="qr"] button[aria-expanded]');
        const qr = page.locator('[data-share-qr] svg[role="img"]');
        await qr.waitFor({ state: 'visible' });
        check('Share: the opened fold shows the QR code of the public address', (await qr.getAttribute('data-qr-text')) === LIVE_PUBLIC);
        await qr.scrollIntoViewIfNeeded();
        await shot(page, '06b_share_qr_open_390');
        // Guests without replies: plain about e-mail
        await page.click('[data-nav="guests"]');
        await page.waitForTimeout(1200);
        const g = await text(page, 'main');
        check('Guests (no replies): says new replies show here and no e-mail notifications are sent yet', g.includes('New replies show here; we don’t send email notifications yet.'), g.slice(0, 200));
        await shot(page, '07_guests_empty_390');
      } else await shot(page, '06_share_1280');
      await ctx.close();
    }
  });

  await block('/start', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/start?theme=${THEME}`);
    await page.fill('#start-order', '5678901234');
    await page.fill('#start-email', 'buyer@example.com');
    await page.fill('#start-name1', 'Mia');
    if (await page.locator('#start-name2').count()) await page.fill('#start-name2', 'Noah');
    await page.waitForTimeout(700);
    await page.click('button[type=submit]');
    await page.waitForSelector('#start-edit-link', { timeout: 15_000 });
    check('/start: "Tip: once your editor is open, add it to your Home Screen."', (await text(page, '[data-home-screen-tip]')) === 'Tip: once your editor is open, add it to your Home Screen.');
    const tip = await box(page, '[data-home-screen-tip]');
    const open = await box(page, '[data-open-editor]');
    check('/start: the tip sits under "Open my editor"', tip.y > open.y);
    await shot(page, '08_start_result_390', { full: true });
    await axe(page, '/start result');
    await ctx.close();
  });

  // =========================================================================== 5. admin
  await block('admin', async () => {
    const ctx = await browser.newContext(ADMIN_PHONE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/admin`);
    await page.waitForSelector('[data-admin-login]');
    await page.fill('#admin-password', PASSWORD);
    await page.click('[data-admin-login] button[type=submit]');
    await page.waitForSelector('[data-kpis]', { timeout: 15_000 });
    await page.goto(`${BASE}/admin/site/${pendingSite.site.id}`);
    await page.waitForSelector('#msg-text');
    const order = await page.evaluate(() => [...document.querySelectorAll('main h2[id]')].map((h) => h.id));
    const want = ['todo-title', 'facts-title', 'note-title', 'msg-title', 'actions-title', 'content-title', 'rsvp-title', 'danger-title', 'history-title'];
    check('admin site: facts → note → Etsy message → support actions → content → replies → high-impact → history', JSON.stringify(order) === JSON.stringify(want), order.join(' > '));
    check('admin site: "Yayından kaldır" left the support actions; it is in the high-impact card with "Siteyi sil"', (await page.locator('section[aria-labelledby="actions-title"] [data-unpublish], section[aria-labelledby="actions-title"] [data-action^="unpublish"]').count()) === 0 && (await page.locator('[data-danger] [data-unpublish]').count()) === 1 && (await page.locator('[data-danger] [data-delete]').count()) === 1);
    check('admin site: the message box opens with "Publish is waiting" for a waiting order', (await page.inputValue('#msg-template')) === 'publish_blocked_pending');
    // G135: "Publish is waiting" no longer holds an undecided time → copyable as it is; date_moved still waits for a policy.
    check('admin site: "Publish is waiting" can be copied as it is (G135)', (await page.locator('[data-message-missing]').count()) === 0 && (await page.locator('[data-action="copy-message"]').count()) === 1);
    await page.selectOption('#msg-template', 'date_moved');
    check('admin site: a text with an undecided policy cannot be copied', (await page.locator('[data-message-missing]').count()) === 1 && (await page.locator('[data-action="copy-message"]').count()) === 0);
    const original = await page.inputValue('#msg-text');
    await page.fill('#msg-text', original.replace('[POSTPONEMENT POLICY]', '24 hours'));
    check('admin site: the shop fills the policy in by hand → the message can be copied, "Şablona dön" appears', (await page.locator('[data-message-missing]').count()) === 0 && (await page.locator('[data-action="copy-message"]').count()) === 1 && (await page.locator('[data-action="message-reset"]').count()) === 1);
    await page.click('[data-action="copy-message"]');
    await page.waitForFunction(() => document.querySelector('section[aria-labelledby="history-title"]')?.textContent?.includes('Etsy mesajı kopyalandı'), null, { timeout: 10_000 });
    const hist = await text(page, 'section[aria-labelledby="history-title"]');
    check('admin site: copying writes the template (not the text) into Geçmiş', hist.includes('Etsy mesajı kopyalandı: Düğün tarihi değişti') && !hist.includes('24 hours'), hist.slice(0, 200));
    await page.click('[data-action="message-reset"]');
    check('admin site: "Şablona dön" brings the template text back', (await page.inputValue('#msg-text')) === original);
    check('admin site: the wrong-design hint on an unpublished draft (delete → Yeni sipariş)', (await text(page, '[data-wrong-design]')).includes('Yeni sipariş'));
    await page.fill('#delete-confirm', 'emma');
    const cancel = await box(page, '[data-action="delete-cancel"]');
    const del = await box(page, '[data-action="delete"]');
    check('admin site: "Vazgeç" on the left, "Kalıcı olarak sil" on the right', cancel.x + cancel.width <= del.x && Math.abs(cancel.y - del.y) <= 2, JSON.stringify({ cancel, del }));
    await page.click('[data-action="delete-cancel"]');
    check('admin site: "Vazgeç" clears the typed address', (await page.inputValue('#delete-confirm')) === '');
    check('admin site 390: no horizontal scroll', (await overflow(page)) <= 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '09_admin_site_390', { full: true });
    await axe(page, 'admin site');
    await targets(page, 'admin site', 'main', 36);
    // closing soon → "Site yakında kapanıyor"
    await page.goto(`${BASE}/admin/site/${closingSite.site.id}`);
    await page.waitForSelector('#msg-template');
    check('admin site: a live site closing within 30 days opens with "Site yakında kapanıyor"', (await page.inputValue('#msg-template')) === 'archive_notice');
    // order search: a number without a website
    await page.goto(`${BASE}/admin/orders`);
    await page.waitForSelector('#admin-search');
    await page.click('[data-filter="all"]');
    await page.fill('#admin-search', '#9988 7766 55');
    await page.waitForSelector('[data-not-started]');
    check('admin orders: an order number with no website says so and points to the start-link reminder / Yeni sipariş', (await page.getAttribute('[data-not-started]', 'data-not-started')) === '9988776655' && (await text(page, '[data-not-started]')).includes('Tasarımlar'));
    await shot(page, '10_admin_orders_not_started_390');
    await page.fill('#admin-search', '3456789012');
    await page.waitForTimeout(300);
    check('admin orders: a number that has a website shows the site, not the hint', (await page.locator('[data-not-started]').count()) === 0 && (await page.locator('[data-site="emma-and-liam"]').count()) === 1);
    await ctx.close();

    const wide = await browser.newContext(ADMIN_WIDE);
    const wp = await wide.newPage();
    await wp.goto(`${BASE}/admin`);
    await wp.waitForSelector('[data-admin-login]');
    await wp.fill('#admin-password', PASSWORD);
    await wp.click('[data-admin-login] button[type=submit]');
    await wp.waitForSelector('[data-kpis]', { timeout: 15_000 });
    await wp.goto(`${BASE}/admin/site/${pendingSite.site.id}`);
    await wp.waitForSelector('#msg-text');
    await shot(wp, '09_admin_site_1280', { full: true });
    check('admin site 1280: no horizontal scroll', (await overflow(wp)) <= 0);
    await wide.close();
  });

  // =========================================================================== 6. sales site
  await block('sales site', async () => {
    const live = liveDesigns();
    const expected = (style: string) => live.filter((d) => designStyles(d.id).includes(style as never)).length;
    const visible = (page: any) => page.evaluate(() => [...document.querySelectorAll('[data-gallery] article')].filter((a) => getComputedStyle(a).display !== 'none').length);
    for (const width of [390, 1280]) {
      const ctx = await browser.newContext(width === 1280 ? WIDE : PHONE);
      const page = await ctx.newPage();
      await page.goto(`${BASE}/designs`);
      await page.waitForSelector('[data-style-filter]');
      const chips = await page.locator('[data-style-filter] label').count();
      check(`/designs ${width}: style filter with "All" + 6 styles`, chips === 7, String(chips));
      check(`/designs ${width}: "All" shows every design`, (await visible(page)) === live.length);
      const pick = width === 390 ? 'seasonal' : 'classic';
      await page.click(`#style-${pick}`); // the (transparent) radio lies over its chip, as for a finger
      await page.waitForTimeout(200);
      const shown = await visible(page);
      const right = await page.evaluate((s: string) => [...document.querySelectorAll('[data-gallery] article')].filter((a) => getComputedStyle(a).display !== 'none').every((a) => (a.getAttribute('data-styles') ?? '').split(' ').includes(s)), pick);
      check(`/designs ${width}: "${pick}" shows its ${expected(pick)} designs only`, shown === expected(pick) && right, String(shown));
      check(`/designs ${width}: no horizontal scroll with a style chosen`, (await overflow(page)) <= 0);
      await page.locator('[data-style-filter]').scrollIntoViewIfNeeded();
      await shot(page, `11_designs_${pick}_${width}`);
      await page.click('#style-all');
      check(`/designs ${width}: back to "All"`, (await visible(page)) === live.length);
      if (width === 390) {
        await axe(page, '/designs with the filter');
        const small = await page.evaluate(() => [...document.querySelectorAll('[data-style-filter] label')].filter((l) => l.getBoundingClientRect().height < 44).length);
        check('/designs: filter chips are 44 px tall', small === 0);
        await page.focus('#style-floral');
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(150);
        check('/designs: arrow keys move through the styles (radio group)', (await page.evaluate(() => (document.querySelector('[data-style-filter] input:checked') as HTMLInputElement).value)) === 'classic');
      }
      await ctx.close();
    }
    // without JavaScript: the same filter (CSS only)
    const nojs = await browser.newContext({ ...PHONE, javaScriptEnabled: false });
    const np = await nojs.newPage();
    await np.goto(`${BASE}/designs`);
    await np.click('#style-destination');
    await np.waitForTimeout(200);
    check('/designs without JavaScript: the filter still works', (await visible(np)) === expected('destination'));
    await nojs.close();
    // home: the designs right after the hero
    for (const width of [390, 1280]) {
      const ctx = await browser.newContext(width === 1280 ? WIDE : PHONE);
      const page = await ctx.newPage();
      await page.goto(`${BASE}/`);
      await page.waitForSelector('section[aria-labelledby="designs"]');
      const order = await page.evaluate(() => [...document.querySelectorAll('main section')].map((s) => s.getAttribute('aria-labelledby') ?? 'hero'));
      check(`home ${width}: hero, then the designs, then "What is BKE Studio?"`, order[0] === 'hero' && order[1] === 'designs' && order[2] === 'what-is', order.slice(0, 5).join(' > '));
      check(`home ${width}: no horizontal scroll`, (await overflow(page)) <= 0);
      await page.locator('section[aria-labelledby="designs"]').screenshot({ path: path.join(OUT, `12_home_designs_${width}.png`) });
      await ctx.close();
    }
  });
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), passed: checks.filter((c) => c.ok).length, failed: checks.filter((c) => !c.ok).length, checks }, null, 2) + '\n');
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed${failed.length ? `; failed: ${failed.map((f) => f.name).join(' · ')}` : ''}`);
process.exit(failed.length ? 1 : 0);
