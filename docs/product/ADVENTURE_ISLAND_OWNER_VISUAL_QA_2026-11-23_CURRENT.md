# Kids English — Owner Visual QA Defect Register (2026-11-23, 22:38 MSK)

**Authority:** newest owner annotations attached to this conversation, reviewed against Production SHA `bf9925c7` and approved Adventure Island canon. The latest explicit visual instruction prevails over the earlier Shop/Inventory UX illustration, **without changing progress/game economy**.

**Workflow:** one bounded technical production release per group; G1 was delivered in PR #30, G2 in PR #32, G2R Safari regression and G3 scene geometry are deployed and independently browser-verified; G4 is now deployed and independently browser-verified; all visual groups await owner final visual sign-off. TECH_PASS requires source-level contract, real Chromium interaction at desktop and 390px mobile, A/B/C/D/E gameplay regression and postdeploy hosted public-site smoke. Screenshots must be compared to owner references; no claim of owner visual acceptance unless explicitly signed off.

| Group | GitHub | Priority | Scope | Source screenshots | State |
|---|---|---|---|---|---|
| **G1 — Wardrobe interface** | [#26](https://github.com/nikonovmike2737/kids-english/issues/26) | P0 | My Cat composition, tabs, cards, sizing, price, locked state, single action | 22:10:20, 22:14:39, 22:15:18, 22:15:56, 22:16:30 | **DEPLOYED · TECH_PASS · owner visual sign-off pending** |
| **G2 — Inventory artwork** | [#27](https://github.com/nikonovmike2737/kids-english/issues/27) | P0 | Replace 15 placeholder item graphics with original, consistent, rich 3D transparent art; test outfit anchoring on cat | 22:10–22:16, 22:33:28, 22:34:47 | **DEPLOYED · TECH_PASS · HOSTED E2E PASS · owner visual sign-off pending** |
| **G2R — Safari wardrobe regression** | [#34](https://github.com/nikonovmike2737/kids-english/issues/34) | P0 | Entire kitten fits centered inside neutral, non-island backdrop at desktop and mobile; verified in Chromium/WebKit | Safari 23:48:34 | **DEPLOYED · TECH_PASS · OWNER VISUAL SIGN-OFF PENDING** |
| **G3 — Island composition** | [#28](https://github.com/nikonovmike2737/kids-english/issues/28) | P1 | Independent chests, lesson anchors, stage titles, three cubic bridges, leftward kitten | 22:18:33, 22:29:23 | **DEPLOYED · TECH_PASS · OWNER VISUAL SIGN-OFF PENDING** |
| **G4 — Key reward** | [#29](https://github.com/nikonovmike2737/kids-english/issues/29) | P1 | Polished key/cat reward art; remove overly dense Lesson Results panel as annotated, retain actual award logic | 22:29:23 | **DEPLOYED · TECH_PASS · HOSTED E2E PASS · owner visual sign-off pending** |

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
| G2-01 | All 15 old flat items replaced by distinct 256×256 native 3D WebP binaries; SHA-256 checks match manifest | **PASS:** CI 45261967812 |
| G2-02 | Each native item has an alpha flag and actual transparent pixels (including corners), no white rectangular image matte | **PASS:** Chromium 45262486687 |
| G2-03 | Transparent accessory-free cat replaces baked-in hat/backpack/tool on map, wardrobe, reward (otherwise duplicates) | **PASS:** Chromium 45262486687 |
| G2-04 | Backpack belongs behind cat; hat/scarf/shoes/tool above cat; item layers decode and scale to responsive view | **PASS:** desktop/mobile visual review + browser geometry |
| G2-05 | Five categories × three tiers, same 1/3/5 coin prices, one button, Buy/Wear/Wearing, persistence and reward key unaffected | **PASS:** 38/38 + hosted regressions |
| G2-06 | Existing lessons/Classic, local-only storage, no outgoing POST, no JS errors, mobile 390px and desktop screenshots | **PASS:** CI + hosted browser |
| G2-07 | Exactly one successful GitHub Pages release and independent real public-URL Chromium tests after deploy | **PASS:** Pages #45262374460 + hosted #45262486687 |
| G2-08 | Compare item appearance and dressed cat with supplied owner 3D assortment and cabinet references, record owner artistic sign-off separately | Technical partner visual review PASS; owner artistic approval OPEN |

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
- **Historical at G1 release:** at that moment G2 candidate images had not yet been deployed. Superseded by the separate G2 production record below; only owner artistic approval remains open.
- **G3 and G4** remain OPEN and untouched in this release. No scoring, currency, key, lesson, map geometry, chest or reward logic changed.

## G2 shipped evidence — 2026-11-23 (replaces preliminary CI-pending descriptions above)
- **Implementation PR #32:** https://github.com/nikonovmike2737/kids-english/pull/32 — merged. Application SHA `9fd1f0b2ccd8dde2ab95a42a5bd1a7e0317be58e`.
- **Published GitHub Pages:** https://github.com/nikonovmike2737/kids-english/actions/runs/45262374460 — SUCCESS, same application SHA.
- **Final PR CI:** https://github.com/nikonovmike2737/kids-english/actions/runs/45261967812 — SUCCESS, 38/38 Node source/binary integrity tests, old C/D/E/G1 real browser regression, new G2 7/7 image/alpha/equipment tests, desktop/mobile screenshot evidence.
- **Independent hosted production Chromium:** https://github.com/nikonovmike2737/kids-english/actions/runs/45262486687 — SUCCESS. 9 earlier lesson/Classic checks + 7 D/E/G1 checks + 7 G2 checks: **23/23 distinct live-browser checkpoints**.
- **Visual QA screenshots:** https://github.com/nikonovmike2737/kids-english/actions/runs/45261967812/artifacts/14859529735 — 1280px all five categories, dressed kitten with all five accessories, map, reward and 390px mobile. The technical partner personally checked composite positioning. In particular: hat sits on head, scarf on neck, shoes at paws, backpack behind the torso, hand-held tool near raised paw; no duplicate baked-in accessory on the kitten. A late mobile regression revealed wallet/close overlap; this was repaired and verified in Chromium before merge.
- **Binary-integrity evidence:** 15 native 256×256 transparent VP8X WebP item files with unique SHA-256 plus one 1024×936 transparent dressable cat, recorded in [G2 asset manifest](G2_ART_MANIFEST_2026-11-23.json); no remote image dependencies.
- **Unchanged:** all 3 authored English lessons, 3 lives per attempt, 12 permanent-key system, 3 small/1 grand chest coin ledger, tier prices 1/3/5, Buy/Wear/Wearing, localStorage v1, classic fallback.
- **Owner visual sign-off remains PENDING.** G2 engineering gate = **TECH_PASS / DEPLOYED / HOSTED_E2E_PASS**. Keep issue #27 open until owner checks artistic fidelity. G3 (#28) map layout and G4 (#29) reward layout remain OPEN and are not reclassified by G2 success.

## G2R + G3 joint owner-directed correction — acceptance ledger (2026-11-23, 23:48 MSK)
| ID | Priority | Screenshot failure / invariant | Release gate |
|---|---|---|---|
| **G2R-01** | P0 | Safari screenshot 23:48:34 shows half of cat clipped beyond the right side of My Cat preview; body, paws and ears must be inside left panel | Computed `.cat-avatar-canvas` and image bounding rectangles are at least 8px inset from preview; alpha canvas subject center within 10% of panel; desktop 1649×928 and 1280×800, 390px mobile; native Chromium **and WebKit** |
| **G2R-02** | P0 | Island photo visible in preview; owner requests neutral backdrop | Computed `.cat-preview` background-image is `none`, smooth neutral lavender gradient; no photo, no truncated figure; existing 3D equipment remains aligned |
| **G3-01** | P1 | Chests look baked into scenery or float above surface | Exactly 4 independent `.chest-node` interactive DOM objects with transparent WebP images; three small chests planted on green terraces and the grand on its own islet; alpha test; no square image mats, no unrelated duplicate decorative chest |
| **G3-02** | P1 | Lesson circles / sign labels not aligned to land contour and overlap | Terrain-adjusted 12 canonical lesson coordinates in 3 rows, 4 per row, row signs above nodes; desktop 2048×1152, 1649×928, 1280×800, 1024×768; state 3 authored, other 9 locked |
| **G3-03** | P1 | Dotted path has sharp corners, disconnections and goes outside bridge planks | Smooth cubic grass segments connecting ordered node → chest without inbound path at L1; 3 distinct `.bridge-route` path sections with round dots and no long over-water spill; follow actual bridge endpoints; no arrow glyph or extra route |
| **G3-04** | P1 | Oversized kitten overlaps first bridge and route | Move map kitten left without clipping and within stage; desktop bridge B / cat bounding boxes non-overlapping; My Cat remains clickable and shows dressed state |
| **G3-05** | P0 regression | Product progression or existing lesson behavior changes | Unchanged 12 stop IDs, 4 chest IDs, serpentine order, 3 authored lessons and coin/key economy, G1/G2 outfit/price tests, Classic, 3 hearts per attempt, no POST, no JS errors; live browser checks on new Pages SHA |
| **G3-06** | P0 release | Site and artifacts reflect true latest deployment | One regular PR/merge/Pages workflow, Pages SUCCESS, independent public URL 3-browser-viewport visual/interaction smoke SUCCESS; owner artistic sign-off separate |

**Art policy:** for G3, reuse already separated local chest WebPs and existing clean scenery; do not claim regeneration of the entire scene when changing SVG paths, CSS, DOM anchors and their styling. If a chest WebP has opaque image corners or the background includes a baked-in chest, block acceptance and treat that as an image-level defect requiring separate editing, not a CSS pretense.

## G2R + G3 — immutable Production acceptance (2026-11-23/24)
- **One application PR:** [#35](https://github.com/nikonovmike2737/kids-english/pull/35) MERGED. Exact app SHA `c39e9338c46dad6d4c5522d1610119007127caa1`.
- **Normal GitHub Pages release:** [#45266932360](https://github.com/nikonovmike2737/kids-english/actions/runs/45266932360), **completed/SUCCESS**, app SHA exactly above.
- **Premerge source and real-browser gate:** [#45266658793](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793), **SUCCESS** for both independently run jobs `test` (Chromium, all historical C/D/E/G1/G2 smoke and G3 multi-viewport) and `safari-webkit` (WebKit/Safari 5 responsive sizes). **45/45 Node contracts PASS**.
- **Independent after-deploy public site browser gate:** [#45267045055](https://github.com/nikonovmike2737/kids-english/actions/runs/45267045055), `hosted-smoke` Chromium **SUCCESS** and `hosted-safari` WebKit **SUCCESS** against `https://nikonovmike2737.github.io/kids-english/`. All historical lessons / lives / keys / items / classic plus corrected map and portrait checked. No non-GET requests or uncaught JS exceptions.
- **Visual proof:** [Chromium/old+new desktop and mobile screenshots](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793/artifacts/14864240230) and [Safari/WebKit screenshots](https://github.com/nikonovmike2737/kids-english/actions/runs/45266658793/artifacts/14862143090). Manually reviewed Safari 1649×928 and 390×844: centered full neutral-backdrop kitten, outfit layers intact; scene shows distinct chests, bright round dots along all three bridges, no bridge hidden by kitten; 12 stop hit targets and row headings unobstructed.
- **G2R:** fix the Safari-specific unbounded intrinsic avatar width (direct screenshot regression) with a capped 1024:936 flexed portrait, ensure no island background URL in wardrobe.
- **G3:** use exact source-coordinate routes/labels for 3 stages with 12 lesson nodes and four native transparent chests; no decorative or baked duplicate, three bounded cubic bridge route segments; maple mascot moved left and scaled to free up wooden bridge. **No new assets, lessons, question answers, economies, or chest awards.**
- **Release architecture hardening:** Chromium and WebKit both test using version-pinned official Playwright containers. This avoids a blocked apt installer in the earlier superseded CI runs; final PR + hosted verification are both green. The stalled runs for older SHA do not represent current-release failure.
- **Remaining:** owner human artistic acceptance for G1/G2/G2R/G3 still open. G4 [#29](https://github.com/nikonovmike2737/kids-english/issues/29) remains OPEN (key reward illustration and Lesson Results removal) and was **not** implemented or verified by this release.

## G4 — release-specific acceptance criteria (2026-11-24)
- One coherent gold-key and dressed-kitten composition in the completion modal; no miniature duplicate mascot. New original scalable prize artwork, shared existing alpha mascot and outfit layers. Large key and visible Continue at desktop, portrait mobile and short landscape; keyboard focus/close remain available.
- Remove Lesson Results table, per-task report, remaining lives and wrong-try count from celebration. Do not change scoring or reveal correct answers. No attempt report in localStorage or network.
- First full lesson success: You Got a Key! + permanent total. Replay: Great Job! + distinct star, same permanent total; no duplicate award. Coins and chests unaffected. Existing Classic unchanged.
- Require native contracts, real complete/repeat lesson flows in Chromium and WebKit, screenshot review, regression across prior G1–G3 and deployed-site tests. Owner final artistic sign-off separate.

## G4 key celebration — Production verified, 2026-11-24
- Owner issue [#29](https://github.com/nikonovmike2737/kids-english/issues/29), implementation [PR #37](https://github.com/nikonovmike2737/kids-english/pull/37), application SHA `e49e168e519d70903d1af0968b43c93fa530c94a`.
- [Pages deploy #45269141023](https://github.com/nikonovmike2737/kids-english/actions/runs/45269141023) SUCCESS; [premerge #45268695084](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084) Chromium and WebKit SUCCESS, 49/49 native contracts; [independent hosted QA #45269242613](https://github.com/nikonovmike2737/kids-english/actions/runs/45269242613) both jobs SUCCESS.
- One large illustrated celebration with shared transparent dressable kitten, new original scalable golden key/star artwork, simple total and Continue. No Lesson Results table, wrong-attempt report or remaining lives in reward. Replay shows Great Job! and a star, no additional key. Actual complete/repeat/reload flows verified at 1649×928, 1280×800, 390×844 and 844×390 (repeat on desktop and portrait mobile). Existing quiz scoring, 3 hearts, chest/coin economy, outfits and Classic regressions PASS; no personal data network requests.
- [WebKit screenshots](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14864142682) manually reviewed at 1649×928 and 390×844, with replay screenshot checked at desktop. [Chromium visual artifacts](https://github.com/nikonovmike2737/kids-english/actions/runs/45268695084/artifacts/14863568743).
- G1, G2, G2R, G3 and G4 technical delivery complete. Owner visual acceptance remains pending; no claim that owner has approved screenshots. No new lessons unlocked. Nine additional full lessons remain methodologist scope.

## G6 owner request — 2026-11-24 00:58:06
- [#41](https://github.com/nikonovmike2737/kids-english/issues/41): enlarged and centered visible kitten, alpha-centered catalog artwork, living water/shore/foliage, random four-action dressed kitten idle rig.
- Acceptance: actual opaque pixels inside preview, near green frame; all 15 items centered; water and foliage animate without hit-target changes; wave/wink/stretch/claws/sit use same composed gear/body texture, 13–17s random idle, no immediate repeat, no motion in lessons/hidden tabs/reduced-motion; no progression changes. Browser tests before and after publishing. Owner artistic sign-off separate.

## G7 owner visual correction — [#43](https://github.com/nikonovmike2737/kids-english/issues/43)
Static mascot supersedes G6 gestures completely. Clean native WebP chests (closed, grand and opened; no background/rays), independent state lock; equal horizontal edge spacing at each row; physical bridge deck centerline, three illustrated label icons. Refined scene-only ambient motion, reduced-motion safety, PR and hosted Chromium/WebKit required. Owner visual acceptance separate.
