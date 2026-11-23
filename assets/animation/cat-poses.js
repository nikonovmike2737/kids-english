/* G6: normalized source-space pose rig for the original 1024×936 kitten.
   The same deformation applies to the precomposited fur AND purchased gear. */
export const ACTIONS=Object.freeze(['wave','wink','stretch','sit']);
export const DURATIONS=Object.freeze({wave:2100,wink:1050,stretch:2750,sit:3900});
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function smooth(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t);}
export function chooseAction(previous,random=Math.random){const pool=ACTIONS.filter(x=>x!==previous);return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];}
export function nextDelay(random=Math.random){return 13000+random()*4000;}
export function poseAt(action,t){
 t=clamp(t);
 const envelope=smooth(0,.19,t)*(1-smooth(.78,1,t));
 if(action==='wave')return {wave:Math.sin(t*Math.PI*6)*.33*envelope,blink:0,stretch:0,sit:0};
 if(action==='wink')return {wave:0,blink:smooth(.14,.32,t)*(1-smooth(.54,.76,t)),stretch:0,sit:0};
 if(action==='stretch')return {wave:0,blink:0,stretch:smooth(.08,.36,t)*(1-smooth(.65,.96,t)),sit:0};
 if(action==='sit')return {wave:0,blink:0,stretch:0,sit:smooth(.04,.29,t)*(1-smooth(.72,.98,t))};
 return {wave:0,blink:0,stretch:0,sit:0};
}
// Smooth inverse skinning field. Normalized coordinates also cover the
// transparent margins and all 5 slots. Feet remain pinned on the rock.
export function sourcePoint(x,y,p,out){
 let sx=x,sy=y;
 if(p.sit){
  const a=p.sit;
  const shift=.145*a;
  const hip=.63,foot=.94;
  if(y<=hip+shift)sy=y-shift;
  else if(y<foot)sy=hip+(y-hip-shift)*(foot-hip)/(foot-hip-shift);
  const leg=smooth(.56,.78,sy)*(1-smooth(.89,.96,sy));
  sx=.52+(x-.52)/(1+.23*a*leg);
  // Lower the lifted foreleg as the body descends, without moving the head.
  const arm=smooth(.65,.76,x)*smooth(.22,.33,sy)*(1-smooth(.48,.65,sy));
  sy-=.085*a*arm;
  sx+=.032*a*arm;
 }
 if(p.wave){
  const weight=smooth(.65,.74,x)*smooth(.20,.30,y)*(1-smooth(.48,.64,y));
  const angle=-p.wave*weight,c=Math.cos(angle),s=Math.sin(angle);
  const dx=x-.66,dy=y-.50;
  sx=.66+c*dx-s*dy*.914;
  sy=.50+s*dx/ .914+c*dy;
 }
 if(p.stretch){
  const right=smooth(.66,.77,x)*smooth(.21,.33,y)*(1-smooth(.46,.63,y));
  const left=smooth(.36,.45,x)*(1-smooth(.54,.63,x))*smooth(.49,.61,y)*(1-smooth(.69,.80,y));
  sx=x-p.stretch*(.065*right-.080*left);
  sy=y-p.stretch*(-.055*right+.048*left);
 }
 if(p.blink){
  // The smaller eye (image right) closes along its own slightly tilted lid;
  // the other eye, nose, head and all clothes stay unchanged.
  const cx=.629,cy=.253-.23*(x-cx);
  const w=(1-smooth(.036,.067,Math.abs(x-cx)))*p.blink;
  if(w>0){
   const dy=y-cy,ad=Math.abs(dy),outer=.089,inner=.039,compressed=inner*(1-.94*w);
   if(ad<outer){
    const mapped=ad<=compressed?ad*inner/compressed:inner+(ad-compressed)*(outer-inner)/(outer-compressed);
    sy=cy+Math.sign(dy)*mapped;
   }
  }
 }
 out[0]=sx;out[1]=sy;return out;
}
