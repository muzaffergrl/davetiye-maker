# Maison Pâtisserie (28)

Pistachio, rose and cream with a little gold — the window of a Paris pâtisserie. Design 28 of the new wave
(`docs/24_YENI_TASARIMLAR.md`, G166). Status: **coming** (`lib/marketing/config.ts`, `[PRICE]`) — sale waits for the GPT
parts, an eye check and approval.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` 4:5, `venue` 3:2), 83 copy keys (`node scripts/copy-manifest.ts --theme maison-patisserie`; 2 own keys: the shelf buttons' screen-reader names) |
| `content.demo.json` | = `collections/28_Maison_Patisserie/content.demo.json` (fictional Camille & Oliver, The Belle Rive Orangery, Newport RI; US dates; all URLs `null`; no photos yet → neutral placeholders; demo menu for the display case) |
| `index.html` … `rsvp.html` | the box · home · story (display-case shelf) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, sugar-pearl accents), long names, scenes, countdown, the box, the shelf, the pearl shower |
| `build_images.py` | GPT parts → `img/` (full-canvas stage layers, placeholders, og, favicon, `manifest.json`); interim sources until the parts exist |

Shared platform layers: RSVP (`/rsvp/form.js`, G128 required fields, questions, guest names), map block (`data-map`),
music + opening sounds (`lib/audio/catalog.ts`: Garden Waltz; ribbon 180 · paper 1100 · paper 1850 · slide 2500 ·
chime 3200 ms), calendar, Details blocks / travel / menu (G138), thank-you mode, editable texts (G068), languages (G144:
the 4 new texts are in `lib/i18n/dict/site/*`), printable invitation (G139, `lib/print/layouts.ts`, composed).
Fonts: Italiana + Parisienne (Google Fonts; no font files). Body text is Italiana. docs/11 §12: Parisienne (the names)
has `latin-ext`; Italiana has `latin` only (Western European accents such as é, â, ü are in it) — a Central European letter
(ł, ő, ș) in an Italiana line falls back to Georgia.

## Opening — a pâtisserie box (own object, no envelope)

The box is seen from above. Tap → the box gives a little (0–260 ms) → the bow unties: its two loops part to the sides
and fade, the knot drops (180–1000) → the four ribbon arms slide off the lid in their own directions (420–1120) → the
lid lifts towards the guest and away (1100–1900) → the two sheets of tissue paper part like curtains, folding out from
their outer edges (1850–2600) → the card inside (portrait, "Our wedding", the names, the date) lifts out (2500–3200) and
comes forward (3200–3500) → home at 3600 ms (view transition `invite-card` onto the home card). Twelve separate layers
(`box_base`, card, `tissue_left/right`, `lid`, `ribbon_n/s/w/e`, `bow_l`, `bow_r`, `bow_knot`). Reduced motion: no
animation, straight to home. Skip at any time; Enter / "Replay the opening" when opened.

Every stage layer is the **whole 1024 × 1024 canvas** (PAKET 5: parts that sit on each other are drawn on one canvas),
stacked at 100 % — no per-piece percentages to measure; `manifest.stage` keeps each layer's alpha box and centre (the
tissue's and the bow's `transform-origin` in `site.css` come from there; recheck them when the GPT parts arrive).

**INTERIM (2026-10-17): no Maison Pâtisserie GPT part exists yet.** `build_images.py` makes every layer from GPT
pictures already in the repository, by crop / tone / mirror / mask only (K21 — nothing is drawn):
cream paper = 21's `textures/paper-background.png`, satin = 14's `parts/bg_tile.png`, bow = 14's `parts/accent_3.png`
(toned rose, cut at its knot into two loops + knot), sugar pearl = the body of 14's `parts/accent_1.png`. The box, lid,
tissue, card and shelf are plain rectangular crops of that paper / satin toned to the palette (as Nocturne's interim card,
G142). These borrowed pixels are placeholders, not the design. `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md`
orders the real parts; the script switches **layer by layer** as each file appears in `assets/gpt/parts/`.

## Pages

- **Home:** the card from the box on the cream ground (portrait, "Our wedding", names in Parisienne, date, place); the
  invitation (host line, full names with display-name fallback, request line, date block, time, venue, RSVP + deadline),
  countdown (plain numerals), calendar; one photo standing on the shelf as the way to the story; the day's first four
  moments on a sheet of card paper; the bow, signature and "Untie the bow again".
- **Story:** the display-case shelf — three 4:5 photos stand on one glass shelf and slide along it: native swipe with
  scroll snap, mouse/pen drag, ‹ › buttons, ← → on the focused shelf; the photo in the middle stands forward
  (`.is-current`), the counter says "1 / 3". Reduced motion: a simple list (no snap, no shelf, no buttons). ≥ 38vw at 390 px
  (66vw). Intro + date as one sentence.
- **Details:** date heading; the order of the day on card paper (1–10 rows; the paper stretches with the list — a plain
  paper crop, no decor to misplace); ceremony sentence; calendar; venue photo; map; dress code; blocks; travel; **the menu
  as a display case** (G138 `data-menu`: each course is a shelf — the GPT shelf part under it — and its dishes are
  macaron-coloured chips); registry; FAQ (`+`/`×` outside the accessible name).
- **RSVP:** reply card on card paper; "Will you attend?" and the couple's choice questions are macaron-coloured chips
  (the radio inside each chip is the real control, keyboard and screen readers unchanged); a sent reply brings a light
  shower of 18 sugar pearls (`MOTION.accents.closing`, GPT sprite, none with reduced motion); "Replay the opening".

## Deviations / limits

- No W1 comps (the design starts from docs/24, not from a PAKET 5 W1 run) → no comp map; `theme-check --compare none`.
- Decor family (macarons, tulle, gold-rimmed plates) is not on the pages yet: those parts do not exist; the interim pages
  use only the bow, the pearls and the shelf. GPT_PROMPTS.md asks for them with their places.
- No demo map pin: `lib/claim/demo-map.ts` was outside this task's write area (coordinator: add `'maison-patisserie':
  { lat: 41.4901, lng: -71.3128 }` — Newport, RI).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network.
