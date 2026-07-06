# Feature — Free Design Mode

A design-tool mode that ignores real inventory entirely, for concept/exploration work. **Done** — a per-design checkbox (`isFreeDesign`) in `DesignEditor.jsx`, saved with the design.

Resolved as a **per-design toggle**, not a separate app area — matches the original schema-era plan and needed no rework once the canvas was real.

## Open Questions

- Can a free design later be "promoted" into a real, stock-checked/committed design? Not yet needed — `isFreeDesign` is just a mutable field on the design record, so toggling it is already trivial; the real question is what Stage 4's stock-check UI does differently when it's on, which isn't built yet.
