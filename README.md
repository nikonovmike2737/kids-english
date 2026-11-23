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
- `node --test tests/*.test.mjs` — 23 native Node B/C/D/E source-contract checks.
- `node tests/block-c-browser.smoke.mjs` — real Playwright Chromium lesson, hearts, results and Classic browser regression.
- `node tests/block-de-browser.smoke.mjs` — real illustrated World Map, Shop/Inventory, purchasing, outfit layering, reload and mobile/browser regression.
- Run locally with a static server and `KIDS_TEST_URL=http://127.0.0.1:8000/` (Playwright and Chromium required); browser tests run in isolated contexts.
- PR workflow `.github/workflows/pr-ci.yml` runs source tests, local Chromium and screenshots. Production read-only workflow `.github/workflows/production-browser-smoke.yml` runs full live click-tests automatically **after** the single Pages deployment finishes successfully.
- Test browsers never submit personal data; local smoke fixtures affect only their disposable browser contexts.

## Production D/E
The World Map uses three distinct illustrated worlds with only Adventure Island playable. My Cat includes Shop, owned-only Inventory, and 15 image-backed accessories rendered over the kitten across map, wardrobe and lesson reward. Anonymous purchased/equipped state is local to the browser.

## Next educational work
Nine additional full lessons (not nine questions) need methodologist review; only after approval may their locked nodes become playable. Additional worlds Mystical Desert and Rainy Forest are locked previews, not released content.
