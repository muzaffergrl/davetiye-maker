#!/usr/bin/env python3
"""Technical cuts of the approved GPT art; no generated decoration is drawn in code."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw,ImageFilter
T=Path(__file__).resolve().parent;R=T.parents[2];C=R/'collections/49_Ivory_Pearl_Atelier/assets/gpt';O=T/'img';O.mkdir(exist_ok=True)
def load(file):return Image.open(C/file).convert('RGBA')
def trim(im):
 a=np.array(im); mask=a[:,:,3]>180
 ys,xs=np.where(mask); box=(int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))
 a[:,:,3]=np.where(a[:,:,3]>100,a[:,:,3],0)
 return Image.fromarray(a).crop(box)
def save(im,name,widths):
 for w in widths:
  s=im.resize((w,round(im.height*w/im.width)),Image.Resampling.LANCZOS)
  s.save(O/f'{name}-{w}.webp',quality=84,method=6)
closed=load('parts/envelope_closed.png').crop((46,140,1440,921));w,h=closed.size
# Measured free edge of the original V flap, in its own pixel coordinates. Masks only separate existing art.
edge=[(0,0),(1394,0),(1390,28),(1378,60),(1352,92),(1318,124),(1260,176),(1190,238),(1120,300),(1040,370),(960,438),(880,508),(795,571),(756,589),(720,594),(690,587),(650,562),(570,494),(490,424),(410,353),(330,283),(250,211),(172,142),(95,77),(40,32),(8,8)]
mask=Image.new('L',(w,h));ImageDraw.Draw(mask).polygon(edge,fill=255)
flap=closed.copy();flap.putalpha(Image.fromarray(np.minimum(np.array(closed.getchannel('A')),np.array(mask))))
opened=load('parts/envelope_open.png')
# Use the generated open lining, resampled to the closed body's exact footprint. The closed body never changes size.
inside=opened.crop((137,368,1398,985)).resize((w,h),Image.Resampling.LANCZOS)
pocket=inside.copy();pm=Image.new('L',(w,h));ImageDraw.Draw(pm).polygon([(0,0),(int(w*.47),int(h*.74)),(int(w*.53),int(h*.74)),(w,0),(w,h),(0,h)],fill=255);pocket.putalpha(pm)
# The original open image has transparent pixels around its triangular flap. Never replace that alpha
# with an opaque mask: transparent RGB there is black. Sample only the existing silk interior, then
# composite it inside the closed flap's own gold edge and silhouette.
silk=opened.crop((450,390,1000,520)).resize((w,h),Image.Resampling.LANCZOS)
lining=flap.copy();lining.paste(silk,(0,0),mask.filter(ImageFilter.MinFilter(9)))
for name,im,ws in [('closed',closed,[480,960]),('flap',flap,[960]),('flap-inside',lining,[960]),('inside',inside,[960]),('pocket',pocket,[960]),('closure',trim(load('parts/closure.png')),[160,320]),('bow',trim(load('parts/accent_bow.png')),[640]),('card',trim(load('parts/invitation_card.png')),[480,800])]:save(im,name,ws)
bg=Image.open(C/'textures/bg_page.png').convert('RGB');save(bg,'bg',[640,1024])
plain=bg.crop((220,350,800,1150)).filter(ImageFilter.GaussianBlur(14));save(plain,'ph_portrait',[640]);save(plain.crop((0,180,580,506)),'ph_wide',[640])
# Sharing artwork is assembled only from the approved background/envelope/seal, with no personal copy.
og=bg.resize((1200,1800)).crop((0,400,1200,1030)).convert('RGBA');e=closed.resize((850,476));og.alpha_composite(e,(175,100));seal=trim(load('parts/closure.png'));seal.thumbnail((126,126));og.alpha_composite(seal,(537,410));og.convert('RGB').save(O/'og-1200x630.jpg',quality=88)
icon=trim(load('parts/closure.png'));icon.thumbnail((128,128));icon.save(O/'favicon.png')
manifest={'source':'collections/49_Ivory_Pearl_Atelier/assets/gpt','stage':{'aspect':w/h,'closed_box':[46,140,1440,921],'shared_body_px':[w,h],'flap_hinge':[0,0],'flap_tip':[720/w,594/h],'alignment':'All body/pocket/flap derivatives use the same closed-body coordinate system; open source is technical lining only.'},'files':{},'checks':{'green':[]},'og':{'file':'og-1200x630.jpg'},'favicon':{'file':'favicon.png'}}
for p in sorted(O.iterdir()):
 if p.suffix in ['.webp','.jpg','.png']:
  im=Image.open(p);manifest['files'][p.name]={'width':im.width,'height':im.height,'bytes':p.stat().st_size}
(O/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('Theme image bytes:',sum(p.stat().st_size for p in O.iterdir()))
