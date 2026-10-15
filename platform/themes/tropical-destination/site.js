/* Tropical Destination (12, G412); README.md */
const MOTION = {
  // sessionStorage keys (+ ":<slug>") = <head> scripts
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // opening (docs/11 §7.2 "kapak — cüzdan", §7.3; README): [ms after the tap, duration ms]
  envelope: {
    hint: [0, 300],
    tug: [0, 280],
    closure: [0, 1240], // the brass snap pops, the plumeria tab swings away about it and leaves
    head: [160, 600],
    lift: [760, 820], // the rounded flap + strap 0° → 90°
    open: [800, 420], // closed → open wallet
    flap: [1560, 760], // the palm-leaf flap from −90°
    rise: [1840, 1460], // the luggage tag slides up
    accents: 1900,
    forward: [3300, 620],
    go: 4180,
    fadeOut: 420 // without cross-document VT
  },

  // entrances: scene → [[step, delay ms], …]
  scenes: {
    'home-hero': [['decor', 0], ['card', 90], ['names', 760], ['date', 1460], ['venue', 1680], ['countdown', 1960], ['cta', 2240]],
    'home-invite': [['card', 0], ['host', 460], ['name1', 640], ['amp', 1120], ['name2', 1260], ['request', 1760], ['date', 2040], ['venue', 2380], ['cta', 2620], ['cal', 2860]],
    'home-tags': [['sprig', 0], ['tag', 240], ['text', 1100]],
    'home-foot': [['decor', 0], ['sign', 200], ['links', 820]],
    'story-head': [['decor', 0], ['title', 100], ['kicker', 1060], ['lede', 1360]],
    'story-tag': [['tag', 0], ['caption', 1100]],
    'story-next': [['decor', 0], ['sprig', 240], ['link', 640]],
    'details-card': [['decor', 0], ['kicker', 100], ['card', 300], ['title', 860], ['row', 1480], ['cal', 2480]],
    'details-venue': [['photo', 0], ['body', 700], ['dress', 1060], ['action', 1280]],
    'details-block': [['sprig', 0], ['title', 320], ['body', 920], ['action', 1180]],
    'details-faq': [['sprig', 0], ['title', 320], ['item', 980]],
    'details-next': [['decor', 0], ['link', 320]],
    'rsvp-card': [['decor', 0], ['card', 100], ['title', 680], ['kicker', 1380], ['deadline', 1540], ['button', 1820], ['wait', 2080], ['love', 2340], ['sign', 2580], ['snap', 2820], ['venue', 2960]],
    'rsvp-form': [['form', 0]],
    'rsvp-closing': [['decor', 0], ['title', 240], ['line', 920], ['meta', 1180]]
  },
  stagger: 220,  // data-i / repeated rows
  batchGap: 360,  // scenes entering together
  arriveDelay: 0,

  // particles (docs/11 §8, README): "a monstera leaf and a white plumeria drift across the screen" (one each, across);
  // `band` = the height band of the flight (share of the screen / host), `avoid` lanes beside, `host` behind its text
  accents: {
    open: [{ file: 'img/accent_2-200.webp', count: 1, path: 'across', origin: 'left', band: [.18, .26], dur: [2160, 2160], size: [58, 66] },
           { file: 'img/accent_1-200.webp', count: 1, path: 'across', origin: 'right', band: [.66, .74], dur: [2200, 2200], size: [42, 48], gap: 260 }],
    arrive: [{ file: 'img/accent_1-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6000, 7200], size: [22, 28], spread: 1400, avoid: '.hero-inner > *', host: '.hero' }],
    closing: [{ file: 'img/accent_1-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 8000], size: [22, 28], spread: 1600, avoid: '.closing > p, .closing > h2', host: '.closing' },
              { file: 'img/accent_2-200.webp', count: 1, path: 'across', origin: 'right', band: [.12, .2], dur: [5600, 5600], size: [54, 54], spread: 600, avoid: '.closing > p, .closing > h2', host: '.closing' }]
  }
};

/* manifest stage.card_path */
const ENVELOPE_GEOMETRY = { out: 'translateY(-74.878%)', front: 'translateY(-71.878%) scale(1.05)' };

/* = content.demo.json */
const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Maya', full_name: 'Maya Leilani' }, { display_name: 'Kai', full_name: 'Kai Andrew' }],
  name_display: 'Maya & Kai', initials: 'M&K', host_line: 'Together with their families',
  date: '2027-06-19', ceremony_time: '16:00', timezone: 'Pacific/Honolulu',
  venue: { name: 'Coral Bay Resort', city: 'Wailea', region: 'Hawaii', country: 'USA', address: null },
  schedule: [{ label: 'Ceremony', time: '16:00', location: 'The Ocean Lawn' }, { label: 'Cocktail Hour', time: '17:00', location: 'The Sunset Deck' },
    { label: 'Reception', time: '18:30', location: 'The Palm Pavilion' }],
  dress_code: 'Beach formal',
  rsvp: { deadline: '2027-05-08', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: { intro: 'Every adventure and every island sunset has brought us closer to',
    items: [{ caption: 'Island time' }, { caption: 'End of the pier' }, { caption: 'Next stop: forever' }] }
};

(function () {
'use strict';
const $ = (q) => document.querySelector(q), $$ = (q) => document.querySelectorAll(q);
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
const BASE = (document.currentScript && document.currentScript.src) || document.baseURI;
const asset = (p) => new URL(p, BASE).href;

/* -- data */
function readSiteData() {
  const el = document.getElementById('site-data');
  if (!el) return null;
  try { return JSON.parse(el.textContent); } catch (e) { return null; }
}
const SITE = readSiteData();
const CONTENT = SITE ? {} : DEV_CONTENT; // the platform sends no record
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY;
const ARRIVE = MOTION.storage.arrive + KEY;

const store = { set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
const rand = (a, b) => a + Math.random() * (b - a);

/* -- accents */
const rects = (sel) => [...$$(sel)].filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect()).filter((r) => r.width);
function flightPath(g, R, s, i) {
  const F = (v) => v.toFixed(1), kf = [], N = 14, ph = rand(0, 6.28);
  const av = g.avoid ? rects(g.avoid) : [];
  if (g.path === 'across') {
    // a leaf / flower carried across on the breeze: from one side to the other, a slow wave, turning
    const [b0, b1] = g.band || [.2, .3], y0 = R.height * rand(b0, b1), dir = g.origin === 'left' ? 1 : -1;
    if (y0 > R.height - s) return null;
    const lift = rand(-.06, -.02) * R.height, amp = rand(12, 20), r0 = rand(-30, 30), spin = dir * rand(70, 120);
    for (let k = 0; k <= N; k++) {
      const t = k / N, x = dir > 0 ? -s * 1.3 + (R.width + s * 2.6) * t : R.width + s * .3 - (R.width + s * 2.6) * t;
      const y = y0 + lift * t + Math.sin(t * 6.6 + ph) * amp;
      kf.push({ transform: `translate3d(${F(x)}px, ${F(y)}px, 0) rotate(${F(r0 + spin * t + Math.sin(t * 7 + ph) * 12)}deg) rotateY(${F(Math.sin(t * 9 + ph) * 46)}deg)`,
        opacity: k && k < N ? .97 : 0, offset: t });
    }
    return kf;
  }
  // 'fall': drifting down in a lane beside the text
  let y0 = -s - 10, y1 = R.height * rand(.72, .86), ln = [[0, R.width - s]];
  const ab = Math.max(0, ...av.map((r) => r.bottom - R.top));
  if (av.length) {
    const l = Math.min(...av.map((r) => r.left)) - R.left - 8, r = Math.max(...av.map((r) => r.right)) - R.left + 8;
    ln = [[0, l - s], [r, R.width - s]].filter(([a, b]) => b - a > 2);
    if (!ln.length && g.host) { y0 = ab + 8; ln = [[0, R.width - s]]; if (y1 < y0 + 80) y1 = R.height - s; }
  }
  if (!ln.length || y1 < y0 + 40) return null;
  const [a, b] = ln[i % ln.length], sway = Math.min(rand(12, 24), (b - a) / 2), x0 = rand(a + sway, b - sway);
  const r0 = rand(0, 360), r1 = r0 + rand(-160, 160);
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    kf.push({ transform: `translate3d(${F(x0 + Math.sin(t * 6.28 + ph) * sway)}px, ${F(y0 + (y1 - y0) * t)}px, 0) rotate(${F(r0 + (r1 - r0) * t)}deg) rotateX(${F(Math.sin(t * 8 + ph) * 40)}deg)`,
      opacity: .95 * Math.min(1, t / .12, (1 - t) / .2), offset: t });
  }
  return kf;
}
function accents(moment, until) {
  const groups = MOTION.accents[moment];
  if (reduce || !groups || !Element.prototype.animate) return;
  groups.forEach((g) => {
    const host = g.host && $(g.host);
    if (g.host && !host) return;
    const box = host || document.body;
    let layer = box.querySelector(':scope > .accent-layer');
    if (!layer) {
      layer = Object.assign(document.createElement('div'), { className: 'accent-layer' + (host ? ' in-host' : '') });
      layer.setAttribute('aria-hidden', 'true');
      const first = host && host.querySelector(':scope > .scene-bg, :scope > .page-corner');
      if (first) first.after(layer); else box.append(layer);
    }
    const R = host ? host.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    for (let i = 0; i < g.count; i++) {
      const s = rand(g.size[0], g.size[1]), kf = flightPath(g, R, s, i);
      if (!kf) continue;
      const img = Object.assign(new Image(), { src: asset(g.file), alt: '', decoding: 'async' });
      img.style.width = s.toFixed(1) + 'px';
      layer.append(img);
      const delay = (g.gap || 0) + i * 520 + rand(0, g.spread || 0);
      const a = img.animate(kf, { duration: Math.max(600, Math.min(rand(g.dur[0], g.dur[1]), (until || 1e9) - delay)), delay, easing: 'linear', fill: 'both' });
      a.onfinish = () => img.remove();
    }
  });
}

/* -- scenes */
// data-i, else the data-repeat index ("schedule.2")
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
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
  const scenes = [...$$('[data-scene]')];
  if (!scenes.length) return;
  if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => reveal(s, 0, true)); return; }
  const arrived = root.classList.contains('from-envelope');
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1)).forEach((s, i) => {
      io.unobserve(s);
      let base = i * MOTION.batchGap;
      if (arrived && s.dataset.scene === 'home-hero') base += MOTION.arriveDelay;
      reveal(s, base, false);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  scenes.forEach((s) => io.observe(s));
}

/* -- countdown */
function zonedToUtc(date, time, tz) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const off = (ts) => { const p = {}; f.formatToParts(new Date(ts)).forEach((x) => { p[x.type] = +x.value; }); return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - ts; };
  const [y, m, d] = date.split('-').map(Number), [hh, mm] = time.split(':').map(Number), wall = Date.UTC(y, m - 1, d, hh, mm);
  let t = wall;
  for (let i = 0; i < 3; i++) t = wall - off(t);
  return t;
}
function countdownTarget() {
  if (SITE) { const t = SITE.derived && Date.parse(SITE.derived.countdown_target_utc); return Number.isFinite(t) ? t : null; }
  try { return zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); } catch (e) { return Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }
}
function initCountdown() {
  $$('[data-countdown]').forEach((box) => {
    const target = countdownTarget();
    if (target === null) { box.hidden = true; return; }
    box.dataset.targetUtc = new Date(target).toISOString();
    const cells = {}, pad = (n) => String(n).padStart(2, '0');
    box.querySelectorAll('[data-unit]').forEach((el) => { cells[el.dataset.unit] = el; });
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.classList.add('is-done');
        const today = -diff < 43200000; // started < 12 h ago
        box.querySelectorAll('.cd-done').forEach((p) => { p.hidden = (p.dataset.when === 'today') !== today; });
        return false;
      }
      const s = Math.floor(diff / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      cells.seconds.textContent = pad(s % 60);
      return true;
    };
    if (tick()) { const h = setInterval(() => { if (!tick()) clearInterval(h); }, 1000); }
  });
}

/* -- links without a URL */
function initPlaceholders() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-url-missing]');
    if (!a) return;
    e.preventDefault();
    let t = $('.toast');
    if (!t) { t = Object.assign(document.createElement('div'), { className: 'toast' }); t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = a.dataset.pending || document.body.dataset.pending || '';
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2800);
  });
}

/* -- long names, the first screen, tag copy, decor vs text (README) */
let refit = () => {};
function fitNames() {
  const targets = [['.env-head .names', 2.15, 0.22, 0], ['.hero .names', 3.2, 0.3, 32]]
    .map(([sel, ...a]) => [$(sel), ...a]).filter(([el]) => el);
  const inner = $('.hero-inner'), nav = $('.site-nav');
  const lay = (el) => { let x = 0, y = 0; for (let e = el; e; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
  const bottom = (el) => { const b = lay(el); return b.y + b.h; };
  const top = (el) => lay(el).y;
  // the first screen = svh
  const sv = () => { const p = document.createElement('i'); p.style.cssText = 'position:fixed;height:100svh'; document.body.append(p); const h = p.offsetHeight; p.remove(); return h || innerHeight; };
  const navH = () => (nav ? nav.offsetHeight : 0);
  const low = (h1) => {
    const hero = h1.closest('.hero');
    if (!hero || !inner || !nav) return false;
    return Math.max(...[...inner.children].filter((c) => c.offsetParent).map(bottom)) > sv() - navH() - 8;
  };
  const fit = (h1, maxLines, maxShare, minPx, navFloor) => {
    h1.style.setProperty('--names-scale', '1');
    const min = Math.min(1, Math.max(0.4, minPx / parseFloat(getComputedStyle(h1).fontSize)));
    for (let s = 1; ; s = Math.max(min, s - 0.06)) {
      h1.style.setProperty('--names-scale', s.toFixed(3));
      const h = h1.getBoundingClientRect().height, lines = h / (parseFloat(getComputedStyle(h1).fontSize) * 1.1);
      if (s <= min || (lines <= maxLines && h <= innerHeight * maxShare && (s <= navFloor || !low(h1)))) break;
    }
  };
  // tag copy ≥ 11 px: one line, two, no town, a long date may break, no script
  const fits = (c) => {
    const k = [...c.children].filter((p) => p.offsetParent);
    return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
      && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
  };
  const oneLine = (c) => { const k = c.querySelector('.kicker'); return !k || k.offsetHeight <= parseFloat(getComputedStyle(k).lineHeight) * 1.5; };
  const fitCopy = () => $$('.card-copy').forEach((c) => {
    for (const [wrap, d] of [[false, ''], [true, ''], [true, 'c'], [true, 'c n'], [true, 'c s n']]) {
      c.toggleAttribute('data-wrap', wrap);
      c.dataset.drop = d;
      if (fits(c) && (wrap || oneLine(c))) break;
    }
  });
  // fold: a hero piece crossing the nav line starts below the first screen; a pill above keeps the backdrop (--fold)
  const pieces = () => [...inner.children].filter((c) => c.offsetParent && !c.matches('.hero-card'));
  const unfold = (hero) => {
    pieces().forEach((c) => c.style.removeProperty('margin-top'));
    hero.style.removeProperty('--fold');
  };
  const fold = (hero) => {
    const v = sv(), limit = v - navH() - 8, below = v + 12, cs = getComputedStyle(hero);
    const cut = () => pieces().filter((c) => bottom(c) > limit).sort((a, b) => top(a) - top(b))[0];
    let c = cut();
    if (!c || top(c) >= below - 0.5) return;
    const cta = inner.querySelector('.hero-cta'), keep = cta && cta.offsetParent && bottom(cta) <= limit;
    const end = keep && Math.max(parseFloat(cs.minHeight) || 0, bottom(cta) - top(hero) + parseFloat(cs.paddingBottom));
    for (let i = 0; i < 6 && c && top(c) < below - 0.5; i++, c = cut()) c.style.marginTop = `${parseFloat(getComputedStyle(c).marginTop) + below - top(c)}px`;
    if (keep) hero.style.setProperty('--fold', `${Math.max(0, hero.offsetHeight - end)}px`);
  };
  // envelope: --pt keeps the wallet's empty room (open flap, rising tag) on screen; --ok shrinks the stage till the hint is
  const envFit = (h1) => {
    const pg = h1.closest('.env-page'), st = pg.querySelector('.stage'), hint = pg.querySelector('.env-hint'), head = h1.parentElement;
    pg.style.removeProperty('--ok'); pg.style.removeProperty('--pt');
    for (let k = 1; ; k -= .05) {
      pg.style.setProperty('--ok', k.toFixed(2));
      fit(h1, 2.15, 0.22, 0, 0);
      if (root.classList.contains('is-opened')) return;
      const room = st.offsetWidth * .90829, g = parseFloat(getComputedStyle(st).marginTop) + room; // closed_obj.top_frac_of_stage_w
      pg.style.setProperty('--pt', `${(room - head.offsetHeight - g).toFixed(1)}px`);
      if (k < .6 || (top(st) >= -0.5 && bottom(hint) <= sv() - 6)) return;
    }
  };
  // decor: a cluster never under text (16 × 16 leaf map: shrinks, else hides); a loose flower on text or a card hides
  const MAP = { tl: '1ffc7ffe7ffffffffffffff7fff0ff00ff00ff00f700f200e000e00060006000', br: '0008000f001f001f001f001f007f007f03ff03ff0fff1fff7fffffffffff7fff' };
  const textBox = (el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const rs = [...rg.getClientRects()].filter((r) => r.width && r.height), b = el.getBoundingClientRect(), L = lay(el);
    if (!rs.length) return null;
    const dx = L.x - b.left, dy = L.y - b.top, x = Math.min(...rs.map((r) => r.left)) + dx, y = Math.min(...rs.map((r) => r.top)) + dy;
    return { x: x - 4, y: y - 4, w: Math.max(...rs.map((r) => r.right)) + dx - x + 8, h: Math.max(...rs.map((r) => r.bottom)) + dy - y + 8 };
  };
  const meet = (c, t) => [Math.max(c.x, t.x), Math.max(c.y, t.y), Math.min(c.x + c.w, t.x + t.w), Math.min(c.y + c.h, t.y + t.h)];
  const under = (c, t, m) => {
    const [x0, y0, x1, y1] = meet(c, t), f = (v, o, s) => Math.max(0, Math.min(16, (v - o) / s * 16));
    for (let j = Math.floor(f(y0, c.y, c.h)); j < f(y1, c.y, c.h); j++) {
      for (let i = Math.floor(f(x0, c.x, c.w)); i < f(x1, c.x, c.w); i++) if (parseInt(m.substr(j * 4, 4), 16) >> (15 - i) & 1) return true;
    }
    return false;
  };
  const decor = () => $$('.scene-bg, .page-bg').forEach((bg) => {
    const scope = bg.closest('.hero') || bg.closest('main') || document.body;
    const ts = [...scope.querySelectorAll('h1, h2, p, figcaption, .cd-cell, .btn, .replay')]
      .filter((t) => t.offsetParent && !t.closest('.card, .paper, .reply-box, .site-nav, .scene-bg, .page-bg') && !t.querySelector('p, .cd-cell'))
      .map(textBox).filter(Boolean);
    const solid = ts.concat([...scope.querySelectorAll('.card, .paper, .tag-art, .venue-tag, .stage')].map(lay));
    bg.querySelectorAll('.corner').forEach((c) => {
      const br = c.classList.contains('corner-br'), m = MAP[br ? 'br' : 'tl'];
      c.style.removeProperty('--cw'); c.style.visibility = '';
      const w0 = c.offsetWidth;
      for (let k = .94; ts.some((t) => under(lay(c), t, m)); k -= .06) {
        if (k < .55) { c.style.visibility = 'hidden'; break; }
        c.style.setProperty('--cw', `${(w0 * k).toFixed(1)}px`);
      }
    });
    bg.querySelectorAll('.float').forEach((f) => {
      f.style.visibility = '';
      if (solid.some((t) => { const [x0, y0, x1, y1] = meet(lay(f), t); return x0 < x1 && y0 < y1; })) f.style.visibility = 'hidden';
    });
  });
  // hero: names ≤ 30 %, tight, ≥ 32 px, else it scrolls; fold
  const run = () => {
    fitCopy();
    targets.forEach(([h1, maxLines, maxShare, minPx]) => {
      const hero = h1.closest('.hero');
      if (!hero) return envFit(h1);
      if (inner && nav) unfold(hero);
      for (const [cls, navFloor] of [[[], 0.76], [['is-tight'], 0], [[], 1]]) {
        hero.classList.remove('is-tight');
        hero.classList.add(...cls);
        fit(h1, maxLines, maxShare, minPx, navFloor);
        if (!low(h1)) break;
      }
      if (inner && nav) fold(hero);
    });
    decor();
  };
  refit = run;
  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  addEventListener('load', run);
  if (window.ResizeObserver) { const ro = new ResizeObserver(fitCopy); $$('.card-copy').forEach((c) => ro.observe(c)); }
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
}

/* -- envelope (index page) */
function initEnvelope() {
  const page = $('.env-page');
  if (!page) return;
  const q = (s) => page.querySelector(s);
  const stage = q('.stage');
  const el = {
    env: q('.env'), cflap: q('.env-cflap'), closure: q('.closure'), closed: q('.env-closed'), flap: q('.env-flap'),
    body: q('.env-body'), pocket: q('.env-pocket'), slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
  };
  const E = MOTION.envelope;
  const replay = /[?&]replay=1(&|$)/.test(location.search);
  if (replay) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [];

  function prefetchHome() {
    if ($('link[data-prefetch]')) return;
    const l = Object.assign(document.createElement('link'), { rel: 'prefetch', href: PAGES.home });
    l.dataset.prefetch = '1';
    document.head.append(l);
  }
  if ('requestIdleCallback' in window) requestIdleCallback(prefetchHome, { timeout: 2500 }); else setTimeout(prefetchHome, 1500);

  function go(withCard) {
    store.set(OPENED, '1');
    if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
    else el.card.style.viewTransitionName = 'none';
    if (crossDocVT || reduce) { location.href = PAGES.home; return; }
    page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    const layer = $('.accent-layer');
    if (layer) layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }

  const A = (node, kf, [delay, duration], easing, fill) =>
    node && node.animate(kf, { delay, duration, easing: easing || 'cubic-bezier(.22,.61,.36,1)', fill: fill || 'both' });

  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    prefetchHome();
    if (reduce || !Element.prototype.animate) { go(false); return; }
    A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
    A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .4 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
    // the snap pops (scale up off the strap), then the plumeria tab swings away about the snap (transform-origin =
    // closure.pivot_in_crop_pct), swings back a little like a pendulum and leaves past the screen's right edge
    const SW = stage.offsetWidth, cr = el.closure.getBoundingClientRect(), out = innerWidth - cr.left + cr.width * .15;
    const T = (x, y, a, s, o) => Object.assign({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${a}deg) scale(${s})` }, o);
    A(el.closure, [
      T(0, 0, 0, 1, { easing: 'cubic-bezier(.3,.7,.4,1)' }),
      T(0, -SW * .014, -5, 1.08, { offset: .13, easing: 'cubic-bezier(.5,0,.6,1)' }),
      T(SW * .004, 0, 0, 1, { offset: .22, easing: 'cubic-bezier(.35,0,.45,1)' }),
      T(SW * .05, SW * .04, 72, 1, { offset: .52, easing: 'cubic-bezier(.4,0,.6,1)' }),
      T(SW * .08, SW * .05, 54, 1, { offset: .66, easing: 'cubic-bezier(.55,0,1,.7)' }),
      T(out, SW * .22, 132, 1, { offset: .98, opacity: 1 }),
      T(out, SW * .22, 132, 1, { opacity: 0 })
    ], E.closure, 'linear', 'forwards');
    A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
    // the rounded flap and its strap lift on the hinge, fading from 82°
    const X = (a, b, o, p = 1000) => ({ opacity: o, transform: `perspective(${p}px) rotateX(${a}deg)`, filter: `brightness(${b})` });
    A(el.cflap, [
      { ...X(0, 1, 1), easing: 'cubic-bezier(.33,.1,.35,1)' },
      { ...X(24, 1.01, 1), offset: .3, easing: 'cubic-bezier(.4,0,.7,.7)' },
      { ...X(82, .9, 1), offset: .9 },
      X(90, .86, 0)
    ], E.lift, 'linear');
    A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
    A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
    A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
    // the palm-leaf flap takes over at −90°
    A(el.flap, [X(-90, .88, 1, 1100), X(0, 1, 1, 1100)], E.flap, 'cubic-bezier(.2,.7,.3,1)');
    timers.push(setTimeout(() => accents('open', E.go - E.accents - 40), E.accents));
    A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.42,0,.18,1)');
    timers.push(setTimeout(() => {
      el.slot.style.clipPath = 'none';
      el.slot.style.zIndex = '6';
      A(el.card, [{ transform: ENVELOPE_GEOMETRY.out, filter: 'drop-shadow(0 6px 8px rgba(20,70,60,.14))' }, { transform: ENVELOPE_GEOMETRY.front, filter: 'drop-shadow(0 22px 26px rgba(20,70,60,.24))' }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
    }, E.forward[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }

  function cancelScripted() {
    page.getAnimations({ subtree: true }).filter((a) => !(window.CSSAnimation && a instanceof CSSAnimation)).forEach((a) => a.cancel());
  }
  function clearOpening() {
    timers.splice(0).forEach(clearTimeout);
    cancelScripted();
    el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
    el.card.style.viewTransitionName = '';
    const layer = $('.accent-layer');
    if (layer) layer.remove();
  }
  function reset() {
    clearOpening();
    root.classList.remove('is-opened');
    state = 'closed';
    refit();
  }

  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); }
  });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  const rep = q('.replay');
  if (rep) rep.addEventListener('click', () => { reset(); requestAnimationFrame(() => play()); });
  const enter = q('[data-enter]');
  if (enter) enter.addEventListener('click', (e) => { e.preventDefault(); go(true); });

  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') {
      clearOpening();
      root.classList.add('is-opened');
      state = 'opened';
      refit();
    }
  });
}

/* -- boot */
function boot() {
  if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
  document.addEventListener('rsvp:state', (e) => { const st = e.detail && e.detail.state; if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success'); });
  fitNames();
  initEnvelope();
  initScenes();
  initCountdown();
  initPlaceholders();
  if (root.classList.contains('from-envelope')) setTimeout(() => accents('arrive'), 300);
  const closing = $('[data-accents="closing"]');
  if (closing && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); accents('closing'); } }, { threshold: .35 });
    io.observe(closing);
  }
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

/* dev: nothing is posted */
function devRsvp() {
  $$('form[data-rsvp-form]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    (form.closest('[data-rsvp]') || document).querySelectorAll('[data-rsvp-state]').forEach((p) => { p.hidden = p.dataset.rsvpState !== 'preview'; });
  }));
}

/* == dev fallback (as lib/theme/engine.ts) */
function devRender(content) {
  const PHOTO_SOURCES = { hero_portrait: 'media.hero_portrait', story_1: 'media.memory_photos.0',
    story_2: 'media.memory_photos.1', story_3: 'media.memory_photos.2', venue: 'media.venue_image' }; // = theme.json
  const view = JSON.parse(JSON.stringify(content)), vn = view.venue;
  const join = (a) => a.filter((x) => x?.trim?.()).join(', ');
  if (vn) { vn.city_region = join([vn.city, vn.region]); vn.city_region_country = join([vn.city, vn.region, vn.country]); }
  view.copy = {}; // {copy.<key>} = the page's [data-copy] text (G068)
  $$('[data-copy]').forEach((e) => { view.copy[e.dataset.copy] ??= e.textContent.trim(); });
  try { view.countdown_target_utc = new Date(zonedToUtc(view.date, view.ceremony_time, view.timezone)).toISOString(); } catch { /* none */ }
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), view);
  const present = (v) => !(v == null || v === false || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length));
  const abs = (p, scope) => (p.startsWith('.') ? (scope ? scope + p : p.slice(1)) : p);
  const fmt = (v, f, path) => {
    if (v == null || typeof v === 'object') return '';
    v = String(v);
    const g = path.replace(/\.\d+(?=\.|$)/g, '.*'), L = 'long', N = 'numeric';
    f = f || (['date', 'rsvp.deadline'].includes(g) ? 'date' : ['ceremony_time', 'schedule.*.time'].includes(g) ? 'time' : 'raw');
    if (/^\d{4}-\d{2}-\d{2}$/.test(v) && f !== 'raw' && f !== 'time') {
      const o = { weekday: { weekday: L }, month: { month: L }, day: { day: N }, year: { year: N }, 'date-long': { weekday: L, month: L, day: N, year: N } }[f];
      return new Date(v + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...(o || { month: L, day: N, year: N }) });
    }
    if (/^\d{2}:\d{2}$/.test(v) && f === 'time') { const [h, m] = v.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; }
    return v;
  };
  const fill = (tpl, scope) => tpl.replace(/\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g, (_m, p, f) => fmt(get(abs(p, scope)), f, abs(p, scope)));
  const photoState = (img, url) => {
    if (url) { img.removeAttribute('srcset'); img.src = url; }
    [img, img.closest('[data-slot]')].forEach((e) => { if (e) e.dataset.photoState = url ? 'user' : 'placeholder'; });
  };
  function walk(el, scope) {
    const d = el.dataset;
    if (d.optional !== undefined && !(view.optional_blocks && view.optional_blocks[d.optional] === true)) { el.remove(); return; }
    if (d.if?.split(' ').some((c) => present(get(abs(c.replace('!', ''), scope))) === (c[0] === '!'))) return el.remove(); // all hold (G075)
    if (d.repeat !== undefined) {
      const path = abs(d.repeat, scope), list = get(path);
      (Array.isArray(list) ? list : []).forEach((_, i) => {
        const c = el.cloneNode(true);
        delete c.dataset.repeat;
        el.before(c);
        walk(c, c.dataset.repeatItem = `${path}.${i}`);
      });
      return el.remove();
    }
    if (d.field !== undefined) {
      const path = abs(d.field, scope), v = get(path);
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
    [...el.children].forEach((c) => walk(c, scope));
  }
  if (document.body.dataset.optional && !(view.optional_blocks || {})[document.body.dataset.optional]) {
    document.body.prepend(Object.assign(document.createElement('p'), { textContent: 'This page is switched off (optional_blocks).' }));
  }
  walk(document.head, null);
  walk(document.body, null);
}
})();
