// Browser journey of G069 (RSVP for the couple): real `next start` + Chromium at 390 × 844 (phone, touch).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g069-browser.ts
//
// 1. Guests reply on the real designs: 03 Blush Garden Rose (3 people, names, meal, food note) and 01 Olive & Ivory
//    (2 people) — the name fields follow "Number of guests", leave for a "no" and come back with what was typed.
// 2. The couple: Home "1 new reply" → Guests: numbers, days left, answers (bars, yes/no %), food notes, the party on the
//    card, "New" → filter by an answer, sort → Mark as seen (stays after reload) → Add a reply (sheet) → correct a reply
//    → CSV (one row per person: 3 rows for the 3-person reply) → print view (screen, print media, A4 + Letter PDF).
// 3. 1280 px layout, 320 px, archived site (read only, CSV + print stay), axe-core, touch targets ≥ 44 px, console.
// Screenshots, PDFs and checks.json -> previews/g069/ (or $G069_SHOTS_DIR). Exit 1 on a failed check.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data lives in temporary folders.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');

const PORT = Number(process.env.PORT || 3369);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G069_SHOTS_DIR || path.join(ROOT, 'previews/g069');
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g069-browser-data-'));
mkdirSync(OUT, { recursive: true });

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const demo = (dir: string) => JSON.parse(readFileSync(path.join(REPO, 'collections', dir, 'content.demo.json'), 'utf8')) as ContentRecord;
const QUESTIONS = [
  { id: 'meal', label: 'Meal choice', type: 'choice' as const, options: ['Chicken', 'Fish', 'Vegetarian'] },
  { id: 'shuttle', label: 'Do you need the hotel shuttle?', type: 'choice' as const, options: ['Yes, please', 'No, thank you'] },
  { id: 'diet', label: 'Any allergies or dietary needs?', type: 'text' as const },
];
function siteContent(dir: string): ContentRecord {
  const c = demo(dir);
  c.rsvp = { ...c.rsvp, method: null, deadline: isoDay(30), questions: structuredClone(QUESTIONS) };
  c.date = isoDay(90);
  return c;
}

const adapter = new LocalAdapter(dataDir);
const blush = await createSiteWithKeys(adapter, { slug: 'clara-and-julian', theme: 'blush-garden-rose', content: siteContent('03_Blush_Garden_Rose') });
await publishSite(adapter, blush.site.id);
const olive = await createSiteWithKeys(adapter, { slug: 'olive-demo', theme: 'olive-ivory', content: siteContent('01_Olive_Ivory') });
await publishSite(adapter, olive.site.id);
const archived = await createSiteWithKeys(adapter, { slug: 'old-wedding', theme: 'blush-garden-rose', content: siteContent('03_Blush_Garden_Rose') });
await publishSite(adapter, archived.site.id);

// Earlier replies (fictional names), as the website form stores them; one written before G069 (no names field).
const meal = (m: string, s?: string, d?: string) => [
  { id: 'meal', question: 'Meal choice', answer: m },
  ...(s ? [{ id: 'shuttle', question: 'Do you need the hotel shuttle?', answer: s }] : []),
  ...(d ? [{ id: 'diet', question: 'Any allergies or dietary needs?', answer: d }] : []),
];
const earlier: Array<Parameters<typeof adapter.saveRsvp>[1]> = [
  { name: 'Hedy Lamarr', email: 'hedy@example.com', attending: true, guests: 2, party: ['Fritz Mandl'], message: 'We can’t wait!', answers: meal('Fish', 'No, thank you') },
  { name: 'Grace Hopper', email: 'grace@example.com', attending: true, guests: 1, message: null, answers: meal('Chicken', 'Yes, please', 'None') },
  { name: 'Dorothy Vaughan', email: 'dorothy@example.com', attending: false, guests: 0, message: 'So sorry to miss it.' },
  { name: 'Katherine Johnson', email: null, attending: true, guests: 3, message: 'Our youngest is allergic to peanuts.', answers: meal('Chicken', 'Yes, please') },
  { name: 'Alan Turing', email: 'alan@example.com', attending: true, guests: 1, message: null, answers: meal('Vegetarian', 'Yes, please', 'Gluten-free, please') },
];
for (const r of earlier) {
  await adapter.saveRsvp(blush.site.id, r);
  await new Promise((res) => setTimeout(res, 5));
}
const seenAt = (await adapter.listRsvps(blush.site.id)).at(-1)!.createdAt;
for (const r of earlier.slice(0, 3)) await adapter.saveRsvp(archived.site.id, r);
await setArchiveOverride(adapter, archived.site.id, '2026-01-01', 'browser check: archive');

const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;
const PANEL = editUrl('clara-and-julian', blush.editKey);

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
const shot = async (target: any, name: string, opts: { full?: boolean } = {}) => {
  await new Promise((r) => setTimeout(r, 300));
  await target.screenshot({ path: path.join(OUT, `${name}.png`), ...(opts.full ? { fullPage: true } : {}) });
};
/** Scrolls so the element starts just under the app bar (screenshots without the fixed bars over it). */
const toTop = (page: any, sel: string) =>
  page.evaluate((s: string) => {
    const el = document.querySelector(s)!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 72);
  }, sel);
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - window.innerWidth);
const text = async (page: any, sel: string) => ((await page.locator(sel).first().innerText()) as string).replace(/\s+/g, ' ').trim();
const watch = (page: any) => {
  const problems: string[] = [];
  page.on('console', (m: any) => {
    if (m.type() === 'error' && !/status of 4\d\d/.test(m.text())) problems.push(m.text());
  });
  page.on('pageerror', (e: unknown) => problems.push(String(e)));
  return problems;
};

async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE });
  const res: string[] = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations
      .filter((v: any) => v.impact === 'serious' || v.impact === 'critical')
      .map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  check(`a11y (axe-core 4.13.0): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}

/** Visible interactive elements smaller than 44 × 44 px (inline links in running text excepted, WCAG 2.5.8). */
async function smallTargets(page: any, scope = 'body'): Promise<string[]> {
  return page.evaluate((root: string) => {
    const out: string[] = [];
    for (const el of document.querySelector(root)!.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea')) {
      if (el.closest('p') && (el.tagName === 'A' || el.tagName === 'BUTTON')) continue; // inline in text
      if (el.matches('input[type=radio]')) continue; // the segment / label is the target
      if (el.matches('input[type=checkbox]') && el.closest('label')) continue; // the label row (44 px) is the target
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[inert]')) continue;
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, scope);
}

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  // =========================================================================== 1. guests reply on the designs
  await block('guest 03', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const problems = watch(page);
    await page.goto(`${BASE}/clara-and-julian/rsvp`, { waitUntil: 'load' });
    await page.waitForSelector('form[data-rsvp-form][data-rsvp-status="ready"]');
    check('03 form: no name fields for the other guests before "Number of guests" is 2+', (await page.locator('[name^="party:"]').count()) === 0);
    await page.fill('[data-rsvp-form] [name="name"]', 'Margaret Hamilton');
    await page.fill('[data-rsvp-form] [name="email"]', 'margaret@example.com');
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.fill('[data-rsvp-form] [name="guests"]', '3');
    await page.waitForSelector('[name="party:3"]');
    const labels = await page.evaluate(() => [...document.querySelectorAll('[name^="party:"]')].map((i) => (i.closest('label')?.textContent ?? '').replace(/\s+/g, ' ').trim()));
    check('03 form: "Number of guests: 3" shows 2 name fields, labelled guest 2 and 3', labels.length === 2 && /guest 2/i.test(labels[0]) && /guest 3/i.test(labels[1]), JSON.stringify(labels));
    await page.fill('[name="party:2"]', 'James Hamilton');
    await page.fill('[name="party:3"]', 'Ada Hamilton');
    await page.check('[data-rsvp-form] [name="attending"][value="no"]');
    check('03 form: a "no" takes the name fields out of the form', (await page.locator('[name^="party:"]').count()) === 0);
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.waitForSelector('[name="party:3"]');
    check('03 form: back to "yes": the typed names are still there', (await page.inputValue('[name="party:2"]')) === 'James Hamilton' && (await page.inputValue('[name="party:3"]')) === 'Ada Hamilton');
    await page.check('fieldset[data-rsvp-question="meal"] input[value="Vegetarian"]');
    await page.check('fieldset[data-rsvp-question="shuttle"] input[value="Yes, please"]');
    await page.fill('fieldset[data-rsvp-question="diet"] textarea', 'James: no nuts, please');
    const field = page.locator('[name="party:2"]');
    await field.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -140));
    await page.waitForTimeout(1500); // the design's entrance motion
    check('03 form: no horizontal scroll at 390 px with the name fields', (await overflow(page)) <= 0);
    await shot(page, '01_guest_form_party_03_390');
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 });
    const stored = (await adapter.listRsvps(blush.site.id)).find((r) => r.name === 'Margaret Hamilton');
    check('03 form: reply stored with the names of the 2 others, the meal and the note', JSON.stringify(stored?.party) === '["James Hamilton","Ada Hamilton"]' && stored?.guests === 3 && stored?.answers?.some((a) => a.answer === 'Vegetarian') === true, JSON.stringify(stored));
    await page.click('[data-rsvp-again]');
    check('03 form: "Send another reply" starts with no name fields', (await page.locator('[name^="party:"]').count()) === 0);
    check('03 form: no console errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  });

  await block('guest 01', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const problems = watch(page);
    await page.goto(`${BASE}/olive-demo/rsvp`, { waitUntil: 'load' });
    await page.waitForSelector('form[data-rsvp-form][data-rsvp-status="ready"]');
    await page.fill('[data-rsvp-form] [name="name"]', 'Rosa Bell');
    await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
    await page.fill('[data-rsvp-form] [name="guests"]', '2');
    await page.waitForSelector('[name="party:2"]');
    check('01 form: "Number of guests: 2" shows one name field', (await page.locator('[name^="party:"]').count()) === 1);
    await page.fill('[name="party:2"]', 'Tom Bell');
    const box = await page.locator('[name="party:2"]').boundingBox();
    const guestsBox = await page.locator('[name="guests"]').boundingBox();
    check('01 form: the name field is full width like the other fields (theme styles)', Math.abs(box.width - guestsBox.width) < 2 || box.width > 280, `${Math.round(box.width)} vs ${Math.round(guestsBox.width)}`);
    await page.evaluate(() => document.querySelector('[name="party:2"]')!.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1500);
    await shot(page, '02_guest_form_party_01_390');
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 8000 });
    const stored = (await adapter.listRsvps(olive.site.id))[0];
    check('01 form: reply stored with the second guest\'s name', JSON.stringify(stored?.party) === '["Tom Bell"]' && stored.guests === 2, JSON.stringify(stored));
    check('01 form: no console errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  });

  // =========================================================================== 2. the couple
  await block('couple', async () => {
    const ctx = await browser.newContext(PHONE);
    // This phone looked at the replies before Margaret's arrived: only hers is new.
    await ctx.addInitScript(([key, value]: [string, string]) => {
      if (!sessionStorage.getItem('g069-init')) {
        localStorage.setItem(key, value);
        sessionStorage.setItem('g069-init', '1');
      }
    }, ['seen:clara-and-julian', seenAt]);
    const page = await ctx.newPage();
    const problems = watch(page);
    await page.goto(`${PANEL}#home`);
    await page.waitForSelector('[data-replies-summary][data-new-replies]');
    const home = await text(page, '[data-replies-summary]');
    check('Home: card "1 new reply" with the numbers (coming · not coming)', home.includes('1 new reply') && home.includes('10 coming') && home.includes('1 not coming'), home);
    check('Home: the Guests tab shows the new count', (await text(page, '[data-nav="guests"]')).includes('1'));
    await page.locator('[data-replies-summary]').scrollIntoViewIfNeeded();
    await shot(page, '03_home_new_replies_390');
    await page.click('[data-replies-summary]');
    await page.waitForSelector('[data-replies]');
    check('Guests: opened from the Home card (#guests)', page.url().endsWith('#guests'));

    const stats = (await page.locator('[data-stat]').allInnerTexts()).map((t: string) => t.replace(/\s+/g, ' ').trim()).join(' · ');
    check('Guests: 10 guests coming · 1 not coming · 6 replies', stats === '10 Guests coming · 1 Not coming · 6 Replies', stats);
    const deadline = await text(page, '[data-deadline]');
    check('Guests: days left to reply ("Replies close in 30 days. Last day: …")', /Replies close in (29|30) days\. Last day: /.test(deadline), deadline);
    check('Guests: "1 new reply" banner', (await text(page, '[data-new-banner]')).includes('1 new reply'));
    await shot(page, '04_guests_summary_390');

    const mealCard = page.locator('[data-question-insight="meal"]');
    const mealText = (await mealCard.innerText()).replace(/\s+/g, ' ');
    check('Answers: meal choices counted (Chicken 2 · Fish 1 · Vegetarian 2) with bars', /Chicken 2/.test(mealText) && /Fish 1/.test(mealText) && /Vegetarian 2/.test(mealText) && (await mealCard.locator('[data-answer-option]').count()) === 3, mealText);
    const shuttleText = (await page.locator('[data-question-insight="shuttle"]').innerText()).replace(/\s+/g, ' ');
    check('Answers: a yes/no question as percentages (Yes 80% (4) · No 20% (1))', /Yes, please 80% \(4\)/.test(shuttleText) && /No, thank you 20% \(1\)/.test(shuttleText), shuttleText);
    const widths = await mealCard.locator('[data-answer-option]').evaluateAll((els: Element[]) => els.map((b) => Math.round((b.querySelector('span[aria-hidden] > span') as HTMLElement).getBoundingClientRect().width)));
    check('Answers: bar lengths follow the counts (Chicken = Vegetarian = 2 × Fish)', widths[0] > 0 && Math.abs(widths[0] - widths[2]) <= 1 && Math.abs(widths[0] - 2 * widths[1]) <= 2, JSON.stringify(widths));
    await toTop(page, '[data-answers]');
    await shot(page, '05_guests_breakdown_390');
    const diet = (await page.locator('[data-dietary]').innerText()).replace(/\s+/g, ' ');
    check('Food & allergy notes: answers and a message that mentions an allergy, "None" left out', diet.includes('James: no nuts, please') && diet.includes('Gluten-free, please') && diet.includes('allergic to peanuts') && !/Grace Hopper/.test(diet), diet);
    await toTop(page, '[data-dietary]');
    await page.waitForTimeout(200);
    await page.locator('[data-dietary]').screenshot({ path: path.join(OUT, '06_guests_dietary_390.png') });

    const first = page.locator('[data-reply]').first();
    check('List: newest first, Margaret\'s card has "New" and her party ("With James Hamilton and Ada Hamilton")', (await first.getAttribute('data-reply-name')) === 'Margaret Hamilton' && (await first.locator('[data-new-badge]').count()) === 1 && (await first.locator('[data-reply-party]').innerText()).includes('With James Hamilton and Ada Hamilton'));
    check('List: an older reply without names says how many came without a name', (await page.locator('[data-reply-name="Katherine Johnson"] [data-reply-party]').innerText()).includes('+ 2 guests, no names given'));
    await first.locator('button[aria-expanded]').first().click();
    await page.waitForSelector('[data-reply-people]');
    const people = await first.locator('[data-reply-people] li').allInnerTexts();
    check('Card: opened, everyone in the reply listed (3)', people.join('|') === 'Margaret Hamilton|James Hamilton|Ada Hamilton', people.join('|'));
    await toTop(page, '[data-reply]');
    await page.waitForTimeout(200);
    await first.screenshot({ path: path.join(OUT, '07_guest_card_party_390.png') });

    // filter by an answer, sort
    await mealCard.locator('[data-answer-option="Vegetarian"]').click();
    await page.waitForSelector('[data-answer-filter]');
    const vegNames = await page.locator('[data-reply]').evaluateAll((els: Element[]) => els.map((e) => e.getAttribute('data-reply-name')));
    check('Filter: tapping "Vegetarian" lists only those replies', vegNames.length === 2 && vegNames.includes('Margaret Hamilton') && vegNames.includes('Alan Turing'), JSON.stringify(vegNames));
    await shot(page, '08_guests_filter_vegetarian_390');
    await page.locator('[data-answer-filter] button').click();
    check('Filter: cleared (6 replies)', (await page.locator('[data-reply]').count()) === 6);
    await page.selectOption('#reply-sort', 'name');
    check('Sort: by name (Alan Turing first)', (await page.locator('[data-reply]').first().getAttribute('data-reply-name')) === 'Alan Turing');
    await page.click('[data-filter="not"]');
    check('Filter chips: "Not coming" shows the one decline', (await page.locator('[data-reply]').count()) === 1);
    await page.click('[data-filter="all"]');
    await page.selectOption('#reply-sort', 'newest');
    await axe(page, 'Guests (390)');
    const small = await smallTargets(page, 'main');
    check('Guests: touch targets ≥ 44 px', small.length === 0, small.join('; '));
    check('Guests: no horizontal scroll at 390 px', (await overflow(page)) <= 0);

    // mark as seen
    await page.click('[data-mark-seen]');
    await page.waitForFunction(() => !document.querySelector('[data-new-badge]') && !document.querySelector('[data-new-banner]'));
    check('Mark as seen: "New" badges and banner gone, Guests tab without a count', (await page.locator('[data-nav="guests"]').innerText()).trim() === 'Guests');
    await page.reload();
    await page.waitForSelector('[data-reply]');
    check('Mark as seen: still seen after a reload (this device)', (await page.locator('[data-new-badge]').count()) === 0);

    // add a reply (phone call)
    await page.click('[data-add-reply]');
    await page.waitForSelector('[data-testid="reply-sheet"]');
    check('Add a reply: sheet opens with the focus on the name', await page.evaluate(() => document.activeElement?.id === 'reply-name'));
    await page.fill('#reply-name', 'Uncle Bob');
    await page.selectOption('#reply-guests', '2');
    await page.fill('#reply-party-2', 'Aunt May');
    await page.selectOption('#reply-answer-meal', 'Chicken');
    await page.fill('#reply-message', 'Called on Sunday');
    await page.evaluate(() => (document.querySelector('[data-testid="reply-sheet"]')!.scrollTop = 0));
    await shot(page, '09_add_reply_sheet_390');
    await page.evaluate(() => {
      const sheet = document.querySelector('[data-testid="reply-sheet"]')!;
      sheet.scrollTop = (document.getElementById('reply-guests')!.getBoundingClientRect().top - sheet.getBoundingClientRect().top) + sheet.scrollTop - 90;
    });
    await shot(page, '09b_add_reply_sheet_party_390');
    await axe(page, 'Add a reply sheet');
    const smallSheet = await smallTargets(page, '[data-testid="reply-sheet"]');
    check('Add a reply: touch targets ≥ 44 px', smallSheet.length === 0, smallSheet.join('; '));
    await page.click('[data-save-reply]');
    await page.waitForSelector('[data-reply-name="Uncle Bob"]');
    const bob = await text(page, '[data-reply-name="Uncle Bob"]');
    check('Add a reply: card marked "Added by you", party shown, numbers updated (12 coming)', bob.includes('Added by you') && bob.includes('With Aunt May') && (await text(page, '[data-stat="coming"]')) === '12 Guests coming', bob.slice(0, 160));
    check('Add a reply: not "New" (the couple\'s own reply)', (await page.locator('[data-reply-name="Uncle Bob"] [data-new-badge]').count()) === 0);

    // correct a guest reply
    await page.getByRole('button', { name: 'Options for the reply from Grace Hopper' }).click();
    await page.getByRole('menuitem', { name: 'Edit reply' }).click();
    await page.waitForSelector('[data-testid="reply-sheet"]');
    check('Edit: the sheet starts from the reply (name, meal)', (await page.inputValue('#reply-name')) === 'Grace Hopper' && (await page.inputValue('#reply-answer-meal')) === 'Chicken');
    await page.selectOption('#reply-guests', '2');
    await page.fill('#reply-party-2', 'Howard Aiken');
    await page.click('[data-save-reply]');
    await page.waitForFunction(() => (document.querySelector('[data-reply-name="Grace Hopper"]') as HTMLElement | null)?.innerText.includes('Edited by you'));
    const graceStored = (await adapter.listRsvps(blush.site.id)).find((r) => r.name === 'Grace Hopper');
    check('Edit: saved (2 guests, "Howard Aiken"), marked "Edited by you"', graceStored?.guests === 2 && graceStored.party?.[0] === 'Howard Aiken' && Boolean(graceStored.editedAt));

    // CSV: one row per person
    const href = await page.getAttribute('[data-csv]', 'href');
    const csv = await page.evaluate(async (u: string) => {
      const res = await fetch(u);
      const buf = new Uint8Array(await res.arrayBuffer());
      return { bom: [...buf.slice(0, 3)], text: new TextDecoder().decode(buf), type: res.headers.get('content-type') };
    }, href);
    const rows = csv.text.split('\r\n').filter(Boolean).map((l: string) => l.slice(1, -1).split('","'));
    const margaret = rows.filter((r: string[]) => r[1] === 'Margaret Hamilton');
    check('CSV: UTF-8 BOM, text/csv, header "Name, Party of, Attending, Party size, …"', csv.bom.join() === '239,187,191' && /text\/csv/.test(csv.type) && rows[0].slice(0, 4).join('|') === 'Name|Party of|Attending|Party size', rows[0].join('|'));
    check('CSV: the 3-person reply is 3 rows (Margaret, James, Ada)', margaret.length === 3 && margaret.map((r: string[]) => r[0]).join('|') === 'Margaret Hamilton|James Hamilton|Ada Hamilton', JSON.stringify(margaret.map((r: string[]) => r[0])));
    check('CSV: one row per person in all (14 people: 13 coming + 1 not coming)', rows.length - 1 === 14, String(rows.length - 1));
    check('CSV: "Added by you" and "Website, edited by you" in the Source column', rows.some((r: string[]) => r[0] === 'Uncle Bob' && r[6] === 'Added by you') && rows.some((r: string[]) => r[0] === 'Grace Hopper' && r[6] === 'Website, edited by you'));

    // print view
    await page.click('[data-print-list]');
    await page.waitForSelector('[data-print-doc]');
    check('Print: #guests/print, heading "Guest list"', page.url().endsWith('#guests/print') && (await text(page, 'h1')) === 'Guest list');
    const printRows = await page.locator('[data-print-row]').count();
    check('Print: one row per person coming (13)', printRows === 13, String(printRows));
    check('Print: no horizontal scroll at 390 px', (await overflow(page)) <= 0);
    await page.waitForSelector('[data-snackbar]', { state: 'detached', timeout: 15_000 }).catch(() => undefined);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '10_print_view_390');
    await toTop(page, '[data-print-doc]');
    await shot(page, '10b_print_view_list_390');
    await axe(page, 'Print view');
    await page.emulateMedia({ media: 'print' });
    const hidden = await page.evaluate(() => ['header', 'nav[aria-label="Editor"]'].map((s) => getComputedStyle(document.querySelector(s)!).display));
    const toolsHidden = await page.evaluate(() => getComputedStyle(document.querySelector('[data-print-doc]')!.previousElementSibling!).display);
    check('Print media: app bar, tabs and the print controls are not printed', hidden.every((d: string) => d === 'none') && toolsHidden === 'none', `${hidden.join(',')} ${toolsHidden}`);
    await page.setViewportSize({ width: 794, height: 1123 });
    await shot(page, '11_print_media_a4_width', { full: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ media: 'screen' });
    await page.locator('[data-print-view] input[type="radio"][value="all"]').check();
    check('Print: "Everyone who replied" adds the "Not coming" table', (await text(page, '[data-print-doc]')).includes('Not coming — 1 reply'));
    for (const format of ['A4', 'Letter'] as const) {
      const pdf: Buffer = await page.pdf({ format, printBackground: false, path: format === 'A4' ? path.join(OUT, 'g069_guest_list_A4.pdf') : undefined });
      check(`Print: Chromium prints the list to ${format} (PDF ${Math.round(pdf.length / 1024)} KB)`, pdf.length > 3000 && pdf.subarray(0, 5).toString() === '%PDF-');
    }
    await page.click('text=Back to Guests');
    await page.waitForFunction(() => window.location.hash === '#guests');
    check('Print: "Back to Guests"', true);
    check('Couple: no console errors', problems.length === 0, problems.join(' | '));
    await ctx.close();
  });

  // =========================================================================== 3. layouts, archive
  await block('wide', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, timezoneId: 'America/New_York', locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto(`${PANEL}#guests`);
    await page.waitForSelector('[data-reply]');
    await page.waitForTimeout(600);
    check('1280 px: no horizontal scroll', (await overflow(page)) <= 0);
    await shot(page, '12_guests_1280');
    await ctx.close();
  });

  await block('narrow', async () => {
    const ctx = await browser.newContext({ ...PHONE, viewport: { width: 320, height: 640 } });
    const page = await ctx.newPage();
    await page.goto(`${PANEL}#guests`);
    await page.waitForSelector('[data-reply]');
    check('320 px: Guests without horizontal scroll', (await overflow(page)) <= 0, String(await overflow(page)));
    await page.goto(`${PANEL}#guests/print`);
    await page.waitForSelector('[data-print-doc]');
    check('320 px: print view without horizontal scroll', (await overflow(page)) <= 0, String(await overflow(page)));
    await ctx.close();
  });

  await block('archive', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(editUrl('old-wedding', archived.editKey, '#guests'));
    await page.waitForSelector('[data-reply]');
    check('Archive: no "Add a reply", no options menu (read only)', (await page.locator('[data-add-reply]').count()) === 0 && (await page.locator('[data-reply] [aria-haspopup="menu"]').count()) === 0);
    check('Archive: CSV and print stay', (await page.locator('[data-csv]').count()) === 1 && (await page.locator('[data-print-list]').count()) === 1);
    await ctx.close();
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
