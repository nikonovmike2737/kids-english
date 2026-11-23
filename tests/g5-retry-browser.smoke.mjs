import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const url=process.env.KIDS_TEST_URL||'http://127.0.0.1:8765/';
const engine=process.env.KIDS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
async function fail(p){
 await p.locator('[data-stop="1"]').click();await p.locator('#start-lesson').click();
 for(let i=0;i<3;i++){
  await p.locator('[data-choice="0"]').click();await p.locator('#verify').click();
  if(i<2)await p.locator('#modal-retry').click();
 }
}
try{
 for(const [width,height] of [[1649,928],[1280,800],[390,844],[844,390]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390});
  const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(url,{waitUntil:'networkidle'});
  await fail(p);
  const card=p.locator('#gameover-layer .gameover-card');
  assert.equal(await card.count(),1);
  assert.equal(await p.locator('#lesson-hearts').innerText(),'🤍🤍🤍');
  assert.match(await card.innerText(),/Try Again/);
  const art=await card.locator('.retry-cat').evaluate(async img=>{
   await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const r=img.getBoundingClientRect();const dialog=img.closest('.gameover-card').getBoundingClientRect();const buttons=[...img.closest('.gameover-card').querySelectorAll('.btn-row button')].map(x=>x.getBoundingClientRect().toJSON());
   return {natural:[img.naturalWidth,img.naturalHeight],box:r.toJSON(),dialog:dialog.toJSON(),buttons,alpha:ctx.getImageData(0,0,1,1).data[3],src:img.getAttribute('src')};
  });
  assert.deepEqual(art.natural,[512,512]);assert.equal(art.alpha,0);assert.match(art.src,/g5-sad-kitten\.webp/);
  assert.ok(art.box.width>=Math.min(230,height*.30),'large visible illustration '+JSON.stringify(art));
  assert.ok(art.box.left>=art.dialog.left&&art.box.right<=art.dialog.right&&art.box.bottom<=art.dialog.bottom);
  assert.equal(art.buttons.length,2);assert.ok(art.buttons.every(b=>b.bottom<=height&&b.right<=width&&b.left>=0),'both actions visible '+JSON.stringify(art));
  if(url.includes('127.0.0.1')){mkdirSync('artifacts',{recursive:true});await p.screenshot({path:'artifacts/g5-'+engine+'-retry-'+width+'x'+height+'.png',fullPage:true});}
  await card.locator('#retry').click();assert.equal(await p.locator('#lesson-hearts').innerText(),'❤️❤️❤️');
  assert.match(await p.locator('.lesson-count').innerText(),/Task 1 of 4/);
  await p.locator('#close-modal').click();await fail(p);await p.locator('#exit-fail').click();
  assert.equal(await p.locator('#gameover-layer').count(),0);assert.equal(await p.locator('#hud-keys').innerText(),'0/12');assert.deepEqual(errors,[]);
  console.log('G5 BROWSER PASS ['+engine+'] '+width+'x'+height+'; large transparent retry kitten, Play Again restores hearts, Back to Map works');
  await c.close();
 }
}finally{await browser.close();}
