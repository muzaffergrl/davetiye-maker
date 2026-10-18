/* Highland Tartan & Thistle — shared behaviour of the five pages. Personal content is rendered by the platform
   (data-field, data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages).
   Opening (docs/24 row 35): a tartan wool envelope held shut by a leather strap through a brass buckle. On tap the
   buckle's frame tips open and lets the prong go, the strap slides up out of it and off the envelope, the straight
   wool flap swings up on its top fold (3D), a sprig of heather and then the card rise out of the pocket, while the mist
   lying over the hills behind it draws off to both sides. The card comes forward and flies to home (view transition
   invite-card). The CSS keyframes in site.css (".is-opening …") use the same numbers as MOTION.envelope.
   On the inner pages every photo sits in an antique brass locket whose lid swings open on its hinge as the photo's
   scene enters the view (site.css .locket .lid), and the mist layers behind the pages drift as the page scrolls
   (--mist). The heather florets of a sent reply are the GPT sprites named by parts.css (--ht-florets); without them
   there are none, never a drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // the host line, names, date and place rise away; "Tap to open" fades
    mist: [0, 3500],        // the mist over the hills draws off, the near bank to the left, the far bank to the right
    buckle: [150, 450],     // the buckle's frame tips open on its bar and lets the prong go
    strap: [600, 700],      // the leather strap slides up out of the buckle and off the envelope (buckle with it)
    flap: [1300, 800],      // the straight wool flap swings up on its top fold (3D)
    sprig: [2000, 700],     // a sprig of heather rises out of the pocket (GPT; none = none)
    rise: [2500, 650],      // the card rises out of the pocket
    forward: [3150, 400],   // and comes forward
    go: 3650,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 700], ['names', 880], ['date', 1180], ['venue', 1380]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['sprig', 0], ['names', 380], ['links', 760]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 1100]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1150]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 420]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  mistScroll: 0.06,         // px of mist drift per px of page scroll (inner pages)
  // heather florets (GPT sprites W2.13): reply = a few florets drift down over the thank-you panel when an RSVP is sent.
  accents: {
    reply: [{ count: 7, dur: [2600, 3600], size: [16, 28] }]
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
let FLORETS = [];
try { FLORETS = getComputedStyle(root).getPropertyValue('--ht-florets').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { FLORETS = []; }
const floretSrc = (i) => new URL(FLORETS[i % FLORETS.length], SCRIPT_URL).href;

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

/* -- the card in the envelope keeps its fixed paper: long names get smaller, then the locket portrait gets smaller */
function fitCard() {
  const card = $('.satchel .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 13; i++) { size -= 1; names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view; a locket's lid opens
   when its photo step plays (site.css .locket.in .lid) */
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

/* -- the mist behind the inner pages drifts with the scroll: --mist (px) on <html>; the two banks move opposite ways */
function initMist() {
  if (reduce || !$('.page-mist')) return;
  let queued = false;
  const update = () => { queued = false; root.style.setProperty('--mist', (scrollY * MOTION.mistScroll).toFixed(1)); };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* -- heather florets (MOTION.accents): the GPT sprites in turn, a few pieces drifting down, removed when they fade */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !FLORETS.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: floretSrc(left), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.1 + 0.8 * Math.random()), y = Math.max(0, box.top) - 30;
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = innerHeight * (0.35 + Math.random() * 0.2), dx = (Math.random() - 0.5) * 90, turn = (Math.random() - 0.5) * 220;
      left++;
      // a floret falls, swaying as it goes, and fades near the end
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 1, offset: 0.15 },
        { transform: `translate(${dx * 0.6}px,${dy * 0.5}px) rotate(${turn * 0.5}deg)`, offset: 0.5 },
        { opacity: 1, offset: 0.8 }, { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${turn}deg)` }],
      { duration: dur, delay: i * 180, easing: 'ease-in-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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

/* -- the strapped envelope */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.satchel .card'), E = MOTION.envelope;
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
    // the reply is in: a few heather florets drift down over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initMist();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
