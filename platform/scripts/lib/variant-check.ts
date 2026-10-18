// G153: browser check of a design's color palettes (theme.json "variants") — used by scripts/theme-check.cjs and
// scripts/variant-check.cjs. For the original and every palette (live and coming), each page of the theme's demo
// (/start/demo/<theme>[/<page>]?variant=<id>) at 390 × 844 with reduced motion (every scene shown at once):
//   - html[data-variant] is the palette, variants.css and every image load (no failed request, no 404 in the variant folder);
//   - text contrast on the REAL painted ground (docs/11 §10): the texts' boxes are measured on a full-page screenshot taken
//     with every text made transparent, so the paint under the letters is what the theme draws (papers, cards, gradients,
//     decor). Body text ≥ 4.5:1, large text (≥ 24 px, or ≥ 18.66 px bold) and script ≥ 3:1, measured against the 20th
//     percentile of the ground (most of the ground under the text must reach it; a text-shadow halo that reaches it on
//     its own also passes). A palette's failure that the original has as well (same text, ratio not lower by more than
//     0.25) is a warning ("as in the original"), every other failure is an error;
//   texts that are not painted (under the closed envelope, clipped: the screenshots with and without text agree in their
//   box) and fixed / sticky layers (the nav, the music button: a full-page screenshot moves them) are not measured, and
//   are hidden for the measurement so that the texts they would cover in the full-page screenshot are measured on their
//   real ground (G180);
//   - a screenshot per palette and page: <out>/variants/<palette>_<page>_390.png (review material).

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { ThemeVariant } from '../../lib/theme/variants.ts';

export type Rgb = readonly [number, number, number];

/** WCAG 2 relative luminance of an sRGB colour (0–255 channels). */
export function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio of two colours (1–21). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The minimum ratio for a text: 3 for large text and script lettering, else 4.5 (docs/11 §10). */
export function requiredRatio(t: { size: number; weight: number; script: boolean }): number {
  return t.script || t.size >= 24 || (t.size >= 18.66 && t.weight >= 700) ? 3 : 4.5;
}

/** Text colour (possibly translucent) over a ground colour. */
export function blend(text: readonly number[], ground: Rgb): Rgb {
  const a = text.length > 3 ? text[3] : 1;
  return [0, 1, 2].map((i) => Math.round(text[i] * a + ground[i] * (1 - a))) as unknown as Rgb;
}

/**
 * The ratio a text reaches on its ground: the 20th percentile of the ratios against every ground pixel (`pixels` =
 * RGB triplets), so 80 % of the ground under the letters reaches it.
 */
export function groundRatio(text: readonly number[], pixels: ArrayLike<number>, step = 3): number {
  const ratios: number[] = [];
  for (let i = 0; i + 2 < pixels.length; i += step) {
    const ground: Rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    ratios.push(contrastRatio(blend(text, ground), ground));
  }
  if (!ratios.length) return 21;
  ratios.sort((a, b) => a - b);
  return ratios[Math.floor(ratios.length * 0.2)];
}

export interface TextSample {
  key: string;
  text: string;
  box: { x: number; y: number; w: number; h: number };
  color: number[];
  size: number;
  weight: number;
  script: boolean;
  /** The colour of a text-shadow halo, when the text has one. */
  halo: number[] | null;
}

export interface VariantCheckOptions {
  browser: any;
  base: string;
  themeId: string;
  variants: readonly ThemeVariant[];
  pages: readonly string[];
  out: string;
  err: (m: string) => void;
  warn: (m: string) => void;
  ok: (m: string) => void;
}

interface PageResult {
  ratios: Map<string, { ratio: number; need: number; text: string }>;
}

const SCRIPT_FONT = /great vibes|pinyon|parisienne|allura|alex brush|tangerine|script|calligraph|snell|chancery|italianno|sacramento|cursive/i;

async function measurePage(
  ctx: any,
  url: string,
  shot: string,
): Promise<{ samples: TextSample[]; ratios: Map<string, { ratio: number; need: number; text: string }>; failed: string[]; variantAttr: string | null }> {
  const page = await ctx.newPage();
  const failed: string[] = [];
  page.on('response', (r: any) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });
  page.on('requestfailed', (r: any) => {
    const u = new URL(r.url());
    // a request the page itself cancelled (a lazy image swapped, a navigation) is not a missing file
    if (u.origin === new URL(url).origin && !/ERR_ABORTED/.test(r.failure()?.errorText ?? '')) failed.push(`failed ${u.pathname}`);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => ((i as HTMLImageElement).loading = 'eager'));
  });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  });
  await page.waitForTimeout(600);
  const variantAttr: string | null = await page.evaluate(() => document.documentElement.getAttribute('data-variant'));
  // decor layers often have pointer-events: none — elementFromPoint (the occlusion probe below) must see them
  const probeStyle = await page.addStyleTag({ content: '*, *::before, *::after { pointer-events: auto !important }' });
  const samples: TextSample[] = await page.evaluate((scriptRe: string) => {
    const re = new RegExp(scriptRe, 'i');
    const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
    const out: any[] = [];
    let n = 0;
    for (const el of Array.from(document.body.querySelectorAll('*'))) {
      const own = Array.from(el.childNodes)
        .filter((c) => c.nodeType === 3)
        .map((c) => c.textContent ?? '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
      if (!own || own.length < 2) continue;
      const cs = getComputedStyle(el);
      if (!(el as HTMLElement).checkVisibility?.({ opacityProperty: true, visibilityProperty: true } as any)) continue;
      if (Number(cs.opacity) < 0.5 || cs.clipPath !== 'none' && cs.clipPath !== '') continue;
      window.scrollTo(0, 0);
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 6) continue;
      const color = rgb(cs.color);
      if (color.length > 3 && color[3] < 0.3) continue;
      // a text under other paint (a card inside the closed envelope) is not seen: skip it when every probe point of its
      // box hits something that is neither the text nor inside it
      if (el.closest('.ph-mark')) continue; // "Your photo here": only in the couple's preview, never shown to guests
      // a full-page screenshot moves fixed / sticky layers (the nav, the music button) away from where the page reports
      // them: those are not measured here (their own opaque ground is checked by theme-check's page checks)
      let fixed = false;
      for (let p: Element | null = el; p && !fixed; p = p.parentElement) fixed = /^(fixed|sticky)$/.test(getComputedStyle(p).position);
      if (fixed) continue;
      const pageY = r.top + scrollY;
      window.scrollTo(0, Math.max(0, pageY + r.height / 2 - innerHeight / 2));
      const v = el.getBoundingClientRect();
      const probes = [0.5, 0.2, 0.8].map((fx) => [v.left + v.width * fx, v.top + v.height / 2] as const);
      const seen = probes.some(([x, y]) => {
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return true; // off screen: cannot tell, measure it
        const top = document.elementFromPoint(x, y);
        return !top || top === el || el.contains(top) || top.contains(el);
      });
      if (!seen) continue;
      const shadow = cs.textShadow && cs.textShadow !== 'none' ? rgb(cs.textShadow) : null;
      out.push({
        key: `${el.tagName.toLowerCase()}#${n++}:${own.slice(0, 24)}`,
        text: own.slice(0, 48),
        box: { x: r.left, y: pageY, w: r.width, h: r.height },
        color,
        size: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight) || 400,
        script: re.test(cs.fontFamily),
        halo: shadow && shadow.length >= 3 ? shadow.slice(0, shadow.length >= 4 ? 4 : 3) : null,
      });
      if (out.length >= 180) break;
    }
    window.scrollTo(0, 0);
    return out;
  }, SCRIPT_FONT.source);
  await probeStyle.evaluate((n: Element) => n.remove());
  // the review screenshot (as guests see it); then, for the measurement, fixed / sticky layers hidden: a full-page
  // screenshot paints the bottom nav over the middle of a long page (G177: "Number of guests" measured on the nav strip),
  // while a guest scrolls that text above the nav (G180: nothing stays under it at a page's end)
  await page.screenshot({ path: shot, fullPage: true });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed' || pos === 'sticky') el.style.setProperty('visibility', 'hidden', 'important');
    }
  });
  const seenShot = await page.screenshot({ fullPage: true });
  await page.addStyleTag({
    content: '*, *::before, *::after { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; caret-color: transparent !important }',
  });
  await page.waitForTimeout(150);
  const ground = await page.screenshot({ fullPage: true });
  await page.close();
  const img = sharp(ground);
  const meta = await img.metadata();
  const raw = await img.removeAlpha().raw().toBuffer();
  const shown = await sharp(seenShot).removeAlpha().raw().toBuffer();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  const ratios = new Map<string, { ratio: number; need: number; text: string }>();
  for (const s of samples) {
    // the glyph band: the middle 64 % of the line box height, the whole width
    const x0 = Math.max(0, Math.floor(s.box.x));
    const x1 = Math.min(W, Math.ceil(s.box.x + s.box.w));
    const y0 = Math.max(0, Math.floor(s.box.y + s.box.h * 0.18));
    const y1 = Math.min(H, Math.ceil(s.box.y + s.box.h * 0.82));
    if (x1 - x0 < 2 || y1 - y0 < 2) continue;
    // not painted at all (under the closed envelope, clipped away): the two screenshots agree in its box — skip it
    let diff = 0;
    let count = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const i = (y * W + x) * 3;
        diff += Math.abs(raw[i] - shown[i]) + Math.abs(raw[i + 1] - shown[i + 1]) + Math.abs(raw[i + 2] - shown[i + 2]);
        count++;
      }
    }
    if (!count || diff / count < 1.5) continue;
    const px: number[] = [];
    const stepX = Math.max(1, Math.floor((x1 - x0) / 60));
    const stepY = Math.max(1, Math.floor((y1 - y0) / 12));
    for (let y = y0; y < y1; y += stepY) {
      for (let x = x0; x < x1; x += stepX) {
        const i = (y * W + x) * 3;
        px.push(raw[i], raw[i + 1], raw[i + 2]);
      }
    }
    let ratio = groundRatio(s.color, px);
    if (s.halo) {
      const haloGround = blend(s.halo, [px[0] ?? 255, px[1] ?? 255, px[2] ?? 255]);
      ratio = Math.max(ratio, contrastRatio(blend(s.color, haloGround), haloGround));
    }
    ratios.set(s.key, { ratio, need: requiredRatio(s), text: s.text });
  }
  return { samples, ratios, failed, variantAttr };
}

/** Runs the palette checks; returns a summary for checks.json. */
export async function checkVariants(o: VariantCheckOptions): Promise<Record<string, unknown>> {
  const summary: Record<string, unknown> = {};
  if (!o.variants.length) return summary;
  const dir = path.join(o.out, 'variants');
  mkdirSync(dir, { recursive: true });
  const ctx = await o.browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  try {
    const original = new Map<string, PageResult>();
    for (const palette of [null, ...o.variants]) {
      const id = palette?.id ?? 'original';
      const lows: string[] = [];
      const same: string[] = [];
      let measured = 0;
      for (const page of o.pages) {
        const url = `${o.base}/start/demo/${o.themeId}${page === 'index' ? '' : `/${page}`}${palette ? `?variant=${palette.id}` : ''}`;
        const r = await measurePage(ctx, url, path.join(dir, `${id}_${page}_390.png`));
        if (palette && r.variantAttr !== palette.id) o.err(`palette ${id} ${page}: html[data-variant] is "${r.variantAttr ?? ''}", not "${palette.id}"`);
        if (r.failed.length) o.err(`palette ${id} ${page}: ${r.failed.length} failed request(s): ${r.failed.slice(0, 4).join(', ')}`);
        if (!palette) original.set(page, { ratios: r.ratios });
        for (const [key, v] of r.ratios) {
          measured++;
          if (v.ratio >= v.need) continue;
          const base = original.get(page)?.ratios.get(key);
          const line = `${page} "${v.text}" ${v.ratio.toFixed(2)}:1 < ${v.need}:1`;
          if (!palette || (base && base.ratio < base.need && v.ratio >= base.ratio - 0.25)) same.push(line);
          else lows.push(line);
        }
      }
      summary[id] = { measured, low: lows.length, as_original: same.length };
      if (palette) {
        if (lows.length) o.err(`palette ${id} (${palette.status}): ${lows.length} text(s) below the contrast minimum on the painted ground (docs/11 §10): ${lows.slice(0, 6).join('; ')}`);
        else o.ok(`palette ${id} (${palette.status}): ${measured} texts on ${o.pages.length} pages reach 4.5:1 (body) / 3:1 (large, script) on the painted ground`);
        if (same.length) o.warn(`palette ${id}: ${same.length} text(s) below the minimum as in the original design: ${same.slice(0, 4).join('; ')}`);
      } else if (same.length) {
        o.warn(`original palette: ${same.length} text(s) below the contrast minimum on the painted ground: ${same.slice(0, 6).join('; ')}`);
      }
    }
  } finally {
    await ctx.close();
  }
  writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 1) + '\n');
  return summary;
}
