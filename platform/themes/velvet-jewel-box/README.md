# Velvet Jewel Box (23) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, pilot task G423). The October 18–20 Codex build (one
imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, blank reverse faces during the
opening) was replaced: the theme now follows the pilot-39 structure (`docs/34_TEMA_HATTI_40_48.md`) and is built from
the design's own layered GPT parts, all present (PAKET 5R W1–W18, PAKET 2 photos, PAKET 6R print grounds;
`collections/23_Velvet_Jewel_Box/assets/gpt/`). **Status: `preview`** (shown as "Coming soon", not on sale, no price —
`lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the oval cameo, story = the oval tray settings, venue = the wide frame; aspects from `img/manifest.json`), 85 editable texts (`node scripts/copy-manifest.ts --theme velvet-jewel-box`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the jewel settings (windows = manifest `window_pct`), the turning display |
| `site.js` | `MOTION` (opening, scenes, carousel, accents), countdown, the turning display, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the ring) |
| `content.demo.json` | = `collections/23_Velvet_Jewel_Box/content.demo.json` (fictional Isabelle & Julian, Halvern House, New York) |

Fonts (Google Fonts, never packaged): **Pinyon Script** (names, headings) + **Bodoni Moda** (body, small capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On champagne silk moiré: "Together with their families" and the names, the envelope in the middle, the date · the city
and "Tap to open" below, Skip in the corner. The envelope is a **square aubergine silk-velvet envelope with a
three-lobed flap**, wrapped by a **champagne satin band** with a **rose gold solitaire** threaded on it. On tap
(`site.js MOTION.envelope` = the `.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–520 | the diamond catches the light (a CSS flare on the stone) |
| 180–1280 | the ring slides up off the band and floats away over the envelope |
| 700–1350 | the band parts at its knot: the upper half is drawn back over the top edge, the lower half under the bottom edge |
| 1250–1950 | the lobed flap swings up on its top edge (3D) onto its champagne satin lining with a seed-pearl edge |
| 1650 | pearls, petals and tiny diamonds drift down (GPT accents, `MOTION.accents.open`) |
| 1850–2500 | the card rises out of the pocket; light sweeps over it (1950–3050) |
| 2500–2900 | it comes forward |
| 3000 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + lining), each half of the band (one GPT image cut at its measured knot) and the ring
are separate layers. Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state (session
key `invite:opened:<slug>`): flap open, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Jewel settings** (`.frame.jewel`): the portrait in the oval rose gold and pearl cameo, the story photos in the oval
  settings of a velvet ring tray, the venue in a wide pearl-edged frame. The photo sits in the window the build measured
  (oval windows clipped with `border-radius:50%`); as the scene enters, the setting settles and light sweeps over it.
- **home:** the ring hangs small over the ivory card (cameo portrait, names, date, venue; ribbon-and-pearl sprays at the
  two upper corners) → the invitation on a band of aubergine velvet between two strands of seed pearls (the heading gets
  a single gold-leaf shimmer), countdown, calendar → story teaser (tray setting) → the day on an ivory band → signature:
  the open ring box, the ring drops into it, "Open it again".
- **story:** the turning display — three tray settings on a 3D cylinder (drag/swipe, arrows, keys, snaps to the nearest;
  a scroll-snap row with reduced motion). **details:** the order of the day on ivory under a strand of pearls, each row
  starting with a pearl that rolls in; the venue frame; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the
  G042 form (G051 questions, G069 guest names) on an ivory card laid on velvet; on success pearls, petals and diamonds
  drift down.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, band) share one canvas; GPT drew the pocket and the flap ~2 % wider than the
  back. `build_images.py` cuts each to its alpha box and lays it in the envelope box (the back's); pocket and flap span
  its width — `img/manifest.json` `stage`; `site.css` uses the same numbers (tests/theme-velvet-jewel-box.test.ts
  compares them). The band is cut at its knot (the widest rows of its middle third). The ring (its own canvas) is scaled
  to 21 % of the envelope's width and set on the band just above the knot.
- The frames' windows came as a green rim round an already transparent middle; the window = the rim with everything it
  encloses (PIL flood fill, no scipy), cleared, the green spill neutralised (`checks.green` = none).
- The card is 0.74 : 1 and 61 % of the envelope's width, so it stays inside the pocket.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright, animations sought to fixed times and in
  real time). Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers measured for Pinyon Script in the previous build; `scripts/font-fallback.ts`
  was not re-run.
