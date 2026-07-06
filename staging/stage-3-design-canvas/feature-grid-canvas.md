# Feature — Grid Canvas

The base canvas: an SVG grid plus a palette of catalog parts to add from. **Done** — `src/features/design/DesignCanvas.jsx`, `GridLines.jsx`, `Palette.jsx`.

## How it works

- Grid unit resolved as **real feet**, rendered at a fixed `PIXELS_PER_FOOT` scale (`constants.js`) — modules render at true relative size to each other.
- Palette shows **modules, gangways, and accessories** (see `feature-accessory-placement.md` and `feature-gangways.md`) — connectors are auto-calculated by Stage 4's matching logic, not manually placed.
- Clicking a palette item adds an instance at a staggered default position; the user drags it into place (no native drag-and-drop from the palette — simpler to implement and test than full HTML5 DnD, and works just as well since the item still needs a follow-up drag to actually position/snap it).

## Open Questions

- No pan/zoom yet — the canvas is a fixed `CANVAS_WIDTH_FT` × `CANVAS_HEIGHT_FT` scrollable box. Fine for the design sizes tested so far; revisit if real designs need a larger area than fits comfortably.
