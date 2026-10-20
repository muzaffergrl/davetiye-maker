import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import {renderTemplate} from '../../lib/theme/engine.ts';
import {withDemoPhotos} from '../../lib/claim/demo-photos.ts';
const root=path.resolve(import.meta.dirname,'../..');
const pages=['index','home','story','details','rsvp'] as const;
export function registerRebuiltThemeTests(id: string){
 const item={id};
 const dir=path.join(root,'themes',item.id);
 const manifest=JSON.parse(readFileSync(path.join(dir,'theme.json'),'utf8'));
 const demo=JSON.parse(readFileSync(path.join(dir,'content.demo.json'),'utf8'));
 test(item.id+': complete five-page flow, editable media and real raster assets',()=>{
  assert.deepEqual(Object.keys(manifest.pages).sort(),[...pages].sort());
  assert.deepEqual(Object.keys(manifest.photos),['hero_portrait','story_1','story_2','story_3','venue']);
  const content=withDemoPhotos(item.id,manifest.photos,demo);
  assert.ok(content.media.hero_portrait);assert.equal(content.media.memory_photos.length,3);assert.ok(content.media.venue_image);
  const refs=new Set<string>();
  for(const page of pages){
   const source=readFileSync(path.join(dir,page+'.html'),'utf8');
   const result=renderTemplate({html:source,content,theme:manifest,page,slug:'sample-'+item.id,previewKey:'demo',origin:'http://localhost:3391'});
   assert.equal(result.disabled,false,page);assert.deepEqual(result.warnings,[],page);
   const $=cheerio.load(result.html);
   assert.ok($('title').text().includes(demo.partners[0].display_name),page);
   assert.equal($('[data-repeat]').length,0,page);
   $('[src], [srcset]').each((_,el)=>{for(const v of [$(el).attr('src'),...($(el).attr('srcset')||'').split(',').map(v=>v.trim().split(/\s+/)[0])]){
    if(v?.startsWith('/themes/'+item.id+'/'))refs.add(v.slice(('/themes/'+item.id+'/').length).split('?')[0]);
    if(v?.startsWith('/demo/'))assert.ok(existsSync(path.join(root,'public',v)),v);
   }});
   if(page==='index'){
    assert.ok($('.stage').length);
    if($('.v3-closed').length){
     const opening=JSON.parse(readFileSync(path.join(dir,'opening-design.json'),'utf8'));
     assert.equal($('.v3-lining').length,1,'physical lining');
     assert.equal($('.v3-piece').length,opening.parts.length,'independent physical folds');
     for(const part of opening.parts){const face=$('[data-piece="'+part+'"]');assert.equal(face.length,1);assert.equal(face.find('.v3-front').length,1);assert.equal(face.find('.v3-back').length,1);}
     assert.equal($('.v3-pocket').length,opening.pocket?1:0,'a pocket is present only for a pocket construction');
    }else assert.ok($('.env-pocket').length);
    assert.ok($('.card [data-photo="hero_portrait"]').length);assert.ok($('[data-enter]').length);assert.ok($('[data-skip]').length);
   }
   if(page==='story')assert.equal($('[data-photo]').length,3);
   if(page==='rsvp')assert.ok($('[data-rsvp-form]').length,'shared RSVP form');
   for(const photo of $('[data-photo]').toArray())assert.match($(photo).attr('src')||'',/^\/(demo|themes)\//,page+': real sample photo');
  }
  const css=readFileSync(path.join(dir,'site.css'),'utf8');
  for(const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))if(m[1].startsWith('img/'))refs.add(m[1]);
  for(const ref of refs)assert.ok(existsSync(path.join(dir,ref)),item.id+': '+ref);
  if(existsSync(path.join(dir,'opening-design.json'))){
   const opening=JSON.parse(readFileSync(path.join(dir,'opening-design.json'),'utf8'));
   if(opening.version===3){
    const physical=['img/v3-closed-440.webp','img/v3-closed-880.webp',opening.liningArtwork??'img/v3-lining.webp',...opening.parts.flatMap((p:string)=>['img/v3-'+p+'.webp',opening.reverseArtwork?.[p]??'img/v3-'+p+'-back.webp'])];
    for(const part of physical)assert.ok(refs.has(part),item.id+': rendered physical part '+part);
   }else assert.ok(refs.size>30);
  }else assert.ok(refs.size>30);
  assert.ok(css.includes('prefers-reduced-motion'));
 });
 test(item.id+': hidden story, empty buyer photos and thank-you mode remain valid',()=>{
  for(const page of pages){
   const source=readFileSync(path.join(dir,page+'.html'),'utf8');
   const content=structuredClone(demo);content.optional_blocks.our_story=false;
   const result=renderTemplate({html:source,content,theme:manifest,page,slug:'empty-'+item.id});
   assert.deepEqual(result.warnings,[],page);
   if(page==='story')assert.equal(result.disabled,true);
  }
  const ty={...demo,thank_you:{mode:'on',title:'With all our love',message:'Thank you for sharing our day.',photo:null}};
  for(const page of pages){
   const result=renderTemplate({html:readFileSync(path.join(dir,page+'.html'),'utf8'),content:ty,theme:manifest,page,slug:'thanks-'+item.id});
   assert.deepEqual(result.warnings,[],page+' thank-you');
  }
 });
}
