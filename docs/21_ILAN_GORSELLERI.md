# İlan görselleri — editoryal sistem (v4, 2026-10-16; 20 tasarım: G124)

Kullanıcı (2026-10-16): ilan görselleri satışın en önemli parçası; önceki iki tarz (GM03 GPT kompozisyonları ve G059
şablon kiti) istenmiyor, "çok daha şık ve özenli" iş isteniyor.

**Araç:** `tools/listing_editorial.py --theme <id|NN|aralık|all>` → `collections/<NN>/package/listing/images_editorial/`
(8 × 2000 px PNG). `--video` aynı çekimden ilan videosunu da yapar (`tools/listing_kit.py video`:
`package/listing/video.mp4`, 1080 × 1080, H.264, sessiz, 5–15 sn, kapalı açılış nesnesiyle başlar, son yarım saniye ilk
kareye erir → dikişsiz döngü). Eski kit `images/` klasöründe kalır (yüklenmez).

## Yeniden üretim (20 tasarım)

```bash
cd platform && npm ci && npm run build && cd ..          # yerel üretim derlemesi; canlıya bir şey gitmez
python3 tools/listing_editorial.py --theme all --capture --video
python3 tools/etsy_upload.py && python3 tools/etsy_upload.py --check
```

- `--capture` = `tools/listing_templates/capture.ts` (misafir sayfaları, /start, K29/G121 editörü, Guests, açılış kaydı
  `opening.webm`) + `tools/listing_editorial/capture_opening.ts` (DPR 3 iki açılış karesi). Ekranlar repoya girmez:
  `--shots-root` (varsayılan `$BKE_LISTING_SHOTS` ya da `<temp>/bke-listing-shots/<NN_klasör>/`, tasarım başına ~10 MB).
  `package/shots/` (yalnız 01–05) G059'un eski çekimidir (G100/G121 öncesi editör); ilan seti artık onu okumaz.
- `--capture stills` yalnız iki açılış karesini yeniden çeker (ekranlar duruyorsa).
- Açılış kareleri tasarım başına gözle seçilir: `tools/listing_editorial/opening_stills.json` (`open_mid` = nesne
  açılıyor, `open_card` = kart çıktı; dokunuştan sonra ms). Yeni tasarımda aday kareler:
  `NODE_PATH=/opt/node22/lib/node_modules node tools/listing_editorial/capture_opening.ts --theme <id> --out <klasör> --at 600,1200,1800,2400,3000,3600,4000`
  (≈ 4 sn'den sonra sayfa ana sayfaya geçer; o kareler kullanılmaz). Zamanlar makine yüküne göre birkaç yüz ms kayabilir:
  her üretimden sonra 2. görsele bakılır.
- Tek görsel: `--only 02_opening` (ekranlar `--shots-root` altında duruyorsa çekim gerekmez).
- G124 (2026-10-16) 20 tasarımın 8'er görselini bu araçla, depo tabanı `6181730` (G098 + G121 editörü) üzerinde üretti;
  videoları 06–20 için yaptı. 01–05'in videoları G059/G122'den (aynı tarif) olduğu gibi duruyor; `--video` onları da
  yeniden yazar, o zaman listing_v3 §6'daki süreler güncellenir.
- Tek tasarım ya da aralık: `--theme 13`, `--theme 06-11`, `--theme tropical-destination`. Görsel ya da video değişince
  `listing_v3.md` §5/§6 ve `python3 tools/etsy_upload.py` (JSON) yenilenir.

### 20 tasarım (G124, 2026-10-16)

| # | Tema id | Açılış nesnesi (2./3./8. görsel, video) | Zemin | Video |
|---|---|---|---|---|
| 01 | `olive-ivory` | envelope | açık | 14.5 sn (G059/G122) |
| 02 | `dusty-blue-champagne` | envelope | açık | 12.5 sn (G059/G122) |
| 03 | `blush-garden-rose` | envelope | açık | 12.9 sn (G059/G122) |
| 04 | `vintage-airmail-love-letter` | envelope | açık | 14.5 sn (G059/G122) |
| 05 | `mediterranean-lemon` | envelope | açık | 13.2 sn (G059/G122) |
| 06 | `art-deco-black-tie` | gatefold | **koyu** | 13.1 sn |
| 07 | `burgundy-velvet-autumn` | envelope | açık | 14.2 sn |
| 08 | `winter-evergreen` | envelope | açık | 14.0 sn |
| 09 | `lavender-provence` | linen pouch | açık | 13.1 sn |
| 10 | `tuscan-vineyard` | envelope | açık | 14.5 sn |
| 11 | `boho-pampas-terracotta` | envelope | açık | 14.0 sn |
| 12 | `tropical-destination` | travel wallet | açık | 13.5 sn |
| 13 | `enchanted-forest-storybook` | storybook | açık | 14.4 sn |
| 14 | `ivory-lace-pearls` | gatefold | açık | 13.4 sn |
| 15 | `cherry-blossom-spring` | envelope | açık | 13.8 sn |
| 16 | `sunflower-rustic-barn` | envelope | açık | 13.7 sn |
| 17 | `emerald-gold-estate` | envelope | **koyu** | 13.9 sn |
| 18 | `wildflower-meadow-vellum` | vellum sleeve | açık | 13.5 sn |
| 19 | `midnight-garden` | envelope | **koyu** | 14.2 sn |
| 20 | `coastal-seaside` | envelope | açık | 14.0 sn |
| 21 | `crimson-rose-atelier` | envelope | açık | 12.1 sn (G137; **4/8 görsel**, satış durumu `coming`) |

01–20: hepsi 8/8 görsel (2000 × 2000 PNG) + `video.mp4` (1080 × 1080, H.264, sessiz; ilk ve son kare 2026-10-16'da karşılaştırıldı,
ortalama fark < 4/255). Denetim (G124): 20 temas sayfası ve video kareleri gözle; `tools/tests/test_listing_editorial.py`,
`python3 tools/etsy_upload.py --check --strict` 20/20 OK.

**21 (G137, 2026-10-17):** 3, 5, 6, 7 ve video var; 1, 2, 4, 8 tasarımın GPT sahnelerini bekliyor (`assets/gpt/mockups/`
yalnız tasarım panosu; PAKET 3 prompt'ları `GPT_PROMPTS.md`'de, görev G821). Sahneler gelince:
`python3 tools/listing_editorial.py --theme 21 --capture --video`, sonra listing_v3 §0/§5/§11 ve `python3 tools/etsy_upload.py --designs 21`.
21'de `parts/` yok: kâğıt dokusu `assets/gpt/textures/paper-background.png`; `data-slot` sarmalayıcısı olmadığından çekim
mekân ekranını `img[data-photo="venue"]` ile bulur, örnek fotoğraflar temanın demo kaydından gelir (03'ün yedeği değil).

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
3. Yazı hiçbir telefonun üstüne binmez. Sahne üstündeki yazı, sahnenin sakin bölgesinde ve hafif kâğıt rengi geçişle durur
   (2. görselde adım etiketleri telefonların hemen altında başlayan kâğıt geçişinin üstünde: 07'nin koyu ahşabı, 13'ün
   patikası; 7. görselde adım yazıları sıkı bir geçişle).
4. Kapak yazısı Etsy arama kırpımının (4:3, y 250–1750) içinde kalır. 16 karakterden uzun ad iki satır.
5. İddialar docs/19 ve docs/05 §E'deki dürüst listeyle aynı: "Artwork, colors and fonts stay as designed", "Up to 3 questions",
   "Online until 12 months after your wedding".
6. Renkler temanın `palette.json`'undan; altın metin rengi olarak mürekkebe doğru karıştırılır (açık zeminde okunur).
   **Koyu tasarımlar** (06 lacivert, 17 zümrüt, 19 siyah: `ink` açık renk) kendi koyu zemininde (`mist_top` + kâğıt
   dokusu), açık yazı, siyah gölge ve açık logo (`bke-logo-horizontal-reverse.svg`) ile; 7. görselin açık keten
   fotoğrafında mürekkep temanın koyu `primary` rengi olur. Video arka planı da koyu tasarımda kendi koyu tonunda.
7. **Açılış nesnesi** (G099/G124): `platform/lib/marketing/designs.ts`'teki "Your guests tap the <nesne>." cümlesinden
   (`listing_kit.Theme.opening`). 06 ve 14 gatefold, 09 pouch ("linen pouch"), 12 wallet ("travel wallet"), 13 book
   ("storybook"), 18 sleeve ("vellum sleeve"); diğerleri envelope. 2. görselin orta etiketi ("The gatefold opens"),
   3. görselin alt satırı ("Storybook, home, …"), 8. görselin ilk maddesi ("Travel wallet opening and four pages") ve
   videonun cümlesi ("Guests tap the pouch and it opens.") bundan gelir; zarfsız tasarımda görsellerde "envelope" geçmez
   (`tools/tests/test_listing_editorial.py`, `tools/etsy_upload.py --check` alt metinleri de denetler).

## Sekiz görsel (+ 9. görsel, G148)

| # | Ad | Düzen | Malzeme |
|---|---|---|---|
| 1 | Cover | Tam sahne, üstte tür satırı + tasarım adı (italik) | `cover_hand_v2` + açılış sayfası ekranı (`g01_envelope`) |
| 2 | The opening | Üç telefon: kapalı → açılıyor → kart | `three_phones` + DPR 3 açılış kareleri (`opening_stills.json`) |
| 3 | Every page | Kâğıt üstünde 5 ekran, kademeli | gerçek misafir ekranları |
| 4 | Your editor | Solda kâğıt panel + liste, sağda elde telefon | `hand_phone_edit(_v2)` + editör "Edit your website" (`e01_edit_pages`) |
| 5 | RSVP | İki büyük ekran: misafirin formu / çiftin Guests sayfası | `g10_rsvp_form` + `p01_panel_replies` (G121 Guests: sayılar, arama, yanıtlar, Download list) |
| 6 | The details | Program, mekân, S&C | gerçek ekranlar |
| 7 | How it works | Üç adım, roma rakamları | **GM06 T1** `brand/trust/t1_three_steps.png` (keten üstünde üç telefon) + `b01_start`, `b04_setup_names`, `g02_home_top` |
| 8 | What's included | Masa üstü sahne + liste | `flatlay_phone(_v2)` + demo ekranı |
| 9 | Any device (G148, K47) | 5'in düzeni: kâğıt üstünde iki büyük ekran; "Start on your phone" / "Continue *on any device*" | gerçek ekranlar, `tools/listing_editorial/capture_devices.ts`: `m01_my_form` (/my, sipariş no + e-posta dolu) + `m02_devices` (Share → Use on another device, aynı siparişle 3 cihaz). Web adresi/QR yok: kartın /my satırı, QR satırı ve üstteki Share kartları resimde gizli. `--capture devices --only 09_devices` |

### Palet görselleri (G178, docs/25 §5)

`--palettes` sekiz/dokuz görselin yerine palet görsellerini yapar: `10_palettes.jpg` (5. görselin kâğıt düzeni, bütün
paletlerin kapalı açılış ekranı yan yana, altında palet adları) ve `palette_<id>.jpg` (iki büyük ekran: "Tap to open" /
"The <nesne> opens", başlık palet adı). Çekim: `capture_opening.ts --variants original,<id>,…` (her palet için o palette
yayınlanmış demo site, `opening_stills.json`'daki `open_mid` anı). JPEG q90: on altı ek PNG yerine depoda ~4 MB/tasarım.

### GM06 güven sahneleri (brand/trust/, G124 kararı)

| Sahne | Kullanıldı mı | Gerekçe |
|---|---|---|
| T1 üç telefon (başlat · düzenle · paylaş) | **Evet, 7. görsel** (20 tasarımın hepsinde) | Tam bu iş için üretildi; üç yeşil ekrana gerçek /start, kurulum ve yayındaki site ekranı oturur; alt metin 7 değişmeden doğru. Dükkân geneli ortak sahne; yazı rengi temanın paletinden. |
| T2 misafir RSVP, T3 çift düzenliyor | Hayır | Telefon karede küçük (genişliğin ~%15'i): gerçek ekran Etsy boyutunda okunmaz; 5. ve 4. görsel ekranı büyük gösteriyor ve alt metinleri buna göre. |
| T4 telefon + tablet + dizüstü | Hayır | Sekiz görsel listesinde "her cihaz" karesi yok; 4. görselin alt metni "a phone held in two hands" diyor. Dokuzuncu görsel olarak uygun (listing_v3 §5 önerileri), kullanıcı kararı. |
| T5 masa kartında QR | Hayır | İlan görsellerinde QR yok (Etsy Off-Platform, "QR'sız demo"). |
| T6 atölye masası | Hayır | Ekran yok; ürün özelliği anlatmıyor (dükkân "Hakkında" görseli için). |

## Bilinen sınır

GPT sahneleri 1254 px (kare) ya da 1536 px (yatay); GM06 T1 1254 px'ten 2000 px'e büyütülmüş. 2000 px tuvalde fotoğraf
kısmı ~1.6× büyütülür; ekranlar ve yazılar keskin, sahnenin dokusu hafif yumuşak. Daha yüksek çözünürlüklü sahne ya da
büyütme (upscale) kullanıcı kararıdır.

Ekranlar depodaki platform kodundan (yerel derleme) çekilir; canlı site daha eski bir sürümse görseldeki editör canlıdakinden
yeni olabilir (docs/10). Etsy'ye hiçbir şey yüklenmez (K41).
