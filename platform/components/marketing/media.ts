// Typed access to the generated asset manifest (lib/marketing/assets.json, scripts/marketing-assets.ts).
import assets from '../../lib/marketing/assets.json' with { type: 'json' };
import type { PanelKey, ScreenKey } from '../../lib/marketing/designs.ts';

export interface ScreenFile {
  width: number;
  height: number;
  files: Record<string, string>;
}
export interface OpeningVideo {
  file: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  bytes: number;
}

type Manifest = {
  designs: Record<string, { screens: Record<string, ScreenFile>; opening: OpeningVideo | null }>;
  panel: Record<string, ScreenFile>;
};
const M = assets as unknown as Manifest;

export function designScreen(id: string, key: ScreenKey): ScreenFile | null {
  return M.designs[id]?.screens[key] ?? null;
}

export function panelScreen(key: PanelKey): ScreenFile {
  const s = M.panel[key];
  if (!s) throw new Error(`no panel screen ${key} in assets.json`);
  return s;
}

export function openingVideo(id: string): OpeningVideo | null {
  return M.designs[id]?.opening ?? null;
}

/** srcset "a-320.webp 320w, a-640.webp 640w" */
export function srcSet(s: ScreenFile): string {
  return Object.entries(s.files)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([w, f]) => `${f} ${w}w`)
    .join(', ');
}

export function largest(s: ScreenFile): string {
  const widths = Object.keys(s.files).map(Number).sort((a, b) => b - a);
  return s.files[String(widths[0])];
}
