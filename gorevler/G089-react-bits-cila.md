---
id: G089
baslik: React Bits Pro ile cila — satış sitesi, panel ve düğün sitelerini "yaşayan" hâle getir (K31)
rol: claude-kod
durum: inceleme
alan:
oncelik: 2
bagimli: [G088]
yazar: [platform/components/marketing/, platform/components/panel/, platform/components/fx/, platform/app/(marketing)/, platform/package.json, platform/package-lock.json, platform/tests/, platform/previews/g089/, docs/14_SATIS_SITESI.md, docs/16_PANEL_V2.md]
---

## Amaç
K31: siteyi React Bits Pro bileşenleriyle daha canlı yapmak — giriş animasyonları, kaydırmayla beliren bölümler, metin/ışık efektleri,
galeri ve kart etkileşimleri. Önce satış sitesi ve panel (React); düğün temaları statik HTML/JS olduğu için orada yalnız hafif,
bağımsız efektler ve tema standardına (docs/11 §6 performans bütçesi, §10 azaltılmış hareket) uyanlar.

## Yapılacaklar
1. React Bits Pro lisansı ve kurulum yolu (kullanıcının hesabı; lisans anahtarı repoya/log'a yazılmaz). Erişim yoksa blokaj.
2. G088'in ekran listesine göre bileşen seçimi; her biri için `prefers-reduced-motion` karşılığı, mobil performans (LCP/CLS), paket boyutu.
3. Uygula, ölç (Lighthouse/Playwright 390 + 1280), önizleme `platform/previews/g089/`.
4. Düğün temalarına uygun efektler için docs/11'e öneri (tema standardı değişikliği ayrı görev).

## Sonuç
Dal `claude/g089-cila` (taban `claude/zealous-fermi-hy1o40`). **React Bits Pro lisansı bu oturumda yok** (madde 1 açık blokaj);
koordinatör kararıyla açık kaynak **React Bits (MIT)** kullanıldı. Pro bileşen yok, yeni npm paketi yok (`motion` de eklenmedi):
ShinyText kaynağı MIT başlığıyla uyarlandı; AnimatedContent/FadeContent, SpotlightCard, TiltedCard fikirleri CSS + tek küçük istemci
bileşeniyle yazıldı (`platform/components/fx/`). Ayrıntı: docs/14 §14.5, docs/16 "G089".
- **Satış sitesi:** hero ışık bandı (eyebrow), telefon arkasında yumuşak ışık + süzülme, ana düğmede parıltı; ilk ekran altı bölümler
  kaydırınca belirir (kademeli kartlar); tasarım kartlarında imleç ışığı, 3B eğim, açılmış ekranın yükselmesi, dokunmada basma; çip ile
  afiş geçişi; "how it works" adım + çizgi akışı; açılış okları; tasarım sayfasında ekran destesi dağıtma; /designs filtre geçişi;
  çapraz belge görünüm geçişi (Chromium). Fiyat/hizmet bölümüne dokunulmadı.
- **Panel:** görünüm geçişi (yalnız opaklık), basma, açılır bölüm, "Saved" işareti, hazır olma çubuğu dolumu, önizleme iskeleti +
  yumuşak yükleme, yayın başarı ekranında bir kez kutlama. Panel mantığı/alanları/etiketleri değişmedi (Setup.tsx 2 satır, PreviewPane
  1 öznitelik, edit sayfası 1 import).
- **Admin:** sayfa açılışı ve site kartlarının sırayla gelişi, imleçle hafif kalkma.
- `prefers-reduced-motion`: hepsi kapalı; hiçbir bölüm gizlenmez (test edildi). Temalara dokunulmadı.
- **Ölçüm** (`tests/g089-browser.ts`, marketing-browser bütçesiyle aynı kısıtlama, 390 px): önce → sonra LCP / 1516 → 1408 ms,
  /designs 852 → 808, olive-ivory 1460 → 1396, coastal-seaside 1400 → 1368, rehber 904 → 856; CLS ≤ 0.0003 → 0; aktarım +2–3 KB,
  script 140 → 141 KB; hero h1 ve ana düğme ilk karede opak/dönüşümsüz. 33/33. `platform/previews/g089/checks_{before,after}.json`.
- `npm test` 1225/1225, typecheck ve `npm run build` yeşil (son kodda). Görüntüler `platform/previews/g089/` (390 + 1280; adım akışı ve ekran destesi animasyon ortasında). Tam Playwright süitleri
  koşulmadı (kullanıcı isteği: hız). Gerçek telefon testi yok.
- Madde 4 (düğün temaları için docs/11 önerisi) yapılmadı — temalara dokunma kuralı; ayrı görev.

## Günlük
- 2026-10-15 açıldı (kullanıcı isteği K31)
- 2026-10-16 claude-kod (G089 oturumu): açık kaynak React Bits ile uygulandı, ölçüldü → inceleme
