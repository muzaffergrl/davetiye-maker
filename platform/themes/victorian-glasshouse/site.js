/* Victorian Glasshouse — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 36): the copper label swings on its knot and drops away, the twine comes apart at the knot
   (upper half up, lower half down), the flap folds up and back over its hinge, warm air mists the glass, the card
   rises out of the packet, the mist is wiped away across the glass and ferns show round the card, the iron arches
   drift, and the card comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css
   (".is-opening …") use the same numbers as MOTION.envelope. On the inner pages every photo is a specimen under glass:
   as its scene enters the view the mist on its pane is wiped away (a mask, site.css .fog), a band of light crosses the
   glass and its copper label swings on its cord; the iron arches drift at their own pace as the page scrolls (--sy,
   parallax). The fern leaflets that drift are the GPT sprites W3.14 (named by parts.css --vg-leaves); without them
   there are none, never a drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // host line, kicker, names and date rise away; "Tap to open" fades
    tag: [0, 500],          // the copper label swings hard on its knot …
    drop: [500, 700],       // … and drops away
    twine: [300, 700],      // the twine comes apart at the knot: the upper half slides up, the lower half down
    flap: [900, 700],       // the flap folds up and back over its hinge (behind the card past 90°)
    mist: [1300, 1000],     // warm air mists the glass (a blur behind a pale veil)
    rise: [1700, 800],      // the card rises out of the packet, seen through the mist
    wipe: [2600, 1000],     // the mist is wiped away across the glass (soft-edged mask, left → right); ferns show
    arches: [0, 4000],      // the iron arches drift (parallax: they move, the packet stays)
    forward: [3600, 400],   // the card comes forward
    go: 4100,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 700], ['names', 900], ['date', 1250], ['venue', 1450]],
    'home-invite': [['title', 0], ['host', 320], ['names', 520], ['date', 880], ['venue', 1120], ['reply', 1380], ['count', 1580], ['calendar', 1780]],
    'home-teasers': [['photo', 0], ['head', 600], ['link', 940]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['tag', 0], ['names', 700], ['links', 1100]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 560]],
    'story-frame': [['photo', 0], ['caption', 1300]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 320], ['after', 950]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1300]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 600]]
  },
  stagger: 180,
  batchGap: 360,
  arriveDelay: 150,
  parallax: 1,              // --sy = scrollY × this (CSS gives each layer its own rate: arches, ferns, page arches)
  // fern leaflets (GPT sprites W3.14): open = two drift down past the card as the mist is wiped; reply = a few drift
  // down past the thank-you panel when an RSVP is sent. None without the sprites.
  accents: {
    open: [{ count: 2, path: 'fall', at: 2700, dur: [2600, 3200], size: [26, 38] }],
    reply: [{ count: 5, path: 'fall', dur: [2600, 3400], size: [22, 34] }]
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
let LEAVES = [];
try { LEAVES = getComputedStyle(root).getPropertyValue('--vg-leaves').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { LEAVES = []; }
const leafSrc = (i) => new URL(LEAVES[i % LEAVES.length], SCRIPT_URL).href;

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

/* -- the card from the packet keeps its fixed paper: long names get smaller, then the portrait gets smaller */
function fitCard() {
  const card = $('.packet .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 14; i++) { size -= 1; names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
    if (!instant) {
      n.style.transitionDelay = delay + 'ms';
      // the mist on a pane is wiped and its label swings with the step, not before it
      n.querySelectorAll('.fog, .glint, .tag').forEach((c) => { c.style.transitionDelay = delay + 'ms'; c.style.animationDelay = delay + (c.classList.contains('glint') ? 950 : 350) + 'ms'; });
      if (n.classList.contains('tag')) n.style.animationDelay = delay + 'ms';
      const ptag = n.querySelector(':scope > .ptag');
      if (ptag) ptag.style.animationDelay = delay + 'ms';
    }
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

/* -- the iron arches drift with the page: --sy (px scrolled) on <html>; each layer moves at its own CSS rate */
function initParallax() {
  if (reduce || !$('.arches, .ferns')) return;
  let queued = false;
  const update = () => { queued = false; root.style.setProperty('--sy', (scrollY * MOTION.parallax).toFixed(1)); };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* -- fern leaflets (MOTION.accents): the GPT sprites in turn, a few pieces, removed when they land */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !LEAVES.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: leafSrc(left), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.1 + 0.8 * Math.random()), y = box.top - size;
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = innerHeight * (0.35 + Math.random() * 0.2), dx = (Math.random() - 0.5) * 90, r = (Math.random() - 0.5) * 220;
      left++;
      // a leaflet: it tips and sways as it falls, then fades
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 1, offset: 0.12 },
        { transform: `translate(${dx * 0.6}px,${dy * 0.35}px) rotate(${r * 0.4}deg)`, offset: 0.4 },
        { transform: `translate(${-dx * 0.2}px,${dy * 0.7}px) rotate(${-r * 0.2}deg)`, offset: 0.75 },
        { opacity: 0, transform: `translate(${dx * 0.3}px,${dy}px) rotate(${r}deg)` }],
      { duration: dur, delay: (g.at || 0) + i * 240, easing: 'ease-in-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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

/* -- the seed packet */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.packet .card'), E = MOTION.envelope;
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
    particles('open', card);
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
    // the reply is in: a few fern leaflets drift down past the thank-you panel, the closing label swings again
    if (st === 'success') requestAnimationFrame(() => {
      particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card'));
      const tag = $('.rsvp-page .sig-tag');
      if (tag && !reduce) { tag.classList.remove('in'); tag.style.animationDelay = '0ms'; void tag.offsetWidth; tag.classList.add('in'); }
    });
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initParallax();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
