/* Velvet Jewel Box — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 23, G423): the diamond catches the light, the rose gold ring slides up off the satin band and
   floats away over the envelope, the band parts at its knot (its upper half is drawn back over the flap, its lower half
   slips down), the three-lobed velvet flap swings up on its top edge onto its champagne satin lining, the pearl-edged
   card rises out of the pocket while light sweeps over the satin, pearls, petals and tiny diamonds drift down
   (MOTION.accents.open), the card comes forward and flies to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope.
   Inner pages: every photo sits in a GPT jewel setting (cameo, tray, wide frame) and comes up under a sweep of light;
   the story's three settings stand on the turning display (initCarousel); a reply is answered with pearls, petals and
   diamonds drifting down. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    glint: [0, 520],        // the diamond catches the light
    ring: [180, 1100],      // the ring slides up off the band and floats away over the envelope
    ribbon: [700, 650],     // the band parts at its knot: the upper half is drawn back, the lower half slips down
    flap: [1250, 700],      // the lobed velvet flap swings up on its top edge, its satin lining shows
    accents: 1650,          // pearls, petals and tiny diamonds drift down (MOTION.accents.open)
    rise: [1850, 650],      // the card rises out of the pocket
    light: [1950, 1100],    // light sweeps over the satin lining behind it
    forward: [2500, 400],   // and comes forward
    go: 3000,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['ring', 0], ['photo', 200], ['line', 1000], ['names', 1160], ['date', 1460], ['venue', 1640]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['box', 0], ['names', 900], ['links', 1200]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-frame': [['frame', 0]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // the story's turning display: degrees between photos; radius × photo width; px of drag per photo (× width)
  carousel: { step: 38, radius: 1.45, drag: 0.9 },
  // the GPT accents (pearl, petal, diamond): drifting over the opening envelope and over a reply
  accents: {
    open: [{ img: 'img/pearl-160.webp', count: 5, dur: [2400, 3200], size: [12, 20] },
      { img: 'img/petal-160.webp', count: 5, dur: [2800, 3600], size: [22, 34] },
      { img: 'img/diamond-160.webp', count: 4, dur: [2000, 2800], size: [10, 16] }],
    reply: [{ img: 'img/pearl-160.webp', count: 6, dur: [2600, 3600], size: [12, 20] },
      { img: 'img/petal-160.webp', count: 6, dur: [3000, 4200], size: [22, 34] },
      { img: 'img/diamond-160.webp', count: 4, dur: [2200, 3000], size: [10, 16] }]
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

/* -- a reply is in (MOTION.accents): the GPT accents fall, turning, and are removed when they land */
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
      const dy = Math.min(innerHeight * 0.75, box.height + 60), dx = (Math.random() - 0.5) * 120, r = (Math.random() - 0.5) * 120;
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
    // the reply is in: pearls, petals and diamonds drift down over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initCarousel();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
