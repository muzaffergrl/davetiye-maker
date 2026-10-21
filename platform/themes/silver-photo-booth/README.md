# Silver Photo Booth (39) — platform theme

Design 39 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 39; pilot task G439). **Status: `coming`** (not on
sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts, all present (PAKET 5 W1–W17, PAKET 2
photos, PAKET 6 print grounds; `collections/39_Silver_Photo_Booth/assets/gpt/`). Nothing is drawn (K21): every picture is
a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the booth window, venue = the deckled print; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme silver-photo-booth`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, booth frames, the printing strip, develop |
| `site.js` | `MOTION` (opening, scenes, the strip's resting place, flashes), countdown, the reply's flashes and accents |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon) |
| `content.demo.json` | = `collections/39_Silver_Photo_Booth/content.demo.json` (fictional Josephine & Miles, Saint Louis) |

Fonts (Google Fonts, never packaged): **Yesteryear** (names, headings — a 1940s script) + **Libre Caslon Text** (body,
small capitals lines). Neither is used by designs 01–38.

## The opening (index → home)

The catalogue cover layout: "Together with their families" and the names above, the envelope in the middle, the date ·
the city and "Tap to open" below, Skip in the corner; a flashbulb hangs over the envelope, in the room the open flap
will take (the gap above the envelope = the open flap's height, so the standing flap never covers the names). The envelope is a **pearl-silver
envelope with a deep U flap**, held shut by a **black-and-white photo-booth strip** that wraps it top to bottom; the
couple's story photos already show in its three frames (in black and white). No V flap, no wax seal. On tap
(`site.js MOTION.envelope`, same numbers as the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–520 | the flashbulb fires: a white camera flash (light only); spent, it fades by 1000 ms |
| 0–400 | "Tap to open" goes, the date line dims (the names stay) |
| 180–1080 | the strip slides up off the envelope, then turns aside to rest beside it, tilted (`strip-off`; `layoutStrip()` writes `--tx`/`--ty`/`--r`/`--s`; on a narrow screen it rests over the envelope's right edge) |
| 1150–1850 | the U flap swings up on its top edge (3D `rotateX` 0 → 180°) onto its black star-dust lining; the envelope paper under the closed flap fades first (`under`) |
| 1700–2350 | the card rises out of the pocket |
| 2200–2720 | a second flash |
| 2350–2750 | the card comes forward |
| 2850 | home (view transition `invite-card` → the home hero card) |

Back, card, `under`, pocket, flap (outside + lining) and the strip are separate layers. Reduced motion: no opening,
straight to home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`): the strip
beside the envelope, flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Photos develop** (`.frame.develop`): as the scene enters the view the booth's flash goes off in the window (`.fx`, a
  white layer) and the picture comes up from white to full contrast (`develop`, a CSS filter run). Strip frames stay in
  black and white (`develop-mono`).
- **The booth's print** (home, `.booth-print`): a strip of three frames (story 1–3) prints down out of the chrome slot in
  three pushes, and each frame develops in turn.
- **Text** comes up like an exposure: from a soft blur and a little light to sharp.
- **home:** the ivory card (portrait in the chrome booth window, names, date, venue; ranunculus + dusty miller at two
  corners), the invitation between strands of silver star sequins, countdown, calendar, the booth's print as the story
  teaser, the day on the black star-dust band (a crop of the envelope's lining), the signature (flashbulb, names, replay).
- **story:** three moments left–right–left in booth windows.
- **details:** the order of the day on ivory card stock, each row with a star sequin that twinkles in; the venue photo
  as a deckled print with silver photo corners; G127 map; G138 blocks, travel, menu; registry; FAQ.
- **rsvp:** the G042 form with G051 questions and G069 guest names on an ivory card; on success the booth flashes four
  times and star sequins, ranunculus petals and satin ribbon curls fall over the thank-you.
- Thank-you mode (G075), G144 language labels (new site strings in `lib/i18n/dict/site/*`), `scroll-padding-bottom`.

## Build notes (GPT drift absorbed)

- The four envelope layers (back, pocket, flap, strip) were asked on one canvas in one box; GPT drifted a few per cent
  between them. `build_images.py` cuts each to its alpha box and lays it in the envelope box (the back's) by its measured
  edges — `img/manifest.json` `stage`; `site.css` uses the same numbers.
- GPT's U flap curves from its very corners, so the black lining showed in two small wedges beside the closed flap: the
  `under` layer (a plain crop of the pocket's own paper) fills them while the envelope is closed and fades as the flap
  lifts.
- The photo windows came with their inside already transparent and a soft green rim: the build clears the whole measured
  window rectangle and neutralises the green spill round it (`checks.green` = none).
- The strip's three frames are blank grey paper in the part (one green window per part only): the build measures them
  (`stage.band_frames`) and the couple's photos sit in them.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome. `filter` animations on photos cost a little on old phones; reduced
  motion turns them off.
- Font fallback faces (`scripts/font-fallback.ts`) still carry the numbers of the copied template until they are measured
  against Yesteryear on a running build (G180 lists this theme as a diagnostic until then).
