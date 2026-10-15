// Ready-to-send Etsy messages for the shop (G087, K30/K32). Titles and "when" are for the shop (Turkish, the admin's
// language); the bodies go to buyers (English). The admin fills in the buyer's details and copies the text
// into the Etsy conversation of the order (no e-mail is sent from the platform yet). English, plain text, short lines,
// only features that work today (docs/05 §E). Undecided business facts stay visible placeholders ([SUPPORT EMAIL] …):
// they come from lib/marketing/config.ts, so deciding them there updates every message.
// G091 (buyer journey) owns the wording; keep ids stable — the admin and its tests refer to them.

import { MARKETING } from '../marketing/config.ts';

export interface MessageVars {
  names: string;
  order: string | null;
  siteUrl: string;
  /** Only right after a new link was made (shown once); otherwise the template asks for it to be filled in. */
  editUrl?: string | null;
  startUrl: string;
  changesLeft?: number | null;
}

export interface MessageTemplate {
  id: string;
  title: string;
  /** When to send it (shown to the shop in Turkish, not sent). */
  when: string;
  /** Needs a fresh edit link: only offered right after "New edit link". */
  needsEditUrl?: boolean;
  body: (v: MessageVars) => string;
}

const sign = () => `Warmly,\n${/^\[.*\]$/.test(MARKETING.etsy.shopName) ? MARKETING.brand.name : MARKETING.etsy.shopName}`;

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'order_confirmed',
    title: 'Sipariş onaylandı — yayınlayabilir',
    when: 'Siparişi burada onayladıktan hemen sonra.',
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        `Thank you for your order${v.order ? ` (#${v.order})` : ''}. We have confirmed it, so your wedding website can now go live.`,
        '',
        'Open your editor with the private link you saved when you started, then tap Publish. If the editor was already open, refresh the page first.',
        '',
        `Your website address: ${v.siteUrl}`,
        '',
        'Lost your editor link? Just reply here and we will send you a new one.',
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'start_link_reminder',
    title: 'Nasıl başlanır (başlatma linki)',
    when: 'Alıcı sipariş verdi ama siteyi henüz başlatmadı ya da nasıl başlayacağını soruyor.',
    body: (v) =>
      [
        'Hi!',
        '',
        `Thank you for your order${v.order ? ` (#${v.order})` : ''}. You can set up your wedding website on your phone:`,
        '',
        `1. Open ${v.startUrl}`,
        '2. Enter your Etsy order number and your email.',
        '3. Save the private editor link it gives you (it is the key to your website).',
        '4. Add your names, date and a photo, then press Publish.',
        '',
        'No app and no account needed. Your website stays private until you publish it.',
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'new_edit_link',
    title: 'Yeni düzenleme linki',
    when: '"Yeni düzenleme linki"nden sonra — alıcı linkini kaybetti. Eski link artık çalışmaz.',
    needsEditUrl: true,
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        'Here is a new private link to edit your wedding website:',
        v.editUrl ?? '[NEW EDIT LINK]',
        '',
        'Please save it somewhere safe (for example your notes app). Anyone with this link can edit your website, so keep it private. Your old link no longer works; your website, photos and RSVP replies are unchanged.',
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'extra_change_granted',
    title: 'Ek isim/tarih hakkı eklendi',
    when: 'Alıcıya isim/tarih hakkı ekledikten sonra (ör. düğün ertelendi).',
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        `We have added ${v.changesLeft === 1 ? 'a name/date change' : 'name/date changes'} to your website${typeof v.changesLeft === 'number' ? ` — you now have ${v.changesLeft} left` : ''}.`,
        'Open your editor, go to Edit, then Us (names) or Day & place (date), tap Change, and publish.',
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'how_to_publish',
    title: 'Nasıl yayınlanır ve paylaşılır',
    when: 'Alıcı siteyi nasıl yayına alacağını ya da misafirlere nasıl göndereceğini soruyor.',
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        'To make your website live: open your editor and tap Publish at the top. After that every change you make is saved as a draft; tap "Publish changes" when you want guests to see it.',
        '',
        `To share it: open Share in the editor. You can copy the link (${v.siteUrl}) or show the QR code. Guests need no app or account; they open the link and can reply on the RSVP page.`,
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'publish_blocked_pending',
    title: 'Sipariş henüz onaylanmadı',
    when: 'Alıcı Publish düğmesinin neden açılmadığını soruyor (sipariş onay bekliyor).',
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        'Your website is safe and everything you set up is saved. Publishing opens as soon as we have confirmed your Etsy order — we are on it.',
        'Meanwhile you can keep adding your details and photos; nothing is lost.',
        '',
        sign(),
      ].join('\n'),
  },
  {
    id: 'general_help',
    title: 'Genel yardım',
    when: 'Diğer sorular.',
    body: (v) =>
      [
        `Hi ${v.names}!`,
        '',
        'Happy to help. Everything is done in your editor (the private link you saved): Edit for your details and photos, Guests for RSVP replies, Share for your link and QR code.',
        '',
        'If something does not look right, send us a screenshot here and we will sort it out.',
        '',
        sign(),
      ].join('\n'),
  },
];

export function messageTemplate(id: string): MessageTemplate | null {
  return MESSAGE_TEMPLATES.find((t) => t.id === id) ?? null;
}
