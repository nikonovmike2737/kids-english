/* G6: measure visible pixels, not transparent image rectangles. */
const alphaCache=new Map();
export async function alphaBounds(img){
 // Each newly mounted DOM image must decode even when its alpha bounds are cached.
 try{await img.decode();}catch{return {l:0,r:1,t:0,b:1};}
 const key=img.currentSrc||img.src;
 if(!alphaCache.has(key))alphaCache.set(key,(async()=>{
  await img.decode();
  const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const a=g.getImageData(0,0,c.width,c.height).data;
  let l=c.width,r=-1,t=c.height,b=-1;
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(a[(y*c.width+x)*4+3]>36){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  return r<0?{l:0,r:1,t:0,b:1}:{l:l/c.width,r:(r+1)/c.width,t:t/c.height,b:(b+1)/c.height};
 })().catch(()=>{alphaCache.delete(key);return {l:0,r:1,t:0,b:1};}));
 return alphaCache.get(key);
}
export async function centerShopArt(root){
 const images=[...root.querySelectorAll('.shop-item>img')];
 await Promise.all(images.map(async img=>{
  const b=await alphaBounds(img);
  if(!img.isConnected)return;
  img.style.setProperty('--art-x',((1-b.l-b.r)*50).toFixed(3)+'%');
  img.style.setProperty('--art-y',((1-b.t-b.b)*50).toFixed(3)+'%');
  img.dataset.artCentered='true';
 }));
}
// Return the real transformed pixel bounds in the shared avatar coordinate
// space. Transparent padding, object-fit and rotated accessory anchors matter.
export function imagePlacement(img,avatar){
 const aw=avatar.offsetWidth,ah=avatar.offsetHeight;
 const w=img.offsetWidth,h=img.offsetHeight;
 let x=img.offsetLeft,y=img.offsetTop;
 // All outfit spans have absolute inset:0 and the same origin as avatar.
 const scale=Math.min(w/img.naturalWidth,h/img.naturalHeight);
 const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
 const matrix=new DOMMatrix(getComputedStyle(img).transform==='none'?undefined:getComputedStyle(img).transform);
 return {aw,ah,w,h,x,y,dw,dh,matrix};
}
function pointsOf(img,avatar,b){
 const q=imagePlacement(img,avatar);
 return [[b.l,b.t],[b.r,b.t],[b.l,b.b],[b.r,b.b]].map(([u,v])=>{
  const pt=new DOMPoint((u-.5)*q.dw,(v-.5)*q.dh).matrixTransform(q.matrix);
  return [(q.x+q.w/2+pt.x)/q.aw,(q.y+q.h/2+pt.y)/q.ah];
 });
}
let observer;
export async function fitWardrobe(root){
 const avatar=root.querySelector('.cat-preview .cat-avatar-canvas');
 const panel=root.querySelector('.cat-preview');
 if(!avatar||!panel)return;
 observer?.disconnect();
 const imgs=[...avatar.querySelectorAll('.cat-base,.equipped-item')];
 const bounds=await Promise.all(imgs.map(alphaBounds));
 if(!avatar.isConnected)return;
 function fit(){
  if(!avatar.isConnected)return;
  // Measure in the original normalized 1024:936 rig, then size its
  // transparent canvas so the opaque pixels fit the owner's green frame.
  if(!avatar.offsetWidth||!avatar.offsetHeight)return;
  const points=imgs.flatMap((img,i)=>pointsOf(img,avatar,bounds[i]));
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const l=Math.min(...xs),r=Math.max(...xs),t=Math.min(...ys),b=Math.max(...ys);
  const pw=panel.clientWidth,ph=panel.clientHeight,ratio=1024/936;
  if(![l,r,t,b,pw,ph].every(Number.isFinite)||r<=l||b<=t||pw<=0||ph<=0)return;
  const mobile=matchMedia('(max-width:500px)').matches;
  const desired=Math.min(pw*(mobile?.79:.82)/(r-l),ph*(mobile?.79:.67)*ratio/(b-t),430);
  avatar.style.setProperty('--portrait-width',desired.toFixed(2)+'px');
  avatar.style.setProperty('--portrait-x',((.5-(l+r)/2)*desired).toFixed(2)+'px');
  avatar.style.setProperty('--portrait-y',((.5-(t+b)/2)*desired/ratio).toFixed(2)+'px');
  avatar.dataset.portraitFitted='true';
 }
 fit();observer=new ResizeObserver(fit);observer.observe(panel);
}
