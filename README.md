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
`python tests/test_inline.py` and `python tests/test_extended.py` run automated Chromium scenarios against a local, isolated copy of the JS/HTML. Tests require Playwright and a local Chromium binary; they never contact GitHub or send user data.

## Next educational work
Nine additional full lessons (not nine questions) need methodologist review; only after approval may their locked nodes become playable. Additional worlds Mystical Desert and Rainy Forest are locked previews, not released content.
