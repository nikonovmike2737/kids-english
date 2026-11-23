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
 assert.match(js,/class="chest-padlock"/);assert.match(js,/st !== 'opened'/);
});
test('G7-04: native alpha WebP chests and sign icons, no external asset dependencies',()=>{
 for(const f of ['assets/chests/closed.webp','assets/chests/opened.webp','assets/chests/grand.webp','assets/symbols/g7-compass.webp','assets/symbols/g7-rocket.webp','assets/symbols/g7-mountain.webp']){
  const b=readFileSync(f);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(b.subarray(12,16).toString(),'VP8X');assert.ok(b[20]&16,'alpha required: '+f);
 }
 assert.equal((html.match(/class="stage-icon"/g)||[]).length,3);
 assert.equal((html.match(/class="bridge-route"/g)||[]).length,3);
});
