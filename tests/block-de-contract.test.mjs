import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { worldCards, shopCatalog } from '../assets/js/data.js';
const js=readFileSync('assets/js/app.js','utf8'),css=readFileSync('assets/css/app.css','utf8'),html=readFileSync('index.html','utf8');
const cut=(first,last)=>{const i=js.indexOf(first),j=js.indexOf(last,i+first.length);assert.ok(i>=0&&j>i,'Missing '+first);return js.slice(i,j);};

test('D1: three unique worlds with real assets; future worlds locked',()=>{
  assert.deepEqual(worldCards.map(w=>w.id),['adventure-island','mystical-desert','rainy-forest']);
  assert.equal(new Set(worldCards.map(w=>w.image)).size,3);
  worldCards.forEach(w=>assert.ok(existsSync(w.image)));
  const map=cut('function worldMap()','function itemCode()');
  for(const word of ['worldCards.map','disabled aria-disabled="true"','Coming Soon','Current World','firstReady()'])assert.ok(map.includes(word),word);
});
test('D2: world atlas styled at desktop/mobile with no global hearts',()=>{
  assert.match(css,/\.modal-panel\.worldmap \.world-grid/);
  assert.match(css,/\.modal-panel\.worldmap \.world-card\.future/);
  assert.match(css,/@media\(max-width:500px\)/);
  assert.doesNotMatch(cut('function worldMap()','function itemCode()'),/❤️|Open World|Unlock Now/);
});
test('E1: 5 item categories, 3 tiers each, prices 1,3,5 and native art',()=>{
  assert.deepEqual(Object.keys(shopCatalog).sort(),['backpacks','hats','scarves','shoes','tools']);
  for(const [slot,items] of Object.entries(shopCatalog)){
    assert.equal(items.length,3);
    assert.deepEqual(items.map(i=>i[1]),[1,3,5]);
    for(let i=1;i<=3;i++)assert.ok(existsSync('assets/inventory/'+slot+'/tier-'+i+'.webp'));
  }
});
test('E2: outfit uses real item sprite in map, wardrobe and reward',()=>{
  const outfit=cut('function outfittedCat(','function updateMap()');
  assert.match(outfit,/class="equipped-item"/);
  assert.match(outfit,/assets\/inventory\//);
  assert.match(outfit,/data-item-id/);
  assert.doesNotMatch(outfit,/🧢|👒|🧣|🎒|🧭/);
  assert.match(cut('function updateMap()','function setModal('),/island-outfit/);
  assert.match(cut('function catProfile()','function performItemAction()'),/outfittedCat\(\)/);
  assert.match(cut('function showReward(','function openChest('),/reward-avatar/);
});
test('E3/G1: one five-category wardrobe, owned/worn indicators, one action',()=>{
  const body=cut('function catProfile()','function performItemAction()');
  assert.doesNotMatch(body,/data-shop-view|shop-view-tabs|shop-selected|empty-inventory/);
  for(const word of ['category-tabs','data-category','const tiers = [1, 2, 3]','purchasedItemIds.includes','data-tier-state','item-lock-mark','wardrobeFocusTarget'])assert.ok(body.includes(word),word);
  assert.equal((body.match(/id="item-action"/g)||[]).length,1);
  assert.match(body,/aria-pressed/);
});
test('E4: correct singular/plural shortage, states Buy/Wear/Wearing/Locked/Empty',()=>{
  const body=cut('function itemCode()','function catProfile()');
  for(const word of ['No Items Yet','Wearing ✓','Wear','Buy','Locked','Need ','coinNoun','Coin','Coins'])assert.ok(body.includes(word),word);
});
test('E5: buying once debits once; wear/unwear never debits; persistent storage',()=>{
  const body=cut('function performItemAction()','function settings()');
  for(const word of ['purchasedItemIds.includes(id)','coinBalance < itemCost()','coinBalance -= itemCost()','purchasedItemIds.push(id)','equippedBySlot[currentCategory] = id','equippedBySlot[currentCategory] = null','persist()'])assert.ok(body.includes(word),word);
  const wear=body.split("} else if (st === 'wear')")[1].split("} else if (st === 'wearing')")[0];
  assert.doesNotMatch(wear,/coinBalance|purchasedItemIds.push/);
});
test('E6: storage is achievement-only; original C, map HUD and classic unchanged',()=>{
  assert.doesNotMatch(cut('const emptyProgress = () =>','function readProgress()'),/answers|lives|heart|taskResults/);
  assert.match(html,/id="hud-keys"/);assert.match(html,/id="hud-coins"/);
  assert.doesNotMatch(html,/id="top-hearts"/);
  assert.match(cut('function startLesson(id)','function renderLesson()'),/active\.lives = 3/);
  assert.ok(existsSync('classic/index.html'));
  assert.doesNotMatch(js,/\bfetch\s*\(|sendBeacon|XMLHttpRequest/);
});

test('G12: reference carousel has real navigation and local illustrated locks',()=>{
 const map=cut('function worldMap()','function itemCode()');
 assert.doesNotMatch(map,/world-kicker|🔒|✦/);
 assert.match(map,/data-world-step="-1"/);assert.match(map,/data-world-step="1"/);
 assert.match(map,/data-world-dot/);assert.match(map,/track\.append/);assert.match(map,/aria-pressed/);
 assert.match(css,/g12-world-lock\.svg/);assert.match(css,/filter:blur\(2\.2px\)/);
 assert.ok(existsSync('assets/symbols/g12-world-lock.svg'));
});
