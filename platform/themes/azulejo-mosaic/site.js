/* Azulejo Mosaic — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 30, G430): the knot of the jute twine loosens, its vertical strand slides down and its two arms
   slip off to the sides, the loose swallow tile turns over on its vertical axis (terracotta bisque back) and drops away,
   the stepped tile flap swings up on its top edge onto its terracotta-and-cobalt lining, the four-tile panels in the
   lower corners turn over in a wave, olive leaves and jasmine drift down (MOTION.accents.open), the glaze-white card
   rises from behind the pocket, comes forward and flies to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope.
   Inner pages: every photo sits in a GPT frame (limestone niche, azulejo-bordered frame, wide tile panel) and is
   uncovered tile by tile — initMosaic lays a grid of painted tiles (GPT tile_a, mirrored into medallions) over it whose
   backs carry the photo's own pieces; as the scene enters they turn over in a diagonal wave (CSS) and the photo is
   whole. It moves the photo, it draws nothing. A reply is answered with a row of turning tiles and drifting leaves. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    knot: [0, 420],         // the knot loosens: a tug on the strand round the knot
    twine: [380, 620],      // the vertical strand slides down, the two arms slip off to the sides
    tile: [900, 1000],      // the swallow tile turns over (terracotta back), lifts and drops away
    flap: [1750, 750],      // the stepped tile flap swings up on its top edge, its terracotta lining shows
    wave: [2050, 900],      // the corner tiles turn over one after another (+ waveStep ms each)
    accents: 2250,          // olive leaves and jasmine drift down (MOTION.accents.open)
    rise: [2400, 700],      // the card rises from behind the pocket
    light: [2500, 1000],    // a sheen of morning light crosses the glaze-white card
    forward: [3150, 450],   // and comes forward
    go: 3700,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  waveStep: 110,
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['tile', 0], ['photo', 200], ['line', 1300], ['names', 1460], ['date', 1760], ['venue', 1940]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 900], ['link', 1200]],
    'home-day': [['head', 0], ['list', 420], ['link', 740]],
    'home-foot': [['pot', 0], ['names', 700], ['links', 1000]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 600]],
    'story-moment': [['frame', 0], ['caption', 1300]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1700]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // the photo mosaic: tiles per frame (columns × rows, near-square cells); the turn and the wave in site.css
  // (.mosaic.in .cell: 700 ms from the frame's delay + 450 ms, + 80 ms per diagonal)
  mosaic: { niche: [4, 5], story: [4, 5], venue: [9, 4] },
  // the GPT accents (olive leaf, jasmine, tile chip): drifting over the opening envelope and over a reply
  accents: {
    open: [{ img: 'img/leaf-160.webp', count: 6, dur: [2600, 3400], size: [20, 30] },
      { img: 'img/jasmine-160.webp', count: 6, dur: [2800, 3600], size: [16, 24] }],
    reply: [{ img: 'img/leaf-160.webp', count: 6, dur: [2600, 3600], size: [20, 30] },
      { img: 'img/jasmine-160.webp', count: 6, dur: [3000, 4000], size: [16, 24] },
      { img: 'img/chip-160.webp', count: 3, dur: [2200, 3000], size: [12, 18] }]
  }
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
const asset = (p) => new URL(p, SCRIPT_URL).href;

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

/* -- the card in the pocket keeps its fixed paper: long names get smaller, then the portrait gets smaller */
function fitCard() {
  const card = $('.envelope .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 13; i++) { size -= 1; names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
    if (!instant) { n.style.transitionDelay = delay + 'ms'; n.style.setProperty('--d', delay + 'ms'); }
    n.classList.add('in');
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

/* -- the photo mosaic: a grid of painted tiles over each framed photo; the back of each tile holds the photo's own piece
   (a copy of the same picture, cut by its cell), so as the tiles turn over the photo turns into place. Never with
   reduced motion or without IntersectionObserver (the photo is simply there); not on the home card that arrives from
   the envelope (it already shows the portrait). */
function initMosaic() {
  if (reduce || !('IntersectionObserver' in window)) return;
  $$('.frame.mosaic').forEach((frame) => {
    if (root.classList.contains('from-envelope') && frame.closest('.hero-card')) return;
    const slot = frame.querySelector('.photo-slot'), img = slot && slot.querySelector('img');
    if (!img) return;
    const kind = frame.classList.contains('venue-frame') ? 'venue' : frame.classList.contains('niche') ? 'niche' : 'story';
    const [cols, rows] = MOTION.mosaic[kind];
    const grid = document.createElement('span');
    grid.className = 'tiles';
    grid.setAttribute('aria-hidden', 'true');
    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', rows);
    const pieces = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement('span');
        cell.className = 'cell';
        cell.style.setProperty('--k', x + y);
        const face = document.createElement('i');
        face.className = 'cf' + (x % 2 ? ' fx' : '') + (y % 2 ? ' fy' : '');
        const back = document.createElement('i');
        back.className = 'cb';
        const piece = Object.assign(document.createElement('img'), { alt: '', decoding: 'async' });
        piece.style.cssText = `width:${cols * 100}%;height:${rows * 100}%;left:${-x * 100}%;top:${-y * 100}%`;
        back.append(piece);
        cell.append(face, back);
        grid.append(cell);
        pieces.push(piece);
      }
    }
    const sync = () => { const src = img.currentSrc || img.src; pieces.forEach((p) => { if (p.src !== src) p.src = src; }); };
    if (img.complete) sync();
    img.addEventListener('load', sync);
    slot.append(grid);
  });
}

/* -- the GPT accents fall, turning, and are removed when they land */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0, k = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++, k++) {
      const img = Object.assign(document.createElement('img'), { src: asset(g.img), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.06 + 0.88 * Math.random()), y = Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = Math.min(innerHeight * 0.75, box.height + 60), dx = (Math.random() - 0.5) * 120, r = (Math.random() - 0.5) * 160;
      left++;
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0deg)' }, { opacity: 1, offset: 0.1 },
        { transform: `translate(${dx * 0.5}px,${dy * 0.45}px) rotate(${r * 0.5}deg)`, offset: 0.5 },
        { opacity: 1, offset: 0.8 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${r}deg)` }],
      { duration: dur, delay: k * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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

/* -- the envelope */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.envelope .card'), E = MOTION.envelope;
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
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
    timers.push(setTimeout(() => particles('open', $('.stage')), E.accents));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    root.classList.remove('is-opening', 'is-opened');
    card.style.viewTransitionName = '';
    state = 'closed';
  }
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); card.style.viewTransitionName = ''; state = 'opened'; }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: the tiles over the thank-you turn (CSS) and leaves, jasmine and a tile chip drift down
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initMosaic();
  initScenes();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
