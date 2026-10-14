/* site.js — Vintage Airmail Love Letter (04, G404): motion, envelope (tear strip), first-screen fits, sheets, countdown.
 * #site-data from the platform; DEV_CONTENT + devRender() only without it. Hooks and reasons: README.md. */
const MOTION = {
  // [start ms after the tap, duration ms]; scenes: [[step, delay ms]]; accents: docs/11 §8 (+ from / to: README)
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  envelope: {
    hint: [0, 260],
    tug: [0, 300],
    closure: [0, 820],
    head: [160, 620],
    tear: [360, 860],
    fly: [1220, 560],
    rise: [1180, 1320],
    forward: [2560, 620],
    accents: 1240,
    go: 3620,
    fadeOut: 420
  },

  scenes: {
    'home-hero': [['decor', 0], ['card', 120], ['names', 620], ['date', 1400], ['venue', 1650], ['countdown', 1950], ['cta', 2250]],
    'home-invite': [['card', 0], ['host', 560], ['name1', 900], ['amp', 1450], ['name2', 1560], ['request', 2150], ['date', 2500], ['venue', 2850], ['cta', 3150], ['cal', 3350]],
    'home-more': [['title', 0], ['item1', 260], ['item1t', 760], ['twine1', 1000], ['item2', 1200], ['item2t', 1700], ['twine2', 1940], ['item3', 2140], ['item3t', 2500]],
    'home-foot': [['decor', 0], ['sign', 140], ['links', 900]],
    'story-head': [['decor', 0], ['title', 120], ['kicker', 1000], ['lede', 1350]],
    'story-stamp': [['drop', 0], ['acc', 420], ['mark', 760], ['caption', 820]],
    'story-next': [['decor', 0], ['twine', 200], ['link', 600]],
    'details-card': [['decor', 0], ['kicker', 120], ['card', 340], ['title', 860], ['row', 1450], ['cal', 2500]],
    'details-venue': [['photo', 0], ['body', 560], ['dress', 950], ['action', 1150]],
    'details-block': [['twine', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq': [['twine', 0], ['title', 300], ['item', 950]],
    'details-next': [['decor', 0], ['link', 300]],
    'rsvp-card': [['decor', 0], ['card', 120], ['title', 700], ['kicker', 1400], ['deadline', 1600], ['button', 1950], ['twine', 2200], ['wait', 2400], ['love', 2750], ['sign', 3000], ['seal', 3300]],
    'rsvp-form': [['form', 0]],
    'rsvp-closing': [['decor', 0], ['title', 220], ['line', 900], ['meta', 1250]]
  },
  stagger: 210,
  batchGap: 380,
  arriveDelay: 0,

  accents: {
    open: [{ file: 'img/accent_2-200.webp', count: 1, path: 'fall', origin: 'top', dur: [2300, 2300], size: [62, 74], spread: 0, avoid: '.env .card' }],
    arrive: [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [3600, 4400], size: [34, 44], spread: 1400, avoid: '.hero [data-slot]', to: 'avoid' }],
    closing: [{ file: 'img/accent_1-200.webp', count: 1, path: 'fall', origin: 'top', dur: [4600, 4600], size: [40, 40], spread: 0, from: '.replay-line' },
      { file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [4200, 5200], size: [32, 40], spread: 1500, from: '.replay-line' }]
  }
};

const ENVELOPE_GEOMETRY = { out: 'translateY(-109.499%)', front: 'translateY(-107.499%) scale(1.04)' };

const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Margot', full_name: 'Margot Elise' }, { display_name: 'Henry', full_name: 'Henry Arthur' }],
  name_display: 'Margot & Henry', initials: 'M&H', host_line: 'Together with their families',
  date: '2027-10-02', ceremony_time: '16:00', timezone: 'America/New_York',
  venue: { name: 'The Old Post House', city: 'Hudson', region: 'New York', country: 'USA', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:00', location: 'The Orchard Lawn' },
    { label: 'Cocktail Hour', time: '17:00', location: 'The Library Bar' },
    { label: 'Reception', time: '18:30', location: 'The Post Hall' }
  ],
  dress_code: 'Cocktail attire',
  rsvp: { deadline: '2027-08-21', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Some love stories are written one letter at a time. Ours led us to',
    items: [{ caption: 'A table for two' }, { caption: 'Sealed with a yes' }, { caption: 'Yours, always' }]
  }
};

(function () {
'use strict';
const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
const BASE = (document.currentScript && document.currentScript.src) || document.baseURI;
const asset = (p) => new URL(p, BASE).href;

function readSiteData() {
  const el = document.getElementById('site-data');
  if (!el) return null;
  try { return JSON.parse(el.textContent); } catch (e) { return null; }
}
const SITE = readSiteData();
const CONTENT = SITE ? {} : DEV_CONTENT;
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY;
const ARRIVE = MOTION.storage.arrive + KEY;

const store = {
  get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
};
const rand = (a, b) => a + Math.random() * (b - a);
const top = (el) => { let y = 0; for (let e = el; e; e = e.offsetParent) y += e.offsetTop; return y; };
const bottom = (el) => top(el) + el.offsetHeight;
const sv = () => { const p = document.createElement('i'); p.style.cssText = 'position:fixed;height:100svh'; document.body.append(p); const h = p.offsetHeight; p.remove(); return h || innerHeight; };
let refit = () => {};

// accents: a lane beside `avoid` (never over a photo); a host section keeps them behind its text
function flightPath(path, W, y0, H, s, i, avoid) {
  const kf = [];
  const N = 12;
  const down = path !== 'rise';
  const sway = rand(16, 30), ph = rand(0, 6.28);
  let x0 = rand(0.08, 0.92) * W, drift = rand(-0.14, 0.14) * W;
  if (avoid) {
    const lanes = [[sway, avoid.left - s - sway], [avoid.right + sway, W - s - sway]].filter(([a, b]) => b > a);
    if (!lanes.length) return null;
    const [a, b] = lanes[(i + (Math.random() < 0.5 ? 0 : 1)) % lanes.length];
    x0 = rand(a, b); drift = 0;
  }
  const r0 = rand(-30, 30), turn = rand(-140, 140);
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const swing = Math.sin(t * 6.28 * 1.4 + ph);
    const x = x0 + drift * t + swing * sway;
    const y = down ? y0 - s * 1.6 + (H - y0 + 3.2 * s) * t : H + s - (H + 2 * s) * t;
    kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + turn * t + swing * 22).toFixed(1)}deg) rotateY(${(swing * 38).toFixed(1)}deg)`,
      opacity: k === 0 ? 0 : (k === N ? 0 : 0.97), offset: t });
  }
  return kf;
}
function accents(moment, until, host) {
  const groups = MOTION.accents[moment];
  if (reduce || !groups || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  (host || document.body).appendChild(layer);
  const o = host ? host.getBoundingClientRect() : { left: 0, top: 0 };
  const W = host ? host.clientWidth : innerWidth;
  groups.forEach((g) => {
    const av = g.avoid && document.querySelector(g.avoid), r = av && av.getBoundingClientRect(), fr = g.from && document.querySelector(g.from);
    const y0 = fr ? fr.getBoundingClientRect().bottom - o.top : 0, H = r && g.to ? r.bottom - o.top : host ? host.clientHeight : innerHeight;
    for (let i = 0; i < g.count; i++) {
      const s = rand(g.size[0], g.size[1]);
      const kf = flightPath(g.path, W, y0, H, s, i, r && { left: r.left - o.left, right: r.right - o.left });
      if (!kf) continue;
      const img = new Image();
      img.src = asset(g.file);
      img.alt = '';
      img.decoding = 'async';
      img.style.width = s.toFixed(1) + 'px';
      layer.appendChild(img);
      const delay = i * 700 + rand(0, g.spread || 0);
      const a = img.animate(kf, { duration: Math.max(600, Math.min(rand(g.dur[0], g.dur[1]), (until || 1e9) - delay)), delay, easing: 'linear', fill: 'both' });
      a.onfinish = () => img.remove();
    }
  });
}

function stepIndex(n) {
  if (n.dataset.i !== undefined) return Number(n.dataset.i) || 0;
  const item = n.dataset.repeatItem;
  return item ? Number(item.split('.').pop()) || 0 : 0;
}
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    if (!instant) {
      const t = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
      n.style.transitionDelay = t + 'ms';
      n.addEventListener('transitionend', (e) => { if (e.target === n) n.classList.add('done'); });
    } else {
      n.classList.add('done');
    }
    n.classList.add('in');
  });
}
function initScenes() {
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  if (!scenes.length) return;
  if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => reveal(s, 0, true)); return; }
  const arrived = root.classList.contains('from-envelope');
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    vis.forEach((s, i) => {
      io.unobserve(s);
      let base = i * (s.dataset.scene === 'story-stamp' ? 760 : MOTION.batchGap);
      if (arrived && s.dataset.scene === 'home-hero') base += MOTION.arriveDelay;
      reveal(s, base, false);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  scenes.forEach((s) => io.observe(s));
}

function zoneOffset(ts, tz) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const p = {};
  f.formatToParts(new Date(ts)).forEach((x) => { p[x.type] = x.value; });
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ts;
}
function zonedToUtc(date, time, tz) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  let t = wall;
  for (let i = 0; i < 3; i++) t = wall - zoneOffset(t, tz);
  return t;
}
function countdownTarget() {
  if (SITE) {
    const t = SITE.derived && Date.parse(SITE.derived.countdown_target_utc);
    return Number.isFinite(t) ? t : null;
  }
  try { return zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); }
  catch (e) { return Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }
}
function initCountdown() {
  document.querySelectorAll('[data-countdown]').forEach((box) => {
    const target = countdownTarget();
    if (target === null) { box.hidden = true; return; }
    box.dataset.targetUtc = new Date(target).toISOString();
    const cells = {};
    box.querySelectorAll('[data-unit]').forEach((el) => { cells[el.dataset.unit] = el; });
    const pad = (n) => (n < 10 ? '0' + n : String(n));
    const dayLen = 86400000;
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.classList.add('is-done');
        const today = -diff < dayLen / 2;
        box.querySelectorAll('.cd-done').forEach((p) => { p.hidden = (p.dataset.when === 'today') !== today; });
        return false;
      }
      const s = Math.floor(diff / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      cells.seconds.textContent = pad(s % 60);
      return true;
    }
    if (tick()) { const h = setInterval(() => { if (!tick()) clearInterval(h); }, 1000); }
  });
}

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2800);
}
function initPlaceholders() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-url-missing]');
    if (!a) return;
    e.preventDefault();
    toast(a.dataset.pending || document.body.dataset.pending || '');
  });
}

// sheets (docs/11 §9): the band repeats, never stretches; height = whole bands
function fitPaper() {
  const papers = Array.from(document.querySelectorAll('.paper[data-band]'));
  if (!papers.length) return;
  const run = () => papers.forEach((p) => {
    const text = p.querySelector('.paper-text');
    if (!text) return;
    text.style.minHeight = '';
    const cs = getComputedStyle(p);
    const W = p.clientWidth, ar = parseFloat(cs.getPropertyValue('--ar')), t = parseFloat(cs.getPropertyValue('--t')),
      b = parseFloat(cs.getPropertyValue('--b'));
    if (!W || !ar) return;
    const H = W / ar, top = H * t, bot = H * (1 - b), band = H * (b - t);
    const need = Math.max(H, text.offsetHeight);
    const n = Math.max(1, Math.ceil((need - top - bot - 1.5) / band));
    text.style.minHeight = `${(top + bot + n * band).toFixed(2)}px`;
    p.style.setProperty('--bands', String(n));
  });
  refit = run;
  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  if (window.ResizeObserver) {
    let w = 0;
    const ro = new ResizeObserver(() => { if (window.innerWidth !== w) { w = window.innerWidth; run(); } });
    ro.observe(document.documentElement);
  }
}

// long names, the hero's first screen (fold + corner cluster), card copy (README "Home ilk ekranı")
function fitNames() {
  const targets = [['.env-head .names', 5, 0.3, 20], ['.hero .names', 3.2, 0.3, 36]]
    .map(([sel, ...a]) => [document.querySelector(sel), ...a]).filter(([el]) => el);
  if (!targets.length) return;
  const inner = document.querySelector('.hero-inner'), nav = document.querySelector('.site-nav');
  const low = (h1) => {
    const hero = h1.closest('.hero');
    if (!hero || !inner || !nav) return false;
    const long = hero.classList.contains('is-long');
    return Math.max(...[...inner.children].filter((c) => !(long && c.matches('.countdown'))).map(bottom)) > sv() - nav.offsetHeight - 8;
  };
  const fit = (h1, maxLines, maxShare, minPx, navFloor) => {
    h1.style.setProperty('--names-scale', '1');
    const min = Math.min(1, Math.max(0.4, minPx / parseFloat(getComputedStyle(h1).fontSize)));
    const cw = h1.clientWidth;
    h1.style.whiteSpace = 'nowrap';
    const one = cw / h1.scrollWidth - 0.01;
    h1.style.whiteSpace = '';
    for (let s = one < 0.99 && one > Math.max(0.86, min) ? one : 1; ; s = Math.max(min, s - 0.06)) {
      h1.style.setProperty('--names-scale', s.toFixed(3));
      const h = h1.getBoundingClientRect().height, lines = h / (parseFloat(getComputedStyle(h1).fontSize) * 1.45);
      if (s <= min || (lines <= maxLines && h <= innerHeight * maxShare && (s <= navFloor || !low(h1)))) break;
    }
  };
  const fits = (c) => {
    const k = [...c.children].filter((p) => p.offsetParent);
    return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
      && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
  };
  const fitCopy = () => document.querySelectorAll('.card-copy').forEach((c) => {
    for (const d of ['', 'c', 's', 'c d', 's c d']) { c.dataset.drop = d; if (fits(c)) break; }
  });
  const pieces = () => [...inner.children].filter((c) => c.offsetParent && !c.matches('.hero-card-wrap'));
  const unfold = (hero) => {
    [...inner.children].forEach((c) => c.style.removeProperty('margin-top'));
    hero.classList.remove('is-folded');
    hero.style.removeProperty('--fold');
  };
  const fold = (hero) => {
    const v = sv(), limit = v - nav.offsetHeight - 8, below = v + 12, cs = getComputedStyle(hero);
    const cut = () => pieces().filter((c) => bottom(c) > limit).sort((a, b) => top(a) - top(b))[0];
    let c = cut();
    if (!c || top(c) >= below - 0.5) return;
    const cta = inner.querySelector('.hero-cta'), keep = cta && cta.offsetParent && bottom(cta) <= limit;
    const end = keep && Math.max(parseFloat(cs.minHeight) || 0, bottom(cta) - top(hero) + parseFloat(cs.paddingBottom));
    hero.classList.toggle('is-folded', !!keep);
    const card = inner.querySelector('.hero-card-wrap');
    if (card && c === pieces()[0]) {
      const lift = Math.max(0, (limit - card.offsetHeight) / 2 - top(card));
      card.style.marginTop = `${lift}px`;
      c = cut();
    }
    for (let i = 0; i < 4 && c && top(c) < below - 0.5; i++, c = cut()) c.style.marginTop = `${parseFloat(getComputedStyle(c).marginTop) + below - top(c)}px`;
    if (keep) hero.style.setProperty('--fold', `${Math.max(0, hero.offsetHeight - end)}px`);
  };
  const corner = (hero) => {
    const br = hero.querySelector('.scene-bg .corner-br'), L = [0.79, 0.7, 0.53, 0.31, 0.27, 0.05, 0, 0];
    if (!br) return;
    br.style.removeProperty('--cw'); br.style.bottom = ''; br.hidden = false;
    const lim = sv() - nav.offsetHeight - 8, sb = bottom(br.parentElement), W = hero.offsetWidth;
    let w = br.offsetWidth;
    const f = (br.offsetLeft + w - W) / w, cb = Math.max(26, sb - lim), b = sb - cb;
    const ps = [...inner.children].filter((c) => c.offsetParent && top(c) < lim).map((c) => {
      let x = c.offsetWidth;
      for (let e = c; e; e = e.offsetParent) x += e.offsetLeft;
      return [x, top(c), bottom(c)];
    });
    const hit = (w) => ps.some(([x, y0, y1]) => L.some((l, i) => { const t = b - 1.2337 * w * (1 - i / 8); return t < y1 && t + 0.154 * w > y0 && W - (1 - f - l) * w < x; }));
    for (; w >= 64 && hit(w); w *= 0.94);
    br.style.bottom = cb + 'px';
    if (w < 64) br.hidden = true; else br.style.setProperty('--cw', w + 'px');
  };
  const run = () => fitCopy() || targets.forEach(([h1, maxLines, maxShare, minPx]) => {
    const hero = h1.closest('.hero');
    if (!hero) return fit(h1, maxLines, maxShare, minPx, 0);
    if (inner && nav) unfold(hero);
    for (const [cls, navFloor] of [[[], 0.76], [['is-tight'], 0], [['is-tight', 'is-long'], 0], [[], 1]]) {
      hero.classList.remove('is-tight', 'is-long');
      hero.classList.add(...cls);
      fit(h1, maxLines, maxShare, minPx, navFloor);
      if (!low(h1)) break;
    }
    if (inner && nav) { fold(hero); corner(hero); }
  });
  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  if (window.ResizeObserver) { const ro = new ResizeObserver(fitCopy); document.querySelectorAll('.card-copy').forEach((c) => ro.observe(c)); }
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
}

// inner pages' first screen (qa): each [data-fold] unit ends above the nav or starts below the first screen —
// pack, lift the head (≤ 35 %), shrink the RSVP signature (--sg ≥ .72), else fold; story: --fw for the first row
function folds() {
  const nav = document.querySelector('.site-nav'), units = [...document.querySelectorAll('main [data-fold]')];
  if (!nav || !units.length) return;
  const head = document.querySelector('[data-lift]'), desk = document.querySelector('.desk'), sig = document.querySelector('.sig');
  const seal = document.querySelector('.card-seal'), wrap = sig && sig.closest('.wrap');
  const sl = (u) => +u.dataset.fold || 0;
  const tiles = (row, limit, lift) => {
    const figs = [...desk.querySelectorAll('.stamp')], f = figs[0];
    const e = (w) => { desk.style.setProperty('--fw', w + 'px'); return (row ? Math.max(...figs.map(bottom)) : bottom(f)) + 12; };
    const w0 = f.offsetWidth, lo = row ? 160 : innerWidth * 0.485;
    if (e(w0) <= limit) return desk.style.removeProperty('--fw');
    const fit = e(lo) <= limit + lift, cap = fit ? limit + lift : top(desk) + limit - 20;
    if (!fit && !row) return desk.style.removeProperty('--fw');
    let a = lo, b = w0;
    for (let i = 0; i < 7; i++) { const m = (a + b) / 2; if (e(m) <= cap) a = m; else b = m; }
    e(Math.floor(a));
  };
  const run = () => {
    units.forEach((u) => { u.style.marginTop = ''; });
    document.querySelectorAll('.packed').forEach((p) => p.classList.remove('packed'));
    [[head, '--lift'], [desk, '--fw'], [wrap, '--sg']].forEach(([e, k]) => e && e.style.removeProperty(k));
    refit();
    const v = sv(), limit = v - nav.offsetHeight - 8;
    const row = desk && getComputedStyle(desk).display === 'grid';
    const list = units.filter((u) => u.offsetParent && (u === desk ? row : !(row && desk.contains(u))));
    const end = (u) => (u === sig && seal ? Math.max(bottom(u), bottom(seal)) : bottom(u)) + sl(u);
    const cross = () => list.find((u) => top(u) - sl(u) < v && end(u) > limit);
    if (desk) { tiles(row, limit, head ? 0.35 * parseFloat(getComputedStyle(head).paddingTop) : 0); refit(); }
    let u, lifted;
    for (let i = 0; i < 24 && (u = cross()); i++, refit()) {
      const pk = u.parentElement.closest('[data-pack]:not(.packed)'), sg = wrap ? +wrap.style.getPropertyValue('--sg') || 1 : 1;
      if (pk) { pk.classList.add('packed'); continue; }
      if (!lifted && head) {
        lifted = 1;
        const need = end(u) - limit, max = 0.35 * parseFloat(getComputedStyle(head).paddingTop);
        if (need <= max || u === sig) { head.style.setProperty('--lift', Math.min(need, max).toFixed(1) + 'px'); continue; }
      }
      if (u === sig && sg > 0.73) { wrap.style.setProperty('--sg', (sg - 0.04).toFixed(2)); continue; }
      if (u === sig && sg < 1) { wrap.style.removeProperty('--sg'); refit(); }
      u.style.marginTop = parseFloat(getComputedStyle(u).marginTop) + v + 6 + sl(u) - top(u) + 'px';
    }
  };
  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(run, 160); });
}

// envelope page: "Tap to open" stays on screen (--ok ≥ .62, then the names ≥ 20 px)
function envFit() {
  const page = document.querySelector('.env-page');
  if (!page) return;
  const hint = page.querySelector('.env-hint'), h1 = page.querySelector('.names');
  const run = () => {
    page.style.removeProperty('--ok');
    if (root.classList.contains('is-opened')) return;
    const v = sv() - 6, low = () => hint.getBoundingClientRect().bottom > v;
    for (let k = 1; k > 0.63 && low();) page.style.setProperty('--ok', (k -= 0.04).toFixed(2));
    for (let s = +h1.style.getPropertyValue('--names-scale') || 1; low() && parseFloat(getComputedStyle(h1).fontSize) > 20.5;) h1.style.setProperty('--names-scale', (s -= 0.04).toFixed(3));
  };
  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(run, 220); });
}

// envelope: seal pops off → strip tears left → right → card slides up → forward → home (README)
function initEnvelope() {
  const page = document.querySelector('.env-page');
  if (!page) return;
  const q = (s) => page.querySelector(s);
  const stage = q('.stage');
  const el = {
    env: q('.env'), closure: q('.closure'), strip: q('.env-strip'), torn: q('.env-torn'), body: q('.env-open'),
    slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
  };
  const E = MOTION.envelope;
  const replay = /[?&]replay=1(&|$)/.test(location.search);
  if (replay) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [];

  function prefetchHome() {
    if (document.querySelector('link[data-prefetch]')) return;
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = PAGES.home; l.dataset.prefetch = '1';
    document.head.appendChild(l);
  }
  if ('requestIdleCallback' in window) requestIdleCallback(prefetchHome, { timeout: 2500 }); else setTimeout(prefetchHome, 1500);

  function go(withCard) {
    store.set(OPENED, '1');
    if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
    else el.card.style.viewTransitionName = 'none';
    if (crossDocVT || reduce) { location.href = PAGES.home; return; }
    page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    const layer = document.querySelector('.accent-layer');
    if (layer) layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }

  const A = (node, kf, [delay, duration], easing, fill) =>
    node.animate(kf, { delay, duration, easing: easing || 'cubic-bezier(.22,.61,.36,1)', fill: fill || 'both' });

  function tearFrames() {
    const strip = [], torn = [];
    const N = 16, lift = 8.5;
    for (let k = 0; k <= N; k++) {
      const p = k / N;
      const x = 100 * (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2) ;
      const up = Math.min(1, x / 22);
      strip.push({ clipPath: `inset(-2% 0 -2% ${x.toFixed(2)}%)`, offset: p });
      torn.push({ clipPath: `inset(-60% ${(100 - x).toFixed(2)}% -20% -4%)`, transformOrigin: `${x.toFixed(2)}% 100%`,
        transform: `translateY(${(-34 * up).toFixed(1)}%) rotate(${(lift * up).toFixed(2)}deg)`, offset: p });
    }
    return { strip, torn };
  }

  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    prefetchHome();
    if (reduce || !Element.prototype.animate) { go(false); return; }
    A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
    A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .4 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
    A(el.closure, [
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1, easing: 'cubic-bezier(.2,.8,.3,1)' },
      { transform: 'translate(-4%, -16%) rotate(-7deg) scale(1.12)', opacity: 1, offset: .2, easing: 'cubic-bezier(.3,.1,.6,1)' },
      { transform: 'translate(-70%, -34%) rotate(-38deg) scale(1.06)', opacity: 1, offset: .55, easing: 'cubic-bezier(.5,0,.9,.6)' },
      { transform: 'translate(-175%, 60%) rotate(-96deg) scale(.96)', opacity: 0 }
    ], E.closure, 'linear');
    A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
    const tf = tearFrames();
    A(el.strip, tf.strip, E.tear, 'linear', 'forwards');
    A(el.torn, [{ opacity: 0 }, { opacity: 1 }], [E.tear[0], 1], 'linear', 'forwards');
    A(el.torn, tf.torn, E.tear, 'linear', 'forwards');
    A(el.torn, [{ filter: 'drop-shadow(0 1px 1px rgba(60, 40, 20, .2))' }, { filter: 'drop-shadow(0 9px 8px rgba(60, 40, 20, .28))' }], E.tear, 'ease-out', 'forwards');
    A(el.torn, [
      { transformOrigin: '100% 100%', transform: 'translateY(-34%) rotate(8.5deg)', opacity: 1 },
      { transformOrigin: '100% 100%', transform: 'translate(16%, -520%) rotate(15deg)', opacity: 0 }
    ], E.fly, 'cubic-bezier(.45,0,.8,.6)', 'forwards');
    timers.push(setTimeout(() => accents('open', E.go - E.accents - 60), E.accents));
    A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.45,0,.2,1)');
    timers.push(setTimeout(() => {
      el.slot.style.clipPath = 'none';
      el.slot.style.zIndex = '6';
      A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: ENVELOPE_GEOMETRY.front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
      A(el.card, [{ filter: 'drop-shadow(0 6px 8px rgba(60, 40, 20, .16))' }, { filter: 'drop-shadow(0 22px 24px rgba(60, 40, 20, .28))' }], [0, E.forward[1]], 'ease-out', 'forwards');
    }, E.forward[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }

  function cancelScripted() {
    page.getAnimations({ subtree: true }).concat(page.getAnimations())
      .filter((a) => !(window.CSSAnimation && a instanceof CSSAnimation))
      .forEach((a) => a.cancel());
  }
  function clearOpening() {
    timers.splice(0).forEach(clearTimeout);
    cancelScripted();
    el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
    el.card.style.viewTransitionName = '';
    const layer = document.querySelector('.accent-layer');
    if (layer) layer.remove();
  }
  function reset() {
    clearOpening();
    root.classList.remove('is-opened');
    state = 'closed';
  }

  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); }
  });
  document.querySelectorAll('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  const rep = q('.replay');
  if (rep) rep.addEventListener('click', () => { reset(); requestAnimationFrame(() => play()); });
  const enter = q('[data-enter]');
  if (enter) enter.addEventListener('click', (e) => { e.preventDefault(); go(true); });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') {
      clearOpening();
      root.classList.add('is-opened');
      state = 'opened';
    }
  });
}

function boot() {
  if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success') root.setAttribute('data-rsvp-replied', '');
    else if (st === 'ready') root.removeAttribute('data-rsvp-replied');
  });
  fitPaper();
  fitNames();
  folds();
  envFit();
  initEnvelope();
  initScenes();
  initCountdown();
  initPlaceholders();
  if (root.classList.contains('from-envelope')) setTimeout(() => accents('arrive', 0, document.querySelector('.hero')), 300);
  const closing = document.querySelector('[data-accents="closing"]');
  if (closing && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); accents('closing', 0, closing); } }, { threshold: .35 });
    io.observe(closing);
  }
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

function devRsvp() {
  document.querySelectorAll('form[data-rsvp-form]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const scope = form.closest('[data-rsvp]') || document;
    scope.querySelectorAll('[data-rsvp-state]').forEach((p) => { p.hidden = p.dataset.rsvpState !== 'preview'; });
  }));
}

// dev fallback: fills the markers like lib/theme/engine.ts
function devRender(content) {
  const PHOTO_SOURCES = { hero_portrait: 'media.hero_portrait', story_1: 'media.memory_photos.0',
    story_2: 'media.memory_photos.1', story_3: 'media.memory_photos.2', venue: 'media.venue_image' };
  const view = JSON.parse(JSON.stringify(content));
  if (view.venue) {
    const join = (a) => a.filter((x) => typeof x === 'string' && x.trim()).join(', ');
    view.venue.city_region = join([view.venue.city, view.venue.region]);
    view.venue.city_region_country = join([view.venue.city, view.venue.region, view.venue.country]);
  }
  try { view.countdown_target_utc = new Date(zonedToUtc(view.date, view.ceremony_time, view.timezone)).toISOString(); } catch (e) {}
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), view);
  const present = (v) => !(v == null || v === false || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length));
  const abs = (p, scope) => (p.startsWith('.') ? (scope ? scope + p : p.slice(1)) : p);
  const fmt = (v, f, path) => {
    if (v == null || typeof v === 'object') return '';
    v = String(v);
    const generic = path.replace(/\.\d+(?=\.|$)/g, '.*');
    if (!f) f = ['date', 'rsvp.deadline'].includes(generic) ? 'date' : ['ceremony_time', 'schedule.*.time'].includes(generic) ? 'time' : 'raw';
    if (/^\d{4}-\d{2}-\d{2}$/.test(v) && f !== 'raw' && f !== 'time') {
      const d = new Date(v + 'T12:00:00Z');
      const o = { weekday: { weekday: 'long' }, month: { month: 'long' }, day: { day: 'numeric' }, year: { year: 'numeric' },
        'date-long': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } }[f] || { month: 'long', day: 'numeric', year: 'numeric' };
      return d.toLocaleDateString('en-US', Object.assign({ timeZone: 'UTC' }, o));
    }
    if (/^\d{2}:\d{2}$/.test(v) && f === 'time') {
      const [h, m] = v.split(':').map(Number);
      return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    }
    return v;
  };
  const fill = (tpl, scope) => tpl.replace(/\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g, (_m, p, f) => fmt(get(abs(p, scope)), f, abs(p, scope)));
  const photoState = (img, url) => {
    const state = url ? 'user' : 'placeholder';
    if (url) { img.removeAttribute('srcset'); img.src = url; }
    img.dataset.photoState = state;
    const slot = img.closest('[data-slot]');
    if (slot) slot.dataset.photoState = state;
  };
  function walk(el, scope) {
    const d = el.dataset;
    if (d.optional !== undefined && !(view.optional_blocks && view.optional_blocks[d.optional] === true)) { el.remove(); return; }
    if (d.if !== undefined) {
      const neg = d.if.startsWith('!');
      if (present(get(abs(d.if.replace(/^!/, ''), scope))) === neg) { el.remove(); return; }
    }
    if (d.repeat !== undefined) {
      const path = abs(d.repeat, scope);
      const list = get(path);
      (Array.isArray(list) ? list : []).forEach((_, i) => {
        const c = el.cloneNode(true);
        delete c.dataset.repeat;
        c.dataset.repeatItem = `${path}.${i}`;
        el.before(c);
        walk(c, `${path}.${i}`);
      });
      el.remove();
      return;
    }
    if (d.field !== undefined) {
      const path = abs(d.field, scope);
      const v = get(path);
      if (el.tagName === 'IMG') photoState(el, v);
      else if (el.tagName === 'A' && path.startsWith('urls.')) {
        if (v) { el.href = v; delete el.dataset.urlMissing; } else { el.setAttribute('href', '#'); el.dataset.urlMissing = ''; }
      } else el.textContent = fmt(v, d.format, path);
      return;
    }
    if (d.text !== undefined) { el.textContent = fill(d.text, scope); return; }
    if (d.calendar !== undefined) { el.setAttribute('href', '#'); el.dataset.urlMissing = ''; }
    if (d.photo !== undefined) photoState(el, get(PHOTO_SOURCES[d.photo] || ''));
    for (const name of Object.keys(d)) {
      if (!name.startsWith('attr') || name.length < 5) continue;
      const attr = name.slice(4).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '');
      el.setAttribute(attr, d[name].includes('{') ? fill(d[name], scope) : String(get(abs(d[name], scope)) ?? ''));
    }
    Array.from(el.children).forEach((c) => walk(c, scope));
  }
  if (document.body.dataset.optional && !(view.optional_blocks || {})[document.body.dataset.optional]) {
    document.body.prepend(Object.assign(document.createElement('p'), { textContent: 'This page is switched off (optional_blocks).' }));
  }
  walk(document.head, null);
  walk(document.body, null);
}
})();
