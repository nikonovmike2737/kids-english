
# Adventure Island — Visual Bugfix Register (CURRENT)

**Latest owner visual acceptance (22:38, supersedes prior automated PASS for visual aspects):** [New four-group canonical register](ADVENTURE_ISLAND_OWNER_VISUAL_QA_2026-11-23_CURRENT.md) · [G1 #26](https://github.com/nikonovmike2737/kids-english/issues/26) · [G2 #27](https://github.com/nikonovmike2737/kids-english/issues/27) · [G3 #28](https://github.com/nikonovmike2737/kids-english/issues/28) · [G4 #29](https://github.com/nikonovmike2737/kids-english/issues/29). Prior A–E technical passes do **not** constitute owner approval of the visual design.

Status: **A–E technical baseline previously deployed; newer owner visual QA is OPEN — G1 + G2 + G2R + G3 + G4 DEPLOYED / hosted Chromium+WebKit E2E PASS / owner visual sign-off pending. See owner issue register linked below.**
Date: 2026-11-23. Owner annotations: screenshots 18:06:20, 18:10:31, 18:12:07, 18:18:25, 18:19:58 and 18:21:03. Comparison: earlier approved concept 16:03:44.

| ID | Severity | Defect from owner review | Fix and verification | Status |
|---|---|---|---|---|
| A1 | P0 | Cat/chests must be independent overlay sprites, not part of backdrop | Existing clean `assets/maps/adventure-island.webp` retained as backdrop; fresh transparent `cat-map.webp` rendered as independent DOM asset, and all chests remain independent images with state switching. | DEPLOYED · local QA PASS · owner review pending |
| A2 | P0 | Three tier rows not centered on usable grass | Explicit terrain-coordinate anchor map for 4 lessons + one chest per row; serpentine LTR/RTL/LTR preserved; checked desktop 1920, 1366 and tablet 1024. | DEPLOYED · local QA PASS · owner review pending |
| A3 | P0 | Chests overhang bridges / cliff edges | Introduced foot-anchored chest positioning `translate(-50%,-100%)`, reduced chest footprint, moved all four chest contact points onto upper grass, middle grass, lower grass and separate final island. | DEPLOYED · local QA PASS · owner review pending |
| A4 | P1 | Unwanted frame / side bars | Full-screen stage takes viewport width and height; removed inset, shadow and side repetition. | DEPLOYED · local QA PASS · owner review pending |
| A5 | P1 | Cropping / overflow at 1920 and tablet | Full-scene `background-size: 100% 100%`, same coordinate system for SVG and sprites; viewport test reports no horizontal or vertical scroll. | DEPLOYED · local QA PASS · owner review pending |
| A6 | P1 | Simple flat key/coin replaced approved rich-looking symbols | Updated native binary `assets/symbols/key.webp`, `coin.webp` with gold dimensional icon artwork; same paths used for HUD, lesson key badge and shop. | DEPLOYED · local QA PASS · owner review pending |
| A7 | P0 | Route dotted line leaves the actual bridges | Replaced coordinates with six explicit land/bridge paths in base image geometry; no inbound line to lesson 1; three bridge segments run along wooden planks. | DEPLOYED · local QA PASS · owner review pending |
| A8 | P0 | Cat not grounded and rectangle/stone part of cat image | Transparent standalone cat asset `assets/mascot/cat-map.webp`, positioned over lower-left rock, no baked backdrop/stone; independent outfit overlay remains. | DEPLOYED · local QA PASS · owner review pending |

## Block implementation history and final combined D/E release
- **B (IMPLEMENTED in PR for Block B — P0)**: hearts belong only inside an individual lesson run. Top map and My Cat display only keys+coins; current attempts start with 3 hearts and losing a replay cannot alter permanent keys. Automated contract tests and browser smoke are required before production promotion.
- **C (P1, DEPLOYED, CI PASS)**: canonical lesson/reward modals, correct/wrong overlays, four choices, 3-heart attempt loss with no answer reveal, accessible close icons and focus, per-task result summary. PR #19, Pages #13; independent hosted click acceptance pending.
- **D (P1, DEPLOYED / Browser E2E PASS)**: illustrated World Map with Adventure Island current and two distinct future-world images, both future worlds honestly locked; desktop/mobile atlas layout, progress and accessibility labels.
- **E (P1, DEPLOYED / Browser E2E PASS)**: 15 real item assets, illustrated wearable layers on map/closet/reward, Shop+Inventory owned-only view, keys+coins HUD, one Buy/Wear/Wearing action, dynamic coin grammar, idempotent persistent purchases.
Block A is already deployed. Block B is deployed via PR #17, Action #12 with five passing contract tests, and public home-URL verification. Live clickable QA remains unverified due external browser-service credit blocker; owner acceptance pending. D+E have now shipped **together** in PR #24 and Pages Action #15. All five technical blocks A–E are deployed; owner visual acceptance remains open.

## Regression checks completed (local pre-merge)
Headless Chromium, 1920x1080, 1366x768, 1024x768, 1280x800:
12 lesson buttons, four independent chests; no JS errors; stage exact viewport dimensions, document scroll equals viewport dimensions.
The current gameplay, key/coin persistence, inventory, `/classic/` and fallback branches have not been modified in Block A.
Production GitHub Pages status MUST be recorded after successful Actions run and public URL verification.

## Deployment evidence — 2026-11-23
- **Code/asset merge**: PR #15 — https://github.com/nikonovmike2737/kids-english/pull/15
- **Deployed application SHA**: `7f898d5d3b122c5656c655e71615976ef1d8158d`.
- **One successful Pages workflow**: https://github.com/nikonovmike2737/kids-english/actions/runs/45209889216 — GitHub Actions #11, conclusion **success**, validation steps/upload/deploy passed.
- **Public homepage confirmed reachable**: https://nikonovmike2737.github.io/kids-english/
- **Classic fallback confirmed reachable**: https://nikonovmike2737.github.io/kids-english/classic/
- Browser rendering and spatial checks were exercised locally with headless Chromium. Public-host visual click-through was not independently replayed; owner review is pending.
- **Block B release is next**: remove hearts from main map/My Cat and display hearts only within current lesson. Not included in Block A.

## Block B defect register and acceptance cases (2026-11-23)
| ID | Priority | Problem | Expected fix | Status |
|---|---|---|---|---|
| B1 | P0 | Main HUD displays three hearts, creating false cross-lesson lives | Remove hearts and divider from main header; only keys and coins visible | DEPLOYED · CI PASS · owner acceptance pending |
| B2 | P0 | Wrong answers affect HUD outside lesson and create unexplained reset on success | Remove global heart DOM update; attempt lives live only inside lesson and Wrong overlay | DEPLOYED · CI PASS · owner acceptance pending |
| B3 | P0 | My Cat HUD repeats misleading hearts | Remove hearts and divider from My Cat; match keys and coins in main HUD | DEPLOYED · CI PASS · owner acceptance pending |
| B4 | P0 | Lives return to three after key reward on map | Start every separate lesson run with three; carry reduced hearts between its tasks only; no hearts on reward/map | DEPLOYED · CI PASS · owner acceptance pending |

**Test scenarios:** (1) map no hearts with 0 or 1 key, (2) My Cat no hearts, (3) new lesson has three, (4) wrong twice leaves one, (5) correct plus Next keeps one, (6) finish with one key retains key but no life indicator outside lesson, (7) retry/new lesson reinitializes three, (8) no key loss on failed replay, (9) mobile/tablet HUD fits; (10) /classic/ is unchanged.

## Block B Production evidence — 2026-11-23
- **Release PR #17:** https://github.com/nikonovmike2737/kids-english/pull/17
- **Application release commit:** `1dd48eac7dd4ce8a6a12d40a402664545c5d1fee`
- **Pages workflow #12:** https://github.com/nikonovmike2737/kids-english/actions/runs/45215128388 — `completed/success`; source checks, **five Node block-B contract tests**, artifact publication and Pages deployment all passed.
- **Live site checked:** https://nikonovmike2737.github.io/kids-english/ — root HTML rendering shows keys and coins only (no heart glyph). **Classic** https://nikonovmike2737.github.io/kids-english/classic/ remains accessible.
- **B1–B4 code/CI PASS**: main HUD has no hearts; My Cat wallet template has no hearts; current lesson header and Wrong feedback keep attempt hearts, Start Lesson resets to 3. No progress storage migration, no changes to key/chest/reward economy.
- **Limitation:** independent remote UI click-through did not execute because the connected browser-testing provider's wallet was exhausted. The browser tests have **not** been represented as passed; owner manual visual/interaction acceptance remains needed.
- **Next separate release:** Block D — World Map. Block C shipped independently in PR #19.

## Block C defect register and Production acceptance — 2026-11-23

| ID | Priority | Defect / acceptance case | Production implementation | Status |
|---|---|---|---|---|
| C1 | P1 | Preview → Lesson, 4-choice layout, explicit Check | 3 authored lessons × 4 tasks; each choice retains 4 options in 2×2; no content/answer-key edits | DEPLOYED · CI + Browser E2E PASS |
| C2 | P1 | Correct/Wrong and stacked overlay close controls | Upper dialog has close icon with accessible label; Tab bound to topmost active dialog; Escape leaves safe state | DEPLOYED · CI + Browser E2E PASS |
| C3 | P1 | Exactly one heart per wrong Check, no answer disclosure | Shared 3-life attempt contract retained for choice/match/order; wrong resets selection and stays on question; last heart triggers sad cat | DEPLOYED · CI + Browser E2E PASS |
| C4 | P1 | Results omitted after full-lesson reward | Reward shows all four solved task statuses, first try/mistakes per task, and remaining **lesson-attempt** lives; RAM-only, no answer keys | DEPLOYED · CI + Browser E2E PASS |
| C5 | P1 | Modal close/refresh focus loss | Preserve original opener through internal re-renders; restore focus to the replacement live lesson node after map rebuild | DEPLOYED · CI PASS |
| C6 | P1 | Mobile reward results clipped; regressions to inventory/key | Scroll-safe compact reward layout; key/chest idempotency preserved; Block B regression suite retained | DEPLOYED · CI PASS |

**Delivery evidence:**
- Release PR [#19](https://github.com/nikonovmike2737/kids-english/pull/19), merged into `main`.
- Production application commit: `59e9d60c0700ef460ac26a04be2c6953fe6591cf`.
- PR checks: [run #45221634938](https://github.com/nikonovmike2737/kids-english/actions/runs/45221634938), SUCCESS.
- GitHub Pages: [run #45221739204](https://github.com/nikonovmike2737/kids-english/actions/runs/45221739204), SUCCESS; validation, artifact upload and deployment succeeded.
- **15 native Node contract tests** in CI: 5 from Block B and 10 from Block C; syntax checks pass. These source-level checks are complemented by the independent browser E2E in PR #21 (local + live Production).
- Independent HTTP retrieval of public home `/kids-english/` and classic `/kids-english/classic/`: PASS; homepage title `Kids English — Adventure Island`, Classic title `Kids English — Play & Learn`.
- **Hosted Chromium E2E PASS:** [PR #21](https://github.com/nikonovmike2737/kids-english/pull/21), [PR CI run #45223178696](https://github.com/nikonovmike2737/kids-english/actions/runs/45223178696), SUCCESS. Playwright runs identical real-click exercises both against a locally served PR tree and independently against **the public Production Pages URL**. Covered ENG-001 preview, wrong/correct choice, 3-life counter, keyboard Escape/focus, match/order to lesson completion, 4 per-task outcomes, key idempotency on failed replay, gameover/restart, 390px mobile and Classic. Zero JS exceptions/non-GET requests. The separately tried third-party browser agent was unavailable (wallet), but GitHub-hosted Chromium E2E did run successfully. Owner's manual visual acceptance still pending.
- No changes in this C release to D (World Map), E (wardrobe visual corrections), METHOD content or `classic/index.html`.

**Next:** Owner visual acceptance for A–E, then separate METHOD_PASS authoring of 9 still-locked lessons. The D/E implementation is complete; no third/fourth world falsely unlocked. Historical C information below reflects the C-only release.

### Block C live-browser proof — follow-up 2026-11-23
- [PR #21](https://github.com/nikonovmike2737/kids-english/pull/21) merged; test-only commit `a6fd09da8ed963a7f59817f8a6e5affa38c54790` (does not alter production JS or CSS).
- [GitHub Actions PR run #45223178696](https://github.com/nikonovmike2737/kids-english/actions/runs/45223178696): **SUCCESS** on pinned Ubuntu 24.04 with Playwright Chromium.
- Two independent browser smoke rounds (local PR static server and live `https://nikonovmike2737.github.io/kids-english/`): each recorded nine `BROWSER PASS` checkpoints; Node B/C 15/15; no uncaught JS errors, no non-GET network requests.
- Thus C automated browser acceptance is **PASS**, beyond source-only/URL checks. Owner visual acceptance and future-world/cat feature D/E are **not** inferred as PASS.

## Block C follow-up Pages verification deployment — 2026-11-23
- Adding test coverage in PR #21 **did trigger** the existing Pages workflow (the workflow watches `tests/**`), despite no changes to the game source files.
- Latest deployed GitHub Pages tree SHA: `a6fd09da8ed963a7f59817f8a6e5affa38c54790`; [Pages Action #14 run 45223346682](https://github.com/nikonovmike2737/kids-english/actions/runs/45223346682) completed **SUCCESS**.
- Application JS and CSS remain byte-identical to the original Block C code release `59e9d60c0700ef460ac26a04be2c6953fe6591cf`. PR #22 and this record are documentation-only and do not trigger a new Pages job.
- Browser production acceptance (run #45223178696) was performed against the already deployed Block C application before the verification-only redeploy; the app code did not change in between. Manual owner visual sign-off remains pending.

## Combined Block D + E — final Production register (2026-11-23)

| ID | Priority | Defect / expected change | Verified implementation | Status |
|---|---|---|---|---|
| D1 | P1 | World Map looked like basic repeated thumbnails rather than approved illustrated world selection | Large distinct Adventure Island, Mystical Desert, Rainy Forest pictures; active vs future style, labels, native art | DEPLOYED · local + hosted Chromium PASS |
| D2 | P1 | World gating / progress and mobile world cards | Exactly one current clickable world; two locked disabled previews; 0–12 key progress, English-only, 390px no horizontal overflow | DEPLOYED · local + hosted Chromium PASS |
| E1 | P1 | Cat outfit rendered placeholder emoji rather than actual purchased item image | Transparent individual WebP layers for purchased equipment in closet, island and reward; all five slots share asset source | DEPLOYED · local + hosted Chromium PASS |
| E2 | P1 | Shop had no owned-only Inventory mode | Shop displays 3 illustrated tiers per selected category; Inventory displays only owned items in that category, honest empty state | DEPLOYED · local + hosted Chromium PASS |
| E3 | P1 | Confusing buttons, coin labels and HUD | Exactly ONE contextual Buy / Need N Coin(s) / Locked / Wear / Wearing action; keys + coins only outside lesson | DEPLOYED · local + hosted Chromium PASS |
| E4 | P1 | Purchases, worn image and state must agree after reload | Atomic Buy charges exactly once and does not auto-equip; Wear/unwear free; equipped category exclusive; ownership, balance and apparel persist locally | DEPLOYED · local + hosted Chromium PASS |
| DE-REG | P0 | Do not break A/B/C, teaching keys, chest ledger, Classic, privacy | Existing full ENG-001 path, lives, rewards, /classic, no POST, no uncaught JS errors | DEPLOYED · local + hosted Chromium PASS |

**One product PR / one application release:**
- [PR #24](https://github.com/nikonovmike2737/kids-english/pull/24) merged; Production application SHA `bf9925c7e1659f00bf0438390d81e40a448f5d17`.
- [Pages Action #15](https://github.com/nikonovmike2737/kids-english/actions/runs/45228530252): **completed/success**. Single deployment workflow; binary/source validation, artifact upload and deploy all successful.
- [PR CI run #45228152015](https://github.com/nikonovmike2737/kids-english/actions/runs/45228152015): **SUCCESS**. **23/23 native contract tests** (5 B, 10 C, 8 D/E), 9 lesson/Classic browser checkpoints locally and on then-current Production, 7 D/E browser checkpoints locally, responsive desktop/mobile screenshots.
- [Visual QA artifact](https://github.com/nikonovmike2737/kids-english/actions/runs/45228152015/artifacts/14846765726): screenshots of World Map and My Cat at desktop/mobile, including equipped outfit.
- [Independent postdeploy hosted Chromium QA](https://github.com/nikonovmike2737/kids-english/actions/runs/45228626645): **SUCCESS** following Pages Action #15. 9 A/B/C browser checkpoints plus 7 D/E checkpoints against **new public Production URL**. Tested illustrated worlds, locks, purchase→Wear→Wearing→unwear, two live outfit overlays, owned-only inventory, reload persistence, reward dressed cat, mobile overflow, legacy Classic. No JS exceptions or non-GET requests.
- Independent public URL retrieval **PASS** for `https://nikonovmike2737.github.io/kids-english/` and `/kids-english/classic/` (correct Adventure Island / classic titles).
- No new lesson content, no changes to answer keys, no localStorage schema migration; future-world thumbnails remain non-playable.
- **Outstanding:** human owner visual acceptance to compare exact artwork composition and item placement against the earlier approved screenshot. Browser/CI success is technical acceptance, not a claim of owner artistic approval.

**Canonical next work:** 9 distinct new lessons through METHOD_PASS; owner acceptance follow-up for A–E. Do not reopen D/E implementation automatically unless a new verified defect is reported.

## New owner G1 visual-fix shipment — 2026-11-23
- Latest owner visual QA reopens earlier A–E artistic acceptance. New canonical register: [2026-11-23 G1–G4](ADVENTURE_ISLAND_OWNER_VISUAL_QA_2026-11-23_CURRENT.md).
- G1 (issue #26) source/layout fix: PR #30, SHA `6198b5c6`, [Pages SUCCESS #45254267042](https://github.com/nikonovmike2737/kids-english/actions/runs/45254267042), [hosted Chromium SUCCESS #45254355140](https://github.com/nikonovmike2737/kids-english/actions/runs/45254355140), 30/30 contracts, 9+7 browser checkpoints, desktop+mobile screenshots. G1 technical acceptance PASS; owner artistic acceptance pending.
- **Historical at G1 time:** G2, G3 and G4 were still open. G2 has since been shipped separately (see below); G3/G4 remain OPEN.

## New owner G2 original 3D inventory artwork — PRODUCTION VERIFIED, 2026-11-23
- [G2 issue #27](https://github.com/nikonovmike2737/kids-english/issues/27), [PR #32](https://github.com/nikonovmike2737/kids-english/pull/32), published application SHA `9fd1f0b2ccd8dde2ab95a42a5bd1a7e0317be58e`.
- [Pages SUCCESS #45262374460](https://github.com/nikonovmike2737/kids-english/actions/runs/45262374460); [independent hosted live Chromium SUCCESS #45262486687](https://github.com/nikonovmike2737/kids-english/actions/runs/45262486687); final [PR CI SUCCESS #45261967812](https://github.com/nikonovmike2737/kids-english/actions/runs/45261967812). 38/38 native tests + 23 live-browser checkpoints; all 16 image hashes pinned.
- All fifteen old flat item graphics replaced with real 3D alpha-backed binaries; neutral kitten with independently arranged 5 wearable layers in My Cat, map, reward. Wallet no longer overlaps mobile close control.
- Owner artistic sign-off still pending; **G3 map/chests/route/cat positioning and G4 reward composition remain OPEN.** See [canonical 4-group register](ADVENTURE_ISLAND_OWNER_VISUAL_QA_2026-11-23_CURRENT.md) for precise source evidence.

## Owner Safari G2R + Island G3 — verified Production release
- Direct owner screenshot 2026-11-23 23:48:34: [G2R #34](https://github.com/nikonovmike2737/kids-english/issues/34), cat clipped right and island image backdrop in cabinet. Both corrected in separate 1024:936 bounded centered portrait and neutral lavender gradient.
- [G3 #28](https://github.com/nikonovmike2737/kids-english/issues/28): corrected 12 lesson anchors, stage label height, 4 independent transparent chest buttons, 3 soft bridge routes with rounded dots, and leftward smaller map cat freeing bridge. Original map image retained; never silently claim it was regenerated.
- [PR #35](https://github.com/nikonovmike2737/kids-english/pull/35), app SHA `c39e9338`. [Pages SUCCESS #45266932360](https://github.com/nikonovmike2737/kids-english/actions/runs/45266932360), [premerge Chromium+WebKit CI SUCCESS #45266658793](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793), [postdeploy independent public Chromium+WebKit SUCCESS #45267045055](https://github.com/nikonovmike2737/kids-english/actions/runs/45267045055). **45/45 source contracts PASS**, all historical browser regressions PASS, 5 stage viewports independently checked.
- Owner artistic sign-off pending; [G4 #29](https://github.com/nikonovmike2737/kids-english/issues/29) next technical implementation work. No new lessons unlocked. See [canonical owner screenshot register](ADVENTURE_ISLAND_OWNER_VISUAL_QA_2026-11-23_CURRENT.md).

## G4 key celebration — Production verified, 2026-11-24
- Owner issue [#29](https://github.com/nikonovmike2737/kids-english/issues/29), implementation [PR #37](https://github.com/nikonovmike2737/kids-english/pull/37), application SHA `e49e168e519d70903d1af0968b43c93fa530c94a`.
- [Pages deploy #45269141023](https://github.com/nikonovmike2737/kids-english/actions/runs/45269141023) SUCCESS; [premerge #45268695084](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084) Chromium and WebKit SUCCESS, 49/49 native contracts; [independent hosted QA #45269242613](https://github.com/nikonovmike2737/kids-english/actions/runs/45269242613) both jobs SUCCESS.
- One large illustrated celebration with shared transparent dressable kitten, new original scalable golden key/star artwork, simple total and Continue. No Lesson Results table, wrong-attempt report or remaining lives in reward. Replay shows Great Job! and a star, no additional key. Actual complete/repeat/reload flows verified at 1649×928, 1280×800, 390×844 and 844×390 (repeat on desktop and portrait mobile). Existing quiz scoring, 3 hearts, chest/coin economy, outfits and Classic regressions PASS; no personal data network requests.
- [WebKit screenshots](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14864142682) manually reviewed at 1649×928 and 390×844, with replay screenshot checked at desktop. [Chromium visual artifacts](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14863568743).
- G1, G2, G2R, G3 and G4 technical delivery complete. Owner visual acceptance remains pending; no claim that owner has approved screenshots. No new lessons unlocked. Nine additional full lessons remain methodologist scope.
