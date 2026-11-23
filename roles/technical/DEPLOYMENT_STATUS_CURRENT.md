# Kids English — Deployment Status CURRENT
Date: 2026-11-23
Owner: role/technical
Status: **DEPLOYED / VERIFIED**
Live URL: https://nikonovmike2737.github.io/kids-english/
Repo: nikonovmike2737/kids-english, branch main.

## Current production
- Deploy run: https://github.com/nikonovmike2737/kids-english/actions/runs/45153843054 (#6)
- Released commit: `3a084b3ba3d7dd8f58742c34f5e359fd4a8f836d`
- GitHub Actions job conclusion: success; upload, artifact visibility and Pages publish all succeeded.
- External request opened the public site at `?rev=3a084b3`; confirmed Kids English home and ENG-001, ENG-002, ENG-003 lesson names.
- Browser interactions on production were not independently replayed because external browser automation service was unavailable. Same answer/retry/loss/restart cases were tested locally in headless Chromium.

## Game contract now in prod
- Three shared hearts for the entire lesson; any wrong full Check subtracts one life, correct answer does not.
- Check for choice/match/order; no hints or correct answers after errors; Next only after success.
- Whole-batch evaluation for match; no early pair correctness.
- Sad cat 😿 game-over modal and restart after third error.
- Removed question spoilers in ENG-002 Swim and Jump; kept approved kitten branding.
- No result storage, no analytics, no backend.

## Release history and operations
- Initial Pages failures: Pages not enabled, then artifact visibility race.
- Fixed in PR #3: one deploy job, explicit artifact-read permission and wait for uploaded artifact.
- #4 Pages success (first); #5 kitten brand success; #6 three hearts + question redesign success.
- Only changes to `index.html`, `assets/**`, `site/**`, `content/**`, workflow file trigger Pages. Documentation-only commits do not redeploy.
- Adult feedback only via ChatGPT/Codex; anonymized and tracked by lesson/question ID through methodology PRs.
