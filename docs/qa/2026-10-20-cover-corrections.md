# Nine envelope corrections — 2026-10-20

Scope: Nocturne Lake Estate, Velvet Jewel Box, Grand Theatre Premiere, Orient Express Voyage, Maison Pâtisserie, Celestial Observatory, Azulejo Mosaic, Sky Lantern Festival and Music Box Ballerina. Kintsugi & Washi and Riad Lantern Nights were tested, but their designs and published media were left unchanged.

## Corrected causes

- The card previously exceeded the wide/short housing before extraction and stayed behind it until the end. Its initial size now follows the physical housing; a reversible discrete stacking animation brings it forward after clearing the opening.
- Fully unfolded leaves exceeded the phone viewport. A separate object group makes room for the complete unfolding construction without scaling down the final card. Velvet's book hinge has its own horizontal offset.
- Some source interior art contains transparent pixels. Replacing its alpha with the envelope silhouette exposed black RGB in those pixels. The art is now flattened against the model's paper colour, and the blank paper stock is sampled without reusing its invitation frame, before the preserved physical cut mask is applied.
- Celestial and Azulejo have newly generated matching material surfaces; other inner pages and editable personal content are preserved. Prompts are in docs/design/envelope-v4-prompts.md.
- The nine departure pages opt out of cross-document 3D snapshots; moving layers no longer carry costly drop-shadow filters. Sky Lantern lifts the card upward, fades the pouch and leaves the card in front.
- Catalogue clips and responsive posters use versioned v4 paths. Clips are constant 30 fps. An unpainted black CDP compositor interval during the Nocturne document switch was removed; actual rendered scene frames are retained. All nine output clips pass black-frame scanning.

## Pre-release verification

- 32 focused checks passed: all eleven five-page/editable-media/thank-you contracts, nine exact cut-mask checks and a regression check for Maison's formerly black transparent areas.
- 44 completed openings passed at 390×844, 320×740, 1280×900 and 844×390; no overflow, missing assets, wrong landings or clipped final cards.
- All eleven reduced-motion and skip flows passed.
- 33 mid-animation cancellations, restored covers, repeat openings and close flows passed across all eleven models.
- Three cold-image-loading/cancel/skip scenarios passed.
- All nine corrected models passed a 390×844 browser run with 4× CPU throttling, retaining the complete foreground card and responsive animation. This is browser emulation, not a physical-device certification.
- Nine output clips pass a 95%-black-frame scan; each stays under 1.5 MB.
- Refreshed latest-main state before integration. The preceding eleven commits include unrelated launch, print and customer-package work; their changes are preserved. Only the nine cover/video entries are merged into the latest marketing asset manifest.

Production and full CI results are verified after publishing and recorded in the local release report; the above are completed pre-release checks.
