// The 20 designs' platform themes (tools/katalog.py tema_slug → collection folder). Shared tests that check every
// design theme (G068 copy, G069/G084 party row, G075 thank-you) read builtDesignThemes(), so a new theme is covered as
// soon as its folder exists — no hand-kept lists to extend for each G4NN (G087, integrator note of G408).
import { existsSync } from 'node:fs';
import path from 'node:path';
import { PLATFORM_ROOT, REPO_ROOT } from './helpers.ts';

export const DESIGN_COLLECTIONS: Readonly<Record<string, { dir: string; tag: string }>> = {
  'olive-ivory': { dir: '01_Olive_Ivory', tag: '01' },
  'dusty-blue-champagne': { dir: '02_Dusty_Blue', tag: '02' },
  'blush-garden-rose': { dir: '03_Blush_Garden_Rose', tag: '03' },
  'vintage-airmail-love-letter': { dir: '04_Vintage_Airmail', tag: '04' },
  'mediterranean-lemon': { dir: '05_Lemon_Mediterranean', tag: '05' },
  'art-deco-black-tie': { dir: '06_Art_Deco_Noir', tag: '06' },
  'burgundy-velvet-autumn': { dir: '07_Burgundy_Velvet', tag: '07' },
  'winter-evergreen': { dir: '08_Winter_Evergreen', tag: '08' },
  'lavender-provence': { dir: '09_Lavender_Provence', tag: '09' },
  'tuscan-vineyard': { dir: '10_Tuscan_Vineyard', tag: '10' },
  'boho-pampas-terracotta': { dir: '11_Boho_Pampas', tag: '11' },
  'tropical-destination': { dir: '12_Tropical_Destination', tag: '12' },
  'enchanted-forest-storybook': { dir: '13_Enchanted_Forest', tag: '13' },
  'ivory-lace-pearls': { dir: '14_Ivory_Lace_Pearl', tag: '14' },
  'cherry-blossom-spring': { dir: '15_Cherry_Blossom', tag: '15' },
  'sunflower-rustic-barn': { dir: '16_Sunflower_Rustic', tag: '16' },
  'emerald-gold-estate': { dir: '17_Emerald_Gold_Estate', tag: '17' },
  'wildflower-meadow-vellum': { dir: '18_Wildflower_Vellum', tag: '18' },
  'midnight-garden': { dir: '19_Midnight_Garden', tag: '19' },
  'coastal-seaside': { dir: '20_Coastal_Seaside', tag: '20' },
};

/** Design themes that exist in platform/themes, in design order. */
export function builtDesignThemes(): string[] {
  return Object.keys(DESIGN_COLLECTIONS).filter((id) => existsSync(path.join(PLATFORM_ROOT, 'themes', id, 'theme.json')));
}

/** The design's collection folder (absolute). */
export function collectionDir(theme: string): string {
  const c = DESIGN_COLLECTIONS[theme];
  if (!c) throw new Error(`unknown design theme ${theme}`);
  return path.join(REPO_ROOT, 'collections', c.dir);
}
