// "Yeni sipariş" in the shop admin (G095): the shop starts a website for a buyer (the buyer asked for help, an
// order from another channel, a replacement). Same rules as /start (lib/claim/claim.ts): a claimable theme open for
// sale, one website per order number, a free address, the theme's demo content with the buyer's names. The order is
// confirmed by the shop in the same write (it made the site itself); the edit link is returned ONCE and never stored.

import { OrderRefTakenError, SlugTakenError, type DataAdapter } from '../data/types.ts';
import { draftFromDemo, findFreeSlug } from '../claim/claim.ts';
import { cleanName, emailError, nameError, normalizeEmail, normalizeOrderNumber, normalizeSlugInput, orderNumberError, slugProblem, slugProblemMessage, suggestSlugBase } from '../claim/fields.ts';
import { claimableTheme, claimableThemes, type ClaimableThemeEntry } from '../claim/themes.ts';
import { themeOpenForClaims } from '../themes/approval.ts';
import { themeStartable } from '../themes/offered.ts';
import { createSiteWithKeys } from '../sites.ts';
import { SHOP_CREATED_NOTE } from './summary.ts';

export type AdminCreateField = 'theme' | 'orderNumber' | 'email' | 'name1' | 'name2' | 'slug';

export type AdminCreateResult =
  | { ok: true; id: string; slug: string; editUrl: string; siteUrl: string }
  | { ok: false; message: string; fields?: Partial<Record<AdminCreateField, string>>; existingId?: string };

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
  if (existing.length) {
    return { ok: false, message: `Bu sipariş numarasının zaten bir sitesi var (/${existing[0].slug}).`, fields: { orderNumber: 'Bu siparişin zaten sitesi var.' }, existingId: existing[0].id };
  }
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
    });
    const base = origin.replace(/\/+$/, '');
    return {
      ok: true,
      id: created.site.id,
      slug: created.site.slug,
      editUrl: `${base}/edit/${created.site.slug}?k=${encodeURIComponent(created.editKey)}`,
      siteUrl: `${base}/${created.site.slug}`,
    };
  } catch (e) {
    if (e instanceof OrderRefTakenError) return { ok: false, message: 'Bu sipariş numarasının zaten bir sitesi var.', fields: { orderNumber: 'Bu siparişin zaten sitesi var.' } };
    if (e instanceof SlugTakenError) return { ok: false, message: 'Bu adres az önce alındı; başka bir adres deneyin.', fields: { slug: 'Bu adres dolu.' } };
    throw e;
  }
}
