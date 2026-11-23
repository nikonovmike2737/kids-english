# Kids English — Deployment Status CURRENT
Date: 2026-11-23
Owner: role/technical
Status: **Adventure Island v1 — DEPLOYED / VERIFIED**
URL: https://nikonovmike2737.github.io/kids-english/
Classic fallback: https://nikonovmike2737.github.io/kids-english/classic/

## Production commit and Action
- Current production release: `c9f3df44f153b4789fd23985f78134160e33a88c`
- Release PR #10: https://github.com/nikonovmike2737/kids-english/pull/10
- Visual hotfix PR #11: https://github.com/nikonovmike2737/kids-english/pull/11
- Final Pages workflow #10: https://github.com/nikonovmike2737/kids-english/actions/runs/45188625945 — **SUCCESS**; validate JS and asset binary signatures: PASS; artifact upload: PASS; Pages deployment: PASS.
- External public fetch verified Adventure Island title and classic old-page title after final deploy.
- Prior immutable rollback branch: `release/classic-pre-island-2026-11-23` at `5a1bc670762c0e7ef73b78b4176bc068894cc846`. Also exposed classic mode in app Settings.

## Shipped features
- Single-screen 16:9 borderless island map with non-scroll viewport on 1920×1080 and tablet.
- Three stages, serpentine connecting bridges, three small chests plus a separate grand chest.
- First 3 authored lessons playable in Getting Started; 4th plus other 8 honestly locked until METHOD_PASS.
- Lesson preview, large focused lesson modal, 4 answer options for choice, match/order without hints, three hearts per attempt; gameover with sad cat.
- One permanent key for first full completion of each distinct lesson. Failed replays keep keys. 4 unique lessons per small chest (+1 coin) and after 12 lessons 3 chests + grand chest (+5 coins).
- World Map: Adventure Island active, Mystical Desert and Rainy Forest locked. My Cat: 5 categories × 3 item tiers, single contextual item action and local wardrobe state.
- Anonymous achievements/equipment only in localStorage, no network result submission, no cookies, no accounts.
- 43 native production/reference binary image assets in grouped folders.

## Verification and limits
- Local headless Chromium @1920×1080, 1366×768, 1024×768, 390×844: no vertical document overflow, no JS uncaught exceptions, 12 map nodes and 4 distinct chest targets.
- Checked first lesson intro, 4 choices, wrong Check burns one heart without answer reveal, corrected Check unlocks Next.
- Three mistakes trigger sad-cat, Play Again restores 3 hearts; full 4-task lesson completion credits exactly one key; failed replay does not revoke earned key.
- Tested World Map/return, My Cat single action button, buy→wear→wearing, immediate coin update using isolated test fixture.
- Source and binary validation additionally passed on GitHub Actions.
- **Remote production click-by-click verification was unavailable because the external browser agent had insufficient service credits.** The production page and fallback were fetched successfully from outside, but end-to-end interactions on the deployed host were not independently replayed. Keep this limit visible; do not conflate local Chromium tests with production interaction certification.
- Future-world previews are nonfunctional by design. With only 3 full lessons published, no small chest can legitimately open yet.


## Latest owner visual QA release — 2026-11-23
- **Production PR #13**: https://github.com/nikonovmike2737/kids-english/pull/13
- **Production SHA**: `c9f3df44f153b4789fd23985f78134160e33a88c`
- **Successful GitHub Pages Action #10**: https://github.com/nikonovmike2737/kids-english/actions/runs/45188625945 — completed **success** (checkout, JS/binary validations, artifact upload, deploy).
- Owner screenshots routed to `docs/product/ADVENTURE_ISLAND_VISUAL_QA_FIX_2026-11-23.md`; updated the approved canon and asset manifest.
- Removed decorative map border; repositioned all chest centers onto land, including the final isolated island; rebuilt separate dotted paths on terraces and actual wood bridges instead of open water.
- Modal flow: wide four-choice lesson; canonical English Correct/Next and Wrong/Try Again overlays, final sad kitten and key/chest reward; close button aligned.
- My Cat: compact one-line 3-heart/key/coin HUD; **new transparent wardrobe kitten** with neither stone nor scenery; **15 product illustrations** across 5 categories × 3 tiers; one contextual action button; English number agreement `Need 1 Coin` / `Need 2 Coins`.
- World Map: distinct art for Adventure Island, Mystical Desert and Rainy Forest; latter two remain locked.
- **Local Chromium smoke PASS:** 1920×1080, 1366×768, 1024×768, 390×844; no vertical page scroll; 12 lesson nodes and 4 chests; modal validation, wrong/correct, one heart deduction, World Map, shop icon rendering, buy/wear/wearing, HUD synchronization. Node syntax and 18 native WebP decode checks PASS.
- **Live route HTTP verification PASS** for `/kids-english/` and `/kids-english/classic/`. Live hosted click-by-click browser tests remain unverified: do not confuse local smoke with remote interactive certification.
- Classic fallback `/classic/` and rollback branch `release/classic-pre-island-2026-11-23` remain unchanged.

## Block A — deployed map/asset correction (2026-11-23)
- PR #15: https://github.com/nikonovmike2737/kids-english/pull/15
- Production commit: `7f898d5d3b122c5656c655e71615976ef1d8158d`.
- Action #11: https://github.com/nikonovmike2737/kids-english/actions/runs/45209889216 — success, single deploy job with asset validation.
- Full-screen image stage without side frame; background is static clean terrain; kitten and chests are independent positioned assets; new dimensionally styled key and coin.
- Explicit terrain anchors for each four-node row and each chest; 3 bridge dotted paths, no inbound route to node 1.
- Local Chromium 1920×1080, 1366×768, 1280×800, 1024×768, stage and scroll geometry PASS, zero JavaScript page errors.
- Public root and /classic/ accessible via external HTTP. **Independent live visual and interaction acceptance still pending.**
- Follow-up release block B will change hearts to lesson-only; this action intentionally does not change them.

## Block B — deployed, lesson-scoped hearts (2026-11-23)
- PR #17 https://github.com/nikonovmike2737/kids-english/pull/17
- Production SHA `1dd48eac7dd4ce8a6a12d40a402664545c5d1fee`
- Pages Action #12 https://github.com/nikonovmike2737/kids-english/actions/runs/45215128388 — **SUCCESS**, native Node `tests/block-b-contract.test.mjs` 5 checks passed during predeploy stage.
- Map HUD and My Cat display **keys + coins only**. 3 hearts exist inside a lesson run, wrong Check costs one, Next preserves the remaining count, fresh lesson/restart returns to 3. Rewards and the map do not display lives. Persistent key/coin progress is unchanged.
- Production page and /classic/ reachable in independent external fetch; no heart glyph in the rendered homepage. Remote hosted interaction smoke unavailable owing to browser service balance; **do not claim live clicked verification**.
- Bug register: `docs/product/ADVENTURE_ISLAND_BUGFIX_BACKLOG_CURRENT.md`, items B1–B4 **DEPLOYED · CI PASS; owner acceptance pending**. Next C/D/E separately.
