/* site.js — shared behaviour for every page of the wedding site (design 03 · Blush Garden Rose).
 *
 * Per design, change only MOTION (order + timings) and, if a design's envelope parts differ,
 * ENVELOPE_GEOMETRY. Markup hooks stay the same in every design:
 *   [data-scene="name"]  a group that enters when scrolled into view (plan: MOTION.scenes[name])
 *   [data-step="key"]    an element inside a scene; its delay = MOTION.scenes[name][key]
 *   [data-a="preset"]    how it enters (CSS presets in site.css: rise, rise-lg, bloom, write, unfurl, drift-*)
 *   [data-i="n"]         optional extra stagger inside one step (n × MOTION.stagger)
 * Several scenes that come into view together play one after another (MOTION.batchGap).
 */
const MOTION = {
  // sessionStorage keys — the tiny inline <head> script in each page uses the same keys
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // index.html opening: [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 280],
    tug:     [0, 260],      // bow + envelope give a small press
    bow:     [200, 950],    // silk bow slides off to the lower right
    head:    [360, 700],    // "You are invited / names" lift away
    open:    [880, 420],    // closed envelope dissolves into the open body (liner + pocket)
    flap:    [860, 1000],   // flap swings up on its hinge (3D)
    rise:    [1620, 1300],  // card rises out from behind the front pocket
    forward: [2960, 760],   // card comes in front of the envelope and settles
    petals:  1250,          // petals start falling
    go:      3900,          // navigate to home.html (card morphs into the home hero card)
    fadeOut: 420            // fallback fade when cross-document view transitions are unsupported
  },

  // page entrances: scene → [[step, delay ms], …] — deliberate order, never all at once
  scenes: {
    'home-hero':     [['florals', 0], ['card', 150], ['names', 650], ['date', 1500], ['place', 1700], ['countdown', 1950], ['cue', 2500]],
    'home-invite':   [['card', 0], ['host', 650], ['name1', 850], ['amp', 1350], ['name2', 1500], ['request', 2050], ['date', 2300], ['venue', 2550], ['cta', 2800]],
    'home-teasers':  [['title', 0], ['t1', 300], ['t2', 600], ['t3', 900]],
    'home-foot':     [['sign', 0], ['links', 500]],
    'story-head':    [['florals', 0], ['kicker', 350], ['title', 550], ['divider', 1200], ['lede', 1450]],
    'story-frame':   [['frame', 0], ['caption', 650]],
    'story-next':    [['florals', 0], ['link', 300]],
    'details-head':  [['florals', 0], ['kicker', 350], ['title', 550], ['divider', 1200]],
    'details-card':  [['card', 0], ['title', 600], ['divider', 1100], ['row', 1300], ['dress', 2300]],
    'details-block': [['title', 0], ['photo', 250], ['body', 650], ['action', 950]],
    'rsvp-card':     [['florals', 0], ['card', 150], ['title', 750], ['kicker', 1250], ['deadline', 1400], ['button', 1700], ['note', 1950], ['love', 2300], ['sign', 2450]],
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


/* CONTENT — the ONE place personal/editable text lives (K24: our own platform; buyers edit it in a panel).
 * Values = collections/03_Blush_Garden_Rose/content.demo.json verbatim (make_previews.cjs checks they are equal),
 * plus `story`, a PROPOSED block that content.demo.json does not have yet (captions/intro for story.html).
 * Markup: [data-field="path.in.content"] — text elements get the (formatted) value, <a> gets href (null → "#"),
 * <img> gets src (null → keeps the built photo/placeholder). Optional sections carry data-optional="<optional_blocks key>".
 * Display formats (data-format, or automatic): ISO date → "May 15, 2027"; weekday | month | day | year; "16:00" → "4:00 PM". */
const CONTENT = Object.assign({
    "record_kind": "demo",
    "event_type": "wedding",
    "locale": "en-US",
    "partners": [
      {
        "display_name": "Clara",
        "full_name": "Clara Rose"
      },
      {
        "display_name": "Julian",
        "full_name": "Julian Thomas"
      }
    ],
    "name_display": "Clara & Julian",
    "initials": "C&J",
    "host_line": "Together with their families",
    "date": "2027-05-15",
    "ceremony_time": "16:00",
    "timezone": "America/New_York",
    "venue": {
      "name": "The Rosewater Conservatory",
      "city": "Savannah",
      "region": "Georgia",
      "country": "USA",
      "address": null
    },
    "schedule": [
      {
        "label": "Ceremony",
        "time": "16:00",
        "location": "The Rose Garden"
      },
      {
        "label": "Cocktail Hour",
        "time": "17:00",
        "location": "The Glass Terrace"
      },
      {
        "label": "Reception",
        "time": "18:30",
        "location": "The Conservatory Hall"
      }
    ],
    "dress_code": "Garden formal",
    "rsvp": {
      "deadline": "2027-04-03",
      "method": null
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
      "couple_clip": null,
      "venue_image": null
    },
    "optional_blocks": {
      "our_story": true,
      "countdown": false,
      "dress_code": true,
      "registry": true,
      "travel_stay": true,
      "faq": false,
      "guest_policy": false
    }
  }, {
  story: {
    intro: 'A few of the moments that led us to',
    items: [{ caption: 'First hello' }, { caption: 'The proposal' }, { caption: 'Forever begins' }]
  }
});

(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';

  const store = {
    get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* private mode: no memory */ } },
    del(k) { try { window.sessionStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const rand = (a, b) => a + Math.random() * (b - a);


  /* ------------------------------------------------------------------ content (CONTENT → [data-field]) */
  const getPath = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), CONTENT);
  function fmt(v, f) {
    if (typeof v !== 'string') return v == null ? '' : String(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const d = new Date(v + 'T12:00:00Z');
      const o = { weekday: { weekday: 'long' }, month: { month: 'long' }, day: { day: 'numeric' }, year: { year: 'numeric' } }[f]
        || { month: 'long', day: 'numeric', year: 'numeric' };
      return d.toLocaleDateString('en-US', Object.assign({ timeZone: 'UTC' }, o));
    }
    if (/^\d{2}:\d{2}$/.test(v)) {
      const [h, m] = v.split(':').map(Number);
      return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    }
    return v;
  }
  function fillContent() {
    document.querySelectorAll('[data-field]').forEach((el) => {
      const v = getPath(el.dataset.field);
      if (el.tagName === 'A') { el.setAttribute('href', v || '#'); return; }
      if (el.tagName === 'IMG') {
        if (v) { el.removeAttribute('srcset'); el.src = v; const slot = el.closest('.photo-slot'); if (slot) slot.classList.add('has-photo'); }
        return;
      }
      el.textContent = fmt(v, el.dataset.format);
    });
    const names = `${CONTENT.partners[0].display_name} & ${CONTENT.partners[1].display_name}`;
    const label = document.body.dataset.title;
    document.title = (label ? label + ' · ' : '') + names + (label ? '' : ' · ' + fmt(CONTENT.date));
  }

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
      img.src = P.files[i % P.files.length];
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
  function reveal(scene, base, instant) {
    const plan = new Map(MOTION.scenes[scene.dataset.scene] || []);
    scene.querySelectorAll('[data-step]').forEach((n) => {
      if (n.closest('[data-scene]') !== scene) return;
      if (!instant) {
        const t = base + (plan.get(n.dataset.step) || 0) + (Number(n.dataset.i) || 0) * MOTION.stagger;
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

  /* ------------------------------------------------------------------ countdown (date + time + IANA zone) */
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
  function initCountdown() {
    document.querySelectorAll('[data-countdown]').forEach((box) => {
      let target;
      try { target = zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); }
      catch (e) { target = Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }   // no Intl zone support: device time
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

  /* ------------------------------------------------------------------ placeholder links (urls are null in the demo) */
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
      const a = e.target.closest('a[data-field^="urls."]');
      if (!a || a.getAttribute('href') !== '#') return;
      e.preventDefault();
      toast(a.dataset.pending || document.body.dataset.pending || '');
    });
  }

  /* ------------------------------------------------------------------ envelope (index.html) */
  function initEnvelope() {
    const page = document.querySelector('.env-page');
    if (!page) return;
    const q = (s) => page.querySelector(s);
    const stage = q('.stage');
    const el = {
      env: q('.env'), ribbon: q('.env-ribbon'), closed: q('.env-closed'), flap: q('.env-flap'), body: q('.env-body'),
      pocket: q('.env-pocket'), slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
    };
    const E = MOTION.envelope;
    const replay = /[?&]replay=1/.test(location.search);
    if (replay) root.classList.remove('is-opened');
    let state = root.classList.contains('is-opened') ? 'opened' : 'closed';
    const timers = [];

    function prefetchHome() {
      if (document.querySelector('link[data-prefetch]')) return;
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = 'home.html'; l.dataset.prefetch = '1';
      document.head.appendChild(l);
    }
    if ('requestIdleCallback' in window) requestIdleCallback(prefetchHome, { timeout: 2500 }); else setTimeout(prefetchHome, 1500);

    function go(withCard) {
      store.set(MOTION.storage.opened, '1');
      if (withCard) store.set(MOTION.storage.arrive, '1');
      else el.card.style.viewTransitionName = 'none';   // skip: no card morph out of a closed envelope
      if (crossDocVT || reduce) { location.href = 'home.html'; return; }
      // fallback: fade the scene into the backdrop, home.html fades in on arrival
      page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
      const layer = document.querySelector('.petal-layer');
      if (layer) layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: E.fadeOut, fill: 'forwards' });
      setTimeout(() => { location.href = 'home.html'; }, E.fadeOut);
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
      A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 60]);
      A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 60]);
      A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
      A(el.flap, [
        { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)' },
        { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)' }
      ], E.flap, 'cubic-bezier(.2,.8,.25,1)');
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

    function reset() {
      timers.splice(0).forEach(clearTimeout);
      cancelScripted();
      el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
      el.card.style.viewTransitionName = '';
      const layer = document.querySelector('.petal-layer');
      if (layer) layer.remove();
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
        cancelScripted();
        timers.splice(0).forEach(clearTimeout);
        const layer = document.querySelector('.petal-layer');
        if (layer) layer.remove();
        el.slot.style.clipPath = ''; el.slot.style.zIndex = '';
        el.card.style.viewTransitionName = '';
        root.classList.add('is-opened');
        state = 'opened';
      }
    });
  }

  /* ------------------------------------------------------------------ boot */
  function boot() {
    fillContent();
    initEnvelope();
    initScenes();
    initCountdown();
    initPlaceholders();
    if (root.classList.contains('from-envelope')) setTimeout(() => petals('arrive'), 250);
    const closing = document.querySelector('[data-petals="closing"]');
    if (closing && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); petals('closing'); } }, { threshold: .35 });
      io.observe(closing);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
