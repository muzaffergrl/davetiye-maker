/* Crimson Rose Atelier — the behaviour of the five pages (2026-10-23 atelier redesign). Personal content is rendered by
   the platform (data-field, data-text, data-photo); this script never writes it (it only rolls the countdown figures).
   Page addresses come from #site-data (data.pages) only. Sounds: the platform's audio.js plays the opening cues on the
   same numbers as MOTION.envelope (lib/audio/catalog.ts); the page cues below ('petal', 'page', 'fold', 'stamp') go to
   it as 'invite:sfx' events and sound only after the guest's own tap.
   Opening (docs/11 §7.3, kapak): crack — the seal is pressed and cracks in two, the halves fall away · flap — the flap
   turns up on its hinge in 3D, its inside showing · draw — the card is drawn out of the pocket, rose first · reveal —
   it lifts free and flies to the guest while the envelope sinks out of focus · bloom — it settles, a little closer ·
   go — home: the card's photograph flies into the oval portrait on the first screen (view transition invite-card, named on the photograph).
   Before the tap the envelope lies tilted at the foot of the screen (GPT design board); the tap straightens it and
   lifts it into the middle (CSS transition, done before the card is drawn). The CSS keyframes in site.css
   (".is-opening …") use the same numbers. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    crack: [0, 620],        // the seal is pressed (120) and cracks; the halves fall left (90–710) and right (120–780)
    hint: [0, 300],         // "Tap to open" goes
    head: [0, 700],         // the names and the roses leave, out of focus
    flap: [480, 800],       // the flap turns up on its hinge; edge-on at ~880 it passes behind the card
    open: [560, 350],       // the inside of the envelope shows
    draw: [1150, 1100],     // the card is drawn out of the pocket, rose first (its clip moves with it)
    reveal: [2250, 900],    // the card flies to the guest (Web Animations); the envelope sinks and blurs
    bloom: [3150, 700],     // it settles, a little closer
    go: 3950,               // to home (view transition)
    fadeOut: 350            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['kicker', 0], ['names', 140], ['request', 620]],
    'home-intro': [['photo', 0], ['line', 300], ['date', 560], ['text', 900], ['cue', 1300]],
    'home-invite': [['card', 0], ['host', 350], ['names', 560], ['request', 900], ['date', 1150], ['venue', 1420], ['reply', 1700]],
    'home-count': [['count', 0], ['calendar', 420]],
    'home-teasers': [['head', 0], ['fan', 260], ['captions', 900], ['link', 1150]],
    'home-day': [['iris', 0], ['head', 700], ['link', 1200]],
    'home-foot': [['rose', 0], ['names', 320], ['links', 720]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['album', 0]],
    'story-next': [['rose', 0], ['names', 300], ['link', 700]],
    'details-head': [['rose', 0], ['date', 100], ['title', 280], ['venue', 700]],
    'details-card': [['title', 0], ['list', 220]],
    'details-venue': [['photo', 0], ['copy', 600]],
    'details-notes': [['note', 0]],
    'rsvp-card': [['title', 0], ['line', 380], ['cta', 760]],
    'rsvp-closing': [['rose', 0], ['names', 300], ['links', 650]]
  },
  stagger: 200,
  batchGap: 380,
  arriveDelay: 160,
  petals: { crack: 9, arrive: 4, reply: 14 },   // PAKET 8 petals (parts.css --cra-petals); none without them
  turn: 880                                       // one album leaf
};

(() => {
'use strict';
const root = document.documentElement;
const BASE = document.currentScript ? document.currentScript.src : location.href;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (q, el = document) => el.querySelector(q), $$ = (q, el = document) => [...el.querySelectorAll(q)];
let SITE = null;
try { SITE = JSON.parse($('#site-data')?.textContent || 'null'); } catch (e) { SITE = null; }
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY, ARRIVE = MOTION.storage.arrive + KEY;
const store = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } };
const crossDocVT = 'onpageswap' in window && Boolean(document.startViewTransition);
const canAnimate = Boolean(Element.prototype.animate);
const sfx = (name) => document.dispatchEvent(new CustomEvent('invite:sfx', { detail: { name } }));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* -- long names: [data-fit="n"] shrinks its type (CSS --fit) until each name fits its line and the block is at most n
   lines, never under MIN_NAME px (a long name then wraps — never cut — and the card makes room: .is-long shrinks
   the portrait). Measured again when the fonts arrive and on resize. */
const MIN_NAME = 16;
function fitAll() {
  $$('[data-fit]').forEach((el) => {
    el.style.removeProperty('--fit');
    el.classList.remove('wrap');
    const card = el.closest('.card-portrait');
    card?.classList.remove('is-long');
    const n = parseFloat(el.dataset.fit) || 2;
    const parts = $$('[data-field]', el);
    const base = parseFloat(getComputedStyle(el).fontSize) || 20;
    const kmin = Math.min(1, Math.max(0.5, MIN_NAME / base));
    const wide = () => parts.some((p) => Math.max(p.scrollWidth, p.getBoundingClientRect().width) > el.clientWidth + 1);
    const lines = () => el.getBoundingClientRect().height / (parseFloat(getComputedStyle(el).lineHeight) || 1);
    let k = 1;
    while ((wide() || lines() > n + 0.3) && k > kmin) { k = Math.max(kmin, k - 0.03); el.style.setProperty('--fit', k.toFixed(3)); }
    if (wide()) el.classList.add('wrap');
    if (lines() > n + 0.3) card?.classList.add('is-long');
  });
}

/* -- scenes: [data-scene] plays its [data-step]s in the MOTION order when it enters the view */
const stepIndex = (n) => Number(n.dataset.i !== undefined ? n.dataset.i : (n.dataset.repeatItem || '').split('.').pop()) || 0;
function reveal(scene, base, instant) {
  const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
  $$('[data-step]', scene).forEach((n) => {
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
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  scenes.forEach((s) => io.observe(s));
}

/* -- countdown: the target comes from the platform (site-data derived.countdown_target_utc); the figures roll */
function odometer(cell, text) {
  if (!cell._odo) { cell.textContent = ''; cell._sr = document.createElement('span'); cell._sr.className = 'sr-only'; cell.append(cell._sr); cell._odo = []; }
  cell._sr.textContent = text;
  while (cell._odo.length < text.length) {
    const col = document.createElement('span'), strip = document.createElement('span');
    col.className = 'odo'; col.setAttribute('aria-hidden', 'true');
    for (let d = 0; d < 10; d++) { const i = document.createElement('i'); i.textContent = String(d); strip.append(i); }
    col.append(strip); cell.append(col); cell._odo.push(col);
  }
  while (cell._odo.length > text.length) cell._odo.pop().remove();
  cell._odo.forEach((col, i) => { col.firstChild.style.transform = `translateY(${-Number(text[i]) * 1.1}em)`; });
}
function initCountdown() {
  $$('[data-countdown]').forEach((box) => {
    const target = Date.parse((SITE && SITE.derived && SITE.derived.countdown_target_utc) || '');
    if (!Number.isFinite(target)) { box.hidden = true; return; }
    box.dataset.targetUtc = new Date(target).toISOString();
    const cells = Object.fromEntries($$('[data-unit]', box).map((n) => [n.dataset.unit, n]));
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.classList.add('is-done');
        $$('.cd-done', box).forEach((n) => { n.hidden = (n.dataset.when === 'today') !== (-diff < 864e5); });
        return false;
      }
      const s = Math.floor(diff / 1000);
      const v = { days: Math.floor(s / 86400), hours: Math.floor(s % 86400 / 3600), minutes: Math.floor(s % 3600 / 60), seconds: s % 60 };
      Object.entries(v).forEach(([u, n]) => { if (cells[u]) odometer(cells[u], String(n).padStart(2, '0')); });
      return true;
    };
    if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
  });
}

/* -- petals (PAKET 8 W3.4): sprites named by parts.css; they tumble down from a point and are gone */
let PETALS = [];
try { PETALS = getComputedStyle(root).getPropertyValue('--cra-petals').replace(/["']/g, ' ').trim().split(/\s+/).filter(Boolean); } catch (e) { PETALS = []; }
/** Spawns `count` petals; false when none fall (no sprites yet, reduced motion, no animation) — then no petal sound either. */
function petals(count, from) {
  const layer = $('.accent-layer');
  if (!PETALS.length || !layer || reduce || !canAnimate || !count) return false;
  const W = innerWidth, H = innerHeight;
  for (let i = 0; i < count; i++) {
    const img = new Image(), s = 18 + Math.random() * 18;
    img.src = new URL(PETALS[i % PETALS.length], BASE).href; img.alt = ''; img.className = 'petal';
    img.style.setProperty('--s', s + 'px');
    const x0 = (from ? from.x : Math.random() * W) + (Math.random() - 0.5) * (from ? 60 : 0), y0 = from ? from.y : -40;
    const drift = (Math.random() - 0.5) * W * 0.6, fall = H - y0 + 80, spin = (Math.random() - 0.5) * 720;
    const frames = [0, 0.25, 0.5, 0.75, 1].map((k) => ({
      transform: `translate(${x0 + drift * k + Math.sin(k * 6 + i) * 30}px,${y0 + fall * k * k * 0.4 + fall * k * 0.6}px) rotate(${spin * k}deg) rotateX(${k * 540}deg)`,
      opacity: k < 0.85 ? 1 : 0
    }));
    if (from) frames[0].transform = `translate(${x0}px,${y0}px) scale(.4)`;
    layer.append(img);
    img.animate(frames, { duration: 2800 + Math.random() * 1800, delay: i * 60, easing: 'linear', fill: 'both' }).onfinish = () => img.remove();
  }
  return true;
}

/* -- the letter */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const env = $('.env'), well = $('.card-well'), card = $('.env-card'), oval = $('.card-oval', card), E = MOTION.envelope;
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [], anims = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  // the envelope leans towards the finger / pointer (a few degrees)
  if (!reduce) {
    const lean = (x, y) => { env.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg'); env.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg'); };
    stage.addEventListener('pointermove', (e) => {
      if (state !== 'closed') return;
      const r = stage.getBoundingClientRect();
      lean((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    stage.addEventListener('pointerleave', () => lean(0, 0));
    stage.addEventListener('pointerdown', () => { if (state === 'closed') env.style.scale = '.985'; });
    addEventListener('pointerup', () => { env.style.scale = ''; });
  }
  function go(withCard) {
    store(OPENED, '1');
    if (withCard) { store(ARRIVE, '1'); oval.style.viewTransitionName = 'invite-card'; } else oval.style.viewTransitionName = 'none';
    if (crossDocVT || reduce || !canAnimate) { location.href = PAGES.home; return; }
    $('.opening').animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }
  function fly() {
    well.classList.add('is-free');
    root.classList.add('is-reveal');
    if (!canAnimate) return;
    const r0 = card.getBoundingClientRect(), wr = well.getBoundingClientRect();
    const w = Math.min(innerWidth * 0.84, 400, Math.max(200, (innerHeight - 270) * 0.6704));
    const s = w / r0.width, cx = innerWidth / 2, cy = innerHeight / 2 + 4;
    const ox = r0.left + r0.width / 2 - wr.left, oy = r0.top + r0.height / 2 - wr.top;
    const dx = cx - (r0.left + r0.width / 2), dy = cy - (r0.top + r0.height / 2);
    well.style.transformOrigin = `${ox}px ${oy}px`;
    anims.push(well.animate([
      { transform: 'none' },
      { transform: `translate(${dx * 0.45}px,${dy * 0.3 - 24}px) rotate(-3deg) scale(${1 + (s - 1) * 0.55})`, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) rotate(-1.2deg) scale(${s})` }
    ], { duration: E.reveal[1], easing: 'cubic-bezier(.35,.1,.2,1)', fill: 'forwards' }));
  }
  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    if (reduce) { go(false); return; }
    env.style.setProperty('--rx', '0deg'); env.style.setProperty('--ry', '0deg');
    root.classList.add('is-opening');
    at(E.crack[0] + 120, () => {
      const r = $('.env-seal').getBoundingClientRect();
      petals(MOTION.petals.crack, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
    at(E.reveal[0], fly);
    at(E.bloom[0], () => { if (canAnimate) anims.push(card.animate([{ scale: '1' }, { scale: '1.03' }], { duration: E.bloom[1], easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' })); });
    at(E.go, () => { state = 'done'; go(true); });
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    anims.splice(0).forEach((a) => a.cancel());
    root.classList.remove('is-opening', 'is-opened', 'is-reveal');
    well.classList.remove('is-free');
    oval.style.viewTransitionName = '';
    state = 'closed';
  }
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { reset(); root.classList.add('is-opened'); state = 'opened'; }
  });
}

/* -- home: a few petals fall from the portrait as the photograph lands in it */
function initHome() {
  if (!$('.page-home') || !root.classList.contains('from-envelope')) return;
  setTimeout(() => {
    const r = $('.hero-portrait')?.getBoundingClientRect();
    if (petals(MOTION.petals.arrive, r ? { x: r.left + r.width / 2, y: r.top + r.height * 0.8 } : null)) sfx('petal');
  }, 900);
}

/* -- the album: leaves turn like a real book (drag from the right edge, buttons, arrows, thumbnails) */
function initAlbum() {
  const book = $('.book'), leaves = $$('[data-album-page]'), prev = $('[data-album-prev]'), next = $('[data-album-next]');
  if (!book || !leaves.length || !prev || !next) return;
  const tabs = $$('[data-album-go]'), ribbon = $('.ribbon', book), last = leaves.length - 1;
  leaves.forEach((l) => { const s = document.createElement('span'); s.className = 'leaf-shade'; s.setAttribute('aria-hidden', 'true'); l.append(s); });
  let active = clamp(Number(location.hash.replace('#chapter-', '')) - 1 || 0, 0, last), busy = false;
  const shade = (leaf, deg) => { leaf.lastChild.style.opacity = String(Math.sin(Math.min(180, Math.abs(deg)) * Math.PI / 180) * 0.95); };
  // first: the call while the page loads. It writes no #chapter-1 into a plain /story address: the browser scrolls to the
  // URL's fragment when loading ends, and the page would open past its title (review 2026-10-23: 277–305 px down)
  function layout(first = false) {
    leaves.forEach((l, i) => {
      l.classList.toggle('turned', i < active);
      l.classList.toggle('under', i === active + 1);
      l.classList.toggle('under2', i > active + 1);
      l.style.zIndex = String(leaves.length - i);
      l.style.transform = i < active ? 'rotateY(-180deg)' : '';
      l.lastChild.style.opacity = '0';
      l.setAttribute('aria-hidden', String(i !== active));
      l.inert = i !== active;
    });
    tabs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === active)));
    $('[data-album-number]').textContent = String(active + 1).padStart(2, '0');
    prev.disabled = active === 0; next.disabled = active === last;
    if (!first || location.hash) history.replaceState(null, '', '#chapter-' + (active + 1));
  }
  function sway() { if (ribbon && canAnimate && !reduce) ribbon.animate([{ rotate: '0deg' }, { rotate: '-7deg' }, { rotate: '4deg' }, { rotate: '0deg' }], { duration: 1400, easing: 'ease-out' }); }
  // dir +1: the active leaf turns over to the left; -1: the last turned leaf comes back. from = the drag angle reached
  function turn(dir, from = 0, quick = false) {
    const leaf = dir > 0 ? leaves[active] : leaves[active - 1];
    if (!leaf || (dir > 0 && active === last)) return Promise.resolve();
    busy = true;
    leaf.classList.remove('turned');
    leaf.style.zIndex = '9';
    const a0 = dir > 0 ? -from : -180 + from, a1 = dir > 0 ? -180 : 0;
    sfx('page'); sway();
    const done = () => { active += dir; busy = false; layout(); };
    if (reduce || !canAnimate) { done(); return Promise.resolve(); }
    const dur = (quick ? 0.45 : 1) * MOTION.turn * (1 - from / 200);
    const steps = 12, frames = [], shades = [];
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (a1 - a0) * (i / steps);
      frames.push({ transform: `rotateY(${a}deg)` });
      shades.push({ opacity: Math.sin(Math.abs(a) * Math.PI / 180) * 0.95 });
    }
    const opts = { duration: dur, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'forwards' };
    leaf.lastChild.animate(shades, opts);
    return new Promise((ok) => { leaf.animate(frames, opts).onfinish = (e) => { e.target.cancel(); leaf.lastChild.getAnimations().forEach((a) => a.cancel()); done(); ok(); }; });
  }
  async function goTo(i) {
    if (busy) return;
    while (active !== i) await turn(i > active ? 1 : -1, 0, Math.abs(i - active) > 1);
  }
  $('.album-controls').hidden = false; $('.album-tabs').hidden = false; $('.album-hint').hidden = false;
  layout(true);
  prev.addEventListener('click', () => { if (!busy) turn(-1); });
  next.addEventListener('click', () => { if (!busy) turn(1); });
  tabs.forEach((t, i) => t.addEventListener('click', () => goTo(i)));
  $('.album').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (!busy) turn(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (!busy) turn(1); }
  });
  // drag: the leaf follows the finger; past a third of a turn (or a flick) it goes over, else it falls back
  book.style.touchAction = 'pan-y';
  let drag = null;
  book.addEventListener('pointerdown', (e) => {
    if (busy || reduce || e.button > 0) return;
    drag = { x: e.clientX, t: performance.now(), dir: 0, deg: 0, w: book.getBoundingClientRect().width };
  });
  book.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.dir) {
      if (Math.abs(dx) < 8) return;
      drag.dir = dx < 0 ? 1 : -1;
      if ((drag.dir > 0 && active === last) || (drag.dir < 0 && active === 0)) { drag = null; return; }
      drag.leaf = drag.dir > 0 ? leaves[active] : leaves[active - 1];
      drag.leaf.classList.remove('turned'); drag.leaf.style.zIndex = '9';
      book.setPointerCapture(e.pointerId);
    }
    drag.deg = clamp(Math.abs(dx) / (drag.w * 0.95) * 180, 0, 178);
    const a = drag.dir > 0 ? -drag.deg : -180 + drag.deg;
    drag.leaf.style.transform = `rotateY(${a}deg)`;
    shade(drag.leaf, a);
  });
  const release = (e) => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.dir) return;
    const speed = Math.abs(e.clientX - d.x) / Math.max(1, performance.now() - d.t);
    if (d.deg > 62 || (speed > 0.55 && d.deg > 14)) { d.leaf.style.transform = ''; turn(d.dir, d.deg); return; }
    // fall back
    const a = d.dir > 0 ? -d.deg : -180 + d.deg, a1 = d.dir > 0 ? 0 : -180;
    if (!canAnimate) { layout(); return; }
    busy = true;
    d.leaf.animate([{ transform: `rotateY(${a}deg)` }, { transform: `rotateY(${a1}deg)` }], { duration: 420, easing: 'cubic-bezier(.3,.7,.3,1)' }).onfinish = () => { busy = false; layout(); };
  };
  book.addEventListener('pointerup', release);
  book.addEventListener('pointercancel', release);
  addEventListener('hashchange', () => { const n = Number(location.hash.replace('#chapter-', '')) - 1; if (Number.isInteger(n) && n >= 0 && n <= last && n !== active) goTo(n); });
}

/* -- the day: the gold thread draws itself down the Order of the Day as the guest scrolls */
function initThread() {
  const list = $('.schedule');
  if (!list || reduce || !list.children.length) return;
  const items = $$('li', list);
  list.classList.add('threaded');
  let queued = false;
  const update = () => {
    queued = false;
    const r = list.getBoundingClientRect();
    const p = clamp((innerHeight * 0.9 - r.top) / Math.max(1, r.height), 0, 1);
    list.style.setProperty('--draw', p.toFixed(3));
    items.forEach((li) => li.classList.toggle('lit', (li.offsetTop + 14) / Math.max(1, r.height) <= p + 0.002));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

/* -- RSVP: when the reply is sent, a little envelope receives a card, closes and is sealed */
function initReply() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    if (st === 'ready') root.classList.remove('is-sealing');
    if (st !== 'success' || !$('.sealing')) return;
    root.classList.remove('is-sealing'); void root.offsetWidth; root.classList.add('is-sealing');
    if (reduce) return;
    setTimeout(() => sfx('fold'), 250);
    setTimeout(() => { sfx('stamp'); const r = $('.mini-seal').getBoundingClientRect(); petals(MOTION.petals.reply, { x: r.left + r.width / 2, y: r.top }); }, 1750);
    $('.sealing').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function boot() {
  fitAll();
  document.fonts?.ready.then(fitAll);
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fitAll, 120); }, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initHome();
  initAlbum();
  initThread();
  initReply();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
