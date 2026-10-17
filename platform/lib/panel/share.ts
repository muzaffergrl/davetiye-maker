// Share → ready messages, app links and QR options (G140, K45 item 6). Pure: no Node imports — the panel runs it in the
// browser and the tests in Node.
//
// The couple picks a message ("Invitation", "Reminder", or "Thank you" after the wedding), edits it if they like, then
// sends it with the phone's own share sheet or one app link (WhatsApp, SMS, email, Messenger, Telegram). The names, the
// date and the link are filled in from the website. The guest password is added only when the couple ticks it.
// QR: PNG in three sizes or SVG, black or the design's colour darkened until it scans as well as black (contrast ≥ 7:1).
//
// Every English text the couple sees here comes from SHARE_LABELS (one key per text) so the five panel languages (K45
// item 3) can replace this one table later.

export const SHARE_LABELS = {
  linkTitle: 'Your website link',
  linkNotLive: 'This address works once you publish your website.',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  openWebsite: 'Open',
  shareSystem: 'Share…',
  publish: 'Publish',
  publishAgain: 'Publish again',
  saveLinkTitle: 'Ask guests to save the link',
  saveLinkText: 'Guests come back to your website for the time, the address and to reply. Ask them to bookmark it or add it to their Home Screen.',
  messageTitle: 'Send it with a message',
  messageLead: 'Pick a message, change it if you like, then choose how to send it.',
  messageLabel: 'Your message',
  messageHelp: 'Your names, the date and the link are filled in for you.',
  kindInvite: 'Invitation',
  kindReminder: 'Reminder',
  kindThanks: 'Thank you',
  includePassword: 'Add the guest password to the message',
  includePasswordHelp: 'Anyone who gets this message can open your website.',
  resetMessage: 'Reset text',
  copyMessage: 'Copy message',
  messageCopied: 'Message copied',
  sendWith: 'Send with',
  appWhatsApp: 'WhatsApp',
  appSms: 'Text message',
  appEmail: 'Email',
  appMessenger: 'Messenger',
  appTelegram: 'Telegram',
  emailSubject: 'Our wedding website',
  emailSubjectThanks: 'Thank you from us',
  qrTitle: 'QR code for printed cards',
  qrLead: 'It opens your website link. Scan it once with your phone camera before you print it.',
  qrColour: 'Colour',
  qrBlack: 'Black',
  qrDesign: 'Design colour',
  qrSize: 'Size',
  downloadPng: 'Download PNG',
  downloadSvg: 'Download SVG',
  svgHelp: 'SVG stays sharp at any size — best for a print shop.',
  cardTitle: 'Printable QR card',
  cardText: 'A 4 × 6 in (10 × 15 cm) card with your names, the date and the QR code, in your design’s colours.',
  cardPassword: 'Print the guest password on the card',
  downloadCard: 'Download card (PDF)',
  cardBusy: 'Making your card…',
  cardFailed: 'The card could not be made. Please try again.',
  cardScan: 'Scan to open our wedding website',
  cardScanThanks: 'Scan for our thank-you note',
  cardPasswordLine: 'Password',
} as const;

export type ShareLabel = keyof typeof SHARE_LABELS;

export type MessageKind = 'invite' | 'reminder' | 'thanks';

export interface MessageInput {
  /** "Avery & Jordan" (name_display). */
  names: string;
  /** "Saturday, June 12, 2027" — the website's own date style; null = no date line. */
  date: string | null;
  /** Replies close ("May 1, 2027"); null when the website takes no replies. */
  replyBy: string | null;
  url: string;
  /** Added only when the couple ticks "Add the guest password". */
  password?: string | null;
}

/** The kinds offered: a thank-you website gets only the thank-you message; "Reminder" needs a reply date. */
export function messageKinds(thankYouOn: boolean, replyBy: string | null): MessageKind[] {
  if (thankYouOn) return ['thanks'];
  return replyBy ? ['invite', 'reminder'] : ['invite'];
}

/** The ready message (English, K45: guests' language comes later with the five panel languages). */
export function shareMessage(kind: MessageKind, m: MessageInput): string {
  const names = m.names.trim();
  const lines: string[] = [];
  if (kind === 'thanks') {
    lines.push('Thank you for celebrating with us! A note from us is on our website:');
    lines.push(m.url);
  } else if (kind === 'reminder') {
    lines.push(m.replyBy ? `A friendly reminder: please reply by ${m.replyBy}.` : 'A friendly reminder to reply.');
    lines.push(`It only takes a minute on our wedding website${m.date ? ` (${m.date})` : ''}:`);
    lines.push(m.url);
  } else {
    lines.push(m.date ? `We’re getting married on ${m.date}!` : 'We’re getting married!');
    lines.push(`Everything about our day is on our wedding website${m.replyBy ? `, where you can also reply by ${m.replyBy}` : ''}:`);
    lines.push(m.url);
    lines.push('Please save the link — you’ll want it on the day.');
  }
  if (m.password) lines.push(`Password: ${m.password}`);
  if (names) lines.push(`— ${names}`);
  return lines.join('\n');
}

export type ShareApp = 'whatsapp' | 'sms' | 'email' | 'messenger' | 'telegram';

export interface ShareAppLink {
  app: ShareApp;
  label: ShareLabel;
  href: string;
  /** Opens only on a phone (an app scheme or a phone feature): hidden on a computer. */
  phoneOnly: boolean;
}

/**
 * One link per app. The message already holds the URL; Telegram and Messenger take the URL separately (Telegram puts its
 * text after the link, so the text sent there is the message without the URL line).
 */
export function shareAppLinks(message: string, url: string, subject: string): ShareAppLink[] {
  const e = encodeURIComponent;
  const withoutUrl = message
    .split('\n')
    .filter((l) => l.trim() !== url)
    .join('\n');
  return [
    { app: 'whatsapp', label: 'appWhatsApp', href: `https://wa.me/?text=${e(message)}`, phoneOnly: false },
    // "sms:?&body=" is understood by both iOS and Android messaging apps.
    { app: 'sms', label: 'appSms', href: `sms:?&body=${e(message)}`, phoneOnly: true },
    { app: 'email', label: 'appEmail', href: `mailto:?subject=${e(subject)}&body=${e(message)}`, phoneOnly: false },
    // Messenger shares a link (its own preview card), not text; the web version needs a Facebook app id, so phones only.
    { app: 'messenger', label: 'appMessenger', href: `fb-messenger://share/?link=${e(url)}`, phoneOnly: true },
    { app: 'telegram', label: 'appTelegram', href: `https://t.me/share/url?url=${e(url)}&text=${e(withoutUrl)}`, phoneOnly: false },
  ];
}

// ---------------------------------------------------------------------------------------------
// QR colours and sizes

export const QR_BLACK = '#1f1d1a';
export const QR_LIGHT = '#ffffff';

/** PNG sizes offered (at least `px` per side, quiet zone included; whole pixels per module, so a little more). */
export const QR_PNG_SIZES = [
  { key: 'small', label: 'Small · screens', px: 600 },
  { key: 'medium', label: 'Medium · cards', px: 1200 },
  { key: 'large', label: 'Large · signs', px: 2400 },
] as const;
export type QrSizeKey = (typeof QR_PNG_SIZES)[number]['key'];

const HEX6 = /^#([0-9a-f]{6})$/i;
const HEX3 = /^#([0-9a-f]{3})$/i;

/** "#abc" / "#AABBCC" → "#aabbcc"; anything else → null. */
export function normalHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  const m3 = HEX3.exec(v);
  if (m3) return `#${[...m3[1]].map((c) => c + c).join('')}`.toLowerCase();
  return HEX6.test(v) ? v.toLowerCase() : null;
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WCAG relative luminance of a #rrggbb colour. */
export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * The design's colour as QR ink: darkened step by step (keeping its hue) until it has at least 7:1 contrast on white —
 * scanners then read it like black. Null when the design has no colour.
 */
export function qrInk(themeColor: string | null | undefined): string | null {
  const hex = normalHex(themeColor);
  if (!hex) return null;
  const [r, g, b] = rgb(hex);
  for (let k = 1; k >= 0; k -= 0.02) {
    const c = `#${[r, g, b].map((v) => Math.round(v * k).toString(16).padStart(2, '0')).join('')}`;
    if (contrast(c, QR_LIGHT) >= 7) return c;
  }
  return QR_BLACK;
}

/** Text colour for the card on the design's background: dark ink on light paper, paper on a dark design. */
export function cardTextColour(background: string): string {
  return contrast(background, QR_BLACK) >= contrast(background, '#fbf8f2') ? QR_BLACK : '#fbf8f2';
}
