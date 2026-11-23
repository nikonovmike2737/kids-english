# Adventure Island v1 — technical and method acceptance record
Date: 2026-11-23
Owner approval: accepted product concept, including route corrections and new production release.
Canonical: [ADVENTURE_ISLAND_APPROVED_CANON](../../docs/source-of-truth/ADVENTURE_ISLAND_APPROVED_CANON.md).

## Product checks
- [x] Getting Started top row: ENG-001/002/003 authored and unlocked, fourth locked; no inbound dashed line to the first node.
- [x] Next Level: four locked lesson nodes, left-side small chest B, right-side bridge arrival.
- [x] Final Challenge: four locked nodes, small chest C and separate grand chest on right.
- [x] UI English-only on new island, and three existing lessons usable as wide pop-up quizzes.
- [x] 3 shared lives on each attempt; wrong check no answer disclosure and costs one; correct unlocks Next.
- [x] Successful full lesson awards exactly one permanent key; replay failure keeps it; no key on individual question.
- [x] My Cat has 5 categories, 1/3/5 tier prices and one contextual button; buy/debit/equip states tested.
- [x] World Map has 3 destinations, with second and third intentionally locked; current returns to island.
- [x] No account, analytics, server feedback or result upload.
- [x] Original site preserved at /classic/ and freeze branch.
- [x] Browser tests and GitHub Actions pre-deploy checks succeed.
- [ ] Live production browser click-through independently certified — blocked by unavailable third-party browser agent; **not claimed**.

## Render tests
1920×1080, 1366×768, 1024×768, 390×844: no vertical page scroll and main map fits stage. Narrow layout is scaled, not a vertical lesson catalog. Production browser accessibility audit remains future scope.

## Asset review
Original image crops reviewed before release. Visual QA found incorrect reward/modal extraction and fixed three binary sprites in PR #11. Asset signatures validated in the same Pages workflow.

## Pending curricular work
9 *new full lessons* must be written, reviewed and accepted. They must not be replaced by the 9 questions already present in existing lessons.
