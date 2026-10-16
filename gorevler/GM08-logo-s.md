---
id: GM08
baslik: BKE Studio sembolünde K yerine S — 5 GPT logo dosyası (sembol, favicon, yatay, dikey, dükkân ikonu)
rol: gpt-gorsel
durum: inceleme
alan: codex-gpt-gorsel
oncelik: 1
bagimli: []
yazar: [brand/assets/gpt/final_s/, gorevler/GM08-logo-s.md]
---

## Amaç
Kullanıcı isteği (2026-10-16): logoda K yerine S. Yalnız sembol değişir; "BKE Studio" yazısı, renkler ve "The Reveal" fikri aynı.
Prompt'lar: `brand/GPT_PROMPTS.md` **B3.1–B3.5** (sırayla; her birinde `brand/assets/gpt/final/logo_horizontal.png` ve
`monogram.png` referans, B3.2–B3.5'te ayrıca B3.1 sonucu).

## Bitti sayılması için
- [ ] 5 dosya `brand/assets/gpt/final_s/` altında, istenen ölçü ve şeffaflıkta; her birinin "Kontrol" satırı sağlanıyor.
- [x] Commit + push: `GM08: S sembolü`.

Sonra (Claude, G129): SVG'ye izleme, site başlığı/favicon/e-posta, Etsy ikon ve banner, ilan görselleri ve START HERE PDF'lerinde değişim.

## Sonuç

B3.1–B3.5 aynı sohbette sırayla imagegen ile üretildi. Her çağrıda
`brand/assets/gpt/final/logo_horizontal.png` ve `monogram.png`; B3.2–B3.5'te ayrıca seçilen B3.1 S sembolü referans verildi.
Eski marka dosyaları değiştirilmedi.

| Çıktı (`brand/assets/gpt/final_s/`) | Ölçü | Zemin |
|---|---|---|
| `monogram_s.png` | 1024×1024 | Gerçek alfa |
| `monogram_small_s.png` | 1024×1024 | Gerçek alfa |
| `logo_horizontal_s.png` | 1536×1024 | Gerçek alfa |
| `logo_stacked_s.png` | 1024×1024 | Gerçek alfa |
| `shop_icon_s.png` | 1024×1024 | Opak |

Kontrol: beş PNG açılıp doğrulandı; ölçüler ve alfa kanalları kontrol edildi. S ve düz altın kama bütün çıktılarda mevcut;
yatay/dikey yazı harf harf `BKE Studio` (K korunuyor). Favicon 32 px önizlemede okunuyor. Profil ikonunda sembolün
en uzak noktası merkezden tuval genişliğinin %32,36'sında; %35 yarıçaplı güvenli dairenin içinde. Dikey logonun
kenarında 10 pikselde yalnız 1/255 alfa kalıntısı var; görünür içerik kesilmiyor.

Yeniden üretim: B3.1, düz renk şartı için iki kez; B3.5, altın kamanın %70 çaplı güvenli daireye sığması için bir kez
düzeltildi. Yalnız seçilen beş çıktı eklendi. Üreticinin 1254×1254 kare çıktıları ImageMagick ile 1024×1024'e
ölçeklendi; şekil çizimi veya kodla piksel boyama yapılmadı.

**Açık inceleme maddesi:** tekrar üretimlere rağmen raster dolgularında hafif ton/doku farklılıkları var;
kesin iki/üç düz renk ve tam HEX eşitliği sağlanmadı. Bu nedenle ilk kabul kutusu açık, durum `inceleme`.
G129'daki SVG izleme ve kesin palet uygulaması bu görevde yapılmadı.

Dal geçmişi korundu. `git pull --rebase origin main` denemesi mevcut birleşimleri yeniden oynatıp görev dışı
`G101-tema-qa-duzeltme.md` çatışmasına girdiği için geri alındı; `origin/main` dalın atası olarak doğrulandı.

## Günlük
- 2026-10-16 açıldı (koordinatör; kullanıcı isteği)
- 2026-10-16 alindi: codex-gpt-gorsel
- 2026-10-16 bitti, incelemeye gönderildi
- 2026-10-16 teslim alındı, G129'da kullanıldı (5 PNG izlendi: `brand/svg/`, favicon/uygulama ikonları, Etsy dükkân ikonu)
