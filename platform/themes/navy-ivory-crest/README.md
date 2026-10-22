# Navy Ivory Crest (48) — platform theme

Design 48 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 48; task G448; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W17, PAKET 2 photos, PAKET 6 print grounds; `collections/48_Navy_Ivory_Crest/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the gold sweep over the
embossing and the photos' emboss-to-tone filter are CSS light.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the notched mat, venue = the wide mat; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme navy-ivory-crest`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the mats, the crest and its HTML initials (`crest.shield_pct`) |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's petals and leaves |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the shield seal) |
| `content.demo.json` | = `collections/48_Navy_Ivory_Crest/content.demo.json` (fictional Caroline & Frederick, Annapolis) |

Fonts (Google Fonts, never packaged): **Mr De Haviland** (names, headings, the initials in the crest) + **Goudy
Bookletter 1911** (body, small capitals lines). Neither is used by designs 01–47.

## The crest and the initials

The crest (GPT W9) is a gold-engraved laurel wreath round an **empty** shield. The couple's initials are HTML text
(`data-field="initials"`, the content record's `initials`, edited in the panel) set into the shield's measured clear box
(`img/manifest.json` `crest.shield_pct`); they are never baked into a picture.

## The opening (index → home)

On navy linen "Together with their families" and the names above, the envelope in the middle (with room above it for
the open flap), the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **landscape navy linen
wallet with a straight flap**; on the flap a **blind-embossed empty laurel cartouche**, on its edge an **ivory shield wax
seal** over a short **navy grosgrain tab**. The ivory card lies turned a quarter in the pocket. On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–900 | a gold light sweeps across the embossing (CSS light) |
| 700–1400 | the seal lifts with its tab and turns aside |
| 1300–2000 | the wallet flap swings up on its top edge (3D) onto its pinstripe lining |
| 1700–2500 | the card turns upright as it rises out of the pocket |
| 2300–3200 | on it the crest is engraved from the bottom up |
| 2500–2900 | the card comes forward |
| 2900–3400 | the initials are inked into the shield |
| 3500 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), the tab and the seal are separate layers. Reduced motion: straight to
home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`): flap open, card
forward with its crest, "Enter" + "Replay the opening".

## Inner pages

- **Mats** (`.frame.mat.emboss`, GPT W11/W12): notched ivory mats with a blind-embossed laurel border; as the scene enters
  the photo first stands out white like blind embossing, then its tone flows in.
- **home:** on navy linen the ivory card with a magnolia at its corner, the crest (engraved as the scene enters, the
  initials inked in), the names, the date, the venue and the portrait in a mat; the invitation between gold laurel
  lines; countdown, calendar; the story teaser; the day on navy linen; the signature under a magnolia. **story:** three
  moments left–right–left. **details:** the order of the day on an ivory card under a laurel line, each row starting with
  a gold-engraved leaf that unfurls; the venue in a wide mat; G127 map; G138 blocks, travel, menu, registry, FAQ.
  **rsvp:** the G042 form (G051 questions, G069 guest names) on an ivory card under the crest; on success the shield seal
  is pressed at the foot of the card and magnolia petals and leaves drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, tab) share one canvas; each is cut to its alpha box and laid in the envelope
  box (the back's) by its measured edges — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-navy-ivory-crest.test.ts compares them). The seal (its own canvas) sits centred on the flap's edge.
- GPT drew the wallet wider than asked (1.62 : 1 instead of 1.42 : 1); the layout follows the measured box.
- `cartouche_frame` has no green window (docs/34 §4): its window is the clear region round its centre; the mat's
  notched corners lie over the photo. `cartouche_wide` has a green window: cleared whole, the spill round it removed.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
