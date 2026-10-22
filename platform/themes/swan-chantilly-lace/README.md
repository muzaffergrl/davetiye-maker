# Swan Chantilly Lace (40) — platform theme

Design 40 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 40; task G440; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W20, PAKET 2 photos, PAKET 6 print grounds; `collections/40_Swan_Chantilly_Lace/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the deckled print, venue = the wide print; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme swan-chantilly-lace`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the prints and their lace veils (`veil_place`) |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's feathers and bells |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the swan seal) |
| `content.demo.json` | = `collections/40_Swan_Chantilly_Lace/content.demo.json` (fictional Beatrice & Alistair, Greenwich) |

Fonts (Google Fonts, never packaged): **Bonheur Royale** (names, headings) + **Crimson Pro** (body, small capitals lines).
Neither is used by designs 01–39.

## The opening (index → home)

"Together with their families" and the names above, a pair of engraved swans over the envelope (in the room the open flap
will take), the envelope in the middle, the date · the city and "Tap to open" below, Skip in the corner. The envelope is a
**square ivory cotton envelope with a round flap**, covered by a separate sheet of **Chantilly lace**, sealed with an
**ivory swan wax seal** over two **black silk ribbon tails**. On tap (`site.js MOTION.envelope` = the `.is-opening`
keyframes in `site.css`):

| ms | step |
|---|---|
| 0–600 | the swan seal tips and lifts away; the swans fade from 600 |
| 250–950 | the two ribbon tails slip out from under it, left and right |
| 700–1800 | the lace lifts off the envelope like a bridal veil — up from its top edge, tipping back, drifting away |
| 1500–2200 | the round flap swings up on its top edge (3D) onto its black silk lining (with a lace edge) |
| 1900–4300 | a white swan feather floats down |
| 2100–2750 | the card rises out of the pocket |
| 2750–3150 | it comes forward |
| 3250 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), lace, each ribbon tail (one GPT image, its two halves) and the seal are
separate layers. Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key
`invite:opened:<slug>`): flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Prints under lace** (`.frame.veiled`): every photo is a black-and-white deckled print (`grayscale` on the photo) under
  its own sheet of lace (GPT W12/W14, laid on the print by the boxes the build measured, manifest `veil_place`); as the
  scene enters the view the veil lifts off — up from its top edge, tipping back, drifting away.
- **Text** comes up slowly, as if a fine veil were drawn back.
- **home:** the ivory card under a black silk bow with lily of the valley at two corners (portrait print, names, date,
  venue), the invitation between two strips of Chantilly lace with the swans over it, countdown, calendar, the story
  teaser (another veiled print), the day on the black silk band (a crop of the envelope's own lining), the signature.
- **story:** three moments left–right–left. **details:** the order of the day on ivory cotton, each row starting with a
  lily-of-the-valley bell that swings in and rings to rest; the venue as a wide veiled print; G127 map; G138 blocks,
  travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on an ivory card edged with lace;
  on success swan feathers and bells drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, lace, tails) share one canvas; GPT drifted a few per cent between them (the
  pocket is wider than the back and runs below it). `build_images.py` cuts each to its alpha box and lays it in the
  envelope box (the back's) by its measured edges — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-swan-chantilly-lace.test.ts compares them). The seal (its own canvas) sits on the flap's tip.
- `print_wide.png` has only a thin green rim round an already transparent window: the whole measured rectangle is cleared
  and the green spill round it neutralised (`checks.green` = none).
- The card is 0.73 : 1, the envelope nearly square: the card is 61 % of the envelope's width so it stays inside the pocket.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
