# Etsy listing v3: Nocturne Lake Estate Wedding Website (design 22)

Internal listing kit for the seller (G175, 2026-10-17). **Draft — not published on Etsy and not for sale (K41).** Theme `nocturne-lake-estate`. Written from the common
skeleton in `docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the 01–21 listings and the design 23
listing (`collections/23_Velvet_Jewel_Box/package/listing/listing_v3.md`): every sentence answers a buyer question from docs/19 §3 and promises
only what the shared platform does today. Product language: English (US spelling). This design has no earlier listing: this is its first listing text.
Design facts come from `platform/themes/nocturne-lake-estate/` (README, theme.json, content.demo.json), `platform/lib/audio/catalog.ts`,
`platform/lib/print/layouts.ts`, `platform/lib/claim/demo-map.ts` and the sales-site copy in `platform/lib/marketing/designs.ts` ("Your guests tap
the envelope."). This design opens from an envelope (`openingObject` = "envelope").

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **Coming: the design is not open for sale** (tasarım satışa açılmadı, coming). `platform/lib/marketing/config.ts` lists it as `coming` with price `[PRICE]` (G142). This listing waits for the GPT artwork, an eye check and the sale decision. |
| Artwork | **Interim.** The envelope pieces are cut from one closed envelope picture (`themes/nocturne-lake-estate/build_images.py`, README "Opening — interim pieces"); the real parts (envelope without the seal, seal, open envelope, card, page background, accent, divider, web hero) and the PAKET 2 sample photos are ordered in `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md`. No listing image or video may be made before they arrive. [VERIFY: GPT parts built in; the opening re-read against the finished theme] |
| Start link `https://bkestudio.com/start?theme=nocturne-lake-estate` | **Not live**: the design is in the repository and has not been deployed. Not opened on a phone. [VERIFY: answers `200` and names "Design: Nocturne Lake Estate" after deploy] |
| Live demo `https://bkestudio.com/start/demo/nocturne-lake-estate` (in the description under TRY THE LIVE DEMO) | **Not live**, for the same reason. The demo opens this design's envelope with the sample couple Eleanor & Luca (fictional venue Villa Nocturne, Lake Como; September 18, 2027) and a demo map pin (Bellagio, `lib/claim/demo-map.ts`). [VERIFY: demo answers `200` with `data-theme="nocturne-lake-estate"` after deploy] |
| Current platform release (simpler editor K29, Headings & labels, thank-you page, guest password, RSVP v2) | Live on production since G079 (2026-10-15) for 01–20. This design needs the next deploy; its editor features were not tried in this task. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | As in the 01–21 listings: the records disagree (docs/10, docs/18 §4); not read in this task. The sentence keeps [VERIFY: manual order check on in production]. |
| Questions & answers, RSVP questions, menu, travel, registry | Platform features, the same for every design; checked in a local production build only (G142: theme-check `--stress`, final-smoke). **Not tried on the live site.** |
| Our Story gallery | Design-specific: one tall photo and two landscape frames with captions; each opens larger in a viewer (arrows, Escape). **Not tried** on the live site or on any phone. [VERIFY: gallery viewer on a real phone] |
| Music, map and directions, reply form with Excel and Google Sheets (G126–G128) | In the repository; **not on production yet** for this design and not tried on the live site. This design's default track is "Evening Strings" (`platform/lib/audio/catalog.ts`); opening sound effects (seal, paper, slide, chime) play only after the guest's tap. The 4 tracks were made in code and **nobody has listened to them on a real phone yet** (G126). The Google Sheets connection has not been tried with a real Google account (G128). |
| Printable invitation | Composed interim layout (`platform/lib/print/layouts.ts`): the lake scene with the gold seal, 5 × 7 in and A5. The design's own print artwork waits for GPT. Not tried on the live site. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** No phone check of any kind has been done for this design. |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). The listing says so. |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com** (shop-wide). |
| Response time, refund policy | Shop-wide, decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | `config.ts`: `[PRICE]` — not decided for this design (01–21: 1,460 TL, K42/K47; `tools/etsy_upload.py` carries 1,460 TL as the proposal and a blocker until the price is confirmed with the sale). No stock limit (999). Hosting extension, renewal and the Etsy listing URL are still open. |
| Design fonts and other languages | The theme loads Cinzel, Cormorant Garamond and Jost from Google Fonts (no font files). Subsets read from the Google Fonts CSS on 2026-10-17 (G175): Cinzel latin + latin-ext, Cormorant Garamond and Jost also Cyrillic. The language line in GOOD TO KNOW is written from this (Cyrillic only in some places). |
| Sample photos and artwork | **Interim.** The couple, lake and terrace pictures of the demo come from the Codex draft's GPT images; the PAKET 2 sample photos of Eleanor & Luca are ordered from GPT (K21). |
| START HERE guide | **Built** (G175): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 22`, from docs/19 Ek A; QR from `tools/make_qr.py`). Its start link is not live until the deploy. |
| Listing images and video | **Not made** (they need the GPT mockup scenes, `assets/gpt/GPT_PROMPTS.md` PAKET 3, and the real artwork). |
| Etsy rules (digital items, AI disclosure, title, tags, images, video) | **Not re-checked on Etsy's official pages in this task** (2026-10-17). Re-check them from the links in `00_ANA_DEVIR.md` §34 before publishing and write the date here. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence. `python3 tools/etsy_upload.py --check` checks the title, tags and text rules of this file; the files it lists as blockers (images, video) and every open VERIFY keep `ready_to_publish` false. This design also stays unpublished until its sales status leaves `coming` (K41).

## 1. Title

Etsy limit: 140 characters. This title: 118 characters.

```text
Nocturne Lake Estate Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Black Tie and Gold
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A black-tie wedding website that opens like a sealed black envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Black paper, champagne gold and candlelight by a lake at dusk. Your guests tap the envelope: the gold wax seal lifts away, the black flap opens and a charcoal card with your photo rises from the pocket. The card then opens into your pages: Home with your names over the lake at dusk, Our Story as a quiet photo gallery, Details with the evening hour by hour, and RSVP.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names):
https://bkestudio.com/start/demo/nocturne-lake-estate
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Nocturne Lake Estate design: envelope opening, Home, Our Story, Details and RSVP pages
• Your names in capitals over a lake at dusk, then your invitation beside your portrait, a countdown and add-to-calendar buttons on your Home page
• Our Story as an asymmetric gallery: one tall photo and two landscape frames with captions; each opens larger in a quiet viewer [VERIFY: gallery viewer on a real phone]
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay, a menu, registry buttons and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze; add a separate reception place if you need one [VERIFY: try on the live site]
• Soft background music on your Our Story page (this design starts with "Evening Strings", one of 4 tracks made for your website, or use your own MP3 or M4A file) and gentle sound effects as the envelope opens. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
• A QR code of your website (PNG or SVG) and a printable invitation (5×7 in or A5) to download [VERIFY: printable invitation with the design's own print artwork]
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
• Questions & answers (up to 12), dress code, travel & stay, menu and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "An evening by the lake" or "Kindly reply")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope opening animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed black envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/eleanor-and-luca); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet. On another device, your Etsy order number and email open your editor again.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters use the design's fonts, while Cyrillic and other alphabets show in a plain standard font in some or all places.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• If a guest's phone is set to reduce motion, the envelope opens with gentler movement. [VERIFY: reduced-motion behavior of the opening in the finished theme]
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters (counted below). Keyword choices are hypotheses (no search-volume data). No other company's brand name.
"lake como wedding" names a place, not a brand.

```text
wedding website
rsvp website
digital invitation
animated invitation
online rsvp
wedding rsvp
wedding invitation
black tie wedding
lake wedding
lake como wedding
black and gold
envelope invitation
italy wedding
```

Character counts: 15, 12, 18, 19, 11, 12, 18, 17, 12, 17, 14, 19, 13.

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
| Primary color | Black |
| Secondary color | Gold (or Beige, if Gold reads too yellow next to the champagne #E0C7A4) |
| Style / theme | Classic, Elegant (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (built 2026-10-17, G175; Etsy: up to 5 files, 20 MB each) |
| Price | `[PRICE]` — not decided for this design (`config.ts`: `coming`; 01–21: 1,460 TL). Shop currency TRY (K38) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | [SHOP SECTION] (the user's choice, docs/20 §3) |
| Renewal | [AUTO RENEW: yes/no] |

Palette for reference (`designs.ts`): night #11120F, charcoal #1C1D15, champagne #E0C7A4, gold #C7A978.

## 5. Images and alt text

**Not produced.** Planned set: the editorial layout of `docs/21_ILAN_GORSELLERI.md` (`python3 tools/listing_editorial.py --theme nocturne-lake-estate` once the GPT parts and the mockup scenes exist): 1 cover (the sealed black envelope on a phone), 2 the opening (envelope closed · seal lifting and flap opening · the charcoal card rising), 3 every page, 4 the editor, 5 RSVP and guest list, 6 details, 7 three steps, 8 what is included, 9 continue on any device. Images 1, 2, 4 and 8 need this design's GPT mockup scenes (`assets/gpt/mockups/`, PAKET 3 of `GPT_PROMPTS.md`), image 7 the shop-wide linen scene (`brand/trust/t1_three_steps.png`). No image may carry a QR code or a web address (Etsy Off-Platform policy, docs/15 §4.1). Alt texts are written against the finished files, not before.

## 6. Video

**Not produced.** Planned: `package/listing/video.mp4` (`python3 tools/listing_editorial.py --theme nocturne-lake-estate --capture --video`): the envelope opening recorded from the real website (sample names): the sealed black envelope, the gold seal lifting away, the flap opening and the charcoal card rising from the pocket into the home page. Silent, square (1080 × 1080, H.264), 5–15 seconds, starting and ending on the closed envelope so Etsy's loop has no black flash. [VERIFY: Etsy video rules in the listing editor]

## 7. FAQ (end of the description, or the shop FAQ)

**Do I need Canva or an app?**
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

**How do I start after buying?**
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number. You can also use the start link in our Etsy message.

**Do I need an account or a password?**
No. You get a private edit link that opens your editor. Save it right away; we cannot email it to you yet. On another device, your Etsy order number and email open your editor again.

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

**Is there music?**
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website (this design starts with "Evening Strings") or your own MP3 or M4A file, and gentle sound effects as the envelope opens. You can turn music or sound effects off, and guests can mute the sound with one tap.

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
the design chooser `https://bkestudio.com/start` (docs/19 §4.4). The START HERE PDF carries this design's own link. Both texts
are already entered in Shop Manager (docs/20 §7.1) and need no change for this design. Until this design is deployed and open on `/start`, a buyer
could not find it in the chooser: one more reason it stays unpublished.

## 9. After the sale

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them). Rules: the edit link is sent only with
`new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit link; one review request per order, the same
text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- Opening: a sealed black envelope with a gold wax seal and a charcoal card (envelope, like most designs); black-tie wording ("A black-tie wedding website").
- Design-specific lines: names in capitals over the lake at dusk, the asymmetric Our Story gallery with its viewer (VERIFY until tried on a real phone).
- Default music named ("Evening Strings"); the rest of the music text is the shared platform text.
- Language line from the fonts the theme loads (Cinzel, Cormorant Garamond, Jost), subsets read on 2026-10-17.
- Status table dated 2026-10-17: design not deployed and not for sale (K41), start link and demo not live, price open, interim artwork, no images, video or mockups yet; START HERE guide built.

## 11. Before you publish this listing

- [ ] Sales status leaves `coming` (K41 lifted by the user) and the design is open on `/start` in production
- [ ] GPT parts and sample photos built into the theme; description, §5 and §10 re-read against `platform/themes/nocturne-lake-estate/`
- [ ] Start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; the QR in START_HERE.pdf scanned with a phone camera
- [ ] Questions & answers, RSVP questions, menu, travel and registry tried on the live site with this design
- [ ] Our Story gallery and its viewer tried on a real phone, and the opening with reduced motion on
- [ ] Music, map and directions, the reply form and Excel download tried on the live site; the 4 tracks (including "Evening Strings") listened to and approved; Google Sheets connected with a real Google account
- [ ] Manual order check confirmed on in production (`CLAIM_ORDER_VERIFICATION=manual`), or the order sentence removed
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale (or a permanent redirect committed); START_HERE.pdf and its QR rebuilt
- [ ] Price ([PRICE]) decided with the sale and filled in (config.ts and §4)
- [ ] Hosting extension and renewal decided
- [ ] GPT mockup scenes made (PAKET 3); images (editorial set) and video produced; alt texts written against them
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked on the official pages (`00_ANA_DEVIR.md` §34) and in the listing editor (title, tags, images, video, AI disclosure, "Designed by"), with the date written in §0
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file

<!-- listing-kit:media -->
