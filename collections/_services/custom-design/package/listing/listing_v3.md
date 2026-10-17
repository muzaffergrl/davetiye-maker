# Etsy listing v3: Custom wedding website design (K42)

Internal listing kit for the seller (G130, 2026-10-16). Not published on Etsy (K41). A new design made for one couple on our platform;
the price is a design's price plus about 1500 TL for the custom work (K42). Flow after the sale: `docs/23_EK_HIZMETLER.md` §4. Product
language: English (US spelling).

## 0. Status before publishing

| Item | Status on 2026-10-16 |
|---|---|
| Decision | K42 (user, 2026-10-16): custom design = the template price + about 1500 TL. Sold as its own Etsy listing |
| Price | **2,960 TL** = design 1,460 TL + 1,500 TL, approved by the user on 2026-10-16 (about USD 59.76 at 49.53 TRY per USD, BloombergHT 2026-10-16 09:30). docs/23 §1 |
| Revisions | **2 rounds** included; each further round **500 TL** (user, 2026-10-16) |
| Turnaround | **3 days** for the first version after we have the answers (user, 2026-10-16) |
| Exclusivity | **Exclusive** (user, 2026-10-16): the design is never sold to anyone else |
| How a custom design is made | The same pipeline as our 20 designs: GPT artwork (K21) → a platform theme → open on /start for this buyer only. Making a theme takes real work (G406–G420 took one task each); the turnaround must allow for it. Not tried for a single buyer yet (docs/23 §4) |
| Etsy rule on services / custom orders | Not checked. Custom design work that results in a digital item is the usual allowed case. [VERIFY] in §4 |
| Digital file | `package/customer/CUSTOM_DESIGN.pdf` (G136, 2026-10-17; `tools/build_service_guides.py`): what was bought, the questions of the admin message `custom_design_brief` word for word, first version in 3 days, 2 rounds, start link, AI note, no returns + we fix it, support |
| Images, video | 4 images made (G136, 2026-10-17; `tools/listing_services.py`, §5). No video |

## 1. Title

Etsy limit: 140 characters. This title: 130 characters.

```text
Custom Wedding Website Design with RSVP, Made Just for You, Your Own Colors and Opening, Online Editor, Digital Invitation Website
```

## 2. Description

Paste from the line below.

---

A wedding website designed just for you. Tell us the feel, colors and details you love, and we make a new design on our platform: your own opening, artwork, colors and type. Then you fill it in yourself in our editor, like every design in our shop.

The price includes the design itself: you do not need to buy one of our ready designs as well.

WHAT YOU GET
• A new wedding website design made for you: the opening your guests tap first, the artwork, colors and fonts
• Everything our ready designs include: Home, Our Story, Details and RSVP pages, the private online editor, online RSVP with a downloadable guest list, a QR code, an optional guest password and a thank-you page for after the wedding
• 2 rounds of changes to the design
• Your website stays online until 12 months after your wedding date

HOW IT WORKS
1. Buy this listing. We message you on Etsy and ask about your wedding, the colors you love and pictures that inspire you.
2. We send you the first version within 3 days of receiving your answers.
3. You tell us what to change (2 rounds included).
4. When you are happy, you get your start link: enter your Etsy order number, add your names, date and photos, and publish. The same order number and your email open your editor again on any phone or computer.

WHAT IS NOT INCLUDED
• Entering your details for you (add our setup service if you would like us to do it)
• Printing or shipping anything, and a custom domain (yournames.com)
• Changes beyond the 2 included rounds: each further round is 500 TL, through our Extra design revision listing

GOOD TO KNOW
• The artwork is created with the help of AI image tools from our own descriptions, then selected, refined and built into your website by us. [VERIFY: Etsy AI disclosure wording and the "Designed by" setting]
• Your design is yours alone: we never sell it, or a recolored version of it, to anyone else.
• Your names, photos and texts are never part of the artwork: you can change them in your editor at any time.
• Digital product: nothing is printed or shipped. [VERIFY: Etsy's policy on custom design listings]
• No returns, exchanges or cancellations once we have started your design. If something on your website does not work as described, message us on Etsy and we will fix it.

QUESTIONS?
Please message us before you buy if you have a special idea, so we can tell you whether we can make it. We reply within 24 hours.

---

## 3. Tags

Etsy: 13 tags, each up to 20 characters. Keyword choices are hypotheses (no search-volume data).

```text
custom invitation
custom wedding site
wedding website
custom design
bespoke invitation
rsvp website
digital invitation
online rsvp
wedding rsvp
invitation website
e invitation
wedding invitation
personalized invite
```

## 4. Category and attributes

Values must be picked from Etsy's own lists in the listing editor. [VERIFY: every row in the listing editor, and that Etsy allows this listing as custom design work]

| Field | Suggestion |
|---|---|
| Category | Paper & Party Supplies › Paper › Invitations & Announcements › Invitations (or the closest digital wedding category Etsy offers) |
| Type | Digital files |
| Who made it | I did [VERIFY: the "Designed by" option for designs made with AI image tools] |
| What is it | A finished product |
| When was it made | Made to order |
| Occasion | Wedding |
| Personalization | Off (we ask in an Etsy message after the order) |
| Digital file | `CUSTOM_DESIGN.pdf` (`package/customer/`, G136) |
| Price | **2,960 TL** = design 1,460 TL + 1,500 TL (about USD 59.76; K42, approved 2026-10-16; docs/23 §1) |
| Quantity | 999, Etsy's maximum (user, 2026-10-16: no stock limit) |
| Shop section | Services (proposal, docs/20 §3) |
| Renewal | [AUTO RENEW: yes/no] |

## 5. Images and alt text

Made 2026-10-17 (G136, `tools/listing_services.py`, `package/listing/images_editorial/`, 2000 × 2000). Real screens of several of
our ready designs, each image saying so ("Shown: openings from our ready designs", "Shown: our Olive & Ivory design"); layout and
type on our brand palette (K27) in the editorial set's style; the shop-wide GPT scenes t1 and t6 (`brand/trust/`, GM06, K21). No
price, no QR, no web address.

| # | File | Alt text |
|---|---|---|
| 1 | `01_cover.png` | Custom wedding website design: three phones showing different openings and color palettes from our ready designs, with the words "Designed just for you" |
| 2 | `02_steps.png` | Four steps: tell us your idea, see the first version, ask for changes, then fill in your website and publish |
| 3 | `03_included.png` | What is included: your own design, the editor, every page, online RSVP, QR code, online until 12 months after your wedding |
| 4 | `04_examples.png` | Examples of openings we have made: an envelope, a gatefold, a book and a travel wallet (from our ready designs) |

## 6. Video

None. Optional later: openings of several ready designs, one after the other.

## 7. FAQ

**Do I also need to buy one of your designs?**
No. The price includes your custom design.

**How many changes can I ask for?**
2 rounds of changes to the design are included. Each further round is 500 TL.

**How long does it take?**
The first version within 3 days of receiving your answers.

**Can you copy a design I saw elsewhere?**
No. We make an original design for you; you can show us what you like about it.

## 8. Etsy's automatic messages

As for the setup service: the shop-wide digital-items message talks about the START HERE guide. The shop sends `custom_design_brief`
within 24 hours (docs/23 §4).

## 9. After the sale

`docs/23_EK_HIZMETLER.md` §4 and the admin messages `custom_design_brief`, `custom_design_ready`.

## 10. Before you publish this listing

- [x] Price approved: 2,960 TL (2026-10-16)
- [x] Revisions (2, then 500 TL a round), turnaround (3 days) and exclusivity decided (2026-10-16), here and in the admin messages
- [x] Extra rounds: own listing `collections/_services/extra-revision/` (500 TL, 2026-10-16); publish both together
- [ ] A custom theme made once end to end for one buyer (only that order can start it on /start), docs/23 §4
- [ ] Etsy's policy on custom design listings read; category and digital-file setup checked in the listing editor
- [x] `CUSTOM_DESIGN.pdf` made; images made (§5) (G136, 2026-10-17)
- [x] Quantity decided: 999 (no stock limit)
- [ ] Renewal decided
