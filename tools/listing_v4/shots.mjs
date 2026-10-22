// Cover screens of a theme's live demo: the closed envelope, then a burst while it opens (pick the best one later).
// usage: node shots.mjs <theme> <outdir>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const [theme, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' });
const p = await ctx.newPage();
const url = `https://bkestudio.com/start/demo/${theme}`;
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.goto(`${url}/home`, { waitUntil: 'networkidle' }); // warm the home page's images too
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(3000);
await p.screenshot({ path: path.join(out, 'closed.jpg'), type: 'jpeg', quality: 94 });
await p.tap('.stage');
const t0 = Date.now();
let i = 0;
while (Date.now() - t0 < 7000 && !/\/home/.test(p.url())) {
  await p.screenshot({ path: path.join(out, `open_${String(i++).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 94 }).catch(() => {});
  await p.waitForTimeout(250);
}
await p.waitForURL(/\/home/, { timeout: 15000 }).catch(() => {});
await p.waitForTimeout(3500);
await p.screenshot({ path: path.join(out, 'home.jpg'), type: 'jpeg', quality: 94 });
console.log(theme, 'open frames', i);
await b.close();
