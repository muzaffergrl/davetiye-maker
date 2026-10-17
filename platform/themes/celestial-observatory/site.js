/* Celestial Observatory — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 29): moonlight passes over the brass, the two halves of the slit shutter part, the night sky
   shows in the slit and a soft light rises from it, stars light up one by one, a fine constellation line joins them
   into the couple's initials, the engraved sky turns, and the card rises out of the slit, comes forward and flies to
   home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the same numbers as
   MOTION.envelope. On the inner pages every round photo is uncovered by a dial sweep (a conic mask, site.css .dial) as
   its scene enters the view, and the brass rims and the engraved sky turn as the page scrolls (--turn, --p).
   The constellation (drawConstellation): a UI line on a canvas, 1 px, through the vertices of the initials read from
   the platform's monogram (data-field="initials" — read, never written). The stars at its vertices and the stars lit in
   the opening are the GPT sprites W2.5 (named by parts.css --co-stars); without them there are no stars, never a
   drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // kicker, names and date rise away; "Tap to open" fades
    sheen: [100, 800],      // moonlight passes over the brass dome
    shutters: [450, 650],   // the two halves of the slit shutter part (left out to the left, right to the right)
    beam: [900, 900],       // the night sky in the slit brightens and a soft light rises from it
    stars: [1100, 1200],    // stars light up one by one over the observatory (GPT sprites; none = none)
    constellation: [1700, 1250], // the line joins the stars into the initials, vertex by vertex
    turn: [0, 4000],        // the engraved sky turns a little (GPT star chart)
    rise: [3000, 600],      // the card rises out of the slit
    forward: [3600, 350],   // and comes forward
    go: 4050,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  starfield: { count: 14, seed: 29 },   // the stars of the opening sky (positions fixed per design, not random per visit)
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 420], ['names', 600], ['date', 940], ['venue', 1140]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 460], ['link', 800]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['sky', 0], ['names', 1500], ['links', 1900]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 1050]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1250]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 420]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  constellationFoot: 1400,  // the initials drawn again in the home signature (ms)
  // twinkling stars (GPT sprites W2.5): reply = a few stars rise from the thank-you panel when an RSVP is sent.
  accents: {
    reply: [{ count: 6, path: 'rise', dur: [2200, 3000], size: [12, 22] }]
  }
};

/* the initials as constellations: per capital, strokes of points in a unit box (x 0–1 of the letter's width, y 0–1 of
   its height, y down). A UI path only — the stars on it are GPT's. Letters outside A–Z (after removing accents) are
   left out; no letter at all = no constellation. */
const LETTERS = {
  A: [[[0, 1], [.5, 0], [1, 1]], [[.22, .58], [.78, .58]]],
  B: [[[0, 1], [0, 0], [.7, .04], [.86, .24], [.62, .48], [0, .48]], [[.62, .48], [.94, .7], [.76, .96], [0, 1]]],
  C: [[[1, .16], [.62, 0], [.16, .18], [0, .55], [.2, .9], [.64, 1], [1, .84]]],
  D: [[[0, 0], [0, 1], [.6, .94], [.96, .6], [.9, .24], [.5, .02], [0, 0]]],
  E: [[[1, 0], [0, 0], [0, 1], [1, 1]], [[0, .5], [.72, .5]]],
  F: [[[1, 0], [0, 0], [0, 1]], [[0, .5], [.72, .5]]],
  G: [[[1, .16], [.62, 0], [.16, .18], [0, .55], [.2, .9], [.64, 1], [1, .8], [1, .56], [.6, .56]]],
  H: [[[0, 0], [0, 1]], [[1, 0], [1, 1]], [[0, .5], [1, .5]]],
  I: [[[.5, 0], [.5, 1]]],
  J: [[[1, 0], [1, .74], [.76, 1], [.3, 1], [0, .76]]],
  K: [[[0, 0], [0, 1]], [[1, 0], [0, .56]], [[.32, .4], [1, 1]]],
  L: [[[0, 0], [0, 1], [1, 1]]],
  M: [[[0, 1], [0, 0], [.5, .62], [1, 0], [1, 1]]],
  N: [[[0, 1], [0, 0], [1, 1], [1, 0]]],
  O: [[[.5, 0], [.1, .2], [0, .56], [.26, .96], [.72, .96], [1, .56], [.9, .2], [.5, 0]]],
  P: [[[0, 1], [0, 0], [.74, .04], [.96, .28], [.74, .5], [0, .52]]],
  Q: [[[.5, 0], [.1, .2], [0, .56], [.26, .96], [.72, .96], [1, .56], [.9, .2], [.5, 0]], [[.62, .76], [1, 1.04]]],
  R: [[[0, 1], [0, 0], [.74, .04], [.96, .28], [.74, .5], [0, .52]], [[.46, .52], [1, 1]]],
  S: [[[1, .12], [.6, 0], [.1, .12], [.14, .42], [.86, .58], [.92, .88], [.4, 1], [0, .88]]],
  T: [[[0, 0], [1, 0]], [[.5, 0], [.5, 1]]],
  U: [[[0, 0], [0, .74], [.3, 1], [.7, 1], [1, .74], [1, 0]]],
  V: [[[0, 0], [.5, 1], [1, 0]]],
  W: [[[0, 0], [.24, 1], [.5, .4], [.76, 1], [1, 0]]],
  X: [[[0, 0], [1, 1]], [[1, 0], [0, 1]]],
  Y: [[[0, 0], [.5, .5], [1, 0]], [[.5, .5], [.5, 1]]],
  Z: [[[0, 0], [1, 0], [0, 1], [1, 1]]]
};

(() => {
'use strict';
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (q) => document.querySelector(q), $$ = (q) => [...document.querySelectorAll(q)];
let SITE = null;
try { SITE = JSON.parse($('#site-data')?.textContent || 'null'); } catch (e) { SITE = null; }
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY, ARRIVE = MOTION.storage.arrive + KEY;
const store = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } };
const crossDocVT = 'onpageswap' in window && Boolean(document.startViewTransition);
const SCRIPT_URL = document.currentScript ? document.currentScript.src : location.href;
let STARS = [];
try { STARS = getComputedStyle(root).getPropertyValue('--co-stars').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { STARS = []; }
const starSrc = (i) => new URL(STARS[i % STARS.length], SCRIPT_URL).href;

/* small fixed pseudo-random sequence (the same sky on every visit) */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* -- long names: on one line while they fit, then smaller (never below the floor), then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    el.classList.toggle('long-names', parts.some((n) => n.textContent.length > 14));
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero') ? 34 : 32;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the card from the slit keeps its fixed paper: long names get smaller, then the round portrait gets smaller */
function fitCard() {
  const card = $('.observatory .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 13; i++) { size -= 1; names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- the constellation of the initials: vertices laid out in the box, then drawn segment by segment over `dur` ms;
   each vertex gets a GPT star as the line reaches it. dur 0 = drawn at once. */
function constellation(box) {
  const letters = [...((box.querySelector('.mono')?.textContent || '').normalize('NFD').toUpperCase())].filter((c) => LETTERS[c]).slice(0, 3);
  const canvas = box.querySelector('canvas');
  if (!letters.length || !canvas || !canvas.getContext) return null;
  const r = rng(letters.join('').charCodeAt(0) * 7 + letters.length);
  const W = box.clientWidth, H = box.clientHeight;
  const widths = letters.map((c) => (c === 'I' ? .16 : .66)), gap = .5;
  const units = widths.reduce((a, b) => a + b, 0) + gap * (letters.length - 1);
  const h = Math.max(24, Math.min(H * .8, W * .9 / units)), top = (H - h) / 2;
  let x = (W - units * h) / 2;
  const strokes = [];
  letters.forEach((c, i) => {
    const lw = widths[i] * h;
    LETTERS[c].forEach((st) => strokes.push(st.map(([px, py]) => {
      const jx = (r() - .5) * h * .07, jy = (r() - .5) * h * .07;   // a star map, not a typeface: each point a little off
      return [x + (c === 'I' ? lw / 2 + (px - .5) * h * .1 : px * lw) + jx, top + py * h + jy];
    })));
    x += lw + gap * h;
  });
  // snap the shared corners of a letter onto one star
  const verts = [];
  strokes.forEach((st) => st.forEach((p, k) => {
    const near = verts.find((v) => Math.hypot(v[0] - p[0], v[1] - p[1]) < h * .09);
    if (near) st[k] = near; else verts.push(p);
  }));
  const segs = [];
  strokes.forEach((st) => { for (let k = 1; k < st.length; k++) segs.push([st[k - 1], st[k], Math.hypot(st[k][0] - st[k - 1][0], st[k][1] - st[k - 1][1])]); });
  const total = segs.reduce((a, s) => a + s[2], 0) || 1;
  const dpr = Math.min(devicePixelRatio || 1, 3);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext('2d');
  return { box, ctx, dpr, segs, total, verts, h, W, H };
}
function drawConstellation(box, dur) {
  const c = constellation(box);
  if (!c) return;
  box.querySelectorAll('.cstar').forEach((n) => n.remove());
  const lit = new Set();
  const star = (v, i) => {
    if (!STARS.length || lit.has(v)) return;
    lit.add(v);
    const s = Math.max(10, Math.min(22, c.h * .16));
    const img = Object.assign(document.createElement('img'), { src: starSrc(i), alt: '', className: 'cstar' });
    img.style.cssText = `left:${v[0] - s / 2}px;top:${v[1] - s / 2}px;width:${s}px`;
    box.append(img);
  };
  const paint = (len) => {
    const { ctx, dpr } = c;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.W, c.H);
    ctx.strokeStyle = 'rgba(222,228,242,.78)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(200,214,255,.55)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    let left = len;
    for (const [a, b, l] of c.segs) {
      if (left <= 0) break;
      const t = Math.min(1, left / l);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
      star(a, c.verts.indexOf(a));
      if (t === 1) star(b, c.verts.indexOf(b));
      left -= l;
    }
    ctx.stroke();
  };
  box.classList.add('drawn');
  if (!dur || reduce) { paint(c.total); return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    paint(c.total * (1 - Math.pow(1 - p, 2)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* -- the stars of the opening sky: GPT sprites at fixed places over the observatory, lit one by one */
function starfield() {
  const host = $('.opening');
  if (!host || !STARS.length || reduce) return;
  const E = MOTION.envelope, r = rng(MOTION.starfield.seed);
  const layer = document.createElement('div');
  layer.className = 'starfield';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < MOTION.starfield.count; i++) {
    const img = Object.assign(document.createElement('img'), { src: starSrc(i), alt: '' });
    const s = 8 + r() * 14;
    img.style.cssText = `left:${4 + r() * 92}%;top:${3 + r() * 52}%;width:${s}px;animation-delay:${E.stars[0] + (i * E.stars[1]) / MOTION.starfield.count}ms`;
    layer.append(img);
  }
  host.prepend(layer);
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
    if (!instant) n.style.transitionDelay = delay + 'ms';
    n.classList.add('in');
    if (n.classList.contains('constellation')) setTimeout(() => drawConstellation(n, instant ? 0 : MOTION.constellationFoot), instant ? 0 : delay);
  });
}
function initScenes() {
  const scenes = $$('[data-scene]');
  if (!scenes.length) return;
  if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => reveal(s, 0, true)); return; }
  const arrived = root.classList.contains('from-envelope');
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1)).forEach((s, i) => {
        io.unobserve(s);
        reveal(s, i * MOTION.batchGap + (arrived && s.dataset.scene.startsWith('home-') ? MOTION.arriveDelay : 0), false);
      });
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
  scenes.forEach((s) => io.observe(s));
}

/* -- the sky turns with the page: --turn (page, degrees) on <html>, --p (0 → 1 while a planisphere crosses the view) */
function initTurn() {
  const dials = $$('.planisphere');
  if (reduce || (!dials.length && !$('.page-sky'))) return;
  let queued = false;
  const update = () => {
    queued = false;
    root.style.setProperty('--turn', (scrollY * 0.05).toFixed(2));
    const vh = innerHeight;
    dials.forEach((d) => {
      const b = d.getBoundingClientRect();
      if (b.bottom < -vh || b.top > 2 * vh) return;
      d.style.setProperty('--p', Math.max(0, Math.min(1, (vh - b.top) / (vh + b.height))).toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

/* -- twinkling stars (MOTION.accents): the GPT sprites in turn, a few pieces, removed when they fade */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !STARS.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: starSrc(left), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.12 + 0.76 * Math.random()), y = box.top + box.height * 0.6;
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = (g.path === 'rise' ? -1 : 1) * innerHeight * (0.25 + Math.random() * 0.15), dx = (Math.random() - 0.5) * 60;
      left++;
      // a star: it brightens, twinkles once and fades as it rises
      img.animate([{ opacity: 0, transform: 'translate(0,0) scale(.4)' }, { opacity: 1, offset: 0.2, transform: `translate(${dx * 0.2}px,${dy * 0.2}px) scale(1)` },
        { opacity: 0.45, offset: 0.45, transform: `translate(${dx * 0.5}px,${dy * 0.5}px) scale(.8)` }, { opacity: 1, offset: 0.6 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(.6)` }],
      { duration: dur, delay: i * 160, easing: 'ease-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
    }
  });
}

/* -- countdown: the target comes from the platform (site-data derived.countdown_target_utc) */
function initCountdown() {
  $$('[data-countdown]').forEach((box) => {
    const target = Date.parse((SITE && SITE.derived && SITE.derived.countdown_target_utc) || '');
    if (!Number.isFinite(target)) { box.hidden = true; return; }
    box.dataset.targetUtc = new Date(target).toISOString();
    const cells = Object.fromEntries([...box.querySelectorAll('[data-unit]')].map((n) => [n.dataset.unit, n]));
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.classList.add('is-done');
        box.querySelectorAll('.cd-done').forEach((n) => { n.hidden = (n.dataset.when === 'today') !== (-diff < 864e5); });
        return false;
      }
      const s = Math.floor(diff / 1000);
      const v = { days: Math.floor(s / 86400), hours: Math.floor(s % 86400 / 3600), minutes: Math.floor(s % 3600 / 60), seconds: s % 60 };
      Object.entries(v).forEach(([u, n]) => { if (cells[u]) cells[u].textContent = String(n).padStart(2, '0'); });
      return true;
    };
    if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
  });
}

/* -- the observatory */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.observatory .card'), sky = $('.sky-band > .constellation'), E = MOTION.envelope;
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  if (state === 'opened' && sky) drawConstellation(sky, 0);
  const timers = [];
  function go(withCard) {
    store(OPENED, '1');
    if (withCard) { store(ARRIVE, '1'); card.style.viewTransitionName = 'invite-card'; } else card.style.viewTransitionName = 'none';
    if (crossDocVT || reduce || !Element.prototype.animate) { location.href = PAGES.home; return; }
    $('.opening').animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }
  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    if (reduce) { go(false); return; }
    root.classList.add('is-opening');
    if (sky) timers.push(setTimeout(() => drawConstellation(sky, E.constellation[1]), E.constellation[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    root.classList.remove('is-opening', 'is-opened');
    card.style.viewTransitionName = '';
    if (sky) { sky.classList.remove('drawn'); sky.querySelectorAll('.cstar').forEach((n) => n.remove()); const c = sky.querySelector('canvas'); c.getContext && c.getContext('2d').clearRect(0, 0, c.width, c.height); }
    state = 'closed';
  }
  starfield();
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); card.style.viewTransitionName = ''; state = 'opened'; if (sky) drawConstellation(sky, 0); }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: a few stars rise and twinkle over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', () => { fit(); $$('.constellation.drawn').forEach((b) => drawConstellation(b, 0)); }, { passive: true });
  initEnvelope();
  initScenes();
  initTurn();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
