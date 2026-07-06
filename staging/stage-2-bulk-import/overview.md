# Stage 2 — Bulk Import

## Goal

Let staff set many inventory counts at once via a spreadsheet/CSV upload, instead of clicking through the manual entry UI from Stage 1 one part at a time. **Done.**

## Features in this stage

- `feature-csv-upload.md` — CSV upload, parse, match to catalog parts, preview + confirm before writing.

## Definition of done

- [x] A user can upload a CSV and see a preview of what will change before committing.
- [x] Unrecognized rows (no matching catalog part) are surfaced clearly, not silently dropped.
- [x] Committing an import updates localStorage inventory the same way manual entry does (calls `applyBulkQuantities` from `useLocalInventory` — one state update, no parallel write path).
