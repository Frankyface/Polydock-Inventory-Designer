# Feature — GitHub Actions Deploy

A GitHub Actions workflow that builds the Vite app and publishes it to GitHub Pages on every push to `main`.

## Incident (2026-07-06): live site went blank, intermittently

The live site (`frankyface.github.io/Polydock-Inventory-Designer/`) was serving the raw, unbuilt `index.html` (`<script src="/src/main.jsx">`, which no browser can execute) instead of the built app — but had apparently worked earlier, which was the key clue.

**Actual root cause (a deployment race), found via the Actions run list:** two separate deployers were BOTH running on every push and BOTH publishing to the same `github-pages` environment:

1. `Deploy to GitHub Pages` — our custom workflow, which built the app correctly.
2. `pages build and deployment` — GitHub's built-in branch builder, which runs **only** when Pages Source = "Deploy from a branch". With Source = `main`/`(root)`, it served the repo's raw root `index.html`.

Because both target the same environment, whichever finished last won. That non-determinism is exactly why the site "worked before" (our build won that race) and then broke (the raw-source builder won). The presence of `pages build and deployment` in the run history is the proof that Source was in branch mode the whole time — that job never runs under Source = "GitHub Actions".

Earlier misdiagnosis (worth recording as a dead-end): this was first read as a simple "Source is on the wrong setting, just toggle it" problem, and a lot of time was lost re-checking the same 404 instead of looking at *which workflow actually produced the live deployment*. The run list was the diagnostic that should have been pulled first.

**Fix shipped:** `.github/workflows/deploy.yml` was simplified to a single deployer — it builds and publishes `dist/` to the **`gh-pages`** branch via `peaceiris/actions-gh-pages@v4`, and nothing else. The `actions/upload-pages-artifact` + `actions/deploy-pages` jobs were removed, because using `deploy-pages` alongside a branch-based Pages source is precisely what created the race. Now there is exactly one path: workflow → `gh-pages` branch → GitHub serves that branch. The required human step (Settings → Pages → branch dropdown `main` → `gh-pages`) is in `help.md`.

## Open Questions

- Custom domain, or the default `frankyface.github.io/Polydock-Inventory-Designer` path? Affects the Vite `base` config — not decided yet, defaulting to the repo-path option unless told otherwise.
