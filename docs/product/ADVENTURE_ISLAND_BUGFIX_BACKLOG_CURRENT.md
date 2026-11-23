# Adventure Island — Visual Bugfix Register (CURRENT)
Status: **Blocks A, B, C deployed to Production, PR/Pages CI PASS; owner interactive acceptance pending. Blocks D/E remain open.**
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

## Blocks to follow as separate PR/release iterations
- **B (IMPLEMENTED in PR for Block B — P0)**: hearts belong only inside an individual lesson run. Top map and My Cat display only keys+coins; current attempts start with 3 hearts and losing a replay cannot alter permanent keys. Automated contract tests and browser smoke are required before production promotion.
- **C (P1, DEPLOYED, CI PASS)**: canonical lesson/reward modals, correct/wrong overlays, four choices, 3-heart attempt loss with no answer reveal, accessible close icons and focus, per-task result summary. PR #19, Pages #13; independent hosted click acceptance pending.
- **D (P1)**: World Map UI to match screenshot 16:03:44 (three distinct worlds, map presentation).
- **E (P1)**: My Cat item inventory and equipment imagery, HUD consistency, one contextual action button, coin grammar.
Block A is already deployed. Block B is deployed via PR #17, Action #12 with five passing contract tests, and public home-URL verification. Live clickable QA remains unverified due external browser-service credit blocker; owner acceptance pending. D–E remain pending separate releases. Block C is shipped, awaiting owner UI acceptance.

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
| C1 | P1 | Preview → Lesson, 4-choice layout, explicit Check | 3 authored lessons × 4 tasks; each choice retains 4 options in 2×2; no content/answer-key edits | DEPLOYED · CI PASS |
| C2 | P1 | Correct/Wrong and stacked overlay close controls | Upper dialog has close icon with accessible label; Tab bound to topmost active dialog; Escape leaves safe state | DEPLOYED · CI PASS |
| C3 | P1 | Exactly one heart per wrong Check, no answer disclosure | Shared 3-life attempt contract retained for choice/match/order; wrong resets selection and stays on question; last heart triggers sad cat | DEPLOYED · CI PASS |
| C4 | P1 | Results omitted after full-lesson reward | Reward shows all four solved task statuses, first try/mistakes per task, and remaining **lesson-attempt** lives; RAM-only, no answer keys | DEPLOYED · CI PASS |
| C5 | P1 | Modal close/refresh focus loss | Preserve original opener through internal re-renders; restore focus to the replacement live lesson node after map rebuild | DEPLOYED · CI PASS |
| C6 | P1 | Mobile reward results clipped; regressions to inventory/key | Scroll-safe compact reward layout; key/chest idempotency preserved; Block B regression suite retained | DEPLOYED · CI PASS |

**Delivery evidence:**
- Release PR [#19](https://github.com/nikonovmike2737/kids-english/pull/19), merged into `main`.
- Production application commit: `59e9d60c0700ef460ac26a04be2c6953fe6591cf`.
- PR checks: [run #45221634938](https://github.com/nikonovmike2737/kids-english/actions/runs/45221634938), SUCCESS.
- GitHub Pages: [run #45221739204](https://github.com/nikonovmike2737/kids-english/actions/runs/45221739204), SUCCESS; validation, artifact upload and deployment succeeded.
- **15 native Node contract tests** in CI: 5 from Block B and 10 from Block C; syntax checks pass. These are source-level contract tests, not full browser interaction tests.
- Independent HTTP retrieval of public home `/kids-english/` and classic `/kids-english/classic/`: PASS; homepage title `Kids English — Adventure Island`, Classic title `Kids English — Play & Learn`.
- **Not verified:** third-party live browser click-through. Browser agent refused execution due insufficient service balance. Owner screenshots/interactive acceptance still pending. Do not claim host-level visual C acceptance from static tests or URL retrieval.
- No changes in this C release to D (World Map), E (wardrobe visual corrections), METHOD content or `classic/index.html`.

**Next:** Block D is the next technical unit. Block E follows independently. Verify owner acceptance for A/B/C separately; do not silently upgrade pending visual statuses.
