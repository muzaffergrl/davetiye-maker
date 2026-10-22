/* Maison Pâtisserie — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 28, G428): the sugared rose bud tips and rolls off the knot, the satin bow is swapped for its
   untied tails, which slip away to the right, the rose sleeve band slides off to the right after them, the scalloped
   pistachio flap opens in 3D on its top edge onto its rose doily lining, the cream card rises from behind the pocket
   while light passes over it, macarons, sugar pearls and petals drop in with a little bounce (MOTION.accents.open), the
   card comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …")
   use the same numbers as MOTION.envelope.
   Inner pages: the photos sit in GPT frames (the icing oval, porcelain cake plates, the pâtisserie window); the story's
   three plates stand on a glass display-case shelf that slides sideways, the plate in the middle stepping forward with
   a slight turn (initShelf); a reply is answered with a shower of sugar pearls, macarons and petals. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    bud: [0, 900],          // the sugared rose bud tips and rolls off the knot
    untie: [700, 450],      // the tied bow gives way to its untied tails
    ribbon: [1100, 750],    // the loose tails slip away to the right
    sleeve: [1200, 800],    // the rose sleeve band slides off to the right
    flap: [1950, 750],      // the scalloped flap opens in 3D on its top edge, its rose doily lining shows
    rise: [2500, 700],      // the card rises from behind the pocket
    light: [2600, 1000],    // light passes over the card
    accents: 2700,          // macarons, sugar pearls and petals drop in with a bounce (MOTION.accents.open)
    forward: [3200, 450],   // and comes forward
    go: 3700,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['bud', 0], ['photo', 200], ['line', 1000], ['names', 1160], ['date', 1460], ['venue', 1640]],
    'home-invite': [['bow', 0], ['title', 300], ['host', 560], ['names', 760], ['date', 1120], ['venue', 1360], ['reply', 1620], ['count', 1820], ['calendar', 2020]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['stand', 0], ['names', 900], ['links', 1200]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-shelf': [['shelf', 0], ['plate', 300], ['controls', 900]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['stand', 0], ['names', 700], ['links', 1000]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // the story's shelf: px between plates (× plate width), scale and turn of the side plates, px of drag per plate (× width)
  shelf: { step: 0.78, side: 0.72, turn: 9, drag: 0.85 },
  // the GPT accents (macaron, sugar pearl, petal): they drop onto the envelope and onto a reply and bounce once
  accents: {
    open: [{ img: 'img/macaron-160.webp', count: 4, dur: [1500, 1900], size: [26, 36] },
      { img: 'img/pearl-160.webp', count: 7, dur: [1200, 1600], size: [9, 14] },
      { img: 'img/petal-160.webp', count: 4, dur: [1700, 2200], size: [20, 30] }],
    reply: [{ img: 'img/pearl-160.webp', count: 12, dur: [1300, 1800], size: [9, 15] },
      { img: 'img/macaron-160.webp', count: 3, dur: [1600, 2000], size: [26, 36] },
      { img: 'img/petal-160.webp', count: 4, dur: [1800, 2400], size: [20, 30] }]
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
  for (let i = 0; i < 40 && over() && size > 12; i++) { size -= 1; names.style.fontSize = size + 'px'; }
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

/* -- the GPT accents (MOTION.accents): they drop in over the anchor, land in its lower part, bounce once and fade;
      each is removed when it is done */
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
      // they drop beside the card (outer sixths of the anchor) so they never cover the names on it
      const side = Math.random() < 0.5 ? 0.02 + 0.16 * Math.random() : 0.82 + 0.16 * Math.random();
      const x = box.left + box.width * side - size / 2, y = Math.max(-40, box.top - 40);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const land = Math.min(innerHeight - y - size - 8, box.height * (0.7 + 0.32 * Math.random()) + 40);
      const hop = 10 + Math.random() * 14, dx = (Math.random() - 0.5) * 50, r = (Math.random() - 0.5) * 160;
      left++;
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0deg)', easing: 'cubic-bezier(.5,0,.9,.5)' },
        { opacity: 1, offset: 0.1 },
        { transform: `translate(${dx}px,${land}px) rotate(${r}deg)`, offset: 0.5, easing: 'cubic-bezier(.2,.6,.4,1)' },
        { transform: `translate(${dx * 1.15}px,${land - hop}px) rotate(${r * 1.1}deg)`, offset: 0.62, easing: 'cubic-bezier(.6,0,.9,.6)' },
        { transform: `translate(${dx * 1.25}px,${land}px) rotate(${r * 1.15}deg)`, opacity: 1, offset: 0.74 },
        { opacity: 0, transform: `translate(${dx * 1.25}px,${land}px) rotate(${r * 1.15}deg)` }],
      { duration: dur, delay: k * 90, fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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

/* -- story: the display-case shelf. The plates slide along the glass shelf, the one in the middle steps forward with a
      slight turn; drag, swipe, the arrows or the keys move it and it settles on the nearest plate. With reduced
      motion the plates stay a plain scroll-snap row. */
function initShelf() {
  const show = $('.showcase'), track = $('[data-carousel]');
  if (!show || !track) return;
  const plates = [...track.querySelectorAll('.plate-item')], n = plates.length, C = MOTION.shelf;
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
    const width = () => plates[0].getBoundingClientRect().width + 16;
    const at = () => Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / width())));
    const go = (d) => track.scrollTo({ left: (at() + d) * width() });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => label(at()), { passive: true });
    label(0);
    return;
  }
  show.classList.add('is-sliding');
  const render = () => {
    const w = plates[0].offsetWidth;
    plates.forEach((p, i) => {
      const d = i - pos, a = Math.min(1, Math.abs(d));
      p.style.transform = `translateX(${d * C.step * w}px) scale(${1 - (1 - C.side) * a}) rotate(${d * C.turn}deg)`;
      p.style.filter = `brightness(${Math.max(.72, 1 - Math.abs(d) * .16)})`;
      p.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
      p.classList.toggle('is-front', Math.abs(d) < .5);
      p.setAttribute('aria-hidden', Math.abs(d) < .5 ? 'false' : 'true');
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
      if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }   // a vertical scroll, not a slide
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
      track.classList.remove('is-snapping');
    }
    const span = plates[0].offsetWidth * C.drag;
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
  plates.forEach((p, i) => p.addEventListener('click', () => { if (i !== pos) snap(i); }));
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
    // the reply is in: sugar pearls, macarons and petals drop onto the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initShelf();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
