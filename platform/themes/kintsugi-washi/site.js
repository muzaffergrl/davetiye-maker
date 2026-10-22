/* Kintsugi & Washi — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 26, G426): the kintsugi-mended porcelain button turns half a turn and lifts away, the twisted
   gold-and-ivory cord unwinds and slides off, the stage settles back while the four indigo washi flaps of the tatō fold
   unfold one by one in pinwheel order (north, east, south, west — 220 ms apart), each on its own hinge in 3D onto its
   real inner face; the rice-paper card rises from the centre toward the viewer while gold-leaf flakes, ink drops and
   plum petals drift down (MOTION.accents.open), comes forward and flies to home (view transition invite-card). The CSS
   keyframes in site.css (".is-opening …") use the same numbers as MOTION.envelope.
   Inner pages: every photo sits in a GPT washi mat and appears through a spreading sumi ink bloom (CSS mask); light
   runs along the mats' gold seams; a reply is answered with gold leaf, ink drops and petals and the tea bowl's glint. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    button: [0, 1100],      // the porcelain button turns half a turn, then lifts away toward the viewer and fades
    cord: [200, 800],       // the cord unwinds: it slackens, turns a little and slides off to the right
    settle: [700, 900],     // the stage settles back to .52: the open packet is about twice as wide
    flapN: [950, 650],      // the four flaps unfold in pinwheel order, 220 ms apart, each on its own hinge (3D),
    flapE: [1170, 650],     //   onto its real inner face
    flapS: [1390, 650],
    flapW: [1610, 650],
    accents: 2050,          // gold-leaf flakes, indigo ink drops and plum petals drift down (MOTION.accents.open)
    rise: [2250, 700],      // the card rises from the centre toward the viewer (no pocket)
    light: [2350, 1000],    // light sweeps over the card
    forward: [2950, 400],   // and comes forward
    go: 3450,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 900], ['names', 1060], ['date', 1360], ['venue', 1540]],
    'home-invite': [['seam', 0], ['title', 200], ['host', 500], ['names', 700], ['date', 1060], ['venue', 1300], ['reply', 1560], ['count', 1760], ['calendar', 1960]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['bowl', 0], ['names', 700], ['links', 1000]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-moment': [['mat', 0], ['caption', 1500]],
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
  // the GPT accents (gold-leaf flake, indigo ink drop, plum petal): drifting over the opening packet and over a reply;
  // an ink drop does not turn — it lands and spreads a little, as ink does on paper
  accents: {
    open: [{ img: 'img/flake-160.webp', count: 6, dur: [2400, 3200], size: [12, 22] },
      { img: 'img/drop-160.webp', count: 3, dur: [1600, 2200], size: [9, 14], spread: true },
      { img: 'img/petal-160.webp', count: 5, dur: [2800, 3600], size: [16, 26] }],
    reply: [{ img: 'img/flake-160.webp', count: 7, dur: [2600, 3600], size: [12, 22] },
      { img: 'img/drop-160.webp', count: 3, dur: [1800, 2400], size: [9, 14], spread: true },
      { img: 'img/petal-160.webp', count: 6, dur: [3000, 4200], size: [16, 26] }]
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

/* -- the GPT accents (MOTION.accents) fall, turning (an ink drop lands and spreads), and are removed when they end */
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
      const frames = g.spread
        ? [{ opacity: 0, transform: 'translate(0,0) scale(1)' }, { opacity: 1, offset: 0.1 },
          { transform: `translate(${dx * 0.3}px,${dy * 0.6}px) scale(1)`, offset: 0.62 },
          { opacity: 1, transform: `translate(${dx * 0.3}px,${dy * 0.6}px) scale(1.7,1.5)`, offset: 0.8 },
          { opacity: 0, transform: `translate(${dx * 0.3}px,${dy * 0.6}px) scale(1.9,1.7)` }]
        : [{ opacity: 0, transform: 'translate(0,0) rotate(0deg)' }, { opacity: 1, offset: 0.1 },
          { transform: `translate(${dx * 0.5}px,${dy * 0.45}px) rotate(${r * 0.5}deg)`, offset: 0.5 },
          { opacity: 1, offset: 0.8 },
          { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${r}deg)` }];
      img.animate(frames, { duration: dur, delay: k * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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
    // the reply is in: gold leaf, ink drops and petals drift down over the thank-you panel (after it is shown) and
    // light runs over the gold of the mended tea bowl
    if (st === 'success') {
      requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
      const bowl = $('.rsvp-page .signature .bowl');
      if (bowl && !reduce) { bowl.classList.remove('glint'); void bowl.offsetWidth; bowl.classList.add('glint'); }
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
