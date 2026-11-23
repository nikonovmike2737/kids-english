import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ACTIONS,DURATIONS,chooseAction,nextDelay,poseAt,sourcePoint} from '../assets/animation/cat-poses.js';
const html=readFileSync('index.html','utf8'),css=readFileSync('assets/animation/ambient.css','utf8'),motion=readFileSync('assets/animation/cat-motion.js','utf8');
test('G6-01: four local action envelopes return exactly to rest and random idle 13–17 sec without consecutive repeat',()=>{
 assert.deepEqual(ACTIONS,['wave','wink','stretch','sit']);
 for(const a of ACTIONS){assert.deepEqual(Object.values(poseAt(a,0)),[0,0,0,0]);assert.ok(Object.values(poseAt(a,1)).every(x=>Math.abs(x)<1e-8));assert.ok(DURATIONS[a]<5000);assert.notEqual(chooseAction(a,()=>.5),a);}
 assert.equal(nextDelay(()=>0),13000);assert.equal(nextDelay(()=>1),17000);
});
test('G6-02: localized paw, one-eye, stretch and sitting deformations differ from rest while feet stay pinned for sit',()=>{
 const out=[0,0],move=(x,y,p)=>[...sourcePoint(x,y,p,out)];
 assert.notDeepEqual(move(.79,.38,poseAt('wave',.42)),[.79,.38]);
 assert.notDeepEqual(move(.63,.28,poseAt('wink',.4)),[.63,.28]);
 assert.deepEqual(move(.48,.29,poseAt('wink',.4)),[.48,.29]);
 assert.notDeepEqual(move(.79,.38,poseAt('stretch',.5)),[.79,.38]);
 assert.notDeepEqual(move(.48,.64,poseAt('stretch',.5)),[.48,.64]);
 assert.notDeepEqual(move(.50,.35,poseAt('sit',.5)),[.50,.35]);
 const foot=move(.50,.94,poseAt('sit',.5));assert.ok(Math.abs(foot[1]-.94)<1e-6);
});
test('G6-03: same composed texture for gear and body; local effects, cancellation and accessibility',()=>{
 assert.match(motion,/\.outfit-behind img,\.cat-base,\.outfit-overlays img/);
 assert.match(motion,/drawSprite\(src,image,avatar\)/);assert.match(motion,/renderPose\(ctx,input,output,poseAt/);
 assert.match(motion,/document\.hidden/);assert.match(motion,/prefers-reduced-motion/);assert.match(motion,/modal-open/);
 assert.match(css,/pointer-events:none/);assert.match(css,/fall-flow/);assert.match(css,/shore-roll/);assert.match(css,/leaf-breeze/);
 assert.match(html,/assets\/animation\/ambient\.css/);
});
