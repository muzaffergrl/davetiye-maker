# Etsy listing v3: Silver Photo Booth Wedding Website (design 39)

Internal listing kit for the seller (written 2026-10-22 on the G154 standard of `collections/21_Crimson_Rose_Atelier/package/listing/listing_v3.md`).
**Draft: not published on Etsy (K41), and the design is not for sale.** Theme `silver-photo-booth`. Same structure and wording as the 01–21
listings (`docs/19_ALICI_YOLCULUGU.md` §4): every sentence answers a buyer question and promises only what the platform does today. Product
language: English (US spelling). This design has no earlier listing text: this is its first. Design facts from
`platform/themes/silver-photo-booth/` (README, theme.json, content.demo.json, `img/manifest.json`), `platform/lib/marketing/designs.ts`,
`platform/lib/audio/catalog.ts`, `platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts`, `platform/lib/claim/demo-photos.json`,
the live demo page and the listing images 01–08 in `package/listing/images_v4/` (opened and read on 2026-10-22).

## 0. Status before publishing

| Item | Status on 2026-10-22 |
|---|---|
| Sale status | **Not for sale.** `platform/lib/marketing/config.ts` lists it as `coming` (hidden from the site), price `[PRICE]`. This listing stays an unpublished draft. |
| Design build | Built from the design's **own GPT parts, all present** (G439, fourth-wave pilot: PAKET 5 W1–W17, PAKET 2 photos, PAKET 6 print grounds; `img/manifest.json` `waiting_for_gpt` is empty). The first page is a pearl-silver envelope with a deep U flap, wrapped in a black-and-white photo-booth strip that shows the couple's three story photos; a flashbulb fires, the strip slides off and rests beside the envelope, the flap swings up onto its black star-dust lining, the card rises and comes forward with a second flash (README "The opening"). Known limit (README): the font fallback faces still carry the numbers of the copied template until they are measured against Yesteryear (G180 lists this theme as a diagnostic). |
| Start link `https://bkestudio.com/start?theme=silver-photo-booth` | **404 on the live site** (coordinator's curl, 2026-10-22): `/start` opens only live designs. |
| Live demo `https://bkestudio.com/start/demo/silver-photo-booth` (in the description under TRY THE LIVE DEMO) | **200 on the live site** (coordinator's curl, 2026-10-22). Fetched again in this task (2026-10-22): the flashbulb (`bulb-200`), the sample names Josephine & Miles, May 8, 2027 · Saint Louis, and this design's own sample photos (`/demo/silver-photo-booth/…`, hero and story 1–3). Not opened on a phone. |
| Questions & answers, RSVP questions, music, map and directions, reply form with Excel and Google Sheets, languages, Downloads, guest password, thank-you page | Platform features, the same for every design (README "Inner pages": G042 form, G051 questions, G069 guest names, G127 map, G075 thank-you mode, G144 languages); tried in local production builds for 01–21 (G090, G133); images 03–05 show this design's reply form, guest list and pages from a local production build. **Not tried with this design on the live site.** This design's default track is Evening Strings (`catalog.ts`); the demo pin is Saint Louis, Missouri (`demo-map.ts`; the ballroom is fictional). Nobody has listened to the 4 music tracks on a real phone. The Google Sheets connection has not been tried with a real Google account, so the description only says that a Google Sheet can be connected. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** README: the photos' `filter` animations cost a little on old phones; reduced motion turns them off. |
| Description claims | Every sentence of §2 describes a feature of the platform (the same claims as the 21 listing, G154) or this design's look as the theme builds it today. No VERIFY note is left in §2; the open live-site and real-device tests are in §11. |
| Order check (`CLAIM_ORDER_VERIFICATION`) | Mode in production not read in this task. G191 (2026-10-22, in review on a branch, not live) adds a `trust` mode (publish first, check the order afterwards). The description says only what happens if the editor shows "We are confirming your Etsy order"; re-read that sentence if `trust` goes live (§11). |
| Edit link by email | Off as recorded in the 21 listing (2026-10-17: sending built in G147, waits for SMTP); not re-read in this task. The listing and the START HERE guide promise no email: the buyer opens the editor on any device with the Etsy order number + email (`/my`). |
| Web address | `bkestudio.com` (primary since 2026-10-19; links of the earlier `xn--bkestudo-zkb.com` redirect here with a permanent 308). |
| Shop name, support email | **BKE Studio**, **bkestudio01@gmail.com** (the address `bkestudio@gmail.com` in older listing files is wrong). The description gives no email: buyers message the shop on Etsy. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Blocker:** 1,190 TL is the approved shop price for a template design (docs/23 §1, user, 2026-10-16) and is used here as the proposal; it is not confirmed for this design (`config.ts` price `[PRICE]`). Quantity 999 (Etsy's maximum, no stock limit). |
| Design fonts and other languages | Google Fonts subsets read on 2026-10-22: Yesteryear (latin, latin-ext; names and headings) and Libre Caslon Text (latin, latin-ext; body), on the website and on the printable invitation: no Cyrillic. The language line is the guide's "latin-ext" line (`tools/build_customer_guides.py` `LANGUAGE_LINES`, coordinator 2026-10-22): accented Latin letters in the design's fonts, Cyrillic and other alphabets in a plain standard font in some or all places. |
| Etsy rules | `etsy.com/legal/creativity` and the help page "How to Manage Your Digital Listings" answered 403 to this task's fetch (2026-10-22). A web search on 2026-10-22 returned Etsy's House Rules excerpt: items generated with AI tools from the seller's own prompts belong to "Designed by a seller", and the listing description must disclose the use of AI. The AI sentence in GOOD TO KNOW is written for that; re-check in the listing editor (§11). Canva is not part of this product (K24) and was not checked. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf`, **built and checked 2026-10-22** (coordinator, `tools/build_customer_guides.py`, the same source text as 31–32, docs/19 Ek A): 10 pages; its links are the start link, the `/my` page and the privacy notice; the QR decodes to the start link (jsQR). The start link answers only once the design is live (404 today). |
| Printable invitation | `layouts.ts` entry of 2026-10-21 (G439): the design's own PAKET 6 grounds (ivory card stock; front: a strand of silver star sequins with ivory ranunculus across the top and a hairline with a star at the foot; back: a short strand), 5 × 7 in and A5. Not printed yet. |
| Listing images and video | **Partly built** (v4 set, docs/20 §7.10, `tools/listing_v4/README.md`): images **01–08** (`01_cover.jpg` … `08_how.jpg`, 2000 × 2500) and the hover video `video_v4_4x5.mp4` are in `package/listing/` (2026-10-22). This task opened the 8 JPGs and wrote their alt texts from them (§5); the video was not watched in this task. Images **09–19** (lifestyle) are **not built**: they wait for this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_*.png`, none yet; prompts in `assets/gpt/GPT_PROMPTS.md` PAKET 7). Nothing uploaded to Etsy. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 121 characters.

```text
Silver Photo Booth Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Vintage Black and White
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Pearl grey, ivory, polished chrome and black and white, like the photo booth in the corner of a 1940s hotel ballroom. Your guests tap a pearl-silver envelope wrapped in a black-and-white photo-booth strip that already shows three of your photos: a flashbulb fires, the strip slides off and settles beside the envelope, the U-shaped flap swings up onto its black star-dust lining, and the card with your portrait in a chrome booth window rises out of the envelope and comes forward with a second flash. Then your invitation follows: Home with an ivory card, a strip of three photos that prints out of the booth's slot and the day on a black star-dust band, Our Story with photos that develop after a flash in chrome booth windows, Details with the venue as a deckled print, and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/silver-photo-booth
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Silver Photo Booth design: envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "Picture us together" or "Moments we hold dear")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a silver envelope wrapped in a photo strip. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging services show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/josephine-and-miles); it cannot be changed later. A custom domain (yournames.com) is not included.
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

Etsy: 13 tags, each up to 20 characters (checked). Keyword choices are hypotheses (no search-volume data). No other company's brand name.

```text
wedding website
rsvp website
digital invitation
envelope invitation
online rsvp
wedding rsvp
wedding invitation
photo booth wedding
silver wedding
vintage wedding
black white wedding
1940s wedding
photo strip invite
```

Character counts: 15 · 12 · 18 · 19 · 11 · 12 · 18 · 19 · 14 · 15 · 19 · 13 · 18 (all ≤ 20).

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did [VERIFY: Etsy's House Rules (web search excerpt, 2026-10-22) put designs made with AI tools from the seller's own prompts under "Designed by a seller"; pick the matching option in the listing editor] |
| What is it | A finished product |
| When was it made | Made to order (choose what Etsy offers for digital items) |
| Occasion | Wedding |
| Primary color | Silver |
| Secondary color | Black |
| Style / theme | Vintage, Classic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (built and checked 2026-10-22; Etsy: up to 5 files, 20 MB each, as recorded in the 21 listing) |
| Price | **1,190 TL proposed** (the approved shop price for a template design, user, 2026-10-16, docs/23 §1; about USD 24.02 at 49.55 TRY per USD). Shop currency TRY (K38). **Not confirmed for this design** (`config.ts` `[PRICE]`): blocker until the user confirms it |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Suggestion: `Classic & Vintage` (an existing section, docs/20 §3; the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set (docs/20 §7.10, `tools/listing_v4/README.md`, the template approved on design 01 on 2026-10-21): 19 JPGs, 4:5 (2000 × 2500), in `package/listing/images_v4/`, in Etsy upload order. **Images 01–08 are built** (2026-10-22): the phones show the live demo's opening stills (01, 02, 07: sample names Josephine & Miles and this design's own sample photos) and real screens of a local production build (03–06, 08). The alt texts of 01–08 were written from the files on 2026-10-22. Seen in the files: image 04 shows the editor with another sample couple (Elena & Marco) and our web address `bkestudio.com/elena-and-marco` on the "Your website is live" screen; image 07 carries a QR code of the live demo (§11). **Images 09–19 are not built**: they place real screens into this design's PAKET 7 GPT scenes (pearl-grey satin, a chrome flashbulb, a black-and-white photo strip, ivory ranunculus and dusty miller, per `GPT_PROMPTS.md` PAKET 7), which do not exist yet; their alt texts are planned from the template (`lifestyle.py` LIFE) and must be rewritten against the files.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Silver Photo Booth wedding website with RSVP: two phones show the closed pearl-silver envelope wrapped in a black-and-white photo strip under a flashbulb, and the opened envelope with its black star-dust lining and the card with a sample portrait in a chrome booth window for Josephine & Miles, May 8, 2027; badges: No Canva needed, RSVP guest list included, Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show 1 guests tap the silver envelope with its photo strip, 2 it opens onto the star-dust lining with the strip set aside, 3 your photo on the card in a chrome booth window; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: a guest's reply form in this design with name, optional email, attendance, number of guests and a meal choice, and the couple's guest list in the editor with 9 guests coming, 1 not coming, 5 replies and a Download Excel button; badges: your own questions, Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: the editor's page list (Us, Day & place, Photos, Our Story, Details, RSVP), the Headings & labels screen with suggested wording, and the "Your website is live" screen with Copy link; every change saves by itself |
| 5 | `05_pages.jpg` | Every page included: four phones show Home with the portrait in a chrome booth window on an ivory card, Our Story with a black-and-white photo, Details with the order of the day marked by silver stars, and the RSVP form; countdown, schedule, map, Q&A, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included: the invitation "Picture us together" with the sample full names, date and venue on a phone, beside a checklist: envelope opening with Home, Our Story, Details and RSVP pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation (PDF), editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the closed silver envelope with its photo strip on a phone next to a QR code of the live demo; scan it with your phone camera or tap the demo link in the description; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works in four cards: buy and open the START HERE guide from your Etsy purchases, start with your Etsy order number and first names, personalize names, date, photos, story and RSVP questions, publish and share one link by text, WhatsApp, email or QR; in the middle the setup step "Add your photo" with a sample portrait |
| 9 | `09_closeup.jpg` | Designed to be opened: a close-up of a phone on pearl-grey satin, showing the opened card with a sample photo and the names |
| 10 | `10_tap.jpg` | One tap and it opens: a hand about to tap a phone that shows the closed silver envelope with its photo strip; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, with no app and no account: a guest at home holds a phone with the Home page |
| 12 | `12_devices.jpg` | Beautiful on every screen: the website on a tablet and on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too: the private editor with its page preview on a laptop |
| 14 | `14_together.jpg` | Plan it together: the guest list on a phone and on a laptop; your editor opens on any device |
| 15 | `15_print.jpg` | Print it or send it: the printable invitation in this design (5 × 7 in or A5 PDF) beside a phone with the closed silver envelope |
| 16 | `16_need.jpg` | Everything your guests need: four phones show the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | On the wedding day: the order of the day on a phone at a reception table, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Every reply in one place: the list of replies on a phone beside a bouquet; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: one person shows the Share screen to another; your own address with your names |

## 6. Video

`package/listing/video_v4_4x5.mp4`: **built** (in the folder on 2026-10-22; `tools/listing_v4/stageE.sh`, docs/20 §7.10); **not watched in this task.** By its pipeline: the envelope opening recorded from the live demo in slow motion (page time 50× slower, `rec.mjs`) and played back at 60 fps by `full45.py`: 1080 × 1350 (4:5, the shape of Etsy's search grid), H.264, silent; its last 0.4 s dissolve into the first frame, so Etsy's loop has no jump. Sample names and photos. [VERIFY: Etsy video rules in the listing editor]

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

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them): `welcome_start`, `start_link_reminder`, `publish_blocked_pending`, `order_confirmed`, `how_to_publish`, `new_edit_link`, `order_already_used`, `wrong_design_started`, `extra_change_granted`, `date_moved`, `photo_upload_help`, `guest_access_help`, `general_help`, `archive_notice`, `after_wedding_tip`, `review_request`, `refund_or_problem`, `delete_data`.
Rules: the edit link is sent only with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit
link; one review request per order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- Not for sale (`coming`); the price is a proposal; the start link answers 404 until the design is live.
- The first design of the fourth wave, built from its own GPT parts from the start (no interim pieces); its live demo has its own sample photos.
- The envelope is not the V flap and wax seal of 01–21: a pearl-silver envelope with a deep U flap, held by a photo-booth strip of the couple's own three story photos, opened with a camera flash.
- "What you can change" has no monogram line (this design shows none) and gives "Picture us together", this design's invitation heading, as an example.
- Language line: the guide's "latin-ext" line (§0).
- Images and video: the 4:5 v4 set (19 images + hover video) instead of the editorial 9 + square video of 01–21; 01–08 and the video exist, 09–19 wait for PAKET 7.

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (`config.ts` from `coming` to `live`; 1,190 TL proposed)
- [ ] Design deployed as `live`; start link answers on the live site (`200`, design named): 404 on 2026-10-22
- [x] Live demo of this design answers on the live site (`200`, coordinator's curl, 2026-10-22), with this design's own sample photos
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide built and checked for this design (2026-10-22, `tools/build_customer_guides.py`: 10 pages; links: start link, `/my`, privacy notice; the QR decodes to the start link with jsQR)
- [ ] Questions & answers and RSVP questions tried on the live site with this design
- [ ] Music, map and directions, the reply form and Excel download tried on the live site with this design; the 4 tracks listened to on a real phone and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode in production today (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual, etsy); if G191's `trust` mode goes live, the order sentence re-read
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome); the photos' develop animation checked on an older phone
- [ ] Font fallback faces measured against Yesteryear (README known limit; G180 diagnostic)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages and Share → Downloads tried on the live site with this design
- [ ] Printable invitation of this design: one printed copy checked
- [x] v4 images 01–08 built and their alt texts written from the files (2026-10-22)
- [ ] PAKET 7 scenes made (`assets/gpt/mockups/p7_01…p7_11`); images 09–19 built; their alt texts rewritten against the files
- [x] Video built (`video_v4_4x5.mp4`, in the folder on 2026-10-22)
- [ ] Video watched and approved (not watched in this task)
- [ ] QR code of the live demo in image 07 and our web address (`bkestudio.com/elena-and-marco`) in image 04, and the address line planned for image 19: the user decides against docs/15 ("Etsy dışına yönlendirme": no QR in the listing, Off-Platform policy)
- [ ] `tools/etsy_upload.py` reads `images_editorial/` and `video.mp4`; pointed at `images_v4/` and `video_v4_4x5.mp4` (coordinator)
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
