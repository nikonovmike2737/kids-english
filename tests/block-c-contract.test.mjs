import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons } from '../assets/js/data.js';

const js = readFileSync('assets/js/app.js', 'utf8');
const css = readFileSync('assets/css/app.css', 'utf8');
const html = readFileSync('index.html', 'utf8');
const section = (start, end) => {
  const begin = js.indexOf(start);
  const finish = js.indexOf(end, begin + start.length);
  assert.ok(begin >= 0 && finish > begin, 'missing function anchors: ' + start);
  return js.slice(begin, finish);
};

test('C1: 3 authored lessons retain four tasks; every choice has four distinct options', () => {
  assert.equal(lessons.length, 3);
  for (const lesson of lessons) {
    assert.equal(lesson.tasks.length, 4, lesson.id);
    for (const task of lesson.tasks.filter((t) => t.type === 'choice')) {
      assert.equal(task.options.length, 4, lesson.id + ': ' + task.title);
      assert.equal(new Set(task.options).size, 4);
      assert.ok(task.correct >= 0 && task.correct < 4);
    }
  }
  assert.match(css, /\.answers\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test('C2: preview -> Start Lesson -> focused modal with close button', () => {
  assert.match(section('function previewLesson(id)', 'function resetQuestion()'), /Start Lesson/);
  assert.match(section('function startLesson(id)', 'function renderLesson()'), /active\.lives = 3/);
  assert.match(section('function setModal(', 'function modalX()'), /tabindex="-1" aria-modal="true"/);
  assert.match(section('function setModal(', 'function modalX()'), /if \(!root\.children\.length\) restoreFocus = document\.activeElement/);
  assert.match(section('function modalX()', 'function nestedCard('), /aria-label="Close"/);
});

test('C3: the topmost result overlay has its own close action and receives focus', () => {
  const card = section('function nestedCard(', 'function clearNested()');
  assert.match(card, /role="alertdialog" aria-modal="true"/);
  assert.match(card, /nested-close/);
  assert.match(card, /aria-hidden', 'true'/);
  assert.match(card, /panel\.focus\(\{ preventScroll: true \}\)/);
  assert.match(card, /gameover-card/);
  assert.match(section('function clearNested()', 'function closeModal()'), /removeAttribute\('aria-hidden'\)/);
});

test('C4: Wrong loses exactly one lesson life, clears selection without revealing key', () => {
  const verify = section('function verifyAnswer()', 'function nextQuestion()');
  assert.match(verify, /active\.lives -= 1/);
  assert.match(verify, /active\.attempts \+= 1/);
  assert.match(verify, /active\.selected = null/);
  assert.match(verify, /active\.match = \{\}/);
  assert.match(verify, /active\.order = \[\]/);
  assert.match(verify, /if \(active\.lives === 0\) showGameOver\(\)/);
  assert.match(verify, /\$\('#verify'\)\.disabled = true/);
  assert.doesNotMatch(section('function showWrongCard()', 'function verifyAnswer()'), /t\.correct|t\.pairs|correctAnswer|correctIndex/);
  assert.match(section('function showWrongCard()', 'function verifyAnswer()'), /Try Again/);
});

test('C5: correct confirmation advances only after successful Check', () => {
  const verify = section('function verifyAnswer()', 'function nextQuestion()');
  const next = section('function nextQuestion()', 'function showGameOver()');
  assert.match(verify, /active\.done = true/);
  assert.match(verify, /showCorrectCard\(\)/);
  assert.match(next, /if \(!active\.done \|\| active\.lives < 1\) return/);
  assert.doesNotMatch(next, /active\.lives = 3/);
  assert.match(section('function showCorrectCard()', 'function showWrongCard()'), /modal-next-action/);
});

test('C6: terminal loss keeps the sad cat above lesson; restart resets three lives', () => {
  const gameOver = section('function showGameOver()', 'function finishLesson()');
  assert.match(gameOver, /assets\/modals\/g5-sad-kitten\.webp/);
  assert.match(gameOver, /gameover-layer/);
  assert.match(gameOver, /wrong-card gameover-card/);
  assert.match(gameOver, /startLesson\(active\.lessonId\)/);
  const keys = section("document.addEventListener('keydown'", '\n\nupdateMap();\n');
  assert.match(keys, /if \(\$\('#gameover-layer', root\)\) closeModal\(\)/);
});

test('C7/G4: celebrate one completed lesson without displaying or storing the attempt report', () => {
  const finish = section('function finishLesson()', 'function openChest(id)');
  assert.match(finish, /active\.results = \[\]/);
  assert.doesNotMatch(finish, /Lesson Results|lesson-summary|report\.results|Lives left in this lesson/);
  assert.match(finish, /reward-celebration/);
  assert.match(finish, /first \? 'key' : 'replay'/);
  const store = section('const emptyProgress = () =>', 'function readProgress()');
  assert.doesNotMatch(store, /answers|results|lives|hearts/);
  assert.match(css, /\.modal-panel\.reward\.lesson-celebration/);
});

test('C8: reward key is minted once; chest is credited only if ready', () => {
  const finish = section('function finishLesson()', 'function openChest(id)');
  assert.match(finish, /const first = !hasKey\(lesson\.id\)/);
  assert.match(finish, /if \(first\) \{ progress\.completedLessonIds\.push\(lesson\.id\); persist\(\); \}/);
  const chest = section('function openChest(id)', 'function worldMap()');
  assert.match(chest, /chestState\(chest\) !== 'ready'/);
  assert.match(chest, /progress\.openedChestIds\.push\(id\)/);
  assert.match(chest, /progress\.coinBalance \+= chest\.bonus/);
});

test('C9: Tab and Shift+Tab trap focus only in frontmost dialog', () => {
  const keys = section("document.addEventListener('keydown'", '\n\nupdateMap();\n');
  assert.match(keys, /const nested = \$\$\('\.modal-backdrop\.nested', root\)\.at\(-1\)/);
  assert.match(keys, /if \(e\.key !== 'Tab'\) return/);
  assert.match(keys, /panel\.contains\(document\.activeElement\)/);
  assert.match(keys, /e\.shiftKey/);
  const close = section('function closeModal()', 'function previewLesson(id)');
  assert.match(close, /previous\?\.dataset\?\.stop/);
  assert.match(close, /previous\?\.dataset\?\.chest/);
});

test('C10: unchanged static privacy architecture and classic fallback', () => {
  assert.match(html, /src="assets\/js\/app\.js"/);
  assert.ok(readFileSync('classic/index.html', 'utf8').includes('<html'));
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
  assert.doesNotMatch(section('function readProgress()', 'let progress = readProgress()'), /active\.results|taskMistakes/);
});
