# Kintsugi & Washi (26) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, task G426, on the pilot G423's structure). The October
18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, flaps that
turned into flat black-edged panels, a busy floral cover) was replaced: the theme now follows the pilot-39 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W24,
PAKET 2 photos, PAKET 6R print grounds; `collections/26_Kintsugi_Washi/assets/gpt/`). **Status: `preview`** (shown as
"Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a GPT part
cut, keyed, mirrored or scaled by `build_images.py`. No kanji or kana anywhere; all text is English HTML.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the indigo washi portrait mat, story 1/3 = the rice-paper mat, story 2 = the wide mat, venue = the wide torn indigo washi; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme kintsugi-washi`) |
| `index.html` | the closed packet (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the packet layers (numbers = manifest `stage`) and their keyframes, the washi mats (windows = manifest `window_pct`), the ink-bloom reveal |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the porcelain button) |
| `content.demo.json` | = `collections/26_Kintsugi_Washi/content.demo.json` (fictional Naomi & Kai, Stillwater Garden Pavilion, Hood River) |

Fonts (Google Fonts, never packaged): **Allura** (names, headings) + **Shippori Mincho** (body, small capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later.

## The opening (index → home)

On undyed rice-ivory washi: "Together with their families" and the names, the packet in the middle, the date · the city
and "Tap to open" below, Skip in the corner, a small white plum sprig (mirrored) under it. The packet is a **square tatō
of indigo-dyed washi** crossed by gold kintsugi seams — **four triangular flaps** in a pinwheel — tied by a **twisted
gold-and-ivory cord** whose ends loop in a figure-eight round a **kintsugi-mended porcelain button**. On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–1100 | the button turns half a turn (the cord's loops come free), then lifts away toward the viewer and fades |
| 200–1000 | the cord unwinds: it slackens, turns a little and slides off to the right, fading |
| 700–1600 | the stage settles back to .52 — open, the packet is about twice as wide and stays on a 360 px screen |
| 950 · 1170 · 1390 · 1610 (+650) | the north, east, south and west flaps unfold one by one (pinwheel order, 220 ms apart), each in 3D on its own hinge — its base edge on the square — onto its real GPT inner face (gold-flecked undyed washi) |
| 2050 | gold-leaf flakes, indigo ink drops (they land and spread) and plum petals drift down (`MOTION.accents.open`) |
| 2250–2950 | the rice-paper card rises from the centre toward the viewer (no pocket); light sweeps over it (2350–3350) |
| 2950–3350 | it comes forward |
| 3450 | home (view transition `invite-card` → the home hero card) |

Floor, card, each flap (outside + inside, the inside sharing the outside's box exactly and turned over the hinge by the
CSS reflection), cord and button are separate layers. While closed, light runs along the gold seams of two flaps (a sweep
masked by each flap's own alpha) and the glaze of the button glints. Reduced motion: straight to home. Without JS: the
"Open the invitation" link. Opened state (session key `invite:opened:<slug>`): flaps open round the floor, card forward,
"Enter" + "Replay the opening".

## Inner pages

- **Washi mats** (`.frame.inked`): the portrait in the torn indigo washi mat, the story photos in torn rice-paper mats
  washed with indigo (the landscape story photo in the wide one), the venue in wide torn indigo washi. The photo sits in
  the window the build measured; as the scene enters it appears through a spreading **sumi ink bloom** — the GPT
  `ink_bloom` as a CSS `mask-image` growing from 0 to 340 % — then light runs along the mat's gold seam (masked by the
  mat's alpha).
- **home:** the deckled rice-paper card from the packet (plum sprig at its corner; portrait, names, date, venue) → the
  invitation on rice-paper card stock between two gold kintsugi seams (the heading gets a single gold-leaf shimmer),
  countdown, calendar → story teaser (rice-paper mat) → the day on washi → signature: the mended tea bowl (light runs
  over its gold), "Open it again".
- **story:** three moments, left – right – left (side by side with the caption from 760 px); each mat is laid down
  from its side, the photo blooms in, then the caption. **details:** the order of the day on rice paper under a gold
  seam, each row starting with a flake of gold leaf that turns in; the venue mat; G127 map; G138 blocks, travel, menu,
  registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest names) on a rice-paper card with a plum sprig; on
  success gold leaf, ink drops and petals drift down and light runs over the tea bowl.

## Build notes (GPT drift absorbed)

- The packet layers (floor, four flaps, cord) share one canvas; GPT drifted 1–3 % between them (the east flap runs 3 %
  below the floor, the west flap starts 2 % right of it). `build_images.py` cuts each to its alpha box and lays it in
  the packet box (the floor's): every flap keeps its hinge on its own edge and spans it, its depth to its point is
  measured — `img/manifest.json` `stage`; `site.css` uses the same numbers (`tests/theme-kintsugi-washi.test.ts`
  compares them). The points really are a pinwheel (north 59.6 / 62.3 %, east 37.5 / 56.4 %, south 42.4 / 46.9 %,
  west 64.7 / 47.9 % of the packet).
- The button (its own canvas) is centred on the empty circle the cord's figure-eight leaves (measured: the transparent
  hole the cord encloses round its middle) at 1.14 × its diameter, so the cord's ring wraps its rim.
- The south inner face came with its point 10 % off the outside's; it is mirrored left–right (its point then lands
  5 % from the outside's, invisible because the faces swap edge-on at 90°). The other three match within 3 %.
- Windows: the portrait and story mats have a green rim round a transparent middle (window = rim + what it encloses,
  PIL flood fill, no scipy); the venue mat came **without green** (kit_check failed it) — its window is the transparent
  hole the mat encloses. The wide story window is 1.54 : 1 (asked 5 : 4) and the venue window 2.03 : 1 (asked 16 : 9):
  the photo aspects in `theme.json` follow the measured windows. `checks.green` = none.
- `divider.png` came on a 1983×793 canvas (asked 1600×200): the alpha-box crop gives the seam its own 8.3 : 1 shape.
- `env_back_v1.png` (an earlier attempt) is not used.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times and in
  real time). Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers of the previous build; `scripts/font-fallback.ts` was not re-run for Allura.
- Catalogue cover/clip (`lib/marketing/assets.json`) still show the old build; a new capture needs a production build.
