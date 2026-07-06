# Feature — Connector Matching

The core business-logic engine: given a seam between two (or more) modules, determine the correct connector part.

## Confirmed rule (from user + manufacturer research)

1. **Straight seam (2 modules meet along one edge):** pick the standard connector whose length matches the seam's length exactly (e.g. a 10' edge → the 10' standard connector).
2. **Junction seam (3+ modules meet at a point — T/L/cross layouts):** pick the notched connector of matching length instead of the standard one.
3. **Corners (90° turns):** not a connector decision at all — the layout must use a dedicated Corner float module; the corner module's own seams then follow rules 1–2 like any other module.

## Open Questions

- What happens when a seam's exact length has no matching connector SKU in the catalog (e.g. an odd combination the manufacturer doesn't sell a connector for)? Block the seam, or fall back to the nearest available length with a visible warning? Needs a decision before this feature is buildable, and probably needs the actual canvas (Stage 3) built first to know how often this even comes up.
- Rod-count-per-connector-length isn't in the manufacturer data (flagged as inferred/unconfirmed in `feature-catalog-seed.md`) — does the BOM need rod-level granularity at all, or is "1 connector part = done" sufficient for v1's parts list? Leaning toward the latter (connectors are the seed-data unit; rods are internal to a connector, not separately stocked in v1).
- The two unverified "connector" catalog items (Flexible/Hinge-Style, Heavy-Duty) must be excluded from this matching engine's candidate set until confirmed real — don't let them silently become selectable.
