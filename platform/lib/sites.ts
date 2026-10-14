// Site operations on top of a DataAdapter: slug rules, keys, validation.
// Routes, the panel (G039), RSVP (G042) and /start (G045) call these instead of
// re-implementing the checks.

import type { ContentRecord } from './content/types.ts';
import { validateContent, type ValidationIssue } from './content/validate.ts';
import { StaleSiteError, type DataAdapter, type PublishOptions, type SitePatch, type SiteRecord } from './data/types.ts';
import { newSiteKeys, verifyKey } from './keys.ts';
import {
  appendLog,
  archivingDateIssue,
  classifyIdentityChange,
  effectiveRights,
  identityOf,
  isArchived,
  newIdentityRights,
} from './panel/rights.ts';
import { isAvailableSlugShape } from './slug.ts';
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

export interface CreateSiteInput {
  slug: string;
  theme: string;
  variant?: string | null;
  content: ContentRecord;
  orderRef?: string | null;
  ownerEmail?: string | null;
  /** SHA-256 of the /start form's claim token (lib/claim/claim.ts). */
  claimTokenHash?: string | null;
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
  });
  return { site, editKey: keys.editKey, previewKey: keys.previewKey };
}

/**
 * New edit + preview keys for an existing site (lost edit link, or a /start retry whose answer
 * never arrived). The old edit and preview links stop working. Only the hashes are stored.
 */
export async function reissueKeys(adapter: DataAdapter, siteId: string): Promise<CreatedSite> {
  const keys = newSiteKeys();
  const site = await adapter.updateKeys(siteId, { editKeyHash: keys.editKeyHash, previewKeyHash: keys.previewKeyHash });
  return { site, editKey: keys.editKey, previewKey: keys.previewKey };
}

export function canEdit(site: SiteRecord, editKey: unknown): boolean {
  return verifyKey(editKey, site.editKeyHash);
}

export function canPreview(site: SiteRecord, previewKey: unknown): boolean {
  return verifyKey(previewKey, site.previewKeyHash);
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
    const result = validateContent(site.content);
    if (!result.ok) throw new ContentInvalidError(result.errors);
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
