// G139: every buyer- and guest-facing text of the PDF downloads (website PDF, printable invitation, panel card) in one
// place, by language. Only English exists today; the five languages (K45 §3) add their own block with the same keys.
// Placeholders: {date}, {count}, {url}.

export type PrintLang = 'en';

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
  },
} as const;

export type PrintLabelKey = keyof (typeof PRINT_LABELS)['en'];

/** The label in `lang` (English while a language has no block), with {placeholders} filled. */
export function printLabel(key: PrintLabelKey, vars: Record<string, string | number> = {}, lang: PrintLang = 'en'): string {
  const text: string = (PRINT_LABELS[lang] ?? PRINT_LABELS.en)[key];
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}
