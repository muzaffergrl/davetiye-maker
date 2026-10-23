---
id: G964
baslik: Yerel oturum — e-posta (SMTP), Gmail sipariş doğrulaması (IMAP) ve Google Sheets'i bkestudio01@gmail.com ile aç (K51)
rol: claude-tarayici
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [docs/10_SITE_PLATFORMU.md, docs/10_canli_test/, gorevler/G964-yerel-google-eposta.md]
---

## Amaç
K51 (2026-10-23): e-posta gönderimi, Etsy satış e-postalarıyla sipariş doğrulaması (G192, `trust` modu) ve Google Sheets bağlantısı
dükkânın Google hesabı bkestudio01@gmail.com ile canlıda açılır. Bulut oturumu Google / Vercel `bkestudio` ekibi / bkestudio.com'a
ulaşamıyor; iş kullanıcının bilgisayarındaki Claude in Chrome oturumunda.

## Yapılacaklar
`docs/37_YEREL_GOOGLE_EPOSTA_KURULUM.md` bloğu (adım 0–8): iki uygulama şifresi, Gmail IMAP / "Tüm Postalar", Etsy bildirim adresi
kontrolü, Vercel Production ortam değişkenleri (sırlar Sensitive), Google Cloud (Sheets API, Google Auth Platform: External,
BKE Studio, yalnız `drive.file`, In production; Web istemcisi, redirect `https://bkestudio.com/api/google/callback`), yeniden yayın,
admin "Test e-postası gönder" + "Gelen kutusunu dene", test sitesiyle Sheets + RSVP e-postası, temizlik.

## Bitti sayılması için
- [ ] Admin Bağlantılar: e-posta "Açık", test e-postası geldi; "Sipariş e-postaları (Gmail)" "Açık", "Gelen kutusunu dene" başarılı
- [ ] Test sitesinde Google Sheets bağlandı, bir RSVP tabloya düştü; test sitesi silindi
- [ ] Ekranlar `docs/10_canli_test/<YYYYMMDD>/`, docs/10 §2c'de tarihli satır; hiçbir sır repoda yok

## Sonuç
_(yerel oturum doldurur)_

## Günlük
- 2026-10-23 açıldı (docs rolü, claude/adoring-gates-docs): talimat docs/37 yazıldı; uygulanmadı.
