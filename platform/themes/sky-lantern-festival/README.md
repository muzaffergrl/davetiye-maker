# Sky Lantern Festival (31) — platform theme

Redesign of 2026-10-22 (`docs/35_22_32_YENIDEN_TASARIM.md`, task G431, after the pilot G423 Velvet Jewel Box). The
October 18–20 Codex build (one imagegen cover object sliced in code, `envelope-v3` / `opening*` / `interior*` files, a
"Close envelope" pill, blank reverse faces during the opening) was replaced: the theme now follows the pilot-39 structure
(`docs/34_TEMA_HATTI_40_48.md`) and is built from the design's own layered GPT parts, all present (PAKET 5R W1–W19 = 21
files, PAKET 2 photos, PAKET 6R print grounds; `collections/31_Sky_Lantern_Festival/assets/gpt/`). **Status: `preview`**
(shown as "Coming soon", not on sale, no price — `lib/marketing/config.ts`). Nothing is drawn (K21): every picture is a
GPT part cut, keyed or scaled by `build_images.py`; CSS adds only light (the lanterns' halo, the warm light that opens
each photo, a dusk wash on wide screens), motion and interface.

## Files

| File | What |
|---|---|
| `theme.json` | name, 5 pages, photo slots (hero = the paper-lantern window, story = the hanging rice-paper panels, venue = the wide bamboo panel; aspects from `img/manifest.json`), 82 editable texts (`node scripts/copy-manifest.ts --theme sky-lantern-festival`) |
| `index.html` | the closed envelope (K23 strict) |
| `home.html` · `story.html` · `details.html` · `rsvp.html` | inner pages (docs/11 §3.2) |
| `site.css` | tokens, the envelope layers (numbers = manifest `stage`) and their keyframes, the frames (windows = manifest `window_pct`, the arch by `mask_arch.png`), the scenes |
| `site.js` | `MOTION` (opening, scenes, accents), countdown, the accents of the opening and of a reply |
| `thank-you.css` | thank-you mode (G075) |
| `build_images.py` | GPT parts → `img/` (+ `img/manifest.json`, og image, favicon = the lit lantern) |
| `content.demo.json` | = `collections/31_Sky_Lantern_Festival/content.demo.json` (fictional Sophie & Daniel, The Meadowlark Terrace, Santa Barbara) |

Fonts (Google Fonts, never packaged): **Corinthia** (names, headings) + **Bellefair** (body, small-capitals lines).
The palettes (`variants`) of the old build were removed with its art; they are redone from the new parts later
(`tools/recolor_parts.py`).

## The opening (index → home)

On the dip-dyed dusk washi (W1, one full-height image as a `cover` + `fixed` ground; on wide screens the seamless violet
washi W2 with a CSS wash of the same dusk light, so the 0.46 : 1 image is never blown up): "Together with their families"
and the names, the envelope in the middle with the open flap's height free above it, the date · the city and "Tap to
open" below, Skip in the corner. The envelope is a **portrait dip-dyed dusk washi envelope with a lantern-belly flap**
and a feathered deckle edge; on it a **paper sky lantern** is tied by an **amber silk thread** to a **gold stud** on the
pocket. Before the tap the lantern flickers faintly warm now and then. On tap (`site.js MOTION.envelope` = the
`.is-opening` keyframes in `site.css`):

| ms | step |
|---|---|
| 0–700 | the lantern lights from inside: the lit GPT twin (W9) crossfades over the unlit one (W8), a CSS warm halo grows |
| 600–1300 | the silk bow loosens, the thread slides up after the lantern and fades |
| 800–2400 | the lantern rises with a gentle sway and leaves the screen upward |
| 900 / 1100 / 1300 | three far lanterns (W15) rise behind the envelope at three sizes and speeds (parallax) |
| 1700–2450 | the lantern-belly flap swings up on its top edge (3D) onto its real GPT inner face (W7, rose → amber washi) |
| 2150 | gold leaf and petals drift down, wish seeds drift up (GPT accents W18, `MOTION.accents.open`) |
| 2300–3000 | the rice-paper card rises out of the pocket |
| 3000–3450 | it comes forward |
| 3550 | home (view transition `invite-card` → the home hero card) |

Back, card, pocket, flap (outside + inside), thread, both lanterns + halo and the three far lanterns are separate
layers. No button or pill appears during the opening. Reduced motion: straight to home. Without JS: the "Open the
envelope" link. Opened state (session key `invite:opened:<slug>`): flap open, card forward, "Enter" + "Replay the
opening".

## Inner pages

- **Frames:** the portrait in the paper-lantern-silhouette frame (W12, arched window: the photo slot carries
  `mask_arch.png`, the window's own measured pixels), the story photos in hanging rice-paper panels (W13), the venue in the
  wide bamboo panel (W14). As a scene enters, a circle of warm light grows from the bottom of the window and opens the
  photo (`clip-path` + a CSS glow); the venue opens left to right.
- **home:** the lit lantern hangs small like a moon over the rice-paper card from the envelope (W11; portrait, names,
  date, venue; roses and grasses W16 at one corner) in the dusk glow → the invitation on the violet washi between two
  strings of miniature lanterns (W17), countdown, calendar → story teaser (hanging panel) → the day on a rice-paper band,
  each line with a little lantern → signature: the lit lantern, "Open it again". Far lanterns drift up slowly behind the
  page (home, story; never with reduced motion).
- **story:** three hanging panels left – right – left (three in a row on wide screens), each swaying gently on its cord.
  **details:** the order of the day on rice paper, each row's little lantern lighting in turn (`MOTION.rowStagger`); the
  venue panel; G127 map; G138 blocks, travel, menu, registry, FAQ. **rsvp:** the G042 form (G051 questions, G069 guest
  names) on a rice-paper card; on success one lit lantern is released and rises out of view while gold leaf, petals and
  wish seeds drift.

## Build notes (GPT drift absorbed)

- The envelope layers (back, pocket, flap, thread, unlit and lit lantern) share one canvas; GPT drew the flap ~7 % and the
  pocket ~2 % wider than the back. `build_images.py` cuts each to its alpha box and lays it in the envelope box (the
  back's); pocket and flap span its width — `img/manifest.json` `stage`; `site.css` uses the same numbers
  (tests/theme-sky-lantern-festival.test.ts compares them).
- GPT drew the lantern 43 % of the envelope's width (the prompt: x 36–64 % of the canvas, ~33 %), hiding the flap's
  whole belly. Both lanterns (each cut to its own box, so the lit/unlit crossfade stays registered) are laid in one box
  scaled to 34 % about their wire ring, which keeps sitting on the stud; the thread's rows above the smaller lantern's
  shoulders are dropped.
- `flap_in` came 1.49 : 1 against the flap's 1.23 : 1; it fills the flap's box (it is the 3D back face of the same box).
- The frames' windows came as a soft green rim round an already transparent middle; the window = the rim with everything
  it encloses (PIL flood fill, no scipy), cleared, the green spill neutralised (`checks.green` = none). `kit_check` flags
  `silk_thread` ("no content": it is a hair-thin thread, fine) and the aspect of `lantern_frame` / `divider` (measured,
  cut to their alpha boxes — harmless).
- The card is 0.72 : 1 and 78 % of the envelope's width; closed, it hides fully behind the pocket and the flap.

## Known limits

- Checked at 390 × 844, 360 × 740 and 1280 × 800 in a local Chromium (Playwright; animations sought to fixed times and
  in real time). Not tried on a real iPhone/Safari or Android Chrome.
- The names fallback faces carry the numbers of the template build; `scripts/font-fallback.ts` was not re-run for
  Corinthia.
- The catalogue card (`lib/marketing/assets.json`, `public/marketing/`) still shows the old cover/clip: a new capture
  needs a production build (integrator).
