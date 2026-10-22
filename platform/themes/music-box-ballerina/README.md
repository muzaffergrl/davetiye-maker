# Music Box Ballerina (32) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md` row 32, task G432, on the pilot G423 structure). The October
18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, blank reverse
faces during the opening, `variants.css`) was replaced: the theme now follows the pilot-39 / G423 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W18,
PAKET 2 photos, PAKET 6R print grounds; `collections/32_Music_Box_Ballerina/assets/gpt/`). **Status: `preview`** (shown as
"Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a GPT part
cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the gilded oval vanity mirror and the lid's mirror, story = the pearl-beaded oval mirrors, venue = the wide gilded mirror; aspects from `img/manifest.json`), 83 editable texts (`node scripts/copy-manifest.ts --theme music-box-ballerina`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the gilded mirrors (windows = manifest `window_pct`), the ballerina's pirouettes |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents of the opening and of a reply, the reply's key turn + pirouette |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the keyhole plate; `--still <png>` = the closed envelope for a composition check) |
| `content.demo.json` | = `collections/32_Music_Box_Ballerina/content.demo.json` (fictional Juliette & Arthur, The Rosewell Pavilion, Saratoga Springs) |

Fonts (Google Fonts, never packaged): **Ballet** (names, headings) + **Gilda Display** (body, small capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On pale blush silk satin: "Together with their families" and the names, the envelope in the middle (room above it for
the lid that opens upward), the date · the city and "Tap to open" below, Skip in the corner. The envelope is a
**horizontal rose-quartz satin envelope (1.283 : 1) whose flap is a serpentine music-box lid** with a gold filigree edge,
a **filigree keyhole plate** at its tip and a **brass winding key** in the keyhole (before the tap the key gives a small
nudge now and then). On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–1200 | the key turns two full turns round the keyhole (its canvas centre; a click at 0 and at 600) |
| 1150–2050 | the lid swings up on its top edge (3D); past 90° its real inside shows — rose-gold mirror satin with an oval mirror |
| 1650–2650 | the couple's portrait clears in the lid's oval mirror (blur → sharp) and light passes over the glass |
| 1900–2600 | the porcelain ballerina rises from behind the pocket |
| 2000 | rose petals, pearls and wisps of tulle drift down (GPT accents, `MOTION.accents.open`) |
| 2550–3950 | she turns two pirouettes: scaleX 1 → 0 → 1 four times, front / back views swapped at 0 |
| 3500–4150 | the cream card rises out of the pocket behind her; light sweeps over it (3600–4600) |
| 4150–4600 | it comes forward |
| 4700 | home (view transition `invite-card` → the home hero card) |

Back, card, ballerina (front + back), pocket, lid (outside + mirror inside with the portrait under the keyed window),
keyhole plate and key are separate layers; plate and key ride on the lid (they fold away with its outside). Reduced
motion: straight to home. Without JS: the "Open the invitation" link. Opened state (session key
`invite:opened:<slug>`): lid open, ballerina standing, card forward, "Enter" + "Replay the opening". No button or pill
appears during the opening.

## Inner pages

- **Gilded mirrors** (`.frame.jewel`): the portrait in the gilded oval vanity mirror crowned with roses, the story photos
  in the slender pearl-beaded oval mirrors, the venue in the wide gilded overmantel mirror. The photo sits in the window
  the build measured (oval windows clipped with `border-radius:50%`); as the scene enters, the frame settles, the photo
  clears like a misted mirror (blur → sharp) and light passes over the glass.
- **home:** the key turns once over the cream card (portrait mirror, names, date, venue; rose-and-tulle sprays at the two
  upper corners) → the invitation on a band of rose-quartz satin (the blush satin with a rose-quartz multiply tint)
  between two filigree rules (the heading gets a single gold-leaf shimmer), countdown, calendar → story teaser (pearl
  mirror) → the day on a cream band → signature: the porcelain ballerina turns a pirouette, "Open it again".
- **story:** three moments left – right – left, each in a pearl-beaded mirror that clears as it scrolls in; between them
  the little ballerina turns. **details:** the order of the day on cream under a filigree rule, each row starting with a
  pearl that rolls in; the wide gilded mirror; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042
  form (G051 questions, G069 guest names) on a cream card laid on rose-quartz satin under the brass key; on success the
  key turns once, the ballerina turns a pirouette and petals, pearls and tulle drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, lid, keyhole plate) share one canvas; GPT drew the pocket and the lid ~1–2 % wider
  than the back and stopped the pocket ~3 % above the back's bottom. `build_images.py` cuts each to its alpha box and
  lays it in the envelope box (the back's): pocket and lid span its width, the pocket reaches its bottom; the plate keeps
  its canvas place. Plate and key boxes are given in % of the lid's box — `img/manifest.json` `stage`; `site.css` uses
  the same numbers (tests/theme-music-box-ballerina.test.ts compares them).
- The keyhole plate came larger than the prompt's box (x 41–59 %, y 44–76 % instead of x 44–56 %, y 54–72 %); it is kept
  as drawn (it hangs from the lid's tip and reads well). The keyhole's round head is measured on the plate (the dark
  pixels of its middle), the key (its own 1254 px canvas, collar at the centre) is cropped square round the canvas centre
  and centred on it at 30 % of the envelope's width.
- The lid's inside (W6) has its own canvas and proportions (1.788 : 1, taller than the closed lid): it is as wide as the
  envelope and 110.6 % of the lid's height, standing up from the hinge; the gap above the envelope on the cover is that
  height. Its oval mirror is keyed (green rim + what it encloses) and the hero portrait sits under it.
- The portrait and story mirrors' windows came as a green rim round an already transparent or darker-green middle, the
  wide mirror's as a green rim round a transparent rectangle; the window = the rim with everything it encloses (PIL flood
  fill, no scipy), cleared, the green spill neutralised (`checks.green` = none).
- The two ballerina views have near-identical silhouettes; both are cut with one box (their union, centred on the
  pedestal) so the scaleX swap keeps her outline.
- The divider failed `kit_check`'s aspect test (canvas 1983×793 instead of 1600×200); its alpha box is a slim 1629×85
  rule, used trimmed.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times) with
  `scripts/theme-preview.ts` + `scripts/theme-frames.cjs`. Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers measured for the previous build's script; `scripts/font-fallback.ts` was not
  re-run for Ballet.
- The catalogue card (`lib/marketing/assets.json`, `public/marketing/`) still shows the old cover and clip; a new capture
  needs a production build.
