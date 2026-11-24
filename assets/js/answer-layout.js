// G10: presentation permutations only; authored answer IDs and keys never change.
const ids=n=>Array.from({length:n},(_,i)=>i);
const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
export function shuffleIndices(n,random=Math.random){
 const a=ids(n);
 for(let i=n-1;i>0;i--){
  const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
  [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}
function* permutations(a,prefix=[]){
 if(!a.length){yield prefix;return;}
 for(let i=0;i<a.length;i++)yield* permutations(a.filter((_,j)=>i!==j),[...prefix,a[i]]);
}
function choose(n,valid,random){
 for(let i=0;i<128;i++){const p=shuffleIndices(n,random);if(valid(p))return p;}
 for(const p of permutations(ids(n)))if(valid(p))return p;
 throw Error('Task cannot satisfy anti-position-memory layout contract');
}
const pattern=(left,right)=>left.map(i=>right.indexOf(i));
export function orderPositionSolution(t,layout){
 const used=new Set();
 return t.correct.map(word=>{
  const i=layout.findIndex((id,pos)=>t.tokens[id]===word&&!used.has(pos));
  if(i<0)throw Error('Invalid sentence token bank');
  used.add(i);return i;
 });
}
// Whether some identical sequence of positions solves both layouts,
// including repeated words and unused distractors.
export function sharesOrderSolution(t,a,b){
 const needs=new Map();
 for(const word of t.correct)needs.set(word,(needs.get(word)||0)+1);
 return [...needs].every(([word,count])=>a.filter((id,i)=>t.tokens[id]===word&&t.tokens[b[i]]===word).length>=count);
}
export function taskLayout(t,prev,random=Math.random){
 if(t.type==='choice'){
  if(t.options.length<3||new Set(t.options).size!==t.options.length||!Number.isInteger(t.correct)||t.correct<0||t.correct>=t.options.length)throw Error('Choice requires distinct options and valid answer');
  return {choice:choose(t.options.length,p=>!prev||p.indexOf(t.correct)!==prev.choice.indexOf(t.correct),random)};
 }
 if(t.type==='match'){
  const n=t.pairs.length;
  if(n<3||new Set(t.pairs.map(p=>p[0])).size!==n||new Set(t.pairs.map(p=>p[1])).size!==n)throw Error('Match requires at least three unambiguous pairs');
  const left=choose(n,p=>!prev||!same(p,prev.left),random);
  const right=choose(n,p=>!same(left,p)&&(!prev||(!same(p,prev.right)&&!same(pattern(left,p),pattern(prev.left,prev.right)))),random);
  return {left,right};
 }
 if(t.type==='order'){
  if(t.tokens.length<3||t.correct.length<2||t.correct.length>t.tokens.length)throw Error('Order requires at least three tokens and a valid target length');
  orderPositionSolution(t,ids(t.tokens.length));
  const order=choose(t.tokens.length,p=>{
   const solvedPrefix=t.correct.every((word,i)=>t.tokens[p[i]]===word);
   return !solvedPrefix&&(!prev||!sharesOrderSolution(t,prev.order,p));
  },random);
  return {order};
 }
 throw Error('Unsupported task type: '+t.type);
}
export function createLayoutHistory(random=Math.random){
 // Last actually presented layouts only, in this page's RAM. Unseen tasks
 // never overwrite the last layout the learner actually saw.
 const latest=new Map();
 return {
  begin(lessonId){
   const current=new Map();
   return {
    forTask(t,index){
     const key=JSON.stringify([lessonId,t.task_id??t.id??index]);
     if(!current.has(key)){
      const layout=taskLayout(t,latest.get(key),random);
      current.set(key,layout);latest.set(key,layout);
     }
     return current.get(key);
    }
   };
  }
 };
}
