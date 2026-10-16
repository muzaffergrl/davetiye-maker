# Etsy listing v3: Tuscan Vineyard Wedding Website (design 10)

Internal listing kit for the seller (G123, 2026-10-16). Not published on Etsy. Theme `tuscan-vineyard`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure as the 01–05 listings: every sentence answers a buyer
question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling). This design has no
earlier `listing.md`: this is its first listing text. Design facts come from `platform/themes/tuscan-vineyard/` (README, theme.json, index.html)
and `platform/lib/marketing/designs.ts` (sales-site copy written against the G410 theme).

## 0. Status before publishing

| Item | Status on 2026-10-16 |
|---|---|
| Start link `https://davetiye-platform-five.vercel.app/start?theme=tuscan-vineyard` | **Live**: answered `200` on 2026-10-16 and the page names the design ("Design: Tuscan Vineyard"). Checked through the Vercel connector on production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW` (docs/10); a direct `curl` from this environment is refused by its proxy. Not opened on a phone. |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/tuscan-vineyard` (in the description under TRY THE LIVE DEMO, and named in image 8) | **Live**: answered `200` on 2026-10-16; the page is this design's opening (`data-theme="tuscan-vineyard"`, sample couple Giulia & Matteo). Same check, not opened on a phone. |
| Current platform release live (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | **Live** since G079 (2026-10-15). This design is open on `/start` and on the sales site since G094 (`platform/lib/marketing/config.ts`); the current production release `b952bc8` (2026-10-16, docs/10 §2) serves it. The editor features were not re-tried on the live site in this task. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | Decided on (K34, 2026-10-15), but the records disagree: docs/10 (G092) says the variable is not set in production, docs/18 §4 says it was added on 2026-10-15 and reported off again on 2026-10-16. Not read in this task. The listing keeps "We confirm each order in our shop before a website can go live" with [VERIFY: manual order check on in production]: read the value in Vercel, or delete the sentence before publishing. |
| Questions & answers, RSVP questions | Platform features, the same for every design; tested in a local production build (Chromium, phone size). **Not tried on the live site.** |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks so far are Chromium mobile emulation (theme README, "Bilinen sınırlar"). |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing says so. |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale (or keep a permanent redirect from this one). |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | Decided on 2026-10-16: 1,460 TL; no stock limit (999, Etsy's maximum). Hosting extension, renewal and the Etsy shop URL are still open. |
| Design fonts and other languages | Checked on 2026-10-16 from the Google Fonts CSS of the fonts this theme loads: Italianno and Marcellus (latin-ext, no Cyrillic). The language line in GOOD TO KNOW is written from this. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` built in G122 (2026-10-16, `python3 tools/build_customer_guides.py`, from docs/19 Ek A): 7 pages. Its only links are the start link (in the text and on the QR) and the privacy notice; the QR is made by `tools/make_qr.py` and decodes to `https://davetiye-platform-five.vercel.app/start?theme=tuscan-vineyard` (jsQR on every rendered page). It describes the editor in the repository, which is newer than production until the next deploy. |
| Listing images and video | **Not produced** (§5, §6). The GPT mockup scenes of this design exist in `assets/gpt/mockups/`. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (guide, images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 107 characters.

```text
Tuscan Vineyard Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Wine Country
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

A kraft envelope with a wine-red vine border, wrapped in jute twine with a cork and two olive leaves, under a Tuscan sunset with grape clusters, vine leaves and olive branches. Your guests tap the envelope, it opens, and your invitation follows: Home, Our Story, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://davetiye-platform-five.vercel.app/start/demo/tuscan-vineyard
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Tuscan Vineyard design: envelope opening, Home, Our Story, Details and RSVP pages
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
Your link opens a closed envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/giulia-and-matteo); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters use the design's fonts, while Cyrillic and other alphabets show in a plain standard font in some or all places.
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
tuscan wedding
vineyard wedding
italian wedding
winery wedding
wine country
destination wedding
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
| Style / theme | Classic, Rustic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** for this design (Etsy: up to 5 files, 20 MB each) |
| Price | **1,460 TL** (approved by the user on 2026-10-16; about USD 29.48 at 49.53 TRY per USD, docs/23 §1). Shop currency TRY (K38) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Summer & Destination (an existing section, docs/20 §3, which lists 01–05 only; the section for designs 06–20, or a new one, is the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not produced yet.** The 8 images will be the editorial set (`tools/listing_editorial.py`, rules in `docs/21_ILAN_GORSELLERI.md`) in `images_editorial/`, in the order and with the file names below, the same as 01–05. `tools/listing_editorial.py` and `tools/listing_kit.py` know only designs 01–05 today, so this design has to be added there first. Its GPT mockup scenes are ready in `assets/gpt/mockups/` (`cover_hand_v2.png`, `three_phones.png`, `hand_phone_edit.png`, `flatlay_phone.png` for images 1, 2, 4 and 8). No image may carry a QR code or a web address (Etsy Off-Platform policy, docs/15 §4.1). The alt texts below are written for the planned images; read each one again against the finished file.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Tuscan Vineyard wedding website with online RSVP on a phone held in a hand, among grape clusters, vine leaves, olive branches and a cork on an oak table: the opening page with a kraft envelope tied with twine and a cork and the names Giulia & Matteo [VERIFY: matches the finished cover] |
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

**Not produced yet.** Same recipe as 01–05: the envelope opening recorded from the real website (sample names), 1080 × 1080, H.264, silent, 5–15 s, starting on the closed envelope so Etsy's loop has no black flash. `tools/listing_kit.py video` knows 01–05 only. [VERIFY: Etsy video rules in the listing editor]

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

## 10. What differs from the 01–05 listings

- Same envelope wording as 01–05, except that the guests' first view says "a closed envelope" (01–05: "a sealed envelope"), which fits every closure of 06–20 (ribbon, twine, bundle, twig, shell or seal).
- Language line from this theme's real fonts (§0) instead of the common sentence; the FAQ answer stays the same.
- Status table dated 2026-10-16: the K29 editor is live, the start link and the demo answered on the live site, the order check is recorded as off, and the guide, images and video do not exist yet.

## 11. Before you publish this listing

- [x] Start link and demo of this design answer on the live site (2026-10-16, `200`, design named)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR; G122, 2026-10-16)
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Price (1,460 TL) and quantity (999) decided and filled in (2026-10-16)
- [ ] Hosting extension and renewal decided
- [ ] Images (editorial set) and video produced; alt texts read against them
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
