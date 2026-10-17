/* Orient Express Voyage — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (own type "cuzdan" — a ticket wallet, docs/11 §7): the strap unbuckles (its two halves slide apart), the cover
   swings open on its left hinge while the stage settles the two-wallet-wide spread on screen, the first-class ticket
   slides up out of the pocket, comes forward and travels to home (view transition invite-card). The CSS keyframes in
   site.css (".is-opening …") use the same numbers as MOTION.envelope.
   Motion signature (docs/24): the route line draws itself across the map as you scroll (CSS scroll-driven animation;
   this script is the fallback where animation-timeline is missing), stations arrive one by one (scenes), the luggage
   tag swings when it comes into view, carriage-window photos pass like scenery, and a sent reply gets the boarding
   stamp (html[data-rsvp-replied]). */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    closure: [0, 700],      // the strap unbuckles: the buckle end slides right, the tail left (strap_r / strap_l)
    hint: [0, 300],         // "Tap to unbuckle" fades
    head: [0, 450],         // kicker, names and date rise away
    open: [600, 900],       // the cover swings open on its left hinge (0 → -180°; its inside past 90°), the spread settles
    rise: [1500, 1100],     // the ticket slides up out of the pocket
    forward: [2600, 400],   // the ticket comes forward, over the wallet
    go: 3100,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['host', 0], ['names', 220], ['request', 700], ['date', 950]],
    'home-invite': [['portrait', 0], ['title', 300], ['names', 560], ['date', 900], ['venue', 1150], ['reply', 1400], ['calendar', 1650]],
    'home-count': [['clock', 0], ['count', 350]],
    'home-day': [['head', 0], ['map', 300], ['station', 700], ['link', 1500]],
    'home-teasers': [['photo', 0], ['head', 250], ['link', 600]],
    'home-foot': [['stamp', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['frame', 0], ['caption', 380]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-station': [['time', 0], ['stop', 160]],
    'details-card': [['venue', 0]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 800]],
    'rsvp-closing': [['stamp', 0], ['names', 300], ['links', 650]]
  },
  stagger: 220,             // the stations of the home journey arrive one by one
  batchGap: 380,
  arriveDelay: 150,
  route: { start: 0.82, span: 0.9,     // fallback (home): the line starts when the section's top passes 82% of the screen
           stops: [0.8, 0.55] },        // details: from the first station at 80% of the screen to the last one at 55%
  scenery: 7                           // carriage-window photos travel ±7% of their width through the glass
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
const scrollTimeline = Boolean(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));

/* -- long names: one line each while they fit, then smaller, then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.poster-hero') ? 32 : 26;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => Math.max(...parts.map((n) => n.scrollWidth)) > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) parts.forEach((n) => { n.style.whiteSpace = 'normal'; });
  });
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

/* -- the ticket wallet */
function fitStage() {
  // closed: kicker, names, wallet and "Tap to unbuckle" share one screen. Very long names (or a short phone) would push
  // the hint below the fold, so the wallet gives up the overflow (never below 120 px wide; its height is 1.5 × width)
  const stage = $('.stage'), hint = $('.tap-hint');
  if (!stage || !hint || root.classList.contains('is-opened') || root.classList.contains('is-opening')) return;
  stage.style.removeProperty('--obj');
  const over = hint.getBoundingClientRect().bottom + scrollY - (innerHeight - 8);
  if (over > 0) stage.style.setProperty('--obj', Math.max(120, stage.offsetWidth - over / 1.5).toFixed(1) + 'px');
}
function fitTicket() {
  // the ticket's free band (under its portrait window, above the perforation) takes any names: the type steps down
  // (--fit, never below half), then the "First class to forever" line gives way; nothing leaves the card
  const copy = $('.ticket-copy');
  if (!copy || !copy.clientHeight) return;
  copy.classList.remove('is-tight');
  let fit = 1;
  copy.style.setProperty('--fit', '1');
  const over = () => copy.scrollHeight > copy.clientHeight + 1 || [...copy.children].some((n) => n.scrollWidth > n.clientWidth + 1);
  while (over() && fit > 0.5) { fit = Math.round((fit - 0.05) * 100) / 100; copy.style.setProperty('--fit', String(fit)); }
  if (over()) copy.classList.add('is-tight');
}
function fitSpread() {
  // the open wallet is two wallets wide (cover to the left of the hinge): scale it to 94% of the screen
  const stage = $('.stage'), wallet = $('.wallet');
  if (!stage || !wallet || !wallet.offsetWidth) return;
  const s = Math.min(1, (0.94 * innerWidth) / (2 * wallet.offsetWidth));
  stage.style.setProperty('--open-scale', s.toFixed(3));
}
function initWallet() {
  const stage = $('.stage');
  if (!stage) return;
  const ticket = $('.wallet .ticket'), E = MOTION.envelope;
  const fit = () => { fitStage(); fitSpread(); fitTicket(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [];
  function go(withTicket) {
    store(OPENED, '1');
    if (withTicket) { store(ARRIVE, '1'); ticket.style.viewTransitionName = 'invite-card'; } else ticket.style.viewTransitionName = 'none';
    if (crossDocVT || reduce || !Element.prototype.animate) { location.href = PAGES.home; return; }
    $('.opening').animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }
  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    if (reduce) { go(false); return; }
    fitSpread();
    root.classList.add('is-opening');
    timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    root.classList.remove('is-opening', 'is-opened');
    ticket.style.viewTransitionName = '';
    state = 'closed';
  }
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { timers.splice(0).forEach(clearTimeout); root.classList.remove('is-opening'); root.classList.add('is-opened'); ticket.style.viewTransitionName = ''; state = 'opened'; }
  });
}

/* -- scroll motion fallback: the route line and the carriage-window scenery follow the scroll where CSS scroll-driven
      animations are missing (with them, site.css does it on its own; with reduced motion both stay still) */
function initScrollMotion() {
  const routes = $$('[data-route]'), panes = $$('[data-scenery]');
  if (scrollTimeline) { root.classList.add('scroll-tl'); return; }
  if (reduce || (!routes.length && !panes.length)) return;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  let queued = false;
  function update() {
    queued = false;
    const vh = innerHeight;
    routes.forEach((fig) => {
      const track = fig.closest('section') || fig, stops = track.querySelector('.stations');
      const r = (stops || track).getBoundingClientRect(), [a, z] = MOTION.route.stops;
      const t = stops ? (vh * a - r.top) / Math.max(1, r.height + vh * (a - z))
        : (vh * MOTION.route.start - r.top) / Math.max(1, r.height * MOTION.route.span);
      fig.style.setProperty('--route', clamp(t).toFixed(3));
    });
    panes.forEach((p) => {
      const r = p.getBoundingClientRect();
      const t = clamp((vh - r.top) / (vh + r.height));            // 0 entering at the bottom → 1 leaving at the top
      p.style.setProperty('--pan', ((t - 0.5) * 2 * MOTION.scenery).toFixed(2) + '%');
    });
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  update();
}

/* -- the luggage tag swings on its string when it comes into view (and again on a tap of the portrait) */
function initSwing() {
  const tags = $$('[data-swing]');
  if (!tags.length || reduce || !('IntersectionObserver' in window)) return;
  const swing = (t) => { t.classList.remove('is-swinging'); void t.offsetWidth; t.classList.add('is-swinging'); };
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => { io.unobserve(e.target); setTimeout(() => swing(e.target), 900); });
  }, { threshold: 0.6 });
  tags.forEach((t) => {
    io.observe(t);
    t.closest('.portrait-column')?.addEventListener('pointerenter', () => swing(t));
    t.addEventListener('focus', () => swing(t));          // keyboard users see it swing too
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => { const st = e.detail && e.detail.state; if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success'); });
  fitNames();
  document.fonts?.ready.then(fitNames);
  addEventListener('resize', fitNames, { passive: true });
  initWallet();
  initScenes();
  initCountdown();
  initScrollMotion();
  initSwing();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
