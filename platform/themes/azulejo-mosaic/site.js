/* Azulejo Mosaic — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 30): a tap presses the tile panel and a soft glaze light runs over it; then the 24 tiles turn
   over ONE BY ONE in 3D — a wave that starts at the tile under the guest's finger (the centre for a key press) and
   spreads across the panel, each tile showing its terracotta back as it turns and lifts away — and the card behind the
   tiles lifts, comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css
   (".is-opening …") use the same numbers as MOTION.envelope. On the inner pages every photo waits under a small mosaic
   of tiles that turn over in a diagonal wave as its scene enters the view (mosaic()); the RSVP thank-you is revealed
   the same way. Tile pictures: img/tile_1..4 (GPT azulejo_1..4, build_images.py). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    press: [0, 380],        // the panel gives under the tap (a small press and back)
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 450],         // kicker, names and date rise away
    sheen: [80, 700],       // a soft glaze light runs over the tiles
    wave: [420, 1300],      // the tiles turn over one by one: the first at 420 ms, the farthest from the tap at 420 + 1300
    flip: 760,              // one tile's turn (front → terracotta back → lifted away)
    rise: [2350, 600],      // the card behind the tiles lifts
    forward: [2950, 350],   // and comes forward
    go: 3400,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  // the photo mosaics of the inner pages: one tile per `tile` px of the photo's width (at least `min` columns), each
  // tile starts `step` ms after its neighbour on the diagonal (top-left first); `flip` = one tile's turn
  mosaic: { tile: 56, min: 4, max: 8, step: 70, flip: 680, reply: { tile: 44, step: 45 } },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 420], ['names', 600], ['date', 940], ['venue', 1140]],
    'home-invite': [['title', 0], ['host', 260], ['names', 460], ['date', 820], ['venue', 1060], ['reply', 1320], ['count', 1520], ['calendar', 1720]],
    'home-teasers': [['photo', 0], ['head', 520], ['link', 860]],
    'home-day': [['head', 0], ['list', 360], ['link', 680]],
    'home-foot': [['names', 0], ['links', 420]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 1100]],
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
  arriveDelay: 150
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

/* -- long names: on one line while they fit, then smaller (never below the floor), then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    el.classList.toggle('long-names', parts.some((n) => n.textContent.length > 14));
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero') ? 34 : 30;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the card behind the tiles keeps its fixed box: long names get smaller, then the portrait window narrows */
function fitCard() {
  const card = $('.panel .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 13; i++) { size -= 1; names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- which tile lies where (= build_images.tile_kind for the wall): field tiles 1 / 4 in a 2 × 2 turn */
const fieldTile = (r, c) => ({ k: (r + c) % 2 ? 1 : 4, q: (r % 2) * 2 + (c % 2) });

/* -- a photo mosaic: tiles over the slot, turned over in a diagonal wave when the slot gets .in (site.css .mosaic).
   Built only with motion (none without JS or with reduced motion: the photo simply shows). */
function mosaic(slot, opt) {
  if (reduce || slot.querySelector(':scope>.tiles')) return;
  const o = { ...MOTION.mosaic, ...(opt || {}) };
  const w = slot.clientWidth, h = slot.clientHeight;
  if (!w || !h) return;
  const cols = Math.max(o.min, Math.min(o.max, Math.round(w / o.tile))), size = w / cols, rows = Math.ceil(h / size - 0.02);
  const box = document.createElement('span');
  box.className = 'tiles';
  box.setAttribute('aria-hidden', 'true');
  box.style.setProperty('--cols', cols);
  box.style.setProperty('--size', size + 'px');
  let last = null;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = fieldTile(r, c), tile = document.createElement('i');
      tile.className = `tile k${t.k} q${t.q}`;
      tile.style.setProperty('--d', (r + c) * o.step + 'ms');
      tile.innerHTML = '<b class="front"></b><b class="back"></b>';
      box.append(tile);
      last = tile;
    }
  }
  box.style.setProperty('--flip', o.flip + 'ms');
  slot.append(box);
  slot.classList.add('tiled');
  // the turned tiles go once the last one has lifted away (the photo is all that is left)
  last.addEventListener('animationend', () => { box.remove(); slot.classList.remove('tiled'); }, { once: true });
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    if (!instant) {
      const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
      n.style.transitionDelay = delay + 'ms';
      n.style.setProperty('--base', delay + 'ms');
    }
    n.classList.add('in');
  });
}
function initScenes() {
  const scenes = $$('[data-scene]');
  if (!scenes.length) return;
  if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => reveal(s, 0, true)); return; }
  const arrived = root.classList.contains('from-envelope');
  // the photos wait under their tiles (the home card's portrait not after the opening: the card flew in with it)
  $$('.mosaic').forEach((slot) => { if (!(arrived && slot.closest('.hero-card'))) mosaic(slot); });
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1)).forEach((s, i) => {
        io.unobserve(s);
        reveal(s, i * MOTION.batchGap + (arrived && s.dataset.scene.startsWith('home-') ? MOTION.arriveDelay : 0), false);
      });
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
  scenes.forEach((s) => io.observe(s));
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

/* -- the tile wall: each tile's turn in the wave = its distance from where the wave starts (0 … 1 of the reach) */
function waveFrom(wall, x, y) {
  const tiles = [...wall.querySelectorAll('.tile')], E = MOTION.envelope;
  const boxes = tiles.map((t) => t.getBoundingClientRect());
  const dist = boxes.map((b) => Math.hypot(b.left + b.width / 2 - x, b.top + b.height / 2 - y));
  const far = Math.max(...dist) || 1;
  tiles.forEach((t, i) => {
    t.style.setProperty('--d', Math.round(E.wave[0] + E.wave[1] * dist[i] / far) + 'ms');
    // each tile turns away from the tap, so the wave seems to flow outwards
    t.style.setProperty('--dir', boxes[i].left + boxes[i].width / 2 < x - 2 ? -1 : 1);
  });
}

function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.panel .card'), wall = $('.wall'), E = MOTION.envelope;
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
  function play(x, y) {
    if (state !== 'closed') return;
    state = 'playing';
    if (reduce) { go(false); return; }
    const b = wall.getBoundingClientRect();
    waveFrom(wall, x ?? b.left + b.width / 2, y ?? b.top + b.height / 2);
    root.classList.add('is-opening');
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    root.classList.remove('is-opening', 'is-opened');
    card.style.viewTransitionName = '';
    state = 'closed';
  }
  // a pointer tap starts the wave under the finger; Enter / Space (and a click without coordinates) from the centre
  stage.addEventListener('click', (e) => {
    if (state === 'closed') play(e.detail ? e.clientX : undefined, e.detail ? e.clientY : undefined);
    else if (state === 'opened') go(true);
  });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(() => play()); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); card.style.viewTransitionName = ''; state = 'opened'; }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: the thank-you is uncovered tile by tile (after the panel is shown and has its size)
    const panel = $('.reply-panel[data-rsvp-state=success]');
    if (st === 'success' && panel) {
      requestAnimationFrame(() => {
        panel.classList.add('mosaic');
        mosaic(panel, { ...MOTION.mosaic.reply, min: 6, max: 12 });
        requestAnimationFrame(() => { panel.style.setProperty('--base', '120ms'); panel.classList.add('in'); });
      });
    }
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
