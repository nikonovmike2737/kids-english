import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {stopPositions,chests} from '../assets/js/data.js';
const html=readFileSync('index.html','utf8'),css=readFileSync('assets/animation/ambient.css','utf8'),js=readFileSync('assets/js/app.js','utf8');
test('G7-01: no mascot animation scheduler, canvas or smoke escape hatch',()=>{
 assert.doesNotMatch(js,/cat-motion|playCatMotion|stopCatMotion|startIslandMotion/);
 assert.doesNotMatch(css,/cat-motion-layer|motion-active/);
 assert.equal(existsSync('assets/animation/cat-motion.js'),false);assert.equal(existsSync('assets/animation/cat-poses.js'),false);
});
test('G7-02: scene-only ambient effects and reduced-motion safety',()=>{
 assert.match(css,/pointer-events:none/);assert.match(css,/fall-flow/);assert.match(css,/shore-roll/);assert.match(css,/leaf-breeze/);
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(html,/assets\/animation\/ambient\.css/);
});
test('G7-03: four equal gaps per row, no changes to lesson/chest identifiers or rewards',()=>{
 for(let row=0;row<3;row++){
  const a=[...stopPositions.slice(row*4,row*4+4).map(x=>x[1]),chests[row].x].sort((a,b)=>a-b);
  const d=a.slice(1).map((x,i)=>x-a[i]);assert.ok(d.every(v=>Math.abs(v-d[0])<.001),JSON.stringify(a));
 }
 assert.deepEqual(chests.map(c=>c.bonus),[1,1,1,5]);
 assert.doesNotMatch(js,/chest-padlock/);assert.equal(existsSync('assets/symbols/g7-lock.svg'),false);assert.equal(existsSync('assets/symbols/g7-unlock.svg'),false);
});
test('G7-04: native alpha WebP chests and sign icons, no external asset dependencies',()=>{
 for(const f of ['assets/chests/closed.webp','assets/chests/opened.webp','assets/chests/grand.webp','assets/symbols/g7-compass.webp','assets/symbols/g7-rocket.webp','assets/symbols/g7-mountain.webp']){
  const b=readFileSync(f);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(b.subarray(12,16).toString(),'VP8X');assert.ok(b[20]&16,'alpha required: '+f);
 }
 assert.equal((html.match(/class="stage-icon"/g)||[]).length,3);
 assert.equal((html.match(/class="bridge-route"/g)||[]).length,3);
});

test('G8-01: shared symmetric vector close glyph for main and nested modals',()=>{
 assert.match(js,/M6 6L18 18M18 6L6 18/);
 assert.equal((js.match(/\$\{closeGlyph\(\)\}/g)||[]).length,2);
 const style=readFileSync('assets/css/app.css','utf8');
 assert.match(style,/\.modal-panel \.close\{display:grid;place-items:center/);
 assert.doesNotMatch(style,/chest-padlock/);
});
test('G8-02: existing wardrobe updates shop only, stable portrait is fitted from base once',()=>{
 const cat=js.slice(js.indexOf('function catProfile()'),js.indexOf('function performItemAction()'));
 assert.match(cat,/if \(existing\) \{/);assert.match(cat,/\$\('\.shop-panel', existing\)\.innerHTML = shop/);
 assert.match(cat,/avatar\.dataset\.equipment !== equippedSignature/);
 assert.equal((cat.match(/fitWardrobe\(root\)/g)||[]).length,1);
 const fit=readFileSync('assets/animation/wardrobe-art.js','utf8');
 assert.match(fit,/await alphaBounds\(base\)/);assert.match(fit,/if\(key===previous\)return/);
 assert.doesNotMatch(fit,/querySelectorAll\('\.cat-base,\.equipped-item'\)/);
});

test('G9: local illustrated lesson lock and layered reference discs retain native states',()=>{
 const style=readFileSync('assets/css/app.css','utf8');
 const icon=readFileSync('assets/symbols/g9-lesson-lock.svg','utf8');
 const map=js.slice(js.indexOf('function updateMap()'),js.indexOf('function setModal('));
 assert.match(map,/class="lesson-lock" src="assets\/symbols\/g9-lesson-lock\.svg"/);
 assert.match(map,/b\.disabled = state === 'locked'/);
 assert.match(map,/class="key-mark"/);
 assert.match(style,/\.stage \.node\[data-state=locked\]/);
 assert.match(style,/\.stage \.node\[data-state=completed\]/);
 assert.match(icon,/viewBox="0 0 80 92"/);assert.match(icon,/fill="#fffaf2"/);
});
