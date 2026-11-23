import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const url=process.env.KIDS_TEST_URL||'http://127.0.0.1:8765/';
const engine=process.env.KIDS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const errors=[],nonGets=[];
const pass=s=>console.log('G6 BROWSER PASS ['+engine+'] '+s);
const shot=async(p,name)=>{if(url.includes('127.0.0.1')){mkdirSync('artifacts',{recursive:true});await p.screenshot({path:'artifacts/g6-'+engine+'-'+name+'.png',fullPage:true});}};
const watch=p=>{p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(r.method()!=='GET')nonGets.push(r.method())});};
async function checkArt(p){
 for(const cat of ['hats','scarves','shoes','backpacks','tools']){
  await p.locator('[data-category="'+cat+'"]').click();
  await p.waitForFunction(()=>document.querySelectorAll('.shop-item>img[data-art-centered="true"]').length===3);
  const metrics=await p.locator('.shop-item').evaluateAll(async cards=>{
   const {alphaBounds}=await import(new URL('assets/animation/wardrobe-art.js',document.baseURI).href);
   return Promise.all(cards.map(async card=>{
    const img=card.querySelector(':scope > img'),b=await alphaBounds(img),r=img.getBoundingClientRect(),c=card.getBoundingClientRect();
    const s=Math.min(r.width/img.naturalWidth,r.height/img.naturalHeight);
    const center=r.x+r.width/2+((b.l+b.r)/2-.5)*img.naturalWidth*s;
    return {centerDelta:Math.abs(center-(c.x+c.width/2))/c.width,inside:r.x+b.l*r.width>=c.x-2&&r.x+b.r*r.width<=c.right+2};
   }));
  });
  assert.ok(metrics.every(x=>x.centerDelta<.025&&x.inside),cat+' '+JSON.stringify(metrics));
 }
 await p.locator('[data-category="scarves"]').click();
 await p.waitForSelector('[data-art-centered="true"]');
}
async function frame(p,action,gear,name){
 await p.evaluate(a=>{void window.__kidsSmoke.playCatMotion(a);},action);
 const layer=p.locator('.cat-motion-layer');
 await layer.waitFor({timeout:4000});
 assert.equal(await layer.getAttribute('data-action'),action);
 assert.equal(await layer.getAttribute('data-gear-count'),String(gear));
 assert.equal(await layer.evaluate(c=>getComputedStyle(c.parentElement.querySelector('.cat-base')).visibility),'hidden');
 // Real rendered canvas, not merely a CSS animation name.
 const initial=await layer.evaluate(c=>c.toDataURL());
 await p.waitForFunction(()=>{const c=document.querySelector('.cat-motion-layer');return c&&Number(c.dataset.phase)>.34&&Number(c.dataset.phase)<.80;},{},{timeout:4000});
 const mid=await layer.evaluate(c=>{
  const ctx=c.getContext('2d'),a=ctx.getImageData(0,0,c.width,c.height).data;
  let count=0;for(let i=3;i<a.length;i+=4)if(a[i]>100)count++;
  return {data:c.toDataURL(),count,corner:a[3]};
 });
 assert.notEqual(initial,mid.data,'gesture actually changes rendered pixels: '+action);
 assert.ok(mid.count>9000&&mid.corner===0,'visible alpha composite '+action);
 await shot(p,name+'-'+action);
 await layer.waitFor({state:'detached',timeout:8000});
 assert.equal(await p.locator('.motion-active').count(),0);
}
try{
 const c=await browser.newContext({viewport:{width:1649,height:837}});
 const p=await c.newPage();watch(p);await p.goto(url+'?smoke=1',{waitUntil:'networkidle'});
 const scene=await p.locator('.island-ambient').evaluate(el=>({pointer:getComputedStyle(el).pointerEvents,falls:el.querySelectorAll('.fall-stream').length,waves:el.querySelectorAll('.shore-wave').length,leaves:el.querySelectorAll('.foliage-sway').length,names:[...el.querySelectorAll('.fall-stream,.shore-wave,.foliage-sway')].map(x=>getComputedStyle(x).animationName)}));
 assert.equal(scene.pointer,'none');assert.equal(scene.falls,12);assert.equal(scene.waves,6);assert.equal(scene.leaves,3);assert.ok(scene.names.every(n=>n!=='none'));
 const offset1=await p.locator('.fall-stream').first().evaluate(x=>getComputedStyle(x).strokeDashoffset);await p.waitForTimeout(240);const offset2=await p.locator('.fall-stream').first().evaluate(x=>getComputedStyle(x).strokeDashoffset);assert.notEqual(offset1,offset2);
 await p.locator('#cat-button').click();await p.waitForSelector('[data-portrait-fitted="true"]');
 await checkArt(p);await shot(p,'wardrobe-scarves');
 const bare=await p.locator('.cat-preview').evaluate(el=>({w:el.clientWidth,avatar:el.querySelector('.cat-avatar-canvas').offsetWidth}));assert.ok(bare.avatar>bare.w,'visible portrait uses transparent padding correctly');
 await p.locator('#close-modal').click();
 await p.evaluate(()=>window.__kidsSmoke.forceProgress({purchasedItemIds:['hats-1','scarves-1','shoes-1','backpacks-1','tools-1'],equippedBySlot:{hats:'hats-1',scarves:'scarves-1',shoes:'shoes-1',backpacks:'backpacks-1',tools:'tools-1'}}));
 assert.equal(await p.locator('#island-cat .equipped-item').count(),5);
 const saved=await p.evaluate(()=>localStorage.getItem('kids-english.progress.v1'));
 for(const action of ['wave','wink','stretch','sit'])await frame(p,action,5,'map-dressed');
 await p.locator('#cat-button').click();await p.waitForSelector('[data-portrait-fitted="true"]');
 assert.equal(await p.locator('.cat-preview .equipped-item').count(),5);
 await frame(p,'wave',5,'wardrobe-dressed');await frame(p,'sit',5,'wardrobe-dressed');
 await p.locator('#close-modal').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('kids-english.progress.v1')),saved);
 await p.locator('[data-stop="1"]').click();
 assert.equal(await p.evaluate(()=>window.__kidsSmoke.playCatMotion('wave')),false);
 await p.locator('#close-modal').click();
 pass('all 15 centered art, actual dressed wave/wink/stretch/sit frames, no progress writes, no motion during lesson');
 await c.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const m=await mobile.newPage();watch(m);await m.goto(url+'?smoke=1',{waitUntil:'networkidle'});
 await m.locator('#cat-button').click();await m.waitForSelector('[data-portrait-fitted="true"]');
 await m.locator('[data-category="scarves"]').click();await m.waitForSelector('[data-art-centered="true"]');
 await shot(m,'mobile-portrait');await frame(m,'wink',0,'mobile');await mobile.close();
 const reduced=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const r=await reduced.newPage();watch(r);await r.goto(url+'?smoke=1',{waitUntil:'networkidle'});
 assert.equal(await r.locator('.island-ambient').evaluate(el=>getComputedStyle(el).display),'none');
 assert.equal(await r.evaluate(()=>window.__kidsSmoke.playCatMotion('wave')),false);await reduced.close();
 const normal=await browser.newContext({viewport:{width:1280,height:800}});
 const n=await normal.newPage();watch(n);await n.goto(url,{waitUntil:'domcontentloaded'});
 await n.locator('#island-cat .cat-motion-layer').waitFor({timeout:20000});
 assert.ok(['wave','wink','stretch','sit'].includes(await n.locator('.cat-motion-layer').getAttribute('data-action')));
 await normal.close();assert.deepEqual(errors,[]);assert.deepEqual(nonGets,[]);pass('mobile, reduced motion, actual normal-page randomized scheduler, no JS errors or non-GET');
}finally{await browser.close();}
