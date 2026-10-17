/* Crimson Rose Atelier — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/11 §7.3, kapak): the seal lifts and drops away, the flap turns up on its hinge, the lining shows, the ivory
   card rises from the pocket, comes forward and flies to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    closure: [0, 400],      // the gold seal lifts, tilts and drops away
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 400],         // kicker, names and date rise away
    lift: [400, 1050],      // the flap turns up on its hinge (cut from the closed envelope)
    open: [650, 300],       // the open envelope's lining shows behind the turned flap
    rise: [1600, 1400],     // the ivory card rises out of the pocket
    forward: [3000, 300],   // the card comes forward, over the pocket
    go: 3350,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['host', 0], ['names', 180], ['request', 620]],
    'home-portrait': [['portrait', 0], ['date', 520]],
    'home-invite': [['title', 0], ['names', 260], ['date', 640], ['venue', 900], ['reply', 1150], ['count', 1350], ['calendar', 1550]],
    'home-teasers': [['head', 0], ['leaf', 260]],
    'home-day': [['head', 0], ['link', 420]],
    'home-foot': [['rose', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['album', 0]],
    'details-head': [['date', 0], ['title', 220]],
    'rsvp-closing': [['rose', 0], ['names', 300], ['links', 650]]
  },
  stagger: 200,
  batchGap: 360,
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
    el.closest('.home-hero')?.classList.toggle('is-long', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.home-hero') ? 34 : 26;
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
  const card = $('.env-card'), E = MOTION.envelope;
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

/* -- story album: native buttons, keyboard arrows and an optional swipe; no auto-rotation */
function initAlbum() {
  const leaves = $$('[data-album-page]'), prev = $('[data-album-prev]'), next = $('[data-album-next]');
  if (!leaves.length || !prev || !next) return;
  const tabs = $$('[data-album-go]');
  let active = Math.max(0, Math.min(leaves.length - 1, Number(location.hash.replace('#chapter-', '')) - 1 || 0));
  function show(index, animate = true) {
    active = Math.max(0, Math.min(leaves.length - 1, index));
    leaves.forEach((leaf, i) => { leaf.hidden = i !== active; leaf.classList.toggle('changing', i === active && animate && !reduce); });
    tabs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === active)));
    $('[data-album-number]').textContent = String(active + 1).padStart(2, '0');
    prev.disabled = active === 0; next.disabled = active === leaves.length - 1;
    history.replaceState(null, '', '#chapter-' + (active + 1));
  }
  $('.album-controls').hidden = false; $('.album-tabs').hidden = false; show(active, false);
  prev.addEventListener('click', () => show(active - 1)); next.addEventListener('click', () => show(active + 1));
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  $('.album').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); }
  });
  let x = null;
  const pages = $('.album-pages');
  pages.addEventListener('touchstart', (e) => { x = e.touches[0].clientX; }, { passive: true });
  pages.addEventListener('touchend', (e) => { if (x !== null) { const dx = e.changedTouches[0].clientX - x; if (Math.abs(dx) > 60) show(active + (dx < 0 ? 1 : -1)); } x = null; }, { passive: true });
  addEventListener('hashchange', () => { const n = Number(location.hash.replace('#chapter-', '')) - 1; if (Number.isInteger(n) && n >= 0 && n < leaves.length) show(n); });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => { const st = e.detail && e.detail.state; if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success'); });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initAlbum();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
