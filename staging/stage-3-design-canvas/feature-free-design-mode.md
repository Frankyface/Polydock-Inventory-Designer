# Feature — Free Design Mode

A design-tool mode that ignores real inventory entirely, for concept/exploration work — confirmed as a required v1 feature during planning (not staged out).

## Open Questions

- Is free-design a per-design toggle (any design can be flagged free vs. stock-checked), or a completely separate area of the app? Current schema plan (`designs.is_free_design`) assumes a per-design flag — confirm this is flexible enough once Stage 4's stock-check UI exists.
- Can a free design later be "promoted" into a real, stock-checked/committed design, or does it stay free-design forever once created? Affects whether `is_free_design` needs to be mutable after creation.
