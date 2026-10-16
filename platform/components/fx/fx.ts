// Pure helpers of the G089 effects (components/fx/), kept apart from the .tsx files so node --test can import them.

/** Words of a heading for StaggeredText: split on any run of white space, no empty words. */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * DepthTilt: rotation (degrees) for a pointer at (px, py) inside a box of size (w, h). The centre is 0; the edges reach
 * ±max. Pointer positions outside the box are clamped, so a fast flick never over-rotates.
 */
export function tiltFor(px: number, py: number, w: number, h: number, max: number): { rx: number; ry: number } {
  if (!(w > 0) || !(h > 0)) return { rx: 0, ry: 0 };
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  const nx = clamp((px / w) * 2 - 1);
  const ny = clamp((py / h) * 2 - 1);
  // The original's directions: pointer below centre tips the top away (rotateX < 0), pointer right turns it right.
  return { rx: round(-ny * max), ry: round(nx * max) };
}

const round = (v: number) => Math.round(v * 100) / 100 || 0;

/**
 * RevealOnScroll: indexes of the blocks to hide until they scroll in — only those whose top is below the first
 * screen. Blocks on screen (or above it, after a jump to an #anchor) are never hidden.
 */
export function revealTargets(tops: number[], viewportHeight: number): number[] {
  const out: number[] = [];
  tops.forEach((top, i) => {
    if (top >= viewportHeight) out.push(i);
  });
  return out;
}

/** RevealOnScroll: transition delay of the k-th block that comes into view in one batch (70 ms apart, at most 4 steps). */
export function revealDelay(k: number): number {
  return Math.min(Math.max(0, k), 4) * 70;
}
