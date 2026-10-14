/* site.js — Dusty Blue & Champagne (02, G402). The platform writes the HTML + #site-data; DEV_CONTENT/devRender only
 * without it. README.md */
const MOTION = {
  // sessionStorage keys (+ ":<slug>") = the <head> scripts
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },

  // opening (catalogue: seal breaks free and falls, V flap opens upward, card rises from behind the pocket while one
  // eucalyptus leaf drifts down): [start ms after the tap, duration ms]
  envelope: {
    hint:    [0, 300],
    tug:     [0, 260],      // the envelope gives
    closure: [0, 1250],     // the seal pops free …
    fall:    [230, 1020],   // … and falls away, turning
    head:    [180, 620],    // kicker + names rise away
    lift:    [520, 820],    // V flap 0° → 90°
    open:    [560, 380],    // closed body → liner + pocket
    flap:    [1340, 780],   // open flap −90° → 0°
    rise:    [1680, 1420],  // card rises from behind the pocket
    forward: [3100, 780],   // … comes forward: 3.5 % up, × 1.09, shadow grows
    accents: 1400,          // the leaf
    go:      3650,          // to home, the card still moving (VT into the hero card)
    glide:   [300, 900],    // stage: down until the risen card fits; on its side also to the centre
    fadeOut: 420            // without cross-document VT
  },

  // entrances: scene → [[step, delay ms], …]
  scenes: {
    'home-hero':     [['decor', 0], ['card', 120], ['names', 620], ['date', 1380], ['venue', 1580], ['countdown', 1820], ['cta', 2120]],
    'home-invite':   [['host', 0], ['card', 140], ['name1', 700], ['amp', 1180], ['name2', 1320], ['words', 1640], ['request', 2080], ['date', 2320], ['sprig', 2540], ['venue', 2720]],
    'home-cal':      [['cal', 0]],
    'home-chapter':  [['fig', 0], ['text', 560]],
    'home-foot':     [['decor', 0], ['sign', 150], ['links', 860]],
    'story-head':    [['decor', 0], ['title', 120], ['kicker', 1040], ['lede', 1320]],
    'story-print':   [['print', 0], ['caption', 1050]],   // each print flies in, then its caption is written
    'story-next':    [['decor', 0], ['sprig', 150], ['link', 560]],
    'details-card':  [['decor', 0], ['kicker', 140], ['card', 340], ['title', 900], ['row', 1420]],
    'details-venue': [['photo', 0], ['body', 640], ['dress', 920], ['cal', 1140], ['action', 1340]],
    'details-block': [['sprig', 0], ['title', 300], ['body', 900], ['action', 1150]],
    'details-faq':   [['sprig', 0], ['title', 300], ['item', 950]],
    'details-next':  [['decor', 0], ['link', 300]],
    'rsvp-card':     [['decor', 0], ['card', 120], ['title', 700], ['kicker', 1300], ['button', 1640], ['sprig', 1880], ['wait', 2120], ['love', 2360], ['sign', 2600], ['seal', 2940]],
    'rsvp-form':     [['form', 0]],
    'rsvp-closing':  [['decor', 0], ['sprig', 150], ['title', 420], ['line', 1080], ['meta', 1320]]
  },
  stagger: 190,
  batchGap: 420,
  arriveDelay: 0,        // no wait after the card lands

  // particles (GPT accents)
  accents: {
    open:    [{ file: 'img/accent_1-149.webp', count: 1, path: 'fall', origin: 'top', dur: [2700, 2700], size: [44, 52], spread: 0, avoid: '.env .card' }],
    arrive:  [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 7600], size: [20, 26], spread: 1600, avoid: '.hero [data-slot]' }],
    closing: [{ file: 'img/accent_2-200.webp', count: 2, path: 'fall', origin: 'top', dur: [6400, 7800], size: [20, 26], spread: 1500 },
              { file: 'img/accent_1-149.webp', count: 1, path: 'fall', origin: 'top', dur: [6000, 6000], size: [34, 34], spread: 900 }]
  }
};

/* card path (% of its height, manifest stage.card_path) */
const ENVELOPE_GEOMETRY = { out: 'translateY(-91.99%)', front: 'translateY(-95.49%) scale(1.09)' };

/* DEV_CONTENT (no #site-data only) = content.demo.json */
const DEV_CONTENT = {
  record_kind: 'demo', event_type: 'wedding', locale: 'en-US',
  partners: [{ display_name: 'Eleanor', full_name: 'Eleanor Grace' }, { display_name: 'Theo', full_name: 'Theodore James' }],
  name_display: 'Eleanor & Theo', initials: 'E&T', host_line: 'Together with their families',
  date: '2027-09-18', ceremony_time: '16:30', timezone: 'America/New_York',
  venue: { name: 'Rosewood Manor', city: 'Charleston', region: 'South Carolina', country: 'USA', address: null },
  schedule: [
    { label: 'Ceremony', time: '16:30', location: 'The Garden Lawn' },
    { label: 'Cocktail Hour', time: '17:30', location: 'The Veranda' },
    { label: 'Reception', time: '18:30', location: 'The Grand Hall' }
  ],
  dress_code: 'Black tie optional',
  rsvp: { deadline: '2027-08-01', method: null },
  urls: { website: null, rsvp_form: null, map: null, registry: null, accommodation: null },
  media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null },
  optional_blocks: { our_story: true, countdown: true, dress_code: true, registry: true, travel_stay: true, faq: false, guest_policy: false },
  story: {
    intro: 'Coffee dates, sea breezes and all the quiet moments in between brought us to',
    items: [{ caption: 'Our first coffee' }, { caption: 'Sunset by the sea' }, { caption: 'Ever after' }]
  }
};

(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const crossDocVT = 'onpageswap' in window && typeof document.startViewTransition === 'function';
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

  const store = { set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const rand = (a, b) => a + Math.random() * (b - a);

  /* -- accents: fall / rise with sway; `avoid` (a photo) → a lane beside it (wider side first; size ≥ 28 px and sway
     shrink to fit: every accent is drawn) */
  function flightPath(path, W, H, s, i, avoid) {
    const kf = [];
    const N = 12;
    const down = path !== 'rise';
    const ph = rand(0, 6.28);
    let sway = rand(14, 30), x0 = rand(0.06, 0.94) * W, drift = rand(-0.16, 0.16) * W;
    if (avoid) {
      const lanes = [[0, avoid.left - 8], [avoid.right + 8, W]].sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]));
      const [a, b] = lanes[1][1] - lanes[1][0] >= 40 ? lanes[i % 2] : lanes[0];
      s = Math.max(28, Math.min(s, b - a - 8));
      sway = Math.min(sway, Math.max(0, (b - a - s) / 2));
      x0 = (a + b - s) / 2 + rand(-1, 1) * Math.max(0, (b - a - s) / 2 - sway); drift = 0;
    }
    const r0 = rand(-30, 30), r1 = r0 + rand(-160, 160);
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const x = x0 + drift * t + Math.sin(t * 6.28 * 1.1 + ph) * sway;
      const y = down ? -s - 10 + (H + 2 * s + 20) * t : H + s + 10 - (H + 2 * s + 20) * t;
      kf.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * t).toFixed(1)}deg) rotateY(${(Math.sin(t * 7 + ph) * 55).toFixed(1)}deg)`,
        opacity: k === 0 ? 0 : (k === N ? 0.5 : 0.96), offset: t });
    }
    return { kf, s };
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
        const { kf, s } = flightPath(g.path, W, H, rand(g.size[0], g.size[1]), i, av && av.getBoundingClientRect());
        const img = new Image();
        img.src = asset(g.file);
        img.alt = '';
        img.decoding = 'async';
        img.style.width = s.toFixed(1) + 'px';
        layer.appendChild(img);
        const delay = i * (g.gap || 420) + rand(0, g.spread || 0);
        const a = img.animate(kf, { duration: Math.min(rand(g.dur[0], g.dur[1]), (until || 1e9) - delay), delay, easing: 'linear', fill: 'both' });
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
    if (SITE) {
      const t = SITE.derived && Date.parse(SITE.derived.countdown_target_utc);
      return Number.isFinite(t) ? t : null;
    }
    try { return zonedToUtc(CONTENT.date, CONTENT.ceremony_time, CONTENT.timezone); }
    catch (e) { return Date.parse(CONTENT.date + 'T' + CONTENT.ceremony_time); }
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

  /* -- links without a URL (preview only) */
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

  /* -- text fitting: long values shrink, never under their floor */
  const fontPx = (el) => parseFloat(getComputedStyle(el).fontSize);
  // [data-fit="n"]: ≤ n lines of its CSS size
  function fitLines() {
    document.querySelectorAll('[data-fit]:not(.names)').forEach((el) => {
      el.style.setProperty('--fit', '1');
      const n = parseFloat(el.dataset.fit) || 2, lh = fontPx(el) * 1.16;
      for (let f = 1; f > 0.5 && el.offsetHeight > n * lh + 1; f -= 0.05) el.style.setProperty('--fit', (f - 0.05).toFixed(2));
    });
    document.querySelectorAll('.rsvp-text .card-title').forEach((el) => {
      el.style.setProperty('--fit', '1');
      for (let f = 1; f > 0.6 && el.scrollWidth > el.clientWidth + 1; f -= 0.04) el.style.setProperty('--fit', (f - 0.04).toFixed(2));
    });
    document.querySelectorAll('.cap, .mini-cap').forEach((el) => {
      el.classList.remove('cap-hide');
      el.style.setProperty('--fit', '1');
      const min = Math.ceil(Math.max(0.5, 11 / fontPx(el)) * 1000) / 1000;   // never under 11 px
      const over = () => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      for (let f = 1; f > min && over(); f -= 0.05) el.style.setProperty('--fit', Math.max(min, f - 0.05).toFixed(3));
      if (over() && el.matches('.mini-cap')) el.classList.add('cap-hide');
    });
  }
  // invitation card: names stay in the free_zone box
  function fitInvite() {
    const box = document.querySelector('.invite-text');
    if (!box) return;
    const over = () => box.scrollHeight > box.clientHeight + 1 || [...box.children].some((c) => c.scrollWidth > box.clientWidth + 1);
    box.style.setProperty('--fit', '1');
    for (let f = 1; f > 0.4 && over(); f -= 0.04) box.style.setProperty('--fit', (f - 0.04).toFixed(2));
  }
  // first screen: names ≤ share, ≥ floor; tight; countdown after the pill; a piece not ending above the nav starts below
  // the first screen (fold)
  function fitNames() {
    const targets = [['.env-head .names', 1.7, 0.22, 36], ['.hero .names', 3.2, 0.3, 36]]
      .map(([sel, ...a]) => [document.querySelector(sel), ...a]).filter(([el]) => el);
    const inner = document.querySelector('.hero-inner'), nav = document.querySelector('.site-nav');
    const bottom = (el) => { let y = el.offsetHeight; for (let e = el; e; e = e.offsetParent) y += e.offsetTop; return y; };
    const sv = () => { const p = document.createElement('i'); p.style.cssText = 'position:fixed;height:100svh'; document.body.append(p); const h = p.offsetHeight; p.remove(); return h || innerHeight; };
    const low = (h1) => {
      const hero = h1.closest('.hero');
      if (!hero || !inner || !nav) return false;
      const long = hero.classList.contains('is-long');
      return Math.max(...[...inner.children].filter((c) => !(long && c.matches('.countdown'))).map(bottom)) > sv() - nav.offsetHeight - 8;
    };
    const fit = (h1, maxLines, maxShare, minPx, navFloor) => {
      h1.style.setProperty('--names-scale', '1');
      const min = Math.min(1, Math.max(0.4, Math.ceil(minPx / fontPx(h1) * 1000) / 1000));
      for (let s = 1; ; s = Math.max(min, s - 0.06)) {
        h1.style.setProperty('--names-scale', s.toFixed(3));
        const h = h1.getBoundingClientRect().height, lines = h / (fontPx(h1) * 1.08);
        if (s <= min || (lines <= maxLines && h <= innerHeight * maxShare && (s <= navFloor || !low(h1)))) break;
      }
    };
    const fits = (c) => {
      const k = [...c.children].filter((p) => p.offsetParent);
      return !k.length || (Math.max(...k.map((p) => p.offsetTop + p.offsetHeight)) - Math.min(...k.map((p) => p.offsetTop)) <= c.clientHeight + 1
        && k.every((p) => p.scrollWidth <= c.clientWidth + 1));
    };
    const fitCopy = () => document.querySelectorAll('.card-copy').forEach((c) => {
      for (const d of ['', 'n', 'c n', 's c n', 's c d']) { c.dataset.drop = d; if (fits(c)) break; }
    });
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
    // a wrapping "Saturday · …" line: no dangling dot
    const stack = () => document.querySelectorAll('.dot').forEach((d) => {
      const p = d.parentNode, y = (e) => e ? e.getBoundingClientRect().top : NaN;
      p.classList.remove('is-stacked');
      if (Math.abs(y(d.previousElementSibling) - y(d)) > 2 || Math.abs(y(d.nextElementSibling) - y(d)) > 2) p.classList.add('is-stacked');
    });
    // envelope page: long names → the envelope shrinks (≥ 72 %) until the hint is on screen
    const fitEnv = () => {
      const pg = document.querySelector('.env-page'), hint = pg && pg.querySelector('.env-hint');
      if (!hint) return;
      pg.style.removeProperty('--env-fit');
      for (let f = 1; f > 0.73 && hint.offsetParent && bottom(hint) > sv() - 6; f -= 0.04) pg.style.setProperty('--env-fit', (f - 0.04).toFixed(2));
    };
    const run = () => {
      // the platform's preview bar: the hero still ends at the nav
      const bar = document.querySelector('[data-platform-preview-bar]');
      root.style.setProperty('--bar', (bar ? bar.offsetHeight : 0) + 'px');
      stack();
      fitCopy();
      fitLines();
      fitInvite();
      targets.forEach(([h1, maxLines, maxShare, minPx]) => {
        const hero = h1.closest('.hero');
        if (!hero) { fit(h1, maxLines, maxShare, minPx, 0); return fitEnv(); }
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
      env: q('.env'), closure: q('.closure'), closed: q('.env-closed'), cflap: q('.env-cflap'), flap: q('.env-flap'),
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
      if (withCard) { store.set(ARRIVE, '1'); el.card.style.viewTransitionName = 'invite-card'; }
      else el.card.style.viewTransitionName = 'none';   // skip: no card morph out of a closed envelope
      if (crossDocVT || reduce) { location.href = PAGES.home; return; }
      // no VT: fade out, home fades in
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
      A(el.env, [{ transform: 'scale(1)' }, { transform: 'scale(.988)', offset: .45 }, { transform: 'scale(1)' }], E.tug, 'ease-out', 'none');
      A(el.head, [{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,-18px,0)' }], E.head, 'ease-in', 'forwards');
      // the risen card (≈ its own height higher) keeps 12 px to the top: the stage glides down; on its side also to the centre
      const r = stage.getBoundingClientRect(), c = el.card.getBoundingClientRect();
      const dx = getComputedStyle(page).display === 'grid' ? innerWidth / 2 - r.left - r.width / 2 : 0, dy = Math.max(0, 12 + c.height - c.top);
      if (dx || dy) A(stage, [{ transform: 'none' }, { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` }], E.glide, 'cubic-bezier(.45,0,.25,1)', 'forwards');
      const cr = el.closure.getBoundingClientRect();
      const fall = Math.max(window.innerHeight - cr.top, cr.height) + cr.height * 0.4;
      const pop = E.fall[0] / (E.fall[0] + E.fall[1]);
      A(el.closure, [
        { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1, easing: 'cubic-bezier(.3,.8,.4,1)' },
        { transform: 'translate3d(0,-5%,0) rotate(-8deg) scale(1.07)', opacity: 1, offset: pop, easing: 'cubic-bezier(.55,0,.85,.4)' },
        { transform: `translate3d(${(cr.width * .16).toFixed(1)}px, ${(fall * .55).toFixed(1)}px, 0) rotate(16deg) scale(1.03)`, opacity: 1, offset: pop + (1 - pop) * .62, easing: 'cubic-bezier(.4,0,1,1)' },
        { transform: `translate3d(${(cr.width * .28).toFixed(1)}px, ${fall.toFixed(1)}px, 0) rotate(34deg) scale(1)`, opacity: .2 }
      ], [E.closure[0], E.fall[0] + E.fall[1]], 'linear', 'forwards');
      A(el.cflap, [
        { opacity: 1, transform: 'perspective(1000px) rotateX(0deg)', filter: 'brightness(1)', easing: 'cubic-bezier(.33,.1,.35,1)' },
        { opacity: 1, transform: 'perspective(1000px) rotateX(24deg)', filter: 'brightness(1.01)', offset: .3, easing: 'cubic-bezier(.4,0,.7,.7)' },
        { opacity: 1, transform: 'perspective(1000px) rotateX(80deg)', filter: 'brightness(.86)', offset: .9 },
        { opacity: 0, transform: 'perspective(1000px) rotateX(90deg)', filter: 'brightness(.82)' }
      ], E.lift, 'linear');
      A(el.body, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.pocket, [{ opacity: 0 }, { opacity: 1 }], [E.open[0], 80]);
      A(el.closed, [{ opacity: 1 }, { opacity: 0 }], E.open, 'ease-in-out');
      A(el.flap, [
        { opacity: 1, transform: 'perspective(1100px) rotateX(-90deg)', filter: 'brightness(.88)' },
        { opacity: 1, transform: 'perspective(1100px) rotateX(0deg)', filter: 'brightness(1)' }
      ], E.flap, 'cubic-bezier(.2,.7,.3,1)');
      timers.push(setTimeout(() => accents('open', E.go - E.accents - 80), E.accents));
      A(el.card, [{ transform: 'translateY(0)' }, { transform: ENVELOPE_GEOMETRY.out }], E.rise, 'cubic-bezier(.42,0,.18,1)');
      timers.push(setTimeout(() => {
        el.slot.style.clipPath = 'none';
        el.slot.style.zIndex = '6';
        // front: card top ≥ 12 px
        const r = el.card.getBoundingClientRect(), fix = Math.max(0, r.height * 0.08 + 12 - r.top);
        const front = ENVELOPE_GEOMETRY.front.replace(/translateY\(([^)]+)\)/, (m, v) => (fix ? `translateY(calc(${v} + ${fix.toFixed(1)}px))` : m));
        A(el.card, [{ transform: ENVELOPE_GEOMETRY.out }, { transform: front }], [0, E.forward[1]], 'cubic-bezier(.45,0,.2,1)', 'forwards');
        A(el.card, [{ filter: 'drop-shadow(0 6px 8px rgba(30,45,70,.16))' }, { filter: 'drop-shadow(0 30px 30px rgba(30,45,70,.3))' }], [0, E.forward[1]], 'ease-out', 'forwards');
      }, E.forward[0]));
      timers.push(setTimeout(() => { state = 'done'; go(true); }, E.go));
    }

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

    // bfcache: opened state + replay
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
    if (!SITE) { root.dataset.preview = 'true'; devRender(CONTENT); devRsvp(); }
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

  /* == dev fallback: fills the markers like lib/theme/engine.ts */
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
