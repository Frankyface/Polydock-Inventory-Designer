# Handoff — PolyDock Inventory & Design Tool
_Last updated: 2026-07-05 · Current stage: Stage 2 — Bulk Import (done)_

## 🎯 Goals
Let staff bulk-set inventory counts via CSV upload instead of one part at a time. Done and verified; next up is Stage 3 (design canvas) or further Stage 2 polish depending on real-world CSV format feedback.

## 📍 Current State
Stages 1 and 2 are both functionally complete and verified in-browser. The app has a tabbed inventory UI (Dock Modules / Connectors / Accessories) plus a CSV import panel: upload a file, see a preview of what will change (with unmatched rows clearly flagged and reasoned), apply to merge into the same localStorage-backed inventory Stage 1 uses. Still no backend — everything is client-side.

## 📂 Files I'm Working On
- `src/features/inventory/csvParser.js` — dependency-free CSV parser (quoted fields, embedded commas, escaped quotes).
- `src/features/inventory/matchImportRows.js` — matches parsed rows to catalog parts by SKU/id (exact) or name (exact, then unambiguous fuzzy substring fallback); validates quantities as clean whole numbers.
- `src/features/inventory/CsvImportPanel.jsx` — upload UI, preview tables, apply button.
- `src/features/inventory/useLocalInventory.js` — gained `applyBulkQuantities` (single merged state update for a whole import).
- `src/App.jsx` — now owns the single `useLocalInventory()` instance, passing state down to both `CatalogInventoryView` and `CsvImportPanel`.

## ✅ Things I've Changed
- Built CSV bulk import end-to-end: parse → match (SKU/id exact, name exact, name fuzzy-if-unambiguous) → preview (matched + unmatched-with-reasons) → apply (one merged state update).
- Ran an 8-angle parallel code review and fixed everything that survived verification:
  - **Real bug:** the hand-rolled CSV parser treated any stray `"` as opening a quoted field regardless of position, so one unescaped quote anywhere in a file would corrupt parsing for the rest of the file. Fixed — a quote now only opens a quoted field at the very start of a field; a mid-field stray quote is treated as a literal character.
  - **Real bug:** quantity validation used bare `Number.parseInt`, which silently truncates `"12.5"` to `12` or `"12abc"` to `12` instead of rejecting them. Fixed with a strict `/^\d+$/` check before parsing.
  - **Real bug:** rapid re-selection of a second file before the first one's async read finished could let the older file's result win and overwrite the newer selection's preview. Fixed with a request-generation guard.
  - **Real bug:** two identical unmatched CSV rows (same values, same failure reason) would collide on React key. Fixed by including the row's index in the key.
  - **Real gap vs. plan:** the feature doc explicitly called for a fuzzy name-match fallback to mitigate the catalog's known SKU inconsistencies, but the shipped matcher was exact-only. Added a scoped, safe fallback — an unambiguous normalized-substring match; if more than one catalog part could match, it's left unmatched rather than guessed.
  - Recorded two previously-open decisions in `feature-csv-upload.md` that had been silently made in code: additive-delta import (not full replace), and SKU-or-name matching with the scoped fuzzy fallback above.
- Verified everything end-to-end in-browser with a deliberately adversarial test CSV (SKU match, exact name match, fuzzy name match, invalid fractional quantity, unmatched SKU, a name field containing an unescaped literal quote to confirm the parser fix, and an id-based match after the quote row to confirm parsing wasn't corrupted) — all behaved as expected.

## ❌ Tried But Failed
Nothing new this session — see prior entries in git history for Stage 1's sandbox-preview-tool workarounds (still valid, documented in `CLAUDE.md`).

## ➡️ Next Up
1. Get a real sample inventory spreadsheet from the business if/when possible — the CSV header-detection patterns (`sku`/`qty`/`name` variants) are still a v1 guess per `feature-csv-upload.md`'s open questions, not validated against a real export.
2. Decide what's next on the roadmap: Stage 3 (design canvas) is the bigger, more visible piece and isn't blocked by anything.
3. When ready for Stage 3: resolve the canvas rendering approach (SVG vs. Canvas vs. DOM/CSS-grid) per `staging/stage-3-design-canvas/overview.md`'s open question.

## 🔗 Pointer
→ Current stage folder: `staging/stage-2-bulk-import/` (done) · Next stage: `staging/stage-3-design-canvas/` · Active feature file: none yet — see Next Up.
