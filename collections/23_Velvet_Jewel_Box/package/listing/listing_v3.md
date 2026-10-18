# Etsy listing v3: Velvet Jewel Box Wedding Website (design 23)

Internal listing kit for the seller (2026-10-17). **Not published on Etsy and not for sale:** sales status `coming` in `platform/lib/marketing/config.ts` (K41: not published). Theme `velvet-jewel-box`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure as the design 14 listing (`collections/14_Ivory_Lace_Pearl/package/listing/listing_v3.md`): every sentence answers a buyer
question from docs/19 §3 and promises only what the shared platform does today. Product language: English (US spelling). This design has no
earlier `listing.md`: this is its first listing text. Design facts come from the theme brief for `platform/themes/velvet-jewel-box/` (being built in parallel; README, theme.json and index.html were not read for this text) and the sales-site copy in `platform/lib/marketing/designs.ts` ("Your guests tap the box."). The title, the description, the tags and the alt texts never name any other opening object: this design opens from a jewelry box (`openingObject` = "box"), and `tools/etsy_upload.py --check` fails if the word "envelope" comes back there.

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sales status | **Not for sale.** `coming` in `platform/lib/marketing/config.ts` (K41: not published). No Etsy listing, no Etsy URL. |
| Start link `https://davetiye-platform-five.vercel.app/start?theme=velvet-jewel-box` | **Not live.** The design is not deployed and not open on `/start` in production. Not checked on the live site, not opened on a phone. [VERIFY: answers `200` and names "Design: Velvet Jewel Box" after deploy] |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/velvet-jewel-box` (in the description under TRY THE LIVE DEMO, and named in planned image 8) | **Not live.** The demo route exists only after the theme is deployed. [VERIFY: answers `200` with `data-theme="velvet-jewel-box"` and the sample couple Isabelle & Julian after deploy] |
| Theme files (`platform/themes/velvet-jewel-box/`) | Being built in parallel. This text follows the theme brief (opening, pages, palette, fonts, default music); it was not read against the finished theme. [VERIFY: description, §5 alt texts and §10 re-read against the theme README, theme.json and index.html] |
| Current platform release (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | Live for the designs that are open (since G079, 2026-10-15). Shared by every theme, so this design gets the same editor once deployed. Not tried with this theme. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | Decided on (K34, 2026-10-15); the records disagree on whether it is on in production (see the design 14 listing §0). Not read in this task. The listing keeps the order sentence with [VERIFY: manual order check on in production]. |
| Questions & answers, RSVP questions | Platform features, the same for every design; tested in a local production build (Chromium, phone size). **Not tried on the live site, not tried with this theme.** |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | Shared platform features, described as in the design 14 listing, with the same VERIFY notes. This design's default track is "Music Box" (one of the 4 tracks). The 4 tracks were made in code and nobody has listened to them yet (G126). The Google Sheets connection has not been tried with a real Google account (G128). |
| Our Story 3D carousel | Design-specific (rotating photo carousel; swipe, drag, arrow buttons, keyboard; a simple slider with reduced motion). **Not tried** on the live site or on any phone. [VERIFY: carousel on a real phone, and with reduced motion on] |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** No phone check of any kind has been done for this design. |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing says so. |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale (or keep a permanent redirect from this one). |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com** (shop-wide). |
| Response time, refund policy | Shop-wide, decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Price open: [PRICE].** Not decided for this design. Quantity: 999 if the shop-wide rule of 2026-10-16 (no stock limit) applies. Hosting extension, renewal and the Etsy shop URL are still open. |
| Design fonts and other languages | From the theme brief: Bodoni Moda and Pinyon Script (Google Fonts; latin-ext, no Cyrillic). Not re-checked from the Google Fonts CSS in this task. [VERIFY: fonts the theme really loads, and their subsets] The language line in GOOD TO KNOW is written from this. |
| Sample photos and artwork | **Not made yet.** Sample photos of the fictional couple (Isabelle & Julian, fictional venue "Halvern House", New York) and the velvet box artwork come from GPT (K21). |
| START HERE guide | **Built** (G175, 2026-10-17): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 23`, from docs/19 Ek A; QR only from `tools/make_qr.py`; `--check` passes). Its start link answers only after this design is deployed; rebuild it if Ek A or the domain changes. |
| Listing images and video | **Not produced yet.** No images, no video, no mockups (`assets/gpt/mockups/` empty). §5 and §6 list the planned set. Nothing uploaded to Etsy. |
| Etsy rules (digital items, AI disclosure, title, tags, images, video) | **Not re-checked on Etsy's official pages in this task** (2026-10-17). Re-check them from the links in `00_ANA_DEVIR.md` §34 before publishing and write the date here. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (guide, images, video) and every open VERIFY keep `ready_to_publish` false. This design also stays unpublished until its sales status leaves `coming` (K41).

## 1. Title

Etsy limit: 140 characters. This title: 118 characters.

```text
Velvet Jewel Box Wedding Website with RSVP, Ring Box Opening Digital Invitation, Online Editor, Plum Champagne Elegant
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a velvet jewelry box, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

A closed aubergine velvet ring box tied with a champagne satin ribbon. Your guests tap the jewelry box: the ribbon slides away, the lid lifts on its hinge to a champagne satin lining, and your invitation card rises out of the box and opens into your pages: Home, Our Story, Details and RSVP.

TRY THE LIVE DEMO
See the jewelry box open on your own phone before you buy (sample names and photos):
https://davetiye-platform-five.vercel.app/start/demo/velvet-jewel-box
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Velvet Jewel Box design: jewelry box opening, Home, Our Story, Details and RSVP pages
• Your names in a flowing script with a champagne-gold foil shimmer on aubergine velvet, a countdown and add-to-calendar buttons on your Home page
• Our Story as a turning photo carousel, like a jewelry display case: three photos with captions that guests swipe, drag or move with the arrow buttons [VERIFY: carousel on a real phone]
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze; add a separate reception place if you need one [VERIFY: try on the live site]
• Soft background music on your Our Story page (this design starts with "Music Box", one of 4 tracks made for your website, or use your own MP3 or M4A file) and gentle sound effects as the invitation opens. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
• A QR code of your website (PNG or SVG) for printed cards and signs
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
What stays as designed: the artwork, colors, fonts, page layout, the jewelry box opening animation and the satin page transitions.

WHAT YOUR GUESTS SEE
Your link opens a closed velvet jewelry box. One tap opens it into your pages, and each page change glides in like satin drawn across the screen. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/isabelle-and-julian); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters use the design's fonts, while Cyrillic and other alphabets show in a plain standard font in some or all places.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• If a guest's phone is set to reduce motion, the box opens with gentler movement and Our Story becomes a simple photo slider. [VERIFY: reduced-motion behavior of the opening in the finished theme]
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters (counted below). Keyword choices are hypotheses (no search-volume data). No other company's brand name. The common opening-object tag of the 01–05 listings is replaced by "jewel box invitation" and "ring box invitation": this design opens from a box.

```text
wedding website
rsvp website
digital invitation
animated invitation
online rsvp
wedding rsvp
wedding invitation
velvet wedding
plum wedding
aubergine wedding
jewel box invitation
ring box invitation
champagne wedding
```

Character counts: 15, 12, 18, 19, 11, 12, 18, 14, 12, 17, 20, 19, 17.

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
| Primary color | Purple |
| Secondary color | Gold (or Beige, if Gold reads too yellow next to the champagne #E8D3B0) |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** for this design (Etsy: up to 5 files, 20 MB each) |
| Price | **[PRICE]**: not decided (sales status `coming`, K41). Shop currency TRY (K38) |
| Quantity | 999, Etsy's maximum, if the shop-wide no-stock-limit rule (2026-10-16) applies [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Not chosen: the section for designs after 05 (an existing one, docs/20 §3, or a new one) is the user's choice |
| Renewal | [AUTO RENEW: yes/no] |

Palette for reference (theme brief): aubergine #2A1328, plum #4A2142, champagne #E8D3B0, rose gold #C99A86, ivory #FBF3E8.

## 5. Images and alt text

**Not produced yet.** No listing image exists for this design. The table below is the planned editorial set: the same 8 images as design 14 (`python3 tools/listing_editorial.py --theme velvet-jewel-box` once the theme is built, rules in `docs/21_ILAN_GORSELLERI.md`). Every phone must show a real screen of this design (sample couple Isabelle & Julian, GPT sample photos); images 1, 2, 4 and 8 need this design's GPT mockup scenes (`assets/gpt/mockups/`, not made yet), image 7 the shop-wide linen scene (`brand/trust/t1_three_steps.png`). No image may carry a QR code or a web address (Etsy Off-Platform policy, docs/15 §4.1). Images 2, 3 and 8 name this design's opening object (the jewelry box); no image names any other one (`tools/tests/test_listing_editorial.py`). The alt texts are **drafts**: they describe the planned images and must be read against the real files before publishing. [VERIFY: alt texts read against the produced images]

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Velvet Jewel Box wedding website with online RSVP on a phone held in a hand, among champagne satin and plum velvet: the opening page with a closed aubergine velvet jewelry box tied with a champagne satin ribbon and the names Isabelle & Julian |
| 2 | `02_opening.png` | It opens like a real jewelry box: three phones show the velvet box closed, its ribbon sliding away and its lid lifting to a champagne satin lining, and the invitation card rising out of the box |
| 3 | `03_pages.png` | Every page guests need, on five phone screens: home with your names in champagne-gold script on velvet and a countdown, the our story photo carousel, the invitation card, the order of the day and the RSVP page |
| 4 | `04_edit.png` | Make every word yours: the online editor on a phone held in two hands, next to a list of what you change (names, date and venue; photos and story; schedule and questions and answers; every heading and label). The artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Every reply in one place: the guest's RSVP reply card on velvet with a meal choice, and the couple's guest list in the editor with each reply and a Download Excel button |
| 6 | `06_details.png` | Everything guests ask: the order of the day with add-to-calendar buttons, the venue with a photo, and questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize your names, date and a photo, then publish and share one link or print the QR code |
| 8 | `08_included.png` | What is included: the velvet jewelry box opening and four pages, your own online editor, online RSVP and guest list, QR code and START HERE guide; online until 12 months after your wedding, live demo link in the description |

Suggested extra images (answer the most common questions before purchase; layout and type only, K21; real screens):
- 9 `09_what_you_change.png`: two columns "You change" (names, date, venue, schedule, story, 5 photos, Q&A, RSVP questions, headings and labels) / "Stays as designed" (artwork, colors, fonts, layout, jewelry box opening animation).
- 10 `10_good_to_know.png`: "No Canva · no app · no account", "Online until 12 months after your wedding", "Save your private edit link", "Names and date: 3 changes after publishing, small fixes free", "Optional guest password", "Thank-you page after the wedding".

## 6. Video

**Not produced yet.** Planned: `package/listing/video.mp4` (`python3 tools/listing_editorial.py --theme velvet-jewel-box --video` once the theme is built): the jewelry box opening, recorded from the real website (sample names): the closed velvet box with its ribbon, the ribbon sliding away, the lid lifting on its hinge, the light sweep across the champagne satin and the invitation card rising out of the box into the home page. Silent, square (1080 × 1080, H.264), 5–15 seconds; it should start on the closed box and end by dissolving back into it, so Etsy's loop has no black flash (compare first and last frame once made). Etsy's video rules come from web-search excerpts of Etsy's help pages (2026-10-14: 5–15 s, up to 100 MB, at least 500 px, no sound). [VERIFY: Etsy video rules in the listing editor]

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

**How do guests look through our story photos?**
They swipe or drag the photo carousel, or tap the arrow buttons; on a computer the arrow keys work too. If their phone is set to reduce motion, it shows as a simple photo slider. [VERIFY: carousel on a real phone]

**Is there music?**
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website (this design starts with "Music Box") or your own MP3 or M4A file, and gentle sound effects as the invitation opens. You can turn music or sound effects off, and guests can mute the sound with one tap.

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
Shop Manager (docs/20 §7.1) and need no change for this design. Until this design is deployed and open on `/start`, a buyer could not find it in the chooser: one more reason it stays unpublished.

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

## 10. What differs from the 01–05 listings (and from design 14)

- Opening object: this design opens from a velvet jewelry box ("box" in `openingObject`). The first line, the guests' first view, the opening bullet, what stays as designed, the tags and the alt texts of images 1, 2, 3 and 8 say so.
- Design-specific lines added to the description and FAQ: the champagne-gold foil script on the Home page, the Our Story 3D carousel (with its reduced-motion slider) and the satin page transitions; each carries a VERIFY until tried on a real phone.
- Default music named ("Music Box"); the rest of the music text is the shared platform text.
- Language line from the theme brief's fonts (Bodoni Moda, Pinyon Script), not yet re-read from the theme (§0).
- Status table dated 2026-10-17: design not deployed and not for sale (K41), start link and demo not live, price open, no guide, images, video, mockups or sample photos yet.

## 11. Before you publish this listing

- [ ] Sales status leaves `coming` (K41 lifted by the user) and the design is open on `/start` in production
- [ ] Start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [ ] Theme finished; description, alt texts and §10 re-read against `platform/themes/velvet-jewel-box/`
- [ ] Sample photos and artwork made (GPT) and placed in the theme
- [ ] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR)
- [ ] Questions & answers and RSVP questions tried on the live site with this design
- [ ] Our Story carousel tried on a real phone, and with reduced motion on
- [ ] Music, map and directions, the reply form and Excel download live and tried on the live site; the 4 tracks (including "Music Box") listened to and approved; Google Sheets connected with a real Google account
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [ ] Price ([PRICE]) and quantity decided and filled in
- [ ] Hosting extension and renewal decided
- [ ] Images (editorial set, with the opening object in images 2, 3 and 8) and video produced; alt texts read against them
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked on the official pages (`00_ANA_DEVIR.md` §34) and in the listing editor (title, tags, images, video, AI disclosure, "Designed by"), with the date written in §0
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
