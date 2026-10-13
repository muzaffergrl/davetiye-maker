#!/usr/bin/env node
// Browser checks + previews of the Blush Garden Rose theme on the real platform (production build, `next start`).
//
//   npm run build && node scripts/theme-check.cjs [--no-video]
//
// Seeds into a temporary data folder (platform/.data is not touched):
//   clara-and-julian  demo record + the fictional sample photos (published)      → the G035 look
//   no-photos         demo record without photos (published)                     → placeholder state
//   draft-site        demo record, draft                                         → preview-key navigation
// Uses the globally installed Playwright (NODE_PATH=/opt/node22/lib/node_modules or the absolute path below) and the
// browsers in /opt/pw-browsers; never runs `playwright install`.
//
// Checks (exit code 1 on any error), each page at 360/390/430/768/1280:
//   1 no horizontal scroll, no text outside the viewport, no element past the edge that nothing clips
//   2 every <img> loaded, no console/CSP error, no failed request
//   3 every [data-field] / <title> equals the site's content record (formatted here, independently of the engine)
//   4 card text stays on the plain paper of the GPT card (img/manifest.json free_zone), never over the painted florals
//   5 photo slots: user photos on the demo site, placeholders on the no-photos site ("Your photo here" only in a preview)
// Flows (390×844): envelope → home (card transition flag) → story via the nav; back → opened envelope + replay;
//   skip; reduced motion; per-site session keys; preview key kept through the opening; countdown (target + clock);
//   missing links send nothing; RSVP: a reply is stored and thanked, in a preview nothing is sent; a content change in
//   the data shows after reload; first-view weight.
// Short phones (360×640, 375×553, 390×690, 390×844): the envelope texts (kicker, names, hint; "Replay" when opened)
//   sit on the plain painted wash, not on the corner florals (measured on the backdrop with the text hidden).
// Output: previews/g038/<page>_390.png (+ index/home at every width, details_1280), *_placeholder.png,
//   details_390_changed_content.png, compare_<page>_390.jpg (G035 | G038), opening_390x844.mp4, checks.json.
//   THEME_SHOTS_DIR=<folder> writes them elsewhere (keeps the committed previews unchanged).

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

let chromium;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
  try {
    ({ chromium } = require(id));
    break;
  } catch {
    /* next */
  }
}
if (!chromium) {
  console.error('playwright not found: run with NODE_PATH=/opt/node22/lib/node_modules');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const REPO = path.resolve(ROOT, '..');
const THEME = 'blush-garden-rose';
const THEME_DIR = path.join(ROOT, 'themes', THEME);
const OUT = process.env.THEME_SHOTS_DIR || path.join(ROOT, 'previews', 'g038');
const G035 = path.join(REPO, 'collections/03_Blush_Garden_Rose/website/previews');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(THEME_DIR, 'img/manifest.json'), 'utf8'));
const PORT = Number(process.env.PORT || 3312);
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'];
const WIDTHS = [360, 390, 430, 768, 1280];
const VIDEO = !process.argv.includes('--no-video');

const results = { base: 'next start (production build)', theme: THEME, errors: [], warnings: [], passed: [], info: {} };
const err = (m) => { results.errors.push(m); console.log('FAIL  ' + m); };
const warn = (m) => { results.warnings.push(m); console.log('WARN  ' + m); };
const ok = (m) => { results.passed.push(m); console.log('PASS  ' + m); };

// ------------------------------------------------------------------ data helpers
function seed(dataDir, args) {
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/seed.ts'), ...args], {
    cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, SEED_BASE_URL: BASE }, stdio: 'pipe',
  });
  return JSON.parse(fs.readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8'));
}
function readSite(dataDir, id) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, 'sites', `${id}.json`), 'utf8'));
}
/** Changes the stored draft through the adapter and re-publishes (same path the panel will use). */
function editAndPublish(dataDir, id, patch) {
  const code = `
    import { LocalAdapter } from ${JSON.stringify(path.join(ROOT, 'lib/data/local/index.ts'))};
    import { publishSite } from ${JSON.stringify(path.join(ROOT, 'lib/sites.ts'))};
    const a = new LocalAdapter(process.env.PLATFORM_DATA_DIR);
    const s = await a.getSiteById(${JSON.stringify(id)});
    const patch = ${JSON.stringify(patch)};
    const c = structuredClone(s.content);
    for (const [k, v] of Object.entries(patch)) {
      const parts = k.split('.'); let o = c;
      for (const p of parts.slice(0, -1)) o = o[p];
      o[parts.at(-1)] = v;
    }
    await a.updateContent(s.id, c);
    await publishSite(a, s.id);`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir }, stdio: 'pipe' });
}

// ------------------------------------------------------------------ independent formatting (en-US, never numeric dates)
const fmtDate = (iso, o = { month: 'long', day: 'numeric', year: 'numeric' }) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...o });
const fmtTime = (hm) => { const [h, m] = hm.split(':').map(Number); return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const getPath = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function fieldValue(content, field, format) {
  let v;
  if (field === 'venue.city_region') v = [content.venue.city, content.venue.region].filter(Boolean).join(', ');
  else v = getPath(content, field);
  if (v === null || v === undefined) return '';
  v = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    if (format === 'weekday') return fmtDate(v, { weekday: 'long' });
    if (format === 'month') return fmtDate(v, { month: 'long' });
    if (format === 'day') return String(Number(v.slice(8)));
    if (format === 'year') return v.slice(0, 4);
    return fmtDate(v);
  }
  if (/^\d{2}:\d{2}$/.test(v)) return fmtTime(v);
  return v;
}
const TITLES = { index: (c) => `${c.name_display} · ${fmtDate(c.date)}`, home: (c) => `${c.name_display} · ${fmtDate(c.date)}`,
  story: (c) => `Our Story · ${c.name_display}`, details: (c) => `The Day · ${c.name_display}`, rsvp: (c) => `RSVP · ${c.name_display}` };

// ------------------------------------------------------------------ in-page checks
// lazy images that are hidden on this layout (e.g. .land-only florals on phones) never load by themselves: load them so
// "every <img> loaded" can be checked for every file the page references
async function eager(page) {
  await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))));
}
async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 240) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  });
  await page.waitForTimeout(3800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))));
  await page.waitForTimeout(250);
}

async function pageChecks(page, tag, content, photoMode) {
  const r = await page.evaluate(({ FZ }) => {
    const out = { hscroll: document.documentElement.scrollWidth - window.innerWidth, offscreen: [], bleed: [], zone: [] };
    const vw = window.innerWidth;
    for (const el of document.querySelectorAll('body *')) {
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]') || el.closest('.toast')) continue;
      if (el.closest('[data-rsvp-honeypot]')) continue;   // platform honeypot: off screen and aria-hidden on purpose
      const b = el.getBoundingClientRect();
      if (!b.width) continue;
      if (b.right > vw + 0.5 || b.left < -0.5) out.offscreen.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 28)}" [${Math.round(b.left)}..${Math.round(b.right)}]`);
    }
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.petal-layer') || el.closest('[data-rsvp-honeypot]')) continue;
      const b = el.getBoundingClientRect();
      if (!b.width || (b.right <= vw + 1 && b.left >= -1)) continue;
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== 'visible' || cs.clipPath !== 'none') { const ab = a.getBoundingClientRect(); if (ab.right <= vw + 1 && ab.left >= -1) { clipped = true; break; } }
      }
      if (!clipped) out.bleed.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} [${Math.round(b.left)}..${Math.round(b.right)}]`);
    }
    out.broken = [...document.images].filter((i) => !i.naturalWidth).map((i) => i.currentSrc || i.getAttribute('src'));
    out.fields = [...document.querySelectorAll('[data-field]')].map((el) => ({ field: el.dataset.field, format: el.dataset.format || '',
      tag: el.tagName, text: el.textContent.replace(/\s+/g, ' ').trim(), href: el.getAttribute('href'), missing: el.hasAttribute('data-url-missing') }));
    out.title = document.title;
    out.slots = [...document.querySelectorAll('[data-slot]')].map((s) => ({ key: s.dataset.slot, state: s.dataset.photoState,
      src: s.querySelector('img[data-photo]').getAttribute('src'), loaded: s.querySelector('img[data-photo]').naturalWidth > 0,
      mark: getComputedStyle(s.querySelector('.ph-mark')).display }));
    out.siteData = !!document.getElementById('site-data');
    out.js = document.documentElement.dataset.js;
    // text on painted cards must stay inside the plain-paper zone of the GPT image
    for (const [sel, key] of [['.invite', 'invitation_card'], ['.info', 'info_card'], ['.card', 'card_small']]) {
      for (const card of document.querySelectorAll(sel)) {
        const cb = card.getBoundingClientRect();
        if (!cb.width) continue;
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.photo-slot')) continue;
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const lb of rg.getClientRects()) {
            if (lb.width < 1) continue;
            const x0 = (lb.left - cb.left) / cb.width * 100, x1 = (lb.right - cb.left) / cb.width * 100;
            const pad = lb.height * 0.18;
            const y0 = (lb.top + pad - cb.top) / cb.height * 100, y1 = (lb.bottom - pad - cb.top) / cb.height * 100;
            for (const [y, L, R] of FZ[key]) {
              if (y + 1 <= y0 || y >= y1) continue;
              if (L === null || x0 < L - 0.6 || x1 > R + 0.6) {
                out.zone.push(`${key} "${n.textContent.trim().slice(0, 24)}" y${y0.toFixed(1)}–${y1.toFixed(1)}% x${x0.toFixed(1)}–${x1.toFixed(1)}% vs band ${y}% [${L}..${R}]`);
                break;
              }
            }
          }
        }
      }
    }
    out.fonts = {};
    for (const f of ['Great Vibes', 'Cormorant Garamond', 'Lora']) out.fonts[f] = document.fonts.check(`16px "${f}"`);
    return out;
  }, { FZ: { invitation_card: MANIFEST.invitation_card.free_zone, info_card: MANIFEST.info_card.free_zone, card_small: MANIFEST.card_small.free_zone } });

  const bad = [];
  if (r.hscroll > 0) bad.push(`horizontal scroll ${r.hscroll}px`);
  r.offscreen.forEach((x) => bad.push(`text off screen ${x}`));
  r.bleed.slice(0, 6).forEach((x) => bad.push(`element past the edge ${x}`));
  r.broken.forEach((x) => bad.push(`image not loaded ${x}`));
  r.zone.forEach((x) => bad.push(`card text over painted decor ${x}`));
  if (!r.siteData) bad.push('no #site-data');
  if (r.js !== 'ready') bad.push('site.js did not finish (data-js != ready)');
  const name = tag.split('@')[0];
  if (r.title !== TITLES[name](content)) bad.push(`title "${r.title}" ≠ "${TITLES[name](content)}"`);
  let n = 0;
  for (const f of r.fields) {
    if (f.tag === 'IMG') continue;
    if (f.field.startsWith('urls.')) {
      const v = getPath(content, f.field);
      if (v ? f.href !== v : f.href !== '#' || !f.missing) bad.push(`${f.field}: href ${f.href}`);
      continue;
    }
    const want = fieldValue(content, f.field, f.format);
    n++;
    if (f.text !== want) bad.push(`${f.field}${f.format ? '/' + f.format : ''}: "${f.text}" ≠ "${want}"`);
  }
  for (const s of r.slots) {
    if (photoMode === 'user' && (s.state !== 'user' || !s.src.startsWith('/media/') || s.mark !== 'none')) bad.push(`photo ${s.key}: ${JSON.stringify(s)}`);
    // public page: the neutral placeholder image only; the "Your photo here" label is for the couple's preview
    const wantMark = photoMode === 'preview-placeholder' ? 'flex' : 'none';
    if (photoMode.endsWith('placeholder') && (s.state !== 'placeholder' || !/\/img\/ph_/.test(s.src) || s.mark !== wantMark)) bad.push(`placeholder ${s.key}: ${JSON.stringify(s)}`);
    if (!s.loaded) bad.push(`photo ${s.key} not loaded`);
  }
  Object.entries(r.fonts).forEach(([f, v]) => { if (!v) warn(`${tag}: Google font not loaded (${f}) — fallback font shown`); });
  if (bad.length) bad.forEach((b) => err(`${tag}: ${b}`));
  else ok(`${tag}: no overflow, ${n} fields = content record, title ok, images loaded, card text on paper, photo slots ${photoMode}`);
  return r;
}

async function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 300)); }
  }
  throw new Error(`server did not start at ${url}`);
}

(async () => {
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('No production build: run `npm run build` first.');
    process.exit(2);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-g038-'));
  const demo = seed(dataDir, []);
  const nophoto = seed(dataDir, ['--slug', 'no-photos', '--no-photos']);
  const draft = seed(dataDir, ['--slug', 'draft-site', '--draft', '--no-photos']);
  const demoContent = () => readSite(dataDir, demo.siteId).publishedContent;
  results.info.seed_photos = demo.photos;

  const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverLog = '';
  server.stdout.on('data', (d) => (serverLog += d));
  server.stderr.on('data', (d) => (serverLog += d));

  let browser;
  try {
    await waitForServer(`${BASE}/`);
    const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
    browser = await chromium.launch(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {});
    const mk = (w, h, extra = {}) => browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 960, isMobile: w < 768, ...extra });
    const url = (slug, name, q = '') => `${BASE}/${slug}${name === 'index' ? '' : '/' + name}${q}`;
    const watch = (page) => {
      const problems = [];
      page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
      page.on('pageerror', (e) => problems.push('JS: ' + e.message));
      page.on('response', (res) => { if (res.status() >= 400 && !res.url().endsWith('favicon.ico')) problems.push(`${res.status()} ${res.url()}`); });
      return problems;
    };
    const flattenNav = (page) => page.evaluate(() => {
      document.querySelectorAll('.petal-layer').forEach((l) => l.remove());
      const n = document.querySelector('.site-nav');
      if (n && getComputedStyle(n).bottom === '0px') { n.style.position = 'absolute'; n.style.bottom = 'auto'; n.style.top = (document.documentElement.scrollHeight - n.offsetHeight) + 'px'; }
    });

    // ---------------------------------------------------------------- every page × width (demo site with photos)
    for (const w of WIDTHS) {
      const h = w < 768 ? 844 : (w < 1000 ? 1024 : 800);
      const ctx = await mk(w, h);
      for (const name of PAGES) {
        const page = await ctx.newPage();
        const problems = watch(page);
        await page.goto(url(demo.slug, name), { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await eager(page);
        if (name === 'index') await page.waitForTimeout(900); else await revealAll(page);
        await pageChecks(page, `${name}@${w}`, demoContent(), 'user');
        problems.forEach((p) => err(`${name}@${w}: ${p}`));
        await flattenNav(page);
        if (w === 390 || ['index', 'home'].includes(name) || (w === 1280 && name === 'details')) {
          await page.screenshot({ path: path.join(OUT, `${name}_${w}.png`), fullPage: name !== 'index' });
        }
        await page.close();
      }
      await ctx.close();
    }

    // ---------------------------------------------------------------- placeholder state (no photos uploaded)
    {
      const ctx = await mk(390, 844);
      for (const name of PAGES) {
        const page = await ctx.newPage();
        const problems = watch(page);
        await page.goto(url(nophoto.slug, name), { waitUntil: 'load' });
        await eager(page);
        if (name === 'index') await page.waitForTimeout(900); else await revealAll(page);
        await pageChecks(page, `${name}@390 (no photos)`, readSite(dataDir, nophoto.siteId).publishedContent, 'placeholder');
        problems.forEach((p) => err(`${name} (no photos): ${p}`));
        await flattenNav(page);
        if (name !== 'rsvp') await page.screenshot({ path: path.join(OUT, `${name}_390_placeholder.png`), fullPage: name !== 'index' });
        await page.close();
      }
      await ctx.close();
    }

    // the couple's preview of the same placeholder state shows the "Your photo here" label
    {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      await page.goto(url(draft.slug, 'home', `?preview=${draft.previewKey}`), { waitUntil: 'load' });
      await eager(page);
      await revealAll(page);
      await pageChecks(page, 'home@390 (draft preview, no photos)', readSite(dataDir, draft.siteId).content, 'preview-placeholder');
      await ctx.close();
    }

    // ---------------------------------------------------------------- short phones: envelope text never on the florals
    {
      const sharp = require(path.join(ROOT, 'node_modules/sharp'));
      const busy = async (page, sel) => {
        const boxes = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((el) => {
          const b = el.getBoundingClientRect();
          return b.width && getComputedStyle(el).display !== 'none' ? { sel: el.className || el.tagName, x: b.left, y: b.top, w: b.width, h: b.height } : null;
        }).filter(Boolean), sel);
        // the backdrop alone under each text box: text, envelope and Enter button hidden
        await page.addStyleTag({ content: '.env-page *, .skip { color: transparent !important; text-shadow: none !important; } .stage, .env-after .btn { visibility: hidden !important; }' });
        const png = await page.screenshot();
        const out = [];
        for (const b of boxes) {
          const { data, info } = await sharp(png).extract({ left: Math.max(0, Math.round(b.x)), top: Math.max(0, Math.round(b.y)), width: Math.round(b.w), height: Math.round(b.h) })
            .greyscale().raw().toBuffer({ resolveWithObject: true });
          let edge = 0, dark = 0;
          for (let y = 0; y < info.height; y++) for (let x = 1; x < info.width; x++) edge += Math.abs(data[y * info.width + x] - data[y * info.width + x - 1]);
          for (const v of data) if (v < 170) dark++;
          out.push({ box: String(b.sel).slice(0, 24), edge: edge / (info.height * (info.width - 1)), dark: dark / data.length });
        }
        return out;
      };
      for (const [w, h] of [[360, 640], [375, 553], [390, 690], [390, 844]]) {
        for (const state of ['closed', 'opened']) {
          const ctx = await mk(w, h);
          const page = await ctx.newPage();
          if (state === 'opened') await page.addInitScript((slug) => sessionStorage.setItem('invite:opened:' + slug, '1'), nophoto.slug);
          await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(900);
          const sel = state === 'closed' ? '.env-head .kicker, .env-head .names, .env-hint' : '.env-after .replay';
          // calibrated: plain wash edge ≤ 1.3 / dark ≤ 0.03; over florals edge ≥ 2.7 or dark ≥ 0.06 (before the fix)
          const hits = (await busy(page, sel)).filter((r) => r.edge > 2.2 || r.dark > 0.05);
          if (hits.length) err(`envelope ${state} @${w}×${h}: text over the painted florals ${JSON.stringify(hits)}`);
          else ok(`envelope ${state} @${w}×${h}: ${state === 'closed' ? 'kicker, names and hint' : '"Replay the opening"'} on the plain wash`);
          await ctx.close();
        }
      }
    }

    // ---------------------------------------------------------------- touch targets of the small links (≥ 44 px)
    {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      const targets = [];
      await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
      targets.push(['envelope Skip', await page.evaluate(() => { const b = document.querySelector('.skip').getBoundingClientRect(); return [b.width, b.height]; })]);
      for (const [name, sel] of [['home', '.foot a.textlink'], ['rsvp', '.closing a.textlink']]) {
        await page.goto(url(nophoto.slug, name), { waitUntil: 'load' });
        // the hit area (::after) reaches 14 px above and below the text: probe there
        const hit = await page.evaluate((sel) => {
          const a = document.querySelector(sel);
          a.scrollIntoView({ block: 'center', behavior: 'instant' });   // the theme scrolls smoothly otherwise
          const b = a.getBoundingClientRect();
          const probe = (y) => document.elementFromPoint(b.left + b.width / 2, y)?.closest('a') === a;
          return probe(b.top - 10) && probe(b.bottom + 10) ? [b.width, b.height + 28] : [b.width, b.height];
        }, sel);
        targets.push([`${name} "Replay the envelope"`, hit]);
      }
      const small = targets.filter(([, [w, h]]) => w < 44 || h < 44);
      if (small.length) err(`touch targets under 44 px: ${JSON.stringify(small)}`);
      else ok(`touch targets ≥ 44 px: ${targets.map(([n, [w, h]]) => `${n} ${Math.round(w)}×${Math.round(h)}`).join(', ')}`);
      await ctx.close();
    }

    // ---------------------------------------------------------------- opening flow: envelope → home → story; back; replay
    {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      const problems = watch(page);
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      await page.waitForTimeout(600);
      const t0 = Date.now();
      await page.click('.stage');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 9000 });
      results.info.envelope_to_home_ms = Date.now() - t0;
      const arrive = await page.evaluate(() => document.documentElement.classList.contains('from-envelope'));
      if (!arrive) err('envelope → home: no from-envelope flag (card transition)'); else ok(`envelope → /${demo.slug}/home in ${results.info.envelope_to_home_ms} ms, card transition flag set`);
      await page.waitForTimeout(5200);
      const heroVisible = await page.evaluate(() => [...document.querySelectorAll('.hero [data-step]')].every((e) => getComputedStyle(e).opacity === '1' || getComputedStyle(e).display === 'none'));
      if (!heroVisible) err('home hero: an element is still hidden after the sequential entrance'); else ok('home hero: sequential entrance finished');
      const target = await page.evaluate(() => document.querySelector('[data-countdown]').dataset.targetUtc);
      if (target !== '2027-05-15T20:00:00.000Z') err(`countdown target ${target}`); else ok('countdown target from the platform: 2027-05-15 16:00 America/New_York = 20:00 UTC');
      await page.click('.site-nav a[href$="/story"]');
      await page.waitForURL(`${BASE}/${demo.slug}/story`, { timeout: 6000 });
      ok('home → story through the nav (/<slug>/story)');
      await page.goBack();
      await page.waitForURL(`${BASE}/${demo.slug}/home`);
      await page.goBack();
      await page.waitForURL(`${BASE}/${demo.slug}`);
      await page.waitForTimeout(800);
      const back = await page.evaluate(() => ({ opened: document.documentElement.classList.contains('is-opened'), after: getComputedStyle(document.querySelector('.env-after')).display,
        cflap: getComputedStyle(document.querySelector('.env-cflap')).opacity }));
      if (!back.opened || back.after === 'none' || back.cflap !== '0') err(`back to the envelope: ${JSON.stringify(back)}`); else ok('back to the envelope: opened state with "Enter" + "Replay the opening" (no forced replay)');
      await page.click('.replay');
      await page.waitForTimeout(400);
      const replaying = await page.evaluate(() => !document.documentElement.classList.contains('is-opened'));
      if (!replaying) err('replay did not restart the opening'); else ok('replay restarts the opening');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 9000 });
      // links without a URL: their buttons are not on the page at all (no dead "link will be added soon" buttons)
      const reqs = [];
      page.on('request', (rq) => reqs.push(rq.url()));
      await page.goto(url(demo.slug, 'details'), { waitUntil: 'load' });
      await revealAll(page);
      let before = reqs.length;
      const dead = await page.evaluate(() => ({ missing: document.querySelectorAll('a[data-url-missing]').length,
        buttons: [...document.querySelectorAll('.btn')].map((b) => b.textContent.trim()).filter((t) => /map|stay|registry/i.test(t)) }));
      if (dead.missing || dead.buttons.length) err(`details without links: dead buttons ${JSON.stringify(dead)}`);
      else ok('details without map / hotel / registry links: no dead buttons for guests');
      // RSVP (platform form contract, G042): the card button jumps to the form; a reply is stored for this site
      await page.goto(url(demo.slug, 'rsvp'), { waitUntil: 'load' });
      await page.waitForTimeout(2600);
      await page.click('.rsvp-text a[href="#reply"]');
      await page.waitForTimeout(900);
      const formInView = await page.evaluate(() => { const b = document.querySelector('[data-rsvp-form]').getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; });
      if (!formInView) err('RSVP: the card button does not bring the form into view');
      await page.waitForTimeout(1200);
      await page.fill('[data-rsvp-form] [name="name"]', 'Ada Fictional');
      await page.check('[data-rsvp-form] [name="attending"][value="yes"]');
      await page.fill('[data-rsvp-form] [name="guests"]', '2');
      await page.fill('[data-rsvp-form] [name="message"]', 'So happy for you both!');
      // empty name: the theme's own error slot (English, styled) instead of the browser bubble; nothing is sent
      await page.fill('[data-rsvp-form] [name="name"]', '');
      before = reqs.length;
      await page.click('[data-rsvp-form] button[type="submit"]');
      await page.waitForTimeout(300);
      const empty = await page.evaluate(() => {
        const n = document.querySelector('[data-rsvp-form] [name="name"]');
        const slot = document.querySelector('[data-rsvp-error-for="name"]');
        return { slot: slot.textContent, invalid: n.getAttribute('aria-invalid'), linked: (n.getAttribute('aria-describedby') || '').split(' ').includes(slot.id), focus: document.activeElement === n };
      });
      if (empty.slot !== 'Please enter your name.' || empty.invalid !== 'true' || !empty.linked || !empty.focus || reqs.slice(before).some((u) => u.includes('/api/rsvp/')))
        err(`RSVP empty name: ${JSON.stringify(empty)}`);
      else ok('RSVP empty name: message in the theme slot, linked with aria-describedby, focus on the field, nothing sent');
      await page.fill('[data-rsvp-form] [name="name"]', 'Ada Fictional');
      before = reqs.length;
      await page.click('[data-rsvp-form] button[type="submit"]');
      await page.waitForSelector('[data-rsvp-state="success"]:not([hidden])', { timeout: 6000 }).catch(() => null);
      const sent = await page.evaluate(() => ({ success: !document.querySelector('[data-rsvp-state="success"]').hidden,
        yes: !document.querySelector('[data-rsvp-reply="yes"]').hidden, formHidden: document.querySelector('[data-rsvp-form]').hidden }));
      const stored = (() => { try { return JSON.parse(fs.readFileSync(path.join(dataDir, 'rsvps', `${demo.siteId}.json`), 'utf8')); } catch { return []; } })();
      const posts = reqs.slice(before).filter((u) => u.endsWith(`/api/rsvp/${demo.slug}`));
      if (!sent.success || !sent.yes || !sent.formHidden || stored.length !== 1 || stored[0].guests !== 2 || stored[0].attending !== true || posts.length !== 1) {
        err(`RSVP submit: ${JSON.stringify(sent)}, stored ${JSON.stringify(stored)}, posts ${posts.length}`);
      } else ok('RSVP: card button → form, a reply (yes, 2 guests) is stored for this site and the thank-you panel shows');
      const closing = await page.evaluate(() => ['.closing .title', '.closing .line'].map((q) => getComputedStyle(document.querySelector(q)).display));
      if (closing.some((d) => d !== 'none')) err(`RSVP: the closing thank-you repeats the reply panel (${closing})`);
      else ok('RSVP: after a reply the closing section does not repeat or contradict the thank-you');
      await page.evaluate(() => document.querySelectorAll('.petal-layer').forEach((l) => l.remove()));
      await (await page.$('.reply-box')).screenshot({ path: path.join(OUT, 'rsvp_390_reply_sent.png') });
      await page.click('[data-rsvp-again]');
      if (await page.evaluate(() => document.querySelector('[data-rsvp-form]').hidden)) err('RSVP: "Send another reply" does not reopen the form');
      else ok('RSVP: "Send another reply" reopens the form');
      // the theme demo on /start: its RSVP page asks no status from a site that does not exist (no 404, no console error)
      {
        const demoPage = await ctx.newPage();
        const demoProblems = watch(demoPage);
        await demoPage.goto(`${BASE}/start/demo/${THEME}/rsvp?preview=demo`, { waitUntil: 'load' });
        await demoPage.waitForTimeout(800);
        if (demoProblems.length) err(`theme demo RSVP page: ${demoProblems.join(' | ')}`);
        else ok('theme demo RSVP page (/start/demo/…/rsvp): no 404, no console error');
        await demoPage.close();
      }
      const external = reqs.filter((u) => !u.startsWith(BASE) && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u) && !u.startsWith('data:'));
      if (external.length) err(`external requests: ${external.join(', ')}`); else ok('external requests: Google Fonts only');
      problems.forEach((p) => err(`opening flow: ${p}`));
      await ctx.close();
    }
    {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      await page.click('[data-skip]');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 4000 });
      ok('Skip → home');
      // per-site session keys: the other site's envelope is still closed
      await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
      const other = await page.evaluate(() => document.documentElement.classList.contains('is-opened'));
      if (other) err('session key leaked: another site on the same origin starts opened'); else ok('per-site session keys: another site on the same origin starts with a closed envelope');
      for (const [when, iso] of [['today', '2027-05-15T21:00:00Z'], ['after', '2027-05-20T12:00:00Z']]) {
        const p2 = await ctx.newPage();
        await p2.clock.install({ time: new Date(iso) });
        await p2.goto(url(demo.slug, 'home'), { waitUntil: 'load' });
        await p2.waitForTimeout(300);
        const shown = await p2.evaluate(() => [...document.querySelectorAll('.cd-done')].filter((p) => !p.hidden && getComputedStyle(p).display !== 'none').map((p) => p.dataset.when + ': ' + p.textContent));
        if (shown.length !== 1 || !shown[0].startsWith(when)) err(`countdown at ${iso}: ${JSON.stringify(shown)}`); else ok(`countdown after the start (${iso}) → "${shown[0]}"`);
        await p2.close();
      }
      await ctx.close();
    }
    {
      const ctx = await mk(390, 844, { reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      const t0 = Date.now();
      await page.click('.stage');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 4000 });
      const dt = Date.now() - t0;
      const allVisible = await page.evaluate(() => [...document.querySelectorAll('[data-step]')].every((e) => getComputedStyle(e).opacity === '1'));
      if (dt > 1500 || !allVisible) err(`reduced motion: ${dt} ms, all visible=${allVisible}`); else ok(`prefers-reduced-motion: straight to home without animation (${dt} ms), everything visible`);
      await ctx.close();
    }
    {
      // draft + preview key: the opening and the nav keep ?preview=
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      const q = `?preview=${draft.previewKey}`;
      const pub = await page.goto(url(draft.slug, 'index'));
      if (pub.status() !== 404) err(`draft without key: ${pub.status()}`);
      await page.goto(url(draft.slug, 'index', q), { waitUntil: 'load' });
      await page.click('.stage');
      await page.waitForURL(`${BASE}/${draft.slug}/home${q}`, { timeout: 9000 });
      await page.click('.site-nav a[href*="/details"]');
      await page.waitForURL(`${BASE}/${draft.slug}/details${q}`, { timeout: 6000 });
      ok('draft preview: envelope → home → details keep ?preview=<key> (page map from #site-data)');
      const posts = [];
      page.on('request', (rq) => { if (rq.method() === 'POST') posts.push(rq.url()); });
      await page.goto(url(draft.slug, 'rsvp', q), { waitUntil: 'load' });
      await page.waitForTimeout(800);
      await page.fill('[data-rsvp-form] [name="name"]', 'Preview Guest');
      await page.check('[data-rsvp-form] [name="attending"][value="no"]');
      await page.click('[data-rsvp-form] button[type="submit"]', { force: true });
      await page.waitForTimeout(600);
      const pv = await page.evaluate(() => !document.querySelector('[data-rsvp-state="preview"]').hidden);
      const stored = fs.existsSync(path.join(dataDir, 'rsvps', `${draft.siteId}.json`));
      if (!pv || posts.length || stored) err(`RSVP in preview: panel ${pv}, POSTs ${posts.join(', ')}, stored ${stored}`);
      else ok('RSVP in a draft preview: the preview notice shows, nothing is posted or stored');
      await ctx.close();
    }

    // ---------------------------------------------------------------- a content change in the data shows on the page
    {
      editAndPublish(dataDir, demo.siteId, {
        'partners.0.display_name': 'Maren', 'partners.0.full_name': 'Maren Holloway', 'partners.1.display_name': 'Theo',
        'partners.1.full_name': 'Theo Castellan', name_display: 'Maren & Theo', date: '2028-09-23', 'rsvp.deadline': '2028-08-01',
        'venue.name': 'Larkspur Hall', 'venue.city': 'Bath', 'venue.region': null, 'venue.country': 'United Kingdom', timezone: 'Europe/London',
        schedule: [{ label: 'Welcome Drinks', time: '14:45' }, { label: 'Ceremony', time: '15:30', location: 'The Walled Garden' },
          { label: 'Dinner', time: '18:00', location: 'The Long Room' }, { label: 'Dancing', time: '20:30', location: 'The Ballroom' }],
        ceremony_time: '15:30',
      });
      const changed = demoContent();
      const ctx = await mk(390, 844);
      for (const name of PAGES) {
        const page = await ctx.newPage();
        await page.goto(url(demo.slug, name), { waitUntil: 'load' });
        await eager(page);
        if (name === 'index') await page.waitForTimeout(600); else await revealAll(page);
        const r = await pageChecks(page, `${name}@390 (changed content)`, changed, 'user');
        const body = await page.evaluate(() => document.body.innerText);
        if (/Clara|Julian|Rosewater|Savannah/.test(body)) err(`${name}: old content still visible after the change`);
        if (name === 'details') {
          await flattenNav(page);
          await page.screenshot({ path: path.join(OUT, 'details_390_changed_content.png'), fullPage: true });
          if (r.fields.filter((f) => f.field.endsWith('.label') && f.field.startsWith('schedule')).length !== 4) err('details: 4 schedule rows expected');
        }
        await page.close();
      }
      ok('content change (names, date, venue, 4 schedule rows) → every page shows the new record after reload');
      await ctx.close();
    }

    // ---------------------------------------------------------------- first-view transfer (390×844, DPR 3)
    for (const name of ['index', 'home']) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      let bytes = 0; const list = [];
      page.on('requestfinished', async (rq) => {
        try { const s = await rq.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; list.push([rq.url().replace(BASE, ''), s.responseBodySize]); } catch { /* ignore */ }
      });
      await page.goto(url(nophoto.slug, name), { waitUntil: 'load' });
      await page.waitForTimeout(1200);
      results.info[`first_view_${name}_kb_placeholders`] = Math.round(bytes / 1024);
      results.info[`first_view_${name}_files`] = list.sort((a, b) => b[1] - a[1]).slice(0, 8);
      if (bytes > 1.5 * 1024 * 1024) err(`${name} first view ${Math.round(bytes / 1024)} KB > 1536 KB`); else ok(`${name} first view (390×844, DPR 3, placeholders): ${Math.round(bytes / 1024)} KB`);
      await ctx.close();
    }

    // ---------------------------------------------------------------- recording 390×844 (original demo content)
    if (VIDEO) {
      const fresh = seed(dataDir, ['--slug', 'clara-and-julian-video']);
      const vdir = fs.mkdtempSync(path.join(os.tmpdir(), 'g038-video-'));
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
        recordVideo: { dir: vdir, size: { width: 390, height: 844 } } });
      const page = await ctx.newPage();
      await page.goto(url(fresh.slug, 'index'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await page.tap('.stage');
      await page.waitForURL(`${BASE}/${fresh.slug}/home`, { timeout: 9000 });
      await page.waitForTimeout(4200);
      const smooth = (y, ms) => page.evaluate(async ([y, ms]) => {
        const y0 = window.scrollY, t0 = performance.now();
        await new Promise((res) => { (function f(t) { const k = Math.min(1, (t - t0) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; window.scrollTo(0, y0 + (y - y0) * e); if (k < 1) requestAnimationFrame(f); else res(); })(t0); });
      }, [y, ms]);
      const invTop = await page.evaluate(() => document.querySelector('#invitation').getBoundingClientRect().top + scrollY - 20);
      await smooth(invTop, 1600);
      await page.waitForTimeout(3600);
      const teasers = await page.evaluate(() => document.querySelector('.teasers-sec').getBoundingClientRect().top + scrollY - 40);
      await smooth(teasers, 1800);
      await page.waitForTimeout(2200);
      await page.tap('.teaser[href$="/story"]');
      await page.waitForURL(`${BASE}/${fresh.slug}/story`, { timeout: 6000 });
      await page.waitForTimeout(3000);
      await smooth(520, 1800);
      await page.waitForTimeout(2600);
      await page.tap('.site-nav a[href$="/details"]');
      await page.waitForURL(`${BASE}/${fresh.slug}/details`, { timeout: 6000 });
      await page.waitForTimeout(2600);
      const venue = await page.evaluate(() => document.querySelector('.venue-photo').getBoundingClientRect().top + scrollY - 140);
      await smooth(venue, 2000);
      await page.waitForTimeout(2600);
      const vpath = await page.video().path();
      await ctx.close();
      const mp4 = path.join(OUT, 'opening_390x844.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', vpath, '-vf', 'fps=30,scale=390:844:flags=lanczos', '-c:v', 'libx264',
        '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
      fs.rmSync(vdir, { recursive: true, force: true });
      results.info.video_kb = Math.round(fs.statSync(mp4).size / 1024);
      ok(`recording: previews/g038/opening_390x844.mp4 (${results.info.video_kb} KB) — tap → opening → home → story → details`);
    }

    // ---------------------------------------------------------------- side-by-side with the approved G035 demo (390 px)
    for (const name of PAGES) {
      const a = path.join(G035, `website_html_${name}_390px.png`), b = path.join(OUT, `${name}_390.png`);
      fs.rmSync(path.join(OUT, `compare_${name}_390.png`), { force: true });
      if (!fs.existsSync(a) || !fs.existsSync(b)) continue;
      execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
a, b = Image.open(sys.argv[1]).convert('RGB'), Image.open(sys.argv[2]).convert('RGB')
h = max(a.height, b.height)
s = Image.new('RGB', (a.width + b.width + 12, h + 28), 'white')
s.paste(a, (0, 28)); s.paste(b, (a.width + 12, 28))
d = ImageDraw.Draw(s); d.text((8, 8), 'G035 demo', fill='black'); d.text((a.width + 20, 8), 'G038 platform theme', fill='black')
s.thumbnail((900, 4000)); s.save(sys.argv[3], quality=84, optimize=True)
`, a, b, path.join(OUT, `compare_${name}_390.jpg`)]);
    }
  } catch (e) {
    err('run: ' + (e && e.stack || e));
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
    fs.rmSync(dataDir, { recursive: true, force: true });
  }

  fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(results, null, 1) + '\n');
  console.log(`\n${results.passed.length} passed, ${results.errors.length} failed, ${results.warnings.length} warnings → ${path.relative(ROOT, path.join(OUT, "checks.json"))}`);
  if (results.errors.length) {
    console.error(`--- server log (tail) ---\n${serverLog.slice(-3000)}`);
    process.exit(1);
  }
})();
