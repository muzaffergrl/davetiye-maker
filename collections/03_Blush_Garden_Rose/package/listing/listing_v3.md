# Etsy listing v3: Blush Garden Rose Wedding Website (design 03)

Internal listing kit for the seller (G091, 2026-10-15). Not published on Etsy. Theme `blush-garden-rose`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32): every sentence answers a buyer question from docs/19 §3 and promises only what
the platform does today. Product language: English (US spelling). It replaces `listing.md` after review; `listing.md` stays as the earlier record, and `tools/listing_kit.py` reads this file (since 2026-10-15).

## 0. Status before publishing

| Item | Status on 2026-10-16 |
|---|---|
| Start link `https://davetiye-platform-five.vercel.app/start?theme=blush-garden-rose` | **Live**: answered `200` on 2026-10-16 and the page names the design ("Design: Blush Garden Rose", with the "Create my website" form). Checked through the Vercel connector on production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW` (G122); a direct `curl` from this environment is refused by its proxy. Not opened on a phone. |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/blush-garden-rose` (in the description under TRY THE LIVE DEMO, and named in image 8) | **Live**: answered `200` on 2026-10-16; the page is this design's opening (`data-theme="blush-garden-rose"`, sample couple Clara & Julian). Same check, not opened on a phone. |
| Current platform release live (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | **Live** since G079 (2026-10-15, docs/10 §2). Production on 2026-10-16 is `b952bc8` (`dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW`). It does **not** yet have the G100 and G121 editor changes (one-job first setup step, link-first "Your website is live" screen with the QR under "More ways to share", Guests list and Results; the preview tab named after the design's opening, Settings on Home) that the START HERE guide describes since G122: publish only after a release with G100 and G121 is live and the guide re-checked against it. The editor features were not re-tried on the live site in this task. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | Decided on (K34, 2026-10-15), but the records disagree: docs/10 (G092) says the variable is not set in production, docs/18 §4 says it was added on 2026-10-15 and reported off again on 2026-10-16. Not read in this task. The listing keeps "We confirm each order in our shop before a website can go live" with [VERIFY: manual order check on in production]: read the value in Vercel, or delete the sentence before publishing. |
| Questions & answers, RSVP questions | Tested in a local production build (Chromium, phone size). **Not tried on the live site.** |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation. |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing and guide say so. |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale (or keep a permanent redirect from this one). |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (K37, K36; docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. The description says both (GOOD TO KNOW, QUESTIONS?); the START HERE guide gives the 24 hours. |
| Price, quantity | Decided on 2026-10-16: 1,460 TL; no stock limit (999, Etsy's maximum). Hosting extension and renewal are still open (§4). |
| Etsy shop | Open as **STUDIOBKE** (docs/20 §7). The listing text does not link the shop. |
| Design fonts and other languages | Checked on 2026-10-16 (G122) from the Google Fonts CSS of the fonts this theme loads: Cormorant Garamond, Great Vibes and Lora (all latin-ext and Cyrillic). The language line in GOOD TO KNOW and in the START HERE guide is written from this. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` rebuilt in G122 (2026-10-16, `python3 tools/build_customer_guides.py`, from docs/19 Ek A, G100 + G121 editor): 7 pages, about 49 KB. Its only links are the start link (in the text and on the QR) and the privacy notice; the QR is made by `tools/make_qr.py` and decodes to `https://davetiye-platform-five.vercel.app/start?theme=blush-garden-rose` (jsQR on every rendered page; module by module against a fresh encoding). It describes the editor in the repository, which is newer than production (see above). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/listing_kit.py check --theme blush-garden-rose --prepublish` fails while any VERIFY or placeholder is left.

## 1. Title

Etsy limit: 140 characters. This title: 108 characters.

```text
Blush Garden Rose Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Pink Floral
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Blush peonies, garden roses and a soft pink envelope tied with a silk bow. Your guests tap the envelope, it opens, and your invitation follows: Home, Our Story, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://davetiye-platform-five.vercel.app/start/demo/blush-garden-rose
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Blush Garden Rose design: envelope opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 3 questions of your own (for example a meal choice) [VERIFY: try on the live site]; download the list as a spreadsheet (CSV)
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, map, dress code, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
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
• Venue, address, map link and the order of the day (up to 10 rows)
• Your story: an intro line and three captions
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers (up to 12), dress code, travel & stay and registry links
• RSVP deadline and up to 3 questions for your guests
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Will You Join Us?")
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
• One website per order. You choose your web address when you start (for example …/clara-and-julian); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters and Cyrillic use the design's fonts, other alphabets a plain standard font.
• No music. Colors and fonts do not change.
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
blush pink wedding
garden rose wedding
peony wedding
pink floral wedding
bow invitation
invitation website
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
| Primary color | Pink |
| Secondary color | Cream (or Beige) |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (Etsy: up to 5 files, 20 MB each; this one is about 49 KB) |
| Price | **1,460 TL** (approved by the user on 2026-10-16; about USD 29.48 at 49.53 TRY per USD, docs/23 §1). Shop currency TRY (K38) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Floral & Garden (created in the shop on 2026-10-15, docs/20 §7) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The 8 images in `images_editorial/` are the editorial set of 2026-10-16 (`python3 tools/listing_editorial.py --theme blush-garden-rose`, rules in `docs/21_ILAN_GORSELLERI.md`). Every phone shows a real screen of this design, captured from a local production build of the platform (sample names and photos; the opening stills at 3× density by `tools/listing_editorial/capture_opening.ts`). Images 1, 2, 4 and 8 place those screens into this design's GPT mockup scenes (`assets/gpt/mockups/`); images 3, 5, 6 and 7 lay them out on paper. No image carries a QR code or a web address (Etsy Off-Platform policy, docs/15 §4.1). The earlier G059 kit stays in `images/` for comparison and is not uploaded. Alt texts below describe these files.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Blush Garden Rose wedding website with online RSVP on a phone held in a hand, among pink peonies and a satin ribbon: the opening page with a blush envelope tied with a pink satin bow and the names Clara & Julian |
| 2 | `02_opening.png` | It opens like a real invitation: three phones show the envelope closed, the envelope opening, and the invitation card rising out of it |
| 3 | `03_pages.png` | Every page guests need, on five phone screens: home with a countdown, our story, the invitation card, the order of the day and the RSVP page |
| 4 | `04_edit.png` | Make every word yours: the online editor on a phone held in two hands, next to a list of what you change (names, date and venue; photos and story; schedule and questions and answers; every heading and label). The artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Every reply in one place: the guest's RSVP form with a meal choice, and the couple's guest list in the editor with each reply and a Download list button |
| 6 | `06_details.png` | Everything guests ask: the order of the day with add-to-calendar buttons, the venue with a photo, and questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize your names, date and a photo, then publish and share one link or print the QR code |
| 8 | `08_included.png` | What is included: the envelope opening and four pages, your own online editor, online RSVP and guest list, QR code and START HERE guide; online until 12 months after your wedding, live demo link in the description |

Suggested extra images (answer the most common questions before purchase; layout and type only, K21; real screens):
- 9 `09_what_you_change.png`: two columns "You change" (names, date, venue, schedule, story, 5 photos, Q&A, RSVP questions, headings and labels) / "Stays as designed" (artwork, colors, fonts, layout, envelope animation).
- 10 `10_good_to_know.png`: "No Canva · no app · no account", "Online until 12 months after your wedding", "Save your private edit link", "Names and date: 3 changes after publishing, small fixes free", "Optional guest password", "Thank-you page after the wedding".

## 6. Video

`package/listing/video.mp4`: the envelope opening, recorded from the real website (sample names). Silent, square, under 15 seconds; it starts on the closed envelope and its last half second dissolves back into it, so Etsy's loop has no black flash. Etsy's video rules come from web-search excerpts of Etsy's help pages (2026-10-14: 5–15 s, up to 100 MB, at least 500 px, no sound). [VERIFY: in the listing editor]

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
On your RSVP page, with no app or account. You see every reply in your editor and can download them as a spreadsheet (CSV).

**How many guests can I invite?**
As many as you like. One reply can include up to 10 people.

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
the design chooser `https://davetiye-platform-five.vercel.app/start` (docs/19 §4.4). The START HERE PDF carries this design's own link.

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

## 10. What changed from `listing.md` (open questions it left)

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
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Response time and refund policy decided (K37, K36) and in the description; the guide gives the 24 hours
- [x] Price (1,460 TL) and quantity (999) decided and filled in (2026-10-16)
- [ ] Hosting extension and renewal decided
- [x] Images rebuilt with the current editor (see §5); video present (2026-10-15)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] Shop-wide Etsy messages (docs/19 §4.4) entered in Shop Manager
- [ ] `python3 tools/listing_kit.py check --theme blush-garden-rose --prepublish` passes (the tool reads this file)

<!-- listing-kit:media -->
