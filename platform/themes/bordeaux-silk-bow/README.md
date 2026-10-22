# Bordeaux Silk Bow (46) — platform theme

Design 46 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 46; task G446; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W18, PAKET 2 photos, PAKET 6 print grounds; `collections/46_Bordeaux_Silk_Bow/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the keepsake print, venue = the wide keepsake print; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme bordeaux-silk-bow`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the keepsake prints and their ribbon (`bundle_place`), the ribbon down the page edge (`ribbon`) |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's petals and ribbon ends |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the small bow) |
| `content.demo.json` | = `collections/46_Bordeaux_Silk_Bow/content.demo.json` (fictional Cecilia & Nathaniel, Philadelphia) |

Fonts (Google Fonts, never packaged): **Carattere** (names, headings) + **Brygada 1918** (body, small capitals lines).
Neither is used by designs 01–45.

## The opening (index → home)

"Together with their families" and the names above, white tulips over the envelope's top corner (in the room the open
flap will take), the envelope in the middle, the date · the city and "Tap to open" below, Skip in the corner. The
envelope is a **portrait ivory linen envelope with a straight flap**; a broad **claret silk satin ribbon** runs through two
punched holes (flap and pocket) and is tied in front in a **big bow** with long V-cut tails. On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–650 | the left loop slackens and is drawn into the knot with its tail |
| 250–900 | then the right loop |
| 350–650 | the straight band between the two holes shows (GPT W8) |
| 1000–1500 | it is pulled up through the flap's hole |
| 1100–2300 | the ribbon runs down the screen edge (as it does down the home page) |
| 1300–1800 | the tulips fade |
| 1500–2200 | the straight flap swings up on its top edge (3D) onto its claret silk lining |
| 2100–2750 | the card rises out of the pocket |
| 2750–3150 | it comes forward |
| 3250 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), the band, each half of the bow (one GPT image cut at its knot), the tulips
and the falling ribbon are separate layers. Reduced motion: straight to home. Without JS: the "Open the envelope" link.
Opened state (session key `invite:opened:<slug>`): flap open, ribbon down the edge, card forward, "Enter" + "Replay the
opening".

## Inner pages

- **The ribbon down the page edge** (home): the straight satin ribbon (GPT W9, repeating) with an S-curl (W10) at the top of
  each section; it draws on downwards as its section enters, runs in front of the bands and behind the text and the
  cards, and goes behind the claret band.
- **Keepsake prints** (`.frame.print`): black-and-white prints (`grayscale` on the photo) with a deckled ivory border
  (W12). **home:** the deck — three prints tied crosswise with the claret ribbon (W13): the ribbon loosens and slips off,
  the prints fan out one by one. **story:** three moments left–right–left, each print tied with the ribbon, which
  loosens and slips off as the scene enters. The venue is a wide keepsake print in colour (W14).
- **Text** comes forward softly.
- **home:** the ivory linen card under a small claret bow (W16) with white tulips at its corner (portrait print, names,
  date, venue), the invitation under a small bow, countdown, calendar, the deck, the day on the claret silk band (a crop
  of the envelope's own lining), the signature. **details:** the order of the day on an ivory linen card, each row
  starting with a small bow that ties itself; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form
  (G051 questions, G069 guest names) on an ivory linen card under a small bow; on success the bow ties itself again and
  tulip petals and curled ribbon ends drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, bow, band) share one canvas; GPT drifted a few per cent between them (the
  pocket and the flap are wider than the back). `build_images.py` cuts each to its alpha box and lays it in the envelope
  box (the back's) by its measured edges — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-bordeaux-silk-bow.test.ts compares them).
- The untied band (W8) was drawn a little lower than the punched holes (40–61 % against holes at 34 % and 52 % of the
  canvas): it is laid between the holes measured on the flap and the pocket (`stage.holes`).
- The S-curl (W10) was drawn with a narrower ribbon than the straight run (W9): it is scaled so that its two ends are as
  wide as the straight ribbon (`ribbon.curl_end`), so the joins line up.
- `keepsake_print` and `keepsake_wide` have only a green rim round an already transparent window: the whole measured
  rectangle is cleared and the green spill round it neutralised (`checks.green` = none).

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
