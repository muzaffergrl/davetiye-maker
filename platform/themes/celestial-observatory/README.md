# Celestial Observatory (29)

A small brass observatory under the midnight sky; engraved star charts, moon phases and gold leaf. New design of the
29–32 wave (`docs/24_YENI_TASARIMLAR.md`, task G168). Status: **coming** (`lib/marketing/config.ts`) — the design's own
GPT parts do not exist yet; sale, price and approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` round 1:1, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme celestial-observatory`) |
| `content.demo.json` | = `collections/29_Celestial_Observatory/content.demo.json` (fictional Celeste & Rowan, Starlight Ridge Observatory Gardens, Flagstaff, Arizona; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed observatory · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the observatory keyframes, the dial sweep and moon-phase reveals / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, starfield, scenes, accents), `LETTERS` (the constellation paths A–Z), long names, card fit, scenes, the turning sky (`--turn`, `--p`), countdown, opening, stars |
| `build_images.py` | GPT textures → `img/` (interim toning, brass crop, placeholders, og montage, favicon, `manifest.json`); every optional GPT part that exists → `img/` + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the optional GPT parts present in `parts/`; a comment only while none exists. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Flagstaff),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; latch 0 · shutter 450 · constellation chime 1700 · card
3000 · chime 3600 ms), calendar, thank-you mode, editable texts, languages (G144; two new strings, "Written in the stars"
and "Open the dome", translated in `lib/i18n/dict/site/*`). Fonts: Imperial Script + Forum (Google Fonts; no font files).

## Opening — the dome opens onto the night sky

Tap → kicker, names and date rise away (0–450 ms) while moonlight passes over the brass (100–900) → the **two halves of
the slit shutter** slide apart, left to the left and right to the right (450–1100) → the night sky in the slit
brightens and a soft light rises from it (900–1800) → **stars light up one by one** over the observatory (14 GPT
sprites at fixed places, 1100–2300, then they twinkle) → a fine **constellation line joins them into the couple's
initials** (1700–2950: site.js draws a 1 px line on a canvas through the vertices of each capital, letter by letter,
with a star lit at each vertex as the line reaches it) → the engraved sky turns 14° over the whole opening → the card
with the round portrait, "Our wedding", the names and the date **rises out of the slit** (3000–3600) → comes forward
(3600–3950) → home at 4050 ms (view transition `invite-card` onto the home card). Dome, slit sky, light, two shutter
halves, card, starfield and constellation are separate layers; nothing is one picture that fades.

The initials come from the platform's monogram (`data-field="initials"`, the panel's "Monogram" field), read by site.js
and never shown as text; letters outside A–Z (after removing accents) are left out, none = no constellation. The
letters are a stroke table in `site.js` (`LETTERS`), each point nudged a little (a star map, not a typeface). The line is
interface (docs/11 §5.7: a 1 px line, light only); the stars are GPT's — without `star_1..3` there are no stars, only the
line. The constellation is drawn again in the home signature when it scrolls into view.

Reduced motion: no opening (tap → home), no sheen, no tap-hint breathing, no dial sweep, no turning, the constellation
drawn at once.

## Pages

- **Home:** engraved orbits (GPT) turning slowly behind the chart-paper card (round portrait in its planisphere rim,
  "Our wedding", names in Imperial Script, weekday + date, venue, city); the invitation on a chart-paper band ("Written in
  the stars", moon phases, host line, full names with display-name fallback, request, date in three lines, venue,
  ceremony time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser in a planisphere; the day on
  chart paper (first four programme rows); signature — astrolabe, the constellation of the initials, names, "Open the
  invitation again".
- **Story:** three round moments down the page, set left / right / left; each photo is uncovered by the **dial sweep** — a
  soft edge turning once round the photo's centre (a conic mask, `.dial`, `@property --sweep`) — then its number and
  caption; while the page scrolls the brass rims turn (−70° → +70° as each crosses the view) and the engraved sky behind
  the page turns with the scroll. Story intro + date as one sentence.
- **Details:** date heading, the programme on a chart-paper sheet (moon phases, gold hours, 1 px rules), ceremony
  sentence, calendar; the venue photo uncovered by a sweep from its bottom centre, left to right, like a telescope's
  beam; map; dress code, good to know (G138), travel & stay, menu, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** the shared form on a chart-paper sheet; "(optional)" outside the question label; astrolabe and "Open the
  invitation again". When a reply is sent (`rsvp:state` success) six stars rise and twinkle over the thank-you panel
  (GPT stars only).
- Text steps come out like starlight: from a bright glint (`filter: brightness`) they settle, drifting down a few pixels
  (not the shared rise).

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Kintsugi & Washi (G164) the theme is built from GPT pixels that
already exist, cut and toned, nothing drawn (K21):

- night sky = `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png` (plain navy paper) toned to midnight with its
  own grain (`tonla`); the page ground is the same, darker and smoother;
- chart paper = `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png` (plain cotton paper) toned silver-ivory;
- brass = the plain metal field inside `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png` (a rectangle
  between the laurel, darkened); the interim dome is that brass cut round the slit by a CSS mask (a crop, not a shape)
  with light falling on it, the shutter halves are darker crops of it;
- no stars, star chart, rims, astrolabe, moon phases or orbits: their elements stay hidden (`display:none`) until
  `parts.css` shows them. The look is plain until then; sale needs the GPT parts + an eye check.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/29_Celestial_Observatory/assets/gpt/parts/` and writes `parts.css`; the manifest lists
`parts.used` and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema celestial-observatory --sekil
collections/29_Celestial_Observatory/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with
neutral test images (repo untouched) — passed 14/16 (only PAKET 6, by hand).

## What waits for GPT

| Part | Then (automatic) |
|---|---|
| W2.1 `night_sky`, W2.2 `chart_paper` | same roles, instead of the toned interim textures (the page ground = the sky at 62 %) |
| W2.3 `dome` | #00FF00 slit measured (`manifest dome.slit_pct`) and keyed to alpha → `dome-900` = the observatory (mask off); the slit sky, light and shutter sit on the measured box; the stage takes the part's ratio. No slit found → warning, interim brass stays |
| W2.4 `shutter` | trimmed, cut in two at the centre → `shutter_l/r-240`, stretched to the slit |
| W2.5 `star_1..3` | `star_N-128` + `--co-stars` → the 14 stars of the opening, the stars at the constellation's vertices, the stars of a sent reply |
| W2.6 `star_chart` | `chart-1000` = `.sky-chart`: the opening sky (turns), the story page's sky (turns with the scroll) |
| W2.7 `planisphere_ring` | #00FF00 window measured (`manifest ring.window_pct`), keyed → `ring-720` fills each `.planisphere`, the round photo sits in the window; turns with the scroll. No window → warning, photos stay without a rim |
| W2.8 `astrolabe` | `astrolabe-480` = `.astro` (home signature, RSVP closing; turns with the scroll) |
| W2.9 `moon_phases` | `moons-800` = `.moons` under the headings on chart paper (clip-path reveal) |
| W2.10 `orbits` | `orbits-900` = `.orbits` behind the home card (one turn in 240 s) |
| W2.11 `card_small` | round #00FF00 window measured (`manifest card_small.window_pct`), keyed → `card_small-860` = the card from the slit; the portrait slot sits on the window, the text starts below it. No window → warning, card stays chart paper |
| W2.12 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`, bottom-aligned) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print/invitation_front_5x7`, `invitation_back_5x7` | **by hand** (one block; boxes are measured on the art, G149): `lib/print/layouts.ts` → those sheets, `node scripts/build-print-assets.ts --theme celestial-observatory` — steps in GPT_PROMPTS.md PAKET 6 |

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi): the theme is rendered by the platform only.
- The constellation is a canvas line drawn by the theme's script (asked for by the brief as a UI path over GPT stars);
  it is the only line the theme draws, 1 px, light only.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves, Safari's handling of
`@property --sweep` (without it the dial sweep is skipped and the photo simply appears).
