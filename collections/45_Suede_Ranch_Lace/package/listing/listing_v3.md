# Etsy listing v3: Suede Ranch Lace Wedding Website (design 45)

Internal listing kit for the seller (2026-10-22). **Draft: not published on Etsy, and the design is not on sale**
(`platform/lib/marketing/config.ts`: `coming`). Theme `suede-ranch-lace` (fourth wave, task G445, built 2026-10-21/22
from the design's own GPT parts). Written on the newest listing standard, the 21 listing (G154): the same sections,
headings and shop-wide wording; every sentence answers a buyer question from `docs/19_ALICI_YOLCULUGU.md` §3 and promises
only what the platform does today. Product language: English (US spelling). This design has no earlier listing text.
Design facts come from `platform/themes/suede-ranch-lace/` (README, theme.json, content.demo.json, index, home, story,
details and rsvp pages), `platform/lib/marketing/designs.ts` (sales-site copy), `platform/lib/audio/catalog.ts`,
`platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts` and `collections/45_Suede_Ranch_Lace/DESIGN_BRIEF.md`.

## 0. Status before publishing

| Item | Status on 2026-10-22 |
|---|---|
| Sale status | **Not on sale.** `platform/lib/marketing/config.ts` lists it as `coming` (hidden on the sales site), price `[PRICE]`. This listing stays an unpublished draft. |
| Design artwork | Complete: the design's own GPT parts (PAKET 5 W1–W18), sample photos (PAKET 2) and print grounds (PAKET 6) are all in the theme (README). The golden-hour sweep and the reply's breeze are CSS light. |
| Start link `https://bkestudio.com/start?theme=suede-ranch-lace` | **Answers 404 on the live site** (2026-10-22): `/start` opens only `live` designs. It opens once the design is `live`. Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/suede-ranch-lace` (in the description under TRY THE LIVE DEMO; image 7 will carry its QR code) | **Answers 200 on the live site** (curl, 2026-10-22). Sample couple Josie & Beau at Silver Sage Ranch, Jackson, Wyoming, on September 11, 2027 at 5:30 PM (all fictional, `content.demo.json`); the demo map pin is on Jackson (`platform/lib/claim/demo-map.ts`; the ranch is fictional); sample photos from `platform/lib/claim/demo-photos.json`. Not opened on a real phone. |
| Theme checks | `tests/theme-suede-ranch-lace.test.ts` passes 11/11, and the frames were checked by eye at 390 × 844 in a local Chromium (Playwright) with the animations sought to fixed times (theme task G445; not re-run for this listing). `theme-check` and `scripts/font-fallback.ts` were not run (README "Known limits": the names fallback faces still carry the copied template's numbers). |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Platform features and shop-wide texts | Editor, order number + email access (`/my`), the order-check sentence, RSVP questions, Excel and Google Sheets, music, map and directions, languages, guest password, thank-you page and Share → Downloads are the same for every design and are described in §2 exactly as in the 21 listing (G154, 2026-10-17). Their live status was not re-read in this task; the open live-site checks are in §11. |
| Music and opening sounds | Default track **Garden Waltz** (`platform/lib/audio/catalog.ts`); the demo content picks **First Light** instead (`content.demo.json` `audio.music`), so the demo plays a different track than a new website starts with. Opening sounds: seal, ribbon, paper, slide, chime, timed on the opening steps. The 4 tracks were made in code (G126); nobody has listened to them on a real phone. |
| Google Sheets | Not tried with a real Google account; the description and FAQ only say that a Google Sheet can be connected (as 21, G154). |
| Photos in this design | The photos keep their colors, in tooled leather frames; a weathered ranch gate swings open in front of each as its scene enters (the venue has a two-leaf gate). Without JS or with reduced motion there is no gate (README). |
| Printable invitation | `platform/lib/print/layouts.ts`: the design's own PAKET 6 grounds (cream paper; front: a spray of wildflowers round a small concho at the top, sage and bluebonnets at the foot; back: a small sprig at the top), `cover` for 5 × 7 in and A5; the text boxes were measured clear of the ornament (G149). No printed copy checked. |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). |
| Shop name, support email | **BKE Studio**; support email **bkestudio01@gmail.com** (the older address without "01" found in some files is wrong). The description gives no email: "Message us here on Etsy. We reply within 24 hours." |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | Proposal **1,190 TL**, the shop price the user approved for a template design (docs/23 §1, 2026-10-16). **Blocker** until the user confirms it for this design (`config.ts` still has `[PRICE]`). Quantity 999 (no stock limit). Renewal and the Etsy listing URL are open. |
| Design fonts and other languages | Rochester (names): **latin only**. Rye (headings and short labels): latin + latin-ext. Lustria (body): **latin only** in the `FONT_SUBSETS` table of `tools/build_customer_guides.py` (read from fonts.googleapis.com/css2; the START HERE guide uses the same table) and in the Google Fonts API list (google-webfonts-helper mirror, read 2026-10-22); the google/fonts `METADATA.pb` file lists latin-ext for Lustria as well. The stricter value is used: the language line in GOOD TO KNOW is the guide's "latin" line (letters such as ş, ğ or ł in names and body text may show in a fallback font, also in the Turkish version of the built-in texts). |
| START HERE guide | `package/customer/START_HERE.md` + `.pdf` built and checked on 2026-10-22 (`tools/build_customer_guides.py`, docs/19 Ek A): 10 pages; links = the start link, `/my` and the privacy notice; the QR decodes to the start link (jsQR). The start link answers only once the design is live (404 on 2026-10-22). The QR has not been scanned with a phone camera. |
| Listing images and video | v4 set (`tools/listing_v4/README.md`, docs/20 §7.10). **Images 01–08 built** on 2026-10-22 in `package/listing/images_v4/` (2000 × 2500 JPG; alt texts in §5 written from the files). **Images 09–19 not built yet**: they wait for this design's GPT scenes (PAKET 7, `assets/gpt/mockups/`, none yet). **Video `package/listing/video_v4_4x5.mp4` not built yet.** Nothing uploaded to Etsy. |
| Etsy and Canva rules (checked 2026-10-22) | Etsy: a direct read of etsy.com/legal/creativity and of the help page on digital listings answered 403. Web-search excerpts of Etsy's Creativity Standards and Seller Policy (2026-10-22) say that AI use must be disclosed in the listing description and that seller-prompted AI creations count as "Designed by a seller"; the AI sentence in GOOD TO KNOW follows this. The listing-editor settings stay a §11 box. Canva: not applicable (the product uses no Canva). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false.

## 1. Title

Etsy limit: 140 characters. This title: 127 characters.

```text
Suede Ranch Lace Wedding Website with RSVP, Digital Invitation with an Envelope Opening, Online Editor, Western Rustic, Leather
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Tan suede, cream lace, tooled leather and a silver concho, with wildflowers and sage at golden hour, like a ranch at the foot of the mountains. Your guests tap a fringed suede envelope tied with a leather cord: the concho turns, the cord comes undone and slips away, the fringed flap swings open, golden-hour light sweeps the screen and the card with your portrait rises out of its pocket. Then your invitation follows: Home with your portrait in a tooled leather frame on a cream card with wildflowers, Our Story with three photos behind weathered ranch gates that swing open as guests scroll, Details with your venue behind a two-leaf gate, and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names and photos):
https://bkestudio.com/start/demo/suede-ranch-lace
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Suede Ranch Lace design: envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Under the open sky")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a closed envelope tied with a leather cord. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/josie-and-beau); it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language. Western European accents (such as é, ñ and ü) use the design's fonts; some other accented letters (for example in Polish, Czech or Turkish) and other alphabets show in a simpler fallback font.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
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
western wedding
ranch wedding
rustic wedding
country wedding
boho western
suede invitation
```

Character counts: 15, 12, 18, 19, 11, 12, 18, 15, 13, 14, 15, 12, 16 (all ≤ 20).

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did [VERIFY: the "Designed by" option for designs made with AI image tools; the 2026-10-22 web-search excerpts put seller-prompted AI creations under "Designed by a seller"] |
| What is it | A finished product |
| When was it made | Made to order (choose what Etsy offers for digital items) |
| Occasion | Wedding |
| Primary color | Brown |
| Secondary color | Beige |
| Style / theme | Western, Rustic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (built 2026-10-22; Etsy: up to 5 files, 20 MB each) |
| Price | Proposed: **1,190 TL** (the launch price the user approved on 2026-10-22 for a template design (K49); about USD 24.02 at 49.55 TRY per USD, docs/23 §1). Shop currency TRY (K38). **Not confirmed for this design yet** (blocker, §11) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | Classic & Vintage (Etsy draft, docs/20 §7.11) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

The v4 set, 19 images in Etsy order (`tools/listing_v4/`: `build_set.py 45` + `export.py 45` → `package/listing/images_v4/`; order and file names as design 01's `images_v4/`; rules in `tools/listing_v4/README.md` and docs/20 §7.10). Phone screens are always real screens: the opening frames from the live demo, the guest pages and the editor from a local production build (the editor screens show the template's own sample couple, Elena & Marco); all words are HTML, never written by GPT. Images 01–08 were built on 2026-10-22 and the alt texts 1–8 were written from the files. Images 09–19 are **not built yet**: they wait for this design's PAKET 7 GPT scenes (`assets/gpt/mockups/p7_01_closeup.png` … `p7_11_share.png`); their alt texts are drafts from `tools/listing_v4/lifestyle.py` (headline and screens per image) and must be read against the files.

Two images go against the rule of the 01–21 editorial sets (no QR code or web address in a listing image, Etsy Off-Platform policy, docs/15 §4.1): image 7 carries a QR code of the live demo, and image 4 shows the editor's "Your website is live" card with a sample web address; image 19 (planned) has the footer "Your own address: bkestudio.com/your-names". The user approved the v4 template on design 01; whether these may stay is an open §11 box.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.jpg` | Suede Ranch Lace wedding website with RSVP: two phones show the tan suede envelope with leather whipstitching, a cream lace strip, a fringe and a leather cord under a silver concho, and the open envelope with its ticking lining and the lace-edged card with your portrait in a tooled leather frame, names Josie & Beau; badges say No Canva needed, RSVP guest list included and Edit on your phone |
| 2 | `02_reveal.jpg` | Opens like a real envelope: three phones show 1 guests tap the suede envelope tied with a leather cord, 2 the fringed flap opens onto ticking and the card shows in the pocket, 3 the card rises with your photo; sound and animation included |
| 3 | `03_rsvp.jpg` | Collect RSVPs with ease: the guest's reply form on a cream card under a lace strip with a concho, and the couple's guest list in the editor with guests coming, not coming, replies and a Download Excel button; badges for your own questions and the Excel guest list download |
| 4 | `04_edit.jpg` | Edit everything on your phone, no Canva, no app, no account: three phones show 1 the editor's list of pages, 2 changing a heading under Headings & labels, 3 the Your website is live screen; every change saves by itself |
| 5 | `05_pages.jpg` | Every page included: Home on tan suede with your portrait in a tooled leather frame and wildflowers, Our Story with a horseback photo in a leather frame, Details with the order of the day, sprigs of sage and add-to-calendar buttons, and the RSVP page; countdown, schedule, map, questions and answers, add-to-calendar, music, dress code, travel and registry |
| 6 | `06_included.jpg` | What's included: the invitation "Under the open sky" under a lace strip with a concho on a phone, next to a checklist: envelope opening and four pages, online RSVP with your own questions, guest list and one-tap Excel download, countdown and add-to-calendar, your 5 photos, music and venue map, QR code and printable invitation, editor on phone or computer, online until 12 months after your wedding |
| 7 | `07_demo.jpg` | Try it before you buy: the suede envelope tied with its leather cord on a phone next to a QR code of the live demo, to scan with your phone camera or tap the demo link in the description; sample names and photos that yours replace |
| 8 | `08_how.jpg` | How it works: 1 buy and open the START HERE guide from your Etsy purchases, 2 start with your Etsy order number and first names, 3 personalize names, date, photos, story and RSVP questions, 4 publish and share one link by text, WhatsApp, email or QR; the setup's Add your photo step on a phone |
| 9 | `09_closeup.jpg` | (draft, not built yet) Designed to be opened: a close-up of a phone with the open Suede Ranch Lace envelope, your photo and your names |
| 10 | `10_tap.jpg` | (draft, not built yet) One tap and it opens: a hand taps the suede envelope on a phone; sound and animation included |
| 11 | `11_home.jpg` | (draft, not built yet) Guests open it anywhere, no app and no account: the Home page on a guest's phone; just one link on any phone |
| 12 | `12_devices.jpg` | (draft, not built yet) Beautiful on every screen: the Home page on a tablet and the invitation on a phone |
| 13 | `13_laptop.jpg` | (draft, not built yet) Edit on your laptop too: the private editor with its preview on a laptop |
| 14 | `14_together.jpg` | (draft, not built yet) Plan it together: the guest list in the editor on a phone and on a laptop; open your editor on any device |
| 15 | `15_print.jpg` | (draft, not built yet) Print it or send it: the printable invitation in the Suede Ranch Lace design (5 × 7 in or A5 PDF) next to the closed envelope on a phone |
| 16 | `16_need.jpg` | (draft, not built yet) Everything your guests need: four phones show the invitation, the venue and map, questions and answers, and a sent RSVP |
| 17 | `17_day.jpg` | (draft, not built yet) The order of the day, with add-to-calendar buttons, on a phone |
| 18 | `18_replies.jpg` | (draft, not built yet) Every reply in one place: the guest list in the editor on a phone; download it as Excel in one tap |
| 19 | `19_share.jpg` | (draft, not built yet) Share it with one link by text, WhatsApp, email or QR: the editor's Share screen on a phone |

## 6. Video

**Not built yet** (2026-10-22). Planned: `package/listing/video_v4_4x5.mp4`, the hover video of the v4 set (`tools/listing_v4/stageE.sh 45`): `rec.mjs` records the live demo `https://bkestudio.com/start/demo/suede-ranch-lace` in slow motion (page time 50× slower, 432 × 540 at 2.5× = 1080 × 1350), and `full45.py` turns it into a 60 fps H.264 video with no sound track whose last 0.4 s dissolve into the first frame, so Etsy's loop has no jump. It shows the closed envelope, the opening with the golden-hour light and the start of Home with the sample names and photos. The 01–21 videos made this way run about 10.5 s (docs/20 §7.10). Etsy's video rules come from web-search excerpts of Etsy's help pages (2026-10-14: 5–15 s, up to 100 MB, at least 500 px, no sound). [VERIFY: Etsy video rules in the listing editor]

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

- A new fourth-wave design (G445, built 2026-10-21/22 from its own GPT parts), still `coming`: its demo answers on the live site, its start link does not (404), and no price is confirmed. The description follows the 21 listing (G154) word for word outside the design paragraph.
- No wax seal: a leather cord goes twice round the suede envelope under a silver concho. The concho turns, the cord slips away, the fringed flap swings open, golden-hour light sweeps the screen and the card rises; Home is reached at about 2.9 s (README step table; Skip in the corner, reduced motion goes straight to Home).
- Western without costume: the design brief rules out cartoon cowboys, costumes, sign lettering, cattle brands with letters and flags; the tags stay with "western", "ranch", "rustic" and "country".
- The demo plays First Light while a new website starts with Garden Waltz (§0); the description promises neither track by name.
- "What you can change" has no monogram line (this design shows none) and gives "Under the open sky", this design's invitation heading, as the second example of your own wording.
- Language line from this theme's real fonts (§0): the names font and the body font have Western European accents only, so the guide's "latin" line is used word for word (the START HERE guide has the same sentence); it names Turkish, which also covers the Turkish version of the built-in texts (§0, §11).
- Images: the v4 set (19 images, 4:5, and a 4:5 hover video) instead of the 9 editorial images and the square video of the 01–21 kits.

## 11. Before you publish this listing

- [ ] The user approves this design's sale and price (`config.ts` `live` with a price; on 2026-10-22: `coming`, `[PRICE]`)
- [ ] Start link answers 200 on the live site with this design named (404 on 2026-10-22)
- [x] Live demo answers 200 on the live site (curl, 2026-10-22)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [x] START HERE guide built and checked for this design (`package/customer/START_HERE.md` + `.pdf`, 10 pages, QR decodes to the start link; 2026-10-22)
- [ ] `theme-check` and `scripts/font-fallback.ts` run for this theme (README "Known limits")
- [ ] Questions & answers and RSVP questions tried on the live site
- [ ] Music, map and directions, the reply form and Excel download tried on the live site; the 4 tracks listened to on a real phone and approved; Google Sheets connected with a real Google account
- [ ] The demo's track decided (First Light in `content.demo.json` against the design default Garden Waltz in `catalog.ts`)
- [x] Order sentence true in every order-check mode (G154, K48: only if the editor says it is confirming the order; "usually within 24 hours")
- [ ] Order check mode read in production (`CLAIM_ORDER_VERIFICATION`: off, manual or etsy)
- [ ] G146 live (order number + email open the editor on any device: `/my`, "Create your website"); START HERE re-checked against it
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome), including the cord, the swinging fringe and the ranch gates
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [ ] Price (1,190 TL proposal) confirmed by the user for this design and filled in; quantity 999
- [x] Hosting extension decided (K48, 2026-10-17: on request via Etsy before the "Online until" date, no price promised)
- [ ] Renewal decided
- [ ] Languages (G144) and Share → Downloads (G139) tried on the live site; the Turkish version looked at for letters in the fallback font
- [ ] Printable invitation: one printed copy checked (5 × 7 in and A5)
- [x] v4 images 01–08 built and alt texts 1–8 read against the files (2026-10-22)
- [ ] PAKET 7 GPT scenes made for this design; images 09–19 built; alt texts 9–19 rewritten against the files
- [ ] Image 7 (demo QR), image 4 (sample web address on the editor's live card) and image 19 (address in the footer) checked against Etsy's Off-Platform policy (docs/15 §4.1)
- [ ] Hover video `video_v4_4x5.mp4` produced from the live demo; first and last frame compared
- [x] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by"); the official pages could not be read directly on 2026-10-22 (403)
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
