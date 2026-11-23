import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium, webkit } from 'playwright';

const base=process.env.KIDS_TEST_URL||'http://127.0.0.1:8765/';
const local=base.includes('127.0.0.1');
const engine=process.env.KIDS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const errors=[],unwanted=[];
const pass=x=>console.log('G3 BROWSER PASS ['+engine+']: '+x);
const shot=async(page,name)=>{
  if(!local)return;
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/g3-'+engine+'-'+name+'.png',fullPage:true});
};
async function chestAlpha(locator){
  return locator.evaluate(async img=>{
    await img.decode();
    const c=document.createElement('canvas'),w=img.naturalWidth,h=img.naturalHeight;
    c.width=w;c.height=h;
    const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
    const d=g.getImageData(0,0,w,h).data;
    const a=(x,y)=>d[(y*w+x)*4+3];
    return {w,h,corners:[a(0,0),a(w-1,0),a(0,h-1),a(w-1,h-1)],src:img.getAttribute('src')};
  });
}
function intersects(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
async function checkMap(page,width,height){
  const map=await page.locator('#stage').boundingBox();
  assert.ok(map&&map.width>0&&map.height>0);
  assert.equal(await page.locator('[data-stop]').count(),12);
  assert.equal(await page.locator('[data-chest]').count(),4);
  assert.equal(await page.locator('.node[data-state="available"]').count(),3);
  assert.equal(await page.locator('.node[data-state="locked"]').count(),9);
  const nodes=await page.locator('.node').evaluateAll(els=>els.map(x=>({n:Number(x.dataset.stop),x:Number.parseFloat(x.style.getPropertyValue('--x')),y:Number.parseFloat(x.style.getPropertyValue('--y'))})));
  assert.deepEqual(nodes.map(n=>n.n),Array.from({length:12},(_,i)=>i+1));
  assert.ok(nodes.slice(0,4).every(n=>n.y===29.8));
  assert.ok(nodes.slice(4,8).every(n=>n.y===53.2));
  assert.ok(nodes.slice(8).every(n=>n.y===76.3));
  const names=['.label-top','.label-mid','.label-low'];
  for(let row=0;row<3;row++){
    const label=await page.locator(names[row]).boundingBox();
    const node=await page.locator('[data-stop="'+(row*4+1)+'"]').boundingBox();
    assert.ok(label.bottom < node.top - 5,'row title must stay clear of lesson buttons: '+row+' '+JSON.stringify({label,node}));
  }
  const chests=await page.locator('.chest-node').all();
  const ids=[];
  for(const chest of chests){
    const id=await chest.getAttribute('data-chest');ids.push(id);
    const info=await chestAlpha(chest.locator('img'));
    assert.ok(info.w>=64&&info.h>=64,'decoded chest sprite '+id+': '+JSON.stringify(info));
    assert.ok(info.corners.every(a=>a<=24),'independent transparent chest has rectangular opaque matte: '+id+' '+JSON.stringify(info));
    const footprint=await chest.evaluate(el=>{
      const st=document.getElementById('stage').getBoundingClientRect(), r=el.getBoundingClientRect();
      return {y:Number.parseFloat(el.style.getPropertyValue('--y')),relativeBottom:100*(r.bottom-st.top)/st.height};
    });
    assert.ok(Math.abs(footprint.y-footprint.relativeBottom)<2,'chest bottom must touch its terrain anchor: '+id+' '+JSON.stringify(footprint));
  }
  assert.deepEqual(ids,['chest-a','chest-b','chest-c','grand-chest']);
  const route=page.locator('svg.route-lines path');
  assert.equal(await route.count(),8);
  assert.equal(await page.locator('svg.route-lines path.bridge-route').count(),3);
  const pathGeometry=await route.evaluateAll(els=>{
    const stage=document.getElementById('stage').getBoundingClientRect();
    return els.map(el=>{
      const len=el.getTotalLength();
      const points=Array.from({length:17},(_,i)=>{
        const p=el.getPointAtLength(len*i/16);
        return {x:p.x,y:p.y};
      });
      return {id:el.id,len,points};
    });
  });
  for(const x of pathGeometry){
    assert.ok(x.len>35,'nonzero route '+x.id);
    assert.ok(x.points.every(pt=>pt.x>=0&&pt.x<=1672&&pt.y>=0&&pt.y<=941),'route stays in stage '+x.id);
  }
  const first=pathGeometry[0].points[0];
  assert.ok(Math.abs(first.x-1672*.30)<7 && Math.abs(first.y-941*.298)<7,'route starts AT first lesson, no incoming segment');
  const cat=await page.locator('#island-cat').boundingBox();
  const bridge=await page.locator('#route-bridge-b').boundingBox();
  assert.ok(cat&&bridge);
  // Use the route's entire second bridge corridor as exclusion zone for the clickable kitten.
  assert.ok(cat.right<=bridge.left+4,'cat hides bridge B: '+JSON.stringify({cat,bridge}));
  assert.ok(cat.left>=map.left-2,'cat clipped left');
  assert.ok(cat.right<=map.right+2,'cat clipped right');
  const src=await page.locator('#island-cat .cat-base').getAttribute('src');
  assert.ok(src.endsWith('cat-dressable.webp'));
  await shot(page,'map-'+width+'x'+height);
  pass('12 nodes/4 alpha chests/3 terrain titles/3 curved bridge corridors and separate kitten at '+width+'x'+height);
}
async function checkWardrobe(page,width,height){
  await page.locator('#cat-button').click();
  const result=await page.locator('.cat-preview').evaluate(async el=>{
    const p=el.getBoundingClientRect();
    const avatar=el.querySelector('.cat-avatar-canvas').getBoundingClientRect();
    const fig=el.querySelector('.cat-figure').getBoundingClientRect();
    const img=el.querySelector('.cat-base');
    await img.decode();
    const background=getComputedStyle(el).backgroundImage;
    return {p:{left:p.left,right:p.right,top:p.top,bottom:p.bottom,width:p.width},
      avatar:{left:avatar.left,right:avatar.right,top:avatar.top,bottom:avatar.bottom,width:avatar.width},
      figure:{left:fig.left,right:fig.right,top:fig.top,bottom:fig.bottom},
      background,image:{width:img.naturalWidth,height:img.naturalHeight}};
  });
  assert.ok(!/url\s*\(/i.test(result.background),'island photo still in My Cat backdrop: '+result.background);
  assert.ok(result.background.includes('gradient'),'expected neutral gradient');
  assert.equal(result.image.width,1024);assert.equal(result.image.height,936);
  assert.ok(result.avatar.left>=result.p.left+5,'cat avatar spills outside panel left '+JSON.stringify(result));
  assert.ok(result.avatar.right<=result.p.right-5,'cat avatar spills outside panel right '+JSON.stringify(result));
  assert.ok(result.avatar.top>=result.p.top+3,'cat avatar spills above panel '+JSON.stringify(result));
  assert.ok(result.avatar.bottom<=result.p.bottom-3,'cat avatar spills below panel '+JSON.stringify(result));
  const centerDelta=Math.abs((result.avatar.left+result.avatar.right)/2-(result.p.left+result.p.right)/2)/result.p.width;
  assert.ok(centerDelta<.1,'cat must be visually centered: '+JSON.stringify(result));
  assert.equal(await page.locator('.shop-item').count(),3);
  assert.equal(await page.locator('[data-category]').count(),5);
  await shot(page,'wardrobe-'+width+'x'+height);
  pass('My Cat kitten fully contained and centered on neutral backdrop at '+width+'x'+height);
  await page.locator('#close-modal').click();
}
try {
  for(const [width,height] of [[2048,1152],[1649,928],[1280,800],[1024,768],[390,844]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390});
    const page=await context.newPage();
    page.on('pageerror',err=>errors.push(String(err)));
    page.on('request',req=>{if(req.method()!=='GET')unwanted.push(req.method()+' '+req.url())});
    const response=await page.goto(base,{waitUntil:'networkidle',timeout:60000});
    assert.equal(response.status(),200);
    await checkMap(page,width,height);
    await checkWardrobe(page,width,height);
    await context.close();
  }
  const c=await browser.newContext({viewport:{width:1280,height:800}});
  const p=await c.newPage();
  await p.goto(base,{waitUntil:'networkidle'});
  await p.locator('#world-button').click();
  assert.equal(await p.locator('[data-world]').count(),3);
  await p.locator('#close-modal').click();
  await p.locator('[data-stop="1"]').click();
  assert.equal(await p.locator('#start-lesson').count(),1);
  pass('G3 does not break World Map or authored lesson entry');
  await c.close();
  assert.deepEqual(unwanted,[],'no personal/non-GET data');
  assert.deepEqual(errors,[],'no runtime errors');
  pass('no JS errors, no outgoing non-GET requests');
} finally {await browser.close();}
