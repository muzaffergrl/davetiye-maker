// Metric-matched fallback faces for the couple's names (G180, docs/11 §12). The names heading of every theme is set in a
// Google Fonts face with display=swap; until it arrives the browser draws the next family of the stack (Georgia, Times,
// Snell Roundhand …), which is much wider than a condensed script, so "Avery & Jordan" wraps to 2 lines and jumps to 1
// when the font lands (layout shift 0.08–0.16 on a slow 4G link, G173). This tool measures the names face against two
// system serifs and writes two local() faces per theme, scaled so that the fallback sets the same width per line and
// the same ascent / descent / line gap as the web face:
//
//   fb1  local Times New Roman / Liberation Serif / Tinos (iOS, macOS, Windows, Linux; metric twins)
//   fb2  local Noto Serif / Droid Serif (Android; measured on Noto Serif from Google Fonts)
//   (fk1 / fk2: the same pair for the kicker's face, only where KICKER lists the theme)
//
// The faces go into each page's <head> as a small inline <style> (before site.css; 01–21 have no room left under the
// 45 KB site.css budget), and site.css names them right after the web family: "Allison",fb1,fb2,"Snell Roundhand"….
// Once the web font has loaded nothing changes: the faces are only used while it is missing. A device that has neither
// serif falls through to the theme's old stack as before.
//
//   npm run build && npm start   (any port; the demos are read from /start/demo/<id>)
//   NODE_PATH=/opt/node22/lib/node_modules node scripts/font-fallback.ts [--base http://127.0.0.1:3000] [--theme <id>]… [--check]
//
// --check writes nothing and exits 1 when a theme's faces are missing or differ from a fresh measurement by more than
// 1 point (fonts change at Google Fonts now and then). Re-running rewrites the blocks in place (idempotent).

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { loadChromium } from './lib/browser.ts';
import { ROOT } from './lib/theme-env.ts';

const { values: args } = parseArgs({
  options: { base: { type: 'string', default: 'http://127.0.0.1:3000' }, theme: { type: 'string', multiple: true }, check: { type: 'boolean' } },
});
const THEMES = path.join(ROOT, 'themes');
const ids = args.theme?.length ? args.theme : readdirSync(THEMES).filter((d) => !d.startsWith('_') && existsSync(path.join(THEMES, d, 'site.css')));

// names a guest is likely to see (mixed lengths, capitals, the letters a script draws widest); the demo couple first
const CORPUS = 'Avery & Jordan Olivia Liam Emma Noah Charlotte Oliver Amelia James Sophia Benjamin Isabella Lucas Mia Henry Evelyn Alexander Harper William Grace Matthew Chloe Daniel Zoe Sebastian Amélie Wyatt Quinn';
const MARK = '<style>/* names fallback: scripts/font-fallback.ts */';
const FACES = [
  { name: 'fb1', src: 'local(Times New Roman),local(Liberation Serif),local(Tinos)', probe: { local: 'Liberation Serif' } },
  { name: 'fb2', src: 'local(Noto Serif),local(Droid Serif)', probe: { google: 'Noto Serif' } },
];

// themes whose site.js fits the names to ONE line by scaling (one = width / text width): a fallback even 1 % narrower
// than the web face fits at scale 1 and the web face wraps for a frame when it lands (04: 0.15). Here the fallback is
// made a little wider, and the CSS default scale of the envelope names (before site.js) is below 1 to match
const WIDER: Record<string, number> = { 'vintage-airmail-love-letter': 1.015 };
// themes whose kicker above the names is set in a web face that wraps differently on the fallback serif (36: Old
// Standard TT, 2 lines; Times, 1 line): they get fk1 / fk2 for that family too
const KICKER = ['victorian-glasshouse'];
const browser = await loadChromium().launch();
let failed = 0;

for (const id of ids) {
  const cssPath = path.join(THEMES, id, 'site.css');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  // one retry: a cold demo route can stall on the first request after a restart
  await page.goto(`${args.base}/start/demo/${id}`, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => page.goto(`${args.base}/start/demo/${id}`, { waitUntil: 'domcontentloaded', timeout: 60_000 }));
  await page.evaluate(() => document.fonts.ready);
  // the names heading (fb1 / fb2) and, where KICKER lists the theme, the kicker line in its own face (fk1 / fk2)
  const targets = [{ sel: 'h1.names, .names', names: ['fb1', 'fb2'] }, ...(KICKER.includes(id) ? [{ sel: 'kicker', names: ['fk1', 'fk2'] }] : [])];
  const found: Array<{ family: string; weight: string; style: string; names: string[]; faces: Array<{ css: string; size: number }> }> = [];
  let link = '';
  const demoUrl = page.url();
  for (const t of targets) {
    // setContent below keeps the URL: back to the demo for the next target
    if (t !== targets[0]) {
      await page.goto(demoUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.evaluate(() => document.fonts.ready);
    }
    const h = await page.evaluate((sel: string) => {
      // 'kicker': the line right above the names heading (.kicker, .eyebrow … — its class differs per theme)
      const el = (sel === 'kicker' ? document.querySelector('h1.names, .names')?.previousElementSibling : document.querySelector(sel)) as HTMLElement | null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      const link = (document.querySelector('link[href*="fonts.googleapis.com/css2"]') as HTMLLinkElement | null)?.href ?? '';
      return { family: cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''), weight: cs.fontWeight, style: cs.fontStyle, upper: cs.textTransform === 'uppercase', link, text: el.textContent?.trim() ?? '' };
    }, t.sel);
    if (!h || !h.link) break;
    link = h.link;
    // the kicker: its own (design) text first, then the names corpus
    const words = t.names[0] === 'fk1' ? `${h.text} ${CORPUS}` : CORPUS;
    const corpus = h.upper ? words.toUpperCase() : words;
    const noto = 'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=block';
    await page.setContent(`<!doctype html><link rel="stylesheet" href="${h.link.replace(/display=swap/, 'display=block')}"><link rel="stylesheet" href="${noto}">
    <style>@font-face{font-family:probe-fb;src:local("${FACES[0].probe.local}")}</style>`, { waitUntil: 'domcontentloaded' });
    const m = await page.evaluate(
      async ({ h, corpus }: { h: { family: string; weight: string; style: string }; corpus: string }) => {
        const font = (fam: string) => `${h.style} ${h.weight} 100px ${fam}`;
        // the Google Fonts stylesheets first (setContent returns at DOMContentLoaded), else load() finds no face
        await Promise.all([...document.querySelectorAll('link')].map((l) => (l.sheet ? 0 : new Promise((r) => ((l.onload = r), (l.onerror = r))))));
        await document.fonts.load(font(`"${h.family}"`), corpus);
        await document.fonts.load(font('"Noto Serif"'), corpus);
        await document.fonts.load(font('probe-fb'), corpus);
        const measure = (fam: string) => {
          // width from a DOM span (synthetic bold / italic exactly as the page draws them), metrics from canvas
          const s = document.createElement('span');
          Object.assign(s.style, { font: font(fam), lineHeight: 'normal', whiteSpace: 'nowrap', position: 'absolute' });
          s.textContent = corpus;
          document.body.append(s);
          const width = s.getBoundingClientRect().width;
          const normal = s.getBoundingClientRect().height;
          s.remove();
          const c = document.createElement('canvas').getContext('2d')!;
          c.font = font(fam);
          const t = c.measureText(corpus);
          return { width, asc: t.fontBoundingBoxAscent, desc: t.fontBoundingBoxDescent, gap: Math.max(0, normal - t.fontBoundingBoxAscent - t.fontBoundingBoxDescent) };
        };
        return { web: measure(`"${h.family}"`), fb: measure('probe-fb'), fb2: measure('"Noto Serif"'), loaded: [...document.fonts].some((f) => f.family.replace(/["']/g, '') === h.family && f.status === 'loaded') };
      },
      { h, corpus },
    );
    if (!m.loaded) {
      console.log(`${id}: ${h.family} did not load — skipped`);
      failed++;
      found.length = 0;
      break;
    }
    const pct = (v: number) => `${(Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '')}%`;
    const faces = FACES.map((f, i) => {
      const fb = i === 0 ? m.fb : m.fb2;
      const size = (m.web.width / fb.width) * (t.names[0] === 'fb1' ? (WIDER[id] ?? 1) : 1);
      // overrides are fractions of the used (already size-adjusted) em, like next/font's: web metric / size-adjust
      const desc = { size: size * 100, asc: m.web.asc / size, desc: m.web.desc / size, gap: m.web.gap / size };
      const css = `@font-face{font-family:${t.names[i]};src:${f.src};${h.style === 'italic' ? 'font-style:italic;' : ''}size-adjust:${pct(desc.size)};ascent-override:${pct(desc.asc)};descent-override:${pct(desc.desc)};line-gap-override:${pct(desc.gap)}}`;
      return { css, size: desc.size };
    });
    found.push({ family: h.family, weight: h.weight, style: h.style, names: t.names, faces });
  }
  if (!found.length || !link) {
    if (!link) console.log(`${id}: no names heading / Google Fonts link — skipped`);
    await ctx.close();
    continue;
  }
  const faces = found.flatMap((f) => f.faces);

  const block = `${MARK}\n${faces.map((f) => f.css).join('\n')}</style>\n`;
  const blockRe = new RegExp(`${MARK.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\n(?:@font-face\\{[^\\n]*\\n?)*</style>\\n`);
  const num = (s: string) => [...s.matchAll(/(size-adjust|ascent-override|descent-override|line-gap-override):([\d.]+)%/g)].map((x) => Number(x[2]));
  // every page of the theme: the block right before <link … href="site.css">
  for (const file of readdirSync(path.join(THEMES, id)).filter((f) => f.endsWith('.html'))) {
    const htmlPath = path.join(THEMES, id, file);
    let html = readFileSync(htmlPath, 'utf8');
    const before = html;
    const old = html.match(blockRe)?.[0];
    if (old) {
      const [a, b] = [num(old), num(block)];
      if (args.check && (a.length !== b.length || a.some((v, i) => Math.abs(v - b[i]) > 1))) {
        console.log(`FAIL ${id}/${file}: faces differ from a fresh measurement\n  now:   ${old.trim()}\n  fresh: ${block.trim()}`);
        failed++;
      }
      html = html.replace(blockRe, block);
    } else {
      const at = html.search(/<link rel="stylesheet" href="site\.css">/);
      if (at < 0) continue;
      if (args.check) {
        console.log(`FAIL ${id}/${file}: no names fallback faces`);
        failed++;
      }
      html = html.slice(0, at) + block + html.slice(at);
    }
    if (!args.check && html !== before) writeFileSync(htmlPath, html);
  }
  // the stacks: right after each web family wherever site.css names it in a font list
  let css = readFileSync(cssPath, 'utf8');
  const before = css;
  for (const f of found) {
    const fam = f.family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ours = f.names.join(',');
    css = css.replace(new RegExp(`(["'])${fam}\\1(?!,${ours})\\s*,\\s*`, 'g'), (_s, q) => `${q}${f.family}${q},${ours},`);
    if (!new RegExp(`["']${fam}["'],${ours}`).test(css)) {
      console.log(`FAIL ${id}: ${f.family} is not named in a font list of site.css`);
      failed++;
    }
  }
  const size = Buffer.byteLength(css);
  console.log(
    `${id.padEnd(28)} ${found.map((f) => `${f.family} ${f.weight}${f.style === 'italic' ? 'i' : ''} ${f.names[0]} ${f.faces[0].size.toFixed(1)}% ${f.names[1]} ${f.faces[1].size.toFixed(1)}%`).join(' · ')}  site.css ${size} B${size > 45 * 1024 ? ' OVER 45 KB' : ''}`,
  );
  if (args.check && css !== before) {
    console.log(`FAIL ${id}: site.css does not name the fallback faces after the web families`);
    failed++;
  }
  if (!args.check && css !== before) writeFileSync(cssPath, css);
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
