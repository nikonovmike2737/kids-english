# TECH — three hearts / no-hint cards, acceptance evidence
Date: 2026-11-23
Branch: tech/three-hearts-no-hints-2026-11-23
Reference: docs/source-of-truth/GAMEPLAY_CANON.md and docs/methodology/QUESTION_DESIGN.md.

## Changes
- Shared 3 lives per lesson, displayed as hearts on every task; every failed full Check consumes exactly one, successful Check consumes none.
- All choice/match/order cards explicitly use Check; Next is hidden until a correct answer.
- Wrong submissions show only generic wrong/retry message, never reveal correct choice, order, pair or explanation; edit and re-check same task.
- Matching pairs are not evaluated during selection; the entire set is checked once.
- Zero lives opens modal with 😿 and restart, restoring 3 lives and first question.
- Removed misleading cues: ENG-002-Q02 duplicate 🏊 stimulus in Swim picture choice; ENG-002-Q01 jumping kangaroo; ENG-001-Q02 redundant tired emoji; ENG-003-Q02 duplicate cat emoji from heading.
- Preserved original images, branding, local-only logic and lack of telemetry/storage.

## Local automated Chromium / Playwright result
- 390 px and 1280 px: ENG-001, ENG-002, ENG-003 all 4/4 correct, no JavaScript exceptions, no external network requests and no width overflow.
- Choice: 3 wrong Check events → lives 2 → 1 → 0; no answer leak; restart → 3 hearts and Q1.
- Match: deliberately swapped pair mapping triggers exactly one lost life, no pair hint; correcting all pairs allows Next without further life loss.
- Order: deliberately wrong full word sequence triggers exactly one lost life, no correct-order disclosure; retry and correct allows Next.
- Per-task successful results are shown with number of previous mistakes and remaining hearts.
Status: TECH_CODE_PASS + TECH_DEPLOY_PASS. GitHub Pages workflow #6 completed with success, commit `3a084b3ba3d7dd8f58742c34f5e359fd4a8f836d`; external public URL opened and rendered all three lessons. Live click-by-click browser test unavailable due external browser-service limitation; local Chromium covered click-by-click cases.
