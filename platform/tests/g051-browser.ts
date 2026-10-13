// Browser check of G051 on the real theme (blush-garden-rose): add to calendar, questions & answers,
// reply-form questions, the couple's panel. Real `next start` + Chromium at 390 px (isMobile, touch).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g051-browser.ts
//
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`). Seeds into a temporary
// data folder (platform/.data is not touched). Screenshots go to $G051_SHOTS_DIR (default: a temp folder).
// Exit code 1 when a check fails.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 3316);
const BASE = `http://127.0.0.1:${PORT}`;
const require = createRequire(import.meta.url);

let chromium: any;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
  try {
    ({ chromium } = require(id));
    break;
  } catch {
    /* next location */
  }
}
if (!chromium) {
  console.error('playwright not found: run with NODE_PATH=/opt/node22/lib/node_modules');
  process.exit(2);
}
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const SLUG = 'maren-and-theo';
const content = (): ContentRecord => {
  const c = JSON.parse(readFileSync(path.join(ROOT, '../collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
  c.record_kind = 'customer';
  c.partners = [{ display_name: 'Maren', full_name: 'Maren Holloway' }, { display_name: 'Theo', full_name: 'Theo Castellan' }];
  c.name_display = 'Maren & Theo';
  c.initials = 'M&T';
  c.rsvp.deadline = isoDay(150);
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
const shots = process.env.G051_SHOTS_DIR || mkdtempSync(path.join(os.tmpdir(), 'g051-browser-shots-'));
mkdirSync(shots, { recursive: true });
process.env.PLATFORM_THEMES_DIR = themesDir;

const adapter = new LocalAdapter(dataDir);
const seeded = await createSiteWithKeys(adapter, { slug: SLUG, theme: 'blush-garden-rose', content: content() });
await publishSite(adapter, seeded.site.id);

const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, PLATFORM_DATA_DIR: dataDir, PLATFORM_THEMES_DIR: themesDir, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

async function waitForServer(url: string, ms = 30_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`server did not start at ${url}`);
}

/** Layout facts of the elements matching `sel`: box, visibility and whether they stay inside the 390 px viewport. */
const boxes = (page: any, sel: string) =>
  page.evaluate((s: string) => {
    return Array.from(document.querySelectorAll(s)).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { left: r.left, right: r.right, top: r.top, height: r.height, width: r.width, shown: cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.5 };
    });
  }, sel);
const overflowX = (page: any) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
/** Scrolls an element to the middle of the screen and waits for its scene entrance to finish. */
async function bringIn(page: any, sel: string, settle = 3200) {
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.evaluate((s: string) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
  await page.waitForTimeout(settle);
}

let browser: any;
try {
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
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
  {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/home`);
    await bringIn(page, '.invite-sec .cal');
    const links = await boxes(page, '.invite-sec .cal a');
    check('home: two calendar buttons, visible, inside 390 px, ≥ 44 px tall', links.length === 2 && links.every((b: any) => b.shown && b.left >= 0 && b.right <= 390 && b.height >= 44), JSON.stringify(links));
    check('home: the two buttons sit side by side', links.length === 2 && Math.abs(links[0].top - links[1].top) < 2, JSON.stringify(links.map((b: any) => b.top)));
    check('home: no horizontal overflow', (await overflowX(page)) <= 0);
    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('.invite-sec .cal a')).map((a) => (a as HTMLAnchorElement).href));
    const ics = await fetch(hrefs[0]);
    const icsText = await ics.text();
    check('home: "Apple / Outlook" opens /<slug>/event.ics (text/calendar, VEVENT)', ics.status === 200 && /text\/calendar/.test(ics.headers.get('content-type') ?? '') && /BEGIN:VEVENT/.test(icsText) && /SUMMARY:Maren & Theo’s Wedding/.test(icsText), `${ics.status} ${hrefs[0]}`);
    const g = new URL(hrefs[1]);
    check('home: "Google" opens a Google Calendar template link in a new tab', g.hostname === 'calendar.google.com' && g.searchParams.get('action') === 'TEMPLATE' && /Z\/\d{8}T\d{6}Z$/.test(g.searchParams.get('dates') ?? ''), hrefs[1].slice(0, 90));
    await page.locator('.invite-sec .cal').screenshot({ path: path.join(shots, 'home_calendar_390.png') });
    await page.screenshot({ path: path.join(shots, 'home_invite_calendar_390.png') });
    check('home: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------- details: calendar under the card, Q&A accordion
  {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/details`);
    await bringIn(page, '[data-scene="details-card"] .cal');
    const cal = await boxes(page, '[data-scene="details-card"] .cal a');
    check('details: calendar buttons below the Order of the Day card, inside 390 px', cal.length === 2 && cal.every((b: any) => b.shown && b.left >= 0 && b.right <= 390 && b.height >= 44), JSON.stringify(cal));
    const cardBottom = await page.evaluate(() => document.querySelector('[data-scene="details-card"] .info')!.getBoundingClientRect().bottom);
    check('details: calendar row does not overlap the painted card', cal.length > 0 && cal[0].top >= cardBottom, `${cal[0]?.top} vs ${cardBottom}`);

    await bringIn(page, '.faq-sec');
    const items = await boxes(page, '.faq-item summary');
    check('details: three questions, closed, each a ≥ 44 px tap target inside 390 px', items.length === 3 && items.every((b: any) => b.shown && b.height >= 44 && b.left >= 0 && b.right <= 390), JSON.stringify(items.map((b: any) => [Math.round(b.height), Math.round(b.right)])));
    const closed = await page.evaluate(() => Array.from(document.querySelectorAll('.faq-item')).map((d) => (d as HTMLDetailsElement).open));
    check('details: all answers start closed', closed.every((o: boolean) => !o), JSON.stringify(closed));
    await page.screenshot({ path: path.join(shots, 'details_faq_closed_390.png') });
    await page.locator('.faq-item summary').first().tap();
    await page.waitForTimeout(400);
    const first = await page.evaluate(() => {
      const d = document.querySelector('.faq-item') as HTMLDetailsElement;
      const a = d.querySelector('.faq-a') as HTMLElement;
      const r = a.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(a).lineHeight) || 25;
      return { open: d.open, visible: r.height > 0, lines: Math.round((r.height - parseFloat(getComputedStyle(a).paddingBottom)) / lh), text: a.innerText, right: r.right };
    });
    check('details: a tap opens the answer', first.open && first.visible, JSON.stringify(first));
    check('details: the answer keeps its line break (two lines)', first.lines >= 2 && first.text.includes('\n'), `${first.lines} lines`);
    check('details: answer text inside 390 px', first.right <= 390, String(first.right));
    const glyph = await page.evaluate(() => getComputedStyle(document.querySelector('.faq-item summary')!, '::after').transform);
    check('details: the "+" turns into "×" when open', glyph !== 'none', glyph);
    await page.locator('.faq-item:nth-child(3) summary').tap();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(shots, 'details_faq_open_390.png') });
    await page.locator('.faq-item summary').first().tap();
    await page.waitForTimeout(300);
    check('details: a second tap closes it again', !(await page.evaluate(() => (document.querySelector('.faq-item') as HTMLDetailsElement).open)));
    // keyboard: summary is focusable and toggles with Enter
    await page.focus('.faq-item:nth-child(2) summary');
    await page.keyboard.press('Enter');
    check('details: keyboard (Enter) opens an answer', await page.evaluate(() => (document.querySelector('.faq-item:nth-child(2)') as HTMLDetailsElement).open));
    check('details: no horizontal overflow', (await overflowX(page)) <= 0);
    await page.screenshot({ path: path.join(shots, 'details_full_390.png'), fullPage: true });
    check('details: no console or CSP errors', problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------- RSVP: the couple's questions for guests who accept
  {
    const { page, problems } = await newPage(`${BASE}/${SLUG}/rsvp`, /status of 400/);
    await bringIn(page, '.reply-box', 1600);
    const before = await page.evaluate(() => ({
      questions: !(document.querySelector('.questions') as HTMLElement).hidden,
      guests: !(document.querySelector('[name="guests"]')!.closest('[data-rsvp-if-attending]') as HTMLElement).hidden,
    }));
    check('rsvp: before "yes"/"no" the questions show like the guest count', before.questions && before.guests, JSON.stringify(before));
    const names = await page.evaluate(() => Array.from(document.querySelectorAll('.questions [name]')).map((el) => (el as HTMLInputElement).name));
    check('rsvp: form.js named the inputs answer:<id>', names.length === 4 && names.slice(0, 3).every((n: string) => n === 'answer:meal') && names[3] === 'answer:song', names.join(','));
    await page.fill('input[name="name"]', 'Ada Fictional');
    await page.check('input[name="attending"][value="yes"]');
    check('rsvp: "yes" shows the questions', await page.isVisible('fieldset[data-rsvp-question="meal"]'));
    const pills = await boxes(page, 'fieldset[data-rsvp-question="meal"] label');
    check('rsvp: three choice pills, ≥ 44 px, inside 390 px', pills.length === 3 && pills.every((b: any) => b.height >= 44 && b.left >= 0 && b.right <= 390), JSON.stringify(pills.map((b: any) => Math.round(b.height))));
    await page.locator('fieldset[data-rsvp-question="meal"] label').nth(1).tap();
    await page.fill('fieldset[data-rsvp-question="song"] textarea', 'September — Earth, Wind & Fire');
    await page.fill('input[name="guests"]', '2');
    await page.locator('.questions').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(shots, 'rsvp_questions_390.png') });
    await page.locator('form[data-rsvp-form]').screenshot({ path: path.join(shots, 'rsvp_form_questions_390.png') });
    check('rsvp: no horizontal overflow', (await overflowX(page)) <= 0);
    await page.click('button[type="submit"]');
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
    await page.click('button[type="submit"]');
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
    await page.click('button[type="submit"]');
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
  }

  // ---------------------------------------------------------------- CSV: one column per question
  {
    const res = await fetch(`${BASE}/api/rsvp/${SLUG}/export`, { headers: { authorization: `Bearer ${seeded.editKey}` } });
    const lines = (await res.text()).replace(/^﻿/, '').split('\r\n');
    check('csv: question columns after Message', lines[0].endsWith('"Message","Meal choice","A song that gets you dancing"'), lines[0]);
    check('csv: the answers are in their columns', lines[1].endsWith('"Fish","September — Earth, Wind & Fire"') && lines[2].endsWith('"",""'), `${lines[1]} | ${lines[2]}`);
  }

  // ---------------------------------------------------------------- panel at 390 px: Q&A editor, question editor, answers in the list
  {
    const { page, problems } = await newPage(`${BASE}/edit/${SLUG}?k=${seeded.editKey}`);
    await page.click('#section-faq');
    await page.waitForSelector('[data-faq-row="2"]');
    check('panel: "Questions & answers" section lists the three questions', (await page.locator('[data-faq-row]').count()) === 3);
    await page.click('[data-add-faq]');
    await page.fill('#f-faq-3-q', 'Is the venue step-free?');
    await page.fill('#f-faq-3-a', 'Yes: ramps at the entrance and in the hall.');
    await page.click('[aria-label="Move question 4 up"]');
    await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
    const draft = (await adapter.getSiteById(seeded.site.id))!.content;
    check('panel: added and moved question saved in order', draft.faq?.length === 4 && draft.faq[2].q === 'Is the venue step-free?', JSON.stringify(draft.faq?.map((f) => f.q)));
    check('panel: no horizontal overflow (FAQ section)', (await overflowX(page)) <= 0);
    await page.locator('[data-faq-row="2"]').screenshot({ path: path.join(shots, 'panel_faq_row_390.png') });

    await page.click('#section-rsvp');
    await page.waitForSelector('[data-rsvp-questions] [data-question-row="1"]');
    const types = await page.locator('[data-rsvp-questions] select').evaluateAll((els: HTMLSelectElement[]) => els.map((e) => e.value));
    check('panel: RSVP section shows the two questions (choice, text)', JSON.stringify(types) === '["choice","text"]', JSON.stringify(types));
    await page.waitForSelector('[data-reply-answer]');
    const answers = await page.locator('[data-reply-answer]').allInnerTexts();
    check('panel: the reply list shows the answers', answers.includes('Meal choice: Fish') && answers.some((t: string) => t.startsWith('A song that gets you dancing: September')), answers.join(' | '));
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
    await page.locator('[data-replies]').screenshot({ path: path.join(shots, 'panel_replies_answers_390.png') });
    check('panel: no console errors', problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------- theme demo on /start: its calendar file works too
  {
    const { page, problems } = await newPage(`${BASE}/start/demo/blush-garden-rose/details?preview=demo`);
    const href = await page.evaluate(() => (document.querySelector('a[data-calendar="ics"]') as HTMLAnchorElement | null)?.href ?? '');
    const res = await fetch(href);
    check('demo: calendar file of the theme demo', res.status === 200 && /BEGIN:VEVENT/.test(await res.text()), `${res.status} ${href}`);
    check('demo: no console errors', problems.length === 0, problems.join(' | '));
    await page.close();
  }
} catch (e) {
  check('run', false, String(e));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
  rmSync(dataDir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
console.log(`\nScreenshots: ${shots}`);
if (failed.length) {
  console.error(`${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
  process.exit(1);
}
console.log(`All ${checks.length} checks passed.`);
