/* Orient Express Voyage — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/35 row 25, G425): the blank luggage tag swings on its red cord like a pendulum, the brass turn-lock's
   button turns 90°, the end tab swings open on its right-hand hinge (3D) onto its route-red silk inside, the sleeve
   draws back to the left while the first-class ticket slides out of its mouth to the right, turns upright and comes
   forward; steam, punched ticket discs and a dried rose bud drift (MOTION.accents.open); the sleeve sinks and fades
   and the ticket flies to home (view transition invite-card). The CSS keyframes in site.css (".is-opening …") use the
   same numbers as MOTION.envelope.
   Inner pages: every photo sits in a GPT carriage window; the story's sash windows lift their leather blind and the
   scenery slides behind the glass as you scroll (initScenery); the route is drawn over the map station by station
   (initRoute); a reply is answered with punched discs, rose buds and a puff of steam. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    head: [0, 400],         // "Tap to open" and the date line fade (the names stay)
    swing: [0, 1400],       // the luggage tag swings on its cord (±14°, damped)
    key: [450, 500],        // the turn-lock's button turns 90° (horizontal → upright, a small overshoot "click")
    flap: [1000, 750],      // the end tab swings open on its right-hand hinge, its silk inside shows past 90°
    shift: [1000, 1450],    // the sleeve draws back to the left (room for the tab, then for the ticket)
    slide: [1750, 700],     // the ticket slides out of the sleeve's mouth to the right
    accents: 2300,          // steam, punched discs and a rose bud drift (MOTION.accents.open)
    turn: [2450, 600],      // it turns upright as it lifts away
    sink: [2450, 900],      // the sleeve sinks a little and fades
    forward: [3050, 550],   // and the ticket comes forward
    light: [3150, 1000],    // lamplight sweeps over it
    go: 3800,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['photo', 0], ['line', 700], ['names', 860], ['date', 1160], ['venue', 1340]],
    'home-invite': [['title', 0], ['host', 300], ['names', 500], ['date', 860], ['venue', 1100], ['reply', 1360], ['watch', 1500], ['count', 1660], ['calendar', 1860]],
    'home-teasers': [['photo', 0], ['head', 700], ['link', 1000]],
    'home-day': [['head', 0], ['map', 300], ['list', 700], ['link', 1000]],
    'home-foot': [['tag', 0], ['names', 700], ['links', 1000]],
    'story-head': [['kicker', 0], ['title', 220], ['intro', 560]],
    'story-window': [['frame', 0], ['caption', 650]],
    'story-next': [['names', 0], ['links', 320]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['head', 0], ['map', 250], ['row', 500], ['after', 1000]],
    'details-venue': [['head', 0], ['photo', 220], ['line', 1600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 820]],
    'rsvp-closing': [['tag', 0], ['names', 500], ['links', 900]]
  },
  stagger: 170,
  batchGap: 340,
  arriveDelay: 150,
  route: { draw: 520 },     // ms for one leg of the route between two stations
  scenery: { pan: 11 },     // % of the photo's width it slides behind the window glass across one screen of scrolling
  // the GPT accents (steam, punched disc, rose bud): over the opening sleeve and over a reply. move: rise = steam
  // drifting up and to the right, growing; fall = turning and falling
  accents: {
    open: [{ img: 'img/steam-200.webp', count: 4, dur: [2200, 3000], size: [34, 56], move: 'rise' },
      { img: 'img/disc-200.webp', count: 7, dur: [1800, 2600], size: [7, 12], move: 'fall' },
      { img: 'img/bud-200.webp', count: 3, dur: [2600, 3400], size: [22, 32], move: 'fall' }],
    reply: [{ img: 'img/disc-200.webp', count: 9, dur: [2000, 3000], size: [8, 13], move: 'fall' },
      { img: 'img/bud-200.webp', count: 4, dur: [2800, 3800], size: [24, 34], move: 'fall' },
      { img: 'img/steam-200.webp', count: 2, dur: [2600, 3200], size: [60, 90], move: 'rise' }]
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
    const min = el.closest('.hero') ? 26 : 32;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => el.scrollWidth > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) el.style.whiteSpace = '';
  });
}

/* -- the ticket in the sleeve keeps its fixed card: long names get smaller, then the portrait gets smaller */
function fitCard() {
  const card = $('.envelope .card'), names = card && card.querySelector('.card-names:not([hidden])');
  if (!card || !names) return;
  card.classList.remove('tight');
  names.style.fontSize = '';
  const over = () => card.scrollHeight > card.clientHeight + 1;
  let size = parseFloat(getComputedStyle(names).fontSize);
  for (let i = 0; i < 40 && over() && size > 11; i++) { size -= 1; names.style.fontSize = size + 'px'; }
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
  scene.dispatchEvent(new CustomEvent('scene:in'));
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

/* -- the GPT accents (MOTION.accents): steam rises and drifts right, discs and rose buds turn and fall; each is
   removed when its flight ends */
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
      const rise = g.move === 'rise';
      const x = rise ? box.left + box.width * (0.62 + 0.36 * Math.random()) - size / 2 : box.left + box.width * (0.06 + 0.88 * Math.random());
      const y = rise ? box.top + box.height * (0.45 + 0.4 * Math.random()) : Math.max(-40, box.top - 30);
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px`;
      layer.append(img);
      const dur = g.dur[0] + Math.random() * (g.dur[1] - g.dur[0]);
      left++;
      const frames = rise
        ? (() => {
          const dx = 60 + Math.random() * 70, dy = -(30 + Math.random() * 40);
          return [{ opacity: 0, transform: 'translate(0,0) scale(.6)' }, { opacity: .7, offset: 0.2 },
            { opacity: .45, transform: `translate(${dx * .6}px,${dy * .6}px) scale(1.05)`, offset: 0.6 },
            { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(1.4)` }];
        })()
        : (() => {
          const dy = Math.min(innerHeight * 0.75, box.height + 60), dx = (Math.random() - 0.5) * 120, r = (Math.random() - 0.5) * 240;
          return [{ opacity: 0, transform: 'translate(0,0) rotate(0deg)' }, { opacity: 1, offset: 0.1 },
            { transform: `translate(${dx * 0.5}px,${dy * 0.45}px) rotate(${r * 0.5}deg)`, offset: 0.5 },
            { opacity: 1, offset: 0.8 },
            { opacity: 0, transform: `translate(${dx}px,${dy}px) rotate(${r}deg)` }];
        })();
      img.animate(frames, { duration: dur, delay: k * 90, easing: rise ? 'ease-out' : 'ease-in', fill: 'both' })
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

/* -- the ticket sleeve */
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

/* -- the route over the map: [data-route] holds the station dots and the legs between them (CSS UI line). On the home
   page the whole route is drawn as the map comes in; on the itinerary it follows the schedule rows ([data-route-rows])
   — as each row scrolls into view the route reaches the matching share of its stations, the last one = the venue */
function initRoute() {
  $$('[data-route]').forEach((map) => {
    const stops = [...map.querySelectorAll('.stop')], n = stops.length;
    const set = (k) => {
      const reach = Math.max(0, Math.min(n, k));
      map.style.setProperty('--reach', String(reach));
      stops.forEach((s, i) => s.classList.toggle('is-reached', i < reach));
      map.querySelectorAll('.leg').forEach((l, i) => l.classList.toggle('is-drawn', i < reach - 1));
    };
    const rows = map.dataset.routeRows ? $$(map.dataset.routeRows) : [];
    if (reduce || !('IntersectionObserver' in window)) { set(n); return; }
    if (!rows.length) {
      const scene = map.closest('[data-scene]');
      const run = () => stops.forEach((_, i) => setTimeout(() => set(i + 1), 500 + i * MOTION.route.draw));
      if (scene) scene.addEventListener('scene:in', run, { once: true }); else run();
      return;
    }
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { seen.add(rows.indexOf(e.target)); io.unobserve(e.target); } });
      const done = seen.size ? Math.max(...seen) + 1 : 0;
      set(Math.ceil(n * done / rows.length));
    }, { threshold: 0.6 });
    rows.forEach((r) => io.observe(r));
  });
}

/* -- story: the scenery slides behind each sash window's glass as the page scrolls (a parallax pan of the photo,
   --pan from -1 to 1 across the screen). With reduced motion the photos stand still. */
function initScenery() {
  const panes = $$('[data-scenery]');
  if (!panes.length || reduce) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const h = innerHeight;
    panes.forEach((p) => {
      const r = p.getBoundingClientRect();
      if (r.bottom < -h * .2 || r.top > h * 1.2) return;
      const t = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - h / 2) / (h / 2 + r.height / 2)));
      p.style.setProperty('--pan', (t * MOTION.scenery.pan * (p.dataset.scenery === 'rtl' ? -1 : 1)).toFixed(2) + '%');
    });
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask, { passive: true });
  update();
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    // the reply is in: the ticket is punched — discs, rose buds and a puff of steam over the thank-you panel
    if (st === 'success') requestAnimationFrame(() => particles('reply', $('.reply-panel[data-rsvp-state=success]') || $('.reply-card')));
  });
  const fit = () => { fitNames(); fitCard(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initRoute();
  initScenery();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
