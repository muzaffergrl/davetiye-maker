# davetiye-maker

**BKE Studio** (Etsy dükkânı **STUDIOBKE**) — yabancı (İngilizce) Etsy alıcılarına satılan **düğün websitesi tasarımları**.
Alıcı Etsy'den bir tasarım alır, Etsy'nin verdiği START HERE PDF'indeki linkle **bkestudio.com/start**'a gelir, Etsy sipariş
numarası + e-postasıyla kendi sitesini açar ve **telefondan panelde** düzenleyip yayınlar (K22/K24):

- Mobil öncelikli site: kapalı zarf (bazı tasarımlarda kanatlı kart, kese, kitap) açılışı, temaya özel ses efektleriyle; ana sayfa, hikâye, detaylar, RSVP
- Düzenleme paneli: isim, tarih, foto, program, RSVP soruları, müzik, 5 dil; yanıtlar Excel / Google Sheets
- Basılabilir davetiye PDF'i ve paylaşım QR'ı panelden; alıcıya giden **START HERE** PDF'i (QR'lı başlangıç rehberi)

Kod `platform/` (Next.js), 49 tasarım `platform/themes/` + `collections/` (01–20 ilk satış dalgası, K55). Canva / video dönemi
(K22 öncesi) belgeleri tarihçedir; güncel durum `docs/18_GUNCEL_DURUM.md` ve `PROJECT_STATE.json`.

> Bu repo **dahili geliştirme deposudur**. Müşteriye satılan paket değildir; düzenleme
> linkleri ve rakip referansları içerir. Private tutulmalıdır.

## Önce bunu oku

| Dosya | Ne için? |
|---|---|
| [`00_ANA_DEVIR.md`](00_ANA_DEVIR.md) | İşin tamamı: ne, neden, nasıl, karar geçmişi, son durum (**tek gerçek kaynak**) |
| [`AGENTS.md`](AGENTS.md) | Yapay zekâ ajanları (Claude Code, Codex/Astra) için kısa çalışma kuralları |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code'a özel ekler (AGENTS.md'yi içe alır) |
| [`PROJECT_STATE.json`](PROJECT_STATE.json) | Makinece okunur durum haritası (satış durumu, yayın, açık kararlar) |
| [`docs/18_GUNCEL_DURUM.md`](docs/18_GUNCEL_DURUM.md) | Bugünkü durum, tek sayfa |
| [`docs/29_LANSMAN_LISTESI.md`](docs/29_LANSMAN_LISTESI.md) | İlk satış dalgası (01–20) lansman listesi |
| [`docs/10_SITE_PLATFORMU.md`](docs/10_SITE_PLATFORMU.md) | Platform mimarisi ve yayın kaydı (§2c) |
| [`gorevler/PANO.md`](gorevler/PANO.md) | Rol başına alınabilir görevler |

## Klasör yapısı

```text
00_ANA_DEVIR.md            Ana devir belgesi
AGENTS.md / CLAUDE.md      Ajan kuralları
PROJECT_STATE.json         Genel iş + koleksiyon durumu
docs/
  01_KULLANICI_KARARLARI.md  Kısa, izlenebilir karar kaydı
  02_SIRADAKI_ISLER.md       Üretim bitiş sırası
  03_URUN_ICERIK_SEMASI.json Tek içerik kaydı şeması (JSON Schema)
platform/                  Site + panel + satış sitesi (Next.js; README'si içinde)
  themes/<tema>/           49 tasarımın platform temaları
collections/
  NN_<Ad>/                 Tasarım başına içerik kaydı, GPT parçaları, Etsy paketi (package/listing, package/customer)
  01_Olive_Ivory/            İlk koleksiyon (çalışma adı — marka değil)
    COLLECTION_STATUS.md
    content.demo.json        Demo içerik kaydı (Avery & Jordan — kurgu)
    canva/                   Design ID'leri ve bekleyen düzeltmeler
    assets/                  Zarf, mühür, dekor parçaları
    website/                 Responsive HTML kaynak
    previews/                Kaynağı belirtilmiş önizlemeler
    references/approved/     Kendi onaylı görsel yönlerimiz
    references/market_only/  Rakip örnekleri — ASLA satışa girmez
    archive/                 Eski planlar
tools/
  validate_content.py      İçerik kaydını şemaya ve kurallara göre denetler
  make_qr.py               Gerçek hedef URL'den algoritmik QR üretir
.claude/
  agents/                  Proje alt-ajanları (Canva üretim, QA, website, Etsy metni)
  skills/                  Proje skill'leri (güvenli Canva düzenleme, tutarlılık, QR, yeni koleksiyon)
  settings.json            İzinler + oturum başlangıç kancası
.mcp.json                  Proje MCP sunucuları (Canva, Playwright)
```

## Araçlar

```bash
pip install -r tools/requirements.txt

# İçerik kaydını denetle
python tools/validate_content.py collections/01_Olive_Ivory/content.demo.json

# Gerçek URL'den QR üret (PNG + SVG)
python tools/make_qr.py "https://ornek-site.com/rsvp" -o collections/01_Olive_Ivory/previews/rsvp_qr

# HTML animasyonu 1080×1920 MP4'e render et (Playwright + ffmpeg gerekir)
NODE_PATH="$(npm root -g)" node tools/render_motion.mjs collections/02_Dusty_Blue/video/invitation_motion.html out.mp4 26 30 --stills=2,9.8
```

## MCP ve ajan kurulumu

- **Canva MCP** (`.mcp.json` → `https://mcp.canva.com/mcp`): ilk kullanımda Canva hesabıyla
  OAuth girişi ister. claude.ai bulut oturumlarında Canva bağlayıcısı hesap düzeyinde zaten
  bağlıysa onu kullanır.
- **Playwright MCP**: website'in 360 / 390 / 430 px telefon, tablet ve masaüstü kontrolleri için.
- **Codex / Astra**: `AGENTS.md`'yi otomatik okur. `.claude/skills/*/SKILL.md` dosyaları düz
  Markdown prosedürlerdir; Codex'te de adım listesi olarak okunabilir.

## Durum

2026-10-23: 01–20 ilk satış dalgası (Etsy'de taslak, sahibin "yayınla" onayını bekliyor; K55), 21–49 önizleme / yakında.
Ayrıntı ve açık kararlar: [`docs/18_GUNCEL_DURUM.md`](docs/18_GUNCEL_DURUM.md), lansman adımları:
[`docs/29_LANSMAN_LISTESI.md`](docs/29_LANSMAN_LISTESI.md).
