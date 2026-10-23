# Etsy listing v3: Sky Lantern Festival Wedding Website (design 31)

Internal listing kit for the seller (rewritten 2026-10-22 on the G154 standard of `collections/21_Crimson_Rose_Atelier/package/listing/listing_v3.md`).
**Draft: not published on Etsy (K41), and the design is not for sale.** Theme `sky-lantern-festival`. Same structure and wording as the 01–21
listings (`docs/19_ALICI_YOLCULUGU.md` §4): every sentence answers a buyer question and promises only what the platform does today. Product
language: English (US spelling). Design facts re-read on 2026-10-22 from `platform/themes/sky-lantern-festival/` (README, theme.json,
opening-design.json, interior-design.json, content.demo.json, index.html, home.html and the pictures in `img/`),
`platform/lib/marketing/designs.ts`, `platform/lib/audio/catalog.ts`, `platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts`,
`platform/lib/claim/demo-photos.json` and the live demo page. This replaces the 2026-10-17 draft (G170), which described the earlier
opening (a paper lantern in cupped hands rising into the sky); that opening is no longer in the theme.

**2026-10-23 (merge of the docs/35 redesign, G422–G432):** the owner declared the rebuilt design valid and it was merged to main. §1 title, §2 description and §3 tags now describe the rebuilt theme (its envelope, opening and pages, from `platform/lib/marketing/designs.ts`, which is written against the theme as built). Still the old design until the listing media are re-rendered: the rows of §0 about the opening and the pages, the §5 images and alt texts (`images_v4/`), the §6 video (`video_v4_4x5.mp4`). The START HERE guide was regenerated in the new look on 2026-10-23 and names the envelope. Do not publish before that.

## 0. Status before publishing

| Item | Status on 2026-10-22 |
|---|---|
| Sale status | **Not for sale.** `platform/lib/marketing/config.ts` lists it as `preview` (shown in the site catalogue, no checkout), price `[PRICE]`. This listing stays an unpublished draft. |
| Design build | Rebuilt 2026-10-18/19 (theme README: interior redesigned at the user's request; PROJECT_STATE: print grounds wired 2026-10-20, palettes must be redone from the new art). The first page is a closed **coral silk pouch** (`opening-design.json` kind `silk-lantern-pouch`: a scalloped lid that lifts, a pocket, a lining; the card clears the pouch before it comes forward). `designs.ts` holds two texts for this design: the full entry (G170) still describes the old lantern-in-hands opening, and the catalogue text (`PREVIEW_DESIGN_COPY`) describes the pouch ("The scalloped mouth of a coral silk pouch opens…"). This listing follows the theme and the catalogue text. `tools/etsy_upload.py` reads the object from the full entry ("lantern"), so the no-envelope rule applies to this listing. |
| Start link `https://bkestudio.com/start?theme=sky-lantern-festival` | **404 on the live site** (coordinator's curl, 2026-10-22): `/start` opens only live designs. |
| Live demo `https://bkestudio.com/start/demo/sky-lantern-festival` (in the description under TRY THE LIVE DEMO) | **200 on the live site** (coordinator's curl, 2026-10-22). Fetched again in this task (2026-10-22): the page loads the pouch parts (`v3-closed`, `v3-lid`, `v3-pocket`, `v4-lining`, `v4-lid-back`), the sample names Sophie & Daniel, September 18, 2027, and a sample portrait (`/demo/blush-garden-rose/…`: design 03's fictional photos, shared by this design in `demo-photos.json`). Not opened on a phone. |
| Questions & answers, RSVP questions, music, map and directions, reply form with Excel and Google Sheets, languages, Downloads, guest password, thank-you page | Platform features, the same for every design (theme README: "Editable fields, calendar, map, optional blocks, shared RSVP and thank-you mode retain the platform contract"); tried in local production builds for 01–21 (G090, G133). **Not tried with this design on the live site.** This design's default track is First Light (`catalog.ts`); the demo pin is Santa Barbara, California (`demo-map.ts`). Nobody has listened to the 4 music tracks on a real phone. The Google Sheets connection has not been tried with a real Google account, so the description only says that a Google Sheet can be connected. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Description claims | Every sentence of §2 describes a feature of the platform (the same claims as the 21 listing, G154) or this design's look as the theme builds it today. No VERIFY note is left in §2; the open live-site and real-device tests are in §11. |
| Order check (`CLAIM_ORDER_VERIFICATION`) | Mode in production not read in this task. G191 (2026-10-22, in review on a branch, not live) adds a `trust` mode (publish first, check the order afterwards). The description says only what happens if the editor shows "We are confirming your Etsy order"; re-read that sentence if `trust` goes live (§11). |
| Edit link by email | Off as recorded in the 21 listing (2026-10-17: sending built in G147, waits for SMTP); not re-read in this task. The listing and the START HERE guide promise no email: the buyer opens the editor on any device with the Etsy order number + email (`/my`). |
| Web address | `bkestudio.com` (primary since 2026-10-19; links of the earlier `xn--bkestudo-zkb.com` redirect here with a permanent 308). |
| Shop name, support email | **BKE Studio**, **bkestudio01@gmail.com** (the address `bkestudio@gmail.com` in older listing files is wrong). The description gives no email: buyers message the shop on Etsy. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Blocker:** 1,190 TL is the approved shop price for a template design (docs/23 §1, user, 2026-10-16) and is used here as the proposal; it is not confirmed for this design (`config.ts` price `[PRICE]`). Quantity 999 (Etsy's maximum, no stock limit). |
| Design fonts and other languages | Read on 2026-10-22 from the Google Fonts subset lists (via the gwfh.mranftl.com mirror of the Google Fonts API; the css2 response this task received showed no subset comments). Website: Allura (latin, latin-ext, vietnamese: **no Cyrillic**), Cormorant Garamond and Lora (latin-ext + Cyrillic). Printable invitation (`layouts.ts`): Bellefair (hebrew, latin, latin-ext) and Corinthia (latin, latin-ext, vietnamese). So the language line says: accented Latin letters in the design's fonts, Cyrillic and other alphabets in a plain standard font in some or all places. |
| Etsy rules | `etsy.com/legal/creativity` and the help page "How to Manage Your Digital Listings" answered 403 to this task's fetch (2026-10-22). A web search on 2026-10-22 returned Etsy's House Rules excerpt: items generated with AI tools from the seller's own prompts belong to "Designed by a seller", and the listing description must disclose the use of AI. The AI sentence in GOOD TO KNOW is written for that; re-check in the listing editor (§11). Canva is not part of this product (K24) and was not checked. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` with the start QR, built 2026-10-20 (G190, `tools/build_customer_guides.py`, docs/19 Ek A), rebuilt 2026-10-22 for the opening word. Its start link and QR answer only once the design is live (404 today). It says guests "tap the envelope" and names the editor's preview tab **Envelope**, which matches the rebuilt envelope. **2026-10-23 (review fixes):** rebuilt for every design from docs/19 Ek A (`python3 tools/build_customer_guides.py`, all 49 OK): 14 pages in the new look; it says each design bought starts one website (two designs in one order: one each); its links are the start link, `/my`, the privacy notice and the terms of use; the QR decodes to the start link (jsQR). Not scanned with a phone camera. |
| Printable invitation | `layouts.ts` entry of 2026-10-20 (G190): the PAKET 6 grounds of the redesign (ivory paper, the website's flowers in two corners, a gold hairline frame), 5 × 7 in and A5. Not printed yet. |
| Listing images and video | **Built** (v4 set, docs/20 §7.10): 19 JPGs in `package/listing/images_v4/` (§5) and `package/listing/video_v4_4x5.mp4` (§6), both on the Etsy draft (2026-10-23, docs/20 §7.13). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 135 characters.

```text
Sky Lantern Festival Wedding Website with RSVP, Digital Invitation with a Sky Lantern Envelope Opening, Online Editor, Twilight Lantern
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens as a paper sky lantern rises, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Dusk violet, dusky rose and lantern amber on hand-dyed washi. Your guests tap a dip-dyed dusk washi envelope with a lantern-belly flap and a little paper sky lantern tied to a gold stud with amber silk: the lantern lights up from inside, the silk thread slips free and the lantern rises out of sight while distant lanterns drift up behind it, the flap opens onto warm amber washi, and a rice-paper card with your portrait rises out of the pocket. Then your invitation follows: Home with your portrait in a paper-lantern window, Our Story as three photos on hanging rice-paper panels, each opening in a circle of warm light, Details with a little lantern that lights for each line of the day, and RSVP.

TRY THE LIVE DEMO
See the sky lantern rise on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/sky-lantern-festival
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Sky Lantern Festival design: the sky lantern envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "We're getting married" or "Moments we hold dear")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the lantern animation.

WHAT YOUR GUESTS SEE
Your link opens a dusk-colored washi envelope with a paper lantern. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging services show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website for each design you buy (two designs in one order: one website each). You choose your web address when you start (for example …/sophie-and-daniel); it cannot be changed later. A custom domain (yournames.com) is not included.
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
online rsvp
wedding rsvp
wedding invitation
lantern wedding
sky lantern
twilight wedding
plum wedding
coral wedding
romantic wedding
lantern invitation
```

Character counts: 15 · 12 · 18 · 11 · 12 · 18 · 15 · 11 · 16 · 12 · 13 · 16 · 16 (all ≤ 20).

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
| Primary color | Purple (dusky plum) |
| Secondary color | Orange (coral pouch, lantern amber) |
| Style / theme | Romantic, Whimsical (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (built 2026-10-20, G190; Etsy: up to 5 files, 20 MB each, as recorded in the 21 listing) |
| Price | **1,190 TL proposed** (the approved shop price for a template design, user, 2026-10-16, docs/23 §1; about USD 24.02 at 49.55 TRY per USD). Shop currency TRY (K38). **Not confirmed for this design** (`config.ts` `[PRICE]`): blocker until the user confirms it |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Floral & Garden (Etsy draft, docs/20 §7.11) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set (docs/20 §7.10, `tools/listing_v4/README.md`, the template approved on design 01 on 2026-10-21): 19 JPGs, 4:5 (2000 × 2500), in `package/listing/images_v4/`, in Etsy upload order. **Built and on the Etsy draft** (2026-10-23, docs/20 §7.13), with the 4:5 video; images 02, 05 and 06 name the silk pouch (`OPENS` in `build_set.py`). Images 01, 02, 07, 09, 10 and 15 use opening stills from the live demo (`shots.mjs`); 03–06, 08 and the other phone screens are real screens of a local production build (`tools/listing_templates/capture.ts`, sample content); 12–15 add tablet, laptop and printed-invitation renders (`serve.ts` + `devices.mjs`); 09–19 place the screens into this design's PAKET 7 GPT scenes. The rows below follow the order and headlines of design 01's files (`collections/01_Olive_Ivory/package/listing/images_v4/`, `slides.py`, `lifestyle.py` LIFE). The alt texts were planned before the images existed; on 2026-10-23 image 02 was read against its file and matches, the others are still to be read against their files. Image 07 carries a QR code of the live demo and images 04 and 19 a web address of ours: see §11.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Sky Lantern Festival wedding website with RSVP: two phones show the closed coral silk pouch with its gold cord and tassel, and the card with a sample portrait and the names Sophie & Daniel; badges: No Canva needed, RSVP guest list included, Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real silk pouch: three phones show guests tapping the closed pouch, its scalloped top lifting, and the card with your photo rising out of it; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: a guest's reply form in this design and the couple's guest list in the editor with reply counts and a Download Excel button; badges: your own questions, Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: the editor's list of pages, the Headings & labels screen and the "Your website is live" screen; every change saves by itself |
| 5 | `05_pages.jpg` | Every page included: four phones show Home with the portrait in its lantern frame, Our Story, Details with the order of the day, and RSVP; countdown, schedule, map, Q&A, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included: the invitation on a phone beside a checklist: the silk pouch opening and four pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, 5 photos, music and venue map, QR code and printable invitation, editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the closed silk pouch on a phone next to a QR code of the live demo; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works: open the START HERE guide from your Etsy purchases, start with your Etsy order number and first names, personalize, then publish and share one link by text, WhatsApp, email or QR; the setup step "Add your photo" on a phone |
| 9 | `09_closeup.jpg` | Designed to be opened: a close-up of a phone in a styled scene, showing the opened card with a sample photo and the names |
| 10 | `10_tap.jpg` | One tap and it opens: a hand about to tap a phone that shows the closed silk pouch; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, with no app and no account: a guest at home holds a phone with the Home page |
| 12 | `12_devices.jpg` | Beautiful on every screen: the website on a tablet and on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too: the private editor with its page preview on a laptop |
| 14 | `14_together.jpg` | Plan it together: the guest list on a phone and on a laptop; your editor opens on any device |
| 15 | `15_print.jpg` | Print it or send it: the printable invitation in this design (5 × 7 in or A5 PDF) beside a phone with the closed silk pouch |
| 16 | `16_need.jpg` | Everything your guests need: four phones show the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | On the wedding day: the order of the day on a phone at a reception table, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Every reply in one place: the list of replies on a phone beside a bouquet; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: one person shows the Share screen to another; your own address with your names |

## 6. Video

`package/listing/video_v4_4x5.mp4`: **built** (2026-10-23, on the Etsy draft, docs/20 §7.13). As planned (`tools/listing_v4/stageE.sh`, docs/20 §7.10): the silk pouch opening recorded from the live demo in slow motion (page time 50× slower, `rec.mjs`) and played back at 60 fps by `full45.py`: 1080 × 1350 (4:5, the shape of Etsy's search grid), H.264, silent, about 10 seconds; its last 0.4 s dissolve into the first frame, so Etsy's loop has no jump. Sample names and photos. [VERIFY: Etsy video rules in the listing editor]

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

- Not for sale (`preview`); the price is a proposal; the start link answers 404 until the design is live.
- Opening object (2026-10-23): the rebuilt design opens from its own envelope (`designs.ts` "Your guests tap the envelope."); §1–§3 say "sky lantern envelope" and "a dusk-colored washi envelope with a paper lantern". The §0 rows about the opening, the §5 images and alt texts and the §6 video still show the old opening until they are re-rendered.
- The opening of the 2026-10-17 draft (lantern in cupped hands rising into the sky) is gone from the theme; this text describes the 2026-10-18/19 rebuild.
- "What you can change" has no monogram line (this design shows none) and gives "We're getting married" and "Moments we hold dear", two of this design's headings, as examples.
- Language line from this theme's real fonts (§0): Allura has no Cyrillic.
- Images and video: the 4:5 v4 set (19 images + hover video) instead of the editorial 9 + square video of 01–21.

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (`config.ts` from `preview` to `live`; 1,190 TL proposed)
- [ ] Design deployed as `live`; start link answers on the live site (`200`, design named): 404 on 2026-10-22
- [x] Live demo of this design answers on the live site (`200`, coordinator's curl, 2026-10-22)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR; G190, 2026-10-20)
- [x] Opening word (2026-10-22): "pouch" in `designs.ts`, the editor's preview tab and START HERE (guide rebuilt), matching the silk pouch on the website
- [ ] `designs.ts`: the full entry of this design still describes the lantern-in-hands opening; bring it in line with the theme (coordinator) so the sales site, the guide and this listing say the same
- [ ] Questions & answers and RSVP questions tried on the live site with this design
- [ ] Music, map and directions, the reply form and Excel download tried on the live site with this design; the 4 tracks listened to on a real phone and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode in production today (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual, etsy); if G191's `trust` mode goes live, the order sentence re-read
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages and Share → Downloads tried on the live site with this design
- [ ] Printable invitation of this design: one printed copy checked
- [ ] v4 images 01–08 built; `tools/listing_v4/build_set.py` given an OPENS entry for this design ("silk pouch"), and `slides.py` no longer writes "envelope" into images 05 ("4 pages + the envelope") and 06 ("Envelope opening + …"); every image read for the word envelope (the editor's label "Above your names on the envelope" in image 04 too)
- [ ] PAKET 7 scenes made (`assets/gpt/mockups/p7_01…p7_11`); images 09–19 built; all 19 alt texts rewritten against the files
- [ ] Video built (`video_v4_4x5.mp4`) and watched
- [ ] QR code of the live demo in image 07 and our web address in images 04 and 19: the user decides against docs/15 ("Etsy dışına yönlendirme": no QR in the listing, Off-Platform policy)
- [ ] `tools/etsy_upload.py` reads `images_editorial/` and `video.mp4`; pointed at `images_v4/` and `video_v4_4x5.mp4` (coordinator)
- [x] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
