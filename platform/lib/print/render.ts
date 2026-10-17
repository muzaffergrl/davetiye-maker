// G139: one HTML document -> PDF bytes in the shared headless Chromium (lib/print/browser.ts).
//
// The document is opened at a private address (PRINT_ORIGIN) and every request it makes is answered here, so nothing
// about the couple leaves the server and drafts print without a preview key:
//   /themes/<id>/…  the theme file from disk; when this function's bundle does not carry it (Vercel traces theme images
//                   into the asset route only, next.config.ts) it is fetched from the platform's public address;
//   /print/<id>/…   the printable invitation's parts (public/print, scripts/build-print-assets.ts) from disk, else from
//                   the public address (Vercel serves public/ from its CDN, not from the function);
//   /media/<id>/…   the site's own photos straight from the data adapter (only the site being printed);
//   other paths     fetched from the platform's public address (public/ files such as /static/map.css);
//   Google Fonts    loaded from Google (the designs' web fonts);
//   anything else   refused (no third-party requests, no scripts from elsewhere).

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Browser, Page } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { getDataAdapter } from '../data/index.ts';
import { serveThemeAsset } from '../site/static.ts';
import { withPrintBrowser } from './browser.ts';

type PdfOptions = NonNullable<Parameters<Page['pdf']>[0]>;

export const PRINT_ORIGIN = 'https://print.invalid';
const FONT_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

export interface PrintDocument {
  html: string;
  /** Path the document is opened at (relative links resolve against it). */
  path: string;
}

export interface PrintRun {
  /** The site whose /media/<siteId>/… files may be read. */
  siteId: string | null;
  /** Public origin of the platform (fallback for files this bundle does not carry). */
  publicOrigin: string;
  viewport: { width: number; height: number };
  /** Runs in the page after load, before the PDF (layout clean-up). */
  prepare?: (page: Page) => Promise<void>;
  /** PDF options, or a function of the prepared page (a page size measured from the layout). */
  pdf: PdfOptions | ((page: Page) => Promise<PdfOptions>);
  /**
   * Re-encode raster images before the browser sees them: Chromium stores every image losslessly in the PDF (a website
   * of photos and paper textures came to ~16 MB, over Vercel's 4.5 MB response limit) but passes JPEG data through.
   * Opaque images become JPEG, images with transparency stay PNG; both at most maxPx on the long side.
   */
  images?: { maxPx: number; jpegQuality: number };
  /**
   * Each document must print on ONE page (website pages): when the measured height was short (print layout differs a
   * little from screen) the PDF is made again with the height grown by 10 % (at most 4 tries).
   */
  singlePage?: boolean;
}

const RASTER = /^image\/(?:webp|png|jpeg|avif|gif)$/;

async function compact(res: Response, o: NonNullable<PrintRun['images']>): Promise<{ type: string; body: Buffer }> {
  const type = res.headers.get('content-type')?.split(';')[0] ?? 'application/octet-stream';
  const body = Buffer.from(await res.arrayBuffer());
  if (!RASTER.test(type)) return { type, body };
  try {
    const img = sharp(body, { animated: false }).rotate().resize({ width: o.maxPx, height: o.maxPx, fit: 'inside', withoutEnlargement: true });
    const { hasAlpha } = await sharp(body).metadata();
    return hasAlpha
      ? { type: 'image/png', body: await img.png({ compressionLevel: 9, palette: false }).toBuffer() }
      : { type: 'image/jpeg', body: await img.jpeg({ quality: o.jpegQuality, mozjpeg: true }).toBuffer() };
  } catch {
    return { type, body };
  }
}

async function localAsset(url: URL, siteId: string | null): Promise<Response | null> {
  const parts = url.pathname.split('/').filter(Boolean).map((p) => decodeURIComponent(p));
  if (parts[0] === 'themes' && parts.length >= 3) {
    const res = await serveThemeAsset(parts[1], parts.slice(2));
    return res.ok ? res : null;
  }
  if (parts[0] === 'print' && parts.length === 3 && parts.every((p) => /^[a-z0-9][a-z0-9_.-]*$/.test(p) && !p.includes('..')) && parts[2].endsWith('.webp')) {
    try {
      const bytes = await readFile(path.join(process.cwd(), 'public', ...parts));
      return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'image/webp' } });
    } catch {
      return null;
    }
  }
  if (parts[0] === 'media' && parts.length === 3 && siteId && parts[1] === siteId) {
    const adapter = getDataAdapter();
    const file = adapter.readPhoto ? await adapter.readPhoto(`${parts[1]}/${parts[2]}`) : null;
    return file ? new Response(new Uint8Array(file.bytes), { headers: { 'Content-Type': file.contentType } }) : null;
  }
  return null;
}

async function remoteAsset(url: URL, publicOrigin: string): Promise<Response | null> {
  if (url.pathname.startsWith('/media/') || url.pathname.startsWith('/api/')) return null;
  try {
    const res = await fetch(new URL(url.pathname + url.search, publicOrigin), { signal: AbortSignal.timeout(10_000) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/** Waits for web fonts and every image (lazy ones are made eager first). */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    for (const img of Array.from(document.images)) img.loading = 'eager';
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete ? null : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }),
      ),
    );
    await document.fonts.ready;
  });
}

/** Waits at most `ms` for a close (a page or context of a browser that died may never answer). Never throws. */
async function closeQuietly(close: () => Promise<unknown>, ms = 5_000): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([close().catch(() => undefined), new Promise<void>((r) => (timer = setTimeout(r, ms)))]);
  clearTimeout(timer);
}

/**
 * Renders each document to its own PDF (same options), in order. G150: when the shared browser turns out to be dead
 * (closed between serverless invocations) the whole render runs once more in a new browser (withPrintBrowser); each
 * try has its own context, closed with its pages whatever happens.
 */
export async function renderPdfs(docs: readonly PrintDocument[], run: PrintRun): Promise<Uint8Array[]> {
  return withPrintBrowser((browser) => renderIn(browser, docs, run));
}

async function renderIn(browser: Browser, docs: readonly PrintDocument[], run: PrintRun): Promise<Uint8Array[]> {
  const context = await browser.newContext({ viewport: run.viewport, deviceScaleFactor: 1, javaScriptEnabled: true });
  try {
    const out: Uint8Array[] = [];
    for (const doc of docs) {
      const page = await context.newPage();
      try {
        out.push(await renderPage(page, doc, run));
      } finally {
        await closeQuietly(() => page.close());
      }
    }
    return out;
  } finally {
    await closeQuietly(() => context.close());
  }
}

async function renderPage(page: Page, doc: PrintDocument, run: PrintRun): Promise<Uint8Array> {
  const docUrl = new URL(doc.path, PRINT_ORIGIN).href;
  await page.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.href === docUrl) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: doc.html });
    if (url.origin === PRINT_ORIGIN && req.method() === 'GET') {
      const res = (await localAsset(url, run.siteId)) ?? (await remoteAsset(url, run.publicOrigin));
      if (!res) return route.fulfill({ status: 404, body: '' });
      if (run.images) {
        const { type, body } = await compact(res, run.images);
        return route.fulfill({ status: 200, contentType: type, body });
      }
      return route.fulfill({
        status: 200,
        contentType: res.headers.get('content-type') ?? 'application/octet-stream',
        body: Buffer.from(await res.arrayBuffer()),
      });
    }
    if (url.protocol === 'https:' && FONT_HOSTS.has(url.hostname)) return route.continue();
    return route.abort();
  });
  await page.goto(docUrl, { waitUntil: 'load', timeout: 30_000 });
  await settle(page);
  if (run.prepare) await run.prepare(page);
  const options = typeof run.pdf === 'function' ? await run.pdf(page) : run.pdf;
  let pdf = new Uint8Array(await page.pdf({ printBackground: true, ...options }));
  for (let tries = 1; run.singlePage && tries < 4 && (await PDFDocument.load(pdf)).getPageCount() > 1; tries += 1) {
    const height = `${Math.ceil(parseFloat(String(options.height)) * (1 + 0.1 * tries))}px`;
    pdf = new Uint8Array(await page.pdf({ printBackground: true, ...options, height }));
  }
  return pdf;
}
