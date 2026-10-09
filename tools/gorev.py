"""Görev panosu aracı — gorevler/Gxxx-*.md dosyalarını okur ve günceller.

Protokol: gorevler/README.md. Bağımlılık yok (yalnız standart kütüphane).

  python3 tools/gorev.py liste [--rol ROL]
  python3 tools/gorev.py siradaki --rol ROL
  python3 tools/gorev.py al GXXX --ajan AD
  python3 tools/gorev.py bitir GXXX            # durum: inceleme
  python3 tools/gorev.py onayla GXXX           # durum: bitti (entegratör)
  python3 tools/gorev.py blokaj GXXX "neden"
  python3 tools/gorev.py kontrol
  python3 tools/gorev.py pano                  # gorevler/PANO.md'yi yeniden üretir
"""
import argparse
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "gorevler"
ROLLER = {"claude-canva", "claude-tarayici", "gpt-gorsel", "claude-kod", "claude-metin", "claude-qa"}
DURUMLAR = ["hazir", "alindi", "inceleme", "blokaj", "bitti"]
ALANLAR = ["id", "baslik", "rol", "durum", "alan", "oncelik", "bagimli", "yazar"]


def parse(path):
    text = path.read_text()
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        raise ValueError(f"{path.name}: başlık bloğu yok")
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        k, _, v = line.partition(":")
        v = v.strip()
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip() for x in v[1:-1].split(",") if x.strip()]
        meta[k.strip()] = v
    meta["_path"] = path
    meta["_body"] = text[m.end():]
    return meta


def dump(meta):
    lines = ["---"]
    for k in ALANLAR:
        v = meta.get(k, "")
        if isinstance(v, list):
            v = "[" + ", ".join(v) + "]"
        lines.append(f"{k}: {v}".rstrip())
    lines.append("---")
    meta["_path"].write_text("\n".join(lines) + "\n" + meta["_body"])


def load():
    return {m["id"]: m for m in (parse(p) for p in sorted(DIR.glob("G*.md")))}


def get(tasks, tid):
    if tid not in tasks:
        sys.exit(f"görev yok: {tid}")
    return tasks[tid]


def deps_done(t, tasks):
    return all(tasks.get(d, {}).get("durum") == "bitti" for d in t.get("bagimli", []))


def log(t, msg):
    body = t["_body"].rstrip("\n")
    if "## Günlük" not in body:
        body += "\n\n## Günlük"
    t["_body"] = body + f"\n- {date.today().isoformat()} {msg}\n"


def cmd_liste(a, tasks):
    rows = [t for t in tasks.values() if not a.rol or t["rol"] == a.rol]
    rows.sort(key=lambda t: (DURUMLAR.index(t["durum"]), int(t.get("oncelik") or 9), t["id"]))
    for t in rows:
        hazir = "" if t["durum"] != "hazir" or deps_done(t, tasks) else " (bağımlılık bekliyor)"
        alan = f" · {t['alan']}" if t.get("alan") else ""
        print(f"{t['id']}  {t['durum']:<8} {t['rol']:<12} p{t.get('oncelik','-')}  {t['baslik']}{alan}{hazir}")


def cmd_siradaki(a, tasks):
    adaylar = [t for t in tasks.values()
               if t["rol"] == a.rol and t["durum"] == "hazir" and deps_done(t, tasks)]
    if not adaylar:
        print(f"{a.rol} için hazır görev yok.")
        return
    t = min(adaylar, key=lambda t: (int(t.get("oncelik") or 9), t["id"]))
    print(f"{t['id']}  {t['baslik']}\n  dosya: {t['_path'].relative_to(ROOT)}\n  yazar: {', '.join(t['yazar'])}")


def cmd_al(a, tasks):
    t = get(tasks, a.id)
    if t["durum"] != "hazir" or t.get("alan"):
        sys.exit(f"{t['id']} alınamaz: durum={t['durum']} alan={t.get('alan') or '-'}")
    if not deps_done(t, tasks):
        sys.exit(f"{t['id']} bağımlılıkları bitmedi: {t['bagimli']}")
    t["durum"], t["alan"] = "alindi", a.ajan
    log(t, f"alindi: {a.ajan}")
    dump(t)
    print(f"{t['id']} alındı ({a.ajan}). Şimdi commit + push et.")


def set_durum(tasks, tid, durum, msg):
    t = get(tasks, tid)
    t["durum"] = durum
    log(t, msg)
    dump(t)
    print(f"{tid}: {durum}")


def cmd_kontrol(a, tasks):
    hata = 0
    for t in tasks.values():
        for k in ALANLAR:
            if k not in t:
                print(f"{t['id']}: '{k}' alanı eksik"); hata += 1
        if t.get("rol") not in ROLLER:
            print(f"{t['id']}: bilinmeyen rol {t.get('rol')}"); hata += 1
        if t.get("durum") not in DURUMLAR:
            print(f"{t['id']}: bilinmeyen durum {t.get('durum')}"); hata += 1
        for d in t.get("bagimli", []):
            if d not in tasks:
                print(f"{t['id']}: bağımlılık yok: {d}"); hata += 1
        if not t["_path"].name.startswith(t["id"] + "-"):
            print(f"{t['id']}: dosya adı id ile başlamıyor"); hata += 1
    aktif = [t for t in tasks.values() if t["durum"] == "alindi"]
    for i, x in enumerate(aktif):
        for y in aktif[i + 1:]:
            for px in x["yazar"]:
                for py in y["yazar"]:
                    if px.startswith(py) or py.startswith(px):
                        print(f"çakışma: {x['id']} ve {y['id']} aynı yola yazıyor: {px} / {py}"); hata += 1
    print("kontrol: temiz" if not hata else f"kontrol: {hata} sorun")
    sys.exit(1 if hata else 0)


def cmd_pano(a, tasks):
    roller = ["claude-canva", "claude-tarayici", "claude-kod", "claude-metin", "claude-qa", "gpt-gorsel"]
    out = ["# Görev panosu (otomatik)", "",
           "`python3 tools/gorev.py pano` ile üretilir; **gerçek durum görev dosyalarındadır**. Bu dosya kabuk",
           "çalıştıramayan ajanlar içindir: kendi rolünün **Alınabilir** listesindeki ilk görevi al.", ""]
    say = {d: 0 for d in DURUMLAR}
    for t in tasks.values():
        say[t["durum"]] += 1
    out.append("Özet: " + " · ".join(f"{d} {n}" for d, n in say.items()) + f" · toplam {len(tasks)}")
    for rol in roller:
        rt = sorted((t for t in tasks.values() if t["rol"] == rol), key=lambda t: (int(t.get("oncelik") or 9), t["id"]))
        alinabilir = [t for t in rt if t["durum"] == "hazir" and deps_done(t, tasks)]
        calisan = [t for t in rt if t["durum"] in ("alindi", "inceleme", "blokaj")]
        bekleyen = [t for t in rt if t["durum"] == "hazir" and not deps_done(t, tasks)]
        biten = [t for t in rt if t["durum"] == "bitti"]
        out += ["", f"## {rol}", "", f"**Alınabilir ({len(alinabilir)})**", ""]
        out += [f"- `{t['id']}` p{t.get('oncelik')} — {t['baslik']} → `{t['_path'].relative_to(ROOT)}`" for t in alinabilir] or ["- (yok)"]
        out += ["", f"**Üzerinde çalışılan / incelemede / blokaj ({len(calisan)})**", ""]
        out += [f"- `{t['id']}` {t['durum']} · {t.get('alan') or '-'} — {t['baslik']}" for t in calisan] or ["- (yok)"]
        out += ["", f"Bağımlılık bekleyen: {len(bekleyen)} · Biten: {len(biten)}"]
    (DIR / "PANO.md").write_text("\n".join(out) + "\n")
    print("gorevler/PANO.md yazıldı")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("liste"); p.add_argument("--rol")
    p = sub.add_parser("siradaki"); p.add_argument("--rol", required=True)
    p = sub.add_parser("al"); p.add_argument("id"); p.add_argument("--ajan", required=True)
    p = sub.add_parser("bitir"); p.add_argument("id")
    p = sub.add_parser("onayla"); p.add_argument("id")
    p = sub.add_parser("blokaj"); p.add_argument("id"); p.add_argument("neden")
    sub.add_parser("kontrol")
    sub.add_parser("pano")
    a = ap.parse_args()
    tasks = load()
    if a.cmd == "liste":
        cmd_liste(a, tasks)
    elif a.cmd == "siradaki":
        cmd_siradaki(a, tasks)
    elif a.cmd == "al":
        cmd_al(a, tasks)
    elif a.cmd == "bitir":
        set_durum(tasks, a.id, "inceleme", "bitti, incelemeye gönderildi")
    elif a.cmd == "onayla":
        set_durum(tasks, a.id, "bitti", "entegratör onayladı")
    elif a.cmd == "blokaj":
        set_durum(tasks, a.id, "blokaj", f"blokaj: {a.neden}")
    elif a.cmd == "kontrol":
        cmd_kontrol(a, tasks)
    elif a.cmd == "pano":
        cmd_pano(a, tasks)


if __name__ == "__main__":
    main()
