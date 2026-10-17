# Riad Lantern Nights (27)

A night courtyard of a riad: cedar double doors in a teal tadelakt wall, saffron lantern light, brass and zellige. New design
of the 23–28 wave (docs/24, G165), built **before its GPT parts exist**. Status: **coming** (`lib/marketing/config.ts`) — sale
and price wait for the real parts and approval.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1..3` 2:3 tall windows, `venue` 16:9), 86 copy keys (`node scripts/copy-manifest.ts --theme riad-lantern-nights`) |
| `content.demo.json` | = `collections/27_Riad_Lantern_Nights/content.demo.json` (fictional Leila & Adrian, The Saffron Courtyard Riad, Marrakech, October 9, 2027; all URLs `null`; no sample photos until PAKET 2) |
| `index.html` … `rsvp.html` | doors · home · story (windows) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes, lantern flicker, light presets / thank-you mode (G075) |
| `site.js` | `MOTION` (door steps, scenes, stagger), long names, scenes, countdown (`data-target-utc` from the platform), doors, gallery viewer |
| `build_images.py` | GPT pixels → `img/` (interim cuts, placeholders, og, favicon, `manifest.json`) |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Marrakech medina),
G138 blocks (`data-blocks`, `data-travel`, `data-menu`), music + opening sounds (`lib/audio/catalog.ts`: Evening Strings;
tap 0 · whoosh 300 · slide 1900 · chime 3100 ms), calendar, thank-you mode, editable texts, languages (G144: the only new site
texts "Beyond the cedar doors" and "Open the doors again" are in the four site dictionaries). Fonts: Cinzel, Marcellus SC,
Marcellus (Google Fonts; no font files). Printable invitation (G139): `lib/print/layouts.ts` `composed` (ivory plaster + the
theme's tiles) until PAKET 6.

## Opening (docs/11 §7.4 kapi — riad doors swing IN)

Tap → the doors give a little and the lantern's glow flares (0–250 / 0–900 ms) → kicker, names and date rise away (0–450) →
the left leaf turns on its outer hinge into the courtyard (`rotateY 0 → 76deg`, 300–1200) and the right one a beat later
(`0 → -76deg`, 420–1320), darkening as they turn → lantern light pours out through the doorway and the courtyard brightens
(900–1900) → the ivory card (portrait, "Our wedding", names, date) comes out of the courtyard's depth into the light
(1900–3100) → forward over the open leaves (3100–3450) → home (3550, view transition `invite-card` onto the home card).
Leaves, courtyard, light, glow and card are separate layers. Unlike the 06/14 gatefold (doors fold flat outwards, 180°, inner
faces take over at 90°) the leaves never pass 90°: they recede into the courtyard and stay visible in perspective, so no
inner faces are needed.

**Interim pieces (K21: cut, turned, toned, placed — nothing drawn):** no GPT part of this design exists yet. `build_images.py`
cuts two leaves side by side from 10 Tuscan Vineyard's `oak_tile.png` (planks turned upright, duotone deep cedar), tones 05
Lemon Mediterranean's seamless `bg_tile.png` lime plaster three ways (saffron court, ivory card, night-teal wall) and cuts three
single tiles from the painted border of 05's `frame_portrait.png` (cobalt turned teal, white warmed to ivory). The real parts
(`doors_closed`, `doorway`, `courtyard`, `card_small`, `lantern`, `bg_page`, `bg_tile`, `tile_1..4`, `frame_arch`,
`frame_landscape`, `bougainvillea_tl/br`, `divider`, `accent_1`, `web_hero`), PAKET 2 photos and PAKET 6 print grounds are
ordered in `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md`; when they arrive `build_images.py` switches to them
(doors cut at their seam, the doorway arch as a fixed front layer, arch masks for the windows and the card).

## Motion signature (docs/24)

- **Doors:** the 3D inward swing above.
- **Lantern flicker:** `.lantern-glow` — a borderless radial light (docs/11 §5.7) with an uneven 5.2 s opacity/brightness
  flicker on index, home and RSVP; flares on the tap. Off with reduced motion.
- **Zellige row:** `.zellige[data-scene]` on home, story and details — each tile is its own `[data-step="tile"]` with preset
  `tile` (drops in turning square, a small overshoot), one every 160 ms (`MOTION.stagger`), left to right.
- **Light through the windows:** preset `light` — a window's photo waits darkened; when its scene plays a soft beam crosses it
  once (`::after`, screen blend) and the photo stays lit; while scrolling, a scroll-driven light shaft (`animation-timeline:
  view()`, where supported) keeps moving over the windows. Also on the venue photo.

## Pages

- **Home:** the ivory card in the lantern light (portrait, "Our wedding", names in Cinzel, weekday + date, venue · city) =
  the view-transition target; zellige row; the invitation in ivory and brass on the teal wall (host line, full names with
  display-name fallback, "request the pleasure of your company…", date block, venue, ceremony time, RSVP, deadline),
  countdown (plain numerals), calendar; three tall windows (the gallery teaser, lit in turn); the courtyard band with the
  first four programme rows; signature + "Open the doors again".
- **Story:** three tall 2:3 windows — on a phone the first wide and alone (≤ 340 px), the next two side by side (each ≥ 41vw at
  360 px); on wide screens an arcade of three, the middle one raised. Captions, native `<dialog>` viewer (arrows, Escape).
- **Details:** date heading, zellige row, programme in brass times (no rule or dots), ceremony sentence, calendar, venue photo
  (light preset), map, dress code, G138 blocks, travel, menu, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** lantern glow, the reply panel (translucent, no frame), shared form; "Replay the opening".

## Deviations / limits

- No W1 comps (designed in code from docs/24, not from PAKET 5) → no comp map; `theme-check --compare none`.
- Photo windows are rectangles until `frame_arch.png` arrives (an arch shape from CSS would be a drawn shape, docs/11 §5.6).
- The doorway arch and the carving are missing until `doors_closed` / `doorway` arrive; the interim leaves are plain cedar.
- Tiles are only 76 px (the source border's own size; nothing is upscaled) — shown at 34–50 px.
- `DEV_CONTENT` / `devRender` are not in `site.js` (as in 21 and 22): the theme is previewed through the platform demo route.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network.
