# Victorian Glasshouse (36)

A Victorian glasshouse at dusk: deep fern green, misted glass, herbarium paper, kraft, copper and jute. New design of
the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, row 36, task G185; K23 strict: the first page is a closed envelope).
Status: **coming** (`lib/marketing/config.ts`, price `[PRICE]`). Since 2026-10-22 the theme is built from all of its own
GPT parts (PAKET 5) and the demo shows its own PAKET 2 photos; sale, price and approval wait for the user's eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` 4:5, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme victorian-glasshouse`) |
| `content.demo.json` | = `collections/36_Victorian_Glasshouse/content.demo.json` (fictional Flora & Edmund, The Fernhill Glasshouse, Columbus, Ohio, June 19, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed seed packet · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the packet keyframes, the mist and its wipe, the specimens under glass, the swinging labels / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, parallax, leaflets), long names, card fit, scenes (the mist wipe and the label swing follow each step), parallax (`--sy`), countdown, opening, leaflets |
| `build_images.py` | GPT parts → `img/` (cut to their alpha boxes, #00FF00 windows / hole keyed, scaled; placeholders, og, favicon, `manifest.json`) + `parts.css`; lays the packet by the pieces' own proportions; folder ≤ 2.5 MB, every file ≤ 250 kB, no key green (exit ≠ 0 otherwise) |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the GPT parts present in `parts/`, with the measured packet (`--env-ratio`, flap height) and the card's text start. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Columbus,
Ohio), music + opening sounds (`lib/audio/catalog.ts`: Garden Waltz; label 0 · twine 300 · flap 900 · card 1700 ·
wipe 2600 · forward 3600 ms), calendar, thank-you mode, editable texts, languages (G144; two new strings, "Grown with
love" and "Open the seed packet", translated in `lib/i18n/dict/site/*`). Fonts: Monsieur La Doulaise (names,
headings) + Old Standard TT (body, labels, small capitals) — Google Fonts, no font files; neither is used by 01–32
(docs/24's "Bodoni Moda" is taken by 14 and 23).

## Opening — the seed packet in the glasshouse (K23: a closed envelope)

Layout of the catalogue cover: host line and "invite you to celebrate their wedding" with the names above, the closed
packet in the middle, the date · city and "Tap to open" below, Skip in the corner. The packet is a kraft seed-packet
envelope with a straight flap folded down over its front, tied with jute twine down the middle; a copper plant label
hangs from the knot with the couple's monogram stamped on it (`data-field="initials"`, the panel's "Monogram"; never
baked into a picture). No V flap, no wax seal (01–32).

Tap → the host line, names and date rise away (0–450 ms) while the **copper label swings hard on its knot** (0–500)
and **drops away**, turning as it falls (500–1200) → the **twine comes apart at the knot**: the upper half slides up
and off, the lower half down and off (300–1000) → the **flap folds up and back over its hinge** (900–1600; past 90° it
drops behind the card and its inner face stands above the packet) → **warm air mists the glass** (1300–2300: a blur
behind a pale veil over the whole screen) → the **card rises out of the packet**, seen through the mist (1700–2500) →
the **mist is wiped away across the glass** with a soft edge, left to right (2600–3600; `@property --wipe` through a
mask) and the ferns show round the card (GPT, W3.10) → the iron arches drift the whole time (parallax: they move, the
packet stays) → the card **comes forward** (3600–4000) → home at 4100 ms (view transition `invite-card`). Back wall,
body, flap (two faces), the two twine halves, the label, the card, the mist, the ferns and the arches are separate
layers; nothing is one picture that fades. With the GPT leaflets (W3.14) two fern leaflets drift down past the card
as the mist is wiped.

Reduced motion: no opening (tap → home), no sheen, no tap-hint breathing, no label idle, no mist, no swing, no
parallax.

## Pages

- **Home:** on the fern ground under the iron arches (GPT; they drift slower than the page — parallax) the
  herbarium-paper card from the packet: the portrait as a specimen under glass (on arrival the mist on its pane is
  wiped, a band of light crosses the glass), "Our wedding", names, weekday + date, venue, city; the invitation on a
  herbarium band ("Grown with love", orchid sprig, host line, full names with display-name fallback, request, date in
  three lines, venue, ceremony time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser — a
  specimen with its copper label "01" swinging on its cord; the day on misted glass (first four programme rows);
  signature on the fern ground — the copper label with the monogram swings, names, "Open the invitation again".
- **Story:** three 4:5 specimens down the page, set left / right / left; for each, as its scene enters, the **mist on
  the pane is wiped away from one side**, a **band of light crosses the glass**, the **copper label swings** on its cord
  and settles, then the caption is **written onto a herbarium label** (clip-path from its own side). The iron arches
  behind the page drift as it scrolls. Story intro + date as one sentence.
- **Details:** date heading, the programme on a herbarium sheet (orchid sprig, a small copper label at each row that
  swings as its row comes in, hours in copper, 1 px rules), ceremony sentence, calendar; the venue photo behind misted
  glass that clears; map; dress code, good to know (G138), travel & stay, menu, registry, FAQ (`+`/`×` outside the
  accessible name).
- **RSVP:** "Kindly reply" on the misted glass, the shared form on a herbarium sheet; "(optional)" outside the question
  label; closing on the fern ground with the monogram label and "Open the invitation again". When a reply is sent
  (`rsvp:state` success) the label swings again and, with the GPT leaflets, a few fern leaflets drift down past the
  thank-you panel.
- Text steps clear like breath on glass: from a soft blur they come into focus where they stand (not the shared rise,
  not 29's glint).

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Celestial Observatory (G168) the theme is built from GPT
pixels that already exist, cut and toned, nothing drawn (K21):

- fern ground = `collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png` (plain green velvet) toned deep fern;
- misted glass = `collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png` (plain pale paper) toned glass sage;
- herbarium paper = `collections/16_Sunflower_Rustic/assets/gpt/parts/bg_tile.png` (plain cream paper) toned;
- kraft = `collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png` (plain aged paper) toned kraft brown — the
  packet's body and flap are rectangles of it (lighter flap, darker inner face);
- copper = the plain metal field inside `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png` (a rectangle
  between the laurel) toned copper — the interim label is that plate;
- twine = the two straight jute strands below the knot of `collections/10_Tuscan_Vineyard/assets/gpt/parts/closure.png`
  (no leaf, no wax), repeated down the packet and as the labels' cords;
- the mist and the band of light are CSS light (a blur behind a pale veil; a soft gradient) — docs/11 §5.7;
- no ferns, iron arches, orchid sprig, glass cases, herbarium labels or leaflets: their elements stay hidden
  (`display:none`) until `parts.css` shows them; the caption label is herbarium paper until W3.13. The look is plain
  until then; sale needs the GPT parts + an eye check.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/36_Victorian_Glasshouse/assets/gpt/parts/` and writes `parts.css`; the manifest lists
`parts.used` and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema victorian-glasshouse --sekil
collections/36_Victorian_Glasshouse/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with
neutral test images (repo untouched).

## Built from the GPT parts (2026-10-22)

All PAKET 5 parts are used (`img/manifest.json` `parts.used` = 16, `waiting_for_gpt` empty); nothing is drawn (K21).
The table of "Interim build" above now describes only the look of a part that is missing.

| Part | Built into | Where |
|---|---|---|
| W3.1 `fern_ground`, W3.2 `glass_ground`, W3.3 `herbarium_paper` | `fern-640`, `glass-640/1024`, `paper-640/1024` | page grounds, cards, bands, print sheets |
| W3.4 `packet_body`, W3.5 `packet_flap`, `packet_flap_in` | `packet_body-700`, `flap_out-700`, `flap_in-700` | the packet, laid by the pieces' own proportions (below) |
| W3.6 `copper_tag` | `tag-360` | every copper label; its #00FF00 hole keyed through (`manifest tag.hole_pct`, ~0.3 % of the label — kit_check calls it small; on the page it reads as a real hole with its eyelet ring, the kraft / fern showing through) |
| W3.7 `twine` | `twine_own-108` | the twine down the packet and the labels' cords |
| W3.8 `glass_mist` | `mist-640` | the opening's mist and every pane's fog (a soft veil: 640 px q 70, was 900 px / 370 kB, over the 250 kB file budget) |
| W3.9 `ironwork`, W3.10 `ferns`, W3.11 `orchid_sprig` | `arches-1200`, `ferns-1000`, `sprig-700` | arches (parallax), ferns round the card, the sprig under headings |
| W3.12 `specimen_frame`, W3.13 `herbarium_label` | `frame-800`, `label-640` | round every 4:5 photo; the story captions |
| W3.14 `leaf_1..3` | `leaf_N-200` | leaflets of the opening and of a sent reply |
| W3.15 `card_small` | `card_small-860` | the card from the packet; window keyed, the portrait set in it |
| W3.16 `web_hero` | `og-1200x630.jpg` | share image |
| PAKET 2 photos | `public/demo/victorian-glasshouse/*` + `lib/claim/demo-photos.json` | the live demo (`node scripts/build-demo-photos.ts --theme victorian-glasshouse`) |

**The packet (eye check 2026-10-22).** The flap came 3.58:1, not the asked 100 × 30 box of the 0.68 stage (2.27:1), and
was stretched 1.58× in height (its deckled edge and fern sprig thick and blurred); the body came 0.708:1. Now the body
spans the width at its own height from its mouth (5 %) to the foot — the stage takes its shape, 0.672:1 (`manifest
stage`; the asked boxes stay in `stage_asked`) — and the flap spans the width at its own height (18.8 %); twine, label
and card keep their boxes (the card is already at its own 0.69:1). **Card text:** the first build set the text's top
padding in % of the card's width, but a padding % is of the packet's width, so the text started 14 % too low and spilled
past the card's foot (the risen card showed its date below the paper); now it starts 3 % under the window, the texts are
sized by the card (cqw) and `fitCard` keeps the last line above the card's bottom margin. Green left in `ferns` /
`leaf_N` is the foliage's own green (`checks.green`), not key colour.

## What waits for GPT

Nothing of PAKET 5 or PAKET 2. PAKET 6 is in (2026-10-23): `lib/print/layouts.ts` takes `print/invitation_front_5x7.png` /
`invitation_back_5x7.png` as one `cover` ground per side, the text boxes measured on the art (G149);
`node scripts/build-print-assets.ts --theme victorian-glasshouse` writes `public/print/victorian-glasshouse/front.webp` and `back.webp`.

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Celestial): the theme is rendered by the platform only.
- The mist is a CSS blur behind a pale veil (light, docs/11 §5.7) wiped by a mask; its texture comes with W3.8.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).
- No colour palettes (`variants.css`) yet: they are made after the GPT parts (G153 / G177 route).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, `theme-check.cjs` on a production build
(checked on 2026-10-22 in Chromium only: demo route at 360×640 and 390×844, the opening seeked frame by frame, all pages,
40-character names on the card), Safari's handling of `@property --wipe` and `backdrop-filter` under a mask (without `@property` the wipe jumps at its end; without
`backdrop-filter` the mist is only the pale veil).
