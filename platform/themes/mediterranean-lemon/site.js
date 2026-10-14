/* site.js — Mediterranean Lemon (05, G405): motion, envelope, name fit, countdown. The platform writes the HTML and
 * #site-data (no content record); DEV_CONTENT + devRender() only without it. Hooks, reasons: README.md. */
const MOTION = {
  // sessionStorage keys (+ ":<slug>"), shared with the inline <head> scripts
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // opening (docs/11 §7.3, catalogue: "the lemon tie slips loose and rolls away, the white flap opens upward to reveal
  // the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom
  // drifts down"): [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 300],      // "Tap to open" fades
    tug:     [0, 300],      // the envelope gives under the finger
    closure: [0, 1300],     // the lemon tie slips loose (first motion < 250 ms), drops off the tip and rolls away
    head:    [180, 620],    // "You are invited" + names rise away
    lift:    [560, 880],    // the white scalloped flap lifts toward the viewer on its hinge, 0° → 90°
    open:    [600, 420],    // closed body → open body (tile lining + pocket), under the lifting flap
    flap:    [1420, 780],   // the open flap with its tile liner stands up from −90° (opens upward)
    rise:    [1800, 1420],  // the card rises out of the pocket
    sway:    [1800, 1900],  // the top-left lemon branch sways in (design key)
    accents: 1950,          // one blossom drifts down beside the card, gone before `go`
    forward: [3220, 640],   // the card comes forward where it is (× 1.04)
    go:      4120,          // to home (the card flies into the hero card)
    fadeOut: 420            // fade without cross-document view transitions
  },

  // entrances: scene → [[step, delay ms], …], never all at once
  scenes: {
    'home-hero':      [['decor', 0], ['card', 100], ['names', 620], ['date', 1380], ['venue', 1600], ['countdown', 1860], ['cta', 2140]],
    'home-invite':    [['card', 0], ['host', 560], ['name1', 760], ['amp', 1280], ['name2', 1420], ['request', 1980], ['date', 2240], ['venue', 2560], ['cta', 2820], ['cal', 3040]],
    'home-panels':    [['sprig', 0], ['panel', 260]],              // the two tile panels turn in, one after the other
    'home-foot':      [['decor', 0], ['sign', 160], ['links', 760]],
    'story-head':     [['decor', 0], ['title', 120], ['kicker', 1000], ['lede', 1280]],
    'story-tile':     [['panel', 0], ['caption', 900]],              // each panel turns in as it comes into view, then its caption
    'story-next':     [['decor', 0], ['sprig', 200], ['link', 600]],
    'details-card':   [['decor', 0], ['kicker', 120], ['card', 320], ['title', 860], ['row', 1440], ['cal', 2420]],
    'details-venue':  [['photo', 0], ['body', 640], ['dress', 1000], ['action', 1220]],
    'details-block':  [['sprig', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq':    [['sprig', 0], ['title', 300], ['item', 950]],
    'details-next':   [['decor', 0], ['link', 300]],
    'rsvp-card':      [['decor', 0], ['card', 120], ['title', 720], ['kicker', 1420], ['deadline', 1580], ['button', 1860], ['wait', 2140], ['love', 2380], ['sign', 2660], ['tie', 2920]],
    'rsvp-form':      [['form', 0]],
    'rsvp-closing':   [['decor', 0], ['title', 220], ['line', 900], ['meta', 1150]]
  },
  stagger: 200,          // data-i / repeated rows spacing inside one step
  batchGap: 380,         // scenes entering together play in sequence
  arriveDelay: 0,        // from the envelope: the names start as the card morph (.9 s) lands

  // particles (GPT accents): moment → groups, one kind each (docs/11 §8); 'drift' = a slow fall with sway that fades
  // out before the bottom; `avoid` keeps a lane beside a photo (never over it)
  accents: {
    open:    [{ file: 'img/accent_2-200.webp', count: 1, path: 'drift', origin: 'top', dur: [2100, 2100], size: [30, 36], spread: 0, avoid: '.env .card' }],
    arrive:  [{ file: 'img/accent_2-200.webp', count: 2, path: 'drift', origin: 'top', dur: [6000, 7400], size: [22, 28], spread: 1400, avoid: '.hero [data-slot]' }],
    closing: [{ file: 'img/accent_2-200.webp', count: 3, path: 'drift', origin: 'top', dur: [6400, 8200], size: [20, 28], spread: 1800 },
              { file: 'img/accent_3-200.webp', count: 1, path: 'across', origin: 'right', dur: [5600, 5600], size: [60, 60], spread: 600 }]
  }
};

/* card path (% of its height, manifest stage.card_path) */
const ENVELOPE_GEOMETRY = { out: 'translateY(-86.959%)', front: 'translateY(-83.959%) scale(1.04)' };

/* DEV_CONTENT (no #site-data only) = content.demo.json */
const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Isabella', full_name: 'Isabella Marie' }, { display_name: 'Marco', full_name: 'Marco Antonio' }],
  name_display: 'Isabella & Marco', initials: 'I&M', host_line: 'Together with their families',
  date: '2027-06-12', ceremony_time: '16:00', timezone: 'Europe/Rome',
  venue: { name: 'Villa Limonaia', city: 'Sorrento', region: 'Campania', country: 'Italy', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:00', location: 'The Lemon Grove' },
    { label: 'Cocktail Hour', time: '17:00', location: 'The Sea Terrace' },
    { label: 'Reception', time: '18:30', location: 'The Villa Courtyard' }
  ],
  dress_code: 'Summer formal',
  rsvp: { deadline: '2027-05-01', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Under the lemon trees, one sunny day at a time, we found our way to',
    items: [{ caption: 'On the piazza' }, { caption: 'Above the sea' }, { caption: 'Our sweetest yes' }]
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

  /* -- accents (GPT accent parts, MOTION.accents) */
  function flightPath(path, origin, W, H, s, i, avoid) {
    const kf = [];
    const N = 12;
    if (path === 'across') {
      // a leaf glides across the lower part of the screen, below the text
      const ltr = origin !== 'right';
      const y0 = H * (0.62 + 0.1 * i + rand(-0.03, 0.03));
      const lift = rand(-0.12, -0.06) * H;
      const amp = rand(14, 24), ph = rand(0, 6.28);
      const r0 = rand(-24, -6), spin = rand(40, 80) * (ltr ? 1 : -1);
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = ltr ? -s * 1.3 + (W + s * 2.6) * t : W + s * 0.3 - (W + s * 2.6) * t;
        const y = y0 + lift * t + Math.sin(t * 6.28 * 1.1 + ph) * amp;
        kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + spin * t + Math.sin(t * 7 + ph) * 10).toFixed(1)}deg) rotateY(${(Math.sin(t * 9.4 + ph) * 48).toFixed(1)}deg)`,
          opacity: k === 0 ? 0 : (k === N ? 0 : 0.96), offset: t });
      }
      return kf;
    }
    // drift (a blossom floating down, fading out before the bottom) / fall; `avoid` (a photo's box): a lane beside it
    const drift = path === 'drift';
    const sway = rand(12, 26), ph = rand(0, 6.28);
    let x0 = rand(0.06, 0.94) * W, dx = rand(-0.14, 0.14) * W;
    if (avoid) {
      const lanes = [[sway, avoid.left - s - sway], [avoid.right + sway, W - s - sway]].filter(([a, b]) => b > a);
      if (!lanes.length) return null;
      const [a, b] = lanes[(i + (Math.random() < 0.5 ? 0 : 1)) % lanes.length];
      x0 = rand(a, b); dx = 0;
    }
    const yEnd = drift ? H * rand(0.72, 0.86) : H + s + 10;
    const r0 = rand(0, 360), r1 = r0 + rand(-160, 160);
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const x = x0 + dx * t + Math.sin(t * 6.28 + ph) * sway;
      const y = -s - 10 + (yEnd + s + 10) * t;
      kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * t).toFixed(1)}deg) rotateX(${(Math.sin(t * 8 + ph) * 40).toFixed(1)}deg)`,
        opacity: k === 0 ? 0 : (drift ? (t > 0.8 ? Math.max(0, (1 - t) / 0.2) * 0.95 : 0.95) : (k === N ? 0.6 : 0.95)), offset: t });
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
        const kf = flightPath(g.path, g.origin, W, H, s, i, av && av.getBoundingClientRect());
        if (!kf) continue;
        const img = new Image();
        img.src = asset(g.file);
        img.alt = '';
        img.decoding = 'async';
        img.style.width = s.toFixed(1) + 'px';
        layer.appendChild(img);
        // `until` ms: off screen before home
        const delay = i * (g.gap || 520) + rand(0, g.spread || 0);
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
        let base = i * MOTION.batchGap;
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

  /* -- long names, the hero's first screen, card copy (README "Home first screen") */
  function fitNames() {
    const targets = [['.env-head .names', 2.15, 0.22, 0], ['.hero .names', 3.2, 0.3, 36]]
      .map(([sel, ...a]) => [document.querySelector(sel), ...a]).filter(([el]) => el);
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
        const h = h1.getBoundingClientRect().height, lines = h / (parseFloat(getComputedStyle(h1).fontSize) * 1.08);
        if (s <= min || (lines <= maxLines && h <= innerHeight * maxShare && (s <= navFloor || !low(h1)))) break;
      }
    };
    // card copy ≥ 11 px: date · town on one line, else two lines, else no town, else no script, else nothing
    const fits = (c) => {
      const k = [...c.children].filter((p) => p.offsetParent);
      return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
        && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
    };
    const oneLine = (c) => { const k = c.querySelector('.kicker'); return !k || k.offsetHeight <= parseFloat(getComputedStyle(k).lineHeight) * 1.5; };
    const fitCopy = () => document.querySelectorAll('.card-copy').forEach((c) => {
      for (const [wrap, d] of [[false, ''], [true, ''], [true, 'c'], [true, 'c s']]) {
        c.toggleAttribute('data-wrap', wrap);
        c.dataset.drop = d;
        if (fits(c) && (wrap || oneLine(c))) break;
      }
    });
    // fold: a hero piece not ending above the nav starts below the first screen, never half under it; a pill left above
    // keeps the backdrop (--fold: scene-bg ends after it)
    const top = (el) => bottom(el) - el.offsetHeight;
    const pieces = () => [...inner.children].filter((c) => c.offsetParent && !c.matches('.hero-card'));
    const unfold = (hero) => {
      pieces().forEach((c) => c.style.removeProperty('margin-top'));
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
      for (let i = 0; i < 4 && c && top(c) < below - 0.5; i++, c = cut()) c.style.marginTop = `${parseFloat(getComputedStyle(c).marginTop) + below - top(c)}px`;
      if (keep) hero.style.setProperty('--fold', `${Math.max(0, hero.offsetHeight - end)}px`);
    };
    // hero: names ≤ 30 %; tight + names ≥ 36 px; countdown after the pill; else it scrolls; then fold
    const run = () => {
      fitCopy();
      targets.forEach(([h1, maxLines, maxShare, minPx]) => {
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
    };
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    if (window.ResizeObserver) { const ro = new ResizeObserver(fitCopy); document.querySelectorAll('.card-copy').forEach((c) => ro.observe(c)); }
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
  }

  /* -- envelope (index page) */
  function initEnvelope() {
    const page = document.querySelector('.env-page');
    if (!page) return;
    const q = (s) => page.querySelector(s);
    const stage = q('.stage');
    const el = {
      env: q('.env'), cflap: q('.env-cflap'), closure: q('.closure'), closed: q('.env-closed'), flap: q('.env-flap'),
      body: q('.env-body'), pocket: q('.env-pocket'), slot: q('.card-slot'), card: q('.card'), head: q('.env-head'), hint: q('.env-hint'),
      branch: document.querySelector('.scene-bg .corner-tl')
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
      node && node.animate(kf, { delay, duration, easing: easing || 'cubic-bezier(.22,.61,.36,1)', fill: fill || 'both' });

    function play() {
      if (state !== 'closed') return;
      state = 'playing';
      prefetchHome();
      if (reduce || !Element.prototype.animate) { go(false); return; }
      A(el.hint, [{ opacity: 1 }, { opacity: 0 }], E.hint, 'ease-out', 'forwards');
      A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .4 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
      // the lemon tie slips loose (ribbon gives, the lemon lifts a hair), drops off the tip and rolls away to the right,
      // turning about the lemon (site.css transform-origin = the lemon's centre)
      A(el.closure, [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1, easing: 'cubic-bezier(.3,.7,.4,1)' },
        { transform: 'translate(-1.5%, -3%) rotate(-6deg)', opacity: 1, offset: .13, easing: 'cubic-bezier(.5,0,.8,.6)' },
        { transform: 'translate(5%, 7%) rotate(14deg)', opacity: 1, offset: .3, easing: 'cubic-bezier(.4,0,.9,.7)' },
        { transform: 'translate(118%, 20%) rotate(190deg)', opacity: 1, offset: .82, easing: 'linear' },
        { transform: 'translate(190%, 24%) rotate(300deg)', opacity: 0 }
      ], E.closure, 'linear', 'forwards');
      A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
      // the white flap lifts toward the viewer on its hinge, fading from 82° (no 1 px strip at 90°)
      A(el.cflap, [
        { opacity: 1, transform: 'perspective(1000px) rotateX(0deg)', filter: 'brightness(1)', easing: 'cubic-bezier(.33,.1,.35,1)' },
        { opacity: 1, transform: 'perspective(1000px) rotateX(24deg)', filter: 'brightness(1.01)', offset: .3, easing: 'cubic-bezier(.4,0,.7,.7)' },
        { opacity: 1, transform: 'perspective(1000px) rotateX(82deg)', filter: 'brightness(.9)', offset: .9 },
        { opacity: 0, transform: 'perspective(1000px) rotateX(90deg)', filter: 'brightness(.86)' }
      ], E.lift, 'linear');
      // closed body → open body (tile lining) + pocket, under the lifting flap
      A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
      // the open flap (its tile liner) takes over at −90° and stands up
      A(el.flap, [
        { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)', filter: 'brightness(.88)' },
        { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)', filter: 'brightness(1)' }
      ], E.flap, 'cubic-bezier(.2,.7,.3,1)');
      // the lemon branch sways in from the top corner and stays a little further in
      A(el.branch, [
        { transform: 'translate(0, 0) rotate(0deg)' },
        { transform: 'translate(-1.5%, -1.5%) rotate(-2.5deg)', offset: .22 },
        { transform: 'translate(3%, 3%) rotate(5deg)', offset: .62 },
        { transform: 'translate(2%, 2%) rotate(2.5deg)' }
      ], E.sway, 'ease-in-out', 'forwards');
      timers.push(setTimeout(() => accents('open', E.go - E.accents - 60), E.accents));
      A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.42,0,.18,1)');
      timers.push(setTimeout(() => {
        // out of the pocket: in front of the envelope
        el.slot.style.clipPath = 'none';
        el.slot.style.zIndex = '6';
        A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: ENVELOPE_GEOMETRY.front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
        A(el.card, [{ filter: 'drop-shadow(0 6px 8px rgba(30,50,85,.14))' }, { filter: 'drop-shadow(0 22px 26px rgba(30,50,85,.24))' }], [0, E.forward[1]], 'ease-out', 'forwards');
      }, E.forward[0]));
      timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
    }

    // cancel the opening's script animations, not CSS ones
    function cancelScripted() {
      const nodes = [page, el.branch].filter(Boolean);
      nodes.forEach((n) => n.getAnimations({ subtree: true }).concat(n.getAnimations())
        .filter((a) => !(window.CSSAnimation && a instanceof CSSAnimation))
        .forEach((a) => a.cancel()));
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
