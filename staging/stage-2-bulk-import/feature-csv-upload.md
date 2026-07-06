# Feature — CSV Upload

Client-side CSV parsing (there's no backend at all — see `docs/master_plan.md`) that matches rows to entries in `src/data/partsCatalog.js` and writes quantities into the same localStorage-backed inventory state Stage 1 uses (`useLocalInventory`). **Done** — `src/features/inventory/csvParser.js`, `matchImportRows.js`, `CsvImportPanel.jsx`.

## How it works

- Header detection is regex-based, guessing at column names (`sku`/`part id`/`id`, `quantity`/`qty`/`on hand`/`count`/`stock`, `name`/`part name`/`description`) since no real export file from the business has been seen yet.
- Matching tries SKU/id first (exact, case-insensitive), then name: an exact normalized match first, falling back to an unambiguous substring match (accepted only if exactly one catalog part qualifies — an ambiguous match is never guessed, it's left unmatched with a reason).
- Quantities must be a clean whole-number string (`/^\d+$/` after trim) — a value like `"12.5"` or `"12abc"` is rejected as invalid rather than silently truncated.
- Preview shows a "will update N parts" table and a "couldn't be imported" table with a reason per row — nothing is silently dropped.
- Applying an import calls `applyBulkQuantities`, which merges into the existing inventory in one state update (doesn't touch parts absent from the CSV).

## Decisions resolved during implementation (were open questions)

- **Full replace vs. additive delta:** resolved as **additive delta** — importing a CSV only touches the parts actually present in it; every other part's on-hand count is left untouched. This was picked for simplicity and because it matches how manual entry already works, but it means uploading a partial recount CSV will NOT zero out or flag parts you meant to include but forgot — worth revisiting if the business's actual workflow is "this file is my complete current count," not a partial update.
- **SKU vs. name matching:** both, with name matching as a fallback (see "How it works" above) — a scoped, safe fuzzy fallback was added (unambiguous substring match) rather than the fuller "manual confirmation for ambiguous matches" UI originally floated, since no real spreadsheet export has been seen yet to know how much fuzziness is actually needed.

## Open Questions

- What column format will the business actually export from wherever they currently jot down counts (a spreadsheet, per the interview)? Still unknown — the regex header-guessing is a v1 placeholder; ask for a real sample file and adjust the patterns in `matchImportRows.js` once one exists. If a real file has headers the current patterns don't anticipate, every row in that file will land in "no quantity column found" rather than partially working — worth testing against a real file sooner rather than later.
- Should there be a manual-confirmation UI for ambiguous name matches (multiple substring candidates), rather than just leaving them unmatched? Deferred until real-world data shows how often this actually comes up.
