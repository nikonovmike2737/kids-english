# Adventure Island — Visual QA correction
**Date:** 2026-11-23. **Scope:** production UI, no curriculum change.

## Owner screenshots and exact fixes
- **Map:** remove decorative frame; correct physical placement of three small chests and the grand chest; all route dashes follow grass and the three real bridges without floating across open water. Cat stays on its rock on the island. The first lesson remains the start node with no inbound dash.
- **Modals:** use canonical named layouts and English text: Lesson Preview → Lesson modal (4 choices) → Correct/Next or Wrong/Try Again, with final sad-cat restart, key/chest reward; centered close control with accessible label.
- **World Map:** display three visually distinct maps (Adventure Island, Mystical Desert, Rainy Forest); only the first is available.
- **My Cat:** show same 3 hearts/key/coin HUD, scaled smaller and in one row; show standalone transparent cat with no stone or scenery; replace all 15 placeholder tokens by actual illustrated item binaries; price and item name readable; exactly one contextual button; `Need 1 Coin`, `Need N Coins` for N > 1.
- **No reward regression:** 1 key per complete lesson, 3 lives per attempt, no right-answer leakage, 3 small chests once each, final chest once, purchases and outfit state persisted locally; the previous Classic site stays live at `/classic/`.

## Local Chromium acceptance
- Four viewport sizes: 1920×1080, 1366×768, 1024×768, 390×844. No document vertical scroll.
- Visual screenshots inspected for map, World Map, lesson preview, Wrong, Correct, and My Cat.
- Automated checks: 12 nodes, 4 chests, 3 accessible authored lessons, 4 answer choices, correct/incorrect modal behavior, loss of one heart, world-card locks, 3 item images all loaded, one shop action, `Need 1 Coin` grammar, purchase → Wear → Wearing, balance and state consistency. Tests pass locally with Chromium.
- Remote production smoke after deployment must be confirmed separately; GitHub Actions checks alone prove only build and publish.

## Source files
`index.html`, `assets/js/app.js`, `assets/js/data.js`, `assets/css/app.css`,
`assets/mascot/cat-wardrobe.webp`, `assets/maps/world-desert.webp`, `assets/maps/world-forest.webp`,
`assets/inventory/{hats,scarves,shoes,backpacks,tools}/tier-{1,2,3}.webp`.
