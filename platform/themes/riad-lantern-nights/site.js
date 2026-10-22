/* Riad Lantern Nights — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 27, G427): the pierced brass lantern charm lights up (the unlit and the lit GPT lantern crossfade
   in place; its warm light falls on the envelope and the plaster), the saffron cord's loop lifts off the brass stud and
   cord, tassel and lantern swing down and fall away as the lantern goes out, the horseshoe-arch flap swings up on its
   top edge in 3D onto its zellige inside and stands above the envelope like an arched door, the arch-topped ivory card
   rises from behind the pocket while light sweeps over it, bougainvillea bracts, orange blossoms, brass stars and motes
   of light drift (MOTION.accents.open), the card comes forward and flies to home (view transition invite-card). The
   CSS keyframes in site.css (".is-opening …") use the same numbers as MOTION.envelope.
   Inner pages: every photo sits in a GPT horseshoe arch (stucco portrait, cedar story windows) or the wide cedar frame,
   masked to its measured window; it waits in the dark and comes out under a sweep of warm lantern light (top to bottom)
   as its scene enters; the zellige band sets its tiles one by one; the hanging lantern sways over the day; a reply
   lights the lantern charm and bracts, blossoms and stars drift down. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    lit: [0, 500],          // the lantern lights up: unlit → lit crossfade
    glow: [0, 1500],        // its warm light falls on the envelope and the plaster, then goes with it
    cord: [600, 1000],      // the loop lifts off the stud; cord, tassel and lantern swing down and fall away
    douse: [1250, 350],     // the lantern goes out as it falls
    flap: [1450, 900],      // the horseshoe-arch flap swings up on its top edge onto its zellige inside
    rise: [2250, 900],      // the card rises from behind the pocket
    light: [2350, 1100],    // light sweeps over the card
    accents: 2600,          // bracts, blossoms, brass stars and motes of light drift (MOTION.accents.open)
    forward: [3150, 500],   // the card comes forward
    go: 3800,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 900], ['names', 1060], ['date', 1360], ['venue', 1540]],
    'home-tiles': [['tile', 0]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['lamp', 0], ['head', 300], ['list', 680], ['link', 1000]],
    'home-foot': [['charm', 0], ['names', 700], ['links', 1000]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-arch': [['arch', 0], ['caption', 900]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['charm', 0], ['names', 200], ['title', 380], ['wait', 720], ['cta', 1020]],
    'rsvp-closing': [['names', 0], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // the GPT accents (bougainvillea bract, orange blossom, brass star) drifting down, and motes of warm light (CSS light)
  // rising, over the opening envelope and over a reply
  accents: {
    open: [{ img: 'img/bract-160.webp', count: 5, dur: [2600, 3400], size: [18, 28] },
      { img: 'img/blossom-160.webp', count: 5, dur: [2800, 3600], size: [16, 24] },
      { img: 'img/star-160.webp', count: 4, dur: [2200, 3000], size: [10, 15] },
      { mote: true, count: 10, dur: [1800, 2800], size: [6, 12] }],
    reply: [{ img: 'img/bract-160.webp', count: 6, dur: [2800, 3800], size: [18, 28] },
      { img: 'img/blossom-160.webp', count: 6, dur: [3000, 4000], size: [16, 24] },
      { img: 'img/star-160.webp', count: 4, dur: [2400, 3200], size: [10, 15] },
      { mote: true, count: 8, dur: [2000, 3000], size: [6, 12] }]
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
    el.classList.toggle('long-names', parts.some((n) => n.textContent.length > 12));
    el.style.whiteSpace = 'nowrap';
    const min = el.closest('.hero-card') ? 24 : 30;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the arch-topped cards keep their fixed paper (the GPT card): long names get smaller, then the portrait gets smaller */
function fitCards() {
  $$('.envelope .card, .hero-card').forEach((card) => {
    const names = card.querySelector('.card-names:not([hidden]), .names');
    if (!names) return;
    card.classList.remove('tight');
    if (!card.classList.contains('hero-card')) names.style.fontSize = '';
    // the content's own bottom (offsets ignore the scene's not-yet-revealed translateY) against the paper's padding box
    const pad = parseFloat(getComputedStyle(card).paddingBottom) || 0;
    const flow = [...card.children].filter((n) => n.getClientRects().length && getComputedStyle(n).position !== 'absolute');
    const over = () => { const last = flow[flow.length - 1]; return Boolean(last) && last.offsetTop + last.offsetHeight > card.clientHeight - pad + 1; };
    let size = parseFloat(getComputedStyle(names).fontSize);
    const floor = card.classList.contains('hero-card') ? 22 : 11;
    for (let i = 0; i < 40 && over() && size > floor; i++) { size -= 1; names.style.fontSize = size + 'px'; }
    if (over()) card.classList.add('tight');
  });
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

/* -- MOTION.accents: the GPT accents fall, turning; motes of warm light (CSS light) rise; all removed when done */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  let left = 0, k = 0;
  const done = (el) => { el.remove(); if (--left === 0) layer.remove(); };
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++, k++) {
      const size = g.size[0] + Math.random() * (g.size[1] - g.size[0]);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      left++;
      if (g.mote) {
        const m = document.createElement('span');
        m.className = 'mote';
        const x = box.left + box.width * (0.15 + 0.7 * Math.random()), y = box.top + box.height * (0.35 + 0.5 * Math.random());
        m.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
        layer.append(m);
        const dx = (Math.random() - 0.5) * 60, dy = -(60 + Math.random() * 120);
        m.animate([{ opacity: 0, transform: 'translate(0,0) scale(.6)' }, { opacity: 1, offset: 0.25 },
          { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(1)` }],
        { duration: dur, delay: k * 60, easing: 'ease-out', fill: 'both' }).finished.then(() => done(m));
        continue;
      }
      const img = Object.assign(document.createElement('img'), { src: asset(g.img), alt: '' });
      const x = box.left + box.width * (0.06 + 0.88 * Math.random()), y = Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dy = Math.min(innerHeight * 0.75, box.height + 60), dx = (Math.random() - 0.5) * 120, r = (Math.random() - 0.5) * 160;
      img.animate([{ opacity: 0, transform: 'translate(0,0) rotate(0deg)' }, { opacity: 1, offset: 0.1 },
        { transform: `translate(${dx * 0.5}px,${dy * 0.45}px) rotate(${r * 0.5}deg)`, offset: 0.5 },
        { opacity: 1, offset: 0.8 },
        { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${r}deg)` }],
      { duration: dur, delay: k * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => done(img));
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
    // the reply is in: the lantern charm lights up; bracts, blossoms and stars drift down over the thank-you panel
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCards(); };
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
