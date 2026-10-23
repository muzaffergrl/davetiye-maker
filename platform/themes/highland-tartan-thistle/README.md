# Highland Tartan & Thistle (35)

A tartan wool envelope held shut by a leather strap and a brass buckle, over misty Highland hills; heather, thistle,
cream paper and antique brass lockets. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, row 35, task G184;
K23 strict: the first page is a closed envelope). Status: **coming** (`lib/marketing/config.ts`). Since 2026-10-22 the
theme is built from all of its own GPT parts (PAKET 5) and the demo shows its own PAKET 2 photos; sale, price and approval
wait for the user's eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` oval 4:5 lockets, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme highland-tartan-thistle`) |
| `content.demo.json` | = `collections/35_Highland_Tartan_Thistle/content.demo.json` (fictional Isla & Callum, Glenarden House, Pitlochry, Perthshire; September 25, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the mist, the locket lids and the mist reveal / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, the mist's scroll drift, accents), long names, card fit, scenes, the mist behind the pages (`--mist`), countdown, opening, heather florets of a sent reply |
| `build_images.py` | GPT parts → `img/` (cut to their alpha boxes, #00FF00 windows keyed, scaled; placeholders, og, favicon, `manifest.json`) + `parts.css`; lays the envelope layers by their measured alpha boxes; folder ≤ 2.5 MB, every file ≤ 250 kB (exit ≠ 0 otherwise) |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the GPT parts present in `parts/`, with the measured envelope (`--env-ratio`, pocket, flap, strap, buckle, card). Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Pitlochry),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; buckle 150 · strap 600 · flap 1300 · card 2500 · chime
3150 ms), calendar, thank-you mode, editable texts, languages (G144; three new strings — "Gathered in the hills",
"Invite you to celebrate", "Open the envelope" — translated in `lib/i18n/dict/site/*`). Fonts: Rouge Script + Sorts Mill
Goudy (Google Fonts; none of 01–32 uses them; no font files). docs/24 suggested IM Fell English + Pinyon Script: IM Fell
English is 13's, Pinyon Script 02's, 07's and 23's.

## First page — the closed envelope (K23 strict)

Laid out like the catalogue cover: "Together with their families" (the host line), "Invite you to celebrate" and the
names in Rouge Script above; the envelope in the middle; the date · city and "Tap to open" below; Skip in the corner.
Behind it, two banks of mist lie over the hills (GPT hills W2.4 hidden until they exist) and drift slowly.

The envelope is **not** the V flap and wax seal of 01–21: a rectangle of tartan wool with a **straight** flap folded down
over the pocket, a **vertical leather strap** running over the top edge, down the flap and onto the pocket, and a
**brass buckle** on the strap where the flap meets the pocket.

## Opening (3.65 s)

Tap → host line, names, date and hint move away (0–450 ms) → the **buckle's frame tips open** on its lower bar and lets
the prong go (150–600) → the **strap slides up** out of the buckle and off the envelope, buckle with it (600–1300) → the
**wool flap swings up** on its top fold in 3D, its darker lining showing as it passes 90° (1300–2100) → a **sprig of
heather** rises out of the pocket (2000–2700, GPT; none = none) → the **card rises** out of the pocket (2500–3150) →
comes forward (3150–3550) → home at 3650 ms (view transition `invite-card` onto the home card). All along, the **mist**
draws off the hills: the near bank to the left, the far bank to the right (0–3500). Back, pocket, flap (two faces),
strap, buckle, sprig, card and the two mist banks are separate layers; nothing is one picture that fades.

Reduced motion: no opening (tap → home), no sheen, no hint breathing, no mist drift, no locket lids, no mist reveal.

## Pages

- **Home:** the mist over the moss ground; the cream card (oval portrait in a locket whose **lid swings open** on its
  left hinge, "Our wedding", names, weekday + date, venue, city); the invitation on a cream band ("Gathered in the
  hills", a heather sprig under it, host line, full names with display-name fallback, request in italics, date in three
  lines, venue, ceremony time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser in a locket; the
  day on cream paper (first four programme rows); signature — a thistle, names, "Open the invitation again".
- **Story:** three moments down the page, set left / right / left, each photo in a locket whose lid swings open when it
  scrolls into view, then its number and caption; behind the page the two banks of mist drift **opposite ways** as the
  page scrolls (`--mist`). Story intro + date as one sentence.
- **Details:** date heading, the programme on a cream sheet (heather sprig, brass hours, 1 px rules), ceremony sentence,
  calendar; the venue photo **comes out of the mist** — a soft mask that clears from the left; map; dress code, good to
  know (G138), travel & stay, menu, registry, FAQ (`+`/`×` outside the accessible name). Mist behind the page.
- **RSVP:** the shared form on a cream sheet; "(optional)" outside the question label; thistle and "Open the invitation
  again". When a reply is sent (`rsvp:state` success) a few heather florets drift down (GPT florets only).
- Text steps come **out of the mist**: from a soft blur they sharpen, drifting in a little from the left.

## Built from the GPT parts (2026-10-22)

All PAKET 5 parts of `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/` are used (`img/manifest.json`
`parts.used` = 20, `waiting_for_gpt` empty); nothing is drawn (K21). `python3 build_images.py` rebuilds `img/` and
`parts.css`. The interim sources (other designs' plain textures toned, 17's brass, a blurred mist) stay in the build only
as the look of a missing part; leather and brass textures remain as the strap's / buckle's interim look.

| Part | Built into | Where |
|---|---|---|
| W2.1 `tartan_wool`, W2.2 `cream_paper`, W2.3 `moss_ground` | `wool-640`, `paper-640/1024`, `ground-640` | the flap's lining (darkened), thank-you decor; cards, bands, form, print sheets; the page ground |
| W2.4 `hills` | `hills-1024` | behind the envelope (bottom 62 %); its top edge fades into the ground and it is dimmed (`filter`, a gradient mask — light only) so the cream date and hint read on it; the texts below the envelope get a dark halo |
| W2.5 `mist` | `mist-1024` | the two mist banks (opening, home hero, story / details) |
| W2.6 `envelope_back`, W2.7 `envelope_front`, W2.8 `flap`, W2.9 `strap`, W2.10 `buckle` | `env_back-760`, `env_front-760`, `flap-760`, `strap-182`, `buckle-320` | the closed envelope, laid by measured boxes (below) |
| W2.11 `heather_sprig`, W2.12 `heather_divider`, W2.13 `heather_floret_1..3`, W2.16 `thistle` | `sprig-420`, `divider-800`, `floret_N-96`, `thistle-400` | the sprig from the pocket, under headings, a sent reply, signatures |
| W2.14 `locket_rim`, W2.15 `locket_lid` | `rim-640`, `lid-560` | round every oval photo; the lid swings open |
| W2.17 `card_small` | `card_small-760` | the card in the envelope; oval window keyed, the portrait set in it |
| W2.18 `web_hero` | `og-1200x630.jpg` | share image (`tema_build.og_kirp`, bottom-aligned) |
| PAKET 2 photos | `public/demo/highland-tartan-thistle/*` + `lib/claim/demo-photos.json` | the live demo (`node scripts/build-demo-photos.ts --theme highland-tartan-thistle`); seed / theme-check use the same folder |

**The envelope (eye check 2026-10-22).** The three layers were asked on one canvas in one place and the first build cut
that canvas at the asked boxes; GPT drifted — the pocket came 2.5 % narrower than the back and stopped 3 % above its foot
(the back's dark lining showed as a band under it), the flap started 5 % below the back's top (the back's tartan edge
showed as a strip above it); the strap came 0.13:1 instead of 0.18:1 and was squashed. As in 39–48 every layer is cut to
its alpha box and laid by its measured edges (`manifest stage`; the asked boxes stay in `stage_asked`): the back's alpha
box is the envelope (0.935:1); the pocket spans its width with its foot on the back's foot (72.6 % high); the flap spans
the width from the fold at its own height (51 %); the strap at its own proportions, 12.5 % wide, its cut end just over the
top edge; the buckle at its own proportions, 20 % wide, centred on the flap's lower edge; the card at its own 0.83:1, 80 %
wide. **Locket rim:** GPT left the middle of the oval #00FF00 window transparent inside a soft green rim — the window =
the green + the hole it encloses (flood fill), cleared, the spill neutralised (`checks.green` empty). The card's texts are
sized by the card (cqw) and `fitCard` keeps the last line above the card's bottom border.

## What waits for GPT

Nothing of PAKET 5 or PAKET 2. Possible regenerate: W2.10 `buckle` is drawn for a horizontal strap (centre bar upright,
prong pointing sideways); on the vertical strap the prong crosses the strap. A portrait buckle (centre bar across, prong
pointing down) would read truer. Still **by hand**: PAKET 6 (`print/invitation_front_5x7`, `invitation_back_5x7`) →
`lib/print/layouts.ts`, `node scripts/build-print-assets.ts --theme highland-tartan-thistle` (G149, GPT_PROMPTS.md
PAKET 6).

## Deviations from the standard

- No W1 comps (the design starts from docs/24) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi, Celestial): the theme is rendered by the platform only.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).
- No colour-palette variants yet (G153/G177 adds them per design).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, Safari's handling of `@property --clear`
(without it the venue photo simply appears) and of the 3D flap's backface, `theme-check.cjs` on a production build.
Checked on 2026-10-22 in Chromium only (demo route at 360×640 and 390×844: closed, the opening seeked frame by frame,
home / story / details / RSVP full pages, 40-character names on the card).
