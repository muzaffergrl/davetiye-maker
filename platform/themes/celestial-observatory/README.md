# Celestial Observatory (29) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, task G429, on the structure of the G423 pilot). The October
17–20 builds (the G168 interim theme and the Codex `envelope-v3` / `opening*` / `interior*` files: one imagegen cover object
sliced in code, blank reverse faces during the opening, palettes `variants.css`) were replaced: the theme now follows the
pilot-39 structure (`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present
(PAKET 5R W1–W18, PAKET 2 photos, PAKET 6R print grounds; `collections/29_Celestial_Observatory/assets/gpt/`).
**Status: `preview`** (shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn
(K21): every picture is a GPT part cut, keyed or scaled by `build_images.py`; CSS adds only light, masks, motion and
interface.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the round window of the gilded celestial medallion, story = the round planisphere rings, venue = the wide star-chart panel; aspects from `img/manifest.json`), 83 editable texts (`node scripts/copy-manifest.ts --theme celestial-observatory`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the instruments (windows = manifest `window_pct`, dial = `dial.box_pct`), the dial-sweep mask and the telescope beam |
| `site.js` | `MOTION` (opening, scenes, turning instruments, accents), countdown, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the astrolabe) |
| `content.demo.json` | = `collections/29_Celestial_Observatory/content.demo.json` (fictional Celeste & Rowan, Starlight Ridge Observatory Gardens, Flagstaff) |

Fonts (Google Fonts, never packaged): **Imperial Script** (names, headings) + **Forum** (body, small capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On midnight-blue cotton paper with a faint engraved star chart (a soft moonlight glow behind the envelope, one gold
constellation corner bottom left): "Together with their families" and the names, the envelope in the middle with room
above it for the dome, the date · the city and "Tap to open" below, Skip in the corner. The envelope is a **portrait
midnight-blue envelope** (0.74 : 1) with a **half-circle dome flap** engraved in gold foil, a **dome window** cut in the
pocket, an **antique star-atlas lining**, and a **brass astrolabe** at the flap's tip as its closure: the fixed plate and
the lace-like rete, two parts turning about one pin. On tap (`site.js MOTION.envelope` = the `.is-opening` keyframes in
`site.css`):

| ms | step |
|---|---|
| 0–1100 | the rete turns 120° about the pin; light runs over its brass (100–1100, masked by the rete's own alpha) |
| 500–1370 | its six star tips glint one after another (CSS light, 70 ms apart; the glints sit on the rete and turn with it) |
| 1150–2400 | the astrolabe lifts off the flap's tip and floats up into the night, smaller, fading before the names |
| 1650–2450 | the dome flap swings up on its top edge (3D); past 90° its real inside (GPT W6) shows: an observatory dome standing over the envelope; the star-atlas lining shows in the dome window |
| 2150 | gold stars light up one by one round the envelope, star dust twinkles, a crescent drifts over the dome (GPT accents, `MOTION.accents.open`) |
| 2300–3000 | the card rises from behind the pocket; moonlight passes over it (2400–3500) |
| 3000–3450 | it comes forward |
| 3550 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + inside), plate and rete are separate layers. No button during the opening (Esc and
Skip go straight to home). Reduced motion: straight to home. Without JS: the "Open the envelope" link. Opened state
(session key `invite:opened:<slug>`): dome up, card forward, "Enter" + "Replay the opening".

## Inner pages

- **Instruments:** the portrait in the gilded celestial medallion (sunburst), the story photos in brass planisphere rings
  with their own turning dial ring (GPT W12 over W11, same centre), the venue in a wide brass-framed star-chart panel. The
  photo sits in the window the build measured (round windows clipped with `border-radius:50%`). As the scene enters, the
  ring settles and the photo is uncovered by a **dial sweep** — a conic-gradient mask whose angle (`@property --sweep`)
  turns once round the centre; the venue photo opens from left to right like a **telescope beam** (clip-path + a band of
  light). The dials turn as the page scrolls (alternate rings the other way), and so does the rete of the small
  astrolabe over the home card (`initTurns`, off with reduced motion).
- **home:** the small astrolabe (it floated off the envelope) over the card from the envelope (GPT W9: chart paper, gold
  double rule, crescent) with the medallion portrait, names, date, venue; gold constellation corners at the top of the
  night → the invitation ("Written in the stars") between two rows of gold moon phases, countdown, calendar → story
  teaser (planisphere ring) → the day on a chart-paper band → signature: the brass telescope, the names, "Open the
  envelope again".
- **story:** three moments left, right, left, each in a planisphere ring with its caption. **details:** the order of the
  day on chart paper under the moon phases, each row opening with a gold star that lights up; the venue panel with the
  telescope beside its heading; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051
  questions, G069 guest names) on a chart-paper card with a constellation corner; on success gold star dust and stars rise
  and fade.

## Build notes (GPT drift absorbed)

- The envelope layers share one canvas but drifted: the pocket rises ~1 % above the back and ends ~1.7 % short of its
  bottom; the flap is 3.7 % wider than the back and its hinge sits 43 px below the back's top. `build_images.py` cuts
  each to its alpha box and lays it in the envelope box (the back's): the pocket spans it; the flap is scaled uniformly
  to its width with the hinge on the top edge (the half circle keeps its shape). The closed still is checked: no lining
  shows between the pocket's cut and the flap (`checks.closed_gap_px` = 0). The inside of the flap keeps its own ratio
  (93.53 % of the flap box) so the dome is not stretched.
- The rete's circle sat 54 px above the plate's disc and was drawn 96 % of its size (over the tick ring). Both are fitted
  as circles (least squares on the alpha outline); the rete is cut to a square round its own centre — so a CSS rotation
  turns it exactly about the pin — scaled to 0.86 × the disc radius (inside the limb) and centred on the disc. The same
  fit centres the planisphere dial on its frame.
- The frames' windows came as a green rim round a half-transparent middle; the window = the rim with everything it
  encloses (PIL flood fill, no scipy), cleared, the green spill neutralised (`checks.green` = none).
- The divider canvas was 1983×793 instead of 1600×200 and accent_3 (star dust) is sparse (kit_check flags both); the
  alpha-box crop absorbs both — the parts themselves are right.

## Known limits

- Checked at 390 × 844 and 360 × 740 in a local Chromium (Playwright, animations sought to fixed times and in real
  time). Not tried on a real iPhone/Safari or Android Chrome. The dial sweep needs `@property` (Safari 16.4+, Firefox
  128+); without it the photo appears at once at the end of the sweep.
- The names fallback faces carry the numbers measured for Pinyon Script in an earlier build; `scripts/font-fallback.ts`
  was not re-run for Imperial Script.
- The catalogue card (`lib/marketing/assets.json`, listing shots) still shows the old cover until it is recaptured
  (production build needed; not part of this task).
