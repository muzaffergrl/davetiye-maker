// Frame check for theme work (docs/34 §5, docs/35 §6b): against a running preview (scripts/theme-preview.ts or next dev)
// writes <out>/<theme>-open-<ms>.png (the opening sought to fixed times: .is-opening + every animation paused at t),
// <out>/<theme>-<page>.png (each inner page with all [data-step] revealed and animations finished, full page) and
// <out>/<theme>-sheet.png (all of it on one sheet), and prints the horizontal overflow of each page (must be 0).
//
//   node scripts/theme-frames.cjs --theme <id> --port 3123 --out <dir> [--w 390 --h 844] [--times 0,300,600,…]
const path = require('node:path');
const { mkdirSync, readFileSync } = require('node:fs');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
const { chromium } = require('playwright-core');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const theme = arg('theme'), port = arg('port', '3199'), out = path.resolve(arg('out', '.')), W = +arg('w', 390), H = +arg('h', 844);
const times = arg('times', '0,300,600,900,1200,1500,1800,2100,2400,2700,3000,3400').split(',').map(Number);
(async () => {
  mkdirSync(out, { recursive: true });
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('pageerror', e.message));
  p.on('response', (r) => { if (r.status() >= 400 && !/favicon|\/rsvp\/|\/media\/|\/audio\//.test(r.url())) console.log('HTTP', r.status(), r.url()); });
  const base = `http://localhost:${port}/start/demo/${theme}`;
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const shots = [];
  await p.evaluate(() => document.documentElement.classList.add('is-opening'));
  for (const t of times) {
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, t);
    await p.waitForTimeout(60);
    const f = path.join(out, `${theme}-open-${String(t).padStart(4, '0')}.png`);
    await p.screenshot({ path: f }); shots.push(f);
  }
  const pages = [];
  for (const pg of ['home', 'story', 'details', 'rsvp']) {
    await p.goto(`${base}/${pg}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    const over = await p.evaluate(async () => {
      document.querySelectorAll('[data-step]').forEach((n) => { n.style.transitionDelay = '0ms'; n.style.setProperty('--d', '0ms'); n.classList.add('in'); });
      await new Promise((r) => setTimeout(r, 2600));
      for (const a of document.getAnimations()) { try { a.finish(); } catch (e) { /* infinite */ } }
      return document.documentElement.scrollWidth - innerWidth;
    });
    const f = path.join(out, `${theme}-${pg}.png`);
    await p.screenshot({ path: f, fullPage: true }); pages.push(f);
    console.log(`${pg}: overflow ${over}px`);
  }
  // one sheet: opening frames in rows of 6, then the pages side by side (scaled to 1/2)
  const sheet = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const imgs = (list, w) => list.map((f) => `<img src="data:image/png;base64,${readFileSync(f).toString('base64')}" style="width:${w}px;margin:3px;vertical-align:top">`).join('');
  await sheet.setContent(`<body style="margin:0;background:#888">${imgs(shots, 225)}<br>${imgs(pages, 340)}</body>`);
  await sheet.waitForTimeout(500);
  await sheet.screenshot({ path: path.join(out, `${theme}-sheet.png`), fullPage: true });
  console.log('sheet', path.join(out, `${theme}-sheet.png`));
  await b.close();
})();
