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
// G8: stable base silhouette. Clothing, selected tier and current category
// never participate in portrait scale/position. Refit only for real panel resize.
let observer, generation=0;
export function stopWardrobeFit(){
 generation++;
 observer?.disconnect();
 observer=undefined;
}
export async function fitWardrobe(root){
 stopWardrobeFit();
 const epoch=generation;
 const avatar=root.querySelector('.cat-preview .cat-avatar-canvas');
 const panel=root.querySelector('.cat-preview');
 if(!avatar||!panel)return;
 const base=avatar.querySelector('.cat-base');
 const {l,r,t,b}=await alphaBounds(base);
 if(epoch!==generation||!avatar.isConnected)return;
 let previous='';
 function fit(){
  if(epoch!==generation||!avatar.isConnected)return;
  const pw=panel.clientWidth,ph=panel.clientHeight,ratio=1024/936;
  if(!pw||!ph||r<=l||b<=t)return;
  const mobile=matchMedia('(max-width:500px)').matches;
  const key=[pw,ph,mobile].join(':');
  if(key===previous)return;
  previous=key;
  const desired=Math.min(pw*(mobile?.79:.82)/(r-l),ph*(mobile?.79:.67)*ratio/(b-t),430);
  avatar.style.setProperty('--portrait-width',desired.toFixed(2)+'px');
  avatar.style.setProperty('--portrait-x',((.5-(l+r)/2)*desired).toFixed(2)+'px');
  avatar.style.setProperty('--portrait-y',((.5-(t+b)/2)*desired/ratio).toFixed(2)+'px');
  avatar.dataset.portraitFitted='true';
 }
 fit();observer=new ResizeObserver(fit);observer.observe(panel);
}
