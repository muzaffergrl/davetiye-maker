#!/usr/bin/env node
// Browser checks + previews of a platform theme on the real platform (production build, `next start`) — G038, G052.
//
//   npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs [--theme <id>] [--out <dir>]
//       [--compare w1|g035|none] [--content <record.json>] [--photos <dir>] [--collection <dir>] [--no-video]
//
// --theme defaults to blush-garden-rose (design 03). Everything theme-specific is read from the theme (G052,
// scripts/lib/theme-env.ts): theme.json (pages, photo slots), img/manifest.json (free_zone of the painted cards, the
// optional "theme_check" table), the <title data-text> of each template, the page's Google Fonts <link>, the theme's own demo
// record (content.demo.json → bundled copy → collection record) and its PAKET 2 sample photos
// (collections/<NN_*>/assets/gpt/photos/, found through tools/katalog.py). Selectors come from the standard
// (docs/11_TEMA_STANDARDI.md §3: .stage, [data-skip], [data-enter], .replay, .site-nav, [data-slot]/.ph-mark,
// [data-countdown]/.cd-done, [data-rsvp…], a[href="#reply"], data-scene/data-step), not from one design.
//
// Seeds into a temporary data folder (platform/.data is not touched):
//   <names>-and-<names>  demo record + the sample photos (published)               → the designed look
//   no-photos            demo record without photos (published)                     → placeholder state
//   draft-site           demo record, draft                                         → preview-key navigation
// Uses the globally installed Playwright (NODE_PATH=/opt/node22/lib/node_modules or the absolute path below) and the
// browsers in /opt/pw-browsers; never runs `playwright install`.
//
// Checks (exit code 1 on any error):
//   0 setup: the 5 standard photo slots and their seeded sample photos, <title data-text> on every page, Google Fonts
//     (≤ 3 families, display=swap)
//   each page at 360/390/430/768/1280:
//   1 no horizontal scroll, no text outside the viewport, no element past the edge that nothing clips
//   2 every <img> loaded, no console/CSP error, no failed request
//   3 every [data-field] / <title> equals the site's content record (formatted here, independently of the engine)
//   4 card text stays on the plain paper of the GPT card (img/manifest.json free_zone), never over painted decor
//   5 photo slots: user photos on the demo site, placeholders on the no-photos site ("Your photo here" only in a preview);
//     every theme.json slot is on some page
//   6 the Google Fonts families of the page's <link> loaded (warning otherwise)
// Flows (390×844): envelope → home (card transition flag) → story via the nav; back → opened envelope + replay;
//   skip; reduced motion; per-site session keys; preview key kept through the opening; countdown (target + clock);
//   missing links send nothing; RSVP: a reply is stored and thanked, in a preview nothing is sent; the /start theme
//   demo (not for internal themes); a content change in the data shows after reload; first-view weight (DPR 3) with
//   placeholders (≤ 1.5 MB, error) and with the seeded sample photos (≤ 1.5 MB, else a warning: platform matter, docs/11 §6).
// Short phones (360×640, 375×553, 390×690, 390×844): the envelope texts (h1 + p outside the .stage; "Replay" when
//   opened) sit on the plain painted ground, not on painted decor (measured on the backdrop with the text hidden);
//   no horizontal scroll closed or opened; the closed envelope (.stage) and its "Tap to open" hint on screen.
// Output: <out>/<page>_390.png (+ index/home at every width, details_1280), *_placeholder.png,
//   details_390_changed_content.png, compare_<page>_390.jpg, opening_390x844.mp4, checks.json.
//   <out> = --out, else THEME_SHOTS_DIR, else previews/g038 (blush-garden-rose), previews/g4NN (catalog design NN),
//   else a temporary folder (printed).
//   compare_<page>_390.jpg: --compare w1 (default) = W1 comp (collections/<NN_*>/assets/gpt/comps/web_<n>_<page>.png,
//   plain names only) | theme; --compare g035 (default for blush-garden-rose, which has no W1 comps) = the approved
//   G035 demo | theme.
// Theme-specific expectations a theme cannot express through the standard markers go into img/manifest.json "theme_check"
// (cards, particles, envelope_text, backdrop) — see scripts/lib/theme-env.ts.

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPO = path.resolve(ROOT, '..');
const G035 = path.join(REPO, 'collections/03_Blush_Garden_Rose/website/previews');
const PORT = Number(process.env.PORT || 3312);
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'];
const WIDTHS = [360, 390, 430, 768, 1280];
const STEP = { index: 1, home: 2, story: 3, details: 4, rsvp: 5 };

const results = { base: 'next start (production build)', theme: null, errors: [], warnings: [], passed: [], info: {} };
const err = (m) => { results.errors.push(m); console.log('FAIL  ' + m); };
const warn = (m) => { results.warnings.push(m); console.log('WARN  ' + m); };
const ok = (m) => { results.passed.push(m); console.log('PASS  ' + m); };

(async () => {
  const lib = await import('./lib/theme-env.ts');
  const { loadChromium, startNext, waitForServer, markCards } = await import('./lib/browser.ts');
  const chromium = loadChromium();

  let args, env;
  try {
    args = lib.themeArgs();
    env = lib.loadThemeEnv(args);
  } catch (e) {
    console.error(`theme-check: ${e && e.message || e}`);
    process.exit(2);
  }
  const THEME = env.id;
  const PROFILE = env.profile;
  const DEMO_CONTENT = env.demo;
  const VIDEO = args.video;
  const COMPARE = args.compare || (THEME === 'blush-garden-rose' ? 'g035' : 'w1');
  if (!['w1', 'g035', 'none'].includes(COMPARE)) {
    console.error(`theme-check: --compare must be w1, g035 or none (not "${COMPARE}")`);
    process.exit(2);
  }
  const OUT = args.out ? path.resolve(args.out) : process.env.THEME_SHOTS_DIR
    || (THEME === 'blush-garden-rose' ? path.join(ROOT, 'previews', 'g038')
      : env.catalog ? path.join(ROOT, 'previews', `g4${String(env.catalog.no).padStart(2, '0')}`)
        : fs.mkdtempSync(path.join(os.tmpdir(), `theme-check-${THEME}-`)));
  results.theme = THEME;
  results.info.setup = {
    collection: env.collectionDir ? path.relative(REPO, env.collectionDir) : null, demo_record: env.demoSource,
    photos: env.photosSource || null, w1_comps: Object.keys(env.comps), compare: COMPARE, checks_table: PROFILE.source,
    cards: PROFILE.cards || `auto (${Object.keys(PROFILE.freeZones).join(', ') || 'no free_zone in img/manifest.json'})`,
    fonts: env.fonts.families.map((f) => `${f.family}${f.variants.length ? ' ' + f.variants.join('/') : ''}`),
  };
  console.log(`theme ${THEME} · demo record ${env.demoSource} · photos ${env.photosSource || 'none'} · out ${path.relative(process.cwd(), OUT) || OUT}`);
  env.notes.forEach((n) => warn(`setup: ${n}`));

  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('No production build: run `npm run build` first.');
    process.exit(2);
  }
  fs.mkdirSync(OUT, { recursive: true });

  // ------------------------------------------------------------------ data helpers
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), `platform-theme-check-`));
  const contentFile = path.join(dataDir, 'demo-content.json');
  fs.writeFileSync(contentFile, JSON.stringify(DEMO_CONTENT));
  function seed(extra) {
    const photos = env.photosDir && !extra.includes('--no-photos') ? ['--photos', env.photosDir] : [];
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/seed.ts'), '--theme', THEME, '--content', contentFile, ...photos, ...extra], {
      cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, SEED_BASE_URL: BASE }, stdio: 'pipe',
    });
    return JSON.parse(fs.readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8'));
  }
  function readSite(id) {
    return JSON.parse(fs.readFileSync(path.join(dataDir, 'sites', `${id}.json`), 'utf8'));
  }
  /** Changes the stored draft through the adapter and re-publishes (same path the panel will use). */
  function editAndPublish(id, patch) {
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

  // ------------------------------------------------------------------ setup checks (theme files, before the browser)
  {
    const keys = Object.keys(env.manifest.photos);
    const std = lib.STANDARD_PHOTO_KEYS;
    if (keys.length !== std.length || !std.every((k) => keys.includes(k))) err(`theme.json photo slots ${keys.join(', ')} ≠ the standard keys ${std.join(', ')} (docs/11 §2: = PAKET 2 file names)`);
    const noText = PAGES.filter((p) => env.titles[p].kind !== 'text');
    if (noText.length) err(`<title data-text="…"> missing on ${noText.map((p) => `${p} (${env.titles[p].kind}${env.titles[p].kind === 'static' ? ` "${env.titles[p].value}"` : ''})`).join(', ')} (docs/11 §3.1)`);
    const f = env.fonts;
    const fontProblems = [];
    if (!f.href) fontProblems.push('no Google Fonts <link> on index');
    if (f.families.length > 3) fontProblems.push(`${f.families.length} families > 3`);
    if (f.href && f.display !== 'swap') fontProblems.push(`display=${f.display} (swap expected)`);
    if (fontProblems.length) err(`fonts: ${fontProblems.join('; ')} (docs/11 §3.1, §6)`);
    else ok(`fonts: Google Fonts link with ${f.families.length} families (${f.families.map((x) => x.family).join(', ')}), display=swap`);
  }

  // ------------------------------------------------------------------ in-page checks
  // lazy images that are hidden on this layout (e.g. land-only decor on phones) never load by themselves: load them so
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
    await markCards(page, PROFILE);
    const r = await page.evaluate(({ FZ, PARTICLES }) => {
      const out = { hscroll: document.documentElement.scrollWidth - window.innerWidth, offscreen: [], bleed: [], zone: [] };
      const vw = window.innerWidth;
      for (const el of document.querySelectorAll('body *')) {
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]')) continue;
        if (el.closest('[data-rsvp-honeypot]')) continue;   // platform honeypot: off screen and aria-hidden on purpose
        const b = el.getBoundingClientRect();
        if (!b.width) continue;
        if (b.right > vw + 0.5 || b.left < -0.5) out.offscreen.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 28)}" [${Math.round(b.left)}..${Math.round(b.right)}]`);
      }
      for (const el of document.querySelectorAll('body *')) {
        if ((PARTICLES && el.closest(PARTICLES)) || el.closest('[data-rsvp-honeypot]')) continue;
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
      out.slots = [...document.querySelectorAll('[data-slot]')].map((s) => {
        const img = s.matches('img[data-photo]') ? s : s.querySelector('img[data-photo]');
        const mark = s.querySelector('.ph-mark');
        const mcs = mark && getComputedStyle(mark);
        return { key: s.dataset.slot, state: s.dataset.photoState, src: img ? img.getAttribute('src') : null, loaded: Boolean(img && img.naturalWidth > 0),
          mark: mark ? (mcs.display !== 'none' && mcs.visibility !== 'hidden' ? 'shown' : 'none') : 'missing' };
      });
      out.siteData = !!document.getElementById('site-data');
      out.js = document.documentElement.dataset.js;
      // text on painted cards must stay inside the plain-paper zone of the GPT image (cards marked by markCards)
      out.cards = 0;
      out.cardKeys = [];
      for (const card of document.querySelectorAll('[data-qa-card]')) {
        const key = card.getAttribute('data-qa-card');
        const img = [...card.querySelectorAll('[data-qa-card-img]')][0];
        const cb = (img || card).getBoundingClientRect();
        if (!cb.width || !FZ[key]) continue;
        out.cards++;
        out.cardKeys.push(key);
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.photo-slot, [data-slot]')) continue;
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
      // fonts: the families of this page's own Google Fonts link
      out.fonts = {};
      const link = document.querySelector('link[rel="stylesheet"][href^="https://fonts.googleapis.com/css"]');
      out.fontLink = Boolean(link);
      if (link) for (const fam of new URL(link.href).searchParams.getAll('family')) { const f = fam.split(':')[0].replace(/\+/g, ' '); out.fonts[f] = document.fonts.check(`16px "${f}"`); }
      return out;
    }, { FZ: PROFILE.freeZones, PARTICLES: PROFILE.particles });

    const bad = [];
    const name = tag.split('@')[0];
    if (r.hscroll > 0) bad.push(`horizontal scroll ${r.hscroll}px`);
    r.offscreen.forEach((x) => bad.push(`text off screen ${x}`));
    r.bleed.slice(0, 6).forEach((x) => bad.push(`element past the edge ${x}`));
    r.broken.forEach((x) => bad.push(`image not loaded ${x}`));
    r.zone.forEach((x) => bad.push(`card text over painted decor ${x}`));
    if (!r.siteData) bad.push('no #site-data');
    if (env.jsReadyFlag && r.js !== 'ready') bad.push('site.js did not finish (data-js != ready)');
    if (!r.fontLink && once(`${name}:font`)) bad.push('no Google Fonts <link> (docs/11 §3.1; reported once per page)');
    const wantTitle = lib.expectedTitle(env.titles[name], content);
    if (r.title !== wantTitle) bad.push(`title "${r.title}" ≠ "${wantTitle}"`);
    let n = 0;
    for (const f of r.fields) {
      if (f.tag === 'IMG') continue;
      if (f.field.startsWith('urls.')) {
        const v = lib.getPath(content, f.field);
        if (v ? f.href !== v : f.href !== '#' || !f.missing) bad.push(`${f.field}: href ${f.href}`);
        continue;
      }
      const want = lib.fieldValue(content, f.field, f.format);
      n++;
      if (f.text !== want) bad.push(`${f.field}${f.format ? '/' + f.format : ''}: "${f.text}" ≠ "${want}"`);
    }
    for (const s of r.slots) {
      if (s.mark === 'missing' && once(`${name}:${s.key}:mark`)) bad.push(`photo slot ${s.key}: no .ph-mark ("Your photo here" label, docs/11 §9; reported once per page)`);
      if (!s.src) { if (once(`${name}:${s.key}:img`)) bad.push(`photo slot ${s.key}: no img[data-photo] inside (docs/11 §9)`); continue; }
      if (photoMode === 'user' && (s.state !== 'user' || !s.src.startsWith('/media/') || s.mark === 'shown')) bad.push(`photo ${s.key}: ${JSON.stringify(s)}`);
      // public page: the neutral placeholder image only; the "Your photo here" label is for the couple's preview
      const wantMark = photoMode === 'preview-placeholder' ? 'shown' : 'none';
      if (photoMode.endsWith('placeholder') && (s.state !== 'placeholder' || !/\/img\/ph_/.test(s.src) || (s.mark !== 'missing' && s.mark !== wantMark))) bad.push(`placeholder ${s.key}: ${JSON.stringify(s)}`);
      if (!s.loaded) bad.push(`photo ${s.key} not loaded`);
    }
    Object.entries(r.fonts).forEach(([f, v]) => { if (!v) warn(`${tag}: Google font not loaded (${f}) — fallback font shown`); });
    r.cardKeys.forEach((k) => cardsSeen.add(k));
    r.slots.forEach((s) => slotsSeen.add(s.key));
    if (bad.length) bad.forEach((b) => err(`${tag}: ${b}`));
    else ok(`${tag}: no overflow, ${n} fields = content record, title ok, images loaded, ${r.cards ? `text on ${r.cards} card${r.cards > 1 ? 's' : ''} on paper` : 'no painted card'}, ${r.slots.length ? `${r.slots.length} photo slot${r.slots.length > 1 ? 's' : ''} ${photoMode}` : 'no photo slot'}`);
    return r;
  }
  const cardsSeen = new Set();
  const slotsSeen = new Set();
  // structural problems of a template (a missing marker) are reported once per page, not at every width
  const reported = new Set();
  const once = (key) => !reported.has(key) && Boolean(reported.add(key));

  const demo = seed(['--slug', lib.demoSlug(DEMO_CONTENT, 'demo-site')]);
  const nophoto = seed(['--slug', 'no-photos', '--no-photos']);
  const draft = seed(['--slug', 'draft-site', '--draft', '--no-photos']);
  const demoContent = () => readSite(demo.siteId).publishedContent;
  results.info.seed_photos = demo.photos;
  {
    const slots = Object.keys(env.manifest.photos).length;
    if (demo.photos.length === slots) ok(`seed: ${slots} sample photos uploaded to the demo site (${env.photosSource})`);
    else err(`seed: ${demo.photos.length} of ${slots} photo slots got a sample photo from ${env.photosSource || 'no folder'} — file names must be the slot keys (${Object.keys(env.manifest.photos).join(', ')})`);
  }

  const server = startNext({ port: PORT, dataDir });

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
    const flattenNav = (page) => page.evaluate((PARTICLES) => {
      if (PARTICLES) document.querySelectorAll(PARTICLES).forEach((l) => l.remove());
      const n = document.querySelector('.site-nav');
      if (n && getComputedStyle(n).bottom === '0px') { n.style.position = 'absolute'; n.style.bottom = 'auto'; n.style.top = (document.documentElement.scrollHeight - n.offsetHeight) + 'px'; }
    }, PROFILE.particles);
    /** Runs one flow; a missing element fails that flow (with its message) instead of the whole run. */
    /** Throws a readable error when a standard element is missing (instead of a click timeout). */
    const need = async (page, sel, what) => { if (!(await page.$(sel))) throw new Error(`no ${sel} — ${what}`); };
    const flow = async (label, fn) => {
      try { await fn(); } catch (e) { err(`${label}: ${String(e && e.message || e).split('\n')[0]}`); }
    };
    const hasStory = DEMO_CONTENT.optional_blocks && DEMO_CONTENT.optional_blocks.our_story === true;
    const rsvpOn = !(DEMO_CONTENT.rsvp && DEMO_CONTENT.rsvp.method);

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
    const freeKeys = Object.keys(PROFILE.freeZones);
    {
      const keys = Object.keys(env.manifest.photos);
      const unused = keys.filter((k) => !slotsSeen.has(k));
      const unknown = [...slotsSeen].filter((k) => !keys.includes(k));
      if (unused.length || unknown.length) err(`photo slots: ${unused.length ? `theme.json slot(s) ${unused.join(', ')} on no page` : ''}${unused.length && unknown.length ? '; ' : ''}${unknown.length ? `[data-slot] ${unknown.join(', ')} not in theme.json` : ''} (docs/11 §3.2, §9)`);
      else ok(`photo slots: every theme.json slot (${keys.join(', ')}) is on a page`);
    }
    const unchecked = freeKeys.filter((k) => !cardsSeen.has(k));
    if (unchecked.length) (unchecked.length === freeKeys.length ? err : warn)(`free_zone of ${unchecked.join(', ')} never checked: no <img> of ${unchecked.length > 1 ? 'these parts' : 'this part'} found on any page (set img/manifest.json theme_check.cards if the card is not an <img>)`);

    // ---------------------------------------------------------------- placeholder state (no photos uploaded)
    {
      const ctx = await mk(390, 844);
      for (const name of PAGES) {
        const page = await ctx.newPage();
        const problems = watch(page);
        await page.goto(url(nophoto.slug, name), { waitUntil: 'load' });
        await eager(page);
        if (name === 'index') await page.waitForTimeout(900); else await revealAll(page);
        await pageChecks(page, `${name}@390 (no photos)`, readSite(nophoto.siteId).publishedContent, 'placeholder');
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
      await pageChecks(page, 'home@390 (draft preview, no photos)', readSite(draft.siteId).content, 'preview-placeholder');
      await ctx.close();
    }

    // ---------------------------------------------------------------- short phones: envelope text never on painted decor
    await flow('short phones', async () => {
      const sharp = require(path.join(ROOT, 'node_modules/sharp'));
      const { edge_max: EDGE, dark_max: DARK, dark_below: BELOW, light_above: ABOVE = 256 } = PROFILE.backdrop;
      const busy = async (page, sel) => {
        const boxes = await page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((el) => !el.closest('.stage, [data-skip], .nojs-only, [hidden]')).map((el) => {
          const b = el.getBoundingClientRect();
          return b.width && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden' ? { sel: el.className || el.tagName, x: b.left, y: b.top, w: b.width, h: b.height } : null;
        }).filter(Boolean), sel);
        // the backdrop alone under each text box: text, envelope and Enter button hidden
        await page.addStyleTag({ content: 'body * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; } .stage, [data-enter] { visibility: hidden !important; }' });
        const png = await page.screenshot();
        const out = [];
        for (const b of boxes) {
          const left = Math.max(0, Math.round(b.x)), top = Math.max(0, Math.round(b.y));
          const meta = await sharp(png).metadata();
          const width = Math.min(Math.round(b.w), meta.width - left), height = Math.min(Math.round(b.h), meta.height - top);
          if (width < 2 || height < 1) continue;
          const { data, info } = await sharp(png).extract({ left, top, width, height }).greyscale().raw().toBuffer({ resolveWithObject: true });
          let edge = 0, dark = 0;
          for (let y = 0; y < info.height; y++) for (let x = 1; x < info.width; x++) edge += Math.abs(data[y * info.width + x] - data[y * info.width + x - 1]);
          for (const v of data) if (v < BELOW || v > ABOVE) dark++;
          out.push({ box: String(b.sel).slice(0, 24), edge: edge / (info.height * (info.width - 1)), dark: dark / data.length });
        }
        return out;
      };
      const measured = [];
      for (const [w, h] of [[360, 640], [375, 553], [390, 690], [390, 844]]) {
        for (const state of ['closed', 'opened']) {
          const ctx = await mk(w, h);
          const page = await ctx.newPage();
          if (state === 'opened') await page.addInitScript((slug) => sessionStorage.setItem('invite:opened:' + slug, '1'), nophoto.slug);
          await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(900);
          const sel = state === 'closed' ? PROFILE.envelopeText.closed : PROFILE.envelopeText.opened;
          // docs/11 §13.3: no horizontal scroll (an opened gatefold/book must not widen the page); closed: the envelope
          // and its "Tap to open" hint on screen
          const fit = await page.evaluate(() => {
            const vis = (el) => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return b.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' ? b : null; };
            const stage = document.querySelector('.stage');
            const sb = stage && vis(stage);
            const hint = [...document.querySelectorAll('body *')].find((el) => el.children.length === 0 && /\b(tap|click) to open\b/i.test(el.textContent) && vis(el));
            const hb = hint && hint.getBoundingClientRect();
            return { hscroll: document.documentElement.scrollWidth - innerWidth, stage: sb ? sb.top >= -1 && sb.bottom <= innerHeight + 1 : null,
              hint: hb ? hb.top >= 0 && hb.bottom <= innerHeight + 1 : null };
          });
          if (fit.hscroll > 0) err(`envelope ${state} @${w}×${h}: horizontal scroll ${fit.hscroll}px`);
          if (state === 'closed' && fit.stage === false) err(`envelope closed @${w}×${h}: the closed envelope (.stage) is not entirely on screen`);
          if (state === 'closed' && fit.hint === false) err(`envelope closed @${w}×${h}: "Tap to open" is below the screen`);
          if (state === 'closed' && fit.hint === null && once('hint')) warn('envelope: no visible "Tap to open" / "Click to open" hint found on the index page');
          const all = await busy(page, sel);
          measured.push({ at: `${w}x${h}`, state, boxes: all.map((x) => ({ ...x, edge: +x.edge.toFixed(2), dark: +x.dark.toFixed(3) })) });
          // calibrated on 03: plain wash edge ≤ 1.3 / dark ≤ 0.03; over florals edge ≥ 2.7 or dark ≥ 0.06 (before the fix)
          const hits = all.filter((r) => r.edge > EDGE || r.dark > DARK);
          if (!all.length) err(`envelope ${state} @${w}×${h}: no text found for "${sel}" (${state === 'closed' ? 'names, kicker, hint outside the .stage' : 'the .replay button, docs/11 §3.2'})`);
          else if (hits.length) err(`envelope ${state} @${w}×${h}: text over painted decor ${JSON.stringify(hits)}`);
          else ok(`envelope ${state} @${w}×${h}: ${state === 'closed' ? `${all.length} texts (${all.map((x) => x.box.split(' ')[0]).join(', ')})` : '"Replay the opening"'} on the plain painted ground${state === 'closed' && fit.stage && fit.hint ? ', envelope and hint on screen' : ''}`);
          await ctx.close();
        }
      }
      results.info.envelope_backdrop = measured;
    });

    // ---------------------------------------------------------------- touch targets of the small links (≥ 44 px)
    await flow('touch targets', async () => {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      const targets = [];
      await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
      await need(page, '[data-skip]', 'the Skip link of the envelope page (docs/11 §3.2)');
      targets.push(['envelope Skip', await page.evaluate(() => { const b = document.querySelector('[data-skip]').getBoundingClientRect(); return [b.width, b.height]; })]);
      for (const name of ['home', ...(rsvpOn ? ['rsvp'] : [])]) {
        await page.goto(url(nophoto.slug, name), { waitUntil: 'load' });
        // the hit area (e.g. ::after) may reach above and below the text: probe 10 px outside it
        const hit = await page.evaluate(() => {
          const a = [...document.querySelectorAll('a[href*="replay=1"]')].at(-1);
          if (!a) return null;
          a.scrollIntoView({ block: 'center', behavior: 'instant' });   // the theme may scroll smoothly otherwise
          const b = a.getBoundingClientRect();
          const probe = (y) => document.elementFromPoint(b.left + b.width / 2, y)?.closest('a') === a;
          return probe(b.top - 10) && probe(b.bottom + 10) ? [b.width, b.height + 28] : [b.width, b.height];
        });
        if (!hit) err(`${name}: no "Replay the envelope" link (a[href="index.html?replay=1"], docs/11 §3.1)`);
        else targets.push([`${name} "Replay the envelope"`, hit]);
      }
      const small = targets.filter(([, [w, h]]) => w < 44 || h < 44);
      if (small.length) err(`touch targets under 44 px: ${JSON.stringify(small)}`);
      else ok(`touch targets ≥ 44 px: ${targets.map(([n, [w, h]]) => `${n} ${Math.round(w)}×${Math.round(h)}`).join(', ')}`);
      await ctx.close();
    });

    // ---------------------------------------------------------------- opening flow: envelope → home → story; back; replay
    await flow('opening flow', async () => {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      page.setDefaultTimeout(10000);
      const problems = watch(page);
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      await page.waitForTimeout(600);
      await need(page, '.stage', 'the envelope stage (role=button, docs/11 §3.2)');
      const t0 = Date.now();
      await page.click('.stage');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 9000 });
      results.info.envelope_to_home_ms = Date.now() - t0;
      const arrive = await page.evaluate(() => document.documentElement.classList.contains('from-envelope'));
      if (!arrive) err('envelope → home: no from-envelope flag (card transition)'); else ok(`envelope → /${demo.slug}/home in ${results.info.envelope_to_home_ms} ms, card transition flag set`);
      await page.waitForTimeout(5200);
      // the first scene of home (hero) has entered completely: every step visible (or not shown on this layout)
      const hero = await page.evaluate(() => {
        const scene = document.querySelector('[data-scene]');
        const steps = scene ? [...scene.querySelectorAll('[data-step]')] : [];
        return { scene: scene ? scene.getAttribute('data-scene') : null, steps: steps.length,
          hidden: steps.filter((e) => getComputedStyle(e).opacity !== '1' && getComputedStyle(e).display !== 'none').map((e) => e.getAttribute('data-step')) };
      });
      if (!hero.scene) warn('home: no [data-scene] (docs/11 §8): the sequential entrance is not checked');
      else if (hero.hidden.length) err(`home ${hero.scene}: still hidden after the sequential entrance: ${hero.hidden.join(', ')}`); else ok(`home first scene (${hero.scene}): sequential entrance finished (${hero.steps} steps)`);
      const want = lib.expectedCountdownUtc(demoContent());
      const target = await page.evaluate(() => { const c = document.querySelector('[data-countdown]'); return c ? c.dataset.targetUtc || null : 'no [data-countdown]'; });
      if (!DEMO_CONTENT.optional_blocks.countdown || !want) warn(`countdown not checked: the demo record has ${DEMO_CONTENT.optional_blocks.countdown ? 'no readable date/ceremony time/time zone' : 'the countdown off'}`);
      else if (target !== want) err(`countdown target ${target} ≠ ${want}`);
      else ok(`countdown target from the platform: ${demoContent().date} ${demoContent().ceremony_time} ${demoContent().timezone} = ${want.slice(0, 16).replace('T', ' ')} UTC`);
      const next = hasStory ? 'story' : 'details';
      await page.click(`.site-nav a[href$="/${next}"]`);
      await page.waitForURL(`${BASE}/${demo.slug}/${next}`, { timeout: 6000 });
      ok(`home → ${next} through the nav (/<slug>/${next})`);
      await page.goBack();
      await page.waitForURL(`${BASE}/${demo.slug}/home`);
      await page.goBack();
      await page.waitForURL(`${BASE}/${demo.slug}`);
      await page.waitForTimeout(800);
      const back = await page.evaluate(() => {
        const shown = (sel) => { const el = document.querySelector(sel); if (!el) return false; const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0; };
        return { opened: document.documentElement.classList.contains('is-opened'), enter: shown('[data-enter]'), replay: shown('.replay') };
      });
      if (!back.opened || !back.enter || !back.replay) err(`back to the envelope: ${JSON.stringify(back)}`); else ok('back to the envelope: opened state with "Enter" + "Replay the opening" (no forced replay)');
      await need(page, '.replay', 'the "Replay the opening" button (docs/11 §3.2)');
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
      if (!rsvpOn) {
        warn('RSVP flow not checked: the demo record collects replies another way (rsvp.method)');
      } else {
        // RSVP (platform form contract, G042): the card button jumps to the form; a reply is stored for this site
        await page.goto(url(demo.slug, 'rsvp'), { waitUntil: 'load' });
        await page.waitForTimeout(2600);
        await need(page, 'a[href="#reply"]', 'the RSVP card button to the form (docs/11 §3.2)');
        await need(page, '[data-rsvp-form]', 'the reply form (docs/11 §3.3)');
        await page.click('a[href="#reply"]');
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
          return { slot: slot && slot.textContent, invalid: n.getAttribute('aria-invalid'), linked: Boolean(slot) && (n.getAttribute('aria-describedby') || '').split(' ').includes(slot.id), focus: document.activeElement === n };
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
        // after a reply, no visible text outside the reply box repeats (or contradicts) the thank-you (docs/11 §3.2)
        const closing = await page.evaluate(() => {
          const norm = (s) => s.toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
          const panel = document.querySelector('[data-rsvp-state="success"]');
          const lines = [...panel.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim() && !e.closest('[hidden]') && getComputedStyle(e).display !== 'none').map((e) => norm(e.textContent));
          const box = document.querySelector('[data-rsvp]');
          const repeats = [...document.querySelectorAll('body *')].filter((e) => {
            if (box.contains(e) || e.children.length || !e.textContent.trim()) return false;
            const cs = getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden' || e.closest('[hidden]') || !e.getBoundingClientRect().width) return false;
            const t = norm(e.textContent);
            return /^thank you/.test(t) || lines.some((l) => l.length > 6 && (t === l || t.startsWith(l) || l.startsWith(t) && t.length > 6));
          }).map((e) => e.textContent.trim().slice(0, 40));
          return { replied: document.documentElement.hasAttribute('data-rsvp-replied'), repeats };
        });
        if (!closing.replied || closing.repeats.length) err(`RSVP: after a reply the page repeats the thank-you (${JSON.stringify(closing)}; html[data-rsvp-replied] + hide it, docs/11 §3.2)`);
        else ok('RSVP: after a reply the closing section does not repeat or contradict the thank-you');
        await page.evaluate((PARTICLES) => { if (PARTICLES) document.querySelectorAll(PARTICLES).forEach((l) => l.remove()); }, PROFILE.particles);
        await (await page.$('[data-rsvp]')).screenshot({ path: path.join(OUT, 'rsvp_390_reply_sent.png') });
        await page.click('[data-rsvp-again]');
        if (await page.evaluate(() => document.querySelector('[data-rsvp-form]').hidden)) err('RSVP: "Send another reply" does not reopen the form');
        else ok('RSVP: "Send another reply" reopens the form');
      }
      // the theme demo on /start: its RSVP page asks no status from a site that does not exist (no 404, no console error)
      if (env.internal) {
        warn('theme demo RSVP page (/start/demo/…/rsvp): skipped — internal themes are not on /start');
      } else {
        const demoPage = await ctx.newPage();
        const demoProblems = watch(demoPage);
        const res = await demoPage.goto(`${BASE}/start/demo/${THEME}/${rsvpOn ? 'rsvp' : 'home'}?preview=demo`, { waitUntil: 'load' });
        await demoPage.waitForTimeout(800);
        if (res.status() !== 200 || demoProblems.length) err(`theme demo ${rsvpOn ? 'RSVP' : 'home'} page: ${res.status()} ${demoProblems.join(' | ')}${res.status() === 404 ? ' — the theme is not on /start: it needs its own valid content.demo.json (docs/11 §2.1)' : ''}`);
        else ok(`theme demo ${rsvpOn ? 'RSVP' : 'home'} page (/start/demo/…/${rsvpOn ? 'rsvp' : 'home'}): no 404, no console error`);
        await demoPage.close();
      }
      const external = reqs.filter((u) => !u.startsWith(BASE) && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u) && !u.startsWith('data:'));
      if (external.length) err(`external requests: ${external.join(', ')}`); else ok('external requests: Google Fonts only');
      problems.forEach((p) => err(`opening flow: ${p}`));
      await ctx.close();
    });
    await flow('skip / session keys / countdown clock', async () => {
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      page.setDefaultTimeout(10000);
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      await need(page, '[data-skip]', 'the Skip link of the envelope page (docs/11 §3.2)');
      await page.click('[data-skip]');
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 4000 });
      ok('Skip → home');
      // per-site session keys: the other site's envelope is still closed
      await page.goto(url(nophoto.slug, 'index'), { waitUntil: 'load' });
      const other = await page.evaluate(() => document.documentElement.classList.contains('is-opened'));
      if (other) err('session key leaked: another site on the same origin starts opened'); else ok('per-site session keys: another site on the same origin starts with a closed envelope');
      const target = lib.expectedCountdownUtc(demoContent());
      if (target && DEMO_CONTENT.optional_blocks.countdown) {
        // an hour after the start (same local day) → "today"; five days later → "after"
        const t = Date.parse(target);
        const sameDay = (ms) => new Date(ms).toLocaleDateString('en-CA', { timeZone: demoContent().timezone }) === demoContent().date;
        const today = sameDay(t + 3600e3) ? t + 3600e3 : t + 60e3;
        for (const [when, iso] of [['today', new Date(today).toISOString()], ['after', new Date(t + 5 * 86400e3).toISOString()]]) {
          const p2 = await ctx.newPage();
          await p2.clock.install({ time: new Date(iso) });
          await p2.goto(url(demo.slug, 'home'), { waitUntil: 'load' });
          await p2.waitForTimeout(300);
          const shown = await p2.evaluate(() => [...document.querySelectorAll('.cd-done')].filter((p) => !p.hidden && getComputedStyle(p).display !== 'none').map((p) => p.dataset.when + ': ' + p.textContent));
          if (shown.length !== 1 || !shown[0].startsWith(when)) err(`countdown at ${iso}: ${JSON.stringify(shown)} (.cd-done[data-when="${when}"], docs/11 §3.2)`); else ok(`countdown after the start (${iso}) → "${shown[0]}"`);
          await p2.close();
        }
      }
      await ctx.close();
    });
    await flow('reduced motion', async () => {
      const ctx = await mk(390, 844, { reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(url(demo.slug, 'index'), { waitUntil: 'load' });
      await need(page, '.stage', 'the envelope stage (docs/11 §3.2)');
      const t0 = Date.now();
      await page.click('.stage', { timeout: 6000 });
      await page.waitForURL(`${BASE}/${demo.slug}/home`, { timeout: 4000 });
      const dt = Date.now() - t0;
      const allVisible = await page.evaluate(() => [...document.querySelectorAll('[data-step]')].every((e) => getComputedStyle(e).opacity === '1'));
      if (dt > 1500 || !allVisible) err(`reduced motion: ${dt} ms, all visible=${allVisible}`); else ok(`prefers-reduced-motion: straight to home without animation (${dt} ms), everything visible`);
      await ctx.close();
    });
    await flow('draft preview', async () => {
      // draft + preview key: the opening and the nav keep ?preview=
      const ctx = await mk(390, 844);
      const page = await ctx.newPage();
      page.setDefaultTimeout(10000);
      const q = `?preview=${draft.previewKey}`;
      const pub = await page.goto(url(draft.slug, 'index'));
      if (pub.status() !== 404) err(`draft without key: ${pub.status()}`);
      await page.goto(url(draft.slug, 'index', q), { waitUntil: 'load' });
      await need(page, '.stage', 'the envelope stage (docs/11 §3.2)');
      await page.click('.stage');
      await page.waitForURL(`${BASE}/${draft.slug}/home${q}`, { timeout: 9000 });
      await page.click('.site-nav a[href*="/details"]');
      await page.waitForURL(`${BASE}/${draft.slug}/details${q}`, { timeout: 6000 });
      ok('draft preview: envelope → home → details keep ?preview=<key> (page map from #site-data)');
      if (rsvpOn) {
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
      }
      await ctx.close();
    });

    // ---------------------------------------------------------------- a content change in the data shows on the page
    await flow('content change', async () => {
      const errorsBefore = results.errors.length;
      const oldWords = lib.personalWords(demoContent());
      editAndPublish(demo.siteId, {
        'partners.0.display_name': 'Maren', 'partners.0.full_name': 'Maren Holloway', 'partners.1.display_name': 'Theo',
        'partners.1.full_name': 'Theo Castellan', name_display: 'Maren & Theo', date: '2028-09-23', 'rsvp.deadline': '2028-08-01',
        'venue.name': 'Larkspur Hall', 'venue.city': 'Bath', 'venue.region': null, 'venue.country': 'United Kingdom', timezone: 'Europe/London',
        schedule: [{ label: 'Welcome Drinks', time: '14:45' }, { label: 'Ceremony', time: '15:30', location: 'The Walled Garden' },
          { label: 'Dinner', time: '18:00', location: 'The Long Room' }, { label: 'Dancing', time: '20:30', location: 'The Ballroom' }],
        ceremony_time: '15:30',
      });
      const changed = demoContent();
      const oldRe = new RegExp(`\\b(${oldWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i');
      const ctx = await mk(390, 844);
      for (const name of PAGES) {
        if (name === 'story' && !hasStory) continue;
        if (name === 'rsvp' && !rsvpOn) continue;
        const page = await ctx.newPage();
        await page.goto(url(demo.slug, name), { waitUntil: 'load' });
        await eager(page);
        if (name === 'index') await page.waitForTimeout(600); else await revealAll(page);
        const r = await pageChecks(page, `${name}@390 (changed content)`, changed, 'user');
        const body = await page.evaluate(() => document.body.innerText);
        const left = oldRe.exec(body);
        if (left) err(`${name}: old content still visible after the change ("${left[0]}")`);
        if (name === 'details') {
          await flattenNav(page);
          await page.screenshot({ path: path.join(OUT, 'details_390_changed_content.png'), fullPage: true });
          if (r.fields.filter((f) => f.field.endsWith('.label') && f.field.startsWith('schedule')).length !== 4) err('details: 4 schedule rows expected');
        }
        await page.close();
      }
      if (results.errors.length === errorsBefore) ok('content change (names, date, venue, 4 schedule rows) → every page shows the new record after reload');
      await ctx.close();
    });

    // ---------------------------------------------------------------- first-view transfer (390×844, DPR 3): placeholders, then sample photos
    for (const [site, label] of [[nophoto, 'placeholders'], [demo, 'photos']]) {
      for (const name of ['index', 'home']) {
        const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
        const page = await ctx.newPage();
        let bytes = 0; const list = [];
        page.on('requestfinished', async (rq) => {
          try { const s = await rq.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; list.push([rq.url().replace(BASE, ''), s.responseBodySize]); } catch { /* ignore */ }
        });
        await page.goto(url(site.slug, name), { waitUntil: 'load' });
        await page.waitForTimeout(1200);
        const kb = Math.round(bytes / 1024);
        results.info[`first_view_${name}_kb_${label}`] = kb;
        results.info[`first_view_${name}_files${label === 'photos' ? '_photos' : ''}`] = list.sort((a, b) => b[1] - a[1]).slice(0, 8);
        const what = `${name} first view (390×844, DPR 3, ${label === 'photos' ? 'seeded sample photos' : 'placeholders'})`;
        if (bytes <= 1.5 * 1024 * 1024) ok(`${what}: ${kb} KB`);
        else if (label === 'placeholders') err(`${what}: ${kb} KB > 1536 KB`);
        else warn(`${what}: ${kb} KB > 1536 KB — the buyer's photo is one large file (platform matter, docs/11 §6, §14 #9)`);
        await ctx.close();
      }
    }

    // ---------------------------------------------------------------- recording 390×844 (original demo content)
    if (VIDEO) await flow('recording', async () => {
      const fresh = seed(['--slug', 'video-site']);
      const vdir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-check-video-'));
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
        recordVideo: { dir: vdir, size: { width: 390, height: 844 } } });
      const page = await ctx.newPage();
      page.setDefaultTimeout(10000);
      await page.goto(url(fresh.slug, 'index'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await need(page, '.stage', 'the envelope stage (docs/11 §3.2)');
      await page.tap('.stage');
      await page.waitForURL(`${BASE}/${fresh.slug}/home`, { timeout: 9000 });
      await page.waitForTimeout(4200);
      const smooth = (y, ms) => page.evaluate(async ([y, ms]) => {
        const y0 = window.scrollY, t0 = performance.now();
        await new Promise((res) => { (function f(t) { const k = Math.min(1, (t - t0) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; window.scrollTo(0, y0 + (y - y0) * e); if (k < 1) requestAnimationFrame(f); else res(); })(t0); });
      }, [y, ms]);
      // home: the invitation card (the painted card holding the names), then the link to the next page
      await markCards(page, PROFILE);
      const nextPage = hasStory ? 'story' : 'details';
      const spots = await page.evaluate((next) => {
        const top = (el) => el.getBoundingClientRect().top + scrollY;
        const H = document.documentElement.scrollHeight;
        const card = [...document.querySelectorAll('[data-qa-card]')].find((c) => c.querySelector('[data-field^="partners."]'));
        const link = [...document.querySelectorAll(`main a[href$="/${next}"]`)].find((a) => !a.closest('.site-nav'));
        if (link) link.setAttribute('data-qa-next', '');
        return { card: card ? top(card) - 20 : H * 0.3, link: link ? top(link) - 40 : H * 0.6, hasLink: Boolean(link) };
      }, nextPage);
      await smooth(spots.card, 1600);
      await page.waitForTimeout(3600);
      await smooth(spots.link, 1800);
      await page.waitForTimeout(2200);
      await page.tap(spots.hasLink ? '[data-qa-next]' : `.site-nav a[href$="/${nextPage}"]`);
      await page.waitForURL(`${BASE}/${fresh.slug}/${nextPage}`, { timeout: 6000 });
      await page.waitForTimeout(3000);
      await smooth(520, 1800);
      await page.waitForTimeout(2600);
      if (nextPage !== 'details') {
        await page.tap('.site-nav a[href$="/details"]');
        await page.waitForURL(`${BASE}/${fresh.slug}/details`, { timeout: 6000 });
        await page.waitForTimeout(2600);
      }
      const venue = await page.evaluate(() => { const v = document.querySelector('[data-slot="venue"]'); return v ? v.getBoundingClientRect().top + scrollY - 140 : document.documentElement.scrollHeight * 0.5; });
      await smooth(venue, 2000);
      await page.waitForTimeout(2600);
      const vpath = await page.video().path();
      await ctx.close();
      const mp4 = path.join(OUT, 'opening_390x844.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', vpath, '-vf', 'fps=30,scale=390:844:flags=lanczos', '-c:v', 'libx264',
        '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
      fs.rmSync(vdir, { recursive: true, force: true });
      results.info.video_kb = Math.round(fs.statSync(mp4).size / 1024);
      ok(`recording: ${path.relative(ROOT, mp4)} (${results.info.video_kb} KB) — tap → opening → home → ${nextPage}${nextPage !== 'details' ? ' → details' : ''}`);
    });

    // ---------------------------------------------------------------- side by side at 390 px: W1 comp (or the G035 demo) | theme
    const compared = [];
    for (const name of PAGES) {
      const b = path.join(OUT, `${name}_390.png`);
      const a = COMPARE === 'g035' ? path.join(G035, `website_html_${name}_390px.png`) : COMPARE === 'w1' ? env.comps[name] : null;
      fs.rmSync(path.join(OUT, `compare_${name}_390.png`), { force: true });
      if (COMPARE === 'none') continue;
      if (!a || !fs.existsSync(a) || !fs.existsSync(b)) {
        if (COMPARE === 'w1') warn(`compare_${name}_390.jpg not written: no W1 comp ${lib.COMP_NAMES[name]}${env.collectionDir ? ` in ${path.relative(REPO, env.collectionDir)}/assets/gpt/comps` : ' (no collection)'}`);
        continue;
      }
      const labels = COMPARE === 'g035' ? ['G035 demo', 'G038 platform theme'] : [`W1 comp ${path.basename(a)}`, `${THEME} theme`];
      execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
a, b = Image.open(sys.argv[1]).convert('RGB'), Image.open(sys.argv[2]).convert('RGB')
if a.width != b.width:
    a = a.resize((b.width, round(a.height * b.width / a.width)), Image.LANCZOS)
h = max(a.height, b.height)
s = Image.new('RGB', (a.width + b.width + 12, h + 28), 'white')
s.paste(a, (0, 28)); s.paste(b, (a.width + 12, 28))
d = ImageDraw.Draw(s); d.text((8, 8), sys.argv[4], fill='black'); d.text((a.width + 20, 8), sys.argv[5], fill='black')
s.thumbnail((900, 4000)); s.save(sys.argv[3], quality=84, optimize=True)
`, a, b, path.join(OUT, `compare_${name}_390.jpg`), ...labels]);
      compared.push(name);
    }
    results.info.compare = { source: COMPARE, pages: compared };
  } catch (e) {
    err('run: ' + (e && e.stack || e));
  } finally {
    if (browser) await browser.close();
    server.stop();
    fs.rmSync(dataDir, { recursive: true, force: true });
  }

  fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(results, null, 1) + '\n');
  console.log(`\n${results.passed.length} passed, ${results.errors.length} failed, ${results.warnings.length} warnings → ${path.relative(ROOT, path.join(OUT, 'checks.json'))}`);
  if (results.errors.length) {
    console.error(`--- server log (tail) ---\n${server.log().slice(-3000)}`);
    process.exit(1);
  }
})();
