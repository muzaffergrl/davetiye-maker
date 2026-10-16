import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import {claimableTheme} from '../lib/claim/themes.ts';
import {draftFromDemo} from '../lib/claim/claim.ts';
import {handleDemoPage} from '../lib/claim/demo-page.ts';
import {themeOpenForClaims} from '../lib/themes/approval.ts';
import {MARKETING} from '../lib/marketing/config.ts';
import {DESIGN_COPY,designStyles,openingObject} from '../lib/marketing/designs.ts';
import {designSound} from '../lib/audio/catalog.ts';
import {renderTemplate} from '../lib/theme/engine.ts';
import type {PageName} from '../lib/theme/theme.ts';
import type {ContentRecord} from '../lib/content/types.ts';
const id='crimson-rose-atelier';

test('Crimson is an independent demo-ready product, kept off sale until approval',async()=>{
 const theme=await claimableTheme(id);assert.ok(theme);assert.equal(theme.name,'Crimson Rose Atelier');
 assert.equal(MARKETING.designs.find(d=>d.id===id)?.status,'coming');
 assert.equal(themeOpenForClaims(id,{env:{VERCEL_ENV:'production'}}),false);
 assert.equal(openingObject(DESIGN_COPY[id]),'envelope');assert.ok(designStyles(id).includes('floral'));
 assert.equal(Object.keys(theme.manifest.photos).length,5);
});

test('Demo route renders every page with real sample photos and safe preview navigation',async()=>{
 for(const page of ['index','home','story','details','rsvp']){
  const response=await handleDemoPage(new Request('https://preview.example/start/demo/'+id+(page==='index'?'':'/'+page)),id,page);
  assert.equal(response.status,200,page);assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
  const $=cheerio.load(await response.text());assert.equal($('h1').length,1);
  const data=JSON.parse($('#site-data').text());assert.equal(data.preview,true);
  assert.match(data.pages.home,/^\/start\/demo\/crimson-rose-atelier\/home/);
  assert.equal($('a[href*="127.0.0.1"]').length,0);
  if(page==='home')assert.match($('[data-photo="hero_portrait"]').attr('src')||'',/\/themes\/crimson-rose-atelier\/img\/couple-photo.webp/);
  if(page==='story')assert.equal($('[data-album-page]').length,3);
 }
});

test('Starting a buyer draft never copies fictional sample photos or full names',async()=>{
 const theme=await claimableTheme(id);assert.ok(theme);assert.ok(theme.demo.media?.hero_portrait);
 const draft=draftFromDemo(theme.demo,['Elena','Marco']);
 assert.deepEqual(draft.media,{hero_portrait:null,memory_photos:[],couple_clip:null,venue_image:null});
 assert.equal(draft.partners[0].full_name,null);assert.equal(draft.name_display,'Elena & Marco');
 assert.ok(theme.demo.media?.hero_portrait,'source demo was not modified');
});

test('New album stays optional and thank-you mode closes RSVP without discarding the story',async()=>{
 const theme=await claimableTheme(id);assert.ok(theme);const demo=structuredClone(theme.demo);
 const render=async(page:PageName,content:ContentRecord)=>renderTemplate({html:await readFile(path.join(theme.loaded.dir,theme.manifest.pages[page]!),'utf8'),theme:theme.manifest,content,page,slug:'review',previewKey:'demo',now:new Date('2026-10-17')});
 demo.optional_blocks.our_story=false;assert.equal((await render('story',demo)).disabled,true);
 demo.optional_blocks.our_story=true;demo.thank_you={mode:'on',message:'Thank you for joining our celebration.',details:'hide'};
 const home=cheerio.load((await render('home',demo)).html);assert.match(home.text(),/Thank you for joining/);assert.equal(home('a[href*="/rsvp"]').length,0);assert.equal(home('[data-countdown]').length,0);
 assert.equal((await render('details',demo)).disabled,true);assert.equal((await render('story',demo)).disabled,false);
 const reply=cheerio.load((await render('rsvp',demo)).html);assert.equal(reply('[data-rsvp-form]').length,0);
});

test('Default audio cues match the independently animated opening',()=>{
 assert.deepEqual(designSound(id),{music:'evening-strings',opening:[[0,'seal'],[400,'paper'],[1600,'slide'],[3000,'chime']]});
});

test('Every demo photo is a bundled theme asset, with no external photo dependency',async()=>{
 const theme=await claimableTheme(id);assert.ok(theme);const media=theme.demo.media;
 for(const url of [media.hero_portrait,...(media.memory_photos??[]),media.venue_image]){
  assert.ok(url);assert.ok(url.startsWith('/themes/'+id+'/img/'));const file=path.join(theme.loaded.dir,url.split('/img/')[1]?('img/'+url.split('/img/')[1]):'');assert.ok((await stat(file)).size>0);
 }
});
