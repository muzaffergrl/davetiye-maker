# Music Box Ballerina (32)

Rose quartz, blush satin and soft gold: a lacquered music box instead of an envelope. Design brief:
`collections/32_Music_Box_Ballerina/DESIGN_BRIEF.md`; task G171 (docs/24 wave 2, 29–32). Status: **coming**
(`lib/marketing/config.ts`) — the box, the ballerina and every decor part are interim stand-ins until the GPT parts arrive.

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | name, 5 pages, 5 photo slots (`hero_portrait` 4:5 — the lid's mirror and the invitation, `story_1..3` 4:5 — the story mirror, `venue` 16:9), 84 copy keys |
| `content.demo.json` | = `collections/32_Music_Box_Ballerina/content.demo.json` (fictional Juliette & Arthur, The Rosewell Pavilion, Saratoga Springs, NY; May 22, 2027; URLs `null`; no sample photos yet) |
| `index.html` … `rsvp.html` | music box · home · story (mirror) · details · RSVP |
| `site.css` / `thank-you.css` | tokens, layout, the opening keyframes, the generated stage block, the mirror, petals, the oval page change / thank-you mode (G075) |
| `site.js` | `MOTION` (box steps under the standard key `envelope`, scenes, petals, mirror), long names, scenes, countdown, the box, petals, the story mirror |
| `build_images.py` | GPT parts → `img/` (interim stand-ins from toned repository GPT pictures when the parts are missing), the ballerina sprite, placeholders, og, favicon, `manifest.json` **and** the `/* stage:begin … stage:end */` block of `site.css` |

Shared platform layers: RSVP (`/rsvp/form.js`, questions, guest names), map block (`data-map`, demo pin Saratoga Springs,
NY), content blocks (G138: `data-blocks`, `data-travel`, `data-menu`), music + opening sounds (`lib/audio/catalog.ts`:
**Music Box** track — the existing synthesized lullaby, no new audio; key clasp 0 · clasp 450 · lid page 900 · chime 2300
as she turns · slide 2900 · chime 3900), calendar, thank-you mode, editable texts, languages (G144), printable invitation
(G139, `lib/print/layouts.ts`, composed). Sound only after the guest's tap (`/audio/audio.js`), its sound button mutes;
the music box melody itself plays on the Our Story page (engine rule: music only on story). Fonts: Ballet + Gilda Display
(Google Fonts, no files).

## Opening (motion signature)

Tap → the brass key turns twice on its own axis (0–900 ms; a flat GPT key turned with `rotateX`, it reads as a key
winding) → the box gives a small click as the spring catches (450–650) → the lid swings up on its back hinge to 90°
(900–1500) → the mirror side of the lid takes over at 90° and stands up with the couple's portrait in its oval mirror
(1500–2100) → a few rose petals start to drift down (1400, five GPT petals swaying from side to side) → the ballerina
rises from the satin well (1800–2300) → a glint crosses the mirror glass (2000–2900) → she turns slowly, one pirouette
every 2.4 s (8 GPT turn frames as a CSS sprite, `steps(8)`) → the card rises out of the box (2900–3900) → comes forward
(3900–4250) → home (4350, view transition `invite-card` onto the home title block). Closed, the key gives a slow half
turn every 4 s (the invitation to wind it). Reduced motion: tap → home directly, no petals, the ballerina stands still.

Layers (bottom → top, every one the whole stage window of the 1024 × 1536 canvas): mirror lid (`lid_open` + the portrait
behind its keyed-out #00FF00 window) · satin well (`interior`) · ballerina (sprite) · card (HTML on `card_paper`) · box
front (`box_body`) · closed lid (`lid_closed`) · key. The hinges, the key's axis, the mirror window, the ballerina's box
and the card's rise are measured by `build_images.py` and written to `img/manifest.json` → `stage` and to the stage block
of `site.css` (the theme test compares them) — no hand copy when the GPT parts drop in.

**Interim pieces (K21, no drawing):** no PAKET 5 part yet. The box front, closed lid and well are plain rectangles cut
from 21's paper / 14's satin and toned rose quartz; the mirror lid is 14's satin with 14's oval frame (its own green
window is the mirror); the key stand-in is 17's gold disc; the petals are three of 03's six petals; the card is 01's ivory
card toned cream. **The ballerina is a plain toned satin rectangle turned in 2D** (horizontal scale |cos|) — a slot, not
a figure; it reads as a placeholder on purpose. Not fit for sale. When `parts/*.png` exist the build switches layer by
layer; the ballerina uses `dancer_turn_a/b.png` (8 frames), or `dancer.png` turned in 2D if the strips are missing.
Dry run: `python3 tools/gpt_kuru_deneme.py --tema music-box-ballerina --sekil collections/32_Music_Box_Ballerina/assets/gpt/kuru_sekil.json`.

## Pages

- **Home:** the blush page ground full height, names in Ballet; invitation beside the portrait in an oval mirror on blush
  satin (a glint crosses the glass as it comes in); countdown (plain numerals), calendar; story teaser (oval); the day
  band on satin; the still ballerina + "Wind the music box again".
- **Story:** the music box mirror — the lid picture round an oval window, one photo at a time; the next comes in through a
  glint of light on the glass (outgoing brightens and blurs away, incoming sharpens) while the little ballerina under the
  mirror turns a quarter (2 sprite frames); swipe (horizontal only, vertical drags scroll), ← → buttons (`aria-disabled`
  at the ends, they keep focus), ←/→/Home/End on the focusable glass, "1 / 3" polite live region. Reduced motion or no
  JavaScript: the photos as a plain list of ovals with captions.
- **Details:** order of the day on blush satin beside the venue photo; map, calendar, dress code, blocks, travel, menu,
  registry, FAQ.
- **RSVP:** the reply card on blush satin, the shared form (focus ring on the choice chips); when a reply is sent a few
  petals drift down and the ballerina of the closing turns once; "Wind the music box again".

Page change (all pages): the new page opens from the centre in a widening oval, like a mirror (`::view-transition-new(root)`
radial mask), while the old page brightens slightly; scene steps turn in a little on their vertical axis, like the dancer.
The other themes cross-fade, wipe with satin (23) or turn pages (24).

## Deviations

- No W1 comps (wave 29–32 is built before its GPT parts) → `theme-check --compare none`.
- The music box melody during the opening is the platform's chime cue at the ballerina's first turn (the shared engine
  plays music only on the story page); no new audio file.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network, the real GPT box and ballerina, hearing the
sounds.
