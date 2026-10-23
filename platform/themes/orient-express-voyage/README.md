# Orient Express Voyage (25) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md` row 25, task G425, on the structure of the pilot G423). The
October 18–20 Codex build (one imagegen "ticket sleeve" object sliced in code, `envelope-v3` / `opening*` / `interior*`
files, flat interiors) was replaced: the theme now follows the pilot-39 structure (`docs/34_TEMA_HATTI_40_48.md`) and is
built from the design's own layered GPT parts, all present (PAKET 5R W1–W19, PAKET 2 photos, PAKET 6R print grounds;
`collections/25_Orient_Express_Voyage/assets/gpt/`). **Status: `preview`** (shown as "Coming soon", not on sale, no
price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a GPT part cut, keyed, scaled or masked by
`build_images.py`. No real railway's name, mark, livery or ticket is used.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the carriage window, story = the sash windows, venue = the panorama window; aspects from `img/manifest.json`), 83 editable texts (`node scripts/copy-manifest.ts --theme orient-express-voyage`) |
| `index.html` | the closed ticket sleeve (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the sleeve layers (numbers = manifest `stage`) and their keyframes, the carriage windows (windows = manifest `window_pct`, masks = manifest `mask`), the route over the map |
| `site.js` | `MOTION` (opening, scenes, route, scenery, accents), countdown, the route (`initRoute`), the scenery pan (`initScenery`), the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the luggage tag) |
| `content.demo.json` | = `collections/25_Orient_Express_Voyage/content.demo.json` (fictional Amelia & Rafael, Palazzo Ferrovia, Venice) |

Fonts (Google Fonts, never packaged): **Limelight** (names, headings) + **Cormorant Garamond** (body, small capitals
lines). The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On warm ivory antique map paper: "Together with their families" and the names, the sleeve in the middle, the date · the
city and "Tap to open" below, Skip in the corner. The sleeve is a **long (2.18 : 1) bottle-green embossed leather ticket
sleeve** with brass corners, its **end tab folded over the right end** and held by a **brass turn-lock** (a fixed plate
and a separate turn button), a **blank luggage tag** hanging on a red cord from a brass grommet. On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–1400 | the tag swings on its cord like a pendulum (±14°, damped; pivot = the grommet) |
| 450–950 | the turn button turns 90° (horizontal → upright) with a small overshoot |
| 1000–1750 | the tab swings open on its right-hand hinge (3D `rotateY`); past 90° its real inside shows (route-red silk, a brass washer) |
| 1000–2450 | the sleeve draws back to the left (10 % while the tab opens, 22 % when the ticket is out) |
| 1750–2450 | the ticket, lying sideways in the sleeve, slides out of the mouth to the right until it clears it |
| 2300 | steam, punched ticket discs and a dried rose bud drift (GPT accents, `MOTION.accents.open`) |
| 2450–3050 | the ticket turns upright as it lifts away; the sleeve sinks a little and fades (2450–3350) |
| 3050–3600 | it comes forward to the middle of the screen; lamplight sweeps over it (3150–4150) |
| 3800 | home (view transition `invite-card` → the home ticket) |

Back, ticket, front, tag, tab (outside + inside), lock plate and turn button are separate layers. The tab's faces fade
on their own (an opacity on the 3D tab itself would flatten it and show the outside mirrored). **360 px budget:** the
sleeve is 62 % of a phone's width; drawn back 22 %, with the open tab and the ticket out of the mouth, everything stays
≥ 12 px inside a 360 px screen (the test computes it from the manifest and the keyframes; checked in frames at 360 ×
740). The ticket box is sized at its final upright size and scaled to 0.409 while it lies in the sleeve, so it is
crisp when it comes forward. Reduced motion: straight to home. Without JS: the "Open the ticket sleeve" link. Opened
state (session key `invite:opened:<slug>`): tab open, ticket forward, "Enter" + "Replay the opening".

## Inner pages

- **Carriage windows** (`.frame` + `.pane`): the portrait in the mahogany and brass carriage window, the story photos in
  sliding sash windows, the venue in a wide observation-carriage window. The photo sits in the window the build measured
  and is clipped by a technical alpha mask of that rounded window (`img/mask_*.png`, CSS `mask-image`); lamplight sweeps
  over the glass as it enters.
- **home:** the ivory first-class ticket (the GPT card cut into nine parts with `border-image`, so the paper grows with
  the text; the venue sits in its punched stub; brass rack corners with dried roses at the top) → the invitation on a
  band of bottle-green leather between two brass luggage-rack rails, the numeral-free pocket watch over the countdown,
  calendar → story teaser (sash window) → the journey: the letterless map with the route drawn station by station
  (5 stations, CSS UI line), the first four stops → signature: the luggage tag swings once, the names, "Open the ticket
  again".
- **story:** three sash windows left – right – left on green leather; each leather blind (a piece of the sleeve's own
  leather) rolls up into the frame's blind, and while the page scrolls the photo slides behind the glass like passing
  scenery (`initScenery`, ±11 % of a 130 % wide photo; still with reduced motion).
- **details ("The itinerary"):** the map stays in view (sticky) while the stations of the day scroll under it, each row
  opening with a route-red station dot; the route reaches the matching share of its stations as the rows come in, the
  last one being the venue (`initRoute`); the venue slides into the panorama window from the left; G127 map; G138 blocks,
  travel, menu, registry, FAQ.
- **rsvp:** the G042 form (G051 questions, G069 guest names) on an ivory ticket card on green leather; on success
  punched discs, rose buds and a puff of steam drift.

## Build notes (GPT drift absorbed)

- The sleeve layers (back, front, tab, plate, button, tag) share one canvas (GPT drew it 1568 × 1003, not 1600 × 1100);
  a composite showed them aligned, so each is cut to its alpha box and placed by that box in the envelope box (the
  back's) — `img/manifest.json` `stage`; `site.css` uses the same numbers (tests/theme-orient-express-voyage.test.ts
  compares them). The back reaches ~6 % below the front panel; its leather rim shows there like the back of a document
  case. The tab is wider than asked (its tip at 68 % instead of 72 % of the canvas); kept as drawn.
- The tag's pivot is measured on the part (the grommet ring's rows, wider than the cord under it).
- The leather band texture is a calm patch of the front panel (inside its gold tooling), its lamplight gradient levelled
  and mirrored 2 × 2 into a seamless tile (no leather tile was requested).
- A few saturated edge pixels of the bottle-green leather read as chroma-key residue to `tema_build.yesil_gorunur`; the
  green channel is capped at max(R, B) + 34 on the sleeve layers (a handful of pixels, invisible).
- The frames' windows came as a green rim round an already transparent (blurred) middle; the window = the rim with
  everything it encloses (PIL flood fill, no scipy), cleared, the green spill neutralised (`checks.green` = none).

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright; animations sought to fixed times, and
  the opening, the story and the itinerary in real time with scrolling). Not tried on a real iPhone/Safari or Android
  Chrome.
- The frame tool (`scripts/theme-frames.cjs`) adds `.in` without the scene event, so its home map shows no route and its
  third story window keeps the blind down; in real scrolling both play (checked).
- The names fallback faces carry generic numbers (as the pilot); `scripts/font-fallback.ts` was not re-run for Limelight.
- Catalogue cover / clip (`lib/marketing/assets.json`) still show the old build; a new capture needs a production build.
