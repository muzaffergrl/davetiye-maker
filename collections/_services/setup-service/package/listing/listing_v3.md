# Etsy listing v3: "We set it up for you" setup service (K42)

Internal listing kit for the seller (G130, 2026-10-16). Not published on Etsy (K41). Not a design: it is an add-on to any of our
wedding website designs. The shop enters the buyer's own details in the editor for them, one round per purchase (K42). Flow after the
sale: `docs/23_EK_HIZMETLER.md`. Product language: English (US spelling).

## 0. Status before publishing

| Item | Status on 2026-10-16 |
|---|---|
| Decision | K42 (user, 2026-10-16): about +500 TL, one-time; another round of changes is a new purchase. Sold as its own Etsy listing |
| Price | **500 TL**, approved by the user on 2026-10-16 (about USD 10.09 at 49.53 TRY per USD, BloombergHT 2026-10-16 09:30). docs/23 §1 |
| Turnaround | **3 days** after we have everything (user, 2026-10-16) |
| Etsy rule on services | **Not checked.** Etsy's prohibited items policy limits pure services; a service that results in a digital item (here: the buyer's set-up website) is the usual exception. [VERIFY] in §4: read Etsy's current policy before publishing |
| Digital file | `package/customer/SETUP_SERVICE.pdf` (G136, 2026-10-17; `tools/build_service_guides.py`): what was bought, the list of what to send us (word for word from the admin message `setup_service_details`), 3 days, one round, no returns + we fix it, support |
| Shop editing a buyer's website | The admin can create a website for a buyer ("Yeni sipariş"), or edit a buyer's existing website with the shop's own 72-hour link without changing the buyer's ("Linki değiştirmeden düzenle", G145); "Yeni düzenleme linki" (the old link stops working) is only for a lost link. Since G146 the buyer also opens the editor on any device with the Etsy order number + email (`/my`). The description says so (GOOD TO KNOW, G148). docs/23 §3 |
| Images, video | 4 images made (G136, 2026-10-17; `tools/listing_services.py`, §5). No video |

## 1. Title

Etsy limit: 140 characters. This title: 127 characters.

```text
Wedding Website Setup Service, We Enter Your Details for You, Add On for Our Website Designs, Done for You RSVP and Photo Setup
```

## 2. Description

Paste from the line below.

---

Short on time? We set up your wedding website for you. You send us your details in an Etsy message, we enter them in your editor, and you only check and publish.

This is an add-on service for our wedding website designs. It does not include a design: please buy the design you love from our shop too (before, together with, or after this listing).

WHAT WE DO FOR YOU (ONE ROUND)
• We enter the details you send us in your website's editor: your names, date, time and time zone, venue and address, the order of the day, your story, questions and answers, dress code, travel and registry links
• We add up to 5 photos you send us and crop each one to its frame
• We set up your RSVP page: reply deadline and up to 3 questions for your guests (for example a meal choice)
• We change headings and wording you ask for, in your words
• You check every page in your own editor and publish when you are happy

HOW IT WORKS
1. Buy this listing together with your design (or after it).
2. We message you on Etsy and ask for everything we need. Send your texts in the Etsy message and your photos as a share link (Google Drive, Dropbox or iCloud).
3. We set up your website within 3 days of receiving everything, and tell you on Etsy when it is ready (with your private edit link if we started the website for you).
4. You check it, change anything you like yourself, and tap Publish.

WHAT IS NOT INCLUDED
• Writing your texts for you: we enter the words you send us
• Changing the design's artwork, colors, fonts or layout (see our Custom design listing)
• A second round of changes: after we send your link you can change everything yourself, as often as you like; if you want us to make more changes for you, that is a new purchase of this listing
• Sending your invitation to your guests

GOOD TO KNOW
• One purchase = one round of setup for one website.
• If you already started your website, we set it up in that same website: your edit link, and your Etsy order number with your email, keep working.
• If your website is already published, name and date changes we make count toward the same 3 changes after publishing as your own (typo fixes and moving the date by up to 7 days stay free).
• We never ask for your edit link.
• Digital service: nothing is printed or shipped. [VERIFY: Etsy's policy on service listings]
• No returns, exchanges or cancellations once we have started your setup. If something we set up does not match what you sent us, message us on Etsy and we will fix it.

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters. Keyword choices are hypotheses (no search-volume data).

```text
wedding website
website setup
done for you
setup service
wedding rsvp
rsvp website
digital invitation
wedding invitation
invitation website
online rsvp
e invitation
add on service
wedding planning
```

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor, and that Etsy allows this listing as a digital service]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (the same as the designs; or the closest digital category Etsy offers) |
| Type | Digital files |
| Who made it | I did |
| What is it | A finished product |
| When was it made | Made to order |
| Occasion | Wedding |
| Personalization | Off (we ask for the details in an Etsy message after the order; Etsy's box is too short for photos and a schedule) |
| Digital file | `SETUP_SERVICE.pdf` (`package/customer/`, G136) |
| Price | **500 TL** (about USD 10.09; K42, approved 2026-10-16; docs/23 §1) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) |
| Shop section | Services (proposal, docs/20 §3) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

Made 2026-10-17 (G136, `tools/listing_services.py`, `package/listing/images_editorial/`, 2000 × 2000). Layout and type on our brand
palette (K27) in the editorial set's style; real editor and site screens (Olive & Ivory, local production build); the shop-wide GPT
scene t3 (`brand/trust/`, GM06) on the cover (K21). No price, no QR, no web address (Etsy Off-Platform policy).

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | We set it up for you: a couple looking at a phone showing a finished wedding website, with the words "Send us your details, we do the rest" |
| 2 | `02_steps.png` | Four steps: buy with your design, send your details in an Etsy message, we set up your website, you check and publish |
| 3 | `03_what_we_enter.png` | What we enter for you: names, date and venue, schedule and story, up to 5 photos, RSVP questions, headings and wording |
| 4 | `04_not_included.png` | Good to know: one round of setup, you can change everything yourself afterwards, the design stays as designed, you decide when to publish |

No new GPT scene was needed: the cover uses GM06's t3 (`brand/trust/GPT_PROMPTS.md`).

## 6. Video

None. Optional later: a short screen recording of the editor being filled in (sample names).

## 7. FAQ

**Do I still need to buy a design?**
Yes. This listing is the setup only; the design is its own listing in our shop.

**What do I need to send you?**
Your texts in an Etsy message and up to 5 photos as a share link. We send you the list right after your order.

**How long does it take?**
Within 3 days of receiving everything.

**Can I change things afterwards?**
Yes, everything, as often as you like, in your editor. If you want us to make the changes, buy this listing again.

## 8. Etsy's automatic messages

The shop-wide "Message to Buyers for Digital Items" (docs/20 §1.5) speaks about the START HERE guide. A buyer of this listing alone
gets that text too. Proposal: no change; the shop sends `setup_service_details` within 24 hours (docs/23 §3).

## 9. After the sale

`docs/23_EK_HIZMETLER.md` §3 and the admin messages `setup_service_details`, `setup_service_done`.

## 10. Before you publish this listing

- [x] Price approved: 500 TL (2026-10-16)
- [x] Turnaround decided: 3 days (2026-10-16), here and in the admin messages
- [ ] Etsy's policy on service listings read; category and digital-file setup checked in the listing editor
- [x] `SETUP_SERVICE.pdf` made (G136, 2026-10-17)
- [x] Images made (§5; G136, 2026-10-17)
- [x] Quantity decided: 999 (no stock limit)
- [ ] Renewal decided
