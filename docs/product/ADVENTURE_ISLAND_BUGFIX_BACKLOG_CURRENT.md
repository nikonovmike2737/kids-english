# Adventure Island — Visual Bugfix Register (CURRENT)
Status: **Block A fixed in code, local QA PASS; Production certification is tied to GitHub Pages deployment.**
Date: 2026-11-23. Owner annotations: screenshots 18:06:20, 18:10:31, 18:12:07, 18:18:25, 18:19:58 and 18:21:03. Comparison: earlier approved concept 16:03:44.

| ID | Severity | Defect from owner review | Fix and verification | Status |
|---|---|---|---|---|
| A1 | P0 | Cat/chests must be independent overlay sprites, not part of backdrop | Existing clean `assets/maps/adventure-island.webp` retained as backdrop; fresh transparent `cat-map.webp` rendered as independent DOM asset, and all chests remain independent images with state switching. | LOCAL PASS |
| A2 | P0 | Three tier rows not centered on usable grass | Explicit terrain-coordinate anchor map for 4 lessons + one chest per row; serpentine LTR/RTL/LTR preserved; checked desktop 1920, 1366 and tablet 1024. | LOCAL PASS |
| A3 | P0 | Chests overhang bridges / cliff edges | Introduced foot-anchored chest positioning `translate(-50%,-100%)`, reduced chest footprint, moved all four chest contact points onto upper grass, middle grass, lower grass and separate final island. | LOCAL PASS |
| A4 | P1 | Unwanted frame / side bars | Full-screen stage takes viewport width and height; removed inset, shadow and side repetition. | LOCAL PASS |
| A5 | P1 | Cropping / overflow at 1920 and tablet | Full-scene `background-size: 100% 100%`, same coordinate system for SVG and sprites; viewport test reports no horizontal or vertical scroll. | LOCAL PASS |
| A6 | P1 | Simple flat key/coin replaced approved rich-looking symbols | Updated native binary `assets/symbols/key.webp`, `coin.webp` with gold dimensional icon artwork; same paths used for HUD, lesson key badge and shop. | LOCAL PASS |
| A7 | P0 | Route dotted line leaves the actual bridges | Replaced coordinates with six explicit land/bridge paths in base image geometry; no inbound line to lesson 1; three bridge segments run along wooden planks. | LOCAL PASS |
| A8 | P0 | Cat not grounded and rectangle/stone part of cat image | Transparent standalone cat asset `assets/mascot/cat-map.webp`, positioned over lower-left rock, no baked backdrop/stone; independent outfit overlay remains. | LOCAL PASS |

## Blocks to follow as separate PR/release iterations
- **B (accepted, P0)**: hearts belong only inside an individual lesson run; remove hearts from main map and My Cat persistent HUD, leave keys/coins only; reset to three on lesson start.
- **C (P1)**: canonical lesson and reward modals: correct/wrong, four choices, heart loss and no answer reveal, close icons, result consistency.
- **D (P1)**: World Map UI to match screenshot 16:03:44 (three distinct worlds, map presentation).
- **E (P1)**: My Cat item inventory and equipment imagery, HUD consistency, one contextual action button, coin grammar.
None of B–E is represented as complete by this Block A PR.

## Regression checks completed (local pre-merge)
Headless Chromium, 1920x1080, 1366x768, 1024x768, 1280x800:
12 lesson buttons, four independent chests; no JS errors; stage exact viewport dimensions, document scroll equals viewport dimensions.
The current gameplay, key/coin persistence, inventory, `/classic/` and fallback branches have not been modified in Block A.
Production GitHub Pages status MUST be recorded after successful Actions run and public URL verification.
