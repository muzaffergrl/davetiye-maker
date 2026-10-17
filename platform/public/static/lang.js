/* G144: language switcher of a couple's website (only on a site with more than one language; markup by the engine).
 * - closes the <details> menu on Escape / outside tap;
 * - first visit: when the browser prefers another of the site's languages than the one shown (and the address does not
 *   name a language), one small suggestion in THAT language links to it; dismissed for the visit (sessionStorage).
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
  var nav = document.querySelector('[data-pl-lang]');
  if (!nav || !data || !data.langs || data.langs.length < 2) return;
  var details = nav.querySelector('details');

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && details.open) {
      details.open = false;
      nav.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (details.open && !nav.contains(e.target)) details.open = false;
  });

  // the suggestion, written in the suggested language (these five lines are all it needs)
  var ASK = {
    en: 'Read this website in English',
    tr: 'Bu siteyi Türkçe okuyun',
    es: 'Leer este sitio en español',
    de: 'Diese Website auf Deutsch lesen',
    fr: 'Lire ce site en français'
  };
  var CLOSE = { en: 'Close', tr: 'Kapat', es: 'Cerrar', de: 'Schließen', fr: 'Fermer' };
  var key = 'pl-lang-tip:' + (data.slug || '');
  try {
    if (new URLSearchParams(location.search).has('lang') || sessionStorage.getItem(key)) return;
  } catch (e) {
    return;
  }
  var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  var want = null;
  for (var i = 0; i < prefs.length && !want; i++) {
    var base = String(prefs[i] || '').toLowerCase().split('-')[0];
    if (data.langs.indexOf(base) !== -1) want = base;
  }
  if (!want || want === data.lang) return;
  var link = nav.querySelector('a[data-lang="' + want + '"]');
  if (!link) return;
  var tip = document.createElement('div');
  tip.className = 'pl-lang-tip';
  tip.setAttribute('role', 'note');
  tip.setAttribute('lang', want);
  var a = document.createElement('a');
  a.href = link.getAttribute('href');
  a.hreflang = want;
  a.textContent = ASK[want] || link.textContent;
  var x = document.createElement('button');
  x.type = 'button';
  x.setAttribute('aria-label', CLOSE[want] || 'Close');
  x.textContent = '×';
  function forget() {
    try {
      sessionStorage.setItem(key, '1');
    } catch (e) {
      /* the tip simply shows again */
    }
  }
  x.addEventListener('click', function () {
    forget();
    tip.remove();
  });
  a.addEventListener('click', forget);
  tip.appendChild(a);
  tip.appendChild(x);
  document.body.appendChild(tip);
})();
