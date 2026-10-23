/* Marigold & Mehndi — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 33): the silk tassel swings like a pendulum, the gold laser-cut paisley sleeve slides off to the
   side, light runs over the fuchsia silk, the straight silk flap turns up on its top edge and hands over to its velvet
   inner face, the velvet-fuchsia lining warms, marigold petals drift down, the diya flames under the envelope light one
   by one, and the card rises out of the lining, comes forward and flies to home (view transition invite-card). The CSS
   keyframes in site.css (".is-opening …") use the same numbers as MOTION.envelope. On the inner pages every photo is
   uncovered like wet henna flowing up its jharokha arch (a mask, site.css .flow), the henna round the arch follows,
   and the diyas of the signatures light in turn as they enter the view.
   Petals and flames are GPT sprites (W2.3, W2.7), named by parts.css (--mm-petals); without them there are no petals
   and no flames, never a drawn stand-in (K21). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 450],         // the families, the invitation line and the names rise away; "Tap to open" fades
    tassel: [0, 1400],      // the silk tassel swings like a pendulum, slower and slower (it answers the tap at once)
    sheen: [200, 900],      // light runs over the fuchsia silk
    sleeve: [300, 950],     // the gold paisley sleeve slides off to the right, the tassel with it
    flap: [1250, 380],      // the silk front of the flap turns up on its top edge, to its edge…
    flapIn: [1630, 420],    // …and its velvet inner face takes over, standing up above the envelope
    lining: [1500, 700],    // the velvet-fuchsia lining warms in the light
    petals: [1600, 2000],   // marigold petals drift down over the envelope (GPT sprites; none = none)
    diyas: [1800, 1000],    // the diya flames under the envelope light one by one, left to right
    rise: [2500, 650],      // the card rises out of the lining
    forward: [3150, 400],   // and comes forward
    go: 3650,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  petalsOpening: { count: 14, seed: 33 },   // where the petals fall (fixed per design, not random per visit)
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 900], ['names', 1080], ['date', 1380], ['venue', 1560]],
    'home-invite': [['title', 0], ['host', 320], ['names', 520], ['date', 880], ['venue', 1120], ['reply', 1380], ['count', 1580], ['calendar', 1780]],
    'home-teasers': [['photo', 0], ['head', 900], ['link', 1200]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['lamps', 0], ['names', 1300], ['links', 1700]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 1500]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1300]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['names', 0], ['links', 900]]
  },
  stagger: 170,
  henna: 900,               // the henna round an arch flows in after its photo (ms after the photo step; site.css .henna)
  diyaStep: 260,            // the flames of a signature row light this far apart (ms)
  batchGap: 340,
  arriveDelay: 150,
  // marigold petals (GPT sprites W2.3): reply = a shower of petals over the thank-you panel when an RSVP is sent.
  accents: {
    reply: [{ count: 12, path: 'fall', dur: [2600, 3600], size: [16, 30] }]
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
try { PETALS = getComputedStyle(root).getPropertyValue('--mm-petals').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { PETALS = []; }
const petalSrc = (i) => new URL(PETALS[i % PETALS.length], SCRIPT_URL).href;

/* small fixed pseudo-random sequence (the same petals on every visit) */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* -- long names: on one line while they fit, then smaller (never below the floor), then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    el.classList.toggle('long-names', parts.some((n) => n.textContent.length > 12));
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero') ? 30 : 28;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the card in the envelope keeps its fixed paper: long names get smaller, then the arched portrait gets smaller */
function fitCard() {
  const card = $('.parcel .card'), names = card && card.querySelector('.card-names:not([hidden])');
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
  const floor = card.clientWidth * 0.05;     // 5cqw: the card's texts scale with it (site.css)
  for (let i = 0; i < 60 && over() && size > floor; i++) { size = Math.max(floor, size * 0.94); names.style.fontSize = size + 'px'; }
  if (over()) card.classList.add('tight');
}

/* -- marigold petals of the opening: GPT sprites drifting down over the envelope, at fixed places */
function petalfall() {
  const host = $('.opening');
  if (!host || !PETALS.length || reduce) return;
  const E = MOTION.envelope, r = rng(MOTION.petalsOpening.seed);
  const layer = document.createElement('div');
  layer.className = 'petalfall';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < MOTION.petalsOpening.count; i++) {
    const img = Object.assign(document.createElement('img'), { src: petalSrc(i), alt: '' });
    const s = 14 + r() * 18;
    img.style.cssText = `left:${6 + r() * 88}%;top:${-4 - r() * 8}%;width:${s}px;--dx:${Math.round((r() - .5) * 90)}px;--rot:${Math.round((r() - .5) * 540)}deg;` +
      `animation-delay:${E.petals[0] + (i * E.petals[1]) / MOTION.petalsOpening.count / 2}ms;animation-duration:${Math.round(E.petals[1] * (0.9 + r() * 0.6))}ms`;
    layer.append(img);
  }
  host.prepend(layer);
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  scene.querySelectorAll('[data-step]').forEach((n) => {
    if (n.closest('[data-scene]') !== scene) return;
    // the henna follows its photo (data-i 1 on the photo step = MOTION.henna later, not a stagger)
    const extra = n.classList.contains('henna') ? MOTION.henna : stepIndex(n) * MOTION.stagger;
    const delay = base + (plan.get(n.dataset.step) || 0) + extra;
    if (!instant) n.style.transitionDelay = delay + 'ms';
    if (!instant && n.classList.contains('diyas')) n.style.setProperty('--d0', delay + 'ms');
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

/* -- the diya rows: each flame lights MOTION.diyaStep after the one before it (--n = its place in the row) */
function initDiyas() {
  $$('.diyas').forEach((row) => [...row.children].forEach((d, i) => d.style.setProperty('--n', String(i))));
  root.style.setProperty('--diya-step', MOTION.diyaStep + 'ms');
  root.style.setProperty('--diya-open-step', Math.round(MOTION.envelope.diyas[1] / 5) + 'ms');
}

/* -- marigold petals (MOTION.accents): the GPT sprites in turn, a few pieces, removed when they land */
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
      const x = box.left + box.width * (0.08 + 0.84 * Math.random()), y = Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dy = innerHeight * (0.45 + Math.random() * 0.2), dx = (Math.random() - 0.5) * 120, rot = (Math.random() - 0.5) * 600;
      left++;
      // a petal: it sways from side to side as it falls and turns over, then fades as it lands
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 1, offset: 0.12 },
        { transform: `translate(${dx * 0.6}px,${dy * 0.35}px) rotate(${rot * 0.35}deg)`, offset: 0.35 },
        { transform: `translate(${-dx * 0.2}px,${dy * 0.7}px) rotate(${rot * 0.7}deg)`, offset: 0.7, opacity: 1 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)` }],
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
  const card = $('.parcel .card'), E = MOTION.envelope;
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
  petalfall();
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
    // the reply is in: a shower of marigold petals over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initDiyas();
  initEnvelope();
  initScenes();
  initCountdown();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
