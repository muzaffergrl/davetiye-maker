# Etsy listing v3: Art Nouveau Lily Wedding Website (design 37)

Internal listing kit for the seller (rewritten 2026-10-22 on the G154 standard of `collections/21_Crimson_Rose_Atelier/package/listing/listing_v3.md`).
**Draft: not published on Etsy (K41), and the design is not for sale.** Theme `art-nouveau-lily`. Same structure and wording as the 01–21
listings (`docs/19_ALICI_YOLCULUGU.md` §4): every sentence answers a buyer question and promises only what the platform does today. Product
language: English (US spelling). Design facts re-read on 2026-10-22 from `platform/themes/art-nouveau-lily/` (README, theme.json,
content.demo.json, index.html, `img/manifest.json`, `parts.css`), `collections/37_Art_Nouveau_Lily/assets/gpt/`,
`platform/lib/marketing/designs.ts`, `platform/lib/audio/catalog.ts`, `platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts`,
`platform/lib/claim/demo-photos.json` and the live demo page. The README names an artist as the style reference; the listing does not
(it says "in the spirit of an Art Nouveau poster").

## 0. Status before publishing

| Item | Status on 2026-10-22 |
|---|---|
| Sale status | **Not for sale.** `platform/lib/marketing/config.ts` lists it as `coming` (hidden from the site), price `[PRICE]`. This listing stays an unpublished draft. |
| Design build | **Interim build** in the repository and on the live demo: `img/manifest.json` `parts.used` is empty and `parts_css_rules` is 0. The cream paper, sage ground and lilac lining are toned textures of other designs' plain GPT papers; the pocket and the three petals are cream paper cut by `clip-path`; light is CSS; the medallion, card frame, arch frames, halo, lily sprays, whiplash line and drifting petals stay hidden until their parts are placed (README "Interim build"). This design's own GPT parts have arrived in `assets/gpt/parts/` (cream_paper, sage_paper, lilac_lining, env_back, env_pocket, petal_left, lily_medallion, card_small, arch_window, halo, lily_spray, whiplash, petal_drift, web_hero), with the PAKET 2 photos and the PAKET 6 print sheets, but they are **not placed** yet (PROJECT_STATE: "GPT parts, then gpt_yerlestir + eye review"). Still missing: `petal_right` and `petal_centre` (W2.6 is only one third there: with `petal_left` alone, one petal would be GPT art and two interim cuts; eye check). §2 describes the design with the parts that exist; its look sentences become true only once the parts are placed and deployed (§11). |
| Start link `https://bkestudio.com/start?theme=art-nouveau-lily` | **404 on the live site** (coordinator's curl, 2026-10-22): `/start` opens only live designs. |
| Live demo `https://bkestudio.com/start/demo/art-nouveau-lily` (in the description under TRY THE LIVE DEMO) | **200 on the live site** (coordinator's curl, 2026-10-22). Fetched again in this task (2026-10-22): the interim build, with the sample names Odette & Felix, June 19, 2027 · Nancy, Grand Est, and only the placeholder portrait (`ph_arch-640`, "Your photo here"): `demo-photos.json` has no entry for this design, so the demo has no sample photos yet. Not opened on a phone. |
| Questions & answers, RSVP questions, music, map and directions, reply form with Excel and Google Sheets, languages, Downloads, guest password, thank-you page | Platform features, the same for every design (README "Shared platform layers"); tried in local production builds for 01–21 (G090, G133). **Not tried with this design on the live site.** This design's default track is Garden Waltz (`catalog.ts`); the demo pin is Nancy, France (`demo-map.ts`; the villa is fictional). Nobody has listened to the 4 music tracks on a real phone. The Google Sheets connection has not been tried with a real Google account, so the description only says that a Google Sheet can be connected. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** README: without `@property` (older Safari) the light band and the whiplash line jump to their end state; Safari's `preserve-3d` with `backface-visibility` on the petals is not tried. |
| Description claims | Every sentence of §2 describes a feature of the platform (the same claims as the 21 listing, G154) or this design's look with its own GPT parts (see Design build). No VERIFY note is left in §2; the open placement, live-site and real-device checks are in §11. |
| Order check (`CLAIM_ORDER_VERIFICATION`) | Mode in production not read in this task. G191 (2026-10-22, in review on a branch, not live) adds a `trust` mode (publish first, check the order afterwards). The description says only what happens if the editor shows "We are confirming your Etsy order"; re-read that sentence if `trust` goes live (§11). |
| Edit link by email | Off as recorded in the 21 listing (2026-10-17: sending built in G147, waits for SMTP); not re-read in this task. The listing and the START HERE guide promise no email: the buyer opens the editor on any device with the Etsy order number + email (`/my`). |
| Web address | `bkestudio.com` (primary since 2026-10-19; links of the earlier `xn--bkestudo-zkb.com` redirect here with a permanent 308). |
| Shop name, support email | **BKE Studio**, **bkestudio01@gmail.com** (the address `bkestudio@gmail.com` in older listing files is wrong). The description gives no email: buyers message the shop on Etsy. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Blocker:** 1,460 TL is the approved shop price for a template design (docs/23 §1, user, 2026-10-16) and is used here as the proposal; it is not confirmed for this design (`config.ts` price `[PRICE]`). Quantity 999 (Etsy's maximum, no stock limit). |
| Design fonts and other languages | Google Fonts subsets read on 2026-10-22: Ephesis (latin, latin-ext, vietnamese; names), Federant (**latin only**; headings, labels and buttons) and Linden Hill (latin, latin-ext; body), on the website and on the printable invitation; none has Cyrillic. The language line is the guide's "latin" line (`tools/build_customer_guides.py` `LANGUAGE_LINES`, word for word, coordinator 2026-10-22): Western European accents in the design's fonts, some other accented letters (Polish, Czech, Turkish) and other alphabets in a simpler fallback font. |
| Etsy rules | `etsy.com/legal/creativity` and the help page "How to Manage Your Digital Listings" answered 403 to this task's fetch (2026-10-22). A web search on 2026-10-22 returned Etsy's House Rules excerpt: items generated with AI tools from the seller's own prompts belong to "Designed by a seller", and the listing description must disclose the use of AI. The AI sentence in GOOD TO KNOW is written for that; re-check in the listing editor (§11). Canva is not part of this product (K24) and was not checked. |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf`, **built and checked 2026-10-22** (coordinator, `tools/build_customer_guides.py`, the same source text as 31–32, docs/19 Ek A): 10 pages; its links are the start link, the `/my` page and the privacy notice; the QR decodes to the start link (jsQR). The start link answers only once the design is live (404 today). |
| Printable invitation | `layouts.ts` still uses the **interim** layout (cream paper with bands of the sage ground, both toned textures). The design's PAKET 6 sheets are in `assets/gpt/print/invitation_front_5x7.png` and `invitation_back_5x7.png` but not wired (steps in `GPT_PROMPTS.md` PAKET 6). Not printed yet. |
| Listing images and video | **Not built yet.** Planned: the v4 set (docs/20 §7.10, `tools/listing_v4/README.md`): cover + 7 info images + 11 lifestyle images = 19 JPGs in `package/listing/images_v4/`, and a 4:5 hover video `package/listing/video_v4_4x5.mp4` (§5, §6). Images 01, 02, 07, 09, 10, 15 and the video are taken from the live demo, which shows the interim build: build them only after the GPT parts are placed and deployed. The 11 lifestyle images wait for this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_*.png`, none yet). Nothing uploaded to Etsy. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 110 characters.

```text
Art Nouveau Lily Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Sage and Lilac
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Sage, cream, lilac and gold, in the spirit of an Art Nouveau poster with stained glass. Your guests tap a cream envelope closed by three petal flaps under a stained-glass lily medallion: a band of light passes through the glass, the medallion lifts away, the two side petals open outward onto their lilac lining and the center petal opens upward, like a lily in bloom. The card with your arched portrait rises out of the envelope and comes forward. Then your invitation follows: Home with a gold mosaic halo and lily sprays around your portrait, Our Story with three photos in arched stained-glass windows that come alive as a band of light passes through, Details and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names):
https://bkestudio.com/start/demo/art-nouveau-lily
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Art Nouveau Lily design: envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "Love in full bloom" or "Moments we hold dear")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a cream envelope under a stained-glass lily. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging services show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/odette-and-felix); it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language; Western European accents (such as é, ñ and ü) use the design's fonts; some other accented letters (for example in Polish, Czech or Turkish) and other alphabets show in a simpler fallback font.
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
art nouveau wedding
lily wedding
stained glass
sage wedding
lilac wedding
vintage wedding
```

Character counts: 15 · 12 · 18 · 19 · 11 · 12 · 18 · 19 · 12 · 13 · 12 · 13 · 15 (all ≤ 20).

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
| Primary color | Green (sage) |
| Secondary color | Purple (lilac) |
| Style / theme | Vintage, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (built and checked 2026-10-22; Etsy: up to 5 files, 20 MB each, as recorded in the 21 listing) |
| Price | **1,460 TL proposed** (the approved shop price for a template design, user, 2026-10-16, docs/23 §1; about USD 29.48 at 49.53 TRY per USD). Shop currency TRY (K38). **Not confirmed for this design** (`config.ts` `[PRICE]`): blocker until the user confirms it |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Suggestion: `Floral & Garden` or `Classic & Vintage` (existing sections, docs/20 §3; the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set (docs/20 §7.10, `tools/listing_v4/README.md`, the template approved on design 01 on 2026-10-21): 19 JPGs, 4:5 (2000 × 2500), in `package/listing/images_v4/`, in Etsy upload order. **Not built yet** for this design, and the opening stills must wait for the placed GPT parts (§0). Images 01, 02, 07, 09, 10 and 15 use opening stills from the live demo (`shots.mjs`); 03–06, 08 and the other phone screens are real screens of a local production build (`tools/listing_templates/capture.ts`, sample content); 12–15 add tablet, laptop and printed-invitation renders (`serve.ts` + `devices.mjs`); 09–19 place the screens into this design's PAKET 7 GPT scenes, which do not exist yet. The rows below follow the order and headlines of design 01's files (`collections/01_Olive_Ivory/package/listing/images_v4/`, `slides.py`, `lifestyle.py` LIFE). Alt texts are planned: rewrite each against its finished file. Image 07 carries a QR code of the live demo and images 04 and 19 a web address of ours: see §11.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Art Nouveau Lily wedding website with RSVP: two phones show the closed cream envelope with three petal flaps under a stained-glass lily medallion, and the card with a sample arched portrait and the names Odette & Felix; badges: No Canva needed, RSVP guest list included, Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show guests tapping the envelope, the petal flaps opening like a lily, and the card with your photo rising out; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: a guest's reply form in this design and the couple's guest list in the editor with reply counts and a Download Excel button; badges: your own questions, Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: the editor's list of pages, the Headings & labels screen and the "Your website is live" screen; every change saves by itself |
| 5 | `05_pages.jpg` | Every page included: four phones show Home with the arched portrait on a cream card, Our Story, Details with the order of the day, and RSVP; countdown, schedule, map, Q&A, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included: the invitation on a phone beside a checklist: the envelope opening and four pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, 5 photos, music and venue map, QR code and printable invitation, editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the closed lily envelope on a phone next to a QR code of the live demo; sample names and photos, yours replace them |
| 8 | `08_how.jpg` | How it works: open the START HERE guide from your Etsy purchases, start with your Etsy order number and first names, personalize, then publish and share one link by text, WhatsApp, email or QR; the setup step "Add your photo" on a phone |
| 9 | `09_closeup.jpg` | Designed to be opened: a close-up of a phone in a styled scene, showing the opened card with a sample photo and the names |
| 10 | `10_tap.jpg` | One tap and it opens: a hand about to tap a phone that shows the closed lily envelope; sound and animation included |
| 11 | `11_home.jpg` | Guests open it anywhere, with no app and no account: a guest at home holds a phone with the Home page |
| 12 | `12_devices.jpg` | Beautiful on every screen: the website on a tablet and on a phone |
| 13 | `13_laptop.jpg` | Edit on your laptop too: the private editor with its page preview on a laptop |
| 14 | `14_together.jpg` | Plan it together: the guest list on a phone and on a laptop; your editor opens on any device |
| 15 | `15_print.jpg` | Print it or send it: the printable invitation in this design (5 × 7 in or A5 PDF) beside a phone with the closed lily envelope |
| 16 | `16_need.jpg` | Everything your guests need: four phones show the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | On the wedding day: the order of the day on a phone at a reception table, with add-to-calendar buttons |
| 18 | `18_replies.jpg` | Every reply in one place: the list of replies on a phone beside a bouquet; download it as Excel in one tap |
| 19 | `19_share.jpg` | Share it with one link by text, WhatsApp, email or QR: one person shows the Share screen to another; your own address with your names |

## 6. Video

`package/listing/video_v4_4x5.mp4`: **not built yet**; record it only after the GPT parts are placed and deployed (the live demo shows the interim build today). Planned (`tools/listing_v4/stageE.sh`, docs/20 §7.10): the envelope opening recorded from the live demo in slow motion (page time 50× slower, `rec.mjs`) and played back at 60 fps by `full45.py`: 1080 × 1350 (4:5, the shape of Etsy's search grid), H.264, silent, about 10 seconds; its last 0.4 s dissolve into the first frame, so Etsy's loop has no jump. Sample names. [VERIFY: Etsy video rules in the listing editor]

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
- The theme is still the interim build: §2 describes the look with this design's own GPT parts, which have arrived but are not placed (§0); two of the three petal parts are still missing.
- The envelope is not the V flap and wax seal of 01–21: three petal flaps under a stained-glass lily medallion that open like a flower.
- The style is named as "an Art Nouveau poster with stained glass"; no artist or other person's name is used.
- No sample photos in the demo yet: the demo line says "sample names".
- "What you can change" has no monogram line (this design shows none) and gives "Love in full bloom", this design's invitation heading, as an example.
- Language line: the guide's "latin" line (§0): Federant has latin only.
- Images and video: the 4:5 v4 set (19 images + hover video) instead of the editorial 9 + square video of 01–21.

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (`config.ts` from `coming` to `live`; 1,460 TL proposed)
- [ ] This design's own GPT parts placed in the theme (`build_images.py` → `parts.css`, `tools/gpt_yerlestir.py`), eye-checked and deployed; the missing parts (`petal_right`, `petal_centre`) delivered or accepted as missing; every look sentence of §2 read against the live demo (interim build on 2026-10-22)
- [ ] Sample photos (PAKET 2, `assets/gpt/photos/`) built into the live demo (`scripts/build-demo-photos.ts`; `demo-photos.json` has no entry yet); then the demo line may say "sample names and photos"
- [ ] Design deployed as `live`; start link answers on the live site (`200`, design named): 404 on 2026-10-22
- [x] Live demo of this design answers on the live site (`200`, coordinator's curl, 2026-10-22)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide built and checked for this design (2026-10-22, `tools/build_customer_guides.py`: 10 pages; links: start link, `/my`, privacy notice; the QR decodes to the start link with jsQR)
- [ ] Questions & answers and RSVP questions tried on the live site with this design
- [ ] Music, map and directions, the reply form and Excel download tried on the live site with this design; the 4 tracks listened to on a real phone and approved; Google Sheets connected with a real Google account
- [x] Order sentence true in every order-check mode in production today (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual, etsy); if G191's `trust` mode goes live, the order sentence re-read
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome); the petals' 3D turn and the light band checked on Safari
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages and Share → Downloads tried on the live site with this design
- [ ] Printable invitation: PAKET 6 sheets (`assets/gpt/print/`) wired in `layouts.ts` (GPT_PROMPTS.md PAKET 6) and one printed copy checked
- [ ] v4 images 01–08 built after the GPT parts are live; alt texts read against the files
- [ ] PAKET 7 scenes made (`assets/gpt/mockups/p7_01…p7_11`); images 09–19 built; all 19 alt texts rewritten against the files
- [ ] Video built (`video_v4_4x5.mp4`) from the live demo with the placed parts, and watched
- [ ] QR code of the live demo in image 07 and our web address in images 04 and 19: the user decides against docs/15 ("Etsy dışına yönlendirme": no QR in the listing, Off-Platform policy)
- [ ] `tools/etsy_upload.py` reads `images_editorial/` and `video.mp4`; pointed at `images_v4/` and `video_v4_4x5.mp4` (coordinator)
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
