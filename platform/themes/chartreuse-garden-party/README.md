# Chartreuse Garden Party (43) — platform theme

Design 43 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 43; task G443; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W16, PAKET 2 photos, PAKET 6 print grounds; `collections/43_Chartreuse_Garden_Party/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the instant print, venue = the wide instant print; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme chartreuse-garden-party`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the instant prints, the prints on florist picks (`.posy`) |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's petals, sprigs and cosmos |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = a flower cluster) |
| `content.demo.json` | = `collections/43_Chartreuse_Garden_Party/content.demo.json` (fictional Poppy & Hugo, Nashville) |

Fonts (Google Fonts, never packaged): **Hurricane** (names, headings — a bold brush script) + **Fraunces** (body, small
capitals lines). Neither is used by designs 01–42.

## The opening (index → home)

"Together with their families" and the names above, the envelope in the middle (with room above it for the open flap),
the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **landscape chartreuse envelope with a
scalloped flap**, no seal: a single **pink ranunculus** holds it shut, its stem threaded through two slits in the flap.
The cream card lies turned a quarter in the landscape pocket. On tap (`site.js MOTION.envelope` = the `.is-opening`
keyframes in `site.css`):

| ms | step |
|---|---|
| 0–700 | the stem slides out of its slits to the right and the flower tumbles away |
| 500–1200 | the scalloped flap swings up on its top edge (3D) onto its pink-and-burgundy gouache lining |
| 1000–2150 | four gouache flower clusters burst out from behind the envelope, 150 ms apart (slight overshoot) |
| 1500–2300 | the card turns upright as it rises out of the pocket |
| 2300–2700 | it comes forward |
| 2800 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), the stem and each cluster are separate layers. Reduced motion: straight to
home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`): flap open, clusters
out, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Prints on florist picks** (`.posy`): every story photo is a black-and-white instant-film style print (GPT W10,
  `grayscale` on the photo) on a gold wire florist pick (W12) standing in a low gouache arrangement in a footed bowl
  (W13); as the scene enters the view the print rises out of the flowers and then sways a little. The portrait keeps
  its colours.
- **Text** pops in like a bloom opening (a short rise with a slight overshoot).
- **home:** the cream card with flower clusters at two corners (portrait print, names, date, venue), the invitation
  between two flower garlands (W14), countdown, calendar, the story teaser (three prints rising one after another out of
  one arrangement), the day on the chartreuse band (W2), the signature under a flower cluster.
- **story:** three moments left–right–left, each in its own arrangement. **details:** the order of the day on a cream
  card, each row starting with a burgundy cosmos (W15) that spins open; the venue as a wide instant print (W11); G127
  map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a cream
  card under a garland; on success peony petals, lady's mantle sprigs and cosmos rain down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap) share one canvas; GPT drifted a few per cent between them. `build_images.py`
  cuts each to its alpha box and lays it in the envelope box (the back's) by its measured edges — `img/manifest.json`
  `stage`; `site.css` uses the same numbers (tests/theme-chartreuse-garden-party.test.ts compares them).
- The stem is its own canvas: it is laid across the flap where its slits are (40 % of the envelope's height).
- The envelope is landscape (1.62 : 1), the card portrait (0.70 : 1): the card lies turned a quarter in the pocket and
  turns upright as it rises (`card-rise`), so it never shows outside the pocket while closed.
- The green check covers only the keyed frames (`instant`, `instant_wide`): the foliage is green by design.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
