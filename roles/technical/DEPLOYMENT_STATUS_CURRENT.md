# Kids English — Deployment Status CURRENT
Date: 2026-11-23
Owner: role/technical
Status: **Adventure Island v1 — DEPLOYED / VERIFIED**
URL: https://nikonovmike2737.github.io/kids-english/
Classic fallback: https://nikonovmike2737.github.io/kids-english/classic/

## Production commit and Action
- **Current Production application/tree SHA:** `e49e168e519d70903d1af0968b43c93fa530c94a` (G4 key celebration PR #37, Pages SUCCESS #45269141023). Earlier entries below are historical.
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

## Block C — deployed canonical lesson and reward modals (2026-11-23)
- **Production PR #19:** https://github.com/nikonovmike2737/kids-english/pull/19
- **Production SHA:** `59e9d60c0700ef460ac26a04be2c6953fe6591cf`
- **PR CI:** https://github.com/nikonovmike2737/kids-english/actions/runs/45221634938 — SUCCESS
- **Pages Action #13:** https://github.com/nikonovmike2737/kids-english/actions/runs/45221739204 — SUCCESS, including published artifact; runs `node --check` and all 15 B+C native contract tests.
- Canonical Preview → Lesson → Correct/Wrong → Next/Retry → Reward flows; 4-option choices, no-hint Check, shared three hearts, gameover sad cat.
- Separate accessible close button on stacked result overlays; keyboard focus trapped in topmost dialog and restored to map opener on exit, including rebuilt nodes. Escape from Game Over exits to map instead of exposing a dead lesson.
- Reward includes a RAM-only result per each of four solved tasks, mistake counts, and the remaining lives for that particular attempt. **No heart icons outside lesson**. Local persistence remains only keys/coins/inventory; answer keys and individual replies not stored.
- Mobile results card can scroll. No changes to curriculum, World Map (D), wardrobe (E), assets or Classic.
- Independent HTTP GET of homepage and /classic: PASS (correct page titles). Follow-up **real Chromium hosted production click-tests PASS** in PR #21 / run #45223178696: full ENG-001 lesson, wrong/correct, match/order, key, hearts, gameover, restart, focus/Escape, 390px mobile, Classic, zero JS errors/non-GET requests. 15 static Node tests additionally pass. External third-party browser agent has insufficient funds, but GitHub Actions ran its own real browser E2E. Owner manual visual acceptance remains pending.
- Next distinct product release: **D**, then **E**; keep A/B/C owner acceptance open until explicitly confirmed.

## Block C follow-up — actual local and public Production browser E2E PASS (2026-11-23)
- Verification PR [#21](https://github.com/nikonovmike2737/kids-english/pull/21), test-only merged commit `a6fd09da8ed963a7f59817f8a6e5affa38c54790`.
- [CI run #45223178696](https://github.com/nikonovmike2737/kids-english/actions/runs/45223178696) SUCCESS; Ubuntu 24.04 + Playwright Chromium, 15/15 Node B/C static contracts, **9 browser checkpoints locally + 9 against public Production**.
- Browser checked every task type in ENG-001, one wrong then correct, remaining heart carried to end, full lesson result for all four tasks, key credit exactly once, failed replay and restart, close/Escape/focus, mobile 390px, Classic route, no runtime exceptions or non-GET requests.
- This upgrades automated browser evidence from NOT VERIFIED to **E2E PASS**. Do not claim owner visual approval (screenshots/proportions) without explicit sign-off.
- **Correction:** the test-only PR #21 did trigger the Pages workflow, because `tests/**` is included in its site path filter. [Pages Action #14 (45223346682)](https://github.com/nikonovmike2737/kids-english/actions/runs/45223346682) SUCCESS published tree `a6fd09da8ed963a7f59817f8a6e5affa38c54790`. No game JS/CSS changed from Block C app commit `59e9d60c0700ef460ac26a04be2c6953fe6591cf`. Documentation-only PRs #22 and this one do not trigger Pages.

## Combined D+E Production — DEPLOYED / HOSTED E2E PASS (2026-11-23)
- Owner-directed **one-pass combined release PR #24**: https://github.com/nikonovmike2737/kids-english/pull/24 ; SHA `bf9925c7e1659f00bf0438390d81e40a448f5d17`.
- **One successful Pages workflow run #45228530252**: https://github.com/nikonovmike2737/kids-english/actions/runs/45228530252 — SUCCESS, deployed the exact production application revision above.
- **PR regression #45228152015**: https://github.com/nikonovmike2737/kids-english/actions/runs/45228152015 — SUCCESS, 23/23 Node tests, local C and D/E browser interaction checks, hosted C regression, responsive screenshot artifact #14846765726.
- **Independent post-release browser QA #45228626645**: https://github.com/nikonovmike2737/kids-english/actions/runs/45228626645 — SUCCESS, all existing lesson/Classic browser steps plus actual hosted D/E shop/world interaction steps on deployed URL.
- D World Map: three distinct original illustrated preview thumbnails, one playable/current Adventure Island, two genuinely locked future worlds, accessible labels and responsive atlas layout.
- E My Cat: 5 categories × 3 tiers with original WebP product art; Shop & owned-only Inventory; item sprites mounted over the map cat, wardrobe cat and successful-lesson reward cat. One contextual action, dynamic singular/plural, no global hearts.
- Currency/achievements: buying once debits exact cost and persists ownership without auto-equip; Wear / Wearing/unwear free; worn items and balance survive reload. LocalStorage remains anonymous achievements only.
- Verification fixtures are **isolated browser contexts**, no user state, no accounts, no server answer submissions. Real QA also verified no outgoing POST or uncaught JS exceptions. All three authored lessons, original 3-life logic, 12 route slots/chests and /classic untouched.
- Public main and Classic routes externally retrieved. Owner visual/artistic approval **still pending**, and new lessons/worlds still require independent METHOD_PASS.
- This documentation-only update is not a new application/Pages deployment.

## Owner visual G1 — independent live release PASS, 2026-11-23
- G1 wardrobe/card visual changes: removed Shop/Inventory segmented switch; retained 5 direct categories, 3 item cards, local owned/worn states and one context CTA. Centered figure, resized item images/coins, fully muted locked cards and oversized lock; removed duplicate detail row and excess empty desktop/mobile space.
- PR [#30](https://github.com/nikonovmike2737/kids-english/pull/30), production SHA `6198b5c6a68a74b3a40ec2ce26ee7266dc3a0554`.
- Pages [run 45254267042](https://github.com/nikonovmike2737/kids-english/actions/runs/45254267042) **SUCCESS**; hosted public-site Chromium [run 45254355140](https://github.com/nikonovmike2737/kids-english/actions/runs/45254355140) **SUCCESS**, 9 lesson/Classic + 7 wardrobe/world checks.
- 30/30 Node contracts in PR, desktop/mobile screenshots actually reviewed by technical partner and geometry assertions extended for vertical dead space. Actual screenshots are attached to PR CI Artifacts.
- **Owner artistic sign-off pending**. New inventory binary illustrations G2 (#27), map G3 (#28) and reward G4 (#29) remain OPEN. G1 release did not change source teaching, progress schema, key/chest economy or older 15 item binaries.

## Owner visual G2 — verified binary art release (2026-11-23)
- G2 P0 source issue #27; [PR #32](https://github.com/nikonovmike2737/kids-english/pull/32) merged to main, production commit `9fd1f0b2ccd8dde2ab95a42a5bd1a7e0317be58e`.
- [Pages SUCCESS #45262374460](https://github.com/nikonovmike2737/kids-english/actions/runs/45262374460) published all 15 new real 3D transparent item WebPs (256×256) and the new transparent accessory-free kitten (1024×936). SHA-256 source: [G2 asset manifest](../docs/product/G2_ART_MANIFEST_2026-11-23.json).
- [Pre-merge CI SUCCESS #45261967812](https://github.com/nikonovmike2737/kids-english/actions/runs/45261967812): JS syntax, 38/38 Node source/binary contracts, complete older C/D/E/G1 browser regression plus G2 graphics/5-layer buying/reload/reward/browser alpha checks.
- [Post-deploy hosted Chromium SUCCESS #45262486687](https://github.com/nikonovmike2737/kids-english/actions/runs/45262486687): 9 C/Classic + 7 D/E/G1 + 7 G2 = **23/23** live browser checks on newly published public URL.
- [Visual QA artifact #14859529735](https://github.com/nikonovmike2737/kids-english/actions/runs/45261967812/artifacts/14859529735): actual Playwright screenshots visually checked at 1280 and 390; outfit alignment repaired via shared kitten canvas; mobile header wallet-vs-close overlap fixed before merge.
- No new network/analytics; no changes to economy/lesson keys/score or source-of-truth roles. Old mascot binaries remain in repo for rollback; all new art is local, not hotlinked.
- Owner visual/artistic acceptance still OPEN; G3 (#28) map island coordinate/chest/route visual work and G4 (#29) key reward modal redesign are not addressed by G2.

## G2R Safari + G3 terrain map — released, independent live WebKit/Chromium PASS
- Application PR [#35](https://github.com/nikonovmike2737/kids-english/pull/35), exact Pages source `c39e9338c46dad6d4c5522d1610119007127caa1`.
- [Pages deployment #45266932360](https://github.com/nikonovmike2737/kids-english/actions/runs/45266932360) **SUCCESS**; [public Chromium/WebKit acceptance #45267045055](https://github.com/nikonovmike2737/kids-english/actions/runs/45267045055) **BOTH SUCCESS** after Pages. [PR regression #45266658793](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793) **BOTH SUCCESS** including 45/45 Node contracts and complete original C/D/E/G1/G2 browser regression.
- New visual anchors/route verified at 2048×1152, 1649×928, 1280×800, 1024×768 and 390×844 by both engines; 4 native alpha-backed chests, 3 stage titles, 12 distinct buttons and 3 cubic bridge connectors. No fake unlock.
- Safari regression fixed: portrait kitten centered, fully inside neutral lavender cabinet; no island imagery in preview; equipped 3D items persist with shared anchor. Map kitten left, clear of bridge.
- [Screenshot evidence](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793/artifacts/14862143090) inspected by technical owner; source/lessons/coins/keys and classic unchanged.
- Original CSS and source layout kept clean; adapted CI to pinned Playwright container to remove apt stall. No new image assets or production data collection.
- Owner artistic sign-off for G2R/G3 still OPEN; G4 reward modal [#29](https://github.com/nikonovmike2737/kids-english/issues/29) remains OPEN.
- This docs-only update is not an application/Pages deployment.

## G4 key celebration — Production verified, 2026-11-24
- Owner issue [#29](https://github.com/nikonovmike2737/kids-english/issues/29), implementation [PR #37](https://github.com/nikonovmike2737/kids-english/pull/37), application SHA `e49e168e519d70903d1af0968b43c93fa530c94a`.
- [Pages deploy #45269141023](https://github.com/nikonovmike2737/kids-english/actions/runs/45269141023) SUCCESS; [premerge #45268695084](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084) Chromium and WebKit SUCCESS, 49/49 native contracts; [independent hosted QA #45269242613](https://github.com/nikonovmike2737/kids-english/actions/runs/45269242613) both jobs SUCCESS.
- One large illustrated celebration with shared transparent dressable kitten, new original scalable golden key/star artwork, simple total and Continue. No Lesson Results table, wrong-attempt report or remaining lives in reward. Replay shows Great Job! and a star, no additional key. Actual complete/repeat/reload flows verified at 1649×928, 1280×800, 390×844 and 844×390 (repeat on desktop and portrait mobile). Existing quiz scoring, 3 hearts, chest/coin economy, outfits and Classic regressions PASS; no personal data network requests.
- [WebKit screenshots](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14864142682) manually reviewed at 1649×928 and 390×844, with replay screenshot checked at desktop. [Chromium visual artifacts](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14863568743).
- G1, G2, G2R, G3 and G4 technical delivery complete. Owner visual acceptance remains pending; no claim that owner has approved screenshots. No new lessons unlocked. Nine additional full lessons remain methodologist scope.
