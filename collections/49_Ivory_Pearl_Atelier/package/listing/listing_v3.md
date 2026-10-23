# Etsy listing v3: Ivory Pearl Atelier Wedding Website (design 49)

Internal listing kit for the seller (2026-10-23). **Not published on Etsy.** No Etsy listing or draft exists for this design yet (it is not in
`tools/etsy_ids_22_48.json`, and `config.ts` still has `[ETSY LISTING URL]`). The design itself is on sale on the sales site
(`platform/lib/marketing/config.ts`: `live`, price 1190). Theme `ivory-pearl-atelier` (design 49, built on 2026-10-22 from the design's own GPT parts).
This kit follows the shop's listing standard, the 40 and 21 listings (G154): the same sections, headings and shop-wide wording. Every sentence answers a
buyer question from `docs/19_ALICI_YOLCULUGU.md` §3 and promises only what the platform does today. Product language: English (US spelling).
This file replaces the text of 2026-10-22, whose title, description and tags did not follow the shop standard. Its true design facts are kept here.
Design facts come from `platform/themes/ivory-pearl-atelier/` (README, theme.json, content.demo.json, the index, home, story, details and rsvp pages,
site.css), `platform/lib/marketing/designs.ts` (sales-site copy, "Your guests tap the envelope."), `platform/lib/audio/catalog.ts`,
`platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts`, `collections/49_Ivory_Pearl_Atelier/DESIGN_BRIEF.md` and the captures in
`package/shots/` and `package/qa/`.

## 0. Status before publishing

| Item | Status on 2026-10-23 |
|---|---|
| Sale status | **On sale on the sales site.** `platform/lib/marketing/config.ts` lists it as `live`, price 1190 (updated 2026-10-22, comment: "user requested catalogue release; the Etsy listing is prepared separately"). There is no Etsy listing or draft yet. |
| Design artwork | 7 GPT PNGs (`assets/gpt/`, DESIGN_BRIEF): an opening comp W1, the closed and open envelope, the pearl closure, the champagne silk bow, a blank invitation card and the silk page texture. All production parts carry no text; names, date and wording are HTML. This design has no PAKET 2 photos of its own, no PAKET 6 print grounds and no PAKET 7 scenes (the PAKET 7 prompts are in `assets/gpt/GPT_PROMPTS.md`; none has been made yet). |
| Start link `https://bkestudio.com/start?theme=ivory-pearl-atelier` | **Loads on the live site** (WebFetch, 2026-10-23: "Start your wedding website", "Design: Ivory Pearl Atelier", fields Etsy order number, Email address, first names, Website address; the HTTP status code itself was not read). Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/ivory-pearl-atelier` (in the description under TRY THE LIVE DEMO; planned image 7 carries its QR code) | **Loads on the live site** (WebFetch, 2026-10-23: "Clara & Julian · June 12, 2027", "Together with their families", "Tap to open", "Skip"). Sample couple: Clara & Julian at The Rosewater Conservatory, Savannah, Georgia, on June 12, 2027 at 4:00 PM. All of them are fictional (`content.demo.json`). The demo map pin is on Savannah (`platform/lib/claim/demo-map.ts`; the venue is fictional). The sample photos are design 03's fictional sample photos (theme README; `platform/lib/claim/demo-photos.json`; `package/qa/checks.json`: "using the 03 sample photos"). Not opened on a real phone. |
| Theme checks | From the theme README, not re-run for this listing: production build, function tracing and JavaScript budgets passed. Smoke test 45/45 in a local production build at 390 × 844 in Chromium mobile emulation (`package/qa/checks.json`): buyer start, photo upload, publish, QR decoding, guest reply and the reply in the editor. Catalogue, theme, translation, sample-photo and opening checks 78/78. Five viewports (360, 390, 430, 1280 and a short 390 × 568), keyboard and reduced motion pass (`package/shots/browser-checks.json`). `tests/theme-ivory-pearl-atelier.test.ts` exists (3 tests). No record was found that `theme-check` or `scripts/font-fallback.ts` was run. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation (README: "Real mobile-device testing remains separate"). |
| Platform features and shop-wide texts | Every design shares the same editor, order number + email access (`/my`), order-check sentence, RSVP questions, Excel and Google Sheets, music, map and directions, languages, guest password, thank-you page and Share → Downloads. §2 describes them exactly as the 21 listing does (G154, 2026-10-17) and the 40 listing (2026-10-22). Their live status was not re-read in this task. The open live-site checks are in §11. |
| Music and opening sounds | Default track **First Light** (`platform/lib/audio/catalog.ts`; the demo content uses the same). Opening sounds: clasp, ribbon, paper, slide and chime, timed on the opening steps. The 4 tracks were made in code (G126). Nobody has listened to them on a real phone. |
| Google Sheets | Not tried with a real Google account. The description and FAQ only say that a Google Sheet can be connected (as 21, G154). |
| Photos in this design | Five photo places (`theme.json`): the portrait (4:5) on the ivory home card, three story photos (4:5) and the venue (16:9). Home repeats the three story photos as a fan that opens as guests scroll. The photos are shown in color in ivory mats. |
| Printable invitation | `platform/lib/print/layouts.ts`: the design's own blank ivory card with a fine gold hairline border (`parts/invitation_card.png`) on the front and back, over the silk texture, `cover`. Names, date and wording are separate text. The 5 × 7 in PDF with bleed was rendered (`package/print/ivory-pearl-atelier-invite-5x7-bleed.pdf`, README). A5 and a printed copy were not checked. |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). |
| Shop name, support email | **BKE Studio**; support email **bkestudio01@gmail.com**. The description gives no email: "Message us here on Etsy. We reply within 24 hours." **The START HERE guide still prints bkestudio@gmail.com**, the older address without "01", in "Help and privacy" of `START_HERE.md`. This line comes from the shared guide text (docs/19 Ek A, `tools/build_customer_guides.py`) and is in 40's guide too. Fix it at the source and rebuild the guide (§11). |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **1,190 TL**: the K49 launch price the user approved on 2026-10-22 for every template design (docs/20 §7.12). It is in `config.ts` (1190) and `tools/etsy_upload.py` (`PRICE_TRY`). `DESIGN_BRIEF.md` still says 1.460 TRY, the price before K49. Quantity 999 (no stock limit). Renewal and the Etsy listing URL are open. |
| Design fonts and other languages | Cormorant Garamond (names, headings) and Lora (body): both latin + latin-ext + Cyrillic. Source: the `FONT_SUBSETS` table of `tools/build_customer_guides.py`, which the START HERE guide uses too. The language line in GOOD TO KNOW is the guide's Cyrillic line. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` rebuilt on 2026-10-23 (`tools/build_customer_guides.py`, docs/19 Ek A). QR and links were verified: the links are the start link, `/my` and the privacy notice, and the QR decodes to the start link. The QR has not been scanned with a phone camera. The support email in the guide is the older one (row above). |
| Listing images and video | v4 set (`tools/listing_v4/README.md`, docs/20 §7.10): **not built yet**. There is no `package/listing/images_v4/` and no `video_v4_4x5.mp4`, and `tools/listing_v4/` has no entry for 49 (`newpal.json`, `picks.json`, `themes.json`). Today there is only the older editorial set: 9 square PNGs in `images_editorial/`, made on 2026-10-22 by `tools/build-listing.mjs` of this collection, plus `video.mp4` (§5, §6). Nothing has been uploaded to Etsy. |
| Etsy and Canva rules (checked 2026-10-23) | Etsy: a direct read of etsy.com/legal/creativity and of the help page on digital listings (115015628347) answered 403. Web-search excerpts of 2026-10-23 say the following. Etsy's House Rules / Creativity Standards ask sellers to disclose AI use in the listing description and list seller-prompted AI creations under "Designed by". Etsy's help page allows up to 5 digital files of up to 20 MB each. The AI sentence in GOOD TO KNOW follows this. The listing-editor settings stay a §11 box. Canva: not applicable (the product uses no Canva). |

VERIFY markers come out only after the test is done. If a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file. The files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

```text
Ivory Pearl Atelier Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Champagne Silk, Pearl Seal
```

Etsy limit: 140 characters. This title: 133 characters.

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Quiet ivory cotton paper, champagne silk, fine gold edges and a luminous mother-of-pearl seal. Your guests tap an ivory envelope with a fine gold edge, under a small champagne silk bow: the pearl seal turns and moves aside in an arc, the two halves of the bow drift apart, the gold-edged flap lifts to show a champagne silk lining, and the card with your names rises with a gentle tilt and comes forward into your home page. Then your invitation follows: Home with your portrait on an ivory card with a fine gold border and a fan of three photos that opens as guests scroll, Our Story with three photos revealed like silk being drawn away, Details, and RSVP, where a soft pearl light passes over the confirmation after a guest replies. Guests can also skip the opening.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/ivory-pearl-atelier
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Ivory Pearl Atelier design: envelope opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required
• Download every reply as an Excel file (or CSV) in one tap, or connect your own Google Sheet
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay and registry buttons, and up to 12 questions & answers
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze; add a separate reception place if you need one
• Background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and sound effects as the invitation opens. Turn either off if you like; guests can mute the sound with one tap
• Your website in English, Spanish, French, German or Turkish, or in several with a language button for guests: the design's headings, buttons, reply form and dates come translated, and your own texts can be translated automatically as a draft that you check and approve
• A QR code of your website (PNG or SVG) for printed cards and signs
• Downloads: your whole website as a PDF, and a printable invitation in your design (5 × 7 in or A5, with an optional back side, bleed and crop marks for a print shop)
• An optional guest password, and a thank-you page for after the wedding
• A START HERE guide (PDF) with your start link and every step explained
• Your website stays online until 12 months after your wedding date

HOW IT WORKS IN 3 STEPS
1. Start: download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number, email and first names. Your private draft is created right away.
2. Personalize: add your names, date and a photo in a short 3-step setup, then anything else whenever you like. Every change saves by itself.
3. Publish & share: tap Publish, then send your link by text, WhatsApp or email, or print the QR code. Guest replies appear in your editor.

WHAT YOU CAN CHANGE
• Your names and how they appear
• Date, ceremony time and time zone; month-first or day-first date style
• Venue, address, map and directions, a separate reception place, and the order of the day (up to 10 rows)
• Your story: an intro line, three captions and its music (one of 4 tracks, your own file or none)
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers (up to 12), dress code, travel & stay and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "A day to remember")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed envelope with a pearl seal. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. A link sent by text or WhatsApp usually shows a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/clara-and-julian); it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language. Accented Latin letters and Cyrillic use the design's fonts; other alphabets show in a plain standard font.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters (checked). Keyword choices are hypotheses (no search-volume data). No other company's brand name.

```text
wedding website
rsvp website
digital invitation
envelope invitation
online rsvp
wedding rsvp
wedding invitation
pearl wedding
ivory wedding
champagne wedding
pearl invitation
elegant wedding
ivory and gold
```

Character counts: 15, 12, 18, 19, 11, 12, 18, 13, 13, 17, 16, 15, 14 (all ≤ 20).

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did; "How is this digital content created?": With an AI generator (the setting of the 01–48 drafts, docs/20 §7.11) [VERIFY: the "Designed by" option for designs made with AI image tools; the 2026-10-23 web-search excerpts of Etsy's House Rules put seller-prompted AI creations under "Designed by"] |
| What is it | A finished product |
| When was it made | Made to order (choose what Etsy offers for digital items; docs/20 §7.12: the new editor shows no such field for a digital listing, and "This digital item is made to order" stays unticked so the PDF downloads at once) |
| Occasion | Wedding |
| Primary color | White |
| Secondary color | Beige |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (rebuilt 2026-10-23; Etsy: up to 5 files, 20 MB each) |
| Price | **1,190 TL** (the K49 launch price the user approved on 2026-10-22 for every template design, docs/20 §7.12 and docs/35 §8b; about USD 24.02 at 49.55 TRY per USD, docs/23 §1). Shop currency TRY (K38). This design is on sale at this price (`config.ts` `live`, 1190, 2026-10-22) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Classic & Vintage (the docs/20 §7.11 rule of 2026-10-22: designs that are neither floral nor summer go here; also the section of the earlier text of this file) |
| Renewal | [AUTO RENEW: yes/no] (the 22–48 drafts on Etsy use Automatic, docs/20 §7.11; this design has no Etsy draft yet) |

## 5. Images and alt text

The v4 set has 19 images in Etsy order (`tools/listing_v4/`: `build_set.py 49` + `export.py 49` → `package/listing/images_v4/`). Order and file names follow design 01's `images_v4/`. The rules are in `tools/listing_v4/README.md` and docs/20 §7.10. **Built and on the Etsy draft** (2026-10-23, docs/20 §7.13): all 19 images and the video, re-shot after the opening fix of 9719a4fe and uploaded again in order.

Phone screens are always real screens, and every word in the images is HTML, never written by GPT. The alt texts below were drafted before the images existed, from the headlines in `tools/listing_v4/slides.py`, `cover_v4.html` and `lifestyle.py` and this design's real screens in `package/shots/`; on 2026-10-23 images 1, 2, 9 and 10 were read against the files and match, the others are still to be read against their files.

Two image labels may not fit this design. Image 2's third phone is labeled "Your photo" (`slides.py`), and image 9's footer says "Your photo and your names" (`lifestyle.py`). In this design the card that rises out of the envelope carries the names and date, not a photo; the portrait appears on Home. The built images keep both labels (read on 2026-10-23): image 2's third phone and image 9 show the card with the names and date, not a photo.

Three images go against the old rule of the 01–21 editorial sets (no QR code or web address in a listing image; Etsy Off-Platform policy, docs/15 §4.1): image 7 carries a QR code of the live demo, image 4 shows the editor's "Your website is live" card with a sample web address, and image 19 has the footer "Your own address: bkestudio.com/your-names". docs/20 §7.11 (2026-10-22) keeps them, as the user approved the v4 template on design 01. Etsy's policy itself was not re-read for this listing (§11).

The design also has an older editorial set, not uploaded: 9 PNGs of 2000 × 2000 in `images_editorial/` (`01_cover` … `09_devices`). They were made on 2026-10-22 by `collections/49_Ivory_Pearl_Atelier/tools/build-listing.mjs` from the real screens in `package/shots/` (local production build, Clara & Julian), laid out on this design's silk texture. Their alt texts are in `image-copy.json`, and there is a matching `listing_ivory-pearl-atelier.pdf`. They are square, not the shop's 4:5 v4 standard, and their image 7 uses the editor's live screen with a QR code (`b10_live_qr.jpg`). They are not part of this kit.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Ivory Pearl Atelier wedding website with RSVP: two phones show the ivory envelope with a fine gold edge and a mother-of-pearl seal under a champagne silk bow, and the open envelope with the ivory card rising, names Clara & Julian; badges say No Canva needed, RSVP guest list included and Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show 1 guests tap the sealed ivory envelope with its pearl seal, 2 it opens onto a champagne silk lining, 3 the card rises with your names; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: the guest's reply form on an ivory reply card, and the couple's guest list in the editor with guests coming, not coming, replies and a Download Excel button; badges for your own questions and the Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: three phones show 1 the editor's list of pages, 2 changing a heading under Headings & labels, 3 the Your website is live screen; every change saves by itself |
| 5 | `05_pages.jpg` | Every page included: Home with the portrait on an ivory card with a fine gold border, Our Story with a photo in an ivory mat, Details with the order of the day, and the RSVP page; countdown, schedule, map, questions and answers, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included: the invitation "A day to remember" on a phone, next to a checklist: envelope opening and four pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation, editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the sealed ivory envelope with its pearl seal on a phone next to a QR code of the live demo, to scan with your phone camera or tap the demo link in the description; sample names and photos that yours replace |
| 8 | `08_how.jpg` | How it works: 1 buy and open the START HERE guide from your Etsy purchases, 2 start with your Etsy order number and first names, 3 personalize names, date, photos, story and RSVP questions, 4 publish and share one link by text, WhatsApp, email or QR; the setup's Add your photo step on a phone |
| 9 | `09_closeup.jpg` | Designed to be opened: a close-up of a phone with the open Ivory Pearl Atelier envelope and the card with your names |
| 10 | `10_tap.jpg` | One tap and it opens: a hand taps the sealed ivory envelope with its pearl seal on a phone; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, no app and no account: the Home page on a guest's phone; just one link on any phone |
| 12 | `12_devices.jpg` | Beautiful on every screen: the Home page on a tablet and the invitation on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too: the private editor with its preview on a laptop |
| 14 | `14_together.jpg` | Plan it together: the guest list in the editor on a phone and on a laptop; open your editor on any device |
| 15 | `15_print.jpg` | Print it or send it: the printable invitation in the Ivory Pearl Atelier design (5 × 7 in or A5 PDF) next to the sealed envelope on a phone |
| 16 | `16_need.jpg` | Everything your guests need: four phones show the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | The order of the day, with add-to-calendar buttons, on a phone |
| 18 | `18_replies.jpg` | Every reply in one place: the guest list in the editor on a phone; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: the editor's Share screen on a phone |

## 6. Video

**Planned, not made yet:** `package/listing/video_v4_4x5.mp4`, the hover video of the v4 set (`tools/listing_v4/stageE.sh 49`). `rec.mjs` records the live demo `https://bkestudio.com/start/demo/ivory-pearl-atelier` in slow motion (page time 50× slower, 432 × 540 at 2.5× = 1080 × 1350). `full45.py` then turns the recording into a 60 fps H.264 video with no sound track. Its last 0.4 s dissolves into the first frame, so Etsy's loop has no jump. The 01–21 videos made this way run about 10.5 s (docs/20 §7.10). This design's opening reaches Home at about 4.2 s of page time (README), so the slow-motion recording has enough material.

**Present today:** `package/listing/video.mp4`, from the design's own production session of 2026-10-22. The earlier text of this file described it as a silent, square H.264 clip of the opening and the Home page. It was not watched for this listing: length, size and the loop were not checked. It is not the shop's 4:5 hover video.

Etsy's video rules come from web-search excerpts of Etsy's help pages (2026-10-14: 5–15 s, up to 100 MB, at least 500 px, no sound). [VERIFY: Etsy video rules in the listing editor]

## 7. FAQ (end of the description, or the shop FAQ)

**Do I need Canva or anything to install?**
No. You edit your website in your web browser, on your phone or computer: no Canva, no app. Your guests only need the link.

**How do I start after buying?**
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number. You can also use the start link in our Etsy message.

**Do I need an account or a password?**
No. Your Etsy order number and the email you start with open your editor on any phone or computer. You also get a private edit link as a shortcut.

**What if I lose my edit link?**
No problem: on any phone or computer, open the "Create your website" page of our website (the address is in your START HERE guide) and enter your Etsy order number and the email you started with. Your editor opens where you left off.

**Can I change things after I publish?**
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

**Can I change the headings and wording?**
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

**Can guests skip the opening or see it again?**
Yes. The envelope page has a Skip link in the corner, and "Open the invitation again" at the foot of Home plays the opening once more.

**Can it be in another language?**
Yes. Your website can be in English, Spanish, French, German or Turkish, or in several of them: the design's built-in texts come translated, and your own texts can be translated automatically (check each translation before you approve it). You can write your own texts in any other language too.

**How do my guests reply?**
On your RSVP page, with no app or account. You choose which fields are required and can add up to 10 questions of your own. You see every reply in your editor and can download them all as an Excel file (or CSV) in one tap, or connect your own Google Sheet.

**How many guests can I invite?**
As many as you like. One reply can include up to 10 people.

**Is there music?**
Yes, if you like: music on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and sound effects as the invitation opens. You can turn music or sound effects off, and guests can mute the sound with one tap.

**Can guests find the venue?**
Yes. Your Details page can show a map of the venue (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze. If the reception is somewhere else, add it as a second place.

**Can I add a password?**
Yes, optional: one shared password that you send to your guests with the link.

**How long does my website stay online?**
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page. Need it longer? Message us on Etsy before your "Online until" date and we can extend it.

**Can I use my own domain?**
Not at the moment. Your address is your names on our web address.

**Is anything printed or shipped?**
No. It is a digital product. Your editor makes a printable invitation in your design (5 × 7 in or A5) that you can print at home or at a print shop.

## 8. Etsy's automatic messages (shop-wide, the same for every design)

Etsy's "Message to Buyers for Digital Items" applies to every digital listing, so it cannot carry this design's own start link: it links
the design chooser `https://bkestudio.com/start` (docs/19 §4.4). The START HERE PDF carries this design's own link. Both texts are already entered in
Shop Manager (docs/20 §7.1) and need no change for this design.

Message to Buyers for Digital Items:

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: https://bkestudio.com/start

You will enter your Etsy order number, your email and your first names. To continue later on any phone or computer, open https://bkestudio.com/my and enter the same order number and email. No account or password.

Questions? Message us here on Etsy with your order number.
```

Message to Buyers (receipt):

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at https://bkestudio.com/start (choose the design you bought). To continue later on any device, open https://bkestudio.com/my with the same order number and email. Questions? Message us on Etsy.
```

## 9. After the sale

The messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5, and the admin panel reads them: `welcome_start`, `start_link_reminder`, `publish_blocked_pending`, `order_confirmed`, `how_to_publish`, `new_edit_link`, `order_already_used`, `wrong_design_started`, `extra_change_granted`, `date_moved`, `photo_upload_help`, `guest_access_help`, `general_help`, `archive_notice`, `after_wedding_tip`, `review_request`, `refund_or_problem`, `delete_data`.
Rules:
- The edit link is sent only with `new_edit_link`, inside this order's Etsy conversation.
- No message asks the buyer for their edit link.
- One review request per order, with the same text for everyone and never with an incentive.

## 10. What differs from the 01–20 listings

- A new design (49, built 2026-10-22 from its own 7 GPT parts), opened for sale on the sales site (`live`, 1,190 TL) before its Etsy listing exists. Its start link and demo load on the live site (2026-10-23). The description follows the 21 and 40 listings word for word outside the design-specific lines (design paragraph, sample web address, wording example, guests' first view, language line). Two shop-wide sentences were reworded, because the shop's word rule allows that word only in "no app": the preview-card line in WHAT YOUR GUESTS SEE ("A link sent by text or WhatsApp usually shows a preview card …") and the first FAQ question ("Do I need Canva or anything to install?").
- The opening (README step table) runs in these steps:
  - The pearl seal turns and follows an arc to the right (0–0.9 s).
  - The two halves of the champagne silk bow above the names drift apart (0.12–1.22 s).
  - The gold-edged flap opens on its hinge onto champagne silk (1.1–2.15 s).
  - The card rises in a gently tilted arc (1.95–3.3 s) and comes forward (to 4.05 s).
  - Home opens at about 4.2 s. Skip and Replay are on the envelope page; keyboard and reduced motion are supported (Chromium checks).
- Inside, the photos are revealed from left to right with one soft pass of light, Home has a fan of three photos, and after a reply one pearl light crosses the confirmation. The design paragraph says so in plain words ("revealed like silk being drawn away", "a soft pearl light").
- This design has no sample photos of its own: the demo uses design 03's fictional sample photos (README). The AI sentence covers them, since they were also made with AI image tools.
- This design has no PAKET 6 print grounds: the printable invitation uses its blank ivory card with a fine gold border (`layouts.ts`).
- "What you can change" has no monogram line (this design shows none) and gives "A day to remember", this design's invitation heading, as the second example of your own wording.
- Language line from this theme's real fonts (§0): both fonts have Cyrillic.
- Images: the v4 set (19 images at 4:5 and a 4:5 hover video) is planned. Only the older square editorial set (9 PNGs) and a square `video.mp4` exist today.
- Changes from the earlier text of this file (2026-10-22):
  - The title "… Website Template, Animated Pearl Envelope Invitation with Online RSVP, Digital Wedding Invite" now follows the shop's title pattern.
  - "Message STUDIOBKE on Etsy" is now the shop's own closing line.
  - The tags "wedding template", "animated invitation", "minimal wedding" and "digital wedding" gave way to the shop's shared tags and design-specific ones.
  - The FAQ, the messages and the publish checklist are now complete. The design facts, the shop section and the price are kept.

## 11. Before you publish this listing

- [x] The user approves this design's sale and price (`config.ts` `live`, 1190, 2026-10-22; K49 launch price)
- [x] Start link loads on the live site with this design named (WebFetch, 2026-10-23: "Design: Ivory Pearl Atelier")
- [x] Live demo loads on the live site (WebFetch, 2026-10-23: Clara & Julian, June 12, 2027)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide rebuilt for this design and checked (`package/customer/START_HERE.md` + `.pdf`, `tools/build_customer_guides.py`, 2026-10-23; QR and links verified)
- [x] Support email in the START HERE guide corrected to bkestudio01@gmail.com (docs/19 Ek A, every guide rebuilt 2026-10-23)
- [ ] `theme-check` and `scripts/font-fallback.ts` run for this theme (no record found)
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Music, map and directions, the reply form and Excel download tried on the live site; the 4 tracks listened to on a real phone and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual or etsy)
- [ ] G146 live (order number + email open the editor on any device: `/my`, "Create your website"); START HERE re-checked against it
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome), including the pearl seal's arc, the parting bow, the flap, the rising card and the photo reveals
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Price (1,190 TL) confirmed for this design (K49, `config.ts` 1190) and filled in; quantity 999
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided (the 22–48 drafts use Automatic, docs/20 §7.11)
- [ ] Languages (G144) and Share → Downloads (G139) tried on the live site
- [ ] Printable invitation: A5 rendered and one printed copy checked (5 × 7 in with bleed rendered, `package/print/`)
- [ ] `tools/listing_v4/` entries for 49 (`newpal.json`, `picks.json`); v4 images 01–08 built; alt texts 1–8 rewritten against the files
- [ ] PAKET 7 GPT scenes made for this design (prompts in `assets/gpt/GPT_PROMPTS.md`); images 09–19 built; alt texts 9–19 rewritten against the files
- [ ] The "Your photo" labels of images 2 and 9 checked against this design's opening (its card shows names and date, not a photo)
- [ ] Image 7 (demo QR), image 4 (sample web address on the editor's live card) and image 19 (address in the footer) checked against Etsy's Off-Platform policy (kept by the docs/20 §7.11 decision; the policy itself not re-read)
- [ ] Hover video `video_v4_4x5.mp4` produced from the live demo and watched: length within Etsy's limits, the loop and the first and last frame compared
- [x] Shop section chosen (§4: Classic & Vintage, docs/20 §7.11 rule)
- [ ] Etsy draft created for this design and its listing URL filled in (`config.ts` `etsyListingUrl`)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by"); the official pages could not be read directly on 2026-10-23 (403)
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
