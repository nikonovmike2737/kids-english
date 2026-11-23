import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('assets/js/app.js', 'utf8');
const css = readFileSync('assets/css/app.css', 'utf8');

test('map HUD contains only key and coin counters, not hearts', () => {
  const nav = html.split('<nav class="top-controls"')[1]?.split('</nav>')[0];
  assert.ok(nav, 'main navigation must exist');
  assert.doesNotMatch(nav, /top-hearts|❤️|wallet-hearts|aria-label="3 lives"/);
  assert.match(nav, /id="hud-keys"/);
  assert.match(nav, /id="hud-coins"/);
  assert.match(nav, /assets\/symbols\/key\.webp/);
  assert.match(nav, /assets\/symbols\/coin\.webp/);
});

test('My Cat repeats keys and coins but does not display global lives', () => {
  const wardrobe = js.split('function catProfile()')[1]?.split('function performItemAction()')[0];
  assert.ok(wardrobe, 'cat profile should exist');
  assert.match(wardrobe, /shop-wallet hud-scores/);
  assert.match(wardrobe, /\$\{firstReady\(\)\}\/12/);
  assert.match(wardrobe, /\$\{progress\.coinBalance\}/);
  assert.doesNotMatch(wardrobe, /wallet-hearts|❤️|aria-label="3 lives"/);
});

test('life count is only lesson-attempt state, not browser progress', () => {
  const store = js.split('const emptyProgress = () =>')[1]?.split('function readProgress()')[0];
  assert.ok(store, 'progress schema must exist');
  assert.doesNotMatch(store, /lives|hearts|answer/);
  assert.doesNotMatch(html, /top-hearts/);
  assert.doesNotMatch(js, /\$\('#top-hearts'\)|wallet-hearts/);
  assert.doesNotMatch(css, /#top-hearts|\.wallet-hearts/);
});

test('each new lesson starts with three hearts, wrong loses one, next never resets hearts', () => {
  const start = js.split('function startLesson(id)')[1]?.split('function renderLesson()')[0];
  assert.ok(start);
  assert.match(start, /active\.lives = 3/);
  const verify = js.split('function verifyAnswer()')[1]?.split('function nextQuestion()')[0];
  assert.ok(verify);
  assert.match(verify, /active\.lives -= 1/);
  assert.match(verify, /if \(active\.lives === 0\) showGameOver\(\)/);
  assert.match(verify, /\$\('#lesson-hearts'\)/);
  const next = js.split('function nextQuestion()')[1]?.split('function showGameOver()')[0];
  assert.ok(next);
  assert.doesNotMatch(next, /active\.lives = 3/);
  assert.match(js, /id="lesson-hearts"/);
});

test('rewards remain independent and are granted only on full lesson completion', () => {
  const finish = js.split('function finishLesson()')[1]?.split('function showReward(')[0];
  assert.ok(finish);
  assert.match(finish, /const first = !hasKey\(lesson\.id\)/);
  assert.match(finish, /progress\.completedLessonIds\.push\(lesson\.id\)/);
  assert.match(finish, /showReward\(/);
});
