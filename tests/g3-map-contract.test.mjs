import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stopPositions,chests,lessons,stopToLesson} from '../assets/js/data.js';
const html=readFileSync('index.html','utf8'),css=readFileSync('assets/css/app.css','utf8'),js=readFileSync('assets/js/app.js','utf8');
const routes=[...html.matchAll(/<path id="(route-[a-z-]+)" class="(land-route|bridge-route)" data-route="([^"]+)" d="([^"]+)"\s*><\/path>/g)];

test('G2R-01: Safari avatar uses explicit bounded layout, not intrinsic grid image width',()=>{
  assert.match(css,/OWNER 23:48 SAFARI QA/);
  assert.match(css,/\.modal-panel\.wardrobe \.cat-preview \.cat-figure \.cat-avatar-canvas/);
  assert.match(css,/width:min\(88%,320px,38vh\)/);
  assert.match(css,/max-width:calc\(100% - 16px\)/);
  assert.match(css,/transform:none !important/);
});
test('G2R-02: neutral illustration-free wardrobe background without scenery photo',()=>{
  const patch=css.slice(css.indexOf('OWNER 23:48 SAFARI QA'));
  assert.match(patch,/background-image:radial-gradient/);
  assert.doesNotMatch(patch.split('\/\* G3')[0],/url\(/);
});
test('G3-01: 12 ordered lesson nodes remain correctly unlocked without fake content',()=>{
  assert.equal(stopPositions.length,12);
  assert.deepEqual(stopPositions.map(x=>x[0]),Array.from({length:12},(_,i)=>i+1));
  assert.equal(lessons.length,3);
  assert.deepEqual(Object.keys(stopToLesson),['1','2','3']);
  assert.ok(stopPositions.slice(0,4).every(x=>x[2]<35));
  assert.ok(stopPositions.slice(4,8).every(x=>x[2]>47&&x[2]<58));
  assert.ok(stopPositions.slice(8).every(x=>x[2]>69&&x[2]<83));
  for(const row of [stopPositions.slice(0,4),stopPositions.slice(4,8),stopPositions.slice(8)]){
    assert.equal(new Set(row.map(x=>x[2])).size,1,'terrace nodes must remain row-aligned');
  }
});
test('G3-02: exactly four independent footing-anchored chest buttons, no baked HTML chest images',()=>{
  assert.equal(chests.length,4);
  assert.deepEqual(chests.map(x=>x.id),['chest-a','chest-b','chest-c','grand-chest']);
  assert.deepEqual(chests.map(x=>x.bonus),[1,1,1,5]);
  assert.ok(chests.every(x=>x.x>15&&x.x<90&&x.y>30&&x.y<85));
  assert.match(js,/b\.className = \x60chest-node/);
  assert.match(js,/document\.createElement\('button'\)/);
  assert.match(js,/assets\/chests\/\$\{st === 'opened'/);
  assert.match(css,/\.stage \.chest-node img/);
  assert.match(css,/\.stage \.chest-node::after/);
  assert.doesNotMatch(html,/src="assets\/chests\//);
});
test('G3-03: smoothly drawn canonical three-land three-bridge serpentine path',()=>{
  assert.equal(routes.length,8,'three stage land routes, three bridges, two landfalls');
  assert.equal(routes.filter(x=>x[2]==='bridge-route').length,3);
  assert.deepEqual(routes.filter(x=>x[2]==='bridge-route').map(x=>x[3]),['bridge-a','bridge-b','bridge-c']);
  for(const [full,id,kind,segment,d] of routes){
    assert.match(d,/^M\s*\d+/);
    assert.ok((d.match(/\bC\b/g)||[]).length>0,id+' must use cubic smoothing');
    assert.doesNotMatch(d,/\b[HVLAZ]\b/,id+' must not use sharp path commands or arrows');
  }
  const start=routes[0][4].match(/^M\s*(\d+)\s+(\d+)/);
  assert.ok(Math.abs(Number(start[1])-1672*stopPositions[0][1]/100)<8);
  assert.ok(Math.abs(Number(start[2])-941*stopPositions[0][2]/100)<8);
  assert.match(css,/stroke-dasharray:2 15/);
  assert.match(css,/stroke-linecap:round/);
});
test('G3-04: island kitten shifted left of the drawn bridge, still interactive',()=>{
  const patch=css.slice(css.indexOf('OWNER 23:48 SAFARI QA'));
  assert.match(patch,/\.stage \.island-cat\{/);
  assert.match(patch,/left:\.2%;/);
  assert.match(patch,/width:15\.6%;/);
  assert.match(html,/id="island-cat"/);
  assert.match(js,/\$\('#island-cat'\)\.addEventListener\('click'/);
});
test('G3-05: no regression of privacy, reward counts, owner-approved English lessons and Classic',()=>{
  assert.equal(chests.filter(x=>x.id!=='grand-chest').length,3);
  assert.deepEqual(lessons.map(x=>x.tasks.length),[4,4,4]);
  assert.ok(readFileSync('classic/index.html','utf8').includes('<html'));
  assert.match(js,/coinBalance -= itemCost\(\)/);
  assert.match(js,/active\.lives = 3/);
  assert.doesNotMatch(js,/\bfetch\s*\(|sendBeacon|XMLHttpRequest/);
});
