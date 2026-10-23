// "Yeni sipariş" in the shop admin (G095): the shop starts a website for a buyer (the buyer asked for help, an
// order from another channel, a replacement). Same rules as /start (lib/claim/claim.ts): a claimable theme open for
// sale, a free address, the theme's demo content with the buyer's names. The order is confirmed by the shop in the same
// write (it made the site itself); the edit link is returned ONCE and never stored.
// G951: an order number that already has websites is refused with their list (`orderSites`) — unless the shop confirms
// that the Etsy order holds one more design (`addToOrder: true`, the form's explicit second step): the website then takes
// the order's next free design unit (orderSlot), at most MAX_ORDER_SITES.

import { OrderRefTakenError, SlugTakenError, type DataAdapter } from '../data/types.ts';
import { draftFromDemo, findFreeSlug, orderRoom } from '../claim/claim.ts';
import { cleanName, emailError, nameError, normalizeEmail, normalizeOrderNumber, normalizeSlugInput, orderNumberError, slugProblem, slugProblemMessage, suggestSlugBase } from '../claim/fields.ts';
import { claimableTheme, claimableThemes, type ClaimableThemeEntry } from '../claim/themes.ts';
import { themeOpenForClaims } from '../themes/approval.ts';
import { themeStartable } from '../themes/offered.ts';
import { createSiteWithKeys } from '../sites.ts';
import { MAX_ORDER_SITES } from '../claim/verify.ts';
import { SHOP_CREATED_NOTE, summarizeSite, themeName } from './summary.ts';

export type AdminCreateField = 'theme' | 'orderNumber' | 'email' | 'name1' | 'name2' | 'slug';

export type AdminCreateResult =
  | { ok: true; id: string; slug: string; editUrl: string; siteUrl: string; orderSlot: number }
  | {
      ok: false;
      message: string;
      fields?: Partial<Record<AdminCreateField, string>>;
      existingId?: string;
      /** G951: the order's websites; with it the form asks "add one more website to this order?" (`addToOrder`). */
      orderSites?: Array<{ id: string; slug: string; themeName: string; names: string; ownerEmail: string | null }>;
    };

/** Designs the shop can start a website from (claimable and open for sale) + every private custom design (G151). */
export async function adminCreatableThemes(): Promise<ClaimableThemeEntry[]> {
  return (await claimableThemes({ includePrivate: true })).filter((t) => t.privateOrders !== undefined || themeOpenForClaims(t.id));
}

function str(v: unknown, max = 200): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function adminCreateSite(adapter: DataAdapter, origin: string, body: Record<string, unknown>, now: Date = new Date()): Promise<AdminCreateResult> {
  const fields: Partial<Record<AdminCreateField, string>> = {};
  // G151: the shop may always use a private custom design (for any order number it types).
  const theme = await claimableTheme(str(body.theme, 80), { trusted: true });
  if (!theme || !themeStartable(theme)) fields.theme = 'Bir tasarım seçin.';
  const orderRaw = str(body.orderNumber, 40);
  const orderErr = orderNumberError(orderRaw);
  if (orderErr) fields.orderNumber = 'Etsy sipariş numarası 8–12 rakam olmalı.';
  const emailRaw = str(body.email, 260);
  if (emailError(emailRaw)) fields.email = 'Geçerli bir e-posta yazın (alıcının Etsy e-postası).';
  const names = [str(body.name1, 80), str(body.name2, 80)];
  const partnerCount = theme?.partnerCount ?? 2;
  for (let i = 0; i < partnerCount; i++) {
    if (nameError(names[i])) fields[i === 0 ? 'name1' : 'name2'] = 'İsim yazın (yalnız ad yeterli).';
  }
  const slugRaw = normalizeSlugInput(str(body.slug, 80));
  if (slugRaw) {
    const problem = slugProblem(slugRaw);
    if (problem) fields.slug = slugProblemMessage(problem);
  }
  if (Object.keys(fields).length || !theme) return { ok: false, message: 'Eksik ya da hatalı alanlar var.', fields };

  const orderNumber = normalizeOrderNumber(orderRaw)!;
  const email = normalizeEmail(emailRaw)!;
  const existing = await adapter.findSitesByOrderRef(orderNumber);
  const room = orderRoom(existing, { result: 'not_checked' });
  if (existing.length) {
    const orderSites = existing.map((x) => ({ id: x.id, slug: x.slug, themeName: themeName(x.theme), names: summarizeSite(x, 0, now).names, ownerEmail: x.ownerEmail }));
    if (room.slot === null) {
      return { ok: false, message: `Bu siparişte zaten ${existing.length} site var (en çok ${MAX_ORDER_SITES}).`, fields: { orderNumber: 'Bu siparişe site eklenemez.' }, existingId: existing[0].id, orderSites };
    }
    if (body.addToOrder !== true) {
      return {
        ok: false,
        message: `Bu sipariş numarasının zaten ${existing.length === 1 ? 'bir sitesi' : `${existing.length} sitesi`} var. Etsy siparişinde bir tasarım daha varsa aşağıdan onaylayıp ekleyin.`,
        fields: { orderNumber: 'Bu siparişin zaten sitesi var.' },
        existingId: existing[0].id,
        orderSites,
      };
    }
  }
  const slot = existing.length ? room.slot! : 1;
  const buyerNames = names.slice(0, partnerCount).map(cleanName);
  let slug = slugRaw;
  if (slug) {
    if (await adapter.getSiteBySlug(slug)) {
      const suggestion = await findFreeSlug(adapter, slug);
      return { ok: false, message: 'Bu adres dolu.', fields: { slug: `Bu adres dolu${suggestion ? ` — öneri: ${suggestion}` : ''}.` } };
    }
  } else {
    const free = await findFreeSlug(adapter, suggestSlugBase(buyerNames));
    if (!free) return { ok: false, message: 'Boş adres bulunamadı; bir adres yazın.', fields: { slug: 'Bir adres yazın.' } };
    slug = free;
  }
  try {
    const created = await createSiteWithKeys(adapter, {
      slug,
      theme: theme.id,
      content: draftFromDemo(theme.demo, buyerNames),
      orderRef: orderNumber,
      ownerEmail: email,
      orderCheck: { status: 'verified', at: now.toISOString(), by: 'support', note: SHOP_CREATED_NOTE },
      ...(slot > 1 ? { orderSlot: slot } : {}),
    });
    const base = origin.replace(/\/+$/, '');
    return {
      ok: true,
      id: created.site.id,
      slug: created.site.slug,
      editUrl: `${base}/edit/${created.site.slug}?k=${encodeURIComponent(created.editKey)}`,
      siteUrl: `${base}/${created.site.slug}`,
      orderSlot: slot,
    };
  } catch (e) {
    if (e instanceof OrderRefTakenError) return { ok: false, message: 'Bu siparişe tam o sırada başka bir site eklendi; sayfayı yenileyip tekrar deneyin.', fields: { orderNumber: 'Bu siparişin zaten sitesi var.' } };
    if (e instanceof SlugTakenError) return { ok: false, message: 'Bu adres az önce alındı; başka bir adres deneyin.', fields: { slug: 'Bu adres dolu.' } };
    throw e;
  }
}
