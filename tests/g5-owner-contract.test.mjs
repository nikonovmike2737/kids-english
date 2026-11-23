import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stopPositions,chests} from '../assets/js/data.js';
test('G5-01: exact owner-marked group positions and unchanged chest rewards',()=>{
 assert.deepEqual(stopPositions.map(x=>x.slice(1)),[[25.5,27.1],[32.5,27.1],[39.5,27.1],[46.5,27.1],[55.4,50.2],[47.9,50.2],[40.4,50.2],[32.9,50.2],[28.5,75.4],[36,75.4],[43.5,75.4],[51,75.4]]);
 assert.deepEqual(chests.map(c=>[c.x,c.y,c.bonus]),[[53.9,31.3,1],[20.8,56,1],[58.5,79.4,1],[88.5,69.5,5]]);
 const css=readFileSync('assets/css/app.css','utf8');
 assert.match(css,/\.stage \.label-top\{left:19\.9%;top:13\.4%\}/);
 assert.match(css,/\.stage \.label-mid\{left:26\.3%;top:33\.5%\}/);
 assert.match(css,/\.stage \.label-low\{left:28\.0%;top:60\.2%\}/);
 assert.match(css,/maps\/g5-adventure-island\.webp/);
 assert.match(css,/left:0;bottom:8\.5%;width:13\.5%/);
});
test('G5-02: optimized map and full-body retry WebP assets are present',()=>{
 for(const f of ['assets/maps/g5-adventure-island.webp','assets/modals/g5-sad-kitten.webp']){
  const b=readFileSync(f);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.ok(b.length>20000&&b.length<550000);
 }
 const js=readFileSync('assets/js/app.js','utf8');
 assert.match(js,/class="retry-cat" src="assets\/modals\/g5-sad-kitten\.webp"/);
 assert.match(js,/\$\('#retry', layer\)\.addEventListener\('click', \(\) => startLesson\(active.lessonId\)\)/);
 assert.match(js,/\$\('#exit-fail', layer\)\.addEventListener\('click', closeModal\)/);
});
