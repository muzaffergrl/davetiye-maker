// Browser checks of the five languages (G144, K45 item 3): real `next start` + Chromium. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g144-browser.ts
//
// Guests, 390 × 844: three designs (G144_THEMES=<id,…>) with languages en + tr + de and a few approved translations —
// every page in TR and DE without horizontal scroll or text sticking out of the screen (long German words), <html lang>,
// the switcher (opens, lists 3 languages, keeps the page), links keep ?lang, the RSVP form's errors in the language, the
// first-visit suggestion for a German browser. Couple: the panel in Turkish (cookie bke_lang=tr) → Us → Languages. Sales
// site: /tr and /de home + /de/designs (hreflang, switcher). PNG → previews/g144/ (or $G144_SHOTS_DIR). Exit 1 on a failure.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { srcHash } from '../lib/i18n/content.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { loadThemeEnv, ROOT } from '../scripts/lib/theme-env.ts';

const PORT = Number(process.env.PORT || 3344);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G144_SHOTS_DIR || path.join(ROOT, 'previews/g144');
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g144-browser-data-'));
mkdirSync(OUT, { recursive: true });
const THEMES = (process.env.G144_THEMES ?? 'olive-ivory,art-deco-black-tie,crimson-rose-atelier').split(',').filter(Boolean);
const LANGS = ['tr', 'de'] as const;

function seed(theme: string, slug: string, edit: (c: any) => void): { slug: string; editKey: string } {
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
  return { slug, editKey: keys.editKey };
}

/** Three languages; the story intro and the first FAQ answer translated and approved (TR, DE). */
const multilingual = (c: any) => {
  c.languages = { primary: 'en', extra: ['tr', 'de'] };
  c.optional_blocks = { ...c.optional_blocks, faq: true, our_story: true };
  c.faq = [{ q: 'Can we bring our children?', a: 'We love your little ones, but the evening is adults only.' }];
  const tr: Record<string, unknown> = {};
  const de: Record<string, unknown> = {};
  const add = (p: string, src: string | undefined, t: string, d: string) => {
    if (!src) return;
    tr[p] = { text: t, src: srcHash(src), ok: true };
    de[p] = { text: d, src: srcHash(src), ok: true };
  };
  add('faq.0.q', c.faq[0].q, 'Çocuklarımızı getirebilir miyiz?', 'Dürfen wir unsere Kinder mitbringen?');
  add('faq.0.a', c.faq[0].a, 'Minikleri çok seviyoruz ama akşam yalnızca yetişkinlere özel.', 'Wir lieben eure Kleinen, aber der Abend ist nur für Erwachsene.');
  add('story.intro', c.story?.intro, 'Hikâyemiz küçük bir kahve dükkânında başladı.', 'Unsere Geschichte begann in einem kleinen Café.');
  c.translations = { tr, de };
};

const sites = Object.fromEntries(THEMES.map((t) => [t, seed(t, `diller-${t}`, multilingual)]));

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
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'UTC' };
const shot = async (page: any, name: string, fullPage = false) => {
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
};
/** Horizontal scroll, and visible text boxes that stick out of the screen or out of a box that clips them. */
const overflow = (page: any) =>
  page.evaluate(() => {
    const out: string[] = [];
    const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    if (over > 1) out.push(`horizontal scroll ${over}px`);
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,a,button,label,span,li,summary,legend'))) {
      if (!el.offsetParent || el.closest('[hidden], .pl-lang ul, template, [aria-hidden="true"]')) continue;
      const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent!.trim());
      if (!own) continue;
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' && cs.visibility === 'hidden') continue;
      if (r.right > window.innerWidth + 1 || r.left < -1) out.push(`"${el.textContent!.trim().slice(0, 30)}" outside the screen (${Math.round(r.left)}…${Math.round(r.right)})`);
      else if (el.scrollWidth > el.clientWidth + 2 && (cs.overflow === 'hidden' || cs.overflowX === 'hidden') && cs.textOverflow !== 'ellipsis') {
        out.push(`"${el.textContent!.trim().slice(0, 30)}" clipped (${el.scrollWidth} > ${el.clientWidth})`);
      }
    }
    return [...new Set(out)].slice(0, 8);
  });

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();

  for (const theme of THEMES) {
    const site = sites[theme];
    for (const lang of LANGS) {
      await block(`${theme}/${lang}: guest pages`, async () => {
        const ctx = await browser.newContext(PHONE);
        const page = await ctx.newPage();
        const errors: string[] = [];
        page.on('console', (m: any) => m.type() === 'error' && errors.push(m.text()));
        page.on('pageerror', (e: any) => errors.push(String(e)));
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const p of ['', '/home', '/story', '/details', '/rsvp']) {
          const res = await page.goto(`${BASE}/${site.slug}${p}?lang=${lang}`, { waitUntil: 'networkidle' });
          const name = p.slice(1) || 'index';
          check(`${theme}/${lang}/${name}: 200, <html lang="${lang}">`, res.status() === 200 && (await page.locator('html').getAttribute('lang')) === lang);
          await page.waitForTimeout(500);
          const problems = await overflow(page);
          check(`${theme}/${lang}/${name}: no horizontal scroll, no text out of the screen`, !problems.length, problems.join(' ; '));
          if (name === 'index' || name === 'home' || name === 'rsvp' || name === 'details') await shot(page, `${theme}_${lang}_${name}`, name !== 'index');
        }
        // links keep the language
        const hrefs: string[] = await page.locator(`a[href^="/${site.slug}"]`).evaluateAll((as: HTMLAnchorElement[]) => as.filter((a) => !a.closest('.pl-lang')).map((a) => a.getAttribute('href')!));
        check(`${theme}/${lang}: page links keep ?lang=${lang}`, hrefs.length > 0 && hrefs.every((h) => h.includes(`lang=${lang}`)), hrefs.slice(0, 4).join(' '));
        // the RSVP form's own errors in the language
        await page.goto(`${BASE}/${site.slug}/rsvp?lang=${lang}`, { waitUntil: 'networkidle' });
        const submit = page.locator('form[data-rsvp-form] [type="submit"]').first();
        if (await submit.count()) {
          await submit.click();
          await page.waitForTimeout(300);
          const err = (await page.locator('[data-rsvp-error-for="name"]').first().innerText().catch(() => '')).trim();
          check(`${theme}/${lang}: RSVP error message is translated`, err && err !== 'Please enter your name.', err);
          await shot(page, `${theme}_${lang}_rsvp_errors`);
        }
        // the switcher
        await page.locator('.pl-lang summary').click();
        const items = await page.locator('.pl-lang a').allInnerTexts();
        check(`${theme}/${lang}: the language button lists English, Türkçe, Deutsch`, items.join(',') === 'English,Türkçe,Deutsch', items.join(','));
        await shot(page, `${theme}_${lang}_switcher`);
        await page.locator('.pl-lang a[hreflang="en"]').click();
        await page.waitForURL((u: URL) => u.pathname === `/${site.slug}/rsvp` && !u.search.includes('lang='));
        check(`${theme}/${lang}: switching to English stays on the RSVP page`, (await page.locator('html').getAttribute('lang')) === 'en');
        check(`${theme}/${lang}: no console or CSP errors`, !errors.length, errors.slice(0, 3).join(' | '));
        await ctx.close();
      });
    }
  }

  await block('first visit with a German browser: one suggestion, in German', async () => {
    const ctx = await browser.newContext({ ...PHONE, locale: 'de-DE' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${sites[THEMES[0]].slug}/home`, { waitUntil: 'networkidle' });
    const tip = page.locator('.pl-lang-tip a');
    check('German browser: suggestion "Diese Website auf Deutsch lesen" → ?lang=de', (await tip.innerText()) === 'Diese Website auf Deutsch lesen' && (await tip.getAttribute('href'))!.includes('lang=de'));
    await shot(page, 'suggestion_de');
    await page.locator('.pl-lang-tip button').click();
    await page.reload({ waitUntil: 'networkidle' });
    check('closed suggestion stays closed for the visit', (await page.locator('.pl-lang-tip').count()) === 0);
    await ctx.close();
  });

  await block('panel in Turkish: Us → Languages', async () => {
    const site = sites[THEMES[0]];
    const ctx = await browser.newContext(PHONE);
    await ctx.addCookies([{ name: 'bke_lang', value: 'tr', url: BASE }]);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/edit/${site.slug}?k=${site.editKey}#edit/us`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const lang = await page.locator('[data-disclosure="languages"] button').first().innerText();
    check('panel: the Languages section is in Turkish', /Diller/i.test(lang), lang);
    await page.locator('[data-disclosure="languages"] button').first().click();
    await page.waitForTimeout(300);
    const rows = await page.locator('[data-translation]').count();
    check('panel: one row per own text in each extra language', rows >= 4, String(rows));
    check('panel: approved translations show as approved', (await page.locator('[data-language="tr"] [data-translation="faq.0.a"][data-state="ok"]').count()) === 1);
    await page.locator('[data-languages]').scrollIntoViewIfNeeded();
    await shot(page, 'panel_tr_languages');
    await page.locator('[data-language="tr"]').scrollIntoViewIfNeeded();
    await shot(page, 'panel_tr_languages_rows');
    const problems = await overflow(page);
    check('panel (TR, 390): nothing out of the screen', !problems.length, problems.join(' ; '));
    await page.goto(`${BASE}/edit/${site.slug}?k=${site.editKey}#home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await shot(page, 'panel_tr_home');
    await ctx.close();
  });

  await block('sales site in Turkish and German', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    for (const [url, name] of [
      ['/tr', 'market_tr_home'],
      ['/de', 'market_de_home'],
      ['/de/designs', 'market_de_designs'],
    ] as const) {
      const res = await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
      check(`${url}: 200`, res.status() === 200, String(res.status()));
      const alts = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((ls: HTMLLinkElement[]) => ls.map((l) => l.hreflang));
      check(`${url}: hreflang for the five languages + x-default`, ['en', 'tr', 'es', 'de', 'fr', 'x-default'].every((l) => alts.includes(l)), alts.join(','));
      const problems = await overflow(page);
      check(`${url}: no horizontal scroll`, !problems.some((p: string) => p.startsWith('horizontal')), problems.join(' ; '));
      await shot(page, name);
    }
    await ctx.close();
  });
} finally {
  await browser?.close();
  server.stop();
  writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(checks, null, 2));
  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  process.exitCode = failed.length ? 1 : 0;
}
