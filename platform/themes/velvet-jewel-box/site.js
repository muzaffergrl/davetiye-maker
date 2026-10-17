/* Velvet Jewel Box — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/11 §7.1 hand-over; a ring box, not an envelope — the standard key name `envelope` is kept for the
   platform's sound cues, tests/g126-audio.test.ts): the satin bow slides off, the box gives a small press, the velvet
   lid turns back on its hinge and its satin inside takes over at 90°, a light sweeps across the satin, the card rises
   out of the box, comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css
   (".is-opening …") use the same numbers. Story: the cylinder carousel (drag / swipe + snap, arrows, keys; with reduced
   motion or without JavaScript a plain scroll-snap slider). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 450],         // kicker, names and date rise away
    closure: [0, 650],      // the satin bow slides off the lid, down and away
    tug: [450, 250],        // the box gives a small press (the clasp lets go)
    lid: [650, 650],        // the velvet lid turns back on its hinge to 90° (box_lid)
    inner: [1300, 600],     // its satin inside takes over at 90° and stands up (box_inner)
    sheen: [1700, 900],     // a light sweeps across the satin
    rise: [1900, 1200],     // the card rises out of the box
    forward: [3100, 350],   // the card comes forward, over the box
    go: 3550,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['host', 0], ['names', 200], ['request', 700], ['date', 950]],
    'home-invite': [['sweep', 0], ['portrait', 120], ['title', 420], ['names', 680], ['date', 980], ['venue', 1200], ['reply', 1450], ['count', 1650], ['calendar', 1850]],
    'home-teasers': [['photo', 0], ['head', 260], ['link', 620]],
    'home-day': [['sweep', 0], ['head', 120], ['list', 460], ['link', 780]],
    'home-foot': [['bow', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['frame', 0]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['programme', 0], ['venue', 420]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 800]],
    'rsvp-form': [['sweep', 0], ['form', 120]],
    'rsvp-closing': [['bow', 0], ['names', 300], ['links', 650]]
  },
  carousel: { step: 38, radius: 1.45, drag: 0.9 },   // degrees between photos; radius × photo width; px of drag per photo (× width)
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
    const min = el.closest('.velvet-hero') ? 40 : 34;
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

/* -- the box (standard name: envelope) */
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

/* -- story: the turning display. 3D unless reduced motion; the figures stay a scroll-snap slider otherwise */
function initCarousel() {
  const show = $('.showcase'), track = $('[data-carousel]');
  if (!show || !track) return;
  const gems = [...track.querySelectorAll('.gem')], n = gems.length, C = MOTION.carousel;
  const count = $('[data-carousel-count]');
  const prev = $('[data-carousel-prev]'), next = $('[data-carousel-next]');
  let pos = 0;
  // at the ends the arrow is aria-disabled, not disabled: a disabled button would drop keyboard focus to <body>
  const label = (i) => {
    if (count) count.textContent = (i + 1) + ' / ' + n;
    prev?.setAttribute('aria-disabled', String(i <= 0));
    next?.setAttribute('aria-disabled', String(i >= n - 1));
  };
  if (reduce || n < 2) {
    const width = () => gems[0].getBoundingClientRect().width + 16;
    const at = () => Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / width())));
    const go = (d) => track.scrollTo({ left: (at() + d) * width() });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => label(at()), { passive: true });
    label(0);
    return;
  }
  show.classList.add('is-3d');
  const render = () => {
    const w = gems[0].offsetWidth, r = w * C.radius;
    gems.forEach((g, i) => {
      const d = i - pos, a = d * C.step;
      g.style.transform = `translateZ(${-r}px) rotateY(${a}deg) translateZ(${r}px)`;
      g.style.filter = `brightness(${Math.max(.45, 1 - Math.abs(d) * .35)})`;
      g.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
      g.classList.toggle('is-front', Math.abs(d) < .5);
      g.setAttribute('aria-hidden', Math.abs(d) < .5 ? 'false' : 'true');
    });
  };
  const snap = (to) => {
    pos = Math.max(0, Math.min(n - 1, Math.round(to)));
    track.classList.add('is-snapping');
    render();
    label(pos);
  };
  track.addEventListener('transitionend', () => track.classList.remove('is-snapping'));
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, pos, moved: false, id: e.pointerId };
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 6) return;
    if (!drag.moved) {
      if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }   // a vertical scroll, not a turn
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
      track.classList.remove('is-snapping');
    }
    const span = gems[0].offsetWidth * C.drag;
    pos = Math.max(-.35, Math.min(n - .65, drag.pos - dx / span));
    render();
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved, from = drag.pos;
    drag = null;
    track.classList.remove('is-dragging');
    if (!moved) return;
    snap(Math.abs(pos - from) > .18 && Math.round(pos) === from ? from + Math.sign(pos - from) : pos);
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  gems.forEach((g, i) => g.addEventListener('click', () => { if (i !== pos) snap(i); }));
  prev?.addEventListener('click', () => snap(pos - 1));
  next?.addEventListener('click', () => snap(pos + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); snap(pos - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); snap(pos + 1); }
    if (e.key === 'Home') { e.preventDefault(); snap(0); }
    if (e.key === 'End') { e.preventDefault(); snap(n - 1); }
  });
  addEventListener('resize', render, { passive: true });
  render();
  label(0);
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // sent: the satin light crosses the reply card once more (the foil of "Thank you!" is CSS: site.css .is-sent)
    const card = $('.reply-card[data-scene]');
    if (card) { card.classList.remove('is-sent'); if (st === 'success' && !reduce) { void card.offsetWidth; card.classList.add('is-sent'); } }
  });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initCarousel();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
