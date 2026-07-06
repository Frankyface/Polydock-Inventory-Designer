# Feature — Stock Check

Live comparison of a design's computed BOM against real `inventory` quantities, surfaced as a clear "OK" / "Short by X" indicator per part. **Done** — `DesignEditor.jsx`'s `stockedBomLines`/`isBuildable`, rendered by `BomPanel.jsx`.

## Resolved

- **Per-part vs. overall indicator:** both, as originally leaning — `BomPanel.jsx` shows an "OK"/"Short by X" status per line, and `DesignEditor.jsx`'s `isBuildable` (every line's shortfall is 0, and no unresolved seams) gates the Commit button as the overall buildable/not-buildable flag.
- **Free designs:** confirmed to skip the stock check entirely (matches the original "free design ignores stock" decision) — `BomPanel.jsx` still shows the parts list for reference, just without On Hand/Status columns or a Commit button.

## Open Questions (real limitation, not yet solved)

- **The `quantity_reserved` concern was correct, and is still unsolved.** The stock check only ever compares against raw `quantityOnHand` from `useLocalInventory` — there is no concept of "already spoken for by another committed-but-different design." Since commit deducts from the shared on-hand pool immediately (see `feature-commit-inventory.md`), two *different* designs that both need the same part can each independently show "buildable" right up until the first one actually commits; the second design's stock check only reflects reality after that commit lands and its own BOM/stock recomputes. This is a real gap for a shop juggling multiple in-progress designs at once, not just a per-tab race — solving it properly would mean either a real reservation system (a `quantityReserved` field, decremented only on actual build-complete) or accepting "commit order is first-come-first-served, check again before ordering parts" as the working model. Revisit if multiple concurrent designs against the same limited stock becomes a real workflow, rather than engineering it speculatively now.
- **Cross-tab/multi-window staleness:** `useLocalInventory` reads localStorage once on mount and doesn't listen for the browser's `storage` event, so if the app is open in two tabs, one tab's commit doesn't refresh the other tab's view of on-hand stock until it's reloaded. Low-probability for a single staff member's normal workflow, but a real gap if the app is ever left open in multiple tabs/windows on the same device.
