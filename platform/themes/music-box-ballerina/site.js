/* Music Box Ballerina — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/11 §7.1 hand-over; a music box, not an envelope — the standard key name `envelope` is kept for the
   platform's sound cues, tests/g126-audio.test.ts): the brass key turns twice, the box clicks, the lid swings up on its
   back hinge and the mirror inside stands up, a glint crosses the glass, the ballerina rises from the satin well and
   turns slowly (GPT turn frames, a CSS sprite), a few rose petals drift down, the card rises out of the box, comes
   forward and flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the
   same numbers. Story: the mirror (one photo at a time; swipe, arrows, keys; with reduced motion or without
   JavaScript a plain list). Petals: GPT petal sprites, few, none with reduced motion. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    hint: [0, 300],         // "Turn the key" fades
    head: [0, 450],         // kicker, names and date rise away
    closure: [0, 900],      // the brass key turns twice (key)
    tug: [450, 200],        // the box gives a small click as the spring catches
    lid: [900, 600],        // the lid swings up on its back hinge to 90° (lid_closed)
    inner: [1500, 600],     // the mirror side of the lid takes over at 90° and stands up (lid_open + the portrait)
    petals: [1400, 2600],   // a few rose petals drift down over the box (site.js petals('opening'))
    dancer: [1800, 500],    // the ballerina rises from the satin well
    glint: [2000, 900],     // a light crosses the mirror glass
    turn: [2300, 2400],     // one slow pirouette (8 frames); she keeps turning while the box is open
    rise: [2900, 1000],     // the card rises out of the box
    forward: [3900, 350],   // the card comes forward, over the box
    go: 4350,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['host', 0], ['names', 200], ['request', 700], ['date', 950]],
    'home-invite': [['portrait', 0], ['title', 380], ['names', 640], ['date', 940], ['venue', 1160], ['reply', 1400], ['count', 1600], ['calendar', 1800]],
    'home-teasers': [['photo', 0], ['head', 260], ['link', 620]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['bow', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['frame', 0]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['programme', 0], ['venue', 420]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 800]],
    'rsvp-form': [['form', 0]],
    'rsvp-closing': [['bow', 0], ['names', 300], ['links', 650]]
  },
  petals: {                 // moment → how many GPT petals (img/petal_1..3-120.webp), how long, how big (px)
    opening: { count: 5, dur: [2600, 3600], size: [16, 26], spread: [.18, .82], delay: 900 },
    closing: { count: 9, dur: [2600, 3800], size: [16, 28], spread: [.06, .94], delay: 600 }
  },
  mirror: { change: 700 },  // ms of the glint between two photos in the mirror (site.css .reflection transitions)
  stagger: 200,
  batchGap: 400,
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

/* -- long names: one line each while they fit, then smaller, then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.music-hero') ? 40 : 34;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => Math.max(...parts.map((n) => n.scrollWidth)) > el.clientWidth + 1;
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

/* -- the music box (standard name: envelope) */
function initEnvelope() {
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
    timers.push(setTimeout(() => petals('opening'), E.petals[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    $$('.accent-layer').forEach((l) => l.remove());
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

/* -- petals: a few GPT rose petals drift down (the opening, a sent reply); none with reduced motion */
const BASE = (document.currentScript && document.currentScript.src) || location.href;
function petals(moment) {
  const P = MOTION.petals[moment];
  if (!P || reduce || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const W = innerWidth, H = innerHeight;
  const rand = (a, b) => a + Math.random() * (b - a);
  let last = 0;
  for (let i = 0; i < P.count; i++) {
    const img = new Image();
    img.src = new URL('img/petal_' + (i % 3 + 1) + '-120.webp', BASE).href;
    img.alt = '';
    const size = rand(P.size[0], P.size[1]), dur = rand(P.dur[0], P.dur[1]), delay = rand(0, P.delay);
    const x = rand(P.spread[0], P.spread[1]) * W, sway = rand(18, 42) * (i % 2 ? 1 : -1);
    img.style.width = size + 'px';
    layer.append(img);
    // a petal sways from side to side as it falls (three soft turns), it does not drop straight
    img.animate([
      { transform: `translate(${x}px, ${-20 - size}px) rotate(0deg)`, opacity: 0 },
      { transform: `translate(${x + sway}px, ${H * .22}px) rotate(${rand(40, 90)}deg)`, opacity: 1, offset: .25 },
      { transform: `translate(${x - sway}px, ${H * .5}px) rotate(${rand(-40, 30)}deg)`, offset: .55 },
      { transform: `translate(${x + sway * .6}px, ${H * .78}px) rotate(${rand(60, 140)}deg)`, opacity: .9, offset: .85 },
      { transform: `translate(${x}px, ${H * .95}px) rotate(${rand(90, 200)}deg)`, opacity: 0 }
    ], { duration: dur, delay, easing: 'ease-in-out', fill: 'both' });
    last = Math.max(last, dur + delay);
  }
  setTimeout(() => layer.remove(), last + 100);
}

/* -- story: the mirror. One photo at a time unless reduced motion (then the figures stay a plain list) */
function initMirror() {
  const show = $('.mirror-show'), glass = $('[data-mirror]');
  if (!show || !glass) return;
  const figs = [...glass.querySelectorAll('.reflection')], n = figs.length;
  const count = $('[data-mirror-count]');
  const prev = $('[data-mirror-prev]'), next = $('[data-mirror-next]');
  if (reduce || n < 2) { show.classList.add('is-list'); return; }
  show.classList.add('is-live');
  let pos = 0, turn = 0;
  // at the ends the arrow is aria-disabled, not disabled: a disabled button would drop keyboard focus to <body>
  const go = (to) => {
    to = Math.max(0, Math.min(n - 1, to));
    if (to !== pos) {
      turn += to > pos ? 2 : -2;                                   // the ballerina turns a quarter (2 of 8 frames)
      show.style.setProperty('--frame', String(turn));   // unbounded: the sprite repeats sideways
      show.classList.remove('is-glint');
      void show.offsetWidth;
      show.classList.add('is-glint');
    }
    pos = to;
    figs.forEach((f, i) => {
      f.classList.toggle('is-current', i === pos);
      f.setAttribute('aria-hidden', i === pos ? 'false' : 'true');
    });
    if (count) count.textContent = (pos + 1) + ' / ' + n;
    prev?.setAttribute('aria-disabled', String(pos <= 0));
    next?.setAttribute('aria-disabled', String(pos >= n - 1));
  };
  prev?.addEventListener('click', () => go(pos - 1));
  next?.addEventListener('click', () => go(pos + 1));
  glass.addEventListener('keydown', (e) => {
    const to = { ArrowLeft: pos - 1, ArrowRight: pos + 1, Home: 0, End: n - 1 }[e.key];
    if (to !== undefined) { e.preventDefault(); go(to); }
  });
  let drag = null;
  glass.addEventListener('pointerdown', (e) => { if (e.button === 0) drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
  glass.addEventListener('pointerup', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag = null;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) go(pos + (dx < 0 ? 1 : -1));   // a swipe, not a scroll
  });
  glass.addEventListener('pointercancel', () => { drag = null; });
  show.addEventListener('animationend', (e) => { if (e.animationName === 'glint') show.classList.remove('is-glint'); });
  go(0);
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // sent: a few petals drift down and the ballerina of the closing turns once (site.css .is-sent)
    const foot = $('.rsvp-page .signature');
    if (foot) { foot.classList.remove('is-sent'); if (st === 'success' && !reduce) { void foot.offsetWidth; foot.classList.add('is-sent'); } }
    if (st === 'success') petals('closing');
  });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initMirror();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
