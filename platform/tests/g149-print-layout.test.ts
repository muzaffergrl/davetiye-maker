// G149: the printable invitation never sets text on the art. For every design, both sizes, both sides, with long content
// (long names, venue, place, host line, schedule, dress code):
//   1. the free text area of the layout (box + bands, lib/print/layouts.ts) is clear of decoration on the rendered art
//      (paper only: no flower, frame, seal or sprig inside it; flecks of the paper itself are ignored; on 5×7 for every
//      design, on A5 for the composed sheets 21–22 — A5 shows the same card parts scaled);
//   2. after fitText every line of text (and the QR) lies inside that free area and the safe area (0.2 in from the
//      trim), nothing overflows the box and no one-line item is cut.
// One shared headless Chromium (lib/print/browser.ts); fonts from Google Fonts when reachable (fallback fonts otherwise:
// the checks hold for any font, fitText measures what is rendered).
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Page } from 'playwright-core';
import { closePrintBrowser, printBrowser } from '../lib/print/browser.ts';
import { fitText, INVITATION_SIZES, invitationHtml, sheetGeometry, type InvitationSize } from '../lib/print/invitation.ts';
import { PRINT_LAYOUTS, type Band } from '../lib/print/layouts.ts';
import { settle } from '../lib/print/render.ts';
import { demoContent, PLATFORM_ROOT } from './helpers.ts';

const PX = 96;
const SAFE = 0.2 * PX;
const ORIGIN = 'https://print.invalid';

function longContent() {
  const c = demoContent() as any;
  return {
    ...c,
    partners: [
      { ...c.partners[0], display_name: 'Maximiliana-Josephine' },
      { ...c.partners[1], display_name: 'Bartholomew-Alexander' },
    ],
    name_display: 'Maximiliana-Josephine & Bartholomew-Alexander',
    host_line: 'Together with their families, the Montgomery-Fairweather and Alcántara-Villanueva families',
    date: '2027-09-29',
    ceremony_time: '16:30',
    venue: { ...c.venue, name: 'The Grand Orangery Ballroom at Château de Montmorency-Laval and Gardens', city: 'Saint-Rémy-de-Provence', region: "Provence-Alpes-Côte d'Azur" },
    schedule: [
      { label: 'Welcome drinks in the Orangery courtyard', time: '15:45', location: 'The Orangery courtyard, east wing' },
      { label: 'The ceremony under the old cedar', time: '16:30', location: 'The Cedar Lawn by the lake' },
      { label: 'Champagne reception and canapés', time: '17:30', location: 'The Rose Terrace' },
      { label: 'Dinner, speeches and dancing', time: '19:00', location: 'The Grand Ballroom' },
      { label: 'Late-night fireworks over the water', time: '23:30', location: 'The lakeside pier' },
      { label: 'Farewell brunch', time: '11:00', location: 'The Garden Pavilion' },
    ],
    dress_code: 'Black tie optional: long gowns and dark suits, with a touch of autumn colour',
    rsvp: { ...c.rsvp, deadline: '2027-08-25' },
    optional_blocks: { ...c.optional_blocks, dress_code: true },
  };
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface SideGeometry {
  side: 'front' | 'back';
  card: Rect;
  box: Rect;
  overflow: boolean;
  cut: string[];
  lines: Array<Rect & { text: string }>;
}

let page: Page;
before(async () => {
  const browser = await printBrowser();
  const context = await browser.newContext({ viewport: { width: 700, height: 900 }, deviceScaleFactor: 1 });
  page = await context.newPage();
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === ORIGIN && url.pathname.endsWith('/invitation.html')) {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    }
    const local = url.origin === ORIGIN && /^\/print\/[a-z0-9-]+\/[a-z_]+\.webp$/.test(url.pathname);
    const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    if (!local && !font) return route.abort();
    if (!cache.has(url.href)) {
      if (local) {
        const body = await readFile(path.join(PLATFORM_ROOT, 'public', url.pathname)).catch(() => null);
        cache.set(url.href, body && { status: 200, headers: { 'content-type': 'image/webp' }, body });
      } else {
        const res = await route.fetch().catch(() => null);
        cache.set(url.href, res && { status: res.status(), headers: res.headers(), body: await res.body() });
      }
    }
    const hit = cache.get(url.href);
    return hit ? route.fulfill(hit) : route.fulfill({ status: 404, body: '' });
  });
});
after(async () => {
  await closePrintBrowser();
});

/** Routed pages have no HTTP cache: font files and part images are kept here across designs and sizes. */
const cache = new Map<string, { status: number; headers: Record<string, string>; body: Buffer } | null>();
let html = '';

/** The whole document (front above back) with the text layer hidden. */
async function artShot(): Promise<{ png: Buffer; info: { width: number; height: number } }> {
  await page.addStyleTag({ content: '.text { visibility: hidden !important }' });
  const png = await page.screenshot({ fullPage: true });
  return { png, info: await sharp(png).metadata().then((m) => ({ width: m.width!, height: m.height! })) };
}

async function open(id: string, size: InvitationSize): Promise<SideGeometry[]> {
  html = invitationHtml(id, longContent(), 'https://wedding.example/avery-and-jordan', { size, bleed: false, marks: false, back: true });
  const g = sheetGeometry({ size, bleed: false, marks: false });
  await page.setViewportSize({ width: Math.ceil(g.pageW * PX), height: Math.ceil(g.pageH * PX) });
  await page.goto(`${ORIGIN}/print/${id}/invitation.html`, { waitUntil: 'load' });
  await settle(page);
  await fitText(page);
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('.sheet')).map((sheet) => {
      const s = sheet.getBoundingClientRect();
      const rel = (r: DOMRect) => ({ x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height });
      const box = sheet.querySelector<HTMLElement>('.text')!;
      const inner = box.firstElementChild as HTMLElement;
      const lines: Array<{ x: number; y: number; w: number; h: number; text: string }> = [];
      const walk = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (!n.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of Array.from(range.getClientRects())) lines.push({ ...rel(r), text: n.textContent.trim().slice(0, 40) });
      }
      const qr = sheet.querySelector('.qr');
      if (qr) lines.push({ ...rel(qr.getBoundingClientRect()), text: 'QR code' });
      const items = Array.from(inner.querySelectorAll<HTMLElement>(':scope > *, .names > *, .schedule > *'));
      return {
        side: sheet.classList.contains('front') ? ('front' as const) : ('back' as const),
        card: rel(box.parentElement!.getBoundingClientRect()),
        box: rel(box.getBoundingClientRect()),
        overflow: inner.offsetHeight > box.clientHeight + 1,
        cut: items.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent!.trim().slice(0, 40)),
        lines,
      };
    }),
  );
}

/** Horizontal limits of the free area at a stretch of the card (px): the box, narrowed by every band it touches. */
function freeSpan(geo: SideGeometry, bands: readonly Band[], top: number, bottom: number): [number, number] {
  const axis = geo.box.x + geo.box.w / 2;
  let half = geo.box.w / 2;
  for (const [bt, bb, bw] of bands) {
    const y0 = geo.card.y + (bt / 100) * geo.card.h;
    const y1 = geo.card.y + (bb / 100) * geo.card.h;
    if (y0 < bottom && y1 > top) half = Math.min(half, ((bw / 100) * geo.card.w) / 2);
  }
  return [axis - half, axis + half];
}

/** Median colour of pixels (histogram per channel: a card holds ~10⁵ of them). */
function medianColour(data: Buffer, offsets: Iterable<number>): [number, number, number] {
  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  let n = 0;
  for (const o of offsets) {
    hist[0][data[o]] += 1;
    hist[1][data[o + 1]] += 1;
    hist[2][data[o + 2]] += 1;
    n += 1;
  }
  return hist.map((h) => {
    let acc = 0;
    for (let v = 0; v < 256; v++) if ((acc += h[v]) > n / 2) return v;
    return 255;
  }) as [number, number, number];
}

/**
 * Decoration inside the free area of one side, on the art without text (`png`: screenshot of the card): pixels far from
 * the paper colour, in blobs bigger than a fleck of the paper itself. Returns the blobs found (empty = clear).
 */
async function decorationIn(png: Buffer, geo: SideGeometry, bands: readonly Band[], photo: boolean): Promise<string[]> {
  const { data, info } = await sharp(png).removeAlpha().blur(1).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const sx = W / geo.card.w;
  const sy = H / geo.card.h;
  // the free area in screenshot pixels: per row, [left, right) or null
  const span: Array<[number, number] | null> = [];
  for (let y = 0; y < H; y++) {
    const top = geo.card.y + y / sy;
    if (top < geo.box.y || top + 1 / sy > geo.box.y + geo.box.h) {
      span.push(null);
      continue;
    }
    const [l, r] = freeSpan(geo, bands, top, top + 1 / sy);
    span.push([Math.max(0, Math.ceil((l - geo.card.x) * sx)), Math.min(W, Math.floor((r - geo.card.x) * sx))]);
  }
  function* offsets(rows: number[]) {
    for (const y of rows) for (let x = span[y]![0]; x < span[y]![1]; x++) yield (y * W + x) * 3;
  }
  const rows = span.flatMap((s, y) => (s && s[1] > s[0] ? [y] : []));
  const paper = medianColour(data, offsets(rows));
  // text on a photograph (sky): the reference is each row's own colour, decoration = what stands out of its row
  const limit = photo ? 60 : 38;
  const deco = new Uint8Array(W * H);
  for (const y of rows) {
    const ref = photo ? medianColour(data, offsets([y])) : paper;
    for (let x = span[y]![0]; x < span[y]![1]; x++) {
      const o = (y * W + x) * 3;
      if (Math.hypot(data[o] - ref[0], data[o + 1] - ref[1], data[o + 2] - ref[2]) > limit) deco[y * W + x] = 1;
    }
  }
  // blobs (4-connected); one smaller than ~40 px of a 400 px wide card is the paper's own fleck or fibre
  const fleck = Math.max(12, Math.round(40 * (W / 400) ** 2));
  const blobs: string[] = [];
  const stack: number[] = [];
  for (let i = 0; i < deco.length; i++) {
    if (deco[i] !== 1) continue;
    let size = 0;
    let minY = H;
    let minX = W;
    let maxX = 0;
    deco[i] = 2;
    stack.push(i);
    while (stack.length) {
      const j = stack.pop()!;
      size += 1;
      const x = j % W;
      const y = (j / W) | 0;
      minY = Math.min(minY, y);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      for (const k of [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, j - W, j + W]) {
        if (k >= 0 && k < deco.length && deco[k] === 1) {
          deco[k] = 2;
          stack.push(k);
        }
      }
    }
    if (size >= fleck) {
      blobs.push(`${size} px from ${((minY / H) * 100).toFixed(1)} % of the card height, ${((minX / W) * 100).toFixed(0)}–${((maxX / W) * 100).toFixed(0)} % of its width`);
    }
  }
  return blobs;
}

const ids = Object.keys(PRINT_LAYOUTS);

for (const size of INVITATION_SIZES) {
  test(`printable invitation ${size}: text only on the free area of the art, inside the safe area, nothing cut (${ids.length} designs, long content)`, async () => {
    const g = sheetGeometry({ size, bleed: false, marks: false });
    const problems: string[] = [];
    for (const id of ids) {
      const layout = PRINT_LAYOUTS[id];
      const sides = await open(id, size);
      assert.equal(sides.length, 2, id);
      // the art without text, both sides in one screenshot (A5 = the same card parts scaled: only composed sheets differ)
      const art = size === '5x7' || layout.composed ? await artShot() : null;
      for (const geo of sides) {
        const where = `${id} ${size} ${geo.side}`;
        const bands = layout.bands?.[geo.side] ?? [];
        for (const [bt, bb, bw] of bands) {
          if (!(bt >= 0 && bt < bb && bb <= 100 && bw > 0 && bw <= 100)) problems.push(`${where}: band ${[bt, bb, bw]}`);
        }
        if (geo.overflow) problems.push(`${where}: text taller than its box`);
        for (const c of geo.cut) problems.push(`${where}: cut "${c}"`);
        for (const line of geo.lines) {
          const [l, r] = freeSpan(geo, bands, line.y, line.y + line.h);
          const out = line.y < geo.box.y - 1 || line.y + line.h > geo.box.y + geo.box.h + 1 || line.x < l - 1 || line.x + line.w > r + 1;
          if (out) problems.push(`${where}: "${line.text}" leaves the free area`);
          const unsafe =
            line.x < g.trimX * PX + SAFE || line.y < g.trimY * PX + SAFE || line.x + line.w > (g.trimX + g.trimW) * PX - SAFE || line.y + line.h > (g.trimY + g.trimH) * PX - SAFE;
          if (unsafe) problems.push(`${where}: "${line.text}" outside the safe area`);
        }
        if (art) {
          const top = Math.floor((geo.side === 'front' ? 0 : 1) * g.pageH * PX + geo.card.y);
          const left = Math.floor(geo.card.x);
          const width = Math.min(Math.floor(geo.card.w), art.info.width - left);
          const height = Math.min(Math.floor(geo.card.h), art.info.height - top);
          const png = await sharp(art.png).extract({ left, top, width, height }).png().toBuffer();
          const blobs = await decorationIn(png, geo, bands, geo.side === 'front' && Boolean(layout.frontShadow));
          for (const b of blobs) problems.push(`${where}: decoration in the free text area (${b})`);
        }
      }
    }
    assert.deepEqual(problems, []);
  });
}
