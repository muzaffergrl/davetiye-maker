// node render.mjs <html> <bg image> <out.png>
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const [html, bg, out] = process.argv.slice(2);
const src = readFileSync(html, 'utf8').replace('BG', pathToFileURL(path.resolve(bg)).href);
const tmp = path.join(path.dirname(path.resolve(html)), `_render_${process.pid}_${Date.now()}.html`);
writeFileSync(tmp, src);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(process.env.W||2000), height: Number(process.env.H||2000) } });
await p.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out });
await b.close();
console.log('ok', out);
