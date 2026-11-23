# Kids English — Owner Visual QA Defect Register (2026-11-23, 22:38 MSK)

**Authority:** newest owner annotations attached to this conversation, reviewed against Production SHA `bf9925c7` and approved Adventure Island canon. The latest explicit visual instruction prevails over the earlier Shop/Inventory UX illustration, **without changing progress/game economy**.

**Workflow:** one bounded technical production release per group; G1 was delivered in PR #30, G2/G3/G4 remain separate. TECH_PASS requires source-level contract, real Chromium interaction at desktop and 390px mobile, A/B/C/D/E gameplay regression and postdeploy hosted public-site smoke. Screenshots must be compared to owner references; no claim of owner visual acceptance unless explicitly signed off.

| Group | GitHub | Priority | Scope | Source screenshots | State |
|---|---|---|---|---|---|
| **G1 — Wardrobe interface** | [#26](https://github.com/nikonovmike2737/kids-english/issues/26) | P0 | My Cat composition, tabs, cards, sizing, price, locked state, single action | 22:10:20, 22:14:39, 22:15:18, 22:15:56, 22:16:30 | **DEPLOYED · TECH_PASS · owner visual sign-off pending** |
| **G2 — Inventory artwork** | [#27](https://github.com/nikonovmike2737/kids-english/issues/27) | P0 | Replace 15 placeholder item graphics with original, consistent, rich 3D transparent art; test outfit anchoring on cat | 22:10–22:16, 22:33:28, 22:34:47 | IMPLEMENTED IN PR #32 · CI/owner acceptance pending |
| **G3 — Island composition** | [#28](https://github.com/nikonovmike2737/kids-english/issues/28) | P1 | Chests, independent sprites, lesson anchors, row signs, bridge routes, leftward cat placement | 22:18:33, 22:29:23 | OPEN |
| **G4 — Key reward** | [#29](https://github.com/nikonovmike2737/kids-english/issues/29) | P1 | Polished key/cat reward art; remove overly dense Lesson Results panel as annotated, retain actual award logic | 22:29:23 | OPEN |

## G1 — acceptance table (first group; one PR + one Pages deployment)

| ID | User-visible defect | Acceptance criterion | Test evidence |
|---|---|---|---|
| G1-01 | Shop/Inventory segmented switch is unnecessary; owner says «убрать, только доступные категории ниже, никакого инвентаря нет» | No Shop/Inventory header switch; **five** category buttons directly below My Cat header; existing purchased item progress retained and shown as owned/worn state | DOM test: 0 `[data-shop-view]`, 5 `[data-category]` |
| G1-02 | Cat is too far right in the preview area | Cat graphic visually centered within left panel with clear safe margins; no clipping at desktop/mobile; equipped image layers remain aligned | Playwright bounding-box geometry and screenshots at 1280×800 and 390×844 |
| G1-03 | Item images are too small, surrounded by tall empty cards | Three equally sized cards with product occupying large **upper portion**, title + price below, no large dead vertical gaps | Test computed element geometry; card-to-art ratio, no horizontal overflow |
| G1-04 | Coin prices tiny, icon illegible, repeated prices | Price badge with larger actual gold-coin symbol and legible value in each card; selected-item duplicate strip removed | Test price icon native dimensions, no `.shop-selected`, price labels in three cards |
| G1-05 | Locked cards visually indistinct; tiny lock below price | Tier 2/3 whole-card soft secondary tint, subdued recognizable art and obvious translucent large lock overlay; card still selectable to show single disabled `Locked` action | Test locked-card class, disabled contextual action, graphics still loaded |
| G1-06 | One contextual button placement inconsistent when category changes | Exactly one `#item-action`; fixed bottom position, Buy/Need N Coin(s)/Locked/Wear/Wearing contract unchanged; keyboard focus restored after selection, no false purchase | Browser replay on 5 categories and rich purchase state; 23 native contracts and C/D/E E2E |
| G1-07 | UI crowds edge, typography and category labels | Labels English-only; readable categories at 1280, 1024, 390; modal and cards fit, can scroll vertically if necessary, never horizontally | Browser geometry, no uncaught errors or non-GET requests, Classic remains reachable |

**Non-goals in G1:** generating/replacing actual 15 inventory binaries (P0 G2), map/chests/route/cat position **on island** (G3), final key reward modal (G4). Existing item photos are used during G1 so layout changes are testable and deployable independently; do not mark G2 PASS until all new image assets are actually published and visually checked.

## G2 — engineering acceptance gate (PR #32)
| ID | Mandatory technical evidence | Status before postdeploy QA |
|---|---|---|
| G2-01 | All 15 old flat items replaced by distinct 256×256 native 3D WebP binaries; SHA-256 checks match manifest | Implemented, CI pending |
| G2-02 | Each native item has an alpha flag and actual transparent pixels (including corners), no white rectangular image matte | Implemented, browser alpha QA pending |
| G2-03 | Transparent accessory-free cat replaces baked-in hat/backpack/tool on map, wardrobe, reward (otherwise duplicates) | Implemented, browser QA pending |
| G2-04 | Backpack belongs behind cat; hat/scarf/shoes/tool above cat; item layers decode and scale to responsive view | Implemented, screenshot QA pending |
| G2-05 | Five categories × three tiers, same 1/3/5 coin prices, one button, Buy/Wear/Wearing, persistence and reward key unaffected | Implemented, regression QA pending |
| G2-06 | Existing lessons/Classic, local-only storage, no outgoing POST, no JS errors, mobile 390px and desktop screenshots | Automated pre/postdeploy evidence pending |
| G2-07 | Exactly one successful GitHub Pages release and independent real public-URL Chromium tests after deploy | Pending |
| G2-08 | Compare item appearance and dressed cat with supplied owner 3D assortment and cabinet references, record owner artistic sign-off separately | Technical comparison pending; owner approval OPEN |

**Source artifact:** [pinned G2 binary manifest](G2_ART_MANIFEST_2026-11-23.json), five groups of 3 artwork assets + neutral cat; [PR #32](https://github.com/nikonovmike2737/kids-english/pull/32) and [Issue #27](https://github.com/nikonovmike2737/kids-english/issues/27).

## G2 — art style reference and acceptance

- Source `22:33:28`: glossy expressive 3D pirate tricorne, white captain cap, violet backpack, orange boots, binoculars, spyglass. Source `22:34:47`: compact cabinet concept with 3 premium hats, visually identifiable price badges and cat dressed in coherent fashion.
- **Required distinction:** owner art is *visual reference*, not permission to copy unrelated brand designs; use original 3D toy-like accessories. Recreate 15 high-quality transparent WebPs and test alpha channel, distinct silhouettes and sizes. Three prices 1/3/5 stay canonical until owner explicitly changes economy.
- Art production is a real binary-asset step; CSS enlargement alone is **not** G2 completion.

## G3 — map acceptance

- Source `22:18:33`: move **Getting Started** label upward, adjust all node rows to actual terraces, lower/left-align Next Level and Final Challenge titles as shown, float chest sprites above ground with no baked duplicate, preserve one final grand chest. The annotated red arrows show intended direction/relative correction; they are not exact pixel coordinates and require human visual tuning.
- Source `22:29:23`: move map cat left just enough to unmask adjacent bridge; keep paws grounded, not clipped. Route dashed points should be continuous and smooth following planks, not float over water.
- Use same terrain coordinates across 1920×1080 / 1280×800 / tablet and mobile; preserve 12 lesson nodes, four chests, three authored lessons and exact serpentine topology.

## G4 — celebration acceptance

- Source `22:29:23`: owner labels `Lesson Results` area «убрать». Remove it from the large celebratory modal in this later group, not during G1. Simplify rewards to one harmonious cat + key illustration (avoid mismatched miniature and duplicated cat), remain responsive.
- Do not remove the permanent key award, quiz validation or one-key-per-full-lesson rule. Automated Block C assertions currently expect 4 result lines and must be deliberately revised in the **G4** PR.

## G1 — immutable release and acceptance evidence, 2026-11-23
- **Application PR #30:** https://github.com/nikonovmike2737/kids-english/pull/30
- **Production application SHA:** `6198b5c6a68a74b3a40ec2ce26ee7266dc3a0554`
- **GitHub Pages release:** https://github.com/nikonovmike2737/kids-english/actions/runs/45254267042 — **completed/success**. Single normal deployment, JS/assets validation and artifact publication PASS.
- **Pre-merge PR CI:** https://github.com/nikonovmike2737/kids-english/actions/runs/45253956678 — **SUCCESS**, 30/30 native contract tests + local Chromium A/B/C/D/E replay, including G1 UX and mobile geometry.
- **Independent hosted Production Chromium:** https://github.com/nikonovmike2737/kids-english/actions/runs/45254355140 — **SUCCESS**, 9 A/B/C lesson+Classic checkpoints and 7 D/E/G1 wardrobe+world checkpoints. Checks include live category switching, three cards/two locks, price icon, centered cat, single action, buy/wear/reload, no horizontal overflow, no JS errors, no non-GET requests.
- **Screenshots reviewed directly by technical partner:** https://github.com/nikonovmike2737/kids-english/actions/runs/45253919818/artifacts/14855343940 — desktop 1280 and mobile 390; after initial self-QA identified excessive empty card area and blank mobile modal footer, revised CSS and geometry assertions and re-reviewed actual screenshots from final PR. Owner artistic approval remains unclaimed.
- **G1 status: TECH_PASS / DEPLOYED / HOSTED_E2E_PASS.** Owner visual review remains open; issue #26 should not be closed until that confirmation.
- **G2 P0:** generated 15 original glossy 3D accessory image candidates from owner reference. Candidates are **not deployed in GitHub**, not artistically approved, and current G1 screenshot still uses older flat binary artwork. Keep issue #27 OPEN; full binary replacement + visual alpha/overlay QA required in its own release.
- **G3 and G4** remain OPEN and untouched in this release. No scoring, currency, key, lesson, map geometry, chest or reward logic changed.
