# Kids English — Deployment Status CURRENT
Date: 2026-11-23
Owner: role/technical
Status: **DEPLOYED / VERIFIED**
Live URL: https://nikonovmike2737.github.io/kids-english/

## Facts
- Repo: nikonovmike2737/kids-english, branch main.
- Latest successful workflow run: https://github.com/nikonovmike2737/kids-english/actions/runs/45146954739
- Version: commit `311a1bf3a063ed2e434d41d96622cbad6b6a61d4`.
- GitHub Actions job status: success; Pages deployment action returned Reported success.
- Public external fetch confirmed page title "Kids English — Play & Learn" and displayed ENG-001 Feelings, ENG-002 Move & Play, ENG-003 Animal Theatre.
- Source HTML is static, with client-side answer evaluation and unlimited retries; feedback collected only via adult ChatGPT/Codex chats.

## Failure and fix
- First run failed because Pages was not enabled; owner enabled GitHub Actions as Pages source.
- Subsequent run failed because deploy-pages saw 0 artifacts immediately after successful upload although artifact ID 14804027232 existed.
- PR #3 updated the single Pages workflow (one `deploy` job): `actions: read`, newer upload-pages-artifact@v4, guard/wait for exactly one artifact in GitHub API before deploy.
- Workflow #4 uploaded artifact ID 14805240115 and deployed successfully.

## Trigger policy
- Only changes to index.html, assets/**, site/**, content/**, or .github/workflows/pages.yml trigger automatic deployment.
- Changes limited to methodology/source-of-truth markdown do not trigger deployment.
- Manual workflow_dispatch remains available.
- New HTML release changes should travel in one reviewed technical PR with METHOD_PASS and TECH_PASS evidence; do not create separate deploys for every unrelated document edit.

## Acceptance
TECH_DEPLOY_PASS = Github workflow success + external public URL returns intended content.
Additional browser-level tests to run after major site changes: answers for 12/12, incorrect feedback, per-task result, reset, mobile layout, no data transmission.
