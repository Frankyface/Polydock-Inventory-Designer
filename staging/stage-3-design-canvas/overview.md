# Stage 3 — Design Canvas

## Goal

The core visual tool: a 2D top-down grid canvas where staff drag real PolyDock modules (at true relative scale) and snap them together edge-to-edge, in a "free design" mode that doesn't yet touch inventory (that reconciliation is Stage 4). **Done.**

## Features in this stage

- `feature-grid-canvas.md` — the canvas itself: grid, module palette.
- `feature-module-snapping.md` — drag-and-snap logic, edge detection, seam/junction classification, true-to-scale rendering from catalog dimensions.
- `feature-free-design-mode.md` — the stock-agnostic design mode and how it's toggled/labeled.
- `feature-accessory-placement.md` — placing accessories (cleats, bumpers, etc.) as freely-positioned markers, added post-launch per user request.
- `feature-gangways.md` — gangways/ramps, a real product category missed in the original catalog research, added post-launch: placeable spans + dedicated hinge hardware, excluded from the standard connector-matching rule.
- `feature-background-image.md` — uploading a reference photo (e.g. a Google Maps screenshot) as a positionable/scalable background layer, added post-launch.

## Definition of done

- [x] A user can drag any catalog module onto the canvas at its true relative size.
- [x] Adjacent modules snap edge-to-edge cleanly, with a visible seam (color-coded straight vs. notched vs. gangway-attachment).
- [x] A design (its module placements) can be saved and reloaded.
- [x] Free design mode is clearly indicated in the UI as not being checked against real stock (a per-design checkbox, stored with the design).
- [x] Accessories can be placed on the canvas as freely-positioned markers.
- [x] Gangways/ramps can be placed and snapped like modules, with their attachment seams correctly distinguished from standard module-to-module connectors.
- [x] A background reference photo can be uploaded, positioned, scaled, and made semi-transparent.

## Open Questions

- Canvas rendering approach was resolved as **SVG** — real coordinate-based geometry, easy hit-testing via pointer events, no heavyweight library. Vindicated by how directly the seam-classification math (`geometry.js`) maps onto it.
- **Independent per-axis snapping** can, in principle, snap a module's X to one neighbor and Y to a different neighbor, landing it flush against neither exactly (found in review, not yet hit in manual testing). A full fix means joint corner-aware snapping (find the single best neighbor forming a consistent corner, not two independent nearest-edges) — deferred until real usage shows this actually causing problems.
- `SNAP_TOLERANCE_FT = 1` (in `constants.js`) is still an unvalidated starting guess, same as originally flagged — real interactive use (and feedback from whoever actually uses the canvas) should drive the real number.
