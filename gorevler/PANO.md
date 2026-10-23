# Görev panosu (otomatik)

`python3 tools/gorev.py pano` ile üretilir; **gerçek durum görev dosyalarındadır**. Bu dosya kabuk
çalıştıramayan ajanlar içindir: kendi rolünün **Alınabilir** listesindeki ilk görevi al.

Özet: hazir 4 · alindi 0 · inceleme 2 · blokaj 2 · bitti 221 · iptal 257 · toplam 486

İptal edilen görevler (K22/K24 ile anlamını yitirenler) listelenmez; yalnız sayıları var. Ayrıntı: `python3 tools/gorev.py liste --hepsi`.

## claude-canva

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (0)**

- (yok)

Bağımlılık bekleyen: 0 · Biten: 24 · İptal: 64

## claude-tarayici

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (0)**

- (yok)

Bağımlılık bekleyen: 1 · Biten: 8 · İptal: 42

## claude-kod

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (2)**

- `G191` inceleme · claude-session_015RTF9kCAoVGh7PDNq8XYeP — Sipariş kontrolü "önce güven, sonra doğrula" (CLAIM_ORDER_VERIFICATION=trust) + saatlik kontrol
- `G192` inceleme · claude-session_015RTF9kCAoVGh7PDNq8XYeP — Önce güven modunda siparişi Gmail'deki Etsy satış e-postasından doğrulama (IMAP)

Bağımlılık bekleyen: 1 · Biten: 127 · İptal: 83

## claude-metin

**Alınabilir (0)**

- (yok)

**Üzerinde çalışılan / incelemede / blokaj (1)**

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

Bağımlılık bekleyen: 0 · Biten: 50 · İptal: 28
