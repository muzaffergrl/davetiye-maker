# Azulejo Mosaic (30) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md` row 30, task G430, on the structure of the pilot G423). The
October 18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, three
folding panels, blank reverse faces during the opening) was replaced: the theme follows the pilot-39 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W19 = 22
files, PAKET 2 photos, PAKET 6R print grounds; `collections/30_Azulejo_Mosaic/assets/gpt/`). **Status: `preview`**
(shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a
GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the limestone tile niche, story = the azulejo-bordered frame, venue = the wide tile panel; aspects from `img/manifest.json`), 83 editable texts (`node scripts/copy-manifest.ts --theme azulejo-mosaic`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the frames (windows = manifest `window_pct`), the photo mosaic, the turning tiles |
| `site.js` | `MOTION` (opening, scenes, mosaic grids, accents), countdown, the photo mosaic (`initMosaic`), the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the swallow tile) |
| `content.demo.json` | = `collections/30_Azulejo_Mosaic/content.demo.json` (fictional Inês & Mateo, Quinta da Andorinha Azul, Sintra) |

Fonts (Google Fonts, never packaged): **Arizonia** (names, headings) + **Cormorant Upright** (body, small capitals lines);
the names fallback faces were measured for Arizonia with `scripts/font-fallback.ts` against the light preview server.
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On sunlit lime-whitewash: an olive-and-jasmine spray in the top-left corner, "Together with their families" and the
names, the envelope in the middle (room above it for the open flap), the date · the city and "Tap to open" below, Skip in
the corner, a four-tile panel (one medallion) in each lower corner. The envelope is a **portrait glaze-white envelope
whose stepped flap is a grid of hand-painted cobalt azulejo tiles**, tied in a cross with **natural jute twine** and closed
by **one loose swallow tile** at the flap's lowest step. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes
in `site.css`):

| ms | step |
|---|---|
| 0–420 | the knot loosens (a tug on the strand round the knot) |
| 380–1000 | the vertical strand slides down, the two arms slip off to the sides |
| 900–1900 | the swallow tile lifts, turns over on its vertical axis onto its terracotta bisque back and drops away |
| 1750–2500 | the stepped flap swings up on its top edge (3D) onto its real terracotta-and-cobalt lining |
| 2050–3500 | the corner tiles turn over one after another (terracotta backs mid-turn) |
| 2250 | olive leaves and jasmine drift down (GPT accents, `MOTION.accents.open`) |
| 2400–3100 | the glaze-white card rises from behind the pocket; a sheen of morning light crosses it (2500–3500) |
| 3150–3600 | it comes forward |
| 3700 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), the tile (front + back on one box; the turn on `.tile-spin`, the drop and
fade on `.tile`, so the 3D back face is never flattened), the three pieces of the twine and the eight corner tiles are
separate layers. Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key
`invite:opened:<slug>`): flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **The photo mosaic** (`.frame.mosaic`, `initMosaic`): over every framed photo a grid of painted tiles (GPT tile_a,
  mirrored into round medallions; 4 × 5 on the niche and the story frames, 9 × 4 on the venue panel). The back of each tile
  carries the photo's own piece (a copy of the same picture cut by its cell), so as the scene enters the tiles turn over in
  a diagonal wave and the photo turns into place; then the grid fades out and the plain photo stays. It moves the photo,
  it draws nothing. Not with reduced motion, not on the home card arriving from the envelope.
- **home:** the swallow tile settles over the glaze-white card (the portrait in the limestone arch niche with painted
  tiles, names, date, venue; olive-and-jasmine sprays at the two upper corners) → the invitation on a glaze-white band
  edged above and below with the pocket's border tiles (cut out and repeated), a frieze under the heading, countdown,
  calendar → story teaser (azulejo-bordered frame) → the day under a frieze → signature: the terracotta pot with ivy and
  jasmine, the names, "Open the envelope again".
- **story:** three moments left – right – left in azulejo-bordered frames, each uncovered by the mosaic as it scrolls in,
  the caption written in Arizonia beside its number. **details:** the order of the day on a glaze-white card under a
  frieze, each row opening with a small tile that turns into place; the venue in the wide tile-panel frame (mosaic); G127
  map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a
  glaze-white card; on success a row of five tiles turns over above the thank-you and leaves, jasmine and a tile chip
  drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, twine, tile front/back) share one canvas and GPT kept them in place, except
  that the flap is ~8 % wider than the back (x 4–96 % against 7.7–92.5 %) and the pocket ~2 % wider. The flap's square
  tiles and round medallions keep their proportions: the envelope box = the flap's width × the back's height
  (0.8927 : 1), back and pocket are laid across that width (plain paper and a small rosette print absorb the stretch),
  twine and tile keep their canvas places — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-azulejo-mosaic.test.ts compares them).
- The loose tile came ~43 % larger than the prompt's box (x 36–64 % of the canvas, not 41–59 %); used as GPT placed it
  (a third on the lowest step, two thirds on the pocket), front and back cut to their common box.
- The twine is cut at its knot into three layers: the arms are the wide rows left and right of the knot; the strand keeps
  the knot and the two loose ends (they hang lower). The strand turns round the measured knot (`stage.knot`).
- `flap_in` (1.217 : 1) is stretched into the flap's box (1.351 : 1, ~10 % vertically); its steps mirror the flap's
  within ~2 %.
- Windows: the story and venue frames came with a transparent window and no green at all (kit_check reports "no window"),
  the niche with a green rim; the window = the hole the frame encloses (PIL flood fill, no scipy), cleared, the green
  spill neutralised. All three are rectangles (no mask). The venue window is very wide (2.25 : 1, not 16 : 9).
- The terracotta pot's ivy had 3–8 leaf-edge pixels as saturated as the key green; only those are pulled to the ivy's
  own muted green so `checks.green` stays empty.
- `mosaic_tile_b` is slightly off-square (1040 × 991); it is used only where a small stretch does not show (schedule row
  markers, every second tile of the reply row).

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times and in
  real time, with the light preview server `scripts/theme-preview.ts`). Not tried on a real iPhone/Safari or Android Chrome.
- The catalogue cover / clip (`lib/marketing/assets.json`) still show the old build until they are captured again.
