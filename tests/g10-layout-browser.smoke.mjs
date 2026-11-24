import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {lessons} from '../assets/js/data.js';
import {orderPositionSolution} from '../assets/js/answer-layout.js';
const url=process.env.KIDS_TEST_URL||'http://127.0.0.1:8765/';
const engine=process.env.KIDS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const errors=[],writes=[];
const watch=p=>{p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(r.method()!=='GET')writes.push(r.method())});};
const pattern=l=>l.left.map(i=>l.right.indexOf(i));
const attrs=(p,a)=>p.locator('['+a+']').evaluateAll((els,attr)=>els.map(e=>Number(e.getAttribute(attr))),a);
const selector=(a,i)=>'['+a+'="'+i+'"]';
const click=(p,a,i)=>p.locator(selector(a,i)).click();
async function snap(p,t,classic=false){
 const a=classic?['data-ix','data-word','data-picture','data-token']:['data-choice','data-matchword','data-matchpic','data-pick'];
 if(t.type==='choice')return {choice:await attrs(p,a[0])};
 if(t.type==='match')return {left:await attrs(p,a[1]),right:await attrs(p,a[2])};
 return {order:await attrs(p,a[3])};
}
function differs(t,old,l){
 if(t.type==='choice')assert.notEqual(l.choice.indexOf(t.correct),old.choice.indexOf(t.correct));
 else if(t.type==='match'){assert.notDeepEqual(l.left,old.left);assert.notDeepEqual(l.right,old.right);assert.notDeepEqual(pattern(l),pattern(old));}
 else assert.notDeepEqual(orderPositionSolution(t,l.order),orderPositionSolution(t,old.order));
}
async function fill(p,t,l,mode='right',old=null,classic=false){
 const a=classic?['data-ix','data-word','data-picture','data-token']:['data-choice','data-matchword','data-matchpic','data-pick'];
 if(t.type==='choice'){
  const i=mode==='old'?l.choice[old.choice.indexOf(t.correct)]:mode==='wrong'?l.choice.find(i=>i!==t.correct):t.correct;
  await click(p,a[0],i);
 }else if(t.type==='match'){
  const r=mode==='old'?pattern(old):mode==='wrong'?l.left.map((id,i)=>l.right.indexOf(l.left[(i+1)%l.left.length])):pattern(l);
  for(let i=0;i<l.left.length;i++){await click(p,a[1],l.left[i]);await click(p,a[2],l.right[r[i]]);}
 }else{
  let pos=orderPositionSolution(t,l.order);
  if(mode==='old')pos=orderPositionSolution(t,old.order);
  if(mode==='wrong')pos=[...pos].reverse();
  for(const n of pos)await click(p,a[3],l.order[n]);
 }
 const check=classic?(t.type==='choice'?'#check':t.type==='match'?'#check-match':'#check-order'):'#verify';
 assert.equal(await p.locator(check).isDisabled(),false);
 await p.locator(check).click();
}
async function next(p){await p.locator('#modal-next-action').click();}
async function lose(p,t,l,mode,old){
 await fill(p,t,l,mode,old);
 if(await p.locator('#gameover-layer').count())return false;
 assert.match(await p.locator('.modal-backdrop.nested').innerText(),/Wrong!/);
 await p.locator('#modal-retry').click();assert.deepEqual(await snap(p,t),l,'same-question wrong answer cannot reshuffle');
 return true;
}
async function start(p,stop){await click(p,'data-stop',stop);await p.locator('#start-lesson').click();}
async function island(p,lesson,stop){
 const tasks=lesson.tasks;let first=[],second=[],third=[];
 await start(p,stop);
 // First attempt reaches every task, then fails at the last task.
 for(let i=0;i<tasks.length;i++){
  const t=tasks[i],l=await snap(p,t);first.push(l);
  if(i<tasks.length-1){await fill(p,t,l);await next(p);}
  else for(let n=0;n<3;n++)assert.equal(await lose(p,t,l,'wrong'),n<2);
 }
 await p.locator('#retry').click();assert.equal(await p.locator('#lesson-hearts').innerText(),'❤️❤️❤️');
 // Actually reuse the OLD POSITIONAL solution, not old semantic IDs.
 // Choice, match and order must each fail on the new layout.
 for(let i=0;i<tasks.length;i++){
  const t=tasks[i],l=await snap(p,t);second.push(l);differs(t,first[i],l);
  if(i!==1){
   assert.equal(await lose(p,t,l,'old',first[i]),i<tasks.length-1);
   if(i===tasks.length-1)break;
  }
  await fill(p,t,l);await next(p);
 }
 await p.locator('#retry').click();assert.equal(await p.locator('#lesson-hearts').innerText(),'❤️❤️❤️');
 for(let i=0;i<tasks.length;i++){
  const t=tasks[i],l=await snap(p,t);third.push(l);differs(t,second[i],l);
  // Undo and redraw must keep the original token bank sequence.
  if(t.type==='order'){
   const id=l.order[0];await click(p,'data-pick',id);await click(p,'data-undo',id);assert.deepEqual(await snap(p,t),l);
  }
  await fill(p,t,l);await next(p);
 }
 assert.match(await p.locator('.modal-panel.reward h2').innerText(),/You Got a Key!/);
 await p.locator('#reward-continue').click();
 const keys=await p.locator('#hud-keys').innerText();
 await start(p,stop);const partial=await snap(p,tasks[0]);differs(tasks[0],third[0],partial);
 // Abandon this replay before seeing task 2/3/4; they must compare
 // against the last actual presentation in the preceding full attempt.
 await p.locator('#close-modal').click();await start(p,stop);
 for(let i=0;i<tasks.length;i++){
  const t=tasks[i],l=await snap(p,t);differs(t,i===0?partial:third[i],l);await fill(p,t,l);await next(p);
 }
 assert.match(await p.locator('.modal-panel.reward h2').innerText(),/Great Job!/);
 await p.locator('#reward-continue').click();assert.equal(await p.locator('#hud-keys').innerText(),keys);
 console.log('G10 '+engine+' '+lesson.id+' PASS: fail, positional replay rejected for all types, full solve, incomplete replay, success replay, key idempotence');
}
async function classic(p,lesson,index){
 await p.locator('[data-open]').nth(index).click();await p.locator('#start').click();
 const initial=[];
 for(let i=0;i<lesson.tasks.length;i++){
  const t=lesson.tasks[i],l=await snap(p,t,true);initial.push(l);
  await fill(p,t,l,'right',null,true);await p.locator('#next').click();
 }
 await p.locator('#again').click();
 for(let i=0;i<lesson.tasks.length;i++){
  const t=lesson.tasks[i],l=await snap(p,t,true);differs(t,initial[i],l);
  await fill(p,t,l,'right',null,true);await p.locator('#next').click();
 }
 await p.locator('#all').click();
}
try{
 const ctx=await browser.newContext({viewport:{width:1280,height:800}});
 const p=await ctx.newPage();watch(p);await p.goto(url,{waitUntil:'networkidle'});
 for(let i=0;i<lessons.length;i++)await island(p,lessons[i],i+1);
 const stored=await p.evaluate(()=>Object.keys(localStorage));
 assert.deepEqual(stored,['kids-english.progress.v1']);
 assert.deepEqual(await p.evaluate(()=>Object.keys(sessionStorage)),[]);
 const c=await ctx.newPage();watch(c);await c.goto(url+'classic/',{waitUntil:'networkidle'});
 for(let i=0;i<lessons.length;i++)await classic(c,lessons[i],i);
 await ctx.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const m=await mobile.newPage();watch(m);await m.goto(url,{waitUntil:'networkidle'});await island(m,lessons[1],2);await mobile.close();
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
 console.log('G10 '+engine+' ALL PASS: 12 cards, Classic, mobile, no runtime errors or writes');
}finally{await browser.close();}
