# Adventure Island — release and rollback

## Prior known-good production
Branch: `release/classic-pre-island-2026-11-23`
Commit: `5a1bc670762c0e7ef73b78b4176bc068894cc846`
Public legacy route: `https://nikonovmike2737.github.io/kids-english/classic/`

## New version
Main entrypoint: `index.html` → the new interactive Adventure Island map.
Build pipeline: **one** `.github/workflows/pages.yml` deploy job, triggered on index, assets and lesson content changes. Test success and Pages success are separate claims; check both.

## Switching without downtime
Use the Settings → **Classic Lessons** link inside Adventure Island. The classic URL works independently of the new map and uses the original question engine. To roll back the default home page, revert the island introduction commit on main and let the same Pages workflow deploy the revert. Do not remove the branch or the classic directory during hotfixes.

## Assets
All binaries are in `assets/{maps,mascot,chests,modals,status,symbols,buttons,inventory,reference}` and are served on GitHub Pages at same-origin paths. No third-party hosting dependency.
