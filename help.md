# Help — Things Only You Can Do

Ordered checklist of human-only tasks. Check items off as you go.

Good news: after dropping Supabase in favor of local-storage-only inventory, there's no backend to set up and no account/project blockers. This list is much shorter than it used to be.

## Blocks Stage 5 (deploy)

- [ ] **Enable GitHub Pages for the repo.** Repo → Settings → Pages → Source: "GitHub Actions" (not "Deploy from a branch"). Needs to be done once, before the first Actions deploy will actually publish. No secrets needed — the build has no environment variables to configure.

## Good to know, no action needed yet

- The parts catalog (`src/data/partsCatalog.js`) comes from PolyDock's own official assembly-instructions PDF plus two authorized ShoreMaster dealers (boatliftanddock.com, shopshoremaster.com) — not an official manufacturer price list. A handful of SKU conflicts and one load-capacity contradiction are documented in `staging/stage-1-foundation/feature-catalog-seed.md`. Worth a real dealer sanity-check before this data drives anything customer-facing.
- **Inventory is stored per-browser (localStorage), not shared across staff or devices.** If the business needs everyone seeing the same live stock numbers, that requires reintroducing a real backend later — flagged in `docs/master_plan.md`'s Open Questions & Risks as the single biggest scope tradeoff made during this build.
- `git` push authentication uses Windows Credential Manager, already configured under your `Frankyface` / `cammer3034@gmail.com` identity — the first push may pop up a browser-based GitHub login if the cached credential has expired.
