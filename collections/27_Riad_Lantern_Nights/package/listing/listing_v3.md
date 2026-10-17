# Etsy listing v3: Riad Lantern Nights Wedding Website (design 27)

Internal listing kit for the seller (G165, 2026-10-17). **Draft — not published on Etsy (K41) and the design is not on sale:**
its status is `coming` (`platform/lib/marketing/config.ts`) and its painted parts are still interim (see §0). Theme
`riad-lantern-nights`. Same structure as the 01–21 listings (`docs/19_ALICI_YOLCULUGU.md` §4): every sentence answers a buyer
question and promises only what the platform does today. Product language: English (US spelling). Design facts come from
`platform/themes/riad-lantern-nights/` (README, theme.json, index.html) and `platform/lib/marketing/designs.ts`. This design has
no earlier `listing.md`: this is its first listing text. It is not in `tools/etsy_upload.py` `DESIGNS` yet (add it when the
design goes live).

## 0. Status before publishing

| Item | Status on 2026-10-17 |
|---|---|
| Design status | **coming**: not on `/start` in production, not on the sales site. The opening and every page work in a local production build, but the doors, courtyard, card, wall and tiles are **interim** pieces cut from other designs' GPT images (`build_images.py`); this design's own parts are ordered in `assets/gpt/GPT_PROMPTS.md`. Do not publish before they are in and the design is `live`. |
| Start link `https://davetiye-platform-five.vercel.app/start?theme=riad-lantern-nights` | **Not live** (the design is `coming`; production does not have this theme yet). |
| Live demo `https://davetiye-platform-five.vercel.app/start/demo/riad-lantern-nights` (in the description under TRY THE LIVE DEMO) | **Not live** (same reason). Locally it renders (G165 tests). |
| Sample photos | **None yet** (PAKET 2 for the fictional couple Leila & Adrian is ordered). Screens would show neutral placeholders. |
| Questions & answers, RSVP questions, music, map and directions, Excel / Google Sheets | Platform features, the same for every design; see the 01–21 listings for their live-site status. **Not tried with this design on the live site.** |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** All phone checks are Chromium mobile emulation (theme README). |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself" (their own mail app). |
| Web address | `davetiye-platform-five.vercel.app` is temporary. |
| Shop name, support email | K33 (2026-10-15): **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | Decided on 2026-10-15 (docs/20 §6): 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Price not decided for this design** ([PRICE]; designs 01–21 sell at 1,460 TL). Quantity: 999, Etsy's maximum (the shop's rule for every design). |
| Design fonts and other languages | Cinzel, Marcellus SC and Marcellus (Google Fonts). [VERIFY: latin-ext / Cyrillic coverage read from the Google Fonts CSS of these three families before the language line in GOOD TO KNOW is final] |
| START HERE guide | **Not produced** for this design (`python3 tools/build_customer_guides.py` once it is live). |
| Listing images and video | **Not produced.** They must show real screens of this design with its own GPT parts (K21, docs/21), so they wait for PAKET 5 and PAKET 2. |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 109 characters.

```text
Riad Lantern Nights Wedding Website with RSVP, Cedar Door Opening Digital Invitation, Online Editor, Moroccan
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens like a pair of real doors, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Carved cedar double doors in a night-teal courtyard wall, a brass lantern's warm glow and zellige tiles in teal, saffron and ivory. Your guests tap the doors: the two leaves swing into the courtyard, lantern light pours out and an ivory card with your photo comes forward through the doorway. Your invitation follows: Home, Our Story, Details and RSVP.

TRY THE LIVE DEMO
See the doors open on your own phone before you buy (sample names):
https://davetiye-platform-five.vercel.app/start/demo/riad-lantern-nights
Copy the link into your phone's browser. [VERIFY: demo live and showing this design's final parts]

WHAT YOU GET
• Your wedding website in the Riad Lantern Nights design: the door opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page [VERIFY: real iPhone Safari and Android Chrome]
• Online RSVP: replies, head counts and up to 10 questions of your own (choices, yes/no, short or long answer, number); you choose which fields are required [VERIFY: try on the live site]
• Download every reply as an Excel file (or CSV) in one tap, or connect a Google Sheet that updates with every new reply [VERIFY: Google Sheets connection tested live]
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping (a portrait and three tall window photos for your story, plus the venue), a countdown, dress code, travel & stay and registry buttons, and up to 12 questions & answers [VERIFY: try on the live site]
• A map of your venue on the Details page (Google Maps loads only when a guest taps it) and directions with Google Maps, Apple Maps or Waze [VERIFY: try on the live site]
• Soft background music on your Our Story page (one of 4 tracks made for your website, or your own MP3 or M4A file) and gentle sound effects as the doors open. Turn either off if you like; guests can mute the sound with one tap [VERIFY: tracks listened to and approved; try on the live site]
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
• The design's headings, labels and buttons, in your own words (for example "Beyond the cedar doors" or "Kindly respond")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the door animation.

WHAT YOUR GUESTS SEE
Your link opens a pair of closed cedar doors. One tap opens them into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/leila-and-adrian); it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime. [VERIFY: manual order check on in production]
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language. [VERIFY: which alphabets the design's fonts cover, §0]
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
online rsvp
wedding rsvp
wedding invitation
moroccan wedding
riad wedding
lantern wedding
destination wedding
marrakech wedding
teal and saffron
evening wedding
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
| Primary color | Blue (teal) |
| Secondary color | Orange (saffron) |
| Style / theme | Romantic, Bohemian or Mediterranean, whichever Etsy offers (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** for this design |
| Price | [PRICE] (not decided for this design) |
| Quantity | 999, Etsy's maximum |
| Shop section | [SHOP SECTION] (the user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not produced.** Planned set (the 8-image editorial layout of `docs/21_ILAN_GORSELLERI.md`, real screens only, no QR code or web
address in any image): 1 cover (the closed doors on a phone), 2 the opening (doors closed · leaves swinging in · the card in the
lantern light), 3 every page, 4 the editor, 5 RSVP and guest list, 6 details, 7 three steps, 8 what is included. Alt texts are
written against the finished files, not before.

## 6. Video

**Not produced.** Planned: the door opening recorded from the real website (sample names), silent, square 1080 × 1080, under 15 s,
starting and ending on the closed doors (the same pipeline as the 01–21 videos: `python3 tools/listing_editorial.py --theme
riad-lantern-nights --video`). [VERIFY: Etsy video rules in the listing editor]

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
Yes, if you like: soft music on your Our Story page, from 4 tracks made for your website or your own MP3 or M4A file, and gentle sound effects as the doors open. You can turn music or sound effects off, and guests can mute the sound with one tap.

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

Already entered in Shop Manager (docs/20 §7.1); they link the design chooser `https://davetiye-platform-five.vercel.app/start` and need
no change for this design (see the 01–21 listings §8 for the text).

## 9. After the sale

Messages for each situation are in `docs/19_ALICI_YOLCULUGU.md` §4.5 (the admin panel reads them). Rules: the edit link is sent only
with `new_edit_link`, inside this order's Etsy conversation; no message asks the buyer for their edit link; one review request per
order, the same text for everyone, never with an incentive.

## 10. What differs from the 01–21 listings

- The closed object is a pair of doors, not an envelope: "opens like a pair of real doors", "the door opening", "a pair of closed
  cedar doors"; no envelope is described anywhere else in this listing.
- No sample photos are promised in the demo line ("sample names") until PAKET 2 is in.
- Price and shop section are open for this design.

## 11. Before you publish this listing

- [ ] This design's PAKET 5 parts and PAKET 2 photos in, theme rebuilt, eye-checked, status `live` (config.ts)
- [ ] Start link and demo of this design answer on the live site and on a real phone
- [ ] START HERE guide written for this design (`package/customer/START_HERE.md` + `.pdf` with the start QR)
- [ ] Images (editorial set) and video produced from real screens; alt texts written against them
- [ ] Price decided; shop section chosen
- [ ] Fonts' alphabets checked (§0) and the language line finalised
- [ ] Design added to `tools/etsy_upload.py` `DESIGNS`; `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file
