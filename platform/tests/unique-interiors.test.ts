import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import {scanCopy,manifestProblems} from '../lib/theme/copy-scan.ts';
import {renderTemplate} from '../lib/theme/engine.ts';
import covers from './fixtures/unique-interior-covers.json' with {type:'json'};
const root=path.resolve(import.meta.dirname,'..'),ids=[...new Set(Object.keys(covers).map(p=>p.split('/')[0]))];
const read=(id:string,p:string)=>readFileSync(path.join(root,'themes',id,p),'utf8');
test('interior redesign retains original closed-envelope artwork, base stylesheet and demo records; opening code may evolve',()=>{
 for(const [p,expected]of Object.entries(covers)){const actual=crypto.createHash('sha256').update(readFileSync(path.join(root,'themes',p))).digest('hex');assert.equal(actual,expected,p);}
});
test('eleven distinct interior layouts and animation profiles, no interior code on the covers',()=>{
 assert.equal(ids.length,11);const layouts=new Set(),motions=new Set(),frames=new Set();
 for(const id of ids){const design=JSON.parse(read(id,'interior-design.json'));layouts.add(design.layout);motions.add(design.motion);frames.add(crypto.createHash('sha256').update(readFileSync(path.join(root,'themes',id,'img/interior-frame-800.webp'))).digest('hex'));
 assert.ok(!read(id,'index.html').includes('interior.css'),id);assert.ok(!read(id,'index.html').includes('interior-motion.js'),id);
 assert.ok(read(id,'interior.css').includes('@keyframes u-'+design.motion),id);
 const js=read(id,'interior-motion.js');assert.ok(js.includes('prefers-reduced-motion: reduce')&&js.includes('IntersectionObserver')&&js.includes('beforeprint'),id);
 for(const page of ['home','story','details','rsvp']){const $=cheerio.load(read(id,page+'.html'));assert.equal($('body').attr('data-interior'),id);assert.equal($('link[href="interior.css"]').length,1);assert.equal($('script[src="interior-motion.js"]').length,1);assert.equal($('[data-step]').length,0,'old Blush animation hooks remain: '+id+'/'+page);}
 }
 assert.equal(layouts.size,11);assert.equal(motions.size,11);assert.equal(frames.size,11);
});
for(const id of ids){test(id+': real alpha photo matte, matching measured aperture and editable copy contract',async()=>{
 const design=JSON.parse(read(id,'interior-design.json')),mask=await sharp(path.join(root,'themes',id,'img/interior-photo-mask.png')).metadata();assert.equal(mask.hasAlpha,true,id);assert.equal(mask.width,design.photoWindow[2]-design.photoWindow[0]);assert.equal(mask.height,design.photoWindow[3]-design.photoWindow[1]);
 const html=Object.fromEntries(['index','home','story','details','rsvp'].map(p=>[p,read(id,p+'.html')]));assert.ok(html.details.includes('<div data-map data-map-btn="btn btn-ghost" data-map-btn-sm="btn btn-ghost btn-sm"></div>'),id+' shared map marker');const theme=JSON.parse(read(id,'theme.json'));const scan=scanCopy(html);assert.deepEqual(manifestProblems(theme.copy,scan),[]);assert.deepEqual(scan.unmarked??[],[]);
 for(const file of ['interior-frame-480.webp','interior-frame-800.webp','ph_interior-480.webp','ph_interior-800.webp'])assert.ok(existsSync(path.join(root,'themes',id,'img',file)),file);
 const demo=JSON.parse(read(id,'content.demo.json'));for(const page of ['home','story','details','rsvp'] as const){const rendered=renderTemplate({html:html[page],theme,content:demo,page,slug:'interior-qa'});assert.deepEqual(rendered.warnings,[],page);const $=cheerio.load(rendered.html);if(page==='rsvp'){assert.equal($('[data-rsvp-form]').length,1);assert.ok($('input[name="attending"]').length===2);}}
});}
