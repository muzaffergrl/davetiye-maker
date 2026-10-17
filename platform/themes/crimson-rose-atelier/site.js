/* Crimson Rose Atelier. Personal content is rendered by the platform, not copied into this script. */
const MOTION = {
  envelope: {
    closure: [0, 400],
    lift: [400, 1050],
    rise: [1600, 1400],
    forward: [3000, 300]
  },
  storage: {opened:'crimson:opened',arrive:'crimson:arrive'}
};
(()=>{'use strict';
const root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
let site={};try{site=JSON.parse($('#site-data')?.textContent||'{}')}catch{}
const pages=site.pages||{home:'home.html',story:'story.html',details:'details.html',rsvp:'rsvp.html'};
const key=MOTION.storage.opened+':'+(site.slug||'local');
function fitNames(){ $$('.names').forEach(el=>{el.style.fontSize='';const children=[...el.querySelectorAll('span')];const isLong=children.some(n=>n.textContent.length>14);el.classList.toggle('long-names',isLong);el.closest('.home-hero')?.classList.toggle('is-long',isLong);children.forEach(n=>n.style.whiteSpace='nowrap');let size=parseFloat(getComputedStyle(el).fontSize);for(let i=0;i<90&&Math.max(...children.map(n=>n.scrollWidth))>el.clientWidth+1&&size>24;i++){size-=2;el.style.fontSize=size+'px';}if(Math.max(...children.map(n=>n.scrollWidth))>el.clientWidth+1)children.forEach(n=>n.style.whiteSpace='normal');});}
fitNames();document.fonts?.ready.then(fitNames);addEventListener('resize',fitNames,{passive:true});
const stage=$('.stage');
if(stage){let opening=false,timer;const replay=$('.replay');const enter=()=>{try{sessionStorage.setItem(key,'1')}catch{}location.assign(pages.home)};
stage.addEventListener('click',()=>{if(opening)return;opening=true;root.classList.add('is-opening');stage.setAttribute('aria-disabled','true');timer=setTimeout(enter,reduce?100:3350)});
replay?.addEventListener('click',()=>{clearTimeout(timer);opening=false;root.classList.remove('is-opening','is-opened');stage.removeAttribute('aria-disabled');replay.hidden=true;stage.focus()});
addEventListener('pageshow',event=>{if(event.persisted){clearTimeout(timer);opening=false;root.classList.remove('is-opening');stage.removeAttribute('aria-disabled')}});
}
// A manual album: native buttons, keyboard arrows and optional swipe, no auto-rotation or hidden focus targets.
const leaves=$$('[data-album-page]'), prev=$('[data-album-prev]'), next=$('[data-album-next]');
if(leaves.length){let active=Math.max(0,Math.min(2,Number(location.hash.replace('#chapter-',''))-1||0));
const tabs=$$('[data-album-go]');
function show(index,animate=true){active=Math.max(0,Math.min(leaves.length-1,index));leaves.forEach((leaf,i)=>{leaf.hidden=i!==active;leaf.classList.toggle('changing',i===active&&animate&&!reduce)});tabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));$('[data-album-number]').textContent=String(active+1).padStart(2,'0');prev.disabled=active===0;next.disabled=active===leaves.length-1;history.replaceState(null,'','#chapter-'+(active+1))}
$('.album-controls').hidden=false;$('.album-tabs').hidden=false;show(active,false);
prev.addEventListener('click',()=>show(active-1));next.addEventListener('click',()=>show(active+1));tabs.forEach((t,i)=>t.addEventListener('click',()=>show(i)));
$('.album').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(active-1)}if(e.key==='ArrowRight'){e.preventDefault();show(active+1)}});
let x=null;$('.album-pages').addEventListener('touchstart',e=>{x=e.touches[0].clientX},{passive:true});$('.album-pages').addEventListener('touchend',e=>{if(x!==null){const dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>60)show(active+(dx<0?1:-1))}x=null},{passive:true});
addEventListener('hashchange',()=>{const n=Number(location.hash.replace('#chapter-',''))-1;if(Number.isInteger(n)&&n>=0&&n<leaves.length)show(n)});
}
// Calendar target is supplied by the platform, including the chosen event time zone.
$$('[data-countdown]').forEach(box=>{const target=Date.parse(site.derived?.countdown_target_utc||'');if(!Number.isFinite(target)){box.hidden=true;return}const cells=Object.fromEntries([...box.querySelectorAll('[data-unit]')].map(n=>[n.dataset.unit,n]));function tick(){const diff=target-Date.now();if(diff<=0){box.classList.add('is-done');box.querySelectorAll('.cd-done').forEach(n=>{n.hidden=(n.dataset.when==='today')!==(-diff<43200000)});return false}const s=Math.floor(diff/1000);Object.entries({days:Math.floor(s/86400),hours:Math.floor(s%86400/3600),minutes:Math.floor(s%3600/60),seconds:s%60}).forEach(([u,v])=>{if(cells[u])cells[u].textContent=String(v).padStart(2,'0')});return true}if(tick()){const timer=setInterval(()=>{if(!tick())clearInterval(timer)},1000)}});
// Animate only on entrance; content is always readable when JS is unavailable.
if(!reduce&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:.4,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});io.unobserve(e.target)}}),{threshold:.08});$$('[data-reveal]').forEach(n=>io.observe(n))}
})();
