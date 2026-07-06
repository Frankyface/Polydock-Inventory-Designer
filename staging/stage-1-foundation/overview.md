# Stage 1 — Foundation

## Goal

Get the real PolyDock parts catalog into the app and give staff a way to enter/edit inventory counts against it. **Done** — no backend, no auth: the catalog is a bundled static data module and inventory lives in the browser's `localStorage`.

(This stage originally planned a Supabase backend + auth for shared inventory — dropped mid-build in favor of this simpler local-only approach. See `docs/master_plan.md`'s Tech Stack table and Open Questions for why, and the tradeoff it introduces: inventory is per-device, not shared across staff.)

## Features in this stage

- `feature-local-catalog-data.md` — the real, sourced PolyDock parts catalog as a static JS module.
- `feature-manual-inventory-entry.md` — tabbed UI to view the catalog by category and manually set/adjust stock counts, persisted to localStorage.

## Definition of done

- [x] Parts catalog data (`src/data/partsCatalog.js`) includes the researched PolyDock data, with the flagged gaps/contradictions preserved as data (not silently resolved).
- [x] A user can view the catalog, grouped into tabs by category (Dock Modules / Connectors / Accessories).
- [x] A user can manually set an inventory count for any part; it persists across page reloads via localStorage.
- [x] Basic `/code-review` pass on the catalog data and inventory UI code.
