# Feature — Background Image

Lets staff upload a photo (e.g. a Google Maps satellite screenshot of the lakefront) and use it as a background reference behind the grid, so the design can be visually aligned to the real property. **Done** — `src/features/design/imageUtils.js`, `DesignCanvas.jsx`, `DesignEditor.jsx`.

Added after the initial Stage 3 build, per explicit user request.

## How it works

- **Upload & compression**: the file is drawn onto an offscreen `<canvas>`, downscaled to a max 1600px dimension, and re-encoded as JPEG (quality 0.82) before being stored — a raw phone photo can be several MB, which would eat most of a browser's localStorage quota for one design's background alone (`imageUtils.js`).
- **Storage**: the compressed data URL, plus `x`/`y` (ft), `scale`, and `opacity`, are stored as `design.backgroundImage` — included in the save payload and the dirty-check on Back, same as everything else in a design.
- **Rendering**: an SVG `<image>` behind the grid and modules, sized from `DEFAULT_BACKGROUND_WIDTH_FT * scale` with the image's own aspect ratio preserved.
- **Positioning**: a "Position background" toggle in the toolbar. While active, an invisible full-canvas `<rect>` captures pointer drags and moves the background image directly (no snapping — free 1:1 drag) instead of module dragging; while inactive, the background is inert and normal module interaction applies. Scale and opacity are plain range sliders (no drag-to-resize gesture — simpler and avoids conflicting with the position-drag interaction).

## Open Questions

- No rotation for the background image (only position/scale/opacity) — satellite photos are usually already north-up, and this keeps the control set simple. Revisit if real use shows rotation is actually needed.
- No compression-quality control exposed to the user — if 1600px/JPEG-0.82 turns out too lossy for reading fine lakefront detail, this may need to become configurable, or scale to canvas size dynamically instead of a fixed max dimension.
- One background image per design, replacing entirely on re-upload — no multi-image/layering support, which seems like the right scope for v1.
