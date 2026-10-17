/* Maison Pâtisserie — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 #28 — a pâtisserie box, not an envelope): the satin bow unties (its two loops part, the knot drops),
   the four ribbon arms slide off the lid, the lid lifts away, the tissue paper parts and the card inside comes forward,
   then flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the same
   numbers as MOTION.envelope. Story: the display-case shelf (swipe / drag, snap, buttons, ← →). RSVP: a light shower of
   sugar pearls when a reply is sent (MOTION.accents.closing). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    hint: [0, 300],         // "Tap to open the box" fades
    tug: [0, 260],          // the box gives a little under the tap
    head: [0, 450],         // kicker, names and date rise away
    closure: [180, 820],    // the bow unties: its two loops part to the sides, the knot drops (bow_l, bow_r, bow_knot)
    ribbons: [420, 700],    // the four ribbon arms slide off the lid (ribbon_n/s/w/e)
    lid: [1100, 800],       // the lid lifts towards the guest, then away (lid)
    tissue: [1850, 750],    // the two sheets of tissue paper part like curtains (tissue_left/right)
    rise: [2500, 700],      // the card inside lifts out of the box
    forward: [3200, 300],   // and comes forward
    go: 3600,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['kicker', 200], ['names', 420], ['date', 760]],
    'home-invite': [['host', 0], ['names', 240], ['request', 560], ['date', 820], ['venue', 1080], ['reply', 1340], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 300], ['link', 640]],
    'home-day': [['head', 0], ['list', 360], ['link', 700]],
    'home-foot': [['bow', 0], ['names', 320], ['links', 680]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 480]],
    'story-shelf': [['card', 0]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 180], ['venue', 480]],
    'details-card': [['programme', 0], ['venue', 380]],
    'details-notes': [['note', 0]],
    'details-menu': [['head', 0], ['case', 260]],
    'details-faq': [['head', 0], ['item', 240]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 480], ['cta', 760]],
    'rsvp-form': [['form', 0]],
    'rsvp-closing': [['bow', 0], ['names', 300], ['links', 640]]
  },
  stagger: 200,
  batchGap: 360,
  arriveDelay: 160,
  accents: {                // moment → particle groups (GPT accent_1: a sugar pearl)
    closing: [{ file: 'img/accent_1-200.webp', count: 18, path: 'fall', origin: 'top', dur: [1700, 2600], size: [9, 18] }]
  }
};

(() => {
'use strict';
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (q) => document.querySelector(q), $$ = (q) => [...document.querySelectorAll(q)];
const BASE = document.currentScript ? document.currentScript.src : location.href;
let SITE = null;
try { SITE = JSON.parse($('#site-data')?.textContent || 'null'); } catch (e) { SITE = null; }
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY, ARRIVE = MOTION.storage.arrive + KEY;
const store = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } };
const crossDocVT = 'onpageswap' in window && Boolean(document.startViewTransition);

/* -- long names: one line while they fit, then smaller, then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = 32;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1 || Math.max(...parts.map((n) => n.getBoundingClientRect().width)) > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) parts.forEach((n) => { n.style.whiteSpace = 'normal'; });
  });
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    if (!instant) n.style.transitionDelay = (base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger) + 'ms';
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

/* -- the box */
function initBox() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.box .card'), E = MOTION.envelope;
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

/* -- the display-case shelf: native swipe + scroll snap; a mouse drags it; buttons and ← → step one photo; the photo
      in the middle stands forward (.is-current). Reduced motion: CSS turns it into a list and this does nothing. */
function initShelf() {
  const track = $('[data-shelf]');
  if (!track || reduce) return;
  const cards = [...track.querySelectorAll('.shelf-card')];
  const count = $('[data-shelf-count]');
  track.classList.add('is-on');
  let current = -1;
  const nearest = () => {
    const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < dist) { dist = d; best = i; } });
    return best;
  };
  const mark = () => {
    const i = nearest();
    if (i === current) return;
    current = i;
    cards.forEach((c, n) => { c.classList.toggle('is-current', n === i); if (c.classList.contains('in')) c.style.transitionDelay = '0ms'; });
    if (count) count.textContent = (i + 1) + ' / ' + cards.length;
  };
  const show = (i) => {
    const c = cards[Math.max(0, Math.min(cards.length - 1, i))];
    track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  };
  let raf = 0;
  track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
  $('[data-shelf-prev]')?.addEventListener('click', () => show(nearest() - 1));
  $('[data-shelf-next]')?.addEventListener('click', () => show(nearest() + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(nearest() + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  // a mouse or pen drags the shelf (touch already scrolls natively)
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; track.classList.add('is-dragging'); }
    track.scrollLeft = drag.left - dx;
  });
  const end = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    track.classList.remove('is-dragging');
    if (moved) show(nearest());
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  track.addEventListener('click', (e) => { if (track.classList.contains('is-dragging')) e.preventDefault(); }, true);
  addEventListener('resize', () => { current = -1; mark(); }, { passive: true });
  mark();
}

/* -- sugar pearls: a light shower when the reply is sent (GPT sprite; none with reduced motion) */
function shower(moment) {
  if (reduce || !Element.prototype.animate) return;
  const groups = MOTION.accents[moment] || [];
  if (!groups.length) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const W = innerWidth, H = innerHeight;
  const rand = (a, b) => a + Math.random() * (b - a);
  let last = 0;
  groups.forEach((g) => {
    const src = new URL(g.file, BASE).href;
    for (let i = 0; i < g.count; i++) {
      const img = new Image();
      img.src = src;
      img.alt = '';
      const size = rand(g.size[0], g.size[1]), dur = rand(g.dur[0], g.dur[1]), delay = rand(0, 600);
      const x = rand(.06, .94) * W, drift = rand(-40, 40);
      img.style.width = size + 'px';
      layer.append(img);
      img.animate([
        { transform: `translate(${x}px, ${-30 - size}px) rotate(0deg)`, opacity: 0 },
        { opacity: 1, offset: .08 },
        { opacity: 1, offset: .82 },
        { transform: `translate(${x + drift}px, ${H * rand(.55, .9)}px) rotate(${rand(-160, 160)}deg)`, opacity: 0 }
      ], { duration: dur, delay, easing: 'cubic-bezier(.35,.05,.6,1)', fill: 'both' });
      last = Math.max(last, dur + delay);
    }
  });
  setTimeout(() => layer.remove(), last + 100);
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    if (st === 'success') shower('closing');
  });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initBox();
  initScenes();
  initCountdown();
  initShelf();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
