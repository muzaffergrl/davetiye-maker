/* After Google's consent page (G128, lib/google/api.ts callbackPage): back to the couple's panel. Before leaving for
 * Google the panel kept its own path ("/edit/<slug>?k=…") in this tab's sessionStorage; it never leaves this browser. */
(function () {
  'use strict';
  var KEY = 'bke:google-return';
  var path = null;
  try {
    path = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
  } catch (e) {
    path = null;
  }
  if (!path || !/^\/edit\/[a-z0-9-]{1,64}\?k=[A-Za-z0-9_-]+$/.test(path)) return;
  var back = document.querySelector('[data-google-back]');
  var manual = document.querySelector('[data-google-manual]');
  if (back) {
    back.setAttribute('href', path + '#guests');
    back.hidden = false;
  }
  if (manual) manual.hidden = true;
  var ok = document.querySelector('[data-google-result="connected"]');
  if (ok) window.setTimeout(function () {
    window.location.replace(path + '#guests');
  }, 1200);
})();
