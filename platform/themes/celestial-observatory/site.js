/* Celestial Observatory — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 29, G429): the lace-like rete turns 120° about the astrolabe's pin while light runs over the brass
   and its star tips glint one by one, the astrolabe lifts off the flap's tip and floats up off the screen, the dome flap
   swings up on its top edge onto its inside — an observatory dome standing over the envelope — the chart-paper card
   rises from behind the pocket, tiny gold stars light up one by one and a crescent drifts across (MOTION.accents.open),
   the card comes forward and flies to home (view transition invite-card). The CSS keyframes in site.css
   (".is-opening …") use the same numbers as MOTION.envelope.
   Inner pages: the portrait sits in the gilded celestial medallion, the story photos in brass planisphere rings whose
   dial turns with the page (initTurns) and whose photo is uncovered by a dial sweep; the small astrolabe over the home
   card turns its rete as the page scrolls; a reply sends gold star dust rising and fading. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    turn: [0, 1100],        // the rete turns 120° about the pin
    sheen: [100, 1000],     // light runs over the rete's brass
    glint: [500, 520],      // its star tips glint, one after another (tipStagger ms apart)
    tipStagger: 70,
    astro: [1150, 1250],    // the astrolabe lifts off the flap's tip and floats up off the screen
    flap: [1650, 800],      // the dome flap swings up on its top edge; its inside, the observatory dome, stands up
    accents: 2150,          // gold stars light up one by one, a crescent drifts (MOTION.accents.open)
    rise: [2300, 700],      // the card rises from behind the pocket
    light: [2400, 1100],    // moonlight passes over the card
    forward: [3000, 450],   // and comes forward
    go: 3550,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['astro', 0], ['photo', 200], ['line', 1000], ['names', 1160], ['date', 1460], ['venue', 1640]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['scope', 0], ['names', 700], ['links', 1000]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-moment': [['frame', 0], ['caption', 700]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['row', 300], ['after', 900]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['scope', 0], ['names', 500], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  // the instruments turning with the page: degrees per px scrolled (the home rete; each planisphere dial near the middle)
  turns: { rete: 0.12, dial: 0.22 },
  // the GPT accents (gold star, crescent, star dust): lighting up over the opening envelope and rising after a reply
  accents: {
    open: [{ img: 'img/star-160.webp', count: 7, dur: [700, 1000], size: [12, 22], mode: 'twinkle', gap: 110 },
      { img: 'img/moon-160.webp', count: 1, dur: [1500, 1500], size: [28, 36], mode: 'drift', gap: 0 },
      { img: 'img/dust-200.webp', count: 4, dur: [900, 1200], size: [26, 40], mode: 'twinkle', gap: 180 }],
    reply: [{ img: 'img/dust-200.webp', count: 8, dur: [2400, 3400], size: [28, 44], mode: 'rise', gap: 120 },
      { img: 'img/star-160.webp', count: 6, dur: [2200, 3000], size: [12, 20], mode: 'rise', gap: 140 }]
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

/* -- the instruments turn with the page: the small astrolabe's rete (--turn on <html>) and each planisphere's dial
   (--dial on its frame, by its distance from the middle of the screen; alternate rings turn the other way) */
function initTurns() {
  const dials = $$('.plani');
  if (reduce || (!dials.length && !$('.mini-astro'))) return;
  let queued = false;
  const update = () => {
    queued = false;
    root.style.setProperty('--turn', (scrollY * MOTION.turns.rete).toFixed(1) + 'deg');
    dials.forEach((d, i) => {
      const r = d.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const off = r.top + r.height / 2 - innerHeight / 2;
      d.style.setProperty('--dial', ((i % 2 ? -1 : 1) * off * MOTION.turns.dial).toFixed(1) + 'deg');
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* -- the GPT accents (MOTION.accents): stars that light up one by one where they are ('twinkle'), a crescent drifting
   across ('drift'), dust rising and fading ('rise'); each is removed when it is done */
function particles(moment, anchor) {
  const groups = MOTION.accents[moment] || [];
  if (reduce || !groups.length || !Element.prototype.animate) return;
  const layer = document.createElement('div');
  layer.className = 'accent-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const box = (anchor || document.body).getBoundingClientRect();
  const rnd = (a, b) => a + Math.random() * (b - a);
  let left = 0;
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) {
      const img = Object.assign(document.createElement('img'), { src: asset(g.img), alt: '' });
      const size = rnd(g.size[0], g.size[1]), dur = rnd(g.dur[0], g.dur[1]);
      let x, y, frames;
      if (g.mode === 'twinkle') {
        // round the envelope and in the sky above it, where the dome stands
        x = box.left - box.width * 0.3 + box.width * 1.6 * Math.random();
        y = box.top - box.height * 0.5 + box.height * 1.1 * Math.random();
        frames = [{ opacity: 0, transform: 'scale(.2) rotate(-30deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)', offset: 0.35 },
          { opacity: 1, offset: 0.6 }, { opacity: 0, transform: 'scale(.5) rotate(20deg)' }];
      } else if (g.mode === 'drift') {
        x = box.left - box.width * 0.25; y = box.top - box.height * 0.3;   // over the dome, below the names
        frames = [{ opacity: 0, transform: 'translate(0,0) rotate(-12deg)' }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.75 },
          { opacity: 0, transform: `translate(${box.width * 1.3}px,-${box.height * 0.08}px) rotate(8deg)` }];
      } else {
        const fall = g.mode !== 'rise';
        x = box.left + box.width * (0.06 + 0.88 * Math.random());
        y = fall ? Math.max(-40, box.top - 30) : Math.min(innerHeight - 30, box.bottom);
        const dy = (fall ? 1 : -1) * Math.min(innerHeight * 0.7, box.height + 60), dx = (Math.random() - 0.5) * 100, r = (Math.random() - 0.5) * 90;
        frames = [{ opacity: 0, transform: 'translate(0,0) rotate(0deg)' }, { opacity: 1, offset: 0.12 },
          { transform: `translate(${dx * 0.5}px,${dy * 0.45}px) rotate(${r * 0.5}deg)`, offset: 0.5 }, { opacity: 0.9, offset: 0.7 },
          { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${r}deg)` }];
      }
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      left++;
      img.animate(frames, { duration: dur, delay: i * g.gap, easing: g.mode === 'drift' ? 'ease-in-out' : 'ease-out', fill: 'both' })
        .finished.then(() => { img.remove(); if (--left === 0) layer.remove(); });
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
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && state === 'playing') { reset(); state = 'done'; go(false); } });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); card.style.viewTransitionName = ''; state = 'opened'; }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: gold star dust rises and fades over the thank-you panel (after it is shown)
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initTurns();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
