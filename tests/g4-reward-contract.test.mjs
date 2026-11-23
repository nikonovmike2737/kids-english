import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync('assets/js/app.js','utf8'),css=readFileSync('assets/css/app.css','utf8');
const reward=js.slice(js.indexOf('function finishLesson()'),js.indexOf('function openChest(id)'));
test('G4-01: only one dressable kitten, single scene and no lesson results panel',()=>{
 assert.equal((reward.match(/class="reward-avatar"/g)||[]).length,1);
 assert.match(reward,/class="reward-celebration"/);
 assert.doesNotMatch(reward,/lesson-summary|Lesson Results|Lives left in this lesson|wrong tries/);
 assert.match(reward,/id="reward-continue"/);
});
test('G4-02: first completion gets a golden key, replay gets a star, both show permanent count',()=>{
 assert.match(reward,/first \? 'You Got a Key!' : 'Great Job!'/);
 assert.match(reward,/first \? 'key' : 'replay'/);
 assert.match(reward,/g4-golden-key\.svg/);assert.match(reward,/g4-golden-star\.svg/);
 assert.match(reward,/firstReady\(\)\} \/ 12 keys/);
 for(const file of ['g4-golden-key.svg','g4-golden-star.svg']){
  const svg=readFileSync('assets/modals/'+file,'utf8');
  assert.match(svg,/viewBox="0 0 240 240"/);assert.match(svg,/linearGradient/);
  assert.doesNotMatch(svg,/<script|https?:\/\/(?!www\.w3\.org\/2000\/svg)/);
 }
});
test('G4-03: original key and chest ledger preserved; no duplicate mint and no report persistence',()=>{
 assert.match(reward,/const first = !hasKey\(lesson\.id\)/);
 assert.match(reward,/if \(first\) \{ progress\.completedLessonIds\.push\(lesson\.id\); persist\(\); \}/);
 assert.match(reward,/active\.results = \[\]/);
 assert.match(reward,/active\.lives = 3/);
 assert.doesNotMatch(reward,/coinBalance\s*[+\-]=/);
 assert.match(js,/progress\.coinBalance \+= chest\.bonus/);
 assert.doesNotMatch(js.slice(js.indexOf('const emptyProgress'),js.indexOf('function readProgress')),/results|answers|lives/);
});
test('G4-04: stage has bounded proportions and accessible title/continue controls',()=>{
 assert.match(css,/\.modal-panel\.reward\.lesson-celebration/);
 assert.match(css,/\.reward-celebration\{/);
 assert.match(css,/aspect-ratio:1\.65 \/ 1/);
 assert.match(css,/@media\(max-height:520px\)/);
 assert.match(reward,/aria-labelledby/);
 assert.match(reward,/aria-hidden="true"/);
 assert.match(reward,/\$\('#reward-continue'\)\.addEventListener\('click', closeModal\)/);
});
