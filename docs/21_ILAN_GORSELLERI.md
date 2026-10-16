# İlan görselleri — editoryal sistem (v4, 2026-10-16)

Kullanıcı (2026-10-16): ilan görselleri satışın en önemli parçası; önceki iki tarz (GM03 GPT kompozisyonları ve G059
şablon kiti) istenmiyor, "çok daha şık ve özenli" iş isteniyor.

**Araç:** `tools/listing_editorial.py --theme <id>` → `collections/<NN>/package/listing/images_editorial/` (8 × 2000 px).
Eski kit `images/` klasöründe kalır; seçim yapılınca ilan paketi (`etsy_upload.json`) yeni klasöre bağlanır.
Açılış kareleri: `tools/listing_editorial/capture_opening.ts` (DPR 3, yerel üretim derlemesi; canlıya bir şey gitmez).

## Önceki tarzlarda neyi bırakıyoruz

| Önceki | Yerine |
|---|---|
| Kalın siyah sans başlıklar, ikon ızgaraları, hap etiketler (GM03 comps) | Tek ince serif (Cormorant Garamond 300) + küçük harf aralıklı Montserrat; ikon, rozet, kutu yok |
| Sekiz görselde aynı kalıp: başlık + üç küçük ekran + küçük yazı (G059 kiti) | Her görsel tek fikir; dört farklı düzen: sahne, ikiye bölünmüş sayfa, kâğıt üstünde ekran sırası, adımlar |
| Her görselde aynı köşe süsü | Süs yok; tema kimliği GPT sahnesi, kâğıt dokusu ve gerçek ekranlardan gelir |
| Bulanık açılış videosundan kare (390 px) | DPR 3 net açılış kareleri (1170 × 2532) |
| 25 px açıklama yazıları | En küçük yazı 28–30 px (telefonda Etsy görseli ~600 px'e iner) |
| 8. görselde demo QR'ı | QR yok (Etsy Off-Platform politikası, docs/15 §4.1). "Live demo: link in the description": demo linki açıklamada "TRY THE LIVE DEMO" bölümünde (kullanıcı kararı, 2026-10-16) |

## Kurallar

1. Çizim yok (K21): resim yalnız GPT sahnesi, GPT tema parçası (kâğıt dokusu) ya da platformun gerçek ekranı.
2. Kutu, rozet, hap, ikon yok. Ayırıcı gerekiyorsa 1.5 px altın-mürekkep çizgi.
3. Yazı hiçbir telefonun üstüne binmez. Sahne üstündeki yazı, sahnenin sakin bölgesinde ve hafif kâğıt rengi geçişle durur.
4. Kapak yazısı Etsy arama kırpımının (4:3, y 250–1750) içinde kalır.
5. İddialar docs/19 ve docs/05 §E'deki dürüst listeyle aynı: "Artwork, colors and fonts stay as designed", "Up to 3 questions",
   "Online until 12 months after your wedding".
6. Renkler temanın `palette.json`'undan; altın metin rengi olarak mürekkebe doğru karıştırılır (açık zeminde okunur).

## Sekiz görsel

| # | Ad | Düzen | Malzeme |
|---|---|---|---|
| 1 | Cover | Tam sahne, üstte tür satırı + tasarım adı (italik) | `cover_hand_v2` + zarf ekranı |
| 2 | The opening | Üç telefon: kapalı → açılıyor → kart | `three_phones` + DPR 3 açılış kareleri |
| 3 | Every page | Kâğıt üstünde 5 ekran, kademeli | gerçek misafir ekranları |
| 4 | Your editor | Solda kâğıt panel + liste, sağda elde telefon | `hand_phone_edit` + editör ekranı |
| 5 | RSVP | İki büyük ekran: misafirin formu / çiftin listesi | gerçek ekranlar |
| 6 | The details | Program, mekân, S&C | gerçek ekranlar |
| 7 | How it works | Üç adım, roma rakamları | başlangıç, kurulum, yayındaki site |
| 8 | What's included | Masa üstü sahne + liste | `flatlay_phone(_v2)` + demo ekranı |

## Bilinen sınır

GPT sahneleri 1254 px (kare) ya da 1536 px (yatay). 2000 px tuvalde fotoğraf kısmı ~1.6× büyütülür; ekranlar ve yazılar
keskin, sahnenin dokusu hafif yumuşak. Daha yüksek çözünürlüklü sahne ya da büyütme (upscale) kullanıcı kararıdır.
