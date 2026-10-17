/* Kintsugi & Washi — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 26): the rice-paper band slides off, a soft gold light passes over the paper, then the indigo
   folds open one by one — top, bottom, left, right; each turns on its own crease and shows its paler inside from 90°
   on — the rice-paper card lifts, comes forward and flies to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope. Photos on the inner pages appear through an ink
   bloom (a mask that spreads from the photo's centre, site.css .ink) as their scene enters the view. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    closure: [0, 650],      // the rice-paper band slides down off the packet and fades
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 450],         // kicker, names and date rise away
    sheen: [120, 900],      // a soft gold light passes over the folded paper (with W2.4: along the gold veins, 120–550)
    spread: [500, 900],     // the packet steps back (scale) so the opened folds stay on the screen
    top: [550, 750],        // the top fold turns up on its crease (0 → 180°; its inside from 90°)
    bottom: [1100, 750],    // the bottom fold turns down
    left: [1650, 750],      // the left panel turns out to the left
    right: [2100, 750],     // the right panel turns out to the right
    flakes: 2500,           // gold-leaf flakes drift down from the opened packet (MOTION.accents.open)
    rise: [2900, 600],      // the rice-paper card lifts off the opened paper
    forward: [3500, 350],   // and comes forward
    go: 3950,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 380], ['names', 560], ['date', 900], ['venue', 1100]],
    'home-invite': [['title', 0], ['host', 260], ['names', 460], ['date', 820], ['venue', 1060], ['reply', 1320], ['count', 1520], ['calendar', 1720]],
    'home-teasers': [['photo', 0], ['head', 420], ['link', 760]],
    'home-day': [['head', 0], ['list', 360], ['link', 680]],
    'home-foot': [['names', 0], ['links', 420]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 520]],
    'story-frame': [['photo', 0], ['caption', 950]],
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
  // drifting gold-leaf flakes: the GPT sprites W2.7 gold_flake_1..3, cut by build_images.py, named in parts.css
  // (--kw-flakes; none = no flakes, never a drawn stand-in, K21). open: from the opened packet as the last panel
  // turns out; arrive: over the home card after the view transition; reply: from the reply card when an RSVP is sent.
  // Off with reduced motion.
  accents: {
    open: [{ count: 3, path: 'fall', dur: [1900, 2500], size: [10, 18] }],
    arrive: [{ count: 2, path: 'fall', dur: [2800, 3600], size: [9, 15] }],
    reply: [{ count: 5, path: 'fall', dur: [2400, 3200], size: [10, 17] }]
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
let FLAKES = [];
try { FLAKES = getComputedStyle(root).getPropertyValue('--kw-flakes').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { FLAKES = []; }

/* -- long names: on one line while they fit, then smaller (never below the floor), then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero') ? 34 : 30;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the card inside the folds keeps its fixed paper: long names get smaller, then the portrait window narrows */
function fitCard() {
  const card = $('.fold .card'), names = card && card.querySelector('.card-names:not([hidden])');
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
    if (!instant) n.style.transitionDelay = (base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger) + 'ms';
    n.classList.add('in');
  });
  if (!instant && scene.dataset.scene === 'home-hero' && root.classList.contains('from-envelope')) particles('arrive', scene);
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

/* -- gold-leaf flakes (MOTION.accents): the 200 px GPT sprites in turn, a few pieces, removed when they land */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !FLAKES.length || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: new URL(FLAKES[left % FLAKES.length], SCRIPT_URL).href, alt: '' });
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const x = box.left + box.width * (0.15 + 0.7 * Math.random()), y = box.top + box.height * 0.2;
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      const dx = (Math.random() - 0.5) * 120, dy = g.path === 'rise' ? -innerHeight * 0.4 : innerHeight * 0.45;
      const sway = (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 22), rot = (Math.random() - 0.5) * 540;
      left++;
      // leaf, not confetti: it rocks to one side and back as it sinks (the light catches it at the turn)
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 0.9, offset: 0.15 },
        { opacity: 1, offset: 0.5, transform: `translate(${dx * 0.4 + sway}px,${dy * 0.45}px) rotate(${rot * 0.35}deg)` },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)` }],
      { duration: dur, delay: i * 180, easing: 'cubic-bezier(.3,.1,.4,1)', fill: 'both' }).finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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

/* -- the folded invitation */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.fold .card'), E = MOTION.envelope;
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
    timers.push(setTimeout(() => particles('open', $('.fold')), E.flakes));
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
    // the reply is in: a few gold-leaf flakes drift down over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
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
