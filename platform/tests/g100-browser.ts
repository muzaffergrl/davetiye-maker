// Browser checks of G100 (the simpler buyer panel, docs/18 P1): real `next start` + Chromium. Not part of `npm test`
// (needs a build):
//
//   npm run build
//   PORT=3480 NODE_PATH=/opt/node22/lib/node_modules node tests/g100-browser.ts
//
// 1. Setup step 1: two names + the date only — no "How your names appear", the change rule in one line with "Learn more",
//    the sample text as one line with "Go to the first one" (no "Sample" tags on the fields).
// 2. The publish success screen: the link and Share / Copy / Open first; the QR code and its downloads under
//    "More ways to share"; two or three optional next steps that open real parts of the editor.
// 3. Editor pages: one sample-text line at the top of the page (count = the panel's own sample detection), the jump to the
//    first sample field; Day & place keeps its "More options" and its sub-headings (schedule, after the wedding).
// 4. Guests: numbers → search + status tabs (All · Coming · Not coming · New) → the list; at 390 × 844 the first reply is on
//    the first screen; the answers in a separate "Results" view (count + percent), a tap on an answer lists who chose it.
// 5. axe-core (serious/critical = 0), touch targets ≥ 44 px, no horizontal scroll; screenshots at 360 / 390 / 1280.
// G100_PHASE=before only takes the screenshots (into previews/g100/before/) — for the before/after comparison.
// Screenshots + checks.json → previews/g100/ (or $G100_SHOTS_DIR). Exit 1 on a failed check.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { prePublishNotes } from '../lib/panel/model.ts';
import { IDENTITY_CHANGE_LIMIT } from '../lib/panel/rights.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');

const BEFORE = process.env.G100_PHASE === 'before';
const PORT = Number(process.env.PORT || 3480);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G100_SHOTS_DIR || path.join(ROOT, 'previews/g100', BEFORE ? 'before' : '');
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g100-browser-data-'));
mkdirSync(OUT, { recursive: true });

const THEME = 'blush-garden-rose';
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const adapter = new LocalAdapter(dataDir);

// A: never published (/start's draft: the design's demo with the buyer's names) → setup, publish, success screen.
const setupSite = await createSiteWithKeys(adapter, { slug: 'elena-and-marco', theme: THEME, content: draftFromDemo(demo, ['Elena', 'Marco']) });
// B: published, still with the design's sample text (editor pages).
const sampleSite = await createSiteWithKeys(adapter, { slug: 'nora-and-sam', theme: THEME, content: draftFromDemo(demo, ['Nora', 'Sam']) });
await publishSite(adapter, sampleSite.site.id);
// C: published with reply-form questions and replies (Guests, Results).
const QUESTIONS = [
  { id: 'meal', label: 'Meal choice', type: 'choice' as const, options: ['Chicken', 'Fish', 'Vegetarian'] },
  { id: 'shuttle', label: 'Do you need the hotel shuttle?', type: 'choice' as const, options: ['Yes, please', 'No, thank you'] },
  { id: 'diet', label: 'Any allergies or dietary needs?', type: 'text' as const },
];
const guestsContent = structuredClone(demo);
guestsContent.rsvp = { ...guestsContent.rsvp, method: null, deadline: isoDay(30), questions: structuredClone(QUESTIONS) };
guestsContent.date = isoDay(90);
const guestsSite = await createSiteWithKeys(adapter, { slug: 'clara-and-julian', theme: THEME, content: guestsContent });
await publishSite(adapter, guestsSite.site.id);
const meal = (m: string, s?: string, d?: string) => [
  { id: 'meal', question: 'Meal choice', answer: m },
  ...(s ? [{ id: 'shuttle', question: 'Do you need the hotel shuttle?', answer: s }] : []),
  ...(d ? [{ id: 'diet', question: 'Any allergies or dietary needs?', answer: d }] : []),
];
const replies: Array<Parameters<typeof adapter.saveRsvp>[1]> = [
  { name: 'Hedy Lamarr', email: 'hedy@example.com', attending: true, guests: 2, party: ['Fritz Mandl'], message: 'We can’t wait!', answers: meal('Fish', 'No, thank you') },
  { name: 'Grace Hopper', email: 'grace@example.com', attending: true, guests: 1, message: null, answers: meal('Chicken', 'Yes, please', 'None') },
  { name: 'Dorothy Vaughan', email: 'dorothy@example.com', attending: false, guests: 0, message: 'So sorry to miss it.' },
  { name: 'Katherine Johnson', email: null, attending: true, guests: 3, message: 'Our youngest is allergic to peanuts.', answers: meal('Chicken', 'Yes, please') },
  { name: 'Alan Turing', email: 'alan@example.com', attending: true, guests: 1, message: null, answers: meal('Vegetarian', 'Yes, please', 'Gluten-free, please') },
  { name: 'Margaret Hamilton', email: 'margaret@example.com', attending: true, guests: 3, party: ['James Hamilton', 'Ada Hamilton'], message: null, answers: meal('Vegetarian', 'Yes, please', 'James: no nuts, please') },
];
for (const r of replies) {
  await adapter.saveRsvp(guestsSite.site.id, r);
  await new Promise((res) => setTimeout(res, 5));
}

const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;
const SETUP = editUrl('elena-and-marco', setupSite.editKey);
const SAMPLE = editUrl('nora-and-sam', sampleSite.editKey);
const GUESTS = editUrl('clara-and-julian', guestsSite.editKey);
const PUBLIC = `${BASE}/elena-and-marco`;

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  if (BEFORE) return;
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
async function block(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    if (BEFORE) console.log(`(before) ${name} stopped: ${String((e as Error)?.message ?? e).slice(0, 200)}`);
    else check(`${name}: ran to the end`, false, String((e as Error)?.stack ?? e).slice(0, 800));
  }
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'America/New_York', locale: 'en-US' };
const WIDE = { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, timezoneId: 'America/New_York', locale: 'en-US' };
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

/** Visible interactive elements smaller than 44 × 44 px (inline links and buttons inside running text excepted, WCAG 2.5.8). */
async function smallTargets(page: any, scope = 'body'): Promise<string[]> {
  return page.evaluate((root: string) => {
    const out: string[] = [];
    for (const el of document.querySelector(root)!.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea')) {
      if (el.closest('p') && (el.tagName === 'A' || el.tagName === 'BUTTON')) continue; // inline in text
      if (el.matches('input[type=radio], input[type=file]')) continue; // the segment / label is the target
      if (el.matches('input[type=checkbox]') && el.closest('label')) continue;
      if (el.matches('[role="switch"]')) continue; // 44 px hit area through ::before
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[inert]')) continue;
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, scope);
}
async function targets(page: any, view: string, scope = 'body') {
  const small = await smallTargets(page, scope);
  check(`${view}: touch targets ≥ 44 px`, small.length === 0, small.join('; '));
}

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  // =========================================================================== 1. setup step 1
  await block('setup 1', async () => {
    for (const width of [390, 360, 1280]) {
      const ctx = await browser.newContext(width === 1280 ? WIDE : { ...PHONE, viewport: { width, height: width === 360 ? 640 : 844 } });
      const page = await ctx.newPage();
      await page.goto(`${SETUP}#setup/1`);
      await page.waitForSelector('[data-setup="1"]');
      await page.waitForTimeout(600);
      await shot(page, `01_setup1_${width}`);
      if (width === 390) {
        const main = await text(page, 'main');
        const first = await page.evaluate(() => ({ bar: Math.round(document.querySelector('footer')!.getBoundingClientRect().top), date: Math.round(document.getElementById('f-date')!.getBoundingClientRect().bottom) }));
        check('setup 1 (390 × 844): both first names and the wedding date on the first screen, above the bar', first.date <= first.bar, JSON.stringify(first));
        check('setup 1: one job — the two first names and the date; no "How your names appear"', (await page.locator('#f-name_display').count()) === 0 && !main.includes('How your names appear') && (await page.locator('#f-partners-0-display_name').count()) === 1 && (await page.locator('#f-partners-1-display_name').count()) === 1 && (await page.locator('#f-date').count()) === 1);
        const rule = `After publishing you can change names or the date ${IDENTITY_CHANGE_LIMIT} times.`;
        check('setup 1: the change rule in one line, the number from lib/panel/rights.ts', main.includes(rule) && main.split(rule).length === 2, main.slice(0, 240));
        const more = page.locator('[data-rights-note] [data-rights-more]');
        check('setup 1: "Learn more" closed at first (the details hidden)', (await more.getAttribute('aria-expanded')) === 'false' && !main.includes('Always free'));
        await more.click();
        const details = await text(page, '[data-rights-note]');
        check('setup 1: "Learn more" opens the details (3 in total, the free fixes, undo)', (await more.getAttribute('aria-expanded')) === 'true' && details.includes('3 changes in total') && details.includes('Always free') && details.includes('Undo it right away'), details);
        await shot(page, '01b_setup1_learn_more_390');
        await more.click();
        check('setup 1: no "Sample" tags on the fields', (await page.locator('[data-sample-tag]').count()) === 0);
        const line = await text(page, '[data-sample-line]');
        check('setup 1: one sample-text line ("2 fields still show sample text": date, ceremony time)', /^2 fields still show sample text/.test(line), line);
        check('setup 1: the sample fields look like soft placeholders', (await page.locator('[data-sample-field]').count()) === 2);
        await page.click('[data-sample-line] [data-sample-jump]');
        await page.waitForTimeout(500);
        check('setup 1: "Go to the first one" focuses the date', (await page.evaluate(() => document.activeElement?.id)) === 'f-date');
        await axe(page, 'setup 1');
        await targets(page, 'setup 1', '[data-setup]');
        check('setup 1: no horizontal scroll at 390 px', (await overflow(page)) <= 0);
      }
      if (width === 360) {
        const fit = await page.evaluate(() => ({ bar: document.querySelector('footer')!.getBoundingClientRect().top, date: document.getElementById('f-date')!.getBoundingClientRect().bottom }));
        check('setup 1 at 360 × 640: the date is reached with less than one screen of scrolling', fit.date < fit.bar + 640, JSON.stringify(fit));
        check('setup 1: no horizontal scroll at 360 px', (await overflow(page)) <= 0);
      }
      await ctx.close();
    }
  });

  // =========================================================================== 2. publish → success screen
  await block('success', async () => {
    const ctx = await browser.newContext(PHONE);
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
    const page = await ctx.newPage();
    await page.goto(`${SETUP}#setup/1`);
    await page.waitForSelector('[data-setup="1"]');
    await page.fill('#f-date', '2027-09-18');
    await page.fill('#f-ceremony_time', '16:30');
    await waitSaved(page);
    await page.goto(`${SETUP}#setup/3`);
    await page.waitForSelector('[data-setup="3"]');
    await page.click('[data-setup-publish]');
    await page.waitForSelector('[data-setup-done]', { timeout: 20_000 });
    await page.waitForTimeout(500);
    await shot(page, '02_published_390');
    await shot(page, '02_published_390_full', { full: true });
    const order = await page.evaluate(() => {
      const pos = (s: string) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().top + window.scrollY : -1;
      };
      return { link: pos('[data-setup-done] [data-live-link]'), copy: pos('[data-setup-done] [data-copy-link]'), more: pos('[data-setup-done] [data-disclosure="more-ways"]'), next: pos('[data-setup-done] [data-after-publish]') };
    });
    check('success: the link and Copy / Open come first, then "More ways to share", then the next steps', order.link > 0 && order.copy > order.link && order.more > order.copy && order.next > order.more, JSON.stringify(order));
    check('success: the link is the public address, "Open website" too', (await page.getAttribute('[data-setup-done] [data-live-link]', 'href')) === PUBLIC && (await page.getAttribute('[data-setup-done] [data-open-site]', 'href')) === PUBLIC);
    const linkBox = await page.locator('[data-setup-done] [data-copy-link]').boundingBox();
    check('success (390 × 844): Copy link on the first screen', linkBox && linkBox.y + linkBox.height <= 844, JSON.stringify(linkBox));
    const qr = page.locator('[data-setup-done] svg[role="img"]');
    check('success: the QR code folded under "More ways to share" (closed)', (await page.getAttribute('[data-disclosure="more-ways"] button[aria-expanded]', 'aria-expanded')) === 'false' && !(await qr.isVisible()));
    await page.click('[data-disclosure="more-ways"] button[aria-expanded]');
    check('success: "More ways to share" opens the QR (from the public URL) with PNG / SVG downloads', (await qr.isVisible()) && (await qr.getAttribute('data-qr-text')) === PUBLIC && (await page.locator('[data-disclosure="more-ways"] button', { hasText: 'Download PNG' }).count()) === 1 && (await page.locator('[data-disclosure="more-ways"] button', { hasText: 'Download SVG' }).count()) === 1);
    await shot(page, '02b_published_more_ways_390', { full: true });
    const steps = await page.locator('[data-after-publish] [data-after-step]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-after-step')));
    check('success: 2–3 optional next steps, only to real parts of the editor', steps.length >= 2 && steps.length <= 3 && steps.every((s: string | null) => ['photos', 'sample', 'guests', 'password'].includes(s ?? '')), steps.join(','));
    await axe(page, 'success screen');
    await targets(page, 'success screen', '[data-setup-done]');
    check('success: no horizontal scroll', (await overflow(page)) <= 0);
    await page.setViewportSize({ width: 360, height: 640 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '02_published_360');
    await page.setViewportSize({ width: 1280, height: 900 });
    await shot(page, '02_published_1280');
    await page.setViewportSize({ width: 390, height: 844 });
    // "Add your photos" opens Edit → Photos; back = Home (not the setup again).
    await page.click('[data-after-step="photos"]');
    await page.waitForSelector('[data-page="photos"]');
    check('success: "Add your photos" opens Edit → Photos', page.url().endsWith('#edit/photos'));
    await page.goBack();
    await page.waitForSelector('[data-status-card]');
    check('success: back from there is Home, not the setup', page.url().endsWith('#home') && (await page.locator('[data-setup]').count()) === 0);
    await ctx.close();
  });

  // =========================================================================== 3. editor pages: one sample line
  await block('sample line', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    // the panel's own detection, on the same content (theme.sample = the design's demo record, lib/panel/state.ts)
    const notes = prePublishNotes(draftFromDemo(demo, ['Nora', 'Sam']), { photos: [], optionalBlocks: [], sample: demo }, { deviceZone: 'America/New_York' }).sample;
    const dayCount = notes.filter((n) => /^(date|ceremony_time|timezone|venue\.|schedule\.)/.test(n.path)).length;
    await page.goto(`${SAMPLE}#edit/day`);
    await page.waitForSelector('[data-page="day"]');
    await page.waitForTimeout(500);
    await shot(page, '03_day_sample_390');
    check('Day & place: no "Sample" tags on the fields', (await page.locator('[data-sample-tag]').count()) === 0);
    const line = await text(page, '[data-sample-line]');
    check(`Day & place: one line "${dayCount} fields still show sample text" at the top`, line.startsWith(`${dayCount} ${dayCount === 1 ? 'field still shows' : 'fields still show'} sample text`), `${line} / ${notes.map((n) => n.path).join(',')}`);
    const lineTop = await page.evaluate(() => document.querySelector('[data-sample-line]')!.getBoundingClientRect().top - document.querySelector('[data-page="day"]')!.getBoundingClientRect().top);
    check('Day & place: the line is the first thing on the page', lineTop < 8, String(lineTop));
    check('Day & place: as many soft sample fields as the line counts', (await page.locator('[data-page="day"] [data-sample-field]').count()) === dayCount);
    await page.click('[data-sample-line] [data-sample-jump]');
    await page.waitForTimeout(600);
    const focused = await page.evaluate(() => ({ id: document.activeElement?.id, sample: Boolean(document.activeElement?.closest('[data-sample-field]')) }));
    check('Day & place: "Go to the first one" focuses the first sample field', focused.sample, JSON.stringify(focused));
    await shot(page, '03b_day_sample_jump_390');
    const heads = await page.locator('[data-page="day"] h2').allInnerTexts();
    check('Day & place: sub-headings Date & time · Venue · Schedule · After the wedding; More options folded', ['Date & time', 'Venue', 'Schedule'].every((h) => heads.some((x: string) => x.trim() === h)) && heads.some((x: string) => x.includes('After the wedding')) && (await page.getAttribute('[data-disclosure="date-more"] button[aria-expanded]', 'aria-expanded')) === 'false', heads.join(' | '));
    await axe(page, 'Day & place');
    await targets(page, 'Day & place', 'main');
    await page.goto(`${SAMPLE}#edit/details`);
    await page.waitForSelector('[data-page="details"]');
    await page.waitForTimeout(500);
    await shot(page, '04_details_sample_390');
    const dLine = await page.locator('[data-sample-line]').count();
    const dFields = await page.locator('[data-page="details"] [data-sample-field]').count();
    check('Details: the line and the soft fields agree (or neither is shown)', dLine ? (await text(page, '[data-sample-line]')).startsWith(`${dFields} `) : dFields === 0, `${dLine} / ${dFields}`);
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(`${SAMPLE}#edit/day`);
    await page.waitForSelector('[data-page="day"]');
    await shot(page, '03_day_sample_360');
    check('Day & place: no horizontal scroll at 360 px', (await overflow(page)) <= 0);
    await ctx.close();
    const wide = await browser.newContext(WIDE);
    const wp = await wide.newPage();
    await wp.goto(`${SAMPLE}#edit/day`);
    await wp.waitForSelector('[data-page="day"]');
    await wp.waitForTimeout(800);
    await shot(wp, '03_day_sample_1280');
    await wide.close();
  });

  // =========================================================================== 4. guests + results
  await block('guests', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${GUESTS}#guests`);
    await page.waitForSelector('[data-reply]');
    await page.waitForTimeout(600);
    await shot(page, '05_guests_390');
    await shot(page, '05_guests_390_full', { full: true });
    const box = await page.locator('[data-reply]').first().boundingBox();
    const limit = await page.evaluate(() => Math.min(...[document.querySelector('[data-guest-actions]'), document.querySelector('nav[aria-label="Editor"]')].filter(Boolean).map((e) => (e as Element).getBoundingClientRect().top)));
    check('Guests (390 × 844): the first reply is on the first screen, above the bars', box && box.y >= 0 && box.y + box.height <= limit, `${JSON.stringify(box)} / ${limit}`);
    const order = await page.evaluate(() => {
      const top = (s: string) => document.querySelector(s)?.getBoundingClientRect().top ?? -1;
      return { stats: top('[data-stat="coming"]'), search: top('#reply-search'), tabs: top('[data-filter="all"]'), list: top('[data-reply]') };
    });
    check('Guests: numbers → search → status tabs → list', order.stats > 0 && order.search > order.stats && order.tabs > order.search && order.list > order.tabs, JSON.stringify(order));
    const tabs = await page.locator('[data-filter]').allInnerTexts();
    check('Guests: status tabs All · Coming · Not coming · New', ['All', 'Coming', 'Not coming'].every((t, i) => tabs[i]?.trim() === t) && /^New/.test(tabs[3]?.trim() ?? ''), tabs.join(' · '));
    check('Guests: the answer breakdown is not on the list view', (await page.locator('[data-question-insight]').count()) === 0);
    await page.fill('#reply-search', 'hopper');
    check('Guests: search finds a name', (await page.locator('[data-reply]').count()) === 1);
    await page.fill('#reply-search', '');
    await page.click('[data-filter="not"]');
    check('Guests: "Not coming" tab', (await page.locator('[data-reply]').count()) === 1);
    await page.click('[data-filter="all"]');
    await axe(page, 'Guests');
    await targets(page, 'Guests', 'main');
    check('Guests: no horizontal scroll', (await overflow(page)) <= 0);
    // Results
    await page.click('[data-guests-tab="results"]');
    await page.waitForSelector('[data-results]');
    check('Results: its own view (#guests/results)', page.url().endsWith('#guests/results'));
    const mealText = await text(page, '[data-question-insight="meal"]');
    check('Results: counts and percentages per choice (Chicken 2 · 40%, Vegetarian 2 · 40%, Fish 1 · 20%)', /Chicken 2 · 40%/.test(mealText) && /Vegetarian 2 · 40%/.test(mealText) && /Fish 1 · 20%/.test(mealText), mealText);
    check('Results: food & allergy notes here too', (await page.locator('[data-results] [data-dietary]').count()) === 1);
    await shot(page, '06_results_390');
    await shot(page, '06_results_390_full', { full: true });
    await axe(page, 'Results');
    await targets(page, 'Results', 'main');
    await page.locator('[data-question-insight="meal"] [data-answer-option="Vegetarian"]').click();
    await page.waitForSelector('[data-answer-filter]');
    const names = await page.locator('[data-reply]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-reply-name')));
    check('Results: tapping "Vegetarian" lists who chose it (back on the list)', page.url().endsWith('#guests') && names.length === 2 && names.includes('Alan Turing') && names.includes('Margaret Hamilton'), names.join(','));
    await shot(page, '07_guests_filtered_390');
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(`${GUESTS}#guests`);
    await page.waitForSelector('[data-reply]');
    await shot(page, '05_guests_360');
    check('Guests: no horizontal scroll at 360 px', (await overflow(page)) <= 0);
    await page.goto(`${GUESTS}#guests/results`);
    await page.waitForSelector('[data-results]');
    await shot(page, '06_results_360');
    await ctx.close();
    const wide = await browser.newContext(WIDE);
    const wp = await wide.newPage();
    await wp.goto(`${GUESTS}#guests`);
    await wp.waitForSelector('[data-reply]');
    await wp.waitForTimeout(800);
    await shot(wp, '05_guests_1280');
    check('Guests at 1280: no horizontal scroll', (await overflow(wp)) <= 0);
    await wp.goto(`${GUESTS}#guests/results`);
    await wp.waitForSelector('[data-results]');
    await wp.waitForTimeout(500);
    await shot(wp, '06_results_1280');
    await wide.close();
  });
} catch (e) {
  check('run', false, String((e as Error)?.stack ?? e));
} finally {
  if (browser) await browser.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

if (!BEFORE) writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString(), passed: checks.filter((c) => c.ok).length, failed: checks.filter((c) => !c.ok).length, checks }, null, 2) + '\n');
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed${failed.length ? `; failed: ${failed.map((f) => f.name).join(' · ')}` : ''}`);
process.exit(failed.length ? 1 : 0);
