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


async function closeCentered(p){
 const result=await p.locator('.modal-panel .close').evaluateAll(buttons=>buttons.map(b=>{
  const r=b.getBoundingClientRect(),svg=b.querySelector('.close-glyph'),path=svg?.querySelector('path');
  if(!path)return {missing:true};
  const box=path.getBBox(),m=path.getScreenCTM(),center=new DOMPoint(box.x+box.width/2,box.y+box.height/2).matrixTransform(m);
  return {x:Math.abs(center.x-r.x-r.width/2),y:Math.abs(center.y-r.y-r.height/2),label:b.getAttribute('aria-label')};
 }));
 assert.ok(result.length&&result.every(v=>!v.missing&&v.x<.5&&v.y<.5&&v.label),'centered cross: '+JSON.stringify(result));
}
async function stableTabs(p){
 await p.waitForSelector('[data-portrait-fitted="true"]');
 await p.waitForTimeout(150);
 await closeCentered(p);
 await p.evaluate(()=>{
  const a=document.querySelector('.cat-preview .cat-avatar-canvas');
  const snapshot=()=>{const b=a.getBoundingClientRect();return [b.x,b.y,b.width,b.height]};
  const baseline=snapshot(),base=a.querySelector('.cat-base'),panel=a.closest('.modal-panel');
  window.__g8Portrait={a,base,panel,baseline,fail:[]};
  window.__g8Portrait.check=()=>{
   const s=window.__g8Portrait;
   if(document.querySelector('.cat-preview .cat-avatar-canvas')!==a||a.querySelector('.cat-base')!==base||a.closest('.modal-panel')!==panel||!a.isConnected)s.fail.push('portrait or modal remounted');
   if(snapshot().some((v,i)=>Math.abs(v-baseline[i])>.5))s.fail.push('portrait bounds changed '+snapshot());
  };
  window.__g8Portrait.observer=new MutationObserver(()=>window.__g8Portrait.check());
  window.__g8Portrait.observer.observe(panel,{subtree:true,childList:true,attributes:true});
 });
 for(const category of ['scarves','shoes','backpacks','tools','hats','tools','scarves','hats']){
  await p.locator('[data-category="'+category+'"]').click();
  await p.evaluate(()=>window.__g8Portrait.check());
  for(const tier of [2,3,1]){
   await p.locator('[data-item="'+tier+'"]').click();
   await p.evaluate(()=>window.__g8Portrait.check());
  }
 }
 await p.waitForTimeout(250);
 const failures=await p.evaluate(()=>{const s=window.__g8Portrait;s.check();s.observer.disconnect();return s.fail});
 assert.deepEqual(failures,[],'no intermediate remount or resize across category and item switches');
 pass('G8 stable same portrait DOM and geometry across 8 categories and 24 item changes');
}

async function staticCat(p,selector){
 const cat=p.locator(selector);
 const snap=()=>cat.evaluate(el=>({html:el.innerHTML,transform:getComputedStyle(el).transform,box:el.getBoundingClientRect().toJSON()}));
 await p.waitForTimeout(1000); // Allow initial portrait resize/alpha fit and modal entrance to settle.
 const before=await snap();await p.waitForTimeout(550);const after=await snap();
 assert.equal(after.html,before.html);assert.equal(after.transform,before.transform);
 for(const key of ['x','y','width','height'])assert.ok(Math.abs(after.box[key]-before.box[key])<.75,'static fitted portrait '+key);
 assert.equal(await cat.evaluate(el=>el.getAnimations({subtree:true}).length),0,'no mascot or accessory animations');
 assert.equal(await p.locator('.cat-motion-layer,.motion-active').count(),0);
}
async function mapCheck(p){
 await p.evaluate(()=>Promise.all([...document.querySelectorAll('.chest-node img,.stage-icon')].map(x=>x.decode())));
 const m=await p.evaluate(()=>{
 const nodes=[...document.querySelectorAll('[data-stop]')];
 const rows=[['chest-a',...nodes.slice(0,4)],['chest-b',...nodes.slice(4,8)],['chest-c',...nodes.slice(8,12)]];
 const chestEls=[...document.querySelectorAll('.chest-node')];
 const gapRows=rows.map(row=>{
  const boxes=row.map(x=>{
   const el=typeof x==='string'?document.querySelector('[data-chest="'+x+'"]'):x;
   const rect=el.getBoundingClientRect();
   const img=el.querySelector('img');
   // The lesson disks are their full button width. Chests have 3% transparent trim.
   const w=el.classList.contains('chest-node')?rect.width*.97:rect.width;
   return {left:rect.x+(rect.width-w)/2,right:rect.x+(rect.width+w)/2,y:rect.y+rect.height/2};
  }).sort((a,b)=>a.left-b.left);
  return {gaps:boxes.slice(1).map((x,i)=>x.left-boxes[i].right),ys:boxes.map(x=>x.y)};
 });
 const art=chestEls.map(el=>{
  const img=el.querySelector('img'),c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const a=ctx.getImageData(0,0,c.width,c.height).data;
  let empty=0;for(let i=3;i<a.length;i+=4)if(a[i]===0)empty++;
  return {alpha:empty/(a.length/4),corner:a[3],lock:!!el.querySelector('.chest-padlock'),state:el.dataset.state,filter:getComputedStyle(el).filter};
 });
 return {gapRows,art,icons:[...document.querySelectorAll('.stage-icon')].map(x=>x.naturalWidth),bridge:[...document.querySelectorAll('.bridge-route')].map(x=>x.getTotalLength())};
 });
 for(const row of m.gapRows){
  assert.ok(row.gaps.every(x=>x>0),'positive edge gap '+JSON.stringify(row));
  assert.ok(Math.max(...row.gaps)-Math.min(...row.gaps)<3,'equal edge gaps '+JSON.stringify(row));
  assert.ok(Math.max(...row.ys)-Math.min(...row.ys)<3,'row centerline '+JSON.stringify(row));
 }
 assert.equal(m.art.length,4);assert.ok(m.art.every(x=>x.alpha>.10&&x.corner===0&&!x.lock&&x.filter==='none'),JSON.stringify(m.art));
 assert.equal(m.icons.length,3);assert.ok(m.icons.every(x=>x>0));assert.equal(m.bridge.length,3);assert.ok(m.bridge.every(x=>x>100));
 await shot(p,'g7-map');
 pass('4 clean transparent chest sprites without extra locks, equal row gaps and 3 local sign icons');
}
try{
 const c=await browser.newContext({viewport:{width:1649,height:837}});
 const p=await c.newPage();watch(p);await p.goto(url+'?smoke=1',{waitUntil:'networkidle'});
 await mapCheck(p);
 const scene=await p.locator('.island-ambient').evaluate(el=>({pointer:getComputedStyle(el).pointerEvents,falls:el.querySelectorAll('.fall-stream').length,waves:el.querySelectorAll('.shore-wave').length,leaves:el.querySelectorAll('.foliage-sway').length,names:[...el.querySelectorAll('.fall-stream,.shore-wave,.foliage-sway')].map(x=>getComputedStyle(x).animationName)}));
 assert.equal(scene.pointer,'none');assert.equal(scene.falls,12);assert.equal(scene.waves,6);assert.equal(scene.leaves,3);assert.ok(scene.names.every(n=>n!=='none'));
 const props=()=>p.locator('.island-ambient').evaluate(el=>[getComputedStyle(el.querySelector('.fall-stream')).strokeDashoffset,getComputedStyle(el.querySelector('.shore-wave')).transform,...[...el.querySelectorAll('.foliage-sway')].map(x=>getComputedStyle(x).transform)]);
 const a=await props();await p.waitForTimeout(520);const b=await props();assert.notEqual(a[0],b[0]);assert.notEqual(a[1],b[1]);
 await p.waitForTimeout(1800);const d=await props();assert.ok(a.slice(2).some((x,i)=>x!==b[i+2]||x!==d[i+2]));
 await p.locator('#cat-button').click();await p.waitForSelector('[data-portrait-fitted="true"]');await checkArt(p);await stableTabs(p);await shot(p,'wardrobe-scarves');await p.locator('#close-modal').click();
 await p.evaluate(()=>window.__kidsSmoke.forceProgress({purchasedItemIds:['hats-1','scarves-1','shoes-1','backpacks-1','tools-1'],equippedBySlot:{hats:'hats-1',scarves:'scarves-1',shoes:'shoes-1',backpacks:'backpacks-1',tools:'tools-1'}}));
 assert.equal(await p.locator('#island-cat .equipped-item').count(),5);await staticCat(p,'#island-cat .cat-avatar-canvas');
 await p.locator('#cat-button').click();await p.waitForSelector('[data-portrait-fitted="true"]');assert.equal(await p.locator('.cat-preview .equipped-item').count(),5);await stableTabs(p);await staticCat(p,'.cat-preview .cat-avatar-canvas');await p.locator('#close-modal').click();
 assert.equal(await p.evaluate(()=>typeof window.__kidsSmoke.playCatMotion),'undefined');
 for(const button of ['#world-button','#settings-button','[data-stop="1"]']){await p.locator(button).click();await closeCentered(p);await p.locator('#close-modal').click();}
 await c.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const m=await mobile.newPage();watch(m);await m.goto(url,{waitUntil:'networkidle'});await mapCheck(m);await m.locator('#cat-button').click();await m.waitForSelector('[data-portrait-fitted="true"]');await stableTabs(m);await staticCat(m,'.cat-preview .cat-avatar-canvas');await mobile.close();
 const reduced=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const r=await reduced.newPage();watch(r);await r.goto(url,{waitUntil:'networkidle'});assert.equal(await r.locator('.island-ambient').evaluate(el=>getComputedStyle(el).display),'none');await reduced.close();
 const normal=await browser.newContext({viewport:{width:1280,height:800}});
 const n=await normal.newPage();watch(n);await n.goto(url,{waitUntil:'networkidle'});
 let created=0;await n.exposeFunction('motionDetected',()=>created++);
 await n.evaluate(()=>new MutationObserver(()=>{if(document.querySelector('.cat-motion-layer,.motion-active'))window.motionDetected()}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']}));
 await n.waitForTimeout(18000);assert.equal(created,0);await staticCat(n,'#island-cat .cat-avatar-canvas');
 await normal.close();assert.deepEqual(errors,[]);assert.deepEqual(nonGets,[]);pass('all 15 centered items; static dressed cat after former 17s scheduler interval; actual ambient motion; reduced motion; no runtime errors');
}finally{await browser.close();}
