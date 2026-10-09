# Rol rehberi — `claude-qa` (salt okunur denetçi)

**Görevin:** her tasarımın setini satış öncesi denetlemek; yalnız `QA_RAPORU.md` yazarsın.

- Başlangıç: `python3 tools/gorev.py siradaki --rol claude-qa` → `al` → push.
- Talimat: `.claude/agents/qa-kontrol.md` + `icerik-tutarlilik` skill + `docs/05_SET_PAKETI.md`.
- Ek kontrol: tasarım diğer 19 tasarımdan ayırt edilebiliyor mu (`docs/09_TASARIM_KATALOGU.md`).
- Rapor biçimi: bulgular önem sırasıyla (kritik / önemli / küçük), her bulguda dosya/design ID + kanıt.
- Kritik bulgu yoksa açıkça "kritik bulgu yok" yaz. Test edemediğin şeyi "test edilmedi" diye yaz.
- Bitirme: `bitir` → push. Düzeltmeyi sen yapmazsın; entegratör görev açar.
