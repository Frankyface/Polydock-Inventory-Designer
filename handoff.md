# Handoff — PolyDock Inventory & Design Tool
_Last updated: 2026-07-05 · Current stage: Stage 1 — Foundation (done)_

## 🎯 Goals
Get the real PolyDock parts catalog into the app with a working inventory-entry UI. Done for Stage 1; next up is Stage 2 (CSV bulk import) or Stage 3 (design canvas) — see Next Up.

## 📍 Current State
Stage 1 is functionally complete and verified in-browser: the app shows a tabbed UI (Dock Modules / Connectors / Accessories), each tab lists the real, sourced PolyDock catalog with an editable "on hand" quantity, and quantities persist across reloads via `localStorage`. No backend, no auth, no external blockers — the project pivoted away from Supabase mid-build (see below).

## 📂 Files I'm Working On
- `src/data/partsCatalog.js` — the entire parts catalog (modules, connectors, accessories) plus `CONNECTOR_RULES` for later stages. Single source of truth, no database.
- `src/features/inventory/` — `useLocalInventory.js` (localStorage-backed state), `CategoryTabs.jsx`, `CatalogInventoryView.jsx`, `PartRow.jsx`.
- `src/App.jsx` — simple shell, no auth.
- `vite.config.js`, `package.json`, `.github/workflows/deploy.yml` — build/deploy config, Supabase-free.
- Docs (`docs/master_plan.md`, `CLAUDE.md`, `help.md`, all of `staging/`) — updated to reflect the pivot.

## ✅ Things I've Changed
- **Pivoted away from Supabase mid-build**, per explicit user instruction ("don't do Supabase, just store it locally, have tabs to put numbers into"). Removed: `supabase/` (migrations + seed SQL), `src/supabaseClient.js`, `src/features/auth/`, the `@supabase/supabase-js` dependency, `.env.local.example`, and the Supabase env secrets from the GitHub Actions workflow.
- Converted the researched PolyDock catalog from SQL seed data into a static JS module (`src/data/partsCatalog.js`), preserving every flagged gap/contradiction from the original research (load-capacity contradiction, unverified marketing-only connectors, SKU inconsistencies, no-10ft-notched-connector gap).
- Built `useLocalInventory` (localStorage-backed inventory state) and a tabbed catalog UI (`CategoryTabs` + `CatalogInventoryView` + `PartRow`), replacing the old Supabase-query-based hook.
- Fixed a real bug found in code review before it could ship: `PartRow`'s draft-quantity input didn't resync when the underlying value changed from outside the row (e.g. another tab) — now it does, without clobbering an in-progress edit.
- Fixed a real bug found in code review: `vite.config.js` had a hardcoded absolute Windows path as `root`, which would have broken the GitHub Actions build (different filesystem/path on the CI runner) — removed entirely; base path is set conditionally (`/Polydock-Inventory-Designer/` for build, `/` for dev) with no path hardcoding.
- Verified the app end-to-end in-browser: tab switching, quantity entry + blur-to-commit, invalid-input feedback (red border + message), and persistence across a full page reload all confirmed working via screenshots and localStorage inspection.
- Ran an 8-angle parallel code review on the (now largely superseded) Supabase-era code; the two findings that survived the pivot (the two bugs above) were fixed. The rest (RLS gaps, schema depth, auth races) are moot since that code no longer exists.
- Initialized git, added the `origin` remote (`https://github.com/Frankyface/Polydock-Inventory-Designer.git`), staged all files. Not yet committed/pushed — see Next Up.

## ❌ Tried But Failed
- **Creating a Supabase project failed** (2-project free-tier limit on the `Frankyface` account) — this is what originally motivated investigating alternatives, though the user's local-storage decision was a deliberate simplification, not purely a workaround for the blocker.
- **`npm run dev` and `vite preview` don't render correctly inside this specific Claude Code sandbox's preview tool** — confirmed to be sandbox/tooling artifacts (a `/@vite/client` 404 in dev mode, and a `vite preview` bug serving `index.html` instead of real assets under a custom base path, reproduced even via direct `curl`), not application bugs. Worked around by building with a temporarily-forced root base and serving via plain `python -m http.server` for verification. Documented in `CLAUDE.md`'s "Local preview in the Claude Code sandbox" section so this doesn't need rediscovering.
- **A `--base=/` CLI flag via the Bash tool got silently mangled** by Git Bash's MSYS path conversion into `C:/Program Files/Git/...` — also documented in `CLAUDE.md`. Fixed by setting `base` inside `vite.config.js` instead of as a CLI arg.

## ➡️ Next Up
1. `git commit` and `git push -u origin main` (repo is initialized, remote added, everything staged — just needs the commit + push).
2. Enable GitHub Pages (Settings → Pages → Source: "GitHub Actions") — tracked in `help.md`, needed before the Actions deploy will actually publish anywhere.
3. Decide what's next on the roadmap: Stage 2 (CSV bulk import) is next in the original order, but Stage 3 (design canvas) is the more visible/exciting piece and no longer blocked by anything — worth asking the user which they'd rather see next.
4. When ready for Stage 3: resolve the canvas rendering approach (SVG vs. Canvas vs. DOM/CSS-grid) per `staging/stage-3-design-canvas/overview.md`'s open question.

## 🔗 Pointer
→ Current stage folder: `staging/stage-1-foundation/` (done) · Next stage: `staging/stage-2-bulk-import/` or `staging/stage-3-design-canvas/` (user to choose) · Active feature file: none yet for the next stage — see Next Up.
