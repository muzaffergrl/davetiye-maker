// Bundled demo content for themes that do not ship their own content.demo.json yet (G045).
//
// A theme's demo content is what a new buyer's draft starts from (/start) and what the demo
// preview shows. Preferred source: platform/themes/<id>/content.demo.json (the theme carries it).
// Until a theme does, its collection's demo record is copied here and imported statically, so it
// is bundled into the server functions (the collections/ folder is outside platform/ and is not
// deployed). tests/claim.test.ts fails when a copy drifts from its collection file.
//
// Adding a theme: copy collections/<NN_Name>/content.demo.json to demo/<theme-id>.json, import it
// below and add the collection path to DEMO_SOURCES (for the drift test).

import blushGardenRose from './blush-garden-rose.json' with { type: 'json' };

/** theme id -> demo content record (record_kind "demo"; fictional data only). */
export const BUNDLED_DEMO_CONTENT: Readonly<Record<string, unknown>> = {
  'blush-garden-rose': blushGardenRose,
};

/** theme id -> repo path of the collection record the copy was taken from. */
export const DEMO_SOURCES: Readonly<Record<string, string>> = {
  'blush-garden-rose': 'collections/03_Blush_Garden_Rose/content.demo.json',
};
