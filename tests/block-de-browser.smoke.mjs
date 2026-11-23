import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url=process.env.KIDS_TEST_URL || 'http://127.0.0.1:8765/';
const isLocal=url.includes('127.0.0.1');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[],nonGets=[];
const pass=(s)=>console.log('DE BROWSER PASS: '+s);
const clickAction=(page,expected)=>page.locator('#item-action').getByText(expected).click();
const verifyArt=async(page,selector)=>{
  const list=await page.locator(selector).evaluateAll(async els=>Promise.all(els.map(async img=>{
    try { await img.decode(); } catch { /* report missing/corrupt art below */ }
    return {src:img.getAttribute('src'),ready:img.complete&&img.naturalWidth>0};
  })));
  assert.ok(list.length>0, 'no art: '+selector);
  assert.ok(list.every(v=>v.ready),'undecoded art: '+JSON.stringify(list));
  return list;
};
const screenshot=async(page,name)=>{
  if(!isLocal)return;
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/'+name+'.png',fullPage:true});
};
try {
  const ctx=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('request',r=>{if(r.method()!=='GET')nonGets.push(r.method()+' '+r.url());});
  const resp=await page.goto(url+'?smoke=1',{waitUntil:'networkidle',timeout:60000});
  assert.equal(resp.status(),200);
  assert.equal(await page.locator('[data-stop]').count(),12);
  assert.equal(await page.locator('[data-chest]').count(),4);
  await page.locator('#world-button').click();
  assert.equal(await page.locator('.modal-panel.worldmap').count(),1);
  assert.equal(await page.locator('[data-world]').count(),3);
  assert.equal(await page.locator('[data-world="mystical-desert"]').isDisabled(),true);
  assert.equal(await page.locator('[data-world="rainy-forest"]').isDisabled(),true);
  const worlds=await verifyArt(page,'.world-picture img');
  assert.equal(new Set(worlds.map(w=>w.src)).size,3);
  assert.match(await page.locator('[data-world="adventure-island"]').innerText(),/Current World/);
  await screenshot(page,'de-world-map-1280');
  await page.locator('[data-world="adventure-island"]').click();
  assert.equal(await page.locator('.modal-panel.worldmap').count(),0);
  pass('D: three illustrated distinct worlds, future lock, active navigates to island');

  await page.locator('#cat-button').click();
  assert.equal(await page.locator('.modal-panel.wardrobe').count(),1);
  assert.equal(await page.locator('[data-category]').count(),5);
  assert.equal(await page.locator('[data-shop-view]').count(),0);
  assert.equal(await page.locator('.shop-selected').count(),0);
  assert.equal(await page.locator('.shop-item').count(),3);
  await verifyArt(page,'.shop-item>img');
  assert.equal(await page.locator('#item-action').count(),1);
  assert.equal(await page.locator('#item-action').isDisabled(),true);
  assert.match(await page.locator('#item-action').innerText(),/Need 1 Coin/);
  assert.doesNotMatch(await page.locator('.wardrobe-header').innerText(),/❤️|🤍/);
  await screenshot(page,'de-my-cat-shop-1280');
  assert.equal(await page.locator('.shop-item.locked-tier').count(),2);
  assert.equal(await page.locator('.item-lock-mark').count(),2);
  assert.equal(await page.locator('.shop-item .price img').count(),3);
  assert.equal(await page.locator('#item-action').count(),1);
  const visual = await page.locator('.cat-preview').evaluate(el=>{
    const panel=el.getBoundingClientRect(),cat=el.querySelector('.cat-figure').getBoundingClientRect();
    return {centerDelta:Math.abs((cat.x+cat.width/2)-(panel.x+panel.width/2))/panel.width};
  });
  assert.ok(visual.centerDelta<.16,'cat preview must be centered: '+JSON.stringify(visual));
  const price = await page.locator('.shop-item .price img').first().evaluate(el=>el.getBoundingClientRect().width);
  assert.ok(price>=24,'readable coin symbol: '+price);
  const layout = await page.locator('.shop-item').first().evaluate(el=>{
    const card=el.getBoundingClientRect(), art=el.querySelector(':scope > img').getBoundingClientRect();
    return {ratio:art.height/card.height,width:art.width/card.width};
  });
  assert.ok(layout.ratio>=.26 && layout.width>=.7,'item artwork must be prominent: '+JSON.stringify(layout));
  const vertical = await page.locator('.shop-item').first().evaluate(el=>{
    const rect=el.getBoundingClientRect(),art=el.querySelector(':scope > img').getBoundingClientRect();
    const end=el.querySelector('.owned-indicator').getBoundingClientRect();
    return Math.abs((art.top+end.bottom)/2-(rect.top+rect.height/2))/rect.height;
  });
  assert.ok(vertical<.14,'product image/name/price group must be vertically balanced, not parked at the top: '+vertical);
  pass('G1: direct categories, no segmented tabs/detail, large centered cat/art, prices and full-card locks');

  // Smoke fixture is confined to this disposable browser context: three credited
  // chest IDs produce an internally consistent 3-coin wallet after reload.
  await page.locator('#close-modal').click();
  await page.evaluate(()=>window.__kidsSmoke.forceProgress({openedChestIds:['chest-a','chest-b','chest-c'],coinBalance:3}));
  await page.locator('#cat-button').click();
  assert.equal(await page.locator('#item-action').innerText(),'Buy');
  await page.locator('#item-action').click();
  assert.equal(await page.locator('#item-action').innerText(),'Wear');
  assert.equal(await page.locator('.shop-wallet .stat-item').last().innerText(),'2');
  assert.equal(await page.locator('.cat-preview .equipped-item').count(),0,'Buy must not auto-wear');
  await page.locator('#item-action').click();
  assert.match(await page.locator('#item-action').innerText(),/Wearing/);
  assert.equal(await page.locator('.cat-preview .equipped-item[data-item-id="hats-1"]').count(),1);
  await verifyArt(page,'.cat-preview .equipped-item');
  assert.equal(await page.locator('#item-action').count(),1);
  await page.locator('#item-action').click();
  assert.equal(await page.locator('#item-action').innerText(),'Wear');
  assert.equal(await page.locator('.shop-wallet .stat-item').last().innerText(),'2','Unwear must not cost coins');
  await page.locator('#item-action').click();
  assert.match(await page.locator('#item-action').innerText(),/Wearing/);

  await page.locator('[data-category="scarves"]').click();
  assert.equal(await page.locator('#item-action').innerText(),'Buy');
  await page.locator('#item-action').click();
  assert.equal(await page.locator('#item-action').innerText(),'Wear');
  await page.locator('#item-action').click();
  assert.equal(await page.locator('.cat-preview .equipped-item').count(),2);
  assert.equal(await page.locator('.shop-wallet .stat-item').last().innerText(),'1');
  assert.equal(await page.locator('#item-action').count(),1);
  await screenshot(page,'de-my-cat-equipped-1280');
  await page.locator('#close-modal').click();
  assert.equal(await page.locator('#island-outfit .equipped-item').count(),2);
  await verifyArt(page,'#island-outfit .equipped-item');
  pass('E: Buy->Wear->Wearing, unwear, two illustrated worn layers on map, debit once');

  await page.locator('#cat-button').click();
  assert.equal(await page.locator('.shop-item').count(),3);
  assert.match(await page.locator('.shop-item').first().innerText(),/Cozy Scarf/);
  assert.match(await page.locator('.shop-item').first().innerText(),/Wearing/);
  await page.locator('[data-category="hats"]').click();
  assert.equal(await page.locator('.shop-item').count(),3);
  assert.match(await page.locator('.shop-item').first().innerText(),/Wearing/);
  await page.locator('[data-category="shoes"]').click();
  assert.equal(await page.locator('.shop-item').count(),3);
  assert.equal(await page.locator('.shop-item.locked-tier').count(),2);
  assert.equal(await page.locator('#item-action').count(),1);
  await page.locator('#close-modal').click();
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#hud-coins').innerText(),'1');
  assert.equal(await page.locator('#island-outfit .equipped-item').count(),2);
  await page.locator('#cat-button').click();
  await page.locator('[data-category="hats"]').click();
  assert.equal(await page.locator('.shop-item').count(),3);
  assert.match(await page.locator('.shop-item').first().innerText(),/Wearing/);
  assert.match(await page.locator('#item-action').innerText(),/Wearing/);
  await page.locator('#close-modal').click();
  pass('G1/E: purchases and equipment visible in direct categories and survive reload');

  // Full existing lesson reward must reflect the same outfit without modifying
  // question answers, number of hearts or completion/coin logic.
  await page.locator('[data-stop="1"]').click();
  await page.locator('#start-lesson').click();
  for(const answer of [1,1]){
    await page.locator('[data-choice="'+answer+'"]').click();
    await page.locator('#verify').click();
    await page.locator('#modal-next-action').click();
  }
  for(let i=0;i<3;i++){
    await page.locator('[data-matchword="'+i+'"]').click();
    await page.locator('[data-matchpic="'+i+'"]').click();
  }
  await page.locator('#verify').click();await page.locator('#modal-next-action').click();
  for(const i of [2,1,0]) await page.locator('[data-pick="'+i+'"]').click();
  await page.locator('#verify').click();await page.locator('#modal-next-action').click();
  assert.match(await page.locator('.modal-panel.reward h2').innerText(),/You Got a Key!/);
  assert.equal(await page.locator('.reward-avatar .equipped-item').count(),2);
  await verifyArt(page,'.reward-avatar .equipped-item');
  assert.equal(await page.locator('.lesson-summary, .lesson-summary-list').count(),0);
  assert.equal(await page.locator('[data-celebration="key"]').count(),1);
  assert.equal(await page.locator('#hud-keys').innerText(),'1/12');
  await page.locator('#reward-continue').click();
  assert.equal(await page.locator('#hud-coins').innerText(),'1');
  pass('A-C regression: four-task reward uses dressed cat and grants one key without spending coins');

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const m=await mobile.newPage();
  m.on('pageerror',e=>errors.push(String(e)));
  await m.goto(url,{waitUntil:'networkidle',timeout:60000});
  await m.locator('#world-button').click();
  assert.equal(await m.locator('[data-world]').count(),3);
  await verifyArt(m,'.world-picture img');
  const noWorldOverflow=await m.locator('.modal-panel.worldmap').evaluate(el=>el.scrollWidth<=el.clientWidth+3);
  assert.equal(noWorldOverflow,true);
  await screenshot(m,'de-world-map-mobile');
  await m.locator('#close-modal').click();
  await m.locator('#cat-button').click();
  assert.equal(await m.locator('[data-category]').count(),5);
  assert.equal(await m.locator('#item-action').count(),1);
  await verifyArt(m,'.shop-item>img');
  assert.equal(await m.locator('[data-shop-view]').count(),0);
  assert.equal(await m.locator('.shop-item').count(),3);
  assert.equal(await m.locator('.shop-item.locked-tier').count(),2);
  assert.equal(await m.locator('.shop-selected').count(),0);
  const noShopOverflow=await m.locator('.modal-panel.wardrobe').evaluate(el=>el.scrollWidth<=el.clientWidth+3);
  assert.equal(noShopOverflow,true);
  const mobileFooterGap=await m.locator('.modal-panel.wardrobe').evaluate(el=>{
    const r=el.getBoundingClientRect(),cta=el.querySelector('#item-action').getBoundingClientRect();
    return r.bottom-cta.bottom;
  });
  assert.ok(mobileFooterGap<64,'no empty mobile panel below wardrobe CTA: '+mobileFooterGap);
  await screenshot(m,'de-my-cat-mobile');
  pass('D/E: mobile 390px opens both modals with decoded art and no horizontal overflow');

  assert.deepEqual(nonGets,[]);
  assert.deepEqual(errors,[]);
  pass('privacy and runtime: no non-GET requests or uncaught errors');
} finally { await browser.close(); }
