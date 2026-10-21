/* Silver Photo Booth — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/33 row 39): the flashbulb fires (a white camera flash), the photo-booth strip that wraps the envelope
   slides up off it and turns aside to rest beside the envelope (its flight is computed here from where it lies on the
   envelope to the free space beside it: --tx / --ty / --r / --s), the deep U flap swings up on its top edge onto its
   black star-dust lining, and the card rises out of the pocket, a second flash as it comes forward, and flies to home
   (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the same numbers as MOTION.envelope.
   On the inner pages framed photos develop: the booth's flash goes off in the window and the picture comes up from white
   to full contrast; on home a strip of three frames prints down out of the chrome slot, frame by frame. A reply is
   answered with four flashes and a shower of the GPT accents (star sequin, ranunculus petal, satin ribbon curl). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    flash: [0, 520],        // the flashbulb fires: a white camera flash
    strip: [180, 900],      // the photo strip slides up off the envelope and turns aside to rest beside it
    flap: [1150, 700],      // the U flap swings up on its top edge, its black star-dust lining shows
    rise: [1700, 650],      // the card rises out of the pocket
    flash2: [2200, 520],    // a second flash as the card comes forward
    forward: [2350, 400],   // and comes forward
    go: 2850,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  // the closed envelope (site.css .envelope / .band, manifest stage): the strip in % of the envelope
  band: { left: 34.75, top: 3.73, width: 30.5, height: 93.19 },
  // where the strip rests: beside the envelope on the right, tilted; never larger than `scaleMax`, never under `scaleMin`
  // (on a narrow screen it rests over the envelope's right edge instead), `gap` px from the envelope
  rest: { scaleMax: 0.62, scaleMin: 0.42, tilt: 8, gap: 10, lift: 0.06 },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 900], ['names', 1060], ['date', 1360], ['venue', 1540]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 600], ['link', 940]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['bulb', 0], ['names', 420], ['links', 820]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-frame': [['photo', 0], ['caption', 1300]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1400]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // a reply is in: the booth flashes four times, then a shower of star sequins, petals and ribbon curls
  flashes: { count: 4, gap: 420 },
  accents: {
    reply: [{ img: 'img/accent_1-160.webp', count: 6, dur: [2400, 3400], size: [18, 30] },
      { img: 'img/accent_2-160.webp', count: 5, dur: [2800, 3800], size: [26, 40] },
      { img: 'img/accent_3-160.webp', count: 3, dur: [2800, 3800], size: [34, 48] }]
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

/* -- where the strip comes to rest: from where it wraps the closed envelope (computed from the stage, which is never
   transformed) to the free space beside the envelope on the right, tilted. Written as CSS variables on the strip
   (site.css strip-off and .is-opened use them); called on load and on resize. */
function layoutStrip() {
  const stage = $('.stage'), host = $('.opening'), band = $('.envelope > .band');
  if (!stage || !host || !band) return null;
  const s = stage.getBoundingClientRect(), o = host.getBoundingClientRect();
  const B = MOTION.band, R = MOTION.rest;
  const w = s.width * B.width / 100, h = s.width / 0.6861 * B.height / 100;
  const room = Math.max(0, Math.min(o.right, innerWidth) - s.right - R.gap * 2);
  let k = Math.min(R.scaleMax, room / (w * 1.15));
  let cx = s.right + R.gap + w * k / 2 + 4;
  if (k < R.scaleMin) { k = R.scaleMin; cx = s.right - w * k * 0.15; }   // narrow: over the envelope's right edge
  const fromX = s.left + s.width * (B.left + B.width / 2) / 100;
  const fromY = s.top + s.width / 0.6861 * (B.top + B.height / 2) / 100;
  const cy = s.top + h * k / 2 - h * R.lift;
  band.style.setProperty('--tx', (cx - fromX).toFixed(1) + 'px');
  band.style.setProperty('--ty', (cy - fromY).toFixed(1) + 'px');
  band.style.setProperty('--r', R.tilt + 'deg');
  band.style.setProperty('--s', k.toFixed(3));
  return { k, cx, cy };
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

/* -- the booth flashes n times (light only: a white layer that blinks) */
function flashes(n, gap) {
  if (reduce || !Element.prototype.animate) return 0;
  const f = document.createElement('div');
  f.className = 'flash';
  f.setAttribute('aria-hidden', 'true');
  document.body.append(f);
  for (let i = 0; i < n; i++) {
    f.animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.12 }, { opacity: 0 }], { duration: 380, delay: i * gap, easing: 'ease-out', fill: 'both' });
  }
  setTimeout(() => f.remove(), n * gap + 400);
  return n * gap;
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
      const dy = Math.min(innerHeight * 0.75, box.height + 60), dx = (Math.random() - 0.5) * 90, r = (Math.random() - 0.5) * 220;
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
  layoutStrip();
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
    layoutStrip();
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
    // the reply is in: four flashes, then the accents fall over the thank-you panel (after it is shown)
    if (st === 'success') {
      const F = MOTION.flashes, wait = flashes(F.count, F.gap);
      setTimeout(() => requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card'))), wait);
    }
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(() => { fit(); layoutStrip(); });
  addEventListener('resize', () => { fit(); layoutStrip(); }, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
