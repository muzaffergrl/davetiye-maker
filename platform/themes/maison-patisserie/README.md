# Maison Pâtisserie (28) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, task G428, built on the pilot G423 Velvet Jewel Box). The
October 18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files,
`variants.css`, blank reverse faces during the opening) was replaced: the theme now follows the pilot-39 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W20 =
22 files, PAKET 2 photos, PAKET 6R print grounds; `collections/28_Maison_Patisserie/assets/gpt/`). **Status:
`preview`** (shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every
picture is a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the piped icing oval, story = the porcelain cake plates, venue = the pâtisserie window; aspects from `img/manifest.json`), 85 editable texts (`node scripts/copy-manifest.ts --theme maison-patisserie`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the frames (windows = manifest `window_pct`), the display-case shelf |
| `site.js` | `MOTION` (opening, scenes, shelf, accents), countdown, the shelf, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the sugared rose bud) |
| `content.demo.json` | = `collections/28_Maison_Patisserie/content.demo.json` (fictional Camille & Oliver, The Belle Rive Orangery, Newport) |

Fonts (Google Fonts, never packaged): **Parisienne** (names, headings) + **Italiana** (body, small capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On cream pastry paper with hair-fine pistachio pinstripes: "Together with their families" and the names, the envelope
in the middle (room above it for the open flap), the date · the city and "Tap to open" below, Skip in the corner. The
envelope is a **landscape cream envelope (1.32 : 1) with a shallow scalloped pistachio flap edged in pierced doily**,
wrapped by a **rose-pink sleeve band with gold scalloped edges**, a **rose satin bow** on the band and a **sugared rose
bud** on its knot. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–900 | the rose bud tips over the knot and rolls off to the left, dropping past the envelope |
| 700–1150 | the tied bow folds in while its untied tails (a separate GPT part) take its place |
| 1100–1850 | the loose tails slip away to the right |
| 1200–2000 | the sleeve band slides off to the right after them |
| 1950–2700 | the scalloped flap opens in 3D on its top edge onto its real inner face (rose doily lining, GPT W6) |
| 2500–3200 | the cream card rises from behind the pocket; light passes over it (2600–3600) |
| 2700 | macarons, sugar pearls and petals drop in beside the card and bounce once (GPT accents, `MOTION.accents.open`) |
| 3200–3650 | the card comes forward |
| 3700 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), sleeve band, tied bow, untied tails and the bud are separate layers. No
button or pill during the opening. Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened
state (session key `invite:opened:<slug>`): flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Frames** (`.frame.framed`): the portrait in the piped royal-icing oval, the story photos in gold-rimmed porcelain
  cake plates, the venue behind the glass of a pistachio pâtisserie window with a striped awning. The photo sits in the
  window the build measured (oval and round windows clipped with `border-radius:50%`; the shop window is a plain
  rectangle); as the scene enters, the frame settles and light passes over the photo (the venue photo slides in from
  the right behind the glass).
- **home:** the bud that fell off the envelope settles over the cream card (icing-oval portrait, names, date, venue;
  rose sprays at the two upper corners) → the invitation on cream card under the rose satin ribbon and bow (it is tied
  as it enters; the heading gets a single gold shimmer), countdown, calendar, a line of piped icing → story teaser
  (porcelain plate) → the day on the pastry paper → signature: the macaron stand drops in with a bounce, "Open it again".
- **story:** the display case — three plates on a glass shelf with gold brackets; drag/swipe, arrows, keys slide them
  along it, the plate in the middle steps forward with a slight turn (a scroll-snap row with reduced motion).
  **details:** the order of the day on cream card under piped icing, each row starting with a gold sugar pearl that
  rolls in; the pâtisserie window; G127 map; G138 blocks, travel, the menu under a little display case (macaron stand on
  the glass shelf), registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a cream card with the
  bud and a rose spray, macaron-coloured choice pills; on success sugar pearls, macarons and petals drop in.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, band, bow, untied tails) share one canvas; GPT drifted between them: the flap
  starts 4 % below the back's top edge and is ~1 % wider, the pocket stops 1.6 % short of the back's bottom, the untied
  ribbon sits 58 px (5 %) higher than the tied one. `build_images.py` cuts each to its alpha box and lays it in the
  envelope box (the back's): pocket and flap span its width (the flap hangs from the top edge, the pocket reaches the
  bottom edge), band and bows centred by their boxes, the untied ribbon moved down onto the tied ribbon's line —
  `img/manifest.json` `stage`; `site.css` uses the same numbers (tests/theme-maison-patisserie.test.ts compares them).
- The rose bud (its own canvas) is set on the knot at 11 % of the envelope's width (the prompt's 7.5 % of the canvas
  read too small on a phone). The flap lining (2.297 : 1) keeps its proportions inside the flap's box (89.22 %).
- The frames' windows came as a green rim round an already transparent (or blurred) middle; for the oval and the plate
  the window = the rim with everything it encloses (PIL flood fill, no scipy). The shop window's rim is broken by the
  roses of its window box, so its window is the box of the rim (a rectangle, as the prompt asked); the roses in front of
  the glass are kept. Green spill neutralised (`checks.green` = none).
- kit_check flagged `card_small`, `shelf` and `divider` for canvas ratio (GPT used other canvases) — harmless after the
  alpha-box crop — and `vitrine_wide` for a "missing" window (the rim-only window above).
- The card is 0.73 : 1 and 46 % of the envelope's width, so it hides behind flap and pocket while closed.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times and
  in real time). Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers measured for the previous build; `scripts/font-fallback.ts` was not re-run.
- The catalogue cover/clip (`lib/marketing/assets.json`) still shows the old build; recapture pending.
