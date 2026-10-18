// G181 browser check of the split editor: real `next start` + Chromium at 390 px. Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g181-browser.ts
//
// 1. Deep links (#home, #edit, #edit/photos, #edit/venue, #guests, #guests/results, #guests/print, #share, #setup/1) open
//    the right view on a never-published site (the server renders setup) and on a live one (the server renders Home);
//    no page error, no hydration error in the console, the skeleton is gone afterwards.
// 2. Before hydration (every JS chunk blocked): a deep link (or a setup closed on this phone → Home) asks the server once
//    more (?view=<hash>) and gets its view server-rendered; with ?view already there (or ignored) the skeleton of the
//    address's view shows, its tab marked, the server's default view hidden; no address / the default view's own
//    address → nothing. After hydration the address keeps only k and the hash.
// 3. The first load fetches no other view's code; the others arrive while idle, so a tap on Share / Guests / an editor
//    page shows the view at once (no "loading" frame).
// Exit 1 when a check fails. Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`).

import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { REPO, ROOT } from '../scripts/lib/theme-env.ts';

if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const PORT = Number(process.env.PORT || 3481);
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g181-browser-data-'));
const adapter = new LocalAdapter(dataDir);
const THEME = 'blush-garden-rose';
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;
const draft = await createSiteWithKeys(adapter, { slug: 'elena-and-marco', theme: THEME, content: draftFromDemo(demo, ['Elena', 'Marco']) });
const live = await createSiteWithKeys(adapter, { slug: 'nora-and-sam', theme: THEME, content: draftFromDemo(demo, ['Nora', 'Sam']) });
await publishSite(adapter, live.site.id);

const server = startNext({ port: PORT, dataDir });
const BASE = server.base;
const editUrl = (slug: string, key: string, hash = '') => `${BASE}/edit/${slug}?k=${encodeURIComponent(key)}${hash}`;
const DRAFT = (hash = '') => editUrl('elena-and-marco', draft.editKey, hash);
const LIVE = (hash = '') => editUrl('nora-and-sam', live.editKey, hash);

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

/** [hash, data-view of the editor root, the view's heading] */
const DEEP: Array<[string, string, string]> = [
  ['#home', 'home', ''],
  ['#edit', 'edit', 'Edit your website'],
  ['#edit/photos', 'edit/photos', 'Photos'],
  ['#edit/venue', 'edit/day', 'Day & place'],
  ['#guests', 'guests', 'Guests'],
  ['#guests/results', 'results', 'Guests'],
  ['#guests/print', 'print', 'Guest list'],
  ['#share', 'share', 'Share'],
];
/** A text only that view's chunk has (tests/g181-panel-split.test.ts VIEW_MARKERS). */
const MARKERS: Record<string, string> = {
  share: 'Take the website offline',
  guests: 'Mark as seen',
  editor: 'Preview this page',
  help: 'How long does my website stay online?',
};

const browser = await chromium.launch();
try {
  await waitForServer(`${BASE}/robots.txt`, 90_000, server);

  // ------------------------------------------------------------------ 1. deep links open the right view
  await block('deep links', async () => {
    for (const [site, url, label] of [
      ['draft', DRAFT, 'never published (server: setup)'],
      ['live', LIVE, 'live (server: Home)'],
    ] as const) {
      for (const [hash, view, heading] of DEEP) {
        const ctx = await browser.newContext(PHONE);
        const page = await ctx.newPage();
        const errors: string[] = [];
        page.on('pageerror', (e: Error) => errors.push(String(e.message)));
        page.on('console', (m: any) => {
          if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text());
        });
        await page.goto(url(hash), { waitUntil: 'load' });
        const opened = await page
          // hydrated: the panel decided its first view (the skeleton is gone) and shows this one
          .waitForFunction((v: string) => !document.querySelector('[data-boot-shell]') && document.querySelector('[data-panel-root]')?.getAttribute('data-view') === v, view, { timeout: 20_000 })
          .then(() => true, () => false);
        const h1 = ((await page.locator('main h1').first().innerText().catch(() => '')) as string).trim();
        const state = await page.evaluate(() => ({
          boot: document.querySelectorAll('[data-boot]').length,
          shell: document.querySelectorAll('[data-boot-shell]').length,
          hash: location.hash,
          search: location.search,
          visible: !!document.querySelector('main') && getComputedStyle(document.querySelector('main')!).display !== 'none',
        }));
        const want = heading || (site === 'draft' ? 'Elena & Marco' : 'Nora & Sam');
        check(`${label} ${hash}: opens ${view}`, opened && h1 === want && state.visible, `${state.hash} h1 "${h1}"`);
        check(`${label} ${hash}: skeleton gone, no error`, state.boot === 0 && state.shell === 0 && errors.length === 0, errors.slice(0, 2).join(' | '));
        check(`${label} ${hash}: the address keeps k and the hash, drops ?view`, state.hash === (hash === '#edit/venue' ? '#edit/venue' : hash) && /^\?k=[^&]+$/.test(state.search), `${state.search.replace(/k=[^&]+/, 'k=…')}${state.hash}`);
        if (hash === '#edit/venue') {
          await page.waitForSelector('#section-venue-body', { timeout: 10_000 });
          await page.waitForTimeout(400);
          const top = await page.evaluate(() => document.getElementById('section-venue-body')?.getBoundingClientRect().top ?? -1);
          check(`${label} #edit/venue: scrolled to the venue part`, top >= 0 && top < 300, String(Math.round(top)));
        }
        await ctx.close();
      }
    }
    // a server-rendered editor page starts as when it opens in the browser: Day & place's "More options" (opens by itself
    // only while the time zone is still the sample, which needs this phone's zone) folded the same both ways
    for (const [url, label] of [
      [LIVE, 'live'],
      [DRAFT, 'never published'],
    ] as const) {
      const expanded: string[] = [];
      for (const how of ['deep link', 'in the panel']) {
        const ctx = await browser.newContext(PHONE);
        const page = await ctx.newPage();
        await page.goto(url(how === 'deep link' ? '#edit/day' : '#edit'), { waitUntil: 'load' });
        await page.waitForFunction(() => !document.querySelector('[data-boot-shell]'), null, { timeout: 20_000 });
        if (how === 'in the panel') await page.locator('[data-section-row="day"]').click();
        await page.waitForSelector('[data-disclosure="date-more"] button[aria-expanded]');
        await page.waitForTimeout(500);
        expanded.push(String(await page.getAttribute('[data-disclosure="date-more"] button[aria-expanded]', 'aria-expanded')));
        await ctx.close();
      }
      check(`${label} #edit/day: "More options" starts the same as when opened in the panel`, expanded[0] === expanded[1], expanded.join(' / '));
    }
    // a setup step on a never-published site still opens the wizard; on a live site it lands on Home
    for (const [url, want, label] of [
      [DRAFT('#setup/1'), 'setup', 'never published #setup/1'],
      [LIVE('#setup/1'), 'home', 'live #setup/1'],
    ] as const) {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'load' });
      const ok =
        want === 'setup'
          ? await page.waitForSelector('[data-setup="1"]', { timeout: 20_000 }).then(() => true, () => false)
          : await page.waitForFunction(() => location.hash === '#home' && document.querySelector('[data-panel-root]')?.getAttribute('data-view') === 'home', null, { timeout: 20_000 }).then(() => true, () => false);
      check(`${label}: opens ${want}`, ok);
      await ctx.close();
    }
  });

  // ------------------------------------------------------------------ 2. before hydration (every JS chunk blocked)
  await block('before hydration', async () => {
    type Case = { url: string; label: string; dismissed?: boolean; want: 'server' | 'skeleton' | 'default'; view?: string; boot?: string; tab?: string; heading?: string };
    const cases: Case[] = [
      // the script asks the server once more (?view=): the view itself comes server-rendered
      { url: DRAFT('#share'), label: 'never published #share', want: 'server', view: 'share', heading: 'Share' },
      { url: DRAFT('#edit/photos'), label: 'never published #edit/photos', want: 'server', view: 'edit/photos', heading: 'Photos' },
      { url: DRAFT('#guests/results'), label: 'never published #guests/results', want: 'server', view: 'results', heading: 'Guests' },
      { url: DRAFT('#home'), label: 'never published #home', want: 'server', view: 'home', heading: 'Elena & Marco' },
      { url: DRAFT(), label: 'never published, setup closed on this phone', dismissed: true, want: 'server', view: 'home', heading: 'Elena & Marco' },
      { url: LIVE('#edit/venue'), label: 'live #edit/venue', want: 'server', view: 'edit/day', heading: 'Day & place' },
      { url: LIVE('#share'), label: 'live #share', want: 'server', view: 'share', heading: 'Share' },
      // the server's own view: nothing to do
      { url: DRAFT(), label: 'never published, no address', want: 'default' },
      { url: DRAFT('#setup/2'), label: 'never published #setup/2', want: 'default' },
      { url: LIVE('#home'), label: 'live #home (the server renders Home)', want: 'default' },
      // `view` already asked (or ignored by the server): no second reload, the skeleton stays until hydration
      { url: DRAFT('#share').replace('#share', '&view=nothing#share'), label: 'never published #share, server ignored ?view', want: 'skeleton', boot: 'share', tab: 'share' },
      { url: LIVE('#edit/photos').replace('#edit', '&view=x#edit'), label: 'live #edit/photos, server ignored ?view', want: 'skeleton', boot: 'photos', tab: 'edit' },
    ];
    for (const c of cases) {
      const ctx = await browser.newContext(PHONE);
      if (c.dismissed) await ctx.addInitScript(() => localStorage.setItem('setup:elena-and-marco', JSON.stringify({ dismissed: true })));
      // no JS chunk ever arrives: what the HTML and its inline script paint (CSS still loads)
      await ctx.route(/\/_next\/static\/chunks\/.*\.js(\?|$)/, (r: any) => r.abort());
      const page = await ctx.newPage();
      const docs: string[] = [];
      page.on('framenavigated', (f: any) => f === page.mainFrame() && docs.push(f.url()));
      await page.goto(c.url, { waitUntil: 'load' });
      if (c.want === 'server') await page.waitForURL(/[?&]view=/, { timeout: 15_000 }).catch(() => undefined);
      await page.waitForLoadState('load');
      const s = await page.evaluate(() => {
        const root = document.querySelector('[data-panel-root]')!;
        const shown = [...document.querySelectorAll<HTMLElement>('[data-boot-view]')].filter((e) => e.getClientRects().length).map((e) => e.dataset.bootView);
        const tab = document.querySelector('[data-boot-nav][aria-current="page"]')?.getAttribute('data-boot-nav') ?? null;
        const others = [...root.children].filter((e) => !e.hasAttribute('data-boot-shell')).filter((e) => getComputedStyle(e).display !== 'none').length;
        const h1 = (document.querySelector('main h1') as HTMLElement | null)?.innerText.trim() ?? '';
        const setup = document.querySelector('[data-setup]') as HTMLElement | null;
        return { boot: root.getAttribute('data-boot'), view: root.getAttribute('data-view'), shown, tab, others, h1, setupVisible: !!setup && setup.getClientRects().length > 0, url: location.search + location.hash };
      });
      if (c.want === 'server') {
        check(
          `${c.label}: one more request (?view=), the server renders ${c.view} — before any JS`,
          docs.length === 2 && s.boot === null && s.view === c.view && s.h1 === c.heading && !s.setupVisible && /[?&]view=/.test(s.url),
          JSON.stringify({ ...s, docs: docs.length }),
        );
      } else if (c.want === 'skeleton') {
        check(`${c.label}: the ${c.boot} skeleton, no second reload`, docs.length === 1 && s.boot === c.boot && s.shown.length === 1 && s.shown[0] === c.boot && s.tab === c.tab && s.others === 0 && !s.setupVisible, JSON.stringify({ ...s, docs: docs.length }));
        if (c.boot === 'share') await page.screenshot({ path: path.join(ROOT, 'previews/g181/boot_share_390.png') });
      } else {
        check(`${c.label}: no skeleton, no reload (the server's view shows)`, docs.length === 1 && s.boot === null && s.shown.length === 0 && s.others > 0, JSON.stringify({ ...s, docs: docs.length }));
      }
      await ctx.close();
    }
  });

  // ------------------------------------------------------------------ 3. first load vs idle prefetch, instant switches
  await block('chunks', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const scripts: Array<{ url: string; at: number; body: string }> = [];
    const t0 = Date.now();
    page.on('response', async (r: any) => {
      if (!r.url().includes('/_next/static/chunks/') || !r.url().endsWith('.js')) return;
      const body = await r.text().catch(() => '');
      scripts.push({ url: r.url(), at: Date.now() - t0, body });
    });
    await page.goto(LIVE('#home'), { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-panel-root]')?.getAttribute('data-view') === 'home');
    const firstLoad = scripts.slice();
    const has = (list: typeof scripts, marker: string) => list.some((s) => s.body.includes(marker));
    for (const [view, marker] of Object.entries(MARKERS)) check(`live #home: the first load holds no ${view} code`, !has(firstLoad, marker));
    // the idle prefetch: every view's chunk arrives without a tap
    await page.waitForTimeout(6000);
    for (const [view, marker] of Object.entries(MARKERS)) check(`live #home: ${view} prefetched while idle`, has(scripts, marker));
    // switches show the view in the same frame (no loading frame)
    for (const [nav, view] of [
      ['share', 'share'],
      ['guests', 'guests'],
      ['edit', 'edit'],
    ] as const) {
      const loading = await page.evaluate(
        ([nav, view]: string[]) =>
          new Promise<boolean>((resolve) => {
            let seen = false;
            const mo = new MutationObserver(() => {
              if (document.querySelector('[data-view-loading]')) seen = true;
            });
            mo.observe(document.body, { subtree: true, childList: true });
            (document.querySelector(`[data-nav="${nav}"]`) as HTMLElement).click();
            const end = Date.now() + 3000;
            const tick = () => {
              if (document.querySelector('[data-panel-root]')?.getAttribute('data-view') === view || Date.now() > end) {
                mo.disconnect();
                resolve(seen || !!document.querySelector('[data-view-loading]'));
              } else requestAnimationFrame(tick);
            };
            tick();
          }),
        [nav, view],
      );
      const now = await page.evaluate(() => document.querySelector('[data-panel-root]')?.getAttribute('data-view'));
      check(`live: tap ${nav} → ${view} at once (no loading frame)`, now === view && !loading, `${now}${loading ? ', loading frame' : ''}`);
    }
    await page.locator('[data-section-row="story"]').click();
    await page.waitForSelector('[data-page="story"]', { timeout: 3000 });
    check('live: Edit → Our Story opens its page', (await page.locator('[data-view-loading]').count()) === 0);
    await ctx.close();
  });

  // a deep link fetches its view's chunk before hydration (from the module, not after it)
  await block('deep link chunk order', async () => {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const order: string[] = [];
    page.on('response', async (r: any) => {
      if (!r.url().includes('/_next/static/chunks/')) return;
      const body = await r.text().catch(() => '');
      if (body.includes(MARKERS.share)) order.push('share');
    });
    await page.goto(DRAFT('#share'), { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-panel-root]')?.getAttribute('data-view') === 'share', null, { timeout: 20_000 });
    check('never published #share: the Share chunk is fetched once', order.length === 1, order.join(','));
    await ctx.close();
  });
} finally {
  await browser.close();
  server.stop();
}
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
