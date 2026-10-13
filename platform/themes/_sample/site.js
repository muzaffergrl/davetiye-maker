// _sample theme script: shows how theme JS reads the injected site data.
// Choreography settings for real themes live at the top of their site.js (docs/10 §2).
(function () {
  'use strict';
  var el = document.getElementById('site-data');
  if (!el) return;
  var data;
  try {
    data = JSON.parse(el.textContent || '{}');
  } catch (e) {
    return;
  }
  var target = data.derived && data.derived.countdown_target_utc;
  var out = document.querySelector('[data-countdown]');
  if (out && target) {
    var days = Math.ceil((Date.parse(target) - Date.now()) / 86400000);
    out.textContent = days > 0 ? days + (days === 1 ? ' day' : ' days') : 'today';
  }
  document.documentElement.setAttribute('data-js', 'ready');
})();
