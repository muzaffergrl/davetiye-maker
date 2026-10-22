// The review sample QR points to this actual design demo, never a fictional couple URL.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {invitationPdf} from '../../../platform/lib/print/invitation.ts';
import {closePrintBrowser} from '../../../platform/lib/print/browser.ts';
const collection=path.resolve(import.meta.dirname,'..');
const content=JSON.parse(readFileSync(path.join(collection,'content.demo.json'),'utf8'));
const out=path.join(collection,'package/print');mkdirSync(out,{recursive:true});
try {
 const pdf=await invitationPdf({themeId:'ivory-pearl-atelier',content,siteUrl:'https://bkestudio.com/start/demo/ivory-pearl-atelier',publicOrigin:'https://bkestudio.com',size:'5x7',bleed:true,marks:false,back:true});
 writeFileSync(path.join(out,'ivory-pearl-atelier-invite-5x7-bleed.pdf'),pdf);
 console.log('Two-page print sample uses the design demo URL.');
} finally {await closePrintBrowser();}
