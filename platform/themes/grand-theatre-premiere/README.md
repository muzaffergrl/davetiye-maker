# Grand Theatre Premiere (24) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md` row 24, task G424, built like the pilot G423). The October
18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, a flat
velvet gatefold with blank reverse faces, the `variants.css` palettes) was replaced: the theme follows the pilot-39
structure (`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R
W1–W21, PAKET 2 photos, PAKET 6R print grounds; `collections/24_Grand_Theatre_Premiere/assets/gpt/`). **Status:
`preview`** (shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every
picture is a GPT part cut, keyed or scaled by `build_images.py`; the spotlight, the footlights' glow and the dimming of
the house lights are CSS light.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the gilded proscenium, story = the programme pages, venue = the wide proscenium; aspects from `img/manifest.json`), 86 editable texts (`node scripts/copy-manifest.ts --theme grand-theatre-premiere`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the frames (windows = manifest `window_pct`, masks = manifest `mask`), the programme pages |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, window masks, og image, favicon = the cord's knot and tassels) |
| `content.demo.json` | = `collections/24_Grand_Theatre_Premiere/content.demo.json` (fictional Charlotte & Theodore, The Larkmont Grand Theatre, Richmond) |

Fonts (Google Fonts, never packaged): **Abril Fatface** (names, headings) + **Playfair Display** (body, small capitals
lines). Palette: ivory `#F3EBD8`, peacock `#16595B` / velvet `#0E3D40`, burgundy `#5E1622`, antique gold `#C9A45C`, ink
`#1E2626`. The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On warm ivory programme paper: "Together with their families", the names, a gilded acanthus divider, the envelope, the
date · the city and "Tap to open" below, Skip in the corner. The envelope is a **horizontal peacock-teal linen envelope
whose front is a stage**: two burgundy velvet curtains hinged on its outer edges under a fixed swagged valance, tied at
the centre by a gold tasselled cord with a blank ticket tucked under it (the ticket stirs now and then). On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–700 | the ticket slides up out from under the cord |
| 650–1400 | it tears at its perforation: the stub tumbles down and away, the body floats up and fades |
| 1100–2050 | the cord unties: each tasselled half swings from the knot like a pendulum and drops |
| 1300–2000 | the house lights dim (CSS vignette over the paper; names and stage stay bright) |
| 1500–2400 | the envelope settles to .72 so the open curtains stay inside a 360 px screen |
| 1600–2700 / 1740–2840 | the left, then the right curtain swings open toward the guest on its outer hinge (3D, ~115° with a small overshoot) onto its real gold silk lining (GPT W8/W9) |
| 2400–3900 | a spotlight sweeps in from the wings over the painted stage and settles centre stage; 2500 the footlights warm |
| 2900–3600 | the programme card rises from behind the apron (small, as if far upstage) |
| 3200 | gold confetti, burgundy and ivory petals drift down (GPT accents, `MOTION.accents.open`) |
| 3600–4100 | the card comes forward over everything; light sweeps over it |
| 4500 | home (view transition `invite-card` → the home hero card) |

Back (painted stage), spotlight, card, apron with footlights, each curtain (outside + lining), the valance, both ticket
pieces (one GPT image cut at its measured perforation) and both cord halves (cut at the knot) are separate layers.
Reduced motion: straight to home. Esc / Skip: straight to home. Without JS: the "Open the envelope" link. Opened state
(session key `invite:opened:<slug>`): curtains open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Frames** (`.frame` + `.cut`): the portrait in the gilded proscenium (velvet swag and tied-back drapes), the story
  photos on programme pages, the venue in the wide proscenium. The photo sits in the window the build measured and is
  clipped by that window's alpha mask (`img/mask_*.png`), so no photo corner shows between drape and pilaster; as a frame
  enters, it settles and a spotlight crosses the photo.
- **home:** the ivory programme card from the envelope (gilded acanthus and a burgundy rose at its upper corners;
  portrait, names, date, venue) → the invitation on a band of peacock velvet between two gilded acanthus dividers (the
  heading gets a single gold-leaf shimmer), countdown, calendar → story teaser (a programme page) → the day on an ivory
  band → signature: the brass opera glasses (a slow sway), the names, "Open it again".
- **story:** on a velvet band like a darkened stage, three programme pages — Act I, II, III (editable labels) — left,
  right, left; each turns in on its spine as it enters and a spotlight pool finds it; captions on the empty paper under
  the photo. Desktop: the three side by side.
- **details:** the order of the day on an ivory programme board under a gilded divider, each row's gold confetti disc
  drops in; the venue proscenium; G127 map; G138 blocks, travel, menu, registry, FAQ.
- **rsvp:** the G042 form (G051 questions, G069 guest names) on an ivory board on peacock velvet; on success a fresh
  ticket appears and its stub tears off at the perforation while confetti and petals drift down.

## Build notes (GPT drift absorbed)

- The envelope layers share one 1448×1086 canvas. The back and the pocket kept one box; the envelope came out 1.59 : 1
  (the prompt asked ≈1.45) — the theme uses the measured ratio. Curtains, valance, ticket and cord sit a little off the
  prompt's geometry but consistent with each other, so each layer is cut to its own alpha box and placed by it in the back's
  box (`img/manifest.json` `stage`; `site.css` uses the same numbers, `tests/theme-grand-theatre-premiere.test.ts`
  compares them). The pocket spans the back's width and is squeezed 3 % to end on its bottom edge.
- The ticket's perforation is at **56.3 %** of the canvas, not the prompt's 54.6 %: the build finds the column of punched
  holes (real alpha) and cuts there, so both pieces keep half-holes — a real tear line.
- The five footlight shells on the apron's lip are measured (where the lip rises above its moulding); the CSS glow sits on
  them.
- The frames' windows came as a transparent hole (proscenium, no green at all) or a green rim with a cloudy middle
  (programme page, venue): window = the hole the frame encloses (flood fill from the centre over non-solid pixels, green
  counts as hole; PIL, no scipy), cleared, green spill neutralised (`checks.green` = none), plus a mask PNG of it.
- The curtains' inner faces (800×1000 canvas, narrower than the outer faces) are stretched onto the curtain's box; at
  115° the foreshortening hides it.
- The programme card is laid out at its final size (70 % of the envelope's width) and scaled down (.22) behind the apron
  while closed, so its text renders crisp once it has come forward.
- Unused retries in `parts/` (`*_v1/_v2/_v3`) were looked at and not needed.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright; animations sought to fixed times and
  played in real time). Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers of the previous build; `scripts/font-fallback.ts` was not re-run for Abril
  Fatface.
- Catalogue card (`lib/marketing/assets.json`) still shows the old cover/clip until it is recaptured (needs a production build).
