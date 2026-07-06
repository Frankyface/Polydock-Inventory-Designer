# Feature — Local Catalog Data

Real PolyDock parts catalog researched from the manufacturer's own site/PDF and two authorized ShoreMaster dealers. Lives entirely in `src/data/partsCatalog.js` — a static JS module bundled with the app (`PARTS` array, plus `CONNECTOR_RULES` for Stage 4's connector-matching engine). No database — see `docs/master_plan.md` for why (Supabase was dropped mid-build in favor of local-only storage).

**Primary source (highest confidence):** PolyDock's own "Product Assembly Instructions" PDF (`static.shoremaster.com/instructions/...`), linked from `polydockproducts.com`'s own instructions/specifications pages. Confirms connector lengths, the seam-length-matching rule, notched-connector usage, and torque/assembly specs directly from the manufacturer.

**Secondary sources (SKU/price detail, dealer-listed):** boatliftanddock.com, shopshoremaster.com — both authorized ShoreMaster/PolyDock dealers. Prices and some SKUs come from here since `polydockproducts.com` doesn't publish either publicly.

## Dock modules (6 sizes + corner)

| Module | Dimensions (L x W x H) | Load rating | SKU (Tan) |
|---|---|---|---|
| 4'x6' Section | 72.75" x 50.875" x 16" | 1,550 lbs | 1022946 |
| 3'x10' Section | 123.7" x 36.4" x 16" | 1,875 lbs | 1022945 |
| 4'x10' Section | 123.625" x 50.875" x 16" | 2,625 lbs | 1022944 |
| 5'x10' Section | 123.7" x 65.5" x 16" | 3,375 lbs | 1022948 |
| 6'x8' Section | 101.875" x 72.75" x 16" | 3,075 lbs | 1022947 |
| 4' Corner Section | 50.5" x 50.5" (~71.48" diagonal) x 16.125" | 225 lbs (see contradiction below) | 1022949 |

All Tan/Gray, rotationally molded HDPE, sandstone brick-pattern non-slip deck.

## Connectors

- **Standard (straight) connector** — joins two modules along a simple straight seam. Lengths: 1', 2'*, 3', 4', 5', 6', 8', 10'. **One connector spans the entire seam, sized to match the seam's length** — this is the confirmed matching rule the whole design tool's auto-BOM logic depends on (`CONNECTOR_RULES` in `partsCatalog.js`).
- **Notched connector** — same length range (2'–8'), used instead of the standard connector at T/L/cross junctions where 3+ sections meet at a point; the notch fills the void the perpendicular seam creates.
- **Corners are not a connector** — 90-degree turns use the dedicated 4' Corner float module above; the corner module's own seams then use standard/notched connectors like any other module.

*2' standard length is inferred from the notched-connector list, not independently confirmed — flagged, not silently assumed (`isVerified: false` on that catalog entry).

## Accessories (selected — full list in `src/data/partsCatalog.js`)

Dock cleats, vertical bumpers (+ required connection bracket), pivoting ladders (+ required ladder connector kit), 6"/21" accessory connection plates, wheel caddy, pile hoops (8"/10"/12"), poly pipe brackets (light/heavy duty), chain anchor plates + chain guide brackets, stiff-arms (light/heavy duty), connector rods (composite + stainless upgrade).

## Known gaps and contradictions (kept as data, not silently resolved)

- **4' Corner Section load capacity contradiction:** 225 lbs vs. 500 lbs reported in different sources. Catalog uses 225 lbs (the more specific figure), notes both in `sourceNotes`, and marks `isVerified: false`.
- **Two unverified "connector" products** ("Flexible/Hinge-Style Connector," "Heavy-Duty Connector") appear only in marketing copy, not the manufacturer's own assembly PDF — `isVerified: false`, excluded from `CONNECTOR_RULES` until confirmed.
- **SKU inconsistencies:** 21" Accessory Connection Plate (SKU 1006615 vs. dealer product ID 1116 vs. no SKU at all in a third listing); 8" Dock Cleat's SKU (1006632-08) shares a base number with the unrelated 8" Pile Hoop (1006632) — don't use `1006632` alone as a unique key (the catalog uses distinct `id` slugs, not raw SKUs, as the actual identifier for exactly this reason).
- **No manufacturer-published anchor-count ratio** — do not build a feature that auto-computes anchor quantity; out of scope per `docs/master_plan.md`.
- **All prices are dealer-listed**, not manufacturer MSRP — `priceType: 'dealer_listed'`; treat as approximate throughout the UI.
- **No 10' notched connector exists** in any source — a 10ft junction seam has no entry in `CONNECTOR_RULES`; Stage 4's matching engine must handle this gap explicitly (see `staging/stage-4-stock-aware-bom/feature-connector-matching.md`).

## Open Questions

- `isVerified: false` items are currently shown in the catalog UI with a visible "unconfirmed" badge rather than hidden — the user (who worked at the business) may recognize/confirm some of these from memory.
- Gray-color variants are not modeled as separate catalog entries (just a `color` field on the Tan entry) since dimensions/pricing are ~identical between colors where both were reported — revisit if Gray-specific SKUs/pricing turn out to matter.
