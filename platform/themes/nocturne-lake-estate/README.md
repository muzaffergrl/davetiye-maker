# Nocturne Lake Estate (22)

Black paper, champagne gold and candlelight by Lake Como. Independent product (Codex draft `codex/nocturne-lake-estate`,
made a platform theme in G142). Status: **coming** (`lib/marketing/config.ts`) — sale and price wait for approval.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5, `story_1` 4:5, `story_2`/`story_3` 4:3, `venue` 16:9), 73 copy keys (`node scripts/copy-manifest.ts --theme nocturne-lake-estate`) |
| `content.demo.json` | = `collections/22_Nocturne_Lake_Estate/content.demo.json` (fictional Eleanor & Luca, Villa Nocturne, Lake Como; all URLs `null`; sample photos are theme assets) |
| `index.html` … `rsvp.html` | envelope · home · story (gallery) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes / thank-you mode (G075) |
| `site.js` | `MOTION` (envelope steps, scenes), long names, scenes, countdown (`data-target-utc` from the platform), envelope, gallery viewer |
| `build_images.py` | GPT PNGs → `img/` (interim envelope cut, placeholders, og, favicon, `manifest.json`) |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Bellagio),
music + opening sounds (`lib/audio/catalog.ts`: Evening Strings; seal 0 · paper 450 · slide 1700 · chime 3000 ms),
calendar, thank-you mode, editable texts. Fonts: Cinzel, Cormorant Garamond, Jost (Google Fonts; no font files).

## Opening (docs/11 §7.3, kapak) — interim pieces

Tap → the gold wax seal lifts off and drops away (0–650 ms) → the black flap turns up on its hinge to 90° (450–1150) and
its inside takes over and lays back (1150–1800) → the charcoal card (portrait, "Our wedding", names, date) rises out of
the pocket (1700–3000) → comes forward over the pocket (3000–3350) → home (3450, view transition `invite-card` onto the
home title block). Seal, flap, inner flap, back, pocket and card are separate layers.

**Interim:** the draft has one closed envelope picture (`envelope.png`). `build_images.py` cuts it: flap (`kapak_kes`
"v", colour method), pocket = closed − flap, seal = a disc from the closed picture; under the seal the flap and pocket
carry the same envelope's paper moved from just above / below and toned to the ring around the seal (a faint round
mark stays on the pocket where the seal sat). The inside of the flap is the flap mirrored and toned down; the inside of
the envelope is the body blurred and darkened; the card is a plain crop of the flap's paper, lifted in tone. Nothing is
drawn (K21). The real parts — `envelope_closed` without the seal, `closure`, `envelope_open`, `card_small` (#00FF00
window), `bg_page`, `accent_1`, `divider`, `web_hero` and the PAKET 2 photos — are ordered in
`collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md`; when they arrive `build_images.py` switches to them.

## Pages

- **Home:** Lake Como at dusk full height (GPT `hero.png`), names in Cinzel capitals on the sky; invitation beside the
  portrait (full names with display-name fallback, date block, venue, ceremony time, RSVP, deadline), countdown (plain
  numerals), calendar; gallery teaser with `story_1`; the lake band with the first four programme rows; signature +
  "Open the envelope again".
- **Story:** asymmetric gallery (tall `story_1`, two landscape frames), captions, native `<dialog>` viewer (arrows,
  Escape). Story intro + date as one sentence.
- **Details:** date heading, programme timeline (1 px rule; no drawn dots), ceremony sentence, calendar, venue photo,
  map, dress code, travel, registry, FAQ (`+`/`×` outside the accessible name).
- **RSVP:** reply card with the shared form; "(optional)" stays outside the question label (`<legend><span
  data-field=".label">`); "Replay the envelope".

Nav: fixed bottom bar (the draft's top menu toggle was replaced: the platform's sound button sits top-left, and the
standard checks drive the visible nav).

## Deviations from the draft / standard

- No W1 comps (the design came from the Codex draft, not from PAKET 5) → no comp map; `theme-check --compare none`.
- The draft's CSS card (border + flat colour) and timeline dots were removed (K21); the card is GPT paper.
- Demo couple changed from the draft's Olivia & James (same as Crimson) to Eleanor & Luca, Villa Nocturne.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network.
