// G139: every buyer- and guest-facing text of the PDF downloads (website PDF, printable invitation, panel card) in one
// place. Placeholders: {date}, {count}, {url}.
// G144: the English text is the key of the five-language dictionaries (lib/i18n): the printed invitation and the website
// PDF read the site dictionary of the website's main language (lib/print/lang.ts), the panel card the panel's (t()).
// lib/i18n/keys.ts lists panel_* + limit_reached under "panel", the rest under "site".

export const PRINT_LABELS = {
  en: {
    // printed invitation (front)
    invite_wedding: 'invite you to celebrate their wedding',
    invite_other: 'invite you to celebrate with them',
    at_time: 'at {time}',
    reply_by: 'Kindly reply by {date}',
    // printed invitation (back) and the website PDF's last page
    details_title: 'The Details',
    schedule_title: 'Schedule',
    dress_code: 'Dress code',
    scan_to_visit: 'Scan to visit our website and reply',
    website_title: 'Our wedding website',
    // panel (Share → Downloads)
    panel_title: 'Downloads',
    panel_intro: 'Keep a copy of your website, or print classic invitations in your design. Both use your latest saved changes.',
    panel_site_button: 'Download website as PDF',
    panel_site_hint: 'Every page of your website in your design, with a QR code to your link on the last page.',
    panel_invite_title: 'Printable invitation',
    panel_invite_button: 'Download printable invitation',
    panel_size_label: 'Size',
    panel_size_5x7: '5 × 7 in',
    panel_size_a5: 'A5 (148 × 210 mm)',
    panel_bleed: 'For a print shop: add bleed (1/8 in / 3 mm)',
    panel_marks: 'Add crop marks',
    panel_back: 'Add a back side with the details and a QR code',
    panel_working: 'Preparing your PDF… this can take up to a minute.',
    panel_done: 'Your PDF is downloading.',
    panel_failed: 'The PDF could not be made. Please try again in a moment.',
    panel_offline: 'You are offline. Connect to download your PDF.',
    panel_unpublished: 'Your website is not published yet: the QR code will open it once you publish.',
    limit_reached: 'You have made {count} PDFs today. Please try again tomorrow.',
    // G952: no PDFs while the Etsy order is still being confirmed (or was held), nor for an archived website
    panel_locked_order: 'Downloads open once your order is confirmed.',
    panel_locked_archived: 'This website is archived, so its PDFs can no longer be made.',
  },
} as const;

export type PrintLabelKey = keyof (typeof PRINT_LABELS)['en'];

/** The label translated with `dict` (a lib/i18n dictionary; none = English), with {placeholders} filled. */
export function printLabel(key: PrintLabelKey, vars: Record<string, string | number> = {}, dict?: Readonly<Record<string, string>> | null): string {
  const en: string = PRINT_LABELS.en[key];
  const text = dict?.[en] || en;
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}
