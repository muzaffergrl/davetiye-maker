# Etsy listing v3: Riad Lantern Nights Wedding Website (design 27)

Internal listing kit for the seller (2026-10-22). **Unpublished draft: the design is not for sale** (`config.ts` `preview`). Theme `riad-lantern-nights`.
Written from the 21 listing (`collections/21_Crimson_Rose_Atelier/package/listing/listing_v3.md`, G154 standard) and the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32): every sentence answers a buyer question from docs/19 §3 and promises only what the platform
does today. Product language: English (US spelling). This text replaces the version of 2026-10-17, which described the interim theme before its
rebuild with the GPT parts (2026-10-18/19). Design facts come from `platform/themes/riad-lantern-nights/` (README, theme.json, content.demo.json,
index.html, home.html, story.html, details.html, opening-design.json, interior-design.json, the shared opening script and the opening artwork in
`img/`), `platform/lib/marketing/designs.ts` ("Your guests tap the envelope." since the docs/35 redesign), `platform/lib/audio/catalog.ts`, `platform/lib/print/layouts.ts`,
`platform/lib/claim/demo-map.ts` and `platform/lib/claim/demo-photos.json`. Since the docs/35 redesign (merged 2026-10-23) it opens from its own envelope.

**2026-10-23 (merge of the docs/35 redesign, G422–G432):** the owner declared the rebuilt design valid and it was merged to main. §1 title, §2 description and §3 tags now describe the rebuilt theme (its envelope, opening and pages, from `platform/lib/marketing/designs.ts`, which is written against the theme as built). Still the old design until the listing media are re-rendered: the rows of §0 about the opening and the pages, the §5 images and alt texts (`images_v4/`), the §6 video (`video_v4_4x5.mp4`) and the START HERE screens. Do not publish before that.

## 0. Status before publishing

| Item | Status on 2026-10-22 |
|---|---|
| Sale status | **Not for sale.** `platform/lib/marketing/config.ts` lists it as `preview` (shown in the catalogue, no checkout), price `[PRICE]`. The listing stays an unpublished draft. No Etsy draft exists for this design (docs/20 §7.9: drafts for 01–21 only). |
| Start link `https://bkestudio.com/start?theme=riad-lantern-nights` | **Answers 404** on the live site (2026-10-22): /start opens only designs that are `live`. It should answer once the design goes live (§11). Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/riad-lantern-nights` (in the description under TRY THE LIVE DEMO) | **Answers 200** on the live site (curl, 2026-10-22). It shows this design with the fictional sample couple Leila & Adrian (The Saffron Courtyard Riad, Marrakech, Morocco; October 9, 2027, 6:00 p.m.), a demo map pin in the Marrakech medina (`lib/claim/demo-map.ts`) and the shared fictional sample photos (`demo-photos.json`: the Blush Garden Rose set; `content.demo.json` sets no photos). Not opened on a real phone. |
| Opening (theme rebuilt with its GPT parts on 2026-10-18/19) | `index.html` + the shared opening script (`opening-design.json`: kind `horseshoe-riad-doors`, pieces `left` and `right`, no pocket): a pair of teal doors under a pointed gold lattice arch, with brass ring handles, peach roses on gold vines and blue-and-saffron zellige corners (`img/v3-closed-880.webp`). At the tap the left door and then the right one swing open, and a card with the portrait in an arch frame with a brass lantern (`interior-frame`: ivory plaster arch with teal and zellige borders and peach roses), the names, "We're getting married" and the date comes forward; then the home page opens. Sound effects at the tap (`catalog.ts`: seal, paper, slide, chime). With reduced motion on, the opening is skipped and the home page opens. |
| Pages | README and `interior-design.json` (layout `riad`): Home "a Moroccan courtyard suite with an arched portrait, brass lantern details and mosaic-edged stationery"; Story "a riad arcade of horseshoe-arch portraits: one central arch followed by two smaller windows"; Details "a courtyard evening programme beneath an ivory plaster arch, with teal and saffron details"; RSVP "an arched riad reply card and a lantern-lit response form". Reduced motion and printing show all content without animation (README). |
| Name of the opening | Since the docs/35 redesign (merged 2026-10-23) `designs.ts` `DESIGN_COPY` says "Your guests tap the envelope." (the word `tools/etsy_upload.py` checks; this listing says "arched envelope"): the sales site, the editor's preview tab **Envelope** (`lib/panel/state.ts` `themeOpening`) and the theme's own open button ("Open the invitation") name the same object (`tests/g175-openings.test.ts`, `tests/unique-openings.test.ts`; read from the code and tests, not yet seen on the live site). START HERE still names the old object until it is regenerated. |
| Current platform release | The theme is on production (its demo answers 200). The editor flow (setup, Edit, Guests, Share) was not tried with this design: the start link answers 404 until the design goes live. The shop-wide features in §2 are those of the 21 listing (G154). |
| Order check (`CLAIM_ORDER_VERIFICATION`) | As in the 21 listing: decided on (K34), but the mode in production was not read (no access to the live settings). The description claims no order check: it says what happens if the editor shows "We are confirming your Etsy order" (Publish opens once the order is confirmed, usually within 24 hours), which is true in every mode (G154, K48). |
| Questions & answers, RSVP questions | Platform features, the same for every design. **Not tried on the live site** with this design. |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | Platform features. This design's default track is **Evening Strings** (`catalog.ts`; also `content.demo.json` `audio.music`). The 4 tracks were made in code and **nobody has listened to them on a real phone**. The Google Sheets connection has **not been tried with a real Google account**, so the description only says that a Google Sheet can be connected. None of these was tried on the live site with this design. |
| Printable invitation | `platform/lib/print/layouts.ts` (G190, 2026-10-20): composed from this design's PAKET 6 print grounds (`assets/gpt/print/print_front.png`, `print_back.png`), front and back, 5 × 7 in and A5; fonts Cinzel, Marcellus and Marcellus SC (print only); text boxes checked in the repository (G149 rule). No copy printed. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Description claims | §2 is the shop-wide 21 text (features that exist in the platform and passed G090's local production-build checks, G154) with this design's own opening, look, pages and fonts as its theme files show them. No VERIFY note is left in §2; the live-site and real-device tests that are still open are in §11. |
| Edit link by email | **Off** (G147, as recorded in the 21 listing; not re-read on 2026-10-22). The buyer opens the editor on any device with the Etsy order number + email (`/my`, "Create your website"); the private edit link is a shortcut. The listing promises no email. |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. |
| Shop name, support email | **BKE Studio**, **bkestudio01@gmail.com** (the address "bkestudio@gmail.com" in older files is wrong). The description gives no email: "Message us here on Etsy. We reply within 24 hours." |
| Response time, refund policy | Shop-wide, decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Proposal: 1,190 TL**, the approved launch price for a template design (K49, docs/35 §8b, 2026-10-22). **Blocker** until the user confirms it for this design (`config.ts` price `[PRICE]`). Quantity 999 (no stock limit). Renewal and the Etsy listing URL are still open. Hosting extension (on request via Etsy before the "Online until" date, no price promised): K48, shop-wide. |
| Design fonts and other languages | The theme loads Italianno, Amiri and Lora from Google Fonts (the `family=` of all five pages; no font files). Subsets read on 2026-10-22 from Google Fonts' family metadata through the google-webfonts-helper API (`gwfh.mranftl.com/api/fonts/<id>`; a plain css2 request returned no subset comments): Italianno latin-ext, no Cyrillic (`--script`), Amiri latin-ext + Arabic, no Cyrillic (`--display`), Lora latin-ext + Cyrillic (`--body`). The language line in GOOD TO KNOW is the "latin-ext" sentence of `tools/build_customer_guides.py` `LANGUAGE_LINES`, the same as in the START HERE guide (whose builder reads the older font list of `designs.ts`, Cinzel, Marcellus SC and Marcellus, with the same result). |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` built on 2026-10-20 (G190), unchanged since. Its start link and QR point to the start link above (404 until the design goes live); it also links `/my` and the privacy notice. It says guests "tap the door" and names the preview tab **Door**. QR not scanned with a phone. |
| Artwork and sample photos | GPT parts built into the theme in the rebuild of 2026-10-18/19 (README: "New frame and stationery artwork came from built-in image_gen"). The demo photos are fictional GPT images shared with other designs. |
| Listing images and video | **Not built yet** (§5, §6): the v4 set (cover + 7 information images + 11 lifestyle images = 19 JPGs in `package/listing/images_v4/`, and the 4:5 hover video `package/listing/video_v4_4x5.mp4`; `tools/listing_v4/README.md`, docs/20 §7.10). The 11 lifestyle images wait for this design's PAKET 7 GPT scenes; its `assets/gpt/GPT_PROMPTS.md` has no PAKET 7 section yet. Nothing uploaded to Etsy. |
| Etsy rules (digital items, AI disclosure, title, tags, images, video) | Etsy's official pages answered **403** to a direct fetch on 2026-10-22 (`etsy.com/legal/creativity/`, help article 115015628347). Web-search excerpts of `etsy.com/legal/creativity` (2026-10-22): sellers must say in the listing description when an item was made with AI, and such items are labeled "Designed by". The Etsy listing editor of the 01–21 drafts asks "How is this digital content created?" (docs/20 §7.9, 2026-10-21). Not read from Etsy's own pages: re-check in the listing editor (§11). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video), the sales status `preview`, the unconfirmed price and every open box of §11 keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 136 characters.

```text
Riad Lantern Nights Wedding Website with RSVP, Digital Invitation with an Arched Envelope Opening, Online Editor, Moroccan Teal and Gold
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like an arched riad doorway, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Warm tadelakt plaster, deep teal, saffron and brass, inspired by a lantern-lit Moroccan riad. Your guests tap a deep teal envelope with a horseshoe-arch flap, a saffron silk cord and a pierced brass lantern charm: the little lantern lights up, the cord slips off its brass stud and falls away with its tassel, the arched flap rises like a riad doorway onto glazed zellige, and an arch-topped card with your portrait comes out of the pocket. Then your invitation follows: Home with your portrait in a carved stucco horseshoe arch and a band of zellige tiles set one by one, Our Story as three tall carved cedar arch windows lit by lantern light, Details with the order of the day under a stucco arch frieze, and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/riad-lantern-nights
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Riad Lantern Nights design: arched envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Moments we hold dear")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a closed teal envelope with a brass lantern charm. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/leila-and-adrian); it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language; accented Latin letters use the design's fonts, while Cyrillic and other alphabets show in a plain standard font in some or all places.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters (counted below). Keyword choices are hypotheses (no search-volume data). No other company's brand name; "marrakech" names a place.

```text
wedding website
rsvp website
digital invitation
moroccan invitation
online rsvp
wedding rsvp
wedding invitation
moroccan wedding
riad wedding
lantern wedding
marrakech wedding
destination wedding
teal and gold
```

Character counts: 15, 12, 18, 19, 11, 12, 18, 16, 12, 15, 17, 19, 13.

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did; "How is this digital content created?": With an AI generator, as chosen in the 01–21 drafts (docs/20 §7.9) [VERIFY: the "Designed by" option for designs made with AI image tools] |
| What is it | A finished product |
| When was it made | Made to order (choose what Etsy offers for digital items) |
| Occasion | Wedding |
| Primary color | Green (the teal doors; or Blue) |
| Secondary color | Gold |
| Style / theme | Classic, Elegant (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (G190, 2026-10-20; Etsy: up to 5 files, 20 MB each) |
| Price | **1,190 TL (proposal)**: the launch price the user approved on 2026-10-22 for a template design (K49) (about USD 24.02 at 49.55 TRY per USD, docs/23 §1). Shop currency TRY (K38). **Not confirmed for this design** (`config.ts` price `[PRICE]`, status `preview`): a blocker until the user confirms it |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Summer & Destination (Etsy draft, docs/20 §7.11) |
| Renewal | [AUTO RENEW: yes/no] (the 01–21 drafts were saved with Automatic, docs/20 §7.9; the decision is the user's) |

## 5. Images and alt text

**Not built yet** (2026-10-22). Planned: the v4 set of the 01–21 listings (`tools/listing_v4/README.md`, docs/20 §7.10), 19 JPGs in `package/listing/images_v4/`, in Etsy's upload order as in `collections/01_Olive_Ivory/package/listing/images_v4/`. Image 1 (`cover_v4.html`) and images 2–8 (`slides.py`) use only real screens: the live demo's opening stills (`shots.mjs`) and guest pages and editor screens from a local production build (`tools/listing_templates/capture.ts`); images 9–19 (`lifestyle.py`, LIFE list) put real screens into this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_NN_*.png`). The PAKET 7 prompts are not written yet for this design (`assets/gpt/GPT_PROMPTS.md` has no PAKET 7 section on 2026-10-22), so images 9–19 wait for GPT. Before building, add this design to `tools/listing_v4/themes.json` (rows 01–21 only) and `picks.json` (the "opening" and "open" frames, chosen by eye); give it the object "riad doors" in `OPENS` of `build_set.py` (without an entry image 2 falls back to the default object word; a plural object makes its headline "Opens like real riad doors"), and replace the default object word that `slides.py` writes into image 5's kicker and image 6's first item with "riad doors" / "riad door". Image 7 carries a QR code of the live demo and image 19 the line "bkestudio.com/your-names", as in the user-approved v4 sets of 01–21; docs/15 §1 says the listing carries no QR code (Etsy Off-Platform policy): decide before publishing (§11). The alt texts below are written from the template and this theme's files; read each one against the built image and correct it.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Riad Lantern Nights wedding website with online RSVP: two phones show the closed teal riad doors under a gold lattice arch and the opened card with a portrait and sample names, with round badges No Canva needed, RSVP guest list included and Edit on your phone |
| 2 | `02_reveal.jpg` | It opens like real riad doors: three phones show the teal doors closed, swinging open, and the card with a portrait coming forward; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: the guest's reply form on one phone and the couple's reply list in the editor on another, with badges for the Excel guest list download and your own questions |
| 4 | `04_edit.jpg` | Edit everything on your phone, with no Canva, no app and no account: three phones show picking a page, changing a text and publishing; every change saves by itself |
| 5 | `05_pages.jpg` | Riad Lantern Nights, four pages and the riad doors: Home, Our Story, Details and RSVP on four phones; countdown, schedule, map, questions and answers, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What is included: the riad door opening with Home, Our Story, Details and RSVP pages, online RSVP with your own questions, guest list with one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation, an easy editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the closed riad doors on a phone next to a QR code of the live demo, or tap the demo link in the description; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works in four panels: buy and open the START HERE guide from your Etsy purchases, start with your Etsy order number and first names, personalize names, date, photos, story and RSVP questions, then publish and share one link by text, WhatsApp, email or QR code |
| 9 | `09_closeup.jpg` | Designed to be opened: a close-up scene with a phone showing the opened card with a portrait in its arched frame with a brass lantern and the sample names |
| 10 | `10_tap.jpg` | For your guests, one tap and it opens: a hand taps the closed teal riad doors on a phone screen; sound and animation included |
| 11 | `11_home.jpg` | No app, no account: guests open the home page anywhere, with just one link on any phone |
| 12 | `12_devices.jpg` | Beautiful on every screen: the home page on a tablet and the invitation on a phone |
| 13 | `13_laptop.jpg` | Your private editor on a laptop too, with a preview of every change |
| 14 | `14_together.jpg` | Plan it together and open your editor on any device: the guest list on a phone and on a laptop |
| 15 | `15_print.jpg` | Print it or send it: the printable invitation in this design (5 × 7 in or A5 PDF) next to the closed riad doors on a phone |
| 16 | `16_need.jpg` | Everything your guests need, on four phones: the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | On the wedding day: the order of the day on a phone, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Guest list included, every reply in one place: the reply list in the editor; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR code: the editor's Share screen on a phone and your own web address with your names |

## 6. Video

**Not built yet.** Planned: `package/listing/video_v4_4x5.mp4`, the hover video of the v4 set (`tools/listing_v4/stageE.sh`: `rec.mjs` records the live demo `https://bkestudio.com/start/demo/riad-lantern-nights` in slow motion, page time 50× slower, 432 × 540 at 2.5× = 1080 × 1350; `full45.py` turns the frames into a 60 fps vertical video, about 10.5 seconds as for 01–21, whose last 0.4 seconds dissolve into the first frame so Etsy's loop has no jump). It starts on the closed riad doors and shows them swinging open and the card coming forward into the home page (sample names and photos). It is made from still frames, so it has no sound track. The demo already answers 200 (2026-10-22), so the recording does not wait for the sale. [VERIFY: Etsy video rules in the listing editor]

## 7. FAQ (end of the description, or the shop FAQ)

**Do I need Canva or an app?**
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

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
Shop Manager (docs/20 §7.1, §7.8) and need no change for this design. Until this design is live, /start does not open it (its start link answered
404 on 2026-10-22), so a buyer could not find it in the chooser: one more reason the listing stays unpublished.

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

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them): `welcome_start`, `start_link_reminder`, `publish_blocked_pending`, `order_confirmed`, `how_to_publish`, `new_edit_link`, `order_already_used`, `wrong_design_started`, `extra_change_granted`, `date_moved`, `photo_upload_help`, `guest_access_help`, `general_help`, `archive_notice`, `after_wedding_tip`, `review_request`, `refund_or_problem`, `delete_data`.
Rules: the edit link is sent only with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit
link; one review request per order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- Rewritten on 2026-10-22 for the rebuilt theme (GPT parts, 2026-10-18/19). The 2026-10-17 text described the interim opening (cedar doors, lantern light pouring out, photos coming out of the dark as the light reaches them); now teal riad doors under a gold lattice arch swing open and a card with an arched portrait comes forward; Our Story is a riad arcade of arched frames (layout `riad`). The listing claims no light effect.
- Not for sale (`preview`): the demo answers on the live site, the start link does not (404); the price is a proposal.
- Opening object (2026-10-23): the rebuilt design opens from its own envelope (`designs.ts` "Your guests tap the envelope."); §1–§3 say "arched envelope". The §5 images and alt texts and the §6 video still show the old opening until they are re-rendered.
- Language line: the guide builder's "latin-ext" sentence, as in START HERE; it matches this theme's real fonts (§0: only Lora, the running text, has Cyrillic; Amiri, the heading font, has Arabic).
- Images: the 19-image v4 set and the 4:5 hover video are planned (§5, §6) instead of the 9 editorial images and square video of the 21 kit.

## 11. Before you publish this listing

- [ ] The user approves this design's sale (`config.ts` `preview` → `live`) and its price
- [ ] Start link answers 200 after the design goes live (`https://bkestudio.com/start?theme=riad-lantern-nights`, "Design: Riad Lantern Nights"; 404 on 2026-10-22)
- [x] Live demo answers 200 on the live site (`https://bkestudio.com/start/demo/riad-lantern-nights`, curl, 2026-10-22)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR; G190, 2026-10-20)
- [ ] Guest-facing default labels (`theme.json` `home_replay`, `rsvp_replay`, `envelope_close`) renamed for the doors or accepted, and the editor's preview tab read on the live site (START HERE says "Door"; §0)
- [ ] Questions & answers and RSVP questions tried on the live site with this design
- [ ] Music, map and directions, the reply form and Excel download tried on the live site with this design; the 4 tracks (this design starts with Evening Strings) listened to on a real phone and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual or etsy)
- [ ] G146 live (order number + email open the editor on any device: `/my`, "Create your website"); START HERE re-checked against it
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [x] Web address `bkestudio.com` in the start link, demo, START HERE guide and QR (G190, 2026-10-20)
- [ ] Price (1,190 TL proposal) confirmed for this design and filled in (`config.ts` and §4); quantity 999
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages (G144) and Share → Downloads (G139) tried on the live site with this design
- [ ] Printable invitation: one printed copy checked (5 × 7 in and A5)
- [ ] PAKET 7 prompts written for this design and its 11 GPT scenes made (`assets/gpt/mockups/p7_NN_*.png`)
- [ ] `tools/listing_v4` set up for this design (`themes.json` row, `picks.json` opening frames, `OPENS` "riad doors", the default object word of images 5 and 6 replaced) and the v4 set built: 19 JPGs in `images_v4/` and `video_v4_4x5.mp4`; all 19 alt texts read against the files
- [ ] Image 7 (QR code of the demo) and image 19 (web address) decided against docs/15 §1 and Etsy's Off-Platform policy
- [x] Shop section chosen (§4)
- [ ] Etsy draft created for this design (title, description, tags, category, digital file, images, video)
- [ ] Etsy rules re-checked on the official pages (`00_ANA_DEVIR.md` §34) and in the listing editor (title, tags, images, video, AI disclosure, "Designed by"), with the date written in §0
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
