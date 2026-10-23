# Etsy listing v3: Mediterranean Lemon Wedding Website (design 05)

Internal listing kit for the seller (G091, 2026-10-15). Not published on Etsy. Theme `mediterranean-lemon`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32): every sentence answers a buyer question from docs/19 §3 and promises only what
the platform does today. Product language: English (US spelling). This design has no earlier `listing.md`: this is its first listing text. `tools/listing_kit.py` reads this file (since 2026-10-15).

## 0. Status before publishing

| Item | Status on 2026-10-16 |
|---|---|
| Start link `https://bkestudio.com/start?theme=mediterranean-lemon` | **Moved to the brand domain** (G189, 2026-10-18); not yet opened there from a phone. On the earlier Vercel address it answered `200` on 2026-10-16 and the page names the design ("Design: Mediterranean Lemon", with the "Create my website" form). Checked through the Vercel connector on production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW` (G122); a direct `curl` from this environment is refused by its proxy. Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/mediterranean-lemon` (in the description under TRY THE LIVE DEMO, and named in image 8) | **Moved to the brand domain** (G189, 2026-10-18); not yet opened there from a phone. On the earlier Vercel address it answered `200` on 2026-10-16; the page is this design's opening (`data-theme="mediterranean-lemon"`, sample couple Isabella & Marco). Same check, not opened on a phone. |
| Current platform release live (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | **Live** since G079 (2026-10-15, docs/10 §2). Production on 2026-10-16 is `b952bc8` (`dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW`). It does **not** yet have the G100 and G121 editor changes (one-job first setup step, link-first "Your website is live" screen with the QR under "More ways to share", Guests list and Results; the preview tab named after the design's opening, Settings on Home) that the START HERE guide describes since G122: publish only after a release with G100 and G121 is live and the guide re-checked against it. The editor features were not re-tried on the live site in this task. |
| Order check (`CLAIM_ORDER_VERIFICATION`) | Decided on (K34, 2026-10-15), but the records disagree on whether it is on in production (docs/10 G092, docs/18 §4); not read in G154 either (no access to the live settings). Since G154 (2026-10-17, K48) the description claims no order check: it says what happens if the editor shows "We are confirming your Etsy order" (Publish opens once the order is confirmed, usually within 24 hours), which is true in every mode. Read the mode before publishing (§11). |
| Questions & answers, RSVP questions | Tested in a local production build (Chromium, phone size). **Not tried on the live site.** |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | In the repository since 2026-10-16; described in the description and FAQ (G132) and in the START HERE guide (G131). **Not on production yet** and not tried on the live site. The 4 music tracks were made in code and nobody has listened to them yet (G126). The Google Sheets connection has not been tried with a real Google account (G128), so since G154 the description and FAQ only say that a Google Sheet can be connected (the feature), not how it behaves; whether Google sign-in is set up in production is not known (G090: "Google Sheets: coming soon" in a local build without it). Image 8 now reads "Up to 10 questions, download as Excel" (G132). |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation. |
| Description claims (G154, 2026-10-17) | Every sentence of §2 describes a feature that exists in the platform and passed G090's local production-build checks (guest site 21/21; buyer flow 6/6 with RSVP, Excel and CSV, map card, sound button, Downloads and a Spanish website). No VERIFY note is left in §2; the live-site and real-device tests that are still open are in §11 (and in `etsy_upload.json` `open_checks`). The demo line "(sample names and photos)" depends on G090 P1-02 (sample photos in the demos). |
| Edit link by email | **Off.** Sending is built (G147) but stays off until the owner sets up SMTP; the listing and the START HERE guide promise no email. Since G146 (K46) the buyer opens the editor on any device with the Etsy order number + email (`/my`, "Create your website"); the private edit link is a shortcut. Listing and guide say so since G148 (2026-10-17). |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio01@gmail.com** (address corrected 2026-10-16). |
| Response time, refund policy | Decided on 2026-10-15 (K37, K36; docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. The description says both (GOOD TO KNOW, QUESTIONS?); the START HERE guide gives the 24 hours. |
| Price, quantity | Decided on 2026-10-22 (K49, launch price; docs/35 §8b): 1,190 TL; no stock limit (999, Etsy's maximum). Renewal is still open (§4). Hosting extension (on request via Etsy before the "Online until" date, no price promised): K48, 2026-10-17. |
| Etsy shop | Open as **STUDIOBKE** (docs/20 §7). The listing text does not link the shop. |
| Design fonts and other languages | Checked on 2026-10-16 (G122) from the Google Fonts CSS of the fonts this theme loads: Allura (latin-ext, no Cyrillic; its fallback is a system script font) and Playfair Display (latin-ext and Cyrillic). The language line in GOOD TO KNOW and in the START HERE guide is written from this. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` rebuilt in G148 (2026-10-17, `python3 tools/build_customer_guides.py`, from docs/19 Ek A; G146 access with the Etsy order number + email): 9 pages, about 56 KB. Its links are the start link (in the text and on the QR), the `/my` page ("Continue on another device") and the privacy notice; the QR is made by `tools/make_qr.py` and decodes to `https://bkestudio.com/start?theme=mediterranean-lemon` (jsQR on every rendered page; module by module against a fresh encoding). It describes the editor in the repository, which is newer than production (see above). G154 (2026-10-17) rebuilt it from Ek A again (K48 order-check, extension and deletion texts, a Languages section, Share → Downloads, the start address in plain text under the QR): 10 pages, about 59 KB; `--check` with jsQR passes. |
| Listing image 9 | `09_devices.png` built on 2026-10-17 (G148, K47): "Start on your phone, continue on any device", real screens of a local production build with G146 (`/my`, Share → "Use on another device"). G146 is live only after the next deploy: publish image 9 with it. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/listing_kit.py check --theme mediterranean-lemon --prepublish` fails while any VERIFY or placeholder is left.

## 1. Title

Etsy limit: 140 characters. This title: 113 characters.

```text
Mediterranean Lemon Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Citrus
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

A white envelope with a scalloped cobalt-blue edge and a blue-and-white tile lining, tied with a lemon, leaves and a cobalt ribbon, on a sunlit white wall with lemon branches. Your guests tap the envelope, it opens, and your invitation follows: Home, Our Story, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/mediterranean-lemon
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Mediterranean Lemon design: envelope opening, Home, Our Story, Details and RSVP pages
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
• Your names, how they appear, and a monogram where the design shows one
• Date, ceremony time and time zone; month-first or day-first date style
• Venue, address, map and directions, a separate reception place, and the order of the day (up to 10 rows)
• Your story: an intro line, three captions and its music (one of 4 tracks, your own file or none)
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers (up to 12), dress code, travel & stay and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Will You Join Us?")
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
• One website per order. You choose your web address when you start (for example …/isabella-and-marco); it cannot be changed later. A custom domain (yournames.com) is not included.
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
lemon wedding
lemon invitation
italian wedding
citrus wedding
destination wedding
blue tile wedding
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
| Primary color | Yellow |
| Secondary color | Blue |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (Etsy: up to 5 files, 20 MB each; this one is about 49 KB) |
| Price | **1,190 TL** (approved by the user on 2026-10-22 (K49, launch price; docs/35 §8b); about USD 24.02 at 49.55 TRY per USD, docs/23 §1). Shop currency TRY (K38) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Summer & Destination (created in the shop on 2026-10-15, docs/20 §7) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set: 19 JPGs of 2000 × 2500 (4:5) in `package/listing/images_v4/`, in Etsy's upload order (`tools/listing_v4/README.md`, docs/20 §7.10), in the template the user approved on design 01. Image 1 (`cover_v4.html`) and images 2–8 (`slides.py`) show only real screens: the live demo's opening stills and guest pages and editor screens from a local production build. Images 9–19 (`lifestyle.py`) put real screens into this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_NN_*.png`). Image 7 carries a QR code of the live demo and image 19 the line "bkestudio.com/your-names" (kept by the decision in docs/20 §7.11). The v4 set replaced the editorial set (`images_editorial/`, not uploaded any more) on the Etsy draft on 2026-10-21 (docs/20 §7.10). The alt texts below were written on 2026-10-23 from the files: images 1, 2, 5, 7, 9, 10 and 15 of this design were read; the other twelve follow the shared template (read on design 01) and name only what every design's version shows. Etsy's per-image alt text was not entered on the draft (docs/20 §7.9; §7.10–§7.13 record no later entry).

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Mediterranean Lemon wedding website with RSVP: two phones show the white envelope with a cobalt scalloped edge and a lemon tied with blue ribbon under the names Isabella & Marco, and the open envelope with the tile-framed photo card; badges No Canva needed, RSVP guest list included, Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show 1 guests tap the scalloped envelope with its lemon tie, 2 it opens onto a blue-and-white tile liner, 3 the tile-framed card with your photo rises, We're getting married, June 12, 2027; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease, online RSVP built in: the guest's reply form on one phone, and the editor's guest list with guests coming, not coming and replies on another; badges for your own questions and the Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: three editor screens, 1 pick a page, 2 change any text, 3 publish; a No Canva needed badge; every change saves by itself |
| 5 | `05_pages.jpg` | Every page beautifully included, Mediterranean Lemon, 4 pages and the envelope: Home with the tile-framed photo card, names and countdown, Our Story with a tile-framed photo, Details with the order of the day on a scalloped card, and RSVP; countdown, schedule, map, Q&A, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included in Mediterranean Lemon: the invitation on a phone next to a checklist: envelope opening with Home, Our Story, Details and RSVP pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation PDF, easy editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the scalloped white envelope with its lemon tie on a phone next to a QR code of the live demo; scan it with your phone camera or tap the demo link in the description; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works, simple 3-step setup: 1 buy and open the START HERE guide from your Etsy purchases, 2 start with your Etsy order number and first names, 3 personalize names, date, photos, story, RSVP questions, 4 publish and share one link by text, WhatsApp, email or QR; the Add your photo step on a phone |
| 9 | `09_closeup.jpg` | Designed to be opened: a phone on a sunlit terrace among lemon branches, a blue-and-white bowl and the sea shows the open envelope with its tile liner and the card with the couple's photo; caption Your photo and your names |
| 10 | `10_tap.jpg` | One tap and it opens, for your guests: a hand holds a phone with the scalloped envelope and lemon tie under the names Isabella & Marco, a finger ready to tap, beside lemons and blue-and-white pottery; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, no app, no account: a guest's phone shows the Mediterranean Lemon home page; just one link on any phone |
| 12 | `12_devices.jpg` | Beautiful on every screen, phone, tablet and computer: the Mediterranean Lemon home page on a tablet and the invitation on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too, your private editor: the editor on a laptop with the page's fields beside a preview of the website; see every change in the preview |
| 14 | `14_together.jpg` | Plan it together, open your editor on any device: the editor's guest list on a phone and on a laptop |
| 15 | `15_print.jpg` | Print it or send it, printable invitation included: the printed card with lemon branches, a cobalt scalloped edge and a tile border next to a phone with the sealed envelope, on white plaster with lemons; 5×7 in or A5 PDF in your design |
| 16 | `16_need.jpg` | Everything your guests need, on four phones: the invitation, the venue with its photo and map, questions and answers, and the thank-you after a sent RSVP |
| 17 | `17_day.jpg` | The order of the day, on the wedding day: the Details page's schedule on a phone, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Every reply in one place, guest list included: the editor's list of replies on a phone, each marked coming or not coming; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: the editor's Share screen on a phone with the website link and a Copy link button; caption Your own address: bkestudio.com/your-names |

## 6. Video

`package/listing/video_v4_4x5.mp4`: the 4:5 hover video of the v4 set, on the Etsy draft since 2026-10-22 (docs/20 §7.10). `tools/listing_v4/stageE.sh`: `rec.mjs` records the live demo `https://bkestudio.com/start/demo/mediterranean-lemon` in slow motion (page time 50–70× slower, 432 × 540 at 2.5× = 1080 × 1350); `full45.py` turns the frames into a 60 fps vertical H.264 video, about 10.5 seconds for 01–21, whose last 0.4 seconds dissolve into the first frame so Etsy's loop has no jump. It starts on the scalloped white envelope and shows the lemon tie slipping loose, the flap lifting onto the tile liner, the card with the portrait rising and the home page (sample names and photos). It is made from still frames, so it has no sound track. Length and size were not re-measured on 2026-10-23. The square `video.mp4` of the editorial set stays in the folder and is no longer on the draft. [VERIFY: Etsy video rules in the listing editor]

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
the design chooser `https://bkestudio.com/start` (docs/19 §4.4). The START HERE PDF carries this design's own link.

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

## 10. What this text fixes compared with the earlier 01 and 03 listings

- "The design's headings stay as they are" was wrong since G068: headings, labels and buttons can be rewritten; artwork, colors, fonts, layout and the envelope animation stay.
- `[HOSTING PERIOD]` → online until 12 months after the wedding date (K25), with the editor's "Online until" date.
- New, so buyers do not have to ask: no account; save the edit link (not emailed yet); the order is confirmed before publishing; 3 name/date changes after publishing with free fixes; optional guest password; thank-you page after the wedding; not listed on Google; how many guests (no limit, up to 10 per reply); what guests see.
- The START HERE guide is no longer described as "every step in pictures".
- Shop name and support email from K33; the FAQ answers the lost-link and language questions in full.

## 11. Before you publish this listing

- [x] Start link and demo of this design answer on the live site (2026-10-16, `200`, design named)
- [ ] A release with the G100 and G121 editor live; START HERE re-checked against it (`python3 tools/build_customer_guides.py --check`)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Music, map and directions, the reply form and Excel download (G126–G128) live and tried on the live site; the 4 tracks listened to and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual or etsy)
- [ ] G146 live (order number + email open the editor on any device: `/my`, "Create your website"); START HERE (G148) re-checked against it
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Response time and refund policy decided (K37, K36) and in the description; the guide gives the 24 hours
- [x] Price (1,190 TL, K49 2026-10-22) and quantity (999) decided and filled in
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages (G144) and Share → Downloads (G139) tried on the live site
- [ ] Printable invitation: decor no longer over the text (G090 P1-01, G155) and one printed copy checked
- [x] Images and video produced (G905; rebuilt 2026-10-15 with the current editor; images rebuilt again in G124 on 2026-10-16, see §5)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] Shop-wide Etsy messages (docs/19 §4.4) entered in Shop Manager
- [ ] `python3 tools/listing_kit.py check --theme mediterranean-lemon --prepublish` passes (the tool reads this file)

<!-- listing-kit:media -->
