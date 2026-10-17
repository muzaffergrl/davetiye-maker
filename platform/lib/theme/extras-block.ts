// The shared content blocks of the Details page (G138), one markup for every theme, filled by the engine into the
// template's markers (like the map block, G127):
//   <div data-travel>  travel & stay: getting here (airport / station, parking, shuttle, taxi) + 0–6 places to stay
//   <div data-menu>    the menu (meal.served === true): headings with their dishes + a dietary note
//   <div data-blocks>  0–10 free blocks (title, text, link, icon): dress code, children, gifts, parking, weather …
// The words of the blocks are the theme's editable texts (G068): the template writes them inside the marker as
// <span data-copy="travel_parking">Parking</span>; the engine reads them (the couple's text, else the template's) and
// replaces the marker's children with the block. data-pex-btn = the theme's small button classes for links,
// data-pex-title = extra classes for block titles. Styles: /static/extras.css (fonts and colours of the theme through
// inherit / currentColor, --pex-* tokens). No script; nothing is loaded from elsewhere.

import { safeLinkUrl } from './urls.ts';

export const EXTRAS_CSS = '/static/extras.css';

/** The words of the blocks: copy key → the text used when the template has no such label (keeps old templates working). */
export const EXTRAS_LABELS = {
  travel_getting_here: 'Getting here',
  travel_airport: 'Airport & station',
  travel_parking: 'Parking',
  travel_shuttle: 'Shuttle',
  travel_taxi: 'Taxi & rideshare',
  travel_stays: 'Where to stay',
  travel_code: 'Booking code',
  travel_more: 'More info',
  travel_book: 'Book a room',
  menu_diet: 'Dietary needs',
  menu_served: 'A meal will be served.',
  blocks_more: 'Learn more',
} as const;
export type ExtrasLabel = keyof typeof EXTRAS_LABELS;
export type Labels = (key: ExtrasLabel) => string;

export const TRANSPORT_KEYS = ['airport', 'parking', 'shuttle', 'taxi'] as const;
export type TransportKey = (typeof TRANSPORT_KEYS)[number];

export const BLOCK_ICONS = ['info', 'dress', 'kids', 'gift', 'car', 'weather', 'camera', 'music', 'glass', 'heart'] as const;

const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function classes(base: string, extra: string | undefined): string {
  return [base, ...(extra ?? '').split(/\s+/).filter((c) => /^[A-Za-z0-9_-]+$/.test(c))].join(' ');
}

export interface Transport {
  key: TransportKey;
  text: string;
  link: string | null;
}
export interface Stay {
  name: string;
  address: string;
  link: string | null;
  code: string;
  note: string;
  distance: string;
}
export interface TravelData {
  transport: Transport[];
  stays: Stay[];
}

/** What guests see of content.travel (blank parts and unsafe links dropped). */
export function travelData(content: unknown): TravelData {
  const t = isObj(content) && isObj(content.travel) ? content.travel : {};
  const transport: Transport[] = [];
  for (const key of TRANSPORT_KEYS) {
    const n = isObj(t[key]) ? (t[key] as Record<string, unknown>) : null;
    if (!n) continue;
    const text = str(n.text);
    const link = safeLinkUrl(n.link);
    if (text || link) transport.push({ key, text, link });
  }
  const stays: Stay[] = (Array.isArray(t.stays) ? t.stays : [])
    .filter(isObj)
    .map((s) => ({ name: str(s.name), address: str(s.address), link: safeLinkUrl(s.link), code: str(s.code), note: str(s.note), distance: str(s.distance) }))
    .filter((s) => s.name)
    .slice(0, 6);
  return { transport, stays };
}

export interface MenuData {
  courses: Array<{ title: string; items: string[] }>;
  note: string;
}

/** The menu guests see; null when no meal is served (served false / missing). */
export function menuData(content: unknown): MenuData | null {
  const m = isObj(content) && isObj(content.meal) ? content.meal : null;
  if (!m || m.served !== true) return null;
  const courses = (Array.isArray(m.courses) ? m.courses : [])
    .filter(isObj)
    .map((c) => ({ title: str(c.title), items: (Array.isArray(c.items) ? c.items : []).map(str).filter(Boolean).slice(0, 10) }))
    .filter((c) => c.title || c.items.length)
    .slice(0, 6);
  return { courses, note: str(m.note) };
}

export interface InfoBlock {
  title: string;
  text: string;
  link: string | null;
  linkLabel: string;
  icon: (typeof BLOCK_ICONS)[number] | null;
}

/** The Details blocks guests see (a block without a title is not shown). */
export function infoBlocks(content: unknown): InfoBlock[] {
  const list = isObj(content) && Array.isArray(content.details_blocks) ? content.details_blocks : [];
  return list
    .filter(isObj)
    .map((b) => ({
      title: str(b.title),
      text: str(b.text),
      link: safeLinkUrl(b.link),
      linkLabel: str(b.link_label),
      icon: (BLOCK_ICONS as readonly unknown[]).includes(b.icon) ? (b.icon as InfoBlock['icon']) : null,
    }))
    .filter((b) => b.title)
    .slice(0, 10);
}

// Line icons (24 × 24, stroke = currentColor): drawn here, so every theme shows them in its own colour.
const ICON_PATHS: Record<(typeof BLOCK_ICONS)[number], string> = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  dress: '<path d="M9 3h6l-1 5 4 13H6l4-13z"/><path d="M10 8h4"/>',
  kids: '<circle cx="12" cy="6" r="2.5"/><path d="M12 9v6M8 11l4 1 4-1M9.5 21l2.5-6 2.5 6"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6 0 6-1.5S14 5 12 9"/>',
  car: '<path d="M4 16v-4l2-5h12l2 5v4zM4 16v2h3v-2M17 16v2h3v-2M4 12h16"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
  weather: '<path d="M7 17a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.4A3.3 3.3 0 0 1 17 17z"/><path d="M9 20l-.5 1.5M13 20l-.5 1.5M17 20l-.5 1.5"/>',
  camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
  glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v7M8.5 21h7"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
};

function icon(name: InfoBlock['icon']): string {
  if (!name) return '';
  return `<svg class="pex-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
}

export interface ExtrasOptions {
  /** The theme's small button classes for links, e.g. "btn btn-ghost btn-sm". */
  buttonClass?: string;
  /** Extra classes for block / card titles. */
  titleClass?: string;
}

function linkButton(href: string, label: string, opts: ExtrasOptions, aria?: string): string {
  const a = aria ? ` aria-label="${esc(aria)}"` : '';
  return `<a class="${esc(classes('pex-link', opts.buttonClass))}" href="${esc(href)}" target="_blank" rel="noopener noreferrer"${a}>${esc(label)}</a>`;
}

const TRANSPORT_LABEL: Record<TransportKey, ExtrasLabel> = {
  airport: 'travel_airport',
  parking: 'travel_parking',
  shuttle: 'travel_shuttle',
  taxi: 'travel_taxi',
};

/** Travel & stay block ('' when there is nothing to show). */
export function travelHtml(data: TravelData, label: Labels, opts: ExtrasOptions = {}): string {
  const parts: string[] = [];
  if (data.transport.length) {
    const rows = data.transport
      .map((t) => {
        const name = label(TRANSPORT_LABEL[t.key]);
        return (
          `<li class="pex-row" data-travel-item="${t.key}"><p class="pex-row-title">${esc(name)}</p>` +
          (t.text ? `<p class="pex-text">${esc(t.text)}</p>` : '') +
          (t.link ? linkButton(t.link, label('travel_more'), opts, `${label('travel_more')}: ${name}`) : '') +
          `</li>`
        );
      })
      .join('');
    parts.push(`<div class="pex-group"><p class="pex-kicker">${esc(label('travel_getting_here'))}</p><ul class="pex-rows">${rows}</ul></div>`);
  }
  if (data.stays.length) {
    const cards = data.stays
      .map(
        (s, i) =>
          `<li class="pex-card" data-stay="${i}">` +
          `<p class="${esc(classes('pex-title', opts.titleClass))}">${esc(s.name)}</p>` +
          (s.distance ? `<p class="pex-meta">${esc(s.distance)}</p>` : '') +
          (s.address ? `<p class="pex-addr">${esc(s.address)}</p>` : '') +
          (s.note ? `<p class="pex-text">${esc(s.note)}</p>` : '') +
          (s.code ? `<p class="pex-code"><span>${esc(label('travel_code'))}</span> <strong>${esc(s.code)}</strong></p>` : '') +
          (s.link ? linkButton(s.link, label('travel_book'), opts, `${label('travel_book')}: ${s.name}`) : '') +
          `</li>`,
      )
      .join('');
    parts.push(`<div class="pex-group"><p class="pex-kicker">${esc(label('travel_stays'))}</p><ul class="pex-cards">${cards}</ul></div>`);
  }
  return parts.join('');
}

/** The menu card ('' never: with no dishes and no note it says a meal is served). */
export function menuHtml(data: MenuData, label: Labels, opts: ExtrasOptions = {}): string {
  if (!data.courses.length && !data.note) return `<p class="pex-served">${esc(label('menu_served'))}</p>`;
  const courses = data.courses
    .map(
      (c) =>
        `<div class="pex-course">` +
        (c.title ? `<p class="pex-kicker">${esc(c.title)}</p>` : '') +
        (c.items.length ? `<ul class="pex-dishes">${c.items.map((it) => `<li class="${esc(classes('pex-dish', opts.titleClass))}">${esc(it)}</li>`).join('')}</ul>` : '') +
        `</div>`,
    )
    .join('');
  const note = data.note ? `<p class="pex-diet"><span class="pex-kicker">${esc(label('menu_diet'))}</span><span class="pex-text">${esc(data.note)}</span></p>` : '';
  return `<div class="pex-menu-card">${courses}${note}</div>`;
}

/** The free Details blocks ('' when none). */
export function blocksHtml(list: readonly InfoBlock[], label: Labels, opts: ExtrasOptions = {}): string {
  return list
    .map(
      (b, i) =>
        `<article class="pex-block" data-block="${i}">${icon(b.icon)}` +
        `<h2 class="${esc(classes('pex-title', opts.titleClass))}">${esc(b.title)}</h2>` +
        (b.text ? `<p class="pex-text">${esc(b.text)}</p>` : '') +
        (b.link ? linkButton(b.link, b.linkLabel || label('blocks_more'), opts) : '') +
        `</article>`,
    )
    .join('');
}
