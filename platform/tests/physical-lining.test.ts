import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'../themes');
// docs/35: velvet-jewel-box (G423) and orient-express-voyage (G425) were rebuilt from their own layered GPT parts and have
// no v3/v4 cut faces any more.
const ids=['nocturne-lake-estate','grand-theatre-premiere','maison-patisserie','celestial-observatory','azulejo-mosaic','sky-lantern-festival','music-box-ballerina'];
for(const id of ids)test(id+': replacement lining and reverse faces retain the original physical cut',async()=>{
 const dir=path.join(root,id),opening=JSON.parse(readFileSync(path.join(dir,'opening-design.json'),'utf8'));
 for(const name of ['lining',...opening.parts.map((p:string)=>p+'-back')]){
  const old=await sharp(path.join(dir,'img/v3-'+name+'.webp')).ensureAlpha().extractChannel(3).raw().toBuffer();
  const actual=await sharp(path.join(dir,'img/v4-'+name+'.webp')).ensureAlpha().extractChannel(3).raw().toBuffer();
  assert.deepEqual(actual,old,name+' must not lose corners or move the hinge mask');
 }
});
test('Maison: transparent paper artwork becomes paper-coloured lining, never opaque black holes',async()=>{
 const dir=path.join(root,'maison-patisserie');
 const {data:output,info}=await sharp(path.join(dir,'img/v4-lining.webp')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const source=await sharp(path.join(dir,'img/ph_interior-800.webp')).ensureAlpha().resize(info.width,info.height,{fit:'fill',kernel:'nearest'}).raw().toBuffer();
 let checked=0;
 for(let y=10;y<info.height-10;y+=11)for(let x=10;x<info.width-10;x+=11){
  const i=(y*info.width+x)*4;
  if(output[i+3]<250)continue;
  let clear=true;
  for(const dy of [-3,0,3])for(const dx of [-3,0,3])if(source[((y+dy)*info.width+x+dx)*4+3]>0)clear=false;
  if(!clear)continue;
  assert.ok(output[i]+output[i+1]+output[i+2]>480,'transparent source must expose light paper stock, not black');
  checked++;
 }
 assert.ok(checked>10,'sample actual transparent areas within the physical housing');
});
