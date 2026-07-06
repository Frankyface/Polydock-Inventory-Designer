// Real PolyDock parts catalog, researched from the manufacturer's own
// "Product Assembly Instructions" PDF (static.shoremaster.com, linked from
// polydockproducts.com) plus two authorized ShoreMaster/PolyDock dealers
// (boatliftanddock.com, shopshoremaster.com) for SKUs/pricing not published
// by the manufacturer. Known gaps/contradictions are preserved as data, not
// silently resolved — see staging/stage-1-foundation/feature-catalog-seed.md.
//
// This is the entire "database" for v1: no backend, just this module plus
// whatever's in the user's browser localStorage (see useLocalInventory.js).

export const CATEGORIES = ['module', 'connector', 'gangway', 'accessory']

export const CATEGORY_LABELS = {
  module: 'Dock Modules',
  connector: 'Connectors',
  gangway: 'Gangways & Ramps',
  accessory: 'Accessories',
}

export const PARTS = [
  // ── Dock modules ──────────────────────────────────────────────────────
  {
    id: 'module-4x6', category: 'module', name: "PolyDock 4' x 6' Section", sku: '1022946', color: 'Tan',
    dimensions: { lengthIn: 72.75, widthIn: 50.875, heightIn: 16, nominalEdgesFt: [4, 6] },
    loadCapacityLbs: 1550, weightLbs: 160, priceUsd: 1283, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Rotationally molded HDPE, sandstone brick-pattern deck.',
  },
  {
    id: 'module-3x10', category: 'module', name: "PolyDock 3' x 10' Section", sku: '1022945', color: 'Tan',
    dimensions: { lengthIn: 123.7, widthIn: 36.4, heightIn: 16, nominalEdgesFt: [3, 10] },
    loadCapacityLbs: 1875, weightLbs: 205, priceUsd: 1495, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Weight reported 200-210 lbs across sources; midpoint used.',
  },
  {
    id: 'module-4x10', category: 'module', name: "PolyDock 4' x 10' Section", sku: '1022944', color: 'Tan',
    dimensions: { lengthIn: 123.625, widthIn: 50.875, heightIn: 16, nominalEdgesFt: [4, 10] },
    loadCapacityLbs: 2625, weightLbs: 265, priceUsd: 1969, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Hardware/anchoring sold separately.',
  },
  {
    id: 'module-5x10', category: 'module', name: "PolyDock 5' x 10' Section", sku: '1022948', color: 'Tan',
    dimensions: { lengthIn: 123.7, widthIn: 65.5, heightIn: 16, nominalEdgesFt: [5, 10] },
    loadCapacityLbs: 3375, weightLbs: 332, priceUsd: 2475, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Gray not confirmed for this size. Weight reported 325-340 lbs; midpoint used.',
  },
  {
    id: 'module-6x8', category: 'module', name: "PolyDock 6' x 8' Section", sku: '1022947', color: 'Tan',
    dimensions: { lengthIn: 101.875, widthIn: 72.75, heightIn: 16, nominalEdgesFt: [6, 8] },
    loadCapacityLbs: 3075, weightLbs: 365, priceUsd: 2610, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Weight reported 330-400 lbs across sources; midpoint used.',
  },
  {
    id: 'module-corner-4', category: 'module', name: "PolyDock 4' Corner Section", sku: '1022949', color: 'Tan',
    dimensions: { footprintIn: '50.5 x 50.5, ~71.48 diagonal', heightIn: 16.125, nominalEdgesFt: [4, 4] },
    loadCapacityLbs: 225, weightLbs: 110, priceUsd: 760, priceType: 'dealer_listed', isVerified: false,
    sourceNotes: 'CONTRADICTION: load capacity reported as both 225 and 500 lbs in different sources; 225 (more specific figure) used pending dealer confirmation. Corner edges assumed 4ft/4ft (inferred from naming).',
  },

  // ── Standard (straight) connectors ───────────────────────────────────
  { id: 'connector-straight-1', category: 'connector', name: "PolyDock Connector 1' (standard)", sku: '1007016', color: 'Tan', dimensions: { lengthFt: 1 }, priceUsd: 126, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'shopshoremaster.com' },
  { id: 'connector-straight-2', category: 'connector', name: "PolyDock Connector 2' (standard)", sku: null, dimensions: { lengthFt: 2 }, priceUsd: null, priceType: 'unverified', isVerified: false, sourceNotes: 'Length inferred from the notched-connector list; not independently confirmed as an available standard-length SKU.' },
  { id: 'connector-straight-3', category: 'connector', name: "PolyDock Connector 3' (standard)", sku: '1020827', color: 'Tan', dimensions: { lengthFt: 3 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-straight-4', category: 'connector', name: "PolyDock Connector 4' (standard)", sku: '1006624', color: 'Tan', dimensions: { lengthFt: 4 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-straight-5', category: 'connector', name: "PolyDock Connector 5' (standard)", sku: '1020829', color: 'Tan', dimensions: { lengthFt: 5 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-straight-6', category: 'connector', name: "PolyDock Connector 6' (standard)", sku: '1004212', color: 'Tan', dimensions: { lengthFt: 6 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-straight-8', category: 'connector', name: "PolyDock Connector 8' (standard)", sku: '1006622', color: 'Tan', dimensions: { lengthFt: 8 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-straight-10', category: 'connector', name: "PolyDock Connector 10' (standard)", sku: '1006638', color: 'Tan', dimensions: { lengthFt: 10 }, priceUsd: 664, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF; shopshoremaster.com for pricing.' },

  // ── Notched connectors (T/L/cross junctions) ─────────────────────────
  { id: 'connector-notched-2', category: 'connector', name: "PolyDock Notched Connector 2'", sku: '1003472', color: 'Tan', dimensions: { lengthFt: 2 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-notched-3', category: 'connector', name: "PolyDock Notched Connector 3'", sku: '1026433', color: 'Tan', dimensions: { lengthFt: 3 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-notched-4', category: 'connector', name: "PolyDock Notched Connector 4'", sku: '1003441', color: 'Tan', dimensions: { lengthFt: 4 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-notched-5', category: 'connector', name: "PolyDock Notched Connector 5'", sku: '1024129', color: 'Tan', dimensions: { lengthFt: 5 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  { id: 'connector-notched-6', category: 'connector', name: "PolyDock Notched Connector 6'", sku: '1004271', color: 'Tan', dimensions: { lengthFt: 6 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'PolyDock official assembly instructions PDF.' },
  {
    id: 'connector-notched-8', category: 'connector', name: "PolyDock Notched Connector 8'", sku: '1003453', color: 'Tan', dimensions: { lengthFt: 8 }, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: "PolyDock official assembly instructions PDF. GAP: no 10' notched connector exists in any source — a 10ft-long junction seam has no direct match; see feature-connector-matching.md.",
  },

  // ── Unverified / marketing-only connector items (excluded from matching rules) ─
  {
    id: 'connector-flexible-hinge', category: 'connector', name: 'PolyDock Flexible/Hinge-Style Connector', sku: null, dimensions: {}, isVerified: false, priceType: 'unverified',
    sourceNotes: "Appears only in marketing copy, not in the manufacturer's own assembly-instructions PDF. Actual corners use the dedicated 4' Corner module, not a hinge connector. Excluded from connector-matching rules until confirmed.",
  },
  {
    id: 'connector-heavy-duty', category: 'connector', name: 'PolyDock Heavy-Duty Connector', sku: null, dimensions: {}, isVerified: false, priceType: 'unverified',
    sourceNotes: 'Appears only in marketing copy. No SKU found in the manufacturer’s assembly-instructions PDF. Possibly conflates with the 316-stainless Poly Connector Rod upgrade. Excluded from connector-matching rules until confirmed.',
  },

  // ── Accessories ───────────────────────────────────────────────────────
  { id: 'accessory-dock-cleat-8', category: 'accessory', name: 'PolyDock 8" Dock Cleat', sku: '1006632-08', dimensions: { lengthIn: 8 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'shopshoremaster.com / boatliftanddock.com. NOTE: base SKU number overlaps with the unrelated 8" Pile Hoop (1006632) — do not use "1006632" alone as a unique key.' },
  { id: 'accessory-vertical-bumper', category: 'accessory', name: 'PolyDock Vertical Dock Bumper', sku: null, dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'boatliftanddock.com. Requires a separately-sold PolyDock Connection Bracket. Colors: Black, Blue, Tan, Gray, White.' },
  { id: 'accessory-ladder-3step', category: 'accessory', name: 'PolyDock Pivoting Dock Ladder (3-Step)', sku: '1006669', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'All-aluminum, pivots vertically. Requires the Ladder Connector kit.' },
  { id: 'accessory-ladder-4step', category: 'accessory', name: 'PolyDock Pivoting Dock Ladder (4-Step)', sku: '1006670', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'All-aluminum, pivots vertically. Requires the Ladder Connector kit.' },
  { id: 'accessory-ladder-5step', category: 'accessory', name: 'PolyDock Pivoting Dock Ladder (5-Step)', sku: '1006671', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'All-aluminum, pivots vertically. Requires the Ladder Connector kit.' },
  { id: 'accessory-ladder-connector', category: 'accessory', name: 'PolyDock Ladder Connector (mounting kit)', sku: '1006674', dimensions: {}, priceUsd: 82, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Required to attach the Pivoting Dock Ladder to a section.' },
  { id: 'accessory-plate-6', category: 'accessory', name: 'PolyDock 6" Accessory Connection Plate', sku: '1006608', dimensions: { lengthIn: 6 }, priceUsd: 82, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'boatliftanddock.com. Mounts lighter accessories.' },
  { id: 'accessory-plate-21', category: 'accessory', name: 'PolyDock 21" Accessory Connection Plate', sku: '1006615', dimensions: { lengthIn: 21 }, priceUsd: 292, priceType: 'dealer_listed', isVerified: false, sourceNotes: 'SKU inconsistency across sources (also seen as dealer product ID 1116) — flagged, not resolved.' },
  { id: 'accessory-wheel-caddy', category: 'accessory', name: 'PolyDock Wheel Caddy', sku: '1006642', dimensions: { groundClearanceIn: 9, tireSizeIn: 24, axleBoreIn: 2 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Poly tires and dock section sold separately. Compatible with PolyDock and Rhino Dock sections.' },
  { id: 'accessory-pile-hoop-8', category: 'accessory', name: 'PolyDock 8" Pile Hoop', sku: '1006632', dimensions: { diameterIn: 8 }, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Roller system reduces friction against the pile.' },
  { id: 'accessory-pile-hoop-10', category: 'accessory', name: 'PolyDock 10" Pile Hoop', sku: '1006633', dimensions: { diameterIn: 10 }, priceUsd: 670, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'boatliftanddock.com.' },
  { id: 'accessory-pile-hoop-12', category: 'accessory', name: 'PolyDock 12" Pile Hoop', sku: '1006634', dimensions: { diameterIn: 12 }, priceUsd: 700, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'boatliftanddock.com.' },
  { id: 'accessory-pipe-bracket-large', category: 'accessory', name: 'PolyDock Large Poly Pipe Bracket', sku: '6088', dimensions: { pipeOdIn: 2 }, priceUsd: 354, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'For 2" OD galvanized pipe; heavy-duty, high water-fluctuation sites.' },
  { id: 'accessory-pipe-bracket-light', category: 'accessory', name: 'PolyDock Light/Medium Duty Poly Pipe Bracket', sku: '1101', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'For calm water, lower anchoring loads.' },
  { id: 'accessory-chain-anchor-plate', category: 'accessory', name: 'PolyDock Chain Anchor Plate', sku: '1006619', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Connects via the 6" Accessory Connection Plate.' },
  { id: 'accessory-chain-guide-bracket', category: 'accessory', name: 'PolyDock Chain Guide Bracket', sku: '1103', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Used with Chain Anchor Plate for heavy-duty moorings.' },
  { id: 'accessory-stiff-arm-light', category: 'accessory', name: 'ShoreMaster Stiff-Arm (Light Duty)', sku: '1105', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'For docks parallel to shore where piles/chains aren’t practical.' },
  { id: 'accessory-stiff-arm-heavy', category: 'accessory', name: 'ShoreMaster Stiff-Arm (Heavy Duty)', sku: '1106', dimensions: {}, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'For docks parallel to shore where piles/chains aren’t practical.' },
  { id: 'accessory-connector-rod-composite', category: 'accessory', name: 'Connector Rod (composite, spare part)', sku: '1074640', dimensions: { lengthIn: 13.875 }, priceUsd: 36, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'Standard internal rod for every connector’s clamp assembly.' },
  { id: 'accessory-connector-rod-stainless', category: 'accessory', name: 'Poly Connector Rod, 316 Stainless Steel (upgrade)', sku: '1015919', dimensions: { lengthIn: 13.875 }, priceUsd: 105, priceType: 'dealer_listed', isVerified: true, sourceNotes: 'All-metal upgrade over the standard composite connector rod.' },

  // ── Gangways & Ramps (walkable spans, placeable on the canvas) ────────
  // Researched separately from the original catalog pass — see
  // staging/stage-3-design-canvas/feature-gangways.md. Sources:
  // polydockproducts.com/dock-systems/ramps-gangways/, PolyDock's own
  // assembly-instructions PDF (accessories index confirms these sizes as
  // real catalog items), and dealer boatliftanddock.com for SKUs/pricing.
  // dimensions.nominalEdgesFt makes these behave like modules (true-scale,
  // snappable to a dock module's edge) — see geometry.js's hasFootprint.
  {
    id: 'gangway-16ft', category: 'gangway', name: "ShoreMaster 4' x 16' Residential Gangway", sku: '1003960',
    dimensions: { nominalEdgesFt: [16, 4] }, priceUsd: 3425, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com. Frame + handrails only; decking sold separately (9 ShoreMaster decking options). Ships LTL freight. Pivots at the dock end via a dedicated hinge (see accessory-gangway-to-polydock-hinge); the shore end rests/floats freely.',
  },
  {
    id: 'gangway-20ft', category: 'gangway', name: "ShoreMaster 4' x 20' Residential Gangway", sku: '1003961',
    dimensions: { nominalEdgesFt: [20, 4] }, priceUsd: 4586, priceType: 'dealer_listed', isVerified: false,
    sourceNotes: 'Name/price confirmed on dealer catalog; SKU inferred by sequence from the 16ft/24ft SKUs, not independently re-verified. Requires local pickup/delivery only (not LTL shippable).',
  },
  {
    id: 'gangway-24ft', category: 'gangway', name: "ShoreMaster 4' x 24' Residential Gangway", sku: '1003962',
    dimensions: { nominalEdgesFt: [24, 4] }, priceUsd: 5264, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com, SKU confirmed via direct product page. Requires local pickup/delivery only (not LTL shippable).',
  },
  {
    id: 'ramp-4ft', category: 'gangway', name: "ShoreMaster/PolyDock 4' Aluminum Ramp", sku: null,
    dimensions: { nominalEdgesFt: [4, 4] }, priceUsd: 448, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: "boatliftanddock.com (dealer product id 1128; underlying manufacturer SKU not separately confirmed). Frame only; decking + PolyDock ramp connector hardware sold separately. Manufacturer's own assembly-instructions PDF accessories index corroborates a '4' or 8' Ramp' as a real catalog item.",
  },
  {
    id: 'ramp-8ft', category: 'gangway', name: "ShoreMaster 4' x 8' Aluminum Ramp", sku: '1006677',
    dimensions: { nominalEdgesFt: [8, 4] }, priceUsd: 846, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: 'boatliftanddock.com, SKU confirmed via direct product page. Decking sold separately ($480-1080 depending on material). Compatible with PolyDock via the separate 4ft Ramp Connector kit.',
  },
  {
    id: 'ramp-6x8ft', category: 'gangway', name: "ShoreMaster/PolyDock 6' x 8' Aluminum Ramp", sku: null,
    dimensions: { nominalEdgesFt: [8, 6] }, priceUsd: null, priceType: 'unverified', isVerified: false,
    sourceNotes: "Existence and size (6'x8') confirmed by PolyDock's own official assembly-instructions PDF accessories index — a higher-confidence source than marketing copy — but no dealer SKU or price was found in this research pass.",
  },

  // ── Gangway/ramp hinge hardware & water-end support (point accessories) ─
  {
    id: 'accessory-ramp-connector-4ft', category: 'accessory', name: "PolyDock 4' Ramp Connector", sku: '1006610',
    dimensions: {}, priceUsd: 272, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: "boatliftanddock.com. Pivoting aluminum hardware joining a 4ft-wide ramp to a PolyDock section (4'x10', 4'x6', 5'x10', or 6'x8'); bolts to the ramp's side stringer, secures to the section's outside channel, and lets the ramp's slope adjust with water level — directly analogous to the Ladder Connector kit.",
  },
  {
    id: 'accessory-ramp-connector-6ft', category: 'accessory', name: "PolyDock 6' Ramp Connector", sku: null,
    dimensions: {}, priceUsd: 340, priceType: 'dealer_listed', isVerified: false,
    sourceNotes: 'Same function as the 4ft Ramp Connector, sized for 6ft ramps/sections. Found via a dealer category page, not a direct individual product page — SKU not independently confirmed.',
  },
  {
    id: 'accessory-double-hinge-assembly', category: 'accessory', name: 'PolyDock Double Hinge Assembly', sku: '1006645',
    dimensions: {}, priceUsd: 602, priceType: 'dealer_listed', isVerified: true,
    sourceNotes: "boatliftanddock.com, explicitly 'Designed to Fit: PolyDock Section.' A second, heavier-duty dedicated PolyDock hinge/connector beyond the basic Ramp Connector — not confirmed whether it's gangway-specific or general dock-section hardware.",
  },
  {
    id: 'accessory-gangway-to-polydock-hinge', category: 'accessory', name: 'ShoreMaster Gangway-to-PolyDock Dock Hinge', sku: null,
    dimensions: {}, priceUsd: 497.5, priceType: 'unverified', isVerified: false,
    sourceNotes: 'Dedicated hinge connecting a ShoreMaster Residential Gangway (16/20/24ft) to a PolyDock section, distinct from the shorter Ramp Connectors. Price varied $485-510 across two sources (497.50 is the simple midpoint, not confirmed); product-page ID was inconsistent across sources too.',
  },
  {
    id: 'accessory-gangway-roller-kit', category: 'accessory', name: 'ShoreMaster Gangway Bolt-on Roller Kit', sku: '1006581',
    dimensions: {}, priceUsd: 235.5, priceType: 'unverified', isVerified: false,
    sourceNotes: 'Supports the water/shore end of a gangway with rollers instead of a fixed hinge. Price range reported as $229-242; 235.50 is the simple midpoint, not independently confirmed.',
  },
  {
    id: 'accessory-gangway-float-cradle', category: 'accessory', name: 'ShoreMaster Float Cradle for Gangway', sku: null,
    dimensions: {}, priceUsd: 488, priceType: 'unverified', isVerified: false,
    sourceNotes: 'Provides water-end flotation support for long gangways. SKU not captured; price not independently re-verified.',
  },
  {
    id: 'accessory-gangway-float-module', category: 'accessory', name: 'ShoreMaster 2\' x 4\' x 12" Float', sku: null,
    dimensions: { lengthIn: 48, widthIn: 24, heightIn: 12 }, priceUsd: 228, priceType: 'unverified', isVerified: false,
    sourceNotes: 'Small flotation module for water-end support of long gangways, distinct from full PolyDock floating dock sections. SKU not captured; price not independently re-verified.',
  },
]

// Connector-matching rules for Stage 4: edge length + junction type -> connector part id.
// Only covers lengths actually needed by the modules above (see feature-connector-matching.md).
// No 10' notched connector exists in any source — a 10ft junction seam has no rule and must
// be handled explicitly by the future matching engine, not silently guessed here.
export const CONNECTOR_RULES = [
  { edgeLengthFt: 3, junctionType: 'straight', connectorPartId: 'connector-straight-3' },
  { edgeLengthFt: 4, junctionType: 'straight', connectorPartId: 'connector-straight-4' },
  { edgeLengthFt: 5, junctionType: 'straight', connectorPartId: 'connector-straight-5' },
  { edgeLengthFt: 6, junctionType: 'straight', connectorPartId: 'connector-straight-6' },
  { edgeLengthFt: 8, junctionType: 'straight', connectorPartId: 'connector-straight-8' },
  { edgeLengthFt: 10, junctionType: 'straight', connectorPartId: 'connector-straight-10' },
  { edgeLengthFt: 3, junctionType: 'notched', connectorPartId: 'connector-notched-3' },
  { edgeLengthFt: 4, junctionType: 'notched', connectorPartId: 'connector-notched-4' },
  { edgeLengthFt: 5, junctionType: 'notched', connectorPartId: 'connector-notched-5' },
  { edgeLengthFt: 6, junctionType: 'notched', connectorPartId: 'connector-notched-6' },
  { edgeLengthFt: 8, junctionType: 'notched', connectorPartId: 'connector-notched-8' },
]

// Stage 4: maps each gangway/ramp catalog item to the dedicated hinge/
// connector hardware its dock-end attachment seam requires (see
// staging/stage-3-design-canvas/feature-gangways.md's open question — this
// selection is inferred from each part's own sourceNotes above, not
// independently confirmed against a manufacturer install guide: width-4ft
// ramps use the 4ft Ramp Connector, the width-6ft ramp uses the 6ft Ramp
// Connector, and the ShoreMaster "Residential Gangway" line uses its own
// dedicated hinge rather than a Ramp Connector). A gangway/ramp with no
// entry here is a real data gap, not committable silently — see bom.js.
export const GANGWAY_ATTACHMENT_RULES = {
  'gangway-16ft': 'accessory-gangway-to-polydock-hinge',
  'gangway-20ft': 'accessory-gangway-to-polydock-hinge',
  'gangway-24ft': 'accessory-gangway-to-polydock-hinge',
  'ramp-4ft': 'accessory-ramp-connector-4ft',
  'ramp-8ft': 'accessory-ramp-connector-4ft',
  'ramp-6x8ft': 'accessory-ramp-connector-6ft',
}
