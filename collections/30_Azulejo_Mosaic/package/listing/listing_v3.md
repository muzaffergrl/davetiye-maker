# Etsy listing v3: Azulejo Mosaic Wedding Website (design 30)

Internal listing kit for the seller (G169, 2026-10-17). **Draft — not published on Etsy (K41), and the design is not on sale
yet** (`platform/lib/marketing/config.ts`: `coming`). Theme `azulejo-mosaic`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the 01–21 listings (G123, G132, G137):
every sentence answers a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling).
This design has no earlier listing: this is its first listing text. Design facts come from `platform/themes/azulejo-mosaic/` (theme.json,
index.html, home.html, story.html, details.html, rsvp.html) and `platform/lib/marketing/designs.ts` (sales-site copy `azulejo-mosaic`, G169);
the description below keeps to that copy.

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **Coming: the design is not open for sale** (tasarım satışa açılmadı, coming). `platform/lib/marketing/config.ts` lists it as `coming` with price `[PRICE]`. This listing waits for the artwork, an eye check and the sale decision. |
| Design artwork | **Interim.** The design's own GPT parts (four azulejo tiles: corner, border and two field tiles; terracotta tile back, cobalt wall, whitewash plaster, card paper, tile frieze, terracotta pots, share image, sample photos, print grounds) are ordered in `assets/gpt/GPT_PROMPTS.md` and do not exist yet. Today the tiles are cut from design 05's painted border. No listing image or video may be made before the parts are in and the theme has been looked at again. |
| Sale-site copy | Written (`designs.ts` `azulejo-mosaic`, G169) against the theme as built; it describes the interim tiles' behavior, not the final artwork. |
| Start link `https://davetiye-platform-five.vercel.app/start?theme=azulejo-mosaic` | **Not live**: the design is in the repository and has not been deployed; `/start?theme=azulejo-mosaic` is refused in production until it is `live`. Not opened on a phone. |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/azulejo-mosaic` (in the description under TRY THE LIVE DEMO) | **Not deployed.** Sample couple Inês & Mateo, Quinta da Andorinha Azul, Sintra, June 5, 2027 (fictional). Not opened on the live site or a phone. |
| Platform features (editor, RSVP questions, Excel / Google Sheets, music, map, guest password, thank-you page, languages) | The same for every design; see the 01–21 listings for their live status. Not tried for this theme on the live site. |
| Music and opening sounds | Default track Garden Waltz. Opening sounds: a soft tap when the panel is pressed, a whoosh as the tile wave starts, a slide as the card lifts, a chime. The 4 tracks were made in code and nobody has listened to them yet (G126). |
| Printable invitation | **Interim layout**: card paper with a row of the theme's tiles at the top and bottom. The design's own print grounds (PAKET 6) are pending. |
| Manual order check (`CLAIM_ORDER_VERIFICATION=manual`) | As in the 01–21 listings: the records disagree (docs/10, docs/18 §4); not read in this task. The sentence keeps [VERIFY: manual order check on in production]. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Reduced motion | Not checked for this theme in this task (the FAQ line on reduced motion is kept out until it is). |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). |
| Web address | `davetiye-platform-five.vercel.app` is temporary: choose the final domain before the first sale. |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | `config.ts`: `[PRICE]` — not decided for this design (01–21: 1,460 TL, K42/K47). No stock limit (999). |
| Design fonts and other languages | The theme loads **Arizonia** (names, headings) and **Cormorant Upright** (text) from Google Fonts. Subsets **not confirmed in this task**: the Google Fonts CSS fetched on 2026-10-17 carried no subset labels and fonts.google.com could not be reached. Expected (from the family listings, not checked): Arizonia latin + latin-ext; Cormorant Upright latin + latin-ext + vietnamese; neither has Cyrillic. [VERIFY: subsets in the live Google Fonts CSS] |
| Etsy and platform rules | Not re-checked on Etsy's official pages in this task (00_ANA_DEVIR.md §34). Re-check before publishing and write the date here. |
| START HERE guide | **Built** (G175, 2026-10-17): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 30`, from docs/19 Ek A; QR only from `tools/make_qr.py`; `--check` passes). Its start link answers only after this design is deployed; rebuild it if Ek A or the domain changes. |
| Listing images and video | **Not made** — they wait for the GPT parts (no image of the interim look is to be sold). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 116 characters.

```text
Azulejo Mosaic Wedding Website with RSVP, Tile Wall Opening Digital Invitation, Online Editor, Cobalt Blue and White
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens behind a wall of painted tiles, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Cobalt and white painted azulejo tiles, warm terracotta and sunlit whitewash. Your guests tap the tile panel on its deep cobalt wall: the tiles turn over one by one in a wave that starts where they touched, each showing its terracotta back as it lifts away, and the card that was behind them, with your photo, names and date, comes forward to become your home page. Then your invitation follows: Home, Our Story, Details and RSVP, where every photo is uncovered tile by tile as guests scroll to it.

TRY THE LIVE DEMO
See the tiles turn on your own phone before you buy (sample names):
https://davetiye-platform-five.vercel.app/start/demo/azulejo-mosaic
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Azulejo Mosaic design: tile wall opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required. When a guest sends a reply, the thank-you is revealed tile by tile [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay, a menu, up to 10 "good to know" notes, registry and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze [VERIFY: try on the live site]
• Soft background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and gentle sound effects as the tiles turn. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
• A printable invitation in the same design (5 × 7 in or A5, with an optional back side and QR code) to download from your editor [VERIFY: the design's own print artwork made; try on the live site]
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
• Questions & answers, dress code, travel & stay, menu, good-to-know notes and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "Laid tile by tile, sent with love" or "Moments we hold dear")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the tile animation.

WHAT YOUR GUESTS SEE
Your link opens a wall of blue-and-white tiles. One tap turns the tiles over and opens your pages. Guests watch your photos appear tile by tile, reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/ines-and-mateo); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; the design's fonts cover Western and Central European accents, other alphabets show in a plain standard font. [VERIFY: subsets in the live Google Fonts CSS]
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters (checked: the longest, "cobalt blue wedding" and "destination wedding", are 19). Keyword choices are hypotheses (no search-volume data). No other company's brand name.

```text
wedding website
rsvp website
digital invitation
online rsvp
wedding rsvp
wedding invitation
azulejo wedding
portuguese wedding
blue white wedding
cobalt blue wedding
tile invitation
terracotta wedding
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
| Primary color | Blue |
| Secondary color | White |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` — **not built yet** |
| Price | `[PRICE]` — not decided for this design (`config.ts`: `coming`) |
| Quantity | 999, Etsy's maximum [VERIFY: whether Etsy lowers a digital listing's quantity on each sale] |
| Shop section | [SHOP SECTION] (the user's choice, docs/20 §3) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not made.** The 8 editorial images (`python3 tools/listing_editorial.py --theme azulejo-mosaic`, rules in `docs/21_ILAN_GORSELLERI.md`)
wait for the real artwork (GPT_PROMPTS.md PAKET 5 + PAKET 2) and this design's GPT mockup scenes. Planned set, the same order as 01–21:
1 cover (the closed tile panel on the cobalt wall on a phone), 2 opening (tile panel · tiles turning in a wave with their terracotta
backs · card forward), 3 pages, 4 edit, 5 RSVP (reply card under the tile frieze + guest list), 6 details (order of the day on the white
card, venue photo uncovered tile by tile), 7 how it works, 8 what is included. No image may carry a QR code or a web address
(docs/15 §4.1). Alt texts are written against the files once they exist.

## 6. Video

**Not made.** `package/listing/video.mp4` (12 s square loop of the tile wave, `--video`), recorded from the real website with sample
names, silent, the last frames returning to the closed panel so Etsy's loop has no black flash, waits for the real artwork.
[VERIFY: Etsy video rules in the listing editor]

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

**Can guests skip the opening?**
Yes. Guests can tap "Skip" at any time and go straight to your home page. [VERIFY: try on the live site]

**Is there music?**
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and gentle sound effects as the tiles turn. You can turn music or sound effects off, and guests can mute the sound with one tap.

**Can guests find the venue?**
Yes. Your Details page can show a map of the venue (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze. If the reception is somewhere else, add it as a second place.

**Can I add a password?**
Yes, optional: one shared password that you send to your guests with the link.

**How long does my website stay online?**
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page.

**Can I use my own domain?**
Not at the moment. Your address is your names on our web address.

**Is anything printed or shipped?**
No. It is a digital product. You can download a printable invitation and print it yourself.

## 8. Etsy's automatic messages (shop-wide, the same for every design)

Etsy's "Message to Buyers for Digital Items" applies to every digital listing, so it cannot carry this design's own start link: it links
the design chooser `https://davetiye-platform-five.vercel.app/start` (docs/19 §4.4). The START HERE PDF carries this design's own link. Both
texts are already entered in Shop Manager (docs/20 §7.1; full text in `collections/28_Maison_Patisserie/package/listing/listing_v3.md` §8)
and need no change for this design.

## 9. After the sale

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the same for every design; the admin panel reads them).
Rules: the edit link is sent only with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit
link; one review request per order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- A new design (G169, docs/24 wave 2), not on the live site, not open for sale (`coming`) and still on interim artwork (tiles cut from
  design 05's border): no images, no video and no START HERE guide yet.
- The closed object is a tile panel, not an envelope: "opens behind a wall of painted tiles", "the tiles turn over one by one",
  "the tile animation". Photos are uncovered tile by tile on scroll, and the RSVP thank-you is revealed tile by tile.
- Distinct from design 05 Mediterranean Lemon: no lemons anywhere in the copy; the palette words are cobalt, whitewash and terracotta.
- "What you can change" gives "Laid tile by tile, sent with love" / "Moments we hold dear", this design's own default headings, as examples.
- The FAQ has "Can guests skip the opening?" instead of an opening length: the length and the reduced-motion behavior were not measured for this theme.
- Language line written with a VERIFY: the font subsets were not confirmed in this task (§0).

## 11. Before you publish this listing

- [ ] GPT artwork made (GPT_PROMPTS.md PAKET 5, 2, 6) and built into the theme; eye check
- [ ] Sales-site copy (`designs.ts` `azulejo-mosaic`) and this listing re-read against the final artwork
- [ ] The user approves this design's sale and price (`config.ts`: `coming` → `live`)
- [ ] Design deployed; start link and demo of this design answer on the live site (`200`, design named)
- [ ] Start link and demo opened on a real phone; Skip and reduced motion tried
- [ ] START HERE guide written for this design (with the start QR)
- [ ] Questions & answers, RSVP questions, the tile-by-tile thank-you and the printable invitation tried on the live site
- [ ] Music, map and directions, the reply form and Excel download (G126–G128) live and tried on the live site
- [ ] Manual order check confirmed on in production, or the order sentence removed
- [ ] Font subsets read from the live Google Fonts CSS; language line kept or rewritten
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Final domain chosen before the first sale
- [ ] Price decided and filled in; quantity 999
- [ ] Listing images and video made; alt texts read against the files
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked on Etsy's official pages and in the listing editor (title, tags, images, video, AI disclosure, "Designed by"); date written in §0
- [ ] No VERIFY is left in this file
