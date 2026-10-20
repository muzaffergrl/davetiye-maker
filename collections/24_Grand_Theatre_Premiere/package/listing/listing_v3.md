# Etsy listing v3: Grand Theatre Premiere Wedding Website (design 24)

Internal listing kit for the seller (G162, 2026-10-17). **Draft — not published on Etsy (K41).** Theme `grand-theatre-premiere`, sales status `coming`. Written from the common skeleton in `docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure as the 01–21 listings: every sentence answers a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling). Design facts come from `platform/themes/grand-theatre-premiere/` (README, theme.json, index.html) and `platform/lib/marketing/designs.ts`. The title, the description, the tags and the alt texts never say "envelope": this design opens from a curtain (`openingObject` in `platform/lib/marketing/designs.ts`).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Design artwork | **Interim.** The theme runs on interim pieces toned from two existing textures; the painted curtain, gilded arch, programme card, ticket stub and sample photos are ordered in `assets/gpt/GPT_PROMPTS.md` and **do not exist yet**. Nothing in this listing may be published before they are in the theme and checked by eye. |
| Sales status | `coming` in `platform/lib/marketing/config.ts`: not on `/start`, not on the sales site in production. |
| Start link `https://bkestudio.com/start?theme=grand-theatre-premiere` | **Not live**: the design is not deployed and is `coming`. |
| Live demo `https://bkestudio.com/start/demo/grand-theatre-premiere` | **Not live** (same reason). Tried only on a local build (Chromium, phone size). |
| Questions & answers, RSVP questions, music, map and directions, Excel / Google Sheets, printable invitation, languages | Platform features, the same for every design; this theme carries every marker (local tests). **Not tried on the live site.** |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** The page-turn transition between pages needs cross-document view transitions (Chrome; Safari 18.2+); other browsers show a simpler page entrance. |
| Shop name, support email | K33: **BKE Studio**, **bkestudio@gmail.com**. |
| Price, quantity | [PRICE] — not decided for this design. Quantity 999 like the other designs once decided. |
| START HERE guide | **Built** (G175, 2026-10-17): `package/customer/START_HERE.md` + `.pdf` with the start QR (`python3 tools/build_customer_guides.py --designs 24`, from docs/19 Ek A; QR only from `tools/make_qr.py`; `--check` passes). Its start link answers only after this design is deployed; rebuild it if Ek A or the domain changes. |
| Listing images, video | **Not produced** (they need the GPT mockup scenes, `assets/gpt/GPT_PROMPTS.md` PAKET 3). |
| Design fonts and other languages | Abril Fatface and Playfair Display (both latin-ext, checked from their Google Fonts families). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 118 characters.

```text
Grand Theatre Premiere Wedding Website with RSVP, Curtain Opening Digital Invitation, Online Editor, Theater Black Tie
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like opening night, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

A peacock velvet curtain under an antique-gold arch. Your guests tap the curtain: the house lights dim, the two velvet panels part one after the other, and a spotlight sweeps the stage to your programme card. Then your invitation follows: Home, Our Story, Details and RSVP, turning like the pages of a theatre programme.

TRY THE LIVE DEMO
See the curtain rise on your own phone before you buy (sample names):
https://bkestudio.com/start/demo/grand-theatre-premiere [VERIFY: demo live]
Copy the link into your phone's browser.

WHAT YOU GET
• Your wedding website in the Grand Theatre Premiere design: curtain opening, Home, Our Story, Details and RSVP pages
• Our Story as an intermission: three photo cards on a dark stage, and a spotlight that lights the one your guest taps
• Your schedule as a theatre programme: Act I, Act II and on, with times and places (up to 10 rows)
• Online RSVP on a theatre ticket: when a guest sends the reply, the ticket stub tears off. Replies, head counts and up to 10 questions of your own [VERIFY: try on the live site]
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Download every reply as an Excel file (or CSV), or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons, a countdown to curtain-up, dress code, travel & stay, menu and registry, and up to 12 questions & answers
• A map of your venue and directions with Google Maps, Apple Maps or Waze [VERIFY: try on the live site]
• Soft background music on your Our Story page and gentle sound effects as the curtain opens; guests can mute with one tap [VERIFY: tracks listened to and approved]
• A printable invitation (5×7 in or A5, with bleed and crop marks) and a PDF copy of your website [VERIFY: print files checked with this design's final artwork]
• A QR code of your website, an optional guest password, and a thank-you page for after the wedding
• A START HERE guide (PDF) with your start link and every step explained
• Your website stays online until 12 months after your wedding date

HOW IT WORKS IN 3 STEPS
1. Start: download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number, email and first names. Your private draft is created right away.
2. Personalize: add your names, date and a photo in a short 3-step setup, then anything else whenever you like. Every change saves by itself.
3. Publish & share: tap Publish, then send your link by text, WhatsApp or email, or print the QR code. Guest replies appear in your editor.

WHAT YOU CAN CHANGE
• Your names, how they appear, date, ceremony time and time zone
• Venue, address, map and directions, and the programme of the evening (up to 10 acts)
• Your story: an intro line, three scene captions and its music
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers, dress code, travel & stay, menu and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "Reserve your seat" or "Curtain up in")
What stays as designed: the artwork, colors, fonts, page layout and the curtain opening animation.

WHAT YOUR GUESTS SEE
Your link opens on a closed velvet curtain. One tap raises it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start; it cannot be changed later. A custom domain is not included.
• Save your private edit link when it appears: it opens your editor.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free.
• Your guests can read the website in English, Spanish, German, French or Turkish if you turn those languages on; you approve the translation of your own texts. [VERIFY: languages (G144) live and tried]
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
animated invitation
online rsvp
theater wedding
theatre wedding
broadway wedding
curtain invitation
black tie wedding
vintage wedding
peacock wedding
art nouveau wedding
```

## 4. Category and attributes

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category) [VERIFY: in the listing editor] |
| Type | Digital files |
| Who made it | I did [VERIFY: the "Designed by" option for designs made with AI image tools] |
| Occasion | Wedding |
| Primary color | Blue |
| Secondary color | Gold |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** |
| Price | [PRICE] |
| Quantity | 999 |

## 5. Images and alt text

**Not produced.** The 8-image editorial set (`tools/listing_editorial.py`, `docs/21_ILAN_GORSELLERI.md`) is made after the GPT parts are in the theme. Planned images and alt texts (to be read against the real files):

| # | File | Alt text (draft) |
|---|---|---|
| 1 | `01_cover.png` | Grand Theatre Premiere wedding website with online RSVP on a phone: a peacock velvet curtain under an antique-gold arch and the names Charlotte & Theodore |
| 2 | `02_opening.png` | It opens like opening night: three phones show the closed curtain, the panels parting with a spotlight, and the programme card on the stage |
| 3 | `03_pages.png` | Every page guests need: the programme card on the open stage, the intermission photos in a spotlight, the evening as acts, and the ticket RSVP |
| 4 | `04_edit.png` | Make every word yours: the online editor next to a list of what you change; the artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Reserve your seat: the RSVP form on a theatre ticket, its stub tearing off after a reply, and the couple's guest list with a Download Excel button |
| 6 | `06_details.png` | The evening as a theatre programme: Act I, Act II and on, with calendar buttons, the venue, and questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize, then publish and share one link |
| 8 | `08_included.png` | What is included: the curtain opening and four pages, your own online editor, online RSVP and guest list, printable invitation, QR code and START HERE guide |

## 6. Video

**Not produced.** Planned: the curtain opening recorded from the real website (sample names), square 1080 × 1080, silent, 10–15 s, first and last frame on the closed curtain.

## 7. FAQ

Same answers as the 01–21 listings (`collections/18_Wildflower_Vellum/package/listing/listing_v3.md` §7), with "curtain" for the opening object.

## 8. Etsy's automatic messages

Shop-wide, unchanged (docs/20 §7.1).

## 9. Before you publish this listing

- [ ] GPT parts (PAKET 5, 2, 6) produced, built into the theme and checked by eye; `config.ts` status `live` approved
- [ ] Price decided
- [ ] Start link and demo answer on the live site and open on a real phone
- [ ] START HERE guide, 8 images and video produced; alt texts read against them
- [ ] Every VERIFY above resolved; `python3 tools/etsy_upload.py --check` covers this design (add it to `DESIGNS` when it goes live)
