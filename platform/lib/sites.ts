// Site operations on top of a DataAdapter: slug rules, keys, validation.
// Routes, the panel (G039), RSVP (G042) and /start (G045) call these instead of
// re-implementing the checks.

import type { ContentRecord } from './content/types.ts';
import { validateContent, type ValidationIssue } from './content/validate.ts';
import type { DataAdapter, SiteRecord } from './data/types.ts';
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
  });
  return { site, editKey: keys.editKey, previewKey: keys.previewKey };
}

export function canEdit(site: SiteRecord, editKey: unknown): boolean {
  return verifyKey(editKey, site.editKeyHash);
}

export function canPreview(site: SiteRecord, previewKey: unknown): boolean {
  return verifyKey(previewKey, site.previewKeyHash);
}

/** Validates the draft content, then publishes it. Throws ContentInvalidError on errors. */
export async function publishSite(adapter: DataAdapter, siteId: string): Promise<SiteRecord> {
  const site = await adapter.getSiteById(siteId);
  if (!site) throw new Error(`site ${siteId} not found`);
  const result = validateContent(site.content);
  if (!result.ok) throw new ContentInvalidError(result.errors);
  return adapter.publish(siteId);
}
