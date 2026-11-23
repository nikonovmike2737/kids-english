import {lessons,themeLabels,stopToLesson,stopPositions,chests,shopCatalog,worldCards} from './data.js';

const STORE = 'kids-english.progress.v1';
const root = document.getElementById('modal-root');
const $ = (s, parent = document) => parent.querySelector(s);
const $$ = (s, parent = document) => Array.from(parent.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ids = new Set(lessons.map((l) => l.id));
const validChests = new Set(chests.map((c) => c.id));
const slots = Object.keys(shopCatalog);
const allowedItems = new Set(slots.flatMap((slot) => [1, 2, 3].map((i) => `${slot}-${i}`)));

const emptyProgress = () => ({
  schemaVersion: 1,
  completedLessonIds: [],
  openedChestIds: [],
  coinBalance: 0,
  purchasedItemIds: [],
  equippedBySlot: { hats: null, scarves: null, shoes: null, backpacks: null, tools: null },
});

function readProgress() {
  try {
    const input = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (!input || input.schemaVersion !== 1) return emptyProgress();
    const p = emptyProgress();
    p.completedLessonIds = Array.from(new Set((Array.isArray(input.completedLessonIds) ? input.completedLessonIds : []).filter((id) => ids.has(id))));
    p.openedChestIds = Array.from(new Set((Array.isArray(input.openedChestIds) ? input.openedChestIds : []).filter((id) => validChests.has(id))));
    p.purchasedItemIds = Array.from(new Set((Array.isArray(input.purchasedItemIds) ? input.purchasedItemIds : []).filter((id) => allowedItems.has(id))));
    for (const slot of slots) {
      const value = input.equippedBySlot?.[slot];
      p.equippedBySlot[slot] = p.purchasedItemIds.includes(value) ? value : null;
    }
    const earned = p.openedChestIds.reduce((sum, id) => sum + (chests.find((c) => c.id === id)?.bonus || 0), 0);
    const spent = p.purchasedItemIds.reduce((sum, id) => {
      const [slot, tierText] = id.split('-');
      return sum + (shopCatalog[slot]?.[Number(tierText) - 1]?.[1] || 0);
    }, 0);
    p.coinBalance = Math.max(0, earned - spent);
    return p;
  } catch {
    return emptyProgress();
  }
}

let progress = readProgress();
function persist() {
  try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch { /* play in memory only */ }
}

const active = { lessonId: null, index: 0, lives: 3, attempts: 0, done: false, selected: null, matchWord: null, match: {}, order: [], results: [] };
let currentCategory = 'hats';
let selectedTier = 1;
let wardrobeFocusTarget = null;
let modalType = null;
let restoreFocus = null;

const firstReady = () => new Set(progress.completedLessonIds).size;
const hasKey = (id) => progress.completedLessonIds.includes(id);
const curLesson = () => lessons.find((l) => l.id === active.lessonId);
const curTask = () => curLesson().tasks[active.index];
const groupDone = (i) => [i * 4 + 1, i * 4 + 2, i * 4 + 3, i * 4 + 4].every((n) => { const id = stopToLesson[n]; return !!id && hasKey(id); });
const groupOpen = (i) => i === 0 || progress.openedChestIds.includes(chests[i - 1].id);

function chestState(c) {
  if (progress.openedChestIds.includes(c.id)) return 'opened';
  if (c.id === 'grand-chest') return groupDone(0) && groupDone(1) && groupDone(2) && chests.slice(0, 3).every((x) => progress.openedChestIds.includes(x.id)) ? 'ready' : 'locked';
  return groupDone(c.worldGroup) ? 'ready' : 'locked';
}

function toast(s) {
  const el = $('#map-status');
  el.textContent = s;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
}

function outfittedCat() {
  // One illustrated item asset per equipped slot, shared across map, closet and rewards.
  return slots.map((slot) => {
    const id = progress.equippedBySlot[slot];
    if (!id || !progress.purchasedItemIds.includes(id)) return '';
    const tier = Number(id.slice(slot.length + 1));
    if (![1, 2, 3].includes(tier)) return '';
    const position = { hats: 'hat', scarves: 'neck', shoes: 'shoes', backpacks: 'back', tools: 'tool' }[slot];
    return '<img class="equipped-item" data-slot="' + position + '" data-item-id="' + esc(id)
      + '" src="assets/inventory/' + slot + '/tier-' + tier + '.webp" alt="" aria-hidden="true" draggable="false">';
  }).join('');
}

function updateMap() {
  const target = $('#island-nodes');
  target.innerHTML = '';
  for (const [number, x, y] of stopPositions) {
    const lesson = lessons.find((l) => l.id === stopToLesson[number]);
    const section = Math.floor((number - 1) / 4);
    const isUnlocked = groupOpen(section);
    const state = lesson && isUnlocked ? (hasKey(lesson.id) ? 'completed' : 'available') : 'locked';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'node';
    b.dataset.state = state;
    b.dataset.stop = String(number);
    b.style.setProperty('--x', `${x}%`);
    b.style.setProperty('--y', `${y}%`);
    b.disabled = state === 'locked';
    b.innerHTML = `<span class="icon-emoji" aria-hidden="true">${state === 'locked' ? '🔒' : lesson.icon}</span>${state === 'completed' ? '<span class="key-mark"><img alt="" src="assets/symbols/key.webp"></span>' : ''}`;
    b.setAttribute('aria-label', lesson ? `${lesson.title} — ${state}` : `Lesson ${number} — locked`);
    b.title = lesson ? `${lesson.title} · ${lesson.duration}` : 'Coming Soon';
    if (lesson && isUnlocked) b.addEventListener('click', () => previewLesson(lesson.id));
    target.append(b);
  }

  for (const c of chests) {
    const st = chestState(c);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `chest-node${c.id === 'grand-chest' ? ' grand' : ''}`;
    b.dataset.state = st;
    b.dataset.chest = c.id;
    b.style.setProperty('--x', `${c.x}%`);
    b.style.setProperty('--y', `${c.y}%`);
    b.innerHTML = `<img src="assets/chests/${st === 'opened' ? 'opened' : c.id === 'grand-chest' ? 'grand' : 'closed'}.webp" alt="">`;
    b.setAttribute('aria-label', `${c.name}, ${st}`);
    b.title = `${c.name}: ${st}`;
    b.addEventListener('click', () => {
      if (st === 'ready') openChest(c.id);
      else if (st === 'opened') showReward('Chest Opened!', 'Already collected', c.id === 'grand-chest' ? 'assets/chests/grand.webp' : 'assets/chests/opened.webp');
      else toast('🔒 Locked');
    });
    target.append(b);
  }

  $('#hud-keys').textContent = `${firstReady()}/12`;
  $('#hud-coins').textContent = String(progress.coinBalance);
  $('#island-outfit').innerHTML = outfittedCat();
}

function setModal(html, mode = 'preview') {
  // A lesson can re-render several times; keep the original map control for focus return.
  if (!root.children.length) restoreFocus = document.activeElement;
  modalType = mode;
  root.innerHTML = `<div class="modal-backdrop" id="overlay"><section class="modal-panel ${mode}" role="dialog" tabindex="-1" aria-modal="true" aria-label="${mode === 'lesson' ? 'Lesson' : mode === 'wardrobe' ? 'My Cat' : mode === 'worldmap' ? 'World Map' : mode === 'reward' ? 'Reward' : 'Dialog'}">${html}</section></div>`;
  const close = $('#close-modal', root);
  if (close) close.addEventListener('click', closeModal);
  document.body.classList.add('modal-open');
  $('.modal-panel', root)?.focus({ preventScroll: true });
}

function modalX() {
  return '<button class="close" id="close-modal" type="button" aria-label="Close">×</button>';
}

function nestedCard(html, cls = '') {
  const layer = document.createElement('div');
  layer.className = 'modal-backdrop nested';
  layer.innerHTML = `<section class="modal-panel result-card ${cls}" role="alertdialog" aria-modal="true"><button class="close nested-close" type="button" aria-label="${cls.includes('gameover-card') ? 'Back to Map' : 'Close result'}">×</button>${html}</section>`;
  root.append(layer);
  const parentPanel = $('.modal-backdrop:not(.nested) .modal-panel', root);
  parentPanel?.setAttribute('aria-hidden', 'true');
  const panel = $('.modal-panel', layer);
  panel.tabIndex = -1;
  panel.setAttribute('aria-label', cls.includes('gameover-card') ? 'No lives left' : cls.includes('correct-card') ? 'Correct answer' : 'Try again');
  $('.nested-close', layer).addEventListener('click', () => cls.includes('gameover-card') ? closeModal() : clearNested());
  panel.focus({ preventScroll: true });
  return layer;
}

function clearNested() {
  const layers = $$('.modal-backdrop.nested', root);
  layers.forEach((layer) => layer.remove());
  const panel = $('.modal-backdrop:not(.nested) .modal-panel', root);
  panel?.removeAttribute('aria-hidden');
  if (layers.length && panel) {
    // Only the current task's actions are focusable after dismissing a result.
    const target = $('#next-task:not([hidden])', panel)
      || $('#task-activity button:not(:disabled)', panel)
      || $('#close-modal', panel);
    target?.focus({ preventScroll: true });
  }
}

function closeModal() {
  clearNested();
  root.innerHTML = '';
  modalType = null;
  active.lessonId = null;
  active.lives = 3;
  updateMap();
  document.body.classList.remove('modal-open');
  // updateMap recreates stop/chest nodes; restore to the matching live control.
  const previous = restoreFocus;
  restoreFocus = null;
  const target = previous?.isConnected ? previous
    : previous?.dataset?.stop ? $(`[data-stop="${previous.dataset.stop}"]`)
      : previous?.dataset?.chest ? $(`[data-chest="${previous.dataset.chest}"]`)
        : previous?.id ? document.getElementById(previous.id) : null;
  (target || $('#world-button'))?.focus({ preventScroll: true });
}

function previewLesson(id) {
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return;
  setModal(`
    ${modalX()}
    <div class="preview-badge">Lesson Preview</div>
    <div class="preview-logo" aria-hidden="true">${lesson.icon}</div>
    <h2 class="modal-title">${esc(lesson.title)}</h2>
    <p class="preview-text">${esc(lesson.description)}</p>
    <div class="preview-facts"><span>⏱️ ${esc(lesson.duration)}</span><span>☰ ${lesson.tasks.length} tasks</span></div>
    <button class="btn" id="start-lesson">Start Lesson ▶</button>
  `, 'preview');
  $('#start-lesson').addEventListener('click', () => startLesson(id));
}

function resetQuestion() {
  active.done = false;
  active.selected = null;
  active.matchWord = null;
  active.match = {};
  active.order = [];
  active.attempts = 0;
}

function lessonHeader() {
  const lesson = curLesson();
  return `<div class="lesson-head"><h2>${lesson.icon} ${esc(lesson.title)}</h2><span class="lesson-hearts" id="lesson-hearts" aria-label="${active.lives} lives">${'❤️'.repeat(active.lives)}${'🤍'.repeat(3 - active.lives)}</span><span class="lesson-count">Task ${active.index + 1} of ${lesson.tasks.length}</span></div><div class="lesson-progress"><i style="width:${(active.index / Math.max(1, lesson.tasks.length)) * 100}%"></i></div>`;
}

function startLesson(id) {
  active.lessonId = id;
  active.index = 0;
  active.lives = 3;
  active.results = [];
  resetQuestion();
  renderLesson();
}

function renderLesson() {
  const t = curTask();
  setModal(`${modalX()}${lessonHeader()}<div class="lesson-body"><h3 class="question-title">${esc(t.title)}</h3>${t.figure ? `<div class="question-figure" aria-hidden="true">${esc(t.figure)}</div>` : ''}<div id="task-activity" style="width:100%;display:flex;justify-content:center"></div><div id="feedback" class="feedback" aria-live="polite"></div></div><div class="lesson-controls"><button class="btn" id="verify" type="button" disabled>Check</button><button class="btn green" id="next-task" type="button" hidden>Next →</button></div>`, 'lesson');
  if (t.type === 'choice') renderChoice(t);
  else if (t.type === 'match') renderMatch(t);
  else if (t.type === 'order') renderOrder(t);
  $('#verify').addEventListener('click', verifyAnswer);
  $('#next-task').addEventListener('click', nextQuestion);
  updateMap();
}

function renderChoice(t) {
  const el = $('#task-activity');
  el.innerHTML = `<div class="answers">${t.options.map((s, i) => `<button class="option" type="button" data-choice="${i}" aria-pressed="false">${esc(s)}</button>`).join('')}</div>`;
  $$('[data-choice]', el).forEach((b) => b.addEventListener('click', () => {
    if (active.done) return;
    active.selected = Number(b.dataset.choice);
    $$('[data-choice]', el).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#verify').disabled = false;
  }));
}

function drawMatch(t) {
  const el = $('#task-activity');
  const pictures = t.pairs.map((p, i) => ({ value: p[1], index: i })).reverse();
  const pairs = Object.entries(active.match);
  const numberForPicture = (index) => {
    const k = pairs.find(([, v]) => v === index);
    return k ? Number(k[0]) + 1 : null;
  };
  el.innerHTML = `<div class="match-grid"><div class="match-col">${t.pairs.map(([word], i) => `<button class="option" type="button" data-matchword="${i}" aria-pressed="${active.matchWord === i}">${esc(word)}${active.match[i] !== undefined ? ` <span class="pair-marker">${i + 1}</span>` : ''}</button>`).join('')}</div><div class="match-col">${pictures.map((p) => `<button class="option" type="button" data-matchpic="${p.index}">${esc(p.value)}${numberForPicture(p.index) ? ` <span class="pair-marker">${numberForPicture(p.index)}</span>` : ''}</button>`).join('')}</div></div>`;
  $$('[data-matchword]', el).forEach((b) => b.addEventListener('click', () => {
    if (active.done) return;
    const i = Number(b.dataset.matchword);
    active.matchWord = i;
    delete active.match[i];
    drawMatch(t);
  }));
  $$('[data-matchpic]', el).forEach((b) => b.addEventListener('click', () => {
    if (active.done || active.matchWord === null) return;
    const picture = Number(b.dataset.matchpic);
    for (const [k, v] of Object.entries(active.match)) if (v === picture) delete active.match[k];
    active.match[active.matchWord] = picture;
    active.matchWord = null;
    drawMatch(t);
  }));
  $('#verify').disabled = Object.keys(active.match).length !== t.pairs.length;
}

function renderMatch(t) { drawMatch(t); }

function drawOrder(t) {
  const el = $('#task-activity');
  const used = new Set(active.order);
  el.innerHTML = `<div class="word-builder"><div class="word-line">${active.order.length ? active.order.map((i) => `<button class="option" type="button" data-undo="${i}">${esc(t.tokens[i])} ×</button>`).join('') : '<span class="tiny-notice">Tap the words to build a sentence</span>'}</div><div class="word-bank">${t.tokens.map((v, i) => used.has(i) ? '' : `<button class="option" type="button" data-pick="${i}">${esc(v)}</button>`).join('')}</div></div>`;
  $$('[data-pick]', el).forEach((b) => b.addEventListener('click', () => {
    if (active.done) return;
    active.order.push(Number(b.dataset.pick));
    drawOrder(t);
  }));
  $$('[data-undo]', el).forEach((b) => b.addEventListener('click', () => {
    if (active.done) return;
    active.order = active.order.filter((i) => i !== Number(b.dataset.undo));
    drawOrder(t);
  }));
  $('#verify').disabled = active.order.length !== t.tokens.length;
}

function renderOrder(t) { drawOrder(t); }

function isCorrect(t) {
  if (t.type === 'choice') return active.selected === t.correct;
  if (t.type === 'match') return Object.keys(active.match).length === t.pairs.length && Object.entries(active.match).every(([a, b]) => Number(a) === Number(b));
  if (t.type === 'order') return active.order.map((i) => t.tokens[i]).join('\u0000') === t.correct.join('\u0000');
  return false;
}

function showCorrectCard() {
  const finalTask = active.index === curLesson().tasks.length - 1;
  const layer = nestedCard(`
    <div class="result-subhead">Result: Correct</div>
    <div class="result-icon">⭐</div>
    <h2>Correct!</h2>
    <p class="reward-sub">Great job!</p>
    <button class="btn green" id="modal-next-action">${finalTask ? 'Finish Lesson ★' : 'Next →'}</button>
  `, 'correct-card');
  $('#modal-next-action', layer).addEventListener('click', () => {
    clearNested();
    nextQuestion();
  });
}

function showWrongCard() {
  const hearts = `${'❤️'.repeat(active.lives)}${'🤍'.repeat(3 - active.lives)}`;
  const layer = nestedCard(`
    <div class="result-subhead">Result: Wrong</div>
    <div class="result-icon">😢</div>
    <h2>Wrong!</h2>
    <p class="reward-sub">One life lost!<br>Try again.</p>
    <p class="reward-sub" style="font-size:1rem">${hearts}</p>
    <button class="btn" id="modal-retry">Try Again ↻</button>
  `, 'wrong-card');
  $('#modal-retry', layer).addEventListener('click', clearNested);
}

function verifyAnswer() {
  if (active.done || active.lives < 1 || $('#verify').disabled) return;
  const t = curTask();
  if (isCorrect(t)) {
    active.done = true;
    active.results.push({ type: t.type, attempts: active.attempts + 1 });
    const feedback=$('#feedback'); if(feedback){feedback.textContent='⭐ Correct!'; feedback.className='feedback correct';}
    $('#next-task').hidden = false;
    $('#verify').hidden = true;
    $('#next-task').textContent = active.index === curLesson().tasks.length - 1 ? 'Finish Lesson ★' : 'Next →';
    $$('#task-activity button').forEach((b) => { b.disabled = true; });
    showCorrectCard();
  } else {
    active.lives -= 1;
    active.attempts += 1;
    $('#lesson-hearts').textContent = '❤️'.repeat(active.lives) + '🤍'.repeat(3 - active.lives);
    $('#lesson-hearts').setAttribute('aria-label', `${active.lives} lives`);
    if (t.type === 'choice') {
      active.selected = null;
      $$('[data-choice]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    } else if (t.type === 'match') {
      active.match = {};
      active.matchWord = null;
      drawMatch(t);
    } else {
      active.order = [];
      drawOrder(t);
    }
    $('#verify').disabled = true;
    const feedback=$('#feedback'); if(feedback){feedback.textContent='Wrong! Try again!'; feedback.className='feedback wrong';}
    updateMap();
    if (active.lives === 0) showGameOver();
    else showWrongCard();
  }
}

function nextQuestion() {
  if (!active.done || active.lives < 1) return;
  if (active.index === curLesson().tasks.length - 1) { finishLesson(); return; }
  active.index += 1;
  resetQuestion();
  renderLesson();
}

function showGameOver() {
  const layer = nestedCard(`
    <h2>Try Again</h2>
    <img class="reward-art" src="assets/modals/sad-cat.webp" alt="Sad kitten">
    <p class="reward-sub">You can do it!</p>
    <div class="btn-row"><button class="btn" id="retry">Play Again ↻</button><button class="btn white" id="exit-fail">Back to Map</button></div>
  `, 'wrong-card gameover-card');
  layer.id='gameover-layer';
  $('#retry', layer).addEventListener('click', () => startLesson(active.lessonId));
  $('#exit-fail', layer).addEventListener('click', closeModal);
  $('#retry', layer).focus();
}

function finishLesson() {
  const lesson = curLesson();
  const first = !hasKey(lesson.id);
  if (first) { progress.completedLessonIds.push(lesson.id); persist(); }
  // Attempt results and remaining lives are RAM-only, never part of saved progress.
  const report = { lives: active.lives, results: active.results.map((r) => ({ type: r.type, attempts: r.attempts })) };
  const mistakes = report.results.reduce((sum, r) => sum + r.attempts - 1, 0);
  active.lessonId = null;
  active.lives = 3;
  updateMap();
  showReward(first ? 'You Got a Key!' : 'Great Job!', first ? `🔑 ${firstReady()} / 12 keys` : `Completed again · ${mistakes} wrong tries`, 'assets/modals/reward-key.webp', report);
}

function showReward(title, sub, art, report = null) {
  const summary = report ? `
    <section class="lesson-summary" aria-label="Lesson results">
      <h3>Lesson Results</h3>
      <p>Lives left in this lesson: <strong>${report.lives} of 3</strong></p>
      <ol class="lesson-summary-list">${report.results.map((r, i) => `
        <li><strong>Task ${i + 1}</strong><span>Solved · ${r.attempts === 1 ? "First try" : `${r.attempts - 1} ${r.attempts === 2 ? "mistake" : "mistakes"}`}</span></li>
      `).join('')}</ol>
    </section>` : '';
  const rewardArt = report ? `<div class="reward-illustrations"><img class="reward-art" src="${esc(art)}" alt=""><div class="reward-avatar" aria-label="Your explorer cat"><img class="cat-base" src="assets/mascot/cat-wardrobe.webp" alt="Explorer kitten"><span class="outfit-overlays">${outfittedCat()}</span></div></div>` : `<img class="reward-art" src="${esc(art)}" alt="">`;
  setModal(`${modalX()}<h2>${esc(title)}</h2>${rewardArt}<p class="reward-sub">${esc(sub)}</p>${summary}<button class="btn" id="reward-continue" type="button">Continue →</button>`, "reward");
  $('#reward-continue').addEventListener('click', closeModal);
}

function openChest(id) {
  const chest = chests.find((c) => c.id === id);
  if (!chest || chestState(chest) !== 'ready') return;
  progress.openedChestIds.push(id);
  progress.coinBalance += chest.bonus;
  persist();
  updateMap();
  showReward(id === 'grand-chest' ? 'Grand Treasure!' : 'Chest Opened!', `+${chest.bonus} ${chest.bonus === 1 ? 'Coin' : 'Coins'}`, id === 'grand-chest' ? 'assets/chests/grand.webp' : 'assets/modals/chest-reward.webp');
}

function worldMap() {
  setModal(`
    ${modalX()}
    <div class="world-heading">
      <span class="world-kicker">Explore</span>
      <h2 class="modal-title">🌍 World Map</h2>
    </div>
    <div class="world-grid" aria-label="Available and upcoming worlds">
      ${worldCards.map((w, i) => `
        <button class="world-card ${i === 0 ? 'current' : 'future'}" type="button" data-world="${esc(w.id)}"
          aria-label="${esc(w.name)}, ${i === 0 ? 'current world' : 'locked, coming soon'}"
          ${i ? 'disabled aria-disabled="true"' : ''}>
          <span class="world-picture">
            <img src="${esc(w.image)}" alt="" loading="eager" draggable="false">
            ${i ? '<span class="world-lock" aria-hidden="true">🔒</span>' : '<span class="world-current-badge">Current World</span>'}
          </span>
          <span class="world-details">
            <strong>${esc(w.name)}</strong>
            <span class="world-status">${i ? '🔒 Coming Soon' : '<img src="assets/symbols/key.webp" alt=""> ' + firstReady() + ' / 12 Keys'}</span>
          </span>
        </button>`).join('')}
    </div>
    <div class="world-atlas-footer" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></div>
  `, 'worldmap');
  $('[data-world="adventure-island"]').addEventListener('click', closeModal);
}

function itemCode() { return selectedTier ? `${currentCategory}-${selectedTier}` : null; }
function itemCost() { return selectedTier ? shopCatalog[currentCategory][selectedTier - 1][1] : 0; }
function itemState() {
  const id = itemCode();
  if (!id) return 'empty';
  const owned = progress.purchasedItemIds.includes(id);
  if (owned) return progress.equippedBySlot[currentCategory] === id ? 'wearing' : 'wear';
  if (selectedTier > 1) return 'locked';
  return progress.coinBalance >= itemCost() ? 'buy' : 'insufficient';
}
function coinNoun(n) { return n === 1 ? 'Coin' : 'Coins'; }
function itemAction() {
  const st = itemState();
  return st === 'empty' ? ['No Items Yet', 'grey', true]
    : st === 'wearing' ? ['Wearing ✓', 'green', false]
      : st === 'wear' ? ['Wear', '', false]
        : st === 'buy' ? ['Buy', 'green', false]
          : st === 'locked' ? ['Locked', 'grey', true]
            : [`Need ${itemCost() - progress.coinBalance} ${coinNoun(itemCost() - progress.coinBalance)}`, 'grey', true];
}
function catProfile() {
  const names = { hats: '🎩 Hats', scarves: '🧣 Scarves', shoes: '👟 Shoes', backpacks: '🎒 Backpacks', tools: '🧭 Tools' };
  // Latest owner QA: one five-category catalogue, no redundant Shop / Inventory view.
  const tiers = [1, 2, 3];
  if (!tiers.includes(selectedTier)) selectedTier = 1;
  const tab = slots.map((s) =>
    `<button type="button" data-category="${s}" class="${currentCategory === s ? 'selected' : ''}" aria-pressed="${currentCategory === s}">${names[s]}</button>`
  ).join('');
  const cards = tiers.map((tier) => {
    const [name, price] = shopCatalog[currentCategory][tier - 1];
    const id = `${currentCategory}-${tier}`;
    const owned = progress.purchasedItemIds.includes(id);
    const equipped = progress.equippedBySlot[currentCategory] === id;
    const status = equipped ? 'Wearing' : owned ? 'Owned' : tier > 1 ? 'Locked' : 'Available';
    const locked = !owned && tier > 1;
    return `<button type="button" data-item="${tier}" data-tier-state="${locked ? 'locked' : equipped ? 'wearing' : owned ? 'owned' : 'available'}"
      class="shop-item ${selectedTier === tier ? 'selected' : ''} ${locked ? 'locked-tier' : ''}"
      aria-pressed="${selectedTier === tier}" aria-label="${esc(name)}, ${price} ${coinNoun(price)}, ${status}">
      <img src="assets/inventory/${currentCategory}/tier-${tier}.webp" alt="" loading="eager">
      ${locked ? '<span class="item-lock-mark" aria-hidden="true">🔒</span>' : ''}
      <span class="shop-item-name">${esc(name)}</span>
      <span class="price"><img src="assets/symbols/coin.webp" alt="">${price}</span>
      <span class="owned-indicator">${equipped ? '✓ Wearing' : owned ? '✓ Owned' : '&nbsp;'}</span>
    </button>`;
  }).join('');
  const [label, color, disabled] = itemAction();
  setModal(`
    ${modalX()}
    <div class="wardrobe-header">
      <h2 class="modal-title">🐱 My Cat</h2>
      <div class="shop-wallet hud-scores" aria-label="Adventure progress">
        <span class="stat-item"><img src="assets/symbols/key.webp" alt="Keys"><b>${firstReady()}/12</b></span>
        <span class="hud-rule"></span>
        <span class="stat-item"><img src="assets/symbols/coin.webp" alt="Coins"><b>${progress.coinBalance}</b></span>
      </div>
    </div>
    <div class="wardrobe-inner">
      <div class="cat-preview" aria-label="Your dressed cat">
        <div class="cat-figure">
          <img class="cat-base" src="assets/mascot/cat-wardrobe.webp" alt="Explorer kitten" draggable="false">
          <span class="outfit-overlays">${outfittedCat()}</span>
        </div>
      </div>
      <div class="shop-panel">
        <div class="category-tabs" aria-label="Item categories">${tab}</div>
        <div class="shop-grid" aria-label="Available accessories">${cards}</div>
        <button id="item-action" type="button" class="btn item-action ${color}" aria-label="${esc(label)}"
          ${disabled ? 'disabled' : ''}>${esc(label)}</button>
      </div>
    </div>
  `, 'wardrobe');
  $$('[data-category]').forEach((button) => button.addEventListener('click', () => {
    currentCategory = button.dataset.category;
    selectedTier = 1;
    wardrobeFocusTarget = `[data-category="${currentCategory}"]`;
    catProfile();
  }));
  $$('[data-item]').forEach((button) => button.addEventListener('click', () => {
    selectedTier = Number(button.dataset.item);
    wardrobeFocusTarget = `[data-item="${selectedTier}"]`;
    catProfile();
  }));
  $('#item-action').addEventListener('click', performItemAction);
  if (wardrobeFocusTarget) {
    $(wardrobeFocusTarget, root)?.focus({ preventScroll: true });
    wardrobeFocusTarget = null;
  }
}

function performItemAction() {
  const id = itemCode();
  if (!id) return;
  const st = itemState();
  if (st === 'buy') {
    if (progress.purchasedItemIds.includes(id) || progress.coinBalance < itemCost()) return;
    progress.coinBalance -= itemCost();
    progress.purchasedItemIds.push(id);
    persist();
    updateMap();
  } else if (st === 'wear') {
    progress.equippedBySlot[currentCategory] = id;
    persist();
    updateMap();
  } else if (st === 'wearing') {
    progress.equippedBySlot[currentCategory] = null;
    persist();
    updateMap();
  } else return;
  wardrobeFocusTarget = '#item-action';
  catProfile();
}

function settings() {
  setModal(`${modalX()}<h2 class="modal-title">⚙️ Settings</h2><div class="settings-links"><a class="classic-link" href="classic/index.html">Classic Lessons ↗</a><button class="btn white" id="reset-data" type="button">Reset Adventure Progress</button></div><p class="tiny-notice">Your game progress is saved in this browser only.</p>`, 'preview');
  $('#reset-data').addEventListener('click', () => {
    if (window.confirm('Reset all keys, coins and outfits on this browser?')) {
      progress = emptyProgress();
      persist();
      closeModal();
    }
  });
}

$('#world-button').addEventListener('click', worldMap);
$('#cat-button').addEventListener('click', () => { selectedTier = 1; catProfile(); });
$('#island-cat').addEventListener('click', () => { selectedTier = 1; catProfile(); });
$('#settings-button').addEventListener('click', settings);

document.addEventListener('keydown', (e) => {
  if (!root.children.length) return;
  const nested = $$('.modal-backdrop.nested', root).at(-1);
  if (e.key === 'Escape') {
    e.preventDefault();
    // A terminal game-over cannot be dismissed into a zero-life editable task.
    if ($('#gameover-layer', root)) closeModal();
    else if (nested) clearNested();
    else closeModal();
    return;
  }
  if (e.key !== 'Tab') return;
  const panel = (nested || $('.modal-backdrop:not(.nested)', root))?.querySelector('.modal-panel');
  if (!panel) return;
  const focusables = $$('button:not(:disabled),a[href]', panel)
    .filter((el) => el.isConnected && el.offsetParent !== null);
  if (!focusables.length) { e.preventDefault(); panel.focus(); return; }
  const first = focusables[0];
  const last = focusables.at(-1);
  if (!panel.contains(document.activeElement)) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});


updateMap();
if (new URLSearchParams(location.search).has('smoke')) {
  window.__kidsSmoke = { progress: () => structuredClone(progress), startLesson, showWorld: worldMap, showCat: catProfile, openChest, updateMap, forceProgress: (p) => { progress = { ...emptyProgress(), ...p }; persist(); updateMap(); } };
}
