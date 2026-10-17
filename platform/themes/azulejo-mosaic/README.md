# Azulejo Mosaic (30)

A wall of blue-and-white painted azulejo tiles on a cobalt wall; whitewash and terracotta. Design 30 of the second
wave (`docs/24_YENI_TASARIMLAR.md` "2. dalga", task G169). Status: **coming** (`lib/marketing/config.ts`) — the
design's own GPT parts do not exist yet; sale, price and approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1` 4:5, `story_2` 5:4, `story_3` 4:5, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme azulejo-mosaic`) |
| `content.demo.json` | = `collections/30_Azulejo_Mosaic/content.demo.json` (fictional Inês & Mateo, Quinta da Andorinha Azul, Sintra, Portugal, June 5, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | tile wall · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the tile faces and the 3D turn, the opening keyframes / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, photo mosaics, scenes), long names, card fit, the wave from the tap, the photo mosaics, countdown, opening |
| `build_images.py` | GPT parts → `img/` part by part (interim stand-ins for the missing ones), placeholders, og, favicon, `manifest.json`, `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules of the optional GPT parts present (the terracotta pots); a comment only while none exists. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Sintra),
music + opening sounds (`lib/audio/catalog.ts`: Garden Waltz; tap 0 · whoosh 420 · slide 2350 · chime 2950 ms),
calendar, thank-you mode, editable texts, languages (G144; one new string "Laid tile by tile, sent with love",
translated in `lib/i18n/dict/site/*`). Fonts: Arizonia + Cormorant Upright (Google Fonts; no font files).

## Opening — the tiles turn over one by one

The closed object is a panel of 4 × 6 tiles (2:3, `manifest stage.wall`) laid as a tiler lays them: the corner tile
(`tile_3`) in the four corners, the border tile (`tile_2`) round the edge turned to face outwards, the two field tiles
(`tile_1`, `tile_4`) alternating inside, each turned a quarter in a 2 × 2 (`build_images.tile_kind` = the classes
`k1–k4 q0–q3` of `index.html`). Each tile is a separate layer with its painted front and its terracotta back
(`backface-visibility`). Behind the tiles, in the same box, the card (portrait, "Our wedding", names, date).

Tap → the panel gives a little (press, 0–380 ms) while a soft glaze light runs over the tiles (80–780) → the **wave**:
each tile lifts off the wall, turns over in 3D (away from the tap — tiles left of it turn left), shows its terracotta
back and lifts away fading (760 ms each). The wave starts at the tile under the guest's finger (the centre for Enter /
Space): `site.js waveFrom()` gives every tile its start = 420 ms + 1300 ms × its distance from the tap / the farthest
distance, so the turn spreads out like a ripple → the card lifts (2350–2950) → comes forward (2950–3300) → home at
3400 ms (view transition `invite-card` onto the home card). The heading rises away at the tap; "Tap to open" fades.

Reduced motion: no opening (tap → home), no sheen, no tile wave on the photos (`.tiles` never built), text appears at
once.

## Photos — a mosaic of tiles

Every photo slot with `.mosaic` (home card portrait, story teaser, three story photos, venue) gets a grid of field tiles
from `site.js mosaic()` (one tile per ~56 px of width, 4–8 columns; square tiles, the last row cut by the frame). When
the slot's scene step comes in (`.in`), the tiles turn over in a diagonal wave from the top-left (70 ms per diagonal
step, 680 ms each) and lift away; then the tiles are removed. Not built: without JS, with reduced motion, and on the
home card after the opening (the card flew in with its photo). The RSVP thank-you panel is revealed the same way
(smaller tiles) when a reply is sent.

## Pages

- **Home:** on the cobalt wall the card (portrait under its mosaic, "Our wedding", names in Arizonia, weekday + date,
  venue, city) with the terracotta pots at its feet (when GPT's exist); a tile frieze; the invitation on whitewash
  (heading, host line, full names with display-name fallback, request, date in three lines, venue, ceremony time, RSVP
  + deadline, countdown in plain numerals, calendar); the story teaser; a tile frieze; the day on the cobalt wall (first
  four programme rows); signature + "Open the invitation again".
- **Story:** three moments down the whitewashed page, centred (4:5, 5:4, 4:5), each under its tile mosaic, then its
  number and caption (Arizonia). Story intro + date as one sentence.
- **Details:** date heading, the programme on a white card (terracotta hours, 1 px rules between rows), ceremony
  sentence, calendar; a tile frieze; the venue under its mosaic, map; dress code, good to know (G138), travel & stay,
  menu, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** a tile frieze, the shared form on a white card; "(optional)" outside the question label; the thank-you
  revealed by tiles; "Open the invitation again".
- **Scene step:** text tips in from its top edge and settles flat, like a tile laid on the wall (`rotateX`), instead of
  the shared rise.

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print grounds). Until they exist the build cuts, tones and scales GPT pixels that
already exist; nothing is drawn (K21):

- tiles = single tiles cut from 05's painted tile border (`collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png`),
  their yellow centres and gold grout turned terracotta (hue only), scaled up from ~70 px (soft until W2.1–W2.4);
- terracotta back, cobalt wall and whitewash = 05's seamless lime plaster (`bg_tile.png`) toned with its own grain;
  card paper = 18's plain cotton paper toned glaze white;
- frieze = the four tiles side by side; og = the closed wall montage on the cobalt wall; favicon = one field tile.

Every part drops in by its file (G167): `python3 build_images.py` takes each part that exists in
`collections/30_Azulejo_Mosaic/assets/gpt/parts/` and writes the same file names (fixed sizes), so the pages need no
change; `img/manifest.json` lists `sources`, `parts.used` and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py
--tema azulejo-mosaic --sekil collections/30_Azulejo_Mosaic/assets/gpt/kuru_sekil.json [--theme-check --stress]`
rehearses the drop-in with neutral test images (repo untouched).

| Part | Then (automatic) |
|---|---|
| W2.1–W2.4 `azulejo_1..4` | centre square → `tile_1..4-128/256` (wall, mosaics, frieze stand-in, print rows) |
| W2.5 `tile_back` | → `tile_back-256` (the back of every tile) |
| W2.6 `cobalt_wall`, W2.7 `lime_wash`, W2.8 `card_paper` | → `wall-640`, `lime-640`, `card-640` (same roles) |
| W2.9 `frieze` | scaled to 192 px high, first 768 px → `frieze-768` (`.frieze`, repeat-x) |
| W2.10 `pot_left`, `pot_right` | alpha-trimmed → `pot_l/pot_r-480` + `parts.css` (`.pot-l/.pot-r` shown at the foot of the opening wall and of the home card). Without them: no pot (no stand-in) |
| W2.11 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`, bottom-aligned) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print/invitation_front.png`, `invitation_back.png` | **by hand** (one block; boxes are measured on the art, G149): `lib/print/layouts.ts` → those grounds, `node scripts/build-print-assets.ts --theme azulejo-mosaic` — steps in GPT_PROMPTS.md PAKET 6 |

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi): the theme is rendered by the platform only.
- The card behind the tiles is card paper set by CSS (no GPT card part with a window).
- The photo mosaics' tiles are built by `site.js` (decorative, `aria-hidden`); the opening wall's 24 tiles are in the
  HTML so the closed wall shows before the script runs.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).

## Not tried

Real iPhone / Android, Safari / Firefox, Vercel deployment, real buyer photos, slow network, the GPT parts themselves.
