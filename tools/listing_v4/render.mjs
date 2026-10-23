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
// every family the page asks for must really load (a dropped Google Fonts request silently falls back to Georgia)
const fams = [...new Set([...src.matchAll(/family=([A-Za-z+]+)/g)].map((m) => m[1].replace(/\+/g, ' ')))];
let missing = fams;
for (let t = 0; t < 4 && missing.length; t++) {
  await p.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  missing = await p.evaluate(async (fs) => {
    await Promise.all(fs.map((f) => document.fonts.load(`16px "${f}"`).catch(() => null)));
    return fs.filter((f) => !document.fonts.check(`16px "${f}"`) || ![...document.fonts].some((ff) => ff.family.replace(/["']/g, '') === f && ff.status === 'loaded'));
  }, fams);
}
if (missing.length) { console.error('fonts not loaded:', missing.join(', ')); await b.close(); process.exit(1); }
await p.screenshot({ path: out });
await b.close();
console.log('ok', out);
