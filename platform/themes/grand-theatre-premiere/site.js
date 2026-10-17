/* Grand Theatre Premiere — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (README "Opening"; the CSS keyframes in site.css ".is-opening …" use the same numbers): the house lights dim,
   the curtain panels part with heavy folds — left first, right a beat later — and hand over to their gathered swags,
   which sway as they settle; a spotlight sweeps the stage and settles on the programme card, which steps downstage and
   flies to home (view transition invite-card). Story: the spotlight follows a tap / the pointer. RSVP: the ticket stub
   tears off when the reply is sent. The page turn between the inner pages is set in each page's <head> script. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    hint: [0, 300],         // "Tap to raise the curtain" goes
    tug: [0, 300],          // both panels draw a breath toward the seam
    head: [0, 500],         // kicker, names and date rise away
    house: [100, 700],      // the house lights dim around the stage
    partL: [400, 1450],     // the left panel parts, gathering to its outer edge (overshoot, settle)
    partR: [540, 1450],     // the right panel a beat later
    spot: [1100, 1500],     // the spotlight comes on in the wing, sweeps across and settles on the card
    gather: [1700, 300],    // the closed panels hand over to their gathered swags
    sway: [2000, 1400],     // the swags sway and settle
    rise: [2000, 900],      // the card is lit in the spotlight
    forward: [2900, 450],   // the card steps downstage, over the arch
    go: 3450,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['kicker', 0], ['names', 200], ['date', 620], ['place', 820]],
    'home-invite': [['portrait', 0], ['title', 280], ['names', 560], ['date', 880], ['venue', 1120], ['reply', 1380], ['count', 1600], ['calendar', 1800]],
    'home-teasers': [['photo', 0], ['head', 240], ['link', 560]],
    'home-day': [['head', 0], ['list', 360], ['link', 720]],
    'home-foot': [['names', 0], ['links', 400]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 500]],
    'story-frame': [['scene', 0]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 180], ['venue', 500]],
    'details-card': [['head', 0], ['acts', 300], ['close', 700]],
    'details-venue': [['head', 0], ['photo', 260], ['line', 600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 240]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 500], ['cta', 780]],
    'rsvp-closing': [['names', 0], ['links', 500]]
  },
  stagger: 200,
  batchGap: 360,
  arriveDelay: 150
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

/* -- long names: one line each while they fit, then smaller (never under the design's minimum), then they wrap */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.hero-card') ? 32 : 26;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const wide = () => Math.max(...parts.map((n) => n.scrollWidth)) > el.clientWidth + 1;
    for (let i = 0; i < 90 && wide() && size > min; i++) { size = Math.max(min, size - 2); el.style.fontSize = size + 'px'; }
    if (wide()) parts.forEach((n) => { n.style.whiteSpace = 'normal'; });
  });
}

/* -- the curtain page: long names make the heading taller — the stage gives up that height (its width shrinks by the
   overflow × the stage box aspect 880/1344), so the curtain and "Tap to raise the curtain" stay on the first screen */
function fitStage() {
  const stage = $('.stage'), actions = $('.opening-actions');
  if (!stage || !actions) return;
  stage.style.removeProperty('--obj');
  const over = actions.getBoundingClientRect().bottom + scrollY - innerHeight + 6;
  if (over > 0) stage.style.setProperty('--obj', Math.max(140, stage.getBoundingClientRect().width - over * 880 / 1344) + 'px');
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

/* -- the curtain */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.theatre .card'), E = MOTION.envelope;
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

/* -- story: the spotlight rests on a card; a tap / click / focus moves it there (and lifts the card), a mouse pointer
   drags the light over the stage, a touch on the empty stage moves it to that point. Reduced motion: no mask. */
function initSpotlight() {
  const stage = $('.spot-stage');
  if (!stage) return;
  const cards = $$('[data-spot]');
  if (!cards.length) return;
  if (reduce) { stage.classList.add('is-unlit'); return; }
  let current = cards[0];
  const at = (x, y, r) => {
    stage.style.setProperty('--sx', Math.round(x) + 'px');
    stage.style.setProperty('--sy', Math.round(y) + 'px');
    if (r) stage.style.setProperty('--sr', Math.round(r) + 'px');
  };
  const place = (el) => {
    const s = stage.getBoundingClientRect(), b = el.getBoundingClientRect();
    at(b.left - s.left + b.width / 2, b.top - s.top + b.height / 2, Math.max(b.width, b.height) * 0.62);
  };
  const light = (btn) => {
    current = btn;
    cards.forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
    place(btn);
  };
  light(current);
  cards.forEach((c) => {
    c.addEventListener('click', () => light(c));
    c.addEventListener('focus', () => light(c));
  });
  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const s = stage.getBoundingClientRect();
    at(e.clientX - s.left, e.clientY - s.top);
  });
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('[data-spot]')) return;
    const s = stage.getBoundingClientRect();
    at(e.clientX - s.left, e.clientY - s.top);
  });
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') place(current); });
  addEventListener('resize', () => place(current), { passive: true });
  document.fonts?.ready.then(() => place(current));
}

/* -- rsvp: the stub tears off along the perforation when the reply is sent; "Send another reply" puts it back */
function initTicket() {
  const ticket = $('#reply.ticket'), stub = ticket && ticket.querySelector('.ticket-stub');
  if (!stub) return;
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success') ticket.classList.add('is-torn');
    else if (st === 'ready' && ticket.classList.contains('is-torn')) {
      ticket.classList.remove('is-torn');
      stub.classList.add('is-back');
      stub.addEventListener('animationend', () => stub.classList.remove('is-back'), { once: true });
    }
  });
}

function boot() {
  document.addEventListener('rsvp:state', (e) => { const st = e.detail && e.detail.state; if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success'); });
  const fit = () => { fitNames(); fitStage(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initSpotlight();
  initTicket();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
