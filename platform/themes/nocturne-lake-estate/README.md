# Nocturne Lake Estate (22) — platform theme

**v2 of 2026-10-24**, rebuilt after its GPT design board (`collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/design-board.png`,
PAKET 8 "The moon is missing") from the PAKET 8 parts only (`assets/gpt/parts/`, see `parts/TESLIM.txt`). Method K60:
GPT draws the board and the parts; Claude cuts, aligns, scales and lights them (`build_images.py`) and builds the pages —
nothing is drawn (K21: no SVG, no data images, every `url()` a theme image). **Status: `preview`** (shown as "Coming
soon", not on sale, no price — `lib/marketing/config.ts`) until the design is approved.

Lake Como on a black-tie night: black cotton paper with hand-gilded champagne edges, fine gold foil, a gold moiré lining,
real gold leaf, moonlit limestone and night water. The signature: the moon is missing from the sky until the guest opens
the envelope — the champagne-gold seal in the valley of the envelope's mountain-cut flap rises to become the moon.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (aspects = the measured frame windows, `img/manifest.json photo_slots`), 86 editable texts (`node scripts/copy-manifest.ts --theme nocturne-lake-estate`) |
| `index.html` | the closed envelope over the night lake (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the night (lake, moon, halo, light on the path), the envelope layers (numbers = manifest `stage`) and the opening keyframes, the pages |
| `site.js` | `MOTION` (opening, scenes), the seal's flight, gold leaf, countdown, the story chapters, programme icons, the moon-path thread, the RSVP seal |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the moon seal) |
| `content.demo.json` | = `collections/22_Nocturne_Lake_Estate/content.demo.json` (fictional Eleanor & Luca, Villa Nocturne; music `moonlit-terrace`) |

Fonts (Google Fonts, never packaged; no other design uses them): **Waterfall** — names and script headings, large sizes
only (≥ 32 px; its strokes are thin); **Castoro Titling** — spaced capitals (dates, labels, buttons); **Castoro** — body
and italics. The names' fallback faces were measured with `scripts/font-fallback.ts`.

## The envelope (build_images.py)

The open envelope came out ~6 % taller than the closed one (hinge row 665 against the closed top edge 696, bottom 1286
against 1280, sides ±2 px). It is scaled onto the closed body first, so all layers line up:

- `env_flap` — the closed envelope's flap, cut along its gold hairline (`tema_build.kapak_kes("egri")`, method "renk").
- `env_pocket` — the open envelope's front panel below its gilded edge, used in every state: the closed flap lies on
  it, so the gold "moonlight" hairlines never change when the flap lifts (the closed envelope's own pocket pixels
  differ in tone and pattern and showed a seam once open).
- `env_back` — back and moiré lining; `env_flap_in` — the open flap's inside, standing above the hinge once open.
- `seal` on the valley's lowest point (19 % of the envelope's width, design board); the initials are live text on its
  smooth centre.
- `card` — the ivory card with its arch window (its hole measured → `mask_card.png`), the photo under it.

## The opening (index → home)

`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css` = the sound cues (`lib/audio/catalog.ts`):

| ms | step |
|---|---|
| 0 | **tick** — the seal is pressed; "Tap to open" goes, the names leave out of focus |
| 150–1450 | **rise** — a fixed clone of the seal lifts out of the valley and rises in an arc into the empty sky over the moon path, growing, its initials fading; the GPT moon fades in under it |
| 650–1350 | **flap** — the mountain flap lifts to edge-on (3D), then its gold moiré inside stands up from edge-on |
| 1250 | **moon** — the halo opens, light runs down the moon path, gold leaf drifts from the moon |
| 1350–2300 | **draw** — the ivory card slides out of the pocket |
| 2400–3300 | **reveal** — it comes forward over the lake while the envelope sinks out of focus |
| 3900 | home: view transitions `invite-card` (the card's arch window → the home arch frame) and `sky-moon` (the moon stays in the sky) |

Reduced motion: straight to home. Without JS: the "Open the envelope" link. Esc / Skip during the opening go straight to
home. Opened state (session key `invite:opened:<slug>`): moon in the sky, flap open, card out, "Enter" + "Replay the
opening".

## Inner pages

- **Home** — the night lake with the moon (and light on its path), the names in Waterfall across the sky, the moonlit
  balustrade in front; on the black paper the portrait in the gilded arch frame (`mask_arch.png`) overlapping the
  balustrade, off-centre to the left (board), the request, the countdown in plain figures parted by the gold thread
  (K21), "Kindly reply"; the formal invitation on the gilt-edged black card (three GPT slices, the plain middle repeats),
  a story photo floating over the water, the evening, the moon seal as the signature.
- **Story** — one chapter at a time (arrows, dots, swipe, keys): the photograph in the gilded frame floating above night
  water (`water` = the wide lake's lower water), its reflection beneath it — the same slot mirrored, darker, broken by
  moving ripple bands (CSS mask, no SVG); "Chapter I" and "I / III" are CSS counters.
- **Details** — "The evening" with the date stacked at its right; the programme on the moon-path thread (the divider's
  own broken end turned upright, repeated) that lights down as the guest scrolls; a gold-foil icon per moment (rings,
  coupes, candelabra, gramophone, launch; chosen from the buyer's label in `site.js ICONS`), the dress code (bow tie)
  last; the venue in the gilded landscape frame.
- **RSVP** — the night lake dimmed and out of focus, a small moon; the gilt card with its moon-and-ripple ornament holds
  "Kindly reply", the deadline and the shared form. On "success" the moon seal comes down and is pressed onto the card
  (`press`), two coupes clink (`clink`), the moon brightens and gold leaf drifts down.

## Sound

Own pack `public/audio/fx/nocturne-lake-estate/` (tick, rise, flap, moon, draw, reveal, leaf, ripple, press, clink, tap,
chime) and own music `moonlit-terrace` (a 6/8 A-major barcarolle), all synthesized by `tools/audio_packs.py`; silent
until the guest's first tap (audio.js).

## Not yet

- The palettes (`collections/22_Nocturne_Lake_Estate/variants/`, G177) still follow the old parts: re-measure the
  families on the PAKET 8 parts and rebuild with `tools/recolor_parts.py` after approval.
- Marketing copy (`lib/marketing/designs.ts` and its four translations) and the listing/marketing captures describe
  the previous build until approval.
