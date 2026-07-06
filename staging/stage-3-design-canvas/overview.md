# Stage 3 — Design Canvas

## Goal

The core visual tool: a 2D top-down grid canvas where staff drag real PolyDock modules (at true relative scale) and snap them together edge-to-edge, in a "free design" mode that doesn't yet touch inventory (that reconciliation is Stage 4).

## Features in this stage

- `feature-grid-canvas.md` — the canvas itself: grid, pan/zoom, module palette.
- `feature-module-snapping.md` — drag-and-snap logic, edge detection, true-to-scale rendering from catalog dimensions.
- `feature-free-design-mode.md` — the stock-agnostic design mode and how it's toggled/labeled.

## Definition of done

- [ ] A user can drag any catalog module onto the canvas at its true relative size.
- [ ] Adjacent modules snap edge-to-edge cleanly, with a visible seam.
- [ ] A design (its module placements) can be saved and reloaded.
- [ ] Free design mode is clearly indicated in the UI as not being checked against real stock.

## Open Questions

- What canvas rendering approach — SVG, HTML5 Canvas, or a DOM/CSS-grid-based approach? Needs a decision at the start of this stage based on how complex snapping/rotation turns out to be; not decided yet since Stage 1–2 come first.
