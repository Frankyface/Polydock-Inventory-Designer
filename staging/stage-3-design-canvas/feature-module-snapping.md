# Feature — Module Snapping

Drag-and-snap logic: detecting when a dragged module's edge is close enough to another module's edge to snap, and rendering everything at true relative scale from the catalog's `module_edges` dimensions.

## Open Questions

- Snap tolerance (how close is "close enough")? Needs real interaction testing once the canvas exists — not a number to guess up front.
- Rotation — do modules need to rotate (e.g. a 3'x10' placed vertically vs. horizontally), and if so, in 90° increments only or free rotation? Corners in particular likely need rotation to build L/T/U shapes per the manufacturer's documented layout patterns (`docs/master_plan.md` glossary).
- How does snapping distinguish "this seam is a simple straight join" from "this seam is actually a 3-way junction needing a notched connector"? This is the exact join-type detection the Stage 4 auto-BOM logic depends on — needs to be solved here, not deferred, since it's fundamentally a canvas/geometry problem.
