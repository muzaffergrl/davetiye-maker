// The demo's map pin (G127): the live demo (/start/demo/<theme>) shows the map + directions block with a pin at the
// centre of the demo record's (real) city. Only the demo page adds it: the demo records (content.demo.json, the
// collection copies, site.js DEV_CONTENT) stay as they are, and a buyer's draft (draftFromDemo) never gets a pin it
// did not set — their map follows their own venue.

import type { ContentRecord } from '../content/types.ts';

/** theme id -> centre of its demo city (WGS 84). */
export const DEMO_CITY_PINS: Readonly<Record<string, { lat: number; lng: number }>> = {
  'art-deco-black-tie': { lat: 41.8781, lng: -87.6298 }, // Chicago
  'azulejo-mosaic': { lat: 38.8029, lng: -9.3817 }, // Sintra, Portugal
  'blush-garden-rose': { lat: 32.0809, lng: -81.0912 }, // Savannah
  'boho-pampas-terracotta': { lat: 34.1347, lng: -116.3131 }, // Joshua Tree
  'burgundy-velvet-autumn': { lat: 35.5951, lng: -82.5515 }, // Asheville
  'crimson-rose-atelier': { lat: 45.8081, lng: 9.0852 }, // Como (Lake Como)
  'celestial-observatory': { lat: 35.1983, lng: -111.6513 }, // Flagstaff, AZ (the venue is fictional)
  'cherry-blossom-spring': { lat: 38.9072, lng: -77.0369 }, // Washington, D.C.
  'coastal-seaside': { lat: 41.6821, lng: -69.9597 }, // Chatham, MA
  'dusty-blue-champagne': { lat: 32.7765, lng: -79.9311 }, // Charleston, SC
  'emerald-gold-estate': { lat: 42.5917, lng: -88.4334 }, // Lake Geneva, WI
  'enchanted-forest-storybook': { lat: 45.5152, lng: -122.6784 }, // Portland, OR
  'ivory-lace-pearls': { lat: 41.4901, lng: -71.3128 }, // Newport, RI
  'kintsugi-washi': { lat: 45.7054, lng: -121.5215 }, // Hood River, Oregon
  'lavender-provence': { lat: 43.9116, lng: 5.2003 }, // Gordes
  'maison-patisserie': { lat: 32.0809, lng: -81.0912 }, // Savannah, GA
  'mediterranean-lemon': { lat: 40.6263, lng: 14.3758 }, // Sorrento
  'midnight-garden': { lat: 29.9511, lng: -90.0715 }, // New Orleans
  'nocturne-lake-estate': { lat: 45.9857, lng: 9.2617 }, // Bellagio (Lake Como)
  'orient-express-voyage': { lat: 45.4408, lng: 12.3155 }, // Venice
  'grand-theatre-premiere': { lat: 37.5407, lng: -77.436 }, // Richmond, VA (the theatre is fictional)
  'olive-ivory': { lat: 38.2975, lng: -122.2869 }, // Napa
  'riad-lantern-nights': { lat: 31.6295, lng: -7.9811 }, // Marrakech (medina)
  'sunflower-rustic-barn': { lat: 35.9251, lng: -86.8689 }, // Franklin, TN
  'tropical-destination': { lat: 20.6873, lng: -156.4428 }, // Wailea
  'tuscan-vineyard': { lat: 43.0927, lng: 11.7808 }, // Montepulciano
  'velvet-jewel-box': { lat: 40.7128, lng: -74.006 }, // New York
  'vintage-airmail-love-letter': { lat: 42.2529, lng: -73.791 }, // Hudson, NY
  'wildflower-meadow-vellum': { lat: 40.0379, lng: -76.3055 }, // Lancaster, PA
  'winter-evergreen': { lat: 39.1911, lng: -106.8175 }, // Aspen
};

/** The demo content with its city-centre pin (a record that sets its own maps is left as it is). */
export function withDemoMap<T extends Pick<ContentRecord, 'maps'>>(themeId: string, content: T): T {
  const pin = DEMO_CITY_PINS[themeId];
  if (!pin || content.maps) return content;
  return { ...content, maps: { venue: { ...pin } } };
}
