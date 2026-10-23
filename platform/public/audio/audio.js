/* Platform sound script (G126). Served at /audio/audio.js; the engine adds it to every theme page that has something to
 * play, with the settings in #site-data → "sound" (lib/audio/site-sound.ts):
 *
 *   { music: "/audio/music/first-light.mp3" | "/media/…" | null,   (story page only)
 *     effects: true, fx: "/audio/fx/" | "/audio/fx/<design pack>/",
 *     opening: [[ms, "seal"], [ms, "curtain", -0.4], …],               (index page only; the optional third number
 *                                                                     is a stereo pan, −1 left … 1 right)
 *     cues: ["page", …] }                                             (the theme's own cues on this page)
 *   "fx" is the shared effect library, or the design's own sound pack (K59; lib/audio/catalog.ts DesignSound.pack):
 *   the same player, only the files differ.
 *
 * - Effects (Web Audio, small stereo mp3 files): the opening cues when the guest taps the envelope (.stage) or
 *   "Replay" (.replay), timed on the theme's choreography; a soft tick on links between pages; a chime when an RSVP is
 *   sent (form.js "rsvp:state" success). A theme plays its own cues with document.dispatchEvent(new CustomEvent(
 *   'invite:sfx', {detail: {name}})) — a page turned, a reply sealed (only names listed in "cues"). Nothing sounds
 *   before the guest's own tap (browser rules).
 *   The files are fetched and decoded while the page is idle (an OfflineAudioContext decodes without a gesture), so
 *   the first cue is not late on a phone; at the tap every cue is scheduled on the audio clock (sample-accurate, not
 *   at the mercy of a busy main thread while the opening animates). If the clock is still waking up (iOS resumes
 *   asynchronously) the cues are placed relative to the tap; one that would sound more than 350 ms after its step is
 *   dropped. Muting, "Skip", a hidden tab or a replay fade the running opening out at once. Effects sit well under
 *   the music (−20…−24 LUFS files × FX_GAIN; music −17…−18 LUFS × MUSIC_VOL).
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

  var FX_GAIN = 0.5;
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
  var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  var LATE = 350;
  var ctx = null;
  var out = null;
  var decoder = null;
  var raw = {};
  var decoded = {};
  var clock =
    window.performance && performance.now
      ? function () {
          return performance.now();
        }
      : function () {
          return Date.now();
        };

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
      // older iOS only unlocks Web Audio once something has played inside the gesture
      try {
        var s = ctx.createBufferSource();
        s.buffer = ctx.createBuffer(1, 1, 22050);
        s.connect(ctx.destination);
        s.start(0);
      } catch (e) {}
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }
  // decoding needs a context but not a running one: before the tap an OfflineAudioContext does it (no autoplay
  // warning, no gesture); an AudioBuffer plays in any context of the page
  function decodingCtx() {
    if (ctx) return ctx;
    if (!decoder && OAC) {
      try {
        decoder = new OAC(2, 1, 44100);
      } catch (e) {
        OAC = null;
      }
    }
    return decoder;
  }
  function buffer(name) {
    if (!decoded[name]) {
      decoded[name] = fetchFx(name).then(function (ab) {
        var dc = decodingCtx();
        if (!ab || !dc) {
          if (ab) decoded[name] = null; // no context yet: decode again after the tap
          return null;
        }
        return new Promise(function (ok) {
          var fail = function () {
            ok(null);
          };
          // the callback form works in old Safari, the promise form everywhere else
          var p = dc.decodeAudioData(ab.slice(0), ok, fail);
          if (p && p.then) p.then(ok, fail);
        });
      });
    }
    return decoded[name];
  }
  // when the audio clock is running (resume() is asynchronous on iOS)
  function whenRunning(fn) {
    if (!ctx || ctx.state === 'running' || !ctx.resume) return fn();
    var done = false;
    var go = function () {
      if (!done) {
        done = true;
        fn();
      }
    };
    var p = ctx.resume();
    if (p && p.then) p.then(go, go);
    setTimeout(go, 600);
  }
  function source(b, dest, pan, when) {
    var src = ctx.createBufferSource();
    src.buffer = b;
    var to = dest;
    if (pan && ctx.createStereoPanner) {
      to = ctx.createStereoPanner();
      to.pan.value = Math.max(-1, Math.min(1, pan));
      to.connect(dest);
    }
    src.connect(to);
    src.start(when || 0);
    return src;
  }
  function play(name, maxLateMs) {
    if (muted || !S.effects || !ensureCtx()) return;
    var asked = clock();
    buffer(name).then(function (b) {
      if (!b || muted || !ctx) return;
      whenRunning(function () {
        if (!muted && clock() - asked <= (maxLateMs || LATE)) source(b, out, 0, 0);
      });
    });
  }

  var opening = null; // { gain, until }
  function cancelOpening() {
    if (opening && ctx) {
      var g = opening.gain;
      try {
        g.gain.setTargetAtTime(0, ctx.currentTime, 0.025);
      } catch (e) {
        g.gain.value = 0;
      }
      setTimeout(function () {
        try {
          g.disconnect();
        } catch (e) {}
      }, 300);
    }
    opening = null;
  }
  function openingRuns() {
    return opening && clock() < opening.until;
  }
  function startOpening() {
    cancelOpening();
    var list = (S.opening || []).slice(0, reduce ? 1 : 99);
    if (!list.length || muted || !ensureCtx()) return;
    var tapped = clock();
    var run = { gain: ctx.createGain(), until: tapped + list[list.length - 1][0] + 600 };
    run.gain.connect(out);
    opening = run;
    list.forEach(function (c) {
      buffer(c[1]).then(function (b) {
        if (!b || muted || opening !== run) return;
        whenRunning(function () {
          if (muted || opening !== run) return;
          var due = c[0] - (clock() - tapped); // ms from now until the cue's step
          if (due < -LATE) return;
          source(b, run.gain, c[2] || 0, ctx.currentTime + Math.max(0, due) / 1000 + 0.005);
        });
      });
    });
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
          else if (!openingRuns()) startOpening();
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
  var CUES = Object.create(null);
  (S.effects ? S.cues || [] : []).forEach(function (n) {
    CUES[n] = 1;
  });
  var hasCues = Object.keys(CUES).length > 0;
  document.addEventListener('invite:sfx', function (e) {
    var name = e.detail && e.detail.name;
    if (typeof name === 'string' && CUES[name]) play(name, 400);
  });

  // iOS: wake the audio clock on the first touch, so it is running by the time the tap's click arrives
  document.addEventListener(
    'touchend',
    function () {
      if (!muted && S.effects && (data.page === 'index' || hasCues)) ensureCtx();
    },
    { capture: true, passive: true, once: true }
  );
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelOpening();
  });

  function idle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 1200);
  }
  if (S.effects && !muted) {
    idle(function () {
      var names = { tap: 1 };
      (S.opening || []).forEach(function (c) {
        names[c[1]] = 1;
      });
      if (document.querySelector('[data-rsvp-form]')) names.chime = 1;
      Object.keys(CUES).forEach(function (n) {
        names[n] = 1;
      });
      // fetch + decode now, not at the tap (no first-play lag on phones)
      Object.keys(names).forEach(function (n) {
        buffer(n);
      });
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
