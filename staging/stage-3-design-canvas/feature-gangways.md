# Feature — Gangways & Ramps

Gangways/ramps (the walkway connecting shore to the floating dock) were missing from the original catalog research entirely — added after the initial Stage 3 build, per explicit user request ("add them so they can make sense").

## Research summary

Real, sourced PolyDock/ShoreMaster gangway and ramp products exist and were added to `src/data/partsCatalog.js` under a new `gangway` category:

- **Gangways** (steeper shorelines/fluctuating water): ShoreMaster 4' x 16'/20'/24' Residential Gangway — SKU'd, priced ($3,425–$5,264), confirmed via direct dealer product pages (20ft's SKU is inferred by sequence, not independently confirmed).
- **Ramps** (stable water, short spans): 4', 8', and 6'x8' Aluminum Ramp frames. The 6'x8' size is confirmed to exist via PolyDock's own official assembly-instructions PDF accessories index, but no dealer SKU/price was found for it.
- **Hinge/attachment hardware** (added as `accessory` category items, not `gangway` — see below): PolyDock 4'/6' Ramp Connector, PolyDock Double Hinge Assembly, ShoreMaster Gangway-to-PolyDock Dock Hinge, plus water-end support hardware (roller kit, float cradle, float module).

Full sourcing detail (SKUs, prices, confidence caveats) is in `src/data/partsCatalog.js`'s comments — same rigor as the original catalog research (manufacturer PDF + dealer pages, gaps preserved as data not silently resolved).

## How it works on the canvas

- Gangway/ramp frames have `dimensions.nominalEdgesFt` (like modules), so they automatically get true-to-scale rendering, drag-to-snap, and participate in seam detection through the same `geometry.js` functions modules use — no gangway-specific canvas code was needed for placement itself.
- **Seam classification excludes gangway attachments from the standard connector-matching rule.** A gangway snapped flush against a module edge is real (the dock end genuinely does attach there), but it uses dedicated hinge hardware (Ramp Connector, Double Hinge Assembly, or Gangway-to-PolyDock Hinge — all catalog `accessory` items), not a standard straight/notched PolyDock connector. `computeSeams` now flags such seams with `isGangwayAttachment: true` and skips the `CONNECTOR_RULES` lookup for them, rendering them as a distinct dashed purple line (`SeamLine.jsx`) rather than the blue/orange straight/notched colors.
- The hinge/attachment hardware itself (Ramp Connector, Double Hinge Assembly, etc.) is cataloged under `accessory`, not `gangway` — it's point hardware, not a walkable span, so it uses the same free-placement `AccessoryMarker` as cleats/bumpers rather than a footprint shape.

## Open Questions

- Stage 4's BOM logic will need to actually pick which hinge hardware applies to a given gangway-attachment seam (width-dependent: 4ft ramps/gangways use the 4' Ramp Connector or Gangway-to-PolyDock Hinge depending on gangway vs. ramp; 6ft ramps use the 6' Ramp Connector) — that selection logic doesn't exist yet, only the seam-level flag marking that a gangway-specific rule is needed.
- The shore end of a gangway is just another free corner today (nothing marks it as "resting on land" vs. "floating") — the research's suggestion to render it distinctly wasn't implemented in this pass; revisit if it turns out to matter for real designs.
- Several gangway/ramp catalog entries have real, documented gaps (missing SKUs, inferred SKUs, price ranges reduced to a midpoint) — see `partsCatalog.js` source notes; worth a real dealer confirmation pass before this drives anything customer-facing, same caveat as the original catalog.
