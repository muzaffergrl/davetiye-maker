// The shared map + directions block of the Details page (G127): one markup for every theme, filled by the engine into
// the template's <div data-map> marker. Styles: /site/map.css (theme fonts and colours through inherit/currentColor,
// overridable with --pmap-* tokens); behaviour: /site/map.js ("Show map" swaps the card for the Google Maps frame).
// Without JavaScript "Show map" is a plain link to Google Maps. Nothing is loaded from Google before the tap.

import { directionLinks, mapEmbedUrl, mapSearchUrl, type MapPlace } from '../maps.ts';

export const MAP_CSS = '/site/map.css';
export const MAP_JS = '/site/map.js';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const PIN =
  '<svg class="pmap-pin" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.5a7 7 0 0 0-7 7c0 5.1 7 12 7 12s7-6.9 7-12a7 7 0 0 0-7-7Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

export interface MapBlockOptions {
  /** The theme's button classes for "Show map" (data-map-btn), e.g. "btn btn-ghost". */
  buttonClass?: string;
  /** The theme's small button classes for the directions links (data-map-btn-sm), e.g. "btn btn-ghost btn-sm". */
  smallButtonClass?: string;
}

function classes(base: string, extra: string | undefined): string {
  return [base, ...(extra ?? '').split(/\s+/).filter((c) => /^[A-Za-z0-9_-]+$/.test(c))].join(' ');
}

function placeMarkup(place: MapPlace, labelled: boolean, opts: MapBlockOptions): string {
  const parts: string[] = [];
  const title = place.name || place.address || 'the venue';
  if (labelled) parts.push(`<p class="pmap-label">${esc(place.label)}</p>`);
  // the venue's name and address are on the page already (directions alone need no card); a map card or a second
  // place names its own
  const card = place.showMap;
  const text =
    (place.name ? `<p class="pmap-name">${esc(place.name)}</p>` : '') + (place.address ? `<p class="pmap-addr">${esc(place.address)}</p>` : '');
  if (card) {
    const btn = classes('pmap-show', opts.buttonClass);
    parts.push(
      `<div class="pmap-card" data-map-embed="${esc(mapEmbedUrl(place))}" data-map-title="${esc(`Map of ${title}`)}">` +
        `${PIN}${text}` +
        `<a class="${esc(btn)}" href="${esc(mapSearchUrl(place))}" target="_blank" rel="noopener noreferrer" data-map-show>Show map</a>` +
        `<p class="pmap-note">The map is loaded from Google Maps when you tap.</p>` +
        `</div>`,
    );
  } else if (place.key !== 'venue' && text) {
    parts.push(`<div class="pmap-text">${text}</div>`);
  }
  if (place.showDirections) {
    const links = directionLinks(place)
      .map(
        (l) =>
          `<a class="${esc(classes('pmap-dir-link', opts.smallButtonClass))}" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" data-directions="${l.id}" aria-label="${esc(`Directions to ${title} in ${l.label}`)}">${esc(l.label)}</a>`,
      )
      .join('');
    parts.push(`<div class="pmap-dir"><p class="pmap-dir-title">Get directions</p><div class="pmap-dir-links">${links}</div></div>`);
  }
  return `<div class="pmap-place" data-map-place="${place.key}">${parts.join('')}</div>`;
}

/** Inner HTML of the block for the places guests see (empty list -> ''). */
export function mapBlockHtml(places: readonly MapPlace[], opts: MapBlockOptions = {}): string {
  if (!places.length) return '';
  const labelled = places.length > 1;
  return places.map((p) => placeMarkup(p, labelled, opts)).join('');
}
