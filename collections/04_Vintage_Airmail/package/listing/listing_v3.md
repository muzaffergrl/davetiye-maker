# Etsy listing v3: Vintage Airmail Love Letter Wedding Website (design 04)

Internal listing kit for the seller (G091, 2026-10-15). Not published on Etsy. Theme `vintage-airmail-love-letter`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32): every sentence answers a buyer question from docs/19 §3 and promises only what
the platform does today. Product language: English (US spelling). This design has no earlier `listing.md`: this is its first listing text. `tools/listing_kit.py` reads `listing.md`, so copy or switch it when the kit is built (G904).

## 0. Status before publishing

| Item | Status on 2026-10-15 |
|---|---|
| Start link `https://davetiye-platform-five.vercel.app/start?theme=vintage-airmail-love-letter` | On sale in the sales configuration since G085 (G086); **not checked on the live site** in this task (G079 pending). |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/vintage-airmail-love-letter` (image 8) | Demo page exists for every theme (`/start/demo/<theme>`); not checked live in this task. |
| Current platform release live (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | **Not yet.** The last checked live release is G078 (`2dc812b`, editor in the old look). This text and the START HERE guide describe the current editor; publish only after G079 is live and checked. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | Stated by the integrator on 2026-10-15; not checked in this task. The listing says "We confirm each order in our shop before a website can go live". [VERIFY: manual order check on in production] |
| Questions & answers, RSVP questions | Tested in a local production build (Chromium, phone size). **Not tried on the live site.** |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation. |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing and guide say so. |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale (or keep a permanent redirect from this one). |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, price, refund policy, hosting extension, Etsy shop URL | Not decided: placeholders. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` rewritten in G091 (7 pages, from docs/19 Ek A). Start link and privacy link are clickable; the QR code decodes to `https://davetiye-platform-five.vercel.app/start?theme=vintage-airmail-love-letter` (jsqr, rendered PDF page). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/listing_kit.py check --theme vintage-airmail-love-letter --prepublish` fails while any VERIFY or placeholder is left.

## 1. Title

Etsy limit: 140 characters. This title: 113 characters.

```text
Vintage Airmail Love Letter Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Travel
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

A red-and-navy striped airmail envelope on map-lined parchment, sealed with a burgundy wax seal and lavender, with a cream letter card inside, stamps, postmarks, dried flowers and twine. Your guests tap the envelope, it opens, and your invitation follows: Home, Our Story, Details and RSVP.

WHAT YOU GET
• Your wedding website in the Vintage Airmail Love Letter design: envelope opening, Home, Our Story, Details and RSVP pages
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
• One website per order. You choose your web address when you start (for example …/margot-and-henry); it cannot be changed later. A custom domain (yournames.com) is not included.
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
vintage wedding
airmail wedding
love letter invite
travel wedding
destination wedding
vintage invitation
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
| Primary color | Beige |
| Secondary color | Red |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (Etsy: up to 5 files, 20 MB each; this one is about 20 KB) |
| Price | [PRICE] |
| Quantity | [QUANTITY] |
| Shop section | Classic & Vintage (created in the shop on 2026-10-15, docs/20 §7) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not produced yet** for this design (listing kit task G904: `tools/listing_kit.py` knows only 01 and 03 today). Target set and alt texts, the same as designs 01 and 03 after their rebuild:

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Vintage Airmail Love Letter wedding website with RSVP on two phone screens: a striped airmail envelope with a burgundy wax seal, and the home page with the couple's photo. Labels: no Canva needed, RSVP built in, live demo |
| 2 | `02_guest_pages.png` | The five pages guests see: envelope, home, our story, details and RSVP |
| 3 | `03_whats_included.png` | What is included: website, online editor, RSVP with your own questions, add to calendar, questions and answers, QR code, START HERE guide |
| 4 | `04_how_it_works.png` | Three steps: start with your Etsy order number, personalize in the editor, publish and share |
| 5 | `05_editor.png` | The online editor on a phone: the six pages to edit, cropping a photo, previewing the website |
| 6 | `06_rsvp.png` | RSVP: the guest reply form with a meal question, the replies in the editor with a Download list button (CSV) |
| 7 | `07_details.png` | Details page: order of the day with add to calendar buttons, the venue, questions and answers |
| 8 | `08_live_demo.png` | QR code that opens the live demo of the Vintage Airmail Love Letter design. [VERIFY: Etsy policy on QR codes and links in listing photos] |

Suggested extra images (answer the most common questions before purchase; layout and type only, K21; real screens):
- 9 `09_what_you_change.png`: two columns "You change" (names, date, venue, schedule, story, 5 photos, Q&A, RSVP questions, headings and labels) / "Stays as designed" (artwork, colors, fonts, layout, envelope animation).
- 10 `10_good_to_know.png`: "No Canva · no app · no account", "Online until 12 months after your wedding", "Save your private edit link", "Names and date: 3 changes after publishing, small fixes free", "Optional guest password", "Thank-you page after the wedding".

## 6. Video

**Not produced yet** (G904). Same recipe as 01 and 03: the envelope opening recorded from the real website, 1080 × 1080, H.264, silent, 5–15 s. [VERIFY: Etsy video rules in the listing editor]

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

## 10. What this text fixes compared with the earlier 01 and 03 listings

- "The design's headings stay as they are" was wrong since G068: headings, labels and buttons can be rewritten; artwork, colors, fonts, layout and the envelope animation stay.
- `[HOSTING PERIOD]` → online until 12 months after the wedding date (K25), with the editor's "Online until" date.
- New, so buyers do not have to ask: no account; save the edit link (not emailed yet); the order is confirmed before publishing; 3 name/date changes after publishing with free fixes; optional guest password; thank-you page after the wedding; not listed on Google; how many guests (no limit, up to 10 per reply); what guests see.
- The START HERE guide is no longer described as "every step in pictures".
- Shop name and support email from K33; the FAQ answers the lost-link and language questions in full.

## 11. Before you publish this listing

- [ ] Current platform release (G079) live and checked; start link and demo of this design open on the live site
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf and the QR of image 8 scanned with a phone camera
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf, its QR and image 8 rebuilt
- [ ] Response time, price, refund policy and hosting extension decided and filled in (guide + listing + docs/19 templates)
- [ ] Images and video produced (G904)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] Shop-wide Etsy messages (docs/19 §4.4) entered in Shop Manager
- [ ] `python3 tools/listing_kit.py check --theme vintage-airmail-love-letter --prepublish` passes (the tool reads `listing.md`: switch it to this file first)

<!-- listing-kit:media -->
