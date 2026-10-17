# Crimson Rose Atelier (21)

Independent wedding website theme (not a Burgundy Velvet Autumn replacement): crimson roses, a burgundy envelope with a
gold botanical wax seal, an offset oval portrait, a paged chapter album and an ivory reply card on oxblood. Codex G133;
brought to the theme standard in G142. Status: **live** (`lib/marketing/config.ts`, opened by the user on 2026-10-17); price 1460 (same as designs 01–20).

## Files (docs/11 §1)

| File | Role |
|---|---|
| `theme.json` | 5 pages, 5 photo slots (`hero_portrait` 4:5 oval; `story_1..3` 4:3 album; `venue` 16:9), 70 copy keys (`node scripts/copy-manifest.ts --theme crimson-rose-atelier`) |
| `content.demo.json` | = `collections/21_Crimson_Rose_Atelier/content.demo.json` (fictional Olivia & James; sample photos are theme assets; `draftFromDemo` clears them) |
| `site.css` / `thank-you.css` | layout + the opening keyframes / thank-you mode (G075, loaded only after the wedding) |
| `site.js` | `MOTION` (envelope steps, scenes), long names, scenes, countdown (`data-target-utc`), envelope, album |
| `build_images.py` | `ph_*` placeholders from the paper texture + `img/manifest.json` (G142); the other WebP files are the G133 derivatives of the GPT PNGs in `collections/21_*/assets/gpt/` |

## Opening (docs/11 §7.3, kapak)

Tap → the gold seal lifts, tilts and drops away (0–400 ms) while kicker, names and the rose fade up → the flap (cut from
`envelope-closed` with `clip-path`) turns up on its hinge (400–1450) and the lining of `envelope-open` shows (650) → the
ivory card — oval portrait, "Our wedding", names, date — rises from the pocket (1600–3000) → comes forward over the
pocket (3000–3300) → home (3350; view transition `invite-card` onto the home oval portrait). Seal, flap, pocket and card
are separate layers. Opened state (back from home): card out, "Enter" + "Replay the opening"; the hint is
`display:none`. Sounds (`lib/audio/catalog.ts`): seal 0 · paper 400 · slide 1600 · chime 3000 ms.

Open-envelope body alignment (G133): X scale 1.14, Y scale 1.247, offset −6.9 % / −34.2 % compensate the generation
drift of `envelope-open` (technical alignment of generated material, not drawing).

## G142 changes

Copy manifest regenerated (no `details_title`: the details `<title>` uses `day_title`); standard envelope contract
(`invite:opened/arrive:<slug>` keys, `.replay`, `[data-enter]`, `.nojs-only` instead of `<noscript>`, speculation rule,
view transition, `from-envelope` arrival); `[data-scene]`/`[data-step]` entrances on every inner page; `[data-slot]` +
`.ph-mark` + `img/ph_*` placeholders; countdown `data-target-utc`; the RSVP question label in its own span (the shared
"(optional)" mark goes beside it, not into the label); RSVP `#reply` button and "Replay the envelope"; home memory strip
is a staggered column on phones (no sideways scroller) and a row from 700 px; thank-you card on the envelope; short
phones (≤ 700 px tall): smaller rose and hero; `img/manifest.json` `theme_check` (dark backdrop thresholds).

## Deviations

- Simple oval photo crop instead of the concept board's gold oval frame; a paper album instead of a literal leather book.
- No W1 comps / no katalog entry → `theme-check --compare none`; theme-check uses the 03 sample photos.
- The fixed platform sound button (top-left) passes over page content while scrolling, like on every theme.

## Not tried

Real iPhone / Android, Vercel deployment, real buyer photos, slow network.
