# GPT işi — PAKET 7: Etsy ilanının 10–20. görselleri (2026-10-21)

Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (ilan başına **20 fotoğraf + 2 video**); ürünü ön planda gösteren,
detayları anlatan, alıcının içini rahatlatan, satın almaya teşvik eden kareler; üstüne gelince oynayan video çok önemli.
İlanlarda şu an 9 görsel + 1 video var → tasarım başına **11 sahne**, 01–21: **231 görsel**. 2. video (promo) GPT'ye
verilmez: Claude gerçek site kaydından yapar (aşağıda "Sonra").

- Prompt'ların tek kaynağı: her tasarımın `collections/<NN>_*/assets/gpt/GPT_PROMPTS.md` → **PAKET 7** (7.1–7.11).
  Üreten: `python3 tools/paket7_ilan.py --all` (sahne dünyası PAKET 3'ten okunur; değişiklik için betiği düzenle, yeniden üret).
- GPT yalnız **sahne** üretir: ekranlar ve 7.7'deki kartın ön yüzü **düz parlak yeşil**. Gerçek site ekranlarını ve gerçek
  basılı davetiye render'ını Claude yerleştirir (`tools/mockup_compose.py`, docs/21). Etsy kuralı gereği ilan ürünü olduğu
  gibi gösterir; GPT'nin çizdiği arayüz/ekran kullanılmaz.
- Çıktı yolu: `assets/gpt/mockups/p7_NN_*.png`.

### İlk deneme (2026-10-21) neden boş döndü
GPT 21 tasarımda yalnız 7.1'i iki kez üretti, 42 çıktının hepsini "ölçü / tam #00FF00" kontrolünden geçemedi diye reddetti ve
kalan 10 sahneye geçmedi. Kontrol yanlış yazılmıştı: görsel modeli tam piksel ölçüsü ve tam #00FF00 vermez, buna gerek de yok.
`mockup_compose.py` yeşil baskın pikselleri toleransla okur (GPT'nin "düz yeşili" ≈ (3, 252, 45)) ve her ölçüyle çalışır
(eski sahneler 1254×1254 ve 1536×1024). Kontrol satırları "gözle, oran doğru, en fazla 2 deneme, en iyisini kaydet, sonraki
sahneye geç" olarak düzeltildi; video GPT işinden çıkarıldı.

## GPT'ye (Codex, repo erişimli) yapıştırılacak talimat

```
Task: BKE Studio Etsy listing scenes, PAKET 7, designs 01–21 (repo muzaffergrl/davetiye-maker, branch main).
First run: git pull --rebase origin main (the prompt files were updated).
Work in parallel: one sub-agent per design (21 sub-agents: 01 … 21). Each sub-agent works only inside its own folder
collections/<NN>_*/assets/gpt/ and does this:
1. Open collections/<NN>_*/assets/gpt/GPT_PROMPTS.md and find "## PAKET 7".
2. In ONE image chat: send the "Instructions for GPT" block first, then generate ALL of 7.1 to 7.11 in order, each English
   prompt exactly as written. Square scenes in the model's square size, landscape scenes in its 3:2 size; the exact pixel
   size does not matter.
3. Check each image BY EYE (do not measure pixels): the right number of flat, bright, even green screen areas (a green like
   RGB 3,252,45 is fine; it does not need to be exactly #00FF00), all four corners of each green area visible, nothing
   covering a green area, no text/letters/numbers/logos, no brand marks. If it fails, regenerate at most 2 times, then save
   the best attempt anyway and note the problem. Never stop early: always continue to the next scene until 7.11 is done.
4. Save each image with the exact file name on its "Kaydet" line (assets/gpt/mockups/p7_NN_*.png). Do not make a video.
5. Commit only that design's new PNG files: "PAKET 7 <NN>: ilan sahneleri" and push (git pull --rebase origin main first).
   Do not edit GPT_PROMPTS.md or any other file.
When all finish, report one line per design: NN, images saved (x/11), which ones are imperfect and why. Do not invent results.
```

## Sonra (Claude)
- Her tasarımda 11 sahneye gerçek ekranlar ve başlıklar yerleştirilir (ilan görselleri 10–20), Etsy taslaklarına eklenir.
  Ekran eşleşmesi: 7.1 açılış nesnesi yakın · 7.2 kapalı açılış ekranı · 7.3 home · 7.4 home (telefon) + details (tablet) ·
  7.5 düzenleyici (masaüstü) · 7.6 düzenleyici + misafir sayfası · 7.7 basılı davetiye ön yüzü + home · 7.8 dört sayfa
  (home, story, details, rsvp; ya da dört dil) · 7.9 details + harita · 7.10 teşekkür modu · 7.11 Share ekranı.
- **Promo video (2. video):** gerçek site kaydından, `package/listing/video_promo.mp4` (1080×1080, H.264, sessiz, 12–15 sn):
  açılış → sayfalar → düzenleyici → RSVP. Yapay zekâ videosu kullanılmaz.
