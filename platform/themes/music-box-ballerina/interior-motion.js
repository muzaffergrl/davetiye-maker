/* Music Box Ballerina: music-box-turn; interior pages only. The cover and shared form behaviours stay independent. */
(()=>{'use strict';const profile={name:"music-box-turn",duration:1700,gap:110,hero:["date","names","card","place","countdown","cue"]};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let observer;const nodes=[];
function showAll(){observer?.disconnect();document.documentElement.classList.remove('u-ready');for(const node of nodes){node.classList.add('u-visible','u-settled');}}
function start(){document.body.dataset.interiorMotion=profile.name;document.body.dataset.motionReady='true';
 const picks=document.querySelectorAll('.hero-inner > *, .u-memory, .u-sheet, .page-head > :not(img), .block, .faq-item, .teaser, .foot, .sched-row');
 for(const [i,node]of [...picks].entries()){if(node.closest('template')||node.hidden)continue;node.dataset.uReveal='';node.dataset.uMotion=profile.name;const part=node.dataset.uPart;const order=node.closest('.hero-inner')?Math.max(0,profile.hero.indexOf(part)):(i%4);node.style.setProperty('--u-delay',Math.min(order*profile.gap,650)+'ms');nodes.push(node);node.addEventListener('animationend',e=>{if(e.target===node)node.classList.add('u-settled');});}
 if(reduced.matches||!('IntersectionObserver'in window)){showAll();return;}
 document.documentElement.classList.add('u-ready');observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('u-visible');observer.unobserve(e.target);}},{threshold:.06,rootMargin:'0px 0px -8px 0px'});for(const n of nodes)observer.observe(n);
 reduced.addEventListener('change',()=>{if(reduced.matches)showAll();});window.addEventListener('beforeprint',showAll);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&reduced.matches)showAll();});}
 const ready=document.fonts?.ready||Promise.resolve();Promise.race([ready,new Promise(r=>setTimeout(r,1200))]).then(()=>requestAnimationFrame(()=>{start();document.documentElement.classList.remove('u-loading');}));
})();
