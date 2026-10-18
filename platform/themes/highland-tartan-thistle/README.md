# Highland Tartan & Thistle (35)

A tartan wool envelope held shut by a leather strap and a brass buckle, over misty Highland hills; heather, thistle,
cream paper and antique brass lockets. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, row 35, task G184;
K23 strict: the first page is a closed envelope). Status: **coming** (`lib/marketing/config.ts`) — the design's own GPT
parts do not exist yet; sale, price and approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` oval 4:5 lockets, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme highland-tartan-thistle`) |
| `content.demo.json` | = `collections/35_Highland_Tartan_Thistle/content.demo.json` (fictional Isla & Callum, Glenarden House, Pitlochry, Perthshire; September 25, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the mist, the locket lids and the mist reveal / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, the mist's scroll drift, accents), long names, card fit, scenes, the mist behind the pages (`--mist`), countdown, opening, heather florets of a sent reply |
| `build_images.py` | GPT textures → `img/` (interim toning, brass crop, mist from a blurred texture, placeholders, og montage, favicon, `manifest.json`); every optional GPT part that exists → `img/` + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the optional GPT parts present in `parts/`; a comment only while none exists. Linked by every page after `site.css` |

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

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Celestial Observatory (G168) the theme is built from GPT pixels
that already exist, cut, toned and blurred, nothing drawn (K21):

- wool = `collections/09_Lavender_Provence/assets/gpt/parts/bg_tile.png` (plain woven linen) toned heather — **no tartan
  yet**: a tartan is a pattern, and no stripe is drawn to fake one; the envelope's back and the flap's lining are the same
  wool darkened;
- moss ground = `collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png` (plain green velvet) toned dark moss;
- cream paper = `collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png` toned cream;
- leather = `collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png` (mottled velvet) toned saddle brown;
- brass = the plain metal field inside `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png`; the interim
  buckle is a rectangle of it, the interim locket lid an oval crop of it with light on it;
- mist = `collections/08_Winter_Evergreen/assets/gpt/parts/bg_tile.png` blurred hard, its own soft blotches as the alpha;
- no hills, heather, thistle, locket rims or florets: their elements stay hidden (`display:none`) until `parts.css`
  shows them. The look is plain until then; sale needs the GPT parts + an eye check.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/` and writes `parts.css`; the manifest lists
`parts.used` and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema highland-tartan-thistle --sekil
collections/35_Highland_Tartan_Thistle/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with
neutral test images (repo untouched).

## What waits for GPT

| Part | Then (automatic) |
|---|---|
| W2.1 `tartan_wool`, W2.2 `cream_paper`, W2.3 `moss_ground` | same roles, instead of the toned interim textures |
| W2.4 `hills` | `hills-1024` = `.hills` behind the envelope (opening) |
| W2.5 `mist` | `mist-1024` = every mist bank (instead of the blurred texture) |
| W2.6 `envelope_back`, W2.7 `envelope_front`, W2.8 `flap` | one canvas of the envelope's ratio; each scaled to its box (`.env-back`, `.env-front`, `.flap::before`); the flap's lining stays the darker wool |
| W2.9 `strap`, W2.10 `buckle` | trimmed → `strap-200`, `buckle-320` on the strap and buckle boxes |
| W2.11 `heather_sprig` | `sprig-420` = the sprig that rises out of the pocket |
| W2.12 `heather_divider` | `divider-800` = `.band-sprig` under the headings on cream paper |
| W2.13 `heather_floret_1..3` | `floret_N-96` + `--ht-florets` → the florets of a sent reply |
| W2.14 `locket_rim` | #00FF00 oval window measured (`manifest rim.window_pct`), keyed → `rim-640` round every oval photo; photo and lid sit in the window; the locket takes the part's ratio. No window → warning, photos stay without a rim |
| W2.15 `locket_lid` | `lid-560` = the lid that swings open (instead of the brass crop) |
| W2.16 `thistle` | `thistle-400` = home signature, RSVP closing |
| W2.17 `card_small` | oval #00FF00 window measured (`manifest card_small.window_pct`), keyed → `card_small-760` = the card in the envelope; the portrait slot sits on the window. No window → warning, card stays cream paper |
| W2.18 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`, bottom-aligned) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print/invitation_front_5x7`, `invitation_back_5x7` | **by hand** (one block; boxes are measured on the art, G149): `lib/print/layouts.ts` → those sheets, `node scripts/build-print-assets.ts --theme highland-tartan-thistle` — steps in GPT_PROMPTS.md PAKET 6 |

## Deviations from the standard

- No W1 comps (the design starts from docs/24) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi, Celestial): the theme is rendered by the platform only.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).
- No colour-palette variants yet (G153/G177 adds them per design).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves, Safari's handling of
`@property --clear` (without it the venue photo simply appears) and of the 3D flap's backface.
