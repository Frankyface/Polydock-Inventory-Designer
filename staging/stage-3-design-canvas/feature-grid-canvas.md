# Feature — Grid Canvas

The base canvas: a scrollable/zoomable 2D grid plus a palette of catalog modules to drag from.

## Open Questions

- Grid unit — snap to real feet/inches, or an abstract grid cell sized to the smallest module dimension? Real-world units are more intuitive but need careful scaling for the smallest (4'x6') vs. largest (6'x8') modules to both render sensibly.
- Should the palette show only modules (with connectors auto-added by the matching logic in Stage 4), or also let a user manually drop a specific connector? Current plan (per `docs/master_plan.md`) is auto-only, but worth confirming once the canvas is real and not just a plan.
