# PolyDock Inventory & Design Tool — Master Plan

## Pitch

A web app for a PolyDock dealer/installer that closes the gap between "designing a dock layout" and "knowing if you can actually build it." Staff lay out real PolyDock modules on a 2D snapping grid canvas; the tool automatically calculates the full parts list (modules, connectors, corner pieces, accessories) the design requires, checks it live against real warehouse inventory, and — when a design is committed — actually deducts/reserves those parts from stock.

## Problem & Why

The builder used to work at a PolyDock dealer/installation business. The recurring pain there wasn't tracking stock and it wasn't designing layouts — both of those are manageable in isolation. The pain was **the disconnect between the two**: someone designs a dock layout that looks great, and only afterward discovers it doesn't match what's actually sitting in the warehouse. This tool exists to close that gap by making the design tool and the inventory system the same system.

## Target Users & Use Cases

- **Primary user:** staff at a PolyDock dealer/installation business (not the general public — this is being built proactively for a business the founder used to work at, not one they currently run).
- **Top jobs-to-be-done:**
  1. Lay out a proposed dock configuration visually, at true scale, using real PolyDock parts.
  2. Know immediately whether the business has enough stock to build it, or exactly what's short.
  3. Commit a design so it actually reserves/deducts the parts from real inventory — turning a "concept" into a real, tracked build.
  4. Track and adjust raw inventory counts directly (manual entry or bulk spreadsheet upload) independent of any design.

## v1 Scope

**In scope:**
- Inventory: manual entry **and** spreadsheet/CSV bulk upload. No import from any existing external system — this is a clean slate.
- Parts catalog bundled with the app from real PolyDock data (see [Glossary](#glossary) and `staging/stage-1-foundation/feature-catalog-seed.md` for the full sourced catalog) — dock sections in 6 sizes, a corner section, connectors in multiple lengths (straight + notched), and accessories/anchoring hardware.
- Design tool: 2D top-down grid canvas. Real dock modules are dragged onto the grid at true relative scale and snap edge-to-edge.
- Auto-BOM: when modules snap together, the tool matches the connector to the seam using the confirmed rule — **connector length matches the length of the abutting edge**, with **notched connectors** used instead of straight ones at T/L/cross junctions where 3+ sections meet at a point. Corners are their own dedicated float module, not a connector.
- Stock awareness: a live green/red "you have enough" vs. "short by X" indicator against real inventory, **and** a "free design" mode that ignores stock entirely.
- Commit flow: finishing a design reserves/deducts the calculated parts from inventory (not read-only-only) — both behaviors ship in v1, not staged.

**Important tradeoff (changed mid-build):** inventory lives in the browser's `localStorage`, not a shared backend. This was a deliberate simplification to drop Supabase entirely (no account/project-limit blockers, no auth, trivial static-only deploy) — but it means inventory is **per-browser/per-device, not shared across staff**. Two people on two computers each have their own separate counts; there's no real-time "the whole business sees the same stock number." If/when multiple staff need one shared source of truth, this needs a real backend again (Supabase remains the natural choice — see Future Roadmap).

**Explicitly OUT of v1 (non-goals):**
- Importing an existing external inventory system (there isn't one to import from right now).
- Multi-location/multi-warehouse support.
- A customer-facing self-service portal.
- Real pricing/quote generation beyond the calculated parts list (the researched prices are dealer-listed, not official MSRP — see catalog gaps below).
- A native mobile app.
- Modeling water-gap/expansion spacing between modules (PolyDock's own manual documents none — modules are joined flush).
- Anchoring-quantity automation (pile/chain/stiff-arm counts) — the manufacturer itself does not publish a numeric ratio; this is dealer judgment, not something the tool should compute.

## Future Roadmap (6–12 months)

Not committed, but the architecture should not foreclose these:
- **A real shared backend** (Supabase is the natural choice — already evaluated) once/if multiple staff need one shared, real-time inventory instead of per-device localStorage.
- Multi-location inventory.
- Real pricing/quoting output from a design (the parts catalog already carries dealer-observed prices as a starting point).
- Customer-facing read-only or request-a-quote view of a finished design.
- Importing/reconciling against a real external inventory system, if the business adopts one.
- Support for additional dock brands/product lines beyond PolyDock.

## Tech Stack & Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Hosting | GitHub Pages (repo: [Frankyface/Polydock-Inventory-Designer](https://github.com/Frankyface/Polydock-Inventory-Designer)) | User's explicit choice. Static-only — no server runtime available. |
| Frontend | React + Vite, built as a static SPA | GitHub Pages can only serve static files; Vite produces a clean static build and has a fast dev loop for the canvas/UI work ahead. |
| Data & storage | Parts catalog bundled as a static JS module (`src/data/partsCatalog.js`); inventory counts in the browser's `localStorage` | Pivoted away from Supabase mid-build (see below) to cut all backend/auth complexity for v1 — no accounts, no project-limit blockers, trivial static-only deploy. Tradeoff: inventory is per-device, not shared (see v1 Scope). |
| ~~Backend/DB~~ (dropped) | ~~Supabase (Postgres + Auth)~~ | Originally planned for shared real-time inventory + auth-gated writes. Dropped by explicit user decision mid-build in favor of the simpler local-storage approach above — a real backend is still the right answer if/when shared multi-staff inventory is needed (see Future Roadmap). |
| Canvas | Custom 2D grid canvas (no heavyweight canvas library) using module dimensions from the catalog for true-to-scale snapping | Keeps the bundle small and the snapping logic (ours to get right per the connector-matching rule) fully visible and testable, rather than fighting a general-purpose canvas library's abstractions. |
| CSV import | Client-side parsing, writing straight into the same localStorage-backed inventory state | No backend to write to — it's all client-side. |

## Architecture Sketch

```
┌───────────────────────────────────────┐
│  React + Vite SPA (GitHub Pages)      │
│  - src/data/partsCatalog.js (static)  │
│  - Inventory views (tabbed by category)│
│  - Design canvas (Stage 3+)           │
│  - BOM / stock-check panel (Stage 4+) │
│  - browser localStorage (inventory)   │
└───────────────────────────────────────┘
```

No server, no database, no auth — everything above runs in the user's browser. This is intentionally the simplest thing that could work for a single-device MVP.

## Staged Roadmap

| Stage | Goal | Headline feature |
|---|---|---|
| 1 — Foundation | Catalog + local inventory | Bundled PolyDock parts catalog, tabbed manual inventory entry backed by localStorage — **done** |
| 2 — Bulk Import | Fast data entry | CSV/spreadsheet upload for inventory counts — **done** |
| 3 — Design Canvas | Core visual tool | 2D grid canvas, real modules snap edge-to-edge, free-design mode — **done** |
| 4 — Stock-Aware BOM | The core "disconnect" fix | Auto-connector-matching, live stock check, commit-to-inventory (reserve/deduct + release) |
| 5 — Deploy & Polish | Ship it | GitHub Actions build → GitHub Pages, docs, cleanup |

## Open Questions & Risks

- **Inventory is per-device, not shared** — this is the biggest behavior change from the original plan (which called for real, shared, business-wide inventory). If the business needs multiple staff seeing the same stock numbers, this needs a real backend (see Future Roadmap). Flagging prominently since it's a genuine scope reduction, not a subtle detail.
- **Catalog data has real unresolved gaps and contradictions** (full detail in `staging/stage-1-foundation/feature-catalog-seed.md`), most notably:
  - The 4' Corner Section's load capacity is reported as both 225 lbs and 500 lbs in different sources — unresolved.
  - Two connector-category items ("Flexible/Hinge-Style Connector," "Heavy-Duty Connector") appear only in marketing copy, not in the manufacturer's own assembly-instructions PDF — likely not real distinct SKUs, excluded from the connector-matching rules pending dealer confirmation.
  - Several SKU inconsistencies exist (21" Accessory Connection Plate, 8" Dock Cleat vs. 8" Pile Hoop numbering overlap) — flagged, not silently resolved.
  - All prices are dealer-listed (boatliftanddock.com, shopshoremaster.com), not manufacturer MSRP — treat as approximate/regional, not authoritative.
- **No manufacturer-published anchor-count ratio** — the tool should not try to auto-compute anchoring hardware quantities; that stays a dealer judgment call, at least in v1.
- **GitHub push credentials** — Windows Credential Manager is configured; first push may prompt an interactive GitHub auth flow.
- **No cross-tab sync** — two tabs of the app open on the same device won't live-update each other's inventory edits until a reload/refocus (each tab reads localStorage once, on mount); acceptable for v1's single-device-at-a-time usage but worth knowing.

## Glossary

- **Dock module / section** — a single floating HDPE float unit (e.g. 4'x6', 3'x10', 4'x10', 5'x10', 6'x8'). The basic buildable unit on the canvas.
- **Corner section** — a dedicated 4' float module used to create 90-degree turns (L/T/U-shaped layouts); not a connector.
- **Connector** — the two-piece top/bottom hardware clamp joining two adjacent modules along one seam. Comes in fixed lengths (1'–10') matched to the seam length being joined — one connector spans the whole seam, not several short ones.
- **Notched connector** — a connector variant used instead of a standard straight connector at T/L/cross junctions where 3+ sections meet at a point; same length options, different geometry.
- **Seam** — the edge where two modules meet; determines which connector length is needed.
- **BOM (bill of materials)** — the full computed parts list (modules + connectors + accessories) required to build a given design.
- **Free design mode** — a design-tool mode that ignores real inventory entirely, for concept/exploration work.
- **Commit** — finalizing a design so its BOM is actually reserved/deducted from real inventory.
