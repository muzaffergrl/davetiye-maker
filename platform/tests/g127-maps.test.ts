// G127: map + directions — link parsing, places from the content, the shared engine block, CSP, schema.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { allMapPlaces, coordsFromMapLink, directionLinks, isShortMapLink, mapEmbedUrl, mapPlaces, placeTextFromMapLink } from '../lib/maps.ts';
import { resolveShortMapLink } from '../lib/panel/map-link.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { validateContent } from '../lib/content/validate.ts';
import { siteCsp } from '../lib/site/render.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { DEMO_CITY_PINS, withDemoMap } from '../lib/claim/demo-map.ts';
import { handleDemoPage } from '../lib/claim/demo-page.ts';
import { demoContent } from './helpers.ts';

const THEMES = path.resolve(import.meta.dirname, '../themes');

function withVenue(extra: Record<string, unknown> = {}) {
  const c = demoContent() as Record<string, any>;
  c.venue = { ...c.venue, address: '12 Orchard Road' };
  return Object.assign(c, extra);
}

test('map links: the pin is read from Google, Apple, Waze and OpenStreetMap links', () => {
  const g = 'https://www.google.com/maps/place/Rose+Hall/@40.71,-74.0,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x1!8m2!3d40.712776!4d-74.005974';
  assert.deepEqual(coordsFromMapLink(g), { lat: 40.712776, lng: -74.005974 });
  assert.deepEqual(coordsFromMapLink('https://www.google.com/maps/@51.5,-0.12,15z'), { lat: 51.5, lng: -0.12 });
  assert.deepEqual(coordsFromMapLink('https://maps.google.com/?q=48.8584,2.2945'), { lat: 48.8584, lng: 2.2945 });
  assert.deepEqual(coordsFromMapLink('https://maps.apple.com/?ll=37.33,-122.03&q=Park'), { lat: 37.33, lng: -122.03 });
  assert.deepEqual(coordsFromMapLink('https://waze.com/ul?ll=45.1%2C7.6&navigate=yes'), { lat: 45.1, lng: 7.6 });
  assert.deepEqual(coordsFromMapLink('https://www.openstreetmap.org/?mlat=52.52&mlon=13.40#map=15/52.52/13.40'), { lat: 52.52, lng: 13.4 });
  assert.equal(coordsFromMapLink('https://maps.app.goo.gl/AbC123'), null);
  assert.equal(coordsFromMapLink('https://www.google.com/maps?q=91,10'), null);
  assert.equal(coordsFromMapLink('javascript:alert(1)'), null);
  assert.equal(placeTextFromMapLink(g), 'Rose Hall');
  assert.equal(placeTextFromMapLink('https://www.google.com/maps?q=Rose%20Hall%2C%20Savannah'), 'Rose Hall, Savannah');
  assert.equal(isShortMapLink('https://maps.app.goo.gl/AbC123'), true);
  assert.equal(isShortMapLink('https://goo.gl/maps/xyz'), true);
  assert.equal(isShortMapLink('https://goo.gl/other'), false);
  assert.equal(isShortMapLink('https://example.com/maps'), false);
});

test('places: defaults follow the address / pin, the switches override, a reception comes second', () => {
  // the demo venue has no street address: nothing to find -> off
  assert.deepEqual(mapPlaces(demoContent()), []);
  const [v] = mapPlaces(withVenue());
  assert.equal(v.key, 'venue');
  assert.equal(v.showMap && v.showDirections, true);
  assert.match(v.destination, /^12 Orchard Road, /);
  assert.equal(v.coords, null);
  // a link with a pin wins over the address text
  const pinned = mapPlaces(withVenue({ urls: { map: 'https://maps.google.com/?q=40.5,-73.5' } }))[0];
  assert.equal(pinned.destination, '40.5,-73.5');
  assert.match(mapEmbedUrl(pinned), /^https:\/\/www\.google\.com\/maps\?q=40\.5%2C-73\.5&z=16&output=embed$/);
  const off = withVenue({ maps: { venue: { show_map: false, show_directions: false } } });
  assert.deepEqual(mapPlaces(off), []);
  assert.equal(allMapPlaces(off).length, 1);
  const two = mapPlaces(withVenue({ maps: { reception: { name: 'The Barn', address: '3 Mill Lane', city: 'Hudson', lat: 42.25, lng: -73.79 } } }));
  assert.deepEqual(two.map((p) => [p.key, p.label]), [['venue', 'Ceremony'], ['reception', 'Reception']]);
  assert.equal(two[1].destination, '42.25,-73.79');
  const links = directionLinks(two[1]);
  assert.deepEqual(links.map((l) => l.id), ['google', 'apple', 'waze']);
  assert.equal(links[0].href, 'https://www.google.com/maps/dir/?api=1&destination=42.25%2C-73.79');
  assert.equal(links[1].href, 'https://maps.apple.com/?daddr=42.25%2C-73.79');
  assert.equal(links[2].href, 'https://waze.com/ul?ll=42.25%2C-73.79&navigate=yes');
});

const DETAILS = `<!DOCTYPE html><html><head><title>t</title></head><body>
<div class="action" data-if="map_block"><a class="btn" href="#" data-field="urls.map" data-if="urls.map !map_on">View map</a>
<div data-map data-map-btn="btn btn-ghost" data-map-btn-sm="btn btn-ghost btn-sm"></div></div></body></html>`;
const THEME = { id: 'testtheme', pages: { index: 'index.html', details: 'details.html' }, photos: {} };

function render(content: unknown, now?: Date) {
  const r = renderTemplate({ html: DETAILS, content, theme: THEME, page: 'details', slug: 'a-and-b', now });
  return { ...r, $: cheerio.load(r.html) };
}

test('engine: the shared block replaces the old link, loads its files and opens frame-src only with a map', () => {
  const content = withVenue({ urls: { map: 'https://maps.google.com/?q=40.5,-73.5' } });
  const { $, frameSources, html } = render(content, new Date('2020-01-01T00:00:00Z'));
  assert.equal($('a[data-field="urls.map"]').length, 0, 'the old "View map" link gives way');
  assert.equal($('[data-map-place]').length, 1);
  assert.equal($('[data-map-show]').attr('class'), 'pmap-show btn btn-ghost');
  assert.equal($('[data-map-show]').attr('href'), 'https://maps.google.com/?q=40.5,-73.5');
  assert.match($('.pmap-card').attr('data-map-embed') ?? '', /output=embed/);
  assert.equal($('[data-directions]').length, 3);
  assert.equal($('[data-directions]').first().attr('class'), 'pmap-dir-link btn btn-ghost btn-sm');
  assert.equal($('iframe').length, 0, 'no map frame before the tap');
  assert.equal($('link[href="/static/map.css"]').length, 1);
  assert.equal($('script[src="/static/map.js"]').length, 1);
  assert.deepEqual(frameSources, ['https://www.google.com']);
  assert.ok(!html.includes('data-map-btn'));
  assert.match(siteCsp([], frameSources), /frame-src 'self' https:\/\/www\.google\.com;/);
  assert.match(siteCsp(), /frame-src 'self';/);

  // directions only: no frame source, no card for the venue (its name is on the page already)
  const dirOnly = render(withVenue({ maps: { venue: { show_map: false } } }), new Date('2020-01-01T00:00:00Z'));
  assert.deepEqual(dirOnly.frameSources, []);
  assert.equal(dirOnly.$('.pmap-card').length, 0);
  assert.equal(dirOnly.$('[data-directions]').length, 3);
});

test('engine: switched off / no address -> the old "View map" link stays; thank-you mode shows neither', () => {
  const off = withVenue({ urls: { map: 'https://maps.google.com/?q=Rose' }, maps: { venue: { show_map: false, show_directions: false } } });
  const a = render(off, new Date('2020-01-01T00:00:00Z'));
  assert.equal(a.$('[data-map]').length, 0);
  assert.equal(a.$('a[data-field="urls.map"]').length, 1);
  assert.equal(a.$('link[href="/static/map.css"]').length, 0);
  const none = render(demoContent(), new Date('2020-01-01T00:00:00Z'));
  assert.equal(none.$('.action').length, 0, 'nothing to show: the wrapper goes too');
  const after = render(withVenue(), new Date('2099-01-01T00:00:00Z'));
  assert.equal(after.$('[data-map]').length, 0);
  assert.equal(after.$('.action').length, 0);
  assert.deepEqual(after.frameSources, []);
});

test('engine: text from the content is escaped in the block', () => {
  const c = withVenue({ maps: { reception: { name: 'Barn <b>"x"</b>', address: '1 A & B St' } } });
  const { $, html } = render(c, new Date('2020-01-01T00:00:00Z'));
  assert.equal($('[data-map-place="reception"] .pmap-name').text(), 'Barn <b>"x"</b>');
  assert.ok(!html.includes('<b>"x"</b>'));
  assert.equal($('.pmap-label').length, 2);
});

test('schema: maps validates (ranges, unknown fields, reception needs a name)', () => {
  assert.equal(validateContent(withVenue({ maps: { venue: { lat: 40, lng: -73, show_map: true }, reception: null } })).ok, true);
  const bad = validateContent(withVenue({ maps: { venue: { lat: 95 }, reception: { address: 'x' } } }));
  assert.equal(bad.ok, false);
  const codes = bad.errors.map((e) => `${e.path}:${e.code}`);
  assert.ok(codes.includes('maps.venue.lat:schema_maximum'), codes.join());
  assert.ok(codes.includes('maps.reception.name:schema_required'), codes.join());
  assert.equal(validateContent(withVenue({ maps: { zoom: 3 } })).ok, false);
});

test('every theme details page carries the shared block marker', () => {
  const ids = readdirSync(THEMES).filter((d) => !d.startsWith('_') && existsSync(path.join(THEMES, d, 'details.html')));
  const realThemes = readdirSync(THEMES).filter((d) => !d.startsWith('_') && existsSync(path.join(THEMES, d, 'theme.json')));
  assert.deepEqual(new Set(ids), new Set(realThemes), 'every real theme has a Details page');
  for (const id of ids) {
    const html = readFileSync(path.join(THEMES, id, 'details.html'), 'utf8');
    assert.match(html, /<div data-map data-map-btn="btn btn-ghost" data-map-btn-sm="btn btn-ghost btn-sm"><\/div>/, id);
    assert.match(html, /data-if="urls\.map !map_on">View map<\/a>/, id);
  }
});

test('short map links: only Google / Apple redirectors, the target is read from the redirect, never fetched', async () => {
  const calls: string[] = [];
  const fakeFetch = async (url: string | URL | Request) => {
    calls.push(String(url));
    return new Response(null, { status: 302, headers: { location: 'https://www.google.com/maps/place/Rose+Hall/@1,2,17z/data=!3d40.1!4d-73.2' } });
  };
  const r = await resolveShortMapLink('https://maps.app.goo.gl/AbC123', fakeFetch as typeof fetch);
  assert.deepEqual(r, { url: 'https://www.google.com/maps/place/Rose+Hall/@1,2,17z/data=!3d40.1!4d-73.2', lat: 40.1, lng: -73.2, place: 'Rose Hall' });
  assert.equal(calls.length, 1);
  assert.equal(await resolveShortMapLink('https://example.com/x', fakeFetch as typeof fetch), null);
  assert.equal(calls.length, 1, 'other hosts are never requested');
  const evil = async () => new Response(null, { status: 302, headers: { location: 'https://evil.example/maps' } });
  assert.equal(await resolveShortMapLink('https://maps.app.goo.gl/x', evil as typeof fetch), null);
});

test('the live demo shows the map at the demo city centre; demo records and buyer drafts carry no pin', async () => {
  // G166: 28 Maison Pâtisserie ('coming') waits for its pin — lib/claim/demo-map.ts was outside that task's write area;
  // the coordinator adds { lat: 41.4901, lng: -71.3128 } (Newport, RI) and removes it from this list.
  const PIN_PENDING = ['maison-patisserie'];
  const ids = readdirSync(THEMES).filter((d) => !d.startsWith('_') && !PIN_PENDING.includes(d) && existsSync(path.join(THEMES, d, 'details.html')));
  assert.deepEqual(Object.keys(DEMO_CITY_PINS).sort(), ids.sort(), 'one pin per theme');
  const res = await handleDemoPage(new Request('http://localhost/start/demo/olive-ivory/details'), 'olive-ivory', 'details');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-security-policy') ?? '', /frame-src 'self' https:\/\/www\.google\.com;/);
  const $ = cheerio.load(await res.text());
  assert.match($('.pmap-card').attr('data-map-embed') ?? '', /q=38\.2975%2C-122\.2869/);
  assert.equal($('[data-directions]').length, 3);
  const demo = JSON.parse(readFileSync(path.join(THEMES, 'olive-ivory', 'content.demo.json'), 'utf8'));
  assert.equal(demo.maps, undefined, 'the record itself has no pin');
  assert.deepEqual(mapPlaces(draftFromDemo(demo, ['Ada', 'Bo'])), [], 'a buyer draft starts without a map');
  assert.deepEqual(withDemoMap('olive-ivory', { maps: { venue: { show_map: false } } }).maps, { venue: { show_map: false } });
});
