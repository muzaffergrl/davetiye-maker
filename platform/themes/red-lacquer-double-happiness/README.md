# Red Lacquer & Double Happiness (34)

A tall red paper envelope with a gold-leaf 囍, closed with a red cord wound round two paper buttons; paper-cut peonies,
red lacquer, gold clouds and round moon gates. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, task G183,
K23 strict: the first page is a closed envelope). Status: **coming** (`lib/marketing/config.ts`) — the design's own GPT
parts do not exist yet; sale, price and approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` round 1:1, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme red-lacquer-double-happiness`) |
| `content.demo.json` | = `collections/34_Red_Lacquer_Double_Happiness/content.demo.json` (fictional Mei & Julian, The Peony Court Garden House, Vancouver, British Columbia; September 25, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the moon gate doors, the unfolding text / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, cloud drift, accents), long names, card fit, scenes, paper-cut parallax (`data-depth`), clouds, countdown, opening, the interim 囍 font switch |
| `build_images.py` | GPT textures → `img/` (interim toning, gold crop, placeholders, og montage, favicon, `manifest.json`); every optional GPT part that exists → `img/` + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): rules for the optional GPT parts present in `parts/`; a comment only while none exists. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Vancouver),
music + opening sounds (`lib/audio/catalog.ts`: First Light; cord 0 · flap 900 · card 1500 · red window 2150 · gold window
2550 · forward 3150 ms), calendar, thank-you mode, editable texts, languages (G144; three new strings, "Double happiness",
"Open the envelope", "Together with their families", translated in `lib/i18n/dict/site/*`). Fonts: Luxurious Script
(names, headings) + Prata (body, capitals) — Google Fonts, no font files; neither is used by 01–32. docs/24 suggested
Noto Serif Display, which 15 Cherry Blossom already uses. Ma Shan Zheng is loaded on the envelope page only, for the one
character 囍 (see below).

## Opening — the cord unwinds, the paper-cut windows open

Layout as the catalogue cover (K23): "Together with their families" and the names above, the envelope in the middle, the
date · city and "Tap to open" under it, Skip in the corner. Tap → the heading and the date move away (0–450 ms) → the
**flap button turns round twice as the cord unwinds**, the body button turns back a little (0–900) → the **cord slips off
and falls** (450–1050; GPT `string`) → the **flap lifts on its fold** (rotateX 180°, its inside face shows; 900–1550) →
the **card comes up** out of the envelope still wrapped in two paper-cut windows (1500–2200) → the **red window opens**:
its two halves swing out on their outer edges like shutters (2150–2750) → then the **gold window** under it (2550–3150) →
gold clouds drift across (from 1200; GPT sprites) → the card comes forward while the envelope sinks away (3150–3600) →
home at 3700 ms (view transition `invite-card` onto the home card). Back, pocket, 囍, flap (two faces), the two buttons,
cord, both window layers (four halves), card and clouds are separate layers; nothing is one picture that fades. Not the
01–32 envelope: no V flap, no wax seal; the closure is a cord and buttons, the object is tall, and it opens through
paper-cut layers.

Reduced motion: no opening (tap → home), no gloss, no tap-hint breathing, no doors, no clouds, no parallax, no swaying.

## Pages

- **Home:** two paper-cut layers (GPT) moving at two speeds behind the cream card, gold clouds drifting; the round portrait
  in its moon gate, uncovered by two red paper doors sliding apart; "Our wedding", names in Luxurious Script, weekday +
  date, venue, city; the invitation on a cream band ("Double happiness", paper-cut border opening from its centre, host
  line, full names with display-name fallback, request, date in three lines, venue, ceremony time, RSVP + deadline,
  countdown in plain numerals, calendar); the story teaser in a moon gate; the day on cream paper (first four rows);
  signature — the knot and tassel swaying, names, "Open the invitation again".
- **Story:** three moon gates down the page, left / right / left; the doors of each slide apart as it scrolls into view,
  then its number and caption unfold; the paper-cut layers behind the page move with the scroll. Story intro + date as
  one sentence.
- **Details:** date heading, the programme on a cream sheet (paper-cut border, gold hours, 1 px rules), ceremony sentence,
  calendar; the venue photo uncovered by two lattice doors; map; dress code, good to know (G138), travel & stay, menu,
  registry, FAQ.
- **RSVP:** the shared form on a cream sheet; the knot and tassel; "Open the invitation again". A sent reply lets a few
  gold clouds rise (GPT clouds only).
- Text steps unfold from their top edge, folded back (rotateX), like a paper cut being opened out.
- Bottom nav with `scroll-padding-bottom`.

## Interim build (until the GPT parts arrive)

Parts ordered in `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.20, PAKET 2,
PAKET 6). Built from GPT pixels that already exist, cut and toned, nothing drawn (K21):

- red paper = `collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png` toned cinnabar (`tonla`, its own fibres);
- lacquer ground = `collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png` toned deep lacquer red;
- cream paper = `collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png` toned warm cream;
- gold leaf = the plain metal field inside `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png`;
- the envelope = rectangles of the red paper (back darker, flap lighter), the buttons = round crops of the gold leaf, the
  two windows = plain red and gold halves, the moon gate doors = halves of the red paper;
- 囍 = the character U+56CD of **Ma Shan Zheng** as generated content (`.xi::before`), filled with the gold leaf
  (background-clip). No text node, not edited, not translated (docs/24: 囍 is gold leaf, not a text layer). Its
  stylesheet is not render-blocking (`media="print"` switched on by site.js) and the character shows only once the font
  has it (`.xi-ready`). Google's `text=` subset URL answered 400 / without CORS here, so the normal unicode-range slices
  are used (one 28 KB slice holds U+56CD). GPT's `xi_gold` replaces it (`parts.css` → `content:none`).
- no cord, clouds, moon gate frame, paper-cut border, paper-cut layers or tassel: hidden (`display:none`) until
  `parts.css` shows them. The look is plain until then; sale needs the GPT parts + an eye check.

`python3 build_images.py` takes each part that exists in `parts/` and writes `parts.css`; the manifest lists `parts.used`
and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema red-lacquer-double-happiness --sekil
collections/34_Red_Lacquer_Double_Happiness/assets/gpt/kuru_sekil.json` rehearses the drop-in — passed 23/25 (only
PAKET 6, by hand).

## What waits for GPT

| Part | Then (automatic) |
|---|---|
| W2.1 `lacquer`, W2.2 `red_paper`, W2.3 `cream_paper`, W2.4 `gold_leaf` | same roles, instead of the toned interim textures |
| W2.5 `envelope_back`, W2.6 `envelope_pocket` | full envelope canvas → `env_back-900`, `pocket-900` |
| W2.7 `envelope_flap`, W2.8 `flap_inside` | the two faces of the flap (`flap-900`, `flap_in-900`) |
| W2.9 `button` | `button-240` for both buttons (instead of the gold crops) |
| W2.10 `string` | `string-320` on its box (manifest `stage.string_pct`); unwinds and falls in the opening |
| W2.11 `xi_gold` | `xi-400`; the interim Ma Shan Zheng character goes |
| W2.12 `veil_outer`, W2.13 `veil_inner` | trimmed, cut in two at the centre → `veil_o_l/r`, `veil_i_l/r` |
| W2.14 `card_small` | round #00FF00 window measured, keyed → the card; portrait placed on the window. No window → warning |
| W2.15 `cloud_1..3` | `--rl-clouds` → the clouds of the opening, the idle drift, the RSVP accent |
| W2.16 `moon_gate` | #00FF00 window measured, keyed → `gate-720` round every round photo. No window → warning |
| W2.17 `peony_band` | `band-800` under the headings on cream paper |
| W2.18 `jianzhi_far`, `jianzhi_near` | the two parallax layers (`cut_far-900`, `cut_near-700`) |
| W2.19 `tassel` | `tassel-300` in the signatures (sways) |
| W2.20 `web_hero` | `og-1200x630.jpg` instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos) |
| PAKET 6 print sheets | **by hand** (G149): `lib/print/layouts.ts`, `node scripts/build-print-assets.ts --theme red-lacquer-double-happiness` |

## Deviations from the standard

- No W1 comps (the design starts from docs/24) → `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi, Celestial): rendered by the platform only.
- One generated stylesheet (`parts.css`) beside `site.css`.
- A typeface character (囍) stands in for a GPT part while it is missing — the only interim piece that is not a crop.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves, Safari's 3D
backface handling of the flap and windows.
