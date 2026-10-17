// G139: "Download website as PDF" — every page of the couple's website, in its design, as one A4 PDF.
//
// Each page (home, story, details, rsvp — whichever the content switches on) is rendered by the theme engine exactly
// as for guests, then printed without its scripts: the themes are built to show everything without JavaScript
// (<html class="no-js">, docs/11 §3), so there is no envelope, no reveal animation and no music. A print style sheet
// hides what only works on screen (reply form, buttons, countdown, fixed bars). The last page ends with the website's
// link and a real QR code of it (lib/qr.ts). The page PDFs are joined with pdf-lib.
//
// One website page = one PDF page, A4 wide and as long as the page (at least A4). Tried first: A4 sheets with
// "break-inside: avoid" — every theme page ends with a footer / "next page" link that spilled onto a nearly empty sheet
// (olive-ivory 9 sheets, art deco 12 with 4 almost blank) and cards were cut at sheet edges. A long page keeps the
// design exactly as guests scroll it, with no break inside it.

import { PDFDocument } from 'pdf-lib';
import type { Page } from 'playwright-core';
import { renderTemplate } from '../theme/engine.ts';
import { readThemePage, SUB_PAGES, type LoadedTheme, type PageName } from '../theme/theme.ts';
import { qrSvg } from '../qr.ts';
import { dedupeImages, jpegImages } from './compact.ts';
import { printLabel } from './labels.ts';
import { printLocale } from './lang.ts';
import { renderPdfs, type PrintDocument } from './render.ts';

/** A4 at 96 px per inch: the theme lays out at this width (nothing is scaled); the page is at least this tall. */
export const SITE_PDF_VIEWPORT = { width: 794, height: 1123 } as const;

const PRINT_CSS = `
@page { margin: 0 }
html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact }
*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important;
  filter: none !important; backdrop-filter: none !important; mix-blend-mode: normal !important }
form, button, iframe, audio, video, dialog, .nojs-only, [data-skip], [data-enter], .replay, .countdown, [data-countdown],
a[href*="replay=1"], a[href$="/event.ics"], a[href^="https://calendar.google.com"] { display: none !important }
[data-g139-qr] { text-align: center; padding: 56px 24px 72px; color: inherit; font-family: inherit }
[data-g139-qr] h2 { margin: 0 0 20px }
[data-g139-qr] .g139-qr { display: inline-block; width: 168px; height: 168px; padding: 10px; background: #fff; border-radius: 6px }
[data-g139-qr] .g139-qr svg { display: block; width: 100%; height: 100% }
[data-g139-qr] p { margin: 14px 0 0; font-size: 18px; line-height: 1.5 }
[data-g139-qr] a { color: inherit; text-decoration: none }
`;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** The closing block of the last page: title, QR of the site link (itself a link) and the address. */
export function qrBlock(siteUrl: string, dict?: Readonly<Record<string, string>> | null): string {
  const label = siteUrl.replace(/^https?:\/\//, '');
  return (
    `<section data-g139-qr><h2>${escapeHtml(printLabel('website_title', {}, dict))}</h2>` +
    `<a class="g139-qr" href="${escapeHtml(siteUrl)}">${qrSvg(siteUrl, { pixels: 168, border: 2 })}</a>` +
    `<p>${escapeHtml(printLabel('scan_to_visit', {}, dict))}</p><p><a href="${escapeHtml(siteUrl)}">${escapeHtml(label)}</a></p></section>`
  );
}

/** Theme page HTML -> print HTML: scripts out, print CSS in, optional closing block before </body>. */
export function toPrintHtml(html: string, tail = ''): string {
  let out = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<link\b[^>]*rel="?(?:preload|modulepreload|speculationrules)"?[^>]*>/gi, '');
  out = out.replace(/<\/head>/i, `<style data-g139-print>${PRINT_CSS}</style></head>`);
  return tail ? out.replace(/<\/body>/i, `${tail}</body>`) : out + tail;
}

/**
 * Layout clean-up in the page (themes differ, so it goes by computed style): fixed bars are hidden, sticky elements stay
 * in place; a box left with only a short label once its form / calendar buttons are hidden ("Your reply", "Add to your
 * calendar") is hidden too. Screen-tall heights (100vh heroes, min-height: 100svh) are frozen at the A4 viewport's
 * pixels: in print, vh is the page height, and a page as tall as its content would grow without end.
 */
async function tidy(page: Page): Promise<void> {
  await page.evaluate(() => {
    const hide = (el: HTMLElement) => el.style.setProperty('display', 'none', 'important');
    const vh = window.innerHeight;
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('html, body, body *'))) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') hide(el);
      else if (cs.position === 'sticky') el.style.setProperty('position', 'static', 'important');
      const minH = parseFloat(cs.minHeight);
      if (minH > 0) el.style.setProperty('min-height', `${minH}px`, 'important');
      if (Math.abs(el.getBoundingClientRect().height - vh) <= 2 || parseFloat(cs.maxHeight) === vh) {
        el.style.setProperty('height', `${el.getBoundingClientRect().height}px`, 'important');
      }
    }
    const gone = document.querySelectorAll<HTMLElement>('form, a[href*="replay=1"], a[href$="/event.ics"], a[href^="https://calendar.google.com"]');
    for (const el of Array.from(gone)) {
      let box = el.parentElement;
      for (let up = 0; box && up < 4 && box !== document.body && box.tagName !== 'MAIN'; up += 1, box = box.parentElement) {
        // the reply form's card may carry a decor image: only its text decides
        if ((el.tagName !== 'FORM' && box.querySelector('img')) || box.innerText.trim().length >= 40) break;
        hide(box);
      }
    }
  });
}

/** The PDF page of one website page: A4 wide, as tall as its layout (whole CSS pixels; at least A4). */
async function pageSize(page: Page) {
  await page.emulateMedia({ media: 'print' });
  const height = await page.evaluate(() => Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)));
  return { width: `${SITE_PDF_VIEWPORT.width}px`, height: `${Math.max(height, SITE_PDF_VIEWPORT.height) + 1}px` };
}

export interface SitePdfInput {
  theme: LoadedTheme;
  content: unknown;
  slug: string;
  siteId: string | null;
  variant?: string | null;
  /** The website's public link (QR + last page). */
  siteUrl: string;
  publicOrigin: string;
  now?: Date;
}

/** The print HTML of every page the content shows, in site order (home, story, details, rsvp). */
export async function sitePrintDocuments(input: SitePdfInput): Promise<PrintDocument[]> {
  const docs: PrintDocument[] = [];
  // G144: the website's main language (its fixed texts from the site dictionary)
  const { lang, dict } = printLocale(input.content);
  for (const page of SUB_PAGES as readonly PageName[]) {
    const template = await readThemePage(input.theme, page);
    if (template === null) continue;
    const { html, disabled } = renderTemplate({
      html: template,
      content: input.content,
      theme: input.theme.manifest,
      page,
      slug: input.slug,
      variant: input.variant,
      origin: input.publicOrigin,
      share: input.theme.share,
      now: input.now ?? new Date(),
      lang,
      dict: dict ?? undefined,
    });
    if (disabled) continue;
    docs.push({ html, path: `/${input.slug}/${page}` });
  }
  if (!docs.length) throw new Error('site has no page to print');
  return docs.map((d, i) => ({ path: d.path, html: toPrintHtml(d.html, i === docs.length - 1 ? qrBlock(input.siteUrl, dict) : '') }));
}

/** The whole website as one PDF (a page per website page). */
export async function sitePdf(input: SitePdfInput): Promise<Uint8Array> {
  const docs = await sitePrintDocuments(input);
  const parts = await renderPdfs(docs, {
    siteId: input.siteId,
    publicOrigin: input.publicOrigin,
    viewport: SITE_PDF_VIEWPORT,
    prepare: tidy,
    pdf: pageSize,
    // 2× the 794 px page width; photos and textures as JPEG (Vercel answers at most 4.5 MB)
    images: { maxPx: 1600, jpegQuality: 78 },
    singlePage: true,
  });
  const merged = await PDFDocument.create();
  merged.setTitle(`${input.slug} — ${printLabel('website_title', {}, printLocale(input.content).dict)}`);
  merged.setCreator('Wedding website platform');
  for (const bytes of parts) {
    const src = await PDFDocument.load(bytes);
    for (const p of await merged.copyPages(src, src.getPageIndices())) merged.addPage(p);
  }
  dedupeImages(merged);
  await jpegImages(merged, 80);
  return merged.save({ useObjectStreams: true });
}
