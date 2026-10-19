const ENVELOPE_PROFILE={"id":"grand-theatre-premiere","index":2,"kind":"velvet-theatre-gates","duration":6100,"parts":["left","right"],"ratio":2.00401,"pocket":false};
(() => {
 'use strict';
 const page=document.querySelector('main[data-opening]');if(!page)return;
 const P=ENVELOPE_PROFILE,root=document.documentElement,stage=page.querySelector('.stage'),q=s=>page.querySelector(s),card=q('.opening-card'),slot=q('.card-slot'),cancel=q('.v3-cancel');
 let data={};try{data=JSON.parse(document.getElementById('site-data')?.textContent||'{}')}catch{}
 const suffix=data.slug?':'+data.slug:'',home=data.pages?.home||q('[data-enter]')?.href||'home.html',media=matchMedia('(prefers-reduced-motion: reduce)');
 const keys=['invite:opened','invite:envelope-v3:opened'];
 function remember(open){try{for(const k of keys)open?sessionStorage.setItem(k+suffix,'1'):sessionStorage.removeItem(k+suffix);sessionStorage.removeItem('invite:arrive'+suffix)}catch{}}
 let state=root.classList.contains('is-opened')?'opened':'closed',animations=[],clock=null,token=0,timer=null;
 const initial='translateY(-50%) scale(.50)',final='translateY(-50%) scale(1)';
 function status(next){state=next;page.dataset.openingState=next;stage.setAttribute('aria-disabled','false');stage.setAttribute('aria-label',next==='playing'?'Close the invitation':next==='opened'?'Enter the invitation':'Open the invitation');cancel.hidden=next!=='playing';}
 function clear(){token++;clearTimeout(timer);timer=null;for(const a of animations)a.cancel();animations=[];clock=null;slot.style.zIndex='';delete page.dataset.openingPhase;}
 function reset(){clear();root.classList.remove('is-opened');status('closed');remember(false);}
 function go(){if(state==='leaving')return;status('leaving');clear();remember(true);location.assign(home);}
 function A(node,kf,delay,duration,easing='cubic-bezier(.42,0,.18,1)'){if(!node)return;const a=node.animate(kf,{delay,duration,easing,fill:'both'});animations.push(a);return a;}
 function hinge(name,to,delay,duration){return A(q('[data-piece="'+name+'"]'),[{transform:'none'},{transform:to}],delay,duration);}
 function build(){
  A(q('.v3-closed'),[{opacity:1},{opacity:0}],0,100,'linear');
  A(q('.v3-fastening'),[{transform:'none',opacity:1},{transform:'translate(18%,-12%) rotate(14deg)',opacity:0}],60,580);
  A(q('.env-head'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],120,500);
  A(q('.env-hint'),[{opacity:1},{opacity:0}],0,250);
  // Hinges follow the artwork's actual fold/spine; front and reverse are separate surfaces.
  let reveal=1550,settle=4000;
  switch(P.index){
   case 0:hinge('lid','rotateX(164deg)',220,1450);reveal=1300;break;
   case 1:hinge('lid','rotateY(-158deg)',240,1850);reveal=1550;break;
   case 2:hinge('left','rotateY(-154deg)',240,1700);hinge('right','rotateY(154deg)',430,1700);reveal=1650;break;
   case 3:hinge('sleeve','translateX(-86%)',400,2000);reveal=750;break;
   case 4:hinge('lid','rotateX(165deg)',550,1000);hinge('right','rotateY(160deg)',1050,1100);hinge('left','rotateY(-160deg)',1550,1100);hinge('bottom','rotateX(-155deg)',2050,1000);reveal=2500;settle=4500;break;
   case 5:hinge('left','rotateY(-151deg)',260,1650);hinge('right','rotateY(151deg)',700,1650);reveal=1850;break;
   case 6:hinge('lid','rotateX(158deg)',600,1400);reveal=1500;break;
   case 7:hinge('left','rotateY(-148deg)',300,1900);hinge('right','rotateY(148deg)',650,1900);reveal=2050;break;
   case 8:hinge('right','rotateY(158deg)',220,1050);hinge('left','rotateY(-158deg)',800,1050);hinge('middle','rotateY(-154deg)',1550,1200);reveal=2300;settle=4400;break;
   case 9:hinge('lid','rotateX(155deg)',350,1000);reveal=1050;break;
   case 10:hinge('lid','rotateX(152deg)',280,1900);reveal=1550;break;
  }
  const gate=[1,2,4,5,7,8,10].includes(P.index);
  const mid=P.index===3?'translate(44%,-30%) scale(.57)':gate?'translateY(-50%) scale(.58)':'translateY(-85%) scale(.57)';
  A(card,[{transform:initial,opacity:0},{transform:initial,opacity:1,offset:.08},{transform:mid,opacity:1,offset:.63},{transform:final,opacity:1}],reveal,settle-reveal);
  // The card stays behind the pocket until clear of its lip, then comes to the foreground.
  for(const n of page.querySelectorAll('.v3-housing,.v3-piece>img'))A(n,[{opacity:1},{opacity:0}],settle-900,850,'ease-in-out');
  clock=A(stage,[{opacity:1},{opacity:1}],0,P.duration,'linear');
  const id=token;
  timer=setTimeout(()=>{if(id!==token||state!=='playing')return;slot.style.zIndex='6';page.dataset.openingPhase='settled';},settle);
  clock.onfinish=()=>{if(id===token&&state==='playing')go();};
 }
 function play(){if(state==='opened'){go();return}if(state!=='closed')return;
  if(media.matches||!Element.prototype.animate){go();return}
  clear();root.classList.remove('is-opened');status('playing');build();
 }
 async function close(replay=false){if(state==='closed'){if(replay)play();return}if(state==='closing'||state==='leaving')return;
  const wasOpened=state==='opened';
  if(media.matches||!Element.prototype.animate){reset();if(replay)play();return}
  if(wasOpened){clear();build();for(const a of animations){a.pause();a.currentTime=P.duration-200;}root.classList.remove('is-opened');}
  const elapsed=wasOpened?P.duration-200:Math.max(0,Math.min(P.duration,clock?.currentTime||0));
  clearTimeout(timer);timer=null;token++;if(clock)clock.onfinish=null;status('closing');slot.style.zIndex='';delete page.dataset.openingPhase;
  const myToken=token;
  for(const a of animations){a.currentTime=elapsed;a.playbackRate=-2.25;a.play();}
  await Promise.allSettled(animations.map(a=>a.finished));
  if(token!==myToken)return;reset();if(replay)requestAnimationFrame(play);
 }
 stage.addEventListener('click',()=>state==='playing'?void close():play());
 stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stage.click()}});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&(state==='playing'||state==='opened')){e.preventDefault();void close();}});
 cancel.addEventListener('click',()=>void close());q('.v3-close')?.addEventListener('click',()=>void close());
 q('.replay')?.addEventListener('click',()=>void close(true));
 document.querySelectorAll('[data-skip],[data-enter]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go()}));
 media.addEventListener('change',()=>{if(media.matches&&(state==='playing'||state==='closing'))go()});
 addEventListener('pagehide',()=>{clearTimeout(timer);if(clock)clock.onfinish=null;token++});
 addEventListener('pageshow',e=>{if(e.persisted){clear();root.classList.add('is-opened');status('opened');}});
 if(/[?&]replay=1(&|$)/.test(location.search))reset();else status(state);
 page.dataset.openingReady='true';
})();
