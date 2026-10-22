// Browser checks of G145 (K45 item 1, panel audit): real `next start` + Chromium. Not part of `npm test` (needs a build):
//
//   npm run build
//   PORT=3545 NODE_PATH=/opt/node22/lib/node_modules node tests/g145-browser.ts
//
// 1. Shop edit without touching the buyer's link (docs/23 §3): admin "Düzenle" opens the editor with the shop's own
//    72-hour link (Turkish banner, no "Your private edit link" card), the buyer's link keeps working, "Dükkân linkini
//    kapat" ends it (404) and picks the "Kurulum bitti: aynı link" message; the overview lists an open shop link.
// 2. The buyer's open panel keeps saving after the shop wrote a note (was: "changed in another window", panel locked).
// 3. Long editor pages: jumps to their parts (Details, Day & place); a jump focuses the part's heading.
// 4. A question added in this visit opens without red "please write …" lines; they show after leaving its field.
// 5. Admin: one search box on the overview (→ Siparişler, every filter), design prices in the shop currency.
// 6. Languages (G144 merged): the panel in Turkish (bke_lang=tr) — the new jumps translated; Us → Languages: website in
//    EN + TR, "Translate automatically" (MyMemory faked by the browser test), approve all, publish; guests: ?lang=tr page in
//    Turkish with the language switcher, the RSVP form's errors in Turkish; the shop banner stays Turkish.
// axe-core (serious/critical = 0), touch targets ≥ 44 px (panel) / ≥ 36 px (admin), no horizontal scroll at 390.
// Screenshots + checks.json → previews/g145/ (or $G145_SHOTS_DIR). Exit 1 on a failed check.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, issueShopEditKey, publishSite } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');

const PORT = Number(process.env.PORT || 3545);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G145_SHOTS_DIR || path.join(ROOT, 'previews/g145');
const PASSWORD = 'g145-browser-test-password';
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g145-browser-data-'));
mkdirSync(OUT, { recursive: true });

const THEME = 'blush-garden-rose';
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const adapter = new LocalAdapter(dataDir);
const live = await createSiteWithKeys(adapter, {
  slug: 'mia-and-theo',
  theme: THEME,
  content: draftFromDemo(demo, ['Mia', 'Theo']),
  orderRef: '3812345678',
  ownerEmail: 'mia@example.com',
});
await publishSite(adapter, live.site.id);
const BUYER = `${BASE}/edit/mia-and-theo?k=${encodeURIComponent(live.editKey)}`;

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
const shot = async (page: any, name: string, full = false) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
};
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - window.innerWidth);
async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => `${n.target.join(' ')} ${n.any?.[0]?.message ?? ''}`).slice(0, 3).join(' | ')}`);
  });
  check(`a11y (axe-core): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}
async function smallTargets(page: any, scope: string, min: number): Promise<string[]> {
  return page.evaluate(
    ([root, m]: [string, number]) => {
      const out: string[] = [];
      for (const el of document.querySelector(root)!.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea')) {
        if (el.closest('p') && (el.tagName === 'A' || el.tagName === 'BUTTON')) continue;
        if (el.matches('input[type=radio], input[type=file], input[type=checkbox]')) continue;
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
async function targets(page: any, view: string, scope: string, min: number) {
  const small = await smallTargets(page, scope, min);
  check(`${view}: touch targets ≥ ${min} px`, small.length === 0, small.join('; '));
}
async function adminSignIn(ctx: any) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/admin`);
  await page.locator('input[type=password]').fill(PASSWORD);
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-todos]');
  return page;
}
const saveState = (page: any) => page.locator('[data-save-state]').first().getAttribute('data-save-state');

const server = startNext({ port: PORT, dataDir, env: { ADMIN_PASSWORD: PASSWORD } });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 60_000, server);
  browser = await chromium.launch();

  // =========================================================================== 1 + 2. shop edit, buyer keeps saving
  await block('shop edit', async () => {
    const buyer = await browser.newContext(PHONE);
    const bp = await buyer.newPage();
    await bp.goto(`${BUYER}#edit/story`);
    await bp.waitForSelector('[data-page="story"]');
    await bp.waitForTimeout(800);

    const admin = await browser.newContext(ADMIN_WIDE);
    const ap = await adminSignIn(admin);
    await ap.fill('#quick-q', 'mia');
    await ap.keyboard.press('Enter');
    await ap.waitForURL(/\/admin\/orders\?q=mia/);
    check('overview search → Siparişler with the query (every filter)', (await ap.locator('[data-site]').count()) === 1);
    await ap.locator('[data-site="mia-and-theo"]').click();
    await ap.waitForURL(/\/admin\/site\//);
    await ap.waitForSelector('[data-shop-edit]');

    // the shop writes a note while the buyer's panel is open; the buyer's next autosave must still land
    await ap.fill('#note-text', 'Kurulum hizmeti: test, 1 tur');
    await ap.click('[data-action="note"]');
    await ap.waitForTimeout(800);
    await bp.locator('[data-page="story"] textarea').first().fill('We met at a tiny café in Savannah and never stopped talking.');
    await bp.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 }).catch(() => undefined);
    check('buyer panel keeps saving after a shop note (no "changed in another window")', (await saveState(bp)) === 'saved', String(await saveState(bp)));

    const [tab] = await Promise.all([admin.waitForEvent('page'), ap.click('[data-quick-edit]')]);
    await tab.waitForSelector('[data-panel]', { timeout: 20_000 });
    const shopUrl = tab.url().replace(/#.*$/, '');
    check('"Düzenle" opens the editor with a link of its own', /\/edit\/mia-and-theo\?k=/.test(shopUrl) && !shopUrl.includes(encodeURIComponent(live.editKey)));
    const banner = await tab.locator('[data-shop-session]').innerText().catch(() => '');
    check('shop session: Turkish banner says until when and that the buyer link is unchanged', /Dükkân olarak düzenliyorsunuz/.test(banner) && /alıcının linki değişmedi/.test(banner), banner);
    await shot(tab, '01_shop_session_1280');
    await tab.goto(`${shopUrl}#share`);
    await tab.waitForTimeout(800);
    check('shop session: no "Your private edit link" to copy', (await tab.locator('[data-copy-edit-link]').count()) === 0);
    await tab.goto(`${shopUrl}#edit/day`);
    await tab.waitForSelector('[data-page="day"]');
    const venue = tab.locator('#f-venue-name'); // the tab follows the admin browser's language (Turkish)
    await venue.fill('Magnolia Hall');
    await tab.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
    const stored = await adapter.getSiteById(live.site.id);
    check('shop edit saved into the draft', (stored?.content as any)?.venue?.name === 'Magnolia Hall');

    await bp.reload();
    await bp.waitForSelector('[data-panel]');
    check('buyer link still opens the editor (status not "unauthorized")', (await saveState(bp)) !== 'unauthorized');

    await ap.reload();
    await ap.waitForSelector('[data-shop-edit-until]');
    check('admin: "Açık: … tarihine kadar" while the shop link works', /tarihine kadar/.test(await ap.locator('[data-shop-edit-until]').innerText()));
    await ap.goto(`${BASE}/admin`);
    check('overview: open shop link listed under Yapılacaklar', (await ap.locator('[data-todo="shop_edit"]').count()) === 1);
    await ap.goBack();
    await ap.waitForSelector('[data-action="shop-edit-end"]');
    await ap.click('[data-action="shop-edit-end"]');
    await ap.waitForTimeout(900);
    check('closing picks the "Kurulum bitti: aynı link" message', (await ap.locator('#msg-template').inputValue()) === 'setup_service_done_same_link');
    const msg = await ap.locator('[data-message-text]').inputValue();
    check('that message carries no edit link', !msg.includes('/edit/') && /same private edit link/.test(msg));
    const probe = await browser.newContext(PHONE);
    const pp = await probe.newPage();
    check('closed shop link: 404', (await pp.goto(shopUrl)).status() === 404);
    check('buyer link: 200', (await pp.goto(BUYER)).status() === 200);
    await shot(ap, '02_admin_site_shop_edit_1280', true);
    await Promise.all([buyer.close(), admin.close(), probe.close()]);
  });

  // =========================================================================== 3 + 4. jumps, deferred errors (buyer, 390)
  await block('editor pages', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${BUYER}#edit/details`);
    await page.waitForSelector('[data-page="details"]');
    await page.waitForTimeout(600);
    const jumps = await page.locator('[data-jump]').evaluateAll((es: Element[]) => es.map((e) => e.getAttribute('data-jump')));
    check('Details: jumps to Good to know, Travel & stay, Meal & menu, Questions & answers', jumps.join(',') === 'blocks,travel,menu,faq', jumps.join(','));
    await page.click('[data-jump="menu"]');
    await page.waitForTimeout(900);
    check('a jump focuses the part heading', (await page.evaluate(() => document.activeElement?.id)) === 'block-menu');
    const top = await page.evaluate(() => document.getElementById('block-menu')!.getBoundingClientRect().top);
    check('the heading is in view below the bars', top > 40 && top < 500, String(Math.round(top)));
    await axe(page, 'Details with jumps (390)');
    await targets(page, 'jumps', '[data-section-jumps]', 44);
    check('Details: no horizontal scroll at 390', (await overflow(page)) <= 0);
    await shot(page, '03_details_jumps_390');
    await page.goto(`${BUYER}#edit/day`);
    await page.waitForSelector('[data-page="day"]');
    check('Day & place: jumps to Date & time, Venue, Schedule', (await page.locator('[data-jump]').count()) === 3);
    await page.goto(`${BUYER}#edit/us`);
    await page.waitForSelector('[data-page="us"]');
    check('Us (one part): no jumps', (await page.locator('[data-section-jumps]').count()) === 0);

    await page.goto(`${BUYER}#edit/rsvp`);
    await page.waitForSelector('[data-page="rsvp"]');
    await page.locator('[data-page="rsvp"]').getByRole('button', { name: 'Add a question' }).click();
    await page.waitForTimeout(500);
    const fresh = await page.locator('[data-page="rsvp"]').innerText();
    check('a new question opens without red "please write" lines', !/Please write the question/.test(fresh), fresh.slice(0, 200));
    const q = page.locator('[data-page="rsvp"] [id^="f-rsvp-questions-"]').first();
    await q.focus();
    await page.keyboard.press('Tab');
    await page.waitForTimeout(400);
    check('…they show once its field was left', /Please write the question/.test(await page.locator('[data-page="rsvp"]').innerText()));
    await shot(page, '04_rsvp_new_question_390');
    await ctx.close();
  });

  // =========================================================================== 5. admin overview + designs (390)
  await block('admin', async () => {
    const ctx = await browser.newContext(ADMIN_PHONE);
    const page = await adminSignIn(ctx);
    await axe(page, 'admin overview with search (390)');
    await targets(page, 'admin overview', 'main', 36);
    check('admin overview: no horizontal scroll at 390', (await overflow(page)) <= 0);
    await shot(page, '05_admin_overview_390');
    await page.goto(`${BASE}/admin/designs`);
    const t = await page.locator('main').innerText();
    check('Tasarımlar: price in the shop currency (no "$")', /Fiyat: 1,190 TRY/.test(t) && !/Fiyat: \$/.test(t));
    await page.goto(`${BASE}/admin/orders`);
    await page.locator('[data-site="mia-and-theo"]').click();
    await page.waitForSelector('[data-shop-edit]');
    await page.waitForTimeout(800); // after the page transition (a fading badge once measured low contrast)
    await axe(page, 'admin site page (390)');
    check('admin site page: no horizontal scroll at 390', (await overflow(page)) <= 0);
    await shot(page, '06_admin_site_390', true);
    await ctx.close();
  });
  // =========================================================================== 6. languages (panel TR, site EN + TR)
  await block('languages', async () => {
    const ctx = await browser.newContext(PHONE);
    await ctx.addCookies([{ name: 'bke_lang', value: 'tr', url: BASE }]);
    // the keyless MyMemory service, faked: "[tr] <text>"
    let calls = 0;
    await ctx.route('https://api.mymemory.translated.net/**', (route: any) => {
      calls++;
      const q = new URL(route.request().url()).searchParams.get('q') ?? '';
      route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ responseStatus: 200, responseData: { translatedText: `[tr] ${q}` } }) });
    });
    const page = await ctx.newPage();
    await page.goto(`${BUYER}#edit/details`);
    await page.waitForSelector('[data-page="details"]');
    await page.waitForTimeout(600);
    check('panel TR: the jumps are named in Turkish', (await page.locator('[data-section-jumps]').getAttribute('aria-label')) === 'Bu sayfada' && !(await page.locator('[data-jump="travel"]').innerText()).includes('Travel'), await page.locator('[data-jump="travel"]').innerText());
    await shot(page, '07_panel_tr_details_jumps_390');

    await page.goto(`${BUYER}#edit/us`);
    await page.waitForSelector('[data-disclosure="languages"]');
    await page.locator('[data-disclosure="languages"] button').first().click();
    await page.locator('[data-languages-extra="tr"]').check();
    await page.waitForSelector('[data-auto-translate="tr"]');
    await page.click('[data-auto-translate="tr"]');
    await page.waitForFunction(() => document.querySelectorAll('[data-language="tr"] [data-state="draft"]').length > 0, null, { timeout: 30_000 });
    const drafts = await page.locator('[data-language="tr"] [data-state="draft"]').count();
    check('Translate automatically: texts filled as drafts to check', drafts > 0 && calls > 0, `${drafts} drafts, ${calls} service calls`);
    await page.click('[data-approve-all="tr"]');
    await page.waitForTimeout(400);
    check('Approve all: no drafts left', (await page.locator('[data-language="tr"] [data-state="draft"]').count()) === 0);
    await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
    await shot(page, '08_panel_tr_languages_390');
    await axe(page, 'panel TR Us → Languages (390)');
    // block 4 left an empty test question in the draft (publishing refuses it, rightly): take it out first
    const draft = (await adapter.getSiteById(live.site.id))!;
    const content = structuredClone(draft.content) as any;
    if (content.rsvp) content.rsvp.questions = [];
    await adapter.patchSite(live.site.id, { content });
    await publishSite(adapter, live.site.id);

    const guest = await browser.newContext({ ...PHONE, locale: 'en-US' });
    const gp = await guest.newPage();
    await gp.goto(`${BASE}/mia-and-theo/story?lang=tr`);
    check('guest ?lang=tr: <html lang="tr">', (await gp.getAttribute('html', 'lang')) === 'tr');
    const story = await gp.locator('body').innerText();
    check('guest ?lang=tr: the couple’s approved translation shows', story.includes('[tr] '), story.slice(0, 160));
    check('guest: language switcher with EN and TR', (await gp.locator('[data-pl-lang] a[data-lang]').count()) >= 2);
    await gp.goto(`${BASE}/mia-and-theo/rsvp?lang=tr`);
    await gp.locator('form button[type=submit]').first().click();
    await gp.waitForTimeout(500);
    const form = await gp.locator('form').first().innerText();
    check('guest RSVP in Turkish: errors in Turkish', !/Please enter your name/.test(form) && form.trim().length > 0, form.slice(0, 160));
    check('guest TR: no horizontal scroll at 390', (await overflow(gp)) <= 0);
    await shot(gp, '09_guest_tr_rsvp_390');

    // the shop's own session keeps its Turkish banner whatever the editor language
    const shop = await issueShopEditKey(adapter, live.site.id);
    const en = await browser.newContext(PHONE);
    const sp = await en.newPage();
    await sp.goto(`${BASE}/edit/mia-and-theo?k=${encodeURIComponent(shop.editKey)}#home`);
    await sp.waitForSelector('[data-shop-session]');
    check('shop banner in Turkish in an English editor', /Dükkân olarak düzenliyorsunuz/.test(await sp.locator('[data-shop-session]').innerText()));
    await Promise.all([ctx.close(), guest.close(), en.close()]);
  });
} finally {
  await browser?.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), passed: checks.filter((c) => c.ok).length, failed: checks.filter((c) => !c.ok).length, checks }, null, 2) + '\n');
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
