# Grand Theatre Premiere (24)

Opening night: a peacock velvet curtain under antique gold, a spotlight and an ivory theatre programme. New design wave
23–28 (`docs/24_YENI_TASARIMLAR.md`, task G162). Status: **coming** (`lib/marketing/config.ts`) — built **before** its
GPT parts: the theme runs on interim pieces (below) until PAKET 5 / 2 / 6 arrive
(`collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md`). Sale and price wait for the parts and approval.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` 4:5, `venue` 3:2), 88 copy keys (`node scripts/copy-manifest.ts --theme grand-theatre-premiere`); design keys with a label: `home_intro`, `home_location`, `countdown_title`, `act_label`, `scene_label`, `stub_admit` |
| `content.demo.json` | = `collections/24_Grand_Theatre_Premiere/content.demo.json` (fictional Charlotte & Theodore, The Larkmont Grand Theatre, Richmond, Virginia; all URLs `null`; no sample photos yet — PAKET 2) |
| `index.html` … `rsvp.html` | curtain · home · story (intermission) · details (the programme) · RSVP (the ticket) |
| `site.css` / `thank-you.css` | tokens, layout, the curtain keyframes, the spotlight, the page turn, the ticket / thank-you mode (G075) |
| `site.js` | `MOTION` (curtain steps, scenes), long names, scenes, countdown (`data-target-utc` from the platform), curtain, story spotlight, ticket stub |
| `build_images.py` | GPT parts (when present, measured) or interim pieces → stage layers, grounds, placeholders, og, favicon, `img/manifest.json`, and the `/* stage:begin … stage:end */` geometry block of `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Richmond),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; tap 0 · whoosh 400 · slide 2000 · chime 2900 ms),
calendar, thank-you mode, editable texts, Details blocks / travel / menu (G138), languages (G144: every design text is
in the tr/es/de/fr site dictionaries), printable invitation (G139: `lib/print/layouts.ts`, composed). Fonts: Abril
Fatface (names, headings) + Playfair Display (text) — Google Fonts, both with latin-ext; no font files.

## Opening (the closed object is a curtain, not an envelope)

Tap → both curtain panels draw a breath toward the seam (`tug` 0–300 ms) while the heading rises away and the house
lights dim around the stage (`house` 100–800) → the left panel parts, gathering toward its outer edge with heavy folds
(scaleX to the gathered width, a small skew, overshoot and settle: `partL` 400–1850), the right panel a beat later
(`partR` 540–1990) → the spotlight comes on in the left wing and sweeps across the stage (`spot` 1100–2600) → the
panels hand over to their gathered swags (`gather` 1700–2000), which sway and settle (`sway` 2000–3400) → the programme
card standing on the stage is lit (`rise` 2000–2900) → steps downstage over the arch (`forward` 2900–3350) → home
(3450, view transition `invite-card` onto the home playbill card). Back wall, each panel, each swag, the valance /
arch, the spotlight and the card are separate layers on one canvas (manifest `stage`). Reduced motion: straight to
home. Measured tap → home: see `gorevler/G162-grand-theatre.md`.

## Pages

- **Home:** the open stage (the same layers, swags gathered) fills the first screen; the programme card stands in the
  footlights with "Our wedding", the names, the date and the city (the opening's card lands on it). Then the programme
  sheet (ivory paper): the portrait, "A love story in two acts", full names with display-name fallback, the date block,
  "Curtain up at", the venue, RSVP + deadline, the countdown "Curtain up in" (plain numerals), calendar. Intermission
  teaser (story_1), "Tonight's Programme" (first four rows as Act I–IV), signature + "Raise the curtain again".
- **Story (intermission):** three photo cards stand at staggered marks on a dark velvet stage (left, right, left; three
  across on wide screens), "Scene I–III" + caption. A spotlight (soft radial light over the stage, `@property --sx/--sy`)
  rests on Scene I; a tap / click / keyboard focus moves it to that card and lifts it (`aria-pressed`), a mouse drags
  the light, a touch on the empty stage moves it there. Reduced motion: no mask, everything lit.
- **Details (the programme):** the evening as acts on the ivory sheet (Act I, II … X — the numeral is a CSS counter,
  "Act" is the `act_label` copy key; time, label, place; 1–10 rows), ceremony sentence ("The curtain rises on the
  ceremony at"), calendar; the venue (3:2 photo, map); dress code, blocks, travel, menu, registry, FAQ.
- **RSVP (the ticket):** "Reserve your seat"; the shared form on the ticket's ivory body; below the perforation the stub
  ("Admit one", names, date — `aria-hidden`, the heading carries them). On `rsvp:state` "success" the stub tears off
  (a tug, the rip runs across, it drops away); "Send another reply" (`ready`) puts it back.
- **Page turn:** between home, story, details and rsvp the page turns like a programme leaf: each inner page's `<head>`
  script listens for `pagereveal` and adds the view-transition type `turn-next` / `turn-prev` from the page order
  (Navigation API `activation.from`); `site.css` turns the old page away on its left edge (forward) or brings the new
  one back over it (back). Without cross-document view transitions the new page settles in (`turn-fallback`).

Nav: fixed bottom bar (the platform's sound button sits top-left).

## Interim pieces (K21: cut / toned / mirrored from GPT pixels, nothing drawn)

| Theme file | Interim source | Replaced by (GPT_PROMPTS.md) |
|---|---|---|
| `curtain_l`, `curtain_r` | `06_Art_Deco_Noir/parts/bg_tile.png` (navy velvet), toned to peacock (duotone of its own luminance), two different crops | W2.2 `curtain_left.png`, W2.3 `curtain_right.png` |
| `curtain_gl`, `curtain_gr` | the closed panel scaled to the gathered width (.34) | W2.4 `curtain_left_open.png`, W2.5 `curtain_right_open.png` (swags, tiebacks, tassels) |
| `th_arch` | a deeper velvet band across the top of the opening | W2.1 `proscenium.png` (gilded arch + valance, #00FF00 opening) |
| `th_back` | the velvet blurred and darkened | W2.6 `stage_back.png` |
| `card_paper` | `21_Crimson_Rose_Atelier/textures/paper-background.png`, toned to playbill ivory | W2.7 `card_small.png` (#00FF00 window) |
| `card_plain` (home's card) | the same paper card | W2.7b `card_plain.png` (no window) |
| `paper`, `stub_paper` | the same paper | W2.9 `playbill_tile.png`, W2.10 `ticket_stub.png` |
| `velvet`, `room` | the velvet, mirrored 2×2 (seamless) / blurred and darkened | W2.8 `velvet_tile.png`, W2.11 `bg_page.png` |
| `ph_portrait`, `ph_land` | the velvet, soft and toned | built from W2.11 `bg_page.png` |
| `og-1200x630.jpg`, `favicon.png` | assembled from the velvet and the paper | W2.13 `web_hero.png` (og), W2.12 `tassel.png` (favicon) |

The interim stage reads as flat velvet blocks: no folds, no fringe, no gold. That is the honest state until the parts
arrive; the motion, the layering and every page contract are final. When the PAKET 5 files arrive, `build_images.py`
switches to them by itself (same output names): the stage as a set once `proscenium` + `curtain_left` + `curtain_right`
exist, every other piece on its own. The stage box, the curtain origins, the gathered width, the swag pivots, the card
box and its photo window, home's card proportion and the stub proportion are measured from the parts' alpha boxes and
#00FF00 windows (`tools/parts_prep.py`) and written to `img/manifest.json` → `stage` (`stage.css`) and to the
`/* stage:begin … stage:end */` block of `site.css` (CSS custom properties the stage rules and keyframes read) — no
percentage is copied by hand (`tests/theme-grand-theatre-premiere.test.ts` pins block = manifest). `manifest.sources` /
`waiting_for_gpt` say which pieces are still stand-ins. Drop-in rehearsal: `python3 tools/gpt_kuru_deneme.py --tema
grand-theatre-premiere --sekil collections/24_Grand_Theatre_Premiere/assets/gpt/kuru_sekil.json`.

## Deviations from the standard (docs/11)

- The closed object is a curtain (docs/24: "zarf şart değil"): the envelope keys of `MOTION.envelope` become
  `tug, house, partL, partR, spot, gather, sway, rise, forward` (+ `hint, head, go, fadeOut`); the CSS keyframes use
  the same numbers (test).
- No W1 comps (wave 23–28 builds before GPT) → no comp map; `theme-check --compare none`.
- No `DEV_CONTENT` in `site.js` (as Nocturne): the static-file preview without the platform is not used; the demo route
  serves the theme.
- The perforation of the interim stub is a 1 px dashed rule (interface line); the GPT stub brings its punched holes.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the page turn in Safari 18 (cross-document
view transition types) — measured in Chromium only.
