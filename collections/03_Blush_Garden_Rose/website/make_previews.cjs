#!/usr/bin/env node
// Website (design 03) — previews + automated checks. Serves this folder on a local HTTP server (cross-document
// view transitions and sessionStorage need a real origin; file:// is not enough).
//
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=/opt/node22/lib/node_modules \
//   PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK=1 node collections/03_Blush_Garden_Rose/website/make_previews.cjs [--no-video]
//
// Output (previews/):
//   website_html_<page>_390px.png            full page, every page (scenes revealed; bottom nav drawn at page end)
//   website_html_home_<360|430|768|1280>px.png
//   website_html_index_<360|430|768|1280>px.png  landing first view
//   website_html_opening_390x844.mp4         tap → opening → home → scroll → Story page
//   checks.json                              machine-readable results of the checks below
// Checks (exit code 1 on any error):
//   1 no horizontal scroll   2 no text outside the viewport   3 every <img> loaded   4 Google Fonts loaded (warning)
//   5 card text stays on plain paper (img/manifest.json free_zone) — never over the painted florals
//   6 K24: every [data-field] shows content.demo.json (formatted here, independently of site.js); site.js CONTENT ==
//     content.demo.json; no personal string hard-coded in the raw HTML   7 url fields null → links stay href="#"
//   8 RSVP: no <form>, clicking RSVP sends nothing and never shows a success message
//   9 countdown target = date + ceremony_time + timezone; "today"/"after" messages via clock emulation
//  10 envelope flow: tap → home.html with arrive flag; back → opened state + replay; reduced motion; skip
//  11 first-view transfer (index, home) at 390×844 DPR 3
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'previews');
const CONTENT = JSON.parse(fs.readFileSync(path.join(DIR, '..', 'content.demo.json'), 'utf8'));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(DIR, 'img', 'manifest.json'), 'utf8'));
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'];
const WIDTHS = [360, 390, 430, 768, 1280];
const VIDEO = !process.argv.includes('--no-video');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const results = { errors: [], warnings: [], info: {} };
const err = (m) => { results.errors.push(m); console.log('HATA  ' + m); };
const warn = (m) => { results.warnings.push(m); console.log('UYARI ' + m); };
const ok = (m) => console.log('TAMAM ' + m);

// ------------------------------------------------------------------ content formatting (en-US, no numeric dates)
function fmtDate(iso) { return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' }); }
function fmtTime(hm) { const [h, m] = hm.split(':').map(Number); return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; }
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function fmtValue(v, f) {
  if (typeof v !== 'string') return v == null ? '' : String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(v + 'T12:00:00Z');
    if (f === 'weekday') return d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' });
    if (f === 'month') return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long' });
    if (f === 'day') return String(d.getUTCDate());
    if (f === 'year') return String(d.getUTCFullYear());
    return fmtDate(v);
  }
  if (/^\d{2}:\d{2}$/.test(v)) return fmtTime(v);
  return v;
}
// personal strings that must never be hard-coded in the HTML files (they come from CONTENT in site.js)
const PERSONAL = [CONTENT.host_line, CONTENT.venue.name, CONTENT.venue.city, CONTENT.venue.region, CONTENT.dress_code,
  fmtDate(CONTENT.date), fmtDate(CONTENT.rsvp.deadline), ...CONTENT.partners.flatMap((x) => [x.display_name, x.full_name]),
  ...CONTENT.schedule.map((x) => x.location)].filter(Boolean);


// ------------------------------------------------------------------ static server
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p === '/') p = '/index.html';
      const f = path.join(DIR, path.normalize(p));
      if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 240) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 130)); }
  });
  await page.waitForTimeout(3800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

// checks that run inside the page
async function pageChecks(page, name, w) {
  const r = await page.evaluate(({ FZ }) => {
    const out = { hscroll: document.documentElement.scrollWidth > window.innerWidth + 0.5, offscreen: [], broken: [], fields: [], zone: [], fonts: {} };
    const vw = window.innerWidth;
    for (const el of document.querySelectorAll('body *')) {
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]') || el.closest('.visually-hidden')) continue;
      const b = el.getBoundingClientRect();
      if (!b.width) continue;
      if (b.right > vw + 0.5 || b.left < -0.5) out.offscreen.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 28)}" [${Math.round(b.left)}..${Math.round(b.right)}]`);
    }
    // any element past the viewport edge that no ancestor clips (root clip would hide it, but it is still a layout bug)
    out.bleed = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.petal-layer')) continue;
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
    out.fieldEls = [...document.querySelectorAll('[data-field]')].map((el) => ({ field: el.dataset.field, format: el.dataset.format || '',
      tag: el.tagName, text: el.textContent.replace(/\s+/g, ' ').trim(), href: el.getAttribute('href'), src: el.getAttribute('src') }));
    out.siteContent = typeof CONTENT === 'object' ? JSON.parse(JSON.stringify(CONTENT)) : null;
    // text on painted cards must stay inside the plain-paper zone of the GPT image
    const cards = [['.invite', 'invitation_card'], ['.info', 'info_card'], ['.card', 'card_small']];
    for (const [sel, key] of cards) {
      for (const card of document.querySelectorAll(sel)) {
        const cb = card.getBoundingClientRect();
        if (!cb.width) continue;
        const zone = FZ[key];
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.photo-slot')) continue;   // photo-slot label sits on the photo on purpose
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const lb of rg.getClientRects()) {
            if (lb.width < 1) continue;
            const x0 = (lb.left - cb.left) / cb.width * 100, x1 = (lb.right - cb.left) / cb.width * 100;
            // ink of script/serif glyphs sits inside the line box; ignore 18% of its height top & bottom (leading)
            const pad = lb.height * 0.18;
            const y0 = (lb.top + pad - cb.top) / cb.height * 100, y1 = (lb.bottom - pad - cb.top) / cb.height * 100;
            for (const [y, L, R] of zone) {
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
    for (const f of ['Great Vibes', 'Cormorant Garamond', 'Lora']) out.fonts[f] = document.fonts.check(`16px "${f}"`);
    out.forms = document.querySelectorAll('form').length;
    return out;
  }, { FZ: { invitation_card: MANIFEST.invitation_card.free_zone, info_card: MANIFEST.info_card.free_zone, card_small: MANIFEST.card_small.free_zone } });
  const tag = `${name}@${w}`;
  if (r.hscroll) err(`${tag}: yatay kaydırma var`);
  r.offscreen.forEach((x) => err(`${tag}: metin ekran dışında ${x}`));
  r.broken.forEach((x) => err(`${tag}: görsel yüklenmedi ${x}`));
  r.bleed.slice(0, 6).forEach((x) => err(`${tag}: öğe ekran kenarını aşıyor ${x}`));
  // K24: fields vs content.demo.json (story.* is the proposed block that only exists in site.js CONTENT)
  if (!r.siteContent) err(`${tag}: site.js CONTENT yok`);
  else {
    const { story, ...rest } = r.siteContent;
    if (JSON.stringify(rest) !== JSON.stringify(CONTENT)) err(`${tag}: site.js CONTENT ≠ content.demo.json`);
    for (const f of r.fieldEls) {
      const src = f.field.startsWith('story.') ? r.siteContent : CONTENT;
      let v = getPath(src, f.field);
      // an empty slot in an existing list (media.memory_photos is []) is a valid, empty field
      if (v === undefined && getPath(src, f.field.split('.').slice(0, -1).join('.')) !== undefined) v = null;
      if (v === undefined) { r.fields.push(`bilinmeyen alan ${f.field}`); continue; }
      if (f.tag === 'A') { if (f.href !== (v || '#')) r.fields.push(`${f.field}: href ${f.href} ≠ ${v || '#'}`); continue; }
      if (f.tag === 'IMG') { if (v && f.src !== v) r.fields.push(`${f.field}: src ${f.src}`); continue; }
      const want = fmtValue(v, f.format);
      if (f.text !== want) r.fields.push(`${f.field}${f.format ? '/' + f.format : ''}: "${f.text}" ≠ "${want}"`);
    }
  }
  r.fields.forEach((x) => err(`${tag}: içerik farkı ${x}`));
  r.zone.forEach((x) => err(`${tag}: kart metni boyalı çiçeğe/çizgiye taşıyor ${x}`));
  Object.entries(r.fonts).forEach(([f, v]) => { if (!v) warn(`${tag}: font yüklenmedi (${f}) — fallback ile görüntülendi`); });
  if (r.forms) err(`${tag}: <form> var (RSVP yer tutucu olmalı)`);
  if (!r.hscroll && !r.offscreen.length && !r.broken.length && !r.fields.length && !r.zone.length && !r.bleed.length) ok(`${tag}: yatay kayma yok, metin taşması yok, görseller yüklü, içerik = content.demo.json (data-field), kart metni serbest bölgede`);
  return r;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const name of PAGES) {
    const html = fs.readFileSync(path.join(DIR, name + '.html'), 'utf8').replace(/&amp;/g, '&');
    const hits = PERSONAL.filter((t) => html.includes(t));
    if (hits.length) err(`${name}.html: kişisel metin HTML'e gömülü (CONTENT'ten gelmeli): ${hits.join(', ')}`);
    else ok(`${name}.html: kişisel metin gömülü değil (hepsi data-field + CONTENT)`);
  }
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {});
  const mk = (w, h, extra = {}) => browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true,
    hasTouch: w < 960, isMobile: w < 768, ...extra });

  // ---------------------------------------------------------------- screenshots + layout checks
  for (const w of WIDTHS) {
    const h = w < 768 ? 844 : (w < 1000 ? 1024 : 800);
    const ctx = await mk(w, h);
    const pages = w === 390 ? PAGES : ['index', 'home'];
    for (const name of pages) {
      const page = await ctx.newPage();
      const bad = [];
      page.on('response', (res) => { if (res.status() >= 400 && !res.url().endsWith('favicon.ico')) bad.push(`${res.status()} ${res.url()}`); });
      page.on('pageerror', (e) => bad.push('JS: ' + e.message));
      await page.goto(base + name + '.html', { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }); });
      if (name === 'index') await page.waitForTimeout(900); else await revealAll(page);
      await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))));
      await pageChecks(page, name, w);
      bad.forEach((b) => err(`${name}@${w}: ${b}`));
      // bottom nav is fixed to the first screen; in a full-page image draw it where it really sits: on the last screen.
      // Falling petals are transient — not frozen into a still.
      await page.evaluate(() => {
        document.querySelectorAll('.petal-layer').forEach((l) => l.remove());
        const n = document.querySelector('.site-nav');
        if (n && getComputedStyle(n).bottom === '0px') { n.style.position = 'absolute'; n.style.bottom = 'auto'; n.style.top = (document.documentElement.scrollHeight - n.offsetHeight) + 'px'; }
      });
      await page.screenshot({ path: path.join(OUT, `website_html_${name}_${w}px.png`), fullPage: name !== 'index' });
      await page.close();
    }
    await ctx.close();
  }

  // ---------------------------------------------------------------- flows
  {
    const ctx = await mk(390, 844);
    const page = await ctx.newPage();
    const reqs = [];
    page.on('request', (r) => reqs.push(r.url()));
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const t0 = Date.now();
    await page.click('.stage');
    await page.waitForURL('**/home.html', { timeout: 9000 });
    const arrive = await page.evaluate(() => document.documentElement.classList.contains('from-envelope'));
    results.info.envelope_to_home_ms = Date.now() - t0;
    if (!arrive) err('zarf → home: from-envelope işareti yok'); else ok(`zarf → home.html ${results.info.envelope_to_home_ms} ms (kart geçişi işaretli)`);
    await page.waitForTimeout(5200);
    const heroVisible = await page.evaluate(() => [...document.querySelectorAll('.hero [data-step]')].every((e) => getComputedStyle(e).opacity === '1' || getComputedStyle(e).display === 'none'));
    if (!heroVisible) err('home hero: sıralı girişten sonra görünmeyen öğe var'); else ok('home hero: sıralı giriş tamamlandı');
    const target = await page.evaluate(() => document.querySelector('[data-countdown]').dataset.targetUtc);
    results.info.countdown_target_utc = target;
    if (target !== '2027-05-15T20:00:00.000Z') err(`geri sayım hedefi ${target} (beklenen 2027-05-15T20:00:00.000Z: 16:00 America/New_York, EDT)`); else ok('geri sayım hedefi 2027-05-15 16:00 America/New_York = 20:00 UTC');
    await page.goBack();
    await page.waitForTimeout(800);
    const back = await page.evaluate(() => ({ opened: document.documentElement.classList.contains('is-opened'), after: getComputedStyle(document.querySelector('.env-after')).display }));
    if (!back.opened || back.after === 'none') err(`geri dönüş: açık durum/replay görünmüyor ${JSON.stringify(back)}`); else ok('geri dönüş: zarf açık hâlde, "Enter" + "Replay the opening" gösteriliyor (zorla tekrar yok)');
    await page.click('.replay');
    await page.waitForTimeout(400);
    const replaying = await page.evaluate(() => !document.documentElement.classList.contains('is-opened'));
    if (!replaying) err('replay çalışmadı'); else ok('replay: açılış yeniden oynuyor');
    await page.waitForURL('**/home.html', { timeout: 9000 });
    // RSVP placeholder
    await page.goto(base + 'rsvp.html', { waitUntil: 'load' });
    await page.waitForTimeout(3200);
    const before = reqs.length;
    await page.click('a[data-field="urls.rsvp_form"]');
    await page.waitForTimeout(600);
    const after = reqs.slice(before);
    const toast = await page.evaluate(() => (document.querySelector('.toast') || {}).textContent || '');
    if (after.length) err(`RSVP tıklaması istek gönderdi: ${after.join(', ')}`);
    else if (/success|received|thank you for (your )?repl/i.test(toast)) err(`RSVP başarı mesajı gösteriyor: ${toast}`);
    else ok(`RSVP: istek yok, başarı mesajı yok — bildirim: "${toast}"`);
    const external = reqs.filter((u) => !u.startsWith(base) && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u) && !u.startsWith('data:'));
    if (external.length) err(`dış istek: ${external.join(', ')}`); else ok('dış istek yalnız Google Fonts');
    await ctx.close();
  }
  {
    const ctx = await mk(390, 844, { reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    const t0 = Date.now();
    await page.click('.stage');
    await page.waitForURL('**/home.html', { timeout: 4000 });
    const dt = Date.now() - t0;
    const allVisible = await page.evaluate(() => [...document.querySelectorAll('[data-step]')].every((e) => getComputedStyle(e).opacity === '1'));
    if (dt > 1500 || !allVisible) err(`reduced motion: ${dt} ms, hepsi görünür=${allVisible}`); else ok(`prefers-reduced-motion: animasyonsuz doğrudan home (${dt} ms), bütün öğeler hemen görünür`);
    await ctx.close();
  }
  {
    const ctx = await mk(390, 844);
    const page = await ctx.newPage();
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    await page.click('[data-skip]');
    await page.waitForURL('**/home.html', { timeout: 4000 });
    ok('Skip: doğrudan home.html');
    for (const [when, iso] of [['today', '2027-05-15T21:00:00Z'], ['after', '2027-05-20T12:00:00Z']]) {
      const p2 = await ctx.newPage();
      await p2.clock.install({ time: new Date(iso) });
      await p2.goto(base + 'home.html', { waitUntil: 'load' });
      await p2.waitForTimeout(300);
      const shown = await p2.evaluate(() => [...document.querySelectorAll('.cd-done')].filter((p) => !p.hidden && getComputedStyle(p).display !== 'none').map((p) => p.dataset.when + ': ' + p.textContent));
      if (shown.length !== 1 || !shown[0].startsWith(when)) err(`geri sayım ${iso}: ${JSON.stringify(shown)}`); else ok(`geri sayım bittiğinde (${iso}) → "${shown[0]}"`);
      await p2.close();
    }
    await ctx.close();
  }
  // first-view transfer at phone DPR 3 (srcset picks the 2x files)
  for (const name of ['index', 'home']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    let bytes = 0; const list = [];
    page.on('requestfinished', async (rq) => {
      try { const s = await rq.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; list.push([rq.url().replace(base, ''), s.responseBodySize]); } catch (e) { /* ignore */ }
    });
    await page.goto(base + name + '.html', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    results.info[`first_view_${name}_kb`] = Math.round(bytes / 1024);
    results.info[`first_view_${name}_files`] = list.sort((a, b) => b[1] - a[1]).slice(0, 12);
    if (bytes > 1.5 * 1024 * 1024) err(`${name} ilk açılış ${Math.round(bytes / 1024)} KB > 1536 KB`); else ok(`${name} ilk açılış (390×844, DPR 3): ${Math.round(bytes / 1024)} KB`);
    await ctx.close();
  }

  // ---------------------------------------------------------------- recording 390×844: tap → opening → home → scroll → Story
  if (VIDEO) {
    const vdir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'g035-video-'));
    // the screencast is captured in CSS pixels: record exactly the 390×844 viewport (a larger size only adds gray margins)
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
      ignoreHTTPSErrors: true, recordVideo: { dir: vdir, size: { width: 390, height: 844 } } });
    const page = await ctx.newPage();
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    await page.tap('.stage');
    await page.waitForURL('**/home.html', { timeout: 9000 });
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
    await page.tap('.teaser[href="story.html"]');
    await page.waitForURL('**/story.html', { timeout: 6000 });
    await page.waitForTimeout(3000);
    await smooth(520, 1800);
    await page.waitForTimeout(2600);
    const vpath = await page.video().path();
    await ctx.close();
    const mp4 = path.join(OUT, 'website_html_opening_390x844.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', vpath, '-vf', 'fps=30,scale=390:844:flags=lanczos', '-c:v', 'libx264',
      '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
    fs.rmSync(vdir, { recursive: true, force: true });
    results.info.video_kb = Math.round(fs.statSync(mp4).size / 1024);
    ok(`kayıt: ${path.relative(DIR, mp4)} (${results.info.video_kb} KB)`);
  }

  await browser.close();
  srv.close();
  fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(results, null, 1));
  console.log(`\n${results.errors.length} hata, ${results.warnings.length} uyarı → previews/checks.json`);
  process.exit(results.errors.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
