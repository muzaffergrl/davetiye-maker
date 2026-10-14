// Draft content checks for the panel's autosave (G039).
//
// A draft may be incomplete or invalid while the buyer types (an empty name, a half-written link,
// a deadline after the date): those are normal validation errors, shown inline, and they only
// block publishing (lib/sites.ts publishSite). What a draft may NOT be is structurally broken:
// unknown fields, wrong JSON types, missing required objects, values outside an enum, too many
// list items. The panel never produces those, so they are refused (400) and never stored.
// Fields the buyer does not edit (record_kind, event_type) always keep their stored value.

import type { ContentRecord } from '../content/types.ts';
import { schemaIssues, type ValidationIssue } from '../content/validate.ts';
import { identityOf, sameIdentity } from './rights.ts';

/** Largest accepted draft (JSON bytes). A full record is ~3 KB. */
export const MAX_DRAFT_BYTES = 64 * 1024;

/** Schema issue codes that mean "not shaped like a content record" (refused) rather than "not finished yet". */
const STRUCTURAL_CODES = new Set([
  'schema_type',
  'schema_unknown_field',
  'schema_required',
  'schema_enum',
  'schema_max_items',
  'schema_min_items',
  // G068: more design-text keys than the schema allows (content.copy)
  'schema_max_properties',
]);

/**
 * Buyer-facing list limits (G055): a draft over them is still saved (a site made before the limit, or an
 * older panel, must not get stuck on "could not be saved"); it is an error that blocks publishing only.
 */
const SOFT_LIST_LIMITS = new Set(['schedule']);

/** Paths that keep their stored value whatever the panel sends. */
const LOCKED_FIELDS = ['record_kind', 'event_type'] as const;

export class DraftShapeError extends Error {
  readonly issues: ValidationIssue[];
  constructor(issues: ValidationIssue[]) {
    super(`Draft has an unexpected shape: ${issues.map((i) => `${i.path}: ${i.message}`).join('; ')}`);
    this.name = 'DraftShapeError';
    this.issues = issues;
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * The draft to store: `incoming` with the locked fields of `stored`.
 * Throws DraftShapeError when it is not shaped like a content record.
 */
export function prepareDraft(stored: ContentRecord, incoming: unknown): ContentRecord {
  if (!isPlainObject(incoming)) {
    throw new DraftShapeError([{ level: 'error', code: 'schema_type', path: '(root)', message: 'Expected object.' }]);
  }
  const draft = structuredClone(incoming) as Record<string, unknown>;
  for (const key of LOCKED_FIELDS) draft[key] = (stored as unknown as Record<string, unknown>)[key];
  const structural = schemaIssues(draft).filter(
    (i) => STRUCTURAL_CODES.has(i.code) && !(i.code === 'schema_max_items' && SOFT_LIST_LIMITS.has(i.path)),
  );
  if (structural.length) throw new DraftShapeError(structural);
  return draft as unknown as ContentRecord;
}

/**
 * After the first publish the identity fields (names, full names, the names line, the monogram, the date;
 * docs/16 §11.4) change only through POST /api/edit/<slug>/identity. An autosave keeps their stored values
 * (and the number of names). `kept` is true when the incoming draft tried to change them.
 */
export function keepStoredIdentity(stored: ContentRecord, draft: ContentRecord): { draft: ContentRecord; kept: boolean } {
  const next = structuredClone(draft);
  next.partners = structuredClone(stored.partners);
  if (stored.name_display === undefined) delete next.name_display;
  else next.name_display = stored.name_display;
  next.initials = stored.initials;
  next.date = stored.date;
  return { draft: next, kept: !sameIdentity(identityOf(draft), identityOf(next)) };
}
