import { chromium } from '../../../platform/node_modules/playwright-core/index.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const out=path.resolve(import.meta.dirname,'../package/shots');mkdirSync(out,{recursive:true});
const origin=process.env.IVORY_TEST_ORIGIN||'http://127.0.0.1:3049';const base=origin+'/start/demo/ivory-pearl-atelier';
const browser=await chromium.launch({executablePath:process.env.PRINT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const page=await ctx.newPage();
const errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(origin))bad.push([r.status(),r.url()]);});
await page.goto(base+'?replay=1',{waitUntil:'networkidle'});
await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
await page.screenshot({path:out+'/opening_0.jpg'});
await page.evaluate(()=>document.documentElement.classList.add('is-opening'));
for(const t of [1200,2100,3200,4200]){await page.evaluate(t=>{for(const a of document.getAnimations()){a.pause();a.currentTime=t;}},t);await page.screenshot({path:out+'/opening_'+t+'.jpg'});}
console.log(JSON.stringify({errors,bad}));await browser.close();
