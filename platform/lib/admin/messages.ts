// Ready-to-send Etsy messages for the shop (G087 + G091, K30/K32/K33). The texts are G091's (buyer journey,
// docs/19_ALICI_YOLCULUGU.md §4.5); their single source is ./message-templates.json — docs/19 carries a copy between
// the g091:templates markers and tests/g087-admin.test.ts keeps the two identical. Bodies go to buyers (English); the
// title and "when" the admin shows are Turkish (the shop's language, TITLES_TR below).
//
// A text that still holds an unfilled {placeholder} or an undecided [POLICY] cannot be copied from the admin (docs/19
// §4.6): nothing half-written ever reaches a buyer. Decided business facts (shop name …) come from lib/marketing/config.ts.

import type { AdminMessageLogEntry } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';
import RAW from './message-templates.json' with { type: 'json' };

export type MessagePlaceholder = 'order' | 'names' | 'design' | 'site_url' | 'edit_url' | 'start_url' | 'shop' | 'changes_left' | 'online_until';

interface RawTemplate {
  id: string;
  title: string;
  when: string;
  placeholders: MessagePlaceholder[];
  body: string[];
  note?: string;
}

export interface MessageTemplate {
  id: string;
  /** Turkish title for the shop (falls back to G091's English title). */
  title: string;
  /** When to send it (Turkish when known, else G091's English text). */
  when: string;
  placeholders: MessagePlaceholder[];
  /** Needs a fresh edit link: offered only right after "Yeni düzenleme linki". */
  needsEditUrl: boolean;
  /** G091's note for the shop (never sent). */
  note: string | null;
  body: string[];
}

const TITLES_TR: Record<string, [string, string]> = {
  welcome_start: ['Hoş geldin + başlatma linki', 'İsteğe bağlı, siparişten hemen sonra (Etsy\'nin otomatik dijital ürün mesajı linki zaten veriyor) ya da alıcı başlamadan yazarsa.'],
  start_link_reminder: ['Hatırlatma: sitenizi başlatın', 'Siparişten ~3 gün sonra bu siparişle site açılmadıysa, ya da alıcı PDF\'i/linki bulamıyorsa. Bir kez gönderin.'],
  publish_blocked_pending: ['Sipariş onaylanıyor (Publish bekliyor)', 'Alıcı Publish\'in neden çalışmadığını soruyor; sipariş henüz onaylanmadı.'],
  order_confirmed: ['Sipariş onaylandı — yayınlayabilir', 'Siparişi burada onayladıktan hemen sonra. Platform alıcıya kendiliğinden haber vermez.'],
  how_to_publish: ['Nasıl yayınlanır / misafirler değişikliği görmüyor', 'Alıcı nasıl yayınlayacağını soruyor ya da misafirlerin bir değişikliği görmediğini söylüyor.'],
  new_edit_link: ['Yeni düzenleme linki (kayıp link)', '"Yeni düzenleme linki"nden sonra. Yalnız bu siparişin kendi Etsy konuşmasında gönderin.'],
  shop_created_site: ['Siteniz hazır (dükkân kurdu) + düzenleme linki', '"Yeni sipariş" ile siteyi siz oluşturduktan hemen sonra. Link yalnız o an gösterilir.'],
  order_already_used: ['"Bu siparişin zaten sitesi var" hatası', 'Alıcı başlatma sayfasında "This order already has a website" gördüğünü söylüyor.'],
  wrong_design_started: ['Başka tasarımla başlamış', 'Alıcı satın aldığından farklı bir tasarımla site açmış.'],
  extra_change_granted: ['Ek isim/tarih hakkı eklendi', 'Hak ekledikten sonra (ör. düğün gerçekten ertelendi).'],
  date_moved: ['Düğün tarihi değişti', 'Alıcı düğünün ertelendiğini/taşındığını söylüyor.'],
  photo_upload_help: ['Fotoğraf yüklenmiyor', 'Alıcı bir fotoğrafın yüklenmediğini ya da açılmadığını söylüyor.'],
  guest_access_help: ['Misafir siteyi açamıyor', 'Alıcı bir misafirin linki ya da QR kodu açamadığını söylüyor.'],
  general_help: ['Genel yardım', 'Başka şablonun karşılamadığı her soru.'],
  archive_notice: ['Site yakında kapanıyor', '"Yayında kalır" tarihinden ~30 gün önce (panelin Home\'u da hatırlatıyor; e-posta gitmiyor).'],
  after_wedding_tip: ['Düğün sonrası: teşekkür sayfası', 'İsteğe bağlı, düğünden birkaç gün sonra. Yalnız sipariş/destek, reklam yok (Etsy mesaj kuralları).'],
  review_request: ['Yorum isteği (bir kez)', 'Sipariş başına bir kez; site yayında, ilk yanıtlar gelmiş ve açık sorun yokken. Herkese aynı metin.'],
  refund_or_problem: ['İade isteği / memnun olmayan alıcı', 'Alıcı iade istiyor ya da ürünün işine yaramadığını söylüyor.'],
  delete_data: ['Sitemi ve verilerimi silin', 'Alıcı sitenin ya da misafir verilerinin silinmesini istiyor.'],
};

export const MESSAGE_TEMPLATES: MessageTemplate[] = (RAW as RawTemplate[]).map((t) => ({
  id: t.id,
  title: TITLES_TR[t.id]?.[0] ?? t.title,
  when: TITLES_TR[t.id]?.[1] ?? t.when,
  placeholders: t.placeholders,
  needsEditUrl: t.placeholders.includes('edit_url'),
  note: t.note ?? null,
  body: t.body,
}));

/** The raw G091 templates (tests compare them with the copy in docs/19). */
export const RAW_MESSAGE_TEMPLATES = RAW as RawTemplate[];

export function messageTemplate(id: string): MessageTemplate | null {
  return MESSAGE_TEMPLATES.find((t) => t.id === id) ?? null;
}

export interface MessageVars {
  names: string;
  order: string | null;
  design: string;
  siteUrl: string;
  startUrl: string;
  /** Only right after a new link was made (shown once). */
  editUrl?: string | null;
  changesLeft?: number | null;
  /** Long date ("February 11, 2028"), once known. */
  onlineUntil?: string | null;
}

export interface RenderedMessage {
  text: string;
  /** What still has to be decided or filled before it can be sent ({placeholder} or [POLICY]); empty = ready. */
  missing: string[];
}

function shopName(): string {
  return /^\[.*\]$/.test(MARKETING.etsy.shopName) ? MARKETING.brand.name : MARKETING.etsy.shopName;
}

export function renderMessage(t: MessageTemplate, v: MessageVars): RenderedMessage {
  const values: Record<MessagePlaceholder, string | null> = {
    order: v.order,
    names: v.names || null,
    design: v.design || null,
    site_url: v.siteUrl || null,
    edit_url: v.editUrl ?? null,
    start_url: v.startUrl || null,
    shop: shopName(),
    changes_left: typeof v.changesLeft === 'number' ? String(v.changesLeft) : null,
    online_until: v.onlineUntil ?? null,
  };
  const text = t.body
    .join('\n\n')
    .replace(/\{([a-z_]+)\}/g, (all, key: string) => (key in values && values[key as MessagePlaceholder] !== null ? values[key as MessagePlaceholder]! : all));
  return { text, missing: messageMissing(text) };
}

/**
 * What still has to be filled in a message text: an unfilled {placeholder} or an undecided [POLICY] (docs/19 §4.6).
 * G121: the admin may edit the text before copying it (docs/19 §6 A1), so the check runs on the edited text too.
 */
export function messageMissing(text: string): string[] {
  return [...new Set([...(text.match(/\{[a-z_]+\}/g) ?? []), ...(text.match(/\[[A-Z][A-Z0-9 /&'.-]*\]/g) ?? [])])];
}

/** A copied Etsy message as the site's history keeps it: which template and when — never the text (docs/19 §6 A1). */
export type MessageLogEntry = AdminMessageLogEntry;

/** At most this many copied-message entries are kept per site (newest last). */
export const MESSAGE_LOG_LIMIT = 50;

/** The site's message log with one more entry (unknown template ids are refused by the caller). */
export function withMessageLog(log: readonly MessageLogEntry[] | null | undefined, id: string, at: string): MessageLogEntry[] {
  return [...(log ?? []), { id, at }].slice(-MESSAGE_LOG_LIMIT);
}
