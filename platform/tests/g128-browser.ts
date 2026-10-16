// Browser check of G128 (small, by request: 3 themes, 390 px): the shared reply form follows the couple's field set
// (required email, required yes / no + choice, optional number / long answers with "(optional)"), shows the server's
// messages in the theme's slots, sends; the panel's "Reply form" editor; Guests with "Download Excel" (a real .xlsx) and
// the Google Sheets card (fake GOOGLE_* values: the button shows; Google itself is never called).
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g128-browser.ts [--out <dir>]
//
// Screenshots: --out, else $G128_SHOTS_DIR, else previews/g128/. Exit code 1 when a check fails.

import { existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { loadThemeEnv, ROOT } from '../scripts/lib/theme-env.ts';

const PORT = Number(process.env.PORT || 3328);
const THEMES = ['blush-garden-rose', 'olive-ivory', 'art-deco-black-tie'];
const chromium = loadChromium();
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const outArg = process.argv.indexOf('--out');
const shots = outArg > 0 ? path.resolve(process.argv[outArg + 1]) : process.env.G128_SHOTS_DIR || path.join(ROOT, 'previews/g128');
mkdirSync(shots, { recursive: true });

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
function content(theme: string): ContentRecord {
  const c = structuredClone(loadThemeEnv({ theme } as never).demo);
  c.record_kind = 'customer';
  c.partners = [{ display_name: 'Maren', full_name: 'Maren Holloway' }, { display_name: 'Theo', full_name: 'Theo Castellan' }];
  c.name_display = 'Maren & Theo';
  c.initials = 'M&T';
  c.date = isoDay(200);
  c.rsvp = {
    deadline: isoDay(150),
    method: null,
    required: { email: true },
    questions: [
      { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'], required: true },
      { id: 'bus', label: 'Shuttle from the hotel?', type: 'yesno', required: true },
      { id: 'kids', label: 'Children coming with you', type: 'number' },
      { id: 'wish', label: 'A wish for the two of us', type: 'long' },
    ],
  };
  return c;
}

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g128-browser-data-'));
const themesDir = path.join(ROOT, 'themes');
process.env.PLATFORM_THEMES_DIR = themesDir;
const adapter = new LocalAdapter(dataDir);
const sites: Record<string, { id: string; key: string; slug: string }> = {};
for (const theme of THEMES) {
  const slug = `g128-${theme}`;
  const s = await createSiteWithKeys(adapter, { slug, theme, content: content(theme) });
  await publishSite(adapter, s.site.id);
  sites[theme] = { id: s.site.id, key: s.editKey, slug };
}

const server = startNext({
  port: PORT,
  dataDir,
  env: { PLATFORM_THEMES_DIR: themesDir, GOOGLE_CLIENT_ID: 'fake-client.apps.googleusercontent.com', GOOGLE_CLIENT_SECRET: 'fake', GOOGLE_TOKEN_KEY: 'f'.repeat(48) },
});
const BASE = server.base;
const checks: Array<{ name: string; ok: boolean }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

let browser: any;
try {
  await waitForServer(`${BASE}/`, 30_000, server);
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  context.setDefaultTimeout(8000);
  const overflowX = (page: any) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  for (const theme of THEMES) {
    const { slug, id } = sites[theme];
    const page = await context.newPage();
    const problems: string[] = [];
    page.on('pageerror', (e: unknown) => problems.push(String(e)));
    // (the hand-made request below is refused on purpose: its 400 is not a page problem)
    page.on('console', (m: any) => m.type() === 'error' && !/status of 400/.test(m.text()) && problems.push(m.text()));
    await page.goto(`${BASE}/${slug}/rsvp`, { waitUntil: 'networkidle' });
    const form = page.locator('form[data-rsvp-form]');
    await form.waitFor();
    const state = await page.evaluate(() => {
      const email = document.querySelector<HTMLInputElement>('input[name="email"]')!;
      const emailMark = email.closest('label')?.querySelector<HTMLElement>('[data-copy="form_optional"], .opt');
      const legend = (id: string) => document.querySelector(`[data-rsvp-question="${id}"] legend`)?.textContent?.replace(/\s+/g, ' ').trim();
      return {
        emailRequired: email.required && email.getAttribute('aria-required') === 'true',
        emailMarkHidden: !emailMark || emailMark.hidden || getComputedStyle(emailMark).display === 'none',
        meal: legend('meal'),
        kids: legend('kids'),
        busRadios: Array.from(document.querySelectorAll<HTMLInputElement>('[data-rsvp-question="bus"] input[type="radio"]')).map((r) => r.value),
        kidsMode: document.querySelector('[data-rsvp-question="kids"] textarea')?.getAttribute('inputmode'),
      };
    });
    check(`${theme}: email marked required, its "(optional)" hidden`, state.emailRequired && state.emailMarkHidden);
    check(`${theme}: required questions without "(optional)", optional ones with it`, state.meal === 'Meal choice' && /\(optional\)$/i.test(state.kids ?? ''), `${state.meal} | ${state.kids}`);
    check(`${theme}: yes / no question = two choices, number = numeric keypad`, state.busRadios.join() === 'Yes,No' && state.kidsMode === 'numeric', JSON.stringify(state));

    await page.fill('input[name="name"]', 'Ada Lovelace');
    await page.locator('input[name="attending"][value="yes"]').check();
    await page.locator('button[type="submit"]').click();
    const errs = await page.evaluate(() =>
      Object.fromEntries(Array.from(document.querySelectorAll('[data-rsvp-error-for]')).map((e) => [e.getAttribute('data-rsvp-error-for'), e.textContent?.trim()]).filter(([, t]) => t)),
    );
    check(
      `${theme}: client messages for required email, choice and yes / no`,
      errs.email === 'Please enter your email address.' && errs['answer:meal'] === 'Please choose an answer.' && errs['answer:bus'] === 'Please choose an answer.',
      JSON.stringify(errs),
    );
    const described = await page.evaluate(() => document.querySelector('input[name="email"]')?.getAttribute('aria-describedby') ?? '');
    check(`${theme}: error linked to the field (aria-describedby)`, described.length > 0);
    await form.screenshot({ path: path.join(shots, `form_errors_${theme}_390.png`) });

    // server check too: a required answer missing in a hand-made request is refused
    const raw = await page.evaluate(async (s: string) => {
      const r = await fetch(`/api/rsvp/${s}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'X', attending: 'yes', email: 'x@example.com', answers: { meal: 'Fish' } }) });
      return { status: r.status, body: await r.json() };
    }, slug);
    check(`${theme}: server refuses a missing required answer (400, answer:bus)`, raw.status === 400 && raw.body.fields?.['answer:bus'] === 'Please choose an answer.', JSON.stringify(raw));

    await page.fill('input[name="email"]', 'ada@example.com');
    await page.locator('[data-rsvp-question="meal"] input[value="Fish"]').check();
    await page.locator('[data-rsvp-question="bus"] input[value="Yes"]').check();
    await page.fill('[data-rsvp-question="kids"] textarea', '2');
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('form[data-rsvp-form]')?.getAttribute('data-rsvp-status') === 'success', null, { timeout: 10_000 }).catch(() => undefined);
    const stored = await adapter.listRsvps(id);
    const ada = stored.find((r) => r.name === 'Ada Lovelace');
    check(`${theme}: reply sent and stored with typed answers`, ada && ada.answers?.map((a) => `${a.id}=${a.answer}`).join() === 'meal=Fish,bus=Yes,kids=2', JSON.stringify(ada?.answers));
    check(`${theme}: no horizontal overflow, no console / CSP errors`, (await overflowX(page)) <= 0 && problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------- panel (first theme)
  const { slug, key } = sites[THEMES[0]];
  const page = await context.newPage();
  const problems: string[] = [];
  page.on('pageerror', (e: unknown) => problems.push(String(e)));
  await page.goto(`${BASE}/edit/${slug}?k=${key}#edit/rsvp`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-rsvp-form-fields]');
  check('panel: Reply form lists the 5 built-in fields', (await page.locator('[data-rsvp-field]').count()) === 5);
  check('panel: name / attending marked "Always required"', (await page.getByText('Always required').count()) === 2);
  await page.locator('[data-rsvp-field="form_note"] label:has(input[value="required"])').click();
  await page.waitForFunction(() => document.querySelector('[data-save-state]')?.getAttribute('data-save-state') === 'saved', null, { timeout: 15_000 });
  const draft = (await adapter.getSiteById(sites[THEMES[0]].id))!.content;
  check('panel: note switched to Required is saved (rsvp.required.message)', draft.rsvp.required?.message === true && draft.rsvp.required?.email === true, JSON.stringify(draft.rsvp.required));
  await page.locator('[data-rsvp-form-fields]').screenshot({ path: path.join(shots, 'panel_reply_form_390.png') });
  const card = page.locator('[data-question-row="1"]');
  await card.screenshot({ path: path.join(shots, 'panel_question_yesno_390.png') });
  const segH = await page.evaluate(() => Math.min(...Array.from(document.querySelectorAll('[data-rsvp-form-fields] label:has(input[type="radio"])')).map((l) => l.getBoundingClientRect().height).filter((h) => h > 0)));
  check('panel: Required / Optional choices are at least 44 px tall', segH >= 44, String(segH));
  check('panel: no horizontal overflow (Reply form)', (await overflowX(page)) <= 0);

  await page.evaluate(() => (window.location.hash = '#guests'));
  await page.waitForSelector('[data-excel]');
  await page.waitForSelector('[data-sheets]');
  check('guests: "Connect Google Sheets" shown when Google is set up', (await page.locator('[data-sheets-connect]').count()) === 1);
  const href = await page.locator('[data-excel]').getAttribute('href');
  const xlsx = await page.evaluate(async (h: string) => {
    const r = await fetch(h);
    const b = new Uint8Array(await r.arrayBuffer());
    return { status: r.status, type: r.headers.get('content-type'), zip: b[0] === 0x50 && b[1] === 0x4b, size: b.length };
  }, href);
  check('guests: "Download Excel" gives a real .xlsx', xlsx.status === 200 && /spreadsheetml/.test(xlsx.type ?? '') && xlsx.zip, JSON.stringify(xlsx));
  await page.locator('[data-sheets]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(shots, 'guests_sheets_390.png') });
  await page.locator('[data-sheets]').screenshot({ path: path.join(shots, 'guests_sheets_card_390.png') });
  check('guests: no horizontal overflow, no page errors', (await overflowX(page)) <= 0 && problems.length === 0, problems.join(' | '));
  await page.close();
} catch (e) {
  check(`run: ${(e as Error).message}`, false);
  console.error(server.log().slice(-2000));
} finally {
  await browser?.close();
  server.stop();
}

const failed = checks.filter((c) => !c.ok).length;
console.log(`\n${checks.length - failed}/${checks.length} passed · screenshots: ${shots}`);
process.exit(failed ? 1 : 0);
