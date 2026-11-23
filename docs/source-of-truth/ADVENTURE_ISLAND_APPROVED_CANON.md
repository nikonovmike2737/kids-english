# Adventure Island — approved product canon
**Status: APPROVED by owner, 2026-11-23.**
Source: latest reviewed Adventure Island drafts, route and UI annotations, and the owner instruction to implement in production.
Supersedes draft's “for approval” status and earlier model of keys per individual question. This is the authoritative version for the v1 island release.

## Entity hierarchy
World → 3 stages/topics → 4 distinct full lessons in each stage → multiple test questions per lesson. The published curriculum currently contains exactly **3 distinct full lessons**, all assigned to **Getting Started**: ENG-001 Feelings, ENG-002 Move & Play, ENG-003 Animal Theatre. Stop 4 and all stops 5–12 are **locked and unimplemented** until the methodologist publishes and accepts nine new full lessons. Do not confuse the 12 existing questions with 12 lessons.

Three stage titles: **Getting Started**, **Next Level**, **Final Challenge**. Each row contains 4 lessons. Within an unlocked row all **authored** lessons are independently playable in any order, even if previous authored lessons are unfinished. Completed lesson = a small key marker on the icon, never a green checkmark. Lesson icon without key = ready but unfinished. Unauthored, unready or next-stage = lock icon.

## Route: permanent, serpentine, no accidental entry path
Start (L1, no inbound dashes) → L2 → L3 → L4 → **Chest A at far right** → Bridge A down to right of next row → L5, L6, L7, L8 **right to left** → **Chest B at far left** → Bridge B down to left of third row → L9, L10, L11, L12 **left to right** → **Chest C at right** → final bridge → separate **Grand Chest on a small island to the right**. Bridges begin after each preceding chest; never before. The path is decorative order, **not** a requirement to finish lessons strictly left-to-right: all ready lessons in the current unlocked stage can be chosen in any order.

## Rewards and persistence
- Every attempt of a full lesson starts with three hearts. Each wrong complete Check burns exactly one; no hints; correct unlocks Next; three mistakes show a sad-cat overlay atop the lesson with Play Again. No personal answers are stored or transmitted.
- First-time success across **all tasks of one lesson** mints **one permanent key** for its stable lesson ID. No key after a single question; repeated success doesn't duplicate keys; losing a replay doesn't remove existing keys.
- Each of 3 small chests becomes openable only when its group contains **four different successfully completed, authored lessons**. First opening grants **+1 coin** and unlocks the next row; permanent.
- The grand chest requires 12 permanent lesson keys and all 3 small opened chests, and grants **+5 coins exactly once**. Thus first complete island yields 12 keys and 8 total earned coins. Keys are not spent. Spending coins on outfits reduces only wallet balance, never unlocking eligibility.
- The v1 progress schema stores only *anonymous achievements and outfit IDs* in browser `localStorage`: completed lesson IDs, opened chest IDs, purchased item IDs and equipped slots, earned/spendable coin accounting. No names, contacts, individual answers, online analytics, cookies or backend. Clearing the browser's site data can erase this progress; there is no cross-device sync.

## Interaction and UX
- Desktop/tablet: map fully contained inside a fixed 16:9 viewport stage **without a decorative border**; full-width at 1920×1080, no vertical document scroll. Leftover aspect-ratio space shows uninterrupted map scenery, never white margins. Mobile landscape is supported with scaled stage; the map is not a vertical feed.
- Hover/focus lesson node gives lesson name and duration. Click/tap opens preview → Start Lesson opens near-full-width modal over dimmed map, using the existing 4-task material and three-heart no-hint mechanism.
- Every choice question has 4 options in 2×2 layout. Matching/order cards use their own mechanics. Correct → Next; Wrong → retry same question after loss of one life; no revealing right answer. Finish entire lesson → lesson modal closes → reward modal over map.
- Error state after final heart: a new sad-cat overlay **above** question modal, with restart; permanent keys unchanged.
- World Map entry remains visible in header, displaying Adventure Island (active), Mystical Desert and Rainy Forest (locked preview); returning to Adventure Island works.
- My Cat entry remains in HUD and via mascot. The local wardrobe has hats, scarves, shoes, backpacks, tools; three tiers each priced 1/3/5 coins. **Exactly one contextual action button**: Buy, Need N Coins/Locked, Wear, Wearing ✓. Buying is once and never auto-equips, equipping is free; accessories appear on the cat on both map and wardrobe. Later worlds may unlock higher tiers, but the first island mainly offers the tier-1 catalog.
- All **child-facing** strings on the new island are English-only, including modal results and item actions; no instructional rule panels on the main map. Adult-only source docs can remain Russian. The preserved classic version is a separate legacy view and does not silently overwrite the new UI language rules.

## Release and rollback
- Last known-good prior production tree stays pinned on branch `release/classic-pre-island-2026-11-23` at `5a1bc670762c0e7ef73b78b4176bc068894cc846`.
- Exact classic HTML is also published at `/classic/`; a small `Classic Lessons` link is accessible in the new site's settings.
- Production can be rolled back through a revert PR to main after verifying the Pages deployment and preserved classic route.
- Stage assets are grouped in `docs/product/ASSET_MANIFEST.md`; the canonical site entrypoint is root `index.html`.

## Methodology and limits
No invented questions or fake links for lessons 4–12. METHOD_PASS required for each newly authored full lesson before unlocking its icon. Keep original 3 English lessons intact in learning intent; ensure new wording does not reveal correct answer in question. TECH_PASS required for hearts, reward idempotency, storage, shop, map and hover/tap modals. Same approved mechanics will support later worlds after separate review.

## Owner visual-acceptance addendum — 2026-11-23
The product owner also requires: (1) all three small chests physically grounded on upper/middle/lower grass with the grand chest on the distant grassy islet, (2) dashed route segments following **actual wooden bridges** and never floating across water or extending past bridge edges, (3) no decorative outer stage frame, (4) canonical English modal flows for Lesson Preview, 4-choice Lesson, Wrong, Correct, key and chest rewards, (5) the dressing room cat without stone or landscape fragments, (6) recognizable product illustrations for all five inventory categories and three tiers, (7) a **compact single-line** My Cat hearts/keys/coins status consistent with the map HUD, and (8) grammatical dynamic coin labels (`Coin` vs `Coins`). Source details and assets are registered in `docs/product/ASSET_MANIFEST.md`.
