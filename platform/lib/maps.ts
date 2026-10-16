// Map + directions of the Details page (G127). Pure functions: the theme engine (server), the panel (browser) and the
// short-link resolver use them.
//
// Privacy first, no API key: guests first see a static card (place name, address, "Show map"); only a tap loads the
// Google Maps embed (https://www.google.com/maps?q=…&output=embed). Directions are plain links to Google Maps, Apple
// Maps and Waze. A place is found by its pin (lat/lng read from the couple's map link) or else by its address text.

import type { MapPlaceSettings } from './content/types.ts';

export type MapPlaceKey = 'venue' | 'reception';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapPlace {
  key: MapPlaceKey;
  /** Heading shown while two places are on the page ("Ceremony" / "Reception" or the couple's own). */
  label: string;
  name: string;
  /** One line under the name: street address, city, region, country (empty when there is none). */
  address: string;
  /** What the map and the directions look for: "lat,lng", else the place text. */
  destination: string;
  coords: LatLng | null;
  /** The couple's own map link (http/https), if any. */
  link: string | null;
  showMap: boolean;
  showDirections: boolean;
}

/** The only origin the map frame loads from (page CSP frame-src). */
export const MAP_FRAME_ORIGIN = 'https://www.google.com';
export const DEFAULT_LABELS: Readonly<Record<MapPlaceKey, string>> = { venue: 'Ceremony', reception: 'Reception' };

const NUM = String.raw`(-?\d{1,3}(?:\.\d+)?)`;
const PAIR_RE = new RegExp(String.raw`^\s*${NUM}\s*,\s*${NUM}\s*$`);

function validPair(lat: number, lng: number): LatLng | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat: round(lat), lng: round(lng) };
}

function round(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** "40.1,-73.2" -> pin; anything else null. */
export function parseLatLng(text: string | null | undefined): LatLng | null {
  const m = PAIR_RE.exec(text ?? '');
  return m ? validPair(Number(m[1]), Number(m[2])) : null;
}

function parseUrl(raw: string | null | undefined): URL | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const u = new URL(raw.trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u : null;
  } catch {
    return null;
  }
}

/**
 * The pin of a map link, when the link carries one: Google Maps (…!3d<lat>!4d<lng>, /@<lat>,<lng>,…, ?q= / query= /
 * destination= / ll=), Apple Maps (?ll= / q= / daddr= / coordinate=), Waze (?ll=), OpenStreetMap (?mlat=&mlon=, #map=z/lat/lng).
 * Short links (maps.app.goo.gl/…) carry none: see isShortMapLink.
 */
export function coordsFromMapLink(raw: string | null | undefined): LatLng | null {
  const u = parseUrl(raw);
  if (!u) return null;
  let text = u.pathname + u.hash;
  try {
    text = decodeURIComponent(text);
  } catch {
    /* keep as written */
  }
  text = text.replace(/\+/g, ' ');
  // the place's own pin first (the @ part is only where the map was looking)
  const pin = new RegExp(String.raw`!3d${NUM}!4d${NUM}`).exec(u.href);
  if (pin) {
    const p = validPair(Number(pin[1]), Number(pin[2]));
    if (p) return p;
  }
  const mlat = u.searchParams.get('mlat');
  const mlon = u.searchParams.get('mlon');
  if (mlat && mlon) {
    const p = validPair(Number(mlat), Number(mlon));
    if (p) return p;
  }
  for (const key of ['q', 'query', 'destination', 'daddr', 'll', 'sll', 'coordinate', 'center']) {
    const p = parseLatLng(u.searchParams.get(key));
    if (p) return p;
  }
  const at = new RegExp(String.raw`@${NUM},${NUM}`).exec(text);
  if (at) {
    const p = validPair(Number(at[1]), Number(at[2]));
    if (p) return p;
  }
  const osm = new RegExp(String.raw`#map=\d+/${NUM}/${NUM}`).exec(u.href);
  if (osm) {
    const p = validPair(Number(osm[1]), Number(osm[2]));
    if (p) return p;
  }
  return null;
}

/** The place name a Google Maps link names (/maps/place/<name>/ or ?q=<text>), else null. */
export function placeTextFromMapLink(raw: string | null | undefined): string | null {
  const u = parseUrl(raw);
  if (!u) return null;
  const place = /\/maps\/place\/([^/@]+)/.exec(u.pathname);
  const pick = (s: string | null) => {
    if (!s) return null;
    let t = s;
    try {
      t = decodeURIComponent(s.replace(/\+/g, ' '));
    } catch {
      /* keep as written */
    }
    t = t.replace(/\s+/g, ' ').trim();
    return t && !parseLatLng(t) && t.length <= 200 ? t : null;
  };
  return pick(place?.[1] ?? null) ?? pick(u.searchParams.get('q')) ?? pick(u.searchParams.get('query')) ?? pick(u.searchParams.get('daddr'));
}

const SHORT_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl', 'g.co', 'maps.apple']);

/** A share link that only redirects (maps.app.goo.gl/…, goo.gl/maps/…): the panel asks the server to read its target. */
export function isShortMapLink(raw: string | null | undefined): boolean {
  const u = parseUrl(raw);
  if (!u || u.protocol !== 'https:') return false;
  const host = u.hostname.toLowerCase();
  if (host === 'goo.gl') return u.pathname.startsWith('/maps/');
  if (host === 'g.co') return u.pathname.startsWith('/kgs/');
  return SHORT_HOSTS.has(host);
}

function clean(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
}

function joinParts(parts: unknown[]): string {
  const out: string[] = [];
  for (const p of parts.map(clean)) {
    if (p && !out.some((o) => o.toLowerCase() === p.toLowerCase())) out.push(p);
  }
  return out.join(', ');
}

function pinOf(settings: MapPlaceSettings | undefined | null, link: string | null): LatLng | null {
  const lat = settings?.lat;
  const lng = settings?.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    const p = validPair(lat, lng);
    if (p) return p;
  }
  return coordsFromMapLink(link);
}

interface PlaceInput {
  key: MapPlaceKey;
  settings: MapPlaceSettings | null | undefined;
  name: string;
  street: string;
  rest: unknown[];
  link: string | null;
}

function buildPlace(i: PlaceInput): MapPlace | null {
  if (!i.name && !i.street && !i.link) return null;
  const coords = pinOf(i.settings, i.link);
  const linkText = placeTextFromMapLink(i.link);
  const address = joinParts([i.street, ...i.rest]);
  // the street address finds the place best; without one the name + city (or the link's place name) has to do
  const search = i.street ? address : linkText ?? joinParts([i.name, ...i.rest]);
  const findable = Boolean(coords || i.street || linkText);
  const showMap = typeof i.settings?.show_map === 'boolean' ? i.settings.show_map : findable;
  const showDirections = typeof i.settings?.show_directions === 'boolean' ? i.settings.show_directions : findable;
  const destination = coords ? `${coords.lat},${coords.lng}` : search;
  if (!destination) return null;
  return {
    key: i.key,
    label: clean(i.settings?.label) || DEFAULT_LABELS[i.key],
    name: i.name,
    address,
    destination,
    coords,
    link: i.link,
    showMap,
    showDirections,
  };
}

function safeLink(v: unknown): string | null {
  const u = parseUrl(typeof v === 'string' ? v : null);
  return u ? u.href : null;
}

/**
 * Every place of the content with its map settings (G127), switched off ones included (the panel lists them). The
 * venue: venue.* + urls.map + maps.venue; the reception: maps.reception (only with a name, address or link).
 */
export function allMapPlaces(content: unknown): MapPlace[] {
  const c = (content ?? {}) as {
    venue?: Record<string, unknown>;
    urls?: Record<string, unknown>;
    maps?: { venue?: MapPlaceSettings; reception?: (MapPlaceSettings & Record<string, unknown>) | null };
  };
  const v = c.venue ?? {};
  const out: MapPlace[] = [];
  const venue = buildPlace({
    key: 'venue',
    settings: c.maps?.venue,
    name: clean(v.name),
    street: clean(v.address),
    rest: [v.city, v.region, v.country],
    link: safeLink(c.urls?.map),
  });
  if (venue) out.push(venue);
  const r = c.maps?.reception;
  if (r && typeof r === 'object') {
    const reception = buildPlace({
      key: 'reception',
      settings: r,
      name: clean(r.name),
      street: clean(r.address),
      rest: [r.city],
      link: safeLink(r.link),
    });
    if (reception) out.push(reception);
  }
  return out;
}

/** The places guests get a map or directions for. */
export function mapPlaces(content: unknown): MapPlace[] {
  return allMapPlaces(content).filter((p) => p.showMap || p.showDirections);
}

/** The Google Maps embed that "Show map" loads (no API key). */
export function mapEmbedUrl(place: Pick<MapPlace, 'destination' | 'coords'>): string {
  return `${MAP_FRAME_ORIGIN}/maps?q=${encodeURIComponent(place.destination)}&z=${place.coords ? 16 : 15}&output=embed`;
}

/** Google Maps page of the place: the "Show map" link without JavaScript, and "Open in Google Maps". */
export function mapSearchUrl(place: Pick<MapPlace, 'destination' | 'link'>): string {
  return place.link ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.destination)}`;
}

export interface DirectionLink {
  id: 'google' | 'apple' | 'waze';
  label: string;
  href: string;
}

export function directionLinks(place: Pick<MapPlace, 'destination' | 'coords'>): DirectionLink[] {
  const d = encodeURIComponent(place.destination);
  const waze = place.coords
    ? `https://waze.com/ul?ll=${place.coords.lat}%2C${place.coords.lng}&navigate=yes`
    : `https://waze.com/ul?q=${d}&navigate=yes`;
  return [
    { id: 'google', label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${d}` },
    { id: 'apple', label: 'Apple Maps', href: `https://maps.apple.com/?daddr=${d}` },
    { id: 'waze', label: 'Waze', href: waze },
  ];
}
