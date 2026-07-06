# Stage 4 — Stock-Aware BOM

## Goal

This is the stage that actually fixes "the disconnect" — the founding problem behind the whole project. When modules snap together on the canvas, auto-calculate the full parts list (matching connectors to seams by the confirmed length/junction rule), show a live stock-check against real inventory, and let a user commit a design so it reserves/deducts those parts from stock for real. **Done** — `src/features/design/bom.js`, `BomPanel.jsx`, and the commit/release wiring in `DesignEditor.jsx`/`DesignsPage.jsx`.

## Features in this stage

- `feature-connector-matching.md` — the seam → connector matching engine (length-matched straight connectors; notched connectors at 3+-way junctions), plus gangway-attachment hardware matching.
- `feature-stock-check.md` — live "OK" vs. "short by X" indicator against real inventory.
- `feature-commit-inventory.md` — commit flow that deducts parts, plus a release path back to stock.

## Definition of done

- [x] Every seam on a non-free design resolves to exactly one connector part (or gangway-attachment hardware part), correctly choosing straight vs. notched based on how many modules meet at that seam. Seams with no matching catalog part are flagged (`unresolvedCount`), not silently guessed — see `feature-connector-matching.md`'s resolved open question.
- [x] The BOM (modules + gangways + accessories + connectors + gangway hardware, with quantities) is derived automatically from canvas state — never hand-entered. See `bom.js`'s `computeBom`.
- [x] The stock-check indicator updates live as the design changes, and clearly states what's short and by how much. Free designs show the parts list without a stock check (confirmed decision — "free design ignores stock").
- [x] Committing a design deducts the BOM from `inventory` via a relative-delta update computed inside the state updater itself (not a value the caller precomputed from a stale render), so it stays correct even under a rapid double-click; releasing a committed design returns the parts to stock the same way. A committed design freezes canvas/name/free-design-toggle/background edits until released — see `feature-commit-inventory.md` for what "single transaction" means in a localStorage-only app (and what it doesn't cover).
