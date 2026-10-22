// G139: PDF downloads — request parsing, sheet geometry, the panel route (auth, limit) and the real PDFs from headless
// Chromium: page count and size (5×7 / A5, with and without bleed and crop marks; website pages A4 wide), the couple's texts in
// the PDF, the QR's link and (when poppler's pdftoppm is installed) the QR decoded from the rendered page with jsQR.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { POST as downloadRoute } from '../app/api/edit/[slug]/download/route.ts';
import { getClaimRateLimiter, setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { closePrintBrowser } from '../lib/print/browser.ts';
import { downloadFileName, parseDownload, PDF_LIMITS } from '../lib/print/api.ts';
import { invitationHtml, sheetGeometry } from '../lib/print/invitation.ts';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';
import { printLabel } from '../lib/print/labels.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { listThemes } from '../lib/theme/theme.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const PT = 72;
/** A Vercel function answers at most 4.5 MB. */
const VERCEL_MAX_RESPONSE = 4.5 * 1024 * 1024;

before(() => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('g139-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  setClaimRateLimiter(new MemoryRateLimiter());
});
after(async () => {
  setClaimRateLimiter(null);
  await closePrintBrowser();
});

let counter = 0;
async function newSite(theme: string) {
  const slug = `g139-site-${++counter}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme, content: demoContent() });
  await publishSite(getDataAdapter(), s.site.id);
  return { id: s.site.id, slug, editKey: s.editKey };
}

async function post(slug: string, body: unknown, key: string | null) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (key) headers.set('authorization', `Bearer ${key}`);
  return downloadRoute(new Request(`${BASE}/api/edit/${slug}/download`, { method: 'POST', headers, body: JSON.stringify(body) }), {
    params: Promise.resolve({ slug }),
  });
}

async function readPdf(bytes: Uint8Array) {
  const doc = await getDocument({ data: bytes.slice(), useSystemFonts: false, isEvalSupported: false }).promise;
  const pages: Array<{ w: number; h: number; text: string; links: string[] }> = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const [x0, y0, x1, y1] = p.view;
    const text = (await p.getTextContent()).items.map((it) => ('str' in it ? it.str : '')).join(' ');
    const links = (await p.getAnnotations()).map((a: { url?: string }) => a.url).filter((u): u is string => Boolean(u));
    pages.push({ w: x1 - x0, h: y1 - y0, text: text.replace(/\s+/g, ' '), links });
  }
  return pages;
}

/** Letter-spaced lines come out glyph by glyph: texts are compared without spaces and case. */
const has = (text: string, want: string) => text.replace(/\s+/g, '').toLowerCase().includes(want.replace(/\s+/g, '').toLowerCase());
const near = (actual: number, inches: number) => assert.ok(Math.abs(actual - inches * PT) <= 0.6, `${actual} pt ≠ ${inches} in`);

test('request parsing, file names and sheet geometry', () => {
  assert.deepEqual(parseDownload({ kind: 'site' }), { kind: 'site' });
  assert.deepEqual(parseDownload({ kind: 'invitation', size: 'a5', bleed: true, marks: true }), { kind: 'invitation', size: 'a5', bleed: true, marks: true, back: true });
  // marks only with bleed
  assert.equal((parseDownload({ kind: 'invitation', size: '5x7', marks: true }) as { marks: boolean }).marks, false);
  for (const bad of [null, {}, { kind: 'invitation', size: 'a4' }, { kind: 'zip' }]) assert.equal(parseDownload(bad), null);
  assert.equal(downloadFileName('ava-and-li', { kind: 'invitation', size: '5x7', bleed: true, marks: false, back: true }), 'ava-and-li-invitation-5x7-bleed.pdf');
  let g = sheetGeometry({ size: '5x7', bleed: true, marks: false });
  assert.deepEqual([g.pageW, g.pageH], [5.25, 7.25]);
  g = sheetGeometry({ size: 'a5', bleed: true, marks: false });
  assert.ok(Math.abs(g.pageW * 25.4 - 154) < 1e-9 && Math.abs(g.pageH * 25.4 - 216) < 1e-9);
  g = sheetGeometry({ size: '5x7', bleed: false, marks: true });
  assert.deepEqual([g.pageW, g.pageH, g.zone], [5, 7, 0]);
});

test('every platform design has a printable invitation whose parts are on disk', async () => {
  const designs = (await listThemes()).map((t) => t.id).filter((id) => id !== '_sample');
  // the design catalog: one numbered collection per design (collections/NN_Name); a new design needs a print layout
  // collections planned before their theme (fourth wave, docs/33: concept, GPT parts in, theme G440–G448 not built yet)
  // are listed here and leave the list as each theme lands; nothing else may lack a theme
  const PLANNED = ['41_Painted_Lily_Pond', '42_Espresso_Pastoral', '43_Chartreuse_Garden_Party',
    '44_Blue_Toile_Pavilion', '45_Suede_Ranch_Lace', '46_Bordeaux_Silk_Bow', '47_Monochrome_Darkroom',
    '48_Navy_Ivory_Crest'];
  const catalog = readdirSync(path.join(REPO_ROOT, 'collections')).filter((d) => /^\d{2}_/.test(d) && !PLANNED.includes(d));
  for (const d of PLANNED) assert.ok(existsSync(path.join(REPO_ROOT, 'collections', d)), `planned collection ${d} is on disk (else drop it from the list)`);
  assert.equal(designs.length, catalog.length, `themes ${designs.length} ≠ collections ${catalog.length}`);
  assert.deepEqual(Object.keys(PRINT_LAYOUTS).sort(), [...designs].sort());
  for (const id of designs) {
    const layout = PRINT_LAYOUTS[id];
    assert.ok(layout, `${id}: no print layout`);
    assert.ok(catalog.includes(layout.collection), `${id}: collection ${layout.collection}`);
    for (const name of Object.keys(layout.sources)) {
      assert.ok(readFileSync(path.join(PLATFORM_ROOT, 'public', 'print', id, `${name}.webp`)).length > 1000, `${id}/print/${name}.webp`);
    }
    // the couple's texts go into the HTML escaped
    const html = invitationHtml(id, { ...demoContent(), venue: { name: 'Hall <A&B>' } }, `${BASE}/x`, { size: '5x7', bleed: false, marks: false, back: true });
    assert.ok(html.includes('Hall &lt;A&amp;B&gt;') && !html.includes('<A&B>'));
  }
});

test('the route: edit key required, request checked, daily limit per site', async () => {
  const k = await newSite('olive-ivory');
  assert.equal((await post(k.slug, { kind: 'site' }, null)).status, 401);
  assert.equal((await post(k.slug, { kind: 'site' }, 'wrong-key')).status, 401);
  const bad = await post(k.slug, { kind: 'invitation', size: 'a3' }, k.editKey);
  assert.equal(bad.status, 400);
  const limiter = getClaimRateLimiter();
  for (let i = 0; i < PDF_LIMITS.perSitePerDay.limit; i++) await limiter.hit(`pdf:site:${k.id}`, PDF_LIMITS.perSitePerDay);
  const limited = await post(k.slug, { kind: 'site' }, k.editKey);
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).message, printLabel('limit_reached', { count: PDF_LIMITS.perSitePerDay.limit }));
});

test('printable invitation 5×7 with bleed: 5.25 × 7.25 in, front + back, texts, QR to the website', async () => {
  const k = await newSite('blush-garden-rose');
  const res = await post(k.slug, { kind: 'invitation', size: '5x7', bleed: true }, k.editKey);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.match(res.headers.get('content-disposition') ?? '', /-invitation-5x7-bleed\.pdf"$/);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.ok(bytes.length < VERCEL_MAX_RESPONSE, `${bytes.length} bytes`);
  const pages = await readPdf(bytes);
  assert.equal(pages.length, 2);
  for (const p of pages) {
    near(p.w, 5.25);
    near(p.h, 7.25);
  }
  const c = demoContent();
  for (const want of [c.partners[0].display_name, c.partners[1].display_name, c.venue.name!, 'Kindly reply by']) {
    assert.ok(has(pages[0].text, want), `front misses "${want}": ${pages[0].text}`);
  }
  const siteUrl = `${BASE}/${k.slug}`;
  assert.ok(has(pages[1].text, printLabel('details_title')) && has(pages[1].text, siteUrl.replace('https://', '')), pages[1].text);
  assert.deepEqual(pages[1].links, [siteUrl]);
  // the printed QR itself, read back from the rendered page
  if (spawnSync('pdftoppm', ['-v']).error) {
    console.log('# pdftoppm not installed: QR raster check skipped (link annotation checked)');
    return;
  }
  const dir = mkdtempSync(path.join(os.tmpdir(), 'g139-qr-'));
  writeFileSync(path.join(dir, 'inv.pdf'), bytes);
  spawnSync('pdftoppm', ['-f', '2', '-l', '2', '-r', '200', '-png', path.join(dir, 'inv.pdf'), path.join(dir, 'back')]);
  const png = path.join(dir, (await import('node:fs')).readdirSync(dir).find((f) => f.startsWith('back'))!);
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const qr = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  assert.equal(qr?.data, siteUrl);
});

test('printable invitation sizes: A5 + 3 mm bleed, crop marks outside it, trim size without bleed', async () => {
  const k = await newSite('olive-ivory');
  const a5 = await readPdf(new Uint8Array(await (await post(k.slug, { kind: 'invitation', size: 'a5', bleed: true, back: false }, k.editKey)).arrayBuffer()));
  assert.equal(a5.length, 1);
  near(a5[0].w, 154 / 25.4);
  near(a5[0].h, 216 / 25.4);
  const marks = await readPdf(new Uint8Array(await (await post(k.slug, { kind: 'invitation', size: '5x7', bleed: true, marks: true }, k.editKey)).arrayBuffer()));
  near(marks[0].w, 6);
  near(marks[0].h, 8);
  const plain = await readPdf(new Uint8Array(await (await post(k.slug, { kind: 'invitation', size: '5x7', back: false }, k.editKey)).arrayBuffer()));
  near(plain[0].w, 5);
  near(plain[0].h, 7);
  // without a back side the front carries the website address
  assert.ok(has(plain[0].text, `${BASE.replace('https://', '')}/${k.slug}`));
});

test('website PDF: a page per website page (A4 wide, at least A4 tall), the couple’s texts, the QR page last', async () => {
  const k = await newSite('olive-ivory');
  const res = await post(k.slug, { kind: 'site' }, k.editKey);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-disposition') ?? '', /-website\.pdf"$/);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.ok(bytes.length < VERCEL_MAX_RESPONSE, `${bytes.length} bytes`);
  const pages = await readPdf(bytes);
  assert.equal(pages.length, 4, 'home, story, details, rsvp'); // 03 demo content: every page on
  for (const p of pages) {
    near(p.w, 794 / 96);
    assert.ok(p.h >= (1123 / 96) * PT - 0.6, `${p.h} pt`);
  }
  const all = pages.map((p) => p.text).join(' ');
  const c = demoContent();
  for (const want of [c.partners[0].display_name, c.venue.name!, printLabel('website_title')]) assert.ok(has(all, want), `misses "${want}"`);
  assert.ok(pages.at(-1)!.links.includes(`${BASE}/${k.slug}`));
});
