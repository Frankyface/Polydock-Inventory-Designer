# Feature — GitHub Actions Deploy

A GitHub Actions workflow that builds the Vite app and publishes it to GitHub Pages on every push to `main`.

## Incident (2026-07-06): live site went blank after the Stage 4 push

The live site (`frankyface.github.io/Polydock-Inventory-Designer/`) was serving the raw, unbuilt `index.html` (`<script src="/src/main.jsx">`, which no browser can execute) instead of the built app. Confirmed root cause, not a code bug:

- Rebuilding the exact committed code locally with the real production config produced a correct `dist/index.html` (properly referencing `/Polydock-Inventory-Designer/assets/...`).
- The GitHub Actions run for that push succeeded end-to-end, including the `deploy` job (`actions/deploy-pages@v4`).
- But the specific built asset filename that build produced returned 404 on the live domain, while the page root matched the repo's raw `index.html` byte-for-byte.

This combination only happens when the repo's **Settings → Pages → Source** is "Deploy from a branch" (serving the raw repo tree from `main`) instead of "GitHub Actions" (serving the artifact the workflow builds) — the two are mutually exclusive, and only one can be live at a time regardless of whether the Actions workflow itself succeeds.

**Fix shipped:** the workflow (`.github/workflows/deploy.yml`) now publishes the build to *both* places — the existing `upload-pages-artifact`/`deploy-pages` path (for Source = "GitHub Actions") **and** a new `peaceiris/actions-gh-pages@v4` step that pushes `dist/` to a `gh-pages` branch (for Source = "Deploy from a branch", branch = `gh-pages`). Whichever Source setting is actually active in Settings, one of the two will be live. See `help.md` for the exact steps to point Pages at whichever one is easier to reach in the UI.

## Open Questions

- Custom domain, or the default `frankyface.github.io/Polydock-Inventory-Designer` path? Affects the Vite `base` config — not decided yet, defaulting to the repo-path option unless told otherwise.
- Once Pages is confirmed reliably serving from one source, consider dropping the other publish path from the workflow to keep it simple — kept both for now since which Settings toggle is actually easiest/reliable for this repo hasn't been confirmed yet.
