#!/usr/bin/env node
// G139: printable-invitation parts of every theme -> platform/public/print/<id>/*.webp.
//
// The printed invitation (lib/print/invitation.ts) uses the design's own GPT parts at their FULL size (the website
// copies in img/ are 480–960 px; a 5×7 in card needs every pixel GPT gave). Sources: collections/<NN>/assets/gpt/
// parts/{invitation_card,info_card,bg_tile}.png (01–20) and the decor/texture files of 21. They live in public/print/<id>/
// (served by the CDN; a theme folder keeps its 3 MB website budget). Nothing is upscaled: the
// real resolution is what lib/print/layouts.ts reports (PRINT_SOURCE_PX) — new 2× parts are requested from GPT
// (GPT_PROMPTS.md, G139). Run again after GPT replaces a part:
//
//   node scripts/build-print-assets.ts [--theme <id>]

import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PRINT_LAYOUTS } from '../lib/print/layouts.ts';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const only = process.argv.includes('--theme') ? process.argv[process.argv.indexOf('--theme') + 1] : null;

for (const [id, layout] of Object.entries(PRINT_LAYOUTS)) {
  if (only && id !== only) continue;
  const outDir = path.join(ROOT, 'platform', 'public', 'print', id);
  mkdirSync(outDir, { recursive: true });
  for (const [name, rel] of Object.entries(layout.sources)) {
    // a 2× print version from GPT (<part>_print.png, GPT_PROMPTS.md G139) wins over the website part
    const base = path.join(ROOT, 'collections', layout.collection, 'assets', 'gpt', rel);
    const print = base.replace(/\.png$/, '_print.png');
    const src = existsSync(print) ? print : base;
    if (!existsSync(src)) {
      console.error(`${id}: missing ${path.relative(ROOT, src)}`);
      process.exitCode = 1;
      continue;
    }
    const out = path.join(outDir, `${name}.webp`);
    const info = await sharp(src).webp({ quality: 90, alphaQuality: 95, effort: 5 }).toFile(out);
    console.log(`${id}/print/${name}.webp ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);
  }
}
