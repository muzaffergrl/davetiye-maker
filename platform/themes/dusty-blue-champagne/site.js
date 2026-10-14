/* Dusty Blue & Champagne (02, G402) — README.md */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  envelope: { // [start ms after the tap, duration ms]
    hint: [0, 300],
    tug: [0, 260],
    closure: [0, 1250],
    fall: [230, 1020],
    head: [180, 620],
    lift: [520, 820],
    open: [560, 380],
    flap: [1340, 780],
    rise: [1680, 1420],
    forward: [3100, 780],
    accents: 1400,
    go: 3650,
    glide: [300, 900],
    fadeOut: 420
  },

  scenes: { // scene → [[step, delay ms], …]
    'home-hero': [['decor', 0], ['card', 120], ['names', 620], ['date', 1380], ['venue', 1580], ['countdown', 1820], ['cta', 2120]],
    'home-invite': [['host', 0], ['card', 140], ['name1', 700], ['amp', 1180], ['name2', 1320], ['words', 1640], ['request', 2080], ['date', 2320], ['sprig', 2540], ['venue', 2720]],
    'home-cal': [['cal', 0]],
    'home-chapter': [['fig', 0], ['text', 560]],
    'home-foot': [['decor', 0], ['sign', 150], ['links', 860]],
    'story-head': [['decor', 0], ['title', 120], ['kicker', 1040], ['lede', 1320]],
    'story-print': [['print', 0], ['caption', 1050]],
    'story-next': [['decor', 0], ['sprig', 150], ['link', 560]],
    'details-card': [['decor', 0], ['kicker', 140], ['card', 340], ['title', 900], ['row', 1420]],
    'details-venue': [['photo', 0], ['body', 640], ['dress', 920], ['cal', 1140], ['action', 1340]],
    'details-block': [['sprig', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq': [['sprig', 0], ['title', 300], ['item', 950]],
    'details-next': [['decor', 0], ['link', 300]],
    'rsvp-card': [['decor', 0], ['card', 120], ['title', 700], ['kicker', 1300], ['button', 1640], ['sprig', 1880], ['wait', 2120], ['love', 2360], ['sign', 2600], ['seal', 2940]],
    'rsvp-form': [['form', 0]],
    'rsvp-closing': [['decor', 0], ['sprig', 150], ['title', 420], ['line', 1080], ['meta', 1320]]
  },
  stagger: 190,
  batchGap: 420,
  arriveDelay: 0,

  accents: {
    open:    [{ file: 'img/accent_1-149.webp', count: 1, path: 'fall', origin: 'top', dur: [2700, 2700], size: [44, 52], spread: 0, avoid: '.env .card' }],
    arrive:  [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 7600], size: [20, 26], spread: 1600,
      host: '.hero', avoid: '.hero-card, .hero .btn, .cd-cell', ink: '.hero .names, .hero-date, .hero-venue, .hero-city' }],
    closing: [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 7800], size: [20, 26], spread: 1500,
      host: '.closing', avoid: '.closing .sprig', ink: '.closing h2, .closing p' },
              { file: 'img/accent_1-149.webp', count: 1, path: 'fall', origin: 'top', dur: [6000, 6000], size: [34, 34], spread: 900,
      host: '.closing', avoid: '.closing .sprig', ink: '.closing h2, .closing p' }]
  }
};

const ENVELOPE_GEOMETRY = { out: 'translateY(-91.99%)', front: 'translateY(-95.49%) scale(1.09)' };

const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Eleanor', full_name: 'Eleanor Grace' }, { display_name: 'Theo', full_name: 'Theodore James' }],
  name_display: 'Eleanor & Theo', initials: 'E&T', host_line: 'Together with their families',
  date: '2027-09-18', ceremony_time: '16:30', timezone: 'America/New_York',
  venue: { name: 'Rosewood Manor', city: 'Charleston', region: 'South Carolina', country: 'USA', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:30', location: 'The Garden Lawn' },
    { label: 'Cocktail Hour', time: '17:30', location: 'The Veranda' },
    { label: 'Reception', time: '18:30', location: 'The Grand Hall' }
  ],
  dress_code: 'Black tie optional',
  rsvp: { deadline: '2027-08-01', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Coffee dates, sea breezes and all the quiet moments in between brought us to',
    items: [{ caption: 'Our first coffee' }, { caption: 'Sunset by the sea' }, { caption: 'Ever after' }]
  }
};

(function () {
'use strict';
const $ = (s) => document.querySelector(s), $$ = (s) => document.querySelectorAll(s);
const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
const BASE = document.currentScript?.src || document.baseURI;
const asset = (p) => new URL(p, BASE).href;

const SITE = (() => { try { return JSON.parse(document.getElementById('site-data').textContent); } catch { return null; } })();
const CONTENT = SITE ? {} : DEV_CONTENT;
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY, ARRIVE = MOTION.storage.arrive + KEY;

const store = { set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private */ } } };
const rand = (a, b) => a + Math.random() * (b - a);

/* accents (README) */
function flightPath(path, W, H, s, i, col, rs) {
  const kf = [], N = 12, down = path !== 'rise', ph = rand(0, 6.28);
  let sway = rand(14, 30), x0 = rand(0.06, 0.94) * W, drift = rand(-0.16, 0.16) * W, y1 = H + s + 10;
  if (rs) {
    let best = -1;
    sway = 8; drift = 0;
    for (let k = 0; k < 8; k++) {
      const x = (i % 2) * W / 2 + rand(0, W / 2 - s), m = sway + s * 0.25 + 6;
      const y = Math.min(H, ...rs.filter((r) => r.left < x + s + m && r.right > x - m && r.bottom > 0).map((r) => r.top - 8));
      if (y > best) { best = y; x0 = x; }
    }
    if (best < 120) return null;
    y1 = best - s;
  } else if (col) {
    const lanes = [[0, col[0] - 8], [col[1] + 8, W]].sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]));
    const [a, b] = lanes[1][1] - lanes[1][0] >= 40 ? lanes[i % 2] : lanes[0];
    s = Math.max(28, Math.min(s, b - a - 8));
    sway = Math.min(sway, Math.max(0, (b - a - s) / 2));
    x0 = (a + b - s) / 2 + rand(-1, 1) * Math.max(0, (b - a - s) / 2 - sway); drift = 0;
  }
  const r0 = rand(-30, 30), r1 = r0 + rand(-160, 160), len = y1 + s + 10;
  for (let k = 0; k <= N; k++) {
    const t = k / N, x = x0 + drift * t + Math.sin(t * 6.28 * 1.1 + ph) * sway, y = down ? -s - 10 + len * t : H + s + 10 - len * t;
    kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * t).toFixed(1)}deg) rotateY(${(Math.sin(t * 7 + ph) * 55).toFixed(1)}deg)`,
      opacity: k === 0 ? 0 : (k === N ? (rs ? 0 : 0.5) : 0.96), offset: t });
  }
  return { kf, s, f: len / (H + 2 * s + 20) };
}
function accents(moment, until) {
  const groups = MOTION.accents[moment];
  if (reduce || !groups || !Element.prototype.animate) return;
  const all = (sel) => [...(sel ? $$(sel) : [])];
  groups.forEach((g) => {
    const host = g.host ? $(g.host) : document.body;
    if (!host) return;
    let layer = host.querySelector(':scope > .accent-layer');
    if (!layer) (layer = host.appendChild(Object.assign(document.createElement('div'), { className: 'accent-layer' + (g.host ? ' in-host' : '') }))).setAttribute('aria-hidden', 'true');
    const R = g.host ? host.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    const rs = all(g.avoid).map((e) => e.getBoundingClientRect()).concat(...all(g.ink).map((e) => {
      const r = document.createRange();
      r.selectNodeContents(e);
      return [...r.getClientRects()];
    })).filter((r) => r.width).map((r) => ({ left: r.left - R.left, right: r.right - R.left, top: r.top - R.top, bottom: r.bottom - R.top }));
    const col = rs.length && [Math.min(...rs.map((r) => r.left)), Math.max(...rs.map((r) => r.right))];
    for (let i = 0; i < g.count; i++) {
      const fp = flightPath(g.path, R.width, R.height, rand(g.size[0], g.size[1]), i, col, g.host && rs);
      if (!fp) continue;
      const { kf, s, f } = fp;
      const img = Object.assign(new Image(), { src: asset(g.file), alt: '', decoding: 'async' });
      img.style.width = s.toFixed(1) + 'px';
      layer.appendChild(img);
      const delay = i * (g.gap || 420) + rand(0, g.spread || 0);
      const a = img.animate(kf, { duration: Math.min(rand(g.dur[0], g.dur[1]) * f, (until || 1e9) - delay), delay, easing: 'linear', fill: 'both' });
      a.onfinish = () => img.remove();
    }
  });
}

/* -- scenes */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    if (instant) n.classList.add('done');
    else {
      n.style.transitionDelay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger + 'ms';
      n.addEventListener('transitionend', (e) => { if (e.target === n) n.classList.add('done'); });
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
    entries.filter((e) => e.isIntersecting).map((e) => e.target).sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1)).forEach((s, i) => {
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
  try { return zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); } catch { return Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }
}
function initCountdown() {
  $$('[data-countdown]').forEach((box) => {
    const target = countdownTarget();
    if (target === null) { box.hidden = true; return; }
    box.dataset.targetUtc = new Date(target).toISOString();
    const cells = {}, pad = (n) => String(n).padStart(2, '0');
    box.querySelectorAll('[data-unit]').forEach((el) => { cells[el.dataset.unit] = el; });
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.classList.add('is-done');
        const today = -diff < 432e5; // < 12 h
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

/* -- links without a URL */
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast' })); t.setAttribute('role', 'status'); }
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

/* text fitting */
const fontPx = (el) => parseFloat(getComputedStyle(el).fontSize);
const shrink = (el, min, d, over) => { el.style.setProperty('--fit', '1'); for (let f = 1; f > min && over();) el.style.setProperty('--fit', (f = Math.max(min, f - d)).toFixed(3)); };
const wide = (el) => el.scrollWidth > el.clientWidth + 1;
function fitLines() {
  // [data-fit="n"]: ≤ n lines of its CSS size
  $$('[data-fit]:not(.names)').forEach((el) => {
    el.style.setProperty('--fit', '1');
    const h = (parseFloat(el.dataset.fit) || 2) * fontPx(el) * 1.16 + 1;
    shrink(el, .5, .05, () => el.offsetHeight > h);
  });
  $$('.rsvp-text .card-title').forEach((el) => shrink(el, .6, .04, () => wide(el)));
  $$('.cap, .mini-cap').forEach((el) => {
    el.classList.remove('cap-hide');
    el.style.setProperty('--fit', '1');
    const over = () => el.scrollHeight > el.clientHeight + 1 || wide(el);
    shrink(el, Math.ceil(Math.max(0.5, 11 / fontPx(el)) * 1000) / 1000, .05, over); // ≥ 11 px
    if (over() && el.matches('.mini-cap')) el.classList.add('cap-hide');
  });
}
function fitInvite() {
  const box = $('.invite-text');
  if (box) shrink(box, .4, .04, () => box.scrollHeight > box.clientHeight + 1 || [...box.children].some((c) => c.scrollWidth > box.clientWidth + 1));
}
// first screens (README)
function fitNames() {
  const targets = [['.env-head .names', innerWidth < 900 ? 1.7 : 2.2, 0.22, 36], ['.hero .names', 3.2, 0.3, 36]]
    .map(([sel, ...a]) => [$(sel), ...a]).filter(([el]) => el);
  const inner = $('.hero-inner'), nav = $('.site-nav');
  // layout box (no transforms)
  const box = (e) => { const b = { x: 0, y: 0, w: e.offsetWidth, h: e.offsetHeight }; for (let n = e; n; n = n.offsetParent) { b.x += n.offsetLeft; b.y += n.offsetTop; } return b; };
  const bottom = (el) => { const b = box(el); return b.y + b.h; };
  const sv = () => { const p = document.createElement('i'); p.style.cssText = 'position:fixed;height:100svh'; document.body.append(p); const h = p.offsetHeight; p.remove(); return h || innerHeight; };
  const low = (h1) => {
    const hero = h1.closest('.hero');
    if (!hero || !inner || !nav) return false;
    return Math.max(...[...inner.children].filter((c) => !(hero.classList.contains('is-long') && c.matches('.countdown'))).map(bottom)) > sv() - nav.offsetHeight - 8;
  };
  const fit = (h1, lines0, share, minPx, navFloor) => {
    h1.style.setProperty('--names-scale', '1');
    const min = Math.min(1, Math.max(0.4, Math.ceil(minPx / fontPx(h1) * 1000) / 1000));
    for (let s = 1; ; s = Math.max(min, s - 0.06)) {
      h1.style.setProperty('--names-scale', s.toFixed(3));
      const h = h1.getBoundingClientRect().height, lines = h / (fontPx(h1) * 1.08);
      if (s <= min || (lines <= lines0 && h <= innerHeight * share && (s <= navFloor || !low(h1)))) break;
    }
  };
  const fits = (c) => {
    const k = [...c.children].filter((p) => p.offsetParent);
    return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
      && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
  };
  const fitCopy = () => $$('.card-copy').forEach((c) => {
    for (const d of ['', 'n', 'c n', 's c n', 's c d']) { c.dataset.drop = d; if (fits(c)) break; }
  });
  const top = (el) => bottom(el) - el.offsetHeight;
  const pieces = () => [...inner.children].filter((c) => c.offsetParent && !c.matches('.hero-card'));
  const unfold = (hero) => { pieces().forEach((c) => c.style.removeProperty('margin-top')); hero.classList.remove('is-folded'); hero.style.removeProperty('--fold'); };
  const fold = (hero) => {
    const v = sv(), limit = v - nav.offsetHeight - 8, below = v + 12, cs = getComputedStyle(hero);
    const cut = () => pieces().filter((c) => bottom(c) > limit).sort((a, b) => top(a) - top(b))[0];
    let c = cut();
    if (!c || top(c) >= below - 0.5) return;
    const cta = inner.querySelector('.hero-cta'), keep = cta && cta.offsetParent && bottom(cta) <= limit;
    const end = keep && Math.max(parseFloat(cs.minHeight) || 0, bottom(cta) - top(hero) + parseFloat(cs.paddingBottom));
    hero.classList.toggle('is-folded', !!keep);
    for (let i = 0; i < 4 && c && top(c) < below - 0.5; i++, c = cut()) c.style.marginTop = `${parseFloat(getComputedStyle(c).marginTop) + below - top(c)}px`;
    if (keep) hero.style.setProperty('--fold', `${Math.max(0, hero.offsetHeight - end)}px`);
  };
  // no dangling "·"
  const stack = () => $$('.dot').forEach((d) => {
    const p = d.parentNode, y = (e) => e ? e.getBoundingClientRect().top : NaN;
    p.classList.remove('is-stacked');
    if (Math.abs(y(d.previousElementSibling) - y(d)) > 2 || Math.abs(y(d.nextElementSibling) - y(d)) > 2) p.classList.add('is-stacked');
  });
  const fitEnv = () => {
    const pg = $('.env-page'), hint = pg && pg.querySelector('.env-hint');
    if (!hint) return;
    pg.style.removeProperty('--env-fit');
    for (let f = 1; f > 0.73 && hint.offsetParent && bottom(hint) > sv() - 6; f -= 0.04) pg.style.setProperty('--env-fit', (f - 0.04).toFixed(2));
  };
  // [data-fold] over the nav line → below the first screen, the space left → the gaps above (README)
  const foldAll = () => {
    const us = [...$$('[data-fold]')], heads = [];
    us.forEach((u) => u.style.removeProperty('margin-top'));
    if (!nav) return;
    fitCard(); // RSVP, on the unfolded card
    us.filter((u) => u.offsetParent).forEach((u) => { if (u.dataset.fold === 'join' && heads.length) heads[heads.length - 1].push(u); else heads.push([u]); });
    const v = sv(), limit = v - nav.offsetHeight - 10, below = v + 2; // whole px: 2 px spare
    const grp = (k) => heads[k][0].closest('[data-fold-group]');
    const span = (k) => {
      let t = 1e9, b = -1e9;
      heads[k].forEach((u) => {
        const a = (parseFloat(getComputedStyle(u).rotate) || 0) * Math.PI / 180;
        const p = (u.offsetWidth * Math.abs(Math.sin(a)) + u.offsetHeight * (Math.abs(Math.cos(a)) - 1)) / 2;
        t = Math.min(t, top(u) - p); b = Math.max(b, bottom(u) + p);
      });
      const card = heads[k][0].closest('.paper');
      return [t, card && !heads.slice(k + 1).some((h) => card.contains(h[0])) ? Math.max(b, bottom(card)) : b];
    };
    const push = (u, d) => { if (d > 0.5) u.style.marginTop = `${parseFloat(getComputedStyle(u).marginTop) + d}px`; };
    heads.forEach((h, k) => {
      const [t, b] = span(k);
      if (t >= below - 0.5 || b <= limit + 0.5) return;
      const prev = heads.map((_, j) => j).filter((j) => j < k && grp(j) === grp(k)), n = prev.length - 1;
      if (n >= 0) {
        const D = Math.max(0, Math.min(below - t, limit - span(prev[n])[1])), ctr = grp(k).dataset.foldGroup === 'center';
        const x = n ? Math.min(28, D / (n + ctr)) : 0;
        prev.slice(1).forEach((j) => push(heads[j][0], x));
        if (ctr) push(heads[prev[0]][0], (D - n * x) / 2);
      }
      push(h[0], below - span(k)[0]);
    });
  };
  // RSVP: card + seal above the nav line, else foldAll (README)
  const fitCard = () => {
    const w = $('.rsvp-top .wrap'), s = w && w.querySelector('.card-seal'), t = w && w.parentNode, clear = () => { w.style.cssText = t.style.cssText = ''; };
    if (!s || !nav) return;
    clear();
    const lim = sv() - nav.offsetHeight - 10;
    for (let cw = w.offsetWidth, k = 1, rt = parseFloat(getComputedStyle(t).paddingTop); bottom(s) > lim;) {
      if (cw > 296 || (k < .73 && rt <= 64 && cw > 240)) w.style.setProperty('--cw', `${cw = Math.max(k < .73 ? 240 : 296, cw - 8)}px`);
      else if (k > .73) w.style.setProperty('--sg', (k -= .04).toFixed(2));
      else if (rt > 64) t.style.setProperty('--rt', `${rt = Math.max(64, rt - 8)}px`);
      else { clear(); break; }
    }
  };
  // hero: no cluster (16 × 16 alpha map) / float under the text (README)
  const MAP = { tl: '7fe0fffcfffefffffffdfffcfff8ffd8ff00ff00fc00f800f800f000f0003800', br: '00030003000f001f003f003f01ff0dff0fff1fffffffffff7fff7fffffffffff' };
  const ink = (e) => { // line boxes
    const L = box(e), b = e.getBoundingClientRect(), r = document.createRange();
    r.selectNodeContents(e);
    return e.matches('.btn') ? [L] : [...r.getClientRects()].map((q) => ({ x: q.left + L.x - b.left - 2, y: q.top + L.y - b.top - 2, w: q.width + 4, h: q.height + 4 }));
  };
  const under = (c, t, m) => {
    const f = (v, o, s) => Math.max(0, Math.min(16, (v - o) / s * 16)), x0 = f(t.x, c.x, c.w), x1 = f(t.x + t.w, c.x, c.w), y1 = f(t.y + t.h, c.y, c.h);
    for (let j = f(t.y, c.y, c.h) | 0; j < y1 && x0 < x1; j++) for (let i = x0 | 0; i < x1; i++) if (parseInt(m.substr(j * 4, 4), 16) >> (15 - i) & 1) return true;
  };
  const decor = () => $$('.hero-bg').forEach((bg) => {
    const ts = [...bg.parentNode.querySelectorAll('.hero-inner :is(.names, .hero-date, .hero-venue, .hero-city, .cd-num, .cd-lbl, .cd-done, .btn)')].filter((e) => e.offsetParent).flatMap(ink);
    bg.querySelectorAll('.corner').forEach((c) => {
      const m = MAP[c.matches('.corner-br') ? 'br' : 'tl'];
      c.style.removeProperty('--cw'); c.style.visibility = '';
      for (let k = .94, w = c.offsetWidth; ts.some((t) => under(box(c), t, m)); k -= .06) {
        if (k < .5) { c.style.visibility = 'hidden'; break; }
        c.style.setProperty('--cw', `${(w * k).toFixed(1)}px`);
      }
    });
    bg.querySelectorAll('.float').forEach((f) => {
      const b = box(f);
      f.style.visibility = ts.some((t) => t.x < b.x + b.w + 6 && b.x - 6 < t.x + t.w && t.y < b.y + b.h + 6 && b.y - 6 < t.y + t.h) ? 'hidden' : '';
    });
  });
  const run = () => {
    root.style.setProperty('--bar', ($('[data-platform-preview-bar]')?.offsetHeight || 0) + 'px'); // the preview bar
    stack();
    fitCopy();
    fitLines();
    fitInvite();
    targets.forEach(([h1, ...a]) => {
      const hero = h1.closest('.hero');
      if (!hero) { fit(h1, ...a, 0); return fitEnv(); }
      if (inner && nav) unfold(hero);
      for (const [cls, navFloor] of [[[], 0.76], [['is-tight'], 0], [['is-tight', 'is-long'], 0], [[], 1]]) {
        hero.classList.remove('is-tight', 'is-long');
        hero.classList.add(...cls);
        fit(h1, ...a, navFloor);
        if (!low(h1)) break;
      }
      if (inner && nav) fold(hero);
    });
    foldAll();
    decor();
  };
  run();
  addEventListener('load', run);
  document.fonts?.ready?.then(run);
  if (window.ResizeObserver) { const ro = new ResizeObserver(fitCopy); $$('.card-copy').forEach((c) => ro.observe(c)); }
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
}

/* -- envelope (index page) */
function initEnvelope() {
  const page = $('.env-page');
  if (!page) return;
  const q = (s) => page.querySelector(s), stage = q('.stage');
  const el = {
    env: q('.env'), closure: q('.closure'), closed: q('.env-closed'), cflap: q('.env-cflap'), flap: q('.env-flap'),
    body: q('.env-body'), pocket: q('.env-pocket'), slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
  };
  const E = MOTION.envelope;
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [];

  function prefetchHome() {
    if ($('link[data-prefetch]')) return;
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = PAGES.home; l.dataset.prefetch = '1';
    document.head.appendChild(l);
  }
  if ('requestIdleCallback' in window) requestIdleCallback(prefetchHome, { timeout: 2500 }); else setTimeout(prefetchHome, 1500);

  function go(withCard) {
    store.set(OPENED, '1');
    if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
    else el.card.style.viewTransitionName = 'none'; // skip
    if (crossDocVT || reduce) { location.href = PAGES.home; return; }
    page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    const layer = $('.accent-layer');
    if (layer) layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }

  const A = (node, kf, [delay, duration], easing, fill) =>
    node.animate(kf, { delay, duration, easing: easing || 'cubic-bezier(.22,.61,.36,1)', fill: fill || 'both' });

  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    prefetchHome();
    if (reduce || !Element.prototype.animate) { go(false); return; }
    A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
    A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .45 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
    A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
    const r = stage.getBoundingClientRect(), c = el.card.getBoundingClientRect();
    const dx = getComputedStyle(page).display === 'grid' ? innerWidth / 2 - r.left - r.width / 2 : 0, dy = Math.max(0, 12 + c.height - c.top);
    if (dx || dy) A(stage, [{ transform: 'none' }, { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` }], E.glide, 'cubic-bezier(.45,0,.25,1)', 'forwards');
    const cr = el.closure.getBoundingClientRect();
    const fall = Math.max(innerHeight - cr.top, cr.height) + cr.height * 0.4;
    const pop = E.fall[0] / (E.fall[0] + E.fall[1]);
    A(el.closure, [
      { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1, easing: 'cubic-bezier(.3,.8,.4,1)' },
      { transform: 'translate3d(0,-5%,0) rotate(-8deg) scale(1.07)', opacity: 1, offset: pop, easing: 'cubic-bezier(.55,0,.85,.4)' },
      { transform: `translate3d(${(cr.width * .16).toFixed(1)}px, ${(fall * .55).toFixed(1)}px, 0) rotate(16deg) scale(1.03)`, opacity: 1, offset: pop + (1 - pop) * .62, easing: 'cubic-bezier(.4,0,1,1)' },
      { transform: `translate3d(${(cr.width * .28).toFixed(1)}px, ${fall.toFixed(1)}px, 0) rotate(34deg) scale(1)`, opacity: .2 }
    ], [E.closure[0], E.fall[0] + E.fall[1]], 'linear', 'forwards');
    A(el.cflap, [
      { opacity: 1, transform: 'perspective(1000px) rotateX(0deg)', filter: 'brightness(1)', easing: 'cubic-bezier(.33,.1,.35,1)' },
      { opacity: 1, transform: 'perspective(1000px) rotateX(24deg)', filter: 'brightness(1.01)', offset: .3, easing: 'cubic-bezier(.4,0,.7,.7)' },
      { opacity: 1, transform: 'perspective(1000px) rotateX(80deg)', filter: 'brightness(.86)', offset: .9 },
      { opacity: 0, transform: 'perspective(1000px) rotateX(90deg)', filter: 'brightness(.82)' }
    ], E.lift, 'linear');
    A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
    A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
    A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
    A(el.flap, [
      { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)', filter: 'brightness(.88)' },
      { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)', filter: 'brightness(1)' }
    ], E.flap, 'cubic-bezier(.2,.7,.3,1)');
    timers.push(setTimeout(() => accents('open', E.go - E.accents - 80), E.accents));
    A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.42,0,.18,1)');
    timers.push(setTimeout(() => {
      el.slot.style.clipPath = 'none'; el.slot.style.zIndex = '6';
      const r = el.card.getBoundingClientRect(), fix = Math.max(0, r.height * 0.08 + 12 - r.top);
      const front = ENVELOPE_GEOMETRY.front.replace(/translateY\(([^)]+)\)/, (m, v) => (fix ? `translateY(calc(${v} + ${fix.toFixed(1)}px))` : m));
      A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
      A(el.card, [{ filter: 'drop-shadow(0 6px 8px rgba(30,45,70,.16))' }, { filter: 'drop-shadow(0 30px 30px rgba(30,45,70,.3))' }], [0, E.forward[1]], 'ease-out', 'forwards');
    }, E.forward[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }

  function clearOpening() {
    timers.splice(0).forEach(clearTimeout);
    page.getAnimations({ subtree: true }).concat(page.getAnimations()).filter((a) => !(window.CSSAnimation && a instanceof CSSAnimation)).forEach((a) => a.cancel());
    el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
    el.card.style.viewTransitionName = '';
    const layer = $('.accent-layer');
    if (layer) layer.remove();
  }
  function reset() { clearOpening(); root.classList.remove('is-opened'); state = 'closed'; }

  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  const rep = q('.replay');
  if (rep) rep.addEventListener('click', () => { reset(); requestAnimationFrame(() => play()); });
  const enter = q('[data-enter]');
  if (enter) enter.addEventListener('click', (e) => { e.preventDefault(); go(true); });

  addEventListener('pageshow', (e) => { if (e.persisted && state !== 'closed') { clearOpening(); root.classList.add('is-opened'); state = 'opened'; } });
}

/* -- boot */
function boot() {
  if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
  });
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

/* dev RSVP */
function devRsvp() {
  $$('form[data-rsvp-form]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    (form.closest('[data-rsvp]') || document).querySelectorAll('[data-rsvp-state]').forEach((p) => { p.hidden = p.dataset.rsvpState !== 'preview'; });
  }));
}

/* dev fallback = lib/theme/engine.ts */
function devRender(content) {
  const PHOTO_SOURCES = { hero_portrait: 'media.hero_portrait', story_1: 'media.memory_photos.0', story_2: 'media.memory_photos.1', story_3: 'media.memory_photos.2', venue: 'media.venue_image' }; // theme.json
  const view = JSON.parse(JSON.stringify(content));
  if (view.venue) {
    const join = (a) => a.filter((x) => typeof x === 'string' && x.trim()).join(', ');
    view.venue.city_region = join([view.venue.city, view.venue.region]);
    view.venue.city_region_country = join([view.venue.city, view.venue.region, view.venue.country]);
  }
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
      const o = { weekday: { weekday: L }, month: { month: L }, day: { day: N }, year: { year: N }, 'date-long': { weekday: L, month: L, day: N, year: N } }[f] || { month: L, day: N, year: N };
      return new Date(v + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...o });
    }
    if (/^\d{2}:\d{2}$/.test(v) && f === 'time') {
      const [h, m] = v.split(':').map(Number);
      return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    }
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
    if (d.if !== undefined) {
      const neg = d.if.startsWith('!');
      if (present(get(abs(d.if.replace(/^!/, ''), scope))) === neg) { el.remove(); return; }
    }
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
  const off = document.body.dataset.optional;
  if (off && !(view.optional_blocks || {})[off]) document.body.prepend(Object.assign(document.createElement('p'), { textContent: 'This page is switched off (optional_blocks).' }));
  walk(document.head, null);
  walk(document.body, null);
}
})();
