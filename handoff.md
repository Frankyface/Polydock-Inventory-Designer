# Handoff — PolyDock Inventory & Design Tool
_Last updated: 2026-07-05 · Current stage: Stage 3 — Design Canvas (done)_

## 🎯 Goals
Give staff a 2D canvas to lay out real PolyDock modules at true scale, snapping edge-to-edge with correct seam classification (straight vs. notched connector needed). Done and verified; Stage 4 (stock-aware BOM) is the next real milestone — it's what actually consumes the seam data this stage produces.

## 📍 Current State
Stages 1–3 are all functionally complete and verified in-browser. The app has: a tabbed inventory UI with CSV bulk import (Stages 1–2), and a full design canvas (Stage 3) — a "Designs" tab where staff create/list/edit designs, drag real dock modules onto an SVG grid at true scale, snap them flush, rotate in 90° steps, and see every seam automatically classified as needing a straight or notched connector (color-coded). Designs save/reload correctly. Still no backend — everything is client-side localStorage.

## 📂 Files I'm Working On
- `src/features/design/geometry.js` — the core geometry engine: footprint/bounds from rotation, snap-to-adjacent-edge, and seam/junction classification (including the 3+-way corner-convergence case fixed this session).
- `src/features/design/useDesigns.js` — localStorage-backed design CRUD, now using the shared `useLocalStorageState` hook.
- `src/features/design/DesignCanvas.jsx` — the SVG canvas: pointer-based drag/snap, now with SVG-root-level move/up handlers (robust even if `setPointerCapture` fails), click-vs-drag distinction, and defensive filtering against stale catalog references.
- `src/features/design/DesignEditor.jsx` — toolbar (name, free-design toggle, rotate/delete/save), now with a dirty-check confirm before discarding unsaved edits on Back.
- `src/features/design/DesignsPage.jsx` — list/editor switching; new designs are an in-memory draft until first Save (nothing persists to localStorage until then).
- `src/lib/id.js`, `src/lib/useLocalStorageState.js` — new shared helpers, extracted to remove duplication between `useDesigns.js` and `useLocalInventory.js`.

## ✅ Things I've Changed
- Built the full design canvas: catalog-driven module footprints, drag-to-snap (flush, zero-gap, matching the manufacturer's no-expansion-gap design), 90°-increment rotation, save/load designs, free-design toggle.
- Ran an 8-angle parallel code review and fixed everything that survived verification:
  - **Real correctness bug, most significant:** `computeSeams` couldn't detect a true 4-way cross (e.g. a 2×2 grid of modules meeting at one shared corner) — each of the 4 seams looked like an independent clean "straight" join in isolation, but the manufacturer's rule requires notched connectors for platform/cross junctions. Verified by direct simulation, then fixed by detecting when 3+ seams share a single endpoint and upgrading all of them to "notched." Re-verified live in the browser (a 2×2 grid now correctly shows all 4 seams as notched/orange).
  - **Real bug:** `setPointerCapture` throws on the kind of synthetic pointer events used for testing (and can fail in some real environments too) — since it ran before the state update in the original code, a thrown exception silently aborted drag-start entirely. Fixed by reordering, wrapping in try/catch, and — more robustly — moving the move/up/cancel handlers to the SVG root instead of the per-shape element, so dragging no longer depends on capture succeeding at all.
  - **Real bug:** a plain click (no movement) re-ran the snap logic and could nudge an already-snapped module's position by a fraction of a foot. Fixed by tracking whether the pointer actually moved before re-snapping.
  - **Real gap:** clicking "← Back" silently discarded all unsaved edits with zero warning. Fixed with a dirty-check confirm dialog (only prompts if something actually changed).
  - **Real gap:** a brand-new design was persisted to localStorage the instant "+ New design" was clicked, before the user did anything — backing out left a permanent empty orphan record. Fixed: a new design now lives only in the editor's local state until the first Save.
  - **Robustness gap:** nothing guarded against a saved design referencing a `partId` no longer in the catalog (a real forward-compatibility concern given the catalog itself is documented as having known data gaps) — would have crashed the whole canvas. Fixed with defensive filtering.
  - **Real duplication:** `useDesigns.js` and `useLocalInventory.js` had byte-for-byte identical localStorage load/save patterns, and two separate ID-generation functions did the same thing. Extracted to `src/lib/useLocalStorageState.js` and `src/lib/id.js`.
  - **Real, currently-reachable performance issue:** the O(n²) seam computation and the ~100-line grid were both recomputing on every single pointermove during a drag (since `items` itself doesn't change until drop, only the drag preview does). Fixed with `useMemo`/`React.memo` — this is a real interactive-responsiveness fix, not premature optimization.
  - Minor: `onSave`'s payload now includes `design.id` so the editor is self-contained rather than relying on the caller already tracking which design is active; deduplicated `computeSnappedPosition`'s 4 near-identical branches; seam-length matching now requires the contact length to be within a tight epsilon of a whole foot rather than blindly rounding.
- Verified everything end-to-end in the browser: draft-not-persisted-until-save, dirty-check confirm (both cancel and confirm paths), the 2×2 cross-junction fix (visually and via the actual computed seam colors), click-without-drag no longer nudging position, and the save→edit→re-save update path (confirmed it updates in place, doesn't duplicate).

## ❌ Tried But Failed
Nothing new this session on the "tried but failed" front — all fixes landed. See prior entries in git history for Stage 1's sandbox-preview-tool workarounds (still valid, documented in `CLAUDE.md`).

## ➡️ Next Up
1. Stage 4 (Stock-Aware BOM) is the natural next stage — it's what actually consumes `computeSeams`' output (module + connector list) to check against real inventory and commit/deduct stock. Nothing blocks starting it.
2. Real interactive testing (actual mouse/touch use, not just automated verification) should validate `SNAP_TOLERANCE_FT` and the independent-per-axis-snapping limitation noted in `staging/stage-3-design-canvas/overview.md`.
3. Get a real sample inventory spreadsheet from the business when possible, to validate Stage 2's CSV header-detection guesses (still unvalidated against a real export).

## 🔗 Pointer
→ Current stage folder: `staging/stage-3-design-canvas/` (done) · Next stage: `staging/stage-4-stock-aware-bom/` · Active feature file: none yet — see Next Up.
