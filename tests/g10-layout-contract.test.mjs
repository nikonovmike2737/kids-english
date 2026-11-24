import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../assets/js/data.js';
import {createLayoutHistory,taskLayout,sharesOrderSolution,orderPositionSolution} from '../assets/js/answer-layout.js';
const rowMap=l=>l.left.map(id=>l.right.indexOf(id));
const sorted=a=>[...a].sort((x,y)=>x-y);
const ids=n=>Array.from({length:n},(_,i)=>i);
function check(t,l,p){
 if(t.type==='choice'){
  assert.deepEqual(sorted(l.choice),ids(t.options.length));
  if(p)assert.notEqual(l.choice.indexOf(t.correct),p.choice.indexOf(t.correct));
 }else if(t.type==='match'){
  assert.deepEqual(sorted(l.left),ids(t.pairs.length));assert.deepEqual(sorted(l.right),ids(t.pairs.length));
  assert.notDeepEqual(l.left,l.right);
  if(p){assert.notDeepEqual(l.left,p.left);assert.notDeepEqual(l.right,p.right);assert.notDeepEqual(rowMap(l),rowMap(p));}
 }else{
  assert.deepEqual(sorted(l.order),ids(t.tokens.length));
  assert.notDeepEqual(l.order.slice(0,t.correct.length).map(i=>t.tokens[i]),t.correct);
  const solution=orderPositionSolution(t,l.order);
  assert.deepEqual(solution.map(pos=>t.tokens[l.order[pos]]),t.correct);
  if(p)assert.equal(sharesOrderSolution(t,p.order,l.order),false);
 }
}
test('G10 every authored task: 250 full starts, including adversarial constant random fallback',()=>{
 for(const random of [Math.random,()=>0,()=>.999999]){
  for(const lesson of lessons){
   const h=createLayoutHistory(random);let prev=[];
   for(let a=0;a<250;a++){
    const attempt=h.begin(lesson.id);
    const next=lesson.tasks.map((t,i)=>{
     const l=attempt.forTask(t,i);assert.equal(attempt.forTask(t,i),l);check(t,l,prev[i]);return l;
    });prev=next;
   }
  }
 }
});
test('G10 abandoned intermediate attempt does not overwrite unseen tasks; lessons isolated',()=>{
 const h=createLayoutHistory(()=>0),a=lessons[0],b=lessons[1];
 const first=h.begin(a.id),later=first.forTask(a.tasks[2],2);
 h.begin(a.id).forTask(a.tasks[0],0);h.begin(b.id).forTask(b.tasks[2],2);
 check(a.tasks[2],h.begin(a.id).forTask(a.tasks[2],2),later);
});
test('G10 repeated words and short sentence distractor retain semantic solution',()=>{
 const t={type:'order',tokens:['I','am','I','happy'],correct:['I','am','happy']};
 let l;for(let a=0;a<80;a++){const next=taskLayout(t,l);check(t,next,l);l=next;}
 const short=lessons[1].tasks[3];assert.deepEqual(short.correct,['Spin','around']);assert.deepEqual(short.tokens,['around','Spin','sleep']);
 assert.throws(()=>taskLayout({type:'order',tokens:['Spin','around'],correct:['Spin','around']}),/at least three/);
 assert.throws(()=>taskLayout({type:'match',pairs:[['a','1'],['b','2']]}),/three/);
});
test('G10 integrations and canonical authoring gate are present without persistent layout storage',()=>{
 const read=p=>readFileSync(p,'utf8');
 const app=read('assets/js/app.js'),classic=read('classic/index.html');
 assert.match(app,/attemptLayout = layoutHistory.begin\(id\)/);
 assert.match(classic,/attemptLayout=layoutHistory.begin\(state.lesson\)/);
 assert.match(app,/active\.order\.length !== targetLength/);
 assert.match(classic,/state\.order\.length!==t\.correct\.length/);
 assert.doesNotMatch(read('assets/js/answer-layout.js'),/localStorage|sessionStorage|\bfetch\s*\(/);
 for(const p of ['docs/methodology/QUESTION_DESIGN.md','docs/methodology/RELEASE_ACCEPTANCE.md','docs/source-of-truth/ROLE_METHODOLOGIST.md','docs/source-of-truth/GAMEPLAY_CANON.md'])assert.match(read(p),/G10/);
});
