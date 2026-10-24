/* Demo bar (owner request 2026-10-23; data and rules: lib/marketing/demo-bar.ts, styles: /static/demo-bar.css).
   On a live demo (/start/demo/<theme>) a slim pill names the design; it opens a catalogue of the other designs (one tap
   = that design's demo, same page, same ?lang=), "Home" and "All designs" of the sales site. Reads #demo-bar-data (the
   words are already in the visitor's language). Draws nothing inside a frame (the /start preview, the sales site's demo
   dialog). No framework, no storage; the only request is the brand font.
   Search (owner request 2026-10-24): a field above the grid filters it as the visitor types — case, accents and Turkish
   ı/İ ignored, every typed word must match the design's name, number or search words (D.words, built from its copy). */
(function () {
  'use strict';
  var src = document.getElementById('demo-bar-data');
  if (!src || document.querySelector('[data-demo-bar-ui]')) return;
  var framed = true;
  try {
    framed = window.self !== window.top;
  } catch (e) {
    /* a cross-origin parent: framed */
  }
  if (framed) return;
  var D;
  try {
    D = JSON.parse(src.textContent || '');
  } catch (e) {
    return;
  }
  if (!D || !D.current || !D.copy || !D.links || !D.groups) return;

  var FONT = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&display=swap';
  var SVG = 'http://www.w3.org/2000/svg';
  var GRID = 'M4.5 4.5h5.5v5.5H4.5zM14 4.5h5.5v5.5H14zM4.5 14h5.5v5.5H4.5zM14 14h5.5v5.5H14z';
  var CHEVRON = 'M6 9.5l6 6 6-6';
  var CLOSE = 'M6.5 6.5l11 11M17.5 6.5l-11 11';
  var HOME = 'M4 11.5L12 4.5l8 7M6.5 9.5V19.5h11V9.5';
  var CHECK = 'M5.5 12.5l4 4 9-9';
  var ARROW = 'M5 12h13M13 6.5l5.5 5.5-5.5 5.5';
  var LENS = 'M10.5 4.5a6 6 0 1 0 0 12a6 6 0 1 0 0-12zM15 15l4.5 4.5';
  /* corner controls of the themes and the platform (sound, Skip, language) the pill keeps clear of */
  var CORNERS = '.snd,.skip,[data-skip],.pl-lang';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function attrs(n, a) {
    for (var k in a) n.setAttribute(k, a[k]);
    return n;
  }
  function icon(d, cls) {
    var s = document.createElementNS(SVG, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    if (cls) s.setAttribute('class', cls);
    var p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '1.8');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    s.appendChild(p);
    return s;
  }
  function mark() {
    var m = el('span', 'pdb-mark');
    m.appendChild(icon(GRID));
    return m;
  }
  function label() {
    var t = el('span', 'pdb-text');
    t.appendChild(el('span', 'pdb-eyebrow', D.copy.eyebrow));
    t.appendChild(el('span', 'pdb-name', D.current.name));
    return t;
  }
  function link(href, path, text, cls) {
    var a = el('a', cls);
    a.href = href;
    if (cls === 'pdb-link') a.appendChild(icon(path));
    a.appendChild(el('span', null, text));
    if (cls !== 'pdb-link') a.appendChild(icon(path));
    return a;
  }

  // ---------------------------------------------------------------- markup
  var root = el('div', 'pdb');
  root.setAttribute('data-demo-bar-ui', '');
  root.setAttribute('data-edge', 'top');
  root.lang = D.lang || 'en';

  var pill = attrs(el('button', 'pdb-pill'), {
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
    'aria-controls': 'pdb-panel',
    'aria-label': D.copy.eyebrow + ': ' + D.current.name + '. ' + D.copy.dialog,
  });
  pill.appendChild(mark());
  pill.appendChild(label());
  pill.appendChild(icon(CHEVRON, 'pdb-chev'));

  var backdrop = el('div', 'pdb-backdrop');
  backdrop.hidden = true;

  var panel = attrs(el('div', 'pdb-panel'), { id: 'pdb-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': D.copy.dialog });
  panel.hidden = true;

  var head = el('div', 'pdb-head');
  head.appendChild(mark());
  head.appendChild(label());
  var close = attrs(el('button', 'pdb-close'), { type: 'button', 'aria-label': D.copy.close });
  close.appendChild(icon(CLOSE));
  head.appendChild(close);
  panel.appendChild(head);

  var links = el('div', 'pdb-links');
  links.appendChild(link(D.links.home, HOME, D.copy.home, 'pdb-link'));
  links.appendChild(link(D.links.designs, GRID, D.copy.designs, 'pdb-link'));
  panel.appendChild(links);
  if (D.links.start) panel.appendChild(link(D.links.start, ARROW, D.copy.start, 'pdb-start'));

  // the search field: outside the scrolling grid, so it stays in view and never covers a card
  var find = attrs(el('div', 'pdb-search'), { role: 'search' });
  find.appendChild(attrs(el('label', 'pdb-sr', D.copy.search), { for: 'pdb-q' }));
  find.appendChild(icon(LENS, 'pdb-lens'));
  var input = attrs(el('input', 'pdb-input'), {
    type: 'search',
    id: 'pdb-q',
    placeholder: D.copy.search,
    enterkeyhint: 'search',
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    'aria-controls': 'pdb-list',
  });
  find.appendChild(input);
  var clear = attrs(el('button', 'pdb-clear'), { type: 'button', 'aria-label': D.copy.clear });
  clear.hidden = true;
  clear.appendChild(icon(CLOSE));
  find.appendChild(clear);
  panel.appendChild(find);

  var list = el('div', 'pdb-scroll');
  list.id = 'pdb-list';
  var current = null;
  var groups = [];
  var known = Object.create(null); // every search word of the list: a typed word that is one matches whole words only
  D.groups.forEach(function (g, gi) {
    var section = el('section', 'pdb-group');
    var title = el('h2', 'pdb-group-title');
    var count = el('span', 'pdb-count', String(g.items.length));
    var rows = [];
    groups.push({ section: section, count: count, rows: rows });
    title.id = 'pdb-group-' + gi;
    title.appendChild(el('span', null, g.label));
    title.appendChild(count);
    section.setAttribute('aria-labelledby', title.id);
    section.appendChild(title);
    var ul = el('ul', 'pdb-grid');
    g.items.forEach(function (it) {
      var li = el('li', 'pdb-cell');
      var a = el('a', 'pdb-item');
      a.href = it.href;
      var thumb = el('span', 'pdb-thumb');
      if (it.thumb) {
        var img = el('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = '';
        img.width = 150;
        img.height = 250;
        img.src = it.thumb;
        thumb.appendChild(img);
      }
      if (it.id === D.current.id) {
        a.setAttribute('aria-current', 'page');
        var check = el('span', 'pdb-check');
        check.appendChild(icon(CHECK));
        thumb.appendChild(check);
        current = a;
      }
      a.appendChild(thumb);
      a.appendChild(el('span', 'pdb-item-name', it.name));
      li.appendChild(a);
      ul.appendChild(li);
      var text = it.name;
      (it.k || []).forEach(function (i) {
        text += ' ' + ((D.words || [])[i] || '');
      });
      var w = words(text);
      w.forEach(function (x) {
        known[x] = 1;
      });
      rows.push({ li: li, a: a, no: it.no ? +it.no : -1, w: w });
    });
    section.appendChild(ul);
    list.appendChild(section);
  });
  var empty = el('div', 'pdb-empty');
  empty.hidden = true;
  var emptyText = el('p', 'pdb-empty-text');
  var all = attrs(el('button', 'pdb-all', D.copy.showAll), { type: 'button' });
  empty.appendChild(emptyText);
  empty.appendChild(all);
  list.appendChild(empty);
  panel.appendChild(list);
  var status = attrs(el('div', 'pdb-sr'), { role: 'status', 'aria-live': 'polite' });
  panel.appendChild(status);

  root.appendChild(pill);
  root.appendChild(backdrop);
  root.appendChild(panel);

  // ---------------------------------------------------------------- search
  // lower case, accents off (é → e, ü → u, ç → c, İ → i), Turkish dotless ı → i, ß → ss; split into words
  function words(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0131/g, 'i')
      .replace(/\u00df/g, 'ss')
      .replace(/\u0153/g, 'oe')
      .replace(/\u00e6/g, 'ae')
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);
  }
  // every typed word must match: a number = the design's number ("7", "07"); a whole search word = that word ("kır" is
  // not "kırmızı"); else the start of a word ("lav" → lavender), or a longer form of one ("roses", "zarflı")
  function hit(r, q) {
    for (var i = 0; i < q.length; i++) {
      var t = q[i];
      var ok = false;
      if (/^\d+$/.test(t)) ok = +t === r.no;
      else
        for (var j = 0; j < r.w.length && !ok; j++) {
          var w = r.w[j];
          ok = known[t] ? w === t : w.indexOf(t) === 0 || (w.length > 3 && t.indexOf(w) === 0);
        }
      if (!ok) return false;
    }
    return true;
  }
  var said = 0;
  function filter(speak) {
    var raw = input.value.trim();
    var q = words(raw);
    var n = 0;
    groups.forEach(function (g) {
      var c = 0;
      g.rows.forEach(function (r) {
        var on = !q.length || hit(r, q);
        r.li.hidden = !on;
        if (on) c++;
      });
      g.section.hidden = !c;
      g.count.textContent = String(c);
      n += c;
    });
    clear.hidden = !input.value;
    // while searching the panel keeps its full height: no jumping as results come and go
    if (input.value) root.setAttribute('data-q', '');
    else root.removeAttribute('data-q');
    empty.hidden = n > 0;
    emptyText.textContent = n ? '' : D.copy.noMatch.replace('{q}', raw);
    list.scrollTop = 0;
    // read out once the visitor pauses (aria-live, polite)
    clearTimeout(said);
    if (!speak) status.textContent = '';
    else
      said = setTimeout(function () {
        status.textContent = n ? D.copy.found.replace('{n}', n) : emptyText.textContent;
      }, 600);
  }
  function first() {
    for (var i = 0; i < groups.length; i++) for (var j = 0; j < groups[i].rows.length; j++) if (!groups[i].rows[j].li.hidden) return groups[i].rows[j].a;
    return null;
  }
  function reset(speak) {
    input.value = '';
    filter(speak);
  }
  input.addEventListener('input', function () {
    filter(true);
  });
  input.addEventListener('keydown', function (e) {
    if (e.isComposing) return;
    var a = first();
    if (e.key === 'Enter') {
      // Enter = the first design shown
      e.preventDefault();
      if (a && input.value.trim()) window.location.href = a.href;
    } else if (e.key === 'ArrowDown' && a) {
      e.preventDefault();
      a.focus();
    }
  });
  // the × in the field and "Show all designs": everything again, back in the field
  function again() {
    reset(true);
    input.focus();
  }
  clear.addEventListener('click', again);
  all.addEventListener('click', again);

  // ---------------------------------------------------------------- open / close
  function focusables() {
    return [].filter.call(panel.querySelectorAll('a[href], button, input'), function (n) {
      return n.getClientRects().length > 0;
    });
  }
  // Esc: clears the search first, closes on the next
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (input.value) reset(true);
      else hide(true);
    }
  }
  function onFocusIn(e) {
    if (!panel.contains(e.target)) close.focus({ preventScroll: true });
  }
  function show() {
    if (!panel.hidden) return;
    away(false);
    backdrop.hidden = false;
    panel.hidden = false;
    root.setAttribute('data-open', '');
    pill.setAttribute('aria-expanded', 'true');
    if (current) {
      // the current design in view (the list scrolls, never the page)
      var y = current.offsetTop - (list.clientHeight - current.offsetHeight) / 2;
      list.scrollTop = Math.max(0, y);
    }
    // a mouse or trackpad: straight into the search; a touch screen: no keyboard popping up
    (window.matchMedia && window.matchMedia('(pointer: fine)').matches ? input : close).focus({ preventScroll: true });
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocusIn, true);
  }
  function hide(restore) {
    if (panel.hidden) return;
    panel.hidden = true;
    backdrop.hidden = true;
    root.removeAttribute('data-open');
    pill.setAttribute('aria-expanded', 'false');
    window.removeEventListener('keydown', onKey, true);
    document.removeEventListener('focusin', onFocusIn, true);
    reset(false);
    if (restore) pill.focus({ preventScroll: true });
  }
  pill.addEventListener('click', function () {
    if (panel.hidden) show();
    else hide(true);
  });
  close.addEventListener('click', function () {
    hide(true);
  });
  backdrop.addEventListener('click', function () {
    hide(true);
  });
  // Tab stays inside the open catalogue
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var a = f[0];
    var z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault();
      z.focus();
    } else if (!e.shiftKey && document.activeElement === z) {
      e.preventDefault();
      a.focus();
    }
  });
  // the theme never hears the bar's taps, keys and typing (a tap on the pill must not open the envelope)
  ['click', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown', 'keyup', 'input', 'change'].forEach(function (type) {
    root.addEventListener(
      type,
      function (e) {
        e.stopPropagation();
      },
      { passive: true },
    );
  });
  // back from another demo (bfcache): closed
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) hide(false);
  });

  // ---------------------------------------------------------------- out of the way while scrolling down
  // only the visitor's own scrolling counts (some pages scroll themselves to a section on load)
  var isAway = false;
  var touched = false;
  var lastY = window.scrollY || 0;
  function away(on) {
    if (on === isAway) return;
    isAway = on;
    if (on) root.setAttribute('data-away', '');
    else root.removeAttribute('data-away');
  }
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (type) {
    window.addEventListener(
      type,
      function () {
        touched = true;
      },
      { passive: true, capture: true },
    );
  });
  window.addEventListener(
    'scroll',
    function () {
      var y = window.scrollY || 0;
      if (!touched || !panel.hidden) {
        lastY = y;
        return;
      }
      if (y <= 96) {
        away(false);
        lastY = y;
      } else if (y > lastY + 12) {
        away(true);
        lastY = y;
      } else if (y < lastY - 12) {
        away(false);
        lastY = y;
      }
    },
    { passive: true },
  );
  pill.addEventListener('focus', function () {
    away(false);
  });

  // ---------------------------------------------------------------- place: opposite the theme's nav, clear of corners
  var frame = 0;
  function place() {
    frame = 0;
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var vh = window.innerHeight;
    var bottom = false;
    var nav = document.querySelector('.site-nav');
    if (nav) {
      var n = nav.getBoundingClientRect();
      bottom = n.height > 0 && n.top < vh / 3 && getComputedStyle(nav).position === 'fixed';
    }
    root.setAttribute('data-edge', bottom ? 'bottom' : 'top');
    var left = 0;
    var right = 0;
    var found = document.querySelectorAll(CORNERS);
    for (var i = 0; i < found.length; i++) {
      var b = found[i].getBoundingClientRect();
      if (!b.width || !b.height) continue;
      if (bottom ? b.bottom < vh - 64 || b.top > vh : b.top > 56 || b.bottom < 0) continue;
      if (b.left + b.width / 2 < vw / 2) left = Math.max(left, b.right + 8);
      else right = Math.max(right, vw - b.left + 8);
    }
    // centred when there is room for a readable pill, else in the free span between the corners
    var side = Math.max(left, right, 60);
    if (vw - 2 * side >= 200) left = right = side;
    else {
      left = Math.max(left, 12);
      right = Math.max(right, 12);
    }
    root.style.setProperty('--pdb-l', left + 'px');
    root.style.setProperty('--pdb-r', right + 'px');
  }
  function later() {
    if (!frame) frame = requestAnimationFrame(place);
  }
  // the phone keyboard (the visual viewport shrinks, the page does not): the panel ends above it and drops the links
  var vv = window.visualViewport;
  function fit() {
    var kb = Math.abs(vv.scale - 1) < 0.01 && window.innerHeight - vv.height > 120;
    if (kb) {
      root.setAttribute('data-kb', '');
      root.style.setProperty('--pdb-vh', Math.round(vv.offsetTop + vv.height) + 'px');
    } else {
      root.removeAttribute('data-kb');
      root.style.removeProperty('--pdb-vh');
    }
  }
  if (vv) {
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);
  }

  // ---------------------------------------------------------------- mount
  if (!document.querySelector('link[data-pdb-font]')) {
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = FONT;
    font.setAttribute('data-pdb-font', '');
    document.head.appendChild(font);
  }
  document.body.appendChild(root);
  place();
  // the sound button (audio.js) and the theme's state classes arrive after this script; the sound button widens to a
  // "Play music" pill on a story page with music
  var ro = window.ResizeObserver ? new ResizeObserver(later) : null;
  function refresh() {
    if (ro) {
      var c = document.querySelectorAll(CORNERS);
      for (var i = 0; i < c.length; i++) ro.observe(c[i]);
    }
    later();
  }
  refresh();
  window.addEventListener('resize', later);
  window.addEventListener('load', refresh);
  if (window.MutationObserver) {
    var mo = new MutationObserver(refresh);
    mo.observe(document.body, { childList: true });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
})();
