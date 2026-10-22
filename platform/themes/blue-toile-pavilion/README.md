# Blue Toile Pavilion (44) — platform theme

Design 44 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 44; task G444; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W18, PAKET 2 photos, PAKET 6 print grounds; `collections/44_Blue_Toile_Pavilion/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the glint on the glaze is
CSS light (shaped by the plate itself as a mask). The toile pattern was made for this design.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero, story 1 and 3 = the round plate, story 2 = the scalloped plate, venue = the oval platter; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme blue-toile-pavilion`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the plates, their hangers and glints |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's florets and delphiniums |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the brooch) |
| `content.demo.json` | = `collections/44_Blue_Toile_Pavilion/content.demo.json` (fictional Adeline & Victor, Charlottesville) |

Fonts (Google Fonts, never packaged): **MonteCarlo** (names, headings) + **Rosarivo** (body, small capitals lines).
Neither is used by designs 01–43.

## The opening (index → home)

On porcelain-white paper "Together with their families" and the names above, the envelope in the middle (with room above
it for the open flap), the date · the city and "Tap to open" below, Skip in the corner. The envelope is covered in the
design's own **blue toile**, with an **ogee flap** edged with powder-blue piping and a **blue-and-white porcelain cameo
brooch** pinned to its tip. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–700 | the brooch comes off its pin, lifts and glides aside |
| 500–1200 | the ogee flap swings up on its top edge (3D) onto its powder-blue inside |
| 900–3000 | three engraved doves lift off the toile one after another (300 ms apart) and fly away in arcs |
| 1500–2150 | the card rises out of the pocket |
| 2150–2550 | it comes forward |
| 2650 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket (with its side wings), flap (outside + inside), the brooch and each dove are separate layers. Reduced
motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`):
flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **The plate wall** (`.frame.plate.hung`, GPT W11–W13): every photo sits in the round window of a blue-and-white plate
  (round, scalloped; the venue on an oval platter) hanging from a powder-blue silk bow (W14); as its scene enters the
  plate swings on its hanger and settles, then a light runs over the glaze.
- **home:** the porcelain card with a dove and the ginger jar of hydrangeas and delphiniums (W15) at its corners
  (portrait plate, names, date, venue), the invitation on powder-blue linen with an engraved garland (W16), countdown,
  calendar, the story teaser, the day on the toile (deep blue laid over it so the text reads), the signature by the jar.
- **story:** three plates on the linen wall, left–right–left. **details:** the order of the day on a porcelain card, each
  row starting with a small engraved dove; the venue on the oval platter; G127 map; G138 blocks, travel, menu, registry,
  FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a porcelain card under the garland; on success two
  doves fly in and land on it, and hydrangea florets and delphiniums drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap) share one canvas; each is cut to its alpha box and laid in the envelope box
  (the back's) by its measured edges — the pocket's side wings reach above the back and the flap is wider than it, so
  both are kept at their measured boxes — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-blue-toile-pavilion.test.ts compares them). The wings hide the card beside the flap.
- The plate windows are round or oval: only the green and the clear inside are cleared (never the rectangle round them,
  which holds the plate's rim); the photo sits in the window's bounding box under the plate. The green check covers only
  the plates (the jar's leaves are green by nature).

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times. The glint needs CSS masks (`-webkit-mask` included).
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
