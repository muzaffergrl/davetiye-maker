from pathlib import Path
from xml.sax.saxutils import escape
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.lib import utils

ROOT=Path(__file__).resolve().parent.parent
INK=HexColor('#2B1526'); PAPER=HexColor('#FAF7F0'); GOLD=HexColor('#D0AE6A')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='GuideBody',fontName='Helvetica',fontSize=10,leading=15,spaceAfter=8,textColor=INK))
styles.add(ParagraphStyle(name='GuideTitle',fontName='Helvetica-Bold',fontSize=25,leading=30,spaceAfter=20,textColor=INK))
styles.add(ParagraphStyle(name='GuideH2',fontName='Helvetica-Bold',fontSize=15,leading=20,spaceBefore=17,spaceAfter=10,textColor=INK,keepWithNext=True))
styles.add(ParagraphStyle(name='GuideH3',fontName='Helvetica-Bold',fontSize=11,leading=16,spaceBefore=10,spaceAfter=6,textColor=INK,keepWithNext=True))
styles.add(ParagraphStyle(name='GuideCell',fontName='Helvetica',fontSize=9,leading=13,textColor=INK))
class WholeParagraph(Paragraph):
    def split(self,available_width,available_height):
        return []
def inline(text):
    text=escape(text).replace('—','-').replace('–','-')
    text=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',r'<a href="\2" color="#2B1526"><u>\1</u></a>',text)
    text=re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',text)
    return text
def footer(canvas,doc):
    canvas.saveState();canvas.setStrokeColor(GOLD);canvas.line(48,42,564,42)
    canvas.setFillColor(INK);canvas.setFont('Helvetica',8)
    canvas.drawString(48,28,'BKE Studio  |  Website guide')
    canvas.drawRightString(564,28,str(doc.page));canvas.restoreState()
for collection,title,theme in [('01_Olive_Ivory','Olive & Ivory','olive-ivory'),('02_Dusty_Blue','Dusty Blue & Champagne','dusty-blue-champagne'),('03_Blush_Garden_Rose','Blush Garden Rose','blush-garden-rose'),('04_Vintage_Airmail','Vintage Airmail Love Letter','vintage-airmail-love-letter'),('05_Lemon_Mediterranean','Mediterranean Lemon','mediterranean-lemon')]:
    src=ROOT/'collections'/collection/'package/customer/START_HERE.md'
    output=ROOT/'collections'/collection/'package/customer/START_HERE.pdf'
    markdown=src.read_text(encoding='utf8')
    start=re.search(r'\]\((https?://[^)]+/start\?theme=[^)]+)\)',markdown)
    if not start: raise ValueError('Missing real start URL in '+str(src))
    flow=[];lines=markdown.splitlines();i=0
    while i<len(lines):
        line=lines[i];i+=1
        if not line.strip():continue
        if line.startswith('|'):
            rows=[line]
            while i<len(lines) and lines[i].startswith('|'):rows.append(lines[i]);i+=1
            data=[]
            for r in rows:
                if re.match(r'^\|[\s:|-]+\|$',r):continue
                data.append([Paragraph(inline(c.strip()),styles['GuideCell']) for c in r.strip('|').split('|')])
            table=Table(data,colWidths=[108,408],repeatRows=1,hAlign='LEFT')
            table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PAPER),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),0.5,GOLD)]));flow.extend([table,Spacer(1,10)]);continue
        if line.startswith('!['):
            url=start.group(1)
            qr=QrCodeWidget(url);b=qr.getBounds();size=100;d=Drawing(size,size,transform=[size/(b[2]-b[0]),0,0,size/(b[3]-b[1]),0,0]);d.add(qr);flow.extend([d,Spacer(1,10)]);continue
        if line.startswith('# '):style='GuideTitle';line=line[2:]
        elif line.startswith('## '):style='GuideH2';line=line[3:]
        elif line.startswith('### '):style='GuideH3';line=line[4:]
        else:
            style='GuideBody'
            if line.startswith('- '):line='• '+line[2:]
        paragraph=(WholeParagraph if style=='GuideBody' else Paragraph)(inline(line),styles[style])
        flow.append(paragraph)
    output.parent.mkdir(parents=True,exist_ok=True)
    SimpleDocTemplate(str(output),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=48,bottomMargin=56,title='Start Here: '+title,author='BKE Studio').build(flow,onFirstPage=footer,onLaterPages=footer)
    print(output.name)

