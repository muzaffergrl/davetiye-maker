#!/usr/bin/env node
// HTML animasyon kaynağındaki parçaları Canva'ya yüklenecek ayrı katmanlar olarak dışa aktarır.
// Her katman tek başına, şeffaf zeminli PNG (ya da düz JPG) olarak kaydedilir.
//
// Kullanım:
//   NODE_PATH="$(npm root -g)" node tools/export_layers.mjs <html> <çıktı_klasörü> <katmanlar.json>
//
// katmanlar.json: [{ "name": "envelope_back.png", "selector": ".env-back", "pad": 60,
//                    "show": [".ek-görünür"], "hide": [".gizlenecek"], "css": "ek css" }, ...]
// "name" .jpg ile bitiyorsa zemin opak kalır; aksi halde şeffaftır.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [htmlPath, outDir, specPath] = process.argv.slice(2);
if (!htmlPath || !outDir || !specPath) {
  console.error('Kullanım: node tools/export_layers.mjs <html> <çıktı_klasörü> <katmanlar.json>');
  process.exit(2);
}
const layers = JSON.parse(fs.readFileSync(specPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.resolve(htmlPath)).href + '?render=1', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Tüm animasyonları kapat: her öğe son (dinlenme) konumunda, tam görünür.
await page.evaluate(() => {
  document.getAnimations().forEach(a => a.cancel());
  document.querySelectorAll('.stage, .stage *').forEach(el => { el.style.animation = 'none'; });
});
await page.addStyleTag({ content: '.flap-open { transform: none !important; }' });

for (const l of layers) {
  const opaque = l.name.endsWith('.jpg');
  const show = [l.selector, ...(l.show || [])];
  const css = [
    opaque ? '' : 'html, body, .stage { background: transparent !important; } .stage::after { display: none !important; }',
    '.stage * { visibility: hidden !important; }',
    show.map(s => `${s}, ${s} *`).join(', ') + ' { visibility: visible !important; }',
    (l.hide || []).map(s => `${s}, ${s} *`).join(', ') + ((l.hide || []).length ? ' { visibility: hidden !important; }' : ''),
    l.css || '',
  ].join('\n');
  const tag = await page.addStyleTag({ content: css });
  const box = await page.locator(l.selector).first().boundingBox();
  const pad = l.pad || 0;
  const clip = l.full ? { x: 0, y: 0, width: 1080, height: 1920 }
    : { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2 };
  const file = path.join(outDir, l.name);
  await page.screenshot({ path: file, clip, omitBackground: !opaque, ...(opaque ? { type: 'jpeg', quality: 92 } : {}) });
  console.log(`${l.name}\t${Math.round(clip.width)}x${Math.round(clip.height)} (canvas px)\tkonum ${Math.round(clip.x)},${Math.round(clip.y)}`);
  await tag.evaluate(n => n.remove());
}
await browser.close();
