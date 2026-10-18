/* Papel Picado Fiesta — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 38): the belly band of cut-paper flags works loose, its six flags lift off one by one and fly up
   into a garland across the sky over the names (each flag's flight is computed here from where it lies on the envelope
   to its place on the garland: --tx / --ty / --r / --s), where they wave in the wind; the straight flap swings up on
   its top edge onto its embroidered lining, the string lights light bulb by bulb, and the card rises out of the pocket,
   comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use
   the same numbers as MOTION.envelope.
   On the inner pages every photo hangs in a cut-paper frame (.hang): it drops in and swings to rest as its scene enters
   the view, then sways in the breeze; scrolling raises the wind (--wind, degrees, from the scroll speed) and it settles
   again. Text unfurls from its top edge like a flag.
   The bulbs (hangLights) are the GPT sprite W9 (named by parts.css --pf-bulb); without it there are no bulbs, never a
   drawn stand-in (K21). The flags are GPT pixels in every state (interim: plain tissue rectangles cut by the build). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    band: [250, 500],       // the band works loose: its flags shift apart and tilt
    flags: [700, 110, 700], // flag i lifts off at 700 + i·110 ms and flies 700 ms up to its place on the garland
    flap: [1500, 650],      // the straight flap swings up on its top edge, its embroidered lining shows
    lights: [1900, 1100],   // the string lights light up bulb by bulb (GPT bulbs; none = none) and warm light rises
    rise: [2500, 600],      // the card rises out of the pocket
    forward: [3100, 380],   // and comes forward
    go: 3600,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  // the closed envelope (site.css .envelope / .band): six flags across the band, in % of the envelope
  band: { top: 22, height: 15.4, flags: 6 },
  // the garland the flags fly up to: across the top of the opening, hanging from `top` px, sagging `sag` px at the middle,
  // `inset` px narrower than the screen (clear of the corner buttons: sound, Skip)
  garland: { top: 40, sag: 14, span: 560, flagMax: 66, inset: 96 },
  lights: { count: 9, gap: 10, sag: 22 },   // bulbs under a garland (px below the flags, extra sag)
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['garland', 0], ['photo', 160], ['line', 700], ['names', 860], ['date', 1160], ['venue', 1340]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 460], ['link', 800]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['lights', 0], ['names', 1300], ['links', 1700]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-frame': [['photo', 0], ['caption', 1100]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1200]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 1300]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  wind: { gain: 0.012, max: 7, settle: 0.9 },   // degrees per px/s of scroll, the most, the decay per frame
  // a reply is in: a handful of the flags flutter down over the thank-you panel
  accents: {
    reply: [{ count: 8, dur: [2600, 3600], size: [26, 40] }]
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
let BULB = '', BULB_RATIO = 0.6;
try {
  const cs = getComputedStyle(root);
  BULB = cs.getPropertyValue('--pf-bulb').replace(/["']/g, '').trim();
  BULB_RATIO = parseFloat(cs.getPropertyValue('--pf-bulb-ratio')) || BULB_RATIO;
} catch (e) { BULB = ''; }

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

/* -- the flight of the band's flags: from where each lies on the closed envelope (computed from the stage, which is
   never transformed) to its place on the garland across the top of the opening. Written as CSS variables on each flag
   (site.css flag-fly and .is-opened use them); called on load and on resize. */
function layoutFlight() {
  const stage = $('.stage'), host = $('.opening');
  if (!stage || !host) return null;
  const flags = $$('.band .flag');
  const s = stage.getBoundingClientRect(), o = host.getBoundingClientRect();
  const B = MOTION.band, G = MOTION.garland;
  const fw = s.width / B.flags, fh = s.width / 0.74 * B.height / 100;
  const span = Math.min(o.width - G.inset, G.span);
  const gw = Math.min(G.flagMax, span / B.flags * 0.8), scale = gw / fw;
  const y0 = o.top + G.top;
  flags.forEach((f, i) => {
    const t = (i + 0.5) / B.flags;
    const x = o.left + o.width / 2 - span / 2 + t * span;
    const y = y0 + G.sag * 4 * t * (1 - t);
    const slope = G.sag * 4 * (1 - 2 * t) / span;          // dy/dx of the sag: each flag hangs square to its cord
    const fromX = s.left + (i + 0.5) * fw, fromY = s.top + s.width / 0.74 * B.top / 100;
    f.style.setProperty('--tx', (x - fromX).toFixed(1) + 'px');
    f.style.setProperty('--ty', (y - fromY).toFixed(1) + 'px');
    f.style.setProperty('--r', (Math.atan(slope) * 180 / Math.PI).toFixed(2) + 'deg');
    f.style.setProperty('--s', scale.toFixed(3));
  });
  // the string lights hang under the garland
  const lights = $('.opening > .lights');
  if (lights) {
    lights.style.top = (G.top + G.sag + fh * scale + MOTION.lights.gap) + 'px';
    lights.style.width = span + 'px';
  }
  return { span, top: y0 };
}

/* -- string lights: the GPT bulbs (parts.css --pf-bulb) along a sagging line across the box, one after another;
   `delay` = when the first lights (ms), `step` = the gap between bulbs. No sprite = no bulbs. */
function hangLights(box, delay, step) {
  if (!box || !BULB) return;
  box.querySelectorAll('.bulb').forEach((n) => n.remove());
  const n = MOTION.lights.count, W = box.clientWidth || 300, sag = MOTION.lights.sag;
  const h = Math.max(22, Math.min(40, W / n * 0.9)), w = h * BULB_RATIO;
  box.style.height = (h + sag + 6) + 'px';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const img = Object.assign(document.createElement('img'), { src: asset(BULB), alt: '', className: 'bulb' });
    img.style.cssText = `left:${(t * W - w / 2).toFixed(1)}px;top:${(sag * 4 * t * (1 - t)).toFixed(1)}px;width:${w.toFixed(1)}px;--d:${Math.round(delay + i * step)}ms`;
    box.append(img);
  }
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
    if (n.classList.contains('lights')) hangLights(n, instant ? 0 : delay + 200, instant ? 0 : 120);
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

/* -- the wind: the scroll speed sets --wind (degrees) on <html>; frames and flags lean with it and it settles */
function initWind() {
  if (reduce || !$('.hang, .garland')) return;
  const W = MOTION.wind;
  let last = scrollY, t0 = performance.now(), wind = 0, running = false;
  const tick = () => {
    wind *= W.settle;
    if (Math.abs(wind) < 0.05) { wind = 0; running = false; }
    root.style.setProperty('--wind', wind.toFixed(2));
    if (running) requestAnimationFrame(tick);
  };
  addEventListener('scroll', () => {
    const now = performance.now(), dt = Math.max(16, now - t0), v = (scrollY - last) / dt * 1000;
    last = scrollY; t0 = now;
    wind = Math.max(-W.max, Math.min(W.max, wind + v * W.gain * 0.25));
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });
}

/* -- a reply is in (MOTION.accents): a few of the flags flutter down, swaying, and are removed when they land */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: asset(`img/flag_${(i % 6) + 1}-200.webp`), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.08 + 0.84 * Math.random()), y = Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = Math.min(innerHeight * 0.7, box.height + 60), dx = (Math.random() - 0.5) * 80, r = (Math.random() - 0.5) * 40;
      left++;
      img.animate([{ opacity: 0, transform: `translate(0,0) rotate(${r}deg)` }, { opacity: 1, offset: 0.12 },
        { transform: `translate(${dx * 0.4}px,${dy * 0.35}px) rotate(${-r}deg)`, offset: 0.4 },
        { transform: `translate(${dx * 0.8}px,${dy * 0.7}px) rotate(${r * 0.6}deg)`, offset: 0.75, opacity: 1 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(0deg)` }],
      { duration: dur, delay: i * 140, easing: 'ease-in-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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
  const card = $('.envelope .card'), lights = $('.opening > .lights'), E = MOTION.envelope;
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  layoutFlight();
  if (state === 'opened') hangLights(lights, 0, 0);
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
    layoutFlight();
    hangLights(lights, E.lights[0], E.lights[1] / MOTION.lights.count);
    root.classList.add('is-opening');
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    root.classList.remove('is-opening', 'is-opened');
    card.style.viewTransitionName = '';
    lights?.querySelectorAll('.bulb').forEach((n) => n.remove());
    state = 'closed';
  }
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); card.style.viewTransitionName = ''; state = 'opened'; hangLights(lights, 0, 0); }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: a few flags flutter down over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(() => { fit(); layoutFlight(); });
  addEventListener('resize', () => { fit(); layoutFlight(); $$('.lights.in, .hero-lights').forEach((b) => hangLights(b, 0, 0)); }, { passive: true });
  initEnvelope();
  // the hero garland's lights on home light up with the garland (from the envelope: lit at once)
  const hero = $('.hero-lights');
  if (hero) hangLights(hero, root.classList.contains('from-envelope') || reduce ? 0 : 900, root.classList.contains('from-envelope') || reduce ? 0 : 110);
  initScenes();
  initWind();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
