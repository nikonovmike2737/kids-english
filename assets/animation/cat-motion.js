import {ACTIONS,DURATIONS,chooseAction,nextDelay,poseAt,sourcePoint,smooth} from './cat-poses.js';
import {imagePlacement} from './wardrobe-art.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const W=384,H=351,P=64,CW=W+2*P,CH=H+2*P;
let running=null,timer=null,previous=null,started=false;
function activeAvatar(){
 if(document.hidden||reduced.matches)return null;
 const wardrobe=document.querySelector('.modal-panel.wardrobe .cat-avatar-canvas');
 if(wardrobe)return wardrobe;
 if(document.body.classList.contains('modal-open'))return null;
 return document.querySelector('#island-cat .cat-avatar-canvas');
}
function signature(el){return [...el.querySelectorAll('img')].map(i=>i.getAttribute('src')).join('|');}
function drawSprite(ctx,img,avatar){
 const q=imagePlacement(img,avatar);
 ctx.save();ctx.translate(P+(q.x+q.w/2)*W/q.aw,P+(q.y+q.h/2)*H/q.ah);
 ctx.scale(W/q.aw,H/q.ah);
 ctx.transform(q.matrix.a,q.matrix.b,q.matrix.c,q.matrix.d,q.matrix.e,q.matrix.f);
 ctx.drawImage(img,-q.dw/2,-q.dh/2,q.dw,q.dh);ctx.restore();
}
function renderPose(ctx,input,output,p){
 const dst=output.data,src=input.data,point=[0,0];
 // Each pixel samples the SAME composed, layered outfit+cat texture.
 // Inverse mapping avoids seams/holes of moving cut-out limbs.
 for(let y=0,k=0;y<CH;y++)for(let x=0;x<CW;x++,k+=4){
  sourcePoint((x-P)/W,(y-P)/H,p,point);
  const sx=point[0]*W+P,sy=point[1]*H+P;
  const ix=Math.floor(sx),iy=Math.floor(sy);
  if(ix<0||iy<0||ix>=CW-1||iy>=CH-1){dst[k]=dst[k+1]=dst[k+2]=dst[k+3]=0;continue;}
  // Bilinear interpolation with premultiplied alpha preserves soft fur edges.
  const fx=sx-ix,fy=sy-iy,j=(iy*CW+ix)*4,j1=j+4,j2=j+CW*4,j3=j2+4;
  const a=(1-fx)*(1-fy)*src[j+3],b=fx*(1-fy)*src[j1+3],c=(1-fx)*fy*src[j2+3],d=fx*fy*src[j3+3],sum=a+b+c+d;
  dst[k+3]=sum;
  for(let ch=0;ch<3;ch++)dst[k+ch]=sum>0?(a*src[j+ch]+b*src[j1+ch]+c*src[j2+ch]+d*src[j3+ch])/sum:0;
 }
 ctx.putImageData(output,0,0);
 // Tiny cream claws emerge from the two stretched forepaws, then retract.
 if(p.stretch>.12){
  ctx.save();ctx.globalAlpha=smooth(.12,.65,p.stretch);ctx.fillStyle='#fff1d6';ctx.strokeStyle='#d3a67a';ctx.lineWidth=.65;
  const claws=[[.753,.325,.06,-.053,-.02,-.032],[.783,.309,.06,-.053,.002,-.036],[.808,.326,.06,-.053,.024,-.025],
               [.482,.655,-.068,.044,-.026,.014],[.505,.666,-.068,.044,-.018,.029],[.529,.655,-.068,.044,.004,.028]];
  for(const [x,y,dx,dy,tx,ty] of claws){
   const xx=P+W*(x+dx*p.stretch),yy=P+H*(y+dy*p.stretch);
   ctx.beginPath();ctx.moveTo(xx-2,yy-1);ctx.quadraticCurveTo(xx+tx*W*.7-2,yy+ty*H*.7,xx+tx*W,yy+ty*H);ctx.quadraticCurveTo(xx+tx*W*.5+4,yy+ty*H*.5,xx+3,yy+2);ctx.closePath();ctx.fill();ctx.stroke();
  }
  ctx.restore();
 }
}
export function stopCatMotion(){
 if(running)running.cancelled=true;
}
export async function playCatMotion(action,{duration=DURATIONS[action]}={}){
 if(!ACTIONS.includes(action)||!duration||running||reduced.matches)return false;
 const avatar=activeAvatar();if(!avatar)return false;
 const sig=signature(avatar),images=[...avatar.querySelectorAll('.outfit-behind img,.cat-base,.outfit-overlays img')];
 const state={cancelled:false};running=state;
 let layer;
 try{
  await Promise.all(images.map(i=>i.decode()));
  if(state.cancelled||activeAvatar()!==avatar||signature(avatar)!==sig)return false;
  const source=document.createElement('canvas');source.width=CW;source.height=CH;
  const src=source.getContext('2d',{willReadFrequently:true});
  // DOM order is rear gear, base fur, front gear. Paint exactly that order.
  for(const image of images)drawSprite(src,image,avatar);
  const input=src.getImageData(0,0,CW,CH);
  layer=document.createElement('canvas');layer.className='cat-motion-layer';layer.width=CW;layer.height=CH;
  layer.setAttribute('aria-hidden','true');layer.dataset.action=action;
  layer.dataset.gearCount=String(images.length-1);
  layer.style.cssText='left:'+(-P/W*100)+'%;top:'+(-P/H*100)+'%;width:'+(CW/W*100)+'%;height:'+(CH/H*100)+'%';
  const ctx=layer.getContext('2d'),output=ctx.createImageData(CW,CH);
  ctx.putImageData(input,0,0);
  avatar.append(layer);avatar.classList.add('motion-active');avatar.dataset.motion=action;
  const start=performance.now();let last=-Infinity;
  return await new Promise(resolve=>{
   function tick(now){
    if(state.cancelled||activeAvatar()!==avatar||signature(avatar)!==sig||reduced.matches){resolve(false);return;}
    const t=(now-start)/duration;
    if(t>=1){resolve(true);return;}
    if(now-last>=1000/24){
     renderPose(ctx,input,output,poseAt(action,t));
     layer.dataset.phase=t.toFixed(3);last=now;
    }
    requestAnimationFrame(tick);
   }
   requestAnimationFrame(tick);
  });
 }catch(e){console.warn('Optional mascot motion unavailable',e);return false;}
 finally{
  layer?.remove();avatar.classList.remove('motion-active');delete avatar.dataset.motion;
  if(running===state)running=null;
 }
}
function schedule(){
 clearTimeout(timer);
 if(document.hidden||reduced.matches)return;
 timer=setTimeout(async()=>{
  if(!document.hidden&&!reduced.matches&&activeAvatar()){
   const action=chooseAction(previous);
   previous=action;
   // Do not block lesson navigation or purchases while a gesture is active.
   void playCatMotion(action);
  }
  schedule();
 },nextDelay());
}
export function startIslandMotion(){
 if(started)return;started=true;
 document.addEventListener('visibilitychange',()=>{stopCatMotion();schedule();});
 reduced.addEventListener('change',()=>{stopCatMotion();schedule();});
 window.addEventListener('resize',stopCatMotion,{passive:true});
 schedule();
}
