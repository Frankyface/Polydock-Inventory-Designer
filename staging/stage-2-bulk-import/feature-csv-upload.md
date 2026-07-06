# Feature — CSV Upload

Client-side CSV parsing (there's no backend at all — see `docs/master_plan.md`) that matches rows to entries in `src/data/partsCatalog.js` and writes quantities into the same localStorage-backed inventory state Stage 1 uses (`useLocalInventory`).

## Scope for v1

- Expected columns: something like `sku, quantity` (exact format TBD — see open questions).
- Preview step before committing: show matched parts + new quantities, and flag unmatched rows.
- Reuses the same inventory-write path as manual entry (Stage 1) rather than a separate import-specific write.

## Open Questions

- What column format will the business actually export from wherever they currently jot down counts (a spreadsheet, per the interview)? Unknown until we see a real example — ask for a sample file before finalizing the parser's expected columns.
- Match by SKU, by name, or allow either? Given the catalog's known SKU inconsistencies (see `staging/stage-1-foundation/feature-local-catalog-data.md`), matching by SKU alone may be fragile — probably need a fallback fuzzy-match-by-name with manual confirmation for anything ambiguous.
- Full replace ("this CSV is the new truth") vs. additive delta import — needs a decision before building the preview UI, since it changes what "preview" even shows.
