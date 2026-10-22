import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync } from 'node:fs';
const [infoFile, outDir] = process.argv.slice(2);
const info = JSON.parse(readFileSync(infoFile,'utf8'));
mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
async function shot(name, vp, dpr, url, mobile, after) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, locale: 'en-US' });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  if (after) await after(p);
  await p.screenshot({ path: `${outDir}/${name}.jpg`, type: 'jpeg', quality: 93 });
  await ctx.close();
}
const site = `${info.base}/${info.slug}`;
await shot('tablet_home', { width: 820, height: 1180 }, 2, `${site}/home`, true, async (p) => { await p.waitForTimeout(3500); });
await shot('tablet_envelope', { width: 820, height: 1180 }, 2, site, true);
await shot('laptop_home', { width: 1440, height: 900 }, 1.5, `${site}/home`, false, async (p) => { await p.waitForTimeout(3500); });
await shot('laptop_edit', { width: 1440, height: 900 }, 1.5, `${info.base}/edit/${info.slug}?k=${info.key}#edit/story`, false, async (p) => { await p.waitForTimeout(1500); });
await shot('laptop_guests', { width: 1440, height: 900 }, 1.5, `${info.base}/edit/${info.slug}?k=${info.key}#guests`, false, async (p) => { await p.waitForTimeout(1500); });
await b.close();
