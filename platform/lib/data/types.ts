// Data adapter contract. Application code talks to this interface only;
// `local` (lib/data/local) is for development/tests, `supabase` (G043) for production.
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
}

export interface RsvpInput {
  name: string;
  email?: string | null;
  attending: boolean;
  guests: number;
  message?: string | null;
}

export interface RsvpRecord {
  id: string;
  siteId: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  createdAt: string;
}

export interface PhotoInput {
  bytes: Uint8Array;
  /** Browser-reported type; informational only, the bytes decide. */
  contentType?: string | null;
}

export interface SavedPhoto {
  /** URL to store in content.media.* (absolute, or root-relative for the local adapter). */
  url: string;
  /** Adapter-internal storage path, e.g. "<siteId>/<file>". */
  path: string;
  contentType: string;
  size: number;
}

export interface StoredFile {
  bytes: Uint8Array;
  contentType: string;
}

export interface DataAdapter {
  readonly kind: 'local' | 'supabase';
  getSiteById(id: string): Promise<SiteRecord | null>;
  getSiteBySlug(slug: string): Promise<SiteRecord | null>;
  /** Sites claimed with an Etsy order reference (for the one-site-per-order rule, G045). */
  findSitesByOrderRef(orderRef: string): Promise<SiteRecord[]>;
  /** Throws SlugTakenError if the slug exists. Status starts as "draft". */
  createSite(input: NewSite): Promise<SiteRecord>;
  /** Replaces the draft content (autosave). Does not touch publishedContent. Throws NotFoundError. */
  updateContent(id: string, content: ContentRecord): Promise<SiteRecord>;
  /** publishedContent := content, status := published. Throws NotFoundError. */
  publish(id: string): Promise<SiteRecord>;
  /** status := draft (public routes 404; publishedContent is kept). Throws NotFoundError. */
  unpublish(id: string): Promise<SiteRecord>;
  /** Removes the site, its RSVPs and its photos. No-op if missing. */
  deleteSite(id: string): Promise<void>;
  /** Throws NotFoundError if the site does not exist. */
  saveRsvp(siteId: string, input: RsvpInput): Promise<RsvpRecord>;
  /** Oldest first. */
  listRsvps(siteId: string): Promise<RsvpRecord[]>;
  /** Validates the image (assertImageUpload) and stores it. Throws UploadRejectedError / NotFoundError. */
  savePhoto(siteId: string, photo: PhotoInput): Promise<SavedPhoto>;
  /** Only adapters that serve photos through /media/... implement this (local). */
  readPhoto?(path: string): Promise<StoredFile | null>;
}

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`Slug "${slug}" is already taken`);
    this.name = 'SlugTakenError';
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = 'NotFoundError';
  }
}
