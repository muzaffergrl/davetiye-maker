/* site.js — Vintage Airmail Love Letter (04, G404): motion, envelope (tear strip), name fit, card paper, countdown.
 * The platform writes the HTML and #site-data (no content record); DEV_CONTENT + devRender() only without it.
 * Hooks, reasons: README.md. */
const MOTION = {
  // sessionStorage keys (+ ":<slug>"), shared with the inline <head> scripts
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // opening (docs/11 §7.2 "kapak — yırtma şeridi"): [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 260],      // "Tap to open" fades
    tug:     [0, 300],      // the envelope gives under the finger
    closure: [0, 820],      // the wax seal pops off: a hop, then it tumbles away to the left (first motion at once)
    head:    [160, 620],    // "You are invited" + names rise away (the card will rise there)
    tear:    [360, 860],    // the perforated strip rips along the top edge, left → right; the torn part peels up
    fly:     [1220, 560],   // the torn strip lifts off the envelope and is gone
    rise:    [1180, 1320],  // the cream letter card slides up out of the envelope
    forward: [2560, 620],   // out of the envelope: it comes forward where it is (× 1.04, growing shadow)
    accents: 1240,          // a pressed forget-me-not flutters down beside the card, gone before `go`
    go:      3620,          // to home (the card flies into the hero card)
    fadeOut: 420            // fade without cross-document view transitions
  },

  // entrances: scene → [[step, delay ms], …], never all at once
  scenes: {
    'home-hero':      [['decor', 0], ['card', 120], ['names', 620], ['date', 1400], ['venue', 1650], ['countdown', 1950], ['cta', 2250]],
    'home-invite':    [['card', 0], ['host', 560], ['name1', 900], ['amp', 1450], ['name2', 1560], ['request', 2150], ['date', 2500], ['venue', 2850], ['cta', 3150], ['cal', 3350]],
    'home-more':      [['title', 0], ['item1', 260], ['item1t', 760], ['twine1', 1000], ['item2', 1200], ['item2t', 1700], ['twine2', 1940], ['item3', 2140], ['item3t', 2500]],
    'home-foot':      [['decor', 0], ['sign', 140], ['links', 900]],
    'story-head':     [['decor', 0], ['title', 120], ['kicker', 1000], ['lede', 1350]],
    'story-stamp':    [['drop', 0], ['acc', 420], ['mark', 760], ['caption', 820]],   // one frame dropped onto the desk
    'story-next':     [['decor', 0], ['twine', 200], ['link', 600]],
    'details-card':   [['decor', 0], ['kicker', 120], ['card', 340], ['title', 860], ['row', 1450], ['cal', 2500]],
    'details-venue':  [['photo', 0], ['body', 560], ['dress', 950], ['action', 1150]],
    'details-block':  [['twine', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq':    [['twine', 0], ['title', 300], ['item', 950]],
    'details-next':   [['decor', 0], ['link', 300]],
    'rsvp-card':      [['decor', 0], ['card', 120], ['title', 700], ['kicker', 1400], ['deadline', 1600], ['button', 1950], ['twine', 2200], ['wait', 2400], ['love', 2750], ['sign', 3000], ['seal', 3300]],
    'rsvp-form':      [['form', 0]],
    'rsvp-closing':   [['decor', 0], ['title', 220], ['line', 900], ['meta', 1250]]
  },
  stagger: 210,          // data-i / repeated rows spacing inside one step
  batchGap: 380,         // scenes entering together play in sequence
  arriveDelay: 0,        // from the envelope: the names (620 ms) start as the card morph (.9 s) lands

  // particles (docs/11 §8): "a pressed flower flutters down" = one accent_2, beside the card (never over the photo)
  accents: {
    open:    [{ file: 'img/accent_2-200.webp', count: 1, path: 'fall', origin: 'top', dur: [2300, 2300], size: [62, 74], spread: 0, avoid: '.env .card' }],
    arrive:  [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 7600], size: [34, 44], spread: 1400, avoid: '.hero [data-slot]' }],
    closing: [{ file: 'img/accent_1-200.webp', count: 1, path: 'fall', origin: 'top', dur: [7000, 7000], size: [40, 40], spread: 0 },
              { file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6200, 7600], size: [32, 40], spread: 1500 }]
  }
};

/* card path (% of its height, manifest stage.card_path) */
const ENVELOPE_GEOMETRY = { out: 'translateY(-109.499%)', front: 'translateY(-107.499%) scale(1.04)' };

/* DEV_CONTENT (no #site-data only) = content.demo.json */
const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Margot', full_name: 'Margot Elise' }, { display_name: 'Henry', full_name: 'Henry Arthur' }],
  name_display: 'Margot & Henry', initials: 'M&H', host_line: 'Together with their families',
  date: '2027-10-02', ceremony_time: '16:00', timezone: 'America/New_York',
  venue: { name: 'The Old Post House', city: 'Hudson', region: 'New York', country: 'USA', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:00', location: 'The Orchard Lawn' },
    { label: 'Cocktail Hour', time: '17:00', location: 'The Library Bar' },
    { label: 'Reception', time: '18:30', location: 'The Post Hall' }
  ],
  dress_code: 'Cocktail attire',
  rsvp: { deadline: '2027-08-21', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Some love stories are written one letter at a time. Ours led us to',
    items: [{ caption: 'A table for two' }, { caption: 'Sealed with a yes' }, { caption: 'Yours, always' }]
  }
};

(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
  // theme assets resolve against this file, not the page URL
  const BASE = (document.currentScript && document.currentScript.src) || document.baseURI;
  const asset = (p) => new URL(p, BASE).href;

  /* -- data: platform (#site-data) or dev fallback */
  function readSiteData() {
    const el = document.getElementById('site-data');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }
  const SITE = readSiteData();
  const CONTENT = SITE ? {} : DEV_CONTENT;   // the platform sends no record
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

  /* -- accents (MOTION.accents): in a lane beside `avoid` (never over a photo) */
  function flightPath(path, W, H, s, i, avoid) {
    const kf = [];
    const N = 12;
    const down = path !== 'rise';
    const sway = rand(16, 30), ph = rand(0, 6.28);
    let x0 = rand(0.08, 0.92) * W, drift = rand(-0.14, 0.14) * W;
    if (avoid) {
      const lanes = [[sway, avoid.left - s - sway], [avoid.right + sway, W - s - sway]].filter(([a, b]) => b > a);
      if (!lanes.length) return null;
      const [a, b] = lanes[(i + (Math.random() < 0.5 ? 0 : 1)) % lanes.length];
      x0 = rand(a, b); drift = 0;
    }
    const r0 = rand(-30, 30), turn = rand(-140, 140);
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const swing = Math.sin(t * 6.28 * 1.4 + ph);
      const x = x0 + drift * t + swing * sway;
      const y = down ? -s * 1.6 + (H + 3.2 * s) * t : H + s - (H + 2 * s) * t;
      kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + turn * t + swing * 22).toFixed(1)}deg) rotateY(${(swing * 38).toFixed(1)}deg)`,
        opacity: k === 0 ? 0 : (k === N ? 0 : 0.97), offset: t });
    }
    return kf;
  }
  function accents(moment, until) {
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
      const av = g.avoid && document.querySelector(g.avoid);
      for (let i = 0; i < g.count; i++) {
        const s = rand(g.size[0], g.size[1]);
        const kf = flightPath(g.path, W, H, s, i, av && av.getBoundingClientRect());
        if (!kf) continue;
        const img = new Image();
        img.src = asset(g.file);
        img.alt = '';
        img.decoding = 'async';
        img.style.width = s.toFixed(1) + 'px';
        layer.appendChild(img);
        const delay = i * 700 + rand(0, g.spread || 0);
        const a = img.animate(kf, { duration: Math.max(600, Math.min(rand(g.dur[0], g.dur[1]), (until || 1e9) - delay)), delay, easing: 'linear', fill: 'both' });
        a.onfinish = () => img.remove();
      }
    });
  }

  /* -- scenes (sequential entrances) */
  function stepIndex(n) {
    if (n.dataset.i !== undefined) return Number(n.dataset.i) || 0;
    const item = n.dataset.repeatItem;   // "schedule.2" (data-repeat)
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
        // frames on the desk land one after another (each takes ~.9 s), other scenes follow batchGap
        let base = i * (s.dataset.scene === 'story-stamp' ? 760 : MOTION.batchGap);
        if (arrived && s.dataset.scene === 'home-hero') base += MOTION.arriveDelay;
        reveal(s, base, false);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    scenes.forEach((s) => io.observe(s));
  }

  /* -- countdown */
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
    // platform: computed on the server
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

  /* -- links without a URL yet (preview only) */
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

  /* -- striped letter sheets (docs/11 §9): the band repeats, never stretched; the height = whole bands (README) */
  function fitPaper() {
    const papers = Array.from(document.querySelectorAll('.paper[data-band]'));
    if (!papers.length) return;
    const run = () => papers.forEach((p) => {
      const text = p.querySelector('.paper-text');
      if (!text) return;
      text.style.minHeight = '';
      const cs = getComputedStyle(p);
      const W = p.clientWidth, ar = parseFloat(cs.getPropertyValue('--ar')), t = parseFloat(cs.getPropertyValue('--t')),
        b = parseFloat(cs.getPropertyValue('--b'));
      if (!W || !ar) return;
      const H = W / ar, top = H * t, bot = H * (1 - b), band = H * (b - t);
      const need = Math.max(H, text.offsetHeight);
      const n = Math.max(1, Math.ceil((need - top - bot) / band - 0.004));
      text.style.minHeight = `${(top + bot + n * band).toFixed(2)}px`;
      p.style.setProperty('--bands', String(n));
    });
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    if (window.ResizeObserver) {
      let w = 0;
      const ro = new ResizeObserver(() => { if (window.innerWidth !== w) { w = window.innerWidth; run(); } });
      ro.observe(document.documentElement);
    }
  }

  /* -- long names, the hero's first screen, card copy (README "Home ilk ekranı") */
  function fitNames() {
    // [selector, max lines, max share of the screen height, floor px]: the envelope's names give way to the envelope (long
    // names: down to 20 px, the envelope and "Tap to open" stay on screen); the hero's names never under 36 px (qa)
    const targets = [['.env-head .names', 5, 0.3, 20], ['.hero .names', 3.2, 0.3, 36]]
      .map(([sel, ...a]) => [document.querySelector(sel), ...a]).filter(([el]) => el);
    if (!targets.length) return;
    const inner = document.querySelector('.hero-inner'), nav = document.querySelector('.site-nav');
    // layout boxes (no entrance transforms)
    const bottom = (el) => { let y = el.offsetHeight; for (let e = el; e; e = e.offsetParent) y += e.offsetTop; return y; };
    // the first screen = the small viewport (svh): collapsing toolbars move nothing
    const sv = () => { const p = document.createElement('i'); p.style.cssText = 'position:fixed;height:100svh'; document.body.append(p); const h = p.offsetHeight; p.remove(); return h || innerHeight; };
    const low = (h1) => {
      const hero = h1.closest('.hero');
      if (!hero || !inner || !nav) return false;
      const long = hero.classList.contains('is-long');
      return Math.max(...[...inner.children].filter((c) => !(long && c.matches('.countdown'))).map(bottom)) > sv() - nav.offsetHeight - 8;
    };
    const fit = (h1, maxLines, maxShare, minPx, navFloor) => {
      h1.style.setProperty('--names-scale', '1');
      const min = Math.min(1, Math.max(0.4, minPx / parseFloat(getComputedStyle(h1).fontSize)));
      for (let s = 1; ; s = Math.max(min, s - 0.06)) {
        h1.style.setProperty('--names-scale', s.toFixed(3));
        const h = h1.getBoundingClientRect().height, lines = h / (parseFloat(getComputedStyle(h1).fontSize) * 1.45);
        if (s <= min || (lines <= maxLines && h <= innerHeight * maxShare && (s <= navFloor || !low(h1)))) break;
      }
    };
    // card copy ≥ 11 px: all, no place, no script, script only, none
    const fits = (c) => {
      const k = [...c.children].filter((p) => p.offsetParent);
      return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
        && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
    };
    const fitCopy = () => document.querySelectorAll('.card-copy').forEach((c) => {
      for (const d of ['', 'c', 's', 'c d', 's c d']) { c.dataset.drop = d; if (fits(c)) break; }
    });
    // fold (qa 2026-10-14): a piece not ending above the nav starts below the first screen, never half under it; a pill
    // left above keeps the backdrop (--fold: scene-bg ends after it; .is-folded: no decor_br room)
    const top = (el) => bottom(el) - el.offsetHeight;
    const pieces = () => [...inner.children].filter((c) => c.offsetParent && !c.matches('.hero-card-wrap'));
    const unfold = (hero) => {
      [...inner.children].forEach((c) => c.style.removeProperty('margin-top'));
      hero.classList.remove('is-folded');
      hero.style.removeProperty('--fold');
    };
    const fold = (hero) => {
      const v = sv(), limit = v - nav.offsetHeight - 8, below = v + 12, cs = getComputedStyle(hero);
      const cut = () => pieces().filter((c) => bottom(c) > limit).sort((a, b) => top(a) - top(b))[0];
      let c = cut();
      if (!c || top(c) >= below - 0.5) return;
      const cta = inner.querySelector('.hero-cta'), keep = cta && cta.offsetParent && bottom(cta) <= limit;
      const end = keep && Math.max(parseFloat(cs.minHeight) || 0, bottom(cta) - top(hero) + parseFloat(cs.paddingBottom));
      hero.classList.toggle('is-folded', !!keep);
      // nothing but the card fits (the §12 stress names at 320–375 px): the card stands in the middle of the first screen
      const card = inner.querySelector('.hero-card-wrap');
      if (card && c === pieces()[0]) {
        const lift = Math.max(0, (limit - card.offsetHeight) / 2 - top(card));
        card.style.marginTop = `${lift}px`;
        c = cut();
      }
      for (let i = 0; i < 4 && c && top(c) < below - 0.5; i++, c = cut()) c.style.marginTop = `${parseFloat(getComputedStyle(c).marginTop) + below - top(c)}px`;
      if (keep) hero.style.setProperty('--fold', `${Math.max(0, hero.offsetHeight - end)}px`);
    };
    // hero: names ≤ 30 %; tight + names ≥ 36 px; countdown after the pill; else it scrolls; then fold
    const run = () => fitCopy() || targets.forEach(([h1, maxLines, maxShare, minPx]) => {
      const hero = h1.closest('.hero');
      if (!hero) return fit(h1, maxLines, maxShare, minPx, 0);
      if (inner && nav) unfold(hero);
      for (const [cls, navFloor] of [[[], 0.76], [['is-tight'], 0], [['is-tight', 'is-long'], 0], [[], 1]]) {
        hero.classList.remove('is-tight', 'is-long');
        hero.classList.add(...cls);
        fit(h1, maxLines, maxShare, minPx, navFloor);
        if (!low(h1)) break;
      }
      if (inner && nav) fold(hero);
    });
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    if (window.ResizeObserver) { const ro = new ResizeObserver(fitCopy); document.querySelectorAll('.card-copy').forEach((c) => ro.observe(c)); }
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
  }

  /* -- envelope (index page): seal pops off → strip tears left → right → card slides up → comes forward → home */
  function initEnvelope() {
    const page = document.querySelector('.env-page');
    if (!page) return;
    const q = (s) => page.querySelector(s);
    const stage = q('.stage');
    const el = {
      env: q('.env'), closure: q('.closure'), strip: q('.env-strip'), torn: q('.env-torn'), body: q('.env-open'),
      slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint')
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
      // named for the view transition only now (a closed envelope's card has none)
      if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
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

    // the tear (one pass, left → right): the strip still attached is clipped from the left; the torn part (the strip above
    // the ragged line, env_torn) shows to the left of the tear point and peels up around it, lifting from its loose end
    function tearFrames() {
      const strip = [], torn = [];
      const N = 16, lift = 8.5;
      for (let k = 0; k <= N; k++) {
        const p = k / N;
        const x = 100 * (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2) ;   // slow start, a quick rip, slow end
        const up = Math.min(1, x / 22);
        strip.push({ clipPath: `inset(-2% 0 -2% ${x.toFixed(2)}%)`, offset: p });
        torn.push({ clipPath: `inset(-60% ${(100 - x).toFixed(2)}% -20% -4%)`, transformOrigin: `${x.toFixed(2)}% 100%`,
          transform: `translateY(${(-34 * up).toFixed(1)}%) rotate(${(lift * up).toFixed(2)}deg)`, offset: p });
      }
      return { strip, torn };
    }

    function play() {
      if (state !== 'closed') return;
      state = 'playing';
      prefetchHome();
      if (reduce || !Element.prototype.animate) { go(false); return; }
      A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
      A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .4 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
      // the little wax seal pops off: a hop (it lets go of the strip), then it tumbles away to the left and is gone
      A(el.closure, [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1, easing: 'cubic-bezier(.2,.8,.3,1)' },
        { transform: 'translate(-4%, -16%) rotate(-7deg) scale(1.12)', opacity: 1, offset: .2, easing: 'cubic-bezier(.3,.1,.6,1)' },
        { transform: 'translate(-70%, -34%) rotate(-38deg) scale(1.06)', opacity: 1, offset: .55, easing: 'cubic-bezier(.5,0,.9,.6)' },
        { transform: 'translate(-175%, 60%) rotate(-96deg) scale(.96)', opacity: 0 }
      ], E.closure, 'linear');
      A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
      // the tear
      const tf = tearFrames();
      A(el.strip, tf.strip, E.tear, 'linear', 'forwards');
      A(el.torn, [{ opacity: 0 }, { opacity: 1 }], [E.tear[0], 1], 'linear', 'forwards');
      A(el.torn, tf.torn, E.tear, 'linear', 'forwards');
      A(el.torn, [{ filter: 'drop-shadow(0 1px 1px rgba(60, 40, 20, .2))' }, { filter: 'drop-shadow(0 9px 8px rgba(60, 40, 20, .28))' }], E.tear, 'ease-out', 'forwards');
      // … and the torn strip lifts off the envelope
      A(el.torn, [
        { transformOrigin: '100% 100%', transform: 'translateY(-34%) rotate(8.5deg)', opacity: 1 },
        { transformOrigin: '100% 100%', transform: 'translate(16%, -520%) rotate(15deg)', opacity: 0 }
      ], E.fly, 'cubic-bezier(.45,0,.8,.6)', 'forwards');
      // the pressed flower: a lane beside the card, never over the photo; off screen before home
      timers.push(setTimeout(() => accents('open', E.go - E.accents - 60), E.accents));
      A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.45,0,.2,1)');
      timers.push(setTimeout(() => {
        // out of the envelope: in front of it
        el.slot.style.clipPath = 'none';
        el.slot.style.zIndex = '6';
        A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: ENVELOPE_GEOMETRY.front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
        A(el.card, [{ filter: 'drop-shadow(0 6px 8px rgba(60, 40, 20, .16))' }, { filter: 'drop-shadow(0 22px 24px rgba(60, 40, 20, .28))' }], [0, E.forward[1]], 'ease-out', 'forwards');
      }, E.forward[0]));
      timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
    }

    // cancel the opening's script animations, not CSS ones
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
    // Skip: 'done', so a bfcache return clears the fallback fade
    document.querySelectorAll('[data-skip]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); reset(); state = 'done'; go(false); }));
    const rep = q('.replay');
    if (rep) rep.addEventListener('click', () => { reset(); requestAnimationFrame(() => play()); });
    const enter = q('[data-enter]');
    if (enter) enter.addEventListener('click', (e) => { e.preventDefault(); go(true); });

    // back/forward cache: card out as left — offer replay
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && state !== 'closed') {
        clearOpening();
        root.classList.add('is-opened');
        state = 'opened';
      }
    });
  }

  /* -- boot */
  function boot() {
    // without the platform: a design preview (placeholder labels, as in the panel)
    if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
    // RSVP: after a reply the closing hides its generic thank-you
    document.addEventListener('rsvp:state', (e) => {
      const st = e.detail && e.detail.state;
      if (st === 'success') root.setAttribute('data-rsvp-replied', '');
      else if (st === 'ready') root.removeAttribute('data-rsvp-replied');
    });
    fitPaper();
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

  /* dev fallback for the RSVP form: nothing is posted */
  function devRsvp() {
    document.querySelectorAll('form[data-rsvp-form]').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      const scope = form.closest('[data-rsvp]') || document;
      scope.querySelectorAll('[data-rsvp-state]').forEach((p) => { p.hidden = p.dataset.rsvpState !== 'preview'; });
    }));
  }

  /* == dev fallback: fills the markers like lib/theme/engine.ts (text / attributes only) */
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
      // "Add to calendar" needs the platform: here only the notice
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
