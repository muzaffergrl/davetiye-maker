// Site operations on top of a DataAdapter: slug rules, keys, validation.
// Routes, the panel (G039), RSVP (G042) and /start (G045) call these instead of
// re-implementing the checks.

import type { ContentRecord } from './content/types.ts';
import { validateContent, type ValidationIssue } from './content/validate.ts';
import { StaleSiteError, type DataAdapter, type SiteRecord } from './data/types.ts';
import { newSiteKeys, verifyKey } from './keys.ts';
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
 * Throws ContentInvalidError on errors.
 */
export async function publishSite(adapter: DataAdapter, siteId: string, opts: { expectedUpdatedAt?: string } = {}): Promise<SiteRecord> {
  for (let attempt = 1; ; attempt++) {
    const site = await adapter.getSiteById(siteId);
    if (!site) throw new Error(`site ${siteId} not found`);
    if (opts.expectedUpdatedAt !== undefined && site.updatedAt !== opts.expectedUpdatedAt) {
      throw new StaleSiteError(siteId, site.updatedAt);
    }
    const result = validateContent(site.content);
    if (!result.ok) throw new ContentInvalidError(result.errors);
    try {
      return await adapter.publish(siteId, { expectedUpdatedAt: site.updatedAt });
    } catch (e) {
      if (!(e instanceof StaleSiteError) || opts.expectedUpdatedAt !== undefined || attempt >= 3) throw e;
    }
  }
}

/** Takes the site offline: public routes 404; the draft and the last published copy are kept. */
export async function unpublishSite(adapter: DataAdapter, siteId: string): Promise<SiteRecord> {
  return adapter.unpublish(siteId);
}
