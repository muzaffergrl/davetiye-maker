# Espresso Pastoral (42) — platform theme

Design 42 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 42; task G442; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W19, PAKET 2 photos, PAKET 6 print grounds; `collections/42_Espresso_Pastoral/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the candle's glow and the
photos' sepia are CSS light.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the cabinet card, venue = the wide cabinet card; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme espresso-pastoral`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the four landscape layers, the cabinet cards |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's petals, wheat and gypsophila |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the posy) |
| `content.demo.json` | = `collections/42_Espresso_Pastoral/content.demo.json` (fictional Eloise & Samuel, Woodstock) |

Fonts (Google Fonts, never packaged): **Mea Culpa** (names, headings) + **Cardo** (body, small capitals lines). Neither is
used by designs 01–41.

## The opening (index → home)

On espresso laid paper "Together with their families" and the names above, the envelope in the middle (with room above it
for the open flap), the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **portrait espresso
laid-paper envelope** with a **V flap with deckled edges** — its own GPT part (W9), not the CSS V flap of 01–21 — wrapped
by a **cream cotton lace band** with a **dried-flower posy** tucked into it; no seal. On tap (`site.js MOTION.envelope` =
the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–700 | the posy tips forward and falls; a few petals are shaken off (200–1300) |
| 400–1100 | the lace band slides down and off |
| 1000–1700 | the V flap swings up on its top edge (3D) onto its painted lining (a small twilight landscape); the card in the pocket comes into sight |
| 1600–3000 | the dive into that painting: sky, hills with the oak, meadow and grasses (GPT W3–W6) open round the guest at four speeds (parallax) |
| 2000–2500 | the envelope fades round the card |
| 2400–3200 | the card rises from the meadow |
| 3200–3600 | it comes forward |
| 3700 | home (view transition `invite-card` → the home hero card, under the same landscape) |

Back, card, pocket, flap (outside + lining), the band, the posy, the petals and each landscape layer are separate layers.
Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key
`invite:opened:<slug>`): the landscape, the card forward, "Enter" + "Replay the opening".

## Inner pages

- **Time flows** (`.frame.cabinet.aged`, GPT W14/W15): every photo sits in an antique cabinet card mount; it comes in sepia
  and turns to warm colour as its scene settles.
- **home:** the landscape along the top (the grasses sway), the parchment card with dried roses (W17) at its corner
  (portrait, names, date, venue), the invitation on parchment, countdown, calendar, the story teaser, the day by
  candlelight — a brass candlestick (W16) whose glow flickers — and the signature under dried roses. **story:** three
  moments left–right–left. **details:** the order of the day on parchment beside the candlestick, each row starting with
  an ear of wheat that leans in; the venue in a wide cabinet card; G127 map; G138 blocks, travel, menu, registry, FAQ.
  **rsvp:** the G042 form (G051 questions, G069 guest names) on parchment under dried roses; on success rose petals,
  wheat and gypsophila drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, band, posy) share one canvas; each is cut to its alpha box and laid in the
  envelope box (the back's) by its measured edges — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-espresso-pastoral.test.ts compares them).
- GPT drew the posy over the whole canvas instead of its own small one: it is cut to its box and laid centred on the band
  (34 % of the envelope's width).
- The GPT pocket is low (38 % down) and the V flap narrow: the card would show beside the flap, so it stays out of sight
  until the flap lifts.
- `cabinet_frame` and `cabinet_wide` have only a green rim round an already transparent window: the whole measured
  rectangle is cleared and the green spill round it neutralised. The green check covers only the mounts (the landscape
  is green by nature in places).

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
