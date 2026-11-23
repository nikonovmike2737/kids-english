# Technical smoke-test — 2026-11-23
Source: index.html in main, commit 824ab12d1d81a528c4b0792263c1bb46911b847d.

Automated local Chromium via Playwright Python (headless; HTML loaded as document without network).
- ENG-001: 4/4, task-by-task result list 4/4 — PASS.
- ENG-002: 4/4, task-by-task result list 4/4 — PASS.
- ENG-003: 4/4, task-by-task result list 4/4 — PASS.
- Wrong choice: displays correct answer — PASS.
- Restart: clears answer/blocks next until completion — PASS.
- No outbound requests, no JavaScript uncaught errors — PASS.
- Responsive: 360/390/768/1280 px; document width equals viewport width — PASS.

Local code smoke status: TECH_CODE_PASS.
Public deployment: TECH_DEPLOY_BLOCKED. First workflow run https://github.com/nikonovmike2737/kids-english/actions/runs/45144228305 failed at Configure Pages. GitHub report: Create Pages site failed — Resource not accessible by integration. Owner must enable GitHub Pages manually in Settings → Pages, Source GitHub Actions, then rerun workflow.

Do not claim overall TECH_PASS or public site live before external URL returns active HTML.
