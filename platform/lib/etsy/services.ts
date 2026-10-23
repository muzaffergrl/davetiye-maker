// What an Etsy order line IS, from its title (G951): one of our add-on SERVICES (setup, custom design, extra revision —
// collections/_services/*/package/listing/etsy_upload.json, K42/K49), one of our ready DESIGNS ("<Design name> Wedding
// Website with RSVP, …", collections/NN/package/listing/etsy_upload.json), or unknown. Used where the listing id is not
// mapped (lib/etsy/listings.json is empty until the listings are live) — the Etsy receipt (lib/etsy/verify.ts) — and
// where only text is there: Etsy's "You made a sale" email (lib/mailbox/orders.ts).
//
// Titles may be cut short ("…") or lose punctuation on the way, and the shop may reword the end of a title later, so a
// line matches by the START of a title: a service by its first four words, a design by "<its name> wedding website".
// tests/g951-order-items.test.ts keeps SERVICE_TITLES equal to the listing files.

import { MARKETING } from '../marketing/config.ts';

export type ServiceKind = 'setup' | 'custom_design' | 'extra_revision';

/** The service listings' Etsy titles (copied from collections/_services/<id>/package/listing/etsy_upload.json). */
export const SERVICE_TITLES: ReadonlyArray<{ kind: ServiceKind; listing: string; title: string }> = [
  {
    kind: 'setup',
    listing: 'setup-service',
    title: 'Wedding Website Setup Service, We Enter Your Details for You, Add On for Our Website Designs, Done for You RSVP and Photo Setup',
  },
  {
    kind: 'custom_design',
    listing: 'custom-design',
    title: 'Custom Wedding Website Design with RSVP, Made Just for You, Your Own Colors and Opening, Online Editor, Digital Invitation Website',
  },
  {
    kind: 'extra_revision',
    listing: 'extra-revision',
    title: 'Extra Design Revision for Custom Wedding Website, One More Round of Changes, Add On for Our Custom Design Orders, Digital',
  },
];

/** Lower case, "&" as "and", accents and punctuation out, single spaces: "Olive & Ivory Wedding…" -> "olive and ivory wedding". */
export function normTitle(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const firstWords = (text: string, n: number) => normTitle(text).split(' ').slice(0, n).join(' ');

/** A service is recognised by the first words of its title (distinct among the three and from every design title). */
const SERVICE_KEYS: ReadonlyArray<{ kind: ServiceKind; key: string }> = SERVICE_TITLES.map((s) => ({ kind: s.kind, key: firstWords(s.title, 4) }));

/** "<design name> wedding website" of every design of the catalogue (any status: an order can be older than a change). */
function designKeys(): Array<{ id: string; key: string }> {
  return MARKETING.designs.map((d) => ({ id: d.id, key: `${normTitle(d.name)} wedding website` })).sort((a, b) => b.key.length - a.key.length);
}

/** The service an order line's title names, else null. */
export function serviceKindOfTitle(title: unknown): ServiceKind | null {
  if (typeof title !== 'string' || !title.trim()) return null;
  const t = normTitle(title);
  for (const s of SERVICE_KEYS) if (t.startsWith(s.key)) return s.kind;
  return null;
}

/** The design (theme id) an order line's title names ("Olive & Ivory Wedding Website with RSVP, …"), else null. */
export function designOfTitle(title: unknown): string | null {
  if (typeof title !== 'string' || !title.trim()) return null;
  const t = normTitle(title);
  for (const d of designKeys()) if (t.startsWith(d.key)) return d.id;
  return null;
}

/** What the lines of one order hold: ready-design websites, custom designs (each includes its website), other services. */
export interface OrderItems {
  designs: number;
  custom: number;
  services: number;
}

const QUANTITY_RE = /\b(?:quantity|qty|adet|miktar|cantidad|anzahl|menge|quantite)\b\s*[:x×]?\s*(\d{1,3})\b/;

/**
 * The items an Etsy sale email lists (plain text of the mail; pure). Each line naming a service or a design starts an
 * item; a "Quantity: N" line before the next item sets its quantity (default 1); the same title repeated with nothing in
 * between (an image's alt text and its link) is one item. Null when no line names one of ours: the mail's format is not
 * understood, nothing can be said (the caller then treats the order as before: one website).
 */
export function itemsInText(text: string): OrderItems | null {
  const items: Array<{ kind: 'design' | ServiceKind; title: string; qty: number; closed: boolean }> = [];
  const keys = designKeys();
  for (const raw of text.split(/\r?\n/)) {
    const line = normTitle(raw);
    if (!line) continue;
    const service = SERVICE_KEYS.find((s) => line.includes(s.key));
    const design = service ? null : keys.find((d) => line.includes(d.key));
    if (service || design) {
      const title = service ? service.key : design!.key;
      const last = items[items.length - 1];
      if (last && !last.closed && last.title === title) continue; // the same item again (alt text + link)
      const sameLine = QUANTITY_RE.exec(line);
      const qty = sameLine && Number(sameLine[1]) >= 1 ? Math.min(Number(sameLine[1]), 99) : 1;
      items.push({ kind: service ? service.kind : 'design', title, qty, closed: Boolean(sameLine) });
      continue;
    }
    const last = items[items.length - 1];
    if (!last) continue;
    const q = QUANTITY_RE.exec(line);
    if (q) {
      const n = Number(q[1]);
      if (n >= 1) last.qty = Math.min(n, 99);
      last.closed = true;
    } else if (/\b(price|transaction|item total|subtotal|fiyat|islem)\b/.test(line)) {
      last.closed = true;
    }
  }
  if (!items.length) return null;
  const out: OrderItems = { designs: 0, custom: 0, services: 0 };
  for (const i of items) {
    if (i.kind === 'design') out.designs += i.qty;
    else if (i.kind === 'custom_design') out.custom += i.qty;
    else out.services += i.qty;
  }
  return out;
}
