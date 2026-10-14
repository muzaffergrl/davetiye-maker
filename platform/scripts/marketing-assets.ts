// Marketing site images and videos from REAL product captures (G061, docs/14 §9.6, §12.4). No drawing, no generated
// screens: every image is a resize of a real theme / panel screenshot (collections/<NN>/package/shots, G059 capture,
// 390 px at DPR 3, fictional demo content) and every video is a cut of the real opening recording (opening.webm).
//
//   node scripts/marketing-assets.ts            # writes public/marketing/{designs,panel}/ + lib/marketing/assets.json
//   node scripts/marketing-assets.ts --check    # only verifies that assets.json matches the files (exit 1 if not)
//
// Needs sharp (dependency) and ffmpeg on PATH (videos). Outputs are deterministic for the same inputs; re-run after a
// new capture (e.g. panel screens after G060). GPT scene images (docs/14 §12, public/marketing/gpt/) are composed by
// a later step once they exist — this script does not touch them.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, PANEL_COLLECTION, PANEL_SOURCES, SCREEN_SOURCES } from '../lib/marketing/designs.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'lib/marketing/assets.json');
const require = createRequire(import.meta.url);

/** Widths of the screen derivatives (CSS px of a phone screen on the site ≈ 160–320, DPR up to 3). */
export const SCREEN_WIDTHS = [320, 480, 640] as const;
const WEBP_QUALITY = 74;
/** Opening clip: from the recording's lead-in (opening.json) for CLIP_SECONDS — envelope closed → home page. */
const CLIP_SECONDS = 10;
const VIDEO_MAX_BYTES = 1_500_000;

export interface ScreenAsset {
  /** Intrinsic size of the largest file. */
  width: number;
  height: number;
  /** width -> public path */
  files: Record<string, string>;
}
export interface VideoAsset {
  file: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  bytes: number;
}
export interface AssetManifest {
  note: string;
  designs: Record<string, { screens: Record<string, ScreenAsset>; opening: VideoAsset | null }>;
  panel: Record<string, ScreenAsset>;
}

const rel = (abs: string) => '/' + path.relative(PUBLIC, abs).split(path.sep).join('/');

async function screen(sharp: any, src: string, outDir: string, key: string): Promise<ScreenAsset> {
  mkdirSync(outDir, { recursive: true });
  const meta = await sharp(src).metadata();
  const files: Record<string, string> = {};
  let width = 0;
  let height = 0;
  for (const w of SCREEN_WIDTHS) {
    const out = path.join(outDir, `${key}-${w}.webp`);
    const info = await sharp(src).resize({ width: w }).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(out);
    files[String(w)] = rel(out);
    width = info.width;
    height = info.height;
  }
  if (!meta.width || !meta.height) throw new Error(`no size: ${src}`);
  return { width, height, files };
}

function ffmpeg(args: string[]): void {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
}

function opening(shots: string, outDir: string): VideoAsset | null {
  const webm = path.join(shots, 'opening.webm');
  if (!existsSync(webm)) return null;
  let leadIn = 1;
  try {
    leadIn = Number(JSON.parse(readFileSync(path.join(shots, 'opening.json'), 'utf8')).lead_in_s) || 1;
  } catch {
    /* default */
  }
  mkdirSync(outDir, { recursive: true });
  const mp4 = path.join(outDir, 'opening.mp4');
  const poster = path.join(outDir, 'opening-poster.webp');
  let crf = 27;
  for (;;) {
    ffmpeg([
      '-ss', leadIn.toFixed(2), '-t', String(CLIP_SECONDS), '-i', webm,
      '-an', '-vf', 'scale=390:-2:flags=lanczos,fps=30', '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
      '-preset', 'slow', '-crf', String(crf), '-movflags', '+faststart', mp4,
    ]);
    if (statSync(mp4).size <= VIDEO_MAX_BYTES || crf >= 35) break;
    crf += 2;
  }
  ffmpeg(['-ss', leadIn.toFixed(2), '-i', webm, '-frames:v', '1', '-c:v', 'libwebp', '-quality', String(WEBP_QUALITY), poster]);
  const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', mp4], { encoding: 'utf8' });
  const p = JSON.parse(probe);
  return {
    file: rel(mp4),
    poster: rel(poster),
    width: p.streams[0].width,
    height: p.streams[0].height,
    seconds: Math.round(Number(p.format.duration)),
    bytes: statSync(mp4).size,
  };
}

/** Problems: manifest entries whose file is missing. */
export function checkManifest(manifest: AssetManifest, publicDir = PUBLIC): string[] {
  const problems: string[] = [];
  const need = (p: string) => {
    if (!existsSync(path.join(publicDir, p))) problems.push(`missing public${p}`);
  };
  for (const [id, d] of Object.entries(manifest.designs)) {
    for (const s of Object.values(d.screens)) Object.values(s.files).forEach(need);
    if (d.opening) {
      need(d.opening.file);
      need(d.opening.poster);
      if (d.opening.bytes > VIDEO_MAX_BYTES) problems.push(`${id}: opening.mp4 is ${d.opening.bytes} bytes (> ${VIDEO_MAX_BYTES})`);
    }
  }
  for (const s of Object.values(manifest.panel)) Object.values(s.files).forEach(need);
  return problems;
}

async function main(): Promise<void> {
  if (process.argv.includes('--check')) {
    const problems = checkManifest(JSON.parse(readFileSync(MANIFEST, 'utf8')));
    if (problems.length) {
      console.error(problems.join('\n'));
      process.exit(1);
    }
    console.log('marketing assets: ok');
    return;
  }
  const sharp = require('sharp');
  const manifest: AssetManifest = {
    note: 'Generated by scripts/marketing-assets.ts from real captures (collections/<NN>/package/shots). Do not edit by hand.',
    designs: {},
    panel: {},
  };
  for (const d of MARKETING.designs) {
    const copy = DESIGN_COPY[d.id];
    if (!copy) continue; // 'coming' designs without copy yet
    const shots = path.join(REPO, 'collections', copy.collection, 'package/shots');
    if (!existsSync(shots)) {
      console.warn(`skip ${d.id}: no ${path.relative(REPO, shots)}`);
      continue;
    }
    const outDir = path.join(PUBLIC, 'marketing/designs', d.id);
    const screens: Record<string, ScreenAsset> = {};
    for (const [key, shot] of Object.entries(SCREEN_SOURCES)) {
      screens[key] = await screen(sharp, path.join(shots, `${shot}.jpg`), outDir, key);
    }
    manifest.designs[d.id] = { screens, opening: opening(shots, outDir) };
    console.log(`${d.id}: ${Object.keys(screens).length} screens, opening ${manifest.designs[d.id].opening?.bytes ?? 0} bytes`);
  }
  const panelShots = path.join(REPO, 'collections', PANEL_COLLECTION, 'package/shots');
  for (const [key, shot] of Object.entries(PANEL_SOURCES)) {
    manifest.panel[key] = await screen(sharp, path.join(panelShots, `${shot}.jpg`), path.join(PUBLIC, 'marketing/panel'), key);
  }
  const problems = checkManifest(manifest);
  if (problems.length) throw new Error(problems.join('\n'));
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`wrote ${path.relative(ROOT, MANIFEST)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
