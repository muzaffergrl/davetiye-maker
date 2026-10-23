/* Demo bar (owner request 2026-10-23; data and rules: lib/marketing/demo-bar.ts, styles: /static/demo-bar.css).
   On a live demo (/start/demo/<theme>) a slim pill names the design; it opens a catalogue of the other designs (one tap
   = that design's demo, same page, same ?lang=), "Home" and "All designs" of the sales site. Reads #demo-bar-data (the
   words are already in the visitor's language). Draws nothing inside a frame (the /start preview, the sales site's demo
   dialog). No framework, no storage; the only request is the brand font. */
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
  /* corner controls of the themes and the platform (sound, Skip, language) the pill keeps clear of */
  var CORNERS = '.snd,.skip,[data-skip],.pl-lang';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
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

  var pill = el('button', 'pdb-pill');
  pill.type = 'button';
  pill.setAttribute('aria-haspopup', 'dialog');
  pill.setAttribute('aria-expanded', 'false');
  pill.setAttribute('aria-controls', 'pdb-panel');
  pill.setAttribute('aria-label', D.copy.eyebrow + ': ' + D.current.name + '. ' + D.copy.dialog);
  pill.appendChild(mark());
  pill.appendChild(label());
  pill.appendChild(icon(CHEVRON, 'pdb-chev'));

  var backdrop = el('div', 'pdb-backdrop');
  backdrop.hidden = true;

  var panel = el('div', 'pdb-panel');
  panel.id = 'pdb-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', D.copy.dialog);

  var head = el('div', 'pdb-head');
  head.appendChild(mark());
  head.appendChild(label());
  var close = el('button', 'pdb-close');
  close.type = 'button';
  close.setAttribute('aria-label', D.copy.close);
  close.appendChild(icon(CLOSE));
  head.appendChild(close);
  panel.appendChild(head);

  var links = el('div', 'pdb-links');
  links.appendChild(link(D.links.home, HOME, D.copy.home, 'pdb-link'));
  links.appendChild(link(D.links.designs, GRID, D.copy.designs, 'pdb-link'));
  panel.appendChild(links);
  if (D.links.start) panel.appendChild(link(D.links.start, ARROW, D.copy.start, 'pdb-start'));

  var list = el('div', 'pdb-scroll');
  var current = null;
  D.groups.forEach(function (g, gi) {
    var section = el('section', 'pdb-group');
    var title = el('h2', 'pdb-group-title');
    title.id = 'pdb-group-' + gi;
    title.appendChild(el('span', null, g.label));
    title.appendChild(el('span', 'pdb-count', String(g.items.length)));
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
        img.width = 160;
        img.height = 200;
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
    });
    section.appendChild(ul);
    list.appendChild(section);
  });
  panel.appendChild(list);

  root.appendChild(pill);
  root.appendChild(backdrop);
  root.appendChild(panel);

  // ---------------------------------------------------------------- open / close
  function focusables() {
    return panel.querySelectorAll('a[href], button');
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      hide(true);
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
    close.focus({ preventScroll: true });
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
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  // the theme never hears the bar's taps and keys (a tap on the pill must not open the envelope)
  ['click', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown', 'keyup'].forEach(function (type) {
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
