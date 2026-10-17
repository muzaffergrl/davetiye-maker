// Site operations on top of a DataAdapter: slug rules, keys, validation.
// Routes, the panel (G039), RSVP (G042) and /start (G045) call these instead of
// re-implementing the checks.

import type { ContentRecord } from './content/types.ts';
import { validateContent, type ValidationIssue } from './content/validate.ts';
import { NotFoundError, StaleSiteError, type DataAdapter, type PublishOptions, type SitePatch, type SiteRecord } from './data/types.ts';
import { findDeviceKey, revokeDeviceKeys } from './device-keys.ts';
import { generateKey, hashKey, newSiteKeys, verifyKey, verifyPanelPreviewToken } from './keys.ts';
import {
  appendLog,
  archivingDateIssue,
  classifyIdentityChange,
  draftPreviewExpired,
  effectiveRights,
  identityOf,
  isArchived,
  newIdentityRights,
} from './panel/rights.ts';
import { isAvailableSlugShape } from './slug.ts';
import { copyIssues } from './theme/copy.ts';
import { loadTheme } from './theme/theme.ts';

export class InvalidSlugError extends Error {
  constructor(slug: string) {
    super(`"${slug}" cannot be used as a site address`);
    this.name = 'InvalidSlugError';
  }
}

export class UnknownThemeError extends Error {
  constructor(theme: string) {
    super(`Theme "${theme}" does not exist`);
    this.name = 'UnknownThemeError';
  }
}

export class ContentInvalidError extends Error {
  readonly issues: ValidationIssue[];
  constructor(issues: ValidationIssue[]) {
    super(`Content is not valid: ${issues.map((i) => `${i.path}: ${i.message}`).join('; ')}`);
    this.name = 'ContentInvalidError';
    this.issues = issues;
  }
}

/** The site is a read-only archive (G060, docs/16 §11.9): no writes. */
export class SiteArchivedError extends Error {
  constructor(id: string) {
    super(`site ${id} is archived`);
    this.name = 'SiteArchivedError';
  }
}

/**
 * Publish refused: the draft's names/date differ from the last counted identity by more than a typo
 * (G060 defense; the autosave keeps the identity after the first publish, so only records from before
 * G060 can get here). The buyer confirms the change in the panel (it uses one of their changes).
 */
export class IdentityMismatchError extends Error {
  constructor(id: string) {
    super(`site ${id}: the draft's names or date need a confirmed change before publishing`);
    this.name = 'IdentityMismatchError';
  }
}

/**
 * Publish refused: the site was claimed while order checks are manual (CLAIM_ORDER_VERIFICATION=manual) and the
 * shop has not confirmed the Etsy order yet (scripts/verify-order.ts). G060-fix.
 */
export class OrderPendingError extends Error {
  constructor(id: string) {
    super(`site ${id}: the Etsy order is not confirmed yet`);
    this.name = 'OrderPendingError';
  }
}

/** True while the site waits for the shop to confirm its order (it can be edited, not published or shared). */
export function orderPending(site: Pick<SiteRecord, 'orderCheck'>): boolean {
  return site.orderCheck?.status === 'pending';
}

export interface CreateSiteInput {
  slug: string;
  theme: string;
  variant?: string | null;
  content: ContentRecord;
  orderRef?: string | null;
  ownerEmail?: string | null;
  /** SHA-256 of the /start form's claim token (lib/claim/claim.ts). */
  claimTokenHash?: string | null;
  /** The order check the claim recorded (lib/claim/verify.ts), written with the site. */
  orderCheck?: SiteRecord['orderCheck'];
}

export interface CreatedSite {
  site: SiteRecord;
  /** Shown to the buyer once; only its hash is stored. */
  editKey: string;
  /** Derivable from editKey (derivePreviewKey); safe to share for draft previews. */
  previewKey: string;
}

/** Creates a draft site with fresh keys. Throws InvalidSlugError, UnknownThemeError, ContentInvalidError, SlugTakenError. */
export async function createSiteWithKeys(adapter: DataAdapter, input: CreateSiteInput): Promise<CreatedSite> {
  if (!isAvailableSlugShape(input.slug)) throw new InvalidSlugError(input.slug);
  if (!(await loadTheme(input.theme))) throw new UnknownThemeError(input.theme);
  const result = validateContent(input.content);
  if (!result.ok) throw new ContentInvalidError(result.errors);
  const keys = newSiteKeys();
  const site = await adapter.createSite({
    slug: input.slug,
    theme: input.theme,
    variant: input.variant ?? null,
    content: input.content,
    editKeyHash: keys.editKeyHash,
    previewKeyHash: keys.previewKeyHash,
    orderRef: input.orderRef ?? null,
    ownerEmail: input.ownerEmail ?? null,
    claimTokenHash: input.claimTokenHash ?? null,
    ...(input.orderCheck ? { orderCheck: input.orderCheck } : {}),
  });
  return { site, editKey: keys.editKey, previewKey: keys.previewKey };
}

/**
 * New edit + preview keys for an existing site (lost edit link, or a /start retry whose answer
 * never arrived). The old edit and preview links stop working. Only the hashes are stored.
 * G146: every device key (lib/device-keys.ts) stops working too — they belong to the old edit key's generation, and
 * their document is deleted.
 */
export async function reissueKeys(adapter: DataAdapter, siteId: string): Promise<CreatedSite> {
  const keys = newSiteKeys();
  const site = await adapter.updateKeys(siteId, { editKeyHash: keys.editKeyHash, previewKeyHash: keys.previewKeyHash });
  await revokeDeviceKeys(adapter, siteId);
  return { site, editKey: keys.editKey, previewKey: keys.previewKey };
}

/**
 * The buyer's own edit key or the shop's time-limited one (synchronous; no device keys). Every request that acts with a
 * key goes through editAccess (lib/rsvp/couple.ts authorizeEditor), which also accepts device keys.
 */
export function canEdit(site: SiteRecord, editKey: unknown, now: number = Date.now()): boolean {
  return verifyKey(editKey, site.editKeyHash) || isShopEditKey(site, editKey, now);
}

/**
 * Who is editing (G146): "owner" = the private edit link's key, "shop" = the shop's time-limited key (G145), "device" =
 * a device key from "continue with your order number" (lib/device-keys.ts; `deviceId` names its entry). Null: no access.
 * THE one check of an edit key: the panel page, the panel API, uploads, music, map links, Google Sheets, downloads and
 * the RSVP list / CSV / Excel all reach it through authorizeEditor.
 */
export type EditAccess = { kind: 'owner' } | { kind: 'shop' } | { kind: 'device'; deviceId: string };

export async function editAccess(adapter: DataAdapter, site: SiteRecord, editKey: unknown, now: number = Date.now()): Promise<EditAccess | null> {
  if (verifyKey(editKey, site.editKeyHash)) return { kind: 'owner' };
  if (isShopEditKey(site, editKey, now)) return { kind: 'shop' };
  const device = await findDeviceKey(adapter, site, editKey);
  return device ? { kind: 'device', deviceId: device.id } : null;
}

/** G145: the shop's time-limited edit key (lib/admin, "Dükkân olarak düzenle"); the buyer's own key is untouched. */
export function isShopEditKey(site: SiteRecord, editKey: unknown, now: number = Date.now()): boolean {
  const s = site.shopEdit;
  if (!s || !(Date.parse(s.expiresAt) > now)) return false;
  return verifyKey(editKey, s.keyHash);
}

/** How long a shop edit link works (the setup service is delivered within 3 days, docs/23). */
export const SHOP_EDIT_TTL_MS = 72 * 60 * 60_000;
const SHOP_EDIT_LOG_MAX = 30;

/**
 * A new shop edit link for the site (an earlier one stops working). Returns the key once; only its hash is stored.
 * The buyer's edit link, preview key and everything else stay as they are.
 */
export async function issueShopEditKey(adapter: DataAdapter, siteId: string, now: Date = new Date()): Promise<{ site: SiteRecord; editKey: string }> {
  const site = await adapter.getSiteById(siteId);
  if (!site) throw new NotFoundError(siteId);
  const key = generateKey();
  const at = now.toISOString();
  const updated = await adapter.patchSite(siteId, {
    shopEdit: { keyHash: hashKey(key), issuedAt: at, expiresAt: new Date(now.getTime() + SHOP_EDIT_TTL_MS).toISOString() },
    shopEditLog: [...(site.shopEditLog ?? []), { kind: 'issued' as const, at }].slice(-SHOP_EDIT_LOG_MAX),
  });
  return { site: updated, editKey: key };
}

/** Ends the shop edit link now (no-op when there is none). */
export async function endShopEditKey(adapter: DataAdapter, siteId: string, now: Date = new Date()): Promise<SiteRecord> {
  const site = await adapter.getSiteById(siteId);
  if (!site) throw new NotFoundError(siteId);
  if (!site.shopEdit) return site;
  return adapter.patchSite(siteId, {
    shopEdit: null,
    shopEditLog: [...(site.shopEditLog ?? []), { kind: 'ended' as const, at: now.toISOString() }].slice(-SHOP_EDIT_LOG_MAX),
  });
}

/** True for the site's long-lived (shareable) preview key. Public routes use previewAccess(). */
export function canPreview(site: SiteRecord, previewKey: unknown): boolean {
  return verifyKey(previewKey, site.previewKeyHash);
}

/**
 * What a ?preview= value opens (G060-fix, docs/16 §11.11):
 *  - 'panel':  the panel's short-lived token (lib/keys.ts panelPreviewToken): the draft, also of an archived site
 *              (the couple still sees their content in the panel);
 *  - 'shared': the long-lived preview key: the draft, under a "Preview — not published" bar;
 *  - 'gone':   the long-lived key of an archived site, or of a never-published draft whose shared preview has run out
 *              (DRAFT_PREVIEW_MAX_MONTHS): 410, so the preview link can never stand in for the real, time-limited website;
 *  - null:     anything else (public rules apply).
 */
export type PreviewAccess = 'panel' | 'shared' | 'gone';

export function previewAccess(site: SiteRecord, value: unknown, now: Date = new Date()): PreviewAccess | null {
  if (typeof value !== 'string' || !value) return null;
  if (verifyPanelPreviewToken(value, site.id, site.previewKeyHash, now.getTime())) return 'panel';
  // While its order is unconfirmed a site is seen only in its panel (G060-fix): no shared preview either.
  if (orderPending(site) || !verifyKey(value, site.previewKeyHash)) return null;
  return isArchived(site, now) || draftPreviewExpired(site, now) ? 'gone' : 'shared';
}

/**
 * Validates the draft content, then publishes exactly that version (the adapter refuses with
 * StaleSiteError if anything was saved after the read, so unvalidated content is never published).
 * With `expectedUpdatedAt` (the version the buyer saw) a newer draft is a StaleSiteError right away;
 * without it a draft saved in between is simply read and validated again.
 * The FIRST publish also writes the edit-rights bookkeeping (G060: firstPublishedAt + the identity anchor,
 * in the same write). Throws ContentInvalidError, SiteArchivedError, IdentityMismatchError.
 */
export async function publishSite(
  adapter: DataAdapter,
  siteId: string,
  opts: { expectedUpdatedAt?: string; now?: Date } = {},
): Promise<SiteRecord> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    if (opts.expectedUpdatedAt !== undefined && site.updatedAt !== opts.expectedUpdatedAt) {
      throw new StaleSiteError(siteId, site.updatedAt);
    }
    const now = opts.now ?? new Date();
    if (isArchived(site, now)) throw new SiteArchivedError(siteId);
    if (orderPending(site)) throw new OrderPendingError(siteId);
    const result = validateContent(site.content);
    // G068: the couple's design texts within what the design carries (theme.json copy max)
    const copyErrors = copyIssues(site.content, (await loadTheme(site.theme))?.manifest.copy ?? {}).filter((i) => i.level === 'error');
    if (!result.ok || copyErrors.length) throw new ContentInvalidError([...result.errors, ...copyErrors]);
    const rights = effectiveRights(site);
    let set: PublishOptions['set'];
    if (!rights.firstPublishedAt || !rights.identity) {
      const at = now.toISOString();
      // A date more than 12 months ago would archive the site the moment it goes live (and lock its date).
      const dateIssue = archivingDateIssue(site.content, at, now);
      if (dateIssue) throw new ContentInvalidError([dateIssue]);
      set = { firstPublishedAt: at, identity: newIdentityRights(identityOf(site.content), at) };
    } else {
      if (classifyIdentityChange(rights.identity.anchor, identityOf(site.content)).kind === 'change') throw new IdentityMismatchError(siteId);
      if (rights.migrated) set = { firstPublishedAt: rights.firstPublishedAt, identity: rights.identity };
    }
    try {
      return await adapter.publish(siteId, { expectedUpdatedAt: site.updatedAt, ...(set ? { set } : {}) });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || opts.expectedUpdatedAt !== undefined || attempt >= 3) throw e;
    }
  }
}

/** Takes the site offline: public routes 404; the draft and the last published copy are kept. */
export async function unpublishSite(adapter: DataAdapter, siteId: string): Promise<SiteRecord> {
  return adapter.unpublish(siteId);
}

/**
 * Support tool (scripts/grant-identity-change.ts, G060): adds name/date changes after the shop has checked
 * the case (e.g. the wedding really moved). Throws when the site was never published (nothing is counted before that).
 */
export async function grantIdentityChanges(adapter: DataAdapter, siteId: string, add: number, reason: string, now: Date = new Date()): Promise<SiteRecord> {
  if (!Number.isInteger(add) || add < 1 || add > 10) throw new Error('--add must be a whole number from 1 to 10.');
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    const rights = effectiveRights(site);
    if (!rights.firstPublishedAt || !rights.identity) throw new Error('This site was never published: its names and date can still be changed freely.');
    const identity = {
      ...rights.identity,
      granted: rights.identity.granted + add,
      log: appendLog(rights.identity.log, { at: now.toISOString(), kind: 'grant', by: 'support', note: `+${add}: ${reason}`.slice(0, 300) }),
    };
    try {
      return await adapter.patchSite(siteId, { firstPublishedAt: rights.firstPublishedAt, identity }, { expectedUpdatedAt: site.updatedAt });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}

/**
 * Support tool (scripts/verify-order.ts, G060-fix): the shop has found the order in Etsy (paid, our shop, this design):
 * the site may be published. Idempotent; the reason is kept on the site.
 */
export async function confirmOrder(adapter: DataAdapter, siteId: string, reason: string, now: Date = new Date()): Promise<SiteRecord> {
  if (!reason.trim()) throw new Error('Give a reason (it is kept with the site).');
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    if (site.orderCheck?.status === 'verified') return site;
    const orderCheck = { status: 'verified' as const, at: now.toISOString(), by: 'support' as const, note: reason.trim().slice(0, 300) };
    try {
      return await adapter.patchSite(siteId, { orderCheck }, { expectedUpdatedAt: site.updatedAt });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}

/** Support tool: sets (YYYY-MM-DD, archived from 00:00 that day) or clears (null) the archive date override, logged with a reason. */
export async function setArchiveOverride(adapter: DataAdapter, siteId: string, day: string | null, reason: string, now: Date = new Date()): Promise<SiteRecord> {
  if (day !== null && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(day)) throw new Error('--archive-on must be YYYY-MM-DD.');
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    const rights = effectiveRights(site);
    const patch: SitePatch = { archiveOverrideAt: day };
    if (rights.firstPublishedAt && rights.identity) {
      patch.firstPublishedAt = rights.firstPublishedAt;
      patch.identity = {
        ...rights.identity,
        log: appendLog(rights.identity.log, { at: now.toISOString(), kind: 'archive_override', by: 'support', note: `${day ?? 'cleared'}: ${reason}`.slice(0, 300) }),
      };
    }
    try {
      return await adapter.patchSite(siteId, patch, { expectedUpdatedAt: site.updatedAt });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || attempt >= 5) throw e;
    }
  }
}
