# Etsy listing v3: Crimson Rose Atelier Wedding Website (design 21)

Internal listing kit for the seller (G137, 2026-10-17). Not published on Etsy. Theme `crimson-rose-atelier`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the 01–20 listings (G123, G132): every sentence
answers a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling). This design
has no earlier `listing.md`: this is its first listing text. Design facts come from `platform/themes/crimson-rose-atelier/` (README, theme.json,
index.html, home.html, story.html) and `platform/lib/marketing/designs.ts` (sales-site copy written against the G133 theme).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **Live: open for sale** (kullanıcı 2026-10-17'de satışa açtı, G142). `platform/lib/marketing/config.ts` lists it as `live` with price `1460`. |
| Start link `https://davetiye-platform-five.vercel.app/start?theme=crimson-rose-atelier` | **Not live**: the design is in the repository (G133, branch `codex/crimson-rose-atelier`) and has not been deployed; the user asked for a local demo only. Opened only in a local production build (2026-10-17, G137 capture: /start shows "Design: Crimson Rose Atelier"). Not opened on a phone. |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/crimson-rose-atelier` (in the description under TRY THE LIVE DEMO, and named in image 8) | **Not live**, for the same reason. In the local production build the demo route opens this design's envelope with the sample couple Olivia & James (G133 test, G137 capture). |
| Current platform release (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | Live on production since G079 (2026-10-15) for 01–20. This design needs the next deploy; its editor features were tried only in the local production build of this task (setup, Edit, Guests, Share screens of the capture). |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | Decided on (K34, 2026-10-15), but the records disagree: docs/10 (G092) says the variable is not set in production, docs/18 §4 says it was added on 2026-10-15 and reported off again on 2026-10-16. Not read in this task. The listing keeps "We confirm each order in our shop before a website can go live" with [VERIFY: manual order check on in production]: read the value in Vercel, or delete the sentence before publishing. |
| Questions & answers, RSVP questions | Platform features, the same for every design; tested in a local production build (Chromium, phone size; G133 and this capture). **Not tried on the live site.** |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | In the repository since 2026-10-16; described in the description and FAQ (G132) and in the START HERE guide (G131). **Not on production yet** and not tried on the live site. This design's default track is Evening Strings (`platform/lib/audio/catalog.ts`, G133). The 4 music tracks were made in code and nobody has listened to them yet (G126). The Google Sheets connection has not been tried with a real Google account (G128), so the description and FAQ keep a VERIFY note on it. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation (theme README). |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing says so. |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale (or keep a permanent redirect from this one). |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | 1,460 TL, the shop price of designs 01–20 (decided 2026-10-16), approved for this design by the user on 2026-10-17; no stock limit (999, Etsy's maximum). Hosting extension, renewal and the Etsy shop URL are still open. |
| Design fonts and other languages | Checked on 2026-10-17 from the Google Fonts CSS of the fonts this theme loads: Cormorant Garamond and Manrope (both latin-ext + Cyrillic). The language line in GOOD TO KNOW and in the START HERE guide is written from this. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` built in G137 (2026-10-17, `python3 tools/build_customer_guides.py --designs 21`, from docs/19 Ek A): 9 pages. Its only links are the start link (in the text and on the QR) and the privacy notice; the QR is made by `tools/make_qr.py` and decodes to `https://davetiye-platform-five.vercel.app/start?theme=crimson-rose-atelier` (jsQR on every rendered page). The start link answers only after this design is deployed. |
| Listing images and video | **Produced** on 2026-10-17 from local production builds of the repository: images 3, 5, 6 and 7 and `video.mp4` (12 s, §6) in G137; images 1, 2, 4 and 8 in G137 (second pass) on this design's GPT mockup scenes (G821, `assets/gpt/mockups/`). All 8 in `images_editorial/` (§5). Nothing uploaded to Etsy. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (guide, images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 113 characters.

```text
Crimson Rose Atelier Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Burgundy Rose
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Deep crimson roses, warm gold and ivory paper. Your guests tap a burgundy envelope with a gold botanical wax seal: the seal lifts away, the flap opens and an ivory card rises from its pocket. Then your invitation follows: Home with your names and an oval portrait, Our Story as a photo album, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://davetiye-platform-five.vercel.app/start/demo/crimson-rose-atelier
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Crimson Rose Atelier design: envelope opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze; add a separate reception place if you need one [VERIFY: try on the live site]
• Soft background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and gentle sound effects as the invitation opens. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
• A QR code of your website (PNG or SVG) for printed cards and signs
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
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "A little book of us")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/olivia-and-james); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters and Cyrillic use the design's fonts, other alphabets a plain standard font.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
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
burgundy wedding
red rose wedding
crimson wedding
romantic wedding
wax seal invitation
rose invitation
```

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did [VERIFY: the "Designed by" option for designs made with AI image tools] |
| What is it | A finished product |
| When was it made | Made to order (choose what Etsy offers for digital items) |
| Occasion | Wedding |
| Primary color | Red |
| Secondary color | Beige |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (G137, 2026-10-17; Etsy: up to 5 files, 20 MB each) |
| Price | **1,460 TL** (the shop price approved by the user on 2026-10-16 for designs 01–20 and on 2026-10-17 for this design; about USD 29.48 at 49.53 TRY per USD, docs/23 §1). Shop currency TRY (K38). Approved for this design on 2026-10-17 (`config.ts`: `live`, `1460`) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Floral & Garden (an existing section, docs/20 §3, which lists 01–05 only; the section for designs 06–21, or a new one, is the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The 8 images in `images_editorial/` are the editorial set (`python3 tools/listing_editorial.py --theme crimson-rose-atelier`, rules in `docs/21_ILAN_GORSELLERI.md`). Every phone shows a real screen of this design, captured on 2026-10-17 from a local production build of the platform (sample names and the theme's own sample photos; the opening stills at 3× density by `tools/listing_editorial/capture_opening.ts`): images 3, 5, 6 and 7 in G137 (main `8d51815` + G133), images 1, 2, 4 and 8 in a second capture of the same day (branch `claude/zealous-fermi-hy1o40`, G133 + G138, G140, G141). Images 1, 2, 4 and 8 place those screens into this design's GPT mockup scenes (`assets/gpt/mockups/`, G821: crimson roses, a burgundy envelope with a gold wax seal, cream silk ribbon, travertine); image 7 places them into the shop-wide GPT linen scene with three phones (`brand/trust/t1_three_steps.png`, GM06); images 3, 5 and 6 lay them out on this design's GPT paper texture. No image carries a QR code or a web address (Etsy Off-Platform policy, docs/15 §4.1). The alt texts below were read against these files on 2026-10-17.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Crimson Rose Atelier wedding website with online RSVP on a phone held in a hand, among crimson roses: the opening page with a burgundy envelope with a gold wax seal and the names Olivia & James |
| 2 | `02_opening.png` | It opens like a real invitation: three phones show the envelope closed with its gold wax seal, the envelope opening, and the invitation card rising out of it |
| 3 | `03_pages.png` | Every page guests need, on five phone screens: home with the names and an oval portrait, the story album, the invitation card with a countdown, the order of the day and the RSVP page |
| 4 | `04_edit.png` | Make every word yours: the online editor on a phone held in two hands, next to a list of what you change (names, date and venue; photos and story; schedule and questions and answers; every heading and label). The artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Every reply in one place: the guest's RSVP form with a meal choice, and the couple's guest list in the editor with each reply and a Download Excel button |
| 6 | `06_details.png` | Everything guests ask: the celebration programme with the order of the day, the venue photo with add-to-calendar buttons, and the dress code with questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize your names, date and a photo, then publish and share one link or print the QR code |
| 8 | `08_included.png` | What is included: the envelope opening and four pages, your own online editor, online RSVP and guest list, QR code and START HERE guide; online until 12 months after your wedding, live demo link in the description |

Suggested extra images (answer the most common questions before purchase; layout and type only, K21; real screens):
- 9 `09_what_you_change.png`: two columns "You change" (names, date, venue, schedule, story, 5 photos, Q&A, RSVP questions, headings and labels) / "Stays as designed" (artwork, colors, fonts, layout, envelope animation).
- 10 `10_good_to_know.png`: "No Canva · no app · no account", "Online until 12 months after your wedding", "Save your private edit link", "Names and date: 3 changes after publishing, small fixes free", "Optional guest password", "Thank-you page after the wedding".

## 6. Video

`package/listing/video.mp4` (G137, 2026-10-17, `python3 tools/listing_editorial.py --theme crimson-rose-atelier --video`): the envelope opening, recorded from the real website in the local production build (sample names and photos). Silent, square (1080 × 1080, H.264), 12 seconds; it starts on the closed envelope with its gold seal and its last half second dissolves back into it, so Etsy's loop has no black flash (first and last frame compared on 2026-10-17, mean difference about 5/255). Etsy's video rules come from web-search excerpts of Etsy's help pages (2026-10-14: 5–15 s, up to 100 MB, at least 500 px, no sound). [VERIFY: Etsy video rules in the listing editor]

## 7. FAQ (end of the description, or the shop FAQ)

**Do I need Canva or an app?**
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

**How do I start after buying?**
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number. You can also use the start link in our Etsy message.

**Do I need an account or a password?**
No. You get a private edit link that opens your editor. Save it right away; we cannot email it to you yet.

**What if I lose my edit link?**
If your editor is still open, copy it again under Share. Otherwise message us on Etsy with your order number: we send you a new link and the old one stops working.

**Can I change things after I publish?**
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

**Can I change the headings and wording?**
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

**Can it be in another language?**
You can write your own texts and headings in any language. Built-in messages such as reply form errors stay in English.

**How do my guests reply?**
On your RSVP page, with no app or account. You choose which fields are required and can add up to 10 questions of your own. You see every reply in your editor and can download them all as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply. [VERIFY: Google Sheets connection tested live]

**How many guests can I invite?**
As many as you like. One reply can include up to 10 people.

**Is there music?**
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and gentle sound effects as the invitation opens. You can turn music or sound effects off, and guests can mute the sound with one tap.

**Can guests find the venue?**
Yes. Your Details page can show a map of the venue (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze. If the reception is somewhere else, add it as a second place.

**Can I add a password?**
Yes, optional: one shared password that you send to your guests with the link.

**How long does my website stay online?**
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page.

**Can I use my own domain?**
Not at the moment. Your address is your names on our web address.

**Is anything printed or shipped?**
No. It is a digital product.

## 8. Etsy's automatic messages (shop-wide, the same for every design)

Etsy's "Message to Buyers for Digital Items" applies to every digital listing, so it cannot carry this design's own start link: it links
the design chooser `https://davetiye-platform-five.vercel.app/start` (docs/19 §4.4). The START HERE PDF carries this design's own link. Both texts are already entered in
Shop Manager (docs/20 §7.1) and need no change for this design.

Message to Buyers for Digital Items:

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: https://davetiye-platform-five.vercel.app/start

You will enter your Etsy order number, your email and your first names. Then SAVE YOUR EDIT LINK when it appears: it opens your editor, and we cannot email it to you yet.

Questions? Message us here on Etsy with your order number.
```

Message to Buyers (receipt):

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at https://davetiye-platform-five.vercel.app/start (choose the design you bought). Please save your private edit link when it appears. Questions? Message us on Etsy.
```

## 9. After the sale

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them): `welcome_start`, `start_link_reminder`, `publish_blocked_pending`, `order_confirmed`, `how_to_publish`, `new_edit_link`, `order_already_used`, `wrong_design_started`, `extra_change_granted`, `date_moved`, `photo_upload_help`, `guest_access_help`, `general_help`, `archive_notice`, `after_wedding_tip`, `review_request`, `refund_or_problem`, `delete_data`.
Rules: the edit link is sent only with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit
link; one review request per order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–20 listings

- A new design (G133), not on the live site and not open for sale (`coming`): the start link, the demo and the editor screens were seen only in a local production build.
- The guests' first view is "a sealed envelope" (as 01–05: this envelope carries a gold wax seal); Our Story is a landscape photo album the guests swipe through, so the description names it "Our Story as a photo album".
- "What you can change" has no monogram line (this design shows none) and gives "A little book of us", this design's story heading, as the second example of your own wording.
- Language line from this theme's real fonts (§0): both have Cyrillic.

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (`config.ts`: `coming` → `live`)
- [ ] Design deployed; start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR; G137, 2026-10-17)
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Music, map and directions, the reply form and Excel download (G126–G128) live and tried on the live site; the 4 tracks listened to and approved; Google Sheets connected with a real Google account
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [ ] Price (1,460 TL) confirmed for this design and filled in; quantity 999
- [ ] Hosting extension and renewal decided
- [x] GPT mockup scenes (G821) made; images 1, 2, 4 and 8 built; all 8 alt texts read against the files (2026-10-17)
- [x] Video produced (G137, 2026-10-17)
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
