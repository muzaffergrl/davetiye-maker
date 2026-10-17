/* Sky Lantern Festival — shared behaviour of the five pages. Personal content is rendered by the platform (data-field,
   data-text, data-photo); this script never writes it. Page addresses come from #site-data (data.pages) only.
   Opening (docs/24 row 31 — a lantern lift-off; interim pieces, build_images.py): the lantern in the cupped hands kindles
   and its halo blooms, the hands open and sink away, the lantern rises up and out of the screen with a slow sway while
   the sky, the star dust and three distant lanterns move at their own speeds (parallax), and in the light it leaves the
   rice-paper card glows into view and comes forward to home (view transition invite-card). The CSS keyframes in site.css
   (".is-opening …") use the same numbers as MOTION.envelope. */
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },   // + ':<slug>'; the <head> scripts use the same keys
  envelope: {
    hint: [0, 300],         // "Tap to open" fades
    head: [0, 500],         // kicker, names and date drift up and away
    kindle: [0, 600],       // the lantern kindles: the lit layer over the dark one
    halo: [0, 1200],        // its warm halo blooms
    hands: [700, 900],      // the hands open and sink away
    rise: [900, 2200],      // the lantern rises out of the screen (translate + scale), swaying
    sky: [900, 2600],       // parallax: the sky slides down slowly, the star dust faster
    far: [1000, 2400],      // three distant lanterns rise past, staggered (+0, +260, +520 ms)
    card: [2000, 1100],     // the card glows into view in the light the lantern leaves
    forward: [3200, 400],   // the card comes forward
    go: 3700,               // to home (view transition)
    fadeOut: 300            // without a cross-document view transition
  },
  scenes: {                 // scene → [[step, delay ms], …] — in order, never all at once
    'home-hero': [['more', 700]],     // the card is the view-transition target and never waits; only the button enters
    'home-invite': [['host', 0], ['title', 200], ['names', 480], ['date', 820], ['venue', 1080], ['reply', 1340], ['count', 1560], ['calendar', 1760]],
    'home-teasers': [['head', 0], ['photo', 320], ['link', 1500]],
    'home-day': [['head', 0], ['list', 380], ['link', 700]],
    'home-foot': [['seal', 0], ['names', 300], ['links', 700]],
    'story-head': [['kicker', 0], ['title', 160], ['intro', 520]],
    'story-frame': [['frame', 0]],
    'story-next': [['names', 0], ['links', 300]],
    'details-head': [['date', 0], ['title', 200], ['venue', 520]],
    'details-card': [['programme', 0], ['row', 260], ['calendar', 900], ['venue', 400]],
    'details-notes': [['note', 0]],
    'details-faq': [['head', 0], ['item', 250]],
    'rsvp-card': [['names', 0], ['title', 180], ['wait', 520], ['cta', 800]],
    'rsvp-closing': [['seal', 0], ['names', 300], ['links', 650]]
  },
  stagger: 320,             // the lantern trail: one photo / one programme lantern every 320 ms
  batchGap: 360,
  arriveDelay: 200,
  release: 4600             // the reply's lantern (4.2 s rise) — then its layer goes
};

(() => {
'use strict';
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (q) => document.querySelector(q), $$ = (q) => [...document.querySelectorAll(q)];
const asset = (f) => new URL(f, document.currentScript ? document.currentScript.src : location.href).href;
const FAR = asset('img/lantern_far-144.webp');
let SITE = null;
try { SITE = JSON.parse($('#site-data')?.textContent || 'null'); } catch (e) { SITE = null; }
const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
const OPENED = MOTION.storage.opened + KEY, ARRIVE = MOTION.storage.arrive + KEY;
const store = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } };
const crossDocVT = 'onpageswap' in window && Boolean(document.startViewTransition);

/* -- long names: one line each while they fit, then smaller, then they wrap (never cut) */
function fitNames() {
  $$('.names').forEach((el) => {
    el.style.fontSize = '';
    const parts = [...el.querySelectorAll('[data-field]')];
    const long = parts.some((n) => n.textContent.length > 14);
    el.classList.toggle('long-names', long);
    parts.forEach((n) => { n.style.whiteSpace = 'nowrap'; });
    const min = el.closest('.hero-card') ? 30 : 26;
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
    if (!instant) {
      const delay = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
      n.style.transitionDelay = delay + 'ms';
      n.style.setProperty('--d', delay + 'ms');      // the kindle light and the riser follow their own step
    }
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

/* -- GPT card (build_images.py: card_small with its window; the generated CSS block stretches nothing — the card keeps
   GPT's proportions, the portrait sits in the window and the text on the plain paper under it): when the text is taller
   than that paper (40-character names, a short phone), the text block is zoomed down instead of letting it run onto the
   window or past the card. The interim card (plain paper, object-fit cover) is left alone. */
function fitCards() {
  $$('.hero-copy, .stage .card-copy').forEach((copy) => {
    const card = copy.parentElement, img = card.querySelector('.card-img');
    if (!img || getComputedStyle(img).objectFit !== 'fill') return;
    const kids = [...copy.children].filter((n) => !n.matches('.hero-photo, .card-photo') && n.getClientRects().length);
    if (!kids.length) return;
    const ar = getComputedStyle(card).aspectRatio.split('/').map(Number);
    const H = ar.length === 2 && ar[1] ? card.clientWidth * ar[1] / ar[0] : card.clientHeight;
    const cs = getComputedStyle(copy);
    const room = H - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const tall = () => kids[kids.length - 1].getBoundingClientRect().bottom - kids[0].getBoundingClientRect().top;
    let k = 1;
    copy.style.setProperty('--k', '1');
    for (let i = 0; i < 12 && tall() > room && k > 0.42; i++) { k = Math.max(0.42, k * Math.min(0.95, room / tall())); copy.style.setProperty('--k', k.toFixed(3)); }
  });
}

/* -- the stage fits the screen: long names (40 characters, 4–5 lines) on a short phone would push the lantern and
   "Tap to open" below it; the stage shrinks until the hint is on screen */
function fitStage() {
  const stage = $('.stage'), hint = $('.opening-actions');
  if (!stage || !hint || root.classList.contains('is-opened')) return;
  stage.style.removeProperty('--obj');
  let w = stage.getBoundingClientRect().width;
  for (let i = 0; i < 12 && w > 140 && hint.getBoundingClientRect().bottom > innerHeight; i++) {
    w = Math.max(140, w * 0.92);
    stage.style.setProperty('--obj', w.toFixed(1) + 'px');
  }
}

/* -- the lantern (index) */
function initEnvelope() {
  const stage = $('.stage');
  if (!stage) return;
  const card = $('.stage .card'), E = MOTION.envelope;
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
    fitStage();
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

/* -- story gallery: each photo opens in a native <dialog>; arrows and Escape, no auto-rotation */
function initGallery() {
  const box = $('.lightbox'), shots = $$('[data-gallery-open]');
  if (!box || !shots.length || !box.showModal) return;
  const caption = box.querySelector('.lightbox-caption'), count = box.querySelector('[data-gallery-count]');
  const image = Object.assign(document.createElement('img'), { alt: '', decoding: 'async' });
  let placed = false;
  let active = 0;
  function show(n) {
    active = (n + shots.length) % shots.length;
    const src = shots[active].querySelector('img');
    if (!placed) { caption.before(image); placed = true; }
    image.src = src.currentSrc || src.src;
    image.alt = src.alt;
    caption.textContent = shots[active].closest('figure').querySelector('figcaption [data-field]').textContent.trim();
    count.textContent = (active + 1) + ' / ' + shots.length;
  }
  shots.forEach((b, i) => b.addEventListener('click', () => { show(i); box.showModal(); }));
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.querySelector('[data-gallery-prev]').addEventListener('click', () => show(active - 1));
  box.querySelector('[data-gallery-next]').addEventListener('click', () => show(active + 1));
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); }
  });
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
}

/* -- a reply sent: the halo brightens (CSS, html[data-rsvp-replied]) and one lantern is released from under the
   button and rises up the screen with a slow sway. A layer of its own, removed when it has gone. */
function releaseLantern() {
  if (reduce || $('.accent-layer')) return;
  const layer = Object.assign(document.createElement('div'), { className: 'accent-layer' });
  layer.setAttribute('aria-hidden', 'true');
  const img = Object.assign(document.createElement('img'), { className: 'wish', src: FAR, alt: '' });
  layer.append(img);
  document.body.append(layer);
  setTimeout(() => layer.remove(), MOTION.release);
}

function boot() {
  document.addEventListener('rsvp:state', (e) => {
    const st = e.detail && e.detail.state;
    if (st === 'success' || st === 'ready') root.toggleAttribute('data-rsvp-replied', st === 'success');
    if (st === 'success') releaseLantern();
  });
  const fit = () => { fitNames(); fitCards(); fitStage(); };
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
  initEnvelope();
  initScenes();
  initCountdown();
  initGallery();
  root.dataset.js = 'ready';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
