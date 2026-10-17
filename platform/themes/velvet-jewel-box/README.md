# Velvet Jewel Box (23)

Aubergine velvet, champagne satin and rose gold: a ring box instead of an envelope. Design brief:
`collections/23_Velvet_Jewel_Box/DESIGN_BRIEF.md`; task G161 (docs/24 wave 23–28). Status: **coming**
(`lib/marketing/config.ts`) — the box and every decor part are interim stand-ins until the GPT parts arrive.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1..3` 4:5 — the display's panels, `venue` 16:9), 84 copy keys (`node scripts/copy-manifest.ts --theme velvet-jewel-box`) |
| `content.demo.json` | = `collections/23_Velvet_Jewel_Box/content.demo.json` (fictional Isabelle & Julian, Halvern House, New York; URLs `null`; no sample photos yet) |
| `index.html` … `rsvp.html` | box · home · story (carousel) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes, foil, satin sweep, carousel, satin page change / thank-you mode (G075) |
| `site.js` | `MOTION` (box steps under the standard key `envelope`, scenes, carousel), long names, scenes, countdown, the box, the carousel |
| `build_images.py` | GPT parts → `img/` (interim stand-ins from toned GPT textures when the parts are missing), placeholders, og, favicon, `manifest.json` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin New York), content
blocks (G138: `data-blocks`, `data-travel`, `data-menu`), music + opening sounds (`lib/audio/catalog.ts`: Music Box;
ribbon 0 · clasp 650 · slide 1900 · chime 3000+100 ms), calendar, thank-you mode, editable texts, languages (G144),
printable invitation (G139, `lib/print/layouts.ts`, composed). Fonts: Bodoni Moda + Pinyon Script (Google Fonts, no files).

## Opening (motion signature)

Tap → the satin bow slides off the lid, down and away (0–650 ms) → the box gives a small press (450–700) → the velvet lid
turns back on its hinge to 90° (650–1300; its top edge travels down to the hinge row so the hand-over has no jump) → the
satin inside of the lid takes over at 90° and stands up (1300–1900) → a soft light sweeps across the satin (1700–2600, a
gradient masked to the lining's own alpha) → the card rises out of the box from behind the front of the base (1900–3100)
→ comes forward (3100–3450) → home (3550, view transition `invite-card` onto the home title block). Closed, a slow glint
passes over the lid every 4 s (the tap invitation; none with reduced motion). Reduced motion: tap → home directly.

**Interim pieces:** no W2 parts yet. `build_images.py` assembles a stand-in box on the same 1024×1536 canvas GPT will use
— plain rectangles cut from GPT textures of other collections (17's velvet-like tile toned aubergine, 14's satin tile
toned champagne, 01's ivory paper for the card, 14's satin bow toned champagne for the closure) — and cuts it exactly as
it will cut GPT's `box_closed` / `box_open` (seam = lid/base, hinge = lining/cushion). The stand-in reads as a placeholder
box on purpose. When `parts/box_closed.png` and `parts/box_open.png` exist the build switches to them (and to
`closure`, `card_small`, `bg_page`, `satin_bg`, `web_hero`), measures seam and hinge (a reading off the prompt's
geometry falls back to it with a warning; override `SEAM_PCT` / `HINGE_PCT`), keys out and measures the card's #00FF00
window, and writes `img/manifest.json` `stage` **and** the `/* stage:begin … stage:end */` block of `site.css` (piece
places, stage proportions, lid drop, card rise/forward, the card photo on the window) — no hand copy; the theme test
compares CSS and manifest. Output file names are fixed (`SIZES`), whatever size GPT delivers. Dry run without the art:
`python3 tools/gpt_kuru_deneme.py --tema velvet-jewel-box --sekil collections/23_Velvet_Jewel_Box/assets/gpt/kuru_sekil.json`.

## Pages

- **Home:** velvet full height, names in Pinyon Script with the champagne foil shimmer (a light gradient clipped to the
  letters, run once); invitation beside the portrait on champagne satin (a light sweeps across the satin as it comes in);
  countdown (plain numerals), calendar; story teaser; the day band on satin; bow + "Open the box again".
- **Story:** the turning display: three 4:5 photos on a cylinder (38° apart, radius 1.45 × the photo width); drag or swipe
  (vertical drags still scroll the page), snap to the nearest, arrow buttons, ←/→/Home/End keys, a tap on a side photo
  turns to it; only the front caption shows; at the ends the arrows are `aria-disabled` (they keep keyboard focus);
  the "2 / 3" count is a polite live region. Reduced motion or no JavaScript: the same figures as a scroll-snap slider.
- **Details:** order of the day on satin beside the venue photo; map, calendar, dress code, blocks, travel, menu,
  registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** reply card on velvet (a faint sweep), the shared form; when a reply is sent the satin light crosses the
  card again and "Thank you!" gets the foil shimmer; closing bow, "Open the box again".

Page change (all pages): the new page is drawn across the old one like satin — a feathered diagonal mask wipe while the
old page dims and slides back a little (`::view-transition-new(root)`); scene steps settle like fabric laid down (tilted
back, then flat), "drape" steps unroll from the top. The other 22 themes cross-fade.

## Deviations

- No W1 comps (wave 23–28 is built before its GPT parts) → `theme-check --compare none`.
- No particles (accents), no pearl divider, rings or display plinth: their prompts were dropped from GPT_PROMPTS.md
  (G167 — nothing used them); they come back only together with a page that uses them.
- The carousel has no photo viewer: the display is the large view.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the real GPT box.
