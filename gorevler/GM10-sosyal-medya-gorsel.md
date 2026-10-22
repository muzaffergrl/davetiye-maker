---
id: GM10
baslik: Sosyal medya görselleri — 21 GPT görseli (öne çıkan kapakları, zeminler, yeşil ekranlı yaşam sahneleri)
rol: gpt-gorsel
durum: hazir
alan:
oncelik: 2
bagimli: []
yazar: [brand/social/gpt/, gorevler/GM10-sosyal-medya-gorsel.md]
---

## Amaç
BKE Studio'nun Instagram, TikTok ve Pinterest hesapları için ilk ayın görselleri (kullanıcı isteği 2026-10-22,
`docs/35_SOSYAL_MEDYA.md`). Ürünün kendisi gerçek ekran olarak sonra yerleşir; bu görev yalnız ortamı, zeminleri ve
ikonları üretir.

## Girdiler
- Prompt'lar: `brand/social/GPT_PROMPTS.md` (SM1.1–SM1.5, SM2.1–SM2.6, SM3.1–SM3.10). Kopyala-yapıştır hâli ve indirme
  adları: `docs/27_GPT_IS_LISTESI.md` / `.html`, **D · Diğer (marka)** grubu.
- Marka renkleri: `brand/tokens.json`.

## Yapılacaklar
1. Üç bölümü sırayla, her bölümü tek sohbette üret (SM1 → SM2 → SM3); her bölümün "Instructions for GPT" bloğunu
   o sohbetin ilk mesajına koy.
2. Her görselin **Kontrol** satırını uygula; yazı/harf/logo çıkarsa, ekran yeşili yansımalı ya da parmak altındaysa
   yeniden üret.
3. **Kaydet** satırındaki tam yolla kaydet. Deneme `_v2` ekiyle.

## Bitti sayılması için
- [ ] 21 dosya `brand/social/gpt/` altında; oranlar ±%2 içinde.
- [ ] Hiçbirinde yazı, harf, sayı, logo yok; SM3'te tek ve düz #00FF00 alan.
- [ ] `python3 tools/gpt_yerlestir.py --klasor <indirme klasörü>` kuru denemesi temiz (ya da dosyalar doğrudan yolunda).
- [ ] Commit + push: `GM10: sosyal medya görselleri`.

Sonra (Claude, G191): yeşil alanlara gerçek ekranlar, başlıklar, gönderi dosyaları.

## Sonuç
