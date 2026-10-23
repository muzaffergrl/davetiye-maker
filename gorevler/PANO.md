# Görev panosu (otomatik)

`python3 tools/gorev.py pano` ile üretilir; **gerçek durum görev dosyalarındadır**. Bu dosya kabuk
çalıştıramayan ajanlar içindir: kendi rolünün **Alınabilir** listesindeki ilk görevi al.

Özet: hazir 6 · alindi 0 · inceleme 24 · blokaj 2 · bitti 243 · iptal 257 · toplam 532

İptal edilen görevler (K22/K24 ile anlamını yitirenler) listelenmez; yalnız sayıları var. Ayrıntı: `python3 tools/gorev.py liste --hepsi`.

## claude-canva

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (0)**

- (yok)

Bağımlılık bekleyen: 0 · Biten: 24 · İptal: 64

## claude-tarayici

**Alınabilir (2)**

- `G964` p1 — Yerel oturum — e-posta (SMTP), Gmail sipariş doğrulaması (IMAP) ve Google Sheets'i bkestudio01@gmail.com ile aç (K51) → `gorevler/G964-yerel-google-eposta.md`
- `G965` p1 — Yerel oturum — Etsy ilk satış dalgası: PDF yenileme, alıcı mesajı + SSS, yalnız 01–20 yayını ("yayınla" onayıyla) (K55) → `gorevler/G965-yerel-etsy-ilk-dalga.md`

**Üzerinde çalışılan / incelemede / blokaj (0)**

- (yok)

Bağımlılık bekleyen: 1 · Biten: 8 · İptal: 42

## claude-kod

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (4)**

- `G191` inceleme · claude-session_015RTF9kCAoVGh7PDNq8XYeP — Sipariş kontrolü "önce güven, sonra doğrula" (CLAIM_ORDER_VERIFICATION=trust) + saatlik kontrol
- `G192` inceleme · claude-session_015RTF9kCAoVGh7PDNq8XYeP — Önce güven modunda siparişi Gmail'deki Etsy satış e-postasından doğrulama (IMAP)
- `G980` inceleme · claude-session-nice-faraday — Satış sitesi SEO / GEO / AEO — claude-seo ile denetim ve düzeltme
- `G966` inceleme · claude-session_012jLH6SCFqEm45m7Yf9wdxm — Canlı izleme — saatlik salt okunur bkestudio.com kontrolü (GitHub Actions) + başarısızlıkta tek issue

Bağımlılık bekleyen: 1 · Biten: 138 · İptal: 83

## claude-metin

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (21)**

- `G193` inceleme · claude-session-nice-faraday — Rehber N1 (animated envelope) ve N2 (RSVP questions) — İngilizce
- `G194` inceleme · claude-session-nice-faraday — Rehber N1 ve N2 çevirisi — TR, DE, ES, FR + çevirilerde yeni iç linkler
- `G195` inceleme · claude-session-nice-faraday — Rehber dalga 2 — N3 (davetiye mi website mi) ve N4 (websiteyi davetiyeye koymak), İngilizce
- `G196` inceleme · claude-session-nice-faraday — Rehber N3 ve N4 çevirisi — TR, DE, ES, FR + çevirilerde dalga 2 iç linkleri
- `G197` inceleme · claude-session-nice-faraday — Rehber dalga 3 — N5 (RSVP son tarihi), N6 (cevap vermeyen misafir), G3 odak değişikliği; İngilizce
- `G198` inceleme · claude-session-nice-faraday — Rehber N5 ve N6 çevirisi — TR, DE, ES, FR + G3 çevirilerinin yeni yapıya getirilmesi + değişen linkler
- `G199` inceleme · claude-session-nice-faraday — Rehber dalga 4 — N7 (ücretsiz mi ücretli mi) ve N8 (Our Story örnekleri), İngilizce
- `G200` inceleme · claude-session-nice-faraday — Rehber N7 ve N8 çevirisi — TR, DE, ES, FR + çevirilerde dalga 4 iç linkleri
- `G981` inceleme · claude-session-nice-faraday — Rehber içerik planı — claude-seo kümeleme, 12 yeni rehber, dalga 1 brifleri
- `G982` inceleme · claude-session-nice-faraday — Rehber dalga 5 — N9 (SSS örnekleri) ve N10 (destination düğün sitesi kontrol listesi), İngilizce
- `G983` inceleme · claude-session-nice-faraday — Rehber N9 ve N10 çevirisi — TR, DE, ES, FR + çevirilerde dalga 5 iç linkleri
- `G984` inceleme · claude-session-nice-faraday — Rehber N11 (gizlilik) ve N12 (QR) — İngilizce + dalga 6 iç linkleri
- `G985` inceleme · claude-session-nice-faraday — Rehber N11 ve N12 çevirisi — TR, DE, ES, FR + çevirilerde dalga 6 iç linkleri
- `G986` inceleme · claude-session-nice-faraday — İlk 6 rehberin gözden geçirmesi — kaynaklar, ürün iddiaları, iç linkler (5 dil)
- `G987` inceleme · claude-session-nice-faraday — İçerik planının kalan maddeleri — iç link matrisi açıkları ve G5 mesaj örnekleri (5 dil)
- `G989` inceleme · claude-session-nice-faraday — Rehber N13 (iki dilli düğün websitesi) ve N14 (düğünden sonra website) — İngilizce + iç linkler
- `G990` inceleme · claude-session-nice-faraday — Rehber N13 ve N14 çevirisi — TR, DE, ES, FR + çevirilerde dalga 7 iç linkleri
- `G991` inceleme · claude-session-nice-faraday — Rehber N15 (davetiyeyi evde ya da matbaada basmak) ve N16 (düğün hafta sonu programı) — İngilizce + iç linkler
- `G992` inceleme · claude-session-nice-faraday — Rehber N15 ve N16 çevirisi — TR, DE, ES, FR + çevirilerde dalga 8 iç linkleri
- `G988` inceleme · claude-session-nice-faraday — İçerik planı — yeni rehber konusu adayları (N13–N18)
- `G050` blokaj · - — Etkinlik türü metin setleri (Save the Date, Engagement, Bridal Shower)

Bağımlılık bekleyen: 0 · Biten: 10 · İptal: 20

## claude-qa

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (0)**

- (yok)

Bağımlılık bekleyen: 0 · Biten: 2 · İptal: 20

## gpt-gorsel

**Alınabilir (2)**

- `GM10` p2 — Sosyal medya görselleri — 21 GPT görseli (öne çıkan kapakları, zeminler, yeşil ekranlı yaşam sahneleri) → `gorevler/GM10-sosyal-medya-gorsel.md`
- `GP216` p6 — Aşama 2 · Tasarım 16 — 5 palet görselleri → `gorevler/GP216-palet-gorsel.md`

**Üzerinde çalışılan / incelemede / blokaj (1)**

- `GM07` blokaj · gpt-gorsel-GM07 — Tasarım 15–20 rötuş parçaları — tema ajanlarının önerdiği 6 GPT parçası (yuvarlak çerçeveler, fiyonk, geri sayım kutusu, hap dalı, yatay çerçeve)

Bağımlılık bekleyen: 0 · Biten: 61 · İptal: 28
