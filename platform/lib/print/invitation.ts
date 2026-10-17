// G139: "Download printable invitation" — a classic flat invitation in the couple's design, as a print file.
//
// Sizes (K45 §5): 5 × 7 in and A5. Options: bleed (1/8 in for 5×7, 3 mm for A5: the paper texture runs past the trim
// so a print shop can cut without white edges), crop marks (outside the bleed, on a larger sheet), and a back side
// (schedule, dress code, reply date, QR of the website). Page 1 = front, page 2 = back.
//
// Look: the design's own GPT parts (lib/print/layouts.ts): the invitation_card part on the design's paper, the
// couple's text set in the design's web fonts and colours on the part's free area. Text that would not fit is made
// smaller in the page itself (fitText), never cut.

import type { Page } from 'playwright-core';
import { qrSvg } from '../qr.ts';
import { printLabel } from './labels.ts';
import { printLocale } from './lang.ts';
import { dateIn, dateLongIn, timeIn } from '../i18n/format.ts';
import { printLayout, type Box, type PrintLayout } from './layouts.ts';
import { PDFDocument } from 'pdf-lib';
import { jpegImages } from './compact.ts';
import { renderPdfs } from './render.ts';

export type InvitationSize = '5x7' | 'a5';
export const INVITATION_SIZES = ['5x7', 'a5'] as const satisfies readonly InvitationSize[];

const MM = 1 / 25.4;
/** Trim size and bleed in inches. */
export const SIZE_SPECS: Record<InvitationSize, { w: number; h: number; bleed: number }> = {
  '5x7': { w: 5, h: 7, bleed: 0.125 },
  a5: { w: 148 * MM, h: 210 * MM, bleed: 3 * MM },
};
/** Space around the bleed for crop marks (in), mark length, and the gap between the bleed edge and a mark. */
const MARK_ZONE = 0.375;
const MARK_GAP = 1 / 16;
/** The card part keeps at least this much paper around it inside the trim (in). */
const CARD_MARGIN = 0.2;

export interface InvitationOptions {
  size: InvitationSize;
  bleed: boolean;
  /** Crop marks (only with bleed). */
  marks: boolean;
  back: boolean;
}

/** Sheet geometry in inches: page size, where the trim box starts, trim size and bleed. */
export function sheetGeometry(o: Pick<InvitationOptions, 'size' | 'bleed' | 'marks'>) {
  const spec = SIZE_SPECS[o.size];
  const bleed = o.bleed ? spec.bleed : 0;
  const zone = o.bleed && o.marks ? MARK_ZONE : 0;
  const offset = zone + bleed;
  return { pageW: spec.w + 2 * offset, pageH: spec.h + 2 * offset, trimX: offset, trimY: offset, trimW: spec.w, trimH: spec.h, bleed, zone };
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** The couple's texts for the card (English labels from lib/print/labels.ts, dates in the content's locale). */
export function invitationText(content: unknown, siteUrl: string) {
  const c = (content ?? {}) as Record<string, any>;
  const locale = str(c.locale) || 'en-US';
  // G144: the website's main language (labels, dates, times)
  const { lang, dict } = printLocale(content);
  const partners = Array.isArray(c.partners) ? c.partners : [];
  const a = str(partners[0]?.display_name);
  const b = str(partners[1]?.display_name);
  const time = timeIn(c.ceremony_time, lang, locale);
  const deadline = dateIn(c.rsvp?.deadline, lang, locale);
  const schedule = (Array.isArray(c.schedule) ? c.schedule : [])
    .map((s: any) => ({ label: str(s?.label), time: timeIn(s?.time, lang, locale) ?? '', location: str(s?.location) }))
    .filter((s: { label: string }) => s.label);
  return {
    host: str(c.host_line),
    names: a && b ? ([a, b] as const) : null,
    nameDisplay: str(c.name_display),
    invite: printLabel(c.event_type && c.event_type !== 'wedding' ? 'invite_other' : 'invite_wedding', {}, dict),
    date: dateLongIn(c.date, lang, locale) ?? '',
    time: time ? printLabel('at_time', { time }, dict) : '',
    venue: str(c.venue?.name),
    place: [c.venue?.city, c.venue?.region].map(str).filter(Boolean).join(', '),
    replyBy: deadline ? printLabel('reply_by', { date: deadline }, dict) : '',
    schedule: schedule as Array<{ label: string; time: string; location: string }>,
    dressCode: c.optional_blocks?.dress_code !== false ? str(c.dress_code) : '',
    lang,
    dict,
    siteUrl,
    siteLabel: siteUrl.replace(/^https?:\/\//, ''),
  };
}

type Text = ReturnType<typeof invitationText>;

const boxStyle = (b: Box) => `top:${b[0]}%;right:${b[1]}%;bottom:${b[2]}%;left:${b[3]}%`;

function frontText(t: Text, l: PrintLayout, withUrl: boolean): string {
  const names = t.names
    ? `<h1 class="names"><span data-fit>${esc(t.names[0])}</span><span class="amp">&amp;</span><span data-fit>${esc(t.names[1])}</span></h1>`
    : `<h1 class="names"><span data-fit>${esc(t.nameDisplay)}</span></h1>`;
  return [
    t.host ? `<p class="host">${esc(t.host)}</p>` : '',
    names,
    `<p class="invite">${esc(t.invite)}</p>`,
    t.date ? `<p class="date" data-fit>${esc(t.date)}</p>` : '',
    t.time ? `<p class="time">${esc(t.time)}</p>` : '',
    t.venue ? `<p class="venue">${esc(t.venue)}</p>` : '',
    t.place ? `<p class="place">${esc(t.place)}</p>` : '',
    t.replyBy ? `<p class="reply">${esc(t.replyBy)}</p>` : '',
    withUrl ? `<p class="url" data-fit>${esc(t.siteLabel)}</p>` : '',
  ].join('');
  void l;
}

function backText(t: Text): string {
  const rows = t.schedule
    .map((s) => `<li><span class="s-time">${esc(s.time)}</span><span class="s-label">${esc(s.label)}</span>${s.location ? `<span class="s-loc">${esc(s.location)}</span>` : ''}</li>`)
    .join('');
  return [
    `<h2 class="b-title">${esc(printLabel('details_title', {}, t.dict))}</h2>`,
    t.date ? `<p class="date" data-fit>${esc(t.date)}</p>` : '',
    t.venue ? `<p class="venue">${esc(t.venue)}</p>` : '',
    t.place ? `<p class="place">${esc(t.place)}</p>` : '',
    rows ? `<ul class="schedule">${rows}</ul>` : '',
    t.dressCode ? `<p class="dress"><span class="host">${esc(printLabel('dress_code', {}, t.dict))}</span><br>${esc(t.dressCode)}</p>` : '',
    `<a class="qr" href="${esc(t.siteUrl)}">${qrSvg(t.siteUrl, { border: 2, pixels: 200 })}</a>`,
    `<p class="scan">${esc(printLabel('scan_to_visit', {}, t.dict))}</p>`,
    `<p class="url" data-fit>${esc(t.siteLabel)}</p>`,
    t.replyBy ? `<p class="reply">${esc(t.replyBy)}</p>` : '',
  ].join('');
}

function cropMarks(g: ReturnType<typeof sheetGeometry>): string {
  if (!g.zone) return '';
  const { pageW, pageH, trimX, trimY, trimW, trimH, bleed } = g;
  const lines: string[] = [];
  const outer = trimX - bleed - MARK_GAP; // marks end here (they never enter the bleed)
  for (const x of [trimX, trimX + trimW]) {
    lines.push(`M${x} 0V${outer}`, `M${x} ${pageH}V${pageH - outer}`);
  }
  for (const y of [trimY, trimY + trimH]) {
    lines.push(`M0 ${y}H${outer}`, `M${pageW} ${y}H${pageW - outer}`);
  }
  // 0.25 pt registration-black hairlines
  return `<svg class="marks" viewBox="0 0 ${pageW} ${pageH}" preserveAspectRatio="none"><path d="${lines.join('')}" stroke="#000" stroke-width="${0.25 / 72}" fill="none"/></svg>`;
}

function cardRect(g: ReturnType<typeof sheetGeometry>) {
  const maxW = g.trimW - 2 * CARD_MARGIN;
  const maxH = g.trimH - 2 * CARD_MARGIN;
  const ratio = 2 / 3; // the GPT card parts are 1024 × 1536
  const h = Math.min(maxH, maxW / ratio);
  const w = h * ratio;
  return { x: g.trimX + (g.trimW - w) / 2, y: g.trimY + (g.trimH - h) / 2, w, h };
}

function sheetCss(l: PrintLayout, g: ReturnType<typeof sheetGeometry>, cardW: number): string {
  const caps = l.caps ?? l.serif;
  const paper = l.paper.mode === 'tile' ? `url(paper.webp) repeat 0 0 / ${l.paper.tile ?? 2.5}in` : 'url(paper.webp) center / cover no-repeat';
  return `
@page { size: ${g.pageW}in ${g.pageH}in; margin: 0 }
* { box-sizing: border-box; margin: 0; padding: 0 }
html, body { width: ${g.pageW}in; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.sheet { position: relative; width: ${g.pageW}in; height: ${g.pageH}in; overflow: hidden; break-after: page }
.sheet:last-child { break-after: auto }
.paper { position: absolute; left: ${g.zone}in; top: ${g.zone}in; right: ${g.zone}in; bottom: ${g.zone}in; background: ${paper} }
.card { position: absolute; font-size: calc(${cardW}in / 100); color: ${l.ink}; text-align: center }
.card > img.part { position: absolute; inset: 0; width: 100%; height: 100% }
.text { position: absolute; display: flex; flex-direction: column; justify-content: center }
.inner { display: flex; flex-direction: column; align-items: center; gap: 1.1em; width: 100% }
.inner > * { max-width: 100% }
.back .inner { gap: .9em; font-size: .86em }
[data-fit] { white-space: nowrap; display: block }
.host, .date, .b-title, .s-time { font-family: ${caps}; text-transform: uppercase; letter-spacing: .16em; color: ${l.accent} }
.host { font-size: 2.5em; line-height: 1.5 }
.names { font-family: ${l.script}; font-weight: 400; font-size: ${l.namesInCaps ? '7.4em' : '11.5em'}; line-height: 1.02; color: ${l.ink};${l.namesInCaps ? ' text-transform: uppercase; letter-spacing: .06em;' : ''} display: flex; flex-direction: column; align-items: center; width: 100% }
.names span { max-width: 100% }
.names .amp { font-size: .42em; line-height: 1.2; font-family: ${l.serif}; font-style: italic; color: ${l.accent} }
.invite { font-family: ${l.serif}; font-style: italic; font-size: 3.6em; line-height: 1.35 }
.date { font-size: 2.9em; line-height: 1.4; color: ${l.ink} }
.time, .place { font-family: ${l.serif}; font-size: 3.3em; line-height: 1.35 }
.venue { font-family: ${l.serif}; font-size: 3.9em; line-height: 1.3; font-weight: 500 }
.reply, .scan { font-family: ${l.serif}; font-style: italic; font-size: 3em; line-height: 1.4; color: ${l.accent} }
.url { font-family: ${l.serif}; font-size: 2.6em; letter-spacing: .04em }
.b-title { font-size: 3.6em; letter-spacing: .22em }
.schedule { list-style: none; display: flex; flex-direction: column; gap: .6em; width: 100% }
.schedule li { display: flex; flex-direction: column; font-family: ${l.serif}; font-size: 3.1em; line-height: 1.3 }
.schedule .s-time { font-size: .78em }
.schedule .s-loc { font-style: italic; font-size: .85em }
.dress { font-family: ${l.serif}; font-size: 3.2em; line-height: 1.4 }
.dress .host { font-size: .75em }
.qr { display: block; width: 26em; height: 26em; padding: 1.2em; background: #fff; border-radius: .8em; flex: none }
.qr svg { display: block; width: 100%; height: 100% }
.branch { position: absolute; width: 62%; pointer-events: none }
.branch.tl { top: -2%; left: -6% }
.branch.br { bottom: -2%; right: -6%; transform: rotate(180deg) }
.seal { position: absolute; left: 50%; width: 17%; transform: translateX(-50%) }
.marks { position: absolute; inset: 0; width: 100%; height: 100% }
`;
}

/** The print HTML of the invitation (front, optional back). Asset URLs are relative to /print/<id>/ (public/print). */
export function invitationHtml(themeId: string, content: unknown, siteUrl: string, o: InvitationOptions): string {
  const l = printLayout(themeId);
  if (!l) throw new Error(`no print layout for theme ${themeId}`);
  const g = sheetGeometry({ size: o.size, bleed: o.bleed, marks: o.marks && o.bleed });
  const t = invitationText(content, siteUrl);
  const composed = Boolean(l.composed);
  // a composed sheet (21) uses the whole trim as its card
  const rect = composed ? { x: g.trimX, y: g.trimY, w: g.trimW, h: g.trimH } : cardRect(g);
  const pos = `left:${rect.x}in;top:${rect.y}in;width:${rect.w}in;height:${rect.h}in`;
  const side = (which: 'front' | 'back') => {
    const inner =
      which === 'front'
        ? composed
          ? `<img class="branch tl" src="branch.webp" alt=""><img class="branch br" src="branch.webp" alt=""><img class="seal" style="bottom:4%" src="seal.webp" alt="">`
          : `<img class="part" src="card.webp" alt="">`
        : composed
          ? `<img class="seal" style="top:4%" src="seal.webp" alt="">`
          : `<img class="part" src="back.webp" alt="">`;
    const text = which === 'front' ? frontText(t, l, !o.back) : backText(t);
    return (
      `<section class="sheet ${which}"><div class="paper"></div><div class="card" style="${pos}">${inner}` +
      `<div class="text" style="${boxStyle(which === 'front' ? l.front : l.back)}"><div class="inner">${text}</div></div></div>${cropMarks(g)}</section>`
    );
  };
  return (
    `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8"><title>${esc(t.nameDisplay || 'Invitation')}</title>` +
    `<link rel="stylesheet" href="${esc(l.fonts)}"><style>${sheetCss(l, g, rect.w)}</style></head>` +
    `<body>${side('front')}${o.back ? side('back') : ''}</body></html>`
  );
}

/** Makes every text block fit its box: the whole block shrinks until its height fits, then each one-line item to its width. */
export async function fitText(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const box of Array.from(document.querySelectorAll<HTMLElement>('.text'))) {
      const inner = box.firstElementChild as HTMLElement;
      const base = parseFloat(getComputedStyle(box).fontSize);
      for (let s = 1; s > 0.45 && inner.offsetHeight > box.clientHeight + 1; s -= 0.03) box.style.fontSize = `${base * s}px`;
      for (const el of Array.from(box.querySelectorAll<HTMLElement>('[data-fit]'))) {
        const avail = box.clientWidth;
        for (let f = parseFloat(getComputedStyle(el).fontSize); f > 4 && el.scrollWidth > avail + 0.5; f *= 0.96) el.style.fontSize = `${f}px`;
      }
    }
  });
}

export interface InvitationInput extends InvitationOptions {
  themeId: string;
  content: unknown;
  siteUrl: string;
  publicOrigin: string;
}

/** The invitation PDF: one page (front) or two (front, back), page size = trim (+ bleed) (+ crop-mark zone). */
export async function invitationPdf(input: InvitationInput): Promise<Uint8Array> {
  const html = invitationHtml(input.themeId, input.content, input.siteUrl, input);
  const g = sheetGeometry({ size: input.size, bleed: input.bleed, marks: input.marks && input.bleed });
  const [pdf] = await renderPdfs([{ html, path: `/print/${input.themeId}/invitation.html` }], {
    siteId: null,
    publicOrigin: input.publicOrigin,
    viewport: { width: Math.ceil(g.pageW * 96), height: Math.ceil(g.pageH * 96) },
    prepare: fitText,
    pdf: { preferCSSPageSize: true, width: `${g.pageW}in`, height: `${g.pageH}in` },
  });
  // the paper and card parts as high-quality JPEG (transparency stays lossless): a print file under 4.5 MB
  const doc = await PDFDocument.load(pdf);
  await jpegImages(doc, 92);
  return doc.save({ useObjectStreams: true });
}
