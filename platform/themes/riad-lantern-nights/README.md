# Riad Lantern Nights (27) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, task G427, on the pilot G423 structure). The October
Codex build (cedar double doors cut from one imagegen cover object, `envelope-v3` / `opening*` / `interior*` files, blank
reverse faces, names over busy florals) was replaced: the theme now follows the pilot-39 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W20 = 22
files, PAKET 2 photos, PAKET 6R print grounds; `collections/27_Riad_Lantern_Nights/assets/gpt/`). **Status: `preview`**
(shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a
GPT part cut, keyed or scaled by `build_images.py`. No religious symbols or calligraphy anywhere.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the stucco horseshoe arch, story = the tall cedar horseshoe arches, venue = the wide cedar frame; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme riad-lantern-nights`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the arches (slots = manifest `slot_pct`, masks), scenes |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents and motes of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, the two arch masks, og image, favicon = the lit lantern charm) |
| `content.demo.json` | = `collections/27_Riad_Lantern_Nights/content.demo.json` (fictional Leila & Adrian, The Saffron Courtyard Riad, Marrakech) |

Fonts (Google Fonts, never packaged): **Cinzel** (names, headings) + **Marcellus SC** (kickers, labels) + **Marcellus**
(body). Palette: night teal `#0F2F31`, saffron `#E3A54A`, brass `#C9A35B`, cedar `#3A2114`, ivory `#F6EAD2`, tadelakt
`#EFE3CC`. The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On warm ivory tadelakt plaster: "Together with their families" and the names, the envelope in the middle with room
above it for the flap, the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **portrait
deep-teal cotton-paper envelope** with an **upside-down horseshoe-arch flap** edged in gold zellige foil, closed by a
**saffron silk cord** looped once round a **domed brass stud**, a saffron tassel on one end and a small **pierced brass
lantern charm** on the other. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–500 | the lantern lights up: the unlit and the lit GPT lantern (one canvas, one shared box) crossfade in place |
| 0–1500 | its warm light: a halo on the envelope (screen) and a pool of light on the plaster (CSS light) |
| 600–1600 | the cord's loop lifts off the stud; cord, tassel and lantern swing round it (the lantern on its own ring too) and fall away |
| 1250–1600 | the lantern goes out as it falls |
| 1450–2350 | the arch flap swings up on its top edge (3D) onto its zellige inside and stands above the envelope like an arched door; the stud rides on it |
| 2250–3150 | the arch-topped ivory card rises from behind the pocket; light sweeps over it (2350–3450) |
| 2600 | bougainvillea bracts, orange blossoms, brass stars (GPT accents) and motes of light (CSS) drift (`MOTION.accents.open`) |
| 3150–3650 | the card comes forward over the pocket |
| 3800 | home (view transition `invite-card` → the home card, the same GPT card) |

Back, card, pocket, flap (outside + inside), stud, cord and the two lanterns are separate layers. Reduced motion:
straight to home. Without JS: the "Open the invitation" link. Opened state (session key `invite:opened:<slug>`): flap
open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Photo windows.** The portrait sits in the carved stucco horseshoe arch, the story photos in the tall carved cedar
  horseshoe arches, the venue in the wide cedar frame. The photo slot is the window the build measured (± 0.5 %); the two
  arch windows are horseshoe shapes, so the slot is masked with `mask-image` by a technical alpha mask the build derives
  from the measured window (`img/arch-mask.png`, `img/storyarch-mask.png`) — a rectangle would show photo corners, a radius
  would erase stucco/cedar. Each photo waits in the dark and comes out under a sweep of warm lantern light, top to bottom.
- **home:** the card from the envelope (portrait arch under its zellige star, names, date, venue; bougainvillea sprays at
  the two upper corners) → a band of six zellige tiles set one by one → the invitation on cotton paper between two brass
  zellige dividers (the heading gets one pass of lantern light), countdown, calendar → story teaser (cedar arch) → the day
  under the large lit lantern, swaying, its glow on the plaster → signature: the lantern charm lights up, names,
  "Open it again".
- **story:** three tall cedar arches, left – right – left, captions beside them. **details:** the order of the day on
  cotton paper, each row opening with a brass star that turns in; the venue frame; G127 map; G138 blocks, travel, menu,
  registry, FAQ. **rsvp:** the lantern charm (unlit) over the title; the G042 form (G051 questions, G069 guest names) on a
  cotton-paper card; on success the charm lights up and bracts, blossoms and stars drift down; a zellige strip closes.

## Build notes (GPT defects absorbed)

- The envelope layers (back, pocket, flap, stud, cord) share one canvas; GPT drew the envelope at y 8.8–91.2 % instead of
  6–94 % and the flap's fold ~1 % under the back's top edge. `build_images.py` cuts each to its alpha box and lays it in
  the envelope box (the back's) at its measured place — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-riad-lantern-nights.test.ts compares them). The stud is 14 % of the canvas wide (prompt 7 %): kept as
  drawn (it sits inside the cord's loop, which GPT drew to match).
- The lanterns have their own canvas: both cut to one shared box, scaled to 23 % of the envelope's height, the lantern's
  hanging ring (measured: top blob down to its neck) hooked into the cord's jump ring (measured: the cord's right end).
- The frames' windows came as a green rim round an already transparent, soft-edged middle, and the rim is not closed
  everywhere (the soft middle touches the inner moulding): the window = the region reachable from the middle through
  green or transparent pixels, bounded by the opaque frame, plus the half-opaque wisps it encloses (PIL flood fill, no
  scipy); cleared, the green spill neutralised (`checks.green` = none in the keyed frames; the spray's natural leaf green
  is out of scope).
- `tadelakt_ground` / `cotton_paper` showed a faint tone step at the tile edges: the build blends the half-rolled texture
  in towards the edges (pixels re-used). The zellige tile does not repeat seamlessly (its edges differ): each tile is
  shown as its own glazed square with a grout gap, never as a continuous field.
- `divider.png` came on a 1983×793 canvas (prompt 1600×200): cut to its alpha box.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times). Not
  tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces (`fb1`/`fb2`) carry estimated numbers for Cinzel; `scripts/font-fallback.ts` was not run (it
  needs a production build).
- The catalogue card (`lib/marketing/assets.json`) still shows the old cover/clip; a new capture needs a production build.
