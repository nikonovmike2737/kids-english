# Kids English — Adventure Island

An English-language, child-facing island adventure with three real lessons, three hearts per attempt, permanent keys and local progression. The first 3 of 12 full lessons are playable in **Getting Started**. Other stops are intentionally locked pending educational authoring. No registration, analytics, advertising or server-side feedback collection.

- **New island**: https://nikonovmike2737.github.io/kids-english/
- **Preserved classic game**: https://nikonovmike2737.github.io/kids-english/classic/
- **Approved product canon**: [Adventure Island](docs/source-of-truth/ADVENTURE_ISLAND_APPROVED_CANON.md)
- **Asset manifest**: [Assets](docs/product/ASSET_MANIFEST.md)
- **Rollback**: [Release and rollback](docs/source-of-truth/RELEASE_AND_ROLLBACK.md)
- **Methodologist**: [Role](docs/source-of-truth/ROLE_METHODOLOGIST.md)
- **Technical partner**: [Role](docs/source-of-truth/ROLE_TECHNICAL.md)

## Run locally
Use any local static file server, e.g. `python -m http.server 8000`; open `http://localhost:8000/`. Client JavaScript modules load the data and map. No build step needed.

## Test
- `node --test tests/*.test.mjs` — 38 native Node B/C/D/E/G1/G2 source/binary-integrity contract checks.
- `node tests/block-c-browser.smoke.mjs` — real Playwright Chromium lesson, hearts, results and Classic browser regression.
- `node tests/block-de-browser.smoke.mjs` — real illustrated World Map, five-category My Cat, purchasing, outfit layering, reload and mobile/browser regression.
- `node tests/g2-art-browser.smoke.mjs` — real 15-image alpha/sprite QA, all five gear layers, wallet/close layout, 390px mobile and full-lesson reward.
- Run locally with a static server and `KIDS_TEST_URL=http://127.0.0.1:8000/` (Playwright and Chromium required); browser tests run in isolated contexts.
- PR workflow `.github/workflows/pr-ci.yml` runs source tests, local Chromium and screenshots. Production read-only workflow `.github/workflows/production-browser-smoke.yml` runs full live click-tests automatically **after** the single Pages deployment finishes successfully.
- Test browsers never submit personal data; local smoke fixtures affect only their disposable browser contexts.

## Production D/E
The World Map uses three distinct illustrated worlds with only Adventure Island playable. My Cat has five direct categories and 15 transparent 3D accessories rendered over an accessory-free kitten across map, wardrobe and lesson reward. Anonymous purchased/equipped state is local to the browser.

## Next educational work
Nine additional full lessons (not nine questions) need methodologist review; only after approval may their locked nodes become playable. Additional worlds Mystical Desert and Rainy Forest are locked previews, not released content.

## Owner visual QA, 2026-11-23
The newest owner screenshot defects are tracked in [the G1–G4 visual register](docs/product/ADVENTURE_ISLAND_OWNER_VISUAL_QA_2026-11-23_CURRENT.md). G1 wardrobe layout/card fix deployed (PR #30); G2 original 3D inventory art deployed (PR #32) and confirmed by live Chromium. G3 island positioning and G4 key reward composition remain outstanding; owner visual sign-off for G1/G2 is pending.

## G2R Safari wardrobe + G3 island geometry release
The owner Safari screenshot regression in My Cat (kitten cropped and island photo behind the cabinet) and island scene geometry (independent chests, grass-aligned lesson and label positions, smooth three-bridge serpentine path and leftward kitten) are fixed in application [PR #35](https://github.com/nikonovmike2737/kids-english/pull/35). Published app SHA `c39e9338`, [Pages SUCCESS](https://github.com/nikonovmike2737/kids-english/actions/runs/45266932360), [live Chromium+WebKit SUCCESS](https://github.com/nikonovmike2737/kids-english/actions/runs/45267045055). Run `node tests/g3-visual-browser.smoke.mjs` with `KIDS_TEST_URL` and optional `KIDS_BROWSER=webkit` to test 5 viewports. New 7 source contracts raise native suite to **45**. Owner artistic approval is still pending and G4 key-reward redesign remains open.
