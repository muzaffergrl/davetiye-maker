/* Nocturne Lake Estate. Personal content is rendered by the platform, not copied into this script. */
const MOTION = {
  envelope: {
    closure: [0, 400],
    lift: [400, 1050],
    rise: [1600, 1400],
    forward: [3000, 300]
  },
  storage: {opened:'nocturne:opened',arrive:'nocturne:arrive'}
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
replay?.addEventListener('click',()=>{clearTimeout(timer);opening=false;root.classList.remove('is-opening','is-opened');stage.removeAttribute('aria-disabled');if(replay)replay.hidden=true;stage.focus()});
addEventListener('pageshow',event=>{if(event.persisted){clearTimeout(timer);opening=false;root.classList.remove('is-opening');stage.removeAttribute('aria-disabled')}});
}
// Compact menu and an asymmetrical gallery with a native, keyboard-accessible dialog.
const menu=$('.menu-toggle');if(menu){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));root.classList.toggle('menu-open',open)});addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');root.classList.remove('menu-open')}});}
const lightbox=$('.lightbox'),shots=$('[data-gallery-open]');if(lightbox){let active=0;const image=lightbox.querySelector('img');function show(n){active=(n+shots.length)%shots.length;const src=shots[active].querySelector('img');image.src=src.currentSrc||src.src;image.alt=src.alt;lightbox.querySelector('p').textContent=shots[active].closest('figure').querySelector('figcaption').textContent.trim();lightbox.querySelector('[data-gallery-count]').textContent=(active+1)+' / '+shots.length;}
shots.forEach((b,i)=>b.addEventListener('click',()=>{show(i);lightbox.showModal()}));lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());lightbox.querySelector('[data-gallery-prev]').addEventListener('click',()=>show(active-1));lightbox.querySelector('[data-gallery-next]').addEventListener('click',()=>show(active+1));lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(active-1)}if(e.key==='ArrowRight'){e.preventDefault();show(active+1)}});lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});}
// Calendar target is supplied by the platform, including the chosen event time zone.
$$('[data-countdown]').forEach(box=>{const target=Date.parse(site.derived?.countdown_target_utc||'');if(!Number.isFinite(target)){box.hidden=true;return}const cells=Object.fromEntries([...box.querySelectorAll('[data-unit]')].map(n=>[n.dataset.unit,n]));function tick(){const diff=target-Date.now();if(diff<=0){box.classList.add('is-done');box.querySelectorAll('.cd-done').forEach(n=>{n.hidden=(n.dataset.when==='today')!==(-diff<43200000)});return false}const s=Math.floor(diff/1000);Object.entries({days:Math.floor(s/86400),hours:Math.floor(s%86400/3600),minutes:Math.floor(s%3600/60),seconds:s%60}).forEach(([u,v])=>{if(cells[u])cells[u].textContent=String(v).padStart(2,'0')});return true}if(tick()){const timer=setInterval(()=>{if(!tick())clearInterval(timer)},1000)}});
// Animate only on entrance; content is always readable when JS is unavailable.
if(!reduce&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:.4,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});io.unobserve(e.target)}}),{threshold:.08});$$('[data-reveal]').forEach(n=>io.observe(n))}
})();
