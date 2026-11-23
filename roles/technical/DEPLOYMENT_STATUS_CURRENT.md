# Kids English — Deployment Status CURRENT
Date: 2026-11-23
Owner: role/technical
Status: **Adventure Island v1 — DEPLOYED / VERIFIED**
URL: https://nikonovmike2737.github.io/kids-english/
Classic fallback: https://nikonovmike2737.github.io/kids-english/classic/

## Production commit and Action
- Current main: `7d31829ea7d3fe99e8116f41a7ae8461c78d30dc`
- Release PR #10: https://github.com/nikonovmike2737/kids-english/pull/10
- Visual hotfix PR #11: https://github.com/nikonovmike2737/kids-english/pull/11
- Final Pages workflow #9: https://github.com/nikonovmike2737/kids-english/actions/runs/45178331406 — **SUCCESS**; validate JS and asset binary signatures: PASS; artifact upload: PASS; Pages deployment: PASS.
- External public fetch verified Adventure Island title and classic old-page title after final deploy.
- Prior immutable rollback branch: `release/classic-pre-island-2026-11-23` at `5a1bc670762c0e7ef73b78b4176bc068894cc846`. Also exposed classic mode in app Settings.

## Shipped features
- Single-screen 16:9 island map with non-scroll viewport and framed landscape on 1920×1080 and tablet.
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
