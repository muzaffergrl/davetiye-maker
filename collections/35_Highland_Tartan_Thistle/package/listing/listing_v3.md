# Etsy listing v3: Highland Tartan & Thistle Wedding Website (design 35)

Internal listing kit for the seller (G184, 2026-10-18). **Draft — not published on Etsy (K41), and the design is not on sale
yet** (`platform/lib/marketing/config.ts`: `coming`). Theme `highland-tartan-thistle`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure as the 01–32 listings: every sentence answers
a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling).
Design facts come from `platform/themes/highland-tartan-thistle/` (README, theme.json, index.html). The sales-site copy in
`platform/lib/marketing/designs.ts` (G184, with translations) is written against the theme as built; re-read it when the GPT
parts are in.

## 0. Status before publishing

| Item | Status on 2026-10-18 |
|---|---|
| Design artwork | **Interim.** The design's own GPT parts (tartan wool, cream paper, moss ground, oil-painted hills, mist, the envelope's back, pocket and flap, leather strap, brass buckle, heather sprig and florets, locket rim and lid, thistle, card, share image) and sample photos are ordered in `assets/gpt/GPT_PROMPTS.md` and do not exist yet. The theme runs on toned plain textures (no tartan yet), a plain brass crop and a blurred mist. No listing image or video may be made before the parts are in and the theme has been looked at again. |
| Sale status | `coming` in `platform/lib/marketing/config.ts`: not on the sales site, and `/start?theme=highland-tartan-thistle` is refused in production until it is `live`. |
| Start link `https://bkestudio.com/start?theme=highland-tartan-thistle` | **Not live** (design in review). Not deployed in this task. |
| Live demo `https://bkestudio.com/start/demo/highland-tartan-thistle` | Works in a local production build (2026-10-18, G184). **Not deployed**; not opened on the live site or a phone. |
| Platform features (editor, RSVP questions, Excel / Google Sheets, music, map, guest password, thank-you page, languages) | The same for every design; see the 01–20 listings for their live status. Tried for this theme only in the local build's automated checks (theme-check, G184). |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself". |
| Web address | `bkestudio.com` (primary since 2026-10-19; the earlier `xn--bkestudo-zkb.com` (bkestudıo.com) links redirect here with a permanent 308). G190 (2026-10-20) moved the start link, demo, START HERE guide and QR codes to this address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33: **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | docs/20 §6: 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Open** — `[PRICE]`. Quantity 999 like the other designs. |
| Design fonts and other languages | From the Google Fonts families this theme loads (2026-10-18, by family listing; not re-read from the live CSS in this task): Rouge Script (latin, latin-ext), Sorts Mill Goudy (latin, latin-ext). [VERIFY: subsets in the live Google Fonts CSS] |
| START HERE guide | **Not built** for this design yet (`python3 tools/build_customer_guides.py --designs 35` once the design is registered there). |
| Listing images and video | **Not produced** — they wait for the GPT parts (no image of the interim look is to be sold). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 127 characters.

```text
Highland Tartan & Thistle Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, Heather and Moss Green
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens from a tartan wool envelope over the misty Highland hills, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Heather, moss green and cream, warm leather and antique brass. Your guests tap the envelope: the brass buckle opens, the leather strap slides away, the wool flap swings up while the mist over the hills draws off, and a card with your photo rises out. Then your invitation follows: Home, Our Story, Details and RSVP, where your photos sit in antique brass lockets whose lids swing open as guests scroll.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names):
https://bkestudio.com/start/demo/highland-tartan-thistle
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Highland Tartan & Thistle design: envelope opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, dress code, travel & stay, a menu, up to 10 "good to know" notes, registry and up to 12 questions & answers
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze
• Soft background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and soft sounds as the envelope opens. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved]
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
• Venue, address, map and directions, and the order of the day (up to 10 rows)
• Your story: an intro line, three captions and its music (one of 4 tracks, your own file or none)
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers, dress code, travel & stay, menu, good-to-know notes and registry links
• RSVP deadline and your reply form: required or optional fields and up to 10 questions of your own
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Kindly reply")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the opening animation.

WHAT YOUR GUESTS SEE
Your link opens the closed, strapped envelope. One tap opens it and leads into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/isla-and-callum); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Your website can also show in Spanish, German, French or Turkish; texts you write yourself are translated only when you approve them [VERIFY: languages live on production]. Accented Latin letters use the design's fonts; Cyrillic and other alphabets show in a plain standard font.
• Colors and fonts do not change. Music plays only on your Our Story page, and some phones wait for a guest's tap before it starts. Upload only music you have the right to use.
• The design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting] Sample names, dates, places and photos are fictional.
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
online rsvp
wedding rsvp
wedding invitation
scottish wedding
tartan wedding
highland wedding
thistle wedding
heather wedding
rustic elegant
moss green and gold
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
| Primary color | Purple |
| Secondary color | Green |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** |
| Price | **[PRICE]** (not decided) |
| Quantity | 999, Etsy's maximum |
| Shop section | [SHOP SECTION] (user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not produced.** They are made after the GPT parts are in the theme (same pipeline as 01–20: `python3 tools/listing_editorial.py --theme highland-tartan-thistle`, rules in `docs/21_ILAN_GORSELLERI.md`; real screens of the theme, no QR code or web address in an image). Planned set and alt-text drafts (rewrite against the real files):

| # | File | Alt text (draft) |
|---|---|---|
| 1 | `01_cover.png` | Highland Tartan & Thistle wedding website with online RSVP on a phone: the strapped tartan envelope over misty hills and the names Isla & Callum |
| 2 | `02_opening.png` | The envelope opens: phones show the buckle opening, the strap sliding away, the wool flap swinging up as the mist draws off, and the card rising out |
| 3 | `03_pages.png` | Every page guests need, on five phone screens: home with a countdown, our story with brass locket photo frames, the invitation, the order of the day and the RSVP page |
| 4 | `04_edit.png` | Make every word yours: the online editor on a phone, next to a list of what you change. The artwork, colors and fonts stay as designed |
| 5 | `05_rsvp.png` | Every reply in one place: the guest's RSVP form and the couple's guest list with a Download Excel button |
| 6 | `06_details.png` | Everything guests ask: the order of the day with add-to-calendar buttons, the venue, the map and questions and answers |
| 7 | `07_how.png` | Three simple steps: start with your Etsy order number, personalize, then publish and share one link |
| 8 | `08_included.png` | What is included: the envelope opening and four pages, your own online editor, online RSVP, QR code and START HERE guide |

## 6. Video

**Not produced** (after the GPT parts): the envelope opening recorded from the real website (sample names), silent, square,
5–15 s, the last frames dissolving back into the closed envelope so Etsy's loop has no black flash. [VERIFY: Etsy video rules in the listing editor]

## 7. FAQ (end of the description, or the shop FAQ)

**Do I need Canva or an app?**
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

**How do I start after buying?**
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number.

**Do I need an account or a password?**
No. You get a private edit link that opens your editor. Save it right away; we cannot email it to you yet.

**What if I lose my edit link?**
If your editor is still open, copy it again under Share. Otherwise message us on Etsy with your order number: we send you a new link and the old one stops working.

**Can I change things after I publish?**
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

**Can I change the headings and wording?**
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

**How do my guests reply?**
On your RSVP page, with no app or account. You choose which fields are required and can add up to 10 questions of your own, and download every reply as an Excel file (or CSV).

**How many guests can I invite?**
As many as you like. One reply can include up to 10 people.

**Is the opening very long?**
About four seconds, and guests can tap "Skip" at any time. On phones set to reduce motion it goes straight to your home page.

**Can guests find the venue?**
Yes. Your Details page can show a map of the venue and directions with Google Maps, Apple Maps or Waze.

**How long does my website stay online?**
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page.

**Is anything printed or shipped?**
No. It is a digital product. You can download a printable invitation and print it yourself.

## 8. Etsy's automatic messages

Shop-wide, the same for every design (see `collections/15_Cherry_Blossom/package/listing/listing_v3.md` §8 and docs/20 §7.1); no change for this design.

## 9. After the sale

Messages for each situation: `docs/19_ALICI_YOLCULUGU.md` §4.5 (the same for every design).

## 10. What differs from the 01–20 listings

- The envelope is not the V flap and wax seal of 01–21: a tartan wool envelope with a straight flap, held shut by a leather strap through a brass buckle ("the brass buckle opens, the leather strap slides away, the wool flap swings up"); the mist over the hills is part of the opening.
- Photos sit in brass lockets whose lids swing open (not frames that fade in).
- The languages line follows G144 (five languages) instead of "built-in messages are in English" [VERIFY].
- The printable invitation (G139) is named, with a VERIFY until the design's own print sheets (PAKET 6) are in.

## 11. Before you publish this listing

- [ ] GPT parts (PAKET 5, PAKET 2, PAKET 6) in the theme, the theme looked at again, `config.ts` status `live` (integrator)
- [ ] Sales-site copy in `platform/lib/marketing/designs.ts` re-read against the theme with its GPT parts (+ translations)
- [ ] Start link and demo answer on the live site and on a real phone
- [ ] START HERE guide built for this design (`package/customer/`, `tools/build_customer_guides.py`)
- [ ] Price decided and filled in
- [ ] Images and video produced; alt texts read against them
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file
