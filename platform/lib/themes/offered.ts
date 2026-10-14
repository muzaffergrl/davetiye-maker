// The designs /start offers in its list (no theme, unknown theme, design in review): claimable themes
// (lib/claim/themes.ts: exists, not internal, valid demo) that this server lets a buyer start (lib/themes/approval.ts —
// in production only the approved ones). Server only (reads the theme folders).
import { claimableThemes } from '../claim/themes.ts';
import { themeOpenForClaims, type ApprovalEnv } from './approval.ts';

export async function offeredThemes(env?: ApprovalEnv): Promise<Array<{ id: string; name: string }>> {
  return (await claimableThemes()).filter((t) => themeOpenForClaims(t.id, { env }));
}
