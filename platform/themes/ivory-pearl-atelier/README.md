# Ivory Pearl Atelier — design 49

Original warm ivory cotton paper, champagne silk, fine gold edging and a single mother-of-pearl closure. All artwork comes from `collections/49_Ivory_Pearl_Atelier/assets/gpt/`; personal data is rendered as editable HTML. The Clara & Julian demo uses the existing fictional sample photographs from design 03, disclosed in the collection brief and Etsy description.

## Motion signature

The pearl rotates and follows an arc to the right (0–900 ms); the two clipped halves of the actual silk bow separate softly (120–1220 ms). The flap rotates on the original upper hinge (1100–2150 ms). The letter follows a rising, gently tilted arc (1950–3300 ms) and comes forward (3300–4050 ms); navigation begins at 4200 ms. This design uses no camera flash, falling particles or borrowed photo-strip animation. Interior photos reveal from left to right with a single nacre light pass; three memory photographs open into a fan. After RSVP success the confirmation receives one soft light pass and a settling title.

Keyboard activation, Skip, Replay, repeat visits, back navigation and reduced motion are supported. The shared platform supplies the editor, RSVP and guest list, media upload, calendar, map, music, privacy, languages and downloads.

## Technical preparation

`python3 platform/themes/ivory-pearl-atelier/build_images.py` crops and masks the existing GPT source only. All envelope layers use the exact closed body's 1394×781 coordinate system and 960×538 export footprint. The open source supplies the existing silk lining and pocket; the closed body's geometry never swaps to a differently sized open object. The liner samples only opaque silk, so transparent RGB cannot become a black flap. Sibling depth is flattened for the rising letter to paint in front of the opened flap.

Images total approximately 491 KB; theme files remain below 3 MB. `img/manifest.json` declares the share image and icon for production tracing. Printable card and back use the approved blank ivory card; names, date and wording remain separate text.

## Validation

- Production build, function tracing and JavaScript budgets passed.
- Final smoke test: 45/45 checks, including buyer start, photo crop/upload, publish, QR decoding, guest reply and its display in the editor (`package/qa/checks.json`).
- Catalogue, theme, translations, sample photo and opening regression checks: 78/78 passed.
- Five viewport checks, keyboard and reduced-motion checks: `package/shots/browser-checks.json`.
- Printable 5×7 invitation with bleed rendered; 10-page START HERE guide links and start QR checked.

Real mobile-device testing remains separate from Chromium mobile emulation. Etsy upload requires a connected seller browser; publishing a storefront product does not create an Etsy listing.
