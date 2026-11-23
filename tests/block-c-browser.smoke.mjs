import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const url = process.env.KIDS_TEST_URL || 'https://nikonovmike2737.github.io/kids-english/';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [];
const posts = [];

const check = (label) => console.log('BROWSER PASS: ' + label);
const answer = async (page, index) => {
  await page.locator('[data-choice="' + index + '"]').click();
  await page.locator('#verify').click();
};
const advance = async (page) => {
  assert.equal(await page.locator('.modal-backdrop.nested.correct-card').count(), 0);
  await page.locator('#modal-next-action').click();
};

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('request', (request) => { if (request.method() !== 'GET') posts.push(request.method() + ' ' + request.url()); });

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  assert.equal(response.status(), 200);
  assert.match(await page.title(), /Kids English.*Adventure Island/);
  assert.equal(await page.locator('[data-stop]').count(), 12);
  assert.equal(await page.locator('[data-chest]').count(), 4);
  assert.equal(await page.locator('.top-controls').innerText().then((s) => s.includes('❤️')), false);
  check('public or local island loads; only keys/coins in HUD');

  await page.locator('[data-stop="1"]').click();
  assert.match(await page.locator('.modal-panel.preview').innerText(), /Lesson Preview/);
  await page.locator('#start-lesson').click();
  assert.equal(await page.locator('#lesson-hearts').innerText(), '❤️❤️❤️');
  assert.equal(await page.locator('[data-choice]').count(), 4);
  assert.match(await page.locator('.lesson-count').innerText(), /Task 1 of 4/);
  check('lesson preview and four options with three hearts');

  await answer(page, 0);
  assert.equal(await page.locator('#lesson-hearts').innerText(), '❤️❤️🤍');
  assert.equal(await page.locator('.modal-backdrop.nested').count(), 1);
  assert.match(await page.locator('.modal-backdrop.nested').innerText(), /Wrong!/);
  assert.equal(await page.locator('.modal-backdrop.nested').innerText().then((s) => s.includes('happy')), false);
  assert.equal(await page.locator('.modal-backdrop.nested .nested-close').count(), 1);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.modal-backdrop.nested').evaluate((e) => e.contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.modal-backdrop.nested').count(), 0);
  assert.equal(await page.locator('#verify').isDisabled(), true);
  check('wrong answer loses one heart; no answer hint; accessible modal focus and Escape');

  await answer(page, 1);
  assert.equal(await page.locator('#lesson-hearts').innerText(), '❤️❤️🤍');
  assert.match(await page.locator('.modal-backdrop.nested').innerText(), /Correct!/);
  await page.locator('#modal-next-action').click();
  assert.match(await page.locator('.lesson-count').innerText(), /Task 2 of 4/);
  check('Correct confirmation enables Next; lives carry across tasks');

  await answer(page, 1);
  await page.locator('#modal-next-action').click();
  assert.match(await page.locator('.lesson-count').innerText(), /Task 3 of 4/);

  for (let i = 0; i < 3; i += 1) {
    await page.locator('[data-matchword="' + i + '"]').click();
    await page.locator('[data-matchpic="' + i + '"]').click();
  }
  assert.equal(await page.locator('#verify').isDisabled(), false);
  await page.locator('#verify').click();
  await page.locator('#modal-next-action').click();
  assert.match(await page.locator('.lesson-count').innerText(), /Task 4 of 4/);

  for (const i of [2, 1, 0]) await page.locator('[data-pick="' + i + '"]').click();
  await page.locator('#verify').click();
  await page.locator('#modal-next-action').click();

  assert.match(await page.locator('.modal-panel.reward h2').innerText(), /You Got a Key!/);
  assert.equal(await page.locator('.lesson-summary-list li').count(), 4);
  assert.match(await page.locator('.lesson-summary-list').innerText(), /Task 1[\s\S]*1 mistake/);
  assert.match(await page.locator('.lesson-summary').innerText(), /Lives left in this lesson: 2 of 3/);
  assert.equal(await page.locator('#hud-keys').innerText(), '1/12');
  const stored = await page.evaluate(() => localStorage.getItem('kids-english.progress.v1'));
  assert.equal(JSON.parse(stored).completedLessonIds.length, 1);
  assert.doesNotMatch(stored, /"answers"|"results"|"lives"/);
  check('match/order succeed; four per-task results and one permanent key in reward');

  await page.locator('#reward-continue').click();
  await page.locator('[data-stop="1"]').click();
  await page.locator('#start-lesson').click();
  assert.equal(await page.locator('#lesson-hearts').innerText(), '❤️❤️❤️');
  for (let i = 0; i < 3; i += 1) {
    await answer(page, 0);
    if (i < 2) await page.locator('#modal-retry').click();
  }
  assert.equal(await page.locator('#lesson-hearts').innerText(), '🤍🤍🤍');
  assert.equal(await page.locator('#gameover-layer').count(), 1);
  assert.equal(await page.locator('#gameover-layer img[src*="sad-cat"]').count(), 1);
  await page.locator('#retry').click();
  assert.equal(await page.locator('#lesson-hearts').innerText(), '❤️❤️❤️');
  assert.match(await page.locator('.lesson-count').innerText(), /Task 1 of 4/);
  await page.locator('#close-modal').click();
  assert.equal(await page.locator('#hud-keys').innerText(), '1/12');
  check('game over and restart reset hearts without revoking earned key');

  const classic = await context.newPage();
  const classicResp = await classic.goto(url + 'classic/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert.equal(classicResp.status(), 200);
  assert.match(await classic.title(), /Kids English.*Play & Learn/);
  check('classic fallback is reachable and distinct');

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', (e) => errors.push(String(e)));
  await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.locator('[data-stop="1"]').click();
  await mobilePage.locator('#start-lesson').click();
  assert.equal(await mobilePage.locator('[data-choice]').count(), 4);
  assert.equal(await mobilePage.locator('#lesson-hearts').innerText(), '❤️❤️❤️');
  check('390px touch viewport: four options and lesson lives');
  assert.deepEqual(posts, [], 'No outgoing non-GET user-result requests are allowed');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  check('no POSTs and no uncaught JS exceptions');
} finally {
  await browser.close();
}
