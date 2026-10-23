# Red Lacquer & Double Happiness (34)

A tall red paper envelope with a gold-leaf 囍, closed with a red cord wound round two paper buttons; paper-cut peonies,
red lacquer, gold clouds and round moon gates. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, task G183,
K23 strict: the first page is a closed envelope). Status: **coming** (`lib/marketing/config.ts`). Since 2026-10-22 the
theme is built from all of its own GPT parts (PAKET 5) and the demo shows its own PAKET 2 photos; sale, price and approval
wait for the user's eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` round 1:1, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme red-lacquer-double-happiness`) |
| `content.demo.json` | = `collections/34_Red_Lacquer_Double_Happiness/content.demo.json` (fictional Mei & Julian, The Peony Court Garden House, Vancouver, British Columbia; September 25, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the moon gate doors, the unfolding text / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, cloud drift, accents), long names, card fit, scenes, paper-cut parallax (`data-depth`), clouds, countdown, opening, the interim 囍 font switch |
| `build_images.py` | GPT parts → `img/` (cut to their alpha boxes, #00FF00 windows keyed, scaled; placeholders, og, favicon, `manifest.json`) + `parts.css`; lays the envelope layers by their measured alpha boxes; folder ≤ 2.5 MB, every file ≤ 250 kB (exit ≠ 0 otherwise) |
| `parts.css` | **generated** by `build_images.py` (do not edit): rules for the GPT parts present in `parts/`, with the measured envelope (`--env-ratio`, pocket, flap, flap inside, buttons, cord, card). Linked by every page after `site.css` |

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

## Built from the GPT parts (2026-10-22)

All PAKET 5 parts of `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/` are used (`img/manifest.json`
`parts.used` = 19, `waiting_for_gpt` empty); nothing is drawn (K21). `python3 build_images.py` rebuilds `img/` and
`parts.css`. The interim sources (other designs' plain papers toned, a crop of 17's gold, the Ma Shan Zheng 囍) stay in
the build only as the look of a missing part.

| Part | Built into | Where |
|---|---|---|
| W2.1 `lacquer`, W2.2 `red_paper`, W2.3 `cream_paper`, W2.4 `gold_leaf` | `lacquer-640`, `red-640/1024`, `cream-640/1024`, `gold-480` | page ground; doors, thank-you window; cards, bands, form; print sheets (`lib/print/layouts.ts` reads the 1024 files) |
| W2.5 `envelope_back`, W2.6 `envelope_pocket`, W2.7 `envelope_flap`, W2.8 `flap_inside`, W2.9 `button`, W2.10 `string` | `env_back-720`, `pocket-720`, `flap-720`, `flap_in-720`, `button-240`, `string-320` | the closed envelope, laid by measured boxes (below) |
| W2.11 `xi_gold` | `xi-400` | the gold-leaf 囍 on the pocket (the interim character goes: `content:none`) |
| W2.12 `veil_outer`, W2.13 `veil_inner` | `veil_o_l/r-300`, `veil_i_l/r-300` | the two paper-cut windows over the card, cut in two at the centre |
| W2.14 `card_small` | `card_small-720` | the card; round window keyed, the portrait set in it, the texts under it |
| W2.15 `cloud_1..3` | `cloud_N-400` (`--rl-clouds`) | the clouds of the opening, the idle drift, the RSVP accent |
| W2.16 `moon_gate` | `gate-720` | round every round photo |
| W2.17 `peony_band` | `band-800` | under the headings on cream paper |
| W2.18 `jianzhi_far`, `jianzhi_near` | `cut_far-720` (32 % opacity), `cut_near-640` | the two parallax layers |
| W2.19 `tassel` | `tassel-300` | the signatures (sways) |
| W2.20 `web_hero` | `og-1200x630.jpg` | share image (`tema_build.og_kirp`, bottom-aligned) |
| PAKET 2 photos | `public/demo/red-lacquer-double-happiness/*` + `lib/claim/demo-photos.json` | the live demo (`node scripts/build-demo-photos.ts --theme red-lacquer-double-happiness`); seed / theme-check use the same folder |

**The envelope (eye check 2026-10-22).** GPT drifted between the layers it drew on one canvas — the pocket came 3 %
narrower than the back and stopped 4 % above its foot, so the back showed as a border round it — and drew the flap, its
inside and the cord on canvases of their own (the flap's alpha box started 7 % below its canvas top, so the back's cream
lining showed as a strip above the closed flap). As in 39–48 every layer is cut to its alpha box and laid by its
measured edges (`manifest stage`; the asked boxes stay in `stage_asked`): the back's alpha box is the envelope (0.651:1);
the pocket spans its width with its foot on the back's foot (uniform scale 1.06); the flap spans the width from the fold
at its own height (44.9 %), its button just above the flap's tip; the flap's inside at its own height (91 % of the flap)
under the fold; the cord scaled so its two loops — measured as the cord's two enclosed holes — ring the two buttons (loop
1.09 × the button), which fixes the body button at 54.7 %. The flap's shadow follows its scalloped edge (drop-shadow),
the cord gets a hairline shadow on the red paper. The card keeps its own 0.67:1 (88 % wide, 85 % of the height).

**Photo windows.** GPT left the middle of the round #00FF00 windows (card, moon gate) transparent inside a soft green rim,
and one spot of key green between two peony leaves of the gate: the window = the green + the hole it encloses (flood
fill), cleared, every key-green spot cleared, the spill round them neutralised — `checks.green` is empty.

**Size.** The first build of the full set was 3.94 MB (four veil halves of 340–410 kB). Now 2.49 MB, every file ≤ 250 kB:
the veil halves 300 px wide (q 70; a card is ≤ 270 CSS px wide), the envelope layers and the card 720 px, the far paper
cut 720 px (q 68, shown at 32 %), the near one 640 px.

## What waits for GPT

Nothing of PAKET 5 or PAKET 2. Still **by hand**: PAKET 6 (`print/invitation_front_5x7.png`, `invitation_back_5x7.png`
are in the collection) → `lib/print/layouts.ts` still builds the printed sheets from the cream / red textures;
`node scripts/build-print-assets.ts --theme red-lacquer-double-happiness` (G149, steps in GPT_PROMPTS.md PAKET 6).

## Deviations from the standard

- No W1 comps (the design starts from docs/24) → `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi, Celestial): rendered by the platform only.
- One generated stylesheet (`parts.css`) beside `site.css`.
- A typeface character (囍) stood in for the GPT 囍 while it was missing (now `content:none`; kept for a missing part).
- The envelope is the GPT layers' measured shape (0.651:1), not the asked 0.66; one generated stylesheet carries it.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, Safari's 3D backface handling of the flap
and windows, `theme-check.cjs` on a production build. Checked on 2026-10-22 in Chromium only (demo route at 360×640 and
390×844: closed, the opening seeked frame by frame, home / story / details / RSVP full pages).
