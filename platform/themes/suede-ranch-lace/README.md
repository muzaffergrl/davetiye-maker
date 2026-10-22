# Suede Ranch Lace (45) — platform theme

Design 45 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 45; task G445; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W18, PAKET 2 photos, PAKET 6 print grounds; `collections/45_Suede_Ranch_Lace/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the golden-hour sweep and
the reply's breeze are CSS light.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the tooled leather frame, venue = the wide frame; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme suede-ranch-lace`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the leather frames and their gates |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's sage, bluebonnets and wild roses |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the concho) |
| `content.demo.json` | = `collections/45_Suede_Ranch_Lace/content.demo.json` (fictional Josie & Beau, Jackson) |

Fonts (Google Fonts, never packaged): **Rochester** (names), **Rye** (headings and short labels only), **Lustria** (body).
None is used by designs 01–44.

## The opening (index → home)

On tan suede "Together with their families" and the names above, the envelope in the middle (with room above it for the
open flap), the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **portrait suede envelope**
whipstitched with leather at the sides; its straight flap carries a **cream lace strip** and a **suede fringe**; a **leather
cord** goes twice round it, knotted under a **silver concho**. On tap (`site.js MOTION.envelope` = the `.is-opening`
keyframes in `site.css`):

| ms | step |
|---|---|
| 0–600 | the concho turns half round (and leaves with the cord, 500–1000) |
| 400–1100 | the cord comes undone and slides away to the side |
| 900–1700 | the fringed flap swings up on its top edge (3D), past and back, and settles on its ticking lining |
| 1300–2300 | a golden-hour light sweeps the screen (CSS light) |
| 1700–2350 | the card rises out of the pocket |
| 2350–2750 | it comes forward |
| 2850 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), the cord and the concho are separate layers. Reduced motion: straight to
home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`): flap open, card
forward, "Enter" + "Replay the opening".

## Inner pages

- **Ranch gates** (`.frame.leather.gated`, GPT W11–W13): every photo sits in a tooled leather frame behind a weathered
  ranch gate that swings open on its hinge as the scene enters; the venue's wide frame has two leaves (the gate and its
  mirror). Without JS or with reduced motion there is no gate.
- **home:** the cream card with wildflowers (W16) at its corner (portrait, names, date, venue), the invitation between
  lace strips (W14), countdown, calendar, the story teaser, the day over the golden-hour ranch landscape (W3) under a warm
  dusk, the signature under the felt hat (W15). **story:** three moments left–right–left. **details:** the order of the
  day on a cream card, each row starting with a sprig of sage that leans in; the venue behind the two-leaf gate; G127
  map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a cream
  card under a lace strip; on success a warm, dusty breeze crosses the page and sage, bluebonnets and wild roses drift
  down.

## Build notes (GPT drift absorbed)

- The envelope layers came on two canvases (docs/34 §4): the back and the flap 1079 × 1457, the pocket and the cord
  1036 × 1518. Each is cut to its alpha box and laid in the envelope box (the back's) by its measured edges in % of its
  own canvas — `img/manifest.json` `stage`; `site.css` uses the same numbers (tests/theme-suede-ranch-lace.test.ts
  compares them). The concho is centred on the cord's knot, measured where the cord and its tails are tallest
  (`stage.knot_x`), a little left of the middle.
- `leather_frame` and `leather_wide` have only a green rim round an already transparent window: the whole measured
  rectangle is cleared and the green spill round it neutralised. The green check covers only the frames (the sage and
  the flowers are green by nature).
- On the suede ground the headings and small lines are ink (saddle brown on tan read too weakly); on the cream paper
  they turn saddle brown.

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times.
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
