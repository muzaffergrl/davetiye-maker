# Marigold & Mehndi (33)

A fuchsia silk envelope held in a gold laser-cut paisley sleeve, marigold garlands, henna, brass diyas and carved
Rajasthani jharokha arches; saffron, fuchsia and gold. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, task
G182). Status: **coming** (`lib/marketing/config.ts`). Since 2026-10-22 the theme is built from all 18 of its own GPT
parts (PAKET 5) and the demo shows its own PAKET 2 photos; sale, price and approval wait for the user's eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` arched 4:5, `venue` 16:9), 83 copy keys (`node scripts/copy-manifest.ts --theme marigold-mehndi`) |
| `content.demo.json` | = `collections/33_Marigold_Mehndi/content.demo.json` (fictional Anaya & Kabir, Gulmohar Haveli Gardens, Jaipur, Rajasthan; November 20, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the henna flow / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, petals, scenes, henna, diyas, accents), long names, card fit, scenes, diya rows, countdown, opening, petals |
| `build_images.py` | GPT parts → `img/` (cut to their alpha boxes, #00FF00 windows keyed, scaled; placeholders, og, favicon, `manifest.json`) + `parts.css`; measures the envelope pieces, the jharokha window, the card's text zone and the diya's wick |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the GPT parts present in `parts/`, with the measured boxes (envelope `--env-ratio` and layers, jharokha box, card padding, flame on the wick, `--garland-ratio`). Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Jaipur),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; tassel 0 · sleeve 300 · flap 1250 · card 2500 ·
forward 3150 ms), calendar, thank-you mode, editable texts, languages (G144; four new strings — "Together with their
families", "invite you to celebrate", "Let the celebrations begin", "Open the envelope" — translated in
`lib/i18n/dict/site/*`). Fonts: Rozha One (names, headings) + Yrsa (body) — Google Fonts, no font files; neither is used
by designs 01–32 (docs/24's "Cormorant Infant" is design 17's body font, so Yrsa instead).

## First page — the closed envelope (K23 strict)

The catalogue cover's order (`components/marketing/InvitationCover.tsx`): "Together with their families", "invite you
to celebrate", the names (Rozha One), the envelope in the middle, below it the row of diyas, the date · city and "Tap to
open"; Skip in the corner (below the marigold garland, which hangs from the top edge: the texts start under its measured
depth, `--garland-drop`; on short screens it hangs higher). The envelope is **not** the V flap + wax seal of 01–32: a
silk envelope with a straight top flap, held shut by a gold sleeve wrapped round it (the sleeve covers the flap's lower
edge), a silk tassel hanging from the sleeve. Its shape is the GPT pieces' own (1.06:1, see "Built from the GPT parts"),
not the 0.8 portrait first planned; its width = what the screen height leaves after the texts (`--chrome`), at most
76vw / 330 px.

## Opening

Tap → the families, the line and the names rise away (0–450 ms) while the **tassel swings like a pendulum** and settles
(0–1400) and light runs over the silk (200–1100) → the **sleeve slides off** to the right, the tassel with it (300–1250;
it first gives a little to the left) → the **straight silk flap turns up** on its top edge to 90° (1250–1630) and **hands
over to its velvet inner face**, which stands up above the envelope (1630–2050; docs/11 §7.1) → the **velvet-fuchsia
lining warms** (1500–2200) → **marigold petals drift down** turning over (from 1600, 14 GPT sprites at fixed places) →
the **diya flames light one by one**, left to right (1800–2800, then they flicker) → the card with the arched portrait,
"Our wedding", the names and the date **rises out of the lining**, its foot still behind the pocket (2500–3150) → comes
forward (3150–3550) → home at 3650 ms (view transition `invite-card` onto the home card). Back, lining, card, pocket,
flap (two faces), sleeve, tassel, light, petals and diyas are separate layers; nothing is one picture that fades.

Reduced motion: no opening (tap → home), no light sweep, no tassel sway, no tap-hint breathing, photos and henna shown
at once, flames lit.

## Pages

- **Home:** the saffron-paper card on fuchsia velvet under a marigold garland (GPT): the portrait in its jharokha arch
  appears from the bottom up (the henna flow), the henna round the arch follows line by line, then "Our wedding", the
  names in Rozha One, weekday + date, venue, city; the invitation on a saffron band (small garland, "Let the
  celebrations begin", host line, full names with display-name fallback, request, date in three lines, venue, ceremony
  time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser in a jharokha; the day on saffron
  paper (first four programme rows); signature — five diyas whose flames light in turn, names, "Open the invitation
  again".
- **Story:** three arched moments down the page, set left / right / left; each photo is uncovered from the bottom up
  like wet henna flowing (a mask, `.flow`, `@property --flow`), then the henna round its arch flows in **step by step**
  (the same mask in `steps(11)` — line by line), then its number and caption; a faint mehndi pattern (GPT) rests behind
  the page. Story intro + date as one sentence.
- **Details:** date heading, the programme on a saffron sheet (small garland, gold hours, 1 px rules), ceremony
  sentence, calendar; the venue photo uncovered left to right like a henna line drawn across; map; dress code, good to
  know (G138), travel & stay, menu, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** the shared form on a saffron sheet; "(optional)" outside the question label; three diyas lit in turn and
  "Open the invitation again". When a reply is sent (`rsvp:state` success) twelve marigold petals fall swaying over the
  thank-you panel (GPT petals only).
- Text steps slide in from the side and settle, the way the sleeve slid off the envelope (not the shared rise).

## Built from the GPT parts (2026-10-22)

All PAKET 5 parts of `collections/33_Marigold_Mehndi/assets/gpt/parts/` are used (`img/manifest.json` `parts.used`,
`waiting_for_gpt` empty); nothing is drawn (K21). `python3 build_images.py` rebuilds `img/` and `parts.css`.

| Part | Built into | Where |
|---|---|---|
| W2.1 `silk` | `silk-640` | the envelope's back (darkened) |
| W2.14 `velvet` | `velvet-640`, `ground-640` (66 %) | the lining, the flap's inner face; the page ground |
| W2.15 `paper` | `paper-640/1024` | home card, bands, programme, reply form; placeholders `ph_arch` / `ph_wide` |
| W2.12 `envelope_front`, W2.13 `flap`, W2.2 `sleeve`, W2.11 `tassel` | `env_front-900`, `flap-900`, `sleeve-900`, `tassel-200` | the closed envelope, laid by measured boxes (below) |
| W2.10 `card_small` | `card_small-860` + `mask_card.png` | the card rising from the lining: #00FF00 window keyed, the portrait masked into it; names / date in the plain paper below it (`manifest card_small.text_zone`: the window's rim, the corner sprigs) |
| W2.4 `jharokha` | `arch-640` + `mask_arch.png` | round every portrait photo (home card, story teaser, the three story moments) |
| W2.5 `henna` | `henna-640` | behind each arch, flowing in line by line after the photo |
| W2.6 `diya`, W2.7 `flame` | `diya-160`, `flame-96` | the rows (opening 5, home 5, RSVP 3); each flame stands on the wick tip measured at the spout (`manifest diya.wick_tip_pct`) |
| W2.8 `garland` | `garland-900` | top of the opening and of the home hero; small under the invitation, programme and reply headings |
| W2.9 `mehndi_pattern` | `mehndi-560` | behind the story page (14 %), cut to its alpha box so the tile repeats without empty lanes |
| W2.3 `petal_1..3` | `petal_N-96` (`--mm-petals`) | the 14 petals of the opening, the 12 of a sent reply |
| W2.16 `web_hero` | `og-1200x630.jpg` | share image (`tema_build.og_kirp`, bottom-aligned) |
| PAKET 2 photos | `public/demo/marigold-mehndi/*` + `lib/claim/demo-photos.json` | the live demo (`node scripts/build-demo-photos.ts --theme marigold-mehndi`); seed / theme-check use the same folder |

**The envelope (eye check 2026-10-22).** GPT gave the pieces their own proportions, not the boxes asked for (flap
3.78:1 instead of 1.9:1, sleeve 3.82:1 instead of 2.4:1, pocket 1.42:1 instead of 1.29:1): stretched to the 0.8 stage the
flap and the sleeve were twice / 1.6× too tall. As in 39–48 each piece is cut to its alpha box and laid at its own size
(`manifest stage`, `parts.css`): pocket and flap span the width, the flap's piped lower edge 2.5 % over the pocket's mouth
→ stage 1.058:1; the sleeve 108 % wide at its own height, the flap's lower edge a quarter down it; the tassel 11 % wide,
26 % in from the right, its loop over the sleeve's lower edge; the card (0.72:1) 92 % of the envelope's height, centred,
hidden while closed; the lining and the flap's velvet face follow the flap's height.

**The jharokha.** GPT left the middle of the green window transparent inside a soft green rim; the first build keyed
only the green, so the photo mask was a ring. Now the window = the green + the hole the frame encloses (flood fill), cleared
with a 2 px margin, the green spill round it neutralised; the mask is the filled arch. GPT also drew the frame edge to edge,
so the henna canvas (asked to sit round it) overlapped the carving: the henna is set **behind** the frame at 1.22× its
canvas, and the `.jharokha` box is the henna's (the frame 82 % of it) — the page widths were raised to match.

## What waits for GPT

Nothing of PAKET 5 or PAKET 2. PAKET 6 is in (2026-10-23): `lib/print/layouts.ts` takes `print/invitation_front_5x7.png` /
`invitation_back_5x7.png` as one `cover` ground per side, the text boxes measured on the art (G149);
`node scripts/build-print-assets.ts --theme marigold-mehndi` writes `public/print/marigold-mehndi/front.webp` and `back.webp`.

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Celestial Observatory, Kintsugi): the theme is rendered by the platform only.
- The envelope pieces are separate GPT canvases, not one `parts_prep` cut (§7): each is cut to its alpha box and laid by
  its measured size; the stage aspect follows from them (1.058:1, not the planned 0.8).
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only); it also carries the
  measured boxes (site.css keeps the interim look for a missing part).
- No `variants.css` (G177 palettes are for 22–32).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, Safari's handling of `@property --flow`
(without it the henna flow is skipped and the photo simply appears), `theme-check.cjs` on a production build. Checked on
2026-10-22 in Chromium only (demo route, 360×640 / 375×553 / 390×844 / 430×932: closed, opening seeked frame by frame,
opened; home / story / details / RSVP full pages; 40-character names on the card).
