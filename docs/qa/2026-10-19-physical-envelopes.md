# Eleven physical envelope redesigns

## Request and scope

Replace the eleven similar V-flap covers with visibly distinct constructions and correct their opening/closing mechanics. Preserve the completed model-specific interiors, RSVP, demo content, older products, commercial settings and account data.

## Reference review

Reviewed the existing Blush Garden Rose, Mediterranean Lemon and Olive & Ivory openings on the live site, alongside their layer geometry and controller source. Their useful contract is a continuous physical sequence: closure, hinge, lining/pocket, card extraction, home. The prior eleven-theme controller split ordinary closed V-flap images into arbitrary halves; this release instead generates a different object and cuts its actual fold/spine boundaries.

## Models

| Theme | Construction |
|---|---|
| Nocturne Lake Estate | Curved charcoal correspondence flap, illustrated pocket, seal attached to flap |
| Velvet Jewel Box | Octagonal velvet case with a left book hinge |
| Grand Theatre Premiere | Paired burgundy velvet gatefold doors |
| Orient Express Voyage | Long horizontal ticket sleeve, card exits on the right |
| Kintsugi & Washi | Four diagonal folds, one separately released gold fastening |
| Riad Lantern Nights | Horseshoe arch with two side-hinged doors |
| Maison Patisserie | Scalloped pistachio parcel flap |
| Celestial Observatory | Curved crescent shutters meeting at an S seam |
| Azulejo Mosaic | Three independently folding tile-patterned panels |
| Sky Lantern Festival | Coral silk pouch with a scalloped mouth |
| Music Box Ballerina | Oval satin case with a top hinge |

## Implementation

Built-in imagegen produced eleven independent transparent closed objects without personal text. `img/v3-*` contains the resulting runtime masters, physical faces, reverse surfaces and linings. Front/back faces rotate on their actual hinge; reverse surfaces use the same theme's generated stationery art. The Nocturne seal is not left duplicated on the stationary pocket. Kintsugi's fastening is released as one object before its four folds open.

`envelope-v3.js` uses reversible Web Animations timelines. Escape or Close envelope reverses an opening from its current position. Closing cancels navigation; replay closes and reopens. Reduced motion, keyboard entry, skip, remembered sessions and back/forward returns are supported. The card remains behind its pocket until it clears the lip.

Fresh JS/CSS, cover and video filenames isolate browsers from the previous cached covers. Catalogue metadata retains the required `Your guests tap the envelope.` prefix and points to the new media. Theme versions are 1.2.0. Close-button text remains an editable `theme.copy` field.

## Verification before release

- 32 focused Node tests passed, including personal text/photo/thank-you rendering and protected interior hashes.
- 22 rebuilt-theme five-page/media contracts passed. Production manifest parsing validates the custom Close envelope key and its panel label.
- 88 protected interior/RSVP/base files and other products' marketing copy remain unchanged.
- 44 real browser openings at 320, 390, 1280 and 844 landscape widths passed, plus eleven reduced-motion and eleven skip flows.
- 33 interruptions at 600, 1700 and 3400ms closed to the exact resting state with no remaining script animations.
- All eleven long-name, replay/back, skip-during-opening, double-click and reduced-motion-change checks passed.
- Eleven actual browser opening MP4s were encoded, with metadata durations read from encoded media rather than wall time.
- Additional Nocturne/Kintsugi seal checks and production checks are recorded in the authoring release report after final deployment.

Browser verification uses desktop Chromium with responsive viewports. Physical phone hardware, Etsy purchase and live RSVP POST are outside this cover-only change.

## Integration corrections

Rear image pixels and alpha are pre-reflected before the CSS back-face transform, so a folded reverse stays on its physical hinge footprint. A raster-alpha regression test checks every moving face. Hidden opening parts retain the common G180 lazy/low-priority release contract; an early tap waits for decoded parts before starting, with skip/reduced-motion fallbacks. The new copy key has its required label and panel metadata. Forty-four superseded preview cover/clip files are retired; their earlier versions remain in Git history. The shared rebuilt-theme tests now verify the actual declared parts of each construction rather than assuming every object has a V-flap pocket or an arbitrary raster-file count.
