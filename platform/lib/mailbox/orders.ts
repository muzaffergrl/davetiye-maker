// What Etsy's emails say about one order number (G192). Pure: the IMAP side (imap.ts) hands over the mails Gmail found
// for the number; this decides.
//
// A mail counts only when ALL of these hold:
//   1. Gmail itself vouches that it really comes from Etsy: the TOPMOST Authentication-Results header (the one Gmail's
//      own server, mx.google.com, adds on arrival; lower ones can be written by anyone) says dmarc=pass with
//      header.from etsy.com (or a subdomain), and the From address is at that same domain. A look-alike sender, a forged
//      header or a forwarded copy without a valid Etsy signature never counts.
//   2. The number stands in an ORDER context: "Order #1234567890", "Order number: …", "Sipariş no …" (subject or body).
//      Etsy's sale emails also carry listing and transaction numbers, and listing numbers are public (every Etsy link
//      shows one): a bare number somewhere in the mail must not confirm anything.
//   3. The subject says what it is: a cancellation / refund ("cancel", "refund", "iptal", "iade") -> cancelled; a sale
//      ("You made a sale", "sold", "new order", "satış", "yeni sipariş") -> sale. Anything else (an Etsy conversation, a
//      review notice …) is ignored, even if a buyer typed the number into a message.
// Cancelled wins over sale. The mail formats are Etsy's and may change: an unrecognised mail is ignored, so the order
// simply stays unverified (trust mode then reminds the shop after 48 h) — never a wrong "verified".
// G951: the sale mail's ITEM lines (saleMailItems): a mail listing only our services (setup, custom design, extra
// revision) confirms no design website; the number of design items is told to the shop, never used to add websites.

import { itemsInText, type OrderItems } from '../etsy/services.ts';

export interface OrderMail {
  /** From address (envelope), e.g. transaction@etsy.com. */
  from: string;
  subject: string;
  /** Raw Authentication-Results header lines, topmost first. */
  authResults: string[];
  /** Plain text of the mail (text/plain part, else the HTML without tags); may be empty. */
  text: string;
}

export interface OrderMailVerdict {
  sale: boolean;
  cancelled: boolean;
}

const ETSY_DOMAIN = /^(?:[a-z0-9-]+\.)*etsy\.com$/;

function domainOf(address: string): string {
  const at = address.lastIndexOf('@');
  return at < 0 ? '' : address.slice(at + 1).trim().toLowerCase().replace(/[>\s].*$/, '');
}

/** Gmail's own verdict (rule 1 above). */
export function etsyAuthenticated(mail: Pick<OrderMail, 'from' | 'authResults'>): boolean {
  const fromDomain = domainOf(mail.from);
  if (!ETSY_DOMAIN.test(fromDomain)) return false;
  const top = (mail.authResults[0] ?? '').replace(/\s+/g, ' ').trim();
  if (!/^mx\.google\.com\s*;/i.test(top)) return false;
  const m = /\bdmarc=pass\b[^;]*?\bheader\.from=([a-z0-9.-]+)/i.exec(top);
  return Boolean(m) && m![1].toLowerCase() === fromDomain;
}

const SALE_SUBJECT = /made a sale|\bsold\b|new order|satış|yeni sipariş/i;
const CANCEL_SUBJECT = /cancel|refund|iptal|iade/i;

/** Rule 2: the number right after an order word ("Order #…", "Order number: …", "Sipariş no: …"). */
export function orderMentioned(text: string, orderNumber: string): boolean {
  if (!/^\d{1,20}$/.test(orderNumber)) return false;
  // Only "#", ":", ".", "-", spaces and the words number / no / num / id / numarası may stand between: "Order details —
  // Listing 1234567890" must not match.
  return new RegExp(`(?:order|sipari[şs]|receipt)(?:[\\s#:.\\-]|numbers?|num|no|id|numaras[ıi])*${orderNumber}(?![0-9])`, 'iu').test(text);
}

/**
 * G951: what the order's signed sale email(s) list (lib/etsy/services.ts itemsInText): ready designs, custom designs, other
 * services — summed over the counting sale mails (Etsy sends one per order). Null when no counting sale mail names one of
 * our listings (the format is not understood: nothing is said about the lines).
 */
export function saleMailItems(mails: readonly OrderMail[], orderNumber: string): OrderItems | null {
  let out: OrderItems | null = null;
  for (const m of mails) {
    if (!etsyAuthenticated(m) || !orderMentioned(`${m.subject}\n${m.text}`, orderNumber)) continue;
    if (CANCEL_SUBJECT.test(m.subject) || !SALE_SUBJECT.test(m.subject)) continue;
    const items = itemsInText(m.text);
    if (!items) continue;
    // the same sale mail twice (a forwarded copy kept in All Mail): the larger reading, never the sum
    out = out ? { designs: Math.max(out.designs, items.designs), custom: Math.max(out.custom, items.custom), services: Math.max(out.services, items.services) } : items;
  }
  return out;
}

export function judgeOrderMails(mails: readonly OrderMail[], orderNumber: string): OrderMailVerdict {
  const out: OrderMailVerdict = { sale: false, cancelled: false };
  for (const m of mails) {
    if (!etsyAuthenticated(m)) continue;
    if (!orderMentioned(`${m.subject}\n${m.text}`, orderNumber)) continue;
    if (CANCEL_SUBJECT.test(m.subject)) out.cancelled = true;
    else if (SALE_SUBJECT.test(m.subject)) out.sale = true;
  }
  return out;
}

/** Splits a raw header block into its Authentication-Results lines (unfolded), in order. */
export function authResultsOf(rawHeaders: string): string[] {
  return rawHeaders
    .replace(/\r?\n[ \t]+/g, ' ')
    .split(/\r?\n/)
    .map((l) => /^authentication-results:\s*(.*)$/i.exec(l)?.[1]?.trim() ?? null)
    .filter((l): l is string => l !== null);
}

/** HTML -> rough text (tags out, common entities decoded): enough for rule 2. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|tr|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#35;|&num;/gi, '#')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, ' ');
}
