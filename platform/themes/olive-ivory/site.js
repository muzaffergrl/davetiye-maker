/* site.js — shared behaviour of every page of the Olive & Ivory theme (design 01, platform theme, G401).
 *
 * Content: the platform writes every personal value into the HTML on the server (engine markers, platform/README.md)
 * and injects <script type="application/json" id="site-data"> = {slug, theme, variant, page, preview, pages, derived}
 * (no content record). With #site-data present this file NEVER writes personal text; it only reads it (countdown
 * target, the page map for navigation, the slug for per-site session keys). DEV_CONTENT (below) is used only when the
 * theme files are opened without the platform (static server): then devRender() fills the same markers.
 *
 * This design's own motion (docs/11 §7.3, §8 — catalogue sentence for design 01):
 *   opening  "On tap, the lace-edged flap peels up on its hinge carrying the oval seal and its tucked olive sprig with
 *            it, and the ivory card glides up out of the pocket while two olive leaves float across the screen."
 *            → the wax seal gives a little as it lets go (closure), the flap + seal turn together on the hinge (one
 *            .env-cflap-wrap, one rotateX) to edge-on, the open flap (lined inside) takes over and lies back (flap),
 *            the card glides up out of the pocket (rise) while two olive leaves (accent_1 × 2) float across left →
 *            right, the card comes forward and flies to home as the hero card (view transition).
 *   story    the three gold-bordered cards fan out like a hand of cards: each card starts gathered toward the middle
 *            line, upright, and turns out into its tilt (preset "fan"), its caption is written under it.
 *   accents  open: 2 olive leaves across · arrive: 3 jasmine blossoms drifting down · closing (RSVP): 2 blossoms + 1 leaf.
 * Markup hooks (shared platform contract with every theme):
 *   [data-scene="name"]  a group that enters when scrolled into view (plan: MOTION.scenes[name])
 *   [data-step="key"]    an element inside a scene; its delay = MOTION.scenes[name][key]
 *   [data-a="preset"]    how it enters (site.css: rise, rise-lg, bloom, fade, write, unfurl, drift-tl, drift-br, fan)
 *   [data-i="n"]         optional extra stagger inside one step; rows repeated by the platform stagger by their index
 */
const MOTION = {
  // sessionStorage keys (+ ":<slug>" on the platform) — the tiny inline <head> scripts use the same keys
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // index opening (kapaklı zarf, docs/11 §7.2 / §7.3): [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 300],      // "Tap to open" fades
    tug:     [0, 320],      // the envelope gives under the finger
    closure: [0, 240],      // the wax seal lifts a hair as it lets go (first motion < 250 ms)
    head:    [200, 640],    // "You are invited" + names rise away
    lift:    [300, 660],    // flap + seal (+ sprig) peel up on the hinge, 0° → 90° (edge-on), together
    open:    [300, 420],    // under the lifting flap the closed body gives way to the open body (lining + pocket)
    flap:    [960, 780],    // the open flap (olive-sprig lining) takes over at −90° and lies back to 0°
    rise:    [1540, 1380],  // the ivory card glides up out of the pocket
    forward: [2980, 720],   // the card comes in front of the envelope and settles
    accents: 1380,          // two olive leaves float across
    go:      3900,          // navigate to home (the card morphs into the home hero card)
    fadeOut: 420            // fallback fade when cross-document view transitions are unsupported
  },

  // page entrances: scene → [[step, delay ms], …] — deliberate order, never all at once
  scenes: {
    'home-hero':      [['decor', 0], ['card', 120], ['names', 700], ['date', 1500], ['venue', 1720], ['countdown', 1980], ['cta', 2300]],
    'home-invite':    [['card', 0], ['host', 600], ['name1', 820], ['amp', 1380], ['name2', 1520], ['request', 2100], ['date', 2380], ['venue', 2640], ['cta', 2900], ['cal', 3120]],
    'home-more':      [['title', 0], ['v1', 260], ['s1', 640], ['v2', 860], ['s2', 1240], ['v3', 1460]],
    'home-foot':      [['decor', 0], ['sign', 140], ['links', 740]],
    'story-head':     [['decor', 0], ['title', 140], ['kicker', 1050], ['lede', 1350]],
    'story-card':     [['card', 0], ['caption', 760]],
    'story-next':     [['decor', 0], ['sprig', 200], ['link', 600]],
    'details-card':   [['decor', 0], ['kicker', 140], ['card', 360], ['title', 900], ['row', 1500], ['cal', 2500]],
    'details-venue':  [['photo', 0], ['body', 520], ['dress', 900], ['action', 1120]],
    'details-block':  [['sprig', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq':    [['sprig', 0], ['title', 300], ['item', 950]],
    'details-next':   [['decor', 0], ['link', 300]],
    'rsvp-card':      [['decor', 0], ['card', 140], ['title', 760], ['kicker', 1460], ['deadline', 1620], ['button', 1900], ['wait', 2200], ['love', 2420], ['sign', 2720], ['seal', 2980]],
    'rsvp-form':      [['form', 0]],
    'rsvp-closing':   [['decor', 0], ['title', 220], ['line', 900], ['meta', 1150]]
  },
  stagger: 190,          // data-i / repeated rows spacing inside one step
  batchGap: 360,         // scenes entering together play in sequence
  arriveDelay: 700,      // home hero waits for the card morph when arriving from the envelope

  // particles (GPT accents only): moment → groups; each group one kind of accent (docs/11 §8)
  accents: {
    open:    [{ file: 'img/accent_1-200.webp', count: 2, path: 'across', origin: 'left', dur: [3900, 4600], size: [58, 74], spread: 520 }],
    arrive:  [{ file: 'img/accent_3-200.webp', count: 3, path: 'fall', origin: 'top', dur: [6200, 7800], size: [20, 28], spread: 1800 }],
    closing: [{ file: 'img/accent_3-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 8000], size: [20, 26], spread: 1600 },
              { file: 'img/accent_1-200.webp', count: 1, path: 'across', origin: 'right', dur: [5200, 5200], size: [52, 52], spread: 0 }]
  }
};

/* Envelope card path (percent of the card's own height), from img/manifest.json stage.card_path:
   the card waits with its top just inside the lining window (stage.parts.card, top 49.127 %); out = its bottom corners
   still tucked behind the pocket edge at the card's corners (pocket_edge_at_card_corners) → translateY(−80.001 %);
   front = in front of the envelope, its top 6 % of a card above the envelope's top edge → translateY(−12.685 %) × 1.06. */
const ENVELOPE_GEOMETRY = { out: 'translateY(-80.001%)', front: 'translateY(-12.685%) scale(1.06)' };

/* DEV_CONTENT — used ONLY when the theme is opened without the platform (no #site-data): fictional demo record
 * = content.demo.json (= collections/01_Olive_Ivory/content.demo.json). On the platform the content comes from the site. */
const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Avery', full_name: 'Avery Louise' }, { display_name: 'Jordan', full_name: 'Jordan Samuel' }],
  name_display: 'Avery & Jordan', initials: 'A & J', host_line: 'Together with our families',
  date: '2027-06-12', ceremony_time: '16:00', timezone: 'America/Los_Angeles',
  venue: { name: 'The Willow Grove Estate', city: 'Napa', region: 'California', country: 'USA', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:00', location: 'The Garden Terrace' },
    { label: 'Cocktail Hour', time: '17:00', location: 'The Olive Courtyard' },
    { label: 'Reception', time: '18:30', location: 'The Grand Ballroom' }
  ],
  dress_code: 'Formal Attire',
  rsvp: { deadline: '2027-05-15', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: false, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Slow lunches, golden evenings and one walk through the olive grove led us to',
    items: [{ caption: 'Our first lunch' }, { caption: 'In the olive grove' }, { caption: 'Simply forever' }]
  }
};


(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
  // theme assets referenced from JS resolve against this file (/themes/<theme>/site.js), not the page URL (/<slug>/…)
  const BASE = (document.currentScript && document.currentScript.src) || document.baseURI;
  const asset = (p) => new URL(p, BASE).href;

  /* ------------------------------------------------------------------ data: platform (#site-data) or dev fallback */
  function readSiteData() {
    const el = document.getElementById('site-data');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }
  const SITE = readSiteData();
  const CONTENT = SITE ? {} : DEV_CONTENT;   // the platform never sends the record (site-data has no content)
  const PAGES = (SITE && SITE.pages) || { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' };
  const KEY = SITE && SITE.slug ? ':' + SITE.slug : '';
  const OPENED = MOTION.storage.opened + KEY;
  const ARRIVE = MOTION.storage.arrive + KEY;

  const store = {
    get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* private mode: no memory */ } },
    del(k) { try { window.sessionStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ------------------------------------------------------------------ accents (GPT accent parts, MOTION.accents) */
  function flightPath(path, origin, W, H, s, i) {
    const kf = [];
    const N = 10;
    if (path === 'across') {
      // a leaf floating across: a slow, slightly rising glide with a gentle wave, turning and fluttering (rotateY)
      const ltr = origin !== 'right';
      const y0 = H * (0.30 + 0.22 * i + rand(-0.04, 0.04));
      const lift = rand(-0.10, -0.04) * H, amp = rand(14, 26), ph = rand(0, 6.28);
      const r0 = rand(-24, -6), spin = rand(30, 70) * (ltr ? 1 : -1);
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = ltr ? -s * 1.3 + (W + s * 2.6) * t : W + s * 0.3 - (W + s * 2.6) * t;
        const y = y0 + lift * t + Math.sin(t * 6.28 * 1.15 + ph) * amp;
        const ry = Math.sin(t * 9.4 + ph) * 48;
        kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + spin * t + Math.sin(t * 7 + ph) * 10).toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`,
          opacity: k === 0 ? 0 : (k === N ? 0 : 0.96), offset: t });
      }
      return kf;
    }
    // 'fall' (from the top) and 'rise' (from the bottom): a soft drift with sway
    const down = path !== 'rise';
    const x0 = rand(0.06, 0.94) * W, drift = rand(-0.18, 0.18) * W, sway = rand(12, 30), ph = rand(0, 6.28);
    const r0 = rand(0, 360), r1 = r0 + rand(-200, 200);
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const x = x0 + drift * t + Math.sin(t * 6.28 + ph) * sway;
      const y = down ? -s - 10 + (H + 2 * s + 20) * t : H + s + 10 - (H + 2 * s + 20) * t;
      kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * t).toFixed(1)}deg) rotateX(${(Math.sin(t * 8 + ph) * 50).toFixed(1)}deg)`,
        opacity: k === 0 ? 0 : (k === N ? 0.6 : 0.95), offset: t });
    }
    return kf;
  }
  function accents(moment) {
    const groups = MOTION.accents[moment];
    if (reduce || !groups || !Element.prototype.animate) return;
    let layer = document.querySelector('.accent-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'accent-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    const W = window.innerWidth, H = window.innerHeight;
    groups.forEach((g) => {
      for (let i = 0; i < g.count; i++) {
        const img = new Image();
        img.src = asset(g.file);
        img.alt = '';
        img.decoding = 'async';
        const s = rand(g.size[0], g.size[1]);
        img.style.width = s.toFixed(1) + 'px';
        layer.appendChild(img);
        const a = img.animate(flightPath(g.path, g.origin, W, H, s, i), {
          duration: rand(g.dur[0], g.dur[1]), delay: i * 420 + rand(0, g.spread || 0), easing: 'linear', fill: 'both' });
        a.onfinish = () => img.remove();
      }
    });
  }

  /* ------------------------------------------------------------------ scenes (sequential entrances) */
  function stepIndex(n) {
    if (n.dataset.i !== undefined) return Number(n.dataset.i) || 0;
    const item = n.dataset.repeatItem;               // "schedule.2" — set by the platform's data-repeat
    return item ? Number(item.split('.').pop()) || 0 : 0;
  }
  function reveal(scene, base, instant) {
    const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
    scene.querySelectorAll('[data-step]').forEach((n) => {
      if (n.closest('[data-scene]') !== scene) return;
      if (!instant) {
        const t = base + (plan.get(n.dataset.step) || 0) + stepIndex(n) * MOTION.stagger;
        n.style.transitionDelay = t + 'ms';
        n.addEventListener('transitionend', (e) => { if (e.target === n) n.classList.add('done'); });
      } else {
        n.classList.add('done');
      }
      n.classList.add('in');
    });
  }
  function initScenes() {
    const scenes = Array.from(document.querySelectorAll('[data-scene]'));
    if (!scenes.length) return;
    if (reduce || !('IntersectionObserver' in window)) { scenes.forEach((s) => reveal(s, 0, true)); return; }
    const arrived = root.classList.contains('from-envelope');
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).map((e) => e.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      vis.forEach((s, i) => {
        io.unobserve(s);
        let base = i * MOTION.batchGap;
        if (arrived && s.dataset.scene === 'home-hero') base += MOTION.arriveDelay;
        reveal(s, base, false);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    scenes.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------ countdown */
  function zoneOffset(ts, tz) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit',
      day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const p = {};
    f.formatToParts(new Date(ts)).forEach((x) => { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ts;
  }
  function zonedToUtc(date, time, tz) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const wall = Date.UTC(y, m - 1, d, hh, mm);
    let t = wall;
    for (let i = 0; i < 3; i++) t = wall - zoneOffset(t, tz);
    return t;
  }
  function countdownTarget() {
    // platform: computed on the server (date + ceremony_time in the record's IANA zone)
    if (SITE) {
      const t = SITE.derived && Date.parse(SITE.derived.countdown_target_utc);
      return Number.isFinite(t) ? t : null;
    }
    try { return zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); }
    catch (e) { return Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }   // no Intl zone support: device time
  }
  function initCountdown() {
    document.querySelectorAll('[data-countdown]').forEach((box) => {
      const target = countdownTarget();
      if (target === null) { box.hidden = true; return; }
      box.dataset.targetUtc = new Date(target).toISOString();
      const cells = {};
      box.querySelectorAll('[data-unit]').forEach((el) => { cells[el.dataset.unit] = el; });
      const pad = (n) => (n < 10 ? '0' + n : String(n));
      const dayLen = 86400000;
      function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
          box.classList.add('is-done');
          const today = -diff < dayLen / 2;   // ceremony started less than 12 h ago
          box.querySelectorAll('.cd-done').forEach((p) => { p.hidden = (p.dataset.when === 'today') !== today; });
          return false;
        }
        const s = Math.floor(diff / 1000);
        cells.days.textContent = Math.floor(s / 86400);
        cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
        cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
        cells.seconds.textContent = pad(s % 60);
        return true;
      }
      if (tick()) { const h = setInterval(() => { if (!tick()) clearInterval(h); }, 1000); }
    });
  }

  /* ------------------------------------------------------------------ links without a URL yet (preview only) */
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2800);
  }
  function initPlaceholders() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-url-missing]');
      if (!a) return;
      e.preventDefault();
      toast(a.dataset.pending || document.body.dataset.pending || '');
    });
  }

  /* ------------------------------------------------------------------ long names (envelope page + home hero)
     The names line is set large; long names (up to 40 + 40 characters) would push the envelope and "Tap to open" off a
     phone screen, or fill the whole home hero. Shrink the line (--names-scale) until it takes at most two lines on the
     envelope page (three in the hero) and a modest share of the screen. Without JS the CSS size stays (demo names fit). */
  function fitNames() {
    const targets = [['.env-head .names', 2.15, 0.22], ['.hero .names', 3.2, 0.3]]
      .map(([sel, maxLines, maxShare]) => [document.querySelector(sel), maxLines, maxShare]).filter(([el]) => el);
    if (!targets.length) return;
    const run = () => targets.forEach(([h1, maxLines, maxShare]) => {
      let scale = 1;
      h1.style.setProperty('--names-scale', '1');
      for (let i = 0; i < 14 && scale > 0.4; i++) {
        const h = h1.getBoundingClientRect().height;
        const lines = h / (parseFloat(getComputedStyle(h1).fontSize) * 1.04);
        if (lines <= maxLines && h <= window.innerHeight * maxShare) break;
        scale -= 0.06;
        h1.style.setProperty('--names-scale', scale.toFixed(2));
      }
    });
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
  }

  /* ------------------------------------------------------------------ envelope (index page) */
  function initEnvelope() {
    const page = document.querySelector('.env-page');
    if (!page) return;
    const q = (s) => page.querySelector(s);
    const stage = q('.stage');
    const el = {
      env: q('.env'), wrap: q('.env-cflap-wrap'), closure: q('.closure'), closed: q('.env-closed'), flap: q('.env-flap'),
      body: q('.env-body'), pocket: q('.env-pocket'), slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
    };
    const E = MOTION.envelope;
    const replay = /[?&]replay=1(&|$)/.test(location.search);
    if (replay) root.classList.remove('is-opened');
    let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
    const timers = [];

    function prefetchHome() {
      if (document.querySelector('link[data-prefetch]')) return;
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = PAGES.home; l.dataset.prefetch = '1';
      document.head.appendChild(l);
    }
    if ('requestIdleCallback' in window) requestIdleCallback(prefetchHome, { timeout: 2500 }); else setTimeout(prefetchHome, 1500);

    function go(withCard) {
      store.set(OPENED, '1');
      if (withCard) store.set(ARRIVE, '1');
      else el.card.style.viewTransitionName = 'none';   // skip: no card morph out of a closed envelope
      if (crossDocVT || reduce) { location.href = PAGES.home; return; }
      // fallback: fade the scene into the backdrop, home fades in on arrival
      page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
      const layer = document.querySelector('.accent-layer');
      if (layer) layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
      setTimeout(() => { location.href = PAGES.home; }, E.fadeOut);
    }

    const A = (node, kf, [delay, duration], easing, fill) =>
      node.animate(kf, { delay, duration, easing: easing || 'cubic-bezier(.22,.61,.36,1)', fill: fill || 'both' });

    function play() {
      if (state !== 'closed') return;
      state = 'playing';
      prefetchHome();
      if (reduce || !Element.prototype.animate) { go(false); return; }
      A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
      A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .4 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
      // the wax lets go: a hair of lift before the flap carries it away
      A(el.closure, [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-1.2%) scale(1.035)' }], E.closure, 'cubic-bezier(.3,.7,.4,1)', 'forwards');
      A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
      // flap + seal + sprig peel up on the hinge as ONE piece (one wrapper, one rotation), toward the viewer, to edge-on
      A(el.wrap, [
        { opacity: 1, transform: 'perspective(950px) rotateX(0deg)', filter: 'brightness(1)' },
        { opacity: 1, transform: 'perspective(950px) rotateX(14deg)', filter: 'brightness(1.01)', offset: .3 },
        { opacity: 1, transform: 'perspective(950px) rotateX(89deg)', filter: 'brightness(.84)', offset: .995 },
        { opacity: 0, transform: 'perspective(950px) rotateX(90deg)', filter: 'brightness(.84)' }
      ], E.lift, 'cubic-bezier(.45,.05,.7,.55)');
      // under the lifting flap: the closed body gives way to the open body (lining) and its front pocket
      A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
      // the open flap takes over at 90°: from edge-on (−90°) it lies back, showing its olive-sprig lining
      A(el.flap, [
        { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)', filter: 'brightness(.9)' },
        { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)', filter: 'brightness(1)' }
      ], E.flap, 'cubic-bezier(.2,.7,.3,1)');
      timers.push(setTimeout(() => accents('open'), E.accents));
      A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.42,0,.18,1)');
      timers.push(setTimeout(() => {
        // the card is out of the pocket: bring it in front of the envelope
        el.slot.style.clipPath = 'none';
        el.slot.style.zIndex = '5';
        A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: ENVELOPE_GEOMETRY.front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
      }, E.forward[0]));
      timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
    }

    // cancel only the opening's script animations (keep CSS ones such as the hint breathing)
    function cancelScripted() {
      page.getAnimations({ subtree: true }).concat(page.getAnimations())
        .filter((a) => !(window.CSSAnimation && a instanceof CSSAnimation))
        .forEach((a) => a.cancel());
    }
    function clearOpening() {
      timers.splice(0).forEach(clearTimeout);
      cancelScripted();
      el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
      el.card.style.viewTransitionName = '';
      const layer = document.querySelector('.accent-layer');
      if (layer) layer.remove();
    }
    function reset() {
      clearOpening();
      root.classList.remove('is-opened');
      state = 'closed';
    }

    stage.addEventListener('click', () => { if (state === 'closed') play(); else if (state === 'opened') go(true); });
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); }
    });
    document.querySelectorAll('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); go(false); }));
    const rep = q('.replay');
    if (rep) rep.addEventListener('click', () => { reset(); requestAnimationFrame(() => play()); });
    const enter = q('[data-enter]');
    if (enter) enter.addEventListener('click', (e) => { e.preventDefault(); go(true); });

    // back/forward cache: the page comes back exactly as it was left (card out) — offer replay instead of trapping
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && state !== 'closed') {
        clearOpening();
        root.classList.add('is-opened');
        state = 'opened';
      }
    });
  }

  /* ------------------------------------------------------------------ boot */
  function boot() {
    // the theme files opened without the platform are a design preview: placeholder labels show, as in the panel
    if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
    // RSVP page: once a reply is sent, the closing section hides its generic thank-you (site.css)
    document.addEventListener('rsvp:state', (e) => {
      const st = e.detail && e.detail.state;
      if (st === 'success') root.setAttribute('data-rsvp-replied', '');
      else if (st === 'ready') root.removeAttribute('data-rsvp-replied');
    });
    fitNames();
    initEnvelope();
    initScenes();
    initCountdown();
    initPlaceholders();
    if (root.classList.contains('from-envelope')) setTimeout(() => accents('arrive'), 300);
    const closing = document.querySelector('[data-accents="closing"]');
    if (closing && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); accents('closing'); } }, { threshold: .35 });
      io.observe(closing);
    }
    root.dataset.js = 'ready';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();


  /* dev fallback for the RSVP form: without the platform (/rsvp/form.js + #site-data) nothing may be posted */
  function devRsvp() {
    document.querySelectorAll('form[data-rsvp-form]').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      const scope = form.closest('[data-rsvp]') || document;
      scope.querySelectorAll('[data-rsvp-state]').forEach((p) => { p.hidden = p.dataset.rsvpState !== 'preview'; });
    }));
  }

  /* ================================================================== dev fallback (no platform)
   * Opening the theme files from a static server: fill the platform markers in the browser so the design can be
   * previewed. Mirrors platform/lib/theme/engine.ts closely enough for a preview (not a security boundary: values
   * are written with textContent / attributes only). Never runs on the platform (#site-data is always present). */
  function devRender(content) {
    const PHOTO_SOURCES = { hero_portrait: 'media.hero_portrait', story_1: 'media.memory_photos.0',
      story_2: 'media.memory_photos.1', story_3: 'media.memory_photos.2', venue: 'media.venue_image' };   // = theme.json
    const view = JSON.parse(JSON.stringify(content));
    if (view.venue) {
      const join = (a) => a.filter((x) => typeof x === 'string' && x.trim()).join(', ');
      view.venue.city_region = join([view.venue.city, view.venue.region]);
      view.venue.city_region_country = join([view.venue.city, view.venue.region, view.venue.country]);
    }
    try { view.countdown_target_utc = new Date(zonedToUtc(view.date, view.ceremony_time, view.timezone)).toISOString(); } catch (e) { /* none */ }
    const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), view);
    const present = (v) => !(v == null || v === false || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length));
    const abs = (p, scope) => (p.startsWith('.') ? (scope ? scope + p : p.slice(1)) : p);
    const fmt = (v, f, path) => {
      if (v == null || typeof v === 'object') return '';
      v = String(v);
      const generic = path.replace(/\.\d+(?=\.|$)/g, '.*');
      if (!f) f = ['date', 'rsvp.deadline'].includes(generic) ? 'date' : ['ceremony_time', 'schedule.*.time'].includes(generic) ? 'time' : 'raw';
      if (/^\d{4}-\d{2}-\d{2}$/.test(v) && f !== 'raw' && f !== 'time') {
        const d = new Date(v + 'T12:00:00Z');
        const o = { weekday: { weekday: 'long' }, month: { month: 'long' }, day: { day: 'numeric' }, year: { year: 'numeric' },
          'date-long': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } }[f] || { month: 'long', day: 'numeric', year: 'numeric' };
        return d.toLocaleDateString('en-US', Object.assign({ timeZone: 'UTC' }, o));
      }
      if (/^\d{2}:\d{2}$/.test(v) && f === 'time') {
        const [h, m] = v.split(':').map(Number);
        return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
      }
      return v;
    };
    const fill = (tpl, scope) => tpl.replace(/\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g, (_m, p, f) => fmt(get(abs(p, scope)), f, abs(p, scope)));
    const photoState = (img, url) => {
      const state = url ? 'user' : 'placeholder';
      if (url) { img.removeAttribute('srcset'); img.src = url; }
      img.dataset.photoState = state;
      const slot = img.closest('[data-slot]');
      if (slot) slot.dataset.photoState = state;
    };
    function walk(el, scope) {
      const d = el.dataset;
      if (d.optional !== undefined && !(view.optional_blocks && view.optional_blocks[d.optional] === true)) { el.remove(); return; }
      if (d.if !== undefined) {
        const neg = d.if.startsWith('!');
        if (present(get(abs(d.if.replace(/^!/, ''), scope))) === neg) { el.remove(); return; }
      }
      if (d.repeat !== undefined) {
        const path = abs(d.repeat, scope);
        const list = get(path);
        (Array.isArray(list) ? list : []).forEach((_, i) => {
          const c = el.cloneNode(true);
          delete c.dataset.repeat;
          c.dataset.repeatItem = `${path}.${i}`;
          el.before(c);
          walk(c, `${path}.${i}`);
        });
        el.remove();
        return;
      }
      if (d.field !== undefined) {
        const path = abs(d.field, scope);
        const v = get(path);
        if (el.tagName === 'IMG') photoState(el, v);
        else if (el.tagName === 'A' && path.startsWith('urls.')) {
          if (v) { el.href = v; delete el.dataset.urlMissing; } else { el.setAttribute('href', '#'); el.dataset.urlMissing = ''; }
        } else el.textContent = fmt(v, d.format, path);
        return;
      }
      if (d.text !== undefined) { el.textContent = fill(d.text, scope); return; }
      // "Add to calendar" needs the platform (/<slug>/event.ics, Google link): in this preview it only shows the notice
      if (d.calendar !== undefined) { el.setAttribute('href', '#'); el.dataset.urlMissing = ''; }
      if (d.photo !== undefined) photoState(el, get(PHOTO_SOURCES[d.photo] || ''));
      for (const name of Object.keys(d)) {
        if (!name.startsWith('attr') || name.length < 5) continue;
        const attr = name.slice(4).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '');
        el.setAttribute(attr, d[name].includes('{') ? fill(d[name], scope) : String(get(abs(d[name], scope)) ?? ''));
      }
      Array.from(el.children).forEach((c) => walk(c, scope));
    }
    if (document.body.dataset.optional && !(view.optional_blocks || {})[document.body.dataset.optional]) {
      document.body.prepend(Object.assign(document.createElement('p'), { textContent: 'This page is switched off (optional_blocks).' }));
    }
    walk(document.head, null);
    walk(document.body, null);
  }
})();
