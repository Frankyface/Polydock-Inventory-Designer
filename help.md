# Help — Things Only You Can Do

Ordered checklist of human-only tasks. Check items off as you go.

Good news: after dropping Supabase in favor of local-storage-only inventory, there's no backend to set up and no account/project blockers. This list is much shorter than it used to be.

## Stage 5 (deploy) — RESOLVED ✅ (2026-07-06)

The live site is up and serving the built app: https://frankyface.github.io/Polydock-Inventory-Designer/ (verified — root HTML references `/Polydock-Inventory-Designer/assets/…`, and the JS/CSS bundles return 200).

- [x] **GitHub Pages deploy working.** Root cause of the earlier blank page: a `deploy.yml` edit had removed the `actions/deploy-pages` job, so the build stopped being served under the repo's Pages source. Restoring that job (commit `9783fb6`) fixed it. The workflow now publishes for **both** Pages source modes ("GitHub Actions" and "Deploy from a branch → `gh-pages`"), so this won't regress from a single missing path again. The only Pages setting that can't work is "Deploy from a branch → `main` → `(root)`" — that serves the raw source `index.html` (`/src/main.jsx`), which no browser can run; there's no way to serve a Vite build from the same branch/folder that holds its source.

## Good to know, no action needed yet

- The parts catalog (`src/data/partsCatalog.js`) comes from PolyDock's own official assembly-instructions PDF plus two authorized ShoreMaster dealers (boatliftanddock.com, shopshoremaster.com) — not an official manufacturer price list. A handful of SKU conflicts and one load-capacity contradiction are documented in `staging/stage-1-foundation/feature-catalog-seed.md`. Worth a real dealer sanity-check before this data drives anything customer-facing.
- **Inventory is stored per-browser (localStorage), not shared across staff or devices.** If the business needs everyone seeing the same live stock numbers, that requires reintroducing a real backend later — flagged in `docs/master_plan.md`'s Open Questions & Risks as the single biggest scope tradeoff made during this build.
- `git` push authentication uses Windows Credential Manager, already configured under your `Frankyface` / `cammer3034@gmail.com` identity — the first push may pop up a browser-based GitHub login if the cached credential has expired.
