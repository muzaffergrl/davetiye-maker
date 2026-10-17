# Orient Express Voyage (25)

A vintage rail journey: bottle green, brass and ivory in the style of a 1930s travel poster (lithograph). New design of
the docs/24 wave, built in G163 **before its GPT parts exist**. Status: **coming** (`lib/marketing/config.ts`, `[PRICE]`).

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1..3` 3:4 carriage windows, `venue` 3:2), 88 copy keys (`node scripts/copy-manifest.ts --theme orient-express-voyage`) |
| `content.demo.json` | = `collections/25_Orient_Express_Voyage/content.demo.json` (fictional Amelia & Rafael, Palazzo Ferrovia, Venice; all URLs `null`; no photos yet) |
| `index.html` … `rsvp.html` | ticket wallet · home · story (carriage windows) · details (the itinerary) · RSVP (boarding pass) |
| `site.css` / `thank-you.css` | tokens, layout, opening keyframes, route line, scenery, stamp / thank-you mode (G075) |
| `site.js` | `MOTION` (wallet steps, scenes), long names, scenes, countdown, wallet, scroll-motion fallback, tag swing |
| `build_images.py` | GPT parts → `img/` (per piece: the GPT part if present, else an interim palette tone), og, favicon, `manifest.json` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Venice), music +
opening sounds (`lib/audio/catalog.ts`: Evening Strings; clasp 0 · page 600 · slide 1500 · chime 2600 ms), calendar,
thank-you mode, editable texts, languages (G144 dictionaries carry this theme's texts), printable invitation
(`lib/print/layouts.ts`, composed). Fonts: Limelight + Cormorant Garamond (Google Fonts; no font files).

## Opening (own type "cuzdan" — a ticket wallet; docs/11 §7)

Tap → the strap unbuckles: the buckle end slides right and the tail left (0–700 ms) → the cover swings open on its left
hinge to −180° (600–1500; its inside `wallet_cover_in` is the back face, so the hand-over happens at 90°) while the wallet
scales to `--open-scale` and moves right by half its width so the two-wallet-wide spread is centred (site.js: 94 % of the
screen) → the first-class ticket slides up out of the pocket (1500–2600; the pocket lip stays in front) → comes forward and
glides to the middle (2600–3000) → home (3100, view transition `invite-card` onto the home ticket block). Strap halves,
cover front, cover inside, inside panel, pocket lip and ticket are separate layers. Measured 3.4 s tap → home (local
production build, Chromium 390×844).

## Motion signature (docs/24)

- **Route line:** an `<svg>` path (`pathLength="1"`, dash offset 1 → 0) laid over the GPT map — an interface line, not decor.
  CSS scroll-driven animation (`view-timeline: --trip`, `animation-timeline`) where supported; elsewhere site.js sets
  `--route` from the scroll. Home: the journey band; details: the map stays in view (sticky) while the stations pass and the
  line reaches the end with the last one. Reduced motion: drawn at once.
- **Stations:** each schedule row is its own scene on details (arrives as it scrolls in); on home the first four arrive one
  by one (`MOTION.stagger`).
- **Luggage tag** (home, RSVP link + reply-by date on its face) swings from its eyelet when it comes into view.
- **Carriage windows:** the photo is 116 % of the glass and travels ±7 % as the window crosses the screen (scenery).
- **Boarding stamp:** `html[data-rsvp-replied]` (rsvp:state success) presses the GPT stamp onto the pass.

## Interim pieces (no GPT parts yet)

Every image in `img/` is currently a flat palette tone with a soft light fall-off (`img/manifest.json` → `interim` lists
the 16 waiting parts); the carriage-window frame is transparent (the photo stands alone). No shape, line, ornament or
texture is drawn (K21). The prompts are in `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md`; when parts
arrive run `build_images.py` and align the `/* manifest stage.* */` percentages in `site.css` with the new manifest.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, the GPT artwork itself, slow network.
