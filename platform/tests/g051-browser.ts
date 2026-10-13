// Browser check of G051 on a real theme: add to calendar, questions & answers, reply-form questions, the couple's
// panel. Real `next start` + Chromium at 390 px (isMobile, touch). Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g051-browser.ts [--theme <id>] [--out <dir>]
//
// --theme defaults to blush-garden-rose (G052). The site is the theme's own demo record (scripts/lib/theme-env.ts:
// content.demo.json → bundled copy → collection record) with fictional names, three FAQ items and two RSVP questions.
// Elements are found through the G051 markers the standard requires of every theme (docs/11 §3.5): a[data-calendar],
// <details data-repeat="faq"> (rendered as data-repeat-item="faq.N"), fieldset[data-rsvp-question], [data-rsvp]; the
// painted cards through img/manifest.json free_zone (calendar buttons must sit outside them).
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`). Seeds into a temporary data folder
// (platform/.data is not touched). Screenshots go to --out, else $G051_SHOTS_DIR, else a temp folder.
// Exit code 1 when a check fails.

import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadChromium, markCards, overlaps, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { loadThemeEnv, ROOT, themeArgs, type ThemeEnv } from '../scripts/lib/theme-env.ts';

const PORT = Number(process.env.PORT || 3316);
const chromium = loadChromium();

let env: ThemeEnv;
let args: ReturnType<typeof themeArgs>;
try {
  args = themeArgs();
  env = loadThemeEnv(args);
} catch (e) {
  console.error(`g051-browser: ${(e as Error).message}`);
  process.exit(2);
}
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const THEME = env.id;
console.log(`theme ${THEME} · demo record ${env.demoSource}`);
for (const n of env.notes) console.log(`NOTE  ${n}`);

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const SLUG = 'maren-and-theo';
const content = (): ContentRecord => {
  const c = structuredClone(env.demo);
  c.record_kind = 'customer';
  c.partners = [{ display_name: 'Maren', full_name: 'Maren Holloway' }, { display_name: 'Theo', full_name: 'Theo Castellan' }];
  c.name_display = 'Maren & Theo';
  c.initials = 'M&T';
  c.rsvp.deadline = isoDay(150);
  c.rsvp.method = null;
  c.date = isoDay(200);
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking at the venue?', a: 'Yes, free parking next to the conservatory.\nThe gate opens at 3:00 PM.' },
    { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only celebration so everyone can relax and dance.' },
    { q: 'What happens if it rains?', a: 'The ceremony moves into the glass hall. Same time, same flowers — and no wet shoes.' },
  ];
  c.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] },
    { id: 'song', label: 'A song that gets you dancing', type: 'text' },
  ];
  return c;
};

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g051-browser-data-'));
const themesDir = path.join(ROOT, 'themes');
const shots = args.out ? path.resolve(args.out) : process.env.G051_SHOTS_DIR || mkdtempSync(path.join(os.tmpdir(), 'g051-browser-shots-'));
mkdirSync(shots, { recursive: true });
process.env.PLATFORM_THEMES_DIR = themesDir;

const adapter = new LocalAdapter(dataDir);
const seeded = await createSiteWithKeys(adapter, { slug: SLUG, theme: THEME, content: content() });
await publishSite(adapter, seeded.site.id);

const server = startNext({ port: PORT, dataDir, env: { PLATFORM_THEMES_DIR: themesDir } });
const BASE = server.base;

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
/** One page section: a missing element fails it with its message; the other sections still run. */
async function section(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    check(`${label}: run`, false, String((e as Error)?.message ?? e).split('\n')[0]);
  }
}

/** Layout facts of the elements matching `sel`: box, visibility and whether they stay inside the 390 px viewport. */
const boxes = (page: any, sel: string) =>
  page.evaluate((s: string) => {
    return Array.from(document.querySelectorAll(s)).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height, width: r.width, shown: cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.5 };
    });
  }, sel);
const overflowX = (page: any) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
/** Scrolls an element to the middle of the screen and waits for its scene entrance to finish. */
async function bringIn(page: any, sel: string, settle = 3200) {
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.evaluate((s: string) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
  await page.waitForTimeout(settle);
}
/** Marks the smallest element holding both calendar links (for the screenshot) and returns its selector. */
const markCalendarRow = (page: any) =>
  page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[data-calendar]'));
    let row: Element | null = links[0]?.parentElement ?? null;
    while (row && !links.every((l) => row!.contains(l))) row = row.parentElement;
    row?.setAttribute('data-qa-cal', '');
    return row ? '[data-qa-cal]' : null;
  });
const FAQ = 'details[data-repeat-item^="faq."]';
/** Throws a readable error when a standard element is missing (instead of a timeout). */
async function need(page: any, sel: string, what: string) {
  if (!(await page.$(sel))) throw new Error(`no ${sel} — ${what}`);
}
const CAL = 'a[data-calendar]';

let browser: any;
try {
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  context.setDefaultTimeout(8000);
  const newPage = async (url: string, allow: RegExp | null = null): Promise<{ page: any; problems: string[] }> => {
    const page = await context.newPage();
    const problems: string[] = [];
    page.on('console', (m: { type(): string; text(): string }) => {
      if (m.type() === 'error' && !(allow && allow.test(m.text()))) problems.push(m.text());
    });
    page.on('pageerror', (e: unknown) => problems.push(String(e)));
    await page.goto(url, { waitUntil: 'networkidle' });
    return { page, problems };
  };

  // ---------------------------------------------------------------- home: add to calendar under the invitation card
  await section('home', async () => {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/home`);
    const row = await markCalendarRow(page);
    if (row) await bringIn(page, row);
    const links = await boxes(page, CAL);
    check('home: two calendar buttons, visible, inside 390 px, ≥ 44 px tall', links.length === 2 && links.every((b: any) => b.shown && b.left >= 0 && b.right <= 390 && b.height >= 44), JSON.stringify(links));
    const cards = await markCards(page, env.profile);
    const onCard = links.filter((b: any) => cards.some((c) => overlaps(b, c)));
    check('home: the two buttons do not overlap each other or a painted card', links.length === 2 && !overlaps(links[0], links[1]) && onCard.length === 0,
      JSON.stringify({ tops: links.map((b: any) => Math.round(b.top)), cards: cards.map((c) => `${c.key} ${Math.round(c.top)}..${Math.round(c.bottom)}`) }));
    check('home: no horizontal overflow', (await overflowX(page)) <= 0);
    const hrefs: string[] = await page.evaluate((s: string) => Array.from(document.querySelectorAll(s)).map((a) => (a as HTMLAnchorElement).href), CAL);
    const icsHref = hrefs.find((h) => /\/event\.ics(\?|$)/.test(h));
    const googleHref = hrefs.find((h) => h.startsWith('https://calendar.google.com/'));
    const ics = icsHref ? await fetch(icsHref) : null;
    const icsText = ics ? await ics.text() : '';
    check('home: "Apple / Outlook" opens /<slug>/event.ics (text/calendar, VEVENT)', ics && ics.status === 200 && /text\/calendar/.test(ics.headers.get('content-type') ?? '') && /BEGIN:VEVENT/.test(icsText) && /SUMMARY:Maren & Theo’s Wedding/.test(icsText), `${ics?.status} ${icsHref}`);
    const g = googleHref ? new URL(googleHref) : null;
    check('home: "Google" opens a Google Calendar template link in a new tab', g && g.hostname === 'calendar.google.com' && g.searchParams.get('action') === 'TEMPLATE' && /Z\/\d{8}T\d{6}Z$/.test(g.searchParams.get('dates') ?? '') && (await page.evaluate(() => document.querySelector('a[data-calendar="google"]')?.getAttribute('target'))) === '_blank', String(googleHref).slice(0, 90));
    if (row) await page.locator(row).screenshot({ path: path.join(shots, 'home_calendar_390.png') });
    await page.screenshot({ path: path.join(shots, 'home_invite_calendar_390.png') });
    check('home: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.close();
  });

  // ---------------------------------------------------------------- details: calendar under the card, Q&A accordion
  await section('details', async () => {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/details`);
    const row = await markCalendarRow(page);
    if (row) await bringIn(page, row);
    const cal = await boxes(page, CAL);
    check('details: calendar buttons below the Order of the Day card, inside 390 px', cal.length === 2 && cal.every((b: any) => b.shown && b.left >= 0 && b.right <= 390 && b.height >= 44), JSON.stringify(cal));
    const cards = await markCards(page, env.profile);
    const scheduleBottom: number = await page.evaluate((cardBottom: number | null) => {
      if (cardBottom !== null) return cardBottom;
      const rows = Array.from(document.querySelectorAll('[data-repeat-item^="schedule."]'));
      return rows.length ? rows[rows.length - 1].getBoundingClientRect().bottom : NaN;
    }, cards.find((c) => c.schedule)?.bottom ?? null);
    check('details: calendar row does not overlap the painted card', cal.length > 0 && cal.every((b: any) => b.top >= scheduleBottom && !cards.some((c) => overlaps(b, c))), `${cal[0]?.top} vs ${scheduleBottom}`);

    await need(page, FAQ, 'the questions & answers block <details data-repeat="faq"> (docs/11 §3.2, §3.5)');
    await bringIn(page, FAQ);
    const items = await boxes(page, `${FAQ} > summary`);
    check('details: three questions, closed, each a ≥ 44 px tap target inside 390 px', items.length === 3 && items.every((b: any) => b.shown && b.height >= 44 && b.left >= 0 && b.right <= 390), JSON.stringify(items.map((b: any) => [Math.round(b.height), Math.round(b.right)])));
    const closed = await page.evaluate((s: string) => Array.from(document.querySelectorAll(s)).map((d) => (d as HTMLDetailsElement).open), FAQ);
    check('details: all answers start closed', closed.length === 3 && closed.every((o: boolean) => !o), JSON.stringify(closed));
    await page.screenshot({ path: path.join(shots, 'details_faq_closed_390.png') });
    // the open/closed sign of a question: CSS ::before/::after or an aria-hidden element inside the summary
    const marker = () =>
      page.evaluate((s: string) => {
        const sum = document.querySelector(`${s} > summary`)!;
        const parts = ['::before', '::after'].map((p) => {
          const cs = getComputedStyle(sum, p);
          return `${cs.content}|${cs.transform}|${cs.opacity}`;
        });
        for (const h of Array.from(sum.querySelectorAll('[aria-hidden="true"]'))) {
          const cs = getComputedStyle(h);
          parts.push(`${h.textContent}|${cs.transform}|${cs.opacity}|${cs.display}`);
        }
        return parts.join(' ; ');
      }, FAQ);
    const markClosed = await marker();
    await page.locator(`${FAQ} > summary`).first().tap();
    await page.waitForTimeout(400);
    const first = await page.evaluate((s: string) => {
      const d = document.querySelector(s) as HTMLDetailsElement;
      const a = (d.querySelector('[data-field$=".a"]') ?? d.querySelector(':scope > :not(summary)')) as HTMLElement;
      const r = a.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(a).lineHeight) || 25;
      return { open: d.open, visible: r.height > 0, lines: Math.round((r.height - parseFloat(getComputedStyle(a).paddingBottom) - parseFloat(getComputedStyle(a).paddingTop)) / lh), text: a.innerText, right: r.right };
    }, FAQ);
    check('details: a tap opens the answer', first.open && first.visible, JSON.stringify(first));
    check('details: the answer keeps its line break (two lines)', first.lines >= 2 && first.text.includes('\n'), `${first.lines} lines`);
    check('details: answer text inside 390 px', first.right <= 390, String(first.right));
    // accessibility tree: a "+" sign (CSS content or a glyph) must not be read as part of the question
    const names = await page.evaluate((s: string) => Array.from(document.querySelectorAll(`${s} > summary`)).map((q) => (q.querySelector('[data-field$=".q"]') ?? q).textContent!.trim()), FAQ);
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const axNames = nodes.filter((n: any) => n.role?.value === 'DisclosureTriangle').map((n: any) => String(n.name?.value ?? '').trim());
    await cdp.detach();
    check('details: each question\'s accessible name is the question text only (no "+")', axNames.length === 3 && JSON.stringify(axNames) === JSON.stringify(names), JSON.stringify(axNames));
    const markOpen = await marker();
    check('details: the question\'s sign changes when it opens ("+" → "×")', markOpen !== markClosed, markOpen);
    await page.locator(`${FAQ} > summary`).nth(2).tap();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(shots, 'details_faq_open_390.png') });
    await page.locator(`${FAQ} > summary`).first().tap();
    await page.waitForTimeout(300);
    check('details: a second tap closes it again', !(await page.evaluate((s: string) => (document.querySelector(s) as HTMLDetailsElement).open, FAQ)));
    // keyboard: summary is focusable and toggles with Enter
    await page.locator(`${FAQ} > summary`).nth(1).focus();
    await page.keyboard.press('Enter');
    check('details: keyboard (Enter) opens an answer', await page.evaluate((s: string) => (document.querySelectorAll(s)[1] as HTMLDetailsElement).open, FAQ));
    check('details: no horizontal overflow', (await overflowX(page)) <= 0);
    await page.screenshot({ path: path.join(shots, 'details_full_390.png'), fullPage: true });
    check('details: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.close();
  });

  // ---------------------------------------------------------------- RSVP: the couple's questions for guests who accept
  await section('rsvp', async () => {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/rsvp`, /status of 400/);
    await need(page, '[data-rsvp] form[data-rsvp-form]', 'the reply form (docs/11 §3.3)');
    await need(page, 'fieldset[data-rsvp-question]', 'the couple\'s questions block (data-repeat="rsvp.questions", docs/11 §3.3)');
    await bringIn(page, '[data-rsvp]', 1600);
    const before = await page.evaluate(() => {
      const block = document.querySelector('fieldset[data-rsvp-question]')?.closest('[data-rsvp-if-attending]') as HTMLElement | null;
      return {
        questions: Boolean(block) && !block!.hidden,
        guests: !(document.querySelector('[name="guests"]')!.closest('[data-rsvp-if-attending]') as HTMLElement).hidden,
      };
    });
    check('rsvp: before "yes"/"no" the questions show like the guest count', before.questions && before.guests, JSON.stringify(before));
    const names = await page.evaluate(() => Array.from(document.querySelectorAll('fieldset[data-rsvp-question] [name]')).map((el) => (el as HTMLInputElement).name));
    check('rsvp: form.js named the inputs answer:<id>', names.length === 4 && names.slice(0, 3).every((n: string) => n === 'answer:meal') && names[3] === 'answer:song', names.join(','));
    await page.fill('input[name="name"]', 'Ada Fictional');
    await page.check('input[name="attending"][value="yes"]');
    check('rsvp: "yes" shows the questions', await page.isVisible('fieldset[data-rsvp-question="meal"]'));
    const pills = await boxes(page, 'fieldset[data-rsvp-question="meal"] label');
    check('rsvp: three choice pills, ≥ 44 px, inside 390 px', pills.length === 3 && pills.every((b: any) => b.height >= 44 && b.left >= 0 && b.right <= 390), JSON.stringify(pills.map((b: any) => Math.round(b.height))));
    await page.locator('fieldset[data-rsvp-question="meal"] label').nth(1).tap();
    await page.fill('fieldset[data-rsvp-question="song"] textarea', 'September — Earth, Wind & Fire');
    await page.fill('input[name="guests"]', '2');
    await page.locator('fieldset[data-rsvp-question]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(shots, 'rsvp_questions_390.png') });
    await page.locator('form[data-rsvp-form]').screenshot({ path: path.join(shots, 'rsvp_form_questions_390.png') });
    check('rsvp: no horizontal overflow', (await overflowX(page)) <= 0);
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 5000 });
    let list = await adapter.listRsvps(seeded.site.id);
    check(
      'rsvp: reply stored with both answers',
      list.length === 1 &&
        JSON.stringify(list[0].answers) ===
          JSON.stringify([
            { id: 'meal', question: 'Meal choice', answer: 'Fish' },
            { id: 'song', question: 'A song that gets you dancing', answer: 'September — Earth, Wind & Fire' },
          ]),
      JSON.stringify(list.map((r) => r.answers)),
    );

    // a guest who declines: questions hidden, nothing of them sent
    await page.click('[data-rsvp-again]');
    await page.fill('input[name="name"]', 'Theo Fictional');
    await page.locator('fieldset[data-rsvp-question="meal"] label').first().tap().catch(() => undefined);
    await page.check('input[name="attending"][value="no"]');
    check('rsvp: "no" hides the questions', !(await page.isVisible('fieldset[data-rsvp-question="meal"]')));
    let body: any = null;
    page.on('request', (rq: any) => {
      if (rq.method() === 'POST' && rq.url().includes('/api/rsvp/')) body = rq.postDataJSON();
    });
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 5000 });
    check('rsvp: a "no" sends no answers', body && body.attending === 'no' && body.answers && Object.keys(body.answers).length === 0, JSON.stringify(body?.answers));
    list = await adapter.listRsvps(seeded.site.id);
    check('rsvp: the declined reply is stored without answers', list.length === 2 && !('answers' in list[1]) && list[1].attending === false);

    // a choice the server does not know (changed in the panel meanwhile): message in the question's own slot
    await page.click('[data-rsvp-again]');
    await page.fill('input[name="name"]', 'Late Changer');
    await page.check('input[name="attending"][value="yes"]');
    await page.evaluate(() => {
      const r = document.querySelector('fieldset[data-rsvp-question="meal"] input') as HTMLInputElement;
      r.value = 'Steak';
      r.checked = true;
    });
    await page.click('[data-rsvp-form] button[type="submit"]');
    await page.waitForSelector('[data-rsvp-state="error"]:not([hidden])', { timeout: 5000 });
    const err = await page.evaluate(() => ({
      slot: document.querySelector('[data-rsvp-error-for="answer:meal"]')?.textContent,
      invalid: document.querySelector('fieldset[data-rsvp-question="meal"] input')?.getAttribute('aria-invalid'),
      described: (document.querySelector('fieldset[data-rsvp-question="meal"] input')?.getAttribute('aria-describedby') ?? '').length > 0,
    }));
    check('rsvp: server error for a question lands in its slot, linked and marked invalid', err.slot === 'Please choose one of the options.' && err.invalid === 'true' && err.described, JSON.stringify(err));
    await page.locator('fieldset[data-rsvp-question="meal"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(shots, 'rsvp_question_error_390.png') });
    check('rsvp: still 2 stored replies', (await adapter.listRsvps(seeded.site.id)).length === 2);
    check('rsvp: no console or CSP errors (the 400 of the invalid step is expected)', problems.length === 0, problems.join(' | '));
    await page.close();
  });

  // ---------------------------------------------------------------- CSV: one column per question
  await section('csv', async () => {
    const res = await fetch(`${BASE}/api/rsvp/${SLUG}/export`, { headers: { authorization: `Bearer ${seeded.editKey}` } });
    const lines = (await res.text()).replace(/^﻿/, '').split('\r\n');
    check('csv: question columns after Message', lines[0].endsWith('"Message","Meal choice","A song that gets you dancing"'), lines[0]);
    check('csv: the answers are in their columns', lines[1]?.endsWith('"Fish","September — Earth, Wind & Fire"') && lines[2]?.endsWith('"",""'), `${lines[1]} | ${lines[2]}`);
  });

  // ---------------------------------------------------------------- panel at 390 px: Q&A editor, question editor, answers in the list
  // (the panel shows these sections only when the theme carries the markers: themeFieldUse)
  await section('panel', async () => {
    const { page, problems } = await newPage(`${BASE}/edit/${SLUG}?k=${seeded.editKey}`);
    const hasFaq = (await page.locator('#section-faq').count()) > 0;
    let faqRows = 0;
    if (hasFaq) {
      await page.click('#section-faq');
      await page.waitForSelector('[data-faq-row="2"]').catch(() => undefined);
      faqRows = await page.locator('[data-faq-row]').count();
    }
    check('panel: "Questions & answers" section lists the three questions', faqRows === 3, hasFaq ? `${faqRows} rows` : 'no "Questions & answers" section: the theme has no faq marker (docs/11 §3.5)');
    if (hasFaq) {
      await page.click('[data-add-faq]');
      await page.fill('#f-faq-3-q', 'Is the venue step-free?');
      await page.fill('#f-faq-3-a', 'Yes: ramps at the entrance and in the hall.');
      await page.click('[aria-label="Move question 4 up"]');
      await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
      const draft = (await adapter.getSiteById(seeded.site.id))!.content;
      check('panel: added and moved question saved in order', draft.faq?.length === 4 && draft.faq[2].q === 'Is the venue step-free?', JSON.stringify(draft.faq?.map((f) => f.q)));
      check('panel: no horizontal overflow (FAQ section)', (await overflowX(page)) <= 0);
      await page.locator('[data-faq-row="2"]').screenshot({ path: path.join(shots, 'panel_faq_row_390.png') });
    }

    await page.click('#section-rsvp');
    const hasQuestions = await page.waitForSelector('[data-rsvp-questions] [data-question-row="1"]').then(() => true, () => false);
    const types = hasQuestions ? await page.locator('[data-rsvp-questions] select').evaluateAll((els: HTMLSelectElement[]) => els.map((e) => e.value)) : [];
    check('panel: RSVP section shows the two questions (choice, text)', JSON.stringify(types) === '["choice","text"]', hasQuestions ? JSON.stringify(types) : 'no "Questions for your guests": the theme has no rsvp.questions marker (docs/11 §3.5)');
    await page.waitForSelector('[data-reply-answer]').catch(() => undefined);
    const answers = await page.locator('[data-reply-answer]').allInnerTexts();
    check('panel: the reply list shows the answers', answers.includes('Meal choice: Fish') && answers.some((t: string) => t.startsWith('A song that gets you dancing: September')), answers.join(' | '));
    if (hasQuestions) {
      await page.click('[data-add-question]');
      await page.fill('#f-rsvp-questions-2-label', 'Do you need a ride from the hotel?');
      await page.fill('#f-rsvp-questions-2-options-0', 'Yes, please');
      await page.fill('#f-rsvp-questions-2-options-1', 'No, thank you');
      await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
      const q = (await adapter.getSiteById(seeded.site.id))!.content.rsvp.questions ?? [];
      check('panel: a third question is saved with a fresh id and its choices', q.length === 3 && /^q[a-z0-9]{6}$/.test(q[2].id) && q[2].options?.join('|') === 'Yes, please|No, thank you', JSON.stringify(q[2]));
      check('panel: at most three questions (no "Add a question" now)', (await page.locator('[data-add-question]').count()) === 0);
      check('panel: no horizontal overflow (RSVP section)', (await overflowX(page)) <= 0);
      await page.locator('[data-rsvp-questions]').screenshot({ path: path.join(shots, 'panel_questions_390.png') });
    }
    await page.locator('[data-replies]').screenshot({ path: path.join(shots, 'panel_replies_answers_390.png') });
    check('panel: no console errors', problems.length === 0, problems.join(' | '));
    await page.close();
  });

  // ---------------------------------------------------------------- theme demo on /start: its calendar file works too
  if (env.internal) {
    console.log('SKIP  demo: internal theme (not on /start)');
  } else {
    await section('demo', async () => {
      const { page, problems } = await newPage(`${BASE}/start/demo/${THEME}/details?preview=demo`);
      const href = await page.evaluate(() => (document.querySelector('a[data-calendar="ics"]') as HTMLAnchorElement | null)?.href ?? '');
      const res = href ? await fetch(href) : null;
      check('demo: calendar file of the theme demo', res && res.status === 200 && /BEGIN:VEVENT/.test(await res.text()), `${res?.status} ${href}`);
      check('demo: no console errors', problems.length === 0, problems.join(' | '));
      await page.close();
    });
  }
} catch (e) {
  check('run', false, String(e));
} finally {
  if (browser) await browser.close();
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
console.log(`\nTheme: ${THEME}. Screenshots: ${shots}`);
if (failed.length) {
  console.error(`${failed.length} of ${checks.length} check(s) failed.\n--- server log ---\n${server.log().slice(-4000)}`);
  process.exit(1);
}
console.log(`All ${checks.length} checks passed.`);
