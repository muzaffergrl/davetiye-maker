# Marigold & Mehndi (33)

A fuchsia silk envelope held in a gold laser-cut paisley sleeve, marigold garlands, henna, brass diyas and carved
Rajasthani jharokha arches; saffron, fuchsia and gold. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md`, task
G182). Status: **coming** (`lib/marketing/config.ts`) — the design's own GPT parts do not exist yet; sale, price and
approval wait for them and for an eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` arched 4:5, `venue` 16:9), 83 copy keys (`node scripts/copy-manifest.ts --theme marigold-mehndi`) |
| `content.demo.json` | = `collections/33_Marigold_Mehndi/content.demo.json` (fictional Anaya & Kabir, Gulmohar Haveli Gardens, Jaipur, Rajasthan; November 20, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope keyframes, the henna flow / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, petals, scenes, henna, diyas, accents), long names, card fit, scenes, diya rows, countdown, opening, petals |
| `build_images.py` | GPT textures → `img/` (interim toning, gold crop, placeholders, og montage, favicon, `manifest.json`); every optional GPT part that exists → `img/` + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the optional GPT parts present in `parts/`; a comment only while none exists. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Jaipur),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; tassel 0 · sleeve 300 · flap 1250 · card 2500 ·
forward 3150 ms), calendar, thank-you mode, editable texts, languages (G144; four new strings — "Together with their
families", "invite you to celebrate", "Let the celebrations begin", "Open the envelope" — translated in
`lib/i18n/dict/site/*`). Fonts: Rozha One (names, headings) + Yrsa (body) — Google Fonts, no font files; neither is used
by designs 01–32 (docs/24's "Cormorant Infant" is design 17's body font, so Yrsa instead).

## First page — the closed envelope (K23 strict)

The catalogue cover's order (`components/marketing/InvitationCover.tsx`): "Together with their families", "invite you
to celebrate", the names (Rozha One), the envelope in the middle, below it the row of diyas, the date · city and "Tap to
open"; Skip in the corner. The envelope is **not** the V flap + wax seal of 01–32: a portrait silk envelope with a
straight top flap, held shut by a gold sleeve wrapped round its middle (the sleeve covers the flap's lower edge), a silk
tassel hanging from the sleeve.

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

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Celestial Observatory (G168) the theme is built from GPT pixels
that already exist, cut and toned, nothing drawn (K21):

- fuchsia silk = `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png` (ivory satin waves) toned fuchsia with its
  own sheen (`tonla`); the envelope's back, pocket and flap are rectangles of it (darker back, darker flap);
- velvet = `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png` (plain navy paper) toned velvet-fuchsia; the page
  ground is the same, darker and smoother;
- saffron paper = `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png` (plain cotton paper) toned saffron-ivory;
- gold = the plain metal field inside `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png` (a rectangle
  between the laurel); the interim sleeve is a plain band of it with light falling on it;
- no tassel, petals, arches, henna, diyas, flames, garlands or mehndi pattern: their elements stay hidden
  (`display:none`) until `parts.css` shows them, so the photos are plain 4:5 crops for now. The look is plain until then;
  sale needs the GPT parts + an eye check.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/33_Marigold_Mehndi/assets/gpt/parts/` and writes `parts.css`; the manifest lists `parts.used` and
`parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema marigold-mehndi --sekil
collections/33_Marigold_Mehndi/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with neutral
test images (repo untouched) — passed 18/20 (only PAKET 6, by hand).

## What waits for GPT

| Part | Then (automatic) |
|---|---|
| W2.1 `silk`, W2.14 `velvet`, W2.15 `paper` | same roles, instead of the toned interim textures (the page ground = the velvet at 66 %) |
| W2.2 `sleeve` | `sleeve-900` = the sleeve band (laser-cut, the silk shows through) instead of the plain gold |
| W2.3 `petal_1..3` | `petal_N-96` + `--mm-petals` → the 14 petals of the opening, the 12 of a sent reply |
| W2.4 `jharokha` | #00FF00 window measured (`manifest arch.window_pct`, warning when not 4:5), keyed → `arch-640` round every portrait photo; the window's shape → `mask_arch.png`, the photo cut to it. No window → warning, photos stay plain |
| W2.5 `henna` | `henna-720` over each arch, flowing in line by line after its photo |
| W2.6 `diya`, W2.7 `flame` | `diya-160` → the rows (opening 5, home 5, RSVP 3) appear; `flame-96` lit one by one |
| W2.8 `garland` | `garland-900`: top of the opening and the home hero, small under headings |
| W2.9 `mehndi_pattern` | `mehndi-640` behind the story page (14 %) |
| W2.10 `card_small` | arched #00FF00 window measured (`manifest card_small.window_pct`), keyed, shape → `mask_card.png` → `card_small-860` = the card from the lining; the portrait slot sits in the window, the text starts below it. No window → warning, card stays saffron paper |
| W2.11 `tassel` | `tassel-200` hanging from the sleeve: sways, swings on tap |
| W2.12 `envelope_front`, W2.13 `flap` | `env_front-900`, `flap-900` instead of the silk rectangles |
| W2.16 `web_hero` | `og-1200x630.jpg` (`tema_build.og_kirp`, bottom-aligned) instead of the montage |
| PAKET 2 photos | `npm run seed -- --photos` / theme-check photos (now 03's photos, noted) |
| PAKET 6 `print/invitation_front_5x7`, `invitation_back_5x7` | **by hand** (one block; boxes are measured on the art, G149): `lib/print/layouts.ts` → those sheets, `node scripts/build-print-assets.ts --theme marigold-mehndi` — steps in GPT_PROMPTS.md PAKET 6 |

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Celestial Observatory, Kintsugi): the theme is rendered by the platform only.
- The envelope is built from texture rectangles + the sleeve band until the GPT pieces (W2.2, W2.12, W2.13) arrive; it
  uses no `parts_prep` cut (§7): the pieces are drawn on their own canvases at the stage boxes above.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).
- No `variants.css` (G177 palettes are for 22–32).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the GPT parts themselves, Safari's handling of
`@property --flow` (without it the henna flow is skipped and the photo simply appears).
