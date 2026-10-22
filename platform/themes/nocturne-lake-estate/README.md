# Nocturne Lake Estate (22) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md` row 22, task G422, on the structure of the pilot G423). The
October 18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` /
`variants.css` files, blank reverse faces during the opening, names under a busy painted scene, a "Close envelope" pill)
was replaced: the theme follows the pilot-39 structure (`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own
layered GPT parts, all present (PAKET 5R W1–W19 = 22 files, PAKET 2 photos, PAKET 6R print grounds;
`collections/22_Nocturne_Lake_Estate/assets/gpt/`). **Status: `preview`** (shown as "Coming soon", not on sale, no price —
`lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`;
CSS adds only light (glints, the shimmer on the painted moon path, candle glows) and motion.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the arched villa window, story = the shuttered villa windows, venue = the terrace frame; aspects from `img/manifest.json`), 83 editable texts (`node scripts/copy-manifest.ts --theme nocturne-lake-estate`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the villa windows (windows = manifest `window_pct`, the arch through `img/mask_arch.png`), the shutters (manifest `shutters`) |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the crescent brooch) |
| `content.demo.json` | = `collections/22_Nocturne_Lake_Estate/content.demo.json` (fictional Eleanor & Luca, Villa Nocturne, Lake Como; media now empty — the demo shows the PAKET 2 photos through `public/demo/nocturne-lake-estate/`) |

Fonts (Google Fonts, never packaged): **Cinzel** (names, headings) + **Cormorant Garamond** (body, italics) + **Jost**
(small-capital labels). The names fallback faces were measured with `scripts/font-fallback.ts` against the preview server.
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On charcoal-black laid paper with sparse gold flecks (a few candle sparks glint on it): "Together with their families" and
the names, the envelope in the middle with room above it for the open flap, the date · the city and "Tap to open" below,
Skip in the corner. The envelope is a **portrait charcoal laid-paper envelope with a deep diamond flap** edged in deckled
champagne-gold foil, wrapped by a **frosted vellum belly band** engraved with a lake panorama, a **hammered gold crescent
brooch** pinned at its centre. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–600 | the crescent catches the moonlight (a CSS flare on its rim) |
| 200–1700 | it lifts off the band and floats up — smaller, turning a little — to stay in the sky above the envelope as the moon |
| 800–1600 | the vellum band slides down off the envelope and fades |
| 1500–2300 | the diamond flap opens on its top edge (3D) onto its inside: the painted night sky and mountains, which continue into the lake painted inside the envelope — one painting |
| 2000–3600 | light shimmers on the painted moon path (a brightened copy of the lining seen through moving bands) |
| 2300 | gold leaf, candle sparks and a white rose petal drift (GPT accents, `MOTION.accents.open`) |
| 2500–3250 | the ivory card rises from behind the pocket |
| 3250–3750 | it comes forward |
| 3850 | home (view transition `invite-card` → the home hero card) |

Back, shimmer, card, pocket, flap (outside + inside), band and brooch are separate layers. Reduced motion: straight to
home. Without JS: the "Open the envelope" link. Esc / Skip during the opening go straight to home; no button shows during
it. Opened state (session key `invite:opened:<slug>`): flap open, the moon in its sky, card forward, "Enter" + "Replay the
opening".

## Inner pages

- **Villa windows** (`.frame.villa`): the portrait in the arched gilded wrought-iron window with its balcony (the measured
  window as an alpha mask), the story photos in the lacquered rectangular window behind two charcoal louvred shutters,
  the venue in the wide frame over a stone balustrade (its two lanterns glow faintly). As the scene enters the frame
  settles, the shutters open outward on their outer hinges (3D) and the photo warms out of the candlelit dark.
- **home:** the painted lake at night across the top with the crescent small in its sky as the moon → the ivory card
  (arched window portrait, names, date, venue; white roses and olive at the two upper corners) → the invitation on ivory
  laid card between two gold olive dividers (a gold-leaf shimmer passes over the heading), countdown, calendar → story
  teaser (shuttered window) → the day → signature: the hurricane lantern with its flickering flame, "Open the envelope
  again".
- **story:** three moments left – right – left, each window opening its shutters as it enters the view, the caption under
  it. **details:** a strip of the painted lake, the order of the evening on ivory under the olive divider (each row
  starts with a flake of gold leaf that settles in), the terrace frame, G127 map, G138 blocks, travel, menu, registry,
  FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on an ivory card with roses at its corner; on success
  gold leaf, petals and sparks drift down and the lantern's flame grows.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, band) share one canvas; GPT drew the pocket, the flap and the band ~5 % wider
  than the back. `build_images.py` cuts each to its alpha box and lays it in the envelope box (the back's): pocket and
  flap span its width, the band (as wide as the flap) spans it plus a 1.5 % fold each side; the brooch (its own canvas)
  is scaled to 26 % of the envelope's width and pinned at the band's centre — `img/manifest.json` `stage`; `site.css` uses
  the same numbers (tests/theme-nocturne-lake-estate.test.ts compares them).
- The vellum came opaque (the prompt allowed it): its translucency is CSS opacity (.8), so the flap's point shows through.
- `flap_in` came at 1208×1302 instead of 1080×1100: cut to its alpha box, it stands as wide as the envelope at its own
  height (63.9 % of the envelope, `stage.flap_in_h`), overlapping the back's top margin by 2.1 % so the painted mountains
  sit on the painted shore.
- The window frames' windows came as a green rim round an already (nearly) transparent middle (the story frame's rim is
  thin — kit_check saw only 0.2 % green); the window = the rim with everything it encloses (PIL flood fill, no scipy),
  cleared, the green spill neutralised, and the transparent pixels' colour set to a neutral dark so no green chroma
  bleeds back in the lossy WebP (`checks.green` = none).
- The shutters share the story frame's canvas: placed in % of the cut frame (`manifest.shutters`).
- `accent_3` (the candle spark) is a faint glow (alpha mostly < 100): trimmed at alpha 3 so the whole halo is kept.
- `divider` came on a 1983×793 canvas and `window_frame` at 1113×1413: both trimmed to their alpha boxes.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times and in
  real time, the real-time opening landing on home through the view transition). Not tried on a real iPhone/Safari or
  Android Chrome.
- The catalogue card (`lib/marketing/assets.json`, `public/marketing/`) still shows the old cover and clip; it needs a new
  capture (`tools/listing_templates/capture.ts`) and `node scripts/marketing-assets.ts --designs nocturne-lake-estate`.
- The PAKET 2 sample photos show a couple in a blush garden rather than the black-tie lake terrace of the prompts; they
  are the collection's existing photos (not regenerated, docs/35 §2).
