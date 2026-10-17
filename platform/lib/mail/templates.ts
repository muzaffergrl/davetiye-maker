// The emails (G147): plain text + simple branded HTML (one column, inline styles, readable on a phone). Buyer emails are
// English (product language); shop notices follow the admin (Turkish). Brand / shop names come from the ONE brand config
// (lib/marketing/config.ts): an undecided "[PLACEHOLDER]" stays visible, nothing is invented (no support address, no price).

import type { EditLinkMessage } from '../claim/mailer.ts';
import { MARKETING } from '../marketing/config.ts';

export interface MailContent {
  subject: string;
  text: string;
  html: string;
}

const BRAND = () => MARKETING.brand.name;
const SHOP = () => MARKETING.etsy.shopName;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Only http(s) links go into an email. */
function safeUrl(u: string): string {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

const originOf = (u: string) => {
  try {
    return new URL(u).origin;
  } catch {
    return '';
  }
};

type Block = { p: string } | { button: { label: string; href: string } } | { small: string } | { link: { label: string; href: string } };

const INK = '#2B1526';
const PAPER = '#EDE5D7';
const CARD = '#FBF8F2';

function page(lang: 'en' | 'tr', title: string, blocks: Block[]): string {
  const body = blocks
    .map((b) => {
      if ('p' in b) return `<p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:${INK}">${b.p}</p>`;
      if ('small' in b) return `<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#5b4a55">${b.small}</p>`;
      if ('link' in b) {
        const href = esc(safeUrl(b.link.href));
        return `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;word-break:break-all"><a href="${href}" style="color:${INK}">${esc(b.link.label)}</a></p>`;
      }
      const href = esc(safeUrl(b.button.href));
      return (
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px"><tr><td style="border-radius:999px;background:${INK}">` +
        `<a href="${href}" style="display:inline-block;padding:15px 26px;font-size:17px;font-weight:600;color:${CARD};text-decoration:none;border-radius:999px">${esc(b.button.label)}</a>` +
        `</td></tr></table>`
      );
    })
    .join('\n');
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:Georgia,'Times New Roman',serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${CARD};border-radius:16px">
<tr><td style="padding:28px 24px 8px;font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:${INK}">${esc(BRAND())}</td></tr>
<tr><td style="padding:8px 24px 24px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:${INK}">${esc(title)}</h1>
${body}
</td></tr></table>
</td></tr></table>
</body></html>`;
}

/** After /start: the private edit link + how to continue on another device. */
export function createdEmail(m: EditLinkMessage): MailContent {
  const editUrl = safeUrl(m.editUrl);
  const siteUrl = safeUrl(m.siteUrl);
  const myUrl = `${originOf(m.editUrl)}/my`;
  const title = 'Your wedding website is ready to edit';
  const subject = `Your private edit link — ${m.themeName}`;
  const text = [
    `${title}`,
    '',
    `You started your website with the ${m.themeName} design (Etsy order #${m.orderNumber}).`,
    '',
    'Open your editor:',
    editUrl,
    '',
    'Keep this email. This link is private: anyone who has it can edit your website, so please do not forward it.',
    '',
    `Continue on any device: go to ${myUrl} and sign in with your Etsy order number and this email address.`,
    '',
    `Your website address: ${siteUrl} (your guests can open it after you publish).`,
    '',
    `Questions? Message ${SHOP()} on Etsy with your order number.`,
    '',
    `— ${BRAND()}`,
  ].join('\n');
  const html = page('en', title, [
    { p: `You started your website with the <strong>${esc(m.themeName)}</strong> design (Etsy order #${esc(m.orderNumber)}).` },
    { button: { label: 'Open your editor', href: editUrl } },
    { small: 'Keep this email. This link is private: anyone who has it can edit your website, so please do not forward it.' },
    { p: `<strong>Continue on any device:</strong> go to <a href="${esc(myUrl)}" style="color:${INK}">${esc(myUrl.replace(/^https?:\/\//, ''))}</a> and sign in with your Etsy order number and this email address.` },
    { p: 'Your website address (your guests can open it after you publish):' },
    { link: { label: siteUrl.replace(/^https?:\/\//, ''), href: siteUrl } },
    { small: `Questions? Message ${esc(SHOP())} on Etsy with your order number.` },
  ]);
  return { subject, text, html };
}

/** A sign-in link the buyer asked for on /my. */
export function signinEmail(m: EditLinkMessage): MailContent {
  const editUrl = safeUrl(m.editUrl);
  const title = 'Your sign-in link';
  const subject = `Sign in to your wedding website — order #${m.orderNumber}`;
  const text = [
    title,
    '',
    `Someone asked to open the editor of your wedding website (${m.themeName} design, Etsy order #${m.orderNumber}).`,
    '',
    'Open your editor:',
    editUrl,
    '',
    'This link is private: please do not forward it. If you did not ask for it, you can ignore this email.',
    '',
    `Questions? Message ${SHOP()} on Etsy with your order number.`,
    '',
    `— ${BRAND()}`,
  ].join('\n');
  const html = page('en', title, [
    { p: `Someone asked to open the editor of your wedding website (<strong>${esc(m.themeName)}</strong> design, Etsy order #${esc(m.orderNumber)}).` },
    { button: { label: 'Open your editor', href: editUrl } },
    { small: 'This link is private: please do not forward it. If you did not ask for it, you can ignore this email.' },
    { small: `Questions? Message ${esc(SHOP())} on Etsy with your order number.` },
  ]);
  return { subject, text, html };
}

export interface PendingOrderNotice {
  orderNumber: string;
  themeName: string;
  /** Absolute link to the site's admin page (no secret in it). */
  adminUrl: string;
}

/** To the shop: a site was started and its order waits for a check (manual mode, or Etsy could not confirm it yet). */
export function pendingOrderEmail(n: PendingOrderNotice): MailContent {
  const adminUrl = safeUrl(n.adminUrl);
  const subject = `New website started — order needs a check (#${n.orderNumber})`;
  const title = 'Yeni site başlatıldı — sipariş kontrol bekliyor';
  const text = [
    title,
    '',
    `Etsy sipariş no: #${n.orderNumber}`,
    `Tasarım: ${n.themeName}`,
    '',
    'Alıcı taslağı düzenleyebilir; sipariş onaylanana kadar yayınlayamaz. Siparişi Etsy\'de kontrol edip yönetimde onaylayın',
    '(Etsy bağlıysa "Bekleyen siparişleri Etsy\'de kontrol et" de onaylar):',
    adminUrl,
    '',
    `— ${BRAND()}`,
  ].join('\n');
  const html = page('tr', title, [
    { p: `Etsy sipariş no: <strong>#${esc(n.orderNumber)}</strong><br>Tasarım: ${esc(n.themeName)}` },
    { p: 'Alıcı taslağı düzenleyebilir; sipariş onaylanana kadar yayınlayamaz. Siparişi Etsy\'de kontrol edip yönetimde onaylayın (Etsy bağlıysa "Bekleyen siparişleri Etsy\'de kontrol et" de onaylar).' },
    { button: { label: 'Yönetimde aç', href: adminUrl } },
  ]);
  return { subject, text, html };
}

/** Admin "Test e-postası gönder". */
export function testEmail(adminUrl: string): MailContent {
  const title = 'E-posta gönderimi çalışıyor';
  const subject = `Test email from ${BRAND()}`;
  const url = safeUrl(adminUrl);
  const text = [title, '', 'Bu, yönetim panelinden gönderilen bir test e-postasıdır. Alıcılara düzenleme linki ve size sipariş bildirimleri bu hesaptan gider.', '', url, '', `— ${BRAND()}`].join('\n');
  const html = page('tr', title, [
    { p: 'Bu, yönetim panelinden gönderilen bir test e-postasıdır. Alıcılara düzenleme linki ve size sipariş bildirimleri bu hesaptan gider.' },
    { button: { label: 'Yönetime dön', href: url } },
  ]);
  return { subject, text, html };
}
