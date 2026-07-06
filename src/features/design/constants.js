// One-time tuning constants for the design canvas. See
// staging/stage-3-design-canvas/feature-grid-canvas.md and
// feature-module-snapping.md's open questions — these are starting values,
// not yet validated against real interactive use.

export const PIXELS_PER_FOOT = 24
export const CANVAS_WIDTH_FT = 60
export const CANVAS_HEIGHT_FT = 40

// How close (in feet) a dragged module's edge must be to another module's
// edge to snap flush against it.
export const SNAP_TOLERANCE_FT = 1

// Rotation is 90°-increment only — real dock layouts are axis-aligned
// (T/L/U shapes per the manufacturer's own diagrams), so free rotation
// would add complexity with no real benefit.
export const ROTATION_STEPS = [0, 90, 180, 270]
