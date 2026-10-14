---
id: G068
baslik: Neredeyse her metin düzenlenebilir — tema başlık/etiketleri panelden değişsin (varsayılan + sıfırla)
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: [G060]
yazar: [platform/lib/, platform/components/panel/, platform/app/api/, platform/themes/olive-ivory/, platform/themes/blush-garden-rose/, platform/tests/, docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, platform/README.md, platform/previews/g068/]
---

## Amaç
Kullanıcı (2026-10-14): "en kolay şekilde düzenlenebilir olmalı mutlaka, neredeyse tüm alanlar". Bugün isimler, tarih, mekân,
program, hikâye, SSS, RSVP soruları, linkler ve fotoğraflar düzenleniyor; ama tema başlıkları ve etiketleri sabit ("You are
invited", "We're getting married", "Order of the Day", "Will You Join Us?", "Kindly reply by", "Moments we hold dear",
gezinme etiketleri, düğme yazıları…). G059 bu yüzden ilan metnini "her yazı değişmez" diye düzeltmek zorunda kaldı.

## Yapılacaklar
1. **Motor:** temalarda sabit metinler `data-copy="<anahtar>"` işaretiyle (iç metin = tema varsayılanı). Motor `content.copy.<anahtar>`
   doluysa onu (HTML kaçışlı, uzunluk sınırlı) koyar, boşsa varsayılan kalır. `aria-label`/`title`/`<title>`/`og` gibi öznitelik
   metinleri de kapsanır (`data-copy-attr`). Anahtar listesi tema derlemesinde otomatik çıkarılır (`theme.json` → `copy` manifesti:
   anahtar, varsayılan, sayfa, en uzun izinli uzunluk — tasarımın taşmadan taşıyabileceği; docs/11 stres kayıtlarıyla doğrulanır).
2. **Şema + doğrulama:** `docs/03` ve `lib` doğrulaması `copy` nesnesi (bilinmeyen anahtar reddedilir, uzunluk sınırı tema manifestinden).
3. **Panel:** Edit altında **"Wording"** bölümü — sayfa sayfa gruplanmış, her satırda varsayılan gri ipucu, canlı önizleme, tek dokunuşla
   "Reset to design text". En çok değişenler üstte (ör. davet başlığı, RSVP başlığı). Kimlik hakkı sistemini (G060) **etkilemez**.
   Ayrıca etkinlik türü kısayolu: "Wedding / Vow renewal / Elopement…" seçince ilgili başlıklar topluca önerilir (isteğe bağlı; yalnız öneri).
4. **Temalar:** 01 olive-ivory ve 03 blush-garden-rose'taki bütün görünür sabit metinler işaretlenir (gezinme ve düğmeler dahil).
   `docs/11_TEMA_STANDARDI.md`'ye kural: yeni temalarda her görünür sabit metin `data-copy` taşır; theme-check bunu denetler
   (işaretsiz görünür metin = hata, izin listesi hariç).
5. **Testler:** motor (kaçış, sınır, varsayılan), API, panel tarayıcı yolculuğu (değiştir → önizle → yayınla → misafir sayfası),
   theme-check `--stress` her iki temada uzun `copy` değerleriyle; `final-smoke`, `g051-browser`, `g060-browser` geçmeli.
6. Önizleme: `platform/previews/g068/` (panel Wording 390 px, değişmiş başlıklarla misafir sayfaları).

## Bitti sayılması için
- [ ] 01 ve 03'te görünür her sabit metin panelden değişir ve sıfırlanır; theme-check işaretsiz metin bulmaz
- [ ] Bütün testler geçti; docs/11 ve README güncel

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği (neredeyse tüm alanlar düzenlenebilir); panel v2 düzeltme turu bitince başlar
