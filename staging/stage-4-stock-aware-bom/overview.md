# Stage 4 — Stock-Aware BOM

## Goal

This is the stage that actually fixes "the disconnect" — the founding problem behind the whole project. When modules snap together on the canvas, auto-calculate the full parts list (matching connectors to seams by the confirmed length/junction rule), show a live stock-check against real inventory, and let a user commit a design so it reserves/deducts those parts from stock for real.

## Features in this stage

- `feature-connector-matching.md` — the seam → connector matching engine (length-matched straight connectors; notched connectors at 3+-way junctions).
- `feature-stock-check.md` — live green/red "you have enough" vs. "short by X" indicator against real inventory.
- `feature-commit-inventory.md` — commit flow that reserves/deducts parts, plus a release/cancel path back to stock.

## Definition of done

- [ ] Every seam on a non-free design resolves to exactly one connector part, correctly choosing straight vs. notched based on how many modules meet at that seam.
- [ ] The BOM (modules + connectors, quantities) is derived automatically from canvas state — never hand-entered.
- [ ] The stock-check indicator updates live as the design changes, and clearly states what's short and by how much.
- [ ] Committing a design deducts/reserves the BOM from `inventory` in a single transaction (no partial-commit state); releasing a committed design returns the parts to stock.
