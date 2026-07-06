# Help — Things Only You Can Do

Ordered checklist of human-only tasks. Check items off as you go.

Good news: after dropping Supabase in favor of local-storage-only inventory, there's no backend to set up and no account/project blockers. This list is much shorter than it used to be.

## Blocks Stage 5 (deploy) — ONE dropdown change needed

**Confirmed diagnosis (2026-07-06):** Pages was set to **"Deploy from a branch" → `main` → `(root)`**. That mode makes GitHub's built-in "pages build and deployment" job serve the repo's raw `main`/root files — including the unbuilt `index.html` that references `/src/main.jsx` (which no browser can run). That's why the page came up blank. It appeared to "work before" because a second deployer (our own Actions workflow) was also publishing to the same environment and the two were racing — sometimes the real build won, sometimes the raw-source builder did. The workflow has now been simplified to publish the built site to the **`gh-pages`** branch only (no more race).

- [ ] **In Settings → Pages, keep "Deploy from a branch", change the branch dropdown from `main` to `gh-pages`, leave the folder on `/(root)`, and click Save.**
  - `gh-pages` already contains the complete, correct build (`index.html` + `assets/` + `.nojekyll`), refreshed automatically on every push to `main`.
  - This is the smallest possible change from the screen you were already on — only the branch dropdown changes.
  - Give it ~1 minute after saving; no re-push needed.
  - (Alternative, if you'd rather: Source → "GitHub Actions" also works, but then the branch build stops updating — sticking with branch → `gh-pages` matches how the workflow now publishes.)

## Good to know, no action needed yet

- The parts catalog (`src/data/partsCatalog.js`) comes from PolyDock's own official assembly-instructions PDF plus two authorized ShoreMaster dealers (boatliftanddock.com, shopshoremaster.com) — not an official manufacturer price list. A handful of SKU conflicts and one load-capacity contradiction are documented in `staging/stage-1-foundation/feature-catalog-seed.md`. Worth a real dealer sanity-check before this data drives anything customer-facing.
- **Inventory is stored per-browser (localStorage), not shared across staff or devices.** If the business needs everyone seeing the same live stock numbers, that requires reintroducing a real backend later — flagged in `docs/master_plan.md`'s Open Questions & Risks as the single biggest scope tradeoff made during this build.
- `git` push authentication uses Windows Credential Manager, already configured under your `Frankyface` / `cammer3034@gmail.com` identity — the first push may pop up a browser-based GitHub login if the cached credential has expired.
