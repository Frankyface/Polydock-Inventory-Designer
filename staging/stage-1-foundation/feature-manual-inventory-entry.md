# Feature — Manual Inventory Entry

Tabbed UI for browsing the bundled parts catalog and manually setting/adjusting stock counts, persisted to the browser's `localStorage`. **Done** — `src/features/inventory/CatalogInventoryView.jsx`, `CategoryTabs.jsx`, `PartRow.jsx`, `useLocalInventory.js`.

## How it works

- `CategoryTabs` switches between the three categories (Dock Modules / Connectors / Accessories) — only one category's table renders at a time.
- `useLocalInventory` reads/writes a `{ [partId]: quantity }` map under the `polydock:inventory:v1` localStorage key, merged onto the static `PARTS` catalog for display.
- `PartRow` holds a local "draft" quantity while the user is editing, committing (validating ≥ 0 integer) on blur; it resyncs to the underlying value if changed from outside (e.g. another tab) without clobbering an in-progress edit.
- `isVerified: false` catalog items show a visible "unconfirmed" badge.

## Known limitation (accepted for v1)

Inventory is per-browser — there is no sync across devices or even across two tabs of the same browser until a reload. See `docs/master_plan.md`'s Open Questions & Risks.

## Open Questions

- Absolute "set to N" (current behavior) vs. "+/- delta" entry — set-to-N is simpler and was chosen for v1, but loses an audit trail of who/when changed what. An `inventory_adjustments` log is easy to add later (would just be another localStorage array) if that history turns out to matter.
- Should low-stock get any visual treatment in v1 (e.g. a threshold-based warning color), or is that premature before the stock-check feature in Stage 4 exists?
