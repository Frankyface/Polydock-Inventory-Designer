# Feature — Module Snapping

Drag-and-snap logic: detecting when a dragged module's edge is close enough to another module's edge to snap, classifying every resulting seam, and rendering everything at true relative scale from the catalog's dimensions. **Done** — `src/features/design/geometry.js`, `DesignCanvas.jsx`.

## How it works

- **Snapping** (`computeSnappedPosition`): on drop, checks the dragged module's 4 edges against every other placed module's edges; if within `SNAP_TOLERANCE_FT` and the perpendicular ranges overlap, snaps that axis flush (zero gap, matching the manufacturer's no-expansion-gap design). X and Y are resolved independently.
- **Rotation**: 90°-increment only (0/90/180/270), matching real dock layouts (axis-aligned per the manufacturer's own diagrams). Rotating swaps a module's two edge lengths.
- **Seam classification** (`computeSeams`) — this is the join-type detection Stage 4's auto-BOM depends on:
  - A seam is **straight** only if it's the sole contact on both modules' respective edges, AND the contact spans the full length of both edges.
  - A seam is **notched** if the edge is only partially covered, or more than one neighbor touches the same edge (a mid-edge T-junction) — **or** if 3+ modules' corners converge at a single shared point (a cross/platform junction, e.g. a 2x2 grid) even when each individual seam looks like a clean 2-module match in isolation. This corner-convergence case was a real gap found in code review (verified via simulation: a 2x2 grid of modules was being classified as 4 independent "straight" seams) and fixed by checking seam endpoints for 3+-way convergence.
  - Connector length is matched via `CONNECTOR_RULES` only when the seam length is within a tight epsilon of a whole foot — a seam that doesn't cleanly resolve to an integer length gets `connectorPartId: null` (surfaced as a real gap) rather than silently rounding to a plausibly-wrong connector.

## Known limitations (found in review, accepted for v1)

- Independent per-axis snapping can produce a position that's flush on X against one neighbor and flush on Y against a different neighbor, without verifying the combined position is actually flush against either. See `overview.md`'s open questions.
- `SNAP_TOLERANCE_FT` is still an unvalidated placeholder.

## Open Questions

- Should snapping become tolerance-aware of *which* neighbor it's snapping to as a pair (joint corner snapping), rather than independent per-axis? Only worth the complexity if real use shows the current approach producing bad results.
- Real interactive testing (mouse/touch feel, not just automated verification) is still needed to tune `SNAP_TOLERANCE_FT`.
