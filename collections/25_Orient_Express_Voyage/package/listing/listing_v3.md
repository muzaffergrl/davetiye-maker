# Etsy listing v3: Orient Express Voyage Wedding Website (design 25)

Internal listing kit for the seller (G163, 2026-10-17). **Draft — not published on Etsy (K41).** Theme `orient-express-voyage`.
Written from the common skeleton in `docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure and wording as the
01–21 listings (G123, G132, G137): every sentence answers a buyer question from docs/19 §3 and promises only what the platform does
today. Product language: English (US spelling). This design has no earlier listing. Design facts come from
`platform/themes/orient-express-voyage/` (README, theme.json, templates) and `platform/lib/marketing/designs.ts` (G163).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Sale status | **Coming: the design is not open for sale** (tasarım satışa açılmadı, coming). `platform/lib/marketing/config.ts` lists it as `coming` with price `[PRICE]`. This listing waits for the sale decision. |
| GPT artwork | **Not made yet.** The theme runs on interim flat palette tones (wallet, ticket, poster, map, tag, clock, stamp, boarding pass); every part is ordered in `assets/gpt/GPT_PROMPTS.md` (PAKET 5, 2, 6). No listing image or video can be made before they arrive. |
| Start link `https://davetiye-platform-five.vercel.app/start?theme=orient-express-voyage` | **Not live**: the design is on branch `claude/g163-orient-express`, not deployed. Opened only in a local production build (2026-10-17, G163). |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/orient-express-voyage` | **Not live**, for the same reason. Locally the demo opens the ticket wallet with the fictional couple Amelia & Rafael. |
| Sample photos | **None yet** (PAKET 2 ordered). The demo shows placeholders. |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All checks so far are Chromium mobile emulation. |
| Shop name, support email, response time, refund policy | As 01–21: BKE Studio, bkestudio@gmail.com (K33), 24 hours, no returns with a promise to fix (docs/20 §6). |
| Price, quantity | `config.ts`: `[PRICE]` — decided with the sale approval. Quantity 999 like the other designs. |
| START HERE guide | **Built** (G175, 2026-10-17): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 25`, from docs/19 Ek A; QR only from `tools/make_qr.py`; `--check` passes). Its start link answers only after this design is deployed; rebuild it if Ek A or the domain changes. |
| Listing images and video | **Not produced** (they need the GPT parts and sample photos). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 118 characters.

```text
Orient Express Voyage Wedding Website with RSVP, Ticket Wallet Opening, Digital Invitation, Vintage Train Travel Theme
```

## 2. Description

Paste from the line below.

---

A wedding website that opens like a first-class ticket wallet, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Bottle green, brass and ivory, in the style of an old travel poster. Your guests tap a leather ticket wallet: the strap unbuckles, the cover swings open and a first-class ticket with your photo slides out of its pocket. Then your invitation follows: Home with your names over the poster and a swinging luggage tag, Our Story in carriage windows, the day as stations along a route that draws itself across an antique map, and RSVP on a boarding pass that gets a stamp.

TRY THE LIVE DEMO
See the ticket wallet open on your own phone before you buy (sample names):
https://davetiye-platform-five.vercel.app/start/demo/orient-express-voyage
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Orient Express Voyage design: ticket-wallet opening, Home, Our Story, Details (the itinerary) and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze; add a separate reception place if you need one [VERIFY: try on the live site]
• Soft background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and gentle sound effects as the invitation opens. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
• A QR code of your website (PNG or SVG) for printed cards and signs
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
• The design's headings, labels and buttons, in your own words (for example "All aboard" or "Stations of the day")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the ticket-wallet animation.

WHAT YOUR GUESTS SEE
Your link opens a leather ticket wallet held shut by its strap. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/amelia-and-rafael); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters use the design's fonts (Limelight, the heading font, has Latin letters only), other alphabets a plain standard font. [VERIFY: font coverage read from the Google Fonts CSS]
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The painted design elements and the sample photos will be made with AI image tools from our own descriptions, then edited and assembled by us (they are not made yet, see §0). [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
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
train wedding
travel wedding
vintage travel
destination wedding
online rsvp
wedding rsvp
ticket invitation
boarding pass rsvp
green wedding
art deco wedding
```

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did [VERIFY: the "Designed by" option for designs made with AI image tools] |
| What is it | A finished product |
| Occasion | Wedding |
| Primary color | Green |
| Secondary color | Gold |
| Style / theme | Vintage, Travel (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/` (not built yet) |
| Price | `[PRICE]` (sale and price not approved; `config.ts`) |
| Quantity | 999 |
| Shop section | [SHOP SECTION] (the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

Not produced: the 8 editorial images (`python3 tools/listing_editorial.py --theme orient-express-voyage`, rules in
`docs/21_ILAN_GORSELLERI.md`) need this design's GPT parts and PAKET 2 sample photos. Planned alt texts (to be read against the files):

| # | File | Alt text (draft) |
|---|---|---|
| 1 | `01_cover.png` | Orient Express Voyage wedding website with online RSVP on a phone: the opening page with a bottle-green leather ticket wallet held by a brass-buckled strap and the names Amelia & Rafael |
| 2 | `02_opening.png` | It opens like a real ticket wallet: the strap unbuckles, the cover swings open and a first-class ticket slides out |
| 3 | `03_pages.png` | Every page guests need: the names over a vintage travel poster, the invitation with a luggage tag, carriage-window photos, the itinerary on an antique map and the boarding pass RSVP |
| 4 | `04_edit.png` | Make every word yours: the online editor on a phone. The artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Every reply in one place: the boarding-pass RSVP form and the couple's guest list with a Download Excel button |
| 6 | `06_details.png` | The day as stations along a route on an antique map, the venue photo with add-to-calendar buttons, dress code and questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize, then publish and share one link |
| 8 | `08_included.png` | What is included: the ticket-wallet opening and four pages, your online editor, online RSVP, QR code and START HERE guide |

## 6. Video

Not produced (needs the GPT parts). Plan: the ticket-wallet opening recorded from the real website, square 1080 × 1080, 12 s, silent,
looping back to the closed wallet (`python3 tools/listing_editorial.py --theme orient-express-voyage --video`).

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

**Is there music?**
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and gentle sound effects as the ticket wallet opens. You can turn music or sound effects off, and guests can mute the sound with one tap.

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

## 10. What differs from the 01–21 listings

- A new design (G163, docs/24 wave), not deployed and not open for sale (`coming`); its artwork is still interim.
- The guests' first view is a leather ticket wallet held by a strap (not an envelope); the opening object is "wallet" (as 12 Tropical,
  but here a portrait first-class rail ticket wallet with a strap and a book-like cover).
- The Details page is named "The itinerary" and shows the schedule as stations along a route line drawn over an antique map.
- RSVP is a boarding pass; a sent reply gets a boarding stamp.
- Language line: Limelight (headings) has Latin letters only. [VERIFY: font coverage]

## 11. Before you publish this listing

- [ ] GPT parts (PAKET 5), sample photos (PAKET 2) and print backgrounds (PAKET 6) made and built into the theme
- [ ] The user approves this design's sale and price (`config.ts`: `coming` → `live`)
- [ ] Design deployed; start link and demo answer on the live site (`200`, design named)
- [ ] START HERE guide built; its QR scanned with a phone camera
- [ ] Listing images and video produced; alt texts read against the files
- [ ] Buyer journey tried on a real iPhone (Safari) and Android phone (Chrome)
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file
