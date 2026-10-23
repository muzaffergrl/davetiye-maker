/* Red Lacquer & Double Happiness — shared behaviour of the five pages. Personal content is rendered by the platform
   (data-field, data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 34): the red cord unwinds from the paper buttons — the flap button turns round and round as it
   lets go, the cord slips off and falls — the flap lifts on its fold, the card comes up out of the envelope wrapped in
   two paper-cut peony windows, the outer (red) window opens in two halves like shutters, then the inner (gold) one, gold
   clouds drift past, and the card comes forward and flies to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope. On the inner pages every photo is behind the two
   paper doors of its moon gate, which slide apart as its scene enters the view; the two paper-cut layers behind the
   pages move at two speeds as the page scrolls (data-depth). The clouds are the GPT sprites W2.15 (named by parts.css
   --rl-clouds); without them there are no clouds, never a drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // the kicker, names, date and city move away; "Tap to open" fades
    untie: [0, 900],        // the flap button turns round twice as the cord unwinds; the body button turns back a little
    cord: [450, 600],       // the cord slips off the buttons and falls
    flap: [900, 650],       // the flap lifts on its fold (its inside shows)
    rise: [1500, 700],      // the card comes up out of the envelope, still in its two paper-cut windows
    outer: [2150, 600],     // the red paper-cut window opens: its two halves swing out on their outer edges
    inner: [2550, 600],     // then the gold one under it
    clouds: [1200, 2400],   // gold clouds drift across (GPT sprites; none = none)
    forward: [3150, 450],   // the card comes forward, the envelope sinks away
    go: 3700,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 650], ['names', 820], ['date', 1120], ['venue', 1320]],
    'home-invite': [['title', 0], ['host', 320], ['names', 520], ['date', 880], ['venue', 1120], ['reply', 1380], ['count', 1580], ['calendar', 1780]],
    'home-teasers': [['photo', 0], ['head', 520], ['link', 860]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['knot', 0], ['names', 420], ['links', 820]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 900]],
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
  drift: { opening: 3, page: 2, dur: [38000, 62000], width: [120, 220] },   // gold clouds crossing (GPT sprites)
  // reply = a few gold clouds rise from the thank-you panel when an RSVP is sent (GPT sprites only)
  accents: {
    reply: [{ count: 5, path: 'rise', dur: [2400, 3200], size: [70, 120] }]
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
let CLOUDS = [];
try { CLOUDS = getComputedStyle(root).getPropertyValue('--rl-clouds').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { CLOUDS = []; }
const cloudSrc = (i) => new URL(CLOUDS[i % CLOUDS.length], SCRIPT_URL).href;

/* small fixed pseudo-random sequence (the same sky on every visit) */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

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

/* -- the card in the envelope keeps its fixed paper: long names get smaller, then the round portrait gets smaller */
function fitCard() {
  const card = $('.envelope .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  // over = the last line ends below the card's text area (into its bottom padding, the painted border) or outside it
  const over = () => {
    const last = [...card.children].filter((n) => n.offsetParent && getComputedStyle(n).position !== 'absolute').pop();
    const pb = parseFloat(getComputedStyle(card).paddingBottom) || 0;
    return card.scrollHeight > card.clientHeight + 1 || (last && last.offsetTop + last.offsetHeight > card.clientHeight - pb + 1);
  };
  let size = parseFloat(getComputedStyle(names).fontSize);
  const floor = card.clientWidth * 0.06;     // 6cqw: the card's texts scale with it (site.css)
  for (let i = 0; i < 60 && over() && size > floor; i++) { size = Math.max(floor, size * 0.94); names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- gold clouds crossing a layer: GPT sprites at fixed heights, each on its own slow drift */
function drift(host, count, seed, firstDelay) {
  if (!host || !CLOUDS.length || reduce) return null;
  const r = rng(seed), D = MOTION.drift;
  const layer = document.createElement('div');
  layer.className = 'clouds';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const img = Object.assign(document.createElement('img'), { src: cloudSrc(i), alt: '' });
    const dur = D.dur[0] + r() * (D.dur[1] - D.dur[0]);
    img.style.cssText = `top:${6 + r() * 70}%;width:${D.width[0] + r() * (D.width[1] - D.width[0])}px;animation-duration:${dur}ms;animation-delay:${(firstDelay || 0) - r() * dur}ms`;
    layer.append(img);
  }
  host.prepend(layer);
  return layer;
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
    if (!instant) n.style.transitionDelay = delay + 'ms';
    if (!instant) n.querySelectorAll(':scope > .door').forEach((d, k) => { d.style.transitionDelay = delay + k * 90 + 'ms'; });
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

/* -- the paper-cut layers move at their own speed as the page scrolls (data-depth × scroll, px) */
function initParallax() {
  const layers = $$('[data-depth]');
  if (reduce || !layers.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const y = scrollY;
    layers.forEach((n) => { n.style.transform = `translate3d(0,${(y * Number(n.dataset.depth)).toFixed(1)}px,0)`; });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* -- gold clouds that rise (MOTION.accents): the GPT sprites in turn, a few pieces, removed when they fade */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !CLOUDS.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: cloudSrc(left), alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.04 + 0.7 * Math.random()), y = box.top + box.height * 0.55;
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = (g.path === 'rise' ? -1 : 1) * innerHeight * (0.22 + Math.random() * 0.14), dx = 30 + Math.random() * 60;
      left++;
      // a cloud: it appears, drifts up and sideways, and thins away
      img.animate([{ opacity: 0, transform: 'translate(0,0) scale(.8)' }, { opacity: 0.9, offset: 0.25, transform: `translate(${dx * 0.25}px,${dy * 0.25}px) scale(1)` },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(1.06)` }],
      { duration: dur, delay: i * 220, easing: 'ease-out', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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
  let passing = null;
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
    // gold clouds drift across while the windows open (a quicker crossing than the idle one)
    timers.push(setTimeout(() => {
      passing = drift($('.opening'), MOTION.drift.opening, 34, 0);
      passing?.querySelectorAll('img').forEach((img, i) => { img.style.animationDuration = E.clouds[1] * (1.6 + i * 0.35) + 'ms'; img.style.animationDelay = -E.clouds[1] * (0.35 + i * 0.12) + 'ms'; });
    }, E.clouds[0]));
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    passing?.remove();
    passing = null;
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

/* -- the interim 囍 (a character of Ma Shan Zheng, site.css .xi::before): its stylesheet is switched on here, and the
   character shows only once the font has it — never a fallback glyph or an empty box */
function initGlyph() {
  const link = $('link[data-font-later]');
  if (!link || !$('.xi') || getComputedStyle($('.xi'), '::before').content === 'none') return;
  const check = () => document.fonts?.load('400 40px "Ma Shan Zheng"', '\u56CD').then((faces) => { if (faces.length) root.classList.add('xi-ready'); }).catch(() => {});
  link.addEventListener('load', check);
  link.media = 'all';
  check();
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: a few gold clouds rise over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initGlyph();
  initEnvelope();
  initScenes();
  initParallax();
  initCountdown();
  // the idle drift of the gold clouds behind the home card and the story page (GPT sprites only)
  drift($('.hero'), MOTION.drift.page, 8, 0);
  if ($('.page-story')) drift(document.body, MOTION.drift.page, 21, 0);
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
