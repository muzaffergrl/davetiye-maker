# Etsy listing v3: Crimson Rose Atelier Wedding Website (design 21)

Internal listing kit for the seller (G137, 2026-10-17). Not published on Etsy. Theme `crimson-rose-atelier`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the 01–20 listings (G123, G132): every sentence
answers a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling). This design
has no earlier `listing.md`: this is its first listing text. Design facts come from `platform/themes/crimson-rose-atelier/` (README, theme.json,
index.html, home.html, story.html) and `platform/lib/marketing/designs.ts` (sales-site copy written against the G133 theme).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **`preview` — not in the first sales wave** (K55, owner decision 6, 2026-10-23: the first wave is designs 01–20 only). `platform/lib/marketing/config.ts` lists it as `preview` (catalogue "Coming soon on Etsy", no checkout, not startable in production) and `etsy_upload.json` has `sales_status` `preview` (`ready_to_publish` false). From 2026-10-17 (K47) until then it was `live`, price 1190 (G142 `76fe0dc`, coordinator `ce62d11`); the price stays for when it goes live. Same flow, guide and listing text as 01–20 (G148). Do not publish the Etsy draft. |
| Start link `https://bkestudio.com/start?theme=crimson-rose-atelier` | **Not live**: the design is in the repository (G133, branch `codex/crimson-rose-atelier`) and has not been deployed; the user asked for a local demo only. Opened only in a local production build (2026-10-17, G137 capture: /start shows "Design: Crimson Rose Atelier"). Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/crimson-rose-atelier` (in the description under TRY THE LIVE DEMO, and named in image 8) | **Not live**, for the same reason. In the local production build the demo route opens this design's envelope with the sample couple Olivia & James (G133 test, G137 capture). |
| Current platform release (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | Live on production since G079 (2026-10-15) for 01–20. This design needs the next deploy; its editor features were tried only in the local production build of this task (setup, Edit, Guests, Share screens of the capture). |
| Order check (`CLAIM_ORDER_VERIFICATION`) | Decided on (K34, 2026-10-15), but the records disagree on whether it is on in production (docs/10 G092, docs/18 §4); not read in G154 either (no access to the live settings). Since G154 (2026-10-17, K48) the description claims no order check: it says what happens if the editor shows "We are confirming your Etsy order" (Publish opens once the order is confirmed, usually within 24 hours), which is true in every mode. Read the mode before publishing (§11). |
| Questions & answers, RSVP questions | Platform features, the same for every design; tested in a local production build (Chromium, phone size; G133 and this capture). **Not tried on the live site.** |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | In the repository since 2026-10-16; described in the description and FAQ (G132) and in the START HERE guide (G131). **Not on production yet** and not tried on the live site. This design's default track is its own **Rose Nocturne** (`platform/lib/audio/catalog.ts`, K59; the demo content uses the same since 2026-10-23), offered first among 5 tracks in the panel. The tracks were made in code and nobody has listened to them on a real phone yet (G126). The Google Sheets connection has not been tried with a real Google account (G128), so since G154 the description and FAQ only say that a Google Sheet can be connected (the feature), not how it behaves; whether Google sign-in is set up in production is not known (G090: "Google Sheets: coming soon" in a local build without it). |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation (theme README). |
| Description claims (G154, 2026-10-17) | Every sentence of §2 describes a feature that exists in the platform and passed G090's local production-build checks (guest site 21/21; buyer flow 6/6 with RSVP, Excel and CSV, map card, sound button, Downloads and a Spanish website). No VERIFY note is left in §2; the live-site and real-device tests that are still open are in §11 (and in `etsy_upload.json` `open_checks`). The demo line "(sample names and photos)" depends on G090 P1-02 (sample photos in the demos). |
| Edit link by email | **Off.** Sending is built (G147) but stays off until the owner sets up SMTP; the listing and the START HERE guide promise no email. Since G146 (K46) the buyer opens the editor on any device with the Etsy order number + email (`/my`, "Create your website"); the private edit link is a shortcut. Listing and guide say so since G148 (2026-10-17). |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio01@gmail.com** (address corrected 2026-10-16). |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | 1,190 TL, the same as 01–20 (K47, 2026-10-17; `config.ts` price 1190); no stock limit (999, Etsy's maximum). Renewal and the Etsy listing URL are still open. Hosting extension (on request via Etsy before the "Online until" date, no price promised): K48, 2026-10-17. |
| Design fonts and other languages | Checked on 2026-10-17 from the Google Fonts CSS of the fonts this theme loads: Cormorant Garamond and Manrope (both latin-ext + Cyrillic). **2026-10-23 (K59 atelier redesign):** the theme also loads Corinthia (latin + latin-ext, no Cyrillic; `tools/build_customer_guides.py` FONT_SUBSETS), so the language line in GOOD TO KNOW and in the START HERE guide is now the latin-ext one. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` rebuilt in G148 (2026-10-17, `python3 tools/build_customer_guides.py`, from docs/19 Ek A; G146 access with the Etsy order number + email): 9 pages, about 56 KB. Its links are the start link (in the text and on the QR), the `/my` page ("Continue on another device") and the privacy notice; the QR is made by `tools/make_qr.py` and decodes to `https://bkestudio.com/start?theme=crimson-rose-atelier` (jsQR on every rendered page). The start link answers only after this design is deployed. G154 (2026-10-17) rebuilt it from Ek A again (K48 order-check, extension and deletion texts, a Languages section, Share → Downloads, the start address in plain text under the QR): 10 pages, about 59 KB; `--check` with jsQR passes. **2026-10-23 (review fixes):** rebuilt for every design from docs/19 Ek A (`python3 tools/build_customer_guides.py`, all 49 OK): 14 pages in the new look; it says each design bought starts one website (two designs in one order: one each); its links are the start link, `/my`, the privacy notice and the terms of use; the QR decodes to the start link (jsQR). Not scanned with a phone camera. |
| Listing image 9 | `09_devices.png` built on 2026-10-17 (G148, K47): "Start on your phone, continue on any device", real screens of a local production build with G146 (`/my`, Share → "Use on another device"). G146 is live only after the next deploy: publish image 9 with it. |
| Listing images and video | **Produced** on 2026-10-17 from local production builds of the repository: images 3, 5, 6 and 7 and `video.mp4` (12 s, §6) in G137; images 1, 2, 4 and 8 in G137 (second pass) on this design's GPT mockup scenes (G821, `assets/gpt/mockups/`). All 8 in `images_editorial/` (§5). Nothing uploaded to Etsy. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (guide, images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 121 characters.

```text
Crimson Rose Atelier Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Burgundy Rose
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Deep crimson roses, warm gold and ivory paper. Your guests tap a burgundy envelope with a gold botanical wax seal: the seal lifts away, the flap opens and an ivory card rises from its pocket. Then your invitation follows: Home with your names and an oval portrait, Our Story as a photo album, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/crimson-rose-atelier
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Crimson Rose Atelier design: envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "A little book of us")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website for each design you buy (two designs in one order: one website each). You choose your web address when you start (for example …/olivia-and-james); it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language; accented Latin letters use the design's fonts, while Cyrillic and other alphabets show in a plain standard font in some or all places.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.
• Terms of use: https://bkestudio.com/terms

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
| Price | **1,190 TL** (the shop price approved by the user on 2026-10-22 (K49, launch price; docs/35 §8b) for designs 01–20; about USD 24.02 at 49.55 TRY per USD, docs/23 §1). Shop currency TRY (K38). Approved for this design with its sale on 2026-10-17 (K47) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Floral & Garden (an existing section, docs/20 §3, which lists 01–05 only; the section for designs 06–21, or a new one, is the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set: 19 JPGs of 2000 × 2500 (4:5) in `package/listing/images_v4/`, in Etsy's upload order (`tools/listing_v4/README.md`, docs/20 §7.10), in the template the user approved on design 01. Image 1 (`cover_v4.html`) and images 2–8 (`slides.py`) show only real screens: the live demo's opening stills and guest pages and editor screens from a local production build. Images 9–19 (`lifestyle.py`) put real screens into this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_NN_*.png`). Image 7 carries a QR code of the live demo and image 19 the line "bkestudio.com/your-names" (kept by the decision in docs/20 §7.11). The v4 set replaced the editorial set (`images_editorial/`, not uploaded any more) on the Etsy draft on 2026-10-21 (docs/20 §7.10). The alt texts below were written on 2026-10-23 from the files: images 1, 2, 5, 7, 9, 10 and 15 of this design were read; the other twelve follow the shared template (read on design 01) and name only what every design's version shows. Etsy's per-image alt text was not entered on the draft (docs/20 §7.9; §7.10–§7.13 record no later entry).

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Crimson Rose Atelier wedding website with RSVP: two phones show the burgundy envelope with a gold botanical wax seal under crimson roses and the names Olivia & James, and the open envelope with the ivory card and its oval photo; badges No Canva needed, RSVP guest list included, Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show 1 guests tap the burgundy envelope with its gold seal, 2 the seal is gone and the flap opens, 3 the ivory card with your oval photo rises, Our wedding, Olivia & James, June 12, 2027; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease, online RSVP built in: the guest's reply form on one phone, and the editor's guest list with guests coming, not coming and replies on another; badges for your own questions and the Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: three editor screens, 1 pick a page, 2 change any text, 3 publish; a No Canva needed badge; every change saves by itself |
| 5 | `05_pages.jpg` | Every page beautifully included, Crimson Rose Atelier, 4 pages and the envelope: Home with large names on burgundy and an oval portrait, Our Story with a chapter album, Details with the celebration and order of the day, and RSVP; countdown, schedule, map, Q&A, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included in Crimson Rose Atelier: the invitation on a phone next to a checklist: envelope opening with Home, Our Story, Details and RSVP pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation PDF, easy editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the burgundy envelope with its gold wax seal under crimson roses on a phone next to a QR code of the live demo; scan it with your phone camera or tap the demo link in the description; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works, simple 3-step setup: 1 buy and open the START HERE guide from your Etsy purchases, 2 start with your Etsy order number and first names, 3 personalize names, date, photos, story, RSVP questions, 4 publish and share one link by text, WhatsApp, email or QR; the Add your photo step on a phone |
| 9 | `09_closeup.jpg` | Designed to be opened: a phone on cream linen among crimson roses, petals, ivory silk ribbon and a sealed burgundy envelope shows the open envelope and the ivory card with the couple's oval photo; caption Your photo and your names |
| 10 | `10_tap.jpg` | One tap and it opens, for your guests: a hand holds a phone with the burgundy envelope and gold seal under the names Olivia & James, a finger ready to tap, over linen and travertine with crimson roses and a sealed envelope; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, no app, no account: a guest's phone shows the Crimson Rose Atelier home page; just one link on any phone |
| 12 | `12_devices.jpg` | Beautiful on every screen, phone, tablet and computer: the Crimson Rose Atelier home page on a tablet and the invitation on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too, your private editor: the editor on a laptop with the page's fields beside a preview of the website; see every change in the preview |
| 14 | `14_together.jpg` | Plan it together, open your editor on any device: the editor's guest list on a phone and on a laptop |
| 15 | `15_print.jpg` | Print it or send it, printable invitation included: the printed deckle-edged ivory card with crimson roses and a gold seal next to a phone with the burgundy envelope, on linen with rose petals and ivory ribbon; 5×7 in or A5 PDF in your design |
| 16 | `16_need.jpg` | Everything your guests need, on four phones: the invitation, the venue with its photo and map, questions and answers, and the thank-you after a sent RSVP |
| 17 | `17_day.jpg` | The order of the day, on the wedding day: the Details page's schedule on a phone, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Every reply in one place, guest list included: the editor's list of replies on a phone, each marked coming or not coming; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: the editor's Share screen on a phone with the website link and a Copy link button; caption Your own address: bkestudio.com/your-names |

## 6. Video

`package/listing/video_v4_4x5.mp4`: the 4:5 hover video of the v4 set, on the Etsy draft since 2026-10-22 (docs/20 §7.10). `tools/listing_v4/stageE.sh`: `rec.mjs` records the live demo `https://bkestudio.com/start/demo/crimson-rose-atelier` in slow motion (page time 50–70× slower, 432 × 540 at 2.5× = 1080 × 1350); `full45.py` turns the frames into a 60 fps vertical H.264 video, about 10.5 seconds for 01–21, whose last 0.4 seconds dissolve into the first frame so Etsy's loop has no jump. It starts on the burgundy envelope and shows the gold botanical seal lifting away, the flap opening, the ivory card with the oval portrait rising and the home page (sample names and photos). It is made from still frames, so it has no sound track. Length and size were not re-measured on 2026-10-23. The square `video.mp4` of the editorial set stays in the folder and is no longer on the draft. [VERIFY: Etsy video rules in the listing editor]

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

## 10. What differs from the 01–20 listings

- A new design (G133), opened for sale on 2026-10-17 (K47, `live`, 1,190 TL); its start link and demo answer on the live site only after the next deploy (not checked in G148). The editor screens were seen in a local production build. **2026-10-23 (K55):** back to `preview`, not in the first sales wave (01–20 only).
- The guests' first view is "a sealed envelope" (as 01–05: this envelope carries a gold wax seal); Our Story is a landscape photo album the guests swipe through, so the description names it "Our Story as a photo album".
- "What you can change" has no monogram line (this design shows none) and gives "A little book of us", this design's story heading, as the second example of your own wording.
- Language line from this theme's real fonts (§0): since the K59 redesign Corinthia has no Cyrillic → latin-ext line (2026-10-23). The rest of §2 still describes the pre-redesign opening and pages: rewrite before this listing is published (docs/38).

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (K47 on 2026-10-17 approved it; K55 on 2026-10-23 took it out of the first wave: `config.ts` `preview`; needs the owner's go again)
- [ ] Design deployed; start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR; G137, 2026-10-17)
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Music, map and directions, the reply form and Excel download (G126–G128) live and tried on the live site; the 4 tracks listened to and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual or etsy)
- [ ] G146 live (order number + email open the editor on any device: `/my`, "Create your website"); START HERE (G148) re-checked against it
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Price (1,190 TL) confirmed for this design (K47) and filled in; quantity 999
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages (G144) and Share → Downloads (G139) tried on the live site
- [ ] Printable invitation: decor no longer over the text (G090 P1-01, G155) and one printed copy checked
- [x] GPT mockup scenes (G821) made; images 1, 2, 4 and 8 built; all 8 alt texts read against the files (2026-10-17)
- [x] Video produced (G137, 2026-10-17)
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
