# CLAUDE.md — PolyDock Inventory & Design Tool

One-liner: a web app that designs PolyDock dock layouts on a snapping 2D canvas, auto-calculates the parts list, and reconciles it live against real warehouse inventory.

## Read this first, every session

1. Read `handoff.md` — it is the head of a linked list and always reflects the current state.
2. Follow its `## 🔗 Pointer` to the active stage folder in `staging/` and the active feature file.
3. Confirm the "Next Up" items with the user before starting work.

Full vision, architecture, and open questions live in `docs/master_plan.md` — read it whenever you need the "why," not just the "what."

## Tech stack

- **Frontend:** React + Vite, static SPA, deployed to GitHub Pages via GitHub Actions.
- **Data:** no backend. The parts catalog is a static JS module (`src/data/partsCatalog.js`); inventory counts live in the browser's `localStorage` (`src/features/inventory/useLocalInventory.js`). No auth, no accounts, no server — everything runs client-side.
- **Repo:** https://github.com/Frankyface/Polydock-Inventory-Designer

Note: this was originally built with a Supabase (Postgres + Auth) backend for shared, real-time inventory across staff. That was deliberately dropped mid-build in favor of the simpler local-only approach above — see `docs/master_plan.md`'s Tech Stack table for the tradeoff (inventory is per-device, not shared). If shared multi-staff inventory becomes necessary later, reintroducing a real backend is the way to do it — don't try to fake sharing via localStorage tricks (BroadcastChannel, etc.).

## Document workflow (linked-list model)

- `CLAUDE.md` (this file) — the constant. Rarely changes.
- `handoff.md` — the **head of the linked list**: single source of truth for "where are we right now."
- `staging/stage-N-*/` — the **linked list body**: one folder per stage, each with `overview.md` (goal + definition of done) and one `feature-<name>.md` per feature (each with an `## Open Questions` section).

A fresh session reads `handoff.md` first, then follows its pointer into the current stage's feature files.

## Standing command: "update all relevant files"

When the user says **"update all relevant files"**:

1. Review what happened this session — what changed, what was decided, what got built, what failed.
2. Update as needed: `handoff.md` (always — every section), `new_session_prompt.md` (if resume instructions/pointer changed), `CLAUDE.md` (only if a rule/convention/stack fact changed), the active feature `.md` files (tick off done items, resolve/append open questions), stage `overview.md` files (if scope/done-criteria shifted), `docs/master_plan.md` (if the vision/roadmap genuinely changed), `help.md` (if new human to-dos appeared).
3. Infer relevance from the session — don't ask a checklist, decide what actually changed.
4. Give a 3–5 line summary of what was updated and why.
5. Keep linked-list integrity: `handoff.md`'s pointer must always point at the real current stage + active feature file.

## Coding conventions

- Many small files over few large ones; components/hooks organized by feature/domain, not by type.
- Functions focused, files cohesive (~200–400 lines typical, 800 max).
- No premature abstraction — three similar lines beats a speculative shared helper.
- Catalog data (`src/data/partsCatalog.js`) is the single source of truth for parts — never duplicate part fields elsewhere; derive.

## How to run / test

- `npm install` then `npm run dev` — local dev server (Vite).
- `npm run build` — static production build (output used by the GitHub Actions Pages deploy). No environment variables needed — there's no backend to configure.

## Branching & commits

- `main` is the deployable branch — GitHub Actions builds and deploys it to Pages on every push.
- Feature branches: `stage-N/<short-feature-name>` (e.g. `stage-1/manual-inventory-entry`).
- Commit format: conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`). No AI attribution lines in commit messages.

## Local preview in the Claude Code sandbox

In this specific sandboxed dev environment, two things reliably fail and are environment artifacts, not app bugs:
- `npm run dev` (Vite dev server) — `/@vite/client` 404s in this sandbox's browser, which (per HTML module-script ordering rules) silently prevents the entry script from ever running. Root cause not fully isolated; likely specific to this sandbox's preview proxy.
- `vite preview` serving the real `dist/` build — nested asset paths under the GitHub Pages base (`/Polydock-Inventory-Designer/...`) incorrectly fall back to `index.html` instead of serving the real file, even via direct `curl` (confirmed server-side, not a browser/CSP issue).

**Working verification recipe:** temporarily hardcode `base: '/'` in `vite.config.js`, run `npx vite build --outDir dist-preview-test`, serve that folder with a plain static server (e.g. `python -m http.server`, see the `polydock-preview` entry in the root `.claude/launch.json`), verify, then revert `vite.config.js` and delete `dist-preview-test` (never commit it — it's gitignored via the general `dist*/` pattern... actually only `dist/` is ignored; delete this throwaway folder manually each time).

Also note: this Bash tool is Git Bash (MSYS) — any CLI argument starting with a bare `/` (like `--base=/`) gets silently rewritten to `C:/Program Files/Git/...` by MSYS's path conversion. Set config values like `base` in the `.js` config file itself, never as a `/`-leading CLI flag through this shell.

The real production build (`npm run build`, no CLI flags, base from `vite.config.js`) is unaffected by all of the above and is what GitHub Actions will run for the actual deploy.

## Review gates

- Run `/code-review` after writing or modifying non-trivial code.
- Run `/security-review` before committing anything touching auth, RLS policies, or the commit/deduct inventory flow.
