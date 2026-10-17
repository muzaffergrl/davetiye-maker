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
| `site.js` | `MOTION` (opening steps, scenes, accents), long names, card fit, scenes, countdown, opening, gold-leaf flakes (sprites named by `parts.css` `--kw-flakes`; none → no flakes) |
| `build_images.py` | GPT paper → `img/` (interim toning, placeholders, og montage, favicon, `manifest.json`); every optional GPT part that exists → `img/` + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the optional GPT parts present in `parts/`; a comment only while none exists. Linked by every page after `site.css` |

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

With the GPT parts (each one as soon as it exists, `parts.css`): the gold kintsugi veins lie on the four folds' outsides
and turn with them; the idle and opening gold light runs along the veins only (masked by them; the opening pass ends at
550 ms, when the top fold starts to turn); the band is GPT's torn obi; the card is GPT's `card_small` with the portrait
in its measured window; as the right panel finishes (2500 ms) three gold-leaf flakes drift down from the opened packet,
rocking to one side as they sink.

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
  When a reply is sent (`rsvp:state` success) five gold-leaf flakes drift down over the thank-you panel (GPT flakes only).
- **Sumi stroke** (W2.6, when it exists): painted in under the headings on rice paper (home invitation and day, details
  programme — after the heading rises, from the pressed head to the dry tail) and under the reply form's title.

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Nocturne (G142) the theme is built from GPT pixels that
already exist, cut and toned, nothing drawn (K21):

- indigo washi = `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png` (plain navy paper) toned to indigo with its
  own grain (`tonla`); the fold insides and the page ground are the same paper, lighter / darker;
- rice paper = `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png` (plain cotton paper) toned to rice ivory;
- the folds, band and card are rectangular crops of those papers (CSS backgrounds), shaded only by light (brightness +
  drop shadow); the share image and the favicon are a montage of the same crops.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/26_Kintsugi_Washi/assets/gpt/parts/` and writes `parts.css`; the manifest lists `parts.used` and
`parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema kintsugi-washi --sekil
collections/26_Kintsugi_Washi/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with neutral
test images (repo untouched).

| Part | Then (automatic) |
|---|---|
| W2.1–W2.3 `washi_indigo`, `washi_inner`, `rice_paper` | same roles, instead of the toned interim papers |
| W2.4 `kintsugi_veins` | stretched to the 0.70 packet, cut along the fold lines → `vein_top/bottom-760`, `vein_left/right-380` on each fold's outside (`::after`); minus the band → `vein_glint-540`, the mask of `.sheen` |
| W2.5 `ink_bleed` | trimmed, squared → `ink-640`: the three layers of the `.ink` mask (same sizes, positions, timing) |
| W2.6 `sumi_stroke` | trimmed → `sumi_stroke-640` under `.paper-band h2` and `.reply-card .form-title` (clip-path paint-in) |
| W2.7 `gold_flake_1..3` | `flake_N-200` + `--kw-flakes` → `MOTION.accents` open / arrive / reply |
| W2.8 `obi_band` | trimmed → `obi-800` = `.band` |
| W2.9 `card_small` | #00FF00 window measured (`manifest card_small.window_pct`) and keyed to alpha → `card_small-860` = the fold card; the portrait slot sits on the window, the text starts below it. No window found → warning, card stays rice paper |
| W2.10 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`, bottom-aligned) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print/invitation_front_5x7`, `invitation_back_5x7` | **by hand** (one block; boxes are measured on the art, G149): `lib/print/layouts.ts` → those sheets, `node scripts/build-print-assets.ts --theme kintsugi-washi` — steps in GPT_PROMPTS.md PAKET 6 |

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne): the theme is rendered by the platform only.
- Until W2.9 arrives the card inside the folds is rice paper set by CSS, not a GPT `card_small` with a window.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only): it keeps the pages from
  asking for a GPT picture that does not exist yet.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves.
