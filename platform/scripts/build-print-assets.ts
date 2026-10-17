#!/usr/bin/env node
// G139: printable-invitation parts of every theme -> platform/public/print/<id>/*.webp.
//
// The printed invitation (lib/print/invitation.ts) uses the design's own GPT parts at their FULL size (the website
// copies in img/ are 480–960 px; a 5×7 in card needs every pixel GPT gave). Sources: collections/<NN>/assets/gpt/
// parts/{invitation_card,info_card,bg_tile}.png (01–20) and the decor/texture/scene files of 21–22. They live in public/print/<id>/
// (served by the CDN; a theme folder keeps its 3 MB website budget). Nothing is upscaled: the
// real resolution is what lib/print/layouts.ts reports (PRINT_SOURCE_PX) — new 2× parts are requested from GPT
// (GPT_PROMPTS.md, G139). Run again after GPT replaces a part:
//
//   node scripts/build-print-assets.ts [--theme <id>]

import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

/**
 * Only the gold wax of a seal the theme build cut WITH its surround (Nocturne's env_seal carries a ring of the black
 * envelope paper and the flap's edge: right on the website's envelope, a grey ring on a print sheet). Kept: pixels that
 * are gold (warm: blue well under red) or gold highlights (bright), inside the wax's disc (the theme cut is the seal's
 * radius + 12 px, so the wax ends at ~44 % of the image). A mask of the image's own pixels — nothing is drawn (K21).
 */
async function goldOnly(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const edge = 0.44 * Math.min(width, height);
  const mask = Buffer.alloc(width * height);
  for (let p = 0, i = 0; p < mask.length; p++, i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const warm = clamp((0.75 - b / Math.max(r, 1)) / 0.2) * clamp(r / 25);
    const bright = clamp(((r + g + b) / 3 - 140) / 60);
    const disc = clamp((edge - Math.hypot((p % width) - cx, Math.floor(p / width) - cy)) / 2 + 0.5);
    mask[p] = Math.round(data[i + 3] * disc * Math.max(warm, bright));
  }
  const soft = await sharp(mask, { raw: { width, height, channels: 1 } }).blur(0.6).extractChannel(0).raw().toBuffer();
  for (let p = 0; p < mask.length; p++) data[p * 4 + 3] = soft[p];
  return sharp(data, { raw: { width, height, channels: 4 } });
}

const only = process.argv.includes('--theme') ? process.argv[process.argv.indexOf('--theme') + 1] : null;

for (const [id, layout] of Object.entries(PRINT_LAYOUTS)) {
  if (only && id !== only) continue;
  const outDir = path.join(ROOT, 'platform', 'public', 'print', id);
  mkdirSync(outDir, { recursive: true });
  for (const [name, source] of Object.entries(layout.sources)) {
    const rel = typeof source === 'string' ? source : source.path;
    // a 2× print version from GPT (<part>_print.png, GPT_PROMPTS.md G139) wins over the website part
    // platform/…: a piece the theme's own build already cut from a GPT image (layouts.ts, sources)
    const base = rel.startsWith('platform/') ? path.join(ROOT, rel) : path.join(ROOT, 'collections', layout.collection, 'assets', 'gpt', rel);
    const print = base.replace(/\.png$/, '_print.png');
    const src = existsSync(print) ? print : base;
    if (!existsSync(src)) {
      console.error(`${id}: missing ${path.relative(ROOT, src)}`);
      process.exitCode = 1;
      continue;
    }
    const out = path.join(outDir, `${name}.webp`);
    const img = typeof source !== 'string' && source.goldOnly && src === base ? await goldOnly(src) : sharp(src);
    const info = await img.webp({ quality: 90, alphaQuality: 95, effort: 5 }).toFile(out);
    console.log(`${id}/print/${name}.webp ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);
  }
  // G167: PAKET 6 print grounds that arrived but the layout does not use yet (a composed interim layout): say so, the
  // switch is a layouts.ts edit + a G149 measurement of the text boxes on the new art (GPT_PROMPTS.md, PAKET 6)
  const printDir = path.join(ROOT, 'collections', layout.collection, 'assets', 'gpt', 'print');
  const used = Object.values(layout.sources).map((s) => path.basename(typeof s === 'string' ? s : s.path));
  const waiting = existsSync(printDir) ? readdirSync(printDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !used.includes(f)) : [];
  if (waiting.length) console.warn(`${id}: PAKET 6 grounds not used by lib/print/layouts.ts yet: ${waiting.join(', ')}`);
}
