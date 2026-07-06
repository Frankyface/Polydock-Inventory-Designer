# Feature — Commit to Inventory

Finalizing a design so its BOM is actually reserved/deducted from inventory — confirmed as a required v1 feature (both read-only check AND commit/deduct ship together, not staged). Inventory here is the same localStorage-backed state from Stage 1 — no database, no server (see `docs/master_plan.md`).

## Open Questions

- "Reserve" then separately "deduct on build-complete," or a single "commit = deduct immediately"? A two-phase reserve→deduct flow would need its own localStorage-tracked "reserved" quantity alongside on-hand — not yet confirmed against how the business actually tracks a build in progress; worth revisiting with the user once this stage starts.
- What does "release a committed design" mean exactly — full cancellation only, or partial release (e.g. some modules were actually installed, others weren't)? Full-cancel-only is simpler for v1; partial release is more realistic to how a build might actually go.
- Needs to update localStorage atomically (read-modify-write the whole quantities map in one `setState` call) — must not be possible to end up with some parts deducted and others not, e.g. from two commits racing in the same tab.
- Since inventory is per-browser (no shared backend), a design "committed" on one device doesn't affect stock as seen on another device at all — this is the same per-device tradeoff noted throughout, but worth restating here since commit/deduct is exactly the feature where "shared reality" would matter most.
