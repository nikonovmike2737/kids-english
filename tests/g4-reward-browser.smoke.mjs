import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const url=process.env.KIDS_TEST_URL||'http://127.0.0.1:8765/';
const engine=process.env.KIDS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const errors=[],nonGets=[];
const pass=s=>console.log('G4 BROWSER PASS ['+engine+']: '+s);
async function shot(p,name){
 if(!url.includes('127.0.0.1'))return;
 mkdirSync('artifacts',{recursive:true});await p.screenshot({path:'artifacts/g4-'+engine+'-'+name+'.png',fullPage:true});
}
async function finish(p){
 await p.locator('[data-stop="1"]').click();
 await p.locator('#start-lesson').click();
 assert.equal(await p.locator('#lesson-hearts').innerText(),'❤️❤️❤️');
 for(const a of [1,1]){
  await p.locator('[data-choice="'+a+'"]').click();await p.locator('#verify').click();await p.locator('#modal-next-action').click();
 }
 for(let i=0;i<3;i++){
  await p.locator('[data-matchword="'+i+'"]').click();await p.locator('[data-matchpic="'+i+'"]').click();
 }
 await p.locator('#verify').click();await p.locator('#modal-next-action').click();
 for(const i of [2,1,0])await p.locator('[data-pick="'+i+'"]').click();
 await p.locator('#verify').click();await p.locator('#modal-next-action').click();
}
async function check(p,kind){
 const panel=p.locator('.modal-panel.reward.lesson-celebration');
 assert.equal(await panel.count(),1);
 assert.equal(await panel.locator('.reward-celebration').count(),1);
 assert.equal(await panel.locator('.reward-avatar').count(),1);
 assert.equal(await panel.locator('.reward-art').count(),0);
 assert.equal(await panel.locator('.lesson-summary, .lesson-summary-list, #lesson-hearts').count(),0);
 assert.doesNotMatch(await panel.innerText(),/Lesson Results|Lives left|Task \d|wrong tries/);
 assert.equal(await panel.getAttribute('aria-labelledby'),'reward-heading');
 assert.equal(await panel.locator('.reward-celebration').getAttribute('data-celebration'),kind);
 assert.match(await panel.locator('h2').innerText(),kind==='key'?/You Got a Key!/:/Great Job!/);
 assert.match(await panel.locator('.celebration-prize').getAttribute('src'),kind==='key'?/g4-golden-key\.svg/:/g4-golden-star\.svg/);
 assert.match(await panel.locator('.key-progress').innerText(),/1 \/ 12 keys/);
 assert.equal(await p.locator('#hud-keys').innerText(),'1/12');
 assert.equal(await p.locator('#hud-coins').innerText(),'0');
 const stored=await p.evaluate(()=>localStorage.getItem('kids-english.progress.v1'));
 assert.deepEqual(JSON.parse(stored).completedLessonIds,['ENG-001']);
 assert.doesNotMatch(stored,/"answers"|"results"|"lives"/);
 const geom=await panel.evaluate(async e=>{
  const measure=x=>{const r=x.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height}};
  const img=[...e.querySelectorAll('img')];
  await Promise.all(img.map(x=>x.decode()));
  return {dialog:measure(e),stage:measure(e.querySelector('.reward-celebration')),cat:measure(e.querySelector('.reward-avatar')),prize:measure(e.querySelector('.celebration-prize')),cta:measure(e.querySelector('#reward-continue')),title:measure(e.querySelector('h2')),close:measure(e.querySelector('#close-modal')),w:innerWidth,h:innerHeight,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,decoded:img.every(x=>x.naturalWidth>0)};
 });
 const inside=(a,b)=>a.l>=b.l-2&&a.r<=b.r+2&&a.t>=b.t-2&&a.b<=b.b+2;
 assert.ok(geom.decoded,'all art decoded');
 assert.ok(inside(geom.cat,geom.stage),'cat clipped: '+JSON.stringify(geom));
 assert.ok(inside(geom.prize,geom.stage),'prize clipped: '+JSON.stringify(geom));
 assert.ok(geom.stage.w>=230&&geom.prize.w>=90,'large celebration art: '+JSON.stringify(geom));
 assert.ok(geom.cta.b<=geom.dialog.b+1&&geom.cta.b<=geom.h+1,'continue not visible: '+JSON.stringify(geom));
 assert.ok(geom.scrollWidth<=geom.clientWidth+2,'horizontal overflow');
 assert.ok(geom.title.r<=geom.close.l+2||geom.title.t>=geom.close.b-2,'heading overlapped by close: '+JSON.stringify(geom));
}
try {
 for(const [w,h] of [[1649,928],[1280,800],[390,844],[844,390]]){
  const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w===390,hasTouch:w===390});
  const p=await context.newPage();
  p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(r.method()!=='GET')nonGets.push(r.method())});
  await p.goto(url,{waitUntil:'networkidle'});
  await finish(p);await check(p,'key');await shot(p,'key-'+w+'x'+h);
  await p.locator('#reward-continue').click();
  assert.equal(await p.locator('.modal-panel.reward').count(),0);
  if(w===1649||w===390){
   await finish(p);await check(p,'replay');await shot(p,'replay-'+w+'x'+h);
   await p.locator('#reward-continue').click();
   await p.reload({waitUntil:'networkidle'});assert.equal(await p.locator('#hud-keys').innerText(),'1/12');
   pass('real repeat completion and reload leave exactly one key at '+w+'x'+h);
  }
  await context.close();pass('unclipped large cat/key art, simplified modal, Continue at '+w+'x'+h);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(nonGets,[]);pass('no non-GET data requests or JS exceptions');
}finally{await browser.close();}
