# Painted Lily Pond (41) — platform theme

Design 41 of the fourth wave (`docs/33_GPT_YENI_10_TASARIM.md`, row 41; task G441; pipeline `docs/34_TEMA_HATTI_40_48.md`,
pilot 39). **Status: `coming`** (not on sale, no price — `lib/marketing/config.ts`). Built from the design's own GPT parts,
all present (PAKET 5 W1–W15, PAKET 2 photos, PAKET 6 print grounds; `collections/41_Painted_Lily_Pond/assets/gpt/`).
Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; the light on the water and
the photos' painted look (blur, saturation, the canvas grain laid over them) are CSS.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero + story = the canvas panel, venue = the wide panel; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme painted-lily-pond`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the brushstroke masks, the canvas panels |
| `site.js` | `MOTION` (opening, scenes), countdown, the reply's lily pads, sprigs and dragonfly |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the lilac seal) |
| `content.demo.json` | = `collections/41_Painted_Lily_Pond/content.demo.json` (fictional Rosalie & Benjamin, Sonoma) |

Fonts (Google Fonts, never packaged): **Comforter Brush** (names, headings) + **Arapey** (body, small capitals lines).
Neither is used by designs 01–40.

## The opening (index → home)

On primed linen canvas "Together with their families" and the names above, the envelope in the middle (with room above it
for the open flap), the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **portrait canvas
portfolio envelope**; its straight flap with a deckled edge is **painted with a small lily pond**, closed by a **lilac wax
seal** with an embossed water lily. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–600 | the seal lifts away |
| 500–1200 | the flap swings up on its top edge (3D) onto its lilac-blue wash |
| 1100–2550 | four broad brushstrokes (GPT W8) sweep across the screen one after another, 250 ms apart: each one's colour shows for a moment, then the water-garden painting (W2) appears inside its shape (the stroke as a CSS mask) |
| 2100–2600 | then the whole painting |
| 2000–2800 | the card rises as if from the water; the light widens on the water under it (2200–3300, CSS light) |
| 2800–3200 | it comes forward |
| 3300 | home (view transition `invite-card` → the home hero card, which stands on the same painting) |

Back, card, pocket, flap (outside + inside), the seal, each brushstroke and the painting are separate layers. Reduced
motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session key `invite:opened:<slug>`):
flap open, the painting shown, card forward, "Enter" + "Replay the opening".

## Inner pages

- **From painting to photograph** (`.frame.pano.painted`, GPT W10/W11): every photo sits in a stretched canvas panel with
  painted edges; as its scene enters it comes in soft and saturated under the canvas grain (W1 over it), then sharpens.
- **home:** on the garden painting the canvas card with wisteria (W12) at its top corners (portrait, names, date, venue);
  the invitation on canvas with a band of water lilies (W13) under it; countdown, calendar; the story teaser; the day on
  deep pond blue under the canvas grain; the signature with the lilies and a hovering dragonfly (W14).
- **story:** three moments left–right–left with lily pads drifting and a dragonfly hovering between them. **details:**
  the order of the day on a canvas card, each row starting with a wisteria sprig that swings in; the venue in a wide
  panel; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on
  a canvas card with a band of lilies; on success a small brushstroke is laid over the card and lily pads, wisteria and a
  dragonfly drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap) share one canvas (one pixel row differs); each is cut to its alpha box and laid
  in the envelope box (the back's) by its measured edges in % of each canvas — `img/manifest.json` `stage`; `site.css`
  uses the same numbers (tests/theme-painted-lily-pond.test.ts compares them). The seal (its own canvas) sits centred on
  the flap's deckled edge.
- `canvas_frame` and `canvas_wide` have only a green rim round an already transparent window: the whole measured
  rectangle is cleared and the green spill round it neutralised. The green check covers only the panels (the painting is
  green by nature).
- The impasto parts compress poorly: wisteria, lilies and the canvas ground are served smaller (theme folder ≈ 2.5 MB of
  the 3 MB budget).

## Known limits

- Not tried on a real iPhone/Safari or Android Chrome; the frames were checked at 390 × 844 in a local Chromium
  (Playwright) with the animations sought to fixed times. The brushstroke masks need CSS masks (`-webkit-mask` included).
- `theme-check` and `scripts/font-fallback.ts` were not run (they need a production build and the Linux Playwright setup):
  the names fallback faces still carry the copied template's numbers.
