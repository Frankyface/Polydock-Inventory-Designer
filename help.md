# Help — Things Only You Can Do

Ordered checklist of human-only tasks. Check items off as you go.

Good news: after dropping Supabase in favor of local-storage-only inventory, there's no backend to set up and no account/project blockers. This list is much shorter than it used to be.

## Blocks Stage 5 (deploy)

- [ ] **Point GitHub Pages at a working source.** Confirmed diagnosis (2026-07-06): the repo's Settings → Pages → Source was set to "Deploy from a branch" / `main` / `(root)`, which serves the raw, unbuilt `index.html` (the one referencing `/src/main.jsx`, which no browser can execute) — not the actual built app. The workflow (`.github/workflows/deploy.yml`) now publishes the built site to **both** places, so either fix works — pick whichever is easier to get to in Settings:
  - **Option A (recommended, modern):** Settings → Pages → Source → switch to **"GitHub Actions"**.
  - **Option B (works with "Deploy from a branch" as-is):** leave Source on "Deploy from a branch", but change the **branch** dropdown from `main` to **`gh-pages`** (the workflow now pushes the built site there automatically on every push to `main`; that branch won't exist until the workflow has run at least once).
  - Either one, once set, should go live within about a minute — no re-push needed after just flipping the setting.

## Good to know, no action needed yet

- The parts catalog (`src/data/partsCatalog.js`) comes from PolyDock's own official assembly-instructions PDF plus two authorized ShoreMaster dealers (boatliftanddock.com, shopshoremaster.com) — not an official manufacturer price list. A handful of SKU conflicts and one load-capacity contradiction are documented in `staging/stage-1-foundation/feature-catalog-seed.md`. Worth a real dealer sanity-check before this data drives anything customer-facing.
- **Inventory is stored per-browser (localStorage), not shared across staff or devices.** If the business needs everyone seeing the same live stock numbers, that requires reintroducing a real backend later — flagged in `docs/master_plan.md`'s Open Questions & Risks as the single biggest scope tradeoff made during this build.
- `git` push authentication uses Windows Credential Manager, already configured under your `Frankyface` / `cammer3034@gmail.com` identity — the first push may pop up a browser-based GitHub login if the cached credential has expired.
