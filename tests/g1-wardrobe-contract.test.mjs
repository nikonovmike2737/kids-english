import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shopCatalog } from '../assets/js/data.js';

const app=readFileSync('assets/js/app.js','utf8');
const css=readFileSync('assets/css/app.css','utf8');
const view=app.slice(app.indexOf('function catProfile()'),app.indexOf('function performItemAction()'));
const action=app.slice(app.indexOf('function itemAction()'),app.indexOf('function catProfile()'));

test('G1-01: owner override removes redundant Shop / Inventory switch',()=>{
  assert.doesNotMatch(view,/data-shop-view|shop-view-tabs|currentShopView|empty-inventory|shop-selected/);
  assert.match(view,/class="category-tabs"/);
  assert.match(view,/data-category=/);
  assert.deepEqual(Object.keys(shopCatalog).sort(),['backpacks','hats','scarves','shoes','tools']);
});
test('G1-02: kitten is a single positioned dressed figure, art stays aligned',()=>{
  assert.match(view,/class="cat-figure"/);
  assert.match(view,/class="cat-base"/);
  assert.match(view,/outfittedCat\(\)/);
  assert.match(css,/\.modal-panel\.wardrobe \.cat-preview \.cat-figure/);
  assert.match(css,/transform:translateX\(-8%\)/);
  assert.match(css,/\.modal-panel\.wardrobe \.cat-preview\{/);
});
test('G1-03: cards use 3 images and a large responsive artwork region',()=>{
  assert.match(view,/const tiers = \[1, 2, 3\]/);
  assert.match(view,/assets\/inventory\/\$\{currentCategory\}\/tier-\$\{tier\}\.webp/);
  assert.match(css,/\.modal-panel\.wardrobe \.shop-item>img\{/);
  assert.match(css,/height:clamp\(126px,24vh,248px\)/);
});
test('G1-04: single enlarged currency price on each card, no duplicate selected strip',()=>{
  assert.match(view,/class="price"><img src="assets\/symbols\/coin.webp"/);
  assert.doesNotMatch(view,/class="shop-selected"/);
  assert.match(css,/\.modal-panel\.wardrobe \.shop-item \.price img\{/);
  assert.match(css,/width:clamp\(25px,2\.7vh,33px\)/);
});
test('G1-05: tier-two and tier-three cards dim entirely with prominent lock',()=>{
  assert.match(view,/locked = !owned && tier > 1/);
  assert.match(view,/class="shop-item .*locked-tier/);
  assert.match(view,/class="item-lock-mark"/);
  assert.match(css,/\.modal-panel\.wardrobe \.shop-item\.locked-tier::after\{/);
  assert.match(css,/\.modal-panel\.wardrobe \.item-lock-mark\{/);
});
test('G1-06: exactly one bottom action, no economy or purchase regression',()=>{
  assert.equal((view.match(/id="item-action"/g)||[]).length,1);
  assert.match(action,/Wearing ✓/);
  assert.match(action,/Need \$\{itemCost\(\) - progress\.coinBalance\}/);
  const change=app.slice(app.indexOf('function performItemAction()'),app.indexOf('function settings()'));
  assert.match(change,/coinBalance -= itemCost\(\)/);
  assert.match(change,/purchasedItemIds\.includes\(id\)/);
  assert.match(change,/equippedBySlot\[currentCategory\] = null/);
});
test('G1-07: phone-safe layout and no change to classic or local progress schema',()=>{
  assert.match(css,/@media\(max-width:500px\)\{/);
  assert.match(css,/\.modal-panel\.wardrobe \.item-action\{/);
  assert.match(css,/overflow-x:hidden/);
  const schema=app.slice(app.indexOf('const emptyProgress = () =>'),app.indexOf('function readProgress()'));
  assert.doesNotMatch(schema,/answers|hearts|results/);
  assert.ok(readFileSync('classic/index.html','utf8').includes('<html'));
});
