/* site.js — shared behaviour of every page of the Azulejo Mosaic theme (design 03, platform theme).
 * Ported from the G035 demo (collections/03_Blush_Garden_Rose/website/site.js).
 *
 * Content: the platform writes every personal value into the HTML on the server (engine markers, platform/README.md)
 * and injects <script type="application/json" id="site-data"> = {slug, theme, variant, page, preview, pages, derived}
 * (no content record: personal text is already in the HTML). With #site-data present this file NEVER writes personal text; it only reads it (countdown target, the
 * page map for navigation, the slug for per-site session keys). DEV_CONTENT (below MOTION) is used only when
 * the theme files are opened without the platform (static server): then devRender() fills the same markers.
 *
 * Tuning THIS theme: MOTION (order + timings) and ENVELOPE_GEOMETRY. A NEW design is not this file with new numbers:
 * it follows docs/11_TEMA_STANDARDI.md (its own layout from its W1 comps, its own envelope type and opening, its own
 * accents and story arrangement); only these markup hooks and the platform contract are shared:
 *   [data-scene="name"]  a group that enters when scrolled into view (plan: MOTION.scenes[name])
 *   [data-step="key"]    an element inside a scene; its delay = MOTION.scenes[name][key]
 *   [data-a="preset"]    how it enters (CSS presets in site.css: rise, rise-lg, bloom, write, unfurl, drift-*)
 *   [data-i="n"]         optional extra stagger inside one step (n × MOTION.stagger); rows repeated by the platform
 *                        (data-repeat-item="schedule.2") stagger by their index automatically
 * Several scenes that come into view together play one after another (MOTION.batchGap).
 */
const MOTION = {
  // sessionStorage keys (+ ":<slug>" on the platform) — the tiny inline <head> scripts use the same keys
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // index opening: [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 280],
    tug:     [0, 260],      // bow + envelope give a small press
    bow:     [200, 950],    // silk bow slides off to the lower right
    head:    [360, 700],    // "You are invited / names" lift away
    lift:    [880, 400],    // the closed flap lifts on its hinge (0° → 90°, edge-on)
    open:    [880, 320],    // the closed envelope body dissolves into the open body (liner + pocket) under the flap
    flap:    [1280, 760],   // the open flap continues from edge-on (−90°) to lying open (0°)
    rise:    [1800, 1300],  // card rises out from behind the front pocket
    forward: [3140, 760],   // card comes in front of the envelope and settles
    petals:  1430,          // petals start falling
    go:      4080,          // navigate to home (card morphs into the home hero card)
    fadeOut: 420            // fallback fade when cross-document view transitions are unsupported
  },

  // page entrances: scene → [[step, delay ms], …] — deliberate order, never all at once
  scenes: {
    'home-hero':     [['florals', 0], ['card', 150], ['names', 650], ['date', 1500], ['place', 1700], ['countdown', 1950], ['cue', 2500]],
    'home-invite':   [['card', 0], ['host', 650], ['name1', 850], ['amp', 1350], ['name2', 1500], ['request', 2050], ['date', 2300], ['venue', 2550], ['cta', 2800], ['cal', 3050]],
    'home-teasers':  [['title', 0], ['t1', 300], ['t2', 600], ['t3', 900]],
    'home-foot':     [['sign', 0], ['links', 500]],
    'story-head':    [['florals', 0], ['kicker', 350], ['title', 550], ['divider', 1200], ['lede', 1450]],
    'story-frame':   [['frame', 0], ['caption', 650]],
    'story-next':    [['florals', 0], ['link', 300]],
    'details-head':  [['florals', 0], ['kicker', 350], ['title', 550], ['divider', 1200]],
    'details-card':  [['card', 0], ['title', 600], ['divider', 1100], ['row', 1300], ['dress', 2300], ['cal', 2600]],
    'details-block': [['title', 0], ['photo', 250], ['body', 650], ['action', 950]],
    'details-faq':   [['title', 0], ['divider', 650], ['item', 900]],
    'rsvp-card':     [['florals', 0], ['card', 150], ['title', 750], ['kicker', 1250], ['deadline', 1400], ['button', 1700], ['love', 2050], ['sign', 2200]],
    'rsvp-form':     [['form', 0]],
    'rsvp-closing':  [['bow', 0], ['title', 600], ['line', 1100], ['meta', 1350]]
  },
  stagger: 220,          // data-i spacing inside one step
  batchGap: 380,         // scenes entering together play in sequence
  arriveDelay: 650,      // home hero waits for the card morph when arriving from the envelope

  petals: {
    files: ['img/petal1-200.webp', 'img/petal2-200.webp', 'img/petal3-200.webp',
            'img/petal4-200.webp', 'img/petal5-200.webp', 'img/petal6-200.webp'],
    open:   { count: 16, spread: 1700, dur: [3600, 6400], size: [24, 46] },
    arrive: { count: 9,  spread: 1600, dur: [4400, 7000], size: [22, 40] },
    closing:{ count: 7,  spread: 2400, dur: [5200, 8000], size: [20, 36] }
  }
};

/* Envelope layer geometry (percent), measured from the GPT parts — see img/manifest.json:
   card width 55% of the open-envelope canvas → card height 61.43% of canvas height.
   Hidden: card top at 76% (below the pocket tip at 75.0%). Out: top −11% (card bottom 50.4% < pocket
   edge 53.2% at the card's corners) → translateY(−141.6%). In front: top 3% → translateY(−118.8%). */
const ENVELOPE_GEOMETRY = { out: 'translateY(-141.6%)', front: 'translateY(-118.8%) scale(1.06)' };

/* DEV_CONTENT — used ONLY when the theme is opened without the platform (no #site-data): fictional demo record
 * = collections/03_Blush_Garden_Rose/content.demo.json. On the platform the content always comes from the site record. */
const DEV_CONTENT = {
  "record_kind": "demo",
  "event_type": "wedding",
  "locale": "en-US",
  "partners": [
    {
      "display_name": "Inês",
      "full_name": "Inês Carvalho Duarte"
    },
    {
      "display_name": "Mateo",
      "full_name": "Mateo Alexander Reyes"
    }
  ],
  "name_display": "Inês & Mateo",
  "initials": "I&M",
  "host_line": "Together with their families",
  "date": "2027-06-05",
  "ceremony_time": "17:00",
  "timezone": "Europe/Lisbon",
  "venue": {
    "name": "Quinta da Andorinha Azul",
    "city": "Sintra",
    "region": "Lisbon",
    "country": "Portugal",
    "address": null
  },
  "schedule": [
    {
      "label": "Ceremony",
      "time": "17:00",
      "location": "The chapel garden"
    },
    {
      "label": "Cocktail hour",
      "time": "18:00",
      "location": "The tiled courtyard"
    },
    {
      "label": "Dinner & dancing",
      "time": "19:30",
      "location": "The cloister terrace"
    }
  ],
  "dress_code": "Summer formal",
  "rsvp": {
    "deadline": "2027-04-30",
    "method": null,
    "required": {
      "email": false,
      "message": false
    },
    "questions": [
      {
        "id": "meal",
        "label": "Your meal preference",
        "type": "choice",
        "required": false,
        "options": [
          "Vegetarian",
          "Fish",
          "Chicken"
        ]
      }
    ]
  },
  "urls": {
    "website": null,
    "rsvp_form": null,
    "map": null,
    "registry": null,
    "accommodation": null
  },
  "media": {
    "hero_portrait": null,
    "memory_photos": [],
    "venue_image": null,
    "couple_clip": null
  },
  "optional_blocks": {
    "our_story": true,
    "countdown": true,
    "dress_code": true,
    "registry": true,
    "travel_stay": true,
    "faq": true,
    "guest_policy": false
  },
  "story": {
    "intro": "Tile by tile, from a rainy afternoon in a little café to a promise on a hill above the sea, our story led us to",
    "items": [
      {
        "caption": "A rainy afternoon"
      },
      {
        "caption": "The tram up the hill"
      },
      {
        "caption": "Our promise"
      }
    ]
  },
  "audio": {
    "music": "garden-waltz",
    "effects": true
  },
  "faq": [
    {
      "q": "When should we arrive?",
      "a": "Please arrive 20 minutes before the ceremony."
    },
    {
      "q": "Can you accommodate dietary requirements?",
      "a": "Please tell us about your requirements in your reply."
    }
  ]
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


  /* ------------------------------------------------------------------ petals */
  function petals(kind) {
    const P = MOTION.petals, cfg = P[kind];
    if (reduce || !cfg || !Element.prototype.animate) return;
    let layer = document.querySelector('.petal-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'petal-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < cfg.count; i++) {
      const img = new Image();
      img.src = asset(P.files[i % P.files.length]);
      img.alt = '';
      img.decoding = 'async';
      const s = rand(cfg.size[0], cfg.size[1]);
      img.style.width = s.toFixed(1) + 'px';
      layer.appendChild(img);
      const x0 = rand(-0.05, 0.95) * W, drift = rand(-0.22, 0.22) * W, sway = rand(16, 44);
      const r0 = rand(0, 360), r1 = r0 + rand(-280, 280), ph = rand(0, 6.28);
      const kf = [];
      const N = 8;
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = x0 + drift * t + Math.sin(t * 6.28 + ph) * sway;
        const y = -70 + (H + 140) * t;
        const rx = Math.sin(t * 9.4 + ph) * 58;
        kf.push({
          transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * t).toFixed(1)}deg) rotateX(${rx.toFixed(1)}deg)`,
          opacity: k === 0 ? 0 : (k === N ? 0.75 : 0.95),
          offset: t
        });
      }
      const a = img.animate(kf, { duration: rand(cfg.dur[0], cfg.dur[1]), delay: rand(0, cfg.spread), easing: 'linear', fill: 'both' });
      a.onfinish = () => img.remove();
    }
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
        n.addEventListener('transitionend', () => n.classList.add('done'), { once: true });
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

  /* ------------------------------------------------------------------ links without a URL yet */
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

  /* ------------------------------------------------------------------ envelope (index page) */
  function initEnvelope() {
    const page = document.querySelector('.env-page');
    if (!page || page.hasAttribute('data-opening')) return;
    const q = (s) => page.querySelector(s);
    const stage = q('.stage');
    const el = {
      env: q('.env'), ribbon: q('.env-ribbon'), closed: q('.env-closed'), cflap: q('.env-cflap'), flap: q('.env-flap'),
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
      // the card is named for the view transition only now (site.css: a closed envelope's card has no name)
      if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
      else el.card.style.viewTransitionName = 'none';   // skip: no card morph out of a closed envelope
      if (crossDocVT || reduce) { location.href = PAGES.home; return; }
      // fallback: fade the scene into the backdrop, home fades in on arrival
      page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
      const layer = document.querySelector('.petal-layer');
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
      A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.985)', offset: .45 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
      A(el.ribbon, [
        { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate3d(0,0,0) rotate(0deg) scale(1.04)', opacity: 1, offset: .18 },
        { transform: 'translate3d(9%,3%,0) rotate(5deg) scale(1.03)', opacity: 1, offset: .45 },
        { transform: 'translate3d(74%,36%,0) rotate(17deg) scale(1)', opacity: 0 }
      ], [E.tug[0], E.bow[0] + E.bow[1]], 'cubic-bezier(.5,0,.75,.35)');
      A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-16px,0)' }], E.head, 'ease-in', 'forwards');
      // the closed flap lifts toward the viewer on its hinge; underneath, the closed body gives way to the open body
      if (el.cflap) {
        A(el.cflap, [
          { opacity: 1, transform: 'perspective(800px) rotateX(0deg)', filter: 'brightness(1)' },
          { opacity: 1, transform: 'perspective(800px) rotateX(89deg)', filter: 'brightness(.9)', offset: .995 },
          { opacity: 0, transform: 'perspective(800px) rotateX(90deg)', filter: 'brightness(.9)' }
        ], E.lift, 'cubic-bezier(.45,0,.85,.5)');
      }
      A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 60]);
      A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 60]);
      A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
      A(el.flap, [
        { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)' },
        { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)' }
      ], E.flap, 'cubic-bezier(.2,.75,.3,1)');
      timers.push(setTimeout(() => petals('open'), E.petals));
      A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.4,0,.15,1)');
      timers.push(setTimeout(() => {
        // the card is fully out of the pocket: bring it in front of the envelope
        el.slot.style.clipPath = 'none';
        el.slot.style.zIndex = '5';
        A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: ENVELOPE_GEOMETRY.front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
      }, E.forward[0]));
      timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
    }

    // cancel only the opening's script animations (keep CSS ones such as the hint pulse)
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
      const layer = document.querySelector('.petal-layer');
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
    // Skip: 'done' (not 'closed'), so a back/forward-cache return clears the fallback fade
    document.querySelectorAll('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
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

  /* ------------------------------------------------------------------ long names (docs/11 §12, G056)
     [data-fit="n"]: a line of names that wraps (CSS) and, when it is taller than n lines of its CSS size, shrinks
     (CSS var --fit, at least data-fit-min) until it is not. Envelope page: .env-page gets the names' extra height
     (--names-x, site.css --w) so the envelope gives it back and names, envelope and "Tap to open" keep their places on
     the plain painted wash. Text only — no personal value is written. Without JS: CSS size, wrapping. */
  let fitWidth = 0;
  function fitText() {
    fitWidth = window.innerWidth;
    document.querySelectorAll('[data-fit]').forEach((el) => {
      el.style.removeProperty('--fit');
      const cs = getComputedStyle(el);
      const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.12;
      const max = line * (parseFloat(el.dataset.fit) || 1) + 1;
      if (el.offsetHeight > max) {
        let lo = parseFloat(el.dataset.fitMin) || .4, hi = 1;
        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2;
          el.style.setProperty('--fit', mid);
          if (el.offsetHeight > max) hi = mid; else lo = mid;
        }
        el.style.setProperty('--fit', Math.floor(lo * 980) / 1000);   // 2 % below the found size: no wrap flip on a sub-pixel
      }
      const page = el.closest('.env-page');
      if (page) page.style.setProperty('--names-x', (Math.max(0, el.offsetHeight - line) * 1.1).toFixed(1) + 'px');
    });
  }
  function initFit() {
    if (!document.querySelector('[data-fit]')) return;
    fitText();
    // web fonts change the wrapping: fit again whenever a font finishes loading (fonts.ready alone can resolve before
    // the first layout has even requested the script font)
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(fitText);
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', fitText);
    }
    let raf = 0;   // only a width change can change the wrapping (mobile bars resize the height while scrolling)
    window.addEventListener('resize', () => { if (window.innerWidth !== fitWidth) { cancelAnimationFrame(raf); raf = requestAnimationFrame(fitText); } });
  }

  /* ------------------------------------------------------------------ home hero: the first screen (qa-kontrol 2026-10-14)
     A hero piece after the names (date, place, countdown, cue) that does not end 4 px above the bottom nav starts below
     the first screen (top ≥ the small viewport + 12 px) — never half under the nav: a long record (docs/11 §12) scrolls.
     The card stays where it is. G058: the names end 8 px above the nav, counting their inline boxes (the script's tails
     reach below the line box: "James" touched the nav at 320×568); a long pair shrinks for that (CSS --fit), never below
     36 px. The first screen is the small viewport (svh), so toolbars collapsing while scrolling move nothing; layout
     boxes, so the entrance transforms do not count (the names enter by clip-path). Again when a font loads (the names
     wrap) and when the width changes. */
  const NAMES_MIN = 36;
  let foldWidth = 0;
  function foldHero() {
    const inner = document.querySelector('.hero-inner'), nav = document.querySelector('.site-nav');
    if (!inner || !nav) return;
    foldWidth = window.innerWidth;
    const names = inner.querySelector('.names');
    const kids = Array.from(inner.children).filter((c) => !c.matches('.hero-card, .names'));
    kids.forEach((c) => c.style.removeProperty('margin-top'));
    if (names) names.style.removeProperty('--fit');
    if (nav.getBoundingClientRect().top < window.innerHeight / 2) return;   // wide screens: the nav is on top
    const probe = document.createElement('i');
    probe.style.cssText = 'position:fixed;height:100svh';
    document.body.appendChild(probe);
    const sv = probe.offsetHeight || window.innerHeight;
    probe.remove();
    const limit = sv - nav.offsetHeight - 4, below = sv + 12;
    if (names) {
      const end = () => window.scrollY + Math.max(...Array.from(names.querySelectorAll('*'), (s) => s.getBoundingClientRect().bottom), names.getBoundingClientRect().bottom);
      if (end() > limit - 4) {
        const min = Math.min(1, NAMES_MIN / parseFloat(getComputedStyle(names).fontSize));
        let lo = min, hi = 1;
        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2;
          names.style.setProperty('--fit', mid);
          if (end() > limit - 4) hi = mid; else lo = mid;
        }
        names.style.setProperty('--fit', Math.max(min, Math.floor(lo * 1000) / 1000));
      }
    }
    const top = (el) => { let y = 0; for (let e = el; e; e = e.offsetParent) y += e.offsetTop; return y; };
    for (let i = 0; i < 4; i++) {
      const cut = kids.filter((k) => k.offsetParent && top(k) + k.offsetHeight > limit).sort((a, b) => top(a) - top(b))[0];
      if (!cut || top(cut) >= below - 0.5) return;
      cut.style.marginTop = (parseFloat(getComputedStyle(cut).marginTop) + below - top(cut)).toFixed(1) + 'px';
    }
  }
  function initFold() {
    if (!document.querySelector('.hero-inner')) return;
    foldHero();
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(foldHero);
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', foldHero);
    }
    let raf = 0;
    window.addEventListener('resize', () => { if (window.innerWidth !== foldWidth) { cancelAnimationFrame(raf); raf = requestAnimationFrame(foldHero); } });
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
    initFit();
    initEnvelope();
    initScenes();
    initCountdown();
    initFold();
    initPlaceholders();
    if (root.classList.contains('from-envelope')) setTimeout(() => petals('arrive'), 250);
    const closing = document.querySelector('[data-petals="closing"]');
    if (closing && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); petals('closing'); } }, { threshold: .35 });
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
    view.copy = {};   // G068: {copy.<key>} = the page's [data-copy] text
    document.querySelectorAll('[data-copy]').forEach((el) => { view.copy[el.dataset.copy] ??= el.textContent.trim(); });
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
      // data-if: one or more conditions, all must hold (G075)
      if (d.if !== undefined && d.if.trim().split(/\s+/).some((c) => present(get(abs(c.replace(/^!/, ''), scope))) === c.startsWith('!'))) {
        el.remove();
        return;
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
