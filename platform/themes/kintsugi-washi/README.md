# Kintsugi & Washi (26)

Indigo washi paper folded like origami round a rice-paper card; sumi ink and gold leaf. New design of the 23–28 wave
(`docs/24_YENI_TASARIMLAR.md`, task G164). Status: **coming** (`lib/marketing/config.ts`) — the design's own GPT parts
do not exist yet; sale, price and approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1` 4:5, `story_2` 5:4, `story_3` 4:5, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme kintsugi-washi`) |
| `content.demo.json` | = `collections/26_Kintsugi_Washi/content.demo.json` (fictional Naomi & Kai, Stillwater Garden Pavilion, Hood River, Oregon; all URLs and media `null`) |
| `index.html` … `rsvp.html` | folded invitation · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the fold keyframes, the ink-bloom mask / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, accents), long names, card fit, scenes, countdown, opening, gold-leaf flakes (empty until the sprites exist) |
| `build_images.py` | GPT paper → `img/` (interim toning, placeholders, og montage, favicon, `manifest.json`) |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Hood River),
music + opening sounds (`lib/audio/catalog.ts`: First Light; band 0 · one paper sound per fold 550 / 1100 / 1650 / 2100 ·
card 2900 · chime 3500 ms), calendar, thank-you mode, editable texts, languages (G144; one new string, translated in
`lib/i18n/dict/site/*`). Fonts: Shippori Mincho + Allura (Google Fonts, latin-ext; no font files).

## Opening — the folds open one by one

Tap → the rice-paper band slides down off the packet and fades (0–650 ms) while a soft gold light passes over the paper
(120–1020) → the packet steps back (500–1400, `--spread` .76 on a phone, .9 wide) → the **top fold** turns up on its
crease (550–1300) → the **bottom fold** turns down (1100–1850) → the **left panel** turns out (1650–2400) → the **right
panel** turns out (2100–2850); every fold shows its paler inside from 90° on (two faces, `backface-visibility`) → the
rice-paper card lifts (2900–3500) → comes forward (3500–3850) → home at 3950 ms (view transition `invite-card` onto the
home card). Band, four folds (eight faces) and card are separate layers; nothing is one picture that fades.

Reduced motion: no opening (tap → home), no sheen, no tap-hint breathing, no ink bloom, no flakes.

## Pages

- **Home:** on the indigo ground the rice-paper card (portrait, "Our wedding", names in Allura, weekday + date, venue,
  city); the invitation on a rice-paper band (heading, host line, full names with display-name fallback, request, date
  in three lines, venue, ceremony time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser; the
  day on rice paper (first four programme rows); signature + "Open the invitation again".
- **Story:** three moments down the page, set left / right / left (4:5, 5:4, 4:5); each photo appears through an ink
  bloom — three soft discs spreading from the photo's centre (`.ink`, a CSS mask) — then its number and caption. Story
  intro + date as one sentence.
- **Details:** date heading, the programme on a rice-paper sheet (gold hours, 1 px rules between rows), ceremony
  sentence, calendar; the venue with an ink-bloom photo, map; dress code, good to know (G138), travel & stay, menu,
  registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** the shared form on a rice-paper sheet; "(optional)" outside the question label; "Open the invitation again".

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Nocturne (G142) the theme is built from GPT pixels that
already exist, cut and toned, nothing drawn (K21):

- indigo washi = `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png` (plain navy paper) toned to indigo with its
  own grain (`tonla`); the fold insides and the page ground are the same paper, lighter / darker;
- rice paper = `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png` (plain cotton paper) toned to rice ivory;
- the folds, band and card are rectangular crops of those papers (CSS backgrounds), shaded only by light (brightness +
  drop shadow); the share image and the favicon are a montage of the same crops.

What waits for GPT (and needs template work when it arrives):

| Part | Then |
|---|---|
| W2.1–W2.3 `washi_indigo`, `washi_inner`, `rice_paper` | `build_images.py` takes them automatically (same roles) |
| W2.4 `kintsugi_veins` (gold veins over the closed packet) | cut per fold by `build_images.py`, one `<img class="vein">` on each fold's outside face; `.sheen` becomes a light masked by the vein layer (the gold shimmer travelling along the veins) |
| W2.5 `ink_bleed` (sumi ink bloom) | `.ink` mask-image: the texture instead of the three radial gradients (same mask-size growth) |
| W2.6 `sumi_stroke` | under the page headings (`.page-heading h1`) and as the section divider |
| W2.7 `gold_flake_1..3` | `img/flake_N-200.webp`; `MOTION.accents.open` (3 flakes from the card, `fall`), `arrive` (2) |
| W2.8 `obi_band` | the band (closure) instead of the rice-paper crop |
| W2.9 `card_small` (#00FF00 window) | the card inside the folds + `mask_card.png` |
| W2.10 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print_front`, `print_back` | `lib/print/layouts.ts` `composed` → those sheets (`node scripts/build-print-assets.ts --theme kintsugi-washi`) |

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne): the theme is rendered by the platform only.
- The card inside the folds is rice paper set by CSS, not a GPT `card_small` with a window (W2.9 asked for).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves.
