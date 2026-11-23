import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url=process.env.KIDS_TEST_URL || 'http://127.0.0.1:8765/';
const local=url.includes('127.0.0.1');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const runtimeErrors=[],unsafeRequests=[];
const pass=(message)=>console.log('G2 BROWSER PASS: '+message);
const screenshot=async(page,name)=>{
  if(!local) return;
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/'+name+'.png',fullPage:true});
};
async function inspectImage(locator,expectedWidth=256,expectedHeight=256){
  const result=await locator.evaluate(async img=>{
    await img.decode();
    const canvas=document.createElement('canvas');
    canvas.width=img.naturalWidth;
    canvas.height=img.naturalHeight;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let opaque=0,transparent=0,semi=0;
    for(let y=0;y<canvas.height;y+=8){
      for(let x=0;x<canvas.width;x+=8){
        const alpha=data[(y*canvas.width+x)*4+3];
        if(alpha<=10)transparent++;
        else if(alpha>=245)opaque++;
        else semi++;
      }
    }
    const corners=[[0,0],[canvas.width-1,0],[0,canvas.height-1],[canvas.width-1,canvas.height-1]];
    return {src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight,opaque,transparent,semi,
      transparentCorners:corners.every(([x,y])=>data[(y*canvas.width+x)*4+3]<10)};
  });
  assert.equal(result.width,expectedWidth,result.src);
  assert.equal(result.height,expectedHeight,result.src);
  assert.ok(result.transparentCorners,'opaque/cropped corners '+result.src);
  assert.ok(result.opaque>0 && result.transparent>0,'image must have opaque subject + transparent padding: '+result.src);
  return result;
}
async function assertShopCategory(page,slot){
  await page.locator('[data-category="'+slot+'"]').click();
  assert.equal(await page.locator('.shop-item').count(),3);
  for(let i=0;i<3;i++){
    const loc=page.locator('.shop-item>img').nth(i);
    const info=await inspectImage(loc);
    assert.ok(info.src.endsWith('assets/inventory/'+slot+'/tier-'+(i+1)+'.webp'));
    const badge=page.locator('.shop-item .price').nth(i);
    assert.match(await badge.innerText(),new RegExp(String(i*2+1)));
  }
  assert.equal(await page.locator('.shop-item.locked-tier').count(),2);
}

try {
  const ctx=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await ctx.newPage();
  page.on('pageerror',err=>runtimeErrors.push(String(err)));
  page.on('request',req=>{if(req.method()!=='GET')unsafeRequests.push(req.method()+' '+req.url())});
  const response=await page.goto(url+'?smoke=1',{waitUntil:'networkidle',timeout:60000});
  assert.equal(response.status(),200);
  await inspectImage(page.locator('#island-cat>.cat-base'),1024,936);
  assert.equal(await page.locator('#island-cat>.cat-base').getAttribute('src'),'assets/mascot/cat-dressable.webp');
  assert.equal(await page.locator('#island-outfit .equipped-item').count(),0);
  assert.equal(await page.locator('#island-outfit-behind .equipped-item').count(),0);
  pass('map uses true transparent neutral cat with zero pre-equipped accessories');

  await page.locator('#cat-button').click();
  assert.equal(await page.locator('[data-category]').count(),5);
  assert.equal(await page.locator('[data-shop-view]').count(),0);
  await inspectImage(page.locator('.cat-preview .cat-base'),1024,936);
  for(const slot of ['hats','scarves','shoes','backpacks','tools']){
    await assertShopCategory(page,slot);
    await screenshot(page,'g2-3d-catalog-'+slot+'-1280');
  }
  pass('all 15 original 3D items decode and retain alpha, each 5x3 catalogue row shows 1/3/5 Coins');

  await page.locator('#close-modal').click();
  // This synthetic 8-coin fixture is confined to this disposable browser context.
  // Actual learner progress and server state are never touched.
  await page.evaluate(()=>window.__kidsSmoke.forceProgress({
    openedChestIds:['chest-a','chest-b','chest-c','grand-chest'],coinBalance:8
  }));
  await page.locator('#cat-button').click();
  for(const slot of ['hats','scarves','shoes','backpacks','tools']){
    await page.locator('[data-category="'+slot+'"]').click();
    assert.equal(await page.locator('#item-action').innerText(),'Buy');
    await page.locator('#item-action').click();
    assert.equal(await page.locator('#item-action').innerText(),'Wear');
    await page.locator('#item-action').click();
    assert.match(await page.locator('#item-action').innerText(),/Wearing/);
  }
  assert.equal(await page.locator('.cat-preview .outfit-behind .equipped-item').count(),1);
  assert.equal(await page.locator('.cat-preview .outfit-overlays .equipped-item').count(),4);
  for(const loc of await page.locator('.cat-preview .equipped-item').all()) await inspectImage(loc);
  const stack=await page.locator('.cat-figure').evaluate(el=>({
    behind:getComputedStyle(el.querySelector('.outfit-behind')).zIndex,
    cat:getComputedStyle(el.querySelector('.cat-base')).zIndex,
    front:getComputedStyle(el.querySelector('.outfit-overlays')).zIndex
  }));
  assert.deepEqual(stack,{behind:'1',cat:'2',front:'3'});
  const geometry=await page.locator('.cat-preview .cat-avatar-canvas').evaluate(el=>{
    const root=el.getBoundingClientRect();
    const measure=slot=>{
      const item=el.querySelector('.equipped-item[data-slot="'+slot+'"]');
      const r=item.getBoundingClientRect();
      return {x:(r.left-root.left)/root.width,y:(r.top-root.top)/root.height,
        width:r.width/root.width,height:r.height/root.height};
    };
    return {ratio:root.width/root.height,
      hat:measure('hat'),scarf:measure('neck'),shoes:measure('shoes'),
      backpack:measure('back'),tool:measure('tool')};
  });
  assert.ok(Math.abs(geometry.ratio-(1024/936))<.02,'avatar must match actual kitten aspect ratio: '+JSON.stringify(geometry));
  assert.ok(geometry.hat.y<0 && geometry.hat.y>-.16,'hat should sit on top of head, not float in upper panel');
  assert.ok(geometry.scarf.y>.39 && geometry.scarf.y<.50,'scarf should sit below kitten face');
  assert.ok(geometry.shoes.y>.60 && geometry.shoes.y<.73,'shoes should sit at kitten paws');
  assert.ok(geometry.backpack.x<.05,'backpack should appear behind the torso to its left');
  await screenshot(page,'g2-dressable-cat-all-five-1280');
  assert.equal(await page.locator('.shop-wallet .stat-item').last().innerText(),'3');
  pass('five 3D wearables align on kitten with backpack strictly behind, no extra coin charges');

  await page.locator('#close-modal').click();
  assert.equal(await page.locator('#island-outfit-behind .equipped-item').count(),1);
  assert.equal(await page.locator('#island-outfit .equipped-item').count(),4);
  for(const loc of await page.locator('#island-cat .equipped-item').all()) await inspectImage(loc);
  await screenshot(page,'g2-map-cat-all-five-1280');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#hud-coins').innerText(),'3');
  assert.equal(await page.locator('#island-outfit-behind .equipped-item').count(),1);
  assert.equal(await page.locator('#island-outfit .equipped-item').count(),4);
  await page.locator('#cat-button').click();
  await page.locator('[data-category="hats"]').click();
  assert.match(await page.locator('#item-action').innerText(),/Wearing/);
  await page.locator('#close-modal').click();
  pass('reloaded local progress retains all five purchases and worn items, map displays all sprites');

  await page.locator('[data-stop="1"]').click();
  await page.locator('#start-lesson').click();
  for(const ans of [1,1]){
    await page.locator('[data-choice="'+ans+'"]').click();
    await page.locator('#verify').click();
    await page.locator('#modal-next-action').click();
  }
  for(let i=0;i<3;i++){
    await page.locator('[data-matchword="'+i+'"]').click();
    await page.locator('[data-matchpic="'+i+'"]').click();
  }
  await page.locator('#verify').click();
  await page.locator('#modal-next-action').click();
  for(const i of [2,1,0])await page.locator('[data-pick="'+i+'"]').click();
  await page.locator('#verify').click();
  await page.locator('#modal-next-action').click();
  assert.match(await page.locator('.modal-panel.reward h2').innerText(),/You Got a Key!/);
  await inspectImage(page.locator('.reward-avatar>.cat-base'),1024,936);
  assert.equal(await page.locator('.reward-avatar .outfit-behind .equipped-item').count(),1);
  assert.equal(await page.locator('.reward-avatar .outfit-overlays .equipped-item').count(),4);
  for(const loc of await page.locator('.reward-avatar .equipped-item').all()) await inspectImage(loc);
  assert.equal(await page.locator('.lesson-summary-list li').count(),4);
  assert.equal(await page.locator('#hud-keys').innerText(),'1/12');
  await screenshot(page,'g2-fully-dressed-lesson-reward-1280');
  pass('reward shows all 5 original accessory sprites on neutral cat while lesson/key invariants hold');

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const m=await mobile.newPage();
  m.on('pageerror',e=>runtimeErrors.push(String(e)));
  await m.goto(url,{waitUntil:'networkidle',timeout:60000});
  await m.locator('#cat-button').click();
  assert.equal(await m.locator('.shop-item').count(),3);
  await inspectImage(m.locator('.cat-preview .cat-base'),1024,936);
  for(const slot of ['hats','scarves','shoes','backpacks','tools']){
    await assertShopCategory(m,slot);
  }
  const overflow=await m.locator('.modal-panel.wardrobe').evaluate(el=>el.scrollWidth-el.clientWidth);
  assert.ok(overflow<=3,'mobile horizontal overflow '+overflow);
  await screenshot(m,'g2-3d-catalog-mobile-390');
  pass('mobile 390px: 15 transparent 3D images and kitten decode; no horizontal overflow');

  assert.deepEqual(runtimeErrors,[]);
  assert.deepEqual(unsafeRequests,[]);
  pass('no runtime exceptions or outgoing non-GET data requests');
} finally {
  await browser.close();
}
