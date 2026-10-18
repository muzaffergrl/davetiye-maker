/* Art Nouveau Lily — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 37): a band of light sweeps across the cream envelope and through the stained-glass lily
   medallion, the medallion glows and lifts away, the two side petal flaps open outward on their side hinges and curl
   back (their lilac lining turns into view at 90°: one 3D wrapper per petal, a front and a lining face), the centre
   petal opens upward on its top hinge — the envelope opens like a lily — and the card rises out of the pocket, comes
   forward and flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the
   same numbers as MOTION.envelope. On the inner pages every photo sits in a stained-glass arch: it waits grey like
   glass at dusk, a band of light passes through it as its scene enters the view and its colours come alive (site.css
   .vitrail), and while the page scrolls the light keeps moving slowly through each window (--p). Gold whiplash lines
   (GPT, W2.12) are drawn under the headings by a moving mask. The lily petals of a sent reply are the GPT sprite W2.13
   (named by parts.css --anl-petals); without it there are none, never a drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // host line, names, date and "Tap to open" rise away
    sweep: [100, 900],      // a band of light crosses the envelope and passes through the stained glass
    glow: [300, 700],       // the medallion glows: light behind the glass (light only)
    medallion: [800, 500],  // and lifts away
    sides: [1100, 900],     // the left and right petals open outward on their side hinges and curl back (lining at 90°)
    centre: [1500, 900],    // the centre petal opens upward on its top hinge
    rise: [2400, 650],      // the card rises out of the pocket
    forward: [3050, 400],   // and comes forward
    go: 3550,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 560], ['names', 760], ['date', 1060], ['venue', 1260]],
    'home-invite': [['title', 0], ['host', 320], ['names', 520], ['date', 880], ['venue', 1120], ['reply', 1380], ['count', 1580], ['calendar', 1780]],
    'home-teasers': [['photo', 0], ['head', 480], ['link', 820]],
    'home-day': [['head', 0], ['list', 420], ['link', 740]],
    'home-foot': [['lily', 0], ['names', 520], ['links', 900]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 640]],
    'story-frame': [['photo', 0], ['caption', 1150]],
    'story-next': [['lily', 0], ['names', 360], ['links', 640]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 320], ['after', 920]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1300]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['lily', 0], ['names', 360], ['links', 700]]
  },
  stagger: 180,
  batchGap: 360,
  arriveDelay: 150,
  // lily petals (GPT sprite W2.13): reply = a few petals drift down over the thank-you panel when an RSVP is sent
  accents: {
    reply: [{ count: 6, path: 'fall', dur: [2600, 3600], size: [18, 30] }]
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
let PETALS = [];
try { PETALS = getComputedStyle(root).getPropertyValue('--anl-petals').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { PETALS = []; }
const petalSrc = (i) => new URL(PETALS[i % PETALS.length], SCRIPT_URL).href;

/* -- long names: on one line while they fit, then smaller (never below the floor), then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    el.classList.toggle('long-names', parts.some((n) => n.textContent.length > 14));
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero') ? 36 : 34;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the card from the envelope keeps its fixed paper: long names get smaller, then the arched portrait gets smaller */
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
    if (!instant) n.style.transitionDelay = delay + 'ms';
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

/* -- light through the windows: --p (0 → 1 while a stained-glass arch crosses the view) moves the soft light in it */
function initLight() {
  const arches = $$('.arch, .venue-photo');
  if (reduce || !arches.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const vh = innerHeight;
    arches.forEach((d) => {
      const b = d.getBoundingClientRect();
      if (b.bottom < -vh || b.top > 2 * vh) return;
      d.style.setProperty('--p', Math.max(0, Math.min(1, (vh - b.top) / (vh + b.height))).toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

/* -- lily petals (MOTION.accents): the GPT sprite, a few pieces, removed when they fade */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !PETALS.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: petalSrc(left), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.1 + 0.8 * Math.random()), y = Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = (g.path === 'fall' ? 1 : -1) * Math.min(innerHeight * 0.55, box.height + 160), dx = (Math.random() - 0.5) * 90;
      const turn = (Math.random() - 0.5) * 220;
      left++;
      // a petal: it sways a little as it drifts down, turning slowly, and fades
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 1, offset: 0.15 },
        { transform: `translate(${dx * 0.6}px,${dy * 0.45}px) rotate(${turn * 0.5}deg)`, offset: 0.5 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${turn}deg)` }],
      { duration: dur, delay: i * 220, easing: 'ease-in-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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
    // the reply is in: a few lily petals drift down over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initLight();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
