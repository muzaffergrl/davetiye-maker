# Etsy listing v3: Music Box Ballerina Wedding Website (design 32)

Internal listing kit for the seller (G171, 2026-10-17). **Draft — not published on Etsy (K41).** Theme `music-box-ballerina`. Written from the common
skeleton in `docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the 01–21 listings and the design 28
listing (`collections/28_Maison_Patisserie/package/listing/listing_v3.md`): every sentence answers a buyer question from docs/19 §3 and promises
only what the platform does today. Product language: English (US spelling). This design has no earlier listing: this is its first listing text.
Design facts come from `platform/themes/music-box-ballerina/` (theme.json, index.html, home.html, story.html, details.html, rsvp.html; the theme
README was empty when this text was written) and `platform/lib/marketing/designs.ts` (sales-site copy, G171). This design opens from a music box:
the title, the description, the tags and the alt texts never name any other opening object (`tools/etsy_upload.py --check`).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **Coming: the design is not open for sale** (tasarım satışa açılmadı, coming). `platform/lib/marketing/config.ts` lists it as `coming` with price `[PRICE]`; its GPT artwork does not exist yet (G171: the theme runs on interim layers). This listing waits for the artwork, an eye check and the sale decision. |
| Artwork | **Interim.** Every picture of the theme is a placeholder cut and toned from other designs' GPT images (`themes/music-box-ballerina/build_images.py`); the porcelain ballerina is a plain placeholder slot. The real parts are ordered in `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md`. No image or video of this listing may be made before they arrive. The description describes the finished design (box, key, mirror, ballerina) [VERIFY: GPT parts built in; the ballerina rises and turns as described]. |
| Start link `https://bkestudio.com/start?theme=music-box-ballerina` | **Not live**: the design is in the repository (G171, branch `claude/g171-music-box`) and has not been deployed. Opened only in a local production build. Not opened on a phone. |
| Live demo `https://bkestudio.com/start/demo/music-box-ballerina` (in the description under TRY THE LIVE DEMO) | **Not live**, for the same reason. In the local production build the demo opens this design's music box with the sample couple Juliette & Arthur (fictional venue The Rosewell Pavilion, Saratoga Springs, NY; May 22, 2027). A demo map pin is set (Saratoga Springs, `lib/claim/demo-map.ts`). [VERIFY: demo answers `200` with `data-theme="music-box-ballerina"` after deploy] |
| Current platform release (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | Live on production since G079 (2026-10-15) for 01–20. This design needs the next deploy; its editor features were not tried in this task. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | As in the 01–21 listings: the records disagree (docs/10, docs/18 §4); not read in this task. The sentence keeps [VERIFY: manual order check on in production]. |
| Questions & answers, RSVP questions, menu, travel, registry | Platform features, the same for every design; rendered in this theme only in the local build. **Not tried on the live site.** |
| Our Story music box mirror | Design-specific: three photos appear one at a time in the oval mirror (swipe or arrows; the ballerina turns a quarter with each photo; a plain list with reduced motion). **Not tried** on the live site or on any phone. [VERIFY: on a real phone, and with reduced motion on] |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | In the repository; **not on production yet** and not tried on the live site. This design's default track is "Music Box", a music box lullaby made in code (`platform/lib/audio/catalog.ts`); it plays on the Our Story page and guests can pause it. Opening sound effects play only after the guest's tap; a sound button mutes them. The 4 tracks were made in code and **nobody has listened to them on a real phone yet** (G126). The Google Sheets connection has not been tried with a real Google account (G128). |
| Printable invitation | Composed interim layout (`platform/lib/print/layouts.ts`): the website's blush paper with a rose petal, 5 × 7 in and A5, front and back. The design's own print artwork waits for GPT (PAKET 6). Not tried on the live site. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** No phone check of any kind has been done for this design. |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | `config.ts`: `[PRICE]` — not decided for this design (01–21: 1,460 TL, K42/K47). No stock limit (999). |
| Design fonts and other languages | **Not checked.** The theme loads **Ballet** (names, script) and **Gilda Display** (headings and text) from Google Fonts. On 2026-10-17 the Google Fonts CSS answered without subset labels (single `.ttf` files), so the subsets could not be read. The language line in GOOD TO KNOW is kept conservative. [VERIFY: Ballet and Gilda Display subsets from the Google Fonts CSS (woff2 response)] |
| START HERE guide | **Built** (G175, 2026-10-17): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 32`, from docs/19 Ek A; QR only from `tools/make_qr.py`; `--check` passes). Its start link answers only after this design is deployed; rebuild it if Ek A or the domain changes. |
| Listing images and video | **Not made** (they need the real artwork). |
| Etsy rules (digital items, AI disclosure, title, tags, images, video) | **Not re-checked on Etsy's official pages in this task** (2026-10-17). Re-check them from the links in `00_ANA_DEVIR.md` §34 before publishing and write the date here. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. This design also stays unpublished
until its sales status leaves `coming` (K41).

## 1. Title

Etsy limit: 140 characters. This title: 117 characters.

```text
Music Box Ballerina Wedding Website with RSVP, Music Box Opening Digital Invitation, Online Editor, Rose Quartz Blush
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a keepsake music box, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Rose quartz, blush satin, rose gold and soft gold. Your guests tap a rose-quartz music box with a brass wind-up key: the key turns, the lid swings up on its hinge, the oval mirror inside shows your portrait, and a little porcelain ballerina rises and turns slowly while a few rose petals drift down. Then a card with your names and date comes forward and opens into your pages: Home with your invitation beside your portrait, Our Story with your photos in the music box mirror, Details on blush satin, and RSVP.

TRY THE LIVE DEMO
See the music box open on your own phone before you buy (sample names):
https://bkestudio.com/start/demo/music-box-ballerina
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Music Box Ballerina design: music box opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required. When a guest sends a reply, a few petals drift down and the ballerina turns once [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• A countdown and add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• Our Story: your three photos appear one at a time in the oval mirror; guests swipe or tap the arrows, and the ballerina turns with each photo [VERIFY: on a real phone]
• 5 photo spots with cropping, the order of the day, dress code, a menu, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze [VERIFY: try on the live site]
• A soft music box melody on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and gentle sound effects after a guest taps the box. Turn either off if you like; guests can pause the music and mute the sound with one tap [VERIFY: tracks listened to on a real phone and approved; try on the live site]
• A printable invitation in the same colors (5 × 7 in or A5, with an optional back side and QR code) to download from your editor [VERIFY: the design's own print artwork made; try on the live site]
• A QR code of your website (PNG or SVG) for printed cards and signs
• An optional guest password, and a thank-you page for after the wedding
• A START HERE guide (PDF) with your start link and every step explained [VERIFY: guide built for this design]
• Your website stays online until 12 months after your wedding date

HOW IT WORKS IN 3 STEPS
1. Start: download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number, email and first names. Your private draft is created right away.
2. Personalize: add your names, date and a photo in a short 3-step setup, then anything else whenever you like. Every change saves by itself.
3. Publish & share: tap Publish, then send your link by text, WhatsApp or email, or print the QR code. Guest replies appear in your editor.

WHAT YOU CAN CHANGE
• Your names and how they appear
• Date, ceremony time and time zone; month-first or day-first date style
• Venue, address, map and directions, and the order of the day (up to 10 rows)
• Your story: an intro line, three captions and its music (one of 4 tracks, your own file or none)
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Your menu, questions & answers (up to 12), dress code, travel & stay and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "Turn the key" or "Wind the music box again")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the music box animation.

WHAT YOUR GUESTS SEE
Your link opens a closed music box. One tap winds the key and opens it into your pages. Guests slide through your photos in the music box mirror, reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/juliette-and-arthur); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; the design's fonts are made for English and the Latin alphabet, and letters they do not have show in a plain standard font. [VERIFY: Ballet and Gilda Display subsets]
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
music box wedding
online rsvp
wedding rsvp
wedding invitation
ballerina wedding
blush pink wedding
rose quartz wedding
rose gold wedding
romantic wedding
storybook wedding
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
| Secondary color | Gold |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` — **not built yet** |
| Price | `[PRICE]` — not decided for this design (`config.ts`: `coming`) |
| Quantity | 999, Etsy's maximum [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | [SHOP SECTION] (the user's choice, docs/20 §3) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not made.** The 8 editorial images (`python3 tools/listing_editorial.py --theme music-box-ballerina`, rules in `docs/21_ILAN_GORSELLERI.md`)
wait for the real artwork (GPT_PROMPTS.md) and this design's GPT mockup scenes. Planned set, the same order as 01–21:
1 cover (the closed music box on a phone), 2 opening (box closed · lid up with the ballerina turning · card forward), 3 pages, 4 edit,
5 RSVP (reply card + guest list), 6 details (order of the day on blush satin, venue), 7 how it works, 8 what is included. No image may carry
a QR code or a web address (docs/15 §4.1). Alt texts are written against the files once they exist.

## 6. Video

**Not made.** `package/listing/video.mp4` (12 s square loop of the music box opening, `--video`) waits for the real artwork.

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
You can write your own texts and headings in any language. Built-in messages such as reply form errors stay in English, and letters the design's fonts do not have show in a plain standard font.

**How do my guests reply?**
On your RSVP page, with no app or account. You choose which fields are required and can add up to 10 questions of your own. You see every reply in your editor and can download them all as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply. [VERIFY: Google Sheets connection tested live]

**How many guests can I invite?**
As many as you like. One reply can include up to 10 people.

**Is there music?**
Yes, if you like: a soft music box melody on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and gentle sound effects after a guest taps the box. You can turn music or sound effects off, and guests can pause the music or mute the sound with one tap. [VERIFY: tracks listened to on a real phone]

**What if a guest prefers less motion?**
If a guest's phone is set to reduce motion, Our Story shows your photos as a simple list. [VERIFY: with reduced motion on, on a real phone]

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
the design chooser `https://bkestudio.com/start` (docs/19 §4.4). The START HERE PDF carries this design's own link. Both texts are already entered in
Shop Manager (docs/20 §7.1) and need no change for this design.

Message to Buyers for Digital Items:

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: https://bkestudio.com/start

You will enter your Etsy order number, your email and your first names. Then SAVE YOUR EDIT LINK when it appears: it opens your editor, and we cannot email it to you yet.

Questions? Message us here on Etsy with your order number.
```

Message to Buyers (receipt):

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at https://bkestudio.com/start (choose the design you bought). Please save your private edit link when it appears. Questions? Message us on Etsy.
```

## 9. After the sale

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them): `welcome_start`, `start_link_reminder`, `publish_blocked_pending`, `order_confirmed`, `how_to_publish`, `new_edit_link`, `order_already_used`, `wrong_design_started`, `extra_change_granted`, `date_moved`, `photo_upload_help`, `guest_access_help`, `general_help`, `archive_notice`, `after_wedding_tip`, `review_request`, `refund_or_problem`, `delete_data`.
Rules: the edit link is sent only with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit
link; one review request per order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- A new design (G171, docs/24 wave 2), not on the live site, not open for sale (`coming`) and still on interim artwork (the ballerina is a
  placeholder slot): no images, no video and no START HERE guide yet.
- The guests' first view is "a closed music box" with a brass key; Our Story shows the photos one at a time in the music box mirror, with
  the ballerina turning; the RSVP page answers a sent reply with petals and one turn of the ballerina.
- The music line names this design's default track ("a soft music box melody") and says guests can pause it.
- "What you can change" gives "Turn the key" / "Wind the music box again", this design's own labels, as examples.
- Language line kept conservative: the font subsets of Ballet and Gilda Display could not be read on 2026-10-17 (§0).
- A reduced-motion FAQ, because Our Story is a one-photo-at-a-time mirror.

## 11. Before you publish this listing

- [ ] GPT artwork made (GPT_PROMPTS.md, including the ballerina and PAKET 6 print grounds) and built into the theme; eye check
- [ ] The user approves this design's sale and price (`config.ts`: `coming` → `live`)
- [ ] Design deployed; start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; Our Story tried with reduced motion on
- [ ] START HERE guide written for this design (with the start QR)
- [ ] Questions & answers, RSVP questions, the menu and the printable invitation tried on the live site
- [ ] Music (the "Music Box" track listened to on a real phone), map and directions, the reply form and Excel download (G126–G128) live and tried on the live site
- [ ] Ballet and Gilda Display subsets read from the Google Fonts CSS; language line rewritten if needed
- [ ] Manual order check confirmed on in production, or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale
- [ ] Price decided and filled in; quantity 999
- [ ] Listing images and video made; alt texts read against the files
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked on the official pages (`00_ANA_DEVIR.md` §34) and in the listing editor (title, tags, images, video, AI disclosure, "Designed by"); date written in §0
- [ ] No VERIFY is left in this file; the word for any other opening object does not appear in the title, description, tags or alt texts
