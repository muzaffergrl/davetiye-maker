/* Platform map block script (G127). Served at /static/map.js; the theme engine links it on a page with a
 * <div data-map> block (lib/theme/map-block.ts). "Show map" swaps the static card for the Google Maps frame named in
 * the card's data-map-embed (nothing is loaded from Google before the tap). Without this script "Show map" stays a plain
 * link to Google Maps. No dependencies, no inline handlers (CSP: the page allows the frame's origin).
 */
(function () {
  'use strict';

  var EMBED = /^https:\/\/www\.google\.com\/maps\?/;

  function show(card, link) {
    var src = card.getAttribute('data-map-embed') || '';
    if (!EMBED.test(src)) return false;
    var frame = document.createElement('iframe');
    frame.src = src;
    frame.title = card.getAttribute('data-map-title') || 'Map';
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('loading', 'eager');
    var box = document.createElement('div');
    box.className = 'pmap-frame';
    box.appendChild(frame);
    var open = document.createElement('a');
    open.className = 'pmap-open';
    open.href = link.href;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open in Google Maps';
    card.classList.add('is-open');
    card.textContent = '';
    card.appendChild(box);
    card.appendChild(open);
    open.focus({ preventScroll: true });
    return true;
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var link = t && t.closest ? t.closest('[data-map-show]') : null;
    if (!link) return;
    var card = link.closest('.pmap-card');
    if (card && show(card, link)) e.preventDefault();
  });
})();
