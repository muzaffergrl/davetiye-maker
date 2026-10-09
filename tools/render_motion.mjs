#!/usr/bin/env node
// HTML animasyonunu kare kare render edip MP4'e çevirir (1080×1920, H.264).
//
// Kullanım:
//   NODE_PATH="$(npm root -g)" node tools/render_motion.mjs <html> <çıktı.mp4> [süre_sn=26] [fps=30] [--stills=3,7.6,13,19,24.5]
//
// Sayfa ?render=1 ile açılır; sayfa tüm CSS animasyonlarını durdurur ve
// window.seek(ms) ile her kareye gidilir. Bu sayede çıktı akıcı ve deterministiktir.
// Gerekenler: Playwright (Chromium) ve ffmpeg.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const [htmlPath, outPath, durS = '26', fpsS = '30'] = args.filter(a => !a.startsWith('--'));
if (!htmlPath || !outPath) {
  console.error('Kullanım: node tools/render_motion.mjs <html> <çıktı.mp4> [süre_sn] [fps] [--stills=1,5,10]');
  process.exit(2);
}
const duration = Number(durS), fps = Number(fpsS), frames = Math.round(duration * fps);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(htmlPath)).href + '?render=1', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const missing = await page.evaluate(() => ['Pinyon Script', 'Cormorant Garamond', 'Montserrat'].filter(f => !document.fonts.check(`40px "${f}"`)));
if (missing.length) console.warn('UYARI: yüklenemeyen fontlar:', missing.join(', '));

if (flags.stills) {
  const base = outPath.replace(/\.mp4$/, '');
  for (const s of flags.stills.split(',').map(Number)) {
    await page.evaluate(ms => window.seek(ms), s * 1000);
    const file = `${base}_t${String(s).replace('.', '_')}s.png`;
    await page.screenshot({ path: file });
    console.log('kare:', file);
  }
  if ('stills-only' in flags) { await browser.close(); process.exit(0); }
}

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outPath], { stdio: ['pipe', 'inherit', 'inherit'] });

const t0 = Date.now();
for (let i = 0; i < frames; i++) {
  await page.evaluate(ms => window.seek(ms), (i / fps) * 1000);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}/${duration} sn`);
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg çıkış kodu ' + c)))));
await browser.close();
console.log(`\nMP4 hazır: ${outPath} (${frames} kare, ${((Date.now() - t0) / 1000).toFixed(0)} sn'de render edildi)`);
