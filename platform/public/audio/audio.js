/* Platform sound script (G126). Served at /audio/audio.js; the engine adds it to every theme page that has something to
 * play, with the settings in #site-data → "sound" (lib/audio/site-sound.ts):
 *
 *   { music: "/audio/music/first-light.mp3" | "/media/…" | null,   (story page only)
 *     effects: true, fx: "/audio/fx/" | "/audio/fx/<design pack>/", opening: [[ms, "seal"], …] (index page only),
 *     cues: ["page", …] }                                             (the theme's own cues on this page)
 *
 * - Effects (Web Audio, small mp3 files): the opening cues when the guest taps the envelope (.stage) or "Replay"
 *   (.replay), timed on the theme's choreography; a soft tick on links between pages; a chime when an RSVP is sent
 *   (form.js "rsvp:state" success). A theme plays its own cues with document.dispatchEvent(new CustomEvent(
 *   'invite:sfx', {detail: {name}})) — a page turned, a reply sealed (only names listed in "cues"; the files come from
 *   the design's pack). Nothing sounds before the guest's own tap (browser rules).
 * - Music (story page): tries to start after the page loads (allowed once the guest has tapped on the site in most
 *   browsers); if the browser blocks it, a small "Play music" button appears. Soft fade in / out, loops, pauses in a
 *   hidden tab, resumes where it was when the guest comes back to the story page.
 * - One sound button on every page (top left): music on/off on the story page, all sound on/off elsewhere. The choice
 *   is kept for the visit: sessionStorage "invite:sound:<slug>" = "off" ("invite:sound-at:<slug>" = music position).
 * No dependencies, no inline handlers (CSP), every storage access in try/catch.
 */
(function () {
  'use strict';

  var data;
  try {
    data = JSON.parse(document.getElementById('site-data').textContent);
  } catch (e) {
    return;
  }
  var S = data && data.sound;
  if (!S || (!S.effects && !S.music)) return;

  var FX_GAIN = 0.32;
  var MUSIC_VOL = 0.55;
  var root = document.documentElement;
  var suffix = data.slug ? ':' + data.slug : '';
  var PREF = 'invite:sound' + suffix;
  var AT = 'invite:sound-at' + suffix;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var framed = false;
  try {
    framed = window.top !== window;
  } catch (e) {
    framed = true;
  }

  function store(key, value) {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch (e) {}
  }
  function read(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  var muted = read(PREF) === 'off';

  /* ---------------------------------------------------------------- effects */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var out = null;
  var raw = {};
  var decoded = {};

  function fetchFx(name) {
    if (!raw[name]) {
      raw[name] = fetch(S.fx + name + '.mp3')
        .then(function (r) {
          return r.ok ? r.arrayBuffer() : null;
        })
        .catch(function () {
          return null;
        });
    }
    return raw[name];
  }
  function ensureCtx() {
    if (!AC || !S.effects) return null;
    if (!ctx) {
      try {
        ctx = new AC();
      } catch (e) {
        AC = null;
        return null;
      }
      out = ctx.createGain();
      out.gain.value = FX_GAIN;
      out.connect(ctx.destination);
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }
  function buffer(name) {
    if (!decoded[name]) {
      decoded[name] = fetchFx(name).then(function (ab) {
        if (!ab || !ctx) return null;
        return new Promise(function (ok) {
          // the callback form works in old Safari, the promise form everywhere else
          var p = ctx.decodeAudioData(ab.slice(0), ok, function () {
            ok(null);
          });
          if (p && p.then) p.then(ok, function () {
            ok(null);
          });
        });
      });
    }
    return decoded[name];
  }
  function play(name, maxLateMs) {
    if (muted || !S.effects || !ensureCtx()) return;
    var asked = Date.now();
    buffer(name).then(function (b) {
      if (!b || muted || Date.now() - asked > (maxLateMs || 350)) return;
      var src = ctx.createBufferSource();
      src.buffer = b;
      src.connect(out);
      src.start(0);
    });
  }

  var cues = [];
  var openingUntil = 0;
  function cancelOpening() {
    cues.splice(0).forEach(clearTimeout);
    openingUntil = 0;
  }
  function startOpening() {
    cancelOpening();
    var list = (S.opening || []).slice(0, reduce ? 1 : 99);
    if (!list.length || muted || !ensureCtx()) return;
    list.forEach(function (c) {
      buffer(c[1]);
    });
    list.forEach(function (c) {
      cues.push(setTimeout(function () {
        play(c[1]);
      }, c[0]));
    });
    openingUntil = Date.now() + list[list.length - 1][0] + 600;
  }

  function navigates(a, e) {
    if (!a || e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.origin !== location.origin) return false;
    return a.pathname !== location.pathname || a.search !== location.search;
  }

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t || t.closest('[data-sound-ui]')) return;
      ensureCtx();
      if (data.page === 'index') {
        if (t.closest('.replay')) {
          startOpening();
          return;
        }
        if (t.closest('[data-skip]')) {
          cancelOpening();
          play('tap');
          return;
        }
        if (t.closest('.stage')) {
          if (root.classList.contains('is-opened')) play('tap');
          else if (Date.now() > openingUntil) startOpening();
          return;
        }
      }
      if (navigates(t.closest('a[href]'), e)) play('tap', 150);
    },
    true
  );
  document.addEventListener('rsvp:state', function (e) {
    if (e.detail && e.detail.state === 'success') play('chime', 800);
  });
  var CUES = {};
  (S.cues || []).forEach(function (n) {
    CUES[n] = 1;
  });
  document.addEventListener('invite:sfx', function (e) {
    var name = e.detail && e.detail.name;
    if (typeof name === 'string' && CUES[name]) play(name, 400);
  });

  function idle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 1500);
  }
  if (S.effects) {
    idle(function () {
      var names = { tap: 1 };
      (S.opening || []).forEach(function (c) {
        names[c[1]] = 1;
      });
      if (document.querySelector('[data-rsvp-form]')) names.chime = 1;
      Object.keys(CUES).forEach(function (n) {
        names[n] = 1;
      });
      Object.keys(names).forEach(fetchFx);
    });
  }

  /* ------------------------------------------------------------------ music */
  var audio = null;
  var playing = false;
  var resumeOnShow = false;
  var fadeTimer = 0;

  function fade(to, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume;
    var t0 = Date.now();
    fadeTimer = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / ms);
      try {
        audio.volume = from + (to - from) * k;
      } catch (e) {}
      if (k >= 1) {
        clearInterval(fadeTimer);
        if (done) done();
      }
    }, 40);
  }
  function startMusic(byGuest) {
    if (!S.music) return;
    if (!audio) {
      audio = new Audio();
      audio.preload = 'none';
      audio.loop = true;
      audio.src = S.music;
      var at = parseFloat(read(AT) || '');
      if (at > 0) {
        audio.addEventListener('loadedmetadata', function once() {
          audio.removeEventListener('loadedmetadata', once);
          if (at < audio.duration) audio.currentTime = at;
        });
      }
    }
    try {
      audio.volume = 0;
    } catch (e) {}
    var p = audio.play();
    var ok = function () {
      playing = true;
      if (byGuest) {
        muted = false;
        store(PREF, null);
      }
      fade(MUSIC_VOL, 1600);
      render();
    };
    var blocked = function () {
      playing = false;
      render();
    };
    if (p && p.then) p.then(ok, blocked);
    else ok();
  }
  function stopMusic() {
    playing = false;
    if (audio) {
      var a = audio;
      fade(0, 450, function () {
        a.pause();
      });
    }
    render();
  }
  if (S.music) {
    document.addEventListener('visibilitychange', function () {
      if (!audio) return;
      if (document.hidden && playing) {
        resumeOnShow = true;
        audio.pause();
      } else if (!document.hidden && resumeOnShow) {
        resumeOnShow = false;
        audio.play().catch(function () {
          playing = false;
          render();
        });
      }
    });
    window.addEventListener('pagehide', function () {
      if (audio && audio.currentTime) store(AT, String(Math.floor(audio.currentTime)));
    });
    var saveData = navigator.connection && navigator.connection.saveData;
    window.addEventListener('load', function () {
      // inside the editor's preview, with Data Saver or after "off": wait for the guest's tap
      if (!muted && !framed && !saveData) setTimeout(function () {
        startMusic(false);
      }, 400);
    });
  }

  /* --------------------------------------------------------------- the button */
  var ICON_ON =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var ICON_OFF =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'snd';
  btn.setAttribute('data-sound-ui', '');

  // G144: the page's language (#site-data "i18n"; keys = the English text)
  var I18N = (data && data.i18n) || null;
  function T(text) {
    return (I18N && I18N[text]) || text;
  }

  function render() {
    var withMusic = Boolean(S.music);
    var pill = withMusic && !playing;
    btn.classList.toggle('snd--pill', pill);
    if (pill) {
      btn.innerHTML = '<span aria-hidden="true">♪</span> ';
      btn.appendChild(document.createTextNode(T('Play music')));
      btn.setAttribute('aria-label', T('Play music'));
    } else if (withMusic) {
      btn.innerHTML = ICON_ON;
      btn.setAttribute('aria-label', T('Turn music off'));
    } else {
      btn.innerHTML = muted ? ICON_OFF : ICON_ON;
      btn.setAttribute('aria-label', muted ? T('Turn sound on') : T('Turn sound off'));
    }
    btn.setAttribute('aria-pressed', String(!muted && (!withMusic || playing)));
  }
  btn.addEventListener('click', function () {
    if (S.music) {
      if (playing) {
        muted = true;
        store(PREF, 'off');
        stopMusic();
      } else startMusic(true);
      return;
    }
    muted = !muted;
    store(PREF, muted ? 'off' : null);
    if (muted) cancelOpening();
    render();
    if (!muted) play('tap');
  });

  function mount() {
    var cs = getComputedStyle(document.body);
    var bg = cs.backgroundColor;
    if (!bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg)) bg = getComputedStyle(root).backgroundColor;
    if (!bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg)) bg = '#fffdf8';
    var css =
      '.snd{position:fixed;z-index:55;top:calc(6px + env(safe-area-inset-top));left:8px;display:inline-flex;align-items:center;' +
      'justify-content:center;gap:6px;min-width:44px;min-height:44px;padding:0;border:1px solid color-mix(in srgb,currentColor 22%,transparent);' +
      'border-radius:999px;background:color-mix(in srgb,' + bg + ' 84%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);' +
      'color:' + cs.color + ';font:inherit;font-size:15px;line-height:1;cursor:pointer;opacity:.9;-webkit-tap-highlight-color:transparent;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.08);transition:opacity .2s}' +
      '.snd:hover{opacity:1}.snd:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
      '.snd--pill{padding:0 16px 0 14px;font-size:15px;letter-spacing:.02em}.snd--pill span{font-size:17px}' +
      '@media print{.snd{display:none}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    render();
    document.body.appendChild(btn);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
