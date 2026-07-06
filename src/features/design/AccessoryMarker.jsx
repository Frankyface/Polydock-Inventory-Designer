import { PIXELS_PER_FOOT } from './constants.js'

// Accessories (cleats, bumpers, ladders, etc.) are small attachment points,
// not floor tiles — they're placed freely (no snapping, no seam
// participation), rendered as a small marker rather than a true-to-scale
// rectangle. See staging/stage-3-design-canvas/feature-accessory-placement.md.
const MARKER_RADIUS_FT = 0.75

export function AccessoryMarker({ part, x, y, isSelected, onPointerDown }) {
  const label = part.name.replace('PolyDock ', '')
  const radius = MARKER_RADIUS_FT * PIXELS_PER_FOOT

  return (
    <g
      transform={`translate(${x * PIXELS_PER_FOOT}, ${y * PIXELS_PER_FOOT})`}
      onPointerDown={onPointerDown}
      className="placed-module placed-accessory"
    >
      <circle
        r={radius}
        fill={isSelected ? '#f5d7bc' : '#f0e4db'}
        stroke={isSelected ? '#b0602b' : '#a68b6f'}
        strokeWidth={isSelected ? 2 : 1}
      />
      <text x={0} y={radius + 12} fontSize={10} fill="#1a2733" textAnchor="middle">
        {label}
      </text>
    </g>
  )
}
