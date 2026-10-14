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
  /**
   * Edit rights (G060, docs/16 §11): the moment of the FIRST successful publish. Written once by
   * lib/sites.ts publishSite and never cleared (unpublish / publish again keep it). Absent on records
   * from before G060 (lib/panel/rights.ts effectiveRights derives it from publishedAt).
   */
  firstPublishedAt?: string | null;
  /** Name and date change bookkeeping after the first publish (G060). Absent before the first publish. */
  identity?: IdentityRights | null;
  /** Support extension of the archive date (YYYY-MM-DD: the site is archived from 00:00 of that day, site time zone). */
  archiveOverrideAt?: string | null;
  /**
   * Order check of a site claimed on /start (G060-fix, lib/claim/verify.ts). Absent or null: no check is required
   * (verification off; sites made elsewhere). "pending": claimed while CLAIM_ORDER_VERIFICATION=manual — the site
   * cannot be published until the shop confirms the Etsy order (scripts/verify-order.ts). "verified": confirmed.
   */
  orderCheck?: OrderCheckRecord | null;
  /**
   * Optional guest password (G076, K28; lib/site/access.ts). Absent or null: the website is open to anyone with the link
   * (the default). Private: never rendered into a page, never sent to guests; the couple sees it in the panel (Share).
   */
  guestAccess?: GuestAccessRecord | null;
}

/** The website's guest password (G076). Kept with the site, deleted with it. */
export interface GuestAccessRecord {
  /** Guests must enter the password before any page, photo, calendar file or RSVP answer is served. */
  enabled: boolean;
  /** As the couple typed it (trimmed). Shown to them in the panel: it is meant to be shared with guests. */
  password: string;
  /** +1 whenever the password changes: a guest cookie signed for an older version stops working (guests are asked again). */
  version: number;
  /** Per-site HMAC key of the guest cookies (32 random bytes, base64url). Never leaves the server. */
  secret: string;
  updatedAt: string;
}

export interface OrderCheckRecord {
  status: 'pending' | 'verified';
  /** When the status was set. */
  at: string;
  by: 'claim' | 'etsy' | 'support';
  note?: string;
}

/** One name of the couple as the edit-rights rule sees it (docs/16 §11.2). */
export interface IdentityName {
  /** partners[i].display_name */
  display: string;
  /** partners[i].full_name ("" when empty) */
  full: string;
}

/** The identity fields of a site: names, the names line, the monogram and the wedding date (docs/16 §11.2). */
export interface Identity {
  names: IdentityName[];
  /** name_display ("" when empty) */
  shown: string;
  initials: string;
  /** ISO YYYY-MM-DD */
  date: string;
}

export type IdentityLogKind = 'first_publish' | 'typo' | 'change' | 'undo' | 'sample_date' | 'grant' | 'archive_override';

export interface IdentityLogEntry {
  at: string;
  kind: IdentityLogKind;
  /** The identity written (typo / change). */
  to?: Identity;
  by: 'buyer' | 'support';
  note?: string;
}

/** Stored with the site after its first publish (G060). Kept with the site and deleted with it. */
export interface IdentityRights {
  /** The last COUNTED identity (first publish, or the last change that used a right). Typo fixes do not move it. */
  anchor: Identity;
  /** Changes included with the purchase (IDENTITY_CHANGE_LIMIT, 3). */
  limit: number;
  /** Extra changes added by support (scripts/grant-identity-change.ts). */
  granted: number;
  used: number;
  /** Newest last; at most the last 50 entries. */
  log: IdentityLogEntry[];
  /**
   * The last counted change, while it can still be taken back for free (lib/panel/rights.ts undoState): `from` is the
   * anchor before it. Cleared by an undo; replaced by the next counted change. Absent on older records.
   */
  undo?: { at: string; from: Identity } | null;
}

/** Fields of a site record that patchSite() can set in one conditional write. Keys left out are not touched. */
export interface SitePatch {
  content?: ContentRecord;
  firstPublishedAt?: string | null;
  identity?: IdentityRights | null;
  archiveOverrideAt?: string | null;
  orderCheck?: OrderCheckRecord | null;
  guestAccess?: GuestAccessRecord | null;
}

export const SITE_PATCH_KEYS = ['content', 'firstPublishedAt', 'identity', 'archiveOverrideAt', 'orderCheck', 'guestAccess'] as const satisfies ReadonlyArray<keyof SitePatch>;

/** Copies the given patch fields onto a (freshly read) stored record. Shared by the adapters. */
export function applySitePatch(site: SiteRecord, patch: SitePatch): void {
  for (const key of SITE_PATCH_KEYS) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) {
      (site as unknown as Record<string, unknown>)[key] = structuredClone(patch[key]) ?? null;
    }
  }
}

export interface WriteOptions {
  /** Write only if the site still has this updatedAt; otherwise throw StaleSiteError and write nothing. */
  expectedUpdatedAt?: string;
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
  /** Written with the site (G060-fix): a manual order check starts as "pending" in the same write. */
  orderCheck?: OrderCheckRecord | null;
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
  /** Extra fields written in the SAME write (G060: firstPublishedAt + identity on the first publish). */
  set?: Omit<SitePatch, 'content'>;
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
   * Sets the patch's fields (draft content and/or edit-rights bookkeeping, G060) in ONE write.
   * With opts.expectedUpdatedAt the write is conditional: StaleSiteError (nothing written) when the
   * site changed since the caller read it — this is what keeps a rights counter and the content in step
   * when two tabs send at once. Throws NotFoundError.
   */
  patchSite(id: string, patch: SitePatch, opts?: WriteOptions): Promise<SiteRecord>;
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
  /** Number of photo files stored for the site (photos and their size variants), for the per-site cap (G060-fix). */
  countPhotos?(siteId: string): Promise<number>;
  /**
   * A fixed-window counter shared by every server instance (G060-fix: /start and upload limits must not reset
   * with each Vercel function instance). Adds one hit to `key`'s current window (a new window starts when the last
   * one has ended) and returns the count in it. Adapters without shared storage (local: one process) leave it out
   * and the callers use in-process memory.
   */
  hitCounter?(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
  /** The live window of a hitCounter key without adding a hit (null: no live window). G076. */
  readCounter?(key: string): Promise<{ count: number; resetAt: number } | null>;
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
