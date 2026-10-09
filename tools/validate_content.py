#!/usr/bin/env python3
"""İçerik kaydını şemaya ve iş kurallarına göre denetler.

Kullanım:
    python tools/validate_content.py collections/01_Olive_Ivory/content.demo.json

Çıktının sonunda, tüm formatlara (video, website, PDF) birebir kopyalanacak
"canonical" metinler basılır. Formatlar kendiliğinden senkronize değildir;
her format bu metinlerle karşılaştırılmalıdır.
"""
import json
import sys
from datetime import date, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHEMA = ROOT / "docs" / "03_URUN_ICERIK_SEMASI.json"

# Önceki görsellerde geçen, bize ait olmayan / kurgu hedefler.
FORBIDDEN_STRINGS = ["averyandjordan.com", "1234 Celebration Lane"]


def fmt_date(d: date, locale: str) -> str:
    weekday = d.strftime("%A")
    month = d.strftime("%B")
    if locale == "en-US":
        return f"{weekday}, {month} {d.day}, {d.year}"
    return f"{weekday}, {d.day} {month} {d.year}"


def fmt_time(t: time, locale: str) -> str:
    h = t.hour % 12 or 12
    suffix = "AM" if t.hour < 12 else "PM"
    if locale != "en-US":
        suffix = suffix.lower()
    return f"{h}:{t.minute:02d} {suffix}"


def schema_errors(record: dict) -> list[str]:
    try:
        import jsonschema
    except ImportError:
        return ["(uyarı) jsonschema kurulu değil; şema denetimi atlandı — pip install -r tools/requirements.txt"]
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    return [f"şema: {'/'.join(map(str, e.path)) or '(kök)'}: {e.message}" for e in validator.iter_errors(record)]


def rule_errors(record: dict) -> tuple[list[str], list[str]]:
    errors, warnings = [], []
    raw = json.dumps(record, ensure_ascii=False)
    for s in FORBIDDEN_STRINGS:
        if s in raw:
            errors.append(f"yasak/kurgu hedef bulundu: {s!r}")

    try:
        ev = date.fromisoformat(record["date"])
        dl = date.fromisoformat(record["rsvp"]["deadline"])
        if dl >= ev:
            errors.append("RSVP son tarihi etkinlik tarihinden önce olmalı")
    except (KeyError, ValueError) as e:
        errors.append(f"tarih okunamadı: {e}")

    times = [s.get("time") for s in record.get("schedule", [])]
    if times != sorted(times):
        warnings.append("program saatleri kronolojik değil")
    if record.get("schedule") and record["schedule"][0].get("time") != record.get("ceremony_time"):
        warnings.append("ilk program saati ceremony_time ile aynı değil")

    names = [p["display_name"] for p in record.get("partners", [])]
    display = record.get("name_display", "")
    for n in names:
        if n not in display:
            errors.append(f"name_display '{display}' içinde '{n}' yok")
    initials = record.get("initials", "")
    for n in names:
        if n and n[0].upper() not in initials:
            warnings.append(f"monogram '{initials}' içinde '{n[0]}' baş harfi yok")

    urls = record.get("urls", {})
    if record.get("record_kind") == "demo":
        filled = [k for k, v in urls.items() if v]
        if filled:
            errors.append(f"demo kayıtta gerçek URL olmamalı (null kalmalı): {', '.join(filled)}")
    else:
        for k in ("website", "rsvp_form"):
            if not urls.get(k):
                warnings.append(f"müşteri kaydında urls.{k} boş — buton/QR hedefsiz kalır")

    blocks = record.get("optional_blocks", {})
    if blocks.get("registry") and not urls.get("registry") and record.get("record_kind") != "demo":
        warnings.append("registry bloğu açık ama registry URL yok")
    if blocks.get("dress_code") and not record.get("dress_code"):
        warnings.append("dress_code bloğu açık ama dress_code boş")
    return errors, warnings


def canonical(record: dict) -> list[str]:
    loc = record["locale"]
    ev = date.fromisoformat(record["date"])
    lines = [
        f"Names        : {record.get('name_display')}",
        f"Monogram     : {record.get('initials')}",
        f"Date         : {fmt_date(ev, loc)}",
        f"Ceremony     : {fmt_time(time.fromisoformat(record['ceremony_time']), loc)} ({record['timezone']})",
        f"Venue        : {record['venue']['name']}, {record['venue']['city']}"
        + (f", {record['venue']['region']}" if record['venue'].get('region') else ""),
    ]
    for s in record.get("schedule", []):
        t = fmt_time(time.fromisoformat(s["time"]), loc)
        lines.append(f"  {s['label']:<14}: {t}" + (f" · {s['location']}" if s.get("location") else ""))
    dl = date.fromisoformat(record["rsvp"]["deadline"])
    dl_txt = f"{dl.strftime('%B')} {dl.day}, {dl.year}" if loc == "en-US" else f"{dl.day} {dl.strftime('%B')} {dl.year}"
    lines.append(f"RSVP by      : {dl_txt}")
    if record.get("dress_code"):
        lines.append(f"Dress code   : {record['dress_code']}")
    return lines


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    path = Path(sys.argv[1])
    record = json.loads(path.read_text(encoding="utf-8"))
    errors = schema_errors(record)
    if not any(e.startswith("şema:") for e in errors):
        r_err, r_warn = rule_errors(record)
        errors += r_err
    else:
        r_warn = []
    hard = [e for e in errors if not e.startswith("(uyarı)")]
    warns = r_warn + [e for e in errors if e.startswith("(uyarı)")]

    print(f"Kayıt: {path}  ({record.get('record_kind')})")
    for e in hard:
        print(f"  HATA  {e}")
    for w in warns:
        print(f"  UYARI {w}")
    if not hard:
        print("\nCanonical metinler (tüm formatlarda birebir aynı olmalı):")
        for line in canonical(record):
            print(f"  {line}")
    print("\nSONUÇ:", "BAŞARISIZ" if hard else "GEÇTİ")
    return 1 if hard else 0


if __name__ == "__main__":
    sys.exit(main())
