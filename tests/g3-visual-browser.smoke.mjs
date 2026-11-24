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
  const disks=await page.locator('.node').evaluateAll(async els=>Promise.all(els.map(async el=>{
    const icon=el.querySelector('.lesson-lock');
    if(icon)await icon.decode();
    const b=el.getBoundingClientRect(),i=icon?.getBoundingClientRect(),style=getComputedStyle(el);
    return {state:el.dataset.state,disabled:el.disabled,w:b.width,h:b.height,face:style.backgroundImage,shadow:style.boxShadow,filter:style.filter,
      icon:icon?{loaded:icon.naturalWidth>0,src:icon.getAttribute('src'),dx:Math.abs(i.x+i.width/2-b.x-b.width/2),dy:Math.abs(i.y+i.height/2-b.y-b.height/2),ratio:i.width/b.width}:null,text:el.textContent};
  })));
  assert.ok(disks.every(d=>Math.abs(d.w-d.h)<.5&&d.shadow.split(/,(?![^()]*\))/).length===6&&d.filter==='none'),'layered round disks '+JSON.stringify(disks));
  assert.ok(disks.filter(d=>d.state==='locked').every(d=>d.disabled&&d.icon?.loaded&&d.icon.src.endsWith('g9-lesson-lock.svg')&&d.icon.dx<.7&&d.icon.dy<.7&&d.icon.ratio>.37&&d.icon.ratio<.50&&!d.text.includes('🔒')),'centered reference lock art');
  assert.ok(disks.filter(d=>d.state==='available').every(d=>!d.disabled&&!d.icon),'available lessons remain actionable');
  await page.locator('[data-stop="4"]').evaluate(el=>el.click());
  assert.equal(await page.locator('.modal-panel').count(),0,'locked lesson cannot open');

  const nodes=await page.locator('.node').evaluateAll(els=>els.map(x=>({n:Number(x.dataset.stop),x:Number.parseFloat(x.style.getPropertyValue('--x')),y:Number.parseFloat(x.style.getPropertyValue('--y'))})));
  assert.deepEqual(nodes.map(n=>n.n),Array.from({length:12},(_,i)=>i+1));
  assert.deepEqual(nodes.map(n=>[n.x,n.y]),[[25.5,27.1],[32.5,27.1],[39.5,27.1],[46.5,27.1],[55.4,50.2],[47.9,50.2],[40.4,50.2],[32.9,50.2],[28.5,75.4],[36,75.4],[43.5,75.4],[51,75.4]]);
  assert.match(await page.locator('.map-art').evaluate(el=>getComputedStyle(el).backgroundImage),/g5-adventure-island\.webp/);
  const names=['.label-top','.label-mid','.label-low'];
  for(let row=0;row<3;row++){
    const label=await page.locator(names[row]).boundingBox();
    const node=await page.locator('[data-stop="'+(row*4+1)+'"]').boundingBox();
    assert.ok(label.y+label.height < node.y-5,'row title must stay clear of lesson buttons: '+row+' '+JSON.stringify({label,node}));
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
    if(id==='grand-chest')assert.ok(Math.abs(footprint.y-footprint.relativeBottom)<2,'grand chest footing: '+id+' '+JSON.stringify(footprint));
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
  assert.ok(Math.abs(first.x-1672*.255)<7 && Math.abs(first.y-941*.271)<7,'route starts AT first lesson, no incoming segment');
  const cat=await page.locator('#island-cat').boundingBox();
  const bridge=await page.locator('#route-bridge-b').boundingBox();
  assert.ok(cat&&bridge);
  // Use the route's entire second bridge corridor as exclusion zone for the clickable kitten.
  const opaque=await page.locator('#island-cat .cat-base').evaluate(async img=>{await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const a=g.getImageData(0,0,c.width,c.height).data;let l=c.width,r=0,t=c.height,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(a[(y*c.width+x)*4+3]>32){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}const box=img.getBoundingClientRect();return {x:box.x+l*box.width/c.width,y:box.y+t*box.height/c.height,right:box.x+r*box.width/c.width,bottom:box.y+b*box.height/c.height};});
  assert.ok(opaque.right<=bridge.x+4,'visible cat hides bridge B: '+JSON.stringify({opaque,bridge}));
  assert.ok(opaque.x>=map.x-2,'visible cat clipped at left');
  assert.ok(Math.abs((opaque.bottom-map.y)/map.height-.90)<.055,'kitten feet stay on lower-left rock: '+JSON.stringify({opaque,map}));
  assert.ok(cat.x>=map.x-2,'cat clipped left');
  assert.ok(cat.x+cat.width<=map.x+map.width+2,'cat clipped right');
  const src=await page.locator('#island-cat .cat-base').getAttribute('src');
  assert.ok(src.endsWith('cat-dressable.webp'));
  await shot(page,'map-'+width+'x'+height);
  pass('G9 reference discs, centered SVG locks, 12 nodes/4 alpha chests/3 terrain titles/3 curved bridge corridors and separate kitten at '+width+'x'+height);
}
async function checkWardrobe(page,width,height){
  await page.locator('#cat-button').click();
  await page.waitForSelector('.cat-avatar-canvas[data-portrait-fitted="true"]');
  const result=await page.locator('.cat-preview').evaluate(async el=>{
    const p=el.getBoundingClientRect(),img=el.querySelector('.cat-base');
    await img.decode();
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,c.width,c.height).data;
    let l=c.width,r=0,t=c.height,b=0;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>36){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
    const a=img.getBoundingClientRect(),s=Math.min(a.width/c.width,a.height/c.height),ox=a.x+(a.width-c.width*s)/2,oy=a.y+(a.height-c.height*s)/2;
    return {p:p.toJSON(),visible:{left:ox+l*s,right:ox+(r+1)*s,top:oy+t*s,bottom:oy+(b+1)*s,width:(r-l+1)*s,height:(b-t+1)*s},background:getComputedStyle(el).backgroundImage,image:{width:c.width,height:c.height}};
  });
  assert.ok(!/url\s*\(/i.test(result.background),'neutral backdrop');
  assert.equal(result.image.width,1024);assert.equal(result.image.height,936);
  const {p,visible:v}=result;
  assert.ok(v.left>=p.left+3&&v.right<=p.right-3&&v.top>=p.top+3&&v.bottom<=p.bottom-3,'actual kitten must fit, not the transparent canvas: '+JSON.stringify(result));
  assert.ok(Math.abs((v.left+v.right)/2-(p.left+p.right)/2)<p.width*.035,'visible silhouette centered: '+JSON.stringify(result));
  assert.ok(Math.abs((v.top+v.bottom)/2-(p.top+p.bottom)/2)<p.height*.04,'visible silhouette centered vertically');
  assert.ok(v.width/p.width>=(width>500?.70:.40)||v.height/p.height>=.62,'portrait visibly enlarged: '+JSON.stringify(result));
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
