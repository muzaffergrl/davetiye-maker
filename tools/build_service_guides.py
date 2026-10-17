#!/usr/bin/env python3
"""The digital file of each K42 service listing (G136): SETUP_SERVICE.pdf, CUSTOM_DESIGN.pdf, EXTRA_REVISION.pdf.

  python3 tools/build_service_guides.py            # build the three PDFs, then check them
  python3 tools/build_service_guides.py --check    # build nothing; check what is on disk (exit 1 on a problem)

Etsy delivers a file for every digital listing; for a service that file tells the buyer what they bought and what happens
next. The text follows the listing (collections/_services/<id>/package/listing/listing_v3.md §2) and docs/23. The list
of what to send us is read from the shop's Etsy messages (platform/lib/admin/message-templates.json:
setup_service_details, custom_design_brief, custom_design_extra_round), so the PDF and the message never ask for
different things.

Writes collections/_services/<id>/package/customer/<FILE>.pdf: US Letter, reportlab, standard PDF fonts (no font file
is embedded or shipped, rule 9), the same ink/gold/paper and footer as the START HERE guides
(tools/build_customer_guides.py). The BKE Studio logo (brand/svg/bke-logo-horizontal-anchor.svg) is rasterised by
headless Chromium at build time (node + Playwright, NODE_PATH=/opt/node22/lib/node_modules, /opt/pw-browsers).

Checks: 1–2 pages; every line of the message's list is in the PDF; turnaround, no-returns, "we will fix it", the support
e-mail and Etsy messages are there; no {placeholder}; the only link is mailto: the support address.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
from pathlib import Path
from xml.sax.saxutils import escape

TOOLS = Path(__file__).resolve().parent
REPO = TOOLS.parent
sys.path.insert(0, str(TOOLS))

MESSAGES = REPO / "platform" / "lib" / "admin" / "message-templates.json"
LOGO = REPO / "brand" / "svg" / "bke-logo-horizontal-anchor.svg"
SUPPORT_EMAIL = "bkestudio@gmail.com"  # K33
SHOP = "BKE Studio"
INK, GOLD, PAPER = "#2B1526", "#D0AE6A", "#FAF7F0"


def message(mid: str) -> list[str]:
    for t in json.loads(MESSAGES.read_text(encoding="utf-8")):
        if t["id"] == mid:
            return t["body"]
    raise SystemExit(f"{MESSAGES.relative_to(REPO)}: no message '{mid}'")


def bullets(paragraph: str) -> list[str]:
    """The '• …' lines of one message paragraph."""
    return [ln[2:].strip() for ln in paragraph.splitlines() if ln.startswith("• ")]


def ask_lists() -> dict[str, list[str]]:
    """What each service asks the buyer to send, word for word from the shop's first Etsy message."""
    setup = message("setup_service_details")
    items = [b.replace("(if it is not {order})", "(if you bought it in a separate order)") for b in bullets(setup[1])]
    photos = next(p for p in setup if p.startswith("Photos:"))
    items.append("Up to 5 photos" + photos[len("Photos: send up to 5"):])
    custom = bullets(message("custom_design_brief")[1])
    extra = message("custom_design_extra_round")
    if not any("all the changes for this round together in one message" in p for p in extra):
        raise SystemExit("custom_design_extra_round no longer asks for all changes in one message: update EXTRA_REVISION")
    return {"setup-service": items, "custom-design": custom,
            "extra-revision": ["All the changes you want in this round, together in one message: the opening, artwork, "
                               "colors or fonts",
                               "Pictures or color examples if they help (a share link is fine)"]}


def content() -> dict[str, dict]:
    ask = ask_lists()
    help_ = [("h2", "Questions or a problem?"),
             ("p", f"Message us on Etsy (we reply within 24 hours) or e-mail <a href=\"mailto:{SUPPORT_EMAIL}\">"
                   f"{SUPPORT_EMAIL}</a>. Please include your Etsy order number.")]
    return {
        "setup-service": {
            "file": "SETUP_SERVICE.pdf", "name": "Setup service", "kicker": "Wedding website setup service",
            "title": "We set it up for you",
            "lede": "Thank you for your order! You send us your details, we enter them in your wedding website's editor, "
                    "and you only check and publish.",
            "blocks": [
                ("h2", "What you bought"),
                ("p", "One round of setup for one wedding website from our shop. We enter the details you send us in "
                      "your website's editor: names, date and venue, the order of the day, your story, up to 5 photos "
                      "(each cropped to its frame), your RSVP page with up to 3 questions, and the headings and wording "
                      "you ask for."),
                ("p", "This service does not include a design. If you have not bought one of our wedding website "
                      "designs yet, please buy the one you love from our shop: the setup works with any of them."),
                ("box", "Your next step: send us your details",
                 ["We message you on Etsy within 24 hours of your order. You do not have to wait: you can reply in the "
                  "Etsy conversation of this order right away with:"], ask["setup-service"]),
                ("h2", "When it is ready"),
                # G148: since G145 the shop edits a started website with its own link (the buyer's keeps working),
                # and since G146 the buyer's Etsy order number + e-mail open the editor on any device
                ("ul", ["We set up your website <b>within 3 days of receiving everything</b> and tell you in the same "
                        "Etsy conversation when it is ready (with your private edit link if we started the website "
                        "for you).",
                        "Your website stays a private draft. Open your editor, check every page, change anything you "
                        "like yourself, and tap <b>Publish</b> when you are happy.",
                        "If you already started your website, we set it up in that same website: your edit link, and "
                        "your Etsy order number with your e-mail, keep working. We never ask you for your edit link."]),
                ("h2", "Good to know"),
                ("ul", ["One purchase = one round of setup for one website. After that you can change everything "
                        "yourself, as often as you like; if you want us to make another round of changes for you, "
                        "that is a new purchase of the setup service.",
                        "We enter the words you send us; we do not write your texts. The design's artwork, colors, "
                        "fonts and layout stay as designed.",
                        "If your website is already published, name and date changes we make count toward the same 3 "
                        "changes after publishing as your own (typo fixes and moving the date by up to 7 days stay "
                        "free)."]),
                ("h2", "Returns"),
                ("p", "No returns, exchanges or cancellations once we have started your setup. If something we set "
                      "up does not match what you sent us, message us on Etsy and we will fix it."),
            ] + help_,
        },
        "custom-design": {
            "file": "CUSTOM_DESIGN.pdf", "name": "Custom design", "kicker": "Custom wedding website design",
            "title": "Designed just for you",
            "lede": "Thank you for your order! We make a new wedding website design for you: your own opening, "
                    "artwork, colors and type. Then you fill it in yourself in our editor.",
            "blocks": [
                ("h2", "What you bought"),
                ("ul", ["A new wedding website design made for you: the opening your guests tap first, the artwork, "
                        "colors and fonts. You do not need to buy one of our ready designs as well.",
                        "Everything our ready designs include: Home, Our Story, Details and RSVP pages, the private "
                        "online editor, online RSVP with a downloadable guest list, a QR code, an optional guest "
                        "password and a thank-you page for after the wedding.",
                        "<b>2 rounds of changes</b> to the design.",
                        "Your website stays online until 12 months after your wedding date."]),
                ("box", "Your next step: tell us your idea",
                 ["We message you on Etsy within 24 hours of your order. You do not have to wait: you can reply in the "
                  "Etsy conversation of this order right away with:"], ask["custom-design"]),
                ("h2", "What happens next"),
                ("ol", ["We send you the first version <b>within 3 days of receiving your answers</b>, in the Etsy "
                        "conversation.",
                        "You tell us what to change. 2 rounds of changes are included: please send all the changes "
                        "for one round together in one message. Each further round is 500 TL, through our Extra design "
                        "revision listing.",
                        "When you are happy, we send you your start link: enter your Etsy order number, your e-mail "
                        "and your first names and choose your web address. Later, the same order number and e-mail "
                        "open your editor on any phone or computer.",
                        "Add your names, date and photos in the editor (or add our setup service), and publish."]),
                ("h2", "Good to know"),
                ("ul", ["The artwork is created with the help of AI image tools from our own descriptions, then "
                        "selected, refined and built into your website by us.",
                        "Your design is yours alone: we never sell it, or a recolored version of it, to anyone else.",
                        "Your names, photos and texts are never part of the artwork: you can change them in your "
                        "editor at any time.",
                        "Not included: entering your details for you (our setup service does that), music, printed "
                        "invitations and a custom domain (yournames.com)."]),
                ("h2", "Returns"),
                ("p", "No returns, exchanges or cancellations once we have started your design. If something on your "
                      "website does not work as described, message us on Etsy and we will fix it."),
            ] + help_,
        },
        "extra-revision": {
            "file": "EXTRA_REVISION.pdf", "name": "Extra design revision", "kicker": "Extra design revision",
            "title": "One more round of changes",
            "lede": "Thank you for your order! This is one more round of changes to your custom wedding website "
                    "design, after the 2 rounds your custom design includes.",
            "blocks": [
                ("h2", "What you bought"),
                ("p", "One round of changes to your custom design: the opening, artwork, colors or fonts. This listing "
                      "is only for couples who ordered a custom design from our shop. If you have not ordered a custom "
                      "design, please message us on Etsy before anything else."),
                ("box", "Your next step: send us your changes",
                 ["Reply in the Etsy conversation of this order (or of your custom design order) with:"],
                 ask["extra-revision"]),
                ("h2", "When it is ready"),
                ("p", "We send you the updated design <b>within 3 days of receiving your changes</b>, in the Etsy "
                      "conversation."),
                ("h2", "Good to know"),
                ("ul", ["One purchase = one round of changes. Buy the listing again for another round.",
                        "Not included: your names, dates, photos and texts. You change those yourself in your editor "
                        "at any time, free (or with our setup service). A completely new design idea is a new custom "
                        "design order.",
                        "Your design stays yours alone: we never sell it to anyone else."]),
                ("h2", "Returns"),
                ("p", "No returns, exchanges or cancellations once we have started your changes. If a change we made "
                      "does not match what you asked for, message us on Etsy and we will fix it."),
            ] + help_,
        },
    }


def out_path(sid: str, spec: dict) -> Path:
    return REPO / "collections" / "_services" / sid / "package" / "customer" / spec["file"]


# ----------------------------------------------------------------------------- PDF

def render_logo(tmp: Path) -> Path:
    import md_to_pdf as m2p  # Playwright helper of the listing tools

    w, h = 1308, 225  # the SVG's own size
    page = tmp / "logo.html"
    page.write_text(f"<!doctype html><html><body style='margin:0;background:#fff'><img src='{LOGO.resolve().as_uri()}'"
                    f" style='display:block;width:{w}px;height:{h}px'></body></html>", encoding="utf-8")
    out = tmp / "logo.png"
    m2p.playwright_calistir({"url": page.as_uri(), "out": str(out), "mode": "png", "width": w, "height": h, "scale": 1},
                            tmp)
    return out


def build_pdf(sid: str, spec: dict, logo: Path) -> Path:
    from reportlab.lib.colors import HexColor
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Image, KeepTogether, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer, \
        Table, TableStyle

    ink, gold, paper = HexColor(INK), HexColor(GOLD), HexColor(PAPER)
    st = {
        "kicker": ParagraphStyle("K", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=HexColor("#7A6276"),
                                 spaceAfter=4),
        "title": ParagraphStyle("T", fontName="Helvetica-Bold", fontSize=24, leading=29, textColor=ink, spaceAfter=8),
        "lede": ParagraphStyle("L", fontName="Helvetica", fontSize=11.5, leading=16.5, textColor=ink, spaceAfter=6),
        "h2": ParagraphStyle("H", fontName="Helvetica-Bold", fontSize=12.5, leading=17, textColor=ink, spaceBefore=12,
                             spaceAfter=5, keepWithNext=True),
        "body": ParagraphStyle("B", fontName="Helvetica", fontSize=9.8, leading=14, textColor=ink, spaceAfter=5),
        "item": ParagraphStyle("I", fontName="Helvetica", fontSize=9.8, leading=14, textColor=ink),
        "boxh": ParagraphStyle("BH", fontName="Helvetica-Bold", fontSize=12.5, leading=17, textColor=ink, spaceAfter=4),
    }

    def text(s: str) -> str:
        # escape everything except the few tags the content uses (<b>, <a href>)
        s = escape(s, {'"': "&quot;"})
        s = re.sub(r"&lt;(/?b)&gt;", r"<\1>", s)
        s = re.sub(r"&lt;a href=&quot;([^&]+)&quot;&gt;(.*?)&lt;/a&gt;", r'<a href="\1" color="#2B1526"><u>\2</u></a>', s)
        return s.replace("—", "-").replace("–", "-")

    def lst(items: list[str], ordered: bool = False) -> ListFlowable:
        return ListFlowable([ListItem(Paragraph(text(i), st["item"]), spaceAfter=3) for i in items],
                            bulletType="1" if ordered else "bullet", start="1" if ordered else "•",
                            bulletFormat="%s." if ordered else None,
                            bulletFontName="Helvetica-Bold" if ordered else "Helvetica", bulletFontSize=9.8,
                            bulletColor=ink, leftIndent=16, bulletOffsetY=0)

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(gold)
        canvas.line(54, 42, 558, 42)
        canvas.setFillColor(ink)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(54, 28, f"{SHOP}  |  {spec['name']}")
        canvas.drawRightString(558, 28, str(doc.page))
        canvas.restoreState()

    flow = [Image(str(logo), width=150, height=150 * 225 / 1308, hAlign="LEFT"), Spacer(1, 18),
            Paragraph(text(spec["kicker"].upper()), st["kicker"]), Paragraph(text(spec["title"]), st["title"]),
            Paragraph(text(spec["lede"]), st["lede"])]
    heading = None  # a heading is kept on the page of the block after it
    for b in spec["blocks"]:
        kind = b[0]
        if kind == "h2":
            heading = Paragraph(text(b[1]), st["h2"])
            continue
        if kind == "p":
            block = Paragraph(text(b[1]), st["body"])
        elif kind in {"ul", "ol"}:
            block = lst(b[1], ordered=kind == "ol")
        if kind in {"p", "ul", "ol"}:
            flow.append(KeepTogether([heading, block]) if heading else block)
            heading = None
        elif kind == "box":
            _, head, paras, items = b
            inner = [Paragraph(text(head), st["boxh"])] + [Paragraph(text(p), st["body"]) for p in paras] + [lst(items)]
            box = Table([[inner]], colWidths=[504], hAlign="LEFT")
            box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), paper),
                                     ("LINEBEFORE", (0, 0), (0, -1), 2.5, gold),
                                     ("LEFTPADDING", (0, 0), (-1, -1), 16), ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                                     ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
            flow.extend([Spacer(1, 10), KeepTogether(box), Spacer(1, 2)])
    out = out_path(sid, spec)
    out.parent.mkdir(parents=True, exist_ok=True)
    SimpleDocTemplate(str(out), pagesize=(612, 792), leftMargin=54, rightMargin=54, topMargin=46, bottomMargin=58,
                      title=f"{spec['name']}: what happens next", author=SHOP,
                      subject=f"{spec['name']}: what you bought and what happens next", lang="en-US",
                      invariant=1).build(flow, onFirstPage=footer, onLaterPages=footer)
    return out


# ----------------------------------------------------------------------------- checks

def pdf_text_and_links(pdf: Path) -> tuple[str, list[str], int]:
    from pypdf import PdfReader

    r = PdfReader(str(pdf))
    links = []
    for p in r.pages:
        for a in p.get("/Annots") or []:
            a = a.get_object()
            uri = (a.get("/A") or {}).get("/URI")
            if uri:
                links.append(str(uri))
    return " ".join(p.extract_text() or "" for p in r.pages), links, len(r.pages)


def check(sid: str, spec: dict) -> list[str]:
    pdf = out_path(sid, spec)
    if not pdf.exists():
        return [f"{pdf.relative_to(REPO)} missing (run tools/build_service_guides.py)"]
    raw, links, pages = pdf_text_and_links(pdf)
    flat = re.sub(r"\s+", " ", raw)
    norm = lambda s: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).replace("—", "-").replace("–", "-").strip()
    problems = []
    if not 1 <= pages <= 2:
        problems.append(f"{pages} pages (1–2 wanted)")
    for item in ask_lists()[sid]:
        if norm(item) not in flat:
            problems.append(f"the message's list item is not in the PDF: {item[:60]}…")
    for must in ("within 3 days", "No returns", "we will fix it", SUPPORT_EMAIL, "Message us on Etsy", "24 hours"):
        if must not in flat:
            problems.append(f"missing: {must!r}")
    if re.search(r"\{[a-z_]+\}", flat):
        problems.append("a {placeholder} is left in the text")
    if links != [f"mailto:{SUPPORT_EMAIL}"]:
        problems.append(f"links {links} (only mailto:{SUPPORT_EMAIL} wanted)")
    return problems


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="build nothing; check the PDFs on disk")
    a = ap.parse_args(argv)
    specs = content()
    if not a.check:
        with tempfile.TemporaryDirectory(prefix="service_guides_") as tmp:
            logo = render_logo(Path(tmp))
            for sid, spec in specs.items():
                build_pdf(sid, spec, logo)
    bad = False
    for sid, spec in specs.items():
        problems = check(sid, spec)
        pdf = out_path(sid, spec)
        size = f"{pdf.stat().st_size // 1024} KB" if pdf.exists() else "-"
        print(f"{sid}: {pdf.relative_to(REPO)} {size} · {'OK' if not problems else 'PROBLEMS: ' + '; '.join(problems)}")
        bad |= bool(problems)
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
