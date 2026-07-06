# Feature — Accessory Placement

Lets staff place accessories (cleats, bumpers, ladders, pile hoops, etc.) on the canvas for layout planning, alongside modules. **Done** — `src/features/design/Palette.jsx`, `AccessoryMarker.jsx`.

Added after the initial Stage 3 build, per explicit user request.

## How it works

- The palette gained category tabs (Modules / Gangways / Accessories) instead of showing modules only — `src/features/design/Palette.jsx`.
- Accessories are placed as small freely-draggable markers (`AccessoryMarker.jsx`), distinct from modules/gangways:
  - **No footprint** — unlike modules/gangways, they don't have `dimensions.nominalEdgesFt` (see `geometry.js`'s `hasFootprint`), so they render as a small circle marker rather than a true-to-scale rectangle.
  - **No snapping** — dropped exactly where released; snapping to a module edge only makes physical sense for some accessories (e.g. a cleat mounted on a deck edge) and not others (e.g. an anchor plate), so v1 keeps it simple and universal: free placement everywhere.
  - **No rotation** — the Rotate toolbar button is disabled when the selection has no footprint, since a point marker has no orientation to rotate.
  - **Excluded from seam computation** — `computeSeams` only operates on footprint items (modules/gangways); accessories never appear in the connector-matching logic.

## Open Questions

- Should some accessories (e.g. cleats, which really do mount to a specific deck edge) eventually snap to the nearest module edge rather than floating freely? Deferred until it's clear this matters in practice — free placement is simpler and still useful for "mark roughly where this goes" planning.
- No visual distinction between different accessory types yet (all render as the same circle marker with a text label) — fine for a first pass, could use per-type icons later.
