/* Original model-specific opening. No Blush card, petals or opening controller. */
const OPENING_PROFILE={"id":"sky-lantern-festival","kind":"lantern-ascent","index":9,"duration":5200,"frameRatio":0.6666666666666666,"copyTop":"53%","portraitWidth":"35%","font":"Allura"};
(() => {
 'use strict';
 const page=document.querySelector('main[data-opening]');if(!page)return;
 const root=document.documentElement,stage=page.querySelector('.stage'),q=s=>page.querySelector(s),P=OPENING_PROFILE;
 const card=q('.opening-card'),slot=q('.card-slot'),closed=q('.env-closed'),flap=q('.env-flap'),cflap=q('.env-cflap'),body=q('.env-body'),pocket=q('.env-pocket'),left=q('.opening-leaf-left'),right=q('.opening-leaf-right');
 let data={};try{data=JSON.parse(document.getElementById('site-data')?.textContent||'{}')}catch{}
 const home=data.pages?.home||q('[data-enter]')?.href||'home.html',key=data.slug?':'+data.slug:'',media=matchMedia('(prefers-reduced-motion: reduce)');
 const save=()=>{try{sessionStorage.setItem('invite:opened'+key,'1');sessionStorage.setItem('invite:opening-v2:opened'+key,'1');sessionStorage.removeItem('invite:arrive'+key)}catch{}};
 let state=root.classList.contains('is-opened')?'opened':'closed',generation=0,animations=[],timers=[];
 const later=(fn,ms)=>{const token=generation;timers.push(setTimeout(()=>{if(token===generation)fn()},ms))};
 function animate(node,keyframes,delay,duration,easing='cubic-bezier(.22,.7,.25,1)',fill='both'){if(!node)return;const a=node.animate(keyframes,{delay,duration,easing,fill});animations.push(a);return a;}
 const fade=(node,delay,duration=360)=>animate(node,[{opacity:1},{opacity:0}],delay,duration);
 function go(){if(state==='leaving')return;state='leaving';page.dataset.openingState=state;save();location.assign(home)}
 function reset(){generation++;timers.splice(0).forEach(clearTimeout);animations.splice(0).forEach(a=>a.cancel());for(const n of [slot,card,closed,cflap,flap,body,pocket,left,right])n.removeAttribute('style');delete page.dataset.openingPhase;root.classList.remove('is-opened');state='closed';stage.setAttribute('aria-disabled','false');page.dataset.openingState=state;}
 function play(){if(state==='opened'){go();return}if(state!=='closed')return;state='playing';page.dataset.openingState=state;stage.setAttribute('aria-disabled','true');
  if(media.matches||!Element.prototype.animate){go();return}
  const leaf=[2,3,4,5,7,8].includes(P.index),phase=700;
  fade(q('.env-hint'),0,250);animate(q('.env-head'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-14px)'}],80,550);
  if(leaf){left.style.display=right.style.display='block';closed.style.opacity='0';cflap.style.opacity='0'}
  animate(body,[{opacity:0},{opacity:1}],phase,180);animate(pocket,[{opacity:0},{opacity:1}],phase,180);
  // Every mechanism below moves its actual cover layers independently, rather than changing one common duration.
  switch(P.index){
   case 0: // Lakeside letter: seal flap lifts; the portrait sweeps over the terrace.
    animate(cflap,[{transform:'rotateX(0deg)',opacity:1},{transform:'rotateX(105deg)',opacity:0}],350,900);fade(closed,700,400);
    animate(flap,[{transform:'rotateX(-92deg)',opacity:0},{transform:'rotateX(0deg)',opacity:1}],900,700);break;
   case 1: // Jewel case: the whole lid hinges away, not a falling silk bow.
    cflap.style.opacity='0';closed.style.transformOrigin='50% 0';animate(closed,[{transform:'rotateX(0)',opacity:1},{transform:'rotateX(112deg)',opacity:0}],350,1300);animate(flap,[{opacity:0},{opacity:1}],1000,450);break;
   case 2: // Two theatre curtains draw apart with a small draped lift.
    animate(left,[{transform:'translateX(0)'},{transform:'translateX(-105%) rotate(-7deg)',opacity:0}],350,1550);animate(right,[{transform:'translateX(0)'},{transform:'translateX(105%) rotate(7deg)',opacity:0}],550,1550);animate(flap,[{opacity:0},{opacity:1}],1000,450);break;
   case 3: // Train sleeve: jacket travels right as the ticket emerges to the left.
    animate(left,[{transform:'translateX(0)'},{transform:'translateX(130%)',opacity:0}],350,1300);animate(right,[{transform:'translateX(0)'},{transform:'translateX(130%)',opacity:0}],350,1300);flap.style.opacity='0';break;
   case 4: // Two independent washi folds peel in opposite diagonal directions.
    animate(left,[{transform:'rotateY(0) rotateZ(0)'},{transform:'rotateY(-120deg) rotateZ(-20deg)',opacity:0}],250,1500);animate(right,[{transform:'rotateY(0) rotateZ(0)'},{transform:'rotateY(120deg) rotateZ(25deg)',opacity:0}],750,1400);flap.style.opacity='0';break;
   case 5: // Riad double doors: staggered depth hinges, lantern-lit arch behind them.
    animate(left,[{transform:'rotateY(0deg)'},{transform:'rotateY(-120deg)',opacity:0}],400,1500);animate(right,[{transform:'rotateY(0deg)'},{transform:'rotateY(120deg)',opacity:0}],850,1500);animate(flap,[{opacity:0,transform:'translateY(10%)'},{opacity:1,transform:'translateY(0)'}],850,1000);break;
   case 6: // Patisserie parcel: a gentle unwrap, then a scalloped stationery lift.
    animate(cflap,[{transform:'rotateX(0)',opacity:1},{transform:'rotateX(115deg)',opacity:0}],450,1000);animate(closed,[{transform:'translateY(0)',opacity:1},{transform:'translateY(32%) scale(.92)',opacity:0}],1050,850);animate(flap,[{opacity:0},{opacity:1}],1100,500);break;
   case 7: // Observatory: opposing brass shutters orbit away around the centre.
    left.style.transformOrigin=right.style.transformOrigin='50% 50%';animate(left,[{transform:'rotate(0) scale(1)'},{transform:'rotate(-105deg) scale(.75)',opacity:0}],400,1600);animate(right,[{transform:'rotate(0) scale(1)'},{transform:'rotate(105deg) scale(.75)',opacity:0}],400,1600);flap.style.opacity='0';break;
   case 8: // Mosaic album: the two leaves open in a flat, sequential accordion.
    animate(left,[{transform:'scaleX(1)'},{transform:'scaleX(0)',opacity:0}],350,900);animate(right,[{transform:'scaleX(1)'},{transform:'scaleX(0)',opacity:0}],1000,900);animate(flap,[{opacity:0},{opacity:1}],1100,500);break;
   case 9: // Lantern jacket rises into the sky while its invitation floats up below.
    cflap.style.opacity='0';animate(closed,[{transform:'translateY(0)',opacity:1},{transform:'translateY(-130%) rotate(-5deg)',opacity:0}],350,1800);flap.style.opacity='0';break;
   case 10: // Music box: lid tilts backward; cameo card pirouettes into place.
    cflap.style.opacity='0';closed.style.transformOrigin='50% 0';animate(closed,[{transform:'perspective(900px) rotateX(0)',opacity:1},{transform:'perspective(900px) rotateX(125deg)',opacity:0}],400,1600);animate(flap,[{opacity:0},{opacity:1}],1000,500);break;
  }
  const h=card.getBoundingClientRect().height,stageH=stage.getBoundingClientRect().height;
  const finalY=(stageH*.5-h*.5-card.offsetTop)/h*100,final='translateY('+finalY+'%)';
  const emerging=[{transform:'translateY(0)',opacity:0},{transform:'translateY(-48%)',opacity:1}];
  animate(card,emerging,1300,1250);later(()=>{slot.style.clipPath='none';slot.style.zIndex='6';page.dataset.openingPhase='portrait';},2550);
  const paths=[
   ['translateY(-48%)','translate(-15%,-65%) rotate(-4deg)',final],
   ['translateY(-48%) rotateX(-20deg)','translateY(-70%) rotateX(8deg)',final],
   ['translateY(-48%) scale(.82)','translateY(-70%) scale(1.06)',final],
   ['translate(24%,-48%)','translate(-18%,-70%) rotate(-3deg)',final],
   ['translateY(-48%) rotate(-8deg)','translateY(-70%) rotate(4deg)',final],
   ['translateY(-48%) scale(.85)','translateY(-70%) scale(1.03)',final],
   ['translateY(-48%) rotate(5deg)','translateY(-70%) rotate(-3deg)',final],
   ['translateY(-48%) rotate(-20deg)','translateY(-70%) rotate(8deg)',final],
   ['translateY(-48%) rotateY(-35deg)','translateY(-70%) rotateY(10deg)',final],
   ['translate(4%,-48%) rotate(-4deg)','translate(-4%,-70%) rotate(3deg)',final],
   ['translateY(-48%) rotateY(-120deg)','translateY(-70%) rotateY(25deg)',final]
  ];animate(card,paths[P.index].map(transform=>({transform,opacity:1})),2550,1300,'cubic-bezier(.22,.7,.25,1)','forwards');
  for(const node of [body,pocket,flap])animate(node,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(36%)'}],2650,800,'ease-in','forwards');
  later(()=>{page.dataset.openingPhase='settled';},3900);later(go,P.duration);
 }
 stage.addEventListener('click',play);stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
 for(const a of document.querySelectorAll('[data-skip],[data-enter]'))a.addEventListener('click',e=>{e.preventDefault();reset();go()});
 q('.replay')?.addEventListener('click',()=>{reset();play()});
 media.addEventListener('change',()=>{if(media.matches&&state==='playing'){reset();go()}});
 addEventListener('pagehide',()=>{generation++;timers.splice(0).forEach(clearTimeout)});
 addEventListener('pageshow',e=>{if(e.persisted){reset();root.classList.add('is-opened');state='opened';page.dataset.openingState=state;}});
 if(/[?&]replay=1(&|$)/.test(location.search))reset();
 page.dataset.openingState=state;page.dataset.openingReady='true';
})();
