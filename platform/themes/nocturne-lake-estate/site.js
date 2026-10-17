/* Nocturne Lake Estate — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/11 §7.3, kapak; interim pieces cut from one GPT envelope, build_images.py): the gold seal lifts off and
   drops away, the flap turns up on its hinge and its inside takes over at 90°, the charcoal card rises out of the pocket,
   comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the
   same numbers as MOTION.envelope. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    closure: [0, 650],      // the gold seal lifts off, tilts and drops away below the envelope
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 450],         // kicker, names and date rise away
    lift: [450, 700],       // the flap turns up on its hinge to 90° (env_flap)
    flap: [1150, 650],      // its inside takes over at 90° and lays back (env_inner)
    rise: [1700, 1300],     // the card rises out of the pocket
    forward: [3000, 350],   // the card comes forward, over the pocket
    go: 3450,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['host', 0], ['names', 220], ['request', 700], ['date', 950]],
    'home-invite': [['portrait', 0], ['title', 300], ['names', 560], ['date', 900], ['venue', 1150], ['reply', 1400], ['count', 1600], ['calendar', 1800]],
    'home-teasers': [['photo', 0], ['head', 250], ['link', 600]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['seal', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['frame', 0]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['programme', 0], ['venue', 400]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 800]],
    'rsvp-closing': [['seal', 0], ['names', 300], ['links', 650]]
  },
  stagger: 180,
  batchGap: 380,
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
    el.closest('.lake-hero')?.classList.toggle('is-long', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.lake-hero') ? 32 : 26;
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

/* -- envelope */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.env .card'), E = MOTION.envelope;
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

/* -- story gallery: each photo opens in a native <dialog>; arrows and Escape, no auto-rotation */
function initGallery() {
  const box = $('.lightbox'), shots = $$('[data-gallery-open]');
  if (!box || !shots.length || !box.showModal) return;
  const caption = box.querySelector('.lightbox-caption'), count = box.querySelector('[data-gallery-count]');
  const image = Object.assign(document.createElement('img'), { alt: '', decoding: 'async' });
  let placed = false;
  let active = 0;
  function show(n) {
    active = (n + shots.length) % shots.length;
    const src = shots[active].querySelector('img');
    if (!placed) { caption.before(image); placed = true; }
    image.src = src.currentSrc || src.src;
    image.alt = src.alt;
    caption.textContent = shots[active].closest('figure').querySelector('figcaption [data-field]').textContent.trim();
    count.textContent = (active + 1) + ' / ' + shots.length;
  }
  shots.forEach((b, i) => b.addEventListener('click', () => { show(i); box.showModal(); }));
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.querySelector('[data-gallery-prev]').addEventListener('click', () => show(active - 1));
  box.querySelector('[data-gallery-next]').addEventListener('click', () => show(active + 1));
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); }
  });
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => { const st = e.detail && e.detail.state; if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success'); });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initGallery();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
