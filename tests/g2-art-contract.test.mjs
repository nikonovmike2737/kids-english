import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { shopCatalog } from '../assets/js/data.js';
import manifest from '../docs/product/G2_ART_MANIFEST_2026-11-23.json' with { type: 'json' };

const js=readFileSync('assets/js/app.js','utf8');
const html=readFileSync('index.html','utf8');
const css=readFileSync('assets/css/app.css','utf8');
const cut=(a,b)=>js.slice(js.indexOf(a),js.indexOf(b,js.indexOf(a)+a.length));

function webpInfo(path){
  const data=readFileSync(path);
  assert.equal(data.toString('ascii',0,4),'RIFF',path);
  assert.equal(data.toString('ascii',8,12),'WEBP',path);
  assert.equal(data.toString('ascii',12,16),'VP8X','extended WebP expected: '+path);
  assert.ok(data[20]&0x10,'alpha flag required: '+path);
  const w=data[24]+data[25]*256+data[26]*65536+1;
  const h=data[27]+data[28]*256+data[29]*65536+1;
  return {data,w,h};
}
test('G2-01: 15 distinct native 3D inventory binaries, exact hashes and true alpha headers',()=>{
  assert.equal(manifest.items.length,16);
  const assets=manifest.items.filter(i=>i.path.startsWith('assets/inventory/'));
  assert.equal(assets.length,15);
  const hashes=new Set();
  for(const meta of assets){
    const {data,w,h}=webpInfo(meta.path);
    assert.equal(w,256,meta.path);assert.equal(h,256,meta.path);
    assert.equal(data.length,meta.bytes,meta.path);
    const sha=createHash('sha256').update(data).digest('hex');
    assert.equal(sha,meta.sha256,meta.path);
    hashes.add(sha);
  }
  assert.equal(hashes.size,15,'accidental duplicate item images');
});
test('G2-02: catalogue still matches real five categories/tier 1,3,5 prices',()=>{
  assert.deepEqual(Object.keys(shopCatalog).sort(),['backpacks','hats','scarves','shoes','tools']);
  for(const [slot,products] of Object.entries(shopCatalog)){
    assert.equal(products.length,3);
    assert.deepEqual(products.map(p=>p[1]),[1,3,5]);
    for(let n=1;n<=3;n++){
      assert.ok(manifest.items.some(i=>i.path==='assets/inventory/'+slot+'/tier-'+n+'.webp'));
    }
  }
});
test('G2-03: neutral accessory-free mascot has transparent 1024x936 source and a pinned hash',()=>{
  const meta=manifest.items.find(i=>i.path==='assets/mascot/cat-dressable.webp');
  assert.ok(meta);
  const {data,w,h}=webpInfo(meta.path);
  assert.equal(w,1024);assert.equal(h,936);
  assert.equal(data.length,meta.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'),meta.sha256);
});
test('G2-04: the exact same neutral cat appears on map, wardrobe and reward',()=>{
  assert.match(html,/id="island-cat"[\s\S]*src="assets\/mascot\/cat-dressable.webp"/);
  assert.match(cut('function catProfile()','function performItemAction()'),/src="assets\/mascot\/cat-dressable.webp"/);
  assert.match(cut('function showReward(','function openChest('),/assets\/mascot\/cat-dressable.webp/);
  assert.doesNotMatch(cut('function catProfile()','function performItemAction()'),/cat-wardrobe\.webp/);
  assert.doesNotMatch(html,/cat-map\.webp/);
});
test('G2-05: backpack behind cat, the other four items in front, throughout all views',()=>{
  const outfit=cut('function outfittedCat(', 'function updateMap()');
  assert.match(outfit,/layer === 'behind' \? slot === 'backpacks' : slot !== 'backpacks'/);
  assert.match(outfit,/assets\/inventory\//);
  const map=cut('function updateMap()', 'function setModal(');
  assert.match(map,/#island-outfit-behind/);
  assert.match(map,/outfittedCat\('behind'\)/);
  assert.match(map,/outfittedCat\(\)/);
  const w=cut('function catProfile()', 'function performItemAction()');
  assert.match(w,/class="outfit-behind".*outfittedCat\('behind'\)/);
  assert.match(w,/class="outfit-overlays".*outfittedCat\(\)/);
  assert.match(html,/id="island-outfit-behind"/);
  const reward=cut('function showReward(', 'function openChest(');
  assert.match(reward,/class="outfit-behind".*outfittedCat\('behind'\)/);
});
test('G2-06: anatomically aligned 3D slots and stacking order',()=>{
  for(const slot of ['hat','neck','shoes','back','tool'])assert.ok(css.includes('equipped-item[data-slot='+slot+']'),slot);
  assert.match(css,/\.island-cat \.outfit-behind/);
  assert.match(css,/\.cat-preview \.outfit-behind/);
  assert.match(css,/\.reward-avatar \.outfit-behind/);
  assert.match(css,/\.island-cat \.outfit-overlays/);
  assert.match(css,/width:61%;height:34%;left:20%;top:3\.2%/);
});
test('G2-07: no user data, no altered purchasing or reward ledger',()=>{
  const prog=cut('const emptyProgress = () =>','function readProgress()');
  assert.doesNotMatch(prog,/answers|userId|email|taskResults/);
  const buy=cut('function performItemAction()', 'function settings()');
  assert.match(buy,/coinBalance -= itemCost\(\)/);
  assert.match(buy,/purchasedItemIds\.includes\(id\)/);
  assert.match(buy,/equippedBySlot\[currentCategory\] = id/);
  assert.match(buy,/equippedBySlot\[currentCategory\] = null/);
  assert.doesNotMatch(js,/XMLHttpRequest|sendBeacon/);
});
test('G2-08: wardrobe stays five-category, classic intact, keys and 3-heart quiz remain',()=>{
  const wardrobe=cut('function catProfile()', 'function performItemAction()');
  assert.doesNotMatch(wardrobe,/data-shop-view/);
  assert.match(wardrobe,/data-category/);
  assert.equal((wardrobe.match(/id="item-action"/g)||[]).length,1);
  const lesson=cut('function startLesson(', 'function renderLesson()');
  assert.match(lesson,/active\.lives = 3/);
  assert.ok(readFileSync('classic/index.html','utf8').includes('<html'));
});
