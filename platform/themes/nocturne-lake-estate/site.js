/* Nocturne Lake Estate — the behaviour of the five pages (v2 of 2026-10-24, after the GPT design board). Personal
   content is rendered by the platform (data-field, data-text, data-photo); this script never writes it (it only rolls
   the countdown figures). Page addresses come from #site-data (data.pages) only. Sounds: the platform's audio.js plays
   the opening cues on the same numbers as MOTION.envelope (lib/audio/catalog.ts: tick 0 · rise 150 · flap 650 · moon
   1250 · draw 1350 · reveal 2400); the page cues ('leaf', 'ripple', 'press', 'clink') go to it as 'invite:sfx' events
   and sound only after the guest's own tap.
   Opening (docs/11 §7.3): tick — the gold moon seal in the valley of the mountain-cut flap is pressed and clicks free ·
   rise — it lifts out of the valley and rises into the empty sky over the moon path, turning into the moon (a fixed
   clone flies; the moon fades in under it) · flap — the flap lifts on its hinge to edge-on, its gold moiré inside
   stands up from there · moon — the moon settles, its halo opens, light runs down the path, gold leaf drifts · draw —
   the ivory card slides out of the pocket · reveal — it comes forward over the lake while the envelope sinks out of
   focus · go — home (view transitions invite-card on the card's arch window and sky-moon on the moon). The CSS keyframes
   in site.css (".is-opening …") use the same numbers. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    tick: [0, 160],         // the seal is pressed; "Tap to open" goes; the names leave (120–920)
    rise: [150, 1100],      // the seal rises into the sky and becomes the moon (the moon fades in 1120–1570)
    flap: [650, 700],       // the flap to edge-on (650–970), its moiré inside stands up (970–1350)
    moon: [1250, 1800],     // halo, light down the path, gold leaf
    draw: [1350, 950],      // the card slides out of the pocket
    reveal: [2400, 900],    // it comes forward; the envelope sinks and blurs
    bloom: [3300, 600],     // it settles, a little closer
    go: 3900,               // to home (view transition)
    fadeOut: 350            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['names', 200], ['meta', 700]],
    'home-intro': [['photo', 0], ['line', 450], ['text', 700], ['count', 1000], ['cta', 1300], ['cue', 1600]],
    'home-invite': [['card', 0], ['host', 350], ['names', 600], ['date', 1000], ['venue', 1300], ['reply', 1600], ['calendar', 1900]],
    'home-teasers': [['head', 0], ['photo', 350], ['link', 900]],
    'home-day': [['head', 0], ['list', 500], ['link', 900]],
    'home-foot': [['seal', 0], ['names', 350], ['links', 750]],
    'story-head': [['kicker', 0], ['title', 180], ['intro', 600]],
    'story-frame': [['album', 0]],
    'story-next': [['names', 0], ['links', 500]],
    'details-head': [['title', 0], ['date', 350]],
    'details-card': [['head', 0], ['row', 250], ['after', 900]],
    'details-venue': [['photo', 0], ['line', 600]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 300]],
    'rsvp-card': [['card', 0], ['title', 300], ['line', 650], ['form', 950]],
    'rsvp-closing': [['names', 0], ['links', 500]]
  },
  stagger: 200,
  batchGap: 380,
  arriveDelay: 160,
  leaves: { open: 7, arrive: 4, reply: 12 },     // gold leaf (GPT W2.15)
  slide: 900                                      // one story chapter
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
const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/* -- long names: [data-fit="n"] shrinks its type (CSS --fit) until each name fits its line and the block is at most n
   lines, never under MIN_NAME px (a long name then wraps — never cut). Measured again when the fonts arrive and on resize. */
const MIN_NAME = 30;
function fitAll() {
  $$('[data-fit]').forEach((el) => {
    el.style.removeProperty('--fit');
    el.classList.remove('wrap');
    const n = parseFloat(el.dataset.fit) || 2;
    const parts = $$('[data-field]', el);
    const base = parseFloat(getComputedStyle(el).fontSize) || 20;
    const kmin = Math.min(1, Math.max(0.45, MIN_NAME / base));
    const wide = () => parts.some((p) => Math.max(p.scrollWidth, p.getBoundingClientRect().width) > el.clientWidth + 1);
    const lines = () => el.getBoundingClientRect().height / (parseFloat(getComputedStyle(el).lineHeight) || base);
    let k = 1;
    while ((wide() || lines() > n + 0.3) && k > kmin) { k = Math.max(kmin, k - 0.03); el.style.setProperty('--fit', k.toFixed(3)); }
    if (wide()) el.classList.add('wrap');
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

/* -- gold leaf (GPT W2.15): flakes drift down from a point, turning in the light, and are gone */
const LEAVES = ['img/leaf1-160.webp', 'img/leaf2-160.webp', 'img/leaf3-160.webp'];
/** Spawns `count` flakes; false when none fall (reduced motion, no animation) — then no sound either. */
function leaves(count, from) {
  const layer = $('.accent-layer');
  if (!layer || reduce || !canAnimate || !count) return false;
  const W = innerWidth, H = innerHeight;
  for (let i = 0; i < count; i++) {
    const img = new Image(), s = 14 + Math.random() * 16;
    img.src = new URL(LEAVES[i % LEAVES.length], BASE).href; img.alt = ''; img.className = 'leaf';
    img.style.setProperty('--s', s + 'px');
    const x0 = (from ? from.x : Math.random() * W) + (Math.random() - 0.5) * (from ? 70 : 0), y0 = from ? from.y : -30;
    const drift = (Math.random() - 0.5) * W * 0.5, fall = H - y0 + 60, spin = (Math.random() - 0.5) * 540;
    const frames = [0, 0.25, 0.5, 0.75, 1].map((k) => ({
      transform: `translate(${x0 + drift * k + Math.sin(k * 7 + i) * 26}px,${y0 + fall * (k * k * 0.35 + k * 0.65)}px) rotate(${spin * k}deg) rotateY(${k * 720}deg)`,
      opacity: k < 0.8 ? 1 : 0
    }));
    if (from) frames[0].transform = `translate(${x0}px,${y0}px) scale(.3)`;
    layer.append(img);
    img.animate(frames, { duration: 3600 + Math.random() * 2200, delay: i * 90, easing: 'linear', fill: 'both' }).onfinish = () => img.remove();
  }
  return true;
}

/* -- the envelope */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const env = $('.env'), well = $('.card-well'), card = $('.env-card'), framed = $('.framed', card), seal = $('.env-seal'), E = MOTION.envelope;
  const moon = $('.night .sky-moon');
  if (/[?&]replay=1(&|$)/.test(location.search)) root.classList.remove('is-opened');
  let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
  const timers = [], anims = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  // the envelope leans towards the finger / pointer (a few degrees)
  if (!reduce) {
    const lean = (x, y) => { env.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg'); env.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg'); };
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
    if (withCard) { store(ARRIVE, '1'); framed.style.viewTransitionName = 'invite-card'; } else framed.style.viewTransitionName = 'none';
    if (crossDocVT || reduce || !canAnimate) { location.href = PAGES.home; return; }
    $('.opening').animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
    setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
  }
  // rise: a fixed clone of the seal flies from the valley to the moon's place in the sky; the moon fades in under it
  function rise() {
    if (!canAnimate || !moon) { seal.classList.add('is-gone'); return; }
    const a = seal.getBoundingClientRect(), b = moon.getBoundingClientRect();
    const fly = seal.cloneNode(true);
    fly.className = 'seal-fly';
    Object.assign(fly.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.append(fly);
    seal.classList.add('is-gone');
    const p = center(a), q = center(b), dx = q.x - p.x, dy = q.y - p.y, s = (b.width * 1.12) / a.width;
    const move = fly.animate([
      { transform: 'none', opacity: 1 },
      { transform: `translate(${dx * 0.18}px,${dy * 0.42}px) scale(${1 + (s - 1) * 0.35}) rotate(-10deg)`, opacity: 1, offset: 0.42 },
      { transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(-22deg)`, opacity: 1, offset: 0.86 },
      { transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(-24deg)`, opacity: 0 }
    ], { duration: E.rise[1] + 300, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    anims.push(move);
    move.onfinish = () => fly.remove();
    move.oncancel = () => fly.remove();
  }
  function fly() {
    well.classList.add('is-free');
    root.classList.add('is-reveal');
    if (!canAnimate) return;
    const r0 = card.getBoundingClientRect(), wr = well.getBoundingClientRect();
    const w = Math.min(innerWidth * 0.9, 460, Math.max(240, (innerHeight - 250) * 1.6926));
    const s = w / r0.width, cx = innerWidth / 2, cy = clamp(innerHeight * 0.52, 220, innerHeight - 200);
    const c = center(r0);
    well.style.transformOrigin = `${c.x - wr.left}px ${c.y - wr.top}px`;
    anims.push(well.animate([
      { transform: 'none' },
      { transform: `translate(${(cx - c.x) * 0.4}px,${(cy - c.y) * 0.3 - 18}px) rotate(2deg) scale(${1 + (s - 1) * 0.5})`, offset: 0.45 },
      { transform: `translate(${cx - c.x}px,${cy - c.y}px) rotate(0deg) scale(${s})` }
    ], { duration: E.reveal[1], easing: 'cubic-bezier(.35,.1,.2,1)', fill: 'forwards' }));
  }
  function play() {
    if (state !== 'closed') return;
    state = 'playing';
    if (reduce) { go(false); return; }
    env.style.setProperty('--rx', '0deg'); env.style.setProperty('--ry', '0deg');
    root.classList.add('is-opening');
    at(E.rise[0], rise);
    at(E.moon[0], () => { const r = moon?.getBoundingClientRect(); leaves(MOTION.leaves.open, r ? { x: r.left + r.width / 2, y: r.top + r.height * 0.6 } : null); });
    at(E.reveal[0], fly);
    at(E.bloom[0], () => { if (canAnimate) anims.push(card.animate([{ scale: '1' }, { scale: '1.03' }], { duration: E.bloom[1], easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' })); });
    at(E.go, () => { state = 'done'; go(true); });
  }
  function reset() {
    timers.splice(0).forEach(clearTimeout);
    anims.splice(0).forEach((a) => a.cancel());
    $$('.seal-fly').forEach((n) => n.remove());
    seal.classList.remove('is-gone');
    root.classList.remove('is-opening', 'is-opened', 'is-reveal');
    well.classList.remove('is-free');
    well.style.transformOrigin = '';
    framed.style.viewTransitionName = '';
    state = 'closed';
  }
  stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  $$('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
  $('[data-enter]')?.addEventListener('click', (e) => { e.preventDefault(); go(true); });
  $('.replay')?.addEventListener('click', () => { reset(); void stage.offsetWidth; requestAnimationFrame(play); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && state === 'playing') { reset(); state = 'done'; go(false); } });
  addEventListener('pageshow', (e) => {
    if (e.persisted && state !== 'closed') { reset(); root.classList.add('is-opened'); state = 'opened'; }
  });
}

/* -- home: a few flakes of gold leaf drift down past the portrait as the photograph lands in its arch */
function initHome() {
  if (!$('.page-home') || !root.classList.contains('from-envelope')) return;
  setTimeout(() => {
    const r = $('.sky-moon')?.getBoundingClientRect();
    if (leaves(MOTION.leaves.arrive, r ? { x: r.left + r.width / 2, y: r.top + r.height } : null)) sfx('leaf');
  }, 1000);
}

/* -- story: one chapter at a time over the water (buttons, dots, arrows, swipe); its numeral is a CSS counter */
function initSlides() {
  const box = $('.chapters'), slides = $$('[data-slide]'), prev = $('[data-slide-prev]'), next = $('[data-slide-next]');
  if (!box || slides.length < 2 || !prev || !next) return;
  const dots = $$('[data-slide-go]'), last = slides.length - 1, label = $('.chapter-label'), count = $('.slide-count');
  let active = clamp(Number(location.hash.replace('#chapter-', '')) - 1 || 0, 0, last);
  box.classList.add('is-carousel');
  $('.slide-controls').hidden = false;
  count?.style.setProperty('--n', String(slides.length));
  // first: no #chapter-1 is written into a plain /story address (the browser would scroll to it on load)
  function layout(first = false) {
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === active);
      s.setAttribute('aria-hidden', String(i !== active));
      s.inert = i !== active;
    });
    dots.forEach((b, i) => b.setAttribute('aria-pressed', String(i === active)));
    label?.style.setProperty('--i', String(active + 1));
    count?.style.setProperty('--i', String(active + 1));
    prev.disabled = active === 0; next.disabled = active === last;
    if (!first || location.hash) history.replaceState(null, '', '#chapter-' + (active + 1));
  }
  function goTo(i) {
    i = clamp(i, 0, last);
    if (i === active) return;
    active = i; sfx('ripple'); layout();
  }
  layout(true);
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
  });
  let sx = null, sy = 0;
  box.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  box.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(active + (dx < 0 ? 1 : -1));
  });
  box.addEventListener('pointercancel', () => { sx = null; });
  addEventListener('hashchange', () => { const n = Number(location.hash.replace('#chapter-', '')) - 1; if (Number.isInteger(n) && n >= 0 && n <= last) goTo(n); });
}

/* -- the evening: each moment gets its gold-foil icon, chosen from the buyer's own label (first match wins); CSS gives
   the first four rows rings · coupes · candelabra · gramophone when nothing matches */
const ICONS = [['rings', /ceremon|vow|wedding|i do|chapel|church|blessing/i], ['toast', /cocktail|toast|drink|champagne|aperitif|prosecco|welcome|reception drinks/i],
  ['dinner', /dinner|supper|meal|lunch|brunch|feast|banquet|candle/i], ['dance', /danc|party|music|band|\bdj\b|gramophone/i],
  ['boat', /boat|launch|ferry|cruise|arriv|gather|shuttle|transport|water taxi|depart|farewell/i], ['dress', /dress|attire|black tie/i]];
function initIcons() {
  $$('.schedule li').forEach((li) => {
    const icon = $('.sched-icon', li);
    if (!icon) return;
    const text = $$('h3, p', li).map((n) => n.textContent).join(' ');
    const hit = ICONS.find(([, re]) => re.test(text));
    if (hit) icon.style.setProperty('--i', `url(${new URL(`img/icon-${hit[0]}-128.webp`, BASE).href})`);
  });
}

/* -- the evening: the moon-path thread lights down the programme as the guest scrolls */
function initThread() {
  const list = $('.schedule');
  if (!list || reduce || !list.children.length) return;
  const items = $$('li', list);
  let queued = false;
  const update = () => {
    queued = false;
    const r = list.getBoundingClientRect();
    const p = clamp((innerHeight * 0.85 - r.top) / Math.max(1, r.height), 0, 1);
    list.style.setProperty('--draw', p.toFixed(3));
    items.forEach((li) => li.classList.toggle('lit', (li.offsetTop + 20) / Math.max(1, r.height) <= p + 0.002));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

/* -- RSVP: when the reply is sent, the moon seal comes down onto the card, the moon brightens and gold leaf drifts */
function initReply() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    if (st === 'ready') root.classList.remove('is-sealing');
    if (st !== 'success' || !$('.press-seal')) return;
    root.classList.remove('is-sealing'); void root.offsetWidth; root.classList.add('is-sealing');
    if (reduce) return;
    setTimeout(() => { sfx('press'); const r = $('.press-seal').getBoundingClientRect(); leaves(MOTION.leaves.reply, { x: r.left + r.width / 2, y: r.top }); }, 620);
    setTimeout(() => sfx('clink'), 1100);
    $('.press-seal').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  initSlides();
  initIcons();
  initThread();
  initReply();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
