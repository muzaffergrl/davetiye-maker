// Data adapter contract. Application code talks to this interface only;
// `local` (lib/data/local) is for development/tests, `blob` (lib/data/blob, Vercel Blob, G048)
// for the first live version, `supabase` (G043) later.
// Adapters are storage only: key generation, slug rules and content validation
// happen before the adapter is called (lib/sites.ts). Adapters MUST:
//  - keep slugs unique (createSite throws SlugTakenError),
//  - store only key hashes (never a plain edit/preview key),
//  - return copies (mutating a returned record must not change stored data),
//  - run assertImageUpload() in savePhoto.

import type { ContentRecord } from '../content/types.ts';

export type SiteStatus = 'draft' | 'published';

export interface SiteRecord {
  id: string;
  slug: string;
  theme: string;
  variant: string | null;
  status: SiteStatus;
  /** Working copy edited in the panel (autosave). Shown only in preview. */
  content: ContentRecord;
  /** Snapshot taken at the last publish(); this is what visitors see. */
  publishedContent: ContentRecord | null;
  editKeyHash: string;
  previewKeyHash: string;
  orderRef: string | null;
  ownerEmail: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  /**
   * SHA-256 of the one-time token the /start form sent with its claim (G045). Lets a retry of the
   * same claim (its answer was lost on the way) get a fresh edit link instead of "order used".
   * Absent on sites made elsewhere (seed, tests) and on records written before it existed.
   */
  claimTokenHash?: string | null;
}

export interface NewSite {
  slug: string;
  theme: string;
  variant?: string | null;
  content: ContentRecord;
  editKeyHash: string;
  previewKeyHash: string;
  orderRef?: string | null;
  ownerEmail?: string | null;
  claimTokenHash?: string | null;
}

/** New key hashes for a site (edit link reissued: the old link stops working). */
export interface SiteKeyHashes {
  editKeyHash: string;
  previewKeyHash: string;
}

export interface PublishOptions {
  /**
   * Publish only if the site still has this updatedAt (the version that was validated);
   * otherwise throw StaleSiteError and change nothing.
   */
  expectedUpdatedAt?: string;
}

/**
 * A guest's answer to one of the couple's custom questions (content rsvp.questions, G051).
 * `question` is the question's text when the guest answered (the CSV still has it after the
 * couple renames or removes the question).
 */
export interface RsvpAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface RsvpInput {
  name: string;
  email?: string | null;
  attending: boolean;
  guests: number;
  message?: string | null;
  /** Answers to the custom questions (only answered ones; absent when there are none). */
  answers?: RsvpAnswer[];
  /** Stored but held back for the couple's review (unusual volume, lib/rsvp/guest.ts). */
  held?: boolean;
}

export interface RsvpRecord {
  id: string;
  siteId: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  /** Answers to custom questions (G051). Absent on replies without answers and on older replies. */
  answers?: RsvpAnswer[];
  createdAt: string;
  /** True: arrived during unusual volume; not counted, not in the CSV until the couple keeps it. */
  held?: boolean;
}

export interface PhotoInput {
  bytes: Uint8Array;
  /** Browser-reported type; informational only, the bytes decide. */
  contentType?: string | null;
  /**
   * Width of `bytes` in px, when known (re-encoded panel uploads, G055). With it the file is stored as
   * "<random>-<width>w.<ext>" next to its `variants` (lib/photo-variants.ts); without it as "<random>.<ext>".
   */
  width?: number | null;
  /** Smaller copies of the same photo: exactly variantWidths(width), same image type. Requires `width`. */
  variants?: ReadonlyArray<{ width: number; bytes: Uint8Array }>;
}

export interface SavedPhoto {
  /** URL to store in content.media.* (absolute, or root-relative for the local adapter). */
  url: string;
  /** Adapter-internal storage path, e.g. "<siteId>/<file>". */
  path: string;
  contentType: string;
  size: number;
  /** Stored variants (ascending width); empty when none were given. */
  variants: Array<{ width: number; url: string; path: string; size: number }>;
}

export interface StoredFile {
  bytes: Uint8Array;
  contentType: string;
}

export interface DataAdapter {
  readonly kind: 'local' | 'blob' | 'supabase';
  getSiteById(id: string): Promise<SiteRecord | null>;
  getSiteBySlug(slug: string): Promise<SiteRecord | null>;
  /** Sites claimed with an Etsy order reference (for the one-site-per-order rule, G045). */
  findSitesByOrderRef(orderRef: string): Promise<SiteRecord[]>;
  /**
   * Throws SlugTakenError if the slug exists. Status starts as "draft".
   * Adapters with an order index (blob) also throw OrderRefTakenError when another site already
   * has this orderRef; `local` does not check (lib/claim serialises claims per order in-process).
   */
  createSite(input: NewSite): Promise<SiteRecord>;
  /** Replaces the draft content (autosave). Does not touch publishedContent. Throws NotFoundError. */
  updateContent(id: string, content: ContentRecord): Promise<SiteRecord>;
  /**
   * publishedContent := content, status := published. Throws NotFoundError; with
   * opts.expectedUpdatedAt, throws StaleSiteError (and writes nothing) when the site changed since.
   */
  publish(id: string, opts?: PublishOptions): Promise<SiteRecord>;
  /** status := draft (public routes 404; publishedContent is kept). Throws NotFoundError. */
  unpublish(id: string): Promise<SiteRecord>;
  /** Replaces the key hashes (edit link reissued). Throws NotFoundError. */
  updateKeys(id: string, keys: SiteKeyHashes): Promise<SiteRecord>;
  /** Removes the site, its RSVPs and its photos. No-op if missing. */
  deleteSite(id: string): Promise<void>;
  /** Throws NotFoundError if the site does not exist. */
  saveRsvp(siteId: string, input: RsvpInput): Promise<RsvpRecord>;
  /** Oldest first. */
  listRsvps(siteId: string): Promise<RsvpRecord[]>;
  /** Deletes these replies of the site (unknown ids are ignored). Returns how many were deleted. */
  deleteRsvps(siteId: string, ids: readonly string[]): Promise<number>;
  /** Sets or clears `held` on these replies of the site. Returns how many changed. */
  setRsvpsHeld(siteId: string, ids: readonly string[], held: boolean): Promise<number>;
  /**
   * Validates the image and each variant (assertImageUpload, checkPhotoSet) and stores them (variants first,
   * the photo last). Throws UploadRejectedError / NotFoundError.
   */
  savePhoto(siteId: string, photo: PhotoInput): Promise<SavedPhoto>;
  /** Only adapters that serve photos through /media/... implement this (local, blob). */
  readPhoto?(path: string): Promise<StoredFile | null>;
}

/**
 * A new updatedAt that is always later than the previous one (two writes in the same millisecond
 * must still differ: publish / autosave conflict checks compare it).
 */
export function nextTimestamp(previous: string | null | undefined, now: number = Date.now()): string {
  const prev = previous ? Date.parse(previous) : NaN;
  return new Date(Number.isFinite(prev) && prev >= now ? prev + 1 : now).toISOString();
}

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`Slug "${slug}" is already taken`);
    this.name = 'SlugTakenError';
  }
}

export class OrderRefTakenError extends Error {
  constructor(orderRef: string) {
    super(`Order reference "${orderRef}" already has a site`);
    this.name = 'OrderRefTakenError';
  }
}

/** A conditional write kept losing to concurrent writers (blob: ETag mismatch on every retry). */
export class WriteConflictError extends Error {
  constructor(what: string) {
    super(`${what} was changed concurrently; please retry`);
    this.name = 'WriteConflictError';
  }
}

/** publish(…, {expectedUpdatedAt}) found a newer version of the site (it was saved in between). */
export class StaleSiteError extends Error {
  readonly updatedAt: string;
  constructor(id: string, updatedAt: string) {
    super(`site ${id} changed since it was read`);
    this.name = 'StaleSiteError';
    this.updatedAt = updatedAt;
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = 'NotFoundError';
  }
}
