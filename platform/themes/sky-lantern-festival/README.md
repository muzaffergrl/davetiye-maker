# Sky Lantern Festival (31)

A dusk sky from deep violet through dusky rose to an amber horizon, rice-paper lanterns and their warm light. New design of
the second 29–32 wave (docs/24 row 31, G170), built **before its GPT parts exist**. Status: **coming**
(`lib/marketing/config.ts`) — sale and price wait for the real parts and approval.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1..3` 3:4, `venue` 16:9), 86 copy keys (`node scripts/copy-manifest.ts --theme sky-lantern-festival`) |
| `content.demo.json` | = `collections/31_Sky_Lantern_Festival/content.demo.json` (fictional Sophie & Daniel, The Meadowlark Terrace, Santa Barbara, California, September 18, 2027; all URLs `null`; no sample photos until PAKET 2) |
| `index.html` … `rsvp.html` | lantern · home · story (lantern trail) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes, the halo, the "kindle" photo light, drifting lanterns / thank-you mode (G075) |
| `site.js` | `MOTION` (lift-off steps, scenes, stagger), long names, scenes, countdown (`data-target-utc` from the platform), the lantern, gallery viewer, the reply's lantern |
| `build_images.py` | GPT pixels → `img/` (each PAKET 5 part as soon as it exists, else its interim cut; placeholders, og, favicon, `manifest.json`) and the generated `@gpt-layers` block at the end of `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Santa Barbara), G138
blocks (`data-blocks`, `data-travel`, `data-menu`), music + opening sounds (`lib/audio/catalog.ts`: First Light; tap 0 · paper
700 · whoosh 900 · slide 2000 · chime 3200 ms), calendar, thank-you mode, editable texts, languages (G144: the only new site
texts "Under the evening sky" and "Light the lantern again" are in the four site dictionaries). Fonts: Gilda Display (headings,
body, capitals) and Corinthia (names, the "&", a few script lines) — Google Fonts, no font files; neither is used by the
other 28 designs. Printable invitation (G139): `lib/print/layouts.ts` `composed` (cotton paper + the theme's dusk band and one
lantern) until PAKET 6.

## Opening (docs/24 row 31 — a lantern lift-off)

Tap → kicker, names and date drift up and away (0–500 ms) → the lantern **kindles**: the lit layer opens over the dark one
(0–600) while its borderless halo blooms (0–1200) → the hands open and sink away (700–1600, GPT only) → the lantern **rises**
out of the top of the screen with a slow sway (`translate` + `scale` .6, `rotate` ±2.5°, 900–3100) → **parallax**: the sky slides
down 7 % and the star dust 16 % at the same time (900–3500), three distant lanterns rise past at their own sizes and speeds
(1000 / 1260 / 1520 ms, 2.4 s each) → in the light the lantern leaves, the rice-paper card (portrait, "Our wedding", names,
date) **glows** into view (brightness 1.7 → 1, blur → sharp, 2000–3100) → forward (3200–3600) → home (3700, view transition
`invite-card` onto the home card). Sky, star dust, distant lanterns, hands, the lantern (dark + lit), halo and card are
separate layers; the hands and the two lantern layers share one 2:3 canvas (`stage.lantern_box_pct`; the halo is centred on
the lantern at y 47 %). Idle: the unlit lantern bobs a little in the hands.

**GPT branch:** `build_images.py` uses every PAKET 5 part that is in `collections/31_Sky_Lantern_Festival/assets/gpt/parts/`
(part by part; a missing one keeps its interim cut) and gives the pages the same file names: the three scene layers scaled
whole to 800×1200 (registered, no crop), the sky to 1080×1920 + a 16:9 band, the distant lantern alpha-cropped to 144×216,
the card to 878×1254 with its #00FF00 window keyed out (the portrait sits behind the card, so the window is GPT's own
outline), the rice-paper mat and the landscape frame with their windows keyed and measured. Measured numbers (card window,
text padding, `free_zone`, frame windows, file names of the GPT-only layers) go to `img/manifest.json` and to the generated
block at the end of `site.css` — never edit that block by hand; `tests/theme-sky-lantern-festival.test.ts` checks block =
manifest. GPT-only layers sit in the pages but stay hidden until the block switches them on: the hands, the star dust (index
and home hero), the divider (home invitation, details) and the paper mats (story and home photos) and venue frame. Dry run
without the real parts: `python3 tools/gpt_kuru_deneme.py --tema sky-lantern-festival --sekil
collections/31_Sky_Lantern_Festival/assets/gpt/kuru_sekil.json`.

**Interim pieces (K21: cut, toned, scaled, placed — nothing drawn):** no GPT part of this design exists yet. `build_images.py`
tones 02 Dusty Blue's seamless watercolor wash row by row (deep violet → mauve → rose → amber) into the dusk sky and once more
into the deep violet page ground, and cuts 18 Wildflower Vellum's plain cotton paper into the lantern (a tall rectangle,
dusky rose unlit and glowing amber lit), the distant lantern (the same amber paper, small) and the card (warm rice-paper
ivory). The lantern is a plain paper rectangle until `lantern_dark` / `lantern_lit` arrive; the CSS adds only light (halo,
drop-shadow glow). The real parts (`hands`, `lantern_dark`, `lantern_lit`, `sky_dusk`, `star_dust`, `lantern_far`,
`card_small`, `bg_tile`, `frame_paper`, `frame_landscape`, `divider`, `web_hero`), PAKET 2 photos and PAKET 6 print grounds
are ordered in `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md`.

## Motion signature (docs/24)

- **Lantern lift-off** with parallax layers (above).
- **Warm halo:** `.halo` — a borderless radial light (docs/11 §5.7) that breathes slowly (6 s, opacity + scale only) on index,
  home and RSVP; blooms on the tap, brightens once more when an RSVP reply is sent, and one lantern is released up the screen
  (`site.js` `releaseLantern`, `.accent-layer`).
- **Lanterns drifting as you scroll:** `.drift` on home and story — two to four small lanterns (GPT pixels) in a fixed layer
  behind the content, moved by `animation-timeline: scroll(root)` where supported (still elsewhere). Few and light; gone with
  reduced motion.
- **Photos in the light of rising lanterns:** preset `kindle` — a photo waits in the dark; when its scene plays a small lantern
  (`.riser`) rises past it and a soft circle of light grows up from the bottom edge (a registered `--r` drives a radial mask),
  with a warm afterglow (screen blend) that fades. One photo every 320 ms (`MOTION.stagger`). Also the venue photo.
- **Programme lanterns:** each schedule row on Details carries a small lantern that kindles (brightness + glow) as its row
  rises in, one after another.

## Pages

- **Home:** the rice-paper card in the dusk sky (portrait, "Our wedding", names in Corinthia, weekday + date, venue · city) = the
  view-transition target; the invitation in ivory and amber on the evening wall (host line, full names with display-name
  fallback, "request the pleasure of your company…", date block, venue, ceremony time, RSVP, deadline), countdown (plain
  numerals), calendar; three photos kindled by rising lanterns (the gallery teaser); the dusk band with the first four
  programme rows; signature + "Light the lantern again".
- **Story:** three 3:4 photos on a lantern trail — left, right, left on a phone; three side by side (the middle one higher) on
  wide screens. Captions, native `<dialog>` viewer (arrows, Escape).
- **Details:** date heading, programme with a lantern per row (amber times, no rule or dots), ceremony sentence, calendar,
  venue photo (kindle preset), map, dress code, G138 blocks, travel, menu, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** lantern halo, the reply panel (translucent, no frame), shared form; "Replay the opening".

## Deviations / limits

- No W1 comps (designed in code from docs/24, not from PAKET 5) → no comp map; `theme-check --compare none`.
- Photo frames are plain rectangles until `frame_paper.png` / `frame_landscape.png` arrive; then the photo sits behind the
  rice-paper mat in its measured window.
- Without `hands.png` the lantern floats on its own in the sky; the "held in cupped hands" moment needs the GPT part.
- Long names on a short phone: `site.js` `fitStage` shrinks the stage until "Tap to open" is on screen.
- Printable invitation: composed (paper + sky band + one lantern) until PAKET 6 `print_front` / `print_back` (one 1819×2551
  ground per side for both sizes) arrive — that switch is a hand edit of `lib/print/layouts.ts` + the G149 measurement
  (GPT_PROMPTS.md).
- `DEV_CONTENT` / `devRender` are not in `site.js` (as in 21–28): the theme is previewed through the platform demo route.
- theme-check warns "Google font not loaded (Corinthia)" on pages where no script text is on screen yet (the font loads on
  first use) — not an error.

## Not tried

Real iPhone / Android, Safari / Firefox, Vercel deployment, real buyer photos, slow network, the GPT parts themselves.
