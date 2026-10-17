// The designs /start offers in its list (no theme, unknown theme, design in review): claimable themes
// (lib/claim/themes.ts: exists, not internal, valid demo) that this server lets a buyer start (lib/themes/approval.ts —
// in production only the approved ones). Server only (reads the theme folders).
// G151: private themes (a custom design for one buyer) are never offered; the buyer's own one opens with its order number.
import { claimableThemes } from '../claim/themes.ts';
import type { ThemeManifest } from '../theme/theme.ts';
import { themeOpenForClaims, type ApprovalEnv } from './approval.ts';

export async function offeredThemes(env?: ApprovalEnv): Promise<Array<{ id: string; name: string }>> {
  return (await claimableThemes()).filter((t) => themeOpenForClaims(t.id, { env })).map((t) => ({ id: t.id, name: t.name }));
}

/**
 * May a website be started from this claimable theme on this server? A private theme is never on the sales site (so
 * never "approved"): reaching it through claimableTheme() already proved the order number or the admin, so it is open.
 */
export function themeStartable(theme: { id: string; manifest: Pick<ThemeManifest, 'private'> }, env?: ApprovalEnv): boolean {
  return theme.manifest.private !== undefined || themeOpenForClaims(theme.id, { env });
}
