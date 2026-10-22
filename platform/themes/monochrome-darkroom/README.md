# Monochrome Darkroom (47) — platform theme

Design 47 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 47; task G447; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W18, PAKET 2 photos, PAKET 6 print grounds; `collections/47_Monochrome_Darkroom/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the safelight, the
negative (invert) and black-and-white filters and the shutter are CSS light and interface.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the fibre print, venue = the wide fibre print; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme monochrome-darkroom`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the prints, the film frames, the loupe |
| `site.js` | `MOTION` (opening, scenes, loupe), countdown, the loupe, the reply's petals and film |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the film canister) |
| `content.demo.json` | = `collections/47_Monochrome_Darkroom/content.demo.json` (fictional Simone & Elliot, Minneapolis) |

Fonts (Google Fonts, never packaged): **Herr Von Muellerhoff** (names, headings) + **Newsreader** (body, small capitals
lines). Neither is used by designs 01–46.

## The opening (index → home)

On matte black photographic paper "Together with their families" and the names above, white anemones over the envelope's
top corner (in the room the open flap will take), the envelope in the middle, the date · the city and "Tap to open"
below, Skip in the corner. The envelope is a **portrait light-tight black paper envelope with a tuck flap** (no seal); a
**loose loop of 35 mm negative** comes out where the flap tucks in. On tap (`site.js MOTION.envelope` = the
`.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–400 | the loop of negative runs off … |
| 100–1600 | … as a strip of negatives (the couple's photos inverted, GPT W8 frames) across the screen |
| 800–1200 | the anemones fade |
| 800–1700 | the tuck flap comes out of the pocket (its tongue clears the edge at ~40°) and swings up on its top edge (3D) |
| 1400–3400 | the room turns to the red of the safelight, and back |
| 1700–2300 | the card rises out of the pocket |
| 2300–2700 | it comes forward into the developing tray (W9, turned upright round it) |
| 2300–3400 | the card comes up from blank white paper |
| 3600 | home (view transition `invite-card` → the home hero card) |

Back, card, flap (outside + inside), pocket, the loop, the strip's frames, the tray and the anemones are separate
layers. Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key
`invite:opened:<slug>`): flap open, the card forward in the tray, "Enter" + "Replay the opening".

## Inner pages

- **Black and white:** every photo is shown black and white. Prints (`.frame.print.develop`, GPT W11/W12) come in as
  negatives and turn positive as their scene settles in the view; the film frames (W8) show the negatives.
- **home:** the strip of negatives from the opening rolls slowly along the top; the fibre card with anemones at two
  corners (portrait print, names, date, venue), the invitation on fibre paper under a short strip of negative (W16),
  countdown, calendar, the story teaser (a print from negative to positive), the day under the red of the safelight
  (CSS light), the signature by the film canister (W15).
- **story:** a contact strip of the three photos with a photographer's loupe (W13) that follows the finger or the
  pointer and shows the frame under it larger (`site.js initLoupe`: a copy of the strip in the lens, `MOTION.loupe`);
  then three moments left–right–left. **details:** the order of the day on fibre paper, each row starting with a film
  frame that comes up; the venue as a wide fibre print; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the
  G042 form (G051 questions, G069 guest names) on a fibre card; on success the shutter closes and opens frame by frame
  and anemone petals and curls of film drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, loop) share one canvas (GPT gave the back one pixel row more); each is cut to
  its alpha box and laid in the envelope box (the back's) by its measured edges in % of each canvas —
  `img/manifest.json` `stage`; `site.css` uses the same numbers (tests/theme-monochrome-darkroom.test.ts compares them).
  The pocket and the flap are a little wider than the back; they span its width.
- `fiber_print` and `fiber_wide` have only a green rim round an already transparent window; `film_tile` a full green
  window: in both cases the whole measured rectangle is cleared and the green spill round it neutralised
  (`checks.green` = none).
- The dark page sets `color-scheme: dark`; the fibre cards set `light`, so the form controls on them stay light.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times; the loupe was moved with the mouse there, not with a finger.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
