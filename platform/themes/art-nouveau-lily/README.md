# Art Nouveau Lily (37)

A cream envelope closed by three petal flaps under a stained-glass lily; sage, cream, lilac and gold, like an Art Nouveau
(Mucha-style) poster with stained glass. New design of the 33–38 wave (`docs/24_YENI_TASARIMLAR.md` row 37, task G186).
Status: **coming** (`lib/marketing/config.ts`, price `[PRICE]`). Since 2026-10-22 the theme is built from all of its
own GPT parts (PAKET 5) and the demo shows its own PAKET 2 photos; sale, price and approval wait for the user's eye check.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait`, `story_1..3` arched 5:7, `venue` 16:9), 82 copy keys (`node scripts/copy-manifest.ts --theme art-nouveau-lily`; `home_intro`, `home_location` carry their own label) |
| `content.demo.json` | = `collections/37_Art_Nouveau_Lily/content.demo.json` (fictional Odette & Felix, Villa Mirelle Gardens, Nancy, Grand Est, France; June 19, 2027; all URLs and media `null`) |
| `index.html` … `rsvp.html` | closed envelope · home · story · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the envelope (interim cuts, hinges, keyframes), the stained-glass light, the whiplash reveal / thank-you mode (G075) |
| `site.js` | `MOTION` (opening steps, scenes, accents), long names, card fit, scenes, the light moving through the windows (`--p`), countdown, opening, the lily petals of a sent reply |
| `build_images.py` | GPT parts → `img/` (cut, keyed, scaled; the envelope layers registered by their measured alpha boxes; placeholders, og, favicon, `manifest.json`) + `parts.css` |
| `parts.css` | **generated** by `build_images.py` (do not edit): the rules for the GPT parts present in `parts/`, with the envelope's measured `--env-ratio` and the card's text start. Linked by every page after `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Nancy), music +
opening sounds (`lib/audio/catalog.ts`: Garden Waltz; touch 0 · glass chime 300 · side petals 1100 · centre petal 1500 ·
card 2400 · chime 3050 ms), calendar, thank-you mode, editable texts, languages (G144; two new strings, "Invite you to
celebrate" and "Love in full bloom", translated in `lib/i18n/dict/site/*`). Fonts (Google Fonts, no font files):
Ephesis (names, script headings; latin-ext), Federant (Art Nouveau display face for headings, labels, buttons; latin
only — the design's texts are English, names never use it), Linden Hill (body; latin-ext). None of the three is used by
designs 01–32.

## The envelope page (K23 strict)

Like the catalogue cover (`components/marketing/InvitationCover.tsx`): on the sage ground the host line ("Together with
their families", `data-field="host_line"`), "Invite you to celebrate" (`envelope_kicker`) and the names in Ephesis; the
envelope in the middle; the date · city and region and "Tap to open" below; Skip in the corner.

The envelope is not the V flap + wax seal of 01–21 (nor 26's four square folds): its front is three **petal flaps** —
left, right and centre — whose points meet under a round **stained-glass lily medallion**, over a pocket whose top edge
rises softly to a point.

## Opening — the envelope opens like a lily (3.55 s)

Tap → host line, names, date and "Tap to open" rise away (0–450 ms) · a **band of light sweeps** across the envelope
(100–1000) and the **glass glows** — light behind the medallion (300–1000) · the **medallion lifts away** (800–1300) ·
the **two side petals open outward** on their side hinges (`rotateY` 0 → ∓122°, 1100–2000): past 90° their **lilac
lining** turns into view and they stay curled back, like the outer petals of a lily · the **centre petal opens upward**
on its top hinge (`rotateX` 0 → 128°, 1500–2400) · each petal then drops behind the card (z-index) · the card with the
arched portrait, "Our wedding", the names and the date **rises out of the pocket** (2400–3050) · comes forward
(3050–3450) · home at 3550 ms (view transition `invite-card` onto the home card).

Back, pocket, the three petals (each one 3D wrapper with a front face and a lining face, `backface-visibility: hidden`;
the 90° hand-over of docs/11 §7.1 inside the wrapper), medallion, light and card are separate layers; nothing is one
picture that fades. The lining face is cut with the mirror of the petal's own shape, so it lies exactly under the
petal once turned (interim: mirrored `clip-path`; GPT: `petal_*_m` masks made by the build from the petal itself).

Reduced motion: no opening (tap → home), no sheen, no tap-hint breathing, no colour reveal or moving light in the
windows, the gold lines drawn at once.

## Pages

- **Home:** like a Mucha poster — a gold mosaic **halo** (GPT) behind the cream card from the envelope, lily sprays (GPT)
  at its sides; the arched portrait waits grey and comes alive as a band of light passes through it, then "Our
  wedding", the names in Ephesis, weekday + date, venue, city. The invitation on a cream band ("Love in full bloom",
  a gold whiplash line drawn under it, host line, full names with display-name fallback, request, the date in three
  lines, venue, ceremony time, RSVP + deadline, countdown in plain numerals, calendar); the story teaser in a
  stained-glass arch; the day on cream (first four programme rows, the whiplash line); signature — a lily spray, names,
  "Open the invitation again".
- **Story:** three moments down the sage page, left / right / left, each in a tall **stained-glass arch** (5:7): the
  photo waits dim and grey like glass at dusk; when its scene enters the view a band of light passes through it
  diagonally (`--band`, a `@property` on the slot, `::before` light) while its colours come alive (`filter` from
  grayscale to none), then the Roman numeral (CSS counter) and the caption; while the page scrolls a softer light keeps
  moving through each window (`--p`, `::after`). Story intro + date as one sentence.
- **Details:** date heading, the programme on a cream sheet (whiplash line, gold hours, 1 px rules), ceremony sentence,
  calendar; the venue photo lit by the same passing light; map; dress code, good to know (G138), travel & stay, menu,
  registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** the shared form on a cream sheet; "(optional)" outside the question label; a lily spray and "Open the
  invitation again". When a reply is sent (`rsvp:state` success) six **lily petals** drift down over the thank-you
  panel (GPT sprite only; none without it).
- Text steps come through like colour through glass: from a soft blur they clear and settle (not the shared rise, not
  29's glint).

## Interim build (until the GPT parts arrive)

The design's own parts are ordered in `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` (PAKET 5 website
layers, PAKET 2 sample photos, PAKET 6 print sheets). Like Celestial Observatory (G168) the theme is built from GPT pixels
that already exist, cut and toned, nothing drawn (K21):

- cream paper = `collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png` (plain ivory paper) toned cream with its own
  grain (`tonla`);
- sage ground = `collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png` (plain mottled pale-green paper) toned
  deep sage;
- lilac lining = `collections/15_Cherry_Blossom/assets/gpt/parts/bg_tile.png` (plain blush paper) toned lilac;
- the envelope's back is the cream paper with a lilac rectangle of lining; the pocket and the three petals are the cream
  paper **cut** by `clip-path` polygons (a cut, like `tema_build.kapak_kes`; their lining faces are the lilac paper cut
  by the mirrored polygon). Light is CSS (sheen, glow); shades are the paper's own brightness;
- no medallion, card frame, arch frame, halo, lily sprays, whiplash line or drifting petals: their elements stay hidden
  (`display:none`) until `parts.css` shows them. The look is plain until then; sale needs the GPT parts + an eye check.

The design's own parts need no template work when they arrive (G167): `python3 build_images.py` takes each part that
exists in `collections/37_Art_Nouveau_Lily/assets/gpt/parts/` and writes `parts.css`; the manifest lists `parts.used`
and `parts.waiting_for_gpt`. `python3 tools/gpt_kuru_deneme.py --tema art-nouveau-lily --sekil
collections/37_Art_Nouveau_Lily/assets/gpt/kuru_sekil.json [--theme-check --stress]` rehearses the drop-in with neutral
test images (repo untouched) — passed 16/18 (only PAKET 6, by hand at the time; wired on 2026-10-23).

## Built from the GPT parts (2026-10-22)

All PAKET 5 parts are used (`img/manifest.json` `parts.used` = 13, `waiting_for_gpt` empty); nothing is drawn (K21). The
"Interim build" section above now describes only the look of a missing part. The demo shows the design's PAKET 2 photos
(`public/demo/art-nouveau-lily/*`, `lib/claim/demo-photos.json`, `node scripts/build-demo-photos.ts --theme
art-nouveau-lily`).

**The envelope (eye check 2026-10-22).** W2.4–W2.6 were asked on one canvas, stacked 1:1, but GPT drifted between them:
`petal_right` came 20 % smaller than `petal_left` (same 0.39:1 shape) and stopped short of the right edge, so the lilac
back showed beside it; `petal_centre` started 11 % below the back's top and came 9 % narrower (GPT's own note: it may not
line up), so the back showed above it; the pocket came 2 % wider than the back. `build_images.py register()` lays each
layer by its measured alpha box on a canvas of the envelope's size (the back's alpha box, 0.756:1), scaled uniformly:
the pocket spans the width with its foot on the back's foot (× 0.98); the left petal spans the height from the left edge
(× 0.98), the right petal the same from the right edge (× 1.23, a mirror box of the left); the centre petal spans the
width from the top edge (× 1.10, 56.6 % high, its tip on the medallion). site.css keeps its stacked layers and edge
hinges; the boxes are in `manifest stage.boxes_pct` (the asked canvas in `stage_asked`). Closed, no lilac shows; the
petals meet under the medallion. **Card text:** the first build set its top padding in % of the card's width, but a
padding % is of the envelope's width — the text started 17 % too low; now 3 % under the window, the texts sized by the
card (cqw), `fitCard` keeps the last line above the card's bottom margin.

## What waits for GPT

Nothing of PAKET 5 or PAKET 2 (no part had to be regenerated: `petal_right` is upscaled 1.23×, still above its display
size). PAKET 6 is in (2026-10-23): `lib/print/layouts.ts` takes `print/invitation_front_5x7.png` /
`invitation_back_5x7.png` as one `cover` ground per side, the text boxes measured on the art (G149);
`node scripts/build-print-assets.ts --theme art-nouveau-lily` writes `public/print/art-nouveau-lily/front.webp` and `back.webp`.

## Deviations from the standard

- No W1 comps (the design starts from docs/24, not from PAKET 5 W1) → no comp map; `theme-check --compare none`.
- No `devRender` / `DEV_CONTENT` (as Nocturne, Kintsugi, Celestial): the theme is rendered by the platform only.
- The 90° hand-over of each petal happens inside one 3D wrapper (front face + lining face) instead of two separate
  animated layers; the lining is the GPT lining texture cut by the petal's own (mirrored) shape.
- One generated stylesheet (`parts.css`) beside `site.css` (docs/11 §1 lists `site.css` only).

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, `theme-check.cjs` on a production build
(checked on 2026-10-22 in Chromium only: demo route at 360×640 and 390×844, the opening seeked frame by frame, all pages,
40-character names on the card), Safari's handling of
`@property --band` / `--flow` (without it the light band and the whiplash mask jump to their end state: the photo and the
line simply appear) and of `preserve-3d` with `backface-visibility` on the petals.
