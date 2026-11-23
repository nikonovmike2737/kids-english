# Kids English — Adventure Island / Product Concept v4
**Status: PROPOSED / FOR OWNER APPROVAL. NOT CANONICAL; NOT PRODUCTION.**
Updated 2026-11-23 based on three annotated screenshots and owner review.
This document supersedes the v2 proposal **on this concept branch only**. Production `main` is unchanged until explicit approval, METHOD_PASS and TECH_PASS.

## 1. Design decision: chosen layout and language
- Take the **second, more compact island-map composition** as the visual basis: the cat is at the left; the map occupies almost all of the screen; the top-right HUD shows ❤️ hearts, 🔑 keys, 🪙 coins, and a **My Cat** action.
- **ALL visible in-game labels and buttons must be in English.** The public title is `Kids English`; the chapter subtitle is `Adventure Island`; theme signs are `Feelings`, `Move & Play`, `Animal Theatre`. Examples of labels: `Start Lesson`, `Correct!`, `Try Again`, `You Got a Key!`, `Open Chest`, `My Cat`, `Shop`, `Inventory`, `Buy`, `Equip`, `Owned`, `Coming Soon`, `World Map`. Russian remains allowed in internal method/technical documentation only.
- **No instructional side panels, rule boxes, text legends, large explanatory blurbs or storyboard strips in the real product.** The user understands through visible route, clickable icons, simple card affordances, brief feedback, inventory and chest animation. Internal accessibility `aria-label`s and brief controls are not considered unnecessary visible instruction.
- This is a design document, not implementation. Rendered illustration may contain errors (e.g. English/Russian mix, wrong route or labels); the **explicit graph and behavior below** are binding for future implementation.

## 2. Exact entities and limits
- **World** = a series of islands/locations. First world: `Adventure Island`. Potential later worlds: `Mystical Desert`, `Rainy Forest` (names provisional).
- **Island / world stage** = 3 thematic groups of 4 different lessons, with 3 small chests and one final chest on a **separate islet**. 12 successful lessons → 12 permanent keys.
- **Theme sign** above a group of 4 lesson icons identifies the **common theme** (not the lesson title). Initial three groups proposed: `Feelings` / `Move & Play` / `Animal Theatre`. The lesson's individual title is displayed only in its popover/preview.
- **Lesson** = a full micro-lesson with multiple internal questions (now typically 4). Only full successful completion awards a key. The map's 12 clickable circles represent **12 whole lessons, never 12 questions**.
- Only 3 existing lessons are actually authored: `ENG-001 Feelings`, `ENG-002 Move & Play`, `ENG-003 Animal Theatre`. Proposed positioning: `ENG-001` first stop in group 1, `ENG-002` first stop in group 2, `ENG-003` first stop in group 3. Other **9 lessons are content gaps**, to be authored and accepted separately. Do not declare them live or reuse one lesson/question as several lessons. Stable `lesson_id` remains independent from `route_index`.

## 3. Icon nodes, previews and lesson modal
- **On the map nodes show emoji/illustrations for lesson subjects, not large digits.** Previous group mascots (happy face for Feelings, running figure for Move & Play, masks for Animal Theatre) move from the thematic signs into relevant lesson circles. Signboards contain the theme names, with minimal decoration.
- First-row conceptual subjects/icons: 😄, 😢, 😠, 😴/😨. This is **visual placeholder only** until METHOD confirms four distinct curricula. In the second row use movement/play icons, third row animal/theatre icons. No duplicate answer illustration inside question cards.
- Nodes are sequentially unlocked within a group. Completed node displays a small gold key/check marker; remains selectable for unlimited replay; unsuccessful replay never revokes that permanent key. Unauthorized/future nodes show neutral locked design; absent lesson files show `Coming Soon`, never a false playable button.
- **Desktop hover / keyboard focus** may preview a lightweight bubble with lesson name and duration. **Click/tap opens the lesson PREVIEW panel** with lesson title, duration, simple description and `Start Lesson`; this is the same deliberate two-step entry on touch and desktop. Touch should not need hover.
- Clicking Start opens a **wide, centered, foreground MODAL overlay above the map**, not a new standalone page. Desktop width roughly 88–94vw (bounded max), with a little island visible on both sides; dim/blur the remaining island. Mobile and tablet: near-full-width/modal full-screen as space requires.
- In the lesson modal retain existing complete intro/question engine: 3 hearts per whole lesson, no hint on wrong Check, repeat the same question, advance only on correct; question number and Check button. No map navigation or shop distractions inside questions. Modal must trap keyboard focus, offer clear close behavior, restore focus on exit and have accessible labels.
- If player closes an unfinished lesson, there is no new key; previously earned keys remain.

## 4. Layered modals (explicit state flow)
`map → preview → lessonModal → [completed | failed | exit]`
- Correctly finishing **all questions** → hide lesson modal → show **key reward modal above dimmed map**: joyful outfitted cat and one shining key, `You Got a Key!`; if replaying a completed lesson, celebrate without minting a second key. Continue → map, next node unlocked.
- Losing the 3rd heart → show a **sad-cat GAME OVER modal ON TOP OF the still-visible lesson modal**; the map remains far behind. The sad cat must match the new warm 3D plush toy visual style and currently worn accessories where technically possible: watery eyes, subtle rain-clouds, soft purple/orange gradients; no punitive or scary imagery. `Try Again` resets same lesson to 3 hearts, without removing permanent keys. Close/Back to Map may be offered only with unambiguous controls.
- Completing all four **distinct** lessons in a thematic group → chest becomes openable. Explicit click → **small chest modal**: sparkles, lid opens, `+1 Coin`. Once opened, state persists; bridge/next theme opens.
- After all 12 keys plus three small opened chests → final bridge unlocks → player clicks large chest on separate islet → **grand chest modal**: `+5 Coins`. First opening only. No extra instructional panels.

## 5. Sequential route — single directed path, no dead ends
```text
START → L1 → L2 → L3 → L4 → SMALL_CHEST_A → BRIDGE_A →
L5 → L6 → L7 → L8 → SMALL_CHEST_B → BRIDGE_B →
L9 → L10 → L11 → L12 → SMALL_CHEST_C → FINAL_BRIDGE →
FINAL_ISLET → GRAND_CHEST
```
- Visual dotted paths, arrows, elevation and bridges must match exactly this directed graph.
- **Every small chest has an outward visible path to the next theme**, including last chest to the final islet; **never** place the first bridge after L1 or leave a chest as a dead end.
- Only the next valid lesson/node is active for first-time progression. Previously completed lessons/groups are always replayable. For real release, do not activate a world with missing lesson content and a broken route.
- At all times completed groups and prior worlds remain accessible; navigation is a world selector / small `World Map` icon (not an instructional sidebar).

## 6. Economy / permanent achievements
- Full lesson completed for the **first** time → `+1 permanent key` for that stable `lesson_id`. Correct answers to individual questions DO NOT give keys.
- On replay: successful outcome has no additional key; unsuccessful outcome NEVER revokes the key or lock status.
- Every 4 distinct completed lessons in a theme unlock a one-time **small chest**; opening it credits `+1 coin`.
- 12 unique lesson keys + 3 opened small chests unlock the grand chest on the separate islet; it yields `+5 coins` once.
- First full world: maximum **12 permanent keys, 8 earned coins** (3 small ×1 + 5 grand). Keys are NOT spent to open chests. Spendable coin `balance` may be less than total earned; spending does not affect chest eligibility.
- Hearts: `3` per **attempt**, visible in HUD and lesson; decrease only on wrong verification. At map idle show three ready hearts (not a persistent bank). Hearts never buy keys or coins.

## 7. My Cat — local dressing room, shop and inventory
- Click mascot or `My Cat` in HUD → centered, polished profile/dressing-room panel with large 3D cat preview, equipped items visible, and same HUD hearts / keys / coins.
- No personal identity/account/sign-in: `My Cat` is a **local wardrobe/profile**, not a registered account.
- Categories, initially **5**, each has exactly **3 progressive tiers priced 1 / 3 / 5 coins**:
  1. **Hats**: basic captain's cap (1); explorer/desert headwear (3); premium pirate/captain hat (5).
  2. **Scarves & Neck**: basic scarf (1); expedition neckerchief (3); elite explorer collar (5).
  3. **Shoes**: basic sneakers (1); explorer boots (3); special terrain conqueror boots (5).
  4. **Backpacks**: basic travel pack (1); explorer pack (3); expedition pack (5). Existing purple ABC brand backpack can be the pre-equipped free standard item, distinct from the purchasable level-1 variant.
  5. **Tools**: basic compass (1); binoculars (3); premium spyglass (5).
- **Avoid inventory bloat**: 15 total catalog item definitions across the first three planned worlds, not 15 per location. First island shows mainly level-1 items; advanced tiers are visible with price and lock state or become available when world/condition unlocks. Desert/Rainy Forest can refresh the *look* of tier-2/3 items, not duplicate an entire shop every world.
- Three clear UI states: locked/insufficient coins (muted + price), affordable `Buy`, purchased `Owned` / `Equip`. Inventory tab shows only owned items; shop tab shows all filtered by category. Do not use instructional text "what you can buy"—state visually.
- Buying once charges coinBalance once, grants permanent inventory item. Equipping/unequipping is free. Category slots are mutually exclusive. Worn layers render on same cat artwork in dressing room, map and reward modal. If user changes a hat the old hat remains owned and can be re-equipped.
- Visual tech contract: keep original orange kitten identity; separate transparent asset layers aligned to cat's anchors (head, neck, feet, back, paws), use compositing both in map and dressing room, mobile-safe positioning. Do not bake one fixed dressed cat image and call it customizable.
- Initial economy: 5 small level-1 items for 5 coins total; first world generates up to 8, so an individual can buy several basics. Higher tiers await subsequent worlds; do not promise buying all 15 on one island.

## 8. World Map / future locations
- Add lightweight map-navigation icon near header, or `World Map` in world selector, **without large instruction text**.
- World selection shows beautiful small preview tiles for `Adventure Island` (current), `Mystical Desert` (future), `Rainy Forest` (future), with locks and progress badges. World names provisional; first is the only authored world.
- Unlock next world **after completing previous world's grand chest**. Previously unlocked worlds stay freely navigable, with permanent keys/chests and their completed/available lessons.
- Every world will have its own lesson pool and chest economy; global coin balance, cat inventory and equipped outfit persist across worlds. Do not clone the first world's 12 keys into another world or double-credit them.
- Stage 1 scope = Adventure Island only. World Map is optional visual shell, other worlds locked; no false promised schedules.

## 9. Technical model, privacy and compatibility
Proposed `localStorage`, no HTTP cookies; all data local to the current browser/device, no server, no analytics, no network answer submission.
```json
{
  "schemaVersion": 3,
  "worldId": "adventure-island",
  "completedLessonIds": ["ENG-001"],
  "openedChestIds": [],
  "coinsEarned": 0,
  "coinBalance": 0,
  "purchasedItemIds": [],
  "equippedBySlot": {"hat": null, "neck": null, "shoes": null, "back": "abc-basic", "tool": null},
  "unlockedWorldIds": ["adventure-island"]
}
```
- `keysEarned` must derive from unique lesson completion IDs rather than independently increment and drift. Track per-world key counts; coin ledger must be idempotent with one-time chest + purchase transaction IDs.
- No student name, age, contact, individual answers, testing events or session history stored. No cookies required.
- Local storage persists reload and browser restart, but is erased if user clears browser storage; there is **no cross-device synchronization** or real login. Later optional parental export/import; clear progress with confirmation.
- Old canonical `CONTENT_AND_PRIVACY_CANON` and `GAMEPLAY_CANON` currently prohibit persistent storage. Only change them **after explicit owner approval**, in a separate role-reviewed PR before product deployment.

## 10. Screens / storyboard for design approval
1. **World Map**: Adventure Island active with hearts/keys/coins and `My Cat`, 3 future worlds visible by small tiles only if wanted, no instruction panels.
2. **Adventure Map**: 3 themed signs over 3 rows of **four lesson icons**; chests, post-chest bridges and separate final islet. Cat wears purchased items.
3. **Lesson Preview**: pointer hover can show brief title/duration; click/tap reveals clear preview with `Start Lesson`.
4. **Wide Lesson Modal**: map faint at edges; inside all questions and three hearts, no hints on wrong checks.
5. **Key Modal**: after successful FULL lesson, cat holds key; only first completion mints new permanent key.
6. **Sad Cat Modal**: stacked on lesson, redesigned 3D plush mascot; `Try Again` restores hearts, prior permanent keys untouched.
7. **Small Chest Modal**: +1 coin once after four **lessons**.
8. **Final Chest Modal**: +5 coins once after all 12 keys + three chests, on independent islet.
9. **My Cat**: large dressed cat, coin balance, 5 category tabs, inventory/shop; tier prices 1/3/5, exactly ONE contextual action button, states `Buy / Need Coins / Wear / Wearing`.
10. **Return Later**: all permanent items, equipped assets, opened chests and completed lessons persist in same browser.

## 11. Acceptance, out of scope and approval questions
**METHOD acceptance:** 9 missing lessons created (4 tasks each or appropriate), distinct learning objectives grouped coherently under signs, no answer leak, high-quality English copy, stable `lesson_id`.
**TECH acceptance:** exact route graph and click targets, hover/click/touch contract, near-full-width accessible modal, nested sad-cat/key/chest overlays and focus management, idempotent keys/coins/shop, persistent cat layers, mobile/desktop, localStorage no telemetry; all completed units survive reload and failed replay.
**OUT OF SCOPE until further approval:** creating second/third playable world, identity/login/cloud sync, buying coins, paid upgrades, extraneous tutorials, production deployment.
**Need owner approval:** (A) Theme signs and 12-lesson curriculum mapping; (B) first island 5 categories × 3 tiers (1/3/5 coin), first world level-1 primarily; (C) next world unlock after grand chest; (D) localStorage without login and without cross-device sync; (E) English-only child-facing UI. The owner comments appear to support these; retain proposal status until explicit approval.


## 12. Owner annotation — exact UI revision v4 (2026-11-23)
This section supersedes any contradictory v3 wardrobe button illustrations and 3-choice question illustration. Explicitly approved for **concept revision only**; not an authorization to deploy.

### A. Exactly ONE main wardrobe action button
- The cat closet panel shows item thumbnails and prices; selecting a product updates one shared item-detail/action area. **Never display separate `Owned`, `Equip`, `Buy` buttons together beneath a row of products.** No independent `Owned` action button.
- Each item has **one** contextual action button reflecting the state of the *currently selected* item:

| Item state | Button label (English UI) | Visual state | On click |
|---|---|---|---|
| Not owned, enough coins, currently unlocked | `Buy` | Green, active | Debit exact item price once; persist ownership, then immediately change that SAME button to `Wear`. Do not automatically equip unless owner later requests it. |
| Not owned, insufficient coins | `Need 2 Coins` (dynamic shortage) | Grey, disabled | Nothing. Do not deduct, and do not navigate. If unavailable because of world, use `Locked` disabled. |
| Owned, not currently equipped | `Wear` | Purple, active | Equip item to its exclusive slot, instantly redraw mascot in closet and on island map; same button becomes `Wearing ✓`. |
| Owned and equipped | `Wearing ✓` | Positive / neutral selected state, clickable for removal | Toggle off (if allowed for this slot) and change the same button back to `Wear`. No separate `Remove` button. |

- Product tile may show a small checkmark when owned or fitted, but **not a third action button**. All UI copy in English. The selected item, cost, coin balance and button must agree.
- Buying must be atomic and idempotent: prevent double-tap double charge. `Wear` never costs coins. Switching items in one slot unequips the prior accessory but never destroys it. Progress persists with localStorage.
- Buttons stay in a single consistent physical location; switching product changes label/color/action in place. Give the one button an accessible text label and keyboard access.

### B. Four answer choices on the lesson quiz modal
- Every `choice` question in the lesson modal must display **four distinct answer options** as a **2 × 2** grid at desktop/tablet widths, arranged as stable rectangular touch targets. Never show three options as depicted in the previous illustration.
- On a narrow phone, the four answers remain visible and tappable without clipping; use a 2 × 2 grid if readable, otherwise 1 × 4. Do not hide an option below a fixed overlay.
- The quiz remains a wide focused modal over a dim island, with hearts, `Task 1 of 4`, stimulus image/phrase, four options, and one `Check` control. Correct choice is **not visually disclosed before verification**.
- Before a selection, `Check` is disabled; after selection, enabled. On `Check` correct: show short `Correct!` and then `Next` (or on final task, complete lesson and show key reward). On wrong: `Wrong. Try again!`, burn exactly one heart, clear the wrong selection, stay on the same task, show no answer reveal or hint. On 0 hearts, show sad-cat modal above the quiz, with a restart.
- Other question types (`match`, `order`) preserve their authored structures and no-hint contract; the **four answer option** rule applies to `choice` cards, not four pair columns for all task types.
- Audit existing `choice` content before implementation; each must have four semantically plausible, nonduplicate and methodologically accepted options. Do not add a throwaway distractor solely to reach four.

### C. Concept review acceptance checklist
- [ ] My Cat has exactly one contextual action button, never adjacent Owned+Equip+Buy buttons.
- [ ] Buy enabled/disabled according to the current balance; after purchase button becomes Wear; after wear button becomes Wearing.
- [ ] Worn outfit is immediately reflected on same cat in My Cat and island map, and survives reload.
- [ ] All `choice` quiz cards visibly show four options, including the Feelings card depicted in the updated concept.
- [ ] Incorrect verification costs one heart with **zero clue**, recheck the same task, correct verification advances.
- [ ] All child-facing labels English-only; no extra explainer/rules blocks on the live island screen.
- [ ] Game map / World Map entry and route after every chest remain as specified in v3.

**Scope:** design concept and method/technical requirements only. No GitHub Pages deployment, persistence or shop logic until the product concept is explicitly accepted.

## 13. Owner correction — strict serpentine path with chest after each row (2026-11-23)
Status: CONCEPT ONLY; no changes to production.

**Top row `Getting Started`, left to right:** START = lesson 1 at far left, with **NO inbound dashed segment, arrow or entry bridge**. The first visible dashed line starts at the **right edge of lesson 1**, then connects to lessons 2, 3, 4, and to **small chest A at the far right**. Unlock bridge A only after chest A is opened.

**Middle row `Next Level`, right to left:** bridge A arrives at the **right edge of the middle row** and connects to lessons 5, 6, 7, 8 in right-to-left order. **Small chest B must be at the far LEFT of all four lesson circles**, after lesson 8. Never put chest B to the right of lesson 5. Open chest B, then bridge B descends from the LEFT of chest B to the far left of the bottom row.

**Bottom row `Final Challenge`, left to right:** bridge B arrives at lesson 9 on the **far left**, then lessons 10, 11, 12, then **small chest C at far right**. When small chest C is opened, a clearly visible **third outbound bridge** goes further right to a **separate final islet** containing the **GRAND chest**; small chest C and the grand chest are visually and logically distinct objects.

```text
 TOP:         START L1 → L2 → L3 → L4 → CHEST A
                                                ↓ bridge A
 MID:         CHEST B ← L8 ← L7 ← L6 ← L5 ←─────┘
              ↓ bridge B
 BOTTOM:      L9 → L10 → L11 → L12 → CHEST C
                                           ↓ outbound bridge
                                     FINAL ISLET → GRAND CHEST
```

**No inbound path into the starting node.** No bridge before the preceding chest, no duplicate chest role, no broken post-chest routes. This is a binding visual topology requirement; decorative concept illustrations are not necessarily geometrically exact. All text labels used in the game are English-only. At any stage only existing fully authored lessons have themed icons; unimplemented lessons display locks. Successfully completed lesson circles get a key marker, not a checkmark. Each theme's four lessons can be completed in any order when that theme is unlocked; the dotted route is a visual progression around the group, not enforced sequential task gating.

**Do not merge this document into main as accepted canon and do not change production assets or Pages until approved.**
