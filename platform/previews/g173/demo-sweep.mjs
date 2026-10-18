const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const ids = process.argv.slice(2);
const b = await chromium.launch();
for (const id of ids) {
  const ctx = await b.newContext({viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true}); const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8}); await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  let bytes=0; cdp.on('Network.loadingFinished',e=>bytes+=e.encodedDataLength);
  await p.addInitScript(()=>{window.__l=[];window.__c=0;new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__c+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())window.__l.push([Math.round(e.startTime),(e.element?.tagName||'')+'.'+(e.element?.className||''),(e.url||'').split('/').pop()])}).observe({type:'largest-contentful-paint',buffered:true});});
  await p.goto('http://127.0.0.1:3500/start/demo/'+id,{waitUntil:'load',timeout:120000}); await p.waitForTimeout(6000);
  const l = await p.evaluate(()=>window.__l); const cls = await p.evaluate(()=>window.__c.toFixed(3));
  const last = l[l.length-1]||[0,'',''];
  console.log(id.padEnd(30), String(last[0]).padStart(5),'ms', String(Math.round(bytes/1024)).padStart(5),'KB', 'CLS', cls, last[1].slice(0,30), last[2]);
  await ctx.close();
}
await b.close();
