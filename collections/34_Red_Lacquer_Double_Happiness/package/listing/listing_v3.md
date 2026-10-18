# Etsy listing v3: Red Lacquer & Double Happiness Wedding Website (design 34)

Internal listing kit for the seller (G183, 2026-10-18). **Draft — not published on Etsy (K41), and the design is not on sale
yet** (`platform/lib/marketing/config.ts`: `coming`). Theme `red-lacquer-double-happiness`. Written from the common skeleton in
`docs/19_ALICI_YOLCULUGU.md` §4 (buyer journey, K32), with the same structure as the 01–20 listings: every sentence answers
a buyer question from docs/19 §3 and promises only what the platform does today. Product language: English (US spelling).
Design facts come from `platform/themes/red-lacquer-double-happiness/` (README, theme.json, index.html). The sales-site copy in
`platform/lib/marketing/designs.ts` (G183, with translations) is written against the theme as built; re-read it when the GPT
parts are in.

## 0. Status before publishing

| Item | Status on 2026-10-18 |
|---|---|
| Design artwork | **Interim.** The design's own GPT parts (lacquer, red paper, cream paper, gold leaf, envelope back, pocket and flap, paper buttons, red cord, gold-leaf 囍, the two paper-cut windows, card, gold clouds, moon gate, paper-cut border and layers, knot with tassel, share image) and sample photos are ordered in `assets/gpt/GPT_PROMPTS.md` and do not exist yet. The theme runs on toned plain textures and plain crops (the envelope is plain red paper, the windows plain red and gold halves, the 囍 a character of a typeface filled with gold leaf); there is no cord, cloud, moon gate frame or paper-cut pattern yet. No listing image or video may be made before the parts are in and the theme has been looked at again. |
| Sale status | `coming` in `platform/lib/marketing/config.ts`: not on the sales site, and `/start?theme=red-lacquer-double-happiness` is refused in production until it is `live`. |
| Start link `https://xn--bkestudo-zkb.com/start?theme=red-lacquer-double-happiness` | **Not live** (design in review). Not deployed in this task. |
| Live demo `https://xn--bkestudo-zkb.com/start/demo/red-lacquer-double-happiness` | Works in a local production build (2026-10-18, G183). **Not deployed**; not opened on the live site or a phone. |
| Platform features (editor, RSVP questions, Excel / Google Sheets, music, map, guest password, thank-you page, languages) | The same for every design; see the 01–20 listings for their live status. Tried for this theme only in the local build's automated checks (theme-check, G183). |
| Real phones (iPhone Safari, Android Chrome) | **Not tested.** |
| Edit link by email | **Not built.** The buyer copies the link or uses "Email it to myself". |
| Web address | `xn--bkestudo-zkb.com` (bkestudıo.com: bought and connected by the user, served by Vercel). G189 (2026-10-18) moved the start link, demo, START HERE guide and QR codes here from the earlier temporary Vercel address. [VERIFY: the start link answers 200 on a phone on this address before the first sale] |
| Shop name, support email | K33: **BKE Studio**, **bkestudio@gmail.com**. |
| Response time, refund policy | docs/20 §6: 24 hours; no returns, exchanges or cancellations, with a promise to fix what does not work as described. |
| Price, quantity | **Open** — `[PRICE]`. Quantity 999 like the other designs. |
| Design fonts and other languages | From the Google Fonts family listing (2026-10-18; not re-read from the live CSS in this task): Luxurious Script (latin, latin-ext, vietnamese), Prata (latin, cyrillic, vietnamese). Ma Shan Zheng loads only the one character 囍 (interim, until the gold-leaf part). [VERIFY: subsets in the live Google Fonts CSS] |
| START HERE guide | **Not built** (as for 22–32 it follows in a G175-type task: `python3 tools/build_customer_guides.py --designs 34` once the design is in that tool; QR only from `tools/make_qr.py`). |
| Listing images and video | **Not produced** — they wait for the GPT parts (no image of the interim look is to be sold). |

VERIFY markers come out only after the test is done; if a test fails, delete or rewrite that sentence.

## 1. Title

Etsy limit: 140 characters. This title: 125 characters.

```text
Red Lacquer Wedding Website with RSVP, Double Happiness Envelope Digital Invitation, Peony Paper Cut, Online Editor, Red Gold
```

## 2. Description

Paste from the line below. Section titles in capitals and "•" bullets read well in Etsy's plain-text description.

---

A wedding website that opens from a red paper envelope tied with a cord, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

Lacquer red, warm cream and gold leaf, with paper-cut peonies and the double happiness character in gold. Your guests tap the envelope: the red cord unwinds from its paper button, the flap lifts, and your card comes up wrapped in two paper-cut peony windows that open one after the other while gold clouds drift past. Then your invitation follows: Home, Our Story, Details and RSVP, where your photos sit in round moon gates whose paper doors slide open as guests scroll.

TRY THE LIVE DEMO
See the envelope open on your own phone before you buy (sample names):
https://xn--bkestudo-zkb.com/start/demo/red-lacquer-double-happiness
Copy the link into your phone's browser. [VERIFY: demo live after deploy]

WHAT YOU GET
• Your wedding website in the Red Lacquer & Double Happiness design: envelope opening, Home, Our Story, Details and RSVP pages
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
• The design's headings, labels and buttons, in your own words (for example "Together with their families" or "Kindly reply")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the opening animation.

WHAT YOUR GUESTS SEE
Your link opens the closed red envelope. One tap opens it and leads into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start (for example …/mei-and-julian); it cannot be changed later. A custom domain (yournames.com) is not included.
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
chinese wedding
red and gold
double happiness
peony wedding
paper cut
asian wedding
red envelope
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
| Primary color | Red |
| Secondary color | Gold |
| Style / theme | Classic, Romantic (if offered) |
| Personalization | Off (nothing to fill in at checkout; the buyer fills in the website) |
| Digital file | `START_HERE.pdf` from `package/customer/`: **not produced yet** |
| Price | **[PRICE]** (not decided) |
| Quantity | 999, Etsy's maximum |
| Shop section | [SHOP SECTION] (user's choice) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

**Not produced.** They are made after the GPT parts are in the theme (same pipeline as 01–20: `python3 tools/listing_editorial.py --theme red-lacquer-double-happiness`, rules in `docs/21_ILAN_GORSELLERI.md`; real screens of the theme, no QR code or web address in an image). Planned set and alt-text drafts (rewrite against the real files):

| # | File | Alt text (draft) |
|---|---|---|
| 1 | `01_cover.png` | Red Lacquer & Double Happiness wedding website with online RSVP on a phone: the red envelope with a gold double happiness and the names Mei & Julian |
| 2 | `02_opening.png` | The envelope opens: phones show the closed envelope, the cord unwinding from its button, the flap lifting and the card opening through paper-cut peony windows |
| 3 | `03_pages.png` | Every page guests need, on five phone screens: home with a countdown, our story with round moon gate photo frames, the invitation, the order of the day and the RSVP page |
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
Under four seconds, and guests can tap "Skip" at any time. On phones set to reduce motion it goes straight to your home page.

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

- The closed object is again an envelope (K23 strict, 3rd wave), but not the V flap with a wax seal of 01–21: a tall red paper envelope with a cord-and-button closure; "the cord unwinds", "paper-cut peony windows", "the opening animation".
- Cultural design: the symbols are the common, respectful ones (peony, cloud scrolls, knot with tassel, 囍 as gold leaf); no religious symbol; all text English.
- The languages line follows G144 (five languages) instead of "built-in messages are in English" [VERIFY].
- The printable invitation (G139) is named, with a VERIFY until the design's own print sheets (PAKET 6) are in.

## 11. Before you publish this listing

- [ ] GPT parts (PAKET 5, PAKET 2, PAKET 6) in the theme, the theme looked at again, `config.ts` status `live` (integrator)
- [ ] Sales-site copy in `platform/lib/marketing/designs.ts` re-read against the theme with its GPT parts (+ translations)
- [ ] Start link and demo answer on the live site and on a real phone
- [ ] START HERE guide written for this design (`package/customer/`)
- [ ] Price decided and filled in
- [ ] Images and video produced; alt texts read against them
- [ ] Shop section chosen (§4)
- [ ] Etsy rules re-checked in the listing editor (title, tags, images, video, AI disclosure, "Designed by")
- [ ] `python3 tools/etsy_upload.py --check` passes and no VERIFY is left in this file
