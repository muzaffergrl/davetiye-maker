import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'../themes');
// docs/35: velvet-jewel-box (G423) and nocturne-lake-estate (G422) were rebuilt from their own layered GPT parts and have
// no v3/v4 cut faces any more.
const ids=['grand-theatre-premiere','orient-express-voyage','maison-patisserie','celestial-observatory','azulejo-mosaic','sky-lantern-festival','music-box-ballerina'];
for(const id of ids)test(id+': replacement lining and reverse faces retain the original physical cut',async()=>{
 const dir=path.join(root,id),opening=JSON.parse(readFileSync(path.join(dir,'opening-design.json'),'utf8'));
 for(const name of ['lining',...opening.parts.map((p:string)=>p+'-back')]){
  const old=await sharp(path.join(dir,'img/v3-'+name+'.webp')).ensureAlpha().extractChannel(3).raw().toBuffer();
  const actual=await sharp(path.join(dir,'img/v4-'+name+'.webp')).ensureAlpha().extractChannel(3).raw().toBuffer();
  assert.deepEqual(actual,old,name+' must not lose corners or move the hinge mask');
 }
});
