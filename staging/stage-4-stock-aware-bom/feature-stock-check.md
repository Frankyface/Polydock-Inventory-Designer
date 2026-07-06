# Feature — Stock Check

Live comparison of a design's computed BOM against real `inventory` quantities, surfaced as a clear "you have enough" / "short by X" indicator.

## Open Questions

- Does the stock check need to account for quantities already reserved by *other* in-progress (committed but not released) designs, or just raw `quantity_on_hand`? Almost certainly the former (that's the whole point of `quantity_reserved` in the schema plan) — confirm once Stage 1's inventory table is real and populated.
- Per-part shortfall display vs. an overall "buildable / not buildable" flag — probably both (overall flag for a quick glance, per-part breakdown for detail), but not decided.
