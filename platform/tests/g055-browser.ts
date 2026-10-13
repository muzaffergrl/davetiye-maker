// G055 browser checks on a production build (`next start`), real theme blush-garden-rose. Not part of `npm test`:
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g055-browser.ts
//
// 1. Share image + tab icon: og:image is an absolute URL of the running server; the JPEG (1200 x 630) and the icon load.
// 2. Buyer photos through the panel API (the five fictional PAKET 2 sample photos of design 03): the page carries
//    srcset; at 390 x 844, DPR 3 the browser loads the 640/1280 px variants; first view of index and home is measured
//    (transferred bytes, like theme-check) next to the same photos stored as one file each (before G055) and placeholders.
// 3. Details card with 3, 7, 10 and 10 long schedule rows at 360/390/430/768/1280: every text line sits on plain card
//    paper (pixel test: the card is captured with the text hidden; no line box may cover painted decor), the card does not
//    run into the block below, no horizontal scroll.
// 4. Panel: counters on names (40) and venue name (80), "Add an event" gone at 10 events.
// Playwright from NODE_PATH and /opt/pw-browsers (never `playwright install`). Data in a temp folder. Screenshots +
// checks.json -> $G055_SHOTS_DIR (default: a new temporary folder, printed at the end). Exit code 1 on a failed check.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContentRecord } from '../lib/content/types.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
/** $PORT, else a free port (other test servers may be running on this machine). */
async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address() as net.AddressInfo;
      srv.close(() => resolve(port));
    });
  });
}
const PORT = Number(process.env.PORT) || (await freePort());
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G055_SHOTS_DIR || mkdtempSync(path.join(os.tmpdir(), 'g055-shots-'));
const THEME = 'blush-garden-rose';
const PHOTOS = path.join(REPO, 'collections/03_Blush_Garden_Rose/assets/gpt/photos'); // fictional GPT sample photos
const require = createRequire(import.meta.url);
const sharp: any = require('sharp');

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

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const info: Record<string, unknown> = {};
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g055-browser-data-'));
mkdirSync(OUT, { recursive: true });
const adapter = new LocalAdapter(dataDir);
const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;

// ------------------------------------------------------------------------------------------------- sites

const LABELS = ['Ceremony', 'Cocktail hour', 'Reception', 'Dinner', 'First dance', 'Toasts', 'Cake cutting', 'Dancing', 'Last dance', 'Farewell send-off'];
const PLACES = ['The Rose Garden', 'The Terrace', 'The Orangery', null, 'The Ballroom', null, 'The Ballroom', null, null, 'Front lawn'];
function schedule(n: number, long: boolean): ContentRecord['schedule'] {
  return Array.from({ length: n }, (_, i) => ({
    time: `${String(14 + Math.floor(i * 0.9)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
    label: long ? 'Champagne toast and speeches' : LABELS[i],
    location: long ? 'The Glasshouse Pavilion by the old lake' : PLACES[i],
  }));
}
async function site(slug: string, edit: (c: ContentRecord) => void = () => undefined, publish = true) {
  const c = structuredClone(demo);
  edit(c);
  const s = await createSiteWithKeys(adapter, { slug, theme: THEME, content: c });
  if (publish) await publishSite(adapter, s.site.id);
  return s;
}

const SCHEDULES: Array<[string, number, boolean]> = [
  ['rows-3', 3, false],
  ['rows-7', 7, false],
  ['rows-10', 10, false],
  ['rows-10-long', 10, true],
];
for (const [slug, n, long] of SCHEDULES) {
  await site(slug, (c) => {
    c.schedule = schedule(n, long);
    c.ceremony_time = c.schedule[0].time;
  });
}
await site('no-photos');
const photoSite = await site('with-photos', () => undefined, false); // photos go through the panel API below
const oldSite = await site('one-file-photos', () => undefined, false);
const phoneSite = await site('phone-photos', () => undefined, false); // the same photos at phone resolution (below)
const phoneOldSite = await site('phone-one-file', () => undefined, false);
const panelSite = await site('panel-limits', (c) => {
  c.schedule = schedule(10, false);
  c.ceremony_time = c.schedule[0].time;
}, false);

// ------------------------------------------------------------------------------------------------- server

const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', NEXT_TELEMETRY_DISABLED: '1', PLATFORM_PUBLIC_URL: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));
setTimeout(() => {
  console.error('g055-browser: still running after 8 minutes, stopped');
  server.kill('SIGTERM');
  process.exit(1);
}, 480_000).unref();

let serverExited = false;
server.on('exit', () => (serverExited = true));
/** Waits until OUR server answers with a site of this run (a server of another run on the same port would 404). */
async function waitForServer(url: string, ms = 30_000) {
  const end = Date.now() + ms;
  while (Date.now() < end && !serverExited) {
    try {
      if ((await fetch(url)).status === 200) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`server did not start at ${url}${serverExited ? ' (it exited: port in use?)' : ''}`);
}

const kb = (b: number) => Math.round(b / 1024);

async function main() {
  await waitForServer(`${BASE}/no-photos`);

  // ----------------------------------------------------------------------------------------------- 1. share tags
  {
    const html = await (await fetch(`${BASE}/no-photos`)).text();
    const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
    const icon = /<link rel="icon" type="image\/png" href="([^"]+)"/.exec(html)?.[1];
    check('share: og:image is an absolute URL of this server', og === `${BASE}/themes/${THEME}/img/og-1200x630.jpg`, String(og));
    check('share: og:image width/height + twitter:card', /og:image:width" content="1200"/.test(html) && /og:image:height" content="630"/.test(html) && /twitter:card" content="summary_large_image"/.test(html));
    const img = og ? await fetch(og) : null;
    const meta = img && img.ok ? await sharp(Buffer.from(await img.arrayBuffer())).metadata() : null;
    check('share: the image loads (200, JPEG 1200 x 630)', meta?.format === 'jpeg' && meta.width === 1200 && meta.height === 630, `${img?.status} ${img?.headers.get('content-type')}`);
    const ic = icon ? await fetch(`${BASE}${icon}`) : null;
    check('share: the tab icon loads (200, PNG)', ic?.status === 200 && ic.headers.get('content-type') === 'image/png', String(icon));
    for (const p of ['home', 'details', 'rsvp']) {
      const h = await (await fetch(`${BASE}/no-photos/${p}`)).text();
      check(`share: /${p} has the same tags`, h.includes(`content="${BASE}/themes/${THEME}/img/og-1200x630.jpg"`) && h.includes(`href="/themes/${THEME}/img/favicon.png"`));
    }
  }

  // ----------------------------------------------------------------------------------------------- 2. photos
  const slots: Record<string, string> = { hero_portrait: 'media.hero_portrait', story_1: 'media.memory_photos.0', story_2: 'media.memory_photos.1', story_3: 'media.memory_photos.2', venue: 'media.venue_image' };
  // media.hero_portrait / media.memory_photos.<n> / media.venue_image: the parents exist in the demo record.
  const setPath = (obj: any, p: string, v: string) => {
    const keys = p.split('.');
    const parent = keys.slice(0, -1).reduce((o, k) => o[k], obj);
    parent[keys[keys.length - 1]] = v;
  };
  /**
   * Uploads each photo through the panel API to `g055` (the buyer's path: re-encoded + variants) and stores the same
   * re-encoded photo as one file on `old` (how uploads were stored before G055: no width in the name, no srcset).
   */
  const uploadSet = async (g055: typeof photoSite, old: typeof photoSite, slug: string, files: Record<string, Buffer>, label: string) => {
    const content = structuredClone(demo) as any;
    const oldContent = structuredClone(demo) as any;
    const uploaded: Record<string, unknown> = {};
    for (const [slot, source] of Object.entries(slots)) {
      const res = await fetch(`${BASE}/api/edit/${slug}/photo?slot=${slot}`, { method: 'POST', headers: { authorization: `Bearer ${g055.editKey}`, 'content-type': 'image/jpeg' }, body: new Uint8Array(files[slot]) });
      const data = (await res.json()) as any;
      check(`photos (${label}): ${slot} uploaded through the panel API`, res.status === 200 && /-\d+w\.jpg$/.test(data.url), `${res.status} ${data.width}x${data.height} ${kb(data.size)} KB, variants ${data.variants?.map((v: any) => `${v.width} (${kb(v.size)} KB)`).join(', ')}`);
      uploaded[slot] = { width: data.width, height: data.height, kb: kb(data.size), variants: data.variants?.map((v: any) => ({ width: v.width, kb: kb(v.size) })) };
      setPath(content, source, data.url);
      const main = await fetch(`${BASE}${data.url}?preview=${g055.previewKey}`);
      const saved = await adapter.savePhoto(old.site.id, { bytes: new Uint8Array(await main.arrayBuffer()) });
      setPath(oldContent, source, saved.url);
    }
    for (const [s, c] of [[g055, content], [old, oldContent]] as const) {
      await adapter.updateContent(s.site.id, c);
      await publishSite(adapter, s.site.id);
    }
    return uploaded;
  };
  const sample: Record<string, Buffer> = Object.fromEntries(Object.keys(slots).map((k) => [k, readFileSync(path.join(PHOTOS, `${k}.jpg`))]));
  // The PAKET 2 samples are 1024 x 1536 px. A phone photo is ~3000 x 4000 px (the panel's browser crop sends at most
  // 2000 px, the server keeps at most 2400 px): the same samples scaled 3x stand in for that size. An enlarged photo has
  // less fine detail than a real one, so its JPEGs are smaller than a real phone photo's would be.
  const phone: Record<string, Buffer> = {};
  for (const [k, b] of Object.entries(sample)) {
    const m = await sharp(b).metadata();
    phone[k] = await sharp(b).resize(m.width * 3, m.height * 3, { kernel: 'lanczos3' }).jpeg({ quality: 90 }).toBuffer();
  }
  info.photos = {
    sample_1024px: await uploadSet(photoSite, oldSite, 'with-photos', sample, 'samples'),
    phone_size_3x: await uploadSet(phoneSite, phoneOldSite, 'phone-photos', phone, 'phone size'),
  };

  const browser = await chromium.launch();
  try {
    const firstView = async (slug: string, page: 'index' | 'home') => {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      const p = await ctx.newPage();
      let bytes = 0;
      const media: Array<[string, number]> = [];
      p.on('requestfinished', async (rq: any) => {
        try {
          const s = await rq.sizes();
          bytes += s.responseBodySize + s.responseHeadersSize;
          if (rq.url().includes('/media/')) media.push([rq.url().replace(BASE, ''), s.responseBodySize]);
        } catch {
          /* ignore */
        }
      });
      await p.goto(`${BASE}/${slug}${page === 'index' ? '' : '/home'}`, { waitUntil: 'load' });
      await p.waitForTimeout(1200);
      const imgs: Array<{ src: string | null; current: string; loaded: boolean; w: number; srcset: string | null }> = await p.evaluate(() =>
        [...document.querySelectorAll('img[data-photo-state="user"]')].map((i) => {
          const img = i as HTMLImageElement;
          return { src: img.getAttribute('src'), current: img.currentSrc.replace(location.origin, ''), loaded: img.complete && img.naturalWidth > 0, w: Math.round(img.getBoundingClientRect().width), srcset: img.getAttribute('srcset') };
        }),
      );
      await ctx.close();
      return { kb: kb(bytes), media: media.map(([u, b]) => [u.replace(/^.*\//, ''), kb(b)]), imgs };
    };
    const measures: Record<string, unknown> = {};
    for (const page of ['index', 'home'] as const) {
      const none = await firstView('no-photos', page);
      for (const [label, g055, old] of [['samples', 'with-photos', 'one-file-photos'], ['phone size', 'phone-photos', 'phone-one-file']] as const) {
        const now = await firstView(g055, page);
        const before = await firstView(old, page);
        measures[`${page} (${label})`] = { photos_g055_kb: now.kb, photos_one_file_kb: before.kb, placeholders_kb: none.kb, photo_files_g055: now.media, photo_files_one_file: before.media, imgs: now.imgs };
        const eager = now.imgs.filter((i) => i.loaded);
        check(`photos (${page}, ${label}, 390x844 DPR 3): user photos carry srcset`, now.imgs.length > 0 && now.imgs.every((i) => i.srcset && i.srcset.includes('-640w.jpg 640w')), now.imgs.map((i) => i.srcset?.replace(/\/media\/[^/]+\/[0-9a-f]{32}/g, '…')).join(' | '));
        check(
          `photos (${page}, ${label}): the browser loads a variant, not the full photo`,
          eager.length > 0 && eager.every((i) => /-(640|1280)w\.jpg$/.test(i.current.split('?')[0])),
          eager.map((i) => `${i.w}px -> ${i.current.replace(/^.*\/[0-9a-f]{32}/, '')}`).join(', '),
        );
        check(`photos (${page}, ${label}): first view with photos ${now.kb} KB (one file each, before G055: ${before.kb} KB; placeholders: ${none.kb} KB) <= 1536 KB`, now.kb <= 1536 && now.kb <= before.kb);
      }
    }
    info.first_view_dpr3 = measures;

    // --------------------------------------------------------------------------------------------- 3. details card
    const zoneCss = '.site-nav { display: none !important; }';
    const cards: Record<string, unknown> = {};
    info.details_cards = cards;
    for (const width of [360, 390, 430, 768, 1280]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      for (const [slug] of SCHEDULES) {
        const p = await ctx.newPage();
        await p.goto(`${BASE}/${slug}/details`, { waitUntil: 'load' });
        await p.addStyleTag({ content: zoneCss });
        await p.waitForTimeout(400);
        const geo = await p.evaluate(() => {
          const card = document.querySelector('.info')!;
          const cb = card.getBoundingClientRect();
          const lines: Array<{ t: string; x: number; y: number; w: number; h: number }> = [];
          const walker = document.createTreeWalker(card.querySelector('.info-text')!, NodeFilter.SHOW_TEXT);
          let n: Node | null;
          while ((n = walker.nextNode())) {
            if (!n.textContent!.trim()) continue;
            const rg = document.createRange();
            rg.selectNodeContents(n);
            for (const lb of rg.getClientRects()) {
              if (lb.width < 1) continue;
              const pad = lb.height * 0.18; // the glyphs' ink, not the line's leading (theme-check uses the same pad)
              lines.push({ t: n.textContent!.trim().slice(0, 24), x: lb.left - cb.left + 1, y: lb.top - cb.top + pad, w: lb.width - 2, h: lb.height - 2 * pad });
            }
          }
          const cal = document.querySelector('.cal')?.getBoundingClientRect();
          return {
            x: cb.left + scrollX, y: cb.top + scrollY, w: cb.width, h: cb.height,
            natural: (cb.width * 1411) / 912, lines,
            rows: document.querySelectorAll('.sched-row').length,
            calGap: cal ? cal.top - cb.bottom : null,
            hscroll: document.documentElement.scrollWidth - innerWidth,
          };
        });
        await p.addStyleTag({ content: '.info-text { visibility: hidden !important; }' });
        const png = await p.screenshot({ fullPage: true, clip: { x: geo.x, y: geo.y, width: geo.w, height: geo.h } });
        const { data, info: im } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        const px = (x: number, y: number) => {
          const i = (Math.round(y) * im.width + Math.round(x)) * 3;
          return [data[i], data[i + 1], data[i + 2]];
        };
        const ref: number[][] = [];
        for (let yy = 0; yy < 20; yy++) for (let xx = 0; xx < 40; xx++) ref.push(px(geo.w * 0.5 - 20 + xx, geo.h * 0.5 - 10 + yy));
        const paper = [0, 1, 2].map((c) => ref.map((q) => q[c]).sort((a, b) => a - b)[ref.length >> 1]);
        const over: string[] = [];
        for (const l of geo.lines) {
          let total = 0;
          let off = 0;
          for (let y = Math.max(0, l.y); y < Math.min(im.height - 1, l.y + l.h); y++) {
            for (let x = Math.max(0, l.x); x < Math.min(im.width - 1, l.x + l.w); x++) {
              const q = px(x, y);
              total++;
              if (Math.hypot(q[0] - paper[0], q[1] - paper[1], q[2] - paper[2]) > 45) off++;
            }
          }
          // Outside the card counts as decor too (the box runs past the captured card).
          if (l.y + l.h > im.height || l.x + l.w > im.width) off = total || 1;
          if (!total || off / total > 0.005) over.push(`"${l.t}" y${Math.round(l.y)} ${total ? ((100 * off) / total).toFixed(1) : 100}%`);
        }
        const name = `details card ${slug} @${width}`;
        check(
          `${name}: ${geo.rows} rows, ${geo.lines.length} text lines on plain paper (card ${Math.round(geo.h)} px, image ${Math.round(geo.natural)} px)`,
          !over.length && geo.rows === SCHEDULES.find((s) => s[0] === slug)![1],
          over.slice(0, 4).join(' | '),
        );
        check(`${name}: card ends before the calendar block, no horizontal scroll`, geo.calGap !== null && geo.calGap >= 0 && geo.hscroll <= 0, `gap ${geo.calGap?.toFixed(1)} px, scroll ${geo.hscroll}`);
        cards[`${slug}@${width}`] = { card_px: Math.round(geo.h), image_px: Math.round(geo.natural), lines: geo.lines.length };
        if (width === 390 || (width === 1280 && slug === 'rows-10')) {
          await p.addStyleTag({ content: '.info-text { visibility: visible !important; }' });
          await p.screenshot({ path: path.join(OUT, `details_card_${slug}_${width}.png`), fullPage: true, clip: { x: Math.max(0, geo.x - 12), y: geo.y - 12, width: Math.min(width - Math.max(0, geo.x - 12), geo.w + 24), height: geo.h + 24 } });
        }
        await p.close();
      }
      await ctx.close();
    }

    // --------------------------------------------------------------------------------------------- 4. panel limits
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const p = await ctx.newPage();
      await p.goto(`${BASE}/edit/panel-limits?k=${panelSite.editKey}`, { waitUntil: 'networkidle' });
      const open = async (id: string) => {
        const b = p.locator(`#section-${id}`);
        if ((await b.getAttribute('aria-expanded')) !== 'true') await b.click();
        await b.scrollIntoViewIfNeeded();
      };
      await open('couple');
      const first = p.locator('#f-partners-0-display_name');
      check('panel: first name limited to 40 with a counter', (await first.getAttribute('maxlength')) === '40' && (await p.locator('#section-couple-body').innerText()).includes(`${demo.partners[0].display_name.length}/40`));
      check('panel: full name 40, names line 85', (await p.getAttribute('#f-partners-0-full_name', 'maxlength')) === '40' && (await p.getAttribute('#f-name_display', 'maxlength')) === '85');
      await open('venue');
      check('panel: venue name limited to 80', (await p.getAttribute('#f-venue-name', 'maxlength')) === '80');
      await open('schedule');
      const body = await p.locator('#section-schedule-body').innerText();
      check('panel: 10 events -> no "Add an event", a note instead', (await p.getByRole('button', { name: 'Add an event' }).count()) === 0 && body.includes('10 of 10 events') && body.includes('Up to 10 events'), body.slice(-160).replace(/\s+/g, ' '));
      await p.locator('[data-schedule-full]').scrollIntoViewIfNeeded();
      await p.screenshot({ path: path.join(OUT, 'panel_schedule_10_390.png') });
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

let failed = false;
try {
  await main();
} catch (e) {
  failed = true;
  console.error(e);
  console.error(serverLog.slice(-2000));
} finally {
  server.kill('SIGTERM');
}
const bad = checks.filter((c) => !c.ok);
writeFileSync(path.join(OUT, 'checks.json'), `${JSON.stringify({ run: new Date().toISOString().slice(0, 10), passed: checks.length - bad.length, failed: bad.length, checks, info }, null, 2)}\n`);
console.log(`\n${checks.length - bad.length}/${checks.length} checks passed; ${OUT}/checks.json (+ screenshots)`);
rmSync(dataDir, { recursive: true, force: true });
process.exit(failed || bad.length ? 1 : 0);
