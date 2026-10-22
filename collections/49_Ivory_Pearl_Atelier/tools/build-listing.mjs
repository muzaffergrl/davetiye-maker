// Uses the existing editorial layout system with this product's actual captures and approved GPT paper.
import {chromium} from '../../../platform/node_modules/playwright-core/index.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'../../..');
const collection=path.resolve(import.meta.dirname,'..'),out=path.join(collection,'package/listing/images_editorial');
mkdirSync(out,{recursive:true});
const uri=p=>{const mime=p.endsWith('.svg')?'image/svg+xml':p.endsWith('.png')?'image/png':'image/jpeg';return `data:${mime};base64,${readFileSync(p).toString('base64')}`;};
const shot=n=>uri(path.join(collection,'package/shots',n+'.jpg'));
const plans=[
 ['01_cover','Ivory Pearl Atelier','A wedding invitation, softly revealed.',['g01_envelope'],['Animated wedding website · Online RSVP']],
 ['02_opening','A first moment to remember','The pearl turns. The silk drifts apart. Your invitation rises.',['opening_0','opening_2100','opening_4200'],['Sealed','Opening','Your invitation']],
 ['03_pages','Every page they need','Home, your story, the day and a place to reply.',['g02_home_top','g05_story','g06_details_top','g09_rsvp_top'],['Home','Our Story','Details','RSVP']],
 ['04_edit','Make it yours','Names, date, photos and every heading. In your own online editor.',['e01_edit_pages','e02_day_place','e03_copy_labels'],['Choose a page','Edit your details','Make every word yours']],
 ['05_rsvp','Every reply, in one place','Your guests reply. You see the numbers and download the list.',['g10_rsvp_form','p01_panel_replies'],['Your guest’s reply','Your private guest list']],
 ['06_details','The details, beautifully clear','The programme, the place, directions and answers.',['g07_details_schedule','g12_details_venue','g08_details_faq'],['The day','The place','Good to know']],
 ['07_how','Three simple steps','Start with your Etsy order. Personalize. Publish and share.',['b02_start_form','b04_setup_names','b10_live_qr'],['Start','Personalize','Share']],
 ['08_included','One link. Your whole invitation.','Animated opening · Four pages · Online editor · RSVP · Downloads',['g01_envelope','g02_home_top','s01_share'],['Your opening','Your website','Your link & downloads']],
 ['09_devices','Begin here. Continue anywhere.','Use your Etsy order number and email on your phone or computer.',['b02_start_form','b09_panel_preview'],['Open your website','Pick up where you left off']],
];
const css=readFileSync(path.join(root,'tools/listing_editorial/templates/editorial.css'),'utf8').replace('@import url("fonts.css");','');
const brand=uri(path.join(root,'brand/svg/bke-logo-horizontal-anchor.svg'));
const paper=uri(path.join(collection,'assets/gpt/textures/bg_page.png'));
const browser=await chromium.launch({executablePath:process.env.PRINT_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:2000,height:2000},deviceScaleFactor:1});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
for(const [file,title,sub,shots,labels]of plans){
 const cover=file==='01_cover';const w=cover?560:shots.length===4?330:shots.length===3?400:500;const gap=cover?0:90;const left=cover?1250:(2000-shots.length*w-(shots.length-1)*gap)/2;const top=cover?350:650;
 const screens=shots.map((n,i)=>`<div class="screen" style="left:${left+i*(w+gap)}px;top:${top}px;width:${w}px"><img src="${shot(n)}"></div><div class="s-label" style="left:${left+i*(w+gap)-35}px;top:${top+w*844/390+45}px;width:${w+70}px">${esc(labels[i]||'')}</div>`).join('');
 const heading=cover?`<div class="abs" style="left:150px;top:470px;width:940px"><div class="kicker">BKE Studio · Wedding websites</div><h1 class="display" style="font-size:147px;line-height:1.07;margin-top:60px">Ivory Pearl<br><em>Atelier</em></h1><p class="lede" style="margin-top:65px">${esc(sub)}</p><p class="body" style="margin-top:80px;font-size:40px">Ivory cotton paper.<br>Champagne silk.<br>A luminous pearl.</p><p class="note" style="margin-top:70px">Animated opening · Online RSVP<br>Personalize in your online editor</p></div>`:`<div class="abs center" style="left:100px;right:100px;top:200px"><div class="kicker">Ivory Pearl Atelier</div><div class="display" style="font-size:115px;margin-top:32px">${esc(title)}</div><div class="lede" style="font-size:43px;margin-top:28px">${esc(sub)}</div></div>`;
 const html=`<!doctype html><meta charset="utf-8"><style>${css}:root{--paper:#f4efe6;--ivory:#f8f3ea;--ink:#55432e;--deep:#70573b;--gold-ink:#8a683c;--shade:#55432e;--paper-img:url('${paper}')}.screen img{display:block;width:100%;height:auto}.s-label{font-size:29px;line-height:1.4}</style><div class="paper"></div>${heading}${screens}<img class="brand" src="${brand}" style="left:50%;transform:translateX(-50%);top:1880px;height:35px">`;
 await page.setContent(html,{waitUntil:'load'});await page.screenshot({path:path.join(out,file+'.png')});console.log(file);
}
await browser.close();
