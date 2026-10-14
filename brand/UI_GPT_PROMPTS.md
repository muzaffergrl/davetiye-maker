# BKE Studio — satış sitesi ve panel arayüz tasarımı GPT prompt'ları (GM04, GM05; 2026-10-14)

Kullanıcı (2026-10-14): "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım."
GPT arayüzün **görsel tasarımını** (comp) yapar; Claude aynı görünümü gerçek kodla, gerçek metin ve gerçek ekranlarla kurar
(G066). Comp'lar yalnız referanstır, satılmaz. Metinler aşağıdaki gerçek ürün metinleridir; ürün yapmadığı bir şeyi gösterme.

**Referans görseller (her sohbetin başında yükle):** `brand/assets/gpt/final/brand_board_final.png`,
`brand/assets/gpt/final/logo_horizontal.png`, `brand/listing/comps/lc1_cover.png`, `brand/listing/comps/lc6_included.png`.

**Kurallar (iki paket):**
- Telefon ekranı comp'u 1024×1536 (cihaz çerçevesi, durum çubuğu, tarayıcı çubuğu yok; tam ekran arayüz). Masaüstü 1536×1024.
- Ürün ekranı, düğün fotoğrafı ya da QR kodu görünecek her yer **düz saf #00FF00 dikdörtgen** (Claude gerçeğini koyar). AI'nin
  çizdiği QR kodu kesinlikle yok.
- Yazı yalnız verilen metin; harf harf doğru. "BKE Studio" logosu referanstaki gibi.
- Renk: koyu patlıcan `#2B1526` (ana, başlık ve düğme), kâğıt `#FAF7F0` ve `#EDE5D7` (zemin), metin `#202020`, altın `#D0AE6A`
  ve lavanta `#9F84A7` **yalnız süs/vurgu** (açık zeminde yazı rengi değil). Yazı: kalın, sıkı geometrik grotesk başlıklar (BKE
  logosundaki gibi), ince geniş sans alt başlıklar, okunaklı sade sans metin.
- Çağdaş, cesur, premium, bol boşluk; düğün ürünlerini çerçeveleyen bir galeri gibi — marka ürünle yarışmaz. Dokunma hedefleri büyük
  (≥ 44 px), kontrast yüksek, tek elle kullanım.

---

## GM04 — Satış sitesi (6 görsel)

### U1.0 Brief (önce düz mesaj; görsel üretme)
```
You are the lead product designer of BKE Studio. Keep this brief for every image in this chat; do not generate an image for this message.
BKE Studio sells wedding websites that open like a real invitation: guests tap a sealed envelope on their phone, it opens with motion, and the wedding website appears (Home, Our Story, Details, RSVP). Couples buy a design on Etsy, open their start link and edit everything from their phone; RSVPs arrive in their editor. There are 20 romantic designs.
Now design the BKE Studio sales website as high-fidelity UI comps, using the brand board, logo and listing images as references: contemporary, bold, premium, editorial, generous white space, the brand frames the romantic designs like a gallery wall frames paintings. Headlines in the heavy geometric grotesque of the BKE logo, light wide sans for subheads, a clean readable sans for body text. Deep aubergine (#2B1526) for headlines and primary buttons, warm paper backgrounds (#FAF7F0, #EDE5D7), near-black text (#202020); champagne gold (#D0AE6A) and lavender (#9F84A7) only as small accents, never as text on light backgrounds.
Every place that shows a product screen, a wedding photo or a design preview is a flat pure green (#00FF00) rectangle with rounded corners; we insert the real screens later. Never draw a QR code. Use only the exact text given in each prompt. No device frames, no status bar, no browser bar.
```

### U1.1 Ana sayfa — ilk ekran (telefon)
**Kaydet:** `brand/ui/site/u1_home_hero_390.png` · 1024×1536

```
Mobile home page, first screen. Top bar: the BKE Studio logo on the left and a menu icon on the right. A small label "Wedding websites · edit on your phone". A large bold headline "Envelope wedding websites that open like a real invitation". A short paragraph "Your guests tap a sealed envelope, it opens, and your wedding website appears: your story, the details and RSVP. You edit everything from your phone." Below, a tall phone-shaped flat green (#00FF00) area showing where the live design appears, with two small selectable design chips under it: "Blush Garden Rose" and "Olive & Ivory". A primary aubergine button "Open the invitation" and a text link "See all designs →". A thin row of facts: "RSVP built in · Add to calendar · No Canva".
```
Kontrol: metin harf harf; tek yeşil telefon alanı; QR yok; logo üstte.

### U1.2 Ana sayfa — bölümler 1 (telefon)
**Kaydet:** `brand/ui/site/u1_home_sections_a_390.png` · 1024×1536

```
Mobile home page, scrolled further: section "How the opening works" with three small flat green (#00FF00) screen frames in a row captioned "Sealed", "Opening", "Your website"; then section "Four pages your guests will actually use" with four cards in a 2×2 grid, each with a flat green (#00FF00) screen thumbnail and a title: "Home", "Our Story", "Details", "RSVP", and one short line each: "Names, date and a countdown", "Your photos and moments", "Schedule, venue and dress code", "Guests reply in seconds". Brand typography and colors, generous spacing.
```
Kontrol: metin harf harf; yeşil alanlar düz; 2×2 kart ızgarası.

### U1.3 Ana sayfa — bölümler 2 (telefon)
**Kaydet:** `brand/ui/site/u1_home_sections_b_390.png` · 1024×1536

```
Mobile home page, further down: section "Made to edit from your phone" with a flat green (#00FF00) phone screen and a short checklist "Names and date", "Photos", "Schedule and venue", "Your RSVP questions", "Preview before you publish"; then section "RSVPs without the spreadsheet chaos" with three big number tiles "24 Coming", "6 Not coming", "30 Replies" and a line "Download your guest list anytime"; then a compact "How it works" row of four numbered steps "Buy this design", "Open your start link", "Edit on your phone", "Publish and share". Brand typography, aubergine numerals, gold only as thin accents.
```
Kontrol: metin harf harf; sayı kutuları okunur; altın yalnız süs.

### U1.4 Tasarım galerisi (telefon)
**Kaydet:** `brand/ui/site/u1_designs_390.png` · 1024×1536

```
Mobile page "Wedding website designs". A heavy headline "Wedding website designs" and a line "Every design includes Home, Our Story, Details and RSVP pages. Try every demo live." Filter chips: "All", "Garden", "Classic", "Rustic", "Modern". A two-column grid of six design cards; each card has a tall flat green (#00FF00) preview area, the design name below in bold ("Blush Garden Rose", "Olive & Ivory", "Vintage Airmail", "Mediterranean Lemon", "Dusty Blue & Champagne", "Art Deco Black-Tie") and a small "Live demo" text link. Brand colors and typography.
```
Kontrol: 6 kart; adlar harf harf; yeşil önizlemeler düz.

### U1.5 Tasarım sayfası (telefon)
**Kaydet:** `brand/ui/site/u1_design_detail_390.png` · 1024×1536

```
Mobile product page for one design. Breadcrumb "Designs / Blush Garden Rose". A heavy headline "Blush Garden Rose" and a line "Blush garden roses, a satin ribbon and a pressed wax seal." A large tall flat green (#00FF00) phone preview area with a primary aubergine button "Open the live demo" under it and a secondary outlined button "Buy on Etsy". A row of four small flat green (#00FF00) page thumbnails captioned "Envelope", "Home", "Details", "RSVP". A short list "What you can edit": "Names, date and venue", "Photos and story", "Schedule and dress code", "RSVP questions and deadline". Brand typography.
```
Kontrol: metin harf harf; iki düğme net; yeşil alanlar düz.

### U1.6 Ana sayfa — masaüstü
**Kaydet:** `brand/ui/site/u1_home_desktop.png` · 1536×1024

```
Desktop home page, first screen. Top navigation: BKE Studio logo on the left; links "Designs", "How it works", "Features", "Pricing", "FAQ"; a primary aubergine button "See designs" on the right. Left column: the label "Wedding websites · edit on your phone", the heavy headline "Envelope wedding websites that open like a real invitation", the paragraph "Your guests tap a sealed envelope, it opens, and your wedding website appears: your story, the details and RSVP. You edit everything from your phone.", the button "Open the invitation" and the link "See all designs →". Right column: a large flat green (#00FF00) phone-shaped preview area, with soft brand-colored geometric accents from the brand pattern behind it. A thin facts row at the bottom: "RSVP built in · Add to calendar · No Canva".
```
Kontrol: metin harf harf; tek yeşil alan; bol boşluk.

---

## GM05 — Düzenleme paneli (6 görsel)

### U2.0 Brief (önce düz mesaj; görsel üretme)
```
You are the lead product designer of BKE Studio. Keep this brief for every image in this chat; do not generate an image for this message.
Design the couple's editor app (a mobile web app) for BKE Studio wedding websites as high-fidelity UI comps, using the brand board, logo and listing images as references. The couple uses it on a phone, often in spare minutes; it must feel calm, friendly, premium and very easy: one clear action per screen, big readable labels, large touch targets (at least 44 px), plain words, generous white space. App structure: a top bar with the couple's names and a save status, and a bottom navigation with four tabs "Home", "Edit", "Guests", "Share" with simple line icons. Brand: deep aubergine (#2B1526) for headlines, the active tab and primary buttons; warm paper backgrounds (#FAF7F0, #EDE5D7); near-black text (#202020); champagne gold (#D0AE6A) and lavender (#9F84A7) only as small accents, never as text on light backgrounds; green success states may use a soft muted green. Headlines in the heavy geometric grotesque of the BKE logo, body in a clean readable sans.
Every place that shows the wedding website preview or a photo is a flat pure green (#00FF00) rectangle with rounded corners. Never draw a QR code: where a QR code goes, draw a flat pure green (#00FF00) square. Use only the exact text given in each prompt. No device frames, no status bar.
```

### U2.1 Kurulum sihirbazı — 1. adım (telefon)
**Kaydet:** `brand/ui/panel/u2_setup_names_390.png` · 1024×1536

```
Mobile setup wizard, step 1 of 6. A slim progress bar with "Step 1 of 6". A heavy headline "Whose wedding is it?". Two large text fields with labels "First name" and "Partner's first name", filled with "Elena" and "Marco". A helper line "You can change spelling later. Your names appear on the envelope and every page." A small flat green (#00FF00) live preview card at the bottom showing where the envelope preview appears. A full-width aubergine button "Continue" at the bottom and a small text link "Back". No bottom navigation on this screen.
```
Kontrol: metin harf harf; tek birincil düğme; yeşil önizleme düz.

### U2.2 Home (telefon)
**Kaydet:** `brand/ui/panel/u2_home_390.png` · 1024×1536

```
Mobile editor Home tab. Top bar "Elena & Marco" with a small "Saved" status and a green "Live" pill. A heavy headline "Elena & Marco" and a line "Saturday, September 18, 2027". A card "Your website is live" with the link text "bkestudio.com/elena-and-marco", a "Copy" button and a "Share" button. A card "3 new replies" with "24 coming · 6 not coming" and a chevron. A card "Next steps" with three short checklist rows: "Add your story photos", "Set your RSVP deadline", "Add your dress code". Bottom navigation "Home" (active), "Edit", "Guests", "Share".
```
Kontrol: metin harf harf; alt menüde Home etkin; kartlar sakin ve net.

### U2.3 Edit (telefon)
**Kaydet:** `brand/ui/panel/u2_edit_390.png` · 1024×1536

```
Mobile editor Edit tab. A heavy headline "Edit your website" and a line "Tap a section to change it. Changes save automatically." A list of large rows, each with a simple line icon, a title and a one-line summary and a chevron: "Names" "Elena & Marco", "Date and time" "Sat, Sep 18, 2027 · 4:00 PM", "Venue" "Rosewood Manor, Charleston", "Photos" "4 photos", "Our Story" "3 moments", "Schedule" "Ceremony, Cocktails, Reception", "Wording" "Headings and button text", "RSVP" "Reply by August 1, 2027 · 2 questions", "Questions and answers" "5 answers". A floating aubergine button "Preview" with an eye icon. Bottom navigation with "Edit" active.
```
Kontrol: metin harf harf; satırlar büyük ve hizalı; "Preview" düğmesi.

### U2.4 Guests — RSVP (telefon)
**Kaydet:** `brand/ui/panel/u2_guests_390.png` · 1024×1536

```
Mobile editor Guests tab, a beautifully organized RSVP overview. A heavy headline "Guests". Three big number tiles: "24 Coming", "6 Not coming", "30 Replies", and a line "Replies close in 42 days". A card "Meal choices" with a simple horizontal bar breakdown: "Chicken 12", "Fish 7", "Vegetarian 5". Filter chips "All", "Coming", "Not coming", "New". A search field "Search by name". Guest cards: "Margaret Hamilton" with a small "New" badge and a green "Coming · 2 guests" tag and the line "With James Hamilton"; "Hedy Lamarr" with "Coming · 1 guest"; "Dorothy Vaughan" with a grey "Not coming" tag. Bottom buttons row: "Add a reply", "Download list". Bottom navigation with "Guests" active.
```
Kontrol: metin harf harf; sayılar ve çubuklar okunur; "New" rozeti; alt menüde Guests etkin.

### U2.5 Share (telefon)
**Kaydet:** `brand/ui/panel/u2_share_390.png` · 1024×1536

```
Mobile editor Share tab. A heavy headline "Share your website". Card "Your website link" with "bkestudio.com/elena-and-marco" and buttons "Copy", "Open", "Share". Card "QR code for printed cards" with a flat pure green (#00FF00) square where the QR code goes and buttons "Download PNG", "Download SVG". Card "Password" with a toggle "Only guests with the password can open it" switched off. Card "Your edit link" with the line "Anyone with this link can edit your website. Share it only with your partner." and a button "Copy edit link". Bottom navigation with "Share" active.
```
Kontrol: metin harf harf; QR yerine düz yeşil kare (QR çizilmemiş); alt menüde Share etkin.

### U2.6 Masaüstü (Edit + canlı önizleme)
**Kaydet:** `brand/ui/panel/u2_desktop.png` · 1536×1024

```
Desktop editor, three columns. Left: a vertical navigation with the BKE Studio logo at the top and items "Home", "Edit", "Guests", "Share" ("Edit" active). Middle: the section editor "Venue" with large fields "Venue name" "Rosewood Manor", "City" "Charleston", "State or region" "South Carolina", "Map link" and a helper line "Guests tap the venue to open directions." Right: a large flat green (#00FF00) phone-shaped live preview area with a small caption "Live preview". Top bar with "Elena & Marco", "Saved" status and a "Publish changes" aubergine button.
```
Kontrol: metin harf harf; tek yeşil önizleme; üç sütun net.
