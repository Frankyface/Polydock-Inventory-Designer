# Feature — Connector Matching

The core business-logic engine: given a seam between two (or more) modules, determine the correct connector part. **Done** — the matching itself lives in `geometry.js`'s `computeSeams` (added in Stage 3, since it needs the same seam/junction classification the canvas renders); Stage 4's `bom.js` consumes its output (`connectorPartId`, `isGangwayAttachment`) to build the actual parts list.

## Confirmed rule (from user + manufacturer research)

1. **Straight seam (2 modules meet along one edge):** pick the standard connector whose length matches the seam's length exactly (e.g. a 10' edge → the 10' standard connector).
2. **Junction seam (3+ modules meet at a point — T/L/cross layouts):** pick the notched connector of matching length instead of the standard one.
3. **Corners (90° turns):** not a connector decision at all — the layout must use a dedicated Corner float module; the corner module's own seams then follow rules 1–2 like any other module.
4. **Gangway/ramp attachment seams** (added in Stage 3): not a `CONNECTOR_RULES` lookup at all — these use dedicated hinge/connector hardware selected by `GANGWAY_ATTACHMENT_RULES` in `partsCatalog.js` (width-4ft ramps/gangways → 4' Ramp Connector or Gangway-to-PolyDock Hinge; the 6ft ramp → 6' Ramp Connector). This selection is inferred from each part's own sourceNotes, not independently confirmed against a manufacturer install guide — see `feature-gangways.md`.

## Resolved

- **A seam with no matching connector SKU (open question, resolved):** blocked, with a visible warning — not a silent fallback to the nearest length. `bom.js`'s `computeBom` counts these as `unresolvedCount`; `BomPanel.jsx` shows "N seams need a connector or hinge part not in the catalog — resolve before committing," and `DesignEditor.jsx`'s `canCommit` requires `unresolvedCount === 0`. This can currently happen for a 2ft edge (no `connector-straight-2`/`connector-notched-2` catalog SKU exists) or a 10ft notched junction (no `connector-notched-10` exists in any source) — both real, documented catalog gaps, not bugs.
- **Rod-count-per-connector-length:** confirmed not needed for v1 — "1 connector part = done" is what `computeBom` counts; rods aren't separately tracked.
- **The two unverified connector items** (Flexible/Hinge-Style, Heavy-Duty) are correctly excluded — they're not in `CONNECTOR_RULES`, so `connectorRuleFor` can never select them.

## Open Questions

- `GANGWAY_ATTACHMENT_RULES`' width→hardware mapping is inferred, not confirmed against a real install guide (see `feature-gangways.md`) — worth a real dealer/installer confirmation pass before this drives an actual purchase order.
