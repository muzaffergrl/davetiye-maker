---
id: G090
baslik: Aşama 1 kapanışı — 20 tasarımın eksiksiz paketi (platform teması, satış sayfası, START HERE, Etsy ilanı, ilan görselleri) QA'dan geçti
rol: claude-canva
durum: hazir
alan:
oncelik: 2
bagimli: [G098, G121, G122, G123, G124]
yazar: [docs/09_TASARIM_KATALOGU.md, PROJECT_STATE.json]
---

## Amaç
K22/K24'e göre 20 tasarımın her birinin **satışa hazır paketini** tamamlanmış ve denetlenmiş saymak. Bu görev entegratörün
kapısıdır: bağımlılıklar bitince paketleri tek tek denetler (ya da qa-kontrol alt-ajanına denetletir), sonucu yazar ve kapatır.
Video, Canva seti, PDF davetiye ve paylaşım görseli **pakette yok** (K22/K24; eski GQNN/G027 bu yüzden iptal).

## Bir tasarımın eksiksiz paketi (K22/K24)
| # | Parça | Nerede | Kaynak görev |
|---|---|---|---|
| 1 | Platform teması — onaylı, `theme-check --stress` 0 hata, `g051-browser`, `final-smoke` yeşil; rötuşlar | `platform/themes/<slug>/` | G401–G420 (bitti), G101, G098 |
| 2 | Satış sitesi tasarım sayfası — `/designs/<id>`, gerçek ekranlar, `/start?theme=<id>` çalışıyor | `platform/app/(marketing)/` | G082–G097, G099; kalanlar G121 |
| 3 | START HERE — `START_HERE.md` + `START_HERE.pdf`; gerçek başlat URL'sinden `tools/make_qr.py` ile QR, QR çözülüp URL'yle eşleşiyor | `collections/<NN>/package/customer/` | G091 (01–05), G122 (20 tasarım) |
| 4 | Etsy ilan metni — `listing_v3.md` + `etsy_upload.json` (`tools/etsy_upload.py --check` geçer: başlık ≤ 140, 13 etiket ≤ 20) | `collections/<NN>/package/listing/` | G091 + docs/20 §8 (01–05), G123 (06–20) |
| 5 | İlan görselleri — editoryal set (8 × 2000 px) + Etsy sahneleri | `collections/<NN>/package/listing/images_editorial/` | v4 (01–05, dalda), G124 (06–20) |
| 6 | QA — içerik tutarlılığı (isim/tarih/tema adı/URL her yerde aynı), linkler ve QR, 360–430 px mobil, ilan iddiaları gerçek davranışla uyumlu | QA raporu (bu görevin Sonuç'u veya `docs/`) | G090 (bu görev) |

## Yapılacaklar
1. Bağımlılıklar `bitti` olunca 20 tasarım × 6 parça tablosunu doldur (var / eksik / bulgu).
2. qa-kontrol alt-ajanıyla denetim (salt okunur); kritik bulgu varsa ilgili göreve geri gönder, yeni görev öner.
3. `docs/09_TASARIM_KATALOGU.md` ve `PROJECT_STATE.json`'da tasarımların durumunu güncelle; `onayla G090`.

## Bitti sayılması için
- [ ] 20 tasarımın 6 parçası var; tablo Sonuç'ta
- [ ] QA: kritik bulgu yok (orta/düşük bulgular gerekçesiyle listelenmiş)
- [ ] Yapılmayan test "yapılmadı" diye yazılı (gerçek telefon, QR'ın telefon kamerasıyla okutulması, Etsy'ye yükleme)

**Bu görevin dışında (lansman kararları, `docs/18_GUNCEL_DURUM.md`):** fiyat, ilanların Etsy'ye yüklenmesi/yayını, gerçek telefon
testi (`docs/20_ELLE_TEST_PLANI.md`), e-posta altyapısı, React Bits Pro (G089).

## Aşama 2 (K16) — yer tutucu
K16 geçerli: her tasarıma ek 5 renk → 120 ürün. Eski Aşama 2 görevleri (GP1NN–GP4NN, G040, G041, G070–G074) Canva/video
dönemine göre yazıldı; **iptal edilmedi**, blokajda bekliyor. Kullanıcının yeni iş listesiyle platform teması renk varyantı
olarak yeniden tanımlanacak (G090 sonrası).

## Sonuç
_(entegratör doldurur)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-16 yeniden tanımlandı (G125, K22/K24): paket = platform teması + satış sayfası + START HERE + Etsy ilan metni + ilan görselleri + QA; bağımlılıklar G098, G121–G124; durum hazir
